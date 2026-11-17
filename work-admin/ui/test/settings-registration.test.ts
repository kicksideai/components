// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from 'yaml'
import { expect, it } from 'vitest'

type Entry = { name: string; meta?: Record<string, unknown>; events?: Record<string, unknown>; props?: { properties: Record<string, unknown> }; policy?: { resources: string[]; actions: string[] | string } }
const root = resolve('..')
const entries = (path: string) => (parse(readFileSync(resolve(root, path), 'utf8')) as { entries: Entry[] }).entries
it('announces the shared settings component with both host inputs and an emitted bundle', () => {
  const entry = entries('src/_index.yaml').find(entry => entry.name === 'board_settings')!
  expect(entry.meta).toMatchObject({ type: 'view.component', announced: true, auto_register: true, tag_name: 'kickside-work-board-settings', base_path: 'kickside-work-admin', entry_point: 'settings.js' })
  expect(entry.props?.properties).toHaveProperty('board-id')
  expect(entry.props?.properties).toHaveProperty('embedded')
  expect(entry.events?.['dirty-change']).toMatchObject({ type: 'object', properties: { dirty: { type: 'boolean' } }, required: ['dirty'] })
  expect(existsSync(resolve(root, 'static/settings.js'))).toBe(true)
  const access = entries('src/security/_index.yaml')
  for (const name of ['module_access', 'member_endpoints']) expect(access.find(entry => entry.name === name)?.policy?.resources).toContain('kickside.work.admin:board_settings')
})
