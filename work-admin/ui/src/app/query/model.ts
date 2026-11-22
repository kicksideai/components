// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { Field, Schema } from '../../types'
export const systemFields: Field[] = [
  { code: 'key', form: 'text', index: 'key' }, { code: 'type', form: 'text', index: 'key' },
  { code: 'state', form: 'text', index: 'key' }, { code: 'category', form: 'text', index: 'key' },
  { code: 'rank', form: 'text', index: 'key' }, { code: 'parent', form: 'text', index: 'key' },
  { code: 'created_at', form: 'time', index: 'key' }, { code: 'updated_at', form: 'time', index: 'key' },
]
export type Filter = Record<string, unknown>
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
