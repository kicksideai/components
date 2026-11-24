<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import ToggleSwitch from 'primevue/toggleswitch'
import type { Setting } from './api'

// Rows for a driver that ships no settings view, generated from its setting definitions. Like a driver's own
// view, the rows report changes and validity; the block keeps the draft and saves.
const props = defineProps<{ settings: Setting[]; errors: Record<string, string>; disabled?: boolean }>()
const emit = defineEmits<{ change: [values: Record<string, unknown>]; validity: [valid: boolean] }>()
const base = useId()

const visible = computed(() => props.settings.filter(item => item.editable !== false).sort((a, b) => (a.order ?? 100) - (b.order ?? 100)))
const values = ref<Record<string, unknown>>({})
const replacing = ref<Record<string, boolean>>({})
watch(() => props.settings, list => {
  values.value = Object.fromEntries(list.map(item => [item.key, item.is_secret || item.value_type === 'secret' ? '' : item.value ?? item.default ?? '']))
  replacing.value = {}
}, { immediate: true })

const secret = (item: Setting) => item.is_secret || item.value_type === 'secret'
function formProblem(item: Setting): string {
  const value = values.value[item.key]
  const pattern = item.schema?.pattern
  return pattern && typeof value === 'string' && value && !new RegExp(pattern).test(value) ? 'This value does not have the expected form.' : ''
}
const problem = (item: Setting) => formProblem(item) || props.errors[item.key] || ''
watch(values, current => {
  const changes: Record<string, unknown> = {}
  for (const item of props.settings) {
    const value = current[item.key]
    if (secret(item)) { if (value) changes[item.key] = value; continue }
    if (value !== (item.value ?? item.default ?? '')) changes[item.key] = value
  }
  emit('change', changes)
  emit('validity', props.settings.every(item => !formProblem(item)))
}, { deep: true })
const options = (item: Setting) => (item.schema?.enum ?? []).map(value => ({ label: String(value), value }))
</script>

<template>
  <fieldset class="mail-delivery-rows" :disabled="disabled">
    <p v-if="!visible.length" class="mail-setting-row mail-setting-help">This service needs no settings of its own.</p>
    <div v-for="item in visible" :key="item.key" class="mail-setting-row" :class="{ 'mail-setting-invalid': problem(item) }">
      <div class="mail-setting-text">
        <label class="mail-setting-title" :for="base + item.key">{{ item.title || item.key }}</label>
        <p v-if="item.description" class="mail-setting-help">{{ item.description }}</p>
      </div>
      <div class="mail-setting-control">
        <template v-if="secret(item)">
          <div v-if="item.has_value && !replacing[item.key]" class="mail-secret">
            <Tag severity="success" value="Set" />
            <Button label="Replace" severity="secondary" outlined size="small" @click="replacing[item.key] = true" />
          </div>
          <Password v-else v-model="values[item.key] as string" :input-id="base + item.key" :feedback="false" toggle-mask fluid />
        </template>
        <Select v-else-if="options(item).length" v-model="values[item.key]" :input-id="base + item.key" :options="options(item)"
          option-label="label" option-value="value" append-to="self" fluid />
        <ToggleSwitch v-else-if="item.value_type === 'bool'" v-model="values[item.key] as boolean" :input-id="base + item.key" />
        <InputNumber v-else-if="item.value_type === 'int'" v-model="values[item.key] as number" :input-id="base + item.key" fluid />
        <InputText v-else v-model="values[item.key] as string" :id="base + item.key" fluid :invalid="!!problem(item)" />
        <small v-if="problem(item)" class="mail-field-error" role="alert">{{ problem(item) }}</small>
      </div>
    </div>
  </fieldset>
</template>
