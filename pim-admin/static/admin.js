import { _ as re, a as X, p as Y, b as Z, u as ue, e as ce, r as de, W as ve, s as pe, P as me } from "./styles-D0wQOH2A.js";
import { defineComponent as z, useId as ee, openBlock as s, createElementBlock as f, unref as n, createElementVNode as v, createTextVNode as U, toDisplayString as S, createCommentVNode as _, renderSlot as M, ref as i, createBlock as I, withCtx as y, withModifiers as fe, createVNode as d, computed as ge, watch as ye, onUnmounted as be, normalizeClass as _e, Fragment as ke, renderList as he, nextTick as J } from "vue";
import { on as Ce, host as Q, define as xe } from "@wippy-fe/proxy";
import h from "primevue/button";
import $e from "primevue/iconfield";
import Se from "primevue/inputicon";
import te from "primevue/inputtext";
import { Icon as B } from "@iconify/vue";
function N(r) {
  return !!r && typeof r == "object" && !Array.isArray(r);
}
function we(r, g) {
  return r;
}
function Te(r, g, p) {
  const a = N(r) ? r : {}, b = [
    a,
    N(a.data) ? a.data : null,
    N(a.payload) ? a.payload : null,
    N(a.detail) ? a.detail : null
  ].filter(Boolean);
  for (const t of b) {
    if (t.event !== "component.meta.changed" && t.event !== "component.deleting" && t.event !== "component.deleted") continue;
    const C = String(t.component_id || ""), u = String(a.topic || t.topic || "");
    if (!C && (!u.startsWith("component.") || u === "component.")) continue;
    const e = C || g || u.slice(10);
    return t.event === "component.deleting" && typeof t.deletion_job_id == "string" && t.deletion_job_id ? { event: t.event, component_id: e, deletion_job_id: t.deletion_job_id } : t.event !== "component.meta.changed" ? { event: t.event, component_id: e } : {
      event: "component.meta.changed",
      component_id: e,
      meta: we(N(t.meta) ? t.meta : {}),
      deleted: Array.isArray(t.deleted) ? t.deleted.map(String) : []
    };
  }
  return null;
}
function Ve(r, g, p) {
  const a = Te(r, g);
  return a?.event === "component.meta.changed" ? a : null;
}
const Ae = ["aria-labelledby"], je = { class: "kx-railhead" }, Be = ["id"], Ie = { key: 0 }, qe = { class: "kx-railhead-acts" }, Ee = { class: "kx-rail-body" }, Le = /* @__PURE__ */ z({
  __name: "ListRail",
  props: {
    title: {},
    count: {}
  },
  setup(r) {
    const g = ee();
    return (p, a) => (s(), f("aside", {
      class: "kx-rail",
      "aria-labelledby": n(g)
    }, [
      v("div", je, [
        v("span", {
          id: n(g),
          class: "kx-railhead-title"
        }, [
          U(S(r.title), 1),
          r.count !== void 0 ? (s(), f("b", Ie, S(r.count), 1)) : _("", !0)
        ], 8, Be),
        v("div", qe, [
          M(p.$slots, "actions")
        ])
      ]),
      M(p.$slots, "toolbar"),
      v("div", Ee, [
        M(p.$slots, "default")
      ])
    ], 8, Ae));
  }
}), Ne = { class: "pim-stack" }, Pe = { class: "dialog-actions" }, Re = /* @__PURE__ */ z({
  __name: "CreateCatalog",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(r, { emit: g }) {
    const p = g, a = i(""), b = i(), t = i(!1);
    async function C() {
      const u = a.value.trim();
      if (!(!u || t.value)) {
        t.value = !0, b.value = void 0;
        try {
          const e = await Y.createCatalog(u);
          a.value = "", p("close"), p("created", e.catalog_id);
        } catch (e) {
          b.value = Z(e, "Could not create the catalog.");
        } finally {
          t.value = !1;
        }
      }
    }
    return (u, e) => (s(), I(re, {
      visible: r.visible,
      label: "Create catalog",
      busy: t.value,
      onClose: e[2] || (e[2] = (w) => p("close"))
    }, {
      default: y(() => [
        v("form", {
          class: "dialog-box",
          onSubmit: fe(C, ["prevent"])
        }, [
          e[6] || (e[6] = v("h2", null, "Create catalog", -1)),
          e[7] || (e[7] = v("p", { class: "muted" }, "After creating it, set up the product families and fields it needs.", -1)),
          v("label", Ne, [
            e[3] || (e[3] = v("span", { class: "small muted" }, "Catalog name", -1)),
            d(n(te), {
              modelValue: a.value,
              "onUpdate:modelValue": e[0] || (e[0] = (w) => a.value = w),
              autofocus: "",
              placeholder: "For example, Outdoor equipment"
            }, null, 8, ["modelValue"])
          ]),
          b.value ? (s(), I(X, {
            key: 0,
            error: b.value
          }, null, 8, ["error"])) : _("", !0),
          v("div", Pe, [
            d(n(h), {
              severity: "secondary",
              outlined: "",
              disabled: t.value,
              onClick: e[1] || (e[1] = (w) => p("close"))
            }, {
              default: y(() => [
                d(n(B), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                }),
                e[4] || (e[4] = U(" Cancel", -1))
              ]),
              _: 1
            }, 8, ["disabled"]),
            d(n(h), {
              type: "submit",
              disabled: t.value || !a.value.trim(),
              loading: t.value
            }, {
              default: y(() => [...e[5] || (e[5] = [
                U("Create catalog", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "loading"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
}), Ue = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, De = {
  key: 2,
  class: "picker-group"
}, Fe = ["aria-describedby", "aria-current", "onClick"], Me = { class: "picker-name" }, ze = ["id"], Ke = {
  key: 4,
  class: "picker-message",
  role: "status"
}, Oe = ["catalog-id", "focus-back"], We = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Ge = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, He = {
  key: 3,
  class: "kx-empty"
}, Je = { class: "kx-empty-title" }, Qe = { class: "kx-empty-sub" }, Xe = /* @__PURE__ */ z({
  __name: "AdminApp",
  setup(r) {
    const g = i(!1), p = i(!1), a = i(!1), b = i(!1), t = i(!1), C = i(!1), u = i(""), e = i(""), w = i(), K = i(), D = i();
    let q = !0;
    async function O() {
      p.value = !0;
      try {
        g.value = await ce("kickside-pim-catalog-settings");
      } finally {
        p.value = !1;
      }
    }
    O();
    async function ae(c) {
      a.value = !1, F(c), E.value && (T.value = "", await J()), await L();
    }
    function F(c, l = !0) {
      q = !1, C.value = l, l && w.value?.focus({ preventScroll: !0 }), e.value = u.value = c;
    }
    async function W() {
      if (b.value) return;
      if (t.value) {
        b.value = !0;
        try {
          if (!await Q.confirm({ header: "Discard unsaved changes?", message: "Returning to catalogs will discard unsaved settings and plugin changes.", acceptLabel: "Discard changes", rejectLabel: "Keep editing" })) return;
        } finally {
          b.value = !1;
        }
      }
      t.value = !1, u.value = "", await J(), (K.value?.querySelector('[aria-current="true"]') ?? D.value?.querySelector("input"))?.focus();
    }
    function le() {
      q = !1, a.value = !0;
    }
    function ne() {
      Q.navigate("/system/settings");
    }
    const G = ee(), m = i(), P = i();
    function oe(c) {
      t.value = c.detail.dirty;
    }
    const T = i(""), E = ge(() => T.value.trim()), x = i(!0), k = i(), V = i(), A = de();
    let R;
    async function L(c, l = E.value || void 0) {
      if (c != null && x.value) return;
      clearTimeout(R);
      const o = A.begin();
      x.value = !0, k.value = void 0;
      try {
        const $ = await Y.listCatalogs(c, l);
        if (!A.current(o)) return;
        const H = $.catalogs.filter((j) => j.access.admin);
        if (m.value = c == null ? H : [...m.value ?? [], ...H], V.value = $.after, !l && V.value == null && (P.value = m.value.length, e.value && !m.value.some((j) => j.catalog_id === e.value) && (e.value = u.value = "", t.value = !1), q)) {
          q = !1;
          const j = m.value[0];
          m.value.length === 1 && j && F(j.catalog_id, !1);
        }
      } catch ($) {
        A.current(o) && (k.value = { error: Z($, "Could not load catalogs."), after: c, text: l });
      } finally {
        A.current(o) && (x.value = !1);
      }
    }
    function ie() {
      const c = k.value;
      c && L(c.after, c.text);
    }
    ye(E, () => {
      q = !1, A.begin(), clearTimeout(R), m.value = void 0, V.value = void 0, x.value = !0, k.value = void 0, R = setTimeout(() => {
        L();
      }, 250);
    });
    const se = Ce("component.meta.changed", (c) => {
      const l = Ve(c);
      if (!l) return;
      const o = m.value?.find(($) => $.catalog_id === l.component_id);
      o && (typeof l.meta.title == "string" && (o.title = l.meta.title.trim() || "Catalog"), l.deleted.includes("title") && (o.title = "Catalog"));
    });
    return ue(L), be(() => {
      se(), clearTimeout(R), A.begin();
    }), (c, l) => (s(), f("main", {
      class: _e(["kx-shell pim-system", { "pim-catalog-selected": u.value }])
    }, [
      u.value ? _("", !0) : (s(), I(Le, {
        key: 0,
        class: "pim-catalog-picker",
        title: "Catalogs",
        count: P.value ?? m.value?.length
      }, {
        actions: y(() => [
          d(n(h), {
            type: "button",
            text: "",
            "aria-label": "Create catalog",
            title: "Create catalog",
            onClick: le
          }, {
            icon: y(() => [
              d(n(B), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }),
          d(n(h), {
            type: "button",
            text: "",
            "aria-label": "Application defaults",
            title: "Application defaults",
            onClick: ne
          }, {
            icon: y(() => [
              d(n(B), {
                icon: "tabler:settings",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        toolbar: y(() => [
          v("div", {
            ref_key: "searchField",
            ref: D,
            class: "picker-search"
          }, [
            d(n($e), null, {
              default: y(() => [
                d(n(Se), null, {
                  default: y(() => [
                    d(n(B), {
                      icon: "tabler:search",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }),
                d(n(te), {
                  type: "search",
                  modelValue: T.value,
                  "onUpdate:modelValue": l[0] || (l[0] = (o) => T.value = o),
                  class: "picker-search-input",
                  "aria-label": "Search catalogs",
                  placeholder: "Search catalogs…"
                }, null, 8, ["modelValue"]),
                T.value ? (s(), I(n(h), {
                  key: 0,
                  type: "button",
                  text: "",
                  severity: "secondary",
                  class: "picker-search-clear",
                  "aria-label": "Clear search",
                  onClick: l[1] || (l[1] = (o) => {
                    T.value = "", D.value?.querySelector("input")?.focus();
                  })
                }, {
                  icon: y(() => [
                    d(n(B), {
                      icon: "tabler:x",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                })) : _("", !0)
              ]),
              _: 1
            })
          ], 512)
        ]),
        default: y(() => [
          k.value ? (s(), I(X, {
            key: 0,
            error: k.value.error
          }, {
            default: y(() => [
              d(n(h), {
                label: "Retry",
                type: "button",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: ie
              })
            ]),
            _: 1
          }, 8, ["error"])) : x.value ? (s(), f("p", Ue, S(E.value ? "Searching catalogs…" : "Loading catalogs…"), 1)) : _("", !0),
          m.value?.length ? (s(), f("h2", De, "Available")) : _("", !0),
          m.value?.length ? (s(), f("ul", {
            key: 3,
            ref_key: "list",
            ref: K,
            class: "picker-list"
          }, [
            (s(!0), f(ke, null, he(m.value, (o) => (s(), f("li", {
              key: o.catalog_id
            }, [
              v("button", {
                type: "button",
                class: "picker-row pim-catalog-row",
                "aria-describedby": n(G) + "-" + o.catalog_id,
                "aria-current": e.value === o.catalog_id ? "true" : void 0,
                onClick: ($) => F(o.catalog_id)
              }, [
                v("span", Me, S(o.title || "Untitled catalog"), 1),
                v("span", {
                  id: n(G) + "-" + o.catalog_id,
                  class: "picker-row-description"
                }, S(typeof o.product_count == "number" ? o.product_count + (o.product_count === 1 ? " product" : " products") : "Product count unavailable"), 9, ze)
              ], 8, Fe)
            ]))), 128))
          ], 512)) : _("", !0),
          !k.value && !x.value && E.value && !m.value?.length && V.value == null ? (s(), f("p", Ke, "No catalogs match. Try another name.")) : _("", !0),
          V.value != null ? (s(), I(n(h), {
            key: 5,
            label: "Load more catalogs",
            type: "button",
            disabled: x.value || !!k.value,
            onClick: l[2] || (l[2] = (o) => L(V.value)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, null, 8, ["disabled"])) : _("", !0)
        ]),
        _: 1
      }, 8, ["count"])),
      v("section", {
        ref_key: "detail",
        ref: w,
        class: "pim-system-main",
        "aria-label": "Catalog settings detail",
        tabindex: "-1"
      }, [
        u.value && g.value ? (s(), f("kickside-pim-catalog-settings", {
          key: u.value,
          "catalog-id": u.value,
          embedded: "true",
          "focus-back": String(C.value),
          onOpenCatalogPicker: W,
          onDirtyChanged: oe
        }, null, 40, Oe)) : u.value && p.value ? (s(), f("p", We, "Loading catalog settings…")) : u.value ? (s(), f("p", Ge, [
          l[4] || (l[4] = U("Catalog settings are unavailable.", -1)),
          d(n(h), {
            label: "Back to catalogs",
            severity: "secondary",
            text: "",
            onClick: W
          }),
          d(n(h), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            onClick: O
          })
        ])) : m.value && !k.value ? (s(), f("div", He, [
          d(n(B), {
            class: "kx-empty-ico",
            icon: "tabler:adjustments",
            "aria-hidden": "true"
          }),
          v("h2", Je, S(P.value === 0 ? "No catalogs yet" : "Choose a catalog"), 1),
          v("p", Qe, S(P.value === 0 ? "Create a catalog to set up families, fields, channels and access." : "Select a catalog to manage its families, fields, channels and access."), 1)
        ])) : _("", !0)
      ], 512),
      d(Re, {
        visible: a.value,
        onClose: l[3] || (l[3] = (o) => a.value = !1),
        onCreated: ae
      }, null, 8, ["visible"])
    ], 2));
  }
}), Ye = { type: "object", properties: {} };
class Ze extends ve {
  static get wippyConfig() {
    return { propsSchema: Ye, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"], inlineCss: pe };
  }
  static get vueConfig() {
    return { rootComponent: Xe, plugins: [me] };
  }
}
xe(import.meta.url, Ze);
