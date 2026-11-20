<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import DefinitionRow from './DefinitionRow.vue'
import DefinitionList from './DefinitionList.vue'
import ToggleSwitch from 'primevue/toggleswitch'
import ConditionEditor from './ConditionEditor.vue'
import HoldersPicker from './HoldersPicker.vue'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import { computed, ref } from 'vue'
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
const props = defineProps<{ draft: Declaration; guardRemoval?: RemovalGuard; issues?: SchemaChange[]; boardId?: string; installedTypes?: FieldTypeOption[] }>()
const emit = defineEmits<{ validity: [key: string, valid: boolean] }>()
const fields = computed(() => props.draft.fields ?? [])
const code = ref(''), removing = ref(''), reason = ref<Record<string, string>>({})
const vReorder = useReorder((from, to) => reorder(from, to - from))
function usedBy(code: string) { return (props.draft.item_types ?? []).filter(t => t.fields.includes(code)).map(t => t.title || humanize(t.id)) }
async function remove(field: Field) {
  if (removing.value) return
  removing.value = field.code
  try { const refusal = await props.guardRemoval?.('fields', field.code); reason.value[field.code] = refusal ?? ''; if (!refusal) removeEntry(props.draft, 'fields', field.code) }
  finally { removing.value = '' }
}
const forms = Object.entries({ text: 'Text', int: 'Whole number', dec: 'Decimal number', quantity: 'Measurement', bool: 'Yes or no', time: 'Date or time', ref: 'Reference', record: 'Structured data', option: 'Choice', principal: 'Person or group', item: 'Work item', rank: 'Order', rich_text: 'Formatted text', formula: 'Formula', rollup: 'Related item calculation', counter: 'Counter' }).map(([value, label]) => ({ value, label }))
function kind(field: Field) { return field.type && field.type !== 'value' ? field.type : field.form ?? 'text' }
const installed = computed(() => new Map(props.installedTypes?.map(type => [type.id, type])))
function configSchema(field: Field) {
  const schema = installed.value.get(kind(field))?.config_schema
  return schema && configFields(schema).length ? schema : undefined
}
function hasFormConfig(field: Field) {
  const type = installed.value.get(kind(field))
  const form = type?.form ?? field.form
  return !!type?.config_schema || ['dec', 'quantity', 'ref', 'time', 'record'].includes(form ?? '') || !!field.config
}
function setCustomType(field: Field, type: string) {
  field.type = type
  delete field.form
}
function setKind(field: Field, value: string) {
  const special: Record<string, Field['form']> = { option: 'text', principal: 'ref', item: 'ref', rank: 'text', rich_text: 'text', formula: 'int', rollup: 'int', counter: 'int' }
  if (special[value]) { field.type = value; field.form = special[value] }
  else { delete field.type; field.form = value as Field['form'] }
  if (value !== 'option') delete field.options
  else field.options ??= []
  if (value === 'rich_text') field.config = { format: 'json' }
}
function reorder(index: number, delta: number) {
  move(fields.value, index, delta)
  for (const type of props.draft.item_types ?? []) { const present = new Set(type.fields); type.fields = fields.value.filter(f => present.has(f.code)).map(f => f.code) }
}
function rename(field: Field, input: HTMLInputElement) {
  try { renameField(props.draft, field, input.value); delete reason.value[field.code] }
  catch (e) { reason.value[field.code] = (e as Error).message; input.value = field.code }
}
function add() { if (!/^[a-z][a-z0-9_]*$/.test(code.value) || fields.value.some(f => f.code === code.value)) return; (props.draft.fields ??= []).push({ code: code.value, form: 'text', cardinality: 'one' }); code.value = '' }
</script>
<template>
  <section class="work-stack" aria-label="Fields editor">
    <header class="work-section-heading"><div><h2>Fields</h2><p class="work-muted work-small">Shape the information each item carries. Drag the handle or use the arrows to arrange fields.</p></div><Tag class="kx-tag-sm" severity="secondary">{{ fields.length }} {{ fields.length === 1 ? 'field' : 'fields' }}</Tag></header>
    <DefinitionList v-reorder columns="fields" :count="fields.length">
    <DefinitionRow :title="fieldTitle(field)" :code="field.code" :kind="installed.get(kind(field))?.title || forms.find(f => f.value === kind(field))?.label || humanize(kind(field))" v-for="(field, index) in fields" :key="field.id ?? index" class="work-field-row work-reorder-entry work-stack">
      <template #handle><Button type="button" class="work-reorder-handle work-icon-button" :aria-label="'Drag ' + field.code + '; arrow keys reorder'" @keydown.up.prevent="reorder(index, -1)" @keydown.down.prevent="reorder(index, 1)" severity="secondary" text size="small"><Icon icon="tabler:grip-vertical" aria-hidden="true" /></Button></template>
      <template #flags><Tag v-if="field.track" class="kx-tag-sm" severity="secondary" value="Tracked" /><Tag v-if="field.intervals" class="kx-tag-sm" severity="secondary" value="Intervals" /></template>
      <template #usage><details v-if="usedBy(field.code).length" class="work-used-by"><summary class="kx-tag-sm">Used by {{ usedBy(field.code).length }} {{ usedBy(field.code).length === 1 ? 'type' : 'types' }}</summary><span class="work-small work-muted">{{ usedBy(field.code).join(', ') }}</span></details></template>
      <template #actions><Button :aria-label="'Move ' + field.code + ' earlier'" severity="secondary" :disabled="index === 0" @click="reorder(index, -1)" text size="small"><Icon icon="tabler:arrow-up" aria-hidden="true" /></Button><Button :aria-label="'Move ' + field.code + ' later'" severity="secondary" :disabled="index === fields.length - 1" @click="reorder(index, 1)" text size="small"><Icon icon="tabler:arrow-down" aria-hidden="true" /></Button><Button severity="secondary" text size="small" :disabled="!!removing" @click="remove(field)" aria-label="Remove field"><Icon icon="tabler:trash" aria-hidden="true" /></Button></template>
      <p v-if="reason[field.code]" class="work-error work-small" role="alert">{{ reason[field.code] }}</p>
<p v-for="issue in issues?.filter(i => i.code === field.code) ?? []" :key="issue.what" class="work-error work-small" role="alert">{{ changeReason(issue) }} · {{ issue.what }}</p>
      <div class="work-settings-grid work-field-properties">
        <label class="work-stack work-tight">Title<InputText v-model="field.title" aria-label="Field title" maxlength="255" :placeholder="fieldTitle(field)" /></label>
        <label class="work-stack work-tight">Field identifier<InputText :value="field.code" aria-label="Field code" required pattern="[a-z][a-z0-9_]*" @input="rename(field, $event.target as HTMLInputElement)" />
        </label>
        <label class="work-stack work-tight">Kind<Select :model-value="kind(field)" @update:model-value="setKind(field, $event)" appendTo="self" :options="forms" optionLabel="label" optionValue="value" /></label>
        <label class="work-stack work-tight">Values allowed<Select :model-value="field.cardinality ?? 'one'" @update:model-value="field.cardinality = $event" appendTo="self" :options="[{ label: 'One value', value: 'one' }, { label: 'Multiple unique values', value: 'set' }, { label: 'Ordered values', value: 'list' }]" optionLabel="label" optionValue="value" /></label>
        <label class="work-stack work-tight">Search support<Select :model-value="field.index ?? 'none'" @update:model-value="field.index = $event" appendTo="self" :options="[{ label: 'None', value: 'none' }, { label: 'Exact matches', value: 'key' }, { label: 'Numeric ranges', value: 'number' }]" optionLabel="label" optionValue="value" /></label>

      </div>
      <section class="work-stack work-tight work-field-history"><h4 class="work-group-title">History</h4><div class="work-settings-list"><div class="work-settings-row"><div class="work-row-main"><strong>Track changes</strong><p class="work-muted work-small">Record each value change in the item history.</p></div><ToggleSwitch v-model="field.track" aria-label="Track changes" /></div><div class="work-settings-row"><div class="work-row-main"><strong>Track intervals</strong><p class="work-muted work-small">Measure how long each value stays in effect.</p></div><ToggleSwitch v-model="field.intervals" aria-label="Track intervals" /></div></div></section>
      <OptionsEditor v-if="field.type === 'option'" :field="field" @validity="(valid, key) => emit('validity', key, valid)" />
      <label v-if="field.type === 'formula' || field.type === 'rollup'" class="work-stack work-tight">Result type<Select v-model="field.form" aria-label="Result type" :options="forms.slice(0, 8)" optionLabel="label" optionValue="value" appendTo="self" /></label>
      <label v-if="field.type === 'formula'" class="work-stack work-tight">Expression<InputText v-model="field.expression" /></label>
      <template v-if="field.type === 'rollup'"><label class="work-stack work-tight">Of<InputText v-model="field.of" /></label><label class="work-stack work-tight">Function<InputText v-model="field.fn" /></label><label class="work-stack work-tight">Field<InputText v-model="field.field" /></label><label class="work-stack work-tight">Order by<Select :model-value="field.by" aria-label="Rollup order" :options="['rank', 'time']" showClear appendTo="self" @update:model-value="field.by = $event || undefined" /></label><ConditionEditor v-model="field.where" :draft="draft" :board-id="boardId" label="Include related items when" @validity="emit('validity', 'rollup-' + index, $event)" /></template>
      <ConfigForm v-if="configSchema(field)" :key="field.type" :schema="configSchema(field)!" :model-value="field.config ?? {}" @update:model-value="field.config = $event" @validity="emit('validity', 'config-' + index, $event)" />
      <JsonInput v-else-if="hasFormConfig(field)" label="Field configuration" :model-value="field.config" shape="object" @update:model-value="field.config = $event as Field['config']" @validity="emit('validity', 'config-' + index, $event)" />
      <section class="work-stack"><h4 class="work-group-title">Access</h4><label v-if="installedTypes?.length" class="work-stack work-tight">Custom field type<Select aria-label="Custom field type" :model-value="field.type" :options="installedTypes" optionLabel="title" optionValue="id" appendTo="self" @update:model-value="setCustomType(field, $event)" /></label><HoldersPicker :board-id="boardId" v-for="mode in (['read', 'write'] as const)" :key="mode" :label="mode === 'read' ? 'Who can read' : 'Who can edit'" :model-value="field.access?.[mode]" @update:model-value="field.access = { ...field.access, [mode]: $event }" @validity="emit('validity', 'access-' + index + mode, $event)" /></section>
    </DefinitionRow>
    <div class="work-row work-add-definition"><label class="work-stack work-tight">New field identifier<InputText v-model="code" @keydown.enter.prevent="add" /></label><Button label="Add field" severity="secondary" :disabled="!code.trim()" @click="add" outlined><template #icon><Icon icon="tabler:plus" aria-hidden="true" /></template></Button></div>
    </DefinitionList>
  </section>
</template>
