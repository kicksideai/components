import { a as o } from "./wc-runtime-DUvG5Zds.js";
import { P as e } from "./primevue-plugin-UREsRVxx.js";
import { d as r } from "./element-vGzRkDdj.js";
import { l as n } from "./lazy-DyoS9hoz.js";
import "@iconify/vue";
import { define as a } from "@wippy-fe/proxy";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const i = n(
  () => import("./ManageRoot-C_kATzmN.js"),
  { loading: "Loading the extractor…", failed: "Could not load the extractor. Reload the page to try again." },
  o
), t = r({ rootComponent: i, plugins: [e] }, { type: "object", properties: { "entry-id": { type: "string", default: "", description: "Id of the extractor component to manage, supplied by the workspace. Empty shows a message instead of an extractor." } } });
async function f() {
  return t;
}
a(import.meta.url, t);
export {
  f as webComponent
};
