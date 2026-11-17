import { WippyVueElement, define, lazyVueConfig } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'

import stylesText from './styles.css?inline'



interface Props {}
interface Events { load: undefined; error: { message: string; error: unknown } }

class StorageS3Element extends WippyVueElement<Props, Events> {
  static get wippyConfig(): WippyElementConfig<Props> {
    return {
      propsSchema: { type: 'object', properties: {} } as unknown as WippyPropsSchema,
      hostCssKeys: ['themeConfigUrl', 'primeVueCssUrl'] as const,
      inlineCss: stylesText,
    }
  }
  static get vueConfig() { return lazyVueConfig(() => (() => import('./storage.vue'))().then(module => ({ rootComponent: module.default, plugins: [PrimeVuePlugin] })), { surface: 'compact', loading: 'Loading the S3 storage settings…', failed: 'Could not load the S3 storage settings. Reload the page to try again.', delay: 200, timeout: 30000 }) }
}

export async function webComponent() { return StorageS3Element }
define(import.meta.url, StorageS3Element)
