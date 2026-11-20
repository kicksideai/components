// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { ApiError } from '../../transport'
import type { Field, Query, Schema, Values } from '../../types'
export const systemFields: Field[] = [
  { code: 'key', form: 'text', index: 'key' }, { code: 'type', form: 'text', index: 'key' },
  { code: 'state', form: 'text', index: 'key' }, { code: 'category', form: 'text', index: 'key' },
  { code: 'rank', form: 'text', index: 'key' }, { code: 'parent', form: 'text', index: 'key' },
  { code: 'created_at', form: 'time', index: 'key' }, { code: 'updated_at', form: 'time', index: 'key' },
]
export type Filter = Record<string, unknown>
import { record } from '../../values'
export function filterFields(schema: Schema): Field[] {
  const states = schema.compiled.processes?.flatMap(p => p.states.map(s => ({ id: s.id, label: s.name }))) ?? []
  return [...systemFields.filter(f => f.code !== 'rank').map(f => f.code === 'state' ? { ...f, type: 'option', options: states } : f.code === 'category' ? { ...f, type: 'option', options: ['triage', 'backlog', 'unstarted', 'started', 'completed', 'canceled'].map(id => ({ id })) } : f), ...(schema.compiled.fields ?? []).filter(f => f.index && f.index !== 'none')]
}
export function operators(field?: Field): string[] {
  if (field?.cardinality && field.cardinality !== 'one') return ['has', 'in', 'nin', 'is_null', ...(field.type === 'principal' ? ['member_of'] : [])]
  const basic = ['eq', 'neq', 'in', 'nin', 'is_null', ...(field?.type === 'principal' ? ['member_of'] : [])]
  if (field && (['int', 'number', 'dec', 'time', 'quantity'].includes(field.form ?? '') || field.index === 'number')) basic.push('lt', 'lte', 'gt', 'gte', 'between')
  if (field?.form === 'text' && field.type !== 'option') basic.push('contains', 'starts_with')
  return basic
}
export function searchWhere(where: Values | undefined, search: string): Values | undefined {
  const match = search.trim()
  return match ? where ? { and: [where, { match }] } : { match } : where
}
export function parseFilter(text: string): Filter | undefined {
  if (!text.trim()) return undefined
  const parsed: unknown = JSON.parse(text)
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('where: Enter a filter object.')
  return parsed as Filter
}
export interface QueryIssue { path: string; message: string }
export function filterIssue(where: unknown, path = 'where', depth = 1): QueryIssue | undefined {
  const node = record(where)
  if (where === undefined) return undefined
  if (depth > 6) return { path, message: 'A filter nests at most six levels.' }
  if (Object.keys(node).length === 0) return { path, message: 'Choose a predicate.' }
  for (const key of ['and', 'or']) if (key in node) {
    if (Object.keys(node).length !== 1) return { path, message: 'A connective stands alone.' }
    const children = node[key]
    if (!Array.isArray(children) || !children.length) return { path: `${path}.${key}`, message: 'Add at least one condition.' }
    for (let i = 0; i < children.length; i++) { const issue = filterIssue(children[i], `${path}.${key}[${i}]`, depth + 1); if (issue) return issue }
    return undefined
  }
  if ('not' in node) return filterIssue(node.not, `${path}.not`, depth + 1)
  if ('rel' in node || 'children' in node) return node.where === undefined ? { path: `${path}.where`, message: 'Choose a nested predicate.' } : filterIssue(node.where, `${path}.where`, depth + 1)
  if ('history' in node) {
    const history = record(node.history)
    if (typeof history.field !== 'string' || !history.field) return { path: `${path}.history.field`, message: 'Choose a history field.' }
    if (history.changed !== true && ('from' in history || 'to' in history)) return { path: `${path}.history.changed`, message: 'From and to require changed.' }
    return undefined
  }
  if ('match' in node) return typeof node.match === 'string' && node.match.trim() ? undefined : { path: `${path}.match`, message: 'Enter search text.' }
  if (typeof node.field !== 'string' || !node.field) return { path: `${path}.field`, message: 'Choose a field.' }
  if (typeof node.op !== 'string') return { path: `${path}.op`, message: 'Choose an operator.' }
  if (!['eq', 'neq', 'in', 'nin', 'lt', 'lte', 'gt', 'gte', 'between', 'contains', 'starts_with', 'has', 'is_null', 'is_state', 'member_of'].includes(node.op)) return { path: `${path}.op`, message: 'Choose a supported operator.' }
  if (node.value === undefined) return { path: `${path}.value`, message: 'Enter a value.' }
  return undefined
}
export function positionedError(error: unknown, query: Query): QueryIssue {
  const message = error instanceof Error ? error.message : 'Could not validate the query.'
  const details = error instanceof ApiError ? error.details : undefined
  if (typeof details?.path === 'string') return { path: details.path, message }
  const issue = filterIssue(query.where)
  if (issue) return { path: issue.path, message }
  let path = 'query'
  function locate(value: unknown, current: string) {
    if (Array.isArray(value)) { value.forEach((child, i) => locate(child, `${current}[${i}]`)); return }
    const node = record(value)
    if (typeof node.field === 'string' && (details?.field === node.field || message.includes(node.field))) path = current
    for (const [key, child] of Object.entries(node)) if (child && typeof child === 'object') locate(child, `${current}.${key}`)
  }
  locate(query.where, 'where')
  return { path, message }
}
