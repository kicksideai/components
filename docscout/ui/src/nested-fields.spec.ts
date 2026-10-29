// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect} from 'vitest'
import {newConfig,newField,configError,fieldPath} from './config'
describe('Nested field configuration',()=>{
 it('allows duplicate names across groups and rejects prefix collisions',()=>{
  const c=newConfig();c.fields=[{...newField(),name:'name',group:'parties.borrower'},{...newField(),name:'name',group:'parties.agent'}]
  expect(configError(c)).toBe('');expect(fieldPath(c.fields[0])).toBe('parties.borrower.name')
  c.fields.push({...newField(),name:'parties'});expect(configError(c)).toContain('collides')
 })
 it('rejects free text groups and undeclared complex shapes',()=>{
  const c=newConfig();c.fields=[{...newField(),name:'terms',group:'Free text'}];expect(configError(c)).toContain('snake_case')
  c.fields[0].group='';c.fields[0].type='object';expect(configError(c)).toContain('property')
 })
})

describe('Recursive property validation',()=>{
 it('rejects duplicate properties and fifth-level values, while allowing a four-level object list',()=>{
  const c=newConfig();c.fields=[{...newField(),name:'terms',type:'object',properties:[{name:'rows',type:'list',description:'',enum_values:[],expected_format:'',required:true,item:{type:'object',properties:[{name:'amount',type:'number',description:'',enum_values:[],expected_format:'',required:true}]}}]}]
  expect(configError(c)).toBe('')
  const item=c.fields[0].properties![0].item!
  item.properties!.push({...item.properties![0]});expect(configError(c)).toContain('Another field already uses this name')
  item.properties!.pop();Object.assign(item.properties![0],{type:'list',item:{type:'number'}})
  expect(configError(c)).toContain('four levels')
 })
})

describe('Nested value identity',()=>{
 it('treats legal field names that match object members as absent until explicitly assigned',async()=>{
  const {getValue,setValue}=await import('./config')
  const value:Record<string,unknown>={}
  expect(getValue(value,'constructor')).toBeUndefined()
  setValue(value,'constructor.name','Borrower')
  expect(getValue(value,'constructor.name')).toBe('Borrower')
  expect(Object.prototype).not.toHaveProperty('name')
 })
})
