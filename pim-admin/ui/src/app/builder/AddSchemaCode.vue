<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { CODE, keyFromName } from '../../state'

const props = defineProps<{ label: string; action: string; existing?: string[]; fromName?: boolean }>()
const emit = defineEmits<{ add: [code: string] }>()

const input = ref('')
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

function add() {
  if (!canAdd.value) return
  emit('add', code.value)
  input.value = ''
}
</script>

<template>
  <div class="row pim-add-row">
    <InputText v-model="input" type="text" :placeholder="label" :aria-label="label" :invalid="!!issue"
      :aria-describedby="issue ? hintId : undefined" :class="{ mono: !fromName }" @keydown.enter.prevent="add" />
    <Button type="button" :disabled="!canAdd" severity="secondary" outlined size="small" @click="add">
      <Icon icon="tabler:plus" aria-hidden="true" /> {{ action }}
    </Button>
    <slot />
    <p v-if="issue" :id="hintId" role="status" class="pim-add-code-error small">{{ issue }}</p>
  </div>
</template>
