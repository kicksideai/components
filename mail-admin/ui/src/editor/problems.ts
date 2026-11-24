// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { ApiError, errorCode } from '../api'
import type { ResourceKey } from '../types'

export type Face = 'html' | 'text' | 'subject' | 'variables' | 'samples'

// A template problem as the engine reports it: the resource and face it belongs to and its message.
// The engine gives no line or column, so the problem is shown under its face.
export interface Problem {
  // Mail's sentence, and the template engine's own message when Mail passes it on.
  message: string
  engine?: string
  face?: Face
  resource?: ResourceKey
  dependents?: string[]
  // The message the preview rendered when the problem appeared.
  previewOf?: string
  // Each failing message with the engine's message for it.
  reasons?: { name: string; message: string }[]
  // The resources the failed render used, one of which holds the problem: its message, base and changed resources.
  candidates?: ResourceKey[]
}

const faces: readonly Face[] = ['html', 'text', 'subject', 'variables', 'samples']

function isKey(value: unknown): value is ResourceKey {
  return !!value && typeof value === 'object' && typeof (value as ResourceKey).kind === 'string' && typeof (value as ResourceKey).name === 'string'
}

export function problemOf(error: unknown): Problem | undefined {
  if (!(error instanceof ApiError)) return undefined
  const details = error.details ?? {}
  const code = errorCode(error)
  if (code === 'mail_resource_in_use') {
    const messages = Array.isArray(details.messages) ? details.messages.filter((name): name is string => typeof name === 'string') : []
    const dependent = details.dependent as Record<string, unknown> | undefined
    return {
      message: error.message,
      dependents: messages,
      face: faces.find(face => face === dependent?.face),
      resource: isKey(dependent?.resource) ? dependent.resource : undefined,
    }
  }
  const face = faces.find(candidate => candidate === details.face)
  if (!face) return undefined
  // A save checks every message the change reaches; the server names each one that fails.
  const dependents = Array.isArray(details.dependent_messages)
    ? details.dependent_messages.filter((name): name is string => typeof name === 'string') : []
  const reasons = Array.isArray(details.errors) ? details.errors.flatMap(entry => {
    const item = entry as Record<string, unknown>
    return isKey(item.resource) && typeof item.message === 'string' ? [{ name: item.resource.name, message: item.message }] : []
  }) : []
  const candidates = Array.isArray(details.candidate_resources) ? details.candidate_resources.filter(isKey) : []
  const engine = typeof details.engine_message === 'string' ? details.engine_message : undefined
  return { message: error.message, engine, face, resource: isKey(details.resource) ? details.resource : undefined,
    dependents: dependents.length ? dependents : undefined, reasons: reasons.length ? reasons : undefined,
    candidates: candidates.length ? candidates : undefined }
}

export const faceLabels: Record<Face, string> = {
  html: 'HTML', text: 'Plain text', subject: 'Subject', variables: 'Variables', samples: 'Sample values',
}
