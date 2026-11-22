<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed } from 'vue'
import type { Declaration, InstalledRule, Process, Transition } from '../../types'
import { transitionRules } from './transitionRules'

const props = defineProps<{ transition: Transition; process: Process; draft: Declaration; guards?: InstalledRule[] }>()
const rules = computed(() => transitionRules(props.transition, props.process, props.draft, props.guards))
</script>

<template>
  <div v-if="rules.length" class="work-stack work-tight work-muted work-small">
    <p v-for="(rule, index) in rules" :key="index">{{ rule }}</p>
  </div>
</template>
