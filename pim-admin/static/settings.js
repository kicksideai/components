import { e as ll, a as dl, u as Fe, r as qe, p as se, _ as rl, b as we, g as ul, c as cl, d as ml, W as pl, s as fl, P as vl } from "./styles-4p9J22Mw.js";
import { defineComponent as le, ref as B, openBlock as a, createElementBlock as m, Fragment as H, createVNode as p, unref as t, withCtx as g, createTextVNode as N, createCommentVNode as I, createBlock as q, toDisplayString as V, computed as F, createElementVNode as e, renderList as Z, withModifiers as ie, normalizeStyle as ze, normalizeClass as ge, useId as Ce, watch as ue, onUnmounted as Ie, resolveDynamicComponent as bl, renderSlot as ne, withKeys as He, provide as yl, inject as gl, useModel as hl, mergeModels as Ye, onMounted as We, toRaw as kl, nextTick as Le } from "vue";
import G from "primevue/button";
import pe from "primevue/message";
import { Icon as Y } from "@iconify/vue";
import te from "primevue/tag";
import _l from "primevue/tabs";
import $l from "primevue/tablist";
import wl from "primevue/tab";
import Je from "primevue/selectbutton";
import { on as tl, host as xl, loadByTagName as Cl, define as Vl } from "@wippy-fe/proxy";
import Ue from "primevue/inputtext";
import Ul from "primevue/multiselect";
import Oe from "primevue/toggleswitch";
import ce from "primevue/select";
import Sl from "primevue/inputnumber";
import Al from "primevue/textarea";
const Ol = ["config"], Il = /* @__PURE__ */ le({
  __name: "CatalogShare",
  props: {
    catalogId: {},
    title: {}
  },
  setup(l) {
    const _ = l, s = B(!1), d = B(!1), c = B("");
    async function v() {
      d.value = !0, c.value = "", await ll("kickside-share") ? s.value = !0 : c.value = "Could not open sharing. Try Share again.", d.value = !1;
    }
    return (f, b) => (a(), m(H, null, [
      p(t(G), {
        type: "button",
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: d.value,
        onClick: v
      }, {
        default: g(() => [...b[1] || (b[1] = [
          N("Share", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      s.value ? (a(), m("kickside-share", {
        key: 0,
        config: JSON.stringify({ resource_id: _.catalogId, title: _.title, access_url: `/api/v1/component-access/grants/${encodeURIComponent(_.catalogId)}`, share_url: `/api/v1/component-access/share/${encodeURIComponent(_.catalogId)}` }),
        onClose: b[0] || (b[0] = (r) => s.value = !1)
      }, null, 40, Ol)) : I("", !0),
      c.value ? (a(), q(t(pe), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: g(() => [
          N(V(c.value), 1)
        ]),
        _: 1
      })) : I("", !0)
    ], 64));
  }
});
function Tl(l, _, s = {}) {
  const d = JSON.stringify(l), c = JSON.stringify(s);
  return {
    declaration: JSON.parse(d),
    generation: _,
    pluginConfigs: JSON.parse(c),
    matches: (v, f, b = {}) => _ === f && d === JSON.stringify(v) && c === JSON.stringify(b)
  };
}
function Ze(l, _) {
  const s = {};
  for (const [d, c] of Object.entries(_)) {
    const v = c.filter((f) => d === "plugins" ? !l.plugins?.some((b) => b.use === f) : d === "scopes" ? !l.scopes?.includes(f) : d === "attributes" ? !l.aspects?.some((b) => b.attributes?.some((r) => b.namespace + "." + r.code === f)) : d === "aspects" ? !l.aspects?.some((b) => b.namespace === f) : d === "dimensions" ? !l.dimensions?.some((b) => b.name === f) : d === "vocabularies" || d === "families" ? !l[d]?.some((b) => b.code === f) : !l[d]?.some((b) => b.id === f));
    v.length && (s[d] = v);
  }
  return s;
}
const Qe = (l) => !!l && typeof l == "object" && !Array.isArray(l), ee = ["string"], al = { "*": "string" }, jl = { id: "number", code: "string!", type: "string!", scope: ee, cardinality: "string", index: "string", index_contexts: [al], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, Rl = {
  dimensions: [{ name: "string!", members: ee, fallback: { "*": ee } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: ee }, attributes: [jl] }],
  families: [{ code: "string!", aspects: ee, variation: [{ axes: ee, own: ee }], requirements: [{ id: "string!", context: al, require: ee, authored: ee }], checks: [{ check: "string!", reads: ee, cost: "string", config: "object", enforce: "string" }] }],
  sources: [{ id: "string!", ordering: "string", writes: ee, principals: ee, audit: "boolean" }],
  channels: [{ id: "string!", requirements: ee, families: ee }],
  plugins: [{ use: "string!", schema: "json" }],
  scopes: ee,
  policy: { "*": "policy" },
  remove: { dimensions: ee, vocabularies: ee, aspects: ee, families: ee, sources: ee, channels: ee, attributes: ee, scopes: ee, plugins: ee }
};
function Be(l, _, s) {
  if (typeof _ == "string") {
    const d = _.replace("!", "");
    if (!(d === "json" || (d === "object" ? Qe(l) : d === "policy" ? l === !1 || typeof l == "string" || typeof l == "number" : typeof l === d)) || _.endsWith("!") && (typeof l != "string" || !l.trim())) throw new Error(`${s} has an invalid ${d} value.`);
  } else if (Array.isArray(_)) {
    if (!Array.isArray(l)) throw new Error(`${s} must be an array.`);
    l.forEach((d, c) => Be(d, _[0], `${s}[${c}]`));
  } else {
    if (!Qe(l)) throw new Error(`${s} must be an object.`);
    for (const [d, c] of Object.entries(_)) if (typeof c == "string" && c.endsWith("!") && l[d] === void 0) throw new Error(`${s}.${d} is required.`);
    for (const [d, c] of Object.entries(l)) {
      const v = _[d] ?? _["*"];
      if (!v) throw new Error(`${s}.${d} is not an editor field.`);
      Be(c, v, `${s}.${d}`);
    }
  }
}
function ql(l) {
  const _ = JSON.parse(l);
  Be(_, Rl, "Declaration");
  const s = _;
  for (const d of s.dimensions ?? []) d.members ??= [];
  return s;
}
function je(l) {
  return JSON.parse(JSON.stringify(l));
}
const Dl = /^[a-z][a-z0-9_]*$/;
function xe(l, _, s) {
  s.length ? l[_] = s : delete l[_];
}
function he(l, _, s) {
  if (s < 0 || s >= l.length || _ === s) return;
  const [d] = l.splice(_, 1);
  l.splice(s, 0, d);
}
function oe(l, _) {
  return !l || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(l) ? _ : l;
}
function Ae(l) {
  return l ? oe(l.title, "Field type") : "Unknown type";
}
async function sl(l, _) {
  const s = [...new Set(_)].map((c) => ({ type: "user", id: c }));
  if (!s.length) return {};
  const d = await dl(`/api/v1/pim-admin/catalogs/${encodeURIComponent(l)}/principal_labels`, { refs: s }, "People");
  return Object.fromEntries((d.principals ?? []).map((c) => [c.id, oe(c.label, "Person")]));
}
const Re = [
  { value: "quarter", label: "¼", span: 3 },
  { value: "third", label: "⅓", span: 4 },
  { value: "half", label: "½", span: 6 },
  { value: "full", label: "1", span: 12 }
];
function Me(l, _, s) {
  return s.width ?? l.attributes[_ + "." + s.code]?.width ?? "half";
}
const Pl = (l) => new Date(l).toLocaleString();
function Ee(l) {
  const _ = Math.abs(l.m).toString(), s = l.m < 0 ? "-" : "";
  if (l.e >= 0) return s + _ + "0".repeat(l.e);
  const d = -l.e, c = _.padStart(d + 1, "0");
  return s + c.slice(0, c.length - d) + "." + c.slice(c.length - d);
}
function K(l) {
  const s = (l.includes(".") ? l.slice(l.indexOf(".") + 1) : l).replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return s ? s[0].toUpperCase() + s.slice(1) : l;
}
function Se(l) {
  return l.labels.en ?? Object.values(l.labels)[0] ?? l.code;
}
function Xe(l, _) {
  if (l == null) return "";
  const s = (d) => {
    if (d == null) return "";
    if (typeof d == "object" && "ref" in d) {
      const c = d;
      if (c.ref[0] === "term") {
        const v = c.ref[1].slice(c.ref[1].indexOf(":") + 1), f = c.ref[1].slice(0, c.ref[1].indexOf(":")), b = _?.[f]?.find((r) => r.code === v);
        return b ? Se(b) : v;
      }
      return "Linked " + K(c.ref[0]).toLocaleLowerCase();
    }
    if (typeof d == "object" && "v" in d) {
      const c = d;
      return Ee(c.v) + " " + c.u;
    }
    return typeof d == "object" && "m" in d ? Ee(d) : typeof d == "boolean" ? d ? "Yes" : "No" : typeof d == "object" ? JSON.stringify(d) : oe(String(d), "Linked record");
  };
  return Array.isArray(l) ? l.map(s).join(", ") : s(l);
}
function Nl(l, _, s) {
  const d = Xe(_), c = Xe(s);
  return !c && d ? `${l} cleared (was ${d})` : d ? `${l}: ${d} → ${c}` : `${l} set to ${c}`;
}
const Ll = { class: "pim-table form pim-layout" }, zl = {
  key: 0,
  class: "kx-empty"
}, Bl = { class: "pim-aspect-head" }, Ml = ["draggable", "onDragstart", "onDragover", "onDrop"], El = { class: "pim-lcard-top" }, Fl = {
  class: "pim-grip",
  "aria-hidden": "true"
}, Hl = { class: "pim-lcard-name" }, Wl = { class: "pim-lcard-type" }, Jl = { class: "pim-lcard-move" }, Kl = { class: "pim-aspect-head" }, Gl = { class: "pim-canvas" }, Yl = { class: "pim-lcard-top" }, Zl = { class: "pim-lcard-name" }, Ql = { class: "pim-lcard-type" }, Xl = /* @__PURE__ */ le({
  __name: "LayoutEditor",
  props: {
    draft: {},
    schema: {},
    types: {}
  },
  setup(l) {
    const _ = l, s = F(() => _.draft?.aspects ?? []), d = F(() => new Map(_.types.map((w) => [w.id, Ae(w)]))), c = F(() => {
      if (!_.schema) return [];
      const w = new Set((_.draft?.aspects ?? []).map((i) => i.namespace)), x = /* @__PURE__ */ new Map();
      for (const [i, o] of Object.entries(_.schema.attributes)) {
        const n = i.split(".")[0];
        w.has(n) || !o.plugin || (x.has(n) || x.set(n, { aspect: n, plugin: o.plugin, codes: [] }), x.get(n).codes.push(i));
      }
      return [...x.values()];
    });
    function v(w, x) {
      return Re.find((i) => i.value === Me(_.schema, w, x))?.span ?? 6;
    }
    const f = B(null), b = B(null);
    function r(w, x, i) {
      f.value = { ns: w, index: x }, i.dataTransfer?.setData("text/plain", w + ":" + x), i.dataTransfer && (i.dataTransfer.effectAllowed = "move");
    }
    function T(w, x, i) {
      !f.value || f.value.ns !== w || (i.preventDefault(), b.value = { ns: w, index: x });
    }
    function D(w, x) {
      f.value && f.value.ns === w.namespace && he(w.attributes ?? [], f.value.index, x), f.value = null, b.value = null;
    }
    function z() {
      f.value = null, b.value = null;
    }
    return (w, x) => (a(), m("div", Ll, [
      x[3] || (x[3] = e("p", { class: "pim-layout-help muted" }, "Arrange fields within each group and choose their widths. Review changes before applying the layout.", -1)),
      s.value.length === 0 ? (a(), m("div", zl, "This catalog has no field groups yet. Add a field group in Fields.")) : I("", !0),
      (a(!0), m(H, null, Z(s.value, (i) => (a(), m("section", {
        key: i.namespace,
        class: "pim-aspect"
      }, [
        e("header", Bl, [
          e("h3", null, V(t(K)(i.namespace)), 1),
          x[1] || (x[1] = e("span", { class: "muted small" }, "drag a field, or use its arrows", -1))
        ]),
        e("div", {
          class: "pim-canvas",
          onDragover: x[0] || (x[0] = ie(() => {
          }, ["prevent"]))
        }, [
          (a(!0), m(H, null, Z(i.attributes ?? [], (o, n) => (a(), m("div", {
            key: o.code,
            class: ge(["pim-lcard", { dragging: f.value?.ns === i.namespace && f.value?.index === n, over: b.value?.ns === i.namespace && b.value?.index === n }]),
            style: ze({ gridColumn: "span " + v(i.namespace, o) }),
            draggable: l.schema.access.admin,
            onDragstart: (y) => r(i.namespace, n, y),
            onDragover: (y) => T(i.namespace, n, y),
            onDrop: ie((y) => D(i, n), ["prevent"]),
            onDragend: z
          }, [
            e("div", El, [
              e("span", Fl, [
                p(t(Y), { icon: "tabler:grip-vertical" })
              ]),
              e("span", Hl, V(t(K)(o.code)), 1),
              e("span", Wl, V(d.value.get(o.type) ?? t(Ae)(void 0)), 1),
              e("span", Jl, [
                p(t(G), {
                  type: "button",
                  disabled: n === 0,
                  "aria-label": "Move " + t(K)(o.code) + " earlier",
                  onClick: (y) => t(he)(i.attributes ?? [], n, n - 1),
                  class: "arrow",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: g(() => [
                    p(t(Y), { icon: "tabler:arrow-left" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                p(t(G), {
                  type: "button",
                  disabled: n === (i.attributes ?? []).length - 1,
                  "aria-label": "Move " + t(K)(o.code) + " later",
                  onClick: (y) => t(he)(i.attributes ?? [], n, n + 1),
                  class: "arrow",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: g(() => [
                    p(t(Y), { icon: "tabler:arrow-right" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ])
            ]),
            p(t(Je), {
              "model-value": t(Me)(l.schema, i.namespace, o),
              options: t(Re),
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Width of " + t(K)(o.code),
              "onUpdate:modelValue": (y) => o.width = y
            }, null, 8, ["model-value", "options", "aria-label", "onUpdate:modelValue"])
          ], 46, Ml))), 128))
        ], 32)
      ]))), 128)),
      (a(!0), m(H, null, Z(c.value, (i) => (a(), m("section", {
        key: i.aspect,
        class: "pim-aspect"
      }, [
        e("header", Kl, [
          e("h3", null, V(t(K)(i.aspect)), 1),
          x[2] || (x[2] = e("span", { class: "muted small" }, "Provided by a plugin", -1))
        ]),
        e("div", Gl, [
          (a(!0), m(H, null, Z(i.codes, (o) => (a(), m("div", {
            key: o,
            class: "pim-lcard fixed",
            style: ze({ gridColumn: "span " + (t(Re).find((n) => n.value === l.schema.attributes[o].width)?.span ?? 6) })
          }, [
            e("div", Yl, [
              e("span", Zl, V(t(K)(o)), 1),
              e("span", Ql, V(d.value.get(l.schema.attributes[o].type) ?? t(Ae)(void 0)), 1)
            ])
          ], 4))), 128))
        ])
      ]))), 128))
    ]));
  }
}), et = {
  class: "pim-history",
  "aria-label": "Catalog history"
}, lt = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, tt = { class: "pim-table pim-responsive-table" }, at = ["id"], st = ["aria-labelledby"], nt = { class: "muted small" }, it = ["datetime"], ot = { class: "small" }, dt = {
  key: 0,
  class: "muted"
}, rt = { class: "mono small" }, ut = {
  key: 0,
  class: "muted"
}, ct = ["aria-labelledby"], mt = { class: "pim-stacked-meta muted small" }, pt = ["datetime"], ft = {
  key: 1,
  class: "kx-empty"
}, vt = { class: "pim-table-foot" }, bt = /* @__PURE__ */ le({
  __name: "HistoryPanel",
  props: {
    catalogId: {}
  },
  setup(l) {
    const _ = l, s = B([]), d = B({}), c = B(), v = B(!1), f = B(""), b = qe(), r = Ce(), T = F(() => s.value.map((i) => ({
      key: `${i.seq}:${i.n}`,
      at: i.at,
      date: Pl(i.at),
      actor: d.value[i.actor] ?? oe(i.actor, "Person"),
      source: i.source,
      product: z(i),
      context: i.ctx,
      change: w(i)
    })));
    async function D(i = !1) {
      const o = b.begin();
      v.value = !0, f.value = "";
      try {
        const n = await se.history(_.catalogId, { limit: 50, before: i ? c.value : void 0 });
        if (!b.current(o)) return;
        s.value = i ? [...s.value, ...n.entries] : n.entries, c.value = n.next;
        try {
          const y = await sl(_.catalogId, n.entries.map((O) => O.actor));
          b.current(o) && (d.value = { ...d.value, ...y });
        } catch {
        }
      } catch (n) {
        if (!b.current(o)) return;
        f.value = n instanceof Error ? n.message : "Could not load the history.";
      } finally {
        b.current(o) && (v.value = !1);
      }
    }
    function z(i) {
      return i.sku ? i.sku : i.subject.startsWith("p:") ? "purged product" : i.subject.startsWith("t:") ? i.subject.slice(2) : i.subject.startsWith("r:") ? "Release" : oe(i.subject, "Catalog");
    }
    function w(i) {
      if (i.attribute)
        return Nl(K(i.attribute), i.before, i.after);
      switch (i.kind) {
        case "schema":
          return "Schema generation " + String(i.after?.generation ?? "");
        case "term": {
          const o = i.after ?? {}, n = o.labels?.en ?? Object.values(o.labels ?? {})[0];
          return o.retired ? "Term retired" : n ? `Term labelled "${n}"` + (o.parent ? ` under ${o.parent}` : "") : "Term changed";
        }
        case "created": {
          const o = i.after ?? {};
          return `Created as ${K(o.family ?? "product")}` + (o.level ? ` at level ${o.level}` : "");
        }
        case "released": {
          const o = i.after ?? {};
          return `Released v${o.version ?? ""} to ${(o.channels ?? []).join(", ")}`;
        }
        case "withdrawn":
          return `Withdrawn from ${((i.after ?? {}).channels ?? []).join(", ")}`;
        case "status":
          return `Status ${String(i.before ?? "")} → ${String(i.after ?? "")}`;
        case "moved":
          return "Moved under another parent";
        default:
          return K(i.kind);
      }
    }
    let x = () => {
    };
    return ue(() => _.catalogId, () => {
      x(), b.begin(), s.value = [], d.value = {}, c.value = void 0, f.value = "", x = tl(`component.${_.catalogId}`, () => {
        D();
      });
    }, { immediate: !0 }), ue(() => _.catalogId, () => {
      D();
    }), Fe(() => D()), Ie(() => {
      x(), b.begin();
    }), (i, o) => (a(), m("section", et, [
      f.value ? (a(), q(t(pe), {
        key: 0,
        severity: "error",
        role: "alert"
      }, {
        default: g(() => [
          N(V(f.value) + " ", 1),
          p(t(G), {
            severity: "secondary",
            outlined: "",
            disabled: v.value,
            onClick: o[0] || (o[0] = (n) => D())
          }, {
            default: g(() => [...o[2] || (o[2] = [
              N("Retry", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ]),
        _: 1
      })) : I("", !0),
      v.value ? (a(), m("div", lt, "Loading history…")) : I("", !0),
      e("div", tt, [
        e("p", {
          id: t(r),
          class: "pim-history-caption muted small"
        }, "Catalog changes, newest first", 8, at),
        T.value.length ? (a(), m(H, { key: 0 }, [
          e("table", {
            class: "pim-grid",
            "aria-labelledby": t(r)
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
              (a(!0), m(H, null, Z(T.value, (n) => (a(), m("tr", {
                key: n.key
              }, [
                e("td", nt, [
                  e("time", {
                    datetime: n.at
                  }, V(n.date), 9, it)
                ]),
                e("td", ot, [
                  N(V(n.actor), 1),
                  n.source ? (a(), m("span", dt, " via " + V(n.source), 1)) : I("", !0)
                ]),
                e("td", rt, [
                  N(V(n.product), 1),
                  n.context ? (a(), m("span", ut, " · " + V(n.context), 1)) : I("", !0)
                ]),
                e("td", null, V(n.change), 1)
              ]))), 128))
            ])
          ], 8, st),
          e("ol", {
            role: "list",
            class: "pim-stacked-list",
            "aria-labelledby": t(r)
          }, [
            (a(!0), m(H, null, Z(T.value, (n) => (a(), m("li", {
              key: n.key,
              class: "pim-stacked-row"
            }, [
              e("div", null, V(n.change), 1),
              e("div", mt, [
                e("span", null, [
                  e("span", null, V(n.actor), 1),
                  n.source ? (a(), m(H, { key: 0 }, [
                    N(" via " + V(n.source), 1)
                  ], 64)) : I("", !0)
                ]),
                e("time", {
                  datetime: n.at
                }, V(n.date), 9, pt),
                e("span", null, [
                  N(V(n.product), 1),
                  n.context ? (a(), m(H, { key: 0 }, [
                    N(" · " + V(n.context), 1)
                  ], 64)) : I("", !0)
                ])
              ])
            ]))), 128))
          ], 8, ct)
        ], 64)) : !v.value && !f.value ? (a(), m("div", ft, "Nothing recorded yet.")) : I("", !0),
        e("div", vt, [
          e("span", null, V(T.value.length) + " change" + V(T.value.length === 1 ? "" : "s") + " shown", 1),
          c.value ? (a(), q(t(G), {
            key: 0,
            type: "button",
            disabled: v.value,
            onClick: o[1] || (o[1] = (n) => D(!0)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: g(() => [
              p(t(Y), {
                icon: "tabler:adjustments",
                "aria-hidden": "true"
              }),
              o[4] || (o[4] = N(" Load older", -1))
            ]),
            _: 1
          }, 8, ["disabled"])) : I("", !0)
        ])
      ])
    ]));
  }
}), el = /* @__PURE__ */ le({
  __name: "SettingsActions",
  props: {
    access: {},
    dirty: { type: Boolean },
    busy: { type: Boolean },
    valid: { type: Boolean },
    reviewed: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(l, { emit: _ }) {
    const s = _;
    return (d, c) => l.access?.admin ? (a(), m(H, { key: 0 }, [
      l.dirty ? (a(), q(t(te), {
        key: 0,
        severity: "warn",
        value: "Unsaved changes"
      })) : I("", !0),
      p(t(G), {
        severity: "secondary",
        outlined: "",
        disabled: !l.dirty || l.busy,
        onClick: c[0] || (c[0] = (v) => s("discard"))
      }, {
        default: g(() => [
          p(t(Y), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          }),
          c[2] || (c[2] = N(" Discard", -1))
        ]),
        _: 1
      }, 8, ["disabled"]),
      l.reviewed ? I("", !0) : (a(), q(t(G), {
        key: 1,
        disabled: !l.dirty || l.busy || !l.valid,
        loading: l.busy,
        onClick: c[1] || (c[1] = (v) => s("review"))
      }, {
        default: g(() => [...c[3] || (c[3] = [
          N("Review changes", -1)
        ])]),
        _: 1
      }, 8, ["disabled", "loading"]))
    ], 64)) : I("", !0);
  }
}), yt = { class: "kx-head-icon" }, gt = { class: "kx-head-text" }, ht = { class: "pim-title-line" }, kt = ["title"], _t = { class: "kx-head-actions" }, $t = /* @__PURE__ */ le({
  __name: "PageHead",
  props: {
    title: {},
    subtitle: {},
    icon: {},
    backLabel: {},
    pane: { type: Boolean }
  },
  emits: ["back"],
  setup(l, { emit: _ }) {
    const s = _;
    return (d, c) => (a(), m("header", {
      class: ge(["kx-head", { "pim-panel-head": l.pane }])
    }, [
      l.backLabel ? (a(), q(t(G), {
        key: 0,
        type: "button",
        "aria-label": l.backLabel,
        onClick: c[0] || (c[0] = (v) => s("back")),
        text: "",
        severity: "secondary",
        size: "small"
      }, {
        default: g(() => [
          p(t(Y), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label"])) : I("", !0),
      e("div", yt, [
        p(t(Y), {
          icon: l.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      e("div", gt, [
        e("div", ht, [
          (a(), q(bl(l.pane ? "h2" : "h1"), { class: "kx-title" }, {
            default: g(() => [
              N(V(l.title), 1)
            ]),
            _: 1
          })),
          ne(d.$slots, "meta")
        ]),
        e("p", {
          class: "kx-head-sub",
          title: l.subtitle
        }, V(l.subtitle), 9, kt)
      ]),
      e("div", _t, [
        ne(d.$slots, "default")
      ])
    ], 2));
  }
}), wt = { class: "row pim-add-row" }, xt = ["id"], ke = /* @__PURE__ */ le({
  __name: "AddSchemaCode",
  props: {
    label: {},
    action: {},
    existing: {}
  },
  emits: ["add"],
  setup(l, { emit: _ }) {
    const s = l, d = _, c = B(""), v = Ce(), f = F(() => c.value.trim()), b = F(() => f.value ? s.existing?.includes(f.value) ? "This code is already in use." : Dl.test(f.value) ? "" : "Start with a lowercase letter and use only lowercase letters, numbers or underscores." : ""), r = F(() => !!f.value && !b.value);
    function T() {
      r.value && (d("add", f.value), c.value = "");
    }
    return (D, z) => (a(), m("div", wt, [
      p(t(Ue), {
        modelValue: c.value,
        "onUpdate:modelValue": z[0] || (z[0] = (w) => c.value = w),
        type: "text",
        placeholder: l.label,
        "aria-label": l.label,
        invalid: !!b.value,
        "aria-describedby": b.value ? t(v) : void 0,
        class: "mono",
        onKeydown: He(ie(T, ["prevent"]), ["enter"])
      }, null, 8, ["modelValue", "placeholder", "aria-label", "invalid", "aria-describedby", "onKeydown"]),
      p(t(G), {
        type: "button",
        disabled: !r.value,
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: T
      }, {
        default: g(() => [
          p(t(Y), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          N(" " + V(l.action), 1)
        ]),
        _: 1
      }, 8, ["disabled"]),
      ne(D.$slots, "default"),
      b.value ? (a(), m("p", {
        key: 0,
        id: t(v),
        role: "status",
        class: "pim-add-code-error small"
      }, V(b.value), 9, xt)) : I("", !0)
    ]));
  }
}), nl = Symbol("definitionColumns"), Ct = { code: "Code", kind: "Kind", details: "Details", usage: "Used by" }, Vt = {
  code: "minmax(120px, 1fr)",
  kind: "140px",
  details: "minmax(120px, 1.2fr)",
  usage: "120px"
}, Ut = {
  class: "pim-definition-scroll",
  tabindex: "0",
  "aria-label": "Definitions"
}, St = { class: "pim-definition-grid" }, At = {
  key: 0,
  class: "pim-definition-columns",
  "aria-hidden": "true"
}, _e = /* @__PURE__ */ le({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: { default: () => ["code"] }
  },
  setup(l) {
    const _ = l;
    yl(nl, F(() => _.columns));
    const s = F(() => ["48px", "minmax(160px, 1.4fr)", ..._.columns.map((d) => Vt[d]), "80px"].join(" "));
    return (d, c) => (a(), m("section", {
      class: "form pim-definition-list",
      style: ze({ "--pim-definition-columns": s.value })
    }, [
      ne(d.$slots, "head"),
      e("div", Ut, [
        e("div", St, [
          l.count > 3 ? (a(), m("div", At, [
            c[0] || (c[0] = e("span", null, null, -1)),
            c[1] || (c[1] = e("span", null, "Name", -1)),
            (a(!0), m(H, null, Z(l.columns, (v) => (a(), m("span", {
              key: v,
              class: ge("pim-definition-" + v)
            }, V(t(Ct)[v]), 3))), 128)),
            c[2] || (c[2] = e("span", null, null, -1))
          ])) : I("", !0),
          ne(d.$slots, "default")
        ])
      ]),
      ne(d.$slots, "add")
    ], 4));
  }
}), Ot = { class: "pim-definition" }, It = {
  class: "pim-definition-lead",
  "data-column": "lead"
}, Tt = {
  class: "pim-row-title",
  "data-column": "name"
}, jt = { class: "pim-definition-meta" }, Rt = ["data-column"], qt = {
  key: 0,
  class: "mono"
}, Dt = {
  class: "pim-definition-actions",
  "data-column": "actions"
}, Pt = {
  key: 0,
  class: "pim-definition-body"
}, $e = /* @__PURE__ */ le({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ Ye({
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
  emits: /* @__PURE__ */ Ye(["head-keydown", "head-drop", "head-dragover"], ["update:open"]),
  setup(l, { emit: _ }) {
    const s = l, d = gl(nl, F(() => [
      ...s.code ? ["code"] : [],
      ...s.kind ? ["kind"] : []
    ])), c = hl(l, "open"), v = _;
    return (f, b) => (a(), m("section", Ot, [
      e("header", {
        class: ge(["pim-definition-head", l.headClass]),
        onKeydown: b[1] || (b[1] = (r) => v("head-keydown", r)),
        onDrop: b[2] || (b[2] = (r) => v("head-drop", r)),
        onDragover: b[3] || (b[3] = (r) => v("head-dragover", r))
      }, [
        p(rl, {
          class: ge(["pim-definition-toggle", l.toggleClass]),
          "aria-expanded": c.value,
          onClick: b[0] || (b[0] = (r) => c.value = !c.value)
        }, {
          default: g(() => [
            e("span", It, [
              ne(f.$slots, "handle"),
              p(t(Y), {
                icon: c.value ? "tabler:chevron-down" : "tabler:chevron-right",
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ]),
            e("span", Tt, V(l.title), 1),
            e("span", jt, [
              (a(!0), m(H, null, Z(t(d), (r) => (a(), m("span", {
                key: r,
                class: ge("pim-definition-" + r),
                "data-column": r
              }, [
                r === "code" && l.code ? (a(), m("code", qt, V(l.code), 1)) : r === "kind" && l.kind ? (a(), q(t(te), {
                  key: 1,
                  severity: "secondary",
                  value: l.kind
                }, null, 8, ["value"])) : r === "details" ? ne(f.$slots, "details", {}, void 0, void 0, 2) : r === "usage" ? ne(f.$slots, "usage", {}, () => [
                  N(V(l.usage), 1)
                ], void 0, 3) : I("", !0)
              ], 10, Rt))), 128))
            ])
          ]),
          _: 3
        }, 8, ["class", "aria-expanded"]),
        e("div", Dt, [
          ne(f.$slots, "actions")
        ])
      ], 34),
      c.value ? (a(), m("div", Pt, [
        ne(f.$slots, "default")
      ])) : I("", !0)
    ]));
  }
}), Nt = { class: "pim-chips pim-picker-chips" }, me = /* @__PURE__ */ le({
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
  setup(l, { emit: _ }) {
    const s = l, d = _, c = B("");
    function v(D) {
      return s.modelValue.includes(D);
    }
    function f(D) {
      s.disabled || !D || d("update:modelValue", v(D) ? s.modelValue.filter((z) => z !== D) : [...s.modelValue, D]);
    }
    function b() {
      const D = c.value.trim();
      if (!D || v(D)) {
        c.value = "";
        return;
      }
      d("update:modelValue", [...s.modelValue, D]), c.value = "";
    }
    function r(D) {
      d("update:modelValue", s.modelValue.filter((z) => z !== D));
    }
    function T(D) {
      return s.options?.find((z) => z.value === D)?.label ?? D;
    }
    return (D, z) => (a(), m("div", Nt, [
      l.options && (l.dropdown || l.options.length > 10) ? (a(), m(H, { key: 0 }, [
        (a(!0), m(H, null, Z(l.modelValue, (w) => (a(), m("span", {
          key: w,
          class: "row"
        }, [
          N(V(T(w)), 1),
          l.disabled ? I("", !0) : (a(), q(t(G), {
            key: 0,
            type: "button",
            "aria-label": "Remove " + T(w),
            onClick: (x) => r(w),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: g(() => [
              p(t(Y), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"]))
        ]))), 128)),
        l.disabled ? I("", !0) : (a(), q(t(ce), {
          key: 0,
          "model-value": null,
          placeholder: l.placeholder ?? "Add…",
          "aria-labelledby": l.labelledby,
          "aria-label": l.placeholder ?? "Add",
          "onUpdate:modelValue": z[0] || (z[0] = (w) => f(w)),
          class: "pim-chip-entry",
          options: l.options.filter((w) => !v(w.value)).map((w) => ({ value: w.value, label: w.label ?? w.value })),
          "option-label": "label",
          "option-value": "value",
          appendTo: "self"
        }, null, 8, ["placeholder", "aria-labelledby", "aria-label", "options"]))
      ], 64)) : l.options ? (a(), m(H, { key: 1 }, [
        p(t(Je), {
          "model-value": l.modelValue.filter((w) => l.options.some((x) => x.value === w)),
          options: l.options.map((w) => ({ value: w.value, label: w.label ?? w.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          disabled: l.disabled,
          "aria-labelledby": l.labelledby,
          "aria-label": l.placeholder ?? "Selected values",
          "onUpdate:modelValue": z[1] || (z[1] = (w) => d("update:modelValue", [...w, ...l.modelValue.filter((x) => !l.options.some((i) => i.value === x))]))
        }, null, 8, ["model-value", "options", "disabled", "aria-labelledby", "aria-label"]),
        (a(!0), m(H, null, Z(l.modelValue.filter((w) => !l.options.some((x) => x.value === w)), (w) => (a(), m("span", {
          key: w,
          class: "row"
        }, [
          N(V(T(w)), 1),
          l.disabled ? I("", !0) : (a(), q(t(G), {
            key: 0,
            type: "button",
            "aria-label": "Remove " + w,
            onClick: (x) => r(w),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: g(() => [
              p(t(Y), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"]))
        ]))), 128))
      ], 64)) : (a(!0), m(H, { key: 2 }, Z(l.modelValue, (w) => (a(), m("span", {
        key: w,
        class: "row"
      }, [
        N(V(w), 1),
        l.disabled ? I("", !0) : (a(), q(t(G), {
          key: 0,
          type: "button",
          "aria-label": "Remove " + w,
          onClick: (x) => r(w),
          size: "small",
          text: "",
          severity: "secondary"
        }, {
          default: g(() => [
            p(t(Y), { icon: "tabler:x" })
          ]),
          _: 1
        }, 8, ["aria-label", "onClick"]))
      ]))), 128)),
      l.free && !l.disabled ? (a(), q(t(Ue), {
        key: 3,
        modelValue: c.value,
        "onUpdate:modelValue": z[2] || (z[2] = (w) => c.value = w),
        type: "text",
        "aria-labelledby": l.labelledby,
        placeholder: l.placeholder ?? "Add…",
        onKeydown: He(ie(b, ["prevent"]), ["enter"]),
        onBlur: b,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "aria-labelledby", "placeholder", "onKeydown"])) : I("", !0)
    ]));
  }
}), Lt = ["inert"], zt = ["schema", "config"], Bt = {
  key: 1,
  class: "muted small",
  role: "status"
}, Ke = /* @__PURE__ */ le({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(l, { emit: _ }) {
    const s = l, d = _, c = B("pending");
    async function v() {
      c.value = "pending", c.value = await ll("wc-schema-form") ? "ready" : "failed";
    }
    We(v);
    function f(b) {
      const r = b.detail;
      r && typeof r == "object" && !Array.isArray(r) && d("update:modelValue", r);
    }
    return (b, r) => (a(), m("div", {
      inert: l.disabled || void 0
    }, [
      c.value === "ready" ? (a(), m("wc-schema-form", {
        key: 0,
        schema: JSON.stringify(s.schema),
        config: JSON.stringify(l.modelValue),
        onConfigChanged: f
      }, null, 40, zt)) : c.value === "pending" ? (a(), m("span", Bt, "Configuration form is loading.")) : (a(), q(t(pe), {
        key: 2,
        role: "alert",
        severity: "error"
      }, {
        default: g(() => [
          r[2] || (r[2] = N("Configuration form could not be loaded. ", -1)),
          p(t(G), {
            type: "button",
            disabled: l.disabled,
            onClick: v,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: g(() => [...r[1] || (r[1] = [
              N("Retry", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ]),
        _: 1
      })),
      p(t(G), {
        type: "button",
        disabled: l.disabled,
        onClick: r[0] || (r[0] = (T) => d("update:modelValue", {})),
        severity: "secondary",
        outlined: "",
        size: "small"
      }, {
        default: g(() => [
          p(t(Y), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          }),
          r[3] || (r[3] = N(" Reset overrides", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, Lt));
  }
}), Mt = /* @__PURE__ */ le({
  __name: "DefaultValue",
  props: {
    attribute: {},
    type: {}
  },
  emits: ["change"],
  setup(l, { emit: _ }) {
    const s = l, d = _, c = F(() => {
      const r = s.type?.form;
      let T = { type: "string" };
      return r === "bool" ? T = { type: "boolean" } : r === "int" ? T = { type: "integer" } : r === "dec" ? T = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : r === "quantity" ? T = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(s.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : r === "record" ? T = { type: "object", additionalProperties: !0 } : r === "ref" && (T = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${s.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (s.attribute.cardinality ?? "one") !== "one" && (T = { type: "array", items: T, uniqueItems: s.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...T, title: "Default value" } } };
    });
    function v(r) {
      return r && typeof r == "object" && "m" in r && "e" in r ? Ee(r) : r;
    }
    function f(r) {
      return s.type?.form === "dec" ? v(r) : s.type?.form === "quantity" && r && typeof r == "object" && "v" in r && "u" in r ? { value: v(r.v), unit: r.u } : r;
    }
    const b = F(() => s.attribute.default === void 0 ? {} : { value: Array.isArray(s.attribute.default) ? s.attribute.default.map(f) : f(s.attribute.default) });
    return (r, T) => (a(), q(Ke, {
      schema: c.value,
      "model-value": b.value,
      "onUpdate:modelValue": T[0] || (T[0] = (D) => d("change", D.value))
    }, null, 8, ["schema", "model-value"]));
  }
}), Et = { class: "pim-stack" }, Ft = { class: "pim-bsection-head" }, Ht = {
  key: 0,
  class: "mono muted small"
}, Wt = { class: "pim-source-permissions" }, Jt = ["for"], Kt = ["onDragstart"], Gt = { class: "pim-fields" }, Yt = { class: "pim-f pim-w-third" }, Zt = { class: "pim-f-label" }, Qt = ["for"], Xt = {
  key: 0,
  class: "pim-f-note"
}, ea = { class: "pim-f pim-w-third" }, la = { class: "pim-f-label" }, ta = ["id"], aa = { class: "pim-f pim-w-third" }, sa = { class: "pim-f-label" }, na = ["id"], ia = {
  key: 0,
  class: "pim-f pim-w-third"
}, oa = { class: "pim-f-label" }, da = ["id"], ra = {
  key: 1,
  class: "pim-f pim-w-third"
}, ua = { class: "pim-f-label" }, ca = ["id"], ma = { class: "pim-f pim-w-third" }, pa = { class: "pim-f-label" }, fa = ["id"], va = { class: "pim-f pim-w-third" }, ba = { class: "pim-f-label" }, ya = ["id"], ga = { class: "pim-f pim-w-half" }, ha = { class: "pim-f-label" }, ka = ["id"], _a = { class: "pim-f pim-w-half" }, $a = { class: "pim-f-label" }, wa = ["for"], xa = { class: "row" }, Ca = {
  key: 2,
  class: "pim-f pim-w-full"
}, Va = { class: "pim-f-label" }, Ua = ["id"], Sa = ["aria-labelledby"], Aa = ["id"], Oa = ["aria-labelledby"], Ia = { class: "pim-f-label" }, Ta = ["id"], ja = ["aria-labelledby"], Ra = { class: "pim-f-label" }, qa = ["id"], Da = { class: "row end" }, Pa = { class: "form" }, Na = /* @__PURE__ */ le({
  __name: "BuilderFields",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove"],
  setup(l, { emit: _ }) {
    const s = l, d = _, c = Re.map((S) => S.value), v = [{ value: "one", label: "Single value" }, { value: "list", label: "Ordered list" }, { value: "set", label: "Unique set" }], f = F(() => s.draft.aspects ?? []), b = F(() => (s.draft.dimensions ?? []).map((S) => ({ value: S.name, label: K(S.name) }))), r = F(() => (s.draft.vocabularies ?? []).map((S) => S.code)), T = F(() => (s.draft.sources ?? []).map((S) => ({ value: S.id, label: K(S.id) }))), D = F(() => [...s.options.types].sort((S, A) => S.form.localeCompare(A.form)).map((S) => ({ value: S.id, label: Ae(S) })));
    function z(S) {
      return s.options.types.find((A) => A.id === S.type);
    }
    function w(S) {
      return z(S)?.target === "term";
    }
    function x(S) {
      const A = z(S);
      return !!A && A.form === "ref" && !A.target;
    }
    function i(S, A) {
      return A.id !== void 0 && s.schema.attributes[S + "." + A.code] !== void 0;
    }
    function o(S) {
      const A = (s.draft.families ?? []).filter((U) => U.aspects?.includes(S)).length;
      return A + (A === 1 ? " family" : " families");
    }
    const n = B({}), y = Ce(), O = /* @__PURE__ */ new WeakMap();
    let M = 0;
    function W(S, A) {
      if (A.id !== void 0) return S + "." + A.id;
      const U = kl(A);
      let k = O.get(U);
      return k === void 0 && (k = ++M, O.set(U, k)), S + ".draft-" + k;
    }
    function J(S, A, U) {
      return y + "-" + W(S, A) + "-" + U;
    }
    function ae(S, A) {
      S.type = A;
      const U = z(S);
      if (U && S.index && !U.indexes.includes(S.index) && delete S.index, w(S) || delete S.vocabulary, !x(S) && S.config && "target" in S.config) {
        const { target: k, ...X } = S.config;
        S.config = Object.keys(X).length ? X : void 0, S.config || delete S.config;
      }
    }
    function R(S, A) {
      Object.keys(A).length ? S.config = A : delete S.config;
    }
    function $(S, A) {
      const U = { ...S.config ?? {} };
      A ? U.target = A : delete U.target, R(S, U);
    }
    function h(S, A) {
      A.length ? S.scope = A : delete S.scope, A.length || delete S.index_contexts;
    }
    function u(S, A, U) {
      U === void 0 || U === "" || U === !1 && A !== "default" ? delete S[A] : S[A] = U;
    }
    function j(S) {
      return S.index_contexts ?? [];
    }
    function E(S) {
      return (s.draft.dimensions ?? []).find((A) => A.name === S)?.members ?? [];
    }
    function Q(S) {
      const A = {};
      for (const k of S.scope ?? []) A[k] = E(k)[0] ?? "";
      (S.index_contexts ?? (S.index_contexts = [])).push(A);
    }
    const de = B(null);
    function De(S, A) {
      de.value?.namespace === S.namespace && he(S.attributes ?? [], de.value.index, A), de.value = null;
    }
    function re(S) {
      (s.draft.aspects ??= []).push({ namespace: S, attributes: [] });
    }
    function Pe(S) {
      const A = f.value.indexOf(S);
      A >= 0 && f.value.splice(A, 1), s.schema.declaration.aspects?.some((U) => U.namespace === S.namespace) && d("remove", "aspects", S.namespace);
    }
    function Ve(S, A) {
      const U = s.options.types.find((X) => X.id === "kickside.pim.types:text") ?? s.options.types[0], k = { code: A, type: U?.id ?? "" };
      (S.attributes ??= []).push(k), n.value[W(S.namespace, k)] = !0;
    }
    function Ne(S, A) {
      const U = S.attributes ?? [], k = U.indexOf(A);
      k >= 0 && U.splice(k, 1), i(S.namespace, A) && d("remove", "attributes", S.namespace + "." + A.code);
    }
    return (S, A) => (a(), m("div", Et, [
      (a(!0), m(H, null, Z(f.value, (U) => (a(), q(_e, {
        key: U.namespace,
        count: U.attributes?.length ?? 0,
        columns: ["code", "kind", "details", "usage"]
      }, {
        head: g(() => [
          e("header", Ft, [
            e("div", null, [
              e("h3", null, [
                N(V(t(K)(U.namespace)), 1),
                t(K)(U.namespace).toLocaleLowerCase() !== U.namespace.toLocaleLowerCase() ? (a(), m("span", Ht, V(U.namespace), 1)) : I("", !0)
              ]),
              e("div", Wt, [
                e("label", {
                  for: "writers-" + U.namespace
                }, "Sources allowed to write", 8, Jt),
                p(t(Ul), {
                  "input-id": "writers-" + U.namespace,
                  "aria-label": "Sources allowed to write",
                  "model-value": U.write?.sources ?? [],
                  options: T.value,
                  "option-label": "label",
                  "option-value": "value",
                  placeholder: "Any source",
                  appendTo: "self",
                  "onUpdate:modelValue": (k) => U.write = { sources: k }
                }, null, 8, ["input-id", "model-value", "options", "onUpdate:modelValue"]),
                A[3] || (A[3] = e("span", { class: "small muted" }, "Leave empty to allow any source to write this field group.", -1))
              ])
            ]),
            p(t(G), {
              type: "button",
              onClick: (k) => Pe(U),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: g(() => [
                p(t(Y), { icon: "tabler:trash" }),
                A[4] || (A[4] = N(" Remove field group", -1))
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]),
        add: g(() => [
          p(ke, {
            label: "Field code",
            action: "Add field",
            existing: U.attributes?.map((k) => k.code),
            onAdd: (k) => Ve(U, k)
          }, null, 8, ["existing", "onAdd"])
        ]),
        default: g(() => [
          (a(!0), m(H, null, Z(U.attributes ?? [], (k, X) => (a(), q($e, {
            key: W(U.namespace, k),
            open: n.value[W(U.namespace, k)],
            "onUpdate:open": (C) => n.value[W(U.namespace, k)] = C,
            title: t(K)(k.code),
            code: U.namespace + "." + k.code,
            kind: t(Ae)(z(k)),
            usage: o(U.namespace),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle",
            onHeadDragover: A[2] || (A[2] = ie(() => {
            }, ["prevent"])),
            onHeadDrop: ie((C) => De(U, X), ["prevent"]),
            onHeadKeydown: [
              ie((C) => t(he)(U.attributes ?? [], X, X - 1), ["alt", "prevent"]),
              ie((C) => t(he)(U.attributes ?? [], X, X + 1), ["alt", "prevent"])
            ]
          }, {
            handle: g(() => [
              e("span", {
                class: "pim-grip",
                draggable: "true",
                "aria-hidden": "true",
                onClick: A[0] || (A[0] = ie(() => {
                }, ["stop"])),
                onDragstart: ie((C) => de.value = { namespace: U.namespace, index: X }, ["stop"]),
                onDragend: A[1] || (A[1] = (C) => de.value = null)
              }, [
                p(t(Y), { icon: "tabler:grip-vertical" })
              ], 40, Kt)
            ]),
            details: g(() => [
              k.cardinality && k.cardinality !== "one" ? (a(), q(t(te), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: g(() => [
                  N(V(v.find((C) => C.value === k.cardinality)?.label), 1)
                ]),
                _: 2
              }, 1024)) : I("", !0),
              k.scope?.length ? (a(), q(t(te), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: g(() => [
                  N("per " + V(k.scope.join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : I("", !0),
              k.index && k.index !== "none" ? (a(), q(t(te), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: g(() => [
                  N(V(k.index) + " index", 1)
                ]),
                _: 2
              }, 1024)) : I("", !0),
              k.unique ? (a(), q(t(te), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: g(() => [...A[5] || (A[5] = [
                  N("unique", -1)
                ])]),
                _: 1
              })) : I("", !0)
            ]),
            actions: g(() => [
              p(t(G), {
                type: "button",
                disabled: X === 0,
                "aria-label": "Move " + k.code + " earlier",
                onClick: (C) => t(he)(U.attributes, X, X - 1),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: g(() => [
                  p(t(Y), { icon: "tabler:arrow-up" })
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "onClick"]),
              p(t(G), {
                type: "button",
                disabled: X === (U.attributes?.length ?? 0) - 1,
                "aria-label": "Move " + k.code + " later",
                onClick: (C) => t(he)(U.attributes, X, X + 1),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: g(() => [
                  p(t(Y), { icon: "tabler:arrow-down" })
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "onClick"])
            ]),
            default: g(() => [
              e("div", Gt, [
                e("div", Yt, [
                  e("div", Zt, [
                    e("label", {
                      for: J(U.namespace, k, "code")
                    }, "Code", 8, Qt),
                    i(U.namespace, k) ? (a(), m("span", Xt, "renames keep values")) : I("", !0)
                  ]),
                  p(t(Ue), {
                    id: J(U.namespace, k, "code"),
                    type: "text",
                    value: k.code,
                    onInput: (C) => k.code = C.target.value,
                    class: "mono"
                  }, null, 8, ["id", "value", "onInput"])
                ]),
                e("div", ea, [
                  e("div", la, [
                    e("label", {
                      id: J(U.namespace, k, "type")
                    }, "Type", 8, ta)
                  ]),
                  p(t(ce), {
                    "aria-labelledby": J(U.namespace, k, "type"),
                    "model-value": k.type,
                    options: D.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (C) => ae(k, C)
                  }, null, 8, ["aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", aa, [
                  e("div", sa, [
                    e("label", {
                      id: J(U.namespace, k, "values")
                    }, "Values", 8, na)
                  ]),
                  p(t(ce), {
                    "aria-labelledby": J(U.namespace, k, "values"),
                    "model-value": k.cardinality ?? "one",
                    options: v,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (C) => u(k, "cardinality", C === "one" ? void 0 : C)
                  }, null, 8, ["aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                w(k) ? (a(), m("div", ia, [
                  e("div", oa, [
                    e("label", {
                      id: J(U.namespace, k, "vocabulary")
                    }, "Vocabulary", 8, da)
                  ]),
                  p(t(ce), {
                    "aria-labelledby": J(U.namespace, k, "vocabulary"),
                    "model-value": k.vocabulary ?? "",
                    "onUpdate:modelValue": (C) => u(k, "vocabulary", C),
                    options: [{ value: "", label: "Choose…" }, ...r.value.map((C) => ({ value: C, label: String(C) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : I("", !0),
                x(k) ? (a(), m("div", ra, [
                  e("div", ua, [
                    e("label", {
                      id: J(U.namespace, k, "link")
                    }, "Link kind", 8, ca),
                    A[6] || (A[6] = e("span", { class: "pim-f-note" }, "owned by a plugin", -1))
                  ]),
                  p(t(ce), {
                    "aria-labelledby": J(U.namespace, k, "link"),
                    "model-value": k.config?.target ?? "",
                    "onUpdate:modelValue": (C) => $(k, C),
                    options: [{ value: "", label: "Choose…" }, ...l.options.link_kinds.map((C) => ({ value: C.kind, label: t(oe)(C.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : I("", !0),
                e("div", ma, [
                  e("div", pa, [
                    e("label", {
                      id: J(U.namespace, k, "index")
                    }, "Index", 8, fa),
                    A[7] || (A[7] = e("span", { class: "pim-f-note" }, "for filters and keys", -1))
                  ]),
                  p(t(ce), {
                    "aria-labelledby": J(U.namespace, k, "index"),
                    "model-value": k.index ?? "none",
                    options: z(k)?.indexes ?? ["none"],
                    appendTo: "self",
                    "onUpdate:modelValue": (C) => u(k, "index", C === "none" ? void 0 : C)
                  }, null, 8, ["aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", va, [
                  e("div", ba, [
                    e("label", {
                      id: J(U.namespace, k, "width")
                    }, "Width", 8, ya),
                    A[8] || (A[8] = e("span", { class: "pim-f-note" }, "of a form row", -1))
                  ]),
                  p(t(Je), {
                    "aria-labelledby": J(U.namespace, k, "width"),
                    "model-value": t(Me)(l.schema, U.namespace, k),
                    options: t(c),
                    "allow-empty": !1,
                    "onUpdate:modelValue": (C) => k.width = C
                  }, null, 8, ["aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", ga, [
                  e("div", ha, [
                    e("label", {
                      id: J(U.namespace, k, "scope")
                    }, "Varies per", 8, ka),
                    A[9] || (A[9] = e("span", { class: "pim-f-note" }, "dimensions the value depends on", -1))
                  ]),
                  p(me, {
                    labelledby: J(U.namespace, k, "scope"),
                    "model-value": k.scope ?? [],
                    options: b.value,
                    "onUpdate:modelValue": (C) => h(k, C)
                  }, null, 8, ["labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", _a, [
                  e("div", $a, [
                    e("label", {
                      for: J(U.namespace, k, "unique")
                    }, "Unique", 8, wa),
                    A[10] || (A[10] = e("span", { class: "pim-f-note" }, "one holder per value, catalog wide", -1))
                  ]),
                  e("div", xa, [
                    p(t(Oe), {
                      "input-id": J(U.namespace, k, "unique"),
                      "model-value": k.unique === !0,
                      disabled: !!k.scope?.length || (k.cardinality ?? "one") !== "one",
                      "onUpdate:modelValue": (C) => u(k, "unique", C)
                    }, null, 8, ["input-id", "model-value", "disabled", "onUpdate:modelValue"]),
                    e("span", null, V(k.unique ? "Yes" : "No"), 1)
                  ])
                ]),
                (k.scope?.length ?? 0) > 0 && k.index && k.index !== "none" ? (a(), m("div", Ca, [
                  e("div", Va, [
                    e("label", {
                      id: J(U.namespace, k, "contexts")
                    }, "Indexed contexts", 8, Ua),
                    A[11] || (A[11] = e("span", { class: "pim-f-note" }, "which combinations get an index", -1))
                  ]),
                  e("div", {
                    class: "pim-contexts",
                    role: "group",
                    "aria-labelledby": J(U.namespace, k, "contexts")
                  }, [
                    (a(!0), m(H, null, Z(j(k), (C, P) => (a(), m("div", {
                      key: P,
                      class: "pim-context-row"
                    }, [
                      (a(!0), m(H, null, Z(k.scope, (L) => (a(), m("div", {
                        key: L,
                        class: "pim-context-field"
                      }, [
                        e("span", {
                          id: J(U.namespace, k, "context-" + P + "-" + L),
                          class: "small muted"
                        }, V(t(K)(L)), 9, Aa),
                        p(t(ce), {
                          "aria-labelledby": J(U.namespace, k, "context-" + P + "-" + L),
                          "model-value": C[L] ?? "",
                          options: E(L),
                          class: "narrow",
                          appendTo: "self",
                          "onUpdate:modelValue": (fe) => C[L] = fe
                        }, null, 8, ["aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]))), 128)),
                      p(t(G), {
                        type: "button",
                        "aria-label": "Remove context",
                        onClick: (L) => j(k).splice(P, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: g(() => [
                          p(t(Y), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ]))), 128)),
                    p(t(G), {
                      type: "button",
                      onClick: (C) => Q(k),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: g(() => [
                        p(t(Y), {
                          icon: "tabler:plus",
                          "aria-hidden": "true"
                        }),
                        A[12] || (A[12] = N(" Add context", -1))
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ], 8, Sa)
                ])) : I("", !0),
                e("div", {
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": J(U.namespace, k, "default")
                }, [
                  e("div", Ia, [
                    e("label", {
                      id: J(U.namespace, k, "default")
                    }, "Default", 8, Ta),
                    A[13] || (A[13] = e("span", { class: "pim-f-note" }, "when no value is set", -1))
                  ]),
                  p(Mt, {
                    attribute: k,
                    type: z(k),
                    onChange: (C) => u(k, "default", C)
                  }, null, 8, ["attribute", "type", "onChange"])
                ], 8, Oa),
                z(k)?.config_schema ? (a(), m("div", {
                  key: 3,
                  class: "pim-f pim-w-full",
                  role: "group",
                  "aria-labelledby": J(U.namespace, k, "config")
                }, [
                  e("div", Ra, [
                    e("label", {
                      id: J(U.namespace, k, "config")
                    }, "Type configuration", 8, qa)
                  ]),
                  p(Ke, {
                    schema: z(k).config_schema,
                    "model-value": k.config ?? {},
                    "onUpdate:modelValue": (C) => R(k, C)
                  }, null, 8, ["schema", "model-value", "onUpdate:modelValue"])
                ], 8, ja)) : I("", !0)
              ]),
              e("div", Da, [
                p(t(G), {
                  type: "button",
                  onClick: (C) => Ne(U, k),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: g(() => [
                    p(t(Y), { icon: "tabler:trash" }),
                    A[14] || (A[14] = N(" Remove field", -1))
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
      e("section", Pa, [
        p(ke, {
          class: "pim-aspect",
          label: "Field group code",
          action: "Add field group",
          existing: f.value.map((U) => U.namespace),
          onAdd: re
        }, null, 8, ["existing"])
      ])
    ]));
  }
}), La = { class: "muted small" }, za = { class: "pim-aspect" }, Ba = {
  key: 0,
  class: "small muted"
}, Ma = { class: "pim-fields" }, Ea = { class: "pim-f pim-w-full" }, Fa = { class: "pim-f-label" }, Ha = ["id"], Wa = { class: "pim-f-label" }, Ja = ["id"], Ka = /* @__PURE__ */ le({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(l, { emit: _ }) {
    const s = l, d = _, c = F(() => s.draft.dimensions ?? []), v = Ce();
    function f(x, i) {
      return v + "-" + x.name + "-" + i;
    }
    function b(x) {
      (s.draft.dimensions ??= []).push({ name: x, members: [] });
    }
    function r(x) {
      const i = [];
      for (const o of s.draft.aspects ?? []) for (const n of o.attributes ?? []) n.scope?.includes(x.name) && i.push(o.namespace + "." + n.code);
      for (const o of s.draft.families ?? []) for (const n of o.requirements ?? []) n.context && x.name in n.context && i.push(o.code + " requirement " + n.id);
      return i;
    }
    function T(x) {
      r(x).length || (c.value.splice(c.value.indexOf(x), 1), s.schema.declaration.dimensions?.some((i) => i.name === x.name) && d("remove", "dimensions", x.name));
    }
    function D(x, i) {
      if (x.members = i, x.fallback)
        for (const o of Object.keys(x.fallback)) i.includes(o) || delete x.fallback[o];
    }
    function z(x, i) {
      return x.fallback?.[i] ?? [];
    }
    function w(x, i, o) {
      const n = { ...x.fallback ?? {} };
      o.length ? n[i] = o : delete n[i], Object.keys(n).length ? x.fallback = n : delete x.fallback;
    }
    return (x, i) => (a(), q(_e, {
      count: c.value.length,
      columns: ["code", "details", "usage"]
    }, {
      add: g(() => [
        p(ke, {
          label: "Dimension code",
          action: "Add dimension",
          existing: c.value.map((o) => o.name),
          onAdd: b
        }, {
          default: g(() => [...i[2] || (i[2] = [
            e("span", { class: "muted small" }, "A dimension lets a value differ per member, with fallbacks between members.", -1)
          ])]),
          _: 1
        }, 8, ["existing"])
      ]),
      default: g(() => [
        (a(!0), m(H, null, Z(c.value, (o) => (a(), q($e, {
          title: t(K)(o.name),
          code: o.name,
          key: o.name,
          usage: r(o).length + (r(o).length === 1 ? " dependency" : " dependencies")
        }, {
          details: g(() => [
            e("span", La, V(o.members.length) + " " + V(o.members.length === 1 ? "member" : "members"), 1)
          ]),
          actions: g(() => [
            p(t(G), {
              type: "button",
              disabled: r(o).length > 0,
              "aria-label": "Remove " + t(K)(o.name),
              title: r(o).length ? "Take the dimension off these first" : "",
              onClick: (n) => T(o),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: g(() => [
                p(t(Y), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "title", "onClick"])
          ]),
          default: g(() => [
            e("div", za, [
              r(o).length ? (a(), m("p", Ba, "Used by " + V(r(o).join(", ")), 1)) : I("", !0),
              e("div", Ma, [
                e("div", Ea, [
                  e("div", Fa, [
                    e("label", {
                      id: f(o, "members")
                    }, "Members", 8, Ha),
                    i[0] || (i[0] = e("span", { class: "pim-f-note" }, "the values this dimension takes", -1))
                  ]),
                  p(me, {
                    labelledby: f(o, "members"),
                    "model-value": o.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (n) => D(o, n)
                  }, null, 8, ["labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                (a(!0), m(H, null, Z(o.members, (n) => (a(), m("div", {
                  key: n,
                  class: "pim-f pim-w-half"
                }, [
                  e("div", Wa, [
                    e("label", {
                      id: f(o, "fallback-" + encodeURIComponent(n))
                    }, V(n) + " falls back to", 9, Ja),
                    i[1] || (i[1] = e("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  p(me, {
                    labelledby: f(o, "fallback-" + encodeURIComponent(n)),
                    "model-value": z(o, n),
                    options: o.members.filter((y) => y !== n).map((y) => ({ value: y })),
                    "onUpdate:modelValue": (y) => w(o, n, y)
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
}), Ga = { class: "muted small" }, Ya = { class: "pim-aspect" }, Za = { class: "row small" }, Qa = {
  key: 1,
  class: "muted small"
}, Xa = {
  key: 2,
  class: "pim-stack tight pim-terms"
}, es = { class: "pim-error-copy" }, ls = {
  key: 0,
  class: "pim-error-code"
}, ts = {
  key: 1,
  class: "pim-responsive-table"
}, as = {
  class: "pim-grid compact",
  "aria-label": "Vocabulary terms"
}, ss = { key: 0 }, ns = { class: "mono" }, is = {
  key: 0,
  class: "mono muted"
}, os = { class: "num" }, ds = {
  role: "list",
  class: "pim-stacked-list",
  "aria-label": "Vocabulary terms"
}, rs = { class: "pim-stacked-meta muted small" }, us = { class: "mono" }, cs = { key: 0 }, ms = {
  key: 2,
  class: "muted small"
}, ps = { class: "row wrap" }, fs = { class: "row wrap pim-add-row" }, vs = /* @__PURE__ */ le({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(l, { emit: _ }) {
    const s = l, d = _, c = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/, v = F(() => s.schema.access.write), f = F(() => s.draft.vocabularies ?? []);
    function b($) {
      (s.draft.vocabularies ??= []).push({ code: $ });
    }
    function r($) {
      f.value.splice(f.value.indexOf($), 1), s.schema.declaration.vocabularies?.some((h) => h.code === $.code) && d("remove", "vocabularies", $.code);
    }
    function T($) {
      return !!s.schema.vocabularies[$];
    }
    const D = B({}), z = B({}), w = B({}), x = B({}), i = B({}), o = B({}), n = B({});
    async function y($, h) {
      i.value[$] = !0, delete o.value[$];
      try {
        const u = await se.termsPage(s.catalogId, $, h);
        z.value[$] = u.terms, x.value[$] = h, w.value[$] = u.next;
        const j = M($);
        u.terms.some((E) => E.retired && E.code === j.parent) && (j.parent = "");
      } catch (u) {
        o.value[$] = [we(u, "Could not load terms.")];
      } finally {
        i.value[$] = !1;
      }
    }
    function O($) {
      D.value[$] = !D.value[$], D.value[$] && !z.value[$] && y($);
    }
    function M($) {
      return n.value[$] ?? (n.value[$] = { code: "", label: "", parent: "" });
    }
    function W($) {
      return [{ value: "", label: "No parent" }, ...(z.value[$] ?? []).filter((h) => !h.retired).map((h) => ({ value: h.code, label: Se(h) }))];
    }
    function J($, h, u) {
      o.value[$] = h?.findings?.length ? h.findings.map((j) => ({ message: j.message ?? u, code: j.code })) : [{ message: u }];
    }
    async function ae($) {
      const h = M($.code);
      if (!(!v.value || !c.test(h.code))) {
        i.value[$.code] = !0, delete o.value[$.code];
        try {
          const u = { term: { vocabulary: $.code, code: h.code }, labels: { en: h.label || K(h.code) } };
          $.hierarchical && h.parent && (u.parent = h.parent);
          const E = (await se.apply(s.catalogId, [u])).outcomes[0];
          if (E?.outcome !== "created" && E?.outcome !== "updated") {
            J($.code, E, "The term was not accepted.");
            return;
          }
          n.value[$.code] = { code: "", label: "", parent: "" }, se.invalidateTerms(s.catalogId), await y($.code, x.value[$.code]);
        } catch (u) {
          o.value[$.code] = [we(u, "Could not add the term.")];
        } finally {
          i.value[$.code] = !1;
        }
      }
    }
    async function R($, h, u) {
      if (v.value && !(u && !await xl.confirm({ header: "Retire term?", message: `Retire ${Se(h)}? Term changes save immediately. You can restore this term later.`, acceptLabel: "Retire", rejectLabel: "Cancel" }))) {
        i.value[$.code] = !0, delete o.value[$.code];
        try {
          const E = (await se.apply(s.catalogId, [{ term: { vocabulary: $.code, code: h.code }, retired: u }])).outcomes[0];
          if (!E || !["updated", "unchanged"].includes(E.outcome)) {
            J($.code, E, "The term change was not accepted.");
            return;
          }
          u && M($.code).parent === h.code && (M($.code).parent = ""), se.invalidateTerms(s.catalogId), await y($.code, x.value[$.code]);
        } catch (j) {
          o.value[$.code] = [we(j, "Could not change the term.")];
        } finally {
          i.value[$.code] = !1;
        }
      }
    }
    return ($, h) => (a(), q(_e, {
      count: f.value.length,
      columns: ["code", "details"]
    }, {
      add: g(() => [
        p(ke, {
          label: "Vocabulary code",
          action: "Add vocabulary",
          existing: f.value.map((u) => u.code),
          onAdd: b
        }, {
          default: g(() => [...h[10] || (h[10] = [
            e("span", { class: "muted small" }, "Select fields pick their values from a vocabulary's terms.", -1)
          ])]),
          _: 1
        }, 8, ["existing"])
      ]),
      default: g(() => [
        (a(!0), m(H, null, Z(f.value, (u) => (a(), q($e, {
          title: t(K)(u.code),
          code: u.code,
          key: u.code
        }, {
          details: g(() => [
            e("span", Ga, V(u.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: g(() => [
            p(t(G), {
              type: "button",
              "aria-label": "Remove " + t(K)(u.code),
              onClick: (j) => r(u),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: g(() => [
                p(t(Y), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])
          ]),
          default: g(() => [
            e("div", Ya, [
              e("label", Za, [
                p(t(Oe), {
                  "aria-label": "Hierarchical " + u.code,
                  "model-value": u.hierarchical === !0,
                  "onUpdate:modelValue": (j) => j ? u.hierarchical = !0 : delete u.hierarchical
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"]),
                h[0] || (h[0] = e("span", null, "Hierarchical", -1))
              ]),
              T(u.code) ? (a(), q(t(G), {
                key: 0,
                type: "button",
                onClick: (j) => O(u.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: g(() => [
                  p(t(Y), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  N(" " + V(D.value[u.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : (a(), m("span", Qa, "Apply the schema before adding terms.")),
              D.value[u.code] ? (a(), m("div", Xa, [
                h[9] || (h[9] = e("p", { class: "muted small" }, "Term changes save immediately.", -1)),
                o.value[u.code] ? (a(), q(t(pe), {
                  key: 0,
                  severity: "error",
                  role: "alert"
                }, {
                  default: g(() => [
                    e("div", es, [
                      (a(!0), m(H, null, Z(o.value[u.code], (j, E) => (a(), m("div", { key: E }, [
                        N(V(j.message) + " ", 1),
                        j.code ? (a(), m("span", ls, [
                          h[1] || (h[1] = N("Code ", -1)),
                          e("code", null, V(j.code), 1)
                        ])) : I("", !0)
                      ]))), 128))
                    ]),
                    p(t(G), {
                      type: "button",
                      disabled: i.value[u.code],
                      onClick: (j) => y(u.code, x.value[u.code]),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: g(() => [...h[2] || (h[2] = [
                        N("Retry", -1)
                      ])]),
                      _: 1
                    }, 8, ["disabled", "onClick"])
                  ]),
                  _: 2
                }, 1024)) : I("", !0),
                (z.value[u.code] ?? []).length ? (a(), m("div", ts, [
                  e("table", as, [
                    e("thead", null, [
                      e("tr", null, [
                        h[3] || (h[3] = e("th", null, "Code", -1)),
                        h[4] || (h[4] = e("th", null, "Label", -1)),
                        u.hierarchical ? (a(), m("th", ss, "Parent")) : I("", !0),
                        h[5] || (h[5] = e("th", null, null, -1))
                      ])
                    ]),
                    e("tbody", null, [
                      (a(!0), m(H, null, Z(z.value[u.code], (j) => (a(), m("tr", {
                        key: j.code,
                        class: ge({ muted: j.retired })
                      }, [
                        e("td", ns, V(j.code), 1),
                        e("td", null, [
                          N(V(t(Se)(j)) + " ", 1),
                          j.retired ? (a(), q(t(te), {
                            key: 0,
                            severity: "secondary",
                            value: "Retired"
                          })) : I("", !0)
                        ]),
                        u.hierarchical ? (a(), m("td", is, V(j.parent ?? ""), 1)) : I("", !0),
                        e("td", os, [
                          p(t(G), {
                            type: "button",
                            disabled: !v.value || i.value[u.code],
                            onClick: (E) => R(u, j, !j.retired),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: g(() => [
                              N(V(j.retired ? "Restore" : "Retire"), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled", "onClick"])
                        ])
                      ], 2))), 128))
                    ])
                  ]),
                  e("ul", ds, [
                    (a(!0), m(H, null, Z(z.value[u.code], (j) => (a(), m("li", {
                      key: j.code,
                      class: ge(["pim-stacked-row", { muted: j.retired }])
                    }, [
                      e("div", null, [
                        N(V(t(Se)(j)) + " ", 1),
                        j.retired ? (a(), q(t(te), {
                          key: 0,
                          severity: "secondary",
                          value: "Retired"
                        })) : I("", !0)
                      ]),
                      e("div", rs, [
                        e("span", us, V(j.code), 1),
                        u.hierarchical && j.parent ? (a(), m("span", cs, "Parent: " + V(j.parent), 1)) : I("", !0)
                      ]),
                      p(t(G), {
                        type: "button",
                        disabled: !v.value || i.value[u.code],
                        onClick: (E) => R(u, j, !j.retired),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: g(() => [
                          N(V(j.retired ? "Restore" : "Retire"), 1)
                        ]),
                        _: 2
                      }, 1032, ["disabled", "onClick"])
                    ], 2))), 128))
                  ])
                ])) : i.value[u.code] ? I("", !0) : (a(), m("p", ms, "No terms yet.")),
                e("div", ps, [
                  p(t(G), {
                    type: "button",
                    disabled: i.value[u.code] || !x.value[u.code],
                    onClick: (j) => y(u.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: g(() => [
                      p(t(Y), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      h[6] || (h[6] = N(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  p(t(G), {
                    type: "button",
                    disabled: i.value[u.code] || !w.value[u.code],
                    onClick: (j) => y(u.code, w.value[u.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: g(() => [
                      p(t(Y), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      h[7] || (h[7] = N(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                e("div", fs, [
                  p(t(Ue), {
                    modelValue: M(u.code).code,
                    "onUpdate:modelValue": (j) => M(u.code).code = j,
                    disabled: !v.value || i.value[u.code],
                    type: "text",
                    placeholder: "code",
                    class: "mono narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  p(t(Ue), {
                    modelValue: M(u.code).label,
                    "onUpdate:modelValue": (j) => M(u.code).label = j,
                    disabled: !v.value || i.value[u.code],
                    type: "text",
                    placeholder: "Label (en)"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  u.hierarchical ? (a(), q(t(ce), {
                    key: 0,
                    modelValue: M(u.code).parent,
                    "onUpdate:modelValue": (j) => M(u.code).parent = j,
                    disabled: !v.value || i.value[u.code],
                    class: "narrow",
                    "aria-label": "Parent term",
                    placeholder: "No parent",
                    options: W(u.code),
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "options"])) : I("", !0),
                  p(t(G), {
                    type: "button",
                    disabled: !v.value || i.value[u.code] || !c.test(M(u.code).code),
                    onClick: (j) => ae(u),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: g(() => [
                      p(t(Y), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      h[8] || (h[8] = N(" Add term", -1))
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
}), bs = { class: "muted small" }, ys = { class: "pim-aspect" }, gs = { class: "pim-fields" }, hs = { class: "pim-f pim-w-full" }, ks = { class: "pim-f-label" }, _s = ["id"], $s = { class: "pim-aspect" }, ws = { class: "pim-stack tight" }, xs = { class: "pim-level-head" }, Cs = { class: "pim-fields" }, Vs = { class: "pim-f pim-w-half" }, Us = { class: "pim-f-label" }, Ss = ["id"], As = { class: "pim-f pim-w-half" }, Os = { class: "pim-f-label" }, Is = ["id"], Ts = { class: "pim-aspect" }, js = { class: "pim-stack tight" }, Rs = { class: "pim-level-head" }, qs = { class: "mono" }, Ds = { class: "pim-fields" }, Ps = { class: "pim-f-label" }, Ns = ["id"], Ls = { class: "pim-f pim-w-half" }, zs = { class: "pim-f-label" }, Bs = ["id"], Ms = { class: "pim-f pim-w-half" }, Es = { class: "pim-f-label" }, Fs = ["id"], Hs = /* @__PURE__ */ le({
  __name: "BuilderFamilies",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove"],
  setup(l, { emit: _ }) {
    const s = l, d = _, c = Ce();
    function v(R, $) {
      return c + "-" + R.code + "-" + $;
    }
    const f = F(() => (s.draft.families ?? []).filter((R) => R.code !== "generic")), b = F(() => {
      const R = new Set(s.draft.plugins?.map(($) => $.use));
      return Object.entries(s.schema.attributes).filter(([, $]) => $.plugin && R.has($.plugin));
    }), r = F(() => {
      const R = (s.draft.aspects ?? []).map((h) => h.namespace), $ = [...new Set(b.value.map(([h]) => h.split(".")[0]))];
      return [...R, ...$.filter((h) => !R.includes(h))].map((h) => ({ value: h, label: K(h) }));
    }), T = F(() => new Map(s.options.types.map((R) => [R.id, R.form])));
    function D(R) {
      return `${K(R)} (${K(R.split(".")[0])})`;
    }
    const z = F(() => {
      const R = /* @__PURE__ */ new Map();
      function $(h, u, j = [], E = "one") {
        const Q = !!u && u !== "text" && u !== "record" && j.length === 0 && E === "one";
        R.set(h, { value: h, label: D(h), canBeAxis: Q });
      }
      for (const h of s.draft.aspects ?? [])
        for (const u of h.attributes ?? []) {
          const j = h.namespace + "." + u.code;
          $(j, T.value.get(u.type), u.scope, u.cardinality);
        }
      for (const [h, u] of b.value) $(h, u.form, u.scope, u.cardinality);
      return R;
    });
    function w(R) {
      return [...z.value.values()].filter(($) => R.aspects?.includes($.value.split(".")[0]));
    }
    function x(R, $, h) {
      const u = $[h] ?? [], j = new Set(y(R).flatMap((Q) => [...Q.axes ?? [], ...Q.own ?? []])), E = w(R).filter((Q) => u.includes(Q.value) || !j.has(Q.value) && (h === "own" || Q.canBeAxis));
      return [...E, ...u.filter((Q) => !E.some((de) => de.value === Q)).map((Q) => ({ value: Q, label: D(Q) }))];
    }
    const i = F(() => s.draft.dimensions ?? []);
    function o(R) {
      (s.draft.families ??= []).push({ code: R, aspects: [] });
    }
    function n(R) {
      s.draft.families.splice(s.draft.families.indexOf(R), 1), s.schema.declaration.families?.some(($) => $.code === R.code) && d("remove", "families", R.code);
    }
    function y(R) {
      return R.variation ?? [];
    }
    function O(R) {
      (R.variation ??= []).push({ axes: [] });
    }
    function M(R) {
      return R.requirements ?? [];
    }
    function W(R, $) {
      (R.requirements ??= []).push({ id: $, require: [] });
    }
    function J(R, $) {
      return R.context?.[$] ?? "";
    }
    function ae(R, $, h) {
      const u = { ...R.context ?? {} };
      h ? u[$] = h : delete u[$], Object.keys(u).length ? R.context = u : delete R.context;
    }
    return (R, $) => (a(), q(_e, {
      count: f.value.length,
      columns: ["code", "details"]
    }, {
      add: g(() => [
        p(ke, {
          label: "Family code",
          action: "Add family",
          existing: l.draft.families?.map((h) => h.code),
          onAdd: o
        }, {
          default: g(() => [...$[10] || ($[10] = [
            e("span", { class: "muted small" }, "Products without a family use the generic one.", -1)
          ])]),
          _: 1
        }, 8, ["existing"])
      ]),
      default: g(() => [
        (a(!0), m(H, null, Z(f.value, (h) => (a(), q($e, {
          title: t(K)(h.code),
          code: h.code,
          key: h.code
        }, {
          details: g(() => [
            e("span", bs, V(h.aspects?.length ?? 0) + " " + V(h.aspects?.length === 1 ? "field group" : "field groups"), 1)
          ]),
          actions: g(() => [
            p(t(G), {
              type: "button",
              onClick: (u) => n(h),
              "aria-label": "Remove " + t(K)(h.code),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: g(() => [
                p(t(Y), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick", "aria-label"])
          ]),
          default: g(() => [
            e("div", ys, [
              e("div", gs, [
                e("div", hs, [
                  e("div", ks, [
                    e("label", {
                      id: v(h, "groups")
                    }, "Field groups", 8, _s),
                    $[0] || ($[0] = e("span", { class: "pim-f-note" }, "the fields this family's products carry", -1))
                  ]),
                  p(me, {
                    labelledby: v(h, "groups"),
                    "model-value": h.aspects ?? [],
                    options: r.value,
                    "onUpdate:modelValue": (u) => t(xe)(h, "aspects", u)
                  }, null, 8, ["labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            e("div", $s, [
              $[4] || ($[4] = e("header", { class: "pim-aspect-head" }, [
                e("h3", null, "Variation")
              ], -1)),
              $[5] || ($[5] = e("p", { class: "muted small pim-axis-help" }, "Choose the fields that distinguish variants at each level. Each field can be used once.", -1)),
              e("div", ws, [
                (a(!0), m(H, null, Z(y(h), (u, j) => (a(), m("div", {
                  key: j,
                  class: "pim-level"
                }, [
                  e("div", xs, [
                    e("strong", null, "Level " + V(j + 1), 1),
                    p(t(G), {
                      type: "button",
                      "aria-label": "Remove level",
                      onClick: (E) => y(h).splice(j, 1),
                      text: "",
                      severity: "secondary",
                      size: "small"
                    }, {
                      default: g(() => [
                        p(t(Y), { icon: "tabler:x" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  e("div", Cs, [
                    e("div", Vs, [
                      e("div", Us, [
                        e("label", {
                          id: v(h, j + "-axes")
                        }, "Axes", 8, Ss)
                      ]),
                      $[1] || ($[1] = e("p", { class: "muted small pim-axis-help" }, "Choose a single-value field with no dimensions. Text and record fields are excluded.", -1)),
                      p(me, {
                        dropdown: "",
                        labelledby: v(h, j + "-axes"),
                        "model-value": u.axes ?? [],
                        options: x(h, u, "axes"),
                        placeholder: "Add an axis",
                        "onUpdate:modelValue": (E) => u.axes = E
                      }, null, 8, ["labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ]),
                    e("div", As, [
                      e("div", Os, [
                        e("label", {
                          id: v(h, j + "-owned")
                        }, "Also owned here", 8, Is)
                      ]),
                      $[2] || ($[2] = e("p", { class: "muted small pim-axis-help" }, "Other fields you edit at this level.", -1)),
                      p(me, {
                        dropdown: "",
                        labelledby: v(h, j + "-owned"),
                        "model-value": u.own ?? [],
                        options: x(h, u, "own"),
                        placeholder: "Add a field",
                        "onUpdate:modelValue": (E) => E.length ? u.own = E : delete u.own
                      }, null, 8, ["labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ])
                  ])
                ]))), 128)),
                p(t(G), {
                  type: "button",
                  onClick: (u) => O(h),
                  severity: "secondary",
                  outlined: "",
                  size: "small"
                }, {
                  default: g(() => [
                    p(t(Y), {
                      icon: "tabler:plus",
                      "aria-hidden": "true"
                    }),
                    $[3] || ($[3] = N(" Add level", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ]),
            e("div", Ts, [
              $[9] || ($[9] = e("header", { class: "pim-aspect-head" }, [
                e("h3", null, "Requirements"),
                e("span", { class: "muted small" }, "what a channel needs before a product is ready")
              ], -1)),
              e("div", js, [
                (a(!0), m(H, null, Z(M(h), (u, j) => (a(), m("div", {
                  key: u.id,
                  class: "pim-level"
                }, [
                  e("div", Rs, [
                    e("strong", qs, V(u.id), 1),
                    p(t(G), {
                      type: "button",
                      "aria-label": "Remove requirement",
                      onClick: (E) => M(h).splice(j, 1),
                      text: "",
                      severity: "secondary",
                      size: "small"
                    }, {
                      default: g(() => [
                        p(t(Y), { icon: "tabler:x" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  e("div", Ds, [
                    (a(!0), m(H, null, Z(i.value, (E) => (a(), m("div", {
                      key: E.name,
                      class: "pim-f pim-w-third"
                    }, [
                      e("div", Ps, [
                        e("label", {
                          id: v(h, u.id + "-context-" + E.name)
                        }, V(t(K)(E.name)), 9, Ns),
                        $[6] || ($[6] = e("span", { class: "pim-f-note" }, "context", -1))
                      ]),
                      p(t(ce), {
                        "aria-labelledby": v(h, u.id + "-context-" + E.name),
                        "model-value": J(u, E.name),
                        "onUpdate:modelValue": (Q) => ae(u, E.name, Q),
                        options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ...E.members.map((Q) => ({ value: Q, label: String(Q) }))],
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self"
                      }, null, 8, ["aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                    ]))), 128)),
                    e("div", Ls, [
                      e("div", zs, [
                        e("label", {
                          id: v(h, u.id + "-required")
                        }, "Required", 8, Bs),
                        $[7] || ($[7] = e("span", { class: "pim-f-note" }, "must hold a value", -1))
                      ]),
                      p(me, {
                        dropdown: "",
                        labelledby: v(h, u.id + "-required"),
                        "model-value": u.require ?? [],
                        placeholder: "Add a required field",
                        options: w(h),
                        "onUpdate:modelValue": (E) => t(xe)(u, "require", E)
                      }, null, 8, ["labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ]),
                    e("div", Ms, [
                      e("div", Es, [
                        e("label", {
                          id: v(h, u.id + "-authored")
                        }, "Authored", 8, Fs),
                        $[8] || ($[8] = e("span", { class: "pim-f-note" }, "must be set in the context itself, not by fallback", -1))
                      ]),
                      p(me, {
                        dropdown: "",
                        labelledby: v(h, u.id + "-authored"),
                        "model-value": u.authored ?? [],
                        placeholder: "Add a field to author",
                        options: w(h),
                        "onUpdate:modelValue": (E) => t(xe)(u, "authored", E)
                      }, null, 8, ["labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ])
                  ])
                ]))), 128)),
                p(ke, {
                  label: "Requirement code",
                  action: "Add requirement",
                  existing: M(h).map((u) => u.id),
                  onAdd: (u) => W(h, u)
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
}), Ws = ["inert"], Js = {
  key: 0,
  class: "row wrap"
}, Ks = {
  key: 2,
  class: "small muted"
}, Gs = { class: "pim-principal-service" }, Ys = /* @__PURE__ */ le({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(l, { emit: _ }) {
    const s = l, d = _, c = B(!1), v = B(""), f = B({});
    let b = 0;
    ue(() => s.modelValue, async (w) => {
      const x = ++b;
      try {
        const i = await sl(s.catalogId ?? "", w);
        x === b && (f.value = i);
      } catch {
        x === b && (f.value = {});
      }
    }, { immediate: !0, deep: !0 }), Ie(() => {
      b++;
    });
    function r(w) {
      return f.value[w] ?? oe(w, "Person");
    }
    We(async () => {
      try {
        await Cl("wc-principal-picker"), c.value = !0;
      } catch {
        c.value = !1;
      }
    });
    function T(w) {
      s.disabled || !w.trim() || s.modelValue.includes(w.trim()) || (d("update:modelValue", [...s.modelValue, w.trim()]), v.value = "");
    }
    function D(w) {
      const x = w.detail;
      if (!x || typeof x != "object") return;
      const i = x, o = i.principal_id ?? i.id;
      typeof o == "string" && T(o);
    }
    function z(w) {
      s.disabled || d("update:modelValue", s.modelValue.filter((x) => x !== w));
    }
    return (w, x) => (a(), m("div", {
      class: "pim-principal-list",
      inert: l.disabled || void 0
    }, [
      l.modelValue.length ? (a(), m("div", Js, [
        (a(!0), m(H, null, Z(l.modelValue, (i) => (a(), q(t(te), {
          key: i,
          severity: "secondary"
        }, {
          default: g(() => [
            e("span", null, V(r(i)), 1),
            p(t(G), {
              text: "",
              size: "small",
              disabled: l.disabled,
              "aria-label": "Remove " + r(i),
              onClick: (o) => z(i)
            }, {
              default: g(() => [
                p(t(Y), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : I("", !0),
      c.value ? (a(), m("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: ie(D, ["stop"])
      }, null, 32)) : (a(), m("span", Ks, "The person picker is unavailable.")),
      e("label", Gs, [
        x[3] || (x[3] = e("span", { class: "small muted" }, "Service account", -1)),
        p(t(Ue), {
          modelValue: v.value,
          "onUpdate:modelValue": x[0] || (x[0] = (i) => v.value = i),
          disabled: l.disabled,
          placeholder: "Service principal id",
          onKeydown: x[1] || (x[1] = He(ie((i) => T(v.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "disabled"])
      ]),
      p(t(G), {
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: l.disabled || !v.value.trim(),
        onClick: x[2] || (x[2] = (i) => T(v.value))
      }, {
        default: g(() => [
          p(t(Y), { icon: "tabler:plus" }),
          x[4] || (x[4] = N(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, Ws));
  }
}), Zs = { class: "pim-stack" }, Qs = { class: "muted small" }, Xs = { class: "pim-fields" }, en = { class: "pim-f pim-w-half" }, ln = { class: "pim-f-label" }, tn = ["id"], an = { class: "pim-f pim-w-half" }, sn = { class: "pim-f-label" }, nn = ["id"], on = { class: "muted small" }, dn = { class: "pim-fields" }, rn = { class: "pim-f pim-w-third" }, un = { class: "pim-f-label" }, cn = ["id"], mn = { class: "pim-f pim-w-third" }, pn = { class: "pim-f-label" }, fn = ["for"], vn = { class: "row" }, bn = ["aria-labelledby"], yn = { class: "pim-f-label" }, gn = ["id"], hn = { class: "pim-f pim-w-full" }, kn = { class: "pim-f-label" }, _n = ["id"], $n = /* @__PURE__ */ le({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(l, { emit: _ }) {
    const s = l, d = _, c = Ce();
    function v(o, n) {
      return c + "-" + o + "-" + n;
    }
    const f = F(() => s.draft.channels ?? []), b = F(() => s.draft.sources ?? []), r = F(() => [...new Set((s.draft.families ?? []).flatMap((o) => (o.requirements ?? []).map((n) => n.id)))].map((o) => ({ value: o }))), T = F(() => (s.draft.families ?? []).filter((o) => o.code !== "generic").map((o) => ({ value: o.code, label: K(o.code) }))), D = F(() => (s.draft.aspects ?? []).map((o) => ({ value: o.namespace, label: K(o.namespace) })));
    function z(o) {
      (s.draft.channels ??= []).push({ id: o, requirements: [] });
    }
    function w(o) {
      f.value.splice(f.value.indexOf(o), 1), s.schema.declaration.channels?.some((n) => n.id === o.id) && d("remove", "channels", o.id);
    }
    function x(o) {
      (s.draft.sources ??= []).push({ id: o, ordering: "none", writes: [] });
    }
    function i(o) {
      b.value.splice(b.value.indexOf(o), 1), s.schema.declaration.sources?.some((n) => n.id === o.id) && d("remove", "sources", o.id);
    }
    return (o, n) => (a(), m("div", Zs, [
      p(_e, {
        count: f.value.length,
        columns: ["code", "details"]
      }, {
        head: g(() => [...n[0] || (n[0] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Channels")
          ], -1)
        ])]),
        add: g(() => [
          p(ke, {
            label: "Channel code",
            action: "Add channel",
            existing: f.value.map((y) => y.id),
            onAdd: z
          }, null, 8, ["existing"])
        ]),
        default: g(() => [
          (a(!0), m(H, null, Z(f.value, (y) => (a(), q($e, {
            key: y.id,
            title: t(K)(y.id),
            code: y.id
          }, {
            details: g(() => [
              e("span", Qs, V(y.requirements?.length ?? 0) + " " + V(y.requirements?.length === 1 ? "requirement" : "requirements"), 1)
            ]),
            actions: g(() => [
              p(t(G), {
                type: "button",
                onClick: (O) => w(y),
                "aria-label": "Remove " + t(K)(y.id),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: g(() => [
                  p(t(Y), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick", "aria-label"])
            ]),
            default: g(() => [
              e("div", Xs, [
                e("div", en, [
                  e("div", ln, [
                    e("label", {
                      id: v(y.id, "requirements")
                    }, "Requirements", 8, tn),
                    n[1] || (n[1] = e("span", { class: "pim-f-note" }, "a product is ready for the channel when these hold", -1))
                  ]),
                  p(me, {
                    labelledby: v(y.id, "requirements"),
                    "model-value": y.requirements ?? [],
                    options: r.value,
                    "onUpdate:modelValue": (O) => t(xe)(y, "requirements", O)
                  }, null, 8, ["labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", an, [
                  e("div", sn, [
                    e("label", {
                      id: v(y.id, "families")
                    }, "Families", 8, nn),
                    n[2] || (n[2] = e("span", { class: "pim-f-note" }, "empty means every family", -1))
                  ]),
                  p(me, {
                    labelledby: v(y.id, "families"),
                    "model-value": y.families ?? [],
                    options: T.value,
                    "onUpdate:modelValue": (O) => t(xe)(y, "families", O)
                  }, null, 8, ["labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, 1032, ["title", "code"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      p(_e, {
        count: b.value.length,
        columns: ["code", "details"]
      }, {
        head: g(() => [...n[3] || (n[3] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Sources")
          ], -1)
        ])]),
        add: g(() => [
          p(ke, {
            label: "Source code",
            action: "Add source",
            existing: b.value.map((y) => y.id),
            onAdd: x
          }, null, 8, ["existing"])
        ]),
        default: g(() => [
          (a(!0), m(H, null, Z(b.value, (y) => (a(), q($e, {
            key: y.id,
            title: t(K)(y.id),
            code: y.id
          }, {
            details: g(() => [
              e("span", on, V(y.writes?.length ?? 0) + " " + V(y.writes?.length === 1 ? "field group" : "field groups"), 1)
            ]),
            actions: g(() => [
              p(t(G), {
                type: "button",
                onClick: (O) => i(y),
                "aria-label": "Remove " + t(K)(y.id),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: g(() => [
                  p(t(Y), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick", "aria-label"])
            ]),
            default: g(() => [
              e("div", dn, [
                e("div", rn, [
                  e("div", un, [
                    e("label", {
                      id: v(y.id, "ordering")
                    }, "Ordering", 8, cn),
                    n[4] || (n[4] = e("span", { class: "pim-f-note" }, "sequence keeps late deliveries from winning", -1))
                  ]),
                  p(t(ce), {
                    "aria-labelledby": v(y.id, "ordering"),
                    "model-value": y.ordering ?? "none",
                    "onUpdate:modelValue": (O) => y.ordering = O,
                    options: [{ value: "none", label: "none" }, { value: "sequence", label: "sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                e("div", mn, [
                  e("div", pn, [
                    e("label", {
                      for: v(y.id, "audit")
                    }, "Audit", 8, fn),
                    n[5] || (n[5] = e("span", { class: "pim-f-note" }, "record each value change", -1))
                  ]),
                  e("div", vn, [
                    p(t(Oe), {
                      "input-id": v(y.id, "audit"),
                      "model-value": y.audit !== !1,
                      "onUpdate:modelValue": (O) => O ? delete y.audit : y.audit = !1
                    }, null, 8, ["input-id", "model-value", "onUpdate:modelValue"]),
                    e("span", null, V(y.audit === !1 ? "Off for this source" : "As the catalog policy"), 1)
                  ])
                ]),
                e("div", {
                  class: "pim-f pim-w-third",
                  role: "group",
                  "aria-labelledby": v(y.id, "people")
                }, [
                  e("div", yn, [
                    e("label", {
                      id: v(y.id, "people")
                    }, "People and service accounts", 8, gn),
                    n[6] || (n[6] = e("span", { class: "pim-f-note" }, "who may write as this source", -1))
                  ]),
                  p(Ys, {
                    "catalog-id": l.catalogId,
                    "model-value": y.principals ?? [],
                    "onUpdate:modelValue": (O) => t(xe)(y, "principals", O)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])
                ], 8, bn),
                e("div", hn, [
                  e("div", kn, [
                    e("label", {
                      id: v(y.id, "writes")
                    }, "Writes", 8, _n),
                    n[7] || (n[7] = e("span", { class: "pim-f-note" }, "field groups this source may set", -1))
                  ]),
                  p(me, {
                    labelledby: v(y.id, "writes"),
                    "model-value": y.writes ?? [],
                    options: D.value,
                    "onUpdate:modelValue": (O) => t(xe)(y, "writes", O)
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
}), wn = { class: "pim-stack" }, xn = { class: "pim-bsection-head" }, Cn = { class: "muted small" }, Vn = {
  key: 0,
  class: "pim-aspect muted"
}, Un = {
  key: 1,
  class: "muted small"
}, Sn = {
  key: 3,
  class: "muted small"
}, An = {
  key: 0,
  class: "pim-aspect muted"
}, On = { class: "row wrap muted small" }, In = /* @__PURE__ */ le({
  __name: "BuilderPlugins",
  props: {
    draft: {},
    schema: {},
    options: {},
    pluginConfigs: { default: () => ({}) }
  },
  emits: ["remove", "configure"],
  setup(l, { emit: _ }) {
    const s = l, d = _, c = /* @__PURE__ */ new Map([
      ["eq", "Equals"],
      ["in", "Is one of"],
      ["gt", "Greater than"],
      ["gte", "At least"],
      ["lt", "Less than"],
      ["lte", "At most"]
    ]), v = {
      pending: "Setting up",
      ready: "Ready",
      failed: "Setup failed"
    };
    function f(n, y) {
      const O = y.map((M) => c.get(M)).filter(Boolean);
      return [K(n), O.join(", ")].filter(Boolean).join(" · ");
    }
    const b = F(() => s.draft.plugins ?? []);
    function r(n) {
      return b.value.some((y) => y.use === n.plugin);
    }
    function T(n) {
      return s.schema.plugins.find((y) => y.plugin === n.plugin);
    }
    function D(n, y) {
      y && !r(n) && (s.draft.plugins ??= []).push({ use: n.plugin }), y || (s.draft.plugins = b.value.filter((O) => O.use !== n.plugin), delete s.pluginConfigs[n.plugin], T(n)?.active && d("remove", "plugins", n.plugin));
    }
    function z(n, y) {
      s.pluginConfigs[n.plugin] = y;
    }
    function w(n) {
      return Object.entries(s.schema.attributes).filter(([, y]) => y.plugin === n.plugin).map(([y]) => K(y));
    }
    const x = F(() => s.draft.scopes ?? []);
    function i(n) {
      return x.value.includes(n.id);
    }
    function o(n, y) {
      y && !i(n) && (s.draft.scopes ??= []).push(n.id), !y && i(n) && (x.value.splice(x.value.indexOf(n.id), 1), s.schema.declaration.scopes?.includes(n.id) && d("remove", "scopes", n.id));
    }
    return (n, y) => (a(), m("div", wn, [
      p(_e, {
        count: l.options.plugins.length,
        columns: ["details"]
      }, {
        head: g(() => [
          e("header", xn, [
            y[0] || (y[0] = e("h3", null, "Plugins", -1)),
            e("span", Cn, V(l.options.plugins.length) + " installed", 1)
          ])
        ]),
        default: g(() => [
          l.options.plugins.length === 0 ? (a(), m("div", Vn, "No plugin is installed.")) : I("", !0),
          (a(!0), m(H, null, Z(l.options.plugins, (O) => (a(), q($e, {
            key: O.plugin,
            title: t(oe)(O.title, "Plugin")
          }, {
            details: g(() => [
              p(t(te), {
                severity: r(O) ? "success" : "secondary",
                value: r(O) ? "Active" : "Inactive"
              }, null, 8, ["severity", "value"])
            ]),
            actions: g(() => [
              p(t(Oe), {
                "aria-label": "Enable " + t(oe)(O.title, "Plugin"),
                "model-value": r(O),
                "onUpdate:modelValue": (M) => D(O, M)
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
            ]),
            default: g(() => [
              T(O)?.problem ? (a(), q(t(pe), {
                key: 0,
                severity: "warn"
              }, {
                default: g(() => [
                  N(V(T(O)?.problem?.message) + " ", 1),
                  e("code", null, V(T(O)?.problem?.code), 1)
                ]),
                _: 2
              }, 1024)) : I("", !0),
              w(O).length ? (a(), m("p", Un, "Fields: " + V(w(O).join(", ")) + ".", 1)) : I("", !0),
              r(O) ? (a(), q(Ke, {
                key: 2,
                schema: O.config_schema,
                "model-value": l.pluginConfigs[O.plugin] ?? T(O)?.config ?? {},
                "onUpdate:modelValue": (M) => z(O, M)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue"])) : I("", !0),
              T(O)?.active ? (a(), m("p", Sn, [
                N(V(v[T(O).lifecycle.state]) + " ", 1),
                (a(!0), m(H, null, Z(T(O)?.projections, (M, W) => (a(), m("span", { key: W }, " · " + V(t(K)(t(oe)(W, "Background update"))) + ": " + V(M.parked ? "Paused" : M.bootstrapping ? "Starting" : "Ready"), 1))), 128))
              ])) : I("", !0),
              T(O)?.active && l.pluginConfigs[O.plugin] ? (a(), q(t(G), {
                key: 4,
                label: "Save configuration",
                onClick: (M) => d("configure", O.plugin, l.pluginConfigs[O.plugin])
              }, null, 8, ["onClick"])) : I("", !0)
            ]),
            _: 2
          }, 1032, ["title"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      p(_e, {
        count: l.options.scopes.length,
        columns: ["details"]
      }, {
        head: g(() => [...y[1] || (y[1] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Scopes"),
            e("span", { class: "muted small" }, "Filters added by plugins")
          ], -1)
        ])]),
        default: g(() => [
          l.options.scopes.length === 0 ? (a(), m("div", An, "No scope is declared.")) : I("", !0),
          (a(!0), m(H, null, Z(l.options.scopes, (O) => (a(), q($e, {
            key: O.id,
            title: t(oe)(O.title, "Scope")
          }, {
            details: g(() => [
              p(t(te), {
                severity: i(O) ? "success" : "secondary",
                value: i(O) ? "Adopted" : "Not adopted"
              }, null, 8, ["severity", "value"])
            ]),
            actions: g(() => [
              p(t(Oe), {
                "aria-label": "Adopt " + t(oe)(O.title, "Scope"),
                "model-value": i(O),
                "onUpdate:modelValue": (M) => o(O, M)
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
            ]),
            default: g(() => [
              e("div", On, [
                y[2] || (y[2] = e("span", null, "Filters", -1)),
                (a(!0), m(H, null, Z(O.filters, (M, W) => (a(), q(t(te), {
                  key: W,
                  class: "kx-tag-sm small",
                  severity: "secondary",
                  value: f(W, M.ops)
                }, null, 8, ["value"]))), 128)),
                e("span", null, V(t(K)(O.access)) + " access required", 1)
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
async function Tn(l) {
  const _ = await ul(`/api/v1/pim-admin/catalogs/${encodeURIComponent(l)}/policy_defaults`, "policy defaults");
  if (_.audit !== "fields" && _.audit !== "off" || !["audit_days", "trash_days", "tombstone_days"].every((s) => typeof _[s] == "number" && Number.isSafeInteger(_[s])))
    throw new Error("Policy defaults are unavailable.");
  for (const [s, d] of Object.entries(il)) {
    const c = _[s];
    if (typeof c != "number" || !Number.isSafeInteger(c) || c < d.min || c > d.max) throw new Error(`Policy ${s} is unavailable.`);
  }
  return _;
}
const il = {
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
}, jn = { class: "form" }, Rn = {
  key: 0,
  class: "muted small pim-policy-status",
  role: "status"
}, qn = ["id", "data-policy-group", "aria-label"], Dn = {
  key: 0,
  class: "pim-bsection-head"
}, Pn = { class: "pim-policy-copy" }, Nn = ["for"], Ln = ["id"], zn = { key: 0 }, Bn = ["aria-expanded"], Mn = /* @__PURE__ */ le({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {}
  },
  setup(l) {
    const _ = l, s = B(), d = F(() => _.defaults ?? s.value), c = B(""), v = B(!1);
    async function f() {
      if (!_.defaults) {
        c.value = "", v.value = !0;
        try {
          s.value = await Tn(_.catalogId ?? "");
        } catch (y) {
          c.value = y instanceof Error ? y.message : "Could not read policy defaults.";
        } finally {
          v.value = !1;
        }
      }
    }
    We(f);
    const b = F(() => _.draft.policy ?? {}), r = B(!1), T = [
      { key: "audit", title: "Audit trail", hint: "Fields records each value change. Off records only lifecycle, schema and release history.", kind: "enum" },
      { key: "audit_days", title: "Audit retention (days)", hint: "0 uses the 365-day default. History always expires.", kind: "int", min: 0, max: 106751 },
      { key: "trash_days", title: "Trash window (days)", hint: "How long a deleted product stays restorable.", kind: "int", min: 1, max: 106751 },
      { key: "tombstone_days", title: "Deleted product notices (days)", hint: "How long feeds report a purged product as deleted.", kind: "int", min: 1, max: 106751 }
    ], D = {
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
    function z(y) {
      const O = il[y];
      return { key: y, ...O, kind: "int", hint: D[y] };
    }
    T.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(z));
    const w = ["proposal_days", "proposal_count"].map(z), x = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(z), i = [
      { id: "retention", title: "Retention", keys: T },
      { id: "proposals", title: "Proposals", keys: w },
      { id: "advanced", title: "", keys: x }
    ], o = F(() => [
      { value: "inherited", label: d.value ? `${d.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function n(y, O) {
      const M = _.draft.policy ?? (_.draft.policy = {});
      M[y] = O == null || O === "" || O === "inherited" ? !1 : O;
    }
    return (y, O) => (a(), m("section", jn, [
      O[4] || (O[4] = e("p", { class: "muted small pim-policy-intro" }, "Empty fields inherit the deployment settings.", -1)),
      v.value ? (a(), m("p", Rn, "Loading deployment defaults…")) : I("", !0),
      c.value ? (a(), q(t(pe), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: g(() => [
          N(V(c.value) + " ", 1),
          p(t(G), {
            severity: "secondary",
            outlined: "",
            onClick: f
          }, {
            default: g(() => [...O[1] || (O[1] = [
              N("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      })) : I("", !0),
      (a(), m(H, null, Z(i, (M) => (a(), m(H, {
        key: M.id
      }, [
        M.id !== "advanced" || r.value ? (a(), m("section", {
          key: 0,
          id: M.id === "advanced" ? "policy-advanced" : void 0,
          "data-policy-group": M.id,
          class: "pim-policy-group",
          "aria-label": M.title || "Advanced"
        }, [
          M.title ? (a(), m("header", Dn, [
            e("h3", null, V(M.title), 1)
          ])) : I("", !0),
          (a(!0), m(H, null, Z(M.keys, (W) => (a(), m("div", {
            key: W.key,
            class: "pim-policy-row"
          }, [
            e("div", Pn, [
              e("label", {
                for: "pol-" + W.key
              }, V(W.title), 9, Nn),
              e("p", {
                id: "pol-help-" + W.key
              }, [
                N(V(W.hint), 1),
                W.global ? (a(), m("span", zn, " Managed in deployment settings.")) : I("", !0)
              ], 8, Ln)
            ]),
            W.kind === "enum" ? (a(), q(t(ce), {
              key: 0,
              "input-id": "pol-" + W.key,
              "aria-describedby": "pol-help-" + W.key,
              class: "pim-policy-control",
              "model-value": typeof b.value[W.key] == "string" ? b.value[W.key] : "inherited",
              options: o.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": (J) => n(W.key, J)
            }, null, 8, ["input-id", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])) : (a(), q(t(Sl), {
              key: 1,
              disabled: W.global,
              "input-id": "pol-" + W.key,
              "aria-describedby": "pol-help-" + W.key,
              class: "pim-policy-control",
              "model-value": W.global ? Number(d.value?.[W.key] ?? 0) || null : typeof b.value[W.key] == "number" ? Number(b.value[W.key]) : null,
              min: W.min ?? (W.key === "audit_days" ? 0 : 1),
              max: W.max,
              step: 1,
              placeholder: d.value ? "Default: " + d.value[W.key] : "Deployment default",
              "onUpdate:modelValue": (J) => n(W.key, J)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "min", "max", "placeholder", "onUpdate:modelValue"]))
          ]))), 128))
        ], 8, qn)) : I("", !0),
        M.id === "proposals" ? (a(), m("button", {
          key: 1,
          type: "button",
          class: "pim-policy-advanced",
          "aria-expanded": r.value,
          "aria-controls": "policy-advanced",
          onClick: O[0] || (O[0] = (W) => r.value = !r.value)
        }, [
          p(t(Y), {
            icon: r.value ? "tabler:chevron-down" : "tabler:chevron-right",
            "aria-hidden": "true"
          }, null, 8, ["icon"]),
          O[2] || (O[2] = e("span", null, "Advanced", -1)),
          O[3] || (O[3] = e("span", { class: "muted small" }, "Processing limits and deployment settings", -1))
        ], 8, Bn)) : I("", !0)
      ], 64))), 64))
    ]));
  }
}), En = { class: "form" }, Fn = { class: "pim-aspect" }, Hn = /* @__PURE__ */ le({
  __name: "BuilderDeclaration",
  props: {
    draft: {}
  },
  emits: ["replace", "validity"],
  setup(l, { emit: _ }) {
    const s = l, d = _, c = B(JSON.stringify(s.draft, null, 2)), v = B("");
    Ie(() => d("validity", !0)), ue(() => s.draft, (b) => {
      c.value = JSON.stringify(b, null, 2), v.value = "";
    }, { deep: !0 });
    function f() {
      try {
        const b = ql(c.value);
        v.value = "", d("validity", !0), d("replace", b);
      } catch (b) {
        d("validity", !1), v.value = "Invalid declaration: " + (b instanceof Error ? b.message : String(b));
      }
    }
    return (b, r) => (a(), m("section", En, [
      e("div", Fn, [
        r[1] || (r[1] = e("header", { class: "pim-aspect-head" }, [
          e("h3", null, "Declaration"),
          e("span", { class: "muted small" }, "edits apply to the draft when the JSON parses")
        ], -1)),
        v.value ? (a(), q(t(pe), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: g(() => [
            N(V(v.value), 1)
          ]),
          _: 1
        })) : I("", !0),
        p(t(Al), {
          modelValue: c.value,
          "onUpdate:modelValue": r[0] || (r[0] = (T) => c.value = T),
          rows: "28",
          spellcheck: "false",
          onInput: f,
          onBlur: f,
          class: "mono pim-json-edit"
        }, null, 8, ["modelValue"])
      ])
    ]));
  }
}), Wn = {
  key: 0,
  class: "pim-detail-head"
}, Jn = { class: "pim-detail-actions" }, Kn = { class: "pim-settings-pane" }, Gn = { class: "pim-builder-main pim-readable" }, Yn = { class: "pim-error-copy" }, Zn = {
  key: 0,
  class: "pim-error-code"
}, Qn = ["aria-labelledby"], Xn = { class: "pim-group-head" }, ei = ["id"], li = { class: "pim-card-body pad" }, ti = { key: 0 }, ai = { key: 1 }, si = { key: 2 }, ni = { key: 3 }, ii = { key: 4 }, oi = { class: "pim-error-copy" }, di = { key: 0 }, ri = {
  key: 6,
  class: "pim-plan-list"
}, ui = { key: 1 }, ci = {
  key: 7,
  class: "row end"
}, mi = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, pi = ["disabled", "inert"], fi = /* @__PURE__ */ le({
  __name: "SchemaBuilder",
  props: {
    catalogId: {},
    embedded: { type: Boolean },
    title: {},
    backLabel: {}
  },
  emits: ["applied", "back", "dirty-changed"],
  setup(l, { emit: _ }) {
    const s = l, d = _, c = [
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
    ], v = B("fields"), f = B(null), b = B(null), r = B({}), T = B({}), D = B({}), z = F(() => Object.fromEntries(Object.entries(D.value).filter(([C]) => r.value.plugins?.some((P) => P.use === C) && !f.value?.plugins.some((P) => P.plugin === C && P.active)))), w = B(null), x = B(null), i = B(!1), o = B(""), n = B(null), y = B(null), O = Ce(), M = {
      unchanged: "No changes",
      initial: "First schema",
      cosmetic: "Presentation only",
      additive: "New fields or options",
      semantic: "Affects product data",
      refused: "Changes blocked"
    }, W = {
      "attribute order": "Field order",
      cardinality: "Number of values",
      default: "Default value",
      scope: "Dimensions",
      form: "Value format",
      index: "Index settings",
      type: "Field type",
      unique: "Unique values",
      width: "Width"
    }, J = B(null), ae = B(!0), R = qe(), $ = F(() => ae.value && !!n.value && n.value.class !== "refused" && !!J.value?.matches(Ve.value, f.value?.schema_generation ?? -1, z.value)), h = F(() => n.value ? [...n.value.refused, ...n.value.changes.filter((C) => C.class !== "refused")] : []), u = qe(), j = B(!1);
    let E = 0;
    ue([r, T, D], () => {
      E++, n.value = null;
    }, { deep: !0, flush: "sync" });
    async function Q(C = !1, P = !1) {
      if (re.value && !C) return;
      const L = u.begin(), fe = E, ve = s.catalogId, be = P ? Object.entries(D.value).filter(([ye]) => f.value?.plugins.some((Te) => Te.plugin === ye && Te.active)) : [];
      j.value = !0, w.value = null;
      try {
        const [ye, Te] = await Promise.all([se.schema(ve), se.schemaOptions(ve)]);
        if (!u.current(L) || fe !== E || ve !== s.catalogId) return;
        f.value = ye, b.value = Te, r.value = je(ye.declaration), T.value = {}, D.value = Object.fromEntries(be.filter(([ol]) => ye.plugins.some((Ge) => Ge.plugin === ol && Ge.active))), n.value = null, ae.value = !0;
      } catch (ye) {
        u.current(L) && (w.value = we(ye, "Could not load the schema."));
      } finally {
        u.current(L) && (j.value = !1);
      }
    }
    let de = () => {
    };
    ue(() => s.catalogId, (C) => {
      de(), de = tl(`component.${C}`, () => {
        re.value || Q();
      });
    }, { immediate: !0 }), Fe(async () => {
      re.value || await Q();
    }), Ie(() => {
      de(), R.begin(), u.begin();
    }), ue(() => s.catalogId, () => {
      R.begin(), i.value = !1, f.value = null, b.value = null, k(), Q();
    });
    const De = F(() => Object.values(Ze(r.value, T.value)).reduce((C, P) => C + (P?.length ?? 0), 0)), re = F(() => !!f.value && (JSON.stringify(r.value) !== JSON.stringify(f.value.declaration) || De.value > 0 || Object.keys(D.value).length > 0));
    ue(re, (C) => d("dirty-changed", C), { immediate: !0 });
    const Pe = F(() => ![r.value.aspects, r.value.dimensions, r.value.vocabularies, r.value.families, r.value.channels, r.value.sources, r.value.plugins, r.value.scopes].some((C) => C?.length)), Ve = F(() => {
      const C = je(r.value), P = Ze(C, T.value);
      return Object.keys(P).length && (C.remove = P), C;
    });
    ue(re, (C) => {
      C || (n.value = null);
    }), ue([Ve, z], () => {
      n.value = null;
    }, { deep: !0 });
    function Ne(C) {
      const [P, L] = C.split(" ", 2);
      if (P === "plugin" && L) return b.value?.plugins.find((be) => be.plugin === L)?.title || "Plugin";
      if (P === "scope" && L) return b.value?.scopes.find((be) => be.id === L)?.title || "Scope";
      if (P === "aspect" && L) return K(L) + " field group";
      const [fe, ve] = C.split(".", 2);
      return ve ? `${K(ve)} (${K(fe)})` : K(C);
    }
    async function S() {
      if (!f.value || !ae.value) return;
      const C = R.begin(), P = Tl(Ve.value, f.value.schema_generation, z.value);
      i.value = !0, w.value = null;
      try {
        const L = await se.planSchema(s.catalogId, P.declaration, P.generation, P.pluginConfigs);
        if (!R.current(C) || !P.matches(Ve.value, f.value.schema_generation, z.value) || !ae.value) return;
        J.value = P, n.value = L, await Le(), y.value?.focus();
      } catch (L) {
        if (!R.current(C)) return;
        w.value = we(L, "Could not review the change."), n.value = null, J.value = null, await Le(), x.value?.$el.focus();
      } finally {
        R.current(C) && (i.value = !1);
      }
    }
    async function A() {
      if (!f.value || !re.value || !$.value || !J.value) return;
      const C = s.catalogId, P = R.begin();
      i.value = !0, w.value = null, o.value = "";
      try {
        const L = await se.applySchema(C, J.value.declaration, J.value.generation, J.value.pluginConfigs);
        if (C !== s.catalogId || !R.current(P) || (await Q(!0, !0), C !== s.catalogId || !R.current(P))) return;
        o.value = `Applied as generation ${L.generation}`, d("applied", L.generation);
      } catch (L) {
        if (C !== s.catalogId || !R.current(P)) return;
        w.value = we(L, "Could not apply the change."), await Le(), x.value?.$el.focus();
      } finally {
        R.current(P) && (i.value = !1);
      }
    }
    async function U(C, P) {
      const L = s.catalogId, fe = u.begin(), ve = R.begin();
      i.value = !0, w.value = null;
      try {
        const be = JSON.stringify(P);
        if (await se.configurePlugin(L, C, je(P)), L !== s.catalogId || !u.current(fe)) return;
        const ye = await se.schema(L);
        if (L !== s.catalogId || !u.current(fe)) return;
        f.value && (f.value.plugins = ye.plugins), JSON.stringify(D.value[C]) === be && delete D.value[C], o.value = "Configuration saved";
      } catch (be) {
        L === s.catalogId && R.current(ve) && (w.value = we(be, "Could not save configuration."));
      } finally {
        R.current(ve) && (i.value = !1);
      }
    }
    function k() {
      D.value = {}, ae.value = !0, f.value && (r.value = je(f.value.declaration)), T.value = {}, n.value = null, o.value = "";
    }
    function X(C, P) {
      const L = T.value[C] ?? [];
      L.includes(P) || (T.value = { ...T.value, [C]: [...L, P] });
    }
    return (C, P) => (a(), m("div", {
      class: ge(["pim-builder", { embedded: l.embedded }])
    }, [
      l.embedded ? (a(), m("div", Wn, [
        e("h2", null, V(l.title || "Catalog"), 1),
        p(t(te), {
          severity: "secondary",
          value: "Generation " + (f.value?.schema_generation ?? "…")
        }, null, 8, ["value"]),
        e("div", Jn, [
          ne(C.$slots, "actions", {
            access: f.value?.access
          }),
          p(el, {
            access: f.value?.access,
            dirty: re.value,
            busy: i.value,
            valid: ae.value,
            reviewed: !!n.value,
            onDiscard: k,
            onReview: S
          }, null, 8, ["access", "dirty", "busy", "valid", "reviewed"])
        ])
      ])) : (a(), q($t, {
        key: 1,
        title: l.title || "Catalog",
        subtitle: "Settings · generation " + (f.value?.schema_generation ?? "…"),
        icon: "tabler:settings",
        "back-label": l.backLabel,
        onBack: P[0] || (P[0] = (L) => d("back"))
      }, {
        default: g(() => [
          ne(C.$slots, "actions", {
            access: f.value?.access
          }),
          p(el, {
            access: f.value?.access,
            dirty: re.value,
            busy: i.value,
            valid: ae.value,
            reviewed: !!n.value,
            onDiscard: k,
            onReview: S
          }, null, 8, ["access", "dirty", "busy", "valid", "reviewed"])
        ]),
        _: 3
      }, 8, ["title", "subtitle", "back-label"])),
      p(t(_l), {
        value: v.value,
        "onUpdate:value": P[1] || (P[1] = (L) => v.value = L),
        class: "pim-section-tabs"
      }, {
        default: g(() => [
          p(t($l), { "aria-label": "Schema sections" }, {
            default: g(() => [
              (a(), m(H, null, Z(c, (L) => p(t(wl), {
                key: L.id,
                value: L.id
              }, {
                default: g(() => [
                  N(V(L.title), 1)
                ]),
                _: 2
              }, 1032, ["value"])), 64))
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["value"]),
      e("div", Kn, [
        e("div", Gn, [
          w.value ? (a(), q(t(pe), {
            key: 0,
            ref_key: "errorPanel",
            ref: x,
            severity: "error",
            role: "alert",
            tabindex: "-1"
          }, {
            default: g(() => [
              e("span", Yn, [
                N(V(w.value.message) + " ", 1),
                w.value.code ? (a(), m("span", Zn, [
                  P[5] || (P[5] = N("Code ", -1)),
                  e("code", null, V(w.value.code), 1)
                ])) : I("", !0)
              ])
            ]),
            _: 1
          }, 512)) : I("", !0),
          o.value ? (a(), q(t(pe), {
            key: 1,
            severity: "success"
          }, {
            default: g(() => [
              N(V(o.value), 1)
            ]),
            _: 1
          })) : I("", !0),
          n.value ? (a(), m("section", {
            key: 2,
            class: "pim-table pim-plan",
            "aria-labelledby": t(O)
          }, [
            e("div", Xn, [
              p(t(Y), {
                icon: "tabler:checklist",
                "aria-hidden": "true"
              }),
              e("h3", {
                id: t(O),
                ref_key: "reviewHeading",
                ref: y,
                tabindex: "-1"
              }, "Review changes", 8, ei),
              p(t(te), {
                class: "kx-tag-sm",
                severity: n.value.class === "refused" ? "danger" : n.value.class === "semantic" ? "warn" : "info"
              }, {
                default: g(() => [
                  N(V(M[n.value.class] || "Schema changes"), 1)
                ]),
                _: 1
              }, 8, ["severity"])
            ]),
            e("div", li, [
              n.value.class === "unchanged" ? (a(), m("p", ti, "Nothing would change.")) : n.value.class === "initial" ? (a(), m("p", ai, "This will set up the first schema.")) : n.value.class === "cosmetic" ? (a(), m("p", si, "These changes leave stored product values as they are.")) : n.value.class === "additive" ? (a(), m("p", ni, "Existing product values stay as they are.")) : n.value.class === "semantic" ? (a(), m("p", ii, "The catalog will recalculate product values or readiness after you apply these changes.")) : n.value.class === "refused" ? (a(), q(t(pe), {
                key: 5,
                severity: "error"
              }, {
                default: g(() => [
                  e("span", oi, [
                    P[6] || (P[6] = N(" These changes can’t be applied. ", -1)),
                    n.value.migration && n.value.refused.some((L) => f.value?.attributes[L.code]) ? (a(), m("span", di, " To change how a field stores values, add a new field and copy the existing values into it. Then remove the original field and give the new field its name. ")) : I("", !0)
                  ])
                ]),
                _: 1
              })) : I("", !0),
              h.value.length ? (a(), m("ul", ri, [
                (a(!0), m(H, null, Z(h.value, (L, fe) => (a(), m("li", { key: fe }, [
                  L.class === "refused" ? (a(), q(t(te), {
                    key: 0,
                    class: "kx-tag-sm small",
                    severity: "danger"
                  }, {
                    default: g(() => [...P[7] || (P[7] = [
                      N("Blocked", -1)
                    ])]),
                    _: 1
                  })) : I("", !0),
                  L.code ? (a(), m("strong", ui, V(Ne(L.code)), 1)) : I("", !0),
                  e("span", null, V(W[L.what] || L.what), 1)
                ]))), 128))
              ])) : I("", !0),
              f.value?.access.admin && n.value.class !== "refused" ? (a(), m("div", ci, [
                p(t(G), {
                  disabled: !re.value || i.value || !$.value,
                  loading: i.value,
                  onClick: A
                }, {
                  default: g(() => [
                    N(V(v.value === "layout" ? "Apply layout" : "Apply"), 1)
                  ]),
                  _: 1
                }, 8, ["disabled", "loading"])
              ])) : I("", !0)
            ])
          ], 8, Qn)) : I("", !0),
          j.value && (!f.value || !b.value) ? (a(), m("div", mi, "Loading…")) : (!f.value || !b.value) && w.value ? (a(), q(t(G), {
            key: 4,
            onClick: P[2] || (P[2] = (L) => Q()),
            severity: "secondary",
            outlined: ""
          }, {
            default: g(() => [...P[8] || (P[8] = [
              N("Retry", -1)
            ])]),
            _: 1
          })) : f.value && b.value && v.value === "history" ? (a(), q(bt, {
            key: 5,
            "catalog-id": l.catalogId
          }, null, 8, ["catalog-id"])) : f.value && b.value ? (a(), m("fieldset", {
            key: 6,
            class: "pim-editor-surface",
            disabled: i.value || !f.value.access.admin,
            inert: i.value || !f.value.access.admin
          }, [
            Pe.value && v.value === "fields" ? (a(), q(t(pe), {
              key: 0,
              severity: "info"
            }, {
              default: g(() => [...P[9] || (P[9] = [
                N("Define its schema. Add a field group to start defining fields.", -1)
              ])]),
              _: 1
            })) : I("", !0),
            v.value === "fields" ? (a(), q(Na, {
              key: 1,
              draft: r.value,
              schema: f.value,
              options: b.value,
              onRemove: X
            }, null, 8, ["draft", "schema", "options"])) : v.value === "layout" ? (a(), q(Xl, {
              key: 2,
              draft: r.value,
              schema: f.value,
              types: b.value.types
            }, null, 8, ["draft", "schema", "types"])) : v.value === "dimensions" ? (a(), q(Ka, {
              key: 3,
              draft: r.value,
              schema: f.value,
              onRemove: X
            }, null, 8, ["draft", "schema"])) : v.value === "vocabularies" ? (a(), q(vs, {
              key: 4,
              "catalog-id": l.catalogId,
              draft: r.value,
              schema: f.value,
              onRemove: X
            }, null, 8, ["catalog-id", "draft", "schema"])) : v.value === "families" ? (a(), q(Hs, {
              key: 5,
              draft: r.value,
              schema: f.value,
              options: b.value,
              onRemove: X
            }, null, 8, ["draft", "schema", "options"])) : v.value === "channels" ? (a(), q($n, {
              key: 6,
              "catalog-id": l.catalogId,
              draft: r.value,
              schema: f.value,
              onRemove: X
            }, null, 8, ["catalog-id", "draft", "schema"])) : v.value === "plugins" ? (a(), q(In, {
              key: 7,
              draft: r.value,
              schema: f.value,
              options: b.value,
              "plugin-configs": D.value,
              onConfigure: U,
              onRemove: X
            }, null, 8, ["draft", "schema", "options", "plugin-configs"])) : v.value === "policy" ? (a(), q(Mn, {
              key: 8,
              "catalog-id": l.catalogId,
              draft: r.value
            }, null, 8, ["catalog-id", "draft"])) : v.value === "declaration" ? (a(), q(Hn, {
              key: 9,
              draft: r.value,
              onReplace: P[3] || (P[3] = (L) => r.value = L),
              onValidity: P[4] || (P[4] = (L) => {
                ae.value = L, n.value = null;
              })
            }, null, 8, ["draft"])) : I("", !0)
          ], 8, pi)) : I("", !0)
        ])
      ])
    ], 2));
  }
}), vi = /* @__PURE__ */ le({
  __name: "SettingsApp",
  setup(l) {
    const _ = cl(), s = ml(), d = B(""), c = F(() => _.value.catalogId ?? ""), v = qe();
    async function f() {
      const b = v.begin(), r = c.value;
      try {
        const T = await se.catalogSummary(r);
        v.current(b) && (d.value = T?.title || "Untitled catalog");
      } catch {
        v.current(b) && (d.value = "Untitled catalog");
      }
    }
    return ue(c, () => {
      d.value = "", f();
    }), Fe(f), Ie(() => {
      v.begin();
    }), (b, r) => c.value ? (a(), q(fi, {
      key: c.value,
      "catalog-id": c.value,
      title: d.value || "Catalog",
      embedded: t(_).embedded,
      "back-label": t(_).embedded ? void 0 : "Back to catalog settings",
      onBack: r[0] || (r[0] = (T) => t(s)("navigate", { route: "" })),
      onDirtyChanged: r[1] || (r[1] = (T) => t(s)("dirty-changed", { dirty: T }))
    }, {
      actions: g(({ access: T }) => [
        T?.admin ? (a(), q(Il, {
          key: 0,
          "catalog-id": c.value,
          title: d.value || "Catalog"
        }, null, 8, ["catalog-id", "title"])) : I("", !0)
      ]),
      _: 1
    }, 8, ["catalog-id", "title", "embedded", "back-label"])) : I("", !0);
  }
});
class bi extends pl {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "catalog-id": { type: "string", default: "" }, embedded: { type: "boolean", default: !1 } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: fl
    };
  }
  static get vueConfig() {
    return { rootComponent: vi, plugins: [vl] };
  }
}
Vl(import.meta.url, bi);
