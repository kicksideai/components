// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect,vi} from 'vitest'
import {ref} from 'vue'
import {mount,flushPromises} from '@vue/test-utils'
import {PrimeVuePlugin} from '@wippy-fe/theme/primevue-plugin'
import schema from '../../../src/config.schema.json'
const {create,emit}=vi.hoisted(()=>({create:vi.fn(),emit:vi.fn()}))
vi.mock('@wippy-fe/webcomponent-vue',async importOriginal=>({...await importOriginal<typeof import('@wippy-fe/webcomponent-vue')>(),useProps:()=>ref({parentId:'folder'}),useEvents:()=>emit}))
vi.mock('@wippy-fe/proxy',()=>({loadByTagName:async()=>{}}))
vi.mock('../client',()=>({client:{create}}))
import CreateRoot from './CreateRoot.vue'
import CreateForm from './CreateForm.vue'
describe('Extractor creation payload',()=>{
 it('submits every schema default through the workspace creation path',async()=>{
  create.mockResolvedValue({component_id:'extractor'})
  const wrapper=mount(CreateRoot,{global:{plugins:[PrimeVuePlugin]}})
  wrapper.getComponent(CreateForm).vm.$emit('submit',{title:'Reader',description:'Typed fields'})
  await flushPromises()
  expect(create).toHaveBeenCalledWith({title:'Reader',description:'Typed fields',parent_id:'folder',config:schema.default})
  for(const stage of ['map','scout','extract','verify'] as const)expect(create.mock.calls[0][0].config.stages[stage].temperature).toBe(0)
  expect(emit).toHaveBeenCalledWith('created',{id:'extractor'})
  wrapper.unmount()
 })
})
