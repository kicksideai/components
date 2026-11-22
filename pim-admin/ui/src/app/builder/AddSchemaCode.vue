<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, nextTick, ref, useId } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { CODE, keyFromName } from '../../state'

const props = defineProps<{ label: string; action: string; existing?: string[]; fromName?: boolean; regular?: boolean }>()
const emit = defineEmits<{ add: [code: string] }>()

const input = ref('')
const editing = ref(false)
const row = ref<HTMLDivElement>()
const hintId = useId()
const code = computed(() => {
  const value = input.value.trim()
  if (!props.fromName) return value
  return keyFromName(value)
})
const issue = computed(() => {
  if (!input.value.trim()) return ''
  if (props.existing?.includes(code.value)) return props.fromName ? 'This name is already in use.' : 'This code is already in use.'
  if (props.fromName && !CODE.test(code.value)) return 'Use a name that starts with a letter from A to Z.'
  if (!CODE.test(code.value)) return 'Start with a lowercase letter and use only lowercase letters, numbers or underscores.'
  return ''
})
const canAdd = computed(() => !!code.value && !issue.value)

async function start() {
  editing.value = true
  await nextTick()
  row.value?.querySelector('input')?.focus()
}

async function close() {
  editing.value = false
  input.value = ''
  await nextTick()
  row.value?.querySelector('button')?.focus()
}

function add() {
  if (!canAdd.value) return
  emit('add', code.value)
  void close()
}
</script>

<template>
  <div ref="row" class="row pim-add-row">
    <Button v-if="!editing" type="button" aria-expanded="false" severity="secondary" outlined :size="regular ? undefined : 'small'" @click="start">
      <Icon icon="tabler:plus" aria-hidden="true" /> {{ action }}
    </Button>
    <div v-else class="row pim-add-editor" @keydown.esc.stop.prevent="close">
      <InputText v-model="input" type="text" :placeholder="label" :aria-label="label" :invalid="!!issue"
        :aria-describedby="issue ? hintId : undefined" :class="{ mono: !fromName }" @keydown.enter.prevent="add" />
      <div class="row pim-add-actions">
        <Button type="button" :disabled="!canAdd" @click="add">{{ action }}</Button>
        <Button type="button" label="Cancel" outlined severity="secondary" @click="close" />
      </div>
      <p v-if="issue" :id="hintId" role="status" class="pim-add-code-error small">{{ issue }}</p>
    </div>
    <slot />
  </div>
</template>
