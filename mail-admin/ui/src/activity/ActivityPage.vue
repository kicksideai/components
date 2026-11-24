<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import Tag from 'primevue/tag'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import SettingsSectionHead from '@kickside/ui-kit/SettingsSectionHead.vue'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { activity, isDenied } from '../api'
import { useMail } from '../context'
import { describe, originText, plural, recipients, statusLabels, statusSeverity, todayStart, when } from '../copy'
import { principalLabel, resolvePrincipals } from '../principals'
import { useMessageChanges } from '../realtime'
import type { LogMessage, MessageStatus } from '../types'
import MessageDrawer from './MessageDrawer.vue'

const props = defineProps<{ message?: string; template?: string }>()
const { library, go } = useMail()

type StatusFilter = 'all' | MessageStatus
const status = ref<StatusFilter>('all')
const template = ref<string | null>(props.template ?? null)
const period = ref(30)
const query = ref('')
watch(() => props.template, value => { if (value !== undefined) template.value = value })

const statuses: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' }, { label: 'Pending', value: 'queued' }, { label: 'Sent', value: 'sent' }, { label: 'Failed', value: 'failed' },
]
const periods = [{ label: 'Last 24 hours', value: 1 }, { label: 'Last 7 days', value: 7 }, { label: 'Last 30 days', value: 30 }]
const templates = computed(() => library.resources.value.filter(item => item.kind === 'message')
  .sort((a, b) => a.title.localeCompare(b.title)).map(item => ({ label: item.title, value: item.name })))

const items = shallowRef<LogMessage[]>([])
const cursor = ref<string>()
const loading = ref(true), loaded = ref(false), more = ref(false), denied = ref(false)
const error = ref('')
const beginList = latestRequest()

function filter(next?: string) {
  return {
    status: status.value === 'all' ? undefined : status.value,
    message: template.value || undefined,
    since: Date.now() - period.value * 24 * 60 * 60 * 1000,
    cursor: next,
  }
}

async function load() {
  const current = beginList()
  loading.value = true
  try {
    const page = await activity.list(filter())
    if (!current()) return
    items.value = page.items
    cursor.value = page.next_cursor
    error.value = ''
    denied.value = false
    loaded.value = true
    void resolvePrincipals(page.items.map(item => item.sender))
  } catch (failure) {
    if (!current()) return
    denied.value = isDenied(failure)
    error.value = denied.value ? '' : describe(failure, 'Activity could not be loaded.')
  } finally {
    if (current()) loading.value = false
  }
}

async function loadMore() {
  if (!cursor.value || more.value) return
  const current = beginList()
  more.value = true
  try {
    const page = await activity.list(filter(cursor.value))
    if (!current()) return
    items.value = [...items.value, ...page.items]
    cursor.value = page.next_cursor
    void resolvePrincipals(page.items.map(item => item.sender))
  } catch (failure) {
    if (current()) error.value = describe(failure, 'More activity could not be loaded.')
  } finally {
    more.value = false
  }
}

const failedToday = shallowRef<{ count: number; capped: boolean; latest?: LogMessage }>({ count: 0, capped: false })
const beginHealth = latestRequest()
async function loadHealth() {
  const current = beginHealth()
  try {
    const page = await activity.list({ status: 'failed', since: todayStart(), limit: 200 })
    if (current()) failedToday.value = { count: page.items.length, capped: page.has_more, latest: page.items[0] }
  } catch {
    if (current()) failedToday.value = { count: 0, capped: false }
  }
}

async function refresh() {
  await Promise.all([load(), loadHealth()])
}
watch([status, template, period], () => { void load() })
useHostVisibilityRefresh(refresh)
useMessageChanges(() => { void refresh() })

const rows = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return items.value
  return items.value.filter(item => [item.subject, ...item.to, ...(item.cc ?? []), ...(item.bcc ?? [])].some(value => value.toLowerCase().includes(q)))
})
const countLabel = computed(() => plural(rows.value.length, 'message') + (cursor.value && !query.value ? ' so far' : ''))
const health = computed(() => {
  const failed = failedToday.value
  if (!failed.count) return undefined
  const count = failed.capped ? `${failed.count}+ messages` : plural(failed.count, 'message')
  return { title: `${count} failed today.`, reason: failed.latest?.last_error?.message ?? '' }
})

function templateTitle(name: string | undefined): string {
  if (!name) return '—'
  return library.find('message', name)?.title ?? name
}
function openMessage(item: LogMessage) {
  go({ name: 'activity', message: item.message_id })
}
function closeMessage() {
  go({ name: 'activity', template: template.value || undefined })
}
</script>

<template>
  <SettingsSectionHead title="Activity" description="Every email sent from this workspace in the last 30 days." />

  <p v-if="denied" class="kx-notice warn mail-block" role="alert">
    <Icon icon="tabler:lock" aria-hidden="true" />Ask an administrator to grant you access to mail delivery.
  </p>
  <template v-else>
    <p v-if="health" class="kx-notice error mail-block" role="status">
      <Icon icon="tabler:alert-triangle" aria-hidden="true" />
      <span><strong>{{ health.title }}</strong> {{ health.reason }}</span>
    </p>

    <div class="mail-toolbar">
      <SelectButton v-model="status" :options="statuses" option-label="label" option-value="value" :allow-empty="false" aria-label="Status" />
      <Select v-model="template" :options="templates" option-label="label" option-value="value" append-to="self" aria-label="Message" class="mail-filter"
        placeholder="All messages" show-clear />
      <Select v-model="period" :options="periods" option-label="label" option-value="value" append-to="self" aria-label="Period" class="mail-filter" />
      <IconField class="mail-search">
        <InputIcon><Icon icon="tabler:search" aria-hidden="true" /></InputIcon>
        <InputText v-model="query" type="search" aria-label="Search subject or recipient" placeholder="Search subject or recipient…" />
      </IconField>
      <span v-if="loaded" class="mail-count" role="status">{{ countLabel }}</span>
    </div>

    <div v-if="error" class="kx-err mail-error" role="alert">
      <span>{{ error }}</span>
      <Button label="Retry" severity="secondary" outlined size="small" @click="refresh()" />
    </div>
    <p v-else-if="loading && !loaded" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Loading activity…</p>
    <template v-else-if="loaded">
      <p v-if="!rows.length" class="mail-muted mail-nomatch" role="status">
        {{ items.length || query ? 'Nothing matches. Try another subject or recipient.' : 'No email was sent in this period.' }}
      </p>
      <DataTable v-else :value="rows" data-key="message_id" class="mail-table" row-hover :pt="{ table: { 'aria-label': 'Sent messages' } }"
        @row-click="event => openMessage(event.data)">
        <Column header="Status" header-class="mail-col-status" body-class="mail-col-status">
          <template #body="{ data }"><Tag :severity="statusSeverity[data.status as MessageStatus]" :value="statusLabels[data.status as MessageStatus]" class="kx-tag-sm" /></template>
        </Column>
        <Column header="Message">
          <template #body="{ data }">
            <button type="button" class="mail-name" @click.stop="openMessage(data)">{{ data.subject }}</button>
            <span class="mail-sub">{{ recipients(data.to) }}</span>
          </template>
        </Column>
        <Column header="Template">
          <template #body="{ data }">{{ templateTitle(data.template) }}</template>
        </Column>
        <Column header="Sent by">
          <template #body="{ data }">
            <span>{{ principalLabel(data.sender) }}</span>
            <span v-if="data.origin" class="mail-sub">{{ originText(data.origin) }}</span>
          </template>
        </Column>
        <Column header="When" header-class="mail-col-when" body-class="mail-col-when">
          <template #body="{ data }"><span class="mail-muted">{{ when(data.created_at) }}</span></template>
        </Column>
      </DataTable>
      <div v-if="cursor" class="mail-more">
        <Button label="Show more" severity="secondary" outlined :loading="more" @click="loadMore" />
      </div>
    </template>
  </template>
  <MessageDrawer :message-id="message" @close="closeMessage" @changed="refresh" />
</template>
