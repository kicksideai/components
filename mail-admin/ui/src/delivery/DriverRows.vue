<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import ToggleSwitch from 'primevue/toggleswitch'
import SettingsItem from '@kickside/ui-kit/SettingsItem.vue'
import type { Setting } from './api'

// Rows for a driver that ships no settings view, generated from its setting definitions. Like a driver's own
// view, the rows report changes and validity; the block keeps the draft and saves.
const props = defineProps<{ settings: Setting[]; errors: Record<string, string>; draft?: Record<string, unknown>; disabled?: boolean }>()
const emit = defineEmits<{ change: [values: Record<string, unknown>]; validity: [valid: boolean] }>()

const secret = (item: Setting) => !!item.is_secret || item.value_type === 'secret'
const visible = computed(() => props.settings.filter(item => item.editable !== false).sort((a, b) => (a.order ?? 100) - (b.order ?? 100)))
const stored = (item: Setting) => secret(item) ? '' : item.value ?? item.default ?? ''
const values = ref<Record<string, unknown>>(Object.fromEntries(props.settings.map(item => [item.key, props.draft?.[item.key] ?? stored(item)])))
const replacing = ref<Record<string, boolean>>(Object.fromEntries(props.settings.filter(secret).map(item => [item.key, props.draft?.[item.key] !== undefined])))

function cancelReplace(item: Setting) {
  replacing.value[item.key] = false
  values.value[item.key] = ''
}
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
    if (value !== stored(item)) changes[item.key] = value
  }
  emit('change', changes)
  emit('validity', props.settings.every(item => !formProblem(item)))
}, { deep: true })
const options = (item: Setting) => (item.schema?.enum ?? []).map(value => ({ label: String(value), value }))
</script>

<template>
  <SettingsItem v-if="!visible.length" title="No settings of its own" description="This service is ready once it is chosen." />
  <SettingsItem v-for="item in visible" :key="item.key" :title="item.title || item.key" :description="item.description || undefined"
    :class="{ 'mail-setting-invalid': problem(item) }">
    <template #actions>
      <span class="mail-setting-control">
        <template v-if="secret(item)">
          <span v-if="item.has_value && !replacing[item.key]" class="mail-secret">
            <Tag severity="success" value="Set" class="kx-tag-sm" />
            <Button label="Replace" severity="secondary" outlined size="small" :disabled="disabled" @click="replacing[item.key] = true" />
          </span>
          <span v-else class="mail-secret">
            <Password v-model="values[item.key] as string" :aria-label="item.title || item.key" :feedback="false" toggle-mask fluid :disabled="disabled" />
            <Button v-if="item.has_value" label="Cancel" severity="secondary" text size="small" :disabled="disabled" @click="cancelReplace(item)" />
          </span>
        </template>
        <Select v-else-if="options(item).length" v-model="values[item.key]" :aria-label="item.title || item.key" :options="options(item)"
          option-label="label" option-value="value" append-to="self" fluid :disabled="disabled" />
        <ToggleSwitch v-else-if="item.value_type === 'bool'" v-model="values[item.key] as boolean" :aria-label="item.title || item.key" :disabled="disabled" />
        <InputNumber v-else-if="item.value_type === 'int'" v-model="values[item.key] as number" :aria-label="item.title || item.key" fluid :disabled="disabled" />
        <InputText v-else v-model="values[item.key] as string" :aria-label="item.title || item.key" fluid :invalid="!!problem(item)" :disabled="disabled" />
        <small v-if="problem(item)" class="mail-field-error" role="alert">{{ problem(item) }}</small>
      </span>
    </template>
  </SettingsItem>
</template>
