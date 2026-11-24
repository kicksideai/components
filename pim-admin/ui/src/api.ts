// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api } from '@wippy-fe/proxy'
import { request, type AdminFailure } from '../../../admin-http'
import { get, post } from './shared/transport'
import type { ApplyItem, ApplyResult, HistoryResult, CatalogRow, Declaration, PluginConfigs, ListTermsResult, SchemaOptions, SchemaPlan, SchemaView } from './types'

const BASE = '/api/v1/pim/catalogs'
const termPages = new Map<string, Promise<ListTermsResult>>()

type ProjectionResume = { success: true; status: string } | AdminFailure

function resumePluginProjection(id: string, cursorId: string): Promise<{ status: string }> {
  return request<{ status: string }>(async () => {
    const { data }: { data: ProjectionResume } = await api.put(
      `/api/v1/threads/${encodeURIComponent(id)}/projections/resume`, { cursor_id: cursorId },
    )
    if (data?.success !== true) return { data }
    return { data: typeof data.status === 'string' ? { success: true, data } : undefined }
  }, 'resume background update')
}

export const pim = {
  catalogSummary: (id: string) => get<CatalogRow>(`${BASE}/${encodeURIComponent(id)}/summary`, 'catalog summary'),
  listCatalogs: (after?: number, text?: string) => get<{ catalogs: CatalogRow[]; after?: number }>(BASE, 'catalog list', {
    admin_only: 'true',
    ...(after == null ? {} : { after: String(after) }),
    ...(text ? { text } : {}),
  }),
  createCatalog: (title: string, idempotencyKey: string, declaration?: Declaration, pluginConfigs: PluginConfigs = {}) =>
    post<{ catalog_id: string; title: string }>(BASE, { idempotency_key: idempotencyKey, title, declaration, plugin_configs: pluginConfigs }, 'catalog create'),
  history: (id: string, query: { limit?: number; before?: string } = {}) =>
    get<HistoryResult>(`${BASE}/${encodeURIComponent(id)}/history`, 'catalog history', Object.fromEntries(Object.entries(query).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]))),
  schema: (id: string) => get<SchemaView>(`${BASE}/${encodeURIComponent(id)}/schema`, 'schema'),
  applySchema: (id: string, declaration: Declaration, expectedGeneration: number, pluginConfigs: PluginConfigs = {}) =>
    post<{ generation: number; class: string }>(`${BASE}/${encodeURIComponent(id)}/schema`, { declaration, expected_generation: expectedGeneration, plugin_configs: pluginConfigs }, 'schema apply'),
  planSchema: (id: string, declaration: Declaration, expectedGeneration: number, pluginConfigs: PluginConfigs = {}) =>
    post<SchemaPlan>(`${BASE}/${encodeURIComponent(id)}/schema/plan`, { declaration, expected_generation: expectedGeneration, plugin_configs: pluginConfigs }, 'schema plan'),
  resumePluginProjection,
  updateCatalogApp: (id: string, uiApp: string) =>
    post<{ catalog_id: string; ui_app?: string }>(`${BASE}/${encodeURIComponent(id)}/settings`, { ui_app: uiApp }, 'catalog app settings'),
  configurePlugin: (id: string, plugin: string, config: Record<string, unknown>, reset = false) =>
    post<{ seq: number }>(`${BASE}/${encodeURIComponent(id)}/plugins/configure`, { plugin, config, ...(reset ? { reset: true } : {}) }, 'plugin configuration'),
  schemaOptions: (id: string) => get<SchemaOptions>(`${BASE}/${encodeURIComponent(id)}/schema/options`, 'schema options'),
  apply: (id: string, items: ApplyItem[]) => post<ApplyResult>(`${BASE}/${encodeURIComponent(id)}/apply`, { items }, 'term change'),
  termsPage: (id: string, vocabulary: string, after?: string): Promise<ListTermsResult> => {
    const cacheKey = JSON.stringify([id, vocabulary, after])
    let page = termPages.get(cacheKey)
    if (!page) {
      page = get<ListTermsResult>(`${BASE}/${encodeURIComponent(id)}/terms`, 'terms', { vocabulary, retired: 'true', limit: '50', ...(after ? { after } : {}) })
      termPages.set(cacheKey, page)
      void page.catch(() => { if (termPages.get(cacheKey) === page) termPages.delete(cacheKey) })
    }
    return page
  },
  invalidateTerms: (id: string) => {
    for (const key of termPages.keys()) if ((JSON.parse(key) as string[])[0] === id) termPages.delete(key)
  },
}
