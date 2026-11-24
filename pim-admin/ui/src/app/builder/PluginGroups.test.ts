// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BuilderPlugins from './BuilderPlugins.vue'
import { createSchema, pluginFixture } from '../../test/fixtures'

const options = { types: [], scopes: [], plugins: [], link_kinds: [] }

it('groups plugins by purpose with enabled plugins first and states what each needs', () => {
  const schema = createSchema()
  const plugins = [
    { ...pluginFixture('app:search'), title: 'Search', category: 'Search', description: 'Find products by text.' },
    { ...pluginFixture('app:shelves'), title: 'Shelves', category: 'Inventory' },
    { ...pluginFixture('app:labels'), title: 'Labels', requires: ['app:search'] },
    { ...pluginFixture('app:stock'), title: 'Stock', category: 'Inventory' },
  ]
  schema.plugins = [{ ...plugins[3], active: true }]
  const w = mount(BuilderPlugins, { props: { draft: { plugins: [{ use: 'app:stock' }, { use: 'app:labels' }] }, schema,
    options: { ...options, plugins, scopes: [{ id: 'app:stock_filter', title: 'Stock levels', access: 'read', filters: {} }] } } })
  try {
    const groups = w.findAll('.kx-settings-group').map(group => [group.find('h2').text(), group.findAll('.kx-settings-item-title').map(title => title.text())])
    expect(groups).toEqual([['Inventory', ['Stock', 'Shelves']], ['Search', ['Search']], ['Other', ['Labels']], ['Product filters', ['Stock levels']]])
    const item = (title: string) => w.findAll('.kx-settings-item').find(row => row.get('.kx-settings-item-title').text() === title)!
    expect(item('Search').get('.kx-settings-item-desc').text()).toBe('Find products by text.')
    expect(item('Search').get('.kx-settings-item-meta').text()).toBe('Used by Labels')
    expect(item('Labels').get('.kx-settings-item-meta').text()).toBe('Needs Search')
    expect(item('Stock').get('.pim-plugin-state').text()).toBe('Enabled')
    expect(item('Labels').get('.pim-plugin-state').text()).toBe('Turns on when applied')
    expect(item('Shelves').get('.pim-plugin-state').text()).toBe('Available')
    for (const head of w.findAll('.kx-settings-item-head')) expect(head.text()).not.toMatch(/app:/)
  } finally { w.unmount() }
})
