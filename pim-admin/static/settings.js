import { d as xa, u as gl, r as ll, e as Yl, h as Va, b as hl, p as ge, c as Ye, a as Ve, _ as fl, i as Ua, S as Sa, f as ja, g as Aa, W as Ia, s as Ra, P as Oa } from "./styles-CJZMSMY2.js";
import { defineComponent as pe, computed as F, openBlock as e, createBlock as O, resolveDynamicComponent as Zl, normalizeProps as Ta, guardReactiveProps as Pa, createSlots as $e, withCtx as w, createElementVNode as l, normalizeClass as Ae, createElementBlock as i, Fragment as M, renderList as se, toDisplayString as _, createCommentVNode as v, unref as s, renderSlot as je, ref as K, onUnmounted as tl, createVNode as b, createStaticVNode as qa, createTextVNode as W, withModifiers as ze, normalizeStyle as Ul, useId as Pe, watch as ye, withKeys as rl, nextTick as Ke, provide as Ql, inject as Hl, useModel as Xl, Transition as Da, mergeModels as Sl, toRaw as Fa, onMounted as ea, mergeProps as Na } from "vue";
import { Icon as oe } from "@iconify/vue";
import _e from "primevue/tag";
import G from "primevue/button";
import za from "primevue/checkbox";
import Se from "primevue/message";
import { api as Ba, on as la, host as el, loadByTagName as La, define as Ea } from "@wippy-fe/proxy";
import Rl from "primevue/selectbutton";
import al from "primevue/inputtext";
import aa from "primevue/multiselect";
import ul from "primevue/toggleswitch";
import Ue from "primevue/select";
import Ma from "primevue/inputnumber";
import Wa from "primevue/textarea";
const Ha = ["aria-label"], Ja = {
  key: 0,
  class: "kx-settings-rail-group"
}, Ka = ["aria-current", "onClick"], Ga = { class: "kx-settings-rail-label" }, Ya = /* @__PURE__ */ pe({
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
  setup(a) {
    const m = a, t = F(() => m.leadingItem ? [{ items: [m.leadingItem] }, ...m.groups] : m.groups);
    function n(y) {
      const p = [...y.currentTarget.querySelectorAll(".kx-settings-rail-item")], $ = p.indexOf(y.target);
      if ($ < 0) return;
      let f;
      switch (y.key) {
        case "ArrowDown":
        case "ArrowRight":
          f = ($ + 1) % p.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          f = ($ + p.length - 1) % p.length;
          break;
        case "Home":
          f = 0;
          break;
        case "End":
          f = p.length - 1;
          break;
        default:
          return;
      }
      y.preventDefault(), p[f]?.focus();
    }
    return (y, p) => (e(), O(Zl(a.title ? xa : "div"), Ta(Pa(a.title ? { title: a.title, count: a.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), $e({
      default: w(() => [
        l("nav", {
          class: Ae(["kx-settings-rail", { "kx-settings-rail-framed": a.title }]),
          "aria-label": a.label,
          onKeydown: n
        }, [
          (e(!0), i(M, null, se(t.value, ($, f) => (e(), i("div", {
            key: $.items[0]?.value ?? f,
            class: Ae(["kx-settings-rail-section", { "kx-settings-rail-leading": a.leadingItem && f === 0 }])
          }, [
            $.heading ? (e(), i("div", Ja, _($.heading), 1)) : v("", !0),
            (e(!0), i(M, null, se($.items, (g) => (e(), i("button", {
              key: g.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": g.value === a.value ? "true" : void 0,
              onClick: (T) => y.$emit("update:value", g.value)
            }, [
              g.icon ? (e(), O(s(oe), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: g.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : v("", !0),
              l("span", Ga, _(g.label), 1)
            ], 8, Ka))), 128))
          ], 2))), 128))
        ], 42, Ha)
      ]),
      _: 2
    }, [
      a.title && y.$slots.actions ? {
        name: "actions",
        fn: w(() => [
          je(y.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Za = { class: "pim-stack" }, Qa = { class: "form pim-access-card pim-ia-action" }, Xa = { class: "pim-access-summary" }, et = ["config"], lt = /* @__PURE__ */ pe({
  __name: "CatalogShare",
  props: {
    catalogId: {},
    title: {},
    access: {}
  },
  setup(a) {
    const m = a, t = K(!1), n = K(!1), y = K(""), p = K(), $ = K(!1), f = ll(), g = F(() => "/api/v1/component-access/grants/" + encodeURIComponent(m.catalogId)), T = F(() => JSON.stringify({
      resource_id: m.catalogId,
      title: m.title,
      access_url: g.value,
      share_url: "/api/v1/component-access/share/" + encodeURIComponent(m.catalogId)
    })), I = F(() => {
      if (!m.access.admin) return "Only catalog administrators can manage sharing.";
      if (!p.value) return $.value ? "Member counts are unavailable." : "Loading members…";
      const { people: j, groups: d } = p.value;
      return j + (j === 1 ? " person" : " people") + " and " + d + (d === 1 ? " group" : " groups") + " with direct access";
    });
    async function H() {
      if (!m.access.admin) return;
      const j = f.begin();
      $.value = !1;
      try {
        const { data: d } = await Ba.get(g.value);
        if (!f.current(j)) return;
        if (!d?.success || !Array.isArray(d.access)) throw new Error("Grants unavailable");
        const h = d.access.filter((r) => r.subject_type === "group").length;
        p.value = { people: d.access.length - h, groups: h };
      } catch {
        f.current(j) && (p.value = void 0, $.value = !0);
      }
    }
    gl(H), tl(() => {
      f.begin();
    });
    async function Y() {
      n.value = !0, y.value = "", await Yl("kickside-share") ? t.value = !0 : y.value = "Could not open sharing. Try again.", n.value = !1;
    }
    return (j, d) => (e(), i("div", Za, [
      l("section", Qa, [
        l("div", null, [
          d[1] || (d[1] = l("h3", null, "Members and sharing", -1)),
          l("p", Xa, _(I.value), 1)
        ]),
        a.access.admin ? (e(), O(s(G), {
          key: 0,
          type: "button",
          label: "Share catalog",
          loading: n.value,
          onClick: Y
        }, {
          icon: w(() => [
            b(s(oe), {
              icon: "tabler:share",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : v("", !0),
        $.value ? (e(), O(s(G), {
          key: 1,
          type: "button",
          label: "Reload member counts",
          severity: "secondary",
          text: "",
          onClick: H
        })) : v("", !0)
      ]),
      d[2] || (d[2] = qa('<section class="form pim-access-card pim-stack" aria-labelledby="pim-access-roles-heading"><h3 id="pim-access-roles-heading">What members can do</h3><dl class="pim-access-roles"><div><dt>Read</dt><dd>View products and their details.</dd></div><div><dt>Write</dt><dd>Create products and update their values.</dd></div><div><dt>Delete</dt><dd>Move products to trash.</dd></div><div><dt>Admin</dt><dd>Manage catalog settings and who has access.</dd></div></dl></section>', 1)),
      t.value ? (e(), i("kickside-share", {
        key: 0,
        config: T.value,
        onClose: d[0] || (d[0] = (h) => t.value = !1),
        onChanged: H
      }, null, 40, et)) : v("", !0),
      y.value ? (e(), O(s(Se), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: w(() => [
          W(_(y.value), 1)
        ]),
        _: 1
      })) : v("", !0)
    ]));
  }
});
function at(a, m, t = {}) {
  const n = JSON.stringify(a), y = JSON.stringify(t);
  return {
    declaration: JSON.parse(n),
    generation: m,
    pluginConfigs: JSON.parse(y),
    matches: (p, $, f = {}) => m === $ && n === JSON.stringify(p) && y === JSON.stringify(f)
  };
}
function Jl(a, m) {
  const t = {};
  for (const [n, y] of Object.entries(m)) {
    const p = y.filter(($) => n === "plugins" ? !a.plugins?.some((f) => f.use === $) : n === "scopes" ? !a.scopes?.includes($) : n === "attributes" ? !a.aspects?.some((f) => f.attributes?.some((g) => f.namespace + "." + g.code === $)) : n === "aspects" ? !a.aspects?.some((f) => f.namespace === $) : n === "dimensions" ? !a.dimensions?.some((f) => f.name === $) : n === "vocabularies" || n === "families" ? !a[n]?.some((f) => f.code === $) : !a[n]?.some((f) => f.id === $));
    p.length && (t[n] = p);
  }
  return t;
}
const Kl = (a) => !!a && typeof a == "object" && !Array.isArray(a), me = ["string"], ta = { "*": "string" }, tt = { id: "number", code: "string!", type: "string!", scope: me, cardinality: "string", index: "string", index_contexts: [ta], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, st = {
  dimensions: [{ name: "string!", members: me, fallback: { "*": me } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: me }, attributes: [tt] }],
  families: [{ code: "string!", aspects: me, variation: [{ axes: me, own: me }], requirements: [{ id: "string!", context: ta, require: me, authored: me }], checks: [{ check: "string!", reads: me, cost: "string", config: "object", enforce: "string" }] }],
  sources: [{ id: "string!", ordering: "string", writes: me, principals: me, audit: "boolean" }],
  channels: [{ id: "string!", requirements: me, families: me }],
  plugins: [{ use: "string!", schema: "json" }],
  scopes: me,
  policy: { "*": "policy" },
  remove: { dimensions: me, vocabularies: me, aspects: me, families: me, sources: me, channels: me, attributes: me, scopes: me, plugins: me }
};
function jl(a, m, t) {
  if (typeof m == "string") {
    const n = m.replace("!", "");
    if (!(n === "json" || (n === "object" ? Kl(a) : n === "policy" ? a === !1 || typeof a == "string" || typeof a == "number" : typeof a === n)) || m.endsWith("!") && (typeof a != "string" || !a.trim())) throw new Error(`${t} has an invalid ${n} value.`);
  } else if (Array.isArray(m)) {
    if (!Array.isArray(a)) throw new Error(`${t} must be an array.`);
    a.forEach((n, y) => jl(n, m[0], `${t}[${y}]`));
  } else {
    if (!Kl(a)) throw new Error(`${t} must be an object.`);
    for (const [n, y] of Object.entries(m)) if (typeof y == "string" && y.endsWith("!") && a[n] === void 0) throw new Error(`${t}.${n} is required.`);
    for (const [n, y] of Object.entries(a)) {
      const p = m[n] ?? m["*"];
      if (!p) throw new Error(`${t}.${n} is not an editor field.`);
      jl(y, p, `${t}.${n}`);
    }
  }
}
function it(a) {
  const m = JSON.parse(a);
  jl(m, st, "Declaration");
  const t = m;
  for (const n of t.dimensions ?? []) n.members ??= [];
  return t;
}
function ol(a) {
  return JSON.parse(JSON.stringify(a));
}
const Gl = /^[a-z][a-z0-9_]*$/;
function nt(a) {
  return a.trim().normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function Ge(a, m, t) {
  t.length ? a[m] = t : delete a[m];
}
function pl(a, m, t) {
  if (t < 0 || t >= a.length || m === t) return;
  const [n] = a.splice(m, 1);
  a.splice(t, 0, n);
}
function ce(a, m) {
  return !a || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(a) ? m : a;
}
function dl(a) {
  return a ? ce(a.title, "Field type") : "Unknown type";
}
async function sa(a, m) {
  const t = [...new Set(m)].map((y) => ({ type: "user", id: y }));
  if (!t.length) return {};
  const n = await Va(`/api/v1/pim-admin/catalogs/${encodeURIComponent(a)}/principal_labels`, { refs: t }, "People");
  return Object.fromEntries((n.principals ?? []).map((y) => [y.id, ce(y.label, "Person")]));
}
const vl = [
  { value: "quarter", label: "¼", span: 3 },
  { value: "third", label: "⅓", span: 4 },
  { value: "half", label: "½", span: 6 },
  { value: "full", label: "1", span: 12 }
];
function Al(a, m, t) {
  return t.width ?? a.attributes[m + "." + t.code]?.width ?? "half";
}
const ot = (a) => new Date(a).toLocaleString();
function Il(a) {
  const m = Math.abs(a.m).toString(), t = a.m < 0 ? "-" : "";
  if (a.e >= 0) return t + m + "0".repeat(a.e);
  const n = -a.e, y = m.padStart(n + 1, "0");
  return t + y.slice(0, y.length - n) + "." + y.slice(y.length - n);
}
function E(a) {
  const t = (a.includes(".") ? a.slice(a.indexOf(".") + 1) : a).replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : a;
}
function bl(a, m) {
  const t = a.properties;
  return ce(t?.[m]?.title, ce(E(m), "This setting"));
}
function Je(a) {
  return a.labels.en ?? Object.values(a.labels)[0] ?? a.code;
}
function yl(a, m) {
  if (a == null) return "";
  const t = (n) => {
    if (n == null) return "";
    if (typeof n == "object" && "ref" in n) {
      const y = n;
      if (y.ref[0] === "term") {
        const p = y.ref[1].slice(y.ref[1].indexOf(":") + 1), $ = y.ref[1].slice(0, y.ref[1].indexOf(":")), f = m?.[$]?.find((g) => g.code === p);
        return f ? Je(f) : p;
      }
      return "Linked " + E(y.ref[0]).toLocaleLowerCase();
    }
    if (typeof n == "object" && "v" in n) {
      const y = n;
      return Il(y.v) + " " + y.u;
    }
    return typeof n == "object" && "m" in n ? Il(n) : typeof n == "boolean" ? n ? "Yes" : "No" : typeof n == "object" ? JSON.stringify(n) : ce(String(n), "Linked record");
  };
  return Array.isArray(a) ? a.map(t).join(", ") : t(a);
}
function dt(a, m, t) {
  const n = yl(m), y = yl(t);
  return !y && n ? `${a} cleared (was ${n})` : n ? `${a}: ${n} → ${y}` : `${a} set to ${y}`;
}
const rt = { class: "pim-table form pim-layout" }, ut = {
  key: 0,
  class: "pim-layout-help muted"
}, ct = {
  key: 1,
  class: "kx-empty"
}, mt = { class: "pim-aspect-head" }, pt = {
  key: 0,
  class: "muted small"
}, vt = ["draggable", "onDragstart", "onDragover", "onDrop"], ft = { class: "pim-lcard-top" }, bt = {
  key: 0,
  class: "pim-grip",
  "aria-hidden": "true"
}, yt = { class: "pim-lcard-name" }, gt = { class: "pim-lcard-type" }, ht = {
  key: 1,
  class: "pim-lcard-move"
}, kt = { class: "pim-aspect-head" }, _t = { class: "pim-canvas" }, wt = { class: "pim-lcard-top" }, $t = { class: "pim-lcard-name" }, Ct = { class: "pim-lcard-type" }, xt = /* @__PURE__ */ pe({
  __name: "LayoutEditor",
  props: {
    draft: {},
    schema: {},
    types: {}
  },
  setup(a) {
    const m = a, t = F(() => m.schema.access.admin), n = F(() => m.draft?.aspects ?? []), y = F(() => new Map(m.types.map((j) => [j.id, dl(j)]))), p = F(() => {
      if (!m.schema) return [];
      const j = new Set((m.draft?.aspects ?? []).map((h) => h.namespace)), d = /* @__PURE__ */ new Map();
      for (const [h, r] of Object.entries(m.schema.attributes)) {
        const N = h.split(".")[0];
        j.has(N) || !r.plugin || (d.has(N) || d.set(N, { aspect: N, plugin: r.plugin, codes: [] }), d.get(N).codes.push(h));
      }
      return [...d.values()];
    });
    function $(j, d) {
      return vl.find((h) => h.value === Al(m.schema, j, d))?.span ?? 6;
    }
    const f = K(null), g = K(null);
    function T(j, d, h) {
      t.value && (f.value = { ns: j, index: d }, h.dataTransfer?.setData("text/plain", j + ":" + d), h.dataTransfer && (h.dataTransfer.effectAllowed = "move"));
    }
    function I(j, d, h) {
      !f.value || f.value.ns !== j || (h.preventDefault(), g.value = { ns: j, index: d });
    }
    function H(j, d) {
      t.value && f.value?.ns === j.namespace && pl(j.attributes ?? [], f.value.index, d), f.value = null, g.value = null;
    }
    function Y() {
      f.value = null, g.value = null;
    }
    return (j, d) => (e(), i("div", rt, [
      t.value ? (e(), i("p", ut, "Arrange fields within each group and choose their widths. Review changes before applying the layout.")) : v("", !0),
      n.value.length === 0 ? (e(), i("div", ct, [
        d[1] || (d[1] = W("This catalog has no field groups yet.", -1)),
        t.value ? (e(), i(M, { key: 0 }, [
          W(" Add a field group in Fields.")
        ], 64)) : v("", !0)
      ])) : v("", !0),
      (e(!0), i(M, null, se(n.value, (h) => (e(), i("section", {
        key: h.namespace,
        class: "pim-aspect"
      }, [
        l("header", mt, [
          l("h3", null, _(s(E)(h.namespace)), 1),
          t.value ? (e(), i("span", pt, "drag a field, or use its arrows")) : v("", !0)
        ]),
        l("div", {
          class: "pim-canvas",
          onDragover: d[0] || (d[0] = ze(() => {
          }, ["prevent"]))
        }, [
          (e(!0), i(M, null, se(h.attributes ?? [], (r, N) => (e(), i("div", {
            key: r.code,
            class: Ae(["pim-lcard", { dragging: f.value?.ns === h.namespace && f.value?.index === N, over: g.value?.ns === h.namespace && g.value?.index === N }]),
            style: Ul({ gridColumn: "span " + $(h.namespace, r) }),
            draggable: t.value,
            onDragstart: (te) => T(h.namespace, N, te),
            onDragover: (te) => I(h.namespace, N, te),
            onDrop: ze((te) => H(h, N), ["prevent"]),
            onDragend: Y
          }, [
            l("div", ft, [
              t.value ? (e(), i("span", bt, [
                b(s(oe), { icon: "tabler:grip-vertical" })
              ])) : v("", !0),
              l("span", yt, _(s(E)(r.code)), 1),
              l("span", gt, _(y.value.get(r.type) ?? s(dl)(void 0)), 1),
              t.value ? (e(), i("span", ht, [
                b(s(G), {
                  type: "button",
                  disabled: N === 0,
                  "aria-label": "Move " + s(E)(r.code) + " earlier",
                  onClick: (te) => s(pl)(h.attributes ?? [], N, N - 1),
                  class: "kx-iconbtn sm",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    b(s(oe), { icon: "tabler:arrow-left" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                b(s(G), {
                  type: "button",
                  disabled: N === (h.attributes ?? []).length - 1,
                  "aria-label": "Move " + s(E)(r.code) + " later",
                  onClick: (te) => s(pl)(h.attributes ?? [], N, N + 1),
                  class: "kx-iconbtn sm",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    b(s(oe), { icon: "tabler:arrow-right" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ])) : v("", !0)
            ]),
            b(s(Rl), {
              disabled: !t.value,
              "model-value": s(Al)(a.schema, h.namespace, r),
              options: s(vl),
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Width of " + s(E)(r.code),
              "onUpdate:modelValue": (te) => r.width = te
            }, null, 8, ["disabled", "model-value", "options", "aria-label", "onUpdate:modelValue"])
          ], 46, vt))), 128))
        ], 32)
      ]))), 128)),
      (e(!0), i(M, null, se(p.value, (h) => (e(), i("section", {
        key: h.aspect,
        class: "pim-aspect"
      }, [
        l("header", kt, [
          l("h3", null, _(s(E)(h.aspect)), 1),
          d[2] || (d[2] = l("span", { class: "muted small" }, "Provided by a plugin", -1))
        ]),
        l("div", _t, [
          (e(!0), i(M, null, se(h.codes, (r) => (e(), i("div", {
            key: r,
            class: "pim-lcard fixed",
            style: Ul({ gridColumn: "span " + (s(vl).find((N) => N.value === a.schema.attributes[r].width)?.span ?? 6) })
          }, [
            l("div", wt, [
              l("span", $t, _(s(E)(r)), 1),
              l("span", Ct, _(y.value.get(a.schema.attributes[r].type) ?? s(dl)(void 0)), 1)
            ])
          ], 4))), 128))
        ])
      ]))), 128))
    ]));
  }
}), Vt = {
  class: "pim-history",
  "aria-label": "Catalog history"
}, Ut = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, St = { class: "pim-table pim-responsive-table" }, jt = ["id"], At = ["aria-labelledby"], It = {
  key: 0,
  scope: "col"
}, Rt = { class: "muted small" }, Ot = ["datetime"], Tt = {
  key: 0,
  class: "small"
}, Pt = {
  key: 0,
  class: "muted"
}, qt = { class: "mono small" }, Dt = {
  key: 0,
  class: "muted"
}, Ft = {
  key: 0,
  class: "muted small"
}, Nt = ["aria-labelledby"], zt = { class: "pim-stacked-meta muted small" }, Bt = { key: 0 }, Lt = { key: 1 }, Et = ["datetime"], Mt = {
  key: 1,
  class: "kx-empty"
}, Wt = { class: "pim-table-foot" }, Ht = /* @__PURE__ */ pe({
  __name: "HistoryPanel",
  props: {
    catalogId: {},
    canResolveActors: { type: Boolean }
  },
  setup(a) {
    const m = a, t = K([]), n = K({}), y = K(), p = K(!1), $ = K(), f = ll(), g = Pe(), T = F(() => t.value.map((d) => ({
      key: `${d.seq}:${d.n}`,
      at: d.at,
      date: ot(d.at),
      actor: n.value[d.actor] ?? ce(d.actor, "Person"),
      source: d.source ? ce(E(d.source), "Data source") : "",
      product: H(d),
      context: d.ctx ? ce(d.ctx, "Product context") : "",
      change: Y(d)
    })));
    async function I(d = !1) {
      const h = f.begin();
      p.value = !0, $.value = void 0;
      try {
        const r = await ge.history(m.catalogId, { limit: 50, before: d ? y.value : void 0 });
        if (!f.current(h)) return;
        if (t.value = d ? [...t.value, ...r.entries] : r.entries, y.value = r.next, m.canResolveActors)
          try {
            const N = await sa(m.catalogId, r.entries.map((te) => te.actor));
            f.current(h) && (n.value = { ...n.value, ...N });
          } catch {
          }
      } catch (r) {
        if (!f.current(h)) return;
        $.value = Ye(r, "Could not load the history.");
      } finally {
        f.current(h) && (p.value = !1);
      }
    }
    function H(d) {
      return d.sku ? d.sku : d.subject.startsWith("p:") ? "purged product" : d.subject.startsWith("t:") ? d.subject.slice(2) : d.subject.startsWith("r:") ? "Release" : ce(d.subject, "Catalog");
    }
    function Y(d) {
      if (d.attribute)
        return dt(E(d.attribute), d.before, d.after);
      switch (d.kind) {
        case "schema":
          return "Catalog settings applied";
        case "term": {
          const h = d.after ?? {}, r = h.labels?.en ?? Object.values(h.labels ?? {})[0];
          return h.retired ? "Term retired" : r ? `Term labelled "${r}"` + (h.parent ? ` under ${h.parent}` : "") : "Term changed";
        }
        case "created": {
          const h = d.after ?? {};
          return `Created as ${E(h.family ?? "product")}` + (h.level ? ` at level ${h.level}` : "");
        }
        case "released": {
          const h = d.after ?? {};
          return `Released v${h.version ?? ""} to ${(h.channels ?? []).join(", ")}`;
        }
        case "withdrawn":
          return `Withdrawn from ${((d.after ?? {}).channels ?? []).join(", ")}`;
        case "status":
          return `Status ${String(d.before ?? "")} → ${String(d.after ?? "")}`;
        case "moved":
          return "Moved under another parent";
        default:
          return E(d.kind);
      }
    }
    let j = () => {
    };
    return ye(() => m.catalogId, () => {
      j(), f.begin(), t.value = [], n.value = {}, y.value = void 0, $.value = void 0, j = la(`component.${m.catalogId}`, () => {
        I();
      });
    }, { immediate: !0 }), ye(() => m.catalogId, () => {
      I();
    }), gl(() => I()), tl(() => {
      j(), f.begin();
    }), (d, h) => (e(), i("section", Vt, [
      $.value ? (e(), O(hl, {
        key: 0,
        error: $.value
      }, {
        default: w(() => [
          b(s(G), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: h[0] || (h[0] = (r) => I())
          }, {
            default: w(() => [...h[2] || (h[2] = [
              W("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : v("", !0),
      p.value ? (e(), i("div", Ut, "Loading history…")) : v("", !0),
      l("div", St, [
        l("p", {
          id: s(g),
          class: "pim-history-caption muted small"
        }, "Catalog changes, newest first", 8, jt),
        T.value.length ? (e(), i(M, { key: 0 }, [
          l("table", {
            class: "pim-grid",
            "aria-labelledby": s(g)
          }, [
            l("thead", null, [
              l("tr", null, [
                h[3] || (h[3] = l("th", { scope: "col" }, "When", -1)),
                a.canResolveActors ? (e(), i("th", It, "Who")) : v("", !0),
                h[4] || (h[4] = l("th", { scope: "col" }, "What", -1)),
                h[5] || (h[5] = l("th", { scope: "col" }, "Change", -1))
              ])
            ]),
            l("tbody", null, [
              (e(!0), i(M, null, se(T.value, (r) => (e(), i("tr", {
                key: r.key
              }, [
                l("td", Rt, [
                  l("time", {
                    datetime: r.at
                  }, _(r.date), 9, Ot)
                ]),
                a.canResolveActors ? (e(), i("td", Tt, [
                  W(_(r.actor), 1),
                  r.source ? (e(), i("span", Pt, " via " + _(r.source), 1)) : v("", !0)
                ])) : v("", !0),
                l("td", qt, [
                  W(_(r.product), 1),
                  r.context ? (e(), i("span", Dt, " · " + _(r.context), 1)) : v("", !0)
                ]),
                l("td", null, [
                  W(_(r.change), 1),
                  !a.canResolveActors && r.source ? (e(), i("span", Ft, " via " + _(r.source), 1)) : v("", !0)
                ])
              ]))), 128))
            ])
          ], 8, At),
          l("ol", {
            role: "list",
            class: "pim-stacked-list",
            "aria-labelledby": s(g)
          }, [
            (e(!0), i(M, null, se(T.value, (r) => (e(), i("li", {
              key: r.key,
              class: "pim-stacked-row"
            }, [
              l("div", null, _(r.change), 1),
              l("div", zt, [
                a.canResolveActors ? (e(), i("span", Bt, [
                  l("span", null, _(r.actor), 1),
                  r.source ? (e(), i(M, { key: 0 }, [
                    W(" via " + _(r.source), 1)
                  ], 64)) : v("", !0)
                ])) : r.source ? (e(), i("span", Lt, "Via " + _(r.source), 1)) : v("", !0),
                l("time", {
                  datetime: r.at
                }, _(r.date), 9, Et),
                l("span", null, [
                  W(_(r.product), 1),
                  r.context ? (e(), i(M, { key: 0 }, [
                    W(" · " + _(r.context), 1)
                  ], 64)) : v("", !0)
                ])
              ])
            ]))), 128))
          ], 8, Nt)
        ], 64)) : !p.value && !$.value ? (e(), i("div", Mt, "Nothing recorded yet.")) : v("", !0),
        l("div", Wt, [
          l("span", null, _(T.value.length) + " change" + _(T.value.length === 1 ? "" : "s") + " shown", 1),
          y.value ? (e(), O(s(G), {
            key: 0,
            type: "button",
            disabled: p.value,
            onClick: h[1] || (h[1] = (r) => I(!0)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: w(() => [
              b(s(oe), {
                icon: "tabler:adjustments",
                "aria-hidden": "true"
              }),
              h[6] || (h[6] = W(" Load older", -1))
            ]),
            _: 1
          }, 8, ["disabled"])) : v("", !0)
        ])
      ])
    ]));
  }
}), Jt = { class: "system-section-head" }, Kt = { class: "system-section-head-text" }, Gt = {
  key: 0,
  class: "kx-head-actions"
}, Yt = /* @__PURE__ */ pe({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(a) {
    return (m, t) => (e(), i("header", Jt, [
      l("div", Kt, [
        l("h1", null, _(a.title), 1),
        l("p", null, _(a.description), 1)
      ]),
      m.$slots.actions ? (e(), i("div", Gt, [
        je(m.$slots, "actions")
      ])) : v("", !0)
    ]));
  }
}), Zt = /* @__PURE__ */ pe({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(a) {
    return (m, t) => (e(), i(M, null, [
      b(s(_e), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      b(s(G), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: a.busy || a.discardDisabled,
        onClick: t[0] || (t[0] = (n) => m.$emit("discard"))
      }, {
        icon: w(() => [
          b(s(oe), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      b(s(G), {
        label: "Review changes",
        type: "button",
        disabled: a.busy || a.reviewDisabled,
        loading: a.busy,
        onClick: t[1] || (t[1] = (n) => m.$emit("review", n.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), Qt = ["onKeydown"], Xt = { class: "row pim-add-actions" }, es = ["id"], Be = /* @__PURE__ */ pe({
  __name: "AddSchemaCode",
  props: {
    label: {},
    action: {},
    existing: {},
    fromName: { type: Boolean },
    regular: { type: Boolean }
  },
  emits: ["add"],
  setup(a, { emit: m }) {
    const t = a, n = m, y = K(""), p = K(!1), $ = K(), f = Pe(), g = F(() => {
      const d = y.value.trim();
      return t.fromName ? nt(d) : d;
    }), T = F(() => y.value.trim() ? t.existing?.includes(g.value) ? t.fromName ? "This name is already in use." : "This code is already in use." : t.fromName && !Gl.test(g.value) ? "Use a name that starts with a letter from A to Z." : Gl.test(g.value) ? "" : "Start with a lowercase letter and use only lowercase letters, numbers or underscores." : ""), I = F(() => !!g.value && !T.value);
    async function H() {
      p.value = !0, await Ke(), $.value?.querySelector("input")?.focus();
    }
    async function Y() {
      p.value = !1, y.value = "", await Ke(), $.value?.querySelector("button")?.focus();
    }
    function j() {
      I.value && (n("add", g.value), Y());
    }
    return (d, h) => (e(), i("div", {
      ref_key: "row",
      ref: $,
      class: "row pim-add-row"
    }, [
      p.value ? (e(), i("div", {
        key: 1,
        class: "row pim-add-editor",
        onKeydown: rl(ze(Y, ["stop", "prevent"]), ["esc"])
      }, [
        b(s(al), {
          modelValue: y.value,
          "onUpdate:modelValue": h[0] || (h[0] = (r) => y.value = r),
          type: "text",
          placeholder: a.label,
          "aria-label": a.label,
          invalid: !!T.value,
          "aria-describedby": T.value ? s(f) : void 0,
          class: Ae({ mono: !a.fromName }),
          onKeydown: rl(ze(j, ["prevent"]), ["enter"])
        }, null, 8, ["modelValue", "placeholder", "aria-label", "invalid", "aria-describedby", "class", "onKeydown"]),
        l("div", Xt, [
          b(s(G), {
            type: "button",
            disabled: !I.value,
            onClick: j
          }, {
            default: w(() => [
              W(_(a.action), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          b(s(G), {
            type: "button",
            label: "Cancel",
            outlined: "",
            severity: "secondary",
            onClick: Y
          })
        ]),
        T.value ? (e(), i("p", {
          key: 0,
          id: s(f),
          role: "status",
          class: "pim-add-code-error small"
        }, _(T.value), 9, es)) : v("", !0)
      ], 40, Qt)) : (e(), O(s(G), {
        key: 0,
        type: "button",
        "aria-expanded": "false",
        severity: "secondary",
        outlined: "",
        size: a.regular ? void 0 : "small",
        onClick: H
      }, {
        default: w(() => [
          b(s(oe), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          W(" " + _(a.action), 1)
        ]),
        _: 1
      }, 8, ["size"])),
      je(d.$slots, "default")
    ], 512));
  }
}), ia = Symbol("definitionColumns"), ls = { code: "Code", kind: "Kind", details: "Details", usage: "Used by" }, as = {
  code: "minmax(120px, 1fr)",
  kind: "140px",
  details: "minmax(120px, 1.2fr)",
  usage: "120px"
}, ts = {
  class: "pim-definition-scroll",
  tabindex: "0",
  "aria-label": "Definitions"
}, ss = { class: "pim-definition-grid" }, is = {
  key: 0,
  class: "pim-definition-columns",
  "aria-hidden": "true"
}, ns = { class: "pim-definition-actions-heading" }, Le = /* @__PURE__ */ pe({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: { default: () => ["code"] },
    showActions: { type: Boolean }
  },
  setup(a) {
    const m = a;
    Ql(ia, F(() => m.columns));
    const t = F(() => ["48px", "minmax(160px, 1.4fr)", ...m.columns.map((n) => as[n]), m.showActions ? "100px" : "80px"].join(" "));
    return (n, y) => (e(), i("section", {
      class: "form pim-definition-list",
      style: Ul({ "--pim-definition-columns": t.value })
    }, [
      je(n.$slots, "head"),
      l("div", ts, [
        l("div", ss, [
          a.count > 3 ? (e(), i("div", is, [
            y[0] || (y[0] = l("span", null, null, -1)),
            y[1] || (y[1] = l("span", null, "Name", -1)),
            (e(!0), i(M, null, se(a.columns, (p) => (e(), i("span", {
              key: p,
              class: Ae("pim-definition-" + p)
            }, _(s(ls)[p]), 3))), 128)),
            l("span", ns, _(a.showActions ? "Actions" : ""), 1)
          ])) : v("", !0),
          je(n.$slots, "default")
        ])
      ]),
      je(n.$slots, "add")
    ], 4));
  }
}), os = ["aria-label"], ds = /* @__PURE__ */ pe({
  __name: "InteractiveSurface",
  props: {
    label: {}
  },
  setup(a) {
    return (m, t) => (e(), i("button", {
      type: "button",
      class: "pim-interactive",
      "aria-label": a.label
    }, [
      je(m.$slots, "default")
    ], 8, os));
  }
}), na = Symbol("section row"), rs = { class: "pim-definition" }, us = {
  class: "pim-definition-lead",
  "data-column": "lead"
}, cs = {
  class: "pim-row-title",
  "data-column": "name"
}, ms = { class: "pim-definition-meta" }, ps = ["data-column"], vs = {
  key: 0,
  class: "mono"
}, fs = {
  class: "pim-definition-actions",
  "data-column": "actions"
}, bs = ["id"], Ee = /* @__PURE__ */ pe({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ Sl({
    title: {},
    code: {},
    kind: {},
    usage: {},
    headClass: {},
    toggleClass: {},
    routeSection: {},
    routeId: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(a) {
    const m = a, t = Hl(ia, F(() => [
      ...m.code ? ["code"] : [],
      ...m.kind ? ["kind"] : []
    ])), n = Xl(a, "open"), y = Pe(), p = Hl(na, void 0);
    function $(g) {
      return !!m.routeSection && !!m.routeId && g === m.routeSection + "/" + m.routeId;
    }
    ye(() => p?.selected.value, (g, T) => {
      $(g) ? n.value = !0 : $(T) && (n.value = !1);
    }, { immediate: !0 });
    function f() {
      const g = !n.value;
      n.value = g, m.routeSection && m.routeId && p?.choose(m.routeSection, m.routeId, g);
    }
    return (g, T) => (e(), i("section", rs, [
      l("header", {
        class: Ae(["pim-definition-head", a.headClass])
      }, [
        b(ds, {
          class: Ae(["pim-definition-toggle", a.toggleClass]),
          "aria-expanded": n.value,
          "aria-controls": n.value ? s(y) : void 0,
          onClick: f
        }, {
          default: w(() => [
            l("span", us, [
              b(s(oe), {
                icon: "tabler:chevron-right",
                class: "pim-definition-chevron",
                "aria-hidden": "true"
              })
            ]),
            l("span", cs, _(a.title), 1),
            l("span", ms, [
              (e(!0), i(M, null, se(s(t), (I) => (e(), i("span", {
                key: I,
                class: Ae("pim-definition-" + I),
                "data-column": I
              }, [
                I === "code" && a.code ? (e(), i("code", vs, _(a.code), 1)) : I === "kind" && a.kind ? (e(), O(s(_e), {
                  key: 1,
                  severity: "secondary",
                  value: a.kind
                }, null, 8, ["value"])) : I === "details" ? je(g.$slots, "details", {}, void 0, void 0, 2) : I === "usage" ? je(g.$slots, "usage", {}, () => [
                  W(_(a.usage), 1)
                ], void 0, 3) : v("", !0)
              ], 10, ps))), 128))
            ])
          ]),
          _: 3
        }, 8, ["class", "aria-expanded", "aria-controls"]),
        l("div", fs, [
          je(g.$slots, "actions")
        ])
      ], 2),
      b(Da, { name: "pim-expand" }, {
        default: w(() => [
          n.value ? (e(), i("div", {
            key: 0,
            id: s(y),
            class: "pim-definition-body"
          }, [
            je(g.$slots, "default")
          ], 8, bs)) : v("", !0)
        ]),
        _: 3
      })
    ]));
  }
}), ys = { class: "pim-chips pim-picker-chips" }, gs = {
  key: 0,
  class: "muted"
}, hs = {
  key: 0,
  class: "muted small"
}, ks = {
  key: 0,
  class: "muted"
}, _s = {
  key: 0,
  class: "muted"
}, Te = /* @__PURE__ */ pe({
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
  setup(a, { emit: m }) {
    const t = a, n = m, y = K("");
    function p(H) {
      return t.modelValue.includes(H);
    }
    function $(H) {
      t.disabled || !H || n("update:modelValue", p(H) ? t.modelValue.filter((Y) => Y !== H) : [...t.modelValue, H]);
    }
    function f() {
      const H = y.value.trim();
      if (!H || p(H)) {
        y.value = "";
        return;
      }
      n("update:modelValue", [...t.modelValue, H]), y.value = "";
    }
    function g(H) {
      n("update:modelValue", t.modelValue.filter((Y) => Y !== H));
    }
    const T = F(() => t.modelValue.map((H) => t.options?.find((Y) => Y.value === H) ?? { value: H }));
    function I(H) {
      const Y = H.label ?? H.value;
      return H.detail ? Y + " " + H.detail : Y;
    }
    return (H, Y) => (e(), i("div", ys, [
      a.disabled ? (e(), i(M, { key: 0 }, [
        (e(!0), i(M, null, se(T.value, (j) => (e(), i("span", {
          key: j.value
        }, [
          W(_(j.label ?? j.value) + " ", 1),
          j.detail ? (e(), i("small", gs, _(j.detail), 1)) : v("", !0)
        ]))), 128)),
        a.modelValue.length ? v("", !0) : (e(), i("span", hs, "None"))
      ], 64)) : a.options && (a.dropdown || a.options.length > 10) ? (e(), i(M, { key: 1 }, [
        (e(!0), i(M, null, se(T.value, (j) => (e(), i("span", {
          key: j.value,
          class: "row"
        }, [
          l("span", null, [
            W(_(j.label ?? j.value) + " ", 1),
            j.detail ? (e(), i("small", ks, _(j.detail), 1)) : v("", !0)
          ]),
          b(s(G), {
            type: "button",
            "aria-label": "Remove " + I(j),
            onClick: (d) => g(j.value),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: w(() => [
              b(s(oe), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128)),
        a.disabled ? v("", !0) : (e(), O(s(Ue), {
          key: 0,
          "model-value": null,
          placeholder: a.placeholder ?? "Add…",
          "aria-labelledby": a.labelledby,
          "aria-label": a.placeholder ?? "Add",
          "onUpdate:modelValue": Y[0] || (Y[0] = (j) => $(j)),
          class: "pim-chip-entry",
          options: a.options.filter((j) => !p(j.value)),
          "option-label": I,
          "option-value": "value",
          appendTo: "self"
        }, {
          option: w(({ option: j }) => [
            l("span", null, [
              W(_(j.label ?? j.value) + " ", 1),
              j.detail ? (e(), i("small", _s, _(j.detail), 1)) : v("", !0)
            ])
          ]),
          _: 1
        }, 8, ["placeholder", "aria-labelledby", "aria-label", "options"]))
      ], 64)) : a.options ? (e(), i(M, { key: 2 }, [
        b(s(Rl), {
          "model-value": a.modelValue.filter((j) => a.options.some((d) => d.value === j)),
          options: a.options.map((j) => ({ value: j.value, label: j.label ?? j.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          disabled: a.disabled,
          "aria-labelledby": a.labelledby,
          "aria-label": a.placeholder ?? "Selected values",
          "onUpdate:modelValue": Y[1] || (Y[1] = (j) => n("update:modelValue", [...j, ...a.modelValue.filter((d) => !a.options.some((h) => h.value === d))]))
        }, null, 8, ["model-value", "options", "disabled", "aria-labelledby", "aria-label"]),
        (e(!0), i(M, null, se(a.modelValue.filter((j) => !a.options.some((d) => d.value === j)), (j) => (e(), i("span", {
          key: j,
          class: "row"
        }, [
          W(_(j), 1),
          b(s(G), {
            type: "button",
            "aria-label": "Remove " + j,
            onClick: (d) => g(j),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: w(() => [
              b(s(oe), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128))
      ], 64)) : (e(!0), i(M, { key: 3 }, se(a.modelValue, (j) => (e(), i("span", {
        key: j,
        class: "row"
      }, [
        W(_(j), 1),
        b(s(G), {
          type: "button",
          "aria-label": "Remove " + j,
          onClick: (d) => g(j),
          size: "small",
          text: "",
          severity: "secondary"
        }, {
          default: w(() => [
            b(s(oe), { icon: "tabler:x" })
          ]),
          _: 1
        }, 8, ["aria-label", "onClick"])
      ]))), 128)),
      a.free && !a.disabled ? (e(), O(s(al), {
        key: 4,
        modelValue: y.value,
        "onUpdate:modelValue": Y[2] || (Y[2] = (j) => y.value = j),
        type: "text",
        "aria-labelledby": a.labelledby,
        placeholder: a.placeholder ?? "Add…",
        onKeydown: rl(ze(f, ["prevent"]), ["enter"]),
        onBlur: f,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "aria-labelledby", "placeholder", "onKeydown"])) : v("", !0)
    ]));
  }
}), ws = { key: 0 }, $s = {
  key: 0,
  class: "pim-config-overrides"
}, Cs = {
  key: 1,
  class: "muted small"
}, xs = { key: 3 }, Vs = ["schema", "config"], Us = {
  key: 1,
  class: "muted small",
  role: "status"
}, Ol = /* @__PURE__ */ pe({
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
  setup(a, { emit: m }) {
    const t = a, n = m, y = K("pending"), p = F(() => {
      const T = t.schema.properties;
      return !T || typeof T != "object" ? t.schema : {
        ...t.schema,
        properties: Object.fromEntries(Object.entries(T).map(([I, H]) => [
          I,
          H && typeof H == "object" ? { ...H, title: bl(t.schema, I) } : H
        ]))
      };
    }), $ = F(() => Object.entries(t.modelValue).map(([T, I]) => ({
      key: T,
      label: bl(t.schema, T),
      value: I !== null && typeof I == "object" ? JSON.stringify(I) : yl(I)
    })));
    async function f() {
      y.value = "pending", y.value = await Yl("wc-schema-form") ? "ready" : "failed";
    }
    ye(() => t.disabled, (T) => {
      T || f();
    }, { immediate: !0 });
    function g(T) {
      const I = T.detail;
      I && typeof I == "object" && !Array.isArray(I) && n("update:modelValue", I);
    }
    return (T, I) => (e(), i(M, null, [
      a.refusal || a.problem ? (e(), O(s(Se), {
        key: 0,
        severity: "warn",
        role: "alert"
      }, {
        default: w(() => [
          a.refusal ? (e(), i(M, { key: 0 }, [
            W(_(a.refusal), 1)
          ], 64)) : a.problemLabel ? (e(), i(M, { key: 1 }, [
            W(_(a.problemLabel) + " is required. Enter a value below.", 1)
          ], 64)) : (e(), i(M, { key: 2 }, [
            W("The saved settings don’t meet the plugin’s requirements. Update the configuration below.")
          ], 64))
        ]),
        _: 1
      })) : v("", !0),
      a.problem ? (e(), O(Ve, {
        key: 1,
        class: "small pim-error-code pim-ia-disclosure",
        label: "Technical details"
      }, {
        default: w(() => [
          a.pluginId ? (e(), i("p", ws, [
            I[1] || (I[1] = W("Plugin ", -1)),
            l("code", null, _(a.pluginId), 1)
          ])) : v("", !0),
          l("p", null, _(a.problem.message), 1)
        ]),
        _: 1
      })) : v("", !0),
      a.disabled ? (e(), i(M, { key: 2 }, [
        $.value.length ? (e(), i("dl", $s, [
          (e(!0), i(M, null, se($.value, (H) => (e(), i(M, {
            key: H.key
          }, [
            l("dt", null, _(H.label), 1),
            l("dd", null, _(H.value), 1)
          ], 64))), 128))
        ])) : (e(), i("span", Cs, "No overrides"))
      ], 64)) : (e(), i("div", xs, [
        y.value === "ready" ? (e(), i("wc-schema-form", {
          key: 0,
          schema: JSON.stringify(p.value),
          config: JSON.stringify(a.modelValue),
          onConfigChanged: g
        }, null, 40, Vs)) : y.value === "pending" ? (e(), i("span", Us, "Configuration form is loading.")) : (e(), O(s(Se), {
          key: 2,
          role: "alert",
          severity: "error"
        }, {
          default: w(() => [
            I[3] || (I[3] = W("Configuration form could not be loaded. ", -1)),
            b(s(G), {
              type: "button",
              onClick: f,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: w(() => [...I[2] || (I[2] = [
                W("Retry", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })),
        a.problem ? v("", !0) : (e(), O(s(G), {
          key: 3,
          type: "button",
          onClick: I[0] || (I[0] = (H) => n("update:modelValue", {})),
          severity: "secondary",
          outlined: "",
          size: "small"
        }, {
          default: w(() => [
            b(s(oe), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            }),
            I[4] || (I[4] = W(" Reset overrides", -1))
          ]),
          _: 1
        }))
      ]))
    ], 64));
  }
}), Ss = { key: 0 }, js = /* @__PURE__ */ pe({
  __name: "DefaultValue",
  props: {
    attribute: {},
    type: {},
    disabled: { type: Boolean }
  },
  emits: ["change"],
  setup(a, { emit: m }) {
    const t = a, n = m, y = F(() => {
      const g = t.type?.form;
      let T = { type: "string" };
      return g === "bool" ? T = { type: "boolean" } : g === "int" ? T = { type: "integer" } : g === "dec" ? T = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : g === "quantity" ? T = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(t.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : g === "record" ? T = { type: "object", additionalProperties: !0 } : g === "ref" && (T = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${t.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (t.attribute.cardinality ?? "one") !== "one" && (T = { type: "array", items: T, uniqueItems: t.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...T, title: "Default value" } } };
    });
    function p(g) {
      return g && typeof g == "object" && "m" in g && "e" in g ? Il(g) : g;
    }
    function $(g) {
      return t.type?.form === "dec" ? p(g) : t.type?.form === "quantity" && g && typeof g == "object" && "v" in g && "u" in g ? { value: p(g.v), unit: g.u } : g;
    }
    const f = F(() => t.attribute.default === void 0 ? {} : { value: Array.isArray(t.attribute.default) ? t.attribute.default.map($) : $(t.attribute.default) });
    return (g, T) => a.disabled ? (e(), i("span", Ss, _(a.attribute.default == null ? "No default" : s(yl)(a.attribute.default)), 1)) : (e(), O(Ol, {
      key: 1,
      schema: y.value,
      "model-value": f.value,
      "onUpdate:modelValue": T[0] || (T[0] = (I) => n("change", I.value))
    }, null, 8, ["schema", "model-value"]));
  }
}), As = { class: "pim-stack" }, Is = {
  key: 0,
  class: "pim-ia-action"
}, Rs = {
  key: 1,
  class: "form pim-card-body pad muted"
}, Os = { class: "pim-bsection-head pim-list-header" }, Ts = { class: "small muted" }, Ps = { class: "row pim-list-actions" }, qs = { class: "pim-fields" }, Ds = { class: "pim-f pim-w-third" }, Fs = { class: "pim-f-label" }, Ns = ["id"], zs = { class: "pim-f pim-w-third" }, Bs = { class: "pim-f-label" }, Ls = ["id"], Es = {
  key: 0,
  class: "pim-f pim-w-third"
}, Ms = { class: "pim-f-label" }, Ws = ["id"], Hs = {
  key: 1,
  class: "pim-f pim-w-full muted small"
}, Js = {
  key: 2,
  class: "pim-f pim-w-full muted small"
}, Ks = {
  key: 3,
  class: "pim-f pim-w-third"
}, Gs = { class: "pim-f-label" }, Ys = ["id"], Zs = { class: "pim-f pim-w-third" }, Qs = { class: "pim-f-label" }, Xs = ["id"], ei = { class: "pim-f pim-w-half" }, li = { class: "pim-f-label" }, ai = ["id"], ti = ["aria-labelledby"], si = { class: "pim-f-label" }, ii = ["id"], ni = ["aria-labelledby"], oi = { class: "pim-f-label" }, di = ["id"], ri = { class: "pim-fields" }, ui = { class: "pim-f pim-w-third" }, ci = { class: "pim-f-label" }, mi = ["for"], pi = {
  key: 0,
  class: "pim-f-note"
}, vi = { class: "pim-f pim-w-third" }, fi = { class: "pim-f-label" }, bi = ["id"], yi = { class: "pim-f pim-w-half" }, gi = { class: "pim-f-label" }, hi = ["for"], ki = { class: "row" }, _i = {
  key: 0,
  class: "pim-f pim-w-full"
}, wi = { class: "pim-f-label" }, $i = ["id"], Ci = ["aria-labelledby"], xi = ["id"], Vi = {
  key: 0,
  class: "row end"
}, Ui = { class: "pim-ia-dialog-head" }, Si = {
  tabindex: "-1",
  autofocus: ""
}, ji = { class: "pim-source-permissions" }, Ai = ["id"], Ii = { class: "dialog-actions pim-group-dialog-actions" }, Ri = /* @__PURE__ */ pe({
  __name: "BuilderFields",
  props: /* @__PURE__ */ Sl({
    draft: {},
    schema: {},
    options: {}
  }, {
    family: { default: "" },
    familyModifiers: {}
  }),
  emits: /* @__PURE__ */ Sl(["remove"], ["update:family"]),
  setup(a, { emit: m }) {
    const t = a, n = Xl(a, "family"), y = m, p = vl.map((V) => V.value), $ = [{ value: "one", label: "Single value" }, { value: "list", label: "Ordered list" }, { value: "set", label: "Unique set" }], f = F(() => t.schema.access.admin), g = F(() => t.draft.aspects ?? []), T = F(() => (t.draft.families ?? []).filter((V) => V.code !== "generic"));
    ye(T, (V) => {
      n.value && !V.some((U) => U.code === n.value) && (n.value = "");
    }, { immediate: !0 });
    const I = F(() => [{ value: "", label: "All families" }, ...T.value.map((V) => ({ value: V.code, label: E(V.code) }))]), H = F(() => {
      const V = T.value.find((U) => U.code === n.value);
      return V ? g.value.filter((U) => V.aspects?.includes(U.namespace)) : g.value;
    }), Y = F(() => (t.draft.dimensions ?? []).map((V) => ({ value: V.name, label: E(V.name) }))), j = F(() => (t.draft.vocabularies ?? []).map((V) => V.code)), d = F(() => (t.draft.sources ?? []).map((V) => ({ value: V.id, label: E(V.id) }))), h = F(() => [...t.options.types].sort((V, U) => V.form.localeCompare(U.form)).map((V) => ({ value: V.id, label: dl(V) })));
    function r(V) {
      return t.options.types.find((U) => U.id === V.type);
    }
    function N(V) {
      return r(V)?.target === "term";
    }
    function te(V) {
      return r(V)?.target === "asset";
    }
    function Q(V) {
      const U = r(V);
      return !!U && U.form === "ref" && !U.target;
    }
    function le(V) {
      return T.value.filter((U) => U.aspects?.includes(V)).map((U) => E(U.code));
    }
    function ne(V) {
      const U = le(V);
      return U.length ? U.length === 1 ? U[0] : U.length + " families" : "Unused by families";
    }
    const D = { none: "None", key: "Exact match", number: "Number range", text: "Text search" }, z = K({}), P = Pe(), Z = /* @__PURE__ */ new WeakMap();
    let L = 0;
    function J(V, U) {
      if (U.id !== void 0) return V + "." + U.id;
      const S = Fa(U);
      let C = Z.get(S);
      return C === void 0 && (C = ++L, Z.set(S, C)), V + ".draft-" + C;
    }
    function R(V, U, S) {
      return P + "-" + J(V, U) + "-" + S;
    }
    function A(V, U) {
      V.type = U;
      const S = r(V);
      if (S && V.index && !S.indexes.includes(V.index) && delete V.index, N(V) || delete V.vocabulary, te(V) && delete V.default, !Q(V) && V.config && "target" in V.config) {
        const { target: C, ...ve } = V.config;
        V.config = Object.keys(ve).length ? ve : void 0, V.config || delete V.config;
      }
    }
    function c(V, U) {
      Object.keys(U).length ? V.config = U : delete V.config;
    }
    function k(V, U) {
      const S = { ...V.config ?? {} };
      U ? S.target = U : delete S.target, c(V, S);
    }
    function q(V, U) {
      U.length ? V.scope = U : delete V.scope, U.length || delete V.index_contexts;
    }
    function B(V, U, S) {
      S === void 0 || S === "" || S === !1 && U !== "default" ? delete V[U] : V[U] = S;
    }
    function ie(V) {
      return V.index_contexts ?? [];
    }
    function X(V) {
      return (t.draft.dimensions ?? []).find((U) => U.name === V)?.members ?? [];
    }
    function be(V) {
      const U = {};
      for (const C of V.scope ?? []) U[C] = X(C)[0] ?? "";
      (V.index_contexts ?? (V.index_contexts = [])).push(U);
    }
    const fe = K(), Ie = F(() => fe.value ? E(fe.value.namespace) + " settings" : "");
    async function De(V, U, S, C) {
      const ve = V.currentTarget, ee = ve.parentElement;
      pl(U, S, C), await Ke(), (ve.isConnected ? ve : ee?.querySelector("button"))?.focus({ preventScroll: !0 });
    }
    function Ce(V) {
      (t.draft.aspects ??= []).push({ namespace: V, attributes: [] });
    }
    function he(V) {
      fe.value = void 0;
      const U = g.value.indexOf(V);
      U >= 0 && g.value.splice(U, 1), t.schema.declaration.aspects?.some((S) => S.namespace === V.namespace) && y("remove", "aspects", V.namespace);
    }
    function sl(V, U) {
      const S = t.options.types.find((ve) => ve.id === "kickside.pim.types:text") ?? t.options.types[0], C = { code: U, type: S?.id ?? "" };
      (V.attributes ??= []).push(C), z.value[J(V.namespace, C)] = !0;
    }
    function de(V, U) {
      const S = V.attributes ?? [], C = S.indexOf(U);
      C >= 0 && S.splice(C, 1);
      const ve = U.id === void 0 ? void 0 : t.schema.declaration.aspects?.find((ee) => ee.namespace === V.namespace)?.attributes?.find((ee) => ee.id === U.id);
      ve && y("remove", "attributes", V.namespace + "." + ve.code);
    }
    return (V, U) => (e(), i("div", As, [
      T.value.length || f.value && !n.value ? (e(), i("div", Is, [
        T.value.length ? (e(), O(s(Ue), {
          key: 0,
          modelValue: n.value,
          "onUpdate:modelValue": U[0] || (U[0] = (S) => n.value = S),
          class: "pim-family-filter",
          "aria-label": "Show fields for a family",
          placeholder: "All families",
          options: I.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self"
        }, null, 8, ["modelValue", "options"])) : v("", !0),
        f.value && !n.value ? (e(), O(Be, {
          key: 1,
          label: "Field group name",
          action: "Add field group",
          "from-name": "",
          regular: "",
          existing: g.value.map((S) => S.namespace),
          onAdd: Ce
        }, null, 8, ["existing"])) : v("", !0)
      ])) : v("", !0),
      n.value && !H.value.length ? (e(), i("p", Rs, "This family has no field groups yet. Open the family to choose which groups it uses.")) : v("", !0),
      (e(!0), i(M, null, se(H.value, (S) => (e(), O(Le, {
        key: S.namespace,
        count: S.attributes?.length ?? 0,
        columns: ["kind", "details", "usage"],
        "show-actions": f.value
      }, {
        head: w(() => [
          l("header", Os, [
            l("div", null, [
              l("h3", null, _(s(E)(S.namespace)), 1),
              l("p", Ts, _(le(S.namespace).length ? "Used by " + le(S.namespace).join(", ") : "Unused by families"), 1)
            ]),
            l("div", Ps, [
              f.value ? (e(), O(Be, {
                key: 0,
                label: "Field name",
                action: "Add field",
                "from-name": "",
                existing: S.attributes?.map((C) => C.code),
                onAdd: (C) => sl(S, C)
              }, null, 8, ["existing", "onAdd"])) : v("", !0),
              b(s(G), {
                type: "button",
                "aria-label": s(E)(S.namespace) + " settings",
                title: s(E)(S.namespace) + " settings",
                "aria-haspopup": "dialog",
                severity: "secondary",
                text: "",
                size: "small",
                onClick: (C) => fe.value = S
              }, {
                default: w(() => [
                  b(s(oe), {
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
          (e(!0), i(M, null, se(S.attributes ?? [], (C, ve) => (e(), O(Ee, {
            "route-section": "fields",
            "route-id": C.id === void 0 ? void 0 : J(S.namespace, C),
            key: J(S.namespace, C),
            open: z.value[J(S.namespace, C)],
            "onUpdate:open": (ee) => z.value[J(S.namespace, C)] = ee,
            title: s(E)(C.code),
            kind: s(dl)(r(C)),
            usage: ne(S.namespace),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle"
          }, $e({
            details: w(() => [
              C.cardinality && C.cardinality !== "one" ? (e(), O(s(_e), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [
                  W(_($.find((ee) => ee.value === C.cardinality)?.label), 1)
                ]),
                _: 2
              }, 1024)) : v("", !0),
              C.scope?.length ? (e(), O(s(_e), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [
                  W("per " + _(C.scope.map(s(E)).join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : v("", !0),
              C.index && C.index !== "none" ? (e(), O(s(_e), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [
                  W(_(D[C.index] || "Filterable"), 1)
                ]),
                _: 2
              }, 1024)) : v("", !0),
              C.unique ? (e(), O(s(_e), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [...U[6] || (U[6] = [
                  W("unique", -1)
                ])]),
                _: 1
              })) : v("", !0)
            ]),
            default: w(() => [
              l("div", qs, [
                l("div", Ds, [
                  l("div", Fs, [
                    l("label", {
                      id: R(S.namespace, C, "type")
                    }, "Type", 8, Ns)
                  ]),
                  b(s(Ue), {
                    disabled: !f.value,
                    "aria-labelledby": R(S.namespace, C, "type"),
                    "model-value": C.type,
                    options: h.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (ee) => A(C, ee)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                l("div", zs, [
                  l("div", Bs, [
                    l("label", {
                      id: R(S.namespace, C, "values")
                    }, "Values", 8, Ls)
                  ]),
                  b(s(Ue), {
                    disabled: !f.value,
                    "aria-labelledby": R(S.namespace, C, "values"),
                    "model-value": C.cardinality ?? "one",
                    options: $,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (ee) => B(C, "cardinality", ee === "one" ? void 0 : ee)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                N(C) ? (e(), i("div", Es, [
                  l("div", Ms, [
                    l("label", {
                      id: R(S.namespace, C, "vocabulary")
                    }, "Vocabulary", 8, Ws)
                  ]),
                  b(s(Ue), {
                    disabled: !f.value,
                    "aria-labelledby": R(S.namespace, C, "vocabulary"),
                    "model-value": C.vocabulary ?? "",
                    "onUpdate:modelValue": (ee) => B(C, "vocabulary", ee),
                    options: [{ value: "", label: "Choose…" }, ...j.value.map((ee) => ({ value: ee, label: s(E)(ee) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : v("", !0),
                te(C) ? (e(), i("p", Hs, "Choose the media types and file size this field accepts. Catalog readers can access attached files.")) : r(C)?.form === "ref" && !N(C) ? (e(), i("p", Js, _(Q(C) ? "A link points to something managed by an installed plugin." : "A product reference points to another product in this catalog."), 1)) : v("", !0),
                Q(C) ? (e(), i("div", Ks, [
                  l("div", Gs, [
                    l("label", {
                      id: R(S.namespace, C, "link")
                    }, "Link destination", 8, Ys),
                    U[7] || (U[7] = l("span", { class: "pim-f-note" }, "choose what the field can point to", -1))
                  ]),
                  b(s(Ue), {
                    disabled: !f.value,
                    "aria-labelledby": R(S.namespace, C, "link"),
                    "model-value": C.config?.target ?? "",
                    "onUpdate:modelValue": (ee) => k(C, ee),
                    options: [{ value: "", label: "Choose…" }, ...a.options.link_kinds.map((ee) => ({ value: ee.kind, label: s(ce)(ee.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : v("", !0),
                l("div", Zs, [
                  l("div", Qs, [
                    l("label", {
                      id: R(S.namespace, C, "width")
                    }, "Width", 8, Xs),
                    U[8] || (U[8] = l("span", { class: "pim-f-note" }, "of a form row", -1))
                  ]),
                  b(s(Rl), {
                    disabled: !f.value,
                    "aria-labelledby": R(S.namespace, C, "width"),
                    "model-value": s(Al)(a.schema, S.namespace, C),
                    options: s(p),
                    "allow-empty": !1,
                    "onUpdate:modelValue": (ee) => C.width = ee
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                l("div", ei, [
                  l("div", li, [
                    l("label", {
                      id: R(S.namespace, C, "scope")
                    }, "Varies per", 8, ai),
                    U[9] || (U[9] = l("span", { class: "pim-f-note" }, "dimensions the value depends on", -1))
                  ]),
                  b(Te, {
                    disabled: !f.value,
                    labelledby: R(S.namespace, C, "scope"),
                    "model-value": C.scope ?? [],
                    options: Y.value,
                    "onUpdate:modelValue": (ee) => q(C, ee)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                te(C) ? v("", !0) : (e(), i("div", {
                  key: 4,
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": R(S.namespace, C, "default")
                }, [
                  l("div", si, [
                    l("label", {
                      id: R(S.namespace, C, "default")
                    }, "Default", 8, ii),
                    U[10] || (U[10] = l("span", { class: "pim-f-note" }, "when no value is set", -1))
                  ]),
                  b(js, {
                    disabled: !f.value,
                    attribute: C,
                    type: r(C),
                    onChange: (ee) => B(C, "default", ee)
                  }, null, 8, ["disabled", "attribute", "type", "onChange"])
                ], 8, ti)),
                r(C)?.config_schema ? (e(), i("div", {
                  key: 5,
                  class: "pim-f pim-w-full",
                  role: "group",
                  "aria-labelledby": R(S.namespace, C, "config")
                }, [
                  l("div", oi, [
                    l("label", {
                      id: R(S.namespace, C, "config")
                    }, "Type configuration", 8, di)
                  ]),
                  b(Ol, {
                    disabled: !f.value,
                    schema: r(C).config_schema,
                    "model-value": C.config ?? {},
                    "onUpdate:modelValue": (ee) => c(C, ee)
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue"])
                ], 8, ni)) : v("", !0)
              ]),
              b(Ve, {
                class: "pim-field-advanced pim-ia-disclosure",
                label: "Advanced"
              }, {
                default: w(() => [
                  l("div", ri, [
                    l("div", ui, [
                      l("div", ci, [
                        l("label", {
                          for: R(S.namespace, C, "code")
                        }, "Integration key", 8, mi),
                        C.id !== void 0 ? (e(), i("span", pi, "renaming keeps stored values")) : v("", !0)
                      ]),
                      b(s(al), {
                        disabled: !f.value,
                        id: R(S.namespace, C, "code"),
                        type: "text",
                        value: C.code,
                        onInput: (ee) => C.code = ee.target.value,
                        class: "mono"
                      }, null, 8, ["disabled", "id", "value", "onInput"])
                    ]),
                    l("div", vi, [
                      l("div", fi, [
                        l("label", {
                          id: R(S.namespace, C, "index")
                        }, "Search and filters", 8, bi),
                        U[11] || (U[11] = l("span", { class: "pim-f-note" }, "choose how this field can be matched", -1))
                      ]),
                      b(s(Ue), {
                        disabled: !f.value,
                        "aria-labelledby": R(S.namespace, C, "index"),
                        "model-value": C.index ?? "none",
                        options: (r(C)?.indexes ?? ["none"]).map((ee) => ({ value: ee, label: D[ee] || s(E)(ee) })),
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self",
                        "onUpdate:modelValue": (ee) => B(C, "index", ee === "none" ? void 0 : ee)
                      }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ]),
                    l("div", yi, [
                      l("div", gi, [
                        l("label", {
                          for: R(S.namespace, C, "unique")
                        }, "Unique", 8, hi),
                        U[12] || (U[12] = l("span", { class: "pim-f-note" }, "one holder per value, catalog wide", -1))
                      ]),
                      l("div", ki, [
                        b(s(ul), {
                          "input-id": R(S.namespace, C, "unique"),
                          "model-value": C.unique === !0,
                          disabled: !f.value || !!C.scope?.length || (C.cardinality ?? "one") !== "one",
                          "onUpdate:modelValue": (ee) => B(C, "unique", ee)
                        }, null, 8, ["input-id", "model-value", "disabled", "onUpdate:modelValue"]),
                        l("span", null, _(C.unique ? "Yes" : "No"), 1)
                      ])
                    ]),
                    (C.scope?.length ?? 0) > 0 && C.index && C.index !== "none" ? (e(), i("div", _i, [
                      l("div", wi, [
                        l("label", {
                          id: R(S.namespace, C, "contexts")
                        }, "Filterable combinations", 8, $i),
                        U[13] || (U[13] = l("span", { class: "pim-f-note" }, "which combinations get an index", -1))
                      ]),
                      l("div", {
                        class: "pim-contexts",
                        role: "group",
                        "aria-labelledby": R(S.namespace, C, "contexts")
                      }, [
                        (e(!0), i(M, null, se(ie(C), (ee, Re) => (e(), i("div", {
                          key: Re,
                          class: "pim-context-row"
                        }, [
                          (e(!0), i(M, null, se(C.scope, (Oe) => (e(), i("div", {
                            key: Oe,
                            class: "pim-context-field"
                          }, [
                            l("span", {
                              id: R(S.namespace, C, "context-" + Re + "-" + Oe),
                              class: "small muted"
                            }, _(s(E)(Oe)), 9, xi),
                            b(s(Ue), {
                              disabled: !f.value,
                              "aria-labelledby": R(S.namespace, C, "context-" + Re + "-" + Oe),
                              "model-value": ee[Oe] ?? "",
                              options: X(Oe),
                              class: "narrow",
                              appendTo: "self",
                              "onUpdate:modelValue": (kl) => ee[Oe] = kl
                            }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                          ]))), 128)),
                          f.value ? (e(), O(s(G), {
                            key: 0,
                            type: "button",
                            "aria-label": "Remove context",
                            onClick: (Oe) => ie(C).splice(Re, 1),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: w(() => [
                              b(s(oe), { icon: "tabler:x" })
                            ]),
                            _: 1
                          }, 8, ["onClick"])) : v("", !0)
                        ]))), 128)),
                        f.value ? (e(), O(s(G), {
                          key: 0,
                          type: "button",
                          onClick: (ee) => be(C),
                          severity: "secondary",
                          outlined: "",
                          size: "small"
                        }, {
                          default: w(() => [
                            b(s(oe), {
                              icon: "tabler:plus",
                              "aria-hidden": "true"
                            }),
                            U[14] || (U[14] = W(" Add context", -1))
                          ]),
                          _: 1
                        }, 8, ["onClick"])) : v("", !0)
                      ], 8, Ci)
                    ])) : v("", !0)
                  ])
                ]),
                _: 2
              }, 1024),
              f.value ? (e(), i("div", Vi, [
                b(s(G), {
                  type: "button",
                  onClick: (ee) => de(S, C),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    b(s(oe), { icon: "tabler:trash" }),
                    U[15] || (U[15] = W(" Remove field", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : v("", !0)
            ]),
            _: 2
          }, [
            f.value ? {
              name: "actions",
              fn: w(() => [
                ve > 0 ? (e(), O(s(G), {
                  key: 0,
                  type: "button",
                  "aria-label": "Move " + s(E)(C.code) + " earlier",
                  onClick: (ee) => De(ee, S.attributes, ve, ve - 1),
                  text: "",
                  size: "small",
                  severity: "secondary"
                }, {
                  default: w(() => [
                    b(s(oe), {
                      icon: "tabler:arrow-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])) : v("", !0),
                ve < (S.attributes?.length ?? 0) - 1 ? (e(), O(s(G), {
                  key: 1,
                  type: "button",
                  class: "pim-move-later",
                  "aria-label": "Move " + s(E)(C.code) + " later",
                  onClick: (ee) => De(ee, S.attributes, ve, ve + 1),
                  text: "",
                  size: "small",
                  severity: "secondary"
                }, {
                  default: w(() => [
                    b(s(oe), {
                      icon: "tabler:arrow-down",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])) : v("", !0)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "open", "onUpdate:open", "title", "kind", "usage"]))), 128))
        ]),
        _: 2
      }, 1032, ["count", "show-actions"]))), 128)),
      b(fl, {
        visible: !!fe.value,
        label: Ie.value,
        onClose: U[5] || (U[5] = (S) => fe.value = void 0)
      }, {
        default: w(() => [
          fe.value ? (e(), i("section", {
            key: 0,
            class: "pim-ia-dialog",
            onKeydown: U[4] || (U[4] = rl(ze((S) => fe.value = void 0, ["prevent"]), ["esc"]))
          }, [
            l("header", Ui, [
              l("h2", Si, _(Ie.value), 1)
            ]),
            l("div", ji, [
              l("label", {
                id: s(P) + "-writers"
              }, "Sources allowed to write", 8, Ai),
              b(s(aa), {
                disabled: !f.value,
                "aria-labelledby": s(P) + "-writers",
                "model-value": fe.value.write?.sources ?? [],
                options: d.value,
                "option-label": "label",
                "option-value": "value",
                placeholder: "Any source",
                "append-to": "self",
                "onUpdate:modelValue": U[1] || (U[1] = (S) => fe.value.write = { sources: S })
              }, null, 8, ["disabled", "aria-labelledby", "model-value", "options"])
            ]),
            l("footer", Ii, [
              f.value ? (e(), O(s(G), {
                key: 0,
                type: "button",
                label: "Remove field group",
                severity: "danger",
                text: "",
                onClick: U[2] || (U[2] = (S) => he(fe.value))
              })) : v("", !0),
              b(s(G), {
                type: "button",
                label: "Done",
                severity: "secondary",
                outlined: "",
                onClick: U[3] || (U[3] = (S) => fe.value = void 0)
              })
            ])
          ], 32)) : v("", !0)
        ]),
        _: 1
      }, 8, ["visible", "label"])
    ]));
  }
}), Oi = { class: "muted small" }, Ti = { class: "pim-aspect" }, Pi = {
  key: 0,
  class: "small muted"
}, qi = { class: "pim-fields" }, Di = { class: "pim-f pim-w-full" }, Fi = { class: "pim-f-label" }, Ni = ["id"], zi = { class: "pim-f-label" }, Bi = ["id"], Li = /* @__PURE__ */ pe({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(a, { emit: m }) {
    const t = a, n = m, y = F(() => t.schema.access.admin), p = F(() => t.draft.dimensions ?? []), $ = Pe();
    function f(d, h) {
      return $ + "-" + d.name + "-" + h;
    }
    function g(d) {
      (t.draft.dimensions ??= []).push({ name: d, members: [] });
    }
    function T(d) {
      const h = [];
      for (const r of t.draft.aspects ?? []) for (const N of r.attributes ?? []) N.scope?.includes(d.name) && h.push(`${E(N.code)} (${E(r.namespace)})`);
      for (const r of t.draft.families ?? []) for (const N of r.requirements ?? []) N.context && d.name in N.context && h.push(`${E(N.id)} (${E(r.code)})`);
      return h;
    }
    function I(d) {
      T(d).length || (p.value.splice(p.value.indexOf(d), 1), t.schema.declaration.dimensions?.some((h) => h.name === d.name) && n("remove", "dimensions", d.name));
    }
    function H(d, h) {
      if (d.members = h, d.fallback)
        for (const r of Object.keys(d.fallback)) h.includes(r) || delete d.fallback[r];
    }
    function Y(d, h) {
      return d.fallback?.[h] ?? [];
    }
    function j(d, h, r) {
      const N = { ...d.fallback ?? {} };
      r.length ? N[h] = r : delete N[h], Object.keys(N).length ? d.fallback = N : delete d.fallback;
    }
    return (d, h) => (e(), O(Le, {
      count: p.value.length,
      columns: ["details", "usage"]
    }, $e({
      default: w(() => [
        (e(!0), i(M, null, se(p.value, (r) => (e(), O(Ee, {
          "route-section": "dimensions",
          "route-id": r.name,
          title: s(E)(r.name),
          key: r.name,
          usage: T(r).length ? "Used in " + T(r).length + " places" : "Unused"
        }, $e({
          details: w(() => [
            l("span", Oi, _(r.members.map(s(E)).join(", ") || "No allowed values"), 1)
          ]),
          default: w(() => [
            l("div", Ti, [
              T(r).length ? (e(), i("p", Pi, "Used by " + _(T(r).join(", ")), 1)) : v("", !0),
              l("div", qi, [
                l("div", Di, [
                  l("div", Fi, [
                    l("label", {
                      id: f(r, "members")
                    }, "Allowed values", 8, Ni),
                    h[0] || (h[0] = l("span", { class: "pim-f-note" }, "for example, English and French for Language", -1))
                  ]),
                  b(Te, {
                    disabled: !y.value,
                    labelledby: f(r, "members"),
                    "model-value": r.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (N) => H(r, N)
                  }, null, 8, ["disabled", "labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                (e(!0), i(M, null, se(r.members, (N) => (e(), i("div", {
                  key: N,
                  class: "pim-f pim-w-half"
                }, [
                  l("div", zi, [
                    l("label", {
                      id: f(r, "fallback-" + encodeURIComponent(N))
                    }, _(N) + " falls back to", 9, Bi),
                    h[1] || (h[1] = l("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  b(Te, {
                    disabled: !y.value,
                    labelledby: f(r, "fallback-" + encodeURIComponent(N)),
                    "model-value": Y(r, N),
                    options: r.members.filter((te) => te !== N).map((te) => ({ value: te })),
                    "onUpdate:modelValue": (te) => j(r, N, te)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]))), 128))
              ])
            ])
          ]),
          _: 2
        }, [
          y.value ? {
            name: "actions",
            fn: w(() => [
              b(s(G), {
                type: "button",
                disabled: T(r).length > 0,
                "aria-label": "Remove " + s(E)(r.name),
                title: T(r).length ? "Take the dimension off these first" : "",
                onClick: (N) => I(r),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: w(() => [
                  b(s(oe), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "title", "onClick"])
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["route-id", "title", "usage"]))), 128))
      ]),
      _: 2
    }, [
      y.value ? {
        name: "add",
        fn: w(() => [
          b(Be, {
            label: "Dimension name",
            "from-name": "",
            action: "Add dimension",
            existing: p.value.map((r) => r.name),
            onAdd: g
          }, {
            default: w(() => [...h[2] || (h[2] = [
              l("span", { class: "muted small" }, "A dimension lets a value differ per member, with fallbacks between members.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), Ei = { class: "muted small" }, Mi = { class: "pim-aspect" }, Wi = { class: "row small" }, Hi = {
  key: 1,
  class: "muted small"
}, Ji = {
  key: 2,
  class: "pim-stack tight pim-terms"
}, Ki = {
  key: 0,
  class: "muted small"
}, Gi = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Yi = {
  key: 3,
  class: "pim-responsive-table"
}, Zi = {
  class: "pim-grid compact",
  "aria-label": "Vocabulary terms"
}, Qi = { key: 0 }, Xi = { key: 1 }, en = {
  key: 0,
  class: "muted"
}, ln = {
  key: 1,
  class: "num"
}, an = {
  role: "list",
  class: "pim-stacked-list",
  "aria-label": "Vocabulary terms"
}, tn = {
  key: 0,
  class: "pim-stacked-meta muted small"
}, sn = {
  key: 4,
  class: "muted small"
}, nn = { class: "row wrap" }, on = {
  key: 5,
  class: "row wrap pim-add-row"
}, dn = {
  key: 0,
  class: "pim-config-overrides"
}, rn = /* @__PURE__ */ pe({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(a, { emit: m }) {
    const t = a, n = m, y = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/, p = F(() => t.schema.access.admin), $ = F(() => p.value && t.schema.access.write), f = F(() => t.draft.vocabularies ?? []);
    function g(R) {
      (t.draft.vocabularies ??= []).push({ code: R });
    }
    function T(R) {
      f.value.splice(f.value.indexOf(R), 1), t.schema.declaration.vocabularies?.some((A) => A.code === R.code) && n("remove", "vocabularies", R.code);
    }
    function I(R) {
      return !!t.schema.vocabularies[R];
    }
    const H = K({}), Y = K({}), j = K({}), d = K({}), h = K({}), r = K({}), N = K({}), te = K({});
    function Q(R) {
      return !!(h.value[R] || r.value[R]);
    }
    async function le(R, A) {
      h.value[R] = !0, delete N.value[R];
      try {
        const c = await ge.termsPage(t.catalogId, R, A);
        Y.value[R] = c.terms, d.value[R] = A, j.value[R] = c.next;
        const k = D(R);
        c.terms.some((q) => q.retired && q.code === k.parent) && (k.parent = "");
      } catch (c) {
        N.value[R] = { errors: [Ye(c, "Could not load terms.")], read: { after: A } };
      } finally {
        h.value[R] = !1;
      }
    }
    function ne(R) {
      H.value[R] = !H.value[R], H.value[R] && !Q(R) && !Y.value[R] && !N.value[R] && le(R);
    }
    function D(R) {
      return te.value[R] ?? (te.value[R] = { code: "", label: "", parent: "" });
    }
    function z(R, A) {
      const c = Y.value[R]?.find((k) => k.code === A);
      return c ? Je(c) : E(A);
    }
    function P(R) {
      return [{ value: "", label: "No parent" }, ...(Y.value[R] ?? []).filter((A) => !A.retired).map((A) => ({ value: A.code, label: Je(A) }))];
    }
    function Z(R, A, c) {
      N.value[R] = { errors: A?.findings?.length ? A.findings.map((k) => ({ message: k.message ?? c, code: k.code })) : [{ message: c }] };
    }
    async function L(R) {
      const A = D(R.code);
      if (!(!$.value || !y.test(A.code))) {
        r.value[R.code] = !0, delete N.value[R.code];
        try {
          const c = { term: { vocabulary: R.code, code: A.code }, labels: { en: A.label || E(A.code) } };
          R.hierarchical && A.parent && (c.parent = A.parent);
          const q = (await ge.apply(t.catalogId, [c])).outcomes[0];
          if (q?.outcome !== "created" && q?.outcome !== "updated") {
            Z(R.code, q, "The term was not accepted.");
            return;
          }
          te.value[R.code] = { code: "", label: "", parent: "" }, ge.invalidateTerms(t.catalogId), await le(R.code, d.value[R.code]);
        } catch (c) {
          N.value[R.code] = { errors: [Ye(c, "Could not add the term.")] };
        } finally {
          r.value[R.code] = !1;
        }
      }
    }
    async function J(R, A, c) {
      if ($.value && !(c && !await el.confirm({ header: "Retire term?", message: `Retire ${Je(A)}? Term changes save immediately. You can restore this term later.`, acceptLabel: "Retire", rejectLabel: "Cancel" }))) {
        r.value[R.code] = !0, delete N.value[R.code];
        try {
          const q = (await ge.apply(t.catalogId, [{ term: { vocabulary: R.code, code: A.code }, retired: c }])).outcomes[0];
          if (!q || !["updated", "unchanged"].includes(q.outcome)) {
            Z(R.code, q, "The term change was not accepted.");
            return;
          }
          c && D(R.code).parent === A.code && (D(R.code).parent = ""), ge.invalidateTerms(t.catalogId), await le(R.code, d.value[R.code]);
        } catch (k) {
          N.value[R.code] = { errors: [Ye(k, "Could not change the term.")] };
        } finally {
          r.value[R.code] = !1;
        }
      }
    }
    return (R, A) => (e(), O(Le, {
      count: f.value.length,
      columns: ["details"]
    }, $e({
      default: w(() => [
        (e(!0), i(M, null, se(f.value, (c) => (e(), O(Ee, {
          "route-section": "vocabularies",
          "route-id": c.code,
          title: s(E)(c.code),
          key: c.code
        }, {
          details: w(() => [
            l("span", Ei, _(c.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: w(() => [
            p.value ? (e(), O(s(G), {
              key: 0,
              type: "button",
              "aria-label": "Remove " + s(E)(c.code),
              onClick: (k) => T(c),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: w(() => [
                b(s(oe), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])) : v("", !0)
          ]),
          default: w(() => [
            l("div", Mi, [
              l("label", Wi, [
                b(s(ul), {
                  disabled: !p.value,
                  "aria-label": "Hierarchical " + s(E)(c.code),
                  "model-value": c.hierarchical === !0,
                  "onUpdate:modelValue": (k) => k ? c.hierarchical = !0 : delete c.hierarchical
                }, null, 8, ["disabled", "aria-label", "model-value", "onUpdate:modelValue"]),
                A[0] || (A[0] = l("span", null, "Hierarchical", -1))
              ]),
              I(c.code) ? (e(), O(s(G), {
                key: 0,
                type: "button",
                onClick: (k) => ne(c.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: w(() => [
                  b(s(oe), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  W(" " + _(H.value[c.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : p.value ? (e(), i("span", Hi, "Apply the schema before adding terms.")) : v("", !0),
              H.value[c.code] ? (e(), i("div", Ji, [
                $.value ? (e(), i("p", Ki, "Term changes save immediately.")) : v("", !0),
                h.value[c.code] ? (e(), i("div", Gi, "Loading terms…")) : N.value[c.code] ? (e(!0), i(M, { key: 2 }, se(N.value[c.code].errors, (k, q) => (e(), O(hl, {
                  key: q,
                  error: k
                }, {
                  default: w(() => [
                    N.value[c.code].read ? (e(), O(s(G), {
                      key: 0,
                      type: "button",
                      onClick: (B) => le(c.code, N.value[c.code].read?.after),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: w(() => [...A[1] || (A[1] = [
                        W("Retry", -1)
                      ])]),
                      _: 1
                    }, 8, ["onClick"])) : v("", !0)
                  ]),
                  _: 2
                }, 1032, ["error"]))), 128)) : v("", !0),
                (Y.value[c.code] ?? []).length ? (e(), i("div", Yi, [
                  l("table", Zi, [
                    l("thead", null, [
                      l("tr", null, [
                        A[2] || (A[2] = l("th", null, "Term", -1)),
                        c.hierarchical ? (e(), i("th", Qi, "Parent")) : v("", !0),
                        p.value ? (e(), i("th", Xi)) : v("", !0)
                      ])
                    ]),
                    l("tbody", null, [
                      (e(!0), i(M, null, se(Y.value[c.code], (k) => (e(), i("tr", {
                        key: k.code,
                        class: Ae({ muted: k.retired })
                      }, [
                        l("td", null, [
                          W(_(s(Je)(k)) + " ", 1),
                          k.retired ? (e(), O(s(_e), {
                            key: 0,
                            severity: "secondary",
                            value: "Retired"
                          })) : v("", !0)
                        ]),
                        c.hierarchical ? (e(), i("td", en, _(k.parent ? z(c.code, k.parent) : "—"), 1)) : v("", !0),
                        p.value ? (e(), i("td", ln, [
                          b(s(G), {
                            type: "button",
                            disabled: !$.value || Q(c.code),
                            onClick: (q) => J(c, k, !k.retired),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: w(() => [
                              W(_(k.retired ? "Restore" : "Retire"), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled", "onClick"])
                        ])) : v("", !0)
                      ], 2))), 128))
                    ])
                  ]),
                  l("ul", an, [
                    (e(!0), i(M, null, se(Y.value[c.code], (k) => (e(), i("li", {
                      key: k.code,
                      class: Ae(["pim-stacked-row", { muted: k.retired }])
                    }, [
                      l("div", null, [
                        W(_(s(Je)(k)) + " ", 1),
                        k.retired ? (e(), O(s(_e), {
                          key: 0,
                          severity: "secondary",
                          value: "Retired"
                        })) : v("", !0)
                      ]),
                      c.hierarchical && k.parent ? (e(), i("div", tn, "Parent: " + _(z(c.code, k.parent)), 1)) : v("", !0),
                      p.value ? (e(), O(s(G), {
                        key: 1,
                        type: "button",
                        disabled: !$.value || Q(c.code),
                        onClick: (q) => J(c, k, !k.retired),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: w(() => [
                          W(_(k.retired ? "Restore" : "Retire"), 1)
                        ]),
                        _: 2
                      }, 1032, ["disabled", "onClick"])) : v("", !0)
                    ], 2))), 128))
                  ])
                ])) : Y.value[c.code] && !Q(c.code) && !N.value[c.code] ? (e(), i("p", sn, "No terms yet.")) : v("", !0),
                l("div", nn, [
                  b(s(G), {
                    type: "button",
                    disabled: Q(c.code) || !d.value[c.code],
                    onClick: (k) => le(c.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      b(s(oe), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      A[3] || (A[3] = W(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  b(s(G), {
                    type: "button",
                    disabled: Q(c.code) || !j.value[c.code],
                    onClick: (k) => le(c.code, j.value[c.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      b(s(oe), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      A[4] || (A[4] = W(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                p.value ? (e(), i("div", on, [
                  b(s(al), {
                    modelValue: D(c.code).label,
                    "onUpdate:modelValue": (k) => D(c.code).label = k,
                    disabled: !$.value || Q(c.code),
                    "aria-label": "Term name in English",
                    type: "text",
                    placeholder: "Term name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  b(s(al), {
                    modelValue: D(c.code).code,
                    "onUpdate:modelValue": (k) => D(c.code).code = k,
                    disabled: !$.value || Q(c.code),
                    type: "text",
                    "aria-label": "Short term name",
                    placeholder: "Short name for imports",
                    class: "narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  c.hierarchical ? (e(), O(s(Ue), {
                    key: 0,
                    modelValue: D(c.code).parent,
                    "onUpdate:modelValue": (k) => D(c.code).parent = k,
                    disabled: !$.value || Q(c.code),
                    class: "narrow",
                    "aria-label": "Parent term",
                    placeholder: "No parent",
                    options: P(c.code),
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "options"])) : v("", !0),
                  b(s(G), {
                    type: "button",
                    disabled: !$.value || Q(c.code) || !y.test(D(c.code).code),
                    onClick: (k) => L(c),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      b(s(oe), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      A[5] || (A[5] = W(" Add term", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])) : v("", !0),
                b(Ve, {
                  class: "pim-ia-disclosure",
                  label: "Integration keys"
                }, {
                  default: w(() => [
                    (Y.value[c.code] ?? []).length ? (e(), i("dl", dn, [
                      (e(!0), i(M, null, se(Y.value[c.code], (k) => (e(), i(M, {
                        key: k.code
                      }, [
                        l("dt", null, _(s(Je)(k)), 1),
                        l("dd", null, [
                          l("code", null, _(k.code), 1)
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
        }, 1032, ["route-id", "title"]))), 128))
      ]),
      _: 2
    }, [
      p.value ? {
        name: "add",
        fn: w(() => [
          b(Be, {
            label: "Vocabulary name",
            "from-name": "",
            action: "Add vocabulary",
            existing: f.value.map((c) => c.code),
            onAdd: g
          }, {
            default: w(() => [...A[6] || (A[6] = [
              l("span", { class: "muted small" }, "Select fields pick their values from a vocabulary's terms.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), un = { class: "pim-stack" }, cn = { class: "muted small" }, mn = { class: "muted small" }, pn = { class: "pim-aspect" }, vn = { class: "pim-ia-action pim-family-fields" }, fn = { class: "pim-f" }, bn = { class: "pim-f-label" }, yn = ["id"], gn = ["id"], hn = { class: "pim-aspect" }, kn = { class: "pim-stack tight" }, _n = { class: "pim-level-head" }, wn = { class: "pim-fields" }, $n = { class: "pim-f pim-w-half" }, Cn = { class: "pim-f-label" }, xn = ["id"], Vn = { class: "pim-f pim-w-half" }, Un = { class: "pim-f-label" }, Sn = ["id"], jn = { class: "pim-aspect" }, An = { class: "pim-stack tight" }, In = { class: "pim-level-head" }, Rn = { class: "muted small" }, On = { class: "pim-fields" }, Tn = { class: "pim-f-label" }, Pn = ["id"], qn = { class: "pim-f pim-w-half" }, Dn = { class: "pim-f-label" }, Fn = ["id"], Nn = { class: "pim-f pim-w-half" }, zn = { class: "pim-f-label" }, Bn = ["id"], Ln = {
  key: 0,
  class: "pim-aspect pim-family-remove"
}, En = /* @__PURE__ */ pe({
  __name: "BuilderFamilies",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove", "fields", "variant-field"],
  setup(a, { emit: m }) {
    const t = a, n = m, y = Pe();
    function p(A, c) {
      return y + "-" + A.code + "-" + c;
    }
    const $ = F(() => t.schema.access.admin), f = F(() => (t.draft.families ?? []).filter((A) => A.code !== "generic")), g = F(() => {
      const A = new Set(t.draft.plugins?.map((c) => c.use));
      return Object.entries(t.schema.attributes).filter(([, c]) => c.plugin && A.has(c.plugin));
    }), T = F(() => {
      const A = (t.draft.aspects ?? []).map((k) => k.namespace), c = [...new Set(g.value.map(([k]) => k.split(".")[0]))];
      return [...A, ...c.filter((k) => !A.includes(k))].map((k) => ({ value: k, label: E(k) }));
    });
    function I(A) {
      const c = T.value, k = (A.aspects ?? []).filter((q) => !c.some((B) => B.value === q));
      return [...c, ...k.map((q) => ({ value: q, label: E(q) }))];
    }
    const H = F(() => new Map(t.options.types.map((A) => [A.id, A.form])));
    function Y(A, c = []) {
      const k = /* @__PURE__ */ new Map();
      return [.../* @__PURE__ */ new Set([...A, ...c])].map((B) => {
        const [ie, X] = B.split(".", 2), be = E(X ?? ie);
        return k.set(be, (k.get(be) ?? 0) + 1), { value: B, label: be, group: X ? E(ie) : void 0 };
      }).map(({ value: B, label: ie, group: X }) => ({
        value: B,
        label: ie,
        detail: k.get(ie) > 1 ? X : void 0
      }));
    }
    const j = F(() => {
      const A = /* @__PURE__ */ new Map();
      function c(k, q, B = [], ie = "one") {
        const X = !!q && q !== "text" && q !== "record" && B.length === 0 && ie === "one";
        A.set(k, X);
      }
      for (const k of t.draft.aspects ?? [])
        for (const q of k.attributes ?? []) {
          const B = k.namespace + "." + q.code;
          c(B, H.value.get(q.type), q.scope, q.cardinality);
        }
      for (const [k, q] of g.value) c(k, q.form, q.scope, q.cardinality);
      return A;
    });
    function d(A) {
      return [...j.value.keys()].filter((c) => A.aspects?.includes(c.split(".")[0]));
    }
    function h(A, c, k) {
      const q = c[k] ?? [], B = new Set(D(A).flatMap((X) => [...X.axes ?? [], ...X.own ?? []])), ie = d(A).filter((X) => q.includes(X) || !B.has(X) && (k === "own" || j.value.get(X)));
      return Y(ie, q);
    }
    const r = F(() => t.draft.channels ?? []);
    function N(A, c) {
      return r.value.filter((k) => (!k.families?.length || k.families.includes(A.code)) && (!c || k.requirements?.includes(c))).map((k) => E(k.id));
    }
    const te = F(() => t.draft.dimensions ?? []), Q = K({});
    function le(A) {
      (t.draft.families ??= []).push({ code: A, aspects: [] }), Q.value[A] = !0;
    }
    function ne(A) {
      t.draft.families.splice(t.draft.families.indexOf(A), 1), t.schema.declaration.families?.some((c) => c.code === A.code) && n("remove", "families", A.code);
    }
    function D(A) {
      return A.variation ?? [];
    }
    function z(A) {
      return D(A).map((c) => ({
        level: c,
        axes: h(A, c, "axes"),
        own: h(A, c, "own")
      }));
    }
    function P(A) {
      (A.variation ??= []).push({ axes: [] });
    }
    function Z(A) {
      return A.requirements ?? [];
    }
    function L(A, c) {
      (A.requirements ??= []).push({ id: c, require: [] });
    }
    function J(A, c) {
      return A.context?.[c] ?? "";
    }
    function R(A, c, k) {
      const q = { ...A.context ?? {} };
      k ? q[c] = k : delete q[c], Object.keys(q).length ? A.context = q : delete A.context;
    }
    return (A, c) => (e(), i("div", un, [
      b(Le, {
        count: f.value.length,
        columns: ["details"]
      }, $e({
        default: w(() => [
          (e(!0), i(M, null, se(f.value, (k) => (e(), O(Ee, {
            "route-section": "families",
            "route-id": k.code,
            key: k.code,
            open: Q.value[k.code],
            "onUpdate:open": (q) => Q.value[k.code] = q,
            title: s(E)(k.code)
          }, {
            details: w(() => [
              l("span", cn, _(d(k).length) + " fields", 1),
              D(k).length ? (e(), O(s(_e), {
                key: 0,
                severity: "secondary",
                value: D(k).length + (D(k).length === 1 ? " variant level" : " variant levels")
              }, null, 8, ["value"])) : v("", !0),
              l("span", mn, _(N(k).join(", ") || "No release channels"), 1)
            ]),
            default: w(() => [
              l("div", pn, [
                l("div", vn, [
                  l("div", fn, [
                    l("div", bn, [
                      l("label", {
                        id: p(k, "groups")
                      }, "Field groups", 8, yn)
                    ]),
                    l("p", {
                      id: p(k, "groups-help"),
                      class: "muted small pim-axis-help"
                    }, "Choose the groups that appear on this family’s product forms.", 8, gn),
                    b(s(aa), {
                      disabled: !$.value,
                      "aria-labelledby": p(k, "groups"),
                      "aria-describedby": p(k, "groups-help"),
                      "model-value": k.aspects ?? [],
                      options: I(k),
                      "option-label": "label",
                      "option-value": "value",
                      placeholder: "Choose field groups",
                      display: "chip",
                      "append-to": "self",
                      "onUpdate:modelValue": (q) => s(Ge)(k, "aspects", q)
                    }, null, 8, ["disabled", "aria-labelledby", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])
                  ]),
                  k.aspects?.length ? (e(), O(s(G), {
                    key: 0,
                    type: "button",
                    label: "View family fields",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (q) => n("fields", k.code)
                  }, null, 8, ["onClick"])) : v("", !0)
                ])
              ]),
              l("div", hn, [
                c[4] || (c[4] = l("header", { class: "pim-aspect-head" }, [
                  l("h3", null, "Variants")
                ], -1)),
                c[5] || (c[5] = l("p", { class: "muted small pim-axis-help" }, "Choose what makes one variant different from another. Each field can be used once.", -1)),
                l("div", kn, [
                  (e(!0), i(M, null, se(z(k), ({ level: q, axes: B, own: ie }, X) => (e(), i("div", {
                    key: X,
                    class: "pim-level"
                  }, [
                    l("div", _n, [
                      l("strong", null, "Level " + _(X + 1), 1),
                      $.value ? (e(), O(s(G), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove level",
                        onClick: (be) => D(k).splice(X, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: w(() => [
                          b(s(oe), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : v("", !0)
                    ]),
                    l("div", wn, [
                      l("div", $n, [
                        l("div", Cn, [
                          l("label", {
                            id: p(k, X + "-axes")
                          }, "Distinguish variants by", 8, xn)
                        ]),
                        c[1] || (c[1] = l("p", { class: "muted small pim-axis-help" }, "Use a field with a single value and no dimensions, such as Integer. Text and record fields are excluded.", -1)),
                        $.value && !B.length ? (e(), i(M, { key: 0 }, [
                          c[0] || (c[0] = l("p", { class: "muted small pim-axis-help" }, "No eligible field is available in this family. Choose its field group above, or create the field first and choose its group when you return.", -1)),
                          b(s(G), {
                            type: "button",
                            label: "Create a field in Fields",
                            severity: "secondary",
                            outlined: "",
                            size: "small",
                            class: "pim-form-action",
                            onClick: (be) => n("variant-field", k.code)
                          }, null, 8, ["onClick"])
                        ], 64)) : (e(), O(Te, {
                          key: 1,
                          disabled: !$.value,
                          dropdown: "",
                          labelledby: p(k, X + "-axes"),
                          "model-value": q.axes ?? [],
                          options: B,
                          placeholder: "Choose a field",
                          "onUpdate:modelValue": (be) => q.axes = be
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"]))
                      ]),
                      l("div", Vn, [
                        l("div", Un, [
                          l("label", {
                            id: p(k, X + "-owned")
                          }, "Other fields edited here", 8, Sn)
                        ]),
                        c[2] || (c[2] = l("p", { class: "muted small pim-axis-help" }, "Other fields you edit at this level.", -1)),
                        b(Te, {
                          disabled: !$.value,
                          dropdown: "",
                          labelledby: p(k, X + "-owned"),
                          "model-value": q.own ?? [],
                          options: ie,
                          placeholder: "Add a field",
                          "onUpdate:modelValue": (be) => be.length ? q.own = be : delete q.own
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  $.value ? (e(), O(s(G), {
                    key: 0,
                    type: "button",
                    class: "pim-add-level",
                    onClick: (q) => P(k),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      b(s(oe), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      c[3] || (c[3] = W(" Add level", -1))
                    ]),
                    _: 1
                  }, 8, ["onClick"])) : v("", !0)
                ])
              ]),
              l("div", jn, [
                c[8] || (c[8] = l("header", { class: "pim-family-requirements-head" }, [
                  l("h3", null, "Release requirements"),
                  l("p", { class: "muted small" }, "Choose what products need before they can be released to a channel.")
                ], -1)),
                l("div", An, [
                  (e(!0), i(M, null, se(Z(k), (q, B) => (e(), i("div", {
                    key: q.id,
                    class: "pim-level"
                  }, [
                    l("div", In, [
                      l("div", null, [
                        l("strong", null, _(s(E)(q.id)), 1),
                        l("p", Rn, _(N(k, q.id).join(", ") || "Unused by channels"), 1)
                      ]),
                      $.value ? (e(), O(s(G), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove requirement",
                        onClick: (ie) => Z(k).splice(B, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: w(() => [
                          b(s(oe), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : v("", !0)
                    ]),
                    l("div", On, [
                      (e(!0), i(M, null, se(te.value, (ie) => (e(), i("div", {
                        key: ie.name,
                        class: "pim-f pim-w-third"
                      }, [
                        l("div", Tn, [
                          l("label", {
                            id: p(k, q.id + "-context-" + ie.name)
                          }, _(s(E)(ie.name)), 9, Pn)
                        ]),
                        b(s(Ue), {
                          disabled: !$.value,
                          "aria-labelledby": p(k, q.id + "-context-" + ie.name),
                          "model-value": J(q, ie.name),
                          "onUpdate:modelValue": (X) => R(q, ie.name, X),
                          options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ...ie.members.map((X) => ({ value: X, label: String(X) }))],
                          "option-label": "label",
                          "option-value": "value",
                          appendTo: "self"
                        }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                      ]))), 128)),
                      l("div", qn, [
                        l("div", Dn, [
                          l("label", {
                            id: p(k, q.id + "-required")
                          }, "Required", 8, Fn)
                        ]),
                        c[6] || (c[6] = l("p", { class: "muted small pim-axis-help" }, "These fields must have a value.", -1)),
                        b(Te, {
                          disabled: !$.value,
                          dropdown: "",
                          labelledby: p(k, q.id + "-required"),
                          "model-value": q.require ?? [],
                          placeholder: "Add a required field",
                          options: Y(d(k), q.require),
                          "onUpdate:modelValue": (ie) => s(Ge)(q, "require", ie)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]),
                      l("div", Nn, [
                        l("div", zn, [
                          l("label", {
                            id: p(k, q.id + "-authored")
                          }, "Entered for this context", 8, Bn)
                        ]),
                        c[7] || (c[7] = l("p", { class: "muted small pim-axis-help" }, "These fields need a value set directly for the selected context.", -1)),
                        b(Te, {
                          disabled: !$.value,
                          dropdown: "",
                          labelledby: p(k, q.id + "-authored"),
                          "model-value": q.authored ?? [],
                          placeholder: "Add a field to author",
                          options: Y(d(k), q.authored),
                          "onUpdate:modelValue": (ie) => s(Ge)(q, "authored", ie)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  $.value ? (e(), O(Be, {
                    key: 0,
                    label: "Requirement name",
                    action: "Add requirement",
                    "from-name": "",
                    existing: Z(k).map((q) => q.id),
                    onAdd: (q) => L(k, q)
                  }, null, 8, ["existing", "onAdd"])) : v("", !0)
                ])
              ]),
              $.value ? (e(), i("div", Ln, [
                b(s(G), {
                  type: "button",
                  label: "Remove family",
                  severity: "danger",
                  text: "",
                  size: "small",
                  onClick: (q) => ne(k)
                }, null, 8, ["onClick"])
              ])) : v("", !0)
            ]),
            _: 2
          }, 1032, ["route-id", "open", "onUpdate:open", "title"]))), 128))
        ]),
        _: 2
      }, [
        $.value ? {
          name: "head",
          fn: w(() => [
            b(Be, {
              label: "Family name",
              action: "Add family",
              "from-name": "",
              existing: f.value.map((k) => k.code),
              onAdd: le
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])
    ]));
  }
}), Mn = ["inert"], Wn = {
  key: 0,
  class: "row wrap"
}, Hn = {
  key: 2,
  class: "small muted"
}, Jn = { class: "pim-f" }, Kn = ["for"], Gn = ["id"], Yn = /* @__PURE__ */ pe({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(a, { emit: m }) {
    const t = a, n = m, y = K(!1), p = K(""), $ = Pe(), f = Pe(), g = K({});
    let T = 0;
    ye(() => t.modelValue, async (d) => {
      const h = ++T;
      try {
        const r = await sa(t.catalogId ?? "", d);
        h === T && (g.value = r);
      } catch {
        h === T && (g.value = {});
      }
    }, { immediate: !0, deep: !0 }), tl(() => {
      T++;
    });
    function I(d) {
      return g.value[d] ?? ce(d, "Person");
    }
    ea(async () => {
      try {
        await La("wc-principal-picker"), y.value = !0;
      } catch {
        y.value = !1;
      }
    });
    function H(d) {
      t.disabled || !d.trim() || t.modelValue.includes(d.trim()) || (n("update:modelValue", [...t.modelValue, d.trim()]), p.value = "");
    }
    function Y(d) {
      const h = d.detail;
      if (!h || typeof h != "object") return;
      const r = h, N = r.principal_id ?? r.id;
      typeof N == "string" && H(N);
    }
    function j(d) {
      t.disabled || n("update:modelValue", t.modelValue.filter((h) => h !== d));
    }
    return (d, h) => (e(), i("div", {
      class: "pim-principal-list",
      inert: a.disabled || void 0
    }, [
      a.modelValue.length ? (e(), i("div", Wn, [
        (e(!0), i(M, null, se(a.modelValue, (r) => (e(), O(s(_e), {
          key: r,
          severity: "secondary"
        }, {
          default: w(() => [
            l("span", null, _(I(r)), 1),
            b(s(G), {
              text: "",
              size: "small",
              disabled: a.disabled,
              "aria-label": "Remove " + I(r),
              onClick: (N) => j(r)
            }, {
              default: w(() => [
                b(s(oe), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : v("", !0),
      y.value ? (e(), i("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: ze(Y, ["stop"])
      }, null, 32)) : (e(), i("span", Hn, "The person picker is unavailable.")),
      l("div", Jn, [
        l("label", {
          for: s($),
          class: "small muted"
        }, "Service account ID", 8, Kn),
        b(s(al), {
          modelValue: p.value,
          "onUpdate:modelValue": h[0] || (h[0] = (r) => p.value = r),
          id: s($),
          "aria-describedby": s(f),
          disabled: a.disabled,
          onKeydown: h[1] || (h[1] = rl(ze((r) => H(p.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "id", "aria-describedby", "disabled"]),
        l("p", {
          id: s(f),
          class: "small muted pim-axis-help"
        }, "Ask whoever manages the service account for its principal ID.", 8, Gn)
      ]),
      b(s(G), {
        type: "button",
        severity: "secondary",
        outlined: "",
        size: "small",
        class: "pim-form-action",
        disabled: a.disabled || !p.value.trim(),
        onClick: h[2] || (h[2] = (r) => H(p.value))
      }, {
        default: w(() => [
          b(s(oe), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          h[3] || (h[3] = W(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, Mn));
  }
}), Zn = { class: "pim-stack" }, Qn = { class: "muted small" }, Xn = { class: "muted small" }, eo = { class: "pim-fields" }, lo = { class: "pim-f pim-w-half" }, ao = { class: "pim-f-label" }, to = ["id"], so = { class: "muted small pim-axis-help" }, io = { class: "pim-f pim-w-half" }, no = { class: "pim-f-label" }, oo = ["id"], ro = { class: "muted small" }, uo = { class: "muted small" }, co = { class: "pim-fields" }, mo = ["aria-labelledby", "aria-describedby"], po = { class: "pim-f-label" }, vo = ["id"], fo = ["id"], bo = { key: 1 }, yo = { class: "pim-f pim-w-half" }, go = { class: "pim-f-label" }, ho = ["id"], ko = { class: "pim-f pim-w-full" }, _o = { class: "mono" }, wo = { class: "pim-f pim-w-half" }, $o = { class: "pim-f-label" }, Co = ["id"], xo = { class: "pim-f pim-w-half" }, Vo = { class: "pim-f-label" }, Uo = ["for"], So = { class: "row" }, jo = /* @__PURE__ */ pe({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {},
    view: {}
  },
  emits: ["remove", "requirements"],
  setup(a, { emit: m }) {
    const t = a, n = m, y = Pe();
    function p(le, ne) {
      return y + "-" + le + "-" + ne;
    }
    const $ = F(() => t.schema.access.admin), f = F(() => t.draft.channels ?? []), g = F(() => t.draft.sources ?? []), T = F(() => {
      const le = /* @__PURE__ */ new Map();
      for (const ne of t.draft.families ?? [])
        for (const { id: D } of ne.requirements ?? []) {
          const z = le.get(D) ?? [];
          z.push(E(ne.code)), le.set(D, z);
        }
      return new Map([...le].map(([ne, D]) => [ne, E(ne) + " · " + D.join(", ")]));
    }), I = F(() => [...T.value].map(([le, ne]) => ({ value: le, label: ne }))), H = F(() => (t.draft.families ?? []).filter((le) => le.code !== "generic").map((le) => ({ value: le.code, label: E(le.code) }))), Y = F(() => (t.draft.aspects ?? []).map((le) => ({ value: le.namespace, label: E(le.namespace) }))), j = K({}), d = K({});
    function h(le) {
      const ne = le.principals?.length ?? 0;
      return ne ? ne + (ne === 1 ? " allowed account" : " allowed accounts") : "Any catalog writer";
    }
    function r(le) {
      (t.draft.channels ??= []).push({ id: le, requirements: [] }), j.value[le] = !0;
    }
    function N(le) {
      f.value.splice(f.value.indexOf(le), 1), t.schema.declaration.channels?.some((ne) => ne.id === le.id) && n("remove", "channels", le.id);
    }
    function te(le) {
      (t.draft.sources ??= []).push({ id: le, ordering: "none", writes: [] }), d.value[le] = !0;
    }
    function Q(le) {
      g.value.splice(g.value.indexOf(le), 1), t.schema.declaration.sources?.some((ne) => ne.id === le.id) && n("remove", "sources", le.id);
    }
    return (le, ne) => (e(), i("div", Zn, [
      a.view !== "sources" ? (e(), O(Le, {
        key: 0,
        count: f.value.length,
        columns: ["details"]
      }, $e({
        default: w(() => [
          (e(!0), i(M, null, se(f.value, (D) => (e(), O(Ee, {
            key: D.id,
            open: j.value[D.id],
            "onUpdate:open": (z) => j.value[D.id] = z,
            "route-section": "channels",
            "route-id": D.id,
            title: s(E)(D.id)
          }, $e({
            details: w(() => [
              l("span", Qn, _(D.families?.length ? D.families.map(s(E)).join(", ") : "All families"), 1),
              l("span", Xn, _(D.requirements?.length ? D.requirements.map((z) => T.value.get(z) ?? s(E)(z)).join(", ") : "No release requirements"), 1)
            ]),
            default: w(() => [
              l("div", eo, [
                l("div", lo, [
                  l("div", ao, [
                    l("label", {
                      id: p(D.id, "requirements")
                    }, "Release requirements", 8, to)
                  ]),
                  l("p", so, _(I.value.length ? "Choose what products must meet before release to this channel." : "No family has defined a release requirement yet."), 1),
                  I.value.length || D.requirements?.length ? (e(), O(Te, {
                    key: 0,
                    disabled: !$.value,
                    labelledby: p(D.id, "requirements"),
                    "model-value": D.requirements ?? [],
                    options: I.value,
                    "onUpdate:modelValue": (z) => s(Ge)(D, "requirements", z)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])) : v("", !0),
                  $.value ? (e(), O(s(G), {
                    key: 1,
                    type: "button",
                    label: "Create a requirement in Families",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    class: "pim-form-action",
                    onClick: (z) => n("requirements", D.id)
                  }, null, 8, ["onClick"])) : v("", !0)
                ]),
                l("div", io, [
                  l("div", no, [
                    l("label", {
                      id: p(D.id, "families")
                    }, "Families", 8, oo)
                  ]),
                  ne[0] || (ne[0] = l("p", { class: "muted small pim-axis-help" }, "Applies to every family unless you choose specific families.", -1)),
                  b(Te, {
                    disabled: !$.value,
                    labelledby: p(D.id, "families"),
                    "model-value": D.families ?? [],
                    options: H.value,
                    "onUpdate:modelValue": (z) => s(Ge)(D, "families", z)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            $.value ? {
              name: "actions",
              fn: w(() => [
                b(s(G), {
                  type: "button",
                  onClick: (z) => N(D),
                  "aria-label": "Remove " + s(E)(D.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    b(s(oe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["onClick", "aria-label"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["open", "onUpdate:open", "route-id", "title"]))), 128))
        ]),
        _: 2
      }, [
        $.value ? {
          name: "head",
          fn: w(() => [
            b(Be, {
              label: "Channel name",
              action: "Add channel",
              "from-name": "",
              existing: f.value.map((D) => D.id),
              onAdd: r
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])) : v("", !0),
      a.view !== "channels" ? (e(), O(Le, {
        key: 1,
        count: g.value.length,
        columns: ["details"]
      }, $e({
        default: w(() => [
          (e(!0), i(M, null, se(g.value, (D) => (e(), O(Ee, {
            key: D.id,
            open: d.value[D.id],
            "onUpdate:open": (z) => d.value[D.id] = z,
            "route-section": "sources",
            "route-id": D.id,
            title: s(E)(D.id)
          }, $e({
            details: w(() => [
              l("span", ro, _(h(D)), 1),
              l("span", uo, _(D.writes?.length ? D.writes.map(s(E)).join(", ") : "No writable field groups"), 1)
            ]),
            default: w(() => [
              l("div", co, [
                l("div", {
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": p(D.id, "people"),
                  "aria-describedby": p(D.id, "people-help")
                }, [
                  l("div", po, [
                    l("label", {
                      id: p(D.id, "people")
                    }, "People and service accounts", 8, vo)
                  ]),
                  l("p", {
                    id: p(D.id, "people-help"),
                    class: "muted small pim-axis-help"
                  }, "If you leave this empty, anyone who can write to the catalog can use this source.", 8, fo),
                  $.value ? (e(), O(Yn, {
                    key: 0,
                    "catalog-id": a.catalogId,
                    "model-value": D.principals ?? [],
                    "onUpdate:modelValue": (z) => s(Ge)(D, "principals", z)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])) : (e(), i("span", bo, _(h(D)), 1))
                ], 8, mo),
                l("div", yo, [
                  l("div", go, [
                    l("label", {
                      id: p(D.id, "writes")
                    }, "Field groups it can update", 8, ho)
                  ]),
                  ne[1] || (ne[1] = l("p", { class: "muted small pim-axis-help" }, "If you leave this empty, this source cannot update any field values.", -1)),
                  b(Te, {
                    disabled: !$.value,
                    labelledby: p(D.id, "writes"),
                    "model-value": D.writes ?? [],
                    options: Y.value,
                    "onUpdate:modelValue": (z) => s(Ge)(D, "writes", z)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                l("div", ko, [
                  ne[2] || (ne[2] = l("div", { class: "pim-f-label" }, [
                    l("strong", null, "Source identifier")
                  ], -1)),
                  ne[3] || (ne[3] = l("p", { class: "muted small pim-axis-help" }, [
                    W("Send this exact identifier in the "),
                    l("code", null, "source"),
                    W(" field of the update request.")
                  ], -1)),
                  l("div", null, [
                    l("code", _o, _(D.id), 1)
                  ])
                ]),
                l("div", wo, [
                  l("div", $o, [
                    l("label", {
                      id: p(D.id, "ordering")
                    }, "Handle incoming updates", 8, Co)
                  ]),
                  ne[4] || (ne[4] = l("p", { class: "muted small pim-axis-help" }, "Use the sender’s sequence numbers to prevent late deliveries from overwriting newer values.", -1)),
                  b(s(Ue), {
                    disabled: !$.value,
                    "aria-labelledby": p(D.id, "ordering"),
                    "model-value": D.ordering ?? "none",
                    "onUpdate:modelValue": (z) => D.ordering = z,
                    options: [{ value: "none", label: "Use arrival order" }, { value: "sequence", label: "Use the source’s sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                l("div", xo, [
                  l("div", Vo, [
                    l("label", {
                      for: p(D.id, "audit")
                    }, "Track value changes", 8, Uo)
                  ]),
                  l("div", So, [
                    b(s(ul), {
                      disabled: !$.value,
                      "input-id": p(D.id, "audit"),
                      "model-value": D.audit !== !1,
                      "onUpdate:modelValue": (z) => z ? delete D.audit : D.audit = !1
                    }, null, 8, ["disabled", "input-id", "model-value", "onUpdate:modelValue"]),
                    l("span", null, _(D.audit === !1 ? "Off for this source" : "Follow catalog audit settings"), 1)
                  ])
                ])
              ])
            ]),
            _: 2
          }, [
            $.value ? {
              name: "actions",
              fn: w(() => [
                b(s(G), {
                  type: "button",
                  onClick: (z) => Q(D),
                  "aria-label": "Remove " + s(E)(D.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    b(s(oe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["onClick", "aria-label"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["open", "onUpdate:open", "route-id", "title"]))), 128))
        ]),
        _: 2
      }, [
        $.value ? {
          name: "head",
          fn: w(() => [
            b(Be, {
              label: "Source name",
              action: "Add source",
              "from-name": "",
              existing: g.value.map((D) => D.id),
              onAdd: te
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])) : v("", !0)
    ]));
  }
}), Ao = {
  failed: { label: "Setup failed", severity: "danger" },
  paused: { label: "Background update paused", severity: "warn" },
  degraded: { label: "Degraded", severity: "warn" },
  catchingUp: { label: "Catching up", severity: "info" },
  config: { label: "Configuration needed", severity: "warn" },
  reset: { label: "Reset required", severity: "warn" },
  uninstalled: { label: "Uninstalled · still referenced", severity: "warn" },
  pending: { label: "Setting up", severity: "info" }
};
function oa(a, m) {
  return !a.parked && (a.bootstrapping || a.last_seq < m);
}
function Io(a, m) {
  return !a.active || !a.installed || a.problem || a.lifecycle.state === "failed" ? !1 : a.lifecycle.state === "pending" || Object.values(a.projections).some((t) => oa(t, m));
}
function Ro(a, m) {
  const t = a.problem ?? a.lifecycle.error, n = Object.entries(a.projections), y = n.find(([, $]) => $.parked) ?? n.find(([, $]) => $.error) ?? n.find(([, $]) => oa($, m));
  let p;
  return a.active && !a.installed ? p = "uninstalled" : t?.code === "plugin_config_invalid" ? p = "config" : t?.code === "plugin_projection_history_pruned" ? p = "reset" : t || a.lifecycle.state === "failed" ? p = "failed" : a.active && y?.[1].parked ? p = "paused" : a.active && y?.[1].error ? p = "degraded" : a.active && y ? p = "catchingUp" : a.active && a.lifecycle.state === "pending" && (p = "pending"), p ? { kind: p, ...Ao[p], error: t, projection: y } : void 0;
}
function Oo(a) {
  return (a.problem ?? a.lifecycle.error)?.code === "plugin_interface_version_unsupported";
}
const To = { class: "pim-stack" }, Po = { class: "pim-bsection-head" }, qo = { class: "muted small" }, Do = {
  key: 0,
  class: "pim-aspect muted"
}, Fo = {
  key: 0,
  class: "muted small"
}, No = { class: "pim-stack pim-plugin-recovery" }, zo = {
  key: 0,
  class: "muted small"
}, Bo = {
  key: 1,
  class: "muted small"
}, Lo = { key: 0 }, Eo = { key: 1 }, Mo = { key: 0 }, Wo = { key: 0 }, Ho = { key: 0 }, Jo = { key: 1 }, Ko = { key: 2 }, Go = { key: 3 }, Yo = { key: 0 }, Zo = { class: "pim-stack" }, Qo = { key: 0 }, Xo = { key: 1 }, ed = {
  key: 0,
  class: "pim-ia-action"
}, ld = {
  key: 0,
  class: "pim-ia-dialog"
}, ad = { class: "pim-ia-dialog-head" }, td = { key: 1 }, sd = { key: 2 }, id = { class: "row pim-ia-dialog-actions" }, nd = {
  key: 0,
  class: "pim-aspect muted"
}, od = { class: "row wrap muted small" }, dd = /* @__PURE__ */ pe({
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
  setup(a, { emit: m }) {
    const t = a, n = m, y = /* @__PURE__ */ new Map([
      ["eq", "Equals"],
      ["in", "Is one of"],
      ["gt", "Greater than"],
      ["gte", "At least"],
      ["lt", "Less than"],
      ["lte", "At most"]
    ]), p = K({});
    ye(() => t.refusal, (z) => {
      z && (p.value[z.plugin] = !0);
    }, { immediate: !0 });
    const $ = K(), f = F(() => d.value.find((z) => z.plugin.plugin === $.value)), g = F(() => f.value?.plugin), T = F(() => t.options.plugins.filter((z) => z.installed).length), I = F(() => t.schema.access.admin), H = F(() => t.draft.plugins ?? []), Y = F(() => new Map(t.schema.plugins.map((z) => [z.plugin, z]))), j = F(() => {
      const z = /* @__PURE__ */ new Map();
      for (const [P, Z] of Object.entries(t.schema.attributes)) {
        if (!Z.plugin) continue;
        const L = z.get(Z.plugin) ?? [];
        L.push(E(P)), z.set(Z.plugin, L);
      }
      return z;
    }), d = F(() => t.options.plugins.map((z) => {
      const P = Y.value.get(z.plugin) ?? z, Z = Ro(P, t.schema.as_of), L = H.value.some((R) => R.use === P.plugin), J = t.refusal?.plugin === P.plugin ? t.refusal : void 0;
      return {
        option: z,
        plugin: P,
        status: Z,
        chosen: L,
        refusal: J,
        title: ce(P.title ?? z.title, P.installed ? "Plugin" : "Unavailable plugin"),
        label: J ? "Configuration needed" : !P.active && Z?.kind === "failed" ? "Unavailable" : Z?.label ?? (L ? P.active ? "Enabled" : "Will enable on apply" : P.active ? "Will disable on apply" : "Disabled"),
        severity: J ? "warn" : Z?.severity ?? (L ? "success" : "secondary")
      };
    }));
    function h(z, P) {
      const Z = P.map((L) => y.get(L)).filter(Boolean);
      return [E(z), Z.join(", ")].filter(Boolean).join(" · ");
    }
    function r(z, P) {
      P && !H.value.some((Z) => Z.use === z) && (t.draft.plugins ??= []).push({ use: z }), P || (t.draft.plugins = H.value.filter((Z) => Z.use !== z), delete t.pluginConfigs[z], t.refusal?.plugin === z && n("clearRefusal"), Y.value.get(z)?.active && n("remove", "plugins", z));
    }
    function N(z, P) {
      p.value[z] = !0, t.pluginConfigs[z] = P, t.refusal?.plugin === z && n("clearRefusal");
    }
    const te = F(() => t.draft.scopes ?? []);
    function Q(z) {
      return te.value.includes(z.id);
    }
    function le(z, P) {
      P && !Q(z) && (t.draft.scopes ??= []).push(z.id), !P && Q(z) && (te.value.splice(te.value.indexOf(z.id), 1), t.schema.declaration.scopes?.includes(z.id) && n("remove", "scopes", z.id));
    }
    const ne = F(() => {
      const z = g.value;
      if (!z) return [];
      const P = z.references;
      return [
        { label: "Fields", items: (P?.fields ?? Object.entries(t.schema.attributes).filter(([, L]) => L.plugin === z.plugin).map(([L]) => L)).map((L) => ({ id: L, title: ce(E(L), "Field") })) },
        { label: "Product filter sets", items: (P?.scopes ?? []).map((L) => ({
          id: L,
          title: ce(t.options.scopes.find((J) => J.id === L)?.title, "Unavailable filter set")
        })) },
        { label: "Catalog app binding", items: (P?.shell_bindings ?? []).map((L) => ({ id: L, title: "Catalog app" })) },
        { label: "Readiness checks", items: (P?.checks ?? []).map((L) => ({ id: L, title: "Readiness check" })) },
        { label: "Dependent plugins", items: (P?.plugins ?? []).map((L) => ({
          id: L,
          title: ce(Y.value.get(L)?.title, "Dependent plugin")
        })) }
      ].filter((L) => L.items.length);
    });
    function D(z) {
      for (const P of z.references?.scopes ?? [])
        te.value.includes(P) && (t.draft.scopes = te.value.filter((Z) => Z !== P), n("remove", "scopes", P));
      $.value = void 0, r(z.plugin, !1), n("review");
    }
    return (z, P) => (e(), i("div", To, [
      b(Le, {
        count: d.value.length,
        columns: ["details"]
      }, {
        head: w(() => [
          l("header", Po, [
            P[6] || (P[6] = l("h3", null, "Plugins", -1)),
            l("span", qo, _(T.value) + " installed", 1)
          ])
        ]),
        default: w(() => [
          d.value.length === 0 ? (e(), i("div", Do, "No plugin is installed.")) : v("", !0),
          (e(!0), i(M, null, se(d.value, ({ option: Z, plugin: L, status: J, chosen: R, title: A, label: c, severity: k, refusal: q }) => (e(), O(Ee, {
            "route-section": "plugins",
            "route-id": L.plugin,
            key: L.plugin,
            title: A,
            open: p.value[L.plugin] ?? !!(L.active && J && J.kind !== "pending"),
            "onUpdate:open": (B) => p.value[L.plugin] = B
          }, $e({
            details: w(() => [
              b(s(_e), {
                severity: k,
                value: c
              }, null, 8, ["severity", "value"]),
              !J && Z.description ? (e(), i("span", Fo, _(s(ce)(Z.description, "Adds capabilities to this catalog.")), 1)) : v("", !0)
            ]),
            default: w(() => [
              l("div", No, [
                j.value.get(L.plugin)?.length ? (e(), i("p", zo, " Adds fields for " + _(j.value.get(L.plugin)?.join(", ")) + ". ", 1)) : v("", !0),
                L.active && J?.kind === "failed" && J.projection?.[1].parked ? (e(), i("p", Bo, " Background update: Paused ")) : v("", !0),
                J?.kind === "failed" ? (e(), i(M, { key: 2 }, [
                  b(s(Se), {
                    severity: "warn",
                    role: "alert"
                  }, {
                    default: w(() => [
                      s(Oo)(L) ? (e(), i(M, { key: 0 }, [
                        W("This package uses a plugin interface this deployment cannot run. Restore a compatible package to use this plugin.")
                      ], 64)) : (e(), i(M, { key: 1 }, [
                        W("The catalog could not set up this plugin. Check the status after resolving the setup problem.")
                      ], 64))
                    ]),
                    _: 2
                  }, 1024),
                  b(Ve, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: w(() => [
                      l("p", null, [
                        P[7] || (P[7] = W("Plugin ", -1)),
                        l("code", null, _(L.plugin), 1)
                      ]),
                      J.error?.message ? (e(), i("p", Lo, _(J.error.message), 1)) : v("", !0),
                      J.error?.code ? (e(), i("p", Eo, [
                        l("code", null, _(J.error.code), 1)
                      ])) : v("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  I.value && L.references ? (e(), O(s(G), {
                    key: 0,
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (B) => $.value = L.plugin
                  }, null, 8, ["onClick"])) : (e(), O(s(G), {
                    key: 1,
                    label: "Check status",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: P[0] || (P[0] = (B) => n("refresh"))
                  }))
                ], 64)) : J?.kind === "reset" ? (e(), i(M, { key: 3 }, [
                  b(s(Se), { severity: "warn" }, {
                    default: w(() => [
                      P[8] || (P[8] = W(" The event history this background update needs was removed. ", -1)),
                      J.error?.max_pruned_seq !== void 0 ? (e(), i("p", Mo, "Earliest retained position " + _(J.error.max_pruned_seq + 1) + ".", 1)) : v("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  b(Ve, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: w(() => [
                      l("p", null, [
                        P[9] || (P[9] = W("Plugin ", -1)),
                        l("code", null, _(L.plugin), 1)
                      ]),
                      J.error?.projection ? (e(), i("p", Wo, [
                        P[10] || (P[10] = W("Background update ", -1)),
                        l("code", null, _(J.error.projection), 1)
                      ])) : v("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  I.value ? (e(), O(s(G), {
                    key: 0,
                    label: "Reset background updates",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: a.stale,
                    onClick: (B) => n("reset", L.plugin)
                  }, null, 8, ["disabled", "onClick"])) : v("", !0)
                ], 64)) : J?.projection && (J.kind === "paused" || J.kind === "degraded" || J.kind === "catchingUp") ? (e(), i(M, { key: 4 }, [
                  b(s(Se), {
                    severity: J.kind === "catchingUp" ? "info" : "warn"
                  }, {
                    default: w(() => [
                      J.projection[1].status === "paused" ? (e(), i("p", Ho, "This update was paused.")) : J.kind === "paused" ? (e(), i("p", Jo, "The background worker stopped.")) : J.kind === "degraded" ? (e(), i("p", Ko, "The background worker reported an error.")) : (e(), i("p", Go, "This update is processing catalog changes.")),
                      l("p", null, "Last applied position " + _(J.projection[1].last_seq) + ".", 1)
                    ]),
                    _: 2
                  }, 1032, ["severity"]),
                  b(Ve, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: w(() => [
                      l("p", null, [
                        P[11] || (P[11] = W("Background update ", -1)),
                        l("code", null, _(J.projection[0]), 1)
                      ]),
                      J.projection[1].error ? (e(), i("p", Yo, _(J.projection[1].error), 1)) : v("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  I.value && J.projection[1].status === "paused" && J.projection[1].cursor_id ? (e(), O(s(G), {
                    key: 0,
                    label: "Resume background update",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: a.stale,
                    onClick: (B) => n("resume", J.projection[1].cursor_id)
                  }, null, 8, ["disabled", "onClick"])) : J.kind === "paused" && I.value ? (e(), O(s(G), {
                    key: 1,
                    label: "Reset background updates",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: a.stale,
                    onClick: (B) => n("reset", L.plugin)
                  }, null, 8, ["disabled", "onClick"])) : (e(), O(s(G), {
                    key: 2,
                    label: "Check status",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: P[1] || (P[1] = (B) => n("refresh"))
                  }))
                ], 64)) : J?.kind === "uninstalled" ? (e(), i(M, { key: 5 }, [
                  b(s(Se), { severity: "warn" }, {
                    default: w(() => [...P[12] || (P[12] = [
                      W("The package was removed while it was still enabled for this catalog.", -1)
                    ])]),
                    _: 1
                  }),
                  b(s(G), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (B) => $.value = L.plugin
                  }, null, 8, ["onClick"])
                ], 64)) : v("", !0),
                L.installed && (!J || J.kind === "pending") ? (e(), O(Ve, {
                  key: 6,
                  class: "small pim-ia-disclosure",
                  label: "Technical details"
                }, {
                  default: w(() => [
                    l("dl", Zo, [
                      l("div", null, [
                        P[13] || (P[13] = l("dt", null, "Plugin ID", -1)),
                        l("dd", null, [
                          l("code", null, _(L.plugin), 1)
                        ])
                      ]),
                      (L.interface_version ?? Z.interface_version) != null ? (e(), i("div", Qo, [
                        P[14] || (P[14] = l("dt", null, "Interface version", -1)),
                        l("dd", null, _(L.interface_version ?? Z.interface_version), 1)
                      ])) : v("", !0),
                      P[16] || (P[16] = l("div", null, [
                        l("dt", null, "Configuration tool"),
                        l("dd", null, [
                          l("code", null, "PIMConfigurePlugin")
                        ])
                      ], -1)),
                      L.tools.length ? (e(), i("div", Xo, [
                        P[15] || (P[15] = l("dt", null, "Plugin tools", -1)),
                        l("dd", null, [
                          l("ul", null, [
                            (e(!0), i(M, null, se(L.tools, (B) => (e(), i("li", { key: B }, [
                              l("code", null, _(B), 1)
                            ]))), 128))
                          ])
                        ])
                      ])) : v("", !0)
                    ])
                  ]),
                  _: 2
                }, 1024)) : v("", !0),
                R && L.installed && J?.kind !== "failed" && J?.kind !== "uninstalled" ? (e(), i(M, { key: 7 }, [
                  b(Ol, {
                    disabled: !I.value,
                    schema: Z.config_schema,
                    "model-value": a.pluginConfigs[L.plugin] ?? L.config ?? {},
                    problem: J?.kind === "config" ? J.error : void 0,
                    "plugin-id": J?.kind === "config" ? L.plugin : void 0,
                    "problem-label": J?.error?.field && J.error.field !== "config" ? s(bl)(Z.config_schema, J.error.field) : void 0,
                    refusal: q ? s(bl)(Z.config_schema, q.field) + ": " + q.message : void 0,
                    "onUpdate:modelValue": (B) => N(L.plugin, B)
                  }, null, 8, ["disabled", "schema", "model-value", "problem", "plugin-id", "problem-label", "refusal", "onUpdate:modelValue"]),
                  I.value && L.active && (a.pluginConfigs[L.plugin] || J?.kind === "config") ? (e(), i("div", ed, [
                    b(s(G), {
                      disabled: a.stale || !a.pluginConfigs[L.plugin],
                      label: "Save configuration",
                      size: "small",
                      onClick: (B) => n("configure", L.plugin, a.pluginConfigs[L.plugin])
                    }, null, 8, ["disabled", "onClick"])
                  ])) : v("", !0)
                ], 64)) : v("", !0)
              ])
            ]),
            _: 2
          }, [
            I.value && L.installed && (!J || J.kind === "pending") ? {
              name: "actions",
              fn: w(() => [
                b(s(ul), {
                  "aria-label": "Enable " + A,
                  "model-value": R,
                  "onUpdate:modelValue": (B) => r(L.plugin, B)
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "title", "open", "onUpdate:open"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      b(fl, {
        visible: !!g.value,
        label: "Plugin references",
        onClose: P[5] || (P[5] = (Z) => $.value = void 0)
      }, {
        default: w(() => [
          f.value && g.value ? (e(), i("section", ld, [
            l("header", ad, [
              l("div", null, [
                P[17] || (P[17] = l("h2", null, "Plugin references", -1)),
                l("p", null, _(f.value.title), 1)
              ])
            ]),
            ne.value.length ? (e(), i(M, { key: 0 }, [
              P[18] || (P[18] = l("p", null, "Replace or remove these references before deactivating the plugin. You can also restore the package to keep using them.", -1)),
              (e(!0), i(M, null, se(ne.value, (Z) => (e(), i("div", {
                key: Z.label
              }, [
                l("h3", null, _(Z.label), 1),
                l("ul", null, [
                  (e(!0), i(M, null, se(Z.items, (L) => (e(), i("li", {
                    key: L.id
                  }, _(L.title), 1))), 128))
                ])
              ]))), 128))
            ], 64)) : (e(), i("p", td, "Use the catalog review to see what deactivating this plugin would change.")),
            g.value.references?.scopes.length && !g.value.references?.shell_bindings.length ? (e(), i("p", sd, "Reviewing removal also includes these product filter sets.")) : v("", !0),
            b(Ve, {
              class: "small pim-error-code pim-ia-disclosure",
              label: "Technical details"
            }, {
              default: w(() => [
                l("p", null, [
                  P[19] || (P[19] = W("Plugin ", -1)),
                  l("code", null, _(g.value.plugin), 1)
                ]),
                (e(!0), i(M, null, se(ne.value, (Z) => (e(), i("div", {
                  key: Z.label
                }, [
                  l("p", null, _(Z.label), 1),
                  l("ul", null, [
                    (e(!0), i(M, null, se(Z.items, (L) => (e(), i("li", {
                      key: L.id
                    }, [
                      l("code", null, _(L.id), 1)
                    ]))), 128))
                  ])
                ]))), 128))
              ]),
              _: 1
            }),
            l("div", id, [
              I.value && g.value.references?.shell_bindings.length ? (e(), O(s(G), {
                key: 0,
                label: "Clear catalog app binding",
                severity: "secondary",
                outlined: "",
                disabled: a.stale,
                onClick: P[2] || (P[2] = (Z) => n("clearShellBinding", g.value.references.shell_bindings[0]))
              }, null, 8, ["disabled"])) : I.value ? (e(), O(s(G), {
                key: 1,
                label: "Review removal",
                disabled: a.stale,
                onClick: P[3] || (P[3] = (Z) => D(g.value))
              }, null, 8, ["disabled"])) : v("", !0),
              b(s(G), {
                label: "Close",
                severity: "secondary",
                outlined: "",
                onClick: P[4] || (P[4] = (Z) => $.value = void 0)
              })
            ])
          ])) : v("", !0)
        ]),
        _: 1
      }, 8, ["visible"]),
      b(Le, {
        count: a.options.scopes.length,
        columns: ["details"]
      }, {
        head: w(() => [
          P[21] || (P[21] = l("header", { class: "pim-bsection-head" }, [
            l("h3", null, "Product filter sets"),
            l("span", { class: "muted small" }, "Choose additional ways to filter products.")
          ], -1)),
          b(Ve, {
            class: "small pim-ia-disclosure",
            label: "Filter set technical details"
          }, {
            default: w(() => [...P[20] || (P[20] = [
              l("p", null, [
                W("Product filter sets are "),
                l("code", null, "scopes"),
                W(" in "),
                l("code", null, "PIMQuery"),
                W(". Use the filter set ID in "),
                l("code", null, "scopes[].id"),
                W(".")
              ], -1)
            ])]),
            _: 1
          })
        ]),
        default: w(() => [
          a.options.scopes.length === 0 ? (e(), i("div", nd, "No product filter sets are available.")) : v("", !0),
          (e(!0), i(M, null, se(a.options.scopes, (Z) => (e(), O(Ee, {
            "route-section": "plugins",
            "route-id": "scope:" + Z.id,
            key: Z.id,
            title: s(ce)(Z.title, "Filter set")
          }, $e({
            details: w(() => [
              b(s(_e), {
                severity: Q(Z) ? "success" : "secondary",
                value: Q(Z) ? "Selected" : "Available"
              }, null, 8, ["severity", "value"])
            ]),
            default: w(() => [
              l("div", od, [
                P[22] || (P[22] = l("span", null, "Filters", -1)),
                (e(!0), i(M, null, se(Z.filters, (L, J) => (e(), O(s(_e), {
                  key: J,
                  class: "kx-tag-sm small",
                  severity: "secondary",
                  value: h(J, L.ops)
                }, null, 8, ["value"]))), 128)),
                l("span", null, _(s(E)(Z.access)) + " access required", 1)
              ]),
              b(Ve, {
                class: "small pim-ia-disclosure",
                label: "Technical details"
              }, {
                default: w(() => [
                  l("p", null, [
                    P[23] || (P[23] = W("Filter set ID ", -1)),
                    l("code", null, _(Z.id), 1)
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, [
            I.value ? {
              name: "actions",
              fn: w(() => [
                b(s(ul), {
                  "aria-label": "Use " + s(ce)(Z.title, "Filter set"),
                  "model-value": Q(Z),
                  "onUpdate:modelValue": (L) => le(Z, L)
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "title"]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
});
async function rd(a) {
  const m = await Ua(`/api/v1/pim-admin/catalogs/${encodeURIComponent(a)}/policy_defaults`, "policy defaults");
  if (m.audit !== "fields" && m.audit !== "off" || !["audit_days", "trash_days", "tombstone_days"].every((t) => typeof m[t] == "number" && Number.isSafeInteger(m[t])))
    throw new Error("Policy defaults are unavailable.");
  for (const [t, n] of Object.entries(da)) {
    const y = m[t];
    if (typeof y != "number" || !Number.isSafeInteger(y) || y < n.min || y > n.max) throw new Error(`Policy ${t} is unavailable.`);
  }
  return m;
}
const da = {
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
}, ud = { class: "form" }, cd = {
  key: 0,
  class: "muted small pim-policy-intro"
}, md = {
  key: 1,
  class: "muted small pim-policy-status",
  role: "status"
}, pd = {
  key: 0,
  class: "pim-bsection-head"
}, vd = { class: "pim-policy-copy" }, fd = ["for"], bd = ["id"], yd = { key: 0 }, gd = {
  key: 0,
  class: "pim-policy-value"
}, hd = {
  key: 0,
  class: "muted small"
}, kd = /* @__PURE__ */ pe({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {},
    disabled: { type: Boolean },
    defaultsOnly: { type: Boolean }
  },
  setup(a) {
    const m = a, t = K(), n = F(() => m.defaults ?? t.value), y = K(), p = K(!1);
    async function $() {
      if (!(m.defaults || m.disabled)) {
        y.value = void 0, p.value = !0;
        try {
          t.value = await rd(m.catalogId ?? "");
        } catch (r) {
          y.value = Ye(r, "Could not read policy defaults.");
        } finally {
          p.value = !1;
        }
      }
    }
    ea($);
    const f = F(() => m.draft.policy ?? {}), g = [
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
    function I(r) {
      const N = da[r];
      return { key: r, ...N, kind: "int", hint: T[r] };
    }
    g.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(I));
    const H = ["proposal_days", "proposal_count"].map(I), Y = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(I), j = [
      { id: "retention", title: "Retention", keys: g },
      { id: "proposals", title: "Proposals", keys: H },
      { id: "advanced", title: "", keys: Y }
    ], d = F(() => [
      { value: "inherited", label: n.value ? `${n.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function h(r, N) {
      const te = m.draft.policy ?? (m.draft.policy = {});
      te[r] = N == null || N === "" || N === "inherited" ? !1 : N;
    }
    return (r, N) => (e(), i("section", ud, [
      a.defaultsOnly ? v("", !0) : (e(), i("p", cd, "Empty fields inherit the deployment settings.")),
      p.value ? (e(), i("p", md, "Loading deployment defaults…")) : v("", !0),
      y.value ? (e(), O(hl, {
        key: 2,
        error: y.value
      }, {
        default: w(() => [
          b(s(G), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: $
          }, {
            default: w(() => [...N[0] || (N[0] = [
              W("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : v("", !0),
      (e(), i(M, null, se(j, (te) => b(Zl(te.id === "advanced" ? Ve : "section"), Na({
        key: te.id,
        ref_for: !0
      }, te.id === "advanced" ? { label: "Advanced processing settings" } : { "aria-label": te.title }, {
        "data-policy-group": te.id,
        class: "pim-policy-group"
      }), {
        default: w(() => [
          te.title ? (e(), i("header", pd, [
            l("h3", null, _(te.title), 1)
          ])) : v("", !0),
          (e(!0), i(M, null, se(te.keys, (Q) => (e(), i("div", {
            key: Q.key,
            class: "pim-policy-row"
          }, [
            l("div", vd, [
              l("label", {
                for: "pol-" + Q.key
              }, _(Q.title), 9, fd),
              l("p", {
                id: "pol-help-" + Q.key
              }, [
                W(_(Q.hint), 1),
                Q.global ? (e(), i("span", yd, " Managed in deployment settings.")) : v("", !0)
              ], 8, bd)
            ]),
            a.defaultsOnly ? (e(), i("p", gd, [
              W(_(n.value?.[Q.key] === "fields" ? "Record field changes" : n.value?.[Q.key] === "off" ? "Lifecycle and release history" : n.value?.[Q.key] ?? "Unavailable") + " ", 1),
              f.value[Q.key] !== void 0 && f.value[Q.key] !== !1 ? (e(), i("span", hd, " · Catalog override applies")) : v("", !0)
            ])) : Q.kind === "enum" ? (e(), O(s(Ue), {
              key: 1,
              disabled: a.disabled,
              "input-id": "pol-" + Q.key,
              "aria-describedby": "pol-help-" + Q.key,
              class: "pim-policy-control",
              "model-value": typeof f.value[Q.key] == "string" ? f.value[Q.key] : "inherited",
              options: d.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": (le) => h(Q.key, le)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])) : (e(), O(s(Ma), {
              key: 2,
              disabled: a.disabled || Q.global,
              "input-id": "pol-" + Q.key,
              "aria-describedby": "pol-help-" + Q.key,
              class: "pim-policy-control",
              "model-value": Q.global ? Number(n.value?.[Q.key] ?? 0) || null : typeof f.value[Q.key] == "number" ? Number(f.value[Q.key]) : null,
              min: Q.min ?? (Q.key === "audit_days" ? 0 : 1),
              max: Q.max,
              step: 1,
              placeholder: n.value ? "Default: " + n.value[Q.key] : "Deployment default",
              "onUpdate:modelValue": (le) => h(Q.key, le)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "min", "max", "placeholder", "onUpdate:modelValue"]))
          ]))), 128))
        ]),
        _: 2
      }, 1040, ["data-policy-group"])), 64))
    ]));
  }
}), _d = { class: "form" }, wd = { class: "pim-aspect" }, $d = { class: "pim-aspect-head" }, Cd = {
  key: 0,
  class: "muted small"
}, xd = /* @__PURE__ */ pe({
  __name: "BuilderDeclaration",
  props: {
    draft: {},
    readonly: { type: Boolean }
  },
  emits: ["replace", "validity"],
  setup(a, { emit: m }) {
    const t = a, n = m, y = K(JSON.stringify(t.draft, null, 2)), p = K("");
    tl(() => n("validity", !0)), ye(() => t.draft, (f) => {
      y.value = JSON.stringify(f, null, 2), p.value = "";
    }, { deep: !0 });
    function $() {
      if (!t.readonly)
        try {
          const f = it(y.value);
          p.value = "", n("validity", !0), n("replace", f);
        } catch (f) {
          n("validity", !1), p.value = "Invalid declaration: " + (f instanceof Error ? f.message : String(f));
        }
    }
    return (f, g) => (e(), i("section", _d, [
      l("div", wd, [
        l("header", $d, [
          g[1] || (g[1] = l("h3", null, "Declaration", -1)),
          a.readonly ? v("", !0) : (e(), i("span", Cd, "edits apply to the draft when the JSON parses"))
        ]),
        p.value ? (e(), O(s(Se), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: w(() => [
            W(_(p.value), 1)
          ]),
          _: 1
        })) : v("", !0),
        b(s(Wa), {
          modelValue: y.value,
          "onUpdate:modelValue": g[0] || (g[0] = (T) => y.value = T),
          readonly: a.readonly,
          "aria-label": "Catalog declaration",
          rows: "28",
          spellcheck: "false",
          onInput: $,
          onBlur: $,
          class: "mono pim-json-edit"
        }, null, 8, ["modelValue", "readonly"])
      ])
    ]));
  }
}), Vd = { class: "pim-section-layout" }, Ud = { class: "kx-main" }, Sd = ["aria-label"], jd = { class: "pim-builder-main" }, Ad = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, Id = ["disabled", "inert"], Rd = {
  key: 0,
  class: "form pim-card-body pad pim-ia-action"
}, Od = {
  key: 0,
  class: "muted small"
}, Td = {
  key: 1,
  class: "muted small"
}, Pd = { class: "pim-overview-grid" }, qd = { class: "kx-head-icon" }, Dd = { class: "kx-card-id" }, Fd = { class: "kx-card-name" }, Nd = { class: "kx-card-meta" }, zd = { class: "kx-card-desc" }, Bd = { class: "pim-advanced-actions" }, Ld = { class: "pim-ia-action" }, Ed = { class: "pim-ia-action" }, Md = { class: "pim-ia-dialog" }, Wd = { class: "pim-ia-dialog-head" }, Hd = {
  key: 0,
  class: "dialog-actions"
}, Jd = ["aria-labelledby"], Kd = { class: "pim-ia-dialog-head" }, Gd = ["id"], Yd = { class: "pim-ia-review-impact" }, Zd = { key: 0 }, Qd = { key: 1 }, Xd = { key: 2 }, er = { key: 3 }, lr = { key: 4 }, ar = { key: 0 }, tr = {
  key: 0,
  class: "pim-plan-list"
}, sr = { key: 1 }, ir = {
  key: 1,
  class: "pim-ia-review-impact"
}, nr = {
  key: 0,
  class: "row pim-review-confirm"
}, or = ["for"], dr = { class: "dialog-actions pim-ia-dialog-actions" }, rr = /* @__PURE__ */ pe({
  __name: "SchemaBuilder",
  props: {
    catalogId: {},
    embedded: { type: Boolean },
    title: {},
    catalog: {},
    backLabel: {},
    focusBack: { type: Boolean },
    route: {}
  },
  emits: ["applied", "back", "dirty-changed", "navigate"],
  setup(a, { emit: m }) {
    const t = a, n = m, y = {
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
    }, p = {
      Overview: "overview",
      History: "history",
      Families: "families",
      Fields: "fields",
      "Form layout": "form-layout",
      Dimensions: "dimensions",
      Vocabularies: "vocabularies",
      Channels: "channels",
      Sources: "sources",
      Access: "access",
      Plugins: "plugins"
    }, $ = K(""), f = K("General"), g = K("Overview"), T = K(""), I = K(), H = F(() => I.value?.from === "Channels" ? "Families" : I.value ? "Fields" : void 0), Y = K(), j = K(!1), d = K(), h = Object.keys(y).map((u) => ({
      heading: u === "Channels" ? "Publishing and imports" : u,
      items: y[u].items.map((o) => ({ ...o, value: o.label, section: u }))
    })), r = [
      ...h.filter((u) => u.items.length > 1),
      { heading: "Manage catalog", items: h.filter((u) => u.items.length === 1).flatMap((u) => u.items) }
    ], N = r.flatMap((u) => u.items), te = F(() => B.value && ie.value ? [
      { ...r[0], heading: t.title || "Catalog" },
      ...r.slice(1)
    ] : []), Q = F(() => t.backLabel ? {
      value: "all-catalogs",
      label: t.embedded ? "All catalogs" : t.backLabel,
      icon: "tabler:table"
    } : void 0), le = K();
    ye(le, (u) => {
      t.focusBack && u?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    function ne(u) {
      if (u === "all-catalogs") {
        n("back");
        return;
      }
      const o = N.find((x) => x.label === u);
      o && P(o.section, o.label);
    }
    function D(u, o, x = "") {
      const ae = g.value !== o;
      f.value = u, g.value = o, $.value = x ? p[o] + "/" + x : "", ae && d.value && (d.value.scrollTop = 0);
    }
    function z(u, o, x = "") {
      D(u, o, x), t.route !== void 0 && n("navigate", [p[o], ...x ? [encodeURIComponent(x)] : []].join("/"));
    }
    function P(u, o = y[u].items[0].label) {
      (f.value !== u || g.value !== o) && (I.value = void 0, z(u, o));
    }
    function Z(u, o, x) {
      if (t.route === void 0 || p[g.value] !== u || !x && $.value !== u + "/" + o) return;
      const ae = B.value;
      (u === "families" ? ae?.families[o] : u === "fields" ? ae?.declaration.aspects?.some((re) => re.attributes?.some((we) => re.namespace + "." + we.id === o)) : u === "dimensions" ? ae?.dimensions.some((re) => re.name === o) : u === "vocabularies" ? ae?.vocabularies[o] : u === "channels" ? ae?.channels[o] : u === "sources" ? ae?.sources[o] : u === "plugins" && (ie.value?.plugins.some((re) => re.plugin === o) || ie.value?.scopes.some((re) => "scope:" + re.id === o))) && z(f.value, g.value, x ? o : "");
    }
    Ql(na, { selected: $, choose: Z }), ye(() => t.route, (u) => {
      if (u === void 0) return;
      const [o, x] = u.split("/"), ae = N.find((re) => p[re.label] === o);
      ae?.label !== H.value && (I.value = void 0);
      let ue = "";
      try {
        x && (ue = decodeURIComponent(x));
      } catch {
      }
      ae?.label === "Fields" && ue && $.value !== "fields/" + ue && (T.value = ""), D(ae?.section ?? "General", ae?.label ?? "Overview", ue);
    }, { immediate: !0 });
    function L(u) {
      Y.value = u, j.value = !0;
    }
    function J(u) {
      T.value = u, P("Products", "Fields");
    }
    async function R(u, o, x = "") {
      z(u, o, x), await Ke(), d.value?.focus({ preventScroll: !0 });
    }
    function A(u) {
      I.value = { from: "Channels", id: u };
      const o = Cl.value.find((ae) => ae.id === u)?.families, x = cl.value.filter((ae) => !o?.length || o.includes(ae.code));
      R("Products", "Families", x.length === 1 ? x[0].code : void 0);
    }
    function c(u) {
      T.value = "", I.value = { from: "Families", id: u }, R("Products", "Fields");
    }
    function k() {
      if (!I.value) return;
      const { from: u, id: o } = I.value;
      I.value = void 0, R(u === "Channels" ? "Channels" : "Products", u, o);
    }
    function q(u, o, x = o + "s") {
      return u + " " + (u === 1 ? o : x);
    }
    const B = K(null), ie = K(null), X = K({}), be = K({}), fe = K({}), Ie = K(), De = F(() => Object.fromEntries(Object.entries(fe.value).filter(([u]) => X.value.plugins?.some((o) => o.use === u) && !B.value?.plugins.some((o) => o.plugin === u && o.active)))), Ce = K(), he = K(!1), sl = K(null), de = K(!1), V = F(() => B.value?.access.admin === !0), U = K(""), S = K(null), C = K(!1), ve = K(!1), ee = K(null), Re = Pe(), Oe = {
      unchanged: "No changes",
      initial: "First schema",
      cosmetic: "Presentation only",
      additive: "New fields or options",
      semantic: "Affects product data",
      refused: "Changes blocked"
    }, kl = {
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
    }, Me = K(null), Fe = K(!0), ke = ll(), Tl = F(() => C.value && nl.value && (!xl.value.length || ve.value) && !he.value && Fe.value && !!S.value && S.value.class !== "refused" && !!Me.value?.matches(We.value, B.value?.schema_generation ?? -1, De.value)), Pl = F(() => S.value ? [...S.value.refused, ...S.value.changes.filter((u) => u.class !== "refused")] : []), Ne = ll(), il = ll(), _l = K(!1);
    let wl = 0;
    ye([X, be, fe], () => {
      wl++, xe();
    }, { deep: !0, flush: "sync" });
    async function Ze(u = !1, o = !1) {
      if (qe.value && !u) return;
      const x = Ne.begin(), ae = wl, ue = t.catalogId, re = o ? Object.entries(fe.value).filter(([we]) => B.value?.plugins.some((ml) => ml.plugin === we && ml.active)) : [];
      _l.value = !0, Ce.value = void 0, Ie.value = void 0;
      try {
        const [we, ml] = await Promise.all([ge.schema(ue), ge.schemaOptions(ue)]);
        if (!Ne.current(x) || ae !== wl || ue !== t.catalogId) return;
        B.value = we, ie.value = ml, X.value = ol(we.declaration), be.value = {}, fe.value = Object.fromEntries(re.filter(([Ca]) => we.plugins.some((Wl) => Wl.plugin === Ca && Wl.active))), xe(), Fe.value = !0, he.value = !1;
      } catch (we) {
        Ne.current(x) && (Ce.value = Ye(we, "Could not load settings."));
      } finally {
        Ne.current(x) && (_l.value = !1);
      }
    }
    let $l = () => {
    };
    ye(() => t.catalogId, (u) => {
      $l(), $l = la(`component.${u}`, () => {
        !qe.value && !de.value ? Ze() : g.value === "Plugins" && !de.value && He();
      });
    }, { immediate: !0 });
    const ra = gl(async () => {
      !qe.value && !de.value ? await Ze() : g.value === "Plugins" && !de.value && await He();
    });
    tl(() => {
      $l(), ke.begin(), Ne.begin(), il.begin();
    });
    const ql = F(() => ra.value !== !1 && g.value === "Plugins" && !de.value && B.value?.plugins.some((u) => Io(u, B.value.as_of)) === !0);
    ye(ql, (u, o, x) => {
      if (!u) return;
      let ae, ue = !0;
      const re = () => {
        ae = setTimeout(async () => {
          await He() && ue && ql.value && re();
        }, 2e3);
      };
      re(), x(() => {
        ue = !1, clearTimeout(ae);
      });
    }), ye(() => t.catalogId, () => {
      ke.begin(), de.value = !1, he.value = !1, B.value = null, ie.value = null, Vl(), Ze();
    });
    const ua = F(() => Object.values(Jl(X.value, be.value)).reduce((u, o) => u + (o?.length ?? 0), 0)), nl = F(() => !!B.value && (JSON.stringify(X.value) !== JSON.stringify(B.value.declaration) || ua.value > 0 || Object.keys(De.value).length > 0)), qe = F(() => nl.value || Object.keys(fe.value).length > 0);
    ye(qe, (u) => n("dirty-changed", u), { immediate: !0 });
    const cl = F(() => X.value.families?.filter((u) => u.code !== "generic") ?? []), Dl = F(() => X.value.aspects ?? []), Fl = F(() => Dl.value.reduce((u, o) => u + (o.attributes?.length ?? 0), 0)), ca = F(() => {
      const u = new Set(X.value.plugins?.map((o) => o.use));
      return Object.values(B.value?.attributes ?? {}).filter((o) => o.plugin && u.has(o.plugin)).length;
    }), ma = F(() => !Fl.value && !Dl.value.length && !cl.value.length), Cl = F(() => X.value.channels ?? []), pa = F(() => X.value.sources ?? []), Nl = F(() => B.value?.plugins.filter((u) => u.active) ?? []), zl = F(() => t.catalog?.product_count ?? t.catalog?.item_count), va = F(() => [
      {
        section: "Products",
        label: "Product setup",
        icon: "tabler:packages",
        summary: [
          ...typeof zl.value == "number" ? [q(zl.value, "product")] : [],
          q(cl.value.length, "family", "families"),
          q(Fl.value + ca.value, "field")
        ].join(" · "),
        detail: cl.value.map((u) => E(u.code)).join(", ") || "Create a family for products that share the same fields."
      },
      {
        section: "Values",
        label: "Allowed values",
        icon: "tabler:list-details",
        summary: [q(X.value.dimensions?.length ?? 0, "dimension"), q(X.value.vocabularies?.length ?? 0, "vocabulary", "vocabularies")].join(" · "),
        detail: X.value.dimensions?.map((u) => E(u.name)).join(", ") || "Add dimensions when values vary by language, region or another context."
      },
      {
        section: "Channels",
        label: "Publishing and imports",
        icon: "tabler:arrows-exchange",
        summary: [q(Cl.value.length, "channel"), q(pa.value.length, "source")].join(" · "),
        detail: Cl.value.map((u) => E(u.id)).join(", ") || "Add a release destination when products are ready to publish."
      },
      {
        section: "Plugins",
        label: "Catalog tools",
        icon: "tabler:puzzle",
        summary: q(Nl.value.length, "plugin") + " enabled",
        detail: Nl.value.map((u) => ce(u.title, "Catalog plugin")).join(", ") || "Open Plugins to see which tools you can enable."
      }
    ]), fa = {
      Overview: y.General.question,
      History: "What changed in this catalog?",
      Families: "Choose what each family collects, how products vary, and what they need before release.",
      Fields: "Manage product fields and the groups that families share.",
      "Form layout": "In what order will editors see fields?",
      Dimensions: "Where can product values differ?",
      Vocabularies: "Which terms can product editors choose?",
      Channels: "Choose where each family can publish and what products need before release.",
      Sources: "Control who can send product updates and which fields each source can change.",
      Access: y.Access.question,
      Plugins: y.Plugins.question
    }, We = F(() => {
      const u = ol(X.value), o = Jl(u, be.value);
      for (const [x, ae] of Object.entries(o)) {
        const ue = u.remove ??= {};
        ue[x] = [.../* @__PURE__ */ new Set([...ue[x] ?? [], ...ae])];
      }
      return u;
    });
    ye(nl, (u) => {
      u || xe();
    }), ye([We, De], xe, { deep: !0 });
    function ba(u) {
      const [o, x] = u.split(" ", 2);
      if (o === "plugin" && x) return ce(ie.value?.plugins.find((re) => re.plugin === x)?.title, "Plugin");
      if (o === "scope" && x) return ce(ie.value?.scopes.find((re) => re.id === x)?.title, "Product filter set");
      if (x) return ce(E(x), E(o)) + (o === "aspect" ? " field group" : "");
      if (u.startsWith("kickside.")) return "Catalog setting";
      const [ae, ue] = u.split(".", 2);
      return ue ? `${ce(E(ue), "Field")} (${ce(E(ae), "Field group")})` : ce(E(u), "Catalog setting");
    }
    function ya(u) {
      return u.startsWith("renamed from ") ? "Rename from " + E(u.slice(13)) : u.startsWith("config.") ? "Change " + E(u.slice(7)) : u.endsWith(" owning level") ? "Move a field to another variant level" : kl[u] ?? E(u);
    }
    const xl = F(() => {
      const u = We.value.remove;
      return [
        ...u?.attributes?.length || u?.aspects?.length ? ["Removing fields deletes the values stored in those fields."] : [],
        ...u?.vocabularies?.length ? ["Removing a vocabulary deletes its saved terms."] : [],
        ...u?.channels?.length ? ["Removing a release destination withdraws products already published to it."] : []
      ];
    }), Bl = F(() => {
      const u = B.value?.declaration;
      return u ? [
        ...(X.value.channels ?? []).flatMap((o) => {
          const x = u.channels?.find((ae) => ae.id === o.id);
          return JSON.stringify(o) === JSON.stringify(x) ? [] : [{ subject: E(o.id), effect: x ? "Change which products can be released here and what they need first" : "Add a release destination" }];
        }),
        ...(We.value.remove?.channels ?? []).map((o) => ({ subject: E(o), effect: "Remove this release destination" })),
        ...(X.value.sources ?? []).flatMap((o) => {
          const x = u.sources?.find((ae) => ae.id === o.id);
          return JSON.stringify(o) === JSON.stringify(x) ? [] : [{ subject: E(o.id), effect: x ? "Update how this source can send product data" : "Let this source send product updates" }];
        }),
        ...(We.value.remove?.sources ?? []).map((o) => ({ subject: E(o), effect: "Stop accepting updates from this source" }))
      ] : [];
    });
    function Qe(u, o) {
      const x = Ye(u, o), ae = x.pluginConfig, ue = ie.value?.plugins.find((re) => re.installed && re.plugin === ae?.plugin);
      if (ae && ue && X.value.plugins?.some((re) => re.use === ae.plugin)) {
        Ie.value = ae, P("Plugins");
        return;
      }
      Ce.value = x, x.code === Sa && (he.value = !0, xe());
    }
    async function ga() {
      if (!(qe.value && !await el.confirm({
        header: "Discard unsaved changes?",
        message: "Reloading will discard unsaved settings and plugin changes.",
        acceptLabel: "Discard and reload",
        rejectLabel: "Cancel"
      }))) {
        de.value = !0, U.value = "";
        try {
          await Ze(!0);
        } finally {
          de.value = !1;
        }
      }
    }
    async function Ll() {
      if (!B.value || !nl.value || !Fe.value || he.value) return;
      const u = ke.begin(), o = at(We.value, B.value.schema_generation, De.value);
      de.value = !0, Ce.value = void 0;
      try {
        const x = await ge.planSchema(t.catalogId, o.declaration, o.generation, o.pluginConfigs);
        if (!ke.current(u) || !o.matches(We.value, B.value.schema_generation, De.value) || !Fe.value) return;
        Me.value = o, ve.value = !1, S.value = x, C.value = !0, await Ke(), ee.value?.focus();
      } catch (x) {
        if (!ke.current(u)) return;
        Qe(x, "Could not review the change."), xe(), await Ke(), sl.value?.$el.focus();
      } finally {
        ke.current(u) && (de.value = !1);
      }
    }
    async function ha() {
      if (!B.value || !qe.value || !Tl.value || !Me.value) return;
      const u = t.catalogId, o = ke.begin();
      de.value = !0, Ce.value = void 0, U.value = "";
      try {
        const x = await ge.applySchema(u, Me.value.declaration, Me.value.generation, Me.value.pluginConfigs);
        if (u !== t.catalogId || !ke.current(o) || (await Ze(!0, !0), u !== t.catalogId || !ke.current(o))) return;
        U.value = "Catalog changes applied.", n("applied", x.generation);
      } catch (x) {
        if (u !== t.catalogId || !ke.current(o)) return;
        xe(), Qe(x, "Could not apply the change."), await Ke(), sl.value?.$el.focus();
      } finally {
        ke.current(o) && (de.value = !1);
      }
    }
    async function He(u = !1) {
      const o = t.catalogId, x = B.value, ae = il.begin();
      try {
        const [ue, re] = await Promise.all([ge.schema(o), u ? ge.schemaOptions(o) : void 0]);
        return !x || !il.current(ae) || o !== t.catalogId || B.value !== x ? !1 : (x.plugins = ue.plugins, x.as_of = ue.as_of, re && (ie.value = re), !0);
      } catch (ue) {
        return u && il.current(ae) && o === t.catalogId && Qe(ue, "Could not check plugin status."), !1;
      }
    }
    async function El(u, o, x = !1) {
      if (de.value || he.value || !V.value) return;
      const ae = t.catalogId, ue = Ne.begin(), re = ke.begin();
      il.begin(), de.value = !0, Ce.value = void 0, U.value = "";
      try {
        const we = JSON.stringify(o);
        if (x ? await ge.configurePlugin(ae, u, ol(o), !0) : await ge.configurePlugin(ae, u, ol(o)), ae !== t.catalogId || !Ne.current(ue) || !await He(!0) || ae !== t.catalogId || !Ne.current(ue)) return;
        !x && JSON.stringify(fe.value[u]) === we && delete fe.value[u], Ie.value?.plugin === u && (Ie.value = void 0), U.value = x ? "Background update reset requested." : "Configuration saved";
      } catch (we) {
        ae === t.catalogId && ke.current(re) && Qe(we, x ? "Could not reset background updates." : "Could not save configuration.");
      } finally {
        ke.current(re) && (de.value = !1);
      }
    }
    async function ka(u) {
      const o = t.catalogId, x = B.value?.plugins.find((ae) => ae.plugin === u && ae.active && ae.installed);
      !x?.config || de.value || he.value || !V.value || !await el.confirm({
        header: "Reset background updates?",
        message: "Background updates will start from a new catalog event. Current product data will be rebuilt into the plugin’s index. Earlier events will be skipped.",
        acceptLabel: "Reset background updates",
        rejectLabel: "Cancel"
      }) || t.catalogId !== o || await El(u, x.config, !0);
    }
    async function _a(u) {
      const o = t.catalogId;
      if (!(de.value || he.value || !V.value)) {
        de.value = !0, Ce.value = void 0, U.value = "";
        try {
          await ge.resumePluginProjection(o, u), t.catalogId === o && await He(!0) && (U.value = "Background update resumed.");
        } catch (x) {
          t.catalogId === o && Qe(x, "Could not resume the background update.");
        } finally {
          t.catalogId === o && (de.value = !1);
        }
      }
    }
    async function wa(u) {
      const o = t.catalogId;
      if (!(de.value || he.value || !V.value) && !(!await el.confirm({
        header: "Clear catalog app binding?",
        message: "The catalog will use the default app after this setting is saved.",
        acceptLabel: "Clear binding",
        rejectLabel: "Cancel"
      }) || t.catalogId !== o || de.value || !V.value || !B.value?.plugins.some((x) => x.references?.shell_bindings.includes(u)))) {
        de.value = !0, Ce.value = void 0, U.value = "";
        try {
          if (await ge.updateCatalogApp(o, ""), t.catalogId !== o) return;
          await He(!0) && (U.value = "Catalog app binding cleared.");
        } catch (x) {
          t.catalogId === o && Qe(x, "Could not clear the catalog app binding.");
        } finally {
          t.catalogId === o && (de.value = !1);
        }
      }
    }
    async function $a() {
      qe.value && !await el.confirm({
        header: "Leave this catalog?",
        message: "Your unsaved catalog changes will be discarded.",
        acceptLabel: "Discard and open settings",
        rejectLabel: "Keep editing"
      }) || (Vl(), j.value = !1, el.navigate("/system/settings"));
    }
    function xe() {
      C.value = !1, Me.value = null;
    }
    function Ml() {
      j.value = !1, Fe.value = !0;
    }
    function Vl() {
      I.value = void 0, fe.value = {}, Ie.value = void 0, Fe.value = !0, B.value && (X.value = ol(B.value.declaration)), be.value = {}, xe(), U.value = "";
    }
    function Xe(u, o) {
      const x = be.value[u] ?? [];
      x.includes(o) || (be.value = { ...be.value, [u]: [...x, o] });
    }
    return (u, o) => (e(), i("section", {
      class: Ae(["pim-builder", { embedded: a.embedded }])
    }, [
      l("div", Vd, [
        Q.value || B.value && ie.value ? (e(), O(Ya, {
          key: 0,
          ref_key: "rail",
          ref: le,
          label: "Catalog settings sections",
          value: g.value,
          groups: te.value,
          "leading-item": Q.value,
          "onUpdate:value": ne
        }, null, 8, ["value", "groups", "leading-item"])) : v("", !0),
        l("div", Ud, [
          l("section", {
            ref_key: "content",
            ref: d,
            class: "kx-main-scroll",
            "aria-label": g.value,
            tabindex: "-1"
          }, [
            B.value && ie.value ? (e(), O(Yt, {
              key: 0,
              title: g.value,
              description: fa[g.value]
            }, $e({ _: 2 }, [
              V.value && qe.value ? {
                name: "actions",
                fn: w(() => [
                  b(Zt, {
                    busy: de.value,
                    "review-disabled": !Fe.value || he.value || !nl.value,
                    onDiscard: Vl,
                    onReview: Ll
                  }, null, 8, ["busy", "review-disabled"])
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : v("", !0),
            l("div", jd, [
              Ce.value ? (e(), O(hl, {
                key: 0,
                ref_key: "errorPanel",
                ref: sl,
                error: Ce.value,
                tabindex: "-1"
              }, {
                default: w(() => [
                  he.value ? (e(), O(s(G), {
                    key: 0,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: de.value,
                    onClick: ga
                  }, {
                    default: w(() => [...o[11] || (o[11] = [
                      W("Reload settings", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"])) : !B.value || !ie.value ? (e(), O(s(G), {
                    key: 1,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: o[0] || (o[0] = (x) => Ze())
                  }, {
                    default: w(() => [...o[12] || (o[12] = [
                      W("Retry", -1)
                    ])]),
                    _: 1
                  })) : v("", !0)
                ]),
                _: 1
              }, 8, ["error"])) : v("", !0),
              U.value ? (e(), O(s(Se), {
                key: 1,
                severity: "success",
                role: "status"
              }, {
                default: w(() => [
                  W(_(U.value), 1)
                ]),
                _: 1
              })) : v("", !0),
              B.value?.rebuilding && g.value === "Overview" ? (e(), O(s(Se), {
                key: 2,
                severity: "info",
                role: "status"
              }, {
                default: w(() => [...o[13] || (o[13] = [
                  W("Updating product readiness", -1)
                ])]),
                _: 1
              })) : v("", !0),
              _l.value && (!B.value || !ie.value) ? (e(), i("div", Ad, "Loading catalog settings…")) : B.value && ie.value ? (e(), i("fieldset", {
                key: 4,
                class: "pim-editor-surface",
                disabled: de.value,
                inert: de.value
              }, [
                V.value ? v("", !0) : (e(), O(s(Se), {
                  key: 0,
                  severity: "info"
                }, {
                  default: w(() => [...o[14] || (o[14] = [
                    W("You can view this catalog’s settings.", -1)
                  ])]),
                  _: 1
                })),
                (e(), i("div", {
                  key: g.value,
                  class: "pim-ia-content"
                }, [
                  I.value && g.value === H.value ? (e(), i("div", Rd, [
                    l("div", null, [
                      I.value.from === "Channels" ? (e(), i("p", Od, "Open the family that defines what products need before release, then add a release requirement.")) : (e(), i("p", Td, "Add a field with a single value and no dimensions, such as Integer. When you return, select its group under Field groups."))
                    ]),
                    b(s(G), {
                      type: "button",
                      severity: "secondary",
                      outlined: "",
                      size: "small",
                      onClick: k
                    }, {
                      default: w(() => [
                        b(s(oe), {
                          icon: "tabler:arrow-left",
                          "aria-hidden": "true"
                        }),
                        W(" Back to " + _(s(E)(I.value.id)), 1)
                      ]),
                      _: 1
                    })
                  ])) : v("", !0),
                  f.value === "General" && g.value === "History" ? (e(), O(Ht, {
                    key: 1,
                    "catalog-id": a.catalogId,
                    "can-resolve-actors": V.value
                  }, null, 8, ["catalog-id", "can-resolve-actors"])) : f.value === "General" ? (e(), i(M, { key: 2 }, [
                    l("div", Pd, [
                      (e(!0), i(M, null, se(va.value, (x) => (e(), i("section", {
                        key: x.section,
                        class: "kx-card pim-overview-card"
                      }, [
                        l("span", qd, [
                          b(s(oe), {
                            icon: x.icon,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"])
                        ]),
                        l("div", Dd, [
                          l("h3", Fd, _(x.label), 1),
                          l("p", Nd, _(x.summary), 1)
                        ]),
                        l("p", zd, _(x.detail), 1),
                        b(s(G), {
                          type: "button",
                          text: "",
                          class: "pim-overview-action",
                          onClick: (ae) => P(x.section)
                        }, {
                          default: w(() => [
                            W(_(x.section === "Products" ? ma.value ? "Set up products" : "View families" : "View " + x.section.toLowerCase()) + " ", 1),
                            b(s(oe), {
                              icon: "tabler:arrow-right",
                              "aria-hidden": "true"
                            })
                          ]),
                          _: 2
                        }, 1032, ["onClick"])
                      ]))), 128))
                    ]),
                    b(Ve, { label: "Advanced" }, {
                      default: w(() => [
                        l("div", Bd, [
                          l("div", Ld, [
                            o[15] || (o[15] = l("div", null, [
                              l("h3", null, "Application defaults"),
                              l("p", null, "Review the audit, retention and processing settings this catalog inherits.")
                            ], -1)),
                            b(s(G), {
                              label: "View defaults",
                              severity: "secondary",
                              outlined: "",
                              onClick: o[1] || (o[1] = (x) => L("defaults"))
                            })
                          ]),
                          l("div", Ed, [
                            o[16] || (o[16] = l("div", null, [
                              l("h3", null, "Technical schema"),
                              l("p", null, "Inspect the complete definition, including integration keys and settings used by installed extensions.")
                            ], -1)),
                            b(s(G), {
                              label: "Open declaration",
                              severity: "secondary",
                              outlined: "",
                              onClick: o[2] || (o[2] = (x) => L("declaration"))
                            })
                          ])
                        ])
                      ]),
                      _: 1
                    })
                  ], 64)) : f.value === "Products" ? (e(), i(M, { key: 3 }, [
                    g.value === "Families" ? (e(), O(En, {
                      key: 0,
                      draft: X.value,
                      schema: B.value,
                      options: ie.value,
                      onRemove: Xe,
                      onFields: J,
                      onVariantField: c
                    }, null, 8, ["draft", "schema", "options"])) : g.value === "Fields" ? (e(), O(Ri, {
                      key: 1,
                      family: T.value,
                      "onUpdate:family": o[3] || (o[3] = (x) => T.value = x),
                      draft: X.value,
                      schema: B.value,
                      options: ie.value,
                      onRemove: Xe
                    }, null, 8, ["family", "draft", "schema", "options"])) : (e(), O(xt, {
                      key: 2,
                      draft: X.value,
                      schema: B.value,
                      types: ie.value.types
                    }, null, 8, ["draft", "schema", "types"]))
                  ], 64)) : f.value === "Values" ? (e(), i(M, { key: 4 }, [
                    g.value === "Dimensions" ? (e(), O(Li, {
                      key: 0,
                      draft: X.value,
                      schema: B.value,
                      onRemove: Xe
                    }, null, 8, ["draft", "schema"])) : (e(), O(rn, {
                      key: 1,
                      "catalog-id": a.catalogId,
                      draft: X.value,
                      schema: B.value,
                      onRemove: Xe
                    }, null, 8, ["catalog-id", "draft", "schema"]))
                  ], 64)) : f.value === "Channels" ? (e(), O(jo, {
                    key: 5,
                    "catalog-id": a.catalogId,
                    draft: X.value,
                    schema: B.value,
                    view: g.value === "Sources" ? "sources" : "channels",
                    onRemove: Xe,
                    onRequirements: A
                  }, null, 8, ["catalog-id", "draft", "schema", "view"])) : f.value === "Access" ? (e(), O(lt, {
                    key: 6,
                    "catalog-id": a.catalogId,
                    title: a.title || "Catalog",
                    access: B.value.access
                  }, null, 8, ["catalog-id", "title", "access"])) : (e(), O(dd, {
                    key: 7,
                    draft: X.value,
                    schema: B.value,
                    options: ie.value,
                    "plugin-configs": fe.value,
                    refusal: Ie.value,
                    stale: he.value,
                    onConfigure: El,
                    onRemove: Xe,
                    onReset: ka,
                    onClearRefusal: o[4] || (o[4] = (x) => Ie.value = void 0),
                    onRefresh: o[5] || (o[5] = (x) => He(!0)),
                    onResume: _a,
                    onReview: Ll,
                    onClearShellBinding: wa
                  }, null, 8, ["draft", "schema", "options", "plugin-configs", "refusal", "stale"]))
                ])),
                Y.value ? (e(), O(fl, {
                  key: 1,
                  visible: j.value,
                  label: Y.value === "defaults" ? "Application defaults" : "Technical schema",
                  onClose: Ml,
                  onClosed: o[8] || (o[8] = (x) => Y.value = void 0)
                }, {
                  default: w(() => [
                    l("div", Md, [
                      l("header", Wd, [
                        l("h2", null, _(Y.value === "defaults" ? "Application defaults" : "Technical schema"), 1),
                        b(s(G), {
                          type: "button",
                          "aria-label": "Close",
                          text: "",
                          severity: "secondary",
                          onClick: Ml
                        }, {
                          default: w(() => [
                            b(s(oe), {
                              icon: "tabler:x",
                              "aria-hidden": "true"
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      Y.value === "defaults" ? (e(), i(M, { key: 0 }, [
                        o[17] || (o[17] = l("p", { class: "muted" }, "These settings apply across the application. Catalogs with an explicit override keep their chosen value.", -1)),
                        b(kd, {
                          "catalog-id": a.catalogId,
                          draft: X.value,
                          disabled: !V.value,
                          "defaults-only": ""
                        }, null, 8, ["catalog-id", "draft", "disabled"]),
                        V.value ? (e(), i("div", Hd, [
                          b(s(G), {
                            type: "button",
                            label: "Open application settings",
                            severity: "secondary",
                            outlined: "",
                            onClick: $a
                          })
                        ])) : v("", !0)
                      ], 64)) : (e(), O(xd, {
                        key: 1,
                        draft: X.value,
                        readonly: !V.value,
                        onReplace: o[6] || (o[6] = (x) => X.value = x),
                        onValidity: o[7] || (o[7] = (x) => {
                          Fe.value = x, xe();
                        })
                      }, null, 8, ["draft", "readonly"]))
                    ])
                  ]),
                  _: 1
                }, 8, ["visible", "label"])) : v("", !0)
              ], 8, Id)) : v("", !0),
              b(fl, {
                class: "pim-review-dialog",
                visible: C.value,
                busy: de.value,
                label: "Review changes",
                onClose: xe,
                onClosed: o[10] || (o[10] = (x) => S.value = null)
              }, {
                default: w(() => [
                  S.value ? (e(), i("section", {
                    key: 0,
                    class: "pim-ia-dialog pim-plan",
                    "aria-labelledby": s(Re)
                  }, [
                    l("header", Kd, [
                      l("div", null, [
                        l("h2", {
                          id: s(Re),
                          ref_key: "reviewHeading",
                          ref: ee,
                          tabindex: "-1",
                          autofocus: ""
                        }, "Review changes", 8, Gd),
                        l("p", null, "Check what will happen when you apply this draft to " + _(a.title || "the catalog") + ".", 1)
                      ]),
                      b(s(G), {
                        type: "button",
                        "aria-label": "Close review",
                        disabled: de.value,
                        text: "",
                        severity: "secondary",
                        onClick: xe
                      }, {
                        default: w(() => [
                          b(s(oe), {
                            icon: "tabler:x",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ]),
                    l("div", Yd, [
                      l("h3", null, _(Oe[S.value.class] || "Catalog changes"), 1),
                      S.value.class === "unchanged" ? (e(), i("p", Zd, "The catalog already matches this draft.")) : S.value.class === "initial" ? (e(), i("p", Qd, "Product editors will use these settings for new products.")) : S.value.class === "cosmetic" ? (e(), i("p", Xd, "Catalog settings will update. Stored product values are kept.")) : S.value.class === "additive" ? (e(), i("p", er, "The new options become available. Existing product values are kept.")) : S.value.class === "semantic" ? (e(), i("p", lr, "Applying changes can recalculate product values or release readiness across this catalog.")) : S.value.class === "refused" ? (e(), O(s(Se), {
                        key: 5,
                        severity: "error"
                      }, {
                        default: w(() => [
                          o[18] || (o[18] = W(" These changes can’t be applied. ", -1)),
                          S.value.migration && S.value.refused.some((x) => B.value?.attributes[x.code]) ? (e(), i("span", ar, " To change how a field stores values, add a new field and copy the existing values into it. Then remove the original field and give the new field its name. ")) : v("", !0)
                        ]),
                        _: 1
                      })) : v("", !0)
                    ]),
                    Pl.value.length || Bl.value.length ? (e(), i("ul", tr, [
                      (e(!0), i(M, null, se(Pl.value, (x, ae) => (e(), i("li", { key: ae }, [
                        x.class === "refused" ? (e(), O(s(_e), {
                          key: 0,
                          class: "kx-tag-sm small",
                          severity: "danger"
                        }, {
                          default: w(() => [...o[19] || (o[19] = [
                            W("Blocked", -1)
                          ])]),
                          _: 1
                        })) : v("", !0),
                        x.code ? (e(), i("strong", sr, _(ba(x.code)), 1)) : v("", !0),
                        l("span", null, _(ya(x.what)), 1)
                      ]))), 128)),
                      (e(!0), i(M, null, se(Bl.value, (x) => (e(), i("li", {
                        key: x.subject + x.effect
                      }, [
                        l("strong", null, _(x.subject), 1),
                        l("span", null, _(x.effect), 1)
                      ]))), 128))
                    ])) : v("", !0),
                    xl.value.length ? (e(), i("div", ir, [
                      o[20] || (o[20] = l("h3", null, "Permanent changes", -1)),
                      (e(!0), i(M, null, se(xl.value, (x) => (e(), i("p", { key: x }, _(x), 1))), 128)),
                      S.value.class !== "refused" ? (e(), i("div", nr, [
                        b(s(za), {
                          modelValue: ve.value,
                          "onUpdate:modelValue": o[9] || (o[9] = (x) => ve.value = x),
                          "input-id": s(Re) + "-acknowledge",
                          binary: "",
                          disabled: de.value
                        }, null, 8, ["modelValue", "input-id", "disabled"]),
                        l("label", {
                          for: s(Re) + "-acknowledge"
                        }, "I understand the effects of these removals", 8, or)
                      ])) : v("", !0)
                    ])) : v("", !0),
                    l("footer", dr, [
                      b(s(G), {
                        type: "button",
                        label: "Back to editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: de.value,
                        onClick: xe
                      }, null, 8, ["disabled"]),
                      B.value?.access.admin && S.value.class !== "refused" ? (e(), O(s(G), {
                        key: 0,
                        disabled: !qe.value || de.value || !Tl.value,
                        loading: de.value,
                        onClick: ha
                      }, {
                        default: w(() => [
                          W(_(g.value === "Form layout" ? "Apply layout" : "Apply changes"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled", "loading"])) : v("", !0)
                    ])
                  ], 8, Jd)) : v("", !0)
                ]),
                _: 1
              }, 8, ["visible", "busy"])
            ])
          ], 8, Sd)
        ])
      ])
    ], 2));
  }
}), ur = /* @__PURE__ */ pe({
  __name: "SettingsApp",
  setup(a) {
    const m = ja(), t = Aa(), n = K(), y = F(() => m.value.catalogId ?? ""), p = ll();
    async function $() {
      const g = p.begin(), T = y.value;
      try {
        const I = await ge.catalogSummary(T);
        p.current(g) && (n.value = I);
      } catch {
        p.current(g) && (n.value = void 0);
      }
    }
    ye(y, () => {
      n.value = void 0, $();
    }), gl($), tl(() => {
      p.begin();
    });
    function f() {
      m.value.embedded ? t("open-catalog-picker", {}) : t("navigate", { route: "" });
    }
    return (g, T) => y.value ? (e(), O(rr, {
      key: y.value,
      "catalog-id": y.value,
      title: n.value?.title || "Catalog",
      catalog: n.value,
      embedded: s(m).embedded,
      "focus-back": s(m).focusBack,
      route: s(m).route,
      onNavigate: T[0] || (T[0] = (I) => s(t)("navigate", { route: I })),
      "back-label": s(m).embedded ? "Back to catalogs" : "Back to catalog settings",
      onBack: f,
      onDirtyChanged: T[1] || (T[1] = (I) => s(t)("dirty-changed", { dirty: I }))
    }, null, 8, ["catalog-id", "title", "catalog", "embedded", "focus-back", "route", "back-label"])) : v("", !0);
  }
});
class cr extends Ia {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "catalog-id": { type: "string", default: "" }, embedded: { type: "boolean", default: !1 }, route: { type: "string" }, "focus-back": { type: "boolean", default: !1 } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: Ra
    };
  }
  static get vueConfig() {
    return { rootComponent: ur, plugins: [Oa] };
  }
}
Ea(import.meta.url, cr);
