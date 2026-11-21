<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { Icon } from '@iconify/vue'
import DefinitionRow from './DefinitionRow.vue'
import DefinitionList from './DefinitionList.vue'
import Checkbox from 'primevue/checkbox'
import ChipPicker from './ChipPicker.vue'
import Select from 'primevue/select'
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import type { Declaration, RelationType } from '../../types'
import { humanize } from '../../forms'
import { removeEntry, type RemovalGuard } from './model'
import AddDefinitionRow from './AddDefinitionRow.vue'
const props = defineProps<{ draft: Declaration; guardRemoval?: RemovalGuard }>()
const relations = computed(() => props.draft.relation_types ?? [])
const sourceTypes = computed(() => (props.draft.item_types ?? []).map(type => ({ value: type.id, label: type.title || humanize(type.id) })))
function setEndpoints(relation: RelationType, field: 'from_types' | 'to_types', ids: string[]) {
  if (ids.length) relation[field] = ids
  else delete relation[field]
}
function targetIssue(relation: RelationType, id: string) {
  if (!/^[a-z][a-z0-9_]{0,39}$/.test(id)) return 'Start with a lowercase letter and use only lowercase letters, numbers or underscores.'
  if (relation.to_types?.includes(id)) return 'This ID is already in use.'
}
function addTarget(relation: RelationType, id: string) {
  setEndpoints(relation, 'to_types', [...(relation.to_types ?? []), id])
}
const error = ref(''), busy = ref(false)
function newId(title: string) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  const stem = (/^[a-z]/.test(slug) ? slug : 'link_' + (slug || 'new')).slice(0, 40)
  let code = stem, suffix = 2
  while (relations.value.some(link => link.id === code)) {
    const ending = '_' + suffix++
    code = stem.slice(0, 40 - ending.length) + ending
  }
  return code
}
function add(title: string) {
  (props.draft.relation_types ??= []).push({ id: newId(title), outward: title, inward: title, cardinality: 'many' })
}
async function remove(id: string) {
  if (busy.value) return
  busy.value = true; error.value = ''
  try { const refusal = await props.guardRemoval?.('relation_types', id); if (refusal) error.value = refusal; else removeEntry(props.draft, 'relation_types', id) }
  finally { busy.value = false }
}
</script>
<template>
  <section
    class="work-stack"
    aria-label="Links editor"
  >
    <p
      v-if="error"
      class="kx-err"
      role="alert"
    >{{ error }}</p>
    <DefinitionList columns="relations" :count="relations.length">
    <DefinitionRow :title="relation.outward || humanize(relation.id)" :kind="relation.symmetric ? 'Same both ways' : 'Different each way'"
      v-for="(relation, index) in relations"
      :key="index"
      class="work-stack"
    >
      <template #usage><span class="work-definition-meta work-muted work-small">{{ relation.outward || 'Related work' }} · {{ relation.inward || 'Reverse relation' }}</span></template><template #actions>
        <Button

          severity="secondary"
          text
          :disabled="busy"
          @click="remove(relation.id)" aria-label="Remove link type" size="small"><Icon icon="tabler:trash" aria-hidden="true" /></Button>
      </template>
      <div class="work-settings-grid">
        <label class="work-stack work-tight">Shown on this item
          <InputText
            v-model="relation.outward"
            aria-label="Shown on this item"
          />
        </label>
        <label class="work-stack work-tight">Shown on the other item
          <InputText
            v-model="relation.inward"
            aria-label="Shown on the other item"
          />
        </label>
        <label class="work-stack work-tight">Links allowed
          <Select
            :model-value="relation.cardinality ?? 'many'" @update:model-value="relation.cardinality = $event"

            aria-label="Links allowed"
           appendTo="self" optionLabel="label" optionValue="value" optionDisabled="disabled" :options="[{ label: 'One link', value: 'one', disabled: false }, { label: 'Many links', value: 'many', disabled: false }]" />
        </label>
        <label class="work-row">
          <Checkbox
            v-model="relation.symmetric"
            :disabled="!!(relation.from_types?.length || relation.to_types?.length)"
            aria-label="Same meaning in both directions" binary />Same meaning in both directions
        </label>
      </div>
      <p v-if="relation.from_types?.length || relation.to_types?.length" class="work-muted work-small">
        Clear the source and target types to use the same meaning in both directions.
      </p>
      <div v-if="!relation.symmetric" class="work-settings-grid">
        <ChipPicker label="Source item types" :options="sourceTypes" :model-value="relation.from_types"
          @update:model-value="setEndpoints(relation, 'from_types', $event)" />
        <div class="work-stack work-tight">
          <p class="work-muted work-small">Use the type ID from this board or a peer board. Leave either end empty to allow any type there.</p>
          <div v-if="relation.to_types?.length" class="work-chips">
            <Button v-for="type in relation.to_types" :key="type" severity="secondary" text size="small"
              :label="type + ' ×'" :aria-label="'Remove target type ' + type"
              @click="setEndpoints(relation, 'to_types', relation.to_types.filter(id => id !== type))" />
          </div>
          <AddDefinitionRow action="Add target type" label="Target type ID" :maxlength="40"
            :validate="id => targetIssue(relation, id)" @add="id => addTarget(relation, id)" />
        </div>
      </div>
      <Disclosure class="work-disclosure" label="Advanced link settings">
        <label class="work-stack work-tight">Identifier
          <InputText
            v-model="relation.id"
            required
            pattern="[a-z][a-z0-9_]*"
            aria-label="Relation ID"
          />
        </label>
      </Disclosure>
      <p class="work-relation-preview work-small">
        <strong>This item</strong> {{ relation.outward || 'relates to' }}
        <strong>another item</strong>
        <span class="work-muted"> · reverse: {{ relation.symmetric ? relation.outward : relation.inward }}</span>
      </p>
    </DefinitionRow>
    <p
      v-if="!relations.length"
      class="kx-empty"
    >No link types yet. Add one to connect related work.</p>
    <AddDefinitionRow action="Add link type" label="Link name" @add="add" />
    </DefinitionList>
  </section>
</template>
