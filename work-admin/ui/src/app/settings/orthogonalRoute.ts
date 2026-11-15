// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { Point } from './processLayout'
export interface Obstacle { x: number; y: number; width: number; height: number }

const inside = (p: Point, box: Obstacle) => p.x > box.x && p.x < box.x + box.width && p.y > box.y && p.y < box.y + box.height
export function blocked(a: Point, b: Point, box: Obstacle) {
  return a.x === b.x
    ? a.x > box.x && a.x < box.x + box.width && Math.max(a.y, b.y) > box.y && Math.min(a.y, b.y) < box.y + box.height
    : a.y > box.y && a.y < box.y + box.height && Math.max(a.x, b.x) > box.x && Math.min(a.x, b.x) < box.x + box.width
}

// A* on the rectilinear visibility grid of card/label bounds. Dagre owns ranks
// and label placement; this router only connects their fixed ports around those
// obstacles. Direction is part of the search state so bends carry a small cost.
export function orthogonalRoute(start: Point, end: Point, obstacles: Obstacle[]): Point[] {
  const xs = [...new Set([start.x, end.x, ...obstacles.flatMap(b => [b.x, b.x + b.width])])].sort((a, b) => a - b)
  const ys = [...new Set([start.y, end.y, ...obstacles.flatMap(b => [b.y, b.y + b.height])])].sort((a, b) => a - b)
  xs.unshift(xs[0] - 24); xs.push(xs.at(-1)! + 24)
  ys.unshift(ys[0] - 24); ys.push(ys.at(-1)! + 24)
  const nx = xs.length, target = ys.indexOf(end.y) * nx + xs.indexOf(end.x)
  const origin = ys.indexOf(start.y) * nx + xs.indexOf(start.x)
  const point = (id: number) => ({ x: xs[id % nx], y: ys[Math.floor(id / nx)] })
  const costs = new Map<number, number>(), parents = new Map<number, number>()
  const queue: { key: number; cost: number; priority: number }[] = []
  function push(item: typeof queue[number]) {
    queue.push(item)
    let i = queue.length - 1
    while (i) { const parent = (i - 1) >> 1; if (queue[parent].priority <= item.priority) break; queue[i] = queue[parent]; i = parent }
    queue[i] = item
  }
  function pop() {
    const first = queue[0], last = queue.pop()!
    if (queue.length) {
      let i = 0
      while (i * 2 + 1 < queue.length) {
        let child = i * 2 + 1
        if (child + 1 < queue.length && queue[child + 1].priority < queue[child].priority) child++
        if (last.priority <= queue[child].priority) break
        queue[i] = queue[child]; i = child
      }
      queue[i] = last
    }
    return first
  }
  const distance = (p: Point) => Math.abs(p.x - end.x) + Math.abs(p.y - end.y)
  for (const direction of [0, 1]) { const key = origin * 2 + direction; costs.set(key, 0); push({ key, cost: 0, priority: distance(start) }) }
  const validity = new Map<number, boolean>(), passages = new Map<string, boolean>()
  while (queue.length) {
    const current = pop(), id = Math.floor(current.key / 2), direction = current.key % 2
    if (current.cost !== costs.get(current.key)) continue
    if (id === target) {
      const route: Point[] = []
      let key: number | undefined = current.key
      while (key !== undefined) { route.push(point(Math.floor(key / 2))); key = parents.get(key) }
      return simplify(route.reverse())
    }
    const a = point(id), xi = id % nx, yi = Math.floor(id / nx)
    for (const [next, nextDirection] of [[xi > 0 ? id - 1 : -1, 0], [xi + 1 < nx ? id + 1 : -1, 0], [yi > 0 ? id - nx : -1, 1], [yi + 1 < ys.length ? id + nx : -1, 1]]) {
      if (next < 0) continue
      const b = point(next)
      if (!validity.has(next)) validity.set(next, !obstacles.some(box => inside(b, box)))
      if (!validity.get(next)) continue
      const passage = `${Math.min(id, next)}:${Math.max(id, next)}`
      if (!passages.has(passage)) passages.set(passage, !obstacles.some(box => blocked(a, b, box)))
      if (!passages.get(passage)) continue
      const cost = current.cost + Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + (direction === nextDirection ? 0 : 18), key = next * 2 + nextDirection
      if (cost >= (costs.get(key) ?? Infinity)) continue
      costs.set(key, cost); parents.set(key, current.key); push({ key, cost, priority: cost + distance(b) })
    }
  }
  throw new Error('Process map has no collision-free route between its ports: ' + JSON.stringify({start,end, startInside: obstacles.filter(b => inside(start,b)), endInside: obstacles.filter(b => inside(end,b))}))
}
export function simplify(points: Point[]) {
  const result: Point[] = []
  for (const point of points) {
    const b = result.at(-1), a = result.at(-2)
    if (b && b.x === point.x && b.y === point.y) continue
    if (a && b && ((a.x === b.x && b.x === point.x) || (a.y === b.y && b.y === point.y))) result.pop()
    result.push(point)
  }
  return result
}
