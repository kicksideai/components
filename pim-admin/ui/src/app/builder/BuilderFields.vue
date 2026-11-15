<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { CODE } from '../../state'
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
import { computed, ref } from 'vue'
import { humanLabel } from '../../shared/labels'
import { Icon } from '@iconify/vue'
import type { AspectDecl, AttributeDecl, Declaration, RemoveDecl, SchemaOptions, SchemaView, TypeOption, Width } from '../../types'
import { humanize } from '../../forms'
import ChipPicker from './ChipPicker.vue'
import ConfigForm from './ConfigForm.vue'
import DefaultValue from './DefaultValue.vue'

const props = defineProps<{ draft: Declaration; schema: SchemaView; options: SchemaOptions }>()
const emit = defineEmits<{ remove: [kind: keyof RemoveDecl, id: string] }>()

const WIDTHS: Width[] = ['quarter', 'third', 'half', 'full']
const CARDINALITIES = ['one', 'list', 'set']

const aspects = computed(() => props.draft.aspects ?? [])
const dimensions = computed(() => (props.draft.dimensions ?? []).map((d) => ({ value: d.name, label: humanize(d.name) })))
const vocabularies = computed(() => (props.draft.vocabularies ?? []).map((v) => v.code))
const sources = computed(() => (props.draft.sources ?? []).map((s) => ({ value: s.id, label: humanize(s.id) })))
const typeOptions = computed(() => [...props.options.types]
  .sort((a, b) => a.form.localeCompare(b.form))
  .map(t => ({ value: t.id, label: typeTitle(t) })))
function typeOf(attr: AttributeDecl): TypeOption | undefined {
  return props.options.types.find((t) => t.id === attr.type)
}
function typeTitle(t: TypeOption): string {
  return humanLabel(t.title, 'Field type')
}
function isTerm(attr: AttributeDecl): boolean {
  return typeOf(attr)?.target === 'term'
}
function isLink(attr: AttributeDecl): boolean {
  const t = typeOf(attr)
  return !!t && t.form === 'ref' && !t.target
}
function populated(ns: string, attr: AttributeDecl): boolean {
  return attr.id !== undefined && props.schema.attributes[ns + '.' + attr.code] !== undefined
}

function usage(namespace: string): string {
  const count = (props.draft.families ?? []).filter(f => f.aspects?.includes(namespace)).length
  return count + (count === 1 ? ' family' : ' families')
}

// open tracks which attribute rows show their full editor.
const open = ref<Record<string, boolean>>({})
function key(ns: string, attr: AttributeDecl): string {
  return ns + '.' + (attr.id ?? attr.code)
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
  if (dims.length) delete attr.default
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
const newAspect = ref('')
function addAspect() {
  const ns = newAspect.value.trim()
  if (!CODE.test(ns) || aspects.value.some((a) => a.namespace === ns)) return
  (props.draft.aspects ??= []).push({ namespace: ns, attributes: [] })
  newAspect.value = ''
}
function removeAspect(a: AspectDecl) {
  const i = aspects.value.indexOf(a)
  if (i >= 0) aspects.value.splice(i, 1)
  if (props.schema.declaration.aspects?.some((x) => x.namespace === a.namespace)) emit('remove', 'aspects', a.namespace)
}
const newCode = ref<Record<string, string>>({})
function addAttribute(a: AspectDecl) {
  const code = (newCode.value[a.namespace] ?? '').trim()
  const list = a.attributes ?? (a.attributes = [])
  if (!CODE.test(code) || list.some((x) => x.code === code)) return
  const text = props.options.types.find((t) => t.id === 'kickside.pim.types:text') ?? props.options.types[0]
  const attr: AttributeDecl = { code, type: text?.id ?? '' }
  list.push(attr)
  newCode.value[a.namespace] = ''
  open.value[key(a.namespace, attr)] = true
}
function removeAttribute(a: AspectDecl, attr: AttributeDecl) {
  const list = a.attributes ?? []
  const i = list.indexOf(attr)
  if (i >= 0) list.splice(i, 1)
  if (populated(a.namespace, attr)) emit('remove', 'attributes', a.namespace + '.' + attr.code)
}
function move(list: AttributeDecl[], from: number, to: number) {
  if (to < 0 || to >= list.length) return
  const [item] = list.splice(from, 1)
  list.splice(to, 0, item)
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
            <span class="small muted">Leave empty to allow any source to write this aspect.</span>
          </div>
        </div>
        <Button type="button" @click="removeAspect(a)" text severity="secondary" size="small"><Icon icon="tabler:trash" /> Remove aspect</Button>
      </header>
      </template>
      <DefinitionRow v-for="(attr, i) in a.attributes ?? []" :key="key(a.namespace, attr)"
        v-model:open="open[key(a.namespace, attr)]" :title="humanize(attr.code)" :code="a.namespace + '.' + attr.code"
        :kind="typeOf(attr) ? typeTitle(typeOf(attr)!) : 'Unknown type'" :usage="usage(a.namespace)"
        class="pim-attr" head-class="pim-attr-row" toggle-class="field-toggle"
        @head-dragover.prevent @head-drop.prevent="drop(a, i)" @head-keydown.alt.up.prevent="move(a.attributes ?? [], i, i - 1)" @head-keydown.alt.down.prevent="move(a.attributes ?? [], i, i + 1)">
        <template #handle><span class="pim-grip" draggable="true" aria-hidden="true" @click.stop @dragstart.stop="dragging = { namespace: a.namespace, index: i }" @dragend="dragging = null"><Icon icon="tabler:grip-vertical" /></span></template>
        <template #details>
          <Tag v-if="attr.cardinality && attr.cardinality !== 'one'" class="kx-tag-sm" severity="secondary">{{ attr.cardinality }}</Tag>
          <Tag v-if="attr.scope?.length" class="kx-tag-sm" severity="secondary">per {{ attr.scope.join(', ') }}</Tag>
          <Tag v-if="attr.index && attr.index !== 'none'" class="kx-tag-sm" severity="secondary">{{ attr.index }} index</Tag>
          <Tag v-if="attr.unique" class="kx-tag-sm" severity="secondary">unique</Tag>
        </template>
        <template #actions>
          <Button type="button" :disabled="i === 0" :aria-label="'Move ' + attr.code + ' earlier'" @click="move(a.attributes!, i, i - 1)" text severity="secondary" size="small"><Icon icon="tabler:arrow-up" /></Button>
          <Button type="button" :disabled="i === (a.attributes?.length ?? 0) - 1" :aria-label="'Move ' + attr.code + ' later'" @click="move(a.attributes!, i, i + 1)" text severity="secondary" size="small"><Icon icon="tabler:arrow-down" /></Button>
        </template>
          <div class="pim-fields">
            <div class="pim-f pim-w-third"><div class="pim-f-label"><label>Code</label><span v-if="populated(a.namespace, attr)" class="pim-f-note">renames keep values</span></div><InputText type="text" :value="attr.code" @input="attr.code = ($event.target as HTMLInputElement).value" class="mono" /></div>
            <div class="pim-f pim-w-third"><div class="pim-f-label"><label>Type</label><span v-if="populated(a.namespace, attr)" class="pim-f-note">fixed once values exist</span></div>
              <Select
                :model-value="attr.type" :disabled="populated(a.namespace, attr)"
                :options="typeOptions" option-label="label" option-value="value" appendTo="self"
                @update:model-value="setType(attr, $event)"
              /></div>
            <div class="pim-f pim-w-third"><div class="pim-f-label"><label>Cardinality</label></div>
              <Select
                :model-value="attr.cardinality ?? 'one'" :disabled="populated(a.namespace, attr)"
                :options="CARDINALITIES" appendTo="self"
                @update:model-value="setOptional(attr, 'cardinality', $event === 'one' ? undefined : $event)"
              /></div>
            <div v-if="isTerm(attr)" class="pim-f pim-w-third"><div class="pim-f-label"><label>Vocabulary</label></div>
              <Select :model-value="attr.vocabulary ?? ''" @update:model-value="setOptional(attr, 'vocabulary', $event)" :options="[{ value: '', label: 'Choose…' }, ...(vocabularies).map((v) => ({ value: v, label: String(v) }))]" option-label="label" option-value="value" appendTo="self" /></div>
            <div v-if="isLink(attr)" class="pim-f pim-w-third"><div class="pim-f-label"><label>Link kind</label><span class="pim-f-note">owned by a plugin</span></div>
              <Select :model-value="(attr.config?.target as string) ?? ''" @update:model-value="setTarget(attr, $event)" :options="[{ value: '', label: 'Choose…' }, ...(options.link_kinds).map((k) => ({ value: k.kind, label: humanLabel(k.title, 'Link kind') }))]" option-label="label" option-value="value" appendTo="self" /></div>
            <div class="pim-f pim-w-third"><div class="pim-f-label"><label>Index</label><span class="pim-f-note">for filters and keys</span></div>
              <Select
                :model-value="attr.index ?? 'none'" :options="typeOf(attr)?.indexes ?? ['none']" appendTo="self"
                @update:model-value="setOptional(attr, 'index', $event === 'none' ? undefined : $event)"
              /></div>
            <div class="pim-f pim-w-third"><div class="pim-f-label"><label>Width</label><span class="pim-f-note">of a form row</span></div>
              <SelectButton :model-value="attr.width ?? schema.attributes[a.namespace + '.' + attr.code]?.width ?? 'half'" :options="WIDTHS" :allow-empty="false" @update:model-value="attr.width = $event" /></div>
            <div class="pim-f pim-w-half"><div class="pim-f-label"><label>Varies per</label><span class="pim-f-note">dimensions the value depends on</span></div>
              <ChipPicker :model-value="attr.scope ?? []" :options="dimensions" :disabled="populated(a.namespace, attr)" @update:model-value="setScope(attr, $event)" /></div>
            <div class="pim-f pim-w-half"><div class="pim-f-label"><label>Unique</label><span class="pim-f-note">one holder per value, catalog wide</span></div>
              <label class="row"><ToggleSwitch :aria-label="'Unique ' + attr.code" :model-value="attr.unique === true" :disabled="!!attr.scope?.length || (attr.cardinality ?? 'one') !== 'one'" @update:model-value="setOptional(attr, 'unique', $event)" /><span>{{ attr.unique ? 'Yes' : 'No' }}</span></label></div>
            <div v-if="(attr.scope?.length ?? 0) > 0 && attr.index && attr.index !== 'none'" class="pim-f pim-w-full"><div class="pim-f-label"><label>Indexed contexts</label><span class="pim-f-note">which combinations get an index</span></div>
              <div class="pim-contexts">
                <div v-for="(tuple, ti) in contexts(attr)" :key="ti" class="pim-context-row">
                  <label v-for="d in attr.scope" :key="d" class="pim-context-field"><span class="small muted">{{ humanize(d) }}</span>
                    <Select
                      :model-value="tuple[d] ?? ''" :options="membersOf(d)" class="narrow" appendTo="self"
                      @update:model-value="tuple[d] = $event"
                    /></label>
                  <Button type="button" aria-label="Remove context" @click="contexts(attr).splice(ti, 1)" text severity="secondary" size="small"><Icon icon="tabler:x" /></Button>
                </div>
                <Button type="button" @click="addContext(attr)" severity="secondary" outlined size="small"><Icon icon="tabler:plus" aria-hidden="true" /> Add context</Button>
              </div></div>
            <div v-if="!attr.scope?.length" class="pim-f pim-w-half"><div class="pim-f-label"><label>Default</label><span class="pim-f-note">when no value is set</span></div>
              <DefaultValue :attribute="attr" :type="typeOf(attr)" @change="setOptional(attr, 'default', $event)" /></div>
            <div v-if="typeOf(attr)?.config_schema" class="pim-f pim-w-full"><div class="pim-f-label"><label>Type configuration</label></div>
              <ConfigForm :schema="typeOf(attr)!.config_schema!" :model-value="attr.config ?? {}" @update:model-value="setConfig(attr, $event)" /></div>
          </div>
          <div class="row end"><Button type="button" @click="removeAttribute(a, attr)" text severity="secondary" size="small"><Icon icon="tabler:trash" /> Remove field</Button></div>
      </DefinitionRow>
      <template #add><div class="row pim-add-row">
          <InputText v-model="newCode[a.namespace]" type="text" placeholder="new_field" @keydown.enter.prevent="addAttribute(a)" class="mono" />
          <Button type="button" :disabled="!CODE.test(newCode[a.namespace] ?? '')" @click="addAttribute(a)" severity="secondary" outlined size="small"><Icon icon="tabler:plus" aria-hidden="true" /> Add field</Button>
      </div></template>
    </DefinitionList>
    <section class="form">
      <div class="pim-aspect row pim-add-row">
        <InputText v-model="newAspect" type="text" placeholder="new_aspect" @keydown.enter.prevent="addAspect" class="mono" />
        <Button type="button" :disabled="!CODE.test(newAspect)" @click="addAspect" severity="secondary" outlined size="small"><Icon icon="tabler:plus" aria-hidden="true" /> Add aspect</Button>
        <span class="muted small">An aspect groups fields and can be written by named sources only.</span>
      </div>
    </section>
  </div>
</template>
