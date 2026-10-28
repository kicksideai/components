// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect,vi} from 'vitest'
import {mount,config} from '@vue/test-utils'
import {PrimeVuePlugin} from '@wippy-fe/theme/primevue-plugin'
config.global.plugins=[PrimeVuePlugin]
import DocscoutPage from './DocscoutPage.vue'
import {newConfig,newField} from '../config'
import type {Snapshot,Extraction} from '../models'
vi.mock('@wippy-fe/proxy',()=>({loadByTagName:async()=>{}}))
const nameInput=(w:ReturnType<typeof mount>)=>w.get('input[aria-label="Extractor name"]')
async function details(w:ReturnType<typeof mount>){await w.findAll('button').find(b=>b.text()==='Details')!.trigger('click')}
const saveButton=(w:ReturnType<typeof mount>)=>w.findAll('button').find(b=>b.text()==='Save')!
function snapshot():Snapshot{return {id:'extractor',title:'Invoice reader',description:'Invoice fields',field_count:0,status:'configured',can_edit:true,can_share:true,expected_revision:7,config:newConfig(),retention:'2h',runs:[],cases:[]}}
describe('Docscout manage surface',()=>{
 it('saves all edited configuration with its loaded revision',async()=>{
  const wrapper=mount(DocscoutPage,{props:{snapshot:snapshot()}})
  await details(wrapper)
  await nameInput(wrapper).setValue('Invoice totals')
  await saveButton(wrapper).trigger('click')
  expect(wrapper.emitted('save')?.[0][0]).toMatchObject({title:'Invoice totals',expected_revision:7,config:{stages:expect.any(Object),retrieval:{search_mode:'hybrid'}}})
 })
 it('lets READ grantees see Test and Runs without configuration controls',()=>{
  const value:Snapshot={id:'extractor',title:'Invoice reader',field_count:1,status:'configured',can_edit:false,can_share:false,retention:'2h',runs:[]}
  const wrapper=mount(DocscoutPage,{props:{snapshot:value}})
  expect(wrapper.findAll('[role=tab]').map(x=>x.text())).toEqual(['Test','Runs']);expect(wrapper.text()).not.toContain('Unsaved changes');expect(wrapper.find('[aria-label="Extraction flow"]').exists()).toBe(false);expect(wrapper.text()).toContain('Run extraction')
 })
 it('offers sharing only to people who may share, through the platform share popup',async()=>{
  const reader:Snapshot={id:'extractor',title:'Invoice reader',field_count:1,status:'configured',can_edit:false,can_share:false,retention:'2h',runs:[]}
  expect(mount(DocscoutPage,{props:{snapshot:reader}}).findAll('button').some(b=>b.text()==='Share')).toBe(false)
  const wrapper=mount(DocscoutPage,{props:{snapshot:snapshot()},attachTo:document.body})
  await wrapper.findAll('button').find(b=>b.text()==='Share')!.trigger('click')
  await new Promise(r=>setTimeout(r))
  const popup=document.querySelector('kickside-share')!
  expect(JSON.parse(popup.getAttribute('config')!)).toEqual({resource_id:'extractor',title:'Invoice reader',
   access_url:'/api/v1/component-access/grants/extractor',share_url:'/api/v1/component-access/share/extractor'})
  popup.dispatchEvent(new CustomEvent('close'))
  await wrapper.vm.$nextTick()
  expect(document.querySelector('kickside-share')).toBeNull()
  wrapper.unmount()
 })
 it('starts each tab at the top of its content',async()=>{
  const wrapper=mount(DocscoutPage,{props:{snapshot:snapshot()}})
  await wrapper.findAll('[role=tab]').find(t=>t.text()==='Test')!.trigger('click')
  wrapper.get('.page-body').element.scrollTop=400
  await wrapper.findAll('[role=tab]').find(t=>t.text()==='Runs')!.trigger('click')
  expect(wrapper.get('.page-body').element.scrollTop).toBe(0)
 })
 it('offers an enabled choice for every optional reading step',async()=>{
  const wrapper=mount(DocscoutPage,{props:{snapshot:snapshot()}})
  const toggles=wrapper.findAll('[role=switch][aria-label^="Enable "]')
  expect(toggles.map(t=>t.attributes('aria-label'))).toEqual(['Enable Map the document','Enable Prefetch','Enable Scout loop','Enable Deep analysis','Enable Verify'])
  for(const toggle of toggles)expect(toggle.attributes('disabled')).toBeUndefined()
  await toggles[0].trigger('click')
  await saveButton(wrapper).trigger('click')
  expect((wrapper.emitted('save')?.[0][0] as {config:{stages:{map:{enabled:boolean}}}}).config.stages.map.enabled).toBe(false)
 })
 it('preserves edits and their original revision when another editor saves',async()=>{
  const initial=snapshot()
  const wrapper=mount(DocscoutPage,{props:{snapshot:initial}})
  await details(wrapper)
  await nameInput(wrapper).setValue('Local draft')
  const remote=snapshot();remote.title='Remote title';remote.expected_revision=8
  await wrapper.setProps({snapshot:remote})
  expect((nameInput(wrapper).element as HTMLInputElement).value).toBe('Local draft')
  await saveButton(wrapper).trigger('click')
  expect(wrapper.emitted('save')?.[0][0]).toMatchObject({title:'Local draft',expected_revision:7})
 })
 it('refreshes a pristine form to the committed revision',async()=>{
  const wrapper=mount(DocscoutPage,{props:{snapshot:snapshot()}})
  await details(wrapper)
  const remote=snapshot();remote.title='Remote title';remote.expected_revision=8
  await wrapper.setProps({snapshot:remote})
  expect((nameInput(wrapper).element as HTMLInputElement).value).toBe('Remote title')
  await nameInput(wrapper).setValue('Next draft')
  await saveButton(wrapper).trigger('click')
  expect(wrapper.emitted('save')?.[0][0]).toMatchObject({title:'Next draft',expected_revision:8})
 })
 it('accepts its committed revision when transport reorders configuration keys',async()=>{
  const wrapper=mount(DocscoutPage,{props:{snapshot:snapshot()}})
  await details(wrapper)
  await nameInput(wrapper).setValue('Saved title')
  await saveButton(wrapper).trigger('click')
  const committed=snapshot();committed.title='Saved title';committed.expected_revision=8
  const config=committed.config!
  committed.config={tags:config.tags,retrieval:config.retrieval,stages:config.stages,fields:config.fields}
  await wrapper.setProps({snapshot:committed})
  const save=saveButton(wrapper)
  expect(save.attributes('disabled')).toBeDefined()
  await nameInput(wrapper).setValue('Next title')
  await save.trigger('click')
  expect(wrapper.emitted('save')?.at(-1)?.[0]).toMatchObject({title:'Next title',expected_revision:8})
 })
 it('renders only an entered description',()=>{
  const value=snapshot();value.description=''
  const wrapper=mount(DocscoutPage,{props:{snapshot:value}})
  expect(wrapper.find('.description').exists()).toBe(false)
 })
 it('shows evidence locators, trace time and tokens from the typed result',async()=>{
  const result:Extraction={run_id:'run',upload_id:'upload',config_revision:7,duration_ms:4200,tokens:850,fields:[{name:'total',value:1250,confidence:.96,verified:true,evidence:[{quote:'Amount due: 1,250',section:'Summary',chunk_id:'chunk'}]}],trace:[{kind:'extract',status:'completed',scope:'chunk',duration_ms:4200,input_tokens:800,output_tokens:50}]}
  const wrapper=mount(DocscoutPage,{props:{snapshot:snapshot(),result}})
  await wrapper.findAll('[role=tab]').find(t=>t.text()==='Test')!.trigger('click')
  expect(wrapper.text()).toContain('Amount due: 1,250');expect(wrapper.text()).toContain('96% confidence');expect(wrapper.text()).toContain('850 tokens');expect(wrapper.text()).not.toContain('Page')
 })
 it('edits conditional enum and list field controls',async()=>{
  const value=snapshot();value.config!.fields=[{...newField(),name:'status'}]
  const wrapper=mount(DocscoutPage,{props:{snapshot:value}})
  await wrapper.get('.row-main').trigger('click')
  await wrapper.get('select[aria-label="Field type"]').setValue('enum')
  expect(wrapper.text()).toContain('Allowed values');expect(wrapper.text()).toContain('Add at least one allowed value.')
  const values=wrapper.get('textarea[placeholder="One per line"]')
  await values.setValue('Paid\nPaid\n Unpaid ');await values.trigger('change')
  expect((wrapper.get('textarea[placeholder="One per line"]').element as HTMLTextAreaElement).value).toBe('Paid\nUnpaid')
  await wrapper.get('select[aria-label="Field type"]').setValue('list')
  expect(wrapper.text()).toContain('Each item is');expect(wrapper.text()).toContain('Allowed items (optional)')
  await wrapper.get('select[aria-label="Field type"]').setValue('text')
  expect(wrapper.text()).not.toContain('Allowed')
  await wrapper.get('select[aria-label="Field type"]').setValue('enum')
  expect((wrapper.get('textarea[placeholder="One per line"]').element as HTMLTextAreaElement).value).toBe('')
 })
 it('shows deep fields under Deep analysis and field hints under Prefetch',async()=>{
  const value=snapshot();value.config!.fields=[{...newField(),name:'terms',strategy:'deep',search_hints:'payment terms'}]
  const wrapper=mount(DocscoutPage,{props:{snapshot:value}})
  const nodes=wrapper.findAll('.node')
  expect(nodes.find(n=>n.text().includes('Deep analysis'))!.text()).toContain('terms')
  expect(nodes.find(n=>n.text().includes('Prefetch'))!.text()).toContain('1 field hint')
 })
 it('records the per-step run trace on the flow',()=>{
  const result:Extraction={run_id:'run',upload_id:'upload',config_revision:7,duration_ms:2000,tokens:300,fields:[],trace:[{kind:'scout',status:'completed',scope:'chunk',duration_ms:2000,input_tokens:250,output_tokens:50,queries:['a','b']}]}
  const wrapper=mount(DocscoutPage,{props:{snapshot:snapshot(),result}})
  expect(wrapper.findAll('.node').find(n=>n.text().includes('Scout loop'))!.get('.trace-line').text()).toContain('2.0s · 300 tokens · 2 queries')
 })
 it('shows where a failed run stopped and marks values the document does not state',async()=>{
  const result:Extraction={run_id:'r',upload_id:'u',config_revision:1,duration_ms:900,tokens:40,status:'failed',error:'model unavailable',
   fields:[{name:'total',value:null,confidence:0,verified:true,missing:true,evidence:[]}],
   trace:[{kind:'read',status:'completed',duration_ms:100,input_tokens:40,output_tokens:0,message:'Processed 4 chunks'},{kind:'extract',status:'failed',duration_ms:800,input_tokens:0,output_tokens:0,message:'model unavailable'}]}
  const wrapper=mount(DocscoutPage,{props:{snapshot:snapshot(),result}})
  await wrapper.findAll('[role=tab]').find(t=>t.text()==='Test')!.trigger('click')
  expect(wrapper.get('.run-failed').text()).toContain('model unavailable')
  expect(wrapper.text()).toContain('Not in the document');expect(wrapper.text()).toContain('Read document')
 })
})
