import { W as l, P as d, u as p } from "./wc-runtime-51OwIHAF.js";
import { Icon as i } from "@iconify/vue";
import { defineAsyncComponent as m, defineComponent as g, h as o, onMounted as c } from "vue";
import { define as u } from "@wippy-fe/proxy";
const h = 3e4, a = "display:flex;align-items:center;justify-content:center;min-height:2rem;font-size:.875rem;", f = "position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;";
function y(t) {
  matchMedia("(prefers-reduced-motion: reduce)").matches || t.el.animate({ rotate: ["0deg", "360deg"] }, { duration: 1e3, iterations: 1 / 0 });
}
function x(t, e, r) {
  const n = r();
  c(() => n("error", { message: t, error: e }));
}
function C(t, e, r) {
  return m({
    loader: t,
    loadingComponent: {
      render: () => o("span", {
        role: "status",
        "data-lazy-state": "loading",
        "aria-label": e.loading,
        style: `${a}color:var(--p-text-muted-color);`
      }, o("span", { style: "display:inline-flex;", onVnodeMounted: y }, o(i, { icon: "tabler:loader-2", "aria-hidden": "true" })))
    },
    errorComponent: g({
      props: { error: { type: Error, required: !0 } },
      setup(n) {
        return x(e.failed, n.error, r), () => o("span", {
          role: "alert",
          "data-lazy-state": "failed",
          title: e.iconOnly ? e.failed : void 0,
          style: `${a}color:var(--p-danger-500);`
        }, e.iconOnly ? [o(i, { icon: "tabler:alert-circle", "aria-hidden": "true" }), o("span", { style: f }, e.failed)] : e.failed);
      }
    }),
    delay: e.immediate ? 0 : 200,
    timeout: h,
    suspensible: !1
  });
}
const v = ":host{display:block;height:100%;min-height:0;color:var(--p-text-color)}.storage-s3{box-sizing:border-box;height:100%;overflow:auto;padding:1.5rem;background:var(--p-content-background)}.storage-s3 header,.storage-s3 form{max-width:48rem}.storage-s3 h2{margin:0 0 .75rem;font-size:1.25rem}.storage-s3 p,.storage-s3 small{color:var(--p-text-muted-color);line-height:1.5}.storage-s3 form{display:grid;gap:.75rem;margin-top:1.25rem}.storage-s3:has(>p[role=status]){min-height:329px}.storage-s3 label{font-weight:600}.storage-s3-actions{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:.5rem}:host>div:empty,:host>div:has(>[data-lazy-state]){min-height:329px}", w = C(
  () => import("./storage-BKuJHwP5.js"),
  { loading: "Loading the S3 storage settings…", failed: "Could not load the S3 storage settings. Reload the page to try again." },
  p
);
class s extends l {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: {} },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: v
    };
  }
  static get vueConfig() {
    return { rootComponent: w, plugins: [d] };
  }
}
async function M() {
  return s;
}
u(import.meta.url, s);
export {
  M as webComponent
};
