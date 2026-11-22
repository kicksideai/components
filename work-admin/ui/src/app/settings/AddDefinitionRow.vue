<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const props = defineProps<{
  action: string
  label: string
  maxlength?: number
  regular?: boolean
  openOnEntry?: boolean
  validate?: (value: string) => string | undefined
}>()
const emit = defineEmits<{ open: []; add: [value: string]; cancel: [] }>()
const row = ref<HTMLElement>()
const editing = ref(false)
const input = ref('')
const hintId = useId()
const value = computed(() => input.value.trim())
const issue = computed(() => value.value ? props.validate?.(value.value) : undefined)

async function open() {
  emit('open')
  editing.value = true
  await nextTick()
  row.value?.querySelector('input')?.focus()
}

async function close() {
  input.value = ''
  editing.value = false
  await nextTick()
  row.value?.querySelector('button')?.focus()
}

function add() {
  if (!value.value || issue.value) return
  emit('add', value.value)
  void close()
}

function cancel() {
  emit('cancel')
  void close()
}

watch(() => props.openOnEntry, (active, previous) => {
  if (active) void open()
  else if (previous && editing.value) void close()
}, { immediate: true })
</script>

<template>
  <div ref="row" class="work-add-definition">
    <Button v-if="!editing" type="button" :label="action" aria-expanded="false"
      severity="secondary" outlined :size="regular ? undefined : 'small'" @click="open">
      <template #icon><Icon icon="tabler:plus" aria-hidden="true" /></template>
    </Button>
    <div v-else class="work-add-editor" @keydown.esc.stop.prevent="cancel">
      <label class="work-stack work-tight">{{ label }}
        <InputText v-model="input" :aria-label="label" :maxlength="maxlength"
          :invalid="!!issue" :aria-describedby="issue ? hintId : undefined" @keydown.enter.stop.prevent="add" />
      </label>
      <slot />
      <div class="work-row work-wrap">
        <Button type="button" :label="action" :size="regular ? undefined : 'small'" :disabled="!value || !!issue" @click="add" />
        <Button type="button" label="Cancel" text severity="secondary" :size="regular ? undefined : 'small'" @click="cancel" />
      </div>
      <p v-if="issue" :id="hintId" class="work-error work-small" role="status">{{ issue }}</p>
    </div>
  </div>
</template>
