import { c as rl, u as ra, r as Ke, e as Na, f as ul, a as ua, p as ce, b as Ee, g as Re, _ as oa, h as cl, d as ml, S as pl, i as vl, j as fl, W as bl, s as yl, P as gl } from "./styles-CkqhKFcY.js";
import { defineComponent as de, computed as D, openBlock as e, createBlock as T, resolveDynamicComponent as Da, normalizeProps as hl, guardReactiveProps as kl, createSlots as ye, withCtx as k, createElementVNode as a, normalizeClass as Ve, createElementBlock as i, Fragment as E, renderList as ee, toDisplayString as $, createCommentVNode as h, unref as s, renderSlot as xe, ref as J, onUnmounted as Ze, createVNode as f, createStaticVNode as _l, createTextVNode as G, withModifiers as Ie, normalizeStyle as ba, useId as Ne, watch as fe, withKeys as aa, nextTick as Ge, provide as wl, inject as $l, useModel as za, Transition as Cl, mergeModels as ya, toRaw as xl, onMounted as Ba, mergeProps as Vl } from "vue";
import { Icon as le } from "@iconify/vue";
import ge from "primevue/tag";
import H from "primevue/button";
import Ul from "primevue/checkbox";
import we from "primevue/message";
import { api as jl, on as La, host as Je, loadByTagName as Al, define as Sl } from "@wippy-fe/proxy";
import _a from "primevue/selectbutton";
import Ye from "primevue/inputtext";
import Fa from "primevue/multiselect";
import la from "primevue/toggleswitch";
import _e from "primevue/select";
import Ol from "primevue/inputnumber";
import Rl from "primevue/textarea";
const Il = ["aria-label"], Tl = {
  key: 0,
  class: "kx-settings-rail-group"
}, Pl = ["aria-current", "onClick"], ql = { class: "kx-settings-rail-label" }, Nl = /* @__PURE__ */ de({
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
    const y = l, t = D(() => y.leadingItem ? [{ items: [y.leadingItem] }, ...y.groups] : y.groups);
    function o(p) {
      const c = [...p.currentTarget.querySelectorAll(".kx-settings-rail-item")], b = c.indexOf(p.target);
      if (b < 0) return;
      let m;
      switch (p.key) {
        case "ArrowDown":
        case "ArrowRight":
          m = (b + 1) % c.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          m = (b + c.length - 1) % c.length;
          break;
        case "Home":
          m = 0;
          break;
        case "End":
          m = c.length - 1;
          break;
        default:
          return;
      }
      p.preventDefault(), c[m]?.focus();
    }
    return (p, c) => (e(), T(Da(l.title ? rl : "div"), hl(kl(l.title ? { title: l.title, count: l.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), ye({
      default: k(() => [
        a("nav", {
          class: Ve(["kx-settings-rail", { "kx-settings-rail-framed": l.title }]),
          "aria-label": l.label,
          onKeydown: o
        }, [
          (e(!0), i(E, null, ee(t.value, (b, m) => (e(), i("div", {
            key: b.items[0]?.value ?? m,
            class: Ve(["kx-settings-rail-section", { "kx-settings-rail-leading": l.leadingItem && m === 0 }])
          }, [
            b.heading ? (e(), i("div", Tl, $(b.heading), 1)) : h("", !0),
            (e(!0), i(E, null, ee(b.items, (C) => (e(), i("button", {
              key: C.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": C.value === l.value ? "true" : void 0,
              onClick: (A) => p.$emit("update:value", C.value)
            }, [
              C.icon ? (e(), T(s(le), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: C.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : h("", !0),
              a("span", ql, $(C.label), 1)
            ], 8, Pl))), 128))
          ], 2))), 128))
        ], 42, Il)
      ]),
      _: 2
    }, [
      l.title && p.$slots.actions ? {
        name: "actions",
        fn: k(() => [
          xe(p.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Dl = { class: "pim-stack" }, zl = { class: "form pim-card-body pad pim-ia-action" }, Bl = ["config"], Ll = /* @__PURE__ */ de({
  __name: "CatalogShare",
  props: {
    catalogId: {},
    title: {},
    access: {}
  },
  setup(l) {
    const y = l, t = J(!1), o = J(!1), p = J(""), c = J(), b = J(!1), m = Ke(), C = D(() => "/api/v1/component-access/grants/" + encodeURIComponent(y.catalogId)), A = D(() => JSON.stringify({
      resource_id: y.catalogId,
      title: y.title,
      access_url: C.value,
      share_url: "/api/v1/component-access/share/" + encodeURIComponent(y.catalogId)
    })), L = D(() => {
      if (!y.access.admin) return "Only catalog administrators can manage sharing.";
      if (!c.value) return b.value ? "Member counts are unavailable." : "Loading members…";
      const { people: F, groups: v } = c.value;
      return F + (F === 1 ? " person" : " people") + " and " + v + (v === 1 ? " group" : " groups") + " with direct access";
    });
    async function Q() {
      if (!y.access.admin) return;
      const F = m.begin();
      b.value = !1;
      try {
        const { data: v } = await jl.get(C.value);
        if (!m.current(F)) return;
        if (!v?.success || !Array.isArray(v.access)) throw new Error("Grants unavailable");
        const w = v.access.filter((r) => r.subject_type === "group").length;
        c.value = { people: v.access.length - w, groups: w };
      } catch {
        m.current(F) && (c.value = void 0, b.value = !0);
      }
    }
    ra(Q), Ze(() => {
      m.begin();
    });
    async function P() {
      o.value = !0, p.value = "", await Na("kickside-share") ? t.value = !0 : p.value = "Could not open sharing. Try again.", o.value = !1;
    }
    return (F, v) => (e(), i("div", Dl, [
      a("section", zl, [
        a("div", null, [
          v[1] || (v[1] = a("h3", null, "Members and sharing", -1)),
          a("p", null, $(L.value), 1)
        ]),
        l.access.admin ? (e(), T(s(H), {
          key: 0,
          type: "button",
          label: "Share catalog",
          loading: o.value,
          onClick: P
        }, {
          icon: k(() => [
            f(s(le), {
              icon: "tabler:share",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : h("", !0),
        b.value ? (e(), T(s(H), {
          key: 1,
          type: "button",
          label: "Reload member counts",
          severity: "secondary",
          text: "",
          onClick: Q
        })) : h("", !0)
      ]),
      v[2] || (v[2] = _l('<section class="form pim-card-body pad pim-stack" aria-labelledby="pim-access-roles-heading"><h3 id="pim-access-roles-heading">What members can do</h3><dl class="pim-access-roles"><div><dt>Read</dt><dd>View products and their details.</dd></div><div><dt>Write</dt><dd>Create products and update their values.</dd></div><div><dt>Delete</dt><dd>Move products to trash.</dd></div><div><dt>Admin</dt><dd>Manage catalog settings and who has access.</dd></div></dl></section>', 1)),
      t.value ? (e(), i("kickside-share", {
        key: 0,
        config: A.value,
        onClose: v[0] || (v[0] = (w) => t.value = !1),
        onChanged: Q
      }, null, 40, Bl)) : h("", !0),
      p.value ? (e(), T(s(we), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: k(() => [
          G($(p.value), 1)
        ]),
        _: 1
      })) : h("", !0)
    ]));
  }
});
function Fl(l, y, t = {}) {
  const o = JSON.stringify(l), p = JSON.stringify(t);
  return {
    declaration: JSON.parse(o),
    generation: y,
    pluginConfigs: JSON.parse(p),
    matches: (c, b, m = {}) => y === b && o === JSON.stringify(c) && p === JSON.stringify(m)
  };
}
function Ta(l, y) {
  const t = {};
  for (const [o, p] of Object.entries(y)) {
    const c = p.filter((b) => o === "plugins" ? !l.plugins?.some((m) => m.use === b) : o === "scopes" ? !l.scopes?.includes(b) : o === "attributes" ? !l.aspects?.some((m) => m.attributes?.some((C) => m.namespace + "." + C.code === b)) : o === "aspects" ? !l.aspects?.some((m) => m.namespace === b) : o === "dimensions" ? !l.dimensions?.some((m) => m.name === b) : o === "vocabularies" || o === "families" ? !l[o]?.some((m) => m.code === b) : !l[o]?.some((m) => m.id === b));
    c.length && (t[o] = c);
  }
  return t;
}
const Pa = (l) => !!l && typeof l == "object" && !Array.isArray(l), ne = ["string"], Ea = { "*": "string" }, El = { id: "number", code: "string!", type: "string!", scope: ne, cardinality: "string", index: "string", index_contexts: [Ea], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, Ml = {
  dimensions: [{ name: "string!", members: ne, fallback: { "*": ne } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: ne }, attributes: [El] }],
  families: [{ code: "string!", aspects: ne, variation: [{ axes: ne, own: ne }], requirements: [{ id: "string!", context: Ea, require: ne, authored: ne }], checks: [{ check: "string!", reads: ne, cost: "string", config: "object", enforce: "string" }] }],
  sources: [{ id: "string!", ordering: "string", writes: ne, principals: ne, audit: "boolean" }],
  channels: [{ id: "string!", requirements: ne, families: ne }],
  plugins: [{ use: "string!", schema: "json" }],
  scopes: ne,
  policy: { "*": "policy" },
  remove: { dimensions: ne, vocabularies: ne, aspects: ne, families: ne, sources: ne, channels: ne, attributes: ne, scopes: ne, plugins: ne }
};
function ga(l, y, t) {
  if (typeof y == "string") {
    const o = y.replace("!", "");
    if (!(o === "json" || (o === "object" ? Pa(l) : o === "policy" ? l === !1 || typeof l == "string" || typeof l == "number" : typeof l === o)) || y.endsWith("!") && (typeof l != "string" || !l.trim())) throw new Error(`${t} has an invalid ${o} value.`);
  } else if (Array.isArray(y)) {
    if (!Array.isArray(l)) throw new Error(`${t} must be an array.`);
    l.forEach((o, p) => ga(o, y[0], `${t}[${p}]`));
  } else {
    if (!Pa(l)) throw new Error(`${t} must be an object.`);
    for (const [o, p] of Object.entries(y)) if (typeof p == "string" && p.endsWith("!") && l[o] === void 0) throw new Error(`${t}.${o} is required.`);
    for (const [o, p] of Object.entries(l)) {
      const c = y[o] ?? y["*"];
      if (!c) throw new Error(`${t}.${o} is not an editor field.`);
      ga(p, c, `${t}.${o}`);
    }
  }
}
function Wl(l) {
  const y = JSON.parse(l);
  ga(y, Ml, "Declaration");
  const t = y;
  for (const o of t.dimensions ?? []) o.members ??= [];
  return t;
}
function Xe(l) {
  return JSON.parse(JSON.stringify(l));
}
const qa = /^[a-z][a-z0-9_]*$/;
function Hl(l) {
  return l.trim().normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function Fe(l, y, t) {
  t.length ? l[y] = t : delete l[y];
}
function ia(l, y, t) {
  if (t < 0 || t >= l.length || y === t) return;
  const [o] = l.splice(y, 1);
  l.splice(t, 0, o);
}
function oe(l, y) {
  return !l || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(l) ? y : l;
}
function ea(l) {
  return l ? oe(l.title, "Field type") : "Unknown type";
}
async function Ma(l, y) {
  const t = [...new Set(y)].map((p) => ({ type: "user", id: p }));
  if (!t.length) return {};
  const o = await ul(`/api/v1/pim-admin/catalogs/${encodeURIComponent(l)}/principal_labels`, { refs: t }, "People");
  return Object.fromEntries((o.principals ?? []).map((p) => [p.id, oe(p.label, "Person")]));
}
const na = [
  { value: "quarter", label: "¼", span: 3 },
  { value: "third", label: "⅓", span: 4 },
  { value: "half", label: "½", span: 6 },
  { value: "full", label: "1", span: 12 }
];
function ha(l, y, t) {
  return t.width ?? l.attributes[y + "." + t.code]?.width ?? "half";
}
const Jl = (l) => new Date(l).toLocaleString();
function ka(l) {
  const y = Math.abs(l.m).toString(), t = l.m < 0 ? "-" : "";
  if (l.e >= 0) return t + y + "0".repeat(l.e);
  const o = -l.e, p = y.padStart(o + 1, "0");
  return t + p.slice(0, p.length - o) + "." + p.slice(p.length - o);
}
function B(l) {
  const t = (l.includes(".") ? l.slice(l.indexOf(".") + 1) : l).replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : l;
}
function Le(l) {
  return l.labels.en ?? Object.values(l.labels)[0] ?? l.code;
}
function da(l, y) {
  if (l == null) return "";
  const t = (o) => {
    if (o == null) return "";
    if (typeof o == "object" && "ref" in o) {
      const p = o;
      if (p.ref[0] === "term") {
        const c = p.ref[1].slice(p.ref[1].indexOf(":") + 1), b = p.ref[1].slice(0, p.ref[1].indexOf(":")), m = y?.[b]?.find((C) => C.code === c);
        return m ? Le(m) : c;
      }
      return "Linked " + B(p.ref[0]).toLocaleLowerCase();
    }
    if (typeof o == "object" && "v" in o) {
      const p = o;
      return ka(p.v) + " " + p.u;
    }
    return typeof o == "object" && "m" in o ? ka(o) : typeof o == "boolean" ? o ? "Yes" : "No" : typeof o == "object" ? JSON.stringify(o) : oe(String(o), "Linked record");
  };
  return Array.isArray(l) ? l.map(t).join(", ") : t(l);
}
function Kl(l, y, t) {
  const o = da(y), p = da(t);
  return !p && o ? `${l} cleared (was ${o})` : o ? `${l}: ${o} → ${p}` : `${l} set to ${p}`;
}
const Gl = { class: "pim-table form pim-layout" }, Yl = {
  key: 0,
  class: "pim-layout-help muted"
}, Zl = {
  key: 1,
  class: "kx-empty"
}, Ql = { class: "pim-aspect-head" }, Xl = {
  key: 0,
  class: "muted small"
}, et = ["draggable", "onDragstart", "onDragover", "onDrop"], at = { class: "pim-lcard-top" }, lt = {
  key: 0,
  class: "pim-grip",
  "aria-hidden": "true"
}, tt = { class: "pim-lcard-name" }, st = { class: "pim-lcard-type" }, it = {
  key: 1,
  class: "pim-lcard-move"
}, nt = { class: "pim-aspect-head" }, ot = { class: "pim-canvas" }, dt = { class: "pim-lcard-top" }, rt = { class: "pim-lcard-name" }, ut = { class: "pim-lcard-type" }, ct = /* @__PURE__ */ de({
  __name: "LayoutEditor",
  props: {
    draft: {},
    schema: {},
    types: {}
  },
  setup(l) {
    const y = l, t = D(() => y.schema.access.admin), o = D(() => y.draft?.aspects ?? []), p = D(() => new Map(y.types.map((F) => [F.id, ea(F)]))), c = D(() => {
      if (!y.schema) return [];
      const F = new Set((y.draft?.aspects ?? []).map((w) => w.namespace)), v = /* @__PURE__ */ new Map();
      for (const [w, r] of Object.entries(y.schema.attributes)) {
        const U = w.split(".")[0];
        F.has(U) || !r.plugin || (v.has(U) || v.set(U, { aspect: U, plugin: r.plugin, codes: [] }), v.get(U).codes.push(w));
      }
      return [...v.values()];
    });
    function b(F, v) {
      return na.find((w) => w.value === ha(y.schema, F, v))?.span ?? 6;
    }
    const m = J(null), C = J(null);
    function A(F, v, w) {
      t.value && (m.value = { ns: F, index: v }, w.dataTransfer?.setData("text/plain", F + ":" + v), w.dataTransfer && (w.dataTransfer.effectAllowed = "move"));
    }
    function L(F, v, w) {
      !m.value || m.value.ns !== F || (w.preventDefault(), C.value = { ns: F, index: v });
    }
    function Q(F, v) {
      t.value && m.value?.ns === F.namespace && ia(F.attributes ?? [], m.value.index, v), m.value = null, C.value = null;
    }
    function P() {
      m.value = null, C.value = null;
    }
    return (F, v) => (e(), i("div", Gl, [
      t.value ? (e(), i("p", Yl, "Arrange fields within each group and choose their widths. Review changes before applying the layout.")) : h("", !0),
      o.value.length === 0 ? (e(), i("div", Zl, [
        v[1] || (v[1] = G("This catalog has no field groups yet.", -1)),
        t.value ? (e(), i(E, { key: 0 }, [
          G(" Add a field group in Fields.")
        ], 64)) : h("", !0)
      ])) : h("", !0),
      (e(!0), i(E, null, ee(o.value, (w) => (e(), i("section", {
        key: w.namespace,
        class: "pim-aspect"
      }, [
        a("header", Ql, [
          a("h3", null, $(s(B)(w.namespace)), 1),
          t.value ? (e(), i("span", Xl, "drag a field, or use its arrows")) : h("", !0)
        ]),
        a("div", {
          class: "pim-canvas",
          onDragover: v[0] || (v[0] = Ie(() => {
          }, ["prevent"]))
        }, [
          (e(!0), i(E, null, ee(w.attributes ?? [], (r, U) => (e(), i("div", {
            key: r.code,
            class: Ve(["pim-lcard", { dragging: m.value?.ns === w.namespace && m.value?.index === U, over: C.value?.ns === w.namespace && C.value?.index === U }]),
            style: ba({ gridColumn: "span " + b(w.namespace, r) }),
            draggable: t.value,
            onDragstart: (R) => A(w.namespace, U, R),
            onDragover: (R) => L(w.namespace, U, R),
            onDrop: Ie((R) => Q(w, U), ["prevent"]),
            onDragend: P
          }, [
            a("div", at, [
              t.value ? (e(), i("span", lt, [
                f(s(le), { icon: "tabler:grip-vertical" })
              ])) : h("", !0),
              a("span", tt, $(s(B)(r.code)), 1),
              a("span", st, $(p.value.get(r.type) ?? s(ea)(void 0)), 1),
              t.value ? (e(), i("span", it, [
                f(s(H), {
                  type: "button",
                  disabled: U === 0,
                  "aria-label": "Move " + s(B)(r.code) + " earlier",
                  onClick: (R) => s(ia)(w.attributes ?? [], U, U - 1),
                  class: "arrow",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: k(() => [
                    f(s(le), { icon: "tabler:arrow-left" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                f(s(H), {
                  type: "button",
                  disabled: U === (w.attributes ?? []).length - 1,
                  "aria-label": "Move " + s(B)(r.code) + " later",
                  onClick: (R) => s(ia)(w.attributes ?? [], U, U + 1),
                  class: "arrow",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: k(() => [
                    f(s(le), { icon: "tabler:arrow-right" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ])) : h("", !0)
            ]),
            f(s(_a), {
              disabled: !t.value,
              "model-value": s(ha)(l.schema, w.namespace, r),
              options: s(na),
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Width of " + s(B)(r.code),
              "onUpdate:modelValue": (R) => r.width = R
            }, null, 8, ["disabled", "model-value", "options", "aria-label", "onUpdate:modelValue"])
          ], 46, et))), 128))
        ], 32)
      ]))), 128)),
      (e(!0), i(E, null, ee(c.value, (w) => (e(), i("section", {
        key: w.aspect,
        class: "pim-aspect"
      }, [
        a("header", nt, [
          a("h3", null, $(s(B)(w.aspect)), 1),
          v[2] || (v[2] = a("span", { class: "muted small" }, "Provided by a plugin", -1))
        ]),
        a("div", ot, [
          (e(!0), i(E, null, ee(w.codes, (r) => (e(), i("div", {
            key: r,
            class: "pim-lcard fixed",
            style: ba({ gridColumn: "span " + (s(na).find((U) => U.value === l.schema.attributes[r].width)?.span ?? 6) })
          }, [
            a("div", dt, [
              a("span", rt, $(s(B)(r)), 1),
              a("span", ut, $(p.value.get(l.schema.attributes[r].type) ?? s(ea)(void 0)), 1)
            ])
          ], 4))), 128))
        ])
      ]))), 128))
    ]));
  }
}), mt = {
  class: "pim-history",
  "aria-label": "Catalog history"
}, pt = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, vt = { class: "pim-table pim-responsive-table" }, ft = ["id"], bt = ["aria-labelledby"], yt = {
  key: 0,
  scope: "col"
}, gt = { class: "muted small" }, ht = ["datetime"], kt = {
  key: 0,
  class: "small"
}, _t = {
  key: 0,
  class: "muted"
}, wt = { class: "mono small" }, $t = {
  key: 0,
  class: "muted"
}, Ct = {
  key: 0,
  class: "muted small"
}, xt = ["aria-labelledby"], Vt = { class: "pim-stacked-meta muted small" }, Ut = { key: 0 }, jt = { key: 1 }, At = ["datetime"], St = {
  key: 1,
  class: "kx-empty"
}, Ot = { class: "pim-table-foot" }, Rt = /* @__PURE__ */ de({
  __name: "HistoryPanel",
  props: {
    catalogId: {},
    canResolveActors: { type: Boolean }
  },
  setup(l) {
    const y = l, t = J([]), o = J({}), p = J(), c = J(!1), b = J(), m = Ke(), C = Ne(), A = D(() => t.value.map((v) => ({
      key: `${v.seq}:${v.n}`,
      at: v.at,
      date: Jl(v.at),
      actor: o.value[v.actor] ?? oe(v.actor, "Person"),
      source: v.source ? oe(B(v.source), "Data source") : "",
      product: Q(v),
      context: v.ctx ? oe(v.ctx, "Product context") : "",
      change: P(v)
    })));
    async function L(v = !1) {
      const w = m.begin();
      c.value = !0, b.value = void 0;
      try {
        const r = await ce.history(y.catalogId, { limit: 50, before: v ? p.value : void 0 });
        if (!m.current(w)) return;
        if (t.value = v ? [...t.value, ...r.entries] : r.entries, p.value = r.next, y.canResolveActors)
          try {
            const U = await Ma(y.catalogId, r.entries.map((R) => R.actor));
            m.current(w) && (o.value = { ...o.value, ...U });
          } catch {
          }
      } catch (r) {
        if (!m.current(w)) return;
        b.value = Ee(r, "Could not load the history.");
      } finally {
        m.current(w) && (c.value = !1);
      }
    }
    function Q(v) {
      return v.sku ? v.sku : v.subject.startsWith("p:") ? "purged product" : v.subject.startsWith("t:") ? v.subject.slice(2) : v.subject.startsWith("r:") ? "Release" : oe(v.subject, "Catalog");
    }
    function P(v) {
      if (v.attribute)
        return Kl(B(v.attribute), v.before, v.after);
      switch (v.kind) {
        case "schema":
          return "Catalog settings applied";
        case "term": {
          const w = v.after ?? {}, r = w.labels?.en ?? Object.values(w.labels ?? {})[0];
          return w.retired ? "Term retired" : r ? `Term labelled "${r}"` + (w.parent ? ` under ${w.parent}` : "") : "Term changed";
        }
        case "created": {
          const w = v.after ?? {};
          return `Created as ${B(w.family ?? "product")}` + (w.level ? ` at level ${w.level}` : "");
        }
        case "released": {
          const w = v.after ?? {};
          return `Released v${w.version ?? ""} to ${(w.channels ?? []).join(", ")}`;
        }
        case "withdrawn":
          return `Withdrawn from ${((v.after ?? {}).channels ?? []).join(", ")}`;
        case "status":
          return `Status ${String(v.before ?? "")} → ${String(v.after ?? "")}`;
        case "moved":
          return "Moved under another parent";
        default:
          return B(v.kind);
      }
    }
    let F = () => {
    };
    return fe(() => y.catalogId, () => {
      F(), m.begin(), t.value = [], o.value = {}, p.value = void 0, b.value = void 0, F = La(`component.${y.catalogId}`, () => {
        L();
      });
    }, { immediate: !0 }), fe(() => y.catalogId, () => {
      L();
    }), ra(() => L()), Ze(() => {
      F(), m.begin();
    }), (v, w) => (e(), i("section", mt, [
      b.value ? (e(), T(ua, {
        key: 0,
        error: b.value
      }, {
        default: k(() => [
          f(s(H), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: w[0] || (w[0] = (r) => L())
          }, {
            default: k(() => [...w[2] || (w[2] = [
              G("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : h("", !0),
      c.value ? (e(), i("div", pt, "Loading history…")) : h("", !0),
      a("div", vt, [
        a("p", {
          id: s(C),
          class: "pim-history-caption muted small"
        }, "Catalog changes, newest first", 8, ft),
        A.value.length ? (e(), i(E, { key: 0 }, [
          a("table", {
            class: "pim-grid",
            "aria-labelledby": s(C)
          }, [
            a("thead", null, [
              a("tr", null, [
                w[3] || (w[3] = a("th", { scope: "col" }, "When", -1)),
                l.canResolveActors ? (e(), i("th", yt, "Who")) : h("", !0),
                w[4] || (w[4] = a("th", { scope: "col" }, "What", -1)),
                w[5] || (w[5] = a("th", { scope: "col" }, "Change", -1))
              ])
            ]),
            a("tbody", null, [
              (e(!0), i(E, null, ee(A.value, (r) => (e(), i("tr", {
                key: r.key
              }, [
                a("td", gt, [
                  a("time", {
                    datetime: r.at
                  }, $(r.date), 9, ht)
                ]),
                l.canResolveActors ? (e(), i("td", kt, [
                  G($(r.actor), 1),
                  r.source ? (e(), i("span", _t, " via " + $(r.source), 1)) : h("", !0)
                ])) : h("", !0),
                a("td", wt, [
                  G($(r.product), 1),
                  r.context ? (e(), i("span", $t, " · " + $(r.context), 1)) : h("", !0)
                ]),
                a("td", null, [
                  G($(r.change), 1),
                  !l.canResolveActors && r.source ? (e(), i("span", Ct, " via " + $(r.source), 1)) : h("", !0)
                ])
              ]))), 128))
            ])
          ], 8, bt),
          a("ol", {
            role: "list",
            class: "pim-stacked-list",
            "aria-labelledby": s(C)
          }, [
            (e(!0), i(E, null, ee(A.value, (r) => (e(), i("li", {
              key: r.key,
              class: "pim-stacked-row"
            }, [
              a("div", null, $(r.change), 1),
              a("div", Vt, [
                l.canResolveActors ? (e(), i("span", Ut, [
                  a("span", null, $(r.actor), 1),
                  r.source ? (e(), i(E, { key: 0 }, [
                    G(" via " + $(r.source), 1)
                  ], 64)) : h("", !0)
                ])) : r.source ? (e(), i("span", jt, "Via " + $(r.source), 1)) : h("", !0),
                a("time", {
                  datetime: r.at
                }, $(r.date), 9, At),
                a("span", null, [
                  G($(r.product), 1),
                  r.context ? (e(), i(E, { key: 0 }, [
                    G(" · " + $(r.context), 1)
                  ], 64)) : h("", !0)
                ])
              ])
            ]))), 128))
          ], 8, xt)
        ], 64)) : !c.value && !b.value ? (e(), i("div", St, "Nothing recorded yet.")) : h("", !0),
        a("div", Ot, [
          a("span", null, $(A.value.length) + " change" + $(A.value.length === 1 ? "" : "s") + " shown", 1),
          p.value ? (e(), T(s(H), {
            key: 0,
            type: "button",
            disabled: c.value,
            onClick: w[1] || (w[1] = (r) => L(!0)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: k(() => [
              f(s(le), {
                icon: "tabler:adjustments",
                "aria-hidden": "true"
              }),
              w[6] || (w[6] = G(" Load older", -1))
            ]),
            _: 1
          }, 8, ["disabled"])) : h("", !0)
        ])
      ])
    ]));
  }
}), It = { class: "system-section-head" }, Tt = { class: "system-section-head-text" }, Pt = {
  key: 0,
  class: "kx-head-actions"
}, qt = /* @__PURE__ */ de({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(l) {
    return (y, t) => (e(), i("header", It, [
      a("div", Tt, [
        a("h1", null, $(l.title), 1),
        a("p", null, $(l.description), 1)
      ]),
      y.$slots.actions ? (e(), i("div", Pt, [
        xe(y.$slots, "actions")
      ])) : h("", !0)
    ]));
  }
}), Nt = /* @__PURE__ */ de({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(l) {
    return (y, t) => (e(), i(E, null, [
      f(s(ge), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      f(s(H), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: l.busy || l.discardDisabled,
        onClick: t[0] || (t[0] = (o) => y.$emit("discard"))
      }, {
        icon: k(() => [
          f(s(le), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      f(s(H), {
        label: "Review changes",
        type: "button",
        disabled: l.busy || l.reviewDisabled,
        loading: l.busy,
        onClick: t[1] || (t[1] = (o) => y.$emit("review", o.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), Dt = ["onKeydown"], zt = ["id"], Te = /* @__PURE__ */ de({
  __name: "AddSchemaCode",
  props: {
    label: {},
    action: {},
    existing: {},
    fromName: { type: Boolean }
  },
  emits: ["add"],
  setup(l, { emit: y }) {
    const t = l, o = y, p = J(""), c = J(!1), b = J(), m = Ne(), C = D(() => {
      const v = p.value.trim();
      return t.fromName ? Hl(v) : v;
    }), A = D(() => p.value.trim() ? t.existing?.includes(C.value) ? t.fromName ? "This name is already in use." : "This code is already in use." : t.fromName && !qa.test(C.value) ? "Use a name that starts with a letter from A to Z." : qa.test(C.value) ? "" : "Start with a lowercase letter and use only lowercase letters, numbers or underscores." : ""), L = D(() => !!C.value && !A.value);
    async function Q() {
      c.value = !0, await Ge(), b.value?.querySelector("input")?.focus();
    }
    async function P() {
      c.value = !1, p.value = "", await Ge(), b.value?.querySelector("button")?.focus();
    }
    function F() {
      L.value && (o("add", C.value), P());
    }
    return (v, w) => (e(), i("div", {
      ref_key: "row",
      ref: b,
      class: "row pim-add-row"
    }, [
      c.value ? (e(), i("div", {
        key: 1,
        class: "row pim-add-editor",
        onKeydown: aa(Ie(P, ["stop", "prevent"]), ["esc"])
      }, [
        f(s(Ye), {
          modelValue: p.value,
          "onUpdate:modelValue": w[0] || (w[0] = (r) => p.value = r),
          type: "text",
          placeholder: l.label,
          "aria-label": l.label,
          invalid: !!A.value,
          "aria-describedby": A.value ? s(m) : void 0,
          class: Ve({ mono: !l.fromName }),
          onKeydown: aa(Ie(F, ["prevent"]), ["enter"])
        }, null, 8, ["modelValue", "placeholder", "aria-label", "invalid", "aria-describedby", "class", "onKeydown"]),
        f(s(H), {
          type: "button",
          disabled: !L.value,
          size: "small",
          onClick: F
        }, {
          default: k(() => [
            G($(l.action), 1)
          ]),
          _: 1
        }, 8, ["disabled"]),
        f(s(H), {
          type: "button",
          label: "Cancel",
          text: "",
          severity: "secondary",
          size: "small",
          onClick: P
        }),
        A.value ? (e(), i("p", {
          key: 0,
          id: s(m),
          role: "status",
          class: "pim-add-code-error small"
        }, $(A.value), 9, zt)) : h("", !0)
      ], 40, Dt)) : (e(), T(s(H), {
        key: 0,
        type: "button",
        "aria-expanded": "false",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: Q
      }, {
        default: k(() => [
          f(s(le), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          G(" " + $(l.action), 1)
        ]),
        _: 1
      })),
      xe(v.$slots, "default")
    ], 512));
  }
}), Wa = Symbol("definitionColumns"), Bt = { code: "Code", kind: "Kind", details: "Details", usage: "Used by" }, Lt = {
  code: "minmax(120px, 1fr)",
  kind: "140px",
  details: "minmax(120px, 1.2fr)",
  usage: "120px"
}, Ft = {
  class: "pim-definition-scroll",
  tabindex: "0",
  "aria-label": "Definitions"
}, Et = { class: "pim-definition-grid" }, Mt = {
  key: 0,
  class: "pim-definition-columns",
  "aria-hidden": "true"
}, Pe = /* @__PURE__ */ de({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: { default: () => ["code"] }
  },
  setup(l) {
    const y = l;
    wl(Wa, D(() => y.columns));
    const t = D(() => ["48px", "minmax(160px, 1.4fr)", ...y.columns.map((o) => Lt[o]), "80px"].join(" "));
    return (o, p) => (e(), i("section", {
      class: "form pim-definition-list",
      style: ba({ "--pim-definition-columns": t.value })
    }, [
      xe(o.$slots, "head"),
      a("div", Ft, [
        a("div", Et, [
          l.count > 3 ? (e(), i("div", Mt, [
            p[0] || (p[0] = a("span", null, null, -1)),
            p[1] || (p[1] = a("span", null, "Name", -1)),
            (e(!0), i(E, null, ee(l.columns, (c) => (e(), i("span", {
              key: c,
              class: Ve("pim-definition-" + c)
            }, $(s(Bt)[c]), 3))), 128)),
            p[2] || (p[2] = a("span", null, null, -1))
          ])) : h("", !0),
          xe(o.$slots, "default")
        ])
      ]),
      xe(o.$slots, "add")
    ], 4));
  }
}), Wt = ["aria-label"], Ht = /* @__PURE__ */ de({
  __name: "InteractiveSurface",
  props: {
    label: {}
  },
  setup(l) {
    return (y, t) => (e(), i("button", {
      type: "button",
      class: "pim-interactive",
      "aria-label": l.label
    }, [
      xe(y.$slots, "default")
    ], 8, Wt));
  }
}), Jt = { class: "pim-definition" }, Kt = {
  class: "pim-definition-lead",
  "data-column": "lead"
}, Gt = {
  class: "pim-row-title",
  "data-column": "name"
}, Yt = { class: "pim-definition-meta" }, Zt = ["data-column"], Qt = {
  key: 0,
  class: "mono"
}, Xt = {
  class: "pim-definition-actions",
  "data-column": "actions"
}, es = ["id"], qe = /* @__PURE__ */ de({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ ya({
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
    const y = l, t = $l(Wa, D(() => [
      ...y.code ? ["code"] : [],
      ...y.kind ? ["kind"] : []
    ])), o = za(l, "open"), p = Ne();
    return (c, b) => (e(), i("section", Jt, [
      a("header", {
        class: Ve(["pim-definition-head", l.headClass])
      }, [
        f(Ht, {
          class: Ve(["pim-definition-toggle", l.toggleClass]),
          "aria-expanded": o.value,
          "aria-controls": o.value ? s(p) : void 0,
          onClick: b[0] || (b[0] = (m) => o.value = !o.value)
        }, {
          default: k(() => [
            a("span", Kt, [
              f(s(le), {
                icon: "tabler:chevron-right",
                class: "pim-definition-chevron",
                "aria-hidden": "true"
              })
            ]),
            a("span", Gt, $(l.title), 1),
            a("span", Yt, [
              (e(!0), i(E, null, ee(s(t), (m) => (e(), i("span", {
                key: m,
                class: Ve("pim-definition-" + m),
                "data-column": m
              }, [
                m === "code" && l.code ? (e(), i("code", Qt, $(l.code), 1)) : m === "kind" && l.kind ? (e(), T(s(ge), {
                  key: 1,
                  severity: "secondary",
                  value: l.kind
                }, null, 8, ["value"])) : m === "details" ? xe(c.$slots, "details", {}, void 0, void 0, 2) : m === "usage" ? xe(c.$slots, "usage", {}, () => [
                  G($(l.usage), 1)
                ], void 0, 3) : h("", !0)
              ], 10, Zt))), 128))
            ])
          ]),
          _: 3
        }, 8, ["class", "aria-expanded", "aria-controls"]),
        a("div", Xt, [
          xe(c.$slots, "actions")
        ])
      ], 2),
      f(Cl, { name: "pim-expand" }, {
        default: k(() => [
          o.value ? (e(), i("div", {
            key: 0,
            id: s(p),
            class: "pim-definition-body"
          }, [
            xe(c.$slots, "default")
          ], 8, es)) : h("", !0)
        ]),
        _: 3
      })
    ]));
  }
}), as = { class: "pim-chips pim-picker-chips" }, ls = {
  key: 0,
  class: "muted small"
}, je = /* @__PURE__ */ de({
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
  setup(l, { emit: y }) {
    const t = l, o = y, p = J("");
    function c(L) {
      return t.modelValue.includes(L);
    }
    function b(L) {
      t.disabled || !L || o("update:modelValue", c(L) ? t.modelValue.filter((Q) => Q !== L) : [...t.modelValue, L]);
    }
    function m() {
      const L = p.value.trim();
      if (!L || c(L)) {
        p.value = "";
        return;
      }
      o("update:modelValue", [...t.modelValue, L]), p.value = "";
    }
    function C(L) {
      o("update:modelValue", t.modelValue.filter((Q) => Q !== L));
    }
    function A(L) {
      return t.options?.find((Q) => Q.value === L)?.label ?? L;
    }
    return (L, Q) => (e(), i("div", as, [
      l.disabled ? (e(), i(E, { key: 0 }, [
        (e(!0), i(E, null, ee(l.modelValue, (P) => (e(), i("span", { key: P }, $(A(P)), 1))), 128)),
        l.modelValue.length ? h("", !0) : (e(), i("span", ls, "None"))
      ], 64)) : l.options && (l.dropdown || l.options.length > 10) ? (e(), i(E, { key: 1 }, [
        (e(!0), i(E, null, ee(l.modelValue, (P) => (e(), i("span", {
          key: P,
          class: "row"
        }, [
          G($(A(P)), 1),
          l.disabled ? h("", !0) : (e(), T(s(H), {
            key: 0,
            type: "button",
            "aria-label": "Remove " + A(P),
            onClick: (F) => C(P),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: k(() => [
              f(s(le), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"]))
        ]))), 128)),
        l.disabled ? h("", !0) : (e(), T(s(_e), {
          key: 0,
          "model-value": null,
          placeholder: l.placeholder ?? "Add…",
          "aria-labelledby": l.labelledby,
          "aria-label": l.placeholder ?? "Add",
          "onUpdate:modelValue": Q[0] || (Q[0] = (P) => b(P)),
          class: "pim-chip-entry",
          options: l.options.filter((P) => !c(P.value)).map((P) => ({ value: P.value, label: P.label ?? P.value })),
          "option-label": "label",
          "option-value": "value",
          appendTo: "self"
        }, null, 8, ["placeholder", "aria-labelledby", "aria-label", "options"]))
      ], 64)) : l.options ? (e(), i(E, { key: 2 }, [
        f(s(_a), {
          "model-value": l.modelValue.filter((P) => l.options.some((F) => F.value === P)),
          options: l.options.map((P) => ({ value: P.value, label: P.label ?? P.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          disabled: l.disabled,
          "aria-labelledby": l.labelledby,
          "aria-label": l.placeholder ?? "Selected values",
          "onUpdate:modelValue": Q[1] || (Q[1] = (P) => o("update:modelValue", [...P, ...l.modelValue.filter((F) => !l.options.some((v) => v.value === F))]))
        }, null, 8, ["model-value", "options", "disabled", "aria-labelledby", "aria-label"]),
        (e(!0), i(E, null, ee(l.modelValue.filter((P) => !l.options.some((F) => F.value === P)), (P) => (e(), i("span", {
          key: P,
          class: "row"
        }, [
          G($(A(P)), 1),
          f(s(H), {
            type: "button",
            "aria-label": "Remove " + P,
            onClick: (F) => C(P),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: k(() => [
              f(s(le), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128))
      ], 64)) : (e(!0), i(E, { key: 3 }, ee(l.modelValue, (P) => (e(), i("span", {
        key: P,
        class: "row"
      }, [
        G($(P), 1),
        f(s(H), {
          type: "button",
          "aria-label": "Remove " + P,
          onClick: (F) => C(P),
          size: "small",
          text: "",
          severity: "secondary"
        }, {
          default: k(() => [
            f(s(le), { icon: "tabler:x" })
          ]),
          _: 1
        }, 8, ["aria-label", "onClick"])
      ]))), 128)),
      l.free && !l.disabled ? (e(), T(s(Ye), {
        key: 4,
        modelValue: p.value,
        "onUpdate:modelValue": Q[2] || (Q[2] = (P) => p.value = P),
        type: "text",
        "aria-labelledby": l.labelledby,
        placeholder: l.placeholder ?? "Add…",
        onKeydown: aa(Ie(m, ["prevent"]), ["enter"]),
        onBlur: m,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "aria-labelledby", "placeholder", "onKeydown"])) : h("", !0)
    ]));
  }
}), ts = { key: 0 }, ss = {
  key: 0,
  class: "pim-config-overrides"
}, is = {
  key: 1,
  class: "muted small"
}, ns = { key: 3 }, os = ["schema", "config"], ds = {
  key: 1,
  class: "muted small",
  role: "status"
}, wa = /* @__PURE__ */ de({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean },
    problem: {},
    problemLabel: {},
    pluginId: {}
  },
  emits: ["update:modelValue"],
  setup(l, { emit: y }) {
    const t = l, o = y, p = J("pending"), c = D(() => {
      const C = t.schema.properties;
      return Object.entries(t.modelValue).map(([A, L]) => ({
        key: A,
        label: C?.[A]?.title ?? B(A),
        value: L !== null && typeof L == "object" ? JSON.stringify(L) : da(L)
      }));
    });
    async function b() {
      p.value = "pending", p.value = await Na("wc-schema-form") ? "ready" : "failed";
    }
    fe(() => t.disabled, (C) => {
      C || b();
    }, { immediate: !0 });
    function m(C) {
      const A = C.detail;
      A && typeof A == "object" && !Array.isArray(A) && o("update:modelValue", A);
    }
    return (C, A) => (e(), i(E, null, [
      l.problem ? (e(), T(s(we), {
        key: 0,
        severity: "warn",
        role: "alert"
      }, {
        default: k(() => [
          l.problemLabel ? (e(), i(E, { key: 0 }, [
            G($(l.problemLabel) + " is required. Enter a value below.", 1)
          ], 64)) : (e(), i(E, { key: 1 }, [
            G("The saved settings don’t meet the plugin’s requirements. Update the configuration below.")
          ], 64))
        ]),
        _: 1
      })) : h("", !0),
      l.problem ? (e(), T(Re, {
        key: 1,
        class: "small pim-error-code pim-ia-disclosure",
        label: "Technical details"
      }, {
        default: k(() => [
          l.pluginId ? (e(), i("p", ts, [
            A[1] || (A[1] = G("Plugin ", -1)),
            a("code", null, $(l.pluginId), 1)
          ])) : h("", !0),
          a("p", null, $(l.problem.message), 1)
        ]),
        _: 1
      })) : h("", !0),
      l.disabled ? (e(), i(E, { key: 2 }, [
        c.value.length ? (e(), i("dl", ss, [
          (e(!0), i(E, null, ee(c.value, (L) => (e(), i(E, {
            key: L.key
          }, [
            a("dt", null, $(L.label), 1),
            a("dd", null, $(L.value), 1)
          ], 64))), 128))
        ])) : (e(), i("span", is, "No overrides"))
      ], 64)) : (e(), i("div", ns, [
        p.value === "ready" ? (e(), i("wc-schema-form", {
          key: 0,
          schema: JSON.stringify(t.schema),
          config: JSON.stringify(l.modelValue),
          onConfigChanged: m
        }, null, 40, os)) : p.value === "pending" ? (e(), i("span", ds, "Configuration form is loading.")) : (e(), T(s(we), {
          key: 2,
          role: "alert",
          severity: "error"
        }, {
          default: k(() => [
            A[3] || (A[3] = G("Configuration form could not be loaded. ", -1)),
            f(s(H), {
              type: "button",
              onClick: b,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: k(() => [...A[2] || (A[2] = [
                G("Retry", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })),
        l.problem ? h("", !0) : (e(), T(s(H), {
          key: 3,
          type: "button",
          onClick: A[0] || (A[0] = (L) => o("update:modelValue", {})),
          severity: "secondary",
          outlined: "",
          size: "small"
        }, {
          default: k(() => [
            f(s(le), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            }),
            A[4] || (A[4] = G(" Reset overrides", -1))
          ]),
          _: 1
        }))
      ]))
    ], 64));
  }
}), rs = { key: 0 }, us = /* @__PURE__ */ de({
  __name: "DefaultValue",
  props: {
    attribute: {},
    type: {},
    disabled: { type: Boolean }
  },
  emits: ["change"],
  setup(l, { emit: y }) {
    const t = l, o = y, p = D(() => {
      const C = t.type?.form;
      let A = { type: "string" };
      return C === "bool" ? A = { type: "boolean" } : C === "int" ? A = { type: "integer" } : C === "dec" ? A = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : C === "quantity" ? A = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(t.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : C === "record" ? A = { type: "object", additionalProperties: !0 } : C === "ref" && (A = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${t.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (t.attribute.cardinality ?? "one") !== "one" && (A = { type: "array", items: A, uniqueItems: t.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...A, title: "Default value" } } };
    });
    function c(C) {
      return C && typeof C == "object" && "m" in C && "e" in C ? ka(C) : C;
    }
    function b(C) {
      return t.type?.form === "dec" ? c(C) : t.type?.form === "quantity" && C && typeof C == "object" && "v" in C && "u" in C ? { value: c(C.v), unit: C.u } : C;
    }
    const m = D(() => t.attribute.default === void 0 ? {} : { value: Array.isArray(t.attribute.default) ? t.attribute.default.map(b) : b(t.attribute.default) });
    return (C, A) => l.disabled ? (e(), i("span", rs, $(l.attribute.default == null ? "No default" : s(da)(l.attribute.default)), 1)) : (e(), T(wa, {
      key: 1,
      schema: p.value,
      "model-value": m.value,
      "onUpdate:modelValue": A[0] || (A[0] = (L) => o("change", L.value))
    }, null, 8, ["schema", "model-value"]));
  }
}), cs = { class: "pim-stack" }, ms = {
  key: 0,
  class: "pim-ia-action"
}, ps = {
  key: 1,
  class: "form pim-card-body pad muted"
}, vs = { class: "pim-bsection-head pim-list-header" }, fs = { class: "small muted" }, bs = { class: "row pim-list-actions" }, ys = { class: "pim-fields" }, gs = { class: "pim-f pim-w-third" }, hs = { class: "pim-f-label" }, ks = ["id"], _s = { class: "pim-f pim-w-third" }, ws = { class: "pim-f-label" }, $s = ["id"], Cs = {
  key: 0,
  class: "pim-f pim-w-third"
}, xs = { class: "pim-f-label" }, Vs = ["id"], Us = {
  key: 1,
  class: "pim-f pim-w-full muted small"
}, js = {
  key: 2,
  class: "pim-f pim-w-full muted small"
}, As = {
  key: 3,
  class: "pim-f pim-w-third"
}, Ss = { class: "pim-f-label" }, Os = ["id"], Rs = { class: "pim-f pim-w-third" }, Is = { class: "pim-f-label" }, Ts = ["id"], Ps = { class: "pim-f pim-w-half" }, qs = { class: "pim-f-label" }, Ns = ["id"], Ds = ["aria-labelledby"], zs = { class: "pim-f-label" }, Bs = ["id"], Ls = ["aria-labelledby"], Fs = { class: "pim-f-label" }, Es = ["id"], Ms = { class: "pim-fields" }, Ws = { class: "pim-f pim-w-third" }, Hs = { class: "pim-f-label" }, Js = ["for"], Ks = {
  key: 0,
  class: "pim-f-note"
}, Gs = { class: "pim-f pim-w-third" }, Ys = { class: "pim-f-label" }, Zs = ["id"], Qs = { class: "pim-f pim-w-half" }, Xs = { class: "pim-f-label" }, ei = ["for"], ai = { class: "row" }, li = {
  key: 0,
  class: "pim-f pim-w-full"
}, ti = { class: "pim-f-label" }, si = ["id"], ii = ["aria-labelledby"], ni = ["id"], oi = {
  key: 0,
  class: "row end"
}, di = { class: "pim-ia-dialog-head" }, ri = {
  tabindex: "-1",
  autofocus: ""
}, ui = { class: "pim-source-permissions" }, ci = ["id"], mi = { class: "dialog-actions pim-group-dialog-actions" }, pi = /* @__PURE__ */ de({
  __name: "BuilderFields",
  props: /* @__PURE__ */ ya({
    draft: {},
    schema: {},
    options: {}
  }, {
    family: { default: "" },
    familyModifiers: {}
  }),
  emits: /* @__PURE__ */ ya(["remove"], ["update:family"]),
  setup(l, { emit: y }) {
    const t = l, o = za(l, "family"), p = y, c = na.map((j) => j.value), b = [{ value: "one", label: "Single value" }, { value: "list", label: "Ordered list" }, { value: "set", label: "Unique set" }], m = D(() => t.schema.access.admin), C = D(() => t.draft.aspects ?? []), A = D(() => (t.draft.families ?? []).filter((j) => j.code !== "generic"));
    fe(A, (j) => {
      o.value && !j.some((S) => S.code === o.value) && (o.value = "");
    }, { immediate: !0 });
    const L = D(() => [{ value: "", label: "All families" }, ...A.value.map((j) => ({ value: j.code, label: B(j.code) }))]), Q = D(() => {
      const j = A.value.find((S) => S.code === o.value);
      return j ? C.value.filter((S) => j.aspects?.includes(S.namespace)) : C.value;
    }), P = D(() => (t.draft.dimensions ?? []).map((j) => ({ value: j.name, label: B(j.name) }))), F = D(() => (t.draft.vocabularies ?? []).map((j) => j.code)), v = D(() => (t.draft.sources ?? []).map((j) => ({ value: j.id, label: B(j.id) }))), w = D(() => [...t.options.types].sort((j, S) => j.form.localeCompare(S.form)).map((j) => ({ value: j.id, label: ea(j) })));
    function r(j) {
      return t.options.types.find((S) => S.id === j.type);
    }
    function U(j) {
      return r(j)?.target === "term";
    }
    function R(j) {
      return r(j)?.target === "asset";
    }
    function M(j) {
      const S = r(j);
      return !!S && S.form === "ref" && !S.target;
    }
    function ie(j) {
      return A.value.filter((S) => S.aspects?.includes(j)).map((S) => B(S.code));
    }
    function me(j) {
      const S = ie(j);
      return S.length ? S.length === 1 ? S[0] : S.length + " families" : "Unused by families";
    }
    const W = { none: "None", key: "Exact match", number: "Number range", text: "Text search" }, se = J({}), N = Ne(), q = /* @__PURE__ */ new WeakMap();
    let K = 0;
    function z(j, S) {
      if (S.id !== void 0) return j + "." + S.id;
      const I = xl(S);
      let x = q.get(I);
      return x === void 0 && (x = ++K, q.set(I, x)), j + ".draft-" + x;
    }
    function n(j, S, I) {
      return N + "-" + z(j, S) + "-" + I;
    }
    function V(j, S) {
      j.type = S;
      const I = r(j);
      if (I && j.index && !I.indexes.includes(j.index) && delete j.index, U(j) || delete j.vocabulary, R(j) && delete j.default, !M(j) && j.config && "target" in j.config) {
        const { target: x, ...re } = j.config;
        j.config = Object.keys(re).length ? re : void 0, j.config || delete j.config;
      }
    }
    function d(j, S) {
      Object.keys(S).length ? j.config = S : delete j.config;
    }
    function u(j, S) {
      const I = { ...j.config ?? {} };
      S ? I.target = S : delete I.target, d(j, I);
    }
    function X(j, S) {
      S.length ? j.scope = S : delete j.scope, S.length || delete j.index_contexts;
    }
    function Y(j, S, I) {
      I === void 0 || I === "" || I === !1 && S !== "default" ? delete j[S] : j[S] = I;
    }
    function ae(j) {
      return j.index_contexts ?? [];
    }
    function Ae(j) {
      return (t.draft.dimensions ?? []).find((S) => S.name === j)?.members ?? [];
    }
    function Me(j) {
      const S = {};
      for (const x of j.scope ?? []) S[x] = Ae(x)[0] ?? "";
      (j.index_contexts ?? (j.index_contexts = [])).push(S);
    }
    const ve = J(), De = D(() => ve.value ? B(ve.value.namespace) + " settings" : "");
    async function ta(j, S, I, x) {
      const re = j.currentTarget, Z = re.parentElement;
      ia(S, I, x), await Ge(), re.disabled ? Z?.querySelector("button:enabled")?.focus({ preventScroll: !0 }) : re.focus({ preventScroll: !0 });
    }
    function ca(j) {
      (t.draft.aspects ??= []).push({ namespace: j, attributes: [] });
    }
    function Se(j) {
      ve.value = void 0;
      const S = C.value.indexOf(j);
      S >= 0 && C.value.splice(S, 1), t.schema.declaration.aspects?.some((I) => I.namespace === j.namespace) && p("remove", "aspects", j.namespace);
    }
    function Ue(j, S) {
      const I = t.options.types.find((re) => re.id === "kickside.pim.types:text") ?? t.options.types[0], x = { code: S, type: I?.id ?? "" };
      (j.attributes ??= []).push(x), se.value[z(j.namespace, x)] = !0;
    }
    function pe(j, S) {
      const I = j.attributes ?? [], x = I.indexOf(S);
      x >= 0 && I.splice(x, 1);
      const re = S.id === void 0 ? void 0 : t.schema.declaration.aspects?.find((Z) => Z.namespace === j.namespace)?.attributes?.find((Z) => Z.id === S.id);
      re && p("remove", "attributes", j.namespace + "." + re.code);
    }
    return (j, S) => (e(), i("div", cs, [
      A.value.length || m.value && !o.value ? (e(), i("div", ms, [
        A.value.length ? (e(), T(s(_e), {
          key: 0,
          modelValue: o.value,
          "onUpdate:modelValue": S[0] || (S[0] = (I) => o.value = I),
          "aria-label": "Show fields for a family",
          placeholder: "All families",
          options: L.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self"
        }, null, 8, ["modelValue", "options"])) : h("", !0),
        m.value && !o.value ? (e(), T(Te, {
          key: 1,
          label: "Field group name",
          action: "Add field group",
          "from-name": "",
          existing: C.value.map((I) => I.namespace),
          onAdd: ca
        }, null, 8, ["existing"])) : h("", !0)
      ])) : h("", !0),
      o.value && !Q.value.length ? (e(), i("p", ps, "This family has no field groups yet. Open the family to choose which groups it uses.")) : h("", !0),
      (e(!0), i(E, null, ee(Q.value, (I) => (e(), T(Pe, {
        key: I.namespace,
        count: I.attributes?.length ?? 0,
        columns: ["kind", "details", "usage"]
      }, {
        head: k(() => [
          a("header", vs, [
            a("div", null, [
              a("h3", null, $(s(B)(I.namespace)), 1),
              a("p", fs, $(ie(I.namespace).length ? "Used by " + ie(I.namespace).join(", ") : "Unused by families"), 1)
            ]),
            a("div", bs, [
              m.value ? (e(), T(Te, {
                key: 0,
                label: "Field name",
                action: "Add field",
                "from-name": "",
                existing: I.attributes?.map((x) => x.code),
                onAdd: (x) => Ue(I, x)
              }, null, 8, ["existing", "onAdd"])) : h("", !0),
              f(s(H), {
                type: "button",
                "aria-label": s(B)(I.namespace) + " settings",
                title: s(B)(I.namespace) + " settings",
                "aria-haspopup": "dialog",
                severity: "secondary",
                text: "",
                size: "small",
                onClick: (x) => ve.value = I
              }, {
                default: k(() => [
                  f(s(le), {
                    icon: "tabler:settings",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "title", "onClick"])
            ])
          ])
        ]),
        default: k(() => [
          (e(!0), i(E, null, ee(I.attributes ?? [], (x, re) => (e(), T(qe, {
            key: z(I.namespace, x),
            open: se.value[z(I.namespace, x)],
            "onUpdate:open": (Z) => se.value[z(I.namespace, x)] = Z,
            title: s(B)(x.code),
            kind: s(ea)(r(x)),
            usage: me(I.namespace),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle"
          }, ye({
            details: k(() => [
              x.cardinality && x.cardinality !== "one" ? (e(), T(s(ge), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: k(() => [
                  G($(b.find((Z) => Z.value === x.cardinality)?.label), 1)
                ]),
                _: 2
              }, 1024)) : h("", !0),
              x.scope?.length ? (e(), T(s(ge), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: k(() => [
                  G("per " + $(x.scope.map(s(B)).join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : h("", !0),
              x.index && x.index !== "none" ? (e(), T(s(ge), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: k(() => [
                  G($(W[x.index] || "Filterable"), 1)
                ]),
                _: 2
              }, 1024)) : h("", !0),
              x.unique ? (e(), T(s(ge), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: k(() => [...S[6] || (S[6] = [
                  G("unique", -1)
                ])]),
                _: 1
              })) : h("", !0)
            ]),
            default: k(() => [
              a("div", ys, [
                a("div", gs, [
                  a("div", hs, [
                    a("label", {
                      id: n(I.namespace, x, "type")
                    }, "Type", 8, ks)
                  ]),
                  f(s(_e), {
                    disabled: !m.value,
                    "aria-labelledby": n(I.namespace, x, "type"),
                    "model-value": x.type,
                    options: w.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (Z) => V(x, Z)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                a("div", _s, [
                  a("div", ws, [
                    a("label", {
                      id: n(I.namespace, x, "values")
                    }, "Values", 8, $s)
                  ]),
                  f(s(_e), {
                    disabled: !m.value,
                    "aria-labelledby": n(I.namespace, x, "values"),
                    "model-value": x.cardinality ?? "one",
                    options: b,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (Z) => Y(x, "cardinality", Z === "one" ? void 0 : Z)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                U(x) ? (e(), i("div", Cs, [
                  a("div", xs, [
                    a("label", {
                      id: n(I.namespace, x, "vocabulary")
                    }, "Vocabulary", 8, Vs)
                  ]),
                  f(s(_e), {
                    disabled: !m.value,
                    "aria-labelledby": n(I.namespace, x, "vocabulary"),
                    "model-value": x.vocabulary ?? "",
                    "onUpdate:modelValue": (Z) => Y(x, "vocabulary", Z),
                    options: [{ value: "", label: "Choose…" }, ...F.value.map((Z) => ({ value: Z, label: s(B)(Z) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : h("", !0),
                R(x) ? (e(), i("p", Us, "Choose the media types and file size this field accepts. Catalog readers can access attached files.")) : r(x)?.form === "ref" && !U(x) ? (e(), i("p", js, $(M(x) ? "A link points to something managed by an installed plugin." : "A product reference points to another product in this catalog."), 1)) : h("", !0),
                M(x) ? (e(), i("div", As, [
                  a("div", Ss, [
                    a("label", {
                      id: n(I.namespace, x, "link")
                    }, "Link destination", 8, Os),
                    S[7] || (S[7] = a("span", { class: "pim-f-note" }, "choose what the field can point to", -1))
                  ]),
                  f(s(_e), {
                    disabled: !m.value,
                    "aria-labelledby": n(I.namespace, x, "link"),
                    "model-value": x.config?.target ?? "",
                    "onUpdate:modelValue": (Z) => u(x, Z),
                    options: [{ value: "", label: "Choose…" }, ...l.options.link_kinds.map((Z) => ({ value: Z.kind, label: s(oe)(Z.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : h("", !0),
                a("div", Rs, [
                  a("div", Is, [
                    a("label", {
                      id: n(I.namespace, x, "width")
                    }, "Width", 8, Ts),
                    S[8] || (S[8] = a("span", { class: "pim-f-note" }, "of a form row", -1))
                  ]),
                  f(s(_a), {
                    disabled: !m.value,
                    "aria-labelledby": n(I.namespace, x, "width"),
                    "model-value": s(ha)(l.schema, I.namespace, x),
                    options: s(c),
                    "allow-empty": !1,
                    "onUpdate:modelValue": (Z) => x.width = Z
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                a("div", Ps, [
                  a("div", qs, [
                    a("label", {
                      id: n(I.namespace, x, "scope")
                    }, "Varies per", 8, Ns),
                    S[9] || (S[9] = a("span", { class: "pim-f-note" }, "dimensions the value depends on", -1))
                  ]),
                  f(je, {
                    disabled: !m.value,
                    labelledby: n(I.namespace, x, "scope"),
                    "model-value": x.scope ?? [],
                    options: P.value,
                    "onUpdate:modelValue": (Z) => X(x, Z)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                R(x) ? h("", !0) : (e(), i("div", {
                  key: 4,
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": n(I.namespace, x, "default")
                }, [
                  a("div", zs, [
                    a("label", {
                      id: n(I.namespace, x, "default")
                    }, "Default", 8, Bs),
                    S[10] || (S[10] = a("span", { class: "pim-f-note" }, "when no value is set", -1))
                  ]),
                  f(us, {
                    disabled: !m.value,
                    attribute: x,
                    type: r(x),
                    onChange: (Z) => Y(x, "default", Z)
                  }, null, 8, ["disabled", "attribute", "type", "onChange"])
                ], 8, Ds)),
                r(x)?.config_schema ? (e(), i("div", {
                  key: 5,
                  class: "pim-f pim-w-full",
                  role: "group",
                  "aria-labelledby": n(I.namespace, x, "config")
                }, [
                  a("div", Fs, [
                    a("label", {
                      id: n(I.namespace, x, "config")
                    }, "Type configuration", 8, Es)
                  ]),
                  f(wa, {
                    disabled: !m.value,
                    schema: r(x).config_schema,
                    "model-value": x.config ?? {},
                    "onUpdate:modelValue": (Z) => d(x, Z)
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue"])
                ], 8, Ls)) : h("", !0)
              ]),
              f(Re, {
                class: "pim-field-advanced pim-ia-disclosure",
                label: "Advanced"
              }, {
                default: k(() => [
                  a("div", Ms, [
                    a("div", Ws, [
                      a("div", Hs, [
                        a("label", {
                          for: n(I.namespace, x, "code")
                        }, "Integration key", 8, Js),
                        x.id !== void 0 ? (e(), i("span", Ks, "renaming keeps stored values")) : h("", !0)
                      ]),
                      f(s(Ye), {
                        disabled: !m.value,
                        id: n(I.namespace, x, "code"),
                        type: "text",
                        value: x.code,
                        onInput: (Z) => x.code = Z.target.value,
                        class: "mono"
                      }, null, 8, ["disabled", "id", "value", "onInput"])
                    ]),
                    a("div", Gs, [
                      a("div", Ys, [
                        a("label", {
                          id: n(I.namespace, x, "index")
                        }, "Search and filters", 8, Zs),
                        S[11] || (S[11] = a("span", { class: "pim-f-note" }, "choose how this field can be matched", -1))
                      ]),
                      f(s(_e), {
                        disabled: !m.value,
                        "aria-labelledby": n(I.namespace, x, "index"),
                        "model-value": x.index ?? "none",
                        options: (r(x)?.indexes ?? ["none"]).map((Z) => ({ value: Z, label: W[Z] || s(B)(Z) })),
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self",
                        "onUpdate:modelValue": (Z) => Y(x, "index", Z === "none" ? void 0 : Z)
                      }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ]),
                    a("div", Qs, [
                      a("div", Xs, [
                        a("label", {
                          for: n(I.namespace, x, "unique")
                        }, "Unique", 8, ei),
                        S[12] || (S[12] = a("span", { class: "pim-f-note" }, "one holder per value, catalog wide", -1))
                      ]),
                      a("div", ai, [
                        f(s(la), {
                          "input-id": n(I.namespace, x, "unique"),
                          "model-value": x.unique === !0,
                          disabled: !m.value || !!x.scope?.length || (x.cardinality ?? "one") !== "one",
                          "onUpdate:modelValue": (Z) => Y(x, "unique", Z)
                        }, null, 8, ["input-id", "model-value", "disabled", "onUpdate:modelValue"]),
                        a("span", null, $(x.unique ? "Yes" : "No"), 1)
                      ])
                    ]),
                    (x.scope?.length ?? 0) > 0 && x.index && x.index !== "none" ? (e(), i("div", li, [
                      a("div", ti, [
                        a("label", {
                          id: n(I.namespace, x, "contexts")
                        }, "Filterable combinations", 8, si),
                        S[13] || (S[13] = a("span", { class: "pim-f-note" }, "which combinations get an index", -1))
                      ]),
                      a("div", {
                        class: "pim-contexts",
                        role: "group",
                        "aria-labelledby": n(I.namespace, x, "contexts")
                      }, [
                        (e(!0), i(E, null, ee(ae(x), (Z, $e) => (e(), i("div", {
                          key: $e,
                          class: "pim-context-row"
                        }, [
                          (e(!0), i(E, null, ee(x.scope, (he) => (e(), i("div", {
                            key: he,
                            class: "pim-context-field"
                          }, [
                            a("span", {
                              id: n(I.namespace, x, "context-" + $e + "-" + he),
                              class: "small muted"
                            }, $(s(B)(he)), 9, ni),
                            f(s(_e), {
                              disabled: !m.value,
                              "aria-labelledby": n(I.namespace, x, "context-" + $e + "-" + he),
                              "model-value": Z[he] ?? "",
                              options: Ae(he),
                              class: "narrow",
                              appendTo: "self",
                              "onUpdate:modelValue": (ma) => Z[he] = ma
                            }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                          ]))), 128)),
                          m.value ? (e(), T(s(H), {
                            key: 0,
                            type: "button",
                            "aria-label": "Remove context",
                            onClick: (he) => ae(x).splice($e, 1),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: k(() => [
                              f(s(le), { icon: "tabler:x" })
                            ]),
                            _: 1
                          }, 8, ["onClick"])) : h("", !0)
                        ]))), 128)),
                        m.value ? (e(), T(s(H), {
                          key: 0,
                          type: "button",
                          onClick: (Z) => Me(x),
                          severity: "secondary",
                          outlined: "",
                          size: "small"
                        }, {
                          default: k(() => [
                            f(s(le), {
                              icon: "tabler:plus",
                              "aria-hidden": "true"
                            }),
                            S[14] || (S[14] = G(" Add context", -1))
                          ]),
                          _: 1
                        }, 8, ["onClick"])) : h("", !0)
                      ], 8, ii)
                    ])) : h("", !0)
                  ])
                ]),
                _: 2
              }, 1024),
              m.value ? (e(), i("div", oi, [
                f(s(H), {
                  type: "button",
                  onClick: (Z) => pe(I, x),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: k(() => [
                    f(s(le), { icon: "tabler:trash" }),
                    S[15] || (S[15] = G(" Remove field", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : h("", !0)
            ]),
            _: 2
          }, [
            m.value ? {
              name: "actions",
              fn: k(() => [
                f(s(H), {
                  type: "button",
                  disabled: re === 0,
                  "aria-label": "Move " + s(B)(x.code) + " earlier",
                  onClick: (Z) => ta(Z, I.attributes, re, re - 1),
                  text: "",
                  severity: "secondary"
                }, {
                  default: k(() => [
                    f(s(le), {
                      icon: "tabler:arrow-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                f(s(H), {
                  type: "button",
                  disabled: re === (I.attributes?.length ?? 0) - 1,
                  "aria-label": "Move " + s(B)(x.code) + " later",
                  onClick: (Z) => ta(Z, I.attributes, re, re + 1),
                  text: "",
                  severity: "secondary"
                }, {
                  default: k(() => [
                    f(s(le), {
                      icon: "tabler:arrow-down",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["open", "onUpdate:open", "title", "kind", "usage"]))), 128))
        ]),
        _: 2
      }, 1032, ["count"]))), 128)),
      f(oa, {
        visible: !!ve.value,
        label: De.value,
        onClose: S[5] || (S[5] = (I) => ve.value = void 0)
      }, {
        default: k(() => [
          ve.value ? (e(), i("section", {
            key: 0,
            class: "pim-ia-dialog",
            onKeydown: S[4] || (S[4] = aa(Ie((I) => ve.value = void 0, ["prevent"]), ["esc"]))
          }, [
            a("header", di, [
              a("h2", ri, $(De.value), 1)
            ]),
            a("div", ui, [
              a("label", {
                id: s(N) + "-writers"
              }, "Sources allowed to write", 8, ci),
              f(s(Fa), {
                disabled: !m.value,
                "aria-labelledby": s(N) + "-writers",
                "model-value": ve.value.write?.sources ?? [],
                options: v.value,
                "option-label": "label",
                "option-value": "value",
                placeholder: "Any source",
                "append-to": "self",
                "onUpdate:modelValue": S[1] || (S[1] = (I) => ve.value.write = { sources: I })
              }, null, 8, ["disabled", "aria-labelledby", "model-value", "options"])
            ]),
            a("footer", mi, [
              m.value ? (e(), T(s(H), {
                key: 0,
                type: "button",
                label: "Remove field group",
                severity: "danger",
                text: "",
                onClick: S[2] || (S[2] = (I) => Se(ve.value))
              })) : h("", !0),
              f(s(H), {
                type: "button",
                label: "Done",
                severity: "secondary",
                outlined: "",
                onClick: S[3] || (S[3] = (I) => ve.value = void 0)
              })
            ])
          ], 32)) : h("", !0)
        ]),
        _: 1
      }, 8, ["visible", "label"])
    ]));
  }
}), vi = { class: "muted small" }, fi = { class: "pim-aspect" }, bi = {
  key: 0,
  class: "small muted"
}, yi = { class: "pim-fields" }, gi = { class: "pim-f pim-w-full" }, hi = { class: "pim-f-label" }, ki = ["id"], _i = { class: "pim-f-label" }, wi = ["id"], $i = /* @__PURE__ */ de({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(l, { emit: y }) {
    const t = l, o = y, p = D(() => t.schema.access.admin), c = D(() => t.draft.dimensions ?? []), b = Ne();
    function m(v, w) {
      return b + "-" + v.name + "-" + w;
    }
    function C(v) {
      (t.draft.dimensions ??= []).push({ name: v, members: [] });
    }
    function A(v) {
      const w = [];
      for (const r of t.draft.aspects ?? []) for (const U of r.attributes ?? []) U.scope?.includes(v.name) && w.push(`${B(U.code)} (${B(r.namespace)})`);
      for (const r of t.draft.families ?? []) for (const U of r.requirements ?? []) U.context && v.name in U.context && w.push(`${B(U.id)} (${B(r.code)})`);
      return w;
    }
    function L(v) {
      A(v).length || (c.value.splice(c.value.indexOf(v), 1), t.schema.declaration.dimensions?.some((w) => w.name === v.name) && o("remove", "dimensions", v.name));
    }
    function Q(v, w) {
      if (v.members = w, v.fallback)
        for (const r of Object.keys(v.fallback)) w.includes(r) || delete v.fallback[r];
    }
    function P(v, w) {
      return v.fallback?.[w] ?? [];
    }
    function F(v, w, r) {
      const U = { ...v.fallback ?? {} };
      r.length ? U[w] = r : delete U[w], Object.keys(U).length ? v.fallback = U : delete v.fallback;
    }
    return (v, w) => (e(), T(Pe, {
      count: c.value.length,
      columns: ["details", "usage"]
    }, ye({
      default: k(() => [
        (e(!0), i(E, null, ee(c.value, (r) => (e(), T(qe, {
          title: s(B)(r.name),
          key: r.name,
          usage: A(r).length ? "Used in " + A(r).length + " places" : "Unused"
        }, ye({
          details: k(() => [
            a("span", vi, $(r.members.map(s(B)).join(", ") || "No allowed values"), 1)
          ]),
          default: k(() => [
            a("div", fi, [
              A(r).length ? (e(), i("p", bi, "Used by " + $(A(r).join(", ")), 1)) : h("", !0),
              a("div", yi, [
                a("div", gi, [
                  a("div", hi, [
                    a("label", {
                      id: m(r, "members")
                    }, "Allowed values", 8, ki),
                    w[0] || (w[0] = a("span", { class: "pim-f-note" }, "for example, English and French for Language", -1))
                  ]),
                  f(je, {
                    disabled: !p.value,
                    labelledby: m(r, "members"),
                    "model-value": r.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (U) => Q(r, U)
                  }, null, 8, ["disabled", "labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                (e(!0), i(E, null, ee(r.members, (U) => (e(), i("div", {
                  key: U,
                  class: "pim-f pim-w-half"
                }, [
                  a("div", _i, [
                    a("label", {
                      id: m(r, "fallback-" + encodeURIComponent(U))
                    }, $(U) + " falls back to", 9, wi),
                    w[1] || (w[1] = a("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  f(je, {
                    disabled: !p.value,
                    labelledby: m(r, "fallback-" + encodeURIComponent(U)),
                    "model-value": P(r, U),
                    options: r.members.filter((R) => R !== U).map((R) => ({ value: R })),
                    "onUpdate:modelValue": (R) => F(r, U, R)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]))), 128))
              ])
            ])
          ]),
          _: 2
        }, [
          p.value ? {
            name: "actions",
            fn: k(() => [
              f(s(H), {
                type: "button",
                disabled: A(r).length > 0,
                "aria-label": "Remove " + s(B)(r.name),
                title: A(r).length ? "Take the dimension off these first" : "",
                onClick: (U) => L(r),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: k(() => [
                  f(s(le), { icon: "tabler:trash" })
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
        fn: k(() => [
          f(Te, {
            label: "Dimension name",
            "from-name": "",
            action: "Add dimension",
            existing: c.value.map((r) => r.name),
            onAdd: C
          }, {
            default: k(() => [...w[2] || (w[2] = [
              a("span", { class: "muted small" }, "A dimension lets a value differ per member, with fallbacks between members.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), Ci = { class: "muted small" }, xi = { class: "pim-aspect" }, Vi = { class: "row small" }, Ui = {
  key: 1,
  class: "muted small"
}, ji = {
  key: 2,
  class: "pim-stack tight pim-terms"
}, Ai = {
  key: 0,
  class: "muted small"
}, Si = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Oi = {
  key: 3,
  class: "pim-responsive-table"
}, Ri = {
  class: "pim-grid compact",
  "aria-label": "Vocabulary terms"
}, Ii = { key: 0 }, Ti = { key: 1 }, Pi = {
  key: 0,
  class: "muted"
}, qi = {
  key: 1,
  class: "num"
}, Ni = {
  role: "list",
  class: "pim-stacked-list",
  "aria-label": "Vocabulary terms"
}, Di = {
  key: 0,
  class: "pim-stacked-meta muted small"
}, zi = {
  key: 4,
  class: "muted small"
}, Bi = { class: "row wrap" }, Li = {
  key: 5,
  class: "row wrap pim-add-row"
}, Fi = {
  key: 0,
  class: "pim-config-overrides"
}, Ei = /* @__PURE__ */ de({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(l, { emit: y }) {
    const t = l, o = y, p = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/, c = D(() => t.schema.access.admin), b = D(() => c.value && t.schema.access.write), m = D(() => t.draft.vocabularies ?? []);
    function C(n) {
      (t.draft.vocabularies ??= []).push({ code: n });
    }
    function A(n) {
      m.value.splice(m.value.indexOf(n), 1), t.schema.declaration.vocabularies?.some((V) => V.code === n.code) && o("remove", "vocabularies", n.code);
    }
    function L(n) {
      return !!t.schema.vocabularies[n];
    }
    const Q = J({}), P = J({}), F = J({}), v = J({}), w = J({}), r = J({}), U = J({}), R = J({});
    function M(n) {
      return !!(w.value[n] || r.value[n]);
    }
    async function ie(n, V) {
      w.value[n] = !0, delete U.value[n];
      try {
        const d = await ce.termsPage(t.catalogId, n, V);
        P.value[n] = d.terms, v.value[n] = V, F.value[n] = d.next;
        const u = W(n);
        d.terms.some((X) => X.retired && X.code === u.parent) && (u.parent = "");
      } catch (d) {
        U.value[n] = { errors: [Ee(d, "Could not load terms.")], read: { after: V } };
      } finally {
        w.value[n] = !1;
      }
    }
    function me(n) {
      Q.value[n] = !Q.value[n], Q.value[n] && !M(n) && !P.value[n] && !U.value[n] && ie(n);
    }
    function W(n) {
      return R.value[n] ?? (R.value[n] = { code: "", label: "", parent: "" });
    }
    function se(n, V) {
      const d = P.value[n]?.find((u) => u.code === V);
      return d ? Le(d) : B(V);
    }
    function N(n) {
      return [{ value: "", label: "No parent" }, ...(P.value[n] ?? []).filter((V) => !V.retired).map((V) => ({ value: V.code, label: Le(V) }))];
    }
    function q(n, V, d) {
      U.value[n] = { errors: V?.findings?.length ? V.findings.map((u) => ({ message: u.message ?? d, code: u.code })) : [{ message: d }] };
    }
    async function K(n) {
      const V = W(n.code);
      if (!(!b.value || !p.test(V.code))) {
        r.value[n.code] = !0, delete U.value[n.code];
        try {
          const d = { term: { vocabulary: n.code, code: V.code }, labels: { en: V.label || B(V.code) } };
          n.hierarchical && V.parent && (d.parent = V.parent);
          const X = (await ce.apply(t.catalogId, [d])).outcomes[0];
          if (X?.outcome !== "created" && X?.outcome !== "updated") {
            q(n.code, X, "The term was not accepted.");
            return;
          }
          R.value[n.code] = { code: "", label: "", parent: "" }, ce.invalidateTerms(t.catalogId), await ie(n.code, v.value[n.code]);
        } catch (d) {
          U.value[n.code] = { errors: [Ee(d, "Could not add the term.")] };
        } finally {
          r.value[n.code] = !1;
        }
      }
    }
    async function z(n, V, d) {
      if (b.value && !(d && !await Je.confirm({ header: "Retire term?", message: `Retire ${Le(V)}? Term changes save immediately. You can restore this term later.`, acceptLabel: "Retire", rejectLabel: "Cancel" }))) {
        r.value[n.code] = !0, delete U.value[n.code];
        try {
          const X = (await ce.apply(t.catalogId, [{ term: { vocabulary: n.code, code: V.code }, retired: d }])).outcomes[0];
          if (!X || !["updated", "unchanged"].includes(X.outcome)) {
            q(n.code, X, "The term change was not accepted.");
            return;
          }
          d && W(n.code).parent === V.code && (W(n.code).parent = ""), ce.invalidateTerms(t.catalogId), await ie(n.code, v.value[n.code]);
        } catch (u) {
          U.value[n.code] = { errors: [Ee(u, "Could not change the term.")] };
        } finally {
          r.value[n.code] = !1;
        }
      }
    }
    return (n, V) => (e(), T(Pe, {
      count: m.value.length,
      columns: ["details"]
    }, ye({
      default: k(() => [
        (e(!0), i(E, null, ee(m.value, (d) => (e(), T(qe, {
          title: s(B)(d.code),
          key: d.code
        }, {
          details: k(() => [
            a("span", Ci, $(d.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: k(() => [
            c.value ? (e(), T(s(H), {
              key: 0,
              type: "button",
              "aria-label": "Remove " + s(B)(d.code),
              onClick: (u) => A(d),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: k(() => [
                f(s(le), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])) : h("", !0)
          ]),
          default: k(() => [
            a("div", xi, [
              a("label", Vi, [
                f(s(la), {
                  disabled: !c.value,
                  "aria-label": "Hierarchical " + s(B)(d.code),
                  "model-value": d.hierarchical === !0,
                  "onUpdate:modelValue": (u) => u ? d.hierarchical = !0 : delete d.hierarchical
                }, null, 8, ["disabled", "aria-label", "model-value", "onUpdate:modelValue"]),
                V[0] || (V[0] = a("span", null, "Hierarchical", -1))
              ]),
              L(d.code) ? (e(), T(s(H), {
                key: 0,
                type: "button",
                onClick: (u) => me(d.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: k(() => [
                  f(s(le), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  G(" " + $(Q.value[d.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : c.value ? (e(), i("span", Ui, "Apply the schema before adding terms.")) : h("", !0),
              Q.value[d.code] ? (e(), i("div", ji, [
                b.value ? (e(), i("p", Ai, "Term changes save immediately.")) : h("", !0),
                w.value[d.code] ? (e(), i("div", Si, "Loading terms…")) : U.value[d.code] ? (e(!0), i(E, { key: 2 }, ee(U.value[d.code].errors, (u, X) => (e(), T(ua, {
                  key: X,
                  error: u
                }, {
                  default: k(() => [
                    U.value[d.code].read ? (e(), T(s(H), {
                      key: 0,
                      type: "button",
                      onClick: (Y) => ie(d.code, U.value[d.code].read?.after),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: k(() => [...V[1] || (V[1] = [
                        G("Retry", -1)
                      ])]),
                      _: 1
                    }, 8, ["onClick"])) : h("", !0)
                  ]),
                  _: 2
                }, 1032, ["error"]))), 128)) : h("", !0),
                (P.value[d.code] ?? []).length ? (e(), i("div", Oi, [
                  a("table", Ri, [
                    a("thead", null, [
                      a("tr", null, [
                        V[2] || (V[2] = a("th", null, "Term", -1)),
                        d.hierarchical ? (e(), i("th", Ii, "Parent")) : h("", !0),
                        c.value ? (e(), i("th", Ti)) : h("", !0)
                      ])
                    ]),
                    a("tbody", null, [
                      (e(!0), i(E, null, ee(P.value[d.code], (u) => (e(), i("tr", {
                        key: u.code,
                        class: Ve({ muted: u.retired })
                      }, [
                        a("td", null, [
                          G($(s(Le)(u)) + " ", 1),
                          u.retired ? (e(), T(s(ge), {
                            key: 0,
                            severity: "secondary",
                            value: "Retired"
                          })) : h("", !0)
                        ]),
                        d.hierarchical ? (e(), i("td", Pi, $(u.parent ? se(d.code, u.parent) : "—"), 1)) : h("", !0),
                        c.value ? (e(), i("td", qi, [
                          f(s(H), {
                            type: "button",
                            disabled: !b.value || M(d.code),
                            onClick: (X) => z(d, u, !u.retired),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: k(() => [
                              G($(u.retired ? "Restore" : "Retire"), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled", "onClick"])
                        ])) : h("", !0)
                      ], 2))), 128))
                    ])
                  ]),
                  a("ul", Ni, [
                    (e(!0), i(E, null, ee(P.value[d.code], (u) => (e(), i("li", {
                      key: u.code,
                      class: Ve(["pim-stacked-row", { muted: u.retired }])
                    }, [
                      a("div", null, [
                        G($(s(Le)(u)) + " ", 1),
                        u.retired ? (e(), T(s(ge), {
                          key: 0,
                          severity: "secondary",
                          value: "Retired"
                        })) : h("", !0)
                      ]),
                      d.hierarchical && u.parent ? (e(), i("div", Di, "Parent: " + $(se(d.code, u.parent)), 1)) : h("", !0),
                      c.value ? (e(), T(s(H), {
                        key: 1,
                        type: "button",
                        disabled: !b.value || M(d.code),
                        onClick: (X) => z(d, u, !u.retired),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: k(() => [
                          G($(u.retired ? "Restore" : "Retire"), 1)
                        ]),
                        _: 2
                      }, 1032, ["disabled", "onClick"])) : h("", !0)
                    ], 2))), 128))
                  ])
                ])) : P.value[d.code] && !M(d.code) && !U.value[d.code] ? (e(), i("p", zi, "No terms yet.")) : h("", !0),
                a("div", Bi, [
                  f(s(H), {
                    type: "button",
                    disabled: M(d.code) || !v.value[d.code],
                    onClick: (u) => ie(d.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: k(() => [
                      f(s(le), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      V[3] || (V[3] = G(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  f(s(H), {
                    type: "button",
                    disabled: M(d.code) || !F.value[d.code],
                    onClick: (u) => ie(d.code, F.value[d.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: k(() => [
                      f(s(le), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      V[4] || (V[4] = G(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                c.value ? (e(), i("div", Li, [
                  f(s(Ye), {
                    modelValue: W(d.code).label,
                    "onUpdate:modelValue": (u) => W(d.code).label = u,
                    disabled: !b.value || M(d.code),
                    "aria-label": "Term name in English",
                    type: "text",
                    placeholder: "Term name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  f(s(Ye), {
                    modelValue: W(d.code).code,
                    "onUpdate:modelValue": (u) => W(d.code).code = u,
                    disabled: !b.value || M(d.code),
                    type: "text",
                    "aria-label": "Short term name",
                    placeholder: "Short name for imports",
                    class: "narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  d.hierarchical ? (e(), T(s(_e), {
                    key: 0,
                    modelValue: W(d.code).parent,
                    "onUpdate:modelValue": (u) => W(d.code).parent = u,
                    disabled: !b.value || M(d.code),
                    class: "narrow",
                    "aria-label": "Parent term",
                    placeholder: "No parent",
                    options: N(d.code),
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "options"])) : h("", !0),
                  f(s(H), {
                    type: "button",
                    disabled: !b.value || M(d.code) || !p.test(W(d.code).code),
                    onClick: (u) => K(d),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: k(() => [
                      f(s(le), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      V[5] || (V[5] = G(" Add term", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])) : h("", !0),
                f(Re, {
                  class: "pim-ia-disclosure",
                  label: "Integration keys"
                }, {
                  default: k(() => [
                    (P.value[d.code] ?? []).length ? (e(), i("dl", Fi, [
                      (e(!0), i(E, null, ee(P.value[d.code], (u) => (e(), i(E, {
                        key: u.code
                      }, [
                        a("dt", null, $(s(Le)(u)), 1),
                        a("dd", null, [
                          a("code", null, $(u.code), 1)
                        ])
                      ], 64))), 128))
                    ])) : h("", !0)
                  ]),
                  _: 2
                }, 1024)
              ])) : h("", !0)
            ])
          ]),
          _: 2
        }, 1032, ["title"]))), 128))
      ]),
      _: 2
    }, [
      c.value ? {
        name: "add",
        fn: k(() => [
          f(Te, {
            label: "Vocabulary name",
            "from-name": "",
            action: "Add vocabulary",
            existing: m.value.map((d) => d.code),
            onAdd: C
          }, {
            default: k(() => [...V[6] || (V[6] = [
              a("span", { class: "muted small" }, "Select fields pick their values from a vocabulary's terms.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), Mi = { class: "pim-stack" }, Wi = { class: "muted small" }, Hi = { class: "muted small" }, Ji = { class: "pim-aspect" }, Ki = { class: "pim-ia-action pim-family-fields" }, Gi = { class: "pim-f" }, Yi = { class: "pim-f-label" }, Zi = ["id"], Qi = ["id"], Xi = { class: "pim-aspect" }, en = { class: "pim-stack tight" }, an = { class: "pim-level-head" }, ln = { class: "pim-fields" }, tn = { class: "pim-f pim-w-half" }, sn = { class: "pim-f-label" }, nn = ["id"], on = { class: "pim-f pim-w-half" }, dn = { class: "pim-f-label" }, rn = ["id"], un = { class: "pim-aspect" }, cn = { class: "pim-stack tight" }, mn = { class: "pim-level-head" }, pn = { class: "muted small" }, vn = { class: "pim-fields" }, fn = { class: "pim-f-label" }, bn = ["id"], yn = { class: "pim-f pim-w-half" }, gn = { class: "pim-f-label" }, hn = ["id"], kn = { class: "pim-f pim-w-half" }, _n = { class: "pim-f-label" }, wn = ["id"], $n = {
  key: 0,
  class: "pim-aspect pim-family-remove"
}, Cn = /* @__PURE__ */ de({
  __name: "BuilderFamilies",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove", "fields"],
  setup(l, { emit: y }) {
    const t = l, o = y, p = Ne();
    function c(n, V) {
      return p + "-" + n.code + "-" + V;
    }
    const b = D(() => t.schema.access.admin), m = D(() => (t.draft.families ?? []).filter((n) => n.code !== "generic")), C = D(() => {
      const n = new Set(t.draft.plugins?.map((V) => V.use));
      return Object.entries(t.schema.attributes).filter(([, V]) => V.plugin && n.has(V.plugin));
    }), A = D(() => {
      const n = (t.draft.aspects ?? []).map((d) => d.namespace), V = [...new Set(C.value.map(([d]) => d.split(".")[0]))];
      return [...n, ...V.filter((d) => !n.includes(d))].map((d) => ({ value: d, label: B(d) }));
    });
    function L(n) {
      const V = A.value, d = (n.aspects ?? []).filter((u) => !V.some((X) => X.value === u));
      return [...V, ...d.map((u) => ({ value: u, label: B(u) }))];
    }
    const Q = D(() => new Map(t.options.types.map((n) => [n.id, n.form])));
    function P(n) {
      const [V, d] = n.split(".", 2);
      return d ? `${B(d)} (${B(V)})` : B(V);
    }
    const F = D(() => {
      const n = /* @__PURE__ */ new Map();
      function V(d, u, X = [], Y = "one") {
        const ae = !!u && u !== "text" && u !== "record" && X.length === 0 && Y === "one";
        n.set(d, { value: d, label: P(d), canBeAxis: ae });
      }
      for (const d of t.draft.aspects ?? [])
        for (const u of d.attributes ?? []) {
          const X = d.namespace + "." + u.code;
          V(X, Q.value.get(u.type), u.scope, u.cardinality);
        }
      for (const [d, u] of C.value) V(d, u.form, u.scope, u.cardinality);
      return n;
    });
    function v(n) {
      return [...F.value.values()].filter((V) => n.aspects?.includes(V.value.split(".")[0]));
    }
    function w(n, V, d) {
      const u = V[d] ?? [], X = new Set(W(n).flatMap((ae) => [...ae.axes ?? [], ...ae.own ?? []])), Y = v(n).filter((ae) => u.includes(ae.value) || !X.has(ae.value) && (d === "own" || ae.canBeAxis));
      return [...Y, ...u.filter((ae) => !Y.some((Ae) => Ae.value === ae)).map((ae) => ({ value: ae, label: P(ae) }))];
    }
    const r = D(() => t.draft.channels ?? []);
    function U(n, V) {
      return r.value.filter((d) => (!d.families?.length || d.families.includes(n.code)) && (!V || d.requirements?.includes(V))).map((d) => B(d.id));
    }
    const R = D(() => t.draft.dimensions ?? []), M = J({});
    function ie(n) {
      (t.draft.families ??= []).push({ code: n, aspects: [] }), M.value[n] = !0;
    }
    function me(n) {
      t.draft.families.splice(t.draft.families.indexOf(n), 1), t.schema.declaration.families?.some((V) => V.code === n.code) && o("remove", "families", n.code);
    }
    function W(n) {
      return n.variation ?? [];
    }
    function se(n) {
      (n.variation ??= []).push({ axes: [] });
    }
    function N(n) {
      return n.requirements ?? [];
    }
    function q(n, V) {
      (n.requirements ??= []).push({ id: V, require: [] });
    }
    function K(n, V) {
      return n.context?.[V] ?? "";
    }
    function z(n, V, d) {
      const u = { ...n.context ?? {} };
      d ? u[V] = d : delete u[V], Object.keys(u).length ? n.context = u : delete n.context;
    }
    return (n, V) => (e(), i("div", Mi, [
      f(Pe, {
        count: m.value.length,
        columns: ["details"]
      }, ye({
        default: k(() => [
          (e(!0), i(E, null, ee(m.value, (d) => (e(), T(qe, {
            key: d.code,
            open: M.value[d.code],
            "onUpdate:open": (u) => M.value[d.code] = u,
            title: s(B)(d.code)
          }, {
            details: k(() => [
              a("span", Wi, $(v(d).length) + " fields", 1),
              W(d).length ? (e(), T(s(ge), {
                key: 0,
                severity: "secondary",
                value: W(d).length + (W(d).length === 1 ? " variant level" : " variant levels")
              }, null, 8, ["value"])) : h("", !0),
              a("span", Hi, $(U(d).join(", ") || "No release channels"), 1)
            ]),
            default: k(() => [
              a("div", Ji, [
                a("div", Ki, [
                  a("div", Gi, [
                    a("div", Yi, [
                      a("label", {
                        id: c(d, "groups")
                      }, "Field groups", 8, Zi)
                    ]),
                    a("p", {
                      id: c(d, "groups-help"),
                      class: "muted small pim-axis-help"
                    }, "Choose the groups that appear on this family’s product forms.", 8, Qi),
                    f(s(Fa), {
                      disabled: !b.value,
                      "aria-labelledby": c(d, "groups"),
                      "aria-describedby": c(d, "groups-help"),
                      "model-value": d.aspects ?? [],
                      options: L(d),
                      "option-label": "label",
                      "option-value": "value",
                      placeholder: "Choose field groups",
                      display: "chip",
                      "append-to": "self",
                      "onUpdate:modelValue": (u) => s(Fe)(d, "aspects", u)
                    }, null, 8, ["disabled", "aria-labelledby", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])
                  ]),
                  d.aspects?.length ? (e(), T(s(H), {
                    key: 0,
                    type: "button",
                    label: "View family fields",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (u) => o("fields", d.code)
                  }, null, 8, ["onClick"])) : h("", !0)
                ])
              ]),
              a("div", Xi, [
                V[3] || (V[3] = a("header", { class: "pim-aspect-head" }, [
                  a("h3", null, "Variants")
                ], -1)),
                V[4] || (V[4] = a("p", { class: "muted small pim-axis-help" }, "Choose what makes one variant different from another. Each field can be used once.", -1)),
                a("div", en, [
                  (e(!0), i(E, null, ee(W(d), (u, X) => (e(), i("div", {
                    key: X,
                    class: "pim-level"
                  }, [
                    a("div", an, [
                      a("strong", null, "Level " + $(X + 1), 1),
                      b.value ? (e(), T(s(H), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove level",
                        onClick: (Y) => W(d).splice(X, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: k(() => [
                          f(s(le), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : h("", !0)
                    ]),
                    a("div", ln, [
                      a("div", tn, [
                        a("div", sn, [
                          a("label", {
                            id: c(d, X + "-axes")
                          }, "Distinguish variants by", 8, nn)
                        ]),
                        V[0] || (V[0] = a("p", { class: "muted small pim-axis-help" }, "Choose a single-value field with no dimensions. Text and record fields are excluded.", -1)),
                        f(je, {
                          disabled: !b.value,
                          dropdown: "",
                          labelledby: c(d, X + "-axes"),
                          "model-value": u.axes ?? [],
                          options: w(d, u, "axes"),
                          placeholder: "Add an axis",
                          "onUpdate:modelValue": (Y) => u.axes = Y
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]),
                      a("div", on, [
                        a("div", dn, [
                          a("label", {
                            id: c(d, X + "-owned")
                          }, "Other fields edited here", 8, rn)
                        ]),
                        V[1] || (V[1] = a("p", { class: "muted small pim-axis-help" }, "Other fields you edit at this level.", -1)),
                        f(je, {
                          disabled: !b.value,
                          dropdown: "",
                          labelledby: c(d, X + "-owned"),
                          "model-value": u.own ?? [],
                          options: w(d, u, "own"),
                          placeholder: "Add a field",
                          "onUpdate:modelValue": (Y) => Y.length ? u.own = Y : delete u.own
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  b.value ? (e(), T(s(H), {
                    key: 0,
                    type: "button",
                    class: "pim-add-level",
                    onClick: (u) => se(d),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: k(() => [
                      f(s(le), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      V[2] || (V[2] = G(" Add level", -1))
                    ]),
                    _: 1
                  }, 8, ["onClick"])) : h("", !0)
                ])
              ]),
              a("div", un, [
                V[7] || (V[7] = a("header", { class: "pim-family-requirements-head" }, [
                  a("h3", null, "Release requirements"),
                  a("p", { class: "muted small" }, "Choose what products need before they can be released to a channel.")
                ], -1)),
                a("div", cn, [
                  (e(!0), i(E, null, ee(N(d), (u, X) => (e(), i("div", {
                    key: u.id,
                    class: "pim-level"
                  }, [
                    a("div", mn, [
                      a("div", null, [
                        a("strong", null, $(s(B)(u.id)), 1),
                        a("p", pn, $(U(d, u.id).join(", ") || "Unused by channels"), 1)
                      ]),
                      b.value ? (e(), T(s(H), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove requirement",
                        onClick: (Y) => N(d).splice(X, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: k(() => [
                          f(s(le), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : h("", !0)
                    ]),
                    a("div", vn, [
                      (e(!0), i(E, null, ee(R.value, (Y) => (e(), i("div", {
                        key: Y.name,
                        class: "pim-f pim-w-third"
                      }, [
                        a("div", fn, [
                          a("label", {
                            id: c(d, u.id + "-context-" + Y.name)
                          }, $(s(B)(Y.name)), 9, bn)
                        ]),
                        f(s(_e), {
                          disabled: !b.value,
                          "aria-labelledby": c(d, u.id + "-context-" + Y.name),
                          "model-value": K(u, Y.name),
                          "onUpdate:modelValue": (ae) => z(u, Y.name, ae),
                          options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ...Y.members.map((ae) => ({ value: ae, label: String(ae) }))],
                          "option-label": "label",
                          "option-value": "value",
                          appendTo: "self"
                        }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                      ]))), 128)),
                      a("div", yn, [
                        a("div", gn, [
                          a("label", {
                            id: c(d, u.id + "-required")
                          }, "Required", 8, hn)
                        ]),
                        V[5] || (V[5] = a("p", { class: "muted small pim-axis-help" }, "These fields must have a value.", -1)),
                        f(je, {
                          disabled: !b.value,
                          dropdown: "",
                          labelledby: c(d, u.id + "-required"),
                          "model-value": u.require ?? [],
                          placeholder: "Add a required field",
                          options: v(d),
                          "onUpdate:modelValue": (Y) => s(Fe)(u, "require", Y)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]),
                      a("div", kn, [
                        a("div", _n, [
                          a("label", {
                            id: c(d, u.id + "-authored")
                          }, "Entered for this context", 8, wn)
                        ]),
                        V[6] || (V[6] = a("p", { class: "muted small pim-axis-help" }, "These fields need a value set directly for the selected context.", -1)),
                        f(je, {
                          disabled: !b.value,
                          dropdown: "",
                          labelledby: c(d, u.id + "-authored"),
                          "model-value": u.authored ?? [],
                          placeholder: "Add a field to author",
                          options: v(d),
                          "onUpdate:modelValue": (Y) => s(Fe)(u, "authored", Y)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  b.value ? (e(), T(Te, {
                    key: 0,
                    label: "Requirement name",
                    action: "Add requirement",
                    "from-name": "",
                    existing: N(d).map((u) => u.id),
                    onAdd: (u) => q(d, u)
                  }, null, 8, ["existing", "onAdd"])) : h("", !0)
                ])
              ]),
              b.value ? (e(), i("div", $n, [
                f(s(H), {
                  type: "button",
                  label: "Remove family",
                  severity: "danger",
                  text: "",
                  size: "small",
                  onClick: (u) => me(d)
                }, null, 8, ["onClick"])
              ])) : h("", !0)
            ]),
            _: 2
          }, 1032, ["open", "onUpdate:open", "title"]))), 128))
        ]),
        _: 2
      }, [
        b.value ? {
          name: "head",
          fn: k(() => [
            f(Te, {
              label: "Family name",
              action: "Add family",
              "from-name": "",
              existing: m.value.map((d) => d.code),
              onAdd: ie
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])
    ]));
  }
}), xn = ["inert"], Vn = {
  key: 0,
  class: "row wrap"
}, Un = {
  key: 2,
  class: "small muted"
}, jn = { class: "pim-principal-service" }, An = /* @__PURE__ */ de({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(l, { emit: y }) {
    const t = l, o = y, p = J(!1), c = J(""), b = J({});
    let m = 0;
    fe(() => t.modelValue, async (P) => {
      const F = ++m;
      try {
        const v = await Ma(t.catalogId ?? "", P);
        F === m && (b.value = v);
      } catch {
        F === m && (b.value = {});
      }
    }, { immediate: !0, deep: !0 }), Ze(() => {
      m++;
    });
    function C(P) {
      return b.value[P] ?? oe(P, "Person");
    }
    Ba(async () => {
      try {
        await Al("wc-principal-picker"), p.value = !0;
      } catch {
        p.value = !1;
      }
    });
    function A(P) {
      t.disabled || !P.trim() || t.modelValue.includes(P.trim()) || (o("update:modelValue", [...t.modelValue, P.trim()]), c.value = "");
    }
    function L(P) {
      const F = P.detail;
      if (!F || typeof F != "object") return;
      const v = F, w = v.principal_id ?? v.id;
      typeof w == "string" && A(w);
    }
    function Q(P) {
      t.disabled || o("update:modelValue", t.modelValue.filter((F) => F !== P));
    }
    return (P, F) => (e(), i("div", {
      class: "pim-principal-list",
      inert: l.disabled || void 0
    }, [
      l.modelValue.length ? (e(), i("div", Vn, [
        (e(!0), i(E, null, ee(l.modelValue, (v) => (e(), T(s(ge), {
          key: v,
          severity: "secondary"
        }, {
          default: k(() => [
            a("span", null, $(C(v)), 1),
            f(s(H), {
              text: "",
              size: "small",
              disabled: l.disabled,
              "aria-label": "Remove " + C(v),
              onClick: (w) => Q(v)
            }, {
              default: k(() => [
                f(s(le), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : h("", !0),
      p.value ? (e(), i("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: Ie(L, ["stop"])
      }, null, 32)) : (e(), i("span", Un, "The person picker is unavailable.")),
      a("label", jn, [
        F[3] || (F[3] = a("span", { class: "small muted" }, "Service account", -1)),
        f(s(Ye), {
          modelValue: c.value,
          "onUpdate:modelValue": F[0] || (F[0] = (v) => c.value = v),
          disabled: l.disabled,
          placeholder: "Service principal id",
          onKeydown: F[1] || (F[1] = aa(Ie((v) => A(c.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "disabled"])
      ]),
      f(s(H), {
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: l.disabled || !c.value.trim(),
        onClick: F[2] || (F[2] = (v) => A(c.value))
      }, {
        default: k(() => [
          f(s(le), { icon: "tabler:plus" }),
          F[4] || (F[4] = G(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, xn));
  }
}), Sn = { class: "pim-stack" }, On = { class: "muted small" }, Rn = { class: "muted small" }, In = { class: "pim-fields" }, Tn = { class: "pim-f pim-w-half" }, Pn = { class: "pim-f-label" }, qn = ["id"], Nn = { class: "pim-f pim-w-half" }, Dn = { class: "pim-f-label" }, zn = ["id"], Bn = { class: "muted small" }, Ln = { class: "pim-fields" }, Fn = { class: "pim-f pim-w-third" }, En = { class: "pim-f-label" }, Mn = ["id"], Wn = { class: "pim-f pim-w-third" }, Hn = { class: "pim-f-label" }, Jn = ["for"], Kn = { class: "row" }, Gn = ["aria-labelledby"], Yn = { class: "pim-f-label" }, Zn = ["id"], Qn = { key: 1 }, Xn = { class: "pim-f pim-w-full" }, eo = { class: "pim-f-label" }, ao = ["id"], lo = /* @__PURE__ */ de({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {},
    view: {}
  },
  emits: ["remove"],
  setup(l, { emit: y }) {
    const t = l, o = y, p = Ne();
    function c(r, U) {
      return p + "-" + r + "-" + U;
    }
    const b = D(() => t.schema.access.admin), m = D(() => t.draft.channels ?? []), C = D(() => t.draft.sources ?? []), A = D(() => [...new Set((t.draft.families ?? []).flatMap((r) => (r.requirements ?? []).map((U) => U.id)))].map((r) => ({ value: r, label: B(r) }))), L = D(() => (t.draft.families ?? []).filter((r) => r.code !== "generic").map((r) => ({ value: r.code, label: B(r.code) }))), Q = D(() => (t.draft.aspects ?? []).map((r) => ({ value: r.namespace, label: B(r.namespace) })));
    function P(r) {
      (t.draft.channels ??= []).push({ id: r, requirements: [] });
    }
    function F(r) {
      m.value.splice(m.value.indexOf(r), 1), t.schema.declaration.channels?.some((U) => U.id === r.id) && o("remove", "channels", r.id);
    }
    function v(r) {
      (t.draft.sources ??= []).push({ id: r, ordering: "none", writes: [] });
    }
    function w(r) {
      C.value.splice(C.value.indexOf(r), 1), t.schema.declaration.sources?.some((U) => U.id === r.id) && o("remove", "sources", r.id);
    }
    return (r, U) => (e(), i("div", Sn, [
      l.view !== "sources" ? (e(), T(Pe, {
        key: 0,
        count: m.value.length,
        columns: ["details"]
      }, ye({
        default: k(() => [
          (e(!0), i(E, null, ee(m.value, (R) => (e(), T(qe, {
            key: R.id,
            title: s(B)(R.id)
          }, ye({
            details: k(() => [
              a("span", On, $(R.families?.length ? R.families.map(s(B)).join(", ") : "All families"), 1),
              a("span", Rn, $(R.requirements?.length ? R.requirements.map(s(B)).join(", ") : "No release requirements"), 1)
            ]),
            default: k(() => [
              a("div", In, [
                a("div", Tn, [
                  a("div", Pn, [
                    a("label", {
                      id: c(R.id, "requirements")
                    }, "Release requirements", 8, qn),
                    U[0] || (U[0] = a("span", { class: "pim-f-note" }, "a product is ready for the channel when these hold", -1))
                  ]),
                  f(je, {
                    disabled: !b.value,
                    labelledby: c(R.id, "requirements"),
                    "model-value": R.requirements ?? [],
                    options: A.value,
                    "onUpdate:modelValue": (M) => s(Fe)(R, "requirements", M)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                a("div", Nn, [
                  a("div", Dn, [
                    a("label", {
                      id: c(R.id, "families")
                    }, "Families", 8, zn),
                    U[1] || (U[1] = a("span", { class: "pim-f-note" }, "empty means every family", -1))
                  ]),
                  f(je, {
                    disabled: !b.value,
                    labelledby: c(R.id, "families"),
                    "model-value": R.families ?? [],
                    options: L.value,
                    "onUpdate:modelValue": (M) => s(Fe)(R, "families", M)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            b.value ? {
              name: "actions",
              fn: k(() => [
                f(s(H), {
                  type: "button",
                  onClick: (M) => F(R),
                  "aria-label": "Remove " + s(B)(R.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: k(() => [
                    f(s(le), { icon: "tabler:trash" })
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
        b.value ? {
          name: "head",
          fn: k(() => [
            f(Te, {
              label: "Channel name",
              action: "Add channel",
              "from-name": "",
              existing: m.value.map((R) => R.id),
              onAdd: P
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])) : h("", !0),
      l.view !== "channels" ? (e(), T(Pe, {
        key: 1,
        count: C.value.length,
        columns: ["details"]
      }, ye({
        default: k(() => [
          (e(!0), i(E, null, ee(C.value, (R) => (e(), T(qe, {
            key: R.id,
            title: s(B)(R.id)
          }, ye({
            details: k(() => [
              a("span", Bn, $(R.writes?.length ? R.writes.map(s(B)).join(", ") : "No field groups selected"), 1)
            ]),
            default: k(() => [
              a("div", Ln, [
                a("div", Fn, [
                  a("div", En, [
                    a("label", {
                      id: c(R.id, "ordering")
                    }, "Handle incoming updates", 8, Mn),
                    U[2] || (U[2] = a("span", { class: "pim-f-note" }, "sequence keeps late deliveries from winning", -1))
                  ]),
                  f(s(_e), {
                    disabled: !b.value,
                    "aria-labelledby": c(R.id, "ordering"),
                    "model-value": R.ordering ?? "none",
                    "onUpdate:modelValue": (M) => R.ordering = M,
                    options: [{ value: "none", label: "Use arrival order" }, { value: "sequence", label: "Use the source’s sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                a("div", Wn, [
                  a("div", Hn, [
                    a("label", {
                      for: c(R.id, "audit")
                    }, "Audit", 8, Jn),
                    U[3] || (U[3] = a("span", { class: "pim-f-note" }, "record each value change", -1))
                  ]),
                  a("div", Kn, [
                    f(s(la), {
                      disabled: !b.value,
                      "input-id": c(R.id, "audit"),
                      "model-value": R.audit !== !1,
                      "onUpdate:modelValue": (M) => M ? delete R.audit : R.audit = !1
                    }, null, 8, ["disabled", "input-id", "model-value", "onUpdate:modelValue"]),
                    a("span", null, $(R.audit === !1 ? "Off for this source" : "Follow catalog audit settings"), 1)
                  ])
                ]),
                a("div", {
                  class: "pim-f pim-w-third",
                  role: "group",
                  "aria-labelledby": c(R.id, "people")
                }, [
                  a("div", Yn, [
                    a("label", {
                      id: c(R.id, "people")
                    }, "People and service accounts", 8, Zn),
                    U[4] || (U[4] = a("span", { class: "pim-f-note" }, "who may write as this source", -1))
                  ]),
                  b.value ? (e(), T(An, {
                    key: 0,
                    "catalog-id": l.catalogId,
                    "model-value": R.principals ?? [],
                    "onUpdate:modelValue": (M) => s(Fe)(R, "principals", M)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])) : (e(), i("span", Qn, $(R.principals?.length ? R.principals.length + (R.principals.length === 1 ? " allowed account" : " allowed accounts") : "No accounts specified"), 1))
                ], 8, Gn),
                a("div", Xn, [
                  a("div", eo, [
                    a("label", {
                      id: c(R.id, "writes")
                    }, "Field groups it can update", 8, ao),
                    U[5] || (U[5] = a("span", { class: "pim-f-note" }, "field groups this source may set", -1))
                  ]),
                  f(je, {
                    disabled: !b.value,
                    labelledby: c(R.id, "writes"),
                    "model-value": R.writes ?? [],
                    options: Q.value,
                    "onUpdate:modelValue": (M) => s(Fe)(R, "writes", M)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            b.value ? {
              name: "actions",
              fn: k(() => [
                f(s(H), {
                  type: "button",
                  onClick: (M) => w(R),
                  "aria-label": "Remove " + s(B)(R.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: k(() => [
                    f(s(le), { icon: "tabler:trash" })
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
        b.value ? {
          name: "head",
          fn: k(() => [
            f(Te, {
              label: "Source name",
              action: "Add source",
              "from-name": "",
              existing: C.value.map((R) => R.id),
              onAdd: v
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])) : h("", !0)
    ]));
  }
}), to = {
  failed: { label: "Setup failed", severity: "danger" },
  paused: { label: "Background update paused", severity: "warn" },
  degraded: { label: "Degraded", severity: "warn" },
  catchingUp: { label: "Catching up", severity: "info" },
  config: { label: "Configuration needed", severity: "warn" },
  reset: { label: "Reset required", severity: "warn" },
  uninstalled: { label: "Uninstalled · still referenced", severity: "warn" },
  pending: { label: "Setting up", severity: "info" }
};
function Ha(l, y) {
  return !l.parked && (l.bootstrapping || l.last_seq < y);
}
function so(l, y) {
  return !l.active || !l.installed || l.problem || l.lifecycle.state === "failed" ? !1 : l.lifecycle.state === "pending" || Object.values(l.projections).some((t) => Ha(t, y));
}
function io(l, y) {
  const t = l.problem ?? l.lifecycle.error, o = Object.entries(l.projections), p = o.find(([, b]) => b.parked) ?? o.find(([, b]) => b.error) ?? o.find(([, b]) => Ha(b, y));
  let c;
  return l.active && !l.installed ? c = "uninstalled" : t?.code === "plugin_config_invalid" ? c = "config" : t?.code === "plugin_projection_history_pruned" ? c = "reset" : t || l.lifecycle.state === "failed" ? c = "failed" : l.active && p?.[1].parked ? c = "paused" : l.active && p?.[1].error ? c = "degraded" : l.active && p ? c = "catchingUp" : l.active && l.lifecycle.state === "pending" && (c = "pending"), c ? { kind: c, ...to[c], error: t, projection: p } : void 0;
}
function no(l) {
  return (l.problem ?? l.lifecycle.error)?.code === "plugin_interface_version_unsupported";
}
const oo = { class: "pim-stack" }, ro = { class: "pim-bsection-head" }, uo = { class: "muted small" }, co = {
  key: 0,
  class: "pim-aspect muted"
}, mo = {
  key: 0,
  class: "muted small"
}, po = { class: "pim-stack pim-plugin-recovery" }, vo = {
  key: 0,
  class: "muted small"
}, fo = {
  key: 1,
  class: "muted small"
}, bo = { key: 0 }, yo = { key: 1 }, go = { key: 0 }, ho = { key: 0 }, ko = { key: 0 }, _o = { key: 1 }, wo = { key: 2 }, $o = { key: 3 }, Co = { key: 0 }, xo = {
  key: 0,
  class: "pim-ia-action"
}, Vo = {
  key: 0,
  class: "pim-ia-dialog"
}, Uo = { class: "pim-ia-dialog-head" }, jo = { key: 1 }, Ao = { key: 2 }, So = { class: "row pim-ia-dialog-actions" }, Oo = {
  key: 0,
  class: "pim-aspect muted"
}, Ro = { class: "row wrap muted small" }, Io = /* @__PURE__ */ de({
  __name: "BuilderPlugins",
  props: {
    draft: {},
    schema: {},
    options: {},
    pluginConfigs: { default: () => ({}) },
    stale: { type: Boolean }
  },
  emits: ["remove", "configure", "reset", "resume", "refresh", "review", "clearShellBinding"],
  setup(l, { emit: y }) {
    const t = l, o = y, p = /* @__PURE__ */ new Map([
      ["eq", "Equals"],
      ["in", "Is one of"],
      ["gt", "Greater than"],
      ["gte", "At least"],
      ["lt", "Less than"],
      ["lte", "At most"]
    ]), c = J({}), b = J(), m = D(() => v.value.find((N) => N.plugin.plugin === b.value)), C = D(() => m.value?.plugin), A = D(() => t.options.plugins.filter((N) => N.installed).length), L = D(() => t.schema.access.admin), Q = D(() => t.draft.plugins ?? []), P = D(() => new Map(t.schema.plugins.map((N) => [N.plugin, N]))), F = D(() => {
      const N = /* @__PURE__ */ new Map();
      for (const [q, K] of Object.entries(t.schema.attributes)) {
        if (!K.plugin) continue;
        const z = N.get(K.plugin) ?? [];
        z.push(B(q)), N.set(K.plugin, z);
      }
      return N;
    }), v = D(() => t.options.plugins.map((N) => {
      const q = P.value.get(N.plugin) ?? N, K = io(q, t.schema.as_of), z = Q.value.some((n) => n.use === q.plugin);
      return {
        option: N,
        plugin: q,
        status: K,
        chosen: z,
        title: oe(q.title ?? N.title, q.installed ? "Plugin" : "Unavailable plugin"),
        label: !q.active && K?.kind === "failed" ? "Unavailable" : K?.label ?? (z ? q.active ? "Enabled" : "Will enable on apply" : q.active ? "Will disable on apply" : "Disabled"),
        severity: K?.severity ?? (z ? "success" : "secondary")
      };
    }));
    function w(N, q) {
      const K = q.map((z) => p.get(z)).filter(Boolean);
      return [B(N), K.join(", ")].filter(Boolean).join(" · ");
    }
    function r(N, q) {
      q && !Q.value.some((K) => K.use === N) && (t.draft.plugins ??= []).push({ use: N }), q || (t.draft.plugins = Q.value.filter((K) => K.use !== N), delete t.pluginConfigs[N], P.value.get(N)?.active && o("remove", "plugins", N));
    }
    function U(N, q) {
      c.value[N] = !0, t.pluginConfigs[N] = q;
    }
    function R(N, q) {
      const K = N.config_schema.properties;
      return oe(K?.[q]?.title ?? B(q), "this setting");
    }
    const M = D(() => t.draft.scopes ?? []);
    function ie(N) {
      return M.value.includes(N.id);
    }
    function me(N, q) {
      q && !ie(N) && (t.draft.scopes ??= []).push(N.id), !q && ie(N) && (M.value.splice(M.value.indexOf(N.id), 1), t.schema.declaration.scopes?.includes(N.id) && o("remove", "scopes", N.id));
    }
    const W = D(() => {
      const N = C.value;
      if (!N) return [];
      const q = N.references;
      return [
        { label: "Fields", items: (q?.fields ?? Object.entries(t.schema.attributes).filter(([, z]) => z.plugin === N.plugin).map(([z]) => z)).map((z) => ({ id: z, title: oe(B(z), "Field") })) },
        { label: "Product filter sets", items: (q?.scopes ?? []).map((z) => ({
          id: z,
          title: oe(t.options.scopes.find((n) => n.id === z)?.title, "Unavailable filter set")
        })) },
        { label: "Catalog app binding", items: (q?.shell_bindings ?? []).map((z) => ({ id: z, title: "Catalog app" })) },
        { label: "Readiness checks", items: (q?.checks ?? []).map((z) => ({ id: z, title: "Readiness check" })) },
        { label: "Dependent plugins", items: (q?.plugins ?? []).map((z) => ({
          id: z,
          title: oe(P.value.get(z)?.title, "Dependent plugin")
        })) }
      ].filter((z) => z.items.length);
    });
    function se(N) {
      for (const q of N.references?.scopes ?? [])
        M.value.includes(q) && (t.draft.scopes = M.value.filter((K) => K !== q), o("remove", "scopes", q));
      b.value = void 0, r(N.plugin, !1), o("review");
    }
    return (N, q) => (e(), i("div", oo, [
      f(Pe, {
        count: v.value.length,
        columns: ["details"]
      }, {
        head: k(() => [
          a("header", ro, [
            q[6] || (q[6] = a("h3", null, "Plugins", -1)),
            a("span", uo, $(A.value) + " installed", 1)
          ])
        ]),
        default: k(() => [
          v.value.length === 0 ? (e(), i("div", co, "No plugin is installed.")) : h("", !0),
          (e(!0), i(E, null, ee(v.value, ({ option: K, plugin: z, status: n, chosen: V, title: d, label: u, severity: X }) => (e(), T(qe, {
            key: z.plugin,
            title: d,
            open: c.value[z.plugin] ?? !!(z.active && n && n.kind !== "pending"),
            "onUpdate:open": (Y) => c.value[z.plugin] = Y
          }, ye({
            details: k(() => [
              f(s(ge), {
                severity: X,
                value: u
              }, null, 8, ["severity", "value"]),
              !n && K.description ? (e(), i("span", mo, $(s(oe)(K.description, "Adds capabilities to this catalog.")), 1)) : h("", !0)
            ]),
            default: k(() => [
              a("div", po, [
                F.value.get(z.plugin)?.length ? (e(), i("p", vo, " Adds fields for " + $(F.value.get(z.plugin)?.join(", ")) + ". ", 1)) : h("", !0),
                z.active && n?.kind === "failed" && n.projection?.[1].parked ? (e(), i("p", fo, " Background update: Paused ")) : h("", !0),
                n?.kind === "failed" ? (e(), i(E, { key: 2 }, [
                  f(s(we), {
                    severity: "warn",
                    role: "alert"
                  }, {
                    default: k(() => [
                      s(no)(z) ? (e(), i(E, { key: 0 }, [
                        G("This package uses a plugin interface this deployment cannot run. Restore a compatible package to use this plugin.")
                      ], 64)) : (e(), i(E, { key: 1 }, [
                        G("The catalog could not set up this plugin. Check the status after resolving the setup problem.")
                      ], 64))
                    ]),
                    _: 2
                  }, 1024),
                  f(Re, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: k(() => [
                      a("p", null, [
                        q[7] || (q[7] = G("Plugin ", -1)),
                        a("code", null, $(z.plugin), 1)
                      ]),
                      n.error?.message ? (e(), i("p", bo, $(n.error.message), 1)) : h("", !0),
                      n.error?.code ? (e(), i("p", yo, [
                        a("code", null, $(n.error.code), 1)
                      ])) : h("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  L.value && z.references ? (e(), T(s(H), {
                    key: 0,
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (Y) => b.value = z.plugin
                  }, null, 8, ["onClick"])) : (e(), T(s(H), {
                    key: 1,
                    label: "Check status",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: q[0] || (q[0] = (Y) => o("refresh"))
                  }))
                ], 64)) : n?.kind === "reset" ? (e(), i(E, { key: 3 }, [
                  f(s(we), { severity: "warn" }, {
                    default: k(() => [
                      q[8] || (q[8] = G(" The event history this background update needs was removed. ", -1)),
                      n.error?.max_pruned_seq !== void 0 ? (e(), i("p", go, "Earliest retained position " + $(n.error.max_pruned_seq + 1) + ".", 1)) : h("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  f(Re, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: k(() => [
                      a("p", null, [
                        q[9] || (q[9] = G("Plugin ", -1)),
                        a("code", null, $(z.plugin), 1)
                      ]),
                      n.error?.projection ? (e(), i("p", ho, [
                        q[10] || (q[10] = G("Background update ", -1)),
                        a("code", null, $(n.error.projection), 1)
                      ])) : h("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  L.value ? (e(), T(s(H), {
                    key: 0,
                    label: "Reset background updates",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: l.stale,
                    onClick: (Y) => o("reset", z.plugin)
                  }, null, 8, ["disabled", "onClick"])) : h("", !0)
                ], 64)) : n?.projection && (n.kind === "paused" || n.kind === "degraded" || n.kind === "catchingUp") ? (e(), i(E, { key: 4 }, [
                  f(s(we), {
                    severity: n.kind === "catchingUp" ? "info" : "warn"
                  }, {
                    default: k(() => [
                      n.projection[1].status === "paused" ? (e(), i("p", ko, "This update was paused.")) : n.kind === "paused" ? (e(), i("p", _o, "The background worker stopped.")) : n.kind === "degraded" ? (e(), i("p", wo, "The background worker reported an error.")) : (e(), i("p", $o, "This update is processing catalog changes.")),
                      a("p", null, "Last applied position " + $(n.projection[1].last_seq) + ".", 1)
                    ]),
                    _: 2
                  }, 1032, ["severity"]),
                  f(Re, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: k(() => [
                      a("p", null, [
                        q[11] || (q[11] = G("Background update ", -1)),
                        a("code", null, $(n.projection[0]), 1)
                      ]),
                      n.projection[1].error ? (e(), i("p", Co, $(n.projection[1].error), 1)) : h("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  L.value && n.projection[1].status === "paused" && n.projection[1].cursor_id ? (e(), T(s(H), {
                    key: 0,
                    label: "Resume background update",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: l.stale,
                    onClick: (Y) => o("resume", n.projection[1].cursor_id)
                  }, null, 8, ["disabled", "onClick"])) : n.kind === "paused" && L.value ? (e(), T(s(H), {
                    key: 1,
                    label: "Reset background updates",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: l.stale,
                    onClick: (Y) => o("reset", z.plugin)
                  }, null, 8, ["disabled", "onClick"])) : (e(), T(s(H), {
                    key: 2,
                    label: "Check status",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: q[1] || (q[1] = (Y) => o("refresh"))
                  }))
                ], 64)) : n?.kind === "uninstalled" ? (e(), i(E, { key: 5 }, [
                  f(s(we), { severity: "warn" }, {
                    default: k(() => [...q[12] || (q[12] = [
                      G("The package was removed while it was still enabled for this catalog.", -1)
                    ])]),
                    _: 1
                  }),
                  f(s(H), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (Y) => b.value = z.plugin
                  }, null, 8, ["onClick"])
                ], 64)) : V ? (e(), i(E, { key: 6 }, [
                  f(wa, {
                    disabled: !L.value,
                    schema: K.config_schema,
                    "model-value": l.pluginConfigs[z.plugin] ?? z.config ?? {},
                    problem: n?.kind === "config" ? n.error : void 0,
                    "plugin-id": n?.kind === "config" ? z.plugin : void 0,
                    "problem-label": n?.error?.field && n.error.field !== "config" ? R(K, n.error.field) : void 0,
                    "onUpdate:modelValue": (Y) => U(z.plugin, Y)
                  }, null, 8, ["disabled", "schema", "model-value", "problem", "plugin-id", "problem-label", "onUpdate:modelValue"]),
                  L.value && z.active && (l.pluginConfigs[z.plugin] || n?.kind === "config") ? (e(), i("div", xo, [
                    f(s(H), {
                      disabled: l.stale || !l.pluginConfigs[z.plugin],
                      label: "Save configuration",
                      size: "small",
                      onClick: (Y) => o("configure", z.plugin, l.pluginConfigs[z.plugin])
                    }, null, 8, ["disabled", "onClick"])
                  ])) : h("", !0)
                ], 64)) : h("", !0)
              ])
            ]),
            _: 2
          }, [
            L.value && z.installed && (!n || n.kind === "pending") ? {
              name: "actions",
              fn: k(() => [
                f(s(la), {
                  "aria-label": "Enable " + d,
                  "model-value": V,
                  "onUpdate:modelValue": (Y) => r(z.plugin, Y)
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["title", "open", "onUpdate:open"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      f(oa, {
        visible: !!C.value,
        label: "Plugin references",
        onClose: q[5] || (q[5] = (K) => b.value = void 0)
      }, {
        default: k(() => [
          m.value && C.value ? (e(), i("section", Vo, [
            a("header", Uo, [
              a("div", null, [
                q[13] || (q[13] = a("h2", null, "Plugin references", -1)),
                a("p", null, $(m.value.title), 1)
              ])
            ]),
            W.value.length ? (e(), i(E, { key: 0 }, [
              q[14] || (q[14] = a("p", null, "Replace or remove these references before deactivating the plugin. You can also restore the package to keep using them.", -1)),
              (e(!0), i(E, null, ee(W.value, (K) => (e(), i("div", {
                key: K.label
              }, [
                a("h3", null, $(K.label), 1),
                a("ul", null, [
                  (e(!0), i(E, null, ee(K.items, (z) => (e(), i("li", {
                    key: z.id
                  }, $(z.title), 1))), 128))
                ])
              ]))), 128))
            ], 64)) : (e(), i("p", jo, "Use the catalog review to see what deactivating this plugin would change.")),
            C.value.references?.scopes.length && !C.value.references?.shell_bindings.length ? (e(), i("p", Ao, "Reviewing removal also includes these product filter sets.")) : h("", !0),
            f(Re, {
              class: "small pim-error-code pim-ia-disclosure",
              label: "Technical details"
            }, {
              default: k(() => [
                a("p", null, [
                  q[15] || (q[15] = G("Plugin ", -1)),
                  a("code", null, $(C.value.plugin), 1)
                ]),
                (e(!0), i(E, null, ee(W.value, (K) => (e(), i("div", {
                  key: K.label
                }, [
                  a("p", null, $(K.label), 1),
                  a("ul", null, [
                    (e(!0), i(E, null, ee(K.items, (z) => (e(), i("li", {
                      key: z.id
                    }, [
                      a("code", null, $(z.id), 1)
                    ]))), 128))
                  ])
                ]))), 128))
              ]),
              _: 1
            }),
            a("div", So, [
              L.value && C.value.references?.shell_bindings.length ? (e(), T(s(H), {
                key: 0,
                label: "Clear catalog app binding",
                severity: "secondary",
                outlined: "",
                disabled: l.stale,
                onClick: q[2] || (q[2] = (K) => o("clearShellBinding", C.value.references.shell_bindings[0]))
              }, null, 8, ["disabled"])) : L.value ? (e(), T(s(H), {
                key: 1,
                label: "Review removal",
                disabled: l.stale,
                onClick: q[3] || (q[3] = (K) => se(C.value))
              }, null, 8, ["disabled"])) : h("", !0),
              f(s(H), {
                label: "Close",
                severity: "secondary",
                outlined: "",
                onClick: q[4] || (q[4] = (K) => b.value = void 0)
              })
            ])
          ])) : h("", !0)
        ]),
        _: 1
      }, 8, ["visible"]),
      f(Pe, {
        count: l.options.scopes.length,
        columns: ["details"]
      }, {
        head: k(() => [...q[16] || (q[16] = [
          a("header", { class: "pim-bsection-head" }, [
            a("h3", null, "Product filter sets"),
            a("span", { class: "muted small" }, "Choose additional ways to filter products.")
          ], -1)
        ])]),
        default: k(() => [
          l.options.scopes.length === 0 ? (e(), i("div", Oo, "No product filter sets are available.")) : h("", !0),
          (e(!0), i(E, null, ee(l.options.scopes, (K) => (e(), T(qe, {
            key: K.id,
            title: s(oe)(K.title, "Filter set")
          }, ye({
            details: k(() => [
              f(s(ge), {
                severity: ie(K) ? "success" : "secondary",
                value: ie(K) ? "Selected" : "Available"
              }, null, 8, ["severity", "value"])
            ]),
            default: k(() => [
              a("div", Ro, [
                q[17] || (q[17] = a("span", null, "Filters", -1)),
                (e(!0), i(E, null, ee(K.filters, (z, n) => (e(), T(s(ge), {
                  key: n,
                  class: "kx-tag-sm small",
                  severity: "secondary",
                  value: w(n, z.ops)
                }, null, 8, ["value"]))), 128)),
                a("span", null, $(s(B)(K.access)) + " access required", 1)
              ])
            ]),
            _: 2
          }, [
            L.value ? {
              name: "actions",
              fn: k(() => [
                f(s(la), {
                  "aria-label": "Use " + s(oe)(K.title, "Filter set"),
                  "model-value": ie(K),
                  "onUpdate:modelValue": (z) => me(K, z)
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
async function To(l) {
  const y = await cl(`/api/v1/pim-admin/catalogs/${encodeURIComponent(l)}/policy_defaults`, "policy defaults");
  if (y.audit !== "fields" && y.audit !== "off" || !["audit_days", "trash_days", "tombstone_days"].every((t) => typeof y[t] == "number" && Number.isSafeInteger(y[t])))
    throw new Error("Policy defaults are unavailable.");
  for (const [t, o] of Object.entries(Ja)) {
    const p = y[t];
    if (typeof p != "number" || !Number.isSafeInteger(p) || p < o.min || p > o.max) throw new Error(`Policy ${t} is unavailable.`);
  }
  return y;
}
const Ja = {
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
}, Po = { class: "form" }, qo = {
  key: 0,
  class: "muted small pim-policy-intro"
}, No = {
  key: 1,
  class: "muted small pim-policy-status",
  role: "status"
}, Do = {
  key: 0,
  class: "pim-bsection-head"
}, zo = { class: "pim-policy-copy" }, Bo = ["for"], Lo = ["id"], Fo = { key: 0 }, Eo = {
  key: 0,
  class: "pim-policy-value"
}, Mo = {
  key: 0,
  class: "muted small"
}, Wo = /* @__PURE__ */ de({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {},
    disabled: { type: Boolean },
    defaultsOnly: { type: Boolean }
  },
  setup(l) {
    const y = l, t = J(), o = D(() => y.defaults ?? t.value), p = J(), c = J(!1);
    async function b() {
      if (!(y.defaults || y.disabled)) {
        p.value = void 0, c.value = !0;
        try {
          t.value = await To(y.catalogId ?? "");
        } catch (r) {
          p.value = Ee(r, "Could not read policy defaults.");
        } finally {
          c.value = !1;
        }
      }
    }
    Ba(b);
    const m = D(() => y.draft.policy ?? {}), C = [
      { key: "audit", title: "Audit trail", hint: "Fields records each value change. Off records only lifecycle, schema and release history.", kind: "enum" },
      { key: "audit_days", title: "Audit retention (days)", hint: "0 uses the 365-day default. History always expires.", kind: "int", min: 0, max: 106751 },
      { key: "trash_days", title: "Trash window (days)", hint: "How long a deleted product stays restorable.", kind: "int", min: 1, max: 106751 },
      { key: "tombstone_days", title: "Deleted product notices (days)", hint: "How long feeds report a purged product as deleted.", kind: "int", min: 1, max: 106751 }
    ], A = {
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
    function L(r) {
      const U = Ja[r];
      return { key: r, ...U, kind: "int", hint: A[r] };
    }
    C.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(L));
    const Q = ["proposal_days", "proposal_count"].map(L), P = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(L), F = [
      { id: "retention", title: "Retention", keys: C },
      { id: "proposals", title: "Proposals", keys: Q },
      { id: "advanced", title: "", keys: P }
    ], v = D(() => [
      { value: "inherited", label: o.value ? `${o.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function w(r, U) {
      const R = y.draft.policy ?? (y.draft.policy = {});
      R[r] = U == null || U === "" || U === "inherited" ? !1 : U;
    }
    return (r, U) => (e(), i("section", Po, [
      l.defaultsOnly ? h("", !0) : (e(), i("p", qo, "Empty fields inherit the deployment settings.")),
      c.value ? (e(), i("p", No, "Loading deployment defaults…")) : h("", !0),
      p.value ? (e(), T(ua, {
        key: 2,
        error: p.value
      }, {
        default: k(() => [
          f(s(H), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: b
          }, {
            default: k(() => [...U[0] || (U[0] = [
              G("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : h("", !0),
      (e(), i(E, null, ee(F, (R) => f(Da(R.id === "advanced" ? Re : "section"), Vl({
        key: R.id,
        ref_for: !0
      }, R.id === "advanced" ? { label: "Advanced processing settings" } : { "aria-label": R.title }, {
        "data-policy-group": R.id,
        class: "pim-policy-group"
      }), {
        default: k(() => [
          R.title ? (e(), i("header", Do, [
            a("h3", null, $(R.title), 1)
          ])) : h("", !0),
          (e(!0), i(E, null, ee(R.keys, (M) => (e(), i("div", {
            key: M.key,
            class: "pim-policy-row"
          }, [
            a("div", zo, [
              a("label", {
                for: "pol-" + M.key
              }, $(M.title), 9, Bo),
              a("p", {
                id: "pol-help-" + M.key
              }, [
                G($(M.hint), 1),
                M.global ? (e(), i("span", Fo, " Managed in deployment settings.")) : h("", !0)
              ], 8, Lo)
            ]),
            l.defaultsOnly ? (e(), i("p", Eo, [
              G($(o.value?.[M.key] === "fields" ? "Record field changes" : o.value?.[M.key] === "off" ? "Lifecycle and release history" : o.value?.[M.key] ?? "Unavailable") + " ", 1),
              m.value[M.key] !== void 0 && m.value[M.key] !== !1 ? (e(), i("span", Mo, " · Catalog override applies")) : h("", !0)
            ])) : M.kind === "enum" ? (e(), T(s(_e), {
              key: 1,
              disabled: l.disabled,
              "input-id": "pol-" + M.key,
              "aria-describedby": "pol-help-" + M.key,
              class: "pim-policy-control",
              "model-value": typeof m.value[M.key] == "string" ? m.value[M.key] : "inherited",
              options: v.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": (ie) => w(M.key, ie)
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
              "onUpdate:modelValue": (ie) => w(M.key, ie)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "min", "max", "placeholder", "onUpdate:modelValue"]))
          ]))), 128))
        ]),
        _: 2
      }, 1040, ["data-policy-group"])), 64))
    ]));
  }
}), Ho = { class: "form" }, Jo = { class: "pim-aspect" }, Ko = { class: "pim-aspect-head" }, Go = {
  key: 0,
  class: "muted small"
}, Yo = /* @__PURE__ */ de({
  __name: "BuilderDeclaration",
  props: {
    draft: {},
    readonly: { type: Boolean }
  },
  emits: ["replace", "validity"],
  setup(l, { emit: y }) {
    const t = l, o = y, p = J(JSON.stringify(t.draft, null, 2)), c = J("");
    Ze(() => o("validity", !0)), fe(() => t.draft, (m) => {
      p.value = JSON.stringify(m, null, 2), c.value = "";
    }, { deep: !0 });
    function b() {
      if (!t.readonly)
        try {
          const m = Wl(p.value);
          c.value = "", o("validity", !0), o("replace", m);
        } catch (m) {
          o("validity", !1), c.value = "Invalid declaration: " + (m instanceof Error ? m.message : String(m));
        }
    }
    return (m, C) => (e(), i("section", Ho, [
      a("div", Jo, [
        a("header", Ko, [
          C[1] || (C[1] = a("h3", null, "Declaration", -1)),
          l.readonly ? h("", !0) : (e(), i("span", Go, "edits apply to the draft when the JSON parses"))
        ]),
        c.value ? (e(), T(s(we), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: k(() => [
            G($(c.value), 1)
          ]),
          _: 1
        })) : h("", !0),
        f(s(Rl), {
          modelValue: p.value,
          "onUpdate:modelValue": C[0] || (C[0] = (A) => p.value = A),
          readonly: l.readonly,
          "aria-label": "Catalog declaration",
          rows: "28",
          spellcheck: "false",
          onInput: b,
          onBlur: b,
          class: "mono pim-json-edit"
        }, null, 8, ["modelValue", "readonly"])
      ])
    ]));
  }
}), Zo = { class: "pim-section-layout" }, Qo = { class: "kx-main" }, Xo = ["aria-label"], ed = { class: "pim-builder-main" }, ad = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, ld = ["disabled", "inert"], td = { class: "pim-overview-grid" }, sd = { class: "kx-card-head" }, id = { class: "kx-head-icon" }, nd = { class: "kx-card-id" }, od = { class: "kx-card-name" }, dd = { class: "kx-card-meta" }, rd = { class: "kx-card-desc" }, ud = { class: "pim-advanced-actions" }, cd = { class: "pim-ia-action" }, md = { class: "pim-ia-action" }, pd = { class: "pim-ia-dialog" }, vd = { class: "pim-ia-dialog-head" }, fd = {
  key: 0,
  class: "dialog-actions"
}, bd = ["aria-labelledby"], yd = { class: "pim-ia-dialog-head" }, gd = ["id"], hd = { class: "pim-ia-review-impact" }, kd = { key: 0 }, _d = { key: 1 }, wd = { key: 2 }, $d = { key: 3 }, Cd = { key: 4 }, xd = { key: 0 }, Vd = {
  key: 0,
  class: "pim-plan-list"
}, Ud = { key: 1 }, jd = {
  key: 1,
  class: "pim-ia-review-impact"
}, Ad = {
  key: 0,
  class: "row pim-review-confirm"
}, Sd = ["for"], Od = { class: "dialog-actions pim-ia-dialog-actions" }, Rd = /* @__PURE__ */ de({
  __name: "SchemaBuilder",
  props: {
    catalogId: {},
    embedded: { type: Boolean },
    title: {},
    catalog: {},
    backLabel: {},
    focusBack: { type: Boolean },
    directoryCount: {}
  },
  emits: ["applied", "back", "dirty-changed", "directory-action"],
  setup(l, { emit: y }) {
    const t = l, o = y, p = {
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
    }, c = J("General"), b = J("Overview"), m = J(""), C = J(), A = J(!1), L = J(), Q = Object.keys(p).map((_) => ({
      heading: _ === "Channels" ? "Publishing and imports" : _,
      items: p[_].items.map((g) => ({ ...g, value: g.label, section: _ }))
    })), P = [
      ...Q.filter((_) => _.items.length > 1),
      { heading: "Manage catalog", items: Q.filter((_) => _.items.length === 1).flatMap((_) => _.items) }
    ], F = P.flatMap((_) => _.items), v = D(() => W.value && se.value ? [
      { ...P[0], heading: t.title || "Catalog" },
      ...P.slice(1)
    ] : []), w = D(() => t.backLabel ? {
      value: "all-catalogs",
      label: t.embedded ? "All catalogs" : t.backLabel,
      icon: "tabler:table"
    } : void 0), r = J();
    fe(r, (_) => {
      t.focusBack && _?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    function U(_) {
      if (_ === "all-catalogs") {
        o("back");
        return;
      }
      const g = F.find((O) => O.label === _);
      g && R(g.section, g.label);
    }
    function R(_, g = p[_].items[0].label) {
      c.value === _ && b.value === g || (c.value = _, b.value = g, L.value && (L.value.scrollTop = 0));
    }
    function M(_) {
      C.value = _, A.value = !0;
    }
    function ie(_) {
      m.value = _, R("Products", "Fields");
    }
    function me(_, g, O = g + "s") {
      return _ + " " + (_ === 1 ? g : O);
    }
    const W = J(null), se = J(null), N = J({}), q = J({}), K = J({}), z = D(() => Object.fromEntries(Object.entries(K.value).filter(([_]) => N.value.plugins?.some((g) => g.use === _) && !W.value?.plugins.some((g) => g.plugin === _ && g.active)))), n = J(), V = J(!1), d = J(null), u = J(!1), X = D(() => W.value?.access.admin === !0), Y = J(""), ae = J(null), Ae = J(!1), Me = J(!1), ve = J(null), De = Ne(), ta = {
      unchanged: "No changes",
      initial: "First schema",
      cosmetic: "Presentation only",
      additive: "New fields or options",
      semantic: "Affects product data",
      refused: "Changes blocked"
    }, ca = {
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
    }, Se = J(null), Ue = J(!0), pe = Ke(), j = D(() => Ae.value && Qe.value && (!va.value.length || Me.value) && !V.value && Ue.value && !!ae.value && ae.value.class !== "refused" && !!Se.value?.matches(ze.value, W.value?.schema_generation ?? -1, z.value)), S = D(() => ae.value ? [...ae.value.refused, ...ae.value.changes.filter((_) => _.class !== "refused")] : []), I = Ke(), x = Ke(), re = J(!1);
    let Z = 0;
    fe([N, q, K], () => {
      Z++, ke();
    }, { deep: !0, flush: "sync" });
    async function $e(_ = !1, g = !1) {
      if (Oe.value && !_) return;
      const O = I.begin(), te = Z, ue = t.catalogId, be = g ? Object.entries(K.value).filter(([Ce]) => W.value?.plugins.some((sa) => sa.plugin === Ce && sa.active)) : [];
      re.value = !0, n.value = void 0;
      try {
        const [Ce, sa] = await Promise.all([ce.schema(ue), ce.schemaOptions(ue)]);
        if (!I.current(O) || te !== Z || ue !== t.catalogId) return;
        W.value = Ce, se.value = sa, N.value = Xe(Ce.declaration), q.value = {}, K.value = Object.fromEntries(be.filter(([dl]) => Ce.plugins.some((Ia) => Ia.plugin === dl && Ia.active))), ke(), Ue.value = !0, V.value = !1;
      } catch (Ce) {
        I.current(O) && (n.value = Ee(Ce, "Could not load settings."));
      } finally {
        I.current(O) && (re.value = !1);
      }
    }
    let he = () => {
    };
    fe(() => t.catalogId, (_) => {
      he(), he = La(`component.${_}`, () => {
        !Oe.value && !u.value ? $e() : b.value === "Plugins" && !u.value && Be();
      });
    }, { immediate: !0 });
    const ma = ra(async () => {
      !Oe.value && !u.value ? await $e() : b.value === "Plugins" && !u.value && await Be();
    });
    Ze(() => {
      he(), pe.begin(), I.begin(), x.begin();
    });
    const $a = D(() => ma.value !== !1 && b.value === "Plugins" && !u.value && W.value?.plugins.some((_) => so(_, W.value.as_of)) === !0);
    fe($a, (_, g, O) => {
      if (!_) return;
      let te, ue = !0;
      const be = () => {
        te = setTimeout(async () => {
          await Be() && ue && $a.value && be();
        }, 2e3);
      };
      be(), O(() => {
        ue = !1, clearTimeout(te);
      });
    }), fe(() => t.catalogId, () => {
      pe.begin(), u.value = !1, V.value = !1, W.value = null, se.value = null, fa(), $e();
    });
    const Ka = D(() => Object.values(Ta(N.value, q.value)).reduce((_, g) => _ + (g?.length ?? 0), 0)), Qe = D(() => !!W.value && (JSON.stringify(N.value) !== JSON.stringify(W.value.declaration) || Ka.value > 0 || Object.keys(z.value).length > 0)), Oe = D(() => Qe.value || Object.keys(K.value).length > 0);
    fe(Oe, (_) => o("dirty-changed", _), { immediate: !0 });
    const pa = D(() => N.value.families?.filter((_) => _.code !== "generic") ?? []), Ca = D(() => N.value.aspects ?? []), xa = D(() => Ca.value.reduce((_, g) => _ + (g.attributes?.length ?? 0), 0)), Ga = D(() => {
      const _ = new Set(N.value.plugins?.map((g) => g.use));
      return Object.values(W.value?.attributes ?? {}).filter((g) => g.plugin && _.has(g.plugin)).length;
    }), Ya = D(() => !xa.value && !Ca.value.length && !pa.value.length), Va = D(() => N.value.channels ?? []), Za = D(() => N.value.sources ?? []), Ua = D(() => W.value?.plugins.filter((_) => _.active) ?? []), ja = D(() => t.catalog?.product_count ?? t.catalog?.item_count), Qa = D(() => [
      {
        section: "Products",
        label: "Product setup",
        icon: "tabler:packages",
        summary: [
          ...typeof ja.value == "number" ? [me(ja.value, "product")] : [],
          me(pa.value.length, "family", "families"),
          me(xa.value + Ga.value, "field")
        ].join(" · "),
        detail: pa.value.map((_) => B(_.code)).join(", ") || "Create a family for products that share the same fields."
      },
      {
        section: "Values",
        label: "Allowed values",
        icon: "tabler:list-details",
        summary: [me(N.value.dimensions?.length ?? 0, "dimension"), me(N.value.vocabularies?.length ?? 0, "vocabulary", "vocabularies")].join(" · "),
        detail: N.value.dimensions?.map((_) => B(_.name)).join(", ") || "Add dimensions when values vary by language, region or another context."
      },
      {
        section: "Channels",
        label: "Publishing and imports",
        icon: "tabler:arrows-exchange",
        summary: [me(Va.value.length, "channel"), me(Za.value.length, "source")].join(" · "),
        detail: Va.value.map((_) => B(_.id)).join(", ") || "Add a release destination when products are ready to publish."
      },
      {
        section: "Plugins",
        label: "Catalog tools",
        icon: "tabler:puzzle",
        summary: me(Ua.value.length, "plugin") + " enabled",
        detail: Ua.value.map((_) => oe(_.title, "Catalog plugin")).join(", ") || "Open Plugins to see which tools you can enable."
      }
    ]), Xa = {
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
    }, ze = D(() => {
      const _ = Xe(N.value), g = Ta(_, q.value);
      for (const [O, te] of Object.entries(g)) {
        const ue = _.remove ??= {};
        ue[O] = [.../* @__PURE__ */ new Set([...ue[O] ?? [], ...te])];
      }
      return _;
    });
    fe(Qe, (_) => {
      _ || ke();
    }), fe([ze, z], ke, { deep: !0 });
    function el(_) {
      const [g, O] = _.split(" ", 2);
      if (g === "plugin" && O) return oe(se.value?.plugins.find((be) => be.plugin === O)?.title, "Plugin");
      if (g === "scope" && O) return oe(se.value?.scopes.find((be) => be.id === O)?.title, "Product filter set");
      if (O) return oe(B(O), B(g)) + (g === "aspect" ? " field group" : "");
      if (_.startsWith("kickside.")) return "Catalog setting";
      const [te, ue] = _.split(".", 2);
      return ue ? `${oe(B(ue), "Field")} (${oe(B(te), "Field group")})` : oe(B(_), "Catalog setting");
    }
    function al(_) {
      return _.startsWith("renamed from ") ? "Rename from " + B(_.slice(13)) : _.startsWith("config.") ? "Change " + B(_.slice(7)) : _.endsWith(" owning level") ? "Move a field to another variant level" : ca[_] ?? B(_);
    }
    const va = D(() => {
      const _ = ze.value.remove;
      return [
        ..._?.attributes?.length || _?.aspects?.length ? ["Removing fields deletes the values stored in those fields."] : [],
        ..._?.vocabularies?.length ? ["Removing a vocabulary deletes its saved terms."] : [],
        ..._?.channels?.length ? ["Removing a release destination withdraws products already published to it."] : []
      ];
    }), Aa = D(() => {
      const _ = W.value?.declaration;
      return _ ? [
        ...(N.value.channels ?? []).flatMap((g) => {
          const O = _.channels?.find((te) => te.id === g.id);
          return JSON.stringify(g) === JSON.stringify(O) ? [] : [{ subject: B(g.id), effect: O ? "Change which products can be released here and what they need first" : "Add a release destination" }];
        }),
        ...(ze.value.remove?.channels ?? []).map((g) => ({ subject: B(g), effect: "Remove this release destination" })),
        ...(N.value.sources ?? []).flatMap((g) => {
          const O = _.sources?.find((te) => te.id === g.id);
          return JSON.stringify(g) === JSON.stringify(O) ? [] : [{ subject: B(g.id), effect: O ? "Update how this source can send product data" : "Let this source send product updates" }];
        }),
        ...(ze.value.remove?.sources ?? []).map((g) => ({ subject: B(g), effect: "Stop accepting updates from this source" }))
      ] : [];
    });
    function We(_, g) {
      n.value = Ee(_, g), n.value.code === pl && (V.value = !0, ke());
    }
    async function ll() {
      if (!(Oe.value && !await Je.confirm({
        header: "Discard unsaved changes?",
        message: "Reloading will discard unsaved settings and plugin changes.",
        acceptLabel: "Discard and reload",
        rejectLabel: "Cancel"
      }))) {
        u.value = !0, Y.value = "";
        try {
          await $e(!0);
        } finally {
          u.value = !1;
        }
      }
    }
    async function Sa() {
      if (!W.value || !Qe.value || !Ue.value || V.value) return;
      const _ = pe.begin(), g = Fl(ze.value, W.value.schema_generation, z.value);
      u.value = !0, n.value = void 0;
      try {
        const O = await ce.planSchema(t.catalogId, g.declaration, g.generation, g.pluginConfigs);
        if (!pe.current(_) || !g.matches(ze.value, W.value.schema_generation, z.value) || !Ue.value) return;
        Se.value = g, Me.value = !1, ae.value = O, Ae.value = !0, await Ge(), ve.value?.focus();
      } catch (O) {
        if (!pe.current(_)) return;
        We(O, "Could not review the change."), ke(), await Ge(), d.value?.$el.focus();
      } finally {
        pe.current(_) && (u.value = !1);
      }
    }
    async function tl() {
      if (!W.value || !Oe.value || !j.value || !Se.value) return;
      const _ = t.catalogId, g = pe.begin();
      u.value = !0, n.value = void 0, Y.value = "";
      try {
        const O = await ce.applySchema(_, Se.value.declaration, Se.value.generation, Se.value.pluginConfigs);
        if (_ !== t.catalogId || !pe.current(g) || (await $e(!0, !0), _ !== t.catalogId || !pe.current(g))) return;
        Y.value = "Catalog changes applied.", o("applied", O.generation);
      } catch (O) {
        if (_ !== t.catalogId || !pe.current(g)) return;
        ke(), We(O, "Could not apply the change."), await Ge(), d.value?.$el.focus();
      } finally {
        pe.current(g) && (u.value = !1);
      }
    }
    async function Be(_ = !1) {
      const g = t.catalogId, O = W.value, te = x.begin();
      try {
        const [ue, be] = await Promise.all([ce.schema(g), _ ? ce.schemaOptions(g) : void 0]);
        return !O || !x.current(te) || g !== t.catalogId || W.value !== O ? !1 : (O.plugins = ue.plugins, O.as_of = ue.as_of, be && (se.value = be), !0);
      } catch (ue) {
        return _ && x.current(te) && g === t.catalogId && We(ue, "Could not check plugin status."), !1;
      }
    }
    async function Oa(_, g, O = !1) {
      if (u.value || V.value || !X.value) return;
      const te = t.catalogId, ue = I.begin(), be = pe.begin();
      x.begin(), u.value = !0, n.value = void 0, Y.value = "";
      try {
        const Ce = JSON.stringify(g);
        if (O ? await ce.configurePlugin(te, _, Xe(g), !0) : await ce.configurePlugin(te, _, Xe(g)), te !== t.catalogId || !I.current(ue) || !await Be(!0) || te !== t.catalogId || !I.current(ue)) return;
        !O && JSON.stringify(K.value[_]) === Ce && delete K.value[_], Y.value = O ? "Background update reset requested." : "Configuration saved";
      } catch (Ce) {
        te === t.catalogId && pe.current(be) && We(Ce, O ? "Could not reset background updates." : "Could not save configuration.");
      } finally {
        pe.current(be) && (u.value = !1);
      }
    }
    async function sl(_) {
      const g = t.catalogId, O = W.value?.plugins.find((te) => te.plugin === _ && te.active && te.installed);
      !O?.config || u.value || V.value || !X.value || !await Je.confirm({
        header: "Reset background updates?",
        message: "Background updates will start from a new catalog event. Current product data will be rebuilt into the plugin’s index. Earlier events will be skipped.",
        acceptLabel: "Reset background updates",
        rejectLabel: "Cancel"
      }) || t.catalogId !== g || await Oa(_, O.config, !0);
    }
    async function il(_) {
      const g = t.catalogId;
      if (!(u.value || V.value || !X.value)) {
        u.value = !0, n.value = void 0, Y.value = "";
        try {
          await ce.resumePluginProjection(g, _), t.catalogId === g && await Be(!0) && (Y.value = "Background update resumed.");
        } catch (O) {
          t.catalogId === g && We(O, "Could not resume the background update.");
        } finally {
          t.catalogId === g && (u.value = !1);
        }
      }
    }
    async function nl(_) {
      const g = t.catalogId;
      if (!(u.value || V.value || !X.value) && !(!await Je.confirm({
        header: "Clear catalog app binding?",
        message: "The catalog will use the default app after this setting is saved.",
        acceptLabel: "Clear binding",
        rejectLabel: "Cancel"
      }) || t.catalogId !== g || u.value || !X.value || !W.value?.plugins.some((O) => O.references?.shell_bindings.includes(_)))) {
        u.value = !0, n.value = void 0, Y.value = "";
        try {
          if (await ce.updateCatalogApp(g, ""), t.catalogId !== g) return;
          await Be(!0) && (Y.value = "Catalog app binding cleared.");
        } catch (O) {
          t.catalogId === g && We(O, "Could not clear the catalog app binding.");
        } finally {
          t.catalogId === g && (u.value = !1);
        }
      }
    }
    async function ol() {
      Oe.value && !await Je.confirm({
        header: "Leave this catalog?",
        message: "Your unsaved catalog changes will be discarded.",
        acceptLabel: "Discard and open settings",
        rejectLabel: "Keep editing"
      }) || (fa(), A.value = !1, Je.navigate("/system/settings"));
    }
    function ke() {
      Ae.value = !1, Se.value = null;
    }
    function Ra() {
      A.value = !1, Ue.value = !0;
    }
    function fa() {
      K.value = {}, Ue.value = !0, W.value && (N.value = Xe(W.value.declaration)), q.value = {}, ke(), Y.value = "";
    }
    function He(_, g) {
      const O = q.value[_] ?? [];
      O.includes(g) || (q.value = { ...q.value, [_]: [...O, g] });
    }
    return (_, g) => (e(), i("section", {
      class: Ve(["pim-builder", { embedded: l.embedded }])
    }, [
      a("div", Zo, [
        w.value || W.value && se.value ? (e(), T(Nl, {
          key: 0,
          ref_key: "rail",
          ref: r,
          label: "Catalog settings sections",
          value: b.value,
          title: l.embedded ? "Catalogs" : void 0,
          count: l.directoryCount,
          groups: v.value,
          "leading-item": w.value,
          "onUpdate:value": U
        }, ye({ _: 2 }, [
          l.embedded ? {
            name: "actions",
            fn: k(() => [
              f(ml, {
                "create-label": "Create catalog",
                onCreate: g[0] || (g[0] = (O) => o("directory-action", "create")),
                onDefaults: g[1] || (g[1] = (O) => o("directory-action", "defaults"))
              })
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["value", "title", "count", "groups", "leading-item"])) : h("", !0),
        a("div", Qo, [
          a("section", {
            ref_key: "content",
            ref: L,
            class: "kx-main-scroll",
            "aria-label": b.value
          }, [
            W.value && se.value ? (e(), T(qt, {
              key: 0,
              title: b.value,
              description: Xa[b.value]
            }, ye({ _: 2 }, [
              X.value && Oe.value ? {
                name: "actions",
                fn: k(() => [
                  f(Nt, {
                    busy: u.value,
                    "review-disabled": !Ue.value || V.value || !Qe.value,
                    onDiscard: fa,
                    onReview: Sa
                  }, null, 8, ["busy", "review-disabled"])
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : h("", !0),
            a("div", ed, [
              n.value ? (e(), T(ua, {
                key: 0,
                ref_key: "errorPanel",
                ref: d,
                error: n.value,
                tabindex: "-1"
              }, {
                default: k(() => [
                  V.value ? (e(), T(s(H), {
                    key: 0,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: u.value,
                    onClick: ll
                  }, {
                    default: k(() => [...g[12] || (g[12] = [
                      G("Reload settings", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"])) : !W.value || !se.value ? (e(), T(s(H), {
                    key: 1,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: g[2] || (g[2] = (O) => $e())
                  }, {
                    default: k(() => [...g[13] || (g[13] = [
                      G("Retry", -1)
                    ])]),
                    _: 1
                  })) : h("", !0)
                ]),
                _: 1
              }, 8, ["error"])) : h("", !0),
              Y.value ? (e(), T(s(we), {
                key: 1,
                severity: "success",
                role: "status"
              }, {
                default: k(() => [
                  G($(Y.value), 1)
                ]),
                _: 1
              })) : h("", !0),
              W.value?.rebuilding && b.value === "Overview" ? (e(), T(s(we), {
                key: 2,
                severity: "info",
                role: "status"
              }, {
                default: k(() => [...g[14] || (g[14] = [
                  G("Updating product readiness", -1)
                ])]),
                _: 1
              })) : h("", !0),
              re.value && (!W.value || !se.value) ? (e(), i("div", ad, "Loading catalog settings…")) : W.value && se.value ? (e(), i("fieldset", {
                key: 4,
                class: "pim-editor-surface",
                disabled: u.value,
                inert: u.value
              }, [
                X.value ? h("", !0) : (e(), T(s(we), {
                  key: 0,
                  severity: "info"
                }, {
                  default: k(() => [...g[15] || (g[15] = [
                    G("You can view this catalog’s settings.", -1)
                  ])]),
                  _: 1
                })),
                (e(), i("div", {
                  key: b.value,
                  class: "pim-ia-content"
                }, [
                  c.value === "General" && b.value === "History" ? (e(), T(Rt, {
                    key: 0,
                    "catalog-id": l.catalogId,
                    "can-resolve-actors": X.value
                  }, null, 8, ["catalog-id", "can-resolve-actors"])) : c.value === "General" ? (e(), i(E, { key: 1 }, [
                    a("div", td, [
                      (e(!0), i(E, null, ee(Qa.value, (O) => (e(), i("section", {
                        key: O.section,
                        class: "kx-card pim-overview-card"
                      }, [
                        a("div", sd, [
                          a("span", id, [
                            f(s(le), {
                              icon: O.icon,
                              "aria-hidden": "true"
                            }, null, 8, ["icon"])
                          ]),
                          a("div", nd, [
                            a("h3", od, $(O.label), 1),
                            a("p", dd, $(O.summary), 1)
                          ])
                        ]),
                        a("p", rd, $(O.detail), 1),
                        f(s(H), {
                          type: "button",
                          text: "",
                          size: "small",
                          severity: "secondary",
                          class: "pim-overview-action",
                          onClick: (te) => R(O.section)
                        }, {
                          default: k(() => [
                            G($(O.section === "Products" && Ya.value ? "Set up products" : "View " + O.section.toLowerCase()) + " ", 1),
                            f(s(le), {
                              icon: "tabler:arrow-right",
                              "aria-hidden": "true"
                            })
                          ]),
                          _: 2
                        }, 1032, ["onClick"])
                      ]))), 128))
                    ]),
                    f(Re, { label: "Advanced" }, {
                      default: k(() => [
                        a("div", ud, [
                          a("div", cd, [
                            g[16] || (g[16] = a("div", null, [
                              a("h3", null, "Application defaults"),
                              a("p", null, "Review the audit, retention and processing settings this catalog inherits.")
                            ], -1)),
                            f(s(H), {
                              label: "View defaults",
                              severity: "secondary",
                              outlined: "",
                              onClick: g[3] || (g[3] = (O) => M("defaults"))
                            })
                          ]),
                          a("div", md, [
                            g[17] || (g[17] = a("div", null, [
                              a("h3", null, "Technical schema"),
                              a("p", null, "Inspect the complete definition, including integration keys and settings used by installed extensions.")
                            ], -1)),
                            f(s(H), {
                              label: "Open declaration",
                              severity: "secondary",
                              outlined: "",
                              onClick: g[4] || (g[4] = (O) => M("declaration"))
                            })
                          ])
                        ])
                      ]),
                      _: 1
                    })
                  ], 64)) : c.value === "Products" ? (e(), i(E, { key: 2 }, [
                    b.value === "Families" ? (e(), T(Cn, {
                      key: 0,
                      draft: N.value,
                      schema: W.value,
                      options: se.value,
                      onRemove: He,
                      onFields: ie
                    }, null, 8, ["draft", "schema", "options"])) : b.value === "Fields" ? (e(), T(pi, {
                      key: 1,
                      family: m.value,
                      "onUpdate:family": g[5] || (g[5] = (O) => m.value = O),
                      draft: N.value,
                      schema: W.value,
                      options: se.value,
                      onRemove: He
                    }, null, 8, ["family", "draft", "schema", "options"])) : (e(), T(ct, {
                      key: 2,
                      draft: N.value,
                      schema: W.value,
                      types: se.value.types
                    }, null, 8, ["draft", "schema", "types"]))
                  ], 64)) : c.value === "Values" ? (e(), i(E, { key: 3 }, [
                    b.value === "Dimensions" ? (e(), T($i, {
                      key: 0,
                      draft: N.value,
                      schema: W.value,
                      onRemove: He
                    }, null, 8, ["draft", "schema"])) : (e(), T(Ei, {
                      key: 1,
                      "catalog-id": l.catalogId,
                      draft: N.value,
                      schema: W.value,
                      onRemove: He
                    }, null, 8, ["catalog-id", "draft", "schema"]))
                  ], 64)) : c.value === "Channels" ? (e(), T(lo, {
                    key: 4,
                    "catalog-id": l.catalogId,
                    draft: N.value,
                    schema: W.value,
                    view: b.value === "Sources" ? "sources" : "channels",
                    onRemove: He
                  }, null, 8, ["catalog-id", "draft", "schema", "view"])) : c.value === "Access" ? (e(), T(Ll, {
                    key: 5,
                    "catalog-id": l.catalogId,
                    title: l.title || "Catalog",
                    access: W.value.access
                  }, null, 8, ["catalog-id", "title", "access"])) : (e(), T(Io, {
                    key: 6,
                    draft: N.value,
                    schema: W.value,
                    options: se.value,
                    "plugin-configs": K.value,
                    stale: V.value,
                    onConfigure: Oa,
                    onRemove: He,
                    onReset: sl,
                    onRefresh: g[6] || (g[6] = (O) => Be(!0)),
                    onResume: il,
                    onReview: Sa,
                    onClearShellBinding: nl
                  }, null, 8, ["draft", "schema", "options", "plugin-configs", "stale"]))
                ])),
                C.value ? (e(), T(oa, {
                  key: 1,
                  visible: A.value,
                  label: C.value === "defaults" ? "Application defaults" : "Technical schema",
                  onClose: Ra,
                  onClosed: g[9] || (g[9] = (O) => C.value = void 0)
                }, {
                  default: k(() => [
                    a("div", pd, [
                      a("header", vd, [
                        a("h2", null, $(C.value === "defaults" ? "Application defaults" : "Technical schema"), 1),
                        f(s(H), {
                          type: "button",
                          "aria-label": "Close",
                          text: "",
                          severity: "secondary",
                          onClick: Ra
                        }, {
                          default: k(() => [
                            f(s(le), {
                              icon: "tabler:x",
                              "aria-hidden": "true"
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      C.value === "defaults" ? (e(), i(E, { key: 0 }, [
                        g[18] || (g[18] = a("p", { class: "muted" }, "These settings apply across the application. Catalogs with an explicit override keep their chosen value.", -1)),
                        f(Wo, {
                          "catalog-id": l.catalogId,
                          draft: N.value,
                          disabled: !X.value,
                          "defaults-only": ""
                        }, null, 8, ["catalog-id", "draft", "disabled"]),
                        X.value ? (e(), i("div", fd, [
                          f(s(H), {
                            type: "button",
                            label: "Open application settings",
                            severity: "secondary",
                            outlined: "",
                            onClick: ol
                          })
                        ])) : h("", !0)
                      ], 64)) : (e(), T(Yo, {
                        key: 1,
                        draft: N.value,
                        readonly: !X.value,
                        onReplace: g[7] || (g[7] = (O) => N.value = O),
                        onValidity: g[8] || (g[8] = (O) => {
                          Ue.value = O, ke();
                        })
                      }, null, 8, ["draft", "readonly"]))
                    ])
                  ]),
                  _: 1
                }, 8, ["visible", "label"])) : h("", !0)
              ], 8, ld)) : h("", !0),
              f(oa, {
                class: "pim-review-dialog",
                visible: Ae.value,
                busy: u.value,
                label: "Review changes",
                onClose: ke,
                onClosed: g[11] || (g[11] = (O) => ae.value = null)
              }, {
                default: k(() => [
                  ae.value ? (e(), i("section", {
                    key: 0,
                    class: "pim-ia-dialog pim-plan",
                    "aria-labelledby": s(De)
                  }, [
                    a("header", yd, [
                      a("div", null, [
                        a("h2", {
                          id: s(De),
                          ref_key: "reviewHeading",
                          ref: ve,
                          tabindex: "-1",
                          autofocus: ""
                        }, "Review changes", 8, gd),
                        a("p", null, "Check what will happen when you apply this draft to " + $(l.title || "the catalog") + ".", 1)
                      ]),
                      f(s(H), {
                        type: "button",
                        "aria-label": "Close review",
                        disabled: u.value,
                        text: "",
                        severity: "secondary",
                        onClick: ke
                      }, {
                        default: k(() => [
                          f(s(le), {
                            icon: "tabler:x",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ]),
                    a("div", hd, [
                      a("h3", null, $(ta[ae.value.class] || "Catalog changes"), 1),
                      ae.value.class === "unchanged" ? (e(), i("p", kd, "The catalog already matches this draft.")) : ae.value.class === "initial" ? (e(), i("p", _d, "Product editors will use these settings for new products.")) : ae.value.class === "cosmetic" ? (e(), i("p", wd, "Catalog settings will update. Stored product values are kept.")) : ae.value.class === "additive" ? (e(), i("p", $d, "The new options become available. Existing product values are kept.")) : ae.value.class === "semantic" ? (e(), i("p", Cd, "Applying changes can recalculate product values or release readiness across this catalog.")) : ae.value.class === "refused" ? (e(), T(s(we), {
                        key: 5,
                        severity: "error"
                      }, {
                        default: k(() => [
                          g[19] || (g[19] = G(" These changes can’t be applied. ", -1)),
                          ae.value.migration && ae.value.refused.some((O) => W.value?.attributes[O.code]) ? (e(), i("span", xd, " To change how a field stores values, add a new field and copy the existing values into it. Then remove the original field and give the new field its name. ")) : h("", !0)
                        ]),
                        _: 1
                      })) : h("", !0)
                    ]),
                    S.value.length || Aa.value.length ? (e(), i("ul", Vd, [
                      (e(!0), i(E, null, ee(S.value, (O, te) => (e(), i("li", { key: te }, [
                        O.class === "refused" ? (e(), T(s(ge), {
                          key: 0,
                          class: "kx-tag-sm small",
                          severity: "danger"
                        }, {
                          default: k(() => [...g[20] || (g[20] = [
                            G("Blocked", -1)
                          ])]),
                          _: 1
                        })) : h("", !0),
                        O.code ? (e(), i("strong", Ud, $(el(O.code)), 1)) : h("", !0),
                        a("span", null, $(al(O.what)), 1)
                      ]))), 128)),
                      (e(!0), i(E, null, ee(Aa.value, (O) => (e(), i("li", {
                        key: O.subject + O.effect
                      }, [
                        a("strong", null, $(O.subject), 1),
                        a("span", null, $(O.effect), 1)
                      ]))), 128))
                    ])) : h("", !0),
                    va.value.length ? (e(), i("div", jd, [
                      g[21] || (g[21] = a("h3", null, "Permanent changes", -1)),
                      (e(!0), i(E, null, ee(va.value, (O) => (e(), i("p", { key: O }, $(O), 1))), 128)),
                      ae.value.class !== "refused" ? (e(), i("div", Ad, [
                        f(s(Ul), {
                          modelValue: Me.value,
                          "onUpdate:modelValue": g[10] || (g[10] = (O) => Me.value = O),
                          "input-id": s(De) + "-acknowledge",
                          binary: "",
                          disabled: u.value
                        }, null, 8, ["modelValue", "input-id", "disabled"]),
                        a("label", {
                          for: s(De) + "-acknowledge"
                        }, "I understand the effects of these removals", 8, Sd)
                      ])) : h("", !0)
                    ])) : h("", !0),
                    a("footer", Od, [
                      f(s(H), {
                        type: "button",
                        label: "Back to editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: u.value,
                        onClick: ke
                      }, null, 8, ["disabled"]),
                      W.value?.access.admin && ae.value.class !== "refused" ? (e(), T(s(H), {
                        key: 0,
                        disabled: !Oe.value || u.value || !j.value,
                        loading: u.value,
                        onClick: tl
                      }, {
                        default: k(() => [
                          G($(b.value === "Form layout" ? "Apply layout" : "Apply changes"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled", "loading"])) : h("", !0)
                    ])
                  ], 8, bd)) : h("", !0)
                ]),
                _: 1
              }, 8, ["visible", "busy"])
            ])
          ], 8, Xo)
        ])
      ])
    ], 2));
  }
}), Id = /* @__PURE__ */ de({
  __name: "SettingsApp",
  setup(l) {
    const y = vl(), t = fl(), o = J(), p = D(() => y.value.catalogId ?? ""), c = Ke();
    async function b() {
      const C = c.begin(), A = p.value;
      try {
        const L = await ce.catalogSummary(A);
        c.current(C) && (o.value = L);
      } catch {
        c.current(C) && (o.value = void 0);
      }
    }
    fe(p, () => {
      o.value = void 0, b();
    }), ra(b), Ze(() => {
      c.begin();
    });
    function m() {
      y.value.embedded ? t("open-catalog-picker", {}) : t("navigate", { route: "" });
    }
    return (C, A) => p.value ? (e(), T(Rd, {
      key: p.value,
      "catalog-id": p.value,
      title: o.value?.title || "Catalog",
      catalog: o.value,
      embedded: s(y).embedded,
      "focus-back": s(y).focusBack,
      "directory-count": s(y).directoryCount,
      onDirectoryAction: A[0] || (A[0] = (L) => s(t)("directory-action", { name: L })),
      "back-label": s(y).embedded ? "Back to catalogs" : "Back to catalog settings",
      onBack: m,
      onDirtyChanged: A[1] || (A[1] = (L) => s(t)("dirty-changed", { dirty: L }))
    }, null, 8, ["catalog-id", "title", "catalog", "embedded", "focus-back", "directory-count", "back-label"])) : h("", !0);
  }
});
class Td extends bl {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "catalog-id": { type: "string", default: "" }, embedded: { type: "boolean", default: !1 }, "directory-count": { type: "number", description: "Catalog count in the System picker." }, "focus-back": { type: "boolean", default: !1 } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: yl
    };
  }
  static get vueConfig() {
    return { rootComponent: Id, plugins: [gl] };
  }
}
Sl(import.meta.url, Td);
