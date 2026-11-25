// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { define } from '@wippy-fe/webcomponent-vue'
import { element } from './element'

const MailAdminElement = element(() => import('./app/mount').then(module => module.config),
  { type: 'object', properties: { route: { type: 'string', default: '' } } })
export async function webComponent() { return MailAdminElement }
define(import.meta.url, MailAdminElement)
