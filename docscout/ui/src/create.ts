// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { define } from '@wippy-fe/webcomponent-vue'
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'
import { docscoutElement } from './element'
import Root from './app/CreateRoot.vue'
// Eager exception: the create view takes submit-nonce, so it keeps its root.
const Element = docscoutElement({ rootComponent: Root, plugins: [PrimeVuePlugin] }, {type:"object",properties:{"parent-id":{type:"string",default:"",description:"Workspace folder the new extractor is placed in; empty places it at the root."},"submit-nonce":{type:"string",default:"",description:"Changing value the host sets to submit the form from its own button."}}})
export async function webComponent() { return Element }
define(import.meta.url, Element)
