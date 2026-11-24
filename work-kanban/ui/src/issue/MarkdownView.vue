<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { loadByTagName } from '@wippy-fe/proxy'
import Button from 'primevue/button'
import { computed, onScopeDispose, ref, shallowRef, watch } from 'vue'
import { issuePath, kanbanRoot } from '../route'
import { issueKeys, linkIssueKeys } from './markdown'
import { useMarkdown } from './markdownContext'

const props = defineProps<{ source: string; collapsible?: boolean }>()
const context = useMarkdown()
const ready = ref(false)
const content = ref<HTMLElement>()
const expanded = ref(false)
const overflowing = ref(false)
const resolved = shallowRef(new Map<string, string>())
const maxReferences = 20

let active = true
onScopeDispose(() => { active = false })
loadByTagName('wc-render-markdown', { timeoutMs: 8000 }).then(() => { if (active) ready.value = true }, () => {})

// Keys link to their issue once Work confirms them; the renderer opens links in a new tab.
watch([() => props.source, () => context.board.value, () => context.schema.value?.key_prefix], async ([source, board, prefix]) => {
  const keys = issueKeys(source, prefix).slice(0, maxReferences)
  if (!board || !keys.length) return
  const found = await Promise.all(keys.map(key => context.resolve(key).then(id => [key, id] as const, () => undefined)))
  if (!active || board !== context.board.value) return
  resolved.value = new Map(found.filter((row): row is readonly [string, string] => !!row))
}, { immediate: true })

const linked = computed(() => {
  const board = context.board.value
  const ids = resolved.value
  if (!board || !ids.size) return props.source
  return linkIssueKeys(props.source, context.schema.value?.key_prefix,
    key => ids.has(key) ? new URL(kanbanRoot + '/' + issuePath(board, ids.get(key)!), document.baseURI).href : undefined)
})

let observer: ResizeObserver | undefined
watch(content, element => {
  observer?.disconnect()
  if (!element || !props.collapsible) return
  observer = new ResizeObserver(() => { overflowing.value = element.scrollHeight > element.clientHeight + 1 })
  observer.observe(element)
  const body = element.firstElementChild
  if (body) observer.observe(body)
})
onScopeDispose(() => observer?.disconnect())
</script>

<template>
  <div class="kanban-markdown">
    <div ref="content" class="kanban-markdown-content" :data-collapsed="collapsible && !expanded || undefined"
      :data-overflowing="overflowing || undefined">
      <wc-render-markdown v-if="ready" class="kanban-markdown-body" :source="linked" />
      <div v-else class="kanban-markdown-body kanban-markdown-plain" dir="auto">{{ source }}</div>
    </div>
    <Button v-if="collapsible && (overflowing || expanded)" type="button" text size="small" class="kanban-markdown-more"
      :label="expanded ? 'Show less' : 'Show more'" :aria-expanded="expanded" @click.stop="expanded = !expanded" />
  </div>
</template>
