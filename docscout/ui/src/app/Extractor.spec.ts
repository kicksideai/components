// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect,vi} from 'vitest'
import {mount,flushPromises,config} from '@vue/test-utils'
import {PrimeVuePlugin} from '@wippy-fe/theme/primevue-plugin'
config.global.plugins=[PrimeVuePlugin]
const pending=vi.hoisted(()=>new Map<string,(v:unknown)=>void>())
vi.mock('@wippy-fe/proxy',()=>({on:()=>()=>{},loadByTagName:async()=>{},api:{}}))
vi.mock('../client',()=>({client:{
 get:(id:string)=>new Promise(resolve=>pending.set(id,resolve)),
 evaluations:async()=>[],
}}))
import Extractor from './Extractor.vue'
const snapshot=(id:string,title:string)=>({id,title,field_count:0,status:'configured',can_edit:false,retention:'2h',runs:[]})
describe('Extractor page',()=>{
 it('keeps a slow answer for the previous extractor off the current one',async()=>{
  const w=mount(Extractor,{props:{id:'a',back:true}})
  await w.setProps({id:'b'})
  pending.get('b')!(snapshot('b','Contract reader'));await flushPromises()
  pending.get('a')!(snapshot('a','Invoice reader'));await flushPromises()
  expect(w.text()).toContain('Contract reader')
  expect(w.text()).not.toContain('Invoice reader')
 })
})
