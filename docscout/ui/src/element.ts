// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { WippyVueElement } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema, WippyVueElementConfig } from '@wippy-fe/webcomponent-vue'
import stylesText from './styles.css?inline'

// Each entry passes its own vueConfig, so only the eager entry pulls in PrimeVuePlugin.
export function docscoutElement(vueConfig: WippyVueElementConfig, propsSchema: WippyPropsSchema) {
  return class extends WippyVueElement {
    static get wippyConfig(): WippyElementConfig {
      return { propsSchema, inlineCss: stylesText }
    }

    static get vueConfig() {
      return vueConfig
    }
  }
}
