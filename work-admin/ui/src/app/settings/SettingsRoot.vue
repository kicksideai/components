<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { provide } from 'vue'
import { useEvents, useProps } from '@wippy-fe/webcomponent-vue'
import BoardSettings from './BoardSettings.vue'
import { navigatorKey, pathOf } from '../route'
const props = useProps<{ boardId?: string; embedded?: boolean }>()
const emit = useEvents<{ navigate: { route: string } }>()
provide(navigatorKey, next => emit('navigate', { route: pathOf(next) }))
</script>
<template><BoardSettings :board-id="props.boardId ?? ''" :embedded="props.embedded" /></template>
