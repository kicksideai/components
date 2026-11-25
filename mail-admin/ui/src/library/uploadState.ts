// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { subscribeComponentMeta } from '@kickside/ui-kit/componentRealtime'
import { uploads } from '../api'

export class UploadFailed extends Error {}

// The platform stores an upload, then processes it in the background. Each processing milestone changes the public
// meta of the uploads component, so the page reads the upload again on each change until it completes or fails.
// Aborting the signal ends the wait and its subscription at once.
export function whenCompleted(id: string, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    let off: (() => void) | null = null
    let reading = false, again = false, settled = false
    const finish = (error?: Error) => {
      if (settled) return
      settled = true
      off?.()
      signal.removeEventListener('abort', abort)
      if (error) reject(error)
      else resolve()
    }
    const abort = () => finish(new UploadFailed('cancelled'))
    if (signal.aborted) { abort(); return }
    signal.addEventListener('abort', abort)
    async function read() {
      if (settled) return
      if (reading) { again = true; return }
      reading = true
      try {
        const state = await uploads.state(id)
        if (state.status === 'completed') finish()
        else if (state.status === 'error') finish(new UploadFailed(state.error ?? ''))
        else if (!off) {
          off = subscribeComponentMeta(state.component_id, () => { void read() })
          if (!off) finish(new UploadFailed(''))
          else again = true
        }
      } catch (error) {
        finish(error as Error)
      } finally {
        reading = false
        if (again && !settled) { again = false; void read() }
      }
    }
    void read()
  })
}
