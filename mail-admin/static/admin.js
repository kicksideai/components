import "vue";
import "./wc-runtime-UUwuoPn6.js";
import "pinia";
import { e as o } from "./element-lUbWx5OY.js";
import { define as r } from "@wippy-fe/proxy";
const t = o(
  () => import("./mount-BM2gRELn.js").then((e) => e.config),
  { type: "object", properties: { route: { type: "string", default: "" } } }
);
async function a() {
  return t;
}
r(import.meta.url, t);
export {
  a as webComponent
};
