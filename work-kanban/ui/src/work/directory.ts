// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { BoardOption, BoardPage } from './types'

export class BoardDirectory {
  private readonly rows = new Map<string, BoardOption>()
  private readonly cursors = new Set<number>()
  private pending?: Promise<void>
  private next?: number
  private started = false

  constructor(private readonly page: (after?: number) => Promise<BoardPage>) {}

  get boards(): BoardOption[] {
    return Array.from(this.rows.values())
  }

  get hasMore(): boolean {
    return !this.started || this.next !== undefined
  }

  remove(id: string) {
    this.rows.delete(id)
  }

  loadMore(): Promise<void> {
    if (this.pending) return this.pending
    if (!this.hasMore) return Promise.resolve()
    this.pending = this.page(this.next).then(({ boards, next }) => {
      if (next !== undefined && this.cursors.has(next)) throw new Error('Work returned a repeated board page. Try again.')
      for (const board of boards) {
        if (board.access.read) this.rows.set(board.board_id, board)
        else this.rows.delete(board.board_id)
      }
      if (next !== undefined) this.cursors.add(next)
      this.next = next
      this.started = true
    }).finally(() => { this.pending = undefined })
    return this.pending
  }

  async resolve(id?: string): Promise<BoardOption | undefined> {
    if (!this.started) await this.loadMore()
    if (id === undefined) return this.boards[0]
    while (!this.rows.has(id) && this.hasMore) await this.loadMore()
    return this.rows.get(id)
  }
}
