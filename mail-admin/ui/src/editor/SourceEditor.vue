<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, defineAsyncComponent, ref, useId } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import SelectButton from 'primevue/selectbutton'
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { useMail } from '../context'
import type { ResourceContent } from '../types'
import ResourcePicker from '../library/ResourcePicker.vue'
import InsertMenu from './InsertMenu.vue'
import ProblemNote from './ProblemNote.vue'
import type { Face, Problem } from './problems'

const CodeEditor = defineAsyncComponent(() => import('./CodeEditor.vue'))

// The source column of the editor. The draft object belongs to the resource page and is edited in place.
const props = defineProps<{ draft: ResourceContent; problem?: Problem; disabled?: boolean }>()
const { go } = useMail()
const ids = { base: useId(), title: useId(), description: useId(), face: useId() }

const face = ref<'html' | 'text'>('html')
const faces = [{ label: 'HTML', value: 'html' }, { label: 'Plain text', value: 'text' }]
const editor = ref<{ insert: (text: string) => void; focus: () => void }>()
const inserter = ref<{ toggle: (event: Event) => void }>()
function insert(text: string) {
  editor.value?.insert(text)
}

// A problem is shown once, under the face the server names, or under the open face when it names none.
const problemFace = computed<Face | undefined>(() => {
  const issue = props.problem
  if (!issue) return undefined
  if (issue.face === 'html' || issue.face === 'text' || issue.face === 'subject') return issue.face
  return face.value
})
const faceLabel = computed(() => (props.draft.kind === 'message' ? 'Body' : 'Source') + (face.value === 'html' ? ', HTML' : ', plain text'))
</script>

<template>
  <fieldset class="mail-source-column" :disabled="disabled" :inert="disabled || undefined">
    <Disclosure label="Name and description">
      <div class="mail-form">
        <div class="mail-field">
          <label class="mail-field-label" :for="ids.title">Name</label>
          <InputText :id="ids.title" v-model="draft.title" />
        </div>
        <div class="mail-field">
          <label class="mail-field-label" :for="ids.description">Description</label>
          <InputText :id="ids.description" v-model="draft.description" />
        </div>
        <p class="mail-field-hint">Reference <span class="mail-mono">{{ draft.name }}</span>, used to {{ draft.kind === 'message' ? 'send' : 'include' }} it. It cannot change.</p>
      </div>
    </Disclosure>

    <template v-if="draft.kind === 'message'">
      <div class="mail-field">
        <label class="mail-field-label" :for="ids.base">Base template</label>
        <div class="mail-base-row">
          <ResourcePicker v-model="draft.base" kind="base" label="Base template" :input-id="ids.base" class="mail-base-select" />
          <Button v-if="draft.base" text label="Open" severity="secondary" @click="go({ name: 'resource', kind: 'base', resource: draft.base, section: 'content' })" />
        </div>
      </div>
      <div class="mail-field" :class="{ 'mail-field-invalid': problemFace === 'subject' }">
        <span :id="ids.face + '-subject'" class="mail-field-label">Subject</span>
        <div class="mail-code-frame mail-code-subject">
          <CodeEditor v-model="draft.subject as string" label="Subject" />
        </div>
        <ProblemNote v-if="problem && problemFace === 'subject'" :problem="problem" :draft="draft" />
      </div>
    </template>

    <div class="mail-field" :class="{ 'mail-field-invalid': problem && problemFace !== 'subject' }">
      <div class="mail-face-bar">
        <SelectButton v-model="face" :options="faces" option-label="label" option-value="value" :allow-empty="false" :aria-label="(draft.kind === 'message' ? 'Body' : 'Source') + ' format'" />
        <Button label="Insert" severity="secondary" outlined size="small" aria-haspopup="true" @click="(event: Event) => inserter?.toggle(event)">
          <template #icon><Icon icon="tabler:plus" aria-hidden="true" /></template>
        </Button>
      </div>
      <div class="mail-code-frame mail-code-body">
        <CodeEditor v-if="face === 'html'" ref="editor" key="html" v-model="draft.html" :label="faceLabel" />
        <CodeEditor v-else ref="editor" key="text" v-model="draft.text" :label="faceLabel" />
      </div>
      <ProblemNote v-if="problem && problemFace !== 'subject'" :problem="problem" :draft="draft" />
    </div>
    <InsertMenu ref="inserter" :draft="draft" :face="face" @insert="insert" />
  </fieldset>
</template>
