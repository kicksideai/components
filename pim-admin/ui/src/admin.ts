// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'
import { WippyVueElement, define } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import type { ComponentProps } from './types'
import AdminApp from './app/AdminApp.vue'
import stylesText from './styles.css?inline'

// The System tab: catalog schema administration, mounted by the shell's
// settings page under kickside-pim-admin.
const propsSchema: WippyPropsSchema = { type: 'object', properties: {} }

class KicksidePimAdminElement extends WippyVueElement<ComponentProps, Record<string, never>> {
  static get wippyConfig(): WippyElementConfig<ComponentProps> {
    return { propsSchema, hostCssKeys: ['themeConfigUrl', 'primeVueCssUrl'] as const, inlineCss: stylesText }
  }

  static get vueConfig() {
    return { rootComponent: AdminApp, plugins: [PrimeVuePlugin] }
  }
}

export async function webComponent() {
  return KicksidePimAdminElement
}

define(import.meta.url, KicksidePimAdminElement)
