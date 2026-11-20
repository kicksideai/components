<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { FIELD_WIDTHS, fieldWidth, humanize } from '../../forms'
import { moveField as move } from '../../state'
import AddSchemaCode from './AddSchemaCode.vue'
import DefinitionList from '../../shared/DefinitionList.vue'
import DefinitionRow from '../../shared/DefinitionRow.vue'
import MultiSelect from 'primevue/multiselect'
import SelectButton from 'primevue/selectbutton'
import Tag from 'primevue/tag'
import ToggleSwitch from 'primevue/toggleswitch'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
// Aspects and their attributes. Each aspect is a section of the draft; each
// attribute row edits the declaration fields the engine understands, with the
// options the registry offers: types, their indexes and config, link kinds.
import { computed, ref, toRaw, useId } from 'vue'
import { fieldTypeTitle, humanLabel } from '../../shared/labels'
import { Icon } from '@iconify/vue'
import type { AspectDecl, AttributeDecl, Declaration, RemoveDecl, SchemaOptions, SchemaView, TypeOption } from '../../types'
import ChipPicker from './ChipPicker.vue'
import ConfigForm from './ConfigForm.vue'
import DefaultValue from './DefaultValue.vue'

const props = defineProps<{ draft: Declaration; schema: SchemaView; options: SchemaOptions }>()
const emit = defineEmits<{ remove: [kind: keyof RemoveDecl, id: string] }>()

const WIDTHS = FIELD_WIDTHS.map(width => width.value)
const CARDINALITIES = [{ value: 'one', label: 'Single value' }, { value: 'list', label: 'Ordered list' }, { value: 'set', label: 'Unique set' }]

const aspects = computed(() => props.draft.aspects ?? [])
const dimensions = computed(() => (props.draft.dimensions ?? []).map((d) => ({ value: d.name, label: humanize(d.name) })))
const vocabularies = computed(() => (props.draft.vocabularies ?? []).map((v) => v.code))
const sources = computed(() => (props.draft.sources ?? []).map((s) => ({ value: s.id, label: humanize(s.id) })))
const typeOptions = computed(() => [...props.options.types]
  .sort((a, b) => a.form.localeCompare(b.form))
  .map(t => ({ value: t.id, label: fieldTypeTitle(t) })))
function typeOf(attr: AttributeDecl): TypeOption | undefined {
  return props.options.types.find((t) => t.id === attr.type)
}
function isTerm(attr: AttributeDecl): boolean {
  return typeOf(attr)?.target === 'term'
}
function isLink(attr: AttributeDecl): boolean {
  const t = typeOf(attr)
  return !!t && t.form === 'ref' && !t.target
}
function declared(ns: string, attr: AttributeDecl): boolean {
  return attr.id !== undefined && props.schema.attributes[ns + '.' + attr.code] !== undefined
}

function usage(namespace: string): string {
  const count = (props.draft.families ?? []).filter(f => f.aspects?.includes(namespace)).length
  return count + (count === 1 ? ' family' : ' families')
}

// open tracks which attribute rows show their full editor.
const open = ref<Record<string, boolean>>({})
const fieldPrefix = useId()
const draftKeys = new WeakMap<AttributeDecl, number>()
let draftCount = 0
function key(ns: string, attr: AttributeDecl): string {
  if (attr.id !== undefined) return ns + '.' + attr.id
  const draft = toRaw(attr)
  let draftKey = draftKeys.get(draft)
  if (draftKey === undefined) {
    draftKey = ++draftCount
    draftKeys.set(draft, draftKey)
  }
  return ns + '.draft-' + draftKey
}
function fieldId(ns: string, attr: AttributeDecl, name: string): string {
  return fieldPrefix + '-' + key(ns, attr) + '-' + name
}

function setType(attr: AttributeDecl, id: string) {
  attr.type = id
  const t = typeOf(attr)
  if (t && attr.index && !t.indexes.includes(attr.index)) delete attr.index
  if (!isTerm(attr)) delete attr.vocabulary
  if (!isLink(attr) && attr.config && 'target' in attr.config) {
    const { target: _target, ...rest } = attr.config
    attr.config = Object.keys(rest).length ? rest : undefined
    if (!attr.config) delete attr.config
  }
}
function setConfig(attr: AttributeDecl, value: Record<string, unknown>) {
  if (Object.keys(value).length) attr.config = value
  else delete attr.config
}
function setTarget(attr: AttributeDecl, kind: string) {
  const config = { ...(attr.config ?? {}) }
  if (kind) config.target = kind
  else delete config.target
  setConfig(attr, config)
}
function setScope(attr: AttributeDecl, dims: string[]) {
  if (dims.length) attr.scope = dims
  else delete attr.scope
  if (!dims.length) delete attr.index_contexts
}
function setOptional<K extends keyof AttributeDecl>(attr: AttributeDecl, k: K, v: AttributeDecl[K] | undefined | '') {
  if (v === undefined || v === '' || (v === false && k !== 'default')) delete attr[k]
  else attr[k] = v as AttributeDecl[K]
}

// index contexts: one tuple per row, a member per scoped dimension.
function contexts(attr: AttributeDecl): Record<string, string>[] {
  return attr.index_contexts ?? []
}
function membersOf(dim: string): string[] {
  return (props.draft.dimensions ?? []).find((d) => d.name === dim)?.members ?? []
}
function addContext(attr: AttributeDecl) {
  const tuple: Record<string, string> = {}
  for (const d of attr.scope ?? []) tuple[d] = membersOf(d)[0] ?? ''
  const list = attr.index_contexts ?? (attr.index_contexts = [])
  list.push(tuple)
}

const dragging = ref<{ namespace: string; index: number } | null>(null)
function drop(a: AspectDecl, index: number) {
  if (dragging.value?.namespace === a.namespace) move(a.attributes ?? [], dragging.value.index, index)
  dragging.value = null
}
function addAspect(namespace: string) {
  (props.draft.aspects ??= []).push({ namespace, attributes: [] })
}
function removeAspect(a: AspectDecl) {
  const i = aspects.value.indexOf(a)
  if (i >= 0) aspects.value.splice(i, 1)
  if (props.schema.declaration.aspects?.some((x) => x.namespace === a.namespace)) emit('remove', 'aspects', a.namespace)
}
function addAttribute(a: AspectDecl, code: string) {
  const text = props.options.types.find((t) => t.id === 'kickside.pim.types:text') ?? props.options.types[0]
  const attr: AttributeDecl = { code, type: text?.id ?? '' }
  ;(a.attributes ??= []).push(attr)
  open.value[key(a.namespace, attr)] = true
}
function removeAttribute(a: AspectDecl, attr: AttributeDecl) {
  const list = a.attributes ?? []
  const i = list.indexOf(attr)
  if (i >= 0) list.splice(i, 1)
  if (declared(a.namespace, attr)) emit('remove', 'attributes', a.namespace + '.' + attr.code)
}

</script>

<template>
  <div class="pim-stack">
    <DefinitionList v-for="a in aspects" :key="a.namespace" :count="a.attributes?.length ?? 0" :columns="['code', 'kind', 'details', 'usage']">
      <template #head>
      <header class="pim-bsection-head">
        <div>
          <h3>{{ humanize(a.namespace) }}<span v-if="humanize(a.namespace).toLocaleLowerCase() !== a.namespace.toLocaleLowerCase()" class="mono muted small"> {{ a.namespace }}</span></h3>
          <div class="pim-source-permissions">
            <label :for="'writers-' + a.namespace">Sources allowed to write</label>
            <MultiSelect :input-id="'writers-' + a.namespace" aria-label="Sources allowed to write" :model-value="a.write?.sources ?? []" :options="sources" option-label="label" option-value="value" placeholder="Any source" appendTo="self" @update:model-value="a.write = { sources: $event }" />
            <span class="small muted">Leave empty to allow any source to write this field group.</span>
          </div>
        </div>
        <Button type="button" @click="removeAspect(a)" text severity="secondary" size="small"><Icon icon="tabler:trash" /> Remove field group</Button>
      </header>
      </template>
      <DefinitionRow v-for="(attr, i) in a.attributes ?? []" :key="key(a.namespace, attr)"
        v-model:open="open[key(a.namespace, attr)]" :title="humanize(attr.code)" :code="a.namespace + '.' + attr.code"
        :kind="fieldTypeTitle(typeOf(attr))" :usage="usage(a.namespace)"
        class="pim-attr" head-class="pim-attr-row" toggle-class="field-toggle"
        @head-dragover.prevent @head-drop.prevent="drop(a, i)" @head-keydown.alt.up.prevent="move(a.attributes ?? [], i, i - 1)" @head-keydown.alt.down.prevent="move(a.attributes ?? [], i, i + 1)">
        <template #handle><span class="pim-grip" draggable="true" aria-hidden="true" @click.stop @dragstart.stop="dragging = { namespace: a.namespace, index: i }" @dragend="dragging = null"><Icon icon="tabler:grip-vertical" /></span></template>
        <template #details>
          <Tag v-if="attr.cardinality && attr.cardinality !== 'one'" class="kx-tag-sm" severity="secondary">{{ CARDINALITIES.find(c => c.value === attr.cardinality)?.label }}</Tag>
          <Tag v-if="attr.scope?.length" class="kx-tag-sm" severity="secondary">per {{ attr.scope.join(', ') }}</Tag>
          <Tag v-if="attr.index && attr.index !== 'none'" class="kx-tag-sm" severity="secondary">{{ attr.index }} index</Tag>
          <Tag v-if="attr.unique" class="kx-tag-sm" severity="secondary">unique</Tag>
        </template>
        <template #actions>
          <Button type="button" :disabled="i === 0" :aria-label="'Move ' + attr.code + ' earlier'" @click="move(a.attributes!, i, i - 1)" text severity="secondary" size="small"><Icon icon="tabler:arrow-up" /></Button>
          <Button type="button" :disabled="i === (a.attributes?.length ?? 0) - 1" :aria-label="'Move ' + attr.code + ' later'" @click="move(a.attributes!, i, i + 1)" text severity="secondary" size="small"><Icon icon="tabler:arrow-down" /></Button>
        </template>
          <div class="pim-fields">
            <div class="pim-f pim-w-third"><div class="pim-f-label"><label :for="fieldId(a.namespace, attr, 'code')">Code</label><span v-if="declared(a.namespace, attr)" class="pim-f-note">renames keep values</span></div>
              <InputText :id="fieldId(a.namespace, attr, 'code')" type="text" :value="attr.code" @input="attr.code = ($event.target as HTMLInputElement).value" class="mono" /></div>
            <div class="pim-f pim-w-third"><div class="pim-f-label"><label :id="fieldId(a.namespace, attr, 'type')">Type</label></div>
              <Select
                :aria-labelledby="fieldId(a.namespace, attr, 'type')"
                :model-value="attr.type"
                :options="typeOptions" option-label="label" option-value="value" appendTo="self"
                @update:model-value="setType(attr, $event)"
              /></div>
            <div class="pim-f pim-w-third"><div class="pim-f-label"><label :id="fieldId(a.namespace, attr, 'values')">Values</label></div>
              <Select
                :aria-labelledby="fieldId(a.namespace, attr, 'values')"
                :model-value="attr.cardinality ?? 'one'"
                :options="CARDINALITIES" option-label="label" option-value="value" appendTo="self"
                @update:model-value="setOptional(attr, 'cardinality', $event === 'one' ? undefined : $event)"
              /></div>
            <div v-if="isTerm(attr)" class="pim-f pim-w-third"><div class="pim-f-label"><label :id="fieldId(a.namespace, attr, 'vocabulary')">Vocabulary</label></div>
              <Select :aria-labelledby="fieldId(a.namespace, attr, 'vocabulary')" :model-value="attr.vocabulary ?? ''" @update:model-value="setOptional(attr, 'vocabulary', $event)" :options="[{ value: '', label: 'Choose…' }, ...(vocabularies).map((v) => ({ value: v, label: String(v) }))]" option-label="label" option-value="value" appendTo="self" /></div>
            <div v-if="isLink(attr)" class="pim-f pim-w-third"><div class="pim-f-label"><label :id="fieldId(a.namespace, attr, 'link')">Link kind</label><span class="pim-f-note">owned by a plugin</span></div>
              <Select :aria-labelledby="fieldId(a.namespace, attr, 'link')" :model-value="(attr.config?.target as string) ?? ''" @update:model-value="setTarget(attr, $event)" :options="[{ value: '', label: 'Choose…' }, ...(options.link_kinds).map((k) => ({ value: k.kind, label: humanLabel(k.title, 'Link kind') }))]" option-label="label" option-value="value" appendTo="self" /></div>
            <div class="pim-f pim-w-third"><div class="pim-f-label"><label :id="fieldId(a.namespace, attr, 'index')">Index</label><span class="pim-f-note">for filters and keys</span></div>
              <Select
                :aria-labelledby="fieldId(a.namespace, attr, 'index')"
                :model-value="attr.index ?? 'none'" :options="typeOf(attr)?.indexes ?? ['none']" appendTo="self"
                @update:model-value="setOptional(attr, 'index', $event === 'none' ? undefined : $event)"
              /></div>
            <div class="pim-f pim-w-third"><div class="pim-f-label"><label :id="fieldId(a.namespace, attr, 'width')">Width</label><span class="pim-f-note">of a form row</span></div>
              <SelectButton :aria-labelledby="fieldId(a.namespace, attr, 'width')" :model-value="fieldWidth(schema, a.namespace, attr)" :options="WIDTHS" :allow-empty="false" @update:model-value="attr.width = $event" /></div>
            <div class="pim-f pim-w-half"><div class="pim-f-label"><label :id="fieldId(a.namespace, attr, 'scope')">Varies per</label><span class="pim-f-note">dimensions the value depends on</span></div>
              <ChipPicker :labelledby="fieldId(a.namespace, attr, 'scope')" :model-value="attr.scope ?? []" :options="dimensions" @update:model-value="setScope(attr, $event)" /></div>
            <div class="pim-f pim-w-half"><div class="pim-f-label"><label :for="fieldId(a.namespace, attr, 'unique')">Unique</label><span class="pim-f-note">one holder per value, catalog wide</span></div>
              <div class="row"><ToggleSwitch :input-id="fieldId(a.namespace, attr, 'unique')" :model-value="attr.unique === true" :disabled="!!attr.scope?.length || (attr.cardinality ?? 'one') !== 'one'" @update:model-value="setOptional(attr, 'unique', $event)" /><span>{{ attr.unique ? 'Yes' : 'No' }}</span></div></div>
            <div v-if="(attr.scope?.length ?? 0) > 0 && attr.index && attr.index !== 'none'" class="pim-f pim-w-full"><div class="pim-f-label"><label :id="fieldId(a.namespace, attr, 'contexts')">Indexed contexts</label><span class="pim-f-note">which combinations get an index</span></div>
              <div class="pim-contexts" role="group" :aria-labelledby="fieldId(a.namespace, attr, 'contexts')">
                <div v-for="(tuple, ti) in contexts(attr)" :key="ti" class="pim-context-row">
                  <div v-for="d in attr.scope" :key="d" class="pim-context-field"><span :id="fieldId(a.namespace, attr, 'context-' + ti + '-' + d)" class="small muted">{{ humanize(d) }}</span>
                    <Select
                      :aria-labelledby="fieldId(a.namespace, attr, 'context-' + ti + '-' + d)"
                      :model-value="tuple[d] ?? ''" :options="membersOf(d)" class="narrow" appendTo="self"
                      @update:model-value="tuple[d] = $event"
                    /></div>
                  <Button type="button" aria-label="Remove context" @click="contexts(attr).splice(ti, 1)" text severity="secondary" size="small"><Icon icon="tabler:x" /></Button>
                </div>
                <Button type="button" @click="addContext(attr)" severity="secondary" outlined size="small"><Icon icon="tabler:plus" aria-hidden="true" /> Add context</Button>
              </div></div>
            <div class="pim-f pim-w-half" role="group" :aria-labelledby="fieldId(a.namespace, attr, 'default')"><div class="pim-f-label"><label :id="fieldId(a.namespace, attr, 'default')">Default</label><span class="pim-f-note">when no value is set</span></div>
              <DefaultValue :attribute="attr" :type="typeOf(attr)" @change="setOptional(attr, 'default', $event)" /></div>
            <div v-if="typeOf(attr)?.config_schema" class="pim-f pim-w-full" role="group" :aria-labelledby="fieldId(a.namespace, attr, 'config')"><div class="pim-f-label"><label :id="fieldId(a.namespace, attr, 'config')">Type configuration</label></div>
              <ConfigForm :schema="typeOf(attr)!.config_schema!" :model-value="attr.config ?? {}" @update:model-value="setConfig(attr, $event)" /></div>
          </div>
          <div class="row end"><Button type="button" @click="removeAttribute(a, attr)" text severity="secondary" size="small"><Icon icon="tabler:trash" /> Remove field</Button></div>
      </DefinitionRow>
      <template #add>
        <AddSchemaCode label="Field code" action="Add field" :existing="a.attributes?.map(field => field.code)" @add="addAttribute(a, $event)" />
      </template>
    </DefinitionList>
    <section class="form">
      <AddSchemaCode class="pim-aspect" label="Field group code" action="Add field group"
        :existing="aspects.map(a => a.namespace)" @add="addAspect" />
    </section>
  </div>
</template>
