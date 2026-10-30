// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect,vi,beforeEach} from 'vitest'
import {mount} from '@vue/test-utils'
vi.mock('@wippy-fe/proxy',()=>({loadByTagName:async()=>{}}))
import Builder from './Builder.vue'
import {newConfig,newField} from '../config'
function build(){const config=newConfig();config.fields=[{...newField(),name:'total',type:'number'}];return mount(Builder,{props:{config,retention:'2h',result:null,title:'Invoice reader',description:''},attachTo:document.body})}
beforeEach(()=>localStorage.clear())
describe('Builder panel',()=>{
 it('offers extraction limits with structured output as the only mode',async()=>{
  const w=build()
  await w.get('[aria-label="Extract"]').trigger('click')
  expect(w.find('[role=switch][aria-label="Structured output"]').exists()).toBe(false)
  expect(w.get('.side-panel').text()).toContain('Fields per call')
  expect(w.get('[aria-label="Extract"]').text()).toContain('Structured output')
  expect(w.findAll('.node').every(node=>node.classes().includes('kx-focus-halo'))).toBe(true)
  expect(w.get('[aria-label="Collapse panel"]').classes()).toContain('kx-focus-outline')
  w.unmount()
 })
 it('keeps keyboard focus inside the narrow modal panel',async()=>{
  let report:(entries:{contentRect:{width:number}}[])=>void=()=>{}
  vi.stubGlobal('ResizeObserver',class{constructor(cb:typeof report){report=cb}observe(){}disconnect(){}})
  const w=build()
  report([{contentRect:{width:600}}]);await w.vm.$nextTick()
  await w.get('.row-main').trigger('click');await w.vm.$nextTick()
  const panel=w.get('.side-panel')
  expect(w.get('.canvas').attributes('inert')).toBeDefined()
  const first=panel.get('button[aria-label="Close panel"]')
  const last=panel.findAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])').at(-1)!
  ;(last.element as HTMLElement).focus()
  ;(panel.get('[data-pc-section="lastfocusableelement"]').element as HTMLElement).focus()
  expect(document.activeElement).toBe(first.element)
  ;(panel.get('[data-pc-section="firstfocusableelement"]').element as HTMLElement).focus()
  expect(document.activeElement).toBe(last.element)
  w.unmount();vi.unstubAllGlobals()
 })
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
 it('opens the narrow panel as a dialog that Escape closes, returning focus to its opener',async()=>{
  let report:(entries:{contentRect:{width:number}}[])=>void=()=>{}
  vi.stubGlobal('ResizeObserver',class{constructor(cb:typeof report){report=cb}observe(){}disconnect(){}})
  const w=build()
  report([{contentRect:{width:600}}]);await w.vm.$nextTick()
  expect(w.find('.side-panel').exists()).toBe(false)
  const row=w.get('.row-main');(row.element as HTMLElement).focus()
  await row.trigger('click');await w.vm.$nextTick()
  const panel=w.get('.side-panel')
  expect(panel.attributes('role')).toBe('dialog');expect(panel.attributes('aria-modal')).toBe('true')
  expect(panel.element.contains(document.activeElement)).toBe(true)
  await panel.trigger('keydown',{key:'Escape'})
  expect(w.find('.side-panel').exists()).toBe(false)
  expect(document.activeElement).toBe(row.element)
  vi.unstubAllGlobals();w.unmount()
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
 it('draws the evidence and deep branches between Map and Extract',()=>{
  const w=build()
  const labels=w.findAll('.flow .node').map(n=>n.attributes('aria-label')??n.find('.node-title').text())
  expect(labels).toEqual(['Read document','Map the document','Prefetch','Scout loop','Deep analysis','Extract','Verify','Output'])
  const branches=w.findAll('.branches .branch')
  expect(branches.map(b=>b.get('.branch-label').text())).toEqual(['Evidence','Deep fields'])
  expect(branches[0].text()).toContain('Scout loop');expect(branches[1].text()).toContain('Deep analysis')
  w.unmount()
 })
})
