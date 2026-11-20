import { e as na, c as fa, u as Ze, _ as Ee, r as ze, p as oe, a as Se, b as ba, g as ya, S as ga, d as ha, f as ka, W as _a, s as $a, P as wa } from "./styles-DXPC0Ax5.js";
import { defineComponent as le, ref as J, openBlock as e, createElementBlock as i, Fragment as F, createVNode as g, unref as s, withCtx as h, createTextVNode as z, createCommentVNode as w, createBlock as R, toDisplayString as V, computed as M, renderList as Q, createElementVNode as a, withModifiers as be, normalizeStyle as We, normalizeClass as ke, useId as Ae, watch as ce, onUnmounted as De, resolveDynamicComponent as xa, renderSlot as de, withKeys as Qe, provide as Ca, inject as Va, useModel as Ua, mergeModels as la, createSlots as ue, toRaw as Sa, onMounted as oa, nextTick as Je } from "vue";
import Z from "primevue/button";
import $e from "primevue/message";
import { Icon as X } from "@iconify/vue";
import ie from "primevue/tag";
import Aa from "primevue/tabs";
import Oa from "primevue/tablist";
import Ia from "primevue/tab";
import Xe from "primevue/selectbutton";
import { on as da, host as ua, loadByTagName as Ra, define as ja } from "@wippy-fe/proxy";
import Re from "primevue/inputtext";
import Ta from "primevue/multiselect";
import qe from "primevue/toggleswitch";
import ve from "primevue/select";
import qa from "primevue/inputnumber";
import Da from "primevue/textarea";
const Na = ["config"], Pa = /* @__PURE__ */ le({
  __name: "CatalogShare",
  props: {
    catalogId: {},
    title: {}
  },
  setup(l) {
    const k = l, t = J(!1), u = J(!1), r = J("");
    async function v() {
      u.value = !0, r.value = "", await na("kickside-share") ? t.value = !0 : r.value = "Could not open sharing. Try Share again.", u.value = !1;
    }
    return (n, p) => (e(), i(F, null, [
      g(s(Z), {
        type: "button",
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: u.value,
        onClick: v
      }, {
        default: h(() => [...p[1] || (p[1] = [
          z("Share", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      t.value ? (e(), i("kickside-share", {
        key: 0,
        config: JSON.stringify({ resource_id: k.catalogId, title: k.title, access_url: `/api/v1/component-access/grants/${encodeURIComponent(k.catalogId)}`, share_url: `/api/v1/component-access/share/${encodeURIComponent(k.catalogId)}` }),
        onClose: p[0] || (p[0] = (m) => t.value = !1)
      }, null, 40, Na)) : w("", !0),
      r.value ? (e(), R(s($e), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: h(() => [
          z(V(r.value), 1)
        ]),
        _: 1
      })) : w("", !0)
    ], 64));
  }
});
function La(l, k, t = {}) {
  const u = JSON.stringify(l), r = JSON.stringify(t);
  return {
    declaration: JSON.parse(u),
    generation: k,
    pluginConfigs: JSON.parse(r),
    matches: (v, n, p = {}) => k === n && u === JSON.stringify(v) && r === JSON.stringify(p)
  };
}
function ta(l, k) {
  const t = {};
  for (const [u, r] of Object.entries(k)) {
    const v = r.filter((n) => u === "plugins" ? !l.plugins?.some((p) => p.use === n) : u === "scopes" ? !l.scopes?.includes(n) : u === "attributes" ? !l.aspects?.some((p) => p.attributes?.some((m) => p.namespace + "." + m.code === n)) : u === "aspects" ? !l.aspects?.some((p) => p.namespace === n) : u === "dimensions" ? !l.dimensions?.some((p) => p.name === n) : u === "vocabularies" || u === "families" ? !l[u]?.some((p) => p.code === n) : !l[u]?.some((p) => p.id === n));
    v.length && (t[u] = v);
  }
  return t;
}
const sa = (l) => !!l && typeof l == "object" && !Array.isArray(l), ae = ["string"], ra = { "*": "string" }, za = { id: "number", code: "string!", type: "string!", scope: ae, cardinality: "string", index: "string", index_contexts: [ra], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, Ba = {
  dimensions: [{ name: "string!", members: ae, fallback: { "*": ae } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: ae }, attributes: [za] }],
  families: [{ code: "string!", aspects: ae, variation: [{ axes: ae, own: ae }], requirements: [{ id: "string!", context: ra, require: ae, authored: ae }], checks: [{ check: "string!", reads: ae, cost: "string", config: "object", enforce: "string" }] }],
  sources: [{ id: "string!", ordering: "string", writes: ae, principals: ae, audit: "boolean" }],
  channels: [{ id: "string!", requirements: ae, families: ae }],
  plugins: [{ use: "string!", schema: "json" }],
  scopes: ae,
  policy: { "*": "policy" },
  remove: { dimensions: ae, vocabularies: ae, aspects: ae, families: ae, sources: ae, channels: ae, attributes: ae, scopes: ae, plugins: ae }
};
function Ke(l, k, t) {
  if (typeof k == "string") {
    const u = k.replace("!", "");
    if (!(u === "json" || (u === "object" ? sa(l) : u === "policy" ? l === !1 || typeof l == "string" || typeof l == "number" : typeof l === u)) || k.endsWith("!") && (typeof l != "string" || !l.trim())) throw new Error(`${t} has an invalid ${u} value.`);
  } else if (Array.isArray(k)) {
    if (!Array.isArray(l)) throw new Error(`${t} must be an array.`);
    l.forEach((u, r) => Ke(u, k[0], `${t}[${r}]`));
  } else {
    if (!sa(l)) throw new Error(`${t} must be an object.`);
    for (const [u, r] of Object.entries(k)) if (typeof r == "string" && r.endsWith("!") && l[u] === void 0) throw new Error(`${t}.${u} is required.`);
    for (const [u, r] of Object.entries(l)) {
      const v = k[u] ?? k["*"];
      if (!v) throw new Error(`${t}.${u} is not an editor field.`);
      Ke(r, v, `${t}.${u}`);
    }
  }
}
function Ea(l) {
  const k = JSON.parse(l);
  Ke(k, Ba, "Declaration");
  const t = k;
  for (const u of t.dimensions ?? []) u.members ??= [];
  return t;
}
function Pe(l) {
  return JSON.parse(JSON.stringify(l));
}
const Ma = /^[a-z][a-z0-9_]*$/;
function Ve(l, k, t) {
  t.length ? l[k] = t : delete l[k];
}
function Ue(l, k, t) {
  if (t < 0 || t >= l.length || k === t) return;
  const [u] = l.splice(k, 1);
  l.splice(t, 0, u);
}
function me(l, k) {
  return !l || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(l) ? k : l;
}
function Te(l) {
  return l ? me(l.title, "Field type") : "Unknown type";
}
async function ca(l, k) {
  const t = [...new Set(k)].map((r) => ({ type: "user", id: r }));
  if (!t.length) return {};
  const u = await fa(`/api/v1/pim-admin/catalogs/${encodeURIComponent(l)}/principal_labels`, { refs: t }, "People");
  return Object.fromEntries((u.principals ?? []).map((r) => [r.id, me(r.label, "Person")]));
}
const Le = [
  { value: "quarter", label: "¼", span: 3 },
  { value: "third", label: "⅓", span: 4 },
  { value: "half", label: "½", span: 6 },
  { value: "full", label: "1", span: 12 }
];
function Ge(l, k, t) {
  return t.width ?? l.attributes[k + "." + t.code]?.width ?? "half";
}
const Fa = (l) => new Date(l).toLocaleString();
function Ye(l) {
  const k = Math.abs(l.m).toString(), t = l.m < 0 ? "-" : "";
  if (l.e >= 0) return t + k + "0".repeat(l.e);
  const u = -l.e, r = k.padStart(u + 1, "0");
  return t + r.slice(0, r.length - u) + "." + r.slice(r.length - u);
}
function G(l) {
  const t = (l.includes(".") ? l.slice(l.indexOf(".") + 1) : l).replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : l;
}
function je(l) {
  return l.labels.en ?? Object.values(l.labels)[0] ?? l.code;
}
function Be(l, k) {
  if (l == null) return "";
  const t = (u) => {
    if (u == null) return "";
    if (typeof u == "object" && "ref" in u) {
      const r = u;
      if (r.ref[0] === "term") {
        const v = r.ref[1].slice(r.ref[1].indexOf(":") + 1), n = r.ref[1].slice(0, r.ref[1].indexOf(":")), p = k?.[n]?.find((m) => m.code === v);
        return p ? je(p) : v;
      }
      return "Linked " + G(r.ref[0]).toLocaleLowerCase();
    }
    if (typeof u == "object" && "v" in u) {
      const r = u;
      return Ye(r.v) + " " + r.u;
    }
    return typeof u == "object" && "m" in u ? Ye(u) : typeof u == "boolean" ? u ? "Yes" : "No" : typeof u == "object" ? JSON.stringify(u) : me(String(u), "Linked record");
  };
  return Array.isArray(l) ? l.map(t).join(", ") : t(l);
}
function Ha(l, k, t) {
  const u = Be(k), r = Be(t);
  return !r && u ? `${l} cleared (was ${u})` : u ? `${l}: ${u} → ${r}` : `${l} set to ${r}`;
}
const Ja = { class: "pim-table form pim-layout" }, Wa = {
  key: 0,
  class: "pim-layout-help muted"
}, Ka = {
  key: 1,
  class: "kx-empty"
}, Ga = { class: "pim-aspect-head" }, Ya = {
  key: 0,
  class: "muted small"
}, Za = ["draggable", "onDragstart", "onDragover", "onDrop"], Qa = { class: "pim-lcard-top" }, Xa = {
  key: 0,
  class: "pim-grip",
  "aria-hidden": "true"
}, el = { class: "pim-lcard-name" }, al = { class: "pim-lcard-type" }, ll = {
  key: 1,
  class: "pim-lcard-move"
}, tl = { class: "pim-aspect-head" }, sl = { class: "pim-canvas" }, il = { class: "pim-lcard-top" }, nl = { class: "pim-lcard-name" }, ol = { class: "pim-lcard-type" }, dl = /* @__PURE__ */ le({
  __name: "LayoutEditor",
  props: {
    draft: {},
    schema: {},
    types: {}
  },
  setup(l) {
    const k = l, t = M(() => k.schema.access.admin), u = M(() => k.draft?.aspects ?? []), r = M(() => new Map(k.types.map((I) => [I.id, Te(I)]))), v = M(() => {
      if (!k.schema) return [];
      const I = new Set((k.draft?.aspects ?? []).map((f) => f.namespace)), b = /* @__PURE__ */ new Map();
      for (const [f, d] of Object.entries(k.schema.attributes)) {
        const c = f.split(".")[0];
        I.has(c) || !d.plugin || (b.has(c) || b.set(c, { aspect: c, plugin: d.plugin, codes: [] }), b.get(c).codes.push(f));
      }
      return [...b.values()];
    });
    function n(I, b) {
      return Le.find((f) => f.value === Ge(k.schema, I, b))?.span ?? 6;
    }
    const p = J(null), m = J(null);
    function C(I, b, f) {
      t.value && (p.value = { ns: I, index: b }, f.dataTransfer?.setData("text/plain", I + ":" + b), f.dataTransfer && (f.dataTransfer.effectAllowed = "move"));
    }
    function j(I, b, f) {
      !p.value || p.value.ns !== I || (f.preventDefault(), m.value = { ns: I, index: b });
    }
    function K(I, b) {
      t.value && p.value?.ns === I.namespace && Ue(I.attributes ?? [], p.value.index, b), p.value = null, m.value = null;
    }
    function x() {
      p.value = null, m.value = null;
    }
    return (I, b) => (e(), i("div", Ja, [
      t.value ? (e(), i("p", Wa, "Arrange fields within each group and choose their widths. Review changes before applying the layout.")) : w("", !0),
      u.value.length === 0 ? (e(), i("div", Ka, [
        b[1] || (b[1] = z("This catalog has no field groups yet.", -1)),
        t.value ? (e(), i(F, { key: 0 }, [
          z(" Add a field group in Fields.")
        ], 64)) : w("", !0)
      ])) : w("", !0),
      (e(!0), i(F, null, Q(u.value, (f) => (e(), i("section", {
        key: f.namespace,
        class: "pim-aspect"
      }, [
        a("header", Ga, [
          a("h3", null, V(s(G)(f.namespace)), 1),
          t.value ? (e(), i("span", Ya, "drag a field, or use its arrows")) : w("", !0)
        ]),
        a("div", {
          class: "pim-canvas",
          onDragover: b[0] || (b[0] = be(() => {
          }, ["prevent"]))
        }, [
          (e(!0), i(F, null, Q(f.attributes ?? [], (d, c) => (e(), i("div", {
            key: d.code,
            class: ke(["pim-lcard", { dragging: p.value?.ns === f.namespace && p.value?.index === c, over: m.value?.ns === f.namespace && m.value?.index === c }]),
            style: We({ gridColumn: "span " + n(f.namespace, d) }),
            draggable: t.value,
            onDragstart: (o) => C(f.namespace, c, o),
            onDragover: (o) => j(f.namespace, c, o),
            onDrop: be((o) => K(f, c), ["prevent"]),
            onDragend: x
          }, [
            a("div", Qa, [
              t.value ? (e(), i("span", Xa, [
                g(s(X), { icon: "tabler:grip-vertical" })
              ])) : w("", !0),
              a("span", el, V(s(G)(d.code)), 1),
              a("span", al, V(r.value.get(d.type) ?? s(Te)(void 0)), 1),
              t.value ? (e(), i("span", ll, [
                g(s(Z), {
                  type: "button",
                  disabled: c === 0,
                  "aria-label": "Move " + s(G)(d.code) + " earlier",
                  onClick: (o) => s(Ue)(f.attributes ?? [], c, c - 1),
                  class: "arrow",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: h(() => [
                    g(s(X), { icon: "tabler:arrow-left" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                g(s(Z), {
                  type: "button",
                  disabled: c === (f.attributes ?? []).length - 1,
                  "aria-label": "Move " + s(G)(d.code) + " later",
                  onClick: (o) => s(Ue)(f.attributes ?? [], c, c + 1),
                  class: "arrow",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: h(() => [
                    g(s(X), { icon: "tabler:arrow-right" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ])) : w("", !0)
            ]),
            g(s(Xe), {
              disabled: !t.value,
              "model-value": s(Ge)(l.schema, f.namespace, d),
              options: s(Le),
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Width of " + s(G)(d.code),
              "onUpdate:modelValue": (o) => d.width = o
            }, null, 8, ["disabled", "model-value", "options", "aria-label", "onUpdate:modelValue"])
          ], 46, Za))), 128))
        ], 32)
      ]))), 128)),
      (e(!0), i(F, null, Q(v.value, (f) => (e(), i("section", {
        key: f.aspect,
        class: "pim-aspect"
      }, [
        a("header", tl, [
          a("h3", null, V(s(G)(f.aspect)), 1),
          b[2] || (b[2] = a("span", { class: "muted small" }, "Provided by a plugin", -1))
        ]),
        a("div", sl, [
          (e(!0), i(F, null, Q(f.codes, (d) => (e(), i("div", {
            key: d,
            class: "pim-lcard fixed",
            style: We({ gridColumn: "span " + (s(Le).find((c) => c.value === l.schema.attributes[d].width)?.span ?? 6) })
          }, [
            a("div", il, [
              a("span", nl, V(s(G)(d)), 1),
              a("span", ol, V(r.value.get(l.schema.attributes[d].type) ?? s(Te)(void 0)), 1)
            ])
          ], 4))), 128))
        ])
      ]))), 128))
    ]));
  }
}), ul = {
  class: "pim-history",
  "aria-label": "Catalog history"
}, rl = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, cl = { class: "pim-table pim-responsive-table" }, ml = ["id"], pl = ["aria-labelledby"], vl = {
  key: 0,
  scope: "col"
}, fl = { class: "muted small" }, bl = ["datetime"], yl = {
  key: 0,
  class: "small"
}, gl = {
  key: 0,
  class: "muted"
}, hl = { class: "mono small" }, kl = {
  key: 0,
  class: "muted"
}, _l = {
  key: 0,
  class: "muted small"
}, $l = ["aria-labelledby"], wl = { class: "pim-stacked-meta muted small" }, xl = { key: 0 }, Cl = { key: 1 }, Vl = ["datetime"], Ul = {
  key: 1,
  class: "kx-empty"
}, Sl = { class: "pim-table-foot" }, Al = /* @__PURE__ */ le({
  __name: "HistoryPanel",
  props: {
    catalogId: {},
    canResolveActors: { type: Boolean }
  },
  setup(l) {
    const k = l, t = J([]), u = J({}), r = J(), v = J(!1), n = J(), p = ze(), m = Ae(), C = M(() => t.value.map((b) => ({
      key: `${b.seq}:${b.n}`,
      at: b.at,
      date: Fa(b.at),
      actor: u.value[b.actor] ?? me(b.actor, "Person"),
      source: b.source,
      product: K(b),
      context: b.ctx,
      change: x(b)
    })));
    async function j(b = !1) {
      const f = p.begin();
      v.value = !0, n.value = void 0;
      try {
        const d = await oe.history(k.catalogId, { limit: 50, before: b ? r.value : void 0 });
        if (!p.current(f)) return;
        if (t.value = b ? [...t.value, ...d.entries] : d.entries, r.value = d.next, k.canResolveActors)
          try {
            const c = await ca(k.catalogId, d.entries.map((o) => o.actor));
            p.current(f) && (u.value = { ...u.value, ...c });
          } catch {
          }
      } catch (d) {
        if (!p.current(f)) return;
        n.value = Se(d, "Could not load the history.");
      } finally {
        p.current(f) && (v.value = !1);
      }
    }
    function K(b) {
      return b.sku ? b.sku : b.subject.startsWith("p:") ? "purged product" : b.subject.startsWith("t:") ? b.subject.slice(2) : b.subject.startsWith("r:") ? "Release" : me(b.subject, "Catalog");
    }
    function x(b) {
      if (b.attribute)
        return Ha(G(b.attribute), b.before, b.after);
      switch (b.kind) {
        case "schema":
          return "Schema generation " + String(b.after?.generation ?? "");
        case "term": {
          const f = b.after ?? {}, d = f.labels?.en ?? Object.values(f.labels ?? {})[0];
          return f.retired ? "Term retired" : d ? `Term labelled "${d}"` + (f.parent ? ` under ${f.parent}` : "") : "Term changed";
        }
        case "created": {
          const f = b.after ?? {};
          return `Created as ${G(f.family ?? "product")}` + (f.level ? ` at level ${f.level}` : "");
        }
        case "released": {
          const f = b.after ?? {};
          return `Released v${f.version ?? ""} to ${(f.channels ?? []).join(", ")}`;
        }
        case "withdrawn":
          return `Withdrawn from ${((b.after ?? {}).channels ?? []).join(", ")}`;
        case "status":
          return `Status ${String(b.before ?? "")} → ${String(b.after ?? "")}`;
        case "moved":
          return "Moved under another parent";
        default:
          return G(b.kind);
      }
    }
    let I = () => {
    };
    return ce(() => k.catalogId, () => {
      I(), p.begin(), t.value = [], u.value = {}, r.value = void 0, n.value = void 0, I = da(`component.${k.catalogId}`, () => {
        j();
      });
    }, { immediate: !0 }), ce(() => k.catalogId, () => {
      j();
    }), Ze(() => j()), De(() => {
      I(), p.begin();
    }), (b, f) => (e(), i("section", ul, [
      n.value ? (e(), R(Ee, {
        key: 0,
        error: n.value
      }, {
        default: h(() => [
          g(s(Z), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: f[0] || (f[0] = (d) => j())
          }, {
            default: h(() => [...f[2] || (f[2] = [
              z("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : w("", !0),
      v.value ? (e(), i("div", rl, "Loading history…")) : w("", !0),
      a("div", cl, [
        a("p", {
          id: s(m),
          class: "pim-history-caption muted small"
        }, "Catalog changes, newest first", 8, ml),
        C.value.length ? (e(), i(F, { key: 0 }, [
          a("table", {
            class: "pim-grid",
            "aria-labelledby": s(m)
          }, [
            a("thead", null, [
              a("tr", null, [
                f[3] || (f[3] = a("th", { scope: "col" }, "When", -1)),
                l.canResolveActors ? (e(), i("th", vl, "Who")) : w("", !0),
                f[4] || (f[4] = a("th", { scope: "col" }, "What", -1)),
                f[5] || (f[5] = a("th", { scope: "col" }, "Change", -1))
              ])
            ]),
            a("tbody", null, [
              (e(!0), i(F, null, Q(C.value, (d) => (e(), i("tr", {
                key: d.key
              }, [
                a("td", fl, [
                  a("time", {
                    datetime: d.at
                  }, V(d.date), 9, bl)
                ]),
                l.canResolveActors ? (e(), i("td", yl, [
                  z(V(d.actor), 1),
                  d.source ? (e(), i("span", gl, " via " + V(d.source), 1)) : w("", !0)
                ])) : w("", !0),
                a("td", hl, [
                  z(V(d.product), 1),
                  d.context ? (e(), i("span", kl, " · " + V(d.context), 1)) : w("", !0)
                ]),
                a("td", null, [
                  z(V(d.change), 1),
                  !l.canResolveActors && d.source ? (e(), i("span", _l, " via " + V(d.source), 1)) : w("", !0)
                ])
              ]))), 128))
            ])
          ], 8, pl),
          a("ol", {
            role: "list",
            class: "pim-stacked-list",
            "aria-labelledby": s(m)
          }, [
            (e(!0), i(F, null, Q(C.value, (d) => (e(), i("li", {
              key: d.key,
              class: "pim-stacked-row"
            }, [
              a("div", null, V(d.change), 1),
              a("div", wl, [
                l.canResolveActors ? (e(), i("span", xl, [
                  a("span", null, V(d.actor), 1),
                  d.source ? (e(), i(F, { key: 0 }, [
                    z(" via " + V(d.source), 1)
                  ], 64)) : w("", !0)
                ])) : d.source ? (e(), i("span", Cl, "Via " + V(d.source), 1)) : w("", !0),
                a("time", {
                  datetime: d.at
                }, V(d.date), 9, Vl),
                a("span", null, [
                  z(V(d.product), 1),
                  d.context ? (e(), i(F, { key: 0 }, [
                    z(" · " + V(d.context), 1)
                  ], 64)) : w("", !0)
                ])
              ])
            ]))), 128))
          ], 8, $l)
        ], 64)) : !v.value && !n.value ? (e(), i("div", Ul, "Nothing recorded yet.")) : w("", !0),
        a("div", Sl, [
          a("span", null, V(C.value.length) + " change" + V(C.value.length === 1 ? "" : "s") + " shown", 1),
          r.value ? (e(), R(s(Z), {
            key: 0,
            type: "button",
            disabled: v.value,
            onClick: f[1] || (f[1] = (d) => j(!0)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: h(() => [
              g(s(X), {
                icon: "tabler:adjustments",
                "aria-hidden": "true"
              }),
              f[6] || (f[6] = z(" Load older", -1))
            ]),
            _: 1
          }, 8, ["disabled"])) : w("", !0)
        ])
      ])
    ]));
  }
}), ia = /* @__PURE__ */ le({
  __name: "SettingsActions",
  props: {
    access: {},
    dirty: { type: Boolean },
    busy: { type: Boolean },
    valid: { type: Boolean },
    reviewed: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(l, { emit: k }) {
    const t = k;
    return (u, r) => l.access?.admin ? (e(), i(F, { key: 0 }, [
      l.dirty ? (e(), R(s(ie), {
        key: 0,
        severity: "warn",
        value: "Unsaved changes"
      })) : w("", !0),
      g(s(Z), {
        severity: "secondary",
        outlined: "",
        disabled: !l.dirty || l.busy,
        onClick: r[0] || (r[0] = (v) => t("discard"))
      }, {
        default: h(() => [
          g(s(X), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          }),
          r[2] || (r[2] = z(" Discard", -1))
        ]),
        _: 1
      }, 8, ["disabled"]),
      l.reviewed ? w("", !0) : (e(), R(s(Z), {
        key: 1,
        disabled: !l.dirty || l.busy || !l.valid,
        loading: l.busy,
        onClick: r[1] || (r[1] = (v) => t("review"))
      }, {
        default: h(() => [...r[3] || (r[3] = [
          z("Review changes", -1)
        ])]),
        _: 1
      }, 8, ["disabled", "loading"]))
    ], 64)) : w("", !0);
  }
}), Ol = { class: "kx-head-icon" }, Il = { class: "kx-head-text" }, Rl = { class: "pim-title-line" }, jl = ["title"], Tl = { class: "kx-head-actions" }, ql = /* @__PURE__ */ le({
  __name: "PageHead",
  props: {
    title: {},
    subtitle: {},
    icon: {},
    backLabel: {},
    pane: { type: Boolean }
  },
  emits: ["back"],
  setup(l, { emit: k }) {
    const t = k;
    return (u, r) => (e(), i("header", {
      class: ke(["kx-head", { "pim-panel-head": l.pane }])
    }, [
      l.backLabel ? (e(), R(s(Z), {
        key: 0,
        type: "button",
        "aria-label": l.backLabel,
        onClick: r[0] || (r[0] = (v) => t("back")),
        text: "",
        severity: "secondary",
        size: "small"
      }, {
        default: h(() => [
          g(s(X), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label"])) : w("", !0),
      a("div", Ol, [
        g(s(X), {
          icon: l.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      a("div", Il, [
        a("div", Rl, [
          (e(), R(xa(l.pane ? "h2" : "h1"), { class: "kx-title" }, {
            default: h(() => [
              z(V(l.title), 1)
            ]),
            _: 1
          })),
          de(u.$slots, "meta")
        ]),
        a("p", {
          class: "kx-head-sub",
          title: l.subtitle
        }, V(l.subtitle), 9, jl)
      ]),
      a("div", Tl, [
        de(u.$slots, "default")
      ])
    ], 2));
  }
}), Dl = { class: "row pim-add-row" }, Nl = ["id"], we = /* @__PURE__ */ le({
  __name: "AddSchemaCode",
  props: {
    label: {},
    action: {},
    existing: {}
  },
  emits: ["add"],
  setup(l, { emit: k }) {
    const t = l, u = k, r = J(""), v = Ae(), n = M(() => r.value.trim()), p = M(() => n.value ? t.existing?.includes(n.value) ? "This code is already in use." : Ma.test(n.value) ? "" : "Start with a lowercase letter and use only lowercase letters, numbers or underscores." : ""), m = M(() => !!n.value && !p.value);
    function C() {
      m.value && (u("add", n.value), r.value = "");
    }
    return (j, K) => (e(), i("div", Dl, [
      g(s(Re), {
        modelValue: r.value,
        "onUpdate:modelValue": K[0] || (K[0] = (x) => r.value = x),
        type: "text",
        placeholder: l.label,
        "aria-label": l.label,
        invalid: !!p.value,
        "aria-describedby": p.value ? s(v) : void 0,
        class: "mono",
        onKeydown: Qe(be(C, ["prevent"]), ["enter"])
      }, null, 8, ["modelValue", "placeholder", "aria-label", "invalid", "aria-describedby", "onKeydown"]),
      g(s(Z), {
        type: "button",
        disabled: !m.value,
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: C
      }, {
        default: h(() => [
          g(s(X), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          z(" " + V(l.action), 1)
        ]),
        _: 1
      }, 8, ["disabled"]),
      de(j.$slots, "default"),
      p.value ? (e(), i("p", {
        key: 0,
        id: s(v),
        role: "status",
        class: "pim-add-code-error small"
      }, V(p.value), 9, Nl)) : w("", !0)
    ]));
  }
}), ma = Symbol("definitionColumns"), Pl = { code: "Code", kind: "Kind", details: "Details", usage: "Used by" }, Ll = {
  code: "minmax(120px, 1fr)",
  kind: "140px",
  details: "minmax(120px, 1.2fr)",
  usage: "120px"
}, zl = {
  class: "pim-definition-scroll",
  tabindex: "0",
  "aria-label": "Definitions"
}, Bl = { class: "pim-definition-grid" }, El = {
  key: 0,
  class: "pim-definition-columns",
  "aria-hidden": "true"
}, xe = /* @__PURE__ */ le({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: { default: () => ["code"] }
  },
  setup(l) {
    const k = l;
    Ca(ma, M(() => k.columns));
    const t = M(() => ["48px", "minmax(160px, 1.4fr)", ...k.columns.map((u) => Ll[u]), "80px"].join(" "));
    return (u, r) => (e(), i("section", {
      class: "form pim-definition-list",
      style: We({ "--pim-definition-columns": t.value })
    }, [
      de(u.$slots, "head"),
      a("div", zl, [
        a("div", Bl, [
          l.count > 3 ? (e(), i("div", El, [
            r[0] || (r[0] = a("span", null, null, -1)),
            r[1] || (r[1] = a("span", null, "Name", -1)),
            (e(!0), i(F, null, Q(l.columns, (v) => (e(), i("span", {
              key: v,
              class: ke("pim-definition-" + v)
            }, V(s(Pl)[v]), 3))), 128)),
            r[2] || (r[2] = a("span", null, null, -1))
          ])) : w("", !0),
          de(u.$slots, "default")
        ])
      ]),
      de(u.$slots, "add")
    ], 4));
  }
}), Ml = { class: "pim-definition" }, Fl = {
  class: "pim-definition-lead",
  "data-column": "lead"
}, Hl = {
  class: "pim-row-title",
  "data-column": "name"
}, Jl = { class: "pim-definition-meta" }, Wl = ["data-column"], Kl = {
  key: 0,
  class: "mono"
}, Gl = {
  class: "pim-definition-actions",
  "data-column": "actions"
}, Yl = {
  key: 0,
  class: "pim-definition-body"
}, Ce = /* @__PURE__ */ le({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ la({
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
  emits: /* @__PURE__ */ la(["head-keydown", "head-drop", "head-dragover"], ["update:open"]),
  setup(l, { emit: k }) {
    const t = l, u = Va(ma, M(() => [
      ...t.code ? ["code"] : [],
      ...t.kind ? ["kind"] : []
    ])), r = Ua(l, "open"), v = k;
    return (n, p) => (e(), i("section", Ml, [
      a("header", {
        class: ke(["pim-definition-head", l.headClass]),
        onKeydown: p[1] || (p[1] = (m) => v("head-keydown", m)),
        onDrop: p[2] || (p[2] = (m) => v("head-drop", m)),
        onDragover: p[3] || (p[3] = (m) => v("head-dragover", m))
      }, [
        g(ba, {
          class: ke(["pim-definition-toggle", l.toggleClass]),
          "aria-expanded": r.value,
          onClick: p[0] || (p[0] = (m) => r.value = !r.value)
        }, {
          default: h(() => [
            a("span", Fl, [
              de(n.$slots, "handle"),
              g(s(X), {
                icon: r.value ? "tabler:chevron-down" : "tabler:chevron-right",
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ]),
            a("span", Hl, V(l.title), 1),
            a("span", Jl, [
              (e(!0), i(F, null, Q(s(u), (m) => (e(), i("span", {
                key: m,
                class: ke("pim-definition-" + m),
                "data-column": m
              }, [
                m === "code" && l.code ? (e(), i("code", Kl, V(l.code), 1)) : m === "kind" && l.kind ? (e(), R(s(ie), {
                  key: 1,
                  severity: "secondary",
                  value: l.kind
                }, null, 8, ["value"])) : m === "details" ? de(n.$slots, "details", {}, void 0, void 0, 2) : m === "usage" ? de(n.$slots, "usage", {}, () => [
                  z(V(l.usage), 1)
                ], void 0, 3) : w("", !0)
              ], 10, Wl))), 128))
            ])
          ]),
          _: 3
        }, 8, ["class", "aria-expanded"]),
        a("div", Gl, [
          de(n.$slots, "actions")
        ])
      ], 34),
      r.value ? (e(), i("div", Yl, [
        de(n.$slots, "default")
      ])) : w("", !0)
    ]));
  }
}), Zl = { class: "pim-chips pim-picker-chips" }, Ql = {
  key: 0,
  class: "muted small"
}, fe = /* @__PURE__ */ le({
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
    const t = l, u = k, r = J("");
    function v(j) {
      return t.modelValue.includes(j);
    }
    function n(j) {
      t.disabled || !j || u("update:modelValue", v(j) ? t.modelValue.filter((K) => K !== j) : [...t.modelValue, j]);
    }
    function p() {
      const j = r.value.trim();
      if (!j || v(j)) {
        r.value = "";
        return;
      }
      u("update:modelValue", [...t.modelValue, j]), r.value = "";
    }
    function m(j) {
      u("update:modelValue", t.modelValue.filter((K) => K !== j));
    }
    function C(j) {
      return t.options?.find((K) => K.value === j)?.label ?? j;
    }
    return (j, K) => (e(), i("div", Zl, [
      l.disabled ? (e(), i(F, { key: 0 }, [
        (e(!0), i(F, null, Q(l.modelValue, (x) => (e(), i("span", { key: x }, V(C(x)), 1))), 128)),
        l.modelValue.length ? w("", !0) : (e(), i("span", Ql, "None"))
      ], 64)) : l.options && (l.dropdown || l.options.length > 10) ? (e(), i(F, { key: 1 }, [
        (e(!0), i(F, null, Q(l.modelValue, (x) => (e(), i("span", {
          key: x,
          class: "row"
        }, [
          z(V(C(x)), 1),
          l.disabled ? w("", !0) : (e(), R(s(Z), {
            key: 0,
            type: "button",
            "aria-label": "Remove " + C(x),
            onClick: (I) => m(x),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: h(() => [
              g(s(X), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"]))
        ]))), 128)),
        l.disabled ? w("", !0) : (e(), R(s(ve), {
          key: 0,
          "model-value": null,
          placeholder: l.placeholder ?? "Add…",
          "aria-labelledby": l.labelledby,
          "aria-label": l.placeholder ?? "Add",
          "onUpdate:modelValue": K[0] || (K[0] = (x) => n(x)),
          class: "pim-chip-entry",
          options: l.options.filter((x) => !v(x.value)).map((x) => ({ value: x.value, label: x.label ?? x.value })),
          "option-label": "label",
          "option-value": "value",
          appendTo: "self"
        }, null, 8, ["placeholder", "aria-labelledby", "aria-label", "options"]))
      ], 64)) : l.options ? (e(), i(F, { key: 2 }, [
        g(s(Xe), {
          "model-value": l.modelValue.filter((x) => l.options.some((I) => I.value === x)),
          options: l.options.map((x) => ({ value: x.value, label: x.label ?? x.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          disabled: l.disabled,
          "aria-labelledby": l.labelledby,
          "aria-label": l.placeholder ?? "Selected values",
          "onUpdate:modelValue": K[1] || (K[1] = (x) => u("update:modelValue", [...x, ...l.modelValue.filter((I) => !l.options.some((b) => b.value === I))]))
        }, null, 8, ["model-value", "options", "disabled", "aria-labelledby", "aria-label"]),
        (e(!0), i(F, null, Q(l.modelValue.filter((x) => !l.options.some((I) => I.value === x)), (x) => (e(), i("span", {
          key: x,
          class: "row"
        }, [
          z(V(C(x)), 1),
          g(s(Z), {
            type: "button",
            "aria-label": "Remove " + x,
            onClick: (I) => m(x),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: h(() => [
              g(s(X), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128))
      ], 64)) : (e(!0), i(F, { key: 3 }, Q(l.modelValue, (x) => (e(), i("span", {
        key: x,
        class: "row"
      }, [
        z(V(x), 1),
        g(s(Z), {
          type: "button",
          "aria-label": "Remove " + x,
          onClick: (I) => m(x),
          size: "small",
          text: "",
          severity: "secondary"
        }, {
          default: h(() => [
            g(s(X), { icon: "tabler:x" })
          ]),
          _: 1
        }, 8, ["aria-label", "onClick"])
      ]))), 128)),
      l.free && !l.disabled ? (e(), R(s(Re), {
        key: 4,
        modelValue: r.value,
        "onUpdate:modelValue": K[2] || (K[2] = (x) => r.value = x),
        type: "text",
        "aria-labelledby": l.labelledby,
        placeholder: l.placeholder ?? "Add…",
        onKeydown: Qe(be(p, ["prevent"]), ["enter"]),
        onBlur: p,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "aria-labelledby", "placeholder", "onKeydown"])) : w("", !0)
    ]));
  }
}), Xl = {
  key: 0,
  class: "pim-config-overrides"
}, et = {
  key: 1,
  class: "muted small"
}, at = { key: 1 }, lt = ["schema", "config"], tt = {
  key: 1,
  class: "muted small",
  role: "status"
}, ea = /* @__PURE__ */ le({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(l, { emit: k }) {
    const t = l, u = k, r = J("pending"), v = M(() => {
      const m = t.schema.properties;
      return Object.entries(t.modelValue).map(([C, j]) => ({
        key: C,
        label: m?.[C]?.title ?? G(C),
        value: j !== null && typeof j == "object" ? JSON.stringify(j) : Be(j)
      }));
    });
    async function n() {
      r.value = "pending", r.value = await na("wc-schema-form") ? "ready" : "failed";
    }
    ce(() => t.disabled, (m) => {
      m || n();
    }, { immediate: !0 });
    function p(m) {
      const C = m.detail;
      C && typeof C == "object" && !Array.isArray(C) && u("update:modelValue", C);
    }
    return (m, C) => l.disabled ? (e(), i(F, { key: 0 }, [
      v.value.length ? (e(), i("dl", Xl, [
        (e(!0), i(F, null, Q(v.value, (j) => (e(), i(F, {
          key: j.key
        }, [
          a("dt", null, V(j.label), 1),
          a("dd", null, V(j.value), 1)
        ], 64))), 128))
      ])) : (e(), i("span", et, "No overrides"))
    ], 64)) : (e(), i("div", at, [
      r.value === "ready" ? (e(), i("wc-schema-form", {
        key: 0,
        schema: JSON.stringify(t.schema),
        config: JSON.stringify(l.modelValue),
        onConfigChanged: p
      }, null, 40, lt)) : r.value === "pending" ? (e(), i("span", tt, "Configuration form is loading.")) : (e(), R(s($e), {
        key: 2,
        role: "alert",
        severity: "error"
      }, {
        default: h(() => [
          C[2] || (C[2] = z("Configuration form could not be loaded. ", -1)),
          g(s(Z), {
            type: "button",
            onClick: n,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: h(() => [...C[1] || (C[1] = [
              z("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      })),
      g(s(Z), {
        type: "button",
        onClick: C[0] || (C[0] = (j) => u("update:modelValue", {})),
        severity: "secondary",
        outlined: "",
        size: "small"
      }, {
        default: h(() => [
          g(s(X), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          }),
          C[3] || (C[3] = z(" Reset overrides", -1))
        ]),
        _: 1
      })
    ]));
  }
}), st = { key: 0 }, it = /* @__PURE__ */ le({
  __name: "DefaultValue",
  props: {
    attribute: {},
    type: {},
    disabled: { type: Boolean }
  },
  emits: ["change"],
  setup(l, { emit: k }) {
    const t = l, u = k, r = M(() => {
      const m = t.type?.form;
      let C = { type: "string" };
      return m === "bool" ? C = { type: "boolean" } : m === "int" ? C = { type: "integer" } : m === "dec" ? C = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : m === "quantity" ? C = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(t.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : m === "record" ? C = { type: "object", additionalProperties: !0 } : m === "ref" && (C = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${t.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (t.attribute.cardinality ?? "one") !== "one" && (C = { type: "array", items: C, uniqueItems: t.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...C, title: "Default value" } } };
    });
    function v(m) {
      return m && typeof m == "object" && "m" in m && "e" in m ? Ye(m) : m;
    }
    function n(m) {
      return t.type?.form === "dec" ? v(m) : t.type?.form === "quantity" && m && typeof m == "object" && "v" in m && "u" in m ? { value: v(m.v), unit: m.u } : m;
    }
    const p = M(() => t.attribute.default === void 0 ? {} : { value: Array.isArray(t.attribute.default) ? t.attribute.default.map(n) : n(t.attribute.default) });
    return (m, C) => l.disabled ? (e(), i("span", st, V(l.attribute.default == null ? "No default" : s(Be)(l.attribute.default)), 1)) : (e(), R(ea, {
      key: 1,
      schema: r.value,
      "model-value": p.value,
      "onUpdate:modelValue": C[0] || (C[0] = (j) => u("change", j.value))
    }, null, 8, ["schema", "model-value"]));
  }
}), nt = { class: "pim-stack" }, ot = { class: "pim-bsection-head" }, dt = {
  key: 0,
  class: "mono muted small"
}, ut = { class: "pim-source-permissions" }, rt = ["for"], ct = {
  key: 0,
  class: "small muted"
}, mt = ["onDragstart"], pt = { class: "pim-fields" }, vt = { class: "pim-f pim-w-third" }, ft = { class: "pim-f-label" }, bt = ["for"], yt = {
  key: 0,
  class: "pim-f-note"
}, gt = { class: "pim-f pim-w-third" }, ht = { class: "pim-f-label" }, kt = ["id"], _t = { class: "pim-f pim-w-third" }, $t = { class: "pim-f-label" }, wt = ["id"], xt = {
  key: 0,
  class: "pim-f pim-w-third"
}, Ct = { class: "pim-f-label" }, Vt = ["id"], Ut = {
  key: 1,
  class: "pim-f pim-w-third"
}, St = { class: "pim-f-label" }, At = ["id"], Ot = { class: "pim-f pim-w-third" }, It = { class: "pim-f-label" }, Rt = ["id"], jt = { class: "pim-f pim-w-third" }, Tt = { class: "pim-f-label" }, qt = ["id"], Dt = { class: "pim-f pim-w-half" }, Nt = { class: "pim-f-label" }, Pt = ["id"], Lt = { class: "pim-f pim-w-half" }, zt = { class: "pim-f-label" }, Bt = ["for"], Et = { class: "row" }, Mt = {
  key: 2,
  class: "pim-f pim-w-full"
}, Ft = { class: "pim-f-label" }, Ht = ["id"], Jt = ["aria-labelledby"], Wt = ["id"], Kt = ["aria-labelledby"], Gt = { class: "pim-f-label" }, Yt = ["id"], Zt = ["aria-labelledby"], Qt = { class: "pim-f-label" }, Xt = ["id"], es = {
  key: 0,
  class: "row end"
}, as = {
  key: 0,
  class: "form"
}, ls = /* @__PURE__ */ le({
  __name: "BuilderFields",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove"],
  setup(l, { emit: k }) {
    const t = l, u = k, r = Le.map((U) => U.value), v = [{ value: "one", label: "Single value" }, { value: "list", label: "Ordered list" }, { value: "set", label: "Unique set" }], n = M(() => t.schema.access.admin), p = M(() => t.draft.aspects ?? []), m = M(() => (t.draft.dimensions ?? []).map((U) => ({ value: U.name, label: G(U.name) }))), C = M(() => (t.draft.vocabularies ?? []).map((U) => U.code)), j = M(() => (t.draft.sources ?? []).map((U) => ({ value: U.id, label: G(U.id) }))), K = M(() => [...t.options.types].sort((U, A) => U.form.localeCompare(A.form)).map((U) => ({ value: U.id, label: Te(U) })));
    function x(U) {
      return t.options.types.find((A) => A.id === U.type);
    }
    function I(U) {
      return x(U)?.target === "term";
    }
    function b(U) {
      const A = x(U);
      return !!A && A.form === "ref" && !A.target;
    }
    function f(U, A) {
      return A.id !== void 0 && t.schema.attributes[U + "." + A.code] !== void 0;
    }
    function d(U) {
      const A = (t.draft.families ?? []).filter((S) => S.aspects?.includes(U)).length;
      return A + (A === 1 ? " family" : " families");
    }
    const c = J({}), o = Ae(), O = /* @__PURE__ */ new WeakMap();
    let B = 0;
    function te(U, A) {
      if (A.id !== void 0) return U + "." + A.id;
      const S = Sa(A);
      let _ = O.get(S);
      return _ === void 0 && (_ = ++B, O.set(S, _)), U + ".draft-" + _;
    }
    function Y(U, A, S) {
      return o + "-" + te(U, A) + "-" + S;
    }
    function ne(U, A) {
      U.type = A;
      const S = x(U);
      if (S && U.index && !S.indexes.includes(U.index) && delete U.index, I(U) || delete U.vocabulary, !b(U) && U.config && "target" in U.config) {
        const { target: _, ...se } = U.config;
        U.config = Object.keys(se).length ? se : void 0, U.config || delete U.config;
      }
    }
    function P(U, A) {
      Object.keys(A).length ? U.config = A : delete U.config;
    }
    function D(U, A) {
      const S = { ...U.config ?? {} };
      A ? S.target = A : delete S.target, P(U, S);
    }
    function N(U, A) {
      A.length ? U.scope = A : delete U.scope, A.length || delete U.index_contexts;
    }
    function y(U, A, S) {
      S === void 0 || S === "" || S === !1 && A !== "default" ? delete U[A] : U[A] = S;
    }
    function q(U) {
      return U.index_contexts ?? [];
    }
    function $(U) {
      return (t.draft.dimensions ?? []).find((A) => A.name === U)?.members ?? [];
    }
    function T(U) {
      const A = {};
      for (const _ of U.scope ?? []) A[_] = $(_)[0] ?? "";
      (U.index_contexts ?? (U.index_contexts = [])).push(A);
    }
    const ee = J(null);
    function Oe(U, A, S) {
      if (!n.value || !U.altKey) return;
      const _ = { ArrowUp: -1, ArrowDown: 1 }[U.key];
      _ !== void 0 && (U.preventDefault(), Ue(A.attributes ?? [], S, S + _));
    }
    function Me(U, A) {
      n.value && ee.value?.namespace === U.namespace && Ue(U.attributes ?? [], ee.value.index, A), ee.value = null;
    }
    function re(U) {
      (t.draft.aspects ??= []).push({ namespace: U, attributes: [] });
    }
    function Fe(U) {
      const A = p.value.indexOf(U);
      A >= 0 && p.value.splice(A, 1), t.schema.declaration.aspects?.some((S) => S.namespace === U.namespace) && u("remove", "aspects", U.namespace);
    }
    function Ie(U, A) {
      const S = t.options.types.find((se) => se.id === "kickside.pim.types:text") ?? t.options.types[0], _ = { code: A, type: S?.id ?? "" };
      (U.attributes ??= []).push(_), c.value[te(U.namespace, _)] = !0;
    }
    function He(U, A) {
      const S = U.attributes ?? [], _ = S.indexOf(A);
      _ >= 0 && S.splice(_, 1), f(U.namespace, A) && u("remove", "attributes", U.namespace + "." + A.code);
    }
    return (U, A) => (e(), i("div", nt, [
      (e(!0), i(F, null, Q(p.value, (S) => (e(), R(xe, {
        key: S.namespace,
        count: S.attributes?.length ?? 0,
        columns: ["code", "kind", "details", "usage"]
      }, ue({
        head: h(() => [
          a("header", ot, [
            a("div", null, [
              a("h3", null, [
                z(V(s(G)(S.namespace)), 1),
                s(G)(S.namespace).toLocaleLowerCase() !== S.namespace.toLocaleLowerCase() ? (e(), i("span", dt, V(S.namespace), 1)) : w("", !0)
              ]),
              a("div", ut, [
                a("label", {
                  for: "writers-" + S.namespace
                }, "Sources allowed to write", 8, rt),
                g(s(Ta), {
                  disabled: !n.value,
                  "input-id": "writers-" + S.namespace,
                  "aria-label": "Sources allowed to write",
                  "model-value": S.write?.sources ?? [],
                  options: j.value,
                  "option-label": "label",
                  "option-value": "value",
                  placeholder: "Any source",
                  appendTo: "self",
                  "onUpdate:modelValue": (_) => S.write = { sources: _ }
                }, null, 8, ["disabled", "input-id", "model-value", "options", "onUpdate:modelValue"]),
                n.value ? (e(), i("span", ct, "Leave empty to allow any source to write this field group.")) : w("", !0)
              ])
            ]),
            n.value ? (e(), R(s(Z), {
              key: 0,
              type: "button",
              onClick: (_) => Fe(S),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: h(() => [
                g(s(X), { icon: "tabler:trash" }),
                A[3] || (A[3] = z(" Remove field group", -1))
              ]),
              _: 1
            }, 8, ["onClick"])) : w("", !0)
          ])
        ]),
        default: h(() => [
          (e(!0), i(F, null, Q(S.attributes ?? [], (_, se) => (e(), R(Ce, {
            key: te(S.namespace, _),
            open: c.value[te(S.namespace, _)],
            "onUpdate:open": (H) => c.value[te(S.namespace, _)] = H,
            title: s(G)(_.code),
            code: S.namespace + "." + _.code,
            kind: s(Te)(x(_)),
            usage: d(S.namespace),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle",
            onHeadDragover: A[2] || (A[2] = be(() => {
            }, ["prevent"])),
            onHeadDrop: be((H) => Me(S, se), ["prevent"]),
            onHeadKeydown: (H) => Oe(H, S, se)
          }, ue({
            handle: h(() => [
              n.value ? (e(), i("span", {
                key: 0,
                class: "pim-grip",
                draggable: "true",
                "aria-hidden": "true",
                onClick: A[0] || (A[0] = be(() => {
                }, ["stop"])),
                onDragstart: be((H) => ee.value = { namespace: S.namespace, index: se }, ["stop"]),
                onDragend: A[1] || (A[1] = (H) => ee.value = null)
              }, [
                g(s(X), { icon: "tabler:grip-vertical" })
              ], 40, mt)) : w("", !0)
            ]),
            details: h(() => [
              _.cardinality && _.cardinality !== "one" ? (e(), R(s(ie), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: h(() => [
                  z(V(v.find((H) => H.value === _.cardinality)?.label), 1)
                ]),
                _: 2
              }, 1024)) : w("", !0),
              _.scope?.length ? (e(), R(s(ie), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: h(() => [
                  z("per " + V(_.scope.join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : w("", !0),
              _.index && _.index !== "none" ? (e(), R(s(ie), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: h(() => [
                  z(V(_.index) + " index", 1)
                ]),
                _: 2
              }, 1024)) : w("", !0),
              _.unique ? (e(), R(s(ie), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: h(() => [...A[4] || (A[4] = [
                  z("unique", -1)
                ])]),
                _: 1
              })) : w("", !0)
            ]),
            default: h(() => [
              a("div", pt, [
                a("div", vt, [
                  a("div", ft, [
                    a("label", {
                      for: Y(S.namespace, _, "code")
                    }, "Code", 8, bt),
                    n.value && f(S.namespace, _) ? (e(), i("span", yt, "renames keep values")) : w("", !0)
                  ]),
                  g(s(Re), {
                    disabled: !n.value,
                    id: Y(S.namespace, _, "code"),
                    type: "text",
                    value: _.code,
                    onInput: (H) => _.code = H.target.value,
                    class: "mono"
                  }, null, 8, ["disabled", "id", "value", "onInput"])
                ]),
                a("div", gt, [
                  a("div", ht, [
                    a("label", {
                      id: Y(S.namespace, _, "type")
                    }, "Type", 8, kt)
                  ]),
                  g(s(ve), {
                    disabled: !n.value,
                    "aria-labelledby": Y(S.namespace, _, "type"),
                    "model-value": _.type,
                    options: K.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (H) => ne(_, H)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                a("div", _t, [
                  a("div", $t, [
                    a("label", {
                      id: Y(S.namespace, _, "values")
                    }, "Values", 8, wt)
                  ]),
                  g(s(ve), {
                    disabled: !n.value,
                    "aria-labelledby": Y(S.namespace, _, "values"),
                    "model-value": _.cardinality ?? "one",
                    options: v,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (H) => y(_, "cardinality", H === "one" ? void 0 : H)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                I(_) ? (e(), i("div", xt, [
                  a("div", Ct, [
                    a("label", {
                      id: Y(S.namespace, _, "vocabulary")
                    }, "Vocabulary", 8, Vt)
                  ]),
                  g(s(ve), {
                    disabled: !n.value,
                    "aria-labelledby": Y(S.namespace, _, "vocabulary"),
                    "model-value": _.vocabulary ?? "",
                    "onUpdate:modelValue": (H) => y(_, "vocabulary", H),
                    options: [{ value: "", label: "Choose…" }, ...C.value.map((H) => ({ value: H, label: String(H) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : w("", !0),
                b(_) ? (e(), i("div", Ut, [
                  a("div", St, [
                    a("label", {
                      id: Y(S.namespace, _, "link")
                    }, "Link kind", 8, At),
                    A[5] || (A[5] = a("span", { class: "pim-f-note" }, "owned by a plugin", -1))
                  ]),
                  g(s(ve), {
                    disabled: !n.value,
                    "aria-labelledby": Y(S.namespace, _, "link"),
                    "model-value": _.config?.target ?? "",
                    "onUpdate:modelValue": (H) => D(_, H),
                    options: [{ value: "", label: "Choose…" }, ...l.options.link_kinds.map((H) => ({ value: H.kind, label: s(me)(H.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : w("", !0),
                a("div", Ot, [
                  a("div", It, [
                    a("label", {
                      id: Y(S.namespace, _, "index")
                    }, "Index", 8, Rt),
                    A[6] || (A[6] = a("span", { class: "pim-f-note" }, "for filters and keys", -1))
                  ]),
                  g(s(ve), {
                    disabled: !n.value,
                    "aria-labelledby": Y(S.namespace, _, "index"),
                    "model-value": _.index ?? "none",
                    options: x(_)?.indexes ?? ["none"],
                    appendTo: "self",
                    "onUpdate:modelValue": (H) => y(_, "index", H === "none" ? void 0 : H)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                a("div", jt, [
                  a("div", Tt, [
                    a("label", {
                      id: Y(S.namespace, _, "width")
                    }, "Width", 8, qt),
                    A[7] || (A[7] = a("span", { class: "pim-f-note" }, "of a form row", -1))
                  ]),
                  g(s(Xe), {
                    disabled: !n.value,
                    "aria-labelledby": Y(S.namespace, _, "width"),
                    "model-value": s(Ge)(l.schema, S.namespace, _),
                    options: s(r),
                    "allow-empty": !1,
                    "onUpdate:modelValue": (H) => _.width = H
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                a("div", Dt, [
                  a("div", Nt, [
                    a("label", {
                      id: Y(S.namespace, _, "scope")
                    }, "Varies per", 8, Pt),
                    A[8] || (A[8] = a("span", { class: "pim-f-note" }, "dimensions the value depends on", -1))
                  ]),
                  g(fe, {
                    disabled: !n.value,
                    labelledby: Y(S.namespace, _, "scope"),
                    "model-value": _.scope ?? [],
                    options: m.value,
                    "onUpdate:modelValue": (H) => N(_, H)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                a("div", Lt, [
                  a("div", zt, [
                    a("label", {
                      for: Y(S.namespace, _, "unique")
                    }, "Unique", 8, Bt),
                    A[9] || (A[9] = a("span", { class: "pim-f-note" }, "one holder per value, catalog wide", -1))
                  ]),
                  a("div", Et, [
                    g(s(qe), {
                      "input-id": Y(S.namespace, _, "unique"),
                      "model-value": _.unique === !0,
                      disabled: !n.value || !!_.scope?.length || (_.cardinality ?? "one") !== "one",
                      "onUpdate:modelValue": (H) => y(_, "unique", H)
                    }, null, 8, ["input-id", "model-value", "disabled", "onUpdate:modelValue"]),
                    a("span", null, V(_.unique ? "Yes" : "No"), 1)
                  ])
                ]),
                (_.scope?.length ?? 0) > 0 && _.index && _.index !== "none" ? (e(), i("div", Mt, [
                  a("div", Ft, [
                    a("label", {
                      id: Y(S.namespace, _, "contexts")
                    }, "Indexed contexts", 8, Ht),
                    A[10] || (A[10] = a("span", { class: "pim-f-note" }, "which combinations get an index", -1))
                  ]),
                  a("div", {
                    class: "pim-contexts",
                    role: "group",
                    "aria-labelledby": Y(S.namespace, _, "contexts")
                  }, [
                    (e(!0), i(F, null, Q(q(_), (H, pe) => (e(), i("div", {
                      key: pe,
                      class: "pim-context-row"
                    }, [
                      (e(!0), i(F, null, Q(_.scope, (E) => (e(), i("div", {
                        key: E,
                        class: "pim-context-field"
                      }, [
                        a("span", {
                          id: Y(S.namespace, _, "context-" + pe + "-" + E),
                          class: "small muted"
                        }, V(s(G)(E)), 9, Wt),
                        g(s(ve), {
                          disabled: !n.value,
                          "aria-labelledby": Y(S.namespace, _, "context-" + pe + "-" + E),
                          "model-value": H[E] ?? "",
                          options: $(E),
                          class: "narrow",
                          appendTo: "self",
                          "onUpdate:modelValue": (L) => H[E] = L
                        }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]))), 128)),
                      n.value ? (e(), R(s(Z), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove context",
                        onClick: (E) => q(_).splice(pe, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: h(() => [
                          g(s(X), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : w("", !0)
                    ]))), 128)),
                    n.value ? (e(), R(s(Z), {
                      key: 0,
                      type: "button",
                      onClick: (H) => T(_),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: h(() => [
                        g(s(X), {
                          icon: "tabler:plus",
                          "aria-hidden": "true"
                        }),
                        A[11] || (A[11] = z(" Add context", -1))
                      ]),
                      _: 1
                    }, 8, ["onClick"])) : w("", !0)
                  ], 8, Jt)
                ])) : w("", !0),
                a("div", {
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": Y(S.namespace, _, "default")
                }, [
                  a("div", Gt, [
                    a("label", {
                      id: Y(S.namespace, _, "default")
                    }, "Default", 8, Yt),
                    A[12] || (A[12] = a("span", { class: "pim-f-note" }, "when no value is set", -1))
                  ]),
                  g(it, {
                    disabled: !n.value,
                    attribute: _,
                    type: x(_),
                    onChange: (H) => y(_, "default", H)
                  }, null, 8, ["disabled", "attribute", "type", "onChange"])
                ], 8, Kt),
                x(_)?.config_schema ? (e(), i("div", {
                  key: 3,
                  class: "pim-f pim-w-full",
                  role: "group",
                  "aria-labelledby": Y(S.namespace, _, "config")
                }, [
                  a("div", Qt, [
                    a("label", {
                      id: Y(S.namespace, _, "config")
                    }, "Type configuration", 8, Xt)
                  ]),
                  g(ea, {
                    disabled: !n.value,
                    schema: x(_).config_schema,
                    "model-value": _.config ?? {},
                    "onUpdate:modelValue": (H) => P(_, H)
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue"])
                ], 8, Zt)) : w("", !0)
              ]),
              n.value ? (e(), i("div", es, [
                g(s(Z), {
                  type: "button",
                  onClick: (H) => He(S, _),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: h(() => [
                    g(s(X), { icon: "tabler:trash" }),
                    A[13] || (A[13] = z(" Remove field", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : w("", !0)
            ]),
            _: 2
          }, [
            n.value ? {
              name: "actions",
              fn: h(() => [
                g(s(Z), {
                  type: "button",
                  disabled: se === 0,
                  "aria-label": "Move " + _.code + " earlier",
                  onClick: (H) => s(Ue)(S.attributes, se, se - 1),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: h(() => [
                    g(s(X), { icon: "tabler:arrow-up" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                g(s(Z), {
                  type: "button",
                  disabled: se === (S.attributes?.length ?? 0) - 1,
                  "aria-label": "Move " + _.code + " later",
                  onClick: (H) => s(Ue)(S.attributes, se, se + 1),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: h(() => [
                    g(s(X), { icon: "tabler:arrow-down" })
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
        n.value ? {
          name: "add",
          fn: h(() => [
            g(we, {
              label: "Field code",
              action: "Add field",
              existing: S.attributes?.map((_) => _.code),
              onAdd: (_) => Ie(S, _)
            }, null, 8, ["existing", "onAdd"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"]))), 128)),
      n.value ? (e(), i("section", as, [
        g(we, {
          class: "pim-aspect",
          label: "Field group code",
          action: "Add field group",
          existing: p.value.map((S) => S.namespace),
          onAdd: re
        }, null, 8, ["existing"])
      ])) : w("", !0)
    ]));
  }
}), ts = { class: "muted small" }, ss = { class: "pim-aspect" }, is = {
  key: 0,
  class: "small muted"
}, ns = { class: "pim-fields" }, os = { class: "pim-f pim-w-full" }, ds = { class: "pim-f-label" }, us = ["id"], rs = { class: "pim-f-label" }, cs = ["id"], ms = /* @__PURE__ */ le({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(l, { emit: k }) {
    const t = l, u = k, r = M(() => t.schema.access.admin), v = M(() => t.draft.dimensions ?? []), n = Ae();
    function p(b, f) {
      return n + "-" + b.name + "-" + f;
    }
    function m(b) {
      (t.draft.dimensions ??= []).push({ name: b, members: [] });
    }
    function C(b) {
      const f = [];
      for (const d of t.draft.aspects ?? []) for (const c of d.attributes ?? []) c.scope?.includes(b.name) && f.push(d.namespace + "." + c.code);
      for (const d of t.draft.families ?? []) for (const c of d.requirements ?? []) c.context && b.name in c.context && f.push(d.code + " requirement " + c.id);
      return f;
    }
    function j(b) {
      C(b).length || (v.value.splice(v.value.indexOf(b), 1), t.schema.declaration.dimensions?.some((f) => f.name === b.name) && u("remove", "dimensions", b.name));
    }
    function K(b, f) {
      if (b.members = f, b.fallback)
        for (const d of Object.keys(b.fallback)) f.includes(d) || delete b.fallback[d];
    }
    function x(b, f) {
      return b.fallback?.[f] ?? [];
    }
    function I(b, f, d) {
      const c = { ...b.fallback ?? {} };
      d.length ? c[f] = d : delete c[f], Object.keys(c).length ? b.fallback = c : delete b.fallback;
    }
    return (b, f) => (e(), R(xe, {
      count: v.value.length,
      columns: ["code", "details", "usage"]
    }, ue({
      default: h(() => [
        (e(!0), i(F, null, Q(v.value, (d) => (e(), R(Ce, {
          title: s(G)(d.name),
          code: d.name,
          key: d.name,
          usage: C(d).length + (C(d).length === 1 ? " dependency" : " dependencies")
        }, ue({
          details: h(() => [
            a("span", ts, V(d.members.length) + " " + V(d.members.length === 1 ? "member" : "members"), 1)
          ]),
          default: h(() => [
            a("div", ss, [
              C(d).length ? (e(), i("p", is, "Used by " + V(C(d).join(", ")), 1)) : w("", !0),
              a("div", ns, [
                a("div", os, [
                  a("div", ds, [
                    a("label", {
                      id: p(d, "members")
                    }, "Members", 8, us),
                    f[0] || (f[0] = a("span", { class: "pim-f-note" }, "the values this dimension takes", -1))
                  ]),
                  g(fe, {
                    disabled: !r.value,
                    labelledby: p(d, "members"),
                    "model-value": d.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (c) => K(d, c)
                  }, null, 8, ["disabled", "labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                (e(!0), i(F, null, Q(d.members, (c) => (e(), i("div", {
                  key: c,
                  class: "pim-f pim-w-half"
                }, [
                  a("div", rs, [
                    a("label", {
                      id: p(d, "fallback-" + encodeURIComponent(c))
                    }, V(c) + " falls back to", 9, cs),
                    f[1] || (f[1] = a("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  g(fe, {
                    disabled: !r.value,
                    labelledby: p(d, "fallback-" + encodeURIComponent(c)),
                    "model-value": x(d, c),
                    options: d.members.filter((o) => o !== c).map((o) => ({ value: o })),
                    "onUpdate:modelValue": (o) => I(d, c, o)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]))), 128))
              ])
            ])
          ]),
          _: 2
        }, [
          r.value ? {
            name: "actions",
            fn: h(() => [
              g(s(Z), {
                type: "button",
                disabled: C(d).length > 0,
                "aria-label": "Remove " + s(G)(d.name),
                title: C(d).length ? "Take the dimension off these first" : "",
                onClick: (c) => j(d),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: h(() => [
                  g(s(X), { icon: "tabler:trash" })
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
      r.value ? {
        name: "add",
        fn: h(() => [
          g(we, {
            label: "Dimension code",
            action: "Add dimension",
            existing: v.value.map((d) => d.name),
            onAdd: m
          }, {
            default: h(() => [...f[2] || (f[2] = [
              a("span", { class: "muted small" }, "A dimension lets a value differ per member, with fallbacks between members.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), ps = { class: "muted small" }, vs = { class: "pim-aspect" }, fs = { class: "row small" }, bs = {
  key: 1,
  class: "muted small"
}, ys = {
  key: 2,
  class: "pim-stack tight pim-terms"
}, gs = {
  key: 0,
  class: "muted small"
}, hs = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, ks = {
  key: 3,
  class: "pim-responsive-table"
}, _s = {
  class: "pim-grid compact",
  "aria-label": "Vocabulary terms"
}, $s = { key: 0 }, ws = { key: 1 }, xs = { class: "mono" }, Cs = {
  key: 0,
  class: "mono muted"
}, Vs = {
  key: 1,
  class: "num"
}, Us = {
  role: "list",
  class: "pim-stacked-list",
  "aria-label": "Vocabulary terms"
}, Ss = { class: "pim-stacked-meta muted small" }, As = { class: "mono" }, Os = { key: 0 }, Is = {
  key: 4,
  class: "muted small"
}, Rs = { class: "row wrap" }, js = {
  key: 5,
  class: "row wrap pim-add-row"
}, Ts = /* @__PURE__ */ le({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(l, { emit: k }) {
    const t = l, u = k, r = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/, v = M(() => t.schema.access.admin), n = M(() => v.value && t.schema.access.write), p = M(() => t.draft.vocabularies ?? []);
    function m(y) {
      (t.draft.vocabularies ??= []).push({ code: y });
    }
    function C(y) {
      p.value.splice(p.value.indexOf(y), 1), t.schema.declaration.vocabularies?.some((q) => q.code === y.code) && u("remove", "vocabularies", y.code);
    }
    function j(y) {
      return !!t.schema.vocabularies[y];
    }
    const K = J({}), x = J({}), I = J({}), b = J({}), f = J({}), d = J({}), c = J({}), o = J({});
    function O(y) {
      return !!(f.value[y] || d.value[y]);
    }
    async function B(y, q) {
      f.value[y] = !0, delete c.value[y];
      try {
        const $ = await oe.termsPage(t.catalogId, y, q);
        x.value[y] = $.terms, b.value[y] = q, I.value[y] = $.next;
        const T = Y(y);
        $.terms.some((ee) => ee.retired && ee.code === T.parent) && (T.parent = "");
      } catch ($) {
        c.value[y] = { errors: [Se($, "Could not load terms.")], read: { after: q } };
      } finally {
        f.value[y] = !1;
      }
    }
    function te(y) {
      K.value[y] = !K.value[y], K.value[y] && !O(y) && !x.value[y] && !c.value[y] && B(y);
    }
    function Y(y) {
      return o.value[y] ?? (o.value[y] = { code: "", label: "", parent: "" });
    }
    function ne(y) {
      return [{ value: "", label: "No parent" }, ...(x.value[y] ?? []).filter((q) => !q.retired).map((q) => ({ value: q.code, label: je(q) }))];
    }
    function P(y, q, $) {
      c.value[y] = { errors: q?.findings?.length ? q.findings.map((T) => ({ message: T.message ?? $, code: T.code })) : [{ message: $ }] };
    }
    async function D(y) {
      const q = Y(y.code);
      if (!(!n.value || !r.test(q.code))) {
        d.value[y.code] = !0, delete c.value[y.code];
        try {
          const $ = { term: { vocabulary: y.code, code: q.code }, labels: { en: q.label || G(q.code) } };
          y.hierarchical && q.parent && ($.parent = q.parent);
          const ee = (await oe.apply(t.catalogId, [$])).outcomes[0];
          if (ee?.outcome !== "created" && ee?.outcome !== "updated") {
            P(y.code, ee, "The term was not accepted.");
            return;
          }
          o.value[y.code] = { code: "", label: "", parent: "" }, oe.invalidateTerms(t.catalogId), await B(y.code, b.value[y.code]);
        } catch ($) {
          c.value[y.code] = { errors: [Se($, "Could not add the term.")] };
        } finally {
          d.value[y.code] = !1;
        }
      }
    }
    async function N(y, q, $) {
      if (n.value && !($ && !await ua.confirm({ header: "Retire term?", message: `Retire ${je(q)}? Term changes save immediately. You can restore this term later.`, acceptLabel: "Retire", rejectLabel: "Cancel" }))) {
        d.value[y.code] = !0, delete c.value[y.code];
        try {
          const ee = (await oe.apply(t.catalogId, [{ term: { vocabulary: y.code, code: q.code }, retired: $ }])).outcomes[0];
          if (!ee || !["updated", "unchanged"].includes(ee.outcome)) {
            P(y.code, ee, "The term change was not accepted.");
            return;
          }
          $ && Y(y.code).parent === q.code && (Y(y.code).parent = ""), oe.invalidateTerms(t.catalogId), await B(y.code, b.value[y.code]);
        } catch (T) {
          c.value[y.code] = { errors: [Se(T, "Could not change the term.")] };
        } finally {
          d.value[y.code] = !1;
        }
      }
    }
    return (y, q) => (e(), R(xe, {
      count: p.value.length,
      columns: ["code", "details"]
    }, ue({
      default: h(() => [
        (e(!0), i(F, null, Q(p.value, ($) => (e(), R(Ce, {
          title: s(G)($.code),
          code: $.code,
          key: $.code
        }, {
          details: h(() => [
            a("span", ps, V($.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: h(() => [
            v.value ? (e(), R(s(Z), {
              key: 0,
              type: "button",
              "aria-label": "Remove " + s(G)($.code),
              onClick: (T) => C($),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: h(() => [
                g(s(X), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])) : w("", !0)
          ]),
          default: h(() => [
            a("div", vs, [
              a("label", fs, [
                g(s(qe), {
                  disabled: !v.value,
                  "aria-label": "Hierarchical " + $.code,
                  "model-value": $.hierarchical === !0,
                  "onUpdate:modelValue": (T) => T ? $.hierarchical = !0 : delete $.hierarchical
                }, null, 8, ["disabled", "aria-label", "model-value", "onUpdate:modelValue"]),
                q[0] || (q[0] = a("span", null, "Hierarchical", -1))
              ]),
              j($.code) ? (e(), R(s(Z), {
                key: 0,
                type: "button",
                onClick: (T) => te($.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: h(() => [
                  g(s(X), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  z(" " + V(K.value[$.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : v.value ? (e(), i("span", bs, "Apply the schema before adding terms.")) : w("", !0),
              K.value[$.code] ? (e(), i("div", ys, [
                n.value ? (e(), i("p", gs, "Term changes save immediately.")) : w("", !0),
                f.value[$.code] ? (e(), i("div", hs, "Loading terms…")) : c.value[$.code] ? (e(!0), i(F, { key: 2 }, Q(c.value[$.code].errors, (T, ee) => (e(), R(Ee, {
                  key: ee,
                  error: T
                }, {
                  default: h(() => [
                    c.value[$.code].read ? (e(), R(s(Z), {
                      key: 0,
                      type: "button",
                      onClick: (Oe) => B($.code, c.value[$.code].read?.after),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: h(() => [...q[1] || (q[1] = [
                        z("Retry", -1)
                      ])]),
                      _: 1
                    }, 8, ["onClick"])) : w("", !0)
                  ]),
                  _: 2
                }, 1032, ["error"]))), 128)) : w("", !0),
                (x.value[$.code] ?? []).length ? (e(), i("div", ks, [
                  a("table", _s, [
                    a("thead", null, [
                      a("tr", null, [
                        q[2] || (q[2] = a("th", null, "Code", -1)),
                        q[3] || (q[3] = a("th", null, "Label", -1)),
                        $.hierarchical ? (e(), i("th", $s, "Parent")) : w("", !0),
                        v.value ? (e(), i("th", ws)) : w("", !0)
                      ])
                    ]),
                    a("tbody", null, [
                      (e(!0), i(F, null, Q(x.value[$.code], (T) => (e(), i("tr", {
                        key: T.code,
                        class: ke({ muted: T.retired })
                      }, [
                        a("td", xs, V(T.code), 1),
                        a("td", null, [
                          z(V(s(je)(T)) + " ", 1),
                          T.retired ? (e(), R(s(ie), {
                            key: 0,
                            severity: "secondary",
                            value: "Retired"
                          })) : w("", !0)
                        ]),
                        $.hierarchical ? (e(), i("td", Cs, V(T.parent ?? ""), 1)) : w("", !0),
                        v.value ? (e(), i("td", Vs, [
                          g(s(Z), {
                            type: "button",
                            disabled: !n.value || O($.code),
                            onClick: (ee) => N($, T, !T.retired),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: h(() => [
                              z(V(T.retired ? "Restore" : "Retire"), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled", "onClick"])
                        ])) : w("", !0)
                      ], 2))), 128))
                    ])
                  ]),
                  a("ul", Us, [
                    (e(!0), i(F, null, Q(x.value[$.code], (T) => (e(), i("li", {
                      key: T.code,
                      class: ke(["pim-stacked-row", { muted: T.retired }])
                    }, [
                      a("div", null, [
                        z(V(s(je)(T)) + " ", 1),
                        T.retired ? (e(), R(s(ie), {
                          key: 0,
                          severity: "secondary",
                          value: "Retired"
                        })) : w("", !0)
                      ]),
                      a("div", Ss, [
                        a("span", As, V(T.code), 1),
                        $.hierarchical && T.parent ? (e(), i("span", Os, "Parent: " + V(T.parent), 1)) : w("", !0)
                      ]),
                      v.value ? (e(), R(s(Z), {
                        key: 0,
                        type: "button",
                        disabled: !n.value || O($.code),
                        onClick: (ee) => N($, T, !T.retired),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: h(() => [
                          z(V(T.retired ? "Restore" : "Retire"), 1)
                        ]),
                        _: 2
                      }, 1032, ["disabled", "onClick"])) : w("", !0)
                    ], 2))), 128))
                  ])
                ])) : x.value[$.code] && !O($.code) && !c.value[$.code] ? (e(), i("p", Is, "No terms yet.")) : w("", !0),
                a("div", Rs, [
                  g(s(Z), {
                    type: "button",
                    disabled: O($.code) || !b.value[$.code],
                    onClick: (T) => B($.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: h(() => [
                      g(s(X), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      q[4] || (q[4] = z(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  g(s(Z), {
                    type: "button",
                    disabled: O($.code) || !I.value[$.code],
                    onClick: (T) => B($.code, I.value[$.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: h(() => [
                      g(s(X), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      q[5] || (q[5] = z(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                v.value ? (e(), i("div", js, [
                  g(s(Re), {
                    modelValue: Y($.code).code,
                    "onUpdate:modelValue": (T) => Y($.code).code = T,
                    disabled: !n.value || O($.code),
                    type: "text",
                    placeholder: "code",
                    class: "mono narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  g(s(Re), {
                    modelValue: Y($.code).label,
                    "onUpdate:modelValue": (T) => Y($.code).label = T,
                    disabled: !n.value || O($.code),
                    type: "text",
                    placeholder: "Label (en)"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  $.hierarchical ? (e(), R(s(ve), {
                    key: 0,
                    modelValue: Y($.code).parent,
                    "onUpdate:modelValue": (T) => Y($.code).parent = T,
                    disabled: !n.value || O($.code),
                    class: "narrow",
                    "aria-label": "Parent term",
                    placeholder: "No parent",
                    options: ne($.code),
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "options"])) : w("", !0),
                  g(s(Z), {
                    type: "button",
                    disabled: !n.value || O($.code) || !r.test(Y($.code).code),
                    onClick: (T) => D($),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: h(() => [
                      g(s(X), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      q[6] || (q[6] = z(" Add term", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])) : w("", !0)
              ])) : w("", !0)
            ])
          ]),
          _: 2
        }, 1032, ["title", "code"]))), 128))
      ]),
      _: 2
    }, [
      v.value ? {
        name: "add",
        fn: h(() => [
          g(we, {
            label: "Vocabulary code",
            action: "Add vocabulary",
            existing: p.value.map(($) => $.code),
            onAdd: m
          }, {
            default: h(() => [...q[7] || (q[7] = [
              a("span", { class: "muted small" }, "Select fields pick their values from a vocabulary's terms.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), qs = { class: "muted small" }, Ds = { class: "pim-aspect" }, Ns = { class: "pim-fields" }, Ps = { class: "pim-f pim-w-full" }, Ls = { class: "pim-f-label" }, zs = ["id"], Bs = { class: "pim-aspect" }, Es = { class: "pim-stack tight" }, Ms = { class: "pim-level-head" }, Fs = { class: "pim-fields" }, Hs = { class: "pim-f pim-w-half" }, Js = { class: "pim-f-label" }, Ws = ["id"], Ks = { class: "pim-f pim-w-half" }, Gs = { class: "pim-f-label" }, Ys = ["id"], Zs = { class: "pim-aspect" }, Qs = { class: "pim-stack tight" }, Xs = { class: "pim-level-head" }, ei = { class: "mono" }, ai = { class: "pim-fields" }, li = { class: "pim-f-label" }, ti = ["id"], si = { class: "pim-f pim-w-half" }, ii = { class: "pim-f-label" }, ni = ["id"], oi = { class: "pim-f pim-w-half" }, di = { class: "pim-f-label" }, ui = ["id"], ri = /* @__PURE__ */ le({
  __name: "BuilderFamilies",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove"],
  setup(l, { emit: k }) {
    const t = l, u = k, r = Ae();
    function v(P, D) {
      return r + "-" + P.code + "-" + D;
    }
    const n = M(() => t.schema.access.admin), p = M(() => (t.draft.families ?? []).filter((P) => P.code !== "generic")), m = M(() => {
      const P = new Set(t.draft.plugins?.map((D) => D.use));
      return Object.entries(t.schema.attributes).filter(([, D]) => D.plugin && P.has(D.plugin));
    }), C = M(() => {
      const P = (t.draft.aspects ?? []).map((N) => N.namespace), D = [...new Set(m.value.map(([N]) => N.split(".")[0]))];
      return [...P, ...D.filter((N) => !P.includes(N))].map((N) => ({ value: N, label: G(N) }));
    }), j = M(() => new Map(t.options.types.map((P) => [P.id, P.form])));
    function K(P) {
      return `${G(P)} (${G(P.split(".")[0])})`;
    }
    const x = M(() => {
      const P = /* @__PURE__ */ new Map();
      function D(N, y, q = [], $ = "one") {
        const T = !!y && y !== "text" && y !== "record" && q.length === 0 && $ === "one";
        P.set(N, { value: N, label: K(N), canBeAxis: T });
      }
      for (const N of t.draft.aspects ?? [])
        for (const y of N.attributes ?? []) {
          const q = N.namespace + "." + y.code;
          D(q, j.value.get(y.type), y.scope, y.cardinality);
        }
      for (const [N, y] of m.value) D(N, y.form, y.scope, y.cardinality);
      return P;
    });
    function I(P) {
      return [...x.value.values()].filter((D) => P.aspects?.includes(D.value.split(".")[0]));
    }
    function b(P, D, N) {
      const y = D[N] ?? [], q = new Set(o(P).flatMap((T) => [...T.axes ?? [], ...T.own ?? []])), $ = I(P).filter((T) => y.includes(T.value) || !q.has(T.value) && (N === "own" || T.canBeAxis));
      return [...$, ...y.filter((T) => !$.some((ee) => ee.value === T)).map((T) => ({ value: T, label: K(T) }))];
    }
    const f = M(() => t.draft.dimensions ?? []);
    function d(P) {
      (t.draft.families ??= []).push({ code: P, aspects: [] });
    }
    function c(P) {
      t.draft.families.splice(t.draft.families.indexOf(P), 1), t.schema.declaration.families?.some((D) => D.code === P.code) && u("remove", "families", P.code);
    }
    function o(P) {
      return P.variation ?? [];
    }
    function O(P) {
      (P.variation ??= []).push({ axes: [] });
    }
    function B(P) {
      return P.requirements ?? [];
    }
    function te(P, D) {
      (P.requirements ??= []).push({ id: D, require: [] });
    }
    function Y(P, D) {
      return P.context?.[D] ?? "";
    }
    function ne(P, D, N) {
      const y = { ...P.context ?? {} };
      N ? y[D] = N : delete y[D], Object.keys(y).length ? P.context = y : delete P.context;
    }
    return (P, D) => (e(), R(xe, {
      count: p.value.length,
      columns: ["code", "details"]
    }, ue({
      default: h(() => [
        (e(!0), i(F, null, Q(p.value, (N) => (e(), R(Ce, {
          title: s(G)(N.code),
          code: N.code,
          key: N.code
        }, ue({
          details: h(() => [
            a("span", qs, V(N.aspects?.length ?? 0) + " " + V(N.aspects?.length === 1 ? "field group" : "field groups"), 1)
          ]),
          default: h(() => [
            a("div", Ds, [
              a("div", Ns, [
                a("div", Ps, [
                  a("div", Ls, [
                    a("label", {
                      id: v(N, "groups")
                    }, "Field groups", 8, zs),
                    D[0] || (D[0] = a("span", { class: "pim-f-note" }, "the fields this family's products carry", -1))
                  ]),
                  g(fe, {
                    disabled: !n.value,
                    labelledby: v(N, "groups"),
                    "model-value": N.aspects ?? [],
                    options: C.value,
                    "onUpdate:modelValue": (y) => s(Ve)(N, "aspects", y)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            a("div", Bs, [
              D[4] || (D[4] = a("header", { class: "pim-aspect-head" }, [
                a("h3", null, "Variation")
              ], -1)),
              D[5] || (D[5] = a("p", { class: "muted small pim-axis-help" }, "Choose the fields that distinguish variants at each level. Each field can be used once.", -1)),
              a("div", Es, [
                (e(!0), i(F, null, Q(o(N), (y, q) => (e(), i("div", {
                  key: q,
                  class: "pim-level"
                }, [
                  a("div", Ms, [
                    a("strong", null, "Level " + V(q + 1), 1),
                    n.value ? (e(), R(s(Z), {
                      key: 0,
                      type: "button",
                      "aria-label": "Remove level",
                      onClick: ($) => o(N).splice(q, 1),
                      text: "",
                      severity: "secondary",
                      size: "small"
                    }, {
                      default: h(() => [
                        g(s(X), { icon: "tabler:x" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])) : w("", !0)
                  ]),
                  a("div", Fs, [
                    a("div", Hs, [
                      a("div", Js, [
                        a("label", {
                          id: v(N, q + "-axes")
                        }, "Axes", 8, Ws)
                      ]),
                      D[1] || (D[1] = a("p", { class: "muted small pim-axis-help" }, "Choose a single-value field with no dimensions. Text and record fields are excluded.", -1)),
                      g(fe, {
                        disabled: !n.value,
                        dropdown: "",
                        labelledby: v(N, q + "-axes"),
                        "model-value": y.axes ?? [],
                        options: b(N, y, "axes"),
                        placeholder: "Add an axis",
                        "onUpdate:modelValue": ($) => y.axes = $
                      }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ]),
                    a("div", Ks, [
                      a("div", Gs, [
                        a("label", {
                          id: v(N, q + "-owned")
                        }, "Also owned here", 8, Ys)
                      ]),
                      D[2] || (D[2] = a("p", { class: "muted small pim-axis-help" }, "Other fields you edit at this level.", -1)),
                      g(fe, {
                        disabled: !n.value,
                        dropdown: "",
                        labelledby: v(N, q + "-owned"),
                        "model-value": y.own ?? [],
                        options: b(N, y, "own"),
                        placeholder: "Add a field",
                        "onUpdate:modelValue": ($) => $.length ? y.own = $ : delete y.own
                      }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ])
                  ])
                ]))), 128)),
                n.value ? (e(), R(s(Z), {
                  key: 0,
                  type: "button",
                  onClick: (y) => O(N),
                  severity: "secondary",
                  outlined: "",
                  size: "small"
                }, {
                  default: h(() => [
                    g(s(X), {
                      icon: "tabler:plus",
                      "aria-hidden": "true"
                    }),
                    D[3] || (D[3] = z(" Add level", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])) : w("", !0)
              ])
            ]),
            a("div", Zs, [
              D[9] || (D[9] = a("header", { class: "pim-aspect-head" }, [
                a("h3", null, "Requirements"),
                a("span", { class: "muted small" }, "what a channel needs before a product is ready")
              ], -1)),
              a("div", Qs, [
                (e(!0), i(F, null, Q(B(N), (y, q) => (e(), i("div", {
                  key: y.id,
                  class: "pim-level"
                }, [
                  a("div", Xs, [
                    a("strong", ei, V(y.id), 1),
                    n.value ? (e(), R(s(Z), {
                      key: 0,
                      type: "button",
                      "aria-label": "Remove requirement",
                      onClick: ($) => B(N).splice(q, 1),
                      text: "",
                      severity: "secondary",
                      size: "small"
                    }, {
                      default: h(() => [
                        g(s(X), { icon: "tabler:x" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])) : w("", !0)
                  ]),
                  a("div", ai, [
                    (e(!0), i(F, null, Q(f.value, ($) => (e(), i("div", {
                      key: $.name,
                      class: "pim-f pim-w-third"
                    }, [
                      a("div", li, [
                        a("label", {
                          id: v(N, y.id + "-context-" + $.name)
                        }, V(s(G)($.name)), 9, ti),
                        D[6] || (D[6] = a("span", { class: "pim-f-note" }, "context", -1))
                      ]),
                      g(s(ve), {
                        disabled: !n.value,
                        "aria-labelledby": v(N, y.id + "-context-" + $.name),
                        "model-value": Y(y, $.name),
                        "onUpdate:modelValue": (T) => ne(y, $.name, T),
                        options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ...$.members.map((T) => ({ value: T, label: String(T) }))],
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self"
                      }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                    ]))), 128)),
                    a("div", si, [
                      a("div", ii, [
                        a("label", {
                          id: v(N, y.id + "-required")
                        }, "Required", 8, ni),
                        D[7] || (D[7] = a("span", { class: "pim-f-note" }, "must hold a value", -1))
                      ]),
                      g(fe, {
                        disabled: !n.value,
                        dropdown: "",
                        labelledby: v(N, y.id + "-required"),
                        "model-value": y.require ?? [],
                        placeholder: "Add a required field",
                        options: I(N),
                        "onUpdate:modelValue": ($) => s(Ve)(y, "require", $)
                      }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ]),
                    a("div", oi, [
                      a("div", di, [
                        a("label", {
                          id: v(N, y.id + "-authored")
                        }, "Authored", 8, ui),
                        D[8] || (D[8] = a("span", { class: "pim-f-note" }, "must be set in the context itself, not by fallback", -1))
                      ]),
                      g(fe, {
                        disabled: !n.value,
                        dropdown: "",
                        labelledby: v(N, y.id + "-authored"),
                        "model-value": y.authored ?? [],
                        placeholder: "Add a field to author",
                        options: I(N),
                        "onUpdate:modelValue": ($) => s(Ve)(y, "authored", $)
                      }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ])
                  ])
                ]))), 128)),
                n.value ? (e(), R(we, {
                  key: 0,
                  label: "Requirement code",
                  action: "Add requirement",
                  existing: B(N).map((y) => y.id),
                  onAdd: (y) => te(N, y)
                }, null, 8, ["existing", "onAdd"])) : w("", !0)
              ])
            ])
          ]),
          _: 2
        }, [
          n.value ? {
            name: "actions",
            fn: h(() => [
              g(s(Z), {
                type: "button",
                onClick: (y) => c(N),
                "aria-label": "Remove " + s(G)(N.code),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: h(() => [
                  g(s(X), { icon: "tabler:trash" })
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
      n.value ? {
        name: "add",
        fn: h(() => [
          g(we, {
            label: "Family code",
            action: "Add family",
            existing: l.draft.families?.map((N) => N.code),
            onAdd: d
          }, {
            default: h(() => [...D[10] || (D[10] = [
              a("span", { class: "muted small" }, "Products without a family use the generic one.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), ci = ["inert"], mi = {
  key: 0,
  class: "row wrap"
}, pi = {
  key: 2,
  class: "small muted"
}, vi = { class: "pim-principal-service" }, fi = /* @__PURE__ */ le({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(l, { emit: k }) {
    const t = l, u = k, r = J(!1), v = J(""), n = J({});
    let p = 0;
    ce(() => t.modelValue, async (x) => {
      const I = ++p;
      try {
        const b = await ca(t.catalogId ?? "", x);
        I === p && (n.value = b);
      } catch {
        I === p && (n.value = {});
      }
    }, { immediate: !0, deep: !0 }), De(() => {
      p++;
    });
    function m(x) {
      return n.value[x] ?? me(x, "Person");
    }
    oa(async () => {
      try {
        await Ra("wc-principal-picker"), r.value = !0;
      } catch {
        r.value = !1;
      }
    });
    function C(x) {
      t.disabled || !x.trim() || t.modelValue.includes(x.trim()) || (u("update:modelValue", [...t.modelValue, x.trim()]), v.value = "");
    }
    function j(x) {
      const I = x.detail;
      if (!I || typeof I != "object") return;
      const b = I, f = b.principal_id ?? b.id;
      typeof f == "string" && C(f);
    }
    function K(x) {
      t.disabled || u("update:modelValue", t.modelValue.filter((I) => I !== x));
    }
    return (x, I) => (e(), i("div", {
      class: "pim-principal-list",
      inert: l.disabled || void 0
    }, [
      l.modelValue.length ? (e(), i("div", mi, [
        (e(!0), i(F, null, Q(l.modelValue, (b) => (e(), R(s(ie), {
          key: b,
          severity: "secondary"
        }, {
          default: h(() => [
            a("span", null, V(m(b)), 1),
            g(s(Z), {
              text: "",
              size: "small",
              disabled: l.disabled,
              "aria-label": "Remove " + m(b),
              onClick: (f) => K(b)
            }, {
              default: h(() => [
                g(s(X), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : w("", !0),
      r.value ? (e(), i("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: be(j, ["stop"])
      }, null, 32)) : (e(), i("span", pi, "The person picker is unavailable.")),
      a("label", vi, [
        I[3] || (I[3] = a("span", { class: "small muted" }, "Service account", -1)),
        g(s(Re), {
          modelValue: v.value,
          "onUpdate:modelValue": I[0] || (I[0] = (b) => v.value = b),
          disabled: l.disabled,
          placeholder: "Service principal id",
          onKeydown: I[1] || (I[1] = Qe(be((b) => C(v.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "disabled"])
      ]),
      g(s(Z), {
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: l.disabled || !v.value.trim(),
        onClick: I[2] || (I[2] = (b) => C(v.value))
      }, {
        default: h(() => [
          g(s(X), { icon: "tabler:plus" }),
          I[4] || (I[4] = z(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, ci));
  }
}), bi = { class: "pim-stack" }, yi = { class: "muted small" }, gi = { class: "pim-fields" }, hi = { class: "pim-f pim-w-half" }, ki = { class: "pim-f-label" }, _i = ["id"], $i = { class: "pim-f pim-w-half" }, wi = { class: "pim-f-label" }, xi = ["id"], Ci = { class: "muted small" }, Vi = { class: "pim-fields" }, Ui = { class: "pim-f pim-w-third" }, Si = { class: "pim-f-label" }, Ai = ["id"], Oi = { class: "pim-f pim-w-third" }, Ii = { class: "pim-f-label" }, Ri = ["for"], ji = { class: "row" }, Ti = ["aria-labelledby"], qi = { class: "pim-f-label" }, Di = ["id"], Ni = { key: 1 }, Pi = { class: "pim-f pim-w-full" }, Li = { class: "pim-f-label" }, zi = ["id"], Bi = /* @__PURE__ */ le({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(l, { emit: k }) {
    const t = l, u = k, r = Ae();
    function v(d, c) {
      return r + "-" + d + "-" + c;
    }
    const n = M(() => t.schema.access.admin), p = M(() => t.draft.channels ?? []), m = M(() => t.draft.sources ?? []), C = M(() => [...new Set((t.draft.families ?? []).flatMap((d) => (d.requirements ?? []).map((c) => c.id)))].map((d) => ({ value: d }))), j = M(() => (t.draft.families ?? []).filter((d) => d.code !== "generic").map((d) => ({ value: d.code, label: G(d.code) }))), K = M(() => (t.draft.aspects ?? []).map((d) => ({ value: d.namespace, label: G(d.namespace) })));
    function x(d) {
      (t.draft.channels ??= []).push({ id: d, requirements: [] });
    }
    function I(d) {
      p.value.splice(p.value.indexOf(d), 1), t.schema.declaration.channels?.some((c) => c.id === d.id) && u("remove", "channels", d.id);
    }
    function b(d) {
      (t.draft.sources ??= []).push({ id: d, ordering: "none", writes: [] });
    }
    function f(d) {
      m.value.splice(m.value.indexOf(d), 1), t.schema.declaration.sources?.some((c) => c.id === d.id) && u("remove", "sources", d.id);
    }
    return (d, c) => (e(), i("div", bi, [
      g(xe, {
        count: p.value.length,
        columns: ["code", "details"]
      }, ue({
        head: h(() => [
          c[0] || (c[0] = a("header", { class: "pim-bsection-head" }, [
            a("h3", null, "Channels")
          ], -1))
        ]),
        default: h(() => [
          (e(!0), i(F, null, Q(p.value, (o) => (e(), R(Ce, {
            key: o.id,
            title: s(G)(o.id),
            code: o.id
          }, ue({
            details: h(() => [
              a("span", yi, V(o.requirements?.length ?? 0) + " " + V(o.requirements?.length === 1 ? "requirement" : "requirements"), 1)
            ]),
            default: h(() => [
              a("div", gi, [
                a("div", hi, [
                  a("div", ki, [
                    a("label", {
                      id: v(o.id, "requirements")
                    }, "Requirements", 8, _i),
                    c[1] || (c[1] = a("span", { class: "pim-f-note" }, "a product is ready for the channel when these hold", -1))
                  ]),
                  g(fe, {
                    disabled: !n.value,
                    labelledby: v(o.id, "requirements"),
                    "model-value": o.requirements ?? [],
                    options: C.value,
                    "onUpdate:modelValue": (O) => s(Ve)(o, "requirements", O)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                a("div", $i, [
                  a("div", wi, [
                    a("label", {
                      id: v(o.id, "families")
                    }, "Families", 8, xi),
                    c[2] || (c[2] = a("span", { class: "pim-f-note" }, "empty means every family", -1))
                  ]),
                  g(fe, {
                    disabled: !n.value,
                    labelledby: v(o.id, "families"),
                    "model-value": o.families ?? [],
                    options: j.value,
                    "onUpdate:modelValue": (O) => s(Ve)(o, "families", O)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            n.value ? {
              name: "actions",
              fn: h(() => [
                g(s(Z), {
                  type: "button",
                  onClick: (O) => I(o),
                  "aria-label": "Remove " + s(G)(o.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: h(() => [
                    g(s(X), { icon: "tabler:trash" })
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
        n.value ? {
          name: "add",
          fn: h(() => [
            g(we, {
              label: "Channel code",
              action: "Add channel",
              existing: p.value.map((o) => o.id),
              onAdd: x
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"]),
      g(xe, {
        count: m.value.length,
        columns: ["code", "details"]
      }, ue({
        head: h(() => [
          c[3] || (c[3] = a("header", { class: "pim-bsection-head" }, [
            a("h3", null, "Sources")
          ], -1))
        ]),
        default: h(() => [
          (e(!0), i(F, null, Q(m.value, (o) => (e(), R(Ce, {
            key: o.id,
            title: s(G)(o.id),
            code: o.id
          }, ue({
            details: h(() => [
              a("span", Ci, V(o.writes?.length ?? 0) + " " + V(o.writes?.length === 1 ? "field group" : "field groups"), 1)
            ]),
            default: h(() => [
              a("div", Vi, [
                a("div", Ui, [
                  a("div", Si, [
                    a("label", {
                      id: v(o.id, "ordering")
                    }, "Ordering", 8, Ai),
                    c[4] || (c[4] = a("span", { class: "pim-f-note" }, "sequence keeps late deliveries from winning", -1))
                  ]),
                  g(s(ve), {
                    disabled: !n.value,
                    "aria-labelledby": v(o.id, "ordering"),
                    "model-value": o.ordering ?? "none",
                    "onUpdate:modelValue": (O) => o.ordering = O,
                    options: [{ value: "none", label: "none" }, { value: "sequence", label: "sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                a("div", Oi, [
                  a("div", Ii, [
                    a("label", {
                      for: v(o.id, "audit")
                    }, "Audit", 8, Ri),
                    c[5] || (c[5] = a("span", { class: "pim-f-note" }, "record each value change", -1))
                  ]),
                  a("div", ji, [
                    g(s(qe), {
                      disabled: !n.value,
                      "input-id": v(o.id, "audit"),
                      "model-value": o.audit !== !1,
                      "onUpdate:modelValue": (O) => O ? delete o.audit : o.audit = !1
                    }, null, 8, ["disabled", "input-id", "model-value", "onUpdate:modelValue"]),
                    a("span", null, V(o.audit === !1 ? "Off for this source" : "As the catalog policy"), 1)
                  ])
                ]),
                a("div", {
                  class: "pim-f pim-w-third",
                  role: "group",
                  "aria-labelledby": v(o.id, "people")
                }, [
                  a("div", qi, [
                    a("label", {
                      id: v(o.id, "people")
                    }, "People and service accounts", 8, Di),
                    c[6] || (c[6] = a("span", { class: "pim-f-note" }, "who may write as this source", -1))
                  ]),
                  n.value ? (e(), R(fi, {
                    key: 0,
                    "catalog-id": l.catalogId,
                    "model-value": o.principals ?? [],
                    "onUpdate:modelValue": (O) => s(Ve)(o, "principals", O)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])) : (e(), i("span", Ni, V(o.principals?.length ? o.principals.length + (o.principals.length === 1 ? " allowed account" : " allowed accounts") : "No accounts specified"), 1))
                ], 8, Ti),
                a("div", Pi, [
                  a("div", Li, [
                    a("label", {
                      id: v(o.id, "writes")
                    }, "Writes", 8, zi),
                    c[7] || (c[7] = a("span", { class: "pim-f-note" }, "field groups this source may set", -1))
                  ]),
                  g(fe, {
                    disabled: !n.value,
                    labelledby: v(o.id, "writes"),
                    "model-value": o.writes ?? [],
                    options: K.value,
                    "onUpdate:modelValue": (O) => s(Ve)(o, "writes", O)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            n.value ? {
              name: "actions",
              fn: h(() => [
                g(s(Z), {
                  type: "button",
                  onClick: (O) => f(o),
                  "aria-label": "Remove " + s(G)(o.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: h(() => [
                    g(s(X), { icon: "tabler:trash" })
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
        n.value ? {
          name: "add",
          fn: h(() => [
            g(we, {
              label: "Source code",
              action: "Add source",
              existing: m.value.map((o) => o.id),
              onAdd: b
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])
    ]));
  }
}), Ei = { class: "pim-stack" }, Mi = { class: "pim-bsection-head" }, Fi = { class: "muted small" }, Hi = {
  key: 0,
  class: "pim-aspect muted"
}, Ji = {
  key: 1,
  class: "muted small"
}, Wi = {
  key: 3,
  class: "muted small"
}, Ki = {
  key: 0,
  class: "pim-aspect muted"
}, Gi = { class: "row wrap muted small" }, Yi = /* @__PURE__ */ le({
  __name: "BuilderPlugins",
  props: {
    draft: {},
    schema: {},
    options: {},
    pluginConfigs: { default: () => ({}) },
    stale: { type: Boolean }
  },
  emits: ["remove", "configure"],
  setup(l, { emit: k }) {
    const t = l, u = k, r = /* @__PURE__ */ new Map([
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
    function n(c, o) {
      const O = o.map((B) => r.get(B)).filter(Boolean);
      return [G(c), O.join(", ")].filter(Boolean).join(" · ");
    }
    const p = M(() => t.schema.access.admin), m = M(() => t.draft.plugins ?? []);
    function C(c) {
      return m.value.some((o) => o.use === c.plugin);
    }
    function j(c) {
      return t.schema.plugins.find((o) => o.plugin === c.plugin);
    }
    function K(c, o) {
      o && !C(c) && (t.draft.plugins ??= []).push({ use: c.plugin }), o || (t.draft.plugins = m.value.filter((O) => O.use !== c.plugin), delete t.pluginConfigs[c.plugin], j(c)?.active && u("remove", "plugins", c.plugin));
    }
    function x(c, o) {
      t.pluginConfigs[c.plugin] = o;
    }
    function I(c) {
      return Object.entries(t.schema.attributes).filter(([, o]) => o.plugin === c.plugin).map(([o]) => G(o));
    }
    const b = M(() => t.draft.scopes ?? []);
    function f(c) {
      return b.value.includes(c.id);
    }
    function d(c, o) {
      o && !f(c) && (t.draft.scopes ??= []).push(c.id), !o && f(c) && (b.value.splice(b.value.indexOf(c.id), 1), t.schema.declaration.scopes?.includes(c.id) && u("remove", "scopes", c.id));
    }
    return (c, o) => (e(), i("div", Ei, [
      g(xe, {
        count: l.options.plugins.length,
        columns: ["details"]
      }, {
        head: h(() => [
          a("header", Mi, [
            o[0] || (o[0] = a("h3", null, "Plugins", -1)),
            a("span", Fi, V(l.options.plugins.length) + " installed", 1)
          ])
        ]),
        default: h(() => [
          l.options.plugins.length === 0 ? (e(), i("div", Hi, "No plugin is installed.")) : w("", !0),
          (e(!0), i(F, null, Q(l.options.plugins, (O) => (e(), R(Ce, {
            key: O.plugin,
            title: s(me)(O.title, "Plugin")
          }, ue({
            details: h(() => [
              g(s(ie), {
                severity: C(O) ? "success" : "secondary",
                value: C(O) ? "Active" : "Inactive"
              }, null, 8, ["severity", "value"])
            ]),
            default: h(() => [
              j(O)?.problem ? (e(), R(s($e), {
                key: 0,
                severity: "warn"
              }, {
                default: h(() => [
                  z(V(j(O)?.problem?.message) + " ", 1),
                  a("code", null, V(j(O)?.problem?.code), 1)
                ]),
                _: 2
              }, 1024)) : w("", !0),
              I(O).length ? (e(), i("p", Ji, "Fields: " + V(I(O).join(", ")) + ".", 1)) : w("", !0),
              C(O) ? (e(), R(ea, {
                key: 2,
                disabled: !p.value,
                schema: O.config_schema,
                "model-value": l.pluginConfigs[O.plugin] ?? j(O)?.config ?? {},
                "onUpdate:modelValue": (B) => x(O, B)
              }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue"])) : w("", !0),
              j(O)?.active ? (e(), i("p", Wi, [
                z(V(v[j(O).lifecycle.state]) + " ", 1),
                (e(!0), i(F, null, Q(j(O)?.projections, (B, te) => (e(), i("span", { key: te }, " · " + V(s(G)(s(me)(te, "Background update"))) + ": " + V(B.parked ? "Paused" : B.bootstrapping ? "Starting" : "Ready"), 1))), 128))
              ])) : w("", !0),
              p.value && j(O)?.active && l.pluginConfigs[O.plugin] ? (e(), R(s(Z), {
                key: 4,
                disabled: l.stale,
                label: "Save configuration",
                onClick: (B) => u("configure", O.plugin, l.pluginConfigs[O.plugin])
              }, null, 8, ["disabled", "onClick"])) : w("", !0)
            ]),
            _: 2
          }, [
            p.value ? {
              name: "actions",
              fn: h(() => [
                g(s(qe), {
                  "aria-label": "Enable " + s(me)(O.title, "Plugin"),
                  "model-value": C(O),
                  "onUpdate:modelValue": (B) => K(O, B)
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["title"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      g(xe, {
        count: l.options.scopes.length,
        columns: ["details"]
      }, {
        head: h(() => [...o[1] || (o[1] = [
          a("header", { class: "pim-bsection-head" }, [
            a("h3", null, "Scopes"),
            a("span", { class: "muted small" }, "Filters added by plugins")
          ], -1)
        ])]),
        default: h(() => [
          l.options.scopes.length === 0 ? (e(), i("div", Ki, "No scope is declared.")) : w("", !0),
          (e(!0), i(F, null, Q(l.options.scopes, (O) => (e(), R(Ce, {
            key: O.id,
            title: s(me)(O.title, "Scope")
          }, ue({
            details: h(() => [
              g(s(ie), {
                severity: f(O) ? "success" : "secondary",
                value: f(O) ? "Adopted" : "Not adopted"
              }, null, 8, ["severity", "value"])
            ]),
            default: h(() => [
              a("div", Gi, [
                o[2] || (o[2] = a("span", null, "Filters", -1)),
                (e(!0), i(F, null, Q(O.filters, (B, te) => (e(), R(s(ie), {
                  key: te,
                  class: "kx-tag-sm small",
                  severity: "secondary",
                  value: n(te, B.ops)
                }, null, 8, ["value"]))), 128)),
                a("span", null, V(s(G)(O.access)) + " access required", 1)
              ])
            ]),
            _: 2
          }, [
            p.value ? {
              name: "actions",
              fn: h(() => [
                g(s(qe), {
                  "aria-label": "Adopt " + s(me)(O.title, "Scope"),
                  "model-value": f(O),
                  "onUpdate:modelValue": (B) => d(O, B)
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
async function Zi(l) {
  const k = await ya(`/api/v1/pim-admin/catalogs/${encodeURIComponent(l)}/policy_defaults`, "policy defaults");
  if (k.audit !== "fields" && k.audit !== "off" || !["audit_days", "trash_days", "tombstone_days"].every((t) => typeof k[t] == "number" && Number.isSafeInteger(k[t])))
    throw new Error("Policy defaults are unavailable.");
  for (const [t, u] of Object.entries(pa)) {
    const r = k[t];
    if (typeof r != "number" || !Number.isSafeInteger(r) || r < u.min || r > u.max) throw new Error(`Policy ${t} is unavailable.`);
  }
  return k;
}
const pa = {
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
}, Qi = { class: "form" }, Xi = {
  key: 0,
  class: "muted small pim-policy-status",
  role: "status"
}, en = ["id", "data-policy-group", "aria-label"], an = {
  key: 0,
  class: "pim-bsection-head"
}, ln = { class: "pim-policy-copy" }, tn = ["for"], sn = ["id"], nn = { key: 0 }, on = ["aria-expanded"], dn = /* @__PURE__ */ le({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {},
    disabled: { type: Boolean }
  },
  setup(l) {
    const k = l, t = J(), u = M(() => k.defaults ?? t.value), r = J(), v = J(!1);
    async function n() {
      if (!(k.defaults || k.disabled)) {
        r.value = void 0, v.value = !0;
        try {
          t.value = await Zi(k.catalogId ?? "");
        } catch (c) {
          r.value = Se(c, "Could not read policy defaults.");
        } finally {
          v.value = !1;
        }
      }
    }
    oa(n);
    const p = M(() => k.draft.policy ?? {}), m = J(!1), C = [
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
    function K(c) {
      const o = pa[c];
      return { key: c, ...o, kind: "int", hint: j[c] };
    }
    C.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(K));
    const x = ["proposal_days", "proposal_count"].map(K), I = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(K), b = [
      { id: "retention", title: "Retention", keys: C },
      { id: "proposals", title: "Proposals", keys: x },
      { id: "advanced", title: "", keys: I }
    ], f = M(() => [
      { value: "inherited", label: u.value ? `${u.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function d(c, o) {
      const O = k.draft.policy ?? (k.draft.policy = {});
      O[c] = o == null || o === "" || o === "inherited" ? !1 : o;
    }
    return (c, o) => (e(), i("section", Qi, [
      o[4] || (o[4] = a("p", { class: "muted small pim-policy-intro" }, "Empty fields inherit the deployment settings.", -1)),
      v.value ? (e(), i("p", Xi, "Loading deployment defaults…")) : w("", !0),
      r.value ? (e(), R(Ee, {
        key: 1,
        error: r.value
      }, {
        default: h(() => [
          g(s(Z), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: n
          }, {
            default: h(() => [...o[1] || (o[1] = [
              z("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : w("", !0),
      (e(), i(F, null, Q(b, (O) => (e(), i(F, {
        key: O.id
      }, [
        O.id !== "advanced" || m.value ? (e(), i("section", {
          key: 0,
          id: O.id === "advanced" ? "policy-advanced" : void 0,
          "data-policy-group": O.id,
          class: "pim-policy-group",
          "aria-label": O.title || "Advanced"
        }, [
          O.title ? (e(), i("header", an, [
            a("h3", null, V(O.title), 1)
          ])) : w("", !0),
          (e(!0), i(F, null, Q(O.keys, (B) => (e(), i("div", {
            key: B.key,
            class: "pim-policy-row"
          }, [
            a("div", ln, [
              a("label", {
                for: "pol-" + B.key
              }, V(B.title), 9, tn),
              a("p", {
                id: "pol-help-" + B.key
              }, [
                z(V(B.hint), 1),
                B.global ? (e(), i("span", nn, " Managed in deployment settings.")) : w("", !0)
              ], 8, sn)
            ]),
            B.kind === "enum" ? (e(), R(s(ve), {
              key: 0,
              disabled: l.disabled,
              "input-id": "pol-" + B.key,
              "aria-describedby": "pol-help-" + B.key,
              class: "pim-policy-control",
              "model-value": typeof p.value[B.key] == "string" ? p.value[B.key] : "inherited",
              options: f.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": (te) => d(B.key, te)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])) : (e(), R(s(qa), {
              key: 1,
              disabled: l.disabled || B.global,
              "input-id": "pol-" + B.key,
              "aria-describedby": "pol-help-" + B.key,
              class: "pim-policy-control",
              "model-value": B.global ? Number(u.value?.[B.key] ?? 0) || null : typeof p.value[B.key] == "number" ? Number(p.value[B.key]) : null,
              min: B.min ?? (B.key === "audit_days" ? 0 : 1),
              max: B.max,
              step: 1,
              placeholder: u.value ? "Default: " + u.value[B.key] : "Deployment default",
              "onUpdate:modelValue": (te) => d(B.key, te)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "min", "max", "placeholder", "onUpdate:modelValue"]))
          ]))), 128))
        ], 8, en)) : w("", !0),
        O.id === "proposals" ? (e(), i("button", {
          key: 1,
          type: "button",
          class: "pim-policy-advanced",
          "aria-expanded": m.value,
          "aria-controls": "policy-advanced",
          onClick: o[0] || (o[0] = (B) => m.value = !m.value)
        }, [
          g(s(X), {
            icon: m.value ? "tabler:chevron-down" : "tabler:chevron-right",
            "aria-hidden": "true"
          }, null, 8, ["icon"]),
          o[2] || (o[2] = a("span", null, "Advanced", -1)),
          o[3] || (o[3] = a("span", { class: "muted small" }, "Processing limits and deployment settings", -1))
        ], 8, on)) : w("", !0)
      ], 64))), 64))
    ]));
  }
}), un = { class: "form" }, rn = { class: "pim-aspect" }, cn = { class: "pim-aspect-head" }, mn = {
  key: 0,
  class: "muted small"
}, pn = /* @__PURE__ */ le({
  __name: "BuilderDeclaration",
  props: {
    draft: {},
    readonly: { type: Boolean }
  },
  emits: ["replace", "validity"],
  setup(l, { emit: k }) {
    const t = l, u = k, r = J(JSON.stringify(t.draft, null, 2)), v = J("");
    De(() => u("validity", !0)), ce(() => t.draft, (p) => {
      r.value = JSON.stringify(p, null, 2), v.value = "";
    }, { deep: !0 });
    function n() {
      if (!t.readonly)
        try {
          const p = Ea(r.value);
          v.value = "", u("validity", !0), u("replace", p);
        } catch (p) {
          u("validity", !1), v.value = "Invalid declaration: " + (p instanceof Error ? p.message : String(p));
        }
    }
    return (p, m) => (e(), i("section", un, [
      a("div", rn, [
        a("header", cn, [
          m[1] || (m[1] = a("h3", null, "Declaration", -1)),
          l.readonly ? w("", !0) : (e(), i("span", mn, "edits apply to the draft when the JSON parses"))
        ]),
        v.value ? (e(), R(s($e), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: h(() => [
            z(V(v.value), 1)
          ]),
          _: 1
        })) : w("", !0),
        g(s(Da), {
          modelValue: r.value,
          "onUpdate:modelValue": m[0] || (m[0] = (C) => r.value = C),
          readonly: l.readonly,
          "aria-label": "Catalog declaration",
          rows: "28",
          spellcheck: "false",
          onInput: n,
          onBlur: n,
          class: "mono pim-json-edit"
        }, null, 8, ["modelValue", "readonly"])
      ])
    ]));
  }
}), vn = {
  key: 0,
  class: "pim-detail-head"
}, fn = { class: "pim-detail-actions" }, bn = { class: "pim-settings-pane" }, yn = { class: "pim-builder-main pim-readable" }, gn = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, hn = ["aria-labelledby"], kn = { class: "pim-group-head" }, _n = ["id"], $n = { class: "pim-card-body pad" }, wn = { key: 0 }, xn = { key: 1 }, Cn = { key: 2 }, Vn = { key: 3 }, Un = { key: 4 }, Sn = { class: "pim-error-copy" }, An = { key: 0 }, On = {
  key: 6,
  class: "pim-plan-list"
}, In = { key: 1 }, Rn = {
  key: 7,
  class: "row end"
}, jn = {
  key: 4,
  class: "kx-loading",
  role: "status"
}, Tn = ["disabled", "inert"], qn = /* @__PURE__ */ le({
  __name: "SchemaBuilder",
  props: {
    catalogId: {},
    embedded: { type: Boolean },
    title: {},
    backLabel: {}
  },
  emits: ["applied", "back", "dirty-changed"],
  setup(l, { emit: k }) {
    const t = l, u = k, r = [
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
    ], v = J("fields"), n = J(null), p = J(null), m = J({}), C = J({}), j = J({}), K = M(() => Object.fromEntries(Object.entries(j.value).filter(([E]) => m.value.plugins?.some((L) => L.use === E) && !n.value?.plugins.some((L) => L.plugin === E && L.active)))), x = J(), I = J(!1), b = J(null), f = J(!1), d = M(() => n.value?.access.admin === !0), c = J(""), o = J(null), O = J(null), B = Ae(), te = {
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
    }, ne = J(null), P = J(!0), D = ze(), N = M(() => !I.value && P.value && !!o.value && o.value.class !== "refused" && !!ne.value?.matches(Ie.value, n.value?.schema_generation ?? -1, K.value)), y = M(() => o.value ? [...o.value.refused, ...o.value.changes.filter((E) => E.class !== "refused")] : []), q = ze(), $ = J(!1);
    let T = 0;
    ce([m, C, j], () => {
      T++, o.value = null;
    }, { deep: !0, flush: "sync" });
    async function ee(E = !1, L = !1) {
      if (re.value && !E) return;
      const W = q.begin(), _e = T, ye = t.catalogId, ge = L ? Object.entries(j.value).filter(([he]) => n.value?.plugins.some((Ne) => Ne.plugin === he && Ne.active)) : [];
      $.value = !0, x.value = void 0;
      try {
        const [he, Ne] = await Promise.all([oe.schema(ye), oe.schemaOptions(ye)]);
        if (!q.current(W) || _e !== T || ye !== t.catalogId) return;
        n.value = he, p.value = Ne, m.value = Pe(he.declaration), C.value = {}, j.value = Object.fromEntries(ge.filter(([va]) => he.plugins.some((aa) => aa.plugin === va && aa.active))), o.value = null, P.value = !0, I.value = !1;
      } catch (he) {
        q.current(W) && (x.value = Se(he, "Could not load settings."));
      } finally {
        q.current(W) && ($.value = !1);
      }
    }
    let Oe = () => {
    };
    ce(() => t.catalogId, (E) => {
      Oe(), Oe = da(`component.${E}`, () => {
        re.value || ee();
      });
    }, { immediate: !0 }), Ze(async () => {
      re.value || await ee();
    }), De(() => {
      Oe(), D.begin(), q.begin();
    }), ce(() => t.catalogId, () => {
      D.begin(), f.value = !1, I.value = !1, n.value = null, p.value = null, H(), ee();
    });
    const Me = M(() => Object.values(ta(m.value, C.value)).reduce((E, L) => E + (L?.length ?? 0), 0)), re = M(() => !!n.value && (JSON.stringify(m.value) !== JSON.stringify(n.value.declaration) || Me.value > 0 || Object.keys(j.value).length > 0));
    ce(re, (E) => u("dirty-changed", E), { immediate: !0 });
    const Fe = M(() => ![m.value.aspects, m.value.dimensions, m.value.vocabularies, m.value.families, m.value.channels, m.value.sources, m.value.plugins, m.value.scopes].some((E) => E?.length)), Ie = M(() => {
      const E = Pe(m.value), L = ta(E, C.value);
      return Object.keys(L).length && (E.remove = L), E;
    });
    ce(re, (E) => {
      E || (o.value = null);
    }), ce([Ie, K], () => {
      o.value = null;
    }, { deep: !0 });
    function He(E) {
      const [L, W] = E.split(" ", 2);
      if (L === "plugin" && W) return p.value?.plugins.find((ge) => ge.plugin === W)?.title || "Plugin";
      if (L === "scope" && W) return p.value?.scopes.find((ge) => ge.id === W)?.title || "Scope";
      if (L === "aspect" && W) return G(W) + " field group";
      const [_e, ye] = E.split(".", 2);
      return ye ? `${G(ye)} (${G(_e)})` : G(E);
    }
    function U(E, L) {
      x.value = Se(E, L), x.value.code === ga && (I.value = !0, o.value = null, ne.value = null);
    }
    async function A() {
      if (!(re.value && !await ua.confirm({
        header: "Discard unsaved changes?",
        message: "Reloading will discard unsaved settings and plugin changes.",
        acceptLabel: "Discard and reload",
        rejectLabel: "Cancel"
      }))) {
        f.value = !0, c.value = "";
        try {
          await ee(!0);
        } finally {
          f.value = !1;
        }
      }
    }
    async function S() {
      if (!n.value || !P.value || I.value) return;
      const E = D.begin(), L = La(Ie.value, n.value.schema_generation, K.value);
      f.value = !0, x.value = void 0;
      try {
        const W = await oe.planSchema(t.catalogId, L.declaration, L.generation, L.pluginConfigs);
        if (!D.current(E) || !L.matches(Ie.value, n.value.schema_generation, K.value) || !P.value) return;
        ne.value = L, o.value = W, await Je(), O.value?.focus();
      } catch (W) {
        if (!D.current(E)) return;
        U(W, "Could not review the change."), o.value = null, ne.value = null, await Je(), b.value?.$el.focus();
      } finally {
        D.current(E) && (f.value = !1);
      }
    }
    async function _() {
      if (!n.value || !re.value || !N.value || !ne.value) return;
      const E = t.catalogId, L = D.begin();
      f.value = !0, x.value = void 0, c.value = "";
      try {
        const W = await oe.applySchema(E, ne.value.declaration, ne.value.generation, ne.value.pluginConfigs);
        if (E !== t.catalogId || !D.current(L) || (await ee(!0, !0), E !== t.catalogId || !D.current(L))) return;
        c.value = `Applied as generation ${W.generation}`, u("applied", W.generation);
      } catch (W) {
        if (E !== t.catalogId || !D.current(L)) return;
        U(W, "Could not apply the change."), await Je(), b.value?.$el.focus();
      } finally {
        D.current(L) && (f.value = !1);
      }
    }
    async function se(E, L) {
      const W = t.catalogId, _e = q.begin(), ye = D.begin();
      f.value = !0, x.value = void 0;
      try {
        const ge = JSON.stringify(L);
        if (await oe.configurePlugin(W, E, Pe(L)), W !== t.catalogId || !q.current(_e)) return;
        const he = await oe.schema(W);
        if (W !== t.catalogId || !q.current(_e)) return;
        n.value && (n.value.plugins = he.plugins), JSON.stringify(j.value[E]) === ge && delete j.value[E], c.value = "Configuration saved";
      } catch (ge) {
        W === t.catalogId && D.current(ye) && U(ge, "Could not save configuration.");
      } finally {
        D.current(ye) && (f.value = !1);
      }
    }
    function H() {
      j.value = {}, P.value = !0, n.value && (m.value = Pe(n.value.declaration)), C.value = {}, o.value = null, c.value = "";
    }
    function pe(E, L) {
      const W = C.value[E] ?? [];
      W.includes(L) || (C.value = { ...C.value, [E]: [...W, L] });
    }
    return (E, L) => (e(), i("div", {
      class: ke(["pim-builder", { embedded: l.embedded }])
    }, [
      l.embedded ? (e(), i("div", vn, [
        a("h2", null, V(l.title || "Catalog"), 1),
        n.value ? (e(), R(s(ie), {
          key: 0,
          severity: "secondary",
          value: "Generation " + n.value.schema_generation
        }, null, 8, ["value"])) : w("", !0),
        a("div", fn, [
          de(E.$slots, "actions", {
            access: n.value?.access
          }),
          g(ia, {
            access: n.value?.access,
            dirty: re.value,
            busy: f.value,
            valid: P.value && !I.value,
            reviewed: !!o.value,
            onDiscard: H,
            onReview: S
          }, null, 8, ["access", "dirty", "busy", "valid", "reviewed"])
        ])
      ])) : (e(), R(ql, {
        key: 1,
        title: l.title || "Catalog",
        subtitle: n.value ? "Settings · generation " + n.value.schema_generation : "Settings",
        icon: "tabler:settings",
        "back-label": l.backLabel,
        onBack: L[0] || (L[0] = (W) => u("back"))
      }, {
        default: h(() => [
          de(E.$slots, "actions", {
            access: n.value?.access
          }),
          g(ia, {
            access: n.value?.access,
            dirty: re.value,
            busy: f.value,
            valid: P.value && !I.value,
            reviewed: !!o.value,
            onDiscard: H,
            onReview: S
          }, null, 8, ["access", "dirty", "busy", "valid", "reviewed"])
        ]),
        _: 3
      }, 8, ["title", "subtitle", "back-label"])),
      n.value && p.value ? (e(), R(s(Aa), {
        key: 2,
        value: v.value,
        "onUpdate:value": L[1] || (L[1] = (W) => v.value = W),
        class: "pim-section-tabs"
      }, {
        default: h(() => [
          g(s(Oa), { "aria-label": "Schema sections" }, {
            default: h(() => [
              (e(), i(F, null, Q(r, (W) => g(s(Ia), {
                key: W.id,
                value: W.id
              }, {
                default: h(() => [
                  z(V(W.title), 1)
                ]),
                _: 2
              }, 1032, ["value"])), 64))
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["value"])) : w("", !0),
      a("div", bn, [
        a("div", yn, [
          x.value ? (e(), R(Ee, {
            key: 0,
            ref_key: "errorPanel",
            ref: b,
            error: x.value,
            tabindex: "-1"
          }, {
            default: h(() => [
              I.value ? (e(), R(s(Z), {
                key: 0,
                type: "button",
                severity: "secondary",
                outlined: "",
                size: "small",
                disabled: f.value,
                onClick: A
              }, {
                default: h(() => [...L[5] || (L[5] = [
                  z("Reload settings", -1)
                ])]),
                _: 1
              }, 8, ["disabled"])) : !n.value || !p.value ? (e(), R(s(Z), {
                key: 1,
                type: "button",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: L[2] || (L[2] = (W) => ee())
              }, {
                default: h(() => [...L[6] || (L[6] = [
                  z("Retry", -1)
                ])]),
                _: 1
              })) : w("", !0)
            ]),
            _: 1
          }, 8, ["error"])) : I.value && $.value ? (e(), i("div", gn, "Reloading settings…")) : w("", !0),
          c.value ? (e(), R(s($e), {
            key: 2,
            severity: "success"
          }, {
            default: h(() => [
              z(V(c.value), 1)
            ]),
            _: 1
          })) : w("", !0),
          o.value ? (e(), i("section", {
            key: 3,
            class: "pim-table pim-plan",
            "aria-labelledby": s(B)
          }, [
            a("div", kn, [
              g(s(X), {
                icon: "tabler:checklist",
                "aria-hidden": "true"
              }),
              a("h3", {
                id: s(B),
                ref_key: "reviewHeading",
                ref: O,
                tabindex: "-1"
              }, "Review changes", 8, _n),
              g(s(ie), {
                class: "kx-tag-sm",
                severity: o.value.class === "refused" ? "danger" : o.value.class === "semantic" ? "warn" : "info"
              }, {
                default: h(() => [
                  z(V(te[o.value.class] || "Schema changes"), 1)
                ]),
                _: 1
              }, 8, ["severity"])
            ]),
            a("div", $n, [
              o.value.class === "unchanged" ? (e(), i("p", wn, "Nothing would change.")) : o.value.class === "initial" ? (e(), i("p", xn, "This will set up the first schema.")) : o.value.class === "cosmetic" ? (e(), i("p", Cn, "These changes leave stored product values as they are.")) : o.value.class === "additive" ? (e(), i("p", Vn, "Existing product values stay as they are.")) : o.value.class === "semantic" ? (e(), i("p", Un, "The catalog will recalculate product values or readiness after you apply these changes.")) : o.value.class === "refused" ? (e(), R(s($e), {
                key: 5,
                severity: "error"
              }, {
                default: h(() => [
                  a("span", Sn, [
                    L[7] || (L[7] = z(" These changes can’t be applied. ", -1)),
                    o.value.migration && o.value.refused.some((W) => n.value?.attributes[W.code]) ? (e(), i("span", An, " To change how a field stores values, add a new field and copy the existing values into it. Then remove the original field and give the new field its name. ")) : w("", !0)
                  ])
                ]),
                _: 1
              })) : w("", !0),
              y.value.length ? (e(), i("ul", On, [
                (e(!0), i(F, null, Q(y.value, (W, _e) => (e(), i("li", { key: _e }, [
                  W.class === "refused" ? (e(), R(s(ie), {
                    key: 0,
                    class: "kx-tag-sm small",
                    severity: "danger"
                  }, {
                    default: h(() => [...L[8] || (L[8] = [
                      z("Blocked", -1)
                    ])]),
                    _: 1
                  })) : w("", !0),
                  W.code ? (e(), i("strong", In, V(He(W.code)), 1)) : w("", !0),
                  a("span", null, V(Y[W.what] || W.what), 1)
                ]))), 128))
              ])) : w("", !0),
              n.value?.access.admin && o.value.class !== "refused" ? (e(), i("div", Rn, [
                g(s(Z), {
                  disabled: !re.value || f.value || !N.value,
                  loading: f.value,
                  onClick: _
                }, {
                  default: h(() => [
                    z(V(v.value === "layout" ? "Apply layout" : "Apply"), 1)
                  ]),
                  _: 1
                }, 8, ["disabled", "loading"])
              ])) : w("", !0)
            ])
          ], 8, hn)) : w("", !0),
          $.value && (!n.value || !p.value) ? (e(), i("div", jn, "Loading…")) : n.value && p.value && v.value === "history" ? (e(), R(Al, {
            key: 5,
            "catalog-id": l.catalogId,
            "can-resolve-actors": d.value
          }, null, 8, ["catalog-id", "can-resolve-actors"])) : n.value && p.value ? (e(), i("fieldset", {
            key: 6,
            class: "pim-editor-surface",
            disabled: f.value,
            inert: f.value
          }, [
            d.value ? w("", !0) : (e(), R(s($e), {
              key: 0,
              severity: "info",
              class: "pim-readonly"
            }, {
              default: h(() => [...L[9] || (L[9] = [
                z("Read-only settings", -1)
              ])]),
              _: 1
            })),
            Fe.value && v.value === "fields" ? (e(), R(s($e), {
              key: 1,
              severity: "info"
            }, {
              default: h(() => [
                z(V(d.value ? "Define its schema. Add a field group to start defining fields." : "This catalog has no field groups yet."), 1)
              ]),
              _: 1
            })) : w("", !0),
            v.value === "fields" ? (e(), R(ls, {
              key: 2,
              draft: m.value,
              schema: n.value,
              options: p.value,
              onRemove: pe
            }, null, 8, ["draft", "schema", "options"])) : v.value === "layout" ? (e(), R(dl, {
              key: 3,
              draft: m.value,
              schema: n.value,
              types: p.value.types
            }, null, 8, ["draft", "schema", "types"])) : v.value === "dimensions" ? (e(), R(ms, {
              key: 4,
              draft: m.value,
              schema: n.value,
              onRemove: pe
            }, null, 8, ["draft", "schema"])) : v.value === "vocabularies" ? (e(), R(Ts, {
              key: 5,
              "catalog-id": l.catalogId,
              draft: m.value,
              schema: n.value,
              onRemove: pe
            }, null, 8, ["catalog-id", "draft", "schema"])) : v.value === "families" ? (e(), R(ri, {
              key: 6,
              draft: m.value,
              schema: n.value,
              options: p.value,
              onRemove: pe
            }, null, 8, ["draft", "schema", "options"])) : v.value === "channels" ? (e(), R(Bi, {
              key: 7,
              "catalog-id": l.catalogId,
              draft: m.value,
              schema: n.value,
              onRemove: pe
            }, null, 8, ["catalog-id", "draft", "schema"])) : v.value === "plugins" ? (e(), R(Yi, {
              key: 8,
              draft: m.value,
              schema: n.value,
              options: p.value,
              "plugin-configs": j.value,
              stale: I.value,
              onConfigure: se,
              onRemove: pe
            }, null, 8, ["draft", "schema", "options", "plugin-configs", "stale"])) : v.value === "policy" ? (e(), R(dn, {
              key: 9,
              "catalog-id": l.catalogId,
              draft: m.value,
              disabled: !d.value
            }, null, 8, ["catalog-id", "draft", "disabled"])) : v.value === "declaration" ? (e(), R(pn, {
              key: 10,
              draft: m.value,
              readonly: !d.value,
              onReplace: L[3] || (L[3] = (W) => m.value = W),
              onValidity: L[4] || (L[4] = (W) => {
                P.value = W, o.value = null;
              })
            }, null, 8, ["draft", "readonly"])) : w("", !0)
          ], 8, Tn)) : w("", !0)
        ])
      ])
    ], 2));
  }
}), Dn = /* @__PURE__ */ le({
  __name: "SettingsApp",
  setup(l) {
    const k = ha(), t = ka(), u = J(""), r = M(() => k.value.catalogId ?? ""), v = ze();
    async function n() {
      const p = v.begin(), m = r.value;
      try {
        const C = await oe.catalogSummary(m);
        v.current(p) && (u.value = C?.title || "Untitled catalog");
      } catch {
        v.current(p) && (u.value = "");
      }
    }
    return ce(r, () => {
      u.value = "", n();
    }), Ze(n), De(() => {
      v.begin();
    }), (p, m) => r.value ? (e(), R(qn, {
      key: r.value,
      "catalog-id": r.value,
      title: u.value || "Catalog",
      embedded: s(k).embedded,
      "back-label": s(k).embedded ? void 0 : "Back to catalog settings",
      onBack: m[0] || (m[0] = (C) => s(t)("navigate", { route: "" })),
      onDirtyChanged: m[1] || (m[1] = (C) => s(t)("dirty-changed", { dirty: C }))
    }, {
      actions: h(({ access: C }) => [
        C?.admin ? (e(), R(Pa, {
          key: 0,
          "catalog-id": r.value,
          title: u.value || "Catalog"
        }, null, 8, ["catalog-id", "title"])) : w("", !0)
      ]),
      _: 1
    }, 8, ["catalog-id", "title", "embedded", "back-label"])) : w("", !0);
  }
});
class Nn extends _a {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "catalog-id": { type: "string", default: "" }, embedded: { type: "boolean", default: !1 } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: $a
    };
  }
  static get vueConfig() {
    return { rootComponent: Dn, plugins: [wa] };
  }
}
ja(import.meta.url, Nn);
