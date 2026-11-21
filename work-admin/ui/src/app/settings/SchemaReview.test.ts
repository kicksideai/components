// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import SchemaReview from './SchemaReview.vue'
import type { Declaration } from '../../types'

it('explains choice, policy and visibility changes from the saved and reviewed definitions', () => {
  const original: Declaration = {
    fields: [{ code: 'priority_code', title: 'Priority', form: 'text', type: 'option', options: [{ id: '42', label: 'Routine' }] }],
    policy: { comments_per_item: 10 },
  }
  const declaration: Declaration = {
    fields: [{ ...original.fields![0], options: [{ id: '42', label: 'Standard priority' }] }],
    policy: { comments_per_item: 24 },
    visibility: { field: 'priority_code', levels: [] },
  }
  const w = mount(SchemaReview, { props: { original, declaration, generation: 1, follows: [], configCount: 0,
    plan: { class: 'semantic', generation: 2, refused: [], changes: [
      { code: 'priority_code', what: 'options.change', detail: '42', class: 'cosmetic' },
      { code: 'schema', what: 'policy', class: 'cosmetic' },
      { code: 'schema', what: 'visibility', class: 'semantic' },
    ] } } })
  const rows = w.findAll('tbody tr').map(row => row.text())
  expect(rows[0]).toContain('Priority')
  expect(rows[0]).toContain('Routine')
  expect(rows[0]).toContain('Standard priority')
  expect(rows[0]).not.toMatch(/priority_code|options\.change|42/)
  expect(rows[1]).toContain('Comments per item')
  expect(rows[1]).toContain('10')
  expect(rows[1]).toContain('24')
  expect(rows[2]).toContain('No additional restriction')
  expect(rows[2]).toContain('Priority')
  w.unmount()
})

it('shows a readable refusal with the backend reason code', () => {
  const field = { code: 'priority_code', title: 'Priority', form: 'text' as const, type: 'option',
    options: [{ id: '42', label: 'Routine' }, { id: 'critical', label: 'Critical' }] }
  const refused = { code: field.code, what: 'options.remove', detail: '42', class: 'refused' }
  const w = mount(SchemaReview, { props: {
    original: { fields: [field] },
    declaration: { fields: [{ ...field, options: field.options.slice(1) }] },
    generation: 1, follows: [], configCount: 0,
    plan: { class: 'refused', generation: 2, refused: [refused], changes: [refused, { ...refused, what: 'options.change', detail: 'critical', class: 'cosmetic' }],
      migration: 'add the new field or option, copy the values with apply commands, then remove the old one' },
  } })
  expect(w.get('.work-notice').text()).toContain('Copy existing values into it before removing the old field.')
  const alert = w.get('[role=alert]')
  expect(alert.text()).toContain('Priority')
  expect(alert.text()).toContain('Routine')
  expect(alert.text()).toContain('Items still hold values in this option field.')
  expect(alert.text()).toContain('Technical details')
  expect(alert.get('code').text()).toBe('options.remove')
  expect(alert.text()).not.toMatch(/priority_code|42/)
  expect(w.get('tbody tr').text()).toContain('Critical')
  expect(w.get('tbody tr').text()).toContain('Order · 2 → 1')
  w.unmount()
})
