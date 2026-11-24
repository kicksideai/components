<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { host } from '@wippy-fe/proxy'
import { useEvents } from '@wippy-fe/webcomponent-vue'
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import SettingsDraftActions from '@kickside/ui-kit/SettingsDraftActions.vue'
import SettingsGroup from '@kickside/ui-kit/SettingsGroup.vue'
import SettingsItem from '@kickside/ui-kit/SettingsItem.vue'
import SettingsSectionHead from '@kickside/ui-kit/SettingsSectionHead.vue'
import { activity, delivery as deliveryApi, isDenied } from '../api'
import { describe } from '../copy'
import { useReturnFocus } from '../focus'
import { ensureTag } from '../mount'
import { useMessageChanges } from '../realtime'
import type { DeliveryStatus, LogMessage } from '../types'
import { drivers as listDrivers, save as saveSettings, sendTest, settings as readSettings, type Driver, type Setting, type SettingWrite } from './api'
import DriverRows from './DriverRows.vue'

// Mail's block in System → Settings: the delivery service, its own settings, the sender identity and a test.
// One draft and one Save cover the block and the active driver's settings, whether the driver ships its own view
// or gets rows generated from its setting definitions.
const emit = useEvents<{ 'dirty-change': { dirty: boolean } }>()
const MAIL = 'kickside.mail'
const identityKeys = ['from_address', 'from_name', 'reply_to'] as const
const identityLabels = { from_address: 'From address', from_name: 'From name', reply_to: 'Reply-to' } as const

const loading = ref(true), denied = ref(false)
const error = ref('')
const drivers = shallowRef<Driver[]>([])
const status = shallowRef<DeliveryStatus>()

interface Identity { driver: string; from_address: string; from_name: string; reply_to: string }
const saved = ref<Identity>({ driver: '', from_address: '', from_name: '', reply_to: '' })
const draft = ref<Identity>({ ...saved.value })
const driverChanges = ref<Record<string, unknown>>({})
const driverValid = ref(true)
const fieldErrors = ref<Record<string, string>>({})
const busy = ref<'save' | 'test'>()
// What the last Save did: the values it saved, the one the server refused and those it did not reach.
const outcome = ref<{ saved: string[]; refused?: { label: string; reason: string }; pending: string[] }>()

function identityOf(list: Setting[]): Identity {
  const value = (key: string) => { const item = list.find(entry => entry.key === key); return typeof item?.value === 'string' ? item.value : '' }
  return { driver: value('driver'), from_address: value('from_address'), from_name: value('from_name'), reply_to: value('reply_to') }
}

// The true state: installed drivers with their settings, delivery status and Mail's own values.
async function read() {
  const [found, current, list] = await Promise.all([listDrivers(), deliveryApi.status(), readSettings(MAIL)])
  drivers.value = found
  status.value = current
  return identityOf(list)
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    saved.value = await read()
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
const driverSettings = computed(() => active.value?.settings ?? [])
const viewReady = ref(false)
const driverLoading = ref(false), driverError = ref('')
watch(() => active.value?.id, async () => {
  const driver = active.value
  driverChanges.value = {}
  driverValid.value = true
  fieldErrors.value = {}
  viewReady.value = false
  driverLoading.value = !!driver?.settings_view
  driverError.value = ''
  if (!driver?.settings_view) return
  const ready = await ensureTag(driver.settings_view)
  if (active.value?.id !== driver.id) return
  viewReady.value = ready
  driverLoading.value = false
  if (!ready) driverError.value = `The ${driver.label} settings could not be loaded. Reload the page to try again.`
})

const isSecret = (item: Setting) => !!item.is_secret || item.value_type === 'secret'
// What the driver's own view receives: saved values other than secrets, which secrets are set, and the block's draft.
const panelValues = computed(() => JSON.stringify(Object.fromEntries(driverSettings.value
  .filter(item => !isSecret(item)).map(item => [item.key, item.value ?? item.default ?? null]))))
const panelSecrets = computed(() => JSON.stringify(Object.fromEntries(driverSettings.value
  .filter(isSecret).map(item => [item.key, !!item.has_value]))))
const panelErrors = computed(() => JSON.stringify(fieldErrors.value))
const panelDraft = ref('{}')
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
const settingLabel = (key: string) => `${active.value?.label}: ${driverSettings.value.find(item => item.key === key)?.title ?? key}`
const reviewing = ref(false)
useReturnFocus(() => reviewing.value)
const changes = computed(() => {
  const list: string[] = []
  if (draft.value.driver !== saved.value.driver) list.push(`Service: ${active.value?.label ?? 'none'}`)
  for (const key of identityKeys) if (draft.value[key] !== saved.value[key]) list.push(identityLabels[key])
  for (const key of Object.keys(driverChanges.value)) list.push(settingLabel(key))
  return list
})
const dirty = computed(() => JSON.stringify(draft.value) !== JSON.stringify(saved.value) || Object.keys(driverChanges.value).length > 0)
watch(dirty, value => emit('dirty-change', { dirty: value }), { immediate: true })
const invalid = computed(() => !!identityErrors.value.from_address || !!identityErrors.value.reply_to || !driverValid.value)

// The driver's view starts again from the saved values and the block's draft after Discard or Save.
const panelGeneration = ref(0)
function remountPanel() {
  panelDraft.value = JSON.stringify(driverChanges.value)
  panelGeneration.value++
}
function discard() {
  draft.value = { ...saved.value }
  driverChanges.value = {}
  fieldErrors.value = {}
  outcome.value = undefined
  remountPanel()
}

// The draft's writes, in order: the driver's own settings, the sender, then the active service. The Settings API
// writes them one by one and stops at the first refusal, so the service switch comes last and never lands without
// the settings it needs.
function writesOf(): { write: SettingWrite; label: string }[] {
  const writes: { write: SettingWrite; label: string }[] = []
  const namespace = active.value?.settings_ns
  if (namespace) for (const [key, value] of Object.entries(driverChanges.value)) {
    writes.push({ write: { namespace, key, value: value === '' ? null : value }, label: settingLabel(key) })
  }
  for (const key of identityKeys) {
    if (draft.value[key] !== saved.value[key]) writes.push({ write: { namespace: MAIL, key, value: draft.value[key] || null }, label: identityLabels[key] })
  }
  if (draft.value.driver !== saved.value.driver) writes.push({ write: { namespace: MAIL, key: 'driver', value: draft.value.driver || null }, label: `Service: ${active.value?.label ?? 'none'}` })
  return writes
}

// Whether a write is what the server now holds. A secret is held when it is set; its value never comes back.
function landed(write: SettingWrite, identity: Identity): boolean {
  if (write.namespace === MAIL) return (identity[write.key as keyof Identity] || null) === write.value
  const setting = drivers.value.find(item => item.settings_ns === write.namespace)?.settings.find(item => item.key === write.key)
  if (!setting) return false
  if (isSecret(setting)) return write.value === null ? !setting.has_value : !!setting.has_value
  return (setting.value ?? setting.default ?? null) === write.value || (write.value === null && (setting.value ?? null) === (setting.default ?? null))
}

async function save() {
  if (busy.value || invalid.value) return
  busy.value = 'save'
  error.value = ''
  fieldErrors.value = {}
  outcome.value = undefined
  const writes = writesOf()
  let refused: { namespace: string; key: string; error: string } | undefined
  let failed = ''
  try {
    refused = await saveSettings(writes.map(entry => entry.write))
  } catch (failure) {
    failed = describe(failure, 'Delivery settings could not be saved.')
  }
  // Whatever the answer, the page shows what the server now holds and keeps only the changes that did not land.
  try {
    const identity = await read()
    const kept = writes.filter(entry => !landed(entry.write, identity))
    const keptIdentity = { ...identity }
    const keptDriver: Record<string, unknown> = {}
    for (const { write } of kept) {
      if (write.namespace === MAIL) keptIdentity[write.key as keyof Identity] = typeof write.value === 'string' ? write.value : ''
      else keptDriver[write.key] = write.value ?? ''
    }
    saved.value = identity
    draft.value = keptIdentity
    driverChanges.value = keptDriver
    const refusedEntry = refused && writes.find(entry => entry.write.namespace === refused!.namespace && entry.write.key === refused!.key)
    if (refused) fieldErrors.value = { [refused.key]: refused.error }
    outcome.value = {
      saved: writes.filter(entry => !kept.includes(entry)).map(entry => entry.label),
      refused: refusedEntry ? { label: refusedEntry.label, reason: refused!.error } : undefined,
      pending: kept.filter(entry => entry !== refusedEntry).map(entry => entry.label),
    }
    if (!kept.length) reviewing.value = false
    remountPanel()
  } catch (failure) {
    failed = failed || describe(failure, 'Delivery settings could not be read back.')
  } finally {
    if (failed) error.value = failed
    busy.value = undefined
  }
}

// Leaving through the block's own links asks first while there are unsaved changes.
async function leave(path: string) {
  if (dirty.value && !await host.confirm({
    header: 'Discard unsaved changes?', message: 'Your changes to the mail delivery settings are not saved yet.',
    acceptLabel: 'Discard changes', rejectLabel: 'Keep editing', acceptClass: 'p-button-danger',
  })) return
  host.navigate(path)
}

// The test goes to the signed-in administrator through the saved settings; its outcome arrives as Activity changes.
const test = shallowRef<LogMessage | { message_id: string; status: 'queued'; last_error?: undefined }>()
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
// A refused credential or configuration is fixed here, so the test result says what to change.
const settingsCodes = new Set(['invalid_config', 'credentials_invalid', 'provider_endpoint_invalid', 'settings_read_failed'])
const testFailure = computed(() => {
  const failure = test.value?.last_error
  if (!failure) return undefined
  if (failure.code === 'credentials_invalid') return { lead: `${status.value?.driver?.label ?? 'The service'} refused the credentials.`, next: 'Check the API key above, save, and send the test again.' }
  if (settingsCodes.has(failure.code)) return { lead: 'The delivery settings are not complete.', next: 'Check the settings above, save, and send the test again.' }
  return { lead: 'The service did not accept the test.', next: failure.message }
})
const testBlocked = computed(() => dirty.value ? 'Save or discard your changes to send a test.'
  : !status.value?.configured ? 'Finish setting up delivery to send a test.' : '')

const serviceOptions = computed(() => drivers.value.map(item => ({ value: item.id, label: item.label, icon: item.icon, description: item.description })))
const statusNotice = computed(() => {
  const current = status.value
  if (!current || current.configured) return undefined
  return current.reason ?? 'Choose a delivery service for Mail.'
})
</script>

<template>
  <section class="mail-delivery" aria-label="Mail delivery settings">
    <SettingsSectionHead title="Mail" description="How email leaves this workspace. Templates and their look are in System → Mail.">
      <template #actions>
        <SettingsDraftActions v-if="dirty" :busy="busy === 'save'" :review-disabled="invalid" @discard="discard" @review="outcome = undefined; reviewing = true" />
        <Button v-else label="Templates" severity="secondary" outlined @click="leave('/system/mail')">
          <template #icon><Icon icon="tabler:template" aria-hidden="true" /></template>
        </Button>
      </template>
    </SettingsSectionHead>

    <p v-if="loading" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Loading delivery settings…</p>
    <p v-else-if="denied" class="kx-notice warn mail-block" role="alert"><Icon icon="tabler:lock" aria-hidden="true" />Ask an administrator to grant you access to mail delivery.</p>
    <template v-else>
      <div v-if="error" class="kx-err mail-error" role="alert"><span>{{ error }}</span><Button v-if="!drivers.length" label="Retry" severity="secondary" outlined size="small" @click="load()" /></div>
      <div v-if="outcome && !reviewing" class="mail-outcome" role="status">
        <p v-if="outcome.saved.length" class="kx-notice info mail-block"><Icon icon="tabler:circle-check" aria-hidden="true" /><span>Saved: {{ outcome.saved.join(', ') }}.</span></p>
        <p v-if="outcome.refused" class="kx-notice error mail-block"><Icon icon="tabler:alert-triangle" aria-hidden="true" />
          <span>Not saved: {{ outcome.refused.label }}. {{ outcome.refused.reason }}</span></p>
        <p v-if="outcome.pending.length" class="kx-notice warn mail-block"><Icon icon="tabler:clock-pause" aria-hidden="true" />
          <span>Still in your draft: {{ outcome.pending.join(', ') }}. Correct the value above and save again.</span></p>
      </div>
      <p v-if="statusNotice && !dirty" class="kx-notice warn mail-block" role="status">
        <Icon icon="tabler:alert-triangle" aria-hidden="true" /><span><strong>Mail is not set up yet.</strong> {{ statusNotice }}</span>
      </p>

      <fieldset class="mail-fieldset mail-delivery-body" :disabled="busy === 'save'" :inert="busy === 'save' || undefined">
        <SettingsGroup title="Delivery service">
          <SettingsItem title="Service" :description="active?.description || 'Choose the service that delivers your email.'">
            <template #actions>
              <Select v-model="draft.driver" :options="serviceOptions" option-label="label" option-value="value" append-to="self"
                placeholder="Choose a service…" class="mail-setting-control" aria-label="Service" :empty-message="'No delivery service is installed'">
                <template #value="{ value, placeholder }">
                  <span v-if="value" class="mail-kind"><Icon :icon="serviceOptions.find(item => item.value === value)?.icon ?? 'tabler:mail'" aria-hidden="true" />{{ serviceOptions.find(item => item.value === value)?.label ?? value }}</span>
                  <span v-else>{{ placeholder }}</span>
                </template>
                <template #option="{ option }"><span class="mail-kind"><Icon :icon="option.icon" aria-hidden="true" />{{ option.label }}</span></template>
              </Select>
            </template>
          </SettingsItem>
          <p v-if="driverLoading" class="kx-loading mail-driver-state" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Loading {{ active?.label }} settings…</p>
          <p v-else-if="driverError" class="kx-err inline mail-driver-state" role="alert">{{ driverError }}</p>
          <template v-else-if="active">
            <component :is="active.settings_view" v-if="active.settings_view && viewReady" :key="active.id + ':' + panelGeneration"
              class="mail-driver-view" :values.attr="panelValues" :secrets.attr="panelSecrets" :errors.attr="panelErrors" :draft.attr="panelDraft"
              :disabled.attr="String(busy === 'save')"
              @change="(event: Event) => fromPanel(event, 'change')" @validity="(event: Event) => fromPanel(event, 'validity')" />
            <DriverRows v-else :key="active.id + ':' + panelGeneration" :settings="driverSettings" :errors="fieldErrors" :draft="driverChanges"
              :disabled="busy === 'save'" @change="values => driverChanges = values" @validity="valid => driverValid = valid" />
          </template>
        </SettingsGroup>

        <SettingsGroup title="Sender">
          <SettingsItem title="From address" description="The address recipients see and reply to by default. The service must accept mail from it.">
            <template #actions>
              <span class="mail-setting-control">
                <InputText v-model.trim="draft.from_address" fluid placeholder="support@example.com" aria-label="From address" :invalid="!!identityErrors.from_address" />
                <small v-if="identityErrors.from_address" class="mail-field-error" role="alert">{{ identityErrors.from_address }}</small>
              </span>
            </template>
          </SettingsItem>
          <SettingsItem title="From name" description="Shown next to the address, for example your company’s name.">
            <template #actions><span class="mail-setting-control"><InputText v-model="draft.from_name" fluid aria-label="From name" /></span></template>
          </SettingsItem>
          <SettingsItem title="Reply-to" description="Where replies go when it is not the From address. Optional.">
            <template #actions>
              <span class="mail-setting-control">
                <InputText v-model.trim="draft.reply_to" fluid aria-label="Reply-to" :invalid="!!identityErrors.reply_to" />
                <small v-if="identityErrors.reply_to" class="mail-field-error" role="alert">{{ identityErrors.reply_to }}</small>
              </span>
            </template>
          </SettingsItem>
        </SettingsGroup>
      </fieldset>

      <SettingsGroup title="Test">
        <SettingsItem title="Send a test email" :description="testBlocked || 'Sends a short message to you with the saved settings.'">
          <template #actions>
            <Button label="Send test email" severity="secondary" outlined :loading="busy === 'test'" :disabled="!!testBlocked || !!busy" @click="runTest">
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
              <Button link size="small" class="mail-inline-link" label="Open it in Activity" @click="leave('/system/mail/activity/' + test.message_id)" />
            </div>
          </div>
        </div>
      </SettingsGroup>
    </template>
    <Dialog :visible="reviewing" modal :draggable="false" :closable="busy !== 'save'" class="mail-dialog" aria-label="Review changes"
      :pt="{ header: { class: 'mail-dialog-header' }, footer: { class: 'mail-dialog-footer' } }" @update:visible="value => { if (!value) reviewing = false }">
      <template #header>
        <span class="kx-modal-head-icon"><Icon icon="tabler:checklist" aria-hidden="true" /></span>
        <span class="kx-modal-head-text"><span class="kx-modal-head-title">Review changes</span><span class="kx-modal-head-sub">Mail delivery</span></span>
      </template>
      <ul class="mail-change-list"><li v-for="change in changes" :key="change">{{ change }}</li></ul>
      <p class="mail-muted mail-review-note">Email sent after you save uses these settings.</p>
      <div v-if="outcome" class="mail-outcome" role="status">
        <p v-if="outcome.saved.length" class="kx-notice info mail-block"><Icon icon="tabler:circle-check" aria-hidden="true" /><span>Saved: {{ outcome.saved.join(', ') }}.</span></p>
        <p v-if="outcome.refused" class="kx-notice error mail-block"><Icon icon="tabler:alert-triangle" aria-hidden="true" />
          <span>Not saved: {{ outcome.refused.label }}. {{ outcome.refused.reason }}</span></p>
        <p v-if="outcome.pending.length" class="kx-notice warn mail-block"><Icon icon="tabler:clock-pause" aria-hidden="true" />
          <span>Still in your draft: {{ outcome.pending.join(', ') }}.</span></p>
      </div>
      <p v-if="error" class="kx-err inline" role="alert">{{ error }}</p>
      <template #footer>
        <Button :label="outcome ? 'Back to the settings' : 'Keep editing'" severity="secondary" outlined :disabled="busy === 'save'" @click="reviewing = false" />
        <Button v-if="!outcome" label="Save" :loading="busy === 'save'" @click="save" />
      </template>
    </Dialog>
  </section>
</template>
