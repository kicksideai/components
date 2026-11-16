// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { processLayout } from './processLayout'
type Layout = ReturnType<typeof processLayout>
export const readableScale = .8
export function initialGraphView(layout: Layout, viewport: { width: number; height: number }, initial: string) {
  const scale = Math.min(1, viewport.width / layout.width, viewport.height / layout.height)
  if (scale >= readableScale) return { zoom: scale, pan: { x: (layout.width - viewport.width / scale) / 2, y: (layout.height - viewport.height / scale) / 2 } }
  const start = layout.nodes.find(node => node.state.id === initial) ?? layout.nodes[0]
  const zoom = Math.min(1, viewport.width / ((start?.width ?? 190) + 64))
  return { zoom, pan: start ? { x: layout.direction === 'TB' ? start.x - viewport.width / zoom / 2 : start.x - start.width / 2 - 32, y: layout.direction === 'TB' ? start.y - start.height / 2 - 32 : start.y - viewport.height / zoom / 2 } : { x: 0, y: 0 } }
}
