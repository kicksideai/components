// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect,vi,beforeEach} from 'vitest'
import {mount} from '@vue/test-utils'
vi.mock('@wippy-fe/proxy',()=>({loadByTagName:async()=>{}}))
import Builder from './Builder.vue'
import {newConfig,newField} from '../config'
function build(){const config=newConfig();config.fields=[{...newField(),name:'total',type:'number'}];return mount(Builder,{props:{config,retention:'2h',result:null,title:'Invoice reader',description:''},attachTo:document.body})}
beforeEach(()=>localStorage.clear())
describe('Builder panel',()=>{
 it('collapses to a rail and reopens on selection',async()=>{
  const w=build()
  expect(w.find('.side-panel').exists()).toBe(true)
  await w.get('button[aria-label="Collapse panel"]').trigger('click')
  expect(w.find('.side-panel').exists()).toBe(false);expect(w.find('.rail').exists()).toBe(true)
  expect(localStorage.getItem('docscout.panel')).toBe('0')
  await w.get('.row-main').trigger('click')
  expect(w.get('.side-panel h2').text()).toBe('total')
  w.unmount()
 })
 it('folds a section and shows what it holds',async()=>{
  const w=build()
  await w.findAll('.collapse')[0].trigger('click')
  expect(w.get('#fields-body').isVisible()).toBe(false);expect(w.get('.block-peek').text()).toBe('total')
  w.unmount()
 })
 it('stretches the panel from the keyboard and remembers the width',async()=>{
  const w=build()
  const handle=w.get('[role=separator]')
  expect(handle.attributes('aria-valuenow')).toBe('400')
  await handle.trigger('keydown',{key:'ArrowLeft'})
  expect(handle.attributes('aria-valuenow')).toBe('424')
  expect(localStorage.getItem('docscout.panelWidth')).toBe('424')
  await handle.trigger('dblclick')
  expect(handle.attributes('aria-valuenow')).toBe('400')
  w.unmount()
 })
})
