// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

// Module updates retain the externals supplied by existing hosts. A newer host
// snapshot describes available packages, not a module's minimum host contract.
export const proxyExternals = ['vue', '@wippy-fe/proxy']
export const hostExternals = [...proxyExternals, '@iconify/vue']

// Lazy roots and their implementations share wrapper injection keys. Eager
// builds have no such boundary and keep the wrapper inside the entry. Shared
// theme dependencies stay with it so Rollup keeps import.meta.url in the entry.
export function wcRuntimeChunk(id, graph) {
  if (!id.includes('/@wippy-fe/webcomponent-') && !id.includes('/@wippy-fe/theme/')) return
  for (const moduleId of graph.getModuleIds()) {
    if (graph.getModuleInfo(moduleId)?.dynamicallyImportedIds.length) return 'wc-runtime'
  }
}
