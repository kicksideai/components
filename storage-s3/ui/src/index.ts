import { WippyVueElement, define } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'
import Storage from './storage.vue'
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
  static get vueConfig() { return { rootComponent: Storage, plugins: [PrimeVuePlugin] } }
}

export async function webComponent() { return StorageS3Element }
define(import.meta.url, StorageS3Element)
