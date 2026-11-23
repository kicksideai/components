import { defineComponent as y, ref as h, openBlock as n, createElementBlock as r, createElementVNode as a, createVNode as i, unref as l, createTextVNode as g, Fragment as m, renderList as b, toDisplayString as x } from "vue";
import { Icon as c } from "@iconify/vue";
import { api as w } from "@wippy-fe/proxy";
import { u as C, a as E } from "./wc-runtime-C_4MpFvn.js";
const z = () => C(), A = { class: "kx" }, N = { class: "kx-hero" }, V = { class: "kx-hero-inner" }, O = { class: "kx-hero-mark" }, W = { class: "kx-body" }, $ = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, j = {
  key: 1,
  class: "kx-err"
}, B = {
  key: 2,
  class: "kx-empty"
}, I = {
  key: 3,
  class: "kx-grid"
}, L = ["aria-label", "onClick"], R = { class: "kx-card-icon" }, S = { class: "kx-card-name" }, T = { class: "kx-card-go" }, D = /* @__PURE__ */ y({
  __name: "dashboard",
  setup(F) {
    const _ = z(), d = h([]), s = h("loading");
    let u = 0;
    const k = /^[a-z][a-z0-9]*-[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    function f(t) {
      if (!t?.id || !t.label || t.hidden || typeof t.path != "string") return !1;
      const e = t.path.split(/[?#]/, 1)[0];
      return !e.startsWith("/") || e.startsWith("//") || e === "/" || t.path.includes("\\") || t.path.includes("://") ? !1 : t.render === "component" ? typeof t.component_tag == "string" && t.component_tag.length <= 80 && k.test(t.component_tag) : (!t.render || t.render === "surface") && e === "/system" && (t.surface || t.route_name) === "system";
    }
    async function p() {
      const t = ++u;
      s.value = "loading";
      try {
        const { data: e } = await w.get("/api/v1/nav/list");
        if (t !== u) return;
        if (e?.success !== !0) throw new Error("Navigation unavailable");
        const o = e.items;
        if (!Array.isArray(o) && !(e.count === 0 && o && typeof o == "object" && !Object.keys(o).length))
          throw new Error("Invalid navigation response");
        d.value = Array.isArray(o) ? o.filter(f) : [], s.value = "ready";
      } catch {
        t === u && (s.value = "error");
      }
    }
    function v(t) {
      _("navigate", { path: t.path, route_name: t.route_name, component_tag: t.component_tag, id: t.id });
    }
    return E(p), (t, e) => (n(), r("div", A, [
      a("header", N, [
        a("div", V, [
          a("div", O, [
            i(l(c), {
              icon: "tabler:sparkles",
              "aria-hidden": "true"
            })
          ]),
          e[0] || (e[0] = a("div", { class: "kx-hero-text" }, [
            a("h1", { class: "kx-hero-title" }, "Welcome to KickSide")
          ], -1))
        ])
      ]),
      a("div", W, [
        s.value === "loading" ? (n(), r("div", $, [
          i(l(c), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          e[1] || (e[1] = g(" Loading… ", -1))
        ])) : s.value === "error" ? (n(), r("div", j, [
          e[2] || (e[2] = a("p", { role: "alert" }, "Could not load workspace navigation.", -1)),
          a("button", {
            type: "button",
            class: "kx-retry",
            onClick: p
          }, "Retry")
        ])) : d.value.length ? (n(), r("div", I, [
          (n(!0), r(m, null, b(d.value, (o) => (n(), r("button", {
            key: o.id,
            class: "kx-card",
            type: "button",
            "aria-label": `Open ${o.label}`,
            onClick: (H) => v(o)
          }, [
            a("span", R, [
              i(l(c), {
                icon: o.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ]),
            a("span", S, x(o.label), 1),
            a("span", T, [
              i(l(c), {
                icon: "tabler:arrow-right",
                "aria-hidden": "true"
              })
            ])
          ], 8, L))), 128))
        ])) : (n(), r("div", B, [
          i(l(c), {
            icon: "tabler:layout-dashboard",
            class: "kx-empty-ico",
            "aria-hidden": "true"
          }),
          e[3] || (e[3] = a("div", { class: "kx-empty-title" }, "No features available to this account", -1))
        ]))
      ])
    ]));
  }
}), M = {
  rootComponent: D
};
export {
  M as mountConfig
};
//# sourceMappingURL=lazy-mount-C0JpypBe.js.map
