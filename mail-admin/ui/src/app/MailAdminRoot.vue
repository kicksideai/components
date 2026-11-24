<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { useEvents, useProps } from '@wippy-fe/webcomponent-vue'
import MailAdmin from './MailAdmin.vue'

const props = useProps<{ route?: string }>()
const emit = useEvents<{ navigate: { route: string } }>()
</script>

<template>
  <MailAdmin :route="props.route" @navigate="route => emit('navigate', { route })" />
</template>
