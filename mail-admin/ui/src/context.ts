// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { inject, type InjectionKey, type Ref } from 'vue'
import type { useLibrary } from './library/useLibrary'
import type { Route } from './route'
import type { DeliveryStatus, ResourceKey, ResourceKind } from './types'

export interface CreateIntent { kind?: ResourceKind; from?: ResourceKey }

export interface MailContext {
  library: ReturnType<typeof useLibrary>
  delivery: Ref<DeliveryStatus | undefined>
  deliveryAdmin: Ref<boolean>
  go: (route: Route) => void
  create: (intent: CreateIntent) => void
}

export const mailContextKey: InjectionKey<MailContext> = Symbol('mail-admin')

export function useMail(): MailContext {
  const context = inject(mailContextKey)
  if (!context) throw new Error('Mail administration context is missing')
  return context
}
