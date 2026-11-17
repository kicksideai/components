<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Select from 'primevue/select'
import { computed, onBeforeUnmount, useId, watch } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import type { Field } from '../../types'
import { categories, categoryTitle } from './process'
import { move } from './model'
import { useReorder } from './reorder'
const props = defineProps<{ field: Field }>()
const emit = defineEmits<{ validity: [valid: boolean, key: string] }>()
const validityKey = 'options:' + useId()
const options = computed(() => props.field.options ?? [])
const valid = computed(() => options.value.every((o, i) => !!o.id && options.value.findIndex(other => other.id === o.id) === i))
watch(valid, value => emit('validity', value, validityKey), { immediate: true })
onBeforeUnmount(() => emit('validity', true, validityKey))
function reorder(from: number, to: number) { move(options.value, from, to - from); options.value.forEach((option, index) => option.order = index) }
const vReorder = useReorder(reorder)
const colors = ['primary', 'success', 'info', 'warn', 'danger', 'secondary']
function add() {
  let index = options.value.length + 1
  while (options.value.some(option => option.id === `option_${index}`)) index++
  ;(props.field.options ??= []).push({ id: `option_${index}`, label: 'New option', order: options.value.length })
}
</script>
<template>
  <section class="work-stack work-tight work-option-builder"><header class="work-row"><h4>Options</h4><span class="work-muted work-small">Stable IDs keep existing values when labels change.</span><span class="work-spacer"></span></header>
    <div v-reorder class="work-stack work-tight"><div v-for="(option, index) in options" :key="index" class="work-option-row work-reorder-entry">
      <Button type="button" class="work-icon-button work-reorder-handle" aria-label="Drag option; arrow keys reorder" @keydown.up.prevent="reorder(index, index - 1)" @keydown.down.prevent="reorder(index, index + 1)" severity="secondary" text size="small"><Icon icon="tabler:grip-vertical" aria-hidden="true" /></Button>
      <label class="work-stack work-tight work-small">Label<InputText v-model="option.label" aria-label="Option label" /></label><label class="work-stack work-tight work-small">ID<InputText v-model="option.id" class="work-option-code" required aria-label="Option ID" /></label>
      <div class="work-stack work-tight"><label class="work-stack work-tight work-small">Color<span class="work-row"><span class="work-color-swatch" :class="'work-swatch-' + (option.color || 'secondary')" aria-hidden="true"></span><Select v-model="option.color" aria-label="Option color" appendTo="self" optionLabel="label" optionValue="value" optionDisabled="disabled" :options="[{ label: 'Default', value: undefined, disabled: false }, ...(colors ?? []).map((color) => ({ label: (color), value: (color), disabled: false }))]" /></span></label><label class="work-stack work-tight work-small">Category<Select :model-value="option.category" aria-label="Option category" appendTo="self" optionLabel="label" optionValue="value" showClear :options="['triage', 'backlog', ...categories].map(value => ({ label: categoryTitle(value), value }))" @update:model-value="option.category = $event || undefined" /></label></div>

      <div class="work-row"><Button aria-label="Option earlier" severity="secondary" size="small" :disabled="index === 0" @click="reorder(index, index - 1)" text><Icon icon="tabler:arrow-up" aria-hidden="true" /></Button><Button aria-label="Option later" severity="secondary" size="small" :disabled="index === options.length - 1" @click="reorder(index, index + 1)" text><Icon icon="tabler:arrow-down" aria-hidden="true" /></Button><Button label="Remove" aria-label="Remove option" severity="secondary" text size="small" @click="options.splice(index, 1)"><template #icon><Icon icon="tabler:trash" aria-hidden="true" /></template></Button></div>
    </div><p v-if="!valid" class="kx-err" role="alert">Option IDs must be nonempty and unique.</p><div class="work-add-option"><Button label="Add option" severity="secondary" size="small" @click="add" outlined><template #icon><Icon icon="tabler:plus" aria-hidden="true" /></template></Button></div></div><p v-if="!options.length" class="work-muted work-small">Add the choices people can select for this field.</p>
  </section>
</template>
