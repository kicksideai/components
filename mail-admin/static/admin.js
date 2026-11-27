import "vue";
import "./wc-runtime-UUwuoPn6.js";
import "pinia";
import { e as o } from "./element-y3HJ4Nny.js";
import { define as r } from "@wippy-fe/proxy";
const t = o(
  () => import("./mount-dNrBwIsa.js").then((e) => e.config),
  { type: "object", properties: { route: { type: "string", default: "" } } }
);
async function a() {
  return t;
}
r(import.meta.url, t);
export {
  a as webComponent
};
