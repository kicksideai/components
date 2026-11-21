import { u as ua, r as Je, e as Da, c as cl, a as ca, p as pe, b as Le, d as Ae, _ as da, g as ml, S as pl, f as vl, h as fl, W as bl, s as yl, P as gl } from "./styles-D0wQOH2A.js";
import { defineComponent as ue, computed as D, openBlock as e, createElementBlock as i, Fragment as M, renderList as ee, normalizeClass as xe, toDisplayString as C, createCommentVNode as v, createBlock as I, unref as s, createElementVNode as a, ref as H, watch as ve, onUnmounted as Ye, withCtx as w, createVNode as f, createStaticVNode as hl, createTextVNode as K, withModifiers as Re, normalizeStyle as ga, useId as qe, withKeys as ta, renderSlot as Se, nextTick as Ke, provide as kl, inject as _l, useModel as za, Transition as wl, mergeModels as ha, createSlots as Oe, toRaw as $l, onMounted as Fa, resolveDynamicComponent as Cl, mergeProps as xl } from "vue";
import { Icon as le } from "@iconify/vue";
import ye from "primevue/tag";
import J from "primevue/button";
import Vl from "primevue/checkbox";
import _e from "primevue/message";
import { api as Ul, on as Ba, host as He, loadByTagName as Al, define as Sl } from "@wippy-fe/proxy";
import $a from "primevue/selectbutton";
import Ge from "primevue/inputtext";
import La from "primevue/multiselect";
import sa from "primevue/toggleswitch";
import he from "primevue/select";
import jl from "primevue/inputnumber";
import Rl from "primevue/textarea";
const Ol = ["aria-label"], Il = {
  key: 0,
  class: "kx-settings-rail-group"
}, Tl = ["aria-current", "onClick"], Pl = { class: "kx-settings-rail-label" }, ql = /* @__PURE__ */ ue({
  __name: "SettingsRail",
  props: {
    label: {},
    value: {},
    groups: {},
    leadingItem: {}
  },
  emits: ["update:value"],
  setup(l) {
    const k = l, t = D(() => k.leadingItem ? [{ items: [k.leadingItem] }, ...k.groups] : k.groups);
    function r(c) {
      const u = [...c.currentTarget.querySelectorAll(".kx-settings-rail-item")], b = u.indexOf(c.target);
      if (b < 0) return;
      let m;
      switch (c.key) {
        case "ArrowDown":
        case "ArrowRight":
          m = (b + 1) % u.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          m = (b + u.length - 1) % u.length;
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
      c.preventDefault(), u[m]?.focus();
    }
    return (c, u) => (e(), i("nav", {
      class: "kx-settings-rail",
      "aria-label": l.label,
      onKeydown: r
    }, [
      (e(!0), i(M, null, ee(t.value, (b, m) => (e(), i("div", {
        key: b.items[0]?.value ?? m,
        class: xe(["kx-settings-rail-section", { "kx-settings-rail-leading": l.leadingItem && m === 0 }])
      }, [
        b.heading ? (e(), i("div", Il, C(b.heading), 1)) : v("", !0),
        (e(!0), i(M, null, ee(b.items, (x) => (e(), i("button", {
          key: x.value,
          type: "button",
          class: "kx-settings-rail-item",
          "aria-current": x.value === l.value ? "true" : void 0,
          onClick: (j) => c.$emit("update:value", x.value)
        }, [
          x.icon ? (e(), I(s(le), {
            key: 0,
            class: "kx-settings-rail-icon",
            icon: x.icon,
            "aria-hidden": "true"
          }, null, 8, ["icon"])) : v("", !0),
          a("span", Pl, C(x.label), 1)
        ], 8, Tl))), 128))
      ], 2))), 128))
    ], 40, Ol));
  }
}), Nl = { class: "pim-stack" }, Dl = { class: "form pim-card-body pad pim-ia-action" }, zl = { key: 0 }, Fl = ["config"], Bl = /* @__PURE__ */ ue({
  __name: "CatalogShare",
  props: {
    catalogId: {},
    title: {},
    access: {}
  },
  emits: ["summary"],
  setup(l, { emit: k }) {
    const t = l, r = k, c = H(!1), u = H(!1), b = H(""), m = H(), x = H(!1), j = Je(), F = D(() => "/api/v1/component-access/grants/" + encodeURIComponent(t.catalogId)), X = D(() => JSON.stringify({
      resource_id: t.catalogId,
      title: t.title,
      access_url: F.value,
      share_url: "/api/v1/component-access/share/" + encodeURIComponent(t.catalogId)
    })), P = D(() => {
      if (!t.access.admin) return "Only catalog administrators can manage sharing.";
      if (!m.value) return x.value ? "Member counts are unavailable." : "Loading members…";
      const { people: h, groups: d } = m.value;
      return h + (h === 1 ? " person" : " people") + " and " + d + (d === 1 ? " group" : " groups") + " with direct access";
    });
    ve(P, (h) => r("summary", h), { immediate: !0 });
    async function B() {
      if (!t.access.admin) return;
      const h = j.begin();
      x.value = !1;
      try {
        const { data: d } = await Ul.get(F.value);
        if (!j.current(h)) return;
        if (!d?.success || !Array.isArray(d.access)) throw new Error("Grants unavailable");
        const U = d.access.filter((T) => T.subject_type === "group").length;
        m.value = { people: d.access.length - U, groups: U };
      } catch {
        j.current(h) && (m.value = void 0, x.value = !0);
      }
    }
    ua(B), Ye(() => {
      j.begin();
    });
    async function g() {
      u.value = !0, b.value = "", await Da("kickside-share") ? c.value = !0 : b.value = "Could not open sharing. Try again.", u.value = !1;
    }
    return (h, d) => (e(), i("div", Nl, [
      a("section", Dl, [
        a("div", null, [
          d[1] || (d[1] = a("h3", null, "Members and sharing", -1)),
          l.access.admin ? (e(), i("p", zl, "Invite people or groups and choose what they can do in this catalog.")) : v("", !0)
        ]),
        l.access.admin ? (e(), I(s(J), {
          key: 0,
          type: "button",
          label: "Share catalog",
          loading: u.value,
          onClick: g
        }, {
          icon: w(() => [
            f(s(le), {
              icon: "tabler:share",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : v("", !0),
        x.value ? (e(), I(s(J), {
          key: 1,
          type: "button",
          label: "Reload member counts",
          severity: "secondary",
          text: "",
          onClick: B
        })) : v("", !0)
      ]),
      d[2] || (d[2] = hl('<section class="form pim-card-body pad pim-stack" aria-labelledby="pim-access-roles-heading"><h3 id="pim-access-roles-heading">What members can do</h3><dl class="pim-access-roles"><div><dt>Read</dt><dd>View products and their details.</dd></div><div><dt>Write</dt><dd>Create products and update their values.</dd></div><div><dt>Delete</dt><dd>Move products to trash.</dd></div><div><dt>Admin</dt><dd>Manage catalog settings and who has access.</dd></div></dl></section>', 1)),
      c.value ? (e(), i("kickside-share", {
        key: 0,
        config: X.value,
        onClose: d[0] || (d[0] = (U) => c.value = !1),
        onChanged: B
      }, null, 40, Fl)) : v("", !0),
      b.value ? (e(), I(s(_e), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: w(() => [
          K(C(b.value), 1)
        ]),
        _: 1
      })) : v("", !0)
    ]));
  }
});
function Ll(l, k, t = {}) {
  const r = JSON.stringify(l), c = JSON.stringify(t);
  return {
    declaration: JSON.parse(r),
    generation: k,
    pluginConfigs: JSON.parse(c),
    matches: (u, b, m = {}) => k === b && r === JSON.stringify(u) && c === JSON.stringify(m)
  };
}
function Pa(l, k) {
  const t = {};
  for (const [r, c] of Object.entries(k)) {
    const u = c.filter((b) => r === "plugins" ? !l.plugins?.some((m) => m.use === b) : r === "scopes" ? !l.scopes?.includes(b) : r === "attributes" ? !l.aspects?.some((m) => m.attributes?.some((x) => m.namespace + "." + x.code === b)) : r === "aspects" ? !l.aspects?.some((m) => m.namespace === b) : r === "dimensions" ? !l.dimensions?.some((m) => m.name === b) : r === "vocabularies" || r === "families" ? !l[r]?.some((m) => m.code === b) : !l[r]?.some((m) => m.id === b));
    u.length && (t[r] = u);
  }
  return t;
}
const qa = (l) => !!l && typeof l == "object" && !Array.isArray(l), de = ["string"], Ea = { "*": "string" }, El = { id: "number", code: "string!", type: "string!", scope: de, cardinality: "string", index: "string", index_contexts: [Ea], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, Ml = {
  dimensions: [{ name: "string!", members: de, fallback: { "*": de } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: de }, attributes: [El] }],
  families: [{ code: "string!", aspects: de, variation: [{ axes: de, own: de }], requirements: [{ id: "string!", context: Ea, require: de, authored: de }], checks: [{ check: "string!", reads: de, cost: "string", config: "object", enforce: "string" }] }],
  sources: [{ id: "string!", ordering: "string", writes: de, principals: de, audit: "boolean" }],
  channels: [{ id: "string!", requirements: de, families: de }],
  plugins: [{ use: "string!", schema: "json" }],
  scopes: de,
  policy: { "*": "policy" },
  remove: { dimensions: de, vocabularies: de, aspects: de, families: de, sources: de, channels: de, attributes: de, scopes: de, plugins: de }
};
function ka(l, k, t) {
  if (typeof k == "string") {
    const r = k.replace("!", "");
    if (!(r === "json" || (r === "object" ? qa(l) : r === "policy" ? l === !1 || typeof l == "string" || typeof l == "number" : typeof l === r)) || k.endsWith("!") && (typeof l != "string" || !l.trim())) throw new Error(`${t} has an invalid ${r} value.`);
  } else if (Array.isArray(k)) {
    if (!Array.isArray(l)) throw new Error(`${t} must be an array.`);
    l.forEach((r, c) => ka(r, k[0], `${t}[${c}]`));
  } else {
    if (!qa(l)) throw new Error(`${t} must be an object.`);
    for (const [r, c] of Object.entries(k)) if (typeof c == "string" && c.endsWith("!") && l[r] === void 0) throw new Error(`${t}.${r} is required.`);
    for (const [r, c] of Object.entries(l)) {
      const u = k[r] ?? k["*"];
      if (!u) throw new Error(`${t}.${r} is not an editor field.`);
      ka(c, u, `${t}.${r}`);
    }
  }
}
function Wl(l) {
  const k = JSON.parse(l);
  ka(k, Ml, "Declaration");
  const t = k;
  for (const r of t.dimensions ?? []) r.members ??= [];
  return t;
}
function aa(l) {
  return JSON.parse(JSON.stringify(l));
}
const Na = /^[a-z][a-z0-9_]*$/;
function Hl(l) {
  return l.trim().normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function Be(l, k, t) {
  t.length ? l[k] = t : delete l[k];
}
function na(l, k, t) {
  if (t < 0 || t >= l.length || k === t) return;
  const [r] = l.splice(k, 1);
  l.splice(t, 0, r);
}
function re(l, k) {
  return !l || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(l) ? k : l;
}
function la(l) {
  return l ? re(l.title, "Field type") : "Unknown type";
}
async function Ma(l, k) {
  const t = [...new Set(k)].map((c) => ({ type: "user", id: c }));
  if (!t.length) return {};
  const r = await cl(`/api/v1/pim-admin/catalogs/${encodeURIComponent(l)}/principal_labels`, { refs: t }, "People");
  return Object.fromEntries((r.principals ?? []).map((c) => [c.id, re(c.label, "Person")]));
}
const oa = [
  { value: "quarter", label: "¼", span: 3 },
  { value: "third", label: "⅓", span: 4 },
  { value: "half", label: "½", span: 6 },
  { value: "full", label: "1", span: 12 }
];
function _a(l, k, t) {
  return t.width ?? l.attributes[k + "." + t.code]?.width ?? "half";
}
const Jl = (l) => new Date(l).toLocaleString();
function wa(l) {
  const k = Math.abs(l.m).toString(), t = l.m < 0 ? "-" : "";
  if (l.e >= 0) return t + k + "0".repeat(l.e);
  const r = -l.e, c = k.padStart(r + 1, "0");
  return t + c.slice(0, c.length - r) + "." + c.slice(c.length - r);
}
function z(l) {
  const t = (l.includes(".") ? l.slice(l.indexOf(".") + 1) : l).replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : l;
}
function Fe(l) {
  return l.labels.en ?? Object.values(l.labels)[0] ?? l.code;
}
function ra(l, k) {
  if (l == null) return "";
  const t = (r) => {
    if (r == null) return "";
    if (typeof r == "object" && "ref" in r) {
      const c = r;
      if (c.ref[0] === "term") {
        const u = c.ref[1].slice(c.ref[1].indexOf(":") + 1), b = c.ref[1].slice(0, c.ref[1].indexOf(":")), m = k?.[b]?.find((x) => x.code === u);
        return m ? Fe(m) : u;
      }
      return "Linked " + z(c.ref[0]).toLocaleLowerCase();
    }
    if (typeof r == "object" && "v" in r) {
      const c = r;
      return wa(c.v) + " " + c.u;
    }
    return typeof r == "object" && "m" in r ? wa(r) : typeof r == "boolean" ? r ? "Yes" : "No" : typeof r == "object" ? JSON.stringify(r) : re(String(r), "Linked record");
  };
  return Array.isArray(l) ? l.map(t).join(", ") : t(l);
}
function Kl(l, k, t) {
  const r = ra(k), c = ra(t);
  return !c && r ? `${l} cleared (was ${r})` : r ? `${l}: ${r} → ${c}` : `${l} set to ${c}`;
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
}, nt = { class: "pim-aspect-head" }, ot = { class: "pim-canvas" }, dt = { class: "pim-lcard-top" }, rt = { class: "pim-lcard-name" }, ut = { class: "pim-lcard-type" }, ct = /* @__PURE__ */ ue({
  __name: "LayoutEditor",
  props: {
    draft: {},
    schema: {},
    types: {}
  },
  setup(l) {
    const k = l, t = D(() => k.schema.access.admin), r = D(() => k.draft?.aspects ?? []), c = D(() => new Map(k.types.map((B) => [B.id, la(B)]))), u = D(() => {
      if (!k.schema) return [];
      const B = new Set((k.draft?.aspects ?? []).map((h) => h.namespace)), g = /* @__PURE__ */ new Map();
      for (const [h, d] of Object.entries(k.schema.attributes)) {
        const U = h.split(".")[0];
        B.has(U) || !d.plugin || (g.has(U) || g.set(U, { aspect: U, plugin: d.plugin, codes: [] }), g.get(U).codes.push(h));
      }
      return [...g.values()];
    });
    function b(B, g) {
      return oa.find((h) => h.value === _a(k.schema, B, g))?.span ?? 6;
    }
    const m = H(null), x = H(null);
    function j(B, g, h) {
      t.value && (m.value = { ns: B, index: g }, h.dataTransfer?.setData("text/plain", B + ":" + g), h.dataTransfer && (h.dataTransfer.effectAllowed = "move"));
    }
    function F(B, g, h) {
      !m.value || m.value.ns !== B || (h.preventDefault(), x.value = { ns: B, index: g });
    }
    function X(B, g) {
      t.value && m.value?.ns === B.namespace && na(B.attributes ?? [], m.value.index, g), m.value = null, x.value = null;
    }
    function P() {
      m.value = null, x.value = null;
    }
    return (B, g) => (e(), i("div", Gl, [
      t.value ? (e(), i("p", Yl, "Arrange fields within each group and choose their widths. Review changes before applying the layout.")) : v("", !0),
      r.value.length === 0 ? (e(), i("div", Zl, [
        g[1] || (g[1] = K("This catalog has no field groups yet.", -1)),
        t.value ? (e(), i(M, { key: 0 }, [
          K(" Add a field group in Fields.")
        ], 64)) : v("", !0)
      ])) : v("", !0),
      (e(!0), i(M, null, ee(r.value, (h) => (e(), i("section", {
        key: h.namespace,
        class: "pim-aspect"
      }, [
        a("header", Ql, [
          a("h3", null, C(s(z)(h.namespace)), 1),
          t.value ? (e(), i("span", Xl, "drag a field, or use its arrows")) : v("", !0)
        ]),
        a("div", {
          class: "pim-canvas",
          onDragover: g[0] || (g[0] = Re(() => {
          }, ["prevent"]))
        }, [
          (e(!0), i(M, null, ee(h.attributes ?? [], (d, U) => (e(), i("div", {
            key: d.code,
            class: xe(["pim-lcard", { dragging: m.value?.ns === h.namespace && m.value?.index === U, over: x.value?.ns === h.namespace && x.value?.index === U }]),
            style: ga({ gridColumn: "span " + b(h.namespace, d) }),
            draggable: t.value,
            onDragstart: (T) => j(h.namespace, U, T),
            onDragover: (T) => F(h.namespace, U, T),
            onDrop: Re((T) => X(h, U), ["prevent"]),
            onDragend: P
          }, [
            a("div", at, [
              t.value ? (e(), i("span", lt, [
                f(s(le), { icon: "tabler:grip-vertical" })
              ])) : v("", !0),
              a("span", tt, C(s(z)(d.code)), 1),
              a("span", st, C(c.value.get(d.type) ?? s(la)(void 0)), 1),
              t.value ? (e(), i("span", it, [
                f(s(J), {
                  type: "button",
                  disabled: U === 0,
                  "aria-label": "Move " + s(z)(d.code) + " earlier",
                  onClick: (T) => s(na)(h.attributes ?? [], U, U - 1),
                  class: "arrow",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    f(s(le), { icon: "tabler:arrow-left" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                f(s(J), {
                  type: "button",
                  disabled: U === (h.attributes ?? []).length - 1,
                  "aria-label": "Move " + s(z)(d.code) + " later",
                  onClick: (T) => s(na)(h.attributes ?? [], U, U + 1),
                  class: "arrow",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    f(s(le), { icon: "tabler:arrow-right" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ])) : v("", !0)
            ]),
            f(s($a), {
              disabled: !t.value,
              "model-value": s(_a)(l.schema, h.namespace, d),
              options: s(oa),
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Width of " + s(z)(d.code),
              "onUpdate:modelValue": (T) => d.width = T
            }, null, 8, ["disabled", "model-value", "options", "aria-label", "onUpdate:modelValue"])
          ], 46, et))), 128))
        ], 32)
      ]))), 128)),
      (e(!0), i(M, null, ee(u.value, (h) => (e(), i("section", {
        key: h.aspect,
        class: "pim-aspect"
      }, [
        a("header", nt, [
          a("h3", null, C(s(z)(h.aspect)), 1),
          g[2] || (g[2] = a("span", { class: "muted small" }, "Provided by a plugin", -1))
        ]),
        a("div", ot, [
          (e(!0), i(M, null, ee(h.codes, (d) => (e(), i("div", {
            key: d,
            class: "pim-lcard fixed",
            style: ga({ gridColumn: "span " + (s(oa).find((U) => U.value === l.schema.attributes[d].width)?.span ?? 6) })
          }, [
            a("div", dt, [
              a("span", rt, C(s(z)(d)), 1),
              a("span", ut, C(c.value.get(l.schema.attributes[d].type) ?? s(la)(void 0)), 1)
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
}, xt = ["aria-labelledby"], Vt = { class: "pim-stacked-meta muted small" }, Ut = { key: 0 }, At = { key: 1 }, St = ["datetime"], jt = {
  key: 1,
  class: "kx-empty"
}, Rt = { class: "pim-table-foot" }, Ot = /* @__PURE__ */ ue({
  __name: "HistoryPanel",
  props: {
    catalogId: {},
    canResolveActors: { type: Boolean }
  },
  setup(l) {
    const k = l, t = H([]), r = H({}), c = H(), u = H(!1), b = H(), m = Je(), x = qe(), j = D(() => t.value.map((g) => ({
      key: `${g.seq}:${g.n}`,
      at: g.at,
      date: Jl(g.at),
      actor: r.value[g.actor] ?? re(g.actor, "Person"),
      source: g.source ? re(z(g.source), "Data source") : "",
      product: X(g),
      context: g.ctx ? re(g.ctx, "Product context") : "",
      change: P(g)
    })));
    async function F(g = !1) {
      const h = m.begin();
      u.value = !0, b.value = void 0;
      try {
        const d = await pe.history(k.catalogId, { limit: 50, before: g ? c.value : void 0 });
        if (!m.current(h)) return;
        if (t.value = g ? [...t.value, ...d.entries] : d.entries, c.value = d.next, k.canResolveActors)
          try {
            const U = await Ma(k.catalogId, d.entries.map((T) => T.actor));
            m.current(h) && (r.value = { ...r.value, ...U });
          } catch {
          }
      } catch (d) {
        if (!m.current(h)) return;
        b.value = Le(d, "Could not load the history.");
      } finally {
        m.current(h) && (u.value = !1);
      }
    }
    function X(g) {
      return g.sku ? g.sku : g.subject.startsWith("p:") ? "purged product" : g.subject.startsWith("t:") ? g.subject.slice(2) : g.subject.startsWith("r:") ? "Release" : re(g.subject, "Catalog");
    }
    function P(g) {
      if (g.attribute)
        return Kl(z(g.attribute), g.before, g.after);
      switch (g.kind) {
        case "schema":
          return "Catalog settings applied";
        case "term": {
          const h = g.after ?? {}, d = h.labels?.en ?? Object.values(h.labels ?? {})[0];
          return h.retired ? "Term retired" : d ? `Term labelled "${d}"` + (h.parent ? ` under ${h.parent}` : "") : "Term changed";
        }
        case "created": {
          const h = g.after ?? {};
          return `Created as ${z(h.family ?? "product")}` + (h.level ? ` at level ${h.level}` : "");
        }
        case "released": {
          const h = g.after ?? {};
          return `Released v${h.version ?? ""} to ${(h.channels ?? []).join(", ")}`;
        }
        case "withdrawn":
          return `Withdrawn from ${((g.after ?? {}).channels ?? []).join(", ")}`;
        case "status":
          return `Status ${String(g.before ?? "")} → ${String(g.after ?? "")}`;
        case "moved":
          return "Moved under another parent";
        default:
          return z(g.kind);
      }
    }
    let B = () => {
    };
    return ve(() => k.catalogId, () => {
      B(), m.begin(), t.value = [], r.value = {}, c.value = void 0, b.value = void 0, B = Ba(`component.${k.catalogId}`, () => {
        F();
      });
    }, { immediate: !0 }), ve(() => k.catalogId, () => {
      F();
    }), ua(() => F()), Ye(() => {
      B(), m.begin();
    }), (g, h) => (e(), i("section", mt, [
      b.value ? (e(), I(ca, {
        key: 0,
        error: b.value
      }, {
        default: w(() => [
          f(s(J), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: h[0] || (h[0] = (d) => F())
          }, {
            default: w(() => [...h[2] || (h[2] = [
              K("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : v("", !0),
      u.value ? (e(), i("div", pt, "Loading history…")) : v("", !0),
      a("div", vt, [
        a("p", {
          id: s(x),
          class: "pim-history-caption muted small"
        }, "Catalog changes, newest first", 8, ft),
        j.value.length ? (e(), i(M, { key: 0 }, [
          a("table", {
            class: "pim-grid",
            "aria-labelledby": s(x)
          }, [
            a("thead", null, [
              a("tr", null, [
                h[3] || (h[3] = a("th", { scope: "col" }, "When", -1)),
                l.canResolveActors ? (e(), i("th", yt, "Who")) : v("", !0),
                h[4] || (h[4] = a("th", { scope: "col" }, "What", -1)),
                h[5] || (h[5] = a("th", { scope: "col" }, "Change", -1))
              ])
            ]),
            a("tbody", null, [
              (e(!0), i(M, null, ee(j.value, (d) => (e(), i("tr", {
                key: d.key
              }, [
                a("td", gt, [
                  a("time", {
                    datetime: d.at
                  }, C(d.date), 9, ht)
                ]),
                l.canResolveActors ? (e(), i("td", kt, [
                  K(C(d.actor), 1),
                  d.source ? (e(), i("span", _t, " via " + C(d.source), 1)) : v("", !0)
                ])) : v("", !0),
                a("td", wt, [
                  K(C(d.product), 1),
                  d.context ? (e(), i("span", $t, " · " + C(d.context), 1)) : v("", !0)
                ]),
                a("td", null, [
                  K(C(d.change), 1),
                  !l.canResolveActors && d.source ? (e(), i("span", Ct, " via " + C(d.source), 1)) : v("", !0)
                ])
              ]))), 128))
            ])
          ], 8, bt),
          a("ol", {
            role: "list",
            class: "pim-stacked-list",
            "aria-labelledby": s(x)
          }, [
            (e(!0), i(M, null, ee(j.value, (d) => (e(), i("li", {
              key: d.key,
              class: "pim-stacked-row"
            }, [
              a("div", null, C(d.change), 1),
              a("div", Vt, [
                l.canResolveActors ? (e(), i("span", Ut, [
                  a("span", null, C(d.actor), 1),
                  d.source ? (e(), i(M, { key: 0 }, [
                    K(" via " + C(d.source), 1)
                  ], 64)) : v("", !0)
                ])) : d.source ? (e(), i("span", At, "Via " + C(d.source), 1)) : v("", !0),
                a("time", {
                  datetime: d.at
                }, C(d.date), 9, St),
                a("span", null, [
                  K(C(d.product), 1),
                  d.context ? (e(), i(M, { key: 0 }, [
                    K(" · " + C(d.context), 1)
                  ], 64)) : v("", !0)
                ])
              ])
            ]))), 128))
          ], 8, xt)
        ], 64)) : !u.value && !b.value ? (e(), i("div", jt, "Nothing recorded yet.")) : v("", !0),
        a("div", Rt, [
          a("span", null, C(j.value.length) + " change" + C(j.value.length === 1 ? "" : "s") + " shown", 1),
          c.value ? (e(), I(s(J), {
            key: 0,
            type: "button",
            disabled: u.value,
            onClick: h[1] || (h[1] = (d) => F(!0)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: w(() => [
              f(s(le), {
                icon: "tabler:adjustments",
                "aria-hidden": "true"
              }),
              h[6] || (h[6] = K(" Load older", -1))
            ]),
            _: 1
          }, 8, ["disabled"])) : v("", !0)
        ])
      ])
    ]));
  }
}), It = /* @__PURE__ */ ue({
  __name: "SettingsActions",
  props: {
    access: {},
    dirty: { type: Boolean },
    busy: { type: Boolean },
    valid: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(l, { emit: k }) {
    const t = k;
    return (r, c) => l.access?.admin ? (e(), i(M, { key: 0 }, [
      l.dirty ? (e(), I(s(ye), {
        key: 0,
        severity: "warn",
        value: "Unsaved changes"
      })) : v("", !0),
      l.dirty ? (e(), I(s(J), {
        key: 1,
        severity: "secondary",
        outlined: "",
        disabled: !l.dirty || l.busy,
        onClick: c[0] || (c[0] = (u) => t("discard"))
      }, {
        default: w(() => [
          f(s(le), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          }),
          c[2] || (c[2] = K(" Discard", -1))
        ]),
        _: 1
      }, 8, ["disabled"])) : v("", !0),
      f(s(J), {
        disabled: !l.dirty || l.busy || !l.valid,
        loading: l.busy,
        onClick: c[1] || (c[1] = (u) => t("review"))
      }, {
        default: w(() => [...c[3] || (c[3] = [
          K("Review changes", -1)
        ])]),
        _: 1
      }, 8, ["disabled", "loading"])
    ], 64)) : v("", !0);
  }
}), Tt = ["onKeydown"], Pt = ["id"], Ie = /* @__PURE__ */ ue({
  __name: "AddSchemaCode",
  props: {
    label: {},
    action: {},
    existing: {},
    fromName: { type: Boolean }
  },
  emits: ["add"],
  setup(l, { emit: k }) {
    const t = l, r = k, c = H(""), u = H(!1), b = H(), m = qe(), x = D(() => {
      const g = c.value.trim();
      return t.fromName ? Hl(g) : g;
    }), j = D(() => c.value.trim() ? t.existing?.includes(x.value) ? t.fromName ? "This name is already in use." : "This code is already in use." : t.fromName && !Na.test(x.value) ? "Use a name that starts with a letter from A to Z." : Na.test(x.value) ? "" : "Start with a lowercase letter and use only lowercase letters, numbers or underscores." : ""), F = D(() => !!x.value && !j.value);
    async function X() {
      u.value = !0, await Ke(), b.value?.querySelector("input")?.focus();
    }
    async function P() {
      u.value = !1, c.value = "", await Ke(), b.value?.querySelector("button")?.focus();
    }
    function B() {
      F.value && (r("add", x.value), P());
    }
    return (g, h) => (e(), i("div", {
      ref_key: "row",
      ref: b,
      class: "row pim-add-row"
    }, [
      u.value ? (e(), i("div", {
        key: 1,
        class: "row pim-add-editor",
        onKeydown: ta(Re(P, ["stop", "prevent"]), ["esc"])
      }, [
        f(s(Ge), {
          modelValue: c.value,
          "onUpdate:modelValue": h[0] || (h[0] = (d) => c.value = d),
          type: "text",
          placeholder: l.label,
          "aria-label": l.label,
          invalid: !!j.value,
          "aria-describedby": j.value ? s(m) : void 0,
          class: xe({ mono: !l.fromName }),
          onKeydown: ta(Re(B, ["prevent"]), ["enter"])
        }, null, 8, ["modelValue", "placeholder", "aria-label", "invalid", "aria-describedby", "class", "onKeydown"]),
        f(s(J), {
          type: "button",
          disabled: !F.value,
          size: "small",
          onClick: B
        }, {
          default: w(() => [
            K(C(l.action), 1)
          ]),
          _: 1
        }, 8, ["disabled"]),
        f(s(J), {
          type: "button",
          label: "Cancel",
          text: "",
          severity: "secondary",
          size: "small",
          onClick: P
        }),
        j.value ? (e(), i("p", {
          key: 0,
          id: s(m),
          role: "status",
          class: "pim-add-code-error small"
        }, C(j.value), 9, Pt)) : v("", !0)
      ], 40, Tt)) : (e(), I(s(J), {
        key: 0,
        type: "button",
        "aria-expanded": "false",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: X
      }, {
        default: w(() => [
          f(s(le), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          K(" " + C(l.action), 1)
        ]),
        _: 1
      })),
      Se(g.$slots, "default")
    ], 512));
  }
}), Wa = Symbol("definitionColumns"), qt = { code: "Code", kind: "Kind", details: "Details", usage: "Used by" }, Nt = {
  code: "minmax(120px, 1fr)",
  kind: "140px",
  details: "minmax(120px, 1.2fr)",
  usage: "120px"
}, Dt = {
  class: "pim-definition-scroll",
  tabindex: "0",
  "aria-label": "Definitions"
}, zt = { class: "pim-definition-grid" }, Ft = {
  key: 0,
  class: "pim-definition-columns",
  "aria-hidden": "true"
}, Te = /* @__PURE__ */ ue({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: { default: () => ["code"] }
  },
  setup(l) {
    const k = l;
    kl(Wa, D(() => k.columns));
    const t = D(() => ["48px", "minmax(160px, 1.4fr)", ...k.columns.map((r) => Nt[r]), "80px"].join(" "));
    return (r, c) => (e(), i("section", {
      class: "form pim-definition-list",
      style: ga({ "--pim-definition-columns": t.value })
    }, [
      Se(r.$slots, "head"),
      a("div", Dt, [
        a("div", zt, [
          l.count > 3 ? (e(), i("div", Ft, [
            c[0] || (c[0] = a("span", null, null, -1)),
            c[1] || (c[1] = a("span", null, "Name", -1)),
            (e(!0), i(M, null, ee(l.columns, (u) => (e(), i("span", {
              key: u,
              class: xe("pim-definition-" + u)
            }, C(s(qt)[u]), 3))), 128)),
            c[2] || (c[2] = a("span", null, null, -1))
          ])) : v("", !0),
          Se(r.$slots, "default")
        ])
      ]),
      Se(r.$slots, "add")
    ], 4));
  }
}), Bt = ["aria-label"], Lt = /* @__PURE__ */ ue({
  __name: "InteractiveSurface",
  props: {
    label: {}
  },
  setup(l) {
    return (k, t) => (e(), i("button", {
      type: "button",
      class: "pim-interactive",
      "aria-label": l.label
    }, [
      Se(k.$slots, "default")
    ], 8, Bt));
  }
}), Et = { class: "pim-definition" }, Mt = {
  class: "pim-definition-lead",
  "data-column": "lead"
}, Wt = {
  class: "pim-row-title",
  "data-column": "name"
}, Ht = { class: "pim-definition-meta" }, Jt = ["data-column"], Kt = {
  key: 0,
  class: "mono"
}, Gt = {
  class: "pim-definition-actions",
  "data-column": "actions"
}, Yt = ["id"], Pe = /* @__PURE__ */ ue({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ ha({
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
    const k = l, t = _l(Wa, D(() => [
      ...k.code ? ["code"] : [],
      ...k.kind ? ["kind"] : []
    ])), r = za(l, "open"), c = qe();
    return (u, b) => (e(), i("section", Et, [
      a("header", {
        class: xe(["pim-definition-head", l.headClass])
      }, [
        f(Lt, {
          class: xe(["pim-definition-toggle", l.toggleClass]),
          "aria-expanded": r.value,
          "aria-controls": r.value ? s(c) : void 0,
          onClick: b[0] || (b[0] = (m) => r.value = !r.value)
        }, {
          default: w(() => [
            a("span", Mt, [
              f(s(le), {
                icon: "tabler:chevron-right",
                class: "pim-definition-chevron",
                "aria-hidden": "true"
              })
            ]),
            a("span", Wt, C(l.title), 1),
            a("span", Ht, [
              (e(!0), i(M, null, ee(s(t), (m) => (e(), i("span", {
                key: m,
                class: xe("pim-definition-" + m),
                "data-column": m
              }, [
                m === "code" && l.code ? (e(), i("code", Kt, C(l.code), 1)) : m === "kind" && l.kind ? (e(), I(s(ye), {
                  key: 1,
                  severity: "secondary",
                  value: l.kind
                }, null, 8, ["value"])) : m === "details" ? Se(u.$slots, "details", {}, void 0, void 0, 2) : m === "usage" ? Se(u.$slots, "usage", {}, () => [
                  K(C(l.usage), 1)
                ], void 0, 3) : v("", !0)
              ], 10, Jt))), 128))
            ])
          ]),
          _: 3
        }, 8, ["class", "aria-expanded", "aria-controls"]),
        a("div", Gt, [
          Se(u.$slots, "actions")
        ])
      ], 2),
      f(wl, { name: "pim-expand" }, {
        default: w(() => [
          r.value ? (e(), i("div", {
            key: 0,
            id: s(c),
            class: "pim-definition-body"
          }, [
            Se(u.$slots, "default")
          ], 8, Yt)) : v("", !0)
        ]),
        _: 3
      })
    ]));
  }
}), Zt = { class: "pim-chips pim-picker-chips" }, Qt = {
  key: 0,
  class: "muted small"
}, Ce = /* @__PURE__ */ ue({
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
  setup(l, { emit: k }) {
    const t = l, r = k, c = H("");
    function u(F) {
      return t.modelValue.includes(F);
    }
    function b(F) {
      t.disabled || !F || r("update:modelValue", u(F) ? t.modelValue.filter((X) => X !== F) : [...t.modelValue, F]);
    }
    function m() {
      const F = c.value.trim();
      if (!F || u(F)) {
        c.value = "";
        return;
      }
      r("update:modelValue", [...t.modelValue, F]), c.value = "";
    }
    function x(F) {
      r("update:modelValue", t.modelValue.filter((X) => X !== F));
    }
    function j(F) {
      return t.options?.find((X) => X.value === F)?.label ?? F;
    }
    return (F, X) => (e(), i("div", Zt, [
      l.disabled ? (e(), i(M, { key: 0 }, [
        (e(!0), i(M, null, ee(l.modelValue, (P) => (e(), i("span", { key: P }, C(j(P)), 1))), 128)),
        l.modelValue.length ? v("", !0) : (e(), i("span", Qt, "None"))
      ], 64)) : l.options && (l.dropdown || l.options.length > 10) ? (e(), i(M, { key: 1 }, [
        (e(!0), i(M, null, ee(l.modelValue, (P) => (e(), i("span", {
          key: P,
          class: "row"
        }, [
          K(C(j(P)), 1),
          l.disabled ? v("", !0) : (e(), I(s(J), {
            key: 0,
            type: "button",
            "aria-label": "Remove " + j(P),
            onClick: (B) => x(P),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: w(() => [
              f(s(le), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"]))
        ]))), 128)),
        l.disabled ? v("", !0) : (e(), I(s(he), {
          key: 0,
          "model-value": null,
          placeholder: l.placeholder ?? "Add…",
          "aria-labelledby": l.labelledby,
          "aria-label": l.placeholder ?? "Add",
          "onUpdate:modelValue": X[0] || (X[0] = (P) => b(P)),
          class: "pim-chip-entry",
          options: l.options.filter((P) => !u(P.value)).map((P) => ({ value: P.value, label: P.label ?? P.value })),
          "option-label": "label",
          "option-value": "value",
          appendTo: "self"
        }, null, 8, ["placeholder", "aria-labelledby", "aria-label", "options"]))
      ], 64)) : l.options ? (e(), i(M, { key: 2 }, [
        f(s($a), {
          "model-value": l.modelValue.filter((P) => l.options.some((B) => B.value === P)),
          options: l.options.map((P) => ({ value: P.value, label: P.label ?? P.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          disabled: l.disabled,
          "aria-labelledby": l.labelledby,
          "aria-label": l.placeholder ?? "Selected values",
          "onUpdate:modelValue": X[1] || (X[1] = (P) => r("update:modelValue", [...P, ...l.modelValue.filter((B) => !l.options.some((g) => g.value === B))]))
        }, null, 8, ["model-value", "options", "disabled", "aria-labelledby", "aria-label"]),
        (e(!0), i(M, null, ee(l.modelValue.filter((P) => !l.options.some((B) => B.value === P)), (P) => (e(), i("span", {
          key: P,
          class: "row"
        }, [
          K(C(j(P)), 1),
          f(s(J), {
            type: "button",
            "aria-label": "Remove " + P,
            onClick: (B) => x(P),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: w(() => [
              f(s(le), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128))
      ], 64)) : (e(!0), i(M, { key: 3 }, ee(l.modelValue, (P) => (e(), i("span", {
        key: P,
        class: "row"
      }, [
        K(C(P), 1),
        f(s(J), {
          type: "button",
          "aria-label": "Remove " + P,
          onClick: (B) => x(P),
          size: "small",
          text: "",
          severity: "secondary"
        }, {
          default: w(() => [
            f(s(le), { icon: "tabler:x" })
          ]),
          _: 1
        }, 8, ["aria-label", "onClick"])
      ]))), 128)),
      l.free && !l.disabled ? (e(), I(s(Ge), {
        key: 4,
        modelValue: c.value,
        "onUpdate:modelValue": X[2] || (X[2] = (P) => c.value = P),
        type: "text",
        "aria-labelledby": l.labelledby,
        placeholder: l.placeholder ?? "Add…",
        onKeydown: ta(Re(m, ["prevent"]), ["enter"]),
        onBlur: m,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "aria-labelledby", "placeholder", "onKeydown"])) : v("", !0)
    ]));
  }
}), Xt = { key: 0 }, es = {
  key: 0,
  class: "pim-config-overrides"
}, as = {
  key: 1,
  class: "muted small"
}, ls = { key: 3 }, ts = ["schema", "config"], ss = {
  key: 1,
  class: "muted small",
  role: "status"
}, Ca = /* @__PURE__ */ ue({
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
  setup(l, { emit: k }) {
    const t = l, r = k, c = H("pending"), u = D(() => {
      const x = t.schema.properties;
      return Object.entries(t.modelValue).map(([j, F]) => ({
        key: j,
        label: x?.[j]?.title ?? z(j),
        value: F !== null && typeof F == "object" ? JSON.stringify(F) : ra(F)
      }));
    });
    async function b() {
      c.value = "pending", c.value = await Da("wc-schema-form") ? "ready" : "failed";
    }
    ve(() => t.disabled, (x) => {
      x || b();
    }, { immediate: !0 });
    function m(x) {
      const j = x.detail;
      j && typeof j == "object" && !Array.isArray(j) && r("update:modelValue", j);
    }
    return (x, j) => (e(), i(M, null, [
      l.problem ? (e(), I(s(_e), {
        key: 0,
        severity: "warn",
        role: "alert"
      }, {
        default: w(() => [
          l.problemLabel ? (e(), i(M, { key: 0 }, [
            K(C(l.problemLabel) + " is required. Enter a value below.", 1)
          ], 64)) : (e(), i(M, { key: 1 }, [
            K("The saved settings don’t meet the plugin’s requirements. Update the configuration below.")
          ], 64))
        ]),
        _: 1
      })) : v("", !0),
      l.problem ? (e(), I(Ae, {
        key: 1,
        class: "small pim-error-code pim-ia-disclosure",
        label: "Technical details"
      }, {
        default: w(() => [
          l.pluginId ? (e(), i("p", Xt, [
            j[1] || (j[1] = K("Plugin ", -1)),
            a("code", null, C(l.pluginId), 1)
          ])) : v("", !0),
          a("p", null, C(l.problem.message), 1)
        ]),
        _: 1
      })) : v("", !0),
      l.disabled ? (e(), i(M, { key: 2 }, [
        u.value.length ? (e(), i("dl", es, [
          (e(!0), i(M, null, ee(u.value, (F) => (e(), i(M, {
            key: F.key
          }, [
            a("dt", null, C(F.label), 1),
            a("dd", null, C(F.value), 1)
          ], 64))), 128))
        ])) : (e(), i("span", as, "No overrides"))
      ], 64)) : (e(), i("div", ls, [
        c.value === "ready" ? (e(), i("wc-schema-form", {
          key: 0,
          schema: JSON.stringify(t.schema),
          config: JSON.stringify(l.modelValue),
          onConfigChanged: m
        }, null, 40, ts)) : c.value === "pending" ? (e(), i("span", ss, "Configuration form is loading.")) : (e(), I(s(_e), {
          key: 2,
          role: "alert",
          severity: "error"
        }, {
          default: w(() => [
            j[3] || (j[3] = K("Configuration form could not be loaded. ", -1)),
            f(s(J), {
              type: "button",
              onClick: b,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: w(() => [...j[2] || (j[2] = [
                K("Retry", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })),
        l.problem ? v("", !0) : (e(), I(s(J), {
          key: 3,
          type: "button",
          onClick: j[0] || (j[0] = (F) => r("update:modelValue", {})),
          severity: "secondary",
          outlined: "",
          size: "small"
        }, {
          default: w(() => [
            f(s(le), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            }),
            j[4] || (j[4] = K(" Reset overrides", -1))
          ]),
          _: 1
        }))
      ]))
    ], 64));
  }
}), is = { key: 0 }, ns = /* @__PURE__ */ ue({
  __name: "DefaultValue",
  props: {
    attribute: {},
    type: {},
    disabled: { type: Boolean }
  },
  emits: ["change"],
  setup(l, { emit: k }) {
    const t = l, r = k, c = D(() => {
      const x = t.type?.form;
      let j = { type: "string" };
      return x === "bool" ? j = { type: "boolean" } : x === "int" ? j = { type: "integer" } : x === "dec" ? j = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : x === "quantity" ? j = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(t.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : x === "record" ? j = { type: "object", additionalProperties: !0 } : x === "ref" && (j = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${t.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (t.attribute.cardinality ?? "one") !== "one" && (j = { type: "array", items: j, uniqueItems: t.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...j, title: "Default value" } } };
    });
    function u(x) {
      return x && typeof x == "object" && "m" in x && "e" in x ? wa(x) : x;
    }
    function b(x) {
      return t.type?.form === "dec" ? u(x) : t.type?.form === "quantity" && x && typeof x == "object" && "v" in x && "u" in x ? { value: u(x.v), unit: x.u } : x;
    }
    const m = D(() => t.attribute.default === void 0 ? {} : { value: Array.isArray(t.attribute.default) ? t.attribute.default.map(b) : b(t.attribute.default) });
    return (x, j) => l.disabled ? (e(), i("span", is, C(l.attribute.default == null ? "No default" : s(ra)(l.attribute.default)), 1)) : (e(), I(Ca, {
      key: 1,
      schema: c.value,
      "model-value": m.value,
      "onUpdate:modelValue": j[0] || (j[0] = (F) => r("change", F.value))
    }, null, 8, ["schema", "model-value"]));
  }
}), os = { class: "pim-stack" }, ds = { class: "form pim-card-body pad pim-ia-action pim-family-filter" }, rs = {
  key: 0,
  class: "form pim-card-body pad muted"
}, us = { class: "pim-bsection-head pim-list-header" }, cs = { class: "small muted" }, ms = { class: "row pim-list-actions" }, ps = { class: "pim-fields" }, vs = { class: "pim-f pim-w-third" }, fs = { class: "pim-f-label" }, bs = ["id"], ys = { class: "pim-f pim-w-third" }, gs = { class: "pim-f-label" }, hs = ["id"], ks = {
  key: 0,
  class: "pim-f pim-w-third"
}, _s = { class: "pim-f-label" }, ws = ["id"], $s = {
  key: 1,
  class: "pim-f pim-w-full muted small"
}, Cs = {
  key: 2,
  class: "pim-f pim-w-full muted small"
}, xs = {
  key: 3,
  class: "pim-f pim-w-third"
}, Vs = { class: "pim-f-label" }, Us = ["id"], As = { class: "pim-f pim-w-third" }, Ss = { class: "pim-f-label" }, js = ["id"], Rs = { class: "pim-f pim-w-half" }, Os = { class: "pim-f-label" }, Is = ["id"], Ts = ["aria-labelledby"], Ps = { class: "pim-f-label" }, qs = ["id"], Ns = ["aria-labelledby"], Ds = { class: "pim-f-label" }, zs = ["id"], Fs = { class: "pim-fields" }, Bs = { class: "pim-f pim-w-third" }, Ls = { class: "pim-f-label" }, Es = ["for"], Ms = {
  key: 0,
  class: "pim-f-note"
}, Ws = { class: "pim-f pim-w-third" }, Hs = { class: "pim-f-label" }, Js = ["id"], Ks = { class: "pim-f pim-w-half" }, Gs = { class: "pim-f-label" }, Ys = ["for"], Zs = { class: "row" }, Qs = {
  key: 0,
  class: "pim-f pim-w-full"
}, Xs = { class: "pim-f-label" }, ei = ["id"], ai = ["aria-labelledby"], li = ["id"], ti = {
  key: 0,
  class: "row end"
}, si = { class: "pim-ia-dialog-head" }, ii = {
  tabindex: "-1",
  autofocus: ""
}, ni = { class: "pim-source-permissions" }, oi = ["id"], di = { class: "dialog-actions pim-group-dialog-actions" }, ri = /* @__PURE__ */ ue({
  __name: "BuilderFields",
  props: /* @__PURE__ */ ha({
    draft: {},
    schema: {},
    options: {}
  }, {
    family: { default: "" },
    familyModifiers: {}
  }),
  emits: /* @__PURE__ */ ha(["remove"], ["update:family"]),
  setup(l, { emit: k }) {
    const t = l, r = za(l, "family"), c = k, u = oa.map((A) => A.value), b = [{ value: "one", label: "Single value" }, { value: "list", label: "Ordered list" }, { value: "set", label: "Unique set" }], m = D(() => t.schema.access.admin), x = D(() => t.draft.aspects ?? []), j = D(() => (t.draft.families ?? []).filter((A) => A.code !== "generic"));
    ve(j, (A) => {
      r.value && !A.some((R) => R.code === r.value) && (r.value = "");
    }, { immediate: !0 });
    const F = D(() => [{ value: "", label: "All families" }, ...j.value.map((A) => ({ value: A.code, label: z(A.code) }))]), X = D(() => {
      const A = j.value.find((R) => R.code === r.value);
      return A ? x.value.filter((R) => A.aspects?.includes(R.namespace)) : x.value;
    }), P = D(() => (t.draft.dimensions ?? []).map((A) => ({ value: A.name, label: z(A.name) }))), B = D(() => (t.draft.vocabularies ?? []).map((A) => A.code)), g = D(() => (t.draft.sources ?? []).map((A) => ({ value: A.id, label: z(A.id) }))), h = D(() => [...t.options.types].sort((A, R) => A.form.localeCompare(R.form)).map((A) => ({ value: A.id, label: la(A) })));
    function d(A) {
      return t.options.types.find((R) => R.id === A.type);
    }
    function U(A) {
      return d(A)?.target === "term";
    }
    function T(A) {
      return d(A)?.target === "asset";
    }
    function E(A) {
      const R = d(A);
      return !!R && R.form === "ref" && !R.target;
    }
    function ie(A) {
      return j.value.filter((R) => R.aspects?.includes(A)).map((R) => z(R.code));
    }
    function Ve(A) {
      const R = ie(A);
      return R.length ? R.length === 1 ? R[0] : R.length + " families" : "Unused by families";
    }
    const ae = { none: "None", key: "Exact match", number: "Number range", text: "Text search" }, Q = H({}), L = qe(), S = /* @__PURE__ */ new WeakMap();
    let G = 0;
    function N(A, R) {
      if (R.id !== void 0) return A + "." + R.id;
      const q = $l(R);
      let $ = S.get(q);
      return $ === void 0 && ($ = ++G, S.set(q, $)), A + ".draft-" + $;
    }
    function n(A, R, q) {
      return L + "-" + N(A, R) + "-" + q;
    }
    function V(A, R) {
      A.type = R;
      const q = d(A);
      if (q && A.index && !q.indexes.includes(A.index) && delete A.index, U(A) || delete A.vocabulary, T(A) && delete A.default, !E(A) && A.config && "target" in A.config) {
        const { target: $, ...oe } = A.config;
        A.config = Object.keys(oe).length ? oe : void 0, A.config || delete A.config;
      }
    }
    function o(A, R) {
      Object.keys(R).length ? A.config = R : delete A.config;
    }
    function _(A, R) {
      const q = { ...A.config ?? {} };
      R ? q.target = R : delete q.target, o(A, q);
    }
    function W(A, R) {
      R.length ? A.scope = R : delete A.scope, R.length || delete A.index_contexts;
    }
    function Z(A, R, q) {
      q === void 0 || q === "" || q === !1 && R !== "default" ? delete A[R] : A[R] = q;
    }
    function te(A) {
      return A.index_contexts ?? [];
    }
    function ne(A) {
      return (t.draft.dimensions ?? []).find((R) => R.name === A)?.members ?? [];
    }
    function Ee(A) {
      const R = {};
      for (const $ of A.scope ?? []) R[$] = ne($)[0] ?? "";
      (A.index_contexts ?? (A.index_contexts = [])).push(R);
    }
    const me = H(), Ze = D(() => me.value ? z(me.value.namespace) + " settings" : "");
    async function Ne(A, R, q, $) {
      const oe = A.currentTarget, Y = oe.parentElement;
      na(R, q, $), await Ke(), oe.disabled ? Y?.querySelector("button:enabled")?.focus({ preventScroll: !0 }) : oe.focus({ preventScroll: !0 });
    }
    function ma(A) {
      (t.draft.aspects ??= []).push({ namespace: A, attributes: [] });
    }
    function pa(A) {
      me.value = void 0;
      const R = x.value.indexOf(A);
      R >= 0 && x.value.splice(R, 1), t.schema.declaration.aspects?.some((q) => q.namespace === A.namespace) && c("remove", "aspects", A.namespace);
    }
    function Ue(A, R) {
      const q = t.options.types.find((oe) => oe.id === "kickside.pim.types:text") ?? t.options.types[0], $ = { code: R, type: q?.id ?? "" };
      (A.attributes ??= []).push($), Q.value[N(A.namespace, $)] = !0;
    }
    function we(A, R) {
      const q = A.attributes ?? [], $ = q.indexOf(R);
      $ >= 0 && q.splice($, 1);
      const oe = R.id === void 0 ? void 0 : t.schema.declaration.aspects?.find((Y) => Y.namespace === A.namespace)?.attributes?.find((Y) => Y.id === R.id);
      oe && c("remove", "attributes", A.namespace + "." + oe.code);
    }
    return (A, R) => (e(), i("div", os, [
      a("div", ds, [
        R[6] || (R[6] = a("div", null, [
          a("h3", null, "Field groups"),
          a("p", null, "Families share fields through groups. A change to a shared field applies to each family that uses it.")
        ], -1)),
        j.value.length ? (e(), I(s(he), {
          key: 0,
          modelValue: r.value,
          "onUpdate:modelValue": R[0] || (R[0] = (q) => r.value = q),
          "aria-label": "Show fields for a family",
          placeholder: "All families",
          options: F.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self"
        }, null, 8, ["modelValue", "options"])) : v("", !0),
        m.value && !r.value ? (e(), I(Ie, {
          key: 1,
          label: "Field group name",
          action: "Add field group",
          "from-name": "",
          existing: x.value.map((q) => q.namespace),
          onAdd: ma
        }, null, 8, ["existing"])) : v("", !0)
      ]),
      r.value && !X.value.length ? (e(), i("p", rs, "This family has no field groups yet. Open the family to choose which groups it uses.")) : v("", !0),
      (e(!0), i(M, null, ee(X.value, (q) => (e(), I(Te, {
        key: q.namespace,
        count: q.attributes?.length ?? 0,
        columns: ["kind", "details", "usage"]
      }, {
        head: w(() => [
          a("header", us, [
            a("div", null, [
              a("h3", null, C(s(z)(q.namespace)), 1),
              a("p", cs, C(ie(q.namespace).length ? "Used by " + ie(q.namespace).join(", ") : "Unused by families"), 1)
            ]),
            a("div", ms, [
              m.value ? (e(), I(Ie, {
                key: 0,
                label: "Field name",
                action: "Add field",
                "from-name": "",
                existing: q.attributes?.map(($) => $.code),
                onAdd: ($) => Ue(q, $)
              }, null, 8, ["existing", "onAdd"])) : v("", !0),
              f(s(J), {
                type: "button",
                "aria-label": s(z)(q.namespace) + " settings",
                title: s(z)(q.namespace) + " settings",
                "aria-haspopup": "dialog",
                severity: "secondary",
                text: "",
                size: "small",
                onClick: ($) => me.value = q
              }, {
                default: w(() => [
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
        default: w(() => [
          (e(!0), i(M, null, ee(q.attributes ?? [], ($, oe) => (e(), I(Pe, {
            key: N(q.namespace, $),
            open: Q.value[N(q.namespace, $)],
            "onUpdate:open": (Y) => Q.value[N(q.namespace, $)] = Y,
            title: s(z)($.code),
            kind: s(la)(d($)),
            usage: Ve(q.namespace),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle"
          }, Oe({
            details: w(() => [
              $.cardinality && $.cardinality !== "one" ? (e(), I(s(ye), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [
                  K(C(b.find((Y) => Y.value === $.cardinality)?.label), 1)
                ]),
                _: 2
              }, 1024)) : v("", !0),
              $.scope?.length ? (e(), I(s(ye), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [
                  K("per " + C($.scope.map(s(z)).join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : v("", !0),
              $.index && $.index !== "none" ? (e(), I(s(ye), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [
                  K(C(ae[$.index] || "Filterable"), 1)
                ]),
                _: 2
              }, 1024)) : v("", !0),
              $.unique ? (e(), I(s(ye), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [...R[7] || (R[7] = [
                  K("unique", -1)
                ])]),
                _: 1
              })) : v("", !0)
            ]),
            default: w(() => [
              a("div", ps, [
                a("div", vs, [
                  a("div", fs, [
                    a("label", {
                      id: n(q.namespace, $, "type")
                    }, "Type", 8, bs)
                  ]),
                  f(s(he), {
                    disabled: !m.value,
                    "aria-labelledby": n(q.namespace, $, "type"),
                    "model-value": $.type,
                    options: h.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (Y) => V($, Y)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                a("div", ys, [
                  a("div", gs, [
                    a("label", {
                      id: n(q.namespace, $, "values")
                    }, "Values", 8, hs)
                  ]),
                  f(s(he), {
                    disabled: !m.value,
                    "aria-labelledby": n(q.namespace, $, "values"),
                    "model-value": $.cardinality ?? "one",
                    options: b,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (Y) => Z($, "cardinality", Y === "one" ? void 0 : Y)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                U($) ? (e(), i("div", ks, [
                  a("div", _s, [
                    a("label", {
                      id: n(q.namespace, $, "vocabulary")
                    }, "Vocabulary", 8, ws)
                  ]),
                  f(s(he), {
                    disabled: !m.value,
                    "aria-labelledby": n(q.namespace, $, "vocabulary"),
                    "model-value": $.vocabulary ?? "",
                    "onUpdate:modelValue": (Y) => Z($, "vocabulary", Y),
                    options: [{ value: "", label: "Choose…" }, ...B.value.map((Y) => ({ value: Y, label: s(z)(Y) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : v("", !0),
                T($) ? (e(), i("p", $s, "Choose the media types and file size this field accepts. Catalog readers can access attached files.")) : d($)?.form === "ref" && !U($) ? (e(), i("p", Cs, C(E($) ? "A link points to something managed by an installed plugin." : "A product reference points to another product in this catalog."), 1)) : v("", !0),
                E($) ? (e(), i("div", xs, [
                  a("div", Vs, [
                    a("label", {
                      id: n(q.namespace, $, "link")
                    }, "Link destination", 8, Us),
                    R[8] || (R[8] = a("span", { class: "pim-f-note" }, "choose what the field can point to", -1))
                  ]),
                  f(s(he), {
                    disabled: !m.value,
                    "aria-labelledby": n(q.namespace, $, "link"),
                    "model-value": $.config?.target ?? "",
                    "onUpdate:modelValue": (Y) => _($, Y),
                    options: [{ value: "", label: "Choose…" }, ...l.options.link_kinds.map((Y) => ({ value: Y.kind, label: s(re)(Y.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : v("", !0),
                a("div", As, [
                  a("div", Ss, [
                    a("label", {
                      id: n(q.namespace, $, "width")
                    }, "Width", 8, js),
                    R[9] || (R[9] = a("span", { class: "pim-f-note" }, "of a form row", -1))
                  ]),
                  f(s($a), {
                    disabled: !m.value,
                    "aria-labelledby": n(q.namespace, $, "width"),
                    "model-value": s(_a)(l.schema, q.namespace, $),
                    options: s(u),
                    "allow-empty": !1,
                    "onUpdate:modelValue": (Y) => $.width = Y
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                a("div", Rs, [
                  a("div", Os, [
                    a("label", {
                      id: n(q.namespace, $, "scope")
                    }, "Varies per", 8, Is),
                    R[10] || (R[10] = a("span", { class: "pim-f-note" }, "dimensions the value depends on", -1))
                  ]),
                  f(Ce, {
                    disabled: !m.value,
                    labelledby: n(q.namespace, $, "scope"),
                    "model-value": $.scope ?? [],
                    options: P.value,
                    "onUpdate:modelValue": (Y) => W($, Y)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                T($) ? v("", !0) : (e(), i("div", {
                  key: 4,
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": n(q.namespace, $, "default")
                }, [
                  a("div", Ps, [
                    a("label", {
                      id: n(q.namespace, $, "default")
                    }, "Default", 8, qs),
                    R[11] || (R[11] = a("span", { class: "pim-f-note" }, "when no value is set", -1))
                  ]),
                  f(ns, {
                    disabled: !m.value,
                    attribute: $,
                    type: d($),
                    onChange: (Y) => Z($, "default", Y)
                  }, null, 8, ["disabled", "attribute", "type", "onChange"])
                ], 8, Ts)),
                d($)?.config_schema ? (e(), i("div", {
                  key: 5,
                  class: "pim-f pim-w-full",
                  role: "group",
                  "aria-labelledby": n(q.namespace, $, "config")
                }, [
                  a("div", Ds, [
                    a("label", {
                      id: n(q.namespace, $, "config")
                    }, "Type configuration", 8, zs)
                  ]),
                  f(Ca, {
                    disabled: !m.value,
                    schema: d($).config_schema,
                    "model-value": $.config ?? {},
                    "onUpdate:modelValue": (Y) => o($, Y)
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue"])
                ], 8, Ns)) : v("", !0)
              ]),
              f(Ae, {
                class: "pim-field-advanced pim-ia-disclosure",
                label: "Advanced"
              }, {
                default: w(() => [
                  a("div", Fs, [
                    a("div", Bs, [
                      a("div", Ls, [
                        a("label", {
                          for: n(q.namespace, $, "code")
                        }, "Integration key", 8, Es),
                        $.id !== void 0 ? (e(), i("span", Ms, "renaming keeps stored values")) : v("", !0)
                      ]),
                      f(s(Ge), {
                        disabled: !m.value,
                        id: n(q.namespace, $, "code"),
                        type: "text",
                        value: $.code,
                        onInput: (Y) => $.code = Y.target.value,
                        class: "mono"
                      }, null, 8, ["disabled", "id", "value", "onInput"])
                    ]),
                    a("div", Ws, [
                      a("div", Hs, [
                        a("label", {
                          id: n(q.namespace, $, "index")
                        }, "Search and filters", 8, Js),
                        R[12] || (R[12] = a("span", { class: "pim-f-note" }, "choose how this field can be matched", -1))
                      ]),
                      f(s(he), {
                        disabled: !m.value,
                        "aria-labelledby": n(q.namespace, $, "index"),
                        "model-value": $.index ?? "none",
                        options: (d($)?.indexes ?? ["none"]).map((Y) => ({ value: Y, label: ae[Y] || s(z)(Y) })),
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self",
                        "onUpdate:modelValue": (Y) => Z($, "index", Y === "none" ? void 0 : Y)
                      }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ]),
                    a("div", Ks, [
                      a("div", Gs, [
                        a("label", {
                          for: n(q.namespace, $, "unique")
                        }, "Unique", 8, Ys),
                        R[13] || (R[13] = a("span", { class: "pim-f-note" }, "one holder per value, catalog wide", -1))
                      ]),
                      a("div", Zs, [
                        f(s(sa), {
                          "input-id": n(q.namespace, $, "unique"),
                          "model-value": $.unique === !0,
                          disabled: !m.value || !!$.scope?.length || ($.cardinality ?? "one") !== "one",
                          "onUpdate:modelValue": (Y) => Z($, "unique", Y)
                        }, null, 8, ["input-id", "model-value", "disabled", "onUpdate:modelValue"]),
                        a("span", null, C($.unique ? "Yes" : "No"), 1)
                      ])
                    ]),
                    ($.scope?.length ?? 0) > 0 && $.index && $.index !== "none" ? (e(), i("div", Qs, [
                      a("div", Xs, [
                        a("label", {
                          id: n(q.namespace, $, "contexts")
                        }, "Filterable combinations", 8, ei),
                        R[14] || (R[14] = a("span", { class: "pim-f-note" }, "which combinations get an index", -1))
                      ]),
                      a("div", {
                        class: "pim-contexts",
                        role: "group",
                        "aria-labelledby": n(q.namespace, $, "contexts")
                      }, [
                        (e(!0), i(M, null, ee(te($), (Y, je) => (e(), i("div", {
                          key: je,
                          class: "pim-context-row"
                        }, [
                          (e(!0), i(M, null, ee($.scope, (fe) => (e(), i("div", {
                            key: fe,
                            class: "pim-context-field"
                          }, [
                            a("span", {
                              id: n(q.namespace, $, "context-" + je + "-" + fe),
                              class: "small muted"
                            }, C(s(z)(fe)), 9, li),
                            f(s(he), {
                              disabled: !m.value,
                              "aria-labelledby": n(q.namespace, $, "context-" + je + "-" + fe),
                              "model-value": Y[fe] ?? "",
                              options: ne(fe),
                              class: "narrow",
                              appendTo: "self",
                              "onUpdate:modelValue": (Qe) => Y[fe] = Qe
                            }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                          ]))), 128)),
                          m.value ? (e(), I(s(J), {
                            key: 0,
                            type: "button",
                            "aria-label": "Remove context",
                            onClick: (fe) => te($).splice(je, 1),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: w(() => [
                              f(s(le), { icon: "tabler:x" })
                            ]),
                            _: 1
                          }, 8, ["onClick"])) : v("", !0)
                        ]))), 128)),
                        m.value ? (e(), I(s(J), {
                          key: 0,
                          type: "button",
                          onClick: (Y) => Ee($),
                          severity: "secondary",
                          outlined: "",
                          size: "small"
                        }, {
                          default: w(() => [
                            f(s(le), {
                              icon: "tabler:plus",
                              "aria-hidden": "true"
                            }),
                            R[15] || (R[15] = K(" Add context", -1))
                          ]),
                          _: 1
                        }, 8, ["onClick"])) : v("", !0)
                      ], 8, ai)
                    ])) : v("", !0)
                  ])
                ]),
                _: 2
              }, 1024),
              m.value ? (e(), i("div", ti, [
                f(s(J), {
                  type: "button",
                  onClick: (Y) => we(q, $),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    f(s(le), { icon: "tabler:trash" }),
                    R[16] || (R[16] = K(" Remove field", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : v("", !0)
            ]),
            _: 2
          }, [
            m.value ? {
              name: "actions",
              fn: w(() => [
                f(s(J), {
                  type: "button",
                  disabled: oe === 0,
                  "aria-label": "Move " + s(z)($.code) + " earlier",
                  onClick: (Y) => Ne(Y, q.attributes, oe, oe - 1),
                  text: "",
                  severity: "secondary"
                }, {
                  default: w(() => [
                    f(s(le), {
                      icon: "tabler:arrow-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                f(s(J), {
                  type: "button",
                  disabled: oe === (q.attributes?.length ?? 0) - 1,
                  "aria-label": "Move " + s(z)($.code) + " later",
                  onClick: (Y) => Ne(Y, q.attributes, oe, oe + 1),
                  text: "",
                  severity: "secondary"
                }, {
                  default: w(() => [
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
      f(da, {
        visible: !!me.value,
        label: Ze.value,
        onClose: R[5] || (R[5] = (q) => me.value = void 0)
      }, {
        default: w(() => [
          me.value ? (e(), i("section", {
            key: 0,
            class: "pim-ia-dialog",
            onKeydown: R[4] || (R[4] = ta(Re((q) => me.value = void 0, ["prevent"]), ["esc"]))
          }, [
            a("header", si, [
              a("h2", ii, C(Ze.value), 1)
            ]),
            a("div", ni, [
              a("label", {
                id: s(L) + "-writers"
              }, "Sources allowed to write", 8, oi),
              f(s(La), {
                disabled: !m.value,
                "aria-labelledby": s(L) + "-writers",
                "model-value": me.value.write?.sources ?? [],
                options: g.value,
                "option-label": "label",
                "option-value": "value",
                placeholder: "Any source",
                "append-to": "self",
                "onUpdate:modelValue": R[1] || (R[1] = (q) => me.value.write = { sources: q })
              }, null, 8, ["disabled", "aria-labelledby", "model-value", "options"])
            ]),
            a("footer", di, [
              m.value ? (e(), I(s(J), {
                key: 0,
                type: "button",
                label: "Remove field group",
                severity: "danger",
                text: "",
                onClick: R[2] || (R[2] = (q) => pa(me.value))
              })) : v("", !0),
              f(s(J), {
                type: "button",
                label: "Done",
                severity: "secondary",
                outlined: "",
                onClick: R[3] || (R[3] = (q) => me.value = void 0)
              })
            ])
          ], 32)) : v("", !0)
        ]),
        _: 1
      }, 8, ["visible", "label"])
    ]));
  }
}), ui = { class: "muted small" }, ci = { class: "pim-aspect" }, mi = {
  key: 0,
  class: "small muted"
}, pi = { class: "pim-fields" }, vi = { class: "pim-f pim-w-full" }, fi = { class: "pim-f-label" }, bi = ["id"], yi = { class: "pim-f-label" }, gi = ["id"], hi = /* @__PURE__ */ ue({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(l, { emit: k }) {
    const t = l, r = k, c = D(() => t.schema.access.admin), u = D(() => t.draft.dimensions ?? []), b = qe();
    function m(g, h) {
      return b + "-" + g.name + "-" + h;
    }
    function x(g) {
      (t.draft.dimensions ??= []).push({ name: g, members: [] });
    }
    function j(g) {
      const h = [];
      for (const d of t.draft.aspects ?? []) for (const U of d.attributes ?? []) U.scope?.includes(g.name) && h.push(`${z(U.code)} (${z(d.namespace)})`);
      for (const d of t.draft.families ?? []) for (const U of d.requirements ?? []) U.context && g.name in U.context && h.push(`${z(U.id)} (${z(d.code)})`);
      return h;
    }
    function F(g) {
      j(g).length || (u.value.splice(u.value.indexOf(g), 1), t.schema.declaration.dimensions?.some((h) => h.name === g.name) && r("remove", "dimensions", g.name));
    }
    function X(g, h) {
      if (g.members = h, g.fallback)
        for (const d of Object.keys(g.fallback)) h.includes(d) || delete g.fallback[d];
    }
    function P(g, h) {
      return g.fallback?.[h] ?? [];
    }
    function B(g, h, d) {
      const U = { ...g.fallback ?? {} };
      d.length ? U[h] = d : delete U[h], Object.keys(U).length ? g.fallback = U : delete g.fallback;
    }
    return (g, h) => (e(), I(Te, {
      count: u.value.length,
      columns: ["details", "usage"]
    }, Oe({
      default: w(() => [
        (e(!0), i(M, null, ee(u.value, (d) => (e(), I(Pe, {
          title: s(z)(d.name),
          key: d.name,
          usage: j(d).length ? "Used in " + j(d).length + " places" : "Unused"
        }, Oe({
          details: w(() => [
            a("span", ui, C(d.members.map(s(z)).join(", ") || "No allowed values"), 1)
          ]),
          default: w(() => [
            a("div", ci, [
              j(d).length ? (e(), i("p", mi, "Used by " + C(j(d).join(", ")), 1)) : v("", !0),
              a("div", pi, [
                a("div", vi, [
                  a("div", fi, [
                    a("label", {
                      id: m(d, "members")
                    }, "Allowed values", 8, bi),
                    h[0] || (h[0] = a("span", { class: "pim-f-note" }, "for example, English and French for Language", -1))
                  ]),
                  f(Ce, {
                    disabled: !c.value,
                    labelledby: m(d, "members"),
                    "model-value": d.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (U) => X(d, U)
                  }, null, 8, ["disabled", "labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                (e(!0), i(M, null, ee(d.members, (U) => (e(), i("div", {
                  key: U,
                  class: "pim-f pim-w-half"
                }, [
                  a("div", yi, [
                    a("label", {
                      id: m(d, "fallback-" + encodeURIComponent(U))
                    }, C(U) + " falls back to", 9, gi),
                    h[1] || (h[1] = a("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  f(Ce, {
                    disabled: !c.value,
                    labelledby: m(d, "fallback-" + encodeURIComponent(U)),
                    "model-value": P(d, U),
                    options: d.members.filter((T) => T !== U).map((T) => ({ value: T })),
                    "onUpdate:modelValue": (T) => B(d, U, T)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]))), 128))
              ])
            ])
          ]),
          _: 2
        }, [
          c.value ? {
            name: "actions",
            fn: w(() => [
              f(s(J), {
                type: "button",
                disabled: j(d).length > 0,
                "aria-label": "Remove " + s(z)(d.name),
                title: j(d).length ? "Take the dimension off these first" : "",
                onClick: (U) => F(d),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: w(() => [
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
      c.value ? {
        name: "add",
        fn: w(() => [
          f(Ie, {
            label: "Dimension name",
            "from-name": "",
            action: "Add dimension",
            existing: u.value.map((d) => d.name),
            onAdd: x
          }, {
            default: w(() => [...h[2] || (h[2] = [
              a("span", { class: "muted small" }, "A dimension lets a value differ per member, with fallbacks between members.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), ki = { class: "muted small" }, _i = { class: "pim-aspect" }, wi = { class: "row small" }, $i = {
  key: 1,
  class: "muted small"
}, Ci = {
  key: 2,
  class: "pim-stack tight pim-terms"
}, xi = {
  key: 0,
  class: "muted small"
}, Vi = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Ui = {
  key: 3,
  class: "pim-responsive-table"
}, Ai = {
  class: "pim-grid compact",
  "aria-label": "Vocabulary terms"
}, Si = { key: 0 }, ji = { key: 1 }, Ri = {
  key: 0,
  class: "muted"
}, Oi = {
  key: 1,
  class: "num"
}, Ii = {
  role: "list",
  class: "pim-stacked-list",
  "aria-label": "Vocabulary terms"
}, Ti = {
  key: 0,
  class: "pim-stacked-meta muted small"
}, Pi = {
  key: 4,
  class: "muted small"
}, qi = { class: "row wrap" }, Ni = {
  key: 5,
  class: "row wrap pim-add-row"
}, Di = {
  key: 0,
  class: "pim-config-overrides"
}, zi = /* @__PURE__ */ ue({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(l, { emit: k }) {
    const t = l, r = k, c = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/, u = D(() => t.schema.access.admin), b = D(() => u.value && t.schema.access.write), m = D(() => t.draft.vocabularies ?? []);
    function x(n) {
      (t.draft.vocabularies ??= []).push({ code: n });
    }
    function j(n) {
      m.value.splice(m.value.indexOf(n), 1), t.schema.declaration.vocabularies?.some((V) => V.code === n.code) && r("remove", "vocabularies", n.code);
    }
    function F(n) {
      return !!t.schema.vocabularies[n];
    }
    const X = H({}), P = H({}), B = H({}), g = H({}), h = H({}), d = H({}), U = H({}), T = H({});
    function E(n) {
      return !!(h.value[n] || d.value[n]);
    }
    async function ie(n, V) {
      h.value[n] = !0, delete U.value[n];
      try {
        const o = await pe.termsPage(t.catalogId, n, V);
        P.value[n] = o.terms, g.value[n] = V, B.value[n] = o.next;
        const _ = ae(n);
        o.terms.some((W) => W.retired && W.code === _.parent) && (_.parent = "");
      } catch (o) {
        U.value[n] = { errors: [Le(o, "Could not load terms.")], read: { after: V } };
      } finally {
        h.value[n] = !1;
      }
    }
    function Ve(n) {
      X.value[n] = !X.value[n], X.value[n] && !E(n) && !P.value[n] && !U.value[n] && ie(n);
    }
    function ae(n) {
      return T.value[n] ?? (T.value[n] = { code: "", label: "", parent: "" });
    }
    function Q(n, V) {
      const o = P.value[n]?.find((_) => _.code === V);
      return o ? Fe(o) : z(V);
    }
    function L(n) {
      return [{ value: "", label: "No parent" }, ...(P.value[n] ?? []).filter((V) => !V.retired).map((V) => ({ value: V.code, label: Fe(V) }))];
    }
    function S(n, V, o) {
      U.value[n] = { errors: V?.findings?.length ? V.findings.map((_) => ({ message: _.message ?? o, code: _.code })) : [{ message: o }] };
    }
    async function G(n) {
      const V = ae(n.code);
      if (!(!b.value || !c.test(V.code))) {
        d.value[n.code] = !0, delete U.value[n.code];
        try {
          const o = { term: { vocabulary: n.code, code: V.code }, labels: { en: V.label || z(V.code) } };
          n.hierarchical && V.parent && (o.parent = V.parent);
          const W = (await pe.apply(t.catalogId, [o])).outcomes[0];
          if (W?.outcome !== "created" && W?.outcome !== "updated") {
            S(n.code, W, "The term was not accepted.");
            return;
          }
          T.value[n.code] = { code: "", label: "", parent: "" }, pe.invalidateTerms(t.catalogId), await ie(n.code, g.value[n.code]);
        } catch (o) {
          U.value[n.code] = { errors: [Le(o, "Could not add the term.")] };
        } finally {
          d.value[n.code] = !1;
        }
      }
    }
    async function N(n, V, o) {
      if (b.value && !(o && !await He.confirm({ header: "Retire term?", message: `Retire ${Fe(V)}? Term changes save immediately. You can restore this term later.`, acceptLabel: "Retire", rejectLabel: "Cancel" }))) {
        d.value[n.code] = !0, delete U.value[n.code];
        try {
          const W = (await pe.apply(t.catalogId, [{ term: { vocabulary: n.code, code: V.code }, retired: o }])).outcomes[0];
          if (!W || !["updated", "unchanged"].includes(W.outcome)) {
            S(n.code, W, "The term change was not accepted.");
            return;
          }
          o && ae(n.code).parent === V.code && (ae(n.code).parent = ""), pe.invalidateTerms(t.catalogId), await ie(n.code, g.value[n.code]);
        } catch (_) {
          U.value[n.code] = { errors: [Le(_, "Could not change the term.")] };
        } finally {
          d.value[n.code] = !1;
        }
      }
    }
    return (n, V) => (e(), I(Te, {
      count: m.value.length,
      columns: ["details"]
    }, Oe({
      default: w(() => [
        (e(!0), i(M, null, ee(m.value, (o) => (e(), I(Pe, {
          title: s(z)(o.code),
          key: o.code
        }, {
          details: w(() => [
            a("span", ki, C(o.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: w(() => [
            u.value ? (e(), I(s(J), {
              key: 0,
              type: "button",
              "aria-label": "Remove " + s(z)(o.code),
              onClick: (_) => j(o),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: w(() => [
                f(s(le), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])) : v("", !0)
          ]),
          default: w(() => [
            a("div", _i, [
              a("label", wi, [
                f(s(sa), {
                  disabled: !u.value,
                  "aria-label": "Hierarchical " + s(z)(o.code),
                  "model-value": o.hierarchical === !0,
                  "onUpdate:modelValue": (_) => _ ? o.hierarchical = !0 : delete o.hierarchical
                }, null, 8, ["disabled", "aria-label", "model-value", "onUpdate:modelValue"]),
                V[0] || (V[0] = a("span", null, "Hierarchical", -1))
              ]),
              F(o.code) ? (e(), I(s(J), {
                key: 0,
                type: "button",
                onClick: (_) => Ve(o.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: w(() => [
                  f(s(le), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  K(" " + C(X.value[o.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : u.value ? (e(), i("span", $i, "Apply the schema before adding terms.")) : v("", !0),
              X.value[o.code] ? (e(), i("div", Ci, [
                b.value ? (e(), i("p", xi, "Term changes save immediately.")) : v("", !0),
                h.value[o.code] ? (e(), i("div", Vi, "Loading terms…")) : U.value[o.code] ? (e(!0), i(M, { key: 2 }, ee(U.value[o.code].errors, (_, W) => (e(), I(ca, {
                  key: W,
                  error: _
                }, {
                  default: w(() => [
                    U.value[o.code].read ? (e(), I(s(J), {
                      key: 0,
                      type: "button",
                      onClick: (Z) => ie(o.code, U.value[o.code].read?.after),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: w(() => [...V[1] || (V[1] = [
                        K("Retry", -1)
                      ])]),
                      _: 1
                    }, 8, ["onClick"])) : v("", !0)
                  ]),
                  _: 2
                }, 1032, ["error"]))), 128)) : v("", !0),
                (P.value[o.code] ?? []).length ? (e(), i("div", Ui, [
                  a("table", Ai, [
                    a("thead", null, [
                      a("tr", null, [
                        V[2] || (V[2] = a("th", null, "Term", -1)),
                        o.hierarchical ? (e(), i("th", Si, "Parent")) : v("", !0),
                        u.value ? (e(), i("th", ji)) : v("", !0)
                      ])
                    ]),
                    a("tbody", null, [
                      (e(!0), i(M, null, ee(P.value[o.code], (_) => (e(), i("tr", {
                        key: _.code,
                        class: xe({ muted: _.retired })
                      }, [
                        a("td", null, [
                          K(C(s(Fe)(_)) + " ", 1),
                          _.retired ? (e(), I(s(ye), {
                            key: 0,
                            severity: "secondary",
                            value: "Retired"
                          })) : v("", !0)
                        ]),
                        o.hierarchical ? (e(), i("td", Ri, C(_.parent ? Q(o.code, _.parent) : "—"), 1)) : v("", !0),
                        u.value ? (e(), i("td", Oi, [
                          f(s(J), {
                            type: "button",
                            disabled: !b.value || E(o.code),
                            onClick: (W) => N(o, _, !_.retired),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: w(() => [
                              K(C(_.retired ? "Restore" : "Retire"), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled", "onClick"])
                        ])) : v("", !0)
                      ], 2))), 128))
                    ])
                  ]),
                  a("ul", Ii, [
                    (e(!0), i(M, null, ee(P.value[o.code], (_) => (e(), i("li", {
                      key: _.code,
                      class: xe(["pim-stacked-row", { muted: _.retired }])
                    }, [
                      a("div", null, [
                        K(C(s(Fe)(_)) + " ", 1),
                        _.retired ? (e(), I(s(ye), {
                          key: 0,
                          severity: "secondary",
                          value: "Retired"
                        })) : v("", !0)
                      ]),
                      o.hierarchical && _.parent ? (e(), i("div", Ti, "Parent: " + C(Q(o.code, _.parent)), 1)) : v("", !0),
                      u.value ? (e(), I(s(J), {
                        key: 1,
                        type: "button",
                        disabled: !b.value || E(o.code),
                        onClick: (W) => N(o, _, !_.retired),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: w(() => [
                          K(C(_.retired ? "Restore" : "Retire"), 1)
                        ]),
                        _: 2
                      }, 1032, ["disabled", "onClick"])) : v("", !0)
                    ], 2))), 128))
                  ])
                ])) : P.value[o.code] && !E(o.code) && !U.value[o.code] ? (e(), i("p", Pi, "No terms yet.")) : v("", !0),
                a("div", qi, [
                  f(s(J), {
                    type: "button",
                    disabled: E(o.code) || !g.value[o.code],
                    onClick: (_) => ie(o.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      f(s(le), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      V[3] || (V[3] = K(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  f(s(J), {
                    type: "button",
                    disabled: E(o.code) || !B.value[o.code],
                    onClick: (_) => ie(o.code, B.value[o.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      f(s(le), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      V[4] || (V[4] = K(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                u.value ? (e(), i("div", Ni, [
                  f(s(Ge), {
                    modelValue: ae(o.code).label,
                    "onUpdate:modelValue": (_) => ae(o.code).label = _,
                    disabled: !b.value || E(o.code),
                    "aria-label": "Term name in English",
                    type: "text",
                    placeholder: "Term name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  f(s(Ge), {
                    modelValue: ae(o.code).code,
                    "onUpdate:modelValue": (_) => ae(o.code).code = _,
                    disabled: !b.value || E(o.code),
                    type: "text",
                    "aria-label": "Short term name",
                    placeholder: "Short name for imports",
                    class: "narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  o.hierarchical ? (e(), I(s(he), {
                    key: 0,
                    modelValue: ae(o.code).parent,
                    "onUpdate:modelValue": (_) => ae(o.code).parent = _,
                    disabled: !b.value || E(o.code),
                    class: "narrow",
                    "aria-label": "Parent term",
                    placeholder: "No parent",
                    options: L(o.code),
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "options"])) : v("", !0),
                  f(s(J), {
                    type: "button",
                    disabled: !b.value || E(o.code) || !c.test(ae(o.code).code),
                    onClick: (_) => G(o),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      f(s(le), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      V[5] || (V[5] = K(" Add term", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])) : v("", !0),
                f(Ae, {
                  class: "pim-ia-disclosure",
                  label: "Integration keys"
                }, {
                  default: w(() => [
                    (P.value[o.code] ?? []).length ? (e(), i("dl", Di, [
                      (e(!0), i(M, null, ee(P.value[o.code], (_) => (e(), i(M, {
                        key: _.code
                      }, [
                        a("dt", null, C(s(Fe)(_)), 1),
                        a("dd", null, [
                          a("code", null, C(_.code), 1)
                        ])
                      ], 64))), 128))
                    ])) : v("", !0)
                  ]),
                  _: 2
                }, 1024)
              ])) : v("", !0)
            ])
          ]),
          _: 2
        }, 1032, ["title"]))), 128))
      ]),
      _: 2
    }, [
      u.value ? {
        name: "add",
        fn: w(() => [
          f(Ie, {
            label: "Vocabulary name",
            "from-name": "",
            action: "Add vocabulary",
            existing: m.value.map((o) => o.code),
            onAdd: x
          }, {
            default: w(() => [...V[6] || (V[6] = [
              a("span", { class: "muted small" }, "Select fields pick their values from a vocabulary's terms.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), Fi = { class: "pim-stack" }, Bi = { class: "form pim-card-body pad pim-ia-action" }, Li = { class: "muted small" }, Ei = { class: "muted small" }, Mi = { class: "pim-aspect" }, Wi = { class: "pim-ia-action pim-family-fields" }, Hi = { class: "pim-f" }, Ji = { class: "pim-f-label" }, Ki = ["id"], Gi = ["id"], Yi = { class: "pim-aspect" }, Zi = { class: "pim-stack tight" }, Qi = { class: "pim-level-head" }, Xi = { class: "pim-fields" }, en = { class: "pim-f pim-w-half" }, an = { class: "pim-f-label" }, ln = ["id"], tn = { class: "pim-f pim-w-half" }, sn = { class: "pim-f-label" }, nn = ["id"], on = { class: "pim-aspect" }, dn = { class: "pim-stack tight" }, rn = { class: "pim-level-head" }, un = { class: "muted small" }, cn = { class: "pim-fields" }, mn = { class: "pim-f-label" }, pn = ["id"], vn = { class: "pim-f pim-w-half" }, fn = { class: "pim-f-label" }, bn = ["id"], yn = { class: "pim-f pim-w-half" }, gn = { class: "pim-f-label" }, hn = ["id"], kn = {
  key: 0,
  class: "pim-aspect pim-family-remove"
}, _n = /* @__PURE__ */ ue({
  __name: "BuilderFamilies",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove", "fields"],
  setup(l, { emit: k }) {
    const t = l, r = k, c = qe();
    function u(n, V) {
      return c + "-" + n.code + "-" + V;
    }
    const b = D(() => t.schema.access.admin), m = D(() => (t.draft.families ?? []).filter((n) => n.code !== "generic")), x = D(() => {
      const n = new Set(t.draft.plugins?.map((V) => V.use));
      return Object.entries(t.schema.attributes).filter(([, V]) => V.plugin && n.has(V.plugin));
    }), j = D(() => {
      const n = (t.draft.aspects ?? []).map((o) => o.namespace), V = [...new Set(x.value.map(([o]) => o.split(".")[0]))];
      return [...n, ...V.filter((o) => !n.includes(o))].map((o) => ({ value: o, label: z(o) }));
    });
    function F(n) {
      const V = j.value, o = (n.aspects ?? []).filter((_) => !V.some((W) => W.value === _));
      return [...V, ...o.map((_) => ({ value: _, label: z(_) }))];
    }
    const X = D(() => new Map(t.options.types.map((n) => [n.id, n.form])));
    function P(n) {
      const [V, o] = n.split(".", 2);
      return o ? `${z(o)} (${z(V)})` : z(V);
    }
    const B = D(() => {
      const n = /* @__PURE__ */ new Map();
      function V(o, _, W = [], Z = "one") {
        const te = !!_ && _ !== "text" && _ !== "record" && W.length === 0 && Z === "one";
        n.set(o, { value: o, label: P(o), canBeAxis: te });
      }
      for (const o of t.draft.aspects ?? [])
        for (const _ of o.attributes ?? []) {
          const W = o.namespace + "." + _.code;
          V(W, X.value.get(_.type), _.scope, _.cardinality);
        }
      for (const [o, _] of x.value) V(o, _.form, _.scope, _.cardinality);
      return n;
    });
    function g(n) {
      return [...B.value.values()].filter((V) => n.aspects?.includes(V.value.split(".")[0]));
    }
    function h(n, V, o) {
      const _ = V[o] ?? [], W = new Set(ae(n).flatMap((te) => [...te.axes ?? [], ...te.own ?? []])), Z = g(n).filter((te) => _.includes(te.value) || !W.has(te.value) && (o === "own" || te.canBeAxis));
      return [...Z, ..._.filter((te) => !Z.some((ne) => ne.value === te)).map((te) => ({ value: te, label: P(te) }))];
    }
    const d = D(() => t.draft.channels ?? []);
    function U(n, V) {
      return d.value.filter((o) => (!o.families?.length || o.families.includes(n.code)) && (!V || o.requirements?.includes(V))).map((o) => z(o.id));
    }
    const T = D(() => t.draft.dimensions ?? []), E = H({});
    function ie(n) {
      (t.draft.families ??= []).push({ code: n, aspects: [] }), E.value[n] = !0;
    }
    function Ve(n) {
      t.draft.families.splice(t.draft.families.indexOf(n), 1), t.schema.declaration.families?.some((V) => V.code === n.code) && r("remove", "families", n.code);
    }
    function ae(n) {
      return n.variation ?? [];
    }
    function Q(n) {
      (n.variation ??= []).push({ axes: [] });
    }
    function L(n) {
      return n.requirements ?? [];
    }
    function S(n, V) {
      (n.requirements ??= []).push({ id: V, require: [] });
    }
    function G(n, V) {
      return n.context?.[V] ?? "";
    }
    function N(n, V, o) {
      const _ = { ...n.context ?? {} };
      o ? _[V] = o : delete _[V], Object.keys(_).length ? n.context = _ : delete n.context;
    }
    return (n, V) => (e(), i("div", Fi, [
      a("div", Bi, [
        V[0] || (V[0] = a("div", null, [
          a("h3", null, "Product families"),
          a("p", null, "Choose what to collect, what varies between versions, and what products need before release.")
        ], -1)),
        b.value ? (e(), I(Ie, {
          key: 0,
          label: "Family name",
          action: "Add family",
          "from-name": "",
          existing: m.value.map((o) => o.code),
          onAdd: ie
        }, null, 8, ["existing"])) : v("", !0)
      ]),
      f(Te, {
        count: m.value.length,
        columns: ["details"]
      }, {
        default: w(() => [
          (e(!0), i(M, null, ee(m.value, (o) => (e(), I(Pe, {
            key: o.code,
            open: E.value[o.code],
            "onUpdate:open": (_) => E.value[o.code] = _,
            title: s(z)(o.code)
          }, {
            details: w(() => [
              a("span", Li, C(g(o).length) + " fields", 1),
              ae(o).length ? (e(), I(s(ye), {
                key: 0,
                severity: "secondary",
                value: ae(o).length + (ae(o).length === 1 ? " variant level" : " variant levels")
              }, null, 8, ["value"])) : v("", !0),
              a("span", Ei, C(U(o).join(", ") || "No release channels"), 1)
            ]),
            default: w(() => [
              a("div", Mi, [
                a("div", Wi, [
                  a("div", Hi, [
                    a("div", Ji, [
                      a("label", {
                        id: u(o, "groups")
                      }, "Field groups", 8, Ki)
                    ]),
                    a("p", {
                      id: u(o, "groups-help"),
                      class: "muted small pim-axis-help"
                    }, "Choose the groups that appear on this family’s product forms.", 8, Gi),
                    f(s(La), {
                      disabled: !b.value,
                      "aria-labelledby": u(o, "groups"),
                      "aria-describedby": u(o, "groups-help"),
                      "model-value": o.aspects ?? [],
                      options: F(o),
                      "option-label": "label",
                      "option-value": "value",
                      placeholder: "Choose field groups",
                      display: "chip",
                      "append-to": "self",
                      "onUpdate:modelValue": (_) => s(Be)(o, "aspects", _)
                    }, null, 8, ["disabled", "aria-labelledby", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])
                  ]),
                  o.aspects?.length ? (e(), I(s(J), {
                    key: 0,
                    type: "button",
                    label: "View family fields",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (_) => r("fields", o.code)
                  }, null, 8, ["onClick"])) : v("", !0)
                ])
              ]),
              a("div", Yi, [
                V[4] || (V[4] = a("header", { class: "pim-aspect-head" }, [
                  a("h3", null, "Variants")
                ], -1)),
                V[5] || (V[5] = a("p", { class: "muted small pim-axis-help" }, "Choose what makes one variant different from another. Each field can be used once.", -1)),
                a("div", Zi, [
                  (e(!0), i(M, null, ee(ae(o), (_, W) => (e(), i("div", {
                    key: W,
                    class: "pim-level"
                  }, [
                    a("div", Qi, [
                      a("strong", null, "Level " + C(W + 1), 1),
                      b.value ? (e(), I(s(J), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove level",
                        onClick: (Z) => ae(o).splice(W, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: w(() => [
                          f(s(le), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : v("", !0)
                    ]),
                    a("div", Xi, [
                      a("div", en, [
                        a("div", an, [
                          a("label", {
                            id: u(o, W + "-axes")
                          }, "Distinguish variants by", 8, ln)
                        ]),
                        V[1] || (V[1] = a("p", { class: "muted small pim-axis-help" }, "Choose a single-value field with no dimensions. Text and record fields are excluded.", -1)),
                        f(Ce, {
                          disabled: !b.value,
                          dropdown: "",
                          labelledby: u(o, W + "-axes"),
                          "model-value": _.axes ?? [],
                          options: h(o, _, "axes"),
                          placeholder: "Add an axis",
                          "onUpdate:modelValue": (Z) => _.axes = Z
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]),
                      a("div", tn, [
                        a("div", sn, [
                          a("label", {
                            id: u(o, W + "-owned")
                          }, "Other fields edited here", 8, nn)
                        ]),
                        V[2] || (V[2] = a("p", { class: "muted small pim-axis-help" }, "Other fields you edit at this level.", -1)),
                        f(Ce, {
                          disabled: !b.value,
                          dropdown: "",
                          labelledby: u(o, W + "-owned"),
                          "model-value": _.own ?? [],
                          options: h(o, _, "own"),
                          placeholder: "Add a field",
                          "onUpdate:modelValue": (Z) => Z.length ? _.own = Z : delete _.own
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  b.value ? (e(), I(s(J), {
                    key: 0,
                    type: "button",
                    class: "pim-add-level",
                    onClick: (_) => Q(o),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      f(s(le), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      V[3] || (V[3] = K(" Add level", -1))
                    ]),
                    _: 1
                  }, 8, ["onClick"])) : v("", !0)
                ])
              ]),
              a("div", on, [
                V[8] || (V[8] = a("header", { class: "pim-family-requirements-head" }, [
                  a("h3", null, "Release requirements"),
                  a("p", { class: "muted small" }, "Choose what products need before they can be released to a channel.")
                ], -1)),
                a("div", dn, [
                  (e(!0), i(M, null, ee(L(o), (_, W) => (e(), i("div", {
                    key: _.id,
                    class: "pim-level"
                  }, [
                    a("div", rn, [
                      a("div", null, [
                        a("strong", null, C(s(z)(_.id)), 1),
                        a("p", un, C(U(o, _.id).join(", ") || "Unused by channels"), 1)
                      ]),
                      b.value ? (e(), I(s(J), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove requirement",
                        onClick: (Z) => L(o).splice(W, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: w(() => [
                          f(s(le), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : v("", !0)
                    ]),
                    a("div", cn, [
                      (e(!0), i(M, null, ee(T.value, (Z) => (e(), i("div", {
                        key: Z.name,
                        class: "pim-f pim-w-third"
                      }, [
                        a("div", mn, [
                          a("label", {
                            id: u(o, _.id + "-context-" + Z.name)
                          }, C(s(z)(Z.name)), 9, pn)
                        ]),
                        f(s(he), {
                          disabled: !b.value,
                          "aria-labelledby": u(o, _.id + "-context-" + Z.name),
                          "model-value": G(_, Z.name),
                          "onUpdate:modelValue": (te) => N(_, Z.name, te),
                          options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ...Z.members.map((te) => ({ value: te, label: String(te) }))],
                          "option-label": "label",
                          "option-value": "value",
                          appendTo: "self"
                        }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                      ]))), 128)),
                      a("div", vn, [
                        a("div", fn, [
                          a("label", {
                            id: u(o, _.id + "-required")
                          }, "Required", 8, bn)
                        ]),
                        V[6] || (V[6] = a("p", { class: "muted small pim-axis-help" }, "These fields must have a value.", -1)),
                        f(Ce, {
                          disabled: !b.value,
                          dropdown: "",
                          labelledby: u(o, _.id + "-required"),
                          "model-value": _.require ?? [],
                          placeholder: "Add a required field",
                          options: g(o),
                          "onUpdate:modelValue": (Z) => s(Be)(_, "require", Z)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]),
                      a("div", yn, [
                        a("div", gn, [
                          a("label", {
                            id: u(o, _.id + "-authored")
                          }, "Entered for this context", 8, hn)
                        ]),
                        V[7] || (V[7] = a("p", { class: "muted small pim-axis-help" }, "These fields need a value set directly for the selected context.", -1)),
                        f(Ce, {
                          disabled: !b.value,
                          dropdown: "",
                          labelledby: u(o, _.id + "-authored"),
                          "model-value": _.authored ?? [],
                          placeholder: "Add a field to author",
                          options: g(o),
                          "onUpdate:modelValue": (Z) => s(Be)(_, "authored", Z)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  b.value ? (e(), I(Ie, {
                    key: 0,
                    label: "Requirement name",
                    action: "Add requirement",
                    "from-name": "",
                    existing: L(o).map((_) => _.id),
                    onAdd: (_) => S(o, _)
                  }, null, 8, ["existing", "onAdd"])) : v("", !0)
                ])
              ]),
              b.value ? (e(), i("div", kn, [
                f(s(J), {
                  type: "button",
                  label: "Remove family",
                  severity: "danger",
                  text: "",
                  size: "small",
                  onClick: (_) => Ve(o)
                }, null, 8, ["onClick"])
              ])) : v("", !0)
            ]),
            _: 2
          }, 1032, ["open", "onUpdate:open", "title"]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), wn = ["inert"], $n = {
  key: 0,
  class: "row wrap"
}, Cn = {
  key: 2,
  class: "small muted"
}, xn = { class: "pim-principal-service" }, Vn = /* @__PURE__ */ ue({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(l, { emit: k }) {
    const t = l, r = k, c = H(!1), u = H(""), b = H({});
    let m = 0;
    ve(() => t.modelValue, async (P) => {
      const B = ++m;
      try {
        const g = await Ma(t.catalogId ?? "", P);
        B === m && (b.value = g);
      } catch {
        B === m && (b.value = {});
      }
    }, { immediate: !0, deep: !0 }), Ye(() => {
      m++;
    });
    function x(P) {
      return b.value[P] ?? re(P, "Person");
    }
    Fa(async () => {
      try {
        await Al("wc-principal-picker"), c.value = !0;
      } catch {
        c.value = !1;
      }
    });
    function j(P) {
      t.disabled || !P.trim() || t.modelValue.includes(P.trim()) || (r("update:modelValue", [...t.modelValue, P.trim()]), u.value = "");
    }
    function F(P) {
      const B = P.detail;
      if (!B || typeof B != "object") return;
      const g = B, h = g.principal_id ?? g.id;
      typeof h == "string" && j(h);
    }
    function X(P) {
      t.disabled || r("update:modelValue", t.modelValue.filter((B) => B !== P));
    }
    return (P, B) => (e(), i("div", {
      class: "pim-principal-list",
      inert: l.disabled || void 0
    }, [
      l.modelValue.length ? (e(), i("div", $n, [
        (e(!0), i(M, null, ee(l.modelValue, (g) => (e(), I(s(ye), {
          key: g,
          severity: "secondary"
        }, {
          default: w(() => [
            a("span", null, C(x(g)), 1),
            f(s(J), {
              text: "",
              size: "small",
              disabled: l.disabled,
              "aria-label": "Remove " + x(g),
              onClick: (h) => X(g)
            }, {
              default: w(() => [
                f(s(le), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : v("", !0),
      c.value ? (e(), i("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: Re(F, ["stop"])
      }, null, 32)) : (e(), i("span", Cn, "The person picker is unavailable.")),
      a("label", xn, [
        B[3] || (B[3] = a("span", { class: "small muted" }, "Service account", -1)),
        f(s(Ge), {
          modelValue: u.value,
          "onUpdate:modelValue": B[0] || (B[0] = (g) => u.value = g),
          disabled: l.disabled,
          placeholder: "Service principal id",
          onKeydown: B[1] || (B[1] = ta(Re((g) => j(u.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "disabled"])
      ]),
      f(s(J), {
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: l.disabled || !u.value.trim(),
        onClick: B[2] || (B[2] = (g) => j(u.value))
      }, {
        default: w(() => [
          f(s(le), { icon: "tabler:plus" }),
          B[4] || (B[4] = K(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, wn));
  }
}), Un = { class: "pim-stack" }, An = { class: "pim-bsection-head pim-list-header" }, Sn = { class: "muted small" }, jn = { class: "muted small" }, Rn = { class: "pim-fields" }, On = { class: "pim-f pim-w-half" }, In = { class: "pim-f-label" }, Tn = ["id"], Pn = { class: "pim-f pim-w-half" }, qn = { class: "pim-f-label" }, Nn = ["id"], Dn = { class: "pim-bsection-head pim-list-header" }, zn = { class: "muted small" }, Fn = { class: "pim-fields" }, Bn = { class: "pim-f pim-w-third" }, Ln = { class: "pim-f-label" }, En = ["id"], Mn = { class: "pim-f pim-w-third" }, Wn = { class: "pim-f-label" }, Hn = ["for"], Jn = { class: "row" }, Kn = ["aria-labelledby"], Gn = { class: "pim-f-label" }, Yn = ["id"], Zn = { key: 1 }, Qn = { class: "pim-f pim-w-full" }, Xn = { class: "pim-f-label" }, eo = ["id"], ao = /* @__PURE__ */ ue({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {},
    view: {}
  },
  emits: ["remove"],
  setup(l, { emit: k }) {
    const t = l, r = k, c = qe();
    function u(d, U) {
      return c + "-" + d + "-" + U;
    }
    const b = D(() => t.schema.access.admin), m = D(() => t.draft.channels ?? []), x = D(() => t.draft.sources ?? []), j = D(() => [...new Set((t.draft.families ?? []).flatMap((d) => (d.requirements ?? []).map((U) => U.id)))].map((d) => ({ value: d, label: z(d) }))), F = D(() => (t.draft.families ?? []).filter((d) => d.code !== "generic").map((d) => ({ value: d.code, label: z(d.code) }))), X = D(() => (t.draft.aspects ?? []).map((d) => ({ value: d.namespace, label: z(d.namespace) })));
    function P(d) {
      (t.draft.channels ??= []).push({ id: d, requirements: [] });
    }
    function B(d) {
      m.value.splice(m.value.indexOf(d), 1), t.schema.declaration.channels?.some((U) => U.id === d.id) && r("remove", "channels", d.id);
    }
    function g(d) {
      (t.draft.sources ??= []).push({ id: d, ordering: "none", writes: [] });
    }
    function h(d) {
      x.value.splice(x.value.indexOf(d), 1), t.schema.declaration.sources?.some((U) => U.id === d.id) && r("remove", "sources", d.id);
    }
    return (d, U) => (e(), i("div", Un, [
      l.view !== "sources" ? (e(), I(Te, {
        key: 0,
        count: m.value.length,
        columns: ["details"]
      }, {
        head: w(() => [
          a("header", An, [
            U[0] || (U[0] = a("div", null, [
              a("h3", null, "Release destinations"),
              a("p", { class: "muted small" }, "Choose which families can be released to each destination and what those products need first.")
            ], -1)),
            b.value ? (e(), I(Ie, {
              key: 0,
              label: "Channel name",
              action: "Add channel",
              "from-name": "",
              existing: m.value.map((T) => T.id),
              onAdd: P
            }, null, 8, ["existing"])) : v("", !0)
          ])
        ]),
        default: w(() => [
          (e(!0), i(M, null, ee(m.value, (T) => (e(), I(Pe, {
            key: T.id,
            title: s(z)(T.id)
          }, Oe({
            details: w(() => [
              a("span", Sn, C(T.families?.length ? T.families.map(s(z)).join(", ") : "All families"), 1),
              a("span", jn, C(T.requirements?.length ? T.requirements.map(s(z)).join(", ") : "No release requirements"), 1)
            ]),
            default: w(() => [
              a("div", Rn, [
                a("div", On, [
                  a("div", In, [
                    a("label", {
                      id: u(T.id, "requirements")
                    }, "Release requirements", 8, Tn),
                    U[1] || (U[1] = a("span", { class: "pim-f-note" }, "a product is ready for the channel when these hold", -1))
                  ]),
                  f(Ce, {
                    disabled: !b.value,
                    labelledby: u(T.id, "requirements"),
                    "model-value": T.requirements ?? [],
                    options: j.value,
                    "onUpdate:modelValue": (E) => s(Be)(T, "requirements", E)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                a("div", Pn, [
                  a("div", qn, [
                    a("label", {
                      id: u(T.id, "families")
                    }, "Families", 8, Nn),
                    U[2] || (U[2] = a("span", { class: "pim-f-note" }, "empty means every family", -1))
                  ]),
                  f(Ce, {
                    disabled: !b.value,
                    labelledby: u(T.id, "families"),
                    "model-value": T.families ?? [],
                    options: F.value,
                    "onUpdate:modelValue": (E) => s(Be)(T, "families", E)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            b.value ? {
              name: "actions",
              fn: w(() => [
                f(s(J), {
                  type: "button",
                  onClick: (E) => B(T),
                  "aria-label": "Remove " + s(z)(T.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    f(s(le), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["onClick", "aria-label"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["title"]))), 128))
        ]),
        _: 1
      }, 8, ["count"])) : v("", !0),
      l.view !== "channels" ? (e(), I(Te, {
        key: 1,
        count: x.value.length,
        columns: ["details"]
      }, {
        head: w(() => [
          a("header", Dn, [
            U[3] || (U[3] = a("div", null, [
              a("h3", null, "Data sources"),
              a("p", { class: "muted small" }, "Control who can send updates and which fields each source can change.")
            ], -1)),
            b.value ? (e(), I(Ie, {
              key: 0,
              label: "Source name",
              action: "Add source",
              "from-name": "",
              existing: x.value.map((T) => T.id),
              onAdd: g
            }, null, 8, ["existing"])) : v("", !0)
          ])
        ]),
        default: w(() => [
          (e(!0), i(M, null, ee(x.value, (T) => (e(), I(Pe, {
            key: T.id,
            title: s(z)(T.id)
          }, Oe({
            details: w(() => [
              a("span", zn, C(T.writes?.length ? T.writes.map(s(z)).join(", ") : "No field groups selected"), 1)
            ]),
            default: w(() => [
              a("div", Fn, [
                a("div", Bn, [
                  a("div", Ln, [
                    a("label", {
                      id: u(T.id, "ordering")
                    }, "Handle incoming updates", 8, En),
                    U[4] || (U[4] = a("span", { class: "pim-f-note" }, "sequence keeps late deliveries from winning", -1))
                  ]),
                  f(s(he), {
                    disabled: !b.value,
                    "aria-labelledby": u(T.id, "ordering"),
                    "model-value": T.ordering ?? "none",
                    "onUpdate:modelValue": (E) => T.ordering = E,
                    options: [{ value: "none", label: "Use arrival order" }, { value: "sequence", label: "Use the source’s sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                a("div", Mn, [
                  a("div", Wn, [
                    a("label", {
                      for: u(T.id, "audit")
                    }, "Audit", 8, Hn),
                    U[5] || (U[5] = a("span", { class: "pim-f-note" }, "record each value change", -1))
                  ]),
                  a("div", Jn, [
                    f(s(sa), {
                      disabled: !b.value,
                      "input-id": u(T.id, "audit"),
                      "model-value": T.audit !== !1,
                      "onUpdate:modelValue": (E) => E ? delete T.audit : T.audit = !1
                    }, null, 8, ["disabled", "input-id", "model-value", "onUpdate:modelValue"]),
                    a("span", null, C(T.audit === !1 ? "Off for this source" : "Follow catalog audit settings"), 1)
                  ])
                ]),
                a("div", {
                  class: "pim-f pim-w-third",
                  role: "group",
                  "aria-labelledby": u(T.id, "people")
                }, [
                  a("div", Gn, [
                    a("label", {
                      id: u(T.id, "people")
                    }, "People and service accounts", 8, Yn),
                    U[6] || (U[6] = a("span", { class: "pim-f-note" }, "who may write as this source", -1))
                  ]),
                  b.value ? (e(), I(Vn, {
                    key: 0,
                    "catalog-id": l.catalogId,
                    "model-value": T.principals ?? [],
                    "onUpdate:modelValue": (E) => s(Be)(T, "principals", E)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])) : (e(), i("span", Zn, C(T.principals?.length ? T.principals.length + (T.principals.length === 1 ? " allowed account" : " allowed accounts") : "No accounts specified"), 1))
                ], 8, Kn),
                a("div", Qn, [
                  a("div", Xn, [
                    a("label", {
                      id: u(T.id, "writes")
                    }, "Field groups it can update", 8, eo),
                    U[7] || (U[7] = a("span", { class: "pim-f-note" }, "field groups this source may set", -1))
                  ]),
                  f(Ce, {
                    disabled: !b.value,
                    labelledby: u(T.id, "writes"),
                    "model-value": T.writes ?? [],
                    options: X.value,
                    "onUpdate:modelValue": (E) => s(Be)(T, "writes", E)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            b.value ? {
              name: "actions",
              fn: w(() => [
                f(s(J), {
                  type: "button",
                  onClick: (E) => h(T),
                  "aria-label": "Remove " + s(z)(T.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    f(s(le), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["onClick", "aria-label"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["title"]))), 128))
        ]),
        _: 1
      }, 8, ["count"])) : v("", !0)
    ]));
  }
}), lo = {
  failed: { label: "Setup failed", severity: "danger" },
  paused: { label: "Background update paused", severity: "warn" },
  degraded: { label: "Degraded", severity: "warn" },
  catchingUp: { label: "Catching up", severity: "info" },
  config: { label: "Configuration needed", severity: "warn" },
  reset: { label: "Reset required", severity: "warn" },
  uninstalled: { label: "Uninstalled · still referenced", severity: "warn" },
  pending: { label: "Setting up", severity: "info" }
};
function Ha(l, k) {
  return !l.parked && (l.bootstrapping || l.last_seq < k);
}
function to(l, k) {
  return !l.active || !l.installed || l.problem || l.lifecycle.state === "failed" ? !1 : l.lifecycle.state === "pending" || Object.values(l.projections).some((t) => Ha(t, k));
}
function Ja(l, k) {
  const t = l.problem ?? l.lifecycle.error, r = Object.entries(l.projections), c = r.find(([, b]) => b.parked) ?? r.find(([, b]) => b.error) ?? r.find(([, b]) => Ha(b, k));
  let u;
  return l.active && !l.installed ? u = "uninstalled" : t?.code === "plugin_config_invalid" ? u = "config" : t?.code === "plugin_projection_history_pruned" ? u = "reset" : t || l.lifecycle.state === "failed" ? u = "failed" : l.active && c?.[1].parked ? u = "paused" : l.active && c?.[1].error ? u = "degraded" : l.active && c ? u = "catchingUp" : l.active && l.lifecycle.state === "pending" && (u = "pending"), u ? { kind: u, ...lo[u], error: t, projection: c } : void 0;
}
function so(l) {
  return (l.problem ?? l.lifecycle.error)?.code === "plugin_interface_version_unsupported";
}
const io = { class: "pim-stack" }, no = { class: "pim-bsection-head" }, oo = { class: "muted small" }, ro = {
  key: 0,
  class: "pim-aspect muted"
}, uo = {
  key: 0,
  class: "muted small"
}, co = { class: "pim-stack pim-plugin-recovery" }, mo = {
  key: 0,
  class: "muted small"
}, po = {
  key: 1,
  class: "muted small"
}, vo = { key: 0 }, fo = { key: 1 }, bo = { key: 0 }, yo = { key: 0 }, go = { key: 0 }, ho = { key: 1 }, ko = { key: 2 }, _o = { key: 3 }, wo = { key: 0 }, $o = {
  key: 0,
  class: "pim-ia-action"
}, Co = {
  key: 0,
  class: "pim-ia-dialog"
}, xo = { class: "pim-ia-dialog-head" }, Vo = { key: 1 }, Uo = { key: 2 }, Ao = { class: "row pim-ia-dialog-actions" }, So = {
  key: 0,
  class: "pim-aspect muted"
}, jo = { class: "row wrap muted small" }, Ro = /* @__PURE__ */ ue({
  __name: "BuilderPlugins",
  props: {
    draft: {},
    schema: {},
    options: {},
    pluginConfigs: { default: () => ({}) },
    stale: { type: Boolean }
  },
  emits: ["remove", "configure", "reset", "resume", "refresh", "review", "clearShellBinding"],
  setup(l, { emit: k }) {
    const t = l, r = k, c = /* @__PURE__ */ new Map([
      ["eq", "Equals"],
      ["in", "Is one of"],
      ["gt", "Greater than"],
      ["gte", "At least"],
      ["lt", "Less than"],
      ["lte", "At most"]
    ]), u = H({}), b = H(), m = D(() => g.value.find((L) => L.plugin.plugin === b.value)), x = D(() => m.value?.plugin), j = D(() => t.options.plugins.filter((L) => L.installed).length), F = D(() => t.schema.access.admin), X = D(() => t.draft.plugins ?? []), P = D(() => new Map(t.schema.plugins.map((L) => [L.plugin, L]))), B = D(() => {
      const L = /* @__PURE__ */ new Map();
      for (const [S, G] of Object.entries(t.schema.attributes)) {
        if (!G.plugin) continue;
        const N = L.get(G.plugin) ?? [];
        N.push(z(S)), L.set(G.plugin, N);
      }
      return L;
    }), g = D(() => t.options.plugins.map((L) => {
      const S = P.value.get(L.plugin) ?? L, G = Ja(S, t.schema.as_of), N = X.value.some((n) => n.use === S.plugin);
      return {
        option: L,
        plugin: S,
        status: G,
        chosen: N,
        title: re(S.title ?? L.title, S.installed ? "Plugin" : "Unavailable plugin"),
        label: !S.active && G?.kind === "failed" ? "Unavailable" : G?.label ?? (N ? S.active ? "Enabled" : "Will enable on apply" : S.active ? "Will disable on apply" : "Disabled"),
        severity: G?.severity ?? (N ? "success" : "secondary")
      };
    }));
    function h(L, S) {
      const G = S.map((N) => c.get(N)).filter(Boolean);
      return [z(L), G.join(", ")].filter(Boolean).join(" · ");
    }
    function d(L, S) {
      S && !X.value.some((G) => G.use === L) && (t.draft.plugins ??= []).push({ use: L }), S || (t.draft.plugins = X.value.filter((G) => G.use !== L), delete t.pluginConfigs[L], P.value.get(L)?.active && r("remove", "plugins", L));
    }
    function U(L, S) {
      u.value[L] = !0, t.pluginConfigs[L] = S;
    }
    function T(L, S) {
      const G = L.config_schema.properties;
      return re(G?.[S]?.title ?? z(S), "this setting");
    }
    const E = D(() => t.draft.scopes ?? []);
    function ie(L) {
      return E.value.includes(L.id);
    }
    function Ve(L, S) {
      S && !ie(L) && (t.draft.scopes ??= []).push(L.id), !S && ie(L) && (E.value.splice(E.value.indexOf(L.id), 1), t.schema.declaration.scopes?.includes(L.id) && r("remove", "scopes", L.id));
    }
    const ae = D(() => {
      const L = x.value;
      if (!L) return [];
      const S = L.references;
      return [
        { label: "Fields", items: (S?.fields ?? Object.entries(t.schema.attributes).filter(([, N]) => N.plugin === L.plugin).map(([N]) => N)).map((N) => ({ id: N, title: re(z(N), "Field") })) },
        { label: "Product filter sets", items: (S?.scopes ?? []).map((N) => ({
          id: N,
          title: re(t.options.scopes.find((n) => n.id === N)?.title, "Unavailable filter set")
        })) },
        { label: "Catalog app binding", items: (S?.shell_bindings ?? []).map((N) => ({ id: N, title: "Catalog app" })) },
        { label: "Readiness checks", items: (S?.checks ?? []).map((N) => ({ id: N, title: "Readiness check" })) },
        { label: "Dependent plugins", items: (S?.plugins ?? []).map((N) => ({
          id: N,
          title: re(P.value.get(N)?.title, "Dependent plugin")
        })) }
      ].filter((N) => N.items.length);
    });
    function Q(L) {
      for (const S of L.references?.scopes ?? [])
        E.value.includes(S) && (t.draft.scopes = E.value.filter((G) => G !== S), r("remove", "scopes", S));
      b.value = void 0, d(L.plugin, !1), r("review");
    }
    return (L, S) => (e(), i("div", io, [
      f(Te, {
        count: g.value.length,
        columns: ["details"]
      }, {
        head: w(() => [
          a("header", no, [
            S[6] || (S[6] = a("h3", null, "Plugins", -1)),
            a("span", oo, C(j.value) + " installed", 1)
          ])
        ]),
        default: w(() => [
          g.value.length === 0 ? (e(), i("div", ro, "No plugin is installed.")) : v("", !0),
          (e(!0), i(M, null, ee(g.value, ({ option: G, plugin: N, status: n, chosen: V, title: o, label: _, severity: W }) => (e(), I(Pe, {
            key: N.plugin,
            title: o,
            open: u.value[N.plugin] ?? !!(N.active && n && n.kind !== "pending"),
            "onUpdate:open": (Z) => u.value[N.plugin] = Z
          }, Oe({
            details: w(() => [
              f(s(ye), {
                severity: W,
                value: _
              }, null, 8, ["severity", "value"]),
              !n && G.description ? (e(), i("span", uo, C(s(re)(G.description, "Adds capabilities to this catalog.")), 1)) : v("", !0)
            ]),
            default: w(() => [
              a("div", co, [
                B.value.get(N.plugin)?.length ? (e(), i("p", mo, " Adds fields for " + C(B.value.get(N.plugin)?.join(", ")) + ". ", 1)) : v("", !0),
                N.active && n?.kind === "failed" && n.projection?.[1].parked ? (e(), i("p", po, " Background update: Paused ")) : v("", !0),
                n?.kind === "failed" ? (e(), i(M, { key: 2 }, [
                  f(s(_e), {
                    severity: "warn",
                    role: "alert"
                  }, {
                    default: w(() => [
                      s(so)(N) ? (e(), i(M, { key: 0 }, [
                        K("This package uses a plugin interface this deployment cannot run. Restore a compatible package to use this plugin.")
                      ], 64)) : (e(), i(M, { key: 1 }, [
                        K("The catalog could not set up this plugin. Check the status after resolving the setup problem.")
                      ], 64))
                    ]),
                    _: 2
                  }, 1024),
                  f(Ae, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: w(() => [
                      a("p", null, [
                        S[7] || (S[7] = K("Plugin ", -1)),
                        a("code", null, C(N.plugin), 1)
                      ]),
                      n.error?.message ? (e(), i("p", vo, C(n.error.message), 1)) : v("", !0),
                      n.error?.code ? (e(), i("p", fo, [
                        a("code", null, C(n.error.code), 1)
                      ])) : v("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  F.value && N.references ? (e(), I(s(J), {
                    key: 0,
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (Z) => b.value = N.plugin
                  }, null, 8, ["onClick"])) : (e(), I(s(J), {
                    key: 1,
                    label: "Check status",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: S[0] || (S[0] = (Z) => r("refresh"))
                  }))
                ], 64)) : n?.kind === "reset" ? (e(), i(M, { key: 3 }, [
                  f(s(_e), { severity: "warn" }, {
                    default: w(() => [
                      S[8] || (S[8] = K(" The event history this background update needs was removed. ", -1)),
                      n.error?.max_pruned_seq !== void 0 ? (e(), i("p", bo, "Earliest retained position " + C(n.error.max_pruned_seq + 1) + ".", 1)) : v("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  f(Ae, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: w(() => [
                      a("p", null, [
                        S[9] || (S[9] = K("Plugin ", -1)),
                        a("code", null, C(N.plugin), 1)
                      ]),
                      n.error?.projection ? (e(), i("p", yo, [
                        S[10] || (S[10] = K("Background update ", -1)),
                        a("code", null, C(n.error.projection), 1)
                      ])) : v("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  F.value ? (e(), I(s(J), {
                    key: 0,
                    label: "Reset background updates",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: l.stale,
                    onClick: (Z) => r("reset", N.plugin)
                  }, null, 8, ["disabled", "onClick"])) : v("", !0)
                ], 64)) : n?.projection && (n.kind === "paused" || n.kind === "degraded" || n.kind === "catchingUp") ? (e(), i(M, { key: 4 }, [
                  f(s(_e), {
                    severity: n.kind === "catchingUp" ? "info" : "warn"
                  }, {
                    default: w(() => [
                      n.projection[1].status === "paused" ? (e(), i("p", go, "This update was paused.")) : n.kind === "paused" ? (e(), i("p", ho, "The background worker stopped.")) : n.kind === "degraded" ? (e(), i("p", ko, "The background worker reported an error.")) : (e(), i("p", _o, "This update is processing catalog changes.")),
                      a("p", null, "Last applied position " + C(n.projection[1].last_seq) + ".", 1)
                    ]),
                    _: 2
                  }, 1032, ["severity"]),
                  f(Ae, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: w(() => [
                      a("p", null, [
                        S[11] || (S[11] = K("Background update ", -1)),
                        a("code", null, C(n.projection[0]), 1)
                      ]),
                      n.projection[1].error ? (e(), i("p", wo, C(n.projection[1].error), 1)) : v("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  F.value && n.projection[1].status === "paused" && n.projection[1].cursor_id ? (e(), I(s(J), {
                    key: 0,
                    label: "Resume background update",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: l.stale,
                    onClick: (Z) => r("resume", n.projection[1].cursor_id)
                  }, null, 8, ["disabled", "onClick"])) : n.kind === "paused" && F.value ? (e(), I(s(J), {
                    key: 1,
                    label: "Reset background updates",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: l.stale,
                    onClick: (Z) => r("reset", N.plugin)
                  }, null, 8, ["disabled", "onClick"])) : (e(), I(s(J), {
                    key: 2,
                    label: "Check status",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: S[1] || (S[1] = (Z) => r("refresh"))
                  }))
                ], 64)) : n?.kind === "uninstalled" ? (e(), i(M, { key: 5 }, [
                  f(s(_e), { severity: "warn" }, {
                    default: w(() => [...S[12] || (S[12] = [
                      K("The package was removed while it was still enabled for this catalog.", -1)
                    ])]),
                    _: 1
                  }),
                  f(s(J), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (Z) => b.value = N.plugin
                  }, null, 8, ["onClick"])
                ], 64)) : V ? (e(), i(M, { key: 6 }, [
                  f(Ca, {
                    disabled: !F.value,
                    schema: G.config_schema,
                    "model-value": l.pluginConfigs[N.plugin] ?? N.config ?? {},
                    problem: n?.kind === "config" ? n.error : void 0,
                    "plugin-id": n?.kind === "config" ? N.plugin : void 0,
                    "problem-label": n?.error?.field && n.error.field !== "config" ? T(G, n.error.field) : void 0,
                    "onUpdate:modelValue": (Z) => U(N.plugin, Z)
                  }, null, 8, ["disabled", "schema", "model-value", "problem", "plugin-id", "problem-label", "onUpdate:modelValue"]),
                  F.value && N.active && (l.pluginConfigs[N.plugin] || n?.kind === "config") ? (e(), i("div", $o, [
                    f(s(J), {
                      disabled: l.stale || !l.pluginConfigs[N.plugin],
                      label: "Save configuration",
                      size: "small",
                      onClick: (Z) => r("configure", N.plugin, l.pluginConfigs[N.plugin])
                    }, null, 8, ["disabled", "onClick"])
                  ])) : v("", !0)
                ], 64)) : v("", !0)
              ])
            ]),
            _: 2
          }, [
            F.value && N.installed && (!n || n.kind === "pending") ? {
              name: "actions",
              fn: w(() => [
                f(s(sa), {
                  "aria-label": "Enable " + o,
                  "model-value": V,
                  "onUpdate:modelValue": (Z) => d(N.plugin, Z)
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["title", "open", "onUpdate:open"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      f(da, {
        visible: !!x.value,
        label: "Plugin references",
        onClose: S[5] || (S[5] = (G) => b.value = void 0)
      }, {
        default: w(() => [
          m.value && x.value ? (e(), i("section", Co, [
            a("header", xo, [
              a("div", null, [
                S[13] || (S[13] = a("h2", null, "Plugin references", -1)),
                a("p", null, C(m.value.title), 1)
              ])
            ]),
            ae.value.length ? (e(), i(M, { key: 0 }, [
              S[14] || (S[14] = a("p", null, "Replace or remove these references before deactivating the plugin. You can also restore the package to keep using them.", -1)),
              (e(!0), i(M, null, ee(ae.value, (G) => (e(), i("div", {
                key: G.label
              }, [
                a("h3", null, C(G.label), 1),
                a("ul", null, [
                  (e(!0), i(M, null, ee(G.items, (N) => (e(), i("li", {
                    key: N.id
                  }, C(N.title), 1))), 128))
                ])
              ]))), 128))
            ], 64)) : (e(), i("p", Vo, "Use the catalog review to see what deactivating this plugin would change.")),
            x.value.references?.scopes.length && !x.value.references?.shell_bindings.length ? (e(), i("p", Uo, "Reviewing removal also includes these product filter sets.")) : v("", !0),
            f(Ae, {
              class: "small pim-error-code pim-ia-disclosure",
              label: "Technical details"
            }, {
              default: w(() => [
                a("p", null, [
                  S[15] || (S[15] = K("Plugin ", -1)),
                  a("code", null, C(x.value.plugin), 1)
                ]),
                (e(!0), i(M, null, ee(ae.value, (G) => (e(), i("div", {
                  key: G.label
                }, [
                  a("p", null, C(G.label), 1),
                  a("ul", null, [
                    (e(!0), i(M, null, ee(G.items, (N) => (e(), i("li", {
                      key: N.id
                    }, [
                      a("code", null, C(N.id), 1)
                    ]))), 128))
                  ])
                ]))), 128))
              ]),
              _: 1
            }),
            a("div", Ao, [
              F.value && x.value.references?.shell_bindings.length ? (e(), I(s(J), {
                key: 0,
                label: "Clear catalog app binding",
                severity: "secondary",
                outlined: "",
                disabled: l.stale,
                onClick: S[2] || (S[2] = (G) => r("clearShellBinding", x.value.references.shell_bindings[0]))
              }, null, 8, ["disabled"])) : F.value ? (e(), I(s(J), {
                key: 1,
                label: "Review removal",
                disabled: l.stale,
                onClick: S[3] || (S[3] = (G) => Q(x.value))
              }, null, 8, ["disabled"])) : v("", !0),
              f(s(J), {
                label: "Close",
                severity: "secondary",
                outlined: "",
                onClick: S[4] || (S[4] = (G) => b.value = void 0)
              })
            ])
          ])) : v("", !0)
        ]),
        _: 1
      }, 8, ["visible"]),
      f(Te, {
        count: l.options.scopes.length,
        columns: ["details"]
      }, {
        head: w(() => [...S[16] || (S[16] = [
          a("header", { class: "pim-bsection-head" }, [
            a("h3", null, "Product filter sets"),
            a("span", { class: "muted small" }, "Choose additional ways to filter products.")
          ], -1)
        ])]),
        default: w(() => [
          l.options.scopes.length === 0 ? (e(), i("div", So, "No product filter sets are available.")) : v("", !0),
          (e(!0), i(M, null, ee(l.options.scopes, (G) => (e(), I(Pe, {
            key: G.id,
            title: s(re)(G.title, "Filter set")
          }, Oe({
            details: w(() => [
              f(s(ye), {
                severity: ie(G) ? "success" : "secondary",
                value: ie(G) ? "Selected" : "Available"
              }, null, 8, ["severity", "value"])
            ]),
            default: w(() => [
              a("div", jo, [
                S[17] || (S[17] = a("span", null, "Filters", -1)),
                (e(!0), i(M, null, ee(G.filters, (N, n) => (e(), I(s(ye), {
                  key: n,
                  class: "kx-tag-sm small",
                  severity: "secondary",
                  value: h(n, N.ops)
                }, null, 8, ["value"]))), 128)),
                a("span", null, C(s(z)(G.access)) + " access required", 1)
              ])
            ]),
            _: 2
          }, [
            F.value ? {
              name: "actions",
              fn: w(() => [
                f(s(sa), {
                  "aria-label": "Use " + s(re)(G.title, "Filter set"),
                  "model-value": ie(G),
                  "onUpdate:modelValue": (N) => Ve(G, N)
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
async function Oo(l) {
  const k = await ml(`/api/v1/pim-admin/catalogs/${encodeURIComponent(l)}/policy_defaults`, "policy defaults");
  if (k.audit !== "fields" && k.audit !== "off" || !["audit_days", "trash_days", "tombstone_days"].every((t) => typeof k[t] == "number" && Number.isSafeInteger(k[t])))
    throw new Error("Policy defaults are unavailable.");
  for (const [t, r] of Object.entries(Ka)) {
    const c = k[t];
    if (typeof c != "number" || !Number.isSafeInteger(c) || c < r.min || c > r.max) throw new Error(`Policy ${t} is unavailable.`);
  }
  return k;
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
}, Io = { class: "form" }, To = {
  key: 0,
  class: "muted small pim-policy-intro"
}, Po = {
  key: 1,
  class: "muted small pim-policy-status",
  role: "status"
}, qo = {
  key: 0,
  class: "pim-bsection-head"
}, No = { class: "pim-policy-copy" }, Do = ["for"], zo = ["id"], Fo = { key: 0 }, Bo = {
  key: 0,
  class: "pim-policy-value"
}, Lo = {
  key: 0,
  class: "muted small"
}, Eo = /* @__PURE__ */ ue({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {},
    disabled: { type: Boolean },
    defaultsOnly: { type: Boolean }
  },
  setup(l) {
    const k = l, t = H(), r = D(() => k.defaults ?? t.value), c = H(), u = H(!1);
    async function b() {
      if (!(k.defaults || k.disabled)) {
        c.value = void 0, u.value = !0;
        try {
          t.value = await Oo(k.catalogId ?? "");
        } catch (d) {
          c.value = Le(d, "Could not read policy defaults.");
        } finally {
          u.value = !1;
        }
      }
    }
    Fa(b);
    const m = D(() => k.draft.policy ?? {}), x = [
      { key: "audit", title: "Audit trail", hint: "Fields records each value change. Off records only lifecycle, schema and release history.", kind: "enum" },
      { key: "audit_days", title: "Audit retention (days)", hint: "0 uses the 365-day default. History always expires.", kind: "int", min: 0, max: 106751 },
      { key: "trash_days", title: "Trash window (days)", hint: "How long a deleted product stays restorable.", kind: "int", min: 1, max: 106751 },
      { key: "tombstone_days", title: "Deleted product notices (days)", hint: "How long feeds report a purged product as deleted.", kind: "int", min: 1, max: 106751 }
    ], j = {
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
    function F(d) {
      const U = Ka[d];
      return { key: d, ...U, kind: "int", hint: j[d] };
    }
    x.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(F));
    const X = ["proposal_days", "proposal_count"].map(F), P = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(F), B = [
      { id: "retention", title: "Retention", keys: x },
      { id: "proposals", title: "Proposals", keys: X },
      { id: "advanced", title: "", keys: P }
    ], g = D(() => [
      { value: "inherited", label: r.value ? `${r.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function h(d, U) {
      const T = k.draft.policy ?? (k.draft.policy = {});
      T[d] = U == null || U === "" || U === "inherited" ? !1 : U;
    }
    return (d, U) => (e(), i("section", Io, [
      l.defaultsOnly ? v("", !0) : (e(), i("p", To, "Empty fields inherit the deployment settings.")),
      u.value ? (e(), i("p", Po, "Loading deployment defaults…")) : v("", !0),
      c.value ? (e(), I(ca, {
        key: 2,
        error: c.value
      }, {
        default: w(() => [
          f(s(J), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: b
          }, {
            default: w(() => [...U[0] || (U[0] = [
              K("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : v("", !0),
      (e(), i(M, null, ee(B, (T) => f(Cl(T.id === "advanced" ? Ae : "section"), xl({
        key: T.id,
        ref_for: !0
      }, T.id === "advanced" ? { label: "Advanced processing settings" } : { "aria-label": T.title }, {
        "data-policy-group": T.id,
        class: "pim-policy-group"
      }), {
        default: w(() => [
          T.title ? (e(), i("header", qo, [
            a("h3", null, C(T.title), 1)
          ])) : v("", !0),
          (e(!0), i(M, null, ee(T.keys, (E) => (e(), i("div", {
            key: E.key,
            class: "pim-policy-row"
          }, [
            a("div", No, [
              a("label", {
                for: "pol-" + E.key
              }, C(E.title), 9, Do),
              a("p", {
                id: "pol-help-" + E.key
              }, [
                K(C(E.hint), 1),
                E.global ? (e(), i("span", Fo, " Managed in deployment settings.")) : v("", !0)
              ], 8, zo)
            ]),
            l.defaultsOnly ? (e(), i("p", Bo, [
              K(C(r.value?.[E.key] === "fields" ? "Record field changes" : r.value?.[E.key] === "off" ? "Lifecycle and release history" : r.value?.[E.key] ?? "Unavailable") + " ", 1),
              m.value[E.key] !== void 0 && m.value[E.key] !== !1 ? (e(), i("span", Lo, " · Catalog override applies")) : v("", !0)
            ])) : E.kind === "enum" ? (e(), I(s(he), {
              key: 1,
              disabled: l.disabled,
              "input-id": "pol-" + E.key,
              "aria-describedby": "pol-help-" + E.key,
              class: "pim-policy-control",
              "model-value": typeof m.value[E.key] == "string" ? m.value[E.key] : "inherited",
              options: g.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": (ie) => h(E.key, ie)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])) : (e(), I(s(jl), {
              key: 2,
              disabled: l.disabled || E.global,
              "input-id": "pol-" + E.key,
              "aria-describedby": "pol-help-" + E.key,
              class: "pim-policy-control",
              "model-value": E.global ? Number(r.value?.[E.key] ?? 0) || null : typeof m.value[E.key] == "number" ? Number(m.value[E.key]) : null,
              min: E.min ?? (E.key === "audit_days" ? 0 : 1),
              max: E.max,
              step: 1,
              placeholder: r.value ? "Default: " + r.value[E.key] : "Deployment default",
              "onUpdate:modelValue": (ie) => h(E.key, ie)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "min", "max", "placeholder", "onUpdate:modelValue"]))
          ]))), 128))
        ]),
        _: 2
      }, 1040, ["data-policy-group"])), 64))
    ]));
  }
}), Mo = { class: "form" }, Wo = { class: "pim-aspect" }, Ho = { class: "pim-aspect-head" }, Jo = {
  key: 0,
  class: "muted small"
}, Ko = /* @__PURE__ */ ue({
  __name: "BuilderDeclaration",
  props: {
    draft: {},
    readonly: { type: Boolean }
  },
  emits: ["replace", "validity"],
  setup(l, { emit: k }) {
    const t = l, r = k, c = H(JSON.stringify(t.draft, null, 2)), u = H("");
    Ye(() => r("validity", !0)), ve(() => t.draft, (m) => {
      c.value = JSON.stringify(m, null, 2), u.value = "";
    }, { deep: !0 });
    function b() {
      if (!t.readonly)
        try {
          const m = Wl(c.value);
          u.value = "", r("validity", !0), r("replace", m);
        } catch (m) {
          r("validity", !1), u.value = "Invalid declaration: " + (m instanceof Error ? m.message : String(m));
        }
    }
    return (m, x) => (e(), i("section", Mo, [
      a("div", Wo, [
        a("header", Ho, [
          x[1] || (x[1] = a("h3", null, "Declaration", -1)),
          l.readonly ? v("", !0) : (e(), i("span", Jo, "edits apply to the draft when the JSON parses"))
        ]),
        u.value ? (e(), I(s(_e), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: w(() => [
            K(C(u.value), 1)
          ]),
          _: 1
        })) : v("", !0),
        f(s(Rl), {
          modelValue: c.value,
          "onUpdate:modelValue": x[0] || (x[0] = (j) => c.value = j),
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
}), Go = { class: "pim-section-layout" }, Yo = { class: "kx-main" }, Zo = ["aria-label"], Qo = {
  key: 0,
  class: "system-section-head"
}, Xo = { class: "system-section-head-text" }, ed = { class: "kx-head-actions" }, ad = { class: "pim-builder-main" }, ld = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, td = ["disabled", "inert"], sd = {
  key: 0,
  class: "muted pim-section-facts"
}, id = { class: "pim-overview-grid" }, nd = { class: "kx-card-head" }, od = { class: "kx-head-icon" }, dd = { class: "kx-card-id" }, rd = { class: "kx-card-name" }, ud = { class: "kx-card-meta" }, cd = { class: "kx-card-desc" }, md = { class: "pim-advanced-actions" }, pd = { class: "pim-ia-action" }, vd = { class: "pim-ia-action" }, fd = { class: "pim-ia-dialog" }, bd = { class: "pim-ia-dialog-head" }, yd = {
  key: 0,
  class: "dialog-actions"
}, gd = ["aria-labelledby"], hd = { class: "pim-ia-dialog-head" }, kd = ["id"], _d = { class: "pim-ia-review-impact" }, wd = { key: 0 }, $d = { key: 1 }, Cd = { key: 2 }, xd = { key: 3 }, Vd = { key: 4 }, Ud = { key: 0 }, Ad = {
  key: 0,
  class: "pim-plan-list"
}, Sd = { key: 1 }, jd = {
  key: 1,
  class: "pim-ia-review-impact"
}, Rd = {
  key: 0,
  class: "row pim-review-confirm"
}, Od = ["for"], Id = { class: "dialog-actions pim-ia-dialog-actions" }, Td = /* @__PURE__ */ ue({
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
  setup(l, { emit: k }) {
    const t = l, r = k, c = {
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
    }, u = H("General"), b = H("Overview"), m = H(""), x = H(""), j = H(), F = H(!1), X = H(), P = Object.keys(c).map((y) => ({
      heading: y === "Channels" ? "Publishing and imports" : y,
      items: c[y].items.map((p) => ({ ...p, value: p.label, section: y }))
    })), B = [
      ...P.filter((y) => y.items.length > 1),
      { heading: "Manage catalog", items: P.filter((y) => y.items.length === 1).flatMap((y) => y.items) }
    ], g = B.flatMap((y) => y.items), h = D(() => Q.value && L.value ? [
      { ...B[0], heading: t.title || "Catalog" },
      ...B.slice(1)
    ] : []), d = D(() => t.backLabel ? {
      value: "all-catalogs",
      label: t.embedded ? "All catalogs" : t.backLabel,
      icon: "tabler:table"
    } : void 0), U = H();
    ve(U, (y) => {
      t.focusBack && y?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    function T(y) {
      if (y === "all-catalogs") {
        r("back");
        return;
      }
      const p = g.find((O) => O.label === y);
      p && E(p.section, p.label);
    }
    function E(y, p = c[y].items[0].label) {
      u.value === y && b.value === p || (u.value = y, b.value = p, X.value && (X.value.scrollTop = 0));
    }
    function ie(y) {
      j.value = y, F.value = !0;
    }
    function Ve(y) {
      m.value = y, E("Products", "Fields");
    }
    function ae(y, p, O = p + "s") {
      return y + " " + (y === 1 ? p : O);
    }
    const Q = H(null), L = H(null), S = H({}), G = H({}), N = H({}), n = D(() => Object.fromEntries(Object.entries(N.value).filter(([y]) => S.value.plugins?.some((p) => p.use === y) && !Q.value?.plugins.some((p) => p.plugin === y && p.active)))), V = H(), o = H(!1), _ = H(null), W = H(!1), Z = D(() => Q.value?.access.admin === !0), te = H(""), ne = H(null), Ee = H(!1), me = H(!1), Ze = H(null), Ne = qe(), ma = {
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
    }, Ue = H(null), we = H(!0), A = Je(), R = D(() => Ee.value && Xe.value && (!ba.value.length || me.value) && !o.value && we.value && !!ne.value && ne.value.class !== "refused" && !!Ue.value?.matches(De.value, Q.value?.schema_generation ?? -1, n.value)), q = D(() => ne.value ? [...ne.value.refused, ...ne.value.changes.filter((y) => y.class !== "refused")] : []), $ = Je(), oe = Je(), Y = H(!1);
    let je = 0;
    ve([S, G, N], () => {
      je++, ge();
    }, { deep: !0, flush: "sync" });
    async function fe(y = !1, p = !1) {
      if ($e.value && !y) return;
      const O = $.begin(), se = je, ce = t.catalogId, be = p ? Object.entries(N.value).filter(([ke]) => Q.value?.plugins.some((ia) => ia.plugin === ke && ia.active)) : [];
      Y.value = !0, V.value = void 0;
      try {
        const [ke, ia] = await Promise.all([pe.schema(ce), pe.schemaOptions(ce)]);
        if (!$.current(O) || se !== je || ce !== t.catalogId) return;
        Q.value = ke, L.value = ia, S.value = aa(ke.declaration), G.value = {}, N.value = Object.fromEntries(be.filter(([ul]) => ke.plugins.some((Ta) => Ta.plugin === ul && Ta.active))), ge(), we.value = !0, o.value = !1;
      } catch (ke) {
        $.current(O) && (V.value = Le(ke, "Could not load settings."));
      } finally {
        $.current(O) && (Y.value = !1);
      }
    }
    let Qe = () => {
    };
    ve(() => t.catalogId, (y) => {
      Qe(), Qe = Ba(`component.${y}`, () => {
        !$e.value && !W.value ? fe() : b.value === "Plugins" && !W.value && ze();
      });
    }, { immediate: !0 });
    const Ga = ua(async () => {
      !$e.value && !W.value ? await fe() : b.value === "Plugins" && !W.value && await ze();
    });
    Ye(() => {
      Qe(), A.begin(), $.begin(), oe.begin();
    });
    const xa = D(() => Ga.value !== !1 && b.value === "Plugins" && !W.value && Q.value?.plugins.some((y) => to(y, Q.value.as_of)) === !0);
    ve(xa, (y, p, O) => {
      if (!y) return;
      let se, ce = !0;
      const be = () => {
        se = setTimeout(async () => {
          await ze() && ce && xa.value && be();
        }, 2e3);
      };
      be(), O(() => {
        ce = !1, clearTimeout(se);
      });
    }), ve(() => t.catalogId, () => {
      A.begin(), W.value = !1, o.value = !1, Q.value = null, L.value = null, ya(), fe();
    });
    const Ya = D(() => Object.values(Pa(S.value, G.value)).reduce((y, p) => y + (p?.length ?? 0), 0)), Xe = D(() => !!Q.value && (JSON.stringify(S.value) !== JSON.stringify(Q.value.declaration) || Ya.value > 0 || Object.keys(n.value).length > 0)), $e = D(() => Xe.value || Object.keys(N.value).length > 0);
    ve($e, (y) => r("dirty-changed", y), { immediate: !0 });
    const ea = D(() => S.value.families?.filter((y) => y.code !== "generic") ?? []), va = D(() => S.value.aspects ?? []), fa = D(() => va.value.reduce((y, p) => y + (p.attributes?.length ?? 0), 0)), Va = D(() => {
      const y = new Set(S.value.plugins?.map((p) => p.use));
      return Object.values(Q.value?.attributes ?? {}).filter((p) => p.plugin && y.has(p.plugin)).length;
    }), Za = D(() => !fa.value && !va.value.length && !ea.value.length), Ua = D(() => S.value.channels ?? []), Qa = D(() => S.value.sources ?? []), Aa = D(() => Q.value?.plugins.filter((y) => y.active) ?? []), Xa = D(() => [
      {
        section: "Products",
        label: "Product setup",
        icon: "tabler:packages",
        summary: [ae(ea.value.length, "family", "families"), ae(fa.value + Va.value, "field")].join(" · "),
        detail: ea.value.map((y) => z(y.code)).join(", ") || "Create a family for products that share the same fields."
      },
      {
        section: "Values",
        label: "Allowed values",
        icon: "tabler:list-details",
        summary: [ae(S.value.dimensions?.length ?? 0, "dimension"), ae(S.value.vocabularies?.length ?? 0, "vocabulary", "vocabularies")].join(" · "),
        detail: S.value.dimensions?.map((y) => z(y.name)).join(", ") || "Add dimensions when values vary by language, region or another context."
      },
      {
        section: "Channels",
        label: "Publishing and imports",
        icon: "tabler:arrows-exchange",
        summary: [ae(Ua.value.length, "channel"), ae(Qa.value.length, "source")].join(" · "),
        detail: Ua.value.map((y) => z(y.id)).join(", ") || "Add a release destination when products are ready to publish."
      },
      {
        section: "Plugins",
        label: "Catalog tools",
        icon: "tabler:puzzle",
        summary: ae(Aa.value.length, "plugin") + " enabled",
        detail: Aa.value.map((y) => re(y.title, "Catalog plugin")).join(", ") || "Open Plugins to see which tools you can enable."
      }
    ]), el = {
      Overview: c.General.question,
      History: "What changed in this catalog?",
      Families: "Which product forms and variants can editors use?",
      Fields: "What values can products store?",
      "Form layout": "In what order will editors see fields?",
      Dimensions: "Where can product values differ?",
      Vocabularies: "Which terms can product editors choose?",
      Channels: "Where can products be published?",
      Sources: "Which systems can send product data?",
      Access: c.Access.question,
      Plugins: c.Plugins.question
    }, Sa = D(() => {
      const y = S.value;
      switch (b.value) {
        case "Overview": {
          const p = t.catalog?.product_count ?? t.catalog?.item_count;
          return [
            ...typeof p == "number" ? [ae(p, "product")] : [],
            ...Q.value?.rebuilding ? ["Updating product readiness"] : [],
            ...$e.value ? ["Unsaved changes are reflected below"] : []
          ];
        }
        case "History":
          return ["Recent catalog settings changes"];
        case "Families":
          return [
            ae(ea.value.length, "family", "families"),
            ae(ea.value.filter((p) => p.variation?.length).length, "family with variants", "families with variants")
          ];
        case "Fields":
        case "Form layout":
          return [ae(fa.value + Va.value, "field"), ae(va.value.length, "field group")];
        case "Dimensions":
          return [ae(y.dimensions?.length ?? 0, "dimension")];
        case "Vocabularies":
          return [ae(y.vocabularies?.length ?? 0, "vocabulary", "vocabularies")];
        case "Channels":
          return [
            ae(y.channels?.length ?? 0, "channel"),
            ...y.channels?.length ? [] : ["Add a channel to give products a release destination"]
          ];
        case "Sources":
          return [ae(y.sources?.length ?? 0, "source")];
        case "Access":
          return x.value ? [x.value] : [];
        case "Plugins":
          return [
            ae(y.plugins?.length ?? 0, "plugin") + " selected",
            (L.value?.plugins.filter((p) => p.installed).length ?? 0) + " available",
            ae(y.scopes?.length ?? 0, "filter set") + " selected",
            ...Q.value?.plugins.some((p) => p.active && ["failed", "config", "reset", "paused", "degraded", "uninstalled"].includes(Ja(p, Q.value.as_of)?.kind ?? "")) ? ["Some plugins need attention"] : []
          ];
        default:
          return [];
      }
    }), De = D(() => {
      const y = aa(S.value), p = Pa(y, G.value);
      for (const [O, se] of Object.entries(p)) {
        const ce = y.remove ??= {};
        ce[O] = [.../* @__PURE__ */ new Set([...ce[O] ?? [], ...se])];
      }
      return y;
    });
    ve(Xe, (y) => {
      y || ge();
    }), ve([De, n], ge, { deep: !0 });
    function al(y) {
      const [p, O] = y.split(" ", 2);
      if (p === "plugin" && O) return re(L.value?.plugins.find((be) => be.plugin === O)?.title, "Plugin");
      if (p === "scope" && O) return re(L.value?.scopes.find((be) => be.id === O)?.title, "Product filter set");
      if (O) return re(z(O), z(p)) + (p === "aspect" ? " field group" : "");
      if (y.startsWith("kickside.")) return "Catalog setting";
      const [se, ce] = y.split(".", 2);
      return ce ? `${re(z(ce), "Field")} (${re(z(se), "Field group")})` : re(z(y), "Catalog setting");
    }
    function ll(y) {
      return y.startsWith("renamed from ") ? "Rename from " + z(y.slice(13)) : y.startsWith("config.") ? "Change " + z(y.slice(7)) : y.endsWith(" owning level") ? "Move a field to another variant level" : pa[y] ?? z(y);
    }
    const ba = D(() => {
      const y = De.value.remove;
      return [
        ...y?.attributes?.length || y?.aspects?.length ? ["Removing fields deletes the values stored in those fields."] : [],
        ...y?.vocabularies?.length ? ["Removing a vocabulary deletes its saved terms."] : [],
        ...y?.channels?.length ? ["Removing a release destination withdraws products already published to it."] : []
      ];
    }), ja = D(() => {
      const y = Q.value?.declaration;
      return y ? [
        ...(S.value.channels ?? []).flatMap((p) => {
          const O = y.channels?.find((se) => se.id === p.id);
          return JSON.stringify(p) === JSON.stringify(O) ? [] : [{ subject: z(p.id), effect: O ? "Change which products can be released here and what they need first" : "Add a release destination" }];
        }),
        ...(De.value.remove?.channels ?? []).map((p) => ({ subject: z(p), effect: "Remove this release destination" })),
        ...(S.value.sources ?? []).flatMap((p) => {
          const O = y.sources?.find((se) => se.id === p.id);
          return JSON.stringify(p) === JSON.stringify(O) ? [] : [{ subject: z(p.id), effect: O ? "Update how this source can send product data" : "Let this source send product updates" }];
        }),
        ...(De.value.remove?.sources ?? []).map((p) => ({ subject: z(p), effect: "Stop accepting updates from this source" }))
      ] : [];
    });
    function Me(y, p) {
      V.value = Le(y, p), V.value.code === pl && (o.value = !0, ge());
    }
    async function tl() {
      if (!($e.value && !await He.confirm({
        header: "Discard unsaved changes?",
        message: "Reloading will discard unsaved settings and plugin changes.",
        acceptLabel: "Discard and reload",
        rejectLabel: "Cancel"
      }))) {
        W.value = !0, te.value = "";
        try {
          await fe(!0);
        } finally {
          W.value = !1;
        }
      }
    }
    async function Ra() {
      if (!Q.value || !Xe.value || !we.value || o.value) return;
      const y = A.begin(), p = Ll(De.value, Q.value.schema_generation, n.value);
      W.value = !0, V.value = void 0;
      try {
        const O = await pe.planSchema(t.catalogId, p.declaration, p.generation, p.pluginConfigs);
        if (!A.current(y) || !p.matches(De.value, Q.value.schema_generation, n.value) || !we.value) return;
        Ue.value = p, me.value = !1, ne.value = O, Ee.value = !0, await Ke(), Ze.value?.focus();
      } catch (O) {
        if (!A.current(y)) return;
        Me(O, "Could not review the change."), ge(), await Ke(), _.value?.$el.focus();
      } finally {
        A.current(y) && (W.value = !1);
      }
    }
    async function sl() {
      if (!Q.value || !$e.value || !R.value || !Ue.value) return;
      const y = t.catalogId, p = A.begin();
      W.value = !0, V.value = void 0, te.value = "";
      try {
        const O = await pe.applySchema(y, Ue.value.declaration, Ue.value.generation, Ue.value.pluginConfigs);
        if (y !== t.catalogId || !A.current(p) || (await fe(!0, !0), y !== t.catalogId || !A.current(p))) return;
        te.value = "Catalog changes applied.", r("applied", O.generation);
      } catch (O) {
        if (y !== t.catalogId || !A.current(p)) return;
        ge(), Me(O, "Could not apply the change."), await Ke(), _.value?.$el.focus();
      } finally {
        A.current(p) && (W.value = !1);
      }
    }
    async function ze(y = !1) {
      const p = t.catalogId, O = Q.value, se = oe.begin();
      try {
        const [ce, be] = await Promise.all([pe.schema(p), y ? pe.schemaOptions(p) : void 0]);
        return !O || !oe.current(se) || p !== t.catalogId || Q.value !== O ? !1 : (O.plugins = ce.plugins, O.as_of = ce.as_of, be && (L.value = be), !0);
      } catch (ce) {
        return y && oe.current(se) && p === t.catalogId && Me(ce, "Could not check plugin status."), !1;
      }
    }
    async function Oa(y, p, O = !1) {
      if (W.value || o.value || !Z.value) return;
      const se = t.catalogId, ce = $.begin(), be = A.begin();
      oe.begin(), W.value = !0, V.value = void 0, te.value = "";
      try {
        const ke = JSON.stringify(p);
        if (O ? await pe.configurePlugin(se, y, aa(p), !0) : await pe.configurePlugin(se, y, aa(p)), se !== t.catalogId || !$.current(ce) || !await ze(!0) || se !== t.catalogId || !$.current(ce)) return;
        !O && JSON.stringify(N.value[y]) === ke && delete N.value[y], te.value = O ? "Background update reset requested." : "Configuration saved";
      } catch (ke) {
        se === t.catalogId && A.current(be) && Me(ke, O ? "Could not reset background updates." : "Could not save configuration.");
      } finally {
        A.current(be) && (W.value = !1);
      }
    }
    async function il(y) {
      const p = t.catalogId, O = Q.value?.plugins.find((se) => se.plugin === y && se.active && se.installed);
      !O?.config || W.value || o.value || !Z.value || !await He.confirm({
        header: "Reset background updates?",
        message: "Background updates will start from a new catalog event. Current product data will be rebuilt into the plugin’s index. Earlier events will be skipped.",
        acceptLabel: "Reset background updates",
        rejectLabel: "Cancel"
      }) || t.catalogId !== p || await Oa(y, O.config, !0);
    }
    async function nl(y) {
      const p = t.catalogId;
      if (!(W.value || o.value || !Z.value)) {
        W.value = !0, V.value = void 0, te.value = "";
        try {
          await pe.resumePluginProjection(p, y), t.catalogId === p && await ze(!0) && (te.value = "Background update resumed.");
        } catch (O) {
          t.catalogId === p && Me(O, "Could not resume the background update.");
        } finally {
          t.catalogId === p && (W.value = !1);
        }
      }
    }
    async function ol(y) {
      const p = t.catalogId;
      if (!(W.value || o.value || !Z.value) && !(!await He.confirm({
        header: "Clear catalog app binding?",
        message: "The catalog will use the default app after this setting is saved.",
        acceptLabel: "Clear binding",
        rejectLabel: "Cancel"
      }) || t.catalogId !== p || W.value || !Z.value || !Q.value?.plugins.some((O) => O.references?.shell_bindings.includes(y)))) {
        W.value = !0, V.value = void 0, te.value = "";
        try {
          if (await pe.updateCatalogApp(p, ""), t.catalogId !== p) return;
          await ze(!0) && (te.value = "Catalog app binding cleared.");
        } catch (O) {
          t.catalogId === p && Me(O, "Could not clear the catalog app binding.");
        } finally {
          t.catalogId === p && (W.value = !1);
        }
      }
    }
    async function dl() {
      $e.value && !await He.confirm({
        header: "Leave this catalog?",
        message: "Your unsaved catalog changes will be discarded.",
        acceptLabel: "Discard and open settings",
        rejectLabel: "Keep editing"
      }) || (ya(), F.value = !1, He.navigate("/system/settings"));
    }
    function ge() {
      Ee.value = !1, Ue.value = null;
    }
    function Ia() {
      F.value = !1, we.value = !0;
    }
    function ya() {
      N.value = {}, we.value = !0, Q.value && (S.value = aa(Q.value.declaration)), G.value = {}, ge(), te.value = "";
    }
    function We(y, p) {
      const O = G.value[y] ?? [];
      O.includes(p) || (G.value = { ...G.value, [y]: [...O, p] });
    }
    function rl(y) {
      y.button === 0 && y.target instanceof Element && y.target.closest(".kx-settings-rail-item:focus-visible")?.blur();
    }
    return (y, p) => (e(), i("section", {
      class: xe(["pim-builder", { embedded: l.embedded }])
    }, [
      a("div", Go, [
        d.value || Q.value && L.value ? (e(), I(ql, {
          key: 0,
          ref_key: "rail",
          ref: U,
          label: "Catalog settings sections",
          value: b.value,
          groups: h.value,
          "leading-item": d.value,
          "onUpdate:value": T,
          onPointerdown: rl
        }, null, 8, ["value", "groups", "leading-item"])) : v("", !0),
        a("div", Yo, [
          a("section", {
            ref_key: "content",
            ref: X,
            class: "kx-main-scroll",
            "aria-label": b.value
          }, [
            Q.value && L.value ? (e(), i("header", Qo, [
              a("div", Xo, [
                a("h1", null, C(b.value), 1),
                a("p", null, C(el[b.value]), 1)
              ]),
              a("div", ed, [
                f(It, {
                  access: Q.value.access,
                  dirty: $e.value,
                  busy: W.value,
                  valid: we.value && !o.value && Xe.value,
                  onDiscard: ya,
                  onReview: Ra
                }, null, 8, ["access", "dirty", "busy", "valid"])
              ])
            ])) : v("", !0),
            a("div", ad, [
              V.value ? (e(), I(ca, {
                key: 0,
                ref_key: "errorPanel",
                ref: _,
                error: V.value,
                tabindex: "-1"
              }, {
                default: w(() => [
                  o.value ? (e(), I(s(J), {
                    key: 0,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: W.value,
                    onClick: tl
                  }, {
                    default: w(() => [...p[11] || (p[11] = [
                      K("Reload settings", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"])) : !Q.value || !L.value ? (e(), I(s(J), {
                    key: 1,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: p[0] || (p[0] = (O) => fe())
                  }, {
                    default: w(() => [...p[12] || (p[12] = [
                      K("Retry", -1)
                    ])]),
                    _: 1
                  })) : v("", !0)
                ]),
                _: 1
              }, 8, ["error"])) : v("", !0),
              te.value ? (e(), I(s(_e), {
                key: 1,
                severity: "success",
                role: "status"
              }, {
                default: w(() => [
                  K(C(te.value), 1)
                ]),
                _: 1
              })) : v("", !0),
              Y.value && (!Q.value || !L.value) ? (e(), i("div", ld, "Loading catalog settings…")) : Q.value && L.value ? (e(), i("fieldset", {
                key: 3,
                class: "pim-editor-surface",
                disabled: W.value,
                inert: W.value
              }, [
                Sa.value.length ? (e(), i("p", sd, C(Sa.value.join(" · ")), 1)) : v("", !0),
                Z.value ? v("", !0) : (e(), I(s(_e), {
                  key: 1,
                  severity: "info"
                }, {
                  default: w(() => [...p[13] || (p[13] = [
                    K("You can view this catalog’s settings.", -1)
                  ])]),
                  _: 1
                })),
                (e(), i("div", {
                  key: b.value,
                  class: "pim-ia-content"
                }, [
                  u.value === "General" && b.value === "History" ? (e(), I(Ot, {
                    key: 0,
                    "catalog-id": l.catalogId,
                    "can-resolve-actors": Z.value
                  }, null, 8, ["catalog-id", "can-resolve-actors"])) : u.value === "General" ? (e(), i(M, { key: 1 }, [
                    a("div", id, [
                      (e(!0), i(M, null, ee(Xa.value, (O) => (e(), i("section", {
                        key: O.section,
                        class: "kx-card pim-overview-card"
                      }, [
                        a("div", nd, [
                          a("span", od, [
                            f(s(le), {
                              icon: O.icon,
                              "aria-hidden": "true"
                            }, null, 8, ["icon"])
                          ]),
                          a("div", dd, [
                            a("h3", rd, C(O.label), 1),
                            a("p", ud, C(O.summary), 1)
                          ])
                        ]),
                        a("p", cd, C(O.detail), 1),
                        f(s(J), {
                          type: "button",
                          text: "",
                          size: "small",
                          severity: "secondary",
                          class: "pim-overview-action",
                          onClick: (se) => E(O.section)
                        }, {
                          default: w(() => [
                            K(C(O.section === "Products" && Za.value ? "Set up products" : "View " + O.section.toLowerCase()) + " ", 1),
                            f(s(le), {
                              icon: "tabler:arrow-right",
                              "aria-hidden": "true"
                            })
                          ]),
                          _: 2
                        }, 1032, ["onClick"])
                      ]))), 128))
                    ]),
                    f(Ae, { label: "Advanced" }, {
                      default: w(() => [
                        a("div", md, [
                          a("div", pd, [
                            p[14] || (p[14] = a("div", null, [
                              a("h3", null, "Application defaults"),
                              a("p", null, "Review the audit, retention and processing settings this catalog inherits.")
                            ], -1)),
                            f(s(J), {
                              label: "View defaults",
                              severity: "secondary",
                              outlined: "",
                              onClick: p[1] || (p[1] = (O) => ie("defaults"))
                            })
                          ]),
                          a("div", vd, [
                            p[15] || (p[15] = a("div", null, [
                              a("h3", null, "Technical schema"),
                              a("p", null, "Inspect the complete definition, including integration keys and settings used by installed extensions.")
                            ], -1)),
                            f(s(J), {
                              label: "Open declaration",
                              severity: "secondary",
                              outlined: "",
                              onClick: p[2] || (p[2] = (O) => ie("declaration"))
                            })
                          ])
                        ])
                      ]),
                      _: 1
                    })
                  ], 64)) : u.value === "Products" ? (e(), i(M, { key: 2 }, [
                    b.value === "Families" ? (e(), I(_n, {
                      key: 0,
                      draft: S.value,
                      schema: Q.value,
                      options: L.value,
                      onRemove: We,
                      onFields: Ve
                    }, null, 8, ["draft", "schema", "options"])) : b.value === "Fields" ? (e(), I(ri, {
                      key: 1,
                      family: m.value,
                      "onUpdate:family": p[3] || (p[3] = (O) => m.value = O),
                      draft: S.value,
                      schema: Q.value,
                      options: L.value,
                      onRemove: We
                    }, null, 8, ["family", "draft", "schema", "options"])) : (e(), I(ct, {
                      key: 2,
                      draft: S.value,
                      schema: Q.value,
                      types: L.value.types
                    }, null, 8, ["draft", "schema", "types"]))
                  ], 64)) : u.value === "Values" ? (e(), i(M, { key: 3 }, [
                    b.value === "Dimensions" ? (e(), I(hi, {
                      key: 0,
                      draft: S.value,
                      schema: Q.value,
                      onRemove: We
                    }, null, 8, ["draft", "schema"])) : (e(), I(zi, {
                      key: 1,
                      "catalog-id": l.catalogId,
                      draft: S.value,
                      schema: Q.value,
                      onRemove: We
                    }, null, 8, ["catalog-id", "draft", "schema"]))
                  ], 64)) : u.value === "Channels" ? (e(), I(ao, {
                    key: 4,
                    "catalog-id": l.catalogId,
                    draft: S.value,
                    schema: Q.value,
                    view: b.value === "Sources" ? "sources" : "channels",
                    onRemove: We
                  }, null, 8, ["catalog-id", "draft", "schema", "view"])) : u.value === "Access" ? (e(), I(Bl, {
                    key: 5,
                    "catalog-id": l.catalogId,
                    title: l.title || "Catalog",
                    access: Q.value.access,
                    onSummary: p[4] || (p[4] = (O) => x.value = O)
                  }, null, 8, ["catalog-id", "title", "access"])) : (e(), I(Ro, {
                    key: 6,
                    draft: S.value,
                    schema: Q.value,
                    options: L.value,
                    "plugin-configs": N.value,
                    stale: o.value,
                    onConfigure: Oa,
                    onRemove: We,
                    onReset: il,
                    onRefresh: p[5] || (p[5] = (O) => ze(!0)),
                    onResume: nl,
                    onReview: Ra,
                    onClearShellBinding: ol
                  }, null, 8, ["draft", "schema", "options", "plugin-configs", "stale"]))
                ])),
                j.value ? (e(), I(da, {
                  key: 2,
                  visible: F.value,
                  label: j.value === "defaults" ? "Application defaults" : "Technical schema",
                  onClose: Ia,
                  onClosed: p[8] || (p[8] = (O) => j.value = void 0)
                }, {
                  default: w(() => [
                    a("div", fd, [
                      a("header", bd, [
                        a("h2", null, C(j.value === "defaults" ? "Application defaults" : "Technical schema"), 1),
                        f(s(J), {
                          type: "button",
                          "aria-label": "Close",
                          text: "",
                          severity: "secondary",
                          onClick: Ia
                        }, {
                          default: w(() => [
                            f(s(le), {
                              icon: "tabler:x",
                              "aria-hidden": "true"
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      j.value === "defaults" ? (e(), i(M, { key: 0 }, [
                        p[16] || (p[16] = a("p", { class: "muted" }, "These settings apply across the application. Catalogs with an explicit override keep their chosen value.", -1)),
                        f(Eo, {
                          "catalog-id": l.catalogId,
                          draft: S.value,
                          disabled: !Z.value,
                          "defaults-only": ""
                        }, null, 8, ["catalog-id", "draft", "disabled"]),
                        Z.value ? (e(), i("div", yd, [
                          f(s(J), {
                            type: "button",
                            label: "Open application settings",
                            severity: "secondary",
                            outlined: "",
                            onClick: dl
                          })
                        ])) : v("", !0)
                      ], 64)) : (e(), I(Ko, {
                        key: 1,
                        draft: S.value,
                        readonly: !Z.value,
                        onReplace: p[6] || (p[6] = (O) => S.value = O),
                        onValidity: p[7] || (p[7] = (O) => {
                          we.value = O, ge();
                        })
                      }, null, 8, ["draft", "readonly"]))
                    ])
                  ]),
                  _: 1
                }, 8, ["visible", "label"])) : v("", !0)
              ], 8, td)) : v("", !0),
              f(da, {
                class: "pim-review-dialog",
                visible: Ee.value,
                busy: W.value,
                label: "Review changes",
                onClose: ge,
                onClosed: p[10] || (p[10] = (O) => ne.value = null)
              }, {
                default: w(() => [
                  ne.value ? (e(), i("section", {
                    key: 0,
                    class: "pim-ia-dialog pim-plan",
                    "aria-labelledby": s(Ne)
                  }, [
                    a("header", hd, [
                      a("div", null, [
                        a("h2", {
                          id: s(Ne),
                          ref_key: "reviewHeading",
                          ref: Ze,
                          tabindex: "-1",
                          autofocus: ""
                        }, "Review changes", 8, kd),
                        a("p", null, "Check what will happen when you apply this draft to " + C(l.title || "the catalog") + ".", 1)
                      ]),
                      f(s(J), {
                        type: "button",
                        "aria-label": "Close review",
                        disabled: W.value,
                        text: "",
                        severity: "secondary",
                        onClick: ge
                      }, {
                        default: w(() => [
                          f(s(le), {
                            icon: "tabler:x",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ]),
                    a("div", _d, [
                      a("h3", null, C(ma[ne.value.class] || "Catalog changes"), 1),
                      ne.value.class === "unchanged" ? (e(), i("p", wd, "The catalog already matches this draft.")) : ne.value.class === "initial" ? (e(), i("p", $d, "Product editors will use these settings for new products.")) : ne.value.class === "cosmetic" ? (e(), i("p", Cd, "Catalog settings will update. Stored product values are kept.")) : ne.value.class === "additive" ? (e(), i("p", xd, "The new options become available. Existing product values are kept.")) : ne.value.class === "semantic" ? (e(), i("p", Vd, "Applying changes can recalculate product values or release readiness across this catalog.")) : ne.value.class === "refused" ? (e(), I(s(_e), {
                        key: 5,
                        severity: "error"
                      }, {
                        default: w(() => [
                          p[17] || (p[17] = K(" These changes can’t be applied. ", -1)),
                          ne.value.migration && ne.value.refused.some((O) => Q.value?.attributes[O.code]) ? (e(), i("span", Ud, " To change how a field stores values, add a new field and copy the existing values into it. Then remove the original field and give the new field its name. ")) : v("", !0)
                        ]),
                        _: 1
                      })) : v("", !0)
                    ]),
                    q.value.length || ja.value.length ? (e(), i("ul", Ad, [
                      (e(!0), i(M, null, ee(q.value, (O, se) => (e(), i("li", { key: se }, [
                        O.class === "refused" ? (e(), I(s(ye), {
                          key: 0,
                          class: "kx-tag-sm small",
                          severity: "danger"
                        }, {
                          default: w(() => [...p[18] || (p[18] = [
                            K("Blocked", -1)
                          ])]),
                          _: 1
                        })) : v("", !0),
                        O.code ? (e(), i("strong", Sd, C(al(O.code)), 1)) : v("", !0),
                        a("span", null, C(ll(O.what)), 1)
                      ]))), 128)),
                      (e(!0), i(M, null, ee(ja.value, (O) => (e(), i("li", {
                        key: O.subject + O.effect
                      }, [
                        a("strong", null, C(O.subject), 1),
                        a("span", null, C(O.effect), 1)
                      ]))), 128))
                    ])) : v("", !0),
                    ba.value.length ? (e(), i("div", jd, [
                      p[19] || (p[19] = a("h3", null, "Permanent changes", -1)),
                      (e(!0), i(M, null, ee(ba.value, (O) => (e(), i("p", { key: O }, C(O), 1))), 128)),
                      ne.value.class !== "refused" ? (e(), i("div", Rd, [
                        f(s(Vl), {
                          modelValue: me.value,
                          "onUpdate:modelValue": p[9] || (p[9] = (O) => me.value = O),
                          "input-id": s(Ne) + "-acknowledge",
                          binary: "",
                          disabled: W.value
                        }, null, 8, ["modelValue", "input-id", "disabled"]),
                        a("label", {
                          for: s(Ne) + "-acknowledge"
                        }, "I understand the effects of these removals", 8, Od)
                      ])) : v("", !0)
                    ])) : v("", !0),
                    a("footer", Id, [
                      f(s(J), {
                        type: "button",
                        label: "Back to editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: W.value,
                        onClick: ge
                      }, null, 8, ["disabled"]),
                      Q.value?.access.admin && ne.value.class !== "refused" ? (e(), I(s(J), {
                        key: 0,
                        disabled: !$e.value || W.value || !R.value,
                        loading: W.value,
                        onClick: sl
                      }, {
                        default: w(() => [
                          K(C(b.value === "Form layout" ? "Apply layout" : "Apply changes"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled", "loading"])) : v("", !0)
                    ])
                  ], 8, gd)) : v("", !0)
                ]),
                _: 1
              }, 8, ["visible", "busy"])
            ])
          ], 8, Zo)
        ])
      ])
    ], 2));
  }
}), Pd = /* @__PURE__ */ ue({
  __name: "SettingsApp",
  setup(l) {
    const k = vl(), t = fl(), r = H(), c = D(() => k.value.catalogId ?? ""), u = Je();
    async function b() {
      const x = u.begin(), j = c.value;
      try {
        const F = await pe.catalogSummary(j);
        u.current(x) && (r.value = F);
      } catch {
        u.current(x) && (r.value = void 0);
      }
    }
    ve(c, () => {
      r.value = void 0, b();
    }), ua(b), Ye(() => {
      u.begin();
    });
    function m() {
      k.value.embedded ? t("open-catalog-picker", {}) : t("navigate", { route: "" });
    }
    return (x, j) => c.value ? (e(), I(Td, {
      key: c.value,
      "catalog-id": c.value,
      title: r.value?.title || "Catalog",
      catalog: r.value,
      embedded: s(k).embedded,
      "focus-back": s(k).focusBack,
      "back-label": s(k).embedded ? "Back to catalogs" : "Back to catalog settings",
      onBack: m,
      onDirtyChanged: j[0] || (j[0] = (F) => s(t)("dirty-changed", { dirty: F }))
    }, null, 8, ["catalog-id", "title", "catalog", "embedded", "focus-back", "back-label"])) : v("", !0);
  }
});
class qd extends bl {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "catalog-id": { type: "string", default: "" }, embedded: { type: "boolean", default: !1 }, "focus-back": { type: "boolean", default: !1 } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: yl
    };
  }
  static get vueConfig() {
    return { rootComponent: Pd, plugins: [gl] };
  }
}
Sl(import.meta.url, qd);
