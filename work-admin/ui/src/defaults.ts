// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { define } from '@wippy-fe/webcomponent-vue'
import { element } from './element'
import WorkDefaults from './app/settings/WorkDefaults.vue'
const WorkDefaultsElement = element(WorkDefaults, { type: 'object', properties: {} })
export async function webComponent() { return WorkDefaultsElement }
define(import.meta.url, WorkDefaultsElement)
