import "vue";
import "./wc-runtime-UUwuoPn6.js";
import "pinia";
import { e as o } from "./element-lUbWx5OY.js";
import { define as r } from "@wippy-fe/proxy";
const e = o(
  () => import("./mount-Dklb7Ftb.js").then((t) => t.config),
  { type: "object", properties: { config: { type: "object" } } }
);
async function f() {
  return e;
}
r(import.meta.url, e);
export {
  f as webComponent
};
