import { _ as re, a as Q, p as X, b as Y, u as ue, c as ce, e as de, r as ve, W as me, s as fe, P as pe } from "./styles-B04GGVk1.js";
import { defineComponent as F, openBlock as r, createElementBlock as y, createElementVNode as g, createVNode as u, unref as i, toDisplayString as D, renderSlot as ge, createTextVNode as U, createCommentVNode as k, createBlock as _, createSlots as ye, withCtx as p, normalizeClass as Z, Fragment as ee, ref as s, withModifiers as be, useId as ke, computed as Ce, watch as he, onUnmounted as _e, renderList as $e, nextTick as H } from "vue";
import { on as xe, host as J, define as Se } from "@wippy-fe/proxy";
import C from "primevue/button";
import we from "primevue/iconfield";
import Te from "primevue/inputicon";
import te from "primevue/inputtext";
import { Icon as w } from "@iconify/vue";
function q(l) {
  return !!l && typeof l == "object" && !Array.isArray(l);
}
function Ve(l, c) {
  return l;
}
function Ae(l, c, d) {
  const a = q(l) ? l : {}, b = [
    a,
    q(a.data) ? a.data : null,
    q(a.payload) ? a.payload : null,
    q(a.detail) ? a.detail : null
  ].filter(Boolean);
  for (const t of b) {
    if (t.event !== "component.meta.changed" && t.event !== "component.deleting" && t.event !== "component.deleted") continue;
    const $ = String(t.component_id || ""), v = String(a.topic || t.topic || "");
    if (!$ && (!v.startsWith("component.") || v === "component.")) continue;
    const e = $ || c || v.slice(10);
    return t.event === "component.deleting" && typeof t.deletion_job_id == "string" && t.deletion_job_id ? { event: t.event, component_id: e, deletion_job_id: t.deletion_job_id } : t.event !== "component.meta.changed" ? { event: t.event, component_id: e } : {
      event: "component.meta.changed",
      component_id: e,
      meta: Ve(q(t.meta) ? t.meta : {}),
      deleted: Array.isArray(t.deleted) ? t.deleted.map(String) : []
    };
  }
  return null;
}
function Le(l, c, d) {
  const a = Ae(l, c);
  return a?.event === "component.meta.changed" ? a : null;
}
const Ie = { class: "kx-empty" }, je = { class: "kx-empty-ico" }, Be = { class: "kx-empty-title" }, Ee = {
  key: 0,
  class: "kx-empty-sub"
}, qe = /* @__PURE__ */ F({
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
    return (c, d) => (r(), y("div", Ie, [
      g("div", je, [
        u(i(w), {
          icon: l.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      g("div", Be, D(l.title), 1),
      l.hint || c.$slots.hint ? (r(), y("p", Ee, [
        ge(c.$slots, "hint", {}, () => [
          U(D(l.hint), 1)
        ])
      ])) : k("", !0),
      l.cta ? (r(), _(i(C), {
        key: 1,
        label: l.cta,
        onClick: d[0] || (d[0] = (a) => c.$emit("cta"))
      }, ye({ _: 2 }, [
        l.ctaIcon ? {
          name: "icon",
          fn: p(({ class: a }) => [
            u(i(w), {
              icon: l.ctaIcon,
              class: Z(a),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : k("", !0)
    ]));
  }
}), De = /* @__PURE__ */ F({
  __name: "SettingsDirectoryActions",
  props: {
    createLabel: {}
  },
  emits: ["create", "defaults"],
  setup(l) {
    return (c, d) => (r(), y(ee, null, [
      u(i(C), {
        type: "button",
        text: "",
        "aria-label": l.createLabel,
        title: l.createLabel,
        onClick: d[0] || (d[0] = (a) => c.$emit("create"))
      }, {
        icon: p(() => [
          u(i(w), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label", "title"]),
      u(i(C), {
        type: "button",
        text: "",
        "aria-label": "Application defaults",
        title: "Application defaults",
        onClick: d[1] || (d[1] = (a) => c.$emit("defaults"))
      }, {
        icon: p(() => [
          u(i(w), {
            icon: "tabler:settings",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ], 64));
  }
}), Ne = { class: "pim-stack" }, Pe = { class: "dialog-actions" }, Ue = /* @__PURE__ */ F({
  __name: "CreateCatalog",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(l, { emit: c }) {
    const d = c, a = s(""), b = s(), t = s(!1);
    async function $() {
      const v = a.value.trim();
      if (!(!v || t.value)) {
        t.value = !0, b.value = void 0;
        try {
          const e = await X.createCatalog(v);
          a.value = "", d("close"), d("created", e.catalog_id);
        } catch (e) {
          b.value = Y(e, "Could not create the catalog.");
        } finally {
          t.value = !1;
        }
      }
    }
    return (v, e) => (r(), _(re, {
      visible: l.visible,
      label: "Create catalog",
      busy: t.value,
      onClose: e[2] || (e[2] = (T) => d("close"))
    }, {
      default: p(() => [
        g("form", {
          class: "dialog-box",
          onSubmit: be($, ["prevent"])
        }, [
          e[6] || (e[6] = g("h2", null, "Create catalog", -1)),
          e[7] || (e[7] = g("p", { class: "muted" }, "After creating it, set up the product families and fields it needs.", -1)),
          g("label", Ne, [
            e[3] || (e[3] = g("span", { class: "small muted" }, "Catalog name", -1)),
            u(i(te), {
              modelValue: a.value,
              "onUpdate:modelValue": e[0] || (e[0] = (T) => a.value = T),
              autofocus: "",
              placeholder: "For example, Outdoor equipment"
            }, null, 8, ["modelValue"])
          ]),
          b.value ? (r(), _(Q, {
            key: 0,
            error: b.value
          }, null, 8, ["error"])) : k("", !0),
          g("div", Pe, [
            u(i(C), {
              severity: "secondary",
              outlined: "",
              disabled: t.value,
              onClick: e[1] || (e[1] = (T) => d("close"))
            }, {
              default: p(() => [
                u(i(w), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                }),
                e[4] || (e[4] = U(" Cancel", -1))
              ]),
              _: 1
            }, 8, ["disabled"]),
            u(i(C), {
              type: "submit",
              disabled: t.value || !a.value.trim(),
              loading: t.value
            }, {
              default: p(() => [...e[5] || (e[5] = [
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
}), Fe = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Me = ["aria-describedby", "aria-current", "onClick"], Re = { class: "picker-name" }, ze = ["id"], Ke = {
  key: 3,
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
}, He = /* @__PURE__ */ F({
  __name: "AdminApp",
  setup(l) {
    const c = s(!1), d = s(!1), a = s(!1), b = s(!1), t = s(!1), $ = s(!1), v = s(""), e = s(""), T = s(), z = s(), M = s();
    let j = !0;
    async function K() {
      d.value = !0;
      try {
        c.value = await de("kickside-pim-catalog-settings");
      } finally {
        d.value = !1;
      }
    }
    K();
    async function ae(m) {
      a.value = !1, R(m), B.value && (V.value = "", await H()), await E();
    }
    function R(m, n = !0) {
      j = !1, $.value = n, n && T.value?.focus({ preventScroll: !0 }), e.value = v.value = m;
    }
    async function le() {
      if (b.value) return !1;
      if (!t.value) return !0;
      b.value = !0;
      try {
        return await J.confirm({ header: "Discard unsaved changes?", message: "Leaving these settings will discard unsaved catalog and plugin changes.", acceptLabel: "Discard changes", rejectLabel: "Keep editing" });
      } finally {
        b.value = !1;
      }
    }
    async function O() {
      return await le() ? (t.value = !1, v.value = "", await H(), (z.value?.querySelector('[aria-current="true"]') ?? M.value?.querySelector("input"))?.focus(), !0) : !1;
    }
    function ne() {
      j = !1, a.value = !0;
    }
    const W = ke(), f = s(), N = s();
    function ie(m) {
      t.value = m.detail.dirty;
    }
    const V = s(""), B = Ce(() => V.value.trim()), x = s(!0), h = s(), A = s(), L = ve();
    let P;
    async function E(m, n = B.value || void 0) {
      if (m != null && x.value) return;
      clearTimeout(P);
      const o = L.begin();
      x.value = !0, h.value = void 0;
      try {
        const S = await X.listCatalogs(m, n);
        if (!L.current(o)) return;
        const G = S.catalogs.filter((I) => I.access.admin);
        if (f.value = m == null ? G : [...f.value ?? [], ...G], A.value = S.after, !n && A.value == null && (N.value = f.value.length, e.value && !f.value.some((I) => I.catalog_id === e.value) && (e.value = v.value = "", t.value = !1), j)) {
          j = !1;
          const I = f.value[0];
          f.value.length === 1 && I && R(I.catalog_id, !1);
        }
      } catch (S) {
        L.current(o) && (h.value = { error: Y(S, "Could not load catalogs."), after: m, text: n });
      } finally {
        L.current(o) && (x.value = !1);
      }
    }
    function oe() {
      const m = h.value;
      m && E(m.after, m.text);
    }
    he(B, () => {
      j = !1, L.begin(), clearTimeout(P), f.value = void 0, A.value = void 0, x.value = !0, h.value = void 0, P = setTimeout(() => {
        E();
      }, 250);
    });
    const se = xe("component.meta.changed", (m) => {
      const n = Le(m);
      if (!n) return;
      const o = f.value?.find((S) => S.catalog_id === n.component_id);
      o && (typeof n.meta.title == "string" && (o.title = n.meta.title.trim() || "Catalog"), n.deleted.includes("title") && (o.title = "Catalog"));
    });
    return ue(E), _e(() => {
      se(), clearTimeout(P), L.begin();
    }), (m, n) => (r(), y("main", {
      class: Z(["kx-shell kx-settings-shell pim-system", { "pim-catalog-selected": v.value && c.value }])
    }, [
      !v.value || !c.value ? (r(), _(ce, {
        key: 0,
        settings: "",
        class: "pim-catalog-picker",
        title: "Catalogs",
        count: N.value ?? f.value?.length
      }, {
        actions: p(() => [
          u(De, {
            "create-label": "Create catalog",
            onCreate: ne,
            onDefaults: n[0] || (n[0] = (o) => i(J).navigate("/system/settings"))
          })
        ]),
        toolbar: p(() => [
          g("div", {
            ref_key: "searchField",
            ref: M,
            class: "picker-search"
          }, [
            u(i(we), null, {
              default: p(() => [
                u(i(Te), null, {
                  default: p(() => [
                    u(i(w), {
                      icon: "tabler:search",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }),
                u(i(te), {
                  type: "search",
                  modelValue: V.value,
                  "onUpdate:modelValue": n[1] || (n[1] = (o) => V.value = o),
                  class: "picker-search-input",
                  "aria-label": "Search catalogs",
                  placeholder: "Search catalogs…"
                }, null, 8, ["modelValue"]),
                V.value ? (r(), _(i(C), {
                  key: 0,
                  type: "button",
                  text: "",
                  severity: "secondary",
                  class: "picker-search-clear",
                  "aria-label": "Clear search",
                  onClick: n[2] || (n[2] = (o) => {
                    V.value = "", M.value?.querySelector("input")?.focus();
                  })
                }, {
                  icon: p(() => [
                    u(i(w), {
                      icon: "tabler:x",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                })) : k("", !0)
              ]),
              _: 1
            })
          ], 512)
        ]),
        default: p(() => [
          h.value ? (r(), _(Q, {
            key: 0,
            error: h.value.error
          }, {
            default: p(() => [
              u(i(C), {
                label: "Retry",
                type: "button",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: oe
              })
            ]),
            _: 1
          }, 8, ["error"])) : x.value ? (r(), y("p", Fe, D(B.value ? "Searching catalogs…" : "Loading catalogs…"), 1)) : k("", !0),
          f.value?.length ? (r(), y("ul", {
            key: 2,
            ref_key: "list",
            ref: z,
            class: "picker-list"
          }, [
            (r(!0), y(ee, null, $e(f.value, (o) => (r(), y("li", {
              key: o.catalog_id
            }, [
              g("button", {
                type: "button",
                class: "picker-row pim-catalog-row",
                "aria-describedby": i(W) + "-" + o.catalog_id,
                "aria-current": e.value === o.catalog_id ? "true" : void 0,
                onClick: (S) => R(o.catalog_id)
              }, [
                g("span", Re, D(o.title || "Untitled catalog"), 1),
                g("span", {
                  id: i(W) + "-" + o.catalog_id,
                  class: "picker-row-description"
                }, D(typeof o.product_count == "number" ? o.product_count + (o.product_count === 1 ? " product" : " products") : "Product count unavailable"), 9, ze)
              ], 8, Me)
            ]))), 128))
          ], 512)) : k("", !0),
          !h.value && !x.value && B.value && !f.value?.length && A.value == null ? (r(), y("p", Ke, "No catalogs match. Try another name.")) : k("", !0),
          A.value != null ? (r(), _(i(C), {
            key: 4,
            label: "Load more catalogs",
            type: "button",
            disabled: x.value || !!h.value,
            onClick: n[3] || (n[3] = (o) => E(A.value)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, null, 8, ["disabled"])) : k("", !0)
        ]),
        _: 1
      }, 8, ["count"])) : k("", !0),
      g("section", {
        ref_key: "detail",
        ref: T,
        class: "pim-system-main",
        "aria-label": "Catalog settings detail",
        tabindex: "-1"
      }, [
        v.value && c.value ? (r(), y("kickside-pim-catalog-settings", {
          key: v.value,
          "catalog-id": v.value,
          embedded: "true",
          "focus-back": String($.value),
          onOpenCatalogPicker: O,
          onDirtyChanged: ie
        }, null, 40, Oe)) : v.value && d.value ? (r(), y("p", We, "Loading catalog settings…")) : v.value ? (r(), y("p", Ge, [
          n[5] || (n[5] = U("Catalog settings are unavailable.", -1)),
          u(i(C), {
            label: "Back to catalogs",
            severity: "secondary",
            text: "",
            onClick: O
          }),
          u(i(C), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            onClick: K
          })
        ])) : f.value && !h.value ? (r(), _(qe, {
          key: 3,
          icon: "tabler:adjustments",
          title: N.value === 0 ? "No catalogs yet" : "Choose a catalog",
          hint: N.value === 0 ? "Create a catalog to set up families, fields, channels and access." : "Select a catalog to manage its families, fields, channels and access."
        }, null, 8, ["title", "hint"])) : k("", !0)
      ], 512),
      u(Ue, {
        visible: a.value,
        onClose: n[4] || (n[4] = (o) => a.value = !1),
        onCreated: ae
      }, null, 8, ["visible"])
    ], 2));
  }
}), Je = { type: "object", properties: {} };
class Qe extends me {
  static get wippyConfig() {
    return { propsSchema: Je, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"], inlineCss: fe };
  }
  static get vueConfig() {
    return { rootComponent: He, plugins: [pe] };
  }
}
Se(import.meta.url, Qe);
