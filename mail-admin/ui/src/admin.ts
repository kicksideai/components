// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { define } from '@wippy-fe/webcomponent-vue'
import { element } from './element'

type AdminProps = { route?: string }
type AdminEvents = { navigate: { route: string } | { path: string }; 'dirty-change': { dirty: boolean } }

const MailAdminElement = element<AdminProps, AdminEvents>(() => import('./app/mount').then(module => module.config),
  { type: 'object', properties: { route: { type: 'string', default: '' } } })
export async function webComponent() { return MailAdminElement }
define(import.meta.url, MailAdminElement)
