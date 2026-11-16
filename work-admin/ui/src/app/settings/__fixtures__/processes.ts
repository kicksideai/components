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
// The release process used in the administration review.
export const cicd: Process = {
  id: 'release', name: 'Release pipeline flow', initial: 'planned', migration: 'pin',
  states: [
    {"id": "planned", "name": "Planned", "category": "unstarted"},
    {"id": "review", "name": "Review checkpoint", "category": "started", "kind": "gate", "release_when": {"approvals": {"min": 1, "from": {"group": "kickside.security.groups:members"}, "prevent_self": true}}},
    {"id": "building", "name": "Building", "category": "started", "kind": "automated", "run": {"stage": "build", "retry": {"max": 3, "backoff": "PT1S"}, "on_fail": "failed"}},
    {"id": "verifying", "name": "Verifying", "category": "started", "kind": "parallel", "regions": [{"id": "functional", "initial": "functional_check"}, {"id": "safety", "initial": "safety_check"}], "join": "all"},
    {"id": "functional_check", "name": "Functional check", "category": "started"},
    {"id": "safety_check", "name": "Safety check", "category": "started"},
    {"id": "checked", "name": "Check complete", "category": "completed"},
    {"id": "released", "name": "Released", "category": "completed"},
    {"id": "failed", "name": "Build failed", "category": "canceled"},
    {"id": "canceled", "name": "Canceled", "category": "canceled"},
  ],
  transitions: [
    {"id": "submit", "name": "Request approval", "from": ["planned"], "to": "review", "require": ["version"]},
    {"id": "approve_release", "name": "Approve release", "from": ["review"], "to": "building", "auto": true, "default": true},
    {"id": "reject", "name": "Return to planning", "from": ["review"], "to": "planned"},
    {"id": "passed", "name": "Build passed", "from": ["building"], "to": "verifying"},
    {"id": "failed", "name": "Build failed", "from": ["building"], "to": "failed"},
    {"id": "canceled", "name": "Cancel build", "from": ["building"], "to": "canceled"},
    {"id": "check_pass", "name": "Confirm check", "from": ["functional_check", "safety_check"], "to": "checked"},
    {"id": "verification_complete", "name": "Release verified build", "from": ["verifying"], "to": "released", "auto": true, "default": true},
    {"id": "retry", "name": "Plan another attempt", "from": ["failed", "canceled"], "to": "planned"},
  ],
}
export const graphFixtures = { small, branching, looping, large, parallel }
