<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { computed } from 'vue'
import ExtensionElement from '../extensions/ExtensionElement.vue'
import { badgeSlots, badgeSummary } from '../extensions/placements'
import { principalRef, type PresentationContext } from '../presentation/context'
import { titleOf, type ItemSummary } from '../presentation/query'
import type { WorkExtension } from '../work/types'

const props = defineProps<{
  item: ItemSummary
  context: PresentationContext
  placements: readonly WorkExtension[]
  tabIndex: number
  writable: boolean
  pending: boolean
  person?: string
}>()
const emit = defineEmits<{ open: [], menu: [event: MouseEvent], focus: [] }>()
const badges = computed(() => badgeSlots(props.placements, props.item.type).visible)
const priority = computed(() => typeof props.item.values.priority === 'string' ? props.item.values.priority : undefined)
const assignee = computed(() => principalRef(props.item.values.assignee))
const initials = computed(() => props.person?.split(/\s+/).slice(0, 2).map(word => word[0]).join(''))
const icons: Record<string, string> = {
  epic: 'tabler:bolt', story: 'tabler:bookmark', task: 'tabler:square-check', bug: 'tabler:bug', sub_task: 'tabler:subtask',
}
</script>

<template>
  <article class="kanban-card kx-card" :data-key="item.key" :data-card-id="item.id" :aria-busy="pending || undefined">
    <div class="kanban-card-key">
      <Icon :icon="icons[item.type] ?? 'tabler:point'" :aria-label="context.typeLabels[item.type] ?? item.type" />
      <span>{{ item.key }}</span>
      <Button v-if="writable" class="kanban-card-menu" text size="small" severity="secondary"
        :aria-label="'Move ' + item.key" aria-haspopup="menu" :disabled="pending" @click="emit('menu', $event)">
        <template #icon><Icon icon="tabler:grip-vertical" /></template>
      </Button>
    </div>
    <Button class="kanban-card-title kx-focus-outline" unstyled :tabindex="tabIndex" :aria-label="item.key + ' ' + titleOf(item)"
      @focus="emit('focus')" @click="emit('open')">
      <span dir="auto">{{ titleOf(item) }}</span>
    </Button>
    <div class="kanban-card-meta">
      <Tag v-if="priority" class="kx-tag-sm" :value="context.priorityLabels[priority] ?? priority"
        :severity="priority === 'highest' ? 'danger' : priority === 'high' ? 'warn' : 'secondary'" />
      <ExtensionElement v-for="badge in badges" :key="badge.id" :placement="badge" :input="{ item: badgeSummary(item) }" />
      <span v-if="typeof item.values.story_points === 'number'" class="kanban-points" :aria-label="item.values.story_points + ' points'">
        {{ item.values.story_points }}
      </span>
      <span v-if="assignee" class="kanban-assignee" :title="person ?? 'Assigned'" :aria-label="person ?? 'Assigned'">
        <span v-if="initials">{{ initials }}</span><Icon v-else icon="tabler:user" aria-hidden="true" />
      </span>
    </div>
  </article>
</template>
