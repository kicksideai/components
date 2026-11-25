// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api } from '@wippy-fe/proxy'
import { vi } from 'vitest'
import type { LibraryRow, LogMessage, Resource, ResourceKind, Revision } from '../types'

export function resource(kind: ResourceKind, name: string, extra: Partial<Resource> = {}): Resource {
  return {
    kind, name, title: name[0].toUpperCase() + name.slice(1), description: `About ${name}.`,
    html: `<p>${name} html</p>`, text: `${name} text`,
    ...(kind === 'message' ? { subject: '{{ subject }}', base: 'standard' } : {}),
    schema: { type: 'object', properties: {} }, samples: {},
    state: 'original', revision: 0, ...extra,
  }
}

export function revision(item: Resource, number: number, extra: Partial<Revision> = {}): Revision {
  const { kind, name, title, description, html, text, subject, base, schema, samples } = item
  return {
    kind, name, seq: number, version: number, action: 'edited', state: item.state,
    content: { kind, name, title, description, html, text, subject, base, schema, samples },
    author: 'user-1', author_label: { kind: 'user', id: 'user-1', label: 'Dana Lee' }, created_at: Date.UTC(2026, 10, 20, 9), ...extra,
  }
}

export const dana = { kind: 'user', id: 'user-1', label: 'Dana Lee' }

export function row(item: Resource, extra: Partial<LibraryRow> = {}): LibraryRow {
  const { kind, name, title, description, state, revision: rev, origin, base, author, updated_at } = item
  return {
    kind, name, title, description, state, revision: rev, origin, base, author, updated_at,
    origin_label: state === 'created' ? undefined : 'Mail', author_label: author ? dana : undefined, ...extra,
  }
}

export function message(id: string, extra: Partial<LogMessage> = {}): LogMessage {
  return {
    message_id: id, status: 'sent', created_at: Date.now() - 60_000, attempts: 1, sender: 'user-1', sender_label: dana, template: 'notice',
    subject: `Subject ${id}`, to: ['team@example.org'], attachments: [], ...extra,
  }
}

export const ok = (data: unknown) => Promise.resolve({ data: { success: true, data } })
export const refuse = (status: number, body: Record<string, unknown>) =>
  Promise.reject({ response: { status, data: { success: false, ...body } } })

type Route = { method: 'get' | 'post' | 'delete' | 'put'; match: (path: string) => boolean; reply: (path: string, body?: unknown) => Promise<unknown> }

// Routes the mocked host API by method and path; unrouted calls fail the request.
export function serve(routes: Route[]) {
  const answer = (method: Route['method']) => (path: string, second?: unknown) => {
    const route = routes.find(candidate => candidate.method === method && candidate.match(path))
    return route ? route.reply(path, second) : refuse(404, { error: 'unrouted ' + method + ' ' + path })
  }
  vi.mocked(api.get).mockImplementation(answer('get') as never)
  vi.mocked(api.post).mockImplementation(answer('post') as never)
  vi.mocked(api.delete).mockImplementation(answer('delete') as never)
  vi.mocked(api.put).mockImplementation(answer('put') as never)
}

export const get = (path: string, reply: Route['reply']): Route => ({ method: 'get', match: candidate => candidate === path, reply })
export const post = (path: string, reply: Route['reply']): Route => ({ method: 'post', match: candidate => candidate === path, reply })
export const remove = (path: string, reply: Route['reply']): Route => ({ method: 'delete', match: candidate => candidate === path, reply })
export const put = (path: string, reply: Route['reply']): Route => ({ method: 'put', match: candidate => candidate === path, reply })

// The paths and options the component sent through the mocked host API.
export function calls(method: 'get' | 'post' | 'delete' | 'put'): [path: string, options: unknown][] {
  return (vi.mocked(api[method]).mock.calls as unknown[][]).map(([path, options]) => [String(path), options])
}
