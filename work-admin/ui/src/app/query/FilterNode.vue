<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { record } from '../../values'
import { Icon } from '@iconify/vue'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { fieldTitle } from '../../forms'
import { computed, ref, watch } from 'vue'
import Button from 'primevue/button'
import { filterFields, operators, type Filter } from './model'
import OperandControl from './OperandControl.vue'
import type { Field, Schema } from '../../types'
const props = defineProps<{ boardId: string; schema: Schema; modelValue: Filter; path?: string; depth?: number; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: Filter]; validity: [valid: boolean] }>()
const path = computed(() => props.path ?? 'where'), level = computed(() => props.depth ?? 1)
const kind = computed(() => ['and', 'or', 'not', 'history', 'match', 'rel', 'children'].find(k => k in props.modelValue) ?? 'field')
const fields = computed(() => filterFields(props.schema))
const field = computed<Field>(() => fields.value.find(f => f.code === props.modelValue.field) ?? { code: 'value', form: 'text' })
const history = computed(() => record(props.modelValue.history))
const historyField = computed<Field>(() => fields.value.find(f => f.code === history.value.field) ?? { code: 'history', form: 'text' })
const children = computed<Filter[]>(() => Array.isArray(props.modelValue[kind.value]) ? props.modelValue[kind.value] as Filter[] : [])
const defaultLeaf = (): Filter => ({ field: 'category', op: 'eq', value: 'unstarted' })
const invalid = ref(new Set<string>())
function validity(key: string, valid: boolean) { if (valid) invalid.value.delete(key); else invalid.value.add(key); emit('validity', invalid.value.size === 0) }
watch(kind, () => { invalid.value.clear(); emit('validity', true) })
function removeChild(index: number) {
  const next = new Set<string>()
  for (const key of invalid.value) { const childIndex = Number(key); if (!Number.isNaN(childIndex) && childIndex !== index) next.add(String(childIndex > index ? childIndex - 1 : childIndex)) }
  invalid.value = next; emit('validity', next.size === 0)
  patch({ [kind.value]: children.value.filter((_, i) => i !== index) })
}
function replace(value: Filter) { emit('update:modelValue', value) }
function patch(value: Filter) { replace({ ...props.modelValue, ...value }) }
function choose(value: string) {
  replace(value === 'field' ? defaultLeaf() : value === 'and' || value === 'or' ? { [value]: [defaultLeaf()] } : value === 'not' ? { not: defaultLeaf() } : value === 'history' ? { history: { field: 'state', changed: true } } : value === 'match' ? { match: '' } : value === 'children' ? { children: true, q: 'some', where: defaultLeaf() } : { rel: props.schema.compiled.relation_types?.[0]?.id ?? '', dir: 'outward', q: 'some', where: defaultLeaf() })
}
function child(index: number, value: Filter) { patch({ [kind.value]: children.value.map((node, i) => i === index ? value : node) }) }
function setHistory(key: string, value: unknown) { const next = { ...history.value }; if (value === undefined) { delete next[key]; validity(key, true) } else next[key] = value; patch({ history: next }) }
function historyMode(value: string) { invalid.value.clear(); emit('validity', true); const next = { ...history.value }; delete next.was; delete next.changed; delete next.from; delete next.to; next[value] = value === 'changed' ? true : ''; patch({ history: next }) }
const textField: Field = { code: 'actor', form: 'text' }, timeField: Field = { code: 'at', form: 'time' }
const during = computed<unknown[]>(() => Array.isArray(history.value.during) ? history.value.during : [])
function bound(index: number, value: unknown) { const next = [...during.value]; next[index] = value; setHistory('during', next) }
</script>
<template>
  <fieldset class="work-filter-node" :disabled="disabled"><legend class="work-small work-mono">{{ path }}</legend><label class="work-row work-small">Condition<Select :aria-label="path + ' condition'" :model-value="kind" @update:model-value="choose($event)" appendTo="self" optionLabel="label" optionValue="value" optionDisabled="disabled" :options="[{ label: 'Field', value: 'field', disabled: false }, ...(['and', 'or', 'not', 'history', 'rel', 'children', 'match']).map((k) => ({ label: (k), value: k, disabled: level >= 6 && ['and', 'or', 'not', 'rel', 'children'].includes(k) }))]" /></label>
    <template v-if="kind === 'and' || kind === 'or'"><div v-for="(node, i) in children" :key="i" class="work-stack work-tight"><FilterNode :board-id="boardId" :schema="schema" :model-value="node" :path="path + '.' + kind + '[' + i + ']'" :depth="level + 1" @update:model-value="child(i, $event)" @validity="validity(String(i), $event)" /><Button label="Remove condition" size="small" severity="secondary" @click="removeChild(i)" outlined><template #icon><Icon icon="tabler:trash" aria-hidden="true" /></template></Button></div><Button label="Add condition" size="small" severity="secondary" :disabled="level >= 6" @click="patch({ [kind]: [...children, defaultLeaf()] })" outlined><template #icon><Icon icon="tabler:plus" aria-hidden="true" /></template></Button></template>
    <FilterNode v-else-if="kind === 'not'" :board-id="boardId" :schema="schema" :model-value="record(modelValue.not)" :path="path + '.not'" :depth="level + 1" @update:model-value="patch({ not: $event })" @validity="validity('nested', $event)" />
    <template v-else-if="kind === 'field'"><div class="work-row work-wrap"><label>Field<Select :aria-label="path + ' field'" :model-value="modelValue.field" @update:model-value="patch({ field: $event, op: 'eq', value: undefined })" appendTo="self" optionLabel="label" optionValue="value" optionDisabled="disabled" :options="[...(fields ?? []).map((f) => ({ label: (fieldTitle(f)), value: f.code, disabled: false }))]" /></label><label>Operator<Select :aria-label="path + ' operator'" :model-value="modelValue.op" @update:model-value="patch({ op: $event, value: $event === 'is_null' ? true : undefined })" appendTo="self" :options="operators(field)" /></label></div>
      <OperandControl :board-id="boardId" :field="modelValue.op === 'is_null' ? { code: 'null', form: 'bool' } : field" :model-value="modelValue.value" :multiple="['in', 'nin', 'between'].includes(String(modelValue.op))" :label="path + ' value'" @update:model-value="patch({ value: $event })" @validity="validity('value', $event)" /></template>
    <label v-else-if="kind === 'match'">Search<InputText :aria-label="path + ' search'" :value="modelValue.match" @input="patch({ match: ($event.target as HTMLInputElement).value })" /></label>
    <template v-else-if="kind === 'history'"><div class="work-row work-wrap"><label>Field<Select :aria-label="path + ' history field'" :model-value="history.field" @update:model-value="setHistory('field', $event)" appendTo="self" optionLabel="label" optionValue="value" optionDisabled="disabled" :options="[...(fields ?? []).map((f) => ({ label: (fieldTitle(f)), value: f.code, disabled: false }))]" /></label><label>History<Select :aria-label="path + ' history mode'" :model-value="history.changed ? 'changed' : 'was'" @update:model-value="historyMode($event)" appendTo="self" optionLabel="label" optionValue="value" optionDisabled="disabled" :options="[{ label: 'Changed', value: 'changed', disabled: false }, { label: 'Was', value: 'was', disabled: false }]" /></label></div>
      <template v-if="history.changed"><div v-for="key in ['from', 'to']" :key="key"><label class="work-row"><Checkbox :model-value="key in history" :aria-label="'Constrain ' + key" @update:model-value="setHistory(key, $event ? '' : undefined)" binary />{{ key }}</label><OperandControl v-if="key in history" :board-id="boardId" :field="historyField" :model-value="history[key]" :label="path + ' history ' + key" @update:model-value="setHistory(key, $event)" @validity="validity(key, $event)" /></div></template>
      <OperandControl v-else :board-id="boardId" :field="historyField" :model-value="history.was" :label="path + ' history was'" @update:model-value="setHistory('was', $event)" @validity="validity('was', $event)" />
      <label class="work-row"><Checkbox :model-value="'by' in history" aria-label="Constrain actor" @update:model-value="setHistory('by', $event ? { $actor: 'id' } : undefined)" binary />By actor</label><OperandControl v-if="'by' in history" :board-id="boardId" :field="textField" :model-value="history.by" :label="path + ' history by'" @update:model-value="setHistory('by', $event)" />
      <label class="work-row"><Checkbox :model-value="'during' in history" aria-label="Constrain time window" @update:model-value="setHistory('during', $event ? [{ $now: '-P30D' }, { $now: 'P0D' }] : undefined)" binary />During</label><div v-if="'during' in history" class="work-row work-wrap"><OperandControl v-for="(label, index) in ['start', 'end']" :key="label" :board-id="boardId" :field="timeField" :model-value="during[index]" :label="path + ' during ' + label" @update:model-value="bound(index, $event)" /></div>
    </template>
    <template v-else><div class="work-row work-wrap"><template v-if="kind === 'rel'"><label>Relation<Select :model-value="modelValue.rel" @update:model-value="patch({ rel: $event })" appendTo="self" optionLabel="label" optionValue="value" optionDisabled="disabled" :options="[...(schema.compiled.relation_types ?? []).map((rel) => ({ label: (rel.outward ?? rel.id), value: rel.id, disabled: false }))]" /></label><label>Direction<Select :model-value="modelValue.dir" @update:model-value="patch({ dir: $event })" appendTo="self" optionLabel="label" optionValue="value" optionDisabled="disabled" :options="[{ label: 'Outward', value: 'outward', disabled: false }, { label: 'Inward', value: 'inward', disabled: false }]" /></label></template><label>Quantifier<Select :model-value="modelValue.q" @update:model-value="patch({ q: $event })" appendTo="self" :options="['some', 'every', 'none']" /></label></div><FilterNode :board-id="boardId" :schema="schema" :model-value="record(modelValue.where)" :path="path + '.where'" :depth="level + 1" @update:model-value="patch({ where: $event })" @validity="validity('nested', $event)" /></template>
  </fieldset>
</template>
