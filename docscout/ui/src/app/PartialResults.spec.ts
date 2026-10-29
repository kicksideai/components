// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect,vi} from 'vitest'
import {mount,config} from '@vue/test-utils'
import {PrimeVuePlugin} from '@wippy-fe/theme/primevue-plugin'
import TestPanel from './TestPanel.vue'
import RunsPanel from './RunsPanel.vue'
import EvalsPanel from './EvalsPanel.vue'
import {finished,type Extraction,type Run,type Evaluation} from '../models'
import {newField} from '../config'
vi.mock('@wippy-fe/proxy',()=>({loadByTagName:async()=>{},api:{get:vi.fn()}}))
config.global.plugins=[PrimeVuePlugin]
const error={kind:'UNAVAILABLE',message:'Search could not read this section',retryable:true,details:{section:'Schedule'}}
const fields=[{name:'total',path:'total',value:42,confidence:1,verified:true,evidence:[]},{name:'vendor',path:'vendor',value:null,confidence:0,verified:false,evidence:[],failed:true,error}]
const result={run_id:'r',upload_id:'u',config_revision:1,values:{total:42},fields,trace:[],duration_ms:1,tokens:1,status:'partial'} as Extraction
describe('Partial results',()=>{
 it('shows a partial Test run, keeps successful values and shows the failed field cause immediately',()=>{
  const w=mount(TestPanel,{props:{result,retention:'2h'}})
  expect(w.text()).toContain('Partial');expect(w.text()).toContain('42')
  expect(w.get('[data-error-kind="UNAVAILABLE"]').isVisible()).toBe(true)
  expect(w.text()).toContain(error.message);expect(w.text()).toContain('Retryable');expect(w.text()).toContain('Schedule')
  expect(w.findAll('.confidence')).toHaveLength(1)
 })
 it('shows Partial in Runs and exposes failed field causes alongside successful values',async()=>{
  const run={id:'r',caller:'ui',status:'partial',upload_id:'u',config_revision:1,duration_ms:1,tokens:1,created_at:'2026-01-01',expires_at:'2026-01-02',result:{fields,values:{total:42}}} as Run
  const w=mount(RunsPanel,{props:{runs:[run],retention:'2h'}})
  expect(w.get('.badge').text()).toBe('Partial');await w.get('.case-toggle').trigger('click')
  expect(w.text()).toContain('42');expect(w.text()).toContain(error.message)
 })
 it('treats partial evaluations as terminal and compares successful scores alongside failed fields',async()=>{
  const f=[{...newField(),name:'total'},{...newField(),name:'vendor'}]
  const e={id:'e',config_revision:1,fields:f,status:'partial',case_count:1,metrics:[],tokens:1,duration_ms:1,created_at:'2026-01-01',results:[{case_id:'c',upload_name:'invoice.pdf',status:'partial',tokens:1,duration_ms:1,scores:[{field:'total',expected:42,value:42,score:1,verified:true},{field:'vendor',expected:'Acme',value:null,score:0,verified:false,failed:true,error}]}]} as Evaluation
  expect(finished(e)).toBe(true)
  const w=mount(EvalsPanel,{props:{cases:[],fields:f,evaluations:[e],evaluation:e,revision:1}})
  expect(w.get('.eval-history .badge').text()).toBe('Partial')
  expect(w.get('.result-row').text()).toContain('100%')
  await w.get('.case-toggle').trigger('click')
  expect(w.get('.result-detail').text()).toContain('42');expect(w.get('.result-detail').text()).toContain(error.message)
  expect(w.text()).toContain('1 partial')
 })
})
