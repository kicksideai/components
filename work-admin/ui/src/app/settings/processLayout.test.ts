// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { graphFixtures } from './__fixtures__/processes'
import { processLayout } from './process'
const intersects = (a: {x: number; y: number; width: number; height: number}, b: {x: number; y: number; width: number; height: number}) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
it.each(Object.entries(graphFixtures))('%s reserves visible node titles and all transition labels', (_, process) => {
  const layout = processLayout(process)
  const nodes = layout.nodes.map(n => ({ x: n.x - n.width / 2, y: n.y - n.height / 2, width: n.width, height: n.height }))
  // These dimensions include the actual title and caption, not only an icon's hit area.
  for (const node of nodes) { expect(node.width).toBeGreaterThanOrEqual(160); expect(node.height).toBeGreaterThanOrEqual(60) }
  const labels = layout.edges.map(e => ({ x: e.x - e.width / 2, y: e.y - e.height / 2, width: e.width, height: e.height }))
  const boxes = [...nodes, ...labels]
  for (const [index, box] of boxes.entries()) {
    expect(box.x).toBeGreaterThanOrEqual(0); expect(box.y).toBeGreaterThanOrEqual(0)
    expect(box.x + box.width).toBeLessThanOrEqual(layout.width); expect(box.y + box.height).toBeLessThanOrEqual(layout.height)
    for (const other of boxes.slice(index + 1)) expect(intersects(box, other)).toBe(false)
  }
})

// Segment/rectangle clipping checks the full routed segment, including long skips.
function crosses(a: {x: number; y: number}, b: {x: number; y: number}, rect: {x: number; y: number; width: number; height: number}) {
  let lo = 0, hi = 1
  for (const [start, end, min, max] of [[a.x, b.x, rect.x + .01, rect.x + rect.width - .01], [a.y, b.y, rect.y + .01, rect.y + rect.height - .01]]) {
    if (start === end) { if (start < min || start > max) return false; continue }
    const one = (min - start) / (end - start), two = (max - start) / (end - start)
    lo = Math.max(lo, Math.min(one, two)); hi = Math.min(hi, Math.max(one, two))
    if (lo > hi) return false
  }
  return lo <= hi
}
it.each(Object.entries(graphFixtures))('%s never routes a transition through a state', (_, process) => {
  const layout = processLayout(process)
  for (const edge of layout.edges) for (const [i, point] of edge.points.entries()) {
    if (!i) continue
    for (const node of layout.nodes) expect(crosses(edge.points[i - 1], point, { x: node.x - node.width / 2, y: node.y - node.height / 2, width: node.width, height: node.height }), edge.key + ' through ' + node.state.id).toBe(false)
  }
  const expected = (process.transitions ?? []).reduce((n, t) => n + (t.from === 'any' ? 0 : t.from.length), 0)
  expect(layout.edges).toHaveLength(expected)
})
it('lays out long names, multiline labels, globals and self loops without mutating their process', () => {
  const process = structuredClone(graphFixtures.looping)
  process.states[0].name = 'A deliberately long state name with several wrapped lines'
  process.transitions![0].name = 'A deliberately long transition name with several wrapped lines'
  process.transitions!.push({ id: 'global', name: 'Cancel this release from anywhere', from: 'any', to: 'done' })
  const before = JSON.stringify(process), layout = processLayout(process)
  expect(layout.nodes[0].title.length).toBeGreaterThan(1)
  expect(layout.edges[0].lines.length).toBeGreaterThan(1)
  for (const box of [...layout.nodes, ...layout.edges]) {
    expect(box.y - box.height / 2).toBeGreaterThanOrEqual(0)
    expect(box.y + box.height / 2).toBeLessThanOrEqual(layout.height)
  }
  expect(JSON.stringify(process)).toBe(before)
})
