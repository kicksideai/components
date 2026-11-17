// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { define, lazyVueConfig } from '@wippy-fe/webcomponent-vue'
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'
import { docscoutElement } from './element'


const Element = docscoutElement(lazyVueConfig(() => (() => import('./app/ManageRoot.vue'))().then(module => ({ rootComponent: module.default, plugins: [PrimeVuePlugin] })), { surface: 'compact', loading: 'Loading the extractor…', failed: 'Could not load the extractor. Reload the page to try again.', delay: 200, timeout: 30000 }), {type:"object",properties:{"entry-id":{type:"string",default:"",description:"Id of the extractor component to manage, supplied by the workspace. Empty shows a message instead of an extractor."}}})
export async function webComponent() { return Element }
define(import.meta.url, Element)
