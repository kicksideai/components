// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FieldsEditor from './FieldsEditor.vue'
import TypesEditor from './TypesEditor.vue'
import RelationsEditor from './RelationsEditor.vue'
import PluginsEditor from './PluginsEditor.vue'
import { schema } from '../../test/fixtures'

const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => wrappers.splice(0).forEach(w => w.unmount()))

it('gives short and long titles separate code, kind, flag, usage and action columns', () => {
  const draft = schema().declaration
  draft.fields = [
    { code: 'short', title: 'A', form: 'text' },
    { code: 'long', title: 'A much longer field name', form: 'int', track: true },
    { code: 'third', form: 'text' }, { code: 'fourth', form: 'text' },
  ]
  const w = mount(FieldsEditor, { attachTo: document.body, props: { draft, advanced: false } }); wrappers.push(w)
  const rows = w.findAll('.work-definition-head')
  expect(w.get('.work-definition-columns').text()).toContain('NameCodeKindDetailsUsed by')
  expect(rows.map(row => row.get('.work-definition-code').text())).toEqual(['short', 'long', 'third', 'fourth'])
  expect(rows.map(row => row.get('.work-definition-kind').text())).toEqual(['Text', 'Int', 'Text', 'Text'])
  expect(rows[1].text()).toContain('Tracked')
})

it('uses one list per definition family and omits unused columns for the entire list', () => {
  const draft = schema().declaration
  const types = mount(TypesEditor, { props: { draft } }); wrappers.push(types)
  const relations = mount(RelationsEditor, { props: { draft } }); wrappers.push(relations)
  const plugins = mount(PluginsEditor, { props: { draft, schema: schema(), boardId: 'b', options: [], configs: {} } }); wrappers.push(plugins)
  expect(types.get('.work-field-builder').classes()).toContain('work-definitions-types')
  expect(relations.get('.work-field-builder').classes()).toContain('work-definitions-relations')
  expect(plugins.get('.work-field-builder').classes()).toContain('work-definitions-plugins')
})
