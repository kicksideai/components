// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
// Plugin UI mount points (spec 3.7): a slot names a tag the shell loads once;
// a tag that fails to load drops out and the page shows its own view.
import { loadByTagName } from '@wippy-fe/proxy'

const loaded = new Map<string, Promise<boolean>>()

export function ensureTag(tag: string): Promise<boolean> {
  let pending = loaded.get(tag)
  if (!pending) {
    pending = Promise.resolve().then(() => loadByTagName(tag)).then(() => true, () => { loaded.delete(tag); return false })
    loaded.set(tag, pending)
  }
  return pending
}
