// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { ItemDetail, WorkOperation } from '../presentation/query'
import type { MoveIntent } from './window'

export interface MovePlan {
  operations: WorkOperation[]
  required: string[]
}

export function planMove(detail: ItemDetail, intent: MoveIntent, stateRequired: string[] = []): MovePlan | undefined {
  const { item, access, transitions, field_edit: fields } = detail
  if (!access.write || item.id !== intent.item || item.state !== intent.source) return
  const rank: WorkOperation[] = intent.before || intent.after ? [{
    op: 'rank', item: item.id,
    ...(intent.before ? { before: intent.before } : {}),
    ...(intent.after ? { after: intent.after } : {}),
  }] : []
  if (intent.source === intent.target) {
    if (!rank.length) return
    rank[0].expect_version = item.version
    return { operations: rank, required: [] }
  }
  const transition = transitions?.find(edge => !edge.region && edge.to === intent.target)
  if (!transition) return
  const required = [...new Set([...(transition.require ?? []), ...stateRequired])].filter(field => item.values[field] == null)
  if (required.some(field => fields?.[field] !== 'editable')) return
  return {
    operations: [{ op: 'transition', item: item.id, transition: transition.id, expect_version: item.version }, ...rank],
    required,
  }
}
