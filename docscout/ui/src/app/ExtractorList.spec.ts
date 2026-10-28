// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect,vi} from 'vitest'
import {mount,flushPromises} from '@vue/test-utils'
import {ref} from 'vue'
import {HOST_VISIBILITY_PROVIDER} from '@wippy-fe/webcomponent-vue'
import {config} from '@vue/test-utils'
import {PrimeVuePlugin} from '@wippy-fe/theme/primevue-plugin'
config.global.provide={[HOST_VISIBILITY_PROVIDER as symbol]:ref(null)}
const {list,create}=vi.hoisted(()=>({list:vi.fn(),create:vi.fn()}))
vi.mock('@wippy-fe/proxy',()=>({loadByTagName:async()=>{},api:{}}))
vi.mock('../client',()=>({client:{list,create}}))
import ExtractorList from './ExtractorList.vue'
import type {ExtractorItem} from '../client'
describe('Docscout page list',()=>{
 it('appends pages using the opaque cursor and hides Load more on the last page',async()=>{
  list.mockReset().mockResolvedValueOnce({items:[{component_id:'a',meta:{title:'First'},updated_at:'2026-10-28T00:00:00Z'}],next_cursor:'opaque/+=='}).mockResolvedValueOnce({items:[{component_id:'b',meta:{title:'Second'},updated_at:'2026-10-28T00:00:00Z'}]})
  const w=mount(ExtractorList,{global:{plugins:[PrimeVuePlugin]}})
  await flushPromises()
  await w.findAll('button').find(b=>b.text()==='Load more')!.trigger('click');await flushPromises()
  expect(list).toHaveBeenLastCalledWith({filter:'',cursor:'opaque/+=='})
  expect(w.findAll('.card').map(card=>card.text())).toEqual([expect.stringContaining('First'),expect.stringContaining('Second')])
  expect(w.findAll('button').some(b=>b.text()==='Load more')).toBe(false)
  w.unmount()
 })
 it('filters on the server, resets the cursor and keeps filtering available for empty results',async()=>{
  list.mockReset().mockResolvedValueOnce({items:[{component_id:'a',meta:{title:'Initial'},updated_at:'2026-10-28T00:00:00Z'}],next_cursor:'old'}).mockResolvedValueOnce({items:[{component_id:'b',meta:{title:'Server match'},updated_at:'2026-10-28T00:00:00Z'}]}).mockResolvedValueOnce({items:[]})
  const w=mount(ExtractorList,{global:{plugins:[PrimeVuePlugin]}})
  await flushPromises()
  await w.get('[aria-label="Filter extractors"]').setValue('invoice');await flushPromises()
  expect(list).toHaveBeenLastCalledWith({filter:'invoice'})
  expect(w.get('.card').text()).toContain('Server match')
  expect(w.text()).not.toContain('Initial')
  await w.get('[aria-label="Filter extractors"]').setValue('missing');await flushPromises()
  expect(w.text()).toContain('No extractors match.')
  expect(w.find('[aria-label="Filter extractors"]').exists()).toBe(true)
  w.unmount()
 })
 it('drops an obsolete page after the filter changes',async()=>{
  let finish:(value:unknown)=>void=()=>{}
  list.mockReset().mockResolvedValueOnce({items:[{component_id:'a',meta:{title:'Initial'},updated_at:'2026-10-28T00:00:00Z'}],next_cursor:'old'}).mockImplementationOnce(()=>new Promise(resolve=>{finish=resolve})).mockResolvedValueOnce({items:[{component_id:'b',meta:{title:'Current match'},updated_at:'2026-10-28T00:00:00Z'}]})
  const w=mount(ExtractorList,{global:{plugins:[PrimeVuePlugin]}})
  await flushPromises()
  await w.findAll('button').find(b=>b.text()==='Load more')!.trigger('click')
  await w.get('[aria-label="Filter extractors"]').setValue('current');await flushPromises()
  finish({items:[{component_id:'old',meta:{title:'Obsolete page'}}],next_cursor:'obsolete'});await flushPromises()
  expect(w.findAll('.card').map(card=>card.text())).toEqual([expect.stringContaining('Current match')])
  expect(w.findAll('button').some(b=>b.text()==='Load more')).toBe(false)
  w.unmount()
 })
 it.each(['success','failure'])('ignores a pending %s after unmount',async outcome=>{
  let resolve:(value:unknown)=>void=()=>{},reject:(reason:Error)=>void=()=>{}
  list.mockReset().mockImplementation(()=>new Promise((accept,decline)=>{resolve=accept;reject=decline}))
  const w=mount(ExtractorList,{global:{plugins:[PrimeVuePlugin]}})
  const state=w.vm as unknown as {items?:ExtractorItem[];error:string}
  w.unmount()
  if(outcome==='success')resolve({items:[{component_id:'late',meta:{title:'Late reader'}}],})
  else reject(new Error('Late failure'))
  await flushPromises()
  expect(state.items).toBeUndefined()
  expect(state.error).toBe('')
 })
 it('refreshes the list when the host reveals a retained page',async()=>{
  list.mockReset().mockResolvedValueOnce({items:[],}).mockResolvedValueOnce({items:[{component_id:'fresh',meta:{title:'Fresh reader'},updated_at:'2026-10-28T00:00:00Z'}],})
  const visible=ref<boolean|null>(true)
  const w=mount(ExtractorList,{global:{plugins:[PrimeVuePlugin],provide:{[HOST_VISIBILITY_PROVIDER as symbol]:visible}}})
  await flushPromises()
  expect(list).toHaveBeenCalledTimes(1)
  visible.value=false;await w.vm.$nextTick()
  visible.value=true;await flushPromises()
  expect(w.get('.card').text()).toContain('Fresh reader')
  expect(list).toHaveBeenCalledTimes(2)
  w.unmount()
 })
 it('lists extractors and opens the one clicked',async()=>{
  list.mockResolvedValue({items:[{component_id:'a',updated_at:'2026-10-27T10:00:00Z',meta:{title:'Invoice reader',description:'Totals',field_count:'4'}}],})
  const wrapper=mount(ExtractorList,{global:{plugins:[PrimeVuePlugin]}})
  await flushPromises()
  expect(wrapper.get('.card').classes()).toContain('kx-focus-halo')
  expect(wrapper.get('.card').text()).toContain('Invoice reader');expect(wrapper.get('.card').text()).toContain('4 fields')
  await wrapper.get('.card').trigger('click')
  expect(wrapper.emitted('open')?.[0]).toEqual(['a'])
 })
 it('marks extractors shared with the viewer by what they may do and counts a continued list',async()=>{
  list.mockResolvedValue({items:[
   {component_id:'own',updated_at:'2026-10-27T10:00:00Z',access_level:15,meta:{title:'Mine',field_count:'1'}},
   {component_id:'run',updated_at:'2026-10-27T10:00:00Z',access_level:1,meta:{title:'Run only',field_count:'1',owner:'member@example.com'}},
   {component_id:'edit',updated_at:'2026-10-27T10:00:00Z',access_level:3,meta:{title:'Editable',field_count:'1',owner:'member@example.com'}},
  ],next_cursor:'opaque/+=='})
  const wrapper=mount(ExtractorList,{global:{plugins:[PrimeVuePlugin]}})
  await flushPromises()
  const cards=wrapper.findAll('.card')
  expect(cards[0].find('.access').exists()).toBe(false)
  expect(cards[1].get('.access').text()).toBe('Shared · can run');expect(cards[1].text()).toContain('member@example.com')
  expect(cards[2].get('.access').text()).toBe('Shared · can edit')
  expect(wrapper.get('.count').text()).toBe('3+')
 })
 it('creates an extractor with the default configuration and opens it',async()=>{
  list.mockResolvedValue({items:[],});create.mockResolvedValue({component_id:'new-id'})
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
