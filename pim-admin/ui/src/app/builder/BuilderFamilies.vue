<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { setList } from '../../state'
import AddSchemaCode from './AddSchemaCode.vue'
import DefinitionList from '../../shared/DefinitionList.vue'
import DefinitionRow from '../../shared/DefinitionRow.vue'
import MultiSelect from 'primevue/multiselect'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
// Families: which aspects a product shape carries, how it varies by level,
// and what each channel requirement needs.
import { computed, ref, useId } from 'vue'
import { Icon } from '@iconify/vue'
import type { Declaration, FamilyDecl, RemoveDecl, RequirementDecl, SchemaOptions, SchemaView, VariationDecl } from '../../types'
import { humanize } from '../../forms'
import ChipPicker from './ChipPicker.vue'

const props = defineProps<{ draft: Declaration; schema: SchemaView; options: SchemaOptions }>()
const emit = defineEmits<{ remove: [kind: keyof RemoveDecl, id: string]; fields: [family: string]; 'variant-field': [family: string] }>()
const familyPrefix = useId()
function fieldId(family: FamilyDecl, name: string): string {
  return familyPrefix + '-' + family.code + '-' + name
}
const canEdit = computed(() => props.schema.access.admin)
const families = computed(() => (props.draft.families ?? []).filter((f) => f.code !== 'generic'))
const pluginFields = computed(() => {
  const plugins = new Set(props.draft.plugins?.map(p => p.use))
  return Object.entries(props.schema.attributes).filter(([, field]) => field.plugin && plugins.has(field.plugin))
})
const aspectOptions = computed(() => {
  const declared = (props.draft.aspects ?? []).map((a) => a.namespace)
  const plugin = [...new Set(pluginFields.value.map(([code]) => code.split('.')[0]))]
  return [...declared, ...plugin.filter((p) => !declared.includes(p))].map((ns) => ({ value: ns, label: humanize(ns) }))
})
function fieldGroups(family: FamilyDecl) {
  const options = aspectOptions.value
  const missing = (family.aspects ?? []).filter(value => !options.some(option => option.value === value))
  return [...options, ...missing.map(value => ({ value, label: humanize(value) }))]
}
const typeForms = computed(() => new Map(props.options.types.map(type => [type.id, type.form])))
function fieldOptions(available: string[], selected: string[] = []) {
  const names = new Map<string, number>()
  const fields = [...new Set([...available, ...selected])].map(value => {
    const [group, field] = value.split('.', 2)
    const label = humanize(field ?? group)
    names.set(label, (names.get(label) ?? 0) + 1)
    return { value, label, group: field ? humanize(group) : undefined }
  })
  return fields.map(({ value, label, group }) => ({
    value, label, detail: names.get(label)! > 1 ? group : undefined,
  }))
}
const fieldsByCode = computed(() => {
  const fields = new Map<string, boolean>()
  function add(code: string, form: string | undefined, scope: string[] = [], cardinality = 'one') {
    // compile_family requires one unscoped value and excludes text and records.
    const canBeAxis = !!form && form !== 'text' && form !== 'record' && scope.length === 0 && cardinality === 'one'
    fields.set(code, canBeAxis)
  }
  for (const group of props.draft.aspects ?? []) {
    for (const field of group.attributes ?? []) {
      const code = group.namespace + '.' + field.code
      add(code, typeForms.value.get(field.type), field.scope, field.cardinality)
    }
  }
  for (const [code, field] of pluginFields.value) add(code, field.form, field.scope, field.cardinality)
  return fields
})
function attributesOf(family: FamilyDecl) {
  return [...fieldsByCode.value.keys()].filter(code => family.aspects?.includes(code.split('.')[0]))
}
function variationOptions(family: FamilyDecl, level: VariationDecl, kind: 'axes' | 'own') {
  const selected = level[kind] ?? []
  const claimed = new Set(levels(family).flatMap(other => [...(other.axes ?? []), ...(other.own ?? [])]))
  const options = attributesOf(family).filter(code => selected.includes(code) ||
    (!claimed.has(code) && (kind === 'own' || fieldsByCode.value.get(code))))
  // Keep chips for selections outside the family's current field groups removable.
  return fieldOptions(options, selected)
}
const channels = computed(() => props.draft.channels ?? [])
function channelsFor(family: FamilyDecl, requirement?: string) {
  return channels.value.filter(channel => (!channel.families?.length || channel.families.includes(family.code)) &&
    (!requirement || channel.requirements?.includes(requirement))).map(channel => humanize(channel.id))
}
const dimensions = computed(() => props.draft.dimensions ?? [])
const open = ref<Record<string, boolean>>({})
function add(code: string) {
  (props.draft.families ??= []).push({ code, aspects: [] })
  open.value[code] = true
}
function remove(f: FamilyDecl) {
  props.draft.families!.splice(props.draft.families!.indexOf(f), 1)
  if (props.schema.declaration.families?.some((x) => x.code === f.code)) emit('remove', 'families', f.code)
}
function levels(f: FamilyDecl) {
  return f.variation ?? []
}
function variantChoices(family: FamilyDecl) {
  return levels(family).map(level => ({
    level, axes: variationOptions(family, level, 'axes'), own: variationOptions(family, level, 'own'),
  }))
}
function addLevel(f: FamilyDecl) {
  (f.variation ??= []).push({ axes: [] })
}
function requirements(f: FamilyDecl) {
  return f.requirements ?? []
}
function addRequirement(f: FamilyDecl, id: string) {
  (f.requirements ??= []).push({ id, require: [] })
}
function contextOf(r: RequirementDecl, dim: string): string {
  return r.context?.[dim] ?? ''
}
function setContext(r: RequirementDecl, dim: string, member: string) {
  const ctx = { ...(r.context ?? {}) }
  if (member) ctx[dim] = member
  else delete ctx[dim]
  if (Object.keys(ctx).length) r.context = ctx
  else delete r.context
}
</script>

<template>
  <div class="pim-stack">
    <DefinitionList :count="families.length" :columns="['details']">
      <template v-if="canEdit" #head>
        <AddSchemaCode label="Family name" action="Add family" from-name :existing="families.map(item => item.code)" @add="add" />
      </template>
    <DefinitionRow route-section="families" :route-id="f.code" v-for="f in families" :key="f.code" v-model:open="open[f.code]" :title="humanize(f.code)">
      <template #details>
        <span class="muted small">{{ attributesOf(f).length }} fields</span>
        <Tag v-if="levels(f).length" severity="secondary" :value="levels(f).length + (levels(f).length === 1 ? ' variant level' : ' variant levels')" />
        <span class="muted small">{{ channelsFor(f).join(', ') || 'No release channels' }}</span>
      </template>
      <div class="pim-aspect">
        <div class="pim-ia-action pim-family-fields">
          <div class="pim-f">
            <div class="pim-f-label"><label :id="fieldId(f, 'groups')">Field groups</label></div>
            <p :id="fieldId(f, 'groups-help')" class="muted small pim-axis-help">Choose the groups that appear on this family’s product forms.</p>
            <MultiSelect :disabled="!canEdit" :aria-labelledby="fieldId(f, 'groups')" :aria-describedby="fieldId(f, 'groups-help')"
              :model-value="f.aspects ?? []" :options="fieldGroups(f)" option-label="label" option-value="value"
              placeholder="Choose field groups" display="chip" append-to="self"
              @update:model-value="setList(f, 'aspects', $event)" />
          </div>
          <Button v-if="f.aspects?.length" type="button" label="View family fields" severity="secondary" outlined size="small" @click="emit('fields', f.code)" />
        </div>
      </div>
      <div class="pim-aspect">
        <header class="pim-aspect-head"><h3>Variants</h3></header>
        <p class="muted small pim-axis-help">Choose what makes one variant different from another. Each field can be used once.</p>
        <div class="pim-stack tight">
          <div v-for="({ level, axes, own }, li) in variantChoices(f)" :key="li" class="pim-level">
            <div class="pim-level-head"><strong>Level {{ li + 1 }}</strong><Button v-if="canEdit" type="button" aria-label="Remove level" @click="levels(f).splice(li, 1)" text severity="secondary" size="small"><Icon icon="tabler:x" /></Button></div>
            <div class="pim-fields">
              <div class="pim-f pim-w-half">
                <div class="pim-f-label"><label :id="fieldId(f, li + '-axes')">Distinguish variants by</label></div>
                <p class="muted small pim-axis-help">Use a field with a single value and no dimensions, such as Integer. Text and record fields are excluded.</p>
                <template v-if="canEdit && !axes.length">
                  <p class="muted small pim-axis-help">No eligible field is available in this family. Choose its field group above, or create the field first and choose its group when you return.</p>
                  <Button type="button" label="Create a field in Fields" severity="secondary" outlined size="small"
                    class="pim-form-action" @click="emit('variant-field', f.code)" />
                </template>
                <ChipPicker v-else :disabled="!canEdit" dropdown :labelledby="fieldId(f, li + '-axes')" :model-value="level.axes ?? []"
                  :options="axes" placeholder="Choose a field" @update:model-value="level.axes = $event" />
              </div>
              <div class="pim-f pim-w-half">
                <div class="pim-f-label"><label :id="fieldId(f, li + '-owned')">Other fields edited here</label></div>
                <p class="muted small pim-axis-help">Other fields you edit at this level.</p>
                <ChipPicker :disabled="!canEdit" dropdown :labelledby="fieldId(f, li + '-owned')" :model-value="level.own ?? []" :options="own" placeholder="Add a field" @update:model-value="$event.length ? (level.own = $event) : delete level.own" />
              </div>
            </div>
          </div>
          <Button v-if="canEdit" type="button" class="pim-add-level" @click="addLevel(f)" severity="secondary" outlined size="small"><Icon icon="tabler:plus" aria-hidden="true" /> Add level</Button>
        </div>
      </div>
      <div class="pim-aspect">
        <header class="pim-family-requirements-head">
          <h3>Release requirements</h3>
          <p class="muted small">Choose what products need before they can be released to a channel.</p>
        </header>
        <div class="pim-stack tight">
          <div v-for="(r, ri) in requirements(f)" :key="r.id" class="pim-level">
            <div class="pim-level-head"><div><strong>{{ humanize(r.id) }}</strong><p class="muted small">{{ channelsFor(f, r.id).join(', ') || 'Unused by channels' }}</p></div><Button v-if="canEdit" type="button" aria-label="Remove requirement" @click="requirements(f).splice(ri, 1)" text severity="secondary" size="small"><Icon icon="tabler:x" /></Button></div>
            <div class="pim-fields">
              <div v-for="d in dimensions" :key="d.name" class="pim-f pim-w-third"><div class="pim-f-label"><label :id="fieldId(f, r.id + '-context-' + d.name)">{{ humanize(d.name) }}</label></div>
                <Select :disabled="!canEdit" :aria-labelledby="fieldId(f, r.id + '-context-' + d.name)" :model-value="contextOf(r, d.name)" @update:model-value="setContext(r, d.name, $event)" :options="[{ value: '', label: 'not stated' }, { value: 'all', label: 'all members' }, ...(d.members).map((m) => ({ value: m, label: String(m) }))]" option-label="label" option-value="value" appendTo="self" /></div>
              <div class="pim-f pim-w-half"><div class="pim-f-label"><label :id="fieldId(f, r.id + '-required')">Required</label></div>
                <p class="muted small pim-axis-help">These fields must have a value.</p>
                <ChipPicker :disabled="!canEdit" dropdown :labelledby="fieldId(f, r.id + '-required')" :model-value="r.require ?? []" placeholder="Add a required field" :options="fieldOptions(attributesOf(f), r.require)" @update:model-value="setList(r, 'require', $event)" /></div>
              <div class="pim-f pim-w-half"><div class="pim-f-label"><label :id="fieldId(f, r.id + '-authored')">Entered for this context</label></div>
                <p class="muted small pim-axis-help">These fields need a value set directly for the selected context.</p>
                <ChipPicker :disabled="!canEdit" dropdown :labelledby="fieldId(f, r.id + '-authored')" :model-value="r.authored ?? []" placeholder="Add a field to author" :options="fieldOptions(attributesOf(f), r.authored)" @update:model-value="setList(r, 'authored', $event)" /></div>
            </div>
          </div>
          <AddSchemaCode v-if="canEdit" label="Requirement name" action="Add requirement" from-name
            :existing="requirements(f).map(r => r.id)" @add="addRequirement(f, $event)" />
        </div>
      </div>
      <div v-if="canEdit" class="pim-aspect pim-family-remove">
        <Button type="button" label="Remove family" severity="danger" text size="small" @click="remove(f)" />
      </div>
    </DefinitionRow>
    </DefinitionList>
  </div>
</template>
