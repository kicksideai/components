// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect,vi} from 'vitest'
import {client} from './client'
import {newConfig} from './config'
const api=vi.hoisted(()=>({get:vi.fn(),post:vi.fn(),put:vi.fn(),delete:vi.fn()}))
vi.mock('@wippy-fe/proxy',()=>({api}))
describe('Docscout client',()=>{
 it('passes filters and opaque cursors to the registered list endpoint',async()=>{
  const params={filter:'invoice totals',cursor:'opaque/+==',limit:25}
  const page={success:true,items:[],next_cursor:'next/+=='}
  api.get.mockResolvedValue({data:page})
  expect(await client.list(params)).toEqual(page)
  expect(api.get).toHaveBeenCalledWith('/api/v1/docscout',{params})
 })
 it('carries expected revision on every configuration save',async()=>{
  api.put.mockResolvedValue({data:{success:true,context_revision:4}})
  await client.update('component/id',{title:'Extractor',description:'',config:newConfig(),expected_revision:3})
  expect(api.put).toHaveBeenCalledWith('/api/v1/docscout/component%2Fid',expect.objectContaining({expected_revision:3}))
 })
 it('surfaces rejected component operations',async()=>{
  api.get.mockResolvedValue({data:{success:false,error:'Access denied'}})
  await expect(client.get('private')).rejects.toThrow('Access denied')
 })
})
