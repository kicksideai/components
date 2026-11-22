// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { SortableEvent } from 'sortablejs'

export function restoreDraggedElement(event: SortableEvent, selector: string) {
  const index = event.oldDraggableIndex ?? event.oldIndex
  // The reactive renderer reconciles from the original order after the drop.
  event.item.remove()
  const siblings = [...event.from.children].filter(child => child.matches(selector))
  event.from.insertBefore(event.item, siblings[index ?? siblings.length] ?? null)
}
