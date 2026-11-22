<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { useEvents, useProps } from '@wippy-fe/webcomponent-vue'
import AdminApp from './AdminApp.vue'

const props = useProps<{ route?: string }>()
const emit = useEvents<{ navigate: { route: string }; 'dirty-change': { dirty: boolean } }>()
</script>

<template>
  <AdminApp :route="props.route" @navigate="route => emit('navigate', { route })"
    @dirty-change="dirty => emit('dirty-change', { dirty })" />
</template>
