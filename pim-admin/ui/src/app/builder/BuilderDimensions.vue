<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { CODE } from '../../state'
import DefinitionList from '../../shared/DefinitionList.vue'
import DefinitionRow from '../../shared/DefinitionRow.vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
// Dimensions: the contexts values vary by (locale, channel…), their members
// and which member falls back to which.
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import type { Declaration, DimensionDecl, RemoveDecl, SchemaView } from '../../types'
import { humanize } from '../../forms'
import ChipPicker from './ChipPicker.vue'

const props = defineProps<{ draft: Declaration; schema: SchemaView }>()
const emit = defineEmits<{ remove: [kind: keyof RemoveDecl, id: string] }>()
const dims = computed(() => props.draft.dimensions ?? [])
const newName = ref('')
function add() {
  const name = newName.value.trim()
  if (!CODE.test(name) || dims.value.some((d) => d.name === name)) return
  (props.draft.dimensions ??= []).push({ name, members: [] })
  newName.value = ''
}
// usedBy names the fields and requirements that still depend on a dimension;
// the engine refuses to drop a dimension they use, so the builder says so first.
function usedBy(d: DimensionDecl): string[] {
  const out: string[] = []
  for (const a of props.draft.aspects ?? []) for (const x of a.attributes ?? []) if (x.scope?.includes(d.name)) out.push(a.namespace + '.' + x.code)
  for (const f of props.draft.families ?? []) for (const r of f.requirements ?? []) if (r.context && d.name in r.context) out.push(f.code + ' requirement ' + r.id)
  return out
}
function remove(d: DimensionDecl) {
  if (usedBy(d).length) return
  dims.value.splice(dims.value.indexOf(d), 1)
  if (props.schema.declaration.dimensions?.some((x) => x.name === d.name)) emit('remove', 'dimensions', d.name)
}
function setMembers(d: DimensionDecl, list: string[]) {
  d.members = list
  if (d.fallback) for (const k of Object.keys(d.fallback)) if (!list.includes(k)) delete d.fallback[k]
}
function fallbackOf(d: DimensionDecl, m: string): string[] {
  return d.fallback?.[m] ?? []
}
function setFallback(d: DimensionDecl, m: string, list: string[]) {
  const fb = { ...(d.fallback ?? {}) }
  if (list.length) fb[m] = list
  else delete fb[m]
  if (Object.keys(fb).length) d.fallback = fb
  else delete d.fallback
}
</script>

<template>
  <DefinitionList :count="dims.length" :columns="['code', 'details', 'usage']">
    <DefinitionRow :title="humanize(d.name)" :code="d.name" v-for="d in dims" :key="d.name" :usage="usedBy(d).length + (usedBy(d).length === 1 ? ' dependency' : ' dependencies')">
      <template #details><span class="muted small">{{ d.members.length }} {{ d.members.length === 1 ? 'member' : 'members' }}</span></template>
      <template #actions>

        <Button type="button" :disabled="usedBy(d).length > 0" :aria-label="'Remove ' + humanize(d.name)" :title="usedBy(d).length ? 'Take the dimension off these first' : ''" @click="remove(d)" text severity="secondary" size="small"><Icon icon="tabler:trash" /></Button></template>
      <div class="pim-aspect">
        <p v-if="usedBy(d).length" class="small muted">Used by {{ usedBy(d).join(', ') }}</p>
        <div class="pim-fields">
          <div class="pim-f pim-w-full"><div class="pim-f-label"><label>Members</label><span class="pim-f-note">the values this dimension takes</span></div>
            <ChipPicker :model-value="d.members" free placeholder="add member" @update:model-value="setMembers(d, $event)" /></div>
          <div v-for="m in d.members" :key="m" class="pim-f pim-w-half"><div class="pim-f-label"><label>{{ m }} falls back to</label><span class="pim-f-note">in order, when it has no value</span></div>
            <ChipPicker :model-value="fallbackOf(d, m)" :options="d.members.filter((x) => x !== m).map((x) => ({ value: x }))" @update:model-value="setFallback(d, m, $event)" /></div>
        </div>
      </div>
    </DefinitionRow>
    <template #add>
    <div class="row pim-add-row">
      <InputText v-model="newName" type="text" placeholder="new_dimension" @keydown.enter.prevent="add" class="mono" />
      <Button type="button" :disabled="!CODE.test(newName)" @click="add" severity="secondary" outlined size="small"><Icon icon="tabler:plus" aria-hidden="true" /> Add dimension</Button>
      <span class="muted small">A dimension lets a value differ per member, with fallbacks between members.</span>
    </div>
    </template>
  </DefinitionList>
</template>
