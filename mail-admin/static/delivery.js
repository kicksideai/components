import "vue";
import "./wc-runtime-Ch_wJl3O.js";
import "pinia";
import { e as o } from "./element-CzweWfW9.js";
import { define as r } from "@wippy-fe/proxy";
const e = o(
  () => import("./mount-rvBc_H30.js").then((t) => t.config),
  { type: "object", properties: { config: { type: "object" } } }
);
async function f() {
  return e;
}
r(import.meta.url, e);
export {
  f as webComponent
};
//# sourceMappingURL=delivery.js.map
