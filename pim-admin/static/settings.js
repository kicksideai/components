import { c as rl, u as ra, r as Ke, e as Na, d as ul, a as ua, p as ce, b as Ee, f as Re, _ as oa, g as cl, S as ml, h as pl, i as vl, W as fl, s as bl, P as yl } from "./styles-BuUaWhkj.js";
import { defineComponent as de, computed as N, openBlock as e, createBlock as I, resolveDynamicComponent as Da, normalizeProps as gl, guardReactiveProps as hl, createSlots as ge, withCtx as k, createElementVNode as a, normalizeClass as Ue, createElementBlock as i, Fragment as L, renderList as ee, toDisplayString as _, createCommentVNode as b, unref as s, renderSlot as Ve, ref as J, onUnmounted as Ze, createVNode as f, createStaticVNode as kl, createTextVNode as H, withModifiers as Ie, normalizeStyle as ba, useId as Ne, watch as fe, withKeys as aa, nextTick as Ge, provide as _l, inject as wl, useModel as za, Transition as $l, mergeModels as ya, toRaw as Cl, onMounted as Ba, mergeProps as xl } from "vue";
import { Icon as le } from "@iconify/vue";
import ye from "primevue/tag";
import W from "primevue/button";
import Vl from "primevue/checkbox";
import $e from "primevue/message";
import { api as Ul, on as La, host as Je, loadByTagName as Al, define as jl } from "@wippy-fe/proxy";
import _a from "primevue/selectbutton";
import Ye from "primevue/inputtext";
import Fa from "primevue/multiselect";
import la from "primevue/toggleswitch";
import we from "primevue/select";
import Sl from "primevue/inputnumber";
import Ol from "primevue/textarea";
const Rl = ["aria-label"], Il = {
  key: 0,
  class: "kx-settings-rail-group"
}, Tl = ["aria-current", "onClick"], Pl = { class: "kx-settings-rail-label" }, ql = /* @__PURE__ */ de({
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
    const y = l, t = N(() => y.leadingItem ? [{ items: [y.leadingItem] }, ...y.groups] : y.groups);
    function d(v) {
      const m = [...v.currentTarget.querySelectorAll(".kx-settings-rail-item")], g = m.indexOf(v.target);
      if (g < 0) return;
      let p;
      switch (v.key) {
        case "ArrowDown":
        case "ArrowRight":
          p = (g + 1) % m.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          p = (g + m.length - 1) % m.length;
          break;
        case "Home":
          p = 0;
          break;
        case "End":
          p = m.length - 1;
          break;
        default:
          return;
      }
      v.preventDefault(), m[p]?.focus();
    }
    return (v, m) => (e(), I(Da(l.title ? rl : "div"), gl(hl(l.title ? { title: l.title, count: l.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), ge({
      default: k(() => [
        a("nav", {
          class: Ue(["kx-settings-rail", { "kx-settings-rail-framed": l.title }]),
          "aria-label": l.label,
          onKeydown: d
        }, [
          (e(!0), i(L, null, ee(t.value, (g, p) => (e(), i("div", {
            key: g.items[0]?.value ?? p,
            class: Ue(["kx-settings-rail-section", { "kx-settings-rail-leading": l.leadingItem && p === 0 }])
          }, [
            g.heading ? (e(), i("div", Il, _(g.heading), 1)) : b("", !0),
            (e(!0), i(L, null, ee(g.items, (C) => (e(), i("button", {
              key: C.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": C.value === l.value ? "true" : void 0,
              onClick: (O) => v.$emit("update:value", C.value)
            }, [
              C.icon ? (e(), I(s(le), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: C.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : b("", !0),
              a("span", Pl, _(C.label), 1)
            ], 8, Tl))), 128))
          ], 2))), 128))
        ], 42, Rl)
      ]),
      _: 2
    }, [
      l.title && v.$slots.actions ? {
        name: "actions",
        fn: k(() => [
          Ve(v.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Nl = { class: "pim-stack" }, Dl = { class: "form pim-card-body pad pim-ia-action" }, zl = ["config"], Bl = /* @__PURE__ */ de({
  __name: "CatalogShare",
  props: {
    catalogId: {},
    title: {},
    access: {}
  },
  setup(l) {
    const y = l, t = J(!1), d = J(!1), v = J(""), m = J(), g = J(!1), p = Ke(), C = N(() => "/api/v1/component-access/grants/" + encodeURIComponent(y.catalogId)), O = N(() => JSON.stringify({
      resource_id: y.catalogId,
      title: y.title,
      access_url: C.value,
      share_url: "/api/v1/component-access/share/" + encodeURIComponent(y.catalogId)
    })), K = N(() => {
      if (!y.access.admin) return "Only catalog administrators can manage sharing.";
      if (!m.value) return g.value ? "Member counts are unavailable." : "Loading members…";
      const { people: x, groups: c } = m.value;
      return x + (x === 1 ? " person" : " people") + " and " + c + (c === 1 ? " group" : " groups") + " with direct access";
    });
    async function Z() {
      if (!y.access.admin) return;
      const x = p.begin();
      g.value = !1;
      try {
        const { data: c } = await Ul.get(C.value);
        if (!p.current(x)) return;
        if (!c?.success || !Array.isArray(c.access)) throw new Error("Grants unavailable");
        const w = c.access.filter((r) => r.subject_type === "group").length;
        m.value = { people: c.access.length - w, groups: w };
      } catch {
        p.current(x) && (m.value = void 0, g.value = !0);
      }
    }
    ra(Z), Ze(() => {
      p.begin();
    });
    async function E() {
      d.value = !0, v.value = "", await Na("kickside-share") ? t.value = !0 : v.value = "Could not open sharing. Try again.", d.value = !1;
    }
    return (x, c) => (e(), i("div", Nl, [
      a("section", Dl, [
        a("div", null, [
          c[1] || (c[1] = a("h3", null, "Members and sharing", -1)),
          a("p", null, _(K.value), 1)
        ]),
        l.access.admin ? (e(), I(s(W), {
          key: 0,
          type: "button",
          label: "Share catalog",
          loading: d.value,
          onClick: E
        }, {
          icon: k(() => [
            f(s(le), {
              icon: "tabler:share",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : b("", !0),
        g.value ? (e(), I(s(W), {
          key: 1,
          type: "button",
          label: "Reload member counts",
          severity: "secondary",
          text: "",
          onClick: Z
        })) : b("", !0)
      ]),
      c[2] || (c[2] = kl('<section class="form pim-card-body pad pim-stack" aria-labelledby="pim-access-roles-heading"><h3 id="pim-access-roles-heading">What members can do</h3><dl class="pim-access-roles"><div><dt>Read</dt><dd>View products and their details.</dd></div><div><dt>Write</dt><dd>Create products and update their values.</dd></div><div><dt>Delete</dt><dd>Move products to trash.</dd></div><div><dt>Admin</dt><dd>Manage catalog settings and who has access.</dd></div></dl></section>', 1)),
      t.value ? (e(), i("kickside-share", {
        key: 0,
        config: O.value,
        onClose: c[0] || (c[0] = (w) => t.value = !1),
        onChanged: Z
      }, null, 40, zl)) : b("", !0),
      v.value ? (e(), I(s($e), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: k(() => [
          H(_(v.value), 1)
        ]),
        _: 1
      })) : b("", !0)
    ]));
  }
});
function Ll(l, y, t = {}) {
  const d = JSON.stringify(l), v = JSON.stringify(t);
  return {
    declaration: JSON.parse(d),
    generation: y,
    pluginConfigs: JSON.parse(v),
    matches: (m, g, p = {}) => y === g && d === JSON.stringify(m) && v === JSON.stringify(p)
  };
}
function Ta(l, y) {
  const t = {};
  for (const [d, v] of Object.entries(y)) {
    const m = v.filter((g) => d === "plugins" ? !l.plugins?.some((p) => p.use === g) : d === "scopes" ? !l.scopes?.includes(g) : d === "attributes" ? !l.aspects?.some((p) => p.attributes?.some((C) => p.namespace + "." + C.code === g)) : d === "aspects" ? !l.aspects?.some((p) => p.namespace === g) : d === "dimensions" ? !l.dimensions?.some((p) => p.name === g) : d === "vocabularies" || d === "families" ? !l[d]?.some((p) => p.code === g) : !l[d]?.some((p) => p.id === g));
    m.length && (t[d] = m);
  }
  return t;
}
const Pa = (l) => !!l && typeof l == "object" && !Array.isArray(l), ne = ["string"], Ea = { "*": "string" }, Fl = { id: "number", code: "string!", type: "string!", scope: ne, cardinality: "string", index: "string", index_contexts: [Ea], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, El = {
  dimensions: [{ name: "string!", members: ne, fallback: { "*": ne } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: ne }, attributes: [Fl] }],
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
    const d = y.replace("!", "");
    if (!(d === "json" || (d === "object" ? Pa(l) : d === "policy" ? l === !1 || typeof l == "string" || typeof l == "number" : typeof l === d)) || y.endsWith("!") && (typeof l != "string" || !l.trim())) throw new Error(`${t} has an invalid ${d} value.`);
  } else if (Array.isArray(y)) {
    if (!Array.isArray(l)) throw new Error(`${t} must be an array.`);
    l.forEach((d, v) => ga(d, y[0], `${t}[${v}]`));
  } else {
    if (!Pa(l)) throw new Error(`${t} must be an object.`);
    for (const [d, v] of Object.entries(y)) if (typeof v == "string" && v.endsWith("!") && l[d] === void 0) throw new Error(`${t}.${d} is required.`);
    for (const [d, v] of Object.entries(l)) {
      const m = y[d] ?? y["*"];
      if (!m) throw new Error(`${t}.${d} is not an editor field.`);
      ga(v, m, `${t}.${d}`);
    }
  }
}
function Ml(l) {
  const y = JSON.parse(l);
  ga(y, El, "Declaration");
  const t = y;
  for (const d of t.dimensions ?? []) d.members ??= [];
  return t;
}
function Xe(l) {
  return JSON.parse(JSON.stringify(l));
}
const qa = /^[a-z][a-z0-9_]*$/;
function Wl(l) {
  return l.trim().normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function Fe(l, y, t) {
  t.length ? l[y] = t : delete l[y];
}
function ia(l, y, t) {
  if (t < 0 || t >= l.length || y === t) return;
  const [d] = l.splice(y, 1);
  l.splice(t, 0, d);
}
function oe(l, y) {
  return !l || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(l) ? y : l;
}
function ea(l) {
  return l ? oe(l.title, "Field type") : "Unknown type";
}
async function Ma(l, y) {
  const t = [...new Set(y)].map((v) => ({ type: "user", id: v }));
  if (!t.length) return {};
  const d = await ul(`/api/v1/pim-admin/catalogs/${encodeURIComponent(l)}/principal_labels`, { refs: t }, "People");
  return Object.fromEntries((d.principals ?? []).map((v) => [v.id, oe(v.label, "Person")]));
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
const Hl = (l) => new Date(l).toLocaleString();
function ka(l) {
  const y = Math.abs(l.m).toString(), t = l.m < 0 ? "-" : "";
  if (l.e >= 0) return t + y + "0".repeat(l.e);
  const d = -l.e, v = y.padStart(d + 1, "0");
  return t + v.slice(0, v.length - d) + "." + v.slice(v.length - d);
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
  const t = (d) => {
    if (d == null) return "";
    if (typeof d == "object" && "ref" in d) {
      const v = d;
      if (v.ref[0] === "term") {
        const m = v.ref[1].slice(v.ref[1].indexOf(":") + 1), g = v.ref[1].slice(0, v.ref[1].indexOf(":")), p = y?.[g]?.find((C) => C.code === m);
        return p ? Le(p) : m;
      }
      return "Linked " + B(v.ref[0]).toLocaleLowerCase();
    }
    if (typeof d == "object" && "v" in d) {
      const v = d;
      return ka(v.v) + " " + v.u;
    }
    return typeof d == "object" && "m" in d ? ka(d) : typeof d == "boolean" ? d ? "Yes" : "No" : typeof d == "object" ? JSON.stringify(d) : oe(String(d), "Linked record");
  };
  return Array.isArray(l) ? l.map(t).join(", ") : t(l);
}
function Jl(l, y, t) {
  const d = da(y), v = da(t);
  return !v && d ? `${l} cleared (was ${d})` : d ? `${l}: ${d} → ${v}` : `${l} set to ${v}`;
}
const Kl = { class: "pim-table form pim-layout" }, Gl = {
  key: 0,
  class: "pim-layout-help muted"
}, Yl = {
  key: 1,
  class: "kx-empty"
}, Zl = { class: "pim-aspect-head" }, Ql = {
  key: 0,
  class: "muted small"
}, Xl = ["draggable", "onDragstart", "onDragover", "onDrop"], et = { class: "pim-lcard-top" }, at = {
  key: 0,
  class: "pim-grip",
  "aria-hidden": "true"
}, lt = { class: "pim-lcard-name" }, tt = { class: "pim-lcard-type" }, st = {
  key: 1,
  class: "pim-lcard-move"
}, it = { class: "pim-aspect-head" }, nt = { class: "pim-canvas" }, ot = { class: "pim-lcard-top" }, dt = { class: "pim-lcard-name" }, rt = { class: "pim-lcard-type" }, ut = /* @__PURE__ */ de({
  __name: "LayoutEditor",
  props: {
    draft: {},
    schema: {},
    types: {}
  },
  setup(l) {
    const y = l, t = N(() => y.schema.access.admin), d = N(() => y.draft?.aspects ?? []), v = N(() => new Map(y.types.map((x) => [x.id, ea(x)]))), m = N(() => {
      if (!y.schema) return [];
      const x = new Set((y.draft?.aspects ?? []).map((w) => w.namespace)), c = /* @__PURE__ */ new Map();
      for (const [w, r] of Object.entries(y.schema.attributes)) {
        const A = w.split(".")[0];
        x.has(A) || !r.plugin || (c.has(A) || c.set(A, { aspect: A, plugin: r.plugin, codes: [] }), c.get(A).codes.push(w));
      }
      return [...c.values()];
    });
    function g(x, c) {
      return na.find((w) => w.value === ha(y.schema, x, c))?.span ?? 6;
    }
    const p = J(null), C = J(null);
    function O(x, c, w) {
      t.value && (p.value = { ns: x, index: c }, w.dataTransfer?.setData("text/plain", x + ":" + c), w.dataTransfer && (w.dataTransfer.effectAllowed = "move"));
    }
    function K(x, c, w) {
      !p.value || p.value.ns !== x || (w.preventDefault(), C.value = { ns: x, index: c });
    }
    function Z(x, c) {
      t.value && p.value?.ns === x.namespace && ia(x.attributes ?? [], p.value.index, c), p.value = null, C.value = null;
    }
    function E() {
      p.value = null, C.value = null;
    }
    return (x, c) => (e(), i("div", Kl, [
      t.value ? (e(), i("p", Gl, "Arrange fields within each group and choose their widths. Review changes before applying the layout.")) : b("", !0),
      d.value.length === 0 ? (e(), i("div", Yl, [
        c[1] || (c[1] = H("This catalog has no field groups yet.", -1)),
        t.value ? (e(), i(L, { key: 0 }, [
          H(" Add a field group in Fields.")
        ], 64)) : b("", !0)
      ])) : b("", !0),
      (e(!0), i(L, null, ee(d.value, (w) => (e(), i("section", {
        key: w.namespace,
        class: "pim-aspect"
      }, [
        a("header", Zl, [
          a("h3", null, _(s(B)(w.namespace)), 1),
          t.value ? (e(), i("span", Ql, "drag a field, or use its arrows")) : b("", !0)
        ]),
        a("div", {
          class: "pim-canvas",
          onDragover: c[0] || (c[0] = Ie(() => {
          }, ["prevent"]))
        }, [
          (e(!0), i(L, null, ee(w.attributes ?? [], (r, A) => (e(), i("div", {
            key: r.code,
            class: Ue(["pim-lcard", { dragging: p.value?.ns === w.namespace && p.value?.index === A, over: C.value?.ns === w.namespace && C.value?.index === A }]),
            style: ba({ gridColumn: "span " + g(w.namespace, r) }),
            draggable: t.value,
            onDragstart: (T) => O(w.namespace, A, T),
            onDragover: (T) => K(w.namespace, A, T),
            onDrop: Ie((T) => Z(w, A), ["prevent"]),
            onDragend: E
          }, [
            a("div", et, [
              t.value ? (e(), i("span", at, [
                f(s(le), { icon: "tabler:grip-vertical" })
              ])) : b("", !0),
              a("span", lt, _(s(B)(r.code)), 1),
              a("span", tt, _(v.value.get(r.type) ?? s(ea)(void 0)), 1),
              t.value ? (e(), i("span", st, [
                f(s(W), {
                  type: "button",
                  disabled: A === 0,
                  "aria-label": "Move " + s(B)(r.code) + " earlier",
                  onClick: (T) => s(ia)(w.attributes ?? [], A, A - 1),
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
                f(s(W), {
                  type: "button",
                  disabled: A === (w.attributes ?? []).length - 1,
                  "aria-label": "Move " + s(B)(r.code) + " later",
                  onClick: (T) => s(ia)(w.attributes ?? [], A, A + 1),
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
              ])) : b("", !0)
            ]),
            f(s(_a), {
              disabled: !t.value,
              "model-value": s(ha)(l.schema, w.namespace, r),
              options: s(na),
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Width of " + s(B)(r.code),
              "onUpdate:modelValue": (T) => r.width = T
            }, null, 8, ["disabled", "model-value", "options", "aria-label", "onUpdate:modelValue"])
          ], 46, Xl))), 128))
        ], 32)
      ]))), 128)),
      (e(!0), i(L, null, ee(m.value, (w) => (e(), i("section", {
        key: w.aspect,
        class: "pim-aspect"
      }, [
        a("header", it, [
          a("h3", null, _(s(B)(w.aspect)), 1),
          c[2] || (c[2] = a("span", { class: "muted small" }, "Provided by a plugin", -1))
        ]),
        a("div", nt, [
          (e(!0), i(L, null, ee(w.codes, (r) => (e(), i("div", {
            key: r,
            class: "pim-lcard fixed",
            style: ba({ gridColumn: "span " + (s(na).find((A) => A.value === l.schema.attributes[r].width)?.span ?? 6) })
          }, [
            a("div", ot, [
              a("span", dt, _(s(B)(r)), 1),
              a("span", rt, _(v.value.get(l.schema.attributes[r].type) ?? s(ea)(void 0)), 1)
            ])
          ], 4))), 128))
        ])
      ]))), 128))
    ]));
  }
}), ct = {
  class: "pim-history",
  "aria-label": "Catalog history"
}, mt = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, pt = { class: "pim-table pim-responsive-table" }, vt = ["id"], ft = ["aria-labelledby"], bt = {
  key: 0,
  scope: "col"
}, yt = { class: "muted small" }, gt = ["datetime"], ht = {
  key: 0,
  class: "small"
}, kt = {
  key: 0,
  class: "muted"
}, _t = { class: "mono small" }, wt = {
  key: 0,
  class: "muted"
}, $t = {
  key: 0,
  class: "muted small"
}, Ct = ["aria-labelledby"], xt = { class: "pim-stacked-meta muted small" }, Vt = { key: 0 }, Ut = { key: 1 }, At = ["datetime"], jt = {
  key: 1,
  class: "kx-empty"
}, St = { class: "pim-table-foot" }, Ot = /* @__PURE__ */ de({
  __name: "HistoryPanel",
  props: {
    catalogId: {},
    canResolveActors: { type: Boolean }
  },
  setup(l) {
    const y = l, t = J([]), d = J({}), v = J(), m = J(!1), g = J(), p = Ke(), C = Ne(), O = N(() => t.value.map((c) => ({
      key: `${c.seq}:${c.n}`,
      at: c.at,
      date: Hl(c.at),
      actor: d.value[c.actor] ?? oe(c.actor, "Person"),
      source: c.source ? oe(B(c.source), "Data source") : "",
      product: Z(c),
      context: c.ctx ? oe(c.ctx, "Product context") : "",
      change: E(c)
    })));
    async function K(c = !1) {
      const w = p.begin();
      m.value = !0, g.value = void 0;
      try {
        const r = await ce.history(y.catalogId, { limit: 50, before: c ? v.value : void 0 });
        if (!p.current(w)) return;
        if (t.value = c ? [...t.value, ...r.entries] : r.entries, v.value = r.next, y.canResolveActors)
          try {
            const A = await Ma(y.catalogId, r.entries.map((T) => T.actor));
            p.current(w) && (d.value = { ...d.value, ...A });
          } catch {
          }
      } catch (r) {
        if (!p.current(w)) return;
        g.value = Ee(r, "Could not load the history.");
      } finally {
        p.current(w) && (m.value = !1);
      }
    }
    function Z(c) {
      return c.sku ? c.sku : c.subject.startsWith("p:") ? "purged product" : c.subject.startsWith("t:") ? c.subject.slice(2) : c.subject.startsWith("r:") ? "Release" : oe(c.subject, "Catalog");
    }
    function E(c) {
      if (c.attribute)
        return Jl(B(c.attribute), c.before, c.after);
      switch (c.kind) {
        case "schema":
          return "Catalog settings applied";
        case "term": {
          const w = c.after ?? {}, r = w.labels?.en ?? Object.values(w.labels ?? {})[0];
          return w.retired ? "Term retired" : r ? `Term labelled "${r}"` + (w.parent ? ` under ${w.parent}` : "") : "Term changed";
        }
        case "created": {
          const w = c.after ?? {};
          return `Created as ${B(w.family ?? "product")}` + (w.level ? ` at level ${w.level}` : "");
        }
        case "released": {
          const w = c.after ?? {};
          return `Released v${w.version ?? ""} to ${(w.channels ?? []).join(", ")}`;
        }
        case "withdrawn":
          return `Withdrawn from ${((c.after ?? {}).channels ?? []).join(", ")}`;
        case "status":
          return `Status ${String(c.before ?? "")} → ${String(c.after ?? "")}`;
        case "moved":
          return "Moved under another parent";
        default:
          return B(c.kind);
      }
    }
    let x = () => {
    };
    return fe(() => y.catalogId, () => {
      x(), p.begin(), t.value = [], d.value = {}, v.value = void 0, g.value = void 0, x = La(`component.${y.catalogId}`, () => {
        K();
      });
    }, { immediate: !0 }), fe(() => y.catalogId, () => {
      K();
    }), ra(() => K()), Ze(() => {
      x(), p.begin();
    }), (c, w) => (e(), i("section", ct, [
      g.value ? (e(), I(ua, {
        key: 0,
        error: g.value
      }, {
        default: k(() => [
          f(s(W), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: w[0] || (w[0] = (r) => K())
          }, {
            default: k(() => [...w[2] || (w[2] = [
              H("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : b("", !0),
      m.value ? (e(), i("div", mt, "Loading history…")) : b("", !0),
      a("div", pt, [
        a("p", {
          id: s(C),
          class: "pim-history-caption muted small"
        }, "Catalog changes, newest first", 8, vt),
        O.value.length ? (e(), i(L, { key: 0 }, [
          a("table", {
            class: "pim-grid",
            "aria-labelledby": s(C)
          }, [
            a("thead", null, [
              a("tr", null, [
                w[3] || (w[3] = a("th", { scope: "col" }, "When", -1)),
                l.canResolveActors ? (e(), i("th", bt, "Who")) : b("", !0),
                w[4] || (w[4] = a("th", { scope: "col" }, "What", -1)),
                w[5] || (w[5] = a("th", { scope: "col" }, "Change", -1))
              ])
            ]),
            a("tbody", null, [
              (e(!0), i(L, null, ee(O.value, (r) => (e(), i("tr", {
                key: r.key
              }, [
                a("td", yt, [
                  a("time", {
                    datetime: r.at
                  }, _(r.date), 9, gt)
                ]),
                l.canResolveActors ? (e(), i("td", ht, [
                  H(_(r.actor), 1),
                  r.source ? (e(), i("span", kt, " via " + _(r.source), 1)) : b("", !0)
                ])) : b("", !0),
                a("td", _t, [
                  H(_(r.product), 1),
                  r.context ? (e(), i("span", wt, " · " + _(r.context), 1)) : b("", !0)
                ]),
                a("td", null, [
                  H(_(r.change), 1),
                  !l.canResolveActors && r.source ? (e(), i("span", $t, " via " + _(r.source), 1)) : b("", !0)
                ])
              ]))), 128))
            ])
          ], 8, ft),
          a("ol", {
            role: "list",
            class: "pim-stacked-list",
            "aria-labelledby": s(C)
          }, [
            (e(!0), i(L, null, ee(O.value, (r) => (e(), i("li", {
              key: r.key,
              class: "pim-stacked-row"
            }, [
              a("div", null, _(r.change), 1),
              a("div", xt, [
                l.canResolveActors ? (e(), i("span", Vt, [
                  a("span", null, _(r.actor), 1),
                  r.source ? (e(), i(L, { key: 0 }, [
                    H(" via " + _(r.source), 1)
                  ], 64)) : b("", !0)
                ])) : r.source ? (e(), i("span", Ut, "Via " + _(r.source), 1)) : b("", !0),
                a("time", {
                  datetime: r.at
                }, _(r.date), 9, At),
                a("span", null, [
                  H(_(r.product), 1),
                  r.context ? (e(), i(L, { key: 0 }, [
                    H(" · " + _(r.context), 1)
                  ], 64)) : b("", !0)
                ])
              ])
            ]))), 128))
          ], 8, Ct)
        ], 64)) : !m.value && !g.value ? (e(), i("div", jt, "Nothing recorded yet.")) : b("", !0),
        a("div", St, [
          a("span", null, _(O.value.length) + " change" + _(O.value.length === 1 ? "" : "s") + " shown", 1),
          v.value ? (e(), I(s(W), {
            key: 0,
            type: "button",
            disabled: m.value,
            onClick: w[1] || (w[1] = (r) => K(!0)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: k(() => [
              f(s(le), {
                icon: "tabler:adjustments",
                "aria-hidden": "true"
              }),
              w[6] || (w[6] = H(" Load older", -1))
            ]),
            _: 1
          }, 8, ["disabled"])) : b("", !0)
        ])
      ])
    ]));
  }
}), Rt = { class: "system-section-head" }, It = { class: "system-section-head-text" }, Tt = {
  key: 0,
  class: "kx-head-actions"
}, Pt = /* @__PURE__ */ de({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(l) {
    return (y, t) => (e(), i("header", Rt, [
      a("div", It, [
        a("h1", null, _(l.title), 1),
        a("p", null, _(l.description), 1)
      ]),
      y.$slots.actions ? (e(), i("div", Tt, [
        Ve(y.$slots, "actions")
      ])) : b("", !0)
    ]));
  }
}), qt = /* @__PURE__ */ de({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(l) {
    return (y, t) => (e(), i(L, null, [
      f(s(ye), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      f(s(W), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: l.busy || l.discardDisabled,
        onClick: t[0] || (t[0] = (d) => y.$emit("discard"))
      }, {
        icon: k(() => [
          f(s(le), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      f(s(W), {
        label: "Review changes",
        type: "button",
        disabled: l.busy || l.reviewDisabled,
        loading: l.busy,
        onClick: t[1] || (t[1] = (d) => y.$emit("review", d.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), Nt = ["onKeydown"], Dt = ["id"], Te = /* @__PURE__ */ de({
  __name: "AddSchemaCode",
  props: {
    label: {},
    action: {},
    existing: {},
    fromName: { type: Boolean }
  },
  emits: ["add"],
  setup(l, { emit: y }) {
    const t = l, d = y, v = J(""), m = J(!1), g = J(), p = Ne(), C = N(() => {
      const c = v.value.trim();
      return t.fromName ? Wl(c) : c;
    }), O = N(() => v.value.trim() ? t.existing?.includes(C.value) ? t.fromName ? "This name is already in use." : "This code is already in use." : t.fromName && !qa.test(C.value) ? "Use a name that starts with a letter from A to Z." : qa.test(C.value) ? "" : "Start with a lowercase letter and use only lowercase letters, numbers or underscores." : ""), K = N(() => !!C.value && !O.value);
    async function Z() {
      m.value = !0, await Ge(), g.value?.querySelector("input")?.focus();
    }
    async function E() {
      m.value = !1, v.value = "", await Ge(), g.value?.querySelector("button")?.focus();
    }
    function x() {
      K.value && (d("add", C.value), E());
    }
    return (c, w) => (e(), i("div", {
      ref_key: "row",
      ref: g,
      class: "row pim-add-row"
    }, [
      m.value ? (e(), i("div", {
        key: 1,
        class: "row pim-add-editor",
        onKeydown: aa(Ie(E, ["stop", "prevent"]), ["esc"])
      }, [
        f(s(Ye), {
          modelValue: v.value,
          "onUpdate:modelValue": w[0] || (w[0] = (r) => v.value = r),
          type: "text",
          placeholder: l.label,
          "aria-label": l.label,
          invalid: !!O.value,
          "aria-describedby": O.value ? s(p) : void 0,
          class: Ue({ mono: !l.fromName }),
          onKeydown: aa(Ie(x, ["prevent"]), ["enter"])
        }, null, 8, ["modelValue", "placeholder", "aria-label", "invalid", "aria-describedby", "class", "onKeydown"]),
        f(s(W), {
          type: "button",
          disabled: !K.value,
          size: "small",
          onClick: x
        }, {
          default: k(() => [
            H(_(l.action), 1)
          ]),
          _: 1
        }, 8, ["disabled"]),
        f(s(W), {
          type: "button",
          label: "Cancel",
          text: "",
          severity: "secondary",
          size: "small",
          onClick: E
        }),
        O.value ? (e(), i("p", {
          key: 0,
          id: s(p),
          role: "status",
          class: "pim-add-code-error small"
        }, _(O.value), 9, Dt)) : b("", !0)
      ], 40, Nt)) : (e(), I(s(W), {
        key: 0,
        type: "button",
        "aria-expanded": "false",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: Z
      }, {
        default: k(() => [
          f(s(le), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          H(" " + _(l.action), 1)
        ]),
        _: 1
      })),
      Ve(c.$slots, "default")
    ], 512));
  }
}), Wa = Symbol("definitionColumns"), zt = { code: "Code", kind: "Kind", details: "Details", usage: "Used by" }, Bt = {
  code: "minmax(120px, 1fr)",
  kind: "140px",
  details: "minmax(120px, 1.2fr)",
  usage: "120px"
}, Lt = {
  class: "pim-definition-scroll",
  tabindex: "0",
  "aria-label": "Definitions"
}, Ft = { class: "pim-definition-grid" }, Et = {
  key: 0,
  class: "pim-definition-columns",
  "aria-hidden": "true"
}, Mt = { class: "pim-definition-actions-heading" }, Pe = /* @__PURE__ */ de({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: { default: () => ["code"] },
    showActions: { type: Boolean }
  },
  setup(l) {
    const y = l;
    _l(Wa, N(() => y.columns));
    const t = N(() => ["48px", "minmax(160px, 1.4fr)", ...y.columns.map((d) => Bt[d]), y.showActions ? "100px" : "80px"].join(" "));
    return (d, v) => (e(), i("section", {
      class: "form pim-definition-list",
      style: ba({ "--pim-definition-columns": t.value })
    }, [
      Ve(d.$slots, "head"),
      a("div", Lt, [
        a("div", Ft, [
          l.count > 3 ? (e(), i("div", Et, [
            v[0] || (v[0] = a("span", null, null, -1)),
            v[1] || (v[1] = a("span", null, "Name", -1)),
            (e(!0), i(L, null, ee(l.columns, (m) => (e(), i("span", {
              key: m,
              class: Ue("pim-definition-" + m)
            }, _(s(zt)[m]), 3))), 128)),
            a("span", Mt, _(l.showActions ? "Actions" : ""), 1)
          ])) : b("", !0),
          Ve(d.$slots, "default")
        ])
      ]),
      Ve(d.$slots, "add")
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
      Ve(y.$slots, "default")
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
    const y = l, t = wl(Wa, N(() => [
      ...y.code ? ["code"] : [],
      ...y.kind ? ["kind"] : []
    ])), d = za(l, "open"), v = Ne();
    return (m, g) => (e(), i("section", Jt, [
      a("header", {
        class: Ue(["pim-definition-head", l.headClass])
      }, [
        f(Ht, {
          class: Ue(["pim-definition-toggle", l.toggleClass]),
          "aria-expanded": d.value,
          "aria-controls": d.value ? s(v) : void 0,
          onClick: g[0] || (g[0] = (p) => d.value = !d.value)
        }, {
          default: k(() => [
            a("span", Kt, [
              f(s(le), {
                icon: "tabler:chevron-right",
                class: "pim-definition-chevron",
                "aria-hidden": "true"
              })
            ]),
            a("span", Gt, _(l.title), 1),
            a("span", Yt, [
              (e(!0), i(L, null, ee(s(t), (p) => (e(), i("span", {
                key: p,
                class: Ue("pim-definition-" + p),
                "data-column": p
              }, [
                p === "code" && l.code ? (e(), i("code", Qt, _(l.code), 1)) : p === "kind" && l.kind ? (e(), I(s(ye), {
                  key: 1,
                  severity: "secondary",
                  value: l.kind
                }, null, 8, ["value"])) : p === "details" ? Ve(m.$slots, "details", {}, void 0, void 0, 2) : p === "usage" ? Ve(m.$slots, "usage", {}, () => [
                  H(_(l.usage), 1)
                ], void 0, 3) : b("", !0)
              ], 10, Zt))), 128))
            ])
          ]),
          _: 3
        }, 8, ["class", "aria-expanded", "aria-controls"]),
        a("div", Xt, [
          Ve(m.$slots, "actions")
        ])
      ], 2),
      f($l, { name: "pim-expand" }, {
        default: k(() => [
          d.value ? (e(), i("div", {
            key: 0,
            id: s(v),
            class: "pim-definition-body"
          }, [
            Ve(m.$slots, "default")
          ], 8, es)) : b("", !0)
        ]),
        _: 3
      })
    ]));
  }
}), as = { class: "pim-chips pim-picker-chips" }, ls = {
  key: 0,
  class: "muted"
}, ts = {
  key: 0,
  class: "muted small"
}, ss = {
  key: 0,
  class: "muted"
}, is = {
  key: 0,
  class: "muted"
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
    const t = l, d = y, v = J("");
    function m(Z) {
      return t.modelValue.includes(Z);
    }
    function g(Z) {
      t.disabled || !Z || d("update:modelValue", m(Z) ? t.modelValue.filter((E) => E !== Z) : [...t.modelValue, Z]);
    }
    function p() {
      const Z = v.value.trim();
      if (!Z || m(Z)) {
        v.value = "";
        return;
      }
      d("update:modelValue", [...t.modelValue, Z]), v.value = "";
    }
    function C(Z) {
      d("update:modelValue", t.modelValue.filter((E) => E !== Z));
    }
    const O = N(() => t.modelValue.map((Z) => t.options?.find((E) => E.value === Z) ?? { value: Z }));
    function K(Z) {
      const E = Z.label ?? Z.value;
      return Z.detail ? E + " " + Z.detail : E;
    }
    return (Z, E) => (e(), i("div", as, [
      l.disabled ? (e(), i(L, { key: 0 }, [
        (e(!0), i(L, null, ee(O.value, (x) => (e(), i("span", {
          key: x.value
        }, [
          H(_(x.label ?? x.value) + " ", 1),
          x.detail ? (e(), i("small", ls, _(x.detail), 1)) : b("", !0)
        ]))), 128)),
        l.modelValue.length ? b("", !0) : (e(), i("span", ts, "None"))
      ], 64)) : l.options && (l.dropdown || l.options.length > 10) ? (e(), i(L, { key: 1 }, [
        (e(!0), i(L, null, ee(O.value, (x) => (e(), i("span", {
          key: x.value,
          class: "row"
        }, [
          a("span", null, [
            H(_(x.label ?? x.value) + " ", 1),
            x.detail ? (e(), i("small", ss, _(x.detail), 1)) : b("", !0)
          ]),
          f(s(W), {
            type: "button",
            "aria-label": "Remove " + K(x),
            onClick: (c) => C(x.value),
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
          }, 8, ["aria-label", "onClick"])
        ]))), 128)),
        l.disabled ? b("", !0) : (e(), I(s(we), {
          key: 0,
          "model-value": null,
          placeholder: l.placeholder ?? "Add…",
          "aria-labelledby": l.labelledby,
          "aria-label": l.placeholder ?? "Add",
          "onUpdate:modelValue": E[0] || (E[0] = (x) => g(x)),
          class: "pim-chip-entry",
          options: l.options.filter((x) => !m(x.value)),
          "option-label": K,
          "option-value": "value",
          appendTo: "self"
        }, {
          option: k(({ option: x }) => [
            a("span", null, [
              H(_(x.label ?? x.value) + " ", 1),
              x.detail ? (e(), i("small", is, _(x.detail), 1)) : b("", !0)
            ])
          ]),
          _: 1
        }, 8, ["placeholder", "aria-labelledby", "aria-label", "options"]))
      ], 64)) : l.options ? (e(), i(L, { key: 2 }, [
        f(s(_a), {
          "model-value": l.modelValue.filter((x) => l.options.some((c) => c.value === x)),
          options: l.options.map((x) => ({ value: x.value, label: x.label ?? x.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          disabled: l.disabled,
          "aria-labelledby": l.labelledby,
          "aria-label": l.placeholder ?? "Selected values",
          "onUpdate:modelValue": E[1] || (E[1] = (x) => d("update:modelValue", [...x, ...l.modelValue.filter((c) => !l.options.some((w) => w.value === c))]))
        }, null, 8, ["model-value", "options", "disabled", "aria-labelledby", "aria-label"]),
        (e(!0), i(L, null, ee(l.modelValue.filter((x) => !l.options.some((c) => c.value === x)), (x) => (e(), i("span", {
          key: x,
          class: "row"
        }, [
          H(_(x), 1),
          f(s(W), {
            type: "button",
            "aria-label": "Remove " + x,
            onClick: (c) => C(x),
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
      ], 64)) : (e(!0), i(L, { key: 3 }, ee(l.modelValue, (x) => (e(), i("span", {
        key: x,
        class: "row"
      }, [
        H(_(x), 1),
        f(s(W), {
          type: "button",
          "aria-label": "Remove " + x,
          onClick: (c) => C(x),
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
      l.free && !l.disabled ? (e(), I(s(Ye), {
        key: 4,
        modelValue: v.value,
        "onUpdate:modelValue": E[2] || (E[2] = (x) => v.value = x),
        type: "text",
        "aria-labelledby": l.labelledby,
        placeholder: l.placeholder ?? "Add…",
        onKeydown: aa(Ie(p, ["prevent"]), ["enter"]),
        onBlur: p,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "aria-labelledby", "placeholder", "onKeydown"])) : b("", !0)
    ]));
  }
}), ns = { key: 0 }, os = {
  key: 0,
  class: "pim-config-overrides"
}, ds = {
  key: 1,
  class: "muted small"
}, rs = { key: 3 }, us = ["schema", "config"], cs = {
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
    const t = l, d = y, v = J("pending"), m = N(() => {
      const C = t.schema.properties;
      return Object.entries(t.modelValue).map(([O, K]) => ({
        key: O,
        label: C?.[O]?.title ?? B(O),
        value: K !== null && typeof K == "object" ? JSON.stringify(K) : da(K)
      }));
    });
    async function g() {
      v.value = "pending", v.value = await Na("wc-schema-form") ? "ready" : "failed";
    }
    fe(() => t.disabled, (C) => {
      C || g();
    }, { immediate: !0 });
    function p(C) {
      const O = C.detail;
      O && typeof O == "object" && !Array.isArray(O) && d("update:modelValue", O);
    }
    return (C, O) => (e(), i(L, null, [
      l.problem ? (e(), I(s($e), {
        key: 0,
        severity: "warn",
        role: "alert"
      }, {
        default: k(() => [
          l.problemLabel ? (e(), i(L, { key: 0 }, [
            H(_(l.problemLabel) + " is required. Enter a value below.", 1)
          ], 64)) : (e(), i(L, { key: 1 }, [
            H("The saved settings don’t meet the plugin’s requirements. Update the configuration below.")
          ], 64))
        ]),
        _: 1
      })) : b("", !0),
      l.problem ? (e(), I(Re, {
        key: 1,
        class: "small pim-error-code pim-ia-disclosure",
        label: "Technical details"
      }, {
        default: k(() => [
          l.pluginId ? (e(), i("p", ns, [
            O[1] || (O[1] = H("Plugin ", -1)),
            a("code", null, _(l.pluginId), 1)
          ])) : b("", !0),
          a("p", null, _(l.problem.message), 1)
        ]),
        _: 1
      })) : b("", !0),
      l.disabled ? (e(), i(L, { key: 2 }, [
        m.value.length ? (e(), i("dl", os, [
          (e(!0), i(L, null, ee(m.value, (K) => (e(), i(L, {
            key: K.key
          }, [
            a("dt", null, _(K.label), 1),
            a("dd", null, _(K.value), 1)
          ], 64))), 128))
        ])) : (e(), i("span", ds, "No overrides"))
      ], 64)) : (e(), i("div", rs, [
        v.value === "ready" ? (e(), i("wc-schema-form", {
          key: 0,
          schema: JSON.stringify(t.schema),
          config: JSON.stringify(l.modelValue),
          onConfigChanged: p
        }, null, 40, us)) : v.value === "pending" ? (e(), i("span", cs, "Configuration form is loading.")) : (e(), I(s($e), {
          key: 2,
          role: "alert",
          severity: "error"
        }, {
          default: k(() => [
            O[3] || (O[3] = H("Configuration form could not be loaded. ", -1)),
            f(s(W), {
              type: "button",
              onClick: g,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: k(() => [...O[2] || (O[2] = [
                H("Retry", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })),
        l.problem ? b("", !0) : (e(), I(s(W), {
          key: 3,
          type: "button",
          onClick: O[0] || (O[0] = (K) => d("update:modelValue", {})),
          severity: "secondary",
          outlined: "",
          size: "small"
        }, {
          default: k(() => [
            f(s(le), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            }),
            O[4] || (O[4] = H(" Reset overrides", -1))
          ]),
          _: 1
        }))
      ]))
    ], 64));
  }
}), ms = { key: 0 }, ps = /* @__PURE__ */ de({
  __name: "DefaultValue",
  props: {
    attribute: {},
    type: {},
    disabled: { type: Boolean }
  },
  emits: ["change"],
  setup(l, { emit: y }) {
    const t = l, d = y, v = N(() => {
      const C = t.type?.form;
      let O = { type: "string" };
      return C === "bool" ? O = { type: "boolean" } : C === "int" ? O = { type: "integer" } : C === "dec" ? O = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : C === "quantity" ? O = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(t.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : C === "record" ? O = { type: "object", additionalProperties: !0 } : C === "ref" && (O = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${t.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (t.attribute.cardinality ?? "one") !== "one" && (O = { type: "array", items: O, uniqueItems: t.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...O, title: "Default value" } } };
    });
    function m(C) {
      return C && typeof C == "object" && "m" in C && "e" in C ? ka(C) : C;
    }
    function g(C) {
      return t.type?.form === "dec" ? m(C) : t.type?.form === "quantity" && C && typeof C == "object" && "v" in C && "u" in C ? { value: m(C.v), unit: C.u } : C;
    }
    const p = N(() => t.attribute.default === void 0 ? {} : { value: Array.isArray(t.attribute.default) ? t.attribute.default.map(g) : g(t.attribute.default) });
    return (C, O) => l.disabled ? (e(), i("span", ms, _(l.attribute.default == null ? "No default" : s(da)(l.attribute.default)), 1)) : (e(), I(wa, {
      key: 1,
      schema: v.value,
      "model-value": p.value,
      "onUpdate:modelValue": O[0] || (O[0] = (K) => d("change", K.value))
    }, null, 8, ["schema", "model-value"]));
  }
}), vs = { class: "pim-stack" }, fs = {
  key: 0,
  class: "pim-ia-action"
}, bs = {
  key: 1,
  class: "form pim-card-body pad muted"
}, ys = { class: "pim-bsection-head pim-list-header" }, gs = { class: "small muted" }, hs = { class: "row pim-list-actions" }, ks = { class: "pim-fields" }, _s = { class: "pim-f pim-w-third" }, ws = { class: "pim-f-label" }, $s = ["id"], Cs = { class: "pim-f pim-w-third" }, xs = { class: "pim-f-label" }, Vs = ["id"], Us = {
  key: 0,
  class: "pim-f pim-w-third"
}, As = { class: "pim-f-label" }, js = ["id"], Ss = {
  key: 1,
  class: "pim-f pim-w-full muted small"
}, Os = {
  key: 2,
  class: "pim-f pim-w-full muted small"
}, Rs = {
  key: 3,
  class: "pim-f pim-w-third"
}, Is = { class: "pim-f-label" }, Ts = ["id"], Ps = { class: "pim-f pim-w-third" }, qs = { class: "pim-f-label" }, Ns = ["id"], Ds = { class: "pim-f pim-w-half" }, zs = { class: "pim-f-label" }, Bs = ["id"], Ls = ["aria-labelledby"], Fs = { class: "pim-f-label" }, Es = ["id"], Ms = ["aria-labelledby"], Ws = { class: "pim-f-label" }, Hs = ["id"], Js = { class: "pim-fields" }, Ks = { class: "pim-f pim-w-third" }, Gs = { class: "pim-f-label" }, Ys = ["for"], Zs = {
  key: 0,
  class: "pim-f-note"
}, Qs = { class: "pim-f pim-w-third" }, Xs = { class: "pim-f-label" }, ei = ["id"], ai = { class: "pim-f pim-w-half" }, li = { class: "pim-f-label" }, ti = ["for"], si = { class: "row" }, ii = {
  key: 0,
  class: "pim-f pim-w-full"
}, ni = { class: "pim-f-label" }, oi = ["id"], di = ["aria-labelledby"], ri = ["id"], ui = {
  key: 0,
  class: "row end"
}, ci = { class: "pim-ia-dialog-head" }, mi = {
  tabindex: "-1",
  autofocus: ""
}, pi = { class: "pim-source-permissions" }, vi = ["id"], fi = { class: "dialog-actions pim-group-dialog-actions" }, bi = /* @__PURE__ */ de({
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
    const t = l, d = za(l, "family"), v = y, m = na.map((j) => j.value), g = [{ value: "one", label: "Single value" }, { value: "list", label: "Ordered list" }, { value: "set", label: "Unique set" }], p = N(() => t.schema.access.admin), C = N(() => t.draft.aspects ?? []), O = N(() => (t.draft.families ?? []).filter((j) => j.code !== "generic"));
    fe(O, (j) => {
      d.value && !j.some((S) => S.code === d.value) && (d.value = "");
    }, { immediate: !0 });
    const K = N(() => [{ value: "", label: "All families" }, ...O.value.map((j) => ({ value: j.code, label: B(j.code) }))]), Z = N(() => {
      const j = O.value.find((S) => S.code === d.value);
      return j ? C.value.filter((S) => j.aspects?.includes(S.namespace)) : C.value;
    }), E = N(() => (t.draft.dimensions ?? []).map((j) => ({ value: j.name, label: B(j.name) }))), x = N(() => (t.draft.vocabularies ?? []).map((j) => j.code)), c = N(() => (t.draft.sources ?? []).map((j) => ({ value: j.id, label: B(j.id) }))), w = N(() => [...t.options.types].sort((j, S) => j.form.localeCompare(S.form)).map((j) => ({ value: j.id, label: ea(j) })));
    function r(j) {
      return t.options.types.find((S) => S.id === j.type);
    }
    function A(j) {
      return r(j)?.target === "term";
    }
    function T(j) {
      return r(j)?.target === "asset";
    }
    function F(j) {
      const S = r(j);
      return !!S && S.form === "ref" && !S.target;
    }
    function ie(j) {
      return O.value.filter((S) => S.aspects?.includes(j)).map((S) => B(S.code));
    }
    function me(j) {
      const S = ie(j);
      return S.length ? S.length === 1 ? S[0] : S.length + " families" : "Unused by families";
    }
    const M = { none: "None", key: "Exact match", number: "Number range", text: "Text search" }, se = J({}), D = Ne(), q = /* @__PURE__ */ new WeakMap();
    let G = 0;
    function z(j, S) {
      if (S.id !== void 0) return j + "." + S.id;
      const P = Cl(S);
      let V = q.get(P);
      return V === void 0 && (V = ++G, q.set(P, V)), j + ".draft-" + V;
    }
    function n(j, S, P) {
      return D + "-" + z(j, S) + "-" + P;
    }
    function U(j, S) {
      j.type = S;
      const P = r(j);
      if (P && j.index && !P.indexes.includes(j.index) && delete j.index, A(j) || delete j.vocabulary, T(j) && delete j.default, !F(j) && j.config && "target" in j.config) {
        const { target: V, ...re } = j.config;
        j.config = Object.keys(re).length ? re : void 0, j.config || delete j.config;
      }
    }
    function o(j, S) {
      Object.keys(S).length ? j.config = S : delete j.config;
    }
    function u(j, S) {
      const P = { ...j.config ?? {} };
      S ? P.target = S : delete P.target, o(j, P);
    }
    function X(j, S) {
      S.length ? j.scope = S : delete j.scope, S.length || delete j.index_contexts;
    }
    function Y(j, S, P) {
      P === void 0 || P === "" || P === !1 && S !== "default" ? delete j[S] : j[S] = P;
    }
    function ae(j) {
      return j.index_contexts ?? [];
    }
    function Ce(j) {
      return (t.draft.dimensions ?? []).find((S) => S.name === j)?.members ?? [];
    }
    function Me(j) {
      const S = {};
      for (const V of j.scope ?? []) S[V] = Ce(V)[0] ?? "";
      (j.index_contexts ?? (j.index_contexts = [])).push(S);
    }
    const ve = J(), De = N(() => ve.value ? B(ve.value.namespace) + " settings" : "");
    async function ta(j, S, P, V) {
      const re = j.currentTarget, Q = re.parentElement;
      ia(S, P, V), await Ge(), (re.isConnected ? re : Q?.querySelector("button"))?.focus({ preventScroll: !0 });
    }
    function ca(j) {
      (t.draft.aspects ??= []).push({ namespace: j, attributes: [] });
    }
    function Se(j) {
      ve.value = void 0;
      const S = C.value.indexOf(j);
      S >= 0 && C.value.splice(S, 1), t.schema.declaration.aspects?.some((P) => P.namespace === j.namespace) && v("remove", "aspects", j.namespace);
    }
    function Ae(j, S) {
      const P = t.options.types.find((re) => re.id === "kickside.pim.types:text") ?? t.options.types[0], V = { code: S, type: P?.id ?? "" };
      (j.attributes ??= []).push(V), se.value[z(j.namespace, V)] = !0;
    }
    function pe(j, S) {
      const P = j.attributes ?? [], V = P.indexOf(S);
      V >= 0 && P.splice(V, 1);
      const re = S.id === void 0 ? void 0 : t.schema.declaration.aspects?.find((Q) => Q.namespace === j.namespace)?.attributes?.find((Q) => Q.id === S.id);
      re && v("remove", "attributes", j.namespace + "." + re.code);
    }
    return (j, S) => (e(), i("div", vs, [
      O.value.length || p.value && !d.value ? (e(), i("div", fs, [
        O.value.length ? (e(), I(s(we), {
          key: 0,
          modelValue: d.value,
          "onUpdate:modelValue": S[0] || (S[0] = (P) => d.value = P),
          class: "pim-family-filter",
          "aria-label": "Show fields for a family",
          placeholder: "All families",
          options: K.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self"
        }, null, 8, ["modelValue", "options"])) : b("", !0),
        p.value && !d.value ? (e(), I(Te, {
          key: 1,
          label: "Field group name",
          action: "Add field group",
          "from-name": "",
          existing: C.value.map((P) => P.namespace),
          onAdd: ca
        }, null, 8, ["existing"])) : b("", !0)
      ])) : b("", !0),
      d.value && !Z.value.length ? (e(), i("p", bs, "This family has no field groups yet. Open the family to choose which groups it uses.")) : b("", !0),
      (e(!0), i(L, null, ee(Z.value, (P) => (e(), I(Pe, {
        key: P.namespace,
        count: P.attributes?.length ?? 0,
        columns: ["kind", "details", "usage"],
        "show-actions": p.value
      }, {
        head: k(() => [
          a("header", ys, [
            a("div", null, [
              a("h3", null, _(s(B)(P.namespace)), 1),
              a("p", gs, _(ie(P.namespace).length ? "Used by " + ie(P.namespace).join(", ") : "Unused by families"), 1)
            ]),
            a("div", hs, [
              p.value ? (e(), I(Te, {
                key: 0,
                label: "Field name",
                action: "Add field",
                "from-name": "",
                existing: P.attributes?.map((V) => V.code),
                onAdd: (V) => Ae(P, V)
              }, null, 8, ["existing", "onAdd"])) : b("", !0),
              f(s(W), {
                type: "button",
                "aria-label": s(B)(P.namespace) + " settings",
                title: s(B)(P.namespace) + " settings",
                "aria-haspopup": "dialog",
                severity: "secondary",
                text: "",
                size: "small",
                onClick: (V) => ve.value = P
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
          (e(!0), i(L, null, ee(P.attributes ?? [], (V, re) => (e(), I(qe, {
            key: z(P.namespace, V),
            open: se.value[z(P.namespace, V)],
            "onUpdate:open": (Q) => se.value[z(P.namespace, V)] = Q,
            title: s(B)(V.code),
            kind: s(ea)(r(V)),
            usage: me(P.namespace),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle"
          }, ge({
            details: k(() => [
              V.cardinality && V.cardinality !== "one" ? (e(), I(s(ye), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: k(() => [
                  H(_(g.find((Q) => Q.value === V.cardinality)?.label), 1)
                ]),
                _: 2
              }, 1024)) : b("", !0),
              V.scope?.length ? (e(), I(s(ye), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: k(() => [
                  H("per " + _(V.scope.map(s(B)).join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : b("", !0),
              V.index && V.index !== "none" ? (e(), I(s(ye), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: k(() => [
                  H(_(M[V.index] || "Filterable"), 1)
                ]),
                _: 2
              }, 1024)) : b("", !0),
              V.unique ? (e(), I(s(ye), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: k(() => [...S[6] || (S[6] = [
                  H("unique", -1)
                ])]),
                _: 1
              })) : b("", !0)
            ]),
            default: k(() => [
              a("div", ks, [
                a("div", _s, [
                  a("div", ws, [
                    a("label", {
                      id: n(P.namespace, V, "type")
                    }, "Type", 8, $s)
                  ]),
                  f(s(we), {
                    disabled: !p.value,
                    "aria-labelledby": n(P.namespace, V, "type"),
                    "model-value": V.type,
                    options: w.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (Q) => U(V, Q)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                a("div", Cs, [
                  a("div", xs, [
                    a("label", {
                      id: n(P.namespace, V, "values")
                    }, "Values", 8, Vs)
                  ]),
                  f(s(we), {
                    disabled: !p.value,
                    "aria-labelledby": n(P.namespace, V, "values"),
                    "model-value": V.cardinality ?? "one",
                    options: g,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (Q) => Y(V, "cardinality", Q === "one" ? void 0 : Q)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                A(V) ? (e(), i("div", Us, [
                  a("div", As, [
                    a("label", {
                      id: n(P.namespace, V, "vocabulary")
                    }, "Vocabulary", 8, js)
                  ]),
                  f(s(we), {
                    disabled: !p.value,
                    "aria-labelledby": n(P.namespace, V, "vocabulary"),
                    "model-value": V.vocabulary ?? "",
                    "onUpdate:modelValue": (Q) => Y(V, "vocabulary", Q),
                    options: [{ value: "", label: "Choose…" }, ...x.value.map((Q) => ({ value: Q, label: s(B)(Q) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : b("", !0),
                T(V) ? (e(), i("p", Ss, "Choose the media types and file size this field accepts. Catalog readers can access attached files.")) : r(V)?.form === "ref" && !A(V) ? (e(), i("p", Os, _(F(V) ? "A link points to something managed by an installed plugin." : "A product reference points to another product in this catalog."), 1)) : b("", !0),
                F(V) ? (e(), i("div", Rs, [
                  a("div", Is, [
                    a("label", {
                      id: n(P.namespace, V, "link")
                    }, "Link destination", 8, Ts),
                    S[7] || (S[7] = a("span", { class: "pim-f-note" }, "choose what the field can point to", -1))
                  ]),
                  f(s(we), {
                    disabled: !p.value,
                    "aria-labelledby": n(P.namespace, V, "link"),
                    "model-value": V.config?.target ?? "",
                    "onUpdate:modelValue": (Q) => u(V, Q),
                    options: [{ value: "", label: "Choose…" }, ...l.options.link_kinds.map((Q) => ({ value: Q.kind, label: s(oe)(Q.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : b("", !0),
                a("div", Ps, [
                  a("div", qs, [
                    a("label", {
                      id: n(P.namespace, V, "width")
                    }, "Width", 8, Ns),
                    S[8] || (S[8] = a("span", { class: "pim-f-note" }, "of a form row", -1))
                  ]),
                  f(s(_a), {
                    disabled: !p.value,
                    "aria-labelledby": n(P.namespace, V, "width"),
                    "model-value": s(ha)(l.schema, P.namespace, V),
                    options: s(m),
                    "allow-empty": !1,
                    "onUpdate:modelValue": (Q) => V.width = Q
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                a("div", Ds, [
                  a("div", zs, [
                    a("label", {
                      id: n(P.namespace, V, "scope")
                    }, "Varies per", 8, Bs),
                    S[9] || (S[9] = a("span", { class: "pim-f-note" }, "dimensions the value depends on", -1))
                  ]),
                  f(je, {
                    disabled: !p.value,
                    labelledby: n(P.namespace, V, "scope"),
                    "model-value": V.scope ?? [],
                    options: E.value,
                    "onUpdate:modelValue": (Q) => X(V, Q)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                T(V) ? b("", !0) : (e(), i("div", {
                  key: 4,
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": n(P.namespace, V, "default")
                }, [
                  a("div", Fs, [
                    a("label", {
                      id: n(P.namespace, V, "default")
                    }, "Default", 8, Es),
                    S[10] || (S[10] = a("span", { class: "pim-f-note" }, "when no value is set", -1))
                  ]),
                  f(ps, {
                    disabled: !p.value,
                    attribute: V,
                    type: r(V),
                    onChange: (Q) => Y(V, "default", Q)
                  }, null, 8, ["disabled", "attribute", "type", "onChange"])
                ], 8, Ls)),
                r(V)?.config_schema ? (e(), i("div", {
                  key: 5,
                  class: "pim-f pim-w-full",
                  role: "group",
                  "aria-labelledby": n(P.namespace, V, "config")
                }, [
                  a("div", Ws, [
                    a("label", {
                      id: n(P.namespace, V, "config")
                    }, "Type configuration", 8, Hs)
                  ]),
                  f(wa, {
                    disabled: !p.value,
                    schema: r(V).config_schema,
                    "model-value": V.config ?? {},
                    "onUpdate:modelValue": (Q) => o(V, Q)
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue"])
                ], 8, Ms)) : b("", !0)
              ]),
              f(Re, {
                class: "pim-field-advanced pim-ia-disclosure",
                label: "Advanced"
              }, {
                default: k(() => [
                  a("div", Js, [
                    a("div", Ks, [
                      a("div", Gs, [
                        a("label", {
                          for: n(P.namespace, V, "code")
                        }, "Integration key", 8, Ys),
                        V.id !== void 0 ? (e(), i("span", Zs, "renaming keeps stored values")) : b("", !0)
                      ]),
                      f(s(Ye), {
                        disabled: !p.value,
                        id: n(P.namespace, V, "code"),
                        type: "text",
                        value: V.code,
                        onInput: (Q) => V.code = Q.target.value,
                        class: "mono"
                      }, null, 8, ["disabled", "id", "value", "onInput"])
                    ]),
                    a("div", Qs, [
                      a("div", Xs, [
                        a("label", {
                          id: n(P.namespace, V, "index")
                        }, "Search and filters", 8, ei),
                        S[11] || (S[11] = a("span", { class: "pim-f-note" }, "choose how this field can be matched", -1))
                      ]),
                      f(s(we), {
                        disabled: !p.value,
                        "aria-labelledby": n(P.namespace, V, "index"),
                        "model-value": V.index ?? "none",
                        options: (r(V)?.indexes ?? ["none"]).map((Q) => ({ value: Q, label: M[Q] || s(B)(Q) })),
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self",
                        "onUpdate:modelValue": (Q) => Y(V, "index", Q === "none" ? void 0 : Q)
                      }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ]),
                    a("div", ai, [
                      a("div", li, [
                        a("label", {
                          for: n(P.namespace, V, "unique")
                        }, "Unique", 8, ti),
                        S[12] || (S[12] = a("span", { class: "pim-f-note" }, "one holder per value, catalog wide", -1))
                      ]),
                      a("div", si, [
                        f(s(la), {
                          "input-id": n(P.namespace, V, "unique"),
                          "model-value": V.unique === !0,
                          disabled: !p.value || !!V.scope?.length || (V.cardinality ?? "one") !== "one",
                          "onUpdate:modelValue": (Q) => Y(V, "unique", Q)
                        }, null, 8, ["input-id", "model-value", "disabled", "onUpdate:modelValue"]),
                        a("span", null, _(V.unique ? "Yes" : "No"), 1)
                      ])
                    ]),
                    (V.scope?.length ?? 0) > 0 && V.index && V.index !== "none" ? (e(), i("div", ii, [
                      a("div", ni, [
                        a("label", {
                          id: n(P.namespace, V, "contexts")
                        }, "Filterable combinations", 8, oi),
                        S[13] || (S[13] = a("span", { class: "pim-f-note" }, "which combinations get an index", -1))
                      ]),
                      a("div", {
                        class: "pim-contexts",
                        role: "group",
                        "aria-labelledby": n(P.namespace, V, "contexts")
                      }, [
                        (e(!0), i(L, null, ee(ae(V), (Q, he) => (e(), i("div", {
                          key: he,
                          class: "pim-context-row"
                        }, [
                          (e(!0), i(L, null, ee(V.scope, (ke) => (e(), i("div", {
                            key: ke,
                            class: "pim-context-field"
                          }, [
                            a("span", {
                              id: n(P.namespace, V, "context-" + he + "-" + ke),
                              class: "small muted"
                            }, _(s(B)(ke)), 9, ri),
                            f(s(we), {
                              disabled: !p.value,
                              "aria-labelledby": n(P.namespace, V, "context-" + he + "-" + ke),
                              "model-value": Q[ke] ?? "",
                              options: Ce(ke),
                              class: "narrow",
                              appendTo: "self",
                              "onUpdate:modelValue": (ma) => Q[ke] = ma
                            }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                          ]))), 128)),
                          p.value ? (e(), I(s(W), {
                            key: 0,
                            type: "button",
                            "aria-label": "Remove context",
                            onClick: (ke) => ae(V).splice(he, 1),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: k(() => [
                              f(s(le), { icon: "tabler:x" })
                            ]),
                            _: 1
                          }, 8, ["onClick"])) : b("", !0)
                        ]))), 128)),
                        p.value ? (e(), I(s(W), {
                          key: 0,
                          type: "button",
                          onClick: (Q) => Me(V),
                          severity: "secondary",
                          outlined: "",
                          size: "small"
                        }, {
                          default: k(() => [
                            f(s(le), {
                              icon: "tabler:plus",
                              "aria-hidden": "true"
                            }),
                            S[14] || (S[14] = H(" Add context", -1))
                          ]),
                          _: 1
                        }, 8, ["onClick"])) : b("", !0)
                      ], 8, di)
                    ])) : b("", !0)
                  ])
                ]),
                _: 2
              }, 1024),
              p.value ? (e(), i("div", ui, [
                f(s(W), {
                  type: "button",
                  onClick: (Q) => pe(P, V),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: k(() => [
                    f(s(le), { icon: "tabler:trash" }),
                    S[15] || (S[15] = H(" Remove field", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : b("", !0)
            ]),
            _: 2
          }, [
            p.value ? {
              name: "actions",
              fn: k(() => [
                re > 0 ? (e(), I(s(W), {
                  key: 0,
                  type: "button",
                  "aria-label": "Move " + s(B)(V.code) + " earlier",
                  onClick: (Q) => ta(Q, P.attributes, re, re - 1),
                  text: "",
                  size: "small",
                  severity: "secondary"
                }, {
                  default: k(() => [
                    f(s(le), {
                      icon: "tabler:arrow-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])) : b("", !0),
                re < (P.attributes?.length ?? 0) - 1 ? (e(), I(s(W), {
                  key: 1,
                  type: "button",
                  class: "pim-move-later",
                  "aria-label": "Move " + s(B)(V.code) + " later",
                  onClick: (Q) => ta(Q, P.attributes, re, re + 1),
                  text: "",
                  size: "small",
                  severity: "secondary"
                }, {
                  default: k(() => [
                    f(s(le), {
                      icon: "tabler:arrow-down",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])) : b("", !0)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["open", "onUpdate:open", "title", "kind", "usage"]))), 128))
        ]),
        _: 2
      }, 1032, ["count", "show-actions"]))), 128)),
      f(oa, {
        visible: !!ve.value,
        label: De.value,
        onClose: S[5] || (S[5] = (P) => ve.value = void 0)
      }, {
        default: k(() => [
          ve.value ? (e(), i("section", {
            key: 0,
            class: "pim-ia-dialog",
            onKeydown: S[4] || (S[4] = aa(Ie((P) => ve.value = void 0, ["prevent"]), ["esc"]))
          }, [
            a("header", ci, [
              a("h2", mi, _(De.value), 1)
            ]),
            a("div", pi, [
              a("label", {
                id: s(D) + "-writers"
              }, "Sources allowed to write", 8, vi),
              f(s(Fa), {
                disabled: !p.value,
                "aria-labelledby": s(D) + "-writers",
                "model-value": ve.value.write?.sources ?? [],
                options: c.value,
                "option-label": "label",
                "option-value": "value",
                placeholder: "Any source",
                "append-to": "self",
                "onUpdate:modelValue": S[1] || (S[1] = (P) => ve.value.write = { sources: P })
              }, null, 8, ["disabled", "aria-labelledby", "model-value", "options"])
            ]),
            a("footer", fi, [
              p.value ? (e(), I(s(W), {
                key: 0,
                type: "button",
                label: "Remove field group",
                severity: "danger",
                text: "",
                onClick: S[2] || (S[2] = (P) => Se(ve.value))
              })) : b("", !0),
              f(s(W), {
                type: "button",
                label: "Done",
                severity: "secondary",
                outlined: "",
                onClick: S[3] || (S[3] = (P) => ve.value = void 0)
              })
            ])
          ], 32)) : b("", !0)
        ]),
        _: 1
      }, 8, ["visible", "label"])
    ]));
  }
}), yi = { class: "muted small" }, gi = { class: "pim-aspect" }, hi = {
  key: 0,
  class: "small muted"
}, ki = { class: "pim-fields" }, _i = { class: "pim-f pim-w-full" }, wi = { class: "pim-f-label" }, $i = ["id"], Ci = { class: "pim-f-label" }, xi = ["id"], Vi = /* @__PURE__ */ de({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(l, { emit: y }) {
    const t = l, d = y, v = N(() => t.schema.access.admin), m = N(() => t.draft.dimensions ?? []), g = Ne();
    function p(c, w) {
      return g + "-" + c.name + "-" + w;
    }
    function C(c) {
      (t.draft.dimensions ??= []).push({ name: c, members: [] });
    }
    function O(c) {
      const w = [];
      for (const r of t.draft.aspects ?? []) for (const A of r.attributes ?? []) A.scope?.includes(c.name) && w.push(`${B(A.code)} (${B(r.namespace)})`);
      for (const r of t.draft.families ?? []) for (const A of r.requirements ?? []) A.context && c.name in A.context && w.push(`${B(A.id)} (${B(r.code)})`);
      return w;
    }
    function K(c) {
      O(c).length || (m.value.splice(m.value.indexOf(c), 1), t.schema.declaration.dimensions?.some((w) => w.name === c.name) && d("remove", "dimensions", c.name));
    }
    function Z(c, w) {
      if (c.members = w, c.fallback)
        for (const r of Object.keys(c.fallback)) w.includes(r) || delete c.fallback[r];
    }
    function E(c, w) {
      return c.fallback?.[w] ?? [];
    }
    function x(c, w, r) {
      const A = { ...c.fallback ?? {} };
      r.length ? A[w] = r : delete A[w], Object.keys(A).length ? c.fallback = A : delete c.fallback;
    }
    return (c, w) => (e(), I(Pe, {
      count: m.value.length,
      columns: ["details", "usage"]
    }, ge({
      default: k(() => [
        (e(!0), i(L, null, ee(m.value, (r) => (e(), I(qe, {
          title: s(B)(r.name),
          key: r.name,
          usage: O(r).length ? "Used in " + O(r).length + " places" : "Unused"
        }, ge({
          details: k(() => [
            a("span", yi, _(r.members.map(s(B)).join(", ") || "No allowed values"), 1)
          ]),
          default: k(() => [
            a("div", gi, [
              O(r).length ? (e(), i("p", hi, "Used by " + _(O(r).join(", ")), 1)) : b("", !0),
              a("div", ki, [
                a("div", _i, [
                  a("div", wi, [
                    a("label", {
                      id: p(r, "members")
                    }, "Allowed values", 8, $i),
                    w[0] || (w[0] = a("span", { class: "pim-f-note" }, "for example, English and French for Language", -1))
                  ]),
                  f(je, {
                    disabled: !v.value,
                    labelledby: p(r, "members"),
                    "model-value": r.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (A) => Z(r, A)
                  }, null, 8, ["disabled", "labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                (e(!0), i(L, null, ee(r.members, (A) => (e(), i("div", {
                  key: A,
                  class: "pim-f pim-w-half"
                }, [
                  a("div", Ci, [
                    a("label", {
                      id: p(r, "fallback-" + encodeURIComponent(A))
                    }, _(A) + " falls back to", 9, xi),
                    w[1] || (w[1] = a("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  f(je, {
                    disabled: !v.value,
                    labelledby: p(r, "fallback-" + encodeURIComponent(A)),
                    "model-value": E(r, A),
                    options: r.members.filter((T) => T !== A).map((T) => ({ value: T })),
                    "onUpdate:modelValue": (T) => x(r, A, T)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]))), 128))
              ])
            ])
          ]),
          _: 2
        }, [
          v.value ? {
            name: "actions",
            fn: k(() => [
              f(s(W), {
                type: "button",
                disabled: O(r).length > 0,
                "aria-label": "Remove " + s(B)(r.name),
                title: O(r).length ? "Take the dimension off these first" : "",
                onClick: (A) => K(r),
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
      v.value ? {
        name: "add",
        fn: k(() => [
          f(Te, {
            label: "Dimension name",
            "from-name": "",
            action: "Add dimension",
            existing: m.value.map((r) => r.name),
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
}), Ui = { class: "muted small" }, Ai = { class: "pim-aspect" }, ji = { class: "row small" }, Si = {
  key: 1,
  class: "muted small"
}, Oi = {
  key: 2,
  class: "pim-stack tight pim-terms"
}, Ri = {
  key: 0,
  class: "muted small"
}, Ii = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Ti = {
  key: 3,
  class: "pim-responsive-table"
}, Pi = {
  class: "pim-grid compact",
  "aria-label": "Vocabulary terms"
}, qi = { key: 0 }, Ni = { key: 1 }, Di = {
  key: 0,
  class: "muted"
}, zi = {
  key: 1,
  class: "num"
}, Bi = {
  role: "list",
  class: "pim-stacked-list",
  "aria-label": "Vocabulary terms"
}, Li = {
  key: 0,
  class: "pim-stacked-meta muted small"
}, Fi = {
  key: 4,
  class: "muted small"
}, Ei = { class: "row wrap" }, Mi = {
  key: 5,
  class: "row wrap pim-add-row"
}, Wi = {
  key: 0,
  class: "pim-config-overrides"
}, Hi = /* @__PURE__ */ de({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(l, { emit: y }) {
    const t = l, d = y, v = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/, m = N(() => t.schema.access.admin), g = N(() => m.value && t.schema.access.write), p = N(() => t.draft.vocabularies ?? []);
    function C(n) {
      (t.draft.vocabularies ??= []).push({ code: n });
    }
    function O(n) {
      p.value.splice(p.value.indexOf(n), 1), t.schema.declaration.vocabularies?.some((U) => U.code === n.code) && d("remove", "vocabularies", n.code);
    }
    function K(n) {
      return !!t.schema.vocabularies[n];
    }
    const Z = J({}), E = J({}), x = J({}), c = J({}), w = J({}), r = J({}), A = J({}), T = J({});
    function F(n) {
      return !!(w.value[n] || r.value[n]);
    }
    async function ie(n, U) {
      w.value[n] = !0, delete A.value[n];
      try {
        const o = await ce.termsPage(t.catalogId, n, U);
        E.value[n] = o.terms, c.value[n] = U, x.value[n] = o.next;
        const u = M(n);
        o.terms.some((X) => X.retired && X.code === u.parent) && (u.parent = "");
      } catch (o) {
        A.value[n] = { errors: [Ee(o, "Could not load terms.")], read: { after: U } };
      } finally {
        w.value[n] = !1;
      }
    }
    function me(n) {
      Z.value[n] = !Z.value[n], Z.value[n] && !F(n) && !E.value[n] && !A.value[n] && ie(n);
    }
    function M(n) {
      return T.value[n] ?? (T.value[n] = { code: "", label: "", parent: "" });
    }
    function se(n, U) {
      const o = E.value[n]?.find((u) => u.code === U);
      return o ? Le(o) : B(U);
    }
    function D(n) {
      return [{ value: "", label: "No parent" }, ...(E.value[n] ?? []).filter((U) => !U.retired).map((U) => ({ value: U.code, label: Le(U) }))];
    }
    function q(n, U, o) {
      A.value[n] = { errors: U?.findings?.length ? U.findings.map((u) => ({ message: u.message ?? o, code: u.code })) : [{ message: o }] };
    }
    async function G(n) {
      const U = M(n.code);
      if (!(!g.value || !v.test(U.code))) {
        r.value[n.code] = !0, delete A.value[n.code];
        try {
          const o = { term: { vocabulary: n.code, code: U.code }, labels: { en: U.label || B(U.code) } };
          n.hierarchical && U.parent && (o.parent = U.parent);
          const X = (await ce.apply(t.catalogId, [o])).outcomes[0];
          if (X?.outcome !== "created" && X?.outcome !== "updated") {
            q(n.code, X, "The term was not accepted.");
            return;
          }
          T.value[n.code] = { code: "", label: "", parent: "" }, ce.invalidateTerms(t.catalogId), await ie(n.code, c.value[n.code]);
        } catch (o) {
          A.value[n.code] = { errors: [Ee(o, "Could not add the term.")] };
        } finally {
          r.value[n.code] = !1;
        }
      }
    }
    async function z(n, U, o) {
      if (g.value && !(o && !await Je.confirm({ header: "Retire term?", message: `Retire ${Le(U)}? Term changes save immediately. You can restore this term later.`, acceptLabel: "Retire", rejectLabel: "Cancel" }))) {
        r.value[n.code] = !0, delete A.value[n.code];
        try {
          const X = (await ce.apply(t.catalogId, [{ term: { vocabulary: n.code, code: U.code }, retired: o }])).outcomes[0];
          if (!X || !["updated", "unchanged"].includes(X.outcome)) {
            q(n.code, X, "The term change was not accepted.");
            return;
          }
          o && M(n.code).parent === U.code && (M(n.code).parent = ""), ce.invalidateTerms(t.catalogId), await ie(n.code, c.value[n.code]);
        } catch (u) {
          A.value[n.code] = { errors: [Ee(u, "Could not change the term.")] };
        } finally {
          r.value[n.code] = !1;
        }
      }
    }
    return (n, U) => (e(), I(Pe, {
      count: p.value.length,
      columns: ["details"]
    }, ge({
      default: k(() => [
        (e(!0), i(L, null, ee(p.value, (o) => (e(), I(qe, {
          title: s(B)(o.code),
          key: o.code
        }, {
          details: k(() => [
            a("span", Ui, _(o.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: k(() => [
            m.value ? (e(), I(s(W), {
              key: 0,
              type: "button",
              "aria-label": "Remove " + s(B)(o.code),
              onClick: (u) => O(o),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: k(() => [
                f(s(le), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])) : b("", !0)
          ]),
          default: k(() => [
            a("div", Ai, [
              a("label", ji, [
                f(s(la), {
                  disabled: !m.value,
                  "aria-label": "Hierarchical " + s(B)(o.code),
                  "model-value": o.hierarchical === !0,
                  "onUpdate:modelValue": (u) => u ? o.hierarchical = !0 : delete o.hierarchical
                }, null, 8, ["disabled", "aria-label", "model-value", "onUpdate:modelValue"]),
                U[0] || (U[0] = a("span", null, "Hierarchical", -1))
              ]),
              K(o.code) ? (e(), I(s(W), {
                key: 0,
                type: "button",
                onClick: (u) => me(o.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: k(() => [
                  f(s(le), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  H(" " + _(Z.value[o.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : m.value ? (e(), i("span", Si, "Apply the schema before adding terms.")) : b("", !0),
              Z.value[o.code] ? (e(), i("div", Oi, [
                g.value ? (e(), i("p", Ri, "Term changes save immediately.")) : b("", !0),
                w.value[o.code] ? (e(), i("div", Ii, "Loading terms…")) : A.value[o.code] ? (e(!0), i(L, { key: 2 }, ee(A.value[o.code].errors, (u, X) => (e(), I(ua, {
                  key: X,
                  error: u
                }, {
                  default: k(() => [
                    A.value[o.code].read ? (e(), I(s(W), {
                      key: 0,
                      type: "button",
                      onClick: (Y) => ie(o.code, A.value[o.code].read?.after),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: k(() => [...U[1] || (U[1] = [
                        H("Retry", -1)
                      ])]),
                      _: 1
                    }, 8, ["onClick"])) : b("", !0)
                  ]),
                  _: 2
                }, 1032, ["error"]))), 128)) : b("", !0),
                (E.value[o.code] ?? []).length ? (e(), i("div", Ti, [
                  a("table", Pi, [
                    a("thead", null, [
                      a("tr", null, [
                        U[2] || (U[2] = a("th", null, "Term", -1)),
                        o.hierarchical ? (e(), i("th", qi, "Parent")) : b("", !0),
                        m.value ? (e(), i("th", Ni)) : b("", !0)
                      ])
                    ]),
                    a("tbody", null, [
                      (e(!0), i(L, null, ee(E.value[o.code], (u) => (e(), i("tr", {
                        key: u.code,
                        class: Ue({ muted: u.retired })
                      }, [
                        a("td", null, [
                          H(_(s(Le)(u)) + " ", 1),
                          u.retired ? (e(), I(s(ye), {
                            key: 0,
                            severity: "secondary",
                            value: "Retired"
                          })) : b("", !0)
                        ]),
                        o.hierarchical ? (e(), i("td", Di, _(u.parent ? se(o.code, u.parent) : "—"), 1)) : b("", !0),
                        m.value ? (e(), i("td", zi, [
                          f(s(W), {
                            type: "button",
                            disabled: !g.value || F(o.code),
                            onClick: (X) => z(o, u, !u.retired),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: k(() => [
                              H(_(u.retired ? "Restore" : "Retire"), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled", "onClick"])
                        ])) : b("", !0)
                      ], 2))), 128))
                    ])
                  ]),
                  a("ul", Bi, [
                    (e(!0), i(L, null, ee(E.value[o.code], (u) => (e(), i("li", {
                      key: u.code,
                      class: Ue(["pim-stacked-row", { muted: u.retired }])
                    }, [
                      a("div", null, [
                        H(_(s(Le)(u)) + " ", 1),
                        u.retired ? (e(), I(s(ye), {
                          key: 0,
                          severity: "secondary",
                          value: "Retired"
                        })) : b("", !0)
                      ]),
                      o.hierarchical && u.parent ? (e(), i("div", Li, "Parent: " + _(se(o.code, u.parent)), 1)) : b("", !0),
                      m.value ? (e(), I(s(W), {
                        key: 1,
                        type: "button",
                        disabled: !g.value || F(o.code),
                        onClick: (X) => z(o, u, !u.retired),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: k(() => [
                          H(_(u.retired ? "Restore" : "Retire"), 1)
                        ]),
                        _: 2
                      }, 1032, ["disabled", "onClick"])) : b("", !0)
                    ], 2))), 128))
                  ])
                ])) : E.value[o.code] && !F(o.code) && !A.value[o.code] ? (e(), i("p", Fi, "No terms yet.")) : b("", !0),
                a("div", Ei, [
                  f(s(W), {
                    type: "button",
                    disabled: F(o.code) || !c.value[o.code],
                    onClick: (u) => ie(o.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: k(() => [
                      f(s(le), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      U[3] || (U[3] = H(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  f(s(W), {
                    type: "button",
                    disabled: F(o.code) || !x.value[o.code],
                    onClick: (u) => ie(o.code, x.value[o.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: k(() => [
                      f(s(le), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      U[4] || (U[4] = H(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                m.value ? (e(), i("div", Mi, [
                  f(s(Ye), {
                    modelValue: M(o.code).label,
                    "onUpdate:modelValue": (u) => M(o.code).label = u,
                    disabled: !g.value || F(o.code),
                    "aria-label": "Term name in English",
                    type: "text",
                    placeholder: "Term name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  f(s(Ye), {
                    modelValue: M(o.code).code,
                    "onUpdate:modelValue": (u) => M(o.code).code = u,
                    disabled: !g.value || F(o.code),
                    type: "text",
                    "aria-label": "Short term name",
                    placeholder: "Short name for imports",
                    class: "narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  o.hierarchical ? (e(), I(s(we), {
                    key: 0,
                    modelValue: M(o.code).parent,
                    "onUpdate:modelValue": (u) => M(o.code).parent = u,
                    disabled: !g.value || F(o.code),
                    class: "narrow",
                    "aria-label": "Parent term",
                    placeholder: "No parent",
                    options: D(o.code),
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "options"])) : b("", !0),
                  f(s(W), {
                    type: "button",
                    disabled: !g.value || F(o.code) || !v.test(M(o.code).code),
                    onClick: (u) => G(o),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: k(() => [
                      f(s(le), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      U[5] || (U[5] = H(" Add term", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])) : b("", !0),
                f(Re, {
                  class: "pim-ia-disclosure",
                  label: "Integration keys"
                }, {
                  default: k(() => [
                    (E.value[o.code] ?? []).length ? (e(), i("dl", Wi, [
                      (e(!0), i(L, null, ee(E.value[o.code], (u) => (e(), i(L, {
                        key: u.code
                      }, [
                        a("dt", null, _(s(Le)(u)), 1),
                        a("dd", null, [
                          a("code", null, _(u.code), 1)
                        ])
                      ], 64))), 128))
                    ])) : b("", !0)
                  ]),
                  _: 2
                }, 1024)
              ])) : b("", !0)
            ])
          ]),
          _: 2
        }, 1032, ["title"]))), 128))
      ]),
      _: 2
    }, [
      m.value ? {
        name: "add",
        fn: k(() => [
          f(Te, {
            label: "Vocabulary name",
            "from-name": "",
            action: "Add vocabulary",
            existing: p.value.map((o) => o.code),
            onAdd: C
          }, {
            default: k(() => [...U[6] || (U[6] = [
              a("span", { class: "muted small" }, "Select fields pick their values from a vocabulary's terms.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), Ji = { class: "pim-stack" }, Ki = { class: "muted small" }, Gi = { class: "muted small" }, Yi = { class: "pim-aspect" }, Zi = { class: "pim-ia-action pim-family-fields" }, Qi = { class: "pim-f" }, Xi = { class: "pim-f-label" }, en = ["id"], an = ["id"], ln = { class: "pim-aspect" }, tn = { class: "pim-stack tight" }, sn = { class: "pim-level-head" }, nn = { class: "pim-fields" }, on = { class: "pim-f pim-w-half" }, dn = { class: "pim-f-label" }, rn = ["id"], un = { class: "pim-f pim-w-half" }, cn = { class: "pim-f-label" }, mn = ["id"], pn = { class: "pim-aspect" }, vn = { class: "pim-stack tight" }, fn = { class: "pim-level-head" }, bn = { class: "muted small" }, yn = { class: "pim-fields" }, gn = { class: "pim-f-label" }, hn = ["id"], kn = { class: "pim-f pim-w-half" }, _n = { class: "pim-f-label" }, wn = ["id"], $n = { class: "pim-f pim-w-half" }, Cn = { class: "pim-f-label" }, xn = ["id"], Vn = {
  key: 0,
  class: "pim-aspect pim-family-remove"
}, Un = /* @__PURE__ */ de({
  __name: "BuilderFamilies",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove", "fields"],
  setup(l, { emit: y }) {
    const t = l, d = y, v = Ne();
    function m(n, U) {
      return v + "-" + n.code + "-" + U;
    }
    const g = N(() => t.schema.access.admin), p = N(() => (t.draft.families ?? []).filter((n) => n.code !== "generic")), C = N(() => {
      const n = new Set(t.draft.plugins?.map((U) => U.use));
      return Object.entries(t.schema.attributes).filter(([, U]) => U.plugin && n.has(U.plugin));
    }), O = N(() => {
      const n = (t.draft.aspects ?? []).map((o) => o.namespace), U = [...new Set(C.value.map(([o]) => o.split(".")[0]))];
      return [...n, ...U.filter((o) => !n.includes(o))].map((o) => ({ value: o, label: B(o) }));
    });
    function K(n) {
      const U = O.value, o = (n.aspects ?? []).filter((u) => !U.some((X) => X.value === u));
      return [...U, ...o.map((u) => ({ value: u, label: B(u) }))];
    }
    const Z = N(() => new Map(t.options.types.map((n) => [n.id, n.form])));
    function E(n, U = []) {
      const o = /* @__PURE__ */ new Map();
      return [.../* @__PURE__ */ new Set([...n, ...U])].map((X) => {
        const [Y, ae] = X.split(".", 2), Ce = B(ae ?? Y);
        return o.set(Ce, (o.get(Ce) ?? 0) + 1), { value: X, label: Ce, group: ae ? B(Y) : void 0 };
      }).map(({ value: X, label: Y, group: ae }) => ({
        value: X,
        label: Y,
        detail: o.get(Y) > 1 ? ae : void 0
      }));
    }
    const x = N(() => {
      const n = /* @__PURE__ */ new Map();
      function U(o, u, X = [], Y = "one") {
        const ae = !!u && u !== "text" && u !== "record" && X.length === 0 && Y === "one";
        n.set(o, ae);
      }
      for (const o of t.draft.aspects ?? [])
        for (const u of o.attributes ?? []) {
          const X = o.namespace + "." + u.code;
          U(X, Z.value.get(u.type), u.scope, u.cardinality);
        }
      for (const [o, u] of C.value) U(o, u.form, u.scope, u.cardinality);
      return n;
    });
    function c(n) {
      return [...x.value.keys()].filter((U) => n.aspects?.includes(U.split(".")[0]));
    }
    function w(n, U, o) {
      const u = U[o] ?? [], X = new Set(M(n).flatMap((ae) => [...ae.axes ?? [], ...ae.own ?? []])), Y = c(n).filter((ae) => !X.has(ae) && (o === "own" || x.value.get(ae)));
      return E(Y, u);
    }
    const r = N(() => t.draft.channels ?? []);
    function A(n, U) {
      return r.value.filter((o) => (!o.families?.length || o.families.includes(n.code)) && (!U || o.requirements?.includes(U))).map((o) => B(o.id));
    }
    const T = N(() => t.draft.dimensions ?? []), F = J({});
    function ie(n) {
      (t.draft.families ??= []).push({ code: n, aspects: [] }), F.value[n] = !0;
    }
    function me(n) {
      t.draft.families.splice(t.draft.families.indexOf(n), 1), t.schema.declaration.families?.some((U) => U.code === n.code) && d("remove", "families", n.code);
    }
    function M(n) {
      return n.variation ?? [];
    }
    function se(n) {
      (n.variation ??= []).push({ axes: [] });
    }
    function D(n) {
      return n.requirements ?? [];
    }
    function q(n, U) {
      (n.requirements ??= []).push({ id: U, require: [] });
    }
    function G(n, U) {
      return n.context?.[U] ?? "";
    }
    function z(n, U, o) {
      const u = { ...n.context ?? {} };
      o ? u[U] = o : delete u[U], Object.keys(u).length ? n.context = u : delete n.context;
    }
    return (n, U) => (e(), i("div", Ji, [
      f(Pe, {
        count: p.value.length,
        columns: ["details"]
      }, ge({
        default: k(() => [
          (e(!0), i(L, null, ee(p.value, (o) => (e(), I(qe, {
            key: o.code,
            open: F.value[o.code],
            "onUpdate:open": (u) => F.value[o.code] = u,
            title: s(B)(o.code)
          }, {
            details: k(() => [
              a("span", Ki, _(c(o).length) + " fields", 1),
              M(o).length ? (e(), I(s(ye), {
                key: 0,
                severity: "secondary",
                value: M(o).length + (M(o).length === 1 ? " variant level" : " variant levels")
              }, null, 8, ["value"])) : b("", !0),
              a("span", Gi, _(A(o).join(", ") || "No release channels"), 1)
            ]),
            default: k(() => [
              a("div", Yi, [
                a("div", Zi, [
                  a("div", Qi, [
                    a("div", Xi, [
                      a("label", {
                        id: m(o, "groups")
                      }, "Field groups", 8, en)
                    ]),
                    a("p", {
                      id: m(o, "groups-help"),
                      class: "muted small pim-axis-help"
                    }, "Choose the groups that appear on this family’s product forms.", 8, an),
                    f(s(Fa), {
                      disabled: !g.value,
                      "aria-labelledby": m(o, "groups"),
                      "aria-describedby": m(o, "groups-help"),
                      "model-value": o.aspects ?? [],
                      options: K(o),
                      "option-label": "label",
                      "option-value": "value",
                      placeholder: "Choose field groups",
                      display: "chip",
                      "append-to": "self",
                      "onUpdate:modelValue": (u) => s(Fe)(o, "aspects", u)
                    }, null, 8, ["disabled", "aria-labelledby", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])
                  ]),
                  o.aspects?.length ? (e(), I(s(W), {
                    key: 0,
                    type: "button",
                    label: "View family fields",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (u) => d("fields", o.code)
                  }, null, 8, ["onClick"])) : b("", !0)
                ])
              ]),
              a("div", ln, [
                U[3] || (U[3] = a("header", { class: "pim-aspect-head" }, [
                  a("h3", null, "Variants")
                ], -1)),
                U[4] || (U[4] = a("p", { class: "muted small pim-axis-help" }, "Choose what makes one variant different from another. Each field can be used once.", -1)),
                a("div", tn, [
                  (e(!0), i(L, null, ee(M(o), (u, X) => (e(), i("div", {
                    key: X,
                    class: "pim-level"
                  }, [
                    a("div", sn, [
                      a("strong", null, "Level " + _(X + 1), 1),
                      g.value ? (e(), I(s(W), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove level",
                        onClick: (Y) => M(o).splice(X, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: k(() => [
                          f(s(le), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : b("", !0)
                    ]),
                    a("div", nn, [
                      a("div", on, [
                        a("div", dn, [
                          a("label", {
                            id: m(o, X + "-axes")
                          }, "Distinguish variants by", 8, rn)
                        ]),
                        U[0] || (U[0] = a("p", { class: "muted small pim-axis-help" }, "Choose a single-value field with no dimensions. Text and record fields are excluded.", -1)),
                        f(je, {
                          disabled: !g.value,
                          dropdown: "",
                          labelledby: m(o, X + "-axes"),
                          "model-value": u.axes ?? [],
                          options: w(o, u, "axes"),
                          placeholder: "Add an axis",
                          "onUpdate:modelValue": (Y) => u.axes = Y
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]),
                      a("div", un, [
                        a("div", cn, [
                          a("label", {
                            id: m(o, X + "-owned")
                          }, "Other fields edited here", 8, mn)
                        ]),
                        U[1] || (U[1] = a("p", { class: "muted small pim-axis-help" }, "Other fields you edit at this level.", -1)),
                        f(je, {
                          disabled: !g.value,
                          dropdown: "",
                          labelledby: m(o, X + "-owned"),
                          "model-value": u.own ?? [],
                          options: w(o, u, "own"),
                          placeholder: "Add a field",
                          "onUpdate:modelValue": (Y) => Y.length ? u.own = Y : delete u.own
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  g.value ? (e(), I(s(W), {
                    key: 0,
                    type: "button",
                    class: "pim-add-level",
                    onClick: (u) => se(o),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: k(() => [
                      f(s(le), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      U[2] || (U[2] = H(" Add level", -1))
                    ]),
                    _: 1
                  }, 8, ["onClick"])) : b("", !0)
                ])
              ]),
              a("div", pn, [
                U[7] || (U[7] = a("header", { class: "pim-family-requirements-head" }, [
                  a("h3", null, "Release requirements"),
                  a("p", { class: "muted small" }, "Choose what products need before they can be released to a channel.")
                ], -1)),
                a("div", vn, [
                  (e(!0), i(L, null, ee(D(o), (u, X) => (e(), i("div", {
                    key: u.id,
                    class: "pim-level"
                  }, [
                    a("div", fn, [
                      a("div", null, [
                        a("strong", null, _(s(B)(u.id)), 1),
                        a("p", bn, _(A(o, u.id).join(", ") || "Unused by channels"), 1)
                      ]),
                      g.value ? (e(), I(s(W), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove requirement",
                        onClick: (Y) => D(o).splice(X, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: k(() => [
                          f(s(le), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : b("", !0)
                    ]),
                    a("div", yn, [
                      (e(!0), i(L, null, ee(T.value, (Y) => (e(), i("div", {
                        key: Y.name,
                        class: "pim-f pim-w-third"
                      }, [
                        a("div", gn, [
                          a("label", {
                            id: m(o, u.id + "-context-" + Y.name)
                          }, _(s(B)(Y.name)), 9, hn)
                        ]),
                        f(s(we), {
                          disabled: !g.value,
                          "aria-labelledby": m(o, u.id + "-context-" + Y.name),
                          "model-value": G(u, Y.name),
                          "onUpdate:modelValue": (ae) => z(u, Y.name, ae),
                          options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ...Y.members.map((ae) => ({ value: ae, label: String(ae) }))],
                          "option-label": "label",
                          "option-value": "value",
                          appendTo: "self"
                        }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                      ]))), 128)),
                      a("div", kn, [
                        a("div", _n, [
                          a("label", {
                            id: m(o, u.id + "-required")
                          }, "Required", 8, wn)
                        ]),
                        U[5] || (U[5] = a("p", { class: "muted small pim-axis-help" }, "These fields must have a value.", -1)),
                        f(je, {
                          disabled: !g.value,
                          dropdown: "",
                          labelledby: m(o, u.id + "-required"),
                          "model-value": u.require ?? [],
                          placeholder: "Add a required field",
                          options: E(c(o), u.require),
                          "onUpdate:modelValue": (Y) => s(Fe)(u, "require", Y)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]),
                      a("div", $n, [
                        a("div", Cn, [
                          a("label", {
                            id: m(o, u.id + "-authored")
                          }, "Entered for this context", 8, xn)
                        ]),
                        U[6] || (U[6] = a("p", { class: "muted small pim-axis-help" }, "These fields need a value set directly for the selected context.", -1)),
                        f(je, {
                          disabled: !g.value,
                          dropdown: "",
                          labelledby: m(o, u.id + "-authored"),
                          "model-value": u.authored ?? [],
                          placeholder: "Add a field to author",
                          options: E(c(o), u.authored),
                          "onUpdate:modelValue": (Y) => s(Fe)(u, "authored", Y)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  g.value ? (e(), I(Te, {
                    key: 0,
                    label: "Requirement name",
                    action: "Add requirement",
                    "from-name": "",
                    existing: D(o).map((u) => u.id),
                    onAdd: (u) => q(o, u)
                  }, null, 8, ["existing", "onAdd"])) : b("", !0)
                ])
              ]),
              g.value ? (e(), i("div", Vn, [
                f(s(W), {
                  type: "button",
                  label: "Remove family",
                  severity: "danger",
                  text: "",
                  size: "small",
                  onClick: (u) => me(o)
                }, null, 8, ["onClick"])
              ])) : b("", !0)
            ]),
            _: 2
          }, 1032, ["open", "onUpdate:open", "title"]))), 128))
        ]),
        _: 2
      }, [
        g.value ? {
          name: "head",
          fn: k(() => [
            f(Te, {
              label: "Family name",
              action: "Add family",
              "from-name": "",
              existing: p.value.map((o) => o.code),
              onAdd: ie
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])
    ]));
  }
}), An = ["inert"], jn = {
  key: 0,
  class: "row wrap"
}, Sn = {
  key: 2,
  class: "small muted"
}, On = { class: "pim-principal-service" }, Rn = /* @__PURE__ */ de({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(l, { emit: y }) {
    const t = l, d = y, v = J(!1), m = J(""), g = J({});
    let p = 0;
    fe(() => t.modelValue, async (E) => {
      const x = ++p;
      try {
        const c = await Ma(t.catalogId ?? "", E);
        x === p && (g.value = c);
      } catch {
        x === p && (g.value = {});
      }
    }, { immediate: !0, deep: !0 }), Ze(() => {
      p++;
    });
    function C(E) {
      return g.value[E] ?? oe(E, "Person");
    }
    Ba(async () => {
      try {
        await Al("wc-principal-picker"), v.value = !0;
      } catch {
        v.value = !1;
      }
    });
    function O(E) {
      t.disabled || !E.trim() || t.modelValue.includes(E.trim()) || (d("update:modelValue", [...t.modelValue, E.trim()]), m.value = "");
    }
    function K(E) {
      const x = E.detail;
      if (!x || typeof x != "object") return;
      const c = x, w = c.principal_id ?? c.id;
      typeof w == "string" && O(w);
    }
    function Z(E) {
      t.disabled || d("update:modelValue", t.modelValue.filter((x) => x !== E));
    }
    return (E, x) => (e(), i("div", {
      class: "pim-principal-list",
      inert: l.disabled || void 0
    }, [
      l.modelValue.length ? (e(), i("div", jn, [
        (e(!0), i(L, null, ee(l.modelValue, (c) => (e(), I(s(ye), {
          key: c,
          severity: "secondary"
        }, {
          default: k(() => [
            a("span", null, _(C(c)), 1),
            f(s(W), {
              text: "",
              size: "small",
              disabled: l.disabled,
              "aria-label": "Remove " + C(c),
              onClick: (w) => Z(c)
            }, {
              default: k(() => [
                f(s(le), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : b("", !0),
      v.value ? (e(), i("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: Ie(K, ["stop"])
      }, null, 32)) : (e(), i("span", Sn, "The person picker is unavailable.")),
      a("label", On, [
        x[3] || (x[3] = a("span", { class: "small muted" }, "Service account", -1)),
        f(s(Ye), {
          modelValue: m.value,
          "onUpdate:modelValue": x[0] || (x[0] = (c) => m.value = c),
          disabled: l.disabled,
          placeholder: "Service principal id",
          onKeydown: x[1] || (x[1] = aa(Ie((c) => O(m.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "disabled"])
      ]),
      f(s(W), {
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: l.disabled || !m.value.trim(),
        onClick: x[2] || (x[2] = (c) => O(m.value))
      }, {
        default: k(() => [
          f(s(le), { icon: "tabler:plus" }),
          x[4] || (x[4] = H(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, An));
  }
}), In = { class: "pim-stack" }, Tn = { class: "muted small" }, Pn = { class: "muted small" }, qn = { class: "pim-fields" }, Nn = { class: "pim-f pim-w-half" }, Dn = { class: "pim-f-label" }, zn = ["id"], Bn = { class: "pim-f pim-w-half" }, Ln = { class: "pim-f-label" }, Fn = ["id"], En = { class: "muted small" }, Mn = { class: "pim-fields" }, Wn = { class: "pim-f pim-w-third" }, Hn = { class: "pim-f-label" }, Jn = ["id"], Kn = { class: "pim-f pim-w-third" }, Gn = { class: "pim-f-label" }, Yn = ["for"], Zn = { class: "row" }, Qn = ["aria-labelledby"], Xn = { class: "pim-f-label" }, eo = ["id"], ao = { key: 1 }, lo = { class: "pim-f pim-w-full" }, to = { class: "pim-f-label" }, so = ["id"], io = /* @__PURE__ */ de({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {},
    view: {}
  },
  emits: ["remove"],
  setup(l, { emit: y }) {
    const t = l, d = y, v = Ne();
    function m(r, A) {
      return v + "-" + r + "-" + A;
    }
    const g = N(() => t.schema.access.admin), p = N(() => t.draft.channels ?? []), C = N(() => t.draft.sources ?? []), O = N(() => [...new Set((t.draft.families ?? []).flatMap((r) => (r.requirements ?? []).map((A) => A.id)))].map((r) => ({ value: r, label: B(r) }))), K = N(() => (t.draft.families ?? []).filter((r) => r.code !== "generic").map((r) => ({ value: r.code, label: B(r.code) }))), Z = N(() => (t.draft.aspects ?? []).map((r) => ({ value: r.namespace, label: B(r.namespace) })));
    function E(r) {
      (t.draft.channels ??= []).push({ id: r, requirements: [] });
    }
    function x(r) {
      p.value.splice(p.value.indexOf(r), 1), t.schema.declaration.channels?.some((A) => A.id === r.id) && d("remove", "channels", r.id);
    }
    function c(r) {
      (t.draft.sources ??= []).push({ id: r, ordering: "none", writes: [] });
    }
    function w(r) {
      C.value.splice(C.value.indexOf(r), 1), t.schema.declaration.sources?.some((A) => A.id === r.id) && d("remove", "sources", r.id);
    }
    return (r, A) => (e(), i("div", In, [
      l.view !== "sources" ? (e(), I(Pe, {
        key: 0,
        count: p.value.length,
        columns: ["details"]
      }, ge({
        default: k(() => [
          (e(!0), i(L, null, ee(p.value, (T) => (e(), I(qe, {
            key: T.id,
            title: s(B)(T.id)
          }, ge({
            details: k(() => [
              a("span", Tn, _(T.families?.length ? T.families.map(s(B)).join(", ") : "All families"), 1),
              a("span", Pn, _(T.requirements?.length ? T.requirements.map(s(B)).join(", ") : "No release requirements"), 1)
            ]),
            default: k(() => [
              a("div", qn, [
                a("div", Nn, [
                  a("div", Dn, [
                    a("label", {
                      id: m(T.id, "requirements")
                    }, "Release requirements", 8, zn),
                    A[0] || (A[0] = a("span", { class: "pim-f-note" }, "a product is ready for the channel when these hold", -1))
                  ]),
                  f(je, {
                    disabled: !g.value,
                    labelledby: m(T.id, "requirements"),
                    "model-value": T.requirements ?? [],
                    options: O.value,
                    "onUpdate:modelValue": (F) => s(Fe)(T, "requirements", F)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                a("div", Bn, [
                  a("div", Ln, [
                    a("label", {
                      id: m(T.id, "families")
                    }, "Families", 8, Fn),
                    A[1] || (A[1] = a("span", { class: "pim-f-note" }, "empty means every family", -1))
                  ]),
                  f(je, {
                    disabled: !g.value,
                    labelledby: m(T.id, "families"),
                    "model-value": T.families ?? [],
                    options: K.value,
                    "onUpdate:modelValue": (F) => s(Fe)(T, "families", F)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            g.value ? {
              name: "actions",
              fn: k(() => [
                f(s(W), {
                  type: "button",
                  onClick: (F) => x(T),
                  "aria-label": "Remove " + s(B)(T.id),
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
        g.value ? {
          name: "head",
          fn: k(() => [
            f(Te, {
              label: "Channel name",
              action: "Add channel",
              "from-name": "",
              existing: p.value.map((T) => T.id),
              onAdd: E
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])) : b("", !0),
      l.view !== "channels" ? (e(), I(Pe, {
        key: 1,
        count: C.value.length,
        columns: ["details"]
      }, ge({
        default: k(() => [
          (e(!0), i(L, null, ee(C.value, (T) => (e(), I(qe, {
            key: T.id,
            title: s(B)(T.id)
          }, ge({
            details: k(() => [
              a("span", En, _(T.writes?.length ? T.writes.map(s(B)).join(", ") : "No field groups selected"), 1)
            ]),
            default: k(() => [
              a("div", Mn, [
                a("div", Wn, [
                  a("div", Hn, [
                    a("label", {
                      id: m(T.id, "ordering")
                    }, "Handle incoming updates", 8, Jn),
                    A[2] || (A[2] = a("span", { class: "pim-f-note" }, "sequence keeps late deliveries from winning", -1))
                  ]),
                  f(s(we), {
                    disabled: !g.value,
                    "aria-labelledby": m(T.id, "ordering"),
                    "model-value": T.ordering ?? "none",
                    "onUpdate:modelValue": (F) => T.ordering = F,
                    options: [{ value: "none", label: "Use arrival order" }, { value: "sequence", label: "Use the source’s sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                a("div", Kn, [
                  a("div", Gn, [
                    a("label", {
                      for: m(T.id, "audit")
                    }, "Audit", 8, Yn),
                    A[3] || (A[3] = a("span", { class: "pim-f-note" }, "record each value change", -1))
                  ]),
                  a("div", Zn, [
                    f(s(la), {
                      disabled: !g.value,
                      "input-id": m(T.id, "audit"),
                      "model-value": T.audit !== !1,
                      "onUpdate:modelValue": (F) => F ? delete T.audit : T.audit = !1
                    }, null, 8, ["disabled", "input-id", "model-value", "onUpdate:modelValue"]),
                    a("span", null, _(T.audit === !1 ? "Off for this source" : "Follow catalog audit settings"), 1)
                  ])
                ]),
                a("div", {
                  class: "pim-f pim-w-third",
                  role: "group",
                  "aria-labelledby": m(T.id, "people")
                }, [
                  a("div", Xn, [
                    a("label", {
                      id: m(T.id, "people")
                    }, "People and service accounts", 8, eo),
                    A[4] || (A[4] = a("span", { class: "pim-f-note" }, "who may write as this source", -1))
                  ]),
                  g.value ? (e(), I(Rn, {
                    key: 0,
                    "catalog-id": l.catalogId,
                    "model-value": T.principals ?? [],
                    "onUpdate:modelValue": (F) => s(Fe)(T, "principals", F)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])) : (e(), i("span", ao, _(T.principals?.length ? T.principals.length + (T.principals.length === 1 ? " allowed account" : " allowed accounts") : "No accounts specified"), 1))
                ], 8, Qn),
                a("div", lo, [
                  a("div", to, [
                    a("label", {
                      id: m(T.id, "writes")
                    }, "Field groups it can update", 8, so),
                    A[5] || (A[5] = a("span", { class: "pim-f-note" }, "field groups this source may set", -1))
                  ]),
                  f(je, {
                    disabled: !g.value,
                    labelledby: m(T.id, "writes"),
                    "model-value": T.writes ?? [],
                    options: Z.value,
                    "onUpdate:modelValue": (F) => s(Fe)(T, "writes", F)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            g.value ? {
              name: "actions",
              fn: k(() => [
                f(s(W), {
                  type: "button",
                  onClick: (F) => w(T),
                  "aria-label": "Remove " + s(B)(T.id),
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
        g.value ? {
          name: "head",
          fn: k(() => [
            f(Te, {
              label: "Source name",
              action: "Add source",
              "from-name": "",
              existing: C.value.map((T) => T.id),
              onAdd: c
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])) : b("", !0)
    ]));
  }
}), no = {
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
function oo(l, y) {
  return !l.active || !l.installed || l.problem || l.lifecycle.state === "failed" ? !1 : l.lifecycle.state === "pending" || Object.values(l.projections).some((t) => Ha(t, y));
}
function ro(l, y) {
  const t = l.problem ?? l.lifecycle.error, d = Object.entries(l.projections), v = d.find(([, g]) => g.parked) ?? d.find(([, g]) => g.error) ?? d.find(([, g]) => Ha(g, y));
  let m;
  return l.active && !l.installed ? m = "uninstalled" : t?.code === "plugin_config_invalid" ? m = "config" : t?.code === "plugin_projection_history_pruned" ? m = "reset" : t || l.lifecycle.state === "failed" ? m = "failed" : l.active && v?.[1].parked ? m = "paused" : l.active && v?.[1].error ? m = "degraded" : l.active && v ? m = "catchingUp" : l.active && l.lifecycle.state === "pending" && (m = "pending"), m ? { kind: m, ...no[m], error: t, projection: v } : void 0;
}
function uo(l) {
  return (l.problem ?? l.lifecycle.error)?.code === "plugin_interface_version_unsupported";
}
const co = { class: "pim-stack" }, mo = { class: "pim-bsection-head" }, po = { class: "muted small" }, vo = {
  key: 0,
  class: "pim-aspect muted"
}, fo = {
  key: 0,
  class: "muted small"
}, bo = { class: "pim-stack pim-plugin-recovery" }, yo = {
  key: 0,
  class: "muted small"
}, go = {
  key: 1,
  class: "muted small"
}, ho = { key: 0 }, ko = { key: 1 }, _o = { key: 0 }, wo = { key: 0 }, $o = { key: 0 }, Co = { key: 1 }, xo = { key: 2 }, Vo = { key: 3 }, Uo = { key: 0 }, Ao = {
  key: 0,
  class: "pim-ia-action"
}, jo = {
  key: 0,
  class: "pim-ia-dialog"
}, So = { class: "pim-ia-dialog-head" }, Oo = { key: 1 }, Ro = { key: 2 }, Io = { class: "row pim-ia-dialog-actions" }, To = {
  key: 0,
  class: "pim-aspect muted"
}, Po = { class: "row wrap muted small" }, qo = /* @__PURE__ */ de({
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
    const t = l, d = y, v = /* @__PURE__ */ new Map([
      ["eq", "Equals"],
      ["in", "Is one of"],
      ["gt", "Greater than"],
      ["gte", "At least"],
      ["lt", "Less than"],
      ["lte", "At most"]
    ]), m = J({}), g = J(), p = N(() => c.value.find((D) => D.plugin.plugin === g.value)), C = N(() => p.value?.plugin), O = N(() => t.options.plugins.filter((D) => D.installed).length), K = N(() => t.schema.access.admin), Z = N(() => t.draft.plugins ?? []), E = N(() => new Map(t.schema.plugins.map((D) => [D.plugin, D]))), x = N(() => {
      const D = /* @__PURE__ */ new Map();
      for (const [q, G] of Object.entries(t.schema.attributes)) {
        if (!G.plugin) continue;
        const z = D.get(G.plugin) ?? [];
        z.push(B(q)), D.set(G.plugin, z);
      }
      return D;
    }), c = N(() => t.options.plugins.map((D) => {
      const q = E.value.get(D.plugin) ?? D, G = ro(q, t.schema.as_of), z = Z.value.some((n) => n.use === q.plugin);
      return {
        option: D,
        plugin: q,
        status: G,
        chosen: z,
        title: oe(q.title ?? D.title, q.installed ? "Plugin" : "Unavailable plugin"),
        label: !q.active && G?.kind === "failed" ? "Unavailable" : G?.label ?? (z ? q.active ? "Enabled" : "Will enable on apply" : q.active ? "Will disable on apply" : "Disabled"),
        severity: G?.severity ?? (z ? "success" : "secondary")
      };
    }));
    function w(D, q) {
      const G = q.map((z) => v.get(z)).filter(Boolean);
      return [B(D), G.join(", ")].filter(Boolean).join(" · ");
    }
    function r(D, q) {
      q && !Z.value.some((G) => G.use === D) && (t.draft.plugins ??= []).push({ use: D }), q || (t.draft.plugins = Z.value.filter((G) => G.use !== D), delete t.pluginConfigs[D], E.value.get(D)?.active && d("remove", "plugins", D));
    }
    function A(D, q) {
      m.value[D] = !0, t.pluginConfigs[D] = q;
    }
    function T(D, q) {
      const G = D.config_schema.properties;
      return oe(G?.[q]?.title ?? B(q), "this setting");
    }
    const F = N(() => t.draft.scopes ?? []);
    function ie(D) {
      return F.value.includes(D.id);
    }
    function me(D, q) {
      q && !ie(D) && (t.draft.scopes ??= []).push(D.id), !q && ie(D) && (F.value.splice(F.value.indexOf(D.id), 1), t.schema.declaration.scopes?.includes(D.id) && d("remove", "scopes", D.id));
    }
    const M = N(() => {
      const D = C.value;
      if (!D) return [];
      const q = D.references;
      return [
        { label: "Fields", items: (q?.fields ?? Object.entries(t.schema.attributes).filter(([, z]) => z.plugin === D.plugin).map(([z]) => z)).map((z) => ({ id: z, title: oe(B(z), "Field") })) },
        { label: "Product filter sets", items: (q?.scopes ?? []).map((z) => ({
          id: z,
          title: oe(t.options.scopes.find((n) => n.id === z)?.title, "Unavailable filter set")
        })) },
        { label: "Catalog app binding", items: (q?.shell_bindings ?? []).map((z) => ({ id: z, title: "Catalog app" })) },
        { label: "Readiness checks", items: (q?.checks ?? []).map((z) => ({ id: z, title: "Readiness check" })) },
        { label: "Dependent plugins", items: (q?.plugins ?? []).map((z) => ({
          id: z,
          title: oe(E.value.get(z)?.title, "Dependent plugin")
        })) }
      ].filter((z) => z.items.length);
    });
    function se(D) {
      for (const q of D.references?.scopes ?? [])
        F.value.includes(q) && (t.draft.scopes = F.value.filter((G) => G !== q), d("remove", "scopes", q));
      g.value = void 0, r(D.plugin, !1), d("review");
    }
    return (D, q) => (e(), i("div", co, [
      f(Pe, {
        count: c.value.length,
        columns: ["details"]
      }, {
        head: k(() => [
          a("header", mo, [
            q[6] || (q[6] = a("h3", null, "Plugins", -1)),
            a("span", po, _(O.value) + " installed", 1)
          ])
        ]),
        default: k(() => [
          c.value.length === 0 ? (e(), i("div", vo, "No plugin is installed.")) : b("", !0),
          (e(!0), i(L, null, ee(c.value, ({ option: G, plugin: z, status: n, chosen: U, title: o, label: u, severity: X }) => (e(), I(qe, {
            key: z.plugin,
            title: o,
            open: m.value[z.plugin] ?? !!(z.active && n && n.kind !== "pending"),
            "onUpdate:open": (Y) => m.value[z.plugin] = Y
          }, ge({
            details: k(() => [
              f(s(ye), {
                severity: X,
                value: u
              }, null, 8, ["severity", "value"]),
              !n && G.description ? (e(), i("span", fo, _(s(oe)(G.description, "Adds capabilities to this catalog.")), 1)) : b("", !0)
            ]),
            default: k(() => [
              a("div", bo, [
                x.value.get(z.plugin)?.length ? (e(), i("p", yo, " Adds fields for " + _(x.value.get(z.plugin)?.join(", ")) + ". ", 1)) : b("", !0),
                z.active && n?.kind === "failed" && n.projection?.[1].parked ? (e(), i("p", go, " Background update: Paused ")) : b("", !0),
                n?.kind === "failed" ? (e(), i(L, { key: 2 }, [
                  f(s($e), {
                    severity: "warn",
                    role: "alert"
                  }, {
                    default: k(() => [
                      s(uo)(z) ? (e(), i(L, { key: 0 }, [
                        H("This package uses a plugin interface this deployment cannot run. Restore a compatible package to use this plugin.")
                      ], 64)) : (e(), i(L, { key: 1 }, [
                        H("The catalog could not set up this plugin. Check the status after resolving the setup problem.")
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
                        q[7] || (q[7] = H("Plugin ", -1)),
                        a("code", null, _(z.plugin), 1)
                      ]),
                      n.error?.message ? (e(), i("p", ho, _(n.error.message), 1)) : b("", !0),
                      n.error?.code ? (e(), i("p", ko, [
                        a("code", null, _(n.error.code), 1)
                      ])) : b("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  K.value && z.references ? (e(), I(s(W), {
                    key: 0,
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (Y) => g.value = z.plugin
                  }, null, 8, ["onClick"])) : (e(), I(s(W), {
                    key: 1,
                    label: "Check status",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: q[0] || (q[0] = (Y) => d("refresh"))
                  }))
                ], 64)) : n?.kind === "reset" ? (e(), i(L, { key: 3 }, [
                  f(s($e), { severity: "warn" }, {
                    default: k(() => [
                      q[8] || (q[8] = H(" The event history this background update needs was removed. ", -1)),
                      n.error?.max_pruned_seq !== void 0 ? (e(), i("p", _o, "Earliest retained position " + _(n.error.max_pruned_seq + 1) + ".", 1)) : b("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  f(Re, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: k(() => [
                      a("p", null, [
                        q[9] || (q[9] = H("Plugin ", -1)),
                        a("code", null, _(z.plugin), 1)
                      ]),
                      n.error?.projection ? (e(), i("p", wo, [
                        q[10] || (q[10] = H("Background update ", -1)),
                        a("code", null, _(n.error.projection), 1)
                      ])) : b("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  K.value ? (e(), I(s(W), {
                    key: 0,
                    label: "Reset background updates",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: l.stale,
                    onClick: (Y) => d("reset", z.plugin)
                  }, null, 8, ["disabled", "onClick"])) : b("", !0)
                ], 64)) : n?.projection && (n.kind === "paused" || n.kind === "degraded" || n.kind === "catchingUp") ? (e(), i(L, { key: 4 }, [
                  f(s($e), {
                    severity: n.kind === "catchingUp" ? "info" : "warn"
                  }, {
                    default: k(() => [
                      n.projection[1].status === "paused" ? (e(), i("p", $o, "This update was paused.")) : n.kind === "paused" ? (e(), i("p", Co, "The background worker stopped.")) : n.kind === "degraded" ? (e(), i("p", xo, "The background worker reported an error.")) : (e(), i("p", Vo, "This update is processing catalog changes.")),
                      a("p", null, "Last applied position " + _(n.projection[1].last_seq) + ".", 1)
                    ]),
                    _: 2
                  }, 1032, ["severity"]),
                  f(Re, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: k(() => [
                      a("p", null, [
                        q[11] || (q[11] = H("Background update ", -1)),
                        a("code", null, _(n.projection[0]), 1)
                      ]),
                      n.projection[1].error ? (e(), i("p", Uo, _(n.projection[1].error), 1)) : b("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  K.value && n.projection[1].status === "paused" && n.projection[1].cursor_id ? (e(), I(s(W), {
                    key: 0,
                    label: "Resume background update",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: l.stale,
                    onClick: (Y) => d("resume", n.projection[1].cursor_id)
                  }, null, 8, ["disabled", "onClick"])) : n.kind === "paused" && K.value ? (e(), I(s(W), {
                    key: 1,
                    label: "Reset background updates",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: l.stale,
                    onClick: (Y) => d("reset", z.plugin)
                  }, null, 8, ["disabled", "onClick"])) : (e(), I(s(W), {
                    key: 2,
                    label: "Check status",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: q[1] || (q[1] = (Y) => d("refresh"))
                  }))
                ], 64)) : n?.kind === "uninstalled" ? (e(), i(L, { key: 5 }, [
                  f(s($e), { severity: "warn" }, {
                    default: k(() => [...q[12] || (q[12] = [
                      H("The package was removed while it was still enabled for this catalog.", -1)
                    ])]),
                    _: 1
                  }),
                  f(s(W), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (Y) => g.value = z.plugin
                  }, null, 8, ["onClick"])
                ], 64)) : U ? (e(), i(L, { key: 6 }, [
                  f(wa, {
                    disabled: !K.value,
                    schema: G.config_schema,
                    "model-value": l.pluginConfigs[z.plugin] ?? z.config ?? {},
                    problem: n?.kind === "config" ? n.error : void 0,
                    "plugin-id": n?.kind === "config" ? z.plugin : void 0,
                    "problem-label": n?.error?.field && n.error.field !== "config" ? T(G, n.error.field) : void 0,
                    "onUpdate:modelValue": (Y) => A(z.plugin, Y)
                  }, null, 8, ["disabled", "schema", "model-value", "problem", "plugin-id", "problem-label", "onUpdate:modelValue"]),
                  K.value && z.active && (l.pluginConfigs[z.plugin] || n?.kind === "config") ? (e(), i("div", Ao, [
                    f(s(W), {
                      disabled: l.stale || !l.pluginConfigs[z.plugin],
                      label: "Save configuration",
                      size: "small",
                      onClick: (Y) => d("configure", z.plugin, l.pluginConfigs[z.plugin])
                    }, null, 8, ["disabled", "onClick"])
                  ])) : b("", !0)
                ], 64)) : b("", !0)
              ])
            ]),
            _: 2
          }, [
            K.value && z.installed && (!n || n.kind === "pending") ? {
              name: "actions",
              fn: k(() => [
                f(s(la), {
                  "aria-label": "Enable " + o,
                  "model-value": U,
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
        onClose: q[5] || (q[5] = (G) => g.value = void 0)
      }, {
        default: k(() => [
          p.value && C.value ? (e(), i("section", jo, [
            a("header", So, [
              a("div", null, [
                q[13] || (q[13] = a("h2", null, "Plugin references", -1)),
                a("p", null, _(p.value.title), 1)
              ])
            ]),
            M.value.length ? (e(), i(L, { key: 0 }, [
              q[14] || (q[14] = a("p", null, "Replace or remove these references before deactivating the plugin. You can also restore the package to keep using them.", -1)),
              (e(!0), i(L, null, ee(M.value, (G) => (e(), i("div", {
                key: G.label
              }, [
                a("h3", null, _(G.label), 1),
                a("ul", null, [
                  (e(!0), i(L, null, ee(G.items, (z) => (e(), i("li", {
                    key: z.id
                  }, _(z.title), 1))), 128))
                ])
              ]))), 128))
            ], 64)) : (e(), i("p", Oo, "Use the catalog review to see what deactivating this plugin would change.")),
            C.value.references?.scopes.length && !C.value.references?.shell_bindings.length ? (e(), i("p", Ro, "Reviewing removal also includes these product filter sets.")) : b("", !0),
            f(Re, {
              class: "small pim-error-code pim-ia-disclosure",
              label: "Technical details"
            }, {
              default: k(() => [
                a("p", null, [
                  q[15] || (q[15] = H("Plugin ", -1)),
                  a("code", null, _(C.value.plugin), 1)
                ]),
                (e(!0), i(L, null, ee(M.value, (G) => (e(), i("div", {
                  key: G.label
                }, [
                  a("p", null, _(G.label), 1),
                  a("ul", null, [
                    (e(!0), i(L, null, ee(G.items, (z) => (e(), i("li", {
                      key: z.id
                    }, [
                      a("code", null, _(z.id), 1)
                    ]))), 128))
                  ])
                ]))), 128))
              ]),
              _: 1
            }),
            a("div", Io, [
              K.value && C.value.references?.shell_bindings.length ? (e(), I(s(W), {
                key: 0,
                label: "Clear catalog app binding",
                severity: "secondary",
                outlined: "",
                disabled: l.stale,
                onClick: q[2] || (q[2] = (G) => d("clearShellBinding", C.value.references.shell_bindings[0]))
              }, null, 8, ["disabled"])) : K.value ? (e(), I(s(W), {
                key: 1,
                label: "Review removal",
                disabled: l.stale,
                onClick: q[3] || (q[3] = (G) => se(C.value))
              }, null, 8, ["disabled"])) : b("", !0),
              f(s(W), {
                label: "Close",
                severity: "secondary",
                outlined: "",
                onClick: q[4] || (q[4] = (G) => g.value = void 0)
              })
            ])
          ])) : b("", !0)
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
          l.options.scopes.length === 0 ? (e(), i("div", To, "No product filter sets are available.")) : b("", !0),
          (e(!0), i(L, null, ee(l.options.scopes, (G) => (e(), I(qe, {
            key: G.id,
            title: s(oe)(G.title, "Filter set")
          }, ge({
            details: k(() => [
              f(s(ye), {
                severity: ie(G) ? "success" : "secondary",
                value: ie(G) ? "Selected" : "Available"
              }, null, 8, ["severity", "value"])
            ]),
            default: k(() => [
              a("div", Po, [
                q[17] || (q[17] = a("span", null, "Filters", -1)),
                (e(!0), i(L, null, ee(G.filters, (z, n) => (e(), I(s(ye), {
                  key: n,
                  class: "kx-tag-sm small",
                  severity: "secondary",
                  value: w(n, z.ops)
                }, null, 8, ["value"]))), 128)),
                a("span", null, _(s(B)(G.access)) + " access required", 1)
              ])
            ]),
            _: 2
          }, [
            K.value ? {
              name: "actions",
              fn: k(() => [
                f(s(la), {
                  "aria-label": "Use " + s(oe)(G.title, "Filter set"),
                  "model-value": ie(G),
                  "onUpdate:modelValue": (z) => me(G, z)
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
async function No(l) {
  const y = await cl(`/api/v1/pim-admin/catalogs/${encodeURIComponent(l)}/policy_defaults`, "policy defaults");
  if (y.audit !== "fields" && y.audit !== "off" || !["audit_days", "trash_days", "tombstone_days"].every((t) => typeof y[t] == "number" && Number.isSafeInteger(y[t])))
    throw new Error("Policy defaults are unavailable.");
  for (const [t, d] of Object.entries(Ja)) {
    const v = y[t];
    if (typeof v != "number" || !Number.isSafeInteger(v) || v < d.min || v > d.max) throw new Error(`Policy ${t} is unavailable.`);
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
}, Do = { class: "form" }, zo = {
  key: 0,
  class: "muted small pim-policy-intro"
}, Bo = {
  key: 1,
  class: "muted small pim-policy-status",
  role: "status"
}, Lo = {
  key: 0,
  class: "pim-bsection-head"
}, Fo = { class: "pim-policy-copy" }, Eo = ["for"], Mo = ["id"], Wo = { key: 0 }, Ho = {
  key: 0,
  class: "pim-policy-value"
}, Jo = {
  key: 0,
  class: "muted small"
}, Ko = /* @__PURE__ */ de({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {},
    disabled: { type: Boolean },
    defaultsOnly: { type: Boolean }
  },
  setup(l) {
    const y = l, t = J(), d = N(() => y.defaults ?? t.value), v = J(), m = J(!1);
    async function g() {
      if (!(y.defaults || y.disabled)) {
        v.value = void 0, m.value = !0;
        try {
          t.value = await No(y.catalogId ?? "");
        } catch (r) {
          v.value = Ee(r, "Could not read policy defaults.");
        } finally {
          m.value = !1;
        }
      }
    }
    Ba(g);
    const p = N(() => y.draft.policy ?? {}), C = [
      { key: "audit", title: "Audit trail", hint: "Fields records each value change. Off records only lifecycle, schema and release history.", kind: "enum" },
      { key: "audit_days", title: "Audit retention (days)", hint: "0 uses the 365-day default. History always expires.", kind: "int", min: 0, max: 106751 },
      { key: "trash_days", title: "Trash window (days)", hint: "How long a deleted product stays restorable.", kind: "int", min: 1, max: 106751 },
      { key: "tombstone_days", title: "Deleted product notices (days)", hint: "How long feeds report a purged product as deleted.", kind: "int", min: 1, max: 106751 }
    ], O = {
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
    function K(r) {
      const A = Ja[r];
      return { key: r, ...A, kind: "int", hint: O[r] };
    }
    C.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(K));
    const Z = ["proposal_days", "proposal_count"].map(K), E = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(K), x = [
      { id: "retention", title: "Retention", keys: C },
      { id: "proposals", title: "Proposals", keys: Z },
      { id: "advanced", title: "", keys: E }
    ], c = N(() => [
      { value: "inherited", label: d.value ? `${d.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function w(r, A) {
      const T = y.draft.policy ?? (y.draft.policy = {});
      T[r] = A == null || A === "" || A === "inherited" ? !1 : A;
    }
    return (r, A) => (e(), i("section", Do, [
      l.defaultsOnly ? b("", !0) : (e(), i("p", zo, "Empty fields inherit the deployment settings.")),
      m.value ? (e(), i("p", Bo, "Loading deployment defaults…")) : b("", !0),
      v.value ? (e(), I(ua, {
        key: 2,
        error: v.value
      }, {
        default: k(() => [
          f(s(W), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: g
          }, {
            default: k(() => [...A[0] || (A[0] = [
              H("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : b("", !0),
      (e(), i(L, null, ee(x, (T) => f(Da(T.id === "advanced" ? Re : "section"), xl({
        key: T.id,
        ref_for: !0
      }, T.id === "advanced" ? { label: "Advanced processing settings" } : { "aria-label": T.title }, {
        "data-policy-group": T.id,
        class: "pim-policy-group"
      }), {
        default: k(() => [
          T.title ? (e(), i("header", Lo, [
            a("h3", null, _(T.title), 1)
          ])) : b("", !0),
          (e(!0), i(L, null, ee(T.keys, (F) => (e(), i("div", {
            key: F.key,
            class: "pim-policy-row"
          }, [
            a("div", Fo, [
              a("label", {
                for: "pol-" + F.key
              }, _(F.title), 9, Eo),
              a("p", {
                id: "pol-help-" + F.key
              }, [
                H(_(F.hint), 1),
                F.global ? (e(), i("span", Wo, " Managed in deployment settings.")) : b("", !0)
              ], 8, Mo)
            ]),
            l.defaultsOnly ? (e(), i("p", Ho, [
              H(_(d.value?.[F.key] === "fields" ? "Record field changes" : d.value?.[F.key] === "off" ? "Lifecycle and release history" : d.value?.[F.key] ?? "Unavailable") + " ", 1),
              p.value[F.key] !== void 0 && p.value[F.key] !== !1 ? (e(), i("span", Jo, " · Catalog override applies")) : b("", !0)
            ])) : F.kind === "enum" ? (e(), I(s(we), {
              key: 1,
              disabled: l.disabled,
              "input-id": "pol-" + F.key,
              "aria-describedby": "pol-help-" + F.key,
              class: "pim-policy-control",
              "model-value": typeof p.value[F.key] == "string" ? p.value[F.key] : "inherited",
              options: c.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": (ie) => w(F.key, ie)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])) : (e(), I(s(Sl), {
              key: 2,
              disabled: l.disabled || F.global,
              "input-id": "pol-" + F.key,
              "aria-describedby": "pol-help-" + F.key,
              class: "pim-policy-control",
              "model-value": F.global ? Number(d.value?.[F.key] ?? 0) || null : typeof p.value[F.key] == "number" ? Number(p.value[F.key]) : null,
              min: F.min ?? (F.key === "audit_days" ? 0 : 1),
              max: F.max,
              step: 1,
              placeholder: d.value ? "Default: " + d.value[F.key] : "Deployment default",
              "onUpdate:modelValue": (ie) => w(F.key, ie)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "min", "max", "placeholder", "onUpdate:modelValue"]))
          ]))), 128))
        ]),
        _: 2
      }, 1040, ["data-policy-group"])), 64))
    ]));
  }
}), Go = { class: "form" }, Yo = { class: "pim-aspect" }, Zo = { class: "pim-aspect-head" }, Qo = {
  key: 0,
  class: "muted small"
}, Xo = /* @__PURE__ */ de({
  __name: "BuilderDeclaration",
  props: {
    draft: {},
    readonly: { type: Boolean }
  },
  emits: ["replace", "validity"],
  setup(l, { emit: y }) {
    const t = l, d = y, v = J(JSON.stringify(t.draft, null, 2)), m = J("");
    Ze(() => d("validity", !0)), fe(() => t.draft, (p) => {
      v.value = JSON.stringify(p, null, 2), m.value = "";
    }, { deep: !0 });
    function g() {
      if (!t.readonly)
        try {
          const p = Ml(v.value);
          m.value = "", d("validity", !0), d("replace", p);
        } catch (p) {
          d("validity", !1), m.value = "Invalid declaration: " + (p instanceof Error ? p.message : String(p));
        }
    }
    return (p, C) => (e(), i("section", Go, [
      a("div", Yo, [
        a("header", Zo, [
          C[1] || (C[1] = a("h3", null, "Declaration", -1)),
          l.readonly ? b("", !0) : (e(), i("span", Qo, "edits apply to the draft when the JSON parses"))
        ]),
        m.value ? (e(), I(s($e), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: k(() => [
            H(_(m.value), 1)
          ]),
          _: 1
        })) : b("", !0),
        f(s(Ol), {
          modelValue: v.value,
          "onUpdate:modelValue": C[0] || (C[0] = (O) => v.value = O),
          readonly: l.readonly,
          "aria-label": "Catalog declaration",
          rows: "28",
          spellcheck: "false",
          onInput: g,
          onBlur: g,
          class: "mono pim-json-edit"
        }, null, 8, ["modelValue", "readonly"])
      ])
    ]));
  }
}), ed = { class: "pim-section-layout" }, ad = { class: "kx-main" }, ld = ["aria-label"], td = { class: "pim-builder-main" }, sd = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, id = ["disabled", "inert"], nd = { class: "pim-overview-grid" }, od = { class: "kx-card-head" }, dd = { class: "kx-head-icon" }, rd = { class: "kx-card-id" }, ud = { class: "kx-card-name" }, cd = { class: "kx-card-meta" }, md = { class: "kx-card-desc" }, pd = { class: "pim-advanced-actions" }, vd = { class: "pim-ia-action" }, fd = { class: "pim-ia-action" }, bd = { class: "pim-ia-dialog" }, yd = { class: "pim-ia-dialog-head" }, gd = {
  key: 0,
  class: "dialog-actions"
}, hd = ["aria-labelledby"], kd = { class: "pim-ia-dialog-head" }, _d = ["id"], wd = { class: "pim-ia-review-impact" }, $d = { key: 0 }, Cd = { key: 1 }, xd = { key: 2 }, Vd = { key: 3 }, Ud = { key: 4 }, Ad = { key: 0 }, jd = {
  key: 0,
  class: "pim-plan-list"
}, Sd = { key: 1 }, Od = {
  key: 1,
  class: "pim-ia-review-impact"
}, Rd = {
  key: 0,
  class: "row pim-review-confirm"
}, Id = ["for"], Td = { class: "dialog-actions pim-ia-dialog-actions" }, Pd = /* @__PURE__ */ de({
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
  emits: ["applied", "back", "dirty-changed"],
  setup(l, { emit: y }) {
    const t = l, d = y, v = {
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
    }, m = J("General"), g = J("Overview"), p = J(""), C = J(), O = J(!1), K = J(), Z = Object.keys(v).map(($) => ({
      heading: $ === "Channels" ? "Publishing and imports" : $,
      items: v[$].items.map((h) => ({ ...h, value: h.label, section: $ }))
    })), E = [
      ...Z.filter(($) => $.items.length > 1),
      { heading: "Manage catalog", items: Z.filter(($) => $.items.length === 1).flatMap(($) => $.items) }
    ], x = E.flatMap(($) => $.items), c = N(() => M.value && se.value ? [
      { ...E[0], heading: t.title || "Catalog" },
      ...E.slice(1)
    ] : []), w = N(() => t.backLabel ? {
      value: "all-catalogs",
      label: t.embedded ? "All catalogs" : t.backLabel,
      icon: "tabler:table"
    } : void 0), r = J();
    fe(r, ($) => {
      t.focusBack && $?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    function A($) {
      if ($ === "all-catalogs") {
        d("back");
        return;
      }
      const h = x.find((R) => R.label === $);
      h && T(h.section, h.label);
    }
    function T($, h = v[$].items[0].label) {
      m.value === $ && g.value === h || (m.value = $, g.value = h, K.value && (K.value.scrollTop = 0));
    }
    function F($) {
      C.value = $, O.value = !0;
    }
    function ie($) {
      p.value = $, T("Products", "Fields");
    }
    function me($, h, R = h + "s") {
      return $ + " " + ($ === 1 ? h : R);
    }
    const M = J(null), se = J(null), D = J({}), q = J({}), G = J({}), z = N(() => Object.fromEntries(Object.entries(G.value).filter(([$]) => D.value.plugins?.some((h) => h.use === $) && !M.value?.plugins.some((h) => h.plugin === $ && h.active)))), n = J(), U = J(!1), o = J(null), u = J(!1), X = N(() => M.value?.access.admin === !0), Y = J(""), ae = J(null), Ce = J(!1), Me = J(!1), ve = J(null), De = Ne(), ta = {
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
    }, Se = J(null), Ae = J(!0), pe = Ke(), j = N(() => Ce.value && Qe.value && (!va.value.length || Me.value) && !U.value && Ae.value && !!ae.value && ae.value.class !== "refused" && !!Se.value?.matches(ze.value, M.value?.schema_generation ?? -1, z.value)), S = N(() => ae.value ? [...ae.value.refused, ...ae.value.changes.filter(($) => $.class !== "refused")] : []), P = Ke(), V = Ke(), re = J(!1);
    let Q = 0;
    fe([D, q, G], () => {
      Q++, _e();
    }, { deep: !0, flush: "sync" });
    async function he($ = !1, h = !1) {
      if (Oe.value && !$) return;
      const R = P.begin(), te = Q, ue = t.catalogId, be = h ? Object.entries(G.value).filter(([xe]) => M.value?.plugins.some((sa) => sa.plugin === xe && sa.active)) : [];
      re.value = !0, n.value = void 0;
      try {
        const [xe, sa] = await Promise.all([ce.schema(ue), ce.schemaOptions(ue)]);
        if (!P.current(R) || te !== Q || ue !== t.catalogId) return;
        M.value = xe, se.value = sa, D.value = Xe(xe.declaration), q.value = {}, G.value = Object.fromEntries(be.filter(([dl]) => xe.plugins.some((Ia) => Ia.plugin === dl && Ia.active))), _e(), Ae.value = !0, U.value = !1;
      } catch (xe) {
        P.current(R) && (n.value = Ee(xe, "Could not load settings."));
      } finally {
        P.current(R) && (re.value = !1);
      }
    }
    let ke = () => {
    };
    fe(() => t.catalogId, ($) => {
      ke(), ke = La(`component.${$}`, () => {
        !Oe.value && !u.value ? he() : g.value === "Plugins" && !u.value && Be();
      });
    }, { immediate: !0 });
    const ma = ra(async () => {
      !Oe.value && !u.value ? await he() : g.value === "Plugins" && !u.value && await Be();
    });
    Ze(() => {
      ke(), pe.begin(), P.begin(), V.begin();
    });
    const $a = N(() => ma.value !== !1 && g.value === "Plugins" && !u.value && M.value?.plugins.some(($) => oo($, M.value.as_of)) === !0);
    fe($a, ($, h, R) => {
      if (!$) return;
      let te, ue = !0;
      const be = () => {
        te = setTimeout(async () => {
          await Be() && ue && $a.value && be();
        }, 2e3);
      };
      be(), R(() => {
        ue = !1, clearTimeout(te);
      });
    }), fe(() => t.catalogId, () => {
      pe.begin(), u.value = !1, U.value = !1, M.value = null, se.value = null, fa(), he();
    });
    const Ka = N(() => Object.values(Ta(D.value, q.value)).reduce(($, h) => $ + (h?.length ?? 0), 0)), Qe = N(() => !!M.value && (JSON.stringify(D.value) !== JSON.stringify(M.value.declaration) || Ka.value > 0 || Object.keys(z.value).length > 0)), Oe = N(() => Qe.value || Object.keys(G.value).length > 0);
    fe(Oe, ($) => d("dirty-changed", $), { immediate: !0 });
    const pa = N(() => D.value.families?.filter(($) => $.code !== "generic") ?? []), Ca = N(() => D.value.aspects ?? []), xa = N(() => Ca.value.reduce(($, h) => $ + (h.attributes?.length ?? 0), 0)), Ga = N(() => {
      const $ = new Set(D.value.plugins?.map((h) => h.use));
      return Object.values(M.value?.attributes ?? {}).filter((h) => h.plugin && $.has(h.plugin)).length;
    }), Ya = N(() => !xa.value && !Ca.value.length && !pa.value.length), Va = N(() => D.value.channels ?? []), Za = N(() => D.value.sources ?? []), Ua = N(() => M.value?.plugins.filter(($) => $.active) ?? []), Aa = N(() => t.catalog?.product_count ?? t.catalog?.item_count), Qa = N(() => [
      {
        section: "Products",
        label: "Product setup",
        icon: "tabler:packages",
        summary: [
          ...typeof Aa.value == "number" ? [me(Aa.value, "product")] : [],
          me(pa.value.length, "family", "families"),
          me(xa.value + Ga.value, "field")
        ].join(" · "),
        detail: pa.value.map(($) => B($.code)).join(", ") || "Create a family for products that share the same fields."
      },
      {
        section: "Values",
        label: "Allowed values",
        icon: "tabler:list-details",
        summary: [me(D.value.dimensions?.length ?? 0, "dimension"), me(D.value.vocabularies?.length ?? 0, "vocabulary", "vocabularies")].join(" · "),
        detail: D.value.dimensions?.map(($) => B($.name)).join(", ") || "Add dimensions when values vary by language, region or another context."
      },
      {
        section: "Channels",
        label: "Publishing and imports",
        icon: "tabler:arrows-exchange",
        summary: [me(Va.value.length, "channel"), me(Za.value.length, "source")].join(" · "),
        detail: Va.value.map(($) => B($.id)).join(", ") || "Add a release destination when products are ready to publish."
      },
      {
        section: "Plugins",
        label: "Catalog tools",
        icon: "tabler:puzzle",
        summary: me(Ua.value.length, "plugin") + " enabled",
        detail: Ua.value.map(($) => oe($.title, "Catalog plugin")).join(", ") || "Open Plugins to see which tools you can enable."
      }
    ]), Xa = {
      Overview: v.General.question,
      History: "What changed in this catalog?",
      Families: "Choose what each family collects, how products vary, and what they need before release.",
      Fields: "Manage product fields and the groups that families share.",
      "Form layout": "In what order will editors see fields?",
      Dimensions: "Where can product values differ?",
      Vocabularies: "Which terms can product editors choose?",
      Channels: "Choose where each family can publish and what products need before release.",
      Sources: "Control who can send product updates and which fields each source can change.",
      Access: v.Access.question,
      Plugins: v.Plugins.question
    }, ze = N(() => {
      const $ = Xe(D.value), h = Ta($, q.value);
      for (const [R, te] of Object.entries(h)) {
        const ue = $.remove ??= {};
        ue[R] = [.../* @__PURE__ */ new Set([...ue[R] ?? [], ...te])];
      }
      return $;
    });
    fe(Qe, ($) => {
      $ || _e();
    }), fe([ze, z], _e, { deep: !0 });
    function el($) {
      const [h, R] = $.split(" ", 2);
      if (h === "plugin" && R) return oe(se.value?.plugins.find((be) => be.plugin === R)?.title, "Plugin");
      if (h === "scope" && R) return oe(se.value?.scopes.find((be) => be.id === R)?.title, "Product filter set");
      if (R) return oe(B(R), B(h)) + (h === "aspect" ? " field group" : "");
      if ($.startsWith("kickside.")) return "Catalog setting";
      const [te, ue] = $.split(".", 2);
      return ue ? `${oe(B(ue), "Field")} (${oe(B(te), "Field group")})` : oe(B($), "Catalog setting");
    }
    function al($) {
      return $.startsWith("renamed from ") ? "Rename from " + B($.slice(13)) : $.startsWith("config.") ? "Change " + B($.slice(7)) : $.endsWith(" owning level") ? "Move a field to another variant level" : ca[$] ?? B($);
    }
    const va = N(() => {
      const $ = ze.value.remove;
      return [
        ...$?.attributes?.length || $?.aspects?.length ? ["Removing fields deletes the values stored in those fields."] : [],
        ...$?.vocabularies?.length ? ["Removing a vocabulary deletes its saved terms."] : [],
        ...$?.channels?.length ? ["Removing a release destination withdraws products already published to it."] : []
      ];
    }), ja = N(() => {
      const $ = M.value?.declaration;
      return $ ? [
        ...(D.value.channels ?? []).flatMap((h) => {
          const R = $.channels?.find((te) => te.id === h.id);
          return JSON.stringify(h) === JSON.stringify(R) ? [] : [{ subject: B(h.id), effect: R ? "Change which products can be released here and what they need first" : "Add a release destination" }];
        }),
        ...(ze.value.remove?.channels ?? []).map((h) => ({ subject: B(h), effect: "Remove this release destination" })),
        ...(D.value.sources ?? []).flatMap((h) => {
          const R = $.sources?.find((te) => te.id === h.id);
          return JSON.stringify(h) === JSON.stringify(R) ? [] : [{ subject: B(h.id), effect: R ? "Update how this source can send product data" : "Let this source send product updates" }];
        }),
        ...(ze.value.remove?.sources ?? []).map((h) => ({ subject: B(h), effect: "Stop accepting updates from this source" }))
      ] : [];
    });
    function We($, h) {
      n.value = Ee($, h), n.value.code === ml && (U.value = !0, _e());
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
          await he(!0);
        } finally {
          u.value = !1;
        }
      }
    }
    async function Sa() {
      if (!M.value || !Qe.value || !Ae.value || U.value) return;
      const $ = pe.begin(), h = Ll(ze.value, M.value.schema_generation, z.value);
      u.value = !0, n.value = void 0;
      try {
        const R = await ce.planSchema(t.catalogId, h.declaration, h.generation, h.pluginConfigs);
        if (!pe.current($) || !h.matches(ze.value, M.value.schema_generation, z.value) || !Ae.value) return;
        Se.value = h, Me.value = !1, ae.value = R, Ce.value = !0, await Ge(), ve.value?.focus();
      } catch (R) {
        if (!pe.current($)) return;
        We(R, "Could not review the change."), _e(), await Ge(), o.value?.$el.focus();
      } finally {
        pe.current($) && (u.value = !1);
      }
    }
    async function tl() {
      if (!M.value || !Oe.value || !j.value || !Se.value) return;
      const $ = t.catalogId, h = pe.begin();
      u.value = !0, n.value = void 0, Y.value = "";
      try {
        const R = await ce.applySchema($, Se.value.declaration, Se.value.generation, Se.value.pluginConfigs);
        if ($ !== t.catalogId || !pe.current(h) || (await he(!0, !0), $ !== t.catalogId || !pe.current(h))) return;
        Y.value = "Catalog changes applied.", d("applied", R.generation);
      } catch (R) {
        if ($ !== t.catalogId || !pe.current(h)) return;
        _e(), We(R, "Could not apply the change."), await Ge(), o.value?.$el.focus();
      } finally {
        pe.current(h) && (u.value = !1);
      }
    }
    async function Be($ = !1) {
      const h = t.catalogId, R = M.value, te = V.begin();
      try {
        const [ue, be] = await Promise.all([ce.schema(h), $ ? ce.schemaOptions(h) : void 0]);
        return !R || !V.current(te) || h !== t.catalogId || M.value !== R ? !1 : (R.plugins = ue.plugins, R.as_of = ue.as_of, be && (se.value = be), !0);
      } catch (ue) {
        return $ && V.current(te) && h === t.catalogId && We(ue, "Could not check plugin status."), !1;
      }
    }
    async function Oa($, h, R = !1) {
      if (u.value || U.value || !X.value) return;
      const te = t.catalogId, ue = P.begin(), be = pe.begin();
      V.begin(), u.value = !0, n.value = void 0, Y.value = "";
      try {
        const xe = JSON.stringify(h);
        if (R ? await ce.configurePlugin(te, $, Xe(h), !0) : await ce.configurePlugin(te, $, Xe(h)), te !== t.catalogId || !P.current(ue) || !await Be(!0) || te !== t.catalogId || !P.current(ue)) return;
        !R && JSON.stringify(G.value[$]) === xe && delete G.value[$], Y.value = R ? "Background update reset requested." : "Configuration saved";
      } catch (xe) {
        te === t.catalogId && pe.current(be) && We(xe, R ? "Could not reset background updates." : "Could not save configuration.");
      } finally {
        pe.current(be) && (u.value = !1);
      }
    }
    async function sl($) {
      const h = t.catalogId, R = M.value?.plugins.find((te) => te.plugin === $ && te.active && te.installed);
      !R?.config || u.value || U.value || !X.value || !await Je.confirm({
        header: "Reset background updates?",
        message: "Background updates will start from a new catalog event. Current product data will be rebuilt into the plugin’s index. Earlier events will be skipped.",
        acceptLabel: "Reset background updates",
        rejectLabel: "Cancel"
      }) || t.catalogId !== h || await Oa($, R.config, !0);
    }
    async function il($) {
      const h = t.catalogId;
      if (!(u.value || U.value || !X.value)) {
        u.value = !0, n.value = void 0, Y.value = "";
        try {
          await ce.resumePluginProjection(h, $), t.catalogId === h && await Be(!0) && (Y.value = "Background update resumed.");
        } catch (R) {
          t.catalogId === h && We(R, "Could not resume the background update.");
        } finally {
          t.catalogId === h && (u.value = !1);
        }
      }
    }
    async function nl($) {
      const h = t.catalogId;
      if (!(u.value || U.value || !X.value) && !(!await Je.confirm({
        header: "Clear catalog app binding?",
        message: "The catalog will use the default app after this setting is saved.",
        acceptLabel: "Clear binding",
        rejectLabel: "Cancel"
      }) || t.catalogId !== h || u.value || !X.value || !M.value?.plugins.some((R) => R.references?.shell_bindings.includes($)))) {
        u.value = !0, n.value = void 0, Y.value = "";
        try {
          if (await ce.updateCatalogApp(h, ""), t.catalogId !== h) return;
          await Be(!0) && (Y.value = "Catalog app binding cleared.");
        } catch (R) {
          t.catalogId === h && We(R, "Could not clear the catalog app binding.");
        } finally {
          t.catalogId === h && (u.value = !1);
        }
      }
    }
    async function ol() {
      Oe.value && !await Je.confirm({
        header: "Leave this catalog?",
        message: "Your unsaved catalog changes will be discarded.",
        acceptLabel: "Discard and open settings",
        rejectLabel: "Keep editing"
      }) || (fa(), O.value = !1, Je.navigate("/system/settings"));
    }
    function _e() {
      Ce.value = !1, Se.value = null;
    }
    function Ra() {
      O.value = !1, Ae.value = !0;
    }
    function fa() {
      G.value = {}, Ae.value = !0, M.value && (D.value = Xe(M.value.declaration)), q.value = {}, _e(), Y.value = "";
    }
    function He($, h) {
      const R = q.value[$] ?? [];
      R.includes(h) || (q.value = { ...q.value, [$]: [...R, h] });
    }
    return ($, h) => (e(), i("section", {
      class: Ue(["pim-builder", { embedded: l.embedded }])
    }, [
      a("div", ed, [
        w.value || M.value && se.value ? (e(), I(ql, {
          key: 0,
          ref_key: "rail",
          ref: r,
          label: "Catalog settings sections",
          value: g.value,
          title: l.embedded ? "Catalogs" : void 0,
          count: l.directoryCount,
          groups: c.value,
          "leading-item": w.value,
          "onUpdate:value": A
        }, null, 8, ["value", "title", "count", "groups", "leading-item"])) : b("", !0),
        a("div", ad, [
          a("section", {
            ref_key: "content",
            ref: K,
            class: "kx-main-scroll",
            "aria-label": g.value
          }, [
            M.value && se.value ? (e(), I(Pt, {
              key: 0,
              title: g.value,
              description: Xa[g.value]
            }, ge({ _: 2 }, [
              X.value && Oe.value ? {
                name: "actions",
                fn: k(() => [
                  f(qt, {
                    busy: u.value,
                    "review-disabled": !Ae.value || U.value || !Qe.value,
                    onDiscard: fa,
                    onReview: Sa
                  }, null, 8, ["busy", "review-disabled"])
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : b("", !0),
            a("div", td, [
              n.value ? (e(), I(ua, {
                key: 0,
                ref_key: "errorPanel",
                ref: o,
                error: n.value,
                tabindex: "-1"
              }, {
                default: k(() => [
                  U.value ? (e(), I(s(W), {
                    key: 0,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: u.value,
                    onClick: ll
                  }, {
                    default: k(() => [...h[10] || (h[10] = [
                      H("Reload settings", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"])) : !M.value || !se.value ? (e(), I(s(W), {
                    key: 1,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: h[0] || (h[0] = (R) => he())
                  }, {
                    default: k(() => [...h[11] || (h[11] = [
                      H("Retry", -1)
                    ])]),
                    _: 1
                  })) : b("", !0)
                ]),
                _: 1
              }, 8, ["error"])) : b("", !0),
              Y.value ? (e(), I(s($e), {
                key: 1,
                severity: "success",
                role: "status"
              }, {
                default: k(() => [
                  H(_(Y.value), 1)
                ]),
                _: 1
              })) : b("", !0),
              M.value?.rebuilding && g.value === "Overview" ? (e(), I(s($e), {
                key: 2,
                severity: "info",
                role: "status"
              }, {
                default: k(() => [...h[12] || (h[12] = [
                  H("Updating product readiness", -1)
                ])]),
                _: 1
              })) : b("", !0),
              re.value && (!M.value || !se.value) ? (e(), i("div", sd, "Loading catalog settings…")) : M.value && se.value ? (e(), i("fieldset", {
                key: 4,
                class: "pim-editor-surface",
                disabled: u.value,
                inert: u.value
              }, [
                X.value ? b("", !0) : (e(), I(s($e), {
                  key: 0,
                  severity: "info"
                }, {
                  default: k(() => [...h[13] || (h[13] = [
                    H("You can view this catalog’s settings.", -1)
                  ])]),
                  _: 1
                })),
                (e(), i("div", {
                  key: g.value,
                  class: "pim-ia-content"
                }, [
                  m.value === "General" && g.value === "History" ? (e(), I(Ot, {
                    key: 0,
                    "catalog-id": l.catalogId,
                    "can-resolve-actors": X.value
                  }, null, 8, ["catalog-id", "can-resolve-actors"])) : m.value === "General" ? (e(), i(L, { key: 1 }, [
                    a("div", nd, [
                      (e(!0), i(L, null, ee(Qa.value, (R) => (e(), i("section", {
                        key: R.section,
                        class: "kx-card pim-overview-card"
                      }, [
                        a("div", od, [
                          a("span", dd, [
                            f(s(le), {
                              icon: R.icon,
                              "aria-hidden": "true"
                            }, null, 8, ["icon"])
                          ]),
                          a("div", rd, [
                            a("h3", ud, _(R.label), 1),
                            a("p", cd, _(R.summary), 1)
                          ])
                        ]),
                        a("p", md, _(R.detail), 1),
                        f(s(W), {
                          type: "button",
                          text: "",
                          size: "small",
                          severity: "secondary",
                          class: "pim-overview-action",
                          onClick: (te) => T(R.section)
                        }, {
                          default: k(() => [
                            H(_(R.section === "Products" && Ya.value ? "Set up products" : "View " + R.section.toLowerCase()) + " ", 1),
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
                        a("div", pd, [
                          a("div", vd, [
                            h[14] || (h[14] = a("div", null, [
                              a("h3", null, "Application defaults"),
                              a("p", null, "Review the audit, retention and processing settings this catalog inherits.")
                            ], -1)),
                            f(s(W), {
                              label: "View defaults",
                              severity: "secondary",
                              outlined: "",
                              onClick: h[1] || (h[1] = (R) => F("defaults"))
                            })
                          ]),
                          a("div", fd, [
                            h[15] || (h[15] = a("div", null, [
                              a("h3", null, "Technical schema"),
                              a("p", null, "Inspect the complete definition, including integration keys and settings used by installed extensions.")
                            ], -1)),
                            f(s(W), {
                              label: "Open declaration",
                              severity: "secondary",
                              outlined: "",
                              onClick: h[2] || (h[2] = (R) => F("declaration"))
                            })
                          ])
                        ])
                      ]),
                      _: 1
                    })
                  ], 64)) : m.value === "Products" ? (e(), i(L, { key: 2 }, [
                    g.value === "Families" ? (e(), I(Un, {
                      key: 0,
                      draft: D.value,
                      schema: M.value,
                      options: se.value,
                      onRemove: He,
                      onFields: ie
                    }, null, 8, ["draft", "schema", "options"])) : g.value === "Fields" ? (e(), I(bi, {
                      key: 1,
                      family: p.value,
                      "onUpdate:family": h[3] || (h[3] = (R) => p.value = R),
                      draft: D.value,
                      schema: M.value,
                      options: se.value,
                      onRemove: He
                    }, null, 8, ["family", "draft", "schema", "options"])) : (e(), I(ut, {
                      key: 2,
                      draft: D.value,
                      schema: M.value,
                      types: se.value.types
                    }, null, 8, ["draft", "schema", "types"]))
                  ], 64)) : m.value === "Values" ? (e(), i(L, { key: 3 }, [
                    g.value === "Dimensions" ? (e(), I(Vi, {
                      key: 0,
                      draft: D.value,
                      schema: M.value,
                      onRemove: He
                    }, null, 8, ["draft", "schema"])) : (e(), I(Hi, {
                      key: 1,
                      "catalog-id": l.catalogId,
                      draft: D.value,
                      schema: M.value,
                      onRemove: He
                    }, null, 8, ["catalog-id", "draft", "schema"]))
                  ], 64)) : m.value === "Channels" ? (e(), I(io, {
                    key: 4,
                    "catalog-id": l.catalogId,
                    draft: D.value,
                    schema: M.value,
                    view: g.value === "Sources" ? "sources" : "channels",
                    onRemove: He
                  }, null, 8, ["catalog-id", "draft", "schema", "view"])) : m.value === "Access" ? (e(), I(Bl, {
                    key: 5,
                    "catalog-id": l.catalogId,
                    title: l.title || "Catalog",
                    access: M.value.access
                  }, null, 8, ["catalog-id", "title", "access"])) : (e(), I(qo, {
                    key: 6,
                    draft: D.value,
                    schema: M.value,
                    options: se.value,
                    "plugin-configs": G.value,
                    stale: U.value,
                    onConfigure: Oa,
                    onRemove: He,
                    onReset: sl,
                    onRefresh: h[4] || (h[4] = (R) => Be(!0)),
                    onResume: il,
                    onReview: Sa,
                    onClearShellBinding: nl
                  }, null, 8, ["draft", "schema", "options", "plugin-configs", "stale"]))
                ])),
                C.value ? (e(), I(oa, {
                  key: 1,
                  visible: O.value,
                  label: C.value === "defaults" ? "Application defaults" : "Technical schema",
                  onClose: Ra,
                  onClosed: h[7] || (h[7] = (R) => C.value = void 0)
                }, {
                  default: k(() => [
                    a("div", bd, [
                      a("header", yd, [
                        a("h2", null, _(C.value === "defaults" ? "Application defaults" : "Technical schema"), 1),
                        f(s(W), {
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
                      C.value === "defaults" ? (e(), i(L, { key: 0 }, [
                        h[16] || (h[16] = a("p", { class: "muted" }, "These settings apply across the application. Catalogs with an explicit override keep their chosen value.", -1)),
                        f(Ko, {
                          "catalog-id": l.catalogId,
                          draft: D.value,
                          disabled: !X.value,
                          "defaults-only": ""
                        }, null, 8, ["catalog-id", "draft", "disabled"]),
                        X.value ? (e(), i("div", gd, [
                          f(s(W), {
                            type: "button",
                            label: "Open application settings",
                            severity: "secondary",
                            outlined: "",
                            onClick: ol
                          })
                        ])) : b("", !0)
                      ], 64)) : (e(), I(Xo, {
                        key: 1,
                        draft: D.value,
                        readonly: !X.value,
                        onReplace: h[5] || (h[5] = (R) => D.value = R),
                        onValidity: h[6] || (h[6] = (R) => {
                          Ae.value = R, _e();
                        })
                      }, null, 8, ["draft", "readonly"]))
                    ])
                  ]),
                  _: 1
                }, 8, ["visible", "label"])) : b("", !0)
              ], 8, id)) : b("", !0),
              f(oa, {
                class: "pim-review-dialog",
                visible: Ce.value,
                busy: u.value,
                label: "Review changes",
                onClose: _e,
                onClosed: h[9] || (h[9] = (R) => ae.value = null)
              }, {
                default: k(() => [
                  ae.value ? (e(), i("section", {
                    key: 0,
                    class: "pim-ia-dialog pim-plan",
                    "aria-labelledby": s(De)
                  }, [
                    a("header", kd, [
                      a("div", null, [
                        a("h2", {
                          id: s(De),
                          ref_key: "reviewHeading",
                          ref: ve,
                          tabindex: "-1",
                          autofocus: ""
                        }, "Review changes", 8, _d),
                        a("p", null, "Check what will happen when you apply this draft to " + _(l.title || "the catalog") + ".", 1)
                      ]),
                      f(s(W), {
                        type: "button",
                        "aria-label": "Close review",
                        disabled: u.value,
                        text: "",
                        severity: "secondary",
                        onClick: _e
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
                    a("div", wd, [
                      a("h3", null, _(ta[ae.value.class] || "Catalog changes"), 1),
                      ae.value.class === "unchanged" ? (e(), i("p", $d, "The catalog already matches this draft.")) : ae.value.class === "initial" ? (e(), i("p", Cd, "Product editors will use these settings for new products.")) : ae.value.class === "cosmetic" ? (e(), i("p", xd, "Catalog settings will update. Stored product values are kept.")) : ae.value.class === "additive" ? (e(), i("p", Vd, "The new options become available. Existing product values are kept.")) : ae.value.class === "semantic" ? (e(), i("p", Ud, "Applying changes can recalculate product values or release readiness across this catalog.")) : ae.value.class === "refused" ? (e(), I(s($e), {
                        key: 5,
                        severity: "error"
                      }, {
                        default: k(() => [
                          h[17] || (h[17] = H(" These changes can’t be applied. ", -1)),
                          ae.value.migration && ae.value.refused.some((R) => M.value?.attributes[R.code]) ? (e(), i("span", Ad, " To change how a field stores values, add a new field and copy the existing values into it. Then remove the original field and give the new field its name. ")) : b("", !0)
                        ]),
                        _: 1
                      })) : b("", !0)
                    ]),
                    S.value.length || ja.value.length ? (e(), i("ul", jd, [
                      (e(!0), i(L, null, ee(S.value, (R, te) => (e(), i("li", { key: te }, [
                        R.class === "refused" ? (e(), I(s(ye), {
                          key: 0,
                          class: "kx-tag-sm small",
                          severity: "danger"
                        }, {
                          default: k(() => [...h[18] || (h[18] = [
                            H("Blocked", -1)
                          ])]),
                          _: 1
                        })) : b("", !0),
                        R.code ? (e(), i("strong", Sd, _(el(R.code)), 1)) : b("", !0),
                        a("span", null, _(al(R.what)), 1)
                      ]))), 128)),
                      (e(!0), i(L, null, ee(ja.value, (R) => (e(), i("li", {
                        key: R.subject + R.effect
                      }, [
                        a("strong", null, _(R.subject), 1),
                        a("span", null, _(R.effect), 1)
                      ]))), 128))
                    ])) : b("", !0),
                    va.value.length ? (e(), i("div", Od, [
                      h[19] || (h[19] = a("h3", null, "Permanent changes", -1)),
                      (e(!0), i(L, null, ee(va.value, (R) => (e(), i("p", { key: R }, _(R), 1))), 128)),
                      ae.value.class !== "refused" ? (e(), i("div", Rd, [
                        f(s(Vl), {
                          modelValue: Me.value,
                          "onUpdate:modelValue": h[8] || (h[8] = (R) => Me.value = R),
                          "input-id": s(De) + "-acknowledge",
                          binary: "",
                          disabled: u.value
                        }, null, 8, ["modelValue", "input-id", "disabled"]),
                        a("label", {
                          for: s(De) + "-acknowledge"
                        }, "I understand the effects of these removals", 8, Id)
                      ])) : b("", !0)
                    ])) : b("", !0),
                    a("footer", Td, [
                      f(s(W), {
                        type: "button",
                        label: "Back to editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: u.value,
                        onClick: _e
                      }, null, 8, ["disabled"]),
                      M.value?.access.admin && ae.value.class !== "refused" ? (e(), I(s(W), {
                        key: 0,
                        disabled: !Oe.value || u.value || !j.value,
                        loading: u.value,
                        onClick: tl
                      }, {
                        default: k(() => [
                          H(_(g.value === "Form layout" ? "Apply layout" : "Apply changes"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled", "loading"])) : b("", !0)
                    ])
                  ], 8, hd)) : b("", !0)
                ]),
                _: 1
              }, 8, ["visible", "busy"])
            ])
          ], 8, ld)
        ])
      ])
    ], 2));
  }
}), qd = /* @__PURE__ */ de({
  __name: "SettingsApp",
  setup(l) {
    const y = pl(), t = vl(), d = J(), v = N(() => y.value.catalogId ?? ""), m = Ke();
    async function g() {
      const C = m.begin(), O = v.value;
      try {
        const K = await ce.catalogSummary(O);
        m.current(C) && (d.value = K);
      } catch {
        m.current(C) && (d.value = void 0);
      }
    }
    fe(v, () => {
      d.value = void 0, g();
    }), ra(g), Ze(() => {
      m.begin();
    });
    function p() {
      y.value.embedded ? t("open-catalog-picker", {}) : t("navigate", { route: "" });
    }
    return (C, O) => v.value ? (e(), I(Pd, {
      key: v.value,
      "catalog-id": v.value,
      title: d.value?.title || "Catalog",
      catalog: d.value,
      embedded: s(y).embedded,
      "focus-back": s(y).focusBack,
      "directory-count": s(y).directoryCount,
      "back-label": s(y).embedded ? "Back to catalogs" : "Back to catalog settings",
      onBack: p,
      onDirtyChanged: O[0] || (O[0] = (K) => s(t)("dirty-changed", { dirty: K }))
    }, null, 8, ["catalog-id", "title", "catalog", "embedded", "focus-back", "directory-count", "back-label"])) : b("", !0);
  }
});
class Nd extends fl {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "catalog-id": { type: "string", default: "" }, embedded: { type: "boolean", default: !1 }, "directory-count": { type: "number", description: "Catalog count in the System picker." }, "focus-back": { type: "boolean", default: !1 } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: bl
    };
  }
  static get vueConfig() {
    return { rootComponent: qd, plugins: [yl] };
  }
}
jl(import.meta.url, Nd);
