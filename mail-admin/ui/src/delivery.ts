// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { define } from '@wippy-fe/webcomponent-vue'
import { element } from './element'
import DeliverySettings from './delivery/DeliverySettings.vue'

const DeliveryElement = element(DeliverySettings, { type: 'object', properties: { config: { type: 'object' } } })
export async function webComponent() { return DeliveryElement }
define(import.meta.url, DeliveryElement)
