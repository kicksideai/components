// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { ItemDetail, Json, WorkOperation } from '../presentation/query'

export function fieldChanges(detail: ItemDetail, draft: Record<string, Json>, fields: readonly string[]): WorkOperation | undefined {
  const values: Record<string, Json> = {}
  const clear: string[] = []
  for (const code of fields) {
    if (detail.field_edit?.[code] !== 'editable' || !Object.hasOwn(draft, code)) continue
    const before = detail.item.values[code]
    const after = draft[code]
    if (JSON.stringify(before) === JSON.stringify(after)) continue
    if (after === null || after === '') {
      if (before != null) clear.push(code)
    } else values[code] = after
  }
  if (!Object.keys(values).length && !clear.length) return
  return {
    op: 'set', item: detail.item.id, expect_version: detail.item.version,
    ...(Object.keys(values).length ? { values } : {}), ...(clear.length ? { clear } : {}),
  }
}
