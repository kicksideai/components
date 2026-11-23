// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { WorkError } from '../work/client'
import { searchRequest, searchProblem } from './model'

it('uses Work lexical match and passes the saved view cursor unchanged', () => {
  expect(searchRequest('  ROPS-1  ', undefined, 'opaque')).toEqual({
    body: { where: { match: 'ROPS-1' }, limit: 20, after: 'opaque' },
  })
  expect(searchRequest('', 'view-1', 'opaque')).toEqual({ view: 'view-1', body: { limit: 20, after: 'opaque' } })
  expect(searchRequest('   ')).toBeUndefined()
})
it('asks callers to refine candidate-budget errors and retry indexing separately', () => {
  expect(searchProblem(new WorkError({ code: 'search_verification_budget' }, 503)).message).toMatch(/refine/i)
  expect(searchProblem(new WorkError({ code: 'search_indexing' }, 503)).message).toMatch(/indexing/i)
})
