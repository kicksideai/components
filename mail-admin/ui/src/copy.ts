// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { ApiError, errorCode } from './api'
import type { MessageStatus, Origin, PreviewWarning, PrincipalLabel, ResourceKind, RevisionAction } from './types'

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
  mail_projection_failed: 'Email could not switch to this version, so nothing was saved. Try again in a moment.',
  duplicate_template_name: 'Two installed modules include a resource with this name. Ask an administrator to remove one of them.',
  mail_resource_collision: 'An installed module now includes a resource with this name. Rename yours to keep both.',
  invalid_mail_asset: 'Use a PNG, JPEG or GIF image of 1 MB or less.',
  mail_resource_in_use: 'Messages still use this resource. Remove it from them first.',
  invalid_config: 'Mail delivery is not set up yet. Ask an administrator to set it up.',
  from_name_invalid: 'The sender name in the delivery settings cannot be used in email. Correct it in Settings → Mail.',
  invalid_request: 'This is more than Mail accepts in one go. Shorten what you entered and try again.',
  invalid_mail_filter: 'Mail could not use this search or filter. Clear the search and try again.',
  invalid_mail_resource: 'Something in this resource is missing or too long. A reference takes up to 128 characters, a name or description 4,096, and each source 64 KB.',
  invalid_revision_note: 'Keep the note for History under 4,096 characters.',
  invalid_mail_resources: 'Mail could not read this draft. Reload the page and try again.',
  invalid_mail_draft: 'Mail could not read this draft. Reload the page and try again.',
  invalid_mail_revision: 'That version is not in History any more. Reload History and try again.',
  invalid_template_vars: 'The sample values are larger than Mail accepts. Keep them under 64 KB.',
  html_too_large: 'The email’s HTML is larger than Mail can send. Keep it under 256 KB.',
  text_too_large: 'The email’s plain text is larger than Mail can send. Keep it under 256 KB.',
  invalid_subject: 'The subject has a line break or a character email cannot carry. Remove it and try again.',
  invalid_content_id: 'An attachment shown inside the email is not attached as an inline image.',
  attachment_empty: 'An attachment is empty. Attach the file again.',
  incomplete_attachment: 'An attachment changed while the message was being sent. Send it again.',
  message_too_large: 'The message with its attachments is larger than the delivery service accepts.',
  upload_still_processing: 'The image is still being processed. Mail adds it as soon as it is ready.',
}

// What a delivery failure means for someone who can change the delivery settings: what happened and what to do.
// Other people read the neutral text Mail stores for them.
export function deliveryFailure(code: string, service: string, where = 'in Settings → Mail'): { lead: string; next: string } | undefined {
  switch (code) {
    case 'credentials_invalid': return { lead: `${service} refused the credentials.`, next: `Check the API key ${where}, save, and send again.` }
    case 'authorization_refused': return { lead: `${service} refused to send for this account.`, next: `Check the API key’s sending permission and the account’s credits with ${service}.` }
    case 'sender_or_recipient_not_allowed': return { lead: `${service} did not accept the sender or a recipient.`, next: `Verify the From address’s domain with ${service}, or check its restrictions on recipients.` }
    case 'request_rejected': return { lead: `${service} rejected the request.`, next: `Check the API key and the From address ${where}.` }
    case 'quota_exhausted': return { lead: `${service} reports the sending quota is used up.`, next: `Sending resumes when the quota renews, or after the plan changes with ${service}.` }
    case 'rate_limited': return { lead: `${service} is limiting how fast mail is sent.`, next: 'Mail tries again on its own.' }
    case 'message_rejected': return { lead: `${service} rejected the message itself.`, next: 'Check the recipients, the subject and the attachments.' }
    case 'invalid_config': case 'settings_read_failed': case 'provider_endpoint_invalid': case 'driver_availability_invalid':
      return { lead: 'The delivery settings are not complete.', next: `Check the settings ${where}, save, and send again.` }
    case 'from_name_invalid': return { lead: 'The sender name cannot be used in email.', next: `Correct the From name ${where}.` }
    default: return undefined
  }
}

// Failures that come from the delivery settings or the account with the service: sending the same message again
// fails the same way until something changes there. Mail does not report this itself (see the README).
export const fixedOutsideMail = new Set(['invalid_config', 'settings_read_failed', 'invalid_driver_descriptor', 'duplicate_driver_id',
  'driver_availability_invalid', 'provider_endpoint_invalid', 'credentials_invalid', 'authorization_refused', 'sender_or_recipient_not_allowed',
  'from_name_invalid'])

export function describe(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError) || error.status === undefined) return `${fallback} Check your connection and try again.`
  const code = errorCode(error)
  if (code && errorCopy[code]) return errorCopy[code]
  if (error.status === 403) return errorCopy.mail_library_denied
  if (error.status >= 500) return `${fallback} Try again in a moment.`
  return error.message || fallback
}

// A preview warning in product words, with the sizes Mail measured.
export function warningText(warning: PreviewWarning): string {
  if (warning.code === 'gmail_html_clipping' && warning.bytes && warning.threshold_bytes) {
    return `Gmail may clip this email: its HTML is ${bytes(warning.bytes)}, above Gmail’s ${bytes(warning.threshold_bytes)}. Readers then see only the start until they open the rest.`
  }
  return warning.message
}

export function slug(title: string): string {
  return title.trim().toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64)
}

export const namePattern = /^[a-z0-9][a-z0-9_-]*$/
