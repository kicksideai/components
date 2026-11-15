// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { beforeEach, expect, it, vi } from 'vitest'
import { api } from '@wippy-fe/proxy'
import { pim } from './api'
import { principalLabels } from './shared/labels'
import { ApiError } from './shared/transport'

beforeEach(() => {
  vi.mocked(api.get).mockResolvedValue({ data: { success: true, data: {} } } as never)
  vi.mocked(api.post).mockResolvedValue({ data: { success: true, data: {} } } as never)
})
it('sends the reviewed declaration, expected generation and initial plugin configuration through PIM', async () => {
  const draft = { aspects: [{ namespace: 'core' }] }, configs = { plugin: { enabled: true } }
  await pim.planSchema('a/b', draft, 4, configs)
  expect(api.post).toHaveBeenLastCalledWith('/api/v1/pim/catalogs/a%2Fb/schema/plan', { declaration: draft, expected_generation: 4, plugin_configs: configs })
  await pim.applySchema('a/b', draft, 4, configs)
  expect(api.post).toHaveBeenLastCalledWith('/api/v1/pim/catalogs/a%2Fb/schema', { declaration: draft, expected_generation: 4, plugin_configs: configs })
})
it('scopes principal labels to the edited catalog and deduplicates references', async () => {
  vi.mocked(api.post).mockResolvedValue({ data: { data: { principals: [{ id: 'user', label: 'A person' }] } } } as never)
  expect(await principalLabels('cat/id', ['user', 'user'])).toEqual({ user: 'A person' })
  expect(api.post).toHaveBeenLastCalledWith('/api/v1/pim-admin/catalogs/cat%2Fid/principal_labels', { refs: [{ type: 'user', id: 'user' }] })
})
it('preserves backend error classification and details', async () => {
  vi.mocked(api.post).mockRejectedValue({ response: { status: 409, data: { message: 'Schema generation changed', kind: 'Conflict', details: { code: 'schema_conflict' } } } })
  await expect(pim.applySchema('cat', {}, 1)).rejects.toMatchObject({ name: 'ApiError', message: 'Schema generation changed', status: 409, kind: 'Conflict', details: { code: 'schema_conflict' } })
})
it('rejects failed response envelopes', async () => {
  vi.mocked(api.get).mockResolvedValue({ data: { success: false, message: 'Denied', kind: 'PermissionDenied' } } as never)
  await expect(pim.schema('cat')).rejects.toBeInstanceOf(ApiError)
})
it('exposes schema administration and term calls without consumer APIs', () => {
  expect(Object.keys(pim).sort()).toEqual(['catalogSummary', 'listCatalogs', 'createCatalog', 'schema', 'applySchema', 'planSchema', 'configurePlugin', 'schemaOptions', 'apply', 'termsPage', 'invalidateTerms'].sort())
})
