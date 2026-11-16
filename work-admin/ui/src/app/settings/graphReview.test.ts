// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ProcessGraph from './ProcessGraph.vue'
import { graphFixtures } from './__fixtures__/processes'
import { processLayout, graphPath } from './processLayout'
import { initialGraphView } from './graphViewport'
import { blocked } from './orthogonalRoute'

for (const width of [1390, 552]) for (const [name, process] of Object.entries(graphFixtures)) {
  it(`${name} at ${width} uses fixed, orthogonal output/input sides`, () => {
    const layout = processLayout(process, {}, { width, height: 480 })
    for (const edge of layout.edges) {
      const source = layout.nodes.find(n => n.state.id === edge.from)!, target = layout.nodes.find(n => n.state.id === edge.transition.to)!
      const first = edge.points[0], last = edge.points.at(-1)!
      expect(first).toEqual(layout.direction === 'TB' ? { x: source.x, y: source.y + source.height / 2 } : { x: source.x + source.width / 2, y: source.y })
      const departure = edge.points[1], approach = edge.points.at(-2)!
      expect(layout.direction === 'TB' ? departure.y > first.y && departure.x === first.x : departure.x > first.x && departure.y === first.y).toBe(true)
      expect(layout.direction === 'TB' ? approach.y < last.y && approach.x === last.x : approach.x < last.x && approach.y === last.y).toBe(true)
      expect(last).toEqual(layout.direction === 'TB' ? { x: target.x, y: target.y - target.height / 2 } : { x: target.x - target.width / 2, y: target.y })
      for (let i = 1; i < edge.points.length; i++) expect(edge.points[i].x === edge.points[i - 1].x || edge.points[i].y === edge.points[i - 1].y).toBe(true)
    }
    if (width < 750 || name === 'large') expect(layout.direction).toBe('TB')
  })
}
it('omits outgoing connection controls on terminal states', () => {
  const w = mount(ProcessGraph, { props: { process: graphFixtures.branching, draft: {} } })
  expect(w.find('[aria-label="Connect from Deployed"]').exists()).toBe(false)
  expect(w.find('[aria-label="Connect from Build artifact"]').exists()).toBe(true)
  w.unmount()
})

for (const width of [1390, 552]) it.each(Object.entries(graphFixtures))(`%s has a readable width-fitted overview at ${width}`, (_, process) => {
  const layout = processLayout(process, {}, { width, height: 420 })
  expect(width / layout.width).toBeGreaterThanOrEqual(.8)
})

it.each([1390, 552])('keeps initial states readable at %s and fits all when readable', width => {
  for (const process of Object.values(graphFixtures)) {
    const viewport = { width, height: width < 700 ? 420 : 480 }, layout = processLayout(process, {}, viewport)
    const view = initialGraphView(layout, viewport, process.initial)
    const contains = (n: {x: number; y: number; width: number; height: number}) => n.x - n.width / 2 >= view.pan.x - .01 && n.y - n.height / 2 >= view.pan.y - .01 && n.x + n.width / 2 <= view.pan.x + width / view.zoom + .01 && n.y + n.height / 2 <= view.pan.y + viewport.height / view.zoom + .01
    expect(view.zoom).toBeGreaterThanOrEqual(.8)
    expect(contains(layout.nodes.find(n => n.state.id === process.initial)!)).toBe(true)
    if (Math.min(width / layout.width, viewport.height / layout.height) >= .8) expect(layout.nodes.every(contains)).toBe(true)
  }
})
it.each([1390, 552])('reserves every chip from every painted edge at %s', width => {
  for (const process of Object.values(graphFixtures)) {
    const layout = processLayout(process, {}, { width, height: 480 })
    const boxes = [...layout.nodes, ...layout.edges]
    for (let i = 0; i < boxes.length; i++) for (const b of boxes.slice(i + 1)) {
      const a = boxes[i]
      expect(Math.abs(a.x - b.x) < (a.width + b.width) / 2 && Math.abs(a.y - b.y) < (a.height + b.height) / 2).toBe(false)
    }
    for (const edge of layout.edges) for (const segment of edge.segments) for (let i = 1; i < segment.length; i++) for (const label of layout.edges) {
      expect(blocked(segment[i - 1], segment[i], { x: label.x - label.width / 2 - 2, y: label.y - label.height / 2 - 2, width: label.width + 4, height: label.height + 4 }), `${edge.key} through ${label.key}`).toBe(false)
    }
  }
})
it('keeps orthogonal corners when routed legs meet at a repeated waypoint', () => {
  const points = [{x: 0, y: 0}, {x: 0, y: 30}, {x: 0, y: 30}, {x: 30, y: 30}, {x: 30, y: 60}]
  expect(graphPath(points)).toBe(graphPath(points.filter((_, i) => i !== 2)))
  expect(graphPath(points)).toContain('Q 0 30')
})

it.each([1390, 552])('keeps a self loop in the nearest exterior slot at %s', width => {
  const layout = processLayout(graphFixtures.looping, {}, { width, height: 480 })
  const loop = layout.edges.find(e => e.transition.id === 'retry')!, node = layout.nodes.find(n => n.state.id === 'quality')!
  expect(loop.type).toBe('return')
  if (layout.direction === 'TB') expect(loop.y).toBe(node.y + node.height / 2 + 18)
  else expect(loop.x).toBe(node.x)
  const extent = layout.direction === 'TB' ? Math.max(...loop.points.map(p => p.y)) - Math.min(...loop.points.map(p => p.y)) : Math.max(...loop.points.map(p => p.y)) - node.y
  expect(extent).toBeLessThan(200)
})

// Check actual painted subpaths: the gap at a chip is not a line segment.
const legs = (edge: ReturnType<typeof processLayout>['edges'][number]) => edge.segments.flatMap(points => points.slice(1).map((b, i) => ({ a: points[i], b }))).filter(({a, b}) => a.x !== b.x || a.y !== b.y)
const segmentsMeet = (one: ReturnType<typeof legs>[number], two: ReturnType<typeof legs>[number]) => {
  const between = (p: number, a: number, b: number) => p >= Math.min(a, b) && p <= Math.max(a, b)
  const horizontal = (s: typeof one) => s.a.y === s.b.y
  if (horizontal(one) !== horizontal(two)) {
    const h = horizontal(one) ? one : two, v = horizontal(one) ? two : one
    return between(v.a.x, h.a.x, h.b.x) && between(h.a.y, v.a.y, v.b.y)
  }
  const axis = horizontal(one) ? 'x' : 'y', cross = horizontal(one) ? 'y' : 'x'
  return one.a[cross] === two.a[cross] && Math.max(Math.min(one.a[axis], one.b[axis]), Math.min(two.a[axis], two.b[axis])) <= Math.min(Math.max(one.a[axis], one.b[axis]), Math.max(two.a[axis], two.b[axis]))
}
for (const width of [1390, 552]) for (const name of ['looping', 'large'] as const) {
  it(`${name} at ${width} has separate non-crossing return lanes and horizontal chip gaps`, () => {
    const layout = processLayout(graphFixtures[name], {}, { width, height: 480 })
    const returns = layout.edges.filter(e => e.type === 'return')
    for (const [i, edge] of returns.entries()) {
      for (const other of returns.slice(i + 1)) for (const a of legs(edge)) for (const b of legs(other)) {
        expect(segmentsMeet(a, b), `${edge.key} crosses or shares a segment with ${other.key}: ${JSON.stringify({a, b})}`).toBe(false)
      }
      const before = edge.segments[0].at(-1)!, after = edge.segments[1][0]
      expect(before.y, edge.key + ' chip entry is horizontal').toBe(edge.y)
      expect(after.y, edge.key + ' chip exit is horizontal').toBe(edge.y)
      expect(edge.segments[0].at(-2)!.y, edge.key + ' approaches chip horizontally').toBe(edge.y)
      expect(edge.segments[1][1].y, edge.key + ' leaves chip horizontally').toBe(edge.y)
      expect(Math.abs(before.x - edge.x)).toBeGreaterThan(edge.width / 2)
      expect(Math.abs(after.x - edge.x)).toBeGreaterThan(edge.width / 2)
      expect((before.x + after.x) / 2).toBe(edge.x)
    }
    const axis = layout.direction === 'TB' ? 'y' : 'x'
    const span = (edge: typeof returns[number]) => Math.abs(layout.nodes.find(n => n.state.id === edge.from)![axis] - layout.nodes.find(n => n.state.id === edge.transition.to)![axis])
    const track = (edge: typeof returns[number]) => Math.max(...edge.points.map(p => layout.direction === 'TB' ? p.x : p.y))
    for (const edge of returns) for (const other of returns) if (span(edge) < span(other)) expect(track(edge), edge.key + ' stays inside longer return ' + other.key).toBeLessThan(track(other))
    for (const edge of layout.edges) for (const {a, b} of legs(edge)) for (const chip of [...layout.edges, ...layout.nodes]) {
      expect(blocked(a, b, {x: chip.x - chip.width / 2, y: chip.y - chip.height / 2, width: chip.width, height: chip.height}), edge.key + ' enters card/chip at ' + JSON.stringify({x: chip.x, y: chip.y})).toBe(false)
    }
  })
}
