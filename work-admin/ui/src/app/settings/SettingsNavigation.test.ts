// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { readFileSync } from 'node:fs'
import { beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { parse } from 'yaml'
import { host } from '@wippy-fe/proxy'
import { work } from '../../api'
import AdminApp from './AdminApp.vue'
import { getButton } from '../../test/controls'
vi.mock('../../api', () => ({ work: { boards: vi.fn().mockResolvedValue([]), packs: vi.fn().mockResolvedValue([]) } }))
beforeEach(() => { vi.mocked(work.boards).mockResolvedValue([]); vi.mocked(work.packs).mockResolvedValue([]) })
it('links board administration to application defaults', async () => {
  const w = mount(AdminApp); await flushPromises()
  try { await getButton(w, 'Application defaults').trigger('click'); expect(host.navigate).toHaveBeenCalledWith('/system/settings') }
  finally { w.unmount() }
})
it('keeps application defaults in the shared settings namespace and announces its navigation wrapper', () => {
  const { entries } = parse(readFileSync('../src/_index.yaml', 'utf8'))
  expect(entries.find((e: { name: string }) => e.name === 'defaults_block')).toMatchObject({ namespace: 'kickside.work', component_tag: 'kickside-work-defaults', key: 'kickside.work' })
  expect(entries.find((e: { name: string }) => e.name === 'defaults')).toMatchObject({ meta: { type: 'view.component', tag_name: 'kickside-work-defaults' } })
})
