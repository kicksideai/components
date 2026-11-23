// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import { onScopeDispose, ref, shallowRef } from 'vue'
import { isAccessLoss } from '../work/client'

export function workRows<Row>(value: Row[] | Record<string, never> | undefined): Row[] {
  if (Array.isArray(value)) return value
  if (value === undefined || Object.keys(value).length === 0) return []
  throw new Error('Work returned an invalid collection.')
}

export function useCursorPage<Row, Cursor>(
  read: (after?: Cursor) => Promise<{ rows: Row[]; after?: Cursor }>,
  identity: (row: Row) => string,
  denied?: (error: unknown) => void,
) {
  const rows = shallowRef<Row[]>([])
  const after = shallowRef<Cursor>()
  const error = shallowRef<unknown>()
  const loaded = ref(false)
  const pending = ref(false)
  const begin = latestRequest()
  let wasAppend = false

  function reset() {
    begin()
    rows.value = []
    after.value = undefined
    error.value = undefined
    loaded.value = false
    pending.value = false
  }

  async function load(append = false) {
    const cursor = append ? after.value : undefined
    if (append && (pending.value || cursor === undefined)) return
    const current = begin()
    wasAppend = append
    pending.value = true
    error.value = undefined
    try {
      const page = await read(cursor)
      if (!current()) return
      const merged = new Map((append ? rows.value : []).map(row => [identity(row), row]))
      for (const row of workRows(page.rows)) merged.set(identity(row), row)
      rows.value = Array.from(merged.values())
      after.value = page.after
      loaded.value = true
    } catch (problem) {
      if (!current()) return
      if (isAccessLoss(problem)) {
        rows.value = []
        after.value = undefined
        loaded.value = false
        denied?.(problem)
      }
      error.value = problem
    } finally {
      if (current()) pending.value = false
    }
  }

  onScopeDispose(reset)
  return { rows, after, error, pending, loaded, reset, load, retry: () => load(wasAppend) }
}
