import { p as z, e as q, u as I, _ as K, A as G, r as H, W as J, s as O, P as Q } from "./styles-B-LFoGlX.js";
import { defineComponent as P, ref as c, watch as F, onMounted as X, onBeforeUnmount as Y, openBlock as s, createElementBlock as _, renderSlot as Z, nextTick as ee, createBlock as E, withCtx as h, createElementVNode as m, withModifiers as te, createVNode as b, unref as d, createTextVNode as x, toDisplayString as $, createCommentVNode as S, computed as ae, onUnmounted as le, Fragment as oe, renderList as ne, normalizeClass as ie } from "vue";
import { on as se, host as re, define as ue } from "@wippy-fe/proxy";
import D from "primevue/button";
import R from "primevue/inputtext";
import de from "primevue/tag";
import L from "primevue/message";
import { Icon as U } from "@iconify/vue";
function B(o) {
  return !!o && typeof o == "object" && !Array.isArray(o);
}
function ce(o, g) {
  return o;
}
function me(o, g, r) {
  const l = B(o) ? o : {}, n = [
    l,
    B(l.data) ? l.data : null,
    B(l.payload) ? l.payload : null,
    B(l.detail) ? l.detail : null
  ].filter(Boolean);
  for (const e of n) {
    if (e.event !== "component.meta.changed" && e.event !== "component.deleting" && e.event !== "component.deleted") continue;
    const p = String(e.component_id || ""), v = String(l.topic || e.topic || "");
    if (!p && (!v.startsWith("component.") || v === "component.")) continue;
    const t = p || g || v.slice(10);
    return e.event === "component.deleting" && typeof e.deletion_job_id == "string" && e.deletion_job_id ? { event: e.event, component_id: t, deletion_job_id: e.deletion_job_id } : e.event !== "component.meta.changed" ? { event: e.event, component_id: t } : {
      event: "component.meta.changed",
      component_id: t,
      meta: ce(B(e.meta) ? e.meta : {}),
      deleted: Array.isArray(e.deleted) ? e.deleted.map(String) : []
    };
  }
  return null;
}
function ve(o, g, r) {
  const l = me(o, g);
  return l?.event === "component.meta.changed" ? l : null;
}
const ge = ["aria-label", "aria-busy"], pe = /* @__PURE__ */ P({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    label: {},
    busy: { type: Boolean }
  },
  emits: ["close"],
  setup(o, { emit: g }) {
    const r = o, l = g, n = c(null);
    let e = null;
    async function p() {
      await ee();
      const t = n.value;
      t && (r.visible && !t.open ? (e = t.getRootNode().activeElement, t.showModal()) : !r.visible && t.open && (t.close(), e?.focus()));
    }
    function v(t) {
      t.preventDefault(), r.busy || l("close");
    }
    return F(() => r.visible, p), X(p), Y(() => {
      n.value?.open && n.value.close(), e?.focus();
    }), (t, f) => (s(), _("dialog", {
      ref_key: "dialog",
      ref: n,
      class: "native-dialog",
      "aria-label": o.label,
      "aria-modal": "true",
      "aria-busy": o.busy || void 0,
      onCancel: v,
      onClose: f[0] || (f[0] = () => {
        o.visible && !o.busy && l("close");
      })
    }, [
      Z(t.$slots, "default")
    ], 40, ge));
  }
}), fe = { class: "pim-stack" }, ye = { class: "dialog-actions" }, be = /* @__PURE__ */ P({
  __name: "CreateCatalog",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(o, { emit: g }) {
    const r = g, l = c(""), n = c(""), e = c(!1);
    async function p() {
      const v = l.value.trim();
      if (!(!v || e.value)) {
        e.value = !0, n.value = "";
        try {
          const t = await z.createCatalog(v);
          l.value = "", r("close"), r("created", t.catalog_id);
        } catch (t) {
          n.value = t instanceof Error ? t.message : "Could not create the catalog.";
        } finally {
          e.value = !1;
        }
      }
    }
    return (v, t) => (s(), E(pe, {
      visible: o.visible,
      label: "New catalog",
      busy: e.value,
      onClose: t[2] || (t[2] = (f) => r("close"))
    }, {
      default: h(() => [
        m("form", {
          class: "dialog-box",
          onSubmit: te(p, ["prevent"])
        }, [
          t[6] || (t[6] = m("h2", null, "New catalog", -1)),
          m("label", fe, [
            t[3] || (t[3] = m("span", { class: "small muted" }, "Title", -1)),
            b(d(R), {
              modelValue: l.value,
              "onUpdate:modelValue": t[0] || (t[0] = (f) => l.value = f),
              autofocus: "",
              placeholder: "Catalog title"
            }, null, 8, ["modelValue"])
          ]),
          n.value ? (s(), E(d(L), {
            key: 0,
            severity: "error"
          }, {
            default: h(() => [
              x($(n.value), 1)
            ]),
            _: 1
          })) : S("", !0),
          m("div", ye, [
            b(d(D), {
              severity: "secondary",
              outlined: "",
              disabled: e.value,
              onClick: t[1] || (t[1] = (f) => r("close"))
            }, {
              default: h(() => [
                b(d(U), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                }),
                t[4] || (t[4] = x(" Cancel", -1))
              ]),
              _: 1
            }, 8, ["disabled"]),
            b(d(D), {
              type: "submit",
              disabled: e.value || !l.value.trim(),
              loading: e.value
            }, {
              default: h(() => [...t[5] || (t[5] = [
                x("Create", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "loading"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
}), Ce = { class: "pim-system" }, _e = {
  class: "pim-rail",
  "aria-label": "Catalogs"
}, he = { class: "pim-railhead" }, ke = { class: "pim-rail-list" }, xe = { key: 0 }, we = {
  key: 1,
  class: "small muted",
  role: "status"
}, Te = {
  key: 2,
  class: "small muted",
  role: "status"
}, Ve = { class: "pim-system-main" }, $e = { key: 0 }, Se = ["catalog-id"], Ee = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, Ae = {
  key: 3,
  class: "kx-empty"
}, Be = /* @__PURE__ */ P({
  __name: "AdminApp",
  setup(o) {
    const g = c(!1), r = c(!1);
    q("kickside-pim-catalog-settings").then((u) => {
      g.value = u;
    });
    async function l(u) {
      await j(), await v(u);
    }
    const n = c([]), e = c(""), p = c(!1);
    async function v(u) {
      u !== e.value && (p.value && !await re.confirm({ header: "Discard unsaved changes?", message: "Switching catalogs will discard unsaved schema and plugin changes.", acceptLabel: "Discard and switch", rejectLabel: "Cancel" }) || (p.value = !1, e.value = u));
    }
    function t(u) {
      p.value = u.detail.dirty;
    }
    const f = c(""), w = ae(() => f.value.trim()), k = c(!0), y = c(), T = c(), V = H();
    let N;
    async function j(u) {
      if (u != null && k.value) return;
      clearTimeout(N);
      const a = V.begin(), i = w.value || void 0;
      k.value = !0, y.value = void 0;
      try {
        const C = await z.listCatalogs(u, i);
        if (!V.current(a)) return;
        const A = C.catalogs.filter((M) => M.access.admin);
        n.value = u == null ? A : [...n.value, ...A], T.value = C.after, !i && T.value == null && e.value && !n.value.some((M) => M.catalog_id === e.value) && (e.value = "");
      } catch (C) {
        if (!V.current(a)) return;
        const A = C instanceof G ? C.details?.code : void 0;
        y.value = { message: C instanceof Error ? C.message : "Could not load catalogs.", code: typeof A == "string" ? A : void 0 };
      } finally {
        V.current(a) && (k.value = !1);
      }
    }
    F(w, () => {
      V.begin(), clearTimeout(N), n.value = [], T.value = void 0, k.value = !0, y.value = void 0, N = setTimeout(() => {
        j();
      }, 250);
    });
    const W = se("component.meta.changed", (u) => {
      const a = ve(u);
      if (!a) return;
      const i = n.value.find((C) => C.catalog_id === a.component_id);
      i && (typeof a.meta.title == "string" && (i.title = a.meta.title.trim() || "Catalog"), a.deleted.includes("title") && (i.title = "Catalog"));
    });
    return I(j), le(() => {
      W(), clearTimeout(N), V.begin();
    }), (u, a) => (s(), _("div", Ce, [
      m("aside", _e, [
        m("div", he, [
          m("h2", null, [
            a[4] || (a[4] = x("Catalogs ", -1)),
            b(d(de), {
              severity: "secondary",
              value: String(n.value.length)
            }, null, 8, ["value"])
          ]),
          b(d(D), {
            text: "",
            size: "small",
            "aria-label": "Create catalog",
            onClick: a[0] || (a[0] = (i) => r.value = !0)
          }, {
            default: h(() => [
              b(d(U), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ]),
        b(d(R), {
          modelValue: f.value,
          "onUpdate:modelValue": a[1] || (a[1] = (i) => f.value = i),
          class: "pim-rail-search",
          type: "search",
          "aria-label": "Find a catalog",
          placeholder: "Find a catalog…"
        }, null, 8, ["modelValue"]),
        m("div", ke, [
          (s(!0), _(oe, null, ne(n.value, (i) => (s(), E(K, {
            key: i.catalog_id,
            class: ie(["pim-rail-row", { active: e.value === i.catalog_id }]),
            "aria-pressed": e.value === i.catalog_id,
            onClick: (C) => v(i.catalog_id)
          }, {
            default: h(() => [
              m("span", null, $(i.title || "Untitled catalog"), 1)
            ]),
            _: 2
          }, 1032, ["class", "aria-pressed", "onClick"]))), 128))
        ]),
        w.value && y.value ? (s(), E(d(L), {
          key: 0,
          class: "pim-rail-error",
          severity: "error",
          role: "alert"
        }, {
          default: h(() => [
            x($(y.value.message) + " ", 1),
            y.value.code ? (s(), _("code", xe, $(y.value.code), 1)) : S("", !0)
          ]),
          _: 1
        })) : w.value && k.value ? (s(), _("div", we, "Searching catalogs…")) : w.value && n.value.length === 0 && T.value == null ? (s(), _("div", Te, "No matching catalogs.")) : S("", !0),
        T.value != null ? (s(), E(d(D), {
          key: 3,
          type: "button",
          disabled: k.value,
          onClick: a[2] || (a[2] = (i) => j(T.value)),
          severity: "secondary",
          outlined: "",
          size: "small"
        }, {
          default: h(() => [
            b(d(U), {
              icon: "tabler:chevron-right",
              "aria-hidden": "true"
            }),
            a[5] || (a[5] = x(" Load more catalogs", -1))
          ]),
          _: 1
        }, 8, ["disabled"])) : S("", !0)
      ]),
      m("main", Ve, [
        y.value && !w.value ? (s(), E(d(L), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: h(() => [
            x($(y.value.message) + " ", 1),
            y.value.code ? (s(), _("code", $e, $(y.value.code), 1)) : S("", !0)
          ]),
          _: 1
        })) : S("", !0),
        e.value && g.value ? (s(), _("kickside-pim-catalog-settings", {
          key: e.value,
          "catalog-id": e.value,
          embedded: "true",
          onDirtyChanged: t
        }, null, 40, Se)) : k.value ? (s(), _("div", Ee, "Loading catalogs…")) : (s(), _("div", Ae, [
          b(d(U), {
            icon: "tabler:settings",
            class: "kx-empty-ico"
          }),
          a[6] || (a[6] = m("h3", { class: "kx-empty-title" }, "Catalog settings", -1)),
          a[7] || (a[7] = m("p", { class: "kx-empty-sub" }, "Select a catalog to edit its schema, plugins and policy.", -1))
        ]))
      ]),
      b(be, {
        visible: r.value,
        onClose: a[3] || (a[3] = (i) => r.value = !1),
        onCreated: l
      }, null, 8, ["visible"])
    ]));
  }
}), Ne = { type: "object", properties: {} };
class je extends J {
  static get wippyConfig() {
    return { propsSchema: Ne, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"], inlineCss: O };
  }
  static get vueConfig() {
    return { rootComponent: Be, plugins: [Q] };
  }
}
ue(import.meta.url, je);
