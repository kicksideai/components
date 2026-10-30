// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect} from 'vitest'
import {mount} from '@vue/test-utils'
import Segmented from './Segmented.vue'
const options=[{value:'a',label:'First'},{value:'b',label:'Second'},{value:'c',label:'Third'}]
describe('Segmented choice',()=>{
 it('selects with arrows, Home and End and keeps only the checked option in the tab order',async()=>{
  const w=mount(Segmented,{props:{options,labelledBy:'x',modelValue:'a','onUpdate:modelValue':(v:string)=>w.setProps({modelValue:v})},attachTo:document.body})
  const radios=()=>w.findAll('[role=radio]')
  expect(radios().map(r=>r.attributes('tabindex'))).toEqual(['0','-1','-1'])
  await radios()[0].trigger('keydown',{key:'ArrowRight'});expect(w.props('modelValue')).toBe('b')
  await radios()[1].trigger('keydown',{key:'End'});expect(w.props('modelValue')).toBe('c')
  await radios()[2].trigger('keydown',{key:'ArrowDown'});expect(w.props('modelValue')).toBe('a')
  await radios()[0].trigger('keydown',{key:'ArrowLeft'});expect(w.props('modelValue')).toBe('c')
  await radios()[2].trigger('keydown',{key:'Home'});expect(w.props('modelValue')).toBe('a')
  expect(radios()[0].attributes('aria-checked')).toBe('true')
  expect(document.activeElement?.textContent).toBe('First')
  w.unmount()
 })
})
