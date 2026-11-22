// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { fieldTitle, humanize } from '../../forms'
import type { Declaration, Holder, Process } from '../../types'
import { durationParts } from './duration'
import { categoryTitle, kindTitle, stateTitle, transitionTitle } from './process'
import type { SchemaChange } from './model'

interface ReviewCopy { title: string; details: string[] }
const pair = (before: unknown, after: unknown) => `${before} → ${after}`
const fieldLabel = (schema: Declaration, code?: string) => {
  const field = schema.fields?.find(field => field.code === code)
  return field ? fieldTitle(field) : 'Untitled field'
}

const policyLabels = {
  comments_per_item: 'Comments per item', stage_timeout: 'Default attempt timeout',
  stage_max_visits: 'Default maximum visits', audit: 'Audit trail', audit_days: 'Audit history',
  trash_days: 'Keep trashed items', tombstone_days: 'Keep deletion records', interval_days: 'Keep state history',
} as const

function policyValue(key: keyof typeof policyLabels, value: string | number | undefined) {
  if (value === undefined) return 'Application default'
  if (key === 'audit') return humanize(String(value))
  if (key === 'stage_timeout') {
    const parts = durationParts(String(value))
    if (parts) return `${parts.amount.toLocaleString()} ${parts.amount === 1 ? parts.unit.slice(0, -1) : parts.unit}`
  }
  if (key.endsWith('_days')) {
    const days = value === 0 && (key === 'audit_days' || key === 'interval_days') ? 365 : value
    return `${days} ${days === 1 ? 'day' : 'days'}`
  }
  return String(value)
}

function policyChanges(original: Declaration, draft: Declaration) {
  const before = original.policy ?? {}, after = draft.policy ?? {}
  const details = (Object.keys(policyLabels) as (keyof typeof policyLabels)[]).flatMap(key =>
    before[key] === after[key] ? [] : [`${policyLabels[key]} · ${pair(policyValue(key, before[key]), policyValue(key, after[key]))}`])
  const capacity = (limit?: { limit: number; hard?: boolean }) =>
    limit ? `${limit.limit}${limit.hard ? ' (hard limit)' : ''}` : 'No limit'
  const states = new Set([...Object.keys(before.wip ?? {}), ...Object.keys(after.wip ?? {})])
  for (const id of states) {
    const from = capacity(before.wip?.[id]), to = capacity(after.wip?.[id])
    if (from === to) continue
    const state = (draft.processes ?? []).flatMap(process => process.states).find(state => state.id === id)
      ?? (original.processes ?? []).flatMap(process => process.states).find(state => state.id === id)
    details.push(`${stateTitle(state)} limit · ${pair(from, to)}`)
  }
  return details
}

function visibilityChanges(original: Declaration, draft: Declaration, holderName: (holder: Holder) => string) {
  const before = original.visibility, after = draft.visibility
  const details: string[] = []
  if (before?.field !== after?.field) {
    details.push(pair(before ? fieldLabel(original, before.field) : 'No additional restriction',
      after ? fieldLabel(draft, after.field) : 'No additional restriction'))
  }
  const saved = before?.levels ?? [], proposed = after?.levels ?? []
  const ids = new Set([...saved, ...proposed].map(level => level.id))
  for (const id of ids) {
    const old = saved.find(level => level.id === id), next = proposed.find(level => level.id === id)
    if (old && next && JSON.stringify(old.holders) === JSON.stringify(next.holders)) continue
    const option = (schema: Declaration) => schema.fields?.find(f => f.code === schema.visibility?.field)?.options?.find(o => o.id === id)?.label
    const title = option(draft) || option(original) || humanize(id)
    const access = (level?: typeof old) => level ? level.holders.map(holderName).join(', ') || 'No extra access' : 'No level'
    details.push(`${title} · ${pair(access(old), access(next))}`)
  }
  if (before?.bypass !== after?.bypass) details.push(after?.bypass === 'admin' ? 'Board administrators can see every level.' : 'Visibility levels now apply to board administrators.')
  return details
}

const actions: Record<string, string> = {
  add: 'Added', added: 'Added', remove: 'Removed', removed: 'Removed', title: 'Title',
  name: 'Name', type: 'Kind', form: 'Stored value type', cardinality: 'Values allowed',
  label: 'Labels', index: 'Search support', shape: 'Settings changed', process: 'Process',
  initial: 'Starting state', migration: 'Existing items', 'options.add': 'Choice added',
  'options.remove': 'Choice removed', 'options.change': 'Choice updated',
  'state.add': 'State added', 'state.remove': 'State removed', 'state.map': 'Move existing items',
  'state.kind': 'State kind', 'state.category': 'State category', 'state.change': 'State settings updated',
  'state.name': 'State name', 'transition.add': 'Transition added', 'transition.remove': 'Transition removed',
  'transition.change': 'Transition settings updated', 'transition.name': 'Transition name',
  'views.remove': 'Saved view removed', 'automations.remove': 'Automation removed',
  'automation.type': 'Automation kind', invalid: 'Invalid settings',
}

function processChange(change: SchemaChange, before?: Process, after?: Process): ReviewCopy {
  const { what, detail, to } = change
  const process = after?.name || before?.name || 'Untitled workflow'
  const title = `${process} · ${actions[what] ?? 'Workflow changed'}`
  const oldState = what.startsWith('state.') ? before?.states.find(state => state.id === detail) : undefined
  const state = what.startsWith('state.') ? after?.states.find(state => state.id === detail) : undefined
  const oldTransition = what.startsWith('transition.') ? before?.transitions?.find(transition => transition.id === detail) : undefined
  const transition = what.startsWith('transition.') ? after?.transitions?.find(transition => transition.id === detail) : undefined
  let value = ''
  if (what === 'state.map') value = pair(stateTitle(oldState), stateTitle(after?.states.find(state => state.id === to)))
  else if (what === 'state.name') value = pair(stateTitle(oldState), stateTitle(state))
  else if (what === 'state.kind') value = `${stateTitle(state)} · ${pair(kindTitle(oldState?.kind), kindTitle(state?.kind))}`
  else if (what === 'state.category' && oldState && state) value = `${stateTitle(state)} · ${pair(categoryTitle(oldState.category), categoryTitle(state.category))}`
  else if (state || oldState) value = stateTitle(state ?? oldState)
  else if (what === 'transition.name' && oldTransition && transition) value = pair(transitionTitle(oldTransition), transitionTitle(transition))
  else if (transition && oldTransition && transition.to !== oldTransition.to) {
    const oldDestination = stateTitle(before?.states.find(state => state.id === oldTransition.to))
    const destination = stateTitle(after?.states.find(state => state.id === transition.to))
    return { title, details: [transitionTitle(transition), `Destination changes from ${oldDestination} to ${destination}.`] }
  }
  else if (what === 'transition.add' && transition && after) {
    const source = transition.from === 'any' ? 'Any state' : transition.from.map(id => stateTitle(after.states.find(state => state.id === id))).join(', ')
    const destination = stateTitle(after.states.find(state => state.id === transition.to))
    return { title, details: [transitionTitle(transition), pair(source, destination), ...(transition.auto ? ['Runs automatically.'] : [])] }
  }
  else if (transition) value = transitionTitle(transition)
  else if (oldTransition) value = transitionTitle(oldTransition)
  else if (what === 'initial') value = pair(stateTitle(before?.states.find(state => state.id === before.initial)), stateTitle(after?.states.find(state => state.id === after.initial)))
  else if (what === 'name') value = pair(before?.name || 'Untitled workflow', after?.name || 'Untitled workflow')
  return { title, details: value ? [value] : [] }
}

export function reviewCopy(change: SchemaChange, original: Declaration, draft: Declaration, holderName: (holder: Holder) => string): ReviewCopy {
  const { code, what, detail } = change
  if (code === 'schema' || what === 'visibility.remove') {
    if (what === 'policy') return { title: 'Board limits and defaults', details: policyChanges(original, draft) }
    if (what.startsWith('visibility')) return { title: 'Who can see items', details: visibilityChanges(original, draft, holderName) }
    if (what === 'key_prefix') return { title: 'Item key prefix', details: [pair(original.key_prefix ?? 'Default', draft.key_prefix ?? 'Default')] }
    const labels: Record<string, string> = { plugins: 'Board plugins changed', scopes: 'Saved query filters changed', 'rollup.recompute': 'Calculated totals will update' }
    return { title: labels[what] ?? 'Board settings changed', details: [] }
  }

  if (code.startsWith('process ')) {
    const id = code.slice('process '.length)
    return processChange(change, original.processes?.find(p => p.id === id), draft.processes?.find(p => p.id === id))
  }
  if (code.startsWith('item_type ')) {
    const id = code.slice('item_type '.length)
    const before = original.item_types?.find(type => type.id === id), after = draft.item_types?.find(type => type.id === id)
    const title = after?.title || before?.title || 'Item type'
    return { title: `${title} · ${actions[what] ?? 'Item type changed'}`, details: what === 'title' ? [pair(before?.title || 'Untitled item type', after?.title || 'Untitled item type')] : [] }
  }
  if (code.startsWith('relation ')) {
    const id = code.slice('relation '.length)
    const before = original.relation_types?.find(relation => relation.id === id), after = draft.relation_types?.find(relation => relation.id === id)
    const details = what === 'label' ? [pair([before?.outward, before?.inward].filter(Boolean).join(' / '), [after?.outward, after?.inward].filter(Boolean).join(' / '))] : []
    return { title: `${after?.outward || before?.outward || 'Link type'} · ${actions[what] ?? 'Link type changed'}`, details }
  }

  const after = draft.fields?.find(field => field.code === code)
  const before = original.fields?.find(field => after?.id !== undefined ? field.id === after.id : field.code === (what.startsWith('renamed from ') ? what.slice('renamed from '.length) : code))
  const field = after ?? before
  if (!field) return { title: actions[what] ?? 'Board settings changed', details: [] }
  const title = `${fieldTitle(field)} · ${what.startsWith('renamed from ') ? 'Field key' : actions[what] ?? 'Field settings changed'}`
  if (what.startsWith('options.')) {
    const savedOptions = before?.options ?? [], proposedOptions = after?.options ?? []
    const savedIndex = savedOptions.findIndex(option => option.id === detail)
    const proposedIndex = proposedOptions.findIndex(option => option.id === detail)
    const old = savedOptions[savedIndex], next = proposedOptions[proposedIndex]
    const label = next?.label || old?.label || 'Untitled choice'
    const details = old && next && old.label !== next.label ? [] : [label]
    if (old && next) {
      if (old.label !== next.label) details.push(pair(old.label || 'Untitled choice', next.label || 'Untitled choice'))
      if (old.category !== next.category) details.push(`Category · ${pair(old.category ? categoryTitle(old.category) : 'None', next.category ? categoryTitle(next.category) : 'None')}`)
      const oldOrder = old.order ?? savedIndex + 1, nextOrder = next.order ?? proposedIndex + 1
      if (oldOrder !== nextOrder) details.push(`Order · ${pair(oldOrder, nextOrder)}`)
      if (old.color !== next.color) details.push(`Color · ${pair(old.color ?? 'Default', next.color ?? 'Default')}`)
    }
    return { title, details }
  }
  if (what === 'title' && before && after) return { title, details: [pair(fieldTitle(before), fieldTitle(after))] }
  return { title, details: [] }
}
