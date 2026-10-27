// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect} from 'vitest'
import {mount} from '@vue/test-utils'
import Slider from './Slider.vue'
import {optionBounds,retrievalBounds} from '../config'
describe('Slider',()=>{
 it('maps a log scale across schema bounds and snaps to its step',async()=>{
  const w=mount(Slider,{props:{label:'Output limit',min:256,max:64000,step:64,log:true,unit:'tokens',modelValue:4096,'onUpdate:modelValue':(v:number)=>w.setProps({modelValue:v})}})
  const range=w.get('input[type=range]')
  await range.setValue('1000');expect(w.props('modelValue')).toBe(64000)
  await range.setValue('0');expect(w.props('modelValue')).toBe(256)
  await range.setValue('500');expect(w.props('modelValue')%64).toBe(0);expect(w.props('modelValue')).toBeGreaterThan(3500);expect(w.props('modelValue')).toBeLessThan(4600)
  expect(w.get('output').text()).toContain('tokens')
 })
 it('shows percentages for fractional values',()=>{
  const w=mount(Slider,{props:{label:'Stop at confidence',min:0,max:1,step:.05,percent:true,modelValue:.7}})
  expect(w.get('output').text()).toBe('70%')
 })
 it('reads bounds from the configuration schema',()=>{
  expect(optionBounds('deep','chunk_cap')).toEqual({min:1,max:10000})
  expect(optionBounds('scout','max_iterations')).toEqual({min:0,max:30})
  expect(retrievalBounds('chunk_size')).toEqual({min:100,max:16000})
 })
})
