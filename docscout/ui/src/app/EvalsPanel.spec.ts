// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect,vi} from 'vitest'
import {mount,config} from '@vue/test-utils'
import {PrimeVuePlugin} from '@wippy-fe/theme/primevue-plugin'
config.global.plugins=[PrimeVuePlugin]
vi.mock('@wippy-fe/proxy',()=>({loadByTagName:async()=>{},api:{get:vi.fn()}}))
import EvalsPanel from './EvalsPanel.vue'
import UploadPicker from './UploadPicker.vue'
import {newField} from '../config'
import type {Evaluation} from '../models'
const fields=[{...newField(),name:'total',type:'number' as const},{...newField(),name:'paid',type:'boolean' as const},{...newField(),name:'vendor'}]
const cases=[{id:'c1',upload_id:'u1',upload_name:'invoice.pdf',expected:{total:1250}}]
function evaluation(over:Partial<Evaluation>={}):Evaluation{
 return {id:'e2',config_revision:4,fields,status:'completed',case_count:2,tokens:5200,duration_ms:31000,created_at:'2026-10-28T10:00:00Z',
  metrics:[{field:'total',accuracy:1,verified:1},{field:'paid',accuracy:.5,verified:.5},{field:'vendor',accuracy:.9,verified:1}],
  results:[
   {case_id:'c1',upload_name:'invoice.pdf',status:'completed',tokens:2600,duration_ms:15000,scores:[{field:'total',expected:1250,value:1250,score:1,verified:true},{field:'paid',expected:false,value:true,score:0,verified:false},{field:'vendor',expected:'Northwind GmbH',value:'Northwind GmbH, Hamburg',score:.8,verified:true}]},
   {case_id:'c2',upload_name:'scan.pdf',status:'failed',tokens:0,duration_ms:400,scores:[],error:'the upload has no extracted text yet'},
  ],...over}
}
const before:Evaluation={...evaluation({id:'e1',config_revision:3,created_at:'2026-10-27T10:00:00Z',metrics:[{field:'total',accuracy:.5,verified:.5},{field:'paid',accuracy:.5,verified:.5}]}),results:undefined}
const mountPanel=(props:Record<string,unknown>={})=>mount(EvalsPanel,{props:{cases,fields,evaluations:[],revision:4,...props}})
describe('Docscout evaluations',()=>{
 it('saves blank expected values as not stated',async()=>{
  const w=mountPanel()
  await w.findAll('button').find(b=>b.text()==='Add case')!.trigger('click')
  w.getComponent(UploadPicker).vm.$emit('select','u2','receipt.pdf')
  await w.get('input[type=number]').setValue('99.5')
  await w.get('form').trigger('submit')
  expect(w.emitted('add-case')?.[0][0]).toEqual({upload_id:'u2',upload_name:'receipt.pdf',expected:{total:99.5}})
 })
 it('rejects malformed JSON for list and object values',async()=>{
  const w=mountPanel({fields:[{...newField(),name:'items',type:'list'}]})
  await w.findAll('button').find(b=>b.text()==='Add case')!.trigger('click')
  await w.get('textarea').setValue('[oops')
  await w.get('form').trigger('submit')
  expect(w.emitted('add-case')).toBeUndefined()
  expect(w.get('[role=alert]').text()).toContain('valid JSON')
 })
 it('starts an evaluation and says unsaved changes are not measured',async()=>{
  const w=mountPanel({changed:true})
  expect(w.text()).toContain('Unsaved changes are not evaluated')
  await w.findAll('button').find(b=>b.text()==='Run all cases')!.trigger('click')
  expect(w.emitted('evaluate')).toHaveLength(1)
 })
 it('cannot start without cases',()=>{
  const w=mountPanel({cases:[]})
  expect(w.findAll('button').find(b=>b.text()==='Run all cases')!.attributes('disabled')).toBeDefined()
 })
 it('shows progress while an evaluation runs and blocks another start',()=>{
  const running=evaluation({status:'running',results:[{...evaluation().results![0]},{case_id:'c2',upload_name:'scan.pdf',status:'queued',tokens:0,duration_ms:0,scores:[]}]})
  const w=mountPanel({evaluations:[running],evaluation:running})
  expect(w.get('.eval-progress').text()).toContain('1 of 2 cases')
  expect(w.findAll('button').find(b=>b.text().includes('Evaluating'))!.attributes('disabled')).toBeDefined()
  expect(w.text()).toContain('Waiting')
 })
 it('compares field accuracy with the previous revision',()=>{
  const current=evaluation()
  const w=mountPanel({evaluations:[current,before],evaluation:current})
  const total=w.findAll('.metric-table tbody tr').find(r=>r.text().startsWith('total'))!
  expect(total.text()).toContain('100%');expect(total.text()).toContain('+50 pts')
  expect(w.findAll('.metric-table tbody tr').find(r=>r.text().startsWith('vendor'))!.text()).toContain('New field')
  expect(w.get('.stat-row').text()).toContain('vs revision 3')
 })
 it('grades each case and field and expands to expected against extracted',async()=>{
  const current=evaluation()
  const w=mountPanel({evaluations:[current],evaluation:current})
  const cells=w.findAll('.result-row')[0].findAll('.cell')
  expect(cells.map(c=>c.classes().find(x=>['pass','partial','fail'].includes(x)))).toEqual(['pass','fail','partial'])
  expect(w.findAll('.result-row')[1].text()).toContain('no extracted text')
  await w.get('.case-toggle').trigger('click')
  const detail=w.get('.result-detail').text()
  expect(detail).toContain('Expected');expect(detail).toContain('Northwind GmbH, Hamburg');expect(detail).toContain('Unverified')
 })
 it('lists history and opens an earlier evaluation',async()=>{
  const current=evaluation()
  const w=mountPanel({evaluations:[current,before],evaluation:current})
  await w.findAll('.eval-history button')[1].trigger('click')
  expect(w.emitted('open')?.[0]).toEqual(['e1'])
 })
})
