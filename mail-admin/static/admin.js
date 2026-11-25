import "vue";
import "./wc-runtime-Ch_wJl3O.js";
import "pinia";
import { e as o } from "./element-cQ96lpFr.js";
import { define as r } from "@wippy-fe/proxy";
const t = o(
  () => import("./mount-XYoQIHd5.js").then((e) => e.config),
  { type: "object", properties: { route: { type: "string", default: "" } } }
);
async function a() {
  return t;
}
r(import.meta.url, t);
export {
  a as webComponent
};
//# sourceMappingURL=admin.js.map
