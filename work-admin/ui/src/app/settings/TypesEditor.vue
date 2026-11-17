<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import DefinitionRow from './DefinitionRow.vue'
import DefinitionList from './DefinitionList.vue'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
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
const valid = computed(() => /^[a-z][a-z0-9_]*$/.test(id.value) && !types.value.some(t => t.id === id.value))
function add() { if (!valid.value) return; (props.draft.item_types ??= []).push({ id: id.value, title: humanize(id.value), process: props.draft.processes?.[0]?.id ?? '', fields: [] }); id.value = '' }
function rename(type: ItemType, id: string) {
  const before = type.id
  type.id = id
  for (const other of types.value) if (other.parent_types) other.parent_types = other.parent_types.map(value => value === before ? id : value)
}
function setFields(type: ItemType, fields: string[]) { type.fields = fields; if (type.inherit) type.inherit = type.inherit.filter(code => fields.includes(code)) }
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
    <header class="work-section-heading"><div><h2>Item types</h2><p class="work-muted work-small">Choose the fields, parent relationships and process for each kind of work.</p></div><Tag class="kx-tag-sm" severity="secondary">{{ types.length }} {{ types.length === 1 ? 'type' : 'types' }}</Tag></header>
    <p v-if="error" class="kx-err" role="alert">{{ error }}</p>
    <DefinitionList columns="types" :count="types.length">
    <DefinitionRow :title="type.title || humanize(type.id)" :code="type.id" :kind="draft.processes?.find(p => p.id === type.process)?.name || humanize(type.process)" v-for="(type, index) in types" :key="index" class="work-type-card">
      <template #usage><span class="work-definition-meta"><Tag class="kx-tag-sm" severity="secondary">{{ type.fields.length }} {{ type.fields.length === 1 ? 'field' : 'fields' }}</Tag><Tag v-if="usedBy(type).length" class="kx-tag-sm" severity="secondary">Parent of {{ usedBy(type).join(', ') }}</Tag></span></template><template #actions><Button severity="secondary" text size="small" :disabled="!!removing" @click="remove(type)" aria-label="Remove type"><Icon icon="tabler:trash" aria-hidden="true" /></Button></template>
      <p v-for="issue in issues?.filter(i => i.code === 'item_type ' + type.id) ?? []" :key="issue.what" class="work-error work-small" role="alert">{{ changeReason(issue) }}</p><div class="work-settings-grid"><label class="work-stack work-tight">Identifier<InputText :value="type.id" @change="rename(type, ($event.target as HTMLInputElement).value)" required pattern="[a-z][a-z0-9_]*" /></label><label class="work-stack work-tight">Title<InputText v-model="type.title" :placeholder="humanize(type.id)" /></label><label class="work-stack work-tight">Process<Select v-model="type.process" required appendTo="self" optionLabel="label" optionValue="value" optionDisabled="disabled" :options="[...(draft.processes ?? []).map((process) => ({ label: (process.name || humanize(process.id)), value: process.id, disabled: false }))]" /></label></div>
      <ChipPicker label="Fields" :options="(draft.fields ?? []).map(f => ({ value: f.code, label: fieldTitle(f) }))" :model-value="type.fields" @update:model-value="setFields(type, $event)" />
      <ChipPicker label="Parent types" :options="types.map(t => ({ value: t.id, label: t.title || humanize(t.id) }))" v-model="type.parent_types" />
      <div class="work-stack work-tight"><ChipPicker label="Inherit from parent" :options="type.fields.map(code => ({ value: code, label: fieldTitle(draft.fields?.find(f => f.code === code) ?? { code }) }))" v-model="type.inherit" /><p class="work-muted work-small">These fields resolve from the parent when this item has no own value.</p></div>
      <label v-if="type.parent_types?.length" class="work-stack work-tight work-small">When the parent moves<Select v-model="type.move_children" appendTo="self" optionLabel="label" optionValue="value" optionDisabled="disabled" :options="[{ label: 'Default', value: undefined, disabled: false }, { label: 'Move children', value: 'move', disabled: false }, { label: 'Refuse while children exist', value: 'refuse', disabled: false }]" /></label>
    </DefinitionRow>
    <p v-if="!types.length" class="kx-empty">Add an item type to connect fields to a process.</p>
    <div class="work-row work-add-definition"><label class="work-stack work-tight">New type identifier<InputText v-model="id" placeholder="new_type" @keydown.enter.prevent="add" /></label><Button label="Add type" severity="secondary" :disabled="!valid" @click="add" outlined><template #icon><Icon icon="tabler:plus" aria-hidden="true" /></template></Button><span v-if="id && !valid" class="work-error work-small">Use a unique lowercase identifier with letters, numbers and underscores.</span></div>
    </DefinitionList>
  </section>
</template>
