<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import { computed, onMounted, ref } from 'vue'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { Icon } from '@iconify/vue'
import { readPolicyDefaults, OPERATING_CONTROLS } from '../../policy'
import type { Declaration, PolicyDefaults } from '../../types'

const props = defineProps<{ draft: Declaration; catalogId?: string; defaults?: PolicyDefaults }>()
const loaded = ref<PolicyDefaults>()
const defaults = computed(() => props.defaults ?? loaded.value)
const error = ref('')
const pending = ref(false)
async function load() {
  if (props.defaults) return
  error.value = ''
  pending.value = true
  try { loaded.value = await readPolicyDefaults(props.catalogId ?? '') }
  catch (e) { error.value = e instanceof Error ? e.message : 'Could not read policy defaults.' }
  finally { pending.value = false }
}
onMounted(load)
const policy = computed(() => props.draft.policy ?? {})
const advancedOpen = ref(false)
type PolicyKey = { key: keyof PolicyDefaults; title: string; hint: string; kind: 'enum' | 'int'; min?: number; max?: number; global?: boolean }
const retention: PolicyKey[] = [
  { key: 'audit', title: 'Audit trail', hint: 'Fields records each value change. Off records only lifecycle, schema and release history.', kind: 'enum' },
  { key: 'audit_days', title: 'Audit retention (days)', hint: '0 uses the 365-day default. History always expires.', kind: 'int', min: 0, max: 106751 },
  { key: 'trash_days', title: 'Trash window (days)', hint: 'How long a deleted product stays restorable.', kind: 'int', min: 1, max: 106751 },
  { key: 'tombstone_days', title: 'Deleted product notices (days)', hint: 'How long feeds report a purged product as deleted.', kind: 'int', min: 1, max: 106751 },
]
const descriptions: Record<keyof typeof OPERATING_CONTROLS, string> = {
  proposal_days: 'How long proposals stay in this catalog before removal.',
  proposal_count: 'Maximum number of stored proposals in this catalog.',
  completed_work_days: 'How long finished release work stays in this catalog.',
  abandoned_work_days: 'How long unfinished release work stays before removal.',
  import_days: 'How long finished imports stay in this catalog.',
  pending_creation_days: 'How long an unfinished catalog creation stays before removal.',
  proposal_bytes: 'Maximum data size of one proposal in this catalog.',
  command_deadline_ms: 'Maximum time one catalog change can run before it stops.',
  maintenance_rows: 'Maximum records cleaned up in one maintenance pass.',
  maintenance_catalogs: 'Maximum catalogs cleaned up in one maintenance pass.',
  rebuild_rows: 'Maximum products updated together during a catalog rebuild.',
  job_batches: 'Maximum groups of products processed in one background work session.',
  import_rows: 'Maximum products read together from an import.',
}
function control(key: keyof typeof OPERATING_CONTROLS): PolicyKey {
  const c = OPERATING_CONTROLS[key]
  return { key, ...c, kind: 'int', hint: descriptions[key] }
}
retention.push(...(['completed_work_days', 'abandoned_work_days', 'import_days'] as const).map(control))
const proposals = (['proposal_days', 'proposal_count'] as const).map(control)
const advanced = (['command_deadline_ms', 'rebuild_rows', 'job_batches', 'import_rows', 'proposal_bytes', 'maintenance_rows', 'maintenance_catalogs', 'pending_creation_days'] as const).map(control)
const groups = [
  { id: 'retention', title: 'Retention', keys: retention },
  { id: 'proposals', title: 'Proposals', keys: proposals },
  { id: 'advanced', title: '', keys: advanced },
]
const auditOptions = computed(() => [
  { value: 'inherited', label: defaults.value ? `${defaults.value.audit === 'fields' ? 'Fields' : 'Off'} (default)` : 'Deployment default' },
  { value: 'fields', label: 'Fields' }, { value: 'off', label: 'Off' },
])
function set<K extends keyof PolicyDefaults>(key: K, value: PolicyDefaults[K] | false | null | undefined | '' | 'inherited') {
  const target = props.draft.policy ?? (props.draft.policy = {})
  target[key] = value === undefined || value === null || value === '' || value === 'inherited' ? false : value
}
</script>

<template>
  <section class="form">
    <p class="muted small pim-policy-intro">Empty fields inherit the deployment settings.</p>
    <p v-if="pending" class="muted small pim-policy-status" role="status">Loading deployment defaults…</p>
    <Message v-if="error" severity="error" role="alert">{{ error }} <Button severity="secondary" outlined @click="load">Retry</Button></Message>
    <template v-for="group in groups" :key="group.id">
      <section v-if="group.id !== 'advanced' || advancedOpen" :id="group.id === 'advanced' ? 'policy-advanced' : undefined" :data-policy-group="group.id" class="pim-policy-group" :aria-label="group.title || 'Advanced'">
        <header v-if="group.title" class="pim-bsection-head"><h3>{{ group.title }}</h3></header>
        <div v-for="k in group.keys" :key="k.key" class="pim-policy-row">
          <div class="pim-policy-copy"><label :for="'pol-' + k.key">{{ k.title }}</label><p :id="'pol-help-' + k.key">{{ k.hint }}<span v-if="k.global"> Managed in deployment settings.</span></p></div>
          <Select v-if="k.kind === 'enum'" :input-id="'pol-' + k.key" :aria-describedby="'pol-help-' + k.key" class="pim-policy-control" :model-value="typeof policy[k.key] === 'string' ? policy[k.key] : 'inherited'" :options="auditOptions" option-label="label" option-value="value" appendTo="self" @update:model-value="set(k.key, $event)" />
          <InputNumber v-else :disabled="k.global" :input-id="'pol-' + k.key" :aria-describedby="'pol-help-' + k.key" class="pim-policy-control" :model-value="k.global ? Number(defaults?.[k.key] ?? 0) || null : typeof policy[k.key] === 'number' ? Number(policy[k.key]) : null" :min="k.min ?? (k.key === 'audit_days' ? 0 : 1)" :max="k.max" :step="1" :placeholder="defaults ? 'Default: ' + defaults[k.key] : 'Deployment default'" @update:model-value="set(k.key, $event)" />
        </div>
      </section>
      <button v-if="group.id === 'proposals'" type="button" class="pim-policy-advanced" :aria-expanded="advancedOpen" aria-controls="policy-advanced" @click="advancedOpen = !advancedOpen">
        <Icon :icon="advancedOpen ? 'tabler:chevron-down' : 'tabler:chevron-right'" aria-hidden="true" />
        <span>Advanced</span><span class="muted small">Processing limits and deployment settings</span>
      </button>
    </template>
  </section>
</template>
