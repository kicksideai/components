import { _ as D, p as E, a as z, e as M, u as R, b as j, r as I, W as K, s as W, P as q } from "./styles-WQmxKEFi.js";
import { defineComponent as U, ref as n, watch as G, onMounted as H, onBeforeUnmount as J, openBlock as u, createElementBlock as k, renderSlot as O, nextTick as Q, createBlock as w, withCtx as y, createElementVNode as r, withModifiers as X, createVNode as v, unref as d, createCommentVNode as h, createTextVNode as $, computed as Y, onUnmounted as Z, Fragment as ee, renderList as ae, normalizeClass as te, toDisplayString as le } from "vue";
import { on as se, host as oe, define as ie } from "@wippy-fe/proxy";
import V from "primevue/button";
import P from "primevue/inputtext";
import ne from "primevue/tag";
import { Icon as N } from "@iconify/vue";
const re = ["aria-label", "aria-busy"], ue = /* @__PURE__ */ U({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    label: {},
    busy: { type: Boolean }
  },
  emits: ["close"],
  setup(g, { emit: C }) {
    const i = g, m = C, l = n(null);
    let t = null;
    async function p() {
      await Q();
      const e = l.value;
      e && (i.visible && !e.open ? (t = e.getRootNode().activeElement, e.showModal()) : !i.visible && e.open && (e.close(), t?.focus()));
    }
    function f(e) {
      e.preventDefault(), i.busy || m("close");
    }
    return G(() => i.visible, p), H(p), J(() => {
      l.value?.open && l.value.close(), t?.focus();
    }), (e, c) => (u(), k("dialog", {
      ref_key: "dialog",
      ref: l,
      class: "native-dialog",
      "aria-label": g.label,
      "aria-modal": "true",
      "aria-busy": g.busy || void 0,
      onCancel: f,
      onClose: c[0] || (c[0] = () => {
        g.visible && !g.busy && m("close");
      })
    }, [
      O(e.$slots, "default")
    ], 40, re));
  }
}), de = { class: "pim-stack" }, ce = { class: "dialog-actions" }, ve = /* @__PURE__ */ U({
  __name: "CreateCatalog",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(g, { emit: C }) {
    const i = C, m = n(""), l = n(), t = n(!1);
    async function p() {
      const f = m.value.trim();
      if (!(!f || t.value)) {
        t.value = !0, l.value = void 0;
        try {
          const e = await E.createCatalog(f);
          m.value = "", i("close"), i("created", e.catalog_id);
        } catch (e) {
          l.value = z(e, "Could not create the catalog.");
        } finally {
          t.value = !1;
        }
      }
    }
    return (f, e) => (u(), w(ue, {
      visible: g.visible,
      label: "New catalog",
      busy: t.value,
      onClose: e[2] || (e[2] = (c) => i("close"))
    }, {
      default: y(() => [
        r("form", {
          class: "dialog-box",
          onSubmit: X(p, ["prevent"])
        }, [
          e[6] || (e[6] = r("h2", null, "New catalog", -1)),
          r("label", de, [
            e[3] || (e[3] = r("span", { class: "small muted" }, "Title", -1)),
            v(d(P), {
              modelValue: m.value,
              "onUpdate:modelValue": e[0] || (e[0] = (c) => m.value = c),
              autofocus: "",
              placeholder: "Catalog title"
            }, null, 8, ["modelValue"])
          ]),
          l.value ? (u(), w(D, {
            key: 0,
            error: l.value
          }, null, 8, ["error"])) : h("", !0),
          r("div", ce, [
            v(d(V), {
              severity: "secondary",
              outlined: "",
              disabled: t.value,
              onClick: e[1] || (e[1] = (c) => i("close"))
            }, {
              default: y(() => [
                v(d(N), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                }),
                e[4] || (e[4] = $(" Cancel", -1))
              ]),
              _: 1
            }, 8, ["disabled"]),
            v(d(V), {
              type: "submit",
              disabled: t.value || !m.value.trim(),
              loading: t.value
            }, {
              default: y(() => [...e[5] || (e[5] = [
                $("Create", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "loading"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
}), me = { class: "pim-system" }, ge = {
  class: "pim-rail",
  "aria-label": "Catalogs"
}, pe = { class: "pim-railhead" }, fe = { class: "pim-rail-list" }, ye = { class: "pim-system-main" }, be = ["catalog-id"], Ce = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, ke = {
  key: 3,
  class: "kx-empty"
}, we = /* @__PURE__ */ U({
  __name: "AdminApp",
  setup(g) {
    const C = n(!1), i = n(!1);
    M("kickside-pim-catalog-settings").then((o) => {
      C.value = o;
    });
    async function m(o) {
      await _(), await f(o);
    }
    const l = n(), t = n(""), p = n(!1);
    async function f(o) {
      o !== t.value && (p.value && !await oe.confirm({ header: "Discard unsaved changes?", message: "Switching catalogs will discard unsaved schema and plugin changes.", acceptLabel: "Discard and switch", rejectLabel: "Cancel" }) || (p.value = !1, t.value = o));
    }
    function e(o) {
      p.value = o.detail.dirty;
    }
    const c = n(""), L = n(!0), b = n(), B = n(), x = I(), A = Y(() => (l.value ?? []).filter((o) => o.title.toLocaleLowerCase().includes(c.value.toLocaleLowerCase())));
    async function _(o) {
      const a = x.begin();
      L.value = !0, b.value = void 0;
      try {
        const s = await E.listCatalogs(o);
        if (!x.current(a)) return;
        const S = s.catalogs.filter((T) => T.access.admin);
        l.value = o == null ? S : [...l.value ?? [], ...S], B.value = s.after, B.value == null && t.value && !l.value.some((T) => T.catalog_id === t.value) && (t.value = "");
      } catch (s) {
        x.current(a) && (b.value = { error: z(s, "Could not load catalogs."), after: o });
      } finally {
        x.current(a) && (L.value = !1);
      }
    }
    const F = se("component.meta.changed", () => {
      _();
    });
    return R(_), Z(() => {
      F(), x.begin();
    }), (o, a) => (u(), k("div", me, [
      r("aside", ge, [
        r("div", pe, [
          r("h2", null, [
            a[5] || (a[5] = $("Catalogs ", -1)),
            l.value ? (u(), w(d(ne), {
              key: 0,
              severity: "secondary",
              value: String(l.value.length)
            }, null, 8, ["value"])) : h("", !0)
          ]),
          v(d(V), {
            text: "",
            size: "small",
            "aria-label": "Create catalog",
            onClick: a[0] || (a[0] = (s) => i.value = !0)
          }, {
            default: y(() => [
              v(d(N), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ]),
        v(d(P), {
          modelValue: c.value,
          "onUpdate:modelValue": a[1] || (a[1] = (s) => c.value = s),
          class: "pim-rail-search",
          type: "search",
          "aria-label": "Find a catalog",
          placeholder: "Find a catalog…"
        }, null, 8, ["modelValue"]),
        r("div", fe, [
          (u(!0), k(ee, null, ae(A.value, (s) => (u(), w(j, {
            key: s.catalog_id,
            class: te(["pim-rail-row", { active: t.value === s.catalog_id }]),
            "aria-pressed": t.value === s.catalog_id,
            onClick: (S) => f(s.catalog_id)
          }, {
            default: y(() => [
              r("span", null, le(s.title || "Untitled catalog"), 1)
            ]),
            _: 2
          }, 1032, ["class", "aria-pressed", "onClick"]))), 128))
        ]),
        B.value != null ? (u(), w(d(V), {
          key: 0,
          type: "button",
          disabled: L.value || !!b.value,
          onClick: a[2] || (a[2] = (s) => _(B.value)),
          severity: "secondary",
          outlined: "",
          size: "small"
        }, {
          default: y(() => [
            v(d(N), {
              icon: "tabler:chevron-right",
              "aria-hidden": "true"
            }),
            a[6] || (a[6] = $(" Load more catalogs", -1))
          ]),
          _: 1
        }, 8, ["disabled"])) : h("", !0)
      ]),
      r("main", ye, [
        b.value ? (u(), w(D, {
          key: 0,
          error: b.value.error,
          class: "pim-list-error"
        }, {
          default: y(() => [
            v(d(V), {
              type: "button",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: a[3] || (a[3] = (s) => _(b.value.after))
            }, {
              default: y(() => [...a[7] || (a[7] = [
                $("Retry", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["error"])) : h("", !0),
        t.value && C.value ? (u(), k("kickside-pim-catalog-settings", {
          key: t.value,
          "catalog-id": t.value,
          embedded: "true",
          onDirtyChanged: e
        }, null, 40, be)) : L.value ? (u(), k("div", Ce, "Loading catalogs…")) : !b.value && l.value ? (u(), k("div", ke, [
          v(d(N), {
            icon: "tabler:settings",
            class: "kx-empty-ico"
          }),
          a[8] || (a[8] = r("h3", { class: "kx-empty-title" }, "Catalog settings", -1)),
          a[9] || (a[9] = r("p", { class: "kx-empty-sub" }, "Select a catalog to edit its schema, plugins and policy.", -1))
        ])) : h("", !0)
      ]),
      v(ve, {
        visible: i.value,
        onClose: a[4] || (a[4] = (s) => i.value = !1),
        onCreated: m
      }, null, 8, ["visible"])
    ]));
  }
}), xe = { type: "object", properties: {} };
class _e extends K {
  static get wippyConfig() {
    return { propsSchema: xe, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"], inlineCss: W };
  }
  static get vueConfig() {
    return { rootComponent: we, plugins: [q] };
  }
}
ie(import.meta.url, _e);
