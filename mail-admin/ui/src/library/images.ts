// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api } from '@wippy-fe/proxy'

// Image bytes come from Mail's editor-only route. Each image keeps one object URL, for its newest revision; asking for
// a newer revision releases the older URL.
const urls = new Map<string, { revision: number; url: Promise<string | undefined> }>()

export function imageUrl(name: string, revision: number): Promise<string | undefined> {
  const held = urls.get(name)
  if (held && held.revision >= revision) return held.url
  const url = Promise.resolve(api.get(`/api/v1/mail/library/asset/${encodeURIComponent(name)}/content`, { responseType: 'blob' }))
    .then(response => response.data instanceof Blob ? URL.createObjectURL(response.data) : undefined, () => {
      if (urls.get(name)?.url === url) urls.delete(name)
      return undefined
    })
  urls.set(name, { revision, url })
  if (held) void held.url.then(old => { if (old) URL.revokeObjectURL(old) })
  return url
}
