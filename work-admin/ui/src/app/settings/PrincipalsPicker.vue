<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { useDisplay } from '../../forms'
import { computed, onMounted, ref } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { Icon } from '@iconify/vue'
import { ensureTag } from '../mount'
import { type Principal } from '../../principals'
const props = defineProps<{ modelValue?: Principal[]; label: string; kinds?: string; boardId?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: Principal[]] }>()
const ready = ref(false), version = ref(0)
const values = computed(() => props.modelValue ?? [])
const { principalLabel, rememberPrincipal, nameError } = useDisplay(() => props.boardId ?? '', () => values.value)
onMounted(async () => { ready.value = await ensureTag('wc-principal-picker') })
function pick(event: Event) {
  const value = (event as CustomEvent<{ principal_id?: string; id?: string; type?: string; label?: string }>).detail
  const id = value?.principal_id ?? value?.id
  if (!id) return
  const principal = { kind: value.type ?? 'user', id }
  if (value.label) rememberPrincipal(principal, value.label)
  if (!values.value.some(p => p.id === id && p.kind === principal.kind)) emit('update:modelValue', [...values.value, principal])
  version.value++
}
</script>
<template>
  <p v-if="nameError" class="kx-err" role="alert">{{ nameError }}</p>
  <section class="work-stack work-tight work-principals-picker" :aria-label="label"><h4 class="work-field-label">{{ label }}</h4><div v-if="values.length" class="work-chips"><Tag v-for="(principal, index) in values" :key="principal.kind + principal.id" severity="secondary" class="kx-tag-sm">{{ principalLabel(principal) }}<Button text severity="secondary" size="small" :aria-label="'Remove ' + principalLabel(principal)" @click="emit('update:modelValue', values.filter((_, i) => i !== index))"><Icon icon="tabler:x" /></Button></Tag></div><wc-principal-picker v-if="ready" :key="version" :kinds="kinds ?? 'user,group'" @config-changed="pick" /><p v-else class="work-muted work-small">People and group picker is unavailable.</p></section>
</template>
