<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { FIELD_WIDTHS, fieldWidth, humanize } from '../../forms'
import { moveField as move } from '../../state'
import AddSchemaCode from './AddSchemaCode.vue'
import DefinitionList from '../../shared/DefinitionList.vue'
import DefinitionRow from '../../shared/DefinitionRow.vue'
import NativeDialog from '../../shared/NativeDialog.vue'
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
import { computed, nextTick, ref, toRaw, useId, watch } from 'vue'
import { fieldTypeTitle, humanLabel } from '../../shared/labels'
import { Icon } from '@iconify/vue'
import type { AspectDecl, AttributeDecl, Declaration, RemoveDecl, SchemaOptions, SchemaView, TypeOption } from '../../types'
import ChipPicker from './ChipPicker.vue'
import ConfigForm from './ConfigForm.vue'
import DefaultValue from './DefaultValue.vue'

const props = defineProps<{ draft: Declaration; schema: SchemaView; options: SchemaOptions }>()
const family = defineModel<string>('family', { default: '' })
const emit = defineEmits<{ remove: [kind: keyof RemoveDecl, id: string] }>()

const WIDTHS = FIELD_WIDTHS.map(width => width.value)
const CARDINALITIES = [{ value: 'one', label: 'Single value' }, { value: 'list', label: 'Ordered list' }, { value: 'set', label: 'Unique set' }]

const canEdit = computed(() => props.schema.access.admin)
const aspects = computed(() => props.draft.aspects ?? [])
const families = computed(() => (props.draft.families ?? []).filter(f => f.code !== 'generic'))
watch(families, current => {
  if (family.value && !current.some(entry => entry.code === family.value)) family.value = ''
}, { immediate: true })
const familyOptions = computed(() => [{ value: '', label: 'All families' }, ...families.value.map(f => ({ value: f.code, label: humanize(f.code) }))])
const visibleAspects = computed(() => {
  const selected = families.value.find(f => f.code === family.value)
  return selected ? aspects.value.filter(a => selected.aspects?.includes(a.namespace)) : aspects.value
})
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
function isMedia(attr: AttributeDecl): boolean {
  return typeOf(attr)?.target === 'asset'
}
function isLink(attr: AttributeDecl): boolean {
  const t = typeOf(attr)
  return !!t && t.form === 'ref' && !t.target
}
function usedBy(namespace: string): string[] {
  return families.value.filter(f => f.aspects?.includes(namespace)).map(f => humanize(f.code))
}
function usage(namespace: string) {
  const users = usedBy(namespace)
  return !users.length ? 'Unused by families' : users.length === 1 ? users[0] : users.length + ' families'
}
const indexes: Record<string, string> = { none: 'None', key: 'Exact match', number: 'Number range', text: 'Text search' }


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
  if (isMedia(attr)) delete attr.default
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

const groupSettings = ref<AspectDecl>()
const groupSettingsTitle = computed(() => groupSettings.value ? humanize(groupSettings.value.namespace) + ' settings' : '')

async function reorder(event: MouseEvent, attributes: AttributeDecl[], index: number, target: number) {
  const control = event.currentTarget as HTMLButtonElement
  const actions = control.parentElement
  move(attributes, index, target)
  await nextTick()
  // At either end, focus the remaining arrow on the moved row.
  const nextControl = control.isConnected ? control : actions?.querySelector('button')
  nextControl?.focus({ preventScroll: true })
}
function addAspect(namespace: string) {
  (props.draft.aspects ??= []).push({ namespace, attributes: [] })
}
function removeAspect(a: AspectDecl) {
  groupSettings.value = undefined
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
  const committed = attr.id === undefined ? undefined : props.schema.declaration.aspects?.find(group => group.namespace === a.namespace)?.attributes?.find(field => field.id === attr.id)
  if (committed) emit('remove', 'attributes', a.namespace + '.' + committed.code)
}

</script>

<template>
  <div class="pim-stack">
    <div v-if="families.length || (canEdit && !family)" class="pim-ia-action">
      <Select v-if="families.length" v-model="family" class="pim-family-filter" aria-label="Show fields for a family" placeholder="All families" :options="familyOptions" option-label="label" option-value="value" append-to="self" />
      <AddSchemaCode v-if="canEdit && !family" label="Field group name" action="Add field group" from-name regular
        :existing="aspects.map(a => a.namespace)" @add="addAspect" />
    </div>
    <p v-if="family && !visibleAspects.length" class="form pim-card-body pad muted">This family has no field groups yet. Open the family to choose which groups it uses.</p>
    <DefinitionList v-for="a in visibleAspects" :key="a.namespace" :count="a.attributes?.length ?? 0" :columns="['kind', 'details', 'usage']" :show-actions="canEdit">
      <template #head>
        <header class="pim-bsection-head pim-list-header">
          <div>
            <h3>{{ humanize(a.namespace) }}</h3>
            <p class="small muted">{{ usedBy(a.namespace).length ? 'Used by ' + usedBy(a.namespace).join(', ') : 'Unused by families' }}</p>
          </div>
          <div class="row pim-list-actions">
            <AddSchemaCode v-if="canEdit" label="Field name" action="Add field" from-name :existing="a.attributes?.map(field => field.code)" @add="addAttribute(a, $event)" />
            <Button type="button" :aria-label="humanize(a.namespace) + ' settings'" :title="humanize(a.namespace) + ' settings'"
              aria-haspopup="dialog" severity="secondary" text size="small" @click="groupSettings = a">
              <Icon icon="tabler:settings" aria-hidden="true" />
            </Button>
          </div>
        </header>
      </template>
      <DefinitionRow v-for="(attr, i) in a.attributes ?? []" :key="key(a.namespace, attr)"
        v-model:open="open[key(a.namespace, attr)]" :title="humanize(attr.code)"
        :kind="fieldTypeTitle(typeOf(attr))" :usage="usage(a.namespace)"
        class="pim-attr" head-class="pim-attr-row" toggle-class="field-toggle">
        <template #details>
          <Tag v-if="attr.cardinality && attr.cardinality !== 'one'" class="kx-tag-sm" severity="secondary">{{ CARDINALITIES.find(c => c.value === attr.cardinality)?.label }}</Tag>
          <Tag v-if="attr.scope?.length" class="kx-tag-sm" severity="secondary">per {{ attr.scope.map(humanize).join(', ') }}</Tag>
          <Tag v-if="attr.index && attr.index !== 'none'" class="kx-tag-sm" severity="secondary">{{ indexes[attr.index] || 'Filterable' }}</Tag>
          <Tag v-if="attr.unique" class="kx-tag-sm" severity="secondary">unique</Tag>
        </template>
        <template v-if="canEdit" #actions>
          <Button v-if="i > 0" type="button" :aria-label="'Move ' + humanize(attr.code) + ' earlier'" @click="reorder($event, a.attributes!, i, i - 1)" text size="small" severity="secondary"><Icon icon="tabler:arrow-up" aria-hidden="true" /></Button>
          <Button v-if="i < (a.attributes?.length ?? 0) - 1" type="button" class="pim-move-later" :aria-label="'Move ' + humanize(attr.code) + ' later'" @click="reorder($event, a.attributes!, i, i + 1)" text size="small" severity="secondary"><Icon icon="tabler:arrow-down" aria-hidden="true" /></Button>
        </template>
          <div class="pim-fields">
            <div class="pim-f pim-w-third"><div class="pim-f-label"><label :id="fieldId(a.namespace, attr, 'type')">Type</label></div>
              <Select :disabled="!canEdit"
                :aria-labelledby="fieldId(a.namespace, attr, 'type')"
                :model-value="attr.type"
                :options="typeOptions" option-label="label" option-value="value" appendTo="self"
                @update:model-value="setType(attr, $event)"
              /></div>
            <div class="pim-f pim-w-third"><div class="pim-f-label"><label :id="fieldId(a.namespace, attr, 'values')">Values</label></div>
              <Select :disabled="!canEdit"
                :aria-labelledby="fieldId(a.namespace, attr, 'values')"
                :model-value="attr.cardinality ?? 'one'"
                :options="CARDINALITIES" option-label="label" option-value="value" appendTo="self"
                @update:model-value="setOptional(attr, 'cardinality', $event === 'one' ? undefined : $event)"
              /></div>
            <div v-if="isTerm(attr)" class="pim-f pim-w-third"><div class="pim-f-label"><label :id="fieldId(a.namespace, attr, 'vocabulary')">Vocabulary</label></div>
              <Select :disabled="!canEdit" :aria-labelledby="fieldId(a.namespace, attr, 'vocabulary')" :model-value="attr.vocabulary ?? ''" @update:model-value="setOptional(attr, 'vocabulary', $event)" :options="[{ value: '', label: 'Choose…' }, ...(vocabularies).map((v) => ({ value: v, label: humanize(v) }))]" option-label="label" option-value="value" appendTo="self" /></div>
            <p v-if="isMedia(attr)" class="pim-f pim-w-full muted small">Choose the media types and file size this field accepts. Catalog readers can access attached files.</p>
            <p v-else-if="typeOf(attr)?.form === 'ref' && !isTerm(attr)" class="pim-f pim-w-full muted small">
              {{ isLink(attr) ? 'A link points to something managed by an installed plugin.' : 'A product reference points to another product in this catalog.' }}
            </p>
            <div v-if="isLink(attr)" class="pim-f pim-w-third"><div class="pim-f-label"><label :id="fieldId(a.namespace, attr, 'link')">Link destination</label><span class="pim-f-note">choose what the field can point to</span></div>
              <Select :disabled="!canEdit" :aria-labelledby="fieldId(a.namespace, attr, 'link')" :model-value="(attr.config?.target as string) ?? ''" @update:model-value="setTarget(attr, $event)" :options="[{ value: '', label: 'Choose…' }, ...(options.link_kinds).map((k) => ({ value: k.kind, label: humanLabel(k.title, 'Link kind') }))]" option-label="label" option-value="value" appendTo="self" /></div>
            <div class="pim-f pim-w-third"><div class="pim-f-label"><label :id="fieldId(a.namespace, attr, 'width')">Width</label><span class="pim-f-note">of a form row</span></div>
              <SelectButton :disabled="!canEdit" :aria-labelledby="fieldId(a.namespace, attr, 'width')" :model-value="fieldWidth(schema, a.namespace, attr)" :options="WIDTHS" :allow-empty="false" @update:model-value="attr.width = $event" /></div>
            <div class="pim-f pim-w-half"><div class="pim-f-label"><label :id="fieldId(a.namespace, attr, 'scope')">Varies per</label><span class="pim-f-note">dimensions the value depends on</span></div>
              <ChipPicker :disabled="!canEdit" :labelledby="fieldId(a.namespace, attr, 'scope')" :model-value="attr.scope ?? []" :options="dimensions" @update:model-value="setScope(attr, $event)" /></div>
            <div v-if="!isMedia(attr)" class="pim-f pim-w-half" role="group" :aria-labelledby="fieldId(a.namespace, attr, 'default')"><div class="pim-f-label"><label :id="fieldId(a.namespace, attr, 'default')">Default</label><span class="pim-f-note">when no value is set</span></div>
              <DefaultValue :disabled="!canEdit" :attribute="attr" :type="typeOf(attr)" @change="setOptional(attr, 'default', $event)" /></div>
            <div v-if="typeOf(attr)?.config_schema" class="pim-f pim-w-full" role="group" :aria-labelledby="fieldId(a.namespace, attr, 'config')"><div class="pim-f-label"><label :id="fieldId(a.namespace, attr, 'config')">Type configuration</label></div>
              <ConfigForm :disabled="!canEdit" :schema="typeOf(attr)!.config_schema!" :model-value="attr.config ?? {}" @update:model-value="setConfig(attr, $event)" /></div>
          </div>
          <Disclosure class="pim-field-advanced pim-ia-disclosure" label="Advanced">
            <div class="pim-fields">
              <div class="pim-f pim-w-third"><div class="pim-f-label"><label :for="fieldId(a.namespace, attr, 'code')">Integration key</label><span v-if="attr.id !== undefined" class="pim-f-note">renaming keeps stored values</span></div>
                <InputText :disabled="!canEdit" :id="fieldId(a.namespace, attr, 'code')" type="text" :value="attr.code" @input="attr.code = ($event.target as HTMLInputElement).value" class="mono" /></div>
            <div class="pim-f pim-w-third"><div class="pim-f-label"><label :id="fieldId(a.namespace, attr, 'index')">Search and filters</label><span class="pim-f-note">choose how this field can be matched</span></div>
              <Select :disabled="!canEdit"
                :aria-labelledby="fieldId(a.namespace, attr, 'index')"
                :model-value="attr.index ?? 'none'" :options="(typeOf(attr)?.indexes ?? ['none']).map(value => ({ value, label: indexes[value] || humanize(value) }))" option-label="label" option-value="value" appendTo="self"
                @update:model-value="setOptional(attr, 'index', $event === 'none' ? undefined : $event)"
              /></div>
            <div class="pim-f pim-w-half"><div class="pim-f-label"><label :for="fieldId(a.namespace, attr, 'unique')">Unique</label><span class="pim-f-note">one holder per value, catalog wide</span></div>
              <div class="row"><ToggleSwitch :input-id="fieldId(a.namespace, attr, 'unique')" :model-value="attr.unique === true" :disabled="!canEdit || !!attr.scope?.length || (attr.cardinality ?? 'one') !== 'one'" @update:model-value="setOptional(attr, 'unique', $event)" /><span>{{ attr.unique ? 'Yes' : 'No' }}</span></div></div>
            <div v-if="(attr.scope?.length ?? 0) > 0 && attr.index && attr.index !== 'none'" class="pim-f pim-w-full"><div class="pim-f-label"><label :id="fieldId(a.namespace, attr, 'contexts')">Filterable combinations</label><span class="pim-f-note">which combinations get an index</span></div>
              <div class="pim-contexts" role="group" :aria-labelledby="fieldId(a.namespace, attr, 'contexts')">
                <div v-for="(tuple, ti) in contexts(attr)" :key="ti" class="pim-context-row">
                  <div v-for="d in attr.scope" :key="d" class="pim-context-field"><span :id="fieldId(a.namespace, attr, 'context-' + ti + '-' + d)" class="small muted">{{ humanize(d) }}</span>
                    <Select :disabled="!canEdit"
                      :aria-labelledby="fieldId(a.namespace, attr, 'context-' + ti + '-' + d)"
                      :model-value="tuple[d] ?? ''" :options="membersOf(d)" class="narrow" appendTo="self"
                      @update:model-value="tuple[d] = $event"
                    /></div>
                  <Button v-if="canEdit" type="button" aria-label="Remove context" @click="contexts(attr).splice(ti, 1)" text severity="secondary" size="small"><Icon icon="tabler:x" /></Button>
                </div>
                <Button v-if="canEdit" type="button" @click="addContext(attr)" severity="secondary" outlined size="small"><Icon icon="tabler:plus" aria-hidden="true" /> Add context</Button>
              </div></div>
            </div>
          </Disclosure>
          <div v-if="canEdit" class="row end"><Button type="button" @click="removeAttribute(a, attr)" text severity="secondary" size="small"><Icon icon="tabler:trash" /> Remove field</Button></div>
      </DefinitionRow>
    </DefinitionList>
    <NativeDialog :visible="!!groupSettings" :label="groupSettingsTitle" @close="groupSettings = undefined">
      <section v-if="groupSettings" class="pim-ia-dialog" @keydown.esc.prevent="groupSettings = undefined">
        <header class="pim-ia-dialog-head"><h2 tabindex="-1" autofocus>{{ groupSettingsTitle }}</h2></header>
        <div class="pim-source-permissions">
          <label :id="fieldPrefix + '-writers'">Sources allowed to write</label>
          <MultiSelect :disabled="!canEdit" :aria-labelledby="fieldPrefix + '-writers'"
            :model-value="groupSettings.write?.sources ?? []" :options="sources"
            option-label="label" option-value="value" placeholder="Any source" append-to="self"
            @update:model-value="groupSettings.write = { sources: $event }" />
        </div>
        <footer class="dialog-actions pim-group-dialog-actions">
          <Button v-if="canEdit" type="button" label="Remove field group" severity="danger" text @click="removeAspect(groupSettings)" />
          <Button type="button" label="Done" severity="secondary" outlined @click="groupSettings = undefined" />
        </footer>
      </section>
    </NativeDialog>
  </div>
</template>
