// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import dagre from './vendor/dagre.js'
import { orthogonalRoute, simplify, type Obstacle } from './orthogonalRoute'
import type { Declaration, Process, State, Transition } from '../../types'
import { mainPath, stateTitle, stateCaption, transitionTitle } from './process'
export interface Point { x: number; y: number }
export interface GraphNode { state: State; x: number; y: number; width: number; height: number; badges: Transition[]; title: string[]; caption: string[]; row: number }
export interface GraphEdge { transition: Transition; path: string; points: Point[]; key: string; x: number; y: number; width: number; height: number; lines: string[]; type: 'main' | 'forward' | 'return'; targetOffset: number; from: string; segments: Point[][] }

// Conservative glyph advances for the map's 11–12.5px platform type. Wide
// scripts and emoji reserve more room; these sizes also work without a DOM.
const textWidth = (text: string) => Array.from(text).reduce((width, char) => width + (/[^\x20-\x7e]/u.test(char) ? 16 : /[MW@%]/.test(char) ? 11 : /[ilI.,:;!| ']/.test(char) ? 4 : 7.5), 0)

// Wrapping is shared with SVG rendering: every visible line participates in layout.
export function graphLines(text: string, length = 28): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(/\s+/u)) {
    for (let i = 0; i < word.length; i += length) {
      const part = word.slice(i, i + length)
      if (line && line.length + part.length + 1 > length) { lines.push(line); line = '' }
      line = line ? line + ' ' + part : part
    }
  }
  return [...lines, line].filter(Boolean)
}
// Round Dagre's routed polyline corners without moving the route outside its corridor.
export function graphPath(points: Point[]): string {
  points = simplify(points)
  if (!points.length) return ''
  let path = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i - 1], b = points[i], c = points[i + 1]
    const before = Math.hypot(b.x - a.x, b.y - a.y), after = Math.hypot(c.x - b.x, c.y - b.y)
    const radius = Math.min(8, before / 3, after / 3)
    if (!radius) continue
    path += ` L ${b.x + (a.x - b.x) * radius / before} ${b.y + (a.y - b.y) * radius / before} Q ${b.x} ${b.y} ${b.x + (c.x - b.x) * radius / after} ${b.y + (c.y - b.y) * radius / after}`
  }
  const last = points.at(-1)!
  return path + ` L ${last.x} ${last.y}`
}
export function processLayout(process: Process, draft: Declaration = {}, viewport = { width: 1400, height: 480 }) {
  const direction = viewport.width < 750 || mainPath(process).length > 8 ? 'TB' : 'LR'
  const graph = new dagre.graphlib.Graph({ multigraph: true })
  graph.setGraph({ rankdir: direction, ranker: 'network-simplex', acyclicer: 'greedy', nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 })
  graph.setDefaultEdgeLabel(() => ({}))
  const main = mainPath(process), mainIds = new Map(main.map((s, i) => [s.id, i]))
  const nodes: GraphNode[] = process.states.map(state => {
    const badges = (process.transitions ?? []).filter(t => t.from === 'any' && t.to === state.id)
    const title = graphLines(stateTitle(state)), caption = graphLines(stateCaption(state, process))
    const badgeLines = badges.flatMap(t => graphLines(transitionTitle(t) + ' works from any state'))
    const limit = draft.policy?.wip?.[state.id]?.limit
    const limitWidth = limit === undefined ? 0 : textWidth(' · limit ' + limit)
    const width = Math.max(168, ...title.map(line => textWidth(line) + 58), ...caption.map((line, i) => textWidth(line) + 32 + (i === caption.length - 1 ? limitWidth : 0)), ...badgeLines.map(line => textWidth(line) + 32))
    const height = Math.max(80, 42 + title.length * 18 + caption.length * 16 + badgeLines.length * 18)
    // Include the fixed port stubs in Dagre's rank reservations.
    graph.setNode(state.id, { width: width + (direction === 'LR' ? 36 : 0), height: height + (direction === 'TB' ? 36 : 0) })
    return { state, x: 0, y: 0, width, height, title, caption, badges, row: mainIds.has(state.id) ? 0 : 1 }
  })
  const ids = new Set(nodes.map(n => n.state.id))
  const routes = (process.transitions ?? []).flatMap(transition => transition.from === 'any' ? [] : transition.from.filter(from => ids.has(from) && ids.has(transition.to)).map(from => {
    const key = `${transition.id}-${from}`, lines = graphLines(transitionTitle(transition))
    const width = Math.max(72, ...lines.map(line => textWidth(line) + 24)), height = Math.max(24, lines.length * 16 + 10)
    return { transition, from, key, lines, width, height }
  }))
  // DFS removes only cycle-closing arcs before ranking. Returns get compact
  // exterior lanes, rather than widening every rank with dummy label nodes.
  const visiting = new Set<string>(), visited = new Set<string>()
  const returns = new Set(routes.filter(r => r.from === r.transition.to || r.transition.to === process.initial || ['completed', 'canceled'].includes(nodes.find(n => n.state.id === r.from)!.state.category)).map(r => r.key))
  function visit(id: string) {
    if (visited.has(id)) return
    visiting.add(id)
    for (const route of routes.filter(r => r.from === id)) {
      if (returns.has(route.key)) continue
      if (visiting.has(route.transition.to)) returns.add(route.key)
      else visit(route.transition.to)
    }
    visiting.delete(id); visited.add(id)
  }
  visit(process.initial)
  for (const node of nodes) visit(node.state.id)
  for (const route of routes) if (!returns.has(route.key)) {
    const fi = mainIds.get(route.from), ti = mainIds.get(route.transition.to)
    graph.setEdge(route.from, route.transition.to, { width: route.width, height: route.height, labelpos: 'c', weight: fi !== undefined && ti === fi + 1 ? 100 : 1 }, route.key)
  }
  // A global action is shown once on its target. Its rank still reflects the
  // implicit initial-to-target route, including otherwise disconnected exits.
  for (const transition of process.transitions ?? []) if (transition.from === 'any' && ids.has(process.initial) && ids.has(transition.to) && !mainIds.has(transition.to)) {
    const target = process.states.find(s => s.id === transition.to)!
    graph.setEdge(process.initial, transition.to, { minlen: ['completed', 'canceled'].includes(target.category) ? Math.max(1, main.length - 1) : 1 }, `any:${transition.id}`)
  }
  const lanes = process.states.flatMap(state => (state.regions ?? []).filter(r => ids.has(r.initial)).map((region, i) => {
    const key = `lane:${state.id}:${i}`
    graph.setEdge(state.id, region.initial, {}, key)
    return { state, region, key }
  }))
  if (!nodes.length) return { nodes, edges: [] as GraphEdge[], parallels: [], main, direction, width: 320, height: 160 }
  dagre.layout(graph)
  for (const node of nodes) Object.assign(node, { x: graph.node(node.state.id).x, y: graph.node(node.state.id).y })
  const vertical = direction === 'TB'
  const forwardLabels = routes.filter(r => !returns.has(r.key)).map(r => graph.edge({ v: r.from, w: r.transition.to, name: r.key }))
  const flowBounds = [...nodes, ...forwardLabels]
  const flowRight = Math.max(...flowBounds.map(n => n.x + n.width / 2)), flowBottom = Math.max(...flowBounds.map(n => n.y + n.height / 2))
  const nodeFor = (id: string) => nodes.find(n => n.state.id === id)!
  // Allocate a distinct exterior track per return, inside out by span. Nested
  // returns cannot cross: their port legs stop at their own track, before the
  // enclosing return's track. Self loops have zero span and remain nearest.
  const returnRoutes = routes.filter(r => returns.has(r.key)).sort((a, b) => {
    const axis = vertical ? 'y' : 'x'
    return Math.abs(nodeFor(a.from)[axis] - nodeFor(a.transition.to)[axis]) - Math.abs(nodeFor(b.from)[axis] - nodeFor(b.transition.to)[axis])
  })
  const tracks = new Map<string, { x: number; y: number; corridor: number; height: number }>()
  const returnWidth = Math.max(0, ...returnRoutes.map(r => r.width))
  let bottom = flowBottom + 32
  for (const [index, route] of returnRoutes.entries()) {
    const from = nodeFor(route.from), to = nodeFor(route.transition.to)
    // In TB maps the chip sits on the horizontal departure leg. The exterior
    // spine is vertical; no line enters a chip from above or below.
    const corridor = vertical ? flowRight + 16 + returnWidth + 28 + index * 18 : bottom + route.height / 2
    const x = vertical ? flowRight + 16 + returnWidth / 2 : (from.x + to.x) / 2
    let y = vertical ? from.y + from.height / 2 + 18 : corridor
    if (vertical) for (const label of [...tracks.values()].sort((a, b) => a.y - b.y)) {
      if (y + route.height / 2 + 10 > label.y - label.height / 2 - 10 && y - route.height / 2 - 10 < label.y + label.height / 2 + 10) y = label.y + label.height / 2 + 24 + route.height / 2
    }
    tracks.set(route.key, { x, y, corridor, height: route.height })
    bottom = corridor + route.height / 2 + 24
  }
  const labels = routes.map(route => ({ ...route, ...(tracks.get(route.key) ?? graph.edge({ v: route.from, w: route.transition.to, name: route.key })) }))
  const box = (item: { x: number; y: number; width: number; height: number }, margin: number): Obstacle => ({ x: item.x - item.width / 2 - margin, y: item.y - item.height / 2 - margin, width: item.width + margin * 2, height: item.height + margin * 2 })
  const obstacles = [...nodes.map(n => box(n, 12)), ...labels.map(e => box(e, 10))]
  const ports = (from: GraphNode, to: GraphNode) => ({
    start: vertical ? { x: from.x, y: from.y + from.height / 2 } : { x: from.x + from.width / 2, y: from.y },
    end: vertical ? { x: to.x, y: to.y - to.height / 2 } : { x: to.x - to.width / 2, y: to.y },
  })
  const stub = (p: Point, delta: number) => vertical ? { x: p.x, y: p.y + delta } : { x: p.x + delta, y: p.y }
  const edges: GraphEdge[] = labels.map(route => {
    const from = nodes.find(n => n.state.id === route.from)!, to = nodes.find(n => n.state.id === route.transition.to)!
    const { start, end } = ports(from, to)
    const back = returns.has(route.key)
    const sourceStub = stub(start, 18), targetStub = stub(end, -18)
    const half = (back || !vertical ? route.width : route.height) / 2 + 10
    const before = back ? { x: route.x + (vertical ? -half : half), y: route.y } : stub(route, -half)
    const after = back ? { x: route.x + (vertical ? half : -half), y: route.y } : stub(route, half)
    let segments: Point[][]
    if (back) {
      const { corridor } = tracks.get(route.key)!
      const outsideStart = vertical ? { x: corridor, y: route.y } : { x: sourceStub.x, y: corridor }
      const outsideEnd = vertical ? { x: corridor, y: targetStub.y } : { x: targetStub.x, y: corridor }
      segments = vertical ? [
        [start, ...orthogonalRoute(sourceStub, before, obstacles)],
        [after, outsideStart, outsideEnd, ...orthogonalRoute(outsideEnd, targetStub, obstacles), end],
      ] : [
        [start, ...orthogonalRoute(sourceStub, outsideStart, obstacles), before],
        [after, ...orthogonalRoute(outsideEnd, targetStub, obstacles), end],
      ]
    } else segments = [
      [start, ...orthogonalRoute(sourceStub, before, obstacles)],
      [...orthogonalRoute(after, targetStub, obstacles), end],
    ]
    const type = back ? 'return' : mainIds.get(route.transition.to) === (mainIds.get(route.from) ?? -2) + 1 ? 'main' : 'forward'
    return { ...route, points: segments.flat(), segments, path: segments.map(graphPath).join(' '), type, targetOffset: 0 }
  })
  const parallels = lanes.map(lane => {
    const from = nodes.find(n => n.state.id === lane.state.id)!, to = nodes.find(n => n.state.id === lane.region.initial)!
    const { start, end } = ports(from, to)
    const points = [start, ...orthogonalRoute(stub(start, 18), stub(end, -18), obstacles), end]
    return { state: lane.state, key: lane.key, points, path: graphPath(points) }
  })
  // Routing around fixed ports can extend beyond Dagre's original boundary.
  // Translate the complete scene once so every card, chip and bend has padding.
  const points = [...nodes.flatMap(n => [{ x: n.x - n.width / 2, y: n.y - n.height / 2 }, { x: n.x + n.width / 2, y: n.y + n.height / 2 }]), ...edges.flatMap(e => [...e.points, { x: e.x - e.width / 2, y: e.y - e.height / 2 }, { x: e.x + e.width / 2, y: e.y + e.height / 2 }]), ...parallels.flatMap(e => e.points)]
  const dx = 32 - Math.min(...points.map(p => p.x)), dy = 32 - Math.min(...points.map(p => p.y))
  const width = Math.max(...points.map(p => p.x)) + dx + 32, height = Math.max(...points.map(p => p.y)) + dy + 32
  const translate = (p: Point): Point => ({ x: p.x + dx, y: p.y + dy })
  for (const node of nodes) Object.assign(node, translate(node))
  for (const edge of edges) {
    Object.assign(edge, translate(edge))
    edge.segments = edge.segments.map(segment => segment.map(translate))
    edge.points = edge.segments.flat(); edge.path = edge.segments.map(graphPath).join(' ')
  }
  for (const lane of parallels) { lane.points = lane.points.map(translate); lane.path = graphPath(lane.points) }
  return { nodes, edges, parallels, main, direction, width, height }
}
