<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed } from 'vue'
import InputNumber from 'primevue/inputnumber'
import ToggleSwitch from 'primevue/toggleswitch'
import type { Declaration } from '../../types'
const props = defineProps<{ draft: Declaration; state: string; label: string; hard?: boolean }>()
const rule = computed(() => props.draft.policy?.wip?.[props.state])
function limit(value: number | null) {
  if (value === null) { if (props.draft.policy?.wip) delete props.draft.policy.wip[props.state]; return }
  const policy = props.draft.policy ??= {}, wip = policy.wip ??= {}
  wip[props.state] = { ...wip[props.state], limit: value }
}
function setHard(value: boolean) { if (rule.value) rule.value.hard = value }
</script>
<template>
  <ToggleSwitch v-if="hard" :aria-label="label" :disabled="!rule" :model-value="rule?.hard ?? false" @update:model-value="setHard" />
  <InputNumber v-else :aria-label="label" :min="0" :max-fraction-digits="0" :model-value="rule?.limit ?? null" placeholder="No limit" :use-grouping="false" @update:model-value="limit" />
</template>
