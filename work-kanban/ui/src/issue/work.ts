// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { WorkError, type WorkClient } from '../work/client'
import { checkedWrite } from './model'
import type { Detail, ItemPage, Operation, WriteResult } from './types'

export type IssueWork = Pick<WorkClient, 'boardRead'>

export function readIssue(work: IssueWork, board: string, id: string, transitions = false, minSeq?: number) {
  return work.boardRead<Detail>(board, 'get', {
    item: { id },
    ...(transitions ? { include: ['transitions'] } : {}),
    ...(minSeq === undefined ? {} : { min_seq: minSeq }),
  })
}

export async function queryIssues(work: IssueWork, board: string, body: Record<string, unknown>) {
  return completeItemPage(await work.boardRead<ItemPage>(board, 'query', body))
}

export function completeItemPage(page: ItemPage) {
  if (page.incomplete || page.reindexing) throw new WorkError({ code: 'work_read_incomplete' }, 503)
  return { rows: page.items, after: page.after }
}

export function applyIssue(work: IssueWork, board: string, body: { key: string; ops: Operation[] }) {
  return work.boardRead<WriteResult>(board, 'apply', { ...body, mode: 'atomic' }).then(checkedWrite)
}
