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
import Skeleton from 'primevue/skeleton'
import Tag from 'primevue/tag'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import SettingsSectionHead from '@kickside/ui-kit/SettingsSectionHead.vue'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { activity, isDenied } from '../api'
import { useMail } from '../context'
import { describe, originText, personLabel, plural, recipients, statusLabels, statusSeverity, when } from '../copy'
import { useMailInvalidation } from '../realtime'
import type { LogMessage, MessageStatus } from '../types'
import ResourcePicker from '../library/ResourcePicker.vue'
import MessageDrawer from './MessageDrawer.vue'

const props = defineProps<{ message?: string; template?: string }>()
const { library, go } = useMail()

type StatusFilter = 'all' | MessageStatus
const status = ref<StatusFilter>('all')
const template = ref<string | null>(props.template ?? null)
const period = ref(30)
const query = ref(''), search = ref('')
let searchTimer: ReturnType<typeof setTimeout> | undefined
watch(query, value => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { search.value = value.trim() }, 250) })
watch(() => props.template, value => { if (value !== undefined) template.value = value })

const statuses: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' }, { label: 'Pending', value: 'queued' }, { label: 'Sent', value: 'sent' }, { label: 'Failed', value: 'failed' },
]
const periods = [{ label: 'Last 24 hours', value: 1 }, { label: 'Last 7 days', value: 7 }, { label: 'Last 30 days', value: 30 }]

const items = shallowRef<LogMessage[]>([])
const cursor = ref<string>()
const loading = ref(true), loaded = ref(false), more = ref(false), denied = ref(false)
const error = ref(''), moreError = ref(''), refreshError = ref('')
const beginList = latestRequest()

function filter(next?: string) {
  return {
    status: status.value === 'all' ? undefined : status.value,
    message: template.value || undefined,
    since: Date.now() - period.value * 24 * 60 * 60 * 1000,
    q: search.value || undefined,
    cursor: next,
  }
}

// A new filter starts over; a refresh keeps the rows shown until the first page arrives again.
async function load(refresh = false) {
  const current = beginList()
  loading.value = true
  try {
    const page = await activity.list(filter())
    if (!current()) return
    items.value = page.items
    cursor.value = page.next_cursor
    total.value = page.total
    lowerBound.value = !!page.total_is_lower_bound
    failedToday.value = page.failed_today ?? 0
    error.value = moreError.value = refreshError.value = ''
    denied.value = false
    loaded.value = true
  } catch (failure) {
    if (!current()) return
    denied.value = isDenied(failure)
    const message = denied.value ? '' : describe(failure, 'Activity could not be loaded.')
    if (refresh && loaded.value && !denied.value) refreshError.value = message
    else error.value = message
  } finally {
    if (current()) loading.value = false
  }
}

async function loadMore() {
  if (loading.value || !cursor.value || more.value) return
  const current = beginList()
  more.value = true
  moreError.value = ''
  try {
    const page = await activity.list(filter(cursor.value))
    if (!current()) return
    const known = new Set(items.value.map(item => item.message_id))
    items.value = [...items.value, ...page.items.filter(item => !known.has(item.message_id))]
    cursor.value = page.next_cursor
  } catch (failure) {
    if (current()) moreError.value = describe(failure, 'More activity could not be loaded.')
  } finally {
    more.value = false
  }
}

const total = ref<number>()
const lowerBound = ref(false)
const failedToday = ref(0)
watch([status, template, period, search], () => { void load() })
useHostVisibilityRefresh(() => load(loaded.value))

useMailInvalidation('mail.activity', () => { void load(loaded.value) })

// Mail counts up to 10,000 messages; beyond that, and for a search over the newest 10,000, the count is a minimum.
const countLabel = computed(() => {
  const count = total.value ?? items.value.length
  return lowerBound.value ? `${count.toLocaleString()}+ messages` : plural(count, 'message')
})
const searchWindow = computed(() => lowerBound.value && !!search.value)
const health = computed(() => failedToday.value ? `${plural(failedToday.value, 'message')} failed today.` : '')

function templateTitle(name: string | undefined): string | undefined {
  if (!name) return '—'
  return library.title('message', name)
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
      <span class="mail-health-text"><strong>{{ health }}</strong> {{ status === 'failed' ? '' : 'Open one to see why, then send it again.' }}</span>
      <Button v-if="status !== 'failed'" label="Show failed" severity="secondary" outlined size="small" @click="status = 'failed'" />
    </p>

    <div class="mail-toolbar">
      <SelectButton v-model="status" :options="statuses" option-label="label" option-value="value" :allow-empty="false" aria-label="Status" />
      <ResourcePicker v-model="template" kind="message" label="Message" class="mail-filter" placeholder="All messages" show-clear />
      <Select v-model="period" :options="periods" option-label="label" option-value="value" append-to="self" aria-label="Period" class="mail-filter" />
      <IconField class="mail-search">
        <InputIcon><Icon icon="tabler:search" aria-hidden="true" /></InputIcon>
        <InputText v-model="query" type="search" maxlength="256" aria-label="Search subject or recipient" placeholder="Search subject or recipient…" />
      </IconField>
      <span v-if="loaded" class="mail-count" role="status">{{ countLabel }}</span>
    </div>
    <p v-if="searchWindow" class="mail-muted mail-search-window" role="status">
      Search looks through the newest 10,000 messages that match the other filters. Narrow the period or the message to search further back.
    </p>

    <div v-if="error" class="kx-err mail-error" role="alert">
      <span>{{ error }}</span>
      <Button label="Retry" severity="secondary" outlined size="small" @click="load()" />
    </div>
    <div v-if="refreshError" class="kx-err mail-error" role="alert">
      <span>{{ refreshError }} The list shows what was loaded before.</span>
      <Button label="Retry" severity="secondary" outlined size="small" @click="load(true)" />
    </div>
    <p v-else-if="loading && !loaded" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Loading activity…</p>
    <template v-else-if="loaded">
      <p v-if="!items.length" class="mail-muted mail-nomatch" role="status">
        {{ search ? 'Nothing matches. Try another subject or recipient.' : 'No email was sent in this period.' }}
      </p>
      <DataTable v-else :value="items" data-key="message_id" class="mail-table" row-hover :pt="{ table: { 'aria-label': 'Sent messages' } }"
        @row-click="event => openMessage(event.data)">
        <Column header="Status" header-class="mail-col-status" body-class="mail-col-status">
          <template #body="{ data }"><Tag :severity="statusSeverity[data.status as MessageStatus]" :value="statusLabels[data.status as MessageStatus]" class="kx-tag-sm" /></template>
        </Column>
        <Column header="Message">
          <template #body="{ data }">
            <Button link class="mail-name" :label="data.subject" @click.stop="openMessage(data)" />
            <span class="mail-sub">{{ recipients(data.to) }}</span>
          </template>
        </Column>
        <Column header="Template">
          <template #body="{ data }">
          <Skeleton v-if="templateTitle(data.template) === undefined" width="8rem" height="1rem" />
          <template v-else>{{ templateTitle(data.template) }}</template>
        </template>
        </Column>
        <Column header="Sent by">
          <template #body="{ data }">
            <span>{{ personLabel(data.sender_label, data.sender) }}</span>
            <span v-if="data.origin" class="mail-sub">{{ originText(data.origin) }}</span>
          </template>
        </Column>
        <Column header="When" header-class="mail-col-when" body-class="mail-col-when">
          <template #body="{ data }"><span class="mail-muted">{{ when(data.created_at) }}</span></template>
        </Column>
      </DataTable>
      <div v-if="cursor" class="mail-more">
        <span v-if="moreError" class="kx-err inline" role="alert">{{ moreError }}</span>
        <Button :label="moreError ? 'Retry' : 'Show more'" severity="secondary" outlined :loading="more" :disabled="loading" @click="loadMore" />
      </div>
    </template>
  </template>
  <MessageDrawer :message-id="message" @close="closeMessage" />
</template>
