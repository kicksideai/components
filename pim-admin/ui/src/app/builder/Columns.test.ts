// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BuilderFields from './BuilderFields.vue'
import BuilderDimensions from './BuilderDimensions.vue'
import BuilderFamilies from './BuilderFamilies.vue'
import BuilderVocabularies from './BuilderVocabularies.vue'
import BuilderChannels from './BuilderChannels.vue'
import BuilderPlugins from './BuilderPlugins.vue'
import { createSchema, definitionFixtures } from '../../test/fixtures'

for (const [name, component] of [
  ['fields', BuilderFields], ['dimensions', BuilderDimensions], ['families', BuilderFamilies],
  ['vocabularies', BuilderVocabularies], ['channels and sources', BuilderChannels], ['plugins and scopes', BuilderPlugins],
] as const) {
  it(`gives ${name} one shared column template with headings and stable cells`, () => {
    const { draft, options } = definitionFixtures()
    const w = mount(component, { props: { catalogId: 'cat', draft, schema: createSchema(), options } })
    for (const list of w.findAll('.pim-definition-list')) {
      expect(list.get('.pim-definition-columns').text()).toContain('Name')
      const rows = list.findAll('.pim-definition-head')
      expect(rows).toHaveLength(4)
      const columns = rows[0].findAll('[data-column]').map(cell => cell.attributes('data-column'))
      expect(columns).toContain('name')
      for (const row of rows) {
        expect(row.get('.pim-definition-toggle').classes()).not.toContain('p-button')
      }
      if (name === 'fields') {
        expect(columns).toEqual(['lead', 'name', 'kind', 'details', 'actions'])
        expect(list.findAll('.pim-list-header p').map(item => item.text())).toEqual([
          'Used by A, A much longer definition title, Third, Fourth',
        ])
      }
    }
    expect(w.findAll('.pim-definition-list').length).toBeGreaterThan(0)
    w.unmount()
  })
}
it('omits the thin heading for lists of at most three definitions', () => {
  const w = mount(BuilderDimensions, { props: { schema: createSchema(), draft: { dimensions: definitionFixtures().draft.dimensions.slice(0, 3) } } })
  expect(w.find('.pim-definition-columns').exists()).toBe(false)
  w.unmount()
})
