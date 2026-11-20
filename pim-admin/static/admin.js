import { _ as D, p as R, a as P, e as I, u as K, b as G, r as H, W as J, s as O, P as Q } from "./styles-DXPC0Ax5.js";
import { defineComponent as z, ref as d, watch as q, onMounted as X, onBeforeUnmount as Y, openBlock as u, createElementBlock as _, renderSlot as Z, nextTick as ee, createBlock as w, withCtx as C, createElementVNode as v, withModifiers as te, createVNode as p, unref as c, createCommentVNode as $, createTextVNode as S, computed as ae, onUnmounted as le, Fragment as oe, renderList as ne, normalizeClass as ie, toDisplayString as se } from "vue";
import { on as re, host as ue, define as de } from "@wippy-fe/proxy";
import B from "primevue/button";
import F from "primevue/inputtext";
import ce from "primevue/tag";
import { Icon as A } from "@iconify/vue";
function E(n) {
  return !!n && typeof n == "object" && !Array.isArray(n);
}
function ve(n, g) {
  return n;
}
function me(n, g, r) {
  const l = E(n) ? n : {}, o = [
    l,
    E(l.data) ? l.data : null,
    E(l.payload) ? l.payload : null,
    E(l.detail) ? l.detail : null
  ].filter(Boolean);
  for (const e of o) {
    if (e.event !== "component.meta.changed" && e.event !== "component.deleting" && e.event !== "component.deleted") continue;
    const f = String(e.component_id || ""), m = String(l.topic || e.topic || "");
    if (!f && (!m.startsWith("component.") || m === "component.")) continue;
    const t = f || g || m.slice(10);
    return e.event === "component.deleting" && typeof e.deletion_job_id == "string" && e.deletion_job_id ? { event: e.event, component_id: t, deletion_job_id: e.deletion_job_id } : e.event !== "component.meta.changed" ? { event: e.event, component_id: t } : {
      event: "component.meta.changed",
      component_id: t,
      meta: ve(E(e.meta) ? e.meta : {}),
      deleted: Array.isArray(e.deleted) ? e.deleted.map(String) : []
    };
  }
  return null;
}
function pe(n, g, r) {
  const l = me(n, g);
  return l?.event === "component.meta.changed" ? l : null;
}
const ge = ["aria-label", "aria-busy"], fe = /* @__PURE__ */ z({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    label: {},
    busy: { type: Boolean }
  },
  emits: ["close"],
  setup(n, { emit: g }) {
    const r = n, l = g, o = d(null);
    let e = null;
    async function f() {
      await ee();
      const t = o.value;
      t && (r.visible && !t.open ? (e = t.getRootNode().activeElement, t.showModal()) : !r.visible && t.open && (t.close(), e?.focus()));
    }
    function m(t) {
      t.preventDefault(), r.busy || l("close");
    }
    return q(() => r.visible, f), X(f), Y(() => {
      o.value?.open && o.value.close(), e?.focus();
    }), (t, y) => (u(), _("dialog", {
      ref_key: "dialog",
      ref: o,
      class: "native-dialog",
      "aria-label": n.label,
      "aria-modal": "true",
      "aria-busy": n.busy || void 0,
      onCancel: m,
      onClose: y[0] || (y[0] = () => {
        n.visible && !n.busy && l("close");
      })
    }, [
      Z(t.$slots, "default")
    ], 40, ge));
  }
}), ye = { class: "pim-stack" }, be = { class: "dialog-actions" }, Ce = /* @__PURE__ */ z({
  __name: "CreateCatalog",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(n, { emit: g }) {
    const r = g, l = d(""), o = d(), e = d(!1);
    async function f() {
      const m = l.value.trim();
      if (!(!m || e.value)) {
        e.value = !0, o.value = void 0;
        try {
          const t = await R.createCatalog(m);
          l.value = "", r("close"), r("created", t.catalog_id);
        } catch (t) {
          o.value = P(t, "Could not create the catalog.");
        } finally {
          e.value = !1;
        }
      }
    }
    return (m, t) => (u(), w(fe, {
      visible: n.visible,
      label: "New catalog",
      busy: e.value,
      onClose: t[2] || (t[2] = (y) => r("close"))
    }, {
      default: C(() => [
        v("form", {
          class: "dialog-box",
          onSubmit: te(f, ["prevent"])
        }, [
          t[6] || (t[6] = v("h2", null, "New catalog", -1)),
          v("label", ye, [
            t[3] || (t[3] = v("span", { class: "small muted" }, "Title", -1)),
            p(c(F), {
              modelValue: l.value,
              "onUpdate:modelValue": t[0] || (t[0] = (y) => l.value = y),
              autofocus: "",
              placeholder: "Catalog title"
            }, null, 8, ["modelValue"])
          ]),
          o.value ? (u(), w(D, {
            key: 0,
            error: o.value
          }, null, 8, ["error"])) : $("", !0),
          v("div", be, [
            p(c(B), {
              severity: "secondary",
              outlined: "",
              disabled: e.value,
              onClick: t[1] || (t[1] = (y) => r("close"))
            }, {
              default: C(() => [
                p(c(A), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                }),
                t[4] || (t[4] = S(" Cancel", -1))
              ]),
              _: 1
            }, 8, ["disabled"]),
            p(c(B), {
              type: "submit",
              disabled: e.value || !l.value.trim(),
              loading: e.value
            }, {
              default: C(() => [...t[5] || (t[5] = [
                S("Create", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "loading"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
}), _e = { class: "pim-system" }, ke = {
  class: "pim-rail",
  "aria-label": "Catalogs"
}, he = { class: "pim-railhead" }, we = { class: "pim-rail-list" }, xe = {
  key: 1,
  class: "small muted",
  role: "status"
}, Te = {
  key: 2,
  class: "small muted",
  role: "status"
}, Ve = { class: "pim-system-main" }, $e = ["catalog-id"], Se = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, Be = {
  key: 3,
  class: "kx-empty"
}, Ne = /* @__PURE__ */ z({
  __name: "AdminApp",
  setup(n) {
    const g = d(!1), r = d(!1);
    I("kickside-pim-catalog-settings").then((i) => {
      g.value = i;
    });
    async function l(i) {
      await N(), await m(i);
    }
    const o = d(), e = d(""), f = d(!1);
    async function m(i) {
      i !== e.value && (f.value && !await ue.confirm({ header: "Discard unsaved changes?", message: "Switching catalogs will discard unsaved schema and plugin changes.", acceptLabel: "Discard and switch", rejectLabel: "Cancel" }) || (f.value = !1, e.value = i));
    }
    function t(i) {
      f.value = i.detail.dirty;
    }
    const y = d(""), x = ae(() => y.value.trim()), k = d(!0), b = d(), T = d(), V = H();
    let j;
    async function N(i, a = x.value || void 0) {
      if (i != null && k.value) return;
      clearTimeout(j);
      const s = V.begin();
      k.value = !0, b.value = void 0;
      try {
        const h = await R.listCatalogs(i, a);
        if (!V.current(s)) return;
        const M = h.catalogs.filter((U) => U.access.admin);
        o.value = i == null ? M : [...o.value ?? [], ...M], T.value = h.after, !a && T.value == null && e.value && !o.value.some((U) => U.catalog_id === e.value) && (e.value = "");
      } catch (h) {
        V.current(s) && (b.value = { error: P(h, "Could not load catalogs."), after: i, text: a });
      } finally {
        V.current(s) && (k.value = !1);
      }
    }
    function L() {
      const i = b.value;
      i && N(i.after, i.text);
    }
    q(x, () => {
      V.begin(), clearTimeout(j), o.value = void 0, T.value = void 0, k.value = !0, b.value = void 0, j = setTimeout(() => {
        N();
      }, 250);
    });
    const W = re("component.meta.changed", (i) => {
      const a = pe(i);
      if (!a) return;
      const s = o.value?.find((h) => h.catalog_id === a.component_id);
      s && (typeof a.meta.title == "string" && (s.title = a.meta.title.trim() || "Catalog"), a.deleted.includes("title") && (s.title = "Catalog"));
    });
    return K(N), le(() => {
      W(), clearTimeout(j), V.begin();
    }), (i, a) => (u(), _("div", _e, [
      v("aside", ke, [
        v("div", he, [
          v("h2", null, [
            a[4] || (a[4] = S("Catalogs ", -1)),
            o.value ? (u(), w(c(ce), {
              key: 0,
              severity: "secondary",
              value: String(o.value.length)
            }, null, 8, ["value"])) : $("", !0)
          ]),
          p(c(B), {
            text: "",
            size: "small",
            "aria-label": "Create catalog",
            onClick: a[0] || (a[0] = (s) => r.value = !0)
          }, {
            default: C(() => [
              p(c(A), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ]),
        p(c(F), {
          modelValue: y.value,
          "onUpdate:modelValue": a[1] || (a[1] = (s) => y.value = s),
          class: "pim-rail-search",
          type: "search",
          "aria-label": "Find a catalog",
          placeholder: "Find a catalog…"
        }, null, 8, ["modelValue"]),
        v("div", we, [
          (u(!0), _(oe, null, ne(o.value, (s) => (u(), w(G, {
            key: s.catalog_id,
            class: ie(["pim-rail-row", { active: e.value === s.catalog_id }]),
            "aria-pressed": e.value === s.catalog_id,
            onClick: (h) => m(s.catalog_id)
          }, {
            default: C(() => [
              v("span", null, se(s.title || "Untitled catalog"), 1)
            ]),
            _: 2
          }, 1032, ["class", "aria-pressed", "onClick"]))), 128))
        ]),
        x.value && b.value ? (u(), w(D, {
          key: 0,
          error: b.value.error,
          class: "pim-rail-error"
        }, {
          default: C(() => [
            p(c(B), {
              type: "button",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: L
            }, {
              default: C(() => [...a[5] || (a[5] = [
                S("Retry", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["error"])) : x.value && k.value ? (u(), _("div", xe, "Searching catalogs…")) : x.value && o.value?.length === 0 && T.value == null ? (u(), _("div", Te, "No matching catalogs.")) : $("", !0),
        T.value != null ? (u(), w(c(B), {
          key: 3,
          type: "button",
          disabled: k.value || !!b.value,
          onClick: a[2] || (a[2] = (s) => N(T.value)),
          severity: "secondary",
          outlined: "",
          size: "small"
        }, {
          default: C(() => [
            p(c(A), {
              icon: "tabler:chevron-right",
              "aria-hidden": "true"
            }),
            a[6] || (a[6] = S(" Load more catalogs", -1))
          ]),
          _: 1
        }, 8, ["disabled"])) : $("", !0)
      ]),
      v("main", Ve, [
        !x.value && b.value ? (u(), w(D, {
          key: 0,
          error: b.value.error,
          class: "pim-list-error"
        }, {
          default: C(() => [
            p(c(B), {
              type: "button",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: L
            }, {
              default: C(() => [...a[7] || (a[7] = [
                S("Retry", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["error"])) : $("", !0),
        e.value && g.value ? (u(), _("kickside-pim-catalog-settings", {
          key: e.value,
          "catalog-id": e.value,
          embedded: "true",
          onDirtyChanged: t
        }, null, 40, $e)) : k.value ? (u(), _("div", Se, "Loading catalogs…")) : !b.value && o.value ? (u(), _("div", Be, [
          p(c(A), {
            icon: "tabler:settings",
            class: "kx-empty-ico"
          }),
          a[8] || (a[8] = v("h3", { class: "kx-empty-title" }, "Catalog settings", -1)),
          a[9] || (a[9] = v("p", { class: "kx-empty-sub" }, "Select a catalog to edit its schema, plugins and policy.", -1))
        ])) : $("", !0)
      ]),
      p(Ce, {
        visible: r.value,
        onClose: a[3] || (a[3] = (s) => r.value = !1),
        onCreated: l
      }, null, 8, ["visible"])
    ]));
  }
}), Ee = { type: "object", properties: {} };
class je extends J {
  static get wippyConfig() {
    return { propsSchema: Ee, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"], inlineCss: O };
  }
  static get vueConfig() {
    return { rootComponent: Ne, plugins: [Q] };
  }
}
de(import.meta.url, je);
