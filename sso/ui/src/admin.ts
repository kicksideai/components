import { WippyVueElement, define } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import Admin from './app/admin.vue'
import stylesText from './admin.css?inline'

// kickside-sso-admin — the provider configuration panel mounted by the System
// "Single sign-on" tab. A separate element from the login surface (kickside-sso),
// built as its own bundle (admin.js) and registered as its own view.component.
// The host supplies the tag via the declare-tag query on import. The optional
// `config` prop selects the mode: { scope: "global" } renders only the module
// Global section; { provider: "<id>" } renders only that provider's card.
interface AdminProps { config?: unknown }
interface AdminEvents {
  load: undefined
  error: { message: string, error: unknown }
}

const PROPS_SCHEMA = { type: 'object', properties: { config: { type: 'object' } } } as unknown as WippyPropsSchema

class KicksideSsoAdminElement extends WippyVueElement<AdminProps, AdminEvents> {
  static get wippyConfig(): WippyElementConfig<AdminProps> {
    return {
      propsSchema: PROPS_SCHEMA,
      hostCssKeys: ['themeConfigUrl'] as const,
      inlineCss: stylesText,
    }
  }

  static get vueConfig() {
    return { rootComponent: Admin }
  }
}

export async function webComponent() {
  return KicksideSsoAdminElement
}

define(import.meta.url, KicksideSsoAdminElement)
