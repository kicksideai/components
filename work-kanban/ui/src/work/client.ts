// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { BoardPage, BoardSchema, CreateBoardRequest, CreateBoardResult, PackCatalog } from './types'

const base = '/api/v1/work'
export const kanbanPack = 'kickside.work.kanban:pack'
export const kanbanUiApp = 'kickside.work.kanban:board_app'
export const planningPlugin = 'kickside.work.planning:plugin'
export const searchPlugin = 'kickside.work_search:plugin'

type Request = (options: { method: 'get' | 'post', url: string, data?: unknown }) => Promise<{ data: unknown }>

interface Failure {
  code?: string
  kind?: string
  retryable?: boolean
  details?: { code?: string, retryable?: boolean }
}

export class WorkError extends Error {
  readonly code?: string
  readonly retryable: boolean

  constructor(body?: Failure, readonly status?: number) {
    super(status === 403 ? 'You do not have access to do that.'
      : status === 404 ? 'That board or issue is no longer available.'
      : status ? 'Work could not complete the request. Try again.'
      : 'Could not reach Work. Check your connection and try again.')
    this.name = 'WorkError'
    this.code = body?.code ?? body?.details?.code ?? body?.kind
    this.retryable = body?.retryable ?? body?.details?.retryable ?? (status === undefined || status >= 500)
  }
}

export function isAccessLoss(error: unknown): boolean {
  return error instanceof WorkError && [401, 403, 404].includes(error.status ?? 0)
}

export function newBoardRequest(title: string, prefix: string, version: string, key: string): CreateBoardRequest {
  const keyPrefix = prefix.trim()
  return {
    title: title.trim(),
    pack: kanbanPack,
    version,
    starter: false,
    idempotency_key: key,
    plugin_configs: { [planningPlugin]: { issue_types: ['epic', 'story', 'task', 'bug', 'sub_task'] } },
    ...(keyPrefix ? { declaration: { key_prefix: keyPrefix } } : {}),
  }
}

export function createWorkClient(request: Request) {
  async function read<T>(method: 'get' | 'post', url: string, data?: unknown): Promise<T> {
    let response: { data: unknown }
    try {
      response = await request(data === undefined ? { method, url } : { method, url, data })
    } catch (error) {
      const reply = (error as { response?: { status?: number, data?: Failure } } | undefined)?.response
      throw new WorkError(reply?.data, reply?.status)
    }
    const body = response.data as (Failure & { success?: boolean, data?: T }) | undefined
    if (body?.success !== true || body.data === undefined) throw new WorkError(body, 200)
    return body.data
  }

  function boardRead<T>(board: string, operation: string, body: unknown = {}): Promise<T> {
    return read<T>('post', `${base}/boards/${encodeURIComponent(board)}/${operation}`, body)
  }

  return {
    boards(after?: number): Promise<BoardPage> {
      const scope = `ui_app=${encodeURIComponent(kanbanUiApp)}&include_counts=false&limit=50`
      const continuation = after === undefined ? '' : '&after=' + encodeURIComponent(after)
      return read('get', `${base}/boards?${scope}${continuation}`)
    },
    packs: () => read<PackCatalog>('get', `${base}/packs`),
    createBoard: (body: CreateBoardRequest) => read<CreateBoardResult>('post', `${base}/boards`, body),
    schema: (board: string) => boardRead<BoardSchema>(board, 'get_schema', { include_extensions: true }),
    boardRead,
    runView: <T>(id: string, body: unknown) => read<T>('post', `${base}/views/${encodeURIComponent(id)}/run`, body),
  }
}

export type WorkClient = ReturnType<typeof createWorkClient>
