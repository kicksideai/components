// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect} from 'vitest'
import {newConfig,newField,configError,moveStep,formatPlaceholder,takesChoices} from './config'
describe('Extractor configuration',()=>{
 it('uses independent drafts, the premium extraction class and six steps',()=>{
  const one=newConfig(),two=newConfig();one.fields.push(newField())
  expect(two.fields).toEqual([]);expect(two.workflow.map(s=>s.kind)).toEqual(['map','prefetch','scout','deep','extract','verify']);expect(two.workflow[4].model).toBe('class:premium')
 })
 it('keeps mapping first when steps move',()=>{
  const config=newConfig();moveStep(config,1,-1);expect(config.workflow[0].kind).toBe('map');moveStep(config,3,-1);expect(config.workflow[2].kind).toBe('deep')
 })
 it('explains missing, invalid and duplicate names, empty enums, and overlapping chunks',()=>{
  const config=newConfig();config.fields=[newField()];expect(configError(config)).toBe('New field: Name the field.')
  config.fields[0].name='1st';expect(configError(config)).toContain('Start with a letter')
  config.fields[0].name='status';config.fields[0].type='enum';expect(configError(config)).toBe('status: Add at least one allowed value.')
  config.fields[0].enum_values=['Paid'];expect(configError(config)).toBe('')
  config.fields.push({...config.fields[0]});expect(configError(config)).toContain('Another field already uses this name')
  config.fields=[];config.retrieval.overlap=config.retrieval.chunk_size;expect(configError(config)).toContain('Overlap')
 })
 it('suggests an expected format that matches the value type',()=>{
  expect(formatPlaceholder({...newField(),type:'date'})).toContain('YYYY-MM-DD')
  expect(formatPlaceholder({...newField(),type:'list',item_type:'number'})).toContain('decimal')
  expect(takesChoices({...newField(),type:'list'})).toBe(true);expect(takesChoices({...newField(),type:'text'})).toBe(false)
 })
})

describe('Complete flow configuration',()=>{
 it('stores the v1 defaults and query records',()=>{
  const c=newConfig()
  expect(c.tags).toEqual([])
  expect(c.shared_context).toBe(true)
  expect(newField().chunks).toBe(5)
  expect(c.workflow.find(s=>s.kind==='scout')?.options).toMatchObject({max_iterations:0,target_confidence:.7,max_extra_queries:3,max_tokens:4096})
  expect(c.workflow.find(s=>s.kind==='extract')?.options.structured_output).toBe(true)
  expect(c.workflow.find(s=>s.kind==='deep')?.options).toMatchObject({query_model:'class:fast',max_queries:5,chunks_per_query:50,chunk_cap:100,min_similarity:.2,query_temperature:.2,analysis_temperature:.2})
  expect(c.tools.every(id=>id.startsWith('kickside.docscout.tools:'))).toBe(true)
 })
 it('keeps extraction fixed and verification after extraction',()=>{
  const c=newConfig();moveStep(c,4,-1);expect(c.workflow[4].kind).toBe('extract')
  moveStep(c,5,-1);expect(c.workflow[5].kind).toBe('verify')
 })
})
