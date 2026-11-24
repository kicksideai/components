// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { humanize } from '../../forms'
import { record } from '../../values'
export interface ConfigField { key: string; title: string; description: string; required: boolean; schema: Record<string, unknown> }
export function configFields(schema: Record<string, unknown>): ConfigField[] {
  return Object.entries(record(schema.properties)).map(([key, raw]) => {
    const field = record(raw)
    return { key, title: typeof field.title === 'string' && field.title.trim() ? field.title : humanize(key), description: typeof field.description === 'string' ? field.description : '', required: Array.isArray(schema.required) && schema.required.includes(key), schema: field }
  })
}
export interface FormValidity { valid: boolean; errors: Record<string, string> }
// The first field message in schema order, named by the field title.
export function firstConfigError(schema: Record<string, unknown>, errors: Record<string, string>): string {
  const field = configFields(schema).find(entry => errors[entry.key])
  return field ? field.title + ': ' + errors[field.key] : ''
}
export function eventDetail<T>(event: Event): T { return (event as CustomEvent<T>).detail }
