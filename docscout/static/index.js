import { l as o, P as a } from "./wc-runtime-CBjtO5xN.js";
import { d as r } from "./element-Cj3pfe_-.js";
import { define as n } from "@wippy-fe/proxy";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const t = r(o(() => import("./ManageRoot-emWWW8-c.js").then((e) => ({ rootComponent: e.default, plugins: [a] })), { surface: "compact", loading: "Loading the extractor…", failed: "Could not load the extractor. Reload the page to try again.", delay: 200, timeout: 3e4 }), { type: "object", properties: { "entry-id": { type: "string", default: "", description: "Id of the extractor component to manage, supplied by the workspace. Empty shows a message instead of an extractor." } } });
async function s() {
  return t;
}
n(import.meta.url, t);
export {
  s as webComponent
};
