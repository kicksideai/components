// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { get, post } from './transport'
import type { BoardRow, Declaration, AdminOptions, Schema, GetResult, Query, QueryResult } from './types'
import type { Pack, PackSelection } from './packs'
const BASE = '/api/v1/work'
const board = (id: string) => `${BASE}/boards/${encodeURIComponent(id)}`
export const work = {
  boards: async (): Promise<BoardRow[]> => {
    const boards: BoardRow[] = []
    let after: number | undefined
    do {
      const page = await get<{ boards: BoardRow[]; next?: number }>(`${BASE}/boards${after ? '?after=' + encodeURIComponent(after) : ''}`, 'Boards')
      boards.push(...page.boards); after = page.next
    } while (after)
    return boards
  },
  packs: () => get<{ packs: Pack[] }>(`${BASE}/packs`, 'Packs').then(r => r.packs),
  createBoard: (title: string, declaration: Declaration, key: string, selection: PackSelection = {}) => post<{ board_id: string }>(`${BASE}/boards`, { title, declaration, idempotency_key: key, ...selection }, 'Create board'),
  updateBoard: (id: string, changes: { title?: string; description?: string; icon?: string }) => post<{ board_id: string; status: 'updated' | 'unchanged' }>(`${board(id)}/update`, changes, 'Update board'),
  schema: (id: string, generation?: number, checkPlugins?: boolean) => post<Schema>(`${board(id)}/get_schema`, { generation, ...(checkPlugins ? { check_plugins: true } : {}) }, 'Schema'),
  // Typed operands in conditions and transition assignments can select an item.
  query: (id: string, query: Query) => post<QueryResult>(`${board(id)}/query`, query, 'Item choices'),
  item: (id: string, item: { id?: string; key?: string }) => post<GetResult>(`${board(id)}/get`, { item }, 'Item choice'),
  options: (id: string) => get<AdminOptions>(`/api/v1/work-admin/boards/${encodeURIComponent(id)}/options`, 'Configuration options'),
}
