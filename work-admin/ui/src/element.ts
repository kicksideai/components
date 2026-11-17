// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { WippyVueElement } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'
import type { Component } from 'vue'
import type { ComponentProps } from './types'
import stylesText from './styles.css?inline'
interface Events { navigate: { route: string }; 'dirty-change': { dirty: boolean } }
export function element(rootComponent: Component, propsSchema: WippyPropsSchema) {
  return class extends WippyVueElement<ComponentProps, Events> {
    static get wippyConfig(): WippyElementConfig<ComponentProps> {
      return { propsSchema, hostCssKeys: ['themeConfigUrl', 'primeVueCssUrl', 'iframeCssUrl'] as const, inlineCss: stylesText }
    }
    static get vueConfig() { return { rootComponent, plugins: [PrimeVuePlugin] } }
  }
}
