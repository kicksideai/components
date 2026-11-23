// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
export const maxMountedColumns = 8
export const maxMountedRows = 18

function visibleWindow(offset: number, size: number, stride: number, count: number, maximum: number, pinned?: number) {
  const start = Math.max(0, Math.floor(offset / stride) - 1)
  const end = Math.min(count, start + maximum, Math.ceil((offset + size) / stride) + 1)
  const indices = Array.from({ length: Math.max(0, end - start) }, (_, index) => index + start)
  if (pinned !== undefined && pinned >= 0 && pinned < count && !indices.includes(pinned)) {
    if (indices.length === maximum) indices.pop()
    indices.push(pinned)
    indices.sort((a, b) => a - b)
  }
  return indices
}

export function boardWindow(offset: number, width: number, stride: number, count: number, pinned?: number) {
  return visibleWindow(offset, width, stride, count, maxMountedColumns, pinned)
}

export function rowWindow(offset: number, height: number, stride: number, count: number, pinned?: number) {
  return visibleWindow(offset, height, stride, count, maxMountedRows, pinned)
}

export interface MoveIntent {
  item: string
  source: string
  target: string
  after?: string
  before?: string
}

export function moveIntent(
  item: string, source: string, target: string, ids: readonly string[], anchor?: string, side: 'before' | 'after' = 'after',
): MoveIntent | undefined {
  if (item === anchor) return
  const neighbors = ids.filter(id => id !== item)
  const anchorIndex = anchor === undefined ? -1 : neighbors.indexOf(anchor)
  if (anchor !== undefined && anchorIndex < 0) return
  const index = anchorIndex < 0 ? neighbors.length : anchorIndex + (side === 'after' ? 1 : 0)
  const before = neighbors[index]
  const after = neighbors[index - 1]
  if (source === target && (ids.indexOf(item) === index || (!before && !after))) return
  return { item, source, target, ...(after ? { after } : {}), ...(before ? { before } : {}) }
}
