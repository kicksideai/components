<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{ visible: boolean; label: string; busy?: boolean; returnFocus?: HTMLElement }>()
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
let opener: HTMLElement | null = null
async function sync() {
  await nextTick()
  const element = dialog.value
  if (!element) return
  if (props.visible && !element.open) {
    const root = element.getRootNode() as Document | ShadowRoot
    opener = props.returnFocus ?? root.activeElement as HTMLElement | null
    element.showModal()
  } else if (!props.visible && element.open) {
    element.close()
    opener?.focus()
  }
}
function cancel(event: Event) {
  event.preventDefault()
  if (!props.busy) emit('close')
}
watch(() => props.visible, sync)
onMounted(sync)
onBeforeUnmount(() => { if (dialog.value?.open) dialog.value.close(); opener?.focus() })
</script>

<template>
  <dialog ref="dialog" class="work-native-dialog" :aria-label="label" aria-modal="true" :aria-busy="busy || undefined" @cancel="cancel" @close="() => { if (visible && !busy) emit('close') }">
    <slot />
  </dialog>
</template>
