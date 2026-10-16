import {WippyVueElement, define, type WippyElementConfig, type WippyPropsSchema} from '@wippy-fe/webcomponent-vue'
import {PrimeVuePlugin} from '@wippy-fe/theme/primevue-plugin'
import Onboarding from './app/Onboarding.vue'
import stylesText from './styles.css?inline'
import pkg from '../package.json'
class AgentOnboardingElement extends WippyVueElement {
  static get wippyConfig():WippyElementConfig {
    return {propsSchema:pkg.wippy.props as WippyPropsSchema,hostCssKeys:['themeConfigUrl','primeVueCssUrl','iframeCssUrl'],inlineCss:stylesText}
  }
  static get vueConfig() {return {rootComponent:Onboarding,plugins:[PrimeVuePlugin]}}
}
export async function webComponent(){return AgentOnboardingElement}
define(import.meta.url,AgentOnboardingElement)
