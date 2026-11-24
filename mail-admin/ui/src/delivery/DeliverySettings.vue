<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { host } from '@wippy-fe/proxy'
import { computed, onMounted, ref, shallowRef, useId, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import SettingsDraftActions from '@kickside/ui-kit/SettingsDraftActions.vue'
import SettingsSectionHead from '@kickside/ui-kit/SettingsSectionHead.vue'
import { activity, delivery as deliveryApi, isDenied } from '../api'
import { describe } from '../copy'
import { ensureTag } from '../mount'
import { useMessageChanges } from '../realtime'
import type { DeliveryStatus, LogMessage } from '../types'
import { drivers as listDrivers, save as saveSettings, sendTest, settings as readSettings, type Driver, type Setting, type SettingWrite } from './api'
import DriverRows from './DriverRows.vue'

// Mail's block in System → Settings: the delivery service, its own settings, the sender identity and a test.
// One draft and one Save cover the block and the active driver's settings, whether the driver ships its own view
// or gets rows generated from its setting definitions.
const ids = { driver: useId(), address: useId(), name: useId(), reply: useId() }
const MAIL = 'kickside.mail'

const loading = ref(true), denied = ref(false)
const error = ref('')
const drivers = shallowRef<Driver[]>([])
const status = shallowRef<DeliveryStatus>()
const mailSettings = shallowRef<Setting[]>([])
const driverSettings = shallowRef<Setting[]>([])
const driverLoading = ref(false), driverError = ref('')

interface Identity { driver: string; from_address: string; from_name: string; reply_to: string }
const saved = ref<Identity>({ driver: '', from_address: '', from_name: '', reply_to: '' })
const draft = ref<Identity>({ ...saved.value })
const driverChanges = ref<Record<string, unknown>>({})
const driverValid = ref(true)
const fieldErrors = ref<Record<string, string>>({})
const busy = ref<'save' | 'test'>()
const notice = ref('')

function identityOf(list: Setting[]): Identity {
  const value = (key: string) => { const item = list.find(entry => entry.key === key); return typeof item?.value === 'string' ? item.value : '' }
  return { driver: value('driver'), from_address: value('from_address'), from_name: value('from_name'), reply_to: value('reply_to') }
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [found, current, list] = await Promise.all([listDrivers(), deliveryApi.status(), readSettings(MAIL)])
    drivers.value = found
    status.value = current
    mailSettings.value = list
    saved.value = identityOf(list)
    draft.value = { ...saved.value }
    denied.value = false
  } catch (failure) {
    denied.value = isDenied(failure)
    error.value = denied.value ? '' : describe(failure, 'Delivery settings could not be loaded.')
  } finally {
    loading.value = false
  }
}
onMounted(load)

const active = computed(() => drivers.value.find(item => item.id === draft.value.driver))
const viewReady = ref(false)
watch(active, async driver => {
  driverChanges.value = {}
  driverValid.value = true
  fieldErrors.value = {}
  driverSettings.value = []
  viewReady.value = false
  if (!driver) return
  driverLoading.value = true
  driverError.value = ''
  try {
    const [list, ready] = await Promise.all([readSettings(driver.settings_ns), driver.settings_view ? ensureTag(driver.settings_view) : Promise.resolve(false)])
    if (active.value?.id !== driver.id) return
    driverSettings.value = list
    viewReady.value = ready
    if (driver.settings_view && !ready) driverError.value = `The ${driver.label} settings could not be loaded. Reload the page to try again.`
  } catch (failure) {
    driverError.value = describe(failure, `The ${driver.label} settings could not be loaded.`)
  } finally {
    driverLoading.value = false
  }
})

// What the driver's own view receives: saved values other than secrets, and which secrets are set.
const panelValues = computed(() => JSON.stringify(Object.fromEntries(driverSettings.value
  .filter(item => !(item.is_secret || item.value_type === 'secret')).map(item => [item.key, item.value ?? item.default ?? null]))))
const panelSecrets = computed(() => JSON.stringify(Object.fromEntries(driverSettings.value
  .filter(item => item.is_secret || item.value_type === 'secret').map(item => [item.key, !!item.has_value]))))
const panelErrors = computed(() => JSON.stringify(fieldErrors.value))
function fromPanel(event: Event, kind: 'change' | 'validity') {
  const detail = (event as CustomEvent).detail as { values?: Record<string, unknown>; valid?: boolean } | undefined
  if (kind === 'change' && detail?.values && typeof detail.values === 'object') driverChanges.value = { ...detail.values }
  if (kind === 'validity' && typeof detail?.valid === 'boolean') driverValid.value = detail.valid
}

const addressPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const identityErrors = computed(() => ({
  from_address: draft.value.from_address && !addressPattern.test(draft.value.from_address) ? 'Enter an email address such as support@example.com.' : fieldErrors.value.from_address ?? '',
  reply_to: draft.value.reply_to && !addressPattern.test(draft.value.reply_to) ? 'Enter an email address, or leave it empty.' : fieldErrors.value.reply_to ?? '',
}))
const reviewing = ref(false)
const changes = computed(() => {
  const list: string[] = []
  if (draft.value.driver !== saved.value.driver) list.push(`Service: ${active.value?.label ?? 'none'}`)
  const labels = { from_address: 'From address', from_name: 'From name', reply_to: 'Reply-to' } as const
  for (const key of Object.keys(labels) as (keyof typeof labels)[]) if (draft.value[key] !== saved.value[key]) list.push(labels[key])
  for (const key of Object.keys(driverChanges.value)) {
    const setting = driverSettings.value.find(item => item.key === key)
    list.push(`${active.value?.label}: ${setting?.title ?? key}`)
  }
  return list
})
const dirty = computed(() => JSON.stringify(draft.value) !== JSON.stringify(saved.value) || Object.keys(driverChanges.value).length > 0)
const invalid = computed(() => !!identityErrors.value.from_address || !!identityErrors.value.reply_to || !driverValid.value)

// The driver's view starts again from the saved values after Discard or Save.
const panelGeneration = ref(0)
function discard() {
  draft.value = { ...saved.value }
  driverChanges.value = {}
  fieldErrors.value = {}
  driverSettings.value = [...driverSettings.value]
  panelGeneration.value++
}

async function save() {
  if (busy.value || invalid.value) return
  busy.value = 'save'
  notice.value = error.value = ''
  fieldErrors.value = {}
  // The driver's own settings first and the active service last, so a refused value never switches mail to a
  // service that is half set up.
  const writes: SettingWrite[] = []
  const namespace = active.value?.settings_ns
  if (namespace) for (const [key, value] of Object.entries(driverChanges.value)) writes.push({ namespace, key, value: value === '' ? null : value })
  for (const key of ['from_address', 'from_name', 'reply_to'] as const) {
    if (draft.value[key] !== saved.value[key]) writes.push({ namespace: MAIL, key, value: draft.value[key] || null })
  }
  if (draft.value.driver !== saved.value.driver) writes.push({ namespace: MAIL, key: 'driver', value: draft.value.driver || null })
  try {
    const refused = await saveSettings(writes)
    if (refused) {
      fieldErrors.value = { [refused.key]: refused.error }
      error.value = 'Some changes were not saved. Correct the highlighted value and save again.'
      return
    }
    const [current, list] = await Promise.all([deliveryApi.status(), readSettings(MAIL)])
    status.value = current
    mailSettings.value = list
    saved.value = identityOf(list)
    draft.value = { ...saved.value }
    if (namespace) driverSettings.value = await readSettings(namespace)
    driverChanges.value = {}
    panelGeneration.value++
    reviewing.value = false
    notice.value = 'Delivery settings saved.'
  } catch (failure) {
    error.value = describe(failure, 'Delivery settings could not be saved.')
  } finally {
    busy.value = undefined
  }
}

// The test goes to the signed-in administrator through the saved settings; its outcome arrives as Activity changes.
const test = shallowRef<LogMessage | { message_id: string; status: 'queued' }>()
const testError = ref('')
async function refreshTest() {
  if (!test.value) return
  try { test.value = await activity.get(test.value.message_id) } catch { /* the receipt stays until the next change */ }
}
useMessageChanges(change => { if (change.message_id === test.value?.message_id) void refreshTest() })
async function runTest() {
  busy.value = 'test'
  testError.value = ''
  test.value = undefined
  try {
    const receipt = await sendTest()
    test.value = { message_id: receipt.message_id, status: 'queued' }
    await refreshTest()
  } catch (failure) {
    testError.value = describe(failure, 'The test email could not be sent.')
  } finally {
    busy.value = undefined
  }
}
const testFailure = computed(() => test.value && 'last_error' in test.value ? test.value.last_error?.message ?? '' : '')

const serviceOptions = computed(() => drivers.value.map(item => ({ value: item.id, label: item.label, icon: item.icon, description: item.description })))
const statusNotice = computed(() => {
  const current = status.value
  if (!current || current.configured) return undefined
  return current.reason ?? 'Mail delivery is not set up.'
})
</script>

<template>
  <section class="mail-delivery" aria-label="Mail delivery settings">
    <SettingsSectionHead title="Mail" description="How email leaves this workspace. Templates and their look are in System → Mail.">
      <template #actions>
        <SettingsDraftActions v-if="dirty" :busy="busy === 'save'" :review-disabled="invalid" @discard="discard" @review="reviewing = true" />
        <Button v-else label="Templates" severity="secondary" outlined @click="host.navigate('/system/mail')">
          <template #icon><Icon icon="tabler:template" aria-hidden="true" /></template>
        </Button>
      </template>
    </SettingsSectionHead>

    <p v-if="loading" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Loading delivery settings…</p>
    <p v-else-if="denied" class="kx-notice warn mail-block" role="alert"><Icon icon="tabler:lock" aria-hidden="true" />Ask an administrator to grant you access to mail delivery.</p>
    <template v-else>
      <div v-if="error" class="kx-err mail-error" role="alert"><span>{{ error }}</span><Button v-if="!drivers.length" label="Retry" severity="secondary" outlined size="small" @click="load()" /></div>
      <p v-if="notice" class="kx-notice info mail-block" role="status"><Icon icon="tabler:circle-check" aria-hidden="true" />{{ notice }}</p>
      <p v-if="statusNotice && !dirty" class="kx-notice warn mail-block" role="status">
        <Icon icon="tabler:alert-triangle" aria-hidden="true" /><span><strong>Mail is not set up yet.</strong> {{ statusNotice }}</span>
      </p>

      <fieldset class="mail-fieldset mail-delivery-body" :disabled="busy === 'save'" :inert="busy === 'save' || undefined">
        <h2 class="mail-label">Delivery service</h2>
        <div class="mail-settings-list">
          <div class="mail-setting-row">
            <div class="mail-setting-text">
              <label class="mail-setting-title" :for="ids.driver">Service</label>
              <p class="mail-setting-help">{{ active?.description || 'Choose the service that delivers your email.' }}</p>
            </div>
            <div class="mail-setting-control">
              <Select v-model="draft.driver" :input-id="ids.driver" :options="serviceOptions" option-label="label" option-value="value" append-to="self"
                placeholder="Choose a service…" fluid :empty-message="'No delivery service is installed'">
                <template #value="{ value, placeholder }">
                  <span v-if="value" class="mail-kind"><Icon :icon="serviceOptions.find(item => item.value === value)?.icon ?? 'tabler:mail'" aria-hidden="true" />{{ serviceOptions.find(item => item.value === value)?.label ?? value }}</span>
                  <span v-else>{{ placeholder }}</span>
                </template>
                <template #option="{ option }"><span class="mail-kind"><Icon :icon="option.icon" aria-hidden="true" />{{ option.label }}</span></template>
              </Select>
            </div>
          </div>
          <p v-if="driverLoading" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Loading {{ active?.label }} settings…</p>
          <p v-else-if="driverError" class="kx-err inline mail-driver-error" role="alert">{{ driverError }}</p>
          <template v-else-if="active">
            <component :is="active.settings_view" v-if="active.settings_view && viewReady" :key="active.id + ':' + panelGeneration"
              class="mail-driver-view" :values.attr="panelValues" :secrets.attr="panelSecrets" :errors.attr="panelErrors" :disabled.attr="String(busy === 'save')"
              @change="(event: Event) => fromPanel(event, 'change')" @validity="(event: Event) => fromPanel(event, 'validity')" />
            <DriverRows v-else :settings="driverSettings" :errors="fieldErrors" :disabled="busy === 'save'"
              @change="values => driverChanges = values" @validity="valid => driverValid = valid" />
          </template>
        </div>

        <h2 class="mail-label">Sender</h2>
        <div class="mail-settings-list">
          <div class="mail-setting-row" :class="{ 'mail-setting-invalid': identityErrors.from_address }">
            <div class="mail-setting-text">
              <label class="mail-setting-title" :for="ids.address">From address</label>
              <p class="mail-setting-help">The address recipients see and reply to by default. The service must accept mail from it.</p>
            </div>
            <div class="mail-setting-control">
              <InputText :id="ids.address" v-model.trim="draft.from_address" fluid placeholder="support@example.com" :invalid="!!identityErrors.from_address" />
              <small v-if="identityErrors.from_address" class="mail-field-error" role="alert">{{ identityErrors.from_address }}</small>
            </div>
          </div>
          <div class="mail-setting-row">
            <div class="mail-setting-text">
              <label class="mail-setting-title" :for="ids.name">From name</label>
              <p class="mail-setting-help">Shown next to the address, for example your company’s name.</p>
            </div>
            <div class="mail-setting-control"><InputText :id="ids.name" v-model="draft.from_name" fluid /></div>
          </div>
          <div class="mail-setting-row" :class="{ 'mail-setting-invalid': identityErrors.reply_to }">
            <div class="mail-setting-text">
              <label class="mail-setting-title" :for="ids.reply">Reply-to</label>
              <p class="mail-setting-help">Where replies go when it is not the From address. Optional.</p>
            </div>
            <div class="mail-setting-control">
              <InputText :id="ids.reply" v-model.trim="draft.reply_to" fluid :invalid="!!identityErrors.reply_to" />
              <small v-if="identityErrors.reply_to" class="mail-field-error" role="alert">{{ identityErrors.reply_to }}</small>
            </div>
          </div>
        </div>
      </fieldset>

      <h2 class="mail-label">Test</h2>
      <div class="mail-settings-list">
        <div class="mail-setting-row">
          <div class="mail-setting-text">
            <span class="mail-setting-title">Send a test email</span>
            <p class="mail-setting-help">Sends a short message to you with the saved settings.</p>
          </div>
          <div class="mail-setting-control mail-test-control">
            <Button label="Send test email" severity="secondary" outlined :loading="busy === 'test'" :disabled="dirty || !!busy || !status?.configured"
              :title="dirty ? 'Save your changes first.' : !status?.configured ? 'Set up delivery first.' : undefined" @click="runTest">
              <template #icon><Icon icon="tabler:send" aria-hidden="true" /></template>
            </Button>
          </div>
        </div>
        <div v-if="test || testError" class="mail-test-result" role="status">
          <p v-if="testError" class="kx-notice error mail-block"><Icon icon="tabler:alert-triangle" aria-hidden="true" />{{ testError }}</p>
          <p v-else-if="test?.status === 'queued'" class="kx-notice mail-block"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Sending the test…</p>
          <p v-else-if="test?.status === 'sent'" class="kx-notice info mail-block"><Icon icon="tabler:circle-check" aria-hidden="true" />The test was accepted for delivery. Check your inbox.</p>
          <div v-else-if="test?.status === 'failed'" class="kx-notice error mail-block">
            <Icon icon="tabler:alert-triangle" aria-hidden="true" />
            <div class="mail-failure-body">
              <strong>The service did not accept the test.</strong>
              <code v-if="testFailure" class="mail-problem-detail">{{ testFailure }}</code>
              <button type="button" class="mail-text-link" @click="host.navigate('/system/mail/activity/' + test.message_id)">Open it in Activity</button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <Dialog :visible="reviewing" modal :draggable="false" :closable="busy !== 'save'" class="mail-dialog" aria-label="Review changes"
      :pt="{ header: { class: 'mail-dialog-header' }, footer: { class: 'mail-dialog-footer' } }" @update:visible="value => { if (!value) reviewing = false }">
      <template #header>
        <span class="kx-modal-head-icon"><Icon icon="tabler:checklist" aria-hidden="true" /></span>
        <span class="kx-modal-head-text"><span class="kx-modal-head-title">Review changes</span><span class="kx-modal-head-sub">Mail delivery</span></span>
      </template>
      <ul class="mail-change-list"><li v-for="change in changes" :key="change">{{ change }}</li></ul>
      <p class="mail-muted mail-review-note">Email sent after you save uses these settings.</p>
      <p v-if="error" class="kx-err inline" role="alert">{{ error }}</p>
      <template #footer>
        <Button label="Keep editing" severity="secondary" outlined :disabled="busy === 'save'" @click="reviewing = false" />
        <Button label="Save" :loading="busy === 'save'" @click="save" />
      </template>
    </Dialog>
  </section>
</template>
