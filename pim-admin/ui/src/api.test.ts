// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it, vi } from 'vitest'
import { api } from '@wippy-fe/proxy'
import type { AdminFailure } from '../../../admin-http'
import { pim } from './api'
import { principalLabels } from './shared/labels'
import { ApiError } from './shared/transport'
import { principalResponse, successResponse } from './test/proxy'
import type { HistoryResult, SchemaPlan } from './types'

vi.mock('@wippy-fe/proxy', () => ({ api: { get: vi.fn(), post: vi.fn(), put: vi.fn() } }))

it('sends the reviewed declaration, expected generation and initial plugin configuration through PIM', async () => {
  const draft = { aspects: [{ namespace: 'core' }] }, configs = { plugin: { enabled: true } }
  vi.mocked(api.post).mockResolvedValueOnce(successResponse<SchemaPlan>({ generation: 4, class: 'additive', changes: [], refused: [] }))
    .mockResolvedValueOnce(successResponse({ generation: 5, class: 'additive' }))
  await pim.planSchema('a/b', draft, 4, configs)
  expect(api.post).toHaveBeenLastCalledWith('/api/v1/pim/catalogs/a%2Fb/schema/plan', { declaration: draft, expected_generation: 4, plugin_configs: configs })
  await pim.applySchema('a/b', draft, 4, configs)
  expect(api.post).toHaveBeenLastCalledWith('/api/v1/pim/catalogs/a%2Fb/schema', { declaration: draft, expected_generation: 4, plugin_configs: configs })
})
it('scopes principal labels to the edited catalog and deduplicates references', async () => {
  vi.mocked(api.post).mockResolvedValueOnce(principalResponse({ type: 'user', id: 'user', label: 'A person' }))
  expect(await principalLabels('cat/id', ['user', 'user'])).toEqual({ user: 'A person' })
  expect(api.post).toHaveBeenLastCalledWith('/api/v1/pim-admin/catalogs/cat%2Fid/principal_labels', { refs: [{ type: 'user', id: 'user' }] })
})
it('preserves backend error classification and details', async () => {
  const data: AdminFailure = { success: false, message: 'Schema generation changed', kind: 'CONFLICT', details: { code: 'schema_generation_conflict' } }
  vi.mocked(api.post).mockRejectedValueOnce({ response: { status: 409, data } })
  await expect(pim.applySchema('cat', {}, 1)).rejects.toMatchObject({ name: 'ApiError', message: data.message, status: 409, kind: data.kind, details: data.details })
})
it('rejects failed response envelopes', async () => {
  const data: AdminFailure = { success: false, error: 'Denied', kind: 'PERMISSION_DENIED' }
  vi.mocked(api.get).mockResolvedValueOnce({ data })
  await expect(pim.schema('cat')).rejects.toBeInstanceOf(ApiError)
})
it.each([{ data: {} }, { success: true }, { catalog_id: 'cat' }])('rejects malformed admin responses %#', async data => {
  vi.mocked(api.get).mockResolvedValueOnce({ data })
  await expect(pim.schema('cat')).rejects.toMatchObject({
    kind: 'INTERNAL', details: { code: 'response_envelope_invalid' },
  })
})
it('ignores fields of the wrong type in a proxy rejection', async () => {
  vi.mocked(api.post).mockRejectedValueOnce({ response: { status: '409', data: { success: false, error: 'Denied', kind: 3, details: ['schema_conflict'], retryable: 'no' } } })
  await expect(pim.applySchema('cat', {}, 1)).rejects.toMatchObject({
    message: 'Denied', status: undefined, kind: undefined, details: undefined, retryable: undefined,
  })
})
it('accepts the projection endpoint’s status at the top level', async () => {
  vi.mocked(api.put).mockResolvedValueOnce({ data: { success: true, cursor_id: 'cursor', status: 'active' } })
  await expect(pim.resumePluginProjection('a/b', 'cursor')).resolves.toMatchObject({ status: 'active' })
  expect(api.put).toHaveBeenLastCalledWith('/api/v1/threads/a%2Fb/projections/resume', { cursor_id: 'cursor' })
})
it('rejects a projection reply without its declared status', async () => {
  vi.mocked(api.put).mockResolvedValueOnce({ data: { success: true } })
  await expect(pim.resumePluginProjection('cat', 'cursor')).rejects.toMatchObject({
    kind: 'INTERNAL', details: { code: 'response_envelope_invalid' },
  })
})
it('exposes schema administration and term calls without consumer APIs', () => {
  expect(Object.keys(pim).sort()).toEqual(['history', 'catalogSummary', 'listCatalogs', 'createCatalog', 'schema', 'applySchema', 'planSchema', 'configurePlugin', 'resumePluginProjection', 'updateCatalogApp', 'schemaOptions', 'apply', 'termsPage', 'invalidateTerms'].sort())
})

it('uses the existing history endpoint with an encoded catalog and cursor query', async () => {
  const response = successResponse<HistoryResult>({ entries: [], as_of: 4 })
  vi.mocked(api.get).mockResolvedValueOnce(response).mockResolvedValueOnce(response)
  await pim.history('a/b', { limit: 50, before: '7:2' })
  expect(api.get).toHaveBeenLastCalledWith('/api/v1/pim/catalogs/a%2Fb/history', { params: { limit: '50', before: '7:2' } })
  await pim.history('a/b', { limit: 50 })
  expect(api.get).toHaveBeenLastCalledWith('/api/v1/pim/catalogs/a%2Fb/history', { params: { limit: '50' } })
})
