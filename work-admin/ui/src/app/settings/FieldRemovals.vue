<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import { computed, useId } from 'vue'
import { fieldTitle, humanize } from '../../forms'
import type { Declaration } from '../../types'
import type { FieldResolution, SchemaChange } from './model'

const props = defineProps<{ removals: SchemaChange[]; original: Declaration; draft: Declaration; choices: Record<string, FieldResolution>; disabled?: boolean; dropConfirmed: boolean }>()
const emit = defineEmits<{ choose: [path: string, choice: FieldResolution]; 'update:dropConfirmed': [confirmed: boolean] }>()
const id = useId()
const options: { value: FieldResolution; label: string }[] = [
  { value: 'keep', label: 'Keep the field' },
  { value: 'archive', label: 'Archive the values' },
  { value: 'drop', label: 'Delete the values' },
]
const rows = computed(() => props.removals.map(change => {
  const field = props.original.fields?.find(entry => entry.code === change.code) ?? props.draft.fields?.find(entry => entry.code === change.code)
  const type = change.item_type ? props.original.item_types?.find(entry => entry.id === change.item_type) : undefined
  const typeTitle = change.item_type ? type?.title || humanize(change.item_type) : ''
  const choice = props.choices[change.path ?? ''] ?? 'keep'
  return { change, path: change.path ?? '', field: field ? fieldTitle(field) : humanize(change.code), typeTitle, choice }
}))
const dropping = computed(() => rows.value.filter(row => row.choice === 'drop'))
const keeping = computed(() => rows.value.some(row => row.choice === 'keep'))
const items = (count?: number) => count === undefined ? 'Items' : count === 1 ? '1 item' : count.toLocaleString() + ' items'
function effect(choice: FieldResolution, typeTitle: string) {
  if (choice === 'archive') return typeTitle
    ? `${typeTitle} items stop showing the field. Saved values stay stored and return if the field is added back.`
    : 'The field is removed. Saved values stay stored and return if the field is added back.'
  if (choice === 'drop') return 'Saved values are deleted. Audit history follows the board’s retention settings.'
  return 'Nothing changes for this field. To apply the rest of the draft, choose Archive or Delete.'
}
</script>
<template>
  <section class="work-settings-card work-stack" aria-label="Fields with saved values">
    <h3 class="work-row-title">Fields with saved values</h3>
    <p class="work-muted work-small">This draft removes fields that items still use. Choose what happens to their values.</p>
    <fieldset v-for="(row, index) in rows" :key="row.path" class="work-field-removal work-stack work-tight" :disabled="disabled">
      <legend><strong>{{ row.field }}</strong><span v-if="row.typeTitle"> · {{ row.typeTitle }}</span></legend>
      <p class="work-small">
        {{ items(row.change.count) }} on this board {{ row.change.count === 1 ? 'holds a value' : 'hold values' }} in this field{{ row.typeTitle ? '; ' + row.typeTitle + ' items lose it.' : '.' }}
      </p>
      <div class="work-row work-wrap" role="radiogroup" :aria-label="'What happens to ' + row.field + ' values'">
        <label v-for="option in options" :key="option.value" class="work-row work-field-removal-choice">
          <RadioButton :input-id="id + '-' + index + '-' + option.value" :name="id + '-' + index" :value="option.value" :model-value="row.choice"
            @update:model-value="emit('choose', row.path, $event)" />
          <span>{{ option.label }}</span>
        </label>
      </div>
      <p class="work-muted work-small">{{ effect(row.choice, row.typeTitle) }}</p>
      <Disclosure class="work-small" label="Technical details">
        <p>Field <code>{{ row.change.code }}</code><span v-if="row.change.item_type"> · item type <code>{{ row.change.item_type }}</code></span></p>
        <p>Resolution path <code>{{ row.path }}</code></p>
      </Disclosure>
    </fieldset>
    <label v-if="dropping.length" class="work-row work-field-removal-confirm">
      <Checkbox binary :model-value="dropConfirmed" :disabled="disabled" @update:model-value="emit('update:dropConfirmed', $event)" />
      <span>Delete the saved values in {{ dropping.map(row => row.field).join(', ') }}. This cannot be undone.</span>
    </label>
    <p v-if="keeping" class="work-muted work-small" role="status">Fields set to Keep block this draft. Discard the draft to keep everything as it is.</p>
  </section>
</template>
