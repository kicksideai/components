// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { on } from '@wippy-fe/proxy'
import { onBeforeUnmount } from 'vue'
import type { ResourceKind, MessageStatus } from './types'

export interface LibraryChange { kind: ResourceKind; name: string; revision: number }
export interface MessageChange { message_id: string; status: MessageStatus }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function payload(message: unknown): Record<string, unknown> {
  if (!isRecord(message)) return {}
  return isRecord(message.data) ? message.data : message
}

export function libraryChange(message: unknown): LibraryChange | undefined {
  const data = payload(message)
  if ((data.kind === 'message' || data.kind === 'base' || data.kind === 'part') && typeof data.name === 'string' && typeof data.revision === 'number') {
    return { kind: data.kind, name: data.name, revision: data.revision }
  }
}

export function messageChange(message: unknown): MessageChange | undefined {
  const data = payload(message)
  if (typeof data.message_id === 'string' && (data.status === 'queued' || data.status === 'sent' || data.status === 'failed')) {
    return { message_id: data.message_id, status: data.status }
  }
}

// Mail announces each change as a wakeup; the subscriber refetches through the HTTP API, which applies access.
export function useLibraryChanges(handler: (change: LibraryChange) => void): void {
  const off = on('mail.library.changed', (message: unknown) => {
    const change = libraryChange(message)
    if (change) handler(change)
  })
  onBeforeUnmount(() => { if (typeof off === 'function') off() })
}

export function useMessageChanges(handler: (change: MessageChange) => void): void {
  const off = on('mail.message.changed', (message: unknown) => {
    const change = messageChange(message)
    if (change) handler(change)
  })
  onBeforeUnmount(() => { if (typeof off === 'function') off() })
}
