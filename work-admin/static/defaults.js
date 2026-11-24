import { defineComponent as k, ref as n, onMounted as u, openBlock as t, createElementBlock as o, createElementVNode as l, createVNode as c, unref as s, createTextVNode as m } from "vue";
import { e as f, c as g } from "./mount-Vm8EEgjb.js";
import "pinia";
import { host as v, define as y } from "@wippy-fe/proxy";
import d from "primevue/button";
const w = {
  class: "work-stack work-pane",
  "aria-label": "Work application defaults"
}, _ = { class: "work-row" }, b = ["config"], W = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, x = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, B = /* @__PURE__ */ k({
  __name: "WorkDefaults",
  setup(h) {
    const a = n(!1), i = n(!0), p = JSON.stringify({ namespace: "kickside.work", title: "Work application defaults", icon: "tabler:settings", help: "Defaults apply to boards without a policy override. Use board settings for items, workflows, access and plugins." });
    async function r() {
      i.value = !0, a.value = await f("kickside-settings-provider"), i.value = !1;
    }
    return u(r), (C, e) => (t(), o("section", w, [
      l("div", _, [
        e[1] || (e[1] = l("p", { class: "work-muted work-small work-spacer" }, "Manage individual boards in Work Admin.", -1)),
        c(s(d), {
          label: "Board settings",
          severity: "secondary",
          outlined: "",
          onClick: e[0] || (e[0] = (D) => s(v).navigate("/system/work"))
        })
      ]),
      a.value ? (t(), o("kickside-settings-provider", {
        key: 0,
        config: s(p)
      }, null, 8, b)) : i.value ? (t(), o("p", W, "Loading application settings…")) : (t(), o("p", x, [
        e[2] || (e[2] = m("Application settings are unavailable.", -1)),
        c(s(d), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          onClick: r
        })
      ]))
    ]));
  }
}), N = g(B, { type: "object", properties: {} });
y(import.meta.url, N);
//# sourceMappingURL=defaults.js.map
