import { e as Ge, a as tl, u as Pe, r as qe, p as se, _ as al, g as sl, b as nl, c as il, W as ol, s as dl, P as rl } from "./styles-B-LFoGlX.js";
import { defineComponent as X, ref as M, openBlock as a, createElementBlock as p, Fragment as J, createVNode as i, unref as l, withCtx as y, createTextVNode as z, createCommentVNode as q, createBlock as T, toDisplayString as O, computed as Y, createElementVNode as e, renderList as Z, withModifiers as le, normalizeStyle as ze, normalizeClass as ye, useId as Se, watch as re, onUnmounted as Oe, resolveDynamicComponent as ul, renderSlot as oe, provide as cl, inject as ml, useModel as pl, mergeModels as Ke, withKeys as fe, onMounted as Ee, toRaw as fl } from "vue";
import K from "primevue/button";
import me from "primevue/message";
import { Icon as F } from "@iconify/vue";
import ne from "primevue/tag";
import vl from "primevue/tabs";
import bl from "primevue/tablist";
import yl from "primevue/tab";
import Be from "primevue/selectbutton";
import { on as Ye, host as gl, loadByTagName as hl, define as kl } from "@wippy-fe/proxy";
import _l from "primevue/multiselect";
import Ue from "primevue/toggleswitch";
import ue from "primevue/select";
import ie from "primevue/inputtext";
import $l from "primevue/inputnumber";
import wl from "primevue/textarea";
const xl = ["config"], Cl = /* @__PURE__ */ X({
  __name: "CatalogShare",
  props: {
    catalogId: {},
    title: {}
  },
  setup(t) {
    const k = t, s = M(!1), o = M(!1), c = M("");
    async function f() {
      o.value = !0, c.value = "", await Ge("kickside-share") ? s.value = !0 : c.value = "Could not open sharing. Try Share again.", o.value = !1;
    }
    return (v, g) => (a(), p(J, null, [
      i(l(K), {
        type: "button",
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: o.value,
        onClick: f
      }, {
        default: y(() => [...g[1] || (g[1] = [
          z("Share", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      s.value ? (a(), p("kickside-share", {
        key: 0,
        config: JSON.stringify({ resource_id: k.catalogId, title: k.title, access_url: `/api/v1/component-access/grants/${encodeURIComponent(k.catalogId)}`, share_url: `/api/v1/component-access/share/${encodeURIComponent(k.catalogId)}` }),
        onClose: g[0] || (g[0] = (u) => s.value = !1)
      }, null, 40, xl)) : q("", !0),
      c.value ? (a(), T(l(me), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: y(() => [
          z(O(c.value), 1)
        ]),
        _: 1
      })) : q("", !0)
    ], 64));
  }
});
function Vl(t, k, s = {}) {
  const o = JSON.stringify(t), c = JSON.stringify(s);
  return {
    declaration: JSON.parse(o),
    generation: k,
    pluginConfigs: JSON.parse(c),
    matches: (f, v, g = {}) => k === v && o === JSON.stringify(f) && c === JSON.stringify(g)
  };
}
function He(t, k) {
  const s = {};
  for (const [o, c] of Object.entries(k)) {
    const f = c.filter((v) => o === "plugins" ? !t.plugins?.some((g) => g.use === v) : o === "scopes" ? !t.scopes?.includes(v) : o === "attributes" ? !t.aspects?.some((g) => g.attributes?.some((u) => g.namespace + "." + u.code === v)) : o === "aspects" ? !t.aspects?.some((g) => g.namespace === v) : o === "dimensions" ? !t.dimensions?.some((g) => g.name === v) : o === "vocabularies" || o === "families" ? !t[o]?.some((g) => g.code === v) : !t[o]?.some((g) => g.id === v));
    f.length && (s[o] = f);
  }
  return s;
}
const Fe = (t) => !!t && typeof t == "object" && !Array.isArray(t), Q = ["string"], Ze = { "*": "string" }, Ul = { id: "number", code: "string!", type: "string!", scope: Q, cardinality: "string", index: "string", index_contexts: [Ze], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, Sl = {
  dimensions: [{ name: "string!", members: Q, fallback: { "*": Q } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: Q }, attributes: [Ul] }],
  families: [{ code: "string!", aspects: Q, variation: [{ axes: Q, own: Q }], requirements: [{ id: "string!", context: Ze, require: Q, authored: Q }], checks: [{ check: "string!", reads: Q, cost: "string", config: "object", enforce: "string" }] }],
  sources: [{ id: "string!", ordering: "string", writes: Q, principals: Q, audit: "boolean" }],
  channels: [{ id: "string!", requirements: Q, families: Q }],
  plugins: [{ use: "string!", schema: "json" }],
  scopes: Q,
  policy: { "*": "policy" },
  remove: { dimensions: Q, vocabularies: Q, aspects: Q, families: Q, sources: Q, channels: Q, attributes: Q, scopes: Q, plugins: Q }
};
function De(t, k, s) {
  if (typeof k == "string") {
    const o = k.replace("!", "");
    if (!(o === "json" || (o === "object" ? Fe(t) : o === "policy" ? t === !1 || typeof t == "string" || typeof t == "number" : typeof t === o)) || k.endsWith("!") && (typeof t != "string" || !t.trim())) throw new Error(`${s} has an invalid ${o} value.`);
  } else if (Array.isArray(k)) {
    if (!Array.isArray(t)) throw new Error(`${s} must be an array.`);
    t.forEach((o, c) => De(o, k[0], `${s}[${c}]`));
  } else {
    if (!Fe(t)) throw new Error(`${s} must be an object.`);
    for (const [o, c] of Object.entries(k)) if (typeof c == "string" && c.endsWith("!") && t[o] === void 0) throw new Error(`${s}.${o} is required.`);
    for (const [o, c] of Object.entries(t)) {
      const f = k[o] ?? k["*"];
      if (!f) throw new Error(`${s}.${o} is not an editor field.`);
      De(c, f, `${s}.${o}`);
    }
  }
}
function Ol(t) {
  const k = JSON.parse(t);
  De(k, Sl, "Declaration");
  const s = k;
  for (const o of s.dimensions ?? []) o.members ??= [];
  return s;
}
function je(t) {
  return JSON.parse(JSON.stringify(t));
}
const te = /^[a-z][a-z0-9_]*$/;
function xe(t, k, s) {
  s.length ? t[k] = s : delete t[k];
}
function _e(t, k, s) {
  if (s < 0 || s >= t.length || k === s) return;
  const [o] = t.splice(k, 1);
  t.splice(s, 0, o);
}
function de(t, k) {
  return !t || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(t) ? k : t;
}
function Ve(t) {
  return t ? de(t.title, "Field type") : "Unknown type";
}
async function Qe(t, k) {
  const s = [...new Set(k)].map((c) => ({ type: "user", id: c }));
  if (!s.length) return {};
  const o = await tl(`/api/v1/pim-admin/catalogs/${encodeURIComponent(t)}/principal_labels`, { refs: s }, "People");
  return Object.fromEntries((o.principals ?? []).map((c) => [c.id, de(c.label, "Person")]));
}
const Re = [
  { value: "quarter", label: "¼", span: 3 },
  { value: "third", label: "⅓", span: 4 },
  { value: "half", label: "½", span: 6 },
  { value: "full", label: "1", span: 12 }
];
function Ne(t, k, s) {
  return s.width ?? t.attributes[k + "." + s.code]?.width ?? "half";
}
const Il = (t) => new Date(t).toLocaleString();
function Le(t) {
  const k = Math.abs(t.m).toString(), s = t.m < 0 ? "-" : "";
  if (t.e >= 0) return s + k + "0".repeat(t.e);
  const o = -t.e, c = k.padStart(o + 1, "0");
  return s + c.slice(0, c.length - o) + "." + c.slice(c.length - o);
}
function G(t) {
  const s = (t.includes(".") ? t.slice(t.indexOf(".") + 1) : t).replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return s ? s[0].toUpperCase() + s.slice(1) : t;
}
function Ce(t) {
  return t.labels.en ?? Object.values(t.labels)[0] ?? t.code;
}
function Je(t, k) {
  if (t == null) return "";
  const s = (o) => {
    if (o == null) return "";
    if (typeof o == "object" && "ref" in o) {
      const c = o;
      if (c.ref[0] === "term") {
        const f = c.ref[1].slice(c.ref[1].indexOf(":") + 1), v = c.ref[1].slice(0, c.ref[1].indexOf(":")), g = k?.[v]?.find((u) => u.code === f);
        return g ? Ce(g) : f;
      }
      return "Linked " + G(c.ref[0]).toLocaleLowerCase();
    }
    if (typeof o == "object" && "v" in o) {
      const c = o;
      return Le(c.v) + " " + c.u;
    }
    return typeof o == "object" && "m" in o ? Le(o) : typeof o == "boolean" ? o ? "Yes" : "No" : typeof o == "object" ? JSON.stringify(o) : de(String(o), "Linked record");
  };
  return Array.isArray(t) ? t.map(s).join(", ") : s(t);
}
function Al(t, k, s) {
  const o = Je(k), c = Je(s);
  return !c && o ? `${t} cleared (was ${o})` : o ? `${t}: ${o} → ${c}` : `${t} set to ${c}`;
}
const jl = { class: "pim-table form pim-layout" }, Rl = {
  key: 0,
  class: "kx-empty"
}, ql = { class: "pim-aspect-head" }, Tl = ["draggable", "onDragstart", "onDragover", "onDrop"], zl = { class: "pim-lcard-top" }, Dl = {
  class: "pim-grip",
  "aria-hidden": "true"
}, Nl = { class: "pim-lcard-name" }, Ll = { class: "pim-lcard-type" }, Pl = { class: "pim-lcard-move" }, El = { class: "pim-aspect-head" }, Bl = { class: "pim-canvas" }, Ml = { class: "pim-lcard-top" }, Kl = { class: "pim-lcard-name" }, Hl = { class: "pim-lcard-type" }, Fl = /* @__PURE__ */ X({
  __name: "LayoutEditor",
  props: {
    draft: {},
    schema: {},
    types: {}
  },
  setup(t) {
    const k = t, s = Y(() => k.draft?.aspects ?? []), o = Y(() => new Map(k.types.map(($) => [$.id, Ve($)]))), c = Y(() => {
      if (!k.schema) return [];
      const $ = new Set((k.draft?.aspects ?? []).map((d) => d.namespace)), S = /* @__PURE__ */ new Map();
      for (const [d, r] of Object.entries(k.schema.attributes)) {
        const n = d.split(".")[0];
        $.has(n) || !r.plugin || (S.has(n) || S.set(n, { aspect: n, plugin: r.plugin, codes: [] }), S.get(n).codes.push(d));
      }
      return [...S.values()];
    });
    function f($, S) {
      return Re.find((d) => d.value === Ne(k.schema, $, S))?.span ?? 6;
    }
    const v = M(null), g = M(null);
    function u($, S, d) {
      v.value = { ns: $, index: S }, d.dataTransfer?.setData("text/plain", $ + ":" + S), d.dataTransfer && (d.dataTransfer.effectAllowed = "move");
    }
    function j($, S, d) {
      !v.value || v.value.ns !== $ || (d.preventDefault(), g.value = { ns: $, index: S });
    }
    function L($, S) {
      v.value && v.value.ns === $.namespace && _e($.attributes ?? [], v.value.index, S), v.value = null, g.value = null;
    }
    function P() {
      v.value = null, g.value = null;
    }
    return ($, S) => (a(), p("div", jl, [
      S[3] || (S[3] = e("p", { class: "pim-layout-help muted" }, "Arrange fields within each group and choose their widths. Review changes before applying the layout.", -1)),
      s.value.length === 0 ? (a(), p("div", Rl, "This catalog has no field groups yet. Add a field group in Fields.")) : q("", !0),
      (a(!0), p(J, null, Z(s.value, (d) => (a(), p("section", {
        key: d.namespace,
        class: "pim-aspect"
      }, [
        e("header", ql, [
          e("h3", null, O(l(G)(d.namespace)), 1),
          S[1] || (S[1] = e("span", { class: "muted small" }, "drag a field, or use its arrows", -1))
        ]),
        e("div", {
          class: "pim-canvas",
          onDragover: S[0] || (S[0] = le(() => {
          }, ["prevent"]))
        }, [
          (a(!0), p(J, null, Z(d.attributes ?? [], (r, n) => (a(), p("div", {
            key: r.code,
            class: ye(["pim-lcard", { dragging: v.value?.ns === d.namespace && v.value?.index === n, over: g.value?.ns === d.namespace && g.value?.index === n }]),
            style: ze({ gridColumn: "span " + f(d.namespace, r) }),
            draggable: t.schema.access.admin,
            onDragstart: (b) => u(d.namespace, n, b),
            onDragover: (b) => j(d.namespace, n, b),
            onDrop: le((b) => L(d, n), ["prevent"]),
            onDragend: P
          }, [
            e("div", zl, [
              e("span", Dl, [
                i(l(F), { icon: "tabler:grip-vertical" })
              ]),
              e("span", Nl, O(l(G)(r.code)), 1),
              e("span", Ll, O(o.value.get(r.type) ?? l(Ve)(void 0)), 1),
              e("span", Pl, [
                i(l(K), {
                  type: "button",
                  disabled: n === 0,
                  "aria-label": "Move " + l(G)(r.code) + " earlier",
                  onClick: (b) => l(_e)(d.attributes ?? [], n, n - 1),
                  class: "arrow",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: y(() => [
                    i(l(F), { icon: "tabler:arrow-left" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                i(l(K), {
                  type: "button",
                  disabled: n === (d.attributes ?? []).length - 1,
                  "aria-label": "Move " + l(G)(r.code) + " later",
                  onClick: (b) => l(_e)(d.attributes ?? [], n, n + 1),
                  class: "arrow",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: y(() => [
                    i(l(F), { icon: "tabler:arrow-right" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ])
            ]),
            i(l(Be), {
              "model-value": l(Ne)(t.schema, d.namespace, r),
              options: l(Re),
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Width of " + l(G)(r.code),
              "onUpdate:modelValue": (b) => r.width = b
            }, null, 8, ["model-value", "options", "aria-label", "onUpdate:modelValue"])
          ], 46, Tl))), 128))
        ], 32)
      ]))), 128)),
      (a(!0), p(J, null, Z(c.value, (d) => (a(), p("section", {
        key: d.aspect,
        class: "pim-aspect"
      }, [
        e("header", El, [
          e("h3", null, O(l(G)(d.aspect)), 1),
          S[2] || (S[2] = e("span", { class: "muted small" }, "Provided by a plugin", -1))
        ]),
        e("div", Bl, [
          (a(!0), p(J, null, Z(d.codes, (r) => (a(), p("div", {
            key: r,
            class: "pim-lcard fixed",
            style: ze({ gridColumn: "span " + (l(Re).find((n) => n.value === t.schema.attributes[r].width)?.span ?? 6) })
          }, [
            e("div", Ml, [
              e("span", Kl, O(l(G)(r)), 1),
              e("span", Hl, O(o.value.get(t.schema.attributes[r].type) ?? l(Ve)(void 0)), 1)
            ])
          ], 4))), 128))
        ])
      ]))), 128))
    ]));
  }
}), Jl = {
  class: "pim-history",
  "aria-label": "Catalog history"
}, Wl = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Gl = { class: "pim-table pim-responsive-table" }, Yl = ["id"], Zl = ["aria-labelledby"], Ql = { class: "muted small" }, Xl = ["datetime"], et = { class: "small" }, lt = {
  key: 0,
  class: "muted"
}, tt = { class: "mono small" }, at = {
  key: 0,
  class: "muted"
}, st = ["aria-labelledby"], nt = { class: "pim-stacked-meta muted small" }, it = ["datetime"], ot = {
  key: 1,
  class: "kx-empty"
}, dt = { class: "pim-table-foot" }, rt = /* @__PURE__ */ X({
  __name: "HistoryPanel",
  props: {
    catalogId: {}
  },
  setup(t) {
    const k = t, s = M([]), o = M({}), c = M(), f = M(!1), v = M(""), g = qe(), u = Se(), j = Y(() => s.value.map((d) => ({
      key: `${d.seq}:${d.n}`,
      at: d.at,
      date: Il(d.at),
      actor: o.value[d.actor] ?? de(d.actor, "Person"),
      source: d.source,
      product: P(d),
      context: d.ctx,
      change: $(d)
    })));
    async function L(d = !1) {
      const r = g.begin();
      f.value = !0, v.value = "";
      try {
        const n = await se.history(k.catalogId, { limit: 50, before: d ? c.value : void 0 });
        if (!g.current(r)) return;
        s.value = d ? [...s.value, ...n.entries] : n.entries, c.value = n.next;
        try {
          const b = await Qe(k.catalogId, n.entries.map((m) => m.actor));
          g.current(r) && (o.value = { ...o.value, ...b });
        } catch {
        }
      } catch (n) {
        if (!g.current(r)) return;
        v.value = n instanceof Error ? n.message : "Could not load the history.";
      } finally {
        g.current(r) && (f.value = !1);
      }
    }
    function P(d) {
      return d.sku ? d.sku : d.subject.startsWith("p:") ? "purged product" : d.subject.startsWith("t:") ? d.subject.slice(2) : d.subject.startsWith("r:") ? "Release" : de(d.subject, "Catalog");
    }
    function $(d) {
      if (d.attribute)
        return Al(G(d.attribute), d.before, d.after);
      switch (d.kind) {
        case "schema":
          return "Schema generation " + String(d.after?.generation ?? "");
        case "term": {
          const r = d.after ?? {}, n = r.labels?.en ?? Object.values(r.labels ?? {})[0];
          return r.retired ? "Term retired" : n ? `Term labelled "${n}"` + (r.parent ? ` under ${r.parent}` : "") : "Term changed";
        }
        case "created": {
          const r = d.after ?? {};
          return `Created as ${G(r.family ?? "product")}` + (r.level ? ` at level ${r.level}` : "");
        }
        case "released": {
          const r = d.after ?? {};
          return `Released v${r.version ?? ""} to ${(r.channels ?? []).join(", ")}`;
        }
        case "withdrawn":
          return `Withdrawn from ${((d.after ?? {}).channels ?? []).join(", ")}`;
        case "status":
          return `Status ${String(d.before ?? "")} → ${String(d.after ?? "")}`;
        case "moved":
          return "Moved under another parent";
        default:
          return G(d.kind);
      }
    }
    let S = () => {
    };
    return re(() => k.catalogId, () => {
      S(), g.begin(), s.value = [], o.value = {}, c.value = void 0, v.value = "", S = Ye(`component.${k.catalogId}`, () => {
        L();
      });
    }, { immediate: !0 }), re(() => k.catalogId, () => {
      L();
    }), Pe(() => L()), Oe(() => {
      S(), g.begin();
    }), (d, r) => (a(), p("section", Jl, [
      v.value ? (a(), T(l(me), {
        key: 0,
        severity: "error",
        role: "alert"
      }, {
        default: y(() => [
          z(O(v.value) + " ", 1),
          i(l(K), {
            severity: "secondary",
            outlined: "",
            disabled: f.value,
            onClick: r[0] || (r[0] = (n) => L())
          }, {
            default: y(() => [...r[2] || (r[2] = [
              z("Retry", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ]),
        _: 1
      })) : q("", !0),
      f.value ? (a(), p("div", Wl, "Loading history…")) : q("", !0),
      e("div", Gl, [
        e("p", {
          id: l(u),
          class: "pim-history-caption muted small"
        }, "Catalog changes, newest first", 8, Yl),
        j.value.length ? (a(), p(J, { key: 0 }, [
          e("table", {
            class: "pim-grid",
            "aria-labelledby": l(u)
          }, [
            r[3] || (r[3] = e("thead", null, [
              e("tr", null, [
                e("th", { scope: "col" }, "When"),
                e("th", { scope: "col" }, "Who"),
                e("th", { scope: "col" }, "What"),
                e("th", { scope: "col" }, "Change")
              ])
            ], -1)),
            e("tbody", null, [
              (a(!0), p(J, null, Z(j.value, (n) => (a(), p("tr", {
                key: n.key
              }, [
                e("td", Ql, [
                  e("time", {
                    datetime: n.at
                  }, O(n.date), 9, Xl)
                ]),
                e("td", et, [
                  z(O(n.actor), 1),
                  n.source ? (a(), p("span", lt, " via " + O(n.source), 1)) : q("", !0)
                ]),
                e("td", tt, [
                  z(O(n.product), 1),
                  n.context ? (a(), p("span", at, " · " + O(n.context), 1)) : q("", !0)
                ]),
                e("td", null, O(n.change), 1)
              ]))), 128))
            ])
          ], 8, Zl),
          e("ol", {
            role: "list",
            class: "pim-stacked-list",
            "aria-labelledby": l(u)
          }, [
            (a(!0), p(J, null, Z(j.value, (n) => (a(), p("li", {
              key: n.key,
              class: "pim-stacked-row"
            }, [
              e("div", null, O(n.change), 1),
              e("div", nt, [
                e("span", null, [
                  e("span", null, O(n.actor), 1),
                  n.source ? (a(), p(J, { key: 0 }, [
                    z(" via " + O(n.source), 1)
                  ], 64)) : q("", !0)
                ]),
                e("time", {
                  datetime: n.at
                }, O(n.date), 9, it),
                e("span", null, [
                  z(O(n.product), 1),
                  n.context ? (a(), p(J, { key: 0 }, [
                    z(" · " + O(n.context), 1)
                  ], 64)) : q("", !0)
                ])
              ])
            ]))), 128))
          ], 8, st)
        ], 64)) : !f.value && !v.value ? (a(), p("div", ot, "Nothing recorded yet.")) : q("", !0),
        e("div", dt, [
          e("span", null, O(j.value.length) + " change" + O(j.value.length === 1 ? "" : "s") + " shown", 1),
          c.value ? (a(), T(l(K), {
            key: 0,
            type: "button",
            disabled: f.value,
            onClick: r[1] || (r[1] = (n) => L(!0)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: y(() => [
              i(l(F), {
                icon: "tabler:adjustments",
                "aria-hidden": "true"
              }),
              r[4] || (r[4] = z(" Load older", -1))
            ]),
            _: 1
          }, 8, ["disabled"])) : q("", !0)
        ])
      ])
    ]));
  }
}), We = /* @__PURE__ */ X({
  __name: "SettingsActions",
  props: {
    access: {},
    applyLabel: {},
    dirty: { type: Boolean },
    busy: { type: Boolean },
    valid: { type: Boolean },
    reviewed: { type: Boolean },
    canApply: { type: Boolean }
  },
  emits: ["discard", "review", "apply"],
  setup(t, { emit: k }) {
    const s = k;
    return (o, c) => t.access?.admin ? (a(), p(J, { key: 0 }, [
      t.dirty ? (a(), T(l(ne), {
        key: 0,
        severity: "warn",
        value: "Unsaved changes"
      })) : q("", !0),
      i(l(K), {
        severity: "secondary",
        outlined: "",
        disabled: !t.dirty || t.busy,
        onClick: c[0] || (c[0] = (f) => s("discard"))
      }, {
        default: y(() => [
          i(l(F), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          }),
          c[3] || (c[3] = z(" Discard", -1))
        ]),
        _: 1
      }, 8, ["disabled"]),
      t.reviewed ? (a(), T(l(K), {
        key: 2,
        disabled: !t.dirty || t.busy || !t.canApply,
        loading: t.busy,
        onClick: c[2] || (c[2] = (f) => s("apply"))
      }, {
        default: y(() => [
          z(O(t.applyLabel || "Apply"), 1)
        ]),
        _: 1
      }, 8, ["disabled", "loading"])) : (a(), T(l(K), {
        key: 1,
        disabled: !t.dirty || t.busy || !t.valid,
        loading: t.busy,
        onClick: c[1] || (c[1] = (f) => s("review"))
      }, {
        default: y(() => [...c[4] || (c[4] = [
          z("Review changes", -1)
        ])]),
        _: 1
      }, 8, ["disabled", "loading"]))
    ], 64)) : q("", !0);
  }
}), ut = { class: "kx-head-icon" }, ct = { class: "kx-head-text" }, mt = { class: "pim-title-line" }, pt = ["title"], ft = { class: "kx-head-actions" }, vt = /* @__PURE__ */ X({
  __name: "PageHead",
  props: {
    title: {},
    subtitle: {},
    icon: {},
    backLabel: {},
    pane: { type: Boolean }
  },
  emits: ["back"],
  setup(t, { emit: k }) {
    const s = k;
    return (o, c) => (a(), p("header", {
      class: ye(["kx-head", { "pim-panel-head": t.pane }])
    }, [
      t.backLabel ? (a(), T(l(K), {
        key: 0,
        type: "button",
        "aria-label": t.backLabel,
        onClick: c[0] || (c[0] = (f) => s("back")),
        text: "",
        severity: "secondary",
        size: "small"
      }, {
        default: y(() => [
          i(l(F), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label"])) : q("", !0),
      e("div", ut, [
        i(l(F), {
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      e("div", ct, [
        e("div", mt, [
          (a(), T(ul(t.pane ? "h2" : "h1"), { class: "kx-title" }, {
            default: y(() => [
              z(O(t.title), 1)
            ]),
            _: 1
          })),
          oe(o.$slots, "meta")
        ]),
        e("p", {
          class: "kx-head-sub",
          title: t.subtitle
        }, O(t.subtitle), 9, pt)
      ]),
      e("div", ft, [
        oe(o.$slots, "default")
      ])
    ], 2));
  }
}), Xe = Symbol("definitionColumns"), bt = { code: "Code", kind: "Kind", details: "Details", usage: "Used by" }, yt = {
  code: "minmax(120px, 1fr)",
  kind: "140px",
  details: "minmax(120px, 1.2fr)",
  usage: "120px"
}, gt = {
  class: "pim-definition-scroll",
  tabindex: "0",
  "aria-label": "Definitions"
}, ht = { class: "pim-definition-grid" }, kt = {
  key: 0,
  class: "pim-definition-columns",
  "aria-hidden": "true"
}, $e = /* @__PURE__ */ X({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: { default: () => ["code"] }
  },
  setup(t) {
    const k = t;
    cl(Xe, Y(() => k.columns));
    const s = Y(() => ["48px", "minmax(160px, 1.4fr)", ...k.columns.map((o) => yt[o]), "80px"].join(" "));
    return (o, c) => (a(), p("section", {
      class: "form pim-definition-list",
      style: ze({ "--pim-definition-columns": s.value })
    }, [
      oe(o.$slots, "head"),
      e("div", gt, [
        e("div", ht, [
          t.count > 3 ? (a(), p("div", kt, [
            c[0] || (c[0] = e("span", null, null, -1)),
            c[1] || (c[1] = e("span", null, "Name", -1)),
            (a(!0), p(J, null, Z(t.columns, (f) => (a(), p("span", {
              key: f,
              class: ye("pim-definition-" + f)
            }, O(l(bt)[f]), 3))), 128)),
            c[2] || (c[2] = e("span", null, null, -1))
          ])) : q("", !0),
          oe(o.$slots, "default")
        ])
      ]),
      oe(o.$slots, "add")
    ], 4));
  }
}), _t = { class: "pim-definition" }, $t = {
  class: "pim-definition-lead",
  "data-column": "lead"
}, wt = {
  class: "pim-row-title",
  "data-column": "name"
}, xt = { class: "pim-definition-meta" }, Ct = ["data-column"], Vt = {
  key: 0,
  class: "mono"
}, Ut = {
  class: "pim-definition-actions",
  "data-column": "actions"
}, St = {
  key: 0,
  class: "pim-definition-body"
}, we = /* @__PURE__ */ X({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ Ke({
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
  emits: /* @__PURE__ */ Ke(["head-keydown", "head-drop", "head-dragover"], ["update:open"]),
  setup(t, { emit: k }) {
    const s = t, o = ml(Xe, Y(() => [
      ...s.code ? ["code"] : [],
      ...s.kind ? ["kind"] : []
    ])), c = pl(t, "open"), f = k;
    return (v, g) => (a(), p("section", _t, [
      e("header", {
        class: ye(["pim-definition-head", t.headClass]),
        onKeydown: g[1] || (g[1] = (u) => f("head-keydown", u)),
        onDrop: g[2] || (g[2] = (u) => f("head-drop", u)),
        onDragover: g[3] || (g[3] = (u) => f("head-dragover", u))
      }, [
        i(al, {
          class: ye(["pim-definition-toggle", t.toggleClass]),
          "aria-expanded": c.value,
          onClick: g[0] || (g[0] = (u) => c.value = !c.value)
        }, {
          default: y(() => [
            e("span", $t, [
              oe(v.$slots, "handle"),
              i(l(F), {
                icon: c.value ? "tabler:chevron-down" : "tabler:chevron-right",
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ]),
            e("span", wt, O(t.title), 1),
            e("span", xt, [
              (a(!0), p(J, null, Z(l(o), (u) => (a(), p("span", {
                key: u,
                class: ye("pim-definition-" + u),
                "data-column": u
              }, [
                u === "code" && t.code ? (a(), p("code", Vt, O(t.code), 1)) : u === "kind" && t.kind ? (a(), T(l(ne), {
                  key: 1,
                  severity: "secondary",
                  value: t.kind
                }, null, 8, ["value"])) : u === "details" ? oe(v.$slots, "details", {}, void 0, void 0, 2) : u === "usage" ? oe(v.$slots, "usage", {}, () => [
                  z(O(t.usage), 1)
                ], void 0, 3) : q("", !0)
              ], 10, Ct))), 128))
            ])
          ]),
          _: 3
        }, 8, ["class", "aria-expanded"]),
        e("div", Ut, [
          oe(v.$slots, "actions")
        ])
      ], 34),
      c.value ? (a(), p("div", St, [
        oe(v.$slots, "default")
      ])) : q("", !0)
    ]));
  }
}), Ot = { class: "pim-chips pim-picker-chips" }, ce = /* @__PURE__ */ X({
  __name: "ChipPicker",
  props: {
    modelValue: {},
    options: {},
    free: { type: Boolean },
    placeholder: {},
    disabled: { type: Boolean },
    labelledby: {}
  },
  emits: ["update:modelValue"],
  setup(t, { emit: k }) {
    const s = t, o = k, c = M("");
    function f(L) {
      return s.modelValue.includes(L);
    }
    function v(L) {
      s.disabled || !L || o("update:modelValue", f(L) ? s.modelValue.filter((P) => P !== L) : [...s.modelValue, L]);
    }
    function g() {
      const L = c.value.trim();
      if (!L || f(L)) {
        c.value = "";
        return;
      }
      o("update:modelValue", [...s.modelValue, L]), c.value = "";
    }
    function u(L) {
      o("update:modelValue", s.modelValue.filter((P) => P !== L));
    }
    function j(L) {
      return s.options?.find((P) => P.value === L)?.label ?? L;
    }
    return (L, P) => (a(), p("div", Ot, [
      t.options && t.options.length > 10 ? (a(), p(J, { key: 0 }, [
        (a(!0), p(J, null, Z(t.modelValue, ($) => (a(), p("span", {
          key: $,
          class: "row"
        }, [
          z(O(j($)), 1),
          t.disabled ? q("", !0) : (a(), T(l(K), {
            key: 0,
            type: "button",
            "aria-label": "Remove " + $,
            onClick: (S) => u($),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: y(() => [
              i(l(F), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"]))
        ]))), 128)),
        t.disabled ? q("", !0) : (a(), T(l(ue), {
          key: 0,
          "model-value": "",
          "aria-labelledby": t.labelledby,
          "aria-label": t.placeholder ?? "Add",
          "onUpdate:modelValue": P[0] || (P[0] = ($) => v($)),
          class: "pim-chip-entry",
          options: [{ value: "", label: String(t.placeholder ?? "Add…") }, ...t.options.filter(($) => !f($.value)).map(($) => ({ value: $.value, label: String($.label ?? $.value) }))],
          "option-label": "label",
          "option-value": "value",
          appendTo: "self"
        }, null, 8, ["aria-labelledby", "aria-label", "options"]))
      ], 64)) : t.options ? (a(), p(J, { key: 1 }, [
        i(l(Be), {
          "model-value": t.modelValue.filter(($) => t.options.some((S) => S.value === $)),
          options: t.options.map(($) => ({ value: $.value, label: $.label ?? $.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          disabled: t.disabled,
          "aria-labelledby": t.labelledby,
          "aria-label": t.placeholder ?? "Selected values",
          "onUpdate:modelValue": P[1] || (P[1] = ($) => o("update:modelValue", [...$, ...t.modelValue.filter((S) => !t.options.some((d) => d.value === S))]))
        }, null, 8, ["model-value", "options", "disabled", "aria-labelledby", "aria-label"]),
        (a(!0), p(J, null, Z(t.modelValue.filter(($) => !t.options.some((S) => S.value === $)), ($) => (a(), p("span", {
          key: $,
          class: "row"
        }, [
          z(O(j($)), 1),
          t.disabled ? q("", !0) : (a(), T(l(K), {
            key: 0,
            type: "button",
            "aria-label": "Remove " + $,
            onClick: (S) => u($),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: y(() => [
              i(l(F), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"]))
        ]))), 128))
      ], 64)) : (a(!0), p(J, { key: 2 }, Z(t.modelValue, ($) => (a(), p("span", {
        key: $,
        class: "row"
      }, [
        z(O($), 1),
        t.disabled ? q("", !0) : (a(), T(l(K), {
          key: 0,
          type: "button",
          "aria-label": "Remove " + $,
          onClick: (S) => u($),
          size: "small",
          text: "",
          severity: "secondary"
        }, {
          default: y(() => [
            i(l(F), { icon: "tabler:x" })
          ]),
          _: 1
        }, 8, ["aria-label", "onClick"]))
      ]))), 128)),
      t.free && !t.disabled ? (a(), T(l(ie), {
        key: 3,
        modelValue: c.value,
        "onUpdate:modelValue": P[2] || (P[2] = ($) => c.value = $),
        type: "text",
        "aria-labelledby": t.labelledby,
        placeholder: t.placeholder ?? "Add…",
        onKeydown: fe(le(g, ["prevent"]), ["enter"]),
        onBlur: g,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "aria-labelledby", "placeholder", "onKeydown"])) : q("", !0)
    ]));
  }
}), It = ["inert"], At = ["schema", "config"], jt = {
  key: 1,
  class: "muted small",
  role: "status"
}, Me = /* @__PURE__ */ X({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: k }) {
    const s = t, o = k, c = M("pending");
    async function f() {
      c.value = "pending", c.value = await Ge("wc-schema-form") ? "ready" : "failed";
    }
    Ee(f);
    function v(g) {
      const u = g.detail;
      u && typeof u == "object" && !Array.isArray(u) && o("update:modelValue", u);
    }
    return (g, u) => (a(), p("div", {
      inert: t.disabled || void 0
    }, [
      c.value === "ready" ? (a(), p("wc-schema-form", {
        key: 0,
        schema: JSON.stringify(s.schema),
        config: JSON.stringify(t.modelValue),
        onConfigChanged: v
      }, null, 40, At)) : c.value === "pending" ? (a(), p("span", jt, "Configuration form is loading.")) : (a(), T(l(me), {
        key: 2,
        role: "alert",
        severity: "error"
      }, {
        default: y(() => [
          u[2] || (u[2] = z("Configuration form could not be loaded. ", -1)),
          i(l(K), {
            type: "button",
            disabled: t.disabled,
            onClick: f,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: y(() => [...u[1] || (u[1] = [
              z("Retry", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ]),
        _: 1
      })),
      i(l(K), {
        type: "button",
        disabled: t.disabled,
        onClick: u[0] || (u[0] = (j) => o("update:modelValue", {})),
        severity: "secondary",
        outlined: "",
        size: "small"
      }, {
        default: y(() => [
          i(l(F), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          }),
          u[3] || (u[3] = z(" Reset overrides", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, It));
  }
}), Rt = /* @__PURE__ */ X({
  __name: "DefaultValue",
  props: {
    attribute: {},
    type: {}
  },
  emits: ["change"],
  setup(t, { emit: k }) {
    const s = t, o = k, c = Y(() => {
      const u = s.type?.form;
      let j = { type: "string" };
      return u === "bool" ? j = { type: "boolean" } : u === "int" ? j = { type: "integer" } : u === "dec" ? j = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : u === "quantity" ? j = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(s.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : u === "record" ? j = { type: "object", additionalProperties: !0 } : u === "ref" && (j = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${s.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (s.attribute.cardinality ?? "one") !== "one" && (j = { type: "array", items: j, uniqueItems: s.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...j, title: "Default value" } } };
    });
    function f(u) {
      return u && typeof u == "object" && "m" in u && "e" in u ? Le(u) : u;
    }
    function v(u) {
      return s.type?.form === "dec" ? f(u) : s.type?.form === "quantity" && u && typeof u == "object" && "v" in u && "u" in u ? { value: f(u.v), unit: u.u } : u;
    }
    const g = Y(() => s.attribute.default === void 0 ? {} : { value: Array.isArray(s.attribute.default) ? s.attribute.default.map(v) : v(s.attribute.default) });
    return (u, j) => (a(), T(Me, {
      schema: c.value,
      "model-value": g.value,
      "onUpdate:modelValue": j[0] || (j[0] = (L) => o("change", L.value))
    }, null, 8, ["schema", "model-value"]));
  }
}), qt = { class: "pim-stack" }, Tt = { class: "pim-bsection-head" }, zt = {
  key: 0,
  class: "mono muted small"
}, Dt = { class: "pim-source-permissions" }, Nt = ["for"], Lt = ["onDragstart"], Pt = { class: "pim-fields" }, Et = { class: "pim-f pim-w-third" }, Bt = { class: "pim-f-label" }, Mt = ["for"], Kt = {
  key: 0,
  class: "pim-f-note"
}, Ht = { class: "pim-f pim-w-third" }, Ft = { class: "pim-f-label" }, Jt = ["id"], Wt = { class: "pim-f pim-w-third" }, Gt = { class: "pim-f-label" }, Yt = ["id"], Zt = {
  key: 0,
  class: "pim-f pim-w-third"
}, Qt = { class: "pim-f-label" }, Xt = ["id"], ea = {
  key: 1,
  class: "pim-f pim-w-third"
}, la = { class: "pim-f-label" }, ta = ["id"], aa = { class: "pim-f pim-w-third" }, sa = { class: "pim-f-label" }, na = ["id"], ia = { class: "pim-f pim-w-third" }, oa = { class: "pim-f-label" }, da = ["id"], ra = { class: "pim-f pim-w-half" }, ua = { class: "pim-f-label" }, ca = ["id"], ma = { class: "pim-f pim-w-half" }, pa = { class: "pim-f-label" }, fa = ["for"], va = { class: "row" }, ba = {
  key: 2,
  class: "pim-f pim-w-full"
}, ya = { class: "pim-f-label" }, ga = ["id"], ha = ["aria-labelledby"], ka = ["id"], _a = ["aria-labelledby"], $a = { class: "pim-f-label" }, wa = ["id"], xa = ["aria-labelledby"], Ca = { class: "pim-f-label" }, Va = ["id"], Ua = { class: "row end" }, Sa = { class: "row pim-add-row" }, Oa = { class: "form" }, Ia = { class: "pim-aspect row pim-add-row" }, Aa = /* @__PURE__ */ X({
  __name: "BuilderFields",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove"],
  setup(t, { emit: k }) {
    const s = t, o = k, c = Re.map((V) => V.value), f = [{ value: "one", label: "Single value" }, { value: "list", label: "Ordered list" }, { value: "set", label: "Unique set" }], v = Y(() => s.draft.aspects ?? []), g = Y(() => (s.draft.dimensions ?? []).map((V) => ({ value: V.name, label: G(V.name) }))), u = Y(() => (s.draft.vocabularies ?? []).map((V) => V.code)), j = Y(() => (s.draft.sources ?? []).map((V) => ({ value: V.id, label: G(V.id) }))), L = Y(() => [...s.options.types].sort((V, w) => V.form.localeCompare(w.form)).map((V) => ({ value: V.id, label: Ve(V) })));
    function P(V) {
      return s.options.types.find((w) => w.id === V.type);
    }
    function $(V) {
      return P(V)?.target === "term";
    }
    function S(V) {
      const w = P(V);
      return !!w && w.form === "ref" && !w.target;
    }
    function d(V, w) {
      return w.id !== void 0 && s.schema.attributes[V + "." + w.code] !== void 0;
    }
    function r(V) {
      const w = (s.draft.families ?? []).filter((x) => x.aspects?.includes(V)).length;
      return w + (w === 1 ? " family" : " families");
    }
    const n = M({}), b = Se(), m = /* @__PURE__ */ new WeakMap();
    let A = 0;
    function _(V, w) {
      if (w.id !== void 0) return V + "." + w.id;
      const x = fl(w);
      let h = m.get(x);
      return h === void 0 && (h = ++A, m.set(x, h)), V + ".draft-" + h;
    }
    function I(V, w, x) {
      return b + "-" + _(V, w) + "-" + x;
    }
    function R(V, w) {
      V.type = w;
      const x = P(V);
      if (x && V.index && !x.indexes.includes(V.index) && delete V.index, $(V) || delete V.vocabulary, !S(V) && V.config && "target" in V.config) {
        const { target: h, ...ee } = V.config;
        V.config = Object.keys(ee).length ? ee : void 0, V.config || delete V.config;
      }
    }
    function C(V, w) {
      Object.keys(w).length ? V.config = w : delete V.config;
    }
    function N(V, w) {
      const x = { ...V.config ?? {} };
      w ? x.target = w : delete x.target, C(V, x);
    }
    function U(V, w) {
      w.length ? V.scope = w : delete V.scope, w.length || delete V.index_contexts;
    }
    function D(V, w, x) {
      x === void 0 || x === "" || x === !1 && w !== "default" ? delete V[w] : V[w] = x;
    }
    function ae(V) {
      return V.index_contexts ?? [];
    }
    function pe(V) {
      return (s.draft.dimensions ?? []).find((w) => w.name === V)?.members ?? [];
    }
    function Ie(V) {
      const w = {};
      for (const h of V.scope ?? []) w[h] = pe(h)[0] ?? "";
      (V.index_contexts ?? (V.index_contexts = [])).push(w);
    }
    const ge = M(null);
    function Te(V, w) {
      ge.value?.namespace === V.namespace && _e(V.attributes ?? [], ge.value.index, w), ge.value = null;
    }
    const ve = M("");
    function be() {
      const V = ve.value.trim();
      !te.test(V) || v.value.some((w) => w.namespace === V) || ((s.draft.aspects ??= []).push({ namespace: V, attributes: [] }), ve.value = "");
    }
    function W(V) {
      const w = v.value.indexOf(V);
      w >= 0 && v.value.splice(w, 1), s.schema.declaration.aspects?.some((x) => x.namespace === V.namespace) && o("remove", "aspects", V.namespace);
    }
    const E = M({});
    function H(V) {
      const w = (E.value[V.namespace] ?? "").trim(), x = V.attributes ?? (V.attributes = []);
      if (!te.test(w) || x.some((B) => B.code === w)) return;
      const h = s.options.types.find((B) => B.id === "kickside.pim.types:text") ?? s.options.types[0], ee = { code: w, type: h?.id ?? "" };
      x.push(ee), E.value[V.namespace] = "", n.value[_(V.namespace, ee)] = !0;
    }
    function he(V, w) {
      const x = V.attributes ?? [], h = x.indexOf(w);
      h >= 0 && x.splice(h, 1), d(V.namespace, w) && o("remove", "attributes", V.namespace + "." + w.code);
    }
    return (V, w) => (a(), p("div", qt, [
      (a(!0), p(J, null, Z(v.value, (x) => (a(), T($e, {
        key: x.namespace,
        count: x.attributes?.length ?? 0,
        columns: ["code", "kind", "details", "usage"]
      }, {
        head: y(() => [
          e("header", Tt, [
            e("div", null, [
              e("h3", null, [
                z(O(l(G)(x.namespace)), 1),
                l(G)(x.namespace).toLocaleLowerCase() !== x.namespace.toLocaleLowerCase() ? (a(), p("span", zt, O(x.namespace), 1)) : q("", !0)
              ]),
              e("div", Dt, [
                e("label", {
                  for: "writers-" + x.namespace
                }, "Sources allowed to write", 8, Nt),
                i(l(_l), {
                  "input-id": "writers-" + x.namespace,
                  "aria-label": "Sources allowed to write",
                  "model-value": x.write?.sources ?? [],
                  options: j.value,
                  "option-label": "label",
                  "option-value": "value",
                  placeholder: "Any source",
                  appendTo: "self",
                  "onUpdate:modelValue": (h) => x.write = { sources: h }
                }, null, 8, ["input-id", "model-value", "options", "onUpdate:modelValue"]),
                w[4] || (w[4] = e("span", { class: "small muted" }, "Leave empty to allow any source to write this field group.", -1))
              ])
            ]),
            i(l(K), {
              type: "button",
              onClick: (h) => W(x),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: y(() => [
                i(l(F), { icon: "tabler:trash" }),
                w[5] || (w[5] = z(" Remove field group", -1))
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]),
        add: y(() => [
          e("div", Sa, [
            i(l(ie), {
              modelValue: E.value[x.namespace],
              "onUpdate:modelValue": (h) => E.value[x.namespace] = h,
              type: "text",
              placeholder: "new_field",
              onKeydown: fe(le((h) => H(x), ["prevent"]), ["enter"]),
              class: "mono"
            }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
            i(l(K), {
              type: "button",
              disabled: !l(te).test(E.value[x.namespace] ?? ""),
              onClick: (h) => H(x),
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: y(() => [
                i(l(F), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                }),
                w[16] || (w[16] = z(" Add field", -1))
              ]),
              _: 1
            }, 8, ["disabled", "onClick"])
          ])
        ]),
        default: y(() => [
          (a(!0), p(J, null, Z(x.attributes ?? [], (h, ee) => (a(), T(we, {
            key: _(x.namespace, h),
            open: n.value[_(x.namespace, h)],
            "onUpdate:open": (B) => n.value[_(x.namespace, h)] = B,
            title: l(G)(h.code),
            code: x.namespace + "." + h.code,
            kind: l(Ve)(P(h)),
            usage: r(x.namespace),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle",
            onHeadDragover: w[2] || (w[2] = le(() => {
            }, ["prevent"])),
            onHeadDrop: le((B) => Te(x, ee), ["prevent"]),
            onHeadKeydown: [
              le((B) => l(_e)(x.attributes ?? [], ee, ee - 1), ["alt", "prevent"]),
              le((B) => l(_e)(x.attributes ?? [], ee, ee + 1), ["alt", "prevent"])
            ]
          }, {
            handle: y(() => [
              e("span", {
                class: "pim-grip",
                draggable: "true",
                "aria-hidden": "true",
                onClick: w[0] || (w[0] = le(() => {
                }, ["stop"])),
                onDragstart: le((B) => ge.value = { namespace: x.namespace, index: ee }, ["stop"]),
                onDragend: w[1] || (w[1] = (B) => ge.value = null)
              }, [
                i(l(F), { icon: "tabler:grip-vertical" })
              ], 40, Lt)
            ]),
            details: y(() => [
              h.cardinality && h.cardinality !== "one" ? (a(), T(l(ne), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: y(() => [
                  z(O(f.find((B) => B.value === h.cardinality)?.label), 1)
                ]),
                _: 2
              }, 1024)) : q("", !0),
              h.scope?.length ? (a(), T(l(ne), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: y(() => [
                  z("per " + O(h.scope.join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : q("", !0),
              h.index && h.index !== "none" ? (a(), T(l(ne), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: y(() => [
                  z(O(h.index) + " index", 1)
                ]),
                _: 2
              }, 1024)) : q("", !0),
              h.unique ? (a(), T(l(ne), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: y(() => [...w[6] || (w[6] = [
                  z("unique", -1)
                ])]),
                _: 1
              })) : q("", !0)
            ]),
            actions: y(() => [
              i(l(K), {
                type: "button",
                disabled: ee === 0,
                "aria-label": "Move " + h.code + " earlier",
                onClick: (B) => l(_e)(x.attributes, ee, ee - 1),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: y(() => [
                  i(l(F), { icon: "tabler:arrow-up" })
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "onClick"]),
              i(l(K), {
                type: "button",
                disabled: ee === (x.attributes?.length ?? 0) - 1,
                "aria-label": "Move " + h.code + " later",
                onClick: (B) => l(_e)(x.attributes, ee, ee + 1),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: y(() => [
                  i(l(F), { icon: "tabler:arrow-down" })
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "onClick"])
            ]),
            default: y(() => [
              e("div", Pt, [
                e("div", Et, [
                  e("div", Bt, [
                    e("label", {
                      for: I(x.namespace, h, "code")
                    }, "Code", 8, Mt),
                    d(x.namespace, h) ? (a(), p("span", Kt, "renames keep values")) : q("", !0)
                  ]),
                  i(l(ie), {
                    id: I(x.namespace, h, "code"),
                    type: "text",
                    value: h.code,
                    onInput: (B) => h.code = B.target.value,
                    class: "mono"
                  }, null, 8, ["id", "value", "onInput"])
                ]),
                e("div", Ht, [
                  e("div", Ft, [
                    e("label", {
                      id: I(x.namespace, h, "type")
                    }, "Type", 8, Jt)
                  ]),
                  i(l(ue), {
                    "aria-labelledby": I(x.namespace, h, "type"),
                    "model-value": h.type,
                    options: L.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (B) => R(h, B)
                  }, null, 8, ["aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", Wt, [
                  e("div", Gt, [
                    e("label", {
                      id: I(x.namespace, h, "values")
                    }, "Values", 8, Yt)
                  ]),
                  i(l(ue), {
                    "aria-labelledby": I(x.namespace, h, "values"),
                    "model-value": h.cardinality ?? "one",
                    options: f,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (B) => D(h, "cardinality", B === "one" ? void 0 : B)
                  }, null, 8, ["aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                $(h) ? (a(), p("div", Zt, [
                  e("div", Qt, [
                    e("label", {
                      id: I(x.namespace, h, "vocabulary")
                    }, "Vocabulary", 8, Xt)
                  ]),
                  i(l(ue), {
                    "aria-labelledby": I(x.namespace, h, "vocabulary"),
                    "model-value": h.vocabulary ?? "",
                    "onUpdate:modelValue": (B) => D(h, "vocabulary", B),
                    options: [{ value: "", label: "Choose…" }, ...u.value.map((B) => ({ value: B, label: String(B) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : q("", !0),
                S(h) ? (a(), p("div", ea, [
                  e("div", la, [
                    e("label", {
                      id: I(x.namespace, h, "link")
                    }, "Link kind", 8, ta),
                    w[7] || (w[7] = e("span", { class: "pim-f-note" }, "owned by a plugin", -1))
                  ]),
                  i(l(ue), {
                    "aria-labelledby": I(x.namespace, h, "link"),
                    "model-value": h.config?.target ?? "",
                    "onUpdate:modelValue": (B) => N(h, B),
                    options: [{ value: "", label: "Choose…" }, ...t.options.link_kinds.map((B) => ({ value: B.kind, label: l(de)(B.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : q("", !0),
                e("div", aa, [
                  e("div", sa, [
                    e("label", {
                      id: I(x.namespace, h, "index")
                    }, "Index", 8, na),
                    w[8] || (w[8] = e("span", { class: "pim-f-note" }, "for filters and keys", -1))
                  ]),
                  i(l(ue), {
                    "aria-labelledby": I(x.namespace, h, "index"),
                    "model-value": h.index ?? "none",
                    options: P(h)?.indexes ?? ["none"],
                    appendTo: "self",
                    "onUpdate:modelValue": (B) => D(h, "index", B === "none" ? void 0 : B)
                  }, null, 8, ["aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", ia, [
                  e("div", oa, [
                    e("label", {
                      id: I(x.namespace, h, "width")
                    }, "Width", 8, da),
                    w[9] || (w[9] = e("span", { class: "pim-f-note" }, "of a form row", -1))
                  ]),
                  i(l(Be), {
                    "aria-labelledby": I(x.namespace, h, "width"),
                    "model-value": l(Ne)(t.schema, x.namespace, h),
                    options: l(c),
                    "allow-empty": !1,
                    "onUpdate:modelValue": (B) => h.width = B
                  }, null, 8, ["aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", ra, [
                  e("div", ua, [
                    e("label", {
                      id: I(x.namespace, h, "scope")
                    }, "Varies per", 8, ca),
                    w[10] || (w[10] = e("span", { class: "pim-f-note" }, "dimensions the value depends on", -1))
                  ]),
                  i(ce, {
                    labelledby: I(x.namespace, h, "scope"),
                    "model-value": h.scope ?? [],
                    options: g.value,
                    "onUpdate:modelValue": (B) => U(h, B)
                  }, null, 8, ["labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", ma, [
                  e("div", pa, [
                    e("label", {
                      for: I(x.namespace, h, "unique")
                    }, "Unique", 8, fa),
                    w[11] || (w[11] = e("span", { class: "pim-f-note" }, "one holder per value, catalog wide", -1))
                  ]),
                  e("div", va, [
                    i(l(Ue), {
                      "input-id": I(x.namespace, h, "unique"),
                      "model-value": h.unique === !0,
                      disabled: !!h.scope?.length || (h.cardinality ?? "one") !== "one",
                      "onUpdate:modelValue": (B) => D(h, "unique", B)
                    }, null, 8, ["input-id", "model-value", "disabled", "onUpdate:modelValue"]),
                    e("span", null, O(h.unique ? "Yes" : "No"), 1)
                  ])
                ]),
                (h.scope?.length ?? 0) > 0 && h.index && h.index !== "none" ? (a(), p("div", ba, [
                  e("div", ya, [
                    e("label", {
                      id: I(x.namespace, h, "contexts")
                    }, "Indexed contexts", 8, ga),
                    w[12] || (w[12] = e("span", { class: "pim-f-note" }, "which combinations get an index", -1))
                  ]),
                  e("div", {
                    class: "pim-contexts",
                    role: "group",
                    "aria-labelledby": I(x.namespace, h, "contexts")
                  }, [
                    (a(!0), p(J, null, Z(ae(h), (B, Ae) => (a(), p("div", {
                      key: Ae,
                      class: "pim-context-row"
                    }, [
                      (a(!0), p(J, null, Z(h.scope, (ke) => (a(), p("div", {
                        key: ke,
                        class: "pim-context-field"
                      }, [
                        e("span", {
                          id: I(x.namespace, h, "context-" + Ae + "-" + ke),
                          class: "small muted"
                        }, O(l(G)(ke)), 9, ka),
                        i(l(ue), {
                          "aria-labelledby": I(x.namespace, h, "context-" + Ae + "-" + ke),
                          "model-value": B[ke] ?? "",
                          options: pe(ke),
                          class: "narrow",
                          appendTo: "self",
                          "onUpdate:modelValue": (ll) => B[ke] = ll
                        }, null, 8, ["aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]))), 128)),
                      i(l(K), {
                        type: "button",
                        "aria-label": "Remove context",
                        onClick: (ke) => ae(h).splice(Ae, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: y(() => [
                          i(l(F), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ]))), 128)),
                    i(l(K), {
                      type: "button",
                      onClick: (B) => Ie(h),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: y(() => [
                        i(l(F), {
                          icon: "tabler:plus",
                          "aria-hidden": "true"
                        }),
                        w[13] || (w[13] = z(" Add context", -1))
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ], 8, ha)
                ])) : q("", !0),
                e("div", {
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": I(x.namespace, h, "default")
                }, [
                  e("div", $a, [
                    e("label", {
                      id: I(x.namespace, h, "default")
                    }, "Default", 8, wa),
                    w[14] || (w[14] = e("span", { class: "pim-f-note" }, "when no value is set", -1))
                  ]),
                  i(Rt, {
                    attribute: h,
                    type: P(h),
                    onChange: (B) => D(h, "default", B)
                  }, null, 8, ["attribute", "type", "onChange"])
                ], 8, _a),
                P(h)?.config_schema ? (a(), p("div", {
                  key: 3,
                  class: "pim-f pim-w-full",
                  role: "group",
                  "aria-labelledby": I(x.namespace, h, "config")
                }, [
                  e("div", Ca, [
                    e("label", {
                      id: I(x.namespace, h, "config")
                    }, "Type configuration", 8, Va)
                  ]),
                  i(Me, {
                    schema: P(h).config_schema,
                    "model-value": h.config ?? {},
                    "onUpdate:modelValue": (B) => C(h, B)
                  }, null, 8, ["schema", "model-value", "onUpdate:modelValue"])
                ], 8, xa)) : q("", !0)
              ]),
              e("div", Ua, [
                i(l(K), {
                  type: "button",
                  onClick: (B) => he(x, h),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: y(() => [
                    i(l(F), { icon: "tabler:trash" }),
                    w[15] || (w[15] = z(" Remove field", -1))
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
      e("section", Oa, [
        e("div", Ia, [
          i(l(ie), {
            modelValue: ve.value,
            "onUpdate:modelValue": w[3] || (w[3] = (x) => ve.value = x),
            type: "text",
            placeholder: "new_field_group",
            onKeydown: fe(le(be, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          i(l(K), {
            type: "button",
            disabled: !l(te).test(ve.value),
            onClick: be,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: y(() => [
              i(l(F), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              }),
              w[17] || (w[17] = z(" Add field group", -1))
            ]),
            _: 1
          }, 8, ["disabled"]),
          w[18] || (w[18] = e("span", { class: "muted small" }, "A field group contains fields and can be written by named sources only.", -1))
        ])
      ])
    ]));
  }
}), ja = { class: "muted small" }, Ra = { class: "pim-aspect" }, qa = {
  key: 0,
  class: "small muted"
}, Ta = { class: "pim-fields" }, za = { class: "pim-f pim-w-full" }, Da = { class: "pim-f-label" }, Na = ["id"], La = { class: "pim-f-label" }, Pa = ["id"], Ea = { class: "row pim-add-row" }, Ba = /* @__PURE__ */ X({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: k }) {
    const s = t, o = k, c = Y(() => s.draft.dimensions ?? []), f = Se();
    function v(d, r) {
      return f + "-" + d.name + "-" + r;
    }
    const g = M("");
    function u() {
      const d = g.value.trim();
      !te.test(d) || c.value.some((r) => r.name === d) || ((s.draft.dimensions ??= []).push({ name: d, members: [] }), g.value = "");
    }
    function j(d) {
      const r = [];
      for (const n of s.draft.aspects ?? []) for (const b of n.attributes ?? []) b.scope?.includes(d.name) && r.push(n.namespace + "." + b.code);
      for (const n of s.draft.families ?? []) for (const b of n.requirements ?? []) b.context && d.name in b.context && r.push(n.code + " requirement " + b.id);
      return r;
    }
    function L(d) {
      j(d).length || (c.value.splice(c.value.indexOf(d), 1), s.schema.declaration.dimensions?.some((r) => r.name === d.name) && o("remove", "dimensions", d.name));
    }
    function P(d, r) {
      if (d.members = r, d.fallback)
        for (const n of Object.keys(d.fallback)) r.includes(n) || delete d.fallback[n];
    }
    function $(d, r) {
      return d.fallback?.[r] ?? [];
    }
    function S(d, r, n) {
      const b = { ...d.fallback ?? {} };
      n.length ? b[r] = n : delete b[r], Object.keys(b).length ? d.fallback = b : delete d.fallback;
    }
    return (d, r) => (a(), T($e, {
      count: c.value.length,
      columns: ["code", "details", "usage"]
    }, {
      add: y(() => [
        e("div", Ea, [
          i(l(ie), {
            modelValue: g.value,
            "onUpdate:modelValue": r[0] || (r[0] = (n) => g.value = n),
            type: "text",
            placeholder: "new_dimension",
            onKeydown: fe(le(u, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          i(l(K), {
            type: "button",
            disabled: !l(te).test(g.value),
            onClick: u,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: y(() => [
              i(l(F), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              }),
              r[3] || (r[3] = z(" Add dimension", -1))
            ]),
            _: 1
          }, 8, ["disabled"]),
          r[4] || (r[4] = e("span", { class: "muted small" }, "A dimension lets a value differ per member, with fallbacks between members.", -1))
        ])
      ]),
      default: y(() => [
        (a(!0), p(J, null, Z(c.value, (n) => (a(), T(we, {
          title: l(G)(n.name),
          code: n.name,
          key: n.name,
          usage: j(n).length + (j(n).length === 1 ? " dependency" : " dependencies")
        }, {
          details: y(() => [
            e("span", ja, O(n.members.length) + " " + O(n.members.length === 1 ? "member" : "members"), 1)
          ]),
          actions: y(() => [
            i(l(K), {
              type: "button",
              disabled: j(n).length > 0,
              "aria-label": "Remove " + l(G)(n.name),
              title: j(n).length ? "Take the dimension off these first" : "",
              onClick: (b) => L(n),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: y(() => [
                i(l(F), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "title", "onClick"])
          ]),
          default: y(() => [
            e("div", Ra, [
              j(n).length ? (a(), p("p", qa, "Used by " + O(j(n).join(", ")), 1)) : q("", !0),
              e("div", Ta, [
                e("div", za, [
                  e("div", Da, [
                    e("label", {
                      id: v(n, "members")
                    }, "Members", 8, Na),
                    r[1] || (r[1] = e("span", { class: "pim-f-note" }, "the values this dimension takes", -1))
                  ]),
                  i(ce, {
                    labelledby: v(n, "members"),
                    "model-value": n.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (b) => P(n, b)
                  }, null, 8, ["labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                (a(!0), p(J, null, Z(n.members, (b) => (a(), p("div", {
                  key: b,
                  class: "pim-f pim-w-half"
                }, [
                  e("div", La, [
                    e("label", {
                      id: v(n, "fallback-" + encodeURIComponent(b))
                    }, O(b) + " falls back to", 9, Pa),
                    r[2] || (r[2] = e("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  i(ce, {
                    labelledby: v(n, "fallback-" + encodeURIComponent(b)),
                    "model-value": $(n, b),
                    options: n.members.filter((m) => m !== b).map((m) => ({ value: m })),
                    "onUpdate:modelValue": (m) => S(n, b, m)
                  }, null, 8, ["labelledby", "model-value", "options", "onUpdate:modelValue"])
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
}), Ma = { class: "muted small" }, Ka = { class: "pim-aspect" }, Ha = { class: "row small" }, Fa = {
  key: 1,
  class: "muted small"
}, Ja = {
  key: 2,
  class: "pim-stack tight pim-terms"
}, Wa = {
  key: 1,
  class: "pim-responsive-table"
}, Ga = {
  class: "pim-grid compact",
  "aria-label": "Vocabulary terms"
}, Ya = { key: 0 }, Za = { class: "mono" }, Qa = {
  key: 0,
  class: "mono muted"
}, Xa = { class: "num" }, es = {
  role: "list",
  class: "pim-stacked-list",
  "aria-label": "Vocabulary terms"
}, ls = { class: "pim-stacked-meta muted small" }, ts = { class: "mono" }, as = { key: 0 }, ss = {
  key: 2,
  class: "muted small"
}, ns = { class: "row wrap" }, is = { class: "row wrap pim-add-row" }, os = { class: "row pim-add-row" }, ds = /* @__PURE__ */ X({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: k }) {
    const s = t, o = k, c = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/, f = Y(() => s.schema.access.write), v = Y(() => s.draft.vocabularies ?? []), g = M("");
    function u() {
      const C = g.value.trim();
      !te.test(C) || v.value.some((N) => N.code === C) || ((s.draft.vocabularies ??= []).push({ code: C }), g.value = "");
    }
    function j(C) {
      v.value.splice(v.value.indexOf(C), 1), s.schema.declaration.vocabularies?.some((N) => N.code === C.code) && o("remove", "vocabularies", C.code);
    }
    function L(C) {
      return !!s.schema.vocabularies[C];
    }
    const P = M({}), $ = M({}), S = M({}), d = M({}), r = M({}), n = M({}), b = M({});
    async function m(C, N) {
      r.value[C] = !0, n.value[C] = "";
      try {
        const U = await se.termsPage(s.catalogId, C, N);
        $.value[C] = U.terms, d.value[C] = N, S.value[C] = U.next;
      } catch (U) {
        n.value[C] = U instanceof Error ? U.message : "Could not load terms.";
      } finally {
        r.value[C] = !1;
      }
    }
    function A(C) {
      P.value[C] = !P.value[C], P.value[C] && !$.value[C] && m(C);
    }
    function _(C) {
      return b.value[C] ?? (b.value[C] = { code: "", label: "", parent: "" });
    }
    async function I(C) {
      const N = _(C.code);
      if (!(!f.value || !c.test(N.code))) {
        r.value[C.code] = !0, n.value[C.code] = "";
        try {
          const U = { term: { vocabulary: C.code, code: N.code }, labels: { en: N.label || G(N.code) } };
          C.hierarchical && N.parent && (U.parent = N.parent);
          const ae = (await se.apply(s.catalogId, [U])).outcomes[0];
          if (ae.outcome !== "created" && ae.outcome !== "updated") throw new Error(ae.findings?.[0]?.message ?? "The term was not accepted.");
          b.value[C.code] = { code: "", label: "", parent: "" }, se.invalidateTerms(s.catalogId), await m(C.code, d.value[C.code]);
        } catch (U) {
          n.value[C.code] = U instanceof Error ? U.message : "Could not add the term.";
        } finally {
          r.value[C.code] = !1;
        }
      }
    }
    async function R(C, N, U) {
      if (f.value && !(U && !await gl.confirm({ header: "Retire term?", message: `Retire ${Ce(N)}? Term changes save immediately. You can restore this term later.`, acceptLabel: "Retire", rejectLabel: "Cancel" }))) {
        r.value[C.code] = !0, n.value[C.code] = "";
        try {
          const ae = (await se.apply(s.catalogId, [{ term: { vocabulary: C.code, code: N.code }, retired: U }])).outcomes[0];
          if (!ae || !["updated", "unchanged"].includes(ae.outcome)) throw new Error(ae?.findings?.map((pe) => pe.message ?? pe.code).join("; ") || "The term change was not accepted.");
          se.invalidateTerms(s.catalogId), await m(C.code, d.value[C.code]);
        } catch (D) {
          n.value[C.code] = D instanceof Error ? D.message : "Could not change the term.";
        } finally {
          r.value[C.code] = !1;
        }
      }
    }
    return (C, N) => (a(), T($e, {
      count: v.value.length,
      columns: ["code", "details"]
    }, {
      add: y(() => [
        e("div", os, [
          i(l(ie), {
            modelValue: g.value,
            "onUpdate:modelValue": N[0] || (N[0] = (U) => g.value = U),
            type: "text",
            placeholder: "new_vocabulary",
            onKeydown: fe(le(u, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          i(l(K), {
            type: "button",
            disabled: !l(te).test(g.value),
            onClick: u,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: y(() => [
              i(l(F), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              }),
              N[10] || (N[10] = z(" Add vocabulary", -1))
            ]),
            _: 1
          }, 8, ["disabled"]),
          N[11] || (N[11] = e("span", { class: "muted small" }, "Select fields pick their values from a vocabulary's terms.", -1))
        ])
      ]),
      default: y(() => [
        (a(!0), p(J, null, Z(v.value, (U) => (a(), T(we, {
          title: l(G)(U.code),
          code: U.code,
          key: U.code
        }, {
          details: y(() => [
            e("span", Ma, O(U.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: y(() => [
            i(l(K), {
              type: "button",
              "aria-label": "Remove " + l(G)(U.code),
              onClick: (D) => j(U),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: y(() => [
                i(l(F), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])
          ]),
          default: y(() => [
            e("div", Ka, [
              e("label", Ha, [
                i(l(Ue), {
                  "aria-label": "Hierarchical " + U.code,
                  "model-value": U.hierarchical === !0,
                  "onUpdate:modelValue": (D) => D ? U.hierarchical = !0 : delete U.hierarchical
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"]),
                N[1] || (N[1] = e("span", null, "Hierarchical", -1))
              ]),
              L(U.code) ? (a(), T(l(K), {
                key: 0,
                type: "button",
                onClick: (D) => A(U.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: y(() => [
                  i(l(F), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  z(" " + O(P.value[U.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : (a(), p("span", Fa, "Apply the schema before adding terms.")),
              P.value[U.code] ? (a(), p("div", Ja, [
                N[9] || (N[9] = e("p", { class: "muted small" }, "Term changes save immediately.", -1)),
                n.value[U.code] ? (a(), T(l(me), {
                  key: 0,
                  severity: "error",
                  role: "alert"
                }, {
                  default: y(() => [
                    z(O(n.value[U.code]) + " ", 1),
                    i(l(K), {
                      type: "button",
                      disabled: r.value[U.code],
                      onClick: (D) => m(U.code, d.value[U.code]),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: y(() => [...N[2] || (N[2] = [
                        z("Retry", -1)
                      ])]),
                      _: 1
                    }, 8, ["disabled", "onClick"])
                  ]),
                  _: 2
                }, 1024)) : q("", !0),
                ($.value[U.code] ?? []).length ? (a(), p("div", Wa, [
                  e("table", Ga, [
                    e("thead", null, [
                      e("tr", null, [
                        N[3] || (N[3] = e("th", null, "Code", -1)),
                        N[4] || (N[4] = e("th", null, "Label", -1)),
                        U.hierarchical ? (a(), p("th", Ya, "Parent")) : q("", !0),
                        N[5] || (N[5] = e("th", null, null, -1))
                      ])
                    ]),
                    e("tbody", null, [
                      (a(!0), p(J, null, Z($.value[U.code], (D) => (a(), p("tr", {
                        key: D.code,
                        class: ye({ muted: D.retired })
                      }, [
                        e("td", Za, O(D.code), 1),
                        e("td", null, O(l(Ce)(D)), 1),
                        U.hierarchical ? (a(), p("td", Qa, O(D.parent ?? ""), 1)) : q("", !0),
                        e("td", Xa, [
                          i(l(K), {
                            type: "button",
                            disabled: !f.value || r.value[U.code],
                            onClick: (ae) => R(U, D, !D.retired),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: y(() => [
                              z(O(D.retired ? "Restore" : "Retire"), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled", "onClick"])
                        ])
                      ], 2))), 128))
                    ])
                  ]),
                  e("ul", es, [
                    (a(!0), p(J, null, Z($.value[U.code], (D) => (a(), p("li", {
                      key: D.code,
                      class: ye(["pim-stacked-row", { muted: D.retired }])
                    }, [
                      e("div", null, O(l(Ce)(D)), 1),
                      e("div", ls, [
                        e("span", ts, O(D.code), 1),
                        U.hierarchical && D.parent ? (a(), p("span", as, "Parent: " + O(D.parent), 1)) : q("", !0)
                      ]),
                      i(l(K), {
                        type: "button",
                        disabled: !f.value || r.value[U.code],
                        onClick: (ae) => R(U, D, !D.retired),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: y(() => [
                          z(O(D.retired ? "Restore" : "Retire"), 1)
                        ]),
                        _: 2
                      }, 1032, ["disabled", "onClick"])
                    ], 2))), 128))
                  ])
                ])) : r.value[U.code] ? q("", !0) : (a(), p("p", ss, "No terms yet.")),
                e("div", ns, [
                  i(l(K), {
                    type: "button",
                    disabled: r.value[U.code] || !d.value[U.code],
                    onClick: (D) => m(U.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: y(() => [
                      i(l(F), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      N[6] || (N[6] = z(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  i(l(K), {
                    type: "button",
                    disabled: r.value[U.code] || !S.value[U.code],
                    onClick: (D) => m(U.code, S.value[U.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: y(() => [
                      i(l(F), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      N[7] || (N[7] = z(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                e("div", is, [
                  i(l(ie), {
                    modelValue: _(U.code).code,
                    "onUpdate:modelValue": (D) => _(U.code).code = D,
                    disabled: !f.value || r.value[U.code],
                    type: "text",
                    placeholder: "code",
                    class: "mono narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  i(l(ie), {
                    modelValue: _(U.code).label,
                    "onUpdate:modelValue": (D) => _(U.code).label = D,
                    disabled: !f.value || r.value[U.code],
                    type: "text",
                    placeholder: "Label (en)"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  U.hierarchical ? (a(), T(l(ue), {
                    key: 0,
                    modelValue: _(U.code).parent,
                    "onUpdate:modelValue": (D) => _(U.code).parent = D,
                    disabled: !f.value || r.value[U.code],
                    class: "narrow",
                    options: [{ value: "", label: "No parent" }, ...($.value[U.code] ?? []).map((D) => ({ value: D.code, label: String(l(Ce)(D)) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "options"])) : q("", !0),
                  i(l(K), {
                    type: "button",
                    disabled: !f.value || r.value[U.code] || !c.test(_(U.code).code),
                    onClick: (D) => I(U),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: y(() => [
                      i(l(F), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      N[8] || (N[8] = z(" Add term", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])
              ])) : q("", !0)
            ])
          ]),
          _: 2
        }, 1032, ["title", "code"]))), 128))
      ]),
      _: 1
    }, 8, ["count"]));
  }
}), rs = { class: "muted small" }, us = { class: "pim-aspect" }, cs = { class: "pim-fields" }, ms = { class: "pim-f pim-w-full" }, ps = { class: "pim-f-label" }, fs = ["id"], vs = { class: "pim-aspect" }, bs = { class: "pim-stack tight" }, ys = { class: "pim-level-head" }, gs = { class: "pim-fields" }, hs = { class: "pim-f pim-w-half" }, ks = { class: "pim-f-label" }, _s = ["id"], $s = { class: "pim-f pim-w-half" }, ws = { class: "pim-f-label" }, xs = ["id"], Cs = { class: "pim-aspect" }, Vs = { class: "pim-stack tight" }, Us = { class: "pim-level-head" }, Ss = { class: "mono" }, Os = { class: "pim-fields" }, Is = { class: "pim-f-label" }, As = ["id"], js = { class: "pim-f pim-w-half" }, Rs = { class: "pim-f-label" }, qs = ["id"], Ts = { class: "pim-f pim-w-half" }, zs = { class: "pim-f-label" }, Ds = ["id"], Ns = { class: "row pim-add-row" }, Ls = { class: "row pim-add-row" }, Ps = /* @__PURE__ */ X({
  __name: "BuilderFamilies",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: k }) {
    const s = t, o = k, c = Se();
    function f(_, I) {
      return c + "-" + _.code + "-" + I;
    }
    const v = Y(() => (s.draft.families ?? []).filter((_) => _.code !== "generic")), g = Y(() => {
      const _ = (s.draft.aspects ?? []).map((R) => R.namespace), I = [...new Set(Object.entries(s.schema.attributes).filter(([, R]) => R.plugin).map(([R]) => R.split(".")[0]))];
      return [..._, ...I.filter((R) => !_.includes(R))].map((R) => ({ value: R, label: G(R) }));
    });
    function u(_) {
      const I = [];
      for (const R of s.draft.aspects ?? []) if (_.aspects?.includes(R.namespace)) for (const C of R.attributes ?? []) I.push({ value: R.namespace + "." + C.code, label: G(C.code) + " (" + R.namespace + ")" });
      for (const [R, C] of Object.entries(s.schema.attributes)) C.plugin && _.aspects?.includes(R.split(".")[0]) && !I.some((N) => N.value === R) && I.push({ value: R, label: G(R) + " (" + R.split(".")[0] + ")" });
      return I;
    }
    const j = Y(() => s.draft.dimensions ?? []), L = M("");
    function P() {
      const _ = L.value.trim();
      !te.test(_) || (s.draft.families ?? []).some((I) => I.code === _) || ((s.draft.families ??= []).push({ code: _, aspects: [] }), L.value = "");
    }
    function $(_) {
      s.draft.families.splice(s.draft.families.indexOf(_), 1), s.schema.declaration.families?.some((I) => I.code === _.code) && o("remove", "families", _.code);
    }
    function S(_) {
      return _.variation ?? [];
    }
    function d(_) {
      (_.variation ??= []).push({ axes: [] });
    }
    function r(_) {
      return _.requirements ?? [];
    }
    const n = M({});
    function b(_) {
      const I = (n.value[_.code] ?? "").trim();
      !te.test(I) || r(_).some((R) => R.id === I) || ((_.requirements ??= []).push({ id: I, require: [] }), n.value[_.code] = "");
    }
    function m(_, I) {
      return _.context?.[I] ?? "";
    }
    function A(_, I, R) {
      const C = { ..._.context ?? {} };
      R ? C[I] = R : delete C[I], Object.keys(C).length ? _.context = C : delete _.context;
    }
    return (_, I) => (a(), T($e, {
      count: v.value.length,
      columns: ["code", "details"]
    }, {
      add: y(() => [
        e("div", Ls, [
          i(l(ie), {
            modelValue: L.value,
            "onUpdate:modelValue": I[0] || (I[0] = (R) => L.value = R),
            type: "text",
            placeholder: "new_family",
            onKeydown: fe(le(P, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          i(l(K), {
            type: "button",
            disabled: !l(te).test(L.value),
            onClick: P,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: y(() => [
              i(l(F), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              }),
              I[11] || (I[11] = z(" Add family", -1))
            ]),
            _: 1
          }, 8, ["disabled"]),
          I[12] || (I[12] = e("span", { class: "muted small" }, "Products without a family use the generic one.", -1))
        ])
      ]),
      default: y(() => [
        (a(!0), p(J, null, Z(v.value, (R) => (a(), T(we, {
          title: l(G)(R.code),
          code: R.code,
          key: R.code
        }, {
          details: y(() => [
            e("span", rs, O(R.aspects?.length ?? 0) + " " + O(R.aspects?.length === 1 ? "field group" : "field groups"), 1)
          ]),
          actions: y(() => [
            i(l(K), {
              type: "button",
              onClick: (C) => $(R),
              "aria-label": "Remove " + l(G)(R.code),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: y(() => [
                i(l(F), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick", "aria-label"])
          ]),
          default: y(() => [
            e("div", us, [
              e("div", cs, [
                e("div", ms, [
                  e("div", ps, [
                    e("label", {
                      id: f(R, "groups")
                    }, "Field groups", 8, fs),
                    I[1] || (I[1] = e("span", { class: "pim-f-note" }, "the fields this family's products carry", -1))
                  ]),
                  i(ce, {
                    labelledby: f(R, "groups"),
                    "model-value": R.aspects ?? [],
                    options: g.value,
                    "onUpdate:modelValue": (C) => l(xe)(R, "aspects", C)
                  }, null, 8, ["labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            e("div", vs, [
              I[5] || (I[5] = e("header", { class: "pim-aspect-head" }, [
                e("h3", null, "Variation"),
                e("span", { class: "muted small" }, "model → variants → items; each level owns axes that make its children distinct")
              ], -1)),
              e("div", bs, [
                (a(!0), p(J, null, Z(S(R), (C, N) => (a(), p("div", {
                  key: N,
                  class: "pim-level"
                }, [
                  e("div", ys, [
                    e("strong", null, "Level " + O(N + 1), 1),
                    i(l(K), {
                      type: "button",
                      "aria-label": "Remove level",
                      onClick: (U) => S(R).splice(N, 1),
                      text: "",
                      severity: "secondary",
                      size: "small"
                    }, {
                      default: y(() => [
                        i(l(F), { icon: "tabler:x" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  e("div", gs, [
                    e("div", hs, [
                      e("div", ks, [
                        e("label", {
                          id: f(R, N + "-axes")
                        }, "Axes", 8, _s),
                        I[2] || (I[2] = e("span", { class: "pim-f-note" }, "key-indexed, one value each", -1))
                      ]),
                      i(ce, {
                        labelledby: f(R, N + "-axes"),
                        "model-value": C.axes ?? [],
                        options: u(R),
                        "onUpdate:modelValue": (U) => C.axes = U
                      }, null, 8, ["labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ]),
                    e("div", $s, [
                      e("div", ws, [
                        e("label", {
                          id: f(R, N + "-owned")
                        }, "Also owned here", 8, xs),
                        I[3] || (I[3] = e("span", { class: "pim-f-note" }, "other fields written at this level", -1))
                      ]),
                      i(ce, {
                        labelledby: f(R, N + "-owned"),
                        "model-value": C.own ?? [],
                        options: u(R),
                        "onUpdate:modelValue": (U) => U.length ? C.own = U : delete C.own
                      }, null, 8, ["labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ])
                  ])
                ]))), 128)),
                i(l(K), {
                  type: "button",
                  onClick: (C) => d(R),
                  severity: "secondary",
                  outlined: "",
                  size: "small"
                }, {
                  default: y(() => [
                    i(l(F), {
                      icon: "tabler:plus",
                      "aria-hidden": "true"
                    }),
                    I[4] || (I[4] = z(" Add level", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ]),
            e("div", Cs, [
              I[10] || (I[10] = e("header", { class: "pim-aspect-head" }, [
                e("h3", null, "Requirements"),
                e("span", { class: "muted small" }, "what a channel needs before a product is ready")
              ], -1)),
              e("div", Vs, [
                (a(!0), p(J, null, Z(r(R), (C, N) => (a(), p("div", {
                  key: C.id,
                  class: "pim-level"
                }, [
                  e("div", Us, [
                    e("strong", Ss, O(C.id), 1),
                    i(l(K), {
                      type: "button",
                      "aria-label": "Remove requirement",
                      onClick: (U) => r(R).splice(N, 1),
                      text: "",
                      severity: "secondary",
                      size: "small"
                    }, {
                      default: y(() => [
                        i(l(F), { icon: "tabler:x" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  e("div", Os, [
                    (a(!0), p(J, null, Z(j.value, (U) => (a(), p("div", {
                      key: U.name,
                      class: "pim-f pim-w-third"
                    }, [
                      e("div", Is, [
                        e("label", {
                          id: f(R, C.id + "-context-" + U.name)
                        }, O(l(G)(U.name)), 9, As),
                        I[6] || (I[6] = e("span", { class: "pim-f-note" }, "context", -1))
                      ]),
                      i(l(ue), {
                        "aria-labelledby": f(R, C.id + "-context-" + U.name),
                        "model-value": m(C, U.name),
                        "onUpdate:modelValue": (D) => A(C, U.name, D),
                        options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ...U.members.map((D) => ({ value: D, label: String(D) }))],
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self"
                      }, null, 8, ["aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                    ]))), 128)),
                    e("div", js, [
                      e("div", Rs, [
                        e("label", {
                          id: f(R, C.id + "-required")
                        }, "Required", 8, qs),
                        I[7] || (I[7] = e("span", { class: "pim-f-note" }, "must hold a value", -1))
                      ]),
                      i(ce, {
                        labelledby: f(R, C.id + "-required"),
                        "model-value": C.require ?? [],
                        options: u(R),
                        "onUpdate:modelValue": (U) => l(xe)(C, "require", U)
                      }, null, 8, ["labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ]),
                    e("div", Ts, [
                      e("div", zs, [
                        e("label", {
                          id: f(R, C.id + "-authored")
                        }, "Authored", 8, Ds),
                        I[8] || (I[8] = e("span", { class: "pim-f-note" }, "must be set in the context itself, not by fallback", -1))
                      ]),
                      i(ce, {
                        labelledby: f(R, C.id + "-authored"),
                        "model-value": C.authored ?? [],
                        options: u(R),
                        "onUpdate:modelValue": (U) => l(xe)(C, "authored", U)
                      }, null, 8, ["labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ])
                  ])
                ]))), 128)),
                e("div", Ns, [
                  i(l(ie), {
                    modelValue: n.value[R.code],
                    "onUpdate:modelValue": (C) => n.value[R.code] = C,
                    type: "text",
                    "aria-label": "New requirement code",
                    placeholder: "requirement_id",
                    onKeydown: fe(le((C) => b(R), ["prevent"]), ["enter"]),
                    class: "mono narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                  i(l(K), {
                    type: "button",
                    disabled: !l(te).test(n.value[R.code] ?? ""),
                    onClick: (C) => b(R),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: y(() => [
                      i(l(F), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      I[9] || (I[9] = z(" Add requirement", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])
              ])
            ])
          ]),
          _: 2
        }, 1032, ["title", "code"]))), 128))
      ]),
      _: 1
    }, 8, ["count"]));
  }
}), Es = ["inert"], Bs = {
  key: 0,
  class: "row wrap"
}, Ms = {
  key: 2,
  class: "small muted"
}, Ks = { class: "pim-principal-service" }, Hs = /* @__PURE__ */ X({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: k }) {
    const s = t, o = k, c = M(!1), f = M(""), v = M({});
    let g = 0;
    re(() => s.modelValue, async ($) => {
      const S = ++g;
      try {
        const d = await Qe(s.catalogId ?? "", $);
        S === g && (v.value = d);
      } catch {
        S === g && (v.value = {});
      }
    }, { immediate: !0, deep: !0 }), Oe(() => {
      g++;
    });
    function u($) {
      return v.value[$] ?? de($, "Person");
    }
    Ee(async () => {
      try {
        await hl("wc-principal-picker"), c.value = !0;
      } catch {
        c.value = !1;
      }
    });
    function j($) {
      s.disabled || !$.trim() || s.modelValue.includes($.trim()) || (o("update:modelValue", [...s.modelValue, $.trim()]), f.value = "");
    }
    function L($) {
      const S = $.detail;
      if (!S || typeof S != "object") return;
      const d = S, r = d.principal_id ?? d.id;
      typeof r == "string" && j(r);
    }
    function P($) {
      s.disabled || o("update:modelValue", s.modelValue.filter((S) => S !== $));
    }
    return ($, S) => (a(), p("div", {
      class: "pim-principal-list",
      inert: t.disabled || void 0
    }, [
      t.modelValue.length ? (a(), p("div", Bs, [
        (a(!0), p(J, null, Z(t.modelValue, (d) => (a(), T(l(ne), {
          key: d,
          severity: "secondary"
        }, {
          default: y(() => [
            e("span", null, O(u(d)), 1),
            i(l(K), {
              text: "",
              size: "small",
              disabled: t.disabled,
              "aria-label": "Remove " + u(d),
              onClick: (r) => P(d)
            }, {
              default: y(() => [
                i(l(F), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : q("", !0),
      c.value ? (a(), p("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: le(L, ["stop"])
      }, null, 32)) : (a(), p("span", Ms, "The person picker is unavailable.")),
      e("label", Ks, [
        S[3] || (S[3] = e("span", { class: "small muted" }, "Service account", -1)),
        i(l(ie), {
          modelValue: f.value,
          "onUpdate:modelValue": S[0] || (S[0] = (d) => f.value = d),
          disabled: t.disabled,
          placeholder: "Service principal id",
          onKeydown: S[1] || (S[1] = fe(le((d) => j(f.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "disabled"])
      ]),
      i(l(K), {
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: t.disabled || !f.value.trim(),
        onClick: S[2] || (S[2] = (d) => j(f.value))
      }, {
        default: y(() => [
          i(l(F), { icon: "tabler:plus" }),
          S[4] || (S[4] = z(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, Es));
  }
}), Fs = { class: "pim-stack" }, Js = { class: "muted small" }, Ws = { class: "pim-fields" }, Gs = { class: "pim-f pim-w-half" }, Ys = { class: "pim-f-label" }, Zs = ["id"], Qs = { class: "pim-f pim-w-half" }, Xs = { class: "pim-f-label" }, en = ["id"], ln = { class: "row pim-add-row" }, tn = { class: "muted small" }, an = { class: "pim-fields" }, sn = { class: "pim-f pim-w-third" }, nn = { class: "pim-f-label" }, on = ["id"], dn = { class: "pim-f pim-w-third" }, rn = { class: "pim-f-label" }, un = ["for"], cn = { class: "row" }, mn = ["aria-labelledby"], pn = { class: "pim-f-label" }, fn = ["id"], vn = { class: "pim-f pim-w-full" }, bn = { class: "pim-f-label" }, yn = ["id"], gn = { class: "row pim-add-row" }, hn = /* @__PURE__ */ X({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: k }) {
    const s = t, o = k, c = Se();
    function f(b, m) {
      return c + "-" + b + "-" + m;
    }
    const v = Y(() => s.draft.channels ?? []), g = Y(() => s.draft.sources ?? []), u = Y(() => [...new Set((s.draft.families ?? []).flatMap((b) => (b.requirements ?? []).map((m) => m.id)))].map((b) => ({ value: b }))), j = Y(() => (s.draft.families ?? []).filter((b) => b.code !== "generic").map((b) => ({ value: b.code, label: G(b.code) }))), L = Y(() => (s.draft.aspects ?? []).map((b) => ({ value: b.namespace, label: G(b.namespace) }))), P = M(""), $ = M("");
    function S() {
      const b = P.value.trim();
      !te.test(b) || v.value.some((m) => m.id === b) || ((s.draft.channels ??= []).push({ id: b, requirements: [] }), P.value = "");
    }
    function d(b) {
      v.value.splice(v.value.indexOf(b), 1), s.schema.declaration.channels?.some((m) => m.id === b.id) && o("remove", "channels", b.id);
    }
    function r() {
      const b = $.value.trim();
      !te.test(b) || g.value.some((m) => m.id === b) || ((s.draft.sources ??= []).push({ id: b, ordering: "none", writes: [] }), $.value = "");
    }
    function n(b) {
      g.value.splice(g.value.indexOf(b), 1), s.schema.declaration.sources?.some((m) => m.id === b.id) && o("remove", "sources", b.id);
    }
    return (b, m) => (a(), p("div", Fs, [
      i($e, {
        count: v.value.length,
        columns: ["code", "details"]
      }, {
        head: y(() => [...m[2] || (m[2] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Channels")
          ], -1)
        ])]),
        add: y(() => [
          e("div", ln, [
            i(l(ie), {
              modelValue: P.value,
              "onUpdate:modelValue": m[0] || (m[0] = (A) => P.value = A),
              type: "text",
              placeholder: "new_channel",
              onKeydown: fe(le(S, ["prevent"]), ["enter"]),
              class: "mono"
            }, null, 8, ["modelValue", "onKeydown"]),
            i(l(K), {
              type: "button",
              disabled: !l(te).test(P.value),
              onClick: S,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: y(() => [
                i(l(F), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                }),
                m[5] || (m[5] = z(" Add channel", -1))
              ]),
              _: 1
            }, 8, ["disabled"])
          ])
        ]),
        default: y(() => [
          (a(!0), p(J, null, Z(v.value, (A) => (a(), T(we, {
            key: A.id,
            title: l(G)(A.id),
            code: A.id
          }, {
            details: y(() => [
              e("span", Js, O(A.requirements?.length ?? 0) + " " + O(A.requirements?.length === 1 ? "requirement" : "requirements"), 1)
            ]),
            actions: y(() => [
              i(l(K), {
                type: "button",
                onClick: (_) => d(A),
                "aria-label": "Remove " + l(G)(A.id),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: y(() => [
                  i(l(F), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick", "aria-label"])
            ]),
            default: y(() => [
              e("div", Ws, [
                e("div", Gs, [
                  e("div", Ys, [
                    e("label", {
                      id: f(A.id, "requirements")
                    }, "Requirements", 8, Zs),
                    m[3] || (m[3] = e("span", { class: "pim-f-note" }, "a product is ready for the channel when these hold", -1))
                  ]),
                  i(ce, {
                    labelledby: f(A.id, "requirements"),
                    "model-value": A.requirements ?? [],
                    options: u.value,
                    "onUpdate:modelValue": (_) => l(xe)(A, "requirements", _)
                  }, null, 8, ["labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", Qs, [
                  e("div", Xs, [
                    e("label", {
                      id: f(A.id, "families")
                    }, "Families", 8, en),
                    m[4] || (m[4] = e("span", { class: "pim-f-note" }, "empty means every family", -1))
                  ]),
                  i(ce, {
                    labelledby: f(A.id, "families"),
                    "model-value": A.families ?? [],
                    options: j.value,
                    "onUpdate:modelValue": (_) => l(xe)(A, "families", _)
                  }, null, 8, ["labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, 1032, ["title", "code"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      i($e, {
        count: g.value.length,
        columns: ["code", "details"]
      }, {
        head: y(() => [...m[6] || (m[6] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Sources")
          ], -1)
        ])]),
        add: y(() => [
          e("div", gn, [
            i(l(ie), {
              modelValue: $.value,
              "onUpdate:modelValue": m[1] || (m[1] = (A) => $.value = A),
              type: "text",
              placeholder: "new_source",
              onKeydown: fe(le(r, ["prevent"]), ["enter"]),
              class: "mono"
            }, null, 8, ["modelValue", "onKeydown"]),
            i(l(K), {
              type: "button",
              disabled: !l(te).test($.value),
              onClick: r,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: y(() => [
                i(l(F), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                }),
                m[11] || (m[11] = z(" Add source", -1))
              ]),
              _: 1
            }, 8, ["disabled"])
          ])
        ]),
        default: y(() => [
          (a(!0), p(J, null, Z(g.value, (A) => (a(), T(we, {
            key: A.id,
            title: l(G)(A.id),
            code: A.id
          }, {
            details: y(() => [
              e("span", tn, O(A.writes?.length ?? 0) + " " + O(A.writes?.length === 1 ? "field group" : "field groups"), 1)
            ]),
            actions: y(() => [
              i(l(K), {
                type: "button",
                onClick: (_) => n(A),
                "aria-label": "Remove " + l(G)(A.id),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: y(() => [
                  i(l(F), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick", "aria-label"])
            ]),
            default: y(() => [
              e("div", an, [
                e("div", sn, [
                  e("div", nn, [
                    e("label", {
                      id: f(A.id, "ordering")
                    }, "Ordering", 8, on),
                    m[7] || (m[7] = e("span", { class: "pim-f-note" }, "sequence keeps late deliveries from winning", -1))
                  ]),
                  i(l(ue), {
                    "aria-labelledby": f(A.id, "ordering"),
                    "model-value": A.ordering ?? "none",
                    "onUpdate:modelValue": (_) => A.ordering = _,
                    options: [{ value: "none", label: "none" }, { value: "sequence", label: "sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                e("div", dn, [
                  e("div", rn, [
                    e("label", {
                      for: f(A.id, "audit")
                    }, "Audit", 8, un),
                    m[8] || (m[8] = e("span", { class: "pim-f-note" }, "record each value change", -1))
                  ]),
                  e("div", cn, [
                    i(l(Ue), {
                      "input-id": f(A.id, "audit"),
                      "model-value": A.audit !== !1,
                      "onUpdate:modelValue": (_) => _ ? delete A.audit : A.audit = !1
                    }, null, 8, ["input-id", "model-value", "onUpdate:modelValue"]),
                    e("span", null, O(A.audit === !1 ? "Off for this source" : "As the catalog policy"), 1)
                  ])
                ]),
                e("div", {
                  class: "pim-f pim-w-third",
                  role: "group",
                  "aria-labelledby": f(A.id, "people")
                }, [
                  e("div", pn, [
                    e("label", {
                      id: f(A.id, "people")
                    }, "People and service accounts", 8, fn),
                    m[9] || (m[9] = e("span", { class: "pim-f-note" }, "who may write as this source", -1))
                  ]),
                  i(Hs, {
                    "catalog-id": t.catalogId,
                    "model-value": A.principals ?? [],
                    "onUpdate:modelValue": (_) => l(xe)(A, "principals", _)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])
                ], 8, mn),
                e("div", vn, [
                  e("div", bn, [
                    e("label", {
                      id: f(A.id, "writes")
                    }, "Writes", 8, yn),
                    m[10] || (m[10] = e("span", { class: "pim-f-note" }, "field groups this source may set", -1))
                  ]),
                  i(ce, {
                    labelledby: f(A.id, "writes"),
                    "model-value": A.writes ?? [],
                    options: L.value,
                    "onUpdate:modelValue": (_) => l(xe)(A, "writes", _)
                  }, null, 8, ["labelledby", "model-value", "options", "onUpdate:modelValue"])
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
}), kn = { class: "pim-stack" }, _n = { class: "pim-bsection-head" }, $n = { class: "muted small" }, wn = {
  key: 0,
  class: "pim-aspect muted"
}, xn = {
  key: 1,
  class: "muted small"
}, Cn = {
  key: 3,
  class: "muted small"
}, Vn = {
  key: 0,
  class: "pim-aspect muted"
}, Un = { class: "row wrap muted small" }, Sn = /* @__PURE__ */ X({
  __name: "BuilderPlugins",
  props: {
    draft: {},
    schema: {},
    options: {},
    pluginConfigs: { default: () => ({}) }
  },
  emits: ["remove", "configure"],
  setup(t, { emit: k }) {
    const s = t, o = k, c = /* @__PURE__ */ new Map([
      ["eq", "Equals"],
      ["in", "Is one of"],
      ["gt", "Greater than"],
      ["gte", "At least"],
      ["lt", "Less than"],
      ["lte", "At most"]
    ]), f = {
      pending: "Setting up",
      ready: "Ready",
      failed: "Setup failed"
    };
    function v(n, b) {
      const m = b.map((A) => c.get(A)).filter(Boolean);
      return [G(n), m.join(", ")].filter(Boolean).join(" · ");
    }
    const g = Y(() => s.draft.plugins ?? []);
    function u(n) {
      return g.value.some((b) => b.use === n.plugin);
    }
    function j(n) {
      return s.schema.plugins.find((b) => b.plugin === n.plugin);
    }
    function L(n, b) {
      b && !u(n) && (s.draft.plugins ??= []).push({ use: n.plugin }), b || (s.draft.plugins = g.value.filter((m) => m.use !== n.plugin), delete s.pluginConfigs[n.plugin], j(n)?.active && o("remove", "plugins", n.plugin));
    }
    function P(n, b) {
      s.pluginConfigs[n.plugin] = b;
    }
    function $(n) {
      return Object.entries(s.schema.attributes).filter(([, b]) => b.plugin === n.plugin).map(([b]) => G(b));
    }
    const S = Y(() => s.draft.scopes ?? []);
    function d(n) {
      return S.value.includes(n.id);
    }
    function r(n, b) {
      b && !d(n) && (s.draft.scopes ??= []).push(n.id), !b && d(n) && (S.value.splice(S.value.indexOf(n.id), 1), s.schema.declaration.scopes?.includes(n.id) && o("remove", "scopes", n.id));
    }
    return (n, b) => (a(), p("div", kn, [
      i($e, {
        count: t.options.plugins.length,
        columns: ["details"]
      }, {
        head: y(() => [
          e("header", _n, [
            b[0] || (b[0] = e("h3", null, "Plugins", -1)),
            e("span", $n, O(t.options.plugins.length) + " installed", 1)
          ])
        ]),
        default: y(() => [
          t.options.plugins.length === 0 ? (a(), p("div", wn, "No plugin is installed.")) : q("", !0),
          (a(!0), p(J, null, Z(t.options.plugins, (m) => (a(), T(we, {
            key: m.plugin,
            title: l(de)(m.title, "Plugin")
          }, {
            details: y(() => [
              i(l(ne), {
                severity: u(m) ? "success" : "secondary",
                value: u(m) ? "Active" : "Inactive"
              }, null, 8, ["severity", "value"])
            ]),
            actions: y(() => [
              i(l(Ue), {
                "aria-label": "Enable " + l(de)(m.title, "Plugin"),
                "model-value": u(m),
                "onUpdate:modelValue": (A) => L(m, A)
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
            ]),
            default: y(() => [
              j(m)?.problem ? (a(), T(l(me), {
                key: 0,
                severity: "warn"
              }, {
                default: y(() => [
                  z(O(j(m)?.problem?.message) + " ", 1),
                  e("code", null, O(j(m)?.problem?.code), 1)
                ]),
                _: 2
              }, 1024)) : q("", !0),
              $(m).length ? (a(), p("p", xn, "Fields: " + O($(m).join(", ")) + ".", 1)) : q("", !0),
              u(m) ? (a(), T(Me, {
                key: 2,
                schema: m.config_schema,
                "model-value": t.pluginConfigs[m.plugin] ?? j(m)?.config ?? {},
                "onUpdate:modelValue": (A) => P(m, A)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue"])) : q("", !0),
              j(m)?.active ? (a(), p("p", Cn, [
                z(O(f[j(m).lifecycle.state]) + " ", 1),
                (a(!0), p(J, null, Z(j(m)?.projections, (A, _) => (a(), p("span", { key: _ }, " · " + O(l(G)(l(de)(_, "Background update"))) + ": " + O(A.parked ? "Paused" : A.bootstrapping ? "Starting" : "Ready"), 1))), 128))
              ])) : q("", !0),
              j(m)?.active && t.pluginConfigs[m.plugin] ? (a(), T(l(K), {
                key: 4,
                label: "Save configuration",
                onClick: (A) => o("configure", m.plugin, t.pluginConfigs[m.plugin])
              }, null, 8, ["onClick"])) : q("", !0)
            ]),
            _: 2
          }, 1032, ["title"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      i($e, {
        count: t.options.scopes.length,
        columns: ["details"]
      }, {
        head: y(() => [...b[1] || (b[1] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Scopes"),
            e("span", { class: "muted small" }, "Filters added by plugins")
          ], -1)
        ])]),
        default: y(() => [
          t.options.scopes.length === 0 ? (a(), p("div", Vn, "No scope is declared.")) : q("", !0),
          (a(!0), p(J, null, Z(t.options.scopes, (m) => (a(), T(we, {
            key: m.id,
            title: l(de)(m.title, "Scope")
          }, {
            details: y(() => [
              i(l(ne), {
                severity: d(m) ? "success" : "secondary",
                value: d(m) ? "Adopted" : "Not adopted"
              }, null, 8, ["severity", "value"])
            ]),
            actions: y(() => [
              i(l(Ue), {
                "aria-label": "Adopt " + l(de)(m.title, "Scope"),
                "model-value": d(m),
                "onUpdate:modelValue": (A) => r(m, A)
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
            ]),
            default: y(() => [
              e("div", Un, [
                b[2] || (b[2] = e("span", null, "Filters", -1)),
                (a(!0), p(J, null, Z(m.filters, (A, _) => (a(), T(l(ne), {
                  key: _,
                  class: "kx-tag-sm small",
                  severity: "secondary",
                  value: v(_, A.ops)
                }, null, 8, ["value"]))), 128)),
                e("span", null, O(l(G)(m.access)) + " access required", 1)
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
async function On(t) {
  const k = await sl(`/api/v1/pim-admin/catalogs/${encodeURIComponent(t)}/policy_defaults`, "policy defaults");
  if (k.audit !== "fields" && k.audit !== "off" || !["audit_days", "trash_days", "tombstone_days"].every((s) => typeof k[s] == "number" && Number.isSafeInteger(k[s])))
    throw new Error("Policy defaults are unavailable.");
  for (const [s, o] of Object.entries(el)) {
    const c = k[s];
    if (typeof c != "number" || !Number.isSafeInteger(c) || c < o.min || c > o.max) throw new Error(`Policy ${s} is unavailable.`);
  }
  return k;
}
const el = {
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
}, In = { class: "form" }, An = {
  key: 0,
  class: "muted small pim-policy-status",
  role: "status"
}, jn = ["id", "data-policy-group", "aria-label"], Rn = {
  key: 0,
  class: "pim-bsection-head"
}, qn = { class: "pim-policy-copy" }, Tn = ["for"], zn = ["id"], Dn = { key: 0 }, Nn = ["aria-expanded"], Ln = /* @__PURE__ */ X({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {}
  },
  setup(t) {
    const k = t, s = M(), o = Y(() => k.defaults ?? s.value), c = M(""), f = M(!1);
    async function v() {
      if (!k.defaults) {
        c.value = "", f.value = !0;
        try {
          s.value = await On(k.catalogId ?? "");
        } catch (b) {
          c.value = b instanceof Error ? b.message : "Could not read policy defaults.";
        } finally {
          f.value = !1;
        }
      }
    }
    Ee(v);
    const g = Y(() => k.draft.policy ?? {}), u = M(!1), j = [
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
    function P(b) {
      const m = el[b];
      return { key: b, ...m, kind: "int", hint: L[b] };
    }
    j.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(P));
    const $ = ["proposal_days", "proposal_count"].map(P), S = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(P), d = [
      { id: "retention", title: "Retention", keys: j },
      { id: "proposals", title: "Proposals", keys: $ },
      { id: "advanced", title: "", keys: S }
    ], r = Y(() => [
      { value: "inherited", label: o.value ? `${o.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function n(b, m) {
      const A = k.draft.policy ?? (k.draft.policy = {});
      A[b] = m == null || m === "" || m === "inherited" ? !1 : m;
    }
    return (b, m) => (a(), p("section", In, [
      m[4] || (m[4] = e("p", { class: "muted small pim-policy-intro" }, "Empty fields inherit the deployment settings.", -1)),
      f.value ? (a(), p("p", An, "Loading deployment defaults…")) : q("", !0),
      c.value ? (a(), T(l(me), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: y(() => [
          z(O(c.value) + " ", 1),
          i(l(K), {
            severity: "secondary",
            outlined: "",
            onClick: v
          }, {
            default: y(() => [...m[1] || (m[1] = [
              z("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      })) : q("", !0),
      (a(), p(J, null, Z(d, (A) => (a(), p(J, {
        key: A.id
      }, [
        A.id !== "advanced" || u.value ? (a(), p("section", {
          key: 0,
          id: A.id === "advanced" ? "policy-advanced" : void 0,
          "data-policy-group": A.id,
          class: "pim-policy-group",
          "aria-label": A.title || "Advanced"
        }, [
          A.title ? (a(), p("header", Rn, [
            e("h3", null, O(A.title), 1)
          ])) : q("", !0),
          (a(!0), p(J, null, Z(A.keys, (_) => (a(), p("div", {
            key: _.key,
            class: "pim-policy-row"
          }, [
            e("div", qn, [
              e("label", {
                for: "pol-" + _.key
              }, O(_.title), 9, Tn),
              e("p", {
                id: "pol-help-" + _.key
              }, [
                z(O(_.hint), 1),
                _.global ? (a(), p("span", Dn, " Managed in deployment settings.")) : q("", !0)
              ], 8, zn)
            ]),
            _.kind === "enum" ? (a(), T(l(ue), {
              key: 0,
              "input-id": "pol-" + _.key,
              "aria-describedby": "pol-help-" + _.key,
              class: "pim-policy-control",
              "model-value": typeof g.value[_.key] == "string" ? g.value[_.key] : "inherited",
              options: r.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": (I) => n(_.key, I)
            }, null, 8, ["input-id", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])) : (a(), T(l($l), {
              key: 1,
              disabled: _.global,
              "input-id": "pol-" + _.key,
              "aria-describedby": "pol-help-" + _.key,
              class: "pim-policy-control",
              "model-value": _.global ? Number(o.value?.[_.key] ?? 0) || null : typeof g.value[_.key] == "number" ? Number(g.value[_.key]) : null,
              min: _.min ?? (_.key === "audit_days" ? 0 : 1),
              max: _.max,
              step: 1,
              placeholder: o.value ? "Default: " + o.value[_.key] : "Deployment default",
              "onUpdate:modelValue": (I) => n(_.key, I)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "min", "max", "placeholder", "onUpdate:modelValue"]))
          ]))), 128))
        ], 8, jn)) : q("", !0),
        A.id === "proposals" ? (a(), p("button", {
          key: 1,
          type: "button",
          class: "pim-policy-advanced",
          "aria-expanded": u.value,
          "aria-controls": "policy-advanced",
          onClick: m[0] || (m[0] = (_) => u.value = !u.value)
        }, [
          i(l(F), {
            icon: u.value ? "tabler:chevron-down" : "tabler:chevron-right",
            "aria-hidden": "true"
          }, null, 8, ["icon"]),
          m[2] || (m[2] = e("span", null, "Advanced", -1)),
          m[3] || (m[3] = e("span", { class: "muted small" }, "Processing limits and deployment settings", -1))
        ], 8, Nn)) : q("", !0)
      ], 64))), 64))
    ]));
  }
}), Pn = { class: "form" }, En = { class: "pim-aspect" }, Bn = /* @__PURE__ */ X({
  __name: "BuilderDeclaration",
  props: {
    draft: {}
  },
  emits: ["replace", "validity"],
  setup(t, { emit: k }) {
    const s = t, o = k, c = M(JSON.stringify(s.draft, null, 2)), f = M("");
    Oe(() => o("validity", !0)), re(() => s.draft, (g) => {
      c.value = JSON.stringify(g, null, 2), f.value = "";
    }, { deep: !0 });
    function v() {
      try {
        const g = Ol(c.value);
        f.value = "", o("validity", !0), o("replace", g);
      } catch (g) {
        o("validity", !1), f.value = "Invalid declaration: " + (g instanceof Error ? g.message : String(g));
      }
    }
    return (g, u) => (a(), p("section", Pn, [
      e("div", En, [
        u[1] || (u[1] = e("header", { class: "pim-aspect-head" }, [
          e("h3", null, "Declaration"),
          e("span", { class: "muted small" }, "edits apply to the draft when the JSON parses")
        ], -1)),
        f.value ? (a(), T(l(me), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: y(() => [
            z(O(f.value), 1)
          ]),
          _: 1
        })) : q("", !0),
        i(l(wl), {
          modelValue: c.value,
          "onUpdate:modelValue": u[0] || (u[0] = (j) => c.value = j),
          rows: "28",
          spellcheck: "false",
          onInput: v,
          onBlur: v,
          class: "mono pim-json-edit"
        }, null, 8, ["modelValue"])
      ])
    ]));
  }
}), Mn = {
  key: 0,
  class: "pim-detail-head"
}, Kn = { class: "pim-detail-actions" }, Hn = { class: "pim-settings-pane" }, Fn = { class: "pim-builder-main pim-readable" }, Jn = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, Wn = ["disabled", "inert"], Gn = {
  key: 6,
  class: "pim-table pim-plan"
}, Yn = { class: "pim-group-head" }, Zn = { class: "pim-card-body pad" }, Qn = {
  key: 0,
  class: "muted"
}, Xn = {
  key: 1,
  class: "muted small"
}, ei = {
  key: 2,
  class: "muted small"
}, li = {
  key: 3,
  class: "muted small"
}, ti = { key: 0 }, ai = {
  key: 5,
  class: "pim-plan-list"
}, si = { class: "mono" }, ni = { class: "muted" }, ii = /* @__PURE__ */ X({
  __name: "SchemaBuilder",
  props: {
    catalogId: {},
    embedded: { type: Boolean },
    title: {},
    backLabel: {}
  },
  emits: ["applied", "back", "dirty-changed"],
  setup(t, { emit: k }) {
    const s = t, o = k, c = [
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
    ], f = M("fields"), v = M(null), g = M(null), u = M({}), j = M({}), L = M({}), P = Y(() => Object.fromEntries(Object.entries(L.value).filter(([W]) => u.value.plugins?.some((E) => E.use === W) && !v.value?.plugins.some((E) => E.plugin === W && E.active)))), $ = M(""), S = M(!1), d = M(""), r = M(null), n = M(null), b = M(!0), m = qe(), A = Y(() => b.value && !!r.value && r.value.class !== "refused" && !!n.value?.matches(pe.value, v.value?.schema_generation ?? -1, P.value)), _ = qe(), I = M(!1);
    let R = 0;
    re([u, j, L], () => {
      R++, r.value = null;
    }, { deep: !0, flush: "sync" });
    async function C(W = !1, E = !1) {
      if (D.value && !W) return;
      const H = _.begin(), he = R, V = s.catalogId, w = E ? Object.entries(L.value).filter(([x]) => v.value?.plugins.some((h) => h.plugin === x && h.active)) : [];
      I.value = !0, $.value = "";
      try {
        const [x, h] = await Promise.all([se.schema(V), se.schemaOptions(V)]);
        if (!_.current(H) || he !== R || V !== s.catalogId) return;
        v.value = x, g.value = h, u.value = je(x.declaration), j.value = {}, L.value = Object.fromEntries(w.filter(([ee]) => x.plugins.some((B) => B.plugin === ee && B.active))), r.value = null, b.value = !0;
      } catch (x) {
        _.current(H) && ($.value = x instanceof Error ? x.message : "Could not load the schema.");
      } finally {
        _.current(H) && (I.value = !1);
      }
    }
    let N = () => {
    };
    re(() => s.catalogId, (W) => {
      N(), N = Ye(`component.${W}`, () => {
        D.value || C();
      });
    }, { immediate: !0 }), Pe(async () => {
      D.value || await C();
    }), Oe(() => {
      N(), m.begin(), _.begin();
    }), re(() => s.catalogId, () => {
      m.begin(), S.value = !1, v.value = null, g.value = null, ve(), C();
    });
    const U = Y(() => Object.values(He(u.value, j.value)).reduce((W, E) => W + (E?.length ?? 0), 0)), D = Y(() => !!v.value && (JSON.stringify(u.value) !== JSON.stringify(v.value.declaration) || U.value > 0 || Object.keys(L.value).length > 0));
    re(D, (W) => o("dirty-changed", W), { immediate: !0 });
    const ae = Y(() => ![u.value.aspects, u.value.dimensions, u.value.vocabularies, u.value.families, u.value.channels, u.value.sources, u.value.plugins, u.value.scopes].some((W) => W?.length)), pe = Y(() => {
      const W = je(u.value), E = He(W, j.value);
      return Object.keys(E).length && (W.remove = E), W;
    });
    re(D, (W) => {
      W || (r.value = null);
    }), re([pe, P], () => {
      r.value = null;
    }, { deep: !0 });
    async function Ie() {
      if (!v.value || !b.value) return;
      const W = m.begin(), E = Vl(pe.value, v.value.schema_generation, P.value);
      S.value = !0, $.value = "";
      try {
        const H = await se.planSchema(s.catalogId, E.declaration, E.generation, E.pluginConfigs);
        if (!m.current(W) || !E.matches(pe.value, v.value.schema_generation, P.value) || !b.value) return;
        n.value = E, r.value = H;
      } catch (H) {
        if (!m.current(W)) return;
        $.value = H instanceof Error ? H.message : "Could not review the change.", r.value = null, n.value = null;
      } finally {
        m.current(W) && (S.value = !1);
      }
    }
    async function ge() {
      if (!v.value || !D.value || !A.value || !n.value) return;
      const W = s.catalogId, E = m.begin();
      S.value = !0, $.value = "", d.value = "";
      try {
        const H = await se.applySchema(W, n.value.declaration, n.value.generation, n.value.pluginConfigs);
        if (W !== s.catalogId || !m.current(E) || (await C(!0, !0), W !== s.catalogId || !m.current(E))) return;
        d.value = `Applied as generation ${H.generation} (${H.class})`, o("applied", H.generation);
      } catch (H) {
        if (W !== s.catalogId || !m.current(E)) return;
        $.value = H instanceof Error ? H.message : "Could not apply the change.";
      } finally {
        m.current(E) && (S.value = !1);
      }
    }
    async function Te(W, E) {
      const H = s.catalogId, he = _.begin(), V = m.begin();
      S.value = !0, $.value = "";
      try {
        const w = JSON.stringify(E);
        if (await se.configurePlugin(H, W, je(E)), H !== s.catalogId || !_.current(he)) return;
        const x = await se.schema(H);
        if (H !== s.catalogId || !_.current(he)) return;
        v.value && (v.value.plugins = x.plugins), JSON.stringify(L.value[W]) === w && delete L.value[W], d.value = "Configuration saved";
      } catch (w) {
        H === s.catalogId && m.current(V) && ($.value = w instanceof Error ? w.message : "Could not save configuration.");
      } finally {
        m.current(V) && (S.value = !1);
      }
    }
    function ve() {
      L.value = {}, b.value = !0, v.value && (u.value = je(v.value.declaration)), j.value = {}, r.value = null, d.value = "";
    }
    function be(W, E) {
      const H = j.value[W] ?? [];
      H.includes(E) || (j.value = { ...j.value, [W]: [...H, E] });
    }
    return (W, E) => (a(), p("div", {
      class: ye(["pim-builder", { embedded: t.embedded }])
    }, [
      t.embedded ? (a(), p("div", Mn, [
        e("h2", null, O(t.title || "Catalog"), 1),
        i(l(ne), {
          severity: "secondary",
          value: "Generation " + (v.value?.schema_generation ?? "…")
        }, null, 8, ["value"]),
        e("div", Kn, [
          oe(W.$slots, "actions", {
            access: v.value?.access
          }),
          i(We, {
            access: v.value?.access,
            "apply-label": f.value === "layout" ? "Apply layout" : "Apply",
            dirty: D.value,
            busy: S.value,
            valid: b.value,
            reviewed: !!r.value,
            "can-apply": A.value,
            onDiscard: ve,
            onReview: Ie,
            onApply: ge
          }, null, 8, ["access", "apply-label", "dirty", "busy", "valid", "reviewed", "can-apply"])
        ])
      ])) : (a(), T(vt, {
        key: 1,
        title: t.title || "Catalog",
        subtitle: "Settings · generation " + (v.value?.schema_generation ?? "…"),
        icon: "tabler:settings",
        "back-label": t.backLabel,
        onBack: E[0] || (E[0] = (H) => o("back"))
      }, {
        default: y(() => [
          oe(W.$slots, "actions", {
            access: v.value?.access
          }),
          i(We, {
            access: v.value?.access,
            "apply-label": f.value === "layout" ? "Apply layout" : "Apply",
            dirty: D.value,
            busy: S.value,
            valid: b.value,
            reviewed: !!r.value,
            "can-apply": A.value,
            onDiscard: ve,
            onReview: Ie,
            onApply: ge
          }, null, 8, ["access", "apply-label", "dirty", "busy", "valid", "reviewed", "can-apply"])
        ]),
        _: 3
      }, 8, ["title", "subtitle", "back-label"])),
      i(l(vl), {
        value: f.value,
        "onUpdate:value": E[1] || (E[1] = (H) => f.value = H),
        class: "pim-section-tabs"
      }, {
        default: y(() => [
          i(l(bl), { "aria-label": "Schema sections" }, {
            default: y(() => [
              (a(), p(J, null, Z(c, (H) => i(l(yl), {
                key: H.id,
                value: H.id
              }, {
                default: y(() => [
                  z(O(H.title), 1)
                ]),
                _: 2
              }, 1032, ["value"])), 64))
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["value"]),
      e("div", Hn, [
        e("div", Fn, [
          $.value ? (a(), T(l(me), {
            key: 0,
            severity: "error",
            role: "alert"
          }, {
            default: y(() => [
              z(O($.value), 1)
            ]),
            _: 1
          })) : q("", !0),
          d.value ? (a(), T(l(me), {
            key: 1,
            severity: "success"
          }, {
            default: y(() => [
              z(O(d.value), 1)
            ]),
            _: 1
          })) : q("", !0),
          I.value && (!v.value || !g.value) ? (a(), p("div", Jn, "Loading…")) : (!v.value || !g.value) && $.value ? (a(), T(l(K), {
            key: 3,
            onClick: E[2] || (E[2] = (H) => C()),
            severity: "secondary",
            outlined: ""
          }, {
            default: y(() => [...E[5] || (E[5] = [
              z("Retry", -1)
            ])]),
            _: 1
          })) : v.value && g.value && f.value === "history" ? (a(), T(rt, {
            key: 4,
            "catalog-id": t.catalogId
          }, null, 8, ["catalog-id"])) : v.value && g.value ? (a(), p("fieldset", {
            key: 5,
            class: "pim-editor-surface",
            disabled: S.value || !v.value.access.admin,
            inert: S.value || !v.value.access.admin
          }, [
            ae.value && f.value === "fields" ? (a(), T(l(me), {
              key: 0,
              severity: "info"
            }, {
              default: y(() => [...E[6] || (E[6] = [
                z("Define its schema. Add a field group to start defining fields.", -1)
              ])]),
              _: 1
            })) : q("", !0),
            f.value === "fields" ? (a(), T(Aa, {
              key: 1,
              draft: u.value,
              schema: v.value,
              options: g.value,
              onRemove: be
            }, null, 8, ["draft", "schema", "options"])) : f.value === "layout" ? (a(), T(Fl, {
              key: 2,
              draft: u.value,
              schema: v.value,
              types: g.value.types
            }, null, 8, ["draft", "schema", "types"])) : f.value === "dimensions" ? (a(), T(Ba, {
              key: 3,
              draft: u.value,
              schema: v.value,
              onRemove: be
            }, null, 8, ["draft", "schema"])) : f.value === "vocabularies" ? (a(), T(ds, {
              key: 4,
              "catalog-id": t.catalogId,
              draft: u.value,
              schema: v.value,
              onRemove: be
            }, null, 8, ["catalog-id", "draft", "schema"])) : f.value === "families" ? (a(), T(Ps, {
              key: 5,
              draft: u.value,
              schema: v.value,
              onRemove: be
            }, null, 8, ["draft", "schema"])) : f.value === "channels" ? (a(), T(hn, {
              key: 6,
              "catalog-id": t.catalogId,
              draft: u.value,
              schema: v.value,
              onRemove: be
            }, null, 8, ["catalog-id", "draft", "schema"])) : f.value === "plugins" ? (a(), T(Sn, {
              key: 7,
              draft: u.value,
              schema: v.value,
              options: g.value,
              "plugin-configs": L.value,
              onConfigure: Te,
              onRemove: be
            }, null, 8, ["draft", "schema", "options", "plugin-configs"])) : f.value === "policy" ? (a(), T(Ln, {
              key: 8,
              "catalog-id": t.catalogId,
              draft: u.value
            }, null, 8, ["catalog-id", "draft"])) : f.value === "declaration" ? (a(), T(Bn, {
              key: 9,
              draft: u.value,
              onReplace: E[3] || (E[3] = (H) => u.value = H),
              onValidity: E[4] || (E[4] = (H) => {
                b.value = H, r.value = null;
              })
            }, null, 8, ["draft"])) : q("", !0)
          ], 8, Wn)) : q("", !0),
          r.value ? (a(), p("div", Gn, [
            e("div", Yn, [
              i(l(F), { icon: "tabler:checklist" }),
              E[7] || (E[7] = e("h3", null, "Review", -1)),
              i(l(ne), {
                class: "kx-tag-sm",
                severity: r.value.class === "refused" ? "danger" : r.value.class === "semantic" ? "warn" : "info"
              }, {
                default: y(() => [
                  z(O(r.value.class), 1)
                ]),
                _: 1
              }, 8, ["severity"])
            ]),
            e("div", Zn, [
              r.value.class === "unchanged" ? (a(), p("p", Qn, "Nothing would change.")) : r.value.class === "cosmetic" ? (a(), p("p", Xn, "Labels, order, widths or choices only; no product is touched.")) : r.value.class === "additive" ? (a(), p("p", ei, "New fields or options; existing values stay as they are.")) : r.value.class === "semantic" ? (a(), p("p", li, "Resolved values or readiness change; the catalog rebuilds its rows after apply.")) : (a(), T(l(me), {
                key: 4,
                severity: "error"
              }, {
                default: y(() => [
                  E[8] || (E[8] = z("Refused: the draft cannot be compiled as it stands.", -1)),
                  r.value.migration ? (a(), p("span", ti, O(r.value.migration), 1)) : q("", !0)
                ]),
                _: 1
              })),
              r.value.changes.length || r.value.refused.length ? (a(), p("ul", ai, [
                (a(!0), p(J, null, Z([...r.value.refused, ...r.value.changes], (H, he) => (a(), p("li", { key: he }, [
                  i(l(ne), {
                    class: "kx-tag-sm small",
                    severity: H.class === "refused" ? "danger" : H.class === "semantic" ? "warn" : "info"
                  }, {
                    default: y(() => [
                      z(O(H.class), 1)
                    ]),
                    _: 2
                  }, 1032, ["severity"]),
                  e("span", si, O(H.code), 1),
                  e("span", ni, O(H.what), 1)
                ]))), 128))
              ])) : q("", !0)
            ])
          ])) : q("", !0)
        ])
      ])
    ], 2));
  }
}), oi = /* @__PURE__ */ X({
  __name: "SettingsApp",
  setup(t) {
    const k = nl(), s = il(), o = M(""), c = Y(() => k.value.catalogId ?? ""), f = qe();
    async function v() {
      const g = f.begin(), u = c.value;
      try {
        const j = await se.catalogSummary(u);
        f.current(g) && (o.value = j?.title || "Untitled catalog");
      } catch {
        f.current(g) && (o.value = "Untitled catalog");
      }
    }
    return re(c, () => {
      o.value = "", v();
    }), Pe(v), Oe(() => {
      f.begin();
    }), (g, u) => c.value ? (a(), T(ii, {
      key: c.value,
      "catalog-id": c.value,
      title: o.value || "Catalog",
      embedded: l(k).embedded,
      "back-label": l(k).embedded ? void 0 : "Back to catalog settings",
      onBack: u[0] || (u[0] = (j) => l(s)("navigate", { route: "" })),
      onDirtyChanged: u[1] || (u[1] = (j) => l(s)("dirty-changed", { dirty: j }))
    }, {
      actions: y(({ access: j }) => [
        j?.admin ? (a(), T(Cl, {
          key: 0,
          "catalog-id": c.value,
          title: o.value || "Catalog"
        }, null, 8, ["catalog-id", "title"])) : q("", !0)
      ]),
      _: 1
    }, 8, ["catalog-id", "title", "embedded", "back-label"])) : q("", !0);
  }
});
class di extends ol {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "catalog-id": { type: "string", default: "" }, embedded: { type: "boolean", default: !1 } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: dl
    };
  }
  static get vueConfig() {
    return { rootComponent: oi, plugins: [rl] };
  }
}
kl(import.meta.url, di);
