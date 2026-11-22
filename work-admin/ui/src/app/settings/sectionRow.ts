// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { InjectionKey, Ref } from 'vue'

export const sectionRow: InjectionKey<{
  selected: Readonly<Ref<string>>
  choose(section: string, id: string, open: boolean): void
}> = Symbol('section row')
