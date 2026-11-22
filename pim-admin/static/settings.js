import { c as cl, u as ua, r as Je, e as Da, d as ml, a as ca, p as fe, b as Fe, f as Re, _ as oa, g as pl, S as vl, h as fl, i as bl, W as yl, s as gl, P as hl } from "./styles-B04GGVk1.js";
import { defineComponent as re, computed as q, openBlock as e, createBlock as T, resolveDynamicComponent as za, normalizeProps as kl, guardReactiveProps as _l, createSlots as he, withCtx as h, createElementVNode as a, normalizeClass as xe, createElementBlock as i, Fragment as E, renderList as ae, toDisplayString as k, createCommentVNode as f, unref as s, renderSlot as Ce, ref as Y, onUnmounted as Ye, createVNode as v, createStaticVNode as wl, createTextVNode as K, withModifiers as Oe, normalizeStyle as ya, useId as qe, watch as be, withKeys as la, nextTick as Ke, provide as $l, inject as Cl, useModel as Ba, Transition as xl, mergeModels as ga, toRaw as Vl, onMounted as La, mergeProps as Ul } from "vue";
import { Icon as le } from "@iconify/vue";
import ge from "primevue/tag";
import Z from "primevue/button";
import jl from "primevue/checkbox";
import we from "primevue/message";
import { api as Al, on as Fa, host as He, loadByTagName as Sl, define as Rl } from "@wippy-fe/proxy";
import wa from "primevue/selectbutton";
import Ge from "primevue/inputtext";
import Ea from "primevue/multiselect";
import ta from "primevue/toggleswitch";
import _e from "primevue/select";
import Ol from "primevue/inputnumber";
import Il from "primevue/textarea";
const Tl = ["aria-label"], Pl = {
  key: 0,
  class: "kx-settings-rail-group"
}, ql = ["aria-current", "onClick"], Nl = { class: "kx-settings-rail-label" }, Dl = /* @__PURE__ */ re({
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
    const b = l, t = q(() => b.leadingItem ? [{ items: [b.leadingItem] }, ...b.groups] : b.groups);
    function o(p) {
      const u = [...p.currentTarget.querySelectorAll(".kx-settings-rail-item")], y = u.indexOf(p.target);
      if (y < 0) return;
      let m;
      switch (p.key) {
        case "ArrowDown":
        case "ArrowRight":
          m = (y + 1) % u.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          m = (y + u.length - 1) % u.length;
          break;
        case "Home":
          m = 0;
          break;
        case "End":
          m = u.length - 1;
          break;
        default:
          return;
      }
      p.preventDefault(), u[m]?.focus();
    }
    return (p, u) => (e(), T(za(l.title ? cl : "div"), kl(_l(l.title ? { title: l.title, count: l.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), he({
      default: h(() => [
        a("nav", {
          class: xe(["kx-settings-rail", { "kx-settings-rail-framed": l.title }]),
          "aria-label": l.label,
          onKeydown: o
        }, [
          (e(!0), i(E, null, ae(t.value, (y, m) => (e(), i("div", {
            key: y.items[0]?.value ?? m,
            class: xe(["kx-settings-rail-section", { "kx-settings-rail-leading": l.leadingItem && m === 0 }])
          }, [
            y.heading ? (e(), i("div", Pl, k(y.heading), 1)) : f("", !0),
            (e(!0), i(E, null, ae(y.items, (V) => (e(), i("button", {
              key: V.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": V.value === l.value ? "true" : void 0,
              onClick: (N) => p.$emit("update:value", V.value)
            }, [
              V.icon ? (e(), T(s(le), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: V.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : f("", !0),
              a("span", Nl, k(V.label), 1)
            ], 8, ql))), 128))
          ], 2))), 128))
        ], 42, Tl)
      ]),
      _: 2
    }, [
      l.title && p.$slots.actions ? {
        name: "actions",
        fn: h(() => [
          Ce(p.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), zl = { class: "pim-stack" }, Bl = { class: "form pim-access-card pim-ia-action" }, Ll = { class: "pim-access-summary" }, Fl = ["config"], El = /* @__PURE__ */ re({
  __name: "CatalogShare",
  props: {
    catalogId: {},
    title: {},
    access: {}
  },
  setup(l) {
    const b = l, t = Y(!1), o = Y(!1), p = Y(""), u = Y(), y = Y(!1), m = Je(), V = q(() => "/api/v1/component-access/grants/" + encodeURIComponent(b.catalogId)), N = q(() => JSON.stringify({
      resource_id: b.catalogId,
      title: b.title,
      access_url: V.value,
      share_url: "/api/v1/component-access/share/" + encodeURIComponent(b.catalogId)
    })), L = q(() => {
      if (!b.access.admin) return "Only catalog administrators can manage sharing.";
      if (!u.value) return y.value ? "Member counts are unavailable." : "Loading members…";
      const { people: x, groups: r } = u.value;
      return x + (x === 1 ? " person" : " people") + " and " + r + (r === 1 ? " group" : " groups") + " with direct access";
    });
    async function J() {
      if (!b.access.admin) return;
      const x = m.begin();
      y.value = !1;
      try {
        const { data: r } = await Al.get(V.value);
        if (!m.current(x)) return;
        if (!r?.success || !Array.isArray(r.access)) throw new Error("Grants unavailable");
        const w = r.access.filter((d) => d.subject_type === "group").length;
        u.value = { people: r.access.length - w, groups: w };
      } catch {
        m.current(x) && (u.value = void 0, y.value = !0);
      }
    }
    ua(J), Ye(() => {
      m.begin();
    });
    async function H() {
      o.value = !0, p.value = "", await Da("kickside-share") ? t.value = !0 : p.value = "Could not open sharing. Try again.", o.value = !1;
    }
    return (x, r) => (e(), i("div", zl, [
      a("section", Bl, [
        a("div", null, [
          r[1] || (r[1] = a("h3", null, "Members and sharing", -1)),
          a("p", Ll, k(L.value), 1)
        ]),
        l.access.admin ? (e(), T(s(Z), {
          key: 0,
          type: "button",
          label: "Share catalog",
          loading: o.value,
          onClick: H
        }, {
          icon: h(() => [
            v(s(le), {
              icon: "tabler:share",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : f("", !0),
        y.value ? (e(), T(s(Z), {
          key: 1,
          type: "button",
          label: "Reload member counts",
          severity: "secondary",
          text: "",
          onClick: J
        })) : f("", !0)
      ]),
      r[2] || (r[2] = wl('<section class="form pim-access-card pim-stack" aria-labelledby="pim-access-roles-heading"><h3 id="pim-access-roles-heading">What members can do</h3><dl class="pim-access-roles"><div><dt>Read</dt><dd>View products and their details.</dd></div><div><dt>Write</dt><dd>Create products and update their values.</dd></div><div><dt>Delete</dt><dd>Move products to trash.</dd></div><div><dt>Admin</dt><dd>Manage catalog settings and who has access.</dd></div></dl></section>', 1)),
      t.value ? (e(), i("kickside-share", {
        key: 0,
        config: N.value,
        onClose: r[0] || (r[0] = (w) => t.value = !1),
        onChanged: J
      }, null, 40, Fl)) : f("", !0),
      p.value ? (e(), T(s(we), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: h(() => [
          K(k(p.value), 1)
        ]),
        _: 1
      })) : f("", !0)
    ]));
  }
});
function Ml(l, b, t = {}) {
  const o = JSON.stringify(l), p = JSON.stringify(t);
  return {
    declaration: JSON.parse(o),
    generation: b,
    pluginConfigs: JSON.parse(p),
    matches: (u, y, m = {}) => b === y && o === JSON.stringify(u) && p === JSON.stringify(m)
  };
}
function Pa(l, b) {
  const t = {};
  for (const [o, p] of Object.entries(b)) {
    const u = p.filter((y) => o === "plugins" ? !l.plugins?.some((m) => m.use === y) : o === "scopes" ? !l.scopes?.includes(y) : o === "attributes" ? !l.aspects?.some((m) => m.attributes?.some((V) => m.namespace + "." + V.code === y)) : o === "aspects" ? !l.aspects?.some((m) => m.namespace === y) : o === "dimensions" ? !l.dimensions?.some((m) => m.name === y) : o === "vocabularies" || o === "families" ? !l[o]?.some((m) => m.code === y) : !l[o]?.some((m) => m.id === y));
    u.length && (t[o] = u);
  }
  return t;
}
const qa = (l) => !!l && typeof l == "object" && !Array.isArray(l), de = ["string"], Ma = { "*": "string" }, Wl = { id: "number", code: "string!", type: "string!", scope: de, cardinality: "string", index: "string", index_contexts: [Ma], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, Hl = {
  dimensions: [{ name: "string!", members: de, fallback: { "*": de } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: de }, attributes: [Wl] }],
  families: [{ code: "string!", aspects: de, variation: [{ axes: de, own: de }], requirements: [{ id: "string!", context: Ma, require: de, authored: de }], checks: [{ check: "string!", reads: de, cost: "string", config: "object", enforce: "string" }] }],
  sources: [{ id: "string!", ordering: "string", writes: de, principals: de, audit: "boolean" }],
  channels: [{ id: "string!", requirements: de, families: de }],
  plugins: [{ use: "string!", schema: "json" }],
  scopes: de,
  policy: { "*": "policy" },
  remove: { dimensions: de, vocabularies: de, aspects: de, families: de, sources: de, channels: de, attributes: de, scopes: de, plugins: de }
};
function ha(l, b, t) {
  if (typeof b == "string") {
    const o = b.replace("!", "");
    if (!(o === "json" || (o === "object" ? qa(l) : o === "policy" ? l === !1 || typeof l == "string" || typeof l == "number" : typeof l === o)) || b.endsWith("!") && (typeof l != "string" || !l.trim())) throw new Error(`${t} has an invalid ${o} value.`);
  } else if (Array.isArray(b)) {
    if (!Array.isArray(l)) throw new Error(`${t} must be an array.`);
    l.forEach((o, p) => ha(o, b[0], `${t}[${p}]`));
  } else {
    if (!qa(l)) throw new Error(`${t} must be an object.`);
    for (const [o, p] of Object.entries(b)) if (typeof p == "string" && p.endsWith("!") && l[o] === void 0) throw new Error(`${t}.${o} is required.`);
    for (const [o, p] of Object.entries(l)) {
      const u = b[o] ?? b["*"];
      if (!u) throw new Error(`${t}.${o} is not an editor field.`);
      ha(p, u, `${t}.${o}`);
    }
  }
}
function Jl(l) {
  const b = JSON.parse(l);
  ha(b, Hl, "Declaration");
  const t = b;
  for (const o of t.dimensions ?? []) o.members ??= [];
  return t;
}
function ea(l) {
  return JSON.parse(JSON.stringify(l));
}
const Na = /^[a-z][a-z0-9_]*$/;
function Kl(l) {
  return l.trim().normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function Le(l, b, t) {
  t.length ? l[b] = t : delete l[b];
}
function ia(l, b, t) {
  if (t < 0 || t >= l.length || b === t) return;
  const [o] = l.splice(b, 1);
  l.splice(t, 0, o);
}
function ne(l, b) {
  return !l || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(l) ? b : l;
}
function aa(l) {
  return l ? ne(l.title, "Field type") : "Unknown type";
}
async function Wa(l, b) {
  const t = [...new Set(b)].map((p) => ({ type: "user", id: p }));
  if (!t.length) return {};
  const o = await ml(`/api/v1/pim-admin/catalogs/${encodeURIComponent(l)}/principal_labels`, { refs: t }, "People");
  return Object.fromEntries((o.principals ?? []).map((p) => [p.id, ne(p.label, "Person")]));
}
const na = [
  { value: "quarter", label: "¼", span: 3 },
  { value: "third", label: "⅓", span: 4 },
  { value: "half", label: "½", span: 6 },
  { value: "full", label: "1", span: 12 }
];
function ka(l, b, t) {
  return t.width ?? l.attributes[b + "." + t.code]?.width ?? "half";
}
const Gl = (l) => new Date(l).toLocaleString();
function _a(l) {
  const b = Math.abs(l.m).toString(), t = l.m < 0 ? "-" : "";
  if (l.e >= 0) return t + b + "0".repeat(l.e);
  const o = -l.e, p = b.padStart(o + 1, "0");
  return t + p.slice(0, p.length - o) + "." + p.slice(p.length - o);
}
function B(l) {
  const t = (l.includes(".") ? l.slice(l.indexOf(".") + 1) : l).replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : l;
}
function da(l, b) {
  const t = l.properties;
  return ne(t?.[b]?.title, ne(B(b), "This setting"));
}
function Be(l) {
  return l.labels.en ?? Object.values(l.labels)[0] ?? l.code;
}
function ra(l, b) {
  if (l == null) return "";
  const t = (o) => {
    if (o == null) return "";
    if (typeof o == "object" && "ref" in o) {
      const p = o;
      if (p.ref[0] === "term") {
        const u = p.ref[1].slice(p.ref[1].indexOf(":") + 1), y = p.ref[1].slice(0, p.ref[1].indexOf(":")), m = b?.[y]?.find((V) => V.code === u);
        return m ? Be(m) : u;
      }
      return "Linked " + B(p.ref[0]).toLocaleLowerCase();
    }
    if (typeof o == "object" && "v" in o) {
      const p = o;
      return _a(p.v) + " " + p.u;
    }
    return typeof o == "object" && "m" in o ? _a(o) : typeof o == "boolean" ? o ? "Yes" : "No" : typeof o == "object" ? JSON.stringify(o) : ne(String(o), "Linked record");
  };
  return Array.isArray(l) ? l.map(t).join(", ") : t(l);
}
function Yl(l, b, t) {
  const o = ra(b), p = ra(t);
  return !p && o ? `${l} cleared (was ${o})` : o ? `${l}: ${o} → ${p}` : `${l} set to ${p}`;
}
const Zl = { class: "pim-table form pim-layout" }, Ql = {
  key: 0,
  class: "pim-layout-help muted"
}, Xl = {
  key: 1,
  class: "kx-empty"
}, et = { class: "pim-aspect-head" }, at = {
  key: 0,
  class: "muted small"
}, lt = ["draggable", "onDragstart", "onDragover", "onDrop"], tt = { class: "pim-lcard-top" }, st = {
  key: 0,
  class: "pim-grip",
  "aria-hidden": "true"
}, it = { class: "pim-lcard-name" }, nt = { class: "pim-lcard-type" }, ot = {
  key: 1,
  class: "pim-lcard-move"
}, dt = { class: "pim-aspect-head" }, rt = { class: "pim-canvas" }, ut = { class: "pim-lcard-top" }, ct = { class: "pim-lcard-name" }, mt = { class: "pim-lcard-type" }, pt = /* @__PURE__ */ re({
  __name: "LayoutEditor",
  props: {
    draft: {},
    schema: {},
    types: {}
  },
  setup(l) {
    const b = l, t = q(() => b.schema.access.admin), o = q(() => b.draft?.aspects ?? []), p = q(() => new Map(b.types.map((x) => [x.id, aa(x)]))), u = q(() => {
      if (!b.schema) return [];
      const x = new Set((b.draft?.aspects ?? []).map((w) => w.namespace)), r = /* @__PURE__ */ new Map();
      for (const [w, d] of Object.entries(b.schema.attributes)) {
        const S = w.split(".")[0];
        x.has(S) || !d.plugin || (r.has(S) || r.set(S, { aspect: S, plugin: d.plugin, codes: [] }), r.get(S).codes.push(w));
      }
      return [...r.values()];
    });
    function y(x, r) {
      return na.find((w) => w.value === ka(b.schema, x, r))?.span ?? 6;
    }
    const m = Y(null), V = Y(null);
    function N(x, r, w) {
      t.value && (m.value = { ns: x, index: r }, w.dataTransfer?.setData("text/plain", x + ":" + r), w.dataTransfer && (w.dataTransfer.effectAllowed = "move"));
    }
    function L(x, r, w) {
      !m.value || m.value.ns !== x || (w.preventDefault(), V.value = { ns: x, index: r });
    }
    function J(x, r) {
      t.value && m.value?.ns === x.namespace && ia(x.attributes ?? [], m.value.index, r), m.value = null, V.value = null;
    }
    function H() {
      m.value = null, V.value = null;
    }
    return (x, r) => (e(), i("div", Zl, [
      t.value ? (e(), i("p", Ql, "Arrange fields within each group and choose their widths. Review changes before applying the layout.")) : f("", !0),
      o.value.length === 0 ? (e(), i("div", Xl, [
        r[1] || (r[1] = K("This catalog has no field groups yet.", -1)),
        t.value ? (e(), i(E, { key: 0 }, [
          K(" Add a field group in Fields.")
        ], 64)) : f("", !0)
      ])) : f("", !0),
      (e(!0), i(E, null, ae(o.value, (w) => (e(), i("section", {
        key: w.namespace,
        class: "pim-aspect"
      }, [
        a("header", et, [
          a("h3", null, k(s(B)(w.namespace)), 1),
          t.value ? (e(), i("span", at, "drag a field, or use its arrows")) : f("", !0)
        ]),
        a("div", {
          class: "pim-canvas",
          onDragover: r[0] || (r[0] = Oe(() => {
          }, ["prevent"]))
        }, [
          (e(!0), i(E, null, ae(w.attributes ?? [], (d, S) => (e(), i("div", {
            key: d.code,
            class: xe(["pim-lcard", { dragging: m.value?.ns === w.namespace && m.value?.index === S, over: V.value?.ns === w.namespace && V.value?.index === S }]),
            style: ya({ gridColumn: "span " + y(w.namespace, d) }),
            draggable: t.value,
            onDragstart: (O) => N(w.namespace, S, O),
            onDragover: (O) => L(w.namespace, S, O),
            onDrop: Oe((O) => J(w, S), ["prevent"]),
            onDragend: H
          }, [
            a("div", tt, [
              t.value ? (e(), i("span", st, [
                v(s(le), { icon: "tabler:grip-vertical" })
              ])) : f("", !0),
              a("span", it, k(s(B)(d.code)), 1),
              a("span", nt, k(p.value.get(d.type) ?? s(aa)(void 0)), 1),
              t.value ? (e(), i("span", ot, [
                v(s(Z), {
                  type: "button",
                  disabled: S === 0,
                  "aria-label": "Move " + s(B)(d.code) + " earlier",
                  onClick: (O) => s(ia)(w.attributes ?? [], S, S - 1),
                  class: "kx-iconbtn sm",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: h(() => [
                    v(s(le), { icon: "tabler:arrow-left" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                v(s(Z), {
                  type: "button",
                  disabled: S === (w.attributes ?? []).length - 1,
                  "aria-label": "Move " + s(B)(d.code) + " later",
                  onClick: (O) => s(ia)(w.attributes ?? [], S, S + 1),
                  class: "kx-iconbtn sm",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: h(() => [
                    v(s(le), { icon: "tabler:arrow-right" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ])) : f("", !0)
            ]),
            v(s(wa), {
              disabled: !t.value,
              "model-value": s(ka)(l.schema, w.namespace, d),
              options: s(na),
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Width of " + s(B)(d.code),
              "onUpdate:modelValue": (O) => d.width = O
            }, null, 8, ["disabled", "model-value", "options", "aria-label", "onUpdate:modelValue"])
          ], 46, lt))), 128))
        ], 32)
      ]))), 128)),
      (e(!0), i(E, null, ae(u.value, (w) => (e(), i("section", {
        key: w.aspect,
        class: "pim-aspect"
      }, [
        a("header", dt, [
          a("h3", null, k(s(B)(w.aspect)), 1),
          r[2] || (r[2] = a("span", { class: "muted small" }, "Provided by a plugin", -1))
        ]),
        a("div", rt, [
          (e(!0), i(E, null, ae(w.codes, (d) => (e(), i("div", {
            key: d,
            class: "pim-lcard fixed",
            style: ya({ gridColumn: "span " + (s(na).find((S) => S.value === l.schema.attributes[d].width)?.span ?? 6) })
          }, [
            a("div", ut, [
              a("span", ct, k(s(B)(d)), 1),
              a("span", mt, k(p.value.get(l.schema.attributes[d].type) ?? s(aa)(void 0)), 1)
            ])
          ], 4))), 128))
        ])
      ]))), 128))
    ]));
  }
}), vt = {
  class: "pim-history",
  "aria-label": "Catalog history"
}, ft = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, bt = { class: "pim-table pim-responsive-table" }, yt = ["id"], gt = ["aria-labelledby"], ht = {
  key: 0,
  scope: "col"
}, kt = { class: "muted small" }, _t = ["datetime"], wt = {
  key: 0,
  class: "small"
}, $t = {
  key: 0,
  class: "muted"
}, Ct = { class: "mono small" }, xt = {
  key: 0,
  class: "muted"
}, Vt = {
  key: 0,
  class: "muted small"
}, Ut = ["aria-labelledby"], jt = { class: "pim-stacked-meta muted small" }, At = { key: 0 }, St = { key: 1 }, Rt = ["datetime"], Ot = {
  key: 1,
  class: "kx-empty"
}, It = { class: "pim-table-foot" }, Tt = /* @__PURE__ */ re({
  __name: "HistoryPanel",
  props: {
    catalogId: {},
    canResolveActors: { type: Boolean }
  },
  setup(l) {
    const b = l, t = Y([]), o = Y({}), p = Y(), u = Y(!1), y = Y(), m = Je(), V = qe(), N = q(() => t.value.map((r) => ({
      key: `${r.seq}:${r.n}`,
      at: r.at,
      date: Gl(r.at),
      actor: o.value[r.actor] ?? ne(r.actor, "Person"),
      source: r.source ? ne(B(r.source), "Data source") : "",
      product: J(r),
      context: r.ctx ? ne(r.ctx, "Product context") : "",
      change: H(r)
    })));
    async function L(r = !1) {
      const w = m.begin();
      u.value = !0, y.value = void 0;
      try {
        const d = await fe.history(b.catalogId, { limit: 50, before: r ? p.value : void 0 });
        if (!m.current(w)) return;
        if (t.value = r ? [...t.value, ...d.entries] : d.entries, p.value = d.next, b.canResolveActors)
          try {
            const S = await Wa(b.catalogId, d.entries.map((O) => O.actor));
            m.current(w) && (o.value = { ...o.value, ...S });
          } catch {
          }
      } catch (d) {
        if (!m.current(w)) return;
        y.value = Fe(d, "Could not load the history.");
      } finally {
        m.current(w) && (u.value = !1);
      }
    }
    function J(r) {
      return r.sku ? r.sku : r.subject.startsWith("p:") ? "purged product" : r.subject.startsWith("t:") ? r.subject.slice(2) : r.subject.startsWith("r:") ? "Release" : ne(r.subject, "Catalog");
    }
    function H(r) {
      if (r.attribute)
        return Yl(B(r.attribute), r.before, r.after);
      switch (r.kind) {
        case "schema":
          return "Catalog settings applied";
        case "term": {
          const w = r.after ?? {}, d = w.labels?.en ?? Object.values(w.labels ?? {})[0];
          return w.retired ? "Term retired" : d ? `Term labelled "${d}"` + (w.parent ? ` under ${w.parent}` : "") : "Term changed";
        }
        case "created": {
          const w = r.after ?? {};
          return `Created as ${B(w.family ?? "product")}` + (w.level ? ` at level ${w.level}` : "");
        }
        case "released": {
          const w = r.after ?? {};
          return `Released v${w.version ?? ""} to ${(w.channels ?? []).join(", ")}`;
        }
        case "withdrawn":
          return `Withdrawn from ${((r.after ?? {}).channels ?? []).join(", ")}`;
        case "status":
          return `Status ${String(r.before ?? "")} → ${String(r.after ?? "")}`;
        case "moved":
          return "Moved under another parent";
        default:
          return B(r.kind);
      }
    }
    let x = () => {
    };
    return be(() => b.catalogId, () => {
      x(), m.begin(), t.value = [], o.value = {}, p.value = void 0, y.value = void 0, x = Fa(`component.${b.catalogId}`, () => {
        L();
      });
    }, { immediate: !0 }), be(() => b.catalogId, () => {
      L();
    }), ua(() => L()), Ye(() => {
      x(), m.begin();
    }), (r, w) => (e(), i("section", vt, [
      y.value ? (e(), T(ca, {
        key: 0,
        error: y.value
      }, {
        default: h(() => [
          v(s(Z), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: w[0] || (w[0] = (d) => L())
          }, {
            default: h(() => [...w[2] || (w[2] = [
              K("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : f("", !0),
      u.value ? (e(), i("div", ft, "Loading history…")) : f("", !0),
      a("div", bt, [
        a("p", {
          id: s(V),
          class: "pim-history-caption muted small"
        }, "Catalog changes, newest first", 8, yt),
        N.value.length ? (e(), i(E, { key: 0 }, [
          a("table", {
            class: "pim-grid",
            "aria-labelledby": s(V)
          }, [
            a("thead", null, [
              a("tr", null, [
                w[3] || (w[3] = a("th", { scope: "col" }, "When", -1)),
                l.canResolveActors ? (e(), i("th", ht, "Who")) : f("", !0),
                w[4] || (w[4] = a("th", { scope: "col" }, "What", -1)),
                w[5] || (w[5] = a("th", { scope: "col" }, "Change", -1))
              ])
            ]),
            a("tbody", null, [
              (e(!0), i(E, null, ae(N.value, (d) => (e(), i("tr", {
                key: d.key
              }, [
                a("td", kt, [
                  a("time", {
                    datetime: d.at
                  }, k(d.date), 9, _t)
                ]),
                l.canResolveActors ? (e(), i("td", wt, [
                  K(k(d.actor), 1),
                  d.source ? (e(), i("span", $t, " via " + k(d.source), 1)) : f("", !0)
                ])) : f("", !0),
                a("td", Ct, [
                  K(k(d.product), 1),
                  d.context ? (e(), i("span", xt, " · " + k(d.context), 1)) : f("", !0)
                ]),
                a("td", null, [
                  K(k(d.change), 1),
                  !l.canResolveActors && d.source ? (e(), i("span", Vt, " via " + k(d.source), 1)) : f("", !0)
                ])
              ]))), 128))
            ])
          ], 8, gt),
          a("ol", {
            role: "list",
            class: "pim-stacked-list",
            "aria-labelledby": s(V)
          }, [
            (e(!0), i(E, null, ae(N.value, (d) => (e(), i("li", {
              key: d.key,
              class: "pim-stacked-row"
            }, [
              a("div", null, k(d.change), 1),
              a("div", jt, [
                l.canResolveActors ? (e(), i("span", At, [
                  a("span", null, k(d.actor), 1),
                  d.source ? (e(), i(E, { key: 0 }, [
                    K(" via " + k(d.source), 1)
                  ], 64)) : f("", !0)
                ])) : d.source ? (e(), i("span", St, "Via " + k(d.source), 1)) : f("", !0),
                a("time", {
                  datetime: d.at
                }, k(d.date), 9, Rt),
                a("span", null, [
                  K(k(d.product), 1),
                  d.context ? (e(), i(E, { key: 0 }, [
                    K(" · " + k(d.context), 1)
                  ], 64)) : f("", !0)
                ])
              ])
            ]))), 128))
          ], 8, Ut)
        ], 64)) : !u.value && !y.value ? (e(), i("div", Ot, "Nothing recorded yet.")) : f("", !0),
        a("div", It, [
          a("span", null, k(N.value.length) + " change" + k(N.value.length === 1 ? "" : "s") + " shown", 1),
          p.value ? (e(), T(s(Z), {
            key: 0,
            type: "button",
            disabled: u.value,
            onClick: w[1] || (w[1] = (d) => L(!0)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: h(() => [
              v(s(le), {
                icon: "tabler:adjustments",
                "aria-hidden": "true"
              }),
              w[6] || (w[6] = K(" Load older", -1))
            ]),
            _: 1
          }, 8, ["disabled"])) : f("", !0)
        ])
      ])
    ]));
  }
}), Pt = { class: "system-section-head" }, qt = { class: "system-section-head-text" }, Nt = {
  key: 0,
  class: "kx-head-actions"
}, Dt = /* @__PURE__ */ re({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(l) {
    return (b, t) => (e(), i("header", Pt, [
      a("div", qt, [
        a("h1", null, k(l.title), 1),
        a("p", null, k(l.description), 1)
      ]),
      b.$slots.actions ? (e(), i("div", Nt, [
        Ce(b.$slots, "actions")
      ])) : f("", !0)
    ]));
  }
}), zt = /* @__PURE__ */ re({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(l) {
    return (b, t) => (e(), i(E, null, [
      v(s(ge), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      v(s(Z), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: l.busy || l.discardDisabled,
        onClick: t[0] || (t[0] = (o) => b.$emit("discard"))
      }, {
        icon: h(() => [
          v(s(le), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      v(s(Z), {
        label: "Review changes",
        type: "button",
        disabled: l.busy || l.reviewDisabled,
        loading: l.busy,
        onClick: t[1] || (t[1] = (o) => b.$emit("review", o.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), Bt = ["onKeydown"], Lt = { class: "row pim-add-actions" }, Ft = ["id"], Ie = /* @__PURE__ */ re({
  __name: "AddSchemaCode",
  props: {
    label: {},
    action: {},
    existing: {},
    fromName: { type: Boolean },
    regular: { type: Boolean }
  },
  emits: ["add"],
  setup(l, { emit: b }) {
    const t = l, o = b, p = Y(""), u = Y(!1), y = Y(), m = qe(), V = q(() => {
      const r = p.value.trim();
      return t.fromName ? Kl(r) : r;
    }), N = q(() => p.value.trim() ? t.existing?.includes(V.value) ? t.fromName ? "This name is already in use." : "This code is already in use." : t.fromName && !Na.test(V.value) ? "Use a name that starts with a letter from A to Z." : Na.test(V.value) ? "" : "Start with a lowercase letter and use only lowercase letters, numbers or underscores." : ""), L = q(() => !!V.value && !N.value);
    async function J() {
      u.value = !0, await Ke(), y.value?.querySelector("input")?.focus();
    }
    async function H() {
      u.value = !1, p.value = "", await Ke(), y.value?.querySelector("button")?.focus();
    }
    function x() {
      L.value && (o("add", V.value), H());
    }
    return (r, w) => (e(), i("div", {
      ref_key: "row",
      ref: y,
      class: "row pim-add-row"
    }, [
      u.value ? (e(), i("div", {
        key: 1,
        class: "row pim-add-editor",
        onKeydown: la(Oe(H, ["stop", "prevent"]), ["esc"])
      }, [
        v(s(Ge), {
          modelValue: p.value,
          "onUpdate:modelValue": w[0] || (w[0] = (d) => p.value = d),
          type: "text",
          placeholder: l.label,
          "aria-label": l.label,
          invalid: !!N.value,
          "aria-describedby": N.value ? s(m) : void 0,
          class: xe({ mono: !l.fromName }),
          onKeydown: la(Oe(x, ["prevent"]), ["enter"])
        }, null, 8, ["modelValue", "placeholder", "aria-label", "invalid", "aria-describedby", "class", "onKeydown"]),
        a("div", Lt, [
          v(s(Z), {
            type: "button",
            disabled: !L.value,
            onClick: x
          }, {
            default: h(() => [
              K(k(l.action), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          v(s(Z), {
            type: "button",
            label: "Cancel",
            outlined: "",
            severity: "secondary",
            onClick: H
          })
        ]),
        N.value ? (e(), i("p", {
          key: 0,
          id: s(m),
          role: "status",
          class: "pim-add-code-error small"
        }, k(N.value), 9, Ft)) : f("", !0)
      ], 40, Bt)) : (e(), T(s(Z), {
        key: 0,
        type: "button",
        "aria-expanded": "false",
        severity: "secondary",
        outlined: "",
        size: l.regular ? void 0 : "small",
        onClick: J
      }, {
        default: h(() => [
          v(s(le), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          K(" " + k(l.action), 1)
        ]),
        _: 1
      }, 8, ["size"])),
      Ce(r.$slots, "default")
    ], 512));
  }
}), Ha = Symbol("definitionColumns"), Et = { code: "Code", kind: "Kind", details: "Details", usage: "Used by" }, Mt = {
  code: "minmax(120px, 1fr)",
  kind: "140px",
  details: "minmax(120px, 1.2fr)",
  usage: "120px"
}, Wt = {
  class: "pim-definition-scroll",
  tabindex: "0",
  "aria-label": "Definitions"
}, Ht = { class: "pim-definition-grid" }, Jt = {
  key: 0,
  class: "pim-definition-columns",
  "aria-hidden": "true"
}, Kt = { class: "pim-definition-actions-heading" }, Te = /* @__PURE__ */ re({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: { default: () => ["code"] },
    showActions: { type: Boolean }
  },
  setup(l) {
    const b = l;
    $l(Ha, q(() => b.columns));
    const t = q(() => ["48px", "minmax(160px, 1.4fr)", ...b.columns.map((o) => Mt[o]), b.showActions ? "100px" : "80px"].join(" "));
    return (o, p) => (e(), i("section", {
      class: "form pim-definition-list",
      style: ya({ "--pim-definition-columns": t.value })
    }, [
      Ce(o.$slots, "head"),
      a("div", Wt, [
        a("div", Ht, [
          l.count > 3 ? (e(), i("div", Jt, [
            p[0] || (p[0] = a("span", null, null, -1)),
            p[1] || (p[1] = a("span", null, "Name", -1)),
            (e(!0), i(E, null, ae(l.columns, (u) => (e(), i("span", {
              key: u,
              class: xe("pim-definition-" + u)
            }, k(s(Et)[u]), 3))), 128)),
            a("span", Kt, k(l.showActions ? "Actions" : ""), 1)
          ])) : f("", !0),
          Ce(o.$slots, "default")
        ])
      ]),
      Ce(o.$slots, "add")
    ], 4));
  }
}), Gt = ["aria-label"], Yt = /* @__PURE__ */ re({
  __name: "InteractiveSurface",
  props: {
    label: {}
  },
  setup(l) {
    return (b, t) => (e(), i("button", {
      type: "button",
      class: "pim-interactive",
      "aria-label": l.label
    }, [
      Ce(b.$slots, "default")
    ], 8, Gt));
  }
}), Zt = { class: "pim-definition" }, Qt = {
  class: "pim-definition-lead",
  "data-column": "lead"
}, Xt = {
  class: "pim-row-title",
  "data-column": "name"
}, es = { class: "pim-definition-meta" }, as = ["data-column"], ls = {
  key: 0,
  class: "mono"
}, ts = {
  class: "pim-definition-actions",
  "data-column": "actions"
}, ss = ["id"], Pe = /* @__PURE__ */ re({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ ga({
    title: {},
    code: {},
    kind: {},
    usage: {},
    headClass: {},
    toggleClass: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(l) {
    const b = l, t = Cl(Ha, q(() => [
      ...b.code ? ["code"] : [],
      ...b.kind ? ["kind"] : []
    ])), o = Ba(l, "open"), p = qe();
    return (u, y) => (e(), i("section", Zt, [
      a("header", {
        class: xe(["pim-definition-head", l.headClass])
      }, [
        v(Yt, {
          class: xe(["pim-definition-toggle", l.toggleClass]),
          "aria-expanded": o.value,
          "aria-controls": o.value ? s(p) : void 0,
          onClick: y[0] || (y[0] = (m) => o.value = !o.value)
        }, {
          default: h(() => [
            a("span", Qt, [
              v(s(le), {
                icon: "tabler:chevron-right",
                class: "pim-definition-chevron",
                "aria-hidden": "true"
              })
            ]),
            a("span", Xt, k(l.title), 1),
            a("span", es, [
              (e(!0), i(E, null, ae(s(t), (m) => (e(), i("span", {
                key: m,
                class: xe("pim-definition-" + m),
                "data-column": m
              }, [
                m === "code" && l.code ? (e(), i("code", ls, k(l.code), 1)) : m === "kind" && l.kind ? (e(), T(s(ge), {
                  key: 1,
                  severity: "secondary",
                  value: l.kind
                }, null, 8, ["value"])) : m === "details" ? Ce(u.$slots, "details", {}, void 0, void 0, 2) : m === "usage" ? Ce(u.$slots, "usage", {}, () => [
                  K(k(l.usage), 1)
                ], void 0, 3) : f("", !0)
              ], 10, as))), 128))
            ])
          ]),
          _: 3
        }, 8, ["class", "aria-expanded", "aria-controls"]),
        a("div", ts, [
          Ce(u.$slots, "actions")
        ])
      ], 2),
      v(xl, { name: "pim-expand" }, {
        default: h(() => [
          o.value ? (e(), i("div", {
            key: 0,
            id: s(p),
            class: "pim-definition-body"
          }, [
            Ce(u.$slots, "default")
          ], 8, ss)) : f("", !0)
        ]),
        _: 3
      })
    ]));
  }
}), is = { class: "pim-chips pim-picker-chips" }, ns = {
  key: 0,
  class: "muted"
}, os = {
  key: 0,
  class: "muted small"
}, ds = {
  key: 0,
  class: "muted"
}, rs = {
  key: 0,
  class: "muted"
}, Ue = /* @__PURE__ */ re({
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
  setup(l, { emit: b }) {
    const t = l, o = b, p = Y("");
    function u(J) {
      return t.modelValue.includes(J);
    }
    function y(J) {
      t.disabled || !J || o("update:modelValue", u(J) ? t.modelValue.filter((H) => H !== J) : [...t.modelValue, J]);
    }
    function m() {
      const J = p.value.trim();
      if (!J || u(J)) {
        p.value = "";
        return;
      }
      o("update:modelValue", [...t.modelValue, J]), p.value = "";
    }
    function V(J) {
      o("update:modelValue", t.modelValue.filter((H) => H !== J));
    }
    const N = q(() => t.modelValue.map((J) => t.options?.find((H) => H.value === J) ?? { value: J }));
    function L(J) {
      const H = J.label ?? J.value;
      return J.detail ? H + " " + J.detail : H;
    }
    return (J, H) => (e(), i("div", is, [
      l.disabled ? (e(), i(E, { key: 0 }, [
        (e(!0), i(E, null, ae(N.value, (x) => (e(), i("span", {
          key: x.value
        }, [
          K(k(x.label ?? x.value) + " ", 1),
          x.detail ? (e(), i("small", ns, k(x.detail), 1)) : f("", !0)
        ]))), 128)),
        l.modelValue.length ? f("", !0) : (e(), i("span", os, "None"))
      ], 64)) : l.options && (l.dropdown || l.options.length > 10) ? (e(), i(E, { key: 1 }, [
        (e(!0), i(E, null, ae(N.value, (x) => (e(), i("span", {
          key: x.value,
          class: "row"
        }, [
          a("span", null, [
            K(k(x.label ?? x.value) + " ", 1),
            x.detail ? (e(), i("small", ds, k(x.detail), 1)) : f("", !0)
          ]),
          v(s(Z), {
            type: "button",
            "aria-label": "Remove " + L(x),
            onClick: (r) => V(x.value),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: h(() => [
              v(s(le), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128)),
        l.disabled ? f("", !0) : (e(), T(s(_e), {
          key: 0,
          "model-value": null,
          placeholder: l.placeholder ?? "Add…",
          "aria-labelledby": l.labelledby,
          "aria-label": l.placeholder ?? "Add",
          "onUpdate:modelValue": H[0] || (H[0] = (x) => y(x)),
          class: "pim-chip-entry",
          options: l.options.filter((x) => !u(x.value)),
          "option-label": L,
          "option-value": "value",
          appendTo: "self"
        }, {
          option: h(({ option: x }) => [
            a("span", null, [
              K(k(x.label ?? x.value) + " ", 1),
              x.detail ? (e(), i("small", rs, k(x.detail), 1)) : f("", !0)
            ])
          ]),
          _: 1
        }, 8, ["placeholder", "aria-labelledby", "aria-label", "options"]))
      ], 64)) : l.options ? (e(), i(E, { key: 2 }, [
        v(s(wa), {
          "model-value": l.modelValue.filter((x) => l.options.some((r) => r.value === x)),
          options: l.options.map((x) => ({ value: x.value, label: x.label ?? x.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          disabled: l.disabled,
          "aria-labelledby": l.labelledby,
          "aria-label": l.placeholder ?? "Selected values",
          "onUpdate:modelValue": H[1] || (H[1] = (x) => o("update:modelValue", [...x, ...l.modelValue.filter((r) => !l.options.some((w) => w.value === r))]))
        }, null, 8, ["model-value", "options", "disabled", "aria-labelledby", "aria-label"]),
        (e(!0), i(E, null, ae(l.modelValue.filter((x) => !l.options.some((r) => r.value === x)), (x) => (e(), i("span", {
          key: x,
          class: "row"
        }, [
          K(k(x), 1),
          v(s(Z), {
            type: "button",
            "aria-label": "Remove " + x,
            onClick: (r) => V(x),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: h(() => [
              v(s(le), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128))
      ], 64)) : (e(!0), i(E, { key: 3 }, ae(l.modelValue, (x) => (e(), i("span", {
        key: x,
        class: "row"
      }, [
        K(k(x), 1),
        v(s(Z), {
          type: "button",
          "aria-label": "Remove " + x,
          onClick: (r) => V(x),
          size: "small",
          text: "",
          severity: "secondary"
        }, {
          default: h(() => [
            v(s(le), { icon: "tabler:x" })
          ]),
          _: 1
        }, 8, ["aria-label", "onClick"])
      ]))), 128)),
      l.free && !l.disabled ? (e(), T(s(Ge), {
        key: 4,
        modelValue: p.value,
        "onUpdate:modelValue": H[2] || (H[2] = (x) => p.value = x),
        type: "text",
        "aria-labelledby": l.labelledby,
        placeholder: l.placeholder ?? "Add…",
        onKeydown: la(Oe(m, ["prevent"]), ["enter"]),
        onBlur: m,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "aria-labelledby", "placeholder", "onKeydown"])) : f("", !0)
    ]));
  }
}), us = { key: 0 }, cs = {
  key: 0,
  class: "pim-config-overrides"
}, ms = {
  key: 1,
  class: "muted small"
}, ps = { key: 3 }, vs = ["schema", "config"], fs = {
  key: 1,
  class: "muted small",
  role: "status"
}, $a = /* @__PURE__ */ re({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean },
    problem: {},
    problemLabel: {},
    pluginId: {},
    refusal: {}
  },
  emits: ["update:modelValue"],
  setup(l, { emit: b }) {
    const t = l, o = b, p = Y("pending"), u = q(() => {
      const N = t.schema.properties;
      return !N || typeof N != "object" ? t.schema : {
        ...t.schema,
        properties: Object.fromEntries(Object.entries(N).map(([L, J]) => [
          L,
          J && typeof J == "object" ? { ...J, title: da(t.schema, L) } : J
        ]))
      };
    }), y = q(() => Object.entries(t.modelValue).map(([N, L]) => ({
      key: N,
      label: da(t.schema, N),
      value: L !== null && typeof L == "object" ? JSON.stringify(L) : ra(L)
    })));
    async function m() {
      p.value = "pending", p.value = await Da("wc-schema-form") ? "ready" : "failed";
    }
    be(() => t.disabled, (N) => {
      N || m();
    }, { immediate: !0 });
    function V(N) {
      const L = N.detail;
      L && typeof L == "object" && !Array.isArray(L) && o("update:modelValue", L);
    }
    return (N, L) => (e(), i(E, null, [
      l.refusal || l.problem ? (e(), T(s(we), {
        key: 0,
        severity: "warn",
        role: "alert"
      }, {
        default: h(() => [
          l.refusal ? (e(), i(E, { key: 0 }, [
            K(k(l.refusal), 1)
          ], 64)) : l.problemLabel ? (e(), i(E, { key: 1 }, [
            K(k(l.problemLabel) + " is required. Enter a value below.", 1)
          ], 64)) : (e(), i(E, { key: 2 }, [
            K("The saved settings don’t meet the plugin’s requirements. Update the configuration below.")
          ], 64))
        ]),
        _: 1
      })) : f("", !0),
      l.problem ? (e(), T(Re, {
        key: 1,
        class: "small pim-error-code pim-ia-disclosure",
        label: "Technical details"
      }, {
        default: h(() => [
          l.pluginId ? (e(), i("p", us, [
            L[1] || (L[1] = K("Plugin ", -1)),
            a("code", null, k(l.pluginId), 1)
          ])) : f("", !0),
          a("p", null, k(l.problem.message), 1)
        ]),
        _: 1
      })) : f("", !0),
      l.disabled ? (e(), i(E, { key: 2 }, [
        y.value.length ? (e(), i("dl", cs, [
          (e(!0), i(E, null, ae(y.value, (J) => (e(), i(E, {
            key: J.key
          }, [
            a("dt", null, k(J.label), 1),
            a("dd", null, k(J.value), 1)
          ], 64))), 128))
        ])) : (e(), i("span", ms, "No overrides"))
      ], 64)) : (e(), i("div", ps, [
        p.value === "ready" ? (e(), i("wc-schema-form", {
          key: 0,
          schema: JSON.stringify(u.value),
          config: JSON.stringify(l.modelValue),
          onConfigChanged: V
        }, null, 40, vs)) : p.value === "pending" ? (e(), i("span", fs, "Configuration form is loading.")) : (e(), T(s(we), {
          key: 2,
          role: "alert",
          severity: "error"
        }, {
          default: h(() => [
            L[3] || (L[3] = K("Configuration form could not be loaded. ", -1)),
            v(s(Z), {
              type: "button",
              onClick: m,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: h(() => [...L[2] || (L[2] = [
                K("Retry", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })),
        l.problem ? f("", !0) : (e(), T(s(Z), {
          key: 3,
          type: "button",
          onClick: L[0] || (L[0] = (J) => o("update:modelValue", {})),
          severity: "secondary",
          outlined: "",
          size: "small"
        }, {
          default: h(() => [
            v(s(le), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            }),
            L[4] || (L[4] = K(" Reset overrides", -1))
          ]),
          _: 1
        }))
      ]))
    ], 64));
  }
}), bs = { key: 0 }, ys = /* @__PURE__ */ re({
  __name: "DefaultValue",
  props: {
    attribute: {},
    type: {},
    disabled: { type: Boolean }
  },
  emits: ["change"],
  setup(l, { emit: b }) {
    const t = l, o = b, p = q(() => {
      const V = t.type?.form;
      let N = { type: "string" };
      return V === "bool" ? N = { type: "boolean" } : V === "int" ? N = { type: "integer" } : V === "dec" ? N = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : V === "quantity" ? N = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(t.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : V === "record" ? N = { type: "object", additionalProperties: !0 } : V === "ref" && (N = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${t.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (t.attribute.cardinality ?? "one") !== "one" && (N = { type: "array", items: N, uniqueItems: t.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...N, title: "Default value" } } };
    });
    function u(V) {
      return V && typeof V == "object" && "m" in V && "e" in V ? _a(V) : V;
    }
    function y(V) {
      return t.type?.form === "dec" ? u(V) : t.type?.form === "quantity" && V && typeof V == "object" && "v" in V && "u" in V ? { value: u(V.v), unit: V.u } : V;
    }
    const m = q(() => t.attribute.default === void 0 ? {} : { value: Array.isArray(t.attribute.default) ? t.attribute.default.map(y) : y(t.attribute.default) });
    return (V, N) => l.disabled ? (e(), i("span", bs, k(l.attribute.default == null ? "No default" : s(ra)(l.attribute.default)), 1)) : (e(), T($a, {
      key: 1,
      schema: p.value,
      "model-value": m.value,
      "onUpdate:modelValue": N[0] || (N[0] = (L) => o("change", L.value))
    }, null, 8, ["schema", "model-value"]));
  }
}), gs = { class: "pim-stack" }, hs = {
  key: 0,
  class: "pim-ia-action"
}, ks = {
  key: 1,
  class: "form pim-card-body pad muted"
}, _s = { class: "pim-bsection-head pim-list-header" }, ws = { class: "small muted" }, $s = { class: "row pim-list-actions" }, Cs = { class: "pim-fields" }, xs = { class: "pim-f pim-w-third" }, Vs = { class: "pim-f-label" }, Us = ["id"], js = { class: "pim-f pim-w-third" }, As = { class: "pim-f-label" }, Ss = ["id"], Rs = {
  key: 0,
  class: "pim-f pim-w-third"
}, Os = { class: "pim-f-label" }, Is = ["id"], Ts = {
  key: 1,
  class: "pim-f pim-w-full muted small"
}, Ps = {
  key: 2,
  class: "pim-f pim-w-full muted small"
}, qs = {
  key: 3,
  class: "pim-f pim-w-third"
}, Ns = { class: "pim-f-label" }, Ds = ["id"], zs = { class: "pim-f pim-w-third" }, Bs = { class: "pim-f-label" }, Ls = ["id"], Fs = { class: "pim-f pim-w-half" }, Es = { class: "pim-f-label" }, Ms = ["id"], Ws = ["aria-labelledby"], Hs = { class: "pim-f-label" }, Js = ["id"], Ks = ["aria-labelledby"], Gs = { class: "pim-f-label" }, Ys = ["id"], Zs = { class: "pim-fields" }, Qs = { class: "pim-f pim-w-third" }, Xs = { class: "pim-f-label" }, ei = ["for"], ai = {
  key: 0,
  class: "pim-f-note"
}, li = { class: "pim-f pim-w-third" }, ti = { class: "pim-f-label" }, si = ["id"], ii = { class: "pim-f pim-w-half" }, ni = { class: "pim-f-label" }, oi = ["for"], di = { class: "row" }, ri = {
  key: 0,
  class: "pim-f pim-w-full"
}, ui = { class: "pim-f-label" }, ci = ["id"], mi = ["aria-labelledby"], pi = ["id"], vi = {
  key: 0,
  class: "row end"
}, fi = { class: "pim-ia-dialog-head" }, bi = {
  tabindex: "-1",
  autofocus: ""
}, yi = { class: "pim-source-permissions" }, gi = ["id"], hi = { class: "dialog-actions pim-group-dialog-actions" }, ki = /* @__PURE__ */ re({
  __name: "BuilderFields",
  props: /* @__PURE__ */ ga({
    draft: {},
    schema: {},
    options: {}
  }, {
    family: { default: "" },
    familyModifiers: {}
  }),
  emits: /* @__PURE__ */ ga(["remove"], ["update:family"]),
  setup(l, { emit: b }) {
    const t = l, o = Ba(l, "family"), p = b, u = na.map((U) => U.value), y = [{ value: "one", label: "Single value" }, { value: "list", label: "Ordered list" }, { value: "set", label: "Unique set" }], m = q(() => t.schema.access.admin), V = q(() => t.draft.aspects ?? []), N = q(() => (t.draft.families ?? []).filter((U) => U.code !== "generic"));
    be(N, (U) => {
      o.value && !U.some((I) => I.code === o.value) && (o.value = "");
    }, { immediate: !0 });
    const L = q(() => [{ value: "", label: "All families" }, ...N.value.map((U) => ({ value: U.code, label: B(U.code) }))]), J = q(() => {
      const U = N.value.find((I) => I.code === o.value);
      return U ? V.value.filter((I) => U.aspects?.includes(I.namespace)) : V.value;
    }), H = q(() => (t.draft.dimensions ?? []).map((U) => ({ value: U.name, label: B(U.name) }))), x = q(() => (t.draft.vocabularies ?? []).map((U) => U.code)), r = q(() => (t.draft.sources ?? []).map((U) => ({ value: U.id, label: B(U.id) }))), w = q(() => [...t.options.types].sort((U, I) => U.form.localeCompare(I.form)).map((U) => ({ value: U.id, label: aa(U) })));
    function d(U) {
      return t.options.types.find((I) => I.id === U.type);
    }
    function S(U) {
      return d(U)?.target === "term";
    }
    function O(U) {
      return d(U)?.target === "asset";
    }
    function M(U) {
      const I = d(U);
      return !!I && I.form === "ref" && !I.target;
    }
    function ce(U) {
      return N.value.filter((I) => I.aspects?.includes(U)).map((I) => B(I.code));
    }
    function pe(U) {
      const I = ce(U);
      return I.length ? I.length === 1 ? I[0] : I.length + " families" : "Unused by families";
    }
    const G = { none: "None", key: "Exact match", number: "Number range", text: "Text search" }, F = Y({}), A = qe(), Q = /* @__PURE__ */ new WeakMap();
    let D = 0;
    function W(U, I) {
      if (I.id !== void 0) return U + "." + I.id;
      const P = Vl(I);
      let C = Q.get(P);
      return C === void 0 && (C = ++D, Q.set(P, C)), U + ".draft-" + C;
    }
    function c(U, I, P) {
      return A + "-" + W(U, I) + "-" + P;
    }
    function j(U, I) {
      U.type = I;
      const P = d(U);
      if (P && U.index && !P.indexes.includes(U.index) && delete U.index, S(U) || delete U.vocabulary, O(U) && delete U.default, !M(U) && U.config && "target" in U.config) {
        const { target: C, ...oe } = U.config;
        U.config = Object.keys(oe).length ? oe : void 0, U.config || delete U.config;
      }
    }
    function n(U, I) {
      Object.keys(I).length ? U.config = I : delete U.config;
    }
    function _(U, I) {
      const P = { ...U.config ?? {} };
      I ? P.target = I : delete P.target, n(U, P);
    }
    function z(U, I) {
      I.length ? U.scope = I : delete U.scope, I.length || delete U.index_contexts;
    }
    function X(U, I, P) {
      P === void 0 || P === "" || P === !1 && I !== "default" ? delete U[I] : U[I] = P;
    }
    function te(U) {
      return U.index_contexts ?? [];
    }
    function ie(U) {
      return (t.draft.dimensions ?? []).find((I) => I.name === U)?.members ?? [];
    }
    function Ee(U) {
      const I = {};
      for (const C of U.scope ?? []) I[C] = ie(C)[0] ?? "";
      (U.index_contexts ?? (U.index_contexts = [])).push(I);
    }
    const ve = Y(), Ze = q(() => ve.value ? B(ve.value.namespace) + " settings" : "");
    async function Ne(U, I, P, C) {
      const oe = U.currentTarget, ee = oe.parentElement;
      ia(I, P, C), await Ke(), (oe.isConnected ? oe : ee?.querySelector("button"))?.focus({ preventScroll: !0 });
    }
    function ma(U) {
      (t.draft.aspects ??= []).push({ namespace: U, attributes: [] });
    }
    function pa(U) {
      ve.value = void 0;
      const I = V.value.indexOf(U);
      I >= 0 && V.value.splice(I, 1), t.schema.declaration.aspects?.some((P) => P.namespace === U.namespace) && p("remove", "aspects", U.namespace);
    }
    function je(U, I) {
      const P = t.options.types.find((oe) => oe.id === "kickside.pim.types:text") ?? t.options.types[0], C = { code: I, type: P?.id ?? "" };
      (U.attributes ??= []).push(C), F.value[W(U.namespace, C)] = !0;
    }
    function Ve(U, I) {
      const P = U.attributes ?? [], C = P.indexOf(I);
      C >= 0 && P.splice(C, 1);
      const oe = I.id === void 0 ? void 0 : t.schema.declaration.aspects?.find((ee) => ee.namespace === U.namespace)?.attributes?.find((ee) => ee.id === I.id);
      oe && p("remove", "attributes", U.namespace + "." + oe.code);
    }
    return (U, I) => (e(), i("div", gs, [
      N.value.length || m.value && !o.value ? (e(), i("div", hs, [
        N.value.length ? (e(), T(s(_e), {
          key: 0,
          modelValue: o.value,
          "onUpdate:modelValue": I[0] || (I[0] = (P) => o.value = P),
          class: "pim-family-filter",
          "aria-label": "Show fields for a family",
          placeholder: "All families",
          options: L.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self"
        }, null, 8, ["modelValue", "options"])) : f("", !0),
        m.value && !o.value ? (e(), T(Ie, {
          key: 1,
          label: "Field group name",
          action: "Add field group",
          "from-name": "",
          regular: "",
          existing: V.value.map((P) => P.namespace),
          onAdd: ma
        }, null, 8, ["existing"])) : f("", !0)
      ])) : f("", !0),
      o.value && !J.value.length ? (e(), i("p", ks, "This family has no field groups yet. Open the family to choose which groups it uses.")) : f("", !0),
      (e(!0), i(E, null, ae(J.value, (P) => (e(), T(Te, {
        key: P.namespace,
        count: P.attributes?.length ?? 0,
        columns: ["kind", "details", "usage"],
        "show-actions": m.value
      }, {
        head: h(() => [
          a("header", _s, [
            a("div", null, [
              a("h3", null, k(s(B)(P.namespace)), 1),
              a("p", ws, k(ce(P.namespace).length ? "Used by " + ce(P.namespace).join(", ") : "Unused by families"), 1)
            ]),
            a("div", $s, [
              m.value ? (e(), T(Ie, {
                key: 0,
                label: "Field name",
                action: "Add field",
                "from-name": "",
                existing: P.attributes?.map((C) => C.code),
                onAdd: (C) => je(P, C)
              }, null, 8, ["existing", "onAdd"])) : f("", !0),
              v(s(Z), {
                type: "button",
                "aria-label": s(B)(P.namespace) + " settings",
                title: s(B)(P.namespace) + " settings",
                "aria-haspopup": "dialog",
                severity: "secondary",
                text: "",
                size: "small",
                onClick: (C) => ve.value = P
              }, {
                default: h(() => [
                  v(s(le), {
                    icon: "tabler:settings",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "title", "onClick"])
            ])
          ])
        ]),
        default: h(() => [
          (e(!0), i(E, null, ae(P.attributes ?? [], (C, oe) => (e(), T(Pe, {
            key: W(P.namespace, C),
            open: F.value[W(P.namespace, C)],
            "onUpdate:open": (ee) => F.value[W(P.namespace, C)] = ee,
            title: s(B)(C.code),
            kind: s(aa)(d(C)),
            usage: pe(P.namespace),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle"
          }, he({
            details: h(() => [
              C.cardinality && C.cardinality !== "one" ? (e(), T(s(ge), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: h(() => [
                  K(k(y.find((ee) => ee.value === C.cardinality)?.label), 1)
                ]),
                _: 2
              }, 1024)) : f("", !0),
              C.scope?.length ? (e(), T(s(ge), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: h(() => [
                  K("per " + k(C.scope.map(s(B)).join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : f("", !0),
              C.index && C.index !== "none" ? (e(), T(s(ge), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: h(() => [
                  K(k(G[C.index] || "Filterable"), 1)
                ]),
                _: 2
              }, 1024)) : f("", !0),
              C.unique ? (e(), T(s(ge), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: h(() => [...I[6] || (I[6] = [
                  K("unique", -1)
                ])]),
                _: 1
              })) : f("", !0)
            ]),
            default: h(() => [
              a("div", Cs, [
                a("div", xs, [
                  a("div", Vs, [
                    a("label", {
                      id: c(P.namespace, C, "type")
                    }, "Type", 8, Us)
                  ]),
                  v(s(_e), {
                    disabled: !m.value,
                    "aria-labelledby": c(P.namespace, C, "type"),
                    "model-value": C.type,
                    options: w.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (ee) => j(C, ee)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                a("div", js, [
                  a("div", As, [
                    a("label", {
                      id: c(P.namespace, C, "values")
                    }, "Values", 8, Ss)
                  ]),
                  v(s(_e), {
                    disabled: !m.value,
                    "aria-labelledby": c(P.namespace, C, "values"),
                    "model-value": C.cardinality ?? "one",
                    options: y,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (ee) => X(C, "cardinality", ee === "one" ? void 0 : ee)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                S(C) ? (e(), i("div", Rs, [
                  a("div", Os, [
                    a("label", {
                      id: c(P.namespace, C, "vocabulary")
                    }, "Vocabulary", 8, Is)
                  ]),
                  v(s(_e), {
                    disabled: !m.value,
                    "aria-labelledby": c(P.namespace, C, "vocabulary"),
                    "model-value": C.vocabulary ?? "",
                    "onUpdate:modelValue": (ee) => X(C, "vocabulary", ee),
                    options: [{ value: "", label: "Choose…" }, ...x.value.map((ee) => ({ value: ee, label: s(B)(ee) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : f("", !0),
                O(C) ? (e(), i("p", Ts, "Choose the media types and file size this field accepts. Catalog readers can access attached files.")) : d(C)?.form === "ref" && !S(C) ? (e(), i("p", Ps, k(M(C) ? "A link points to something managed by an installed plugin." : "A product reference points to another product in this catalog."), 1)) : f("", !0),
                M(C) ? (e(), i("div", qs, [
                  a("div", Ns, [
                    a("label", {
                      id: c(P.namespace, C, "link")
                    }, "Link destination", 8, Ds),
                    I[7] || (I[7] = a("span", { class: "pim-f-note" }, "choose what the field can point to", -1))
                  ]),
                  v(s(_e), {
                    disabled: !m.value,
                    "aria-labelledby": c(P.namespace, C, "link"),
                    "model-value": C.config?.target ?? "",
                    "onUpdate:modelValue": (ee) => _(C, ee),
                    options: [{ value: "", label: "Choose…" }, ...l.options.link_kinds.map((ee) => ({ value: ee.kind, label: s(ne)(ee.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : f("", !0),
                a("div", zs, [
                  a("div", Bs, [
                    a("label", {
                      id: c(P.namespace, C, "width")
                    }, "Width", 8, Ls),
                    I[8] || (I[8] = a("span", { class: "pim-f-note" }, "of a form row", -1))
                  ]),
                  v(s(wa), {
                    disabled: !m.value,
                    "aria-labelledby": c(P.namespace, C, "width"),
                    "model-value": s(ka)(l.schema, P.namespace, C),
                    options: s(u),
                    "allow-empty": !1,
                    "onUpdate:modelValue": (ee) => C.width = ee
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                a("div", Fs, [
                  a("div", Es, [
                    a("label", {
                      id: c(P.namespace, C, "scope")
                    }, "Varies per", 8, Ms),
                    I[9] || (I[9] = a("span", { class: "pim-f-note" }, "dimensions the value depends on", -1))
                  ]),
                  v(Ue, {
                    disabled: !m.value,
                    labelledby: c(P.namespace, C, "scope"),
                    "model-value": C.scope ?? [],
                    options: H.value,
                    "onUpdate:modelValue": (ee) => z(C, ee)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                O(C) ? f("", !0) : (e(), i("div", {
                  key: 4,
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": c(P.namespace, C, "default")
                }, [
                  a("div", Hs, [
                    a("label", {
                      id: c(P.namespace, C, "default")
                    }, "Default", 8, Js),
                    I[10] || (I[10] = a("span", { class: "pim-f-note" }, "when no value is set", -1))
                  ]),
                  v(ys, {
                    disabled: !m.value,
                    attribute: C,
                    type: d(C),
                    onChange: (ee) => X(C, "default", ee)
                  }, null, 8, ["disabled", "attribute", "type", "onChange"])
                ], 8, Ws)),
                d(C)?.config_schema ? (e(), i("div", {
                  key: 5,
                  class: "pim-f pim-w-full",
                  role: "group",
                  "aria-labelledby": c(P.namespace, C, "config")
                }, [
                  a("div", Gs, [
                    a("label", {
                      id: c(P.namespace, C, "config")
                    }, "Type configuration", 8, Ys)
                  ]),
                  v($a, {
                    disabled: !m.value,
                    schema: d(C).config_schema,
                    "model-value": C.config ?? {},
                    "onUpdate:modelValue": (ee) => n(C, ee)
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue"])
                ], 8, Ks)) : f("", !0)
              ]),
              v(Re, {
                class: "pim-field-advanced pim-ia-disclosure",
                label: "Advanced"
              }, {
                default: h(() => [
                  a("div", Zs, [
                    a("div", Qs, [
                      a("div", Xs, [
                        a("label", {
                          for: c(P.namespace, C, "code")
                        }, "Integration key", 8, ei),
                        C.id !== void 0 ? (e(), i("span", ai, "renaming keeps stored values")) : f("", !0)
                      ]),
                      v(s(Ge), {
                        disabled: !m.value,
                        id: c(P.namespace, C, "code"),
                        type: "text",
                        value: C.code,
                        onInput: (ee) => C.code = ee.target.value,
                        class: "mono"
                      }, null, 8, ["disabled", "id", "value", "onInput"])
                    ]),
                    a("div", li, [
                      a("div", ti, [
                        a("label", {
                          id: c(P.namespace, C, "index")
                        }, "Search and filters", 8, si),
                        I[11] || (I[11] = a("span", { class: "pim-f-note" }, "choose how this field can be matched", -1))
                      ]),
                      v(s(_e), {
                        disabled: !m.value,
                        "aria-labelledby": c(P.namespace, C, "index"),
                        "model-value": C.index ?? "none",
                        options: (d(C)?.indexes ?? ["none"]).map((ee) => ({ value: ee, label: G[ee] || s(B)(ee) })),
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self",
                        "onUpdate:modelValue": (ee) => X(C, "index", ee === "none" ? void 0 : ee)
                      }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ]),
                    a("div", ii, [
                      a("div", ni, [
                        a("label", {
                          for: c(P.namespace, C, "unique")
                        }, "Unique", 8, oi),
                        I[12] || (I[12] = a("span", { class: "pim-f-note" }, "one holder per value, catalog wide", -1))
                      ]),
                      a("div", di, [
                        v(s(ta), {
                          "input-id": c(P.namespace, C, "unique"),
                          "model-value": C.unique === !0,
                          disabled: !m.value || !!C.scope?.length || (C.cardinality ?? "one") !== "one",
                          "onUpdate:modelValue": (ee) => X(C, "unique", ee)
                        }, null, 8, ["input-id", "model-value", "disabled", "onUpdate:modelValue"]),
                        a("span", null, k(C.unique ? "Yes" : "No"), 1)
                      ])
                    ]),
                    (C.scope?.length ?? 0) > 0 && C.index && C.index !== "none" ? (e(), i("div", ri, [
                      a("div", ui, [
                        a("label", {
                          id: c(P.namespace, C, "contexts")
                        }, "Filterable combinations", 8, ci),
                        I[13] || (I[13] = a("span", { class: "pim-f-note" }, "which combinations get an index", -1))
                      ]),
                      a("div", {
                        class: "pim-contexts",
                        role: "group",
                        "aria-labelledby": c(P.namespace, C, "contexts")
                      }, [
                        (e(!0), i(E, null, ae(te(C), (ee, Ae) => (e(), i("div", {
                          key: Ae,
                          class: "pim-context-row"
                        }, [
                          (e(!0), i(E, null, ae(C.scope, (ye) => (e(), i("div", {
                            key: ye,
                            class: "pim-context-field"
                          }, [
                            a("span", {
                              id: c(P.namespace, C, "context-" + Ae + "-" + ye),
                              class: "small muted"
                            }, k(s(B)(ye)), 9, pi),
                            v(s(_e), {
                              disabled: !m.value,
                              "aria-labelledby": c(P.namespace, C, "context-" + Ae + "-" + ye),
                              "model-value": ee[ye] ?? "",
                              options: ie(ye),
                              class: "narrow",
                              appendTo: "self",
                              "onUpdate:modelValue": (Qe) => ee[ye] = Qe
                            }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                          ]))), 128)),
                          m.value ? (e(), T(s(Z), {
                            key: 0,
                            type: "button",
                            "aria-label": "Remove context",
                            onClick: (ye) => te(C).splice(Ae, 1),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: h(() => [
                              v(s(le), { icon: "tabler:x" })
                            ]),
                            _: 1
                          }, 8, ["onClick"])) : f("", !0)
                        ]))), 128)),
                        m.value ? (e(), T(s(Z), {
                          key: 0,
                          type: "button",
                          onClick: (ee) => Ee(C),
                          severity: "secondary",
                          outlined: "",
                          size: "small"
                        }, {
                          default: h(() => [
                            v(s(le), {
                              icon: "tabler:plus",
                              "aria-hidden": "true"
                            }),
                            I[14] || (I[14] = K(" Add context", -1))
                          ]),
                          _: 1
                        }, 8, ["onClick"])) : f("", !0)
                      ], 8, mi)
                    ])) : f("", !0)
                  ])
                ]),
                _: 2
              }, 1024),
              m.value ? (e(), i("div", vi, [
                v(s(Z), {
                  type: "button",
                  onClick: (ee) => Ve(P, C),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: h(() => [
                    v(s(le), { icon: "tabler:trash" }),
                    I[15] || (I[15] = K(" Remove field", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : f("", !0)
            ]),
            _: 2
          }, [
            m.value ? {
              name: "actions",
              fn: h(() => [
                oe > 0 ? (e(), T(s(Z), {
                  key: 0,
                  type: "button",
                  "aria-label": "Move " + s(B)(C.code) + " earlier",
                  onClick: (ee) => Ne(ee, P.attributes, oe, oe - 1),
                  text: "",
                  size: "small",
                  severity: "secondary"
                }, {
                  default: h(() => [
                    v(s(le), {
                      icon: "tabler:arrow-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])) : f("", !0),
                oe < (P.attributes?.length ?? 0) - 1 ? (e(), T(s(Z), {
                  key: 1,
                  type: "button",
                  class: "pim-move-later",
                  "aria-label": "Move " + s(B)(C.code) + " later",
                  onClick: (ee) => Ne(ee, P.attributes, oe, oe + 1),
                  text: "",
                  size: "small",
                  severity: "secondary"
                }, {
                  default: h(() => [
                    v(s(le), {
                      icon: "tabler:arrow-down",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])) : f("", !0)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["open", "onUpdate:open", "title", "kind", "usage"]))), 128))
        ]),
        _: 2
      }, 1032, ["count", "show-actions"]))), 128)),
      v(oa, {
        visible: !!ve.value,
        label: Ze.value,
        onClose: I[5] || (I[5] = (P) => ve.value = void 0)
      }, {
        default: h(() => [
          ve.value ? (e(), i("section", {
            key: 0,
            class: "pim-ia-dialog",
            onKeydown: I[4] || (I[4] = la(Oe((P) => ve.value = void 0, ["prevent"]), ["esc"]))
          }, [
            a("header", fi, [
              a("h2", bi, k(Ze.value), 1)
            ]),
            a("div", yi, [
              a("label", {
                id: s(A) + "-writers"
              }, "Sources allowed to write", 8, gi),
              v(s(Ea), {
                disabled: !m.value,
                "aria-labelledby": s(A) + "-writers",
                "model-value": ve.value.write?.sources ?? [],
                options: r.value,
                "option-label": "label",
                "option-value": "value",
                placeholder: "Any source",
                "append-to": "self",
                "onUpdate:modelValue": I[1] || (I[1] = (P) => ve.value.write = { sources: P })
              }, null, 8, ["disabled", "aria-labelledby", "model-value", "options"])
            ]),
            a("footer", hi, [
              m.value ? (e(), T(s(Z), {
                key: 0,
                type: "button",
                label: "Remove field group",
                severity: "danger",
                text: "",
                onClick: I[2] || (I[2] = (P) => pa(ve.value))
              })) : f("", !0),
              v(s(Z), {
                type: "button",
                label: "Done",
                severity: "secondary",
                outlined: "",
                onClick: I[3] || (I[3] = (P) => ve.value = void 0)
              })
            ])
          ], 32)) : f("", !0)
        ]),
        _: 1
      }, 8, ["visible", "label"])
    ]));
  }
}), _i = { class: "muted small" }, wi = { class: "pim-aspect" }, $i = {
  key: 0,
  class: "small muted"
}, Ci = { class: "pim-fields" }, xi = { class: "pim-f pim-w-full" }, Vi = { class: "pim-f-label" }, Ui = ["id"], ji = { class: "pim-f-label" }, Ai = ["id"], Si = /* @__PURE__ */ re({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(l, { emit: b }) {
    const t = l, o = b, p = q(() => t.schema.access.admin), u = q(() => t.draft.dimensions ?? []), y = qe();
    function m(r, w) {
      return y + "-" + r.name + "-" + w;
    }
    function V(r) {
      (t.draft.dimensions ??= []).push({ name: r, members: [] });
    }
    function N(r) {
      const w = [];
      for (const d of t.draft.aspects ?? []) for (const S of d.attributes ?? []) S.scope?.includes(r.name) && w.push(`${B(S.code)} (${B(d.namespace)})`);
      for (const d of t.draft.families ?? []) for (const S of d.requirements ?? []) S.context && r.name in S.context && w.push(`${B(S.id)} (${B(d.code)})`);
      return w;
    }
    function L(r) {
      N(r).length || (u.value.splice(u.value.indexOf(r), 1), t.schema.declaration.dimensions?.some((w) => w.name === r.name) && o("remove", "dimensions", r.name));
    }
    function J(r, w) {
      if (r.members = w, r.fallback)
        for (const d of Object.keys(r.fallback)) w.includes(d) || delete r.fallback[d];
    }
    function H(r, w) {
      return r.fallback?.[w] ?? [];
    }
    function x(r, w, d) {
      const S = { ...r.fallback ?? {} };
      d.length ? S[w] = d : delete S[w], Object.keys(S).length ? r.fallback = S : delete r.fallback;
    }
    return (r, w) => (e(), T(Te, {
      count: u.value.length,
      columns: ["details", "usage"]
    }, he({
      default: h(() => [
        (e(!0), i(E, null, ae(u.value, (d) => (e(), T(Pe, {
          title: s(B)(d.name),
          key: d.name,
          usage: N(d).length ? "Used in " + N(d).length + " places" : "Unused"
        }, he({
          details: h(() => [
            a("span", _i, k(d.members.map(s(B)).join(", ") || "No allowed values"), 1)
          ]),
          default: h(() => [
            a("div", wi, [
              N(d).length ? (e(), i("p", $i, "Used by " + k(N(d).join(", ")), 1)) : f("", !0),
              a("div", Ci, [
                a("div", xi, [
                  a("div", Vi, [
                    a("label", {
                      id: m(d, "members")
                    }, "Allowed values", 8, Ui),
                    w[0] || (w[0] = a("span", { class: "pim-f-note" }, "for example, English and French for Language", -1))
                  ]),
                  v(Ue, {
                    disabled: !p.value,
                    labelledby: m(d, "members"),
                    "model-value": d.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (S) => J(d, S)
                  }, null, 8, ["disabled", "labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                (e(!0), i(E, null, ae(d.members, (S) => (e(), i("div", {
                  key: S,
                  class: "pim-f pim-w-half"
                }, [
                  a("div", ji, [
                    a("label", {
                      id: m(d, "fallback-" + encodeURIComponent(S))
                    }, k(S) + " falls back to", 9, Ai),
                    w[1] || (w[1] = a("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  v(Ue, {
                    disabled: !p.value,
                    labelledby: m(d, "fallback-" + encodeURIComponent(S)),
                    "model-value": H(d, S),
                    options: d.members.filter((O) => O !== S).map((O) => ({ value: O })),
                    "onUpdate:modelValue": (O) => x(d, S, O)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]))), 128))
              ])
            ])
          ]),
          _: 2
        }, [
          p.value ? {
            name: "actions",
            fn: h(() => [
              v(s(Z), {
                type: "button",
                disabled: N(d).length > 0,
                "aria-label": "Remove " + s(B)(d.name),
                title: N(d).length ? "Take the dimension off these first" : "",
                onClick: (S) => L(d),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: h(() => [
                  v(s(le), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "title", "onClick"])
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["title", "usage"]))), 128))
      ]),
      _: 2
    }, [
      p.value ? {
        name: "add",
        fn: h(() => [
          v(Ie, {
            label: "Dimension name",
            "from-name": "",
            action: "Add dimension",
            existing: u.value.map((d) => d.name),
            onAdd: V
          }, {
            default: h(() => [...w[2] || (w[2] = [
              a("span", { class: "muted small" }, "A dimension lets a value differ per member, with fallbacks between members.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), Ri = { class: "muted small" }, Oi = { class: "pim-aspect" }, Ii = { class: "row small" }, Ti = {
  key: 1,
  class: "muted small"
}, Pi = {
  key: 2,
  class: "pim-stack tight pim-terms"
}, qi = {
  key: 0,
  class: "muted small"
}, Ni = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Di = {
  key: 3,
  class: "pim-responsive-table"
}, zi = {
  class: "pim-grid compact",
  "aria-label": "Vocabulary terms"
}, Bi = { key: 0 }, Li = { key: 1 }, Fi = {
  key: 0,
  class: "muted"
}, Ei = {
  key: 1,
  class: "num"
}, Mi = {
  role: "list",
  class: "pim-stacked-list",
  "aria-label": "Vocabulary terms"
}, Wi = {
  key: 0,
  class: "pim-stacked-meta muted small"
}, Hi = {
  key: 4,
  class: "muted small"
}, Ji = { class: "row wrap" }, Ki = {
  key: 5,
  class: "row wrap pim-add-row"
}, Gi = {
  key: 0,
  class: "pim-config-overrides"
}, Yi = /* @__PURE__ */ re({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(l, { emit: b }) {
    const t = l, o = b, p = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/, u = q(() => t.schema.access.admin), y = q(() => u.value && t.schema.access.write), m = q(() => t.draft.vocabularies ?? []);
    function V(c) {
      (t.draft.vocabularies ??= []).push({ code: c });
    }
    function N(c) {
      m.value.splice(m.value.indexOf(c), 1), t.schema.declaration.vocabularies?.some((j) => j.code === c.code) && o("remove", "vocabularies", c.code);
    }
    function L(c) {
      return !!t.schema.vocabularies[c];
    }
    const J = Y({}), H = Y({}), x = Y({}), r = Y({}), w = Y({}), d = Y({}), S = Y({}), O = Y({});
    function M(c) {
      return !!(w.value[c] || d.value[c]);
    }
    async function ce(c, j) {
      w.value[c] = !0, delete S.value[c];
      try {
        const n = await fe.termsPage(t.catalogId, c, j);
        H.value[c] = n.terms, r.value[c] = j, x.value[c] = n.next;
        const _ = G(c);
        n.terms.some((z) => z.retired && z.code === _.parent) && (_.parent = "");
      } catch (n) {
        S.value[c] = { errors: [Fe(n, "Could not load terms.")], read: { after: j } };
      } finally {
        w.value[c] = !1;
      }
    }
    function pe(c) {
      J.value[c] = !J.value[c], J.value[c] && !M(c) && !H.value[c] && !S.value[c] && ce(c);
    }
    function G(c) {
      return O.value[c] ?? (O.value[c] = { code: "", label: "", parent: "" });
    }
    function F(c, j) {
      const n = H.value[c]?.find((_) => _.code === j);
      return n ? Be(n) : B(j);
    }
    function A(c) {
      return [{ value: "", label: "No parent" }, ...(H.value[c] ?? []).filter((j) => !j.retired).map((j) => ({ value: j.code, label: Be(j) }))];
    }
    function Q(c, j, n) {
      S.value[c] = { errors: j?.findings?.length ? j.findings.map((_) => ({ message: _.message ?? n, code: _.code })) : [{ message: n }] };
    }
    async function D(c) {
      const j = G(c.code);
      if (!(!y.value || !p.test(j.code))) {
        d.value[c.code] = !0, delete S.value[c.code];
        try {
          const n = { term: { vocabulary: c.code, code: j.code }, labels: { en: j.label || B(j.code) } };
          c.hierarchical && j.parent && (n.parent = j.parent);
          const z = (await fe.apply(t.catalogId, [n])).outcomes[0];
          if (z?.outcome !== "created" && z?.outcome !== "updated") {
            Q(c.code, z, "The term was not accepted.");
            return;
          }
          O.value[c.code] = { code: "", label: "", parent: "" }, fe.invalidateTerms(t.catalogId), await ce(c.code, r.value[c.code]);
        } catch (n) {
          S.value[c.code] = { errors: [Fe(n, "Could not add the term.")] };
        } finally {
          d.value[c.code] = !1;
        }
      }
    }
    async function W(c, j, n) {
      if (y.value && !(n && !await He.confirm({ header: "Retire term?", message: `Retire ${Be(j)}? Term changes save immediately. You can restore this term later.`, acceptLabel: "Retire", rejectLabel: "Cancel" }))) {
        d.value[c.code] = !0, delete S.value[c.code];
        try {
          const z = (await fe.apply(t.catalogId, [{ term: { vocabulary: c.code, code: j.code }, retired: n }])).outcomes[0];
          if (!z || !["updated", "unchanged"].includes(z.outcome)) {
            Q(c.code, z, "The term change was not accepted.");
            return;
          }
          n && G(c.code).parent === j.code && (G(c.code).parent = ""), fe.invalidateTerms(t.catalogId), await ce(c.code, r.value[c.code]);
        } catch (_) {
          S.value[c.code] = { errors: [Fe(_, "Could not change the term.")] };
        } finally {
          d.value[c.code] = !1;
        }
      }
    }
    return (c, j) => (e(), T(Te, {
      count: m.value.length,
      columns: ["details"]
    }, he({
      default: h(() => [
        (e(!0), i(E, null, ae(m.value, (n) => (e(), T(Pe, {
          title: s(B)(n.code),
          key: n.code
        }, {
          details: h(() => [
            a("span", Ri, k(n.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: h(() => [
            u.value ? (e(), T(s(Z), {
              key: 0,
              type: "button",
              "aria-label": "Remove " + s(B)(n.code),
              onClick: (_) => N(n),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: h(() => [
                v(s(le), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])) : f("", !0)
          ]),
          default: h(() => [
            a("div", Oi, [
              a("label", Ii, [
                v(s(ta), {
                  disabled: !u.value,
                  "aria-label": "Hierarchical " + s(B)(n.code),
                  "model-value": n.hierarchical === !0,
                  "onUpdate:modelValue": (_) => _ ? n.hierarchical = !0 : delete n.hierarchical
                }, null, 8, ["disabled", "aria-label", "model-value", "onUpdate:modelValue"]),
                j[0] || (j[0] = a("span", null, "Hierarchical", -1))
              ]),
              L(n.code) ? (e(), T(s(Z), {
                key: 0,
                type: "button",
                onClick: (_) => pe(n.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: h(() => [
                  v(s(le), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  K(" " + k(J.value[n.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : u.value ? (e(), i("span", Ti, "Apply the schema before adding terms.")) : f("", !0),
              J.value[n.code] ? (e(), i("div", Pi, [
                y.value ? (e(), i("p", qi, "Term changes save immediately.")) : f("", !0),
                w.value[n.code] ? (e(), i("div", Ni, "Loading terms…")) : S.value[n.code] ? (e(!0), i(E, { key: 2 }, ae(S.value[n.code].errors, (_, z) => (e(), T(ca, {
                  key: z,
                  error: _
                }, {
                  default: h(() => [
                    S.value[n.code].read ? (e(), T(s(Z), {
                      key: 0,
                      type: "button",
                      onClick: (X) => ce(n.code, S.value[n.code].read?.after),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: h(() => [...j[1] || (j[1] = [
                        K("Retry", -1)
                      ])]),
                      _: 1
                    }, 8, ["onClick"])) : f("", !0)
                  ]),
                  _: 2
                }, 1032, ["error"]))), 128)) : f("", !0),
                (H.value[n.code] ?? []).length ? (e(), i("div", Di, [
                  a("table", zi, [
                    a("thead", null, [
                      a("tr", null, [
                        j[2] || (j[2] = a("th", null, "Term", -1)),
                        n.hierarchical ? (e(), i("th", Bi, "Parent")) : f("", !0),
                        u.value ? (e(), i("th", Li)) : f("", !0)
                      ])
                    ]),
                    a("tbody", null, [
                      (e(!0), i(E, null, ae(H.value[n.code], (_) => (e(), i("tr", {
                        key: _.code,
                        class: xe({ muted: _.retired })
                      }, [
                        a("td", null, [
                          K(k(s(Be)(_)) + " ", 1),
                          _.retired ? (e(), T(s(ge), {
                            key: 0,
                            severity: "secondary",
                            value: "Retired"
                          })) : f("", !0)
                        ]),
                        n.hierarchical ? (e(), i("td", Fi, k(_.parent ? F(n.code, _.parent) : "—"), 1)) : f("", !0),
                        u.value ? (e(), i("td", Ei, [
                          v(s(Z), {
                            type: "button",
                            disabled: !y.value || M(n.code),
                            onClick: (z) => W(n, _, !_.retired),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: h(() => [
                              K(k(_.retired ? "Restore" : "Retire"), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled", "onClick"])
                        ])) : f("", !0)
                      ], 2))), 128))
                    ])
                  ]),
                  a("ul", Mi, [
                    (e(!0), i(E, null, ae(H.value[n.code], (_) => (e(), i("li", {
                      key: _.code,
                      class: xe(["pim-stacked-row", { muted: _.retired }])
                    }, [
                      a("div", null, [
                        K(k(s(Be)(_)) + " ", 1),
                        _.retired ? (e(), T(s(ge), {
                          key: 0,
                          severity: "secondary",
                          value: "Retired"
                        })) : f("", !0)
                      ]),
                      n.hierarchical && _.parent ? (e(), i("div", Wi, "Parent: " + k(F(n.code, _.parent)), 1)) : f("", !0),
                      u.value ? (e(), T(s(Z), {
                        key: 1,
                        type: "button",
                        disabled: !y.value || M(n.code),
                        onClick: (z) => W(n, _, !_.retired),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: h(() => [
                          K(k(_.retired ? "Restore" : "Retire"), 1)
                        ]),
                        _: 2
                      }, 1032, ["disabled", "onClick"])) : f("", !0)
                    ], 2))), 128))
                  ])
                ])) : H.value[n.code] && !M(n.code) && !S.value[n.code] ? (e(), i("p", Hi, "No terms yet.")) : f("", !0),
                a("div", Ji, [
                  v(s(Z), {
                    type: "button",
                    disabled: M(n.code) || !r.value[n.code],
                    onClick: (_) => ce(n.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: h(() => [
                      v(s(le), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      j[3] || (j[3] = K(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  v(s(Z), {
                    type: "button",
                    disabled: M(n.code) || !x.value[n.code],
                    onClick: (_) => ce(n.code, x.value[n.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: h(() => [
                      v(s(le), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      j[4] || (j[4] = K(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                u.value ? (e(), i("div", Ki, [
                  v(s(Ge), {
                    modelValue: G(n.code).label,
                    "onUpdate:modelValue": (_) => G(n.code).label = _,
                    disabled: !y.value || M(n.code),
                    "aria-label": "Term name in English",
                    type: "text",
                    placeholder: "Term name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  v(s(Ge), {
                    modelValue: G(n.code).code,
                    "onUpdate:modelValue": (_) => G(n.code).code = _,
                    disabled: !y.value || M(n.code),
                    type: "text",
                    "aria-label": "Short term name",
                    placeholder: "Short name for imports",
                    class: "narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  n.hierarchical ? (e(), T(s(_e), {
                    key: 0,
                    modelValue: G(n.code).parent,
                    "onUpdate:modelValue": (_) => G(n.code).parent = _,
                    disabled: !y.value || M(n.code),
                    class: "narrow",
                    "aria-label": "Parent term",
                    placeholder: "No parent",
                    options: A(n.code),
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "options"])) : f("", !0),
                  v(s(Z), {
                    type: "button",
                    disabled: !y.value || M(n.code) || !p.test(G(n.code).code),
                    onClick: (_) => D(n),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: h(() => [
                      v(s(le), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      j[5] || (j[5] = K(" Add term", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])) : f("", !0),
                v(Re, {
                  class: "pim-ia-disclosure",
                  label: "Integration keys"
                }, {
                  default: h(() => [
                    (H.value[n.code] ?? []).length ? (e(), i("dl", Gi, [
                      (e(!0), i(E, null, ae(H.value[n.code], (_) => (e(), i(E, {
                        key: _.code
                      }, [
                        a("dt", null, k(s(Be)(_)), 1),
                        a("dd", null, [
                          a("code", null, k(_.code), 1)
                        ])
                      ], 64))), 128))
                    ])) : f("", !0)
                  ]),
                  _: 2
                }, 1024)
              ])) : f("", !0)
            ])
          ]),
          _: 2
        }, 1032, ["title"]))), 128))
      ]),
      _: 2
    }, [
      u.value ? {
        name: "add",
        fn: h(() => [
          v(Ie, {
            label: "Vocabulary name",
            "from-name": "",
            action: "Add vocabulary",
            existing: m.value.map((n) => n.code),
            onAdd: V
          }, {
            default: h(() => [...j[6] || (j[6] = [
              a("span", { class: "muted small" }, "Select fields pick their values from a vocabulary's terms.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), Zi = { class: "pim-stack" }, Qi = { class: "muted small" }, Xi = { class: "muted small" }, en = { class: "pim-aspect" }, an = { class: "pim-ia-action pim-family-fields" }, ln = { class: "pim-f" }, tn = { class: "pim-f-label" }, sn = ["id"], nn = ["id"], on = { class: "pim-aspect" }, dn = { class: "pim-stack tight" }, rn = { class: "pim-level-head" }, un = { class: "pim-fields" }, cn = { class: "pim-f pim-w-half" }, mn = { class: "pim-f-label" }, pn = ["id"], vn = { class: "pim-f pim-w-half" }, fn = { class: "pim-f-label" }, bn = ["id"], yn = { class: "pim-aspect" }, gn = { class: "pim-stack tight" }, hn = { class: "pim-level-head" }, kn = { class: "muted small" }, _n = { class: "pim-fields" }, wn = { class: "pim-f-label" }, $n = ["id"], Cn = { class: "pim-f pim-w-half" }, xn = { class: "pim-f-label" }, Vn = ["id"], Un = { class: "pim-f pim-w-half" }, jn = { class: "pim-f-label" }, An = ["id"], Sn = {
  key: 0,
  class: "pim-aspect pim-family-remove"
}, Rn = /* @__PURE__ */ re({
  __name: "BuilderFamilies",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove", "fields"],
  setup(l, { emit: b }) {
    const t = l, o = b, p = qe();
    function u(c, j) {
      return p + "-" + c.code + "-" + j;
    }
    const y = q(() => t.schema.access.admin), m = q(() => (t.draft.families ?? []).filter((c) => c.code !== "generic")), V = q(() => {
      const c = new Set(t.draft.plugins?.map((j) => j.use));
      return Object.entries(t.schema.attributes).filter(([, j]) => j.plugin && c.has(j.plugin));
    }), N = q(() => {
      const c = (t.draft.aspects ?? []).map((n) => n.namespace), j = [...new Set(V.value.map(([n]) => n.split(".")[0]))];
      return [...c, ...j.filter((n) => !c.includes(n))].map((n) => ({ value: n, label: B(n) }));
    });
    function L(c) {
      const j = N.value, n = (c.aspects ?? []).filter((_) => !j.some((z) => z.value === _));
      return [...j, ...n.map((_) => ({ value: _, label: B(_) }))];
    }
    const J = q(() => new Map(t.options.types.map((c) => [c.id, c.form])));
    function H(c, j = []) {
      const n = /* @__PURE__ */ new Map();
      return [.../* @__PURE__ */ new Set([...c, ...j])].map((z) => {
        const [X, te] = z.split(".", 2), ie = B(te ?? X);
        return n.set(ie, (n.get(ie) ?? 0) + 1), { value: z, label: ie, group: te ? B(X) : void 0 };
      }).map(({ value: z, label: X, group: te }) => ({
        value: z,
        label: X,
        detail: n.get(X) > 1 ? te : void 0
      }));
    }
    const x = q(() => {
      const c = /* @__PURE__ */ new Map();
      function j(n, _, z = [], X = "one") {
        const te = !!_ && _ !== "text" && _ !== "record" && z.length === 0 && X === "one";
        c.set(n, te);
      }
      for (const n of t.draft.aspects ?? [])
        for (const _ of n.attributes ?? []) {
          const z = n.namespace + "." + _.code;
          j(z, J.value.get(_.type), _.scope, _.cardinality);
        }
      for (const [n, _] of V.value) j(n, _.form, _.scope, _.cardinality);
      return c;
    });
    function r(c) {
      return [...x.value.keys()].filter((j) => c.aspects?.includes(j.split(".")[0]));
    }
    function w(c, j, n) {
      const _ = j[n] ?? [], z = new Set(G(c).flatMap((te) => [...te.axes ?? [], ...te.own ?? []])), X = r(c).filter((te) => _.includes(te) || !z.has(te) && (n === "own" || x.value.get(te)));
      return H(X, _);
    }
    const d = q(() => t.draft.channels ?? []);
    function S(c, j) {
      return d.value.filter((n) => (!n.families?.length || n.families.includes(c.code)) && (!j || n.requirements?.includes(j))).map((n) => B(n.id));
    }
    const O = q(() => t.draft.dimensions ?? []), M = Y({});
    function ce(c) {
      (t.draft.families ??= []).push({ code: c, aspects: [] }), M.value[c] = !0;
    }
    function pe(c) {
      t.draft.families.splice(t.draft.families.indexOf(c), 1), t.schema.declaration.families?.some((j) => j.code === c.code) && o("remove", "families", c.code);
    }
    function G(c) {
      return c.variation ?? [];
    }
    function F(c) {
      (c.variation ??= []).push({ axes: [] });
    }
    function A(c) {
      return c.requirements ?? [];
    }
    function Q(c, j) {
      (c.requirements ??= []).push({ id: j, require: [] });
    }
    function D(c, j) {
      return c.context?.[j] ?? "";
    }
    function W(c, j, n) {
      const _ = { ...c.context ?? {} };
      n ? _[j] = n : delete _[j], Object.keys(_).length ? c.context = _ : delete c.context;
    }
    return (c, j) => (e(), i("div", Zi, [
      v(Te, {
        count: m.value.length,
        columns: ["details"]
      }, he({
        default: h(() => [
          (e(!0), i(E, null, ae(m.value, (n) => (e(), T(Pe, {
            key: n.code,
            open: M.value[n.code],
            "onUpdate:open": (_) => M.value[n.code] = _,
            title: s(B)(n.code)
          }, {
            details: h(() => [
              a("span", Qi, k(r(n).length) + " fields", 1),
              G(n).length ? (e(), T(s(ge), {
                key: 0,
                severity: "secondary",
                value: G(n).length + (G(n).length === 1 ? " variant level" : " variant levels")
              }, null, 8, ["value"])) : f("", !0),
              a("span", Xi, k(S(n).join(", ") || "No release channels"), 1)
            ]),
            default: h(() => [
              a("div", en, [
                a("div", an, [
                  a("div", ln, [
                    a("div", tn, [
                      a("label", {
                        id: u(n, "groups")
                      }, "Field groups", 8, sn)
                    ]),
                    a("p", {
                      id: u(n, "groups-help"),
                      class: "muted small pim-axis-help"
                    }, "Choose the groups that appear on this family’s product forms.", 8, nn),
                    v(s(Ea), {
                      disabled: !y.value,
                      "aria-labelledby": u(n, "groups"),
                      "aria-describedby": u(n, "groups-help"),
                      "model-value": n.aspects ?? [],
                      options: L(n),
                      "option-label": "label",
                      "option-value": "value",
                      placeholder: "Choose field groups",
                      display: "chip",
                      "append-to": "self",
                      "onUpdate:modelValue": (_) => s(Le)(n, "aspects", _)
                    }, null, 8, ["disabled", "aria-labelledby", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])
                  ]),
                  n.aspects?.length ? (e(), T(s(Z), {
                    key: 0,
                    type: "button",
                    label: "View family fields",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (_) => o("fields", n.code)
                  }, null, 8, ["onClick"])) : f("", !0)
                ])
              ]),
              a("div", on, [
                j[3] || (j[3] = a("header", { class: "pim-aspect-head" }, [
                  a("h3", null, "Variants")
                ], -1)),
                j[4] || (j[4] = a("p", { class: "muted small pim-axis-help" }, "Choose what makes one variant different from another. Each field can be used once.", -1)),
                a("div", dn, [
                  (e(!0), i(E, null, ae(G(n), (_, z) => (e(), i("div", {
                    key: z,
                    class: "pim-level"
                  }, [
                    a("div", rn, [
                      a("strong", null, "Level " + k(z + 1), 1),
                      y.value ? (e(), T(s(Z), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove level",
                        onClick: (X) => G(n).splice(z, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: h(() => [
                          v(s(le), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : f("", !0)
                    ]),
                    a("div", un, [
                      a("div", cn, [
                        a("div", mn, [
                          a("label", {
                            id: u(n, z + "-axes")
                          }, "Distinguish variants by", 8, pn)
                        ]),
                        j[0] || (j[0] = a("p", { class: "muted small pim-axis-help" }, "Choose a single-value field with no dimensions. Text and record fields are excluded.", -1)),
                        v(Ue, {
                          disabled: !y.value,
                          dropdown: "",
                          labelledby: u(n, z + "-axes"),
                          "model-value": _.axes ?? [],
                          options: w(n, _, "axes"),
                          placeholder: "Add an axis",
                          "onUpdate:modelValue": (X) => _.axes = X
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]),
                      a("div", vn, [
                        a("div", fn, [
                          a("label", {
                            id: u(n, z + "-owned")
                          }, "Other fields edited here", 8, bn)
                        ]),
                        j[1] || (j[1] = a("p", { class: "muted small pim-axis-help" }, "Other fields you edit at this level.", -1)),
                        v(Ue, {
                          disabled: !y.value,
                          dropdown: "",
                          labelledby: u(n, z + "-owned"),
                          "model-value": _.own ?? [],
                          options: w(n, _, "own"),
                          placeholder: "Add a field",
                          "onUpdate:modelValue": (X) => X.length ? _.own = X : delete _.own
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  y.value ? (e(), T(s(Z), {
                    key: 0,
                    type: "button",
                    class: "pim-add-level",
                    onClick: (_) => F(n),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: h(() => [
                      v(s(le), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      j[2] || (j[2] = K(" Add level", -1))
                    ]),
                    _: 1
                  }, 8, ["onClick"])) : f("", !0)
                ])
              ]),
              a("div", yn, [
                j[7] || (j[7] = a("header", { class: "pim-family-requirements-head" }, [
                  a("h3", null, "Release requirements"),
                  a("p", { class: "muted small" }, "Choose what products need before they can be released to a channel.")
                ], -1)),
                a("div", gn, [
                  (e(!0), i(E, null, ae(A(n), (_, z) => (e(), i("div", {
                    key: _.id,
                    class: "pim-level"
                  }, [
                    a("div", hn, [
                      a("div", null, [
                        a("strong", null, k(s(B)(_.id)), 1),
                        a("p", kn, k(S(n, _.id).join(", ") || "Unused by channels"), 1)
                      ]),
                      y.value ? (e(), T(s(Z), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove requirement",
                        onClick: (X) => A(n).splice(z, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: h(() => [
                          v(s(le), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : f("", !0)
                    ]),
                    a("div", _n, [
                      (e(!0), i(E, null, ae(O.value, (X) => (e(), i("div", {
                        key: X.name,
                        class: "pim-f pim-w-third"
                      }, [
                        a("div", wn, [
                          a("label", {
                            id: u(n, _.id + "-context-" + X.name)
                          }, k(s(B)(X.name)), 9, $n)
                        ]),
                        v(s(_e), {
                          disabled: !y.value,
                          "aria-labelledby": u(n, _.id + "-context-" + X.name),
                          "model-value": D(_, X.name),
                          "onUpdate:modelValue": (te) => W(_, X.name, te),
                          options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ...X.members.map((te) => ({ value: te, label: String(te) }))],
                          "option-label": "label",
                          "option-value": "value",
                          appendTo: "self"
                        }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                      ]))), 128)),
                      a("div", Cn, [
                        a("div", xn, [
                          a("label", {
                            id: u(n, _.id + "-required")
                          }, "Required", 8, Vn)
                        ]),
                        j[5] || (j[5] = a("p", { class: "muted small pim-axis-help" }, "These fields must have a value.", -1)),
                        v(Ue, {
                          disabled: !y.value,
                          dropdown: "",
                          labelledby: u(n, _.id + "-required"),
                          "model-value": _.require ?? [],
                          placeholder: "Add a required field",
                          options: H(r(n), _.require),
                          "onUpdate:modelValue": (X) => s(Le)(_, "require", X)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]),
                      a("div", Un, [
                        a("div", jn, [
                          a("label", {
                            id: u(n, _.id + "-authored")
                          }, "Entered for this context", 8, An)
                        ]),
                        j[6] || (j[6] = a("p", { class: "muted small pim-axis-help" }, "These fields need a value set directly for the selected context.", -1)),
                        v(Ue, {
                          disabled: !y.value,
                          dropdown: "",
                          labelledby: u(n, _.id + "-authored"),
                          "model-value": _.authored ?? [],
                          placeholder: "Add a field to author",
                          options: H(r(n), _.authored),
                          "onUpdate:modelValue": (X) => s(Le)(_, "authored", X)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  y.value ? (e(), T(Ie, {
                    key: 0,
                    label: "Requirement name",
                    action: "Add requirement",
                    "from-name": "",
                    existing: A(n).map((_) => _.id),
                    onAdd: (_) => Q(n, _)
                  }, null, 8, ["existing", "onAdd"])) : f("", !0)
                ])
              ]),
              y.value ? (e(), i("div", Sn, [
                v(s(Z), {
                  type: "button",
                  label: "Remove family",
                  severity: "danger",
                  text: "",
                  size: "small",
                  onClick: (_) => pe(n)
                }, null, 8, ["onClick"])
              ])) : f("", !0)
            ]),
            _: 2
          }, 1032, ["open", "onUpdate:open", "title"]))), 128))
        ]),
        _: 2
      }, [
        y.value ? {
          name: "head",
          fn: h(() => [
            v(Ie, {
              label: "Family name",
              action: "Add family",
              "from-name": "",
              existing: m.value.map((n) => n.code),
              onAdd: ce
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])
    ]));
  }
}), On = ["inert"], In = {
  key: 0,
  class: "row wrap"
}, Tn = {
  key: 2,
  class: "small muted"
}, Pn = { class: "pim-principal-service" }, qn = /* @__PURE__ */ re({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(l, { emit: b }) {
    const t = l, o = b, p = Y(!1), u = Y(""), y = Y({});
    let m = 0;
    be(() => t.modelValue, async (H) => {
      const x = ++m;
      try {
        const r = await Wa(t.catalogId ?? "", H);
        x === m && (y.value = r);
      } catch {
        x === m && (y.value = {});
      }
    }, { immediate: !0, deep: !0 }), Ye(() => {
      m++;
    });
    function V(H) {
      return y.value[H] ?? ne(H, "Person");
    }
    La(async () => {
      try {
        await Sl("wc-principal-picker"), p.value = !0;
      } catch {
        p.value = !1;
      }
    });
    function N(H) {
      t.disabled || !H.trim() || t.modelValue.includes(H.trim()) || (o("update:modelValue", [...t.modelValue, H.trim()]), u.value = "");
    }
    function L(H) {
      const x = H.detail;
      if (!x || typeof x != "object") return;
      const r = x, w = r.principal_id ?? r.id;
      typeof w == "string" && N(w);
    }
    function J(H) {
      t.disabled || o("update:modelValue", t.modelValue.filter((x) => x !== H));
    }
    return (H, x) => (e(), i("div", {
      class: "pim-principal-list",
      inert: l.disabled || void 0
    }, [
      l.modelValue.length ? (e(), i("div", In, [
        (e(!0), i(E, null, ae(l.modelValue, (r) => (e(), T(s(ge), {
          key: r,
          severity: "secondary"
        }, {
          default: h(() => [
            a("span", null, k(V(r)), 1),
            v(s(Z), {
              text: "",
              size: "small",
              disabled: l.disabled,
              "aria-label": "Remove " + V(r),
              onClick: (w) => J(r)
            }, {
              default: h(() => [
                v(s(le), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : f("", !0),
      p.value ? (e(), i("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: Oe(L, ["stop"])
      }, null, 32)) : (e(), i("span", Tn, "The person picker is unavailable.")),
      a("label", Pn, [
        x[3] || (x[3] = a("span", { class: "small muted" }, "Service account", -1)),
        v(s(Ge), {
          modelValue: u.value,
          "onUpdate:modelValue": x[0] || (x[0] = (r) => u.value = r),
          disabled: l.disabled,
          placeholder: "Service principal id",
          onKeydown: x[1] || (x[1] = la(Oe((r) => N(u.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "disabled"])
      ]),
      v(s(Z), {
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: l.disabled || !u.value.trim(),
        onClick: x[2] || (x[2] = (r) => N(u.value))
      }, {
        default: h(() => [
          v(s(le), { icon: "tabler:plus" }),
          x[4] || (x[4] = K(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, On));
  }
}), Nn = { class: "pim-stack" }, Dn = { class: "muted small" }, zn = { class: "muted small" }, Bn = { class: "pim-fields" }, Ln = { class: "pim-f pim-w-half" }, Fn = { class: "pim-f-label" }, En = ["id"], Mn = { class: "pim-f pim-w-half" }, Wn = { class: "pim-f-label" }, Hn = ["id"], Jn = { class: "muted small" }, Kn = { class: "pim-fields" }, Gn = { class: "pim-f pim-w-third" }, Yn = { class: "pim-f-label" }, Zn = ["id"], Qn = { class: "pim-f pim-w-third" }, Xn = { class: "pim-f-label" }, eo = ["for"], ao = { class: "row" }, lo = ["aria-labelledby"], to = { class: "pim-f-label" }, so = ["id"], io = { key: 1 }, no = { class: "pim-f pim-w-full" }, oo = { class: "pim-f-label" }, ro = ["id"], uo = /* @__PURE__ */ re({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {},
    view: {}
  },
  emits: ["remove"],
  setup(l, { emit: b }) {
    const t = l, o = b, p = qe();
    function u(d, S) {
      return p + "-" + d + "-" + S;
    }
    const y = q(() => t.schema.access.admin), m = q(() => t.draft.channels ?? []), V = q(() => t.draft.sources ?? []), N = q(() => [...new Set((t.draft.families ?? []).flatMap((d) => (d.requirements ?? []).map((S) => S.id)))].map((d) => ({ value: d, label: B(d) }))), L = q(() => (t.draft.families ?? []).filter((d) => d.code !== "generic").map((d) => ({ value: d.code, label: B(d.code) }))), J = q(() => (t.draft.aspects ?? []).map((d) => ({ value: d.namespace, label: B(d.namespace) })));
    function H(d) {
      (t.draft.channels ??= []).push({ id: d, requirements: [] });
    }
    function x(d) {
      m.value.splice(m.value.indexOf(d), 1), t.schema.declaration.channels?.some((S) => S.id === d.id) && o("remove", "channels", d.id);
    }
    function r(d) {
      (t.draft.sources ??= []).push({ id: d, ordering: "none", writes: [] });
    }
    function w(d) {
      V.value.splice(V.value.indexOf(d), 1), t.schema.declaration.sources?.some((S) => S.id === d.id) && o("remove", "sources", d.id);
    }
    return (d, S) => (e(), i("div", Nn, [
      l.view !== "sources" ? (e(), T(Te, {
        key: 0,
        count: m.value.length,
        columns: ["details"]
      }, he({
        default: h(() => [
          (e(!0), i(E, null, ae(m.value, (O) => (e(), T(Pe, {
            key: O.id,
            title: s(B)(O.id)
          }, he({
            details: h(() => [
              a("span", Dn, k(O.families?.length ? O.families.map(s(B)).join(", ") : "All families"), 1),
              a("span", zn, k(O.requirements?.length ? O.requirements.map(s(B)).join(", ") : "No release requirements"), 1)
            ]),
            default: h(() => [
              a("div", Bn, [
                a("div", Ln, [
                  a("div", Fn, [
                    a("label", {
                      id: u(O.id, "requirements")
                    }, "Release requirements", 8, En),
                    S[0] || (S[0] = a("span", { class: "pim-f-note" }, "a product is ready for the channel when these hold", -1))
                  ]),
                  v(Ue, {
                    disabled: !y.value,
                    labelledby: u(O.id, "requirements"),
                    "model-value": O.requirements ?? [],
                    options: N.value,
                    "onUpdate:modelValue": (M) => s(Le)(O, "requirements", M)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                a("div", Mn, [
                  a("div", Wn, [
                    a("label", {
                      id: u(O.id, "families")
                    }, "Families", 8, Hn),
                    S[1] || (S[1] = a("span", { class: "pim-f-note" }, "empty means every family", -1))
                  ]),
                  v(Ue, {
                    disabled: !y.value,
                    labelledby: u(O.id, "families"),
                    "model-value": O.families ?? [],
                    options: L.value,
                    "onUpdate:modelValue": (M) => s(Le)(O, "families", M)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            y.value ? {
              name: "actions",
              fn: h(() => [
                v(s(Z), {
                  type: "button",
                  onClick: (M) => x(O),
                  "aria-label": "Remove " + s(B)(O.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: h(() => [
                    v(s(le), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["onClick", "aria-label"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["title"]))), 128))
        ]),
        _: 2
      }, [
        y.value ? {
          name: "head",
          fn: h(() => [
            v(Ie, {
              label: "Channel name",
              action: "Add channel",
              "from-name": "",
              existing: m.value.map((O) => O.id),
              onAdd: H
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])) : f("", !0),
      l.view !== "channels" ? (e(), T(Te, {
        key: 1,
        count: V.value.length,
        columns: ["details"]
      }, he({
        default: h(() => [
          (e(!0), i(E, null, ae(V.value, (O) => (e(), T(Pe, {
            key: O.id,
            title: s(B)(O.id)
          }, he({
            details: h(() => [
              a("span", Jn, k(O.writes?.length ? O.writes.map(s(B)).join(", ") : "No field groups selected"), 1)
            ]),
            default: h(() => [
              a("div", Kn, [
                a("div", Gn, [
                  a("div", Yn, [
                    a("label", {
                      id: u(O.id, "ordering")
                    }, "Handle incoming updates", 8, Zn),
                    S[2] || (S[2] = a("span", { class: "pim-f-note" }, "sequence keeps late deliveries from winning", -1))
                  ]),
                  v(s(_e), {
                    disabled: !y.value,
                    "aria-labelledby": u(O.id, "ordering"),
                    "model-value": O.ordering ?? "none",
                    "onUpdate:modelValue": (M) => O.ordering = M,
                    options: [{ value: "none", label: "Use arrival order" }, { value: "sequence", label: "Use the source’s sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                a("div", Qn, [
                  a("div", Xn, [
                    a("label", {
                      for: u(O.id, "audit")
                    }, "Audit", 8, eo),
                    S[3] || (S[3] = a("span", { class: "pim-f-note" }, "record each value change", -1))
                  ]),
                  a("div", ao, [
                    v(s(ta), {
                      disabled: !y.value,
                      "input-id": u(O.id, "audit"),
                      "model-value": O.audit !== !1,
                      "onUpdate:modelValue": (M) => M ? delete O.audit : O.audit = !1
                    }, null, 8, ["disabled", "input-id", "model-value", "onUpdate:modelValue"]),
                    a("span", null, k(O.audit === !1 ? "Off for this source" : "Follow catalog audit settings"), 1)
                  ])
                ]),
                a("div", {
                  class: "pim-f pim-w-third",
                  role: "group",
                  "aria-labelledby": u(O.id, "people")
                }, [
                  a("div", to, [
                    a("label", {
                      id: u(O.id, "people")
                    }, "People and service accounts", 8, so),
                    S[4] || (S[4] = a("span", { class: "pim-f-note" }, "who may write as this source", -1))
                  ]),
                  y.value ? (e(), T(qn, {
                    key: 0,
                    "catalog-id": l.catalogId,
                    "model-value": O.principals ?? [],
                    "onUpdate:modelValue": (M) => s(Le)(O, "principals", M)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])) : (e(), i("span", io, k(O.principals?.length ? O.principals.length + (O.principals.length === 1 ? " allowed account" : " allowed accounts") : "No accounts specified"), 1))
                ], 8, lo),
                a("div", no, [
                  a("div", oo, [
                    a("label", {
                      id: u(O.id, "writes")
                    }, "Field groups it can update", 8, ro),
                    S[5] || (S[5] = a("span", { class: "pim-f-note" }, "field groups this source may set", -1))
                  ]),
                  v(Ue, {
                    disabled: !y.value,
                    labelledby: u(O.id, "writes"),
                    "model-value": O.writes ?? [],
                    options: J.value,
                    "onUpdate:modelValue": (M) => s(Le)(O, "writes", M)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            y.value ? {
              name: "actions",
              fn: h(() => [
                v(s(Z), {
                  type: "button",
                  onClick: (M) => w(O),
                  "aria-label": "Remove " + s(B)(O.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: h(() => [
                    v(s(le), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["onClick", "aria-label"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["title"]))), 128))
        ]),
        _: 2
      }, [
        y.value ? {
          name: "head",
          fn: h(() => [
            v(Ie, {
              label: "Source name",
              action: "Add source",
              "from-name": "",
              existing: V.value.map((O) => O.id),
              onAdd: r
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])) : f("", !0)
    ]));
  }
}), co = {
  failed: { label: "Setup failed", severity: "danger" },
  paused: { label: "Background update paused", severity: "warn" },
  degraded: { label: "Degraded", severity: "warn" },
  catchingUp: { label: "Catching up", severity: "info" },
  config: { label: "Configuration needed", severity: "warn" },
  reset: { label: "Reset required", severity: "warn" },
  uninstalled: { label: "Uninstalled · still referenced", severity: "warn" },
  pending: { label: "Setting up", severity: "info" }
};
function Ja(l, b) {
  return !l.parked && (l.bootstrapping || l.last_seq < b);
}
function mo(l, b) {
  return !l.active || !l.installed || l.problem || l.lifecycle.state === "failed" ? !1 : l.lifecycle.state === "pending" || Object.values(l.projections).some((t) => Ja(t, b));
}
function po(l, b) {
  const t = l.problem ?? l.lifecycle.error, o = Object.entries(l.projections), p = o.find(([, y]) => y.parked) ?? o.find(([, y]) => y.error) ?? o.find(([, y]) => Ja(y, b));
  let u;
  return l.active && !l.installed ? u = "uninstalled" : t?.code === "plugin_config_invalid" ? u = "config" : t?.code === "plugin_projection_history_pruned" ? u = "reset" : t || l.lifecycle.state === "failed" ? u = "failed" : l.active && p?.[1].parked ? u = "paused" : l.active && p?.[1].error ? u = "degraded" : l.active && p ? u = "catchingUp" : l.active && l.lifecycle.state === "pending" && (u = "pending"), u ? { kind: u, ...co[u], error: t, projection: p } : void 0;
}
function vo(l) {
  return (l.problem ?? l.lifecycle.error)?.code === "plugin_interface_version_unsupported";
}
const fo = { class: "pim-stack" }, bo = { class: "pim-bsection-head" }, yo = { class: "muted small" }, go = {
  key: 0,
  class: "pim-aspect muted"
}, ho = {
  key: 0,
  class: "muted small"
}, ko = { class: "pim-stack pim-plugin-recovery" }, _o = {
  key: 0,
  class: "muted small"
}, wo = {
  key: 1,
  class: "muted small"
}, $o = { key: 0 }, Co = { key: 1 }, xo = { key: 0 }, Vo = { key: 0 }, Uo = { key: 0 }, jo = { key: 1 }, Ao = { key: 2 }, So = { key: 3 }, Ro = { key: 0 }, Oo = {
  key: 0,
  class: "pim-ia-action"
}, Io = {
  key: 0,
  class: "pim-ia-dialog"
}, To = { class: "pim-ia-dialog-head" }, Po = { key: 1 }, qo = { key: 2 }, No = { class: "row pim-ia-dialog-actions" }, Do = {
  key: 0,
  class: "pim-aspect muted"
}, zo = { class: "row wrap muted small" }, Bo = /* @__PURE__ */ re({
  __name: "BuilderPlugins",
  props: {
    draft: {},
    schema: {},
    options: {},
    pluginConfigs: { default: () => ({}) },
    refusal: {},
    stale: { type: Boolean }
  },
  emits: ["remove", "configure", "reset", "resume", "refresh", "review", "clearShellBinding", "clearRefusal"],
  setup(l, { emit: b }) {
    const t = l, o = b, p = /* @__PURE__ */ new Map([
      ["eq", "Equals"],
      ["in", "Is one of"],
      ["gt", "Greater than"],
      ["gte", "At least"],
      ["lt", "Less than"],
      ["lte", "At most"]
    ]), u = Y({});
    be(() => t.refusal, (F) => {
      F && (u.value[F.plugin] = !0);
    }, { immediate: !0 });
    const y = Y(), m = q(() => r.value.find((F) => F.plugin.plugin === y.value)), V = q(() => m.value?.plugin), N = q(() => t.options.plugins.filter((F) => F.installed).length), L = q(() => t.schema.access.admin), J = q(() => t.draft.plugins ?? []), H = q(() => new Map(t.schema.plugins.map((F) => [F.plugin, F]))), x = q(() => {
      const F = /* @__PURE__ */ new Map();
      for (const [A, Q] of Object.entries(t.schema.attributes)) {
        if (!Q.plugin) continue;
        const D = F.get(Q.plugin) ?? [];
        D.push(B(A)), F.set(Q.plugin, D);
      }
      return F;
    }), r = q(() => t.options.plugins.map((F) => {
      const A = H.value.get(F.plugin) ?? F, Q = po(A, t.schema.as_of), D = J.value.some((c) => c.use === A.plugin), W = t.refusal?.plugin === A.plugin ? t.refusal : void 0;
      return {
        option: F,
        plugin: A,
        status: Q,
        chosen: D,
        refusal: W,
        title: ne(A.title ?? F.title, A.installed ? "Plugin" : "Unavailable plugin"),
        label: W ? "Configuration needed" : !A.active && Q?.kind === "failed" ? "Unavailable" : Q?.label ?? (D ? A.active ? "Enabled" : "Will enable on apply" : A.active ? "Will disable on apply" : "Disabled"),
        severity: W ? "warn" : Q?.severity ?? (D ? "success" : "secondary")
      };
    }));
    function w(F, A) {
      const Q = A.map((D) => p.get(D)).filter(Boolean);
      return [B(F), Q.join(", ")].filter(Boolean).join(" · ");
    }
    function d(F, A) {
      A && !J.value.some((Q) => Q.use === F) && (t.draft.plugins ??= []).push({ use: F }), A || (t.draft.plugins = J.value.filter((Q) => Q.use !== F), delete t.pluginConfigs[F], t.refusal?.plugin === F && o("clearRefusal"), H.value.get(F)?.active && o("remove", "plugins", F));
    }
    function S(F, A) {
      u.value[F] = !0, t.pluginConfigs[F] = A, t.refusal?.plugin === F && o("clearRefusal");
    }
    const O = q(() => t.draft.scopes ?? []);
    function M(F) {
      return O.value.includes(F.id);
    }
    function ce(F, A) {
      A && !M(F) && (t.draft.scopes ??= []).push(F.id), !A && M(F) && (O.value.splice(O.value.indexOf(F.id), 1), t.schema.declaration.scopes?.includes(F.id) && o("remove", "scopes", F.id));
    }
    const pe = q(() => {
      const F = V.value;
      if (!F) return [];
      const A = F.references;
      return [
        { label: "Fields", items: (A?.fields ?? Object.entries(t.schema.attributes).filter(([, D]) => D.plugin === F.plugin).map(([D]) => D)).map((D) => ({ id: D, title: ne(B(D), "Field") })) },
        { label: "Product filter sets", items: (A?.scopes ?? []).map((D) => ({
          id: D,
          title: ne(t.options.scopes.find((W) => W.id === D)?.title, "Unavailable filter set")
        })) },
        { label: "Catalog app binding", items: (A?.shell_bindings ?? []).map((D) => ({ id: D, title: "Catalog app" })) },
        { label: "Readiness checks", items: (A?.checks ?? []).map((D) => ({ id: D, title: "Readiness check" })) },
        { label: "Dependent plugins", items: (A?.plugins ?? []).map((D) => ({
          id: D,
          title: ne(H.value.get(D)?.title, "Dependent plugin")
        })) }
      ].filter((D) => D.items.length);
    });
    function G(F) {
      for (const A of F.references?.scopes ?? [])
        O.value.includes(A) && (t.draft.scopes = O.value.filter((Q) => Q !== A), o("remove", "scopes", A));
      y.value = void 0, d(F.plugin, !1), o("review");
    }
    return (F, A) => (e(), i("div", fo, [
      v(Te, {
        count: r.value.length,
        columns: ["details"]
      }, {
        head: h(() => [
          a("header", bo, [
            A[6] || (A[6] = a("h3", null, "Plugins", -1)),
            a("span", yo, k(N.value) + " installed", 1)
          ])
        ]),
        default: h(() => [
          r.value.length === 0 ? (e(), i("div", go, "No plugin is installed.")) : f("", !0),
          (e(!0), i(E, null, ae(r.value, ({ option: Q, plugin: D, status: W, chosen: c, title: j, label: n, severity: _, refusal: z }) => (e(), T(Pe, {
            key: D.plugin,
            title: j,
            open: u.value[D.plugin] ?? !!(D.active && W && W.kind !== "pending"),
            "onUpdate:open": (X) => u.value[D.plugin] = X
          }, he({
            details: h(() => [
              v(s(ge), {
                severity: _,
                value: n
              }, null, 8, ["severity", "value"]),
              !W && Q.description ? (e(), i("span", ho, k(s(ne)(Q.description, "Adds capabilities to this catalog.")), 1)) : f("", !0)
            ]),
            default: h(() => [
              a("div", ko, [
                x.value.get(D.plugin)?.length ? (e(), i("p", _o, " Adds fields for " + k(x.value.get(D.plugin)?.join(", ")) + ". ", 1)) : f("", !0),
                D.active && W?.kind === "failed" && W.projection?.[1].parked ? (e(), i("p", wo, " Background update: Paused ")) : f("", !0),
                W?.kind === "failed" ? (e(), i(E, { key: 2 }, [
                  v(s(we), {
                    severity: "warn",
                    role: "alert"
                  }, {
                    default: h(() => [
                      s(vo)(D) ? (e(), i(E, { key: 0 }, [
                        K("This package uses a plugin interface this deployment cannot run. Restore a compatible package to use this plugin.")
                      ], 64)) : (e(), i(E, { key: 1 }, [
                        K("The catalog could not set up this plugin. Check the status after resolving the setup problem.")
                      ], 64))
                    ]),
                    _: 2
                  }, 1024),
                  v(Re, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: h(() => [
                      a("p", null, [
                        A[7] || (A[7] = K("Plugin ", -1)),
                        a("code", null, k(D.plugin), 1)
                      ]),
                      W.error?.message ? (e(), i("p", $o, k(W.error.message), 1)) : f("", !0),
                      W.error?.code ? (e(), i("p", Co, [
                        a("code", null, k(W.error.code), 1)
                      ])) : f("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  L.value && D.references ? (e(), T(s(Z), {
                    key: 0,
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (X) => y.value = D.plugin
                  }, null, 8, ["onClick"])) : (e(), T(s(Z), {
                    key: 1,
                    label: "Check status",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: A[0] || (A[0] = (X) => o("refresh"))
                  }))
                ], 64)) : W?.kind === "reset" ? (e(), i(E, { key: 3 }, [
                  v(s(we), { severity: "warn" }, {
                    default: h(() => [
                      A[8] || (A[8] = K(" The event history this background update needs was removed. ", -1)),
                      W.error?.max_pruned_seq !== void 0 ? (e(), i("p", xo, "Earliest retained position " + k(W.error.max_pruned_seq + 1) + ".", 1)) : f("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  v(Re, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: h(() => [
                      a("p", null, [
                        A[9] || (A[9] = K("Plugin ", -1)),
                        a("code", null, k(D.plugin), 1)
                      ]),
                      W.error?.projection ? (e(), i("p", Vo, [
                        A[10] || (A[10] = K("Background update ", -1)),
                        a("code", null, k(W.error.projection), 1)
                      ])) : f("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  L.value ? (e(), T(s(Z), {
                    key: 0,
                    label: "Reset background updates",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: l.stale,
                    onClick: (X) => o("reset", D.plugin)
                  }, null, 8, ["disabled", "onClick"])) : f("", !0)
                ], 64)) : W?.projection && (W.kind === "paused" || W.kind === "degraded" || W.kind === "catchingUp") ? (e(), i(E, { key: 4 }, [
                  v(s(we), {
                    severity: W.kind === "catchingUp" ? "info" : "warn"
                  }, {
                    default: h(() => [
                      W.projection[1].status === "paused" ? (e(), i("p", Uo, "This update was paused.")) : W.kind === "paused" ? (e(), i("p", jo, "The background worker stopped.")) : W.kind === "degraded" ? (e(), i("p", Ao, "The background worker reported an error.")) : (e(), i("p", So, "This update is processing catalog changes.")),
                      a("p", null, "Last applied position " + k(W.projection[1].last_seq) + ".", 1)
                    ]),
                    _: 2
                  }, 1032, ["severity"]),
                  v(Re, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: h(() => [
                      a("p", null, [
                        A[11] || (A[11] = K("Background update ", -1)),
                        a("code", null, k(W.projection[0]), 1)
                      ]),
                      W.projection[1].error ? (e(), i("p", Ro, k(W.projection[1].error), 1)) : f("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  L.value && W.projection[1].status === "paused" && W.projection[1].cursor_id ? (e(), T(s(Z), {
                    key: 0,
                    label: "Resume background update",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: l.stale,
                    onClick: (X) => o("resume", W.projection[1].cursor_id)
                  }, null, 8, ["disabled", "onClick"])) : W.kind === "paused" && L.value ? (e(), T(s(Z), {
                    key: 1,
                    label: "Reset background updates",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: l.stale,
                    onClick: (X) => o("reset", D.plugin)
                  }, null, 8, ["disabled", "onClick"])) : (e(), T(s(Z), {
                    key: 2,
                    label: "Check status",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: A[1] || (A[1] = (X) => o("refresh"))
                  }))
                ], 64)) : W?.kind === "uninstalled" ? (e(), i(E, { key: 5 }, [
                  v(s(we), { severity: "warn" }, {
                    default: h(() => [...A[12] || (A[12] = [
                      K("The package was removed while it was still enabled for this catalog.", -1)
                    ])]),
                    _: 1
                  }),
                  v(s(Z), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (X) => y.value = D.plugin
                  }, null, 8, ["onClick"])
                ], 64)) : f("", !0),
                c && D.installed && W?.kind !== "failed" && W?.kind !== "uninstalled" ? (e(), i(E, { key: 6 }, [
                  v($a, {
                    disabled: !L.value,
                    schema: Q.config_schema,
                    "model-value": l.pluginConfigs[D.plugin] ?? D.config ?? {},
                    problem: W?.kind === "config" ? W.error : void 0,
                    "plugin-id": W?.kind === "config" ? D.plugin : void 0,
                    "problem-label": W?.error?.field && W.error.field !== "config" ? s(da)(Q.config_schema, W.error.field) : void 0,
                    refusal: z ? s(da)(Q.config_schema, z.field) + ": " + z.message : void 0,
                    "onUpdate:modelValue": (X) => S(D.plugin, X)
                  }, null, 8, ["disabled", "schema", "model-value", "problem", "plugin-id", "problem-label", "refusal", "onUpdate:modelValue"]),
                  L.value && D.active && (l.pluginConfigs[D.plugin] || W?.kind === "config") ? (e(), i("div", Oo, [
                    v(s(Z), {
                      disabled: l.stale || !l.pluginConfigs[D.plugin],
                      label: "Save configuration",
                      size: "small",
                      onClick: (X) => o("configure", D.plugin, l.pluginConfigs[D.plugin])
                    }, null, 8, ["disabled", "onClick"])
                  ])) : f("", !0)
                ], 64)) : f("", !0)
              ])
            ]),
            _: 2
          }, [
            L.value && D.installed && (!W || W.kind === "pending") ? {
              name: "actions",
              fn: h(() => [
                v(s(ta), {
                  "aria-label": "Enable " + j,
                  "model-value": c,
                  "onUpdate:modelValue": (X) => d(D.plugin, X)
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["title", "open", "onUpdate:open"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      v(oa, {
        visible: !!V.value,
        label: "Plugin references",
        onClose: A[5] || (A[5] = (Q) => y.value = void 0)
      }, {
        default: h(() => [
          m.value && V.value ? (e(), i("section", Io, [
            a("header", To, [
              a("div", null, [
                A[13] || (A[13] = a("h2", null, "Plugin references", -1)),
                a("p", null, k(m.value.title), 1)
              ])
            ]),
            pe.value.length ? (e(), i(E, { key: 0 }, [
              A[14] || (A[14] = a("p", null, "Replace or remove these references before deactivating the plugin. You can also restore the package to keep using them.", -1)),
              (e(!0), i(E, null, ae(pe.value, (Q) => (e(), i("div", {
                key: Q.label
              }, [
                a("h3", null, k(Q.label), 1),
                a("ul", null, [
                  (e(!0), i(E, null, ae(Q.items, (D) => (e(), i("li", {
                    key: D.id
                  }, k(D.title), 1))), 128))
                ])
              ]))), 128))
            ], 64)) : (e(), i("p", Po, "Use the catalog review to see what deactivating this plugin would change.")),
            V.value.references?.scopes.length && !V.value.references?.shell_bindings.length ? (e(), i("p", qo, "Reviewing removal also includes these product filter sets.")) : f("", !0),
            v(Re, {
              class: "small pim-error-code pim-ia-disclosure",
              label: "Technical details"
            }, {
              default: h(() => [
                a("p", null, [
                  A[15] || (A[15] = K("Plugin ", -1)),
                  a("code", null, k(V.value.plugin), 1)
                ]),
                (e(!0), i(E, null, ae(pe.value, (Q) => (e(), i("div", {
                  key: Q.label
                }, [
                  a("p", null, k(Q.label), 1),
                  a("ul", null, [
                    (e(!0), i(E, null, ae(Q.items, (D) => (e(), i("li", {
                      key: D.id
                    }, [
                      a("code", null, k(D.id), 1)
                    ]))), 128))
                  ])
                ]))), 128))
              ]),
              _: 1
            }),
            a("div", No, [
              L.value && V.value.references?.shell_bindings.length ? (e(), T(s(Z), {
                key: 0,
                label: "Clear catalog app binding",
                severity: "secondary",
                outlined: "",
                disabled: l.stale,
                onClick: A[2] || (A[2] = (Q) => o("clearShellBinding", V.value.references.shell_bindings[0]))
              }, null, 8, ["disabled"])) : L.value ? (e(), T(s(Z), {
                key: 1,
                label: "Review removal",
                disabled: l.stale,
                onClick: A[3] || (A[3] = (Q) => G(V.value))
              }, null, 8, ["disabled"])) : f("", !0),
              v(s(Z), {
                label: "Close",
                severity: "secondary",
                outlined: "",
                onClick: A[4] || (A[4] = (Q) => y.value = void 0)
              })
            ])
          ])) : f("", !0)
        ]),
        _: 1
      }, 8, ["visible"]),
      v(Te, {
        count: l.options.scopes.length,
        columns: ["details"]
      }, {
        head: h(() => [...A[16] || (A[16] = [
          a("header", { class: "pim-bsection-head" }, [
            a("h3", null, "Product filter sets"),
            a("span", { class: "muted small" }, "Choose additional ways to filter products.")
          ], -1)
        ])]),
        default: h(() => [
          l.options.scopes.length === 0 ? (e(), i("div", Do, "No product filter sets are available.")) : f("", !0),
          (e(!0), i(E, null, ae(l.options.scopes, (Q) => (e(), T(Pe, {
            key: Q.id,
            title: s(ne)(Q.title, "Filter set")
          }, he({
            details: h(() => [
              v(s(ge), {
                severity: M(Q) ? "success" : "secondary",
                value: M(Q) ? "Selected" : "Available"
              }, null, 8, ["severity", "value"])
            ]),
            default: h(() => [
              a("div", zo, [
                A[17] || (A[17] = a("span", null, "Filters", -1)),
                (e(!0), i(E, null, ae(Q.filters, (D, W) => (e(), T(s(ge), {
                  key: W,
                  class: "kx-tag-sm small",
                  severity: "secondary",
                  value: w(W, D.ops)
                }, null, 8, ["value"]))), 128)),
                a("span", null, k(s(B)(Q.access)) + " access required", 1)
              ])
            ]),
            _: 2
          }, [
            L.value ? {
              name: "actions",
              fn: h(() => [
                v(s(ta), {
                  "aria-label": "Use " + s(ne)(Q.title, "Filter set"),
                  "model-value": M(Q),
                  "onUpdate:modelValue": (D) => ce(Q, D)
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["title"]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
});
async function Lo(l) {
  const b = await pl(`/api/v1/pim-admin/catalogs/${encodeURIComponent(l)}/policy_defaults`, "policy defaults");
  if (b.audit !== "fields" && b.audit !== "off" || !["audit_days", "trash_days", "tombstone_days"].every((t) => typeof b[t] == "number" && Number.isSafeInteger(b[t])))
    throw new Error("Policy defaults are unavailable.");
  for (const [t, o] of Object.entries(Ka)) {
    const p = b[t];
    if (typeof p != "number" || !Number.isSafeInteger(p) || p < o.min || p > o.max) throw new Error(`Policy ${t} is unavailable.`);
  }
  return b;
}
const Ka = {
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
}, Fo = { class: "form" }, Eo = {
  key: 0,
  class: "muted small pim-policy-intro"
}, Mo = {
  key: 1,
  class: "muted small pim-policy-status",
  role: "status"
}, Wo = {
  key: 0,
  class: "pim-bsection-head"
}, Ho = { class: "pim-policy-copy" }, Jo = ["for"], Ko = ["id"], Go = { key: 0 }, Yo = {
  key: 0,
  class: "pim-policy-value"
}, Zo = {
  key: 0,
  class: "muted small"
}, Qo = /* @__PURE__ */ re({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {},
    disabled: { type: Boolean },
    defaultsOnly: { type: Boolean }
  },
  setup(l) {
    const b = l, t = Y(), o = q(() => b.defaults ?? t.value), p = Y(), u = Y(!1);
    async function y() {
      if (!(b.defaults || b.disabled)) {
        p.value = void 0, u.value = !0;
        try {
          t.value = await Lo(b.catalogId ?? "");
        } catch (d) {
          p.value = Fe(d, "Could not read policy defaults.");
        } finally {
          u.value = !1;
        }
      }
    }
    La(y);
    const m = q(() => b.draft.policy ?? {}), V = [
      { key: "audit", title: "Audit trail", hint: "Fields records each value change. Off records only lifecycle, schema and release history.", kind: "enum" },
      { key: "audit_days", title: "Audit retention (days)", hint: "0 uses the 365-day default. History always expires.", kind: "int", min: 0, max: 106751 },
      { key: "trash_days", title: "Trash window (days)", hint: "How long a deleted product stays restorable.", kind: "int", min: 1, max: 106751 },
      { key: "tombstone_days", title: "Deleted product notices (days)", hint: "How long feeds report a purged product as deleted.", kind: "int", min: 1, max: 106751 }
    ], N = {
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
    function L(d) {
      const S = Ka[d];
      return { key: d, ...S, kind: "int", hint: N[d] };
    }
    V.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(L));
    const J = ["proposal_days", "proposal_count"].map(L), H = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(L), x = [
      { id: "retention", title: "Retention", keys: V },
      { id: "proposals", title: "Proposals", keys: J },
      { id: "advanced", title: "", keys: H }
    ], r = q(() => [
      { value: "inherited", label: o.value ? `${o.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function w(d, S) {
      const O = b.draft.policy ?? (b.draft.policy = {});
      O[d] = S == null || S === "" || S === "inherited" ? !1 : S;
    }
    return (d, S) => (e(), i("section", Fo, [
      l.defaultsOnly ? f("", !0) : (e(), i("p", Eo, "Empty fields inherit the deployment settings.")),
      u.value ? (e(), i("p", Mo, "Loading deployment defaults…")) : f("", !0),
      p.value ? (e(), T(ca, {
        key: 2,
        error: p.value
      }, {
        default: h(() => [
          v(s(Z), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: y
          }, {
            default: h(() => [...S[0] || (S[0] = [
              K("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : f("", !0),
      (e(), i(E, null, ae(x, (O) => v(za(O.id === "advanced" ? Re : "section"), Ul({
        key: O.id,
        ref_for: !0
      }, O.id === "advanced" ? { label: "Advanced processing settings" } : { "aria-label": O.title }, {
        "data-policy-group": O.id,
        class: "pim-policy-group"
      }), {
        default: h(() => [
          O.title ? (e(), i("header", Wo, [
            a("h3", null, k(O.title), 1)
          ])) : f("", !0),
          (e(!0), i(E, null, ae(O.keys, (M) => (e(), i("div", {
            key: M.key,
            class: "pim-policy-row"
          }, [
            a("div", Ho, [
              a("label", {
                for: "pol-" + M.key
              }, k(M.title), 9, Jo),
              a("p", {
                id: "pol-help-" + M.key
              }, [
                K(k(M.hint), 1),
                M.global ? (e(), i("span", Go, " Managed in deployment settings.")) : f("", !0)
              ], 8, Ko)
            ]),
            l.defaultsOnly ? (e(), i("p", Yo, [
              K(k(o.value?.[M.key] === "fields" ? "Record field changes" : o.value?.[M.key] === "off" ? "Lifecycle and release history" : o.value?.[M.key] ?? "Unavailable") + " ", 1),
              m.value[M.key] !== void 0 && m.value[M.key] !== !1 ? (e(), i("span", Zo, " · Catalog override applies")) : f("", !0)
            ])) : M.kind === "enum" ? (e(), T(s(_e), {
              key: 1,
              disabled: l.disabled,
              "input-id": "pol-" + M.key,
              "aria-describedby": "pol-help-" + M.key,
              class: "pim-policy-control",
              "model-value": typeof m.value[M.key] == "string" ? m.value[M.key] : "inherited",
              options: r.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": (ce) => w(M.key, ce)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])) : (e(), T(s(Ol), {
              key: 2,
              disabled: l.disabled || M.global,
              "input-id": "pol-" + M.key,
              "aria-describedby": "pol-help-" + M.key,
              class: "pim-policy-control",
              "model-value": M.global ? Number(o.value?.[M.key] ?? 0) || null : typeof m.value[M.key] == "number" ? Number(m.value[M.key]) : null,
              min: M.min ?? (M.key === "audit_days" ? 0 : 1),
              max: M.max,
              step: 1,
              placeholder: o.value ? "Default: " + o.value[M.key] : "Deployment default",
              "onUpdate:modelValue": (ce) => w(M.key, ce)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "min", "max", "placeholder", "onUpdate:modelValue"]))
          ]))), 128))
        ]),
        _: 2
      }, 1040, ["data-policy-group"])), 64))
    ]));
  }
}), Xo = { class: "form" }, ed = { class: "pim-aspect" }, ad = { class: "pim-aspect-head" }, ld = {
  key: 0,
  class: "muted small"
}, td = /* @__PURE__ */ re({
  __name: "BuilderDeclaration",
  props: {
    draft: {},
    readonly: { type: Boolean }
  },
  emits: ["replace", "validity"],
  setup(l, { emit: b }) {
    const t = l, o = b, p = Y(JSON.stringify(t.draft, null, 2)), u = Y("");
    Ye(() => o("validity", !0)), be(() => t.draft, (m) => {
      p.value = JSON.stringify(m, null, 2), u.value = "";
    }, { deep: !0 });
    function y() {
      if (!t.readonly)
        try {
          const m = Jl(p.value);
          u.value = "", o("validity", !0), o("replace", m);
        } catch (m) {
          o("validity", !1), u.value = "Invalid declaration: " + (m instanceof Error ? m.message : String(m));
        }
    }
    return (m, V) => (e(), i("section", Xo, [
      a("div", ed, [
        a("header", ad, [
          V[1] || (V[1] = a("h3", null, "Declaration", -1)),
          l.readonly ? f("", !0) : (e(), i("span", ld, "edits apply to the draft when the JSON parses"))
        ]),
        u.value ? (e(), T(s(we), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: h(() => [
            K(k(u.value), 1)
          ]),
          _: 1
        })) : f("", !0),
        v(s(Il), {
          modelValue: p.value,
          "onUpdate:modelValue": V[0] || (V[0] = (N) => p.value = N),
          readonly: l.readonly,
          "aria-label": "Catalog declaration",
          rows: "28",
          spellcheck: "false",
          onInput: y,
          onBlur: y,
          class: "mono pim-json-edit"
        }, null, 8, ["modelValue", "readonly"])
      ])
    ]));
  }
}), sd = { class: "pim-section-layout" }, id = { class: "kx-main" }, nd = ["aria-label"], od = { class: "pim-builder-main" }, dd = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, rd = ["disabled", "inert"], ud = { class: "pim-overview-grid" }, cd = { class: "kx-head-icon" }, md = { class: "kx-card-id" }, pd = { class: "kx-card-name" }, vd = { class: "kx-card-meta" }, fd = { class: "kx-card-desc" }, bd = { class: "pim-advanced-actions" }, yd = { class: "pim-ia-action" }, gd = { class: "pim-ia-action" }, hd = { class: "pim-ia-dialog" }, kd = { class: "pim-ia-dialog-head" }, _d = {
  key: 0,
  class: "dialog-actions"
}, wd = ["aria-labelledby"], $d = { class: "pim-ia-dialog-head" }, Cd = ["id"], xd = { class: "pim-ia-review-impact" }, Vd = { key: 0 }, Ud = { key: 1 }, jd = { key: 2 }, Ad = { key: 3 }, Sd = { key: 4 }, Rd = { key: 0 }, Od = {
  key: 0,
  class: "pim-plan-list"
}, Id = { key: 1 }, Td = {
  key: 1,
  class: "pim-ia-review-impact"
}, Pd = {
  key: 0,
  class: "row pim-review-confirm"
}, qd = ["for"], Nd = { class: "dialog-actions pim-ia-dialog-actions" }, Dd = /* @__PURE__ */ re({
  __name: "SchemaBuilder",
  props: {
    catalogId: {},
    embedded: { type: Boolean },
    title: {},
    catalog: {},
    backLabel: {},
    focusBack: { type: Boolean }
  },
  emits: ["applied", "back", "dirty-changed"],
  setup(l, { emit: b }) {
    const t = l, o = b, p = {
      General: { question: "What is this catalog for?", items: [
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
    }, u = Y("General"), y = Y("Overview"), m = Y(""), V = Y(), N = Y(!1), L = Y(), J = Object.keys(p).map(($) => ({
      heading: $ === "Channels" ? "Publishing and imports" : $,
      items: p[$].items.map((g) => ({ ...g, value: g.label, section: $ }))
    })), H = [
      ...J.filter(($) => $.items.length > 1),
      { heading: "Manage catalog", items: J.filter(($) => $.items.length === 1).flatMap(($) => $.items) }
    ], x = H.flatMap(($) => $.items), r = q(() => G.value && F.value ? [
      { ...H[0], heading: t.title || "Catalog" },
      ...H.slice(1)
    ] : []), w = q(() => t.backLabel ? {
      value: "all-catalogs",
      label: t.embedded ? "All catalogs" : t.backLabel,
      icon: "tabler:table"
    } : void 0), d = Y();
    be(d, ($) => {
      t.focusBack && $?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    function S($) {
      if ($ === "all-catalogs") {
        o("back");
        return;
      }
      const g = x.find((R) => R.label === $);
      g && O(g.section, g.label);
    }
    function O($, g = p[$].items[0].label) {
      u.value === $ && y.value === g || (u.value = $, y.value = g, L.value && (L.value.scrollTop = 0));
    }
    function M($) {
      V.value = $, N.value = !0;
    }
    function ce($) {
      m.value = $, O("Products", "Fields");
    }
    function pe($, g, R = g + "s") {
      return $ + " " + ($ === 1 ? g : R);
    }
    const G = Y(null), F = Y(null), A = Y({}), Q = Y({}), D = Y({}), W = Y(), c = q(() => Object.fromEntries(Object.entries(D.value).filter(([$]) => A.value.plugins?.some((g) => g.use === $) && !G.value?.plugins.some((g) => g.plugin === $ && g.active)))), j = Y(), n = Y(!1), _ = Y(null), z = Y(!1), X = q(() => G.value?.access.admin === !0), te = Y(""), ie = Y(null), Ee = Y(!1), ve = Y(!1), Ze = Y(null), Ne = qe(), ma = {
      unchanged: "No changes",
      initial: "First schema",
      cosmetic: "Presentation only",
      additive: "New fields or options",
      semantic: "Affects product data",
      refused: "Changes blocked"
    }, pa = {
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
    }, je = Y(null), Ve = Y(!0), U = Je(), I = q(() => Ee.value && Xe.value && (!fa.value.length || ve.value) && !n.value && Ve.value && !!ie.value && ie.value.class !== "refused" && !!je.value?.matches(De.value, G.value?.schema_generation ?? -1, c.value)), P = q(() => ie.value ? [...ie.value.refused, ...ie.value.changes.filter(($) => $.class !== "refused")] : []), C = Je(), oe = Je(), ee = Y(!1);
    let Ae = 0;
    be([A, Q, D], () => {
      Ae++, ke();
    }, { deep: !0, flush: "sync" });
    async function ye($ = !1, g = !1) {
      if (Se.value && !$) return;
      const R = C.begin(), se = Ae, ue = t.catalogId, me = g ? Object.entries(D.value).filter(([$e]) => G.value?.plugins.some((sa) => sa.plugin === $e && sa.active)) : [];
      ee.value = !0, j.value = void 0, W.value = void 0;
      try {
        const [$e, sa] = await Promise.all([fe.schema(ue), fe.schemaOptions(ue)]);
        if (!C.current(R) || se !== Ae || ue !== t.catalogId) return;
        G.value = $e, F.value = sa, A.value = ea($e.declaration), Q.value = {}, D.value = Object.fromEntries(me.filter(([ul]) => $e.plugins.some((Ta) => Ta.plugin === ul && Ta.active))), ke(), Ve.value = !0, n.value = !1;
      } catch ($e) {
        C.current(R) && (j.value = Fe($e, "Could not load settings."));
      } finally {
        C.current(R) && (ee.value = !1);
      }
    }
    let Qe = () => {
    };
    be(() => t.catalogId, ($) => {
      Qe(), Qe = Fa(`component.${$}`, () => {
        !Se.value && !z.value ? ye() : y.value === "Plugins" && !z.value && ze();
      });
    }, { immediate: !0 });
    const Ga = ua(async () => {
      !Se.value && !z.value ? await ye() : y.value === "Plugins" && !z.value && await ze();
    });
    Ye(() => {
      Qe(), U.begin(), C.begin(), oe.begin();
    });
    const Ca = q(() => Ga.value !== !1 && y.value === "Plugins" && !z.value && G.value?.plugins.some(($) => mo($, G.value.as_of)) === !0);
    be(Ca, ($, g, R) => {
      if (!$) return;
      let se, ue = !0;
      const me = () => {
        se = setTimeout(async () => {
          await ze() && ue && Ca.value && me();
        }, 2e3);
      };
      me(), R(() => {
        ue = !1, clearTimeout(se);
      });
    }), be(() => t.catalogId, () => {
      U.begin(), z.value = !1, n.value = !1, G.value = null, F.value = null, ba(), ye();
    });
    const Ya = q(() => Object.values(Pa(A.value, Q.value)).reduce(($, g) => $ + (g?.length ?? 0), 0)), Xe = q(() => !!G.value && (JSON.stringify(A.value) !== JSON.stringify(G.value.declaration) || Ya.value > 0 || Object.keys(c.value).length > 0)), Se = q(() => Xe.value || Object.keys(D.value).length > 0);
    be(Se, ($) => o("dirty-changed", $), { immediate: !0 });
    const va = q(() => A.value.families?.filter(($) => $.code !== "generic") ?? []), xa = q(() => A.value.aspects ?? []), Va = q(() => xa.value.reduce(($, g) => $ + (g.attributes?.length ?? 0), 0)), Za = q(() => {
      const $ = new Set(A.value.plugins?.map((g) => g.use));
      return Object.values(G.value?.attributes ?? {}).filter((g) => g.plugin && $.has(g.plugin)).length;
    }), Qa = q(() => !Va.value && !xa.value.length && !va.value.length), Ua = q(() => A.value.channels ?? []), Xa = q(() => A.value.sources ?? []), ja = q(() => G.value?.plugins.filter(($) => $.active) ?? []), Aa = q(() => t.catalog?.product_count ?? t.catalog?.item_count), el = q(() => [
      {
        section: "Products",
        label: "Product setup",
        icon: "tabler:packages",
        summary: [
          ...typeof Aa.value == "number" ? [pe(Aa.value, "product")] : [],
          pe(va.value.length, "family", "families"),
          pe(Va.value + Za.value, "field")
        ].join(" · "),
        detail: va.value.map(($) => B($.code)).join(", ") || "Create a family for products that share the same fields."
      },
      {
        section: "Values",
        label: "Allowed values",
        icon: "tabler:list-details",
        summary: [pe(A.value.dimensions?.length ?? 0, "dimension"), pe(A.value.vocabularies?.length ?? 0, "vocabulary", "vocabularies")].join(" · "),
        detail: A.value.dimensions?.map(($) => B($.name)).join(", ") || "Add dimensions when values vary by language, region or another context."
      },
      {
        section: "Channels",
        label: "Publishing and imports",
        icon: "tabler:arrows-exchange",
        summary: [pe(Ua.value.length, "channel"), pe(Xa.value.length, "source")].join(" · "),
        detail: Ua.value.map(($) => B($.id)).join(", ") || "Add a release destination when products are ready to publish."
      },
      {
        section: "Plugins",
        label: "Catalog tools",
        icon: "tabler:puzzle",
        summary: pe(ja.value.length, "plugin") + " enabled",
        detail: ja.value.map(($) => ne($.title, "Catalog plugin")).join(", ") || "Open Plugins to see which tools you can enable."
      }
    ]), al = {
      Overview: p.General.question,
      History: "What changed in this catalog?",
      Families: "Choose what each family collects, how products vary, and what they need before release.",
      Fields: "Manage product fields and the groups that families share.",
      "Form layout": "In what order will editors see fields?",
      Dimensions: "Where can product values differ?",
      Vocabularies: "Which terms can product editors choose?",
      Channels: "Choose where each family can publish and what products need before release.",
      Sources: "Control who can send product updates and which fields each source can change.",
      Access: p.Access.question,
      Plugins: p.Plugins.question
    }, De = q(() => {
      const $ = ea(A.value), g = Pa($, Q.value);
      for (const [R, se] of Object.entries(g)) {
        const ue = $.remove ??= {};
        ue[R] = [.../* @__PURE__ */ new Set([...ue[R] ?? [], ...se])];
      }
      return $;
    });
    be(Xe, ($) => {
      $ || ke();
    }), be([De, c], ke, { deep: !0 });
    function ll($) {
      const [g, R] = $.split(" ", 2);
      if (g === "plugin" && R) return ne(F.value?.plugins.find((me) => me.plugin === R)?.title, "Plugin");
      if (g === "scope" && R) return ne(F.value?.scopes.find((me) => me.id === R)?.title, "Product filter set");
      if (R) return ne(B(R), B(g)) + (g === "aspect" ? " field group" : "");
      if ($.startsWith("kickside.")) return "Catalog setting";
      const [se, ue] = $.split(".", 2);
      return ue ? `${ne(B(ue), "Field")} (${ne(B(se), "Field group")})` : ne(B($), "Catalog setting");
    }
    function tl($) {
      return $.startsWith("renamed from ") ? "Rename from " + B($.slice(13)) : $.startsWith("config.") ? "Change " + B($.slice(7)) : $.endsWith(" owning level") ? "Move a field to another variant level" : pa[$] ?? B($);
    }
    const fa = q(() => {
      const $ = De.value.remove;
      return [
        ...$?.attributes?.length || $?.aspects?.length ? ["Removing fields deletes the values stored in those fields."] : [],
        ...$?.vocabularies?.length ? ["Removing a vocabulary deletes its saved terms."] : [],
        ...$?.channels?.length ? ["Removing a release destination withdraws products already published to it."] : []
      ];
    }), Sa = q(() => {
      const $ = G.value?.declaration;
      return $ ? [
        ...(A.value.channels ?? []).flatMap((g) => {
          const R = $.channels?.find((se) => se.id === g.id);
          return JSON.stringify(g) === JSON.stringify(R) ? [] : [{ subject: B(g.id), effect: R ? "Change which products can be released here and what they need first" : "Add a release destination" }];
        }),
        ...(De.value.remove?.channels ?? []).map((g) => ({ subject: B(g), effect: "Remove this release destination" })),
        ...(A.value.sources ?? []).flatMap((g) => {
          const R = $.sources?.find((se) => se.id === g.id);
          return JSON.stringify(g) === JSON.stringify(R) ? [] : [{ subject: B(g.id), effect: R ? "Update how this source can send product data" : "Let this source send product updates" }];
        }),
        ...(De.value.remove?.sources ?? []).map((g) => ({ subject: B(g), effect: "Stop accepting updates from this source" }))
      ] : [];
    });
    function Me($, g) {
      const R = Fe($, g), se = R.pluginConfig, ue = F.value?.plugins.find((me) => me.installed && me.plugin === se?.plugin);
      if (se && ue && A.value.plugins?.some((me) => me.use === se.plugin)) {
        W.value = se, O("Plugins");
        return;
      }
      j.value = R, R.code === vl && (n.value = !0, ke());
    }
    async function sl() {
      if (!(Se.value && !await He.confirm({
        header: "Discard unsaved changes?",
        message: "Reloading will discard unsaved settings and plugin changes.",
        acceptLabel: "Discard and reload",
        rejectLabel: "Cancel"
      }))) {
        z.value = !0, te.value = "";
        try {
          await ye(!0);
        } finally {
          z.value = !1;
        }
      }
    }
    async function Ra() {
      if (!G.value || !Xe.value || !Ve.value || n.value) return;
      const $ = U.begin(), g = Ml(De.value, G.value.schema_generation, c.value);
      z.value = !0, j.value = void 0;
      try {
        const R = await fe.planSchema(t.catalogId, g.declaration, g.generation, g.pluginConfigs);
        if (!U.current($) || !g.matches(De.value, G.value.schema_generation, c.value) || !Ve.value) return;
        je.value = g, ve.value = !1, ie.value = R, Ee.value = !0, await Ke(), Ze.value?.focus();
      } catch (R) {
        if (!U.current($)) return;
        Me(R, "Could not review the change."), ke(), await Ke(), _.value?.$el.focus();
      } finally {
        U.current($) && (z.value = !1);
      }
    }
    async function il() {
      if (!G.value || !Se.value || !I.value || !je.value) return;
      const $ = t.catalogId, g = U.begin();
      z.value = !0, j.value = void 0, te.value = "";
      try {
        const R = await fe.applySchema($, je.value.declaration, je.value.generation, je.value.pluginConfigs);
        if ($ !== t.catalogId || !U.current(g) || (await ye(!0, !0), $ !== t.catalogId || !U.current(g))) return;
        te.value = "Catalog changes applied.", o("applied", R.generation);
      } catch (R) {
        if ($ !== t.catalogId || !U.current(g)) return;
        ke(), Me(R, "Could not apply the change."), await Ke(), _.value?.$el.focus();
      } finally {
        U.current(g) && (z.value = !1);
      }
    }
    async function ze($ = !1) {
      const g = t.catalogId, R = G.value, se = oe.begin();
      try {
        const [ue, me] = await Promise.all([fe.schema(g), $ ? fe.schemaOptions(g) : void 0]);
        return !R || !oe.current(se) || g !== t.catalogId || G.value !== R ? !1 : (R.plugins = ue.plugins, R.as_of = ue.as_of, me && (F.value = me), !0);
      } catch (ue) {
        return $ && oe.current(se) && g === t.catalogId && Me(ue, "Could not check plugin status."), !1;
      }
    }
    async function Oa($, g, R = !1) {
      if (z.value || n.value || !X.value) return;
      const se = t.catalogId, ue = C.begin(), me = U.begin();
      oe.begin(), z.value = !0, j.value = void 0, te.value = "";
      try {
        const $e = JSON.stringify(g);
        if (R ? await fe.configurePlugin(se, $, ea(g), !0) : await fe.configurePlugin(se, $, ea(g)), se !== t.catalogId || !C.current(ue) || !await ze(!0) || se !== t.catalogId || !C.current(ue)) return;
        !R && JSON.stringify(D.value[$]) === $e && delete D.value[$], W.value?.plugin === $ && (W.value = void 0), te.value = R ? "Background update reset requested." : "Configuration saved";
      } catch ($e) {
        se === t.catalogId && U.current(me) && Me($e, R ? "Could not reset background updates." : "Could not save configuration.");
      } finally {
        U.current(me) && (z.value = !1);
      }
    }
    async function nl($) {
      const g = t.catalogId, R = G.value?.plugins.find((se) => se.plugin === $ && se.active && se.installed);
      !R?.config || z.value || n.value || !X.value || !await He.confirm({
        header: "Reset background updates?",
        message: "Background updates will start from a new catalog event. Current product data will be rebuilt into the plugin’s index. Earlier events will be skipped.",
        acceptLabel: "Reset background updates",
        rejectLabel: "Cancel"
      }) || t.catalogId !== g || await Oa($, R.config, !0);
    }
    async function ol($) {
      const g = t.catalogId;
      if (!(z.value || n.value || !X.value)) {
        z.value = !0, j.value = void 0, te.value = "";
        try {
          await fe.resumePluginProjection(g, $), t.catalogId === g && await ze(!0) && (te.value = "Background update resumed.");
        } catch (R) {
          t.catalogId === g && Me(R, "Could not resume the background update.");
        } finally {
          t.catalogId === g && (z.value = !1);
        }
      }
    }
    async function dl($) {
      const g = t.catalogId;
      if (!(z.value || n.value || !X.value) && !(!await He.confirm({
        header: "Clear catalog app binding?",
        message: "The catalog will use the default app after this setting is saved.",
        acceptLabel: "Clear binding",
        rejectLabel: "Cancel"
      }) || t.catalogId !== g || z.value || !X.value || !G.value?.plugins.some((R) => R.references?.shell_bindings.includes($)))) {
        z.value = !0, j.value = void 0, te.value = "";
        try {
          if (await fe.updateCatalogApp(g, ""), t.catalogId !== g) return;
          await ze(!0) && (te.value = "Catalog app binding cleared.");
        } catch (R) {
          t.catalogId === g && Me(R, "Could not clear the catalog app binding.");
        } finally {
          t.catalogId === g && (z.value = !1);
        }
      }
    }
    async function rl() {
      Se.value && !await He.confirm({
        header: "Leave this catalog?",
        message: "Your unsaved catalog changes will be discarded.",
        acceptLabel: "Discard and open settings",
        rejectLabel: "Keep editing"
      }) || (ba(), N.value = !1, He.navigate("/system/settings"));
    }
    function ke() {
      Ee.value = !1, je.value = null;
    }
    function Ia() {
      N.value = !1, Ve.value = !0;
    }
    function ba() {
      D.value = {}, W.value = void 0, Ve.value = !0, G.value && (A.value = ea(G.value.declaration)), Q.value = {}, ke(), te.value = "";
    }
    function We($, g) {
      const R = Q.value[$] ?? [];
      R.includes(g) || (Q.value = { ...Q.value, [$]: [...R, g] });
    }
    return ($, g) => (e(), i("section", {
      class: xe(["pim-builder", { embedded: l.embedded }])
    }, [
      a("div", sd, [
        w.value || G.value && F.value ? (e(), T(Dl, {
          key: 0,
          ref_key: "rail",
          ref: d,
          label: "Catalog settings sections",
          value: y.value,
          groups: r.value,
          "leading-item": w.value,
          "onUpdate:value": S
        }, null, 8, ["value", "groups", "leading-item"])) : f("", !0),
        a("div", id, [
          a("section", {
            ref_key: "content",
            ref: L,
            class: "kx-main-scroll",
            "aria-label": y.value
          }, [
            G.value && F.value ? (e(), T(Dt, {
              key: 0,
              title: y.value,
              description: al[y.value]
            }, he({ _: 2 }, [
              X.value && Se.value ? {
                name: "actions",
                fn: h(() => [
                  v(zt, {
                    busy: z.value,
                    "review-disabled": !Ve.value || n.value || !Xe.value,
                    onDiscard: ba,
                    onReview: Ra
                  }, null, 8, ["busy", "review-disabled"])
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : f("", !0),
            a("div", od, [
              j.value ? (e(), T(ca, {
                key: 0,
                ref_key: "errorPanel",
                ref: _,
                error: j.value,
                tabindex: "-1"
              }, {
                default: h(() => [
                  n.value ? (e(), T(s(Z), {
                    key: 0,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: z.value,
                    onClick: sl
                  }, {
                    default: h(() => [...g[11] || (g[11] = [
                      K("Reload settings", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"])) : !G.value || !F.value ? (e(), T(s(Z), {
                    key: 1,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: g[0] || (g[0] = (R) => ye())
                  }, {
                    default: h(() => [...g[12] || (g[12] = [
                      K("Retry", -1)
                    ])]),
                    _: 1
                  })) : f("", !0)
                ]),
                _: 1
              }, 8, ["error"])) : f("", !0),
              te.value ? (e(), T(s(we), {
                key: 1,
                severity: "success",
                role: "status"
              }, {
                default: h(() => [
                  K(k(te.value), 1)
                ]),
                _: 1
              })) : f("", !0),
              G.value?.rebuilding && y.value === "Overview" ? (e(), T(s(we), {
                key: 2,
                severity: "info",
                role: "status"
              }, {
                default: h(() => [...g[13] || (g[13] = [
                  K("Updating product readiness", -1)
                ])]),
                _: 1
              })) : f("", !0),
              ee.value && (!G.value || !F.value) ? (e(), i("div", dd, "Loading catalog settings…")) : G.value && F.value ? (e(), i("fieldset", {
                key: 4,
                class: "pim-editor-surface",
                disabled: z.value,
                inert: z.value
              }, [
                X.value ? f("", !0) : (e(), T(s(we), {
                  key: 0,
                  severity: "info"
                }, {
                  default: h(() => [...g[14] || (g[14] = [
                    K("You can view this catalog’s settings.", -1)
                  ])]),
                  _: 1
                })),
                (e(), i("div", {
                  key: y.value,
                  class: "pim-ia-content"
                }, [
                  u.value === "General" && y.value === "History" ? (e(), T(Tt, {
                    key: 0,
                    "catalog-id": l.catalogId,
                    "can-resolve-actors": X.value
                  }, null, 8, ["catalog-id", "can-resolve-actors"])) : u.value === "General" ? (e(), i(E, { key: 1 }, [
                    a("div", ud, [
                      (e(!0), i(E, null, ae(el.value, (R) => (e(), i("section", {
                        key: R.section,
                        class: "kx-card pim-overview-card"
                      }, [
                        a("span", cd, [
                          v(s(le), {
                            icon: R.icon,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"])
                        ]),
                        a("div", md, [
                          a("h3", pd, k(R.label), 1),
                          a("p", vd, k(R.summary), 1)
                        ]),
                        a("p", fd, k(R.detail), 1),
                        v(s(Z), {
                          type: "button",
                          text: "",
                          class: "pim-overview-action",
                          onClick: (se) => O(R.section)
                        }, {
                          default: h(() => [
                            K(k(R.section === "Products" ? Qa.value ? "Set up products" : "View families" : "View " + R.section.toLowerCase()) + " ", 1),
                            v(s(le), {
                              icon: "tabler:arrow-right",
                              "aria-hidden": "true"
                            })
                          ]),
                          _: 2
                        }, 1032, ["onClick"])
                      ]))), 128))
                    ]),
                    v(Re, { label: "Advanced" }, {
                      default: h(() => [
                        a("div", bd, [
                          a("div", yd, [
                            g[15] || (g[15] = a("div", null, [
                              a("h3", null, "Application defaults"),
                              a("p", null, "Review the audit, retention and processing settings this catalog inherits.")
                            ], -1)),
                            v(s(Z), {
                              label: "View defaults",
                              severity: "secondary",
                              outlined: "",
                              onClick: g[1] || (g[1] = (R) => M("defaults"))
                            })
                          ]),
                          a("div", gd, [
                            g[16] || (g[16] = a("div", null, [
                              a("h3", null, "Technical schema"),
                              a("p", null, "Inspect the complete definition, including integration keys and settings used by installed extensions.")
                            ], -1)),
                            v(s(Z), {
                              label: "Open declaration",
                              severity: "secondary",
                              outlined: "",
                              onClick: g[2] || (g[2] = (R) => M("declaration"))
                            })
                          ])
                        ])
                      ]),
                      _: 1
                    })
                  ], 64)) : u.value === "Products" ? (e(), i(E, { key: 2 }, [
                    y.value === "Families" ? (e(), T(Rn, {
                      key: 0,
                      draft: A.value,
                      schema: G.value,
                      options: F.value,
                      onRemove: We,
                      onFields: ce
                    }, null, 8, ["draft", "schema", "options"])) : y.value === "Fields" ? (e(), T(ki, {
                      key: 1,
                      family: m.value,
                      "onUpdate:family": g[3] || (g[3] = (R) => m.value = R),
                      draft: A.value,
                      schema: G.value,
                      options: F.value,
                      onRemove: We
                    }, null, 8, ["family", "draft", "schema", "options"])) : (e(), T(pt, {
                      key: 2,
                      draft: A.value,
                      schema: G.value,
                      types: F.value.types
                    }, null, 8, ["draft", "schema", "types"]))
                  ], 64)) : u.value === "Values" ? (e(), i(E, { key: 3 }, [
                    y.value === "Dimensions" ? (e(), T(Si, {
                      key: 0,
                      draft: A.value,
                      schema: G.value,
                      onRemove: We
                    }, null, 8, ["draft", "schema"])) : (e(), T(Yi, {
                      key: 1,
                      "catalog-id": l.catalogId,
                      draft: A.value,
                      schema: G.value,
                      onRemove: We
                    }, null, 8, ["catalog-id", "draft", "schema"]))
                  ], 64)) : u.value === "Channels" ? (e(), T(uo, {
                    key: 4,
                    "catalog-id": l.catalogId,
                    draft: A.value,
                    schema: G.value,
                    view: y.value === "Sources" ? "sources" : "channels",
                    onRemove: We
                  }, null, 8, ["catalog-id", "draft", "schema", "view"])) : u.value === "Access" ? (e(), T(El, {
                    key: 5,
                    "catalog-id": l.catalogId,
                    title: l.title || "Catalog",
                    access: G.value.access
                  }, null, 8, ["catalog-id", "title", "access"])) : (e(), T(Bo, {
                    key: 6,
                    draft: A.value,
                    schema: G.value,
                    options: F.value,
                    "plugin-configs": D.value,
                    refusal: W.value,
                    stale: n.value,
                    onConfigure: Oa,
                    onRemove: We,
                    onReset: nl,
                    onClearRefusal: g[4] || (g[4] = (R) => W.value = void 0),
                    onRefresh: g[5] || (g[5] = (R) => ze(!0)),
                    onResume: ol,
                    onReview: Ra,
                    onClearShellBinding: dl
                  }, null, 8, ["draft", "schema", "options", "plugin-configs", "refusal", "stale"]))
                ])),
                V.value ? (e(), T(oa, {
                  key: 1,
                  visible: N.value,
                  label: V.value === "defaults" ? "Application defaults" : "Technical schema",
                  onClose: Ia,
                  onClosed: g[8] || (g[8] = (R) => V.value = void 0)
                }, {
                  default: h(() => [
                    a("div", hd, [
                      a("header", kd, [
                        a("h2", null, k(V.value === "defaults" ? "Application defaults" : "Technical schema"), 1),
                        v(s(Z), {
                          type: "button",
                          "aria-label": "Close",
                          text: "",
                          severity: "secondary",
                          onClick: Ia
                        }, {
                          default: h(() => [
                            v(s(le), {
                              icon: "tabler:x",
                              "aria-hidden": "true"
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      V.value === "defaults" ? (e(), i(E, { key: 0 }, [
                        g[17] || (g[17] = a("p", { class: "muted" }, "These settings apply across the application. Catalogs with an explicit override keep their chosen value.", -1)),
                        v(Qo, {
                          "catalog-id": l.catalogId,
                          draft: A.value,
                          disabled: !X.value,
                          "defaults-only": ""
                        }, null, 8, ["catalog-id", "draft", "disabled"]),
                        X.value ? (e(), i("div", _d, [
                          v(s(Z), {
                            type: "button",
                            label: "Open application settings",
                            severity: "secondary",
                            outlined: "",
                            onClick: rl
                          })
                        ])) : f("", !0)
                      ], 64)) : (e(), T(td, {
                        key: 1,
                        draft: A.value,
                        readonly: !X.value,
                        onReplace: g[6] || (g[6] = (R) => A.value = R),
                        onValidity: g[7] || (g[7] = (R) => {
                          Ve.value = R, ke();
                        })
                      }, null, 8, ["draft", "readonly"]))
                    ])
                  ]),
                  _: 1
                }, 8, ["visible", "label"])) : f("", !0)
              ], 8, rd)) : f("", !0),
              v(oa, {
                class: "pim-review-dialog",
                visible: Ee.value,
                busy: z.value,
                label: "Review changes",
                onClose: ke,
                onClosed: g[10] || (g[10] = (R) => ie.value = null)
              }, {
                default: h(() => [
                  ie.value ? (e(), i("section", {
                    key: 0,
                    class: "pim-ia-dialog pim-plan",
                    "aria-labelledby": s(Ne)
                  }, [
                    a("header", $d, [
                      a("div", null, [
                        a("h2", {
                          id: s(Ne),
                          ref_key: "reviewHeading",
                          ref: Ze,
                          tabindex: "-1",
                          autofocus: ""
                        }, "Review changes", 8, Cd),
                        a("p", null, "Check what will happen when you apply this draft to " + k(l.title || "the catalog") + ".", 1)
                      ]),
                      v(s(Z), {
                        type: "button",
                        "aria-label": "Close review",
                        disabled: z.value,
                        text: "",
                        severity: "secondary",
                        onClick: ke
                      }, {
                        default: h(() => [
                          v(s(le), {
                            icon: "tabler:x",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ]),
                    a("div", xd, [
                      a("h3", null, k(ma[ie.value.class] || "Catalog changes"), 1),
                      ie.value.class === "unchanged" ? (e(), i("p", Vd, "The catalog already matches this draft.")) : ie.value.class === "initial" ? (e(), i("p", Ud, "Product editors will use these settings for new products.")) : ie.value.class === "cosmetic" ? (e(), i("p", jd, "Catalog settings will update. Stored product values are kept.")) : ie.value.class === "additive" ? (e(), i("p", Ad, "The new options become available. Existing product values are kept.")) : ie.value.class === "semantic" ? (e(), i("p", Sd, "Applying changes can recalculate product values or release readiness across this catalog.")) : ie.value.class === "refused" ? (e(), T(s(we), {
                        key: 5,
                        severity: "error"
                      }, {
                        default: h(() => [
                          g[18] || (g[18] = K(" These changes can’t be applied. ", -1)),
                          ie.value.migration && ie.value.refused.some((R) => G.value?.attributes[R.code]) ? (e(), i("span", Rd, " To change how a field stores values, add a new field and copy the existing values into it. Then remove the original field and give the new field its name. ")) : f("", !0)
                        ]),
                        _: 1
                      })) : f("", !0)
                    ]),
                    P.value.length || Sa.value.length ? (e(), i("ul", Od, [
                      (e(!0), i(E, null, ae(P.value, (R, se) => (e(), i("li", { key: se }, [
                        R.class === "refused" ? (e(), T(s(ge), {
                          key: 0,
                          class: "kx-tag-sm small",
                          severity: "danger"
                        }, {
                          default: h(() => [...g[19] || (g[19] = [
                            K("Blocked", -1)
                          ])]),
                          _: 1
                        })) : f("", !0),
                        R.code ? (e(), i("strong", Id, k(ll(R.code)), 1)) : f("", !0),
                        a("span", null, k(tl(R.what)), 1)
                      ]))), 128)),
                      (e(!0), i(E, null, ae(Sa.value, (R) => (e(), i("li", {
                        key: R.subject + R.effect
                      }, [
                        a("strong", null, k(R.subject), 1),
                        a("span", null, k(R.effect), 1)
                      ]))), 128))
                    ])) : f("", !0),
                    fa.value.length ? (e(), i("div", Td, [
                      g[20] || (g[20] = a("h3", null, "Permanent changes", -1)),
                      (e(!0), i(E, null, ae(fa.value, (R) => (e(), i("p", { key: R }, k(R), 1))), 128)),
                      ie.value.class !== "refused" ? (e(), i("div", Pd, [
                        v(s(jl), {
                          modelValue: ve.value,
                          "onUpdate:modelValue": g[9] || (g[9] = (R) => ve.value = R),
                          "input-id": s(Ne) + "-acknowledge",
                          binary: "",
                          disabled: z.value
                        }, null, 8, ["modelValue", "input-id", "disabled"]),
                        a("label", {
                          for: s(Ne) + "-acknowledge"
                        }, "I understand the effects of these removals", 8, qd)
                      ])) : f("", !0)
                    ])) : f("", !0),
                    a("footer", Nd, [
                      v(s(Z), {
                        type: "button",
                        label: "Back to editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: z.value,
                        onClick: ke
                      }, null, 8, ["disabled"]),
                      G.value?.access.admin && ie.value.class !== "refused" ? (e(), T(s(Z), {
                        key: 0,
                        disabled: !Se.value || z.value || !I.value,
                        loading: z.value,
                        onClick: il
                      }, {
                        default: h(() => [
                          K(k(y.value === "Form layout" ? "Apply layout" : "Apply changes"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled", "loading"])) : f("", !0)
                    ])
                  ], 8, wd)) : f("", !0)
                ]),
                _: 1
              }, 8, ["visible", "busy"])
            ])
          ], 8, nd)
        ])
      ])
    ], 2));
  }
}), zd = /* @__PURE__ */ re({
  __name: "SettingsApp",
  setup(l) {
    const b = fl(), t = bl(), o = Y(), p = q(() => b.value.catalogId ?? ""), u = Je();
    async function y() {
      const V = u.begin(), N = p.value;
      try {
        const L = await fe.catalogSummary(N);
        u.current(V) && (o.value = L);
      } catch {
        u.current(V) && (o.value = void 0);
      }
    }
    be(p, () => {
      o.value = void 0, y();
    }), ua(y), Ye(() => {
      u.begin();
    });
    function m() {
      b.value.embedded ? t("open-catalog-picker", {}) : t("navigate", { route: "" });
    }
    return (V, N) => p.value ? (e(), T(Dd, {
      key: p.value,
      "catalog-id": p.value,
      title: o.value?.title || "Catalog",
      catalog: o.value,
      embedded: s(b).embedded,
      "focus-back": s(b).focusBack,
      "back-label": s(b).embedded ? "Back to catalogs" : "Back to catalog settings",
      onBack: m,
      onDirtyChanged: N[0] || (N[0] = (L) => s(t)("dirty-changed", { dirty: L }))
    }, null, 8, ["catalog-id", "title", "catalog", "embedded", "focus-back", "back-label"])) : f("", !0);
  }
});
class Bd extends yl {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "catalog-id": { type: "string", default: "" }, embedded: { type: "boolean", default: !1 }, "focus-back": { type: "boolean", default: !1 } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: gl
    };
  }
  static get vueConfig() {
    return { rootComponent: zd, plugins: [hl] };
  }
}
Rl(import.meta.url, Bd);
