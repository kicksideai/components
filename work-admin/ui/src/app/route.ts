// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { inject, type InjectionKey } from 'vue'
export type Route = { name: 'boards' } | { name: 'board'; board: string } | { name: 'settings'; board: string }
export const navigatorKey: InjectionKey<(route: Route) => void> = Symbol('work-navigation')
export function useNavigate() { return inject(navigatorKey, () => {}) }
export function pathOf(route: Route): string {
  if (route.name === 'boards') return ''
  const board = encodeURIComponent(route.board)
  if (route.name === 'settings') return `${board}/settings`
  return board
}
export function parse(path: string): Route {
  const parts = path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)
  try {
    const board = decodeURIComponent(parts[0] ?? '')
    if (!board) return { name: 'boards' }
    if (parts.length === 2 && parts[1] === 'settings') return { name: 'settings', board }
    return { name: 'board', board }
  } catch { return { name: 'boards' } }
}
