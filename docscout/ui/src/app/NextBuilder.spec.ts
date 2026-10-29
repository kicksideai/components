// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {reactive} from 'vue'
import {beforeAll,describe,it,expect,vi} from 'vitest'
import {mount,config,flushPromises} from '@vue/test-utils'
import {PrimeVuePlugin} from '@wippy-fe/theme/primevue-plugin'
import Builder from './Builder.vue'
import StepInspector from './StepInspector.vue'
import {newConfig,newField,newProperty,fieldError} from '../config'
vi.mock('@wippy-fe/proxy',()=>({loadByTagName:vi.fn(async()=>{}),api:{get:vi.fn()}}))
config.global.plugins=[PrimeVuePlugin]
beforeAll(()=>vi.stubGlobal('ResizeObserver',class{observe(){}disconnect(){}}))
const build=()=>{const c=reactive(newConfig());c.fields=[{...newField(),name:'terms',type:'object',properties:[{...newProperty(),name:'amount',type:'number'}]}];return {c,w:mount(Builder,{props:{config:c,retention:'2h',result:null,title:'Reader',description:''}})}}
describe('Object builder',()=>{
 it('selects nested properties in the tree and edits only the selected shape',async()=>{
  const {c,w}=build()
  await w.get('button[aria-label="Edit terms.amount"]').trigger('click')
  await w.get('input[aria-label="Property name"]').setValue('total')
  expect(c.fields[0].properties![0].name).toBe('total')
  expect(w.findAll('.shape-editor')).toHaveLength(1)
  expect(w.get('[aria-label="Output shape"]').text()).toContain('number')
  expect(w.get('[aria-label="Example output"]').text()).toContain('42')
  w.unmount()
 })
 it('moves properties to another parent and reorders siblings through named buttons',async()=>{
  const {c,w}=build();c.fields.push({...newField(),name:'invoice',type:'object',properties:[{...newProperty(),name:'date'}]})
  await w.vm.$nextTick();await w.get('button[aria-label="Edit terms.amount"]').trigger('click')
  await w.get('select[aria-label="Move to parent"]').setValue('1:')
  await w.get('button[aria-label="Move selected node"]').trigger('click')
  expect(c.fields[0].properties).toHaveLength(0)
  expect(c.fields[1].properties!.map(p=>p.name)).toEqual(['date','amount'])
  await w.get('button[aria-label="Move invoice.amount up"]').trigger('click')
  expect(c.fields[1].properties!.map(p=>p.name)).toEqual(['amount','date'])
  w.unmount()
 })
 it('uses icon choices, removable enum chips and bounded context controls',async()=>{
  const {c,w}=build();await w.get('button[aria-label="Edit terms"]').trigger('click')
  await w.get('button[aria-label="Field type: One of a set"]').trigger('click')
  await w.get('input[aria-label="New allowed value"]').setValue('Paid')
  await w.get('input[aria-label="New allowed value"]').trigger('keydown',{key:'Enter'})
  expect(c.fields[0].enum_values).toEqual(['Paid'])
  await w.get('button[aria-label="Remove allowed value Paid"]').trigger('click')
  expect(c.fields[0].enum_values).toEqual([])
  await w.get('button[aria-label="Increase chunks to read"]').trigger('click')
  expect(c.fields[0].chunks).toBe(6)
  w.unmount()
 })
 it('reports path collisions on the selected field and enforces schema name limits',()=>{
  expect(fieldError({...newField(),name:'parties'},['parties.borrower.name'])).toContain('collides')
  expect(fieldError({...newField(),name:'a'.repeat(81)},[])).toContain('80')
 })
})
describe('Shared agent picker',()=>{
 it('loads the config-mode picker, saves agent_id, clears it, and stays absent in structured mode',async()=>{
  const c=newConfig();c.stages.scout.mode='agent'
  const w=mount(StepInspector,{props:{config:c,stage:'scout'}});await flushPromises()
  const picker=w.get('wc-agent-picker')
  expect(JSON.parse(picker.attributes('config')!)).toEqual({agent_id:''})
  picker.element.dispatchEvent(new CustomEvent('change',{detail:{agent_id:'my-agent'}}));await w.vm.$nextTick()
  expect(c.stages.scout).toHaveProperty('agent_id','my-agent')
  picker.element.dispatchEvent(new CustomEvent('change',{detail:{agent_id:''}}));await w.vm.$nextTick()
  expect(c.stages.scout).not.toHaveProperty('agent_id')
  await w.setProps({config:{...c,stages:{...c.stages,scout:{...c.stages.scout,mode:'loop'}}}});expect(w.find('wc-agent-picker').exists()).toBe(false)
 })
})

describe('Builder structure actions',()=>{
 it('reveals a newly added property when its selected parent was collapsed',async()=>{
  const {w}=build();await w.get('button[aria-label="Edit terms"]').trigger('click')
  await w.get('button[aria-label="Collapse terms"]').trigger('click')
  await w.get('.side-panel button[aria-label="Add property to terms"]').trigger('click')
  expect(w.get('button[aria-label="Collapse terms"]').attributes('aria-expanded')).toBe('true')
  expect(w.find('input[aria-label="Property name"]').exists()).toBe(true)
  w.unmount()
 })

 it('promotes and nests fields without leaking stage-specific keys into properties',async()=>{
  const {c,w}=build();c.fields.push({...newField(),name:'paid',type:'boolean',group:'payment'})
  await w.vm.$nextTick();await w.get('button[aria-label="Edit payment.paid"]').trigger('click')
  await w.get('select[aria-label="Move to parent"]').setValue('0:');await w.get('button[aria-label="Move selected node"]').trigger('click')
  expect(c.fields).toHaveLength(1)
  const property=c.fields[0].properties![1]
  expect(property).toMatchObject({name:'paid',type:'boolean'})
  expect(property).not.toHaveProperty('group');expect(property).not.toHaveProperty('chunks');expect(property).not.toHaveProperty('strategy')
  await w.get('select[aria-label="Move to parent"]').setValue('');await w.get('button[aria-label="Move selected node"]').trigger('click')
  expect(c.fields[1]).toMatchObject({name:'paid',group:'',chunks:5,type:'boolean'})
  await w.get('input[aria-label="Field group"]').setValue('payment')
  expect(c.fields[1].group).toBe('payment')
  w.unmount()
 })
 it('reorders and removes group subtrees while preserving unrelated nodes',async()=>{
  const {c,w}=build();c.fields[0].group='parties.borrower';c.fields.push({...newField(),name:'name',group:'parties.agent'})
  await w.vm.$nextTick();await w.get('button[aria-label="Actions for group parties.agent"]').trigger('click')
  await w.findAll('[role=menuitem]').find(item=>item.text()==='Move up')!.get('a').trigger('click')
  expect(c.fields.map(f=>f.group)).toEqual(['parties.agent','parties.borrower'])
  await w.get('button[aria-label="Actions for group parties.borrower"]').trigger('click')
  await w.findAll('[role=menuitem]').find(item=>item.text()==='Delete group and its fields')!.get('a').trigger('click')
  expect(c.fields.map(f=>f.group)).toEqual(['parties.agent'])
  w.unmount()
 })
 it('limits type choices and parent moves to four levels and rejects self-descendant moves',async()=>{
  const {c,w}=build();c.fields[0].properties![0]={...newProperty(),name:'rows',type:'list',item:{type:'object',properties:[{...newProperty(),name:'amount',type:'number'}]}}
  await w.vm.$nextTick();await w.get('button[aria-label="Edit terms.rows[].amount"]').trigger('click')
  expect(w.find('button[aria-label="Property type: Object"]').exists()).toBe(false)
  expect(w.find('button[aria-label="Property type: List"]').exists()).toBe(false)
  await w.get('button[aria-label="Edit terms"]').trigger('click')
  expect(w.findAll('select[aria-label="Move to parent"] option')).toHaveLength(1)
  w.unmount()
 })
 it('keeps a parent expanded when a nested disclosure is collapsed with the keyboard',async()=>{
  const {c,w}=build();c.fields[0].properties![0]={...newProperty(),name:'rows',type:'list',item:{type:'number'}}
  await w.vm.$nextTick();await w.get('button[aria-label="Edit terms.rows"]').trigger('keydown',{key:'ArrowLeft'})
  expect(w.get('button[aria-label="Expand terms.rows"]').attributes('aria-expanded')).toBe('false')
  expect(w.get('button[aria-label="Collapse terms"]').attributes('aria-expanded')).toBe('true')
  w.unmount()
 })
})
