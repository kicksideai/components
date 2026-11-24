// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api } from '@wippy-fe/proxy'

// Image bytes come from Mail's editor-only route; one object URL per image revision is kept for the page's life.
const urls = new Map<string, Promise<string | undefined>>()

export function imageUrl(name: string, revision: number): Promise<string | undefined> {
  const key = `${name}@${revision}`
  let pending = urls.get(key)
  if (!pending) {
    pending = Promise.resolve(api.get(`/api/v1/mail/library/asset/${encodeURIComponent(name)}/content`, { responseType: 'blob' }))
      .then(response => response.data instanceof Blob ? URL.createObjectURL(response.data) : undefined, () => { urls.delete(key); return undefined })
    urls.set(key, pending)
  }
  return pending
}
