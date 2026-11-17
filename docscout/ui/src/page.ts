// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { define, lazyVueConfig } from '@wippy-fe/webcomponent-vue'
import { docscoutElement } from './element'

const Element = docscoutElement({
  ...lazyVueConfig(() => import('./page-mount').then((module) => module.mountConfig), { surface: 'page', loading: 'Loading…', failed: 'Could not load Docscout. Reload the page to try again.', timeout: 30000 }),
}, {type:"object",properties:{route:{type:"string",default:"",description:"Sub-path under /docscout: empty for the list, an extractor id to open it."}}})
export async function webComponent() { return Element }
define(import.meta.url, Element)
