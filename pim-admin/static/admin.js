import { _ as ge, a as ye, b as le, p as ne, c as ie, u as be, d as ke, e as Ce, r as he, f as _e, g as $e, W as xe, s as Se, P as we } from "./styles-DT5_bjQ-.js";
import { defineComponent as q, openBlock as u, createElementBlock as h, createElementVNode as f, createVNode as c, unref as o, toDisplayString as P, renderSlot as Ie, createTextVNode as V, createCommentVNode as $, createBlock as I, createSlots as Te, withCtx as y, normalizeClass as oe, Fragment as se, ref as r, watch as z, withModifiers as re, useId as Ve, computed as Ae, onUnmounted as Le, renderList as Ue, nextTick as te } from "vue";
import { on as je, host as ae, define as De } from "@wippy-fe/proxy";
import x from "primevue/button";
import Re from "primevue/iconfield";
import Ee from "primevue/inputicon";
import ue from "primevue/inputtext";
import { Icon as A } from "@iconify/vue";
function N(l) {
  return !!l && typeof l == "object" && !Array.isArray(l);
}
function Be(l, v) {
  return l;
}
function Ne(l, v, d) {
  const s = N(l) ? l : {}, m = [
    s,
    N(s.data) ? s.data : null,
    N(s.payload) ? s.payload : null,
    N(s.detail) ? s.detail : null
  ].filter(Boolean);
  for (const n of m) {
    if (n.event !== "component.meta.changed" && n.event !== "component.deleting" && n.event !== "component.deleted") continue;
    const p = String(n.component_id || ""), _ = String(s.topic || n.topic || "");
    if (!p && (!_.startsWith("component.") || _ === "component.")) continue;
    const k = p || v || _.slice(10);
    return n.event === "component.deleting" && typeof n.deletion_job_id == "string" && n.deletion_job_id ? { event: n.event, component_id: k, deletion_job_id: n.deletion_job_id } : n.event !== "component.meta.changed" ? { event: n.event, component_id: k } : {
      event: "component.meta.changed",
      component_id: k,
      meta: Be(N(n.meta) ? n.meta : {}),
      deleted: Array.isArray(n.deleted) ? n.deleted.map(String) : []
    };
  }
  return null;
}
function Pe(l, v, d) {
  const s = Ne(l, v);
  return s?.event === "component.meta.changed" ? s : null;
}
const qe = { class: "kx-empty" }, Fe = { class: "kx-empty-ico" }, Me = { class: "kx-empty-title" }, Ke = {
  key: 0,
  class: "kx-empty-sub"
}, ze = /* @__PURE__ */ q({
  __name: "EmptyState",
  props: {
    icon: {},
    title: {},
    hint: {},
    cta: {},
    ctaIcon: {}
  },
  emits: ["cta"],
  setup(l) {
    return (v, d) => (u(), h("div", qe, [
      f("div", Fe, [
        c(o(A), {
          icon: l.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      f("div", Me, P(l.title), 1),
      l.hint || v.$slots.hint ? (u(), h("p", Ke, [
        Ie(v.$slots, "hint", {}, () => [
          V(P(l.hint), 1)
        ])
      ])) : $("", !0),
      l.cta ? (u(), I(o(x), {
        key: 1,
        label: l.cta,
        onClick: d[0] || (d[0] = (s) => v.$emit("cta"))
      }, Te({ _: 2 }, [
        l.ctaIcon ? {
          name: "icon",
          fn: y(({ class: s }) => [
            c(o(A), {
              icon: l.ctaIcon,
              class: oe(s),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : $("", !0)
    ]));
  }
}), Oe = /* @__PURE__ */ q({
  __name: "SettingsDirectoryActions",
  props: {
    createLabel: {}
  },
  emits: ["create", "defaults"],
  setup(l) {
    return (v, d) => (u(), h(se, null, [
      c(o(x), {
        type: "button",
        text: "",
        "aria-label": l.createLabel,
        title: l.createLabel,
        onClick: d[0] || (d[0] = (s) => v.$emit("create"))
      }, {
        icon: y(() => [
          c(o(A), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label", "title"]),
      c(o(x), {
        type: "button",
        text: "",
        "aria-label": "Application defaults",
        title: "Application defaults",
        onClick: d[1] || (d[1] = (s) => v.$emit("defaults"))
      }, {
        icon: y(() => [
          c(o(A), {
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
  setup(l, { emit: v }) {
    const d = l, s = v, m = r(""), n = r(), p = r(!1);
    let _;
    z(() => d.visible, (S) => {
      if (S) {
        const e = crypto.getRandomValues(new Uint32Array(4));
        _ = Array.from(e, (C) => C.toString(16).padStart(8, "0")).join("");
      }
    }, { immediate: !0 });
    async function k() {
      const S = m.value.trim();
      if (!(!S || p.value)) {
        p.value = !0, n.value = void 0;
        try {
          const e = await ne.createCatalog(S, _);
          m.value = "", s("close"), s("created", e.catalog_id);
        } catch (e) {
          n.value = ie(e, "Could not create the catalog.");
        } finally {
          p.value = !1;
        }
      }
    }
    return (S, e) => (u(), I(ge, {
      visible: l.visible,
      label: "Create catalog",
      busy: p.value,
      onClose: e[2] || (e[2] = (C) => s("close"))
    }, {
      default: y(() => [
        f("form", {
          class: "dialog-box",
          onSubmit: re(k, ["prevent"])
        }, [
          e[7] || (e[7] = f("h2", null, "Create catalog", -1)),
          e[8] || (e[8] = f("p", { class: "muted" }, "After creating it, set up the product families and fields it needs.", -1)),
          f("label", We, [
            e[3] || (e[3] = f("span", { class: "small muted" }, "Catalog name", -1)),
            c(o(ue), {
              modelValue: m.value,
              "onUpdate:modelValue": e[0] || (e[0] = (C) => m.value = C),
              autofocus: "",
              placeholder: "For example, Outdoor equipment"
            }, null, 8, ["modelValue"])
          ]),
          c(ye, {
            class: "small pim-ia-disclosure",
            label: "Catalog pack technical details"
          }, {
            default: y(() => [...e[4] || (e[4] = [
              f("p", null, [
                V("To create a catalog with a UI app preset, pass the catalog pack registry ID as "),
                f("code", null, "pack"),
                V(" to "),
                f("code", null, "PIMCatalogCreate"),
                V(".")
              ], -1)
            ])]),
            _: 1
          }),
          n.value ? (u(), I(le, {
            key: 0,
            error: n.value
          }, null, 8, ["error"])) : $("", !0),
          f("div", Ge, [
            c(o(x), {
              severity: "secondary",
              outlined: "",
              disabled: p.value,
              onClick: e[1] || (e[1] = (C) => s("close"))
            }, {
              default: y(() => [
                c(o(A), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                }),
                e[5] || (e[5] = V(" Cancel", -1))
              ]),
              _: 1
            }, 8, ["disabled"]),
            c(o(x), {
              type: "submit",
              disabled: p.value || !m.value.trim(),
              loading: p.value
            }, {
              default: y(() => [...e[6] || (e[6] = [
                V("Create catalog", -1)
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
  setup(l, { emit: v }) {
    const d = l, s = v, m = r(!1), n = r(!1), p = r(!1), _ = r(!1), k = r(!1), S = r(!1), e = r(""), C = r(""), G = r(), H = r(), O = r();
    let L = !0;
    async function J() {
      n.value = !0;
      try {
        m.value = await Ce("kickside-pim-catalog-settings");
      } finally {
        n.value = !1;
      }
    }
    J();
    async function ce(a) {
      p.value = !1, W(a), E.value && (U.value = "", await te()), await B();
    }
    const F = r("");
    z(k, (a) => s("dirty-change", a), { flush: "sync" });
    function Q(a) {
      d.route !== void 0 && a !== d.route && s("navigate", a);
    }
    function X(a) {
      const t = e.value;
      !t || d.route === void 0 || (F.value = a, Q(a ? encodeURIComponent(t) + "/" + a : encodeURIComponent(t)));
    }
    function W(a, t = !0) {
      L = !1, S.value = t, t && G.value?.focus({ preventScroll: !0 }), C.value = e.value = a, X("overview");
    }
    z(() => d.route, (a) => {
      if (a === void 0) return;
      const [t, ...i] = a.split("/");
      let g;
      try {
        g = decodeURIComponent(t ?? "");
      } catch {
        return;
      }
      g && (L = !1), g !== e.value && (e.value = g, g && (C.value = g), S.value = !1, k.value = !1), F.value = i.join("/");
    }, { immediate: !0 });
    async function de() {
      if (_.value) return !1;
      if (!k.value) return !0;
      _.value = !0;
      try {
        return await ae.confirm({ header: "Discard unsaved changes?", message: "Leaving these settings will discard unsaved catalog and plugin changes.", acceptLabel: "Discard changes", rejectLabel: "Keep editing" });
      } finally {
        _.value = !1;
      }
    }
    async function Y() {
      return await de() ? (k.value = !1, e.value = "", F.value = "", Q(""), await te(), (H.value?.querySelector('[aria-current="true"]') ?? O.value?.querySelector("input"))?.focus(), !0) : !1;
    }
    function ve() {
      L = !1, p.value = !0;
    }
    const Z = Ve(), b = r(), M = r();
    function me(a) {
      k.value = a.detail.dirty;
    }
    const U = r(""), E = Ae(() => U.value.trim()), T = r(!0), w = r(), j = r(), D = he();
    let K;
    async function B(a, t = E.value || void 0) {
      if (a != null && T.value) return;
      clearTimeout(K);
      const i = D.begin();
      T.value = !0, w.value = void 0;
      try {
        const g = await ne.listCatalogs(a, t);
        if (!D.current(i)) return;
        const ee = g.catalogs.filter((R) => R.access.admin);
        if (b.value = a == null ? ee : [...b.value ?? [], ...ee], j.value = g.after, !t && j.value == null && (M.value = b.value.length, C.value && !b.value.some((R) => R.catalog_id === C.value) && (C.value = e.value = "", k.value = !1), L)) {
          L = !1;
          const R = b.value[0];
          b.value.length === 1 && R && W(R.catalog_id, !1);
        }
      } catch (g) {
        D.current(i) && (w.value = { error: ie(g, "Could not load catalogs."), after: a, text: t });
      } finally {
        D.current(i) && (T.value = !1);
      }
    }
    function fe() {
      const a = w.value;
      a && B(a.after, a.text);
    }
    z(E, () => {
      L = !1, D.begin(), clearTimeout(K), b.value = void 0, j.value = void 0, T.value = !0, w.value = void 0, K = setTimeout(() => {
        B();
      }, 250);
    });
    const pe = je("component.meta.changed", (a) => {
      const t = Pe(a);
      if (!t) return;
      const i = b.value?.find((g) => g.catalog_id === t.component_id);
      i && (typeof t.meta.title == "string" && (i.title = t.meta.title.trim() || "Catalog"), t.deleted.includes("title") && (i.title = "Catalog"));
    });
    return be(B), Le(() => {
      pe(), clearTimeout(K), D.begin();
    }), (a, t) => (u(), h("main", {
      class: oe(["kx-shell kx-settings-shell pim-system", { "pim-catalog-selected": e.value && m.value }])
    }, [
      !e.value || !m.value ? (u(), I(ke, {
        key: 0,
        settings: "",
        class: "pim-catalog-picker",
        title: "Catalogs",
        count: M.value ?? b.value?.length
      }, {
        actions: y(() => [
          c(Oe, {
            "create-label": "Create catalog",
            onCreate: ve,
            onDefaults: t[0] || (t[0] = (i) => o(ae).navigate("/system/settings"))
          })
        ]),
        toolbar: y(() => [
          f("div", {
            ref_key: "searchField",
            ref: O,
            class: "picker-search"
          }, [
            c(o(Re), null, {
              default: y(() => [
                c(o(Ee), null, {
                  default: y(() => [
                    c(o(A), {
                      icon: "tabler:search",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }),
                c(o(ue), {
                  type: "search",
                  modelValue: U.value,
                  "onUpdate:modelValue": t[1] || (t[1] = (i) => U.value = i),
                  class: "picker-search-input",
                  "aria-label": "Search catalogs",
                  placeholder: "Search catalogs…"
                }, null, 8, ["modelValue"]),
                U.value ? (u(), I(o(x), {
                  key: 0,
                  type: "button",
                  text: "",
                  severity: "secondary",
                  class: "picker-search-clear",
                  "aria-label": "Clear search",
                  onClick: t[2] || (t[2] = (i) => {
                    U.value = "", O.value?.querySelector("input")?.focus();
                  })
                }, {
                  icon: y(() => [
                    c(o(A), {
                      icon: "tabler:x",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                })) : $("", !0)
              ]),
              _: 1
            })
          ], 512)
        ]),
        default: y(() => [
          w.value ? (u(), I(le, {
            key: 0,
            error: w.value.error
          }, {
            default: y(() => [
              c(o(x), {
                label: "Retry",
                type: "button",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: fe
              })
            ]),
            _: 1
          }, 8, ["error"])) : T.value ? (u(), h("p", Je, P(E.value ? "Searching catalogs…" : "Loading catalogs…"), 1)) : $("", !0),
          b.value?.length ? (u(), h("ul", {
            key: 2,
            ref_key: "list",
            ref: H,
            class: "picker-list"
          }, [
            (u(!0), h(se, null, Ue(b.value, (i) => (u(), h("li", {
              key: i.catalog_id
            }, [
              f("button", {
                type: "button",
                class: "picker-row pim-catalog-row",
                "aria-describedby": o(Z) + "-" + i.catalog_id,
                "aria-current": C.value === i.catalog_id ? "true" : void 0,
                onClick: (g) => W(i.catalog_id)
              }, [
                f("span", Xe, P(i.title || "Untitled catalog"), 1),
                f("span", {
                  id: o(Z) + "-" + i.catalog_id,
                  class: "picker-row-description"
                }, P(typeof i.product_count == "number" ? i.product_count + (i.product_count === 1 ? " product" : " products") : "Product count unavailable"), 9, Ye)
              ], 8, Qe)
            ]))), 128))
          ], 512)) : $("", !0),
          !w.value && !T.value && E.value && !b.value?.length && j.value == null ? (u(), h("p", Ze, "No catalogs match. Try another name.")) : $("", !0),
          j.value != null ? (u(), I(o(x), {
            key: 4,
            label: "Load more catalogs",
            type: "button",
            disabled: T.value || !!w.value,
            onClick: t[3] || (t[3] = (i) => B(j.value)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, null, 8, ["disabled"])) : $("", !0)
        ]),
        _: 1
      }, 8, ["count"])) : $("", !0),
      f("section", {
        ref_key: "detail",
        ref: G,
        class: "pim-system-main",
        "aria-label": "Catalog settings detail",
        tabindex: "-1"
      }, [
        e.value && m.value ? (u(), h("kickside-pim-catalog-settings", {
          route: d.route === void 0 ? void 0 : F.value,
          onNavigate: t[4] || (t[4] = re((i) => X(i.detail.route), ["stop"])),
          key: e.value,
          "catalog-id": e.value,
          embedded: "true",
          "focus-back": String(S.value),
          onOpenCatalogPicker: Y,
          onDirtyChange: me
        }, null, 40, et)) : e.value && n.value ? (u(), h("p", tt, "Loading catalog settings…")) : e.value ? (u(), h("p", at, [
          t[6] || (t[6] = V("Catalog settings are unavailable.", -1)),
          c(o(x), {
            label: "Back to catalogs",
            severity: "secondary",
            text: "",
            onClick: Y
          }),
          c(o(x), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            onClick: J
          })
        ])) : b.value && !w.value ? (u(), I(ze, {
          key: 3,
          icon: "tabler:adjustments",
          title: M.value === 0 ? "No catalogs yet" : "Choose a catalog",
          hint: M.value === 0 ? "Create a catalog to set up families, fields, channels and access." : "Select a catalog to manage its families, fields, channels and access."
        }, null, 8, ["title", "hint"])) : $("", !0)
      ], 512),
      c(He, {
        visible: p.value,
        onClose: t[5] || (t[5] = (i) => p.value = !1),
        onCreated: ce
      }, null, 8, ["visible"])
    ], 2));
  }
}), nt = /* @__PURE__ */ q({
  __name: "AdminRoot",
  setup(l) {
    const v = _e(), d = $e();
    return (s, m) => (u(), I(lt, {
      route: o(v).route,
      onNavigate: m[0] || (m[0] = (n) => o(d)("navigate", { route: n })),
      onDirtyChange: m[1] || (m[1] = (n) => o(d)("dirty-change", { dirty: n }))
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
De(import.meta.url, ot);
