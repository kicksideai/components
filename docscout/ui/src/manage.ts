// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { define, useEvents } from '@wippy-fe/webcomponent-vue'
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'
import { docscoutElement } from './element'
import { lazyControl } from './lazy'
const Root = lazyControl(
  () => import('./app/ManageRoot.vue'),
  { loading: 'Loading the extractor…', failed: 'Could not load the extractor. Reload the page to try again.' },
  useEvents,
)
const Element = docscoutElement({ rootComponent: Root, plugins: [PrimeVuePlugin] }, {type:"object",properties:{"entry-id":{type:"string",default:"",description:"Id of the extractor component to manage, supplied by the workspace. Empty shows a message instead of an extractor."}}})
export async function webComponent() { return Element }
define(import.meta.url, Element)
