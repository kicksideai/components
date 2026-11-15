// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { InjectionKey, Ref } from 'vue'

export type DefinitionColumn = 'code' | 'kind' | 'details' | 'usage'
export const definitionColumns: InjectionKey<Ref<readonly DefinitionColumn[]>> = Symbol('definitionColumns')
export const columnLabels: Record<DefinitionColumn, string> = { code: 'Code', kind: 'Kind', details: 'Details', usage: 'Used by' }
export const columnWidths: Record<DefinitionColumn, string> = {
  code: 'minmax(120px, 1fr)', kind: '140px', details: 'minmax(120px, 1.2fr)', usage: '120px',
}
