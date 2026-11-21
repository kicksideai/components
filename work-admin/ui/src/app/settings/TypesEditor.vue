<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { Icon } from '@iconify/vue'
import DefinitionRow from './DefinitionRow.vue'
import DefinitionList from './DefinitionList.vue'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import ToggleSwitch from 'primevue/toggleswitch'
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import type { Declaration, ItemType } from '../../types'
import { fieldTitle, humanize } from '../../forms'
import { removeEntry, type RemovalGuard, type SchemaChange, changeReason } from './model'
import ChipPicker from './ChipPicker.vue'
const props = defineProps<{ draft: Declaration; guardRemoval?: RemovalGuard; issues?: SchemaChange[] }>()
const types = computed(() => props.draft.item_types ?? [])
const id = ref(''), error = ref(''), removing = ref('')
const base = computed(() => id.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40))
const valid = computed(() => !!id.value.trim())
function newId() {
  const stem = /^[a-z]/.test(base.value) ? base.value : 'type_' + (base.value || 'new')
  let key = stem.slice(0, 40), suffix = 2
  while (types.value.some(type => type.id === key)) {
    const ending = '_' + suffix++
    key = stem.slice(0, 40 - ending.length) + ending
  }
  return key
}
function add() { if (!valid.value) return; (props.draft.item_types ??= []).push({ id: newId(), title: id.value.trim(), process: props.draft.processes?.[0]?.id ?? '', fields: [] }); id.value = '' }
function rename(type: ItemType, id: string) {
  const before = type.id
  type.id = id
  for (const other of types.value) if (other.parent_types) other.parent_types = other.parent_types.map(value => value === before ? id : value)
}
function setFields(type: ItemType, fields: string[]) { type.fields = fields; if (type.inherit) type.inherit = type.inherit.filter(code => fields.includes(code)) }
function parentTypes(type: ItemType) {
  return (type.parent_types ?? []).filter((id): id is string => typeof id === 'string')
}
function setParents(type: ItemType, parents: string[], allowTopLevel: boolean) {
  type.parent_types = allowTopLevel && parents.length ? [...parents, false] : parents
}
function usedBy(type: ItemType) { return types.value.filter(t => t.id !== type.id && t.parent_types?.includes(type.id)).map(t => t.title || humanize(t.id)) }
async function remove(type: ItemType) {
  if (removing.value) return
  if (usedBy(type).length) { error.value = `${type.title || humanize(type.id)} is a parent type for ${usedBy(type).join(', ')}. Remove those parent selections first.`; return }
  removing.value = type.id; error.value = ''
  try { const refusal = await props.guardRemoval?.('item_types', type.id); if (refusal) error.value = refusal; else removeEntry(props.draft, 'item_types', type.id) }
  finally { removing.value = '' }
}
</script>
<template>
  <section class="work-stack" aria-label="Item types editor">
    <p v-if="error" class="kx-err" role="alert">{{ error }}</p>
    <DefinitionList columns="types" :count="types.length">
    <DefinitionRow :title="type.title || humanize(type.id)" :kind="draft.processes?.find(p => p.id === type.process)?.name || humanize(type.process)" v-for="(type, index) in types" :key="index" class="work-type-card">
      <template #usage><span class="work-definition-meta"><Tag class="kx-tag-sm" severity="secondary">{{ type.fields.length }} {{ type.fields.length === 1 ? 'field' : 'fields' }}</Tag><Tag v-if="usedBy(type).length" class="kx-tag-sm" severity="secondary">Parent of {{ usedBy(type).join(', ') }}</Tag></span></template>
      <p v-for="issue in issues?.filter(i => i.code === 'item_type ' + type.id) ?? []" :key="issue.what" class="work-error work-small" role="alert">{{ changeReason(issue) }}</p><div class="work-settings-grid"><label class="work-stack work-tight">Title<InputText v-model="type.title" :placeholder="humanize(type.id)" /></label><label class="work-stack work-tight">Workflow<Select v-model="type.process" aria-label="Workflow" required appendTo="self" optionLabel="label" optionValue="value" optionDisabled="disabled" :options="[...(draft.processes ?? []).map((process) => ({ label: (process.name || humanize(process.id)), value: process.id, disabled: false }))]" /></label></div>
      <ChipPicker label="Fields" :options="(draft.fields ?? []).map(f => ({ value: f.code, label: fieldTitle(f) }))" :model-value="type.fields" @update:model-value="setFields(type, $event)" />
      <Disclosure class="work-disclosure" label="Advanced item type settings"><div class="work-stack">
        <label class="work-stack work-tight">Identifier<InputText :value="type.id" @change="rename(type, ($event.target as HTMLInputElement).value)" required pattern="[a-z][a-z0-9_]*" /></label>      <ChipPicker label="Parent types" :options="types.map(t => ({ value: t.id, label: t.title || humanize(t.id) }))" :model-value="parentTypes(type)" @update:model-value="setParents(type, $event, !!type.parent_types?.includes(false))" />
      <label v-if="parentTypes(type).length" class="work-row work-wrap"><ToggleSwitch :model-value="!!type.parent_types?.includes(false)" aria-label="Allow top-level items" @update:model-value="setParents(type, parentTypes(type), $event)" />Allow top-level items</label>
      <div class="work-stack work-tight"><ChipPicker label="Inherit from parent" :options="type.fields.map(code => ({ value: code, label: fieldTitle(draft.fields?.find(f => f.code === code) ?? { code }) }))" v-model="type.inherit" /><p class="work-muted work-small">These fields resolve from the parent when this item has no own value.</p></div>
      <label v-if="parentTypes(type).length" class="work-stack work-tight work-small">When the parent moves<Select v-model="type.move_children" aria-label="When the parent moves" appendTo="self" optionLabel="label" optionValue="value" optionDisabled="disabled" :options="[{ label: 'Default', value: undefined, disabled: false }, { label: 'Move children', value: 'move', disabled: false }, { label: 'Refuse while children exist', value: 'refuse', disabled: false }]" /></label>
        <Button label="Remove type" severity="danger" text :disabled="!!removing" @click="remove(type)" />
      </div></Disclosure>
    </DefinitionRow>
    <p v-if="!types.length" class="kx-empty">Add a type for the work people create, such as a delivery task or customer request.</p>
    <div class="work-row work-add-definition"><label class="work-stack work-tight">New item type name<InputText v-model="id" placeholder="e.g. Customer request" @keydown.enter.prevent="add" /></label><Button label="Add type" severity="secondary" :disabled="!valid" @click="add" outlined><template #icon><Icon icon="tabler:plus" aria-hidden="true" /></template></Button></div>
    </DefinitionList>
  </section>
</template>
