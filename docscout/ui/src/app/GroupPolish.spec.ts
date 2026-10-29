// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {beforeAll,describe,it,expect,vi} from 'vitest'
import {mount,config} from '@vue/test-utils'
import {PrimeVuePlugin} from '@wippy-fe/theme/primevue-plugin'
import {reactive} from 'vue'
import {newConfig,newField} from '../config'
import Builder from './Builder.vue'
import ShapeTree from './ShapeTree.vue'
vi.mock('@wippy-fe/proxy',()=>({loadByTagName:async()=>{}}))
config.global.plugins=[PrimeVuePlugin]
beforeAll(()=>vi.stubGlobal('ResizeObserver',class{observe(){}disconnect(){}}))
function build(){
 const c=reactive(newConfig());c.fields=[{...newField(),name:'legal_name',group:'parties.borrower',required:true,description:'Full legal name of the borrower, including its registered legal form.'},{...newField(),name:'notice_address',group:'parties.borrower',description:'Registered address used for notices.',strategy:'deep',search_within:'sections'}]
 return {c,w:mount(Builder,{props:{config:c,retention:'2h',result:null,title:'Agreement',description:''},attachTo:document.body})}
}
describe('Group and field presentation',()=>{
 it('keeps rename inputs out of the tree until the header is edited, then saves and returns focus',async()=>{
  const {c,w}=build()
  expect(w.findAll('.field-group input')).toHaveLength(0)
  await w.get('button[aria-label="Rename group parties"]').trigger('click')
  const input=w.get('input[aria-label="Group path for parties"]')
  expect(document.activeElement).toBe(input.element)
  await input.setValue('participants');await input.trigger('keydown',{key:'Enter'})
  expect(c.fields.map(f=>f.group)).toEqual(['participants.borrower','participants.borrower'])
  expect(w.findAll('.field-group input')).toHaveLength(0)
  expect(document.activeElement).toBe(w.get('button[aria-label="Rename group participants"]').element)
  w.unmount()
 })
 it('cancels inline rename with Escape and leaves the path unchanged',async()=>{
  const {c,w}=build();await w.get('button[aria-label="Rename group parties.borrower"]').trigger('click')
  const input=w.get('input[aria-label="Group path for parties.borrower"]');await input.setValue('changed')
  await input.trigger('keydown',{key:'Escape'})
  expect(c.fields[0].group).toBe('parties.borrower')
  expect(w.findAll('.field-group input')).toHaveLength(0)
  expect(document.activeElement).toBe(w.get('button[aria-label="Rename group parties.borrower"]').element)
  w.unmount()
 })
 it('uses labelled shared chevrons for group disclosure and preserves nesting',async()=>{
  const {w}=build();expect(w.find('.field-group summary').exists()).toBe(false)
  const toggle=w.get('button[aria-label="Collapse group parties.borrower"]')
  expect(toggle.classes()).toContain('kx-iconbtn');expect(toggle.classes()).toContain('kx-focus-outline')
  expect(toggle.attributes('aria-controls')).toBeTruthy()
  await toggle.trigger('click');expect(w.get('button[aria-label="Expand group parties.borrower"]').attributes('aria-expanded')).toBe('false')
  expect(w.get('button[aria-label="Edit parties.borrower.legal_name"]').isVisible()).toBe(false)
  await w.get('button[aria-label="Expand group parties.borrower"]').trigger('click')
  expect(w.get('button[aria-label="Edit parties.borrower.legal_name"]').isVisible()).toBe(true)
  expect(w.find('.field-group .group-content .field-group').exists()).toBe(true)
  w.unmount()
 })
 it('keeps badges separate from the text block, omits group chips, and names the evidence icon',()=>{
  const {c,w}=build();const row=w.get('button[aria-label="Edit parties.borrower.legal_name"]')
  expect(row.get('.row-desc').attributes('title')).toBe(c.fields[0].description)
  expect(row.get('.row-copy .row-label').text()).toBe('legal_name')
  expect(row.get('.field-badges [aria-label="Evidence required"]').attributes('role')).toBe('img')
  expect(row.attributes('aria-describedby')).toBe(row.get('.row-desc').attributes('id'))
  expect(row.findAll('.field-badges .chip').some(chip=>chip.text().includes('parties'))).toBe(false)
  expect(row.findAll('.row-name .chip')).toHaveLength(0)
  w.unmount()
 })
})


describe('Inline group creation',()=>{
 it('opens from the Fields header, creates with Enter, and returns focus without opening an editor',async()=>{
  const {c,w}=build(),before=c.fields.length
  expect(w.find('input[aria-label="New group path"]').exists()).toBe(false)
  const add=w.get('.fields-block>.block-head button[aria-label="Add group"]')
  await add.trigger('click')
  const input=w.get('.field-tree input[aria-label="New group path"]')
  expect(document.activeElement).toBe(input.element)
  await input.setValue('payment.terms');await input.trigger('keydown',{key:'Enter'})
  expect(c.fields).toHaveLength(before+1);expect(c.fields.at(-1)?.group).toBe('payment.terms')
  expect(w.find('input[aria-label="New group path"]').exists()).toBe(false)
  expect(document.activeElement).toBe(add.element)
  expect(w.get('.side-panel h2').text()).toBe('Read document')
  w.unmount()
 })
 it('opens a collapsed tree and cancels with Escape without changing the configuration',async()=>{
  const {c,w}=build(),before=c.fields.length
  await w.get('button[aria-controls="fields-body"]').trigger('click')
  const add=w.get('button[aria-label="Add group"]');await add.trigger('click')
  expect(w.get('#fields-body').isVisible()).toBe(true)
  const input=w.get('input[aria-label="New group path"]');await input.setValue('payment')
  await input.trigger('keydown',{key:'Escape'})
  expect(c.fields).toHaveLength(before);expect(w.find('.group-create-row').exists()).toBe(false)
  expect(document.activeElement).toBe(add.element)
  w.unmount()
 })
 it('uses rename validation for blank, malformed and overlong group paths',async()=>{
  const {c,w}=build(),before=c.fields.length
  await w.get('button[aria-label="Add group"]').trigger('click')
  const input=w.get('input[aria-label="New group path"]')
  for(const path of ['', 'Bad path', 'a'.repeat(321)]){
   await input.setValue(path);await input.trigger('keydown',{key:'Enter'})
   expect(input.attributes('aria-invalid')).toBe('true')
   expect(w.get('.group-create-row [role=alert]').text()).toBeTruthy()
   expect(c.fields).toHaveLength(before)
   expect(document.activeElement).toBe(input.element)
  }
  await input.setValue('valid_group');await input.trigger('keydown',{key:'Enter'})
  expect(c.fields.at(-1)?.group).toBe('valid_group')
  w.unmount()
 })
})

describe('Row overflow reorder',()=>{
 it('supports keyboard reordering and Escape in the shared menu without collapsing the object',async()=>{
  const shape={...newField(),name:'terms',type:'object' as const,properties:[]}
  const w=mount(ShapeTree,{props:{shape,field:0,trail:[],path:'terms',selected:'',first:false,last:false},attachTo:document.body})
  const button=w.get('button[aria-label="Actions for terms"]')
  expect(button.classes()).toContain('kx-focus-outline')
  await button.trigger('click')
  const menu=w.get('[role=menu]')
  await menu.trigger('keydown',{key:'ArrowLeft',code:'ArrowLeft'})
  expect(w.get('button[aria-label="Collapse terms"]').attributes('aria-expanded')).toBe('true')
  await menu.trigger('keydown',{key:'Home',code:'Home'})
  await menu.trigger('keydown',{key:'Enter',code:'Enter'})
  expect(w.emitted('reorder')).toEqual([[0,[],-1]])
  await button.trigger('click')
  await w.get('[role=menu]').trigger('keydown',{key:'End',code:'End'})
  await w.get('[role=menu]').trigger('keydown',{key:'Enter',code:'Enter'})
  expect(w.emitted('reorder')?.[1]).toEqual([0,[],1])
  await button.trigger('click');await w.get('[role=menu]').trigger('keydown',{key:'Escape',code:'Escape'})
  expect(document.activeElement).toBe(button.element)
  expect(button.attributes('aria-expanded')).toBe('false')
  w.unmount()
 })
 it('keeps boundary moves disabled and omits menus for readonly nodes and list items',async()=>{
  const shape={...newField(),name:'total'}
  const w=mount(ShapeTree,{props:{shape,field:0,trail:[],path:'total',selected:'',first:true,last:true}})
  await w.get('button[aria-label="Actions for total"]').trigger('click')
  expect(w.findAll('[role=menuitem]').map(item=>item.attributes('aria-disabled'))).toEqual(['true','true'])
  await w.setProps({readonly:true});expect(w.find('.row-overflow').exists()).toBe(false)
  await w.setProps({readonly:false,trail:['item']});expect(w.find('.row-overflow').exists()).toBe(false)
  w.unmount()
 })
})
