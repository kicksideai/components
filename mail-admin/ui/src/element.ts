// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { WippyVueElement } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema, WippyVueElementConfig } from '@wippy-fe/webcomponent-vue'
import type { ComponentProps } from './types'
import stylesText from './styles.css?inline'

interface Events { navigate: { route: string }; 'dirty-change': { dirty: boolean } }

// The element shell: its root component and plugins load on first connect.
export function element(lazyConfig: NonNullable<WippyVueElementConfig['lazyConfig']>, propsSchema: WippyPropsSchema) {
  return class extends WippyVueElement<ComponentProps, Events> {
    static get wippyConfig(): WippyElementConfig<ComponentProps> {
      return { propsSchema, hostCssKeys: ['themeConfigUrl', 'primeVueCssUrl', 'iframeCssUrl'] as const, inlineCss: stylesText }
    }
    static get vueConfig(): WippyVueElementConfig { return { lazyConfig } }
  }
}
