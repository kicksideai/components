// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
export interface Invalidation {
  minSeq?: number
  revalidate: boolean
}

export function createCoordinator(refresh: (invalidation: Invalidation) => Promise<void>) {
  let highWater: number | undefined
  let revalidate = false
  let pending = false
  let active = false
  let stopped = false
  let lastStart = -Infinity
  let timer: ReturnType<typeof setTimeout> | undefined

  function schedule() {
    if (stopped || active || !pending || timer !== undefined) return
    timer = setTimeout(async () => {
      timer = undefined
      pending = false
      active = true
      lastStart = Date.now()
      const request = { minSeq: highWater, revalidate }
      revalidate = false
      try {
        await refresh(request)
      } finally {
        active = false
        schedule()
      }
    }, Math.max(0, 1000 - (Date.now() - lastStart)))
  }

  function invalidate(seq?: number, access = false) {
    if (seq !== undefined && (!Number.isSafeInteger(seq) || seq < 0)) return
    if (!access && seq !== undefined && highWater !== undefined && seq <= highWater) return
    revalidate ||= access
    if (seq !== undefined) highWater = Math.max(highWater ?? 0, seq)
    pending = true
    schedule()
  }

  function stop() {
    stopped = true
    clearTimeout(timer)
  }

  return { invalidate, stop }
}
