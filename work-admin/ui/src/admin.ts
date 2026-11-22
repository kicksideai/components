// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { define } from '@wippy-fe/webcomponent-vue'
import { element } from './element'
import AdminRoot from './app/settings/AdminRoot.vue'
const WorkAdminElement = element(AdminRoot, { type: 'object', properties: { route: { type: 'string', default: '' } } })
export async function webComponent() { return WorkAdminElement }
define(import.meta.url, WorkAdminElement)
