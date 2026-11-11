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

describe('Missing value scope',()=>{
 for(const pageRange of [undefined,{first:1,last:1}]){
  it(`labels selected sections with page range ${JSON.stringify(pageRange)}`,()=>{
   const w=mount(ResultFields,{props:{fields:[{...field,value:undefined,missing:true,codes:['missing_in_sections']}],pageRange}})
   expect(w.get('.value-text').text()).toBe('Not in the selected sections'+(pageRange?' of the searched pages':''))
  })
  for(const codes of [undefined,[],['no_passage']]){
   it(`keeps the missing label without the scoped code ${JSON.stringify(codes)} and range ${JSON.stringify(pageRange)}`,()=>{
    const w=mount(ResultFields,{props:{fields:[{...field,value:undefined,missing:true,codes}],pageRange}})
    expect(w.get('.value-text').text()).toBe('Not in the document')
   })
  }
 }
})

describe('Completeness judgments',()=>{
 for(const [complete,label] of [[true,'Complete'],[false,'Incomplete'],[undefined,'Completeness unknown']] as const){
  it(`shows ${label} distinctly`,()=>{
   const w=mount(ResultFields,{props:{fields:[{...field,complete}]}})
   expect(w.get('[aria-label="Completeness"]').text()).toBe(label)
  })
 }
 it('omits completeness for missing and failed fields',()=>{
  const w=mount(ResultFields,{props:{fields:[{...field,missing:true},{...field,path:'failed',failed:true}]}})
  expect(w.find('[aria-label="Completeness"]').exists()).toBe(false)
 })
})
