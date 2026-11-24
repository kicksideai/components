// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { ApiError, errorCode } from './api'
import type { MessageStatus, Origin, PrincipalLabel, ResourceKind, RevisionAction } from './types'

export const kindLabels: Record<ResourceKind, string> = { message: 'Message', base: 'Base template', part: 'Part', asset: 'Image' }
export const kindPlurals: Record<ResourceKind, string> = { message: 'Messages', base: 'Base templates', part: 'Parts', asset: 'Images' }
export const kindIcons: Record<ResourceKind, string> = { message: 'tabler:mail', base: 'tabler:layout', part: 'tabler:puzzle', asset: 'tabler:photo' }

export const actionLabels: Record<RevisionAction, string> = {
  created: 'Created', edited: 'Edited', base_changed: 'Base template changed', reset: 'Reset to the original',
  restored: 'Restored', previous_change: 'Changed',
}

export function personLabel(label: PrincipalLabel | undefined, id?: string): string {
  return label?.label ?? id ?? ''
}

export function bytes(size: number | undefined): string {
  if (size === undefined) return ''
  if (size < 1024) return `${size} B`
  return size < 1024 * 1024 ? `${Math.round(size / 1024)} KB` : `${(size / 1024 / 1024).toFixed(1)} MB`
}

export const statusLabels: Record<MessageStatus, string> = { queued: 'Pending', sent: 'Sent', failed: 'Failed' }
export const statusSeverity: Record<MessageStatus, 'secondary' | 'success' | 'danger'> = { queued: 'secondary', sent: 'success', failed: 'danger' }

// Every origin Mail records. An origin of a kind not listed here is named by its label alone.
const originKinds: Record<string, string> = {
  workflow: 'Workflow', automation: 'Automation', test: 'Test send', resend: 'Sent again',
}

export function originText(origin: Origin | undefined): string {
  if (!origin) return ''
  const kind = originKinds[origin.kind]
  if (!kind) return origin.label
  if (origin.kind === 'test' || origin.kind === 'resend') return kind
  return origin.label ? `${kind} · ${origin.label}` : kind
}

const day = 24 * 60 * 60 * 1000
const dateFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })
const dateYearFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
const timeFormat = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' })
const fullFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })

function startOfDay(at: number): number {
  const date = new Date(at)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

export function shortDate(at: number | undefined, now = Date.now()): string {
  if (!at) return '—'
  const today = startOfDay(now)
  if (at >= today) return 'Today'
  if (at >= today - day) return 'Yesterday'
  return new Date(at).getFullYear() === new Date(now).getFullYear() ? dateFormat.format(at) : dateYearFormat.format(at)
}

export function onDate(at: number | undefined, now = Date.now()): string {
  const date = shortDate(at, now)
  return date === 'Today' || date === 'Yesterday' ? date.toLowerCase() : 'on ' + date
}

export function when(at: number, now = Date.now()): string {
  const today = startOfDay(now)
  if (at >= today) return timeFormat.format(at)
  if (at >= today - day) return 'Yesterday'
  return new Date(at).getFullYear() === new Date(now).getFullYear() ? dateFormat.format(at) : dateYearFormat.format(at)
}

export function fullDate(at: number | undefined): string {
  return at ? fullFormat.format(at) : '—'
}

export function todayStart(now = Date.now()): number { return startOfDay(now) }

export function recipients(to: readonly string[]): string {
  if (!to.length) return ''
  return to.length === 1 ? `To ${to[0]}` : `To ${to[0]} +${to.length - 1}`
}

export function plural(count: number, one: string, many = one + 's'): string {
  return `${count} ${count === 1 ? one : many}`
}

const errorCopy: Record<string, string> = {
  mail_revision_conflict: 'Someone saved this resource while you were looking at it. The latest version is shown now; review it and try again.',
  mail_resource_not_found: 'This resource no longer exists.',
  mail_revision_not_found: 'That version is no longer in History.',
  mail_resource_is_shipped: 'An included resource cannot be deleted. Reset it to the original instead.',
  mail_resource_not_customized: 'This resource already matches the original.',
  mail_library_denied: 'Ask an administrator to grant you access to the mail library.',
  mail_delivery_denied: 'Ask an administrator to grant you access to mail delivery.',
  mail_send_denied: 'Ask an administrator to grant you permission to send mail.',
  mail_content_unavailable: 'This message can no longer be sent again because its content was not kept.',
  mail_projection_failed: 'The change was saved, but email is still using the previous version. Try again in a moment.',
  duplicate_template_name: 'Two installed modules include a resource with this name. Ask an administrator to remove one of them.',
  mail_resource_collision: 'An installed module now includes a resource with this name. Rename yours to keep both.',
  invalid_mail_asset: 'Use a PNG, JPEG or GIF image of 1 MB or less.',
  mail_resource_in_use: 'Messages still use this resource. Remove it from them first.',
  invalid_config: 'Mail delivery is not set up yet. Ask an administrator to set it up.',
}

export function describe(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError) || error.status === undefined) return `${fallback} Check your connection and try again.`
  const code = errorCode(error)
  if (code && errorCopy[code]) return errorCopy[code]
  if (error.status === 403) return errorCopy.mail_library_denied
  if (error.status >= 500) return `${fallback} Try again in a moment.`
  return error.message || fallback
}

export function slug(title: string): string {
  return title.trim().toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64)
}

export const namePattern = /^[a-z0-9][a-z0-9_-]*$/
