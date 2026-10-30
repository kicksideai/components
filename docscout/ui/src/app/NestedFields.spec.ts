// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect,vi,beforeAll} from 'vitest'
import {mount,config} from '@vue/test-utils'
import {PrimeVuePlugin} from '@wippy-fe/theme/primevue-plugin'
import {newConfig,newField} from '../config'
import Builder from './Builder.vue'
import TestPanel from './TestPanel.vue'
import EvalsPanel from './EvalsPanel.vue'
vi.mock('@wippy-fe/proxy',()=>({loadByTagName:async()=>{},api:{get:vi.fn()}}))
config.global.plugins=[PrimeVuePlugin]
beforeAll(()=>{vi.stubGlobal('ResizeObserver',class{observe(){}disconnect(){}})})
describe('Nested field editor and results',()=>{
 it('renders nested collapsible groups, renames a subtree and moves a field',async()=>{
  const c=newConfig();c.fields=[{...newField(),name:'name',group:'parties.borrower'},{...newField(),name:'name',group:'parties.agent'}]
  const w=mount(Builder,{props:{config:c,retention:'2h',result:null,title:'Reader',description:''}})
  expect(w.findAll('section.field-group').length).toBe(3)
  await w.get('button[aria-label="Rename group parties"]').trigger('click')
  const rename=w.get('input[aria-label="Group path for parties"]');await rename.setValue('participants');await rename.trigger('keydown',{key:'Enter'})
  expect(c.fields.map(f=>f.group)).toEqual(['participants.borrower','participants.agent'])
  await w.findAll('.row-main')[0].trigger('click')
  expect(w.findAll('.row-main')[0].element.parentElement?.classList.contains('row-item')).toBe(true)
  await w.get('input[aria-label="Field group"]').setValue('participants.agent')
  expect(c.fields[0].group).toBe('participants.agent')
  expect(w.text()).toContain('Another field already uses this name')
  w.unmount()
 })
 it('edits declared object properties and typed list items recursively',async()=>{
  const c=newConfig();c.fields=[{...newField(),name:'terms'}]
  const w=mount(Builder,{props:{config:c,retention:'2h',result:null,title:'Reader',description:''}})
  await w.get('button[aria-label="Edit terms"]').trigger('click')
  await w.get('button[aria-label="Field type: Object"]').trigger('click')
  await w.get('.side-panel button[aria-label="Add property to terms"]').trigger('click')
  await w.get('input[aria-label="Property name"]').setValue('payments')
  await w.get('button[aria-label="Property type: List"]').trigger('click')
  await w.get('button[aria-label="Edit terms.payments[]"]').trigger('click')
  await w.get('button[aria-label="Item type: Number"]').trigger('click')
  expect(c.fields[0].properties?.[0]).toMatchObject({name:'payments',type:'list',item:{type:'number'}})
  await w.setProps({readonly:true})
  expect(w.get('fieldset').attributes('disabled')).toBeDefined()
  w.unmount()
 })
 it('preserves declared properties when selecting a different field or receiving a saved update',async()=>{
  const c=newConfig();c.fields=[{...newField(),name:'name'},{...newField(),name:'terms',type:'object',properties:[{name:'amount',type:'number',description:'',expected_format:'',enum_values:[],required:true}]}]
  const w=mount(Builder,{props:{config:c,retention:'2h',result:null,title:'Reader',description:''}})
  await w.findAll('.row-main')[0].trigger('click')
  await w.findAll('.row-main')[1].trigger('click')
  expect(c.fields[1].properties).toHaveLength(1)
  const updated={...newField(),name:'terms',type:'list' as const,item:{type:'number' as const}}
  await w.setProps({config:{...c,fields:[c.fields[0],updated]}})
  expect(updated.item.type).toBe('number')
  w.unmount()
 })
 it('renders same-named nested fields with separate evidence and recursive values',async()=>{
  const fields=[{name:'terms',path:'parties.borrower.terms',value:{payments:[{amount:12,paid:false}]},confidence:1,verified:true,evidence:[]},{name:'terms',path:'parties.agent.terms',value:'Agency',confidence:.8,verified:false,evidence:[]}]
  const w=mount(TestPanel,{props:{retention:'2h',result:{run_id:'r',upload_id:'u',config_revision:1,values:{parties:{borrower:{terms:{payments:[{amount:12,paid:false}]}},agent:{terms:'Agency'}}},fields,trace:[],duration_ms:1,tokens:1}}})
  expect(w.findAll('section.field-group')).toHaveLength(3)
  expect(w.findAll('.nested-value dl').length).toBeGreaterThan(0)
  expect(w.text()).toContain('amount');expect(w.text()).toContain('12');expect(w.text()).toContain('false')
  await w.findAll('.value-main')[0].trigger('click');expect(w.findAll('.value-main')[0].attributes('aria-expanded')).toBe('true')
  expect(w.findAll('.value-main')[1].attributes('aria-expanded')).toBe('false')
 })
 it('renders grouped evaluation comparisons with object properties and list rows',async()=>{
  const fields=[{...newField(),name:'terms',group:'parties.borrower',type:'object' as const}]
  const evaluation={id:'e',config_revision:1,fields,status:'completed' as const,case_count:1,metrics:[],tokens:1,duration_ms:1,created_at:'2026-01-01T00:00:00Z',results:[{case_id:'c',upload_name:'agreement.pdf',status:'completed' as const,tokens:1,duration_ms:1,scores:[{field:'parties.borrower.terms',expected:{payments:[12]},value:{payments:[12]},score:1,verified:true}]}]}
  const w=mount(EvalsPanel,{props:{cases:[],fields,evaluations:[evaluation],evaluation,revision:1}})
  await w.get('.case-toggle').trigger('click')
  expect(w.findAll('.result-detail section.field-group')).toHaveLength(2)
  expect(w.findAll('.result-detail .nested-value ol')).toHaveLength(2)
  expect(w.get('.result-detail').text()).toContain('payments')
 })
 it('emits nested expected values for same-named evaluation fields',async()=>{
  const fields=[{...newField(),name:'name',group:'parties.borrower'},{...newField(),name:'name',group:'parties.agent'}]
  const w=mount(EvalsPanel,{props:{cases:[],fields,evaluations:[],revision:1}})
  await w.findAll('button').find(b=>b.text()==='Add case')!.trigger('click')
  const inputs=w.findAll('.case-form input');await inputs[0].setValue('Borrower');await inputs[1].setValue('Agent')
  await w.get('form').trigger('submit')
  expect(w.emitted('add-case')?.[0][0]).toMatchObject({expected:{parties:{borrower:{name:'Borrower'},agent:{name:'Agent'}}}})
 })
})

describe('Saved nested runs',()=>{
 it('expands a saved run into nested values without another request',async()=>{
  const {default:RunsPanel}=await import('./RunsPanel.vue')
  const w=mount(RunsPanel,{props:{retention:'2h',runs:[{id:'r',caller:'agent',status:'completed',upload_id:'u',config_revision:1,duration_ms:10,tokens:12,created_at:'2026-01-01T00:00:00Z',expires_at:'2026-01-02T00:00:00Z',result:{fields:[{name:'terms',path:'parties.borrower.terms',value:{amount:12},confidence:1,verified:true,evidence:[]}],values:{parties:{borrower:{terms:{amount:12}}}}}}]}})
  await w.get('button[aria-label="Show values for run r"]').trigger('click')
  expect(w.text()).toContain('borrower');expect(w.text()).toContain('amount');expect(w.text()).toContain('12')
 })
})

describe('Group creation and removal',()=>{
 it('creates a field within a new dotted group and removes the field through the inspector',async()=>{
  const c=newConfig();const w=mount(Builder,{props:{config:c,retention:'2h',result:null,title:'Reader',description:''}})
  await w.get('button[aria-label="Add group"]').trigger('click')
  await w.get('input[aria-label="New group path"]').setValue('parties.borrower')
  await w.get('.group-create-row form').trigger('submit')
  expect(c.fields).toHaveLength(1);expect(c.fields[0].group).toBe('parties.borrower')
  expect(w.findAll('section.field-group')).toHaveLength(2)
  await w.get('.row-main').trigger('click')
  await w.findAll('button').find(b=>b.text()==='Remove field')!.trigger('click')
  expect(c.fields).toHaveLength(0);expect(w.findAll('section.field-group')).toHaveLength(0)
 })
})
