// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { loadByTagName } from '@wippy-fe/proxy'

const loaded = new Map<string, Promise<boolean>>()

export function ensureTag(tag: string): Promise<boolean> {
  let pending = loaded.get(tag)
  if (!pending) {
    pending = Promise.resolve(loadByTagName(tag)).then(() => true, () => { loaded.delete(tag); return false })
    loaded.set(tag, pending)
  }
  return pending
}
