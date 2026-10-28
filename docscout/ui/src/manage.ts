// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { define } from '@wippy-fe/webcomponent-vue'
import { docscoutElement } from './element'
import Root from './app/ManageRoot.vue'
const Element = docscoutElement(Root, {type:"object",properties:{"entry-id":{type:"string",default:"",description:"Id of the extractor component to manage, supplied by the workspace. Empty shows a message instead of an extractor."}}})
export async function webComponent() { return Element }
define(import.meta.url, Element)
