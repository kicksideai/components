<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import Button from 'primevue/button'
import Select from 'primevue/select'
import { ensureTag } from '../mount'
import { flows, type FlowRef } from './flows'
const props = defineProps<{ modelValue?: FlowRef }>()
const emit = defineEmits<{ 'update:modelValue': [value: FlowRef | undefined]; validity: [valid: boolean] }>()
const ready = ref(false), candidate = ref(''), versions = ref<{ version: number }[]>([])
const loading = ref(false), error = ref(''), choosing = ref(false)
const selectedId = computed(() => candidate.value || props.modelValue?.id)
const schema = JSON.stringify({ properties: { flow_ref: { title: 'Published Flow', picker: 'wc-workflow-picker' } } })
const config = computed(() => JSON.stringify(props.modelValue ? { flow_ref: props.modelValue } : {}))
let sequence = 0
async function loadWidget() { ready.value = await ensureTag('wc-workflow-picker') }
void loadWidget()
async function load() {
  const request = ++sequence, id = selectedId.value, reference = props.modelValue
  loading.value = !!id; error.value = ''; versions.value = []
  if (!id) return
  try {
    // Check the exact saved version as well as the list; access and deletion can change independently.
    const [rows] = await Promise.all([flows.versions(id), !choosing.value && reference ? flows.check(reference) : Promise.resolve()])
    if (request !== sequence) return
    versions.value = rows.filter(row => Number.isInteger(row.version) && row.version > 0)
    if (!choosing.value && reference && !versions.value.some(row => row.version === reference.version)) throw new Error('The published version is unavailable.')
  } catch (cause) { if (request === sequence) error.value = cause instanceof Error ? cause.message : 'Could not read published Flow.' }
  finally { if (request === sequence) loading.value = false }
}
watch([selectedId, () => props.modelValue?.version, choosing], load, { immediate: true })
watch(choosing, value => emit('validity', !value), { immediate: true })
function pick(event: Event) {
  const reference = (event as CustomEvent<{ flow_ref?: FlowRef }>).detail?.flow_ref
  if (reference?.kind !== 'flow' || !reference.id) return
  choosing.value = true; candidate.value = reference.id
}

function select(version: number) {
  if (!selectedId.value || !versions.value.some(row => row.version === version)) return
  emit('update:modelValue', { kind: 'flow', id: selectedId.value, version })
  choosing.value = false; candidate.value = ''
}
function remove() { emit('update:modelValue', undefined); choosing.value = false; candidate.value = '' }
onBeforeUnmount(() => { sequence++; emit('validity', true) })
</script>
<template>
  <section class="work-stack work-tight" aria-label="Stage Flow">
    <h4 class="work-field-label">What runs</h4>
    <p v-if="modelValue" class="work-small">Bound Flow: {{ modelValue.id }} · v{{ modelValue.version }}</p>
    <p v-else class="work-muted work-small">No Flow bound. This stage keeps its existing external execution contract.</p>
    <p v-if="error" class="kx-err" role="alert">{{ choosing ? 'Flow versions unavailable' : 'Flow binding unavailable' }}: {{ selectedId }}<template v-if="!choosing && modelValue"> · v{{ modelValue.version }}</template>. {{ error }}<Button label="Reload Flow" severity="secondary" text @click="load" /></p>
    <wc-workflow-picker v-if="ready" :schema="schema" :config="config" @change="pick" />
    <p v-else class="kx-err" role="alert">Published Flow picker unavailable.<Button label="Reload Flow picker" text severity="secondary" @click="loadWidget" /></p>
    <label v-if="selectedId" class="work-stack work-tight">Published version<Select
      :model-value="choosing ? undefined : modelValue?.version" :options="versions.map(row => ({ label: 'v' + row.version, value: row.version }))"
      option-label="label" option-value="value" aria-label="Published version" placeholder="Choose a published version" append-to="self" :loading="loading" :disabled="loading || !!error" @update:model-value="select" /></label>
    <p v-if="choosing" class="work-muted work-small" role="status">Choose a published version of {{ selectedId }} to finish selecting the Flow.</p>
    <Button v-if="modelValue || choosing" :label="choosing ? 'Cancel Flow selection' : 'Remove Flow binding'" :aria-label="choosing ? 'Cancel Flow selection' : 'Remove Flow binding'" severity="secondary" text @click="choosing ? (choosing = false, candidate = '') : remove()" />
  </section>
</template>
