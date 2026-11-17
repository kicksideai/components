import { WippyVueElement, define, lazyVueConfig } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'

import stylesText from './card.css?inline'



// kickside-sso-provider — the generic provider admin card. The SSO admin shell
// mounts it once per discovered provider, passing that provider's config slice
// (namespace, fields, and registry-declared presentation: icon, accent, intro,
// docs) as the `config` attribute. Nothing here is provider-specific — a
// provider's identity is declared in its registry descriptor, not coded here. A
// provider needing bespoke UI declares its own ui_component tag instead.
interface P { config?: any }
interface E { 'config-changed': { namespace: string, enabled: boolean, configured: boolean } }

const propsSchema: WippyPropsSchema = { type: 'object', properties: { config: { type: 'object' } } }

class KicksideSsoProvider extends WippyVueElement<P, E> {
  static get wippyConfig(): WippyElementConfig<P> {
    return { propsSchema, hostCssKeys: ['themeConfigUrl'] as const, inlineCss: stylesText }
  }
  static get vueConfig() { return lazyVueConfig(() => (() => import('./app/ProviderCard.vue'))().then(module => ({ rootComponent: module.default })), { surface: 'compact', loading: 'Loading provider settings…', failed: 'Could not load the provider settings. Reload the page to try again.', delay: true ? 0 : 200, timeout: 30000 }) }
}

export async function webComponent() { return KicksideSsoProvider }
define(import.meta.url, KicksideSsoProvider)
