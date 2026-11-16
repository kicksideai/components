// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { humanize } from '../../forms'
import type { Declaration, Process, State, Transition } from '../../types'

export const categories = ['unstarted', 'started', 'completed', 'canceled']

export function uniqueId(prefix: string, entries: { id: string }[]): string {
  let index = 1
  const candidate = () => `${prefix.slice(0, 40 - String(index).length - 1)}_${index}`
  while (entries.some(entry => entry.id === candidate())) index++
  return candidate()
}

export function stateUses(process: Process, state: State): string[] {
  return [
    ...(process.initial === state.id ? ['the initial state'] : []),
    ...(process.transitions ?? []).filter(t => t.to === state.id || t.from !== 'any' && t.from.includes(state.id)).map(t => `transition ${transitionTitle(t)}`),
    ...process.states.filter(s => s.regions?.some(r => r.initial === state.id)).map(s => `lanes in ${stateTitle(s)}`),
    ...Object.entries(process.map ?? {}).filter(([, target]) => target === state.id).map(() => 'existing item migration'),
  ]
}

export function transitionUses(process: Process, transition: Transition): string[] {
  return process.states.flatMap(state => [
    ...(['on_pass', 'on_fail', 'on_cancel', 'on_exhausted'] as const).filter(route => state.run?.[route] === transition.id).map(route => `${{ on_pass: 'success', on_fail: 'failure', on_cancel: 'cancellation', on_exhausted: 'exhaustion' }[route]} handler in ${stateTitle(state)}`),
    ...(state.timers ?? []).filter(timer => timer.then?.transition === transition.id).map(() => 'a timer'),
  ])
}

export const stateTitle = (state?: State) => state?.name || 'Untitled state'
export const transitionTitle = (transition: Transition) => transition.name?.trim() || humanize(transition.id)
export const categoryTitle = (category: string) => ({ unstarted: 'Not started', triage: 'Triage', backlog: 'Backlog', started: 'In progress', completed: 'Done', canceled: 'Canceled' })[category] ?? 'In progress'
export const kindTitle = (kind?: string) => ({ human: 'Person', gate: 'Approval', automated: 'Automation', parallel: 'Parallel' })[kind ?? 'human'] ?? 'Person'
export function stateCaption(state: State, process: Process): string {
  if (state.id === process.initial) return 'Starts here'
  if (state.category === 'completed') return 'Finished'
  if (state.category === 'canceled') return 'Work stops here'
  if (state.kind === 'gate') { const n = state.release_when?.approvals?.min; return n ? `Needs ${n} approval${n === 1 ? '' : 's'}` : 'Waits for release' }
  return state.kind === 'automated' ? 'Runs automatically' : state.kind === 'parallel' ? joinTitle(state) : 'A person moves it'
}
export function joinTitle(state: State): string {
  return state.join === 'any' ? 'any may pass' : typeof state.join === 'number' ? `${state.join} must pass` : state.regions?.length === 2 ? 'both must pass' : 'all must pass'
}
export function stateMeaning(state: State, draft: Declaration): string {
  const count = state.release_when?.approvals?.min ?? 1
  const meaning = state.category === 'completed' ? 'Work is finished here.' : state.category === 'canceled' ? 'Work stops here.' : state.kind === 'gate' ? state.release_when?.approvals ? `Items wait here until ${count === 1 ? 'one person approves' : `${count} people approve`}.` : 'Items wait until the release rules are met.' : state.kind === 'automated' ? 'An automation runs when an item arrives.' : state.kind === 'parallel' ? `Items travel through lanes; ${joinTitle(state)}.` : 'A person chooses when to move the item on.'
  const limit = draft.policy?.wip?.[state.id]?.limit
  return meaning + (limit !== undefined ? ` At most ${limit} at a time.` : '')
}
export { processLayout } from './processLayout'
export type { GraphNode, GraphEdge } from './processLayout'

export function mainPath(process: Process): State[] {
  const transitions = process.transitions ?? [], main: State[] = [], seen = new Set<string>()
  let state = process.states.find(s => s.id === process.initial)
  const declared = new Map(process.states.map((s, index) => [s.id, index]))
  while (state && !seen.has(state.id)) {
    main.push(state); seen.add(state.id)
    if (state.category === 'completed' || state.category === 'canceled') break
    const source = state
    const options = transitions.filter(t => t.from !== 'any' && t.from.includes(source.id))
    const next = options.find(t => t.default) ?? options.find(t => !seen.has(t.to) && (declared.get(t.to) ?? -1) > (declared.get(source.id) ?? 0))
    state = process.states.find(s => s.id === next?.to)
  }
  return main
}

export function effectiveMigration(process: Process): string {
  const entry = process.states.find(state => state.id === process.initial)
  return process.migration ?? (entry?.kind === 'automated' || entry?.kind === 'parallel' ? 'pin' : 'follow')
}
