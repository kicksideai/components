<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Avatar from 'primevue/avatar'
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
  compact?: boolean
  person?: string
  moveHelp?: string
}>()
const emit = defineEmits<{
  open: [], menu: [event: MouseEvent], focus: [],
  pointer: [event: PointerEvent], pickup: [event: KeyboardEvent],
}>()
const summary = computed(() => titleOf(props.item))
const badges = computed(() => badgeSlots(props.placements, props.item.type).visible)
const priority = computed(() => typeof props.item.values.priority === 'string' ? props.item.values.priority : undefined)
const assignee = computed(() => principalRef(props.item.values.assignee))
const assigneeLabel = computed(() => props.person || 'Assigned')
const initials = computed(() => props.person?.trim().split(/\s+/).slice(0, 2).map(word => Array.from(word)[0]).join(''))
const icons: Record<string, string> = {
  epic: 'tabler:bolt', story: 'tabler:bookmark', task: 'tabler:square-check', bug: 'tabler:bug', sub_task: 'tabler:subtask',
}
const priorities: Record<string, string> = {
  highest: 'tabler:chevrons-up', high: 'tabler:chevron-up', medium: 'tabler:minus',
  low: 'tabler:chevron-down', lowest: 'tabler:chevrons-down',
}
</script>

<template>
  <article class="kanban-card kx-card" :data-key="item.key" :data-card-id="item.id"
    :data-compact="compact || undefined" :aria-busy="pending || undefined">
    <button type="button" class="kanban-card-title kx-focus-outline" :tabindex="tabIndex" :aria-label="item.key + ' ' + summary"
      :title="summary" @focus="emit('focus')" @click="emit('open')">
      <span class="kx-card-name" dir="auto">{{ summary }}</span>
    </button>
    <div class="kanban-card-meta">
      <div class="kanban-card-identity">
        <Icon :icon="icons[item.type] ?? 'tabler:point'" role="img" :aria-label="context.typeLabels[item.type] ?? item.type" />
        <span class="kanban-card-key">{{ item.key }}</span>
        <Tag v-if="priority" class="kx-tag-sm kanban-card-priority" role="img"
          :aria-label="'Priority: ' + (context.priorityLabels[priority] ?? priority)"
          :title="'Priority: ' + (context.priorityLabels[priority] ?? priority)"
          :severity="priority === 'highest' ? 'danger' : priority === 'high' ? 'warn' : 'secondary'">
          <Icon :icon="priorities[priority] ?? 'tabler:flag'" aria-hidden="true" />
        </Tag>
      </div>
      <div v-if="badges.length" class="kanban-card-badges">
        <ExtensionElement v-for="badge in badges" :key="badge.id" :placement="badge" :input="{ item: badgeSummary(item) }" />
      </div>
      <div class="kanban-card-assignment">
        <span v-if="typeof item.values.story_points === 'number'" class="kanban-points" :aria-label="item.values.story_points + ' points'">
          {{ item.values.story_points }}
        </span>
        <Avatar v-if="assignee" class="kanban-assignee" shape="circle" :label="initials" :title="assigneeLabel" role="img" :aria-label="assigneeLabel">
          <template v-if="!initials" #icon><Icon icon="tabler:user" aria-hidden="true" /></template>
        </Avatar>
        <Button v-if="writable" class="kanban-card-menu" text rounded size="small" severity="secondary"
          style="box-sizing: border-box; width: 24px; height: 24px; min-height: 0; padding: 0"
          :aria-label="'Move ' + item.key" :aria-describedby="moveHelp" aria-haspopup="menu" :disabled="pending"
          @pointerdown="emit('pointer', $event)" @keydown="emit('pickup', $event)" @click="emit('menu', $event)">
          <template #icon><Icon icon="tabler:grip-vertical" aria-hidden="true" /></template>
        </Button>
      </div>
    </div>
  </article>
</template>
