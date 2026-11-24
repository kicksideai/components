import { _ as ge, a as ye, b as le, p as ne, c as ie, u as be, d as ke, e as Ce, r as he, f as _e, g as $e, W as xe, s as Se, P as we } from "./styles-CsjeEppB.js";
import { defineComponent as q, openBlock as c, createElementBlock as k, createElementVNode as f, createVNode as d, unref as o, toDisplayString as P, renderSlot as Ie, createTextVNode as T, createCommentVNode as h, createBlock as S, createSlots as Te, withCtx as g, normalizeClass as oe, Fragment as se, ref as u, withModifiers as re, watch as W, useId as Ve, computed as Ae, onUnmounted as Le, renderList as De, nextTick as te } from "vue";
import { on as Ue, host as ae, define as je } from "@wippy-fe/proxy";
import _ from "primevue/button";
import Ee from "primevue/iconfield";
import Re from "primevue/inputicon";
import ue from "primevue/inputtext";
import { Icon as V } from "@iconify/vue";
function N(n) {
  return !!n && typeof n == "object" && !Array.isArray(n);
}
function Be(n, v) {
  return n;
}
function Ne(n, v, r) {
  const s = N(n) ? n : {}, m = [
    s,
    N(s.data) ? s.data : null,
    N(s.payload) ? s.payload : null,
    N(s.detail) ? s.detail : null
  ].filter(Boolean);
  for (const a of m) {
    if (a.event !== "component.meta.changed" && a.event !== "component.deleting" && a.event !== "component.deleted") continue;
    const $ = String(a.component_id || ""), C = String(s.topic || a.topic || "");
    if (!$ && (!C.startsWith("component.") || C === "component.")) continue;
    const e = $ || v || C.slice(10);
    return a.event === "component.deleting" && typeof a.deletion_job_id == "string" && a.deletion_job_id ? { event: a.event, component_id: e, deletion_job_id: a.deletion_job_id } : a.event !== "component.meta.changed" ? { event: a.event, component_id: e } : {
      event: "component.meta.changed",
      component_id: e,
      meta: Be(N(a.meta) ? a.meta : {}),
      deleted: Array.isArray(a.deleted) ? a.deleted.map(String) : []
    };
  }
  return null;
}
function Pe(n, v, r) {
  const s = Ne(n, v);
  return s?.event === "component.meta.changed" ? s : null;
}
const qe = { class: "kx-empty" }, Fe = { class: "kx-empty-ico" }, Me = { class: "kx-empty-title" }, ze = {
  key: 0,
  class: "kx-empty-sub"
}, Ke = /* @__PURE__ */ q({
  __name: "EmptyState",
  props: {
    icon: {},
    title: {},
    hint: {},
    cta: {},
    ctaIcon: {}
  },
  emits: ["cta"],
  setup(n) {
    return (v, r) => (c(), k("div", qe, [
      f("div", Fe, [
        d(o(V), {
          icon: n.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      f("div", Me, P(n.title), 1),
      n.hint || v.$slots.hint ? (c(), k("p", ze, [
        Ie(v.$slots, "hint", {}, () => [
          T(P(n.hint), 1)
        ])
      ])) : h("", !0),
      n.cta ? (c(), S(o(_), {
        key: 1,
        label: n.cta,
        onClick: r[0] || (r[0] = (s) => v.$emit("cta"))
      }, Te({ _: 2 }, [
        n.ctaIcon ? {
          name: "icon",
          fn: g(({ class: s }) => [
            d(o(V), {
              icon: n.ctaIcon,
              class: oe(s),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : h("", !0)
    ]));
  }
}), Oe = /* @__PURE__ */ q({
  __name: "SettingsDirectoryActions",
  props: {
    createLabel: {}
  },
  emits: ["create", "defaults"],
  setup(n) {
    return (v, r) => (c(), k(se, null, [
      d(o(_), {
        type: "button",
        text: "",
        "aria-label": n.createLabel,
        title: n.createLabel,
        onClick: r[0] || (r[0] = (s) => v.$emit("create"))
      }, {
        icon: g(() => [
          d(o(V), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label", "title"]),
      d(o(_), {
        type: "button",
        text: "",
        "aria-label": "Application defaults",
        title: "Application defaults",
        onClick: r[1] || (r[1] = (s) => v.$emit("defaults"))
      }, {
        icon: g(() => [
          d(o(V), {
            icon: "tabler:settings",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ], 64));
  }
}), We = { class: "pim-stack" }, Ge = { class: "dialog-actions" }, He = /* @__PURE__ */ q({
  __name: "CreateCatalog",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(n, { emit: v }) {
    const r = v, s = u(""), m = u(), a = u(!1);
    async function $() {
      const C = s.value.trim();
      if (!(!C || a.value)) {
        a.value = !0, m.value = void 0;
        try {
          const e = await ne.createCatalog(C);
          s.value = "", r("close"), r("created", e.catalog_id);
        } catch (e) {
          m.value = ie(e, "Could not create the catalog.");
        } finally {
          a.value = !1;
        }
      }
    }
    return (C, e) => (c(), S(ge, {
      visible: n.visible,
      label: "Create catalog",
      busy: a.value,
      onClose: e[2] || (e[2] = (w) => r("close"))
    }, {
      default: g(() => [
        f("form", {
          class: "dialog-box",
          onSubmit: re($, ["prevent"])
        }, [
          e[7] || (e[7] = f("h2", null, "Create catalog", -1)),
          e[8] || (e[8] = f("p", { class: "muted" }, "After creating it, set up the product families and fields it needs.", -1)),
          f("label", We, [
            e[3] || (e[3] = f("span", { class: "small muted" }, "Catalog name", -1)),
            d(o(ue), {
              modelValue: s.value,
              "onUpdate:modelValue": e[0] || (e[0] = (w) => s.value = w),
              autofocus: "",
              placeholder: "For example, Outdoor equipment"
            }, null, 8, ["modelValue"])
          ]),
          d(ye, {
            class: "small pim-ia-disclosure",
            label: "Catalog pack technical details"
          }, {
            default: g(() => [...e[4] || (e[4] = [
              f("p", null, [
                T("To create a catalog with a UI app preset, pass the catalog pack registry ID as "),
                f("code", null, "pack"),
                T(" to "),
                f("code", null, "PIMCatalogCreate"),
                T(".")
              ], -1)
            ])]),
            _: 1
          }),
          m.value ? (c(), S(le, {
            key: 0,
            error: m.value
          }, null, 8, ["error"])) : h("", !0),
          f("div", Ge, [
            d(o(_), {
              severity: "secondary",
              outlined: "",
              disabled: a.value,
              onClick: e[1] || (e[1] = (w) => r("close"))
            }, {
              default: g(() => [
                d(o(V), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                }),
                e[5] || (e[5] = T(" Cancel", -1))
              ]),
              _: 1
            }, 8, ["disabled"]),
            d(o(_), {
              type: "submit",
              disabled: a.value || !s.value.trim(),
              loading: a.value
            }, {
              default: g(() => [...e[6] || (e[6] = [
                T("Create catalog", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "loading"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
}), Je = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Qe = ["aria-describedby", "aria-current", "onClick"], Xe = { class: "picker-name" }, Ye = ["id"], Ze = {
  key: 3,
  class: "picker-message",
  role: "status"
}, et = ["route", "catalog-id", "focus-back"], tt = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, at = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, lt = /* @__PURE__ */ q({
  __name: "AdminApp",
  props: {
    route: {}
  },
  emits: ["navigate", "dirty-change"],
  setup(n, { emit: v }) {
    const r = n, s = v, m = u(!1), a = u(!1), $ = u(!1), C = u(!1), e = u(!1), w = u(!1), y = u(""), A = u(""), G = u(), H = u(), K = u();
    let L = !0;
    async function J() {
      a.value = !0;
      try {
        m.value = await Ce("kickside-pim-catalog-settings");
      } finally {
        a.value = !1;
      }
    }
    J();
    async function ce(l) {
      $.value = !1, O(l), R.value && (D.value = "", await te()), await B();
    }
    const F = u("");
    W(e, (l) => s("dirty-change", l), { flush: "sync" });
    function Q(l) {
      r.route !== void 0 && l !== r.route && s("navigate", l);
    }
    function X(l) {
      const t = y.value;
      !t || r.route === void 0 || (F.value = l, Q(l ? encodeURIComponent(t) + "/" + l : encodeURIComponent(t)));
    }
    function O(l, t = !0) {
      L = !1, w.value = t, t && G.value?.focus({ preventScroll: !0 }), A.value = y.value = l, X("overview");
    }
    W(() => r.route, (l) => {
      if (l === void 0) return;
      const [t, ...i] = l.split("/");
      let p;
      try {
        p = decodeURIComponent(t ?? "");
      } catch {
        return;
      }
      p && (L = !1), p !== y.value && (y.value = p, p && (A.value = p), w.value = !1, e.value = !1), F.value = i.join("/");
    }, { immediate: !0 });
    async function de() {
      if (C.value) return !1;
      if (!e.value) return !0;
      C.value = !0;
      try {
        return await ae.confirm({ header: "Discard unsaved changes?", message: "Leaving these settings will discard unsaved catalog and plugin changes.", acceptLabel: "Discard changes", rejectLabel: "Keep editing" });
      } finally {
        C.value = !1;
      }
    }
    async function Y() {
      return await de() ? (e.value = !1, y.value = "", F.value = "", Q(""), await te(), (H.value?.querySelector('[aria-current="true"]') ?? K.value?.querySelector("input"))?.focus(), !0) : !1;
    }
    function ve() {
      L = !1, $.value = !0;
    }
    const Z = Ve(), b = u(), M = u();
    function me(l) {
      e.value = l.detail.dirty;
    }
    const D = u(""), R = Ae(() => D.value.trim()), I = u(!0), x = u(), U = u(), j = he();
    let z;
    async function B(l, t = R.value || void 0) {
      if (l != null && I.value) return;
      clearTimeout(z);
      const i = j.begin();
      I.value = !0, x.value = void 0;
      try {
        const p = await ne.listCatalogs(l, t);
        if (!j.current(i)) return;
        const ee = p.catalogs.filter((E) => E.access.admin);
        if (b.value = l == null ? ee : [...b.value ?? [], ...ee], U.value = p.after, !t && U.value == null && (M.value = b.value.length, A.value && !b.value.some((E) => E.catalog_id === A.value) && (A.value = y.value = "", e.value = !1), L)) {
          L = !1;
          const E = b.value[0];
          b.value.length === 1 && E && O(E.catalog_id, !1);
        }
      } catch (p) {
        j.current(i) && (x.value = { error: ie(p, "Could not load catalogs."), after: l, text: t });
      } finally {
        j.current(i) && (I.value = !1);
      }
    }
    function fe() {
      const l = x.value;
      l && B(l.after, l.text);
    }
    W(R, () => {
      L = !1, j.begin(), clearTimeout(z), b.value = void 0, U.value = void 0, I.value = !0, x.value = void 0, z = setTimeout(() => {
        B();
      }, 250);
    });
    const pe = Ue("component.meta.changed", (l) => {
      const t = Pe(l);
      if (!t) return;
      const i = b.value?.find((p) => p.catalog_id === t.component_id);
      i && (typeof t.meta.title == "string" && (i.title = t.meta.title.trim() || "Catalog"), t.deleted.includes("title") && (i.title = "Catalog"));
    });
    return be(B), Le(() => {
      pe(), clearTimeout(z), j.begin();
    }), (l, t) => (c(), k("main", {
      class: oe(["kx-shell kx-settings-shell pim-system", { "pim-catalog-selected": y.value && m.value }])
    }, [
      !y.value || !m.value ? (c(), S(ke, {
        key: 0,
        settings: "",
        class: "pim-catalog-picker",
        title: "Catalogs",
        count: M.value ?? b.value?.length
      }, {
        actions: g(() => [
          d(Oe, {
            "create-label": "Create catalog",
            onCreate: ve,
            onDefaults: t[0] || (t[0] = (i) => o(ae).navigate("/system/settings"))
          })
        ]),
        toolbar: g(() => [
          f("div", {
            ref_key: "searchField",
            ref: K,
            class: "picker-search"
          }, [
            d(o(Ee), null, {
              default: g(() => [
                d(o(Re), null, {
                  default: g(() => [
                    d(o(V), {
                      icon: "tabler:search",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }),
                d(o(ue), {
                  type: "search",
                  modelValue: D.value,
                  "onUpdate:modelValue": t[1] || (t[1] = (i) => D.value = i),
                  class: "picker-search-input",
                  "aria-label": "Search catalogs",
                  placeholder: "Search catalogs…"
                }, null, 8, ["modelValue"]),
                D.value ? (c(), S(o(_), {
                  key: 0,
                  type: "button",
                  text: "",
                  severity: "secondary",
                  class: "picker-search-clear",
                  "aria-label": "Clear search",
                  onClick: t[2] || (t[2] = (i) => {
                    D.value = "", K.value?.querySelector("input")?.focus();
                  })
                }, {
                  icon: g(() => [
                    d(o(V), {
                      icon: "tabler:x",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                })) : h("", !0)
              ]),
              _: 1
            })
          ], 512)
        ]),
        default: g(() => [
          x.value ? (c(), S(le, {
            key: 0,
            error: x.value.error
          }, {
            default: g(() => [
              d(o(_), {
                label: "Retry",
                type: "button",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: fe
              })
            ]),
            _: 1
          }, 8, ["error"])) : I.value ? (c(), k("p", Je, P(R.value ? "Searching catalogs…" : "Loading catalogs…"), 1)) : h("", !0),
          b.value?.length ? (c(), k("ul", {
            key: 2,
            ref_key: "list",
            ref: H,
            class: "picker-list"
          }, [
            (c(!0), k(se, null, De(b.value, (i) => (c(), k("li", {
              key: i.catalog_id
            }, [
              f("button", {
                type: "button",
                class: "picker-row pim-catalog-row",
                "aria-describedby": o(Z) + "-" + i.catalog_id,
                "aria-current": A.value === i.catalog_id ? "true" : void 0,
                onClick: (p) => O(i.catalog_id)
              }, [
                f("span", Xe, P(i.title || "Untitled catalog"), 1),
                f("span", {
                  id: o(Z) + "-" + i.catalog_id,
                  class: "picker-row-description"
                }, P(typeof i.product_count == "number" ? i.product_count + (i.product_count === 1 ? " product" : " products") : "Product count unavailable"), 9, Ye)
              ], 8, Qe)
            ]))), 128))
          ], 512)) : h("", !0),
          !x.value && !I.value && R.value && !b.value?.length && U.value == null ? (c(), k("p", Ze, "No catalogs match. Try another name.")) : h("", !0),
          U.value != null ? (c(), S(o(_), {
            key: 4,
            label: "Load more catalogs",
            type: "button",
            disabled: I.value || !!x.value,
            onClick: t[3] || (t[3] = (i) => B(U.value)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, null, 8, ["disabled"])) : h("", !0)
        ]),
        _: 1
      }, 8, ["count"])) : h("", !0),
      f("section", {
        ref_key: "detail",
        ref: G,
        class: "pim-system-main",
        "aria-label": "Catalog settings detail",
        tabindex: "-1"
      }, [
        y.value && m.value ? (c(), k("kickside-pim-catalog-settings", {
          route: r.route === void 0 ? void 0 : F.value,
          onNavigate: t[4] || (t[4] = re((i) => X(i.detail.route), ["stop"])),
          key: y.value,
          "catalog-id": y.value,
          embedded: "true",
          "focus-back": String(w.value),
          onOpenCatalogPicker: Y,
          onDirtyChange: me
        }, null, 40, et)) : y.value && a.value ? (c(), k("p", tt, "Loading catalog settings…")) : y.value ? (c(), k("p", at, [
          t[6] || (t[6] = T("Catalog settings are unavailable.", -1)),
          d(o(_), {
            label: "Back to catalogs",
            severity: "secondary",
            text: "",
            onClick: Y
          }),
          d(o(_), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            onClick: J
          })
        ])) : b.value && !x.value ? (c(), S(Ke, {
          key: 3,
          icon: "tabler:adjustments",
          title: M.value === 0 ? "No catalogs yet" : "Choose a catalog",
          hint: M.value === 0 ? "Create a catalog to set up families, fields, channels and access." : "Select a catalog to manage its families, fields, channels and access."
        }, null, 8, ["title", "hint"])) : h("", !0)
      ], 512),
      d(He, {
        visible: $.value,
        onClose: t[5] || (t[5] = (i) => $.value = !1),
        onCreated: ce
      }, null, 8, ["visible"])
    ], 2));
  }
}), nt = /* @__PURE__ */ q({
  __name: "AdminRoot",
  setup(n) {
    const v = _e(), r = $e();
    return (s, m) => (c(), S(lt, {
      route: o(v).route,
      onNavigate: m[0] || (m[0] = (a) => o(r)("navigate", { route: a })),
      onDirtyChange: m[1] || (m[1] = (a) => o(r)("dirty-change", { dirty: a }))
    }, null, 8, ["route"]));
  }
}), it = { type: "object", properties: { route: { type: "string", default: "" } } };
class ot extends xe {
  static get wippyConfig() {
    return { propsSchema: it, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"], inlineCss: Se };
  }
  static get vueConfig() {
    return { rootComponent: nt, plugins: [we] };
  }
}
je(import.meta.url, ot);
