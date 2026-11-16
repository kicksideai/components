// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { onBeforeUnmount, type Directive } from 'vue'
import Sortable from 'sortablejs'
import { restoreDraggedElement } from '../sortable'
export function useReorder(reorder: (from: number, to: number) => void): Directive<HTMLElement> {
  const instances = new Map<HTMLElement, Sortable>()
  function dispose(element: HTMLElement) { instances.get(element)?.destroy(); instances.delete(element) }
  onBeforeUnmount(() => { for (const element of instances.keys()) dispose(element) })
  return {
    mounted(element) {
      const list = element.querySelector<HTMLElement>('.work-field-builder') ?? element
      instances.set(element, new Sortable(list, {
        draggable: '.work-reorder-entry', handle: '.work-reorder-handle', forceFallback: true, fallbackOnBody: false, ghostClass: 'work-drag-ghost',
        onEnd(event) {
          const from = event.oldDraggableIndex, to = event.newDraggableIndex
          restoreDraggedElement(event, '.work-reorder-entry')
          if (from !== undefined && to !== undefined && from !== to) reorder(from, to)
        },
      }))
    }, unmounted: dispose,
  }
}
