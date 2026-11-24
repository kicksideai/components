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
import { describe, originText, personLabel, plural, recipients, statusLabels, statusSeverity, when } from '../copy'
import { useMessageChanges } from '../realtime'
import type { LogMessage, MessageStatus } from '../types'
import MessageDrawer from './MessageDrawer.vue'

const props = defineProps<{ message?: string; template?: string }>()
const { library, go, capabilities } = useMail()

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
    q: search.value || undefined,
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
    total.value = page.total
    failedToday.value = page.failed_today ?? 0
    error.value = ''
    denied.value = false
    loaded.value = true
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
  } catch (failure) {
    if (current()) error.value = describe(failure, 'More activity could not be loaded.')
  } finally {
    more.value = false
  }
}

const total = ref<number>()
const failedToday = ref(0)
watch([status, template, period, search], () => { void load() })
useHostVisibilityRefresh(load)
useMessageChanges(() => { void load() })

const countLabel = computed(() => plural(total.value ?? items.value.length, 'message'))
const health = computed(() => failedToday.value ? `${plural(failedToday.value, 'message')} failed today.` : '')
const admin = computed(() => !!capabilities.value?.administer_delivery)
const description = computed(() => admin.value ? 'Every email sent from this workspace in the last 30 days.' : 'Email you sent in the last 30 days.')

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
  <SettingsSectionHead title="Activity" :description="description" />

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
      <Button label="Retry" severity="secondary" outlined size="small" @click="load()" />
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
            <button type="button" class="mail-name" @click.stop="openMessage(data)">{{ data.subject }}</button>
            <span class="mail-sub">{{ recipients(data.to) }}</span>
          </template>
        </Column>
        <Column header="Template">
          <template #body="{ data }">{{ templateTitle(data.template) }}</template>
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
        <Button label="Show more" severity="secondary" outlined :loading="more" @click="loadMore" />
      </div>
    </template>
  </template>
  <MessageDrawer :message-id="message" @close="closeMessage" @changed="load" />
</template>
