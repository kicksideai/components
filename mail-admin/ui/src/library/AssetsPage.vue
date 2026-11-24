<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import EmptyState from '@kickside/ui-kit/EmptyState.vue'
import SettingsSectionHead from '@kickside/ui-kit/SettingsSectionHead.vue'
</script>

<template>
  <SettingsSectionHead title="Assets" description="Images that templates show inline. Replace one and every template that uses it changes." />
  <EmptyState icon="tabler:photo" title="Assets are not available yet"
    hint="This workspace cannot keep email images yet. Templates can show images hosted at a web address in the meantime." />
</template>
