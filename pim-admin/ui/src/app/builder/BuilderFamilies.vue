<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { CODE, setList } from '../../state'
import DefinitionList from '../../shared/DefinitionList.vue'
import DefinitionRow from '../../shared/DefinitionRow.vue'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'
// Families: which aspects a product shape carries, how it varies by level,
// and what each channel requirement needs.
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import type { Declaration, FamilyDecl, RemoveDecl, RequirementDecl, SchemaView } from '../../types'
import { humanize } from '../../forms'
import ChipPicker from './ChipPicker.vue'

const props = defineProps<{ draft: Declaration; schema: SchemaView }>()
const emit = defineEmits<{ remove: [kind: keyof RemoveDecl, id: string] }>()
const canEdit = computed(() => props.schema.access.admin)
const families = computed(() => (props.draft.families ?? []).filter((f) => f.code !== 'generic'))
const aspectOptions = computed(() => {
  const declared = (props.draft.aspects ?? []).map((a) => a.namespace)
  const plugin = [...new Set(Object.entries(props.schema.attributes).filter(([, a]) => a.plugin).map(([code]) => code.split('.')[0]))]
  return [...declared, ...plugin.filter((p) => !declared.includes(p))].map((ns) => ({ value: ns, label: humanize(ns) }))
})
function attributesOf(f: FamilyDecl): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = []
  for (const a of props.draft.aspects ?? []) if (f.aspects?.includes(a.namespace)) for (const x of a.attributes ?? []) out.push({ value: a.namespace + '.' + x.code, label: humanize(x.code) + ' (' + a.namespace + ')' })
  for (const [code, a] of Object.entries(props.schema.attributes)) if (a.plugin && f.aspects?.includes(code.split('.')[0]) && !out.some((o) => o.value === code)) out.push({ value: code, label: humanize(code) + ' (' + code.split('.')[0] + ')' })
  return out
}
const dimensions = computed(() => props.draft.dimensions ?? [])
const newCode = ref('')
function add() {
  const code = newCode.value.trim()
  if (!CODE.test(code) || (props.draft.families ?? []).some((f) => f.code === code)) return
  (props.draft.families ??= []).push({ code, aspects: [] })
  newCode.value = ''
}
function remove(f: FamilyDecl) {
  props.draft.families!.splice(props.draft.families!.indexOf(f), 1)
  if (props.schema.declaration.families?.some((x) => x.code === f.code)) emit('remove', 'families', f.code)
}
function levels(f: FamilyDecl) {
  return f.variation ?? []
}
function addLevel(f: FamilyDecl) {
  (f.variation ??= []).push({ axes: [] })
}
function requirements(f: FamilyDecl) {
  return f.requirements ?? []
}
const newReq = ref<Record<string, string>>({})
function addRequirement(f: FamilyDecl) {
  const id = (newReq.value[f.code] ?? '').trim()
  if (!CODE.test(id) || requirements(f).some((r) => r.id === id)) return
  (f.requirements ??= []).push({ id, require: [] })
  newReq.value[f.code] = ''
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
  <DefinitionList :count="families.length" :columns="['code', 'details']">
    <DefinitionRow :title="humanize(f.code)" :code="f.code" v-for="f in families" :key="f.code">
      <template #details><span class="muted small">{{ f.aspects?.length ?? 0 }} {{ f.aspects?.length === 1 ? 'field group' : 'field groups' }}</span></template>
      <template v-if="canEdit" #actions><Button type="button" @click="remove(f)" :aria-label="'Remove ' + humanize(f.code)" text severity="secondary" size="small"><Icon icon="tabler:trash" /></Button></template>
      <div class="pim-aspect">
        <div class="pim-fields">
          <div class="pim-f pim-w-full"><div class="pim-f-label"><label>Field groups</label><span class="pim-f-note">the fields this family's products carry</span></div>
            <ChipPicker :disabled="!canEdit" :model-value="f.aspects ?? []" :options="aspectOptions" @update:model-value="setList(f, 'aspects', $event)" /></div>
        </div>
      </div>
      <div class="pim-aspect">
        <header class="pim-aspect-head"><h3>Variation</h3><span class="muted small">model → variants → items; each level owns axes that make its children distinct</span></header>
        <div class="pim-stack tight">
          <div v-for="(level, li) in levels(f)" :key="li" class="pim-level">
            <div class="pim-level-head"><strong>Level {{ li + 1 }}</strong><Button v-if="canEdit" type="button" aria-label="Remove level" @click="levels(f).splice(li, 1)" text severity="secondary" size="small"><Icon icon="tabler:x" /></Button></div>
            <div class="pim-fields">
              <div class="pim-f pim-w-half"><div class="pim-f-label"><label>Axes</label><span class="pim-f-note">key-indexed, one value each</span></div><ChipPicker :disabled="!canEdit" :model-value="level.axes ?? []" :options="attributesOf(f)" @update:model-value="level.axes = $event" /></div>
              <div class="pim-f pim-w-half"><div class="pim-f-label"><label>Also owned here</label><span class="pim-f-note">other fields written at this level</span></div><ChipPicker :disabled="!canEdit" :model-value="level.own ?? []" :options="attributesOf(f)" @update:model-value="$event.length ? (level.own = $event) : delete level.own" /></div>
            </div>
          </div>
          <Button v-if="canEdit" type="button" @click="addLevel(f)" severity="secondary" outlined size="small"><Icon icon="tabler:plus" aria-hidden="true" /> Add level</Button>
        </div>
      </div>
      <div class="pim-aspect">
        <header class="pim-aspect-head"><h3>Requirements</h3><span class="muted small">what a channel needs before a product is ready</span></header>
        <div class="pim-stack tight">
          <div v-for="(r, ri) in requirements(f)" :key="r.id" class="pim-level">
            <div class="pim-level-head"><strong class="mono">{{ r.id }}</strong><Button v-if="canEdit" type="button" aria-label="Remove requirement" @click="requirements(f).splice(ri, 1)" text severity="secondary" size="small"><Icon icon="tabler:x" /></Button></div>
            <div class="pim-fields">
              <div v-for="d in dimensions" :key="d.name" class="pim-f pim-w-third"><div class="pim-f-label"><label>{{ humanize(d.name) }}</label><span class="pim-f-note">context</span></div>
                <Select :disabled="!canEdit" :model-value="contextOf(r, d.name)" @update:model-value="setContext(r, d.name, $event)" :options="[{ value: '', label: 'not stated' }, { value: 'all', label: 'all members' }, ...(d.members).map((m) => ({ value: m, label: String(m) }))]" option-label="label" option-value="value" appendTo="self" /></div>
              <div class="pim-f pim-w-half"><div class="pim-f-label"><label>Required</label><span class="pim-f-note">must hold a value</span></div><ChipPicker :disabled="!canEdit" :model-value="r.require ?? []" :options="attributesOf(f)" @update:model-value="setList(r, 'require', $event)" /></div>
              <div class="pim-f pim-w-half"><div class="pim-f-label"><label>Authored</label><span class="pim-f-note">must be set in the context itself, not by fallback</span></div><ChipPicker :disabled="!canEdit" :model-value="r.authored ?? []" :options="attributesOf(f)" @update:model-value="setList(r, 'authored', $event)" /></div>
            </div>
          </div>
          <div v-if="canEdit" class="row pim-add-row"><InputText v-model="newReq[f.code]" type="text" placeholder="requirement_id" @keydown.enter.prevent="addRequirement(f)" class="mono narrow" /><Button type="button" :disabled="!CODE.test(newReq[f.code] ?? '')" @click="addRequirement(f)" severity="secondary" outlined size="small"><Icon icon="tabler:plus" aria-hidden="true" /> Add requirement</Button></div>
        </div>
      </div>
    </DefinitionRow>
    <template v-if="canEdit" #add>
    <div class="row pim-add-row">
      <InputText v-model="newCode" type="text" placeholder="new_family" @keydown.enter.prevent="add" class="mono" />
      <Button type="button" :disabled="!CODE.test(newCode)" @click="add" severity="secondary" outlined size="small"><Icon icon="tabler:plus" aria-hidden="true" /> Add family</Button>
      <span class="muted small">Products without a family use the generic one.</span>
    </div>
    </template>
  </DefinitionList>
</template>
