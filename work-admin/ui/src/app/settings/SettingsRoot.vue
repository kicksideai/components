<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { provide } from 'vue'
import { useEvents, useProps } from '@wippy-fe/webcomponent-vue'
import BoardSettings from './BoardSettings.vue'
import { navigatorKey, pathOf } from '../route'
const props = useProps<{ boardId?: string; embedded?: boolean; focusBack?: boolean; directoryCount?: number }>()
const emit = useEvents<{ navigate: { route: string }; 'back-to-boards': Record<string, never>; 'dirty-change': { dirty: boolean }; 'directory-action': { name: 'create' | 'defaults' } }>()
provide(navigatorKey, next => {
  if (props.value.embedded && next.name === 'boards') emit('back-to-boards', {})
  else emit('navigate', { route: pathOf(next) })
})
</script>
<template><BoardSettings :board-id="props.boardId ?? ''" :embedded="props.embedded" :focus-back="props.focusBack" :directory-count="props.directoryCount" @directory-action="emit('directory-action', { name: $event })" @dirty-change="emit('dirty-change', { dirty: $event })" /></template>
