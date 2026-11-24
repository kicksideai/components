<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useMail } from '../context'
import { kindLabels } from '../copy'
import type { ResourceContent, ResourceKey, TemplateKind } from '../types'
import { faceLabels, type Problem } from './problems'

// One plain sentence about what does not render, then the engine's own message, then the resources involved.
const props = defineProps<{ problem: Problem; draft?: Pick<ResourceContent, 'kind' | 'name'>; lastGood?: boolean }>()
const { library, go } = useMail()

const inSentence: Record<keyof typeof faceLabels, string> = { html: 'HTML', text: 'plain text', subject: 'subject', variables: 'variables', samples: 'sample values' }
const title = (key: ResourceKey) => library.find(key.kind, key.name)?.title ?? key.name
const isDraft = (key: ResourceKey | undefined) => !!key && !!props.draft && key.kind === props.draft.kind && key.name === props.draft.name
const sentence = computed(() => {
  const { resource, face, previewOf } = props.problem
  const part = face ? inSentence[face] : ''
  if (resource && props.draft && props.draft.kind !== 'message' && resource.kind === 'message' && resource.name === previewOf) {
    return `${title(resource)} does not render with your changes.`
  }
  if (!resource || isDraft(resource)) {
    const what = props.draft ? `this ${kindLabels[props.draft.kind].toLowerCase()}` : 'it'
    return part ? `The ${part} of ${what} does not render.` : `${what[0].toUpperCase()}${what.slice(1)} does not render.`
  }
  return `${title(resource)} does not render${part ? ` (${part})` : ''}.`
})
const involved = computed(() => (props.problem.candidates ?? []).filter(key => !isDraft(key)))
function open(key: ResourceKey) {
  if (key.kind === 'asset') go({ name: 'library', section: 'assets', asset: key.name })
  else go({ name: 'resource', kind: key.kind as TemplateKind, resource: key.name, section: 'content' })
}
</script>

<template>
  <div class="mail-problem" role="alert">
    <p class="mail-problem-lead"><Icon icon="tabler:alert-triangle" aria-hidden="true" />
      <span>{{ sentence }}<template v-if="lastGood"> The preview shows the last version that rendered.</template></span></p>
    <code class="mail-problem-detail">{{ problem.message }}</code>
    <p v-if="involved.length" class="mail-problem-involved">
      <span class="mail-muted">Involved:</span>
      <button v-for="key in involved" :key="key.kind + key.name" type="button" class="mail-text-link" @click="open(key)">{{ title(key) }}</button>
    </p>
  </div>
</template>
