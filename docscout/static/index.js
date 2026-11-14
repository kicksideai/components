import { P as o, a as e } from "./wc-runtime-CWPiLYui.js";
import { d as r } from "./element-CSPa56BT.js";
import { l as n } from "./lazy-DyoS9hoz.js";
import "@iconify/vue";
import { define as a } from "@wippy-fe/proxy";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const i = n(
  () => import("./ManageRoot-BMeTMtk3.js"),
  { loading: "Loading the extractor…", failed: "Could not load the extractor. Reload the page to try again." },
  e
), t = r({ rootComponent: i, plugins: [o] }, { type: "object", properties: { "entry-id": { type: "string", default: "", description: "Id of the extractor component to manage, supplied by the workspace. Empty shows a message instead of an extractor." } } });
async function c() {
  return t;
}
a(import.meta.url, t);
export {
  c as webComponent
};
