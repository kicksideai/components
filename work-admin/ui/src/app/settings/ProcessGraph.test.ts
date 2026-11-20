// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ProcessGraph from './ProcessGraph.vue'
import type { Process } from '../../types'
import { processLayout, stateMeaning } from './process'
const release: Process = {
  id: 'release', initial: 'backlog', states: [
    { id: 'backlog', name: 'Backlog', category: 'unstarted' }, { id: 'in_progress', name: 'In progress', category: 'started' },
    { id: 'review', name: 'Review gate', category: 'started', kind: 'gate' },
    { id: 'build', name: 'Build', category: 'started', kind: 'automated' }, { id: 'qa', name: 'QA parallel', category: 'started', kind: 'parallel' },
    { id: 'done', name: 'Done', category: 'completed' }, { id: 'canceled', name: 'Canceled', category: 'canceled' },
  ], transitions: [
    { id: 'start', name: 'Start', from: ['backlog'], to: 'in_progress' },
    { id: 'review', name: 'Request review', from: ['in_progress'], to: 'review' },
    { id: 'build', name: 'Build', from: ['review'], to: 'build' },
    { id: 'qa', name: 'Verify', from: ['build'], to: 'qa' },
    { id: 'finish', name: 'Finish', from: ['qa'], to: 'done' },
    { id: 'cancel', name: 'Cancel', from: 'any', to: 'canceled' },
    { id: 'reopen', name: 'Reopen', from: ['done', 'canceled'], to: 'backlog' },
  ],
}
interface Rect { x: number; y: number; width: number; height: number }
const intersects = (a: Rect, b: Rect) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
function expectContained(layout: ReturnType<typeof processLayout>) {
  const bounds = [
    ...layout.nodes.map(node => ({ x: node.x - node.width / 2, y: node.y - node.height / 2, width: node.width, height: node.height })),
    ...layout.edges.map(edge => ({ x: edge.x - edge.width / 2, y: edge.y - 9, width: edge.width, height: 18 })),
  ]
  for (const rect of bounds) {
    expect(rect.x).toBeGreaterThanOrEqual(0)
    expect(rect.y).toBeGreaterThanOrEqual(0)
    expect(rect.x + rect.width).toBeLessThanOrEqual(layout.width)
    expect(rect.y + rect.height).toBeLessThanOrEqual(layout.height)
  }
}
it('renders a transition from any state once on its target and keeps it editable', async () => {
  const w = mount(ProcessGraph, { props: { process: release, draft: {} } })
  expect(w.findAll('.work-graph-edge')).toHaveLength(7)
  expect(w.findAll('.work-any-transition')).toHaveLength(1)
  expect(w.get('.work-any-transition').text()).toBe('Cancel works from any state')
  expect(w.get('.work-any-transition').element.closest('.work-graph-node')?.textContent).toContain('Canceled')
  await w.get('.work-any-transition').trigger('keydown', { key: 'Enter' })
  expect(w.emitted('transition')?.[0]).toEqual([release.transitions![5], w.get('.work-any-transition').element])
  expect(w.emitted('state')).toBeUndefined(); w.unmount()
})
it('layers the default route left to right and routes returns distinctly', () => {
  const layout = processLayout(release)
  expect(layout.main.map(s => s.id)).toEqual(['backlog', 'in_progress', 'review', 'build', 'qa', 'done'])
  const main = layout.main.map(s => layout.nodes.find(n => n.state.id === s.id)!)
  for (let i = 1; i < main.length; i++) expect(main[i].x - main[i].width / 2).toBeGreaterThan(main[i - 1].x + main[i - 1].width / 2)
  expect(layout.edges.filter(e => e.transition.id === 'reopen').every(e => e.type === 'return')).toBe(true)
  expectContained(layout)
  expect(layout.edges.some(e => e.transition.id === 'cancel')).toBe(false)
})
it('routes every parallel lane and its exits, reserving collision-free labels', () => {
  const process = structuredClone(release), qa = process.states.find(s => s.id === 'qa')!
  qa.regions = [{ id: 'functional', initial: 'testing' }, { id: 'security', initial: 'scanning' }]; qa.join = 'all'
  process.states.push({ id: 'testing', name: 'Functional testing', category: 'started' }, { id: 'scanning', name: 'Security scan', category: 'started', kind: 'automated' })
  process.transitions!.push({ id: 'tests_pass', from: ['testing'], to: 'done' }, { id: 'scan_clean', from: ['scanning'], to: 'done' })
  const layout = processLayout(process)
  expect(layout.parallels).toHaveLength(2)
  expect(layout.parallels.every(lane => lane.state === qa && !!lane.path)).toBe(true)
  expect(layout.edges.some(e => e.transition.id === 'tests_pass')).toBe(true)
  expect(layout.edges.some(e => e.transition.id === 'scan_clean')).toBe(true)
  expectContained(layout)
  const boxes = [...layout.nodes, ...layout.edges].map(n => ({ x: n.x - n.width / 2, y: n.y - n.height / 2, width: n.width, height: n.height }))
  for (const [i, box] of boxes.entries()) for (const other of boxes.slice(i + 1)) expect(intersects(box, other)).toBe(false)
})
it('follows a marked default before other forward choices and stops on a repeat', () => {
  const process = structuredClone(release)
  process.transitions!.unshift({ id: 'skip', from: ['backlog'], to: 'build', default: true })
  process.transitions!.push({ id: 'repeat', from: ['qa'], to: 'backlog', default: true })
  expect(processLayout(process).main.map(s => s.id)).toEqual(['backlog', 'build', 'qa'])
})
it('travels through stops with arrow keys, selects with Enter, and clears on Escape', async () => {
  const host = document.createElement('div'); document.body.append(host)
  const w = mount(ProcessGraph, { props: { process: release, draft: {} }, attachTo: host })
  const stops = w.findAll('.work-graph-node')
  ;(stops[0].element as SVGElement).focus()
  await stops[0].trigger('keydown', { key: 'ArrowRight' })
  expect(document.activeElement).toBe(stops[1].element)
  await stops[1].trigger('keydown', { key: 'Enter' })
  expect(w.emitted('state')?.[0]).toEqual([release.states[1], stops[1].element])
  await stops[1].trigger('keydown', { key: 'ArrowLeft' })
  expect(document.activeElement).toBe(stops[0].element)
  await w.get('.work-process-canvas').trigger('keydown', { key: 'Escape' })
  expect(w.emitted('clear')).toHaveLength(1)
  w.unmount(); host.remove()
})
it('uses human names for stop selection and connection without exposing opaque ids', () => {
  const process: Process = { id: 'flow', initial: '2ecb19d5-3434-4b9b-b9dd-d18340fdd395', states: [{ id: '2ecb19d5-3434-4b9b-b9dd-d18340fdd395', name: 'Ready', category: 'unstarted' }], transitions: [] }
  const w = mount(ProcessGraph, { props: { process, draft: {} } })
  expect(w.find('[aria-label="Edit state Ready"]').exists()).toBe(true)
  expect(w.find('[aria-label="Connect from Ready"]').exists()).toBe(true)
  expect(w.text()).not.toMatch(/[a-f0-9]{8}-[a-f0-9-]{27,}/)
  w.unmount()
})
it('draws a ghost while connecting and zooms, pans, and fits without changing the process', async () => {
  const process = structuredClone(release), before = JSON.stringify(process)
  const w = mount(ProcessGraph, { props: { process, draft: {} } })
  const svg = w.get('svg[aria-label="States and transitions"]'), canvas = w.get('.work-process-canvas')
  const original = svg.attributes('viewBox')
  Object.defineProperty(svg.element, 'getBoundingClientRect', { value: () => new DOMRect(0, 0, 890, 430) })
  await w.get('[aria-label="Connect from Backlog"]').trigger('pointerdown', { pointerId: 1 })
  await canvas.trigger('pointermove', { pointerId: 1, clientX: 240, clientY: 200 })
  const point = w.get('.work-connect-ghost').attributes('d')!.split('L ')[1].split(' ').map(Number)
  expect(point[0]).toBeCloseTo(Number(original!.split(' ')[0]) + 240 * Number(original!.split(' ')[2]) / 890)
  await w.get('[aria-label="Edit state In progress"]').trigger('pointerup', { pointerId: 1 })
  expect(w.emitted('connect')?.[0]).toEqual(['backlog', 'in_progress', w.get('[aria-label="Edit state In progress"]').element])
  expect(w.find('.work-connect-ghost').exists()).toBe(false)
  await canvas.trigger('wheel', { ctrlKey: true, deltaY: -20 })
  expect(Number(svg.attributes('viewBox')!.split(' ')[2])).toBeLessThan(Number(original!.split(' ')[2]))
  const beforePan = Number(svg.attributes('viewBox')!.split(' ')[0])
  await canvas.trigger('pointerdown', { pointerId: 2, clientX: 40, clientY: 40 })
  await canvas.trigger('pointermove', { pointerId: 2, clientX: 80, clientY: 60 })
  expect(Number(svg.attributes('viewBox')!.split(' ')[0])).toBeLessThan(beforePan)
  await canvas.trigger('pointerup', { pointerId: 2 })
  w.vm.fit(); await w.vm.$nextTick()
  expect(Number(svg.attributes('viewBox')!.split(' ')[2])).toBeGreaterThanOrEqual(processLayout(process).width)
  const fitted = svg.attributes('viewBox')
  await canvas.trigger('pointerdown', { pointerId: 3, clientX: 10, clientY: 40 })
  await canvas.trigger('pointerdown', { pointerId: 4, clientX: 30, clientY: 40 })
  await canvas.trigger('pointermove', { pointerId: 4, clientX: 50, clientY: 40 })
  expect(Number(svg.attributes('viewBox')!.split(' ')[2])).toBeLessThan(Number(fitted!.split(' ')[2]))
  expect(JSON.stringify(process)).toBe(before)
  w.unmount()
})

it('describes approval, wait-only release, and capacity from the current settings', () => {
  expect(stateMeaning({ id: 'review', category: 'started', kind: 'gate', release_when: { wait: 'PT2H' } }, {})).toBe('Items wait until the release rules are met.')
  expect(stateMeaning({ id: 'review', category: 'started', kind: 'gate', release_when: { approvals: { min: 2, from: { group: 'reviewers' } } } }, { policy: { wip: { review: { limit: 3 } } } })).toBe('Items wait here until 2 people approve. At most 3 at a time.')
})

it('humanizes unnamed transition ids and places the limit in its own caption', () => {
  const process = structuredClone(release); process.transitions![0].name = undefined; process.transitions![0].id = 'approved'
  const review = process.states.find(s => s.id === 'review')!; review.release_when = { approvals: { min: 1, from: [] } }
  const w = mount(ProcessGraph, { props: { process, draft: { policy: { wip: { review: { limit: 3 } } } } } })
  expect(w.get('.work-edge-label').text()).toBe('Approved')
  const caption = w.get('[aria-label="Edit state Review gate"] .work-node-meta')
  expect(caption.text()).toBe('Needs 1 approval · limit 3')
  expect(caption.get('tspan.work-limit-text').text()).toBe('· limit 3')
  expect(w.find('.work-stop-limit').exists()).toBe(false); w.unmount()
})
it('reveals externally selected states and resets the viewport when switching processes', async () => {
  const w = mount(ProcessGraph, { props: { process: release, draft: {} } })
  const done = release.states.find(s => s.id === 'done')!, node = processLayout(release).nodes.find(n => n.state.id === done.id)!
  await w.setProps({ selectedState: done })
  const box = w.get('svg[aria-label="States and transitions"]').attributes('viewBox')!.split(' ').map(Number)
  expect(box[0]).toBeLessThanOrEqual(node.x - node.width / 2)
  expect(box[0] + box[2]).toBeGreaterThanOrEqual(node.x + node.width / 2)
  w.vm.zoomIn(); await w.vm.$nextTick()
  await w.setProps({ process: { ...release, id: 'another' }, selectedState: undefined })
  expect(Number(w.get('svg[aria-label="States and transitions"]').attributes('viewBox')!.split(' ')[2])).toBe(900)
  w.unmount()
})
