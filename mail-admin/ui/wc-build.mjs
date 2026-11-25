// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0


// Lazy roots and their implementations share wrapper injection keys. Eager
// builds have no such boundary and keep the wrapper inside the entry. Shared
// theme dependencies stay with it so Rollup keeps import.meta.url in the entry.
export function wcRuntimeChunk(id, graph) {
  if (!id.includes('/@wippy-fe/webcomponent-') && !id.includes('/@wippy-fe/theme/')) return
  for (const moduleId of graph.getModuleIds()) {
    if (graph.getModuleInfo(moduleId)?.dynamicallyImportedIds.length) return 'wc-runtime'
  }
}
