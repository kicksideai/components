import { d as Tl, u as yt, r as Je, e as al, h as Il, b as ht, p as ye, c as He, a as ze, _ as ft, i as ql, S as Dl, f as Nl, g as Fl, W as zl, s as Bl, P as Ml } from "./styles-CsjeEppB.js";
import { defineComponent as me, computed as B, openBlock as e, createBlock as P, resolveDynamicComponent as sl, normalizeProps as Ll, guardReactiveProps as El, createSlots as xe, withCtx as C, createElementVNode as t, normalizeClass as Oe, createElementBlock as s, Fragment as Q, renderList as se, toDisplayString as b, createCommentVNode as c, unref as a, renderSlot as he, ref as J, onUnmounted as Ke, createVNode as _, createStaticVNode as Wl, createTextVNode as ee, withModifiers as Be, normalizeStyle as Vt, useId as Se, watch as fe, withKeys as ot, nextTick as qe, provide as il, inject as jt, useModel as At, Transition as nl, withDirectives as Rt, vShow as Pt, mergeModels as gt, onBeforeUnmount as Hl, toRaw as Jl, onMounted as ol, useSlots as Kl, mergeProps as Gl } from "vue";
import { Icon as oe } from "@iconify/vue";
import _e from "primevue/tag";
import Y from "primevue/button";
import Yl from "primevue/checkbox";
import je from "primevue/message";
import { api as Zl, on as dl, host as tt, loadByTagName as Ql, define as Xl } from "@wippy-fe/proxy";
import Tt from "primevue/selectbutton";
import lt from "primevue/inputtext";
import rl from "primevue/multiselect";
import dt from "primevue/toggleswitch";
import Ve from "primevue/select";
import ea from "primevue/inputnumber";
import ta from "primevue/textarea";
const la = ["aria-label"], aa = {
  key: 0,
  class: "kx-settings-rail-group"
}, sa = ["aria-current", "onClick"], ia = { class: "kx-settings-rail-label" }, na = /* @__PURE__ */ me({
  __name: "SettingsRail",
  props: {
    label: {},
    title: {},
    count: {},
    value: {},
    groups: {},
    leadingItem: {}
  },
  emits: ["update:value"],
  setup(l) {
    const m = l, i = B(() => m.leadingItem ? [{ items: [m.leadingItem] }, ...m.groups] : m.groups);
    function n(o) {
      const r = [...o.currentTarget.querySelectorAll(".kx-settings-rail-item")], v = r.indexOf(o.target);
      if (v < 0) return;
      let p;
      switch (o.key) {
        case "ArrowDown":
        case "ArrowRight":
          p = (v + 1) % r.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          p = (v + r.length - 1) % r.length;
          break;
        case "Home":
          p = 0;
          break;
        case "End":
          p = r.length - 1;
          break;
        default:
          return;
      }
      o.preventDefault(), r[p]?.focus();
    }
    return (o, r) => (e(), P(sl(l.title ? Tl : "div"), Ll(El(l.title ? { title: l.title, count: l.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), xe({
      default: C(() => [
        t("nav", {
          class: Oe(["kx-settings-rail", { "kx-settings-rail-framed": l.title }]),
          "aria-label": l.label,
          onKeydown: n
        }, [
          (e(!0), s(Q, null, se(i.value, (v, p) => (e(), s("div", {
            key: v.items[0]?.value ?? p,
            class: Oe(["kx-settings-rail-section", { "kx-settings-rail-leading": l.leadingItem && p === 0 }])
          }, [
            v.heading ? (e(), s("div", aa, b(v.heading), 1)) : c("", !0),
            (e(!0), s(Q, null, se(v.items, (h) => (e(), s("button", {
              key: h.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": h.value === l.value ? "true" : void 0,
              onClick: (L) => o.$emit("update:value", h.value)
            }, [
              h.icon ? (e(), P(a(oe), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: h.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : c("", !0),
              t("span", ia, b(h.label), 1)
            ], 8, sa))), 128))
          ], 2))), 128))
        ], 42, la)
      ]),
      _: 2
    }, [
      l.title && o.$slots.actions ? {
        name: "actions",
        fn: C(() => [
          he(o.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), oa = { class: "pim-stack" }, da = { class: "form pim-access-card pim-ia-action" }, ra = { class: "pim-access-summary" }, ua = ["config"], ca = /* @__PURE__ */ me({
  __name: "CatalogShare",
  props: {
    catalogId: {},
    title: {},
    access: {}
  },
  setup(l) {
    const m = l, i = J(!1), n = J(!1), o = J(""), r = J(), v = J(!1), p = Je(), h = B(() => "/api/v1/component-access/grants/" + encodeURIComponent(m.catalogId)), L = B(() => JSON.stringify({
      resource_id: m.catalogId,
      title: m.title,
      access_url: h.value,
      share_url: "/api/v1/component-access/share/" + encodeURIComponent(m.catalogId)
    })), M = B(() => {
      if (!m.access.admin) return "Only catalog administrators can manage sharing.";
      if (!r.value) return v.value ? "Member counts are unavailable." : "Loading members…";
      const { people: F, groups: y } = r.value;
      return F + (F === 1 ? " person" : " people") + " and " + y + (y === 1 ? " group" : " groups") + " with direct access";
    });
    async function G() {
      if (!m.access.admin) return;
      const F = p.begin();
      v.value = !1;
      try {
        const { data: y } = await Zl.get(h.value);
        if (!p.current(F)) return;
        if (!y?.success || !Array.isArray(y.access)) throw new Error("Grants unavailable");
        const $ = y.access.filter((u) => u.subject_type === "group").length;
        r.value = { people: y.access.length - $, groups: $ };
      } catch {
        p.current(F) && (r.value = void 0, v.value = !0);
      }
    }
    yt(G), Ke(() => {
      p.begin();
    });
    async function Z() {
      n.value = !0, o.value = "", await al("kickside-share") ? i.value = !0 : o.value = "Could not open sharing. Try again.", n.value = !1;
    }
    return (F, y) => (e(), s("div", oa, [
      t("section", da, [
        t("div", null, [
          y[1] || (y[1] = t("h3", null, "Members and sharing", -1)),
          t("p", ra, b(M.value), 1)
        ]),
        l.access.admin ? (e(), P(a(Y), {
          key: 0,
          type: "button",
          label: "Share catalog",
          loading: n.value,
          onClick: Z
        }, {
          icon: C(() => [
            _(a(oe), {
              icon: "tabler:share",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : c("", !0),
        v.value ? (e(), P(a(Y), {
          key: 1,
          type: "button",
          label: "Reload member counts",
          severity: "secondary",
          text: "",
          onClick: G
        })) : c("", !0)
      ]),
      y[2] || (y[2] = Wl('<section class="form pim-access-card pim-stack" aria-labelledby="pim-access-roles-heading"><h3 id="pim-access-roles-heading">What members can do</h3><dl class="pim-access-roles"><div><dt>Read</dt><dd>View products and their details.</dd></div><div><dt>Write</dt><dd>Create products and update their values.</dd></div><div><dt>Delete</dt><dd>Move products to trash.</dd></div><div><dt>Admin</dt><dd>Manage catalog settings and who has access.</dd></div></dl></section>', 1)),
      i.value ? (e(), s("kickside-share", {
        key: 0,
        config: L.value,
        onClose: y[0] || (y[0] = ($) => i.value = !1),
        onChanged: G
      }, null, 40, ua)) : c("", !0),
      o.value ? (e(), P(a(je), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: C(() => [
          ee(b(o.value), 1)
        ]),
        _: 1
      })) : c("", !0)
    ]));
  }
});
function pa(l, m, i = {}) {
  const n = JSON.stringify(l), o = JSON.stringify(i);
  return {
    declaration: JSON.parse(n),
    generation: m,
    pluginConfigs: JSON.parse(o),
    matches: (r, v, p = {}) => m === v && n === JSON.stringify(r) && o === JSON.stringify(p)
  };
}
function Zt(l, m) {
  const i = {};
  for (const [n, o] of Object.entries(m)) {
    const r = o.filter((v) => n === "plugins" ? !l.plugins?.some((p) => p.use === v) : n === "scopes" ? !l.scopes?.includes(v) : n === "attributes" ? !l.aspects?.some((p) => p.attributes?.some((h) => p.namespace + "." + h.code === v)) : n === "aspects" ? !l.aspects?.some((p) => p.namespace === v) : n === "dimensions" ? !l.dimensions?.some((p) => p.name === v) : n === "vocabularies" || n === "families" ? !l[n]?.some((p) => p.code === v) : !l[n]?.some((p) => p.id === v));
    r.length && (i[n] = r);
  }
  return i;
}
const Qt = (l) => !!l && typeof l == "object" && !Array.isArray(l), ve = ["string"], ul = { "*": "string" }, ma = { id: "number", code: "string!", type: "string!", scope: ve, cardinality: "string", index: "string", index_contexts: [ul], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, va = {
  dimensions: [{ name: "string!", members: ve, fallback: { "*": ve } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: ve }, attributes: [ma] }],
  families: [{ code: "string!", aspects: ve, variation: [{ axes: ve, own: ve }], requirements: [{ id: "string!", context: ul, require: ve, authored: ve }], checks: [{ check: "string!", reads: ve, cost: "string", config: "object", enforce: "string" }] }],
  sources: [{ id: "string!", ordering: "string", writes: ve, principals: ve, audit: "boolean" }],
  channels: [{ id: "string!", requirements: ve, families: ve }],
  plugins: [{ use: "string!", schema: "json" }],
  scopes: ve,
  policy: { "*": "policy" },
  remove: { dimensions: ve, vocabularies: ve, aspects: ve, families: ve, sources: ve, channels: ve, attributes: ve, scopes: ve, plugins: ve }
};
function Ot(l, m, i) {
  if (typeof m == "string") {
    const n = m.replace("!", "");
    if (!(n === "json" || (n === "object" ? Qt(l) : n === "policy" ? l === !1 || typeof l == "string" || typeof l == "number" : typeof l === n)) || m.endsWith("!") && (typeof l != "string" || !l.trim())) throw new Error(`${i} has an invalid ${n} value.`);
  } else if (Array.isArray(m)) {
    if (!Array.isArray(l)) throw new Error(`${i} must be an array.`);
    l.forEach((n, o) => Ot(n, m[0], `${i}[${o}]`));
  } else {
    if (!Qt(l)) throw new Error(`${i} must be an object.`);
    for (const [n, o] of Object.entries(m)) if (typeof o == "string" && o.endsWith("!") && l[n] === void 0) throw new Error(`${i}.${n} is required.`);
    for (const [n, o] of Object.entries(l)) {
      const r = m[n] ?? m["*"];
      if (!r) throw new Error(`${i}.${n} is not an editor field.`);
      Ot(o, r, `${i}.${n}`);
    }
  }
}
function fa(l) {
  const m = JSON.parse(l);
  Ot(m, va, "Declaration");
  const i = m;
  for (const n of i.dimensions ?? []) n.members ??= [];
  return i;
}
function et(l) {
  return JSON.parse(JSON.stringify(l));
}
const Xt = /^[a-z][a-z0-9_]*$/;
function ga(l) {
  return l.trim().normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function We(l, m, i) {
  i.length ? l[m] = i : delete l[m];
}
function mt(l, m, i) {
  if (i < 0 || i >= l.length || m === i) return;
  const [n] = l.splice(m, 1);
  l.splice(i, 0, n);
}
function pe(l, m) {
  return !l || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(l) ? m : l;
}
function nt(l) {
  return l ? pe(l.title, "Field type") : "Unknown type";
}
async function cl(l, m) {
  const i = [...new Set(m)].map((o) => ({ type: "user", id: o }));
  if (!i.length) return {};
  const n = await Il(`/api/v1/pim-admin/catalogs/${encodeURIComponent(l)}/principal_labels`, { refs: i }, "People");
  return Object.fromEntries((n.principals ?? []).map((o) => [o.id, pe(o.label, "Person")]));
}
const vt = [
  { value: "quarter", label: "¼", span: 3 },
  { value: "third", label: "⅓", span: 4 },
  { value: "half", label: "½", span: 6 },
  { value: "full", label: "1", span: 12 }
];
function St(l, m, i) {
  return i.width ?? l.attributes[m + "." + i.code]?.width ?? "half";
}
const ba = (l) => new Date(l).toLocaleString();
function Ut(l) {
  const m = Math.abs(l.m).toString(), i = l.m < 0 ? "-" : "";
  if (l.e >= 0) return i + m + "0".repeat(l.e);
  const n = -l.e, o = m.padStart(n + 1, "0");
  return i + o.slice(0, o.length - n) + "." + o.slice(o.length - n);
}
function H(l) {
  const i = (l.includes(".") ? l.slice(l.indexOf(".") + 1) : l).replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return i ? i[0].toUpperCase() + i.slice(1) : l;
}
function bt(l, m) {
  const i = l.properties;
  return pe(i?.[m]?.title, pe(H(m), "This setting"));
}
function Ee(l) {
  return l.labels.en ?? Object.values(l.labels)[0] ?? l.code;
}
function pl(l) {
  const m = /* @__PURE__ */ new Map();
  for (const i of l ?? [])
    if (i.code !== "generic")
      for (const n of i.aspects ?? []) {
        const o = m.get(n) ?? [];
        o.push(H(i.code)), m.set(n, o);
      }
  return new Map([...m].map(([i, n]) => [i, "Used by " + n.join(", ")]));
}
function rt(l, m) {
  if (l == null) return "";
  const i = (n) => {
    if (n == null) return "";
    if (typeof n == "object" && "ref" in n) {
      const o = n;
      if (o.ref[0] === "term") {
        const r = o.ref[1].slice(o.ref[1].indexOf(":") + 1), v = o.ref[1].slice(0, o.ref[1].indexOf(":")), p = m?.[v]?.find((h) => h.code === r);
        return p ? Ee(p) : r;
      }
      return "Linked " + H(o.ref[0]).toLocaleLowerCase();
    }
    if (typeof n == "object" && "v" in n) {
      const o = n;
      return Ut(o.v) + " " + o.u;
    }
    return typeof n == "object" && "m" in n ? Ut(n) : typeof n == "boolean" ? n ? "Yes" : "No" : typeof n == "object" ? JSON.stringify(n) : pe(String(n), "Linked record");
  };
  return Array.isArray(l) ? l.map(i).join(", ") : i(l);
}
function ya(l, m, i) {
  const n = rt(m), o = rt(i);
  return !o && n ? `${l} cleared (was ${n})` : n ? `${l}: ${n} → ${o}` : `${l} set to ${o}`;
}
const ha = { class: "pim-table form pim-layout" }, ka = {
  key: 0,
  class: "pim-layout-help muted"
}, _a = {
  key: 1,
  class: "kx-empty"
}, wa = { class: "pim-aspect-head pim-list-header" }, $a = { class: "muted small" }, Ca = ["draggable", "onDragstart", "onDragover", "onDrop"], xa = { class: "pim-lcard-top" }, Va = {
  key: 0,
  class: "pim-grip",
  "aria-hidden": "true"
}, ja = { class: "pim-lcard-name" }, Oa = { class: "pim-lcard-type" }, Sa = {
  key: 1,
  class: "pim-lcard-move"
}, Ua = { class: "pim-aspect-head" }, Aa = { class: "muted small" }, Ra = { class: "pim-canvas" }, Pa = { class: "pim-lcard-top" }, Ta = { class: "pim-lcard-name" }, Ia = { class: "pim-lcard-type" }, qa = /* @__PURE__ */ me({
  __name: "LayoutEditor",
  props: {
    draft: {},
    schema: {},
    types: {}
  },
  emits: ["families"],
  setup(l, { emit: m }) {
    const i = l, n = m, o = B(() => i.schema.access.admin), r = B(() => i.draft?.aspects ?? []), v = B(() => new Map(i.types.map((u) => [u.id, nt(u)]))), p = B(() => pl(i.draft.families)), h = B(() => {
      if (!i.schema) return [];
      const u = new Set((i.draft?.aspects ?? []).map((O) => O.namespace)), S = /* @__PURE__ */ new Map();
      for (const [O, V] of Object.entries(i.schema.attributes)) {
        const I = O.split(".")[0];
        u.has(I) || !V.plugin || (S.has(I) || S.set(I, { aspect: I, plugin: V.plugin, codes: [] }), S.get(I).codes.push(O));
      }
      return [...S.values()];
    });
    function L(u, S) {
      return vt.find((O) => O.value === St(i.schema, u, S))?.span ?? 6;
    }
    const M = J(null), G = J(null);
    function Z(u, S, O) {
      o.value && (M.value = { ns: u, index: S }, O.dataTransfer?.setData("text/plain", u + ":" + S), O.dataTransfer && (O.dataTransfer.effectAllowed = "move"));
    }
    function F(u, S, O) {
      !M.value || M.value.ns !== u || (O.preventDefault(), G.value = { ns: u, index: S });
    }
    function y(u, S) {
      o.value && M.value?.ns === u.namespace && mt(u.attributes ?? [], M.value.index, S), M.value = null, G.value = null;
    }
    function $() {
      M.value = null, G.value = null;
    }
    return (u, S) => (e(), s("div", ha, [
      o.value ? (e(), s("p", ka, "Arrange fields within each group and choose their widths. Review changes before applying the layout.")) : c("", !0),
      r.value.length === 0 ? (e(), s("div", _a, [
        S[2] || (S[2] = ee("This catalog has no field groups yet.", -1)),
        o.value ? (e(), s(Q, { key: 0 }, [
          ee(" Add a field group in Fields.")
        ], 64)) : c("", !0)
      ])) : c("", !0),
      (e(!0), s(Q, null, se(r.value, (O) => (e(), s("section", {
        key: O.namespace,
        class: "pim-aspect"
      }, [
        t("header", wa, [
          t("div", null, [
            t("h3", null, b(a(H)(O.namespace)), 1),
            t("p", $a, b(p.value.get(O.namespace) ?? "No named family uses this group yet."), 1)
          ]),
          o.value && !p.value.has(O.namespace) ? (e(), P(a(Y), {
            key: 0,
            label: "Open families",
            type: "button",
            text: "",
            size: "small",
            onClick: S[0] || (S[0] = (V) => n("families"))
          })) : c("", !0)
        ]),
        t("div", {
          class: "pim-canvas",
          onDragover: S[1] || (S[1] = Be(() => {
          }, ["prevent"]))
        }, [
          (e(!0), s(Q, null, se(O.attributes ?? [], (V, I) => (e(), s("div", {
            key: V.code,
            class: Oe(["pim-lcard", { dragging: M.value?.ns === O.namespace && M.value?.index === I, over: G.value?.ns === O.namespace && G.value?.index === I }]),
            style: Vt({ gridColumn: "span " + L(O.namespace, V) }),
            draggable: o.value,
            onDragstart: (X) => Z(O.namespace, I, X),
            onDragover: (X) => F(O.namespace, I, X),
            onDrop: Be((X) => y(O, I), ["prevent"]),
            onDragend: $
          }, [
            t("div", xa, [
              o.value ? (e(), s("span", Va, [
                _(a(oe), { icon: "tabler:grip-vertical" })
              ])) : c("", !0),
              t("span", ja, b(a(H)(V.code)), 1),
              t("span", Oa, b(v.value.get(V.type) ?? a(nt)(void 0)), 1),
              o.value ? (e(), s("span", Sa, [
                _(a(Y), {
                  type: "button",
                  disabled: I === 0,
                  "aria-label": "Move " + a(H)(V.code) + " earlier",
                  onClick: (X) => a(mt)(O.attributes ?? [], I, I - 1),
                  class: "kx-iconbtn sm",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: C(() => [
                    _(a(oe), { icon: "tabler:arrow-left" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                _(a(Y), {
                  type: "button",
                  disabled: I === (O.attributes ?? []).length - 1,
                  "aria-label": "Move " + a(H)(V.code) + " later",
                  onClick: (X) => a(mt)(O.attributes ?? [], I, I + 1),
                  class: "kx-iconbtn sm",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: C(() => [
                    _(a(oe), { icon: "tabler:arrow-right" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ])) : c("", !0)
            ]),
            _(a(Tt), {
              disabled: !o.value,
              "model-value": a(St)(l.schema, O.namespace, V),
              options: a(vt),
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Width of " + a(H)(V.code),
              "onUpdate:modelValue": (X) => V.width = X
            }, null, 8, ["disabled", "model-value", "options", "aria-label", "onUpdate:modelValue"])
          ], 46, Ca))), 128))
        ], 32)
      ]))), 128)),
      (e(!0), s(Q, null, se(h.value, (O) => (e(), s("section", {
        key: O.aspect,
        class: "pim-aspect"
      }, [
        t("header", Ua, [
          t("div", null, [
            t("h3", null, b(a(H)(O.aspect)), 1),
            t("p", Aa, b(p.value.get(O.aspect) ?? "No named family uses this group yet."), 1)
          ]),
          S[3] || (S[3] = t("span", { class: "muted small" }, "Provided by a plugin", -1))
        ]),
        t("div", Ra, [
          (e(!0), s(Q, null, se(O.codes, (V) => (e(), s("div", {
            key: V,
            class: "pim-lcard fixed",
            style: Vt({ gridColumn: "span " + (a(vt).find((I) => I.value === l.schema.attributes[V].width)?.span ?? 6) })
          }, [
            t("div", Pa, [
              t("span", Ta, b(a(H)(V)), 1),
              t("span", Ia, b(v.value.get(l.schema.attributes[V].type) ?? a(nt)(void 0)), 1)
            ])
          ], 4))), 128))
        ])
      ]))), 128))
    ]));
  }
}), Da = {
  class: "pim-history",
  "aria-label": "Catalog history"
}, Na = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Fa = { class: "pim-table pim-responsive-table" }, za = ["id"], Ba = ["aria-labelledby"], Ma = {
  key: 0,
  scope: "col"
}, La = { class: "muted small" }, Ea = ["datetime"], Wa = {
  key: 0,
  class: "small"
}, Ha = {
  key: 0,
  class: "muted"
}, Ja = { class: "mono small" }, Ka = {
  key: 0,
  class: "muted"
}, Ga = {
  key: 0,
  class: "muted small"
}, Ya = ["aria-labelledby"], Za = { class: "pim-stacked-meta muted small" }, Qa = { key: 0 }, Xa = { key: 1 }, es = ["datetime"], ts = {
  key: 1,
  class: "kx-empty"
}, ls = { class: "pim-table-foot" }, as = /* @__PURE__ */ me({
  __name: "HistoryPanel",
  props: {
    catalogId: {},
    canResolveActors: { type: Boolean }
  },
  setup(l) {
    const m = l, i = J([]), n = J({}), o = J(), r = J(!1), v = J(), p = Je(), h = Se(), L = B(() => i.value.map((y) => ({
      key: `${y.seq}:${y.n}`,
      at: y.at,
      date: ba(y.at),
      actor: n.value[y.actor] ?? pe(y.actor, "Person"),
      source: y.source ? pe(H(y.source), "Data source") : "",
      product: G(y),
      context: y.ctx ? pe(y.ctx, "Product context") : "",
      change: Z(y)
    })));
    async function M(y = !1) {
      const $ = p.begin();
      r.value = !0, v.value = void 0;
      try {
        const u = await ye.history(m.catalogId, { limit: 50, before: y ? o.value : void 0 });
        if (!p.current($)) return;
        if (i.value = y ? [...i.value, ...u.entries] : u.entries, o.value = u.next, m.canResolveActors)
          try {
            const S = await cl(m.catalogId, u.entries.map((O) => O.actor));
            p.current($) && (n.value = { ...n.value, ...S });
          } catch {
          }
      } catch (u) {
        if (!p.current($)) return;
        v.value = He(u, "Could not load the history.");
      } finally {
        p.current($) && (r.value = !1);
      }
    }
    function G(y) {
      return y.sku ? y.sku : y.subject.startsWith("p:") ? "purged product" : y.subject.startsWith("t:") ? y.subject.slice(2) : y.subject.startsWith("r:") ? "Release" : pe(y.subject, "Catalog");
    }
    function Z(y) {
      if (y.attribute)
        return ya(H(y.attribute), y.before, y.after);
      switch (y.kind) {
        case "schema":
          return "Catalog settings applied";
        case "term": {
          const $ = y.after ?? {}, u = $.labels?.en ?? Object.values($.labels ?? {})[0];
          return $.retired ? "Term retired" : u ? `Term labelled "${u}"` + ($.parent ? ` under ${$.parent}` : "") : "Term changed";
        }
        case "created": {
          const $ = y.after ?? {};
          return `Created as ${H($.family ?? "product")}` + ($.level ? ` at level ${$.level}` : "");
        }
        case "released": {
          const $ = y.after ?? {};
          return `Released v${$.version ?? ""} to ${($.channels ?? []).join(", ")}`;
        }
        case "withdrawn":
          return `Withdrawn from ${((y.after ?? {}).channels ?? []).join(", ")}`;
        case "status":
          return `Status ${String(y.before ?? "")} → ${String(y.after ?? "")}`;
        case "moved":
          return "Moved under another parent";
        default:
          return H(y.kind);
      }
    }
    let F = () => {
    };
    return fe(() => m.catalogId, () => {
      F(), p.begin(), i.value = [], n.value = {}, o.value = void 0, v.value = void 0, F = dl(`component.${m.catalogId}`, () => {
        M();
      });
    }, { immediate: !0 }), fe(() => m.catalogId, () => {
      M();
    }), yt(() => M()), Ke(() => {
      F(), p.begin();
    }), (y, $) => (e(), s("section", Da, [
      v.value ? (e(), P(ht, {
        key: 0,
        error: v.value
      }, {
        default: C(() => [
          _(a(Y), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: $[0] || ($[0] = (u) => M())
          }, {
            default: C(() => [...$[2] || ($[2] = [
              ee("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : c("", !0),
      r.value ? (e(), s("div", Na, "Loading history…")) : c("", !0),
      t("div", Fa, [
        t("p", {
          id: a(h),
          class: "pim-history-caption muted small"
        }, "Catalog changes, newest first", 8, za),
        L.value.length ? (e(), s(Q, { key: 0 }, [
          t("table", {
            class: "pim-grid",
            "aria-labelledby": a(h)
          }, [
            t("thead", null, [
              t("tr", null, [
                $[3] || ($[3] = t("th", { scope: "col" }, "When", -1)),
                l.canResolveActors ? (e(), s("th", Ma, "Who")) : c("", !0),
                $[4] || ($[4] = t("th", { scope: "col" }, "What", -1)),
                $[5] || ($[5] = t("th", { scope: "col" }, "Change", -1))
              ])
            ]),
            t("tbody", null, [
              (e(!0), s(Q, null, se(L.value, (u) => (e(), s("tr", {
                key: u.key
              }, [
                t("td", La, [
                  t("time", {
                    datetime: u.at
                  }, b(u.date), 9, Ea)
                ]),
                l.canResolveActors ? (e(), s("td", Wa, [
                  ee(b(u.actor), 1),
                  u.source ? (e(), s("span", Ha, " via " + b(u.source), 1)) : c("", !0)
                ])) : c("", !0),
                t("td", Ja, [
                  ee(b(u.product), 1),
                  u.context ? (e(), s("span", Ka, " · " + b(u.context), 1)) : c("", !0)
                ]),
                t("td", null, [
                  ee(b(u.change), 1),
                  !l.canResolveActors && u.source ? (e(), s("span", Ga, " via " + b(u.source), 1)) : c("", !0)
                ])
              ]))), 128))
            ])
          ], 8, Ba),
          t("ol", {
            role: "list",
            class: "pim-stacked-list",
            "aria-labelledby": a(h)
          }, [
            (e(!0), s(Q, null, se(L.value, (u) => (e(), s("li", {
              key: u.key,
              class: "pim-stacked-row"
            }, [
              t("div", null, b(u.change), 1),
              t("div", Za, [
                l.canResolveActors ? (e(), s("span", Qa, [
                  t("span", null, b(u.actor), 1),
                  u.source ? (e(), s(Q, { key: 0 }, [
                    ee(" via " + b(u.source), 1)
                  ], 64)) : c("", !0)
                ])) : u.source ? (e(), s("span", Xa, "Via " + b(u.source), 1)) : c("", !0),
                t("time", {
                  datetime: u.at
                }, b(u.date), 9, es),
                t("span", null, [
                  ee(b(u.product), 1),
                  u.context ? (e(), s(Q, { key: 0 }, [
                    ee(" · " + b(u.context), 1)
                  ], 64)) : c("", !0)
                ])
              ])
            ]))), 128))
          ], 8, Ya)
        ], 64)) : !r.value && !v.value ? (e(), s("div", ts, "Nothing recorded yet.")) : c("", !0),
        t("div", ls, [
          t("span", null, b(L.value.length) + " change" + b(L.value.length === 1 ? "" : "s") + " shown", 1),
          o.value ? (e(), P(a(Y), {
            key: 0,
            type: "button",
            disabled: r.value,
            onClick: $[1] || ($[1] = (u) => M(!0)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: C(() => [
              _(a(oe), {
                icon: "tabler:adjustments",
                "aria-hidden": "true"
              }),
              $[6] || ($[6] = ee(" Load older", -1))
            ]),
            _: 1
          }, 8, ["disabled"])) : c("", !0)
        ])
      ])
    ]));
  }
}), ss = { class: "system-section-head" }, is = { class: "system-section-head-text" }, ns = {
  key: 0,
  class: "kx-head-actions"
}, os = /* @__PURE__ */ me({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(l) {
    return (m, i) => (e(), s("header", ss, [
      t("div", is, [
        t("h1", null, b(l.title), 1),
        t("p", null, b(l.description), 1)
      ]),
      m.$slots.actions ? (e(), s("div", ns, [
        he(m.$slots, "actions")
      ])) : c("", !0)
    ]));
  }
}), ds = /* @__PURE__ */ me({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(l) {
    return (m, i) => (e(), s(Q, null, [
      _(a(_e), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      _(a(Y), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: l.busy || l.discardDisabled,
        onClick: i[0] || (i[0] = (n) => m.$emit("discard"))
      }, {
        icon: C(() => [
          _(a(oe), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      _(a(Y), {
        label: "Review changes",
        type: "button",
        disabled: l.busy || l.reviewDisabled,
        loading: l.busy,
        onClick: i[1] || (i[1] = (n) => m.$emit("review", n.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), rs = ["onKeydown"], us = { class: "row pim-add-actions" }, cs = ["id"], Me = /* @__PURE__ */ me({
  __name: "AddSchemaCode",
  props: {
    label: {},
    action: {},
    existing: {},
    fromName: { type: Boolean },
    regular: { type: Boolean }
  },
  emits: ["add"],
  setup(l, { emit: m }) {
    const i = l, n = m, o = J(""), r = J(!1), v = J(), p = Se(), h = B(() => {
      const y = o.value.trim();
      return i.fromName ? ga(y) : y;
    }), L = B(() => o.value.trim() ? i.existing?.includes(h.value) ? i.fromName ? "This name is already in use." : "This code is already in use." : i.fromName && !Xt.test(h.value) ? "Use a name that starts with a letter from A to Z." : Xt.test(h.value) ? "" : "Start with a lowercase letter and use only lowercase letters, numbers or underscores." : ""), M = B(() => !!h.value && !L.value);
    async function G() {
      r.value = !0, await qe(), v.value?.querySelector("input")?.focus();
    }
    async function Z() {
      r.value = !1, o.value = "", await qe(), v.value?.querySelector("button")?.focus();
    }
    function F() {
      M.value && (n("add", h.value), Z());
    }
    return (y, $) => (e(), s("div", {
      ref_key: "row",
      ref: v,
      class: "row pim-add-row"
    }, [
      r.value ? (e(), s("div", {
        key: 1,
        class: "row pim-add-editor",
        onKeydown: ot(Be(Z, ["stop", "prevent"]), ["esc"])
      }, [
        _(a(lt), {
          modelValue: o.value,
          "onUpdate:modelValue": $[0] || ($[0] = (u) => o.value = u),
          type: "text",
          placeholder: l.label,
          "aria-label": l.label,
          invalid: !!L.value,
          "aria-describedby": L.value ? a(p) : void 0,
          class: Oe({ mono: !l.fromName }),
          onKeydown: ot(Be(F, ["prevent"]), ["enter"])
        }, null, 8, ["modelValue", "placeholder", "aria-label", "invalid", "aria-describedby", "class", "onKeydown"]),
        t("div", us, [
          _(a(Y), {
            type: "button",
            disabled: !M.value,
            onClick: F
          }, {
            default: C(() => [
              ee(b(l.action), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          _(a(Y), {
            type: "button",
            label: "Cancel",
            outlined: "",
            severity: "secondary",
            onClick: Z
          })
        ]),
        L.value ? (e(), s("p", {
          key: 0,
          id: a(p),
          role: "status",
          class: "pim-add-code-error small"
        }, b(L.value), 9, cs)) : c("", !0)
      ], 40, rs)) : (e(), P(a(Y), {
        key: 0,
        type: "button",
        "aria-expanded": "false",
        severity: "secondary",
        outlined: "",
        size: l.regular ? void 0 : "small",
        onClick: G
      }, {
        default: C(() => [
          _(a(oe), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          ee(" " + b(l.action), 1)
        ]),
        _: 1
      }, 8, ["size"])),
      he(y.$slots, "default")
    ], 512));
  }
}), ml = Symbol("definitionColumns"), ps = { code: "Code", kind: "Kind", details: "Details", usage: "Used by" }, ms = {
  code: "minmax(120px, 1fr)",
  kind: "140px",
  details: "minmax(120px, 1.2fr)",
  usage: "120px"
}, vs = {
  class: "pim-definition-scroll",
  tabindex: "0",
  "aria-label": "Definitions"
}, fs = { class: "pim-definition-grid" }, gs = {
  key: 0,
  class: "pim-definition-columns",
  "aria-hidden": "true"
}, bs = { class: "pim-definition-actions-heading" }, at = /* @__PURE__ */ me({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: { default: () => ["code"] },
    showActions: { type: Boolean }
  },
  setup(l) {
    const m = l;
    il(ml, B(() => m.columns));
    const i = B(() => ["48px", "minmax(160px, 1.4fr)", ...m.columns.map((n) => ms[n]), m.showActions ? "100px" : "80px"].join(" "));
    return (n, o) => (e(), s("section", {
      class: "form pim-definition-list",
      style: Vt({ "--pim-definition-columns": i.value })
    }, [
      he(n.$slots, "head"),
      t("div", vs, [
        t("div", fs, [
          l.count > 3 ? (e(), s("div", gs, [
            o[0] || (o[0] = t("span", null, null, -1)),
            o[1] || (o[1] = t("span", null, "Name", -1)),
            (e(!0), s(Q, null, se(l.columns, (r) => (e(), s("span", {
              key: r,
              class: Oe("pim-definition-" + r)
            }, b(a(ps)[r]), 3))), 128)),
            t("span", bs, b(l.showActions ? "Actions" : ""), 1)
          ])) : c("", !0),
          he(n.$slots, "default")
        ])
      ]),
      he(n.$slots, "add")
    ], 4));
  }
}), ys = ["aria-label"], hs = /* @__PURE__ */ me({
  __name: "InteractiveSurface",
  props: {
    label: {}
  },
  setup(l) {
    return (m, i) => (e(), s("button", {
      type: "button",
      class: "pim-interactive",
      "aria-label": l.label
    }, [
      he(m.$slots, "default")
    ], 8, ys));
  }
}), It = Symbol("section row"), ks = { class: "pim-definition" }, _s = {
  class: "pim-definition-lead",
  "data-column": "lead"
}, ws = {
  class: "pim-row-title",
  "data-column": "name"
}, $s = { class: "pim-definition-meta" }, Cs = ["data-column"], xs = {
  key: 0,
  class: "mono"
}, Vs = {
  class: "pim-definition-actions",
  "data-column": "actions"
}, js = ["id"], st = /* @__PURE__ */ me({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ gt({
    title: {},
    code: {},
    kind: {},
    usage: {},
    headClass: {},
    toggleClass: {},
    keepMounted: { type: Boolean },
    routeSection: {},
    routeId: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(l) {
    const m = l, i = jt(ml, B(() => [
      ...m.code ? ["code"] : [],
      ...m.kind ? ["kind"] : []
    ])), n = At(l, "open"), o = Se(), r = jt(It, void 0);
    function v(h) {
      return !!m.routeSection && !!m.routeId && h === m.routeSection + "/" + m.routeId;
    }
    fe(() => r?.selected.value, (h, L) => {
      v(h) ? n.value = !0 : v(L) && (n.value = !1);
    }, { immediate: !0 });
    function p() {
      const h = !n.value;
      n.value = h, m.routeSection && m.routeId && r?.choose(m.routeSection, m.routeId, h);
    }
    return (h, L) => (e(), s("section", ks, [
      t("header", {
        class: Oe(["pim-definition-head", l.headClass])
      }, [
        _(hs, {
          class: Oe(["pim-definition-toggle", l.toggleClass]),
          "aria-expanded": n.value,
          "aria-controls": n.value ? a(o) : void 0,
          onClick: p
        }, {
          default: C(() => [
            t("span", _s, [
              _(a(oe), {
                icon: "tabler:chevron-right",
                class: "pim-definition-chevron",
                "aria-hidden": "true"
              })
            ]),
            t("span", ws, b(l.title), 1),
            t("span", $s, [
              (e(!0), s(Q, null, se(a(i), (M) => (e(), s("span", {
                key: M,
                class: Oe("pim-definition-" + M),
                "data-column": M
              }, [
                M === "code" && l.code ? (e(), s("code", xs, b(l.code), 1)) : M === "kind" && l.kind ? (e(), P(a(_e), {
                  key: 1,
                  severity: "secondary",
                  value: l.kind
                }, null, 8, ["value"])) : M === "details" ? he(h.$slots, "details", {}, void 0, void 0, 2) : M === "usage" ? he(h.$slots, "usage", {}, () => [
                  ee(b(l.usage), 1)
                ], void 0, 3) : c("", !0)
              ], 10, Cs))), 128))
            ])
          ]),
          _: 3
        }, 8, ["class", "aria-expanded", "aria-controls"]),
        t("div", Vs, [
          he(h.$slots, "actions")
        ])
      ], 2),
      _(nl, { name: "pim-expand" }, {
        default: C(() => [
          n.value || l.keepMounted ? Rt((e(), s("div", {
            key: 0,
            id: a(o),
            class: "pim-definition-body"
          }, [
            he(h.$slots, "default")
          ], 8, js)), [
            [Pt, n.value]
          ]) : c("", !0)
        ]),
        _: 3
      })
    ]));
  }
}), Os = { class: "pim-chips pim-picker-chips" }, Ss = {
  key: 0,
  class: "muted"
}, Us = {
  key: 0,
  class: "muted small"
}, As = {
  key: 0,
  class: "muted"
}, Rs = {
  key: 0,
  class: "muted"
}, Pe = /* @__PURE__ */ me({
  __name: "ChipPicker",
  props: {
    modelValue: {},
    options: {},
    free: { type: Boolean },
    placeholder: {},
    disabled: { type: Boolean },
    dropdown: { type: Boolean },
    labelledby: {}
  },
  emits: ["update:modelValue"],
  setup(l, { emit: m }) {
    const i = l, n = m, o = J("");
    function r(G) {
      return i.modelValue.includes(G);
    }
    function v(G) {
      i.disabled || !G || n("update:modelValue", r(G) ? i.modelValue.filter((Z) => Z !== G) : [...i.modelValue, G]);
    }
    function p() {
      const G = o.value.trim();
      if (!G || r(G)) {
        o.value = "";
        return;
      }
      n("update:modelValue", [...i.modelValue, G]), o.value = "";
    }
    function h(G) {
      n("update:modelValue", i.modelValue.filter((Z) => Z !== G));
    }
    const L = B(() => i.modelValue.map((G) => i.options?.find((Z) => Z.value === G) ?? { value: G }));
    function M(G) {
      const Z = G.label ?? G.value;
      return G.detail ? Z + " " + G.detail : Z;
    }
    return (G, Z) => (e(), s("div", Os, [
      l.disabled ? (e(), s(Q, { key: 0 }, [
        (e(!0), s(Q, null, se(L.value, (F) => (e(), s("span", {
          key: F.value
        }, [
          ee(b(F.label ?? F.value) + " ", 1),
          F.detail ? (e(), s("small", Ss, b(F.detail), 1)) : c("", !0)
        ]))), 128)),
        l.modelValue.length ? c("", !0) : (e(), s("span", Us, "None"))
      ], 64)) : l.options && (l.dropdown || l.options.length > 10) ? (e(), s(Q, { key: 1 }, [
        (e(!0), s(Q, null, se(L.value, (F) => (e(), s("span", {
          key: F.value,
          class: "row"
        }, [
          t("span", null, [
            ee(b(F.label ?? F.value) + " ", 1),
            F.detail ? (e(), s("small", As, b(F.detail), 1)) : c("", !0)
          ]),
          _(a(Y), {
            type: "button",
            "aria-label": "Remove " + M(F),
            onClick: (y) => h(F.value),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: C(() => [
              _(a(oe), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128)),
        l.disabled ? c("", !0) : (e(), P(a(Ve), {
          key: 0,
          "model-value": null,
          placeholder: l.placeholder ?? "Add…",
          "aria-labelledby": l.labelledby,
          "aria-label": l.placeholder ?? "Add",
          "onUpdate:modelValue": Z[0] || (Z[0] = (F) => v(F)),
          class: "pim-chip-entry",
          options: l.options.filter((F) => !r(F.value)),
          "option-label": M,
          "option-value": "value",
          appendTo: "self"
        }, {
          option: C(({ option: F }) => [
            t("span", null, [
              ee(b(F.label ?? F.value) + " ", 1),
              F.detail ? (e(), s("small", Rs, b(F.detail), 1)) : c("", !0)
            ])
          ]),
          _: 1
        }, 8, ["placeholder", "aria-labelledby", "aria-label", "options"]))
      ], 64)) : l.options ? (e(), s(Q, { key: 2 }, [
        _(a(Tt), {
          "model-value": l.modelValue.filter((F) => l.options.some((y) => y.value === F)),
          options: l.options.map((F) => ({ value: F.value, label: F.label ?? F.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          disabled: l.disabled,
          "aria-labelledby": l.labelledby,
          "aria-label": l.placeholder ?? "Selected values",
          "onUpdate:modelValue": Z[1] || (Z[1] = (F) => n("update:modelValue", [...F, ...l.modelValue.filter((y) => !l.options.some(($) => $.value === y))]))
        }, null, 8, ["model-value", "options", "disabled", "aria-labelledby", "aria-label"]),
        (e(!0), s(Q, null, se(l.modelValue.filter((F) => !l.options.some((y) => y.value === F)), (F) => (e(), s("span", {
          key: F,
          class: "row"
        }, [
          ee(b(F), 1),
          _(a(Y), {
            type: "button",
            "aria-label": "Remove " + F,
            onClick: (y) => h(F),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: C(() => [
              _(a(oe), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128))
      ], 64)) : (e(!0), s(Q, { key: 3 }, se(l.modelValue, (F) => (e(), s("span", {
        key: F,
        class: "row"
      }, [
        ee(b(F), 1),
        _(a(Y), {
          type: "button",
          "aria-label": "Remove " + F,
          onClick: (y) => h(F),
          size: "small",
          text: "",
          severity: "secondary"
        }, {
          default: C(() => [
            _(a(oe), { icon: "tabler:x" })
          ]),
          _: 1
        }, 8, ["aria-label", "onClick"])
      ]))), 128)),
      l.free && !l.disabled ? (e(), P(a(lt), {
        key: 4,
        modelValue: o.value,
        "onUpdate:modelValue": Z[2] || (Z[2] = (F) => o.value = F),
        type: "text",
        "aria-labelledby": l.labelledby,
        placeholder: l.placeholder ?? "Add…",
        onKeydown: ot(Be(p, ["prevent"]), ["enter"]),
        onBlur: p,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "aria-labelledby", "placeholder", "onKeydown"])) : c("", !0)
    ]));
  }
}), Ps = { key: 0 }, Ts = {
  key: 0,
  class: "pim-config-overrides"
}, Is = {
  key: 1,
  class: "muted small"
}, qs = { key: 3 }, Ds = ["schema", "config", "field-errors"], Ns = {
  key: 1,
  class: "muted small",
  role: "status"
}, qt = /* @__PURE__ */ me({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean },
    problem: {},
    pluginId: {},
    refusal: {},
    fieldHelp: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(l, { expose: m, emit: i }) {
    const n = l, o = i, r = J(), v = J(0), p = J("pending"), h = B(() => {
      const O = n.schema.properties;
      return !O || typeof O != "object" ? n.schema : {
        ...n.schema,
        properties: Object.fromEntries(Object.entries(O).map(([V, I]) => [
          V,
          I && typeof I == "object" ? {
            ...I,
            title: bt(n.schema, V),
            ...!("description" in I) && n.fieldHelp?.[V] ? { description: n.fieldHelp[V] } : {}
          } : I
        ]))
      };
    }), L = B(() => n.refusal ?? (n.problem?.field ? { field: n.problem.field, message: /missing required property/i.test(n.problem.message) ? "A value is required." : n.problem.message } : void 0)), M = B(() => {
      const O = L.value;
      return O && Object.hasOwn(h.value.properties ?? {}, O.field) ? { [O.field]: O.message } : {};
    }), G = B(() => Object.keys(M.value).length || n.disabled ? "" : n.refusal?.message ?? (n.problem ? "The saved settings don’t meet the plugin’s requirements. Update the configuration below." : "")), Z = B(() => Object.entries(n.modelValue).map(([O, V]) => ({
      key: O,
      label: bt(n.schema, O),
      value: V !== null && typeof V == "object" ? JSON.stringify(V) : rt(V)
    })));
    async function F() {
      p.value = "pending", p.value = await al("wc-schema-form") ? "ready" : "failed";
    }
    fe(() => n.disabled, (O) => {
      O || F();
    }, { immediate: !0 });
    function y() {
      return r.value?.reportValidity();
    }
    function $(O) {
      const V = O.detail, I = Object.entries(V.errors).some(([X, q]) => M.value[X] !== q);
      o("validity", V.valid, I);
    }
    function u() {
      v.value++, o("update:modelValue", {});
    }
    Hl(() => o("validity", !0, !1)), m({ reportValidity: y });
    function S(O) {
      const V = O.detail;
      V && typeof V == "object" && !Array.isArray(V) && o("update:modelValue", V);
    }
    return (O, V) => (e(), s(Q, null, [
      G.value ? (e(), P(a(je), {
        key: 0,
        severity: "warn",
        role: "alert"
      }, {
        default: C(() => [
          ee(b(G.value), 1)
        ]),
        _: 1
      })) : c("", !0),
      l.problem ? (e(), P(ze, {
        key: 1,
        class: "small pim-error-code pim-ia-disclosure",
        label: "Technical details"
      }, {
        default: C(() => [
          l.pluginId ? (e(), s("p", Ps, [
            V[0] || (V[0] = ee("Plugin ", -1)),
            t("code", null, b(l.pluginId), 1)
          ])) : c("", !0),
          t("p", null, b(l.problem.message), 1)
        ]),
        _: 1
      })) : c("", !0),
      l.disabled ? (e(), s(Q, { key: 2 }, [
        Z.value.length ? (e(), s("dl", Ts, [
          (e(!0), s(Q, null, se(Z.value, (I) => (e(), s(Q, {
            key: I.key
          }, [
            t("dt", null, b(I.label), 1),
            t("dd", null, b(I.value), 1)
          ], 64))), 128))
        ])) : (e(), s("span", Is, "No overrides"))
      ], 64)) : (e(), s("div", qs, [
        p.value === "ready" ? (e(), s("wc-schema-form", {
          key: v.value,
          ref_key: "widget",
          ref: r,
          "allow-unset": "",
          schema: JSON.stringify(h.value),
          config: JSON.stringify(l.modelValue),
          "field-errors": JSON.stringify(M.value),
          onConfigChanged: S,
          onValidityChanged: $
        }, null, 40, Ds)) : p.value === "pending" ? (e(), s("span", Ns, "Configuration form is loading.")) : (e(), P(a(je), {
          key: 2,
          role: "alert",
          severity: "error"
        }, {
          default: C(() => [
            V[2] || (V[2] = ee("Configuration form could not be loaded. ", -1)),
            _(a(Y), {
              type: "button",
              onClick: F,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: C(() => [...V[1] || (V[1] = [
                ee("Retry", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })),
        l.problem ? c("", !0) : (e(), P(a(Y), {
          key: 3,
          type: "button",
          onClick: u,
          severity: "secondary",
          outlined: "",
          size: "small"
        }, {
          default: C(() => [
            _(a(oe), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            }),
            V[3] || (V[3] = ee(" Reset overrides", -1))
          ]),
          _: 1
        }))
      ]))
    ], 64));
  }
}), Fs = { key: 0 }, zs = /* @__PURE__ */ me({
  __name: "DefaultValue",
  props: {
    attribute: {},
    type: {},
    disabled: { type: Boolean }
  },
  emits: ["change"],
  setup(l, { emit: m }) {
    const i = l, n = m, o = B(() => {
      const h = i.type?.form;
      let L = { type: "string" };
      return h === "bool" ? L = { type: "boolean" } : h === "int" ? L = { type: "integer" } : h === "dec" ? L = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : h === "quantity" ? L = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(i.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : h === "record" ? L = { type: "object", additionalProperties: !0 } : h === "ref" && (L = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${i.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (i.attribute.cardinality ?? "one") !== "one" && (L = { type: "array", items: L, uniqueItems: i.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...L, title: "Default value" } } };
    });
    function r(h) {
      return h && typeof h == "object" && "m" in h && "e" in h ? Ut(h) : h;
    }
    function v(h) {
      return i.type?.form === "dec" ? r(h) : i.type?.form === "quantity" && h && typeof h == "object" && "v" in h && "u" in h ? { value: r(h.v), unit: h.u } : h;
    }
    const p = B(() => i.attribute.default === void 0 ? {} : { value: Array.isArray(i.attribute.default) ? i.attribute.default.map(v) : v(i.attribute.default) });
    return (h, L) => l.disabled ? (e(), s("span", Fs, b(l.attribute.default == null ? "No default" : a(rt)(l.attribute.default)), 1)) : (e(), P(qt, {
      key: 1,
      schema: o.value,
      "model-value": p.value,
      "onUpdate:modelValue": L[0] || (L[0] = (M) => n("change", M.value))
    }, null, 8, ["schema", "model-value"]));
  }
}), Bs = { class: "pim-stack" }, Ms = {
  key: 0,
  class: "pim-ia-action"
}, Ls = {
  key: 1,
  class: "form pim-card-body pad muted"
}, Es = { class: "pim-bsection-head pim-list-header" }, Ws = { class: "small muted" }, Hs = { class: "row pim-list-actions" }, Js = { class: "pim-fields" }, Ks = { class: "pim-f pim-w-third" }, Gs = { class: "pim-f-label" }, Ys = ["id"], Zs = { class: "pim-f pim-w-third" }, Qs = { class: "pim-f-label" }, Xs = ["id"], ei = {
  key: 0,
  class: "pim-f pim-w-third"
}, ti = { class: "pim-f-label" }, li = ["id"], ai = {
  key: 1,
  class: "pim-f pim-w-full muted small"
}, si = {
  key: 2,
  class: "pim-f pim-w-full muted small"
}, ii = {
  key: 3,
  class: "pim-f pim-w-third"
}, ni = { class: "pim-f-label" }, oi = ["id"], di = { class: "pim-f pim-w-third" }, ri = { class: "pim-f-label" }, ui = ["id"], ci = { class: "pim-f pim-w-half" }, pi = { class: "pim-f-label" }, mi = ["id"], vi = ["aria-labelledby"], fi = { class: "pim-f-label" }, gi = ["id"], bi = ["aria-labelledby"], yi = { class: "pim-f-label" }, hi = ["id"], ki = { class: "pim-fields" }, _i = { class: "pim-f pim-w-third" }, wi = { class: "pim-f-label" }, $i = ["for"], Ci = {
  key: 0,
  class: "pim-f-note"
}, xi = { class: "pim-f pim-w-third" }, Vi = { class: "pim-f-label" }, ji = ["id"], Oi = { class: "pim-f pim-w-half" }, Si = { class: "pim-f-label" }, Ui = ["for"], Ai = { class: "row" }, Ri = {
  key: 0,
  class: "pim-f pim-w-full"
}, Pi = { class: "pim-f-label" }, Ti = ["id"], Ii = ["aria-labelledby"], qi = ["id"], Di = {
  key: 0,
  class: "row end"
}, Ni = { class: "pim-ia-dialog-head" }, Fi = {
  tabindex: "-1",
  autofocus: ""
}, zi = { class: "pim-source-permissions" }, Bi = ["id"], Mi = { class: "dialog-actions pim-group-dialog-actions" }, Li = /* @__PURE__ */ me({
  __name: "BuilderFields",
  props: /* @__PURE__ */ gt({
    draft: {},
    schema: {},
    options: {}
  }, {
    family: { default: "" },
    familyModifiers: {}
  }),
  emits: /* @__PURE__ */ gt(["remove", "layout"], ["update:family"]),
  setup(l, { emit: m }) {
    const i = l, n = At(l, "family"), o = m, r = vt.map((z) => z.value), v = [{ value: "one", label: "Single value" }, { value: "list", label: "Ordered list" }, { value: "set", label: "Unique set" }], p = B(() => i.schema.access.admin), h = B(() => i.draft.aspects ?? []), L = B(() => (i.draft.families ?? []).filter((z) => z.code !== "generic"));
    fe(L, (z) => {
      n.value && !z.some((D) => D.code === n.value) && (n.value = "");
    }, { immediate: !0 });
    const M = B(() => [{ value: "", label: "All families" }, ...L.value.map((z) => ({ value: z.code, label: H(z.code) }))]), G = B(() => {
      const z = L.value.find((D) => D.code === n.value);
      return z ? h.value.filter((D) => z.aspects?.includes(D.namespace)) : h.value;
    }), Z = B(() => (i.draft.dimensions ?? []).map((z) => ({ value: z.name, label: H(z.name) }))), F = B(() => (i.draft.vocabularies ?? []).map((z) => z.code)), y = B(() => (i.draft.sources ?? []).map((z) => ({ value: z.id, label: H(z.id) }))), $ = B(() => [...i.options.types].sort((z, D) => z.form.localeCompare(D.form)).map((z) => ({ value: z.id, label: nt(z) })));
    function u(z) {
      return i.options.types.find((D) => D.id === z.type);
    }
    function S(z) {
      return u(z)?.target === "term";
    }
    function O(z) {
      return u(z)?.target === "asset";
    }
    function V(z) {
      const D = u(z);
      return !!D && D.form === "ref" && !D.target;
    }
    const I = B(() => pl(i.draft.families)), X = { none: "None", key: "Exact match", number: "Number range", text: "Text search" }, q = J({}), ne = Se(), we = /* @__PURE__ */ new WeakMap();
    let ge = 0;
    function ke(z, D) {
      if (D.id !== void 0) return z + "." + D.id;
      const N = Jl(D);
      let x = we.get(N);
      return x === void 0 && (x = ++ge, we.set(N, x)), z + ".draft-" + x;
    }
    function de(z, D, N) {
      return ne + "-" + ke(z, D) + "-" + N;
    }
    function K(z, D) {
      z.type = D;
      const N = u(z);
      if (N && z.index && !N.indexes.includes(z.index) && delete z.index, S(z) || delete z.vocabulary, O(z) && delete z.default, !V(z) && z.config && "target" in z.config) {
        const { target: x, ...ie } = z.config;
        z.config = Object.keys(ie).length ? ie : void 0, z.config || delete z.config;
      }
    }
    function A(z, D) {
      Object.keys(D).length ? z.config = D : delete z.config;
    }
    function g(z, D) {
      const N = { ...z.config ?? {} };
      D ? N.target = D : delete N.target, A(z, N);
    }
    function k(z, D) {
      D.length ? z.scope = D : delete z.scope, D.length || delete z.index_contexts;
    }
    function E(z, D, N) {
      N === void 0 || N === "" || N === !1 && D !== "default" ? delete z[D] : z[D] = N;
    }
    function R(z) {
      return z.index_contexts ?? [];
    }
    function d(z) {
      return (i.draft.dimensions ?? []).find((D) => D.name === z)?.members ?? [];
    }
    function j(z) {
      const D = {};
      for (const x of z.scope ?? []) D[x] = d(x)[0] ?? "";
      (z.index_contexts ?? (z.index_contexts = [])).push(D);
    }
    const T = J(), ae = B(() => T.value ? H(T.value.namespace) + " settings" : "");
    async function te(z, D, N, x) {
      const ie = z.currentTarget, W = ie.parentElement;
      mt(D, N, x), await qe(), (ie.isConnected ? ie : W?.querySelector("button"))?.focus({ preventScroll: !0 });
    }
    function $e(z) {
      (i.draft.aspects ??= []).push({ namespace: z, attributes: [] });
    }
    function De(z) {
      T.value = void 0;
      const D = h.value.indexOf(z);
      D >= 0 && h.value.splice(D, 1), i.schema.declaration.aspects?.some((N) => N.namespace === z.namespace) && o("remove", "aspects", z.namespace);
    }
    function Te(z, D) {
      const N = i.options.types.find((ie) => ie.id === "kickside.pim.types:text") ?? i.options.types[0], x = { code: D, type: N?.id ?? "" };
      (z.attributes ??= []).push(x), q.value[ke(z.namespace, x)] = !0;
    }
    function Ge(z, D) {
      const N = z.attributes ?? [], x = N.indexOf(D);
      x >= 0 && N.splice(x, 1);
      const ie = D.id === void 0 ? void 0 : i.schema.declaration.aspects?.find((W) => W.namespace === z.namespace)?.attributes?.find((W) => W.id === D.id);
      ie && o("remove", "attributes", z.namespace + "." + ie.code);
    }
    return (z, D) => (e(), s("div", Bs, [
      L.value.length || p.value && !n.value || h.value.length ? (e(), s("div", Ms, [
        L.value.length ? (e(), P(a(Ve), {
          key: 0,
          modelValue: n.value,
          "onUpdate:modelValue": D[0] || (D[0] = (N) => n.value = N),
          class: "pim-family-filter",
          "aria-label": "Show fields for a family",
          placeholder: "All families",
          options: M.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self"
        }, null, 8, ["modelValue", "options"])) : c("", !0),
        p.value && !n.value ? (e(), P(Me, {
          key: 1,
          label: "Field group name",
          action: "Add field group",
          "from-name": "",
          regular: "",
          existing: h.value.map((N) => N.namespace),
          onAdd: $e
        }, null, 8, ["existing"])) : c("", !0),
        h.value.length ? (e(), P(a(Y), {
          key: 2,
          label: "Open form layout",
          type: "button",
          text: "",
          size: "small",
          onClick: D[1] || (D[1] = (N) => o("layout"))
        })) : c("", !0)
      ])) : c("", !0),
      n.value && !G.value.length ? (e(), s("p", Ls, "This family has no field groups yet. Open the family to choose which groups it uses.")) : c("", !0),
      (e(!0), s(Q, null, se(G.value, (N) => (e(), P(at, {
        key: N.namespace,
        count: N.attributes?.length ?? 0,
        columns: ["kind", "details"],
        "show-actions": p.value
      }, {
        head: C(() => [
          t("header", Es, [
            t("div", null, [
              t("h3", null, b(a(H)(N.namespace)), 1),
              t("p", Ws, b(I.value.get(N.namespace) ?? "Unused by families"), 1)
            ]),
            t("div", Hs, [
              p.value ? (e(), P(Me, {
                key: 0,
                label: "Field name",
                action: "Add field",
                "from-name": "",
                existing: N.attributes?.map((x) => x.code),
                onAdd: (x) => Te(N, x)
              }, null, 8, ["existing", "onAdd"])) : c("", !0),
              _(a(Y), {
                type: "button",
                "aria-label": a(H)(N.namespace) + " settings",
                title: a(H)(N.namespace) + " settings",
                "aria-haspopup": "dialog",
                severity: "secondary",
                text: "",
                size: "small",
                onClick: (x) => T.value = N
              }, {
                default: C(() => [
                  _(a(oe), {
                    icon: "tabler:settings",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "title", "onClick"])
            ])
          ])
        ]),
        default: C(() => [
          (e(!0), s(Q, null, se(N.attributes ?? [], (x, ie) => (e(), P(st, {
            "route-section": "fields",
            "route-id": x.id === void 0 ? void 0 : ke(N.namespace, x),
            key: ke(N.namespace, x),
            open: q.value[ke(N.namespace, x)],
            "onUpdate:open": (W) => q.value[ke(N.namespace, x)] = W,
            title: a(H)(x.code),
            kind: a(nt)(u(x)),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle"
          }, xe({
            details: C(() => [
              x.cardinality && x.cardinality !== "one" ? (e(), P(a(_e), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: C(() => [
                  ee(b(v.find((W) => W.value === x.cardinality)?.label), 1)
                ]),
                _: 2
              }, 1024)) : c("", !0),
              x.scope?.length ? (e(), P(a(_e), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: C(() => [
                  ee("per " + b(x.scope.map(a(H)).join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : c("", !0),
              x.index && x.index !== "none" ? (e(), P(a(_e), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: C(() => [
                  ee(b(X[x.index] || "Filterable"), 1)
                ]),
                _: 2
              }, 1024)) : c("", !0),
              x.unique ? (e(), P(a(_e), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: C(() => [...D[7] || (D[7] = [
                  ee("unique", -1)
                ])]),
                _: 1
              })) : c("", !0)
            ]),
            default: C(() => [
              t("div", Js, [
                t("div", Ks, [
                  t("div", Gs, [
                    t("label", {
                      id: de(N.namespace, x, "type")
                    }, "Type", 8, Ys)
                  ]),
                  _(a(Ve), {
                    disabled: !p.value,
                    "aria-labelledby": de(N.namespace, x, "type"),
                    "model-value": x.type,
                    options: $.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (W) => K(x, W)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                t("div", Zs, [
                  t("div", Qs, [
                    t("label", {
                      id: de(N.namespace, x, "values")
                    }, "Values", 8, Xs)
                  ]),
                  _(a(Ve), {
                    disabled: !p.value,
                    "aria-labelledby": de(N.namespace, x, "values"),
                    "model-value": x.cardinality ?? "one",
                    options: v,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (W) => E(x, "cardinality", W === "one" ? void 0 : W)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                S(x) ? (e(), s("div", ei, [
                  t("div", ti, [
                    t("label", {
                      id: de(N.namespace, x, "vocabulary")
                    }, "Vocabulary", 8, li)
                  ]),
                  _(a(Ve), {
                    disabled: !p.value,
                    "aria-labelledby": de(N.namespace, x, "vocabulary"),
                    "model-value": x.vocabulary ?? "",
                    "onUpdate:modelValue": (W) => E(x, "vocabulary", W),
                    options: [{ value: "", label: "Choose…" }, ...F.value.map((W) => ({ value: W, label: a(H)(W) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : c("", !0),
                O(x) ? (e(), s("p", ai, "Choose the media types and file size this field accepts. Catalog readers can access attached files.")) : u(x)?.form === "ref" && !S(x) ? (e(), s("p", si, b(V(x) ? "A link points to something managed by an installed plugin." : "A product reference points to another product in this catalog."), 1)) : c("", !0),
                V(x) ? (e(), s("div", ii, [
                  t("div", ni, [
                    t("label", {
                      id: de(N.namespace, x, "link")
                    }, "Link destination", 8, oi),
                    D[8] || (D[8] = t("span", { class: "pim-f-note" }, "choose what the field can point to", -1))
                  ]),
                  _(a(Ve), {
                    disabled: !p.value,
                    "aria-labelledby": de(N.namespace, x, "link"),
                    "model-value": x.config?.target ?? "",
                    "onUpdate:modelValue": (W) => g(x, W),
                    options: [{ value: "", label: "Choose…" }, ...l.options.link_kinds.map((W) => ({ value: W.kind, label: a(pe)(W.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : c("", !0),
                t("div", di, [
                  t("div", ri, [
                    t("label", {
                      id: de(N.namespace, x, "width")
                    }, "Width", 8, ui),
                    D[9] || (D[9] = t("span", { class: "pim-f-note" }, "of a form row", -1))
                  ]),
                  _(a(Tt), {
                    disabled: !p.value,
                    "aria-labelledby": de(N.namespace, x, "width"),
                    "model-value": a(St)(l.schema, N.namespace, x),
                    options: a(r),
                    "allow-empty": !1,
                    "onUpdate:modelValue": (W) => x.width = W
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                t("div", ci, [
                  t("div", pi, [
                    t("label", {
                      id: de(N.namespace, x, "scope")
                    }, "Varies per", 8, mi),
                    D[10] || (D[10] = t("span", { class: "pim-f-note" }, "dimensions the value depends on", -1))
                  ]),
                  _(Pe, {
                    disabled: !p.value,
                    labelledby: de(N.namespace, x, "scope"),
                    "model-value": x.scope ?? [],
                    options: Z.value,
                    "onUpdate:modelValue": (W) => k(x, W)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                O(x) ? c("", !0) : (e(), s("div", {
                  key: 4,
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": de(N.namespace, x, "default")
                }, [
                  t("div", fi, [
                    t("label", {
                      id: de(N.namespace, x, "default")
                    }, "Default", 8, gi),
                    D[11] || (D[11] = t("span", { class: "pim-f-note" }, "when no value is set", -1))
                  ]),
                  _(zs, {
                    disabled: !p.value,
                    attribute: x,
                    type: u(x),
                    onChange: (W) => E(x, "default", W)
                  }, null, 8, ["disabled", "attribute", "type", "onChange"])
                ], 8, vi)),
                u(x)?.config_schema ? (e(), s("div", {
                  key: 5,
                  class: "pim-f pim-w-full",
                  role: "group",
                  "aria-labelledby": de(N.namespace, x, "config")
                }, [
                  t("div", yi, [
                    t("label", {
                      id: de(N.namespace, x, "config")
                    }, "Type configuration", 8, hi)
                  ]),
                  _(qt, {
                    disabled: !p.value,
                    schema: u(x).config_schema,
                    "model-value": x.config ?? {},
                    "onUpdate:modelValue": (W) => A(x, W)
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue"])
                ], 8, bi)) : c("", !0)
              ]),
              _(ze, {
                class: "pim-field-advanced pim-ia-disclosure",
                label: "Advanced"
              }, {
                default: C(() => [
                  t("div", ki, [
                    t("div", _i, [
                      t("div", wi, [
                        t("label", {
                          for: de(N.namespace, x, "code")
                        }, "Integration key", 8, $i),
                        x.id !== void 0 ? (e(), s("span", Ci, "renaming keeps stored values")) : c("", !0)
                      ]),
                      _(a(lt), {
                        disabled: !p.value,
                        id: de(N.namespace, x, "code"),
                        type: "text",
                        value: x.code,
                        onInput: (W) => x.code = W.target.value,
                        class: "mono"
                      }, null, 8, ["disabled", "id", "value", "onInput"])
                    ]),
                    t("div", xi, [
                      t("div", Vi, [
                        t("label", {
                          id: de(N.namespace, x, "index")
                        }, "Search and filters", 8, ji),
                        D[12] || (D[12] = t("span", { class: "pim-f-note" }, "choose how this field can be matched", -1))
                      ]),
                      _(a(Ve), {
                        disabled: !p.value,
                        "aria-labelledby": de(N.namespace, x, "index"),
                        "model-value": x.index ?? "none",
                        options: (u(x)?.indexes ?? ["none"]).map((W) => ({ value: W, label: X[W] || a(H)(W) })),
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self",
                        "onUpdate:modelValue": (W) => E(x, "index", W === "none" ? void 0 : W)
                      }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ]),
                    t("div", Oi, [
                      t("div", Si, [
                        t("label", {
                          for: de(N.namespace, x, "unique")
                        }, "Unique", 8, Ui),
                        D[13] || (D[13] = t("span", { class: "pim-f-note" }, "one holder per value, catalog wide", -1))
                      ]),
                      t("div", Ai, [
                        _(a(dt), {
                          "input-id": de(N.namespace, x, "unique"),
                          "model-value": x.unique === !0,
                          disabled: !p.value || !!x.scope?.length || (x.cardinality ?? "one") !== "one",
                          "onUpdate:modelValue": (W) => E(x, "unique", W)
                        }, null, 8, ["input-id", "model-value", "disabled", "onUpdate:modelValue"]),
                        t("span", null, b(x.unique ? "Yes" : "No"), 1)
                      ])
                    ]),
                    (x.scope?.length ?? 0) > 0 && x.index && x.index !== "none" ? (e(), s("div", Ri, [
                      t("div", Pi, [
                        t("label", {
                          id: de(N.namespace, x, "contexts")
                        }, "Filterable combinations", 8, Ti),
                        D[14] || (D[14] = t("span", { class: "pim-f-note" }, "which combinations get an index", -1))
                      ]),
                      t("div", {
                        class: "pim-contexts",
                        role: "group",
                        "aria-labelledby": de(N.namespace, x, "contexts")
                      }, [
                        (e(!0), s(Q, null, se(R(x), (W, ce) => (e(), s("div", {
                          key: ce,
                          class: "pim-context-row"
                        }, [
                          (e(!0), s(Q, null, se(x.scope, (Ce) => (e(), s("div", {
                            key: Ce,
                            class: "pim-context-field"
                          }, [
                            t("span", {
                              id: de(N.namespace, x, "context-" + ce + "-" + Ce),
                              class: "small muted"
                            }, b(a(H)(Ce)), 9, qi),
                            _(a(Ve), {
                              disabled: !p.value,
                              "aria-labelledby": de(N.namespace, x, "context-" + ce + "-" + Ce),
                              "model-value": W[Ce] ?? "",
                              options: d(Ce),
                              class: "narrow",
                              appendTo: "self",
                              "onUpdate:modelValue": (Ye) => W[Ce] = Ye
                            }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                          ]))), 128)),
                          p.value ? (e(), P(a(Y), {
                            key: 0,
                            type: "button",
                            "aria-label": "Remove context",
                            onClick: (Ce) => R(x).splice(ce, 1),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: C(() => [
                              _(a(oe), { icon: "tabler:x" })
                            ]),
                            _: 1
                          }, 8, ["onClick"])) : c("", !0)
                        ]))), 128)),
                        p.value ? (e(), P(a(Y), {
                          key: 0,
                          type: "button",
                          onClick: (W) => j(x),
                          severity: "secondary",
                          outlined: "",
                          size: "small"
                        }, {
                          default: C(() => [
                            _(a(oe), {
                              icon: "tabler:plus",
                              "aria-hidden": "true"
                            }),
                            D[15] || (D[15] = ee(" Add context", -1))
                          ]),
                          _: 1
                        }, 8, ["onClick"])) : c("", !0)
                      ], 8, Ii)
                    ])) : c("", !0)
                  ])
                ]),
                _: 2
              }, 1024),
              p.value ? (e(), s("div", Di, [
                _(a(Y), {
                  type: "button",
                  onClick: (W) => Ge(N, x),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: C(() => [
                    _(a(oe), { icon: "tabler:trash" }),
                    D[16] || (D[16] = ee(" Remove field", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : c("", !0)
            ]),
            _: 2
          }, [
            p.value ? {
              name: "actions",
              fn: C(() => [
                ie > 0 ? (e(), P(a(Y), {
                  key: 0,
                  type: "button",
                  "aria-label": "Move " + a(H)(x.code) + " earlier",
                  onClick: (W) => te(W, N.attributes, ie, ie - 1),
                  text: "",
                  size: "small",
                  severity: "secondary"
                }, {
                  default: C(() => [
                    _(a(oe), {
                      icon: "tabler:arrow-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])) : c("", !0),
                ie < (N.attributes?.length ?? 0) - 1 ? (e(), P(a(Y), {
                  key: 1,
                  type: "button",
                  class: "pim-move-later",
                  "aria-label": "Move " + a(H)(x.code) + " later",
                  onClick: (W) => te(W, N.attributes, ie, ie + 1),
                  text: "",
                  size: "small",
                  severity: "secondary"
                }, {
                  default: C(() => [
                    _(a(oe), {
                      icon: "tabler:arrow-down",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])) : c("", !0)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "open", "onUpdate:open", "title", "kind"]))), 128))
        ]),
        _: 2
      }, 1032, ["count", "show-actions"]))), 128)),
      _(ft, {
        visible: !!T.value,
        label: ae.value,
        onClose: D[6] || (D[6] = (N) => T.value = void 0)
      }, {
        default: C(() => [
          T.value ? (e(), s("section", {
            key: 0,
            class: "pim-ia-dialog",
            onKeydown: D[5] || (D[5] = ot(Be((N) => T.value = void 0, ["prevent"]), ["esc"]))
          }, [
            t("header", Ni, [
              t("h2", Fi, b(ae.value), 1)
            ]),
            t("div", zi, [
              t("label", {
                id: a(ne) + "-writers"
              }, "Sources allowed to write", 8, Bi),
              _(a(rl), {
                disabled: !p.value,
                "aria-labelledby": a(ne) + "-writers",
                "model-value": T.value.write?.sources ?? [],
                options: y.value,
                "option-label": "label",
                "option-value": "value",
                placeholder: "Any source",
                "append-to": "self",
                "onUpdate:modelValue": D[2] || (D[2] = (N) => T.value.write = { sources: N })
              }, null, 8, ["disabled", "aria-labelledby", "model-value", "options"])
            ]),
            t("footer", Mi, [
              p.value ? (e(), P(a(Y), {
                key: 0,
                type: "button",
                label: "Remove field group",
                severity: "danger",
                text: "",
                onClick: D[3] || (D[3] = (N) => De(T.value))
              })) : c("", !0),
              _(a(Y), {
                type: "button",
                label: "Done",
                severity: "secondary",
                outlined: "",
                onClick: D[4] || (D[4] = (N) => T.value = void 0)
              })
            ])
          ], 32)) : c("", !0)
        ]),
        _: 1
      }, 8, ["visible", "label"])
    ]));
  }
}), Ei = { class: "muted small" }, Wi = { class: "pim-aspect" }, Hi = {
  key: 0,
  class: "small muted"
}, Ji = { class: "pim-fields" }, Ki = { class: "pim-f pim-w-full" }, Gi = { class: "pim-f-label" }, Yi = ["id"], Zi = { class: "pim-f-label" }, Qi = ["id"], Xi = /* @__PURE__ */ me({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(l, { emit: m }) {
    const i = l, n = m, o = B(() => i.schema.access.admin), r = B(() => i.draft.dimensions ?? []), v = Se();
    function p(y, $) {
      return v + "-" + y.name + "-" + $;
    }
    function h(y) {
      (i.draft.dimensions ??= []).push({ name: y, members: [] });
    }
    function L(y) {
      const $ = [];
      for (const u of i.draft.aspects ?? []) for (const S of u.attributes ?? []) S.scope?.includes(y.name) && $.push(`${H(S.code)} (${H(u.namespace)})`);
      for (const u of i.draft.families ?? []) for (const S of u.requirements ?? []) S.context && y.name in S.context && $.push(`${H(S.id)} (${H(u.code)})`);
      return $;
    }
    function M(y) {
      L(y).length || (r.value.splice(r.value.indexOf(y), 1), i.schema.declaration.dimensions?.some(($) => $.name === y.name) && n("remove", "dimensions", y.name));
    }
    function G(y, $) {
      if (y.members = $, y.fallback)
        for (const u of Object.keys(y.fallback)) $.includes(u) || delete y.fallback[u];
    }
    function Z(y, $) {
      return y.fallback?.[$] ?? [];
    }
    function F(y, $, u) {
      const S = { ...y.fallback ?? {} };
      u.length ? S[$] = u : delete S[$], Object.keys(S).length ? y.fallback = S : delete y.fallback;
    }
    return (y, $) => (e(), P(at, {
      count: r.value.length,
      columns: ["details", "usage"]
    }, xe({
      default: C(() => [
        (e(!0), s(Q, null, se(r.value, (u) => (e(), P(st, {
          "route-section": "dimensions",
          "route-id": u.name,
          title: a(H)(u.name),
          key: u.name,
          usage: L(u).length ? "Used in " + L(u).length + " places" : "Unused"
        }, xe({
          details: C(() => [
            t("span", Ei, b(u.members.map(a(H)).join(", ") || "No allowed values"), 1)
          ]),
          default: C(() => [
            t("div", Wi, [
              L(u).length ? (e(), s("p", Hi, "Used by " + b(L(u).join(", ")), 1)) : c("", !0),
              t("div", Ji, [
                t("div", Ki, [
                  t("div", Gi, [
                    t("label", {
                      id: p(u, "members")
                    }, "Allowed values", 8, Yi),
                    $[0] || ($[0] = t("span", { class: "pim-f-note" }, "for example, English and French for Language", -1))
                  ]),
                  _(Pe, {
                    disabled: !o.value,
                    labelledby: p(u, "members"),
                    "model-value": u.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (S) => G(u, S)
                  }, null, 8, ["disabled", "labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                (e(!0), s(Q, null, se(u.members, (S) => (e(), s("div", {
                  key: S,
                  class: "pim-f pim-w-half"
                }, [
                  t("div", Zi, [
                    t("label", {
                      id: p(u, "fallback-" + encodeURIComponent(S))
                    }, b(S) + " falls back to", 9, Qi),
                    $[1] || ($[1] = t("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  _(Pe, {
                    disabled: !o.value,
                    labelledby: p(u, "fallback-" + encodeURIComponent(S)),
                    "model-value": Z(u, S),
                    options: u.members.filter((O) => O !== S).map((O) => ({ value: O })),
                    "onUpdate:modelValue": (O) => F(u, S, O)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]))), 128))
              ])
            ])
          ]),
          _: 2
        }, [
          o.value ? {
            name: "actions",
            fn: C(() => [
              _(a(Y), {
                type: "button",
                disabled: L(u).length > 0,
                "aria-label": "Remove " + a(H)(u.name),
                title: L(u).length ? "Take the dimension off these first" : "",
                onClick: (S) => M(u),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: C(() => [
                  _(a(oe), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "title", "onClick"])
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["route-id", "title", "usage"]))), 128))
      ]),
      _: 2
    }, [
      o.value ? {
        name: "add",
        fn: C(() => [
          _(Me, {
            label: "Dimension name",
            "from-name": "",
            action: "Add dimension",
            existing: r.value.map((u) => u.name),
            onAdd: h
          }, {
            default: C(() => [...$[2] || ($[2] = [
              t("span", { class: "muted small" }, "A dimension lets a value differ per member, with fallbacks between members.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), en = { class: "muted small" }, tn = { class: "pim-aspect" }, ln = { class: "row small" }, an = {
  key: 1,
  class: "muted small"
}, sn = {
  key: 2,
  class: "pim-stack tight pim-terms"
}, nn = {
  key: 0,
  class: "muted small"
}, on = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, dn = {
  key: 3,
  class: "pim-responsive-table"
}, rn = {
  class: "pim-grid compact",
  "aria-label": "Vocabulary terms"
}, un = { key: 0 }, cn = { key: 1 }, pn = {
  key: 0,
  class: "muted"
}, mn = {
  key: 1,
  class: "num"
}, vn = {
  role: "list",
  class: "pim-stacked-list",
  "aria-label": "Vocabulary terms"
}, fn = {
  key: 0,
  class: "pim-stacked-meta muted small"
}, gn = {
  key: 4,
  class: "muted small"
}, bn = { class: "row wrap" }, yn = {
  key: 5,
  class: "row wrap pim-add-row"
}, hn = {
  key: 0,
  class: "pim-config-overrides"
}, kn = /* @__PURE__ */ me({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(l, { emit: m }) {
    const i = l, n = m, o = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/, r = B(() => i.schema.access.admin), v = B(() => r.value && i.schema.access.write), p = B(() => i.draft.vocabularies ?? []);
    function h(K) {
      (i.draft.vocabularies ??= []).push({ code: K });
    }
    function L(K) {
      p.value.splice(p.value.indexOf(K), 1), i.schema.declaration.vocabularies?.some((A) => A.code === K.code) && n("remove", "vocabularies", K.code);
    }
    function M(K) {
      return !!i.schema.vocabularies[K];
    }
    const G = J({}), Z = J({}), F = J({}), y = J({}), $ = J({}), u = J({}), S = J({}), O = J({});
    function V(K) {
      return !!($.value[K] || u.value[K]);
    }
    async function I(K, A) {
      $.value[K] = !0, delete S.value[K];
      try {
        const g = await ye.termsPage(i.catalogId, K, A);
        Z.value[K] = g.terms, y.value[K] = A, F.value[K] = g.next;
        const k = q(K);
        g.terms.some((E) => E.retired && E.code === k.parent) && (k.parent = "");
      } catch (g) {
        S.value[K] = { errors: [He(g, "Could not load terms.")], read: { after: A } };
      } finally {
        $.value[K] = !1;
      }
    }
    function X(K) {
      G.value[K] = !G.value[K], G.value[K] && !V(K) && !Z.value[K] && !S.value[K] && I(K);
    }
    function q(K) {
      return O.value[K] ?? (O.value[K] = { code: "", label: "", parent: "" });
    }
    function ne(K, A) {
      const g = Z.value[K]?.find((k) => k.code === A);
      return g ? Ee(g) : H(A);
    }
    function we(K) {
      return [{ value: "", label: "No parent" }, ...(Z.value[K] ?? []).filter((A) => !A.retired).map((A) => ({ value: A.code, label: Ee(A) }))];
    }
    function ge(K, A, g) {
      S.value[K] = { errors: A?.findings?.length ? A.findings.map((k) => ({ message: k.message ?? g, code: k.code })) : [{ message: g }] };
    }
    async function ke(K) {
      const A = q(K.code);
      if (!(!v.value || !o.test(A.code))) {
        u.value[K.code] = !0, delete S.value[K.code];
        try {
          const g = { term: { vocabulary: K.code, code: A.code }, labels: { en: A.label || H(A.code) } };
          K.hierarchical && A.parent && (g.parent = A.parent);
          const E = (await ye.apply(i.catalogId, [g])).outcomes[0];
          if (E?.outcome !== "created" && E?.outcome !== "updated") {
            ge(K.code, E, "The term was not accepted.");
            return;
          }
          O.value[K.code] = { code: "", label: "", parent: "" }, ye.invalidateTerms(i.catalogId), await I(K.code, y.value[K.code]);
        } catch (g) {
          S.value[K.code] = { errors: [He(g, "Could not add the term.")] };
        } finally {
          u.value[K.code] = !1;
        }
      }
    }
    async function de(K, A, g) {
      if (v.value && !(g && !await tt.confirm({ header: "Retire term?", message: `Retire ${Ee(A)}? Term changes save immediately. You can restore this term later.`, acceptLabel: "Retire", rejectLabel: "Cancel" }))) {
        u.value[K.code] = !0, delete S.value[K.code];
        try {
          const E = (await ye.apply(i.catalogId, [{ term: { vocabulary: K.code, code: A.code }, retired: g }])).outcomes[0];
          if (!E || !["updated", "unchanged"].includes(E.outcome)) {
            ge(K.code, E, "The term change was not accepted.");
            return;
          }
          g && q(K.code).parent === A.code && (q(K.code).parent = ""), ye.invalidateTerms(i.catalogId), await I(K.code, y.value[K.code]);
        } catch (k) {
          S.value[K.code] = { errors: [He(k, "Could not change the term.")] };
        } finally {
          u.value[K.code] = !1;
        }
      }
    }
    return (K, A) => (e(), P(at, {
      count: p.value.length,
      columns: ["details"]
    }, xe({
      default: C(() => [
        (e(!0), s(Q, null, se(p.value, (g) => (e(), P(st, {
          "route-section": "vocabularies",
          "route-id": g.code,
          title: a(H)(g.code),
          key: g.code
        }, {
          details: C(() => [
            t("span", en, b(g.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: C(() => [
            r.value ? (e(), P(a(Y), {
              key: 0,
              type: "button",
              "aria-label": "Remove " + a(H)(g.code),
              onClick: (k) => L(g),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: C(() => [
                _(a(oe), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])) : c("", !0)
          ]),
          default: C(() => [
            t("div", tn, [
              t("label", ln, [
                _(a(dt), {
                  disabled: !r.value,
                  "aria-label": "Hierarchical " + a(H)(g.code),
                  "model-value": g.hierarchical === !0,
                  "onUpdate:modelValue": (k) => k ? g.hierarchical = !0 : delete g.hierarchical
                }, null, 8, ["disabled", "aria-label", "model-value", "onUpdate:modelValue"]),
                A[0] || (A[0] = t("span", null, "Hierarchical", -1))
              ]),
              M(g.code) ? (e(), P(a(Y), {
                key: 0,
                type: "button",
                onClick: (k) => X(g.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: C(() => [
                  _(a(oe), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  ee(" " + b(G.value[g.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : r.value ? (e(), s("span", an, "Apply the schema before adding terms.")) : c("", !0),
              G.value[g.code] ? (e(), s("div", sn, [
                v.value ? (e(), s("p", nn, "Term changes save immediately.")) : c("", !0),
                $.value[g.code] ? (e(), s("div", on, "Loading terms…")) : S.value[g.code] ? (e(!0), s(Q, { key: 2 }, se(S.value[g.code].errors, (k, E) => (e(), P(ht, {
                  key: E,
                  error: k
                }, {
                  default: C(() => [
                    S.value[g.code].read ? (e(), P(a(Y), {
                      key: 0,
                      type: "button",
                      onClick: (R) => I(g.code, S.value[g.code].read?.after),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: C(() => [...A[1] || (A[1] = [
                        ee("Retry", -1)
                      ])]),
                      _: 1
                    }, 8, ["onClick"])) : c("", !0)
                  ]),
                  _: 2
                }, 1032, ["error"]))), 128)) : c("", !0),
                (Z.value[g.code] ?? []).length ? (e(), s("div", dn, [
                  t("table", rn, [
                    t("thead", null, [
                      t("tr", null, [
                        A[2] || (A[2] = t("th", null, "Term", -1)),
                        g.hierarchical ? (e(), s("th", un, "Parent")) : c("", !0),
                        r.value ? (e(), s("th", cn)) : c("", !0)
                      ])
                    ]),
                    t("tbody", null, [
                      (e(!0), s(Q, null, se(Z.value[g.code], (k) => (e(), s("tr", {
                        key: k.code,
                        class: Oe({ muted: k.retired })
                      }, [
                        t("td", null, [
                          ee(b(a(Ee)(k)) + " ", 1),
                          k.retired ? (e(), P(a(_e), {
                            key: 0,
                            severity: "secondary",
                            value: "Retired"
                          })) : c("", !0)
                        ]),
                        g.hierarchical ? (e(), s("td", pn, b(k.parent ? ne(g.code, k.parent) : "—"), 1)) : c("", !0),
                        r.value ? (e(), s("td", mn, [
                          _(a(Y), {
                            type: "button",
                            disabled: !v.value || V(g.code),
                            onClick: (E) => de(g, k, !k.retired),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: C(() => [
                              ee(b(k.retired ? "Restore" : "Retire"), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled", "onClick"])
                        ])) : c("", !0)
                      ], 2))), 128))
                    ])
                  ]),
                  t("ul", vn, [
                    (e(!0), s(Q, null, se(Z.value[g.code], (k) => (e(), s("li", {
                      key: k.code,
                      class: Oe(["pim-stacked-row", { muted: k.retired }])
                    }, [
                      t("div", null, [
                        ee(b(a(Ee)(k)) + " ", 1),
                        k.retired ? (e(), P(a(_e), {
                          key: 0,
                          severity: "secondary",
                          value: "Retired"
                        })) : c("", !0)
                      ]),
                      g.hierarchical && k.parent ? (e(), s("div", fn, "Parent: " + b(ne(g.code, k.parent)), 1)) : c("", !0),
                      r.value ? (e(), P(a(Y), {
                        key: 1,
                        type: "button",
                        disabled: !v.value || V(g.code),
                        onClick: (E) => de(g, k, !k.retired),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: C(() => [
                          ee(b(k.retired ? "Restore" : "Retire"), 1)
                        ]),
                        _: 2
                      }, 1032, ["disabled", "onClick"])) : c("", !0)
                    ], 2))), 128))
                  ])
                ])) : Z.value[g.code] && !V(g.code) && !S.value[g.code] ? (e(), s("p", gn, "No terms yet.")) : c("", !0),
                t("div", bn, [
                  _(a(Y), {
                    type: "button",
                    disabled: V(g.code) || !y.value[g.code],
                    onClick: (k) => I(g.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: C(() => [
                      _(a(oe), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      A[3] || (A[3] = ee(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  _(a(Y), {
                    type: "button",
                    disabled: V(g.code) || !F.value[g.code],
                    onClick: (k) => I(g.code, F.value[g.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: C(() => [
                      _(a(oe), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      A[4] || (A[4] = ee(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                r.value ? (e(), s("div", yn, [
                  _(a(lt), {
                    modelValue: q(g.code).label,
                    "onUpdate:modelValue": (k) => q(g.code).label = k,
                    disabled: !v.value || V(g.code),
                    "aria-label": "Term name in English",
                    type: "text",
                    placeholder: "Term name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  _(a(lt), {
                    modelValue: q(g.code).code,
                    "onUpdate:modelValue": (k) => q(g.code).code = k,
                    disabled: !v.value || V(g.code),
                    type: "text",
                    "aria-label": "Short term name",
                    placeholder: "Short name for imports",
                    class: "narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  g.hierarchical ? (e(), P(a(Ve), {
                    key: 0,
                    modelValue: q(g.code).parent,
                    "onUpdate:modelValue": (k) => q(g.code).parent = k,
                    disabled: !v.value || V(g.code),
                    class: "narrow",
                    "aria-label": "Parent term",
                    placeholder: "No parent",
                    options: we(g.code),
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "options"])) : c("", !0),
                  _(a(Y), {
                    type: "button",
                    disabled: !v.value || V(g.code) || !o.test(q(g.code).code),
                    onClick: (k) => ke(g),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: C(() => [
                      _(a(oe), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      A[5] || (A[5] = ee(" Add term", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])) : c("", !0),
                _(ze, {
                  class: "pim-ia-disclosure",
                  label: "Integration keys"
                }, {
                  default: C(() => [
                    (Z.value[g.code] ?? []).length ? (e(), s("dl", hn, [
                      (e(!0), s(Q, null, se(Z.value[g.code], (k) => (e(), s(Q, {
                        key: k.code
                      }, [
                        t("dt", null, b(a(Ee)(k)), 1),
                        t("dd", null, [
                          t("code", null, b(k.code), 1)
                        ])
                      ], 64))), 128))
                    ])) : c("", !0)
                  ]),
                  _: 2
                }, 1024)
              ])) : c("", !0)
            ])
          ]),
          _: 2
        }, 1032, ["route-id", "title"]))), 128))
      ]),
      _: 2
    }, [
      r.value ? {
        name: "add",
        fn: C(() => [
          _(Me, {
            label: "Vocabulary name",
            "from-name": "",
            action: "Add vocabulary",
            existing: p.value.map((g) => g.code),
            onAdd: h
          }, {
            default: C(() => [...A[6] || (A[6] = [
              t("span", { class: "muted small" }, "Select fields pick their values from a vocabulary's terms.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), _n = { class: "pim-stack" }, wn = { class: "muted small" }, $n = { class: "muted small" }, Cn = { class: "pim-aspect" }, xn = { class: "pim-ia-action pim-family-fields" }, Vn = { class: "pim-f" }, jn = { class: "pim-f-label" }, On = ["id"], Sn = ["id"], Un = { class: "pim-aspect" }, An = { class: "pim-stack tight" }, Rn = { class: "pim-level-head" }, Pn = { class: "pim-fields" }, Tn = { class: "pim-f pim-w-half" }, In = { class: "pim-f-label" }, qn = ["id"], Dn = { class: "pim-f pim-w-half" }, Nn = { class: "pim-f-label" }, Fn = ["id"], zn = { class: "pim-aspect" }, Bn = { class: "pim-stack tight" }, Mn = { class: "pim-level-head" }, Ln = { class: "muted small" }, En = { class: "pim-fields" }, Wn = { class: "pim-f-label" }, Hn = ["id"], Jn = { class: "pim-f pim-w-half" }, Kn = { class: "pim-f-label" }, Gn = ["id"], Yn = { class: "pim-f pim-w-half" }, Zn = { class: "pim-f-label" }, Qn = ["id"], Xn = {
  key: 0,
  class: "pim-aspect pim-family-remove"
}, eo = /* @__PURE__ */ me({
  __name: "BuilderFamilies",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove", "fields", "variant-field"],
  setup(l, { emit: m }) {
    const i = l, n = m, o = Se();
    function r(A, g) {
      return o + "-" + A.code + "-" + g;
    }
    const v = B(() => i.schema.access.admin), p = B(() => (i.draft.families ?? []).filter((A) => A.code !== "generic")), h = B(() => {
      const A = new Set(i.draft.plugins?.map((g) => g.use));
      return Object.entries(i.schema.attributes).filter(([, g]) => g.plugin && A.has(g.plugin));
    }), L = B(() => {
      const A = (i.draft.aspects ?? []).map((k) => k.namespace), g = [...new Set(h.value.map(([k]) => k.split(".")[0]))];
      return [...A, ...g.filter((k) => !A.includes(k))].map((k) => ({ value: k, label: H(k) }));
    });
    function M(A) {
      const g = L.value, k = (A.aspects ?? []).filter((E) => !g.some((R) => R.value === E));
      return [...g, ...k.map((E) => ({ value: E, label: H(E) }))];
    }
    const G = B(() => new Map(i.options.types.map((A) => [A.id, A.form])));
    function Z(A, g = []) {
      const k = /* @__PURE__ */ new Map();
      return [.../* @__PURE__ */ new Set([...A, ...g])].map((R) => {
        const [d, j] = R.split(".", 2), T = H(j ?? d);
        return k.set(T, (k.get(T) ?? 0) + 1), { value: R, label: T, group: j ? H(d) : void 0 };
      }).map(({ value: R, label: d, group: j }) => ({
        value: R,
        label: d,
        detail: k.get(d) > 1 ? j : void 0
      }));
    }
    const F = B(() => {
      const A = /* @__PURE__ */ new Map();
      function g(k, E, R = [], d = "one") {
        const j = !!E && E !== "text" && E !== "record" && R.length === 0 && d === "one";
        A.set(k, j);
      }
      for (const k of i.draft.aspects ?? [])
        for (const E of k.attributes ?? []) {
          const R = k.namespace + "." + E.code;
          g(R, G.value.get(E.type), E.scope, E.cardinality);
        }
      for (const [k, E] of h.value) g(k, E.form, E.scope, E.cardinality);
      return A;
    });
    function y(A) {
      return [...F.value.keys()].filter((g) => A.aspects?.includes(g.split(".")[0]));
    }
    function $(A, g, k) {
      const E = g[k] ?? [], R = new Set(q(A).flatMap((j) => [...j.axes ?? [], ...j.own ?? []])), d = y(A).filter((j) => E.includes(j) || !R.has(j) && (k === "own" || F.value.get(j)));
      return Z(d, E);
    }
    const u = B(() => i.draft.channels ?? []);
    function S(A, g) {
      return u.value.filter((k) => (!k.families?.length || k.families.includes(A.code)) && (!g || k.requirements?.includes(g))).map((k) => H(k.id));
    }
    const O = B(() => i.draft.dimensions ?? []), V = J({});
    function I(A) {
      (i.draft.families ??= []).push({ code: A, aspects: [] }), V.value[A] = !0;
    }
    function X(A) {
      i.draft.families.splice(i.draft.families.indexOf(A), 1), i.schema.declaration.families?.some((g) => g.code === A.code) && n("remove", "families", A.code);
    }
    function q(A) {
      return A.variation ?? [];
    }
    function ne(A) {
      return q(A).map((g) => ({
        level: g,
        axes: $(A, g, "axes"),
        own: $(A, g, "own")
      }));
    }
    function we(A) {
      (A.variation ??= []).push({ axes: [] });
    }
    function ge(A) {
      return A.requirements ?? [];
    }
    function ke(A, g) {
      (A.requirements ??= []).push({ id: g, require: [] });
    }
    function de(A, g) {
      return A.context?.[g] ?? "";
    }
    function K(A, g, k) {
      const E = { ...A.context ?? {} };
      k ? E[g] = k : delete E[g], Object.keys(E).length ? A.context = E : delete A.context;
    }
    return (A, g) => (e(), s("div", _n, [
      _(at, {
        count: p.value.length,
        columns: ["details"]
      }, xe({
        default: C(() => [
          (e(!0), s(Q, null, se(p.value, (k) => (e(), P(st, {
            "route-section": "families",
            "route-id": k.code,
            key: k.code,
            open: V.value[k.code],
            "onUpdate:open": (E) => V.value[k.code] = E,
            title: a(H)(k.code)
          }, {
            details: C(() => [
              t("span", wn, b(y(k).length) + " fields", 1),
              q(k).length ? (e(), P(a(_e), {
                key: 0,
                severity: "secondary",
                value: q(k).length + (q(k).length === 1 ? " variant level" : " variant levels")
              }, null, 8, ["value"])) : c("", !0),
              t("span", $n, b(S(k).join(", ") || "No release channels"), 1)
            ]),
            default: C(() => [
              t("div", Cn, [
                t("div", xn, [
                  t("div", Vn, [
                    t("div", jn, [
                      t("label", {
                        id: r(k, "groups")
                      }, "Field groups", 8, On)
                    ]),
                    t("p", {
                      id: r(k, "groups-help"),
                      class: "muted small pim-axis-help"
                    }, "Choose the groups that appear on this family’s product forms.", 8, Sn),
                    _(a(rl), {
                      disabled: !v.value,
                      "aria-labelledby": r(k, "groups"),
                      "aria-describedby": r(k, "groups-help"),
                      "model-value": k.aspects ?? [],
                      options: M(k),
                      "option-label": "label",
                      "option-value": "value",
                      placeholder: "Choose field groups",
                      display: "chip",
                      "append-to": "self",
                      "onUpdate:modelValue": (E) => a(We)(k, "aspects", E)
                    }, null, 8, ["disabled", "aria-labelledby", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])
                  ]),
                  k.aspects?.length ? (e(), P(a(Y), {
                    key: 0,
                    type: "button",
                    label: "View family fields",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (E) => n("fields", k.code)
                  }, null, 8, ["onClick"])) : c("", !0)
                ])
              ]),
              t("div", Un, [
                g[4] || (g[4] = t("header", { class: "pim-aspect-head" }, [
                  t("h3", null, "Variants")
                ], -1)),
                g[5] || (g[5] = t("p", { class: "muted small pim-axis-help" }, "Choose what makes one variant different from another. Each field can be used once.", -1)),
                t("div", An, [
                  (e(!0), s(Q, null, se(ne(k), ({ level: E, axes: R, own: d }, j) => (e(), s("div", {
                    key: j,
                    class: "pim-level"
                  }, [
                    t("div", Rn, [
                      t("strong", null, "Level " + b(j + 1), 1),
                      v.value ? (e(), P(a(Y), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove level",
                        onClick: (T) => q(k).splice(j, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: C(() => [
                          _(a(oe), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : c("", !0)
                    ]),
                    t("div", Pn, [
                      t("div", Tn, [
                        t("div", In, [
                          t("label", {
                            id: r(k, j + "-axes")
                          }, "Distinguish variants by", 8, qn)
                        ]),
                        g[1] || (g[1] = t("p", { class: "muted small pim-axis-help" }, "Use a field with a single value and no dimensions, such as Integer. Text and record fields are excluded.", -1)),
                        v.value && !R.length ? (e(), s(Q, { key: 0 }, [
                          g[0] || (g[0] = t("p", { class: "muted small pim-axis-help" }, "No eligible field is available in this family. Choose its field group above, or create the field first and choose its group when you return.", -1)),
                          _(a(Y), {
                            type: "button",
                            label: "Create a field in Fields",
                            severity: "secondary",
                            outlined: "",
                            size: "small",
                            class: "pim-form-action",
                            onClick: (T) => n("variant-field", k.code)
                          }, null, 8, ["onClick"])
                        ], 64)) : (e(), P(Pe, {
                          key: 1,
                          disabled: !v.value,
                          dropdown: "",
                          labelledby: r(k, j + "-axes"),
                          "model-value": E.axes ?? [],
                          options: R,
                          placeholder: "Choose a field",
                          "onUpdate:modelValue": (T) => E.axes = T
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"]))
                      ]),
                      t("div", Dn, [
                        t("div", Nn, [
                          t("label", {
                            id: r(k, j + "-owned")
                          }, "Other fields edited here", 8, Fn)
                        ]),
                        g[2] || (g[2] = t("p", { class: "muted small pim-axis-help" }, "Other fields you edit at this level.", -1)),
                        _(Pe, {
                          disabled: !v.value,
                          dropdown: "",
                          labelledby: r(k, j + "-owned"),
                          "model-value": E.own ?? [],
                          options: d,
                          placeholder: "Add a field",
                          "onUpdate:modelValue": (T) => T.length ? E.own = T : delete E.own
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  v.value ? (e(), P(a(Y), {
                    key: 0,
                    type: "button",
                    class: "pim-add-level",
                    onClick: (E) => we(k),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: C(() => [
                      _(a(oe), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      g[3] || (g[3] = ee(" Add level", -1))
                    ]),
                    _: 1
                  }, 8, ["onClick"])) : c("", !0)
                ])
              ]),
              t("div", zn, [
                g[8] || (g[8] = t("header", { class: "pim-family-requirements-head" }, [
                  t("h3", null, "Release requirements"),
                  t("p", { class: "muted small" }, "Choose what products need before they can be released to a channel.")
                ], -1)),
                t("div", Bn, [
                  (e(!0), s(Q, null, se(ge(k), (E, R) => (e(), s("div", {
                    key: E.id,
                    class: "pim-level"
                  }, [
                    t("div", Mn, [
                      t("div", null, [
                        t("strong", null, b(a(H)(E.id)), 1),
                        t("p", Ln, b(S(k, E.id).join(", ") || "Unused by channels"), 1)
                      ]),
                      v.value ? (e(), P(a(Y), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove requirement",
                        onClick: (d) => ge(k).splice(R, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: C(() => [
                          _(a(oe), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : c("", !0)
                    ]),
                    t("div", En, [
                      (e(!0), s(Q, null, se(O.value, (d) => (e(), s("div", {
                        key: d.name,
                        class: "pim-f pim-w-third"
                      }, [
                        t("div", Wn, [
                          t("label", {
                            id: r(k, E.id + "-context-" + d.name)
                          }, b(a(H)(d.name)), 9, Hn)
                        ]),
                        _(a(Ve), {
                          disabled: !v.value,
                          "aria-labelledby": r(k, E.id + "-context-" + d.name),
                          "model-value": de(E, d.name),
                          "onUpdate:modelValue": (j) => K(E, d.name, j),
                          options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ...d.members.map((j) => ({ value: j, label: String(j) }))],
                          "option-label": "label",
                          "option-value": "value",
                          appendTo: "self"
                        }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                      ]))), 128)),
                      t("div", Jn, [
                        t("div", Kn, [
                          t("label", {
                            id: r(k, E.id + "-required")
                          }, "Required", 8, Gn)
                        ]),
                        g[6] || (g[6] = t("p", { class: "muted small pim-axis-help" }, "These fields must have a value.", -1)),
                        _(Pe, {
                          disabled: !v.value,
                          dropdown: "",
                          labelledby: r(k, E.id + "-required"),
                          "model-value": E.require ?? [],
                          placeholder: "Add a required field",
                          options: Z(y(k), E.require),
                          "onUpdate:modelValue": (d) => a(We)(E, "require", d)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]),
                      t("div", Yn, [
                        t("div", Zn, [
                          t("label", {
                            id: r(k, E.id + "-authored")
                          }, "Entered for this context", 8, Qn)
                        ]),
                        g[7] || (g[7] = t("p", { class: "muted small pim-axis-help" }, "These fields need a value set directly for the selected context.", -1)),
                        _(Pe, {
                          disabled: !v.value,
                          dropdown: "",
                          labelledby: r(k, E.id + "-authored"),
                          "model-value": E.authored ?? [],
                          placeholder: "Add a field to author",
                          options: Z(y(k), E.authored),
                          "onUpdate:modelValue": (d) => a(We)(E, "authored", d)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  v.value ? (e(), P(Me, {
                    key: 0,
                    label: "Requirement name",
                    action: "Add requirement",
                    "from-name": "",
                    existing: ge(k).map((E) => E.id),
                    onAdd: (E) => ke(k, E)
                  }, null, 8, ["existing", "onAdd"])) : c("", !0)
                ])
              ]),
              v.value ? (e(), s("div", Xn, [
                _(a(Y), {
                  type: "button",
                  label: "Remove family",
                  severity: "danger",
                  text: "",
                  size: "small",
                  onClick: (E) => X(k)
                }, null, 8, ["onClick"])
              ])) : c("", !0)
            ]),
            _: 2
          }, 1032, ["route-id", "open", "onUpdate:open", "title"]))), 128))
        ]),
        _: 2
      }, [
        v.value ? {
          name: "head",
          fn: C(() => [
            _(Me, {
              label: "Family name",
              action: "Add family",
              "from-name": "",
              existing: p.value.map((k) => k.code),
              onAdd: I
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])
    ]));
  }
}), to = ["inert"], lo = {
  key: 0,
  class: "row wrap"
}, ao = {
  key: 2,
  class: "small muted"
}, so = { class: "pim-f" }, io = ["for"], no = ["id"], oo = /* @__PURE__ */ me({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(l, { emit: m }) {
    const i = l, n = m, o = J(!1), r = J(""), v = Se(), p = Se(), h = J({});
    let L = 0;
    fe(() => i.modelValue, async (y) => {
      const $ = ++L;
      try {
        const u = await cl(i.catalogId ?? "", y);
        $ === L && (h.value = u);
      } catch {
        $ === L && (h.value = {});
      }
    }, { immediate: !0, deep: !0 }), Ke(() => {
      L++;
    });
    function M(y) {
      return h.value[y] ?? pe(y, "Person");
    }
    ol(async () => {
      try {
        await Ql("wc-principal-picker"), o.value = !0;
      } catch {
        o.value = !1;
      }
    });
    function G(y) {
      i.disabled || !y.trim() || i.modelValue.includes(y.trim()) || (n("update:modelValue", [...i.modelValue, y.trim()]), r.value = "");
    }
    function Z(y) {
      const $ = y.detail;
      if (!$ || typeof $ != "object") return;
      const u = $, S = u.principal_id ?? u.id;
      typeof S == "string" && G(S);
    }
    function F(y) {
      i.disabled || n("update:modelValue", i.modelValue.filter(($) => $ !== y));
    }
    return (y, $) => (e(), s("div", {
      class: "pim-principal-list",
      inert: l.disabled || void 0
    }, [
      l.modelValue.length ? (e(), s("div", lo, [
        (e(!0), s(Q, null, se(l.modelValue, (u) => (e(), P(a(_e), {
          key: u,
          severity: "secondary"
        }, {
          default: C(() => [
            t("span", null, b(M(u)), 1),
            _(a(Y), {
              text: "",
              size: "small",
              disabled: l.disabled,
              "aria-label": "Remove " + M(u),
              onClick: (S) => F(u)
            }, {
              default: C(() => [
                _(a(oe), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : c("", !0),
      o.value ? (e(), s("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: Be(Z, ["stop"])
      }, null, 32)) : (e(), s("span", ao, "The person picker is unavailable.")),
      t("div", so, [
        t("label", {
          for: a(v),
          class: "small muted"
        }, "Service account ID", 8, io),
        _(a(lt), {
          modelValue: r.value,
          "onUpdate:modelValue": $[0] || ($[0] = (u) => r.value = u),
          id: a(v),
          "aria-describedby": a(p),
          disabled: l.disabled,
          onKeydown: $[1] || ($[1] = ot(Be((u) => G(r.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "id", "aria-describedby", "disabled"]),
        t("p", {
          id: a(p),
          class: "small muted pim-axis-help"
        }, "Ask whoever manages the service account for its principal ID.", 8, no)
      ]),
      _(a(Y), {
        type: "button",
        severity: "secondary",
        outlined: "",
        size: "small",
        class: "pim-form-action",
        disabled: l.disabled || !r.value.trim(),
        onClick: $[2] || ($[2] = (u) => G(r.value))
      }, {
        default: C(() => [
          _(a(oe), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          $[3] || ($[3] = ee(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, to));
  }
}), ro = { class: "pim-stack" }, uo = { class: "muted small" }, co = { class: "muted small" }, po = { class: "pim-fields" }, mo = { class: "pim-f pim-w-half" }, vo = { class: "pim-f-label" }, fo = ["id"], go = { class: "muted small pim-axis-help" }, bo = { class: "pim-f pim-w-half" }, yo = { class: "pim-f-label" }, ho = ["id"], ko = { class: "muted small" }, _o = { class: "muted small" }, wo = { class: "pim-fields" }, $o = ["aria-labelledby", "aria-describedby"], Co = { class: "pim-f-label" }, xo = ["id"], Vo = ["id"], jo = { key: 1 }, Oo = { class: "pim-f pim-w-half" }, So = { class: "pim-f-label" }, Uo = ["id"], Ao = { class: "pim-f pim-w-full" }, Ro = { class: "mono" }, Po = { class: "pim-f pim-w-half" }, To = { class: "pim-f-label" }, Io = ["id"], qo = { class: "pim-f pim-w-half" }, Do = { class: "pim-f-label" }, No = ["for"], Fo = { class: "row" }, zo = /* @__PURE__ */ me({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {},
    view: {}
  },
  emits: ["remove", "requirements"],
  setup(l, { emit: m }) {
    const i = l, n = m, o = Se();
    function r(I, X) {
      return o + "-" + I + "-" + X;
    }
    const v = B(() => i.schema.access.admin), p = B(() => i.draft.channels ?? []), h = B(() => i.draft.sources ?? []), L = B(() => {
      const I = /* @__PURE__ */ new Map();
      for (const X of i.draft.families ?? [])
        for (const { id: q } of X.requirements ?? []) {
          const ne = I.get(q) ?? [];
          ne.push(H(X.code)), I.set(q, ne);
        }
      return new Map([...I].map(([X, q]) => [X, H(X) + " · " + q.join(", ")]));
    }), M = B(() => [...L.value].map(([I, X]) => ({ value: I, label: X }))), G = B(() => (i.draft.families ?? []).filter((I) => I.code !== "generic").map((I) => ({ value: I.code, label: H(I.code) }))), Z = B(() => (i.draft.aspects ?? []).map((I) => ({ value: I.namespace, label: H(I.namespace) }))), F = J({}), y = J({});
    function $(I) {
      const X = I.principals?.length ?? 0;
      return X ? X + (X === 1 ? " allowed account" : " allowed accounts") : "Any catalog writer";
    }
    function u(I) {
      (i.draft.channels ??= []).push({ id: I, requirements: [] }), F.value[I] = !0;
    }
    function S(I) {
      p.value.splice(p.value.indexOf(I), 1), i.schema.declaration.channels?.some((X) => X.id === I.id) && n("remove", "channels", I.id);
    }
    function O(I) {
      (i.draft.sources ??= []).push({ id: I, ordering: "none", writes: [] }), y.value[I] = !0;
    }
    function V(I) {
      h.value.splice(h.value.indexOf(I), 1), i.schema.declaration.sources?.some((X) => X.id === I.id) && n("remove", "sources", I.id);
    }
    return (I, X) => (e(), s("div", ro, [
      l.view !== "sources" ? (e(), P(at, {
        key: 0,
        count: p.value.length,
        columns: ["details"]
      }, xe({
        default: C(() => [
          (e(!0), s(Q, null, se(p.value, (q) => (e(), P(st, {
            key: q.id,
            open: F.value[q.id],
            "onUpdate:open": (ne) => F.value[q.id] = ne,
            "route-section": "channels",
            "route-id": q.id,
            title: a(H)(q.id)
          }, xe({
            details: C(() => [
              t("span", uo, b(q.families?.length ? q.families.map(a(H)).join(", ") : "All families"), 1),
              t("span", co, b(q.requirements?.length ? q.requirements.map((ne) => L.value.get(ne) ?? a(H)(ne)).join(", ") : "No release requirements"), 1)
            ]),
            default: C(() => [
              t("div", po, [
                t("div", mo, [
                  t("div", vo, [
                    t("label", {
                      id: r(q.id, "requirements")
                    }, "Release requirements", 8, fo)
                  ]),
                  t("p", go, b(M.value.length ? "Choose what products must meet before release to this channel." : "No family has defined a release requirement yet."), 1),
                  M.value.length || q.requirements?.length ? (e(), P(Pe, {
                    key: 0,
                    disabled: !v.value,
                    labelledby: r(q.id, "requirements"),
                    "model-value": q.requirements ?? [],
                    options: M.value,
                    "onUpdate:modelValue": (ne) => a(We)(q, "requirements", ne)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])) : c("", !0),
                  v.value ? (e(), P(a(Y), {
                    key: 1,
                    type: "button",
                    label: "Create a requirement in Families",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    class: "pim-form-action",
                    onClick: (ne) => n("requirements", q.id)
                  }, null, 8, ["onClick"])) : c("", !0)
                ]),
                t("div", bo, [
                  t("div", yo, [
                    t("label", {
                      id: r(q.id, "families")
                    }, "Families", 8, ho)
                  ]),
                  X[0] || (X[0] = t("p", { class: "muted small pim-axis-help" }, "Applies to every family unless you choose specific families.", -1)),
                  _(Pe, {
                    disabled: !v.value,
                    labelledby: r(q.id, "families"),
                    "model-value": q.families ?? [],
                    options: G.value,
                    "onUpdate:modelValue": (ne) => a(We)(q, "families", ne)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            v.value ? {
              name: "actions",
              fn: C(() => [
                _(a(Y), {
                  type: "button",
                  onClick: (ne) => S(q),
                  "aria-label": "Remove " + a(H)(q.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: C(() => [
                    _(a(oe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["onClick", "aria-label"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["open", "onUpdate:open", "route-id", "title"]))), 128))
        ]),
        _: 2
      }, [
        v.value ? {
          name: "head",
          fn: C(() => [
            _(Me, {
              label: "Channel name",
              action: "Add channel",
              "from-name": "",
              existing: p.value.map((q) => q.id),
              onAdd: u
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])) : c("", !0),
      l.view !== "channels" ? (e(), P(at, {
        key: 1,
        count: h.value.length,
        columns: ["details"]
      }, xe({
        default: C(() => [
          (e(!0), s(Q, null, se(h.value, (q) => (e(), P(st, {
            key: q.id,
            open: y.value[q.id],
            "onUpdate:open": (ne) => y.value[q.id] = ne,
            "route-section": "sources",
            "route-id": q.id,
            title: a(H)(q.id)
          }, xe({
            details: C(() => [
              t("span", ko, b($(q)), 1),
              t("span", _o, b(q.writes?.length ? q.writes.map(a(H)).join(", ") : "No writable field groups"), 1)
            ]),
            default: C(() => [
              t("div", wo, [
                t("div", {
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": r(q.id, "people"),
                  "aria-describedby": r(q.id, "people-help")
                }, [
                  t("div", Co, [
                    t("label", {
                      id: r(q.id, "people")
                    }, "People and service accounts", 8, xo)
                  ]),
                  t("p", {
                    id: r(q.id, "people-help"),
                    class: "muted small pim-axis-help"
                  }, "If you leave this empty, anyone who can write to the catalog can use this source.", 8, Vo),
                  v.value ? (e(), P(oo, {
                    key: 0,
                    "catalog-id": l.catalogId,
                    "model-value": q.principals ?? [],
                    "onUpdate:modelValue": (ne) => a(We)(q, "principals", ne)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])) : (e(), s("span", jo, b($(q)), 1))
                ], 8, $o),
                t("div", Oo, [
                  t("div", So, [
                    t("label", {
                      id: r(q.id, "writes")
                    }, "Field groups it can update", 8, Uo)
                  ]),
                  X[1] || (X[1] = t("p", { class: "muted small pim-axis-help" }, "If you leave this empty, this source cannot update any field values.", -1)),
                  _(Pe, {
                    disabled: !v.value,
                    labelledby: r(q.id, "writes"),
                    "model-value": q.writes ?? [],
                    options: Z.value,
                    "onUpdate:modelValue": (ne) => a(We)(q, "writes", ne)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                t("div", Ao, [
                  X[2] || (X[2] = t("div", { class: "pim-f-label" }, [
                    t("strong", null, "Source identifier")
                  ], -1)),
                  X[3] || (X[3] = t("p", { class: "muted small pim-axis-help" }, [
                    ee("Send this exact identifier in the "),
                    t("code", null, "source"),
                    ee(" field of the update request.")
                  ], -1)),
                  t("div", null, [
                    t("code", Ro, b(q.id), 1)
                  ])
                ]),
                t("div", Po, [
                  t("div", To, [
                    t("label", {
                      id: r(q.id, "ordering")
                    }, "Handle incoming updates", 8, Io)
                  ]),
                  X[4] || (X[4] = t("p", { class: "muted small pim-axis-help" }, "Use the sender’s sequence numbers to prevent late deliveries from overwriting newer values.", -1)),
                  _(a(Ve), {
                    disabled: !v.value,
                    "aria-labelledby": r(q.id, "ordering"),
                    "model-value": q.ordering ?? "none",
                    "onUpdate:modelValue": (ne) => q.ordering = ne,
                    options: [{ value: "none", label: "Use arrival order" }, { value: "sequence", label: "Use the source’s sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                t("div", qo, [
                  t("div", Do, [
                    t("label", {
                      for: r(q.id, "audit")
                    }, "Track value changes", 8, No)
                  ]),
                  t("div", Fo, [
                    _(a(dt), {
                      disabled: !v.value,
                      "input-id": r(q.id, "audit"),
                      "model-value": q.audit !== !1,
                      "onUpdate:modelValue": (ne) => ne ? delete q.audit : q.audit = !1
                    }, null, 8, ["disabled", "input-id", "model-value", "onUpdate:modelValue"]),
                    t("span", null, b(q.audit === !1 ? "Off for this source" : "Follow catalog audit settings"), 1)
                  ])
                ])
              ])
            ]),
            _: 2
          }, [
            v.value ? {
              name: "actions",
              fn: C(() => [
                _(a(Y), {
                  type: "button",
                  onClick: (ne) => V(q),
                  "aria-label": "Remove " + a(H)(q.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: C(() => [
                    _(a(oe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["onClick", "aria-label"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["open", "onUpdate:open", "route-id", "title"]))), 128))
        ]),
        _: 2
      }, [
        v.value ? {
          name: "head",
          fn: C(() => [
            _(Me, {
              label: "Source name",
              action: "Add source",
              "from-name": "",
              existing: h.value.map((q) => q.id),
              onAdd: O
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])) : c("", !0)
    ]));
  }
}), Bo = ["aria-labelledby"], Mo = {
  key: 0,
  class: "kx-settings-group-head"
}, Lo = ["id"], Eo = {
  key: 0,
  class: "kx-settings-group-count"
}, Wo = { class: "kx-settings-group-list" }, el = /* @__PURE__ */ me({
  __name: "SettingsGroup",
  props: {
    title: {},
    count: {}
  },
  setup(l) {
    const m = Se();
    return (i, n) => (e(), s("section", {
      class: "kx-settings-group",
      "aria-labelledby": l.title ? a(m) : void 0
    }, [
      l.title ? (e(), s("div", Mo, [
        t("h2", {
          id: a(m),
          class: "kx-settings-group-title"
        }, b(l.title), 9, Lo),
        l.count !== void 0 ? (e(), s("span", Eo, b(l.count), 1)) : c("", !0)
      ])) : c("", !0),
      t("div", Wo, [
        he(i.$slots, "default")
      ])
    ], 8, Bo));
  }
}), Ho = { class: "kx-settings-item-head" }, Jo = { class: "kx-settings-item-main" }, Ko = { class: "kx-settings-item-line" }, Go = { class: "kx-settings-item-title" }, Yo = {
  key: 0,
  class: "kx-settings-item-desc"
}, Zo = {
  key: 1,
  class: "kx-settings-item-meta"
}, Qo = { class: "kx-settings-item-actions" }, Xo = ["aria-expanded", "aria-controls", "aria-label"], ed = ["id", "inert"], td = { class: "kx-settings-item-clip" }, ld = { class: "kx-settings-item-body" }, tl = /* @__PURE__ */ me({
  __name: "SettingsItem",
  props: /* @__PURE__ */ gt({
    title: {},
    description: {},
    expandLabel: {},
    keepMounted: { type: Boolean }
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(l) {
    const m = l, i = At(l, "open"), n = Kl(), o = Se(), r = J(i.value);
    return fe(i, (v) => {
      v && (r.value = !0);
    }), (v, p) => (e(), s("article", {
      class: Oe(["kx-settings-item", { "kx-settings-item-open": i.value && a(n).default }])
    }, [
      t("div", Ho, [
        t("div", Jo, [
          t("div", Ko, [
            t("h3", Go, b(l.title), 1),
            he(v.$slots, "status")
          ]),
          l.description ? (e(), s("p", Yo, b(l.description), 1)) : c("", !0),
          a(n).meta ? (e(), s("p", Zo, [
            he(v.$slots, "meta")
          ])) : c("", !0)
        ]),
        t("div", Qo, [
          a(n).default ? (e(), s("button", {
            key: 0,
            type: "button",
            class: "kx-settings-item-expand",
            "aria-expanded": i.value,
            "aria-controls": a(o),
            "aria-label": (l.expandLabel || "Details") + " " + l.title,
            onClick: p[0] || (p[0] = (h) => i.value = !i.value)
          }, [
            t("span", null, b(l.expandLabel || "Details"), 1),
            _(a(oe), {
              icon: "tabler:chevron-down",
              "aria-hidden": "true"
            })
          ], 8, Xo)) : c("", !0),
          he(v.$slots, "actions")
        ])
      ]),
      a(n).default ? (e(), P(nl, {
        key: 0,
        name: "kx-settings-item-motion"
      }, {
        default: C(() => [
          r.value || m.keepMounted ? Rt((e(), s("div", {
            key: 0,
            id: a(o),
            inert: !i.value,
            class: "kx-settings-item-panel"
          }, [
            t("div", td, [
              t("div", ld, [
                he(v.$slots, "default")
              ])
            ])
          ], 8, ed)), [
            [Pt, i.value]
          ]) : c("", !0)
        ]),
        _: 3
      })) : c("", !0)
    ], 2));
  }
});
function ad(l, m, i) {
  const n = /* @__PURE__ */ new Map();
  for (const r of l) {
    const v = m(r)?.trim() ?? "", p = n.get(v);
    p ? p.push(r) : n.set(v, [r]);
  }
  const o = [...n].map(([r, v]) => ({
    title: r,
    rows: [...v.filter(i), ...v.filter((p) => !i(p))]
  }));
  return o.length === 1 && o[0].title === "" ? o : o.map((r) => r.title ? r : { ...r, title: "Other" }).sort((r, v) => r.title === "Other" ? 1 : v.title === "Other" ? -1 : r.title.localeCompare(v.title));
}
function ll(l) {
  return l.length < 2 ? l[0] ?? "" : l.slice(0, -1).join(", ") + " and " + l[l.length - 1];
}
const sd = {
  failed: { label: "Setup failed", severity: "danger" },
  paused: { label: "Paused", severity: "warn" },
  degraded: { label: "Needs attention", severity: "warn" },
  catchingUp: { label: "Catching up", severity: "info" },
  config: { label: "Needs configuration", severity: "warn" },
  reset: { label: "Stopped", severity: "warn" },
  uninstalled: { label: "Not installed", severity: "warn" },
  pending: { label: "Setting up", severity: "info" }
};
function vl(l, m) {
  return !l.parked && (l.bootstrapping || l.last_seq < m);
}
function id(l, m) {
  return !l.active || !l.installed || l.problem || l.lifecycle.state === "failed" ? !1 : l.lifecycle.state === "pending" || Object.values(l.projections).some((i) => vl(i, m));
}
function nd(l, m) {
  const i = l.problem ?? l.lifecycle.error, n = Object.entries(l.projections), o = n.find(([, v]) => v.parked) ?? n.find(([, v]) => v.error) ?? n.find(([, v]) => vl(v, m));
  let r;
  return l.active && !l.installed ? r = "uninstalled" : i?.code === "plugin_config_invalid" ? r = "config" : i?.code === "plugin_projection_history_pruned" ? r = "reset" : i || l.lifecycle.state === "failed" ? r = "failed" : l.active && o?.[1].parked ? r = "paused" : l.active && o?.[1].error ? r = "degraded" : l.active && o ? r = "catchingUp" : l.active && l.lifecycle.state === "pending" && (r = "pending"), r ? { kind: r, ...sd[r], error: i, projection: o } : void 0;
}
function od(l) {
  return (l.problem ?? l.lifecycle.error)?.code === "plugin_interface_version_unsupported";
}
function dd({
  catalogId: l,
  shouldPoll: m,
  schema: i,
  options: n,
  busy: o,
  stale: r,
  editable: v,
  saved: p,
  clearError: h,
  reportError: L
}) {
  const M = Je(), G = Je();
  fe(l, G.begin), Ke(() => {
    M.begin(), G.begin();
  });
  async function Z(S = !1) {
    const O = l(), V = i.value, I = M.begin();
    try {
      const [X, q] = await Promise.all([ye.schema(O), S ? ye.schemaOptions(O) : void 0]);
      return !V || !M.current(I) || O !== l() || i.value !== V ? !1 : (V.plugins = X.plugins, V.as_of = X.as_of, q && (n.value = q), !0);
    } catch (X) {
      return S && M.current(I) && O === l() && L(X, "Could not check plugin status."), !1;
    }
  }
  async function F(S) {
    const O = l(), V = i.value?.plugins.find((X) => X.plugin === S && X.active && X.installed);
    if (!V?.config || o.value || r.value || !v.value || !await tt.confirm({
      header: "Reset background updates?",
      message: "Background updates will start from a new catalog event. Current product data will be rebuilt into the plugin’s index. Earlier events will be skipped.",
      acceptLabel: "Reset background updates",
      rejectLabel: "Cancel"
    }) || l() !== O || o.value) return;
    const I = G.begin();
    M.begin(), o.value = !0, h(), p.value = "";
    try {
      await ye.configurePlugin(O, S, et(V.config), !0), G.current(I) && await Z(!0) && G.current(I) && (p.value = "Background update reset requested.");
    } catch (X) {
      G.current(I) && L(X, "Could not reset background updates.");
    } finally {
      G.current(I) && (o.value = !1);
    }
  }
  async function y(S) {
    const O = l();
    if (!(o.value || r.value || !v.value)) {
      o.value = !0, h(), p.value = "";
      try {
        await ye.resumePluginProjection(O, S), l() === O && await Z(!0) && (p.value = "Background update resumed.");
      } catch (V) {
        l() === O && L(V, "Could not resume the background update.");
      } finally {
        l() === O && (o.value = !1);
      }
    }
  }
  async function $(S) {
    const O = l();
    if (!(o.value || r.value || !v.value) && !(!await tt.confirm({
      header: "Clear catalog app binding?",
      message: "The catalog will use the default app after this setting is saved.",
      acceptLabel: "Clear binding",
      rejectLabel: "Cancel"
    }) || l() !== O || o.value || !v.value || !i.value?.plugins.some((V) => V.references?.shell_bindings.includes(S)))) {
      o.value = !0, h(), p.value = "";
      try {
        if (await ye.updateCatalogApp(O, ""), l() !== O) return;
        await Z(!0) && (p.value = "Catalog app binding cleared.");
      } catch (V) {
        l() === O && L(V, "Could not clear the catalog app binding.");
      } finally {
        l() === O && (o.value = !1);
      }
    }
  }
  const u = B(() => m() && !o.value && i.value?.plugins.some((S) => id(S, i.value.as_of)) === !0);
  return fe(u, (S, O, V) => {
    if (!S) return;
    let I, X = !0;
    const q = () => {
      I = setTimeout(async () => {
        await Z() && X && u.value && q();
      }, 2e3);
    };
    q(), V(() => {
      X = !1, clearTimeout(I);
    });
  }), { refreshPluginStatus: Z, resetPlugin: F, resumePluginProjection: y, clearShellBinding: $ };
}
const rd = { class: "pim-stack pim-plugins" }, ud = {
  key: 0,
  class: "muted small",
  role: "status"
}, cd = {
  key: 1,
  class: "muted"
}, pd = { key: 0 }, md = { key: 1 }, vd = { key: 2 }, fd = { class: "pim-stack pim-plugin-recovery" }, gd = { key: 0 }, bd = { key: 1 }, yd = {
  key: 2,
  class: "small"
}, hd = { class: "row pim-plugin-action" }, kd = {
  key: 0,
  class: "small"
}, _d = {
  key: 1,
  class: "row pim-plugin-action"
}, wd = { key: 0 }, $d = { key: 1 }, Cd = { key: 2 }, xd = { key: 3 }, Vd = { class: "small" }, jd = { class: "row pim-plugin-action" }, Od = { class: "row pim-plugin-action" }, Sd = {
  key: 4,
  class: "muted small"
}, Ud = {
  key: 6,
  class: "muted small"
}, Ad = { class: "pim-stack" }, Rd = { key: 0 }, Pd = { key: 1 }, Td = { key: 2 }, Id = { key: 3 }, qd = { key: 4 }, Dd = { key: 0 }, Nd = { key: 5 }, Fd = { key: 6 }, zd = {
  key: 0,
  class: "pim-ia-dialog"
}, Bd = { class: "pim-ia-dialog-head" }, Md = { key: 1 }, Ld = { key: 2 }, Ed = { class: "row pim-ia-dialog-actions" }, Wd = { class: "row wrap muted small" }, Hd = /* @__PURE__ */ me({
  __name: "BuilderPlugins",
  props: {
    draft: {},
    schema: {},
    options: {},
    pluginConfigs: { default: () => ({}) },
    refusal: {},
    stale: { type: Boolean }
  },
  emits: ["remove", "reset", "resume", "refresh", "review", "clearShellBinding", "clearRefusal", "invalid-draft"],
  setup(l, { expose: m, emit: i }) {
    const n = l, o = i, r = /* @__PURE__ */ new Map([
      ["eq", "Equals"],
      ["in", "Is one of"],
      ["gt", "Greater than"],
      ["gte", "At least"],
      ["lt", "Less than"],
      ["lte", "At most"]
    ]), v = J({}), p = {
      hold_seconds: "Default and maximum time stock stays set aside after a reservation starts. Leave empty to use the deployment default."
    }, h = /* @__PURE__ */ new Map(), L = J(/* @__PURE__ */ new Set()), M = J(/* @__PURE__ */ new Set());
    fe(() => M.value.size > 0, (R) => o("invalid-draft", R));
    function G(R, d, j) {
      d ? L.value.delete(R) : L.value.add(R), j ? M.value.add(R) : M.value.delete(R);
    }
    function Z() {
      const R = I.value.find(({ plugin: d, chosen: j }) => j && L.value.has(d.plugin) && (M.value.has(d.plugin) || Object.hasOwn(n.pluginConfigs, d.plugin) || !d.active || n.refusal?.plugin === d.plugin));
      return R ? (v.value[R.plugin.plugin] = !0, qe(() => h.get(R.plugin.plugin)?.reportValidity()), !1) : !0;
    }
    m({ reportValidity: Z }), fe(() => n.refusal, (R) => {
      R && (v.value[R.plugin] = !0);
    }, { immediate: !0 });
    const F = J(), y = B(() => I.value.find((R) => R.plugin.plugin === F.value)), $ = B(() => y.value?.plugin), u = B(() => n.schema.access.admin), S = B(() => n.draft.plugins ?? []), O = B(() => new Map(n.schema.plugins.map((R) => [R.plugin, R]))), V = B(() => {
      const R = /* @__PURE__ */ new Map();
      for (const [d, j] of Object.entries(n.schema.attributes)) {
        if (!j.plugin) continue;
        const T = R.get(j.plugin) ?? [];
        T.push(H(d)), R.set(j.plugin, T);
      }
      return R;
    }), I = B(() => n.options.plugins.map((R) => {
      const d = O.value.get(R.plugin) ?? R, j = nd(d, n.schema.as_of), T = S.value.some((te) => te.use === d.plugin), ae = n.refusal?.plugin === d.plugin ? n.refusal : void 0;
      return {
        option: R,
        plugin: d,
        status: j,
        chosen: T,
        refusal: ae,
        title: pe(d.title ?? R.title, d.installed ? "Plugin" : "Unavailable plugin"),
        label: ae || M.value.has(d.plugin) ? "Needs configuration" : !d.active && j?.kind === "failed" ? "Unavailable" : j?.label ?? (T ? d.active ? "Enabled" : "Turns on when applied" : d.active ? "Turns off when applied" : "Available"),
        severity: ae || M.value.has(d.plugin) ? "warn" : j?.severity ?? (T === d.active ? T ? "success" : "secondary" : "info"),
        configurable: T && d.installed && j?.kind !== "failed" && j?.kind !== "uninstalled" && (Object.keys(R.config_schema.properties ?? {}).length > 0 || j?.kind === "config"),
        needs: R.requires.map(ne),
        usedBy: n.options.plugins.filter((te) => te.requires.includes(d.plugin) && S.value.some(($e) => $e.use === te.plugin)).map((te) => ne(te.plugin)),
        open: v.value[d.plugin] ?? (T && (!d.active || !!n.pluginConfigs[d.plugin]) || !!(d.active && j && j.kind !== "pending"))
      };
    })), X = B(() => ad(I.value, (R) => R.option.category, (R) => R.plugin.active)), q = jt(It, void 0);
    fe(() => q?.selected.value, (R, d) => {
      for (const [j, T] of [[d, !1], [R, !0]])
        j?.startsWith("plugins/") && (v.value[j.slice(8)] = T);
    }, { immediate: !0 });
    function ne(R) {
      return pe(n.options.plugins.find((d) => d.plugin === R)?.title, "Another plugin");
    }
    function we(R, d) {
      v.value[R] = d, q?.choose("plugins", R, d);
    }
    function ge(R, d) {
      const j = d.map((T) => r.get(T)).filter(Boolean);
      return [H(R), j.join(", ")].filter(Boolean).join(" · ");
    }
    function ke(R, d) {
      d && !S.value.some((j) => j.use === R) && ((n.draft.plugins ??= []).push({ use: R }), v.value[R] = !0), d || (v.value[R] = !1, n.draft.plugins = S.value.filter((j) => j.use !== R), delete n.pluginConfigs[R], n.refusal?.plugin === R && o("clearRefusal"), O.value.get(R)?.active && o("remove", "plugins", R));
    }
    function de(R, d) {
      v.value[R] = !0;
      const j = n.pluginConfigs[R] ?? O.value.get(R)?.config ?? {};
      n.pluginConfigs[R] = d, n.refusal?.plugin === R && JSON.stringify(j[n.refusal.field]) !== JSON.stringify(d[n.refusal.field]) && o("clearRefusal");
    }
    const K = B(() => n.draft.scopes ?? []);
    function A(R) {
      return K.value.includes(R.id);
    }
    function g(R, d) {
      d && !A(R) && (n.draft.scopes ??= []).push(R.id), !d && A(R) && (K.value.splice(K.value.indexOf(R.id), 1), n.schema.declaration.scopes?.includes(R.id) && o("remove", "scopes", R.id));
    }
    const k = B(() => {
      const R = $.value;
      if (!R) return [];
      const d = R.references;
      return [
        { label: "Fields", items: (d?.fields ?? Object.entries(n.schema.attributes).filter(([, T]) => T.plugin === R.plugin).map(([T]) => T)).map((T) => ({ id: T, title: pe(H(T), "Field") })) },
        { label: "Product filter sets", items: (d?.scopes ?? []).map((T) => ({
          id: T,
          title: pe(n.options.scopes.find((ae) => ae.id === T)?.title, "Unavailable filter set")
        })) },
        { label: "Catalog app binding", items: (d?.shell_bindings ?? []).map((T) => ({ id: T, title: "Catalog app" })) },
        { label: "Readiness checks", items: (d?.checks ?? []).map((T) => ({ id: T, title: "Readiness check" })) },
        { label: "Dependent plugins", items: (d?.plugins ?? []).map((T) => ({
          id: T,
          title: pe(O.value.get(T)?.title, "Dependent plugin")
        })) }
      ].filter((T) => T.items.length);
    });
    function E(R) {
      for (const d of R.references?.scopes ?? [])
        K.value.includes(d) && (n.draft.scopes = K.value.filter((j) => j !== d), o("remove", "scopes", d));
      F.value = void 0, ke(R.plugin, !1), o("review");
    }
    return (R, d) => (e(), s("div", rd, [
      u.value && I.value.some((j) => j.chosen !== j.plugin.active || Object.hasOwn(l.pluginConfigs, j.plugin.plugin)) ? (e(), s("p", ud, "Plugin changes take effect after you review and apply them.")) : c("", !0),
      I.value.length === 0 ? (e(), s("p", cd, "No plugin is installed.")) : c("", !0),
      (e(!0), s(Q, null, se(X.value, (j) => (e(), P(el, {
        key: j.title,
        title: j.title || void 0,
        count: j.title ? j.rows.length : void 0
      }, {
        default: C(() => [
          (e(!0), s(Q, null, se(j.rows, ({ option: T, plugin: ae, status: te, chosen: $e, title: De, label: Te, severity: Ge, refusal: z, configurable: D, needs: N, usedBy: x, open: ie }) => (e(), P(tl, {
            key: ae.plugin,
            "data-plugin": ae.plugin,
            title: De,
            description: T.description && a(pe)(T.description, "") || void 0,
            "expand-label": D ? "Configure" : "Details",
            "keep-mounted": M.value.has(ae.plugin),
            open: ie,
            "onUpdate:open": (W) => we(ae.plugin, W)
          }, xe({
            status: C(() => [
              _(a(_e), {
                class: "kx-tag-sm pim-plugin-state",
                severity: Ge,
                value: Te
              }, null, 8, ["severity", "value"])
            ]),
            default: C(() => [
              t("div", fd, [
                te?.kind === "failed" ? (e(), P(a(je), {
                  key: 0,
                  severity: "warn",
                  role: "alert"
                }, {
                  default: C(() => [
                    a(od)(ae) ? (e(), s("p", gd, "This package uses a plugin interface this deployment cannot run. Restore a compatible package to use this plugin.")) : (e(), s("p", bd, "The catalog could not set up this plugin. Check the status after resolving the setup problem.")),
                    ae.active && te.projection?.[1].parked ? (e(), s("p", yd, "Background update: Paused")) : c("", !0),
                    t("div", hd, [
                      u.value && ae.references ? (e(), P(a(Y), {
                        key: 0,
                        label: "Review references",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        onClick: (W) => F.value = ae.plugin
                      }, null, 8, ["onClick"])) : (e(), P(a(Y), {
                        key: 1,
                        label: "Check status",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        onClick: d[0] || (d[0] = (W) => o("refresh"))
                      }))
                    ])
                  ]),
                  _: 2
                }, 1024)) : te?.kind === "reset" ? (e(), P(a(je), {
                  key: 1,
                  severity: "warn"
                }, {
                  default: C(() => [
                    d[6] || (d[6] = t("p", null, "The event history this background update needs was removed.", -1)),
                    te.error?.max_pruned_seq !== void 0 ? (e(), s("p", kd, "Earliest retained position " + b(te.error.max_pruned_seq + 1) + ".", 1)) : c("", !0),
                    u.value ? (e(), s("div", _d, [
                      _(a(Y), {
                        label: "Reset background updates",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        disabled: l.stale,
                        onClick: (W) => o("reset", ae.plugin)
                      }, null, 8, ["disabled", "onClick"])
                    ])) : c("", !0)
                  ]),
                  _: 2
                }, 1024)) : te?.projection && (te.kind === "paused" || te.kind === "degraded" || te.kind === "catchingUp") ? (e(), P(a(je), {
                  key: 2,
                  severity: te.kind === "catchingUp" ? "info" : "warn"
                }, {
                  default: C(() => [
                    te.projection[1].status === "paused" ? (e(), s("p", wd, "This update was paused.")) : te.kind === "paused" ? (e(), s("p", $d, "The background worker stopped.")) : te.kind === "degraded" ? (e(), s("p", Cd, "The background worker reported an error.")) : (e(), s("p", xd, "This update is processing catalog changes.")),
                    t("p", Vd, "Last applied position " + b(te.projection[1].last_seq) + ".", 1),
                    t("div", jd, [
                      u.value && te.projection[1].status === "paused" && te.projection[1].cursor_id ? (e(), P(a(Y), {
                        key: 0,
                        label: "Resume background update",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        disabled: l.stale,
                        onClick: (W) => o("resume", te.projection[1].cursor_id)
                      }, null, 8, ["disabled", "onClick"])) : te.kind === "paused" && u.value ? (e(), P(a(Y), {
                        key: 1,
                        label: "Reset background updates",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        disabled: l.stale,
                        onClick: (W) => o("reset", ae.plugin)
                      }, null, 8, ["disabled", "onClick"])) : (e(), P(a(Y), {
                        key: 2,
                        label: "Check status",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        onClick: d[1] || (d[1] = (W) => o("refresh"))
                      }))
                    ])
                  ]),
                  _: 2
                }, 1032, ["severity"])) : te?.kind === "uninstalled" ? (e(), P(a(je), {
                  key: 3,
                  severity: "warn"
                }, {
                  default: C(() => [
                    d[7] || (d[7] = t("p", null, "The package was removed while it was still enabled for this catalog.", -1)),
                    t("div", Od, [
                      _(a(Y), {
                        label: "Review references",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        onClick: (W) => F.value = ae.plugin
                      }, null, 8, ["onClick"])
                    ])
                  ]),
                  _: 2
                }, 1024)) : c("", !0),
                V.value.get(ae.plugin)?.length ? (e(), s("p", Sd, " Adds fields for " + b(V.value.get(ae.plugin)?.join(", ")) + ". ", 1)) : c("", !0),
                D ? (e(), P(qt, {
                  key: 5,
                  ref_for: !0,
                  ref: (W) => {
                    W ? a(h).set(ae.plugin, W) : a(h).delete(ae.plugin);
                  },
                  disabled: !u.value,
                  schema: T.config_schema,
                  "model-value": l.pluginConfigs[ae.plugin] ?? ae.config ?? {},
                  problem: te?.kind === "config" && !Object.hasOwn(l.pluginConfigs, ae.plugin) ? te.error : void 0,
                  "plugin-id": te?.kind === "config" ? ae.plugin : void 0,
                  refusal: z,
                  "field-help": ae.plugin === "kickside.pim.inventory:plugin" ? p : void 0,
                  onValidity: (W, ce) => G(ae.plugin, W, ce),
                  "onUpdate:modelValue": (W) => de(ae.plugin, W)
                }, null, 8, ["disabled", "schema", "model-value", "problem", "plugin-id", "refusal", "field-help", "onValidity", "onUpdate:modelValue"])) : !te || te.kind === "pending" ? (e(), s("p", Ud, b($e ? "This plugin has no settings for this catalog." : "Turn the plugin on to use it in this catalog."), 1)) : c("", !0),
                _(ze, {
                  class: "small pim-ia-disclosure pim-error-code",
                  label: "Technical details"
                }, {
                  default: C(() => [
                    t("dl", Ad, [
                      t("div", null, [
                        d[8] || (d[8] = t("dt", null, "Plugin ID", -1)),
                        t("dd", null, [
                          t("code", null, b(ae.plugin), 1)
                        ])
                      ]),
                      (ae.interface_version ?? T.interface_version) != null ? (e(), s("div", Rd, [
                        d[9] || (d[9] = t("dt", null, "Interface version", -1)),
                        t("dd", null, b(ae.interface_version ?? T.interface_version), 1)
                      ])) : c("", !0),
                      te?.error?.message ? (e(), s("div", Pd, [
                        d[10] || (d[10] = t("dt", null, "Error", -1)),
                        t("dd", null, b(te.error.message), 1)
                      ])) : c("", !0),
                      te?.error?.code ? (e(), s("div", Td, [
                        d[11] || (d[11] = t("dt", null, "Error code", -1)),
                        t("dd", null, [
                          t("code", null, b(te.error.code), 1)
                        ])
                      ])) : c("", !0),
                      te?.error?.projection ? (e(), s("div", Id, [
                        d[12] || (d[12] = t("dt", null, "Background update", -1)),
                        t("dd", null, [
                          t("code", null, b(te.error.projection), 1)
                        ])
                      ])) : c("", !0),
                      te?.projection && (te.kind === "paused" || te.kind === "degraded" || te.kind === "catchingUp") ? (e(), s("div", qd, [
                        d[13] || (d[13] = t("dt", null, "Background update", -1)),
                        t("dd", null, [
                          t("code", null, b(te.projection[0]), 1),
                          te.projection[1].error ? (e(), s("span", Dd, " · " + b(te.projection[1].error), 1)) : c("", !0)
                        ])
                      ])) : c("", !0),
                      ae.installed ? (e(), s("div", Nd, [...d[14] || (d[14] = [
                        t("dt", null, "Configuration tool", -1),
                        t("dd", null, [
                          t("code", null, "PIMConfigurePlugin")
                        ], -1)
                      ])])) : c("", !0),
                      ae.tools.length ? (e(), s("div", Fd, [
                        d[15] || (d[15] = t("dt", null, "Plugin tools", -1)),
                        t("dd", null, [
                          t("ul", null, [
                            (e(!0), s(Q, null, se(ae.tools, (W) => (e(), s("li", { key: W }, [
                              t("code", null, b(W), 1)
                            ]))), 128))
                          ])
                        ])
                      ])) : c("", !0)
                    ])
                  ]),
                  _: 2
                }, 1024)
              ])
            ]),
            _: 2
          }, [
            N.length || x.length ? {
              name: "meta",
              fn: C(() => [
                N.length ? (e(), s("span", pd, "Needs " + b(a(ll)(N)), 1)) : c("", !0),
                N.length && x.length ? (e(), s("span", md, " · ")) : c("", !0),
                x.length ? (e(), s("span", vd, "Used by " + b(a(ll)(x)), 1)) : c("", !0)
              ]),
              key: "0"
            } : void 0,
            u.value && ae.installed && (!te || te.kind === "pending") ? {
              name: "actions",
              fn: C(() => [
                _(a(dt), {
                  "aria-label": "Enable " + De,
                  "model-value": $e,
                  "onUpdate:modelValue": (W) => ke(ae.plugin, W)
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
              ]),
              key: "1"
            } : void 0
          ]), 1032, ["data-plugin", "title", "description", "expand-label", "keep-mounted", "open", "onUpdate:open"]))), 128))
        ]),
        _: 2
      }, 1032, ["title", "count"]))), 128)),
      _(ft, {
        visible: !!$.value,
        label: "Plugin references",
        onClose: d[5] || (d[5] = (j) => F.value = void 0)
      }, {
        default: C(() => [
          y.value && $.value ? (e(), s("section", zd, [
            t("header", Bd, [
              t("div", null, [
                d[16] || (d[16] = t("h2", null, "Plugin references", -1)),
                t("p", null, b(y.value.title), 1)
              ])
            ]),
            k.value.length ? (e(), s(Q, { key: 0 }, [
              d[17] || (d[17] = t("p", null, "Replace or remove these references before deactivating the plugin. You can also restore the package to keep using them.", -1)),
              (e(!0), s(Q, null, se(k.value, (j) => (e(), s("div", {
                key: j.label
              }, [
                t("h3", null, b(j.label), 1),
                t("ul", null, [
                  (e(!0), s(Q, null, se(j.items, (T) => (e(), s("li", {
                    key: T.id
                  }, b(T.title), 1))), 128))
                ])
              ]))), 128))
            ], 64)) : (e(), s("p", Md, "Use the catalog review to see what deactivating this plugin would change.")),
            $.value.references?.scopes.length && !$.value.references?.shell_bindings.length ? (e(), s("p", Ld, "Reviewing removal also includes these product filter sets.")) : c("", !0),
            _(ze, {
              class: "small pim-error-code pim-ia-disclosure",
              label: "Technical details"
            }, {
              default: C(() => [
                t("p", null, [
                  d[18] || (d[18] = ee("Plugin ", -1)),
                  t("code", null, b($.value.plugin), 1)
                ]),
                (e(!0), s(Q, null, se(k.value, (j) => (e(), s("div", {
                  key: j.label
                }, [
                  t("p", null, b(j.label), 1),
                  t("ul", null, [
                    (e(!0), s(Q, null, se(j.items, (T) => (e(), s("li", {
                      key: T.id
                    }, [
                      t("code", null, b(T.id), 1)
                    ]))), 128))
                  ])
                ]))), 128))
              ]),
              _: 1
            }),
            t("div", Ed, [
              u.value && $.value.references?.shell_bindings.length ? (e(), P(a(Y), {
                key: 0,
                label: "Clear catalog app binding",
                severity: "secondary",
                outlined: "",
                disabled: l.stale,
                onClick: d[2] || (d[2] = (j) => o("clearShellBinding", $.value.references.shell_bindings[0]))
              }, null, 8, ["disabled"])) : u.value ? (e(), P(a(Y), {
                key: 1,
                label: "Review removal",
                disabled: l.stale,
                onClick: d[3] || (d[3] = (j) => E($.value))
              }, null, 8, ["disabled"])) : c("", !0),
              _(a(Y), {
                label: "Close",
                severity: "secondary",
                outlined: "",
                onClick: d[4] || (d[4] = (j) => F.value = void 0)
              })
            ])
          ])) : c("", !0)
        ]),
        _: 1
      }, 8, ["visible"]),
      l.options.scopes.length ? (e(), P(el, {
        key: 2,
        title: "Product filters",
        count: l.options.scopes.length
      }, {
        default: C(() => [
          (e(!0), s(Q, null, se(l.options.scopes, (j) => (e(), P(tl, {
            key: j.id,
            title: a(pe)(j.title, "Filter set"),
            description: "Adds ways to filter products in this catalog.",
            "expand-label": "Details",
            open: !!v.value["scope:" + j.id],
            "onUpdate:open": (T) => we("scope:" + j.id, T)
          }, xe({
            status: C(() => [
              _(a(_e), {
                class: "kx-tag-sm pim-plugin-state",
                severity: A(j) ? "success" : "secondary",
                value: A(j) ? "In use" : "Available"
              }, null, 8, ["severity", "value"])
            ]),
            default: C(() => [
              t("div", Wd, [
                d[19] || (d[19] = t("span", null, "Filters", -1)),
                (e(!0), s(Q, null, se(j.filters, (T, ae) => (e(), P(a(_e), {
                  key: ae,
                  class: "kx-tag-sm small",
                  severity: "secondary",
                  value: ge(ae, T.ops)
                }, null, 8, ["value"]))), 128)),
                t("span", null, b(a(H)(j.access)) + " access required", 1)
              ]),
              _(ze, {
                class: "small pim-ia-disclosure",
                label: "Technical details"
              }, {
                default: C(() => [
                  t("p", null, [
                    d[20] || (d[20] = ee("Filter set ID ", -1)),
                    t("code", null, b(j.id), 1),
                    d[21] || (d[21] = ee(". Product filter sets are ", -1)),
                    d[22] || (d[22] = t("code", null, "scopes", -1)),
                    d[23] || (d[23] = ee(" in ", -1)),
                    d[24] || (d[24] = t("code", null, "PIMQuery", -1)),
                    d[25] || (d[25] = ee("; use the ID in ", -1)),
                    d[26] || (d[26] = t("code", null, "scopes[].id", -1)),
                    d[27] || (d[27] = ee(".", -1))
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, [
            u.value ? {
              name: "actions",
              fn: C(() => [
                _(a(dt), {
                  "aria-label": "Use " + a(pe)(j.title, "Filter set"),
                  "model-value": A(j),
                  "onUpdate:modelValue": (T) => g(j, T)
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["title", "open", "onUpdate:open"]))), 128))
        ]),
        _: 1
      }, 8, ["count"])) : c("", !0)
    ]));
  }
});
async function Jd(l) {
  const m = await ql(`/api/v1/pim-admin/catalogs/${encodeURIComponent(l)}/policy_defaults`, "policy defaults");
  if (m.audit !== "fields" && m.audit !== "off" || !["audit_days", "trash_days", "tombstone_days"].every((i) => typeof m[i] == "number" && Number.isSafeInteger(m[i])))
    throw new Error("Policy defaults are unavailable.");
  for (const [i, n] of Object.entries(fl)) {
    const o = m[i];
    if (typeof o != "number" || !Number.isSafeInteger(o) || o < n.min || o > n.max) throw new Error(`Policy ${i} is unavailable.`);
  }
  return m;
}
const fl = {
  proposal_days: {
    min: 1,
    max: 3650,
    title: "Proposal retention (days)",
    global: !1
  },
  completed_work_days: {
    min: 1,
    max: 3650,
    title: "Completed release work retention (days)",
    global: !1
  },
  abandoned_work_days: {
    min: 1,
    max: 3650,
    title: "Abandoned release work retention (days)",
    global: !1
  },
  import_days: {
    min: 1,
    max: 3650,
    title: "Completed import retention (days)",
    global: !1
  },
  pending_creation_days: {
    min: 1,
    max: 3650,
    title: "Unfinished catalog expiry (days)",
    global: !0
  },
  proposal_count: {
    min: 1,
    max: 1e3,
    title: "Proposal quota",
    global: !1
  },
  proposal_bytes: {
    min: 1024,
    max: 262144,
    title: "Proposal size (bytes)",
    global: !1
  },
  command_deadline_ms: {
    min: 100,
    max: 5e3,
    title: "Time limit per catalog change (ms)",
    global: !1
  },
  maintenance_rows: {
    min: 20,
    max: 500,
    title: "Records per cleanup pass",
    global: !0
  },
  maintenance_catalogs: {
    min: 1,
    max: 10,
    title: "Catalogs per cleanup pass",
    global: !0
  },
  rebuild_rows: {
    min: 1,
    max: 500,
    title: "Products per rebuild step",
    global: !1
  },
  job_batches: {
    min: 1,
    max: 20,
    title: "Product groups per work session",
    global: !1
  },
  import_rows: {
    min: 1,
    max: 200,
    title: "Products per import step",
    global: !1
  }
}, Kd = { class: "form" }, Gd = {
  key: 0,
  class: "muted small pim-policy-intro"
}, Yd = {
  key: 1,
  class: "muted small pim-policy-status",
  role: "status"
}, Zd = {
  key: 0,
  class: "pim-bsection-head"
}, Qd = { class: "pim-policy-copy" }, Xd = ["for"], er = ["id"], tr = { key: 0 }, lr = {
  key: 0,
  class: "pim-policy-value"
}, ar = {
  key: 0,
  class: "muted small"
}, sr = /* @__PURE__ */ me({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {},
    disabled: { type: Boolean },
    defaultsOnly: { type: Boolean }
  },
  setup(l) {
    const m = l, i = J(), n = B(() => m.defaults ?? i.value), o = J(), r = J(!1);
    async function v() {
      if (!(m.defaults || m.disabled)) {
        o.value = void 0, r.value = !0;
        try {
          i.value = await Jd(m.catalogId ?? "");
        } catch (u) {
          o.value = He(u, "Could not read policy defaults.");
        } finally {
          r.value = !1;
        }
      }
    }
    ol(v);
    const p = B(() => m.draft.policy ?? {}), h = [
      { key: "audit", title: "Audit trail", hint: "Fields records each value change. Off records only lifecycle, schema and release history.", kind: "enum" },
      { key: "audit_days", title: "Audit retention (days)", hint: "0 uses the 365-day default. History always expires.", kind: "int", min: 0, max: 106751 },
      { key: "trash_days", title: "Trash window (days)", hint: "How long a deleted product stays restorable.", kind: "int", min: 1, max: 106751 },
      { key: "tombstone_days", title: "Deleted product notices (days)", hint: "How long feeds report a purged product as deleted.", kind: "int", min: 1, max: 106751 }
    ], L = {
      proposal_days: "How long proposals stay in this catalog before removal.",
      proposal_count: "Maximum number of stored proposals in this catalog.",
      completed_work_days: "How long finished release work stays in this catalog.",
      abandoned_work_days: "How long unfinished release work stays before removal.",
      import_days: "How long finished imports stay in this catalog.",
      pending_creation_days: "How long an unfinished catalog creation stays before removal.",
      proposal_bytes: "Maximum data size of one proposal in this catalog.",
      command_deadline_ms: "Maximum time one catalog change can run before it stops.",
      maintenance_rows: "Maximum records cleaned up in one maintenance pass.",
      maintenance_catalogs: "Maximum catalogs cleaned up in one maintenance pass.",
      rebuild_rows: "Maximum products updated together during a catalog rebuild.",
      job_batches: "Maximum groups of products processed in one background work session.",
      import_rows: "Maximum products read together from an import."
    };
    function M(u) {
      const S = fl[u];
      return { key: u, ...S, kind: "int", hint: L[u] };
    }
    h.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(M));
    const G = ["proposal_days", "proposal_count"].map(M), Z = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(M), F = [
      { id: "retention", title: "Retention", keys: h },
      { id: "proposals", title: "Proposals", keys: G },
      { id: "advanced", title: "", keys: Z }
    ], y = B(() => [
      { value: "inherited", label: n.value ? `${n.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function $(u, S) {
      const O = m.draft.policy ?? (m.draft.policy = {});
      O[u] = S == null || S === "" || S === "inherited" ? !1 : S;
    }
    return (u, S) => (e(), s("section", Kd, [
      l.defaultsOnly ? c("", !0) : (e(), s("p", Gd, "Empty fields inherit the deployment settings.")),
      r.value ? (e(), s("p", Yd, "Loading deployment defaults…")) : c("", !0),
      o.value ? (e(), P(ht, {
        key: 2,
        error: o.value
      }, {
        default: C(() => [
          _(a(Y), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: v
          }, {
            default: C(() => [...S[0] || (S[0] = [
              ee("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : c("", !0),
      (e(), s(Q, null, se(F, (O) => _(sl(O.id === "advanced" ? ze : "section"), Gl({
        key: O.id,
        ref_for: !0
      }, O.id === "advanced" ? { label: "Advanced processing settings" } : { "aria-label": O.title }, {
        "data-policy-group": O.id,
        class: "pim-policy-group"
      }), {
        default: C(() => [
          O.title ? (e(), s("header", Zd, [
            t("h3", null, b(O.title), 1)
          ])) : c("", !0),
          (e(!0), s(Q, null, se(O.keys, (V) => (e(), s("div", {
            key: V.key,
            class: "pim-policy-row"
          }, [
            t("div", Qd, [
              t("label", {
                for: "pol-" + V.key
              }, b(V.title), 9, Xd),
              t("p", {
                id: "pol-help-" + V.key
              }, [
                ee(b(V.hint), 1),
                V.global ? (e(), s("span", tr, " Managed in deployment settings.")) : c("", !0)
              ], 8, er)
            ]),
            l.defaultsOnly ? (e(), s("p", lr, [
              ee(b(n.value?.[V.key] === "fields" ? "Record field changes" : n.value?.[V.key] === "off" ? "Lifecycle and release history" : n.value?.[V.key] ?? "Unavailable") + " ", 1),
              p.value[V.key] !== void 0 && p.value[V.key] !== !1 ? (e(), s("span", ar, " · Catalog override applies")) : c("", !0)
            ])) : V.kind === "enum" ? (e(), P(a(Ve), {
              key: 1,
              disabled: l.disabled,
              "input-id": "pol-" + V.key,
              "aria-describedby": "pol-help-" + V.key,
              class: "pim-policy-control",
              "model-value": typeof p.value[V.key] == "string" ? p.value[V.key] : "inherited",
              options: y.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": (I) => $(V.key, I)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])) : (e(), P(a(ea), {
              key: 2,
              disabled: l.disabled || V.global,
              "input-id": "pol-" + V.key,
              "aria-describedby": "pol-help-" + V.key,
              class: "pim-policy-control",
              "model-value": V.global ? Number(n.value?.[V.key] ?? 0) || null : typeof p.value[V.key] == "number" ? Number(p.value[V.key]) : null,
              min: V.min ?? (V.key === "audit_days" ? 0 : 1),
              max: V.max,
              step: 1,
              placeholder: n.value ? "Default: " + n.value[V.key] : "Deployment default",
              "onUpdate:modelValue": (I) => $(V.key, I)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "min", "max", "placeholder", "onUpdate:modelValue"]))
          ]))), 128))
        ]),
        _: 2
      }, 1040, ["data-policy-group"])), 64))
    ]));
  }
}), ir = { class: "form" }, nr = { class: "pim-aspect" }, or = { class: "pim-aspect-head" }, dr = {
  key: 0,
  class: "muted small"
}, rr = /* @__PURE__ */ me({
  __name: "BuilderDeclaration",
  props: {
    draft: {},
    readonly: { type: Boolean }
  },
  emits: ["replace", "validity"],
  setup(l, { emit: m }) {
    const i = l, n = m, o = J(JSON.stringify(i.draft, null, 2)), r = J("");
    Ke(() => n("validity", !0)), fe(() => i.draft, (p) => {
      o.value = JSON.stringify(p, null, 2), r.value = "";
    }, { deep: !0 });
    function v() {
      if (!i.readonly)
        try {
          const p = fa(o.value);
          r.value = "", n("validity", !0), n("replace", p);
        } catch (p) {
          n("validity", !1), r.value = "Invalid declaration: " + (p instanceof Error ? p.message : String(p));
        }
    }
    return (p, h) => (e(), s("section", ir, [
      t("div", nr, [
        t("header", or, [
          h[1] || (h[1] = t("h3", null, "Declaration", -1)),
          l.readonly ? c("", !0) : (e(), s("span", dr, "edits apply to the draft when the JSON parses"))
        ]),
        r.value ? (e(), P(a(je), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: C(() => [
            ee(b(r.value), 1)
          ]),
          _: 1
        })) : c("", !0),
        _(a(ta), {
          modelValue: o.value,
          "onUpdate:modelValue": h[0] || (h[0] = (L) => o.value = L),
          readonly: l.readonly,
          "aria-label": "Catalog declaration",
          rows: "28",
          spellcheck: "false",
          onInput: v,
          onBlur: v,
          class: "mono pim-json-edit"
        }, null, 8, ["modelValue", "readonly"])
      ])
    ]));
  }
}), ur = { class: "pim-section-layout" }, cr = { class: "kx-main" }, pr = ["aria-label"], mr = { class: "pim-builder-main" }, vr = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, fr = ["disabled", "inert"], gr = {
  key: 0,
  class: "form pim-card-body pad pim-ia-action"
}, br = {
  key: 0,
  class: "muted small"
}, yr = {
  key: 1,
  class: "muted small"
}, hr = { class: "pim-overview-grid" }, kr = { class: "kx-head-icon" }, _r = { class: "kx-card-id" }, wr = { class: "kx-card-name" }, $r = { class: "kx-card-meta" }, Cr = { class: "kx-card-desc" }, xr = { class: "pim-overview-actions" }, Vr = { class: "pim-advanced-actions" }, jr = { class: "pim-ia-action" }, Or = { class: "pim-ia-action" }, Sr = {
  key: 2,
  class: "pim-ia-content"
}, Ur = { class: "pim-ia-dialog" }, Ar = { class: "pim-ia-dialog-head" }, Rr = {
  key: 0,
  class: "dialog-actions"
}, Pr = ["aria-labelledby"], Tr = { class: "pim-ia-dialog-head" }, Ir = ["id"], qr = { class: "pim-ia-review-impact" }, Dr = { key: 0 }, Nr = { key: 1 }, Fr = { key: 2 }, zr = { key: 3 }, Br = { key: 4 }, Mr = { key: 5 }, Lr = { key: 0 }, Er = {
  key: 0,
  class: "pim-plan-list"
}, Wr = { key: 1 }, Hr = {
  key: 1,
  class: "pim-plan-list"
}, Jr = {
  key: 2,
  class: "pim-ia-review-impact"
}, Kr = {
  key: 0,
  class: "row pim-review-confirm"
}, Gr = ["for"], Yr = { class: "dialog-actions pim-ia-dialog-actions" }, Zr = /* @__PURE__ */ me({
  __name: "SchemaBuilder",
  props: {
    catalogId: {},
    embedded: { type: Boolean },
    title: {},
    catalog: {},
    backLabel: {},
    focusBack: { type: Boolean },
    route: {}
  },
  emits: ["applied", "back", "dirty-changed", "navigate"],
  setup(l, { emit: m }) {
    const i = l, n = m, o = {
      General: { question: "Catalog setup", items: [
        { label: "Overview", icon: "tabler:layout-dashboard" },
        { label: "History", icon: "tabler:history" }
      ] },
      Products: { question: "What does a product look like?", items: [
        { label: "Families", icon: "tabler:packages" },
        { label: "Fields", icon: "tabler:list-details" },
        { label: "Form layout", icon: "tabler:layout" }
      ] },
      Values: { question: "Which values can products use?", items: [
        { label: "Dimensions", icon: "tabler:dimensions" },
        { label: "Vocabularies", icon: "tabler:book" }
      ] },
      Channels: { question: "Where does product data come from and go?", items: [
        { label: "Channels", icon: "tabler:broadcast" },
        { label: "Sources", icon: "tabler:database-import" }
      ] },
      Access: { question: "Who can use this catalog?", items: [{ label: "Access", icon: "tabler:users" }] },
      Plugins: { question: "What can this catalog do?", items: [{ label: "Plugins", icon: "tabler:puzzle" }] }
    }, r = {
      Overview: "overview",
      History: "history",
      Families: "families",
      Fields: "fields",
      "Form layout": "form-layout",
      Dimensions: "dimensions",
      Vocabularies: "vocabularies",
      Channels: "channels",
      Sources: "sources",
      Access: "access",
      Plugins: "plugins"
    }, v = J(""), p = J("General"), h = J("Overview"), L = J(""), M = J(), G = B(() => M.value?.from === "Channels" ? "Families" : M.value ? "Fields" : void 0), Z = J(), F = J(!1), y = J(), $ = J(""), u = Object.keys(o).map((w) => ({
      heading: w === "Channels" ? "Publishing and imports" : w,
      items: o[w].items.map((f) => ({ ...f, value: f.label, section: w }))
    })), S = [
      ...u.filter((w) => w.items.length > 1),
      { heading: "Manage catalog", items: u.filter((w) => w.items.length === 1).flatMap((w) => w.items) }
    ], O = S.flatMap((w) => w.items), V = B(() => d.value && j.value ? [
      { ...S[0], heading: i.title || "Catalog" },
      ...S.slice(1)
    ] : []), I = B(() => i.backLabel ? {
      value: "all-catalogs",
      label: i.embedded ? "All catalogs" : i.backLabel,
      icon: "tabler:table"
    } : void 0), X = J();
    fe(X, (w) => {
      i.focusBack && w?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    function q(w) {
      if (w === "all-catalogs") {
        n("back");
        return;
      }
      const f = O.find((U) => U.label === w);
      f && ge(f.section, f.label);
    }
    function ne(w, f, U = "") {
      const le = h.value !== f;
      p.value = w, h.value = f, v.value = U ? r[f] + "/" + U : "", le && ($.value = "", y.value && (y.value.scrollTop = 0));
    }
    function we(w, f, U = "") {
      ne(w, f, U), i.route !== void 0 && n("navigate", [r[f], ...U ? [encodeURIComponent(U)] : []].join("/"));
    }
    function ge(w, f = o[w].items[0].label) {
      (p.value !== w || h.value !== f) && (M.value = void 0, we(w, f));
    }
    function ke(w, f, U) {
      if (i.route === void 0 || r[h.value] !== w || !U && v.value !== w + "/" + f) return;
      const le = d.value;
      (w === "families" ? le?.families[f] : w === "fields" ? le?.declaration.aspects?.some((ue) => ue.attributes?.some((be) => ue.namespace + "." + be.id === f)) : w === "dimensions" ? le?.dimensions.some((ue) => ue.name === f) : w === "vocabularies" ? le?.vocabularies[f] : w === "channels" ? le?.channels[f] : w === "sources" ? le?.sources[f] : w === "plugins" && (j.value?.plugins.some((ue) => ue.plugin === f) || j.value?.scopes.some((ue) => "scope:" + ue.id === f))) && we(p.value, h.value, U ? f : "");
    }
    il(It, { selected: v, choose: ke }), fe(() => i.route, (w) => {
      if (w === void 0) return;
      const [f, U] = w.split("/"), le = O.find((ue) => r[ue.label] === f);
      le?.label !== G.value && (M.value = void 0);
      let re = "";
      try {
        U && (re = decodeURIComponent(U));
      } catch {
      }
      le?.label === "Fields" && re && v.value !== "fields/" + re && (L.value = ""), ne(le?.section ?? "General", le?.label ?? "Overview", re);
    }, { immediate: !0 });
    function de(w) {
      Z.value = w, F.value = !0;
    }
    function K(w) {
      L.value = w, ge("Products", "Fields");
    }
    async function A(w, f, U = "") {
      we(w, f, U), await qe(), y.value?.focus({ preventScroll: !0 });
    }
    function g(w) {
      M.value = { from: "Channels", id: w };
      const f = Lt.value.find((le) => le.id === w)?.families, U = pt.value.filter((le) => !f?.length || f.includes(le.code));
      A("Products", "Families", U.length === 1 ? U[0].code : void 0);
    }
    function k(w) {
      L.value = "", M.value = { from: "Families", id: w }, A("Products", "Fields");
    }
    function E() {
      if (!M.value) return;
      const { from: w, id: f } = M.value;
      M.value = void 0, A(w === "Channels" ? "Channels" : "Products", w, f);
    }
    function R(w, f, U = f + "s") {
      return w + " " + (w === 1 ? f : U);
    }
    const d = J(null), j = J(null), T = J({}), ae = J({}), te = J({}), $e = J(), De = J(), Te = J(!1), Ge = J(0), z = B(() => Object.fromEntries(Object.entries(te.value).filter(([w]) => T.value.plugins?.some((f) => f.use === w) && !d.value?.plugins.some((f) => f.plugin === w && f.active)))), D = J(), N = J(!1), x = J(null), ie = J(!1), W = B(() => d.value?.access.admin === !0), ce = J(null), Ce = J(!1), Ye = J(!1), Dt = J(null), ut = Se(), gl = {
      unchanged: "No changes",
      initial: "First schema",
      cosmetic: "Presentation only",
      additive: "New fields or options",
      semantic: "Affects product data",
      refused: "Changes blocked"
    }, bl = {
      "attribute order": "Change the order on product forms",
      added: "Add to this catalog",
      removed: "Remove from this catalog",
      adopted: "Enable these product filters",
      dropped: "Disable these product filters",
      chosen: "Enable this plugin",
      changed: "Update what this plugin adds",
      audit: "Change which updates are recorded",
      checks: "Change installed readiness checks",
      "check implementation revised": "Use the updated readiness check",
      requirements: "Change what products need before release",
      fallback: "Change where missing values come from",
      "catalog policy": "Change the catalog override",
      "variation axes": "Change which fields distinguish variants",
      cardinality: "Number of values",
      default: "Default value",
      scope: "Dimensions",
      form: "Value format",
      index: "How products can be filtered or sorted",
      type: "Field type",
      unique: "Unique values",
      width: "Change the width on product forms"
    }, Ze = J(null), Ne = J(!0), Ie = Je(), Nt = B(() => Ce.value && Ue.value && (!$t.value.length || Ye.value) && !N.value && Ne.value && !!ce.value && ce.value.class !== "refused" && !!Ze.value?.matches(Le.value, d.value?.schema_generation ?? -1, te.value)), Ft = B(() => ce.value ? [...ce.value.refused, ...ce.value.changes.filter((w) => w.class !== "refused")] : []), it = Je(), kt = J(!1);
    let _t = 0;
    fe([T, ae, te], () => {
      _t++, $.value = "", Ae();
    }, { deep: !0, flush: "sync" });
    async function Qe(w = !1, f = !1) {
      if (Ue.value && !w) return;
      const U = it.begin(), le = _t, re = i.catalogId, ue = f ? Object.entries(te.value).filter(([be]) => d.value?.plugins.some((Re) => Re.plugin === be && Re.active)) : [];
      kt.value = !0, D.value = void 0, $e.value = void 0;
      try {
        const [be, Re] = await Promise.all([ye.schema(re), ye.schemaOptions(re)]);
        if (!it.current(U) || le !== _t || re !== i.catalogId) return !1;
        const Fe = $.value;
        return d.value = be, j.value = Re, T.value = et(be.declaration), ae.value = {}, te.value = Object.fromEntries(ue.filter(([Pl]) => be.plugins.some((Yt) => Yt.plugin === Pl && Yt.active))), Ae(), Ne.value = !0, N.value = !1, $.value = Fe, !0;
      } catch (be) {
        return it.current(U) && (D.value = He(be, "Could not load settings.")), !1;
      } finally {
        it.current(U) && (kt.value = !1);
      }
    }
    let wt = () => {
    };
    fe(() => i.catalogId, (w) => {
      wt(), wt = dl(`component.${w}`, () => {
        !Ue.value && !ie.value ? Qe() : h.value === "Plugins" && !ie.value && ct();
      });
    }, { immediate: !0 });
    const yl = yt(async () => {
      !Ue.value && !ie.value ? await Qe() : h.value === "Plugins" && !ie.value && await ct();
    });
    Ke(() => {
      wt(), Ie.begin(), it.begin();
    });
    const { refreshPluginStatus: ct, resetPlugin: hl, resumePluginProjection: kl, clearShellBinding: _l } = dd({
      catalogId: () => i.catalogId,
      shouldPoll: () => yl.value !== !1 && h.value === "Plugins",
      schema: d,
      options: j,
      busy: ie,
      stale: N,
      editable: W,
      saved: $,
      clearError: () => {
        D.value = void 0;
      },
      reportError: Ct
    });
    fe(() => i.catalogId, () => {
      Ie.begin(), ie.value = !1, N.value = !1, d.value = null, j.value = null, xt(), Qe();
    });
    const wl = B(() => Object.values(Zt(T.value, ae.value)).reduce((w, f) => w + (f?.length ?? 0), 0)), zt = B(() => !!d.value && (JSON.stringify(T.value) !== JSON.stringify(d.value.declaration) || wl.value > 0 || Object.keys(z.value).length > 0)), Ue = B(() => Te.value || zt.value || Object.keys(te.value).length > 0);
    fe(Ue, (w) => n("dirty-changed", w), { immediate: !0 });
    const pt = B(() => T.value.families?.filter((w) => w.code !== "generic") ?? []), Bt = B(() => T.value.aspects ?? []), Mt = B(() => Bt.value.reduce((w, f) => w + (f.attributes?.length ?? 0), 0)), $l = B(() => {
      const w = new Set(T.value.plugins?.map((f) => f.use));
      return Object.values(d.value?.attributes ?? {}).filter((f) => f.plugin && w.has(f.plugin)).length;
    }), Cl = B(() => !Mt.value && !Bt.value.length && !pt.value.length), Lt = B(() => T.value.channels ?? []), xl = B(() => T.value.sources ?? []), Et = B(() => d.value?.plugins.filter((w) => w.active) ?? []), Wt = B(() => i.catalog?.product_count ?? i.catalog?.item_count), Vl = B(() => [
      {
        section: "Products",
        label: "Product setup",
        icon: "tabler:packages",
        summary: [
          ...typeof Wt.value == "number" ? [R(Wt.value, "product")] : [],
          R(pt.value.length, "family", "families"),
          R(Mt.value + $l.value, "field")
        ].join(" · "),
        detail: pt.value.map((w) => H(w.code)).join(", ") || "Create a family for products that share the same fields."
      },
      {
        section: "Values",
        label: "Allowed values",
        icon: "tabler:list-details",
        summary: [R(T.value.dimensions?.length ?? 0, "dimension"), R(T.value.vocabularies?.length ?? 0, "vocabulary", "vocabularies")].join(" · "),
        detail: T.value.dimensions?.map((w) => H(w.name)).join(", ") || "Add dimensions when values vary by language, region or another context."
      },
      {
        section: "Channels",
        label: "Publishing and imports",
        icon: "tabler:arrows-exchange",
        summary: [R(Lt.value.length, "channel"), R(xl.value.length, "source")].join(" · "),
        detail: "Publish products to channels and control incoming updates through sources."
      },
      {
        section: "Plugins",
        label: "Catalog tools",
        icon: "tabler:puzzle",
        summary: R(Et.value.length, "plugin") + " enabled",
        detail: Et.value.map((w) => pe(w.title, "Catalog plugin")).join(", ") || "Open Plugins to see which tools you can enable."
      }
    ]), jl = {
      Overview: o.General.question,
      History: "What changed in this catalog?",
      Families: "Choose what each family collects, how products vary, and what they need before release.",
      Fields: "Manage product fields and the groups that families share.",
      "Form layout": "In what order will editors see fields?",
      Dimensions: "Where can product values differ?",
      Vocabularies: "Which terms can product editors choose?",
      Channels: "Choose where each family can publish and what products need before release.",
      Sources: "Control who can send product updates and which fields each source can change.",
      Access: o.Access.question,
      Plugins: o.Plugins.question
    }, Le = B(() => {
      const w = et(T.value), f = Zt(w, ae.value);
      for (const [U, le] of Object.entries(f)) {
        const re = w.remove ??= {};
        re[U] = [.../* @__PURE__ */ new Set([...re[U] ?? [], ...le])];
      }
      return w;
    });
    function Ol(w) {
      const [f, U] = w.split(" ", 2);
      if (f === "plugin" && U) return pe(j.value?.plugins.find((ue) => ue.plugin === U)?.title, "Plugin");
      if (f === "scope" && U) return pe(j.value?.scopes.find((ue) => ue.id === U)?.title, "Product filter set");
      if (U) return pe(H(U), H(f)) + (f === "aspect" ? " field group" : "");
      if (w.startsWith("kickside.")) return "Catalog setting";
      const [le, re] = w.split(".", 2);
      return re ? `${pe(H(re), "Field")} (${pe(H(le), "Field group")})` : pe(H(w), "Catalog setting");
    }
    function Sl(w) {
      return w.startsWith("renamed from ") ? "Rename from " + H(w.slice(13)) : w.startsWith("config.") ? "Change " + H(w.slice(7)) : w.endsWith(" owning level") ? "Move a field to another variant level" : bl[w] ?? H(w);
    }
    const $t = B(() => {
      const w = Le.value.remove;
      return [
        ...w?.attributes?.length || w?.aspects?.length ? ["Removing fields deletes the values stored in those fields."] : [],
        ...w?.vocabularies?.length ? ["Removing a vocabulary deletes its saved terms."] : [],
        ...w?.channels?.length ? ["Removing a release destination withdraws products already published to it."] : []
      ];
    }), Ht = B(() => {
      const w = d.value?.declaration;
      return w ? [
        ...(T.value.channels ?? []).flatMap((f) => {
          const U = w.channels?.find((le) => le.id === f.id);
          return JSON.stringify(f) === JSON.stringify(U) ? [] : [{ subject: H(f.id), effect: U ? "Change which products can be released here and what they need first" : "Add a release destination" }];
        }),
        ...(Le.value.remove?.channels ?? []).map((f) => ({ subject: H(f), effect: "Remove this release destination" })),
        ...(T.value.sources ?? []).flatMap((f) => {
          const U = w.sources?.find((le) => le.id === f.id);
          return JSON.stringify(f) === JSON.stringify(U) ? [] : [{ subject: H(f.id), effect: U ? "Update how this source can send product data" : "Let this source send product updates" }];
        }),
        ...(Le.value.remove?.sources ?? []).map((f) => ({ subject: H(f), effect: "Stop accepting updates from this source" }))
      ] : [];
    }), Jt = B(() => {
      const w = Ze.value;
      if (!w) return [];
      const f = w.declaration.plugins?.filter((le) => !d.value?.plugins.some((re) => re.plugin === le.use && re.active)) ?? [];
      return [.../* @__PURE__ */ new Set([...f.map((le) => le.use), ...Object.keys(w.activeConfigs)])].flatMap((le) => {
        const re = j.value?.plugins.find((Re) => Re.plugin === le);
        if (!re || !Object.keys(re.config_schema.properties ?? {}).length) return [];
        const ue = w.pluginConfigs[le] ?? {}, be = Object.entries(ue).map(([Re, Fe]) => bt(re.config_schema, Re) + " · " + rt(Fe));
        if (le in w.activeConfigs) {
          const Re = d.value?.plugins.find((Fe) => Fe.plugin === le)?.config ?? {};
          for (const Fe of Object.keys(Re))
            Fe in ue || be.push(bt(re.config_schema, Fe) + " · Uses default");
        }
        return [{ id: le, title: pe(re.title, "Plugin"), fields: be.length ? be : ["Uses defaults"] }];
      });
    });
    function Ct(w, f) {
      const U = He(w, f), le = U.pluginConfig, re = j.value?.plugins.find((ue) => ue.installed && ue.plugin === le?.plugin);
      if (le && re && T.value.plugins?.some((ue) => ue.use === le.plugin)) {
        $e.value = le, ge("Plugins");
        return;
      }
      D.value = U, U.code === Dl && (N.value = !0, Ae());
    }
    async function Ul() {
      if (!(Ue.value && !await tt.confirm({
        header: "Discard unsaved changes?",
        message: "Reloading will discard unsaved settings and plugin changes.",
        acceptLabel: "Discard and reload",
        rejectLabel: "Cancel"
      }))) {
        ie.value = !0, $.value = "";
        try {
          await Qe(!0);
        } finally {
          ie.value = !1;
        }
      }
    }
    async function Kt() {
      if (!d.value || !Ue.value || !Ne.value || N.value || ie.value || (Te.value && p.value !== "Plugins" && (ge("Plugins"), await qe()), De.value && !De.value.reportValidity())) return;
      const w = Ie.begin(), f = {
        ...pa(Le.value, d.value.schema_generation, te.value),
        schemaChanges: zt.value,
        initialConfigs: et(z.value),
        activeConfigs: et(Object.fromEntries(Object.entries(te.value).filter(([U]) => d.value?.plugins.some((le) => le.plugin === U && le.active) && !Le.value.remove?.plugins?.includes(U))))
      };
      ie.value = !0, D.value = void 0;
      try {
        const U = f.schemaChanges ? await ye.planSchema(i.catalogId, f.declaration, f.generation, f.initialConfigs) : { generation: f.generation, class: "configuration", changes: [], refused: [] };
        if (!Ie.current(w) || !f.matches(Le.value, d.value.schema_generation, te.value) || !Ne.value) return;
        Ze.value = f, Ye.value = !1, ce.value = U, Ce.value = !0, await qe(), Dt.value?.focus();
      } catch (U) {
        if (!Ie.current(w)) return;
        Ct(U, "Could not review the change."), Ae(), await qe(), x.value?.$el.focus();
      } finally {
        Ie.current(w) && (ie.value = !1);
      }
    }
    async function Al() {
      if (!d.value || !Ue.value || !Nt.value || !Ze.value) return;
      const w = i.catalogId, f = Ie.begin(), U = Ze.value, le = () => w === i.catalogId && Ie.current(f);
      ie.value = !0, D.value = void 0, $.value = "";
      let re = !1;
      try {
        if (U.schemaChanges) {
          const ue = await ye.applySchema(w, U.declaration, U.generation, U.initialConfigs);
          if (!le()) return;
          const be = await Qe(!0, !0);
          if (!le() || (n("applied", ue.generation), !be)) return;
        }
        try {
          for (const [ue, be] of Object.entries(U.activeConfigs)) {
            if (await ye.configurePlugin(w, ue, be), !le()) return;
            re = !0, delete te.value[ue];
          }
        } finally {
          re && le() && await ct(!0);
        }
        if (!le() || D.value) return;
        $e.value = void 0, $.value = "Catalog changes applied.";
      } catch (ue) {
        if (!le()) return;
        Ae(), Ct(ue, "Could not apply the change."), await qe(), x.value?.$el.focus();
      } finally {
        Ie.current(f) && (ie.value = !1);
      }
    }
    async function Rl() {
      Ue.value && !await tt.confirm({
        header: "Leave this catalog?",
        message: "Your unsaved catalog changes will be discarded.",
        acceptLabel: "Discard and open settings",
        rejectLabel: "Keep editing"
      }) || (xt(), F.value = !1, tt.navigate("/system/settings"));
    }
    function Ae() {
      Ce.value = !1, Ze.value = null;
    }
    function Gt() {
      F.value = !1, Ne.value = !0;
    }
    function xt() {
      M.value = void 0, te.value = {}, Te.value = !1, Ge.value++, $e.value = void 0, Ne.value = !0, d.value && (T.value = et(d.value.declaration)), ae.value = {}, Ae(), $.value = "";
    }
    function Xe(w, f) {
      const U = ae.value[w] ?? [];
      U.includes(f) || (ae.value = { ...ae.value, [w]: [...U, f] });
    }
    return (w, f) => (e(), s("section", {
      class: Oe(["pim-builder", { embedded: l.embedded }])
    }, [
      t("div", ur, [
        I.value || d.value && j.value ? (e(), P(na, {
          key: 0,
          ref_key: "rail",
          ref: X,
          label: "Catalog settings sections",
          value: h.value,
          groups: V.value,
          "leading-item": I.value,
          "onUpdate:value": q
        }, null, 8, ["value", "groups", "leading-item"])) : c("", !0),
        t("div", cr, [
          t("section", {
            ref_key: "content",
            ref: y,
            class: "kx-main-scroll",
            "aria-label": h.value,
            tabindex: "-1"
          }, [
            d.value && j.value ? (e(), P(os, {
              key: 0,
              title: h.value,
              description: jl[h.value]
            }, xe({ _: 2 }, [
              W.value && Ue.value ? {
                name: "actions",
                fn: C(() => [
                  _(ds, {
                    busy: ie.value,
                    "review-disabled": !Ne.value || N.value,
                    onDiscard: xt,
                    onReview: Kt
                  }, null, 8, ["busy", "review-disabled"])
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : c("", !0),
            t("div", mr, [
              D.value ? (e(), P(ht, {
                key: 0,
                ref_key: "errorPanel",
                ref: x,
                error: D.value,
                tabindex: "-1"
              }, {
                default: C(() => [
                  N.value ? (e(), P(a(Y), {
                    key: 0,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: ie.value,
                    onClick: Ul
                  }, {
                    default: C(() => [...f[15] || (f[15] = [
                      ee("Reload settings", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"])) : !d.value || !j.value ? (e(), P(a(Y), {
                    key: 1,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: f[0] || (f[0] = (U) => Qe())
                  }, {
                    default: C(() => [...f[16] || (f[16] = [
                      ee("Retry", -1)
                    ])]),
                    _: 1
                  })) : c("", !0)
                ]),
                _: 1
              }, 8, ["error"])) : c("", !0),
              $.value ? (e(), P(a(je), {
                key: 1,
                severity: "success",
                role: "status"
              }, {
                default: C(() => [
                  ee(b($.value), 1)
                ]),
                _: 1
              })) : c("", !0),
              d.value?.rebuilding && h.value === "Overview" ? (e(), P(a(je), {
                key: 2,
                severity: "info",
                role: "status"
              }, {
                default: C(() => [...f[17] || (f[17] = [
                  ee("Updating product readiness", -1)
                ])]),
                _: 1
              })) : c("", !0),
              kt.value && (!d.value || !j.value) ? (e(), s("div", vr, "Loading catalog settings…")) : d.value && j.value ? (e(), s("fieldset", {
                key: 4,
                class: "pim-editor-surface",
                disabled: ie.value,
                inert: ie.value
              }, [
                W.value ? c("", !0) : (e(), P(a(je), {
                  key: 0,
                  severity: "info"
                }, {
                  default: C(() => [...f[18] || (f[18] = [
                    ee("You can view this catalog’s settings.", -1)
                  ])]),
                  _: 1
                })),
                p.value !== "Plugins" ? (e(), s("div", {
                  key: h.value,
                  class: "pim-ia-content"
                }, [
                  M.value && h.value === G.value ? (e(), s("div", gr, [
                    t("div", null, [
                      M.value.from === "Channels" ? (e(), s("p", br, "Open the family that defines what products need before release, then add a release requirement.")) : (e(), s("p", yr, "Add a field with a single value and no dimensions, such as Integer. When you return, select its group under Field groups."))
                    ]),
                    _(a(Y), {
                      type: "button",
                      severity: "secondary",
                      outlined: "",
                      size: "small",
                      onClick: E
                    }, {
                      default: C(() => [
                        _(a(oe), {
                          icon: "tabler:arrow-left",
                          "aria-hidden": "true"
                        }),
                        ee(" Back to " + b(a(H)(M.value.id)), 1)
                      ]),
                      _: 1
                    })
                  ])) : c("", !0),
                  p.value === "General" && h.value === "History" ? (e(), P(as, {
                    key: 1,
                    "catalog-id": l.catalogId,
                    "can-resolve-actors": W.value
                  }, null, 8, ["catalog-id", "can-resolve-actors"])) : p.value === "General" ? (e(), s(Q, { key: 2 }, [
                    t("div", hr, [
                      (e(!0), s(Q, null, se(Vl.value, (U) => (e(), s("section", {
                        key: U.section,
                        class: "kx-card pim-overview-card"
                      }, [
                        t("span", kr, [
                          _(a(oe), {
                            icon: U.icon,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"])
                        ]),
                        t("div", _r, [
                          t("h3", wr, b(U.label), 1),
                          t("p", $r, b(U.summary), 1)
                        ]),
                        t("p", Cr, b(U.detail), 1),
                        t("div", xr, [
                          _(a(Y), {
                            type: "button",
                            text: "",
                            class: "pim-overview-action",
                            onClick: (le) => ge(U.section)
                          }, {
                            default: C(() => [
                              ee(b(U.section === "Products" ? Cl.value ? "Set up products" : "View families" : "View " + U.section.toLowerCase()) + " ", 1),
                              _(a(oe), {
                                icon: "tabler:arrow-right",
                                "aria-hidden": "true"
                              })
                            ]),
                            _: 2
                          }, 1032, ["onClick"]),
                          U.section === "Channels" ? (e(), P(a(Y), {
                            key: 0,
                            type: "button",
                            text: "",
                            class: "pim-overview-action",
                            onClick: f[1] || (f[1] = (le) => ge("Channels", "Sources"))
                          }, {
                            default: C(() => [
                              f[19] || (f[19] = ee(" Manage sources ", -1)),
                              _(a(oe), {
                                icon: "tabler:arrow-right",
                                "aria-hidden": "true"
                              })
                            ]),
                            _: 1
                          })) : c("", !0)
                        ])
                      ]))), 128))
                    ]),
                    _(ze, { label: "Advanced" }, {
                      default: C(() => [
                        t("div", Vr, [
                          t("div", jr, [
                            f[20] || (f[20] = t("div", null, [
                              t("h3", null, "Application defaults"),
                              t("p", null, "Review the audit, retention and processing settings this catalog inherits.")
                            ], -1)),
                            _(a(Y), {
                              label: "View defaults",
                              severity: "secondary",
                              outlined: "",
                              onClick: f[2] || (f[2] = (U) => de("defaults"))
                            })
                          ]),
                          t("div", Or, [
                            f[21] || (f[21] = t("div", null, [
                              t("h3", null, "Technical schema"),
                              t("p", null, "Inspect the complete definition, including integration keys and settings used by installed extensions.")
                            ], -1)),
                            _(a(Y), {
                              label: "Open declaration",
                              severity: "secondary",
                              outlined: "",
                              onClick: f[3] || (f[3] = (U) => de("declaration"))
                            })
                          ])
                        ])
                      ]),
                      _: 1
                    })
                  ], 64)) : p.value === "Products" ? (e(), s(Q, { key: 3 }, [
                    h.value === "Families" ? (e(), P(eo, {
                      key: 0,
                      draft: T.value,
                      schema: d.value,
                      options: j.value,
                      onRemove: Xe,
                      onFields: K,
                      onVariantField: k
                    }, null, 8, ["draft", "schema", "options"])) : h.value === "Fields" ? (e(), P(Li, {
                      key: 1,
                      family: L.value,
                      "onUpdate:family": f[4] || (f[4] = (U) => L.value = U),
                      draft: T.value,
                      schema: d.value,
                      options: j.value,
                      onRemove: Xe,
                      onLayout: f[5] || (f[5] = (U) => ge("Products", "Form layout"))
                    }, null, 8, ["family", "draft", "schema", "options"])) : (e(), P(qa, {
                      key: 2,
                      draft: T.value,
                      schema: d.value,
                      types: j.value.types,
                      onFamilies: f[6] || (f[6] = (U) => ge("Products", "Families"))
                    }, null, 8, ["draft", "schema", "types"]))
                  ], 64)) : p.value === "Values" ? (e(), s(Q, { key: 4 }, [
                    h.value === "Dimensions" ? (e(), P(Xi, {
                      key: 0,
                      draft: T.value,
                      schema: d.value,
                      onRemove: Xe
                    }, null, 8, ["draft", "schema"])) : (e(), P(kn, {
                      key: 1,
                      "catalog-id": l.catalogId,
                      draft: T.value,
                      schema: d.value,
                      onRemove: Xe
                    }, null, 8, ["catalog-id", "draft", "schema"]))
                  ], 64)) : p.value === "Channels" ? (e(), P(zo, {
                    key: 5,
                    "catalog-id": l.catalogId,
                    draft: T.value,
                    schema: d.value,
                    view: h.value === "Sources" ? "sources" : "channels",
                    onRemove: Xe,
                    onRequirements: g
                  }, null, 8, ["catalog-id", "draft", "schema", "view"])) : p.value === "Access" ? (e(), P(ca, {
                    key: 6,
                    "catalog-id": l.catalogId,
                    title: l.title || "Catalog",
                    access: d.value.access
                  }, null, 8, ["catalog-id", "title", "access"])) : c("", !0)
                ])) : c("", !0),
                p.value === "Plugins" || Te.value ? Rt((e(), s("div", Sr, [
                  (e(), P(Hd, {
                    key: Ge.value,
                    ref_key: "pluginEditor",
                    ref: De,
                    draft: T.value,
                    schema: d.value,
                    options: j.value,
                    "plugin-configs": te.value,
                    refusal: $e.value,
                    stale: N.value,
                    onRemove: Xe,
                    onReset: a(hl),
                    onClearRefusal: f[7] || (f[7] = (U) => $e.value = void 0),
                    onInvalidDraft: f[8] || (f[8] = (U) => Te.value = U),
                    onRefresh: f[9] || (f[9] = (U) => a(ct)(!0)),
                    onResume: a(kl),
                    onReview: Kt,
                    onClearShellBinding: a(_l)
                  }, null, 8, ["draft", "schema", "options", "plugin-configs", "refusal", "stale", "onReset", "onResume", "onClearShellBinding"]))
                ], 512)), [
                  [Pt, p.value === "Plugins"]
                ]) : c("", !0),
                Z.value ? (e(), P(ft, {
                  key: 3,
                  visible: F.value,
                  label: Z.value === "defaults" ? "Application defaults" : "Technical schema",
                  onClose: Gt,
                  onClosed: f[12] || (f[12] = (U) => Z.value = void 0)
                }, {
                  default: C(() => [
                    t("div", Ur, [
                      t("header", Ar, [
                        t("h2", null, b(Z.value === "defaults" ? "Application defaults" : "Technical schema"), 1),
                        _(a(Y), {
                          type: "button",
                          "aria-label": "Close",
                          text: "",
                          severity: "secondary",
                          onClick: Gt
                        }, {
                          default: C(() => [
                            _(a(oe), {
                              icon: "tabler:x",
                              "aria-hidden": "true"
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      Z.value === "defaults" ? (e(), s(Q, { key: 0 }, [
                        f[22] || (f[22] = t("p", { class: "muted" }, "These settings apply across the application. Catalogs with an explicit override keep their chosen value.", -1)),
                        _(sr, {
                          "catalog-id": l.catalogId,
                          draft: T.value,
                          disabled: !W.value,
                          "defaults-only": ""
                        }, null, 8, ["catalog-id", "draft", "disabled"]),
                        W.value ? (e(), s("div", Rr, [
                          _(a(Y), {
                            type: "button",
                            label: "Open application settings",
                            severity: "secondary",
                            outlined: "",
                            onClick: Rl
                          })
                        ])) : c("", !0)
                      ], 64)) : (e(), P(rr, {
                        key: 1,
                        draft: T.value,
                        readonly: !W.value,
                        onReplace: f[10] || (f[10] = (U) => T.value = U),
                        onValidity: f[11] || (f[11] = (U) => {
                          Ne.value = U, Ae();
                        })
                      }, null, 8, ["draft", "readonly"]))
                    ])
                  ]),
                  _: 1
                }, 8, ["visible", "label"])) : c("", !0)
              ], 8, fr)) : c("", !0),
              _(ft, {
                class: "pim-review-dialog",
                visible: Ce.value,
                busy: ie.value,
                label: "Review changes",
                onClose: Ae,
                onClosed: f[14] || (f[14] = (U) => ce.value = null)
              }, {
                default: C(() => [
                  ce.value ? (e(), s("section", {
                    key: 0,
                    class: "pim-ia-dialog pim-plan",
                    "aria-labelledby": a(ut)
                  }, [
                    t("header", Tr, [
                      t("div", null, [
                        t("h2", {
                          id: a(ut),
                          ref_key: "reviewHeading",
                          ref: Dt,
                          tabindex: "-1",
                          autofocus: ""
                        }, "Review changes", 8, Ir),
                        t("p", null, "Check what will happen when you apply this draft to " + b(l.title || "the catalog") + ".", 1)
                      ]),
                      _(a(Y), {
                        type: "button",
                        "aria-label": "Close review",
                        disabled: ie.value,
                        text: "",
                        severity: "secondary",
                        onClick: Ae
                      }, {
                        default: C(() => [
                          _(a(oe), {
                            icon: "tabler:x",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ]),
                    t("div", qr, [
                      t("h3", null, b(ce.value.class === "configuration" ? "Plugin configuration" : gl[ce.value.class] || "Catalog changes"), 1),
                      ce.value.class === "configuration" ? (e(), s("p", Dr, "These settings will apply to the enabled plugins in this catalog.")) : ce.value.class === "unchanged" ? (e(), s("p", Nr, "The catalog already matches this draft.")) : ce.value.class === "initial" ? (e(), s("p", Fr, "Product editors will use these settings for new products.")) : ce.value.class === "cosmetic" ? (e(), s("p", zr, "Catalog settings will update. Stored product values are kept.")) : ce.value.class === "additive" ? (e(), s("p", Br, "The new options become available. Existing product values are kept.")) : ce.value.class === "semantic" ? (e(), s("p", Mr, "Applying changes can recalculate product values or release readiness across this catalog.")) : ce.value.class === "refused" ? (e(), P(a(je), {
                        key: 6,
                        severity: "error"
                      }, {
                        default: C(() => [
                          f[23] || (f[23] = ee(" These changes can’t be applied. ", -1)),
                          ce.value.migration && ce.value.refused.some((U) => d.value?.attributes[U.code]) ? (e(), s("span", Lr, " To change how a field stores values, add a new field and copy the existing values into it. Then remove the original field and give the new field its name. ")) : c("", !0)
                        ]),
                        _: 1
                      })) : c("", !0)
                    ]),
                    Ft.value.length || Ht.value.length ? (e(), s("ul", Er, [
                      (e(!0), s(Q, null, se(Ft.value, (U, le) => (e(), s("li", { key: le }, [
                        U.class === "refused" ? (e(), P(a(_e), {
                          key: 0,
                          class: "kx-tag-sm small",
                          severity: "danger"
                        }, {
                          default: C(() => [...f[24] || (f[24] = [
                            ee("Blocked", -1)
                          ])]),
                          _: 1
                        })) : c("", !0),
                        U.code ? (e(), s("strong", Wr, b(Ol(U.code)), 1)) : c("", !0),
                        t("span", null, b(Sl(U.what)), 1)
                      ]))), 128)),
                      (e(!0), s(Q, null, se(Ht.value, (U) => (e(), s("li", {
                        key: U.subject + U.effect
                      }, [
                        t("strong", null, b(U.subject), 1),
                        t("span", null, b(U.effect), 1)
                      ]))), 128))
                    ])) : c("", !0),
                    Jt.value.length ? (e(), s("ul", Hr, [
                      (e(!0), s(Q, null, se(Jt.value, (U) => (e(), s("li", {
                        key: U.id
                      }, [
                        t("strong", null, b(U.title), 1),
                        t("div", null, [
                          (e(!0), s(Q, null, se(U.fields, (le, re) => (e(), s("p", { key: re }, b(le), 1))), 128))
                        ])
                      ]))), 128))
                    ])) : c("", !0),
                    $t.value.length ? (e(), s("div", Jr, [
                      f[25] || (f[25] = t("h3", null, "Permanent changes", -1)),
                      (e(!0), s(Q, null, se($t.value, (U) => (e(), s("p", { key: U }, b(U), 1))), 128)),
                      ce.value.class !== "refused" ? (e(), s("div", Kr, [
                        _(a(Yl), {
                          modelValue: Ye.value,
                          "onUpdate:modelValue": f[13] || (f[13] = (U) => Ye.value = U),
                          "input-id": a(ut) + "-acknowledge",
                          binary: "",
                          disabled: ie.value
                        }, null, 8, ["modelValue", "input-id", "disabled"]),
                        t("label", {
                          for: a(ut) + "-acknowledge"
                        }, "I understand the effects of these removals", 8, Gr)
                      ])) : c("", !0)
                    ])) : c("", !0),
                    t("footer", Yr, [
                      _(a(Y), {
                        type: "button",
                        label: "Back to editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: ie.value,
                        onClick: Ae
                      }, null, 8, ["disabled"]),
                      d.value?.access.admin && ce.value.class !== "refused" ? (e(), P(a(Y), {
                        key: 0,
                        disabled: !Ue.value || ie.value || !Nt.value,
                        loading: ie.value,
                        onClick: Al
                      }, {
                        default: C(() => [
                          ee(b(h.value === "Form layout" ? "Apply layout" : "Apply changes"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled", "loading"])) : c("", !0)
                    ])
                  ], 8, Pr)) : c("", !0)
                ]),
                _: 1
              }, 8, ["visible", "busy"])
            ])
          ], 8, pr)
        ])
      ])
    ], 2));
  }
}), Qr = /* @__PURE__ */ me({
  __name: "SettingsApp",
  setup(l) {
    const m = Nl(), i = Fl(), n = J(), o = B(() => m.value.catalogId ?? ""), r = Je();
    async function v() {
      const h = r.begin(), L = o.value;
      try {
        const M = await ye.catalogSummary(L);
        r.current(h) && (n.value = M);
      } catch {
        r.current(h) && (n.value = void 0);
      }
    }
    fe(o, () => {
      n.value = void 0, v();
    }), yt(v), Ke(() => {
      r.begin();
    });
    function p() {
      m.value.embedded ? i("open-catalog-picker", {}) : i("navigate", { route: "" });
    }
    return (h, L) => o.value ? (e(), P(Zr, {
      key: o.value,
      "catalog-id": o.value,
      title: n.value?.title || "Catalog",
      catalog: n.value,
      embedded: a(m).embedded,
      "focus-back": a(m).focusBack,
      route: a(m).route,
      onNavigate: L[0] || (L[0] = (M) => a(i)("navigate", { route: M })),
      "back-label": a(m).embedded ? "Back to catalogs" : "Back to catalog settings",
      onBack: p,
      onDirtyChanged: L[1] || (L[1] = (M) => a(i)("dirty-change", { dirty: M }))
    }, null, 8, ["catalog-id", "title", "catalog", "embedded", "focus-back", "route", "back-label"])) : c("", !0);
  }
});
class Xr extends zl {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "catalog-id": { type: "string", default: "" }, embedded: { type: "boolean", default: !1 }, route: { type: "string" }, "focus-back": { type: "boolean", default: !1 } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: Bl
    };
  }
  static get vueConfig() {
    return { rootComponent: Qr, plugins: [Ml] };
  }
}
Xl(import.meta.url, Xr);
