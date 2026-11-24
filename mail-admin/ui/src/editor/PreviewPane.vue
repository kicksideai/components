<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef, useId, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import { isDraftWorkspaceBlocked, library as libraryApi } from '../api'
import { useMail } from '../context'
import { describe } from '../copy'
import type { DraftRender, ResourceContent } from '../types'
import ProblemNote from './ProblemNote.vue'
import { problemOf, type Problem } from './problems'
import { emailDocument } from './render'

// The message preview beside the editor: the unsaved draft rendered by the server with sample values.
const props = defineProps<{ draft: ResourceContent; messages?: string[] }>()
const emit = defineEmits<{ problem: [problem: Problem | undefined] }>()
const { library, delivery } = useMail()
const ids = { message: useId() }

const mode = ref<'email' | 'text'>('email')
const width = ref<'desktop' | 'phone'>('desktop')
const modes = [{ label: 'Email', value: 'email' }, { label: 'Plain text', value: 'text' }]
const widths = [{ label: 'Desktop', value: 'desktop', icon: 'tabler:device-desktop' }, { label: 'Phone', value: 'phone', icon: 'tabler:device-mobile' }]

const choices = computed(() => {
  const names = props.messages ?? library.ofKind('message').map(item => item.name)
  return names.map(name => ({ value: name, label: library.find('message', name)?.title ?? name }))
})
const chosen = ref('')
watch(choices, options => {
  if (props.draft.kind === 'message') return
  if (!options.some(option => option.value === chosen.value)) chosen.value = options[0]?.value ?? ''
}, { immediate: true })
const message = computed(() => props.draft.kind === 'message' ? props.draft.name : chosen.value)

const rendered = shallowRef<DraftRender>()
const loading = ref(false)
const problem = ref<Problem>()
const failure = ref('')
const begin = latestRequest()
let timer: ReturnType<typeof setTimeout> | undefined

// One preview request at a time: a change made while one renders is previewed when it returns.
let inFlight = false, again = false
// A request cut off by a page unload leaves Mail's draft workspace occupied, so no preview starts while the page
// is leaving. A preview already in flight is never cancelled: it finishes and a stale result is dropped.
let unloading = false
const leave = () => { unloading = true; clearTimeout(timer) }
window.addEventListener('pagehide', leave)
window.addEventListener('beforeunload', leave)
onBeforeUnmount(() => { window.removeEventListener('pagehide', leave); window.removeEventListener('beforeunload', leave) })
const blocked = ref(false)
async function render() {
  const name = message.value
  if (!name || unloading) return
  if (inFlight) { again = true; return }
  inFlight = true
  const current = begin()
  loading.value = true
  try {
    const result = await libraryApi.preview(name, [props.draft])
    if (!current()) return
    rendered.value = result
    blocked.value = false
    problem.value = undefined
    failure.value = ''
  } catch (error) {
    if (!current()) return
    blocked.value = isDraftWorkspaceBlocked(error)
    const found = blocked.value ? undefined : problemOf(error)
    problem.value = found ? { ...found, previewOf: name } : undefined
    failure.value = problem.value ? '' : describe(error, 'The preview could not be rendered.')
  } finally {
    inFlight = false
    if (current()) loading.value = false
    if (again) { again = false; void render() }
  }
}
function schedule() {
  clearTimeout(timer)
  timer = setTimeout(() => { void render() }, 450)
}
watch(() => JSON.stringify(props.draft), schedule)
watch(message, () => { rendered.value = undefined; void render() }, { immediate: true })
watch(problem, value => emit('problem', value))
onBeforeUnmount(() => clearTimeout(timer))

const document = computed(() => rendered.value?.html ? emailDocument(rendered.value.html, rendered.value.inline_assets) : '')
const from = computed(() => {
  const sender = delivery.value?.from
  if (!sender) return ''
  return sender.name ? `${sender.name} <${sender.address}>` : sender.address
})
</script>

<template>
  <section class="mail-preview" aria-label="Preview">
    <div class="mail-preview-bar">
      <SelectButton v-model="mode" :options="modes" option-label="label" option-value="value" :allow-empty="false" aria-label="Preview format" />
      <SelectButton v-if="mode === 'email'" v-model="width" :options="widths" option-label="label" option-value="value" :allow-empty="false" aria-label="Preview width">
        <template #option="{ option }"><Icon :icon="option.icon" aria-hidden="true" />{{ option.label }}</template>
      </SelectButton>
    </div>
    <div v-if="draft.kind !== 'message'" class="mail-preview-with">
      <label :for="ids.message">Preview with</label>
      <Select v-model="chosen" :input-id="ids.message" :options="choices" option-label="label" option-value="value" append-to="self"
        placeholder="Choose a message…" :empty-message="'No messages yet'" />
    </div>
    <dl v-if="rendered" class="mail-preview-envelope">
      <template v-if="from"><dt>From</dt><dd>{{ from }}</dd></template>
      <dt>Subject</dt><dd>{{ rendered.subject }}</dd>
    </dl>
    <div class="mail-preview-body" :class="['mail-preview-' + width, { 'mail-preview-stale': problem || failure }]" :aria-busy="loading">
      <p v-if="!rendered && loading" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Rendering preview…</p>
      <p v-else-if="!message" class="mail-muted mail-preview-empty">Choose a message to see this {{ draft.kind === 'base' ? 'base template' : 'part' }} around real content.</p>
      <template v-else-if="rendered">
        <iframe v-if="mode === 'email'" class="mail-preview-frame" sandbox="" :srcdoc="document" :title="'Email preview: ' + (rendered.subject ?? '')" />
        <pre v-else class="mail-preview-text">{{ rendered.text }}</pre>
      </template>
    </div>
    <div v-if="problem" class="mail-preview-foot mail-preview-problem">
      <ProblemNote :problem="problem" :draft="draft" :last-good="!!rendered" />
    </div>
    <p v-else-if="blocked" class="mail-preview-foot mail-preview-problem" role="alert"><Icon icon="tabler:plug-connected-x" aria-hidden="true" /><span>{{ failure }}</span></p>
    <p v-else-if="failure" class="mail-preview-foot mail-preview-problem" role="alert"><Icon icon="tabler:alert-triangle" aria-hidden="true" /><span>{{ failure }}</span></p>
    <p v-else class="mail-preview-foot"><Icon icon="tabler:info-circle" aria-hidden="true" />
      {{ draft.kind === 'message' ? 'Filled with the sample values from Variables.' : 'Your unsaved version around a real message, filled with its sample values.' }}</p>
  </section>
</template>
