// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect} from 'vitest'
import {newConfig,newField,configError,extractCalls,fieldGroups,formatPlaceholder,isOn,stageSummary,takesChoices} from './config'
describe('Extractor configuration',()=>{
 it('uses independent drafts, the premium extraction class and the stage graph',()=>{
  const one=newConfig(),two=newConfig();one.fields.push(newField())
  expect(two.fields).toEqual([])
  expect(Object.keys(two.stages)).toEqual(['map','prefetch','scout','deep','extract','verify'])
  expect(two.stages.extract.model).toBe('class:premium')
  expect(isOn(two,'extract')).toBe(true);expect(isOn(two,'verify')).toBe(false)
 })
 it('explains missing, invalid and duplicate names, empty enums, and overlapping chunks',()=>{
  const config=newConfig();config.fields=[newField()];expect(configError(config)).toBe('New field: Name the field.')
  config.fields[0].name='1st';expect(configError(config)).toContain('Start with a letter')
  config.fields[0].name='status';config.fields[0].type='enum';expect(configError(config)).toBe('status: Add at least one allowed value.')
  config.fields[0].enum_values=['Paid'];expect(configError(config)).toBe('')
  config.fields.push({...config.fields[0]});expect(configError(config)).toContain('Another field already uses this name')
  config.fields=[];config.retrieval.overlap=config.retrieval.chunk_size;expect(configError(config)).toContain('Overlap')
 })
 it('enforces the cross-stage rules the server enforces',()=>{
  const c=newConfig();c.fields=[{...newField(),name:'terms',search_within:'sections'}]
  c.stages.map.enabled=false;expect(configError(c)).toContain('Map the document')
  c.stages.map.enabled=true;expect(configError(c)).toBe('')
  c.stages.scout.mode='agent';c.stages.scout.tools=[];expect(configError(c)).toContain('at least one tool')
  c.stages.scout.tools=['kickside.docscout.tools:read_section'];c.stages.verify.enabled=true;c.stages.verify.check_quotes=false;c.stages.verify.check_support=false
  expect(configError(c)).toContain('Verify needs')
 })
 it('suggests an expected format that matches the value type',()=>{
  expect(formatPlaceholder({...newField(),type:'date'})).toContain('YYYY-MM-DD')
  expect(formatPlaceholder({...newField(),type:'list',item_type:'number'})).toContain('decimal')
  expect(takesChoices({...newField(),type:'list'})).toBe(true);expect(takesChoices({...newField(),type:'text'})).toBe(false)
 })
})

describe('Complete flow configuration',()=>{
 it('carries the v1 defaults on their stages',()=>{
  const c=newConfig()
  expect(c.tags).toEqual([])
  expect(newField()).toMatchObject({chunks:5,search_within:'document',group:''})
  expect(c.stages.scout).toMatchObject({mode:'loop',max_rounds:0,target_confidence:.7,max_extra_queries:3,max_tokens:4096,share_notes:true})
  expect(c.stages.extract.structured_output).toBe(true)
  expect(c.stages.deep).toMatchObject({query_model:'class:fast',max_queries:5,chunks_per_query:50,chunk_cap:100,min_similarity:.2,query_temperature:.2,analysis_temperature:.2})
  expect(c.stages.scout.tools.every(id=>id.startsWith('kickside.docscout.tools:'))).toBe(true)
  expect(c.retrieval).toMatchObject({context:'headings',keep_tables:true})
 })
 it('plans extraction calls per field group',()=>{
  const c=newConfig();c.stages.extract.max_fields_per_call=2
  c.fields=['a','b','c'].map(name=>({...newField(),name,group:'Payment'})).concat([{...newField(),name:'d'}])
  expect(fieldGroups(c).map(g=>[g.name,g.fields.length])).toEqual([['Payment',3],['Default',1]])
  expect(extractCalls(c)).toBe(3)
  expect(stageSummary('extract',c)).toContain('2 groups, 3 calls')
 })
})
