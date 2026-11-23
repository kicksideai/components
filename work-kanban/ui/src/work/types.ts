// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
export interface BoardAccess {
  read: boolean
  write: boolean
  delete: boolean
  admin: boolean
}

export interface BoardOption {
  board_id: string
  title: string
  key_prefix?: string
  status?: string
  access: BoardAccess
}

export interface BoardPage {
  boards: BoardOption[]
  next?: number
}

export interface WorkFinding {
  code?: string
  message?: string
}

export interface PackSummary {
  id: string
  title: string
  version: string
  problem?: WorkFinding
  plugins?: { plugin: string, installed: boolean, problem?: WorkFinding }[]
}

export interface PackCatalog {
  packs: PackSummary[]
  can_create_board: boolean
}

export interface BoardSchema {
  as_of: number
  generation: number
  key_prefix: string
  compiled: Record<string, unknown>
  declaration: Record<string, unknown>
  plugins?: { plugin: string, active: boolean, lifecycle?: { state: string } }[]
  extensions?: WorkExtension[]
  pack?: { id: string, version: string }
}

export interface WorkExtension {
  id: string
  slot: 'card_badge' | 'drawer_panel' | 'filter' | 'board_panel'
  tag?: string
  title: string
  order: number
  access: 'read' | 'write' | 'delete' | 'admin'
  plugin: string
  target: string
}

export interface CreateBoardRequest {
  idempotency_key: string
  title: string
  pack: string
  version: string
  starter: false
  plugin_configs: Record<string, { issue_types: string[] }>
  declaration?: { key_prefix: string }
}

export interface CreateBoardResult {
  board_id: string
  title: string
  generation?: number
  replayed: boolean
}
