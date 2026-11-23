// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { WorkError } from './client'

const messages: Record<string, string> = {
  board_creation_denied: 'Creating a board requires Work administration.',
  key_prefix_taken: 'That key prefix is in use. Choose another prefix.',
  gate_release_required: 'This issue stays in review until the required approvals and conditions are met.',
  conflict: 'This issue changed while you were working. Review the latest version and try again.',
  version_conflict: 'This issue changed while you were working. Review the latest version and try again.',
  when_failed: 'This issue does not meet the conditions for that move.',
  permission_denied: 'You do not have permission to make this change.',
  not_found: 'That work item is no longer available.',
  plugin_projection_gap: 'Work is updating this view. Try refreshing in a moment.',
}

export function workFailure(error: unknown): { message: string, code?: string } {
  const rawCode = error instanceof WorkError ? error.code : undefined
  const code = rawCode && /^[a-zA-Z0-9_]+$/.test(rawCode) ? rawCode : undefined
  const label = code && Object.hasOwn(messages, code) ? messages[code] : undefined
  return {
    message: label || (error instanceof Error && error.message) || 'Could not complete this action. Try again.',
    code,
  }
}
