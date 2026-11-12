// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect,vi} from 'vitest'
import {mount} from '@vue/test-utils'
import {newConfig} from '../config'
import StepInspector from './StepInspector.vue'
import ResultFields from './ResultFields.vue'
import type {Value} from '../models'
vi.mock('@iconify/vue',()=>({Icon:{template:'<svg aria-hidden="true"/>'}}))
vi.mock('@wippy-fe/proxy',()=>({loadByTagName:async()=>{}}))
describe('Physical page images',()=>{
 it('makes page reading opt in and supplies an editable page ceiling',async()=>{
  const config=newConfig()
  const w=mount(StepInspector,{props:{stage:'extract',config}})
  expect(config.stages.extract.reads).toBeUndefined()
  expect(w.get('[role=radio][aria-checked=true]').text()).toBe('Text')
  await w.get('[role=radio][aria-label="Read values from: Page images"]').trigger('click')
  expect(config.stages.extract.reads).toBe('pages')
  expect(config.stages.extract.max_pages).toBe(8)
  expect(w.find('[aria-label="Page images per call"]').exists()).toBe(true)
 })
 it('keeps page controls read only in a read only inspector',async()=>{
  const config=newConfig()
  config.stages.extract.reads='pages';config.stages.extract.max_pages=3
  const w=mount(StepInspector,{props:{stage:'extract',config,readonly:true}})
  expect(w.get('[role=radio][aria-label="Read values from: Page images"]').attributes('disabled')).toBeDefined()
  expect(w.get('[aria-label="Page images per call"]').attributes('disabled')).toBeDefined()
 })
 it('shows explicit visual verification after saved values are loaded',()=>{
  const field:Value={name:'amount',path:'amount',value:1250,confidence:1,verified:true,evidence:[],
   extraction_kind:'page_image',source_revision:'revision',verification:{kind:'page_image',status:'passed',checks:{visual_quote:'passed',value_support:'passed'}}}
  const saved=JSON.parse(JSON.stringify(field)) as Value
  const w=mount(ResultFields,{props:{fields:[saved]}})
  expect(w.get('[aria-label="Verification method"]').text()).toBe('Visual · passed')
 })
 it('interprets absent verification metadata as quote verification',()=>{
  const field:Value={name:'amount',path:'amount',value:1250,confidence:1,verified:true,evidence:[]}
  const w=mount(ResultFields,{props:{fields:[field]}})
  expect(w.get('[aria-label="Verification method"]').text()).toBe('Quote')
 })
})
