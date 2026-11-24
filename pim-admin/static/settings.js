import { d as Tl, u as yt, r as Je, e as al, h as Il, b as ht, p as ye, c as He, a as Fe, _ as ft, i as ql, S as Dl, f as Nl, g as Fl, W as zl, s as Bl, P as Ml } from "./styles-CsjeEppB.js";
import { defineComponent as pe, computed as z, openBlock as e, createBlock as R, resolveDynamicComponent as sl, normalizeProps as Ll, guardReactiveProps as El, createSlots as $e, withCtx as V, createElementVNode as t, normalizeClass as je, createElementBlock as s, Fragment as Z, renderList as se, toDisplayString as h, createCommentVNode as u, unref as a, renderSlot as he, ref as H, onUnmounted as Ke, createVNode as $, createStaticVNode as Wl, createTextVNode as X, withModifiers as ze, normalizeStyle as Vt, useId as Oe, watch as ge, withKeys as ot, nextTick as qe, provide as il, inject as jt, useModel as At, Transition as nl, withDirectives as Rt, vShow as Pt, mergeModels as gt, onBeforeUnmount as Hl, toRaw as Jl, onMounted as ol, useSlots as Kl, mergeProps as Gl } from "vue";
import { Icon as oe } from "@iconify/vue";
import _e from "primevue/tag";
import Y from "primevue/button";
import Yl from "primevue/checkbox";
import Ve from "primevue/message";
import { api as Zl, on as dl, host as tt, loadByTagName as Ql, define as Xl } from "@wippy-fe/proxy";
import Tt from "primevue/selectbutton";
import lt from "primevue/inputtext";
import rl from "primevue/multiselect";
import dt from "primevue/toggleswitch";
import xe from "primevue/select";
import ea from "primevue/inputnumber";
import ta from "primevue/textarea";
const la = ["aria-label"], aa = {
  key: 0,
  class: "kx-settings-rail-group"
}, sa = ["aria-current", "onClick"], ia = { class: "kx-settings-rail-label" }, na = /* @__PURE__ */ pe({
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
    const m = l, i = z(() => m.leadingItem ? [{ items: [m.leadingItem] }, ...m.groups] : m.groups);
    function n(o) {
      const d = [...o.currentTarget.querySelectorAll(".kx-settings-rail-item")], v = d.indexOf(o.target);
      if (v < 0) return;
      let c;
      switch (o.key) {
        case "ArrowDown":
        case "ArrowRight":
          c = (v + 1) % d.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          c = (v + d.length - 1) % d.length;
          break;
        case "Home":
          c = 0;
          break;
        case "End":
          c = d.length - 1;
          break;
        default:
          return;
      }
      o.preventDefault(), d[c]?.focus();
    }
    return (o, d) => (e(), R(sl(l.title ? Tl : "div"), Ll(El(l.title ? { title: l.title, count: l.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), $e({
      default: V(() => [
        t("nav", {
          class: je(["kx-settings-rail", { "kx-settings-rail-framed": l.title }]),
          "aria-label": l.label,
          onKeydown: n
        }, [
          (e(!0), s(Z, null, se(i.value, (v, c) => (e(), s("div", {
            key: v.items[0]?.value ?? c,
            class: je(["kx-settings-rail-section", { "kx-settings-rail-leading": l.leadingItem && c === 0 }])
          }, [
            v.heading ? (e(), s("div", aa, h(v.heading), 1)) : u("", !0),
            (e(!0), s(Z, null, se(v.items, (k) => (e(), s("button", {
              key: k.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": k.value === l.value ? "true" : void 0,
              onClick: (B) => o.$emit("update:value", k.value)
            }, [
              k.icon ? (e(), R(a(oe), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: k.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : u("", !0),
              t("span", ia, h(k.label), 1)
            ], 8, sa))), 128))
          ], 2))), 128))
        ], 42, la)
      ]),
      _: 2
    }, [
      l.title && o.$slots.actions ? {
        name: "actions",
        fn: V(() => [
          he(o.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), oa = { class: "pim-stack" }, da = { class: "form pim-access-card pim-ia-action" }, ra = { class: "pim-access-summary" }, ua = ["config"], ca = /* @__PURE__ */ pe({
  __name: "CatalogShare",
  props: {
    catalogId: {},
    title: {},
    access: {}
  },
  setup(l) {
    const m = l, i = H(!1), n = H(!1), o = H(""), d = H(), v = H(!1), c = Je(), k = z(() => "/api/v1/component-access/grants/" + encodeURIComponent(m.catalogId)), B = z(() => JSON.stringify({
      resource_id: m.catalogId,
      title: m.title,
      access_url: k.value,
      share_url: "/api/v1/component-access/share/" + encodeURIComponent(m.catalogId)
    })), E = z(() => {
      if (!m.access.admin) return "Only catalog administrators can manage sharing.";
      if (!d.value) return v.value ? "Member counts are unavailable." : "Loading members…";
      const { people: M, groups: y } = d.value;
      return M + (M === 1 ? " person" : " people") + " and " + y + (y === 1 ? " group" : " groups") + " with direct access";
    });
    async function G() {
      if (!m.access.admin) return;
      const M = c.begin();
      v.value = !1;
      try {
        const { data: y } = await Zl.get(k.value);
        if (!c.current(M)) return;
        if (!y?.success || !Array.isArray(y.access)) throw new Error("Grants unavailable");
        const C = y.access.filter((p) => p.subject_type === "group").length;
        d.value = { people: y.access.length - C, groups: C };
      } catch {
        c.current(M) && (d.value = void 0, v.value = !0);
      }
    }
    yt(G), Ke(() => {
      c.begin();
    });
    async function J() {
      n.value = !0, o.value = "", await al("kickside-share") ? i.value = !0 : o.value = "Could not open sharing. Try again.", n.value = !1;
    }
    return (M, y) => (e(), s("div", oa, [
      t("section", da, [
        t("div", null, [
          y[1] || (y[1] = t("h3", null, "Members and sharing", -1)),
          t("p", ra, h(E.value), 1)
        ]),
        l.access.admin ? (e(), R(a(Y), {
          key: 0,
          type: "button",
          label: "Share catalog",
          loading: n.value,
          onClick: J
        }, {
          icon: V(() => [
            $(a(oe), {
              icon: "tabler:share",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : u("", !0),
        v.value ? (e(), R(a(Y), {
          key: 1,
          type: "button",
          label: "Reload member counts",
          severity: "secondary",
          text: "",
          onClick: G
        })) : u("", !0)
      ]),
      y[2] || (y[2] = Wl('<section class="form pim-access-card pim-stack" aria-labelledby="pim-access-roles-heading"><h3 id="pim-access-roles-heading">What members can do</h3><dl class="pim-access-roles"><div><dt>Read</dt><dd>View products and their details.</dd></div><div><dt>Write</dt><dd>Create products and update their values.</dd></div><div><dt>Delete</dt><dd>Move products to trash.</dd></div><div><dt>Admin</dt><dd>Manage catalog settings and who has access.</dd></div></dl></section>', 1)),
      i.value ? (e(), s("kickside-share", {
        key: 0,
        config: B.value,
        onClose: y[0] || (y[0] = (C) => i.value = !1),
        onChanged: G
      }, null, 40, ua)) : u("", !0),
      o.value ? (e(), R(a(Ve), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: V(() => [
          X(h(o.value), 1)
        ]),
        _: 1
      })) : u("", !0)
    ]));
  }
});
function pa(l, m, i = {}) {
  const n = JSON.stringify(l), o = JSON.stringify(i);
  return {
    declaration: JSON.parse(n),
    generation: m,
    pluginConfigs: JSON.parse(o),
    matches: (d, v, c = {}) => m === v && n === JSON.stringify(d) && o === JSON.stringify(c)
  };
}
function Zt(l, m) {
  const i = {};
  for (const [n, o] of Object.entries(m)) {
    const d = o.filter((v) => n === "plugins" ? !l.plugins?.some((c) => c.use === v) : n === "scopes" ? !l.scopes?.includes(v) : n === "attributes" ? !l.aspects?.some((c) => c.attributes?.some((k) => c.namespace + "." + k.code === v)) : n === "aspects" ? !l.aspects?.some((c) => c.namespace === v) : n === "dimensions" ? !l.dimensions?.some((c) => c.name === v) : n === "vocabularies" || n === "families" ? !l[n]?.some((c) => c.code === v) : !l[n]?.some((c) => c.id === v));
    d.length && (i[n] = d);
  }
  return i;
}
const Qt = (l) => !!l && typeof l == "object" && !Array.isArray(l), me = ["string"], ul = { "*": "string" }, ma = { id: "number", code: "string!", type: "string!", scope: me, cardinality: "string", index: "string", index_contexts: [ul], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, va = {
  dimensions: [{ name: "string!", members: me, fallback: { "*": me } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: me }, attributes: [ma] }],
  families: [{ code: "string!", aspects: me, variation: [{ axes: me, own: me }], requirements: [{ id: "string!", context: ul, require: me, authored: me }], checks: [{ check: "string!", reads: me, cost: "string", config: "object", enforce: "string" }] }],
  sources: [{ id: "string!", ordering: "string", writes: me, principals: me, audit: "boolean" }],
  channels: [{ id: "string!", requirements: me, families: me }],
  plugins: [{ use: "string!", schema: "json" }],
  scopes: me,
  policy: { "*": "policy" },
  remove: { dimensions: me, vocabularies: me, aspects: me, families: me, sources: me, channels: me, attributes: me, scopes: me, plugins: me }
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
      const d = m[n] ?? m["*"];
      if (!d) throw new Error(`${i}.${n} is not an editor field.`);
      Ot(o, d, `${i}.${n}`);
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
function ce(l, m) {
  return !l || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(l) ? m : l;
}
function nt(l) {
  return l ? ce(l.title, "Field type") : "Unknown type";
}
async function cl(l, m) {
  const i = [...new Set(m)].map((o) => ({ type: "user", id: o }));
  if (!i.length) return {};
  const n = await Il(`/api/v1/pim-admin/catalogs/${encodeURIComponent(l)}/principal_labels`, { refs: i }, "People");
  return Object.fromEntries((n.principals ?? []).map((o) => [o.id, ce(o.label, "Person")]));
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
function W(l) {
  const i = (l.includes(".") ? l.slice(l.indexOf(".") + 1) : l).replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return i ? i[0].toUpperCase() + i.slice(1) : l;
}
function bt(l, m) {
  const i = l.properties;
  return ce(i?.[m]?.title, ce(W(m), "This setting"));
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
        o.push(W(i.code)), m.set(n, o);
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
        const d = o.ref[1].slice(o.ref[1].indexOf(":") + 1), v = o.ref[1].slice(0, o.ref[1].indexOf(":")), c = m?.[v]?.find((k) => k.code === d);
        return c ? Ee(c) : d;
      }
      return "Linked " + W(o.ref[0]).toLocaleLowerCase();
    }
    if (typeof n == "object" && "v" in n) {
      const o = n;
      return Ut(o.v) + " " + o.u;
    }
    return typeof n == "object" && "m" in n ? Ut(n) : typeof n == "boolean" ? n ? "Yes" : "No" : typeof n == "object" ? JSON.stringify(n) : ce(String(n), "Linked record");
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
}, Ua = { class: "pim-aspect-head" }, Aa = { class: "muted small" }, Ra = { class: "pim-canvas" }, Pa = { class: "pim-lcard-top" }, Ta = { class: "pim-lcard-name" }, Ia = { class: "pim-lcard-type" }, qa = /* @__PURE__ */ pe({
  __name: "LayoutEditor",
  props: {
    draft: {},
    schema: {},
    types: {}
  },
  emits: ["families"],
  setup(l, { emit: m }) {
    const i = l, n = m, o = z(() => i.schema.access.admin), d = z(() => i.draft?.aspects ?? []), v = z(() => new Map(i.types.map((p) => [p.id, nt(p)]))), c = z(() => pl(i.draft.families)), k = z(() => {
      if (!i.schema) return [];
      const p = new Set((i.draft?.aspects ?? []).map((A) => A.namespace)), S = /* @__PURE__ */ new Map();
      for (const [A, j] of Object.entries(i.schema.attributes)) {
        const F = A.split(".")[0];
        p.has(F) || !j.plugin || (S.has(F) || S.set(F, { aspect: F, plugin: j.plugin, codes: [] }), S.get(F).codes.push(A));
      }
      return [...S.values()];
    });
    function B(p, S) {
      return vt.find((A) => A.value === St(i.schema, p, S))?.span ?? 6;
    }
    const E = H(null), G = H(null);
    function J(p, S, A) {
      o.value && (E.value = { ns: p, index: S }, A.dataTransfer?.setData("text/plain", p + ":" + S), A.dataTransfer && (A.dataTransfer.effectAllowed = "move"));
    }
    function M(p, S, A) {
      !E.value || E.value.ns !== p || (A.preventDefault(), G.value = { ns: p, index: S });
    }
    function y(p, S) {
      o.value && E.value?.ns === p.namespace && mt(p.attributes ?? [], E.value.index, S), E.value = null, G.value = null;
    }
    function C() {
      E.value = null, G.value = null;
    }
    return (p, S) => (e(), s("div", ha, [
      o.value ? (e(), s("p", ka, "Arrange fields within each group and choose their widths. Review changes before applying the layout.")) : u("", !0),
      d.value.length === 0 ? (e(), s("div", _a, [
        S[2] || (S[2] = X("This catalog has no field groups yet.", -1)),
        o.value ? (e(), s(Z, { key: 0 }, [
          X(" Add a field group in Fields.")
        ], 64)) : u("", !0)
      ])) : u("", !0),
      (e(!0), s(Z, null, se(d.value, (A) => (e(), s("section", {
        key: A.namespace,
        class: "pim-aspect"
      }, [
        t("header", wa, [
          t("div", null, [
            t("h3", null, h(a(W)(A.namespace)), 1),
            t("p", $a, h(c.value.get(A.namespace) ?? "No named family uses this group yet."), 1)
          ]),
          o.value && !c.value.has(A.namespace) ? (e(), R(a(Y), {
            key: 0,
            label: "Open families",
            type: "button",
            text: "",
            size: "small",
            onClick: S[0] || (S[0] = (j) => n("families"))
          })) : u("", !0)
        ]),
        t("div", {
          class: "pim-canvas",
          onDragover: S[1] || (S[1] = ze(() => {
          }, ["prevent"]))
        }, [
          (e(!0), s(Z, null, se(A.attributes ?? [], (j, F) => (e(), s("div", {
            key: j.code,
            class: je(["pim-lcard", { dragging: E.value?.ns === A.namespace && E.value?.index === F, over: G.value?.ns === A.namespace && G.value?.index === F }]),
            style: Vt({ gridColumn: "span " + B(A.namespace, j) }),
            draggable: o.value,
            onDragstart: (Q) => J(A.namespace, F, Q),
            onDragover: (Q) => M(A.namespace, F, Q),
            onDrop: ze((Q) => y(A, F), ["prevent"]),
            onDragend: C
          }, [
            t("div", xa, [
              o.value ? (e(), s("span", Va, [
                $(a(oe), { icon: "tabler:grip-vertical" })
              ])) : u("", !0),
              t("span", ja, h(a(W)(j.code)), 1),
              t("span", Oa, h(v.value.get(j.type) ?? a(nt)(void 0)), 1),
              o.value ? (e(), s("span", Sa, [
                $(a(Y), {
                  type: "button",
                  disabled: F === 0,
                  "aria-label": "Move " + a(W)(j.code) + " earlier",
                  onClick: (Q) => a(mt)(A.attributes ?? [], F, F - 1),
                  class: "kx-iconbtn sm",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: V(() => [
                    $(a(oe), { icon: "tabler:arrow-left" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                $(a(Y), {
                  type: "button",
                  disabled: F === (A.attributes ?? []).length - 1,
                  "aria-label": "Move " + a(W)(j.code) + " later",
                  onClick: (Q) => a(mt)(A.attributes ?? [], F, F + 1),
                  class: "kx-iconbtn sm",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: V(() => [
                    $(a(oe), { icon: "tabler:arrow-right" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ])) : u("", !0)
            ]),
            $(a(Tt), {
              disabled: !o.value,
              "model-value": a(St)(l.schema, A.namespace, j),
              options: a(vt),
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Width of " + a(W)(j.code),
              "onUpdate:modelValue": (Q) => j.width = Q
            }, null, 8, ["disabled", "model-value", "options", "aria-label", "onUpdate:modelValue"])
          ], 46, Ca))), 128))
        ], 32)
      ]))), 128)),
      (e(!0), s(Z, null, se(k.value, (A) => (e(), s("section", {
        key: A.aspect,
        class: "pim-aspect"
      }, [
        t("header", Ua, [
          t("div", null, [
            t("h3", null, h(a(W)(A.aspect)), 1),
            t("p", Aa, h(c.value.get(A.aspect) ?? "No named family uses this group yet."), 1)
          ]),
          S[3] || (S[3] = t("span", { class: "muted small" }, "Provided by a plugin", -1))
        ]),
        t("div", Ra, [
          (e(!0), s(Z, null, se(A.codes, (j) => (e(), s("div", {
            key: j,
            class: "pim-lcard fixed",
            style: Vt({ gridColumn: "span " + (a(vt).find((F) => F.value === l.schema.attributes[j].width)?.span ?? 6) })
          }, [
            t("div", Pa, [
              t("span", Ta, h(a(W)(j)), 1),
              t("span", Ia, h(v.value.get(l.schema.attributes[j].type) ?? a(nt)(void 0)), 1)
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
}, ls = { class: "pim-table-foot" }, as = /* @__PURE__ */ pe({
  __name: "HistoryPanel",
  props: {
    catalogId: {},
    canResolveActors: { type: Boolean }
  },
  setup(l) {
    const m = l, i = H([]), n = H({}), o = H(), d = H(!1), v = H(), c = Je(), k = Oe(), B = z(() => i.value.map((y) => ({
      key: `${y.seq}:${y.n}`,
      at: y.at,
      date: ba(y.at),
      actor: n.value[y.actor] ?? ce(y.actor, "Person"),
      source: y.source ? ce(W(y.source), "Data source") : "",
      product: G(y),
      context: y.ctx ? ce(y.ctx, "Product context") : "",
      change: J(y)
    })));
    async function E(y = !1) {
      const C = c.begin();
      d.value = !0, v.value = void 0;
      try {
        const p = await ye.history(m.catalogId, { limit: 50, before: y ? o.value : void 0 });
        if (!c.current(C)) return;
        if (i.value = y ? [...i.value, ...p.entries] : p.entries, o.value = p.next, m.canResolveActors)
          try {
            const S = await cl(m.catalogId, p.entries.map((A) => A.actor));
            c.current(C) && (n.value = { ...n.value, ...S });
          } catch {
          }
      } catch (p) {
        if (!c.current(C)) return;
        v.value = He(p, "Could not load the history.");
      } finally {
        c.current(C) && (d.value = !1);
      }
    }
    function G(y) {
      return y.sku ? y.sku : y.subject.startsWith("p:") ? "purged product" : y.subject.startsWith("t:") ? y.subject.slice(2) : y.subject.startsWith("r:") ? "Release" : ce(y.subject, "Catalog");
    }
    function J(y) {
      if (y.attribute)
        return ya(W(y.attribute), y.before, y.after);
      switch (y.kind) {
        case "schema":
          return "Catalog settings applied";
        case "term": {
          const C = y.after ?? {}, p = C.labels?.en ?? Object.values(C.labels ?? {})[0];
          return C.retired ? "Term retired" : p ? `Term labelled "${p}"` + (C.parent ? ` under ${C.parent}` : "") : "Term changed";
        }
        case "created": {
          const C = y.after ?? {};
          return `Created as ${W(C.family ?? "product")}` + (C.level ? ` at level ${C.level}` : "");
        }
        case "released": {
          const C = y.after ?? {};
          return `Released v${C.version ?? ""} to ${(C.channels ?? []).join(", ")}`;
        }
        case "withdrawn":
          return `Withdrawn from ${((y.after ?? {}).channels ?? []).join(", ")}`;
        case "status":
          return `Status ${String(y.before ?? "")} → ${String(y.after ?? "")}`;
        case "moved":
          return "Moved under another parent";
        default:
          return W(y.kind);
      }
    }
    let M = () => {
    };
    return ge(() => m.catalogId, () => {
      M(), c.begin(), i.value = [], n.value = {}, o.value = void 0, v.value = void 0, M = dl(`component.${m.catalogId}`, () => {
        E();
      });
    }, { immediate: !0 }), ge(() => m.catalogId, () => {
      E();
    }), yt(() => E()), Ke(() => {
      M(), c.begin();
    }), (y, C) => (e(), s("section", Da, [
      v.value ? (e(), R(ht, {
        key: 0,
        error: v.value
      }, {
        default: V(() => [
          $(a(Y), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: C[0] || (C[0] = (p) => E())
          }, {
            default: V(() => [...C[2] || (C[2] = [
              X("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : u("", !0),
      d.value ? (e(), s("div", Na, "Loading history…")) : u("", !0),
      t("div", Fa, [
        t("p", {
          id: a(k),
          class: "pim-history-caption muted small"
        }, "Catalog changes, newest first", 8, za),
        B.value.length ? (e(), s(Z, { key: 0 }, [
          t("table", {
            class: "pim-grid",
            "aria-labelledby": a(k)
          }, [
            t("thead", null, [
              t("tr", null, [
                C[3] || (C[3] = t("th", { scope: "col" }, "When", -1)),
                l.canResolveActors ? (e(), s("th", Ma, "Who")) : u("", !0),
                C[4] || (C[4] = t("th", { scope: "col" }, "What", -1)),
                C[5] || (C[5] = t("th", { scope: "col" }, "Change", -1))
              ])
            ]),
            t("tbody", null, [
              (e(!0), s(Z, null, se(B.value, (p) => (e(), s("tr", {
                key: p.key
              }, [
                t("td", La, [
                  t("time", {
                    datetime: p.at
                  }, h(p.date), 9, Ea)
                ]),
                l.canResolveActors ? (e(), s("td", Wa, [
                  X(h(p.actor), 1),
                  p.source ? (e(), s("span", Ha, " via " + h(p.source), 1)) : u("", !0)
                ])) : u("", !0),
                t("td", Ja, [
                  X(h(p.product), 1),
                  p.context ? (e(), s("span", Ka, " · " + h(p.context), 1)) : u("", !0)
                ]),
                t("td", null, [
                  X(h(p.change), 1),
                  !l.canResolveActors && p.source ? (e(), s("span", Ga, " via " + h(p.source), 1)) : u("", !0)
                ])
              ]))), 128))
            ])
          ], 8, Ba),
          t("ol", {
            role: "list",
            class: "pim-stacked-list",
            "aria-labelledby": a(k)
          }, [
            (e(!0), s(Z, null, se(B.value, (p) => (e(), s("li", {
              key: p.key,
              class: "pim-stacked-row"
            }, [
              t("div", null, h(p.change), 1),
              t("div", Za, [
                l.canResolveActors ? (e(), s("span", Qa, [
                  t("span", null, h(p.actor), 1),
                  p.source ? (e(), s(Z, { key: 0 }, [
                    X(" via " + h(p.source), 1)
                  ], 64)) : u("", !0)
                ])) : p.source ? (e(), s("span", Xa, "Via " + h(p.source), 1)) : u("", !0),
                t("time", {
                  datetime: p.at
                }, h(p.date), 9, es),
                t("span", null, [
                  X(h(p.product), 1),
                  p.context ? (e(), s(Z, { key: 0 }, [
                    X(" · " + h(p.context), 1)
                  ], 64)) : u("", !0)
                ])
              ])
            ]))), 128))
          ], 8, Ya)
        ], 64)) : !d.value && !v.value ? (e(), s("div", ts, "Nothing recorded yet.")) : u("", !0),
        t("div", ls, [
          t("span", null, h(B.value.length) + " change" + h(B.value.length === 1 ? "" : "s") + " shown", 1),
          o.value ? (e(), R(a(Y), {
            key: 0,
            type: "button",
            disabled: d.value,
            onClick: C[1] || (C[1] = (p) => E(!0)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: V(() => [
              $(a(oe), {
                icon: "tabler:adjustments",
                "aria-hidden": "true"
              }),
              C[6] || (C[6] = X(" Load older", -1))
            ]),
            _: 1
          }, 8, ["disabled"])) : u("", !0)
        ])
      ])
    ]));
  }
}), ss = { class: "system-section-head" }, is = { class: "system-section-head-text" }, ns = {
  key: 0,
  class: "kx-head-actions"
}, os = /* @__PURE__ */ pe({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(l) {
    return (m, i) => (e(), s("header", ss, [
      t("div", is, [
        t("h1", null, h(l.title), 1),
        t("p", null, h(l.description), 1)
      ]),
      m.$slots.actions ? (e(), s("div", ns, [
        he(m.$slots, "actions")
      ])) : u("", !0)
    ]));
  }
}), ds = /* @__PURE__ */ pe({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(l) {
    return (m, i) => (e(), s(Z, null, [
      $(a(_e), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      $(a(Y), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: l.busy || l.discardDisabled,
        onClick: i[0] || (i[0] = (n) => m.$emit("discard"))
      }, {
        icon: V(() => [
          $(a(oe), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      $(a(Y), {
        label: "Review changes",
        type: "button",
        disabled: l.busy || l.reviewDisabled,
        loading: l.busy,
        onClick: i[1] || (i[1] = (n) => m.$emit("review", n.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), rs = ["onKeydown"], us = { class: "row pim-add-actions" }, cs = ["id"], Be = /* @__PURE__ */ pe({
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
    const i = l, n = m, o = H(""), d = H(!1), v = H(), c = Oe(), k = z(() => {
      const y = o.value.trim();
      return i.fromName ? ga(y) : y;
    }), B = z(() => o.value.trim() ? i.existing?.includes(k.value) ? i.fromName ? "This name is already in use." : "This code is already in use." : i.fromName && !Xt.test(k.value) ? "Use a name that starts with a letter from A to Z." : Xt.test(k.value) ? "" : "Start with a lowercase letter and use only lowercase letters, numbers or underscores." : ""), E = z(() => !!k.value && !B.value);
    async function G() {
      d.value = !0, await qe(), v.value?.querySelector("input")?.focus();
    }
    async function J() {
      d.value = !1, o.value = "", await qe(), v.value?.querySelector("button")?.focus();
    }
    function M() {
      E.value && (n("add", k.value), J());
    }
    return (y, C) => (e(), s("div", {
      ref_key: "row",
      ref: v,
      class: "row pim-add-row"
    }, [
      d.value ? (e(), s("div", {
        key: 1,
        class: "row pim-add-editor",
        onKeydown: ot(ze(J, ["stop", "prevent"]), ["esc"])
      }, [
        $(a(lt), {
          modelValue: o.value,
          "onUpdate:modelValue": C[0] || (C[0] = (p) => o.value = p),
          type: "text",
          placeholder: l.label,
          "aria-label": l.label,
          invalid: !!B.value,
          "aria-describedby": B.value ? a(c) : void 0,
          class: je({ mono: !l.fromName }),
          onKeydown: ot(ze(M, ["prevent"]), ["enter"])
        }, null, 8, ["modelValue", "placeholder", "aria-label", "invalid", "aria-describedby", "class", "onKeydown"]),
        t("div", us, [
          $(a(Y), {
            type: "button",
            disabled: !E.value,
            onClick: M
          }, {
            default: V(() => [
              X(h(l.action), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          $(a(Y), {
            type: "button",
            label: "Cancel",
            outlined: "",
            severity: "secondary",
            onClick: J
          })
        ]),
        B.value ? (e(), s("p", {
          key: 0,
          id: a(c),
          role: "status",
          class: "pim-add-code-error small"
        }, h(B.value), 9, cs)) : u("", !0)
      ], 40, rs)) : (e(), R(a(Y), {
        key: 0,
        type: "button",
        "aria-expanded": "false",
        severity: "secondary",
        outlined: "",
        size: l.regular ? void 0 : "small",
        onClick: G
      }, {
        default: V(() => [
          $(a(oe), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          X(" " + h(l.action), 1)
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
}, bs = { class: "pim-definition-actions-heading" }, at = /* @__PURE__ */ pe({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: { default: () => ["code"] },
    showActions: { type: Boolean }
  },
  setup(l) {
    const m = l;
    il(ml, z(() => m.columns));
    const i = z(() => ["48px", "minmax(160px, 1.4fr)", ...m.columns.map((n) => ms[n]), m.showActions ? "100px" : "80px"].join(" "));
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
            (e(!0), s(Z, null, se(l.columns, (d) => (e(), s("span", {
              key: d,
              class: je("pim-definition-" + d)
            }, h(a(ps)[d]), 3))), 128)),
            t("span", bs, h(l.showActions ? "Actions" : ""), 1)
          ])) : u("", !0),
          he(n.$slots, "default")
        ])
      ]),
      he(n.$slots, "add")
    ], 4));
  }
}), ys = ["aria-label"], hs = /* @__PURE__ */ pe({
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
}, js = ["id"], st = /* @__PURE__ */ pe({
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
    const m = l, i = jt(ml, z(() => [
      ...m.code ? ["code"] : [],
      ...m.kind ? ["kind"] : []
    ])), n = At(l, "open"), o = Oe(), d = jt(It, void 0);
    function v(k) {
      return !!m.routeSection && !!m.routeId && k === m.routeSection + "/" + m.routeId;
    }
    ge(() => d?.selected.value, (k, B) => {
      v(k) ? n.value = !0 : v(B) && (n.value = !1);
    }, { immediate: !0 });
    function c() {
      const k = !n.value;
      n.value = k, m.routeSection && m.routeId && d?.choose(m.routeSection, m.routeId, k);
    }
    return (k, B) => (e(), s("section", ks, [
      t("header", {
        class: je(["pim-definition-head", l.headClass])
      }, [
        $(hs, {
          class: je(["pim-definition-toggle", l.toggleClass]),
          "aria-expanded": n.value,
          "aria-controls": n.value ? a(o) : void 0,
          onClick: c
        }, {
          default: V(() => [
            t("span", _s, [
              $(a(oe), {
                icon: "tabler:chevron-right",
                class: "pim-definition-chevron",
                "aria-hidden": "true"
              })
            ]),
            t("span", ws, h(l.title), 1),
            t("span", $s, [
              (e(!0), s(Z, null, se(a(i), (E) => (e(), s("span", {
                key: E,
                class: je("pim-definition-" + E),
                "data-column": E
              }, [
                E === "code" && l.code ? (e(), s("code", xs, h(l.code), 1)) : E === "kind" && l.kind ? (e(), R(a(_e), {
                  key: 1,
                  severity: "secondary",
                  value: l.kind
                }, null, 8, ["value"])) : E === "details" ? he(k.$slots, "details", {}, void 0, void 0, 2) : E === "usage" ? he(k.$slots, "usage", {}, () => [
                  X(h(l.usage), 1)
                ], void 0, 3) : u("", !0)
              ], 10, Cs))), 128))
            ])
          ]),
          _: 3
        }, 8, ["class", "aria-expanded", "aria-controls"]),
        t("div", Vs, [
          he(k.$slots, "actions")
        ])
      ], 2),
      $(nl, { name: "pim-expand" }, {
        default: V(() => [
          n.value || l.keepMounted ? Rt((e(), s("div", {
            key: 0,
            id: a(o),
            class: "pim-definition-body"
          }, [
            he(k.$slots, "default")
          ], 8, js)), [
            [Pt, n.value]
          ]) : u("", !0)
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
}, Pe = /* @__PURE__ */ pe({
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
    const i = l, n = m, o = H("");
    function d(G) {
      return i.modelValue.includes(G);
    }
    function v(G) {
      i.disabled || !G || n("update:modelValue", d(G) ? i.modelValue.filter((J) => J !== G) : [...i.modelValue, G]);
    }
    function c() {
      const G = o.value.trim();
      if (!G || d(G)) {
        o.value = "";
        return;
      }
      n("update:modelValue", [...i.modelValue, G]), o.value = "";
    }
    function k(G) {
      n("update:modelValue", i.modelValue.filter((J) => J !== G));
    }
    const B = z(() => i.modelValue.map((G) => i.options?.find((J) => J.value === G) ?? { value: G }));
    function E(G) {
      const J = G.label ?? G.value;
      return G.detail ? J + " " + G.detail : J;
    }
    return (G, J) => (e(), s("div", Os, [
      l.disabled ? (e(), s(Z, { key: 0 }, [
        (e(!0), s(Z, null, se(B.value, (M) => (e(), s("span", {
          key: M.value
        }, [
          X(h(M.label ?? M.value) + " ", 1),
          M.detail ? (e(), s("small", Ss, h(M.detail), 1)) : u("", !0)
        ]))), 128)),
        l.modelValue.length ? u("", !0) : (e(), s("span", Us, "None"))
      ], 64)) : l.options && (l.dropdown || l.options.length > 10) ? (e(), s(Z, { key: 1 }, [
        (e(!0), s(Z, null, se(B.value, (M) => (e(), s("span", {
          key: M.value,
          class: "row"
        }, [
          t("span", null, [
            X(h(M.label ?? M.value) + " ", 1),
            M.detail ? (e(), s("small", As, h(M.detail), 1)) : u("", !0)
          ]),
          $(a(Y), {
            type: "button",
            "aria-label": "Remove " + E(M),
            onClick: (y) => k(M.value),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: V(() => [
              $(a(oe), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128)),
        l.disabled ? u("", !0) : (e(), R(a(xe), {
          key: 0,
          "model-value": null,
          placeholder: l.placeholder ?? "Add…",
          "aria-labelledby": l.labelledby,
          "aria-label": l.placeholder ?? "Add",
          "onUpdate:modelValue": J[0] || (J[0] = (M) => v(M)),
          class: "pim-chip-entry",
          options: l.options.filter((M) => !d(M.value)),
          "option-label": E,
          "option-value": "value",
          appendTo: "self"
        }, {
          option: V(({ option: M }) => [
            t("span", null, [
              X(h(M.label ?? M.value) + " ", 1),
              M.detail ? (e(), s("small", Rs, h(M.detail), 1)) : u("", !0)
            ])
          ]),
          _: 1
        }, 8, ["placeholder", "aria-labelledby", "aria-label", "options"]))
      ], 64)) : l.options ? (e(), s(Z, { key: 2 }, [
        $(a(Tt), {
          "model-value": l.modelValue.filter((M) => l.options.some((y) => y.value === M)),
          options: l.options.map((M) => ({ value: M.value, label: M.label ?? M.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          disabled: l.disabled,
          "aria-labelledby": l.labelledby,
          "aria-label": l.placeholder ?? "Selected values",
          "onUpdate:modelValue": J[1] || (J[1] = (M) => n("update:modelValue", [...M, ...l.modelValue.filter((y) => !l.options.some((C) => C.value === y))]))
        }, null, 8, ["model-value", "options", "disabled", "aria-labelledby", "aria-label"]),
        (e(!0), s(Z, null, se(l.modelValue.filter((M) => !l.options.some((y) => y.value === M)), (M) => (e(), s("span", {
          key: M,
          class: "row"
        }, [
          X(h(M), 1),
          $(a(Y), {
            type: "button",
            "aria-label": "Remove " + M,
            onClick: (y) => k(M),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: V(() => [
              $(a(oe), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128))
      ], 64)) : (e(!0), s(Z, { key: 3 }, se(l.modelValue, (M) => (e(), s("span", {
        key: M,
        class: "row"
      }, [
        X(h(M), 1),
        $(a(Y), {
          type: "button",
          "aria-label": "Remove " + M,
          onClick: (y) => k(M),
          size: "small",
          text: "",
          severity: "secondary"
        }, {
          default: V(() => [
            $(a(oe), { icon: "tabler:x" })
          ]),
          _: 1
        }, 8, ["aria-label", "onClick"])
      ]))), 128)),
      l.free && !l.disabled ? (e(), R(a(lt), {
        key: 4,
        modelValue: o.value,
        "onUpdate:modelValue": J[2] || (J[2] = (M) => o.value = M),
        type: "text",
        "aria-labelledby": l.labelledby,
        placeholder: l.placeholder ?? "Add…",
        onKeydown: ot(ze(c, ["prevent"]), ["enter"]),
        onBlur: c,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "aria-labelledby", "placeholder", "onKeydown"])) : u("", !0)
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
}, qt = /* @__PURE__ */ pe({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean },
    problem: {},
    pluginId: {},
    refusal: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(l, { expose: m, emit: i }) {
    const n = l, o = i, d = H(), v = H(0), c = H("pending"), k = z(() => {
      const A = n.schema.properties;
      return !A || typeof A != "object" ? n.schema : {
        ...n.schema,
        properties: Object.fromEntries(Object.entries(A).map(([j, F]) => [
          j,
          F && typeof F == "object" ? {
            ...F,
            title: bt(n.schema, j)
          } : F
        ]))
      };
    }), B = z(() => n.refusal ?? (n.problem?.field ? { field: n.problem.field, message: /missing required property/i.test(n.problem.message) ? "A value is required." : n.problem.message } : void 0)), E = z(() => {
      const A = B.value;
      return A && Object.hasOwn(k.value.properties ?? {}, A.field) ? { [A.field]: A.message } : {};
    }), G = z(() => Object.keys(E.value).length || n.disabled ? "" : n.refusal?.message ?? (n.problem ? "The saved settings don’t meet the plugin’s requirements. Update the configuration below." : "")), J = z(() => Object.entries(n.modelValue).map(([A, j]) => ({
      key: A,
      label: bt(n.schema, A),
      value: j !== null && typeof j == "object" ? JSON.stringify(j) : rt(j)
    })));
    async function M() {
      c.value = "pending", c.value = await al("wc-schema-form") ? "ready" : "failed";
    }
    ge(() => n.disabled, (A) => {
      A || M();
    }, { immediate: !0 });
    function y() {
      return d.value?.reportValidity();
    }
    function C(A) {
      const j = A.detail, F = Object.entries(j.errors).some(([Q, I]) => E.value[Q] !== I);
      o("validity", j.valid, F);
    }
    function p() {
      v.value++, o("update:modelValue", {});
    }
    Hl(() => o("validity", !0, !1)), m({ reportValidity: y });
    function S(A) {
      const j = A.detail;
      j && typeof j == "object" && !Array.isArray(j) && o("update:modelValue", j);
    }
    return (A, j) => (e(), s(Z, null, [
      G.value ? (e(), R(a(Ve), {
        key: 0,
        severity: "warn",
        role: "alert"
      }, {
        default: V(() => [
          X(h(G.value), 1)
        ]),
        _: 1
      })) : u("", !0),
      l.problem ? (e(), R(Fe, {
        key: 1,
        class: "small pim-error-code pim-ia-disclosure",
        label: "Technical details"
      }, {
        default: V(() => [
          l.pluginId ? (e(), s("p", Ps, [
            j[0] || (j[0] = X("Plugin ", -1)),
            t("code", null, h(l.pluginId), 1)
          ])) : u("", !0),
          t("p", null, h(l.problem.message), 1)
        ]),
        _: 1
      })) : u("", !0),
      l.disabled ? (e(), s(Z, { key: 2 }, [
        J.value.length ? (e(), s("dl", Ts, [
          (e(!0), s(Z, null, se(J.value, (F) => (e(), s(Z, {
            key: F.key
          }, [
            t("dt", null, h(F.label), 1),
            t("dd", null, h(F.value), 1)
          ], 64))), 128))
        ])) : (e(), s("span", Is, "No overrides"))
      ], 64)) : (e(), s("div", qs, [
        c.value === "ready" ? (e(), s("wc-schema-form", {
          key: v.value,
          ref_key: "widget",
          ref: d,
          "allow-unset": "",
          schema: JSON.stringify(k.value),
          config: JSON.stringify(l.modelValue),
          "field-errors": JSON.stringify(E.value),
          onConfigChanged: S,
          onValidityChanged: C
        }, null, 40, Ds)) : c.value === "pending" ? (e(), s("span", Ns, "Configuration form is loading.")) : (e(), R(a(Ve), {
          key: 2,
          role: "alert",
          severity: "error"
        }, {
          default: V(() => [
            j[2] || (j[2] = X("Configuration form could not be loaded. ", -1)),
            $(a(Y), {
              type: "button",
              onClick: M,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: V(() => [...j[1] || (j[1] = [
                X("Retry", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })),
        l.problem ? u("", !0) : (e(), R(a(Y), {
          key: 3,
          type: "button",
          onClick: p,
          severity: "secondary",
          outlined: "",
          size: "small"
        }, {
          default: V(() => [
            $(a(oe), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            }),
            j[3] || (j[3] = X(" Reset overrides", -1))
          ]),
          _: 1
        }))
      ]))
    ], 64));
  }
}), Fs = { key: 0 }, zs = /* @__PURE__ */ pe({
  __name: "DefaultValue",
  props: {
    attribute: {},
    type: {},
    disabled: { type: Boolean }
  },
  emits: ["change"],
  setup(l, { emit: m }) {
    const i = l, n = m, o = z(() => {
      const k = i.type?.form;
      let B = { type: "string" };
      return k === "bool" ? B = { type: "boolean" } : k === "int" ? B = { type: "integer" } : k === "dec" ? B = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : k === "quantity" ? B = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(i.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : k === "record" ? B = { type: "object", additionalProperties: !0 } : k === "ref" && (B = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${i.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (i.attribute.cardinality ?? "one") !== "one" && (B = { type: "array", items: B, uniqueItems: i.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...B, title: "Default value" } } };
    });
    function d(k) {
      return k && typeof k == "object" && "m" in k && "e" in k ? Ut(k) : k;
    }
    function v(k) {
      return i.type?.form === "dec" ? d(k) : i.type?.form === "quantity" && k && typeof k == "object" && "v" in k && "u" in k ? { value: d(k.v), unit: k.u } : k;
    }
    const c = z(() => i.attribute.default === void 0 ? {} : { value: Array.isArray(i.attribute.default) ? i.attribute.default.map(v) : v(i.attribute.default) });
    return (k, B) => l.disabled ? (e(), s("span", Fs, h(l.attribute.default == null ? "No default" : a(rt)(l.attribute.default)), 1)) : (e(), R(qt, {
      key: 1,
      schema: o.value,
      "model-value": c.value,
      "onUpdate:modelValue": B[0] || (B[0] = (E) => n("change", E.value))
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
}, zi = { class: "pim-source-permissions" }, Bi = ["id"], Mi = { class: "dialog-actions pim-group-dialog-actions" }, Li = /* @__PURE__ */ pe({
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
    const i = l, n = At(l, "family"), o = m, d = vt.map((N) => N.value), v = [{ value: "one", label: "Single value" }, { value: "list", label: "Ordered list" }, { value: "set", label: "Unique set" }], c = z(() => i.schema.access.admin), k = z(() => i.draft.aspects ?? []), B = z(() => (i.draft.families ?? []).filter((N) => N.code !== "generic"));
    ge(B, (N) => {
      n.value && !N.some((T) => T.code === n.value) && (n.value = "");
    }, { immediate: !0 });
    const E = z(() => [{ value: "", label: "All families" }, ...B.value.map((N) => ({ value: N.code, label: W(N.code) }))]), G = z(() => {
      const N = B.value.find((T) => T.code === n.value);
      return N ? k.value.filter((T) => N.aspects?.includes(T.namespace)) : k.value;
    }), J = z(() => (i.draft.dimensions ?? []).map((N) => ({ value: N.name, label: W(N.name) }))), M = z(() => (i.draft.vocabularies ?? []).map((N) => N.code)), y = z(() => (i.draft.sources ?? []).map((N) => ({ value: N.id, label: W(N.id) }))), C = z(() => [...i.options.types].sort((N, T) => N.form.localeCompare(T.form)).map((N) => ({ value: N.id, label: nt(N) })));
    function p(N) {
      return i.options.types.find((T) => T.id === N.type);
    }
    function S(N) {
      return p(N)?.target === "term";
    }
    function A(N) {
      return p(N)?.target === "asset";
    }
    function j(N) {
      const T = p(N);
      return !!T && T.form === "ref" && !T.target;
    }
    const F = z(() => pl(i.draft.families)), Q = { none: "None", key: "Exact match", number: "Number range", text: "Text search" }, I = H({}), ne = Oe(), Ce = /* @__PURE__ */ new WeakMap();
    let ve = 0;
    function ke(N, T) {
      if (T.id !== void 0) return N + "." + T.id;
      const D = Jl(T);
      let O = Ce.get(D);
      return O === void 0 && (O = ++ve, Ce.set(D, O)), N + ".draft-" + O;
    }
    function ie(N, T, D) {
      return ne + "-" + ke(N, T) + "-" + D;
    }
    function K(N, T) {
      N.type = T;
      const D = p(N);
      if (D && N.index && !D.indexes.includes(N.index) && delete N.index, S(N) || delete N.vocabulary, A(N) && delete N.default, !j(N) && N.config && "target" in N.config) {
        const { target: O, ...ee } = N.config;
        N.config = Object.keys(ee).length ? ee : void 0, N.config || delete N.config;
      }
    }
    function P(N, T) {
      Object.keys(T).length ? N.config = T : delete N.config;
    }
    function f(N, T) {
      const D = { ...N.config ?? {} };
      T ? D.target = T : delete D.target, P(N, D);
    }
    function _(N, T) {
      T.length ? N.scope = T : delete N.scope, T.length || delete N.index_contexts;
    }
    function r(N, T, D) {
      D === void 0 || D === "" || D === !1 && T !== "default" ? delete N[T] : N[T] = D;
    }
    function b(N) {
      return N.index_contexts ?? [];
    }
    function w(N) {
      return (i.draft.dimensions ?? []).find((T) => T.name === N)?.members ?? [];
    }
    function q(N) {
      const T = {};
      for (const O of N.scope ?? []) T[O] = w(O)[0] ?? "";
      (N.index_contexts ?? (N.index_contexts = [])).push(T);
    }
    const L = H(), le = z(() => L.value ? W(L.value.namespace) + " settings" : "");
    async function fe(N, T, D, O) {
      const ee = N.currentTarget, te = ee.parentElement;
      mt(T, D, O), await qe(), (ee.isConnected ? ee : te?.querySelector("button"))?.focus({ preventScroll: !0 });
    }
    function Se(N) {
      (i.draft.aspects ??= []).push({ namespace: N, attributes: [] });
    }
    function Me(N) {
      L.value = void 0;
      const T = k.value.indexOf(N);
      T >= 0 && k.value.splice(T, 1), i.schema.declaration.aspects?.some((D) => D.namespace === N.namespace) && o("remove", "aspects", N.namespace);
    }
    function Te(N, T) {
      const D = i.options.types.find((ee) => ee.id === "kickside.pim.types:text") ?? i.options.types[0], O = { code: T, type: D?.id ?? "" };
      (N.attributes ??= []).push(O), I.value[ke(N.namespace, O)] = !0;
    }
    function Ge(N, T) {
      const D = N.attributes ?? [], O = D.indexOf(T);
      O >= 0 && D.splice(O, 1);
      const ee = T.id === void 0 ? void 0 : i.schema.declaration.aspects?.find((te) => te.namespace === N.namespace)?.attributes?.find((te) => te.id === T.id);
      ee && o("remove", "attributes", N.namespace + "." + ee.code);
    }
    return (N, T) => (e(), s("div", Bs, [
      B.value.length || c.value && !n.value || k.value.length ? (e(), s("div", Ms, [
        B.value.length ? (e(), R(a(xe), {
          key: 0,
          modelValue: n.value,
          "onUpdate:modelValue": T[0] || (T[0] = (D) => n.value = D),
          class: "pim-family-filter",
          "aria-label": "Show fields for a family",
          placeholder: "All families",
          options: E.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self"
        }, null, 8, ["modelValue", "options"])) : u("", !0),
        c.value && !n.value ? (e(), R(Be, {
          key: 1,
          label: "Field group name",
          action: "Add field group",
          "from-name": "",
          regular: "",
          existing: k.value.map((D) => D.namespace),
          onAdd: Se
        }, null, 8, ["existing"])) : u("", !0),
        k.value.length ? (e(), R(a(Y), {
          key: 2,
          label: "Open form layout",
          type: "button",
          text: "",
          size: "small",
          onClick: T[1] || (T[1] = (D) => o("layout"))
        })) : u("", !0)
      ])) : u("", !0),
      n.value && !G.value.length ? (e(), s("p", Ls, "This family has no field groups yet. Open the family to choose which groups it uses.")) : u("", !0),
      (e(!0), s(Z, null, se(G.value, (D) => (e(), R(at, {
        key: D.namespace,
        count: D.attributes?.length ?? 0,
        columns: ["kind", "details"],
        "show-actions": c.value
      }, {
        head: V(() => [
          t("header", Es, [
            t("div", null, [
              t("h3", null, h(a(W)(D.namespace)), 1),
              t("p", Ws, h(F.value.get(D.namespace) ?? "Unused by families"), 1)
            ]),
            t("div", Hs, [
              c.value ? (e(), R(Be, {
                key: 0,
                label: "Field name",
                action: "Add field",
                "from-name": "",
                existing: D.attributes?.map((O) => O.code),
                onAdd: (O) => Te(D, O)
              }, null, 8, ["existing", "onAdd"])) : u("", !0),
              $(a(Y), {
                type: "button",
                "aria-label": a(W)(D.namespace) + " settings",
                title: a(W)(D.namespace) + " settings",
                "aria-haspopup": "dialog",
                severity: "secondary",
                text: "",
                size: "small",
                onClick: (O) => L.value = D
              }, {
                default: V(() => [
                  $(a(oe), {
                    icon: "tabler:settings",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "title", "onClick"])
            ])
          ])
        ]),
        default: V(() => [
          (e(!0), s(Z, null, se(D.attributes ?? [], (O, ee) => (e(), R(st, {
            "route-section": "fields",
            "route-id": O.id === void 0 ? void 0 : ke(D.namespace, O),
            key: ke(D.namespace, O),
            open: I.value[ke(D.namespace, O)],
            "onUpdate:open": (te) => I.value[ke(D.namespace, O)] = te,
            title: a(W)(O.code),
            kind: a(nt)(p(O)),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle"
          }, $e({
            details: V(() => [
              O.cardinality && O.cardinality !== "one" ? (e(), R(a(_e), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: V(() => [
                  X(h(v.find((te) => te.value === O.cardinality)?.label), 1)
                ]),
                _: 2
              }, 1024)) : u("", !0),
              O.scope?.length ? (e(), R(a(_e), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: V(() => [
                  X("per " + h(O.scope.map(a(W)).join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : u("", !0),
              O.index && O.index !== "none" ? (e(), R(a(_e), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: V(() => [
                  X(h(Q[O.index] || "Filterable"), 1)
                ]),
                _: 2
              }, 1024)) : u("", !0),
              O.unique ? (e(), R(a(_e), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: V(() => [...T[7] || (T[7] = [
                  X("unique", -1)
                ])]),
                _: 1
              })) : u("", !0)
            ]),
            default: V(() => [
              t("div", Js, [
                t("div", Ks, [
                  t("div", Gs, [
                    t("label", {
                      id: ie(D.namespace, O, "type")
                    }, "Type", 8, Ys)
                  ]),
                  $(a(xe), {
                    disabled: !c.value,
                    "aria-labelledby": ie(D.namespace, O, "type"),
                    "model-value": O.type,
                    options: C.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (te) => K(O, te)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                t("div", Zs, [
                  t("div", Qs, [
                    t("label", {
                      id: ie(D.namespace, O, "values")
                    }, "Values", 8, Xs)
                  ]),
                  $(a(xe), {
                    disabled: !c.value,
                    "aria-labelledby": ie(D.namespace, O, "values"),
                    "model-value": O.cardinality ?? "one",
                    options: v,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (te) => r(O, "cardinality", te === "one" ? void 0 : te)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                S(O) ? (e(), s("div", ei, [
                  t("div", ti, [
                    t("label", {
                      id: ie(D.namespace, O, "vocabulary")
                    }, "Vocabulary", 8, li)
                  ]),
                  $(a(xe), {
                    disabled: !c.value,
                    "aria-labelledby": ie(D.namespace, O, "vocabulary"),
                    "model-value": O.vocabulary ?? "",
                    "onUpdate:modelValue": (te) => r(O, "vocabulary", te),
                    options: [{ value: "", label: "Choose…" }, ...M.value.map((te) => ({ value: te, label: a(W)(te) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : u("", !0),
                A(O) ? (e(), s("p", ai, "Choose the media types and file size this field accepts. Catalog readers can access attached files.")) : p(O)?.form === "ref" && !S(O) ? (e(), s("p", si, h(j(O) ? "A link points to something managed by an installed plugin." : "A product reference points to another product in this catalog."), 1)) : u("", !0),
                j(O) ? (e(), s("div", ii, [
                  t("div", ni, [
                    t("label", {
                      id: ie(D.namespace, O, "link")
                    }, "Link destination", 8, oi),
                    T[8] || (T[8] = t("span", { class: "pim-f-note" }, "choose what the field can point to", -1))
                  ]),
                  $(a(xe), {
                    disabled: !c.value,
                    "aria-labelledby": ie(D.namespace, O, "link"),
                    "model-value": O.config?.target ?? "",
                    "onUpdate:modelValue": (te) => f(O, te),
                    options: [{ value: "", label: "Choose…" }, ...l.options.link_kinds.map((te) => ({ value: te.kind, label: a(ce)(te.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : u("", !0),
                t("div", di, [
                  t("div", ri, [
                    t("label", {
                      id: ie(D.namespace, O, "width")
                    }, "Width", 8, ui),
                    T[9] || (T[9] = t("span", { class: "pim-f-note" }, "of a form row", -1))
                  ]),
                  $(a(Tt), {
                    disabled: !c.value,
                    "aria-labelledby": ie(D.namespace, O, "width"),
                    "model-value": a(St)(l.schema, D.namespace, O),
                    options: a(d),
                    "allow-empty": !1,
                    "onUpdate:modelValue": (te) => O.width = te
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                t("div", ci, [
                  t("div", pi, [
                    t("label", {
                      id: ie(D.namespace, O, "scope")
                    }, "Varies per", 8, mi),
                    T[10] || (T[10] = t("span", { class: "pim-f-note" }, "dimensions the value depends on", -1))
                  ]),
                  $(Pe, {
                    disabled: !c.value,
                    labelledby: ie(D.namespace, O, "scope"),
                    "model-value": O.scope ?? [],
                    options: J.value,
                    "onUpdate:modelValue": (te) => _(O, te)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                A(O) ? u("", !0) : (e(), s("div", {
                  key: 4,
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": ie(D.namespace, O, "default")
                }, [
                  t("div", fi, [
                    t("label", {
                      id: ie(D.namespace, O, "default")
                    }, "Default", 8, gi),
                    T[11] || (T[11] = t("span", { class: "pim-f-note" }, "when no value is set", -1))
                  ]),
                  $(zs, {
                    disabled: !c.value,
                    attribute: O,
                    type: p(O),
                    onChange: (te) => r(O, "default", te)
                  }, null, 8, ["disabled", "attribute", "type", "onChange"])
                ], 8, vi)),
                p(O)?.config_schema ? (e(), s("div", {
                  key: 5,
                  class: "pim-f pim-w-full",
                  role: "group",
                  "aria-labelledby": ie(D.namespace, O, "config")
                }, [
                  t("div", yi, [
                    t("label", {
                      id: ie(D.namespace, O, "config")
                    }, "Type configuration", 8, hi)
                  ]),
                  $(qt, {
                    disabled: !c.value,
                    schema: p(O).config_schema,
                    "model-value": O.config ?? {},
                    "onUpdate:modelValue": (te) => P(O, te)
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue"])
                ], 8, bi)) : u("", !0)
              ]),
              $(Fe, {
                class: "pim-field-advanced pim-ia-disclosure",
                label: "Advanced"
              }, {
                default: V(() => [
                  t("div", ki, [
                    t("div", _i, [
                      t("div", wi, [
                        t("label", {
                          for: ie(D.namespace, O, "code")
                        }, "Integration key", 8, $i),
                        O.id !== void 0 ? (e(), s("span", Ci, "renaming keeps stored values")) : u("", !0)
                      ]),
                      $(a(lt), {
                        disabled: !c.value,
                        id: ie(D.namespace, O, "code"),
                        type: "text",
                        value: O.code,
                        onInput: (te) => O.code = te.target.value,
                        class: "mono"
                      }, null, 8, ["disabled", "id", "value", "onInput"])
                    ]),
                    t("div", xi, [
                      t("div", Vi, [
                        t("label", {
                          id: ie(D.namespace, O, "index")
                        }, "Search and filters", 8, ji),
                        T[12] || (T[12] = t("span", { class: "pim-f-note" }, "choose how this field can be matched", -1))
                      ]),
                      $(a(xe), {
                        disabled: !c.value,
                        "aria-labelledby": ie(D.namespace, O, "index"),
                        "model-value": O.index ?? "none",
                        options: (p(O)?.indexes ?? ["none"]).map((te) => ({ value: te, label: Q[te] || a(W)(te) })),
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self",
                        "onUpdate:modelValue": (te) => r(O, "index", te === "none" ? void 0 : te)
                      }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ]),
                    t("div", Oi, [
                      t("div", Si, [
                        t("label", {
                          for: ie(D.namespace, O, "unique")
                        }, "Unique", 8, Ui),
                        T[13] || (T[13] = t("span", { class: "pim-f-note" }, "one holder per value, catalog wide", -1))
                      ]),
                      t("div", Ai, [
                        $(a(dt), {
                          "input-id": ie(D.namespace, O, "unique"),
                          "model-value": O.unique === !0,
                          disabled: !c.value || !!O.scope?.length || (O.cardinality ?? "one") !== "one",
                          "onUpdate:modelValue": (te) => r(O, "unique", te)
                        }, null, 8, ["input-id", "model-value", "disabled", "onUpdate:modelValue"]),
                        t("span", null, h(O.unique ? "Yes" : "No"), 1)
                      ])
                    ]),
                    (O.scope?.length ?? 0) > 0 && O.index && O.index !== "none" ? (e(), s("div", Ri, [
                      t("div", Pi, [
                        t("label", {
                          id: ie(D.namespace, O, "contexts")
                        }, "Filterable combinations", 8, Ti),
                        T[14] || (T[14] = t("span", { class: "pim-f-note" }, "which combinations get an index", -1))
                      ]),
                      t("div", {
                        class: "pim-contexts",
                        role: "group",
                        "aria-labelledby": ie(D.namespace, O, "contexts")
                      }, [
                        (e(!0), s(Z, null, se(b(O), (te, ue) => (e(), s("div", {
                          key: ue,
                          class: "pim-context-row"
                        }, [
                          (e(!0), s(Z, null, se(O.scope, (we) => (e(), s("div", {
                            key: we,
                            class: "pim-context-field"
                          }, [
                            t("span", {
                              id: ie(D.namespace, O, "context-" + ue + "-" + we),
                              class: "small muted"
                            }, h(a(W)(we)), 9, qi),
                            $(a(xe), {
                              disabled: !c.value,
                              "aria-labelledby": ie(D.namespace, O, "context-" + ue + "-" + we),
                              "model-value": te[we] ?? "",
                              options: w(we),
                              class: "narrow",
                              appendTo: "self",
                              "onUpdate:modelValue": (Ye) => te[we] = Ye
                            }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                          ]))), 128)),
                          c.value ? (e(), R(a(Y), {
                            key: 0,
                            type: "button",
                            "aria-label": "Remove context",
                            onClick: (we) => b(O).splice(ue, 1),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: V(() => [
                              $(a(oe), { icon: "tabler:x" })
                            ]),
                            _: 1
                          }, 8, ["onClick"])) : u("", !0)
                        ]))), 128)),
                        c.value ? (e(), R(a(Y), {
                          key: 0,
                          type: "button",
                          onClick: (te) => q(O),
                          severity: "secondary",
                          outlined: "",
                          size: "small"
                        }, {
                          default: V(() => [
                            $(a(oe), {
                              icon: "tabler:plus",
                              "aria-hidden": "true"
                            }),
                            T[15] || (T[15] = X(" Add context", -1))
                          ]),
                          _: 1
                        }, 8, ["onClick"])) : u("", !0)
                      ], 8, Ii)
                    ])) : u("", !0)
                  ])
                ]),
                _: 2
              }, 1024),
              c.value ? (e(), s("div", Di, [
                $(a(Y), {
                  type: "button",
                  onClick: (te) => Ge(D, O),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: V(() => [
                    $(a(oe), { icon: "tabler:trash" }),
                    T[16] || (T[16] = X(" Remove field", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : u("", !0)
            ]),
            _: 2
          }, [
            c.value ? {
              name: "actions",
              fn: V(() => [
                ee > 0 ? (e(), R(a(Y), {
                  key: 0,
                  type: "button",
                  "aria-label": "Move " + a(W)(O.code) + " earlier",
                  onClick: (te) => fe(te, D.attributes, ee, ee - 1),
                  text: "",
                  size: "small",
                  severity: "secondary"
                }, {
                  default: V(() => [
                    $(a(oe), {
                      icon: "tabler:arrow-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])) : u("", !0),
                ee < (D.attributes?.length ?? 0) - 1 ? (e(), R(a(Y), {
                  key: 1,
                  type: "button",
                  class: "pim-move-later",
                  "aria-label": "Move " + a(W)(O.code) + " later",
                  onClick: (te) => fe(te, D.attributes, ee, ee + 1),
                  text: "",
                  size: "small",
                  severity: "secondary"
                }, {
                  default: V(() => [
                    $(a(oe), {
                      icon: "tabler:arrow-down",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])) : u("", !0)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "open", "onUpdate:open", "title", "kind"]))), 128))
        ]),
        _: 2
      }, 1032, ["count", "show-actions"]))), 128)),
      $(ft, {
        visible: !!L.value,
        label: le.value,
        onClose: T[6] || (T[6] = (D) => L.value = void 0)
      }, {
        default: V(() => [
          L.value ? (e(), s("section", {
            key: 0,
            class: "pim-ia-dialog",
            onKeydown: T[5] || (T[5] = ot(ze((D) => L.value = void 0, ["prevent"]), ["esc"]))
          }, [
            t("header", Ni, [
              t("h2", Fi, h(le.value), 1)
            ]),
            t("div", zi, [
              t("label", {
                id: a(ne) + "-writers"
              }, "Sources allowed to write", 8, Bi),
              $(a(rl), {
                disabled: !c.value,
                "aria-labelledby": a(ne) + "-writers",
                "model-value": L.value.write?.sources ?? [],
                options: y.value,
                "option-label": "label",
                "option-value": "value",
                placeholder: "Any source",
                "append-to": "self",
                "onUpdate:modelValue": T[2] || (T[2] = (D) => L.value.write = { sources: D })
              }, null, 8, ["disabled", "aria-labelledby", "model-value", "options"])
            ]),
            t("footer", Mi, [
              c.value ? (e(), R(a(Y), {
                key: 0,
                type: "button",
                label: "Remove field group",
                severity: "danger",
                text: "",
                onClick: T[3] || (T[3] = (D) => Me(L.value))
              })) : u("", !0),
              $(a(Y), {
                type: "button",
                label: "Done",
                severity: "secondary",
                outlined: "",
                onClick: T[4] || (T[4] = (D) => L.value = void 0)
              })
            ])
          ], 32)) : u("", !0)
        ]),
        _: 1
      }, 8, ["visible", "label"])
    ]));
  }
}), Ei = { class: "muted small" }, Wi = { class: "pim-aspect" }, Hi = {
  key: 0,
  class: "small muted"
}, Ji = { class: "pim-fields" }, Ki = { class: "pim-f pim-w-full" }, Gi = { class: "pim-f-label" }, Yi = ["id"], Zi = { class: "pim-f-label" }, Qi = ["id"], Xi = /* @__PURE__ */ pe({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(l, { emit: m }) {
    const i = l, n = m, o = z(() => i.schema.access.admin), d = z(() => i.draft.dimensions ?? []), v = Oe();
    function c(y, C) {
      return v + "-" + y.name + "-" + C;
    }
    function k(y) {
      (i.draft.dimensions ??= []).push({ name: y, members: [] });
    }
    function B(y) {
      const C = [];
      for (const p of i.draft.aspects ?? []) for (const S of p.attributes ?? []) S.scope?.includes(y.name) && C.push(`${W(S.code)} (${W(p.namespace)})`);
      for (const p of i.draft.families ?? []) for (const S of p.requirements ?? []) S.context && y.name in S.context && C.push(`${W(S.id)} (${W(p.code)})`);
      return C;
    }
    function E(y) {
      B(y).length || (d.value.splice(d.value.indexOf(y), 1), i.schema.declaration.dimensions?.some((C) => C.name === y.name) && n("remove", "dimensions", y.name));
    }
    function G(y, C) {
      if (y.members = C, y.fallback)
        for (const p of Object.keys(y.fallback)) C.includes(p) || delete y.fallback[p];
    }
    function J(y, C) {
      return y.fallback?.[C] ?? [];
    }
    function M(y, C, p) {
      const S = { ...y.fallback ?? {} };
      p.length ? S[C] = p : delete S[C], Object.keys(S).length ? y.fallback = S : delete y.fallback;
    }
    return (y, C) => (e(), R(at, {
      count: d.value.length,
      columns: ["details", "usage"]
    }, $e({
      default: V(() => [
        (e(!0), s(Z, null, se(d.value, (p) => (e(), R(st, {
          "route-section": "dimensions",
          "route-id": p.name,
          title: a(W)(p.name),
          key: p.name,
          usage: B(p).length ? "Used in " + B(p).length + " places" : "Unused"
        }, $e({
          details: V(() => [
            t("span", Ei, h(p.members.map(a(W)).join(", ") || "No allowed values"), 1)
          ]),
          default: V(() => [
            t("div", Wi, [
              B(p).length ? (e(), s("p", Hi, "Used by " + h(B(p).join(", ")), 1)) : u("", !0),
              t("div", Ji, [
                t("div", Ki, [
                  t("div", Gi, [
                    t("label", {
                      id: c(p, "members")
                    }, "Allowed values", 8, Yi),
                    C[0] || (C[0] = t("span", { class: "pim-f-note" }, "for example, English and French for Language", -1))
                  ]),
                  $(Pe, {
                    disabled: !o.value,
                    labelledby: c(p, "members"),
                    "model-value": p.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (S) => G(p, S)
                  }, null, 8, ["disabled", "labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                (e(!0), s(Z, null, se(p.members, (S) => (e(), s("div", {
                  key: S,
                  class: "pim-f pim-w-half"
                }, [
                  t("div", Zi, [
                    t("label", {
                      id: c(p, "fallback-" + encodeURIComponent(S))
                    }, h(S) + " falls back to", 9, Qi),
                    C[1] || (C[1] = t("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  $(Pe, {
                    disabled: !o.value,
                    labelledby: c(p, "fallback-" + encodeURIComponent(S)),
                    "model-value": J(p, S),
                    options: p.members.filter((A) => A !== S).map((A) => ({ value: A })),
                    "onUpdate:modelValue": (A) => M(p, S, A)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]))), 128))
              ])
            ])
          ]),
          _: 2
        }, [
          o.value ? {
            name: "actions",
            fn: V(() => [
              $(a(Y), {
                type: "button",
                disabled: B(p).length > 0,
                "aria-label": "Remove " + a(W)(p.name),
                title: B(p).length ? "Take the dimension off these first" : "",
                onClick: (S) => E(p),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: V(() => [
                  $(a(oe), { icon: "tabler:trash" })
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
        fn: V(() => [
          $(Be, {
            label: "Dimension name",
            "from-name": "",
            action: "Add dimension",
            existing: d.value.map((p) => p.name),
            onAdd: k
          }, {
            default: V(() => [...C[2] || (C[2] = [
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
}, kn = /* @__PURE__ */ pe({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(l, { emit: m }) {
    const i = l, n = m, o = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/, d = z(() => i.schema.access.admin), v = z(() => d.value && i.schema.access.write), c = z(() => i.draft.vocabularies ?? []);
    function k(K) {
      (i.draft.vocabularies ??= []).push({ code: K });
    }
    function B(K) {
      c.value.splice(c.value.indexOf(K), 1), i.schema.declaration.vocabularies?.some((P) => P.code === K.code) && n("remove", "vocabularies", K.code);
    }
    function E(K) {
      return !!i.schema.vocabularies[K];
    }
    const G = H({}), J = H({}), M = H({}), y = H({}), C = H({}), p = H({}), S = H({}), A = H({});
    function j(K) {
      return !!(C.value[K] || p.value[K]);
    }
    async function F(K, P) {
      C.value[K] = !0, delete S.value[K];
      try {
        const f = await ye.termsPage(i.catalogId, K, P);
        J.value[K] = f.terms, y.value[K] = P, M.value[K] = f.next;
        const _ = I(K);
        f.terms.some((r) => r.retired && r.code === _.parent) && (_.parent = "");
      } catch (f) {
        S.value[K] = { errors: [He(f, "Could not load terms.")], read: { after: P } };
      } finally {
        C.value[K] = !1;
      }
    }
    function Q(K) {
      G.value[K] = !G.value[K], G.value[K] && !j(K) && !J.value[K] && !S.value[K] && F(K);
    }
    function I(K) {
      return A.value[K] ?? (A.value[K] = { code: "", label: "", parent: "" });
    }
    function ne(K, P) {
      const f = J.value[K]?.find((_) => _.code === P);
      return f ? Ee(f) : W(P);
    }
    function Ce(K) {
      return [{ value: "", label: "No parent" }, ...(J.value[K] ?? []).filter((P) => !P.retired).map((P) => ({ value: P.code, label: Ee(P) }))];
    }
    function ve(K, P, f) {
      S.value[K] = { errors: P?.findings?.length ? P.findings.map((_) => ({ message: _.message ?? f, code: _.code })) : [{ message: f }] };
    }
    async function ke(K) {
      const P = I(K.code);
      if (!(!v.value || !o.test(P.code))) {
        p.value[K.code] = !0, delete S.value[K.code];
        try {
          const f = { term: { vocabulary: K.code, code: P.code }, labels: { en: P.label || W(P.code) } };
          K.hierarchical && P.parent && (f.parent = P.parent);
          const r = (await ye.apply(i.catalogId, [f])).outcomes[0];
          if (r?.outcome !== "created" && r?.outcome !== "updated") {
            ve(K.code, r, "The term was not accepted.");
            return;
          }
          A.value[K.code] = { code: "", label: "", parent: "" }, ye.invalidateTerms(i.catalogId), await F(K.code, y.value[K.code]);
        } catch (f) {
          S.value[K.code] = { errors: [He(f, "Could not add the term.")] };
        } finally {
          p.value[K.code] = !1;
        }
      }
    }
    async function ie(K, P, f) {
      if (v.value && !(f && !await tt.confirm({ header: "Retire term?", message: `Retire ${Ee(P)}? Term changes save immediately. You can restore this term later.`, acceptLabel: "Retire", rejectLabel: "Cancel" }))) {
        p.value[K.code] = !0, delete S.value[K.code];
        try {
          const r = (await ye.apply(i.catalogId, [{ term: { vocabulary: K.code, code: P.code }, retired: f }])).outcomes[0];
          if (!r || !["updated", "unchanged"].includes(r.outcome)) {
            ve(K.code, r, "The term change was not accepted.");
            return;
          }
          f && I(K.code).parent === P.code && (I(K.code).parent = ""), ye.invalidateTerms(i.catalogId), await F(K.code, y.value[K.code]);
        } catch (_) {
          S.value[K.code] = { errors: [He(_, "Could not change the term.")] };
        } finally {
          p.value[K.code] = !1;
        }
      }
    }
    return (K, P) => (e(), R(at, {
      count: c.value.length,
      columns: ["details"]
    }, $e({
      default: V(() => [
        (e(!0), s(Z, null, se(c.value, (f) => (e(), R(st, {
          "route-section": "vocabularies",
          "route-id": f.code,
          title: a(W)(f.code),
          key: f.code
        }, {
          details: V(() => [
            t("span", en, h(f.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: V(() => [
            d.value ? (e(), R(a(Y), {
              key: 0,
              type: "button",
              "aria-label": "Remove " + a(W)(f.code),
              onClick: (_) => B(f),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: V(() => [
                $(a(oe), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])) : u("", !0)
          ]),
          default: V(() => [
            t("div", tn, [
              t("label", ln, [
                $(a(dt), {
                  disabled: !d.value,
                  "aria-label": "Hierarchical " + a(W)(f.code),
                  "model-value": f.hierarchical === !0,
                  "onUpdate:modelValue": (_) => _ ? f.hierarchical = !0 : delete f.hierarchical
                }, null, 8, ["disabled", "aria-label", "model-value", "onUpdate:modelValue"]),
                P[0] || (P[0] = t("span", null, "Hierarchical", -1))
              ]),
              E(f.code) ? (e(), R(a(Y), {
                key: 0,
                type: "button",
                onClick: (_) => Q(f.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: V(() => [
                  $(a(oe), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  X(" " + h(G.value[f.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : d.value ? (e(), s("span", an, "Apply the schema before adding terms.")) : u("", !0),
              G.value[f.code] ? (e(), s("div", sn, [
                v.value ? (e(), s("p", nn, "Term changes save immediately.")) : u("", !0),
                C.value[f.code] ? (e(), s("div", on, "Loading terms…")) : S.value[f.code] ? (e(!0), s(Z, { key: 2 }, se(S.value[f.code].errors, (_, r) => (e(), R(ht, {
                  key: r,
                  error: _
                }, {
                  default: V(() => [
                    S.value[f.code].read ? (e(), R(a(Y), {
                      key: 0,
                      type: "button",
                      onClick: (b) => F(f.code, S.value[f.code].read?.after),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: V(() => [...P[1] || (P[1] = [
                        X("Retry", -1)
                      ])]),
                      _: 1
                    }, 8, ["onClick"])) : u("", !0)
                  ]),
                  _: 2
                }, 1032, ["error"]))), 128)) : u("", !0),
                (J.value[f.code] ?? []).length ? (e(), s("div", dn, [
                  t("table", rn, [
                    t("thead", null, [
                      t("tr", null, [
                        P[2] || (P[2] = t("th", null, "Term", -1)),
                        f.hierarchical ? (e(), s("th", un, "Parent")) : u("", !0),
                        d.value ? (e(), s("th", cn)) : u("", !0)
                      ])
                    ]),
                    t("tbody", null, [
                      (e(!0), s(Z, null, se(J.value[f.code], (_) => (e(), s("tr", {
                        key: _.code,
                        class: je({ muted: _.retired })
                      }, [
                        t("td", null, [
                          X(h(a(Ee)(_)) + " ", 1),
                          _.retired ? (e(), R(a(_e), {
                            key: 0,
                            severity: "secondary",
                            value: "Retired"
                          })) : u("", !0)
                        ]),
                        f.hierarchical ? (e(), s("td", pn, h(_.parent ? ne(f.code, _.parent) : "—"), 1)) : u("", !0),
                        d.value ? (e(), s("td", mn, [
                          $(a(Y), {
                            type: "button",
                            disabled: !v.value || j(f.code),
                            onClick: (r) => ie(f, _, !_.retired),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: V(() => [
                              X(h(_.retired ? "Restore" : "Retire"), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled", "onClick"])
                        ])) : u("", !0)
                      ], 2))), 128))
                    ])
                  ]),
                  t("ul", vn, [
                    (e(!0), s(Z, null, se(J.value[f.code], (_) => (e(), s("li", {
                      key: _.code,
                      class: je(["pim-stacked-row", { muted: _.retired }])
                    }, [
                      t("div", null, [
                        X(h(a(Ee)(_)) + " ", 1),
                        _.retired ? (e(), R(a(_e), {
                          key: 0,
                          severity: "secondary",
                          value: "Retired"
                        })) : u("", !0)
                      ]),
                      f.hierarchical && _.parent ? (e(), s("div", fn, "Parent: " + h(ne(f.code, _.parent)), 1)) : u("", !0),
                      d.value ? (e(), R(a(Y), {
                        key: 1,
                        type: "button",
                        disabled: !v.value || j(f.code),
                        onClick: (r) => ie(f, _, !_.retired),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: V(() => [
                          X(h(_.retired ? "Restore" : "Retire"), 1)
                        ]),
                        _: 2
                      }, 1032, ["disabled", "onClick"])) : u("", !0)
                    ], 2))), 128))
                  ])
                ])) : J.value[f.code] && !j(f.code) && !S.value[f.code] ? (e(), s("p", gn, "No terms yet.")) : u("", !0),
                t("div", bn, [
                  $(a(Y), {
                    type: "button",
                    disabled: j(f.code) || !y.value[f.code],
                    onClick: (_) => F(f.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: V(() => [
                      $(a(oe), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      P[3] || (P[3] = X(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  $(a(Y), {
                    type: "button",
                    disabled: j(f.code) || !M.value[f.code],
                    onClick: (_) => F(f.code, M.value[f.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: V(() => [
                      $(a(oe), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      P[4] || (P[4] = X(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                d.value ? (e(), s("div", yn, [
                  $(a(lt), {
                    modelValue: I(f.code).label,
                    "onUpdate:modelValue": (_) => I(f.code).label = _,
                    disabled: !v.value || j(f.code),
                    "aria-label": "Term name in English",
                    type: "text",
                    placeholder: "Term name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  $(a(lt), {
                    modelValue: I(f.code).code,
                    "onUpdate:modelValue": (_) => I(f.code).code = _,
                    disabled: !v.value || j(f.code),
                    type: "text",
                    "aria-label": "Short term name",
                    placeholder: "Short name for imports",
                    class: "narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  f.hierarchical ? (e(), R(a(xe), {
                    key: 0,
                    modelValue: I(f.code).parent,
                    "onUpdate:modelValue": (_) => I(f.code).parent = _,
                    disabled: !v.value || j(f.code),
                    class: "narrow",
                    "aria-label": "Parent term",
                    placeholder: "No parent",
                    options: Ce(f.code),
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "options"])) : u("", !0),
                  $(a(Y), {
                    type: "button",
                    disabled: !v.value || j(f.code) || !o.test(I(f.code).code),
                    onClick: (_) => ke(f),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: V(() => [
                      $(a(oe), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      P[5] || (P[5] = X(" Add term", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])) : u("", !0),
                $(Fe, {
                  class: "pim-ia-disclosure",
                  label: "Integration keys"
                }, {
                  default: V(() => [
                    (J.value[f.code] ?? []).length ? (e(), s("dl", hn, [
                      (e(!0), s(Z, null, se(J.value[f.code], (_) => (e(), s(Z, {
                        key: _.code
                      }, [
                        t("dt", null, h(a(Ee)(_)), 1),
                        t("dd", null, [
                          t("code", null, h(_.code), 1)
                        ])
                      ], 64))), 128))
                    ])) : u("", !0)
                  ]),
                  _: 2
                }, 1024)
              ])) : u("", !0)
            ])
          ]),
          _: 2
        }, 1032, ["route-id", "title"]))), 128))
      ]),
      _: 2
    }, [
      d.value ? {
        name: "add",
        fn: V(() => [
          $(Be, {
            label: "Vocabulary name",
            "from-name": "",
            action: "Add vocabulary",
            existing: c.value.map((f) => f.code),
            onAdd: k
          }, {
            default: V(() => [...P[6] || (P[6] = [
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
}, eo = /* @__PURE__ */ pe({
  __name: "BuilderFamilies",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove", "fields", "variant-field"],
  setup(l, { emit: m }) {
    const i = l, n = m, o = Oe();
    function d(P, f) {
      return o + "-" + P.code + "-" + f;
    }
    const v = z(() => i.schema.access.admin), c = z(() => (i.draft.families ?? []).filter((P) => P.code !== "generic")), k = z(() => {
      const P = new Set(i.draft.plugins?.map((f) => f.use));
      return Object.entries(i.schema.attributes).filter(([, f]) => f.plugin && P.has(f.plugin));
    }), B = z(() => {
      const P = (i.draft.aspects ?? []).map((_) => _.namespace), f = [...new Set(k.value.map(([_]) => _.split(".")[0]))];
      return [...P, ...f.filter((_) => !P.includes(_))].map((_) => ({ value: _, label: W(_) }));
    });
    function E(P) {
      const f = B.value, _ = (P.aspects ?? []).filter((r) => !f.some((b) => b.value === r));
      return [...f, ..._.map((r) => ({ value: r, label: W(r) }))];
    }
    const G = z(() => new Map(i.options.types.map((P) => [P.id, P.form])));
    function J(P, f = []) {
      const _ = /* @__PURE__ */ new Map();
      return [.../* @__PURE__ */ new Set([...P, ...f])].map((b) => {
        const [w, q] = b.split(".", 2), L = W(q ?? w);
        return _.set(L, (_.get(L) ?? 0) + 1), { value: b, label: L, group: q ? W(w) : void 0 };
      }).map(({ value: b, label: w, group: q }) => ({
        value: b,
        label: w,
        detail: _.get(w) > 1 ? q : void 0
      }));
    }
    const M = z(() => {
      const P = /* @__PURE__ */ new Map();
      function f(_, r, b = [], w = "one") {
        const q = !!r && r !== "text" && r !== "record" && b.length === 0 && w === "one";
        P.set(_, q);
      }
      for (const _ of i.draft.aspects ?? [])
        for (const r of _.attributes ?? []) {
          const b = _.namespace + "." + r.code;
          f(b, G.value.get(r.type), r.scope, r.cardinality);
        }
      for (const [_, r] of k.value) f(_, r.form, r.scope, r.cardinality);
      return P;
    });
    function y(P) {
      return [...M.value.keys()].filter((f) => P.aspects?.includes(f.split(".")[0]));
    }
    function C(P, f, _) {
      const r = f[_] ?? [], b = new Set(I(P).flatMap((q) => [...q.axes ?? [], ...q.own ?? []])), w = y(P).filter((q) => r.includes(q) || !b.has(q) && (_ === "own" || M.value.get(q)));
      return J(w, r);
    }
    const p = z(() => i.draft.channels ?? []);
    function S(P, f) {
      return p.value.filter((_) => (!_.families?.length || _.families.includes(P.code)) && (!f || _.requirements?.includes(f))).map((_) => W(_.id));
    }
    const A = z(() => i.draft.dimensions ?? []), j = H({});
    function F(P) {
      (i.draft.families ??= []).push({ code: P, aspects: [] }), j.value[P] = !0;
    }
    function Q(P) {
      i.draft.families.splice(i.draft.families.indexOf(P), 1), i.schema.declaration.families?.some((f) => f.code === P.code) && n("remove", "families", P.code);
    }
    function I(P) {
      return P.variation ?? [];
    }
    function ne(P) {
      return I(P).map((f) => ({
        level: f,
        axes: C(P, f, "axes"),
        own: C(P, f, "own")
      }));
    }
    function Ce(P) {
      (P.variation ??= []).push({ axes: [] });
    }
    function ve(P) {
      return P.requirements ?? [];
    }
    function ke(P, f) {
      (P.requirements ??= []).push({ id: f, require: [] });
    }
    function ie(P, f) {
      return P.context?.[f] ?? "";
    }
    function K(P, f, _) {
      const r = { ...P.context ?? {} };
      _ ? r[f] = _ : delete r[f], Object.keys(r).length ? P.context = r : delete P.context;
    }
    return (P, f) => (e(), s("div", _n, [
      $(at, {
        count: c.value.length,
        columns: ["details"]
      }, $e({
        default: V(() => [
          (e(!0), s(Z, null, se(c.value, (_) => (e(), R(st, {
            "route-section": "families",
            "route-id": _.code,
            key: _.code,
            open: j.value[_.code],
            "onUpdate:open": (r) => j.value[_.code] = r,
            title: a(W)(_.code)
          }, {
            details: V(() => [
              t("span", wn, h(y(_).length) + " fields", 1),
              I(_).length ? (e(), R(a(_e), {
                key: 0,
                severity: "secondary",
                value: I(_).length + (I(_).length === 1 ? " variant level" : " variant levels")
              }, null, 8, ["value"])) : u("", !0),
              t("span", $n, h(S(_).join(", ") || "No release channels"), 1)
            ]),
            default: V(() => [
              t("div", Cn, [
                t("div", xn, [
                  t("div", Vn, [
                    t("div", jn, [
                      t("label", {
                        id: d(_, "groups")
                      }, "Field groups", 8, On)
                    ]),
                    t("p", {
                      id: d(_, "groups-help"),
                      class: "muted small pim-axis-help"
                    }, "Choose the groups that appear on this family’s product forms.", 8, Sn),
                    $(a(rl), {
                      disabled: !v.value,
                      "aria-labelledby": d(_, "groups"),
                      "aria-describedby": d(_, "groups-help"),
                      "model-value": _.aspects ?? [],
                      options: E(_),
                      "option-label": "label",
                      "option-value": "value",
                      placeholder: "Choose field groups",
                      display: "chip",
                      "append-to": "self",
                      "onUpdate:modelValue": (r) => a(We)(_, "aspects", r)
                    }, null, 8, ["disabled", "aria-labelledby", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])
                  ]),
                  _.aspects?.length ? (e(), R(a(Y), {
                    key: 0,
                    type: "button",
                    label: "View family fields",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (r) => n("fields", _.code)
                  }, null, 8, ["onClick"])) : u("", !0)
                ])
              ]),
              t("div", Un, [
                f[4] || (f[4] = t("header", { class: "pim-aspect-head" }, [
                  t("h3", null, "Variants")
                ], -1)),
                f[5] || (f[5] = t("p", { class: "muted small pim-axis-help" }, "Choose what makes one variant different from another. Each field can be used once.", -1)),
                t("div", An, [
                  (e(!0), s(Z, null, se(ne(_), ({ level: r, axes: b, own: w }, q) => (e(), s("div", {
                    key: q,
                    class: "pim-level"
                  }, [
                    t("div", Rn, [
                      t("strong", null, "Level " + h(q + 1), 1),
                      v.value ? (e(), R(a(Y), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove level",
                        onClick: (L) => I(_).splice(q, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: V(() => [
                          $(a(oe), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : u("", !0)
                    ]),
                    t("div", Pn, [
                      t("div", Tn, [
                        t("div", In, [
                          t("label", {
                            id: d(_, q + "-axes")
                          }, "Distinguish variants by", 8, qn)
                        ]),
                        f[1] || (f[1] = t("p", { class: "muted small pim-axis-help" }, "Use a field with a single value and no dimensions, such as Integer. Text and record fields are excluded.", -1)),
                        v.value && !b.length ? (e(), s(Z, { key: 0 }, [
                          f[0] || (f[0] = t("p", { class: "muted small pim-axis-help" }, "No eligible field is available in this family. Choose its field group above, or create the field first and choose its group when you return.", -1)),
                          $(a(Y), {
                            type: "button",
                            label: "Create a field in Fields",
                            severity: "secondary",
                            outlined: "",
                            size: "small",
                            class: "pim-form-action",
                            onClick: (L) => n("variant-field", _.code)
                          }, null, 8, ["onClick"])
                        ], 64)) : (e(), R(Pe, {
                          key: 1,
                          disabled: !v.value,
                          dropdown: "",
                          labelledby: d(_, q + "-axes"),
                          "model-value": r.axes ?? [],
                          options: b,
                          placeholder: "Choose a field",
                          "onUpdate:modelValue": (L) => r.axes = L
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"]))
                      ]),
                      t("div", Dn, [
                        t("div", Nn, [
                          t("label", {
                            id: d(_, q + "-owned")
                          }, "Other fields edited here", 8, Fn)
                        ]),
                        f[2] || (f[2] = t("p", { class: "muted small pim-axis-help" }, "Other fields you edit at this level.", -1)),
                        $(Pe, {
                          disabled: !v.value,
                          dropdown: "",
                          labelledby: d(_, q + "-owned"),
                          "model-value": r.own ?? [],
                          options: w,
                          placeholder: "Add a field",
                          "onUpdate:modelValue": (L) => L.length ? r.own = L : delete r.own
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  v.value ? (e(), R(a(Y), {
                    key: 0,
                    type: "button",
                    class: "pim-add-level",
                    onClick: (r) => Ce(_),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: V(() => [
                      $(a(oe), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      f[3] || (f[3] = X(" Add level", -1))
                    ]),
                    _: 1
                  }, 8, ["onClick"])) : u("", !0)
                ])
              ]),
              t("div", zn, [
                f[8] || (f[8] = t("header", { class: "pim-family-requirements-head" }, [
                  t("h3", null, "Release requirements"),
                  t("p", { class: "muted small" }, "Choose what products need before they can be released to a channel.")
                ], -1)),
                t("div", Bn, [
                  (e(!0), s(Z, null, se(ve(_), (r, b) => (e(), s("div", {
                    key: r.id,
                    class: "pim-level"
                  }, [
                    t("div", Mn, [
                      t("div", null, [
                        t("strong", null, h(a(W)(r.id)), 1),
                        t("p", Ln, h(S(_, r.id).join(", ") || "Unused by channels"), 1)
                      ]),
                      v.value ? (e(), R(a(Y), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove requirement",
                        onClick: (w) => ve(_).splice(b, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: V(() => [
                          $(a(oe), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : u("", !0)
                    ]),
                    t("div", En, [
                      (e(!0), s(Z, null, se(A.value, (w) => (e(), s("div", {
                        key: w.name,
                        class: "pim-f pim-w-third"
                      }, [
                        t("div", Wn, [
                          t("label", {
                            id: d(_, r.id + "-context-" + w.name)
                          }, h(a(W)(w.name)), 9, Hn)
                        ]),
                        $(a(xe), {
                          disabled: !v.value,
                          "aria-labelledby": d(_, r.id + "-context-" + w.name),
                          "model-value": ie(r, w.name),
                          "onUpdate:modelValue": (q) => K(r, w.name, q),
                          options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ...w.members.map((q) => ({ value: q, label: String(q) }))],
                          "option-label": "label",
                          "option-value": "value",
                          appendTo: "self"
                        }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                      ]))), 128)),
                      t("div", Jn, [
                        t("div", Kn, [
                          t("label", {
                            id: d(_, r.id + "-required")
                          }, "Required", 8, Gn)
                        ]),
                        f[6] || (f[6] = t("p", { class: "muted small pim-axis-help" }, "These fields must have a value.", -1)),
                        $(Pe, {
                          disabled: !v.value,
                          dropdown: "",
                          labelledby: d(_, r.id + "-required"),
                          "model-value": r.require ?? [],
                          placeholder: "Add a required field",
                          options: J(y(_), r.require),
                          "onUpdate:modelValue": (w) => a(We)(r, "require", w)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]),
                      t("div", Yn, [
                        t("div", Zn, [
                          t("label", {
                            id: d(_, r.id + "-authored")
                          }, "Entered for this context", 8, Qn)
                        ]),
                        f[7] || (f[7] = t("p", { class: "muted small pim-axis-help" }, "These fields need a value set directly for the selected context.", -1)),
                        $(Pe, {
                          disabled: !v.value,
                          dropdown: "",
                          labelledby: d(_, r.id + "-authored"),
                          "model-value": r.authored ?? [],
                          placeholder: "Add a field to author",
                          options: J(y(_), r.authored),
                          "onUpdate:modelValue": (w) => a(We)(r, "authored", w)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  v.value ? (e(), R(Be, {
                    key: 0,
                    label: "Requirement name",
                    action: "Add requirement",
                    "from-name": "",
                    existing: ve(_).map((r) => r.id),
                    onAdd: (r) => ke(_, r)
                  }, null, 8, ["existing", "onAdd"])) : u("", !0)
                ])
              ]),
              v.value ? (e(), s("div", Xn, [
                $(a(Y), {
                  type: "button",
                  label: "Remove family",
                  severity: "danger",
                  text: "",
                  size: "small",
                  onClick: (r) => Q(_)
                }, null, 8, ["onClick"])
              ])) : u("", !0)
            ]),
            _: 2
          }, 1032, ["route-id", "open", "onUpdate:open", "title"]))), 128))
        ]),
        _: 2
      }, [
        v.value ? {
          name: "head",
          fn: V(() => [
            $(Be, {
              label: "Family name",
              action: "Add family",
              "from-name": "",
              existing: c.value.map((_) => _.code),
              onAdd: F
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
}, so = { class: "pim-f" }, io = ["for"], no = ["id"], oo = /* @__PURE__ */ pe({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(l, { emit: m }) {
    const i = l, n = m, o = H(!1), d = H(""), v = Oe(), c = Oe(), k = H({});
    let B = 0;
    ge(() => i.modelValue, async (y) => {
      const C = ++B;
      try {
        const p = await cl(i.catalogId ?? "", y);
        C === B && (k.value = p);
      } catch {
        C === B && (k.value = {});
      }
    }, { immediate: !0, deep: !0 }), Ke(() => {
      B++;
    });
    function E(y) {
      return k.value[y] ?? ce(y, "Person");
    }
    ol(async () => {
      try {
        await Ql("wc-principal-picker"), o.value = !0;
      } catch {
        o.value = !1;
      }
    });
    function G(y) {
      i.disabled || !y.trim() || i.modelValue.includes(y.trim()) || (n("update:modelValue", [...i.modelValue, y.trim()]), d.value = "");
    }
    function J(y) {
      const C = y.detail;
      if (!C || typeof C != "object") return;
      const p = C, S = p.principal_id ?? p.id;
      typeof S == "string" && G(S);
    }
    function M(y) {
      i.disabled || n("update:modelValue", i.modelValue.filter((C) => C !== y));
    }
    return (y, C) => (e(), s("div", {
      class: "pim-principal-list",
      inert: l.disabled || void 0
    }, [
      l.modelValue.length ? (e(), s("div", lo, [
        (e(!0), s(Z, null, se(l.modelValue, (p) => (e(), R(a(_e), {
          key: p,
          severity: "secondary"
        }, {
          default: V(() => [
            t("span", null, h(E(p)), 1),
            $(a(Y), {
              text: "",
              size: "small",
              disabled: l.disabled,
              "aria-label": "Remove " + E(p),
              onClick: (S) => M(p)
            }, {
              default: V(() => [
                $(a(oe), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : u("", !0),
      o.value ? (e(), s("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: ze(J, ["stop"])
      }, null, 32)) : (e(), s("span", ao, "The person picker is unavailable.")),
      t("div", so, [
        t("label", {
          for: a(v),
          class: "small muted"
        }, "Service account ID", 8, io),
        $(a(lt), {
          modelValue: d.value,
          "onUpdate:modelValue": C[0] || (C[0] = (p) => d.value = p),
          id: a(v),
          "aria-describedby": a(c),
          disabled: l.disabled,
          onKeydown: C[1] || (C[1] = ot(ze((p) => G(d.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "id", "aria-describedby", "disabled"]),
        t("p", {
          id: a(c),
          class: "small muted pim-axis-help"
        }, "Ask whoever manages the service account for its principal ID.", 8, no)
      ]),
      $(a(Y), {
        type: "button",
        severity: "secondary",
        outlined: "",
        size: "small",
        class: "pim-form-action",
        disabled: l.disabled || !d.value.trim(),
        onClick: C[2] || (C[2] = (p) => G(d.value))
      }, {
        default: V(() => [
          $(a(oe), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          C[3] || (C[3] = X(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, to));
  }
}), ro = { class: "pim-stack" }, uo = { class: "muted small" }, co = { class: "muted small" }, po = { class: "pim-fields" }, mo = { class: "pim-f pim-w-half" }, vo = { class: "pim-f-label" }, fo = ["id"], go = { class: "muted small pim-axis-help" }, bo = { class: "pim-f pim-w-half" }, yo = { class: "pim-f-label" }, ho = ["id"], ko = { class: "muted small" }, _o = { class: "muted small" }, wo = { class: "pim-fields" }, $o = ["aria-labelledby", "aria-describedby"], Co = { class: "pim-f-label" }, xo = ["id"], Vo = ["id"], jo = { key: 1 }, Oo = { class: "pim-f pim-w-half" }, So = { class: "pim-f-label" }, Uo = ["id"], Ao = { class: "pim-f pim-w-full" }, Ro = { class: "mono" }, Po = { class: "pim-f pim-w-half" }, To = { class: "pim-f-label" }, Io = ["id"], qo = { class: "pim-f pim-w-half" }, Do = { class: "pim-f-label" }, No = ["for"], Fo = { class: "row" }, zo = /* @__PURE__ */ pe({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {},
    view: {}
  },
  emits: ["remove", "requirements"],
  setup(l, { emit: m }) {
    const i = l, n = m, o = Oe();
    function d(F, Q) {
      return o + "-" + F + "-" + Q;
    }
    const v = z(() => i.schema.access.admin), c = z(() => i.draft.channels ?? []), k = z(() => i.draft.sources ?? []), B = z(() => {
      const F = /* @__PURE__ */ new Map();
      for (const Q of i.draft.families ?? [])
        for (const { id: I } of Q.requirements ?? []) {
          const ne = F.get(I) ?? [];
          ne.push(W(Q.code)), F.set(I, ne);
        }
      return new Map([...F].map(([Q, I]) => [Q, W(Q) + " · " + I.join(", ")]));
    }), E = z(() => [...B.value].map(([F, Q]) => ({ value: F, label: Q }))), G = z(() => (i.draft.families ?? []).filter((F) => F.code !== "generic").map((F) => ({ value: F.code, label: W(F.code) }))), J = z(() => (i.draft.aspects ?? []).map((F) => ({ value: F.namespace, label: W(F.namespace) }))), M = H({}), y = H({});
    function C(F) {
      const Q = F.principals?.length ?? 0;
      return Q ? Q + (Q === 1 ? " allowed account" : " allowed accounts") : "Any catalog writer";
    }
    function p(F) {
      (i.draft.channels ??= []).push({ id: F, requirements: [] }), M.value[F] = !0;
    }
    function S(F) {
      c.value.splice(c.value.indexOf(F), 1), i.schema.declaration.channels?.some((Q) => Q.id === F.id) && n("remove", "channels", F.id);
    }
    function A(F) {
      (i.draft.sources ??= []).push({ id: F, ordering: "none", writes: [] }), y.value[F] = !0;
    }
    function j(F) {
      k.value.splice(k.value.indexOf(F), 1), i.schema.declaration.sources?.some((Q) => Q.id === F.id) && n("remove", "sources", F.id);
    }
    return (F, Q) => (e(), s("div", ro, [
      l.view !== "sources" ? (e(), R(at, {
        key: 0,
        count: c.value.length,
        columns: ["details"]
      }, $e({
        default: V(() => [
          (e(!0), s(Z, null, se(c.value, (I) => (e(), R(st, {
            key: I.id,
            open: M.value[I.id],
            "onUpdate:open": (ne) => M.value[I.id] = ne,
            "route-section": "channels",
            "route-id": I.id,
            title: a(W)(I.id)
          }, $e({
            details: V(() => [
              t("span", uo, h(I.families?.length ? I.families.map(a(W)).join(", ") : "All families"), 1),
              t("span", co, h(I.requirements?.length ? I.requirements.map((ne) => B.value.get(ne) ?? a(W)(ne)).join(", ") : "No release requirements"), 1)
            ]),
            default: V(() => [
              t("div", po, [
                t("div", mo, [
                  t("div", vo, [
                    t("label", {
                      id: d(I.id, "requirements")
                    }, "Release requirements", 8, fo)
                  ]),
                  t("p", go, h(E.value.length ? "Choose what products must meet before release to this channel." : "No family has defined a release requirement yet."), 1),
                  E.value.length || I.requirements?.length ? (e(), R(Pe, {
                    key: 0,
                    disabled: !v.value,
                    labelledby: d(I.id, "requirements"),
                    "model-value": I.requirements ?? [],
                    options: E.value,
                    "onUpdate:modelValue": (ne) => a(We)(I, "requirements", ne)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])) : u("", !0),
                  v.value ? (e(), R(a(Y), {
                    key: 1,
                    type: "button",
                    label: "Create a requirement in Families",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    class: "pim-form-action",
                    onClick: (ne) => n("requirements", I.id)
                  }, null, 8, ["onClick"])) : u("", !0)
                ]),
                t("div", bo, [
                  t("div", yo, [
                    t("label", {
                      id: d(I.id, "families")
                    }, "Families", 8, ho)
                  ]),
                  Q[0] || (Q[0] = t("p", { class: "muted small pim-axis-help" }, "Applies to every family unless you choose specific families.", -1)),
                  $(Pe, {
                    disabled: !v.value,
                    labelledby: d(I.id, "families"),
                    "model-value": I.families ?? [],
                    options: G.value,
                    "onUpdate:modelValue": (ne) => a(We)(I, "families", ne)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            v.value ? {
              name: "actions",
              fn: V(() => [
                $(a(Y), {
                  type: "button",
                  onClick: (ne) => S(I),
                  "aria-label": "Remove " + a(W)(I.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: V(() => [
                    $(a(oe), { icon: "tabler:trash" })
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
          fn: V(() => [
            $(Be, {
              label: "Channel name",
              action: "Add channel",
              "from-name": "",
              existing: c.value.map((I) => I.id),
              onAdd: p
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])) : u("", !0),
      l.view !== "channels" ? (e(), R(at, {
        key: 1,
        count: k.value.length,
        columns: ["details"]
      }, $e({
        default: V(() => [
          (e(!0), s(Z, null, se(k.value, (I) => (e(), R(st, {
            key: I.id,
            open: y.value[I.id],
            "onUpdate:open": (ne) => y.value[I.id] = ne,
            "route-section": "sources",
            "route-id": I.id,
            title: a(W)(I.id)
          }, $e({
            details: V(() => [
              t("span", ko, h(C(I)), 1),
              t("span", _o, h(I.writes?.length ? I.writes.map(a(W)).join(", ") : "No writable field groups"), 1)
            ]),
            default: V(() => [
              t("div", wo, [
                t("div", {
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": d(I.id, "people"),
                  "aria-describedby": d(I.id, "people-help")
                }, [
                  t("div", Co, [
                    t("label", {
                      id: d(I.id, "people")
                    }, "People and service accounts", 8, xo)
                  ]),
                  t("p", {
                    id: d(I.id, "people-help"),
                    class: "muted small pim-axis-help"
                  }, "If you leave this empty, anyone who can write to the catalog can use this source.", 8, Vo),
                  v.value ? (e(), R(oo, {
                    key: 0,
                    "catalog-id": l.catalogId,
                    "model-value": I.principals ?? [],
                    "onUpdate:modelValue": (ne) => a(We)(I, "principals", ne)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])) : (e(), s("span", jo, h(C(I)), 1))
                ], 8, $o),
                t("div", Oo, [
                  t("div", So, [
                    t("label", {
                      id: d(I.id, "writes")
                    }, "Field groups it can update", 8, Uo)
                  ]),
                  Q[1] || (Q[1] = t("p", { class: "muted small pim-axis-help" }, "If you leave this empty, this source cannot update any field values.", -1)),
                  $(Pe, {
                    disabled: !v.value,
                    labelledby: d(I.id, "writes"),
                    "model-value": I.writes ?? [],
                    options: J.value,
                    "onUpdate:modelValue": (ne) => a(We)(I, "writes", ne)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                t("div", Ao, [
                  Q[2] || (Q[2] = t("div", { class: "pim-f-label" }, [
                    t("strong", null, "Source identifier")
                  ], -1)),
                  Q[3] || (Q[3] = t("p", { class: "muted small pim-axis-help" }, [
                    X("Send this exact identifier in the "),
                    t("code", null, "source"),
                    X(" field of the update request.")
                  ], -1)),
                  t("div", null, [
                    t("code", Ro, h(I.id), 1)
                  ])
                ]),
                t("div", Po, [
                  t("div", To, [
                    t("label", {
                      id: d(I.id, "ordering")
                    }, "Handle incoming updates", 8, Io)
                  ]),
                  Q[4] || (Q[4] = t("p", { class: "muted small pim-axis-help" }, "Use the sender’s sequence numbers to prevent late deliveries from overwriting newer values.", -1)),
                  $(a(xe), {
                    disabled: !v.value,
                    "aria-labelledby": d(I.id, "ordering"),
                    "model-value": I.ordering ?? "none",
                    "onUpdate:modelValue": (ne) => I.ordering = ne,
                    options: [{ value: "none", label: "Use arrival order" }, { value: "sequence", label: "Use the source’s sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                t("div", qo, [
                  t("div", Do, [
                    t("label", {
                      for: d(I.id, "audit")
                    }, "Track value changes", 8, No)
                  ]),
                  t("div", Fo, [
                    $(a(dt), {
                      disabled: !v.value,
                      "input-id": d(I.id, "audit"),
                      "model-value": I.audit !== !1,
                      "onUpdate:modelValue": (ne) => ne ? delete I.audit : I.audit = !1
                    }, null, 8, ["disabled", "input-id", "model-value", "onUpdate:modelValue"]),
                    t("span", null, h(I.audit === !1 ? "Off for this source" : "Follow catalog audit settings"), 1)
                  ])
                ])
              ])
            ]),
            _: 2
          }, [
            v.value ? {
              name: "actions",
              fn: V(() => [
                $(a(Y), {
                  type: "button",
                  onClick: (ne) => j(I),
                  "aria-label": "Remove " + a(W)(I.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: V(() => [
                    $(a(oe), { icon: "tabler:trash" })
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
          fn: V(() => [
            $(Be, {
              label: "Source name",
              action: "Add source",
              "from-name": "",
              existing: k.value.map((I) => I.id),
              onAdd: A
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])) : u("", !0)
    ]));
  }
}), Bo = ["aria-labelledby"], Mo = {
  key: 0,
  class: "kx-settings-group-head"
}, Lo = ["id"], Eo = {
  key: 0,
  class: "kx-settings-group-count"
}, Wo = { class: "kx-settings-group-list" }, el = /* @__PURE__ */ pe({
  __name: "SettingsGroup",
  props: {
    title: {},
    count: {}
  },
  setup(l) {
    const m = Oe();
    return (i, n) => (e(), s("section", {
      class: "kx-settings-group",
      "aria-labelledby": l.title ? a(m) : void 0
    }, [
      l.title ? (e(), s("div", Mo, [
        t("h2", {
          id: a(m),
          class: "kx-settings-group-title"
        }, h(l.title), 9, Lo),
        l.count !== void 0 ? (e(), s("span", Eo, h(l.count), 1)) : u("", !0)
      ])) : u("", !0),
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
}, Qo = { class: "kx-settings-item-actions" }, Xo = ["aria-expanded", "aria-controls", "aria-label"], ed = ["id", "inert"], td = { class: "kx-settings-item-clip" }, ld = { class: "kx-settings-item-body" }, tl = /* @__PURE__ */ pe({
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
    const m = l, i = At(l, "open"), n = Kl(), o = Oe(), d = H(i.value);
    return ge(i, (v) => {
      v && (d.value = !0);
    }), (v, c) => (e(), s("article", {
      class: je(["kx-settings-item", { "kx-settings-item-open": i.value && a(n).default }])
    }, [
      t("div", Ho, [
        t("div", Jo, [
          t("div", Ko, [
            t("h3", Go, h(l.title), 1),
            he(v.$slots, "status")
          ]),
          l.description ? (e(), s("p", Yo, h(l.description), 1)) : u("", !0),
          a(n).meta ? (e(), s("p", Zo, [
            he(v.$slots, "meta")
          ])) : u("", !0)
        ]),
        t("div", Qo, [
          a(n).default ? (e(), s("button", {
            key: 0,
            type: "button",
            class: "kx-settings-item-expand",
            "aria-expanded": i.value,
            "aria-controls": a(o),
            "aria-label": (l.expandLabel || "Details") + " " + l.title,
            onClick: c[0] || (c[0] = (k) => i.value = !i.value)
          }, [
            t("span", null, h(l.expandLabel || "Details"), 1),
            $(a(oe), {
              icon: "tabler:chevron-down",
              "aria-hidden": "true"
            })
          ], 8, Xo)) : u("", !0),
          he(v.$slots, "actions")
        ])
      ]),
      a(n).default ? (e(), R(nl, {
        key: 0,
        name: "kx-settings-item-motion"
      }, {
        default: V(() => [
          d.value || m.keepMounted ? Rt((e(), s("div", {
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
          ]) : u("", !0)
        ]),
        _: 3
      })) : u("", !0)
    ], 2));
  }
});
function ad(l, m, i) {
  const n = /* @__PURE__ */ new Map();
  for (const d of l) {
    const v = m(d)?.trim() ?? "", c = n.get(v);
    c ? c.push(d) : n.set(v, [d]);
  }
  const o = [...n].map(([d, v]) => ({
    title: d,
    rows: [...v.filter(i), ...v.filter((c) => !i(c))]
  }));
  return o.length === 1 && o[0].title === "" ? o : o.map((d) => d.title ? d : { ...d, title: "Other" }).sort((d, v) => d.title === "Other" ? 1 : v.title === "Other" ? -1 : d.title.localeCompare(v.title));
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
  let d;
  return l.active && !l.installed ? d = "uninstalled" : i?.code === "plugin_config_invalid" ? d = "config" : i?.code === "plugin_projection_history_pruned" ? d = "reset" : i || l.lifecycle.state === "failed" ? d = "failed" : l.active && o?.[1].parked ? d = "paused" : l.active && o?.[1].error ? d = "degraded" : l.active && o ? d = "catchingUp" : l.active && l.lifecycle.state === "pending" && (d = "pending"), d ? { kind: d, ...sd[d], error: i, projection: o } : void 0;
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
  stale: d,
  editable: v,
  saved: c,
  clearError: k,
  reportError: B
}) {
  const E = Je(), G = Je();
  ge(l, G.begin), Ke(() => {
    E.begin(), G.begin();
  });
  async function J(S = !1) {
    const A = l(), j = i.value, F = E.begin();
    try {
      const [Q, I] = await Promise.all([ye.schema(A), S ? ye.schemaOptions(A) : void 0]);
      return !j || !E.current(F) || A !== l() || i.value !== j ? !1 : (j.plugins = Q.plugins, j.as_of = Q.as_of, I && (n.value = I), !0);
    } catch (Q) {
      return S && E.current(F) && A === l() && B(Q, "Could not check plugin status."), !1;
    }
  }
  async function M(S) {
    const A = l(), j = i.value?.plugins.find((Q) => Q.plugin === S && Q.active && Q.installed);
    if (!j?.config || o.value || d.value || !v.value || !await tt.confirm({
      header: "Reset background updates?",
      message: "Background updates will start from a new catalog event. Current product data will be rebuilt into the plugin’s index. Earlier events will be skipped.",
      acceptLabel: "Reset background updates",
      rejectLabel: "Cancel"
    }) || l() !== A || o.value) return;
    const F = G.begin();
    E.begin(), o.value = !0, k(), c.value = "";
    try {
      await ye.configurePlugin(A, S, et(j.config), !0), G.current(F) && await J(!0) && G.current(F) && (c.value = "Background update reset requested.");
    } catch (Q) {
      G.current(F) && B(Q, "Could not reset background updates.");
    } finally {
      G.current(F) && (o.value = !1);
    }
  }
  async function y(S) {
    const A = l();
    if (!(o.value || d.value || !v.value)) {
      o.value = !0, k(), c.value = "";
      try {
        await ye.resumePluginProjection(A, S), l() === A && await J(!0) && (c.value = "Background update resumed.");
      } catch (j) {
        l() === A && B(j, "Could not resume the background update.");
      } finally {
        l() === A && (o.value = !1);
      }
    }
  }
  async function C(S) {
    const A = l();
    if (!(o.value || d.value || !v.value) && !(!await tt.confirm({
      header: "Clear catalog app binding?",
      message: "The catalog will use the default app after this setting is saved.",
      acceptLabel: "Clear binding",
      rejectLabel: "Cancel"
    }) || l() !== A || o.value || !v.value || !i.value?.plugins.some((j) => j.references?.shell_bindings.includes(S)))) {
      o.value = !0, k(), c.value = "";
      try {
        if (await ye.updateCatalogApp(A, ""), l() !== A) return;
        await J(!0) && (c.value = "Catalog app binding cleared.");
      } catch (j) {
        l() === A && B(j, "Could not clear the catalog app binding.");
      } finally {
        l() === A && (o.value = !1);
      }
    }
  }
  const p = z(() => m() && !o.value && i.value?.plugins.some((S) => id(S, i.value.as_of)) === !0);
  return ge(p, (S, A, j) => {
    if (!S) return;
    let F, Q = !0;
    const I = () => {
      F = setTimeout(async () => {
        await J() && Q && p.value && I();
      }, 2e3);
    };
    I(), j(() => {
      Q = !1, clearTimeout(F);
    });
  }), { refreshPluginStatus: J, resetPlugin: M, resumePluginProjection: y, clearShellBinding: C };
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
}, Bd = { class: "pim-ia-dialog-head" }, Md = { key: 1 }, Ld = { key: 2 }, Ed = { class: "row pim-ia-dialog-actions" }, Wd = { class: "row wrap muted small" }, Hd = /* @__PURE__ */ pe({
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
    const n = l, o = i, d = /* @__PURE__ */ new Map([
      ["eq", "Equals"],
      ["in", "Is one of"],
      ["gt", "Greater than"],
      ["gte", "At least"],
      ["lt", "Less than"],
      ["lte", "At most"]
    ]), v = H({}), c = /* @__PURE__ */ new Map(), k = H(/* @__PURE__ */ new Set()), B = H(/* @__PURE__ */ new Set());
    ge(() => B.value.size > 0, (r) => o("invalid-draft", r));
    function E(r, b, w) {
      b ? k.value.delete(r) : k.value.add(r), w ? B.value.add(r) : B.value.delete(r);
    }
    function G() {
      const r = j.value.find(({ plugin: b, chosen: w }) => w && k.value.has(b.plugin) && (B.value.has(b.plugin) || Object.hasOwn(n.pluginConfigs, b.plugin) || !b.active || n.refusal?.plugin === b.plugin));
      return r ? (v.value[r.plugin.plugin] = !0, qe(() => c.get(r.plugin.plugin)?.reportValidity()), !1) : !0;
    }
    m({ reportValidity: G }), ge(() => n.refusal, (r) => {
      r && (v.value[r.plugin] = !0);
    }, { immediate: !0 });
    const J = H(), M = z(() => j.value.find((r) => r.plugin.plugin === J.value)), y = z(() => M.value?.plugin), C = z(() => n.schema.access.admin), p = z(() => n.draft.plugins ?? []), S = z(() => new Map(n.schema.plugins.map((r) => [r.plugin, r]))), A = z(() => {
      const r = /* @__PURE__ */ new Map();
      for (const [b, w] of Object.entries(n.schema.attributes)) {
        if (!w.plugin) continue;
        const q = r.get(w.plugin) ?? [];
        q.push(W(b)), r.set(w.plugin, q);
      }
      return r;
    }), j = z(() => n.options.plugins.map((r) => {
      const b = S.value.get(r.plugin) ?? r, w = nd(b, n.schema.as_of), q = p.value.some((le) => le.use === b.plugin), L = n.refusal?.plugin === b.plugin ? n.refusal : void 0;
      return {
        option: r,
        plugin: b,
        status: w,
        chosen: q,
        refusal: L,
        title: ce(b.title ?? r.title, b.installed ? "Plugin" : "Unavailable plugin"),
        label: L || B.value.has(b.plugin) ? "Needs configuration" : !b.active && w?.kind === "failed" ? "Unavailable" : w?.label ?? (q ? b.active ? "Enabled" : "Turns on when applied" : b.active ? "Turns off when applied" : "Available"),
        severity: L || B.value.has(b.plugin) ? "warn" : w?.severity ?? (q === b.active ? q ? "success" : "secondary" : "info"),
        configurable: q && b.installed && w?.kind !== "failed" && w?.kind !== "uninstalled" && (Object.keys(r.config_schema.properties ?? {}).length > 0 || w?.kind === "config"),
        needs: r.requires.map(I),
        usedBy: n.options.plugins.filter((le) => le.requires.includes(b.plugin) && p.value.some((fe) => fe.use === le.plugin)).map((le) => I(le.plugin)),
        open: v.value[b.plugin] ?? (q && (!b.active || !!n.pluginConfigs[b.plugin]) || !!(b.active && w && w.kind !== "pending"))
      };
    })), F = z(() => ad(j.value, (r) => r.option.category, (r) => r.plugin.active)), Q = jt(It, void 0);
    ge(() => Q?.selected.value, (r, b) => {
      for (const [w, q] of [[b, !1], [r, !0]])
        w?.startsWith("plugins/") && (v.value[w.slice(8)] = q);
    }, { immediate: !0 });
    function I(r) {
      return ce(n.options.plugins.find((b) => b.plugin === r)?.title, "Another plugin");
    }
    function ne(r, b) {
      v.value[r] = b, Q?.choose("plugins", r, b);
    }
    function Ce(r, b) {
      const w = b.map((q) => d.get(q)).filter(Boolean);
      return [W(r), w.join(", ")].filter(Boolean).join(" · ");
    }
    function ve(r, b) {
      b && !p.value.some((w) => w.use === r) && ((n.draft.plugins ??= []).push({ use: r }), v.value[r] = !0), b || (v.value[r] = !1, n.draft.plugins = p.value.filter((w) => w.use !== r), delete n.pluginConfigs[r], n.refusal?.plugin === r && o("clearRefusal"), S.value.get(r)?.active && o("remove", "plugins", r));
    }
    function ke(r, b) {
      v.value[r] = !0;
      const w = n.pluginConfigs[r] ?? S.value.get(r)?.config ?? {};
      n.pluginConfigs[r] = b, n.refusal?.plugin === r && JSON.stringify(w[n.refusal.field]) !== JSON.stringify(b[n.refusal.field]) && o("clearRefusal");
    }
    const ie = z(() => n.draft.scopes ?? []);
    function K(r) {
      return ie.value.includes(r.id);
    }
    function P(r, b) {
      b && !K(r) && (n.draft.scopes ??= []).push(r.id), !b && K(r) && (ie.value.splice(ie.value.indexOf(r.id), 1), n.schema.declaration.scopes?.includes(r.id) && o("remove", "scopes", r.id));
    }
    const f = z(() => {
      const r = y.value;
      if (!r) return [];
      const b = r.references;
      return [
        { label: "Fields", items: (b?.fields ?? Object.entries(n.schema.attributes).filter(([, q]) => q.plugin === r.plugin).map(([q]) => q)).map((q) => ({ id: q, title: ce(W(q), "Field") })) },
        { label: "Product filter sets", items: (b?.scopes ?? []).map((q) => ({
          id: q,
          title: ce(n.options.scopes.find((L) => L.id === q)?.title, "Unavailable filter set")
        })) },
        { label: "Catalog app binding", items: (b?.shell_bindings ?? []).map((q) => ({ id: q, title: "Catalog app" })) },
        { label: "Readiness checks", items: (b?.checks ?? []).map((q) => ({ id: q, title: "Readiness check" })) },
        { label: "Dependent plugins", items: (b?.plugins ?? []).map((q) => ({
          id: q,
          title: ce(S.value.get(q)?.title, "Dependent plugin")
        })) }
      ].filter((q) => q.items.length);
    });
    function _(r) {
      for (const b of r.references?.scopes ?? [])
        ie.value.includes(b) && (n.draft.scopes = ie.value.filter((w) => w !== b), o("remove", "scopes", b));
      J.value = void 0, ve(r.plugin, !1), o("review");
    }
    return (r, b) => (e(), s("div", rd, [
      C.value && j.value.some((w) => w.chosen !== w.plugin.active || Object.hasOwn(l.pluginConfigs, w.plugin.plugin)) ? (e(), s("p", ud, "Plugin changes take effect after you review and apply them.")) : u("", !0),
      j.value.length === 0 ? (e(), s("p", cd, "No plugin is installed.")) : u("", !0),
      (e(!0), s(Z, null, se(F.value, (w) => (e(), R(el, {
        key: w.title,
        title: w.title || void 0,
        count: w.title ? w.rows.length : void 0
      }, {
        default: V(() => [
          (e(!0), s(Z, null, se(w.rows, ({ option: q, plugin: L, status: le, chosen: fe, title: Se, label: Me, severity: Te, refusal: Ge, configurable: N, needs: T, usedBy: D, open: O }) => (e(), R(tl, {
            key: L.plugin,
            "data-plugin": L.plugin,
            title: Se,
            description: q.description && a(ce)(q.description, "") || void 0,
            "expand-label": N ? "Configure" : "Details",
            "keep-mounted": B.value.has(L.plugin),
            open: O,
            "onUpdate:open": (ee) => ne(L.plugin, ee)
          }, $e({
            status: V(() => [
              $(a(_e), {
                class: "kx-tag-sm pim-plugin-state",
                severity: Te,
                value: Me
              }, null, 8, ["severity", "value"])
            ]),
            default: V(() => [
              t("div", fd, [
                le?.kind === "failed" ? (e(), R(a(Ve), {
                  key: 0,
                  severity: "warn",
                  role: "alert"
                }, {
                  default: V(() => [
                    a(od)(L) ? (e(), s("p", gd, "This package uses a plugin interface this deployment cannot run. Restore a compatible package to use this plugin.")) : (e(), s("p", bd, "The catalog could not set up this plugin. Check the status after resolving the setup problem.")),
                    L.active && le.projection?.[1].parked ? (e(), s("p", yd, "Background update: Paused")) : u("", !0),
                    t("div", hd, [
                      C.value && L.references ? (e(), R(a(Y), {
                        key: 0,
                        label: "Review references",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        onClick: (ee) => J.value = L.plugin
                      }, null, 8, ["onClick"])) : (e(), R(a(Y), {
                        key: 1,
                        label: "Check status",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        onClick: b[0] || (b[0] = (ee) => o("refresh"))
                      }))
                    ])
                  ]),
                  _: 2
                }, 1024)) : le?.kind === "reset" ? (e(), R(a(Ve), {
                  key: 1,
                  severity: "warn"
                }, {
                  default: V(() => [
                    b[6] || (b[6] = t("p", null, "The event history this background update needs was removed.", -1)),
                    le.error?.max_pruned_seq !== void 0 ? (e(), s("p", kd, "Earliest retained position " + h(le.error.max_pruned_seq + 1) + ".", 1)) : u("", !0),
                    C.value ? (e(), s("div", _d, [
                      $(a(Y), {
                        label: "Reset background updates",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        disabled: l.stale,
                        onClick: (ee) => o("reset", L.plugin)
                      }, null, 8, ["disabled", "onClick"])
                    ])) : u("", !0)
                  ]),
                  _: 2
                }, 1024)) : le?.projection && (le.kind === "paused" || le.kind === "degraded" || le.kind === "catchingUp") ? (e(), R(a(Ve), {
                  key: 2,
                  severity: le.kind === "catchingUp" ? "info" : "warn"
                }, {
                  default: V(() => [
                    le.projection[1].status === "paused" ? (e(), s("p", wd, "This update was paused.")) : le.kind === "paused" ? (e(), s("p", $d, "The background worker stopped.")) : le.kind === "degraded" ? (e(), s("p", Cd, "The background worker reported an error.")) : (e(), s("p", xd, "This update is processing catalog changes.")),
                    t("p", Vd, "Last applied position " + h(le.projection[1].last_seq) + ".", 1),
                    t("div", jd, [
                      C.value && le.projection[1].status === "paused" && le.projection[1].cursor_id ? (e(), R(a(Y), {
                        key: 0,
                        label: "Resume background update",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        disabled: l.stale,
                        onClick: (ee) => o("resume", le.projection[1].cursor_id)
                      }, null, 8, ["disabled", "onClick"])) : le.kind === "paused" && C.value ? (e(), R(a(Y), {
                        key: 1,
                        label: "Reset background updates",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        disabled: l.stale,
                        onClick: (ee) => o("reset", L.plugin)
                      }, null, 8, ["disabled", "onClick"])) : (e(), R(a(Y), {
                        key: 2,
                        label: "Check status",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        onClick: b[1] || (b[1] = (ee) => o("refresh"))
                      }))
                    ])
                  ]),
                  _: 2
                }, 1032, ["severity"])) : le?.kind === "uninstalled" ? (e(), R(a(Ve), {
                  key: 3,
                  severity: "warn"
                }, {
                  default: V(() => [
                    b[7] || (b[7] = t("p", null, "The package was removed while it was still enabled for this catalog.", -1)),
                    t("div", Od, [
                      $(a(Y), {
                        label: "Review references",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        onClick: (ee) => J.value = L.plugin
                      }, null, 8, ["onClick"])
                    ])
                  ]),
                  _: 2
                }, 1024)) : u("", !0),
                A.value.get(L.plugin)?.length ? (e(), s("p", Sd, " Adds fields for " + h(A.value.get(L.plugin)?.join(", ")) + ". ", 1)) : u("", !0),
                N ? (e(), R(qt, {
                  key: 5,
                  ref_for: !0,
                  ref: (ee) => {
                    ee ? a(c).set(L.plugin, ee) : a(c).delete(L.plugin);
                  },
                  disabled: !C.value,
                  schema: q.config_schema,
                  "model-value": l.pluginConfigs[L.plugin] ?? L.config ?? {},
                  problem: le?.kind === "config" && !Object.hasOwn(l.pluginConfigs, L.plugin) ? le.error : void 0,
                  "plugin-id": le?.kind === "config" ? L.plugin : void 0,
                  refusal: Ge,
                  onValidity: (ee, te) => E(L.plugin, ee, te),
                  "onUpdate:modelValue": (ee) => ke(L.plugin, ee)
                }, null, 8, ["disabled", "schema", "model-value", "problem", "plugin-id", "refusal", "onValidity", "onUpdate:modelValue"])) : !le || le.kind === "pending" ? (e(), s("p", Ud, h(fe ? "This plugin has no settings for this catalog." : "Turn the plugin on to use it in this catalog."), 1)) : u("", !0),
                $(Fe, {
                  class: "small pim-ia-disclosure pim-error-code",
                  label: "Technical details"
                }, {
                  default: V(() => [
                    t("dl", Ad, [
                      t("div", null, [
                        b[8] || (b[8] = t("dt", null, "Plugin ID", -1)),
                        t("dd", null, [
                          t("code", null, h(L.plugin), 1)
                        ])
                      ]),
                      (L.interface_version ?? q.interface_version) != null ? (e(), s("div", Rd, [
                        b[9] || (b[9] = t("dt", null, "Interface version", -1)),
                        t("dd", null, h(L.interface_version ?? q.interface_version), 1)
                      ])) : u("", !0),
                      le?.error?.message ? (e(), s("div", Pd, [
                        b[10] || (b[10] = t("dt", null, "Error", -1)),
                        t("dd", null, h(le.error.message), 1)
                      ])) : u("", !0),
                      le?.error?.code ? (e(), s("div", Td, [
                        b[11] || (b[11] = t("dt", null, "Error code", -1)),
                        t("dd", null, [
                          t("code", null, h(le.error.code), 1)
                        ])
                      ])) : u("", !0),
                      le?.error?.projection ? (e(), s("div", Id, [
                        b[12] || (b[12] = t("dt", null, "Background update", -1)),
                        t("dd", null, [
                          t("code", null, h(le.error.projection), 1)
                        ])
                      ])) : u("", !0),
                      le?.projection && (le.kind === "paused" || le.kind === "degraded" || le.kind === "catchingUp") ? (e(), s("div", qd, [
                        b[13] || (b[13] = t("dt", null, "Background update", -1)),
                        t("dd", null, [
                          t("code", null, h(le.projection[0]), 1),
                          le.projection[1].error ? (e(), s("span", Dd, " · " + h(le.projection[1].error), 1)) : u("", !0)
                        ])
                      ])) : u("", !0),
                      L.installed ? (e(), s("div", Nd, [...b[14] || (b[14] = [
                        t("dt", null, "Configuration tool", -1),
                        t("dd", null, [
                          t("code", null, "PIMConfigurePlugin")
                        ], -1)
                      ])])) : u("", !0),
                      L.tools.length ? (e(), s("div", Fd, [
                        b[15] || (b[15] = t("dt", null, "Plugin tools", -1)),
                        t("dd", null, [
                          t("ul", null, [
                            (e(!0), s(Z, null, se(L.tools, (ee) => (e(), s("li", { key: ee }, [
                              t("code", null, h(ee), 1)
                            ]))), 128))
                          ])
                        ])
                      ])) : u("", !0)
                    ])
                  ]),
                  _: 2
                }, 1024)
              ])
            ]),
            _: 2
          }, [
            T.length || D.length ? {
              name: "meta",
              fn: V(() => [
                T.length ? (e(), s("span", pd, "Needs " + h(a(ll)(T)), 1)) : u("", !0),
                T.length && D.length ? (e(), s("span", md, " · ")) : u("", !0),
                D.length ? (e(), s("span", vd, "Used by " + h(a(ll)(D)), 1)) : u("", !0)
              ]),
              key: "0"
            } : void 0,
            C.value && L.installed && (!le || le.kind === "pending") ? {
              name: "actions",
              fn: V(() => [
                $(a(dt), {
                  "aria-label": "Enable " + Se,
                  "model-value": fe,
                  "onUpdate:modelValue": (ee) => ve(L.plugin, ee)
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
              ]),
              key: "1"
            } : void 0
          ]), 1032, ["data-plugin", "title", "description", "expand-label", "keep-mounted", "open", "onUpdate:open"]))), 128))
        ]),
        _: 2
      }, 1032, ["title", "count"]))), 128)),
      $(ft, {
        visible: !!y.value,
        label: "Plugin references",
        onClose: b[5] || (b[5] = (w) => J.value = void 0)
      }, {
        default: V(() => [
          M.value && y.value ? (e(), s("section", zd, [
            t("header", Bd, [
              t("div", null, [
                b[16] || (b[16] = t("h2", null, "Plugin references", -1)),
                t("p", null, h(M.value.title), 1)
              ])
            ]),
            f.value.length ? (e(), s(Z, { key: 0 }, [
              b[17] || (b[17] = t("p", null, "Replace or remove these references before deactivating the plugin. You can also restore the package to keep using them.", -1)),
              (e(!0), s(Z, null, se(f.value, (w) => (e(), s("div", {
                key: w.label
              }, [
                t("h3", null, h(w.label), 1),
                t("ul", null, [
                  (e(!0), s(Z, null, se(w.items, (q) => (e(), s("li", {
                    key: q.id
                  }, h(q.title), 1))), 128))
                ])
              ]))), 128))
            ], 64)) : (e(), s("p", Md, "Use the catalog review to see what deactivating this plugin would change.")),
            y.value.references?.scopes.length && !y.value.references?.shell_bindings.length ? (e(), s("p", Ld, "Reviewing removal also includes these product filter sets.")) : u("", !0),
            $(Fe, {
              class: "small pim-error-code pim-ia-disclosure",
              label: "Technical details"
            }, {
              default: V(() => [
                t("p", null, [
                  b[18] || (b[18] = X("Plugin ", -1)),
                  t("code", null, h(y.value.plugin), 1)
                ]),
                (e(!0), s(Z, null, se(f.value, (w) => (e(), s("div", {
                  key: w.label
                }, [
                  t("p", null, h(w.label), 1),
                  t("ul", null, [
                    (e(!0), s(Z, null, se(w.items, (q) => (e(), s("li", {
                      key: q.id
                    }, [
                      t("code", null, h(q.id), 1)
                    ]))), 128))
                  ])
                ]))), 128))
              ]),
              _: 1
            }),
            t("div", Ed, [
              C.value && y.value.references?.shell_bindings.length ? (e(), R(a(Y), {
                key: 0,
                label: "Clear catalog app binding",
                severity: "secondary",
                outlined: "",
                disabled: l.stale,
                onClick: b[2] || (b[2] = (w) => o("clearShellBinding", y.value.references.shell_bindings[0]))
              }, null, 8, ["disabled"])) : C.value ? (e(), R(a(Y), {
                key: 1,
                label: "Review removal",
                disabled: l.stale,
                onClick: b[3] || (b[3] = (w) => _(y.value))
              }, null, 8, ["disabled"])) : u("", !0),
              $(a(Y), {
                label: "Close",
                severity: "secondary",
                outlined: "",
                onClick: b[4] || (b[4] = (w) => J.value = void 0)
              })
            ])
          ])) : u("", !0)
        ]),
        _: 1
      }, 8, ["visible"]),
      l.options.scopes.length ? (e(), R(el, {
        key: 2,
        title: "Product filters",
        count: l.options.scopes.length
      }, {
        default: V(() => [
          (e(!0), s(Z, null, se(l.options.scopes, (w) => (e(), R(tl, {
            key: w.id,
            title: a(ce)(w.title, "Filter set"),
            description: "Adds ways to filter products in this catalog.",
            "expand-label": "Details",
            open: !!v.value["scope:" + w.id],
            "onUpdate:open": (q) => ne("scope:" + w.id, q)
          }, $e({
            status: V(() => [
              $(a(_e), {
                class: "kx-tag-sm pim-plugin-state",
                severity: K(w) ? "success" : "secondary",
                value: K(w) ? "In use" : "Available"
              }, null, 8, ["severity", "value"])
            ]),
            default: V(() => [
              t("div", Wd, [
                b[19] || (b[19] = t("span", null, "Filters", -1)),
                (e(!0), s(Z, null, se(w.filters, (q, L) => (e(), R(a(_e), {
                  key: L,
                  class: "kx-tag-sm small",
                  severity: "secondary",
                  value: Ce(L, q.ops)
                }, null, 8, ["value"]))), 128)),
                t("span", null, h(a(W)(w.access)) + " access required", 1)
              ]),
              $(Fe, {
                class: "small pim-ia-disclosure",
                label: "Technical details"
              }, {
                default: V(() => [
                  t("p", null, [
                    b[20] || (b[20] = X("Filter set ID ", -1)),
                    t("code", null, h(w.id), 1),
                    b[21] || (b[21] = X(". Product filter sets are ", -1)),
                    b[22] || (b[22] = t("code", null, "scopes", -1)),
                    b[23] || (b[23] = X(" in ", -1)),
                    b[24] || (b[24] = t("code", null, "PIMQuery", -1)),
                    b[25] || (b[25] = X("; use the ID in ", -1)),
                    b[26] || (b[26] = t("code", null, "scopes[].id", -1)),
                    b[27] || (b[27] = X(".", -1))
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, [
            C.value ? {
              name: "actions",
              fn: V(() => [
                $(a(dt), {
                  "aria-label": "Use " + a(ce)(w.title, "Filter set"),
                  "model-value": K(w),
                  "onUpdate:modelValue": (q) => P(w, q)
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["title", "open", "onUpdate:open"]))), 128))
        ]),
        _: 1
      }, 8, ["count"])) : u("", !0)
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
}, sr = /* @__PURE__ */ pe({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {},
    disabled: { type: Boolean },
    defaultsOnly: { type: Boolean }
  },
  setup(l) {
    const m = l, i = H(), n = z(() => m.defaults ?? i.value), o = H(), d = H(!1);
    async function v() {
      if (!(m.defaults || m.disabled)) {
        o.value = void 0, d.value = !0;
        try {
          i.value = await Jd(m.catalogId ?? "");
        } catch (p) {
          o.value = He(p, "Could not read policy defaults.");
        } finally {
          d.value = !1;
        }
      }
    }
    ol(v);
    const c = z(() => m.draft.policy ?? {}), k = [
      { key: "audit", title: "Audit trail", hint: "Fields records each value change. Off records only lifecycle, schema and release history.", kind: "enum" },
      { key: "audit_days", title: "Audit retention (days)", hint: "0 uses the 365-day default. History always expires.", kind: "int", min: 0, max: 106751 },
      { key: "trash_days", title: "Trash window (days)", hint: "How long a deleted product stays restorable.", kind: "int", min: 1, max: 106751 },
      { key: "tombstone_days", title: "Deleted product notices (days)", hint: "How long feeds report a purged product as deleted.", kind: "int", min: 1, max: 106751 }
    ], B = {
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
    function E(p) {
      const S = fl[p];
      return { key: p, ...S, kind: "int", hint: B[p] };
    }
    k.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(E));
    const G = ["proposal_days", "proposal_count"].map(E), J = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(E), M = [
      { id: "retention", title: "Retention", keys: k },
      { id: "proposals", title: "Proposals", keys: G },
      { id: "advanced", title: "", keys: J }
    ], y = z(() => [
      { value: "inherited", label: n.value ? `${n.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function C(p, S) {
      const A = m.draft.policy ?? (m.draft.policy = {});
      A[p] = S == null || S === "" || S === "inherited" ? !1 : S;
    }
    return (p, S) => (e(), s("section", Kd, [
      l.defaultsOnly ? u("", !0) : (e(), s("p", Gd, "Empty fields inherit the deployment settings.")),
      d.value ? (e(), s("p", Yd, "Loading deployment defaults…")) : u("", !0),
      o.value ? (e(), R(ht, {
        key: 2,
        error: o.value
      }, {
        default: V(() => [
          $(a(Y), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: v
          }, {
            default: V(() => [...S[0] || (S[0] = [
              X("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : u("", !0),
      (e(), s(Z, null, se(M, (A) => $(sl(A.id === "advanced" ? Fe : "section"), Gl({
        key: A.id,
        ref_for: !0
      }, A.id === "advanced" ? { label: "Advanced processing settings" } : { "aria-label": A.title }, {
        "data-policy-group": A.id,
        class: "pim-policy-group"
      }), {
        default: V(() => [
          A.title ? (e(), s("header", Zd, [
            t("h3", null, h(A.title), 1)
          ])) : u("", !0),
          (e(!0), s(Z, null, se(A.keys, (j) => (e(), s("div", {
            key: j.key,
            class: "pim-policy-row"
          }, [
            t("div", Qd, [
              t("label", {
                for: "pol-" + j.key
              }, h(j.title), 9, Xd),
              t("p", {
                id: "pol-help-" + j.key
              }, [
                X(h(j.hint), 1),
                j.global ? (e(), s("span", tr, " Managed in deployment settings.")) : u("", !0)
              ], 8, er)
            ]),
            l.defaultsOnly ? (e(), s("p", lr, [
              X(h(n.value?.[j.key] === "fields" ? "Record field changes" : n.value?.[j.key] === "off" ? "Lifecycle and release history" : n.value?.[j.key] ?? "Unavailable") + " ", 1),
              c.value[j.key] !== void 0 && c.value[j.key] !== !1 ? (e(), s("span", ar, " · Catalog override applies")) : u("", !0)
            ])) : j.kind === "enum" ? (e(), R(a(xe), {
              key: 1,
              disabled: l.disabled,
              "input-id": "pol-" + j.key,
              "aria-describedby": "pol-help-" + j.key,
              class: "pim-policy-control",
              "model-value": typeof c.value[j.key] == "string" ? c.value[j.key] : "inherited",
              options: y.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": (F) => C(j.key, F)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])) : (e(), R(a(ea), {
              key: 2,
              disabled: l.disabled || j.global,
              "input-id": "pol-" + j.key,
              "aria-describedby": "pol-help-" + j.key,
              class: "pim-policy-control",
              "model-value": j.global ? Number(n.value?.[j.key] ?? 0) || null : typeof c.value[j.key] == "number" ? Number(c.value[j.key]) : null,
              min: j.min ?? (j.key === "audit_days" ? 0 : 1),
              max: j.max,
              step: 1,
              placeholder: n.value ? "Default: " + n.value[j.key] : "Deployment default",
              "onUpdate:modelValue": (F) => C(j.key, F)
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
}, rr = /* @__PURE__ */ pe({
  __name: "BuilderDeclaration",
  props: {
    draft: {},
    readonly: { type: Boolean }
  },
  emits: ["replace", "validity"],
  setup(l, { emit: m }) {
    const i = l, n = m, o = H(JSON.stringify(i.draft, null, 2)), d = H("");
    Ke(() => n("validity", !0)), ge(() => i.draft, (c) => {
      o.value = JSON.stringify(c, null, 2), d.value = "";
    }, { deep: !0 });
    function v() {
      if (!i.readonly)
        try {
          const c = fa(o.value);
          d.value = "", n("validity", !0), n("replace", c);
        } catch (c) {
          n("validity", !1), d.value = "Invalid declaration: " + (c instanceof Error ? c.message : String(c));
        }
    }
    return (c, k) => (e(), s("section", ir, [
      t("div", nr, [
        t("header", or, [
          k[1] || (k[1] = t("h3", null, "Declaration", -1)),
          l.readonly ? u("", !0) : (e(), s("span", dr, "edits apply to the draft when the JSON parses"))
        ]),
        d.value ? (e(), R(a(Ve), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: V(() => [
            X(h(d.value), 1)
          ]),
          _: 1
        })) : u("", !0),
        $(a(ta), {
          modelValue: o.value,
          "onUpdate:modelValue": k[0] || (k[0] = (B) => o.value = B),
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
}, Gr = ["for"], Yr = { class: "dialog-actions pim-ia-dialog-actions" }, Zr = /* @__PURE__ */ pe({
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
    }, d = {
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
    }, v = H(""), c = H("General"), k = H("Overview"), B = H(""), E = H(), G = z(() => E.value?.from === "Channels" ? "Families" : E.value ? "Fields" : void 0), J = H(), M = H(!1), y = H(), C = H(""), p = Object.keys(o).map((x) => ({
      heading: x === "Channels" ? "Publishing and imports" : x,
      items: o[x].items.map((g) => ({ ...g, value: g.label, section: x }))
    })), S = [
      ...p.filter((x) => x.items.length > 1),
      { heading: "Manage catalog", items: p.filter((x) => x.items.length === 1).flatMap((x) => x.items) }
    ], A = S.flatMap((x) => x.items), j = z(() => w.value && q.value ? [
      { ...S[0], heading: i.title || "Catalog" },
      ...S.slice(1)
    ] : []), F = z(() => i.backLabel ? {
      value: "all-catalogs",
      label: i.embedded ? "All catalogs" : i.backLabel,
      icon: "tabler:table"
    } : void 0), Q = H();
    ge(Q, (x) => {
      i.focusBack && x?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    function I(x) {
      if (x === "all-catalogs") {
        n("back");
        return;
      }
      const g = A.find((U) => U.label === x);
      g && ve(g.section, g.label);
    }
    function ne(x, g, U = "") {
      const ae = k.value !== g;
      c.value = x, k.value = g, v.value = U ? d[g] + "/" + U : "", ae && (C.value = "", y.value && (y.value.scrollTop = 0));
    }
    function Ce(x, g, U = "") {
      ne(x, g, U), i.route !== void 0 && n("navigate", [d[g], ...U ? [encodeURIComponent(U)] : []].join("/"));
    }
    function ve(x, g = o[x].items[0].label) {
      (c.value !== x || k.value !== g) && (E.value = void 0, Ce(x, g));
    }
    function ke(x, g, U) {
      if (i.route === void 0 || d[k.value] !== x || !U && v.value !== x + "/" + g) return;
      const ae = w.value;
      (x === "families" ? ae?.families[g] : x === "fields" ? ae?.declaration.aspects?.some((re) => re.attributes?.some((be) => re.namespace + "." + be.id === g)) : x === "dimensions" ? ae?.dimensions.some((re) => re.name === g) : x === "vocabularies" ? ae?.vocabularies[g] : x === "channels" ? ae?.channels[g] : x === "sources" ? ae?.sources[g] : x === "plugins" && (q.value?.plugins.some((re) => re.plugin === g) || q.value?.scopes.some((re) => "scope:" + re.id === g))) && Ce(c.value, k.value, U ? g : "");
    }
    il(It, { selected: v, choose: ke }), ge(() => i.route, (x) => {
      if (x === void 0) return;
      const [g, U] = x.split("/"), ae = A.find((re) => d[re.label] === g);
      ae?.label !== G.value && (E.value = void 0);
      let de = "";
      try {
        U && (de = decodeURIComponent(U));
      } catch {
      }
      ae?.label === "Fields" && de && v.value !== "fields/" + de && (B.value = ""), ne(ae?.section ?? "General", ae?.label ?? "Overview", de);
    }, { immediate: !0 });
    function ie(x) {
      J.value = x, M.value = !0;
    }
    function K(x) {
      B.value = x, ve("Products", "Fields");
    }
    async function P(x, g, U = "") {
      Ce(x, g, U), await qe(), y.value?.focus({ preventScroll: !0 });
    }
    function f(x) {
      E.value = { from: "Channels", id: x };
      const g = Lt.value.find((ae) => ae.id === x)?.families, U = pt.value.filter((ae) => !g?.length || g.includes(ae.code));
      P("Products", "Families", U.length === 1 ? U[0].code : void 0);
    }
    function _(x) {
      B.value = "", E.value = { from: "Families", id: x }, P("Products", "Fields");
    }
    function r() {
      if (!E.value) return;
      const { from: x, id: g } = E.value;
      E.value = void 0, P(x === "Channels" ? "Channels" : "Products", x, g);
    }
    function b(x, g, U = g + "s") {
      return x + " " + (x === 1 ? g : U);
    }
    const w = H(null), q = H(null), L = H({}), le = H({}), fe = H({}), Se = H(), Me = H(), Te = H(!1), Ge = H(0), N = z(() => Object.fromEntries(Object.entries(fe.value).filter(([x]) => L.value.plugins?.some((g) => g.use === x) && !w.value?.plugins.some((g) => g.plugin === x && g.active)))), T = H(), D = H(!1), O = H(null), ee = H(!1), te = z(() => w.value?.access.admin === !0), ue = H(null), we = H(!1), Ye = H(!1), Dt = H(null), ut = Oe(), gl = {
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
    }, Ze = H(null), De = H(!0), Ie = Je(), Nt = z(() => we.value && Ue.value && (!$t.value.length || Ye.value) && !D.value && De.value && !!ue.value && ue.value.class !== "refused" && !!Ze.value?.matches(Le.value, w.value?.schema_generation ?? -1, fe.value)), Ft = z(() => ue.value ? [...ue.value.refused, ...ue.value.changes.filter((x) => x.class !== "refused")] : []), it = Je(), kt = H(!1);
    let _t = 0;
    ge([L, le, fe], () => {
      _t++, C.value = "", Ae();
    }, { deep: !0, flush: "sync" });
    async function Qe(x = !1, g = !1) {
      if (Ue.value && !x) return;
      const U = it.begin(), ae = _t, de = i.catalogId, re = g ? Object.entries(fe.value).filter(([be]) => w.value?.plugins.some((Re) => Re.plugin === be && Re.active)) : [];
      kt.value = !0, T.value = void 0, Se.value = void 0;
      try {
        const [be, Re] = await Promise.all([ye.schema(de), ye.schemaOptions(de)]);
        if (!it.current(U) || ae !== _t || de !== i.catalogId) return !1;
        const Ne = C.value;
        return w.value = be, q.value = Re, L.value = et(be.declaration), le.value = {}, fe.value = Object.fromEntries(re.filter(([Pl]) => be.plugins.some((Yt) => Yt.plugin === Pl && Yt.active))), Ae(), De.value = !0, D.value = !1, C.value = Ne, !0;
      } catch (be) {
        return it.current(U) && (T.value = He(be, "Could not load settings.")), !1;
      } finally {
        it.current(U) && (kt.value = !1);
      }
    }
    let wt = () => {
    };
    ge(() => i.catalogId, (x) => {
      wt(), wt = dl(`component.${x}`, () => {
        !Ue.value && !ee.value ? Qe() : k.value === "Plugins" && !ee.value && ct();
      });
    }, { immediate: !0 });
    const yl = yt(async () => {
      !Ue.value && !ee.value ? await Qe() : k.value === "Plugins" && !ee.value && await ct();
    });
    Ke(() => {
      wt(), Ie.begin(), it.begin();
    });
    const { refreshPluginStatus: ct, resetPlugin: hl, resumePluginProjection: kl, clearShellBinding: _l } = dd({
      catalogId: () => i.catalogId,
      shouldPoll: () => yl.value !== !1 && k.value === "Plugins",
      schema: w,
      options: q,
      busy: ee,
      stale: D,
      editable: te,
      saved: C,
      clearError: () => {
        T.value = void 0;
      },
      reportError: Ct
    });
    ge(() => i.catalogId, () => {
      Ie.begin(), ee.value = !1, D.value = !1, w.value = null, q.value = null, xt(), Qe();
    });
    const wl = z(() => Object.values(Zt(L.value, le.value)).reduce((x, g) => x + (g?.length ?? 0), 0)), zt = z(() => !!w.value && (JSON.stringify(L.value) !== JSON.stringify(w.value.declaration) || wl.value > 0 || Object.keys(N.value).length > 0)), Ue = z(() => Te.value || zt.value || Object.keys(fe.value).length > 0);
    ge(Ue, (x) => n("dirty-changed", x), { immediate: !0 });
    const pt = z(() => L.value.families?.filter((x) => x.code !== "generic") ?? []), Bt = z(() => L.value.aspects ?? []), Mt = z(() => Bt.value.reduce((x, g) => x + (g.attributes?.length ?? 0), 0)), $l = z(() => {
      const x = new Set(L.value.plugins?.map((g) => g.use));
      return Object.values(w.value?.attributes ?? {}).filter((g) => g.plugin && x.has(g.plugin)).length;
    }), Cl = z(() => !Mt.value && !Bt.value.length && !pt.value.length), Lt = z(() => L.value.channels ?? []), xl = z(() => L.value.sources ?? []), Et = z(() => w.value?.plugins.filter((x) => x.active) ?? []), Wt = z(() => i.catalog?.product_count ?? i.catalog?.item_count), Vl = z(() => [
      {
        section: "Products",
        label: "Product setup",
        icon: "tabler:packages",
        summary: [
          ...typeof Wt.value == "number" ? [b(Wt.value, "product")] : [],
          b(pt.value.length, "family", "families"),
          b(Mt.value + $l.value, "field")
        ].join(" · "),
        detail: pt.value.map((x) => W(x.code)).join(", ") || "Create a family for products that share the same fields."
      },
      {
        section: "Values",
        label: "Allowed values",
        icon: "tabler:list-details",
        summary: [b(L.value.dimensions?.length ?? 0, "dimension"), b(L.value.vocabularies?.length ?? 0, "vocabulary", "vocabularies")].join(" · "),
        detail: L.value.dimensions?.map((x) => W(x.name)).join(", ") || "Add dimensions when values vary by language, region or another context."
      },
      {
        section: "Channels",
        label: "Publishing and imports",
        icon: "tabler:arrows-exchange",
        summary: [b(Lt.value.length, "channel"), b(xl.value.length, "source")].join(" · "),
        detail: "Publish products to channels and control incoming updates through sources."
      },
      {
        section: "Plugins",
        label: "Catalog tools",
        icon: "tabler:puzzle",
        summary: b(Et.value.length, "plugin") + " enabled",
        detail: Et.value.map((x) => ce(x.title, "Catalog plugin")).join(", ") || "Open Plugins to see which tools you can enable."
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
    }, Le = z(() => {
      const x = et(L.value), g = Zt(x, le.value);
      for (const [U, ae] of Object.entries(g)) {
        const de = x.remove ??= {};
        de[U] = [.../* @__PURE__ */ new Set([...de[U] ?? [], ...ae])];
      }
      return x;
    });
    function Ol(x) {
      const [g, U] = x.split(" ", 2);
      if (g === "plugin" && U) return ce(q.value?.plugins.find((re) => re.plugin === U)?.title, "Plugin");
      if (g === "scope" && U) return ce(q.value?.scopes.find((re) => re.id === U)?.title, "Product filter set");
      if (U) return ce(W(U), W(g)) + (g === "aspect" ? " field group" : "");
      if (x.startsWith("kickside.")) return "Catalog setting";
      const [ae, de] = x.split(".", 2);
      return de ? `${ce(W(de), "Field")} (${ce(W(ae), "Field group")})` : ce(W(x), "Catalog setting");
    }
    function Sl(x) {
      return x.startsWith("renamed from ") ? "Rename from " + W(x.slice(13)) : x.startsWith("config.") ? "Change " + W(x.slice(7)) : x.endsWith(" owning level") ? "Move a field to another variant level" : bl[x] ?? W(x);
    }
    const $t = z(() => {
      const x = Le.value.remove;
      return [
        ...x?.attributes?.length || x?.aspects?.length ? ["Removing fields deletes the values stored in those fields."] : [],
        ...x?.vocabularies?.length ? ["Removing a vocabulary deletes its saved terms."] : [],
        ...x?.channels?.length ? ["Removing a release destination withdraws products already published to it."] : []
      ];
    }), Ht = z(() => {
      const x = w.value?.declaration;
      return x ? [
        ...(L.value.channels ?? []).flatMap((g) => {
          const U = x.channels?.find((ae) => ae.id === g.id);
          return JSON.stringify(g) === JSON.stringify(U) ? [] : [{ subject: W(g.id), effect: U ? "Change which products can be released here and what they need first" : "Add a release destination" }];
        }),
        ...(Le.value.remove?.channels ?? []).map((g) => ({ subject: W(g), effect: "Remove this release destination" })),
        ...(L.value.sources ?? []).flatMap((g) => {
          const U = x.sources?.find((ae) => ae.id === g.id);
          return JSON.stringify(g) === JSON.stringify(U) ? [] : [{ subject: W(g.id), effect: U ? "Update how this source can send product data" : "Let this source send product updates" }];
        }),
        ...(Le.value.remove?.sources ?? []).map((g) => ({ subject: W(g), effect: "Stop accepting updates from this source" }))
      ] : [];
    }), Jt = z(() => {
      const x = Ze.value;
      if (!x) return [];
      const g = x.declaration.plugins?.filter((ae) => !w.value?.plugins.some((de) => de.plugin === ae.use && de.active)) ?? [];
      return [.../* @__PURE__ */ new Set([...g.map((ae) => ae.use), ...Object.keys(x.activeConfigs)])].flatMap((ae) => {
        const de = q.value?.plugins.find((Re) => Re.plugin === ae);
        if (!de || !Object.keys(de.config_schema.properties ?? {}).length) return [];
        const re = x.pluginConfigs[ae] ?? {}, be = Object.entries(re).map(([Re, Ne]) => bt(de.config_schema, Re) + " · " + rt(Ne));
        if (ae in x.activeConfigs) {
          const Re = w.value?.plugins.find((Ne) => Ne.plugin === ae)?.config ?? {};
          for (const Ne of Object.keys(Re))
            Ne in re || be.push(bt(de.config_schema, Ne) + " · Uses default");
        }
        return [{ id: ae, title: ce(de.title, "Plugin"), fields: be.length ? be : ["Uses defaults"] }];
      });
    });
    function Ct(x, g) {
      const U = He(x, g), ae = U.pluginConfig, de = q.value?.plugins.find((re) => re.installed && re.plugin === ae?.plugin);
      if (ae && de && L.value.plugins?.some((re) => re.use === ae.plugin)) {
        Se.value = ae, ve("Plugins");
        return;
      }
      T.value = U, U.code === Dl && (D.value = !0, Ae());
    }
    async function Ul() {
      if (!(Ue.value && !await tt.confirm({
        header: "Discard unsaved changes?",
        message: "Reloading will discard unsaved settings and plugin changes.",
        acceptLabel: "Discard and reload",
        rejectLabel: "Cancel"
      }))) {
        ee.value = !0, C.value = "";
        try {
          await Qe(!0);
        } finally {
          ee.value = !1;
        }
      }
    }
    async function Kt() {
      if (!w.value || !Ue.value || !De.value || D.value || ee.value || (Te.value && c.value !== "Plugins" && (ve("Plugins"), await qe()), Me.value && !Me.value.reportValidity())) return;
      const x = Ie.begin(), g = {
        ...pa(Le.value, w.value.schema_generation, fe.value),
        schemaChanges: zt.value,
        initialConfigs: et(N.value),
        activeConfigs: et(Object.fromEntries(Object.entries(fe.value).filter(([U]) => w.value?.plugins.some((ae) => ae.plugin === U && ae.active) && !Le.value.remove?.plugins?.includes(U))))
      };
      ee.value = !0, T.value = void 0;
      try {
        const U = g.schemaChanges ? await ye.planSchema(i.catalogId, g.declaration, g.generation, g.initialConfigs) : { generation: g.generation, class: "configuration", changes: [], refused: [] };
        if (!Ie.current(x) || !g.matches(Le.value, w.value.schema_generation, fe.value) || !De.value) return;
        Ze.value = g, Ye.value = !1, ue.value = U, we.value = !0, await qe(), Dt.value?.focus();
      } catch (U) {
        if (!Ie.current(x)) return;
        Ct(U, "Could not review the change."), Ae(), await qe(), O.value?.$el.focus();
      } finally {
        Ie.current(x) && (ee.value = !1);
      }
    }
    async function Al() {
      if (!w.value || !Ue.value || !Nt.value || !Ze.value) return;
      const x = i.catalogId, g = Ie.begin(), U = Ze.value, ae = () => x === i.catalogId && Ie.current(g);
      ee.value = !0, T.value = void 0, C.value = "";
      let de = !1;
      try {
        if (U.schemaChanges) {
          const re = await ye.applySchema(x, U.declaration, U.generation, U.initialConfigs);
          if (!ae()) return;
          const be = await Qe(!0, !0);
          if (!ae() || (n("applied", re.generation), !be)) return;
        }
        try {
          for (const [re, be] of Object.entries(U.activeConfigs)) {
            if (await ye.configurePlugin(x, re, be), !ae()) return;
            de = !0, delete fe.value[re];
          }
        } finally {
          de && ae() && await ct(!0);
        }
        if (!ae() || T.value) return;
        Se.value = void 0, C.value = "Catalog changes applied.";
      } catch (re) {
        if (!ae()) return;
        Ae(), Ct(re, "Could not apply the change."), await qe(), O.value?.$el.focus();
      } finally {
        Ie.current(g) && (ee.value = !1);
      }
    }
    async function Rl() {
      Ue.value && !await tt.confirm({
        header: "Leave this catalog?",
        message: "Your unsaved catalog changes will be discarded.",
        acceptLabel: "Discard and open settings",
        rejectLabel: "Keep editing"
      }) || (xt(), M.value = !1, tt.navigate("/system/settings"));
    }
    function Ae() {
      we.value = !1, Ze.value = null;
    }
    function Gt() {
      M.value = !1, De.value = !0;
    }
    function xt() {
      E.value = void 0, fe.value = {}, Te.value = !1, Ge.value++, Se.value = void 0, De.value = !0, w.value && (L.value = et(w.value.declaration)), le.value = {}, Ae(), C.value = "";
    }
    function Xe(x, g) {
      const U = le.value[x] ?? [];
      U.includes(g) || (le.value = { ...le.value, [x]: [...U, g] });
    }
    return (x, g) => (e(), s("section", {
      class: je(["pim-builder", { embedded: l.embedded }])
    }, [
      t("div", ur, [
        F.value || w.value && q.value ? (e(), R(na, {
          key: 0,
          ref_key: "rail",
          ref: Q,
          label: "Catalog settings sections",
          value: k.value,
          groups: j.value,
          "leading-item": F.value,
          "onUpdate:value": I
        }, null, 8, ["value", "groups", "leading-item"])) : u("", !0),
        t("div", cr, [
          t("section", {
            ref_key: "content",
            ref: y,
            class: "kx-main-scroll",
            "aria-label": k.value,
            tabindex: "-1"
          }, [
            w.value && q.value ? (e(), R(os, {
              key: 0,
              title: k.value,
              description: jl[k.value]
            }, $e({ _: 2 }, [
              te.value && Ue.value ? {
                name: "actions",
                fn: V(() => [
                  $(ds, {
                    busy: ee.value,
                    "review-disabled": !De.value || D.value,
                    onDiscard: xt,
                    onReview: Kt
                  }, null, 8, ["busy", "review-disabled"])
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : u("", !0),
            t("div", mr, [
              T.value ? (e(), R(ht, {
                key: 0,
                ref_key: "errorPanel",
                ref: O,
                error: T.value,
                tabindex: "-1"
              }, {
                default: V(() => [
                  D.value ? (e(), R(a(Y), {
                    key: 0,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: ee.value,
                    onClick: Ul
                  }, {
                    default: V(() => [...g[15] || (g[15] = [
                      X("Reload settings", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"])) : !w.value || !q.value ? (e(), R(a(Y), {
                    key: 1,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: g[0] || (g[0] = (U) => Qe())
                  }, {
                    default: V(() => [...g[16] || (g[16] = [
                      X("Retry", -1)
                    ])]),
                    _: 1
                  })) : u("", !0)
                ]),
                _: 1
              }, 8, ["error"])) : u("", !0),
              C.value ? (e(), R(a(Ve), {
                key: 1,
                severity: "success",
                role: "status"
              }, {
                default: V(() => [
                  X(h(C.value), 1)
                ]),
                _: 1
              })) : u("", !0),
              w.value?.rebuilding && k.value === "Overview" ? (e(), R(a(Ve), {
                key: 2,
                severity: "info",
                role: "status"
              }, {
                default: V(() => [...g[17] || (g[17] = [
                  X("Updating product readiness", -1)
                ])]),
                _: 1
              })) : u("", !0),
              kt.value && (!w.value || !q.value) ? (e(), s("div", vr, "Loading catalog settings…")) : w.value && q.value ? (e(), s("fieldset", {
                key: 4,
                class: "pim-editor-surface",
                disabled: ee.value,
                inert: ee.value
              }, [
                te.value ? u("", !0) : (e(), R(a(Ve), {
                  key: 0,
                  severity: "info"
                }, {
                  default: V(() => [...g[18] || (g[18] = [
                    X("You can view this catalog’s settings.", -1)
                  ])]),
                  _: 1
                })),
                c.value !== "Plugins" ? (e(), s("div", {
                  key: k.value,
                  class: "pim-ia-content"
                }, [
                  E.value && k.value === G.value ? (e(), s("div", gr, [
                    t("div", null, [
                      E.value.from === "Channels" ? (e(), s("p", br, "Open the family that defines what products need before release, then add a release requirement.")) : (e(), s("p", yr, "Add a field with a single value and no dimensions, such as Integer. When you return, select its group under Field groups."))
                    ]),
                    $(a(Y), {
                      type: "button",
                      severity: "secondary",
                      outlined: "",
                      size: "small",
                      onClick: r
                    }, {
                      default: V(() => [
                        $(a(oe), {
                          icon: "tabler:arrow-left",
                          "aria-hidden": "true"
                        }),
                        X(" Back to " + h(a(W)(E.value.id)), 1)
                      ]),
                      _: 1
                    })
                  ])) : u("", !0),
                  c.value === "General" && k.value === "History" ? (e(), R(as, {
                    key: 1,
                    "catalog-id": l.catalogId,
                    "can-resolve-actors": te.value
                  }, null, 8, ["catalog-id", "can-resolve-actors"])) : c.value === "General" ? (e(), s(Z, { key: 2 }, [
                    t("div", hr, [
                      (e(!0), s(Z, null, se(Vl.value, (U) => (e(), s("section", {
                        key: U.section,
                        class: "kx-card pim-overview-card"
                      }, [
                        t("span", kr, [
                          $(a(oe), {
                            icon: U.icon,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"])
                        ]),
                        t("div", _r, [
                          t("h3", wr, h(U.label), 1),
                          t("p", $r, h(U.summary), 1)
                        ]),
                        t("p", Cr, h(U.detail), 1),
                        t("div", xr, [
                          $(a(Y), {
                            type: "button",
                            text: "",
                            class: "pim-overview-action",
                            onClick: (ae) => ve(U.section)
                          }, {
                            default: V(() => [
                              X(h(U.section === "Products" ? Cl.value ? "Set up products" : "View families" : "View " + U.section.toLowerCase()) + " ", 1),
                              $(a(oe), {
                                icon: "tabler:arrow-right",
                                "aria-hidden": "true"
                              })
                            ]),
                            _: 2
                          }, 1032, ["onClick"]),
                          U.section === "Channels" ? (e(), R(a(Y), {
                            key: 0,
                            type: "button",
                            text: "",
                            class: "pim-overview-action",
                            onClick: g[1] || (g[1] = (ae) => ve("Channels", "Sources"))
                          }, {
                            default: V(() => [
                              g[19] || (g[19] = X(" Manage sources ", -1)),
                              $(a(oe), {
                                icon: "tabler:arrow-right",
                                "aria-hidden": "true"
                              })
                            ]),
                            _: 1
                          })) : u("", !0)
                        ])
                      ]))), 128))
                    ]),
                    $(Fe, { label: "Advanced" }, {
                      default: V(() => [
                        t("div", Vr, [
                          t("div", jr, [
                            g[20] || (g[20] = t("div", null, [
                              t("h3", null, "Application defaults"),
                              t("p", null, "Review the audit, retention and processing settings this catalog inherits.")
                            ], -1)),
                            $(a(Y), {
                              label: "View defaults",
                              severity: "secondary",
                              outlined: "",
                              onClick: g[2] || (g[2] = (U) => ie("defaults"))
                            })
                          ]),
                          t("div", Or, [
                            g[21] || (g[21] = t("div", null, [
                              t("h3", null, "Technical schema"),
                              t("p", null, "Inspect the complete definition, including integration keys and settings used by installed extensions.")
                            ], -1)),
                            $(a(Y), {
                              label: "Open declaration",
                              severity: "secondary",
                              outlined: "",
                              onClick: g[3] || (g[3] = (U) => ie("declaration"))
                            })
                          ])
                        ])
                      ]),
                      _: 1
                    })
                  ], 64)) : c.value === "Products" ? (e(), s(Z, { key: 3 }, [
                    k.value === "Families" ? (e(), R(eo, {
                      key: 0,
                      draft: L.value,
                      schema: w.value,
                      options: q.value,
                      onRemove: Xe,
                      onFields: K,
                      onVariantField: _
                    }, null, 8, ["draft", "schema", "options"])) : k.value === "Fields" ? (e(), R(Li, {
                      key: 1,
                      family: B.value,
                      "onUpdate:family": g[4] || (g[4] = (U) => B.value = U),
                      draft: L.value,
                      schema: w.value,
                      options: q.value,
                      onRemove: Xe,
                      onLayout: g[5] || (g[5] = (U) => ve("Products", "Form layout"))
                    }, null, 8, ["family", "draft", "schema", "options"])) : (e(), R(qa, {
                      key: 2,
                      draft: L.value,
                      schema: w.value,
                      types: q.value.types,
                      onFamilies: g[6] || (g[6] = (U) => ve("Products", "Families"))
                    }, null, 8, ["draft", "schema", "types"]))
                  ], 64)) : c.value === "Values" ? (e(), s(Z, { key: 4 }, [
                    k.value === "Dimensions" ? (e(), R(Xi, {
                      key: 0,
                      draft: L.value,
                      schema: w.value,
                      onRemove: Xe
                    }, null, 8, ["draft", "schema"])) : (e(), R(kn, {
                      key: 1,
                      "catalog-id": l.catalogId,
                      draft: L.value,
                      schema: w.value,
                      onRemove: Xe
                    }, null, 8, ["catalog-id", "draft", "schema"]))
                  ], 64)) : c.value === "Channels" ? (e(), R(zo, {
                    key: 5,
                    "catalog-id": l.catalogId,
                    draft: L.value,
                    schema: w.value,
                    view: k.value === "Sources" ? "sources" : "channels",
                    onRemove: Xe,
                    onRequirements: f
                  }, null, 8, ["catalog-id", "draft", "schema", "view"])) : c.value === "Access" ? (e(), R(ca, {
                    key: 6,
                    "catalog-id": l.catalogId,
                    title: l.title || "Catalog",
                    access: w.value.access
                  }, null, 8, ["catalog-id", "title", "access"])) : u("", !0)
                ])) : u("", !0),
                c.value === "Plugins" || Te.value ? Rt((e(), s("div", Sr, [
                  (e(), R(Hd, {
                    key: Ge.value,
                    ref_key: "pluginEditor",
                    ref: Me,
                    draft: L.value,
                    schema: w.value,
                    options: q.value,
                    "plugin-configs": fe.value,
                    refusal: Se.value,
                    stale: D.value,
                    onRemove: Xe,
                    onReset: a(hl),
                    onClearRefusal: g[7] || (g[7] = (U) => Se.value = void 0),
                    onInvalidDraft: g[8] || (g[8] = (U) => Te.value = U),
                    onRefresh: g[9] || (g[9] = (U) => a(ct)(!0)),
                    onResume: a(kl),
                    onReview: Kt,
                    onClearShellBinding: a(_l)
                  }, null, 8, ["draft", "schema", "options", "plugin-configs", "refusal", "stale", "onReset", "onResume", "onClearShellBinding"]))
                ], 512)), [
                  [Pt, c.value === "Plugins"]
                ]) : u("", !0),
                J.value ? (e(), R(ft, {
                  key: 3,
                  visible: M.value,
                  label: J.value === "defaults" ? "Application defaults" : "Technical schema",
                  onClose: Gt,
                  onClosed: g[12] || (g[12] = (U) => J.value = void 0)
                }, {
                  default: V(() => [
                    t("div", Ur, [
                      t("header", Ar, [
                        t("h2", null, h(J.value === "defaults" ? "Application defaults" : "Technical schema"), 1),
                        $(a(Y), {
                          type: "button",
                          "aria-label": "Close",
                          text: "",
                          severity: "secondary",
                          onClick: Gt
                        }, {
                          default: V(() => [
                            $(a(oe), {
                              icon: "tabler:x",
                              "aria-hidden": "true"
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      J.value === "defaults" ? (e(), s(Z, { key: 0 }, [
                        g[22] || (g[22] = t("p", { class: "muted" }, "These settings apply across the application. Catalogs with an explicit override keep their chosen value.", -1)),
                        $(sr, {
                          "catalog-id": l.catalogId,
                          draft: L.value,
                          disabled: !te.value,
                          "defaults-only": ""
                        }, null, 8, ["catalog-id", "draft", "disabled"]),
                        te.value ? (e(), s("div", Rr, [
                          $(a(Y), {
                            type: "button",
                            label: "Open application settings",
                            severity: "secondary",
                            outlined: "",
                            onClick: Rl
                          })
                        ])) : u("", !0)
                      ], 64)) : (e(), R(rr, {
                        key: 1,
                        draft: L.value,
                        readonly: !te.value,
                        onReplace: g[10] || (g[10] = (U) => L.value = U),
                        onValidity: g[11] || (g[11] = (U) => {
                          De.value = U, Ae();
                        })
                      }, null, 8, ["draft", "readonly"]))
                    ])
                  ]),
                  _: 1
                }, 8, ["visible", "label"])) : u("", !0)
              ], 8, fr)) : u("", !0),
              $(ft, {
                class: "pim-review-dialog",
                visible: we.value,
                busy: ee.value,
                label: "Review changes",
                onClose: Ae,
                onClosed: g[14] || (g[14] = (U) => ue.value = null)
              }, {
                default: V(() => [
                  ue.value ? (e(), s("section", {
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
                        t("p", null, "Check what will happen when you apply this draft to " + h(l.title || "the catalog") + ".", 1)
                      ]),
                      $(a(Y), {
                        type: "button",
                        "aria-label": "Close review",
                        disabled: ee.value,
                        text: "",
                        severity: "secondary",
                        onClick: Ae
                      }, {
                        default: V(() => [
                          $(a(oe), {
                            icon: "tabler:x",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ]),
                    t("div", qr, [
                      t("h3", null, h(ue.value.class === "configuration" ? "Plugin configuration" : gl[ue.value.class] || "Catalog changes"), 1),
                      ue.value.class === "configuration" ? (e(), s("p", Dr, "These settings will apply to the enabled plugins in this catalog.")) : ue.value.class === "unchanged" ? (e(), s("p", Nr, "The catalog already matches this draft.")) : ue.value.class === "initial" ? (e(), s("p", Fr, "Product editors will use these settings for new products.")) : ue.value.class === "cosmetic" ? (e(), s("p", zr, "Catalog settings will update. Stored product values are kept.")) : ue.value.class === "additive" ? (e(), s("p", Br, "The new options become available. Existing product values are kept.")) : ue.value.class === "semantic" ? (e(), s("p", Mr, "Applying changes can recalculate product values or release readiness across this catalog.")) : ue.value.class === "refused" ? (e(), R(a(Ve), {
                        key: 6,
                        severity: "error"
                      }, {
                        default: V(() => [
                          g[23] || (g[23] = X(" These changes can’t be applied. ", -1)),
                          ue.value.migration && ue.value.refused.some((U) => w.value?.attributes[U.code]) ? (e(), s("span", Lr, " To change how a field stores values, add a new field and copy the existing values into it. Then remove the original field and give the new field its name. ")) : u("", !0)
                        ]),
                        _: 1
                      })) : u("", !0)
                    ]),
                    Ft.value.length || Ht.value.length ? (e(), s("ul", Er, [
                      (e(!0), s(Z, null, se(Ft.value, (U, ae) => (e(), s("li", { key: ae }, [
                        U.class === "refused" ? (e(), R(a(_e), {
                          key: 0,
                          class: "kx-tag-sm small",
                          severity: "danger"
                        }, {
                          default: V(() => [...g[24] || (g[24] = [
                            X("Blocked", -1)
                          ])]),
                          _: 1
                        })) : u("", !0),
                        U.code ? (e(), s("strong", Wr, h(Ol(U.code)), 1)) : u("", !0),
                        t("span", null, h(Sl(U.what)), 1)
                      ]))), 128)),
                      (e(!0), s(Z, null, se(Ht.value, (U) => (e(), s("li", {
                        key: U.subject + U.effect
                      }, [
                        t("strong", null, h(U.subject), 1),
                        t("span", null, h(U.effect), 1)
                      ]))), 128))
                    ])) : u("", !0),
                    Jt.value.length ? (e(), s("ul", Hr, [
                      (e(!0), s(Z, null, se(Jt.value, (U) => (e(), s("li", {
                        key: U.id
                      }, [
                        t("strong", null, h(U.title), 1),
                        t("div", null, [
                          (e(!0), s(Z, null, se(U.fields, (ae, de) => (e(), s("p", { key: de }, h(ae), 1))), 128))
                        ])
                      ]))), 128))
                    ])) : u("", !0),
                    $t.value.length ? (e(), s("div", Jr, [
                      g[25] || (g[25] = t("h3", null, "Permanent changes", -1)),
                      (e(!0), s(Z, null, se($t.value, (U) => (e(), s("p", { key: U }, h(U), 1))), 128)),
                      ue.value.class !== "refused" ? (e(), s("div", Kr, [
                        $(a(Yl), {
                          modelValue: Ye.value,
                          "onUpdate:modelValue": g[13] || (g[13] = (U) => Ye.value = U),
                          "input-id": a(ut) + "-acknowledge",
                          binary: "",
                          disabled: ee.value
                        }, null, 8, ["modelValue", "input-id", "disabled"]),
                        t("label", {
                          for: a(ut) + "-acknowledge"
                        }, "I understand the effects of these removals", 8, Gr)
                      ])) : u("", !0)
                    ])) : u("", !0),
                    t("footer", Yr, [
                      $(a(Y), {
                        type: "button",
                        label: "Back to editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: ee.value,
                        onClick: Ae
                      }, null, 8, ["disabled"]),
                      w.value?.access.admin && ue.value.class !== "refused" ? (e(), R(a(Y), {
                        key: 0,
                        disabled: !Ue.value || ee.value || !Nt.value,
                        loading: ee.value,
                        onClick: Al
                      }, {
                        default: V(() => [
                          X(h(k.value === "Form layout" ? "Apply layout" : "Apply changes"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled", "loading"])) : u("", !0)
                    ])
                  ], 8, Pr)) : u("", !0)
                ]),
                _: 1
              }, 8, ["visible", "busy"])
            ])
          ], 8, pr)
        ])
      ])
    ], 2));
  }
}), Qr = /* @__PURE__ */ pe({
  __name: "SettingsApp",
  setup(l) {
    const m = Nl(), i = Fl(), n = H(), o = z(() => m.value.catalogId ?? ""), d = Je();
    async function v() {
      const k = d.begin(), B = o.value;
      try {
        const E = await ye.catalogSummary(B);
        d.current(k) && (n.value = E);
      } catch {
        d.current(k) && (n.value = void 0);
      }
    }
    ge(o, () => {
      n.value = void 0, v();
    }), yt(v), Ke(() => {
      d.begin();
    });
    function c() {
      m.value.embedded ? i("open-catalog-picker", {}) : i("navigate", { route: "" });
    }
    return (k, B) => o.value ? (e(), R(Zr, {
      key: o.value,
      "catalog-id": o.value,
      title: n.value?.title || "Catalog",
      catalog: n.value,
      embedded: a(m).embedded,
      "focus-back": a(m).focusBack,
      route: a(m).route,
      onNavigate: B[0] || (B[0] = (E) => a(i)("navigate", { route: E })),
      "back-label": a(m).embedded ? "Back to catalogs" : "Back to catalog settings",
      onBack: c,
      onDirtyChanged: B[1] || (B[1] = (E) => a(i)("dirty-change", { dirty: E }))
    }, null, 8, ["catalog-id", "title", "catalog", "embedded", "focus-back", "route", "back-label"])) : u("", !0);
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
