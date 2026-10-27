// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect} from 'vitest'
import {newConfig,newField,configError,moveStep} from './config'
describe('Extractor configuration',()=>{
 it('uses independent drafts, the premium extraction class and six steps',()=>{
  const one=newConfig(),two=newConfig();one.fields.push(newField())
  expect(two.fields).toEqual([]);expect(two.workflow.map(s=>s.kind)).toEqual(['map','prefetch','scout','deep','extract','verify']);expect(two.workflow[4].model).toBe('class:premium')
 })
 it('keeps mapping first when steps move',()=>{
  const config=newConfig();moveStep(config,1,-1);expect(config.workflow[0].kind).toBe('map');moveStep(config,3,-1);expect(config.workflow[2].kind).toBe('deep')
 })
 it('explains invalid names, duplicate names, missing enums, and overlapping chunks',()=>{
  const config=newConfig();config.fields=[newField()];expect(configError(config)).toContain('Field names start')
  config.fields[0].name='status';config.fields[0].type='enum';expect(configError(config)).toContain('Enum fields')
  config.fields[0].enum_values=['Paid'];expect(configError(config)).toBe('')
  config.fields.push({...config.fields[0]});expect(configError(config)).toContain('unique')
  config.fields=[];config.retrieval.overlap=config.retrieval.chunk_size;expect(configError(config)).toContain('Overlap')
 })
})
