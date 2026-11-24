// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api } from '@wippy-fe/proxy'

let me: Promise<string | undefined> | undefined

async function read() {
  const { data } = await api.get<{ user?: { id?: string } }>('/api/v1/user/me')
  return data.user?.id
}

export function currentUser() {
  const request = me ?? read()
  me = request
  request.catch(() => { if (me === request) me = undefined })
  return request
}
