// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { onBeforeUnmount, watchEffect, type Directive } from 'vue'
import Sortable, { type SortableEvent } from 'sortablejs'

interface SortableHooks {
  group: () => string
  disabled: () => boolean
  start: () => void
  end: (event: SortableEvent) => void
  reorder: (column: string, uid: string, direction: -1 | 1) => void
}

export function restoreDraggedElement(event: SortableEvent, selector: string) {
  const index = event.oldDraggableIndex ?? event.oldIndex
  // The reactive renderer reconciles from the original order after the drop.
  event.item.remove()
  const siblings = [...event.from.children].filter(child => child.matches(selector))
  event.from.insertBefore(event.item, siblings[index ?? siblings.length] ?? null)
}

export function useSortable(hooks: SortableHooks): Directive<HTMLElement> {
  const mounted = new Map<HTMLElement, { sortable: Sortable; keydown: (event: KeyboardEvent) => void }>()
  function dispose(element: HTMLElement) {
    const entry = mounted.get(element)
    if (!entry) return
    element.removeEventListener('keydown', entry.keydown)
    entry.sortable.destroy()
    mounted.delete(element)
  }
  watchEffect(() => {
    const group = hooks.group(), disabled = hooks.disabled()
    for (const { sortable } of mounted.values()) {
      sortable.option('group', group)
      sortable.option('disabled', disabled)
    }
  })
  onBeforeUnmount(() => { for (const element of mounted.keys()) dispose(element) })
  return {
    mounted(element) {
      const sortable = new Sortable(element, {
        group: hooks.group(), disabled: hooks.disabled(),
        draggable: '.work-card', fallbackTolerance: 5,
        filter: 'button:not(.work-card-title):not(.work-drag-handle), input, select, textarea, a', preventOnFilter: false,
        forceFallback: true, fallbackOnBody: false,
        animation: 0, ghostClass: 'work-drag-ghost',
        onStart: hooks.start,
        onEnd(event) {
          const oldIndex = event.oldDraggableIndex ?? event.oldIndex
          const newIndex = event.newDraggableIndex ?? event.newIndex
          restoreDraggedElement(event, '.work-card')
          if (oldIndex != null && newIndex != null && (event.from !== event.to || oldIndex !== newIndex)) hooks.end(event)
        },
      })
      const keydown = (event: KeyboardEvent) => {
        if (hooks.disabled() || event.ctrlKey || event.metaKey || !['ArrowUp', 'ArrowDown'].includes(event.key)) return
        const handle = event.target instanceof Element ? event.target.closest('.work-drag-handle') : null
        const card = handle?.closest<HTMLElement>('.work-card')
        if (!card?.dataset.card || !element.dataset.column) return
        event.preventDefault()
        hooks.reorder(element.dataset.column, card.dataset.card, event.key === 'ArrowUp' ? -1 : 1)
      }
      element.addEventListener('keydown', keydown)
      mounted.set(element, { sortable, keydown })
    },
    unmounted: dispose,
  }
}
