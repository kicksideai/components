// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

type ChunkGraph = {
  getModuleIds(): IterableIterator<string>
  getModuleInfo(id: string): { dynamicallyImportedIds: readonly string[] } | null
}

export const proxyExternals: string[]
export const hostExternals: string[]
export function wcRuntimeChunk(id: string, graph: ChunkGraph): string | undefined
