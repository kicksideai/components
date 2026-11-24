// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
export type ComponentProps = Record<string, unknown>

export type TemplateKind = 'message' | 'base' | 'part'
export type ResourceKind = TemplateKind | 'asset'
export type ResourceState = 'original' | 'customized' | 'created'
export type Json = null | boolean | number | string | Json[] | { [key: string]: Json }
export type JsonObject = { [key: string]: Json }

export interface VariableSchema {
  type: 'object'
  // Mail encodes an empty object as an empty JSON array.
  properties: Record<string, JsonObject> | []
  required?: string[]
  additionalProperties?: boolean
}

export interface ResourceKey { kind: ResourceKind; name: string }

export interface PrincipalLabel { kind: string; id: string; label: string }
export interface Origin { kind: string; id: string; label: string }
export interface RecentSender { sender: string; sender_label?: PrincipalLabel; origin?: Origin; count: number }
export interface UsedBy { messages?: string[]; recent_senders?: RecentSender[] }

export interface Asset {
  source: 'original' | 'upload' | string
  filename?: string
  content_type?: string
  size?: number
  width?: number
  height?: number
  upload_id?: string
}

// The editable content of a template resource; assets carry their image instead.
export interface ResourceContent {
  kind: ResourceKind
  name: string
  title: string
  description: string
  html: string
  text: string
  base?: string
  subject?: string
  schema: VariableSchema
  samples: JsonObject | []
  asset?: Asset
}

export interface Resource extends ResourceContent {
  state: ResourceState
  origin?: string
  origin_label?: string
  revision: number
  author?: string
  author_label?: PrincipalLabel
  created_at?: number
  updated_at?: number
  used_by?: UsedBy
}

// A body-free library row from `view=summary`.
export interface LibraryRow {
  kind: ResourceKind
  name: string
  title: string
  description: string
  state: ResourceState
  revision: number
  origin?: string
  origin_label?: string
  base?: string
  author?: string
  author_label?: PrincipalLabel
  updated_at?: number
  used_by?: { messages?: number; recent_sources?: number }
}

export interface LibraryPage { items: LibraryRow[]; next_cursor?: string }

export type RevisionAction = 'created' | 'edited' | 'base_changed' | 'reset' | 'restored' | 'previous_change'

export interface Revision {
  kind: ResourceKind
  name: string
  revision: number
  version: number
  action: RevisionAction
  state: ResourceState
  restored_from?: number
  content: ResourceContent
  author: string
  author_label?: PrincipalLabel
  note?: string
  created_at: number
}

export interface Items<T> { items: T[] }

export interface Capabilities { send: boolean; edit_library: boolean; administer_delivery: boolean }

export interface DraftRender { subject?: string; html?: string; text?: string; inline_assets?: Record<string, string> }

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
  sender_label?: PrincipalLabel
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

export interface MessagePage { items: LogMessage[]; next_cursor?: string; has_more: boolean; total?: number; failed_today?: number }
export interface SendReceipt { message_id: string; status: MessageStatus }

export interface DeliveryStatus {
  configured: boolean
  driver?: { id: string; label: string }
  from?: { address: string; name?: string }
  reply_to?: string
  reason?: string
}
