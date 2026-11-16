// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { Process, State } from '../../../types'
const state = (id: string, name: string, category = 'started'): State => ({ id, name, category })
const edge = (id: string, from: string, to: string, name = id) => ({ id, name, from: [from], to })
export const small: Process = {
  id: 'small', name: 'Simple delivery', initial: 'ready',
  states: [state('ready', 'Ready', 'unstarted'), state('active', 'In progress'), state('done', 'Done', 'completed')],
  transitions: [edge('start', 'ready', 'active', 'Start work'), edge('finish', 'active', 'done', 'Complete')],
}
export const branching: Process = {
  id: 'branching', name: 'Release checks', initial: 'ready',
  states: [state('ready', 'Ready', 'unstarted'), state('build', 'Build artifact'), state('security', 'Security review'), state('quality', 'Quality assurance'), state('release', 'Release approval'), state('done', 'Deployed', 'completed')],
  transitions: [edge('start', 'ready', 'build', 'Start build'), edge('scan', 'build', 'security', 'Request security review'), edge('test', 'build', 'quality', 'Run acceptance tests'), edge('secure', 'security', 'release', 'Security approved'), edge('tested', 'quality', 'release', 'Tests passed'), edge('ship', 'release', 'done', 'Deploy release')],
}
export const looping: Process = {
  ...structuredClone(branching), id: 'looping', name: 'Release with rework',
  transitions: [...branching.transitions!, edge('rework', 'release', 'build', 'Changes requested'), edge('retry', 'quality', 'quality', 'Retry checks'), edge('reopen', 'done', 'ready', 'Reopen release')],
}
export const large: Process = {
  id: 'large', name: 'Delivery pipeline · 18 states', initial: 'step_0',
  states: Array.from({ length: 18 }, (_, i) => state('step_' + i, ['Intake', 'Triage', 'Scope', 'Design', 'Review design', 'Plan build', 'Implement', 'Peer review', 'Build artifact', 'Unit tests', 'Integration tests', 'Security scan', 'Stage', 'Acceptance', 'Release approval', 'Deploy', 'Monitor', 'Complete'][i], i === 0 ? 'unstarted' : i === 17 ? 'completed' : 'started')),
  transitions: [...Array.from({ length: 17 }, (_, i) => edge('next_' + i, 'step_' + i, 'step_' + (i + 1), i % 4 === 0 ? 'Ready for next stage' : 'Continue')), edge('revise', 'step_4', 'step_3', 'Revise design'), edge('fix', 'step_11', 'step_6', 'Fix security findings'), edge('rollback', 'step_16', 'step_14', 'Rollback and review')],
}
export const parallel: Process = {
  id: 'parallel', name: 'Parallel verification', initial: 'ready',
  states: [state('ready', 'Ready', 'unstarted'), { ...state('checks', 'Verification'), kind: 'parallel', regions: [{ id: 'test', initial: 'testing' }, { id: 'scan', initial: 'scanning' }], join: 'all' }, state('testing', 'Functional testing'), state('scanning', 'Security scanning'), state('done', 'Done', 'completed')],
  transitions: [edge('start', 'ready', 'checks', 'Begin checks'), edge('tested', 'testing', 'done', 'Tests pass'), edge('scanned', 'scanning', 'done', 'Scan clean'), { ...edge('join', 'checks', 'done', 'All checks pass'), auto: true, default: true }],
}
export const graphFixtures = { small, branching, looping, large, parallel }
