<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Select from 'primevue/select'
import ToggleSwitch from 'primevue/toggleswitch'
import Button from 'primevue/button'
import { computed } from 'vue'
import type { Declaration, Holder } from '../../types'
import HoldersPicker from './HoldersPicker.vue'
import JsonInput from './JsonInput.vue'
import AddDefinitionRow from './AddDefinitionRow.vue'
import { fieldTitle } from '../../forms'
const props = defineProps<{ draft: Declaration; boardId?: string }>()
const emit = defineEmits<{ validity: [valid: boolean] }>()
const visibility = computed(() => props.draft.visibility)
const fields = computed(() => (props.draft.fields ?? []).filter(f => f.form === 'text' && (!f.cardinality || f.cardinality === 'one') && f.type !== 'rollup' && f.index !== 'number' && f.config?.case !== 'insensitive'))
const textField = computed(() => fields.value.find(f => f.code === visibility.value?.field)?.type !== 'option')
function levelIssue(id: string) {
  if (visibility.value?.levels.some(level => level.id === id)) return 'This level is already in use.'
}
function addLevel(id: string) {
  visibility.value?.levels.push({ id, holders: [] })
}
function choose(code: string) {
  if (!code) { delete props.draft.visibility; return }
  const field = fields.value.find(f => f.code === code)
  props.draft.visibility = { field: code, levels: (field?.options ?? []).map(o => ({ id: o.id, holders: [] })) }
}
function update(id: string, holders: Holder[] | undefined) { const level = visibility.value?.levels.find(l => l.id === id); if (level) level.holders = holders ?? [] }
</script>
<template>
  <section class="work-stack" aria-label="Board visibility">
    <h3 class="work-group-title">Board visibility</h3>
    <p class="work-small work-muted">Restrict items by their visibility level. People still need access to the board.</p>
    <label class="work-stack work-tight">Visibility field
      <Select aria-label="Visibility field" :model-value="visibility?.field ?? ''"
        placeholder="No additional restriction"
        :options="[{ label: 'No additional restriction', value: '' }, ...fields.map(f => ({ label: fieldTitle(f), value: f.code }))]"
        optionLabel="label" optionValue="value" appendTo="self" @update:model-value="choose" />
    </label>
    <template v-if="visibility">
      <div v-if="visibility.levels.length" class="work-settings-list">
        <div v-for="(level, index) in visibility.levels" :key="level.id" class="work-settings-row">
          <div class="work-row-main">
            <strong>{{ fields.find(f => f.code === visibility!.field)?.options?.find(o => o.id === level.id)?.label || level.id }}</strong>
            <p class="work-small work-muted">Level {{ index + 1 }}</p>
          </div>
          <div class="work-row-control">
            <HoldersPicker :board-id="boardId" label="Who can see these items" :model-value="level.holders"
              @update:model-value="update(level.id, $event)" @validity="emit('validity', $event)" />
          </div>
        </div>
      </div>
      <AddDefinitionRow v-if="textField" :key="visibility.field" action="Add level" label="New visibility level"
        :validate="levelIssue" @add="addLevel" />
      <label class="work-row">
        <ToggleSwitch :model-value="visibility.bypass === 'admin'"
          @update:model-value="$event ? visibility.bypass = 'admin' : delete visibility.bypass" />
        Board administrators can see every level
      </label>
      <Button label="Remove visibility restriction" severity="secondary" text @click="delete draft.visibility" />
    </template>
    <JsonInput label="Visibility rules" :model-value="visibility" shape="object"
      :example="{ field: 'visibility', levels: [{ id: 'internal', holders: [] }], bypass: 'admin' }"
      @update:model-value="draft.visibility = $event as Declaration['visibility']" @validity="emit('validity', $event)" />
  </section>
</template>
