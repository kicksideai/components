// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api } from '@wippy-fe/proxy'
import { WorkError } from '../work/client'
import { checkedWrite } from '../issue/model'
import type { WriteResult } from '../issue/types'
import type { SprintPreview } from './model'

async function planning<T>(operation: 'plan_close' | 'close', payload: object): Promise<T> {
  const path = '/api/v1/work/sprints/' + operation
  let response
  try {
    response = await api.post(path, payload)
  } catch (error) {
    const reply = (error as { response?: { status?: number; data?: { code?: string; retryable?: boolean } } }).response
    throw new WorkError(reply?.data, reply?.status)
  }
  if (!response.data?.success || !response.data.data) throw new WorkError(response.data, response.status)
  return response.data.data as T
}

export function previewClosure(board: string, sprint: string, destination?: string) {
  return planning<SprintPreview>('plan_close', { board_id: board, sprint_id: sprint, rollover_id: destination })
}

export function commitClosure(body: { snapshot: SprintPreview['snapshot']; token: string; key: string }) {
  return planning<WriteResult>('close', body).then(checkedWrite)
}
