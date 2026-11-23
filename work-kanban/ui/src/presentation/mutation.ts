// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { WorkError, type WorkClient } from '../work/client'
import type { ApplyResult, WorkCommand, WorkOperation } from './query'

export function command(ops: WorkOperation[]): WorkCommand {
  return { key: crypto.randomUUID(), mode: 'atomic', ops }
}

export async function applyWork(work: WorkClient, board: string, request: WorkCommand) {
  const result = await work.boardRead<ApplyResult>(board, 'apply', request)
  const failure = (result.outcomes ?? []).find(row => row.status !== 'applied' && row.status !== 'unchanged')
  if (failure) {
    const code = failure.findings?.[0]?.code ?? failure.error?.code ?? failure.status
    const error = new WorkError({ code, retryable: false }, failure.status === 'denied' ? 403 : 409)
    const message = code === 'version_mismatch' ? 'This issue changed. Open it again to review the latest version before saving.'
      : failure.findings?.[0]?.message
    if (message) error.message = message
    throw error
  }
  if (!result.outcomes?.length) throw new WorkError({ retryable: true })
  return result
}
