// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { WippyVueElement } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema, WippyVueElementConfig } from '@wippy-fe/webcomponent-vue'
import stylesText from './styles.css?inline'

// The element shell: its root component and plugins load on first connect.
export function element<Props extends object, Events extends object>(lazyConfig: NonNullable<WippyVueElementConfig['lazyConfig']>, propsSchema: WippyPropsSchema) {
  return class extends WippyVueElement<Props, Events> {
    static get wippyConfig(): WippyElementConfig {
      return { propsSchema, hostCssKeys: ['themeConfigUrl', 'primeVueCssUrl', 'iframeCssUrl'] as const, inlineCss: stylesText }
    }
    static get vueConfig(): WippyVueElementConfig { return { lazyConfig } }
  }
}
