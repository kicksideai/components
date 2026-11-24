// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { h, type FunctionalComponent } from 'vue'

export const typeIcons: Record<string, string> = {
  epic: 'tabler:bolt', story: 'tabler:bookmark', task: 'tabler:square-check', bug: 'tabler:bug', sub_task: 'tabler:subtask',
}

export const priorityIcons: Record<string, string> = {
  highest: 'tabler:chevrons-up', high: 'tabler:chevron-up', medium: 'tabler:equal',
  low: 'tabler:chevron-down', lowest: 'tabler:chevrons-down',
}

export function typeIcon(type: string) {
  return typeIcons[type] ?? 'tabler:point'
}

const avatarTones = ['blue', 'violet', 'amber', 'success', 'info']

export function avatarTone(id: string) {
  let hash = 0
  for (const character of id) hash = (Math.imul(hash, 31) + character.charCodeAt(0)) | 0
  return avatarTones[Math.abs(hash) % avatarTones.length]
}

export function initials(name?: string) {
  return name?.trim().split(/\s+/).slice(0, 2).map(word => Array.from(word)[0]).join('').toUpperCase()
}

export const spriteGlyphs = [
  ...new Set([...Object.values(typeIcons), ...Object.values(priorityIcons),
    'tabler:point', 'tabler:flag', 'tabler:user', 'tabler:grip-vertical']),
]

export function glyphId(name: string) {
  return 'kanban-glyph-' + name.replace(/[^a-z0-9]+/gi, '-')
}

export const Glyph: FunctionalComponent<{ name: string }> = ({ name }) =>
  h('svg', { class: 'kanban-glyph', viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' },
    [h('use', { href: '#' + glyphId(name) })])
Glyph.props = ['name']
