// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { define } from '@wippy-fe/webcomponent-vue'
import { docscoutElement } from './element'
import Root from './app/PageRoot.vue'
const Element = docscoutElement(Root, {type:"object",properties:{route:{type:"string",default:"",description:"Sub-path under /docscout: empty for the list, an extractor id to open it."}}})
export async function webComponent() { return Element }
define(import.meta.url, Element)
