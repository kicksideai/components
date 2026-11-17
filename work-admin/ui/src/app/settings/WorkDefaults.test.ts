// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { host } from '@wippy-fe/proxy'
import WorkDefaults from './WorkDefaults.vue'
import { getButton } from '../../test/controls'
it('keeps defaults in the existing shared settings provider and links back to board settings', async () => {
  const w = mount(WorkDefaults); await flushPromises()
  expect(JSON.parse(w.get('kickside-settings-provider').attributes('config')!)).toMatchObject({ namespace: 'kickside.work' })
  await getButton(w, 'Board settings').trigger('click')
  expect(host.navigate).toHaveBeenCalledWith('/system/work'); w.unmount()
})
