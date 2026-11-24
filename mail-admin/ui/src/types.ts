// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
export type ComponentProps = Record<string, unknown>

export type ResourceKind = 'message' | 'base' | 'part'
export type ResourceState = 'original' | 'customized' | 'created'
export type Json = null | boolean | number | string | Json[] | { [key: string]: Json }
export type JsonObject = { [key: string]: Json }

export interface VariableSchema {
  type: 'object'
  properties: Record<string, JsonObject>
  required?: string[]
  additionalProperties?: boolean
}

export interface ResourceKey { kind: ResourceKind; name: string }

export interface Origin { kind: string; id: string; label: string }
export interface RecentSender { sender: string; origin?: Origin; count: number }
export interface UsedBy { messages?: string[]; recent_senders?: RecentSender[] }

export interface ResourceContent extends ResourceKey {
  title: string
  description: string
  html: string
  text: string
  base?: string
  subject?: string
  schema: VariableSchema
  samples: JsonObject
}

export interface Resource extends ResourceContent {
  state: ResourceState
  origin?: string
  revision: number
  author?: string
  created_at?: number
  updated_at?: number
  used_by?: UsedBy
}

export interface Revision {
  kind: ResourceKind
  name: string
  revision: number
  content: ResourceContent
  author: string
  note?: string
  created_at: number
}

export interface Items<T> { items: T[] }

export type MessageStatus = 'queued' | 'sent' | 'failed'

export interface MessageError { kind: string; code: string; message: string; provider_detail?: string }
export interface AttachmentRef { upload_id: string; filename?: string; disposition?: string; content_id?: string }

export interface LogMessage {
  message_id: string
  status: MessageStatus
  created_at: number
  attempts: number
  next_attempt_at?: number
  sent_at?: number
  finished_at?: number
  sender: string
  template?: string
  subject: string
  reply_to?: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  attachments: AttachmentRef[]
  driver_id?: string
  origin?: Origin
  provider_message_id?: string
  last_error?: MessageError
  resend_of?: string
  can_resend?: boolean
}

export interface MessagePage { items: LogMessage[]; next_cursor?: string; has_more: boolean }
export interface SendReceipt { message_id: string; status: MessageStatus }

export interface DeliveryStatus {
  configured: boolean
  driver?: { id: string; label: string }
  from?: { address: string; name?: string }
  reply_to?: string
  reason?: string
}
