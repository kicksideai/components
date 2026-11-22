<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { Icon } from '@iconify/vue'
import DefinitionRow from './DefinitionRow.vue'
import DefinitionList from './DefinitionList.vue'
import ToggleSwitch from 'primevue/toggleswitch'
import ConditionEditor from './ConditionEditor.vue'
import HoldersPicker from './HoldersPicker.vue'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import { computed, ref } from 'vue'
import ChipPicker from './ChipPicker.vue'
import AddDefinitionRow from './AddDefinitionRow.vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { fieldTitle, humanize } from '../../forms'
import { useReorder } from './reorder'
import OptionsEditor from './OptionsEditor.vue'
import type { Declaration, Field, FieldTypeOption } from '../../types'
import { move, renameField, removeEntry, type RemovalGuard, type SchemaChange, changeReason } from './model'
import ConfigForm from './ConfigForm.vue'
import JsonInput from './JsonInput.vue'
import { configFields } from './config'
const props = defineProps<{ draft: Declaration; guardRemoval?: RemovalGuard; issues?: SchemaChange[]; boardId?: string; installedTypes?: FieldTypeOption[]; itemType?: string }>()
const emit = defineEmits<{ validity: [key: string, valid: boolean]; 'update:itemType': [type: string] }>()
const fields = computed(() => props.draft.fields ?? [])
const newKind = ref('text'), placement = ref<string[]>([])
const typeChoices = computed(() => (props.draft.item_types ?? []).map(type => ({ value: type.id, label: type.title || humanize(type.id) })))
const currentType = computed(() => props.draft.item_types?.find(type => type.id === props.itemType))
const shown = computed(() => fields.value.map((field, index) => ({ field, index })).filter(({ field }) => !currentType.value || currentType.value.fields.includes(field.code)))
const removing = ref(''), reason = ref<Record<string, string>>({})
const vReorder = useReorder((from, to) => {
  const source = shown.value[from]?.index, target = shown.value[to]?.index
  if (source !== undefined && target !== undefined) reorder(source, target - source)
})
function usedBy(code: string) { return (props.draft.item_types ?? []).filter(t => t.fields.includes(code)).map(t => t.title || humanize(t.id)) }
async function remove(field: Field) {
  if (removing.value) return
  removing.value = field.code
  try { const refusal = await props.guardRemoval?.('fields', field.code); reason.value[field.code] = refusal ?? ''; if (!refusal) removeEntry(props.draft, 'fields', field.code) }
  finally { removing.value = '' }
}
const forms = Object.entries({ text: 'Text', int: 'Whole number', dec: 'Decimal number', quantity: 'Measurement', bool: 'Yes or no', time: 'Date or time', ref: 'Reference', record: 'Structured data', option: 'Choice', principal: 'Person or group', item: 'Work item', rank: 'Order', rich_text: 'Formatted text', formula: 'Formula', rollup: 'Related item calculation', counter: 'Counter' }).map(([value, label]) => ({ value, label }))
const indexes = [{ label: 'None', value: 'none' }, { label: 'Exact matches', value: 'key' }, { label: 'Numeric ranges', value: 'number' }]
const numericForms = ['int', 'dec', 'quantity']
const descriptors = computed(() => new Map(props.installedTypes?.map(type => [type.id, type])))
const kindOptions = computed(() => [...forms, ...(props.installedTypes ?? []).map(type => ({ value: type.id, label: type.title }))])
const emptyConfig: Record<string, unknown> = {}
function kind(field: Field) { return field.type && field.type !== 'value' ? field.type : field.form ?? 'text' }
function customType(field: Field) { return field.type ? descriptors.value.get(field.type) : undefined }
function configSchema(field: Field) {
  const schema = customType(field)?.config_schema
  return schema && configFields(schema).length ? schema : undefined
}
function hasFormConfig(field: Field) {
  const custom = customType(field)
  return !!custom?.config_schema || ['dec', 'quantity', 'ref', 'time', 'record'].includes(custom?.form ?? field.form ?? '') || !!field.config
}
function indexOptions(field: Field) {
  const custom = customType(field)
  const form = custom?.form ?? field.form ?? 'text'
  return indexes.filter(({ value }) => value === 'none' || (
    (!custom?.indexes || custom.indexes.includes(value)) && form !== 'record' &&
    (value !== 'number' || numericForms.includes(form) || field.type === 'option')
  ))
}
function clearInvalidIndex(field: Field) {
  if (field.index && !indexOptions(field).some(option => option.value === field.index)) delete field.index
}
function setKind(field: Field, value: string) {
  const custom = descriptors.value.get(value)
  if (custom) {
    if (custom.id === field.type) return
    field.type = custom.id
    field.form = custom.form
    delete field.options
    delete field.config
    clearInvalidIndex(field)
    return
  }
  if (customType(field)) delete field.config
  const special: Record<string, Field['form']> = { option: 'text', principal: 'ref', item: 'ref', rank: 'text', rich_text: 'text', formula: 'int', rollup: 'int', counter: 'int' }
  if (special[value]) { field.type = value; field.form = special[value] }
  else { delete field.type; field.form = value as Field['form'] }
  if (value !== 'option') delete field.options
  else field.options ??= []
  if (value === 'rich_text') field.config = { format: 'json' }
  clearInvalidIndex(field)
}
function setResultForm(field: Field, form: Field['form']) {
  field.form = form
  clearInvalidIndex(field)
}
function setReferenceTarget(field: Field, target?: string) {
  const config = { ...field.config }
  if (target) config.item_type = target
  else delete config.item_type
  field.config = Object.keys(config).length ? config : undefined
}
function reorder(index: number, delta: number) {
  move(fields.value, index, delta)
  for (const type of props.draft.item_types ?? []) { const present = new Set(type.fields); type.fields = fields.value.filter(f => present.has(f.code)).map(f => f.code) }
}
function rename(field: Field, input: HTMLInputElement) {
  try { renameField(props.draft, field, input.value); delete reason.value[field.code] }
  catch (e) { reason.value[field.code] = (e as Error).message; input.value = field.code }
}
function startAdd() {
  newKind.value = 'text'
  placement.value = currentType.value ? [currentType.value.id] : []
}
function add(title: string) {
  const slug = title.normalize('NFKD').replace(/\p{Mark}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  const base = (/^[a-z]/.test(slug) ? slug : `field_${slug || 'new'}`).slice(0, 40)
  let code = base, suffix = 2
  while (fields.value.some(field => field.code === code)) {
    const ending = '_' + suffix++
    code = base.slice(0, 40 - ending.length) + ending
  }
  const field: Field = { code, title, form: 'text', cardinality: 'one' }
  setKind(field, newKind.value)
  ;(props.draft.fields ??= []).push(field)
  for (const type of props.draft.item_types ?? []) if (placement.value.includes(type.id)) type.fields.push(code)
  if (currentType.value && !placement.value.includes(currentType.value.id)) emit('update:itemType', '')
  openedField.value = code
}
const openedField = ref('')
</script>
<template>
  <section class="work-stack" aria-label="Fields editor">
    <div class="work-form-actions work-wrap">
      <Select :model-value="currentType?.id ?? ''" aria-label="Filter fields by item type" placeholder="All item types" appendTo="self" optionLabel="label" optionValue="value"
        :options="[{ value: '', label: 'All item types' }, ...typeChoices]" @update:model-value="emit('update:itemType', $event)" />
      <AddDefinitionRow action="Add field" label="Field name" :maxlength="255" regular @open="startAdd" @add="add">
        <label class="work-stack work-tight">Kind<Select v-model="newKind" aria-label="New field kind" appendTo="self" :options="kindOptions" optionLabel="label" optionValue="value" /></label>
        <ChipPicker v-if="typeChoices.length" label="Show on item types" :options="typeChoices" v-model="placement" />
      </AddDefinitionRow>
    </div>
    <p v-if="!shown.length" class="work-settings-card work-muted">No fields here yet. Add a field to capture information.</p>
    <DefinitionList v-reorder columns="fields" :count="shown.length">
    <DefinitionRow :title="fieldTitle(field)" :initial-open="openedField === field.code" :kind="customType(field)?.title || forms.find(f => f.value === kind(field))?.label || humanize(kind(field))"
      v-for="({ field, index }) in shown" :key="field.id ?? index" class="work-field-row work-reorder-entry work-stack">
      <template #handle><Button type="button" class="work-reorder-handle work-icon-button" :aria-label="'Drag ' + fieldTitle(field) + ' or use the arrow keys to reorder'" @keydown.up.prevent="reorder(index, -1)" @keydown.down.prevent="reorder(index, 1)" severity="secondary" text size="small"><Icon icon="tabler:grip-vertical" aria-hidden="true" /></Button></template>
      <template #flags><Tag v-if="field.track" class="kx-tag-sm" severity="secondary" value="Tracked" /><Tag v-if="field.intervals" class="kx-tag-sm" severity="secondary" value="Intervals" /></template>
      <template #usage><span class="work-muted work-small">{{ usedBy(field.code).length ? usedBy(field.code).join(', ') : 'Unused' }}</span></template>
      <template #actions><Button :aria-label="'Move ' + fieldTitle(field) + ' earlier'" severity="secondary" :disabled="index === 0" @click="reorder(index, -1)" text size="small"><Icon icon="tabler:arrow-up" aria-hidden="true" /></Button><Button :aria-label="'Move ' + fieldTitle(field) + ' later'" severity="secondary" :disabled="index === fields.length - 1" @click="reorder(index, 1)" text size="small"><Icon icon="tabler:arrow-down" aria-hidden="true" /></Button></template>
      <p v-if="reason[field.code]" class="work-error work-small" role="alert">{{ reason[field.code] }}</p>
      <p v-for="issue in issues?.filter(i => i.code === field.code) ?? []" :key="issue.what" class="work-error work-small" role="alert">{{ changeReason(issue) }}</p>
      <div class="work-settings-grid work-field-properties">
        <label class="work-stack work-tight">Title<InputText v-model="field.title" aria-label="Field title" maxlength="255" :placeholder="fieldTitle(field)" /></label>
        <label class="work-stack work-tight">Kind<Select aria-label="Kind" :model-value="kind(field)" @update:model-value="setKind(field, $event)" appendTo="self" :options="kindOptions" optionLabel="label" optionValue="value" /></label>
        <label class="work-stack work-tight">Values allowed<Select aria-label="Values allowed" :model-value="field.cardinality ?? 'one'" @update:model-value="field.cardinality = $event" appendTo="self" :options="[{ label: 'One value', value: 'one' }, { label: 'Multiple unique values', value: 'set' }, { label: 'Ordered values', value: 'list' }]" optionLabel="label" optionValue="value" /></label>
      </div>
      <label v-if="field.type === 'item'" class="work-stack work-tight">Which items can be referenced?
        <Select :model-value="field.config?.item_type ?? ''" aria-label="Reference target" appendTo="self" optionLabel="label" optionValue="value"
          :options="[{ value: '', label: 'Any item type' }, ...typeChoices]" @update:model-value="setReferenceTarget(field, $event)" />
        <span class="work-muted work-small">A reference stores the selected item as a value. To show a named relationship on both items, use Links.</span>
      </label>
      <ConfigForm v-if="configSchema(field)" :key="field.type" :schema="configSchema(field)!" :model-value="field.config ?? emptyConfig" @update:model-value="field.config = $event" @validity="emit('validity', 'config-' + index, $event)" />
      <OptionsEditor v-if="field.type === 'option'" :field="field" @validity="(valid, key) => emit('validity', key, valid)" />
      <label v-if="field.type === 'formula' || field.type === 'rollup'" class="work-stack work-tight">Result type<Select :model-value="field.form" @update:model-value="setResultForm(field, $event)" aria-label="Result type" :options="forms.slice(0, 8)" optionLabel="label" optionValue="value" appendTo="self" /></label>
      <label v-if="field.type === 'formula'" class="work-stack work-tight">Expression<InputText v-model="field.expression" aria-label="Expression" /></label>
      <template v-if="field.type === 'rollup'"><label class="work-stack work-tight">Of<InputText v-model="field.of" aria-label="Related items" /></label><label class="work-stack work-tight">Function<InputText v-model="field.fn" aria-label="Calculation" /></label><label class="work-stack work-tight">Field<InputText v-model="field.field" aria-label="Calculated field" /></label><label class="work-stack work-tight">Order by<Select :model-value="field.by" aria-label="Rollup order" :options="['rank', 'time']" showClear appendTo="self" @update:model-value="field.by = $event || undefined" /></label><ConditionEditor v-model="field.where" :draft="draft" :board-id="boardId" label="Include related items when" @validity="emit('validity', 'rollup-' + index, $event)" /></template>
      <Disclosure class="work-disclosure" label="Advanced field settings">
        <div class="work-stack">
        <label class="work-stack work-tight">Field identifier for integrations<InputText :value="field.code" aria-label="Field code" required pattern="[a-z][a-z0-9_]*" @input="rename(field, $event.target as HTMLInputElement)" />
        </label>
        <label class="work-stack work-tight">Allow filters to use<Select aria-label="Allow filters to use" :model-value="field.index ?? 'none'" @update:model-value="field.index = $event" appendTo="self" :options="indexOptions(field)" optionLabel="label" optionValue="value" /></label>

      <section class="work-stack work-tight work-field-history"><h4 class="work-group-title">History</h4><div class="work-settings-list"><div class="work-settings-row"><div class="work-row-main"><strong>Track changes</strong><p class="work-muted work-small">Record each value change in the item history.</p></div><ToggleSwitch v-model="field.track" aria-label="Track changes" /></div><div class="work-settings-row"><div class="work-row-main"><strong>Track intervals</strong><p class="work-muted work-small">Measure how long each value stays in effect.</p></div><ToggleSwitch v-model="field.intervals" aria-label="Track intervals" /></div></div></section>
      <JsonInput v-if="!configSchema(field) && hasFormConfig(field)" label="Field configuration" :model-value="field.config" shape="object" @update:model-value="field.config = $event as Field['config']" @validity="emit('validity', 'config-' + index, $event)" />
      <section class="work-stack"><h4 class="work-group-title">Access</h4><HoldersPicker :board-id="boardId" v-for="mode in (['read', 'write'] as const)" :key="mode" :label="mode === 'read' ? 'Who can read' : 'Who can edit'" :model-value="field.access?.[mode]" @update:model-value="field.access = { ...field.access, [mode]: $event }" @validity="emit('validity', 'access-' + index + mode, $event)" /></section>
          <Button label="Remove field" severity="danger" text :disabled="!!removing" @click="remove(field)" />
        </div>
      </Disclosure>
    </DefinitionRow>
    </DefinitionList>
  </section>
</template>
