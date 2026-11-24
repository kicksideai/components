// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { define } from '@wippy-fe/webcomponent-vue'
import { element } from './element'
import MailAdminRoot from './app/MailAdminRoot.vue'

const MailAdminElement = element(MailAdminRoot, { type: 'object', properties: { route: { type: 'string', default: '' } } })
export async function webComponent() { return MailAdminElement }
define(import.meta.url, MailAdminElement)
