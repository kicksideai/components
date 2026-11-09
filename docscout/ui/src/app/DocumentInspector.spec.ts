// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect,vi} from 'vitest'
import {mount} from '@vue/test-utils'
vi.mock('@wippy-fe/proxy',()=>({loadByTagName:async()=>{}}))
import DocumentInspector from './DocumentInspector.vue'
import {newConfig} from '../config'

describe('Extractor retention',()=>{
 it('edits the extractor window and clears it to inherit the global setting',async()=>{
  const config=newConfig()
  const wrapper=mount(DocumentInspector,{props:{config,retention:'2h'}})
  const input=wrapper.get('input[aria-label="Retention window"]')
  expect(input.attributes('placeholder')).toBe('Global setting')
  await input.setValue('24h')
  expect(config.retention).toBe('24h')
  await input.setValue('')
  expect(config).not.toHaveProperty('retention')
  wrapper.unmount()
 })
})
