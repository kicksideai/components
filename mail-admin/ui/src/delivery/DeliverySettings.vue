<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { host } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { computed, reactive, ref, shallowRef } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import SettingsGroup from '@kickside/ui-kit/SettingsGroup.vue'
import SettingsItem from '@kickside/ui-kit/SettingsItem.vue'
import SettingsSectionHead from '@kickside/ui-kit/SettingsSectionHead.vue'
import { activity, delivery as deliveryApi, isDenied } from '../api'
import { deliveryFailure, describe } from '../copy'
import { useMailInvalidation } from '../realtime'
import { navigate } from '../navigation'
import type { DeliveryStatus, LogMessage, TransportStatus } from '../types'
import { chooseService, isConflict } from './api'
import SettingsProvider, { type ProviderConfig } from './SettingsProvider.vue'

// Mail's delivery block: the admitted services from Mail's delivery status, the chosen one's own settings directly
// under the choice, every other installed service's settings in a collapsed section, and Mail's sender settings.
// Each namespace renders through the platform settings card from the settings_ns that the service reports.
const loading = ref(true), denied = ref(false)
const error = ref('')
const status = shallowRef<DeliveryStatus>()
const root = ref<HTMLElement>()
const beginRead = latestRequest()

async function load() {
  const current = beginRead()
  try {
    const next = await deliveryApi.status()
    if (!current()) return
    status.value = next
    denied.value = false
    error.value = ''
  } catch (failure) {
    if (!current()) return
    denied.value = isDenied(failure)
    error.value = denied.value ? '' : describe(failure, 'Delivery settings could not be loaded.')
  } finally {
    if (current()) loading.value = false
  }
}
function openMail(path = '') {
  navigate(root.value, '/system/mail' + path)
}

const transports = computed(() => status.value?.transports ?? [])
const selected = computed(() => transports.value.find(item => item.id === status.value?.driver?.id))
const options = computed(() => transports.value.map(item => ({
  value: item.id, label: item.title, icon: item.icon, ready: item.ready, reason: item.reason,
})))
const serviceDescription = computed(() => {
  const item = selected.value
  if (!item) return 'Choose the service that delivers your email.'
  return item.ready ? item.description : item.reason ?? item.description
})

const choosing = ref(false)
const serviceError = ref('')
const notice = ref('')
async function choose(id: string | undefined) {
  const current = status.value
  if (!id || !current || id === current.driver?.id || choosing.value) return
  const next = transports.value.find(item => item.id === id)
  if (!next) return
  if (current.driver && !await host.confirm({
    header: `Send email through ${next.title}?`,
    message: `Email sent after this goes through ${next.title} instead of ${current.driver.label}.`,
    acceptLabel: `Use ${next.title}`, rejectLabel: 'Cancel',
  })) return
  choosing.value = true
  serviceError.value = notice.value = ''
  try {
    await chooseService(id, current.driver_revision)
    notice.value = `Mail now sends through ${next.title}.`
  } catch (failure) {
    if (isConflict(failure)) notice.value = 'Someone changed the delivery service while you were here. It shows the current choice now.'
    else serviceError.value = describe(failure, 'The delivery service could not be changed.')
  } finally {
    await load()
    choosing.value = false
  }
}

const settingsOf = (item: TransportStatus): ProviderConfig =>
  ({ namespace: item.settings_ns, title: item.title, icon: item.icon, help: item.description })
const serviceSettings = computed(() => selected.value && settingsOf(selected.value))
// A collapsed service mounts its settings card only while open, so its settings are read when someone looks at them.
const others = computed(() => transports.value.filter(item => item.id !== selected.value?.id))
const expanded = reactive<Record<string, boolean>>({})
const senderSettings: ProviderConfig = {
  namespace: 'kickside.mail', title: 'Sender', icon: 'tabler:at',
  help: 'Who recipients see the email from, where replies go, and how long Mail keeps the delivery log.',
}

// The test goes to the signed-in administrator through the saved settings; its outcome arrives as Activity changes.
const test = shallowRef<LogMessage | { message_id: string; status: 'queued'; last_error?: undefined }>()
const testing = ref(false)
const testError = ref('')
const outcomeError = ref('')
const beginTestRead = latestRequest()
async function refreshTest() {
  const id = test.value?.message_id
  if (!id) return
  const current = beginTestRead()
  try {
    const item = await activity.get(id)
    if (current() && test.value?.message_id === id) {
      test.value = item
      outcomeError.value = ''
    }
  } catch (failure) {
    if (current() && test.value?.message_id === id) {
      outcomeError.value = describe(failure, 'The test email status could not be loaded.')
    }
  }
}
useHostVisibilityRefresh(async () => {
  await load()
  if (test.value?.status === 'queued') await refreshTest()
})
useMailInvalidation('mail.activity', () => { if (test.value?.status === 'queued') void refreshTest() })
async function runTest() {
  testing.value = true
  testError.value = outcomeError.value = ''
  test.value = undefined
  try {
    const receipt = await deliveryApi.sendTest()
    test.value = { message_id: receipt.message_id, status: 'queued' }
    await refreshTest()
  } catch (failure) {
    testError.value = describe(failure, 'The test email could not be sent.')
  } finally {
    testing.value = false
    void load()
  }
}
const testFailure = computed(() => {
  const failure = test.value?.last_error
  if (!failure) return undefined
  return deliveryFailure(failure.code, status.value?.driver?.label ?? 'The service', 'above')
    ?? { lead: 'The service did not accept the test.', next: failure.message }
})
const testBlocked = computed(() => selected.value ? '' : 'Choose a service to send a test.')
</script>

<template>
  <section ref="root" class="mail-delivery" aria-label="Mail delivery settings">
    <SettingsSectionHead title="Mail" description="How email leaves this workspace. Templates and their look are in System → Mail.">
      <template #actions>
        <Button label="Templates" severity="secondary" outlined @click="openMail()">
          <template #icon><Icon icon="tabler:template" aria-hidden="true" /></template>
        </Button>
      </template>
    </SettingsSectionHead>

    <p v-if="loading" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Loading delivery settings…</p>
    <p v-else-if="denied" class="kx-notice warn mail-block" role="alert"><Icon icon="tabler:lock" aria-hidden="true" />Ask an administrator to grant you access to mail delivery.</p>
    <div v-else-if="error && !status" class="kx-err mail-error" role="alert"><span>{{ error }}</span><Button label="Retry" severity="secondary" outlined size="small" @click="load()" /></div>
    <template v-else-if="status">
      <p v-if="error" class="kx-notice warn mail-block" role="alert">{{ error }}</p>
      <p v-if="!status.configured && status.reason" class="kx-notice warn mail-block" role="status">
        <Icon icon="tabler:alert-triangle" aria-hidden="true" /><span><strong>Mail is not set up yet.</strong> {{ status.reason }}</span>
      </p>
      <p v-if="notice" class="kx-notice info mail-block" role="status"><Icon icon="tabler:circle-check" aria-hidden="true" />{{ notice }}</p>

      <SettingsGroup title="Delivery service" class="mail-service-group">
        <SettingsItem title="Service" :description="serviceDescription">
          <template #actions>
            <span class="mail-setting-control">
              <Select :model-value="selected?.id" :options="options" option-label="label" option-value="value" append-to="self" fluid
                placeholder="Choose a service…" aria-label="Service" :loading="choosing" :disabled="choosing"
                empty-message="No delivery service is installed" @update:model-value="choose">
                <template #value="{ value, placeholder }">
                  <span v-if="value && selected" class="mail-kind"><Icon :icon="selected.icon" aria-hidden="true" />{{ selected.title }}</span>
                  <span v-else>{{ placeholder }}</span>
                </template>
                <template #option="{ option }">
                  <span class="mail-service-option">
                    <span class="mail-kind"><Icon :icon="option.icon" aria-hidden="true" />{{ option.label }}</span>
                    <Tag :severity="option.ready ? 'success' : 'warn'" :value="option.ready ? 'Ready' : 'Needs setup'" class="kx-tag-sm" />
                    <span v-if="!option.ready && option.reason" class="mail-sub">{{ option.reason }}</span>
                  </span>
                </template>
              </Select>
              <small v-if="serviceError" class="mail-field-error" role="alert">{{ serviceError }}</small>
            </span>
          </template>
          <template v-if="selected" #status>
            <Tag :severity="selected.ready ? 'success' : 'warn'" :value="selected.ready ? 'Ready' : 'Needs setup'" class="kx-tag-sm" />
          </template>
        </SettingsItem>
      </SettingsGroup>

      <SettingsProvider v-if="serviceSettings" :key="serviceSettings.namespace" :config="serviceSettings" />

      <SettingsGroup v-if="others.length" :title="selected ? 'Other services' : 'Services'" class="mail-other-services">
        <Disclosure v-for="item in others" :key="item.id" v-model:open="expanded[item.id]" :label="item.title">
          <SettingsProvider v-if="expanded[item.id]" :config="settingsOf(item)" />
        </Disclosure>
      </SettingsGroup>

      <SettingsProvider :config="senderSettings" />

      <SettingsGroup title="Test">
        <SettingsItem title="Send a test email" :description="testBlocked || 'Sends a short message to you with the saved settings.'">
          <template #actions>
            <Button label="Send test email" severity="secondary" outlined :loading="testing" :disabled="!!testBlocked || testing" @click="runTest">
              <template #icon><Icon icon="tabler:send" aria-hidden="true" /></template>
            </Button>
          </template>
        </SettingsItem>
        <div v-if="test || testError" class="mail-test-result" role="status">
          <p v-if="testError" class="kx-notice error mail-block"><Icon icon="tabler:alert-triangle" aria-hidden="true" />{{ testError }}</p>
          <p v-else-if="test?.status === 'queued'" class="kx-notice mail-block"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Sending the test…</p>
          <p v-else-if="test?.status === 'sent'" class="kx-notice info mail-block"><Icon icon="tabler:circle-check" aria-hidden="true" />The test was accepted for delivery. Check your inbox.</p>
          <div v-else-if="test?.status === 'failed' && testFailure" class="kx-notice error mail-block">
            <Icon icon="tabler:alert-triangle" aria-hidden="true" />
            <div class="mail-failure-body">
              <strong>{{ testFailure.lead }}</strong>
              <span>{{ testFailure.next }}</span>
              <Button link size="small" class="mail-inline-link" label="Open it in Activity" @click="openMail('/activity/' + encodeURIComponent(test.message_id))" />
            </div>
          </div>
          <p v-if="outcomeError" class="kx-notice warn mail-block" role="alert">{{ outcomeError }}</p>
        </div>
      </SettingsGroup>
    </template>
  </section>
</template>
