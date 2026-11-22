// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { humanLabel } from './shared/labels'
import type { AttributeDecl, SchemaView, Width } from './types'

export const FIELD_WIDTHS: { value: Width; label: string; span: number }[] = [
  { value: 'quarter', label: '¼', span: 3 },
  { value: 'third', label: '⅓', span: 4 },
  { value: 'half', label: '½', span: 6 },
  { value: 'full', label: '1', span: 12 },
]
export function fieldWidth(schema: SchemaView, namespace: string, attribute: AttributeDecl): Width {
  return attribute.width ?? schema.attributes[namespace + '.' + attribute.code]?.width ?? 'half'
}

export const when = (at: string): string => new Date(at).toLocaleString()

export type Dec = { m: number; e: number }
export function decimalText(d: Dec): string {
  const digits = Math.abs(d.m).toString()
  const sign = d.m < 0 ? '-' : ''
  if (d.e >= 0) return sign + digits + '0'.repeat(d.e)
  const scale = -d.e
  const padded = digits.padStart(scale + 1, '0')
  return sign + padded.slice(0, padded.length - scale) + '.' + padded.slice(padded.length - scale)
}

// humanize turns an attribute or term code into a label: "net_weight" -> "Net weight".
export function humanize(code: string): string {
  const last = code.includes('.') ? code.slice(code.indexOf('.') + 1) : code
  const words = last.replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').trim()
  return words ? words[0].toUpperCase() + words.slice(1) : code
}

export function configFieldLabel(schema: Record<string, unknown>, field: string): string {
  const properties = schema.properties as Record<string, { title?: string }> | undefined
  return humanLabel(properties?.[field]?.title, humanLabel(humanize(field), 'This setting'))
}

export function termLabel(term: { code: string; labels: Record<string, string> }): string {
  return term.labels.en ?? Object.values(term.labels)[0] ?? term.code
}

// display renders a canonical value for a cell or a history row.
export function display(v: unknown, terms?: Record<string, { code: string; labels: Record<string, string> }[]>): string {
  if (v === null || v === undefined) return ''
  const one = (x: unknown): string => {
    if (x === null || x === undefined) return ''
    if (typeof x === 'object' && 'ref' in (x as { ref: [string, string] })) {
      const r = x as { ref: [string, string] }
      if (r.ref[0] === 'term') {
        const code = r.ref[1].slice(r.ref[1].indexOf(':') + 1)
        const vocabulary = r.ref[1].slice(0, r.ref[1].indexOf(':'))
        const t = terms?.[vocabulary]?.find((t) => t.code === code)
        return t ? termLabel(t) : code
      }
      return 'Linked ' + humanize(r.ref[0]).toLocaleLowerCase()
    }
    if (typeof x === 'object' && 'v' in (x as { v: Dec; u: string })) { const q = x as { v: Dec; u: string }; return decimalText(q.v) + ' ' + q.u }
    if (typeof x === 'object' && 'm' in (x as Dec)) return decimalText(x as Dec)
    if (typeof x === 'boolean') return x ? 'Yes' : 'No'
    if (typeof x === 'object') return JSON.stringify(x)
    return humanLabel(String(x), 'Linked record')
  }
  if (Array.isArray(v)) return v.map(one).join(', ')
  return one(v)
}

export function attributeChange(name: string, beforeValue: unknown, afterValue: unknown): string {
  const before = display(beforeValue)
  const after = display(afterValue)
  if (!after && before) return `${name} cleared (was ${before})`
  return before ? `${name}: ${before} → ${after}` : `${name} set to ${after}`
}
