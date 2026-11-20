import { e as Ye, c as nl, u as Be, _ as Ne, r as ze, p as ne, a as Ce, b as il, A as ol, g as dl, S as ul, d as rl, f as cl, W as ml, s as pl, P as vl } from "./styles-WQmxKEFi.js";
import { defineComponent as X, ref as L, openBlock as l, createElementBlock as o, Fragment as E, createVNode as p, unref as t, withCtx as b, createTextVNode as z, createCommentVNode as U, createBlock as I, toDisplayString as S, computed as H, renderList as J, createElementVNode as e, withModifiers as ae, normalizeStyle as qe, normalizeClass as ye, useId as fl, watch as ue, onUnmounted as Ae, resolveDynamicComponent as yl, renderSlot as re, provide as bl, inject as gl, useModel as hl, mergeModels as Fe, withKeys as ve, createSlots as ie, onMounted as Ze } from "vue";
import P from "primevue/button";
import he from "primevue/message";
import { Icon as F } from "@iconify/vue";
import oe from "primevue/tag";
import kl from "primevue/tabs";
import $l from "primevue/tablist";
import wl from "primevue/tab";
import Me from "primevue/selectbutton";
import { on as Qe, host as Xe, loadByTagName as _l, define as Cl } from "@wippy-fe/proxy";
import xl from "primevue/multiselect";
import Se from "primevue/toggleswitch";
import ce from "primevue/select";
import de from "primevue/inputtext";
import Vl from "primevue/inputnumber";
import Ul from "primevue/textarea";
const Sl = ["config"], Al = /* @__PURE__ */ X({
  __name: "CatalogShare",
  props: {
    catalogId: {},
    title: {}
  },
  setup(a) {
    const $ = a, s = L(!1), m = L(!1), d = L("");
    async function h() {
      m.value = !0, d.value = "", await Ye("kickside-share") ? s.value = !0 : d.value = "Could not open sharing. Try Share again.", m.value = !1;
    }
    return (r, g) => (l(), o(E, null, [
      p(t(P), {
        type: "button",
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: m.value,
        onClick: h
      }, {
        default: b(() => [...g[1] || (g[1] = [
          z("Share", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      s.value ? (l(), o("kickside-share", {
        key: 0,
        config: JSON.stringify({ resource_id: $.catalogId, title: $.title, access_url: `/api/v1/component-access/grants/${encodeURIComponent($.catalogId)}`, share_url: `/api/v1/component-access/share/${encodeURIComponent($.catalogId)}` }),
        onClose: g[0] || (g[0] = (v) => s.value = !1)
      }, null, 40, Sl)) : U("", !0),
      d.value ? (l(), I(t(he), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: b(() => [
          z(S(d.value), 1)
        ]),
        _: 1
      })) : U("", !0)
    ], 64));
  }
});
function Ol(a, $, s = {}) {
  const m = JSON.stringify(a), d = JSON.stringify(s);
  return {
    declaration: JSON.parse(m),
    generation: $,
    pluginConfigs: JSON.parse(d),
    matches: (h, r, g = {}) => $ === r && m === JSON.stringify(h) && d === JSON.stringify(g)
  };
}
function Je(a, $) {
  const s = {};
  for (const [m, d] of Object.entries($)) {
    const h = d.filter((r) => m === "plugins" ? !a.plugins?.some((g) => g.use === r) : m === "scopes" ? !a.scopes?.includes(r) : m === "attributes" ? !a.aspects?.some((g) => g.attributes?.some((v) => g.namespace + "." + v.code === r)) : m === "aspects" ? !a.aspects?.some((g) => g.namespace === r) : m === "dimensions" ? !a.dimensions?.some((g) => g.name === r) : m === "vocabularies" || m === "families" ? !a[m]?.some((g) => g.code === r) : !a[m]?.some((g) => g.id === r));
    h.length && (s[m] = h);
  }
  return s;
}
const We = (a) => !!a && typeof a == "object" && !Array.isArray(a), Y = ["string"], el = { "*": "string" }, Rl = { id: "number", code: "string!", type: "string!", scope: Y, cardinality: "string", index: "string", index_contexts: [el], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, Il = {
  dimensions: [{ name: "string!", members: Y, fallback: { "*": Y } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: Y }, attributes: [Rl] }],
  families: [{ code: "string!", aspects: Y, variation: [{ axes: Y, own: Y }], requirements: [{ id: "string!", context: el, require: Y, authored: Y }], checks: [{ check: "string!", reads: Y, cost: "string", config: "object", enforce: "string" }] }],
  sources: [{ id: "string!", ordering: "string", writes: Y, principals: Y, audit: "boolean" }],
  channels: [{ id: "string!", requirements: Y, families: Y }],
  plugins: [{ use: "string!", schema: "json" }],
  scopes: Y,
  policy: { "*": "policy" },
  remove: { dimensions: Y, vocabularies: Y, aspects: Y, families: Y, sources: Y, channels: Y, attributes: Y, scopes: Y, plugins: Y }
};
function Le(a, $, s) {
  if (typeof $ == "string") {
    const m = $.replace("!", "");
    if (!(m === "json" || (m === "object" ? We(a) : m === "policy" ? a === !1 || typeof a == "string" || typeof a == "number" : typeof a === m)) || $.endsWith("!") && (typeof a != "string" || !a.trim())) throw new Error(`${s} has an invalid ${m} value.`);
  } else if (Array.isArray($)) {
    if (!Array.isArray(a)) throw new Error(`${s} must be an array.`);
    a.forEach((m, d) => Le(m, $[0], `${s}[${d}]`));
  } else {
    if (!We(a)) throw new Error(`${s} must be an object.`);
    for (const [m, d] of Object.entries($)) if (typeof d == "string" && d.endsWith("!") && a[m] === void 0) throw new Error(`${s}.${m} is required.`);
    for (const [m, d] of Object.entries(a)) {
      const h = $[m] ?? $["*"];
      if (!h) throw new Error(`${s}.${m} is not an editor field.`);
      Le(d, h, `${s}.${m}`);
    }
  }
}
function jl(a) {
  const $ = JSON.parse(a);
  Le($, Il, "Declaration");
  const s = $;
  for (const m of s.dimensions ?? []) m.members ??= [];
  return s;
}
function je(a) {
  return JSON.parse(JSON.stringify(a));
}
const se = /^[a-z][a-z0-9_]*$/;
function we(a, $, s) {
  s.length ? a[$] = s : delete a[$];
}
function _e(a, $, s) {
  if (s < 0 || s >= a.length || $ === s) return;
  const [m] = a.splice($, 1);
  a.splice(s, 0, m);
}
function pe(a, $) {
  return !a || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(a) ? $ : a;
}
async function ll(a, $) {
  const s = [...new Set($)].map((d) => ({ type: "user", id: d }));
  if (!s.length) return {};
  const m = await nl(`/api/v1/pim-admin/catalogs/${encodeURIComponent(a)}/principal_labels`, { refs: s }, "People");
  return Object.fromEntries((m.principals ?? []).map((d) => [d.id, pe(d.label, "Person")]));
}
const Te = [
  { value: "quarter", label: "¼", span: 3 },
  { value: "third", label: "⅓", span: 4 },
  { value: "half", label: "½", span: 6 },
  { value: "full", label: "1", span: 12 }
];
function Pe(a, $, s) {
  return s.width ?? a.attributes[$ + "." + s.code]?.width ?? "half";
}
const Tl = (a) => new Date(a).toLocaleString();
function Ee(a) {
  const $ = Math.abs(a.m).toString(), s = a.m < 0 ? "-" : "";
  if (a.e >= 0) return s + $ + "0".repeat(a.e);
  const m = -a.e, d = $.padStart(m + 1, "0");
  return s + d.slice(0, d.length - m) + "." + d.slice(d.length - m);
}
function W(a) {
  const s = (a.includes(".") ? a.slice(a.indexOf(".") + 1) : a).replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return s ? s[0].toUpperCase() + s.slice(1) : a;
}
function Ue(a) {
  return a.labels.en ?? Object.values(a.labels)[0] ?? a.code;
}
function De(a, $) {
  if (a == null) return "";
  const s = (m) => {
    if (m == null) return "";
    if (typeof m == "object" && "ref" in m) {
      const d = m;
      if (d.ref[0] === "term") {
        const h = d.ref[1].slice(d.ref[1].indexOf(":") + 1), r = d.ref[1].slice(0, d.ref[1].indexOf(":")), g = $?.[r]?.find((v) => v.code === h);
        return g ? Ue(g) : h;
      }
      return "Linked " + W(d.ref[0]).toLocaleLowerCase();
    }
    if (typeof m == "object" && "v" in m) {
      const d = m;
      return Ee(d.v) + " " + d.u;
    }
    return typeof m == "object" && "m" in m ? Ee(m) : typeof m == "boolean" ? m ? "Yes" : "No" : typeof m == "object" ? JSON.stringify(m) : pe(String(m), "Linked record");
  };
  return Array.isArray(a) ? a.map(s).join(", ") : s(a);
}
function zl(a, $, s) {
  const m = De($), d = De(s);
  return !d && m ? `${a} cleared (was ${m})` : m ? `${a}: ${m} → ${d}` : `${a} set to ${d}`;
}
const Dl = { class: "pim-table form pim-layout" }, Nl = {
  key: 0,
  class: "pim-layout-help muted"
}, ql = {
  key: 1,
  class: "kx-empty"
}, Ll = { class: "pim-aspect-head" }, Pl = {
  key: 0,
  class: "muted small"
}, El = ["draggable", "onDragstart", "onDragover", "onDrop"], Bl = { class: "pim-lcard-top" }, Ml = {
  key: 0,
  class: "pim-grip",
  "aria-hidden": "true"
}, Kl = { class: "pim-lcard-name" }, Hl = { class: "pim-lcard-type" }, Fl = {
  key: 1,
  class: "pim-lcard-move"
}, Jl = { class: "pim-aspect-head" }, Wl = { class: "pim-canvas" }, Gl = { class: "pim-lcard-top" }, Yl = { class: "pim-lcard-name" }, Zl = { class: "pim-lcard-type" }, Ql = /* @__PURE__ */ X({
  __name: "LayoutEditor",
  props: {
    draft: {},
    schema: {}
  },
  setup(a) {
    const $ = a, s = H(() => $.schema.access.admin), m = H(() => $.draft?.aspects ?? []), d = H(() => {
      if (!$.schema) return [];
      const w = new Set(($.draft?.aspects ?? []).map((u) => u.namespace)), i = /* @__PURE__ */ new Map();
      for (const [u, n] of Object.entries($.schema.attributes)) {
        const f = u.split(".")[0];
        w.has(f) || !n.plugin || (i.has(f) || i.set(f, { aspect: f, plugin: n.plugin, codes: [] }), i.get(f).codes.push(u));
      }
      return [...i.values()];
    });
    function h(w, i) {
      return Te.find((u) => u.value === Pe($.schema, w, i))?.span ?? 6;
    }
    const r = L(null), g = L(null);
    function v(w, i, u) {
      s.value && (r.value = { ns: w, index: i }, u.dataTransfer?.setData("text/plain", w + ":" + i), u.dataTransfer && (u.dataTransfer.effectAllowed = "move"));
    }
    function A(w, i, u) {
      !r.value || r.value.ns !== w || (u.preventDefault(), g.value = { ns: w, index: i });
    }
    function T(w, i) {
      s.value && r.value?.ns === w.namespace && _e(w.attributes ?? [], r.value.index, i), r.value = null, g.value = null;
    }
    function M() {
      r.value = null, g.value = null;
    }
    function x(w, i) {
      const n = $.schema?.attributes[w + "." + i.code]?.type ?? i.type;
      return n.includes(":") ? n.slice(n.indexOf(":") + 1).replace(/_/g, " ") : n;
    }
    return (w, i) => (l(), o("div", Dl, [
      s.value ? (l(), o("p", Nl, "Arrange fields within each group and choose their widths. Review changes before applying the layout.")) : U("", !0),
      m.value.length === 0 ? (l(), o("div", ql, [
        i[1] || (i[1] = z("This catalog has no field groups yet.", -1)),
        s.value ? (l(), o(E, { key: 0 }, [
          z(" Add a field group in Fields.")
        ], 64)) : U("", !0)
      ])) : U("", !0),
      (l(!0), o(E, null, J(m.value, (u) => (l(), o("section", {
        key: u.namespace,
        class: "pim-aspect"
      }, [
        e("header", Ll, [
          e("h3", null, S(t(W)(u.namespace)), 1),
          s.value ? (l(), o("span", Pl, "drag a field, or use its arrows")) : U("", !0)
        ]),
        e("div", {
          class: "pim-canvas",
          onDragover: i[0] || (i[0] = ae(() => {
          }, ["prevent"]))
        }, [
          (l(!0), o(E, null, J(u.attributes ?? [], (n, f) => (l(), o("div", {
            key: n.code,
            class: ye(["pim-lcard", { dragging: r.value?.ns === u.namespace && r.value?.index === f, over: g.value?.ns === u.namespace && g.value?.index === f }]),
            style: qe({ gridColumn: "span " + h(u.namespace, n) }),
            draggable: s.value,
            onDragstart: (_) => v(u.namespace, f, _),
            onDragover: (_) => A(u.namespace, f, _),
            onDrop: ae((_) => T(u, f), ["prevent"]),
            onDragend: M
          }, [
            e("div", Bl, [
              s.value ? (l(), o("span", Ml, [
                p(t(F), { icon: "tabler:grip-vertical" })
              ])) : U("", !0),
              e("span", Kl, S(t(W)(n.code)), 1),
              e("span", Hl, S(x(u.namespace, n)), 1),
              s.value ? (l(), o("span", Fl, [
                p(t(P), {
                  type: "button",
                  disabled: f === 0,
                  "aria-label": "Move " + t(W)(n.code) + " earlier",
                  onClick: (_) => t(_e)(u.attributes ?? [], f, f - 1),
                  class: "arrow",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: b(() => [
                    p(t(F), { icon: "tabler:arrow-left" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                p(t(P), {
                  type: "button",
                  disabled: f === (u.attributes ?? []).length - 1,
                  "aria-label": "Move " + t(W)(n.code) + " later",
                  onClick: (_) => t(_e)(u.attributes ?? [], f, f + 1),
                  class: "arrow",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: b(() => [
                    p(t(F), { icon: "tabler:arrow-right" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ])) : U("", !0)
            ]),
            p(t(Me), {
              disabled: !s.value,
              "model-value": t(Pe)(a.schema, u.namespace, n),
              options: t(Te),
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Width of " + t(W)(n.code),
              "onUpdate:modelValue": (_) => n.width = _
            }, null, 8, ["disabled", "model-value", "options", "aria-label", "onUpdate:modelValue"])
          ], 46, El))), 128))
        ], 32)
      ]))), 128)),
      (l(!0), o(E, null, J(d.value, (u) => (l(), o("section", {
        key: u.aspect,
        class: "pim-aspect"
      }, [
        e("header", Jl, [
          e("h3", null, S(t(W)(u.aspect)), 1),
          i[2] || (i[2] = e("span", { class: "muted small" }, "Provided by a plugin", -1))
        ]),
        e("div", Wl, [
          (l(!0), o(E, null, J(u.codes, (n) => (l(), o("div", {
            key: n,
            class: "pim-lcard fixed",
            style: qe({ gridColumn: "span " + (t(Te).find((f) => f.value === a.schema.attributes[n].width)?.span ?? 6) })
          }, [
            e("div", Gl, [
              e("span", Yl, S(t(W)(n)), 1),
              e("span", Zl, S(a.schema.attributes[n].type.replace("kickside.pim.types:", "").replace(/_/g, " ")), 1)
            ])
          ], 4))), 128))
        ])
      ]))), 128))
    ]));
  }
}), Xl = {
  class: "pim-history",
  "aria-label": "Catalog history"
}, ea = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, la = { class: "pim-table pim-responsive-table" }, aa = ["id"], ta = ["aria-labelledby"], sa = {
  key: 0,
  scope: "col"
}, na = { class: "muted small" }, ia = ["datetime"], oa = {
  key: 0,
  class: "small"
}, da = {
  key: 0,
  class: "muted"
}, ua = { class: "mono small" }, ra = {
  key: 0,
  class: "muted"
}, ca = {
  key: 0,
  class: "muted small"
}, ma = ["aria-labelledby"], pa = { class: "pim-stacked-meta muted small" }, va = { key: 0 }, fa = { key: 1 }, ya = ["datetime"], ba = {
  key: 1,
  class: "kx-empty"
}, ga = { class: "pim-table-foot" }, ha = /* @__PURE__ */ X({
  __name: "HistoryPanel",
  props: {
    catalogId: {},
    canResolveActors: { type: Boolean }
  },
  setup(a) {
    const $ = a, s = L([]), m = L({}), d = L(), h = L(!1), r = L(), g = ze(), v = fl(), A = H(() => s.value.map((i) => ({
      key: `${i.seq}:${i.n}`,
      at: i.at,
      date: Tl(i.at),
      actor: m.value[i.actor] ?? pe(i.actor, "Person"),
      source: i.source,
      product: M(i),
      context: i.ctx,
      change: x(i)
    })));
    async function T(i = !1) {
      const u = g.begin();
      h.value = !0, r.value = void 0;
      try {
        const n = await ne.history($.catalogId, { limit: 50, before: i ? d.value : void 0 });
        if (!g.current(u)) return;
        if (s.value = i ? [...s.value, ...n.entries] : n.entries, d.value = n.next, $.canResolveActors)
          try {
            const f = await ll($.catalogId, n.entries.map((_) => _.actor));
            g.current(u) && (m.value = { ...m.value, ...f });
          } catch {
          }
      } catch (n) {
        if (!g.current(u)) return;
        r.value = Ce(n, "Could not load the history.");
      } finally {
        g.current(u) && (h.value = !1);
      }
    }
    function M(i) {
      return i.sku ? i.sku : i.subject.startsWith("p:") ? "purged product" : i.subject.startsWith("t:") ? i.subject.slice(2) : i.subject.startsWith("r:") ? "Release" : pe(i.subject, "Catalog");
    }
    function x(i) {
      if (i.attribute)
        return zl(W(i.attribute), i.before, i.after);
      switch (i.kind) {
        case "schema":
          return "Schema generation " + String(i.after?.generation ?? "");
        case "term": {
          const u = i.after ?? {}, n = u.labels?.en ?? Object.values(u.labels ?? {})[0];
          return u.retired ? "Term retired" : n ? `Term labelled "${n}"` + (u.parent ? ` under ${u.parent}` : "") : "Term changed";
        }
        case "created": {
          const u = i.after ?? {};
          return `Created as ${W(u.family ?? "product")}` + (u.level ? ` at level ${u.level}` : "");
        }
        case "released": {
          const u = i.after ?? {};
          return `Released v${u.version ?? ""} to ${(u.channels ?? []).join(", ")}`;
        }
        case "withdrawn":
          return `Withdrawn from ${((i.after ?? {}).channels ?? []).join(", ")}`;
        case "status":
          return `Status ${String(i.before ?? "")} → ${String(i.after ?? "")}`;
        case "moved":
          return "Moved under another parent";
        default:
          return W(i.kind);
      }
    }
    let w = () => {
    };
    return ue(() => $.catalogId, () => {
      w(), g.begin(), s.value = [], m.value = {}, d.value = void 0, r.value = void 0, w = Qe(`component.${$.catalogId}`, () => {
        T();
      });
    }, { immediate: !0 }), ue(() => $.catalogId, () => {
      T();
    }), Be(() => T()), Ae(() => {
      w(), g.begin();
    }), (i, u) => (l(), o("section", Xl, [
      r.value ? (l(), I(Ne, {
        key: 0,
        error: r.value
      }, {
        default: b(() => [
          p(t(P), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: u[0] || (u[0] = (n) => T())
          }, {
            default: b(() => [...u[2] || (u[2] = [
              z("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : U("", !0),
      h.value ? (l(), o("div", ea, "Loading history…")) : U("", !0),
      e("div", la, [
        e("p", {
          id: t(v),
          class: "pim-history-caption muted small"
        }, "Catalog changes, newest first", 8, aa),
        A.value.length ? (l(), o(E, { key: 0 }, [
          e("table", {
            class: "pim-grid",
            "aria-labelledby": t(v)
          }, [
            e("thead", null, [
              e("tr", null, [
                u[3] || (u[3] = e("th", { scope: "col" }, "When", -1)),
                a.canResolveActors ? (l(), o("th", sa, "Who")) : U("", !0),
                u[4] || (u[4] = e("th", { scope: "col" }, "What", -1)),
                u[5] || (u[5] = e("th", { scope: "col" }, "Change", -1))
              ])
            ]),
            e("tbody", null, [
              (l(!0), o(E, null, J(A.value, (n) => (l(), o("tr", {
                key: n.key
              }, [
                e("td", na, [
                  e("time", {
                    datetime: n.at
                  }, S(n.date), 9, ia)
                ]),
                a.canResolveActors ? (l(), o("td", oa, [
                  z(S(n.actor), 1),
                  n.source ? (l(), o("span", da, " via " + S(n.source), 1)) : U("", !0)
                ])) : U("", !0),
                e("td", ua, [
                  z(S(n.product), 1),
                  n.context ? (l(), o("span", ra, " · " + S(n.context), 1)) : U("", !0)
                ]),
                e("td", null, [
                  z(S(n.change), 1),
                  !a.canResolveActors && n.source ? (l(), o("span", ca, " via " + S(n.source), 1)) : U("", !0)
                ])
              ]))), 128))
            ])
          ], 8, ta),
          e("ol", {
            role: "list",
            class: "pim-stacked-list",
            "aria-labelledby": t(v)
          }, [
            (l(!0), o(E, null, J(A.value, (n) => (l(), o("li", {
              key: n.key,
              class: "pim-stacked-row"
            }, [
              e("div", null, S(n.change), 1),
              e("div", pa, [
                a.canResolveActors ? (l(), o("span", va, [
                  e("span", null, S(n.actor), 1),
                  n.source ? (l(), o(E, { key: 0 }, [
                    z(" via " + S(n.source), 1)
                  ], 64)) : U("", !0)
                ])) : n.source ? (l(), o("span", fa, "Via " + S(n.source), 1)) : U("", !0),
                e("time", {
                  datetime: n.at
                }, S(n.date), 9, ya),
                e("span", null, [
                  z(S(n.product), 1),
                  n.context ? (l(), o(E, { key: 0 }, [
                    z(" · " + S(n.context), 1)
                  ], 64)) : U("", !0)
                ])
              ])
            ]))), 128))
          ], 8, ma)
        ], 64)) : !h.value && !r.value ? (l(), o("div", ba, "Nothing recorded yet.")) : U("", !0),
        e("div", ga, [
          e("span", null, S(A.value.length) + " change" + S(A.value.length === 1 ? "" : "s") + " shown", 1),
          d.value ? (l(), I(t(P), {
            key: 0,
            type: "button",
            disabled: h.value,
            onClick: u[1] || (u[1] = (n) => T(!0)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: b(() => [
              p(t(F), {
                icon: "tabler:adjustments",
                "aria-hidden": "true"
              }),
              u[6] || (u[6] = z(" Load older", -1))
            ]),
            _: 1
          }, 8, ["disabled"])) : U("", !0)
        ])
      ])
    ]));
  }
}), Ge = /* @__PURE__ */ X({
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
  setup(a, { emit: $ }) {
    const s = $;
    return (m, d) => a.access?.admin ? (l(), o(E, { key: 0 }, [
      a.dirty ? (l(), I(t(oe), {
        key: 0,
        severity: "warn",
        value: "Unsaved changes"
      })) : U("", !0),
      p(t(P), {
        severity: "secondary",
        outlined: "",
        disabled: !a.dirty || a.busy,
        onClick: d[0] || (d[0] = (h) => s("discard"))
      }, {
        default: b(() => [
          p(t(F), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          }),
          d[3] || (d[3] = z(" Discard", -1))
        ]),
        _: 1
      }, 8, ["disabled"]),
      a.reviewed ? (l(), I(t(P), {
        key: 2,
        disabled: !a.dirty || a.busy || !a.canApply,
        loading: a.busy,
        onClick: d[2] || (d[2] = (h) => s("apply"))
      }, {
        default: b(() => [
          z(S(a.applyLabel || "Apply"), 1)
        ]),
        _: 1
      }, 8, ["disabled", "loading"])) : (l(), I(t(P), {
        key: 1,
        disabled: !a.dirty || a.busy || !a.valid,
        loading: a.busy,
        onClick: d[1] || (d[1] = (h) => s("review"))
      }, {
        default: b(() => [...d[4] || (d[4] = [
          z("Review changes", -1)
        ])]),
        _: 1
      }, 8, ["disabled", "loading"]))
    ], 64)) : U("", !0);
  }
}), ka = { class: "kx-head-icon" }, $a = { class: "kx-head-text" }, wa = { class: "pim-title-line" }, _a = ["title"], Ca = { class: "kx-head-actions" }, xa = /* @__PURE__ */ X({
  __name: "PageHead",
  props: {
    title: {},
    subtitle: {},
    icon: {},
    backLabel: {},
    pane: { type: Boolean }
  },
  emits: ["back"],
  setup(a, { emit: $ }) {
    const s = $;
    return (m, d) => (l(), o("header", {
      class: ye(["kx-head", { "pim-panel-head": a.pane }])
    }, [
      a.backLabel ? (l(), I(t(P), {
        key: 0,
        type: "button",
        "aria-label": a.backLabel,
        onClick: d[0] || (d[0] = (h) => s("back")),
        text: "",
        severity: "secondary",
        size: "small"
      }, {
        default: b(() => [
          p(t(F), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label"])) : U("", !0),
      e("div", ka, [
        p(t(F), {
          icon: a.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      e("div", $a, [
        e("div", wa, [
          (l(), I(yl(a.pane ? "h2" : "h1"), { class: "kx-title" }, {
            default: b(() => [
              z(S(a.title), 1)
            ]),
            _: 1
          })),
          re(m.$slots, "meta")
        ]),
        e("p", {
          class: "kx-head-sub",
          title: a.subtitle
        }, S(a.subtitle), 9, _a)
      ]),
      e("div", Ca, [
        re(m.$slots, "default")
      ])
    ], 2));
  }
}), al = Symbol("definitionColumns"), Va = { code: "Code", kind: "Kind", details: "Details", usage: "Used by" }, Ua = {
  code: "minmax(120px, 1fr)",
  kind: "140px",
  details: "minmax(120px, 1.2fr)",
  usage: "120px"
}, Sa = {
  class: "pim-definition-scroll",
  tabindex: "0",
  "aria-label": "Definitions"
}, Aa = { class: "pim-definition-grid" }, Oa = {
  key: 0,
  class: "pim-definition-columns",
  "aria-hidden": "true"
}, ke = /* @__PURE__ */ X({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: { default: () => ["code"] }
  },
  setup(a) {
    const $ = a;
    bl(al, H(() => $.columns));
    const s = H(() => ["48px", "minmax(160px, 1.4fr)", ...$.columns.map((m) => Ua[m]), "80px"].join(" "));
    return (m, d) => (l(), o("section", {
      class: "form pim-definition-list",
      style: qe({ "--pim-definition-columns": s.value })
    }, [
      re(m.$slots, "head"),
      e("div", Sa, [
        e("div", Aa, [
          a.count > 3 ? (l(), o("div", Oa, [
            d[0] || (d[0] = e("span", null, null, -1)),
            d[1] || (d[1] = e("span", null, "Name", -1)),
            (l(!0), o(E, null, J(a.columns, (h) => (l(), o("span", {
              key: h,
              class: ye("pim-definition-" + h)
            }, S(t(Va)[h]), 3))), 128)),
            d[2] || (d[2] = e("span", null, null, -1))
          ])) : U("", !0),
          re(m.$slots, "default")
        ])
      ]),
      re(m.$slots, "add")
    ], 4));
  }
}), Ra = { class: "pim-definition" }, Ia = {
  class: "pim-definition-lead",
  "data-column": "lead"
}, ja = {
  class: "pim-row-title",
  "data-column": "name"
}, Ta = { class: "pim-definition-meta" }, za = ["data-column"], Da = {
  key: 0,
  class: "mono"
}, Na = {
  class: "pim-definition-actions",
  "data-column": "actions"
}, qa = {
  key: 0,
  class: "pim-definition-body"
}, $e = /* @__PURE__ */ X({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ Fe({
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
  emits: /* @__PURE__ */ Fe(["head-keydown", "head-drop", "head-dragover"], ["update:open"]),
  setup(a, { emit: $ }) {
    const s = a, m = gl(al, H(() => [
      ...s.code ? ["code"] : [],
      ...s.kind ? ["kind"] : []
    ])), d = hl(a, "open"), h = $;
    return (r, g) => (l(), o("section", Ra, [
      e("header", {
        class: ye(["pim-definition-head", a.headClass]),
        onKeydown: g[1] || (g[1] = (v) => h("head-keydown", v)),
        onDrop: g[2] || (g[2] = (v) => h("head-drop", v)),
        onDragover: g[3] || (g[3] = (v) => h("head-dragover", v))
      }, [
        p(il, {
          class: ye(["pim-definition-toggle", a.toggleClass]),
          "aria-expanded": d.value,
          onClick: g[0] || (g[0] = (v) => d.value = !d.value)
        }, {
          default: b(() => [
            e("span", Ia, [
              re(r.$slots, "handle"),
              p(t(F), {
                icon: d.value ? "tabler:chevron-down" : "tabler:chevron-right",
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ]),
            e("span", ja, S(a.title), 1),
            e("span", Ta, [
              (l(!0), o(E, null, J(t(m), (v) => (l(), o("span", {
                key: v,
                class: ye("pim-definition-" + v),
                "data-column": v
              }, [
                v === "code" && a.code ? (l(), o("code", Da, S(a.code), 1)) : v === "kind" && a.kind ? (l(), I(t(oe), {
                  key: 1,
                  severity: "secondary",
                  value: a.kind
                }, null, 8, ["value"])) : v === "details" ? re(r.$slots, "details", {}, void 0, void 0, 2) : v === "usage" ? re(r.$slots, "usage", {}, () => [
                  z(S(a.usage), 1)
                ], void 0, 3) : U("", !0)
              ], 10, za))), 128))
            ])
          ]),
          _: 3
        }, 8, ["class", "aria-expanded"]),
        e("div", Na, [
          re(r.$slots, "actions")
        ])
      ], 34),
      d.value ? (l(), o("div", qa, [
        re(r.$slots, "default")
      ])) : U("", !0)
    ]));
  }
}), La = { class: "pim-chips pim-picker-chips" }, Pa = {
  key: 0,
  class: "muted small"
}, me = /* @__PURE__ */ X({
  __name: "ChipPicker",
  props: {
    modelValue: {},
    options: {},
    free: { type: Boolean },
    placeholder: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(a, { emit: $ }) {
    const s = a, m = $, d = L("");
    function h(T) {
      return s.modelValue.includes(T);
    }
    function r(T) {
      s.disabled || !T || m("update:modelValue", h(T) ? s.modelValue.filter((M) => M !== T) : [...s.modelValue, T]);
    }
    function g() {
      const T = d.value.trim();
      if (!T || h(T)) {
        d.value = "";
        return;
      }
      m("update:modelValue", [...s.modelValue, T]), d.value = "";
    }
    function v(T) {
      m("update:modelValue", s.modelValue.filter((M) => M !== T));
    }
    function A(T) {
      return s.options?.find((M) => M.value === T)?.label ?? T;
    }
    return (T, M) => (l(), o("div", La, [
      a.disabled ? (l(), o(E, { key: 0 }, [
        (l(!0), o(E, null, J(a.modelValue, (x) => (l(), o("span", { key: x }, S(A(x)), 1))), 128)),
        a.modelValue.length ? U("", !0) : (l(), o("span", Pa, "None"))
      ], 64)) : a.options && a.options.length > 10 ? (l(), o(E, { key: 1 }, [
        (l(!0), o(E, null, J(a.modelValue, (x) => (l(), o("span", {
          key: x,
          class: "row"
        }, [
          z(S(A(x)), 1),
          p(t(P), {
            type: "button",
            "aria-label": "Remove " + x,
            onClick: (w) => v(x),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: b(() => [
              p(t(F), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128)),
        p(t(ce), {
          "model-value": "",
          "aria-label": a.placeholder ?? "Add",
          "onUpdate:modelValue": M[0] || (M[0] = (x) => r(x)),
          class: "pim-chip-entry",
          options: [{ value: "", label: String(a.placeholder ?? "Add…") }, ...a.options.filter((x) => !h(x.value)).map((x) => ({ value: x.value, label: String(x.label ?? x.value) }))],
          "option-label": "label",
          "option-value": "value",
          appendTo: "self"
        }, null, 8, ["aria-label", "options"])
      ], 64)) : a.options ? (l(), o(E, { key: 2 }, [
        p(t(Me), {
          "model-value": a.modelValue.filter((x) => a.options.some((w) => w.value === x)),
          options: a.options.map((x) => ({ value: x.value, label: x.label ?? x.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          "aria-label": a.placeholder ?? "Selected values",
          "onUpdate:modelValue": M[1] || (M[1] = (x) => m("update:modelValue", [...x, ...a.modelValue.filter((w) => !a.options.some((i) => i.value === w))]))
        }, null, 8, ["model-value", "options", "aria-label"]),
        (l(!0), o(E, null, J(a.modelValue.filter((x) => !a.options.some((w) => w.value === x)), (x) => (l(), o("span", {
          key: x,
          class: "row"
        }, [
          z(S(A(x)), 1),
          p(t(P), {
            type: "button",
            "aria-label": "Remove " + x,
            onClick: (w) => v(x),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: b(() => [
              p(t(F), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128))
      ], 64)) : (l(!0), o(E, { key: 3 }, J(a.modelValue, (x) => (l(), o("span", {
        key: x,
        class: "row"
      }, [
        z(S(x), 1),
        p(t(P), {
          type: "button",
          "aria-label": "Remove " + x,
          onClick: (w) => v(x),
          size: "small",
          text: "",
          severity: "secondary"
        }, {
          default: b(() => [
            p(t(F), { icon: "tabler:x" })
          ]),
          _: 1
        }, 8, ["aria-label", "onClick"])
      ]))), 128)),
      a.free && !a.disabled ? (l(), I(t(de), {
        key: 4,
        modelValue: d.value,
        "onUpdate:modelValue": M[2] || (M[2] = (x) => d.value = x),
        type: "text",
        placeholder: a.placeholder ?? "Add…",
        onKeydown: ve(ae(g, ["prevent"]), ["enter"]),
        onBlur: g,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "placeholder", "onKeydown"])) : U("", !0)
    ]));
  }
}), Ea = {
  key: 0,
  class: "pim-config-overrides"
}, Ba = {
  key: 1,
  class: "muted small"
}, Ma = { key: 1 }, Ka = ["schema", "config"], Ha = {
  key: 1,
  class: "muted small",
  role: "status"
}, Ke = /* @__PURE__ */ X({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(a, { emit: $ }) {
    const s = a, m = $, d = L("pending"), h = H(() => {
      const v = s.schema.properties;
      return Object.entries(s.modelValue).map(([A, T]) => ({
        key: A,
        label: v?.[A]?.title ?? W(A),
        value: T !== null && typeof T == "object" ? JSON.stringify(T) : De(T)
      }));
    });
    async function r() {
      d.value = "pending", d.value = await Ye("wc-schema-form") ? "ready" : "failed";
    }
    ue(() => s.disabled, (v) => {
      v || r();
    }, { immediate: !0 });
    function g(v) {
      const A = v.detail;
      A && typeof A == "object" && !Array.isArray(A) && m("update:modelValue", A);
    }
    return (v, A) => a.disabled ? (l(), o(E, { key: 0 }, [
      h.value.length ? (l(), o("dl", Ea, [
        (l(!0), o(E, null, J(h.value, (T) => (l(), o(E, {
          key: T.key
        }, [
          e("dt", null, S(T.label), 1),
          e("dd", null, S(T.value), 1)
        ], 64))), 128))
      ])) : (l(), o("span", Ba, "No overrides"))
    ], 64)) : (l(), o("div", Ma, [
      d.value === "ready" ? (l(), o("wc-schema-form", {
        key: 0,
        schema: JSON.stringify(s.schema),
        config: JSON.stringify(a.modelValue),
        onConfigChanged: g
      }, null, 40, Ka)) : d.value === "pending" ? (l(), o("span", Ha, "Configuration form is loading.")) : (l(), I(t(he), {
        key: 2,
        role: "alert",
        severity: "error"
      }, {
        default: b(() => [
          A[2] || (A[2] = z("Configuration form could not be loaded. ", -1)),
          p(t(P), {
            type: "button",
            onClick: r,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: b(() => [...A[1] || (A[1] = [
              z("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      })),
      p(t(P), {
        type: "button",
        onClick: A[0] || (A[0] = (T) => m("update:modelValue", {})),
        severity: "secondary",
        outlined: "",
        size: "small"
      }, {
        default: b(() => [
          p(t(F), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          }),
          A[3] || (A[3] = z(" Reset overrides", -1))
        ]),
        _: 1
      })
    ]));
  }
}), Fa = { key: 0 }, Ja = /* @__PURE__ */ X({
  __name: "DefaultValue",
  props: {
    attribute: {},
    type: {},
    disabled: { type: Boolean }
  },
  emits: ["change"],
  setup(a, { emit: $ }) {
    const s = a, m = $, d = H(() => {
      const v = s.type?.form;
      let A = { type: "string" };
      return v === "bool" ? A = { type: "boolean" } : v === "int" ? A = { type: "integer" } : v === "dec" ? A = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : v === "quantity" ? A = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(s.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : v === "record" ? A = { type: "object", additionalProperties: !0 } : v === "ref" && (A = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${s.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (s.attribute.cardinality ?? "one") !== "one" && (A = { type: "array", items: A, uniqueItems: s.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...A, title: "Default value" } } };
    });
    function h(v) {
      return v && typeof v == "object" && "m" in v && "e" in v ? Ee(v) : v;
    }
    function r(v) {
      return s.type?.form === "dec" ? h(v) : s.type?.form === "quantity" && v && typeof v == "object" && "v" in v && "u" in v ? { value: h(v.v), unit: v.u } : v;
    }
    const g = H(() => s.attribute.default === void 0 ? {} : { value: Array.isArray(s.attribute.default) ? s.attribute.default.map(r) : r(s.attribute.default) });
    return (v, A) => a.disabled ? (l(), o("span", Fa, S(a.attribute.default == null ? "No default" : t(De)(a.attribute.default)), 1)) : (l(), I(Ke, {
      key: 1,
      schema: d.value,
      "model-value": g.value,
      "onUpdate:modelValue": A[0] || (A[0] = (T) => m("change", T.value))
    }, null, 8, ["schema", "model-value"]));
  }
}), Wa = { class: "pim-stack" }, Ga = { class: "pim-bsection-head" }, Ya = {
  key: 0,
  class: "mono muted small"
}, Za = { class: "pim-source-permissions" }, Qa = ["for"], Xa = {
  key: 0,
  class: "small muted"
}, et = ["onDragstart"], lt = { class: "pim-fields" }, at = { class: "pim-f pim-w-third" }, tt = { class: "pim-f-label" }, st = {
  key: 0,
  class: "pim-f-note"
}, nt = { class: "pim-f pim-w-third" }, it = { class: "pim-f pim-w-third" }, ot = {
  key: 0,
  class: "pim-f pim-w-third"
}, dt = {
  key: 1,
  class: "pim-f pim-w-third"
}, ut = { class: "pim-f pim-w-third" }, rt = { class: "pim-f pim-w-third" }, ct = { class: "pim-f pim-w-half" }, mt = { class: "pim-f pim-w-half" }, pt = { class: "row" }, vt = {
  key: 2,
  class: "pim-f pim-w-full"
}, ft = { class: "pim-contexts" }, yt = { class: "small muted" }, bt = { class: "pim-f pim-w-half" }, gt = {
  key: 3,
  class: "pim-f pim-w-full"
}, ht = {
  key: 0,
  class: "row end"
}, kt = { class: "row pim-add-row" }, $t = {
  key: 0,
  class: "form"
}, wt = { class: "pim-aspect row pim-add-row" }, _t = /* @__PURE__ */ X({
  __name: "BuilderFields",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove"],
  setup(a, { emit: $ }) {
    const s = a, m = $, d = Te.map((V) => V.value), h = [{ value: "one", label: "Single value" }, { value: "list", label: "Ordered list" }, { value: "set", label: "Unique set" }], r = H(() => s.schema.access.admin), g = H(() => s.draft.aspects ?? []), v = H(() => (s.draft.dimensions ?? []).map((V) => ({ value: V.name, label: W(V.name) }))), A = H(() => (s.draft.vocabularies ?? []).map((V) => V.code)), T = H(() => (s.draft.sources ?? []).map((V) => ({ value: V.id, label: W(V.id) }))), M = H(() => [...s.options.types].sort((V, c) => V.form.localeCompare(c.form)).map((V) => ({ value: V.id, label: w(V) })));
    function x(V) {
      return s.options.types.find((c) => c.id === V.type);
    }
    function w(V) {
      return pe(V.title, "Field type");
    }
    function i(V) {
      return x(V)?.target === "term";
    }
    function u(V) {
      const c = x(V);
      return !!c && c.form === "ref" && !c.target;
    }
    function n(V, c) {
      return c.id !== void 0 && s.schema.attributes[V + "." + c.code] !== void 0;
    }
    function f(V) {
      const c = (s.draft.families ?? []).filter((k) => k.aspects?.includes(V)).length;
      return c + (c === 1 ? " family" : " families");
    }
    const _ = L({});
    function O(V, c) {
      return V + "." + (c.id ?? c.code);
    }
    function C(V, c) {
      V.type = c;
      const k = x(V);
      if (k && V.index && !k.indexes.includes(V.index) && delete V.index, i(V) || delete V.vocabulary, !u(V) && V.config && "target" in V.config) {
        const { target: y, ...Q } = V.config;
        V.config = Object.keys(Q).length ? Q : void 0, V.config || delete V.config;
      }
    }
    function j(V, c) {
      Object.keys(c).length ? V.config = c : delete V.config;
    }
    function K(V, c) {
      const k = { ...V.config ?? {} };
      c ? k.target = c : delete k.target, j(V, k);
    }
    function Z(V, c) {
      c.length ? V.scope = c : delete V.scope, c.length || delete V.index_contexts;
    }
    function G(V, c, k) {
      k === void 0 || k === "" || k === !1 && c !== "default" ? delete V[c] : V[c] = k;
    }
    function le(V) {
      return V.index_contexts ?? [];
    }
    function fe(V) {
      return (s.draft.dimensions ?? []).find((c) => c.name === V)?.members ?? [];
    }
    function D(V) {
      const c = {};
      for (const y of V.scope ?? []) c[y] = fe(y)[0] ?? "";
      (V.index_contexts ?? (V.index_contexts = [])).push(c);
    }
    const q = L(null);
    function R(V, c, k) {
      if (!r.value || !V.altKey) return;
      const y = { ArrowUp: -1, ArrowDown: 1 }[V.key];
      y !== void 0 && (V.preventDefault(), _e(c.attributes ?? [], k, k + y));
    }
    function B(V, c) {
      r.value && q.value?.namespace === V.namespace && _e(V.attributes ?? [], q.value.index, c), q.value = null;
    }
    const ee = L("");
    function Oe() {
      const V = ee.value.trim();
      !se.test(V) || g.value.some((c) => c.namespace === V) || ((s.draft.aspects ??= []).push({ namespace: V, attributes: [] }), ee.value = "");
    }
    function Re(V) {
      const c = g.value.indexOf(V);
      c >= 0 && g.value.splice(c, 1), s.schema.declaration.aspects?.some((k) => k.namespace === V.namespace) && m("remove", "aspects", V.namespace);
    }
    const be = L({});
    function Ie(V) {
      const c = (be.value[V.namespace] ?? "").trim(), k = V.attributes ?? (V.attributes = []);
      if (!se.test(c) || k.some((N) => N.code === c)) return;
      const y = s.options.types.find((N) => N.id === "kickside.pim.types:text") ?? s.options.types[0], Q = { code: c, type: y?.id ?? "" };
      k.push(Q), be.value[V.namespace] = "", _.value[O(V.namespace, Q)] = !0;
    }
    function Ve(V, c) {
      const k = V.attributes ?? [], y = k.indexOf(c);
      y >= 0 && k.splice(y, 1), n(V.namespace, c) && m("remove", "attributes", V.namespace + "." + c.code);
    }
    return (V, c) => (l(), o("div", Wa, [
      (l(!0), o(E, null, J(g.value, (k) => (l(), I(ke, {
        key: k.namespace,
        count: k.attributes?.length ?? 0,
        columns: ["code", "kind", "details", "usage"]
      }, ie({
        head: b(() => [
          e("header", Ga, [
            e("div", null, [
              e("h3", null, [
                z(S(t(W)(k.namespace)), 1),
                t(W)(k.namespace).toLocaleLowerCase() !== k.namespace.toLocaleLowerCase() ? (l(), o("span", Ya, S(k.namespace), 1)) : U("", !0)
              ]),
              e("div", Za, [
                e("label", {
                  for: "writers-" + k.namespace
                }, "Sources allowed to write", 8, Qa),
                p(t(xl), {
                  disabled: !r.value,
                  "input-id": "writers-" + k.namespace,
                  "aria-label": "Sources allowed to write",
                  "model-value": k.write?.sources ?? [],
                  options: T.value,
                  "option-label": "label",
                  "option-value": "value",
                  placeholder: "Any source",
                  appendTo: "self",
                  "onUpdate:modelValue": (y) => k.write = { sources: y }
                }, null, 8, ["disabled", "input-id", "model-value", "options", "onUpdate:modelValue"]),
                r.value ? (l(), o("span", Xa, "Leave empty to allow any source to write this field group.")) : U("", !0)
              ])
            ]),
            r.value ? (l(), I(t(P), {
              key: 0,
              type: "button",
              onClick: (y) => Re(k),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: b(() => [
                p(t(F), { icon: "tabler:trash" }),
                c[4] || (c[4] = z(" Remove field group", -1))
              ]),
              _: 1
            }, 8, ["onClick"])) : U("", !0)
          ])
        ]),
        default: b(() => [
          (l(!0), o(E, null, J(k.attributes ?? [], (y, Q) => (l(), I($e, {
            key: O(k.namespace, y),
            open: _.value[O(k.namespace, y)],
            "onUpdate:open": (N) => _.value[O(k.namespace, y)] = N,
            title: t(W)(y.code),
            code: k.namespace + "." + y.code,
            kind: x(y) ? w(x(y)) : "Unknown type",
            usage: f(k.namespace),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle",
            onHeadDragover: c[2] || (c[2] = ae(() => {
            }, ["prevent"])),
            onHeadDrop: ae((N) => B(k, Q), ["prevent"]),
            onHeadKeydown: (N) => R(N, k, Q)
          }, ie({
            handle: b(() => [
              r.value ? (l(), o("span", {
                key: 0,
                class: "pim-grip",
                draggable: "true",
                "aria-hidden": "true",
                onClick: c[0] || (c[0] = ae(() => {
                }, ["stop"])),
                onDragstart: ae((N) => q.value = { namespace: k.namespace, index: Q }, ["stop"]),
                onDragend: c[1] || (c[1] = (N) => q.value = null)
              }, [
                p(t(F), { icon: "tabler:grip-vertical" })
              ], 40, et)) : U("", !0)
            ]),
            details: b(() => [
              y.cardinality && y.cardinality !== "one" ? (l(), I(t(oe), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: b(() => [
                  z(S(h.find((N) => N.value === y.cardinality)?.label), 1)
                ]),
                _: 2
              }, 1024)) : U("", !0),
              y.scope?.length ? (l(), I(t(oe), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: b(() => [
                  z("per " + S(y.scope.join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : U("", !0),
              y.index && y.index !== "none" ? (l(), I(t(oe), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: b(() => [
                  z(S(y.index) + " index", 1)
                ]),
                _: 2
              }, 1024)) : U("", !0),
              y.unique ? (l(), I(t(oe), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: b(() => [...c[5] || (c[5] = [
                  z("unique", -1)
                ])]),
                _: 1
              })) : U("", !0)
            ]),
            default: b(() => [
              e("div", lt, [
                e("div", at, [
                  e("div", tt, [
                    c[6] || (c[6] = e("label", null, "Code", -1)),
                    r.value && n(k.namespace, y) ? (l(), o("span", st, "renames keep values")) : U("", !0)
                  ]),
                  p(t(de), {
                    disabled: !r.value,
                    type: "text",
                    value: y.code,
                    onInput: (N) => y.code = N.target.value,
                    class: "mono"
                  }, null, 8, ["disabled", "value", "onInput"])
                ]),
                e("div", nt, [
                  c[7] || (c[7] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Type")
                  ], -1)),
                  p(t(ce), {
                    disabled: !r.value,
                    "model-value": y.type,
                    options: M.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (N) => C(y, N)
                  }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", it, [
                  c[8] || (c[8] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Values")
                  ], -1)),
                  p(t(ce), {
                    disabled: !r.value,
                    "model-value": y.cardinality ?? "one",
                    options: h,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (N) => G(y, "cardinality", N === "one" ? void 0 : N)
                  }, null, 8, ["disabled", "model-value", "onUpdate:modelValue"])
                ]),
                i(y) ? (l(), o("div", ot, [
                  c[9] || (c[9] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Vocabulary")
                  ], -1)),
                  p(t(ce), {
                    disabled: !r.value,
                    "model-value": y.vocabulary ?? "",
                    "onUpdate:modelValue": (N) => G(y, "vocabulary", N),
                    options: [{ value: "", label: "Choose…" }, ...A.value.map((N) => ({ value: N, label: String(N) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "model-value", "onUpdate:modelValue", "options"])
                ])) : U("", !0),
                u(y) ? (l(), o("div", dt, [
                  c[10] || (c[10] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Link kind"),
                    e("span", { class: "pim-f-note" }, "owned by a plugin")
                  ], -1)),
                  p(t(ce), {
                    disabled: !r.value,
                    "model-value": y.config?.target ?? "",
                    "onUpdate:modelValue": (N) => K(y, N),
                    options: [{ value: "", label: "Choose…" }, ...a.options.link_kinds.map((N) => ({ value: N.kind, label: t(pe)(N.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "model-value", "onUpdate:modelValue", "options"])
                ])) : U("", !0),
                e("div", ut, [
                  c[11] || (c[11] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Index"),
                    e("span", { class: "pim-f-note" }, "for filters and keys")
                  ], -1)),
                  p(t(ce), {
                    disabled: !r.value,
                    "model-value": y.index ?? "none",
                    options: x(y)?.indexes ?? ["none"],
                    appendTo: "self",
                    "onUpdate:modelValue": (N) => G(y, "index", N === "none" ? void 0 : N)
                  }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", rt, [
                  c[12] || (c[12] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Width"),
                    e("span", { class: "pim-f-note" }, "of a form row")
                  ], -1)),
                  p(t(Me), {
                    disabled: !r.value,
                    "model-value": t(Pe)(a.schema, k.namespace, y),
                    options: t(d),
                    "allow-empty": !1,
                    "onUpdate:modelValue": (N) => y.width = N
                  }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", ct, [
                  c[13] || (c[13] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Varies per"),
                    e("span", { class: "pim-f-note" }, "dimensions the value depends on")
                  ], -1)),
                  p(me, {
                    disabled: !r.value,
                    "model-value": y.scope ?? [],
                    options: v.value,
                    "onUpdate:modelValue": (N) => Z(y, N)
                  }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", mt, [
                  c[14] || (c[14] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Unique"),
                    e("span", { class: "pim-f-note" }, "one holder per value, catalog wide")
                  ], -1)),
                  e("label", pt, [
                    p(t(Se), {
                      "aria-label": "Unique " + y.code,
                      "model-value": y.unique === !0,
                      disabled: !r.value || !!y.scope?.length || (y.cardinality ?? "one") !== "one",
                      "onUpdate:modelValue": (N) => G(y, "unique", N)
                    }, null, 8, ["aria-label", "model-value", "disabled", "onUpdate:modelValue"]),
                    e("span", null, S(y.unique ? "Yes" : "No"), 1)
                  ])
                ]),
                (y.scope?.length ?? 0) > 0 && y.index && y.index !== "none" ? (l(), o("div", vt, [
                  c[16] || (c[16] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Indexed contexts"),
                    e("span", { class: "pim-f-note" }, "which combinations get an index")
                  ], -1)),
                  e("div", ft, [
                    (l(!0), o(E, null, J(le(y), (N, ge) => (l(), o("div", {
                      key: ge,
                      class: "pim-context-row"
                    }, [
                      (l(!0), o(E, null, J(y.scope, (te) => (l(), o("label", {
                        key: te,
                        class: "pim-context-field"
                      }, [
                        e("span", yt, S(t(W)(te)), 1),
                        p(t(ce), {
                          disabled: !r.value,
                          "model-value": N[te] ?? "",
                          options: fe(te),
                          class: "narrow",
                          appendTo: "self",
                          "onUpdate:modelValue": (xe) => N[te] = xe
                        }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
                      ]))), 128)),
                      r.value ? (l(), I(t(P), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove context",
                        onClick: (te) => le(y).splice(ge, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: b(() => [
                          p(t(F), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : U("", !0)
                    ]))), 128)),
                    r.value ? (l(), I(t(P), {
                      key: 0,
                      type: "button",
                      onClick: (N) => D(y),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: b(() => [
                        p(t(F), {
                          icon: "tabler:plus",
                          "aria-hidden": "true"
                        }),
                        c[15] || (c[15] = z(" Add context", -1))
                      ]),
                      _: 1
                    }, 8, ["onClick"])) : U("", !0)
                  ])
                ])) : U("", !0),
                e("div", bt, [
                  c[17] || (c[17] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Default"),
                    e("span", { class: "pim-f-note" }, "when no value is set")
                  ], -1)),
                  p(Ja, {
                    disabled: !r.value,
                    attribute: y,
                    type: x(y),
                    onChange: (N) => G(y, "default", N)
                  }, null, 8, ["disabled", "attribute", "type", "onChange"])
                ]),
                x(y)?.config_schema ? (l(), o("div", gt, [
                  c[18] || (c[18] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Type configuration")
                  ], -1)),
                  p(Ke, {
                    disabled: !r.value,
                    schema: x(y).config_schema,
                    "model-value": y.config ?? {},
                    "onUpdate:modelValue": (N) => j(y, N)
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue"])
                ])) : U("", !0)
              ]),
              r.value ? (l(), o("div", ht, [
                p(t(P), {
                  type: "button",
                  onClick: (N) => Ve(k, y),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: b(() => [
                    p(t(F), { icon: "tabler:trash" }),
                    c[19] || (c[19] = z(" Remove field", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : U("", !0)
            ]),
            _: 2
          }, [
            r.value ? {
              name: "actions",
              fn: b(() => [
                p(t(P), {
                  type: "button",
                  disabled: Q === 0,
                  "aria-label": "Move " + y.code + " earlier",
                  onClick: (N) => t(_e)(k.attributes, Q, Q - 1),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: b(() => [
                    p(t(F), { icon: "tabler:arrow-up" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                p(t(P), {
                  type: "button",
                  disabled: Q === (k.attributes?.length ?? 0) - 1,
                  "aria-label": "Move " + y.code + " later",
                  onClick: (N) => t(_e)(k.attributes, Q, Q + 1),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: b(() => [
                    p(t(F), { icon: "tabler:arrow-down" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["open", "onUpdate:open", "title", "code", "kind", "usage", "onHeadDrop", "onHeadKeydown"]))), 128))
        ]),
        _: 2
      }, [
        r.value ? {
          name: "add",
          fn: b(() => [
            e("div", kt, [
              p(t(de), {
                modelValue: be.value[k.namespace],
                "onUpdate:modelValue": (y) => be.value[k.namespace] = y,
                type: "text",
                placeholder: "new_field",
                onKeydown: ve(ae((y) => Ie(k), ["prevent"]), ["enter"]),
                class: "mono"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
              p(t(P), {
                type: "button",
                disabled: !t(se).test(be.value[k.namespace] ?? ""),
                onClick: (y) => Ie(k),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: b(() => [
                  p(t(F), {
                    icon: "tabler:plus",
                    "aria-hidden": "true"
                  }),
                  c[20] || (c[20] = z(" Add field", -1))
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"]))), 128)),
      r.value ? (l(), o("section", $t, [
        e("div", wt, [
          p(t(de), {
            modelValue: ee.value,
            "onUpdate:modelValue": c[3] || (c[3] = (k) => ee.value = k),
            type: "text",
            placeholder: "new_field_group",
            onKeydown: ve(ae(Oe, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          p(t(P), {
            type: "button",
            disabled: !t(se).test(ee.value),
            onClick: Oe,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: b(() => [
              p(t(F), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              }),
              c[21] || (c[21] = z(" Add field group", -1))
            ]),
            _: 1
          }, 8, ["disabled"]),
          c[22] || (c[22] = e("span", { class: "muted small" }, "A field group contains fields and can be written by named sources only.", -1))
        ])
      ])) : U("", !0)
    ]));
  }
}), Ct = { class: "muted small" }, xt = { class: "pim-aspect" }, Vt = {
  key: 0,
  class: "small muted"
}, Ut = { class: "pim-fields" }, St = { class: "pim-f pim-w-full" }, At = { class: "pim-f-label" }, Ot = { class: "row pim-add-row" }, Rt = /* @__PURE__ */ X({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(a, { emit: $ }) {
    const s = a, m = $, d = H(() => s.schema.access.admin), h = H(() => s.draft.dimensions ?? []), r = L("");
    function g() {
      const w = r.value.trim();
      !se.test(w) || h.value.some((i) => i.name === w) || ((s.draft.dimensions ??= []).push({ name: w, members: [] }), r.value = "");
    }
    function v(w) {
      const i = [];
      for (const u of s.draft.aspects ?? []) for (const n of u.attributes ?? []) n.scope?.includes(w.name) && i.push(u.namespace + "." + n.code);
      for (const u of s.draft.families ?? []) for (const n of u.requirements ?? []) n.context && w.name in n.context && i.push(u.code + " requirement " + n.id);
      return i;
    }
    function A(w) {
      v(w).length || (h.value.splice(h.value.indexOf(w), 1), s.schema.declaration.dimensions?.some((i) => i.name === w.name) && m("remove", "dimensions", w.name));
    }
    function T(w, i) {
      if (w.members = i, w.fallback)
        for (const u of Object.keys(w.fallback)) i.includes(u) || delete w.fallback[u];
    }
    function M(w, i) {
      return w.fallback?.[i] ?? [];
    }
    function x(w, i, u) {
      const n = { ...w.fallback ?? {} };
      u.length ? n[i] = u : delete n[i], Object.keys(n).length ? w.fallback = n : delete w.fallback;
    }
    return (w, i) => (l(), I(ke, {
      count: h.value.length,
      columns: ["code", "details", "usage"]
    }, ie({
      default: b(() => [
        (l(!0), o(E, null, J(h.value, (u) => (l(), I($e, {
          title: t(W)(u.name),
          code: u.name,
          key: u.name,
          usage: v(u).length + (v(u).length === 1 ? " dependency" : " dependencies")
        }, ie({
          details: b(() => [
            e("span", Ct, S(u.members.length) + " " + S(u.members.length === 1 ? "member" : "members"), 1)
          ]),
          default: b(() => [
            e("div", xt, [
              v(u).length ? (l(), o("p", Vt, "Used by " + S(v(u).join(", ")), 1)) : U("", !0),
              e("div", Ut, [
                e("div", St, [
                  i[1] || (i[1] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Members"),
                    e("span", { class: "pim-f-note" }, "the values this dimension takes")
                  ], -1)),
                  p(me, {
                    disabled: !d.value,
                    "model-value": u.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (n) => T(u, n)
                  }, null, 8, ["disabled", "model-value", "onUpdate:modelValue"])
                ]),
                (l(!0), o(E, null, J(u.members, (n) => (l(), o("div", {
                  key: n,
                  class: "pim-f pim-w-half"
                }, [
                  e("div", At, [
                    e("label", null, S(n) + " falls back to", 1),
                    i[2] || (i[2] = e("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  p(me, {
                    disabled: !d.value,
                    "model-value": M(u, n),
                    options: u.members.filter((f) => f !== n).map((f) => ({ value: f })),
                    "onUpdate:modelValue": (f) => x(u, n, f)
                  }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
                ]))), 128))
              ])
            ])
          ]),
          _: 2
        }, [
          d.value ? {
            name: "actions",
            fn: b(() => [
              p(t(P), {
                type: "button",
                disabled: v(u).length > 0,
                "aria-label": "Remove " + t(W)(u.name),
                title: v(u).length ? "Take the dimension off these first" : "",
                onClick: (n) => A(u),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: b(() => [
                  p(t(F), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "title", "onClick"])
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["title", "code", "usage"]))), 128))
      ]),
      _: 2
    }, [
      d.value ? {
        name: "add",
        fn: b(() => [
          e("div", Ot, [
            p(t(de), {
              modelValue: r.value,
              "onUpdate:modelValue": i[0] || (i[0] = (u) => r.value = u),
              type: "text",
              placeholder: "new_dimension",
              onKeydown: ve(ae(g, ["prevent"]), ["enter"]),
              class: "mono"
            }, null, 8, ["modelValue", "onKeydown"]),
            p(t(P), {
              type: "button",
              disabled: !t(se).test(r.value),
              onClick: g,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: b(() => [
                p(t(F), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                }),
                i[3] || (i[3] = z(" Add dimension", -1))
              ]),
              _: 1
            }, 8, ["disabled"]),
            i[4] || (i[4] = e("span", { class: "muted small" }, "A dimension lets a value differ per member, with fallbacks between members.", -1))
          ])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), It = { class: "muted small" }, jt = { class: "pim-aspect" }, Tt = { class: "row small" }, zt = {
  key: 1,
  class: "muted small"
}, Dt = {
  key: 2,
  class: "pim-stack tight pim-terms"
}, Nt = {
  key: 0,
  class: "muted small"
}, qt = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Lt = {
  key: 3,
  class: "pim-responsive-table"
}, Pt = {
  class: "pim-grid compact",
  "aria-label": "Vocabulary terms"
}, Et = { key: 0 }, Bt = { key: 1 }, Mt = { class: "mono" }, Kt = {
  key: 0,
  class: "mono muted"
}, Ht = {
  key: 1,
  class: "num"
}, Ft = {
  role: "list",
  class: "pim-stacked-list",
  "aria-label": "Vocabulary terms"
}, Jt = { class: "pim-stacked-meta muted small" }, Wt = { class: "mono" }, Gt = { key: 0 }, Yt = {
  key: 4,
  class: "muted small"
}, Zt = { class: "row wrap" }, Qt = {
  key: 5,
  class: "row wrap pim-add-row"
}, Xt = { class: "row pim-add-row" }, es = /* @__PURE__ */ X({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(a, { emit: $ }) {
    const s = a, m = $, d = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/, h = H(() => s.schema.access.admin), r = H(() => h.value && s.schema.access.write), g = H(() => s.draft.vocabularies ?? []), v = L("");
    function A() {
      const D = v.value.trim();
      !se.test(D) || g.value.some((q) => q.code === D) || ((s.draft.vocabularies ??= []).push({ code: D }), v.value = "");
    }
    function T(D) {
      g.value.splice(g.value.indexOf(D), 1), s.schema.declaration.vocabularies?.some((q) => q.code === D.code) && m("remove", "vocabularies", D.code);
    }
    function M(D) {
      return !!s.schema.vocabularies[D];
    }
    const x = L({}), w = L({}), i = L({}), u = L({}), n = L({}), f = L({}), _ = L({}), O = L({});
    function C(D) {
      return !!(n.value[D] || f.value[D]);
    }
    async function j(D, q) {
      n.value[D] = !0, delete _.value[D];
      try {
        const R = await ne.termsPage(s.catalogId, D, q);
        w.value[D] = R.terms, u.value[D] = q, i.value[D] = R.next;
      } catch (R) {
        _.value[D] = { error: Ce(R, "Could not load terms."), read: { after: q } };
      } finally {
        n.value[D] = !1;
      }
    }
    function K(D) {
      x.value[D] = !x.value[D], x.value[D] && !C(D) && !w.value[D] && !_.value[D] && j(D);
    }
    function Z(D) {
      return O.value[D] ?? (O.value[D] = { code: "", label: "", parent: "" });
    }
    async function G(D) {
      const q = Z(D.code);
      if (!(!r.value || !d.test(q.code))) {
        f.value[D.code] = !0, delete _.value[D.code];
        try {
          const R = { term: { vocabulary: D.code, code: q.code }, labels: { en: q.label || W(q.code) } };
          D.hierarchical && q.parent && (R.parent = q.parent);
          const ee = (await ne.apply(s.catalogId, [R])).outcomes[0];
          if (!ee || !["created", "updated"].includes(ee.outcome)) throw fe(ee?.findings?.[0]);
          O.value[D.code] = { code: "", label: "", parent: "" }, ne.invalidateTerms(s.catalogId), await j(D.code, u.value[D.code]);
        } catch (R) {
          _.value[D.code] = { error: Ce(R, "Could not add the term.") };
        } finally {
          f.value[D.code] = !1;
        }
      }
    }
    async function le(D, q, R) {
      if (r.value && !(R && !await Xe.confirm({ header: "Retire term?", message: `Retire ${Ue(q)}? Term changes save immediately. You can restore this term later.`, acceptLabel: "Retire", rejectLabel: "Cancel" }))) {
        f.value[D.code] = !0, delete _.value[D.code];
        try {
          const ee = (await ne.apply(s.catalogId, [{ term: { vocabulary: D.code, code: q.code }, retired: R }])).outcomes[0];
          if (!ee || !["updated", "unchanged"].includes(ee.outcome)) throw fe(ee?.findings?.[0]);
          ne.invalidateTerms(s.catalogId), await j(D.code, u.value[D.code]);
        } catch (B) {
          _.value[D.code] = { error: Ce(B, "Could not change the term.") };
        } finally {
          f.value[D.code] = !1;
        }
      }
    }
    function fe(D) {
      return new ol({ message: D?.message ?? "The term change was not accepted.", details: D && { code: D.code } }, "term change");
    }
    return (D, q) => (l(), I(ke, {
      count: g.value.length,
      columns: ["code", "details"]
    }, ie({
      default: b(() => [
        (l(!0), o(E, null, J(g.value, (R) => (l(), I($e, {
          title: t(W)(R.code),
          code: R.code,
          key: R.code
        }, {
          details: b(() => [
            e("span", It, S(R.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: b(() => [
            h.value ? (l(), I(t(P), {
              key: 0,
              type: "button",
              "aria-label": "Remove " + t(W)(R.code),
              onClick: (B) => T(R),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: b(() => [
                p(t(F), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])) : U("", !0)
          ]),
          default: b(() => [
            e("div", jt, [
              e("label", Tt, [
                p(t(Se), {
                  disabled: !h.value,
                  "aria-label": "Hierarchical " + R.code,
                  "model-value": R.hierarchical === !0,
                  "onUpdate:modelValue": (B) => B ? R.hierarchical = !0 : delete R.hierarchical
                }, null, 8, ["disabled", "aria-label", "model-value", "onUpdate:modelValue"]),
                q[1] || (q[1] = e("span", null, "Hierarchical", -1))
              ]),
              M(R.code) ? (l(), I(t(P), {
                key: 0,
                type: "button",
                onClick: (B) => K(R.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: b(() => [
                  p(t(F), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  z(" " + S(x.value[R.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : h.value ? (l(), o("span", zt, "Apply the schema before adding terms.")) : U("", !0),
              x.value[R.code] ? (l(), o("div", Dt, [
                r.value ? (l(), o("p", Nt, "Term changes save immediately.")) : U("", !0),
                n.value[R.code] ? (l(), o("div", qt, "Loading terms…")) : _.value[R.code] ? (l(), I(Ne, {
                  key: 2,
                  error: _.value[R.code].error
                }, {
                  default: b(() => [
                    _.value[R.code].read ? (l(), I(t(P), {
                      key: 0,
                      type: "button",
                      onClick: (B) => j(R.code, _.value[R.code].read?.after),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: b(() => [...q[2] || (q[2] = [
                        z("Retry", -1)
                      ])]),
                      _: 1
                    }, 8, ["onClick"])) : U("", !0)
                  ]),
                  _: 2
                }, 1032, ["error"])) : U("", !0),
                (w.value[R.code] ?? []).length ? (l(), o("div", Lt, [
                  e("table", Pt, [
                    e("thead", null, [
                      e("tr", null, [
                        q[3] || (q[3] = e("th", null, "Code", -1)),
                        q[4] || (q[4] = e("th", null, "Label", -1)),
                        R.hierarchical ? (l(), o("th", Et, "Parent")) : U("", !0),
                        h.value ? (l(), o("th", Bt)) : U("", !0)
                      ])
                    ]),
                    e("tbody", null, [
                      (l(!0), o(E, null, J(w.value[R.code], (B) => (l(), o("tr", {
                        key: B.code,
                        class: ye({ muted: B.retired })
                      }, [
                        e("td", Mt, S(B.code), 1),
                        e("td", null, S(t(Ue)(B)), 1),
                        R.hierarchical ? (l(), o("td", Kt, S(B.parent ?? ""), 1)) : U("", !0),
                        h.value ? (l(), o("td", Ht, [
                          p(t(P), {
                            type: "button",
                            disabled: !r.value || C(R.code),
                            onClick: (ee) => le(R, B, !B.retired),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: b(() => [
                              z(S(B.retired ? "Restore" : "Retire"), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled", "onClick"])
                        ])) : U("", !0)
                      ], 2))), 128))
                    ])
                  ]),
                  e("ul", Ft, [
                    (l(!0), o(E, null, J(w.value[R.code], (B) => (l(), o("li", {
                      key: B.code,
                      class: ye(["pim-stacked-row", { muted: B.retired }])
                    }, [
                      e("div", null, S(t(Ue)(B)), 1),
                      e("div", Jt, [
                        e("span", Wt, S(B.code), 1),
                        R.hierarchical && B.parent ? (l(), o("span", Gt, "Parent: " + S(B.parent), 1)) : U("", !0)
                      ]),
                      h.value ? (l(), I(t(P), {
                        key: 0,
                        type: "button",
                        disabled: !r.value || C(R.code),
                        onClick: (ee) => le(R, B, !B.retired),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: b(() => [
                          z(S(B.retired ? "Restore" : "Retire"), 1)
                        ]),
                        _: 2
                      }, 1032, ["disabled", "onClick"])) : U("", !0)
                    ], 2))), 128))
                  ])
                ])) : w.value[R.code] && !C(R.code) && !_.value[R.code] ? (l(), o("p", Yt, "No terms yet.")) : U("", !0),
                e("div", Zt, [
                  p(t(P), {
                    type: "button",
                    disabled: C(R.code) || !u.value[R.code],
                    onClick: (B) => j(R.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: b(() => [
                      p(t(F), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      q[5] || (q[5] = z(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  p(t(P), {
                    type: "button",
                    disabled: C(R.code) || !i.value[R.code],
                    onClick: (B) => j(R.code, i.value[R.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: b(() => [
                      p(t(F), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      q[6] || (q[6] = z(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                h.value ? (l(), o("div", Qt, [
                  p(t(de), {
                    modelValue: Z(R.code).code,
                    "onUpdate:modelValue": (B) => Z(R.code).code = B,
                    disabled: !r.value || C(R.code),
                    type: "text",
                    placeholder: "code",
                    class: "mono narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  p(t(de), {
                    modelValue: Z(R.code).label,
                    "onUpdate:modelValue": (B) => Z(R.code).label = B,
                    disabled: !r.value || C(R.code),
                    type: "text",
                    placeholder: "Label (en)"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  R.hierarchical ? (l(), I(t(ce), {
                    key: 0,
                    modelValue: Z(R.code).parent,
                    "onUpdate:modelValue": (B) => Z(R.code).parent = B,
                    disabled: !r.value || C(R.code),
                    class: "narrow",
                    options: [{ value: "", label: "No parent" }, ...(w.value[R.code] ?? []).map((B) => ({ value: B.code, label: String(t(Ue)(B)) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "options"])) : U("", !0),
                  p(t(P), {
                    type: "button",
                    disabled: !r.value || C(R.code) || !d.test(Z(R.code).code),
                    onClick: (B) => G(R),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: b(() => [
                      p(t(F), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      q[7] || (q[7] = z(" Add term", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])) : U("", !0)
              ])) : U("", !0)
            ])
          ]),
          _: 2
        }, 1032, ["title", "code"]))), 128))
      ]),
      _: 2
    }, [
      h.value ? {
        name: "add",
        fn: b(() => [
          e("div", Xt, [
            p(t(de), {
              modelValue: v.value,
              "onUpdate:modelValue": q[0] || (q[0] = (R) => v.value = R),
              type: "text",
              placeholder: "new_vocabulary",
              onKeydown: ve(ae(A, ["prevent"]), ["enter"]),
              class: "mono"
            }, null, 8, ["modelValue", "onKeydown"]),
            p(t(P), {
              type: "button",
              disabled: !t(se).test(v.value),
              onClick: A,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: b(() => [
                p(t(F), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                }),
                q[8] || (q[8] = z(" Add vocabulary", -1))
              ]),
              _: 1
            }, 8, ["disabled"]),
            q[9] || (q[9] = e("span", { class: "muted small" }, "Select fields pick their values from a vocabulary's terms.", -1))
          ])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), ls = { class: "muted small" }, as = { class: "pim-aspect" }, ts = { class: "pim-fields" }, ss = { class: "pim-f pim-w-full" }, ns = { class: "pim-aspect" }, is = { class: "pim-stack tight" }, os = { class: "pim-level-head" }, ds = { class: "pim-fields" }, us = { class: "pim-f pim-w-half" }, rs = { class: "pim-f pim-w-half" }, cs = { class: "pim-aspect" }, ms = { class: "pim-stack tight" }, ps = { class: "pim-level-head" }, vs = { class: "mono" }, fs = { class: "pim-fields" }, ys = { class: "pim-f-label" }, bs = { class: "pim-f pim-w-half" }, gs = { class: "pim-f pim-w-half" }, hs = {
  key: 0,
  class: "row pim-add-row"
}, ks = { class: "row pim-add-row" }, $s = /* @__PURE__ */ X({
  __name: "BuilderFamilies",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(a, { emit: $ }) {
    const s = a, m = $, d = H(() => s.schema.access.admin), h = H(() => (s.draft.families ?? []).filter((O) => O.code !== "generic")), r = H(() => {
      const O = (s.draft.aspects ?? []).map((j) => j.namespace), C = [...new Set(Object.entries(s.schema.attributes).filter(([, j]) => j.plugin).map(([j]) => j.split(".")[0]))];
      return [...O, ...C.filter((j) => !O.includes(j))].map((j) => ({ value: j, label: W(j) }));
    });
    function g(O) {
      const C = [];
      for (const j of s.draft.aspects ?? []) if (O.aspects?.includes(j.namespace)) for (const K of j.attributes ?? []) C.push({ value: j.namespace + "." + K.code, label: W(K.code) + " (" + j.namespace + ")" });
      for (const [j, K] of Object.entries(s.schema.attributes)) K.plugin && O.aspects?.includes(j.split(".")[0]) && !C.some((Z) => Z.value === j) && C.push({ value: j, label: W(j) + " (" + j.split(".")[0] + ")" });
      return C;
    }
    const v = H(() => s.draft.dimensions ?? []), A = L("");
    function T() {
      const O = A.value.trim();
      !se.test(O) || (s.draft.families ?? []).some((C) => C.code === O) || ((s.draft.families ??= []).push({ code: O, aspects: [] }), A.value = "");
    }
    function M(O) {
      s.draft.families.splice(s.draft.families.indexOf(O), 1), s.schema.declaration.families?.some((C) => C.code === O.code) && m("remove", "families", O.code);
    }
    function x(O) {
      return O.variation ?? [];
    }
    function w(O) {
      (O.variation ??= []).push({ axes: [] });
    }
    function i(O) {
      return O.requirements ?? [];
    }
    const u = L({});
    function n(O) {
      const C = (u.value[O.code] ?? "").trim();
      !se.test(C) || i(O).some((j) => j.id === C) || ((O.requirements ??= []).push({ id: C, require: [] }), u.value[O.code] = "");
    }
    function f(O, C) {
      return O.context?.[C] ?? "";
    }
    function _(O, C, j) {
      const K = { ...O.context ?? {} };
      j ? K[C] = j : delete K[C], Object.keys(K).length ? O.context = K : delete O.context;
    }
    return (O, C) => (l(), I(ke, {
      count: h.value.length,
      columns: ["code", "details"]
    }, ie({
      default: b(() => [
        (l(!0), o(E, null, J(h.value, (j) => (l(), I($e, {
          title: t(W)(j.code),
          code: j.code,
          key: j.code
        }, ie({
          details: b(() => [
            e("span", ls, S(j.aspects?.length ?? 0) + " " + S(j.aspects?.length === 1 ? "field group" : "field groups"), 1)
          ]),
          default: b(() => [
            e("div", as, [
              e("div", ts, [
                e("div", ss, [
                  C[1] || (C[1] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Field groups"),
                    e("span", { class: "pim-f-note" }, "the fields this family's products carry")
                  ], -1)),
                  p(me, {
                    disabled: !d.value,
                    "model-value": j.aspects ?? [],
                    options: r.value,
                    "onUpdate:modelValue": (K) => t(we)(j, "aspects", K)
                  }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            e("div", ns, [
              C[5] || (C[5] = e("header", { class: "pim-aspect-head" }, [
                e("h3", null, "Variation"),
                e("span", { class: "muted small" }, "model → variants → items; each level owns axes that make its children distinct")
              ], -1)),
              e("div", is, [
                (l(!0), o(E, null, J(x(j), (K, Z) => (l(), o("div", {
                  key: Z,
                  class: "pim-level"
                }, [
                  e("div", os, [
                    e("strong", null, "Level " + S(Z + 1), 1),
                    d.value ? (l(), I(t(P), {
                      key: 0,
                      type: "button",
                      "aria-label": "Remove level",
                      onClick: (G) => x(j).splice(Z, 1),
                      text: "",
                      severity: "secondary",
                      size: "small"
                    }, {
                      default: b(() => [
                        p(t(F), { icon: "tabler:x" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])) : U("", !0)
                  ]),
                  e("div", ds, [
                    e("div", us, [
                      C[2] || (C[2] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Axes"),
                        e("span", { class: "pim-f-note" }, "key-indexed, one value each")
                      ], -1)),
                      p(me, {
                        disabled: !d.value,
                        "model-value": K.axes ?? [],
                        options: g(j),
                        "onUpdate:modelValue": (G) => K.axes = G
                      }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
                    ]),
                    e("div", rs, [
                      C[3] || (C[3] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Also owned here"),
                        e("span", { class: "pim-f-note" }, "other fields written at this level")
                      ], -1)),
                      p(me, {
                        disabled: !d.value,
                        "model-value": K.own ?? [],
                        options: g(j),
                        "onUpdate:modelValue": (G) => G.length ? K.own = G : delete K.own
                      }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
                    ])
                  ])
                ]))), 128)),
                d.value ? (l(), I(t(P), {
                  key: 0,
                  type: "button",
                  onClick: (K) => w(j),
                  severity: "secondary",
                  outlined: "",
                  size: "small"
                }, {
                  default: b(() => [
                    p(t(F), {
                      icon: "tabler:plus",
                      "aria-hidden": "true"
                    }),
                    C[4] || (C[4] = z(" Add level", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])) : U("", !0)
              ])
            ]),
            e("div", cs, [
              C[10] || (C[10] = e("header", { class: "pim-aspect-head" }, [
                e("h3", null, "Requirements"),
                e("span", { class: "muted small" }, "what a channel needs before a product is ready")
              ], -1)),
              e("div", ms, [
                (l(!0), o(E, null, J(i(j), (K, Z) => (l(), o("div", {
                  key: K.id,
                  class: "pim-level"
                }, [
                  e("div", ps, [
                    e("strong", vs, S(K.id), 1),
                    d.value ? (l(), I(t(P), {
                      key: 0,
                      type: "button",
                      "aria-label": "Remove requirement",
                      onClick: (G) => i(j).splice(Z, 1),
                      text: "",
                      severity: "secondary",
                      size: "small"
                    }, {
                      default: b(() => [
                        p(t(F), { icon: "tabler:x" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])) : U("", !0)
                  ]),
                  e("div", fs, [
                    (l(!0), o(E, null, J(v.value, (G) => (l(), o("div", {
                      key: G.name,
                      class: "pim-f pim-w-third"
                    }, [
                      e("div", ys, [
                        e("label", null, S(t(W)(G.name)), 1),
                        C[6] || (C[6] = e("span", { class: "pim-f-note" }, "context", -1))
                      ]),
                      p(t(ce), {
                        disabled: !d.value,
                        "model-value": f(K, G.name),
                        "onUpdate:modelValue": (le) => _(K, G.name, le),
                        options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ...G.members.map((le) => ({ value: le, label: String(le) }))],
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self"
                      }, null, 8, ["disabled", "model-value", "onUpdate:modelValue", "options"])
                    ]))), 128)),
                    e("div", bs, [
                      C[7] || (C[7] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Required"),
                        e("span", { class: "pim-f-note" }, "must hold a value")
                      ], -1)),
                      p(me, {
                        disabled: !d.value,
                        "model-value": K.require ?? [],
                        options: g(j),
                        "onUpdate:modelValue": (G) => t(we)(K, "require", G)
                      }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
                    ]),
                    e("div", gs, [
                      C[8] || (C[8] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Authored"),
                        e("span", { class: "pim-f-note" }, "must be set in the context itself, not by fallback")
                      ], -1)),
                      p(me, {
                        disabled: !d.value,
                        "model-value": K.authored ?? [],
                        options: g(j),
                        "onUpdate:modelValue": (G) => t(we)(K, "authored", G)
                      }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
                    ])
                  ])
                ]))), 128)),
                d.value ? (l(), o("div", hs, [
                  p(t(de), {
                    modelValue: u.value[j.code],
                    "onUpdate:modelValue": (K) => u.value[j.code] = K,
                    type: "text",
                    placeholder: "requirement_id",
                    onKeydown: ve(ae((K) => n(j), ["prevent"]), ["enter"]),
                    class: "mono narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                  p(t(P), {
                    type: "button",
                    disabled: !t(se).test(u.value[j.code] ?? ""),
                    onClick: (K) => n(j),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: b(() => [
                      p(t(F), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      C[9] || (C[9] = z(" Add requirement", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])) : U("", !0)
              ])
            ])
          ]),
          _: 2
        }, [
          d.value ? {
            name: "actions",
            fn: b(() => [
              p(t(P), {
                type: "button",
                onClick: (K) => M(j),
                "aria-label": "Remove " + t(W)(j.code),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: b(() => [
                  p(t(F), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick", "aria-label"])
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["title", "code"]))), 128))
      ]),
      _: 2
    }, [
      d.value ? {
        name: "add",
        fn: b(() => [
          e("div", ks, [
            p(t(de), {
              modelValue: A.value,
              "onUpdate:modelValue": C[0] || (C[0] = (j) => A.value = j),
              type: "text",
              placeholder: "new_family",
              onKeydown: ve(ae(T, ["prevent"]), ["enter"]),
              class: "mono"
            }, null, 8, ["modelValue", "onKeydown"]),
            p(t(P), {
              type: "button",
              disabled: !t(se).test(A.value),
              onClick: T,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: b(() => [
                p(t(F), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                }),
                C[11] || (C[11] = z(" Add family", -1))
              ]),
              _: 1
            }, 8, ["disabled"]),
            C[12] || (C[12] = e("span", { class: "muted small" }, "Products without a family use the generic one.", -1))
          ])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), ws = ["inert"], _s = {
  key: 0,
  class: "row wrap"
}, Cs = {
  key: 2,
  class: "small muted"
}, xs = { class: "pim-principal-service" }, Vs = /* @__PURE__ */ X({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(a, { emit: $ }) {
    const s = a, m = $, d = L(!1), h = L(""), r = L({});
    let g = 0;
    ue(() => s.modelValue, async (x) => {
      const w = ++g;
      try {
        const i = await ll(s.catalogId ?? "", x);
        w === g && (r.value = i);
      } catch {
        w === g && (r.value = {});
      }
    }, { immediate: !0, deep: !0 }), Ae(() => {
      g++;
    });
    function v(x) {
      return r.value[x] ?? pe(x, "Person");
    }
    Ze(async () => {
      try {
        await _l("wc-principal-picker"), d.value = !0;
      } catch {
        d.value = !1;
      }
    });
    function A(x) {
      s.disabled || !x.trim() || s.modelValue.includes(x.trim()) || (m("update:modelValue", [...s.modelValue, x.trim()]), h.value = "");
    }
    function T(x) {
      const w = x.detail;
      if (!w || typeof w != "object") return;
      const i = w, u = i.principal_id ?? i.id;
      typeof u == "string" && A(u);
    }
    function M(x) {
      s.disabled || m("update:modelValue", s.modelValue.filter((w) => w !== x));
    }
    return (x, w) => (l(), o("div", {
      class: "pim-principal-list",
      inert: a.disabled || void 0
    }, [
      a.modelValue.length ? (l(), o("div", _s, [
        (l(!0), o(E, null, J(a.modelValue, (i) => (l(), I(t(oe), {
          key: i,
          severity: "secondary"
        }, {
          default: b(() => [
            e("span", null, S(v(i)), 1),
            p(t(P), {
              text: "",
              size: "small",
              disabled: a.disabled,
              "aria-label": "Remove " + v(i),
              onClick: (u) => M(i)
            }, {
              default: b(() => [
                p(t(F), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : U("", !0),
      d.value ? (l(), o("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: ae(T, ["stop"])
      }, null, 32)) : (l(), o("span", Cs, "The person picker is unavailable.")),
      e("label", xs, [
        w[3] || (w[3] = e("span", { class: "small muted" }, "Service account", -1)),
        p(t(de), {
          modelValue: h.value,
          "onUpdate:modelValue": w[0] || (w[0] = (i) => h.value = i),
          disabled: a.disabled,
          placeholder: "Service principal id",
          onKeydown: w[1] || (w[1] = ve(ae((i) => A(h.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "disabled"])
      ]),
      p(t(P), {
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: a.disabled || !h.value.trim(),
        onClick: w[2] || (w[2] = (i) => A(h.value))
      }, {
        default: b(() => [
          p(t(F), { icon: "tabler:plus" }),
          w[4] || (w[4] = z(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, ws));
  }
}), Us = { class: "pim-stack" }, Ss = { class: "muted small" }, As = { class: "pim-fields" }, Os = { class: "pim-f pim-w-half" }, Rs = { class: "pim-f pim-w-half" }, Is = { class: "row pim-add-row" }, js = { class: "muted small" }, Ts = { class: "pim-fields" }, zs = { class: "pim-f pim-w-third" }, Ds = { class: "pim-f pim-w-third" }, Ns = { class: "row" }, qs = { class: "pim-f pim-w-third" }, Ls = { key: 1 }, Ps = { class: "pim-f pim-w-full" }, Es = { class: "row pim-add-row" }, Bs = /* @__PURE__ */ X({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(a, { emit: $ }) {
    const s = a, m = $, d = H(() => s.schema.access.admin), h = H(() => s.draft.channels ?? []), r = H(() => s.draft.sources ?? []), g = H(() => [...new Set((s.draft.families ?? []).flatMap((n) => (n.requirements ?? []).map((f) => f.id)))].map((n) => ({ value: n }))), v = H(() => (s.draft.families ?? []).filter((n) => n.code !== "generic").map((n) => ({ value: n.code, label: W(n.code) }))), A = H(() => (s.draft.aspects ?? []).map((n) => ({ value: n.namespace, label: W(n.namespace) }))), T = L(""), M = L("");
    function x() {
      const n = T.value.trim();
      !se.test(n) || h.value.some((f) => f.id === n) || ((s.draft.channels ??= []).push({ id: n, requirements: [] }), T.value = "");
    }
    function w(n) {
      h.value.splice(h.value.indexOf(n), 1), s.schema.declaration.channels?.some((f) => f.id === n.id) && m("remove", "channels", n.id);
    }
    function i() {
      const n = M.value.trim();
      !se.test(n) || r.value.some((f) => f.id === n) || ((s.draft.sources ??= []).push({ id: n, ordering: "none", writes: [] }), M.value = "");
    }
    function u(n) {
      r.value.splice(r.value.indexOf(n), 1), s.schema.declaration.sources?.some((f) => f.id === n.id) && m("remove", "sources", n.id);
    }
    return (n, f) => (l(), o("div", Us, [
      p(ke, {
        count: h.value.length,
        columns: ["code", "details"]
      }, ie({
        head: b(() => [
          f[2] || (f[2] = e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Channels")
          ], -1))
        ]),
        default: b(() => [
          (l(!0), o(E, null, J(h.value, (_) => (l(), I($e, {
            key: _.id,
            title: t(W)(_.id),
            code: _.id
          }, ie({
            details: b(() => [
              e("span", Ss, S(_.requirements?.length ?? 0) + " " + S(_.requirements?.length === 1 ? "requirement" : "requirements"), 1)
            ]),
            default: b(() => [
              e("div", As, [
                e("div", Os, [
                  f[3] || (f[3] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Requirements"),
                    e("span", { class: "pim-f-note" }, "a product is ready for the channel when these hold")
                  ], -1)),
                  p(me, {
                    disabled: !d.value,
                    "model-value": _.requirements ?? [],
                    options: g.value,
                    "onUpdate:modelValue": (O) => t(we)(_, "requirements", O)
                  }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", Rs, [
                  f[4] || (f[4] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Families"),
                    e("span", { class: "pim-f-note" }, "empty means every family")
                  ], -1)),
                  p(me, {
                    disabled: !d.value,
                    "model-value": _.families ?? [],
                    options: v.value,
                    "onUpdate:modelValue": (O) => t(we)(_, "families", O)
                  }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            d.value ? {
              name: "actions",
              fn: b(() => [
                p(t(P), {
                  type: "button",
                  onClick: (O) => w(_),
                  "aria-label": "Remove " + t(W)(_.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: b(() => [
                    p(t(F), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["onClick", "aria-label"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["title", "code"]))), 128))
        ]),
        _: 2
      }, [
        d.value ? {
          name: "add",
          fn: b(() => [
            e("div", Is, [
              p(t(de), {
                modelValue: T.value,
                "onUpdate:modelValue": f[0] || (f[0] = (_) => T.value = _),
                type: "text",
                placeholder: "new_channel",
                onKeydown: ve(ae(x, ["prevent"]), ["enter"]),
                class: "mono"
              }, null, 8, ["modelValue", "onKeydown"]),
              p(t(P), {
                type: "button",
                disabled: !t(se).test(T.value),
                onClick: x,
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: b(() => [
                  p(t(F), {
                    icon: "tabler:plus",
                    "aria-hidden": "true"
                  }),
                  f[5] || (f[5] = z(" Add channel", -1))
                ]),
                _: 1
              }, 8, ["disabled"])
            ])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"]),
      p(ke, {
        count: r.value.length,
        columns: ["code", "details"]
      }, ie({
        head: b(() => [
          f[6] || (f[6] = e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Sources")
          ], -1))
        ]),
        default: b(() => [
          (l(!0), o(E, null, J(r.value, (_) => (l(), I($e, {
            key: _.id,
            title: t(W)(_.id),
            code: _.id
          }, ie({
            details: b(() => [
              e("span", js, S(_.writes?.length ?? 0) + " " + S(_.writes?.length === 1 ? "field group" : "field groups"), 1)
            ]),
            default: b(() => [
              e("div", Ts, [
                e("div", zs, [
                  f[7] || (f[7] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Ordering"),
                    e("span", { class: "pim-f-note" }, "sequence keeps late deliveries from winning")
                  ], -1)),
                  p(t(ce), {
                    disabled: !d.value,
                    "model-value": _.ordering ?? "none",
                    "onUpdate:modelValue": (O) => _.ordering = O,
                    options: [{ value: "none", label: "none" }, { value: "sequence", label: "sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "model-value", "onUpdate:modelValue"])
                ]),
                e("div", Ds, [
                  f[8] || (f[8] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Audit"),
                    e("span", { class: "pim-f-note" }, "record each value change")
                  ], -1)),
                  e("label", Ns, [
                    p(t(Se), {
                      disabled: !d.value,
                      "aria-label": "Audit " + _.id,
                      "model-value": _.audit !== !1,
                      "onUpdate:modelValue": (O) => O ? delete _.audit : _.audit = !1
                    }, null, 8, ["disabled", "aria-label", "model-value", "onUpdate:modelValue"]),
                    e("span", null, S(_.audit === !1 ? "Off for this source" : "As the catalog policy"), 1)
                  ])
                ]),
                e("div", qs, [
                  f[9] || (f[9] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Principals"),
                    e("span", { class: "pim-f-note" }, "who may write as this source")
                  ], -1)),
                  d.value ? (l(), I(Vs, {
                    key: 0,
                    "catalog-id": a.catalogId,
                    "model-value": _.principals ?? [],
                    "onUpdate:modelValue": (O) => t(we)(_, "principals", O)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])) : (l(), o("span", Ls, S(_.principals?.length ? _.principals.length + (_.principals.length === 1 ? " allowed account" : " allowed accounts") : "No accounts specified"), 1))
                ]),
                e("div", Ps, [
                  f[10] || (f[10] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Writes"),
                    e("span", { class: "pim-f-note" }, "field groups this source may set")
                  ], -1)),
                  p(me, {
                    disabled: !d.value,
                    "model-value": _.writes ?? [],
                    options: A.value,
                    "onUpdate:modelValue": (O) => t(we)(_, "writes", O)
                  }, null, 8, ["disabled", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            d.value ? {
              name: "actions",
              fn: b(() => [
                p(t(P), {
                  type: "button",
                  onClick: (O) => u(_),
                  "aria-label": "Remove " + t(W)(_.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: b(() => [
                    p(t(F), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["onClick", "aria-label"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["title", "code"]))), 128))
        ]),
        _: 2
      }, [
        d.value ? {
          name: "add",
          fn: b(() => [
            e("div", Es, [
              p(t(de), {
                modelValue: M.value,
                "onUpdate:modelValue": f[1] || (f[1] = (_) => M.value = _),
                type: "text",
                placeholder: "new_source",
                onKeydown: ve(ae(i, ["prevent"]), ["enter"]),
                class: "mono"
              }, null, 8, ["modelValue", "onKeydown"]),
              p(t(P), {
                type: "button",
                disabled: !t(se).test(M.value),
                onClick: i,
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: b(() => [
                  p(t(F), {
                    icon: "tabler:plus",
                    "aria-hidden": "true"
                  }),
                  f[11] || (f[11] = z(" Add source", -1))
                ]),
                _: 1
              }, 8, ["disabled"])
            ])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])
    ]));
  }
}), Ms = { class: "pim-stack" }, Ks = { class: "pim-bsection-head" }, Hs = { class: "muted small" }, Fs = {
  key: 0,
  class: "pim-aspect muted"
}, Js = {
  key: 1,
  class: "muted small"
}, Ws = {
  key: 3,
  class: "muted small"
}, Gs = {
  key: 0,
  class: "pim-aspect muted"
}, Ys = { class: "muted small" }, Zs = /* @__PURE__ */ X({
  __name: "BuilderPlugins",
  props: {
    draft: {},
    schema: {},
    options: {},
    pluginConfigs: { default: () => ({}) },
    stale: { type: Boolean }
  },
  emits: ["remove", "configure"],
  setup(a, { emit: $ }) {
    const s = a, m = $, d = H(() => s.schema.access.admin), h = H(() => s.draft.plugins ?? []);
    function r(i) {
      return h.value.some((u) => u.use === i.plugin);
    }
    function g(i) {
      return s.schema.plugins.find((u) => u.plugin === i.plugin);
    }
    function v(i, u) {
      u && !r(i) && (s.draft.plugins ??= []).push({ use: i.plugin }), u || (s.draft.plugins = h.value.filter((n) => n.use !== i.plugin), delete s.pluginConfigs[i.plugin], g(i)?.active && m("remove", "plugins", i.plugin));
    }
    function A(i, u) {
      s.pluginConfigs[i.plugin] = u;
    }
    function T(i) {
      return Object.entries(s.schema.attributes).filter(([, u]) => u.plugin === i.plugin).map(([u]) => u);
    }
    const M = H(() => s.draft.scopes ?? []);
    function x(i) {
      return M.value.includes(i.id);
    }
    function w(i, u) {
      u && !x(i) && (s.draft.scopes ??= []).push(i.id), !u && x(i) && (M.value.splice(M.value.indexOf(i.id), 1), s.schema.declaration.scopes?.includes(i.id) && m("remove", "scopes", i.id));
    }
    return (i, u) => (l(), o("div", Ms, [
      p(ke, {
        count: a.options.plugins.length,
        columns: ["details"]
      }, {
        head: b(() => [
          e("header", Ks, [
            u[0] || (u[0] = e("h3", null, "Plugins", -1)),
            e("span", Hs, S(a.options.plugins.length) + " installed", 1)
          ])
        ]),
        default: b(() => [
          a.options.plugins.length === 0 ? (l(), o("div", Fs, "No plugin is installed.")) : U("", !0),
          (l(!0), o(E, null, J(a.options.plugins, (n) => (l(), I($e, {
            key: n.plugin,
            title: t(pe)(n.title, "Plugin")
          }, ie({
            details: b(() => [
              p(t(oe), {
                severity: r(n) ? "success" : "secondary",
                value: r(n) ? "Active" : "Inactive"
              }, null, 8, ["severity", "value"])
            ]),
            default: b(() => [
              g(n)?.problem ? (l(), I(t(he), {
                key: 0,
                severity: "warn"
              }, {
                default: b(() => [
                  z(S(g(n)?.problem?.message), 1)
                ]),
                _: 2
              }, 1024)) : U("", !0),
              T(n).length ? (l(), o("p", Js, "Fields: " + S(T(n).join(", ")) + ".", 1)) : U("", !0),
              r(n) ? (l(), I(Ke, {
                key: 2,
                disabled: !d.value,
                schema: n.config_schema,
                "model-value": a.pluginConfigs[n.plugin] ?? g(n)?.config ?? {},
                "onUpdate:modelValue": (f) => A(n, f)
              }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue"])) : U("", !0),
              g(n)?.active ? (l(), o("p", Ws, [
                z(S(g(n)?.lifecycle.state), 1),
                (l(!0), o(E, null, J(g(n)?.projections, (f, _) => (l(), o("span", { key: _ }, " · " + S(_) + ": " + S(f.parked ? "paused" : f.bootstrapping ? "initializing" : "ready"), 1))), 128))
              ])) : U("", !0),
              d.value && g(n)?.active && a.pluginConfigs[n.plugin] ? (l(), I(t(P), {
                key: 4,
                disabled: a.stale,
                label: "Save configuration",
                onClick: (f) => m("configure", n.plugin, a.pluginConfigs[n.plugin])
              }, null, 8, ["disabled", "onClick"])) : U("", !0)
            ]),
            _: 2
          }, [
            d.value ? {
              name: "actions",
              fn: b(() => [
                p(t(Se), {
                  "aria-label": "Enable " + t(pe)(n.title, "Plugin"),
                  "model-value": r(n),
                  "onUpdate:modelValue": (f) => v(n, f)
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["title"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      p(ke, {
        count: a.options.scopes.length,
        columns: ["details"]
      }, {
        head: b(() => [...u[1] || (u[1] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Scopes"),
            e("span", { class: "muted small" }, "filters the grid can use from plugin tables")
          ], -1)
        ])]),
        default: b(() => [
          a.options.scopes.length === 0 ? (l(), o("div", Gs, "No scope is declared.")) : U("", !0),
          (l(!0), o(E, null, J(a.options.scopes, (n) => (l(), I($e, {
            key: n.id,
            title: t(pe)(n.title, "Scope")
          }, ie({
            details: b(() => [
              p(t(oe), {
                severity: x(n) ? "success" : "secondary",
                value: x(n) ? "Adopted" : "Not adopted"
              }, null, 8, ["severity", "value"])
            ]),
            default: b(() => [
              e("p", Ys, [
                u[2] || (u[2] = z("Filters: ", -1)),
                (l(!0), o(E, null, J(n.filters, (f, _) => (l(), I(t(oe), {
                  key: _,
                  class: "kx-tag-sm small",
                  severity: "secondary"
                }, {
                  default: b(() => [
                    z(S(_) + " · " + S(f.ops.join(" ")), 1)
                  ]),
                  _: 2
                }, 1024))), 128)),
                z(" · needs " + S(n.access) + " access", 1)
              ])
            ]),
            _: 2
          }, [
            d.value ? {
              name: "actions",
              fn: b(() => [
                p(t(Se), {
                  "aria-label": "Adopt " + t(pe)(n.title, "Scope"),
                  "model-value": x(n),
                  "onUpdate:modelValue": (f) => w(n, f)
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
async function Qs(a) {
  const $ = await dl(`/api/v1/pim-admin/catalogs/${encodeURIComponent(a)}/policy_defaults`, "policy defaults");
  if ($.audit !== "fields" && $.audit !== "off" || !["audit_days", "trash_days", "tombstone_days"].every((s) => typeof $[s] == "number" && Number.isSafeInteger($[s])))
    throw new Error("Policy defaults are unavailable.");
  for (const [s, m] of Object.entries(tl)) {
    const d = $[s];
    if (typeof d != "number" || !Number.isSafeInteger(d) || d < m.min || d > m.max) throw new Error(`Policy ${s} is unavailable.`);
  }
  return $;
}
const tl = {
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
}, Xs = { class: "form" }, en = {
  key: 0,
  class: "muted small pim-policy-status",
  role: "status"
}, ln = ["id", "data-policy-group", "aria-label"], an = {
  key: 0,
  class: "pim-bsection-head"
}, tn = { class: "pim-policy-copy" }, sn = ["for"], nn = ["id"], on = { key: 0 }, dn = ["aria-expanded"], un = /* @__PURE__ */ X({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {},
    disabled: { type: Boolean }
  },
  setup(a) {
    const $ = a, s = L(), m = H(() => $.defaults ?? s.value), d = L(), h = L(!1);
    async function r() {
      if (!($.defaults || $.disabled)) {
        d.value = void 0, h.value = !0;
        try {
          s.value = await Qs($.catalogId ?? "");
        } catch (f) {
          d.value = Ce(f, "Could not read policy defaults.");
        } finally {
          h.value = !1;
        }
      }
    }
    Ze(r);
    const g = H(() => $.draft.policy ?? {}), v = L(!1), A = [
      { key: "audit", title: "Audit trail", hint: "Fields records each value change. Off records only lifecycle, schema and release history.", kind: "enum" },
      { key: "audit_days", title: "Audit retention (days)", hint: "0 uses the 365-day default. History always expires.", kind: "int", min: 0, max: 106751 },
      { key: "trash_days", title: "Trash window (days)", hint: "How long a deleted product stays restorable.", kind: "int", min: 1, max: 106751 },
      { key: "tombstone_days", title: "Deleted product notices (days)", hint: "How long feeds report a purged product as deleted.", kind: "int", min: 1, max: 106751 }
    ], T = {
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
    function M(f) {
      const _ = tl[f];
      return { key: f, ..._, kind: "int", hint: T[f] };
    }
    A.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(M));
    const x = ["proposal_days", "proposal_count"].map(M), w = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(M), i = [
      { id: "retention", title: "Retention", keys: A },
      { id: "proposals", title: "Proposals", keys: x },
      { id: "advanced", title: "", keys: w }
    ], u = H(() => [
      { value: "inherited", label: m.value ? `${m.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function n(f, _) {
      const O = $.draft.policy ?? ($.draft.policy = {});
      O[f] = _ == null || _ === "" || _ === "inherited" ? !1 : _;
    }
    return (f, _) => (l(), o("section", Xs, [
      _[4] || (_[4] = e("p", { class: "muted small pim-policy-intro" }, "Empty fields inherit the deployment settings.", -1)),
      h.value ? (l(), o("p", en, "Loading deployment defaults…")) : U("", !0),
      d.value ? (l(), I(Ne, {
        key: 1,
        error: d.value
      }, {
        default: b(() => [
          p(t(P), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: r
          }, {
            default: b(() => [..._[1] || (_[1] = [
              z("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : U("", !0),
      (l(), o(E, null, J(i, (O) => (l(), o(E, {
        key: O.id
      }, [
        O.id !== "advanced" || v.value ? (l(), o("section", {
          key: 0,
          id: O.id === "advanced" ? "policy-advanced" : void 0,
          "data-policy-group": O.id,
          class: "pim-policy-group",
          "aria-label": O.title || "Advanced"
        }, [
          O.title ? (l(), o("header", an, [
            e("h3", null, S(O.title), 1)
          ])) : U("", !0),
          (l(!0), o(E, null, J(O.keys, (C) => (l(), o("div", {
            key: C.key,
            class: "pim-policy-row"
          }, [
            e("div", tn, [
              e("label", {
                for: "pol-" + C.key
              }, S(C.title), 9, sn),
              e("p", {
                id: "pol-help-" + C.key
              }, [
                z(S(C.hint), 1),
                C.global ? (l(), o("span", on, " Managed in deployment settings.")) : U("", !0)
              ], 8, nn)
            ]),
            C.kind === "enum" ? (l(), I(t(ce), {
              key: 0,
              disabled: a.disabled,
              "input-id": "pol-" + C.key,
              "aria-describedby": "pol-help-" + C.key,
              class: "pim-policy-control",
              "model-value": typeof g.value[C.key] == "string" ? g.value[C.key] : "inherited",
              options: u.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": (j) => n(C.key, j)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])) : (l(), I(t(Vl), {
              key: 1,
              disabled: a.disabled || C.global,
              "input-id": "pol-" + C.key,
              "aria-describedby": "pol-help-" + C.key,
              class: "pim-policy-control",
              "model-value": C.global ? Number(m.value?.[C.key] ?? 0) || null : typeof g.value[C.key] == "number" ? Number(g.value[C.key]) : null,
              min: C.min ?? (C.key === "audit_days" ? 0 : 1),
              max: C.max,
              step: 1,
              placeholder: m.value ? "Default: " + m.value[C.key] : "Deployment default",
              "onUpdate:modelValue": (j) => n(C.key, j)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "min", "max", "placeholder", "onUpdate:modelValue"]))
          ]))), 128))
        ], 8, ln)) : U("", !0),
        O.id === "proposals" ? (l(), o("button", {
          key: 1,
          type: "button",
          class: "pim-policy-advanced",
          "aria-expanded": v.value,
          "aria-controls": "policy-advanced",
          onClick: _[0] || (_[0] = (C) => v.value = !v.value)
        }, [
          p(t(F), {
            icon: v.value ? "tabler:chevron-down" : "tabler:chevron-right",
            "aria-hidden": "true"
          }, null, 8, ["icon"]),
          _[2] || (_[2] = e("span", null, "Advanced", -1)),
          _[3] || (_[3] = e("span", { class: "muted small" }, "Processing limits and deployment settings", -1))
        ], 8, dn)) : U("", !0)
      ], 64))), 64))
    ]));
  }
}), rn = { class: "form" }, cn = { class: "pim-aspect" }, mn = { class: "pim-aspect-head" }, pn = {
  key: 0,
  class: "muted small"
}, vn = /* @__PURE__ */ X({
  __name: "BuilderDeclaration",
  props: {
    draft: {},
    readonly: { type: Boolean }
  },
  emits: ["replace", "validity"],
  setup(a, { emit: $ }) {
    const s = a, m = $, d = L(JSON.stringify(s.draft, null, 2)), h = L("");
    Ae(() => m("validity", !0)), ue(() => s.draft, (g) => {
      d.value = JSON.stringify(g, null, 2), h.value = "";
    }, { deep: !0 });
    function r() {
      if (!s.readonly)
        try {
          const g = jl(d.value);
          h.value = "", m("validity", !0), m("replace", g);
        } catch (g) {
          m("validity", !1), h.value = "Invalid declaration: " + (g instanceof Error ? g.message : String(g));
        }
    }
    return (g, v) => (l(), o("section", rn, [
      e("div", cn, [
        e("header", mn, [
          v[1] || (v[1] = e("h3", null, "Declaration", -1)),
          a.readonly ? U("", !0) : (l(), o("span", pn, "edits apply to the draft when the JSON parses"))
        ]),
        h.value ? (l(), I(t(he), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: b(() => [
            z(S(h.value), 1)
          ]),
          _: 1
        })) : U("", !0),
        p(t(Ul), {
          modelValue: d.value,
          "onUpdate:modelValue": v[0] || (v[0] = (A) => d.value = A),
          readonly: a.readonly,
          "aria-label": "Catalog declaration",
          rows: "28",
          spellcheck: "false",
          onInput: r,
          onBlur: r,
          class: "mono pim-json-edit"
        }, null, 8, ["modelValue", "readonly"])
      ])
    ]));
  }
}), fn = {
  key: 0,
  class: "pim-detail-head"
}, yn = { class: "pim-detail-actions" }, bn = { class: "pim-settings-pane" }, gn = { class: "pim-builder-main pim-readable" }, hn = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, kn = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, $n = ["disabled", "inert"], wn = {
  key: 6,
  class: "pim-table pim-plan"
}, _n = { class: "pim-group-head" }, Cn = { class: "pim-card-body pad" }, xn = {
  key: 0,
  class: "muted"
}, Vn = {
  key: 1,
  class: "muted small"
}, Un = {
  key: 2,
  class: "muted small"
}, Sn = {
  key: 3,
  class: "muted small"
}, An = { key: 0 }, On = {
  key: 5,
  class: "pim-plan-list"
}, Rn = { class: "mono" }, In = { class: "muted" }, jn = /* @__PURE__ */ X({
  __name: "SchemaBuilder",
  props: {
    catalogId: {},
    embedded: { type: Boolean },
    title: {},
    backLabel: {}
  },
  emits: ["applied", "back", "dirty-changed"],
  setup(a, { emit: $ }) {
    const s = a, m = $, d = [
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
    ], h = L("fields"), r = L(null), g = L(null), v = L({}), A = L({}), T = L({}), M = H(() => Object.fromEntries(Object.entries(T.value).filter(([c]) => v.value.plugins?.some((k) => k.use === c) && !r.value?.plugins.some((k) => k.plugin === c && k.active)))), x = L(), w = L(!1), i = L(!1), u = H(() => r.value?.access.admin === !0), n = L(""), f = L(null), _ = L(null), O = L(!0), C = ze(), j = H(() => !w.value && O.value && !!f.value && f.value.class !== "refused" && !!_.value?.matches(B.value, r.value?.schema_generation ?? -1, M.value)), K = ze(), Z = L(!1);
    let G = 0;
    ue([v, A, T], () => {
      G++, f.value = null;
    }, { deep: !0, flush: "sync" });
    async function le(c = !1, k = !1) {
      if (q.value && !c) return;
      const y = K.begin(), Q = G, N = s.catalogId, ge = k ? Object.entries(T.value).filter(([te]) => r.value?.plugins.some((xe) => xe.plugin === te && xe.active)) : [];
      Z.value = !0, x.value = void 0;
      try {
        const [te, xe] = await Promise.all([ne.schema(N), ne.schemaOptions(N)]);
        if (!K.current(y) || Q !== G || N !== s.catalogId) return;
        r.value = te, g.value = xe, v.value = je(te.declaration), A.value = {}, T.value = Object.fromEntries(ge.filter(([sl]) => te.plugins.some((He) => He.plugin === sl && He.active))), f.value = null, O.value = !0, w.value = !1;
      } catch (te) {
        K.current(y) && (x.value = Ce(te, "Could not load settings."));
      } finally {
        K.current(y) && (Z.value = !1);
      }
    }
    let fe = () => {
    };
    ue(() => s.catalogId, (c) => {
      fe(), fe = Qe(`component.${c}`, () => {
        q.value || le();
      });
    }, { immediate: !0 }), Be(async () => {
      q.value || await le();
    }), Ae(() => {
      fe(), C.begin(), K.begin();
    }), ue(() => s.catalogId, () => {
      C.begin(), i.value = !1, w.value = !1, r.value = null, g.value = null, Ve(), le();
    });
    const D = H(() => Object.values(Je(v.value, A.value)).reduce((c, k) => c + (k?.length ?? 0), 0)), q = H(() => !!r.value && (JSON.stringify(v.value) !== JSON.stringify(r.value.declaration) || D.value > 0 || Object.keys(T.value).length > 0));
    ue(q, (c) => m("dirty-changed", c), { immediate: !0 });
    const R = H(() => ![v.value.aspects, v.value.dimensions, v.value.vocabularies, v.value.families, v.value.channels, v.value.sources, v.value.plugins, v.value.scopes].some((c) => c?.length)), B = H(() => {
      const c = je(v.value), k = Je(c, A.value);
      return Object.keys(k).length && (c.remove = k), c;
    });
    ue(q, (c) => {
      c || (f.value = null);
    }), ue([B, M], () => {
      f.value = null;
    }, { deep: !0 });
    function ee(c, k) {
      x.value = Ce(c, k), x.value.code === ul && (w.value = !0, f.value = null, _.value = null);
    }
    async function Oe() {
      if (!(q.value && !await Xe.confirm({
        header: "Discard unsaved changes?",
        message: "Reloading will discard unsaved settings and plugin changes.",
        acceptLabel: "Discard and reload",
        rejectLabel: "Cancel"
      }))) {
        i.value = !0, n.value = "";
        try {
          await le(!0);
        } finally {
          i.value = !1;
        }
      }
    }
    async function Re() {
      if (!r.value || !O.value || w.value) return;
      const c = C.begin(), k = Ol(B.value, r.value.schema_generation, M.value);
      i.value = !0, x.value = void 0;
      try {
        const y = await ne.planSchema(s.catalogId, k.declaration, k.generation, k.pluginConfigs);
        if (!C.current(c) || !k.matches(B.value, r.value.schema_generation, M.value) || !O.value) return;
        _.value = k, f.value = y;
      } catch (y) {
        if (!C.current(c)) return;
        ee(y, "Could not review the change."), f.value = null, _.value = null;
      } finally {
        C.current(c) && (i.value = !1);
      }
    }
    async function be() {
      if (!r.value || !q.value || !j.value || !_.value) return;
      const c = s.catalogId, k = C.begin();
      i.value = !0, x.value = void 0, n.value = "";
      try {
        const y = await ne.applySchema(c, _.value.declaration, _.value.generation, _.value.pluginConfigs);
        if (c !== s.catalogId || !C.current(k) || (await le(!0, !0), c !== s.catalogId || !C.current(k))) return;
        n.value = `Applied as generation ${y.generation} (${y.class})`, m("applied", y.generation);
      } catch (y) {
        if (c !== s.catalogId || !C.current(k)) return;
        ee(y, "Could not apply the change.");
      } finally {
        C.current(k) && (i.value = !1);
      }
    }
    async function Ie(c, k) {
      const y = s.catalogId, Q = K.begin(), N = C.begin();
      i.value = !0, x.value = void 0;
      try {
        const ge = JSON.stringify(k);
        if (await ne.configurePlugin(y, c, je(k)), y !== s.catalogId || !K.current(Q)) return;
        const te = await ne.schema(y);
        if (y !== s.catalogId || !K.current(Q)) return;
        r.value && (r.value.plugins = te.plugins), JSON.stringify(T.value[c]) === ge && delete T.value[c], n.value = "Configuration saved";
      } catch (ge) {
        y === s.catalogId && C.current(N) && ee(ge, "Could not save configuration.");
      } finally {
        C.current(N) && (i.value = !1);
      }
    }
    function Ve() {
      T.value = {}, O.value = !0, r.value && (v.value = je(r.value.declaration)), A.value = {}, f.value = null, n.value = "";
    }
    function V(c, k) {
      const y = A.value[c] ?? [];
      y.includes(k) || (A.value = { ...A.value, [c]: [...y, k] });
    }
    return (c, k) => (l(), o("div", {
      class: ye(["pim-builder", { embedded: a.embedded }])
    }, [
      a.embedded ? (l(), o("div", fn, [
        e("h2", null, S(a.title || "Catalog"), 1),
        r.value ? (l(), I(t(oe), {
          key: 0,
          severity: "secondary",
          value: "Generation " + r.value.schema_generation
        }, null, 8, ["value"])) : U("", !0),
        e("div", yn, [
          re(c.$slots, "actions", {
            access: r.value?.access
          }),
          p(Ge, {
            access: r.value?.access,
            "apply-label": h.value === "layout" ? "Apply layout" : "Apply",
            dirty: q.value,
            busy: i.value,
            valid: O.value && !w.value,
            reviewed: !!f.value,
            "can-apply": j.value,
            onDiscard: Ve,
            onReview: Re,
            onApply: be
          }, null, 8, ["access", "apply-label", "dirty", "busy", "valid", "reviewed", "can-apply"])
        ])
      ])) : (l(), I(xa, {
        key: 1,
        title: a.title || "Catalog",
        subtitle: r.value ? "Settings · generation " + r.value.schema_generation : "Settings",
        icon: "tabler:settings",
        "back-label": a.backLabel,
        onBack: k[0] || (k[0] = (y) => m("back"))
      }, {
        default: b(() => [
          re(c.$slots, "actions", {
            access: r.value?.access
          }),
          p(Ge, {
            access: r.value?.access,
            "apply-label": h.value === "layout" ? "Apply layout" : "Apply",
            dirty: q.value,
            busy: i.value,
            valid: O.value && !w.value,
            reviewed: !!f.value,
            "can-apply": j.value,
            onDiscard: Ve,
            onReview: Re,
            onApply: be
          }, null, 8, ["access", "apply-label", "dirty", "busy", "valid", "reviewed", "can-apply"])
        ]),
        _: 3
      }, 8, ["title", "subtitle", "back-label"])),
      r.value && g.value ? (l(), I(t(kl), {
        key: 2,
        value: h.value,
        "onUpdate:value": k[1] || (k[1] = (y) => h.value = y),
        class: "pim-section-tabs"
      }, {
        default: b(() => [
          p(t($l), { "aria-label": "Schema sections" }, {
            default: b(() => [
              (l(), o(E, null, J(d, (y) => p(t(wl), {
                key: y.id,
                value: y.id
              }, {
                default: b(() => [
                  z(S(y.title), 1)
                ]),
                _: 2
              }, 1032, ["value"])), 64))
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["value"])) : U("", !0),
      e("div", bn, [
        e("div", gn, [
          x.value ? (l(), I(Ne, {
            key: 0,
            error: x.value
          }, {
            default: b(() => [
              w.value ? (l(), I(t(P), {
                key: 0,
                type: "button",
                severity: "secondary",
                outlined: "",
                size: "small",
                disabled: i.value,
                onClick: Oe
              }, {
                default: b(() => [...k[5] || (k[5] = [
                  z("Reload settings", -1)
                ])]),
                _: 1
              }, 8, ["disabled"])) : !r.value || !g.value ? (l(), I(t(P), {
                key: 1,
                type: "button",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: k[2] || (k[2] = (y) => le())
              }, {
                default: b(() => [...k[6] || (k[6] = [
                  z("Retry", -1)
                ])]),
                _: 1
              })) : U("", !0)
            ]),
            _: 1
          }, 8, ["error"])) : w.value && Z.value ? (l(), o("div", hn, "Reloading settings…")) : U("", !0),
          n.value ? (l(), I(t(he), {
            key: 2,
            severity: "success"
          }, {
            default: b(() => [
              z(S(n.value), 1)
            ]),
            _: 1
          })) : U("", !0),
          Z.value && (!r.value || !g.value) ? (l(), o("div", kn, "Loading…")) : r.value && g.value && h.value === "history" ? (l(), I(ha, {
            key: 4,
            "catalog-id": a.catalogId,
            "can-resolve-actors": u.value
          }, null, 8, ["catalog-id", "can-resolve-actors"])) : r.value && g.value ? (l(), o("fieldset", {
            key: 5,
            class: "pim-editor-surface",
            disabled: i.value,
            inert: i.value
          }, [
            u.value ? U("", !0) : (l(), I(t(he), {
              key: 0,
              severity: "info",
              class: "pim-readonly"
            }, {
              default: b(() => [...k[7] || (k[7] = [
                z("Read-only settings", -1)
              ])]),
              _: 1
            })),
            R.value && h.value === "fields" ? (l(), I(t(he), {
              key: 1,
              severity: "info"
            }, {
              default: b(() => [
                z(S(u.value ? "Define its schema. Add a field group to start defining fields." : "This catalog has no field groups yet."), 1)
              ]),
              _: 1
            })) : U("", !0),
            h.value === "fields" ? (l(), I(_t, {
              key: 2,
              draft: v.value,
              schema: r.value,
              options: g.value,
              onRemove: V
            }, null, 8, ["draft", "schema", "options"])) : h.value === "layout" ? (l(), I(Ql, {
              key: 3,
              draft: v.value,
              schema: r.value
            }, null, 8, ["draft", "schema"])) : h.value === "dimensions" ? (l(), I(Rt, {
              key: 4,
              draft: v.value,
              schema: r.value,
              onRemove: V
            }, null, 8, ["draft", "schema"])) : h.value === "vocabularies" ? (l(), I(es, {
              key: 5,
              "catalog-id": a.catalogId,
              draft: v.value,
              schema: r.value,
              onRemove: V
            }, null, 8, ["catalog-id", "draft", "schema"])) : h.value === "families" ? (l(), I($s, {
              key: 6,
              draft: v.value,
              schema: r.value,
              onRemove: V
            }, null, 8, ["draft", "schema"])) : h.value === "channels" ? (l(), I(Bs, {
              key: 7,
              "catalog-id": a.catalogId,
              draft: v.value,
              schema: r.value,
              onRemove: V
            }, null, 8, ["catalog-id", "draft", "schema"])) : h.value === "plugins" ? (l(), I(Zs, {
              key: 8,
              draft: v.value,
              schema: r.value,
              options: g.value,
              "plugin-configs": T.value,
              stale: w.value,
              onConfigure: Ie,
              onRemove: V
            }, null, 8, ["draft", "schema", "options", "plugin-configs", "stale"])) : h.value === "policy" ? (l(), I(un, {
              key: 9,
              "catalog-id": a.catalogId,
              draft: v.value,
              disabled: !u.value
            }, null, 8, ["catalog-id", "draft", "disabled"])) : h.value === "declaration" ? (l(), I(vn, {
              key: 10,
              draft: v.value,
              readonly: !u.value,
              onReplace: k[3] || (k[3] = (y) => v.value = y),
              onValidity: k[4] || (k[4] = (y) => {
                O.value = y, f.value = null;
              })
            }, null, 8, ["draft", "readonly"])) : U("", !0)
          ], 8, $n)) : U("", !0),
          f.value ? (l(), o("div", wn, [
            e("div", _n, [
              p(t(F), { icon: "tabler:checklist" }),
              k[8] || (k[8] = e("h3", null, "Review", -1)),
              p(t(oe), {
                class: "kx-tag-sm",
                severity: f.value.class === "refused" ? "danger" : f.value.class === "semantic" ? "warn" : "info"
              }, {
                default: b(() => [
                  z(S(f.value.class), 1)
                ]),
                _: 1
              }, 8, ["severity"])
            ]),
            e("div", Cn, [
              f.value.class === "unchanged" ? (l(), o("p", xn, "Nothing would change.")) : f.value.class === "cosmetic" ? (l(), o("p", Vn, "Labels, order, widths or choices only; no product is touched.")) : f.value.class === "additive" ? (l(), o("p", Un, "New fields or options; existing values stay as they are.")) : f.value.class === "semantic" ? (l(), o("p", Sn, "Resolved values or readiness change; the catalog rebuilds its rows after apply.")) : (l(), I(t(he), {
                key: 4,
                severity: "error"
              }, {
                default: b(() => [
                  k[9] || (k[9] = z("Refused: the draft cannot be compiled as it stands.", -1)),
                  f.value.migration ? (l(), o("span", An, S(f.value.migration), 1)) : U("", !0)
                ]),
                _: 1
              })),
              f.value.changes.length || f.value.refused.length ? (l(), o("ul", On, [
                (l(!0), o(E, null, J([...f.value.refused, ...f.value.changes], (y, Q) => (l(), o("li", { key: Q }, [
                  p(t(oe), {
                    class: "kx-tag-sm small",
                    severity: y.class === "refused" ? "danger" : y.class === "semantic" ? "warn" : "info"
                  }, {
                    default: b(() => [
                      z(S(y.class), 1)
                    ]),
                    _: 2
                  }, 1032, ["severity"]),
                  e("span", Rn, S(y.code), 1),
                  e("span", In, S(y.what), 1)
                ]))), 128))
              ])) : U("", !0)
            ])
          ])) : U("", !0)
        ])
      ])
    ], 2));
  }
}), Tn = /* @__PURE__ */ X({
  __name: "SettingsApp",
  setup(a) {
    const $ = rl(), s = cl(), m = L(""), d = H(() => $.value.catalogId ?? ""), h = ze();
    async function r() {
      const g = h.begin(), v = d.value;
      try {
        const A = await ne.catalogSummary(v);
        h.current(g) && (m.value = A?.title || "Untitled catalog");
      } catch {
        h.current(g) && (m.value = "");
      }
    }
    return ue(d, () => {
      m.value = "", r();
    }), Be(r), Ae(() => {
      h.begin();
    }), (g, v) => d.value ? (l(), I(jn, {
      key: d.value,
      "catalog-id": d.value,
      title: m.value || "Catalog",
      embedded: t($).embedded,
      "back-label": t($).embedded ? void 0 : "Back to catalog settings",
      onBack: v[0] || (v[0] = (A) => t(s)("navigate", { route: "" })),
      onDirtyChanged: v[1] || (v[1] = (A) => t(s)("dirty-changed", { dirty: A }))
    }, {
      actions: b(({ access: A }) => [
        A?.admin ? (l(), I(Al, {
          key: 0,
          "catalog-id": d.value,
          title: m.value || "Catalog"
        }, null, 8, ["catalog-id", "title"])) : U("", !0)
      ]),
      _: 1
    }, 8, ["catalog-id", "title", "embedded", "back-label"])) : U("", !0);
  }
});
class zn extends ml {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "catalog-id": { type: "string", default: "" }, embedded: { type: "boolean", default: !1 } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: pl
    };
  }
  static get vueConfig() {
    return { rootComponent: Tn, plugins: [vl] };
  }
}
Cl(import.meta.url, zn);
