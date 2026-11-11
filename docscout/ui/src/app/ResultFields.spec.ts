// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect} from 'vitest'
import {mount} from '@vue/test-utils'
import ResultFields from './ResultFields.vue'
import type {Value} from '../models'
const field:Value={name:'total',path:'invoice.total',value:1250,confidence:1,verified:false,missing:false,evidence:[]}
describe('Verification reasons',()=>{
 for(const reason of ['Quote does not support the value','A quote is not in the document','Value is not a date in the format YYYY-MM-DD','Structured reply does not match its schema']){
  it(`shows the saved reason: ${reason}`,async()=>{
   const w=mount(ResultFields,{props:{fields:[{...field,reason}]}})
   expect(w.get('.value-text').text()).toBe('1250')
   expect(w.get('.chip').text()).toBe('Check')
   expect(w.get('.chip').attributes('title')).toBe(reason)
   await w.get('.value-main').trigger('click')
   expect(w.get('.evidence').isVisible()).toBe(true)
   expect(w.get('.evidence').text()).toContain(reason)
  })
 }
 it('loads an older unverified field without a reason',async()=>{
  const w=mount(ResultFields,{props:{fields:[field]}})
  await w.get('.value-main').trigger('click')
  expect(w.get('.evidence').text()).toContain('No reason recorded')
  expect(w.get('.value-text').text()).toBe('1250')
 })
 it('does not label verified or failed fields with a missing reason',async()=>{
  for(const saved of [{...field,verified:true},{...field,failed:true}]){
   const w=mount(ResultFields,{props:{fields:[saved]}})
   await w.get('.value-main').trigger('click')
   expect(w.text()).not.toContain('No reason recorded')
  }
 })
})
