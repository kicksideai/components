// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
// One client over the kickside/pim catalog endpoints, through the host proxy.
// Every call runs as the signed-in user; errors surface as thrown Errors with
// the server's message, never as silently empty data.
import { get, post, put } from './shared/transport'
import type { ApplyItem, ApplyResult, HistoryResult, CatalogRow, Declaration, PluginConfigs, ListTermsResult, SchemaOptions, SchemaPlan, SchemaView } from './types'

const BASE = '/api/v1/pim/catalogs'
const termPages = new Map<string, Promise<ListTermsResult>>()

export const pim = {
  catalogSummary: (id: string) => get<CatalogRow>(`${BASE}/${encodeURIComponent(id)}/summary`, 'catalog summary'),
  listCatalogs: (after?: number, text?: string) => get<{ catalogs: CatalogRow[]; after?: number }>(BASE, 'catalog list', {
    admin_only: 'true',
    ...(after == null ? {} : { after: String(after) }),
    ...(text ? { text } : {}),
  }),
  createCatalog: (title: string, declaration?: Declaration, pluginConfigs: PluginConfigs = {}) =>
    post<{ catalog_id: string; title: string }>(BASE, { idempotency_key: `ui-${Date.now()}`, title, declaration, plugin_configs: pluginConfigs }, 'catalog create'),
  history: (id: string, query: { limit?: number; before?: string } = {}) =>
    get<HistoryResult>(`${BASE}/${encodeURIComponent(id)}/history`, 'catalog history', Object.fromEntries(Object.entries(query).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]))),
  schema: (id: string) => get<SchemaView>(`${BASE}/${encodeURIComponent(id)}/schema`, 'schema'),
  applySchema: (id: string, declaration: Declaration, expectedGeneration: number, pluginConfigs: PluginConfigs = {}) =>
    post<{ generation: number; class: string }>(`${BASE}/${encodeURIComponent(id)}/schema`, { declaration, expected_generation: expectedGeneration, plugin_configs: pluginConfigs }, 'schema apply'),
  planSchema: (id: string, declaration: Declaration, expectedGeneration: number, pluginConfigs: PluginConfigs = {}) =>
    post<SchemaPlan>(`${BASE}/${encodeURIComponent(id)}/schema/plan`, { declaration, expected_generation: expectedGeneration, plugin_configs: pluginConfigs }, 'schema plan'),
  resumePluginProjection: (id: string, cursorId: string) =>
    put<{ status: string }>(`/api/v1/threads/${encodeURIComponent(id)}/projections/resume`, { cursor_id: cursorId }, 'resume background update'),
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
