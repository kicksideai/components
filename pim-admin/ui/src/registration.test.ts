// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { readFileSync, readdirSync } from 'node:fs'
import { expect, it } from 'vitest'
import { parse } from 'yaml'

it('mounts exactly the admin and settings components on System with both host inputs', () => {
  const { entries } = parse(readFileSync('../src/_index.yaml', 'utf8'))
  const views = entries.filter((entry: { meta?: { type?: string } }) => entry.meta?.type === 'view.component')
  expect(views.map((entry: { name: string }) => entry.name).sort()).toEqual(['admin', 'catalog_settings'])
  for (const view of views) {
    expect(view.meta).toMatchObject({ announced: true, auto_register: true, base_path: 'kickside-pim-admin' })
    expect(readdirSync('../static')).toContain(view.meta.entry_point)
  }
  expect(views.find((view: { name: string }) => view.name === 'catalog_settings').props.properties).toMatchObject({ 'catalog-id': { type: 'string' }, embedded: { type: 'boolean' } })
  expect(entries.find((entry: { name: string }) => entry.name === 'settings_tab')).toMatchObject({ component_tag: 'kickside-pim-admin', access: 'kickside.pim.api:apply_schema.endpoint' })
  expect(entries.some((entry: { meta?: { type?: string } }) => entry.meta?.type === 'ui.nav_item')).toBe(false)
})
