<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, nextTick, ref, useId } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const props = defineProps<{
  action: string
  label: string
  maxlength?: number
  validate?: (value: string) => string | undefined
}>()
const emit = defineEmits<{ open: []; add: [value: string] }>()
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
</script>

<template>
  <div ref="row" class="work-add-definition">
    <Button v-if="!editing" type="button" :label="action" aria-expanded="false"
      severity="secondary" outlined size="small" @click="open">
      <template #icon><Icon icon="tabler:plus" aria-hidden="true" /></template>
    </Button>
    <div v-else class="work-add-editor" @keydown.esc.stop.prevent="close">
      <label class="work-stack work-tight">{{ label }}
        <InputText v-model="input" :aria-label="label" :maxlength="maxlength"
          :invalid="!!issue" :aria-describedby="issue ? hintId : undefined" @keydown.enter.stop.prevent="add" />
      </label>
      <slot />
      <div class="work-row work-wrap">
        <Button type="button" :label="action" size="small" :disabled="!value || !!issue" @click="add" />
        <Button type="button" label="Cancel" text severity="secondary" size="small" @click="close" />
      </div>
      <p v-if="issue" :id="hintId" class="work-error work-small" role="status">{{ issue }}</p>
    </div>
  </div>
</template>
