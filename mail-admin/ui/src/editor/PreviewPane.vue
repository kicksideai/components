<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef, useId, watch } from 'vue'
import { Icon } from '@iconify/vue'
import SelectButton from 'primevue/selectbutton'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import { library as libraryApi } from '../api'
import { useMail } from '../context'
import { describe, warningText } from '../copy'
import type { DraftRender, ResourceContent } from '../types'
import ResourcePicker from '../library/ResourcePicker.vue'
import { LOOKUP_LIMIT } from '../library/useLibrary'
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

// Mail does not report which message was sent last, so the preview starts with the first message it lists.
const chosen = ref('')
const first = ref('')
const choicesError = ref('')
async function chooseFirst() {
  if (props.draft.kind === 'message') return
  const names = props.messages?.slice(0, LOOKUP_LIMIT)
  try {
    const page = names && !names.length ? undefined : await library.search('message', undefined, names)
    first.value = page?.items[0]?.name ?? ''
    if (!chosen.value || (props.messages && !props.messages.includes(chosen.value))) chosen.value = first.value
    choicesError.value = ''
  } catch (failure) {
    choicesError.value = describe(failure, 'The messages could not be loaded.')
  }
}
watch(() => props.messages?.join(','), () => { void chooseFirst() }, { immediate: true })
const chosenNote = computed(() => props.draft.kind !== 'message' && chosen.value && chosen.value === first.value
  ? 'The first message in the library. Choose another to see it around different content.' : '')
const message = computed(() => props.draft.kind === 'message' ? props.draft.name : chosen.value)

const rendered = shallowRef<DraftRender>()
const loading = ref(false)
const problem = ref<Problem>()
const failure = ref('')
const begin = latestRequest()
let timer: ReturnType<typeof setTimeout> | undefined

// One preview request at a time: a change made while one renders is previewed when it returns, and a result for an
// older draft is dropped.
let inFlight = false, again = false
async function render() {
  const name = message.value
  if (!name) return
  if (inFlight) { again = true; return }
  inFlight = true
  const current = begin()
  loading.value = true
  try {
    const result = await libraryApi.preview(name, [props.draft])
    if (!current()) return
    rendered.value = result
    problem.value = undefined
    failure.value = ''
  } catch (error) {
    if (!current()) return
    const found = problemOf(error)
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
        <template #option="{ option }"><Icon class="mail-preview-format-icon" :icon="option.icon" aria-hidden="true" />{{ option.label }}</template>
      </SelectButton>
    </div>
    <div v-if="draft.kind !== 'message'" class="mail-preview-with">
      <label :for="ids.message">Preview with</label>
      <ResourcePicker class="mail-preview-picker" v-model="chosen" kind="message" label="Preview with" :input-id="ids.message" :names="messages" placeholder="Choose a message…" />
      <small v-if="choicesError" class="kx-err inline" role="alert">{{ choicesError }}</small>
      <small v-else-if="chosenNote" class="mail-field-hint">{{ chosenNote }}</small>
    </div>
    <p v-if="loading && rendered" class="mail-preview-busy" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Updating the preview…</p>
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
    <p v-for="warning in rendered?.warnings ?? []" :key="warning.code" class="mail-preview-foot mail-preview-warning" role="status">
      <Icon icon="tabler:scissors" aria-hidden="true" /><span>{{ warningText(warning) }}</span></p>
    <p v-if="problem" class="mail-preview-foot mail-preview-problem" role="status"><Icon icon="tabler:alert-triangle" aria-hidden="true" />
      <span>{{ rendered ? 'The preview shows the last version that rendered.' : 'Nothing to show until it renders.' }} The problem is shown beside the source.</span></p>
    <p v-else-if="failure" class="mail-preview-foot mail-preview-problem" role="alert"><Icon icon="tabler:alert-triangle" aria-hidden="true" /><span>{{ failure }}</span></p>
    <p v-else class="mail-preview-foot"><Icon icon="tabler:info-circle" aria-hidden="true" />
      {{ draft.kind === 'message' ? 'Filled with the sample values from Variables.' : 'Your unsaved version around a real message, filled with its sample values.' }}</p>
  </section>
</template>
