// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { define } from '@wippy-fe/webcomponent-vue'
import { element } from './element'
import SettingsRoot from './app/settings/SettingsRoot.vue'
const KicksideWorkSettings = element(SettingsRoot, {
  type: 'object', properties: {
    'board-id': { type: 'string', default: '', description: 'Board to administer.' },
    'focus-back': { type: 'boolean', default: false, description: 'Focus the back arrow when opening settings from the board picker.' },
    embedded: { type: 'boolean', default: false, description: 'Fits in a System detail pane.' },
  },
})
export async function webComponent() { return KicksideWorkSettings }
define(import.meta.url, KicksideWorkSettings)
