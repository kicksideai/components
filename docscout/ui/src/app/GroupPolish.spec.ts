// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {beforeAll,describe,it,expect,vi} from 'vitest'
import {mount,config} from '@vue/test-utils'
import {PrimeVuePlugin} from '@wippy-fe/theme/primevue-plugin'
import {reactive} from 'vue'
import {newConfig,newField} from '../config'
import Builder from './Builder.vue'
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
