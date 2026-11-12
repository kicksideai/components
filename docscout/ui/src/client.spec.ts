// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect,vi} from 'vitest'
import {client} from './client'
import {newConfig} from './config'
const api=vi.hoisted(()=>({get:vi.fn(),post:vi.fn(),put:vi.fn(),delete:vi.fn()}))
vi.mock('@wippy-fe/proxy',()=>({api}))
describe('Docscout client',()=>{
 it('preserves the original pre-run API error',async()=>{
  const cause=new Error('Request failed with status code 400')
  Object.assign(cause,{response:{data:{success:false,error:'The model does not support page images',kind:'Invalid',details:{code:'model_vision_unsupported'}}}})
  api.post.mockRejectedValueOnce(cause)
  await expect(client.run('reader','upload')).rejects.toBe(cause)
 })
 it('preserves a transport error without an API error envelope',async()=>{
  const cause=new Error('Transport failed')
  api.post.mockRejectedValueOnce(cause)
  await expect(client.run('reader','upload')).rejects.toBe(cause)
 })
 it('passes an optional page range and keeps omitted-range request bodies unchanged',async()=>{
  api.post.mockResolvedValue({data:{run_id:'r'}})
  const pages={first:2,last:4}
  await client.run('reader','upload',pages)
  expect(api.post).toHaveBeenLastCalledWith('/api/v1/docscout/reader/run',{upload_id:'upload',pages})
  await client.run('reader','upload')
  expect(api.post).toHaveBeenLastCalledWith('/api/v1/docscout/reader/run',{upload_id:'upload'})
 })
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
