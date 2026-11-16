// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { define, useEvents } from '@wippy-fe/webcomponent-vue'
import { docscoutElement } from './element'
import { lazyPage } from './lazy'
const Element = docscoutElement({
  lazyConfig: lazyPage(
    () => import('./page-mount').then((module) => module.mountConfig),
    'Could not load Docscout. Reload the page to try again.',
    useEvents,
  ),
}, {type:"object",properties:{route:{type:"string",default:"",description:"Sub-path under /docscout: empty for the list, an extractor id to open it."}}})
export async function webComponent() { return Element }
define(import.meta.url, Element)
