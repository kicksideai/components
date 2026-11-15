<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
const props = withDefaults(defineProps<{ as?: 'button' | 'article'; disabled?: boolean; role?: 'button' | 'link' }>(), { as: 'button', role: 'button' })
const emit = defineEmits<{ activate: [event: MouseEvent | KeyboardEvent] }>()
function activate(event: MouseEvent) {
  if (props.disabled || event.defaultPrevented) return
  const target = event.target
  if (target instanceof Element && target !== event.currentTarget) {
    const action = target.closest('[data-work-action], button, a, input, textarea, [role="combobox"], [role="checkbox"], [role="switch"], details')
    if (action && action !== event.currentTarget) return
  }
  emit('activate', event)
}
function keyboard(event: KeyboardEvent) {
  if (event.target !== event.currentTarget || !['Enter', ' '].includes(event.key)) return
  event.preventDefault()
  if (!props.disabled) emit('activate', event)
}
</script>
<template>
  <component :is="as" data-work-action class="work-content-action" :type="as === 'button' ? 'button' : undefined" :role="role" :tabindex="disabled ? -1 : 0" :disabled="as === 'button' ? disabled : undefined" :aria-disabled="disabled || undefined" @click="activate" @keydown="keyboard"><slot /></component>
</template>
