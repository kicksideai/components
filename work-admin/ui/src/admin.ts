// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { define } from '@wippy-fe/webcomponent-vue'
import { element } from './element'
import AdminApp from './app/settings/AdminApp.vue'
const WorkAdminElement = element(AdminApp, { type: 'object', properties: {} })
export async function webComponent() { return WorkAdminElement }
define(import.meta.url, WorkAdminElement)
