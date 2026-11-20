import { p as D, e as F, u as j, _ as I, r as K, W as R, s as W, P as q } from "./styles-CBm7GC_K.js";
import { defineComponent as U, ref as n, watch as G, onMounted as H, onBeforeUnmount as J, openBlock as c, createElementBlock as C, renderSlot as O, nextTick as Q, createBlock as w, withCtx as y, createElementVNode as r, withModifiers as X, createVNode as m, unref as u, createTextVNode as k, toDisplayString as S, createCommentVNode as T, computed as Y, onUnmounted as Z, Fragment as ee, renderList as ae, normalizeClass as te } from "vue";
import { on as le, host as se, define as oe } from "@wippy-fe/proxy";
import B from "primevue/button";
import M from "primevue/inputtext";
import ie from "primevue/tag";
import P from "primevue/message";
import { Icon as L } from "@iconify/vue";
const ne = ["aria-label", "aria-busy"], re = /* @__PURE__ */ U({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    label: {},
    busy: { type: Boolean }
  },
  emits: ["close"],
  setup(g, { emit: b }) {
    const i = g, v = b, s = n(null);
    let a = null;
    async function p() {
      await Q();
      const e = s.value;
      e && (i.visible && !e.open ? (a = e.getRootNode().activeElement, e.showModal()) : !i.visible && e.open && (e.close(), a?.focus()));
    }
    function f(e) {
      e.preventDefault(), i.busy || v("close");
    }
    return G(() => i.visible, p), H(p), J(() => {
      s.value?.open && s.value.close(), a?.focus();
    }), (e, d) => (c(), C("dialog", {
      ref_key: "dialog",
      ref: s,
      class: "native-dialog",
      "aria-label": g.label,
      "aria-modal": "true",
      "aria-busy": g.busy || void 0,
      onCancel: f,
      onClose: d[0] || (d[0] = () => {
        g.visible && !g.busy && v("close");
      })
    }, [
      O(e.$slots, "default")
    ], 40, ne));
  }
}), ue = { class: "pim-stack" }, de = { class: "dialog-actions" }, ce = /* @__PURE__ */ U({
  __name: "CreateCatalog",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(g, { emit: b }) {
    const i = b, v = n(""), s = n(""), a = n(!1);
    async function p() {
      const f = v.value.trim();
      if (!(!f || a.value)) {
        a.value = !0, s.value = "";
        try {
          const e = await D.createCatalog(f);
          v.value = "", i("close"), i("created", e.catalog_id);
        } catch (e) {
          s.value = e instanceof Error ? e.message : "Could not create the catalog.";
        } finally {
          a.value = !1;
        }
      }
    }
    return (f, e) => (c(), w(re, {
      visible: g.visible,
      label: "New catalog",
      busy: a.value,
      onClose: e[2] || (e[2] = (d) => i("close"))
    }, {
      default: y(() => [
        r("form", {
          class: "dialog-box",
          onSubmit: X(p, ["prevent"])
        }, [
          e[6] || (e[6] = r("h2", null, "New catalog", -1)),
          r("label", ue, [
            e[3] || (e[3] = r("span", { class: "small muted" }, "Title", -1)),
            m(u(M), {
              modelValue: v.value,
              "onUpdate:modelValue": e[0] || (e[0] = (d) => v.value = d),
              autofocus: "",
              placeholder: "Catalog title"
            }, null, 8, ["modelValue"])
          ]),
          s.value ? (c(), w(u(P), {
            key: 0,
            severity: "error"
          }, {
            default: y(() => [
              k(S(s.value), 1)
            ]),
            _: 1
          })) : T("", !0),
          r("div", de, [
            m(u(B), {
              severity: "secondary",
              outlined: "",
              disabled: a.value,
              onClick: e[1] || (e[1] = (d) => i("close"))
            }, {
              default: y(() => [
                m(u(L), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                }),
                e[4] || (e[4] = k(" Cancel", -1))
              ]),
              _: 1
            }, 8, ["disabled"]),
            m(u(B), {
              type: "submit",
              disabled: a.value || !v.value.trim(),
              loading: a.value
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
}), me = { class: "pim-system" }, ve = {
  class: "pim-rail",
  "aria-label": "Catalogs"
}, ge = { class: "pim-railhead" }, pe = { class: "pim-rail-list" }, fe = { class: "pim-system-main" }, ye = ["catalog-id"], be = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, Ce = {
  key: 3,
  class: "kx-empty"
}, ke = /* @__PURE__ */ U({
  __name: "AdminApp",
  setup(g) {
    const b = n(!1), i = n(!1);
    F("kickside-pim-catalog-settings").then((o) => {
      b.value = o;
    });
    async function v(o) {
      await $(), await f(o);
    }
    const s = n([]), a = n(""), p = n(!1);
    async function f(o) {
      o !== a.value && (p.value && !await se.confirm({ header: "Discard unsaved changes?", message: "Switching catalogs will discard unsaved schema and plugin changes.", acceptLabel: "Discard and switch", rejectLabel: "Cancel" }) || (p.value = !1, a.value = o));
    }
    function e(o) {
      p.value = o.detail.dirty;
    }
    const d = n(""), _ = n(!0), x = n(""), V = n(), h = K(), z = Y(() => s.value.filter((o) => o.title.toLocaleLowerCase().includes(d.value.toLocaleLowerCase())));
    async function $(o) {
      const t = h.begin();
      _.value = !0, x.value = "";
      try {
        const l = await D.listCatalogs(o);
        if (!h.current(t)) return;
        const N = l.catalogs.filter((E) => E.access.admin);
        s.value = o == null ? N : [...s.value, ...N], V.value = l.after, V.value == null && a.value && !s.value.some((E) => E.catalog_id === a.value) && (a.value = "");
      } catch (l) {
        h.current(t) && (x.value = l instanceof Error ? l.message : "Could not load catalogs.");
      } finally {
        h.current(t) && (_.value = !1);
      }
    }
    const A = le("component.meta.changed", () => {
      $();
    });
    return j($), Z(() => {
      A(), h.begin();
    }), (o, t) => (c(), C("div", me, [
      r("aside", ve, [
        r("div", ge, [
          r("h2", null, [
            t[4] || (t[4] = k("Catalogs ", -1)),
            m(u(ie), {
              severity: "secondary",
              value: String(s.value.length)
            }, null, 8, ["value"])
          ]),
          m(u(B), {
            text: "",
            size: "small",
            "aria-label": "Create catalog",
            onClick: t[0] || (t[0] = (l) => i.value = !0)
          }, {
            default: y(() => [
              m(u(L), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ]),
        m(u(M), {
          modelValue: d.value,
          "onUpdate:modelValue": t[1] || (t[1] = (l) => d.value = l),
          class: "pim-rail-search",
          type: "search",
          "aria-label": "Find a catalog",
          placeholder: "Find a catalog…"
        }, null, 8, ["modelValue"]),
        r("div", pe, [
          (c(!0), C(ee, null, ae(z.value, (l) => (c(), w(I, {
            key: l.catalog_id,
            class: te(["pim-rail-row", { active: a.value === l.catalog_id }]),
            "aria-pressed": a.value === l.catalog_id,
            onClick: (N) => f(l.catalog_id)
          }, {
            default: y(() => [
              r("span", null, S(l.title || "Untitled catalog"), 1)
            ]),
            _: 2
          }, 1032, ["class", "aria-pressed", "onClick"]))), 128))
        ]),
        V.value != null ? (c(), w(u(B), {
          key: 0,
          type: "button",
          disabled: _.value,
          onClick: t[2] || (t[2] = (l) => $(V.value)),
          severity: "secondary",
          outlined: "",
          size: "small"
        }, {
          default: y(() => [
            m(u(L), {
              icon: "tabler:chevron-right",
              "aria-hidden": "true"
            }),
            t[5] || (t[5] = k(" Load more catalogs", -1))
          ]),
          _: 1
        }, 8, ["disabled"])) : T("", !0)
      ]),
      r("main", fe, [
        x.value ? (c(), w(u(P), {
          key: 0,
          severity: "error"
        }, {
          default: y(() => [
            k(S(x.value), 1)
          ]),
          _: 1
        })) : T("", !0),
        a.value && b.value ? (c(), C("kickside-pim-catalog-settings", {
          key: a.value,
          "catalog-id": a.value,
          embedded: "true",
          onDirtyChanged: e
        }, null, 40, ye)) : _.value ? (c(), C("div", be, "Loading catalogs…")) : (c(), C("div", Ce, [
          m(u(L), {
            icon: "tabler:settings",
            class: "kx-empty-ico"
          }),
          t[6] || (t[6] = r("h3", { class: "kx-empty-title" }, "Catalog settings", -1)),
          t[7] || (t[7] = r("p", { class: "kx-empty-sub" }, "Select a catalog to edit its schema, plugins and policy.", -1))
        ]))
      ]),
      m(ce, {
        visible: i.value,
        onClose: t[3] || (t[3] = (l) => i.value = !1),
        onCreated: v
      }, null, 8, ["visible"])
    ]));
  }
}), he = { type: "object", properties: {} };
class we extends R {
  static get wippyConfig() {
    return { propsSchema: he, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"], inlineCss: W };
  }
  static get vueConfig() {
    return { rootComponent: ke, plugins: [q] };
  }
}
oe(import.meta.url, we);
