<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { useDisplay } from '../../forms'
import { Icon } from '@iconify/vue'
import Tag from 'primevue/tag'
import ToggleSwitch from 'primevue/toggleswitch'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import Button from 'primevue/button'
import type { State } from '../../types'
import { ensureTag } from '../mount'
import { principalRefs, type Principal } from '../../principals'
type Approvals = NonNullable<NonNullable<State['release_when']>['approvals']>
const props = defineProps<{ approvals: Approvals; boardId?: string }>()
const emit = defineEmits<{ validity: [valid: boolean] }>()
const { principalLabel, rememberPrincipal, nameError } = useDisplay(() => props.boardId ?? '', () => {
  const from = props.approvals.from
  if (Array.isArray(from)) return principalRefs(from)
  return 'group' in from && from.group ? [{ kind: 'group', id: from.group }] : []
})
const ready = ref<boolean>()
const mode = computed(() => Array.isArray(props.approvals.from) ? 'principals' : 'field' in props.approvals.from ? 'field' : 'group')
const pickerValue = computed(() => {
  const from = props.approvals.from
  return 'group' in from && from.group ? JSON.stringify({ type: 'group', principal_id: from.group }) : '{}'
})
const sources = [
  { label: 'Group members', value: 'group' },
  { label: 'People and groups', value: 'principals' },
  { label: 'Principal field', value: 'field' },
]
const reachable = computed(() => Array.isArray(props.approvals.from) ? props.approvals.from.some(p => p.kind === 'group') || props.approvals.from.length >= props.approvals.min : 'field' in props.approvals.from ? !!props.approvals.from.field : !!props.approvals.from.group)
watchEffect(() => emit('validity', Number.isSafeInteger(props.approvals.min) && props.approvals.min > 0 && reachable.value))
onBeforeUnmount(() => emit('validity', true))
onMounted(async () => { ready.value = await ensureTag('wc-principal-picker') })
function changeMode(value: string) { props.approvals.from = value === 'group' ? { group: '' } : value === 'field' ? { field: '' } : [] }
function pick(event: Event) {
  const value = (event as CustomEvent<{ id?: string; principal_id?: string; type?: string; kind?: string; label?: string }>).detail
  const id = value?.principal_id ?? value?.id
  if (mode.value === 'group') { props.approvals.from = { group: id ?? '' }; return }
  if (!id || !Array.isArray(props.approvals.from)) return
  const principal: Principal = { kind: value.type ?? value.kind ?? 'user', id }
  if (value.label) rememberPrincipal(principal, value.label)
  if (!props.approvals.from.some(p => p.id === id && p.kind === principal.kind)) props.approvals.from.push(principal)
}
function remove(index: number) { if (Array.isArray(props.approvals.from)) props.approvals.from.splice(index, 1) }
</script>
<template>
  <p v-if="nameError" class="kx-err" role="alert">{{ nameError }}</p>
  <section class="work-stack work-tight" aria-label="Approval sources">
    <label class="work-stack work-tight">Approval source
      <Select :model-value="mode" aria-label="Approval source" @update:model-value="changeMode($event)"
        appendTo="self" optionLabel="label" optionValue="value" :options="sources" />
    </label>
    <label v-if="'field' in approvals.from" class="work-stack work-tight">Principal field<InputText v-model="approvals.from.field" aria-label="Principal field" /></label>
    <wc-principal-picker v-else-if="ready" :key="mode" :kinds="mode === 'group' ? 'group' : 'user,group'"
      :placeholder="mode === 'group' ? 'Select a group…' : 'Select a person or group…'"
      :value="pickerValue" @config-changed="pick" />
    <p v-else class="work-muted work-small" role="status">{{ ready === false ? 'The principal picker is unavailable.' : 'Loading approver picker…' }}</p>
    <div v-if="Array.isArray(approvals.from)" class="work-chips"><Tag v-for="(principal, index) in approvals.from" :key="principal.kind + ':' + principal.id" class="kx-tag-sm" severity="secondary">{{ principalLabel(principal) }}<Button :aria-label="'Remove approver ' + (index + 1)" text severity="secondary" size="small" @click="remove(index)"><Icon icon="tabler:x" aria-hidden="true" /></Button></Tag></div>
    <p v-if="Array.isArray(approvals.from) && !reachable" class="work-error work-small" role="alert">Select at least {{ approvals.min }} distinct principals, or lower the minimum.</p>
    <p v-else-if="'group' in approvals.from && !approvals.from.group" class="work-muted work-small">Choose the group that can approve this state.</p>
    <label class="work-row"><span class="work-spacer">Approvals needed</span><InputNumber v-model="approvals.min" :min="1" required :useGrouping="false" /></label>
    <label class="work-row work-small"><span class="work-spacer">The person who moves the item here cannot approve this visit</span><ToggleSwitch v-model="approvals.prevent_self" aria-label="The person who moves the item here cannot approve this visit" /></label>
  </section>
</template>
