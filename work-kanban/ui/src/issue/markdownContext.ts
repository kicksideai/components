// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { inject, provide, type InjectionKey, type Ref } from 'vue'
import type { BoardSchema } from '../work/types'

export interface MarkdownContext {
  board: Readonly<Ref<string | undefined>>
  schema: Readonly<Ref<BoardSchema | undefined>>
  resolve: (key: string) => Promise<string>
}

const key: InjectionKey<MarkdownContext> = Symbol('kanban-markdown')

export function provideMarkdown(context: MarkdownContext) {
  provide(key, context)
}

export function useMarkdown() {
  const context = inject(key)
  if (!context) throw new Error('Markdown content renders inside the Kanban page.')
  return context
}
