// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect,vi} from 'vitest'
import {mount,config} from '@vue/test-utils'
import {PrimeVuePlugin} from '@wippy-fe/theme/primevue-plugin'
import TestPanel from './TestPanel.vue'
import RunsPanel from './RunsPanel.vue'
import type {Extraction,Run,Value} from '../models'
vi.mock('@wippy-fe/proxy',()=>({loadByTagName:async()=>{},api:{get:vi.fn()}}))
config.global.plugins=[PrimeVuePlugin]
const result={run_id:'r',upload_id:'u',config_revision:1,values:{},fields:[],trace:[{kind:'read',status:'completed',duration_ms:1,input_tokens:0,output_tokens:0,pages:{first:2,last:4}}],duration_ms:1,tokens:1,pages:6,page_range:{first:2,last:4}} as Extraction
const run={id:'r',caller:'ui',status:'completed',upload_id:'u',config_revision:1,duration_ms:1,tokens:1,created_at:'2026-01-01',expires_at:'2026-01-02',result:{fields:[],values:{},page_range:{first:2,last:4}}} as Run
describe('Run page range',()=>{
 it('shows the selected real pages in the result and run history',()=>{
  const current=mount(TestPanel,{props:{result,retention:'2h'}})
  expect(current.text()).toContain('Pages 2–4');expect(current.get('.timeline').text()).toContain('Pages 2–4')
  expect(mount(RunsPanel,{props:{runs:[run],retention:'2h'}}).text()).toContain('Pages 2–4')
 })
 it('keeps whole-document results and historical runs unchanged when no range exists',()=>{
  const {page_range:_range,...full}=result;full.trace=[]
  const historical={...run,result:{fields:[],values:{}}}
  const current=mount(TestPanel,{props:{result:full,retention:'2h'}})
  expect(current.text()).toContain('6 pages');expect(current.text()).not.toContain('Pages 2–4')
  expect(mount(RunsPanel,{props:{runs:[historical],retention:'2h'}}).text()).not.toContain('Pages ')
 })
})

describe('Scoped missing results',()=>{
 it('passes the page selection to current results and reopened runs',async()=>{
  const field:Value={name:'total',path:'total',confidence:0,verified:true,missing:true,value:null,evidence:[],codes:['missing_in_sections']}
  const current=mount(TestPanel,{props:{result:{...result,fields:[field]},retention:'2h'}})
  expect(current.get('.value-text').text()).toBe('Not in the selected sections of the searched pages')
  const history=mount(RunsPanel,{props:{runs:[{...run,result:{...run.result,fields:[field]}}],retention:'2h'}})
  await history.get('.case-toggle').trigger('click')
  expect(history.get('.value-text').text()).toBe('Not in the selected sections of the searched pages')
 })
})
