// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import BuilderFields from './BuilderFields.vue'
import BuilderDimensions from './BuilderDimensions.vue'
import BuilderFamilies from './BuilderFamilies.vue'
import BuilderChannels from './BuilderChannels.vue'
import BuilderVocabularies from './BuilderVocabularies.vue'
import BuilderPlugins from './BuilderPlugins.vue'
import { pluginFixture, createSchema } from '../../test/fixtures'
const options = { types: [], scopes: [], plugins: [], link_kinds: [] }
const draft = () => ({
  aspects: [{ namespace: 'core', attributes: [{ code: 'name', type: 'kickside.pim.types:text' }, { code: 'title', type: 'kickside.pim.types:text' }] }],
  dimensions: [{ name: 'locale', members: ['en', 'fr'] }], vocabularies: [{ code: 'colors' }],
  families: [{ code: 'apparel', aspects: ['core'] }], channels: [{ id: 'web' }], sources: [{ id: 'feed' }],
})
for (const [name, component] of [['dimensions', BuilderDimensions], ['families', BuilderFamilies], ['channels and sources', BuilderChannels], ['vocabularies', BuilderVocabularies]] as const) {
  it(`keeps ${name} definitions collapsed until the row opens`, async () => {
    const w = mount(component, { props: { catalogId: 'cat', draft: draft(), schema: createSchema(), options } })
    expect(w.find('.pim-definition-body').exists()).toBe(false)
    expect(w.find('.pim-add-row').exists()).toBe(true)
    expect(w.get('.pim-definition-toggle').attributes('aria-expanded')).toBe('false')
    await w.get('.pim-definition-toggle').trigger('click')
    expect(w.get('.pim-definition-toggle').attributes('aria-expanded')).toBe('true')
    expect(w.find('.pim-definition-body').exists()).toBe(true)
    w.unmount()
  })
}
it('keeps plugin configuration collapsed while its state and switch remain visible', async () => {
  const w = mount(BuilderPlugins, { props: { draft: {}, schema: createSchema(), options: { ...options, plugins: [{ ...pluginFixture('stock'), title: 'Stock' }] } } })
  expect(w.find('.kx-settings-item-panel').exists()).toBe(false)
  expect(w.find('[role=switch]').exists()).toBe(true)
  await w.get('.kx-settings-item-expand').trigger('click')
  expect(w.find('.kx-settings-item-panel').exists()).toBe(true)
  w.unmount()
})
it('moves fields within their group without opening their forms', async () => {
  const declaration = reactive(draft())
  const w = mount(BuilderFields, { props: { draft: declaration, schema: createSchema(), options } })
  expect(w.find('.pim-definition-body').exists()).toBe(false)
  expect(w.find('[draggable="true"]').exists()).toBe(false)
  expect(w.find('[aria-label="Move Name earlier"]').exists()).toBe(false)
  expect(w.find('[aria-label="Move Title later"]').exists()).toBe(false)
  await w.get('[aria-label="Move Title earlier"]').trigger('click')
  expect(declaration.aspects[0].attributes.map(a => a.code)).toEqual(['title', 'name'])
  await w.get('[aria-label="Move Title later"]').trigger('click')
  expect(declaration.aspects[0].attributes.map(a => a.code)).toEqual(['name', 'title'])
  expect(w.find('.pim-definition-body').exists()).toBe(false)
  w.unmount()
})
it('leaves field order unchanged when editing a field', async () => {
  const declaration = reactive(draft())
  const w = mount(BuilderFields, { props: { draft: declaration, schema: createSchema(), options } })
  await w.findAll('.field-toggle')[1].trigger('click')
  await w.get('.pim-definition-body input').trigger('keydown', { key: 'ArrowUp', altKey: true })
  expect(declaration.aspects[0].attributes.map(a => a.code)).toEqual(['name', 'title'])
  w.unmount()
})

it.each([
  [BuilderFields, 'Field name', 'Add field', ' name ', true],
  [BuilderFields, 'Field group name', 'Add field group', ' core ', false],
  [BuilderDimensions, 'Dimension name', 'Add dimension', ' locale ', false],
  [BuilderVocabularies, 'Vocabulary name', 'Add vocabulary', ' colors ', false],
  [BuilderFamilies, 'Family name', 'Add family', ' apparel ', false],
  [BuilderFamilies, 'Requirement name', 'Add requirement', ' ready ', true],
  [BuilderChannels, 'Channel name', 'Add channel', ' web ', false],
  [BuilderChannels, 'Source name', 'Add source', ' feed ', false],
] as const)('explains a duplicate for %s (%s) and blocks both click and Enter', async (component, placeholder, label, duplicate, expand) => {
  const declaration = reactive({ ...draft(), families: [{ code: 'apparel', aspects: ['core'], requirements: [{ id: 'ready' }] }] })
  const w = mount(component, { props: { catalogId: 'cat', draft: declaration, schema: createSchema(), options } })
  try {
    if (expand && component === BuilderFamilies) await w.get('.pim-definition-toggle').trigger('click')
    const opener = w.findAll('button').find(b => b.text() === label)!
    expect(w.find(`input[placeholder="${placeholder}"]`).exists()).toBe(false)
    await opener.trigger('click')
    const input = w.get(`input[placeholder="${placeholder}"]`)
    const add = w.findAll('button').find(b => b.text() === label)!
    const before = JSON.stringify(declaration)
    await input.setValue(duplicate)
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(w.findAll('[role=status]').some(status => status.text().includes('already in use'))).toBe(true)
    expect(add.attributes('disabled')).toBeDefined()
    await add.trigger('click')
    await input.trigger('keydown', { key: 'Enter' })
    expect(JSON.stringify(declaration)).toBe(before)
    await input.setValue(' available ')
    expect(input.attributes('aria-invalid')).not.toBe('true')
    expect(add.attributes('disabled')).toBeUndefined()
    await input.trigger('keydown', { key: 'Enter' })
    expect(JSON.stringify(declaration)).not.toBe(before)
    expect(w.find(`input[placeholder="${placeholder}"]`).exists()).toBe(false)
    await w.findAll('button').find(b => b.text() === label)!.trigger('click')
    expect((w.get(`input[placeholder="${placeholder}"]`).element as HTMLInputElement).value).toBe('')
  } finally { w.unmount() }
})
