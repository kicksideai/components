// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect,vi} from 'vitest'
import {ref} from 'vue'
import {mount,flushPromises} from '@vue/test-utils'
import {PrimeVuePlugin} from '@wippy-fe/theme/primevue-plugin'
import ManageRoot from './ManageRoot.vue'
const get=vi.hoisted(()=>vi.fn())
vi.mock('@wippy-fe/webcomponent-vue',()=>({useProps:()=>ref({entryId:'selected-extractor'})}))
vi.mock('@wippy-fe/proxy',()=>({on:()=>()=>{},loadByTagName:async()=>{}}))
vi.mock('../client',()=>({client:{get}}))
describe('Workspace component context',()=>{
 it('opens the component identified by the canonical entry-id prop',async()=>{
  get.mockResolvedValue({id:'selected-extractor',title:'Invoice reader',can_edit:false,field_count:1,status:'configured',retention:'2h',runs:[]})
  const wrapper=mount(ManageRoot,{global:{plugins:[PrimeVuePlugin]}})
  await flushPromises()
  expect(get).toHaveBeenCalledWith('selected-extractor')
  expect(wrapper.get('.stats').text()).toBe('1 field · Read access')
  expect(wrapper.findAll('[role=tab]').map(t=>t.text())).toEqual(['Test','Runs'])
  wrapper.unmount()
 })
})
