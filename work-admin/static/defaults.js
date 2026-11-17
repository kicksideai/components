import { defineComponent as u, ref as n, onMounted as k, openBlock as o, createElementBlock as t, createElementVNode as l, createVNode as d, unref as s, createTextVNode as m } from "vue";
import "@iconify/vue";
import { host as f, define as g } from "@wippy-fe/proxy";
import "pinia";
import { e as v, a as y } from "./mount-DyrlIXV_.js";
import p from "primevue/button";
const _ = {
  class: "work-stack work-pane",
  "aria-label": "Work application defaults"
}, w = { class: "work-row" }, b = ["config"], B = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, x = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, N = /* @__PURE__ */ u({
  __name: "WorkDefaults",
  setup(h) {
    const r = n(!1), i = n(!0), c = JSON.stringify({ namespace: "kickside.work", title: "Work application defaults", icon: "tabler:settings", help: "Defaults apply to boards without a policy override. Board fields, processes, plugins and overrides are configured in Board settings." });
    async function a() {
      i.value = !0, r.value = await v("kickside-settings-provider"), i.value = !1;
    }
    return k(a), (C, e) => (o(), t("section", _, [
      l("div", w, [
        e[1] || (e[1] = l("p", { class: "work-muted work-small work-spacer" }, "For individual board settings and policy overrides, open board administration.", -1)),
        d(s(p), {
          label: "Board settings",
          severity: "secondary",
          outlined: "",
          onClick: e[0] || (e[0] = (D) => s(f).navigate("/system/work"))
        })
      ]),
      r.value ? (o(), t("kickside-settings-provider", {
        key: 0,
        config: s(c)
      }, null, 8, b)) : i.value ? (o(), t("p", B, "Loading application settings…")) : (o(), t("p", x, [
        e[2] || (e[2] = m("Application settings are unavailable.", -1)),
        d(s(p), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          onClick: a
        })
      ]))
    ]));
  }
}), W = y(N, { type: "object", properties: {} });
g(import.meta.url, W);
//# sourceMappingURL=defaults.js.map
