import { e as et, a as ot, u as Ee, r as qe, p as ne, _ as dt, b as xe, g as rt, c as ut, d as ct, W as mt, s as pt, P as ft } from "./styles-CBm7GC_K.js";
import { defineComponent as te, ref as B, openBlock as l, createElementBlock as u, Fragment as F, createVNode as m, unref as a, withCtx as b, createTextVNode as q, createCommentVNode as S, createBlock as T, toDisplayString as _, computed as H, createElementVNode as e, renderList as G, withModifiers as oe, normalizeStyle as Pe, normalizeClass as be, useId as Me, watch as re, onUnmounted as Ie, resolveDynamicComponent as vt, renderSlot as ie, withKeys as Fe, provide as yt, inject as bt, useModel as gt, mergeModels as Ge, onMounted as He, nextTick as Ne } from "vue";
import J from "primevue/button";
import me from "primevue/message";
import { Icon as K } from "@iconify/vue";
import ae from "primevue/tag";
import ht from "primevue/tabs";
import kt from "primevue/tablist";
import $t from "primevue/tab";
import Je from "primevue/selectbutton";
import { on as tt, host as wt, loadByTagName as _t, define as xt } from "@wippy-fe/proxy";
import Ue from "primevue/inputtext";
import Ct from "primevue/multiselect";
import Oe from "primevue/toggleswitch";
import ue from "primevue/select";
import Vt from "primevue/inputnumber";
import Ut from "primevue/textarea";
const St = ["config"], At = /* @__PURE__ */ te({
  __name: "CatalogShare",
  props: {
    catalogId: {},
    title: {}
  },
  setup(t) {
    const g = t, n = B(!1), r = B(!1), d = B("");
    async function f() {
      r.value = !0, d.value = "", await et("kickside-share") ? n.value = !0 : d.value = "Could not open sharing. Try Share again.", r.value = !1;
    }
    return (p, $) => (l(), u(F, null, [
      m(a(J), {
        type: "button",
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: r.value,
        onClick: f
      }, {
        default: b(() => [...$[1] || ($[1] = [
          q("Share", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      n.value ? (l(), u("kickside-share", {
        key: 0,
        config: JSON.stringify({ resource_id: g.catalogId, title: g.title, access_url: `/api/v1/component-access/grants/${encodeURIComponent(g.catalogId)}`, share_url: `/api/v1/component-access/share/${encodeURIComponent(g.catalogId)}` }),
        onClose: $[0] || ($[0] = (c) => n.value = !1)
      }, null, 40, St)) : S("", !0),
      d.value ? (l(), T(a(me), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: b(() => [
          q(_(d.value), 1)
        ]),
        _: 1
      })) : S("", !0)
    ], 64));
  }
});
function Ot(t, g, n = {}) {
  const r = JSON.stringify(t), d = JSON.stringify(n);
  return {
    declaration: JSON.parse(r),
    generation: g,
    pluginConfigs: JSON.parse(d),
    matches: (f, p, $ = {}) => g === p && r === JSON.stringify(f) && d === JSON.stringify($)
  };
}
function Ye(t, g) {
  const n = {};
  for (const [r, d] of Object.entries(g)) {
    const f = d.filter((p) => r === "plugins" ? !t.plugins?.some(($) => $.use === p) : r === "scopes" ? !t.scopes?.includes(p) : r === "attributes" ? !t.aspects?.some(($) => $.attributes?.some((c) => $.namespace + "." + c.code === p)) : r === "aspects" ? !t.aspects?.some(($) => $.namespace === p) : r === "dimensions" ? !t.dimensions?.some(($) => $.name === p) : r === "vocabularies" || r === "families" ? !t[r]?.some(($) => $.code === p) : !t[r]?.some(($) => $.id === p));
    f.length && (n[r] = f);
  }
  return n;
}
const Ze = (t) => !!t && typeof t == "object" && !Array.isArray(t), X = ["string"], lt = { "*": "string" }, It = { id: "number", code: "string!", type: "string!", scope: X, cardinality: "string", index: "string", index_contexts: [lt], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, Tt = {
  dimensions: [{ name: "string!", members: X, fallback: { "*": X } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: X }, attributes: [It] }],
  families: [{ code: "string!", aspects: X, variation: [{ axes: X, own: X }], requirements: [{ id: "string!", context: lt, require: X, authored: X }], checks: [{ check: "string!", reads: X, cost: "string", config: "object", enforce: "string" }] }],
  sources: [{ id: "string!", ordering: "string", writes: X, principals: X, audit: "boolean" }],
  channels: [{ id: "string!", requirements: X, families: X }],
  plugins: [{ use: "string!", schema: "json" }],
  scopes: X,
  policy: { "*": "policy" },
  remove: { dimensions: X, vocabularies: X, aspects: X, families: X, sources: X, channels: X, attributes: X, scopes: X, plugins: X }
};
function ze(t, g, n) {
  if (typeof g == "string") {
    const r = g.replace("!", "");
    if (!(r === "json" || (r === "object" ? Ze(t) : r === "policy" ? t === !1 || typeof t == "string" || typeof t == "number" : typeof t === r)) || g.endsWith("!") && (typeof t != "string" || !t.trim())) throw new Error(`${n} has an invalid ${r} value.`);
  } else if (Array.isArray(g)) {
    if (!Array.isArray(t)) throw new Error(`${n} must be an array.`);
    t.forEach((r, d) => ze(r, g[0], `${n}[${d}]`));
  } else {
    if (!Ze(t)) throw new Error(`${n} must be an object.`);
    for (const [r, d] of Object.entries(g)) if (typeof d == "string" && d.endsWith("!") && t[r] === void 0) throw new Error(`${n}.${r} is required.`);
    for (const [r, d] of Object.entries(t)) {
      const f = g[r] ?? g["*"];
      if (!f) throw new Error(`${n}.${r} is not an editor field.`);
      ze(d, f, `${n}.${r}`);
    }
  }
}
function jt(t) {
  const g = JSON.parse(t);
  ze(g, Tt, "Declaration");
  const n = g;
  for (const r of n.dimensions ?? []) r.members ??= [];
  return n;
}
function je(t) {
  return JSON.parse(JSON.stringify(t));
}
const Rt = /^[a-z][a-z0-9_]*$/;
function Ce(t, g, n) {
  n.length ? t[g] = n : delete t[g];
}
function he(t, g, n) {
  if (n < 0 || n >= t.length || g === n) return;
  const [r] = t.splice(g, 1);
  t.splice(n, 0, r);
}
function pe(t, g) {
  return !t || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(t) ? g : t;
}
async function at(t, g) {
  const n = [...new Set(g)].map((d) => ({ type: "user", id: d }));
  if (!n.length) return {};
  const r = await ot(`/api/v1/pim-admin/catalogs/${encodeURIComponent(t)}/principal_labels`, { refs: n }, "People");
  return Object.fromEntries((r.principals ?? []).map((d) => [d.id, pe(d.label, "Person")]));
}
const Re = [
  { value: "quarter", label: "¼", span: 3 },
  { value: "third", label: "⅓", span: 4 },
  { value: "half", label: "½", span: 6 },
  { value: "full", label: "1", span: 12 }
];
function Le(t, g, n) {
  return n.width ?? t.attributes[g + "." + n.code]?.width ?? "half";
}
const qt = (t) => new Date(t).toLocaleString();
function Be(t) {
  const g = Math.abs(t.m).toString(), n = t.m < 0 ? "-" : "";
  if (t.e >= 0) return n + g + "0".repeat(t.e);
  const r = -t.e, d = g.padStart(r + 1, "0");
  return n + d.slice(0, d.length - r) + "." + d.slice(d.length - r);
}
function W(t) {
  const n = (t.includes(".") ? t.slice(t.indexOf(".") + 1) : t).replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return n ? n[0].toUpperCase() + n.slice(1) : t;
}
function Ae(t) {
  return t.labels.en ?? Object.values(t.labels)[0] ?? t.code;
}
function Qe(t, g) {
  if (t == null) return "";
  const n = (r) => {
    if (r == null) return "";
    if (typeof r == "object" && "ref" in r) {
      const d = r;
      if (d.ref[0] === "term") {
        const f = d.ref[1].slice(d.ref[1].indexOf(":") + 1), p = d.ref[1].slice(0, d.ref[1].indexOf(":")), $ = g?.[p]?.find((c) => c.code === f);
        return $ ? Ae($) : f;
      }
      return "Linked " + W(d.ref[0]).toLocaleLowerCase();
    }
    if (typeof r == "object" && "v" in r) {
      const d = r;
      return Be(d.v) + " " + d.u;
    }
    return typeof r == "object" && "m" in r ? Be(r) : typeof r == "boolean" ? r ? "Yes" : "No" : typeof r == "object" ? JSON.stringify(r) : pe(String(r), "Linked record");
  };
  return Array.isArray(t) ? t.map(n).join(", ") : n(t);
}
function Dt(t, g, n) {
  const r = Qe(g), d = Qe(n);
  return !d && r ? `${t} cleared (was ${r})` : r ? `${t}: ${r} → ${d}` : `${t} set to ${d}`;
}
const Nt = { class: "pim-table form pim-layout" }, Pt = {
  key: 0,
  class: "kx-empty"
}, zt = { class: "pim-aspect-head" }, Lt = ["draggable", "onDragstart", "onDragover", "onDrop"], Bt = { class: "pim-lcard-top" }, Et = {
  class: "pim-grip",
  "aria-hidden": "true"
}, Mt = { class: "pim-lcard-name" }, Ft = { class: "pim-lcard-type" }, Ht = { class: "pim-lcard-move" }, Jt = { class: "pim-aspect-head" }, Wt = { class: "pim-canvas" }, Kt = { class: "pim-lcard-top" }, Gt = { class: "pim-lcard-name" }, Yt = { class: "pim-lcard-type" }, Zt = /* @__PURE__ */ te({
  __name: "LayoutEditor",
  props: {
    draft: {},
    schema: {}
  },
  setup(t) {
    const g = t, n = H(() => g.draft?.aspects ?? []), r = H(() => {
      if (!g.schema) return [];
      const y = new Set((g.draft?.aspects ?? []).map((s) => s.namespace)), i = /* @__PURE__ */ new Map();
      for (const [s, o] of Object.entries(g.schema.attributes)) {
        const v = s.split(".")[0];
        y.has(v) || !o.plugin || (i.has(v) || i.set(v, { aspect: v, plugin: o.plugin, codes: [] }), i.get(v).codes.push(s));
      }
      return [...i.values()];
    });
    function d(y, i) {
      return Re.find((s) => s.value === Le(g.schema, y, i))?.span ?? 6;
    }
    const f = B(null), p = B(null);
    function $(y, i, s) {
      f.value = { ns: y, index: i }, s.dataTransfer?.setData("text/plain", y + ":" + i), s.dataTransfer && (s.dataTransfer.effectAllowed = "move");
    }
    function c(y, i, s) {
      !f.value || f.value.ns !== y || (s.preventDefault(), p.value = { ns: y, index: i });
    }
    function O(y, i) {
      f.value && f.value.ns === y.namespace && he(y.attributes ?? [], f.value.index, i), f.value = null, p.value = null;
    }
    function j() {
      f.value = null, p.value = null;
    }
    function C(y, i) {
      const o = g.schema?.attributes[y + "." + i.code]?.type ?? i.type;
      return o.includes(":") ? o.slice(o.indexOf(":") + 1).replace(/_/g, " ") : o;
    }
    return (y, i) => (l(), u("div", Nt, [
      i[3] || (i[3] = e("p", { class: "pim-layout-help muted" }, "Arrange fields within each group and choose their widths. Review changes before applying the layout.", -1)),
      n.value.length === 0 ? (l(), u("div", Pt, "This catalog has no field groups yet. Add a field group in Fields.")) : S("", !0),
      (l(!0), u(F, null, G(n.value, (s) => (l(), u("section", {
        key: s.namespace,
        class: "pim-aspect"
      }, [
        e("header", zt, [
          e("h3", null, _(a(W)(s.namespace)), 1),
          i[1] || (i[1] = e("span", { class: "muted small" }, "drag a field, or use its arrows", -1))
        ]),
        e("div", {
          class: "pim-canvas",
          onDragover: i[0] || (i[0] = oe(() => {
          }, ["prevent"]))
        }, [
          (l(!0), u(F, null, G(s.attributes ?? [], (o, v) => (l(), u("div", {
            key: o.code,
            class: be(["pim-lcard", { dragging: f.value?.ns === s.namespace && f.value?.index === v, over: p.value?.ns === s.namespace && p.value?.index === v }]),
            style: Pe({ gridColumn: "span " + d(s.namespace, o) }),
            draggable: t.schema.access.admin,
            onDragstart: (M) => $(s.namespace, v, M),
            onDragover: (M) => c(s.namespace, v, M),
            onDrop: oe((M) => O(s, v), ["prevent"]),
            onDragend: j
          }, [
            e("div", Bt, [
              e("span", Et, [
                m(a(K), { icon: "tabler:grip-vertical" })
              ]),
              e("span", Mt, _(a(W)(o.code)), 1),
              e("span", Ft, _(C(s.namespace, o)), 1),
              e("span", Ht, [
                m(a(J), {
                  type: "button",
                  disabled: v === 0,
                  "aria-label": "Move " + a(W)(o.code) + " earlier",
                  onClick: (M) => a(he)(s.attributes ?? [], v, v - 1),
                  class: "arrow",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: b(() => [
                    m(a(K), { icon: "tabler:arrow-left" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                m(a(J), {
                  type: "button",
                  disabled: v === (s.attributes ?? []).length - 1,
                  "aria-label": "Move " + a(W)(o.code) + " later",
                  onClick: (M) => a(he)(s.attributes ?? [], v, v + 1),
                  class: "arrow",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: b(() => [
                    m(a(K), { icon: "tabler:arrow-right" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ])
            ]),
            m(a(Je), {
              "model-value": a(Le)(t.schema, s.namespace, o),
              options: a(Re),
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Width of " + a(W)(o.code),
              "onUpdate:modelValue": (M) => o.width = M
            }, null, 8, ["model-value", "options", "aria-label", "onUpdate:modelValue"])
          ], 46, Lt))), 128))
        ], 32)
      ]))), 128)),
      (l(!0), u(F, null, G(r.value, (s) => (l(), u("section", {
        key: s.aspect,
        class: "pim-aspect"
      }, [
        e("header", Jt, [
          e("h3", null, _(a(W)(s.aspect)), 1),
          i[2] || (i[2] = e("span", { class: "muted small" }, "Provided by a plugin", -1))
        ]),
        e("div", Wt, [
          (l(!0), u(F, null, G(s.codes, (o) => (l(), u("div", {
            key: o,
            class: "pim-lcard fixed",
            style: Pe({ gridColumn: "span " + (a(Re).find((v) => v.value === t.schema.attributes[o].width)?.span ?? 6) })
          }, [
            e("div", Kt, [
              e("span", Gt, _(a(W)(o)), 1),
              e("span", Yt, _(t.schema.attributes[o].type.replace("kickside.pim.types:", "").replace(/_/g, " ")), 1)
            ])
          ], 4))), 128))
        ])
      ]))), 128))
    ]));
  }
}), Qt = {
  class: "pim-history",
  "aria-label": "Catalog history"
}, Xt = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, el = { class: "pim-table pim-responsive-table" }, tl = ["id"], ll = ["aria-labelledby"], al = { class: "muted small" }, sl = ["datetime"], nl = { class: "small" }, il = {
  key: 0,
  class: "muted"
}, ol = { class: "mono small" }, dl = {
  key: 0,
  class: "muted"
}, rl = ["aria-labelledby"], ul = { class: "pim-stacked-meta muted small" }, cl = ["datetime"], ml = {
  key: 1,
  class: "kx-empty"
}, pl = { class: "pim-table-foot" }, fl = /* @__PURE__ */ te({
  __name: "HistoryPanel",
  props: {
    catalogId: {}
  },
  setup(t) {
    const g = t, n = B([]), r = B({}), d = B(), f = B(!1), p = B(""), $ = qe(), c = Me(), O = H(() => n.value.map((s) => ({
      key: `${s.seq}:${s.n}`,
      at: s.at,
      date: qt(s.at),
      actor: r.value[s.actor] ?? pe(s.actor, "Person"),
      source: s.source,
      product: C(s),
      context: s.ctx,
      change: y(s)
    })));
    async function j(s = !1) {
      const o = $.begin();
      f.value = !0, p.value = "";
      try {
        const v = await ne.history(g.catalogId, { limit: 50, before: s ? d.value : void 0 });
        if (!$.current(o)) return;
        n.value = s ? [...n.value, ...v.entries] : v.entries, d.value = v.next;
        try {
          const M = await at(g.catalogId, v.entries.map((Z) => Z.actor));
          $.current(o) && (r.value = { ...r.value, ...M });
        } catch {
        }
      } catch (v) {
        if (!$.current(o)) return;
        p.value = v instanceof Error ? v.message : "Could not load the history.";
      } finally {
        $.current(o) && (f.value = !1);
      }
    }
    function C(s) {
      return s.sku ? s.sku : s.subject.startsWith("p:") ? "purged product" : s.subject.startsWith("t:") ? s.subject.slice(2) : s.subject.startsWith("r:") ? "Release" : pe(s.subject, "Catalog");
    }
    function y(s) {
      if (s.attribute)
        return Dt(W(s.attribute), s.before, s.after);
      switch (s.kind) {
        case "schema":
          return "Schema generation " + String(s.after?.generation ?? "");
        case "term": {
          const o = s.after ?? {}, v = o.labels?.en ?? Object.values(o.labels ?? {})[0];
          return o.retired ? "Term retired" : v ? `Term labelled "${v}"` + (o.parent ? ` under ${o.parent}` : "") : "Term changed";
        }
        case "created": {
          const o = s.after ?? {};
          return `Created as ${W(o.family ?? "product")}` + (o.level ? ` at level ${o.level}` : "");
        }
        case "released": {
          const o = s.after ?? {};
          return `Released v${o.version ?? ""} to ${(o.channels ?? []).join(", ")}`;
        }
        case "withdrawn":
          return `Withdrawn from ${((s.after ?? {}).channels ?? []).join(", ")}`;
        case "status":
          return `Status ${String(s.before ?? "")} → ${String(s.after ?? "")}`;
        case "moved":
          return "Moved under another parent";
        default:
          return W(s.kind);
      }
    }
    let i = () => {
    };
    return re(() => g.catalogId, () => {
      i(), $.begin(), n.value = [], r.value = {}, d.value = void 0, p.value = "", i = tt(`component.${g.catalogId}`, () => {
        j();
      });
    }, { immediate: !0 }), re(() => g.catalogId, () => {
      j();
    }), Ee(() => j()), Ie(() => {
      i(), $.begin();
    }), (s, o) => (l(), u("section", Qt, [
      p.value ? (l(), T(a(me), {
        key: 0,
        severity: "error",
        role: "alert"
      }, {
        default: b(() => [
          q(_(p.value) + " ", 1),
          m(a(J), {
            severity: "secondary",
            outlined: "",
            disabled: f.value,
            onClick: o[0] || (o[0] = (v) => j())
          }, {
            default: b(() => [...o[2] || (o[2] = [
              q("Retry", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ]),
        _: 1
      })) : S("", !0),
      f.value ? (l(), u("div", Xt, "Loading history…")) : S("", !0),
      e("div", el, [
        e("p", {
          id: a(c),
          class: "pim-history-caption muted small"
        }, "Catalog changes, newest first", 8, tl),
        O.value.length ? (l(), u(F, { key: 0 }, [
          e("table", {
            class: "pim-grid",
            "aria-labelledby": a(c)
          }, [
            o[3] || (o[3] = e("thead", null, [
              e("tr", null, [
                e("th", { scope: "col" }, "When"),
                e("th", { scope: "col" }, "Who"),
                e("th", { scope: "col" }, "What"),
                e("th", { scope: "col" }, "Change")
              ])
            ], -1)),
            e("tbody", null, [
              (l(!0), u(F, null, G(O.value, (v) => (l(), u("tr", {
                key: v.key
              }, [
                e("td", al, [
                  e("time", {
                    datetime: v.at
                  }, _(v.date), 9, sl)
                ]),
                e("td", nl, [
                  q(_(v.actor), 1),
                  v.source ? (l(), u("span", il, " via " + _(v.source), 1)) : S("", !0)
                ]),
                e("td", ol, [
                  q(_(v.product), 1),
                  v.context ? (l(), u("span", dl, " · " + _(v.context), 1)) : S("", !0)
                ]),
                e("td", null, _(v.change), 1)
              ]))), 128))
            ])
          ], 8, ll),
          e("ol", {
            role: "list",
            class: "pim-stacked-list",
            "aria-labelledby": a(c)
          }, [
            (l(!0), u(F, null, G(O.value, (v) => (l(), u("li", {
              key: v.key,
              class: "pim-stacked-row"
            }, [
              e("div", null, _(v.change), 1),
              e("div", ul, [
                e("span", null, [
                  e("span", null, _(v.actor), 1),
                  v.source ? (l(), u(F, { key: 0 }, [
                    q(" via " + _(v.source), 1)
                  ], 64)) : S("", !0)
                ]),
                e("time", {
                  datetime: v.at
                }, _(v.date), 9, cl),
                e("span", null, [
                  q(_(v.product), 1),
                  v.context ? (l(), u(F, { key: 0 }, [
                    q(" · " + _(v.context), 1)
                  ], 64)) : S("", !0)
                ])
              ])
            ]))), 128))
          ], 8, rl)
        ], 64)) : !f.value && !p.value ? (l(), u("div", ml, "Nothing recorded yet.")) : S("", !0),
        e("div", pl, [
          e("span", null, _(O.value.length) + " change" + _(O.value.length === 1 ? "" : "s") + " shown", 1),
          d.value ? (l(), T(a(J), {
            key: 0,
            type: "button",
            disabled: f.value,
            onClick: o[1] || (o[1] = (v) => j(!0)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: b(() => [
              m(a(K), {
                icon: "tabler:adjustments",
                "aria-hidden": "true"
              }),
              o[4] || (o[4] = q(" Load older", -1))
            ]),
            _: 1
          }, 8, ["disabled"])) : S("", !0)
        ])
      ])
    ]));
  }
}), Xe = /* @__PURE__ */ te({
  __name: "SettingsActions",
  props: {
    access: {},
    dirty: { type: Boolean },
    busy: { type: Boolean },
    valid: { type: Boolean },
    reviewed: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(t, { emit: g }) {
    const n = g;
    return (r, d) => t.access?.admin ? (l(), u(F, { key: 0 }, [
      t.dirty ? (l(), T(a(ae), {
        key: 0,
        severity: "warn",
        value: "Unsaved changes"
      })) : S("", !0),
      m(a(J), {
        severity: "secondary",
        outlined: "",
        disabled: !t.dirty || t.busy,
        onClick: d[0] || (d[0] = (f) => n("discard"))
      }, {
        default: b(() => [
          m(a(K), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          }),
          d[2] || (d[2] = q(" Discard", -1))
        ]),
        _: 1
      }, 8, ["disabled"]),
      t.reviewed ? S("", !0) : (l(), T(a(J), {
        key: 1,
        disabled: !t.dirty || t.busy || !t.valid,
        loading: t.busy,
        onClick: d[1] || (d[1] = (f) => n("review"))
      }, {
        default: b(() => [...d[3] || (d[3] = [
          q("Review changes", -1)
        ])]),
        _: 1
      }, 8, ["disabled", "loading"]))
    ], 64)) : S("", !0);
  }
}), vl = { class: "kx-head-icon" }, yl = { class: "kx-head-text" }, bl = { class: "pim-title-line" }, gl = ["title"], hl = { class: "kx-head-actions" }, kl = /* @__PURE__ */ te({
  __name: "PageHead",
  props: {
    title: {},
    subtitle: {},
    icon: {},
    backLabel: {},
    pane: { type: Boolean }
  },
  emits: ["back"],
  setup(t, { emit: g }) {
    const n = g;
    return (r, d) => (l(), u("header", {
      class: be(["kx-head", { "pim-panel-head": t.pane }])
    }, [
      t.backLabel ? (l(), T(a(J), {
        key: 0,
        type: "button",
        "aria-label": t.backLabel,
        onClick: d[0] || (d[0] = (f) => n("back")),
        text: "",
        severity: "secondary",
        size: "small"
      }, {
        default: b(() => [
          m(a(K), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label"])) : S("", !0),
      e("div", vl, [
        m(a(K), {
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      e("div", yl, [
        e("div", bl, [
          (l(), T(vt(t.pane ? "h2" : "h1"), { class: "kx-title" }, {
            default: b(() => [
              q(_(t.title), 1)
            ]),
            _: 1
          })),
          ie(r.$slots, "meta")
        ]),
        e("p", {
          class: "kx-head-sub",
          title: t.subtitle
        }, _(t.subtitle), 9, gl)
      ]),
      e("div", hl, [
        ie(r.$slots, "default")
      ])
    ], 2));
  }
}), $l = { class: "row pim-add-row" }, wl = ["id"], ke = /* @__PURE__ */ te({
  __name: "AddSchemaCode",
  props: {
    label: {},
    action: {},
    existing: {}
  },
  emits: ["add"],
  setup(t, { emit: g }) {
    const n = t, r = g, d = B(""), f = Me(), p = H(() => d.value.trim()), $ = H(() => p.value ? n.existing?.includes(p.value) ? "This code is already in use." : Rt.test(p.value) ? "" : "Start with a lowercase letter and use only lowercase letters, numbers or underscores." : ""), c = H(() => !!p.value && !$.value);
    function O() {
      c.value && (r("add", p.value), d.value = "");
    }
    return (j, C) => (l(), u("div", $l, [
      m(a(Ue), {
        modelValue: d.value,
        "onUpdate:modelValue": C[0] || (C[0] = (y) => d.value = y),
        type: "text",
        placeholder: t.label,
        "aria-label": t.label,
        invalid: !!$.value,
        "aria-describedby": $.value ? a(f) : void 0,
        class: "mono",
        onKeydown: Fe(oe(O, ["prevent"]), ["enter"])
      }, null, 8, ["modelValue", "placeholder", "aria-label", "invalid", "aria-describedby", "onKeydown"]),
      m(a(J), {
        type: "button",
        disabled: !c.value,
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: O
      }, {
        default: b(() => [
          m(a(K), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          q(" " + _(t.action), 1)
        ]),
        _: 1
      }, 8, ["disabled"]),
      ie(j.$slots, "default"),
      $.value ? (l(), u("p", {
        key: 0,
        id: a(f),
        role: "status",
        class: "pim-add-code-error small"
      }, _($.value), 9, wl)) : S("", !0)
    ]));
  }
}), st = Symbol("definitionColumns"), _l = { code: "Code", kind: "Kind", details: "Details", usage: "Used by" }, xl = {
  code: "minmax(120px, 1fr)",
  kind: "140px",
  details: "minmax(120px, 1.2fr)",
  usage: "120px"
}, Cl = {
  class: "pim-definition-scroll",
  tabindex: "0",
  "aria-label": "Definitions"
}, Vl = { class: "pim-definition-grid" }, Ul = {
  key: 0,
  class: "pim-definition-columns",
  "aria-hidden": "true"
}, $e = /* @__PURE__ */ te({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: { default: () => ["code"] }
  },
  setup(t) {
    const g = t;
    yt(st, H(() => g.columns));
    const n = H(() => ["48px", "minmax(160px, 1.4fr)", ...g.columns.map((r) => xl[r]), "80px"].join(" "));
    return (r, d) => (l(), u("section", {
      class: "form pim-definition-list",
      style: Pe({ "--pim-definition-columns": n.value })
    }, [
      ie(r.$slots, "head"),
      e("div", Cl, [
        e("div", Vl, [
          t.count > 3 ? (l(), u("div", Ul, [
            d[0] || (d[0] = e("span", null, null, -1)),
            d[1] || (d[1] = e("span", null, "Name", -1)),
            (l(!0), u(F, null, G(t.columns, (f) => (l(), u("span", {
              key: f,
              class: be("pim-definition-" + f)
            }, _(a(_l)[f]), 3))), 128)),
            d[2] || (d[2] = e("span", null, null, -1))
          ])) : S("", !0),
          ie(r.$slots, "default")
        ])
      ]),
      ie(r.$slots, "add")
    ], 4));
  }
}), Sl = { class: "pim-definition" }, Al = {
  class: "pim-definition-lead",
  "data-column": "lead"
}, Ol = {
  class: "pim-row-title",
  "data-column": "name"
}, Il = { class: "pim-definition-meta" }, Tl = ["data-column"], jl = {
  key: 0,
  class: "mono"
}, Rl = {
  class: "pim-definition-actions",
  "data-column": "actions"
}, ql = {
  key: 0,
  class: "pim-definition-body"
}, we = /* @__PURE__ */ te({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ Ge({
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
  emits: /* @__PURE__ */ Ge(["head-keydown", "head-drop", "head-dragover"], ["update:open"]),
  setup(t, { emit: g }) {
    const n = t, r = bt(st, H(() => [
      ...n.code ? ["code"] : [],
      ...n.kind ? ["kind"] : []
    ])), d = gt(t, "open"), f = g;
    return (p, $) => (l(), u("section", Sl, [
      e("header", {
        class: be(["pim-definition-head", t.headClass]),
        onKeydown: $[1] || ($[1] = (c) => f("head-keydown", c)),
        onDrop: $[2] || ($[2] = (c) => f("head-drop", c)),
        onDragover: $[3] || ($[3] = (c) => f("head-dragover", c))
      }, [
        m(dt, {
          class: be(["pim-definition-toggle", t.toggleClass]),
          "aria-expanded": d.value,
          onClick: $[0] || ($[0] = (c) => d.value = !d.value)
        }, {
          default: b(() => [
            e("span", Al, [
              ie(p.$slots, "handle"),
              m(a(K), {
                icon: d.value ? "tabler:chevron-down" : "tabler:chevron-right",
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ]),
            e("span", Ol, _(t.title), 1),
            e("span", Il, [
              (l(!0), u(F, null, G(a(r), (c) => (l(), u("span", {
                key: c,
                class: be("pim-definition-" + c),
                "data-column": c
              }, [
                c === "code" && t.code ? (l(), u("code", jl, _(t.code), 1)) : c === "kind" && t.kind ? (l(), T(a(ae), {
                  key: 1,
                  severity: "secondary",
                  value: t.kind
                }, null, 8, ["value"])) : c === "details" ? ie(p.$slots, "details", {}, void 0, void 0, 2) : c === "usage" ? ie(p.$slots, "usage", {}, () => [
                  q(_(t.usage), 1)
                ], void 0, 3) : S("", !0)
              ], 10, Tl))), 128))
            ])
          ]),
          _: 3
        }, 8, ["class", "aria-expanded"]),
        e("div", Rl, [
          ie(p.$slots, "actions")
        ])
      ], 34),
      d.value ? (l(), u("div", ql, [
        ie(p.$slots, "default")
      ])) : S("", !0)
    ]));
  }
}), Dl = { class: "pim-chips pim-picker-chips" }, ce = /* @__PURE__ */ te({
  __name: "ChipPicker",
  props: {
    modelValue: {},
    options: {},
    free: { type: Boolean },
    placeholder: {},
    disabled: { type: Boolean },
    dropdown: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: g }) {
    const n = t, r = g, d = B("");
    function f(j) {
      return n.modelValue.includes(j);
    }
    function p(j) {
      n.disabled || !j || r("update:modelValue", f(j) ? n.modelValue.filter((C) => C !== j) : [...n.modelValue, j]);
    }
    function $() {
      const j = d.value.trim();
      if (!j || f(j)) {
        d.value = "";
        return;
      }
      r("update:modelValue", [...n.modelValue, j]), d.value = "";
    }
    function c(j) {
      r("update:modelValue", n.modelValue.filter((C) => C !== j));
    }
    function O(j) {
      return n.options?.find((C) => C.value === j)?.label ?? j;
    }
    return (j, C) => (l(), u("div", Dl, [
      t.options && (t.dropdown || t.options.length > 10) ? (l(), u(F, { key: 0 }, [
        (l(!0), u(F, null, G(t.modelValue, (y) => (l(), u("span", {
          key: y,
          class: "row"
        }, [
          q(_(O(y)), 1),
          t.disabled ? S("", !0) : (l(), T(a(J), {
            key: 0,
            type: "button",
            "aria-label": "Remove " + O(y),
            onClick: (i) => c(y),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: b(() => [
              m(a(K), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"]))
        ]))), 128)),
        t.disabled ? S("", !0) : (l(), T(a(ue), {
          key: 0,
          "model-value": null,
          placeholder: t.placeholder ?? "Add…",
          "aria-label": t.placeholder ?? "Add",
          "onUpdate:modelValue": C[0] || (C[0] = (y) => p(y)),
          class: "pim-chip-entry",
          options: t.options.filter((y) => !f(y.value)).map((y) => ({ value: y.value, label: y.label ?? y.value })),
          "option-label": "label",
          "option-value": "value",
          appendTo: "self"
        }, null, 8, ["placeholder", "aria-label", "options"]))
      ], 64)) : t.options ? (l(), u(F, { key: 1 }, [
        m(a(Je), {
          "model-value": t.modelValue.filter((y) => t.options.some((i) => i.value === y)),
          options: t.options.map((y) => ({ value: y.value, label: y.label ?? y.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          disabled: t.disabled,
          "aria-label": t.placeholder ?? "Selected values",
          "onUpdate:modelValue": C[1] || (C[1] = (y) => r("update:modelValue", [...y, ...t.modelValue.filter((i) => !t.options.some((s) => s.value === i))]))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (l(!0), u(F, null, G(t.modelValue.filter((y) => !t.options.some((i) => i.value === y)), (y) => (l(), u("span", {
          key: y,
          class: "row"
        }, [
          q(_(O(y)), 1),
          t.disabled ? S("", !0) : (l(), T(a(J), {
            key: 0,
            type: "button",
            "aria-label": "Remove " + y,
            onClick: (i) => c(y),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: b(() => [
              m(a(K), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"]))
        ]))), 128))
      ], 64)) : (l(!0), u(F, { key: 2 }, G(t.modelValue, (y) => (l(), u("span", {
        key: y,
        class: "row"
      }, [
        q(_(y), 1),
        t.disabled ? S("", !0) : (l(), T(a(J), {
          key: 0,
          type: "button",
          "aria-label": "Remove " + y,
          onClick: (i) => c(y),
          size: "small",
          text: "",
          severity: "secondary"
        }, {
          default: b(() => [
            m(a(K), { icon: "tabler:x" })
          ]),
          _: 1
        }, 8, ["aria-label", "onClick"]))
      ]))), 128)),
      t.free && !t.disabled ? (l(), T(a(Ue), {
        key: 3,
        modelValue: d.value,
        "onUpdate:modelValue": C[2] || (C[2] = (y) => d.value = y),
        type: "text",
        placeholder: t.placeholder ?? "Add…",
        onKeydown: Fe(oe($, ["prevent"]), ["enter"]),
        onBlur: $,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "placeholder", "onKeydown"])) : S("", !0)
    ]));
  }
}), Nl = ["inert"], Pl = ["schema", "config"], zl = {
  key: 1,
  class: "muted small",
  role: "status"
}, We = /* @__PURE__ */ te({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: g }) {
    const n = t, r = g, d = B("pending");
    async function f() {
      d.value = "pending", d.value = await et("wc-schema-form") ? "ready" : "failed";
    }
    He(f);
    function p($) {
      const c = $.detail;
      c && typeof c == "object" && !Array.isArray(c) && r("update:modelValue", c);
    }
    return ($, c) => (l(), u("div", {
      inert: t.disabled || void 0
    }, [
      d.value === "ready" ? (l(), u("wc-schema-form", {
        key: 0,
        schema: JSON.stringify(n.schema),
        config: JSON.stringify(t.modelValue),
        onConfigChanged: p
      }, null, 40, Pl)) : d.value === "pending" ? (l(), u("span", zl, "Configuration form is loading.")) : (l(), T(a(me), {
        key: 2,
        role: "alert",
        severity: "error"
      }, {
        default: b(() => [
          c[2] || (c[2] = q("Configuration form could not be loaded. ", -1)),
          m(a(J), {
            type: "button",
            disabled: t.disabled,
            onClick: f,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: b(() => [...c[1] || (c[1] = [
              q("Retry", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ]),
        _: 1
      })),
      m(a(J), {
        type: "button",
        disabled: t.disabled,
        onClick: c[0] || (c[0] = (O) => r("update:modelValue", {})),
        severity: "secondary",
        outlined: "",
        size: "small"
      }, {
        default: b(() => [
          m(a(K), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          }),
          c[3] || (c[3] = q(" Reset overrides", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, Nl));
  }
}), Ll = /* @__PURE__ */ te({
  __name: "DefaultValue",
  props: {
    attribute: {},
    type: {}
  },
  emits: ["change"],
  setup(t, { emit: g }) {
    const n = t, r = g, d = H(() => {
      const c = n.type?.form;
      let O = { type: "string" };
      return c === "bool" ? O = { type: "boolean" } : c === "int" ? O = { type: "integer" } : c === "dec" ? O = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : c === "quantity" ? O = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(n.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : c === "record" ? O = { type: "object", additionalProperties: !0 } : c === "ref" && (O = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${n.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (n.attribute.cardinality ?? "one") !== "one" && (O = { type: "array", items: O, uniqueItems: n.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...O, title: "Default value" } } };
    });
    function f(c) {
      return c && typeof c == "object" && "m" in c && "e" in c ? Be(c) : c;
    }
    function p(c) {
      return n.type?.form === "dec" ? f(c) : n.type?.form === "quantity" && c && typeof c == "object" && "v" in c && "u" in c ? { value: f(c.v), unit: c.u } : c;
    }
    const $ = H(() => n.attribute.default === void 0 ? {} : { value: Array.isArray(n.attribute.default) ? n.attribute.default.map(p) : p(n.attribute.default) });
    return (c, O) => (l(), T(We, {
      schema: d.value,
      "model-value": $.value,
      "onUpdate:modelValue": O[0] || (O[0] = (j) => r("change", j.value))
    }, null, 8, ["schema", "model-value"]));
  }
}), Bl = { class: "pim-stack" }, El = { class: "pim-bsection-head" }, Ml = {
  key: 0,
  class: "mono muted small"
}, Fl = { class: "pim-source-permissions" }, Hl = ["for"], Jl = ["onDragstart"], Wl = { class: "pim-fields" }, Kl = { class: "pim-f pim-w-third" }, Gl = { class: "pim-f-label" }, Yl = {
  key: 0,
  class: "pim-f-note"
}, Zl = { class: "pim-f pim-w-third" }, Ql = { class: "pim-f pim-w-third" }, Xl = {
  key: 0,
  class: "pim-f pim-w-third"
}, ea = {
  key: 1,
  class: "pim-f pim-w-third"
}, ta = { class: "pim-f pim-w-third" }, la = { class: "pim-f pim-w-third" }, aa = { class: "pim-f pim-w-half" }, sa = { class: "pim-f pim-w-half" }, na = { class: "row" }, ia = {
  key: 2,
  class: "pim-f pim-w-full"
}, oa = { class: "pim-contexts" }, da = { class: "small muted" }, ra = { class: "pim-f pim-w-half" }, ua = {
  key: 3,
  class: "pim-f pim-w-full"
}, ca = { class: "row end" }, ma = { class: "form" }, pa = /* @__PURE__ */ te({
  __name: "BuilderFields",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove"],
  setup(t, { emit: g }) {
    const n = t, r = g, d = Re.map((x) => x.value), f = [{ value: "one", label: "Single value" }, { value: "list", label: "Ordered list" }, { value: "set", label: "Unique set" }], p = H(() => n.draft.aspects ?? []), $ = H(() => (n.draft.dimensions ?? []).map((x) => ({ value: x.name, label: W(x.name) }))), c = H(() => (n.draft.vocabularies ?? []).map((x) => x.code)), O = H(() => (n.draft.sources ?? []).map((x) => ({ value: x.id, label: W(x.id) }))), j = H(() => [...n.options.types].sort((x, w) => x.form.localeCompare(w.form)).map((x) => ({ value: x.id, label: y(x) })));
    function C(x) {
      return n.options.types.find((w) => w.id === x.type);
    }
    function y(x) {
      return pe(x.title, "Field type");
    }
    function i(x) {
      return C(x)?.target === "term";
    }
    function s(x) {
      const w = C(x);
      return !!w && w.form === "ref" && !w.target;
    }
    function o(x, w) {
      return w.id !== void 0 && n.schema.attributes[x + "." + w.code] !== void 0;
    }
    function v(x) {
      const w = (n.draft.families ?? []).filter((N) => N.aspects?.includes(x)).length;
      return w + (w === 1 ? " family" : " families");
    }
    const M = B({});
    function Z(x, w) {
      return x + "." + (w.id ?? w.code);
    }
    function Q(x, w) {
      x.type = w;
      const N = C(x);
      if (N && x.index && !N.indexes.includes(x.index) && delete x.index, i(x) || delete x.vocabulary, !s(x) && x.config && "target" in x.config) {
        const { target: V, ...le } = x.config;
        x.config = Object.keys(le).length ? le : void 0, x.config || delete x.config;
      }
    }
    function Y(x, w) {
      Object.keys(w).length ? x.config = w : delete x.config;
    }
    function D(x, w) {
      const N = { ...x.config ?? {} };
      w ? N.target = w : delete N.target, Y(x, N);
    }
    function R(x, w) {
      w.length ? x.scope = w : delete x.scope, w.length || delete x.index_contexts;
    }
    function A(x, w, N) {
      N === void 0 || N === "" || N === !1 && w !== "default" ? delete x[w] : x[w] = N;
    }
    function h(x) {
      return x.index_contexts ?? [];
    }
    function I(x) {
      return (n.draft.dimensions ?? []).find((w) => w.name === x)?.members ?? [];
    }
    function k(x) {
      const w = {};
      for (const V of x.scope ?? []) w[V] = I(V)[0] ?? "";
      (x.index_contexts ?? (x.index_contexts = [])).push(w);
    }
    const U = B(null);
    function ee(x, w) {
      U.value?.namespace === x.namespace && he(x.attributes ?? [], U.value.index, w), U.value = null;
    }
    function _e(x) {
      (n.draft.aspects ??= []).push({ namespace: x, attributes: [] });
    }
    function Se(x) {
      const w = p.value.indexOf(x);
      w >= 0 && p.value.splice(w, 1), n.schema.declaration.aspects?.some((N) => N.namespace === x.namespace) && r("remove", "aspects", x.namespace);
    }
    function De(x, w) {
      const N = n.options.types.find((le) => le.id === "kickside.pim.types:text") ?? n.options.types[0], V = { code: w, type: N?.id ?? "" };
      (x.attributes ??= []).push(V), M.value[Z(x.namespace, V)] = !0;
    }
    function de(x, w) {
      const N = x.attributes ?? [], V = N.indexOf(w);
      V >= 0 && N.splice(V, 1), o(x.namespace, w) && r("remove", "attributes", x.namespace + "." + w.code);
    }
    return (x, w) => (l(), u("div", Bl, [
      (l(!0), u(F, null, G(p.value, (N) => (l(), T($e, {
        key: N.namespace,
        count: N.attributes?.length ?? 0,
        columns: ["code", "kind", "details", "usage"]
      }, {
        head: b(() => [
          e("header", El, [
            e("div", null, [
              e("h3", null, [
                q(_(a(W)(N.namespace)), 1),
                a(W)(N.namespace).toLocaleLowerCase() !== N.namespace.toLocaleLowerCase() ? (l(), u("span", Ml, _(N.namespace), 1)) : S("", !0)
              ]),
              e("div", Fl, [
                e("label", {
                  for: "writers-" + N.namespace
                }, "Sources allowed to write", 8, Hl),
                m(a(Ct), {
                  "input-id": "writers-" + N.namespace,
                  "aria-label": "Sources allowed to write",
                  "model-value": N.write?.sources ?? [],
                  options: O.value,
                  "option-label": "label",
                  "option-value": "value",
                  placeholder: "Any source",
                  appendTo: "self",
                  "onUpdate:modelValue": (V) => N.write = { sources: V }
                }, null, 8, ["input-id", "model-value", "options", "onUpdate:modelValue"]),
                w[3] || (w[3] = e("span", { class: "small muted" }, "Leave empty to allow any source to write this field group.", -1))
              ])
            ]),
            m(a(J), {
              type: "button",
              onClick: (V) => Se(N),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: b(() => [
                m(a(K), { icon: "tabler:trash" }),
                w[4] || (w[4] = q(" Remove field group", -1))
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]),
        add: b(() => [
          m(ke, {
            label: "Field code",
            action: "Add field",
            existing: N.attributes?.map((V) => V.code),
            onAdd: (V) => De(N, V)
          }, null, 8, ["existing", "onAdd"])
        ]),
        default: b(() => [
          (l(!0), u(F, null, G(N.attributes ?? [], (V, le) => (l(), T(we, {
            key: Z(N.namespace, V),
            open: M.value[Z(N.namespace, V)],
            "onUpdate:open": (L) => M.value[Z(N.namespace, V)] = L,
            title: a(W)(V.code),
            code: N.namespace + "." + V.code,
            kind: C(V) ? y(C(V)) : "Unknown type",
            usage: v(N.namespace),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle",
            onHeadDragover: w[2] || (w[2] = oe(() => {
            }, ["prevent"])),
            onHeadDrop: oe((L) => ee(N, le), ["prevent"]),
            onHeadKeydown: [
              oe((L) => a(he)(N.attributes ?? [], le, le - 1), ["alt", "prevent"]),
              oe((L) => a(he)(N.attributes ?? [], le, le + 1), ["alt", "prevent"])
            ]
          }, {
            handle: b(() => [
              e("span", {
                class: "pim-grip",
                draggable: "true",
                "aria-hidden": "true",
                onClick: w[0] || (w[0] = oe(() => {
                }, ["stop"])),
                onDragstart: oe((L) => U.value = { namespace: N.namespace, index: le }, ["stop"]),
                onDragend: w[1] || (w[1] = (L) => U.value = null)
              }, [
                m(a(K), { icon: "tabler:grip-vertical" })
              ], 40, Jl)
            ]),
            details: b(() => [
              V.cardinality && V.cardinality !== "one" ? (l(), T(a(ae), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: b(() => [
                  q(_(f.find((L) => L.value === V.cardinality)?.label), 1)
                ]),
                _: 2
              }, 1024)) : S("", !0),
              V.scope?.length ? (l(), T(a(ae), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: b(() => [
                  q("per " + _(V.scope.join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : S("", !0),
              V.index && V.index !== "none" ? (l(), T(a(ae), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: b(() => [
                  q(_(V.index) + " index", 1)
                ]),
                _: 2
              }, 1024)) : S("", !0),
              V.unique ? (l(), T(a(ae), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: b(() => [...w[5] || (w[5] = [
                  q("unique", -1)
                ])]),
                _: 1
              })) : S("", !0)
            ]),
            actions: b(() => [
              m(a(J), {
                type: "button",
                disabled: le === 0,
                "aria-label": "Move " + V.code + " earlier",
                onClick: (L) => a(he)(N.attributes, le, le - 1),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: b(() => [
                  m(a(K), { icon: "tabler:arrow-up" })
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "onClick"]),
              m(a(J), {
                type: "button",
                disabled: le === (N.attributes?.length ?? 0) - 1,
                "aria-label": "Move " + V.code + " later",
                onClick: (L) => a(he)(N.attributes, le, le + 1),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: b(() => [
                  m(a(K), { icon: "tabler:arrow-down" })
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "onClick"])
            ]),
            default: b(() => [
              e("div", Wl, [
                e("div", Kl, [
                  e("div", Gl, [
                    w[6] || (w[6] = e("label", null, "Code", -1)),
                    o(N.namespace, V) ? (l(), u("span", Yl, "renames keep values")) : S("", !0)
                  ]),
                  m(a(Ue), {
                    type: "text",
                    value: V.code,
                    onInput: (L) => V.code = L.target.value,
                    class: "mono"
                  }, null, 8, ["value", "onInput"])
                ]),
                e("div", Zl, [
                  w[7] || (w[7] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Type")
                  ], -1)),
                  m(a(ue), {
                    "model-value": V.type,
                    options: j.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (L) => Q(V, L)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", Ql, [
                  w[8] || (w[8] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Values")
                  ], -1)),
                  m(a(ue), {
                    "model-value": V.cardinality ?? "one",
                    options: f,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (L) => A(V, "cardinality", L === "one" ? void 0 : L)
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                i(V) ? (l(), u("div", Xl, [
                  w[9] || (w[9] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Vocabulary")
                  ], -1)),
                  m(a(ue), {
                    "model-value": V.vocabulary ?? "",
                    "onUpdate:modelValue": (L) => A(V, "vocabulary", L),
                    options: [{ value: "", label: "Choose…" }, ...c.value.map((L) => ({ value: L, label: String(L) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ])) : S("", !0),
                s(V) ? (l(), u("div", ea, [
                  w[10] || (w[10] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Link kind"),
                    e("span", { class: "pim-f-note" }, "owned by a plugin")
                  ], -1)),
                  m(a(ue), {
                    "model-value": V.config?.target ?? "",
                    "onUpdate:modelValue": (L) => D(V, L),
                    options: [{ value: "", label: "Choose…" }, ...t.options.link_kinds.map((L) => ({ value: L.kind, label: a(pe)(L.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ])) : S("", !0),
                e("div", ta, [
                  w[11] || (w[11] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Index"),
                    e("span", { class: "pim-f-note" }, "for filters and keys")
                  ], -1)),
                  m(a(ue), {
                    "model-value": V.index ?? "none",
                    options: C(V)?.indexes ?? ["none"],
                    appendTo: "self",
                    "onUpdate:modelValue": (L) => A(V, "index", L === "none" ? void 0 : L)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", la, [
                  w[12] || (w[12] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Width"),
                    e("span", { class: "pim-f-note" }, "of a form row")
                  ], -1)),
                  m(a(Je), {
                    "model-value": a(Le)(t.schema, N.namespace, V),
                    options: a(d),
                    "allow-empty": !1,
                    "onUpdate:modelValue": (L) => V.width = L
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", aa, [
                  w[13] || (w[13] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Varies per"),
                    e("span", { class: "pim-f-note" }, "dimensions the value depends on")
                  ], -1)),
                  m(ce, {
                    "model-value": V.scope ?? [],
                    options: $.value,
                    "onUpdate:modelValue": (L) => R(V, L)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", sa, [
                  w[14] || (w[14] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Unique"),
                    e("span", { class: "pim-f-note" }, "one holder per value, catalog wide")
                  ], -1)),
                  e("label", na, [
                    m(a(Oe), {
                      "aria-label": "Unique " + V.code,
                      "model-value": V.unique === !0,
                      disabled: !!V.scope?.length || (V.cardinality ?? "one") !== "one",
                      "onUpdate:modelValue": (L) => A(V, "unique", L)
                    }, null, 8, ["aria-label", "model-value", "disabled", "onUpdate:modelValue"]),
                    e("span", null, _(V.unique ? "Yes" : "No"), 1)
                  ])
                ]),
                (V.scope?.length ?? 0) > 0 && V.index && V.index !== "none" ? (l(), u("div", ia, [
                  w[16] || (w[16] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Indexed contexts"),
                    e("span", { class: "pim-f-note" }, "which combinations get an index")
                  ], -1)),
                  e("div", oa, [
                    (l(!0), u(F, null, G(h(V), (L, Ve) => (l(), u("div", {
                      key: Ve,
                      class: "pim-context-row"
                    }, [
                      (l(!0), u(F, null, G(V.scope, (se) => (l(), u("label", {
                        key: se,
                        class: "pim-context-field"
                      }, [
                        e("span", da, _(a(W)(se)), 1),
                        m(a(ue), {
                          "model-value": L[se] ?? "",
                          options: I(se),
                          class: "narrow",
                          appendTo: "self",
                          "onUpdate:modelValue": (E) => L[se] = E
                        }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                      ]))), 128)),
                      m(a(J), {
                        type: "button",
                        "aria-label": "Remove context",
                        onClick: (se) => h(V).splice(Ve, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: b(() => [
                          m(a(K), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ]))), 128)),
                    m(a(J), {
                      type: "button",
                      onClick: (L) => k(V),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: b(() => [
                        m(a(K), {
                          icon: "tabler:plus",
                          "aria-hidden": "true"
                        }),
                        w[15] || (w[15] = q(" Add context", -1))
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ])
                ])) : S("", !0),
                e("div", ra, [
                  w[17] || (w[17] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Default"),
                    e("span", { class: "pim-f-note" }, "when no value is set")
                  ], -1)),
                  m(Ll, {
                    attribute: V,
                    type: C(V),
                    onChange: (L) => A(V, "default", L)
                  }, null, 8, ["attribute", "type", "onChange"])
                ]),
                C(V)?.config_schema ? (l(), u("div", ua, [
                  w[18] || (w[18] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Type configuration")
                  ], -1)),
                  m(We, {
                    schema: C(V).config_schema,
                    "model-value": V.config ?? {},
                    "onUpdate:modelValue": (L) => Y(V, L)
                  }, null, 8, ["schema", "model-value", "onUpdate:modelValue"])
                ])) : S("", !0)
              ]),
              e("div", ca, [
                m(a(J), {
                  type: "button",
                  onClick: (L) => de(N, V),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: b(() => [
                    m(a(K), { icon: "tabler:trash" }),
                    w[19] || (w[19] = q(" Remove field", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ]),
            _: 2
          }, 1032, ["open", "onUpdate:open", "title", "code", "kind", "usage", "onHeadDrop", "onHeadKeydown"]))), 128))
        ]),
        _: 2
      }, 1032, ["count"]))), 128)),
      e("section", ma, [
        m(ke, {
          class: "pim-aspect",
          label: "Field group code",
          action: "Add field group",
          existing: p.value.map((N) => N.namespace),
          onAdd: _e
        }, null, 8, ["existing"])
      ])
    ]));
  }
}), fa = { class: "muted small" }, va = { class: "pim-aspect" }, ya = {
  key: 0,
  class: "small muted"
}, ba = { class: "pim-fields" }, ga = { class: "pim-f pim-w-full" }, ha = { class: "pim-f-label" }, ka = /* @__PURE__ */ te({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: g }) {
    const n = t, r = g, d = H(() => n.draft.dimensions ?? []);
    function f(C) {
      (n.draft.dimensions ??= []).push({ name: C, members: [] });
    }
    function p(C) {
      const y = [];
      for (const i of n.draft.aspects ?? []) for (const s of i.attributes ?? []) s.scope?.includes(C.name) && y.push(i.namespace + "." + s.code);
      for (const i of n.draft.families ?? []) for (const s of i.requirements ?? []) s.context && C.name in s.context && y.push(i.code + " requirement " + s.id);
      return y;
    }
    function $(C) {
      p(C).length || (d.value.splice(d.value.indexOf(C), 1), n.schema.declaration.dimensions?.some((y) => y.name === C.name) && r("remove", "dimensions", C.name));
    }
    function c(C, y) {
      if (C.members = y, C.fallback)
        for (const i of Object.keys(C.fallback)) y.includes(i) || delete C.fallback[i];
    }
    function O(C, y) {
      return C.fallback?.[y] ?? [];
    }
    function j(C, y, i) {
      const s = { ...C.fallback ?? {} };
      i.length ? s[y] = i : delete s[y], Object.keys(s).length ? C.fallback = s : delete C.fallback;
    }
    return (C, y) => (l(), T($e, {
      count: d.value.length,
      columns: ["code", "details", "usage"]
    }, {
      add: b(() => [
        m(ke, {
          label: "Dimension code",
          action: "Add dimension",
          existing: d.value.map((i) => i.name),
          onAdd: f
        }, {
          default: b(() => [...y[2] || (y[2] = [
            e("span", { class: "muted small" }, "A dimension lets a value differ per member, with fallbacks between members.", -1)
          ])]),
          _: 1
        }, 8, ["existing"])
      ]),
      default: b(() => [
        (l(!0), u(F, null, G(d.value, (i) => (l(), T(we, {
          title: a(W)(i.name),
          code: i.name,
          key: i.name,
          usage: p(i).length + (p(i).length === 1 ? " dependency" : " dependencies")
        }, {
          details: b(() => [
            e("span", fa, _(i.members.length) + " " + _(i.members.length === 1 ? "member" : "members"), 1)
          ]),
          actions: b(() => [
            m(a(J), {
              type: "button",
              disabled: p(i).length > 0,
              "aria-label": "Remove " + a(W)(i.name),
              title: p(i).length ? "Take the dimension off these first" : "",
              onClick: (s) => $(i),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: b(() => [
                m(a(K), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "title", "onClick"])
          ]),
          default: b(() => [
            e("div", va, [
              p(i).length ? (l(), u("p", ya, "Used by " + _(p(i).join(", ")), 1)) : S("", !0),
              e("div", ba, [
                e("div", ga, [
                  y[0] || (y[0] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Members"),
                    e("span", { class: "pim-f-note" }, "the values this dimension takes")
                  ], -1)),
                  m(ce, {
                    "model-value": i.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (s) => c(i, s)
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                (l(!0), u(F, null, G(i.members, (s) => (l(), u("div", {
                  key: s,
                  class: "pim-f pim-w-half"
                }, [
                  e("div", ha, [
                    e("label", null, _(s) + " falls back to", 1),
                    y[1] || (y[1] = e("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  m(ce, {
                    "model-value": O(i, s),
                    options: i.members.filter((o) => o !== s).map((o) => ({ value: o })),
                    "onUpdate:modelValue": (o) => j(i, s, o)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]))), 128))
              ])
            ])
          ]),
          _: 2
        }, 1032, ["title", "code", "usage"]))), 128))
      ]),
      _: 1
    }, 8, ["count"]));
  }
}), $a = { class: "muted small" }, wa = { class: "pim-aspect" }, _a = { class: "row small" }, xa = {
  key: 1,
  class: "muted small"
}, Ca = {
  key: 2,
  class: "pim-stack tight pim-terms"
}, Va = { class: "pim-error-copy" }, Ua = {
  key: 0,
  class: "pim-error-code"
}, Sa = {
  key: 1,
  class: "pim-responsive-table"
}, Aa = {
  class: "pim-grid compact",
  "aria-label": "Vocabulary terms"
}, Oa = { key: 0 }, Ia = { class: "mono" }, Ta = {
  key: 0,
  class: "mono muted"
}, ja = { class: "num" }, Ra = {
  role: "list",
  class: "pim-stacked-list",
  "aria-label": "Vocabulary terms"
}, qa = { class: "pim-stacked-meta muted small" }, Da = { class: "mono" }, Na = { key: 0 }, Pa = {
  key: 2,
  class: "muted small"
}, za = { class: "row wrap" }, La = { class: "row wrap pim-add-row" }, Ba = /* @__PURE__ */ te({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: g }) {
    const n = t, r = g, d = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/, f = H(() => n.schema.access.write), p = H(() => n.draft.vocabularies ?? []);
    function $(h) {
      (n.draft.vocabularies ??= []).push({ code: h });
    }
    function c(h) {
      p.value.splice(p.value.indexOf(h), 1), n.schema.declaration.vocabularies?.some((I) => I.code === h.code) && r("remove", "vocabularies", h.code);
    }
    function O(h) {
      return !!n.schema.vocabularies[h];
    }
    const j = B({}), C = B({}), y = B({}), i = B({}), s = B({}), o = B({}), v = B({});
    async function M(h, I) {
      s.value[h] = !0, delete o.value[h];
      try {
        const k = await ne.termsPage(n.catalogId, h, I);
        C.value[h] = k.terms, i.value[h] = I, y.value[h] = k.next;
        const U = Q(h);
        k.terms.some((ee) => ee.retired && ee.code === U.parent) && (U.parent = "");
      } catch (k) {
        o.value[h] = [xe(k, "Could not load terms.")];
      } finally {
        s.value[h] = !1;
      }
    }
    function Z(h) {
      j.value[h] = !j.value[h], j.value[h] && !C.value[h] && M(h);
    }
    function Q(h) {
      return v.value[h] ?? (v.value[h] = { code: "", label: "", parent: "" });
    }
    function Y(h) {
      return [{ value: "", label: "No parent" }, ...(C.value[h] ?? []).filter((I) => !I.retired).map((I) => ({ value: I.code, label: Ae(I) }))];
    }
    function D(h, I, k) {
      o.value[h] = I?.findings?.length ? I.findings.map((U) => ({ message: U.message ?? k, code: U.code })) : [{ message: k }];
    }
    async function R(h) {
      const I = Q(h.code);
      if (!(!f.value || !d.test(I.code))) {
        s.value[h.code] = !0, delete o.value[h.code];
        try {
          const k = { term: { vocabulary: h.code, code: I.code }, labels: { en: I.label || W(I.code) } };
          h.hierarchical && I.parent && (k.parent = I.parent);
          const ee = (await ne.apply(n.catalogId, [k])).outcomes[0];
          if (ee?.outcome !== "created" && ee?.outcome !== "updated") {
            D(h.code, ee, "The term was not accepted.");
            return;
          }
          v.value[h.code] = { code: "", label: "", parent: "" }, ne.invalidateTerms(n.catalogId), await M(h.code, i.value[h.code]);
        } catch (k) {
          o.value[h.code] = [xe(k, "Could not add the term.")];
        } finally {
          s.value[h.code] = !1;
        }
      }
    }
    async function A(h, I, k) {
      if (f.value && !(k && !await wt.confirm({ header: "Retire term?", message: `Retire ${Ae(I)}? Term changes save immediately. You can restore this term later.`, acceptLabel: "Retire", rejectLabel: "Cancel" }))) {
        s.value[h.code] = !0, delete o.value[h.code];
        try {
          const ee = (await ne.apply(n.catalogId, [{ term: { vocabulary: h.code, code: I.code }, retired: k }])).outcomes[0];
          if (!ee || !["updated", "unchanged"].includes(ee.outcome)) {
            D(h.code, ee, "The term change was not accepted.");
            return;
          }
          k && Q(h.code).parent === I.code && (Q(h.code).parent = ""), ne.invalidateTerms(n.catalogId), await M(h.code, i.value[h.code]);
        } catch (U) {
          o.value[h.code] = [xe(U, "Could not change the term.")];
        } finally {
          s.value[h.code] = !1;
        }
      }
    }
    return (h, I) => (l(), T($e, {
      count: p.value.length,
      columns: ["code", "details"]
    }, {
      add: b(() => [
        m(ke, {
          label: "Vocabulary code",
          action: "Add vocabulary",
          existing: p.value.map((k) => k.code),
          onAdd: $
        }, {
          default: b(() => [...I[10] || (I[10] = [
            e("span", { class: "muted small" }, "Select fields pick their values from a vocabulary's terms.", -1)
          ])]),
          _: 1
        }, 8, ["existing"])
      ]),
      default: b(() => [
        (l(!0), u(F, null, G(p.value, (k) => (l(), T(we, {
          title: a(W)(k.code),
          code: k.code,
          key: k.code
        }, {
          details: b(() => [
            e("span", $a, _(k.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: b(() => [
            m(a(J), {
              type: "button",
              "aria-label": "Remove " + a(W)(k.code),
              onClick: (U) => c(k),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: b(() => [
                m(a(K), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])
          ]),
          default: b(() => [
            e("div", wa, [
              e("label", _a, [
                m(a(Oe), {
                  "aria-label": "Hierarchical " + k.code,
                  "model-value": k.hierarchical === !0,
                  "onUpdate:modelValue": (U) => U ? k.hierarchical = !0 : delete k.hierarchical
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"]),
                I[0] || (I[0] = e("span", null, "Hierarchical", -1))
              ]),
              O(k.code) ? (l(), T(a(J), {
                key: 0,
                type: "button",
                onClick: (U) => Z(k.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: b(() => [
                  m(a(K), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  q(" " + _(j.value[k.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : (l(), u("span", xa, "Apply the schema before adding terms.")),
              j.value[k.code] ? (l(), u("div", Ca, [
                I[9] || (I[9] = e("p", { class: "muted small" }, "Term changes save immediately.", -1)),
                o.value[k.code] ? (l(), T(a(me), {
                  key: 0,
                  severity: "error",
                  role: "alert"
                }, {
                  default: b(() => [
                    e("div", Va, [
                      (l(!0), u(F, null, G(o.value[k.code], (U, ee) => (l(), u("div", { key: ee }, [
                        q(_(U.message) + " ", 1),
                        U.code ? (l(), u("span", Ua, [
                          I[1] || (I[1] = q("Code ", -1)),
                          e("code", null, _(U.code), 1)
                        ])) : S("", !0)
                      ]))), 128))
                    ]),
                    m(a(J), {
                      type: "button",
                      disabled: s.value[k.code],
                      onClick: (U) => M(k.code, i.value[k.code]),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: b(() => [...I[2] || (I[2] = [
                        q("Retry", -1)
                      ])]),
                      _: 1
                    }, 8, ["disabled", "onClick"])
                  ]),
                  _: 2
                }, 1024)) : S("", !0),
                (C.value[k.code] ?? []).length ? (l(), u("div", Sa, [
                  e("table", Aa, [
                    e("thead", null, [
                      e("tr", null, [
                        I[3] || (I[3] = e("th", null, "Code", -1)),
                        I[4] || (I[4] = e("th", null, "Label", -1)),
                        k.hierarchical ? (l(), u("th", Oa, "Parent")) : S("", !0),
                        I[5] || (I[5] = e("th", null, null, -1))
                      ])
                    ]),
                    e("tbody", null, [
                      (l(!0), u(F, null, G(C.value[k.code], (U) => (l(), u("tr", {
                        key: U.code,
                        class: be({ muted: U.retired })
                      }, [
                        e("td", Ia, _(U.code), 1),
                        e("td", null, [
                          q(_(a(Ae)(U)) + " ", 1),
                          U.retired ? (l(), T(a(ae), {
                            key: 0,
                            severity: "secondary",
                            value: "Retired"
                          })) : S("", !0)
                        ]),
                        k.hierarchical ? (l(), u("td", Ta, _(U.parent ?? ""), 1)) : S("", !0),
                        e("td", ja, [
                          m(a(J), {
                            type: "button",
                            disabled: !f.value || s.value[k.code],
                            onClick: (ee) => A(k, U, !U.retired),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: b(() => [
                              q(_(U.retired ? "Restore" : "Retire"), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled", "onClick"])
                        ])
                      ], 2))), 128))
                    ])
                  ]),
                  e("ul", Ra, [
                    (l(!0), u(F, null, G(C.value[k.code], (U) => (l(), u("li", {
                      key: U.code,
                      class: be(["pim-stacked-row", { muted: U.retired }])
                    }, [
                      e("div", null, [
                        q(_(a(Ae)(U)) + " ", 1),
                        U.retired ? (l(), T(a(ae), {
                          key: 0,
                          severity: "secondary",
                          value: "Retired"
                        })) : S("", !0)
                      ]),
                      e("div", qa, [
                        e("span", Da, _(U.code), 1),
                        k.hierarchical && U.parent ? (l(), u("span", Na, "Parent: " + _(U.parent), 1)) : S("", !0)
                      ]),
                      m(a(J), {
                        type: "button",
                        disabled: !f.value || s.value[k.code],
                        onClick: (ee) => A(k, U, !U.retired),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: b(() => [
                          q(_(U.retired ? "Restore" : "Retire"), 1)
                        ]),
                        _: 2
                      }, 1032, ["disabled", "onClick"])
                    ], 2))), 128))
                  ])
                ])) : s.value[k.code] ? S("", !0) : (l(), u("p", Pa, "No terms yet.")),
                e("div", za, [
                  m(a(J), {
                    type: "button",
                    disabled: s.value[k.code] || !i.value[k.code],
                    onClick: (U) => M(k.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: b(() => [
                      m(a(K), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      I[6] || (I[6] = q(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  m(a(J), {
                    type: "button",
                    disabled: s.value[k.code] || !y.value[k.code],
                    onClick: (U) => M(k.code, y.value[k.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: b(() => [
                      m(a(K), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      I[7] || (I[7] = q(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                e("div", La, [
                  m(a(Ue), {
                    modelValue: Q(k.code).code,
                    "onUpdate:modelValue": (U) => Q(k.code).code = U,
                    disabled: !f.value || s.value[k.code],
                    type: "text",
                    placeholder: "code",
                    class: "mono narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  m(a(Ue), {
                    modelValue: Q(k.code).label,
                    "onUpdate:modelValue": (U) => Q(k.code).label = U,
                    disabled: !f.value || s.value[k.code],
                    type: "text",
                    placeholder: "Label (en)"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  k.hierarchical ? (l(), T(a(ue), {
                    key: 0,
                    modelValue: Q(k.code).parent,
                    "onUpdate:modelValue": (U) => Q(k.code).parent = U,
                    disabled: !f.value || s.value[k.code],
                    class: "narrow",
                    "aria-label": "Parent term",
                    placeholder: "No parent",
                    options: Y(k.code),
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "options"])) : S("", !0),
                  m(a(J), {
                    type: "button",
                    disabled: !f.value || s.value[k.code] || !d.test(Q(k.code).code),
                    onClick: (U) => R(k),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: b(() => [
                      m(a(K), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      I[8] || (I[8] = q(" Add term", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])
              ])) : S("", !0)
            ])
          ]),
          _: 2
        }, 1032, ["title", "code"]))), 128))
      ]),
      _: 1
    }, 8, ["count"]));
  }
}), Ea = { class: "muted small" }, Ma = { class: "pim-aspect" }, Fa = { class: "pim-fields" }, Ha = { class: "pim-f pim-w-full" }, Ja = { class: "pim-aspect" }, Wa = { class: "pim-stack tight" }, Ka = { class: "pim-level-head" }, Ga = { class: "pim-fields" }, Ya = { class: "pim-f pim-w-half" }, Za = { class: "pim-f pim-w-half" }, Qa = { class: "pim-aspect" }, Xa = { class: "pim-stack tight" }, es = { class: "pim-level-head" }, ts = { class: "mono" }, ls = { class: "pim-fields" }, as = { class: "pim-f-label" }, ss = { class: "pim-f pim-w-half" }, ns = { class: "pim-f pim-w-half" }, is = /* @__PURE__ */ te({
  __name: "BuilderFamilies",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove"],
  setup(t, { emit: g }) {
    const n = t, r = g, d = H(() => (n.draft.families ?? []).filter((D) => D.code !== "generic")), f = H(() => {
      const D = new Set(n.draft.plugins?.map((R) => R.use));
      return Object.entries(n.schema.attributes).filter(([, R]) => R.plugin && D.has(R.plugin));
    }), p = H(() => {
      const D = (n.draft.aspects ?? []).map((A) => A.namespace), R = [...new Set(f.value.map(([A]) => A.split(".")[0]))];
      return [...D, ...R.filter((A) => !D.includes(A))].map((A) => ({ value: A, label: W(A) }));
    }), $ = H(() => new Map(n.options.types.map((D) => [D.id, D.form])));
    function c(D) {
      return `${W(D)} (${W(D.split(".")[0])})`;
    }
    const O = H(() => {
      const D = /* @__PURE__ */ new Map();
      function R(A, h, I = [], k = "one") {
        const U = !!h && h !== "text" && h !== "record" && I.length === 0 && k === "one";
        D.set(A, { value: A, label: c(A), canBeAxis: U });
      }
      for (const A of n.draft.aspects ?? [])
        for (const h of A.attributes ?? []) {
          const I = A.namespace + "." + h.code;
          R(I, $.value.get(h.type), h.scope, h.cardinality);
        }
      for (const [A, h] of f.value) R(A, h.form, h.scope, h.cardinality);
      return D;
    });
    function j(D) {
      return [...O.value.values()].filter((R) => D.aspects?.includes(R.value.split(".")[0]));
    }
    function C(D, R, A) {
      const h = R[A] ?? [], I = new Set(o(D).flatMap((U) => [...U.axes ?? [], ...U.own ?? []])), k = j(D).filter((U) => h.includes(U.value) || !I.has(U.value) && (A === "own" || U.canBeAxis));
      return [...k, ...h.filter((U) => !k.some((ee) => ee.value === U)).map((U) => ({ value: U, label: c(U) }))];
    }
    const y = H(() => n.draft.dimensions ?? []);
    function i(D) {
      (n.draft.families ??= []).push({ code: D, aspects: [] });
    }
    function s(D) {
      n.draft.families.splice(n.draft.families.indexOf(D), 1), n.schema.declaration.families?.some((R) => R.code === D.code) && r("remove", "families", D.code);
    }
    function o(D) {
      return D.variation ?? [];
    }
    function v(D) {
      (D.variation ??= []).push({ axes: [] });
    }
    function M(D) {
      return D.requirements ?? [];
    }
    function Z(D, R) {
      (D.requirements ??= []).push({ id: R, require: [] });
    }
    function Q(D, R) {
      return D.context?.[R] ?? "";
    }
    function Y(D, R, A) {
      const h = { ...D.context ?? {} };
      A ? h[R] = A : delete h[R], Object.keys(h).length ? D.context = h : delete D.context;
    }
    return (D, R) => (l(), T($e, {
      count: d.value.length,
      columns: ["code", "details"]
    }, {
      add: b(() => [
        m(ke, {
          label: "Family code",
          action: "Add family",
          existing: t.draft.families?.map((A) => A.code),
          onAdd: i
        }, {
          default: b(() => [...R[12] || (R[12] = [
            e("span", { class: "muted small" }, "Products without a family use the generic one.", -1)
          ])]),
          _: 1
        }, 8, ["existing"])
      ]),
      default: b(() => [
        (l(!0), u(F, null, G(d.value, (A) => (l(), T(we, {
          title: a(W)(A.code),
          code: A.code,
          key: A.code
        }, {
          details: b(() => [
            e("span", Ea, _(A.aspects?.length ?? 0) + " " + _(A.aspects?.length === 1 ? "field group" : "field groups"), 1)
          ]),
          actions: b(() => [
            m(a(J), {
              type: "button",
              onClick: (h) => s(A),
              "aria-label": "Remove " + a(W)(A.code),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: b(() => [
                m(a(K), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick", "aria-label"])
          ]),
          default: b(() => [
            e("div", Ma, [
              e("div", Fa, [
                e("div", Ha, [
                  R[0] || (R[0] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Field groups"),
                    e("span", { class: "pim-f-note" }, "the fields this family's products carry")
                  ], -1)),
                  m(ce, {
                    "model-value": A.aspects ?? [],
                    options: p.value,
                    "onUpdate:modelValue": (h) => a(Ce)(A, "aspects", h)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            e("div", Ja, [
              R[6] || (R[6] = e("header", { class: "pim-aspect-head" }, [
                e("h3", null, "Variation")
              ], -1)),
              R[7] || (R[7] = e("p", { class: "muted small pim-axis-help" }, "Choose the fields that distinguish variants at each level. Each field can be used once.", -1)),
              e("div", Wa, [
                (l(!0), u(F, null, G(o(A), (h, I) => (l(), u("div", {
                  key: I,
                  class: "pim-level"
                }, [
                  e("div", Ka, [
                    e("strong", null, "Level " + _(I + 1), 1),
                    m(a(J), {
                      type: "button",
                      "aria-label": "Remove level",
                      onClick: (k) => o(A).splice(I, 1),
                      text: "",
                      severity: "secondary",
                      size: "small"
                    }, {
                      default: b(() => [
                        m(a(K), { icon: "tabler:x" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  e("div", Ga, [
                    e("div", Ya, [
                      R[1] || (R[1] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Axes")
                      ], -1)),
                      R[2] || (R[2] = e("p", { class: "muted small pim-axis-help" }, "Choose a single-value field with no dimensions. Text and record fields are excluded.", -1)),
                      m(ce, {
                        dropdown: "",
                        "model-value": h.axes ?? [],
                        options: C(A, h, "axes"),
                        placeholder: "Add an axis",
                        "onUpdate:modelValue": (k) => h.axes = k
                      }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                    ]),
                    e("div", Za, [
                      R[3] || (R[3] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Also owned here")
                      ], -1)),
                      R[4] || (R[4] = e("p", { class: "muted small pim-axis-help" }, "Other fields you edit at this level.", -1)),
                      m(ce, {
                        dropdown: "",
                        "model-value": h.own ?? [],
                        options: C(A, h, "own"),
                        placeholder: "Add a field",
                        "onUpdate:modelValue": (k) => k.length ? h.own = k : delete h.own
                      }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                    ])
                  ])
                ]))), 128)),
                m(a(J), {
                  type: "button",
                  onClick: (h) => v(A),
                  severity: "secondary",
                  outlined: "",
                  size: "small"
                }, {
                  default: b(() => [
                    m(a(K), {
                      icon: "tabler:plus",
                      "aria-hidden": "true"
                    }),
                    R[5] || (R[5] = q(" Add level", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ]),
            e("div", Qa, [
              R[11] || (R[11] = e("header", { class: "pim-aspect-head" }, [
                e("h3", null, "Requirements"),
                e("span", { class: "muted small" }, "what a channel needs before a product is ready")
              ], -1)),
              e("div", Xa, [
                (l(!0), u(F, null, G(M(A), (h, I) => (l(), u("div", {
                  key: h.id,
                  class: "pim-level"
                }, [
                  e("div", es, [
                    e("strong", ts, _(h.id), 1),
                    m(a(J), {
                      type: "button",
                      "aria-label": "Remove requirement",
                      onClick: (k) => M(A).splice(I, 1),
                      text: "",
                      severity: "secondary",
                      size: "small"
                    }, {
                      default: b(() => [
                        m(a(K), { icon: "tabler:x" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  e("div", ls, [
                    (l(!0), u(F, null, G(y.value, (k) => (l(), u("div", {
                      key: k.name,
                      class: "pim-f pim-w-third"
                    }, [
                      e("div", as, [
                        e("label", null, _(a(W)(k.name)), 1),
                        R[8] || (R[8] = e("span", { class: "pim-f-note" }, "context", -1))
                      ]),
                      m(a(ue), {
                        "model-value": Q(h, k.name),
                        "onUpdate:modelValue": (U) => Y(h, k.name, U),
                        options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ...k.members.map((U) => ({ value: U, label: String(U) }))],
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self"
                      }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                    ]))), 128)),
                    e("div", ss, [
                      R[9] || (R[9] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Required"),
                        e("span", { class: "pim-f-note" }, "must hold a value")
                      ], -1)),
                      m(ce, {
                        dropdown: "",
                        "model-value": h.require ?? [],
                        options: j(A),
                        placeholder: "Add a required field",
                        "onUpdate:modelValue": (k) => a(Ce)(h, "require", k)
                      }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                    ]),
                    e("div", ns, [
                      R[10] || (R[10] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Authored"),
                        e("span", { class: "pim-f-note" }, "must be set in the context itself, not by fallback")
                      ], -1)),
                      m(ce, {
                        dropdown: "",
                        "model-value": h.authored ?? [],
                        options: j(A),
                        placeholder: "Add a field to author",
                        "onUpdate:modelValue": (k) => a(Ce)(h, "authored", k)
                      }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                    ])
                  ])
                ]))), 128)),
                m(ke, {
                  label: "Requirement code",
                  action: "Add requirement",
                  existing: M(A).map((h) => h.id),
                  onAdd: (h) => Z(A, h)
                }, null, 8, ["existing", "onAdd"])
              ])
            ])
          ]),
          _: 2
        }, 1032, ["title", "code"]))), 128))
      ]),
      _: 1
    }, 8, ["count"]));
  }
}), os = ["inert"], ds = {
  key: 0,
  class: "row wrap"
}, rs = {
  key: 2,
  class: "small muted"
}, us = { class: "pim-principal-service" }, cs = /* @__PURE__ */ te({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: g }) {
    const n = t, r = g, d = B(!1), f = B(""), p = B({});
    let $ = 0;
    re(() => n.modelValue, async (y) => {
      const i = ++$;
      try {
        const s = await at(n.catalogId ?? "", y);
        i === $ && (p.value = s);
      } catch {
        i === $ && (p.value = {});
      }
    }, { immediate: !0, deep: !0 }), Ie(() => {
      $++;
    });
    function c(y) {
      return p.value[y] ?? pe(y, "Person");
    }
    He(async () => {
      try {
        await _t("wc-principal-picker"), d.value = !0;
      } catch {
        d.value = !1;
      }
    });
    function O(y) {
      n.disabled || !y.trim() || n.modelValue.includes(y.trim()) || (r("update:modelValue", [...n.modelValue, y.trim()]), f.value = "");
    }
    function j(y) {
      const i = y.detail;
      if (!i || typeof i != "object") return;
      const s = i, o = s.principal_id ?? s.id;
      typeof o == "string" && O(o);
    }
    function C(y) {
      n.disabled || r("update:modelValue", n.modelValue.filter((i) => i !== y));
    }
    return (y, i) => (l(), u("div", {
      class: "pim-principal-list",
      inert: t.disabled || void 0
    }, [
      t.modelValue.length ? (l(), u("div", ds, [
        (l(!0), u(F, null, G(t.modelValue, (s) => (l(), T(a(ae), {
          key: s,
          severity: "secondary"
        }, {
          default: b(() => [
            e("span", null, _(c(s)), 1),
            m(a(J), {
              text: "",
              size: "small",
              disabled: t.disabled,
              "aria-label": "Remove " + c(s),
              onClick: (o) => C(s)
            }, {
              default: b(() => [
                m(a(K), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : S("", !0),
      d.value ? (l(), u("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: oe(j, ["stop"])
      }, null, 32)) : (l(), u("span", rs, "The person picker is unavailable.")),
      e("label", us, [
        i[3] || (i[3] = e("span", { class: "small muted" }, "Service account", -1)),
        m(a(Ue), {
          modelValue: f.value,
          "onUpdate:modelValue": i[0] || (i[0] = (s) => f.value = s),
          disabled: t.disabled,
          placeholder: "Service principal id",
          onKeydown: i[1] || (i[1] = Fe(oe((s) => O(f.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "disabled"])
      ]),
      m(a(J), {
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: t.disabled || !f.value.trim(),
        onClick: i[2] || (i[2] = (s) => O(f.value))
      }, {
        default: b(() => [
          m(a(K), { icon: "tabler:plus" }),
          i[4] || (i[4] = q(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, os));
  }
}), ms = { class: "pim-stack" }, ps = { class: "muted small" }, fs = { class: "pim-fields" }, vs = { class: "pim-f pim-w-half" }, ys = { class: "pim-f pim-w-half" }, bs = { class: "muted small" }, gs = { class: "pim-fields" }, hs = { class: "pim-f pim-w-third" }, ks = { class: "pim-f pim-w-third" }, $s = { class: "row" }, ws = { class: "pim-f pim-w-third" }, _s = { class: "pim-f pim-w-full" }, xs = /* @__PURE__ */ te({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: g }) {
    const n = t, r = g, d = H(() => n.draft.channels ?? []), f = H(() => n.draft.sources ?? []), p = H(() => [...new Set((n.draft.families ?? []).flatMap((i) => (i.requirements ?? []).map((s) => s.id)))].map((i) => ({ value: i }))), $ = H(() => (n.draft.families ?? []).filter((i) => i.code !== "generic").map((i) => ({ value: i.code, label: W(i.code) }))), c = H(() => (n.draft.aspects ?? []).map((i) => ({ value: i.namespace, label: W(i.namespace) })));
    function O(i) {
      (n.draft.channels ??= []).push({ id: i, requirements: [] });
    }
    function j(i) {
      d.value.splice(d.value.indexOf(i), 1), n.schema.declaration.channels?.some((s) => s.id === i.id) && r("remove", "channels", i.id);
    }
    function C(i) {
      (n.draft.sources ??= []).push({ id: i, ordering: "none", writes: [] });
    }
    function y(i) {
      f.value.splice(f.value.indexOf(i), 1), n.schema.declaration.sources?.some((s) => s.id === i.id) && r("remove", "sources", i.id);
    }
    return (i, s) => (l(), u("div", ms, [
      m($e, {
        count: d.value.length,
        columns: ["code", "details"]
      }, {
        head: b(() => [...s[0] || (s[0] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Channels")
          ], -1)
        ])]),
        add: b(() => [
          m(ke, {
            label: "Channel code",
            action: "Add channel",
            existing: d.value.map((o) => o.id),
            onAdd: O
          }, null, 8, ["existing"])
        ]),
        default: b(() => [
          (l(!0), u(F, null, G(d.value, (o) => (l(), T(we, {
            key: o.id,
            title: a(W)(o.id),
            code: o.id
          }, {
            details: b(() => [
              e("span", ps, _(o.requirements?.length ?? 0) + " " + _(o.requirements?.length === 1 ? "requirement" : "requirements"), 1)
            ]),
            actions: b(() => [
              m(a(J), {
                type: "button",
                onClick: (v) => j(o),
                "aria-label": "Remove " + a(W)(o.id),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: b(() => [
                  m(a(K), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick", "aria-label"])
            ]),
            default: b(() => [
              e("div", fs, [
                e("div", vs, [
                  s[1] || (s[1] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Requirements"),
                    e("span", { class: "pim-f-note" }, "a product is ready for the channel when these hold")
                  ], -1)),
                  m(ce, {
                    "model-value": o.requirements ?? [],
                    options: p.value,
                    "onUpdate:modelValue": (v) => a(Ce)(o, "requirements", v)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", ys, [
                  s[2] || (s[2] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Families"),
                    e("span", { class: "pim-f-note" }, "empty means every family")
                  ], -1)),
                  m(ce, {
                    "model-value": o.families ?? [],
                    options: $.value,
                    "onUpdate:modelValue": (v) => a(Ce)(o, "families", v)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, 1032, ["title", "code"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      m($e, {
        count: f.value.length,
        columns: ["code", "details"]
      }, {
        head: b(() => [...s[3] || (s[3] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Sources")
          ], -1)
        ])]),
        add: b(() => [
          m(ke, {
            label: "Source code",
            action: "Add source",
            existing: f.value.map((o) => o.id),
            onAdd: C
          }, null, 8, ["existing"])
        ]),
        default: b(() => [
          (l(!0), u(F, null, G(f.value, (o) => (l(), T(we, {
            key: o.id,
            title: a(W)(o.id),
            code: o.id
          }, {
            details: b(() => [
              e("span", bs, _(o.writes?.length ?? 0) + " " + _(o.writes?.length === 1 ? "field group" : "field groups"), 1)
            ]),
            actions: b(() => [
              m(a(J), {
                type: "button",
                onClick: (v) => y(o),
                "aria-label": "Remove " + a(W)(o.id),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: b(() => [
                  m(a(K), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick", "aria-label"])
            ]),
            default: b(() => [
              e("div", gs, [
                e("div", hs, [
                  s[4] || (s[4] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Ordering"),
                    e("span", { class: "pim-f-note" }, "sequence keeps late deliveries from winning")
                  ], -1)),
                  m(a(ue), {
                    "model-value": o.ordering ?? "none",
                    "onUpdate:modelValue": (v) => o.ordering = v,
                    options: [{ value: "none", label: "none" }, { value: "sequence", label: "sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                e("div", ks, [
                  s[5] || (s[5] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Audit"),
                    e("span", { class: "pim-f-note" }, "record each value change")
                  ], -1)),
                  e("label", $s, [
                    m(a(Oe), {
                      "aria-label": "Audit " + o.id,
                      "model-value": o.audit !== !1,
                      "onUpdate:modelValue": (v) => v ? delete o.audit : o.audit = !1
                    }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"]),
                    e("span", null, _(o.audit === !1 ? "Off for this source" : "As the catalog policy"), 1)
                  ])
                ]),
                e("div", ws, [
                  s[6] || (s[6] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Principals"),
                    e("span", { class: "pim-f-note" }, "who may write as this source")
                  ], -1)),
                  m(cs, {
                    "catalog-id": t.catalogId,
                    "model-value": o.principals ?? [],
                    "onUpdate:modelValue": (v) => a(Ce)(o, "principals", v)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])
                ]),
                e("div", _s, [
                  s[7] || (s[7] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Writes"),
                    e("span", { class: "pim-f-note" }, "field groups this source may set")
                  ], -1)),
                  m(ce, {
                    "model-value": o.writes ?? [],
                    options: c.value,
                    "onUpdate:modelValue": (v) => a(Ce)(o, "writes", v)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, 1032, ["title", "code"]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), Cs = { class: "pim-stack" }, Vs = { class: "pim-bsection-head" }, Us = { class: "muted small" }, Ss = {
  key: 0,
  class: "pim-aspect muted"
}, As = {
  key: 1,
  class: "muted small"
}, Os = {
  key: 3,
  class: "muted small"
}, Is = {
  key: 0,
  class: "pim-aspect muted"
}, Ts = { class: "muted small" }, js = /* @__PURE__ */ te({
  __name: "BuilderPlugins",
  props: {
    draft: {},
    schema: {},
    options: {},
    pluginConfigs: { default: () => ({}) }
  },
  emits: ["remove", "configure"],
  setup(t, { emit: g }) {
    const n = t, r = g, d = H(() => n.draft.plugins ?? []);
    function f(i) {
      return d.value.some((s) => s.use === i.plugin);
    }
    function p(i) {
      return n.schema.plugins.find((s) => s.plugin === i.plugin);
    }
    function $(i, s) {
      s && !f(i) && (n.draft.plugins ??= []).push({ use: i.plugin }), s || (n.draft.plugins = d.value.filter((o) => o.use !== i.plugin), delete n.pluginConfigs[i.plugin], p(i)?.active && r("remove", "plugins", i.plugin));
    }
    function c(i, s) {
      n.pluginConfigs[i.plugin] = s;
    }
    function O(i) {
      return Object.entries(n.schema.attributes).filter(([, s]) => s.plugin === i.plugin).map(([s]) => s);
    }
    const j = H(() => n.draft.scopes ?? []);
    function C(i) {
      return j.value.includes(i.id);
    }
    function y(i, s) {
      s && !C(i) && (n.draft.scopes ??= []).push(i.id), !s && C(i) && (j.value.splice(j.value.indexOf(i.id), 1), n.schema.declaration.scopes?.includes(i.id) && r("remove", "scopes", i.id));
    }
    return (i, s) => (l(), u("div", Cs, [
      m($e, {
        count: t.options.plugins.length,
        columns: ["details"]
      }, {
        head: b(() => [
          e("header", Vs, [
            s[0] || (s[0] = e("h3", null, "Plugins", -1)),
            e("span", Us, _(t.options.plugins.length) + " installed", 1)
          ])
        ]),
        default: b(() => [
          t.options.plugins.length === 0 ? (l(), u("div", Ss, "No plugin is installed.")) : S("", !0),
          (l(!0), u(F, null, G(t.options.plugins, (o) => (l(), T(we, {
            key: o.plugin,
            title: a(pe)(o.title, "Plugin")
          }, {
            details: b(() => [
              m(a(ae), {
                severity: f(o) ? "success" : "secondary",
                value: f(o) ? "Active" : "Inactive"
              }, null, 8, ["severity", "value"])
            ]),
            actions: b(() => [
              m(a(Oe), {
                "aria-label": "Enable " + a(pe)(o.title, "Plugin"),
                "model-value": f(o),
                "onUpdate:modelValue": (v) => $(o, v)
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
            ]),
            default: b(() => [
              p(o)?.problem ? (l(), T(a(me), {
                key: 0,
                severity: "warn"
              }, {
                default: b(() => [
                  q(_(p(o)?.problem?.message), 1)
                ]),
                _: 2
              }, 1024)) : S("", !0),
              O(o).length ? (l(), u("p", As, "Fields: " + _(O(o).join(", ")) + ".", 1)) : S("", !0),
              f(o) ? (l(), T(We, {
                key: 2,
                schema: o.config_schema,
                "model-value": t.pluginConfigs[o.plugin] ?? p(o)?.config ?? {},
                "onUpdate:modelValue": (v) => c(o, v)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue"])) : S("", !0),
              p(o)?.active ? (l(), u("p", Os, [
                q(_(p(o)?.lifecycle.state), 1),
                (l(!0), u(F, null, G(p(o)?.projections, (v, M) => (l(), u("span", { key: M }, " · " + _(M) + ": " + _(v.parked ? "paused" : v.bootstrapping ? "initializing" : "ready"), 1))), 128))
              ])) : S("", !0),
              p(o)?.active && t.pluginConfigs[o.plugin] ? (l(), T(a(J), {
                key: 4,
                label: "Save configuration",
                onClick: (v) => r("configure", o.plugin, t.pluginConfigs[o.plugin])
              }, null, 8, ["onClick"])) : S("", !0)
            ]),
            _: 2
          }, 1032, ["title"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      m($e, {
        count: t.options.scopes.length,
        columns: ["details"]
      }, {
        head: b(() => [...s[1] || (s[1] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Scopes"),
            e("span", { class: "muted small" }, "filters the grid can use from plugin tables")
          ], -1)
        ])]),
        default: b(() => [
          t.options.scopes.length === 0 ? (l(), u("div", Is, "No scope is declared.")) : S("", !0),
          (l(!0), u(F, null, G(t.options.scopes, (o) => (l(), T(we, {
            key: o.id,
            title: a(pe)(o.title, "Scope")
          }, {
            details: b(() => [
              m(a(ae), {
                severity: C(o) ? "success" : "secondary",
                value: C(o) ? "Adopted" : "Not adopted"
              }, null, 8, ["severity", "value"])
            ]),
            actions: b(() => [
              m(a(Oe), {
                "aria-label": "Adopt " + a(pe)(o.title, "Scope"),
                "model-value": C(o),
                "onUpdate:modelValue": (v) => y(o, v)
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
            ]),
            default: b(() => [
              e("p", Ts, [
                s[2] || (s[2] = q("Filters: ", -1)),
                (l(!0), u(F, null, G(o.filters, (v, M) => (l(), T(a(ae), {
                  key: M,
                  class: "kx-tag-sm small",
                  severity: "secondary"
                }, {
                  default: b(() => [
                    q(_(M) + " · " + _(v.ops.join(" ")), 1)
                  ]),
                  _: 2
                }, 1024))), 128)),
                q(" · needs " + _(o.access) + " access", 1)
              ])
            ]),
            _: 2
          }, 1032, ["title"]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
});
async function Rs(t) {
  const g = await rt(`/api/v1/pim-admin/catalogs/${encodeURIComponent(t)}/policy_defaults`, "policy defaults");
  if (g.audit !== "fields" && g.audit !== "off" || !["audit_days", "trash_days", "tombstone_days"].every((n) => typeof g[n] == "number" && Number.isSafeInteger(g[n])))
    throw new Error("Policy defaults are unavailable.");
  for (const [n, r] of Object.entries(nt)) {
    const d = g[n];
    if (typeof d != "number" || !Number.isSafeInteger(d) || d < r.min || d > r.max) throw new Error(`Policy ${n} is unavailable.`);
  }
  return g;
}
const nt = {
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
}, qs = { class: "form" }, Ds = {
  key: 0,
  class: "muted small pim-policy-status",
  role: "status"
}, Ns = ["id", "data-policy-group", "aria-label"], Ps = {
  key: 0,
  class: "pim-bsection-head"
}, zs = { class: "pim-policy-copy" }, Ls = ["for"], Bs = ["id"], Es = { key: 0 }, Ms = ["aria-expanded"], Fs = /* @__PURE__ */ te({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {}
  },
  setup(t) {
    const g = t, n = B(), r = H(() => g.defaults ?? n.value), d = B(""), f = B(!1);
    async function p() {
      if (!g.defaults) {
        d.value = "", f.value = !0;
        try {
          n.value = await Rs(g.catalogId ?? "");
        } catch (M) {
          d.value = M instanceof Error ? M.message : "Could not read policy defaults.";
        } finally {
          f.value = !1;
        }
      }
    }
    He(p);
    const $ = H(() => g.draft.policy ?? {}), c = B(!1), O = [
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
    function C(M) {
      const Z = nt[M];
      return { key: M, ...Z, kind: "int", hint: j[M] };
    }
    O.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(C));
    const y = ["proposal_days", "proposal_count"].map(C), i = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(C), s = [
      { id: "retention", title: "Retention", keys: O },
      { id: "proposals", title: "Proposals", keys: y },
      { id: "advanced", title: "", keys: i }
    ], o = H(() => [
      { value: "inherited", label: r.value ? `${r.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function v(M, Z) {
      const Q = g.draft.policy ?? (g.draft.policy = {});
      Q[M] = Z == null || Z === "" || Z === "inherited" ? !1 : Z;
    }
    return (M, Z) => (l(), u("section", qs, [
      Z[4] || (Z[4] = e("p", { class: "muted small pim-policy-intro" }, "Empty fields inherit the deployment settings.", -1)),
      f.value ? (l(), u("p", Ds, "Loading deployment defaults…")) : S("", !0),
      d.value ? (l(), T(a(me), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: b(() => [
          q(_(d.value) + " ", 1),
          m(a(J), {
            severity: "secondary",
            outlined: "",
            onClick: p
          }, {
            default: b(() => [...Z[1] || (Z[1] = [
              q("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      })) : S("", !0),
      (l(), u(F, null, G(s, (Q) => (l(), u(F, {
        key: Q.id
      }, [
        Q.id !== "advanced" || c.value ? (l(), u("section", {
          key: 0,
          id: Q.id === "advanced" ? "policy-advanced" : void 0,
          "data-policy-group": Q.id,
          class: "pim-policy-group",
          "aria-label": Q.title || "Advanced"
        }, [
          Q.title ? (l(), u("header", Ps, [
            e("h3", null, _(Q.title), 1)
          ])) : S("", !0),
          (l(!0), u(F, null, G(Q.keys, (Y) => (l(), u("div", {
            key: Y.key,
            class: "pim-policy-row"
          }, [
            e("div", zs, [
              e("label", {
                for: "pol-" + Y.key
              }, _(Y.title), 9, Ls),
              e("p", {
                id: "pol-help-" + Y.key
              }, [
                q(_(Y.hint), 1),
                Y.global ? (l(), u("span", Es, " Managed in deployment settings.")) : S("", !0)
              ], 8, Bs)
            ]),
            Y.kind === "enum" ? (l(), T(a(ue), {
              key: 0,
              "input-id": "pol-" + Y.key,
              "aria-describedby": "pol-help-" + Y.key,
              class: "pim-policy-control",
              "model-value": typeof $.value[Y.key] == "string" ? $.value[Y.key] : "inherited",
              options: o.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": (D) => v(Y.key, D)
            }, null, 8, ["input-id", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])) : (l(), T(a(Vt), {
              key: 1,
              disabled: Y.global,
              "input-id": "pol-" + Y.key,
              "aria-describedby": "pol-help-" + Y.key,
              class: "pim-policy-control",
              "model-value": Y.global ? Number(r.value?.[Y.key] ?? 0) || null : typeof $.value[Y.key] == "number" ? Number($.value[Y.key]) : null,
              min: Y.min ?? (Y.key === "audit_days" ? 0 : 1),
              max: Y.max,
              step: 1,
              placeholder: r.value ? "Default: " + r.value[Y.key] : "Deployment default",
              "onUpdate:modelValue": (D) => v(Y.key, D)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "min", "max", "placeholder", "onUpdate:modelValue"]))
          ]))), 128))
        ], 8, Ns)) : S("", !0),
        Q.id === "proposals" ? (l(), u("button", {
          key: 1,
          type: "button",
          class: "pim-policy-advanced",
          "aria-expanded": c.value,
          "aria-controls": "policy-advanced",
          onClick: Z[0] || (Z[0] = (Y) => c.value = !c.value)
        }, [
          m(a(K), {
            icon: c.value ? "tabler:chevron-down" : "tabler:chevron-right",
            "aria-hidden": "true"
          }, null, 8, ["icon"]),
          Z[2] || (Z[2] = e("span", null, "Advanced", -1)),
          Z[3] || (Z[3] = e("span", { class: "muted small" }, "Processing limits and deployment settings", -1))
        ], 8, Ms)) : S("", !0)
      ], 64))), 64))
    ]));
  }
}), Hs = { class: "form" }, Js = { class: "pim-aspect" }, Ws = /* @__PURE__ */ te({
  __name: "BuilderDeclaration",
  props: {
    draft: {}
  },
  emits: ["replace", "validity"],
  setup(t, { emit: g }) {
    const n = t, r = g, d = B(JSON.stringify(n.draft, null, 2)), f = B("");
    Ie(() => r("validity", !0)), re(() => n.draft, ($) => {
      d.value = JSON.stringify($, null, 2), f.value = "";
    }, { deep: !0 });
    function p() {
      try {
        const $ = jt(d.value);
        f.value = "", r("validity", !0), r("replace", $);
      } catch ($) {
        r("validity", !1), f.value = "Invalid declaration: " + ($ instanceof Error ? $.message : String($));
      }
    }
    return ($, c) => (l(), u("section", Hs, [
      e("div", Js, [
        c[1] || (c[1] = e("header", { class: "pim-aspect-head" }, [
          e("h3", null, "Declaration"),
          e("span", { class: "muted small" }, "edits apply to the draft when the JSON parses")
        ], -1)),
        f.value ? (l(), T(a(me), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: b(() => [
            q(_(f.value), 1)
          ]),
          _: 1
        })) : S("", !0),
        m(a(Ut), {
          modelValue: d.value,
          "onUpdate:modelValue": c[0] || (c[0] = (O) => d.value = O),
          rows: "28",
          spellcheck: "false",
          onInput: p,
          onBlur: p,
          class: "mono pim-json-edit"
        }, null, 8, ["modelValue"])
      ])
    ]));
  }
}), Ks = {
  key: 0,
  class: "pim-detail-head"
}, Gs = { class: "pim-detail-actions" }, Ys = { class: "pim-settings-pane" }, Zs = { class: "pim-builder-main pim-readable" }, Qs = { class: "pim-error-copy" }, Xs = {
  key: 0,
  class: "pim-error-code"
}, en = ["aria-labelledby"], tn = { class: "pim-group-head" }, ln = ["id"], an = { class: "pim-card-body pad" }, sn = { key: 0 }, nn = { key: 1 }, on = { key: 2 }, dn = { key: 3 }, rn = { key: 4 }, un = { class: "pim-error-copy" }, cn = { key: 0 }, mn = {
  key: 6,
  class: "pim-plan-list"
}, pn = { key: 1 }, fn = {
  key: 7,
  class: "row end"
}, vn = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, yn = ["disabled", "inert"], bn = /* @__PURE__ */ te({
  __name: "SchemaBuilder",
  props: {
    catalogId: {},
    embedded: { type: Boolean },
    title: {},
    backLabel: {}
  },
  emits: ["applied", "back", "dirty-changed"],
  setup(t, { emit: g }) {
    const n = t, r = g, d = [
      { id: "fields", title: "Fields" },
      { id: "layout", title: "Form layout" },
      { id: "dimensions", title: "Dimensions" },
      { id: "vocabularies", title: "Vocabularies" },
      { id: "families", title: "Families" },
      { id: "channels", title: "Channels & sources" },
      { id: "plugins", title: "Plugins & scopes" },
      { id: "policy", title: "Policy" },
      { id: "declaration", title: "Declaration" },
      { id: "history", title: "History" }
    ], f = B("fields"), p = B(null), $ = B(null), c = B({}), O = B({}), j = B({}), C = H(() => Object.fromEntries(Object.entries(j.value).filter(([E]) => c.value.plugins?.some((P) => P.use === E) && !p.value?.plugins.some((P) => P.plugin === E && P.active)))), y = B(null), i = B(null), s = B(!1), o = B(""), v = B(null), M = B(null), Z = Me(), Q = {
      unchanged: "No changes",
      initial: "First schema",
      cosmetic: "Presentation only",
      additive: "New fields or options",
      semantic: "Affects product data",
      refused: "Changes blocked"
    }, Y = {
      "attribute order": "Field order",
      cardinality: "Number of values",
      default: "Default value",
      scope: "Dimensions",
      form: "Value format",
      index: "Index settings",
      type: "Field type",
      unique: "Unique values",
      width: "Width"
    }, D = B(null), R = B(!0), A = qe(), h = H(() => R.value && !!v.value && v.value.class !== "refused" && !!D.value?.matches(w.value, p.value?.schema_generation ?? -1, C.value)), I = H(() => v.value ? [...v.value.refused, ...v.value.changes.filter((E) => E.class !== "refused")] : []), k = qe(), U = B(!1);
    let ee = 0;
    re([c, O, j], () => {
      ee++, v.value = null;
    }, { deep: !0, flush: "sync" });
    async function _e(E = !1, P = !1) {
      if (de.value && !E) return;
      const z = k.begin(), ge = ee, fe = n.catalogId, ve = P ? Object.entries(j.value).filter(([ye]) => p.value?.plugins.some((Te) => Te.plugin === ye && Te.active)) : [];
      U.value = !0, y.value = null;
      try {
        const [ye, Te] = await Promise.all([ne.schema(fe), ne.schemaOptions(fe)]);
        if (!k.current(z) || ge !== ee || fe !== n.catalogId) return;
        p.value = ye, $.value = Te, c.value = je(ye.declaration), O.value = {}, j.value = Object.fromEntries(ve.filter(([it]) => ye.plugins.some((Ke) => Ke.plugin === it && Ke.active))), v.value = null, R.value = !0;
      } catch (ye) {
        k.current(z) && (y.value = xe(ye, "Could not load the schema."));
      } finally {
        k.current(z) && (U.value = !1);
      }
    }
    let Se = () => {
    };
    re(() => n.catalogId, (E) => {
      Se(), Se = tt(`component.${E}`, () => {
        de.value || _e();
      });
    }, { immediate: !0 }), Ee(async () => {
      de.value || await _e();
    }), Ie(() => {
      Se(), A.begin(), k.begin();
    }), re(() => n.catalogId, () => {
      A.begin(), s.value = !1, p.value = null, $.value = null, Ve(), _e();
    });
    const De = H(() => Object.values(Ye(c.value, O.value)).reduce((E, P) => E + (P?.length ?? 0), 0)), de = H(() => !!p.value && (JSON.stringify(c.value) !== JSON.stringify(p.value.declaration) || De.value > 0 || Object.keys(j.value).length > 0));
    re(de, (E) => r("dirty-changed", E), { immediate: !0 });
    const x = H(() => ![c.value.aspects, c.value.dimensions, c.value.vocabularies, c.value.families, c.value.channels, c.value.sources, c.value.plugins, c.value.scopes].some((E) => E?.length)), w = H(() => {
      const E = je(c.value), P = Ye(E, O.value);
      return Object.keys(P).length && (E.remove = P), E;
    });
    re(de, (E) => {
      E || (v.value = null);
    }), re([w, C], () => {
      v.value = null;
    }, { deep: !0 });
    function N(E) {
      const [P, z] = E.split(" ", 2);
      if (P === "plugin" && z) return $.value?.plugins.find((ve) => ve.plugin === z)?.title || "Plugin";
      if (P === "scope" && z) return $.value?.scopes.find((ve) => ve.id === z)?.title || "Scope";
      if (P === "aspect" && z) return W(z) + " field group";
      const [ge, fe] = E.split(".", 2);
      return fe ? `${W(fe)} (${W(ge)})` : W(E);
    }
    async function V() {
      if (!p.value || !R.value) return;
      const E = A.begin(), P = Ot(w.value, p.value.schema_generation, C.value);
      s.value = !0, y.value = null;
      try {
        const z = await ne.planSchema(n.catalogId, P.declaration, P.generation, P.pluginConfigs);
        if (!A.current(E) || !P.matches(w.value, p.value.schema_generation, C.value) || !R.value) return;
        D.value = P, v.value = z, await Ne(), M.value?.focus();
      } catch (z) {
        if (!A.current(E)) return;
        y.value = xe(z, "Could not review the change."), v.value = null, D.value = null, await Ne(), i.value?.$el.focus();
      } finally {
        A.current(E) && (s.value = !1);
      }
    }
    async function le() {
      if (!p.value || !de.value || !h.value || !D.value) return;
      const E = n.catalogId, P = A.begin();
      s.value = !0, y.value = null, o.value = "";
      try {
        const z = await ne.applySchema(E, D.value.declaration, D.value.generation, D.value.pluginConfigs);
        if (E !== n.catalogId || !A.current(P) || (await _e(!0, !0), E !== n.catalogId || !A.current(P))) return;
        o.value = `Applied as generation ${z.generation}`, r("applied", z.generation);
      } catch (z) {
        if (E !== n.catalogId || !A.current(P)) return;
        y.value = xe(z, "Could not apply the change."), await Ne(), i.value?.$el.focus();
      } finally {
        A.current(P) && (s.value = !1);
      }
    }
    async function L(E, P) {
      const z = n.catalogId, ge = k.begin(), fe = A.begin();
      s.value = !0, y.value = null;
      try {
        const ve = JSON.stringify(P);
        if (await ne.configurePlugin(z, E, je(P)), z !== n.catalogId || !k.current(ge)) return;
        const ye = await ne.schema(z);
        if (z !== n.catalogId || !k.current(ge)) return;
        p.value && (p.value.plugins = ye.plugins), JSON.stringify(j.value[E]) === ve && delete j.value[E], o.value = "Configuration saved";
      } catch (ve) {
        z === n.catalogId && A.current(fe) && (y.value = xe(ve, "Could not save configuration."));
      } finally {
        A.current(fe) && (s.value = !1);
      }
    }
    function Ve() {
      j.value = {}, R.value = !0, p.value && (c.value = je(p.value.declaration)), O.value = {}, v.value = null, o.value = "";
    }
    function se(E, P) {
      const z = O.value[E] ?? [];
      z.includes(P) || (O.value = { ...O.value, [E]: [...z, P] });
    }
    return (E, P) => (l(), u("div", {
      class: be(["pim-builder", { embedded: t.embedded }])
    }, [
      t.embedded ? (l(), u("div", Ks, [
        e("h2", null, _(t.title || "Catalog"), 1),
        m(a(ae), {
          severity: "secondary",
          value: "Generation " + (p.value?.schema_generation ?? "…")
        }, null, 8, ["value"]),
        e("div", Gs, [
          ie(E.$slots, "actions", {
            access: p.value?.access
          }),
          m(Xe, {
            access: p.value?.access,
            dirty: de.value,
            busy: s.value,
            valid: R.value,
            reviewed: !!v.value,
            onDiscard: Ve,
            onReview: V
          }, null, 8, ["access", "dirty", "busy", "valid", "reviewed"])
        ])
      ])) : (l(), T(kl, {
        key: 1,
        title: t.title || "Catalog",
        subtitle: "Settings · generation " + (p.value?.schema_generation ?? "…"),
        icon: "tabler:settings",
        "back-label": t.backLabel,
        onBack: P[0] || (P[0] = (z) => r("back"))
      }, {
        default: b(() => [
          ie(E.$slots, "actions", {
            access: p.value?.access
          }),
          m(Xe, {
            access: p.value?.access,
            dirty: de.value,
            busy: s.value,
            valid: R.value,
            reviewed: !!v.value,
            onDiscard: Ve,
            onReview: V
          }, null, 8, ["access", "dirty", "busy", "valid", "reviewed"])
        ]),
        _: 3
      }, 8, ["title", "subtitle", "back-label"])),
      m(a(ht), {
        value: f.value,
        "onUpdate:value": P[1] || (P[1] = (z) => f.value = z),
        class: "pim-section-tabs"
      }, {
        default: b(() => [
          m(a(kt), { "aria-label": "Schema sections" }, {
            default: b(() => [
              (l(), u(F, null, G(d, (z) => m(a($t), {
                key: z.id,
                value: z.id
              }, {
                default: b(() => [
                  q(_(z.title), 1)
                ]),
                _: 2
              }, 1032, ["value"])), 64))
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["value"]),
      e("div", Ys, [
        e("div", Zs, [
          y.value ? (l(), T(a(me), {
            key: 0,
            ref_key: "errorPanel",
            ref: i,
            severity: "error",
            role: "alert",
            tabindex: "-1"
          }, {
            default: b(() => [
              e("span", Qs, [
                q(_(y.value.message) + " ", 1),
                y.value.code ? (l(), u("span", Xs, [
                  P[5] || (P[5] = q("Code ", -1)),
                  e("code", null, _(y.value.code), 1)
                ])) : S("", !0)
              ])
            ]),
            _: 1
          }, 512)) : S("", !0),
          o.value ? (l(), T(a(me), {
            key: 1,
            severity: "success"
          }, {
            default: b(() => [
              q(_(o.value), 1)
            ]),
            _: 1
          })) : S("", !0),
          v.value ? (l(), u("section", {
            key: 2,
            class: "pim-table pim-plan",
            "aria-labelledby": a(Z)
          }, [
            e("div", tn, [
              m(a(K), {
                icon: "tabler:checklist",
                "aria-hidden": "true"
              }),
              e("h3", {
                id: a(Z),
                ref_key: "reviewHeading",
                ref: M,
                tabindex: "-1"
              }, "Review changes", 8, ln),
              m(a(ae), {
                class: "kx-tag-sm",
                severity: v.value.class === "refused" ? "danger" : v.value.class === "semantic" ? "warn" : "info"
              }, {
                default: b(() => [
                  q(_(Q[v.value.class] || "Schema changes"), 1)
                ]),
                _: 1
              }, 8, ["severity"])
            ]),
            e("div", an, [
              v.value.class === "unchanged" ? (l(), u("p", sn, "Nothing would change.")) : v.value.class === "initial" ? (l(), u("p", nn, "This will set up the first schema.")) : v.value.class === "cosmetic" ? (l(), u("p", on, "These changes leave stored product values as they are.")) : v.value.class === "additive" ? (l(), u("p", dn, "Existing product values stay as they are.")) : v.value.class === "semantic" ? (l(), u("p", rn, "The catalog will recalculate product values or readiness after you apply these changes.")) : v.value.class === "refused" ? (l(), T(a(me), {
                key: 5,
                severity: "error"
              }, {
                default: b(() => [
                  e("span", un, [
                    P[6] || (P[6] = q(" These changes can’t be applied. ", -1)),
                    v.value.migration && v.value.refused.some((z) => p.value?.attributes[z.code]) ? (l(), u("span", cn, " To change how a field stores values, add a new field and copy the existing values into it. Then remove the original field and give the new field its name. ")) : S("", !0)
                  ])
                ]),
                _: 1
              })) : S("", !0),
              I.value.length ? (l(), u("ul", mn, [
                (l(!0), u(F, null, G(I.value, (z, ge) => (l(), u("li", { key: ge }, [
                  z.class === "refused" ? (l(), T(a(ae), {
                    key: 0,
                    class: "kx-tag-sm small",
                    severity: "danger"
                  }, {
                    default: b(() => [...P[7] || (P[7] = [
                      q("Blocked", -1)
                    ])]),
                    _: 1
                  })) : S("", !0),
                  z.code ? (l(), u("strong", pn, _(N(z.code)), 1)) : S("", !0),
                  e("span", null, _(Y[z.what] || z.what), 1)
                ]))), 128))
              ])) : S("", !0),
              p.value?.access.admin && v.value.class !== "refused" ? (l(), u("div", fn, [
                m(a(J), {
                  disabled: !de.value || s.value || !h.value,
                  loading: s.value,
                  onClick: le
                }, {
                  default: b(() => [
                    q(_(f.value === "layout" ? "Apply layout" : "Apply"), 1)
                  ]),
                  _: 1
                }, 8, ["disabled", "loading"])
              ])) : S("", !0)
            ])
          ], 8, en)) : S("", !0),
          U.value && (!p.value || !$.value) ? (l(), u("div", vn, "Loading…")) : (!p.value || !$.value) && y.value ? (l(), T(a(J), {
            key: 4,
            onClick: P[2] || (P[2] = (z) => _e()),
            severity: "secondary",
            outlined: ""
          }, {
            default: b(() => [...P[8] || (P[8] = [
              q("Retry", -1)
            ])]),
            _: 1
          })) : p.value && $.value && f.value === "history" ? (l(), T(fl, {
            key: 5,
            "catalog-id": t.catalogId
          }, null, 8, ["catalog-id"])) : p.value && $.value ? (l(), u("fieldset", {
            key: 6,
            class: "pim-editor-surface",
            disabled: s.value || !p.value.access.admin,
            inert: s.value || !p.value.access.admin
          }, [
            x.value && f.value === "fields" ? (l(), T(a(me), {
              key: 0,
              severity: "info"
            }, {
              default: b(() => [...P[9] || (P[9] = [
                q("Define its schema. Add a field group to start defining fields.", -1)
              ])]),
              _: 1
            })) : S("", !0),
            f.value === "fields" ? (l(), T(pa, {
              key: 1,
              draft: c.value,
              schema: p.value,
              options: $.value,
              onRemove: se
            }, null, 8, ["draft", "schema", "options"])) : f.value === "layout" ? (l(), T(Zt, {
              key: 2,
              draft: c.value,
              schema: p.value
            }, null, 8, ["draft", "schema"])) : f.value === "dimensions" ? (l(), T(ka, {
              key: 3,
              draft: c.value,
              schema: p.value,
              onRemove: se
            }, null, 8, ["draft", "schema"])) : f.value === "vocabularies" ? (l(), T(Ba, {
              key: 4,
              "catalog-id": t.catalogId,
              draft: c.value,
              schema: p.value,
              onRemove: se
            }, null, 8, ["catalog-id", "draft", "schema"])) : f.value === "families" ? (l(), T(is, {
              key: 5,
              draft: c.value,
              schema: p.value,
              options: $.value,
              onRemove: se
            }, null, 8, ["draft", "schema", "options"])) : f.value === "channels" ? (l(), T(xs, {
              key: 6,
              "catalog-id": t.catalogId,
              draft: c.value,
              schema: p.value,
              onRemove: se
            }, null, 8, ["catalog-id", "draft", "schema"])) : f.value === "plugins" ? (l(), T(js, {
              key: 7,
              draft: c.value,
              schema: p.value,
              options: $.value,
              "plugin-configs": j.value,
              onConfigure: L,
              onRemove: se
            }, null, 8, ["draft", "schema", "options", "plugin-configs"])) : f.value === "policy" ? (l(), T(Fs, {
              key: 8,
              "catalog-id": t.catalogId,
              draft: c.value
            }, null, 8, ["catalog-id", "draft"])) : f.value === "declaration" ? (l(), T(Ws, {
              key: 9,
              draft: c.value,
              onReplace: P[3] || (P[3] = (z) => c.value = z),
              onValidity: P[4] || (P[4] = (z) => {
                R.value = z, v.value = null;
              })
            }, null, 8, ["draft"])) : S("", !0)
          ], 8, yn)) : S("", !0)
        ])
      ])
    ], 2));
  }
}), gn = /* @__PURE__ */ te({
  __name: "SettingsApp",
  setup(t) {
    const g = ut(), n = ct(), r = B(""), d = H(() => g.value.catalogId ?? ""), f = qe();
    async function p() {
      const $ = f.begin(), c = d.value;
      try {
        const O = await ne.catalogSummary(c);
        f.current($) && (r.value = O?.title || "Untitled catalog");
      } catch {
        f.current($) && (r.value = "Untitled catalog");
      }
    }
    return re(d, () => {
      r.value = "", p();
    }), Ee(p), Ie(() => {
      f.begin();
    }), ($, c) => d.value ? (l(), T(bn, {
      key: d.value,
      "catalog-id": d.value,
      title: r.value || "Catalog",
      embedded: a(g).embedded,
      "back-label": a(g).embedded ? void 0 : "Back to catalog settings",
      onBack: c[0] || (c[0] = (O) => a(n)("navigate", { route: "" })),
      onDirtyChanged: c[1] || (c[1] = (O) => a(n)("dirty-changed", { dirty: O }))
    }, {
      actions: b(({ access: O }) => [
        O?.admin ? (l(), T(At, {
          key: 0,
          "catalog-id": d.value,
          title: r.value || "Catalog"
        }, null, 8, ["catalog-id", "title"])) : S("", !0)
      ]),
      _: 1
    }, 8, ["catalog-id", "title", "embedded", "back-label"])) : S("", !0);
  }
});
class hn extends mt {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "catalog-id": { type: "string", default: "" }, embedded: { type: "boolean", default: !1 } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: pt
    };
  }
  static get vueConfig() {
    return { rootComponent: gn, plugins: [ft] };
  }
}
xt(import.meta.url, hn);
