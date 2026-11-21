import { _ as se, a as Q, p as X, b as Y, u as re, c as ue, e as ce, r as de, W as ve, s as me, P as pe } from "./styles-BuUaWhkj.js";
import { defineComponent as R, openBlock as d, createElementBlock as y, Fragment as Z, createVNode as s, unref as o, withCtx as g, ref as i, createBlock as L, createElementVNode as f, withModifiers as fe, createCommentVNode as _, createTextVNode as M, useId as ge, computed as ye, watch as be, onUnmounted as ke, normalizeClass as Ce, toDisplayString as I, renderList as _e, nextTick as H } from "vue";
import { on as he, host as J, define as xe } from "@wippy-fe/proxy";
import C from "primevue/button";
import Se from "primevue/iconfield";
import $e from "primevue/inputicon";
import ee from "primevue/inputtext";
import { Icon as j } from "@iconify/vue";
function N(c) {
  return !!c && typeof c == "object" && !Array.isArray(c);
}
function we(c, m) {
  return c;
}
function Te(c, m, v) {
  const l = N(c) ? c : {}, b = [
    l,
    N(l.data) ? l.data : null,
    N(l.payload) ? l.payload : null,
    N(l.detail) ? l.detail : null
  ].filter(Boolean);
  for (const t of b) {
    if (t.event !== "component.meta.changed" && t.event !== "component.deleting" && t.event !== "component.deleted") continue;
    const h = String(t.component_id || ""), r = String(l.topic || t.topic || "");
    if (!h && (!r.startsWith("component.") || r === "component.")) continue;
    const e = h || m || r.slice(10);
    return t.event === "component.deleting" && typeof t.deletion_job_id == "string" && t.deletion_job_id ? { event: t.event, component_id: e, deletion_job_id: t.deletion_job_id } : t.event !== "component.meta.changed" ? { event: t.event, component_id: e } : {
      event: "component.meta.changed",
      component_id: e,
      meta: we(N(t.meta) ? t.meta : {}),
      deleted: Array.isArray(t.deleted) ? t.deleted.map(String) : []
    };
  }
  return null;
}
function Ve(c, m, v) {
  const l = Te(c, m);
  return l?.event === "component.meta.changed" ? l : null;
}
const Ae = /* @__PURE__ */ R({
  __name: "SettingsDirectoryActions",
  props: {
    createLabel: {}
  },
  emits: ["create", "defaults"],
  setup(c) {
    return (m, v) => (d(), y(Z, null, [
      s(o(C), {
        type: "button",
        text: "",
        "aria-label": c.createLabel,
        title: c.createLabel,
        onClick: v[0] || (v[0] = (l) => m.$emit("create"))
      }, {
        icon: g(() => [
          s(o(j), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label", "title"]),
      s(o(C), {
        type: "button",
        text: "",
        "aria-label": "Application defaults",
        title: "Application defaults",
        onClick: v[1] || (v[1] = (l) => m.$emit("defaults"))
      }, {
        icon: g(() => [
          s(o(j), {
            icon: "tabler:settings",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ], 64));
  }
}), Le = { class: "pim-stack" }, je = { class: "dialog-actions" }, Be = /* @__PURE__ */ R({
  __name: "CreateCatalog",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(c, { emit: m }) {
    const v = m, l = i(""), b = i(), t = i(!1);
    async function h() {
      const r = l.value.trim();
      if (!(!r || t.value)) {
        t.value = !0, b.value = void 0;
        try {
          const e = await X.createCatalog(r);
          l.value = "", v("close"), v("created", e.catalog_id);
        } catch (e) {
          b.value = Y(e, "Could not create the catalog.");
        } finally {
          t.value = !1;
        }
      }
    }
    return (r, e) => (d(), L(se, {
      visible: c.visible,
      label: "Create catalog",
      busy: t.value,
      onClose: e[2] || (e[2] = ($) => v("close"))
    }, {
      default: g(() => [
        f("form", {
          class: "dialog-box",
          onSubmit: fe(h, ["prevent"])
        }, [
          e[6] || (e[6] = f("h2", null, "Create catalog", -1)),
          e[7] || (e[7] = f("p", { class: "muted" }, "After creating it, set up the product families and fields it needs.", -1)),
          f("label", Le, [
            e[3] || (e[3] = f("span", { class: "small muted" }, "Catalog name", -1)),
            s(o(ee), {
              modelValue: l.value,
              "onUpdate:modelValue": e[0] || (e[0] = ($) => l.value = $),
              autofocus: "",
              placeholder: "For example, Outdoor equipment"
            }, null, 8, ["modelValue"])
          ]),
          b.value ? (d(), L(Q, {
            key: 0,
            error: b.value
          }, null, 8, ["error"])) : _("", !0),
          f("div", je, [
            s(o(C), {
              severity: "secondary",
              outlined: "",
              disabled: t.value,
              onClick: e[1] || (e[1] = ($) => v("close"))
            }, {
              default: g(() => [
                s(o(j), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                }),
                e[4] || (e[4] = M(" Cancel", -1))
              ]),
              _: 1
            }, 8, ["disabled"]),
            s(o(C), {
              type: "submit",
              disabled: t.value || !l.value.trim(),
              loading: t.value
            }, {
              default: g(() => [...e[5] || (e[5] = [
                M("Create catalog", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "loading"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
}), qe = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, De = ["aria-describedby", "aria-current", "onClick"], Ee = { class: "picker-name" }, Ie = ["id"], Ne = {
  key: 3,
  class: "picker-message",
  role: "status"
}, Pe = ["catalog-id", "focus-back", "directory-count"], Ue = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Fe = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Me = {
  key: 3,
  class: "kx-empty"
}, Re = { class: "kx-empty-title" }, ze = { class: "kx-empty-sub" }, Ke = /* @__PURE__ */ R({
  __name: "AdminApp",
  setup(c) {
    const m = i(!1), v = i(!1), l = i(!1), b = i(!1), t = i(!1), h = i(!1), r = i(""), e = i(""), $ = i(), z = i(), U = i();
    let B = !0;
    async function K() {
      v.value = !0;
      try {
        m.value = await ce("kickside-pim-catalog-settings");
      } finally {
        v.value = !1;
      }
    }
    K();
    async function te(u) {
      l.value = !1, F(u), D.value && (w.value = "", await H()), await E();
    }
    function F(u, a = !0) {
      B = !1, h.value = a, a && $.value?.focus({ preventScroll: !0 }), e.value = r.value = u;
    }
    async function ae() {
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
      return await ae() ? (t.value = !1, r.value = "", await H(), (z.value?.querySelector('[aria-current="true"]') ?? U.value?.querySelector("input"))?.focus(), !0) : !1;
    }
    function le() {
      B = !1, l.value = !0;
    }
    const W = ge(), p = i(), q = i();
    function ne(u) {
      t.value = u.detail.dirty;
    }
    const w = i(""), D = ye(() => w.value.trim()), x = i(!0), k = i(), T = i(), V = de();
    let P;
    async function E(u, a = D.value || void 0) {
      if (u != null && x.value) return;
      clearTimeout(P);
      const n = V.begin();
      x.value = !0, k.value = void 0;
      try {
        const S = await X.listCatalogs(u, a);
        if (!V.current(n)) return;
        const G = S.catalogs.filter((A) => A.access.admin);
        if (p.value = u == null ? G : [...p.value ?? [], ...G], T.value = S.after, !a && T.value == null && (q.value = p.value.length, e.value && !p.value.some((A) => A.catalog_id === e.value) && (e.value = r.value = "", t.value = !1), B)) {
          B = !1;
          const A = p.value[0];
          p.value.length === 1 && A && F(A.catalog_id, !1);
        }
      } catch (S) {
        V.current(n) && (k.value = { error: Y(S, "Could not load catalogs."), after: u, text: a });
      } finally {
        V.current(n) && (x.value = !1);
      }
    }
    function oe() {
      const u = k.value;
      u && E(u.after, u.text);
    }
    be(D, () => {
      B = !1, V.begin(), clearTimeout(P), p.value = void 0, T.value = void 0, x.value = !0, k.value = void 0, P = setTimeout(() => {
        E();
      }, 250);
    });
    const ie = he("component.meta.changed", (u) => {
      const a = Ve(u);
      if (!a) return;
      const n = p.value?.find((S) => S.catalog_id === a.component_id);
      n && (typeof a.meta.title == "string" && (n.title = a.meta.title.trim() || "Catalog"), a.deleted.includes("title") && (n.title = "Catalog"));
    });
    return re(E), ke(() => {
      ie(), clearTimeout(P), V.begin();
    }), (u, a) => (d(), y("main", {
      class: Ce(["kx-shell kx-settings-shell pim-system", { "pim-catalog-selected": r.value && m.value }])
    }, [
      !r.value || !m.value ? (d(), L(ue, {
        key: 0,
        settings: "",
        class: "pim-catalog-picker",
        title: "Catalogs",
        count: q.value ?? p.value?.length
      }, {
        actions: g(() => [
          s(Ae, {
            "create-label": "Create catalog",
            onCreate: le,
            onDefaults: a[0] || (a[0] = (n) => o(J).navigate("/system/settings"))
          })
        ]),
        toolbar: g(() => [
          f("div", {
            ref_key: "searchField",
            ref: U,
            class: "picker-search"
          }, [
            s(o(Se), null, {
              default: g(() => [
                s(o($e), null, {
                  default: g(() => [
                    s(o(j), {
                      icon: "tabler:search",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }),
                s(o(ee), {
                  type: "search",
                  modelValue: w.value,
                  "onUpdate:modelValue": a[1] || (a[1] = (n) => w.value = n),
                  class: "picker-search-input",
                  "aria-label": "Search catalogs",
                  placeholder: "Search catalogs…"
                }, null, 8, ["modelValue"]),
                w.value ? (d(), L(o(C), {
                  key: 0,
                  type: "button",
                  text: "",
                  severity: "secondary",
                  class: "picker-search-clear",
                  "aria-label": "Clear search",
                  onClick: a[2] || (a[2] = (n) => {
                    w.value = "", U.value?.querySelector("input")?.focus();
                  })
                }, {
                  icon: g(() => [
                    s(o(j), {
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
        default: g(() => [
          k.value ? (d(), L(Q, {
            key: 0,
            error: k.value.error
          }, {
            default: g(() => [
              s(o(C), {
                label: "Retry",
                type: "button",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: oe
              })
            ]),
            _: 1
          }, 8, ["error"])) : x.value ? (d(), y("p", qe, I(D.value ? "Searching catalogs…" : "Loading catalogs…"), 1)) : _("", !0),
          p.value?.length ? (d(), y("ul", {
            key: 2,
            ref_key: "list",
            ref: z,
            class: "picker-list"
          }, [
            (d(!0), y(Z, null, _e(p.value, (n) => (d(), y("li", {
              key: n.catalog_id
            }, [
              f("button", {
                type: "button",
                class: "picker-row pim-catalog-row",
                "aria-describedby": o(W) + "-" + n.catalog_id,
                "aria-current": e.value === n.catalog_id ? "true" : void 0,
                onClick: (S) => F(n.catalog_id)
              }, [
                f("span", Ee, I(n.title || "Untitled catalog"), 1),
                f("span", {
                  id: o(W) + "-" + n.catalog_id,
                  class: "picker-row-description"
                }, I(typeof n.product_count == "number" ? n.product_count + (n.product_count === 1 ? " product" : " products") : "Product count unavailable"), 9, Ie)
              ], 8, De)
            ]))), 128))
          ], 512)) : _("", !0),
          !k.value && !x.value && D.value && !p.value?.length && T.value == null ? (d(), y("p", Ne, "No catalogs match. Try another name.")) : _("", !0),
          T.value != null ? (d(), L(o(C), {
            key: 4,
            label: "Load more catalogs",
            type: "button",
            disabled: x.value || !!k.value,
            onClick: a[3] || (a[3] = (n) => E(T.value)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, null, 8, ["disabled"])) : _("", !0)
        ]),
        _: 1
      }, 8, ["count"])) : _("", !0),
      f("section", {
        ref_key: "detail",
        ref: $,
        class: "pim-system-main",
        "aria-label": "Catalog settings detail",
        tabindex: "-1"
      }, [
        r.value && m.value ? (d(), y("kickside-pim-catalog-settings", {
          key: r.value,
          "catalog-id": r.value,
          embedded: "true",
          "focus-back": String(h.value),
          "directory-count": q.value ?? p.value?.length,
          onOpenCatalogPicker: O,
          onDirtyChanged: ne
        }, null, 40, Pe)) : r.value && v.value ? (d(), y("p", Ue, "Loading catalog settings…")) : r.value ? (d(), y("p", Fe, [
          a[5] || (a[5] = M("Catalog settings are unavailable.", -1)),
          s(o(C), {
            label: "Back to catalogs",
            severity: "secondary",
            text: "",
            onClick: O
          }),
          s(o(C), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            onClick: K
          })
        ])) : p.value && !k.value ? (d(), y("div", Me, [
          s(o(j), {
            class: "kx-empty-ico",
            icon: "tabler:adjustments",
            "aria-hidden": "true"
          }),
          f("h2", Re, I(q.value === 0 ? "No catalogs yet" : "Choose a catalog"), 1),
          f("p", ze, I(q.value === 0 ? "Create a catalog to set up families, fields, channels and access." : "Select a catalog to manage its families, fields, channels and access."), 1)
        ])) : _("", !0)
      ], 512),
      s(Be, {
        visible: l.value,
        onClose: a[4] || (a[4] = (n) => l.value = !1),
        onCreated: te
      }, null, 8, ["visible"])
    ], 2));
  }
}), Oe = { type: "object", properties: {} };
class We extends ve {
  static get wippyConfig() {
    return { propsSchema: Oe, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"], inlineCss: me };
  }
  static get vueConfig() {
    return { rootComponent: Ke, plugins: [pe] };
  }
}
xe(import.meta.url, We);
