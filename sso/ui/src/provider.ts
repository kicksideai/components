import { WippyVueElement, define, useEvents } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import { lazyControl } from './lazy'
import stylesText from './card.css?inline'

const Root = lazyControl(
  () => import('./app/ProviderCard.vue'),
  { loading: 'Loading provider settings…', failed: 'Could not load the provider settings. Reload the page to try again.' },
  useEvents,
)

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
  static get vueConfig() { return { rootComponent: Root } }
}

export async function webComponent() { return KicksideSsoProvider }
define(import.meta.url, KicksideSsoProvider)
