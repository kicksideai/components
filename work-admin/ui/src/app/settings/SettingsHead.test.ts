// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { getButton } from '../../test/controls'
import { expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SettingsHead from './SettingsHead.vue'
it('keeps the embedded detail header concise and shows pack provenance without repeating generation', async () => {
  const w = mount(SettingsHead, { props: { embedded: true, board: { board_id: 'b', title: 'Delivery', description: 'Plan team work.' }, generation: 4, authorized: true, dirty: false, busy: false, checkingRemoval: false, reviewed: false, disabled: true } })
  try {
    expect(w.find('.kx-head').exists()).toBe(false); expect(w.get('.kx-head-sub').text()).toBe('Plan team work.')
    await w.setProps({ pack: { version: '1.0.0' }, packTitle: 'Delivery flow', outdated: true })
    expect(w.get('.kx-head-sub').text()).toBe('Delivery flow 1.0.0 · Outdated')
    expect(w.text().match(/Generation 4/g)).toHaveLength(1)
    const upgrade = getButton(w, 'Upgrade pack')
    expect(upgrade.exists()).toBe(true); expect(upgrade.attributes('disabled')).toBeDefined()
  } finally { w.unmount() }
})
