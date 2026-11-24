// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api } from '@wippy-fe/proxy'
import { computed, ref, watch, type Ref } from 'vue'

const minimum = 320
const maximum = 760
const boardMinimum = 320

export function usePanelSize(panel: Ref<HTMLElement | undefined>) {
  const preferred = ref(480)
  const available = ref(maximum)
  const width = computed(() => Math.max(minimum, Math.min(available.value, preferred.value)))
  let storageKey: string | undefined
  let requested = false
  let resized = false
  let drag: { id: number; x: number; width: number; direction: number } | undefined

  function remember() {
    if (!storageKey) return
    try {
      localStorage.setItem(storageKey, String(preferred.value))
    } catch {
      // The live width still works when browser storage is unavailable.
    }
  }

  async function loadPreference() {
    try {
      const { data } = await api.get<{ user?: { id?: string } }>('/api/v1/user/me')
      if (!data.user?.id) return
      storageKey = 'work-kanban.issue-panel-width.' + data.user.id
      if (resized) remember()
      else {
        const saved = Number(localStorage.getItem(storageKey))
        if (Number.isFinite(saved) && saved >= minimum && saved <= maximum) preferred.value = saved
      }
    } catch {
      // A blocked profile read or storage failure only affects persistence.
    }
  }

  watch(panel, (element, _, onCleanup) => {
    const page = element?.parentElement
    if (!page) return
    const measure = (size: number) => { available.value = Math.max(minimum, Math.min(maximum, size - boardMinimum)) }
    measure(page.clientWidth)
    const observer = new ResizeObserver(([entry]) => measure(entry.contentRect.width))
    observer.observe(page)
    onCleanup(() => observer.disconnect())
    if (!requested) {
      requested = true
      void loadPreference()
    }
  }, { flush: 'post' })

  function set(value: number) {
    preferred.value = Math.max(minimum, Math.min(available.value, Math.round(value)))
    resized = true
  }

  function direction() {
    return panel.value && getComputedStyle(panel.value).direction === 'rtl' ? -1 : 1
  }

  function start(event: PointerEvent) {
    if (event.button !== 0 || !event.isPrimary) return
    const handle = event.currentTarget as HTMLElement
    handle.focus({ preventScroll: true })
    handle.setPointerCapture(event.pointerId)
    drag = { id: event.pointerId, x: event.clientX, width: width.value, direction: direction() }
    event.preventDefault()
  }

  function move(event: PointerEvent) {
    if (drag?.id === event.pointerId) set(drag.width + (drag.x - event.clientX) * drag.direction)
  }

  function stop(event: PointerEvent) {
    if (drag?.id !== event.pointerId) return
    drag = undefined
    if (resized) remember()
  }

  function key(event: KeyboardEvent) {
    const step = (event.shiftKey ? 64 : 16) * direction()
    const positions: Record<string, number> = {
      ArrowLeft: width.value + step, ArrowRight: width.value - step, Home: minimum, End: available.value,
    }
    if (!Object.hasOwn(positions, event.key)) return
    event.preventDefault()
    set(positions[event.key])
    remember()
  }

  return { width, minimum, available, start, move, stop, key }
}
