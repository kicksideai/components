// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, expect, it, vi } from 'vitest'
import { createCoordinator } from './coordinator'

afterEach(() => vi.useRealTimers())

it('serializes refreshes and coalesces the highest committed sequence once per second', async () => {
  vi.useFakeTimers()
  let finish: () => void = () => {}
  const refresh = vi.fn(() => new Promise<void>(resolve => { finish = resolve }))
  const live = createCoordinator(refresh)
  live.invalidate(10)
  await vi.advanceTimersByTimeAsync(0)
  expect(refresh).toHaveBeenNthCalledWith(1, { minSeq: 10, revalidate: false })
  live.invalidate(12)
  live.invalidate(11)
  live.invalidate(14, true)
  await vi.advanceTimersByTimeAsync(900)
  expect(refresh).toHaveBeenCalledTimes(1)
  finish()
  await vi.advanceTimersByTimeAsync(100)
  expect(refresh).toHaveBeenNthCalledWith(2, { minSeq: 14, revalidate: true })
  live.invalidate(15)
  live.stop()
  finish()
  await vi.advanceTimersByTimeAsync(2000)
  expect(refresh).toHaveBeenCalledTimes(2)
})

it('revalidates on reconnect even when there is no new sequence', async () => {
  vi.useFakeTimers()
  const refresh = vi.fn(async () => {})
  const live = createCoordinator(refresh)
  live.invalidate(9)
  await vi.advanceTimersByTimeAsync(0)
  live.invalidate(9)
  await vi.advanceTimersByTimeAsync(1000)
  expect(refresh).toHaveBeenCalledTimes(1)
  live.invalidate(undefined, true)
  await vi.advanceTimersByTimeAsync(0)
  expect(refresh).toHaveBeenNthCalledWith(2, { minSeq: 9, revalidate: true })
  live.stop()
})

it('uses sparse Work sequences as high-water marks without treating them as dropped messages', async () => {
  vi.useFakeTimers()
  const refresh = vi.fn(async () => {})
  const live = createCoordinator(refresh)
  live.invalidate(101)
  await vi.advanceTimersByTimeAsync(0)
  live.invalidate(105)
  await vi.advanceTimersByTimeAsync(1000)
  expect(refresh).toHaveBeenNthCalledWith(2, { minSeq: 105, revalidate: false })
  live.stop()
})
