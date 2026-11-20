<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { formatApiError } from '../transport'
import { Icon } from '@iconify/vue'
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import ContentAction from './ContentAction.vue'
import { ensureTag } from './mount'
import { display, readonly } from '../forms'
import { work } from '../api'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import type { Field, Item } from '../types'
const props = defineProps<{ boardId: string; field: Field; modelValue: unknown; disabled?: boolean; inputId?: string; editorTag?: string; linkTag?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: unknown]; validity: [valid: boolean] }>()
const id = computed(() => props.inputId ?? `field-${props.field.code}`)
const multi = computed(() => !!props.field.cardinality && props.field.cardinality !== 'one')
const members = computed<unknown[]>(() => Array.isArray(props.modelValue) ? props.modelValue : [])
const text = computed(() => props.modelValue == null ? '' : typeof props.modelValue === 'object' ? display(props.modelValue) : String(props.modelValue))
const componentId = computed(() => {
  const value = props.modelValue
  if (value && typeof value === 'object' && 'ref' in value && Array.isArray(value.ref)) return String(value.ref[1] ?? '')
  return ''
})
const immutable = computed(() => props.disabled || readonly(props.field))
const ready = ref(false), linkReady = ref(false), editorReady = ref(false), error = ref(''), search = ref(''), hits = ref<Item[]>([])
const beginRead = latestRequest()
const rowIds = ref<number[]>([])
let sequence = 0, pendingRows: number[] | undefined
const invalid = new Set<number>()
watch(members, rows => { rowIds.value = pendingRows ?? rows.map((_, i) => rowIds.value[i] ?? sequence++); pendingRows = undefined }, { immediate: true })
function set(value: unknown) { emit('update:modelValue', value) }
function repeat(index: number, value: unknown) { const values = [...members.value]; values[index] = value; set(values) }
function rowValidity(row: number, valid: boolean) { if (valid) invalid.delete(row); else invalid.add(row); emit('validity', !invalid.size) }
function remove(index: number) {
  invalid.delete(rowIds.value[index]); emit('validity', !invalid.size)
  pendingRows = rowIds.value.filter((_, i) => i !== index); set(members.value.filter((_, i) => i !== index))
}
function add() {
  pendingRows = [...rowIds.value, sequence++]
  set([...members.value, props.field.form === 'bool' ? false : props.field.form === 'record' ? {} : ''])
}
function principal(event: Event) {
  const value = (event as CustomEvent<{ id?: string; principal_id?: string; type?: string }>).detail
  const principalId = value?.principal_id ?? value?.id
  set(principalId ? { kind: value.type ?? 'user', id: principalId } : undefined)
}
function component(event: Event) {
  const value = (event as CustomEvent<{ thread_id?: string }>).detail
  set(value?.thread_id ? { ref: ['component', value.thread_id] } : undefined)
}
const jsonText = ref('')
let accepted = ''
watch(() => props.modelValue, value => {
  const canonical = JSON.stringify(value ?? {}, null, 2)
  if (canonical !== accepted) { accepted = canonical; jsonText.value = canonical; error.value = ''; emit('validity', true) }
}, { immediate: true })
function json(value: string) {
  jsonText.value = value
  try {
    const parsed: unknown = JSON.parse(value)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Enter a JSON object.')
    if (props.field.type === 'rich_text' && !('type' in parsed && typeof parsed.type === 'string')) throw new Error('The document needs a type.')
    accepted = JSON.stringify(parsed, null, 2); error.value = ''; emit('validity', true); set(parsed)
  } catch (e) { error.value = e instanceof Error ? e.message : 'Invalid JSON.'; emit('validity', false) }
}
function numeric(value: string) {
  if (!value) { emit('validity', true); set(undefined); return }
  const valid = Number.isFinite(Number(value)) && (props.field.form !== 'int' || Number.isSafeInteger(Number(value)))
  emit('validity', valid)
  if (valid) set(props.field.form === 'int' ? Number(value) : value)
}
const dateOnly = computed(() => props.field.config?.format === 'date')
function date(value: string) { set(value ? dateOnly.value ? value : new Date(value).toISOString() : undefined) }
const dateValue = computed(() => {
  if (typeof props.modelValue !== 'string') return ''
  if (dateOnly.value) return props.modelValue.slice(0, 10)
  const d = new Date(props.modelValue)
  return Number.isNaN(d.getTime()) ? '' : new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
})
function link(event: Event) { set((event as CustomEvent<{ ref: unknown }>).detail?.ref) }
function custom(event: Event) { set((event as CustomEvent<{ value: unknown }>).detail?.value) }
let timer: ReturnType<typeof setTimeout> | undefined
watch(search, () => {
  const current = beginRead(); clearTimeout(timer)
  if (!search.value.trim()) { hits.value = []; return }
  timer = setTimeout(async () => {
    try { const q = search.value.trim()
      const rows = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(q) ? [(await work.item(props.boardId, { key: q })).item] : (await work.query(props.boardId, { where: { field: 'title', op: 'contains', value: q }, limit: 8 })).items
      if (current()) { hits.value = rows; error.value = '' } }
    catch (e) { if (current()) error.value = formatApiError(e, 'Could not search items.') }
  }, 200)
})
function pickItem(item: Item) { set({ board: props.boardId, item: item.id }); search.value = ''; hits.value = [] }
onMounted(async () => {
  if (props.field.type === 'principal') ready.value = await ensureTag('wc-principal-picker')
  else if (props.field.config?.target === 'component') ready.value = await ensureTag('wc-component-picker')
})
for (const [tag, ready] of [[() => props.editorTag, editorReady], [() => props.linkTag, linkReady]] as const) {
  watch(tag, async (value, _, cleanup) => {
    let current = true
    cleanup(() => { current = false })
    ready.value = false
    if (value) { const loaded = await ensureTag(value); if (current) ready.value = loaded }
  }, { immediate: true })
}
onUnmounted(() => { clearTimeout(timer); beginRead() })
</script>
<template>
  <div class="work-field-control">
  <output v-if="readonly(field)" :id="id" class="work-read-value">{{ display(modelValue, field) }}</output>
  <div v-else-if="multi" class="work-stack work-tight">
    <div class="work-chips"><Tag v-for="(value, i) in members" :key="rowIds[i]" class="kx-tag-sm" severity="secondary">{{ display(value, field) }} <Button type="button" class="work-icon-button" :disabled="immutable" :aria-label="'Remove value ' + (i + 1)" @click="remove(i)" severity="secondary" text size="small"><Icon icon="tabler:x" aria-hidden="true" /></Button></Tag></div>
    <div v-for="(value, i) in members" :key="rowIds[i]" class="work-stack work-tight">
      <FieldControl :board-id="boardId" :field="{ ...field, cardinality: 'one' }" :model-value="value" :input-id="id + '-' + rowIds[i]" :disabled="immutable" :editor-tag="editorTag" :link-tag="linkTag" @update:model-value="repeat(i, $event)" @validity="rowValidity(rowIds[i], $event)" />
    </div>
    <Button label="Add value" severity="secondary" size="small" :disabled="immutable" @click="add" outlined><template #icon><Icon icon="tabler:plus" aria-hidden="true" /></template></Button>
  </div>
  <component :is="editorTag" v-else-if="editorTag && editorReady" :board-id="boardId" :value="JSON.stringify(modelValue ?? null)" :config="JSON.stringify(field.config ?? {})" :readonly="immutable || undefined" @change="custom" />
  <component :is="linkTag" v-else-if="linkTag && linkReady" :board-id="boardId" :kind="field.config?.target ?? field.type" :value="JSON.stringify(modelValue ?? null)" :readonly="immutable || undefined" @change="link" />
  <Select placeholder="Not set" v-else-if="field.type === 'option'" :inputId="id" :model-value="modelValue ?? ''" :disabled="immutable" @update:model-value="set($event || undefined)" appendTo="self" optionLabel="label" optionValue="value" optionDisabled="disabled" :options="[{ label: 'Not set', value: '', disabled: false }, ...(field.options ?? []).map((option) => ({ label: (option.label ?? option.id), value: option.id, disabled: false }))]" />
  <label v-else-if="field.form === 'bool'" class="work-row"><Checkbox :inputId="id" :model-value="modelValue === true" :disabled="immutable" @update:model-value="set($event)" binary />{{ modelValue === true ? 'Yes' : modelValue === false ? 'No' : 'Not set' }}</label>
  <InputNumber v-else-if="field.form === 'int'" :inputId="id" :model-value="text === '' ? null : Number(text)" :disabled="immutable" @update:model-value="numeric(($event == null ? '' : String($event)))" :useGrouping="false" />
  <InputText v-else-if="field.form === 'dec'" :id="id" inputmode="decimal" :model-value="text" :disabled="immutable" @update:model-value="numeric($event ?? '')" />
  <InputText v-else-if="field.form === 'time'" :id="id" :type="dateOnly ? 'date' : 'datetime-local'" :value="dateValue" :disabled="immutable" @input="date(($event.target as HTMLInputElement).value)" />
  <div v-else-if="field.type === 'principal'" :inert="immutable || undefined" class="work-stack work-tight">
    <wc-principal-picker v-if="ready" :value="JSON.stringify(modelValue ?? {})" kinds="user,group" @config-changed="principal" />
    <span v-else class="work-muted">{{ display(modelValue, field) }} · Person picker is unavailable.</span>
  </div>
  <div v-else-if="field.config?.target === 'component'" :inert="immutable || undefined">
    <wc-component-picker v-if="ready" :value="JSON.stringify({ thread_id: componentId })" @change="component" />
    <span v-else class="work-muted">Component picker is unavailable.</span>
  </div>
  <div v-else-if="field.type === 'item'" class="work-stack work-tight">
    <Tag class="kx-tag-sm" severity="secondary">{{ display(modelValue, field) }}</Tag><InputText :id="id" v-model="search" :disabled="immutable" placeholder="Search a title or enter an item key" aria-label="Search items" />
    <div class="work-stack work-tight" aria-label="Matching items"><ContentAction v-for="item in hits" :key="item.id" class="work-match-item" :disabled="immutable" @activate="pickItem(item)"><code class="work-mono">{{ item.key }}</code><span>{{ display(item.values.title) }}</span></ContentAction></div>
    <Button v-if="modelValue" label="Clear reference" severity="secondary" size="small" :disabled="immutable" @click="set(undefined)" outlined><template #icon><Icon icon="tabler:list-check" aria-hidden="true" /></template></Button>
  </div>
  <Textarea v-else-if="field.form === 'record' || field.type === 'rich_text' || field.form === 'quantity' || field.form === 'ref'" :id="id" :model-value="jsonText" rows="3" :disabled="immutable" :aria-invalid="!!error" @update:model-value="json($event ?? '')" />
  <Textarea v-else-if="field.code === 'description'" :id="id" :model-value="text" rows="4" :disabled="immutable" @update:model-value="set($event)" />
  <InputText v-else :id="id" :model-value="text" :disabled="immutable" @update:model-value="set($event)" />
  <span v-if="error" class="work-error work-small" role="alert">{{ error }}</span>
  </div>
</template>
