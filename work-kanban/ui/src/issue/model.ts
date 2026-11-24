// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { WorkError } from '../work/client'
import { workFailure } from '../work/errors'
import { workRows } from './cursor'
import type { BoardSchema } from '../work/types'
import type { DeclaredTransition, Detail, Field, FieldValue, Issue, IssueType, Schema, Transition, Values, WriteResult } from './types'

export const issuePageLimit = 20
const common = ['title', 'name', 'description', 'assignee', 'priority', 'story_points', 'current_sprint', 'due_date']

export function compiledSchema(board: BoardSchema): Schema {
  return board.compiled as unknown as Schema
}

export function title(issue: Issue) {
  const value = issue.values.title ?? issue.values.name
  return typeof value === 'string' && value ? value : issue.key
}

export function stateLabel(schema: Schema, issue: Issue) {
  const process = schema.processes.find(entry => entry.id === schema.item_types.find(type => type.id === issue.type)?.process)
  const label = (id: string) => process?.states.find(state => state.id === id)?.name ?? id.replaceAll('_', ' ')
  return typeof issue.state === 'string' ? label(issue.state) : Object.values(issue.state).map(label).join(', ')
}

export function fieldsFor(schema: Schema, type?: IssueType, required: string[] = []): Field[] {
  const fields = new Map(schema.fields.map(field => [field.code, field]))
  const ordered = new Set([...required, ...common, ...(type?.fields ?? [])])
  return Array.from(ordered).flatMap(code => {
    const field = fields.get(code)
    return field && type?.fields.includes(code) ? [field] : []
  })
}

export function visibleFields(schema: Schema, issue: Issue): Field[] {
  const type = schema.item_types.find(row => row.id === issue.type)
  const process = schema.processes.find(entry => entry.id === type?.process)
  const required = process?.states.find(state => state.id === issue.state)?.require
  return fieldsFor(schema, type, required).filter(field => Object.hasOwn(issue.value_states, field.code))
}

export function isCommon(field: Field) {
  return common.includes(field.code)
}

export function provided(value: FieldValue) {
  return value != null && value !== '' && (!Array.isArray(value) || value.length > 0)
}

export function transitionInputs(schema: Schema, detail: Detail, id: string, region?: string): Field[] | undefined {
  const edge = detail.access.write && workRows(detail.transitions).find(row => row.id === id && row.region === region)
  if (!edge) return
  const kind = schema.item_types.find(type => type.id === detail.item.type)
  const process = schema.processes.find(entry => entry.id === kind?.process)
  const target = process?.states.find(state => state.id === edge.to)
  const missing = new Set([...workRows(edge.require), ...(target?.require ?? [])]
    .filter(code => !provided(detail.item.values[code])))
  return schema.fields.filter(field => missing.has(field.code) && detail.field_edit?.[field.code] !== 'field_denied'
    && (detail.field_edit?.[field.code] === 'editable' || field.transition_only))
}

export interface StatusChoice {
  edge: Transition
  reason?: string
}

function blockedReason(edge: DeclaredTransition, kind?: string) {
  if (kind === 'gate' && edge.id !== 'reject') return 'Finish the required review before moving this issue.'
  if (kind === 'parallel') return 'Complete the required workflow branches before moving this issue.'
  const when = edge.when
  if (when?.rel === 'blocks' && when.dir === 'inward' && when.where?.field === 'category'
    && when.where.op === 'nin' && when.where.value?.length === 2
    && when.where.value.includes('completed') && when.where.value.includes('canceled')) {
    if (when.q === 'some') return 'Link an open blocker to use this transition.'
    if (when.q === 'none') return 'Resolve or remove open blockers before using this transition.'
  }
  return 'The current workflow rules or destination capacity block this transition.'
}

export function statusChoices(schema: Schema, detail: Detail): StatusChoice[] {
  if (!detail.access.write) return []
  const { type, state } = detail.item
  const process = schema.processes.find(row => row.id === schema.item_types.find(kind => kind.id === type)?.process)
  const edges = workRows(detail.transitions)
  const choices: StatusChoice[] = edges.map(edge => ({ edge }))
  if (!process) return choices
  const automatic = new Set(process.states.flatMap(({ run }) => [run?.on_pass, run?.on_fail, run?.on_cancel, run?.on_exhausted]))
  const active: [region: string | undefined, state: string][] = typeof state === 'string' ? [[undefined, state]] : Object.entries(state)
  for (const [region, current] of active) {
    const kind = process.states.find(row => row.id === current)?.kind
    for (const edge of workRows(process.transitions)) {
      const internal = edge.command || edge.prepare_command || edge.people === false
        || edge.people !== true && (edge.auto || automatic.has(edge.id))
      if (internal || !edge.any && !workRows(edge.from).includes(current)
        || edges.some(candidate => candidate.id === edge.id && candidate.region === region)) continue
      choices.push({ edge: { ...edge, region }, reason: blockedReason(edge, kind) })
    }
  }
  return choices
}

export function fieldChanges(before: Values, draft: Values, allowed: string[]) {
  const values: Values = {}
  const clear: string[] = []
  for (const code of allowed) {
    const value = draft[code]
    if (JSON.stringify(value) === JSON.stringify(before[code])) continue
    if (provided(value)) values[code] = value
    else if (provided(before[code])) clear.push(code)
  }
  return { ...(Object.keys(values).length ? { values } : {}), ...(clear.length ? { clear } : {}) }
}

export class RefusedWrite extends WorkError {
  constructor(readonly finding?: { code?: string; field?: string }, status?: string) {
    super({ code: finding?.code ?? status, retryable: false }, 200)
  }
}

export function checkedWrite(result: WriteResult): WriteResult {
  const refused = result.outcomes.find(outcome => outcome.rolled_back || !['applied', 'unchanged'].includes(outcome.status))
  if (refused || !result.applied && !result.outcomes.length) {
    const failure = result.outcomes.find(outcome => outcome.findings?.length && !outcome.rolled_back) ?? refused
    throw new RefusedWrite(failure?.findings?.[0], failure?.status)
  }
  return result
}

const issueMessages: Record<string, string> = {
  required_field: 'Fill in the required field to continue.',
  field_required: 'Fill in the required field to continue.',
  when_failed: 'This issue does not meet the conditions for that move.',
  gate_release_required: 'Finish the required review before moving this issue.',
  wip_limit: 'The destination is at capacity. Move an issue out before trying again.',
  wip_limit_exceeded: 'The destination is at capacity. Move an issue out before trying again.',
  item_not_found: 'This issue is no longer available.',
  parent_required: 'Select a parent issue to continue.',
  parent_type: 'Select a parent of an eligible issue type.',
  parent_trashed: 'Select a parent that is still on the board.',
  version_mismatch: 'This issue changed while you were editing. Review the current issue before saving again.',
}

export function issueProblem(error: unknown, schema?: Schema) {
  const failure = workFailure(error)
  const code = failure.code
  const field = error instanceof RefusedWrite && schema?.fields.find(row => row.code === error.finding?.field)
  const message = code && Object.hasOwn(issueMessages, code) ? issueMessages[code]! : failure.message
  return { code, message: field ? `${field.title}. ${message}` : message }
}

export class KeyedWrite<Body extends object, Result> {
  private pending?: Body & { key: string }

  constructor(
    private readonly send: (body: Body & { key: string }) => Promise<Result>,
    private readonly key: () => string = () => crypto.randomUUID(),
  ) {}

  get uncertain() {
    return this.pending !== undefined
  }

  async submit(body: Body): Promise<Result> {
    const request = this.pending ?? Object.freeze({ ...(JSON.parse(JSON.stringify(body)) as Body), key: this.key() })
    this.pending = request
    try {
      const result = await this.send(request)
      this.pending = undefined
      return result
    } catch (error) {
      if (!(error instanceof WorkError && error.retryable)) this.pending = undefined
      throw error
    }
  }
}
