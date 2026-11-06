import { a as e } from "./wc-runtime-DUvG5Zds.js";
import { d as r } from "./element-5V4dxOhR.js";
import { a as n } from "./lazy-Cqrjy7hv.js";
import "@iconify/vue";
import { define as a } from "@wippy-fe/proxy";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const t = r({
  lazyConfig: n(
    () => import("./page-mount-D8n2XWF7.js").then((o) => o.mountConfig),
    "Could not load Docscout. Reload the page to try again.",
    e
  )
}, { type: "object", properties: { route: { type: "string", default: "", description: "Sub-path under /docscout: empty for the list, an extractor id to open it." } } });
async function c() {
  return t;
}
a(import.meta.url, t);
export {
  c as webComponent
};
