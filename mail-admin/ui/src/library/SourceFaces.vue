<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import SelectButton from 'primevue/selectbutton'

const props = defineProps<{ html: string; text: string; label: string }>()
const face = ref<'html' | 'text'>('html')
const faces = [{ label: 'HTML', value: 'html' }, { label: 'Plain text', value: 'text' }]
const source = computed(() => face.value === 'html' ? props.html : props.text)
const lines = computed(() => source.value.split('\n'))
const id = useId()
</script>

<template>
  <section class="mail-source-faces" :aria-labelledby="id">
    <div class="mail-face-bar">
      <h2 :id="id" class="mail-label">{{ label }}</h2>
      <SelectButton v-model="face" :options="faces" option-label="label" option-value="value" :allow-empty="false" :aria-label="label + ' version'" />
    </div>
    <pre class="mail-code" tabindex="0" :aria-label="label + (face === 'html' ? ', HTML' : ', plain text')"><code><span v-for="(line, index) in lines" :key="index" class="mail-code-line"><span class="mail-code-number" aria-hidden="true">{{ index + 1 }}</span><span class="mail-code-text">{{ line }}</span>
</span></code></pre>
  </section>
</template>
