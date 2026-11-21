import { _ as se, a as X, p as Y, b as Z, u as re, c as ue, d as ce, e as de, r as ve, W as me, s as fe, P as pe } from "./styles-CkqhKFcY.js";
import { defineComponent as ee, ref as i, openBlock as u, createBlock as j, withCtx as b, createElementVNode as m, withModifiers as ge, createVNode as c, unref as r, createCommentVNode as C, createTextVNode as z, useId as ye, computed as be, watch as ke, onUnmounted as Ce, createElementBlock as y, normalizeClass as _e, toDisplayString as E, Fragment as he, renderList as xe, nextTick as J } from "vue";
import { on as we, host as Q, define as Se } from "@wippy-fe/proxy";
import w from "primevue/button";
import Te from "primevue/iconfield";
import $e from "primevue/inputicon";
import te from "primevue/inputtext";
import { Icon as P } from "@iconify/vue";
function I(d) {
  return !!d && typeof d == "object" && !Array.isArray(d);
}
function Ve(d, f) {
  return d;
}
function Ae(d, f, p) {
  const n = I(d) ? d : {}, g = [
    n,
    I(n.data) ? n.data : null,
    I(n.payload) ? n.payload : null,
    I(n.detail) ? n.detail : null
  ].filter(Boolean);
  for (const t of g) {
    if (t.event !== "component.meta.changed" && t.event !== "component.deleting" && t.event !== "component.deleted") continue;
    const _ = String(t.component_id || ""), s = String(n.topic || t.topic || "");
    if (!_ && (!s.startsWith("component.") || s === "component.")) continue;
    const e = _ || f || s.slice(10);
    return t.event === "component.deleting" && typeof t.deletion_job_id == "string" && t.deletion_job_id ? { event: t.event, component_id: e, deletion_job_id: t.deletion_job_id } : t.event !== "component.meta.changed" ? { event: t.event, component_id: e } : {
      event: "component.meta.changed",
      component_id: e,
      meta: Ve(I(t.meta) ? t.meta : {}),
      deleted: Array.isArray(t.deleted) ? t.deleted.map(String) : []
    };
  }
  return null;
}
function je(d, f, p) {
  const n = Ae(d, f);
  return n?.event === "component.meta.changed" ? n : null;
}
const Be = { class: "pim-stack" }, Le = { class: "dialog-actions" }, qe = /* @__PURE__ */ ee({
  __name: "CreateCatalog",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(d, { emit: f }) {
    const p = f, n = i(""), g = i(), t = i(!1);
    async function _() {
      const s = n.value.trim();
      if (!(!s || t.value)) {
        t.value = !0, g.value = void 0;
        try {
          const e = await Y.createCatalog(s);
          n.value = "", p("close"), p("created", e.catalog_id);
        } catch (e) {
          g.value = Z(e, "Could not create the catalog.");
        } finally {
          t.value = !1;
        }
      }
    }
    return (s, e) => (u(), j(se, {
      visible: d.visible,
      label: "Create catalog",
      busy: t.value,
      onClose: e[2] || (e[2] = (S) => p("close"))
    }, {
      default: b(() => [
        m("form", {
          class: "dialog-box",
          onSubmit: ge(_, ["prevent"])
        }, [
          e[6] || (e[6] = m("h2", null, "Create catalog", -1)),
          e[7] || (e[7] = m("p", { class: "muted" }, "After creating it, set up the product families and fields it needs.", -1)),
          m("label", Be, [
            e[3] || (e[3] = m("span", { class: "small muted" }, "Catalog name", -1)),
            c(r(te), {
              modelValue: n.value,
              "onUpdate:modelValue": e[0] || (e[0] = (S) => n.value = S),
              autofocus: "",
              placeholder: "For example, Outdoor equipment"
            }, null, 8, ["modelValue"])
          ]),
          g.value ? (u(), j(X, {
            key: 0,
            error: g.value
          }, null, 8, ["error"])) : C("", !0),
          m("div", Le, [
            c(r(w), {
              severity: "secondary",
              outlined: "",
              disabled: t.value,
              onClick: e[1] || (e[1] = (S) => p("close"))
            }, {
              default: b(() => [
                c(r(P), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                }),
                e[4] || (e[4] = z(" Cancel", -1))
              ]),
              _: 1
            }, 8, ["disabled"]),
            c(r(w), {
              type: "submit",
              disabled: t.value || !n.value.trim(),
              loading: t.value
            }, {
              default: b(() => [...e[5] || (e[5] = [
                z("Create catalog", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "loading"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
}), De = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Ee = ["aria-describedby", "aria-current", "onClick"], Ie = { class: "picker-name" }, Ne = ["id"], Pe = {
  key: 3,
  class: "picker-message",
  role: "status"
}, Ue = ["catalog-id", "focus-back", "directory-count"], Fe = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Me = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Re = {
  key: 3,
  class: "kx-empty"
}, ze = { class: "kx-empty-title" }, Ke = { class: "kx-empty-sub" }, Oe = /* @__PURE__ */ ee({
  __name: "AdminApp",
  setup(d) {
    const f = i(!1), p = i(!1), n = i(!1), g = i(!1), t = i(!1), _ = i(!1), s = i(""), e = i(""), S = i(), K = i(), U = i();
    let B = !0;
    async function O() {
      p.value = !0;
      try {
        f.value = await de("kickside-pim-catalog-settings");
      } finally {
        p.value = !1;
      }
    }
    O();
    async function ae(o) {
      n.value = !1, F(o), q.value && (T.value = "", await J()), await D();
    }
    function F(o, a = !0) {
      B = !1, _.value = a, a && S.value?.focus({ preventScroll: !0 }), e.value = s.value = o;
    }
    async function W() {
      if (g.value) return !1;
      if (!t.value) return !0;
      g.value = !0;
      try {
        return await Q.confirm({ header: "Discard unsaved changes?", message: "Leaving these settings will discard unsaved catalog and plugin changes.", acceptLabel: "Discard changes", rejectLabel: "Keep editing" });
      } finally {
        g.value = !1;
      }
    }
    async function M() {
      return await W() ? (t.value = !1, s.value = "", await J(), (K.value?.querySelector('[aria-current="true"]') ?? U.value?.querySelector("input"))?.focus(), !0) : !1;
    }
    function le() {
      B = !1, n.value = !0;
    }
    async function R(o) {
      if (o === "defaults") {
        await W() && Q.navigate("/system/settings");
        return;
      }
      (!s.value || await M()) && le();
    }
    const G = ye(), v = i(), L = i();
    function ne(o) {
      t.value = o.detail.dirty;
    }
    const T = i(""), q = be(() => T.value.trim()), h = i(!0), k = i(), $ = i(), V = ve();
    let N;
    async function D(o, a = q.value || void 0) {
      if (o != null && h.value) return;
      clearTimeout(N);
      const l = V.begin();
      h.value = !0, k.value = void 0;
      try {
        const x = await Y.listCatalogs(o, a);
        if (!V.current(l)) return;
        const H = x.catalogs.filter((A) => A.access.admin);
        if (v.value = o == null ? H : [...v.value ?? [], ...H], $.value = x.after, !a && $.value == null && (L.value = v.value.length, e.value && !v.value.some((A) => A.catalog_id === e.value) && (e.value = s.value = "", t.value = !1), B)) {
          B = !1;
          const A = v.value[0];
          v.value.length === 1 && A && F(A.catalog_id, !1);
        }
      } catch (x) {
        V.current(l) && (k.value = { error: Z(x, "Could not load catalogs."), after: o, text: a });
      } finally {
        V.current(l) && (h.value = !1);
      }
    }
    function oe() {
      const o = k.value;
      o && D(o.after, o.text);
    }
    ke(q, () => {
      B = !1, V.begin(), clearTimeout(N), v.value = void 0, $.value = void 0, h.value = !0, k.value = void 0, N = setTimeout(() => {
        D();
      }, 250);
    });
    const ie = we("component.meta.changed", (o) => {
      const a = je(o);
      if (!a) return;
      const l = v.value?.find((x) => x.catalog_id === a.component_id);
      l && (typeof a.meta.title == "string" && (l.title = a.meta.title.trim() || "Catalog"), a.deleted.includes("title") && (l.title = "Catalog"));
    });
    return re(D), Ce(() => {
      ie(), clearTimeout(N), V.begin();
    }), (o, a) => (u(), y("main", {
      class: _e(["kx-shell kx-settings-shell pim-system", { "pim-catalog-selected": s.value && f.value }])
    }, [
      !s.value || !f.value ? (u(), j(ue, {
        key: 0,
        settings: "",
        class: "pim-catalog-picker",
        title: "Catalogs",
        count: L.value ?? v.value?.length
      }, {
        actions: b(() => [
          c(ce, {
            "create-label": "Create catalog",
            onCreate: a[0] || (a[0] = (l) => R("create")),
            onDefaults: a[1] || (a[1] = (l) => R("defaults"))
          })
        ]),
        toolbar: b(() => [
          m("div", {
            ref_key: "searchField",
            ref: U,
            class: "picker-search"
          }, [
            c(r(Te), null, {
              default: b(() => [
                c(r($e), null, {
                  default: b(() => [
                    c(r(P), {
                      icon: "tabler:search",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }),
                c(r(te), {
                  type: "search",
                  modelValue: T.value,
                  "onUpdate:modelValue": a[2] || (a[2] = (l) => T.value = l),
                  class: "picker-search-input",
                  "aria-label": "Search catalogs",
                  placeholder: "Search catalogs…"
                }, null, 8, ["modelValue"]),
                T.value ? (u(), j(r(w), {
                  key: 0,
                  type: "button",
                  text: "",
                  severity: "secondary",
                  class: "picker-search-clear",
                  "aria-label": "Clear search",
                  onClick: a[3] || (a[3] = (l) => {
                    T.value = "", U.value?.querySelector("input")?.focus();
                  })
                }, {
                  icon: b(() => [
                    c(r(P), {
                      icon: "tabler:x",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                })) : C("", !0)
              ]),
              _: 1
            })
          ], 512)
        ]),
        default: b(() => [
          k.value ? (u(), j(X, {
            key: 0,
            error: k.value.error
          }, {
            default: b(() => [
              c(r(w), {
                label: "Retry",
                type: "button",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: oe
              })
            ]),
            _: 1
          }, 8, ["error"])) : h.value ? (u(), y("p", De, E(q.value ? "Searching catalogs…" : "Loading catalogs…"), 1)) : C("", !0),
          v.value?.length ? (u(), y("ul", {
            key: 2,
            ref_key: "list",
            ref: K,
            class: "picker-list"
          }, [
            (u(!0), y(he, null, xe(v.value, (l) => (u(), y("li", {
              key: l.catalog_id
            }, [
              m("button", {
                type: "button",
                class: "picker-row pim-catalog-row",
                "aria-describedby": r(G) + "-" + l.catalog_id,
                "aria-current": e.value === l.catalog_id ? "true" : void 0,
                onClick: (x) => F(l.catalog_id)
              }, [
                m("span", Ie, E(l.title || "Untitled catalog"), 1),
                m("span", {
                  id: r(G) + "-" + l.catalog_id,
                  class: "picker-row-description"
                }, E(typeof l.product_count == "number" ? l.product_count + (l.product_count === 1 ? " product" : " products") : "Product count unavailable"), 9, Ne)
              ], 8, Ee)
            ]))), 128))
          ], 512)) : C("", !0),
          !k.value && !h.value && q.value && !v.value?.length && $.value == null ? (u(), y("p", Pe, "No catalogs match. Try another name.")) : C("", !0),
          $.value != null ? (u(), j(r(w), {
            key: 4,
            label: "Load more catalogs",
            type: "button",
            disabled: h.value || !!k.value,
            onClick: a[4] || (a[4] = (l) => D($.value)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, null, 8, ["disabled"])) : C("", !0)
        ]),
        _: 1
      }, 8, ["count"])) : C("", !0),
      m("section", {
        ref_key: "detail",
        ref: S,
        class: "pim-system-main",
        "aria-label": "Catalog settings detail",
        tabindex: "-1"
      }, [
        s.value && f.value ? (u(), y("kickside-pim-catalog-settings", {
          key: s.value,
          "catalog-id": s.value,
          embedded: "true",
          "focus-back": String(_.value),
          "directory-count": L.value ?? v.value?.length,
          onDirectoryAction: a[5] || (a[5] = (l) => R(l.detail.name)),
          onOpenCatalogPicker: M,
          onDirtyChanged: ne
        }, null, 40, Ue)) : s.value && p.value ? (u(), y("p", Fe, "Loading catalog settings…")) : s.value ? (u(), y("p", Me, [
          a[7] || (a[7] = z("Catalog settings are unavailable.", -1)),
          c(r(w), {
            label: "Back to catalogs",
            severity: "secondary",
            text: "",
            onClick: M
          }),
          c(r(w), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            onClick: O
          })
        ])) : v.value && !k.value ? (u(), y("div", Re, [
          c(r(P), {
            class: "kx-empty-ico",
            icon: "tabler:adjustments",
            "aria-hidden": "true"
          }),
          m("h2", ze, E(L.value === 0 ? "No catalogs yet" : "Choose a catalog"), 1),
          m("p", Ke, E(L.value === 0 ? "Create a catalog to set up families, fields, channels and access." : "Select a catalog to manage its families, fields, channels and access."), 1)
        ])) : C("", !0)
      ], 512),
      c(qe, {
        visible: n.value,
        onClose: a[6] || (a[6] = (l) => n.value = !1),
        onCreated: ae
      }, null, 8, ["visible"])
    ], 2));
  }
}), We = { type: "object", properties: {} };
class Ge extends me {
  static get wippyConfig() {
    return { propsSchema: We, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"], inlineCss: fe };
  }
  static get vueConfig() {
    return { rootComponent: Oe, plugins: [pe] };
  }
}
Se(import.meta.url, Ge);
