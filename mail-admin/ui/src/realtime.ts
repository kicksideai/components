// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { on } from '@wippy-fe/proxy'
import { onBeforeUnmount } from 'vue'

export function useMailInvalidation(topic: 'mail.library' | 'mail.activity', refresh: () => void): void {
  const off = on(topic, refresh)
  onBeforeUnmount(() => { if (typeof off === 'function') off() })
}
