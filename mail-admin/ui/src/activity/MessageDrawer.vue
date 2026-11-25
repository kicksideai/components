<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, nextTick, ref, shallowRef, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import Skeleton from 'primevue/skeleton'
import Tag from 'primevue/tag'
import { host } from '@wippy-fe/proxy'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { activity, isDenied, isMissing } from '../api'
import { useMail } from '../context'
import { useReturnFocus } from '../focus'
import { deliveryFailure, describe, fixedOutsideMail, fullDate, originText, personLabel, statusLabels, statusSeverity } from '../copy'
import { useMailInvalidation } from '../realtime'
import type { LogMessage, SendReceipt } from '../types'

const props = defineProps<{ messageId?: string }>()
const emit = defineEmits<{ close: [] }>()
const { library, go, capabilities, delivery } = useMail()
useReturnFocus(() => !!props.messageId)
const drawer = ref<HTMLElement>()
watch(() => !!props.messageId, open => { if (open) void nextTick(() => drawer.value?.focus()) }, { immediate: true })

const settingsFailure = computed(() => !!message.value?.last_error && fixedOutsideMail.has(message.value.last_error.code))
// A delivery administrator reads what the service said and what to change; everyone else reads Mail's neutral text.
const failureText = computed(() => {
  const failure = message.value?.last_error
  if (!failure) return undefined
  const service = delivery.value?.driver && delivery.value.driver.id === message.value?.driver_id ? delivery.value.driver.label : 'The delivery service'
  const admin = capabilities.value?.administer_delivery ? deliveryFailure(failure.code, service) : undefined
  return admin ?? { lead: '', next: failure.message }
})

const message = shallowRef<LogMessage>()
const loading = ref(false), missing = ref(false), denied = ref(false)
const error = ref(''), sendError = ref('')
const sending = ref(false)
const receipt = ref<SendReceipt>()
const copied = ref(false)
const begin = latestRequest()

async function load() {
  const id = props.messageId
  const current = begin()
  if (!id) { message.value = undefined; return }
  loading.value = true
  try {
    const item = await activity.get(id)
    if (!current()) return
    message.value = item
    error.value = ''
    missing.value = denied.value = false
  } catch (failure) {
    if (!current()) return
    message.value = undefined
    missing.value = isMissing(failure)
    denied.value = isDenied(failure)
    error.value = missing.value || denied.value ? '' : describe(failure, 'This message could not be loaded.')
  } finally {
    if (current()) loading.value = false
  }
}
watch(() => props.messageId, id => {
  receipt.value = undefined
  sendError.value = ''
  copied.value = false
  if (id !== message.value?.message_id) message.value = undefined
  void load()
}, { immediate: true })
useMailInvalidation('mail.activity', () => { if (props.messageId) void load() })

async function sendAgain() {
  const item = message.value
  if (!item || sending.value) return
  sending.value = true
  sendError.value = ''
  try {
    receipt.value = await activity.resend(item.message_id)
  } catch (failure) {
    sendError.value = describe(failure, 'The message could not be sent again.')
  } finally {
    sending.value = false
  }
}

async function copyLink() {
  const item = message.value
  if (!item) return
  try {
    await navigator.clipboard.writeText(`${window.location.origin}/system/mail/activity/${encodeURIComponent(item.message_id)}`)
    copied.value = true
  } catch {
    copied.value = false
  }
}

const templateTitle = computed(() => {
  const name = message.value?.template
  return name ? library.title('message', name) : ''
})
const templateExists = computed(() => !!message.value?.template && !!library.find('message', message.value.template))
const timeline = computed(() => {
  const item = message.value
  if (!item) return []
  const rows = [{ label: 'Accepted for delivery', at: item.created_at }]
  if (item.status === 'queued' && item.next_attempt_at) rows.push({ label: item.attempts ? `Attempt ${item.attempts} did not go through; trying again` : 'Next delivery attempt', at: item.next_attempt_at })
  if (item.sent_at) rows.push({ label: item.attempts > 1 ? `Sent after ${item.attempts} attempts` : 'Sent', at: item.sent_at })
  else if (item.status === 'failed' && item.finished_at) rows.push({ label: item.attempts > 1 ? `Failed after ${item.attempts} attempts` : 'Failed', at: item.finished_at })
  return rows
})
const attachments = computed(() => (message.value?.attachments ?? []).map(file => file.filename || 'Attachment'))
const technical = computed(() => {
  const item = message.value
  if (!item) return []
  return [
    { label: 'Message ID', value: item.message_id },
    { label: 'Delivery service', value: capabilities.value?.administer_delivery ? item.driver_id : undefined },
    { label: 'Service message ID', value: item.provider_message_id },
    { label: 'Error code', value: item.last_error?.code },
    { label: 'Service response', value: item.last_error?.provider_detail },
  ].filter((row): row is { label: string; value: string } => !!row.value)
})
</script>

<template>
  <Drawer :visible="!!messageId" position="right" :modal="true" :dismissable="!sending" :close-on-escape="!sending" :show-close-icon="false"
    class="mail-drawer" :pt="{ root: { style: 'width: min(560px, 92vw)' } }" aria-label="Message details"
    @update:visible="value => { if (!value) emit('close') }">
    <div ref="drawer" class="mail-drawer-body" tabindex="-1">
      <header class="mail-drawer-head">
        <div class="mail-drawer-title">
          <Tag v-if="message" :severity="statusSeverity[message.status]" :value="statusLabels[message.status]" class="kx-tag-sm" />
          <h2>{{ message?.subject ?? 'Message' }}</h2>
        </div>
        <Button text severity="secondary" :disabled="!message" :aria-label="copied ? 'Link copied' : 'Copy link'" :title="copied ? 'Link copied' : 'Copy link'" @click="copyLink">
          <template #icon><Icon :icon="copied ? 'tabler:check' : 'tabler:link'" aria-hidden="true" /></template>
        </Button>
        <Button text severity="secondary" aria-label="Close" title="Close" :disabled="sending" @click="emit('close')">
          <template #icon><Icon icon="tabler:x" aria-hidden="true" /></template>
        </Button>
      </header>

      <p v-if="loading && !message" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Loading message…</p>
      <p v-else-if="missing" class="kx-notice mail-block" role="status"><Icon icon="tabler:mail-off" aria-hidden="true" />This message is no longer in Activity.</p>
      <p v-else-if="denied" class="kx-notice warn mail-block" role="alert"><Icon icon="tabler:lock" aria-hidden="true" />Ask an administrator to grant you access to mail delivery.</p>
      <div v-else-if="error" class="kx-err mail-error" role="alert">
        <span>{{ error }}</span>
        <Button label="Retry" severity="secondary" outlined size="small" @click="load()" />
      </div>

      <template v-if="message">
        <div v-if="message.status === 'failed'" class="kx-notice error mail-failure">
          <Icon icon="tabler:alert-triangle" aria-hidden="true" />
          <div class="mail-failure-body">
            <strong>This message was not delivered.</strong>
            <span v-if="failureText?.lead">{{ failureText.lead }}</span>
            <span v-if="failureText">{{ failureText.next }}</span>
            <p v-if="receipt" class="mail-failure-done" role="status">
              Sent again as a new message.
              <Button link size="small" class="mail-inline-link" label="Open the new message" @click="go({ name: 'activity', message: receipt.message_id })" />
            </p>
            <p v-else-if="settingsFailure" class="mail-sub">Sending it again fails the same way until the delivery settings or the account with the service change.
              <Button v-if="capabilities?.administer_delivery" link size="small" class="mail-inline-link" label="Open delivery settings" @click="host.navigate('/system/settings/mail')" /></p>
            <p v-else-if="!message.can_resend" class="mail-sub">It cannot be sent again because its content was not kept.</p>
            <p v-if="sendError" class="mail-field-error" role="alert">{{ sendError }}</p>
            <div v-if="capabilities?.send && message.can_resend && !receipt && !settingsFailure">
              <Button label="Send again" :loading="sending" @click="sendAgain">
                <template #icon><Icon icon="tabler:send" aria-hidden="true" /></template>
              </Button>
            </div>
          </div>
        </div>
        <p v-else-if="message.status === 'queued'" class="kx-notice mail-block" role="status">
          <Icon icon="tabler:clock" aria-hidden="true" />Waiting to be delivered.
        </p>

        <dl class="mail-facts mail-card">
          <dt>To</dt><dd>{{ message.to.join(', ') }}</dd>
          <template v-if="message.cc?.length"><dt>Cc</dt><dd>{{ message.cc.join(', ') }}</dd></template>
          <template v-if="message.bcc?.length"><dt>Bcc</dt><dd>{{ message.bcc.join(', ') }}</dd></template>
          <template v-if="message.reply_to"><dt>Reply-to</dt><dd>{{ message.reply_to }}</dd></template>
          <dt>Template</dt>
          <dd>
            <Skeleton v-if="templateTitle === undefined" width="8rem" height="1rem" />
            <Button v-else-if="templateExists" link size="small" class="mail-inline-link" :label="templateTitle" @click="go({ name: 'resource', kind: 'message', resource: message.template!, section: 'content' })" />
            <span v-else>{{ templateTitle || 'Written directly' }}</span>
          </dd>
          <dt>Sent by</dt>
          <dd>{{ personLabel(message.sender_label, message.sender) }}<span v-if="message.origin" class="mail-sub">{{ originText(message.origin) }}</span></dd>
          <template v-if="attachments.length"><dt>Attachments</dt><dd>{{ attachments.join(', ') }}</dd></template>
          <template v-if="message.resend_of"><dt>Sent again from</dt><dd><Button link size="small" class="mail-inline-link" label="The original message" @click="go({ name: 'activity', message: message.resend_of })" /></dd></template>
        </dl>

        <section class="mail-group" aria-labelledby="message-history">
          <h3 id="message-history" class="mail-label">History</h3>
          <ol class="mail-timeline">
            <li v-for="row in timeline" :key="row.label"><span>{{ row.label }}</span><span class="mail-muted">{{ fullDate(row.at) }}</span></li>
          </ol>
        </section>

        <Disclosure v-if="technical.length" label="Technical details">
          <dl class="mail-facts">
            <template v-for="row in technical" :key="row.label"><dt>{{ row.label }}</dt><dd class="mail-mono-block">{{ row.value }}</dd></template>
          </dl>
        </Disclosure>
      </template>
    </div>
  </Drawer>
</template>
