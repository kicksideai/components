// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect,vi} from 'vitest'
import {mount,flushPromises} from '@vue/test-utils'
import {PrimeVuePlugin} from '@wippy-fe/theme/primevue-plugin'
const {list,create}=vi.hoisted(()=>({list:vi.fn(),create:vi.fn()}))
vi.mock('../client',()=>({client:{list,create}}))
import ExtractorList from './ExtractorList.vue'
describe('Docscout page list',()=>{
 it('lists extractors and opens the one clicked',async()=>{
  list.mockResolvedValue({items:[{component_id:'a',updated_at:'2026-10-27T10:00:00Z',meta:{title:'Invoice reader',description:'Totals',field_count:'4'}}],truncated:false})
  const wrapper=mount(ExtractorList,{global:{plugins:[PrimeVuePlugin]}})
  await flushPromises()
  expect(wrapper.get('.card').text()).toContain('Invoice reader');expect(wrapper.get('.card').text()).toContain('4 fields')
  await wrapper.get('.card').trigger('click')
  expect(wrapper.emitted('open')?.[0]).toEqual(['a'])
 })
 it('marks extractors shared with the viewer by what they may do and counts a truncated list',async()=>{
  list.mockResolvedValue({items:[
   {component_id:'own',updated_at:'2026-10-27T10:00:00Z',access_level:15,meta:{title:'Mine',field_count:'1'}},
   {component_id:'run',updated_at:'2026-10-27T10:00:00Z',access_level:1,meta:{title:'Run only',field_count:'1',owner:'ana@example.com'}},
   {component_id:'edit',updated_at:'2026-10-27T10:00:00Z',access_level:3,meta:{title:'Editable',field_count:'1',owner:'ana@example.com'}},
  ],truncated:true})
  const wrapper=mount(ExtractorList,{global:{plugins:[PrimeVuePlugin]}})
  await flushPromises()
  const cards=wrapper.findAll('.card')
  expect(cards[0].find('.access').exists()).toBe(false)
  expect(cards[1].get('.access').text()).toBe('Shared · can run');expect(cards[1].text()).toContain('ana@example.com')
  expect(cards[2].get('.access').text()).toBe('Shared · can edit')
  expect(wrapper.get('.count').text()).toBe('3+')
 })
 it('creates an extractor with the default configuration and opens it',async()=>{
  list.mockResolvedValue({items:[],truncated:false});create.mockResolvedValue({component_id:'new-id'})
  const wrapper=mount(ExtractorList,{global:{plugins:[PrimeVuePlugin]}})
  await flushPromises()
  await wrapper.findAll('button').find(b=>b.text()==='New extractor')!.trigger('click')
  await wrapper.get('input[placeholder="Invoice reader"]').setValue('Contract reader')
  expect(wrapper.findAll('button').some(b=>b.text()==='Create extractor')).toBe(true)
  await wrapper.get('form.create-pane').trigger('submit')
  await flushPromises()
  expect(create).toHaveBeenCalledWith(expect.objectContaining({title:'Contract reader',config:expect.objectContaining({stages:expect.any(Object)})}))
  expect(wrapper.emitted('open')?.[0]).toEqual(['new-id'])
 })
})
