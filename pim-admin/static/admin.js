import { p as T, e as z, u as A, _ as D, r as F, W as I, s as K, P as R } from "./styles-vHZl2OOQ.js";
import { defineComponent as L, ref as u, watch as W, onMounted as j, onBeforeUnmount as q, openBlock as d, createElementBlock as C, renderSlot as G, nextTick as H, createBlock as x, withCtx as y, createElementVNode as i, withModifiers as J, createVNode as c, unref as n, createTextVNode as k, toDisplayString as N, createCommentVNode as E, computed as O, onUnmounted as Q, Fragment as X, renderList as Y, normalizeClass as Z } from "vue";
import { on as ee, define as te } from "@wippy-fe/proxy";
import $ from "primevue/button";
import U from "primevue/inputtext";
import ae from "primevue/tag";
import S from "primevue/message";
import { Icon as V } from "@iconify/vue";
const le = ["aria-label", "aria-busy"], se = /* @__PURE__ */ L({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    label: {},
    busy: { type: Boolean }
  },
  emits: ["close"],
  setup(p, { emit: b }) {
    const o = p, m = b, s = u(null);
    let t = null;
    async function f() {
      await H();
      const e = s.value;
      e && (o.visible && !e.open ? (t = e.getRootNode().activeElement, e.showModal()) : !o.visible && e.open && (e.close(), t?.focus()));
    }
    function v(e) {
      e.preventDefault(), o.busy || m("close");
    }
    return W(() => o.visible, f), j(f), q(() => {
      s.value?.open && s.value.close(), t?.focus();
    }), (e, r) => (d(), C("dialog", {
      ref_key: "dialog",
      ref: s,
      class: "native-dialog",
      "aria-label": p.label,
      "aria-modal": "true",
      "aria-busy": p.busy || void 0,
      onCancel: v,
      onClose: r[0] || (r[0] = () => {
        p.visible && !p.busy && m("close");
      })
    }, [
      G(e.$slots, "default")
    ], 40, le));
  }
}), oe = { class: "pim-stack" }, ie = { class: "dialog-actions" }, ne = /* @__PURE__ */ L({
  __name: "CreateCatalog",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(p, { emit: b }) {
    const o = b, m = u(""), s = u(""), t = u(!1);
    async function f() {
      const v = m.value.trim();
      if (!(!v || t.value)) {
        t.value = !0, s.value = "";
        try {
          const e = await T.createCatalog(v);
          m.value = "", o("close"), o("created", e.catalog_id);
        } catch (e) {
          s.value = e instanceof Error ? e.message : "Could not create the catalog.";
        } finally {
          t.value = !1;
        }
      }
    }
    return (v, e) => (d(), x(se, {
      visible: p.visible,
      label: "New catalog",
      busy: t.value,
      onClose: e[2] || (e[2] = (r) => o("close"))
    }, {
      default: y(() => [
        i("form", {
          class: "dialog-box",
          onSubmit: J(f, ["prevent"])
        }, [
          e[6] || (e[6] = i("h2", null, "New catalog", -1)),
          i("label", oe, [
            e[3] || (e[3] = i("span", { class: "small muted" }, "Title", -1)),
            c(n(U), {
              modelValue: m.value,
              "onUpdate:modelValue": e[0] || (e[0] = (r) => m.value = r),
              autofocus: "",
              placeholder: "Catalog title"
            }, null, 8, ["modelValue"])
          ]),
          s.value ? (d(), x(n(S), {
            key: 0,
            severity: "error"
          }, {
            default: y(() => [
              k(N(s.value), 1)
            ]),
            _: 1
          })) : E("", !0),
          i("div", ie, [
            c(n($), {
              severity: "secondary",
              outlined: "",
              disabled: t.value,
              onClick: e[1] || (e[1] = (r) => o("close"))
            }, {
              default: y(() => [
                c(n(V), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                }),
                e[4] || (e[4] = k(" Cancel", -1))
              ]),
              _: 1
            }, 8, ["disabled"]),
            c(n($), {
              type: "submit",
              disabled: t.value || !m.value.trim(),
              loading: t.value
            }, {
              default: y(() => [...e[5] || (e[5] = [
                k("Create", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "loading"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
}), re = { class: "pim-system" }, ue = {
  class: "pim-rail",
  "aria-label": "Catalogs"
}, de = { class: "pim-railhead" }, ce = { class: "pim-rail-list" }, me = { class: "pim-system-main" }, ve = ["catalog-id"], pe = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, ge = {
  key: 3,
  class: "kx-empty"
}, fe = /* @__PURE__ */ L({
  __name: "AdminApp",
  setup(p) {
    const b = u(!1), o = u(!1);
    z("kickside-pim-catalog-settings").then((g) => {
      b.value = g;
    });
    async function m(g) {
      await w(), t.value = g;
    }
    const s = u([]), t = u(""), f = u(""), v = u(!0), e = u(""), r = u(), _ = F(), M = O(() => s.value.filter((g) => g.title.toLocaleLowerCase().includes(f.value.toLocaleLowerCase())));
    async function w(g) {
      const a = _.begin();
      v.value = !0, e.value = "";
      try {
        const l = await T.listCatalogs(g);
        if (!_.current(a)) return;
        const h = l.catalogs.filter((B) => B.access.admin);
        s.value = g == null ? h : [...s.value, ...h], r.value = l.after, r.value == null && t.value && !s.value.some((B) => B.catalog_id === t.value) && (t.value = "");
      } catch (l) {
        _.current(a) && (e.value = l instanceof Error ? l.message : "Could not load catalogs.");
      } finally {
        _.current(a) && (v.value = !1);
      }
    }
    const P = ee("component.meta.changed", () => {
      w();
    });
    return A(w), Q(() => {
      P(), _.begin();
    }), (g, a) => (d(), C("div", re, [
      i("aside", ue, [
        i("div", de, [
          i("h2", null, [
            a[4] || (a[4] = k("Catalogs ", -1)),
            c(n(ae), {
              severity: "secondary",
              value: String(s.value.length)
            }, null, 8, ["value"])
          ]),
          c(n($), {
            text: "",
            size: "small",
            "aria-label": "Create catalog",
            onClick: a[0] || (a[0] = (l) => o.value = !0)
          }, {
            default: y(() => [
              c(n(V), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ]),
        c(n(U), {
          modelValue: f.value,
          "onUpdate:modelValue": a[1] || (a[1] = (l) => f.value = l),
          class: "pim-rail-search",
          type: "search",
          "aria-label": "Find a catalog",
          placeholder: "Find a catalog…"
        }, null, 8, ["modelValue"]),
        i("div", ce, [
          (d(!0), C(X, null, Y(M.value, (l) => (d(), x(D, {
            key: l.catalog_id,
            class: Z(["pim-rail-row", { active: t.value === l.catalog_id }]),
            "aria-pressed": t.value === l.catalog_id,
            onClick: (h) => t.value = l.catalog_id
          }, {
            default: y(() => [
              i("span", null, N(l.title || "Untitled catalog"), 1)
            ]),
            _: 2
          }, 1032, ["class", "aria-pressed", "onClick"]))), 128))
        ]),
        r.value != null ? (d(), x(n($), {
          key: 0,
          type: "button",
          disabled: v.value,
          onClick: a[2] || (a[2] = (l) => w(r.value)),
          severity: "secondary",
          outlined: "",
          size: "small"
        }, {
          default: y(() => [
            c(n(V), {
              icon: "tabler:chevron-right",
              "aria-hidden": "true"
            }),
            a[5] || (a[5] = k(" Load more catalogs", -1))
          ]),
          _: 1
        }, 8, ["disabled"])) : E("", !0)
      ]),
      i("main", me, [
        e.value ? (d(), x(n(S), {
          key: 0,
          severity: "error"
        }, {
          default: y(() => [
            k(N(e.value), 1)
          ]),
          _: 1
        })) : E("", !0),
        t.value && b.value ? (d(), C("kickside-pim-catalog-settings", {
          key: t.value,
          "catalog-id": t.value,
          embedded: "true"
        }, null, 8, ve)) : v.value ? (d(), C("div", pe, "Loading catalogs…")) : (d(), C("div", ge, [
          c(n(V), {
            icon: "tabler:settings",
            class: "kx-empty-ico"
          }),
          a[6] || (a[6] = i("h3", { class: "kx-empty-title" }, "Catalog settings", -1)),
          a[7] || (a[7] = i("p", { class: "kx-empty-sub" }, "Select a catalog to edit its schema, plugins and policy.", -1))
        ]))
      ]),
      c(ne, {
        visible: o.value,
        onClose: a[3] || (a[3] = (l) => o.value = !1),
        onCreated: m
      }, null, 8, ["visible"])
    ]));
  }
}), ye = { type: "object", properties: {} };
class be extends I {
  static get wippyConfig() {
    return { propsSchema: ye, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"], inlineCss: K };
  }
  static get vueConfig() {
    return { rootComponent: fe, plugins: [R] };
  }
}
te(import.meta.url, be);
