// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect,vi,afterEach} from 'vitest'
import {mount,flushPromises,config} from '@vue/test-utils'
import {ref} from 'vue'
import {HOST_VISIBILITY_PROVIDER} from '@wippy-fe/webcomponent-vue'
import {PrimeVuePlugin} from '@wippy-fe/theme/primevue-plugin'
config.global.plugins=[PrimeVuePlugin]
config.global.provide={[HOST_VISIBILITY_PROVIDER as symbol]:ref(null)}
const state=vi.hoisted(()=>({pending:new Map<string,(v:unknown)=>void>(),evaluations:[] as unknown[],get:null as null|((id:string)=>Promise<unknown>),listCalls:0,listGet:null as null|(()=>Promise<unknown[]>),addCase:vi.fn(),handlers:new Map<string,()=>void>(),disposed:vi.fn()}))
vi.mock('@wippy-fe/proxy',()=>({on:(topic:string,handler:()=>void)=>{state.handlers.set(topic,handler);return ()=>{state.handlers.delete(topic);state.disposed(topic)}},loadByTagName:async()=>{},api:{}}))
vi.mock('../client',()=>({client:{
 addCase:state.addCase,
 get:(id:string)=>state.get?state.get(id):new Promise(resolve=>state.pending.set(id,resolve)),
 evaluations:async()=>{state.listCalls++;return state.listGet?state.listGet():state.evaluations},
 evaluation:async(_id:string,eval_id:string)=>state.evaluations.find(e=>(e as {id:string}).id===eval_id),
}}))
import Extractor from './Extractor.vue'
import {newConfig} from '../config'
const snapshot=(id:string,title:string,can_edit=false)=>({id,title,field_count:1,status:'configured',can_edit,can_share:can_edit,retention:'2h',runs:[],...(can_edit?{expected_revision:1,config:newConfig(),cases:[]}:{})})
const evaluation=(id:string,status:string)=>({id,status,config_revision:1,fields:[],case_count:1,metrics:[],tokens:0,duration_ms:0,created_at:'2026-10-28T00:00:00Z',results:[]})
afterEach(()=>{vi.useRealTimers();state.get=null;state.listCalls=0;state.evaluations=[];state.listGet=null;state.pending.clear();state.handlers.clear();state.disposed.mockClear();state.addCase.mockReset()})
describe('Extractor page',()=>{
 it('reports the admitted case id to the editor after a successful add',async()=>{
  state.get=async()=>snapshot('x','Reader',true)
  state.addCase.mockResolvedValue({id:'saved-case'})
  const w=mount(Extractor,{props:{id:'x'}})
  await flushPromises()
  const page=w.findComponent({name:'DocscoutPage'})
  page.vm.$emit('add-case',{upload_id:'upload',expected:{total:10}});await flushPromises()
  expect(state.addCase).toHaveBeenCalledWith('x',{upload_id:'upload',expected:{total:10}})
  expect(page.props('addedCaseId')).toBe('saved-case')
  w.unmount()
 })
 it('preserves a local draft when a chat save wakes the open view and lets it reload committed configuration',async()=>{
  const initial=snapshot('x','Reader',true)
  let committed=initial
  state.get=async()=>committed
  const w=mount(Extractor,{props:{id:'x'}})
  await flushPromises()
  await w.findAll('button').find(button=>button.text()==='Details')!.trigger('click')
  await w.get('[aria-label="Extractor name"]').setValue('Local draft')
  committed={...initial,title:'Chat configured',expected_revision:2}
  state.handlers.get('component.x')!();await flushPromises()
  expect((w.get('[aria-label="Extractor name"]').element as HTMLInputElement).value).toBe('Local draft')
  expect(w.get('[role=status]').text()).toContain('Saved configuration changed')
  await w.findAll('button').find(button=>button.text()==='Reload saved')!.trigger('click')
  expect((w.get('[aria-label="Extractor name"]').element as HTMLInputElement).value).toBe('Chat configured')
  expect(w.find('[role=status]').exists()).toBe(false)
  w.unmount()
 })
 it('reads committed chat configuration, cases, evaluations and own runs on their topics',async()=>{
  const initial=snapshot('x','Reader',true)
  let committed:unknown=initial
  state.get=async()=>committed
  state.evaluations=[evaluation('eval','running')]
  const w=mount(Extractor,{props:{id:'x'}})
  await flushPromises()
  const updated={...initial,title:'Chat configured',expected_revision:2,cases:[{id:'case',upload_id:'upload',upload_name:'Document',expected:{}}]}
  committed=updated
  state.evaluations=[evaluation('eval','completed')]
  state.handlers.get('component.x')!();await flushPromises()
  const page=w.findComponent({name:'DocscoutPage'})
  expect(page.props('snapshot')).toMatchObject({title:'Chat configured',expected_revision:2,cases:[{id:'case'}]})
  expect(page.props('evaluation')).toMatchObject({status:'completed'})
  committed={...updated,runs:[{id:'run',caller:'agent',status:'completed',upload_id:'upload',duration_ms:10,tokens:20,created_at:'2026-10-28T00:00:00Z',expires_at:'2026-10-28T02:00:00Z'}]}
  state.handlers.get('docscout.runs.x')!();await flushPromises()
  expect(page.props('snapshot')).toMatchObject({runs:[{id:'run'}]})
  await w.setProps({id:'other'})
  expect(state.handlers.has('component.x')).toBe(false)
  expect(state.handlers.has('docscout.runs.x')).toBe(false)
  expect(state.handlers.has('component.other')).toBe(true)
  expect(state.handlers.has('docscout.runs.other')).toBe(true)
  w.unmount()
 })
 it('disposes the subscription once when the extractor selection is cleared',async()=>{
  const w=mount(Extractor,{props:{id:'x'}})
  await w.setProps({id:''})
  expect(state.disposed).toHaveBeenCalledTimes(2)
  w.unmount()
  expect(state.disposed).toHaveBeenCalledTimes(2)
 })
 it('keeps obsolete evaluation reads from replacing the newest list',async()=>{
  const answers:((items:unknown[])=>void)[]=[]
  state.get=async()=>snapshot('x','Reader',true)
  state.listGet=()=>new Promise(resolve=>answers.push(resolve))
  const w=mount(Extractor,{props:{id:'x'}})
  await flushPromises()
  state.handlers.get('component.x')!();await flushPromises()
  state.evaluations=[evaluation('fresh','completed')]
  answers[1](state.evaluations);await flushPromises()
  answers[0]([evaluation('obsolete','completed')]);await flushPromises()
  const page=w.findComponent({name:'DocscoutPage'})
  expect((page.props('evaluations') as {id:string}[]).map(item=>item.id)).toEqual(['fresh'])
  w.unmount()
 })
 it('subscribes before the initial read and refreshes a retained view on reveal',async()=>{
  const visible=ref<boolean|null>(true)
  state.get=vi.fn(async()=>{
   expect(state.handlers.has('component.x')).toBe(true)
   expect(state.handlers.has('docscout.runs.x')).toBe(true)
   return snapshot('x','Reader')
  })
  const w=mount(Extractor,{props:{id:'x'},global:{provide:{[HOST_VISIBILITY_PROVIDER as symbol]:visible}}})
  await flushPromises()
  expect(state.get).toHaveBeenCalledTimes(1)
  visible.value=false;await w.vm.$nextTick()
  visible.value=true;await flushPromises()
  expect(state.get).toHaveBeenCalledTimes(2)
  w.unmount();expect(state.disposed).toHaveBeenCalledTimes(2)
 })
 it('keeps the newest overlapping read for the same extractor',async()=>{
  const answers:((value:unknown)=>void)[]=[]
  state.get=()=>new Promise(resolve=>answers.push(resolve))
  const w=mount(Extractor,{props:{id:'x'}})
  state.handlers.get('component.x')!()
  answers[1](snapshot('x','Current reader'));await flushPromises()
  answers[0](snapshot('x','Obsolete reader'));await flushPromises()
  expect(w.text()).toContain('Current reader')
  expect(w.text()).not.toContain('Obsolete reader')
  w.unmount()
 })
 it('stops a pending read after unmount before loading evaluations',async()=>{
  const w=mount(Extractor,{props:{id:'x'}})
  w.unmount()
  state.pending.get('x')!(snapshot('x','Reader',true));await flushPromises()
  expect(state.listCalls).toBe(0)
  expect(state.disposed).toHaveBeenCalledTimes(2)
 })
 it('keeps a slow answer for the previous extractor off the current one',async()=>{
  const w=mount(Extractor,{props:{id:'a',back:true}})
  await w.setProps({id:'b'})
  state.pending.get('b')!(snapshot('b','Contract reader'));await flushPromises()
  state.pending.get('a')!(snapshot('a','Invoice reader'));await flushPromises()
  expect(w.text()).toContain('Contract reader')
  expect(w.text()).not.toContain('Invoice reader')
 })
 it('refreshes active evaluations on notifications without polling, keeps the open evaluation and disposes both topics',async()=>{
  vi.useFakeTimers()
  state.get=async()=>snapshot('x','Reader',true)
  state.evaluations=[evaluation('new','running'),evaluation('old','completed')]
  const w=mount(Extractor,{props:{id:'x'}})
  await flushPromises()
  const page=w.findComponent({name:'DocscoutPage'})
  page.vm.$emit('open-evaluation','old');await flushPromises()
  const before=state.listCalls
  await vi.advanceTimersByTimeAsync(10000)
  expect(state.listCalls).toBe(before)
  state.handlers.get('component.x')!();await flushPromises()
  expect(state.listCalls).toBe(before+1)
  expect((page.props('evaluation') as {id:string}).id).toBe('old')
  w.unmount()
  expect(state.handlers.size).toBe(0)
  expect(state.disposed).toHaveBeenCalledWith('component.x')
  expect(state.disposed).toHaveBeenCalledWith('docscout.runs.x')
  const after=state.listCalls
  await vi.advanceTimersByTimeAsync(10000)
  expect(state.listCalls).toBe(after)
 })
})
