import { WippyVueElement, define, type WippyElementConfig, type WippyPropsSchema, lazyVueConfig } from '@wippy-fe/webcomponent-vue'

import stylesText from './styles.css?inline'
import pkg from '../package.json'
class AgentOnboardingElement extends WippyVueElement {
  static get wippyConfig():WippyElementConfig {
    return {propsSchema:pkg.wippy.props as WippyPropsSchema,hostCssKeys:['themeConfigUrl','primeVueCssUrl','iframeCssUrl'],inlineCss:stylesText}
  }
  static get vueConfig() {
    return {
      ...lazyVueConfig(() => import('./lazy-mount').then((module) => module.mountConfig), { surface: 'page', loading: 'Loading…', failed: 'Could not load the onboarding. Reload the page to try again.', timeout: 30000 }),
    }
  }
}
export async function webComponent(){return AgentOnboardingElement}
define(import.meta.url,AgentOnboardingElement)
