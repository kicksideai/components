// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect,vi} from 'vitest'
import {mount,config} from '@vue/test-utils'
import {PrimeVuePlugin} from '@wippy-fe/theme/primevue-plugin'
config.global.plugins=[PrimeVuePlugin]
import DocscoutPage from './DocscoutPage.vue'
import {newConfig,newField} from '../config'
import {emptyEngine,type Snapshot} from '../models'
vi.mock('@wippy-fe/proxy',()=>({loadByTagName:async()=>{}}))
function snapshot():Snapshot{return {id:'extractor',title:'Invoice reader',description:'Invoice fields',field_count:0,status:'configured',can_edit:true,expected_revision:7,config:newConfig(),retention:'2h',runs:[],cases:[]}}
describe('Docscout manage surface',()=>{
 it('saves all edited configuration with its loaded revision',async()=>{
  const wrapper=mount(DocscoutPage,{props:{snapshot:snapshot()}})
  await wrapper.get('button[aria-selected=true]').trigger('click')
  await wrapper.findAll('input')[0].setValue('Invoice totals')
  const save=wrapper.findAll('button').find(b=>b.text()==='Save changes')!
  await save.trigger('click')
  expect(wrapper.emitted('save')?.[0][0]).toMatchObject({title:'Invoice totals',expected_revision:7,config:{workflow:expect.any(Array),retrieval:{search_mode:'hybrid'}}})
 })
 it('lets READ grantees see Test and Runs without configuration controls',()=>{
  const value:Snapshot={id:'extractor',title:'Invoice reader',field_count:1,status:'configured',can_edit:false,retention:'2h',runs:[]}
  const wrapper=mount(DocscoutPage,{props:{snapshot:value}})
  expect(wrapper.findAll('[role=tab]').map(x=>x.text())).toEqual(['Test','Runs']);expect(wrapper.text()).not.toContain('Save changes');expect(wrapper.text()).toContain('Extraction is not available yet.')
 })
 it('starts each tab at the top of its content',async()=>{
  const wrapper=mount(DocscoutPage,{props:{snapshot:snapshot()}})
  wrapper.get('.page-body').element.scrollTop=400
  await wrapper.findAll('[role=tab]').find(t=>t.text()==='Runs')!.trigger('click')
  expect(wrapper.get('.page-body').element.scrollTop).toBe(0)
 })
 it('offers an enabled choice for every reading step',async()=>{
  const wrapper=mount(DocscoutPage,{props:{snapshot:snapshot()}})
  await wrapper.findAll('[role=tab]').find(t=>t.text()==='Workflow')!.trigger('click')
  const toggles=wrapper.findAll('input[aria-label^="Enable "]')
  expect(toggles).toHaveLength(6)
  for(const toggle of toggles)expect(toggle.attributes('disabled')).toBeUndefined()
 })
 it('preserves edits and their original revision when another editor saves',async()=>{
  const initial=snapshot()
  const wrapper=mount(DocscoutPage,{props:{snapshot:initial}})
  await wrapper.findAll('input')[0].setValue('Local draft')
  const remote=snapshot();remote.title='Remote title';remote.expected_revision=8
  await wrapper.setProps({snapshot:remote})
  expect((wrapper.findAll('input')[0].element as HTMLInputElement).value).toBe('Local draft')
  await wrapper.findAll('button').find(b=>b.text()==='Save changes')!.trigger('click')
  expect(wrapper.emitted('save')?.[0][0]).toMatchObject({title:'Local draft',expected_revision:7})
 })
 it('refreshes a pristine form to the committed revision',async()=>{
  const wrapper=mount(DocscoutPage,{props:{snapshot:snapshot()}})
  const remote=snapshot();remote.title='Remote title';remote.expected_revision=8
  await wrapper.setProps({snapshot:remote})
  expect((wrapper.findAll('input')[0].element as HTMLInputElement).value).toBe('Remote title')
  await wrapper.findAll('input')[0].setValue('Next draft')
  await wrapper.findAll('button').find(b=>b.text()==='Save changes')!.trigger('click')
  expect(wrapper.emitted('save')?.[0][0]).toMatchObject({title:'Next draft',expected_revision:8})
 })
 it('accepts its committed revision when transport reorders configuration keys',async()=>{
  const wrapper=mount(DocscoutPage,{props:{snapshot:snapshot()}})
  await wrapper.findAll('input')[0].setValue('Saved title')
  await wrapper.findAll('button').find(b=>b.text()==='Save changes')!.trigger('click')
  const committed=snapshot();committed.title='Saved title';committed.expected_revision=8
  const config=committed.config!
  committed.config={tools:config.tools,retrieval:config.retrieval,workflow:config.workflow,fields:config.fields}
  await wrapper.setProps({snapshot:committed})
  const save=wrapper.findAll('button').find(b=>b.text()==='Save changes')!
  expect(save.attributes('disabled')).toBeDefined()
  await wrapper.findAll('input')[0].setValue('Next title')
  await save.trigger('click')
  expect(wrapper.emitted('save')?.at(-1)?.[0]).toMatchObject({title:'Next title',expected_revision:8})
 })
 it('renders only an entered description',()=>{
  const value=snapshot();value.description=''
  const wrapper=mount(DocscoutPage,{props:{snapshot:value}})
  expect(wrapper.find('.description').exists()).toBe(false)
 })
 it('shows evidence locators, trace time and tokens from the typed result',async()=>{
  const state=emptyEngine();state.result={run_id:'run',upload_id:'upload',config_revision:7,duration_ms:4200,tokens:850,fields:[{name:'total',value:1250,confidence:.96,verified:true,evidence:[{quote:'Amount due: 1,250',section:'Summary',chunk_id:'chunk'}]}],trace:[{kind:'extract',status:'completed',scope:'chunk',duration_ms:4200,input_tokens:800,output_tokens:50}]}
  const wrapper=mount(DocscoutPage,{props:{snapshot:snapshot(),engine:state}})
  await wrapper.findAll('[role=tab]').find(t=>t.text()==='Test')!.trigger('click')
  expect(wrapper.text()).toContain('Amount due: 1,250');expect(wrapper.text()).toContain('96% confidence');expect(wrapper.text()).toContain('850 tokens');expect(wrapper.text()).not.toContain('Page')
 })
 it('edits conditional enum and list field controls',async()=>{
  const value=snapshot();value.config!.fields=[{...newField(),name:'status'}]
  const wrapper=mount(DocscoutPage,{props:{snapshot:value}})
  await wrapper.get('select[aria-label="Field 1 type"]').setValue('enum')
  expect(wrapper.text()).toContain('Enum values')
  await wrapper.get('select[aria-label="Field 1 type"]').setValue('list')
  expect(wrapper.text()).toContain('List item type');expect(wrapper.text()).not.toContain('Enum values')
 })
})
