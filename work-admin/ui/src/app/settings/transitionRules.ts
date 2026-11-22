// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { display, fieldTitle, humanize } from '../../forms'
import type { Declaration, InstalledRule, Process, Transition } from '../../types'
import { record } from '../../values'
import { categoryTitle } from './process'

const list = new Intl.ListFormat('en', { type: 'conjunction' })
const alternatives = new Intl.ListFormat('en', { type: 'disjunction' })
const comparisons: Record<string, string> = {
  eq: 'is', neq: 'is different from', in: 'is one of', nin: 'is none of',
  lt: 'is less than', lte: 'is at most', gt: 'is greater than', gte: 'is at least',
  between: 'is between', has: 'includes', contains: 'contains', starts_with: 'starts with',
  member_of: 'belongs to',
}
const quantifiers: Record<string, string> = { some: 'At least one', every: 'Every', none: 'No' }

function fieldName(code: string, draft: Declaration) {
  const field = draft.fields?.find(field => field.code === code)
  return field ? fieldTitle(field) : humanize(code)
}

function operand(value: unknown, code: string, draft: Declaration): string {
  if (Array.isArray(value)) return list.format(value.map(item => operand(item, code, draft)))
  if (code === 'category' && typeof value === 'string') return categoryTitle(value)
  if (code === 'state' && typeof value === 'string') {
    return draft.processes?.flatMap(process => process.states).find(state => state.id === value)?.name || humanize(value)
  }
  if ('$actor' in record(value)) return 'the person moving the item'
  if ('$now' in record(value)) return 'the current time'
  return display(value, draft.fields?.find(field => field.code === code))
}

function trackerBlockerRule(node: Record<string, unknown>) {
  const where = record(node.where)
  if (node.rel !== 'blocks' || node.dir !== 'inward' || where.field !== 'category' ||
      where.op !== 'nin' || !Array.isArray(where.value) || where.value.length !== 2 ||
      !where.value.includes('completed') || !where.value.includes('canceled')) return
  if (node.q === 'none') return 'Requires all blockers to be resolved.'
  if (node.q === 'some') return 'Requires an open blocker.'
}

function condition(value: unknown, draft: Declaration): string {
  const node = record(value)
  const nested = (values: unknown[]) => values.map(item => condition(item, draft))
  const relation = draft.relation_types?.find(relation => relation.id === node.rel)
  if (Array.isArray(node.and) && node.and.length) return `(${list.format(nested(node.and))})`
  if (Array.isArray(node.or) && node.or.length) return `(${alternatives.format(nested(node.or))})`
  if (node.not) return `this condition is false (${condition(node.not, draft)})`
  if (typeof node.match === 'string' && node.match.trim()) return `the item matches “${node.match}”`
  if (typeof node.rel === 'string' || node.children) {
    const direction = node.dir === 'inward' && !relation?.symmetric ? relation?.inward : relation?.outward
    const items = node.children ? 'child item' : `item linked as “${direction || humanize(String(node.rel))}”`
    return `${quantifiers[String(node.q)] ?? 'At least one'} ${items} matches (${condition(node.where, draft)})`
  }
  if (node.history) {
    const history = record(node.history)
    if (typeof history.field !== 'string') return 'a value history condition'
    const field = fieldName(history.field, draft)
    const value = (input: unknown) => operand(input, String(history.field), draft)
    const dates = Array.isArray(history.during) ? ` during ${list.format(history.during.map(date => String(date)))}` : ''
    if (history.changed === true) {
      const from = history.from === undefined ? '' : ` from ${value(history.from)}`
      const to = history.to === undefined ? '' : ` to ${value(history.to)}`
      return `${field} changed${from}${to}${dates}`
    }
    if (history.was !== undefined) return `${field} was ${value(history.was)}${dates}`
    return `a change in the history of ${field}${dates}`
  }
  if (typeof node.field === 'string') {
    const field = fieldName(node.field, draft)
    if (node.op === 'is_null') return `${field} is ${node.value === false ? 'filled' : 'empty'}`
    if (node.op === 'is_state') {
      const state = { absent: 'has never been filled', cleared: 'was cleared', provided: 'has a value' }[String(node.value)]
      if (state) return `${field} ${state}`
    }
    const comparison = comparisons[String(node.op)]
    if (comparison && node.value !== undefined) return `${field} ${comparison} ${operand(node.value, node.field, draft)}`
    return `a condition on ${field}`
  }
  return 'a custom condition'
}

export function transitionRules(transition: Transition, process: Process, draft: Declaration, guards: InstalledRule[] = []): string[] {
  const rules: string[] = []
  const destination = process.states.find(state => state.id === transition.to)
  const required = [...new Set([...(transition.require ?? []), ...(destination?.require ?? [])])]
  if (required.length) rules.push(`Required: ${required.map(code => fieldName(code, draft)).join(', ')}`)
  if (transition.when != null) {
    rules.push(trackerBlockerRule(record(transition.when)) ?? `Only when ${condition(transition.when, draft)}`)
  }
  for (const id of transition.guards ?? []) {
    const check = guards.find(guard => guard.id === id)
    rules.push(check ? `Requires the “${check.title}” check to pass` : 'Requires an unavailable check to pass')
  }
  return rules
}
