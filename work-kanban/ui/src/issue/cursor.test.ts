// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { WorkError } from '../work/client'
import { useCursorPage } from './cursor'

it('retains authorized data on a transient read and clears it when access is denied', async () => {
  const scope = effectScope()
  const read = vi.fn()
    .mockResolvedValueOnce({ rows: ['a'], after: 'cursor' })
    .mockRejectedValueOnce(new WorkError())
    .mockRejectedValueOnce(new WorkError(undefined, 403))
  const page = scope.run(() => useCursorPage(read, (row: string) => row))!
  try {
    await page.load()
    await page.load(true)
    expect(page.rows.value).toEqual(['a'])
    expect(page.after.value).toBe('cursor')
    await page.retry()
    expect(read.mock.calls).toEqual([[undefined], ['cursor'], ['cursor']])
    expect(page.rows.value).toEqual([])
    expect(page.after.value).toBeUndefined()
  } finally {
    scope.stop()
  }
})

it('discards a delayed page from a previously opened issue', async () => {
  const scope = effectScope()
  let resolve!: (page: { rows: string[] }) => void
  const read = vi.fn()
    .mockReturnValueOnce(new Promise(done => { resolve = done }))
    .mockResolvedValueOnce({ rows: ['current'] })
  const page = scope.run(() => useCursorPage(read, (row: string) => row))!
  try {
    const delayed = page.load()
    page.reset()
    await page.load()
    resolve({ rows: ['stale'] })
    await delayed
    expect(page.rows.value).toEqual(['current'])
  } finally {
    scope.stop()
  }
})

it('accepts Work’s empty Lua collection and clears the previous cursor', async () => {
  const scope = effectScope()
  const read = vi.fn().mockResolvedValue({ rows: {} })
  const page = scope.run(() => useCursorPage(read, (row: string) => row))!
  try {
    await page.load()
    expect(page.loaded.value).toBe(true)
    expect(page.error.value).toBeUndefined()
    expect(page.rows.value).toEqual([])
  } finally {
    scope.stop()
  }
})
