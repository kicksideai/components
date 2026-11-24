// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { inject, type InjectionKey, type Ref } from 'vue'
import type { useLibrary } from './library/useLibrary'
import type { Route } from './route'
import type { Capabilities, DeliveryStatus, ResourceKey, TemplateKind } from './types'

export interface CreateIntent { kind?: TemplateKind; from?: ResourceKey }

export interface MailContext {
  library: ReturnType<typeof useLibrary>
  capabilities: Ref<Capabilities | undefined>
  delivery: Ref<DeliveryStatus | undefined>
  go: (route: Route) => void
  create: (intent: CreateIntent) => void
  upload: () => void
  setDirty: (dirty: boolean) => void
  setTitle: (title: string) => void
}

export const mailContextKey: InjectionKey<MailContext> = Symbol('mail-admin')

export function useMail(): MailContext {
  const context = inject(mailContextKey)
  if (!context) throw new Error('Mail administration context is missing')
  return context
}
