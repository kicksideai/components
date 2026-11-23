// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { kanbanPack, newBoardRequest, WorkError } from '../work/client'
import type { CreateBoardRequest, CreateBoardResult, PackCatalog, PackSummary } from '../work/types'

export interface BoardCreationReadiness {
  pack?: PackSummary
  enabled: boolean
  message?: string
}

export class BoardCreation {
  private readiness: BoardCreationReadiness = { enabled: false }
  private request?: CreateBoardRequest

  constructor(
    private readonly create: (request: CreateBoardRequest) => Promise<CreateBoardResult>,
    private readonly key: () => string,
  ) {}

  get awaitingConfirmation(): boolean {
    return this.request !== undefined
  }

  configure(catalog: PackCatalog): BoardCreationReadiness {
    const pack = catalog.packs.find(entry => entry.id === kanbanPack)
    const message = !catalog.can_create_board ? 'Creating a board requires Work administration.'
      : !pack ? 'The Kanban pack is unavailable.'
      : pack.problem || pack.plugins?.some(plugin => !plugin.installed || plugin.problem)
        ? 'The Kanban pack is waiting for its Work plugins.' : undefined
    this.readiness = { pack, enabled: message === undefined, message }
    return this.readiness
  }

  async submit(title: string, prefix: string): Promise<CreateBoardResult | undefined> {
    const { pack, enabled } = this.readiness
    const request = this.request ?? (enabled && pack && title.trim()
      ? newBoardRequest(title, prefix, pack.version, this.key()) : undefined)
    if (!request) return
    this.request = request
    try {
      const result = await this.create(request)
      this.request = undefined
      return result
    } catch (error) {
      if (error instanceof WorkError && !error.retryable) this.request = undefined
      throw error
    }
  }
}
