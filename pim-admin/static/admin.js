import { p as z, e as q, u as I, _ as K, A as R, r as W, W as G, s as H, P as J } from "./styles-kqEvMHkO.js";
import { defineComponent as A, ref as u, watch as O, onMounted as Q, onBeforeUnmount as X, openBlock as s, createElementBlock as f, renderSlot as Y, nextTick as Z, createBlock as L, withCtx as y, createElementVNode as d, withModifiers as ee, createVNode as m, unref as n, createTextVNode as h, toDisplayString as $, createCommentVNode as E, computed as P, watchEffect as ae, onUnmounted as te, Fragment as le, renderList as se, normalizeClass as oe } from "vue";
import { on as ie, host as ne, define as re } from "@wippy-fe/proxy";
import T from "primevue/button";
import F from "primevue/inputtext";
import ue from "primevue/tag";
import D from "primevue/message";
import { Icon as S } from "@iconify/vue";
const de = ["aria-label", "aria-busy"], ce = /* @__PURE__ */ A({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    label: {},
    busy: { type: Boolean }
  },
  emits: ["close"],
  setup(p, { emit: w }) {
    const r = p, g = w, o = u(null);
    let a = null;
    async function b() {
      await Z();
      const e = o.value;
      e && (r.visible && !e.open ? (a = e.getRootNode().activeElement, e.showModal()) : !r.visible && e.open && (e.close(), a?.focus()));
    }
    function C(e) {
      e.preventDefault(), r.busy || g("close");
    }
    return O(() => r.visible, b), Q(b), X(() => {
      o.value?.open && o.value.close(), a?.focus();
    }), (e, v) => (s(), f("dialog", {
      ref_key: "dialog",
      ref: o,
      class: "native-dialog",
      "aria-label": p.label,
      "aria-modal": "true",
      "aria-busy": p.busy || void 0,
      onCancel: C,
      onClose: v[0] || (v[0] = () => {
        p.visible && !p.busy && g("close");
      })
    }, [
      Y(e.$slots, "default")
    ], 40, de));
  }
}), ve = { class: "pim-stack" }, me = { class: "dialog-actions" }, ge = /* @__PURE__ */ A({
  __name: "CreateCatalog",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(p, { emit: w }) {
    const r = w, g = u(""), o = u(""), a = u(!1);
    async function b() {
      const C = g.value.trim();
      if (!(!C || a.value)) {
        a.value = !0, o.value = "";
        try {
          const e = await z.createCatalog(C);
          g.value = "", r("close"), r("created", e.catalog_id);
        } catch (e) {
          o.value = e instanceof Error ? e.message : "Could not create the catalog.";
        } finally {
          a.value = !1;
        }
      }
    }
    return (C, e) => (s(), L(ce, {
      visible: p.visible,
      label: "New catalog",
      busy: a.value,
      onClose: e[2] || (e[2] = (v) => r("close"))
    }, {
      default: y(() => [
        d("form", {
          class: "dialog-box",
          onSubmit: ee(b, ["prevent"])
        }, [
          e[6] || (e[6] = d("h2", null, "New catalog", -1)),
          d("label", ve, [
            e[3] || (e[3] = d("span", { class: "small muted" }, "Title", -1)),
            m(n(F), {
              modelValue: g.value,
              "onUpdate:modelValue": e[0] || (e[0] = (v) => g.value = v),
              autofocus: "",
              placeholder: "Catalog title"
            }, null, 8, ["modelValue"])
          ]),
          o.value ? (s(), L(n(D), {
            key: 0,
            severity: "error"
          }, {
            default: y(() => [
              h($(o.value), 1)
            ]),
            _: 1
          })) : E("", !0),
          d("div", me, [
            m(n(T), {
              severity: "secondary",
              outlined: "",
              disabled: a.value,
              onClick: e[1] || (e[1] = (v) => r("close"))
            }, {
              default: y(() => [
                m(n(S), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                }),
                e[4] || (e[4] = h(" Cancel", -1))
              ]),
              _: 1
            }, 8, ["disabled"]),
            m(n(T), {
              type: "submit",
              disabled: a.value || !g.value.trim(),
              loading: a.value
            }, {
              default: y(() => [...e[5] || (e[5] = [
                h("Create", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "loading"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
}), fe = { class: "pim-system" }, pe = {
  class: "pim-rail",
  "aria-label": "Catalogs"
}, ye = { class: "pim-railhead" }, be = { class: "pim-rail-list" }, Ce = { key: 0 }, ke = {
  key: 1,
  class: "small muted",
  role: "status"
}, _e = {
  key: 2,
  class: "small muted",
  role: "status"
}, he = { class: "pim-system-main" }, we = { key: 0 }, xe = ["catalog-id"], Ve = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, $e = {
  key: 3,
  class: "kx-empty"
}, Ee = /* @__PURE__ */ A({
  __name: "AdminApp",
  setup(p) {
    const w = u(!1), r = u(!1);
    q("kickside-pim-catalog-settings").then((i) => {
      w.value = i;
    });
    async function g(i) {
      await B(), await C(i);
    }
    const o = u([]), a = u(""), b = u(!1);
    async function C(i) {
      i !== a.value && (b.value && !await ne.confirm({ header: "Discard unsaved changes?", message: "Switching catalogs will discard unsaved schema and plugin changes.", acceptLabel: "Discard and switch", rejectLabel: "Cancel" }) || (b.value = !1, a.value = i));
    }
    function e(i) {
      b.value = i.detail.dirty;
    }
    const v = u(""), k = P(() => v.value.trim().toLocaleLowerCase()), x = u(!0), c = u(), _ = u(), N = W(), M = P(() => o.value.filter((i) => i.title.toLocaleLowerCase().includes(k.value)));
    async function B(i) {
      const t = N.begin();
      x.value = !0, c.value = void 0;
      try {
        const l = await z.listCatalogs(i);
        if (!N.current(t)) return;
        const V = l.catalogs.filter((U) => U.access.admin);
        o.value = i == null ? V : [...o.value, ...V], _.value = l.after, _.value == null && a.value && !o.value.some((U) => U.catalog_id === a.value) && (a.value = "");
      } catch (l) {
        if (!N.current(t)) return;
        const V = l instanceof R ? l.details?.code : void 0;
        c.value = { message: l instanceof Error ? l.message : "Could not load catalogs.", code: typeof V == "string" ? V : void 0 };
      } finally {
        N.current(t) && (x.value = !1);
      }
    }
    ae(() => {
      k.value && !x.value && !c.value && _.value != null && B(_.value);
    });
    const j = ie("component.meta.changed", () => {
      B();
    });
    return I(B), te(() => {
      j(), N.begin();
    }), (i, t) => (s(), f("div", fe, [
      d("aside", pe, [
        d("div", ye, [
          d("h2", null, [
            t[4] || (t[4] = h("Catalogs ", -1)),
            m(n(ue), {
              severity: "secondary",
              value: String(o.value.length)
            }, null, 8, ["value"])
          ]),
          m(n(T), {
            text: "",
            size: "small",
            "aria-label": "Create catalog",
            onClick: t[0] || (t[0] = (l) => r.value = !0)
          }, {
            default: y(() => [
              m(n(S), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ]),
        m(n(F), {
          modelValue: v.value,
          "onUpdate:modelValue": t[1] || (t[1] = (l) => v.value = l),
          class: "pim-rail-search",
          type: "search",
          "aria-label": "Find a catalog",
          placeholder: "Find a catalog…"
        }, null, 8, ["modelValue"]),
        d("div", be, [
          (s(!0), f(le, null, se(M.value, (l) => (s(), L(K, {
            key: l.catalog_id,
            class: oe(["pim-rail-row", { active: a.value === l.catalog_id }]),
            "aria-pressed": a.value === l.catalog_id,
            onClick: (V) => C(l.catalog_id)
          }, {
            default: y(() => [
              d("span", null, $(l.title || "Untitled catalog"), 1)
            ]),
            _: 2
          }, 1032, ["class", "aria-pressed", "onClick"]))), 128))
        ]),
        k.value && c.value ? (s(), L(n(D), {
          key: 0,
          class: "pim-rail-error",
          severity: "error",
          role: "alert"
        }, {
          default: y(() => [
            h($(c.value.message) + " ", 1),
            c.value.code ? (s(), f("code", Ce, $(c.value.code), 1)) : E("", !0)
          ]),
          _: 1
        })) : k.value && (x.value || _.value != null) ? (s(), f("div", ke, "Searching catalogs…")) : k.value && M.value.length === 0 ? (s(), f("div", _e, "No matching catalogs.")) : E("", !0),
        _.value != null && (!k.value || c.value) ? (s(), L(n(T), {
          key: 3,
          type: "button",
          disabled: x.value,
          onClick: t[2] || (t[2] = (l) => B(_.value)),
          severity: "secondary",
          outlined: "",
          size: "small"
        }, {
          default: y(() => [
            m(n(S), {
              icon: "tabler:chevron-right",
              "aria-hidden": "true"
            }),
            t[5] || (t[5] = h(" Load more catalogs", -1))
          ]),
          _: 1
        }, 8, ["disabled"])) : E("", !0)
      ]),
      d("main", he, [
        c.value && !k.value ? (s(), L(n(D), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: y(() => [
            h($(c.value.message) + " ", 1),
            c.value.code ? (s(), f("code", we, $(c.value.code), 1)) : E("", !0)
          ]),
          _: 1
        })) : E("", !0),
        a.value && w.value ? (s(), f("kickside-pim-catalog-settings", {
          key: a.value,
          "catalog-id": a.value,
          embedded: "true",
          onDirtyChanged: e
        }, null, 40, xe)) : x.value ? (s(), f("div", Ve, "Loading catalogs…")) : (s(), f("div", $e, [
          m(n(S), {
            icon: "tabler:settings",
            class: "kx-empty-ico"
          }),
          t[6] || (t[6] = d("h3", { class: "kx-empty-title" }, "Catalog settings", -1)),
          t[7] || (t[7] = d("p", { class: "kx-empty-sub" }, "Select a catalog to edit its schema, plugins and policy.", -1))
        ]))
      ]),
      m(ge, {
        visible: r.value,
        onClose: t[3] || (t[3] = (l) => r.value = !1),
        onCreated: g
      }, null, 8, ["visible"])
    ]));
  }
}), Le = { type: "object", properties: {} };
class Ne extends G {
  static get wippyConfig() {
    return { propsSchema: Le, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"], inlineCss: H };
  }
  static get vueConfig() {
    return { rootComponent: Ee, plugins: [J] };
  }
}
re(import.meta.url, Ne);
