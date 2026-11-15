<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { humanLabel, principalLabels } from './labels'
import { loadByTagName } from '@wippy-fe/proxy'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import { Icon } from '@iconify/vue'
const props = defineProps<{ modelValue: string[]; catalogId?: string; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()
const ready = ref(false), entry = ref('')
const names = ref<Record<string, string>>({})
let generation = 0
watch(() => props.modelValue, async ids => {
  const current = ++generation
  try {
    const labels = await principalLabels(props.catalogId ?? '', ids)
    if (current === generation) names.value = labels
  } catch { if (current === generation) names.value = {} }
}, { immediate: true, deep: true })
onUnmounted(() => { generation++ })
function label(id: string): string { return names.value[id] ?? humanLabel(id, 'Person') }
onMounted(async () => { try { await loadByTagName('wc-principal-picker'); ready.value = true } catch { ready.value = false } })
function add(id: string) {
  if (props.disabled || !id.trim() || props.modelValue.includes(id.trim())) return
  emit('update:modelValue', [...props.modelValue, id.trim()]); entry.value = ''
}
function pick(event: Event) {
  const detail: unknown = (event as CustomEvent<unknown>).detail
  if (!detail || typeof detail !== 'object') return
  const value = detail as { id?: unknown; principal_id?: unknown }
  const id = value.principal_id ?? value.id
  if (typeof id === 'string') add(id)
}
function remove(id: string) {
  if (!props.disabled) emit('update:modelValue', props.modelValue.filter(value => value !== id))
}
</script>
<template>
  <div class="pim-principal-list" :inert="disabled || undefined">
    <div v-if="modelValue.length" class="row wrap"><Tag v-for="id in modelValue" :key="id" severity="secondary"><span>{{ label(id) }}</span><Button text size="small" :disabled="disabled" :aria-label="'Remove ' + label(id)" @click="remove(id)"><Icon icon="tabler:x" /></Button></Tag></div>
    <wc-principal-picker v-if="ready" config="{}" kinds="user" placeholder="Add a person…" @config-changed.stop="pick" />
    <span v-else class="small muted">The person picker is unavailable.</span>
    <label class="pim-principal-service"><span class="small muted">Service account</span><InputText v-model="entry" :disabled="disabled" placeholder="Service principal id" @keydown.enter.prevent="add(entry)" /></label>
    <Button severity="secondary" outlined size="small" :disabled="disabled || !entry.trim()" @click="add(entry)"><Icon icon="tabler:plus" /> Add service account</Button>
  </div>
</template>
