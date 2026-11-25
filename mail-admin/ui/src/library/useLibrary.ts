// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { reactive, ref } from 'vue'
import { library } from '../api'
import { describe } from '../copy'
import { useMailInvalidation } from '../realtime'
import type { LibraryPage, LibraryRow, Resource, ResourceKind } from '../types'

// Project a newly saved resource into a summary row.
export function rowOf(item: Resource): LibraryRow {
  const { kind, name, title, description, state, revision, origin, origin_label, base, author, author_label, updated_at, used_by } = item
  const usage = used_by && {
    messages: used_by.messages?.length,
    recent_sources: used_by.recent_senders?.length,
  }
  return { kind, name, title, description, state, revision, origin, origin_label, base, author, author_label, updated_at, used_by: usage }
}

// Mail resolves at most this many exact names in one library page.
export const LOOKUP_LIMIT = 100
export const SEARCH_LIMIT = 50

// Summary rows by reference, filled by exact-name lookups and by the pages the views read. Nothing reads the whole
// library: a title shown for a reference is looked up with the other references shown at the same time.
export function useLibrary() {
  // undefined: not known yet; null: Mail lists no such resource.
  const rows = reactive(new Map<string, LibraryRow | null>())
  const pending = new Map<ResourceKind, Set<string>>()
  const requested = new Set<string>()
  const failed = new Map<string, number>()
  const lookupError = ref('')
  const generation = ref(0)
  let scheduled = false
  const id = (kind: ResourceKind, name: string) => `${kind}/${name}`

  function remember(items: LibraryRow[]) {
    for (const item of items) rows.set(id(item.kind, item.name), item)
  }

  async function lookup(kind: ResourceKind, names: string[]) {
    const current = generation.value
    for (let start = 0; start < names.length; start += LOOKUP_LIMIT) {
      const chunk = names.slice(start, start + LOOKUP_LIMIT)
      try {
        const page = await library.page({ kind, names: chunk, limit: LOOKUP_LIMIT })
        if (current !== generation.value) return
        const found = new Map(page.items.map(item => [item.name, item]))
        for (const name of chunk) {
          const key = id(kind, name)
          if (!rows.has(key)) rows.set(key, found.get(name) ?? null)
        }
      } catch (failure) {
        if (current !== generation.value) return
        for (const name of chunk) failed.set(id(kind, name), current)
        lookupError.value = describe(failure, 'Library references could not be loaded.')
      } finally {
        if (current === generation.value) for (const name of chunk) requested.delete(id(kind, name))
      }
    }
  }

  function flush() {
    scheduled = false
    const batches = [...pending.entries()]
    pending.clear()
    for (const [kind, names] of batches) void lookup(kind, [...names])
  }

  function request(kind: ResourceKind, name: string) {
    const key = id(kind, name)
    if (failed.get(key) === generation.value || rows.has(key) || requested.has(key)) return
    requested.add(key)
    const names = pending.get(kind) ?? new Set<string>()
    names.add(name)
    pending.set(kind, names)
    if (!scheduled) {
      scheduled = true
      queueMicrotask(flush)
    }
  }

  // The row for a reference, or undefined until it is known.
  function find(kind: ResourceKind, name: string): LibraryRow | undefined {
    const row = rows.get(id(kind, name))
    if (row === undefined) request(kind, name)
    return row ?? undefined
  }
  // Whether Mail lists the reference, or undefined while it is being looked up.
  function exists(kind: ResourceKind, name: string): boolean | undefined {
    const row = rows.get(id(kind, name))
    if (row === undefined) { request(kind, name); return undefined }
    return row !== null
  }
  // A title, or undefined while it is being looked up; the reference itself when Mail lists no such resource.
  function title(kind: ResourceKind, name: string): string | undefined {
    const row = rows.get(id(kind, name))
    if (row === undefined) { request(kind, name); return undefined }
    return row?.title ?? name
  }

  // One page of a kind matching a search, in Mail's order, optionally among exact names.
  async function search(kind: ResourceKind, q?: string, names?: string[]): Promise<LibraryPage> {
    const page = await library.page({ kind, q: q || undefined, names, limit: SEARCH_LIMIT })
    remember(page.items)
    return page
  }

  function patch(kind: ResourceKind, name: string, row: LibraryRow | undefined) {
    rows.set(id(kind, name), row ?? null)
  }

  function refresh() {
    generation.value++
    pending.clear()
    requested.clear()
    failed.clear()
    rows.clear()
    lookupError.value = ''
  }
  useMailInvalidation('mail.library', refresh)

  return { find, exists, title, search, remember, patch, refresh, lookupError }
}
