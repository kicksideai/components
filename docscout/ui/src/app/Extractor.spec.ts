// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect,vi,afterEach} from 'vitest'
import {mount,flushPromises,config} from '@vue/test-utils'
import {PrimeVuePlugin} from '@wippy-fe/theme/primevue-plugin'
config.global.plugins=[PrimeVuePlugin]
const state=vi.hoisted(()=>({pending:new Map<string,(v:unknown)=>void>(),evaluations:[] as unknown[],get:null as null|((id:string)=>Promise<unknown>),listCalls:0}))
vi.mock('@wippy-fe/proxy',()=>({on:()=>()=>{},loadByTagName:async()=>{},api:{}}))
vi.mock('../client',()=>({client:{
 get:(id:string)=>state.get?state.get(id):new Promise(resolve=>state.pending.set(id,resolve)),
 evaluations:async()=>{state.listCalls++;return state.evaluations},
 evaluation:async(_id:string,eval_id:string)=>state.evaluations.find(e=>(e as {id:string}).id===eval_id),
}}))
import Extractor from './Extractor.vue'
import {newConfig} from '../config'
const snapshot=(id:string,title:string,can_edit=false)=>({id,title,field_count:1,status:'configured',can_edit,can_share:can_edit,retention:'2h',runs:[],...(can_edit?{expected_revision:1,config:newConfig(),cases:[]}:{})})
const evaluation=(id:string,status:string)=>({id,status,config_revision:1,fields:[],case_count:1,metrics:[],tokens:0,duration_ms:0,created_at:'2026-10-28T00:00:00Z',results:[]})
afterEach(()=>{vi.useRealTimers();state.get=null;state.listCalls=0;state.evaluations=[];state.pending.clear()})
describe('Extractor page',()=>{
 it('keeps a slow answer for the previous extractor off the current one',async()=>{
  const w=mount(Extractor,{props:{id:'a',back:true}})
  await w.setProps({id:'b'})
  state.pending.get('b')!(snapshot('b','Contract reader'));await flushPromises()
  state.pending.get('a')!(snapshot('a','Invoice reader'));await flushPromises()
  expect(w.text()).toContain('Contract reader')
  expect(w.text()).not.toContain('Invoice reader')
 })
 it('keeps refreshing while an evaluation runs, even with an older one open, and stops after unmount',async()=>{
  vi.useFakeTimers()
  state.get=async()=>snapshot('x','Reader',true)
  state.evaluations=[evaluation('new','running'),evaluation('old','completed')]
  const w=mount(Extractor,{props:{id:'x'}})
  await flushPromises()
  const page=w.findComponent({name:'DocscoutPage'})
  page.vm.$emit('open-evaluation','old');await flushPromises()
  const before=state.listCalls
  await vi.advanceTimersByTimeAsync(2100)
  expect(state.listCalls).toBeGreaterThan(before)
  expect((page.props('evaluation') as {id:string}).id).toBe('old')
  w.unmount()
  const after=state.listCalls
  await vi.advanceTimersByTimeAsync(10000)
  expect(state.listCalls).toBe(after)
 })
})
