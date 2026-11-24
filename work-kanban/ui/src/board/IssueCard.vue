<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed } from 'vue'
import ExtensionElement from '../extensions/ExtensionElement.vue'
import { badgeSlots, badgeSummary } from '../extensions/placements'
import { principalRef, type PresentationContext } from '../presentation/context'
import { Glyph } from '../presentation/glyphs'
import IssueAssignee from '../presentation/IssueAssignee.vue'
import IssuePriority from '../presentation/IssuePriority.vue'
import IssueType from '../presentation/IssueType.vue'
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
  parent?: ItemSummary
  moveHelp?: string
}>()
const emit = defineEmits<{
  open: [], menu: [event: MouseEvent], focus: [], prefetch: [], cancelPrefetch: [],
  pointer: [event: PointerEvent], pickup: [event: KeyboardEvent],
}>()
const summary = computed(() => titleOf(props.item))
const badges = computed(() => badgeSlots(props.placements, props.item.type).visible)
const priority = computed(() => typeof props.item.values.priority === 'string' ? props.item.values.priority : undefined)
const assignee = computed(() => principalRef(props.item.values.assignee))
const labels = computed(() => {
  const values = props.item.values.labels
  return Array.isArray(values) ? values.filter(label => typeof label === 'string') : []
})
</script>

<template>
  <article class="kanban-card kx-card" :data-key="item.key" :data-card-id="item.id"
    :data-compact="compact || undefined" :aria-busy="pending || undefined"
    @pointerenter="emit('prefetch')" @pointerleave="emit('cancelPrefetch')">
    <button type="button" class="kanban-card-title kx-focus-outline" :tabindex="tabIndex" :aria-label="item.key + ' ' + summary"
      :title="summary" @focus="emit('focus'); emit('prefetch')" @blur="emit('cancelPrefetch')" @click="emit('open')">
      <span dir="auto">{{ summary }}</span>
    </button>
    <div class="kanban-card-meta">
      <IssueType :type="item.type" :label="context.typeLabels[item.type]" />
      <span class="kanban-card-key">{{ item.key }}</span>
      <IssuePriority v-if="priority" :priority="priority" :label="context.priorityLabels[priority]" />
      <div v-if="badges.length || labels.length || parent" class="kanban-card-badges">
        <span v-if="parent" class="kanban-card-chip kx-tag-sm kx-tone-violet" data-parent
          :title="'Parent: ' + parent.key + ' ' + titleOf(parent)">
          <span>{{ parent.key }}</span>
        </span>
        <span v-else-if="labels.length" class="kanban-card-chip kx-tag-sm kx-tone-neutral" :title="'Labels: ' + labels.join(', ')">
          <span>{{ labels[0] }}</span><b v-if="labels.length > 1">+{{ labels.length - 1 }}</b>
        </span>
        <ExtensionElement v-for="badge in badges" :key="badge.id" :placement="badge" :input="{ item: badgeSummary(item) }" />
      </div>
      <span v-if="typeof item.values.story_points === 'number'" class="kanban-points"
        :title="item.values.story_points + ' story points'" :aria-label="item.values.story_points + ' story points'">
        {{ item.values.story_points }}
      </span>
      <IssueAssignee v-if="assignee" :id="assignee.id" :name="person" />
    </div>
    <button v-if="writable" type="button" class="kx-iconbtn kx-focus-outline kanban-card-menu" :tabindex="tabIndex"
      :aria-label="'Move ' + item.key" :aria-describedby="moveHelp" aria-haspopup="menu" :disabled="pending"
      title="Drag to move, or click for move options"
      @pointerdown="emit('pointer', $event)" @keydown="emit('pickup', $event)" @click="emit('menu', $event)">
      <Glyph name="tabler:grip-vertical" />
    </button>
  </article>
</template>
