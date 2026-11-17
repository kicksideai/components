import { l as e } from "./wc-runtime-CBjtO5xN.js";
import { d as n } from "./element-BJNC4XNO.js";
import { define as r } from "@wippy-fe/proxy";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const t = n({
  ...e(() => import("./page-mount-7RNLJJGk.js").then((o) => o.mountConfig), { surface: "page", loading: "Loading…", failed: "Could not load Docscout. Reload the page to try again.", timeout: 3e4 })
}, { type: "object", properties: { route: { type: "string", default: "", description: "Sub-path under /docscout: empty for the list, an extractor id to open it." } } });
async function m() {
  return t;
}
r(import.meta.url, t);
export {
  m as webComponent
};
