import {WippyVueElement, define, useEvents, type WippyElementConfig, type WippyPropsSchema} from '@wippy-fe/webcomponent-vue'
import {lazyPage} from './lazy'
import stylesText from './styles.css?inline'
import pkg from '../package.json'
class AgentOnboardingElement extends WippyVueElement {
  static get wippyConfig():WippyElementConfig {
    return {propsSchema:pkg.wippy.props as WippyPropsSchema,hostCssKeys:['themeConfigUrl','primeVueCssUrl','iframeCssUrl'],inlineCss:stylesText}
  }
  static get vueConfig() {
    return {
      lazyConfig: lazyPage(
        () => import('./lazy-mount').then((module) => module.mountConfig),
        'Could not load the onboarding. Reload the page to try again.',
        useEvents,
      ),
    }
  }
}
export async function webComponent(){return AgentOnboardingElement}
define(import.meta.url,AgentOnboardingElement)
