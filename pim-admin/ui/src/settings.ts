// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { WippyVueElement, define } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'
import type { CatalogSettingsEvents } from './types'
import SettingsApp from './app/SettingsApp.vue'
import stylesText from './styles.css?inline'
interface Props { catalogId?: string; embedded?: boolean; focusBack?: boolean; route?: string }
class CatalogSettingsElement extends WippyVueElement<Props, CatalogSettingsEvents> {
  static get wippyConfig(): WippyElementConfig<Props> {
    return {
      propsSchema: { type: 'object', properties: { 'catalog-id': { type: 'string', default: '' }, embedded: { type: 'boolean', default: false }, route: { type: 'string' }, 'focus-back': { type: 'boolean', default: false } } } as WippyPropsSchema,
      hostCssKeys: ['themeConfigUrl', 'primeVueCssUrl'] as const,
      inlineCss: stylesText,
    }
  }
  static get vueConfig() { return { rootComponent: SettingsApp, plugins: [PrimeVuePlugin] } }
}
export async function webComponent() { return CatalogSettingsElement }
define(import.meta.url, CatalogSettingsElement)
