// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { BoardAccess, WorkExtension } from '../work/types'
import type { FilterSelection, ItemSummary, Json } from '../presentation/query'
import { titleOf } from '../presentation/query'

const tagPattern = /^[a-z][a-z0-9._]*-[a-z0-9._-]*$/
const idPattern = /^[a-zA-Z0-9_.-]+(?::[a-zA-Z0-9_.-]+)*$/
const slots = ['card_badge', 'drawer_panel', 'board_panel', 'filter']
const grants = ['read', 'write', 'delete', 'admin']
const operators = new Set(['eq', 'neq', 'in', 'nin', 'lt', 'lte', 'gt', 'gte', 'has', 'is_null', 'starts_with', 'contains'])

function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function text(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 255 && !!value.trim() && !value.includes('\0')
}

function validPlacement(raw: unknown): raw is WorkExtension {
  if (!record(raw) || !text(raw.id) || !idPattern.test(raw.id) || !text(raw.title) || !text(raw.plugin)
    || !text(raw.slot) || !slots.includes(raw.slot) || !text(raw.access) || !grants.includes(raw.access)
    || !Number.isSafeInteger(raw.order) || !text(raw.target)) return false
  if (raw.slot !== 'filter' || raw.tag !== undefined) {
    if (!text(raw.tag) || !tagPattern.test(raw.tag)) return false
  }
  if (raw.slot === 'filter') return /^(field|scope|operand):[\w.:-]+$/.test(raw.target)
  if (raw.slot === 'board_panel') return /^board:[a-z][a-z0-9_-]*$/.test(raw.target)
  return /^item(?::[\w.-]+)?$/.test(raw.target)
}

export function checkPlacements(raw: unknown, access: BoardAccess): WorkExtension[] {
  if (!access.read || !Array.isArray(raw)) return []
  const checked = raw.filter(validPlacement).sort((a, b) => a.order - b.order || (a.id < b.id ? -1 : a.id === b.id ? 0 : 1))
  const counts = new Map<string, number>()
  const seen = new Set<string>()
  return checked.filter(entry => {
    const identity = entry.slot === 'board_panel' ? entry.target : entry.id
    const count = counts.get(entry.slot) ?? 0
    if (!access[entry.access] || seen.has(identity) || count >= 16) return false
    seen.add(identity)
    counts.set(entry.slot, count + 1)
    return true
  })
}

export function badgeSlots(placements: readonly WorkExtension[], type: string) {
  const matching = placements.filter(entry => entry.slot === 'card_badge' && itemTarget(entry, type))
  return { visible: matching.slice(0, 2), overflow: matching.slice(2) }
}

function itemTarget(entry: WorkExtension, type: string) {
  return entry.target === 'item' || entry.target === 'item:' + type
}

export function drawerSlots(placements: readonly WorkExtension[], type: string) {
  return {
    panels: placements.filter(entry => entry.slot === 'drawer_panel' && itemTarget(entry, type)),
    badges: badgeSlots(placements, type).overflow,
  }
}

export function badgeSummary(item: ItemSummary) {
  return { id: item.id, key: item.key, type: item.type, state: item.state, title: titleOf(item) }
}

function literal(value: unknown, depth = 0): value is Json {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return true
  if (typeof value === 'number') return Number.isFinite(value)
  if (depth >= 3) return false
  if (Array.isArray(value)) return value.length <= 100 && value.every(part => literal(part, depth + 1))
  return record(value) && Object.entries(value).length <= 16
    && Object.entries(value).every(([key, part]) => /^[a-zA-Z][\w]*$/.test(key) && literal(part, depth + 1))
}

export function extensionFilter(entry: WorkExtension, raw: unknown): FilterSelection | undefined {
  if (entry.slot !== 'filter' || !record(raw)) return
  const separator = entry.target.indexOf(':')
  const kind = entry.target.slice(0, separator)
  const target = entry.target.slice(separator + 1)
  if (kind === 'scope') {
    if (raw.id !== target || !record(raw.where) || !literal(raw.where) || Object.keys(raw).length !== 2) return
    if (!Object.values(raw.where).every(record)) return
    return { scope: { id: target, where: raw.where as Record<string, Record<string, Json>> } }
  }
  if (Object.keys(raw).length !== 3 || !text(raw.field) || !idPattern.test(raw.field)
    || !text(raw.op) || !operators.has(raw.op)) return
  if (kind === 'field' && raw.field === target && literal(raw.value)) {
    return { where: { field: target, op: raw.op, value: raw.value } }
  }
  if (kind === 'operand' && record(raw.value) && Object.keys(raw.value).length === 1) {
    const operand = raw.value.$operand
    if (!record(operand) || operand.id !== target || !literal(operand)) return
    return { where: { field: raw.field, op: raw.op, value: { $operand: operand as Json } } }
  }
}
