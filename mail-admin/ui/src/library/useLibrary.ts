// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { onBeforeUnmount, onMounted, ref, shallowRef, type Ref, type ShallowRef } from 'vue'
import { library } from '../api'
import { describe } from '../copy'
import { useMailInvalidation } from '../realtime'
import type { LibraryRow, Resource, ResourceKind } from '../types'

// Project a newly saved resource into a cached summary row.
export function rowOf(item: Resource): LibraryRow {
  const { kind, name, title, description, state, revision, origin, origin_label, base, author, author_label, updated_at, used_by } = item
  const usage = used_by && {
    messages: used_by.messages?.length,
    recent_sources: used_by.recent_senders?.length,
  }
  return { kind, name, title, description, state, revision, origin, origin_label, base, author, author_label, updated_at, used_by: usage }
}

interface KindList { rows: ShallowRef<LibraryRow[]>; loaded: Ref<boolean>; loading: Ref<boolean>; error: Ref<string>; users: number; stale: boolean }

// Summary rows are cached by kind for pickers and resource labels.
export function useLibrary() {
  const kinds = Object.fromEntries((['message', 'base', 'part', 'asset'] as ResourceKind[])
    .map(kind => [kind, { rows: shallowRef<LibraryRow[]>([]), loaded: ref(false), loading: ref(false), error: ref(''), users: 0, stale: false }])) as
    Record<ResourceKind, KindList>
  const pending = new Map<ResourceKind, Promise<void>>()
  let generation = 0

  function load(kind: ResourceKind): Promise<void> {
    const running = pending.get(kind)
    if (running) return running
    const list = kinds[kind]
    list.loading.value = true
    const requested = generation
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
        list.stale = requested !== generation
        list.error.value = ''
      } catch (failure) {
        list.error.value = describe(failure, 'The mail library could not be loaded.')
      } finally {
        list.loading.value = false
        pending.delete(kind)
        if (requested !== generation && list.users > 0) ensure(kind)
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

  function refresh() {
    generation++
    for (const [kind, list] of Object.entries(kinds) as [ResourceKind, KindList][]) {
      list.stale = list.loaded.value
      if (list.users > 0) ensure(kind)
    }
  }
  useMailInvalidation('mail.library', refresh)

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

  return { kinds, use, ensure, load, find, title, ofKind, ready, failed, refresh, patch }
}
