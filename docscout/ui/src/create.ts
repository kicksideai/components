// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { define } from '@wippy-fe/webcomponent-vue'
import { docscoutElement } from './element'
import Root from './app/CreateRoot.vue'
const Element = docscoutElement(Root, {"type": "object", "properties": {"parent-id": {"type": "string"}, "submit-nonce": {"type": "string"}}})
export async function webComponent() { return Element }
define(import.meta.url, Element)
