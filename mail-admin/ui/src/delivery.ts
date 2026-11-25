// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { define } from '@wippy-fe/webcomponent-vue'
import { element } from './element'

const DeliveryElement = element(() => import('./delivery/mount').then(module => module.config),
  { type: 'object', properties: { config: { type: 'object' } } })
export async function webComponent() { return DeliveryElement }
define(import.meta.url, DeliveryElement)
