// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { onBeforeUnmount, onMounted, ref, shallowRef, type Ref, type ShallowRef } from 'vue'
import { isMissing, library } from '../api'
import { describe } from '../copy'
import { useLibraryChanges, type LibraryChange } from '../realtime'
import type { LibraryRow, Resource, ResourceKind } from '../types'

// The summary row a resource read stands for, so a change event updates rows without reloading lists.
export function rowOf(item: Resource): LibraryRow {
  const { kind, name, title, description, state, revision, origin, origin_label, base, author, author_label, updated_at, used_by } = item
  const usage = used_by && {
    messages: used_by.messages?.length,
    recent_sources: used_by.recent_senders?.length,
  }
  return { kind, name, title, description, state, revision, origin, origin_label, base, author, author_label, updated_at, used_by: usage }
}

interface KindList { rows: ShallowRef<LibraryRow[]>; loaded: Ref<boolean>; loading: Ref<boolean>; error: Ref<string>; users: number; stale: boolean }
type RowListener = (change: LibraryChange, row: LibraryRow | undefined, item: Resource | undefined) => void

// Summary rows by kind, read only for the kinds a mounted screen asks for. A change event reads the one resource
// it names and patches the rows in place; nothing reloads a whole list after the first read.
export function useLibrary() {
  const kinds = Object.fromEntries((['message', 'base', 'part', 'asset'] as ResourceKind[])
    .map(kind => [kind, { rows: shallowRef<LibraryRow[]>([]), loaded: ref(false), loading: ref(false), error: ref(''), users: 0, stale: false }])) as
    Record<ResourceKind, KindList>
  const pending = new Map<ResourceKind, Promise<void>>()
  const listeners = new Set<RowListener>()

  function load(kind: ResourceKind): Promise<void> {
    const running = pending.get(kind)
    if (running) return running
    const list = kinds[kind]
    list.loading.value = true
    const task = (async () => {
      try {
        const rows: LibraryRow[] = []
        let cursor: string | undefined
        do {
          const page = await library.page({ kind, cursor })
          rows.push(...page.items)
          cursor = page.next_cursor
        } while (cursor)
        list.rows.value = rows
        list.loaded.value = true
        list.stale = false
        list.error.value = ''
      } catch (failure) {
        list.error.value = describe(failure, 'The mail library could not be loaded.')
      } finally {
        list.loading.value = false
        pending.delete(kind)
      }
    })()
    pending.set(kind, task)
    return task
  }

  function ensure(kind: ResourceKind) {
    const list = kinds[kind]
    if ((!list.loaded.value || list.stale) && !list.loading.value) void load(kind)
  }

  // A component that shows rows of a kind holds it for as long as it is mounted.
  function use(...wanted: ResourceKind[]) {
    onMounted(() => { for (const kind of wanted) { kinds[kind].users++; ensure(kind) } })
    onBeforeUnmount(() => { for (const kind of wanted) kinds[kind].users-- })
  }

  function patch(kind: ResourceKind, name: string, row: LibraryRow | undefined) {
    const list = kinds[kind]
    if (!list.loaded.value) return
    const rows = list.rows.value.filter(item => item.name !== name)
    if (row) rows.push(row)
    list.rows.value = rows
  }

  async function changed(change: LibraryChange) {
    let row: LibraryRow | undefined, item: Resource | undefined
    try {
      item = await library.get(change)
      row = rowOf(item)
    } catch (failure) {
      if (!isMissing(failure)) {
        kinds[change.kind].stale = true
        if (kinds[change.kind].users > 0) ensure(change.kind)
        return
      }
    }
    patch(change.kind, change.name, row)
    for (const listener of listeners) listener(change, row, item)
  }
  useLibraryChanges(change => { void changed(change) })

  // After the page was hidden, lists in use read again once; lists nobody shows wait until someone does.
  function refresh() {
    for (const list of Object.values(kinds)) list.stale = list.loaded.value
    for (const [kind, list] of Object.entries(kinds) as [ResourceKind, KindList][]) if (list.users > 0) ensure(kind)
  }

  // Every change as one read row, for screens that keep their own server-ordered pages.
  function onRow(listener: RowListener) {
    listeners.add(listener)
    onBeforeUnmount(() => listeners.delete(listener))
  }

  const find = (kind: ResourceKind, name: string) => kinds[kind].rows.value.find(item => item.name === name)
  // A title, or undefined while the kind is still loading; the reference once it is known not to be listed.
  function title(kind: ResourceKind, name: string): string | undefined {
    const found = find(kind, name)
    if (found) return found.title
    ensure(kind)
    return kinds[kind].loaded.value ? name : undefined
  }
  const ofKind = (kind: ResourceKind) => [...kinds[kind].rows.value].sort((a, b) => a.title.localeCompare(b.title))
  const ready = (kind: ResourceKind) => kinds[kind].loaded.value
  const failed = (kind: ResourceKind) => kinds[kind].error.value

  return { kinds, use, ensure, load, find, title, ofKind, ready, failed, onRow, refresh, patch }
}
