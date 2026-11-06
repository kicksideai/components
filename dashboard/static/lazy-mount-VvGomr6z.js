import { defineComponent as x, ref as _, openBlock as o, createElementBlock as s, createElementVNode as a, createVNode as l, unref as c, toDisplayString as d, createCommentVNode as h, createTextVNode as f, Fragment as y, renderList as g, normalizeClass as b } from "vue";
import { Icon as u } from "@iconify/vue";
import { api as C } from "@wippy-fe/proxy";
import { u as w, a as E } from "./wc-runtime-BMe_f3Uc.js";
const N = () => w(), V = { class: "kx" }, $ = { class: "kx-hero" }, B = { class: "kx-hero-inner" }, I = { class: "kx-hero-mark" }, L = {
  key: 0,
  class: "kx-hero-chip"
}, O = {
  key: 0,
  class: "kx-err"
}, S = { class: "kx-body" }, z = {
  key: 0,
  class: "kx-loading"
}, D = {
  key: 1,
  class: "kx-empty"
}, F = {
  key: 2,
  class: "kx-grid"
}, H = ["disabled", "aria-label", "onClick"], K = { class: "kx-card-icon" }, R = { class: "kx-card-name" }, T = {
  key: 0,
  class: "kx-card-desc"
}, W = {
  key: 1,
  class: "kx-card-go"
}, j = /* @__PURE__ */ x({
  __name: "dashboard",
  setup(q) {
    const v = N(), n = _([]), m = _(!1), i = _("");
    async function k() {
      m.value = !0, i.value = "";
      try {
        const { data: e } = await C.get("/api/v1/dashboard/overview");
        n.value = e.success ? e.surfaces || [] : [], !e.success && e.error && (i.value = e.error);
      } catch (e) {
        n.value = [], i.value = e instanceof Error ? e.message : "failed to load overview";
      } finally {
        m.value = !1;
      }
    }
    function p(e) {
      e.route_name && v("navigate", { path: `/${e.route_name}`, route_name: e.route_name, component_tag: e.component_tag, id: e.id });
    }
    return E(k), (e, r) => (o(), s("div", V, [
      a("header", $, [
        a("div", B, [
          a("div", I, [
            l(c(u), {
              icon: "tabler:sparkles",
              "aria-hidden": "true"
            })
          ]),
          r[0] || (r[0] = a("div", { class: "kx-hero-text" }, [
            a("h1", { class: "kx-hero-title" }, "Welcome to KickSide"),
            a("p", { class: "kx-hero-sub" }, "Everything installed in this workspace, ready to use.")
          ], -1)),
          n.value.length ? (o(), s("span", L, d(n.value.length) + " surface" + d(n.value.length === 1 ? "" : "s"), 1)) : h("", !0)
        ])
      ]),
      i.value ? (o(), s("div", O, d(i.value), 1)) : h("", !0),
      a("div", S, [
        m.value && !n.value.length ? (o(), s("div", z, [
          l(c(u), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          r[1] || (r[1] = f(" Loading… ", -1))
        ])) : n.value.length ? (o(), s("div", F, [
          (o(!0), s(y, null, g(n.value, (t) => (o(), s("button", {
            key: t.id,
            class: b(["kx-card", { "kx-card-static": !t.route_name }]),
            disabled: !t.route_name,
            "aria-label": t.route_name ? `Open ${t.label}` : t.label,
            onClick: (A) => p(t)
          }, [
            a("span", K, [
              l(c(u), {
                icon: t.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ]),
            a("span", R, d(t.label), 1),
            t.description ? (o(), s("span", T, d(t.description), 1)) : h("", !0),
            t.route_name ? (o(), s("span", W, [
              l(c(u), {
                icon: "tabler:arrow-right",
                "aria-hidden": "true"
              })
            ])) : h("", !0)
          ], 10, H))), 128))
        ])) : (o(), s("div", D, [
          l(c(u), {
            icon: "tabler:layout-dashboard",
            class: "kx-empty-ico",
            "aria-hidden": "true"
          }),
          r[2] || (r[2] = a("div", { class: "kx-empty-title" }, "Nothing installed yet", -1)),
          r[3] || (r[3] = a("div", { class: "kx-empty-sub" }, "Install a feature module that declares a surface and it appears here.", -1))
        ]))
      ])
    ]));
  }
}), Q = {
  rootComponent: j
};
export {
  Q as mountConfig
};
//# sourceMappingURL=lazy-mount-VvGomr6z.js.map
