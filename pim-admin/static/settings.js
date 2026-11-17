import { e as He, a as Ze, u as ze, r as Ae, p as te, _ as Qe, g as Xe, b as el, c as ll, W as tl, s as al, P as sl } from "./styles-DWu62G4l.js";
import { defineComponent as Z, ref as L, openBlock as s, createElementBlock as v, Fragment as K, createVNode as d, unref as l, withCtx as g, createTextVNode as R, createCommentVNode as I, createBlock as T, toDisplayString as x, computed as F, createElementVNode as e, renderList as J, withModifiers as Q, normalizeStyle as je, normalizeClass as ve, useId as nl, watch as oe, onUnmounted as Ve, resolveDynamicComponent as ol, renderSlot as ne, provide as il, inject as dl, useModel as ul, mergeModels as Pe, withKeys as ce, onMounted as De } from "vue";
import E from "primevue/button";
import ue from "primevue/message";
import { Icon as M } from "@iconify/vue";
import ae from "primevue/tag";
import rl from "primevue/tabs";
import cl from "primevue/tablist";
import ml from "primevue/tab";
import Ne from "primevue/selectbutton";
import { on as Fe, host as pl, loadByTagName as fl, define as vl } from "@wippy-fe/proxy";
import yl from "primevue/multiselect";
import Ce from "primevue/toggleswitch";
import ie from "primevue/select";
import se from "primevue/inputtext";
import bl from "primevue/inputnumber";
import gl from "primevue/textarea";
const hl = ["config"], kl = /* @__PURE__ */ Z({
  __name: "CatalogShare",
  props: {
    catalogId: {},
    title: {}
  },
  setup(t) {
    const k = t, n = L(!1), c = L(!1), u = L("");
    async function y() {
      c.value = !0, u.value = "", await He("kickside-share") ? n.value = !0 : u.value = "Could not open sharing. Try Share again.", c.value = !1;
    }
    return (h, w) => (s(), v(K, null, [
      d(l(E), {
        type: "button",
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: c.value,
        onClick: y
      }, {
        default: g(() => [...w[1] || (w[1] = [
          R("Share", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      n.value ? (s(), v("kickside-share", {
        key: 0,
        config: JSON.stringify({ resource_id: k.catalogId, title: k.title, access_url: `/api/v1/component-access/grants/${encodeURIComponent(k.catalogId)}`, share_url: `/api/v1/component-access/share/${encodeURIComponent(k.catalogId)}` }),
        onClose: w[0] || (w[0] = (p) => n.value = !1)
      }, null, 40, hl)) : I("", !0),
      u.value ? (s(), T(l(ue), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: g(() => [
          R(x(u.value), 1)
        ]),
        _: 1
      })) : I("", !0)
    ], 64));
  }
});
function wl(t, k, n = {}) {
  const c = JSON.stringify(t), u = JSON.stringify(n);
  return {
    declaration: JSON.parse(c),
    generation: k,
    pluginConfigs: JSON.parse(u),
    matches: (y, h, w = {}) => k === h && c === JSON.stringify(y) && u === JSON.stringify(w)
  };
}
function Ee(t, k) {
  const n = {};
  for (const [c, u] of Object.entries(k)) {
    const y = u.filter((h) => c === "plugins" ? !t.plugins?.some((w) => w.use === h) : c === "scopes" ? !t.scopes?.includes(h) : c === "attributes" ? !t.aspects?.some((w) => w.attributes?.some((p) => w.namespace + "." + p.code === h)) : c === "aspects" ? !t.aspects?.some((w) => w.namespace === h) : c === "dimensions" ? !t.dimensions?.some((w) => w.name === h) : c === "vocabularies" || c === "families" ? !t[c]?.some((w) => w.code === h) : !t[c]?.some((w) => w.id === h));
    y.length && (n[c] = y);
  }
  return n;
}
const Be = (t) => !!t && typeof t == "object" && !Array.isArray(t), Y = ["string"], Je = { "*": "string" }, $l = { id: "number", code: "string!", type: "string!", scope: Y, cardinality: "string", index: "string", index_contexts: [Je], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, _l = {
  dimensions: [{ name: "string!", members: Y, fallback: { "*": Y } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: Y }, attributes: [$l] }],
  families: [{ code: "string!", aspects: Y, variation: [{ axes: Y, own: Y }], requirements: [{ id: "string!", context: Je, require: Y, authored: Y }], checks: [{ check: "string!", reads: Y, cost: "string", config: "object", enforce: "string" }] }],
  sources: [{ id: "string!", ordering: "string", writes: Y, principals: Y, audit: "boolean" }],
  channels: [{ id: "string!", requirements: Y, families: Y }],
  plugins: [{ use: "string!", schema: "json" }],
  scopes: Y,
  policy: { "*": "policy" },
  remove: { dimensions: Y, vocabularies: Y, aspects: Y, families: Y, sources: Y, channels: Y, attributes: Y, scopes: Y, plugins: Y }
};
function Re(t, k, n) {
  if (typeof k == "string") {
    const c = k.replace("!", "");
    if (!(c === "json" || (c === "object" ? Be(t) : c === "policy" ? t === !1 || typeof t == "string" || typeof t == "number" : typeof t === c)) || k.endsWith("!") && (typeof t != "string" || !t.trim())) throw new Error(`${n} has an invalid ${c} value.`);
  } else if (Array.isArray(k)) {
    if (!Array.isArray(t)) throw new Error(`${n} must be an array.`);
    t.forEach((c, u) => Re(c, k[0], `${n}[${u}]`));
  } else {
    if (!Be(t)) throw new Error(`${n} must be an object.`);
    for (const [c, u] of Object.entries(k)) if (typeof u == "string" && u.endsWith("!") && t[c] === void 0) throw new Error(`${n}.${c} is required.`);
    for (const [c, u] of Object.entries(t)) {
      const y = k[c] ?? k["*"];
      if (!y) throw new Error(`${n}.${c} is not an editor field.`);
      Re(u, y, `${n}.${c}`);
    }
  }
}
function xl(t) {
  const k = JSON.parse(t);
  Re(k, _l, "Declaration");
  const n = k;
  for (const c of n.dimensions ?? []) c.members ??= [];
  return n;
}
function Se(t) {
  return JSON.parse(JSON.stringify(t));
}
const le = /^[a-z][a-z0-9_]*$/;
function $e(t, k, n) {
  n.length ? t[k] = n : delete t[k];
}
function ge(t, k, n) {
  if (n < 0 || n >= t.length || k === n) return;
  const [c] = t.splice(k, 1);
  t.splice(n, 0, c);
}
function re(t, k) {
  return !t || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(t) ? k : t;
}
async function We(t, k) {
  const n = [...new Set(k)].map((u) => ({ type: "user", id: u }));
  if (!n.length) return {};
  const c = await Ze(`/api/v1/pim-admin/catalogs/${encodeURIComponent(t)}/principal_labels`, { refs: n }, "People");
  return Object.fromEntries((c.principals ?? []).map((u) => [u.id, re(u.label, "Person")]));
}
const Oe = [
  { value: "quarter", label: "¼", span: 3 },
  { value: "third", label: "⅓", span: 4 },
  { value: "half", label: "½", span: 6 },
  { value: "full", label: "1", span: 12 }
];
function Te(t, k, n) {
  return n.width ?? t.attributes[k + "." + n.code]?.width ?? "half";
}
const Cl = (t) => new Date(t).toLocaleString();
function qe(t) {
  const k = Math.abs(t.m).toString(), n = t.m < 0 ? "-" : "";
  if (t.e >= 0) return n + k + "0".repeat(t.e);
  const c = -t.e, u = k.padStart(c + 1, "0");
  return n + u.slice(0, u.length - c) + "." + u.slice(u.length - c);
}
function W(t) {
  const n = (t.includes(".") ? t.slice(t.indexOf(".") + 1) : t).replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return n ? n[0].toUpperCase() + n.slice(1) : t;
}
function xe(t) {
  return t.labels.en ?? Object.values(t.labels)[0] ?? t.code;
}
function Me(t, k) {
  if (t == null) return "";
  const n = (c) => {
    if (c == null) return "";
    if (typeof c == "object" && "ref" in c) {
      const u = c;
      if (u.ref[0] === "term") {
        const y = u.ref[1].slice(u.ref[1].indexOf(":") + 1), h = u.ref[1].slice(0, u.ref[1].indexOf(":")), w = k?.[h]?.find((p) => p.code === y);
        return w ? xe(w) : y;
      }
      return "Linked " + W(u.ref[0]).toLocaleLowerCase();
    }
    if (typeof c == "object" && "v" in c) {
      const u = c;
      return qe(u.v) + " " + u.u;
    }
    return typeof c == "object" && "m" in c ? qe(c) : typeof c == "boolean" ? c ? "Yes" : "No" : typeof c == "object" ? JSON.stringify(c) : re(String(c), "Linked record");
  };
  return Array.isArray(t) ? t.map(n).join(", ") : n(t);
}
function Vl(t, k, n) {
  const c = Me(k), u = Me(n);
  return !u && c ? `${t} cleared (was ${c})` : c ? `${t}: ${c} → ${u}` : `${t} set to ${u}`;
}
const Ul = { class: "pim-table form pim-layout" }, Sl = {
  key: 0,
  class: "kx-empty"
}, Ol = { class: "pim-aspect-head" }, Al = ["draggable", "onDragstart", "onDragover", "onDrop"], Il = { class: "pim-lcard-top" }, jl = {
  class: "pim-grip",
  "aria-hidden": "true"
}, Rl = { class: "pim-lcard-name" }, Tl = { class: "pim-lcard-type" }, ql = { class: "pim-lcard-move" }, zl = { class: "pim-aspect-head" }, Dl = { class: "pim-canvas" }, Nl = { class: "pim-lcard-top" }, Ll = { class: "pim-lcard-name" }, Pl = { class: "pim-lcard-type" }, El = /* @__PURE__ */ Z({
  __name: "LayoutEditor",
  props: {
    draft: {},
    schema: {}
  },
  setup(t) {
    const k = t, n = F(() => k.draft?.aspects ?? []), c = F(() => {
      if (!k.schema) return [];
      const b = new Set((k.draft?.aspects ?? []).map((o) => o.namespace)), r = /* @__PURE__ */ new Map();
      for (const [o, a] of Object.entries(k.schema.attributes)) {
        const f = o.split(".")[0];
        b.has(f) || !a.plugin || (r.has(f) || r.set(f, { aspect: f, plugin: a.plugin, codes: [] }), r.get(f).codes.push(o));
      }
      return [...r.values()];
    });
    function u(b, r) {
      return Oe.find((o) => o.value === Te(k.schema, b, r))?.span ?? 6;
    }
    const y = L(null), h = L(null);
    function w(b, r, o) {
      y.value = { ns: b, index: r }, o.dataTransfer?.setData("text/plain", b + ":" + r), o.dataTransfer && (o.dataTransfer.effectAllowed = "move");
    }
    function p(b, r, o) {
      !y.value || y.value.ns !== b || (o.preventDefault(), h.value = { ns: b, index: r });
    }
    function O(b, r) {
      y.value && y.value.ns === b.namespace && ge(b.attributes ?? [], y.value.index, r), y.value = null, h.value = null;
    }
    function z() {
      y.value = null, h.value = null;
    }
    function D(b, r) {
      const a = k.schema?.attributes[b + "." + r.code]?.type ?? r.type;
      return a.includes(":") ? a.slice(a.indexOf(":") + 1).replace(/_/g, " ") : a;
    }
    return (b, r) => (s(), v("div", Ul, [
      r[3] || (r[3] = e("p", { class: "pim-layout-help muted" }, "Arrange fields within each group and choose their widths. Review changes before applying the layout.", -1)),
      n.value.length === 0 ? (s(), v("div", Sl, "This catalog has no field groups yet. Add a field group in Fields.")) : I("", !0),
      (s(!0), v(K, null, J(n.value, (o) => (s(), v("section", {
        key: o.namespace,
        class: "pim-aspect"
      }, [
        e("header", Ol, [
          e("h3", null, x(l(W)(o.namespace)), 1),
          r[1] || (r[1] = e("span", { class: "muted small" }, "drag a field, or use its arrows", -1))
        ]),
        e("div", {
          class: "pim-canvas",
          onDragover: r[0] || (r[0] = Q(() => {
          }, ["prevent"]))
        }, [
          (s(!0), v(K, null, J(o.attributes ?? [], (a, f) => (s(), v("div", {
            key: a.code,
            class: ve(["pim-lcard", { dragging: y.value?.ns === o.namespace && y.value?.index === f, over: h.value?.ns === o.namespace && h.value?.index === f }]),
            style: je({ gridColumn: "span " + u(o.namespace, a) }),
            draggable: t.schema.access.admin,
            onDragstart: (V) => w(o.namespace, f, V),
            onDragover: (V) => p(o.namespace, f, V),
            onDrop: Q((V) => O(o, f), ["prevent"]),
            onDragend: z
          }, [
            e("div", Il, [
              e("span", jl, [
                d(l(M), { icon: "tabler:grip-vertical" })
              ]),
              e("span", Rl, x(l(W)(a.code)), 1),
              e("span", Tl, x(D(o.namespace, a)), 1),
              e("span", ql, [
                d(l(E), {
                  type: "button",
                  disabled: f === 0,
                  "aria-label": "Move " + l(W)(a.code) + " earlier",
                  onClick: (V) => l(ge)(o.attributes ?? [], f, f - 1),
                  class: "arrow",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: g(() => [
                    d(l(M), { icon: "tabler:arrow-left" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                d(l(E), {
                  type: "button",
                  disabled: f === (o.attributes ?? []).length - 1,
                  "aria-label": "Move " + l(W)(a.code) + " later",
                  onClick: (V) => l(ge)(o.attributes ?? [], f, f + 1),
                  class: "arrow",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: g(() => [
                    d(l(M), { icon: "tabler:arrow-right" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ])
            ]),
            d(l(Ne), {
              "model-value": l(Te)(t.schema, o.namespace, a),
              options: l(Oe),
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Width of " + l(W)(a.code),
              "onUpdate:modelValue": (V) => a.width = V
            }, null, 8, ["model-value", "options", "aria-label", "onUpdate:modelValue"])
          ], 46, Al))), 128))
        ], 32)
      ]))), 128)),
      (s(!0), v(K, null, J(c.value, (o) => (s(), v("section", {
        key: o.aspect,
        class: "pim-aspect"
      }, [
        e("header", zl, [
          e("h3", null, x(l(W)(o.aspect)), 1),
          r[2] || (r[2] = e("span", { class: "muted small" }, "Provided by a plugin", -1))
        ]),
        e("div", Dl, [
          (s(!0), v(K, null, J(o.codes, (a) => (s(), v("div", {
            key: a,
            class: "pim-lcard fixed",
            style: je({ gridColumn: "span " + (l(Oe).find((f) => f.value === t.schema.attributes[a].width)?.span ?? 6) })
          }, [
            e("div", Nl, [
              e("span", Ll, x(l(W)(a)), 1),
              e("span", Pl, x(t.schema.attributes[a].type.replace("kickside.pim.types:", "").replace(/_/g, " ")), 1)
            ])
          ], 4))), 128))
        ])
      ]))), 128))
    ]));
  }
}), Bl = {
  class: "pim-history",
  "aria-label": "Catalog history"
}, Ml = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Kl = { class: "pim-table pim-responsive-table" }, Hl = ["id"], Fl = ["aria-labelledby"], Jl = { class: "muted small" }, Wl = ["datetime"], Gl = { class: "small" }, Yl = {
  key: 0,
  class: "muted"
}, Zl = { class: "mono small" }, Ql = {
  key: 0,
  class: "muted"
}, Xl = ["aria-labelledby"], et = { class: "pim-stacked-meta muted small" }, lt = ["datetime"], tt = {
  key: 1,
  class: "kx-empty"
}, at = { class: "pim-table-foot" }, st = /* @__PURE__ */ Z({
  __name: "HistoryPanel",
  props: {
    catalogId: {}
  },
  setup(t) {
    const k = t, n = L([]), c = L({}), u = L(), y = L(!1), h = L(""), w = Ae(), p = nl(), O = F(() => n.value.map((o) => ({
      key: `${o.seq}:${o.n}`,
      at: o.at,
      date: Cl(o.at),
      actor: c.value[o.actor] ?? re(o.actor, "Person"),
      source: o.source,
      product: D(o),
      context: o.ctx,
      change: b(o)
    })));
    async function z(o = !1) {
      const a = w.begin();
      y.value = !0, h.value = "";
      try {
        const f = await te.history(k.catalogId, { limit: 50, before: o ? u.value : void 0 });
        if (!w.current(a)) return;
        n.value = o ? [...n.value, ...f.entries] : f.entries, u.value = f.next;
        try {
          const V = await We(k.catalogId, f.entries.map((_) => _.actor));
          w.current(a) && (c.value = { ...c.value, ...V });
        } catch {
        }
      } catch (f) {
        if (!w.current(a)) return;
        h.value = f instanceof Error ? f.message : "Could not load the history.";
      } finally {
        w.current(a) && (y.value = !1);
      }
    }
    function D(o) {
      return o.sku ? o.sku : o.subject.startsWith("p:") ? "purged product" : o.subject.startsWith("t:") ? o.subject.slice(2) : o.subject.startsWith("r:") ? "Release" : re(o.subject, "Catalog");
    }
    function b(o) {
      if (o.attribute)
        return Vl(W(o.attribute), o.before, o.after);
      switch (o.kind) {
        case "schema":
          return "Schema generation " + String(o.after?.generation ?? "");
        case "term": {
          const a = o.after ?? {}, f = a.labels?.en ?? Object.values(a.labels ?? {})[0];
          return a.retired ? "Term retired" : f ? `Term labelled "${f}"` + (a.parent ? ` under ${a.parent}` : "") : "Term changed";
        }
        case "created": {
          const a = o.after ?? {};
          return `Created as ${W(a.family ?? "product")}` + (a.level ? ` at level ${a.level}` : "");
        }
        case "released": {
          const a = o.after ?? {};
          return `Released v${a.version ?? ""} to ${(a.channels ?? []).join(", ")}`;
        }
        case "withdrawn":
          return `Withdrawn from ${((o.after ?? {}).channels ?? []).join(", ")}`;
        case "status":
          return `Status ${String(o.before ?? "")} → ${String(o.after ?? "")}`;
        case "moved":
          return "Moved under another parent";
        default:
          return W(o.kind);
      }
    }
    let r = () => {
    };
    return oe(() => k.catalogId, () => {
      r(), w.begin(), n.value = [], c.value = {}, u.value = void 0, h.value = "", r = Fe(`component.${k.catalogId}`, () => {
        z();
      });
    }, { immediate: !0 }), oe(() => k.catalogId, () => {
      z();
    }), ze(() => z()), Ve(() => {
      r(), w.begin();
    }), (o, a) => (s(), v("section", Bl, [
      h.value ? (s(), T(l(ue), {
        key: 0,
        severity: "error",
        role: "alert"
      }, {
        default: g(() => [
          R(x(h.value) + " ", 1),
          d(l(E), {
            severity: "secondary",
            outlined: "",
            disabled: y.value,
            onClick: a[0] || (a[0] = (f) => z())
          }, {
            default: g(() => [...a[2] || (a[2] = [
              R("Retry", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ]),
        _: 1
      })) : I("", !0),
      y.value ? (s(), v("div", Ml, "Loading history…")) : I("", !0),
      e("div", Kl, [
        e("p", {
          id: l(p),
          class: "pim-history-caption muted small"
        }, "Catalog changes, newest first", 8, Hl),
        O.value.length ? (s(), v(K, { key: 0 }, [
          e("table", {
            class: "pim-grid",
            "aria-labelledby": l(p)
          }, [
            a[3] || (a[3] = e("thead", null, [
              e("tr", null, [
                e("th", { scope: "col" }, "When"),
                e("th", { scope: "col" }, "Who"),
                e("th", { scope: "col" }, "What"),
                e("th", { scope: "col" }, "Change")
              ])
            ], -1)),
            e("tbody", null, [
              (s(!0), v(K, null, J(O.value, (f) => (s(), v("tr", {
                key: f.key
              }, [
                e("td", Jl, [
                  e("time", {
                    datetime: f.at
                  }, x(f.date), 9, Wl)
                ]),
                e("td", Gl, [
                  R(x(f.actor), 1),
                  f.source ? (s(), v("span", Yl, " via " + x(f.source), 1)) : I("", !0)
                ]),
                e("td", Zl, [
                  R(x(f.product), 1),
                  f.context ? (s(), v("span", Ql, " · " + x(f.context), 1)) : I("", !0)
                ]),
                e("td", null, x(f.change), 1)
              ]))), 128))
            ])
          ], 8, Fl),
          e("ol", {
            role: "list",
            class: "pim-stacked-list",
            "aria-labelledby": l(p)
          }, [
            (s(!0), v(K, null, J(O.value, (f) => (s(), v("li", {
              key: f.key,
              class: "pim-stacked-row"
            }, [
              e("div", null, x(f.change), 1),
              e("div", et, [
                e("span", null, [
                  e("span", null, x(f.actor), 1),
                  f.source ? (s(), v(K, { key: 0 }, [
                    R(" via " + x(f.source), 1)
                  ], 64)) : I("", !0)
                ]),
                e("time", {
                  datetime: f.at
                }, x(f.date), 9, lt),
                e("span", null, [
                  R(x(f.product), 1),
                  f.context ? (s(), v(K, { key: 0 }, [
                    R(" · " + x(f.context), 1)
                  ], 64)) : I("", !0)
                ])
              ])
            ]))), 128))
          ], 8, Xl)
        ], 64)) : !y.value && !h.value ? (s(), v("div", tt, "Nothing recorded yet.")) : I("", !0),
        e("div", at, [
          e("span", null, x(O.value.length) + " change" + x(O.value.length === 1 ? "" : "s") + " shown", 1),
          u.value ? (s(), T(l(E), {
            key: 0,
            type: "button",
            disabled: y.value,
            onClick: a[1] || (a[1] = (f) => z(!0)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: g(() => [
              d(l(M), {
                icon: "tabler:adjustments",
                "aria-hidden": "true"
              }),
              a[4] || (a[4] = R(" Load older", -1))
            ]),
            _: 1
          }, 8, ["disabled"])) : I("", !0)
        ])
      ])
    ]));
  }
}), Ke = /* @__PURE__ */ Z({
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
    const n = k;
    return (c, u) => t.access?.admin ? (s(), v(K, { key: 0 }, [
      t.dirty ? (s(), T(l(ae), {
        key: 0,
        severity: "warn",
        value: "Unsaved changes"
      })) : I("", !0),
      d(l(E), {
        severity: "secondary",
        outlined: "",
        disabled: !t.dirty || t.busy,
        onClick: u[0] || (u[0] = (y) => n("discard"))
      }, {
        default: g(() => [
          d(l(M), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          }),
          u[3] || (u[3] = R(" Discard", -1))
        ]),
        _: 1
      }, 8, ["disabled"]),
      t.reviewed ? (s(), T(l(E), {
        key: 2,
        disabled: !t.dirty || t.busy || !t.canApply,
        loading: t.busy,
        onClick: u[2] || (u[2] = (y) => n("apply"))
      }, {
        default: g(() => [
          R(x(t.applyLabel || "Apply"), 1)
        ]),
        _: 1
      }, 8, ["disabled", "loading"])) : (s(), T(l(E), {
        key: 1,
        disabled: !t.dirty || t.busy || !t.valid,
        loading: t.busy,
        onClick: u[1] || (u[1] = (y) => n("review"))
      }, {
        default: g(() => [...u[4] || (u[4] = [
          R("Review changes", -1)
        ])]),
        _: 1
      }, 8, ["disabled", "loading"]))
    ], 64)) : I("", !0);
  }
}), nt = { class: "kx-head-icon" }, ot = { class: "kx-head-text" }, it = { class: "pim-title-line" }, dt = ["title"], ut = { class: "kx-head-actions" }, rt = /* @__PURE__ */ Z({
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
    const n = k;
    return (c, u) => (s(), v("header", {
      class: ve(["kx-head", { "pim-panel-head": t.pane }])
    }, [
      t.backLabel ? (s(), T(l(E), {
        key: 0,
        type: "button",
        "aria-label": t.backLabel,
        onClick: u[0] || (u[0] = (y) => n("back")),
        text: "",
        severity: "secondary",
        size: "small"
      }, {
        default: g(() => [
          d(l(M), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label"])) : I("", !0),
      e("div", nt, [
        d(l(M), {
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      e("div", ot, [
        e("div", it, [
          (s(), T(ol(t.pane ? "h2" : "h1"), { class: "kx-title" }, {
            default: g(() => [
              R(x(t.title), 1)
            ]),
            _: 1
          })),
          ne(c.$slots, "meta")
        ]),
        e("p", {
          class: "kx-head-sub",
          title: t.subtitle
        }, x(t.subtitle), 9, dt)
      ]),
      e("div", ut, [
        ne(c.$slots, "default")
      ])
    ], 2));
  }
}), Ge = Symbol("definitionColumns"), ct = { code: "Code", kind: "Kind", details: "Details", usage: "Used by" }, mt = {
  code: "minmax(120px, 1fr)",
  kind: "140px",
  details: "minmax(120px, 1.2fr)",
  usage: "120px"
}, pt = {
  class: "pim-definition-scroll",
  tabindex: "0",
  "aria-label": "Definitions"
}, ft = { class: "pim-definition-grid" }, vt = {
  key: 0,
  class: "pim-definition-columns",
  "aria-hidden": "true"
}, he = /* @__PURE__ */ Z({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: { default: () => ["code"] }
  },
  setup(t) {
    const k = t;
    il(Ge, F(() => k.columns));
    const n = F(() => ["48px", "minmax(160px, 1.4fr)", ...k.columns.map((c) => mt[c]), "80px"].join(" "));
    return (c, u) => (s(), v("section", {
      class: "form pim-definition-list",
      style: je({ "--pim-definition-columns": n.value })
    }, [
      ne(c.$slots, "head"),
      e("div", pt, [
        e("div", ft, [
          t.count > 3 ? (s(), v("div", vt, [
            u[0] || (u[0] = e("span", null, null, -1)),
            u[1] || (u[1] = e("span", null, "Name", -1)),
            (s(!0), v(K, null, J(t.columns, (y) => (s(), v("span", {
              key: y,
              class: ve("pim-definition-" + y)
            }, x(l(ct)[y]), 3))), 128)),
            u[2] || (u[2] = e("span", null, null, -1))
          ])) : I("", !0),
          ne(c.$slots, "default")
        ])
      ]),
      ne(c.$slots, "add")
    ], 4));
  }
}), yt = { class: "pim-definition" }, bt = {
  class: "pim-definition-lead",
  "data-column": "lead"
}, gt = {
  class: "pim-row-title",
  "data-column": "name"
}, ht = { class: "pim-definition-meta" }, kt = ["data-column"], wt = {
  key: 0,
  class: "mono"
}, $t = {
  class: "pim-definition-actions",
  "data-column": "actions"
}, _t = {
  key: 0,
  class: "pim-definition-body"
}, ke = /* @__PURE__ */ Z({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ Pe({
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
  emits: /* @__PURE__ */ Pe(["head-keydown", "head-drop", "head-dragover"], ["update:open"]),
  setup(t, { emit: k }) {
    const n = t, c = dl(Ge, F(() => [
      ...n.code ? ["code"] : [],
      ...n.kind ? ["kind"] : []
    ])), u = ul(t, "open"), y = k;
    return (h, w) => (s(), v("section", yt, [
      e("header", {
        class: ve(["pim-definition-head", t.headClass]),
        onKeydown: w[1] || (w[1] = (p) => y("head-keydown", p)),
        onDrop: w[2] || (w[2] = (p) => y("head-drop", p)),
        onDragover: w[3] || (w[3] = (p) => y("head-dragover", p))
      }, [
        d(Qe, {
          class: ve(["pim-definition-toggle", t.toggleClass]),
          "aria-expanded": u.value,
          onClick: w[0] || (w[0] = (p) => u.value = !u.value)
        }, {
          default: g(() => [
            e("span", bt, [
              ne(h.$slots, "handle"),
              d(l(M), {
                icon: u.value ? "tabler:chevron-down" : "tabler:chevron-right",
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ]),
            e("span", gt, x(t.title), 1),
            e("span", ht, [
              (s(!0), v(K, null, J(l(c), (p) => (s(), v("span", {
                key: p,
                class: ve("pim-definition-" + p),
                "data-column": p
              }, [
                p === "code" && t.code ? (s(), v("code", wt, x(t.code), 1)) : p === "kind" && t.kind ? (s(), T(l(ae), {
                  key: 1,
                  severity: "secondary",
                  value: t.kind
                }, null, 8, ["value"])) : p === "details" ? ne(h.$slots, "details", {}, void 0, void 0, 2) : p === "usage" ? ne(h.$slots, "usage", {}, () => [
                  R(x(t.usage), 1)
                ], void 0, 3) : I("", !0)
              ], 10, kt))), 128))
            ])
          ]),
          _: 3
        }, 8, ["class", "aria-expanded"]),
        e("div", $t, [
          ne(h.$slots, "actions")
        ])
      ], 34),
      u.value ? (s(), v("div", _t, [
        ne(h.$slots, "default")
      ])) : I("", !0)
    ]));
  }
}), xt = { class: "pim-chips pim-picker-chips" }, de = /* @__PURE__ */ Z({
  __name: "ChipPicker",
  props: {
    modelValue: {},
    options: {},
    free: { type: Boolean },
    placeholder: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: k }) {
    const n = t, c = k, u = L("");
    function y(z) {
      return n.modelValue.includes(z);
    }
    function h(z) {
      n.disabled || !z || c("update:modelValue", y(z) ? n.modelValue.filter((D) => D !== z) : [...n.modelValue, z]);
    }
    function w() {
      const z = u.value.trim();
      if (!z || y(z)) {
        u.value = "";
        return;
      }
      c("update:modelValue", [...n.modelValue, z]), u.value = "";
    }
    function p(z) {
      c("update:modelValue", n.modelValue.filter((D) => D !== z));
    }
    function O(z) {
      return n.options?.find((D) => D.value === z)?.label ?? z;
    }
    return (z, D) => (s(), v("div", xt, [
      t.options && t.options.length > 10 ? (s(), v(K, { key: 0 }, [
        (s(!0), v(K, null, J(t.modelValue, (b) => (s(), v("span", {
          key: b,
          class: "row"
        }, [
          R(x(O(b)), 1),
          t.disabled ? I("", !0) : (s(), T(l(E), {
            key: 0,
            type: "button",
            "aria-label": "Remove " + b,
            onClick: (r) => p(b),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: g(() => [
              d(l(M), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"]))
        ]))), 128)),
        t.disabled ? I("", !0) : (s(), T(l(ie), {
          key: 0,
          "model-value": "",
          "aria-label": t.placeholder ?? "Add",
          "onUpdate:modelValue": D[0] || (D[0] = (b) => h(b)),
          class: "pim-chip-entry",
          options: [{ value: "", label: String(t.placeholder ?? "Add…") }, ...t.options.filter((b) => !y(b.value)).map((b) => ({ value: b.value, label: String(b.label ?? b.value) }))],
          "option-label": "label",
          "option-value": "value",
          appendTo: "self"
        }, null, 8, ["aria-label", "options"]))
      ], 64)) : t.options ? (s(), v(K, { key: 1 }, [
        d(l(Ne), {
          "model-value": t.modelValue.filter((b) => t.options.some((r) => r.value === b)),
          options: t.options.map((b) => ({ value: b.value, label: b.label ?? b.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          disabled: t.disabled,
          "aria-label": t.placeholder ?? "Selected values",
          "onUpdate:modelValue": D[1] || (D[1] = (b) => c("update:modelValue", [...b, ...t.modelValue.filter((r) => !t.options.some((o) => o.value === r))]))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (s(!0), v(K, null, J(t.modelValue.filter((b) => !t.options.some((r) => r.value === b)), (b) => (s(), v("span", {
          key: b,
          class: "row"
        }, [
          R(x(O(b)), 1),
          t.disabled ? I("", !0) : (s(), T(l(E), {
            key: 0,
            type: "button",
            "aria-label": "Remove " + b,
            onClick: (r) => p(b),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: g(() => [
              d(l(M), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"]))
        ]))), 128))
      ], 64)) : (s(!0), v(K, { key: 2 }, J(t.modelValue, (b) => (s(), v("span", {
        key: b,
        class: "row"
      }, [
        R(x(b), 1),
        t.disabled ? I("", !0) : (s(), T(l(E), {
          key: 0,
          type: "button",
          "aria-label": "Remove " + b,
          onClick: (r) => p(b),
          size: "small",
          text: "",
          severity: "secondary"
        }, {
          default: g(() => [
            d(l(M), { icon: "tabler:x" })
          ]),
          _: 1
        }, 8, ["aria-label", "onClick"]))
      ]))), 128)),
      t.free && !t.disabled ? (s(), T(l(se), {
        key: 3,
        modelValue: u.value,
        "onUpdate:modelValue": D[2] || (D[2] = (b) => u.value = b),
        type: "text",
        placeholder: t.placeholder ?? "Add…",
        onKeydown: ce(Q(w, ["prevent"]), ["enter"]),
        onBlur: w,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "placeholder", "onKeydown"])) : I("", !0)
    ]));
  }
}), Ct = ["inert"], Vt = ["schema", "config"], Ut = {
  key: 1,
  class: "muted small",
  role: "status"
}, Le = /* @__PURE__ */ Z({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: k }) {
    const n = t, c = k, u = L("pending");
    async function y() {
      u.value = "pending", u.value = await He("wc-schema-form") ? "ready" : "failed";
    }
    De(y);
    function h(w) {
      const p = w.detail;
      p && typeof p == "object" && !Array.isArray(p) && c("update:modelValue", p);
    }
    return (w, p) => (s(), v("div", {
      inert: t.disabled || void 0
    }, [
      u.value === "ready" ? (s(), v("wc-schema-form", {
        key: 0,
        schema: JSON.stringify(n.schema),
        config: JSON.stringify(t.modelValue),
        onConfigChanged: h
      }, null, 40, Vt)) : u.value === "pending" ? (s(), v("span", Ut, "Configuration form is loading.")) : (s(), T(l(ue), {
        key: 2,
        role: "alert",
        severity: "error"
      }, {
        default: g(() => [
          p[2] || (p[2] = R("Configuration form could not be loaded. ", -1)),
          d(l(E), {
            type: "button",
            disabled: t.disabled,
            onClick: y,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: g(() => [...p[1] || (p[1] = [
              R("Retry", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ]),
        _: 1
      })),
      d(l(E), {
        type: "button",
        disabled: t.disabled,
        onClick: p[0] || (p[0] = (O) => c("update:modelValue", {})),
        severity: "secondary",
        outlined: "",
        size: "small"
      }, {
        default: g(() => [
          d(l(M), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          }),
          p[3] || (p[3] = R(" Reset overrides", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, Ct));
  }
}), St = /* @__PURE__ */ Z({
  __name: "DefaultValue",
  props: {
    attribute: {},
    type: {}
  },
  emits: ["change"],
  setup(t, { emit: k }) {
    const n = t, c = k, u = F(() => {
      const p = n.type?.form;
      let O = { type: "string" };
      return p === "bool" ? O = { type: "boolean" } : p === "int" ? O = { type: "integer" } : p === "dec" ? O = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : p === "quantity" ? O = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(n.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : p === "record" ? O = { type: "object", additionalProperties: !0 } : p === "ref" && (O = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${n.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (n.attribute.cardinality ?? "one") !== "one" && (O = { type: "array", items: O, uniqueItems: n.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...O, title: "Default value" } } };
    });
    function y(p) {
      return p && typeof p == "object" && "m" in p && "e" in p ? qe(p) : p;
    }
    function h(p) {
      return n.type?.form === "dec" ? y(p) : n.type?.form === "quantity" && p && typeof p == "object" && "v" in p && "u" in p ? { value: y(p.v), unit: p.u } : p;
    }
    const w = F(() => n.attribute.default === void 0 ? {} : { value: Array.isArray(n.attribute.default) ? n.attribute.default.map(h) : h(n.attribute.default) });
    return (p, O) => (s(), T(Le, {
      schema: u.value,
      "model-value": w.value,
      "onUpdate:modelValue": O[0] || (O[0] = (z) => c("change", z.value))
    }, null, 8, ["schema", "model-value"]));
  }
}), Ot = { class: "pim-stack" }, At = { class: "pim-bsection-head" }, It = {
  key: 0,
  class: "mono muted small"
}, jt = { class: "pim-source-permissions" }, Rt = ["for"], Tt = ["onDragstart"], qt = { class: "pim-fields" }, zt = { class: "pim-f pim-w-third" }, Dt = { class: "pim-f-label" }, Nt = {
  key: 0,
  class: "pim-f-note"
}, Lt = { class: "pim-f pim-w-third" }, Pt = { class: "pim-f pim-w-third" }, Et = {
  key: 0,
  class: "pim-f pim-w-third"
}, Bt = {
  key: 1,
  class: "pim-f pim-w-third"
}, Mt = { class: "pim-f pim-w-third" }, Kt = { class: "pim-f pim-w-third" }, Ht = { class: "pim-f pim-w-half" }, Ft = { class: "pim-f pim-w-half" }, Jt = { class: "row" }, Wt = {
  key: 2,
  class: "pim-f pim-w-full"
}, Gt = { class: "pim-contexts" }, Yt = { class: "small muted" }, Zt = { class: "pim-f pim-w-half" }, Qt = {
  key: 3,
  class: "pim-f pim-w-full"
}, Xt = { class: "row end" }, ea = { class: "row pim-add-row" }, la = { class: "form" }, ta = { class: "pim-aspect row pim-add-row" }, aa = /* @__PURE__ */ Z({
  __name: "BuilderFields",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove"],
  setup(t, { emit: k }) {
    const n = t, c = k, u = Oe.map((m) => m.value), y = [{ value: "one", label: "Single value" }, { value: "list", label: "Ordered list" }, { value: "set", label: "Unique set" }], h = F(() => n.draft.aspects ?? []), w = F(() => (n.draft.dimensions ?? []).map((m) => ({ value: m.name, label: W(m.name) }))), p = F(() => (n.draft.vocabularies ?? []).map((m) => m.code)), O = F(() => (n.draft.sources ?? []).map((m) => ({ value: m.id, label: W(m.id) }))), z = F(() => [...n.options.types].sort((m, i) => m.form.localeCompare(i.form)).map((m) => ({ value: m.id, label: b(m) })));
    function D(m) {
      return n.options.types.find((i) => i.id === m.type);
    }
    function b(m) {
      return re(m.title, "Field type");
    }
    function r(m) {
      return D(m)?.target === "term";
    }
    function o(m) {
      const i = D(m);
      return !!i && i.form === "ref" && !i.target;
    }
    function a(m, i) {
      return i.id !== void 0 && n.schema.attributes[m + "." + i.code] !== void 0;
    }
    function f(m) {
      const i = (n.draft.families ?? []).filter((j) => j.aspects?.includes(m)).length;
      return i + (i === 1 ? " family" : " families");
    }
    const V = L({});
    function _(m, i) {
      return m + "." + (i.id ?? i.code);
    }
    function A(m, i) {
      m.type = i;
      const j = D(m);
      if (j && m.index && !j.indexes.includes(m.index) && delete m.index, r(m) || delete m.vocabulary, !o(m) && m.config && "target" in m.config) {
        const { target: C, ...G } = m.config;
        m.config = Object.keys(G).length ? G : void 0, m.config || delete m.config;
      }
    }
    function $(m, i) {
      Object.keys(i).length ? m.config = i : delete m.config;
    }
    function B(m, i) {
      const j = { ...m.config ?? {} };
      i ? j.target = i : delete j.target, $(m, j);
    }
    function ee(m, i) {
      i.length ? m.scope = i : delete m.scope, i.length || delete m.index_contexts;
    }
    function U(m, i, j) {
      j === void 0 || j === "" || j === !1 && i !== "default" ? delete m[i] : m[i] = j;
    }
    function N(m) {
      return m.index_contexts ?? [];
    }
    function S(m) {
      return (n.draft.dimensions ?? []).find((i) => i.name === m)?.members ?? [];
    }
    function P(m) {
      const i = {};
      for (const C of m.scope ?? []) i[C] = S(C)[0] ?? "";
      (m.index_contexts ?? (m.index_contexts = [])).push(i);
    }
    const X = L(null);
    function me(m, i) {
      X.value?.namespace === m.namespace && ge(m.attributes ?? [], X.value.index, i), X.value = null;
    }
    const ye = L("");
    function _e() {
      const m = ye.value.trim();
      !le.test(m) || h.value.some((i) => i.namespace === m) || ((n.draft.aspects ??= []).push({ namespace: m, attributes: [] }), ye.value = "");
    }
    function Ie(m) {
      const i = h.value.indexOf(m);
      i >= 0 && h.value.splice(i, 1), n.schema.declaration.aspects?.some((j) => j.namespace === m.namespace) && c("remove", "aspects", m.namespace);
    }
    const pe = L({});
    function fe(m) {
      const i = (pe.value[m.namespace] ?? "").trim(), j = m.attributes ?? (m.attributes = []);
      if (!le.test(i) || j.some((q) => q.code === i)) return;
      const C = n.options.types.find((q) => q.id === "kickside.pim.types:text") ?? n.options.types[0], G = { code: i, type: C?.id ?? "" };
      j.push(G), pe.value[m.namespace] = "", V.value[_(m.namespace, G)] = !0;
    }
    function H(m, i) {
      const j = m.attributes ?? [], C = j.indexOf(i);
      C >= 0 && j.splice(C, 1), a(m.namespace, i) && c("remove", "attributes", m.namespace + "." + i.code);
    }
    return (m, i) => (s(), v("div", Ot, [
      (s(!0), v(K, null, J(h.value, (j) => (s(), T(he, {
        key: j.namespace,
        count: j.attributes?.length ?? 0,
        columns: ["code", "kind", "details", "usage"]
      }, {
        head: g(() => [
          e("header", At, [
            e("div", null, [
              e("h3", null, [
                R(x(l(W)(j.namespace)), 1),
                l(W)(j.namespace).toLocaleLowerCase() !== j.namespace.toLocaleLowerCase() ? (s(), v("span", It, x(j.namespace), 1)) : I("", !0)
              ]),
              e("div", jt, [
                e("label", {
                  for: "writers-" + j.namespace
                }, "Sources allowed to write", 8, Rt),
                d(l(yl), {
                  "input-id": "writers-" + j.namespace,
                  "aria-label": "Sources allowed to write",
                  "model-value": j.write?.sources ?? [],
                  options: O.value,
                  "option-label": "label",
                  "option-value": "value",
                  placeholder: "Any source",
                  appendTo: "self",
                  "onUpdate:modelValue": (C) => j.write = { sources: C }
                }, null, 8, ["input-id", "model-value", "options", "onUpdate:modelValue"]),
                i[4] || (i[4] = e("span", { class: "small muted" }, "Leave empty to allow any source to write this field group.", -1))
              ])
            ]),
            d(l(E), {
              type: "button",
              onClick: (C) => Ie(j),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: g(() => [
                d(l(M), { icon: "tabler:trash" }),
                i[5] || (i[5] = R(" Remove field group", -1))
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]),
        add: g(() => [
          e("div", ea, [
            d(l(se), {
              modelValue: pe.value[j.namespace],
              "onUpdate:modelValue": (C) => pe.value[j.namespace] = C,
              type: "text",
              placeholder: "new_field",
              onKeydown: ce(Q((C) => fe(j), ["prevent"]), ["enter"]),
              class: "mono"
            }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
            d(l(E), {
              type: "button",
              disabled: !l(le).test(pe.value[j.namespace] ?? ""),
              onClick: (C) => fe(j),
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: g(() => [
                d(l(M), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                }),
                i[21] || (i[21] = R(" Add field", -1))
              ]),
              _: 1
            }, 8, ["disabled", "onClick"])
          ])
        ]),
        default: g(() => [
          (s(!0), v(K, null, J(j.attributes ?? [], (C, G) => (s(), T(ke, {
            key: _(j.namespace, C),
            open: V.value[_(j.namespace, C)],
            "onUpdate:open": (q) => V.value[_(j.namespace, C)] = q,
            title: l(W)(C.code),
            code: j.namespace + "." + C.code,
            kind: D(C) ? b(D(C)) : "Unknown type",
            usage: f(j.namespace),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle",
            onHeadDragover: i[2] || (i[2] = Q(() => {
            }, ["prevent"])),
            onHeadDrop: Q((q) => me(j, G), ["prevent"]),
            onHeadKeydown: [
              Q((q) => l(ge)(j.attributes ?? [], G, G - 1), ["alt", "prevent"]),
              Q((q) => l(ge)(j.attributes ?? [], G, G + 1), ["alt", "prevent"])
            ]
          }, {
            handle: g(() => [
              e("span", {
                class: "pim-grip",
                draggable: "true",
                "aria-hidden": "true",
                onClick: i[0] || (i[0] = Q(() => {
                }, ["stop"])),
                onDragstart: Q((q) => X.value = { namespace: j.namespace, index: G }, ["stop"]),
                onDragend: i[1] || (i[1] = (q) => X.value = null)
              }, [
                d(l(M), { icon: "tabler:grip-vertical" })
              ], 40, Tt)
            ]),
            details: g(() => [
              C.cardinality && C.cardinality !== "one" ? (s(), T(l(ae), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: g(() => [
                  R(x(y.find((q) => q.value === C.cardinality)?.label), 1)
                ]),
                _: 2
              }, 1024)) : I("", !0),
              C.scope?.length ? (s(), T(l(ae), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: g(() => [
                  R("per " + x(C.scope.join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : I("", !0),
              C.index && C.index !== "none" ? (s(), T(l(ae), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: g(() => [
                  R(x(C.index) + " index", 1)
                ]),
                _: 2
              }, 1024)) : I("", !0),
              C.unique ? (s(), T(l(ae), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: g(() => [...i[6] || (i[6] = [
                  R("unique", -1)
                ])]),
                _: 1
              })) : I("", !0)
            ]),
            actions: g(() => [
              d(l(E), {
                type: "button",
                disabled: G === 0,
                "aria-label": "Move " + C.code + " earlier",
                onClick: (q) => l(ge)(j.attributes, G, G - 1),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: g(() => [
                  d(l(M), { icon: "tabler:arrow-up" })
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "onClick"]),
              d(l(E), {
                type: "button",
                disabled: G === (j.attributes?.length ?? 0) - 1,
                "aria-label": "Move " + C.code + " later",
                onClick: (q) => l(ge)(j.attributes, G, G + 1),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: g(() => [
                  d(l(M), { icon: "tabler:arrow-down" })
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "onClick"])
            ]),
            default: g(() => [
              e("div", qt, [
                e("div", zt, [
                  e("div", Dt, [
                    i[7] || (i[7] = e("label", null, "Code", -1)),
                    a(j.namespace, C) ? (s(), v("span", Nt, "renames keep values")) : I("", !0)
                  ]),
                  d(l(se), {
                    type: "text",
                    value: C.code,
                    onInput: (q) => C.code = q.target.value,
                    class: "mono"
                  }, null, 8, ["value", "onInput"])
                ]),
                e("div", Lt, [
                  i[8] || (i[8] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Type")
                  ], -1)),
                  d(l(ie), {
                    "model-value": C.type,
                    options: z.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (q) => A(C, q)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", Pt, [
                  i[9] || (i[9] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Values")
                  ], -1)),
                  d(l(ie), {
                    "model-value": C.cardinality ?? "one",
                    options: y,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (q) => U(C, "cardinality", q === "one" ? void 0 : q)
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                r(C) ? (s(), v("div", Et, [
                  i[10] || (i[10] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Vocabulary")
                  ], -1)),
                  d(l(ie), {
                    "model-value": C.vocabulary ?? "",
                    "onUpdate:modelValue": (q) => U(C, "vocabulary", q),
                    options: [{ value: "", label: "Choose…" }, ...p.value.map((q) => ({ value: q, label: String(q) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ])) : I("", !0),
                o(C) ? (s(), v("div", Bt, [
                  i[11] || (i[11] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Link kind"),
                    e("span", { class: "pim-f-note" }, "owned by a plugin")
                  ], -1)),
                  d(l(ie), {
                    "model-value": C.config?.target ?? "",
                    "onUpdate:modelValue": (q) => B(C, q),
                    options: [{ value: "", label: "Choose…" }, ...t.options.link_kinds.map((q) => ({ value: q.kind, label: l(re)(q.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ])) : I("", !0),
                e("div", Mt, [
                  i[12] || (i[12] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Index"),
                    e("span", { class: "pim-f-note" }, "for filters and keys")
                  ], -1)),
                  d(l(ie), {
                    "model-value": C.index ?? "none",
                    options: D(C)?.indexes ?? ["none"],
                    appendTo: "self",
                    "onUpdate:modelValue": (q) => U(C, "index", q === "none" ? void 0 : q)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", Kt, [
                  i[13] || (i[13] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Width"),
                    e("span", { class: "pim-f-note" }, "of a form row")
                  ], -1)),
                  d(l(Ne), {
                    "model-value": l(Te)(t.schema, j.namespace, C),
                    options: l(u),
                    "allow-empty": !1,
                    "onUpdate:modelValue": (q) => C.width = q
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", Ht, [
                  i[14] || (i[14] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Varies per"),
                    e("span", { class: "pim-f-note" }, "dimensions the value depends on")
                  ], -1)),
                  d(de, {
                    "model-value": C.scope ?? [],
                    options: w.value,
                    "onUpdate:modelValue": (q) => ee(C, q)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", Ft, [
                  i[15] || (i[15] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Unique"),
                    e("span", { class: "pim-f-note" }, "one holder per value, catalog wide")
                  ], -1)),
                  e("label", Jt, [
                    d(l(Ce), {
                      "aria-label": "Unique " + C.code,
                      "model-value": C.unique === !0,
                      disabled: !!C.scope?.length || (C.cardinality ?? "one") !== "one",
                      "onUpdate:modelValue": (q) => U(C, "unique", q)
                    }, null, 8, ["aria-label", "model-value", "disabled", "onUpdate:modelValue"]),
                    e("span", null, x(C.unique ? "Yes" : "No"), 1)
                  ])
                ]),
                (C.scope?.length ?? 0) > 0 && C.index && C.index !== "none" ? (s(), v("div", Wt, [
                  i[17] || (i[17] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Indexed contexts"),
                    e("span", { class: "pim-f-note" }, "which combinations get an index")
                  ], -1)),
                  e("div", Gt, [
                    (s(!0), v(K, null, J(N(C), (q, we) => (s(), v("div", {
                      key: we,
                      class: "pim-context-row"
                    }, [
                      (s(!0), v(K, null, J(C.scope, (be) => (s(), v("label", {
                        key: be,
                        class: "pim-context-field"
                      }, [
                        e("span", Yt, x(l(W)(be)), 1),
                        d(l(ie), {
                          "model-value": q[be] ?? "",
                          options: S(be),
                          class: "narrow",
                          appendTo: "self",
                          "onUpdate:modelValue": (Ue) => q[be] = Ue
                        }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                      ]))), 128)),
                      d(l(E), {
                        type: "button",
                        "aria-label": "Remove context",
                        onClick: (be) => N(C).splice(we, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: g(() => [
                          d(l(M), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ]))), 128)),
                    d(l(E), {
                      type: "button",
                      onClick: (q) => P(C),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: g(() => [
                        d(l(M), {
                          icon: "tabler:plus",
                          "aria-hidden": "true"
                        }),
                        i[16] || (i[16] = R(" Add context", -1))
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ])
                ])) : I("", !0),
                e("div", Zt, [
                  i[18] || (i[18] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Default"),
                    e("span", { class: "pim-f-note" }, "when no value is set")
                  ], -1)),
                  d(St, {
                    attribute: C,
                    type: D(C),
                    onChange: (q) => U(C, "default", q)
                  }, null, 8, ["attribute", "type", "onChange"])
                ]),
                D(C)?.config_schema ? (s(), v("div", Qt, [
                  i[19] || (i[19] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Type configuration")
                  ], -1)),
                  d(Le, {
                    schema: D(C).config_schema,
                    "model-value": C.config ?? {},
                    "onUpdate:modelValue": (q) => $(C, q)
                  }, null, 8, ["schema", "model-value", "onUpdate:modelValue"])
                ])) : I("", !0)
              ]),
              e("div", Xt, [
                d(l(E), {
                  type: "button",
                  onClick: (q) => H(j, C),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: g(() => [
                    d(l(M), { icon: "tabler:trash" }),
                    i[20] || (i[20] = R(" Remove field", -1))
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
      e("section", la, [
        e("div", ta, [
          d(l(se), {
            modelValue: ye.value,
            "onUpdate:modelValue": i[3] || (i[3] = (j) => ye.value = j),
            type: "text",
            placeholder: "new_field_group",
            onKeydown: ce(Q(_e, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          d(l(E), {
            type: "button",
            disabled: !l(le).test(ye.value),
            onClick: _e,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: g(() => [
              d(l(M), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              }),
              i[22] || (i[22] = R(" Add field group", -1))
            ]),
            _: 1
          }, 8, ["disabled"]),
          i[23] || (i[23] = e("span", { class: "muted small" }, "A field group contains fields and can be written by named sources only.", -1))
        ])
      ])
    ]));
  }
}), sa = { class: "muted small" }, na = { class: "pim-aspect" }, oa = {
  key: 0,
  class: "small muted"
}, ia = { class: "pim-fields" }, da = { class: "pim-f pim-w-full" }, ua = { class: "pim-f-label" }, ra = { class: "row pim-add-row" }, ca = /* @__PURE__ */ Z({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: k }) {
    const n = t, c = k, u = F(() => n.draft.dimensions ?? []), y = L("");
    function h() {
      const b = y.value.trim();
      !le.test(b) || u.value.some((r) => r.name === b) || ((n.draft.dimensions ??= []).push({ name: b, members: [] }), y.value = "");
    }
    function w(b) {
      const r = [];
      for (const o of n.draft.aspects ?? []) for (const a of o.attributes ?? []) a.scope?.includes(b.name) && r.push(o.namespace + "." + a.code);
      for (const o of n.draft.families ?? []) for (const a of o.requirements ?? []) a.context && b.name in a.context && r.push(o.code + " requirement " + a.id);
      return r;
    }
    function p(b) {
      w(b).length || (u.value.splice(u.value.indexOf(b), 1), n.schema.declaration.dimensions?.some((r) => r.name === b.name) && c("remove", "dimensions", b.name));
    }
    function O(b, r) {
      if (b.members = r, b.fallback)
        for (const o of Object.keys(b.fallback)) r.includes(o) || delete b.fallback[o];
    }
    function z(b, r) {
      return b.fallback?.[r] ?? [];
    }
    function D(b, r, o) {
      const a = { ...b.fallback ?? {} };
      o.length ? a[r] = o : delete a[r], Object.keys(a).length ? b.fallback = a : delete b.fallback;
    }
    return (b, r) => (s(), T(he, {
      count: u.value.length,
      columns: ["code", "details", "usage"]
    }, {
      add: g(() => [
        e("div", ra, [
          d(l(se), {
            modelValue: y.value,
            "onUpdate:modelValue": r[0] || (r[0] = (o) => y.value = o),
            type: "text",
            placeholder: "new_dimension",
            onKeydown: ce(Q(h, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          d(l(E), {
            type: "button",
            disabled: !l(le).test(y.value),
            onClick: h,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: g(() => [
              d(l(M), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              }),
              r[3] || (r[3] = R(" Add dimension", -1))
            ]),
            _: 1
          }, 8, ["disabled"]),
          r[4] || (r[4] = e("span", { class: "muted small" }, "A dimension lets a value differ per member, with fallbacks between members.", -1))
        ])
      ]),
      default: g(() => [
        (s(!0), v(K, null, J(u.value, (o) => (s(), T(ke, {
          title: l(W)(o.name),
          code: o.name,
          key: o.name,
          usage: w(o).length + (w(o).length === 1 ? " dependency" : " dependencies")
        }, {
          details: g(() => [
            e("span", sa, x(o.members.length) + " " + x(o.members.length === 1 ? "member" : "members"), 1)
          ]),
          actions: g(() => [
            d(l(E), {
              type: "button",
              disabled: w(o).length > 0,
              "aria-label": "Remove " + l(W)(o.name),
              title: w(o).length ? "Take the dimension off these first" : "",
              onClick: (a) => p(o),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: g(() => [
                d(l(M), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "title", "onClick"])
          ]),
          default: g(() => [
            e("div", na, [
              w(o).length ? (s(), v("p", oa, "Used by " + x(w(o).join(", ")), 1)) : I("", !0),
              e("div", ia, [
                e("div", da, [
                  r[1] || (r[1] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Members"),
                    e("span", { class: "pim-f-note" }, "the values this dimension takes")
                  ], -1)),
                  d(de, {
                    "model-value": o.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (a) => O(o, a)
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                (s(!0), v(K, null, J(o.members, (a) => (s(), v("div", {
                  key: a,
                  class: "pim-f pim-w-half"
                }, [
                  e("div", ua, [
                    e("label", null, x(a) + " falls back to", 1),
                    r[2] || (r[2] = e("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  d(de, {
                    "model-value": z(o, a),
                    options: o.members.filter((f) => f !== a).map((f) => ({ value: f })),
                    "onUpdate:modelValue": (f) => D(o, a, f)
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
}), ma = { class: "muted small" }, pa = { class: "pim-aspect" }, fa = { class: "row small" }, va = {
  key: 1,
  class: "muted small"
}, ya = {
  key: 2,
  class: "pim-stack tight pim-terms"
}, ba = {
  key: 1,
  class: "pim-responsive-table"
}, ga = {
  class: "pim-grid compact",
  "aria-label": "Vocabulary terms"
}, ha = { key: 0 }, ka = { class: "mono" }, wa = {
  key: 0,
  class: "mono muted"
}, $a = { class: "num" }, _a = {
  role: "list",
  class: "pim-stacked-list",
  "aria-label": "Vocabulary terms"
}, xa = { class: "pim-stacked-meta muted small" }, Ca = { class: "mono" }, Va = { key: 0 }, Ua = {
  key: 2,
  class: "muted small"
}, Sa = { class: "row wrap" }, Oa = { class: "row wrap pim-add-row" }, Aa = { class: "row pim-add-row" }, Ia = /* @__PURE__ */ Z({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: k }) {
    const n = t, c = k, u = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/, y = F(() => n.schema.access.write), h = F(() => n.draft.vocabularies ?? []), w = L("");
    function p() {
      const U = w.value.trim();
      !le.test(U) || h.value.some((N) => N.code === U) || ((n.draft.vocabularies ??= []).push({ code: U }), w.value = "");
    }
    function O(U) {
      h.value.splice(h.value.indexOf(U), 1), n.schema.declaration.vocabularies?.some((N) => N.code === U.code) && c("remove", "vocabularies", U.code);
    }
    function z(U) {
      return !!n.schema.vocabularies[U];
    }
    const D = L({}), b = L({}), r = L({}), o = L({}), a = L({}), f = L({}), V = L({});
    async function _(U, N) {
      a.value[U] = !0, f.value[U] = "";
      try {
        const S = await te.termsPage(n.catalogId, U, N);
        b.value[U] = S.terms, o.value[U] = N, r.value[U] = S.next;
      } catch (S) {
        f.value[U] = S instanceof Error ? S.message : "Could not load terms.";
      } finally {
        a.value[U] = !1;
      }
    }
    function A(U) {
      D.value[U] = !D.value[U], D.value[U] && !b.value[U] && _(U);
    }
    function $(U) {
      return V.value[U] ?? (V.value[U] = { code: "", label: "", parent: "" });
    }
    async function B(U) {
      const N = $(U.code);
      if (!(!y.value || !u.test(N.code))) {
        a.value[U.code] = !0, f.value[U.code] = "";
        try {
          const S = { term: { vocabulary: U.code, code: N.code }, labels: { en: N.label || W(N.code) } };
          U.hierarchical && N.parent && (S.parent = N.parent);
          const X = (await te.apply(n.catalogId, [S])).outcomes[0];
          if (X.outcome !== "created" && X.outcome !== "updated") throw new Error(X.findings?.[0]?.message ?? "The term was not accepted.");
          V.value[U.code] = { code: "", label: "", parent: "" }, te.invalidateTerms(n.catalogId), await _(U.code, o.value[U.code]);
        } catch (S) {
          f.value[U.code] = S instanceof Error ? S.message : "Could not add the term.";
        } finally {
          a.value[U.code] = !1;
        }
      }
    }
    async function ee(U, N, S) {
      if (y.value && !(S && !await pl.confirm({ header: "Retire term?", message: `Retire ${xe(N)}? Term changes save immediately. You can restore this term later.`, acceptLabel: "Retire", rejectLabel: "Cancel" }))) {
        a.value[U.code] = !0, f.value[U.code] = "";
        try {
          const X = (await te.apply(n.catalogId, [{ term: { vocabulary: U.code, code: N.code }, retired: S }])).outcomes[0];
          if (!X || !["updated", "unchanged"].includes(X.outcome)) throw new Error(X?.findings?.map((me) => me.message ?? me.code).join("; ") || "The term change was not accepted.");
          te.invalidateTerms(n.catalogId), await _(U.code, o.value[U.code]);
        } catch (P) {
          f.value[U.code] = P instanceof Error ? P.message : "Could not change the term.";
        } finally {
          a.value[U.code] = !1;
        }
      }
    }
    return (U, N) => (s(), T(he, {
      count: h.value.length,
      columns: ["code", "details"]
    }, {
      add: g(() => [
        e("div", Aa, [
          d(l(se), {
            modelValue: w.value,
            "onUpdate:modelValue": N[0] || (N[0] = (S) => w.value = S),
            type: "text",
            placeholder: "new_vocabulary",
            onKeydown: ce(Q(p, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          d(l(E), {
            type: "button",
            disabled: !l(le).test(w.value),
            onClick: p,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: g(() => [
              d(l(M), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              }),
              N[10] || (N[10] = R(" Add vocabulary", -1))
            ]),
            _: 1
          }, 8, ["disabled"]),
          N[11] || (N[11] = e("span", { class: "muted small" }, "Select fields pick their values from a vocabulary's terms.", -1))
        ])
      ]),
      default: g(() => [
        (s(!0), v(K, null, J(h.value, (S) => (s(), T(ke, {
          title: l(W)(S.code),
          code: S.code,
          key: S.code
        }, {
          details: g(() => [
            e("span", ma, x(S.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: g(() => [
            d(l(E), {
              type: "button",
              "aria-label": "Remove " + l(W)(S.code),
              onClick: (P) => O(S),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: g(() => [
                d(l(M), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])
          ]),
          default: g(() => [
            e("div", pa, [
              e("label", fa, [
                d(l(Ce), {
                  "aria-label": "Hierarchical " + S.code,
                  "model-value": S.hierarchical === !0,
                  "onUpdate:modelValue": (P) => P ? S.hierarchical = !0 : delete S.hierarchical
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"]),
                N[1] || (N[1] = e("span", null, "Hierarchical", -1))
              ]),
              z(S.code) ? (s(), T(l(E), {
                key: 0,
                type: "button",
                onClick: (P) => A(S.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: g(() => [
                  d(l(M), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  R(" " + x(D.value[S.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : (s(), v("span", va, "Apply the schema before adding terms.")),
              D.value[S.code] ? (s(), v("div", ya, [
                N[9] || (N[9] = e("p", { class: "muted small" }, "Term changes save immediately.", -1)),
                f.value[S.code] ? (s(), T(l(ue), {
                  key: 0,
                  severity: "error",
                  role: "alert"
                }, {
                  default: g(() => [
                    R(x(f.value[S.code]) + " ", 1),
                    d(l(E), {
                      type: "button",
                      disabled: a.value[S.code],
                      onClick: (P) => _(S.code, o.value[S.code]),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: g(() => [...N[2] || (N[2] = [
                        R("Retry", -1)
                      ])]),
                      _: 1
                    }, 8, ["disabled", "onClick"])
                  ]),
                  _: 2
                }, 1024)) : I("", !0),
                (b.value[S.code] ?? []).length ? (s(), v("div", ba, [
                  e("table", ga, [
                    e("thead", null, [
                      e("tr", null, [
                        N[3] || (N[3] = e("th", null, "Code", -1)),
                        N[4] || (N[4] = e("th", null, "Label", -1)),
                        S.hierarchical ? (s(), v("th", ha, "Parent")) : I("", !0),
                        N[5] || (N[5] = e("th", null, null, -1))
                      ])
                    ]),
                    e("tbody", null, [
                      (s(!0), v(K, null, J(b.value[S.code], (P) => (s(), v("tr", {
                        key: P.code,
                        class: ve({ muted: P.retired })
                      }, [
                        e("td", ka, x(P.code), 1),
                        e("td", null, x(l(xe)(P)), 1),
                        S.hierarchical ? (s(), v("td", wa, x(P.parent ?? ""), 1)) : I("", !0),
                        e("td", $a, [
                          d(l(E), {
                            type: "button",
                            disabled: !y.value || a.value[S.code],
                            onClick: (X) => ee(S, P, !P.retired),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: g(() => [
                              R(x(P.retired ? "Restore" : "Retire"), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled", "onClick"])
                        ])
                      ], 2))), 128))
                    ])
                  ]),
                  e("ul", _a, [
                    (s(!0), v(K, null, J(b.value[S.code], (P) => (s(), v("li", {
                      key: P.code,
                      class: ve(["pim-stacked-row", { muted: P.retired }])
                    }, [
                      e("div", null, x(l(xe)(P)), 1),
                      e("div", xa, [
                        e("span", Ca, x(P.code), 1),
                        S.hierarchical && P.parent ? (s(), v("span", Va, "Parent: " + x(P.parent), 1)) : I("", !0)
                      ]),
                      d(l(E), {
                        type: "button",
                        disabled: !y.value || a.value[S.code],
                        onClick: (X) => ee(S, P, !P.retired),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: g(() => [
                          R(x(P.retired ? "Restore" : "Retire"), 1)
                        ]),
                        _: 2
                      }, 1032, ["disabled", "onClick"])
                    ], 2))), 128))
                  ])
                ])) : a.value[S.code] ? I("", !0) : (s(), v("p", Ua, "No terms yet.")),
                e("div", Sa, [
                  d(l(E), {
                    type: "button",
                    disabled: a.value[S.code] || !o.value[S.code],
                    onClick: (P) => _(S.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: g(() => [
                      d(l(M), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      N[6] || (N[6] = R(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  d(l(E), {
                    type: "button",
                    disabled: a.value[S.code] || !r.value[S.code],
                    onClick: (P) => _(S.code, r.value[S.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: g(() => [
                      d(l(M), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      N[7] || (N[7] = R(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                e("div", Oa, [
                  d(l(se), {
                    modelValue: $(S.code).code,
                    "onUpdate:modelValue": (P) => $(S.code).code = P,
                    disabled: !y.value || a.value[S.code],
                    type: "text",
                    placeholder: "code",
                    class: "mono narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  d(l(se), {
                    modelValue: $(S.code).label,
                    "onUpdate:modelValue": (P) => $(S.code).label = P,
                    disabled: !y.value || a.value[S.code],
                    type: "text",
                    placeholder: "Label (en)"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  S.hierarchical ? (s(), T(l(ie), {
                    key: 0,
                    modelValue: $(S.code).parent,
                    "onUpdate:modelValue": (P) => $(S.code).parent = P,
                    disabled: !y.value || a.value[S.code],
                    class: "narrow",
                    options: [{ value: "", label: "No parent" }, ...(b.value[S.code] ?? []).map((P) => ({ value: P.code, label: String(l(xe)(P)) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "options"])) : I("", !0),
                  d(l(E), {
                    type: "button",
                    disabled: !y.value || a.value[S.code] || !u.test($(S.code).code),
                    onClick: (P) => B(S),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: g(() => [
                      d(l(M), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      N[8] || (N[8] = R(" Add term", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])
              ])) : I("", !0)
            ])
          ]),
          _: 2
        }, 1032, ["title", "code"]))), 128))
      ]),
      _: 1
    }, 8, ["count"]));
  }
}), ja = { class: "muted small" }, Ra = { class: "pim-aspect" }, Ta = { class: "pim-fields" }, qa = { class: "pim-f pim-w-full" }, za = { class: "pim-aspect" }, Da = { class: "pim-stack tight" }, Na = { class: "pim-level-head" }, La = { class: "pim-fields" }, Pa = { class: "pim-f pim-w-half" }, Ea = { class: "pim-f pim-w-half" }, Ba = { class: "pim-aspect" }, Ma = { class: "pim-stack tight" }, Ka = { class: "pim-level-head" }, Ha = { class: "mono" }, Fa = { class: "pim-fields" }, Ja = { class: "pim-f-label" }, Wa = { class: "pim-f pim-w-half" }, Ga = { class: "pim-f pim-w-half" }, Ya = { class: "row pim-add-row" }, Za = { class: "row pim-add-row" }, Qa = /* @__PURE__ */ Z({
  __name: "BuilderFamilies",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: k }) {
    const n = t, c = k, u = F(() => (n.draft.families ?? []).filter((_) => _.code !== "generic")), y = F(() => {
      const _ = (n.draft.aspects ?? []).map(($) => $.namespace), A = [...new Set(Object.entries(n.schema.attributes).filter(([, $]) => $.plugin).map(([$]) => $.split(".")[0]))];
      return [..._, ...A.filter(($) => !_.includes($))].map(($) => ({ value: $, label: W($) }));
    });
    function h(_) {
      const A = [];
      for (const $ of n.draft.aspects ?? []) if (_.aspects?.includes($.namespace)) for (const B of $.attributes ?? []) A.push({ value: $.namespace + "." + B.code, label: W(B.code) + " (" + $.namespace + ")" });
      for (const [$, B] of Object.entries(n.schema.attributes)) B.plugin && _.aspects?.includes($.split(".")[0]) && !A.some((ee) => ee.value === $) && A.push({ value: $, label: W($) + " (" + $.split(".")[0] + ")" });
      return A;
    }
    const w = F(() => n.draft.dimensions ?? []), p = L("");
    function O() {
      const _ = p.value.trim();
      !le.test(_) || (n.draft.families ?? []).some((A) => A.code === _) || ((n.draft.families ??= []).push({ code: _, aspects: [] }), p.value = "");
    }
    function z(_) {
      n.draft.families.splice(n.draft.families.indexOf(_), 1), n.schema.declaration.families?.some((A) => A.code === _.code) && c("remove", "families", _.code);
    }
    function D(_) {
      return _.variation ?? [];
    }
    function b(_) {
      (_.variation ??= []).push({ axes: [] });
    }
    function r(_) {
      return _.requirements ?? [];
    }
    const o = L({});
    function a(_) {
      const A = (o.value[_.code] ?? "").trim();
      !le.test(A) || r(_).some(($) => $.id === A) || ((_.requirements ??= []).push({ id: A, require: [] }), o.value[_.code] = "");
    }
    function f(_, A) {
      return _.context?.[A] ?? "";
    }
    function V(_, A, $) {
      const B = { ..._.context ?? {} };
      $ ? B[A] = $ : delete B[A], Object.keys(B).length ? _.context = B : delete _.context;
    }
    return (_, A) => (s(), T(he, {
      count: u.value.length,
      columns: ["code", "details"]
    }, {
      add: g(() => [
        e("div", Za, [
          d(l(se), {
            modelValue: p.value,
            "onUpdate:modelValue": A[0] || (A[0] = ($) => p.value = $),
            type: "text",
            placeholder: "new_family",
            onKeydown: ce(Q(O, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          d(l(E), {
            type: "button",
            disabled: !l(le).test(p.value),
            onClick: O,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: g(() => [
              d(l(M), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              }),
              A[11] || (A[11] = R(" Add family", -1))
            ]),
            _: 1
          }, 8, ["disabled"]),
          A[12] || (A[12] = e("span", { class: "muted small" }, "Products without a family use the generic one.", -1))
        ])
      ]),
      default: g(() => [
        (s(!0), v(K, null, J(u.value, ($) => (s(), T(ke, {
          title: l(W)($.code),
          code: $.code,
          key: $.code
        }, {
          details: g(() => [
            e("span", ja, x($.aspects?.length ?? 0) + " " + x($.aspects?.length === 1 ? "field group" : "field groups"), 1)
          ]),
          actions: g(() => [
            d(l(E), {
              type: "button",
              onClick: (B) => z($),
              "aria-label": "Remove " + l(W)($.code),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: g(() => [
                d(l(M), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick", "aria-label"])
          ]),
          default: g(() => [
            e("div", Ra, [
              e("div", Ta, [
                e("div", qa, [
                  A[1] || (A[1] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Field groups"),
                    e("span", { class: "pim-f-note" }, "the fields this family's products carry")
                  ], -1)),
                  d(de, {
                    "model-value": $.aspects ?? [],
                    options: y.value,
                    "onUpdate:modelValue": (B) => l($e)($, "aspects", B)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            e("div", za, [
              A[5] || (A[5] = e("header", { class: "pim-aspect-head" }, [
                e("h3", null, "Variation"),
                e("span", { class: "muted small" }, "model → variants → items; each level owns axes that make its children distinct")
              ], -1)),
              e("div", Da, [
                (s(!0), v(K, null, J(D($), (B, ee) => (s(), v("div", {
                  key: ee,
                  class: "pim-level"
                }, [
                  e("div", Na, [
                    e("strong", null, "Level " + x(ee + 1), 1),
                    d(l(E), {
                      type: "button",
                      "aria-label": "Remove level",
                      onClick: (U) => D($).splice(ee, 1),
                      text: "",
                      severity: "secondary",
                      size: "small"
                    }, {
                      default: g(() => [
                        d(l(M), { icon: "tabler:x" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  e("div", La, [
                    e("div", Pa, [
                      A[2] || (A[2] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Axes"),
                        e("span", { class: "pim-f-note" }, "key-indexed, one value each")
                      ], -1)),
                      d(de, {
                        "model-value": B.axes ?? [],
                        options: h($),
                        "onUpdate:modelValue": (U) => B.axes = U
                      }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                    ]),
                    e("div", Ea, [
                      A[3] || (A[3] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Also owned here"),
                        e("span", { class: "pim-f-note" }, "other fields written at this level")
                      ], -1)),
                      d(de, {
                        "model-value": B.own ?? [],
                        options: h($),
                        "onUpdate:modelValue": (U) => U.length ? B.own = U : delete B.own
                      }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                    ])
                  ])
                ]))), 128)),
                d(l(E), {
                  type: "button",
                  onClick: (B) => b($),
                  severity: "secondary",
                  outlined: "",
                  size: "small"
                }, {
                  default: g(() => [
                    d(l(M), {
                      icon: "tabler:plus",
                      "aria-hidden": "true"
                    }),
                    A[4] || (A[4] = R(" Add level", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ]),
            e("div", Ba, [
              A[10] || (A[10] = e("header", { class: "pim-aspect-head" }, [
                e("h3", null, "Requirements"),
                e("span", { class: "muted small" }, "what a channel needs before a product is ready")
              ], -1)),
              e("div", Ma, [
                (s(!0), v(K, null, J(r($), (B, ee) => (s(), v("div", {
                  key: B.id,
                  class: "pim-level"
                }, [
                  e("div", Ka, [
                    e("strong", Ha, x(B.id), 1),
                    d(l(E), {
                      type: "button",
                      "aria-label": "Remove requirement",
                      onClick: (U) => r($).splice(ee, 1),
                      text: "",
                      severity: "secondary",
                      size: "small"
                    }, {
                      default: g(() => [
                        d(l(M), { icon: "tabler:x" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  e("div", Fa, [
                    (s(!0), v(K, null, J(w.value, (U) => (s(), v("div", {
                      key: U.name,
                      class: "pim-f pim-w-third"
                    }, [
                      e("div", Ja, [
                        e("label", null, x(l(W)(U.name)), 1),
                        A[6] || (A[6] = e("span", { class: "pim-f-note" }, "context", -1))
                      ]),
                      d(l(ie), {
                        "model-value": f(B, U.name),
                        "onUpdate:modelValue": (N) => V(B, U.name, N),
                        options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ...U.members.map((N) => ({ value: N, label: String(N) }))],
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self"
                      }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                    ]))), 128)),
                    e("div", Wa, [
                      A[7] || (A[7] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Required"),
                        e("span", { class: "pim-f-note" }, "must hold a value")
                      ], -1)),
                      d(de, {
                        "model-value": B.require ?? [],
                        options: h($),
                        "onUpdate:modelValue": (U) => l($e)(B, "require", U)
                      }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                    ]),
                    e("div", Ga, [
                      A[8] || (A[8] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Authored"),
                        e("span", { class: "pim-f-note" }, "must be set in the context itself, not by fallback")
                      ], -1)),
                      d(de, {
                        "model-value": B.authored ?? [],
                        options: h($),
                        "onUpdate:modelValue": (U) => l($e)(B, "authored", U)
                      }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                    ])
                  ])
                ]))), 128)),
                e("div", Ya, [
                  d(l(se), {
                    modelValue: o.value[$.code],
                    "onUpdate:modelValue": (B) => o.value[$.code] = B,
                    type: "text",
                    placeholder: "requirement_id",
                    onKeydown: ce(Q((B) => a($), ["prevent"]), ["enter"]),
                    class: "mono narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                  d(l(E), {
                    type: "button",
                    disabled: !l(le).test(o.value[$.code] ?? ""),
                    onClick: (B) => a($),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: g(() => [
                      d(l(M), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      A[9] || (A[9] = R(" Add requirement", -1))
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
}), Xa = ["inert"], es = {
  key: 0,
  class: "row wrap"
}, ls = {
  key: 2,
  class: "small muted"
}, ts = { class: "pim-principal-service" }, as = /* @__PURE__ */ Z({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: k }) {
    const n = t, c = k, u = L(!1), y = L(""), h = L({});
    let w = 0;
    oe(() => n.modelValue, async (b) => {
      const r = ++w;
      try {
        const o = await We(n.catalogId ?? "", b);
        r === w && (h.value = o);
      } catch {
        r === w && (h.value = {});
      }
    }, { immediate: !0, deep: !0 }), Ve(() => {
      w++;
    });
    function p(b) {
      return h.value[b] ?? re(b, "Person");
    }
    De(async () => {
      try {
        await fl("wc-principal-picker"), u.value = !0;
      } catch {
        u.value = !1;
      }
    });
    function O(b) {
      n.disabled || !b.trim() || n.modelValue.includes(b.trim()) || (c("update:modelValue", [...n.modelValue, b.trim()]), y.value = "");
    }
    function z(b) {
      const r = b.detail;
      if (!r || typeof r != "object") return;
      const o = r, a = o.principal_id ?? o.id;
      typeof a == "string" && O(a);
    }
    function D(b) {
      n.disabled || c("update:modelValue", n.modelValue.filter((r) => r !== b));
    }
    return (b, r) => (s(), v("div", {
      class: "pim-principal-list",
      inert: t.disabled || void 0
    }, [
      t.modelValue.length ? (s(), v("div", es, [
        (s(!0), v(K, null, J(t.modelValue, (o) => (s(), T(l(ae), {
          key: o,
          severity: "secondary"
        }, {
          default: g(() => [
            e("span", null, x(p(o)), 1),
            d(l(E), {
              text: "",
              size: "small",
              disabled: t.disabled,
              "aria-label": "Remove " + p(o),
              onClick: (a) => D(o)
            }, {
              default: g(() => [
                d(l(M), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : I("", !0),
      u.value ? (s(), v("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: Q(z, ["stop"])
      }, null, 32)) : (s(), v("span", ls, "The person picker is unavailable.")),
      e("label", ts, [
        r[3] || (r[3] = e("span", { class: "small muted" }, "Service account", -1)),
        d(l(se), {
          modelValue: y.value,
          "onUpdate:modelValue": r[0] || (r[0] = (o) => y.value = o),
          disabled: t.disabled,
          placeholder: "Service principal id",
          onKeydown: r[1] || (r[1] = ce(Q((o) => O(y.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "disabled"])
      ]),
      d(l(E), {
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: t.disabled || !y.value.trim(),
        onClick: r[2] || (r[2] = (o) => O(y.value))
      }, {
        default: g(() => [
          d(l(M), { icon: "tabler:plus" }),
          r[4] || (r[4] = R(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, Xa));
  }
}), ss = { class: "pim-stack" }, ns = { class: "muted small" }, os = { class: "pim-fields" }, is = { class: "pim-f pim-w-half" }, ds = { class: "pim-f pim-w-half" }, us = { class: "row pim-add-row" }, rs = { class: "muted small" }, cs = { class: "pim-fields" }, ms = { class: "pim-f pim-w-third" }, ps = { class: "pim-f pim-w-third" }, fs = { class: "row" }, vs = { class: "pim-f pim-w-third" }, ys = { class: "pim-f pim-w-full" }, bs = { class: "row pim-add-row" }, gs = /* @__PURE__ */ Z({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: k }) {
    const n = t, c = k, u = F(() => n.draft.channels ?? []), y = F(() => n.draft.sources ?? []), h = F(() => [...new Set((n.draft.families ?? []).flatMap((a) => (a.requirements ?? []).map((f) => f.id)))].map((a) => ({ value: a }))), w = F(() => (n.draft.families ?? []).filter((a) => a.code !== "generic").map((a) => ({ value: a.code, label: W(a.code) }))), p = F(() => (n.draft.aspects ?? []).map((a) => ({ value: a.namespace, label: W(a.namespace) }))), O = L(""), z = L("");
    function D() {
      const a = O.value.trim();
      !le.test(a) || u.value.some((f) => f.id === a) || ((n.draft.channels ??= []).push({ id: a, requirements: [] }), O.value = "");
    }
    function b(a) {
      u.value.splice(u.value.indexOf(a), 1), n.schema.declaration.channels?.some((f) => f.id === a.id) && c("remove", "channels", a.id);
    }
    function r() {
      const a = z.value.trim();
      !le.test(a) || y.value.some((f) => f.id === a) || ((n.draft.sources ??= []).push({ id: a, ordering: "none", writes: [] }), z.value = "");
    }
    function o(a) {
      y.value.splice(y.value.indexOf(a), 1), n.schema.declaration.sources?.some((f) => f.id === a.id) && c("remove", "sources", a.id);
    }
    return (a, f) => (s(), v("div", ss, [
      d(he, {
        count: u.value.length,
        columns: ["code", "details"]
      }, {
        head: g(() => [...f[2] || (f[2] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Channels")
          ], -1)
        ])]),
        add: g(() => [
          e("div", us, [
            d(l(se), {
              modelValue: O.value,
              "onUpdate:modelValue": f[0] || (f[0] = (V) => O.value = V),
              type: "text",
              placeholder: "new_channel",
              onKeydown: ce(Q(D, ["prevent"]), ["enter"]),
              class: "mono"
            }, null, 8, ["modelValue", "onKeydown"]),
            d(l(E), {
              type: "button",
              disabled: !l(le).test(O.value),
              onClick: D,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: g(() => [
                d(l(M), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                }),
                f[5] || (f[5] = R(" Add channel", -1))
              ]),
              _: 1
            }, 8, ["disabled"])
          ])
        ]),
        default: g(() => [
          (s(!0), v(K, null, J(u.value, (V) => (s(), T(ke, {
            key: V.id,
            title: l(W)(V.id),
            code: V.id
          }, {
            details: g(() => [
              e("span", ns, x(V.requirements?.length ?? 0) + " " + x(V.requirements?.length === 1 ? "requirement" : "requirements"), 1)
            ]),
            actions: g(() => [
              d(l(E), {
                type: "button",
                onClick: (_) => b(V),
                "aria-label": "Remove " + l(W)(V.id),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: g(() => [
                  d(l(M), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick", "aria-label"])
            ]),
            default: g(() => [
              e("div", os, [
                e("div", is, [
                  f[3] || (f[3] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Requirements"),
                    e("span", { class: "pim-f-note" }, "a product is ready for the channel when these hold")
                  ], -1)),
                  d(de, {
                    "model-value": V.requirements ?? [],
                    options: h.value,
                    "onUpdate:modelValue": (_) => l($e)(V, "requirements", _)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", ds, [
                  f[4] || (f[4] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Families"),
                    e("span", { class: "pim-f-note" }, "empty means every family")
                  ], -1)),
                  d(de, {
                    "model-value": V.families ?? [],
                    options: w.value,
                    "onUpdate:modelValue": (_) => l($e)(V, "families", _)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, 1032, ["title", "code"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      d(he, {
        count: y.value.length,
        columns: ["code", "details"]
      }, {
        head: g(() => [...f[6] || (f[6] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Sources")
          ], -1)
        ])]),
        add: g(() => [
          e("div", bs, [
            d(l(se), {
              modelValue: z.value,
              "onUpdate:modelValue": f[1] || (f[1] = (V) => z.value = V),
              type: "text",
              placeholder: "new_source",
              onKeydown: ce(Q(r, ["prevent"]), ["enter"]),
              class: "mono"
            }, null, 8, ["modelValue", "onKeydown"]),
            d(l(E), {
              type: "button",
              disabled: !l(le).test(z.value),
              onClick: r,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: g(() => [
                d(l(M), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                }),
                f[11] || (f[11] = R(" Add source", -1))
              ]),
              _: 1
            }, 8, ["disabled"])
          ])
        ]),
        default: g(() => [
          (s(!0), v(K, null, J(y.value, (V) => (s(), T(ke, {
            key: V.id,
            title: l(W)(V.id),
            code: V.id
          }, {
            details: g(() => [
              e("span", rs, x(V.writes?.length ?? 0) + " " + x(V.writes?.length === 1 ? "field group" : "field groups"), 1)
            ]),
            actions: g(() => [
              d(l(E), {
                type: "button",
                onClick: (_) => o(V),
                "aria-label": "Remove " + l(W)(V.id),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: g(() => [
                  d(l(M), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick", "aria-label"])
            ]),
            default: g(() => [
              e("div", cs, [
                e("div", ms, [
                  f[7] || (f[7] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Ordering"),
                    e("span", { class: "pim-f-note" }, "sequence keeps late deliveries from winning")
                  ], -1)),
                  d(l(ie), {
                    "model-value": V.ordering ?? "none",
                    "onUpdate:modelValue": (_) => V.ordering = _,
                    options: [{ value: "none", label: "none" }, { value: "sequence", label: "sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                e("div", ps, [
                  f[8] || (f[8] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Audit"),
                    e("span", { class: "pim-f-note" }, "record each value change")
                  ], -1)),
                  e("label", fs, [
                    d(l(Ce), {
                      "aria-label": "Audit " + V.id,
                      "model-value": V.audit !== !1,
                      "onUpdate:modelValue": (_) => _ ? delete V.audit : V.audit = !1
                    }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"]),
                    e("span", null, x(V.audit === !1 ? "Off for this source" : "As the catalog policy"), 1)
                  ])
                ]),
                e("div", vs, [
                  f[9] || (f[9] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Principals"),
                    e("span", { class: "pim-f-note" }, "who may write as this source")
                  ], -1)),
                  d(as, {
                    "catalog-id": t.catalogId,
                    "model-value": V.principals ?? [],
                    "onUpdate:modelValue": (_) => l($e)(V, "principals", _)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])
                ]),
                e("div", ys, [
                  f[10] || (f[10] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Writes"),
                    e("span", { class: "pim-f-note" }, "field groups this source may set")
                  ], -1)),
                  d(de, {
                    "model-value": V.writes ?? [],
                    options: p.value,
                    "onUpdate:modelValue": (_) => l($e)(V, "writes", _)
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
}), hs = { class: "pim-stack" }, ks = { class: "pim-bsection-head" }, ws = { class: "muted small" }, $s = {
  key: 0,
  class: "pim-aspect muted"
}, _s = {
  key: 1,
  class: "muted small"
}, xs = {
  key: 3,
  class: "muted small"
}, Cs = {
  key: 0,
  class: "pim-aspect muted"
}, Vs = { class: "muted small" }, Us = /* @__PURE__ */ Z({
  __name: "BuilderPlugins",
  props: {
    draft: {},
    schema: {},
    options: {},
    pluginConfigs: { default: () => ({}) }
  },
  emits: ["remove", "configure"],
  setup(t, { emit: k }) {
    const n = t, c = k, u = F(() => n.draft.plugins ?? []);
    function y(r) {
      return u.value.some((o) => o.use === r.plugin);
    }
    function h(r) {
      return n.schema.plugins.find((o) => o.plugin === r.plugin);
    }
    function w(r, o) {
      o && !y(r) && (n.draft.plugins ??= []).push({ use: r.plugin }), o || (n.draft.plugins = u.value.filter((a) => a.use !== r.plugin), delete n.pluginConfigs[r.plugin], h(r)?.active && c("remove", "plugins", r.plugin));
    }
    function p(r, o) {
      n.pluginConfigs[r.plugin] = o;
    }
    function O(r) {
      return Object.entries(n.schema.attributes).filter(([, o]) => o.plugin === r.plugin).map(([o]) => o);
    }
    const z = F(() => n.draft.scopes ?? []);
    function D(r) {
      return z.value.includes(r.id);
    }
    function b(r, o) {
      o && !D(r) && (n.draft.scopes ??= []).push(r.id), !o && D(r) && (z.value.splice(z.value.indexOf(r.id), 1), n.schema.declaration.scopes?.includes(r.id) && c("remove", "scopes", r.id));
    }
    return (r, o) => (s(), v("div", hs, [
      d(he, {
        count: t.options.plugins.length,
        columns: ["details"]
      }, {
        head: g(() => [
          e("header", ks, [
            o[0] || (o[0] = e("h3", null, "Plugins", -1)),
            e("span", ws, x(t.options.plugins.length) + " installed", 1)
          ])
        ]),
        default: g(() => [
          t.options.plugins.length === 0 ? (s(), v("div", $s, "No plugin is installed.")) : I("", !0),
          (s(!0), v(K, null, J(t.options.plugins, (a) => (s(), T(ke, {
            key: a.plugin,
            title: l(re)(a.title, "Plugin")
          }, {
            details: g(() => [
              d(l(ae), {
                severity: y(a) ? "success" : "secondary",
                value: y(a) ? "Active" : "Inactive"
              }, null, 8, ["severity", "value"])
            ]),
            actions: g(() => [
              d(l(Ce), {
                "aria-label": "Enable " + l(re)(a.title, "Plugin"),
                "model-value": y(a),
                "onUpdate:modelValue": (f) => w(a, f)
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
            ]),
            default: g(() => [
              h(a)?.problem ? (s(), T(l(ue), {
                key: 0,
                severity: "warn"
              }, {
                default: g(() => [
                  R(x(h(a)?.problem?.message), 1)
                ]),
                _: 2
              }, 1024)) : I("", !0),
              O(a).length ? (s(), v("p", _s, "Fields: " + x(O(a).join(", ")) + ".", 1)) : I("", !0),
              y(a) ? (s(), T(Le, {
                key: 2,
                schema: a.config_schema,
                "model-value": t.pluginConfigs[a.plugin] ?? h(a)?.config ?? {},
                "onUpdate:modelValue": (f) => p(a, f)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue"])) : I("", !0),
              h(a)?.active ? (s(), v("p", xs, [
                R(x(h(a)?.lifecycle.state), 1),
                (s(!0), v(K, null, J(h(a)?.projections, (f, V) => (s(), v("span", { key: V }, " · " + x(V) + ": " + x(f.parked ? "paused" : f.bootstrapping ? "initializing" : "ready"), 1))), 128))
              ])) : I("", !0),
              h(a)?.active && t.pluginConfigs[a.plugin] ? (s(), T(l(E), {
                key: 4,
                label: "Save configuration",
                onClick: (f) => c("configure", a.plugin, t.pluginConfigs[a.plugin])
              }, null, 8, ["onClick"])) : I("", !0)
            ]),
            _: 2
          }, 1032, ["title"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      d(he, {
        count: t.options.scopes.length,
        columns: ["details"]
      }, {
        head: g(() => [...o[1] || (o[1] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Scopes"),
            e("span", { class: "muted small" }, "filters the grid can use from plugin tables")
          ], -1)
        ])]),
        default: g(() => [
          t.options.scopes.length === 0 ? (s(), v("div", Cs, "No scope is declared.")) : I("", !0),
          (s(!0), v(K, null, J(t.options.scopes, (a) => (s(), T(ke, {
            key: a.id,
            title: l(re)(a.title, "Scope")
          }, {
            details: g(() => [
              d(l(ae), {
                severity: D(a) ? "success" : "secondary",
                value: D(a) ? "Adopted" : "Not adopted"
              }, null, 8, ["severity", "value"])
            ]),
            actions: g(() => [
              d(l(Ce), {
                "aria-label": "Adopt " + l(re)(a.title, "Scope"),
                "model-value": D(a),
                "onUpdate:modelValue": (f) => b(a, f)
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
            ]),
            default: g(() => [
              e("p", Vs, [
                o[2] || (o[2] = R("Filters: ", -1)),
                (s(!0), v(K, null, J(a.filters, (f, V) => (s(), T(l(ae), {
                  key: V,
                  class: "kx-tag-sm small",
                  severity: "secondary"
                }, {
                  default: g(() => [
                    R(x(V) + " · " + x(f.ops.join(" ")), 1)
                  ]),
                  _: 2
                }, 1024))), 128)),
                R(" · needs " + x(a.access) + " access", 1)
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
async function Ss(t) {
  const k = await Xe(`/api/v1/pim-admin/catalogs/${encodeURIComponent(t)}/policy_defaults`, "policy defaults");
  if (k.audit !== "fields" && k.audit !== "off" || !["audit_days", "trash_days", "tombstone_days"].every((n) => typeof k[n] == "number" && Number.isSafeInteger(k[n])))
    throw new Error("Policy defaults are unavailable.");
  for (const [n, c] of Object.entries(Ye)) {
    const u = k[n];
    if (typeof u != "number" || !Number.isSafeInteger(u) || u < c.min || u > c.max) throw new Error(`Policy ${n} is unavailable.`);
  }
  return k;
}
const Ye = {
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
}, Os = { class: "form" }, As = {
  key: 0,
  class: "muted small pim-policy-status",
  role: "status"
}, Is = ["id", "data-policy-group", "aria-label"], js = {
  key: 0,
  class: "pim-bsection-head"
}, Rs = { class: "pim-policy-copy" }, Ts = ["for"], qs = ["id"], zs = { key: 0 }, Ds = ["aria-expanded"], Ns = /* @__PURE__ */ Z({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {}
  },
  setup(t) {
    const k = t, n = L(), c = F(() => k.defaults ?? n.value), u = L(""), y = L(!1);
    async function h() {
      if (!k.defaults) {
        u.value = "", y.value = !0;
        try {
          n.value = await Ss(k.catalogId ?? "");
        } catch (V) {
          u.value = V instanceof Error ? V.message : "Could not read policy defaults.";
        } finally {
          y.value = !1;
        }
      }
    }
    De(h);
    const w = F(() => k.draft.policy ?? {}), p = L(!1), O = [
      { key: "audit", title: "Audit trail", hint: "Fields records each value change. Off records only lifecycle, schema and release history.", kind: "enum" },
      { key: "audit_days", title: "Audit retention (days)", hint: "0 uses the 365-day default. History always expires.", kind: "int", min: 0, max: 106751 },
      { key: "trash_days", title: "Trash window (days)", hint: "How long a deleted product stays restorable.", kind: "int", min: 1, max: 106751 },
      { key: "tombstone_days", title: "Deleted product notices (days)", hint: "How long feeds report a purged product as deleted.", kind: "int", min: 1, max: 106751 }
    ], z = {
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
    function D(V) {
      const _ = Ye[V];
      return { key: V, ..._, kind: "int", hint: z[V] };
    }
    O.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(D));
    const b = ["proposal_days", "proposal_count"].map(D), r = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(D), o = [
      { id: "retention", title: "Retention", keys: O },
      { id: "proposals", title: "Proposals", keys: b },
      { id: "advanced", title: "", keys: r }
    ], a = F(() => [
      { value: "inherited", label: c.value ? `${c.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function f(V, _) {
      const A = k.draft.policy ?? (k.draft.policy = {});
      A[V] = _ == null || _ === "" || _ === "inherited" ? !1 : _;
    }
    return (V, _) => (s(), v("section", Os, [
      _[4] || (_[4] = e("p", { class: "muted small pim-policy-intro" }, "Empty fields inherit the deployment settings.", -1)),
      y.value ? (s(), v("p", As, "Loading deployment defaults…")) : I("", !0),
      u.value ? (s(), T(l(ue), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: g(() => [
          R(x(u.value) + " ", 1),
          d(l(E), {
            severity: "secondary",
            outlined: "",
            onClick: h
          }, {
            default: g(() => [..._[1] || (_[1] = [
              R("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      })) : I("", !0),
      (s(), v(K, null, J(o, (A) => (s(), v(K, {
        key: A.id
      }, [
        A.id !== "advanced" || p.value ? (s(), v("section", {
          key: 0,
          id: A.id === "advanced" ? "policy-advanced" : void 0,
          "data-policy-group": A.id,
          class: "pim-policy-group",
          "aria-label": A.title || "Advanced"
        }, [
          A.title ? (s(), v("header", js, [
            e("h3", null, x(A.title), 1)
          ])) : I("", !0),
          (s(!0), v(K, null, J(A.keys, ($) => (s(), v("div", {
            key: $.key,
            class: "pim-policy-row"
          }, [
            e("div", Rs, [
              e("label", {
                for: "pol-" + $.key
              }, x($.title), 9, Ts),
              e("p", {
                id: "pol-help-" + $.key
              }, [
                R(x($.hint), 1),
                $.global ? (s(), v("span", zs, " Managed in deployment settings.")) : I("", !0)
              ], 8, qs)
            ]),
            $.kind === "enum" ? (s(), T(l(ie), {
              key: 0,
              "input-id": "pol-" + $.key,
              "aria-describedby": "pol-help-" + $.key,
              class: "pim-policy-control",
              "model-value": typeof w.value[$.key] == "string" ? w.value[$.key] : "inherited",
              options: a.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": (B) => f($.key, B)
            }, null, 8, ["input-id", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])) : (s(), T(l(bl), {
              key: 1,
              disabled: $.global,
              "input-id": "pol-" + $.key,
              "aria-describedby": "pol-help-" + $.key,
              class: "pim-policy-control",
              "model-value": $.global ? Number(c.value?.[$.key] ?? 0) || null : typeof w.value[$.key] == "number" ? Number(w.value[$.key]) : null,
              min: $.min ?? ($.key === "audit_days" ? 0 : 1),
              max: $.max,
              step: 1,
              placeholder: c.value ? "Default: " + c.value[$.key] : "Deployment default",
              "onUpdate:modelValue": (B) => f($.key, B)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "min", "max", "placeholder", "onUpdate:modelValue"]))
          ]))), 128))
        ], 8, Is)) : I("", !0),
        A.id === "proposals" ? (s(), v("button", {
          key: 1,
          type: "button",
          class: "pim-policy-advanced",
          "aria-expanded": p.value,
          "aria-controls": "policy-advanced",
          onClick: _[0] || (_[0] = ($) => p.value = !p.value)
        }, [
          d(l(M), {
            icon: p.value ? "tabler:chevron-down" : "tabler:chevron-right",
            "aria-hidden": "true"
          }, null, 8, ["icon"]),
          _[2] || (_[2] = e("span", null, "Advanced", -1)),
          _[3] || (_[3] = e("span", { class: "muted small" }, "Processing limits and deployment settings", -1))
        ], 8, Ds)) : I("", !0)
      ], 64))), 64))
    ]));
  }
}), Ls = { class: "form" }, Ps = { class: "pim-aspect" }, Es = /* @__PURE__ */ Z({
  __name: "BuilderDeclaration",
  props: {
    draft: {}
  },
  emits: ["replace", "validity"],
  setup(t, { emit: k }) {
    const n = t, c = k, u = L(JSON.stringify(n.draft, null, 2)), y = L("");
    Ve(() => c("validity", !0)), oe(() => n.draft, (w) => {
      u.value = JSON.stringify(w, null, 2), y.value = "";
    }, { deep: !0 });
    function h() {
      try {
        const w = xl(u.value);
        y.value = "", c("validity", !0), c("replace", w);
      } catch (w) {
        c("validity", !1), y.value = "Invalid declaration: " + (w instanceof Error ? w.message : String(w));
      }
    }
    return (w, p) => (s(), v("section", Ls, [
      e("div", Ps, [
        p[1] || (p[1] = e("header", { class: "pim-aspect-head" }, [
          e("h3", null, "Declaration"),
          e("span", { class: "muted small" }, "edits apply to the draft when the JSON parses")
        ], -1)),
        y.value ? (s(), T(l(ue), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: g(() => [
            R(x(y.value), 1)
          ]),
          _: 1
        })) : I("", !0),
        d(l(gl), {
          modelValue: u.value,
          "onUpdate:modelValue": p[0] || (p[0] = (O) => u.value = O),
          rows: "28",
          spellcheck: "false",
          onInput: h,
          onBlur: h,
          class: "mono pim-json-edit"
        }, null, 8, ["modelValue"])
      ])
    ]));
  }
}), Bs = {
  key: 0,
  class: "pim-detail-head"
}, Ms = { class: "pim-detail-actions" }, Ks = { class: "pim-settings-pane" }, Hs = { class: "pim-builder-main pim-readable" }, Fs = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, Js = ["disabled", "inert"], Ws = {
  key: 6,
  class: "pim-table pim-plan"
}, Gs = { class: "pim-group-head" }, Ys = { class: "pim-card-body pad" }, Zs = {
  key: 0,
  class: "muted"
}, Qs = {
  key: 1,
  class: "muted small"
}, Xs = {
  key: 2,
  class: "muted small"
}, en = {
  key: 3,
  class: "muted small"
}, ln = { key: 0 }, tn = {
  key: 5,
  class: "pim-plan-list"
}, an = { class: "mono" }, sn = { class: "muted" }, nn = /* @__PURE__ */ Z({
  __name: "SchemaBuilder",
  props: {
    catalogId: {},
    embedded: { type: Boolean },
    title: {},
    backLabel: {}
  },
  emits: ["applied", "back", "dirty-changed"],
  setup(t, { emit: k }) {
    const n = t, c = k, u = [
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
    ], y = L("fields"), h = L(null), w = L(null), p = L({}), O = L({}), z = L({}), D = F(() => Object.fromEntries(Object.entries(z.value).filter(([H]) => p.value.plugins?.some((m) => m.use === H) && !h.value?.plugins.some((m) => m.plugin === H && m.active)))), b = L(""), r = L(!1), o = L(""), a = L(null), f = L(null), V = L(!0), _ = Ae(), A = F(() => V.value && !!a.value && a.value.class !== "refused" && !!f.value?.matches(me.value, h.value?.schema_generation ?? -1, D.value)), $ = Ae(), B = L(!1);
    let ee = 0;
    oe([p, O, z], () => {
      ee++, a.value = null;
    }, { deep: !0, flush: "sync" });
    async function U(H = !1, m = !1) {
      if (P.value && !H) return;
      const i = $.begin(), j = ee, C = n.catalogId, G = m ? Object.entries(z.value).filter(([q]) => h.value?.plugins.some((we) => we.plugin === q && we.active)) : [];
      B.value = !0, b.value = "";
      try {
        const [q, we] = await Promise.all([te.schema(C), te.schemaOptions(C)]);
        if (!$.current(i) || j !== ee || C !== n.catalogId) return;
        h.value = q, w.value = we, p.value = Se(q.declaration), O.value = {}, z.value = Object.fromEntries(G.filter(([be]) => q.plugins.some((Ue) => Ue.plugin === be && Ue.active))), a.value = null, V.value = !0;
      } catch (q) {
        $.current(i) && (b.value = q instanceof Error ? q.message : "Could not load the schema.");
      } finally {
        $.current(i) && (B.value = !1);
      }
    }
    let N = () => {
    };
    oe(() => n.catalogId, (H) => {
      N(), N = Fe(`component.${H}`, () => {
        P.value || U();
      });
    }, { immediate: !0 }), ze(async () => {
      P.value || await U();
    }), Ve(() => {
      N(), _.begin(), $.begin();
    }), oe(() => n.catalogId, () => {
      _.begin(), r.value = !1, h.value = null, w.value = null, pe(), U();
    });
    const S = F(() => Object.values(Ee(p.value, O.value)).reduce((H, m) => H + (m?.length ?? 0), 0)), P = F(() => !!h.value && (JSON.stringify(p.value) !== JSON.stringify(h.value.declaration) || S.value > 0 || Object.keys(z.value).length > 0));
    oe(P, (H) => c("dirty-changed", H), { immediate: !0 });
    const X = F(() => ![p.value.aspects, p.value.dimensions, p.value.vocabularies, p.value.families, p.value.channels, p.value.sources, p.value.plugins, p.value.scopes].some((H) => H?.length)), me = F(() => {
      const H = Se(p.value), m = Ee(H, O.value);
      return Object.keys(m).length && (H.remove = m), H;
    });
    oe(P, (H) => {
      H || (a.value = null);
    }), oe([me, D], () => {
      a.value = null;
    }, { deep: !0 });
    async function ye() {
      if (!h.value || !V.value) return;
      const H = _.begin(), m = wl(me.value, h.value.schema_generation, D.value);
      r.value = !0, b.value = "";
      try {
        const i = await te.planSchema(n.catalogId, m.declaration, m.generation, m.pluginConfigs);
        if (!_.current(H) || !m.matches(me.value, h.value.schema_generation, D.value) || !V.value) return;
        f.value = m, a.value = i;
      } catch (i) {
        if (!_.current(H)) return;
        b.value = i instanceof Error ? i.message : "Could not review the change.", a.value = null, f.value = null;
      } finally {
        _.current(H) && (r.value = !1);
      }
    }
    async function _e() {
      if (!h.value || !P.value || !A.value || !f.value) return;
      const H = n.catalogId, m = _.begin();
      r.value = !0, b.value = "", o.value = "";
      try {
        const i = await te.applySchema(H, f.value.declaration, f.value.generation, f.value.pluginConfigs);
        if (H !== n.catalogId || !_.current(m) || (await U(!0, !0), H !== n.catalogId || !_.current(m))) return;
        o.value = `Applied as generation ${i.generation} (${i.class})`, c("applied", i.generation);
      } catch (i) {
        if (H !== n.catalogId || !_.current(m)) return;
        b.value = i instanceof Error ? i.message : "Could not apply the change.";
      } finally {
        _.current(m) && (r.value = !1);
      }
    }
    async function Ie(H, m) {
      const i = n.catalogId, j = $.begin(), C = _.begin();
      r.value = !0, b.value = "";
      try {
        const G = JSON.stringify(m);
        if (await te.configurePlugin(i, H, Se(m)), i !== n.catalogId || !$.current(j)) return;
        const q = await te.schema(i);
        if (i !== n.catalogId || !$.current(j)) return;
        h.value && (h.value.plugins = q.plugins), JSON.stringify(z.value[H]) === G && delete z.value[H], o.value = "Configuration saved";
      } catch (G) {
        i === n.catalogId && _.current(C) && (b.value = G instanceof Error ? G.message : "Could not save configuration.");
      } finally {
        _.current(C) && (r.value = !1);
      }
    }
    function pe() {
      z.value = {}, V.value = !0, h.value && (p.value = Se(h.value.declaration)), O.value = {}, a.value = null, o.value = "";
    }
    function fe(H, m) {
      const i = O.value[H] ?? [];
      i.includes(m) || (O.value = { ...O.value, [H]: [...i, m] });
    }
    return (H, m) => (s(), v("div", {
      class: ve(["pim-builder", { embedded: t.embedded }])
    }, [
      t.embedded ? (s(), v("div", Bs, [
        e("h2", null, x(t.title || "Catalog"), 1),
        d(l(ae), {
          severity: "secondary",
          value: "Generation " + (h.value?.schema_generation ?? "…")
        }, null, 8, ["value"]),
        e("div", Ms, [
          ne(H.$slots, "actions", {
            access: h.value?.access
          }),
          d(Ke, {
            access: h.value?.access,
            "apply-label": y.value === "layout" ? "Apply layout" : "Apply",
            dirty: P.value,
            busy: r.value,
            valid: V.value,
            reviewed: !!a.value,
            "can-apply": A.value,
            onDiscard: pe,
            onReview: ye,
            onApply: _e
          }, null, 8, ["access", "apply-label", "dirty", "busy", "valid", "reviewed", "can-apply"])
        ])
      ])) : (s(), T(rt, {
        key: 1,
        title: t.title || "Catalog",
        subtitle: "Settings · generation " + (h.value?.schema_generation ?? "…"),
        icon: "tabler:settings",
        "back-label": t.backLabel,
        onBack: m[0] || (m[0] = (i) => c("back"))
      }, {
        default: g(() => [
          ne(H.$slots, "actions", {
            access: h.value?.access
          }),
          d(Ke, {
            access: h.value?.access,
            "apply-label": y.value === "layout" ? "Apply layout" : "Apply",
            dirty: P.value,
            busy: r.value,
            valid: V.value,
            reviewed: !!a.value,
            "can-apply": A.value,
            onDiscard: pe,
            onReview: ye,
            onApply: _e
          }, null, 8, ["access", "apply-label", "dirty", "busy", "valid", "reviewed", "can-apply"])
        ]),
        _: 3
      }, 8, ["title", "subtitle", "back-label"])),
      d(l(rl), {
        value: y.value,
        "onUpdate:value": m[1] || (m[1] = (i) => y.value = i),
        class: "pim-section-tabs"
      }, {
        default: g(() => [
          d(l(cl), { "aria-label": "Schema sections" }, {
            default: g(() => [
              (s(), v(K, null, J(u, (i) => d(l(ml), {
                key: i.id,
                value: i.id
              }, {
                default: g(() => [
                  R(x(i.title), 1)
                ]),
                _: 2
              }, 1032, ["value"])), 64))
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["value"]),
      e("div", Ks, [
        e("div", Hs, [
          b.value ? (s(), T(l(ue), {
            key: 0,
            severity: "error",
            role: "alert"
          }, {
            default: g(() => [
              R(x(b.value), 1)
            ]),
            _: 1
          })) : I("", !0),
          o.value ? (s(), T(l(ue), {
            key: 1,
            severity: "success"
          }, {
            default: g(() => [
              R(x(o.value), 1)
            ]),
            _: 1
          })) : I("", !0),
          B.value && (!h.value || !w.value) ? (s(), v("div", Fs, "Loading…")) : (!h.value || !w.value) && b.value ? (s(), T(l(E), {
            key: 3,
            onClick: m[2] || (m[2] = (i) => U()),
            severity: "secondary",
            outlined: ""
          }, {
            default: g(() => [...m[5] || (m[5] = [
              R("Retry", -1)
            ])]),
            _: 1
          })) : h.value && w.value && y.value === "history" ? (s(), T(st, {
            key: 4,
            "catalog-id": t.catalogId
          }, null, 8, ["catalog-id"])) : h.value && w.value ? (s(), v("fieldset", {
            key: 5,
            class: "pim-editor-surface",
            disabled: r.value || !h.value.access.admin,
            inert: r.value || !h.value.access.admin
          }, [
            X.value && y.value === "fields" ? (s(), T(l(ue), {
              key: 0,
              severity: "info"
            }, {
              default: g(() => [...m[6] || (m[6] = [
                R("Define its schema. Add a field group to start defining fields.", -1)
              ])]),
              _: 1
            })) : I("", !0),
            y.value === "fields" ? (s(), T(aa, {
              key: 1,
              draft: p.value,
              schema: h.value,
              options: w.value,
              onRemove: fe
            }, null, 8, ["draft", "schema", "options"])) : y.value === "layout" ? (s(), T(El, {
              key: 2,
              draft: p.value,
              schema: h.value
            }, null, 8, ["draft", "schema"])) : y.value === "dimensions" ? (s(), T(ca, {
              key: 3,
              draft: p.value,
              schema: h.value,
              onRemove: fe
            }, null, 8, ["draft", "schema"])) : y.value === "vocabularies" ? (s(), T(Ia, {
              key: 4,
              "catalog-id": t.catalogId,
              draft: p.value,
              schema: h.value,
              onRemove: fe
            }, null, 8, ["catalog-id", "draft", "schema"])) : y.value === "families" ? (s(), T(Qa, {
              key: 5,
              draft: p.value,
              schema: h.value,
              onRemove: fe
            }, null, 8, ["draft", "schema"])) : y.value === "channels" ? (s(), T(gs, {
              key: 6,
              "catalog-id": t.catalogId,
              draft: p.value,
              schema: h.value,
              onRemove: fe
            }, null, 8, ["catalog-id", "draft", "schema"])) : y.value === "plugins" ? (s(), T(Us, {
              key: 7,
              draft: p.value,
              schema: h.value,
              options: w.value,
              "plugin-configs": z.value,
              onConfigure: Ie,
              onRemove: fe
            }, null, 8, ["draft", "schema", "options", "plugin-configs"])) : y.value === "policy" ? (s(), T(Ns, {
              key: 8,
              "catalog-id": t.catalogId,
              draft: p.value
            }, null, 8, ["catalog-id", "draft"])) : y.value === "declaration" ? (s(), T(Es, {
              key: 9,
              draft: p.value,
              onReplace: m[3] || (m[3] = (i) => p.value = i),
              onValidity: m[4] || (m[4] = (i) => {
                V.value = i, a.value = null;
              })
            }, null, 8, ["draft"])) : I("", !0)
          ], 8, Js)) : I("", !0),
          a.value ? (s(), v("div", Ws, [
            e("div", Gs, [
              d(l(M), { icon: "tabler:checklist" }),
              m[7] || (m[7] = e("h3", null, "Review", -1)),
              d(l(ae), {
                class: "kx-tag-sm",
                severity: a.value.class === "refused" ? "danger" : a.value.class === "semantic" ? "warn" : "info"
              }, {
                default: g(() => [
                  R(x(a.value.class), 1)
                ]),
                _: 1
              }, 8, ["severity"])
            ]),
            e("div", Ys, [
              a.value.class === "unchanged" ? (s(), v("p", Zs, "Nothing would change.")) : a.value.class === "cosmetic" ? (s(), v("p", Qs, "Labels, order, widths or choices only; no product is touched.")) : a.value.class === "additive" ? (s(), v("p", Xs, "New fields or options; existing values stay as they are.")) : a.value.class === "semantic" ? (s(), v("p", en, "Resolved values or readiness change; the catalog rebuilds its rows after apply.")) : (s(), T(l(ue), {
                key: 4,
                severity: "error"
              }, {
                default: g(() => [
                  m[8] || (m[8] = R("Refused: the draft cannot be compiled as it stands.", -1)),
                  a.value.migration ? (s(), v("span", ln, x(a.value.migration), 1)) : I("", !0)
                ]),
                _: 1
              })),
              a.value.changes.length || a.value.refused.length ? (s(), v("ul", tn, [
                (s(!0), v(K, null, J([...a.value.refused, ...a.value.changes], (i, j) => (s(), v("li", { key: j }, [
                  d(l(ae), {
                    class: "kx-tag-sm small",
                    severity: i.class === "refused" ? "danger" : i.class === "semantic" ? "warn" : "info"
                  }, {
                    default: g(() => [
                      R(x(i.class), 1)
                    ]),
                    _: 2
                  }, 1032, ["severity"]),
                  e("span", an, x(i.code), 1),
                  e("span", sn, x(i.what), 1)
                ]))), 128))
              ])) : I("", !0)
            ])
          ])) : I("", !0)
        ])
      ])
    ], 2));
  }
}), on = /* @__PURE__ */ Z({
  __name: "SettingsApp",
  setup(t) {
    const k = el(), n = ll(), c = L(""), u = F(() => k.value.catalogId ?? ""), y = Ae();
    async function h() {
      const w = y.begin(), p = u.value;
      try {
        const O = await te.catalogSummary(p);
        y.current(w) && (c.value = O?.title || "Untitled catalog");
      } catch {
        y.current(w) && (c.value = "Untitled catalog");
      }
    }
    return oe(u, () => {
      c.value = "", h();
    }), ze(h), Ve(() => {
      y.begin();
    }), (w, p) => u.value ? (s(), T(nn, {
      key: u.value,
      "catalog-id": u.value,
      title: c.value || "Catalog",
      embedded: l(k).embedded,
      "back-label": l(k).embedded ? void 0 : "Back to catalog settings",
      onBack: p[0] || (p[0] = (O) => l(n)("navigate", { route: "" })),
      onDirtyChanged: p[1] || (p[1] = (O) => l(n)("dirty-changed", { dirty: O }))
    }, {
      actions: g(({ access: O }) => [
        O?.admin ? (s(), T(kl, {
          key: 0,
          "catalog-id": u.value,
          title: c.value || "Catalog"
        }, null, 8, ["catalog-id", "title"])) : I("", !0)
      ]),
      _: 1
    }, 8, ["catalog-id", "title", "embedded", "back-label"])) : I("", !0);
  }
});
class dn extends tl {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "catalog-id": { type: "string", default: "" }, embedded: { type: "boolean", default: !1 } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: al
    };
  }
  static get vueConfig() {
    return { rootComponent: on, plugins: [sl] };
  }
}
vl(import.meta.url, dn);
