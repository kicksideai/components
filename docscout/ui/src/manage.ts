// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { define } from '@wippy-fe/webcomponent-vue'
import { docscoutElement } from './element'
import Root from './app/ManageRoot.vue'
const Element = docscoutElement(Root, {type:"object",properties:{"entry-id":{type:"string",description:"Selected component id supplied by the workspace."}}})
export async function webComponent() { return Element }
define(import.meta.url, Element)
