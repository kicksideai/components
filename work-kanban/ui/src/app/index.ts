// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'
import { define, WippyVueElement, type WippyElementConfig, type WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import pkg from '../../package.json'
import { issueStyles } from '../issue'
import { presentationStyles } from '../presentation'
import type { Navigate } from '../route'
import KanbanPage from './KanbanPage.vue'
import styles from './styles.css?inline'

class KanbanElement extends WippyVueElement<{ route: string }, { navigate: Navigate }> {
  static get wippyConfig(): WippyElementConfig {
    return {
      propsSchema: pkg.wippy.props as WippyPropsSchema,
      hostCssKeys: ['themeConfigUrl', 'primeVueCssUrl', 'iframeCssUrl'],
      containerClasses: ['kanban-surface'],
      inlineCss: [styles, presentationStyles, issueStyles].join('\n'),
    }
  }

  static get vueConfig() {
    return { rootComponent: KanbanPage, plugins: [PrimeVuePlugin], mountLifecycle: true as const }
  }
}

export async function webComponent() {
  return KanbanElement
}

define(import.meta.url, KanbanElement)
