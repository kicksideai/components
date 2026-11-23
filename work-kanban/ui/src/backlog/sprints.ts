// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { WorkClient } from '../work/client'
import { readItemDetail, requireComplete, type Cursor, type QueryPage, type WorkOperation } from '../presentation/query'
import { fieldChanges } from './edit'

export interface SprintChoice {
  id: string
  label: string
  operation?: WorkOperation
}
export interface SprintChoices {
  choices: SprintChoice[]
  after?: Cursor
}

export async function sprintChoices(work: WorkClient, board: string, item: string, after?: Cursor): Promise<SprintChoices> {
  const detail = await readItemDetail(work, board, item)
  if (!detail.access.write || detail.field_edit?.current_sprint !== 'editable') return { choices: [] }
  const page = requireComplete(await work.boardRead<QueryPage>(board, 'query', {
    where: { and: [
      { field: 'type', op: 'eq', value: 'sprint' },
      { field: 'state', op: 'in', value: ['planned', 'active'] },
    ] },
    limit: 20,
    after,
  }))
  const choices = (page.items ?? []).map(sprint => ({
    id: sprint.id,
    label: typeof sprint.values.name === 'string' ? sprint.values.name : sprint.key,
    operation: fieldChanges(detail, { current_sprint: { board, item: sprint.id } }, ['current_sprint']),
  }))
  if (!after && detail.item.values.current_sprint != null) choices.unshift({
    id: '', label: 'Backlog', operation: fieldChanges(detail, { current_sprint: null }, ['current_sprint']),
  })
  return { choices, after: page.after }
}
