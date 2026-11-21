<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { setList } from '../../state'
import AddSchemaCode from './AddSchemaCode.vue'
import DefinitionList from '../../shared/DefinitionList.vue'
import DefinitionRow from '../../shared/DefinitionRow.vue'
import ToggleSwitch from 'primevue/toggleswitch'
import Select from 'primevue/select'
import Button from 'primevue/button'
// Channels (where products are released, judged by requirement sets) and
// sources (where values come from, limited to the aspects they may write).
import { computed, useId } from 'vue'
import { Icon } from '@iconify/vue'
import type { ChannelDecl, Declaration, RemoveDecl, SchemaView, SourceDecl } from '../../types'
import { humanize } from '../../forms'
import ChipPicker from './ChipPicker.vue'
import PrincipalList from '../../shared/PrincipalList.vue'

const props = defineProps<{ catalogId?: string; draft: Declaration; schema: SchemaView; view?: 'channels' | 'sources' }>()
const emit = defineEmits<{ remove: [kind: keyof RemoveDecl, id: string] }>()
const settingsPrefix = useId()
function fieldId(id: string, field: string): string {
  return settingsPrefix + '-' + id + '-' + field
}
const canEdit = computed(() => props.schema.access.admin)
const channels = computed(() => props.draft.channels ?? [])
const sources = computed(() => props.draft.sources ?? [])
const requirementIds = computed(() => [...new Set((props.draft.families ?? []).flatMap((f) => (f.requirements ?? []).map((r) => r.id)))].map((id) => ({ value: id, label: humanize(id) })))
const familyOptions = computed(() => (props.draft.families ?? []).filter((f) => f.code !== 'generic').map((f) => ({ value: f.code, label: humanize(f.code) })))
const aspectOptions = computed(() => (props.draft.aspects ?? []).map((a) => ({ value: a.namespace, label: humanize(a.namespace) })))
function addChannel(id: string) {
  (props.draft.channels ??= []).push({ id, requirements: [] })
}
function removeChannel(c: ChannelDecl) {
  channels.value.splice(channels.value.indexOf(c), 1)
  if (props.schema.declaration.channels?.some((x) => x.id === c.id)) emit('remove', 'channels', c.id)
}
function addSource(id: string) {
  (props.draft.sources ??= []).push({ id, ordering: 'none', writes: [] })
}
function removeSource(s: SourceDecl) {
  sources.value.splice(sources.value.indexOf(s), 1)
  if (props.schema.declaration.sources?.some((x) => x.id === s.id)) emit('remove', 'sources', s.id)
}
</script>

<template>
  <div class="pim-stack">
    <DefinitionList v-if="view !== 'sources'" :count="channels.length" :columns="['details']">
      <template v-if="canEdit" #head>
        <AddSchemaCode label="Channel name" action="Add channel" from-name :existing="channels.map(item => item.id)" @add="addChannel" />
      </template>
      <DefinitionRow v-for="c in channels" :key="c.id" :title="humanize(c.id)">
        <template #details>
          <span class="muted small">{{ c.families?.length ? c.families.map(humanize).join(', ') : 'All families' }}</span>
          <span class="muted small">{{ c.requirements?.length ? c.requirements.map(humanize).join(', ') : 'No release requirements' }}</span>
        </template>
        <template v-if="canEdit" #actions><Button type="button" @click="removeChannel(c)" :aria-label="'Remove ' + humanize(c.id)" text severity="secondary" size="small"><Icon icon="tabler:trash" /></Button></template>
        <div class="pim-fields">
          <div class="pim-f pim-w-half"><div class="pim-f-label"><label :id="fieldId(c.id, 'requirements')">Release requirements</label><span class="pim-f-note">a product is ready for the channel when these hold</span></div><ChipPicker :disabled="!canEdit" :labelledby="fieldId(c.id, 'requirements')" :model-value="c.requirements ?? []" :options="requirementIds" @update:model-value="setList(c, 'requirements', $event)" /></div>
          <div class="pim-f pim-w-half"><div class="pim-f-label"><label :id="fieldId(c.id, 'families')">Families</label><span class="pim-f-note">empty means every family</span></div><ChipPicker :disabled="!canEdit" :labelledby="fieldId(c.id, 'families')" :model-value="c.families ?? []" :options="familyOptions" @update:model-value="setList(c, 'families', $event)" /></div>
        </div>
      </DefinitionRow>
    </DefinitionList>
    <DefinitionList v-if="view !== 'channels'" :count="sources.length" :columns="['details']">
      <template v-if="canEdit" #head>
        <AddSchemaCode label="Source name" action="Add source" from-name :existing="sources.map(item => item.id)" @add="addSource" />
      </template>
      <DefinitionRow v-for="s in sources" :key="s.id" :title="humanize(s.id)">
        <template #details><span class="muted small">{{ s.writes?.length ? s.writes.map(humanize).join(', ') : 'No field groups selected' }}</span></template>
        <template v-if="canEdit" #actions><Button type="button" @click="removeSource(s)" :aria-label="'Remove ' + humanize(s.id)" text severity="secondary" size="small"><Icon icon="tabler:trash" /></Button></template>
        <div class="pim-fields">
          <div class="pim-f pim-w-third"><div class="pim-f-label"><label :id="fieldId(s.id, 'ordering')">Handle incoming updates</label><span class="pim-f-note">sequence keeps late deliveries from winning</span></div>
            <Select :disabled="!canEdit" :aria-labelledby="fieldId(s.id, 'ordering')" :model-value="s.ordering ?? 'none'" @update:model-value="s.ordering = $event" :options="[{ value: 'none', label: 'Use arrival order' }, { value: 'sequence', label: 'Use the source’s sequence' }]" option-label="label" option-value="value" appendTo="self" /></div>
          <div class="pim-f pim-w-third"><div class="pim-f-label"><label :for="fieldId(s.id, 'audit')">Audit</label><span class="pim-f-note">record each value change</span></div>
            <div class="row"><ToggleSwitch :disabled="!canEdit" :input-id="fieldId(s.id, 'audit')" :model-value="s.audit !== false" @update:model-value="$event ? delete s.audit : (s.audit = false)" /><span>{{ s.audit === false ? 'Off for this source' : 'Follow catalog audit settings' }}</span></div></div>
          <div class="pim-f pim-w-third" role="group" :aria-labelledby="fieldId(s.id, 'people')"><div class="pim-f-label"><label :id="fieldId(s.id, 'people')">People and service accounts</label><span class="pim-f-note">who may write as this source</span></div><PrincipalList v-if="canEdit" :catalog-id="catalogId" :model-value="s.principals ?? []" @update:model-value="setList(s, 'principals', $event)" /><span v-else>{{ s.principals?.length ? s.principals.length + (s.principals.length === 1 ? ' allowed account' : ' allowed accounts') : 'No accounts specified' }}</span></div>
          <div class="pim-f pim-w-full"><div class="pim-f-label"><label :id="fieldId(s.id, 'writes')">Field groups it can update</label><span class="pim-f-note">field groups this source may set</span></div><ChipPicker :disabled="!canEdit" :labelledby="fieldId(s.id, 'writes')" :model-value="s.writes ?? []" :options="aspectOptions" @update:model-value="setList(s, 'writes', $event)" /></div>
        </div>
      </DefinitionRow>
    </DefinitionList>
  </div>
</template>
