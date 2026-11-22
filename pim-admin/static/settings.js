import { d as ha, u as vl, r as Ye, e as Ml, h as ka, b as fl, p as be, c as Ee, a as Ce, _ as cl, i as _a, S as wa, f as $a, g as Ca, W as xa, s as Va, P as Ua } from "./styles-CVQl8dxc.js";
import { defineComponent as ce, computed as F, openBlock as e, createBlock as T, resolveDynamicComponent as Wl, normalizeProps as ja, guardReactiveProps as Sa, createSlots as _e, withCtx as w, createElementVNode as l, normalizeClass as Se, createElementBlock as i, Fragment as L, renderList as ee, toDisplayString as _, createCommentVNode as y, unref as s, renderSlot as je, ref as K, onUnmounted as Xe, createVNode as f, createStaticVNode as Aa, createTextVNode as W, withModifiers as Te, normalizeStyle as wl, useId as Ne, watch as fe, withKeys as il, nextTick as Ze, provide as Hl, inject as Fl, useModel as Jl, Transition as Ra, mergeModels as $l, toRaw as Ia, onMounted as Kl, mergeProps as Oa } from "vue";
import { Icon as te } from "@iconify/vue";
import he from "primevue/tag";
import G from "primevue/button";
import Ta from "primevue/checkbox";
import Ve from "primevue/message";
import { api as Pa, on as Gl, host as Ge, loadByTagName as qa, define as Da } from "@wippy-fe/proxy";
import Ul from "primevue/selectbutton";
import Qe from "primevue/inputtext";
import Yl from "primevue/multiselect";
import nl from "primevue/toggleswitch";
import xe from "primevue/select";
import Na from "primevue/inputnumber";
import za from "primevue/textarea";
const Fa = ["aria-label"], Ba = {
  key: 0,
  class: "kx-settings-rail-group"
}, La = ["aria-current", "onClick"], Ea = { class: "kx-settings-rail-label" }, Ma = /* @__PURE__ */ ce({
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
    function o(b) {
      const v = [...b.currentTarget.querySelectorAll(".kx-settings-rail-item")], x = v.indexOf(b.target);
      if (x < 0) return;
      let p;
      switch (b.key) {
        case "ArrowDown":
        case "ArrowRight":
          p = (x + 1) % v.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          p = (x + v.length - 1) % v.length;
          break;
        case "Home":
          p = 0;
          break;
        case "End":
          p = v.length - 1;
          break;
        default:
          return;
      }
      b.preventDefault(), v[p]?.focus();
    }
    return (b, v) => (e(), T(Wl(a.title ? ha : "div"), ja(Sa(a.title ? { title: a.title, count: a.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), _e({
      default: w(() => [
        l("nav", {
          class: Se(["kx-settings-rail", { "kx-settings-rail-framed": a.title }]),
          "aria-label": a.label,
          onKeydown: o
        }, [
          (e(!0), i(L, null, ee(t.value, (x, p) => (e(), i("div", {
            key: x.items[0]?.value ?? p,
            class: Se(["kx-settings-rail-section", { "kx-settings-rail-leading": a.leadingItem && p === 0 }])
          }, [
            x.heading ? (e(), i("div", Ba, _(x.heading), 1)) : y("", !0),
            (e(!0), i(L, null, ee(x.items, (h) => (e(), i("button", {
              key: h.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": h.value === a.value ? "true" : void 0,
              onClick: (q) => b.$emit("update:value", h.value)
            }, [
              h.icon ? (e(), T(s(te), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: h.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : y("", !0),
              l("span", Ea, _(h.label), 1)
            ], 8, La))), 128))
          ], 2))), 128))
        ], 42, Fa)
      ]),
      _: 2
    }, [
      a.title && b.$slots.actions ? {
        name: "actions",
        fn: w(() => [
          je(b.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Wa = { class: "pim-stack" }, Ha = { class: "form pim-access-card pim-ia-action" }, Ja = { class: "pim-access-summary" }, Ka = ["config"], Ga = /* @__PURE__ */ ce({
  __name: "CatalogShare",
  props: {
    catalogId: {},
    title: {},
    access: {}
  },
  setup(a) {
    const m = a, t = K(!1), o = K(!1), b = K(""), v = K(), x = K(!1), p = Ye(), h = F(() => "/api/v1/component-access/grants/" + encodeURIComponent(m.catalogId)), q = F(() => JSON.stringify({
      resource_id: m.catalogId,
      title: m.title,
      access_url: h.value,
      share_url: "/api/v1/component-access/share/" + encodeURIComponent(m.catalogId)
    })), D = F(() => {
      if (!m.access.admin) return "Only catalog administrators can manage sharing.";
      if (!v.value) return x.value ? "Member counts are unavailable." : "Loading members…";
      const { people: U, groups: u } = v.value;
      return U + (U === 1 ? " person" : " people") + " and " + u + (u === 1 ? " group" : " groups") + " with direct access";
    });
    async function H() {
      if (!m.access.admin) return;
      const U = p.begin();
      x.value = !1;
      try {
        const { data: u } = await Pa.get(h.value);
        if (!p.current(U)) return;
        if (!u?.success || !Array.isArray(u.access)) throw new Error("Grants unavailable");
        const C = u.access.filter((r) => r.subject_type === "group").length;
        v.value = { people: u.access.length - C, groups: C };
      } catch {
        p.current(U) && (v.value = void 0, x.value = !0);
      }
    }
    vl(H), Xe(() => {
      p.begin();
    });
    async function E() {
      o.value = !0, b.value = "", await Ml("kickside-share") ? t.value = !0 : b.value = "Could not open sharing. Try again.", o.value = !1;
    }
    return (U, u) => (e(), i("div", Wa, [
      l("section", Ha, [
        l("div", null, [
          u[1] || (u[1] = l("h3", null, "Members and sharing", -1)),
          l("p", Ja, _(D.value), 1)
        ]),
        a.access.admin ? (e(), T(s(G), {
          key: 0,
          type: "button",
          label: "Share catalog",
          loading: o.value,
          onClick: E
        }, {
          icon: w(() => [
            f(s(te), {
              icon: "tabler:share",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : y("", !0),
        x.value ? (e(), T(s(G), {
          key: 1,
          type: "button",
          label: "Reload member counts",
          severity: "secondary",
          text: "",
          onClick: H
        })) : y("", !0)
      ]),
      u[2] || (u[2] = Aa('<section class="form pim-access-card pim-stack" aria-labelledby="pim-access-roles-heading"><h3 id="pim-access-roles-heading">What members can do</h3><dl class="pim-access-roles"><div><dt>Read</dt><dd>View products and their details.</dd></div><div><dt>Write</dt><dd>Create products and update their values.</dd></div><div><dt>Delete</dt><dd>Move products to trash.</dd></div><div><dt>Admin</dt><dd>Manage catalog settings and who has access.</dd></div></dl></section>', 1)),
      t.value ? (e(), i("kickside-share", {
        key: 0,
        config: q.value,
        onClose: u[0] || (u[0] = (C) => t.value = !1),
        onChanged: H
      }, null, 40, Ka)) : y("", !0),
      b.value ? (e(), T(s(Ve), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: w(() => [
          W(_(b.value), 1)
        ]),
        _: 1
      })) : y("", !0)
    ]));
  }
});
function Ya(a, m, t = {}) {
  const o = JSON.stringify(a), b = JSON.stringify(t);
  return {
    declaration: JSON.parse(o),
    generation: m,
    pluginConfigs: JSON.parse(b),
    matches: (v, x, p = {}) => m === x && o === JSON.stringify(v) && b === JSON.stringify(p)
  };
}
function Bl(a, m) {
  const t = {};
  for (const [o, b] of Object.entries(m)) {
    const v = b.filter((x) => o === "plugins" ? !a.plugins?.some((p) => p.use === x) : o === "scopes" ? !a.scopes?.includes(x) : o === "attributes" ? !a.aspects?.some((p) => p.attributes?.some((h) => p.namespace + "." + h.code === x)) : o === "aspects" ? !a.aspects?.some((p) => p.namespace === x) : o === "dimensions" ? !a.dimensions?.some((p) => p.name === x) : o === "vocabularies" || o === "families" ? !a[o]?.some((p) => p.code === x) : !a[o]?.some((p) => p.id === x));
    v.length && (t[o] = v);
  }
  return t;
}
const Ll = (a) => !!a && typeof a == "object" && !Array.isArray(a), ue = ["string"], Zl = { "*": "string" }, Za = { id: "number", code: "string!", type: "string!", scope: ue, cardinality: "string", index: "string", index_contexts: [Zl], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, Qa = {
  dimensions: [{ name: "string!", members: ue, fallback: { "*": ue } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: ue }, attributes: [Za] }],
  families: [{ code: "string!", aspects: ue, variation: [{ axes: ue, own: ue }], requirements: [{ id: "string!", context: Zl, require: ue, authored: ue }], checks: [{ check: "string!", reads: ue, cost: "string", config: "object", enforce: "string" }] }],
  sources: [{ id: "string!", ordering: "string", writes: ue, principals: ue, audit: "boolean" }],
  channels: [{ id: "string!", requirements: ue, families: ue }],
  plugins: [{ use: "string!", schema: "json" }],
  scopes: ue,
  policy: { "*": "policy" },
  remove: { dimensions: ue, vocabularies: ue, aspects: ue, families: ue, sources: ue, channels: ue, attributes: ue, scopes: ue, plugins: ue }
};
function Cl(a, m, t) {
  if (typeof m == "string") {
    const o = m.replace("!", "");
    if (!(o === "json" || (o === "object" ? Ll(a) : o === "policy" ? a === !1 || typeof a == "string" || typeof a == "number" : typeof a === o)) || m.endsWith("!") && (typeof a != "string" || !a.trim())) throw new Error(`${t} has an invalid ${o} value.`);
  } else if (Array.isArray(m)) {
    if (!Array.isArray(a)) throw new Error(`${t} must be an array.`);
    a.forEach((o, b) => Cl(o, m[0], `${t}[${b}]`));
  } else {
    if (!Ll(a)) throw new Error(`${t} must be an object.`);
    for (const [o, b] of Object.entries(m)) if (typeof b == "string" && b.endsWith("!") && a[o] === void 0) throw new Error(`${t}.${o} is required.`);
    for (const [o, b] of Object.entries(a)) {
      const v = m[o] ?? m["*"];
      if (!v) throw new Error(`${t}.${o} is not an editor field.`);
      Cl(b, v, `${t}.${o}`);
    }
  }
}
function Xa(a) {
  const m = JSON.parse(a);
  Cl(m, Qa, "Declaration");
  const t = m;
  for (const o of t.dimensions ?? []) o.members ??= [];
  return t;
}
function tl(a) {
  return JSON.parse(JSON.stringify(a));
}
const El = /^[a-z][a-z0-9_]*$/;
function et(a) {
  return a.trim().normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function Le(a, m, t) {
  t.length ? a[m] = t : delete a[m];
}
function rl(a, m, t) {
  if (t < 0 || t >= a.length || m === t) return;
  const [o] = a.splice(m, 1);
  a.splice(t, 0, o);
}
function re(a, m) {
  return !a || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(a) ? m : a;
}
function sl(a) {
  return a ? re(a.title, "Field type") : "Unknown type";
}
async function Ql(a, m) {
  const t = [...new Set(m)].map((b) => ({ type: "user", id: b }));
  if (!t.length) return {};
  const o = await ka(`/api/v1/pim-admin/catalogs/${encodeURIComponent(a)}/principal_labels`, { refs: t }, "People");
  return Object.fromEntries((o.principals ?? []).map((b) => [b.id, re(b.label, "Person")]));
}
const ul = [
  { value: "quarter", label: "¼", span: 3 },
  { value: "third", label: "⅓", span: 4 },
  { value: "half", label: "½", span: 6 },
  { value: "full", label: "1", span: 12 }
];
function xl(a, m, t) {
  return t.width ?? a.attributes[m + "." + t.code]?.width ?? "half";
}
const lt = (a) => new Date(a).toLocaleString();
function Vl(a) {
  const m = Math.abs(a.m).toString(), t = a.m < 0 ? "-" : "";
  if (a.e >= 0) return t + m + "0".repeat(a.e);
  const o = -a.e, b = m.padStart(o + 1, "0");
  return t + b.slice(0, b.length - o) + "." + b.slice(b.length - o);
}
function B(a) {
  const t = (a.includes(".") ? a.slice(a.indexOf(".") + 1) : a).replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : a;
}
function ml(a, m) {
  const t = a.properties;
  return re(t?.[m]?.title, re(B(m), "This setting"));
}
function Be(a) {
  return a.labels.en ?? Object.values(a.labels)[0] ?? a.code;
}
function pl(a, m) {
  if (a == null) return "";
  const t = (o) => {
    if (o == null) return "";
    if (typeof o == "object" && "ref" in o) {
      const b = o;
      if (b.ref[0] === "term") {
        const v = b.ref[1].slice(b.ref[1].indexOf(":") + 1), x = b.ref[1].slice(0, b.ref[1].indexOf(":")), p = m?.[x]?.find((h) => h.code === v);
        return p ? Be(p) : v;
      }
      return "Linked " + B(b.ref[0]).toLocaleLowerCase();
    }
    if (typeof o == "object" && "v" in o) {
      const b = o;
      return Vl(b.v) + " " + b.u;
    }
    return typeof o == "object" && "m" in o ? Vl(o) : typeof o == "boolean" ? o ? "Yes" : "No" : typeof o == "object" ? JSON.stringify(o) : re(String(o), "Linked record");
  };
  return Array.isArray(a) ? a.map(t).join(", ") : t(a);
}
function at(a, m, t) {
  const o = pl(m), b = pl(t);
  return !b && o ? `${a} cleared (was ${o})` : o ? `${a}: ${o} → ${b}` : `${a} set to ${b}`;
}
const tt = { class: "pim-table form pim-layout" }, st = {
  key: 0,
  class: "pim-layout-help muted"
}, it = {
  key: 1,
  class: "kx-empty"
}, nt = { class: "pim-aspect-head" }, ot = {
  key: 0,
  class: "muted small"
}, dt = ["draggable", "onDragstart", "onDragover", "onDrop"], rt = { class: "pim-lcard-top" }, ut = {
  key: 0,
  class: "pim-grip",
  "aria-hidden": "true"
}, ct = { class: "pim-lcard-name" }, mt = { class: "pim-lcard-type" }, pt = {
  key: 1,
  class: "pim-lcard-move"
}, vt = { class: "pim-aspect-head" }, ft = { class: "pim-canvas" }, bt = { class: "pim-lcard-top" }, yt = { class: "pim-lcard-name" }, gt = { class: "pim-lcard-type" }, ht = /* @__PURE__ */ ce({
  __name: "LayoutEditor",
  props: {
    draft: {},
    schema: {},
    types: {}
  },
  setup(a) {
    const m = a, t = F(() => m.schema.access.admin), o = F(() => m.draft?.aspects ?? []), b = F(() => new Map(m.types.map((U) => [U.id, sl(U)]))), v = F(() => {
      if (!m.schema) return [];
      const U = new Set((m.draft?.aspects ?? []).map((C) => C.namespace)), u = /* @__PURE__ */ new Map();
      for (const [C, r] of Object.entries(m.schema.attributes)) {
        const A = C.split(".")[0];
        U.has(A) || !r.plugin || (u.has(A) || u.set(A, { aspect: A, plugin: r.plugin, codes: [] }), u.get(A).codes.push(C));
      }
      return [...u.values()];
    });
    function x(U, u) {
      return ul.find((C) => C.value === xl(m.schema, U, u))?.span ?? 6;
    }
    const p = K(null), h = K(null);
    function q(U, u, C) {
      t.value && (p.value = { ns: U, index: u }, C.dataTransfer?.setData("text/plain", U + ":" + u), C.dataTransfer && (C.dataTransfer.effectAllowed = "move"));
    }
    function D(U, u, C) {
      !p.value || p.value.ns !== U || (C.preventDefault(), h.value = { ns: U, index: u });
    }
    function H(U, u) {
      t.value && p.value?.ns === U.namespace && rl(U.attributes ?? [], p.value.index, u), p.value = null, h.value = null;
    }
    function E() {
      p.value = null, h.value = null;
    }
    return (U, u) => (e(), i("div", tt, [
      t.value ? (e(), i("p", st, "Arrange fields within each group and choose their widths. Review changes before applying the layout.")) : y("", !0),
      o.value.length === 0 ? (e(), i("div", it, [
        u[1] || (u[1] = W("This catalog has no field groups yet.", -1)),
        t.value ? (e(), i(L, { key: 0 }, [
          W(" Add a field group in Fields.")
        ], 64)) : y("", !0)
      ])) : y("", !0),
      (e(!0), i(L, null, ee(o.value, (C) => (e(), i("section", {
        key: C.namespace,
        class: "pim-aspect"
      }, [
        l("header", nt, [
          l("h3", null, _(s(B)(C.namespace)), 1),
          t.value ? (e(), i("span", ot, "drag a field, or use its arrows")) : y("", !0)
        ]),
        l("div", {
          class: "pim-canvas",
          onDragover: u[0] || (u[0] = Te(() => {
          }, ["prevent"]))
        }, [
          (e(!0), i(L, null, ee(C.attributes ?? [], (r, A) => (e(), i("div", {
            key: r.code,
            class: Se(["pim-lcard", { dragging: p.value?.ns === C.namespace && p.value?.index === A, over: h.value?.ns === C.namespace && h.value?.index === A }]),
            style: wl({ gridColumn: "span " + x(C.namespace, r) }),
            draggable: t.value,
            onDragstart: (I) => q(C.namespace, A, I),
            onDragover: (I) => D(C.namespace, A, I),
            onDrop: Te((I) => H(C, A), ["prevent"]),
            onDragend: E
          }, [
            l("div", rt, [
              t.value ? (e(), i("span", ut, [
                f(s(te), { icon: "tabler:grip-vertical" })
              ])) : y("", !0),
              l("span", ct, _(s(B)(r.code)), 1),
              l("span", mt, _(b.value.get(r.type) ?? s(sl)(void 0)), 1),
              t.value ? (e(), i("span", pt, [
                f(s(G), {
                  type: "button",
                  disabled: A === 0,
                  "aria-label": "Move " + s(B)(r.code) + " earlier",
                  onClick: (I) => s(rl)(C.attributes ?? [], A, A - 1),
                  class: "kx-iconbtn sm",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    f(s(te), { icon: "tabler:arrow-left" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                f(s(G), {
                  type: "button",
                  disabled: A === (C.attributes ?? []).length - 1,
                  "aria-label": "Move " + s(B)(r.code) + " later",
                  onClick: (I) => s(rl)(C.attributes ?? [], A, A + 1),
                  class: "kx-iconbtn sm",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    f(s(te), { icon: "tabler:arrow-right" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ])) : y("", !0)
            ]),
            f(s(Ul), {
              disabled: !t.value,
              "model-value": s(xl)(a.schema, C.namespace, r),
              options: s(ul),
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Width of " + s(B)(r.code),
              "onUpdate:modelValue": (I) => r.width = I
            }, null, 8, ["disabled", "model-value", "options", "aria-label", "onUpdate:modelValue"])
          ], 46, dt))), 128))
        ], 32)
      ]))), 128)),
      (e(!0), i(L, null, ee(v.value, (C) => (e(), i("section", {
        key: C.aspect,
        class: "pim-aspect"
      }, [
        l("header", vt, [
          l("h3", null, _(s(B)(C.aspect)), 1),
          u[2] || (u[2] = l("span", { class: "muted small" }, "Provided by a plugin", -1))
        ]),
        l("div", ft, [
          (e(!0), i(L, null, ee(C.codes, (r) => (e(), i("div", {
            key: r,
            class: "pim-lcard fixed",
            style: wl({ gridColumn: "span " + (s(ul).find((A) => A.value === a.schema.attributes[r].width)?.span ?? 6) })
          }, [
            l("div", bt, [
              l("span", yt, _(s(B)(r)), 1),
              l("span", gt, _(b.value.get(a.schema.attributes[r].type) ?? s(sl)(void 0)), 1)
            ])
          ], 4))), 128))
        ])
      ]))), 128))
    ]));
  }
}), kt = {
  class: "pim-history",
  "aria-label": "Catalog history"
}, _t = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, wt = { class: "pim-table pim-responsive-table" }, $t = ["id"], Ct = ["aria-labelledby"], xt = {
  key: 0,
  scope: "col"
}, Vt = { class: "muted small" }, Ut = ["datetime"], jt = {
  key: 0,
  class: "small"
}, St = {
  key: 0,
  class: "muted"
}, At = { class: "mono small" }, Rt = {
  key: 0,
  class: "muted"
}, It = {
  key: 0,
  class: "muted small"
}, Ot = ["aria-labelledby"], Tt = { class: "pim-stacked-meta muted small" }, Pt = { key: 0 }, qt = { key: 1 }, Dt = ["datetime"], Nt = {
  key: 1,
  class: "kx-empty"
}, zt = { class: "pim-table-foot" }, Ft = /* @__PURE__ */ ce({
  __name: "HistoryPanel",
  props: {
    catalogId: {},
    canResolveActors: { type: Boolean }
  },
  setup(a) {
    const m = a, t = K([]), o = K({}), b = K(), v = K(!1), x = K(), p = Ye(), h = Ne(), q = F(() => t.value.map((u) => ({
      key: `${u.seq}:${u.n}`,
      at: u.at,
      date: lt(u.at),
      actor: o.value[u.actor] ?? re(u.actor, "Person"),
      source: u.source ? re(B(u.source), "Data source") : "",
      product: H(u),
      context: u.ctx ? re(u.ctx, "Product context") : "",
      change: E(u)
    })));
    async function D(u = !1) {
      const C = p.begin();
      v.value = !0, x.value = void 0;
      try {
        const r = await be.history(m.catalogId, { limit: 50, before: u ? b.value : void 0 });
        if (!p.current(C)) return;
        if (t.value = u ? [...t.value, ...r.entries] : r.entries, b.value = r.next, m.canResolveActors)
          try {
            const A = await Ql(m.catalogId, r.entries.map((I) => I.actor));
            p.current(C) && (o.value = { ...o.value, ...A });
          } catch {
          }
      } catch (r) {
        if (!p.current(C)) return;
        x.value = Ee(r, "Could not load the history.");
      } finally {
        p.current(C) && (v.value = !1);
      }
    }
    function H(u) {
      return u.sku ? u.sku : u.subject.startsWith("p:") ? "purged product" : u.subject.startsWith("t:") ? u.subject.slice(2) : u.subject.startsWith("r:") ? "Release" : re(u.subject, "Catalog");
    }
    function E(u) {
      if (u.attribute)
        return at(B(u.attribute), u.before, u.after);
      switch (u.kind) {
        case "schema":
          return "Catalog settings applied";
        case "term": {
          const C = u.after ?? {}, r = C.labels?.en ?? Object.values(C.labels ?? {})[0];
          return C.retired ? "Term retired" : r ? `Term labelled "${r}"` + (C.parent ? ` under ${C.parent}` : "") : "Term changed";
        }
        case "created": {
          const C = u.after ?? {};
          return `Created as ${B(C.family ?? "product")}` + (C.level ? ` at level ${C.level}` : "");
        }
        case "released": {
          const C = u.after ?? {};
          return `Released v${C.version ?? ""} to ${(C.channels ?? []).join(", ")}`;
        }
        case "withdrawn":
          return `Withdrawn from ${((u.after ?? {}).channels ?? []).join(", ")}`;
        case "status":
          return `Status ${String(u.before ?? "")} → ${String(u.after ?? "")}`;
        case "moved":
          return "Moved under another parent";
        default:
          return B(u.kind);
      }
    }
    let U = () => {
    };
    return fe(() => m.catalogId, () => {
      U(), p.begin(), t.value = [], o.value = {}, b.value = void 0, x.value = void 0, U = Gl(`component.${m.catalogId}`, () => {
        D();
      });
    }, { immediate: !0 }), fe(() => m.catalogId, () => {
      D();
    }), vl(() => D()), Xe(() => {
      U(), p.begin();
    }), (u, C) => (e(), i("section", kt, [
      x.value ? (e(), T(fl, {
        key: 0,
        error: x.value
      }, {
        default: w(() => [
          f(s(G), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: C[0] || (C[0] = (r) => D())
          }, {
            default: w(() => [...C[2] || (C[2] = [
              W("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : y("", !0),
      v.value ? (e(), i("div", _t, "Loading history…")) : y("", !0),
      l("div", wt, [
        l("p", {
          id: s(h),
          class: "pim-history-caption muted small"
        }, "Catalog changes, newest first", 8, $t),
        q.value.length ? (e(), i(L, { key: 0 }, [
          l("table", {
            class: "pim-grid",
            "aria-labelledby": s(h)
          }, [
            l("thead", null, [
              l("tr", null, [
                C[3] || (C[3] = l("th", { scope: "col" }, "When", -1)),
                a.canResolveActors ? (e(), i("th", xt, "Who")) : y("", !0),
                C[4] || (C[4] = l("th", { scope: "col" }, "What", -1)),
                C[5] || (C[5] = l("th", { scope: "col" }, "Change", -1))
              ])
            ]),
            l("tbody", null, [
              (e(!0), i(L, null, ee(q.value, (r) => (e(), i("tr", {
                key: r.key
              }, [
                l("td", Vt, [
                  l("time", {
                    datetime: r.at
                  }, _(r.date), 9, Ut)
                ]),
                a.canResolveActors ? (e(), i("td", jt, [
                  W(_(r.actor), 1),
                  r.source ? (e(), i("span", St, " via " + _(r.source), 1)) : y("", !0)
                ])) : y("", !0),
                l("td", At, [
                  W(_(r.product), 1),
                  r.context ? (e(), i("span", Rt, " · " + _(r.context), 1)) : y("", !0)
                ]),
                l("td", null, [
                  W(_(r.change), 1),
                  !a.canResolveActors && r.source ? (e(), i("span", It, " via " + _(r.source), 1)) : y("", !0)
                ])
              ]))), 128))
            ])
          ], 8, Ct),
          l("ol", {
            role: "list",
            class: "pim-stacked-list",
            "aria-labelledby": s(h)
          }, [
            (e(!0), i(L, null, ee(q.value, (r) => (e(), i("li", {
              key: r.key,
              class: "pim-stacked-row"
            }, [
              l("div", null, _(r.change), 1),
              l("div", Tt, [
                a.canResolveActors ? (e(), i("span", Pt, [
                  l("span", null, _(r.actor), 1),
                  r.source ? (e(), i(L, { key: 0 }, [
                    W(" via " + _(r.source), 1)
                  ], 64)) : y("", !0)
                ])) : r.source ? (e(), i("span", qt, "Via " + _(r.source), 1)) : y("", !0),
                l("time", {
                  datetime: r.at
                }, _(r.date), 9, Dt),
                l("span", null, [
                  W(_(r.product), 1),
                  r.context ? (e(), i(L, { key: 0 }, [
                    W(" · " + _(r.context), 1)
                  ], 64)) : y("", !0)
                ])
              ])
            ]))), 128))
          ], 8, Ot)
        ], 64)) : !v.value && !x.value ? (e(), i("div", Nt, "Nothing recorded yet.")) : y("", !0),
        l("div", zt, [
          l("span", null, _(q.value.length) + " change" + _(q.value.length === 1 ? "" : "s") + " shown", 1),
          b.value ? (e(), T(s(G), {
            key: 0,
            type: "button",
            disabled: v.value,
            onClick: C[1] || (C[1] = (r) => D(!0)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: w(() => [
              f(s(te), {
                icon: "tabler:adjustments",
                "aria-hidden": "true"
              }),
              C[6] || (C[6] = W(" Load older", -1))
            ]),
            _: 1
          }, 8, ["disabled"])) : y("", !0)
        ])
      ])
    ]));
  }
}), Bt = { class: "system-section-head" }, Lt = { class: "system-section-head-text" }, Et = {
  key: 0,
  class: "kx-head-actions"
}, Mt = /* @__PURE__ */ ce({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(a) {
    return (m, t) => (e(), i("header", Bt, [
      l("div", Lt, [
        l("h1", null, _(a.title), 1),
        l("p", null, _(a.description), 1)
      ]),
      m.$slots.actions ? (e(), i("div", Et, [
        je(m.$slots, "actions")
      ])) : y("", !0)
    ]));
  }
}), Wt = /* @__PURE__ */ ce({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(a) {
    return (m, t) => (e(), i(L, null, [
      f(s(he), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      f(s(G), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: a.busy || a.discardDisabled,
        onClick: t[0] || (t[0] = (o) => m.$emit("discard"))
      }, {
        icon: w(() => [
          f(s(te), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      f(s(G), {
        label: "Review changes",
        type: "button",
        disabled: a.busy || a.reviewDisabled,
        loading: a.busy,
        onClick: t[1] || (t[1] = (o) => m.$emit("review", o.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), Ht = ["onKeydown"], Jt = { class: "row pim-add-actions" }, Kt = ["id"], Pe = /* @__PURE__ */ ce({
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
    const t = a, o = m, b = K(""), v = K(!1), x = K(), p = Ne(), h = F(() => {
      const u = b.value.trim();
      return t.fromName ? et(u) : u;
    }), q = F(() => b.value.trim() ? t.existing?.includes(h.value) ? t.fromName ? "This name is already in use." : "This code is already in use." : t.fromName && !El.test(h.value) ? "Use a name that starts with a letter from A to Z." : El.test(h.value) ? "" : "Start with a lowercase letter and use only lowercase letters, numbers or underscores." : ""), D = F(() => !!h.value && !q.value);
    async function H() {
      v.value = !0, await Ze(), x.value?.querySelector("input")?.focus();
    }
    async function E() {
      v.value = !1, b.value = "", await Ze(), x.value?.querySelector("button")?.focus();
    }
    function U() {
      D.value && (o("add", h.value), E());
    }
    return (u, C) => (e(), i("div", {
      ref_key: "row",
      ref: x,
      class: "row pim-add-row"
    }, [
      v.value ? (e(), i("div", {
        key: 1,
        class: "row pim-add-editor",
        onKeydown: il(Te(E, ["stop", "prevent"]), ["esc"])
      }, [
        f(s(Qe), {
          modelValue: b.value,
          "onUpdate:modelValue": C[0] || (C[0] = (r) => b.value = r),
          type: "text",
          placeholder: a.label,
          "aria-label": a.label,
          invalid: !!q.value,
          "aria-describedby": q.value ? s(p) : void 0,
          class: Se({ mono: !a.fromName }),
          onKeydown: il(Te(U, ["prevent"]), ["enter"])
        }, null, 8, ["modelValue", "placeholder", "aria-label", "invalid", "aria-describedby", "class", "onKeydown"]),
        l("div", Jt, [
          f(s(G), {
            type: "button",
            disabled: !D.value,
            onClick: U
          }, {
            default: w(() => [
              W(_(a.action), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          f(s(G), {
            type: "button",
            label: "Cancel",
            outlined: "",
            severity: "secondary",
            onClick: E
          })
        ]),
        q.value ? (e(), i("p", {
          key: 0,
          id: s(p),
          role: "status",
          class: "pim-add-code-error small"
        }, _(q.value), 9, Kt)) : y("", !0)
      ], 40, Ht)) : (e(), T(s(G), {
        key: 0,
        type: "button",
        "aria-expanded": "false",
        severity: "secondary",
        outlined: "",
        size: a.regular ? void 0 : "small",
        onClick: H
      }, {
        default: w(() => [
          f(s(te), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          W(" " + _(a.action), 1)
        ]),
        _: 1
      }, 8, ["size"])),
      je(u.$slots, "default")
    ], 512));
  }
}), Xl = Symbol("definitionColumns"), Gt = { code: "Code", kind: "Kind", details: "Details", usage: "Used by" }, Yt = {
  code: "minmax(120px, 1fr)",
  kind: "140px",
  details: "minmax(120px, 1.2fr)",
  usage: "120px"
}, Zt = {
  class: "pim-definition-scroll",
  tabindex: "0",
  "aria-label": "Definitions"
}, Qt = { class: "pim-definition-grid" }, Xt = {
  key: 0,
  class: "pim-definition-columns",
  "aria-hidden": "true"
}, es = { class: "pim-definition-actions-heading" }, qe = /* @__PURE__ */ ce({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: { default: () => ["code"] },
    showActions: { type: Boolean }
  },
  setup(a) {
    const m = a;
    Hl(Xl, F(() => m.columns));
    const t = F(() => ["48px", "minmax(160px, 1.4fr)", ...m.columns.map((o) => Yt[o]), m.showActions ? "100px" : "80px"].join(" "));
    return (o, b) => (e(), i("section", {
      class: "form pim-definition-list",
      style: wl({ "--pim-definition-columns": t.value })
    }, [
      je(o.$slots, "head"),
      l("div", Zt, [
        l("div", Qt, [
          a.count > 3 ? (e(), i("div", Xt, [
            b[0] || (b[0] = l("span", null, null, -1)),
            b[1] || (b[1] = l("span", null, "Name", -1)),
            (e(!0), i(L, null, ee(a.columns, (v) => (e(), i("span", {
              key: v,
              class: Se("pim-definition-" + v)
            }, _(s(Gt)[v]), 3))), 128)),
            l("span", es, _(a.showActions ? "Actions" : ""), 1)
          ])) : y("", !0),
          je(o.$slots, "default")
        ])
      ]),
      je(o.$slots, "add")
    ], 4));
  }
}), ls = ["aria-label"], as = /* @__PURE__ */ ce({
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
    ], 8, ls));
  }
}), ea = Symbol("section row"), ts = { class: "pim-definition" }, ss = {
  class: "pim-definition-lead",
  "data-column": "lead"
}, is = {
  class: "pim-row-title",
  "data-column": "name"
}, ns = { class: "pim-definition-meta" }, os = ["data-column"], ds = {
  key: 0,
  class: "mono"
}, rs = {
  class: "pim-definition-actions",
  "data-column": "actions"
}, us = ["id"], De = /* @__PURE__ */ ce({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ $l({
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
    const m = a, t = Fl(Xl, F(() => [
      ...m.code ? ["code"] : [],
      ...m.kind ? ["kind"] : []
    ])), o = Jl(a, "open"), b = Ne(), v = Fl(ea, void 0);
    function x(h) {
      return !!m.routeSection && !!m.routeId && h === m.routeSection + "/" + m.routeId;
    }
    fe(() => v?.selected.value, (h, q) => {
      x(h) ? o.value = !0 : x(q) && (o.value = !1);
    }, { immediate: !0 });
    function p() {
      const h = !o.value;
      o.value = h, m.routeSection && m.routeId && v?.choose(m.routeSection, m.routeId, h);
    }
    return (h, q) => (e(), i("section", ts, [
      l("header", {
        class: Se(["pim-definition-head", a.headClass])
      }, [
        f(as, {
          class: Se(["pim-definition-toggle", a.toggleClass]),
          "aria-expanded": o.value,
          "aria-controls": o.value ? s(b) : void 0,
          onClick: p
        }, {
          default: w(() => [
            l("span", ss, [
              f(s(te), {
                icon: "tabler:chevron-right",
                class: "pim-definition-chevron",
                "aria-hidden": "true"
              })
            ]),
            l("span", is, _(a.title), 1),
            l("span", ns, [
              (e(!0), i(L, null, ee(s(t), (D) => (e(), i("span", {
                key: D,
                class: Se("pim-definition-" + D),
                "data-column": D
              }, [
                D === "code" && a.code ? (e(), i("code", ds, _(a.code), 1)) : D === "kind" && a.kind ? (e(), T(s(he), {
                  key: 1,
                  severity: "secondary",
                  value: a.kind
                }, null, 8, ["value"])) : D === "details" ? je(h.$slots, "details", {}, void 0, void 0, 2) : D === "usage" ? je(h.$slots, "usage", {}, () => [
                  W(_(a.usage), 1)
                ], void 0, 3) : y("", !0)
              ], 10, os))), 128))
            ])
          ]),
          _: 3
        }, 8, ["class", "aria-expanded", "aria-controls"]),
        l("div", rs, [
          je(h.$slots, "actions")
        ])
      ], 2),
      f(Ra, { name: "pim-expand" }, {
        default: w(() => [
          o.value ? (e(), i("div", {
            key: 0,
            id: s(b),
            class: "pim-definition-body"
          }, [
            je(h.$slots, "default")
          ], 8, us)) : y("", !0)
        ]),
        _: 3
      })
    ]));
  }
}), cs = { class: "pim-chips pim-picker-chips" }, ms = {
  key: 0,
  class: "muted"
}, ps = {
  key: 0,
  class: "muted small"
}, vs = {
  key: 0,
  class: "muted"
}, fs = {
  key: 0,
  class: "muted"
}, Re = /* @__PURE__ */ ce({
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
    const t = a, o = m, b = K("");
    function v(H) {
      return t.modelValue.includes(H);
    }
    function x(H) {
      t.disabled || !H || o("update:modelValue", v(H) ? t.modelValue.filter((E) => E !== H) : [...t.modelValue, H]);
    }
    function p() {
      const H = b.value.trim();
      if (!H || v(H)) {
        b.value = "";
        return;
      }
      o("update:modelValue", [...t.modelValue, H]), b.value = "";
    }
    function h(H) {
      o("update:modelValue", t.modelValue.filter((E) => E !== H));
    }
    const q = F(() => t.modelValue.map((H) => t.options?.find((E) => E.value === H) ?? { value: H }));
    function D(H) {
      const E = H.label ?? H.value;
      return H.detail ? E + " " + H.detail : E;
    }
    return (H, E) => (e(), i("div", cs, [
      a.disabled ? (e(), i(L, { key: 0 }, [
        (e(!0), i(L, null, ee(q.value, (U) => (e(), i("span", {
          key: U.value
        }, [
          W(_(U.label ?? U.value) + " ", 1),
          U.detail ? (e(), i("small", ms, _(U.detail), 1)) : y("", !0)
        ]))), 128)),
        a.modelValue.length ? y("", !0) : (e(), i("span", ps, "None"))
      ], 64)) : a.options && (a.dropdown || a.options.length > 10) ? (e(), i(L, { key: 1 }, [
        (e(!0), i(L, null, ee(q.value, (U) => (e(), i("span", {
          key: U.value,
          class: "row"
        }, [
          l("span", null, [
            W(_(U.label ?? U.value) + " ", 1),
            U.detail ? (e(), i("small", vs, _(U.detail), 1)) : y("", !0)
          ]),
          f(s(G), {
            type: "button",
            "aria-label": "Remove " + D(U),
            onClick: (u) => h(U.value),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: w(() => [
              f(s(te), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128)),
        a.disabled ? y("", !0) : (e(), T(s(xe), {
          key: 0,
          "model-value": null,
          placeholder: a.placeholder ?? "Add…",
          "aria-labelledby": a.labelledby,
          "aria-label": a.placeholder ?? "Add",
          "onUpdate:modelValue": E[0] || (E[0] = (U) => x(U)),
          class: "pim-chip-entry",
          options: a.options.filter((U) => !v(U.value)),
          "option-label": D,
          "option-value": "value",
          appendTo: "self"
        }, {
          option: w(({ option: U }) => [
            l("span", null, [
              W(_(U.label ?? U.value) + " ", 1),
              U.detail ? (e(), i("small", fs, _(U.detail), 1)) : y("", !0)
            ])
          ]),
          _: 1
        }, 8, ["placeholder", "aria-labelledby", "aria-label", "options"]))
      ], 64)) : a.options ? (e(), i(L, { key: 2 }, [
        f(s(Ul), {
          "model-value": a.modelValue.filter((U) => a.options.some((u) => u.value === U)),
          options: a.options.map((U) => ({ value: U.value, label: U.label ?? U.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          disabled: a.disabled,
          "aria-labelledby": a.labelledby,
          "aria-label": a.placeholder ?? "Selected values",
          "onUpdate:modelValue": E[1] || (E[1] = (U) => o("update:modelValue", [...U, ...a.modelValue.filter((u) => !a.options.some((C) => C.value === u))]))
        }, null, 8, ["model-value", "options", "disabled", "aria-labelledby", "aria-label"]),
        (e(!0), i(L, null, ee(a.modelValue.filter((U) => !a.options.some((u) => u.value === U)), (U) => (e(), i("span", {
          key: U,
          class: "row"
        }, [
          W(_(U), 1),
          f(s(G), {
            type: "button",
            "aria-label": "Remove " + U,
            onClick: (u) => h(U),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: w(() => [
              f(s(te), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128))
      ], 64)) : (e(!0), i(L, { key: 3 }, ee(a.modelValue, (U) => (e(), i("span", {
        key: U,
        class: "row"
      }, [
        W(_(U), 1),
        f(s(G), {
          type: "button",
          "aria-label": "Remove " + U,
          onClick: (u) => h(U),
          size: "small",
          text: "",
          severity: "secondary"
        }, {
          default: w(() => [
            f(s(te), { icon: "tabler:x" })
          ]),
          _: 1
        }, 8, ["aria-label", "onClick"])
      ]))), 128)),
      a.free && !a.disabled ? (e(), T(s(Qe), {
        key: 4,
        modelValue: b.value,
        "onUpdate:modelValue": E[2] || (E[2] = (U) => b.value = U),
        type: "text",
        "aria-labelledby": a.labelledby,
        placeholder: a.placeholder ?? "Add…",
        onKeydown: il(Te(p, ["prevent"]), ["enter"]),
        onBlur: p,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "aria-labelledby", "placeholder", "onKeydown"])) : y("", !0)
    ]));
  }
}), bs = { key: 0 }, ys = {
  key: 0,
  class: "pim-config-overrides"
}, gs = {
  key: 1,
  class: "muted small"
}, hs = { key: 3 }, ks = ["schema", "config"], _s = {
  key: 1,
  class: "muted small",
  role: "status"
}, jl = /* @__PURE__ */ ce({
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
    const t = a, o = m, b = K("pending"), v = F(() => {
      const q = t.schema.properties;
      return !q || typeof q != "object" ? t.schema : {
        ...t.schema,
        properties: Object.fromEntries(Object.entries(q).map(([D, H]) => [
          D,
          H && typeof H == "object" ? { ...H, title: ml(t.schema, D) } : H
        ]))
      };
    }), x = F(() => Object.entries(t.modelValue).map(([q, D]) => ({
      key: q,
      label: ml(t.schema, q),
      value: D !== null && typeof D == "object" ? JSON.stringify(D) : pl(D)
    })));
    async function p() {
      b.value = "pending", b.value = await Ml("wc-schema-form") ? "ready" : "failed";
    }
    fe(() => t.disabled, (q) => {
      q || p();
    }, { immediate: !0 });
    function h(q) {
      const D = q.detail;
      D && typeof D == "object" && !Array.isArray(D) && o("update:modelValue", D);
    }
    return (q, D) => (e(), i(L, null, [
      a.refusal || a.problem ? (e(), T(s(Ve), {
        key: 0,
        severity: "warn",
        role: "alert"
      }, {
        default: w(() => [
          a.refusal ? (e(), i(L, { key: 0 }, [
            W(_(a.refusal), 1)
          ], 64)) : a.problemLabel ? (e(), i(L, { key: 1 }, [
            W(_(a.problemLabel) + " is required. Enter a value below.", 1)
          ], 64)) : (e(), i(L, { key: 2 }, [
            W("The saved settings don’t meet the plugin’s requirements. Update the configuration below.")
          ], 64))
        ]),
        _: 1
      })) : y("", !0),
      a.problem ? (e(), T(Ce, {
        key: 1,
        class: "small pim-error-code pim-ia-disclosure",
        label: "Technical details"
      }, {
        default: w(() => [
          a.pluginId ? (e(), i("p", bs, [
            D[1] || (D[1] = W("Plugin ", -1)),
            l("code", null, _(a.pluginId), 1)
          ])) : y("", !0),
          l("p", null, _(a.problem.message), 1)
        ]),
        _: 1
      })) : y("", !0),
      a.disabled ? (e(), i(L, { key: 2 }, [
        x.value.length ? (e(), i("dl", ys, [
          (e(!0), i(L, null, ee(x.value, (H) => (e(), i(L, {
            key: H.key
          }, [
            l("dt", null, _(H.label), 1),
            l("dd", null, _(H.value), 1)
          ], 64))), 128))
        ])) : (e(), i("span", gs, "No overrides"))
      ], 64)) : (e(), i("div", hs, [
        b.value === "ready" ? (e(), i("wc-schema-form", {
          key: 0,
          schema: JSON.stringify(v.value),
          config: JSON.stringify(a.modelValue),
          onConfigChanged: h
        }, null, 40, ks)) : b.value === "pending" ? (e(), i("span", _s, "Configuration form is loading.")) : (e(), T(s(Ve), {
          key: 2,
          role: "alert",
          severity: "error"
        }, {
          default: w(() => [
            D[3] || (D[3] = W("Configuration form could not be loaded. ", -1)),
            f(s(G), {
              type: "button",
              onClick: p,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: w(() => [...D[2] || (D[2] = [
                W("Retry", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })),
        a.problem ? y("", !0) : (e(), T(s(G), {
          key: 3,
          type: "button",
          onClick: D[0] || (D[0] = (H) => o("update:modelValue", {})),
          severity: "secondary",
          outlined: "",
          size: "small"
        }, {
          default: w(() => [
            f(s(te), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            }),
            D[4] || (D[4] = W(" Reset overrides", -1))
          ]),
          _: 1
        }))
      ]))
    ], 64));
  }
}), ws = { key: 0 }, $s = /* @__PURE__ */ ce({
  __name: "DefaultValue",
  props: {
    attribute: {},
    type: {},
    disabled: { type: Boolean }
  },
  emits: ["change"],
  setup(a, { emit: m }) {
    const t = a, o = m, b = F(() => {
      const h = t.type?.form;
      let q = { type: "string" };
      return h === "bool" ? q = { type: "boolean" } : h === "int" ? q = { type: "integer" } : h === "dec" ? q = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : h === "quantity" ? q = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(t.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : h === "record" ? q = { type: "object", additionalProperties: !0 } : h === "ref" && (q = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${t.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (t.attribute.cardinality ?? "one") !== "one" && (q = { type: "array", items: q, uniqueItems: t.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...q, title: "Default value" } } };
    });
    function v(h) {
      return h && typeof h == "object" && "m" in h && "e" in h ? Vl(h) : h;
    }
    function x(h) {
      return t.type?.form === "dec" ? v(h) : t.type?.form === "quantity" && h && typeof h == "object" && "v" in h && "u" in h ? { value: v(h.v), unit: h.u } : h;
    }
    const p = F(() => t.attribute.default === void 0 ? {} : { value: Array.isArray(t.attribute.default) ? t.attribute.default.map(x) : x(t.attribute.default) });
    return (h, q) => a.disabled ? (e(), i("span", ws, _(a.attribute.default == null ? "No default" : s(pl)(a.attribute.default)), 1)) : (e(), T(jl, {
      key: 1,
      schema: b.value,
      "model-value": p.value,
      "onUpdate:modelValue": q[0] || (q[0] = (D) => o("change", D.value))
    }, null, 8, ["schema", "model-value"]));
  }
}), Cs = { class: "pim-stack" }, xs = {
  key: 0,
  class: "pim-ia-action"
}, Vs = {
  key: 1,
  class: "form pim-card-body pad muted"
}, Us = { class: "pim-bsection-head pim-list-header" }, js = { class: "small muted" }, Ss = { class: "row pim-list-actions" }, As = { class: "pim-fields" }, Rs = { class: "pim-f pim-w-third" }, Is = { class: "pim-f-label" }, Os = ["id"], Ts = { class: "pim-f pim-w-third" }, Ps = { class: "pim-f-label" }, qs = ["id"], Ds = {
  key: 0,
  class: "pim-f pim-w-third"
}, Ns = { class: "pim-f-label" }, zs = ["id"], Fs = {
  key: 1,
  class: "pim-f pim-w-full muted small"
}, Bs = {
  key: 2,
  class: "pim-f pim-w-full muted small"
}, Ls = {
  key: 3,
  class: "pim-f pim-w-third"
}, Es = { class: "pim-f-label" }, Ms = ["id"], Ws = { class: "pim-f pim-w-third" }, Hs = { class: "pim-f-label" }, Js = ["id"], Ks = { class: "pim-f pim-w-half" }, Gs = { class: "pim-f-label" }, Ys = ["id"], Zs = ["aria-labelledby"], Qs = { class: "pim-f-label" }, Xs = ["id"], ei = ["aria-labelledby"], li = { class: "pim-f-label" }, ai = ["id"], ti = { class: "pim-fields" }, si = { class: "pim-f pim-w-third" }, ii = { class: "pim-f-label" }, ni = ["for"], oi = {
  key: 0,
  class: "pim-f-note"
}, di = { class: "pim-f pim-w-third" }, ri = { class: "pim-f-label" }, ui = ["id"], ci = { class: "pim-f pim-w-half" }, mi = { class: "pim-f-label" }, pi = ["for"], vi = { class: "row" }, fi = {
  key: 0,
  class: "pim-f pim-w-full"
}, bi = { class: "pim-f-label" }, yi = ["id"], gi = ["aria-labelledby"], hi = ["id"], ki = {
  key: 0,
  class: "row end"
}, _i = { class: "pim-ia-dialog-head" }, wi = {
  tabindex: "-1",
  autofocus: ""
}, $i = { class: "pim-source-permissions" }, Ci = ["id"], xi = { class: "dialog-actions pim-group-dialog-actions" }, Vi = /* @__PURE__ */ ce({
  __name: "BuilderFields",
  props: /* @__PURE__ */ $l({
    draft: {},
    schema: {},
    options: {}
  }, {
    family: { default: "" },
    familyModifiers: {}
  }),
  emits: /* @__PURE__ */ $l(["remove"], ["update:family"]),
  setup(a, { emit: m }) {
    const t = a, o = Jl(a, "family"), b = m, v = ul.map((R) => R.value), x = [{ value: "one", label: "Single value" }, { value: "list", label: "Ordered list" }, { value: "set", label: "Unique set" }], p = F(() => t.schema.access.admin), h = F(() => t.draft.aspects ?? []), q = F(() => (t.draft.families ?? []).filter((R) => R.code !== "generic"));
    fe(q, (R) => {
      o.value && !R.some((O) => O.code === o.value) && (o.value = "");
    }, { immediate: !0 });
    const D = F(() => [{ value: "", label: "All families" }, ...q.value.map((R) => ({ value: R.code, label: B(R.code) }))]), H = F(() => {
      const R = q.value.find((O) => O.code === o.value);
      return R ? h.value.filter((O) => R.aspects?.includes(O.namespace)) : h.value;
    }), E = F(() => (t.draft.dimensions ?? []).map((R) => ({ value: R.name, label: B(R.name) }))), U = F(() => (t.draft.vocabularies ?? []).map((R) => R.code)), u = F(() => (t.draft.sources ?? []).map((R) => ({ value: R.id, label: B(R.id) }))), C = F(() => [...t.options.types].sort((R, O) => R.form.localeCompare(O.form)).map((R) => ({ value: R.id, label: sl(R) })));
    function r(R) {
      return t.options.types.find((O) => O.id === R.type);
    }
    function A(R) {
      return r(R)?.target === "term";
    }
    function I(R) {
      return r(R)?.target === "asset";
    }
    function M(R) {
      const O = r(R);
      return !!O && O.form === "ref" && !O.target;
    }
    function me(R) {
      return q.value.filter((O) => O.aspects?.includes(R)).map((O) => B(O.code));
    }
    function we(R) {
      const O = me(R);
      return O.length ? O.length === 1 ? O[0] : O.length + " families" : "Unused by families";
    }
    const ne = { none: "None", key: "Exact match", number: "Number range", text: "Text search" }, Y = K({}), P = Ne(), Z = /* @__PURE__ */ new WeakMap();
    let N = 0;
    function S(R, O) {
      if (O.id !== void 0) return R + "." + O.id;
      const z = Ia(O);
      let V = Z.get(z);
      return V === void 0 && (V = ++N, Z.set(z, V)), R + ".draft-" + V;
    }
    function d(R, O, z) {
      return P + "-" + S(R, O) + "-" + z;
    }
    function $(R, O) {
      R.type = O;
      const z = r(R);
      if (z && R.index && !z.indexes.includes(R.index) && delete R.index, A(R) || delete R.vocabulary, I(R) && delete R.default, !M(R) && R.config && "target" in R.config) {
        const { target: V, ...de } = R.config;
        R.config = Object.keys(de).length ? de : void 0, R.config || delete R.config;
      }
    }
    function n(R, O) {
      Object.keys(O).length ? R.config = O : delete R.config;
    }
    function k(R, O) {
      const z = { ...R.config ?? {} };
      O ? z.target = O : delete z.target, n(R, z);
    }
    function X(R, O) {
      O.length ? R.scope = O : delete R.scope, O.length || delete R.index_contexts;
    }
    function Q(R, O, z) {
      z === void 0 || z === "" || z === !1 && O !== "default" ? delete R[O] : R[O] = z;
    }
    function se(R) {
      return R.index_contexts ?? [];
    }
    function ve(R) {
      return (t.draft.dimensions ?? []).find((O) => O.name === R)?.members ?? [];
    }
    function el(R) {
      const O = {};
      for (const V of R.scope ?? []) O[V] = ve(V)[0] ?? "";
      (R.index_contexts ?? (R.index_contexts = [])).push(O);
    }
    const le = K(), ge = F(() => le.value ? B(le.value.namespace) + " settings" : "");
    async function ye(R, O, z, V) {
      const de = R.currentTarget, J = de.parentElement;
      rl(O, z, V), await Ze(), (de.isConnected ? de : J?.querySelector("button"))?.focus({ preventScroll: !0 });
    }
    function pe(R) {
      (t.draft.aspects ??= []).push({ namespace: R, attributes: [] });
    }
    function Me(R) {
      le.value = void 0;
      const O = h.value.indexOf(R);
      O >= 0 && h.value.splice(O, 1), t.schema.declaration.aspects?.some((z) => z.namespace === R.namespace) && b("remove", "aspects", R.namespace);
    }
    function We(R, O) {
      const z = t.options.types.find((de) => de.id === "kickside.pim.types:text") ?? t.options.types[0], V = { code: O, type: z?.id ?? "" };
      (R.attributes ??= []).push(V), Y.value[S(R.namespace, V)] = !0;
    }
    function ol(R, O) {
      const z = R.attributes ?? [], V = z.indexOf(O);
      V >= 0 && z.splice(V, 1);
      const de = O.id === void 0 ? void 0 : t.schema.declaration.aspects?.find((J) => J.namespace === R.namespace)?.attributes?.find((J) => J.id === O.id);
      de && b("remove", "attributes", R.namespace + "." + de.code);
    }
    return (R, O) => (e(), i("div", Cs, [
      q.value.length || p.value && !o.value ? (e(), i("div", xs, [
        q.value.length ? (e(), T(s(xe), {
          key: 0,
          modelValue: o.value,
          "onUpdate:modelValue": O[0] || (O[0] = (z) => o.value = z),
          class: "pim-family-filter",
          "aria-label": "Show fields for a family",
          placeholder: "All families",
          options: D.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self"
        }, null, 8, ["modelValue", "options"])) : y("", !0),
        p.value && !o.value ? (e(), T(Pe, {
          key: 1,
          label: "Field group name",
          action: "Add field group",
          "from-name": "",
          regular: "",
          existing: h.value.map((z) => z.namespace),
          onAdd: pe
        }, null, 8, ["existing"])) : y("", !0)
      ])) : y("", !0),
      o.value && !H.value.length ? (e(), i("p", Vs, "This family has no field groups yet. Open the family to choose which groups it uses.")) : y("", !0),
      (e(!0), i(L, null, ee(H.value, (z) => (e(), T(qe, {
        key: z.namespace,
        count: z.attributes?.length ?? 0,
        columns: ["kind", "details", "usage"],
        "show-actions": p.value
      }, {
        head: w(() => [
          l("header", Us, [
            l("div", null, [
              l("h3", null, _(s(B)(z.namespace)), 1),
              l("p", js, _(me(z.namespace).length ? "Used by " + me(z.namespace).join(", ") : "Unused by families"), 1)
            ]),
            l("div", Ss, [
              p.value ? (e(), T(Pe, {
                key: 0,
                label: "Field name",
                action: "Add field",
                "from-name": "",
                existing: z.attributes?.map((V) => V.code),
                onAdd: (V) => We(z, V)
              }, null, 8, ["existing", "onAdd"])) : y("", !0),
              f(s(G), {
                type: "button",
                "aria-label": s(B)(z.namespace) + " settings",
                title: s(B)(z.namespace) + " settings",
                "aria-haspopup": "dialog",
                severity: "secondary",
                text: "",
                size: "small",
                onClick: (V) => le.value = z
              }, {
                default: w(() => [
                  f(s(te), {
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
          (e(!0), i(L, null, ee(z.attributes ?? [], (V, de) => (e(), T(De, {
            "route-section": "fields",
            "route-id": V.id === void 0 ? void 0 : S(z.namespace, V),
            key: S(z.namespace, V),
            open: Y.value[S(z.namespace, V)],
            "onUpdate:open": (J) => Y.value[S(z.namespace, V)] = J,
            title: s(B)(V.code),
            kind: s(sl)(r(V)),
            usage: we(z.namespace),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle"
          }, _e({
            details: w(() => [
              V.cardinality && V.cardinality !== "one" ? (e(), T(s(he), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [
                  W(_(x.find((J) => J.value === V.cardinality)?.label), 1)
                ]),
                _: 2
              }, 1024)) : y("", !0),
              V.scope?.length ? (e(), T(s(he), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [
                  W("per " + _(V.scope.map(s(B)).join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : y("", !0),
              V.index && V.index !== "none" ? (e(), T(s(he), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [
                  W(_(ne[V.index] || "Filterable"), 1)
                ]),
                _: 2
              }, 1024)) : y("", !0),
              V.unique ? (e(), T(s(he), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [...O[6] || (O[6] = [
                  W("unique", -1)
                ])]),
                _: 1
              })) : y("", !0)
            ]),
            default: w(() => [
              l("div", As, [
                l("div", Rs, [
                  l("div", Is, [
                    l("label", {
                      id: d(z.namespace, V, "type")
                    }, "Type", 8, Os)
                  ]),
                  f(s(xe), {
                    disabled: !p.value,
                    "aria-labelledby": d(z.namespace, V, "type"),
                    "model-value": V.type,
                    options: C.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (J) => $(V, J)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                l("div", Ts, [
                  l("div", Ps, [
                    l("label", {
                      id: d(z.namespace, V, "values")
                    }, "Values", 8, qs)
                  ]),
                  f(s(xe), {
                    disabled: !p.value,
                    "aria-labelledby": d(z.namespace, V, "values"),
                    "model-value": V.cardinality ?? "one",
                    options: x,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (J) => Q(V, "cardinality", J === "one" ? void 0 : J)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                A(V) ? (e(), i("div", Ds, [
                  l("div", Ns, [
                    l("label", {
                      id: d(z.namespace, V, "vocabulary")
                    }, "Vocabulary", 8, zs)
                  ]),
                  f(s(xe), {
                    disabled: !p.value,
                    "aria-labelledby": d(z.namespace, V, "vocabulary"),
                    "model-value": V.vocabulary ?? "",
                    "onUpdate:modelValue": (J) => Q(V, "vocabulary", J),
                    options: [{ value: "", label: "Choose…" }, ...U.value.map((J) => ({ value: J, label: s(B)(J) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : y("", !0),
                I(V) ? (e(), i("p", Fs, "Choose the media types and file size this field accepts. Catalog readers can access attached files.")) : r(V)?.form === "ref" && !A(V) ? (e(), i("p", Bs, _(M(V) ? "A link points to something managed by an installed plugin." : "A product reference points to another product in this catalog."), 1)) : y("", !0),
                M(V) ? (e(), i("div", Ls, [
                  l("div", Es, [
                    l("label", {
                      id: d(z.namespace, V, "link")
                    }, "Link destination", 8, Ms),
                    O[7] || (O[7] = l("span", { class: "pim-f-note" }, "choose what the field can point to", -1))
                  ]),
                  f(s(xe), {
                    disabled: !p.value,
                    "aria-labelledby": d(z.namespace, V, "link"),
                    "model-value": V.config?.target ?? "",
                    "onUpdate:modelValue": (J) => k(V, J),
                    options: [{ value: "", label: "Choose…" }, ...a.options.link_kinds.map((J) => ({ value: J.kind, label: s(re)(J.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : y("", !0),
                l("div", Ws, [
                  l("div", Hs, [
                    l("label", {
                      id: d(z.namespace, V, "width")
                    }, "Width", 8, Js),
                    O[8] || (O[8] = l("span", { class: "pim-f-note" }, "of a form row", -1))
                  ]),
                  f(s(Ul), {
                    disabled: !p.value,
                    "aria-labelledby": d(z.namespace, V, "width"),
                    "model-value": s(xl)(a.schema, z.namespace, V),
                    options: s(v),
                    "allow-empty": !1,
                    "onUpdate:modelValue": (J) => V.width = J
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                l("div", Ks, [
                  l("div", Gs, [
                    l("label", {
                      id: d(z.namespace, V, "scope")
                    }, "Varies per", 8, Ys),
                    O[9] || (O[9] = l("span", { class: "pim-f-note" }, "dimensions the value depends on", -1))
                  ]),
                  f(Re, {
                    disabled: !p.value,
                    labelledby: d(z.namespace, V, "scope"),
                    "model-value": V.scope ?? [],
                    options: E.value,
                    "onUpdate:modelValue": (J) => X(V, J)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                I(V) ? y("", !0) : (e(), i("div", {
                  key: 4,
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": d(z.namespace, V, "default")
                }, [
                  l("div", Qs, [
                    l("label", {
                      id: d(z.namespace, V, "default")
                    }, "Default", 8, Xs),
                    O[10] || (O[10] = l("span", { class: "pim-f-note" }, "when no value is set", -1))
                  ]),
                  f($s, {
                    disabled: !p.value,
                    attribute: V,
                    type: r(V),
                    onChange: (J) => Q(V, "default", J)
                  }, null, 8, ["disabled", "attribute", "type", "onChange"])
                ], 8, Zs)),
                r(V)?.config_schema ? (e(), i("div", {
                  key: 5,
                  class: "pim-f pim-w-full",
                  role: "group",
                  "aria-labelledby": d(z.namespace, V, "config")
                }, [
                  l("div", li, [
                    l("label", {
                      id: d(z.namespace, V, "config")
                    }, "Type configuration", 8, ai)
                  ]),
                  f(jl, {
                    disabled: !p.value,
                    schema: r(V).config_schema,
                    "model-value": V.config ?? {},
                    "onUpdate:modelValue": (J) => n(V, J)
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue"])
                ], 8, ei)) : y("", !0)
              ]),
              f(Ce, {
                class: "pim-field-advanced pim-ia-disclosure",
                label: "Advanced"
              }, {
                default: w(() => [
                  l("div", ti, [
                    l("div", si, [
                      l("div", ii, [
                        l("label", {
                          for: d(z.namespace, V, "code")
                        }, "Integration key", 8, ni),
                        V.id !== void 0 ? (e(), i("span", oi, "renaming keeps stored values")) : y("", !0)
                      ]),
                      f(s(Qe), {
                        disabled: !p.value,
                        id: d(z.namespace, V, "code"),
                        type: "text",
                        value: V.code,
                        onInput: (J) => V.code = J.target.value,
                        class: "mono"
                      }, null, 8, ["disabled", "id", "value", "onInput"])
                    ]),
                    l("div", di, [
                      l("div", ri, [
                        l("label", {
                          id: d(z.namespace, V, "index")
                        }, "Search and filters", 8, ui),
                        O[11] || (O[11] = l("span", { class: "pim-f-note" }, "choose how this field can be matched", -1))
                      ]),
                      f(s(xe), {
                        disabled: !p.value,
                        "aria-labelledby": d(z.namespace, V, "index"),
                        "model-value": V.index ?? "none",
                        options: (r(V)?.indexes ?? ["none"]).map((J) => ({ value: J, label: ne[J] || s(B)(J) })),
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self",
                        "onUpdate:modelValue": (J) => Q(V, "index", J === "none" ? void 0 : J)
                      }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ]),
                    l("div", ci, [
                      l("div", mi, [
                        l("label", {
                          for: d(z.namespace, V, "unique")
                        }, "Unique", 8, pi),
                        O[12] || (O[12] = l("span", { class: "pim-f-note" }, "one holder per value, catalog wide", -1))
                      ]),
                      l("div", vi, [
                        f(s(nl), {
                          "input-id": d(z.namespace, V, "unique"),
                          "model-value": V.unique === !0,
                          disabled: !p.value || !!V.scope?.length || (V.cardinality ?? "one") !== "one",
                          "onUpdate:modelValue": (J) => Q(V, "unique", J)
                        }, null, 8, ["input-id", "model-value", "disabled", "onUpdate:modelValue"]),
                        l("span", null, _(V.unique ? "Yes" : "No"), 1)
                      ])
                    ]),
                    (V.scope?.length ?? 0) > 0 && V.index && V.index !== "none" ? (e(), i("div", fi, [
                      l("div", bi, [
                        l("label", {
                          id: d(z.namespace, V, "contexts")
                        }, "Filterable combinations", 8, yi),
                        O[13] || (O[13] = l("span", { class: "pim-f-note" }, "which combinations get an index", -1))
                      ]),
                      l("div", {
                        class: "pim-contexts",
                        role: "group",
                        "aria-labelledby": d(z.namespace, V, "contexts")
                      }, [
                        (e(!0), i(L, null, ee(se(V), (J, Oe) => (e(), i("div", {
                          key: Oe,
                          class: "pim-context-row"
                        }, [
                          (e(!0), i(L, null, ee(V.scope, (Ue) => (e(), i("div", {
                            key: Ue,
                            class: "pim-context-field"
                          }, [
                            l("span", {
                              id: d(z.namespace, V, "context-" + Oe + "-" + Ue),
                              class: "small muted"
                            }, _(s(B)(Ue)), 9, hi),
                            f(s(xe), {
                              disabled: !p.value,
                              "aria-labelledby": d(z.namespace, V, "context-" + Oe + "-" + Ue),
                              "model-value": J[Ue] ?? "",
                              options: ve(Ue),
                              class: "narrow",
                              appendTo: "self",
                              "onUpdate:modelValue": (Ae) => J[Ue] = Ae
                            }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                          ]))), 128)),
                          p.value ? (e(), T(s(G), {
                            key: 0,
                            type: "button",
                            "aria-label": "Remove context",
                            onClick: (Ue) => se(V).splice(Oe, 1),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: w(() => [
                              f(s(te), { icon: "tabler:x" })
                            ]),
                            _: 1
                          }, 8, ["onClick"])) : y("", !0)
                        ]))), 128)),
                        p.value ? (e(), T(s(G), {
                          key: 0,
                          type: "button",
                          onClick: (J) => el(V),
                          severity: "secondary",
                          outlined: "",
                          size: "small"
                        }, {
                          default: w(() => [
                            f(s(te), {
                              icon: "tabler:plus",
                              "aria-hidden": "true"
                            }),
                            O[14] || (O[14] = W(" Add context", -1))
                          ]),
                          _: 1
                        }, 8, ["onClick"])) : y("", !0)
                      ], 8, gi)
                    ])) : y("", !0)
                  ])
                ]),
                _: 2
              }, 1024),
              p.value ? (e(), i("div", ki, [
                f(s(G), {
                  type: "button",
                  onClick: (J) => ol(z, V),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    f(s(te), { icon: "tabler:trash" }),
                    O[15] || (O[15] = W(" Remove field", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : y("", !0)
            ]),
            _: 2
          }, [
            p.value ? {
              name: "actions",
              fn: w(() => [
                de > 0 ? (e(), T(s(G), {
                  key: 0,
                  type: "button",
                  "aria-label": "Move " + s(B)(V.code) + " earlier",
                  onClick: (J) => ye(J, z.attributes, de, de - 1),
                  text: "",
                  size: "small",
                  severity: "secondary"
                }, {
                  default: w(() => [
                    f(s(te), {
                      icon: "tabler:arrow-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])) : y("", !0),
                de < (z.attributes?.length ?? 0) - 1 ? (e(), T(s(G), {
                  key: 1,
                  type: "button",
                  class: "pim-move-later",
                  "aria-label": "Move " + s(B)(V.code) + " later",
                  onClick: (J) => ye(J, z.attributes, de, de + 1),
                  text: "",
                  size: "small",
                  severity: "secondary"
                }, {
                  default: w(() => [
                    f(s(te), {
                      icon: "tabler:arrow-down",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])) : y("", !0)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "open", "onUpdate:open", "title", "kind", "usage"]))), 128))
        ]),
        _: 2
      }, 1032, ["count", "show-actions"]))), 128)),
      f(cl, {
        visible: !!le.value,
        label: ge.value,
        onClose: O[5] || (O[5] = (z) => le.value = void 0)
      }, {
        default: w(() => [
          le.value ? (e(), i("section", {
            key: 0,
            class: "pim-ia-dialog",
            onKeydown: O[4] || (O[4] = il(Te((z) => le.value = void 0, ["prevent"]), ["esc"]))
          }, [
            l("header", _i, [
              l("h2", wi, _(ge.value), 1)
            ]),
            l("div", $i, [
              l("label", {
                id: s(P) + "-writers"
              }, "Sources allowed to write", 8, Ci),
              f(s(Yl), {
                disabled: !p.value,
                "aria-labelledby": s(P) + "-writers",
                "model-value": le.value.write?.sources ?? [],
                options: u.value,
                "option-label": "label",
                "option-value": "value",
                placeholder: "Any source",
                "append-to": "self",
                "onUpdate:modelValue": O[1] || (O[1] = (z) => le.value.write = { sources: z })
              }, null, 8, ["disabled", "aria-labelledby", "model-value", "options"])
            ]),
            l("footer", xi, [
              p.value ? (e(), T(s(G), {
                key: 0,
                type: "button",
                label: "Remove field group",
                severity: "danger",
                text: "",
                onClick: O[2] || (O[2] = (z) => Me(le.value))
              })) : y("", !0),
              f(s(G), {
                type: "button",
                label: "Done",
                severity: "secondary",
                outlined: "",
                onClick: O[3] || (O[3] = (z) => le.value = void 0)
              })
            ])
          ], 32)) : y("", !0)
        ]),
        _: 1
      }, 8, ["visible", "label"])
    ]));
  }
}), Ui = { class: "muted small" }, ji = { class: "pim-aspect" }, Si = {
  key: 0,
  class: "small muted"
}, Ai = { class: "pim-fields" }, Ri = { class: "pim-f pim-w-full" }, Ii = { class: "pim-f-label" }, Oi = ["id"], Ti = { class: "pim-f-label" }, Pi = ["id"], qi = /* @__PURE__ */ ce({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(a, { emit: m }) {
    const t = a, o = m, b = F(() => t.schema.access.admin), v = F(() => t.draft.dimensions ?? []), x = Ne();
    function p(u, C) {
      return x + "-" + u.name + "-" + C;
    }
    function h(u) {
      (t.draft.dimensions ??= []).push({ name: u, members: [] });
    }
    function q(u) {
      const C = [];
      for (const r of t.draft.aspects ?? []) for (const A of r.attributes ?? []) A.scope?.includes(u.name) && C.push(`${B(A.code)} (${B(r.namespace)})`);
      for (const r of t.draft.families ?? []) for (const A of r.requirements ?? []) A.context && u.name in A.context && C.push(`${B(A.id)} (${B(r.code)})`);
      return C;
    }
    function D(u) {
      q(u).length || (v.value.splice(v.value.indexOf(u), 1), t.schema.declaration.dimensions?.some((C) => C.name === u.name) && o("remove", "dimensions", u.name));
    }
    function H(u, C) {
      if (u.members = C, u.fallback)
        for (const r of Object.keys(u.fallback)) C.includes(r) || delete u.fallback[r];
    }
    function E(u, C) {
      return u.fallback?.[C] ?? [];
    }
    function U(u, C, r) {
      const A = { ...u.fallback ?? {} };
      r.length ? A[C] = r : delete A[C], Object.keys(A).length ? u.fallback = A : delete u.fallback;
    }
    return (u, C) => (e(), T(qe, {
      count: v.value.length,
      columns: ["details", "usage"]
    }, _e({
      default: w(() => [
        (e(!0), i(L, null, ee(v.value, (r) => (e(), T(De, {
          "route-section": "dimensions",
          "route-id": r.name,
          title: s(B)(r.name),
          key: r.name,
          usage: q(r).length ? "Used in " + q(r).length + " places" : "Unused"
        }, _e({
          details: w(() => [
            l("span", Ui, _(r.members.map(s(B)).join(", ") || "No allowed values"), 1)
          ]),
          default: w(() => [
            l("div", ji, [
              q(r).length ? (e(), i("p", Si, "Used by " + _(q(r).join(", ")), 1)) : y("", !0),
              l("div", Ai, [
                l("div", Ri, [
                  l("div", Ii, [
                    l("label", {
                      id: p(r, "members")
                    }, "Allowed values", 8, Oi),
                    C[0] || (C[0] = l("span", { class: "pim-f-note" }, "for example, English and French for Language", -1))
                  ]),
                  f(Re, {
                    disabled: !b.value,
                    labelledby: p(r, "members"),
                    "model-value": r.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (A) => H(r, A)
                  }, null, 8, ["disabled", "labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                (e(!0), i(L, null, ee(r.members, (A) => (e(), i("div", {
                  key: A,
                  class: "pim-f pim-w-half"
                }, [
                  l("div", Ti, [
                    l("label", {
                      id: p(r, "fallback-" + encodeURIComponent(A))
                    }, _(A) + " falls back to", 9, Pi),
                    C[1] || (C[1] = l("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  f(Re, {
                    disabled: !b.value,
                    labelledby: p(r, "fallback-" + encodeURIComponent(A)),
                    "model-value": E(r, A),
                    options: r.members.filter((I) => I !== A).map((I) => ({ value: I })),
                    "onUpdate:modelValue": (I) => U(r, A, I)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]))), 128))
              ])
            ])
          ]),
          _: 2
        }, [
          b.value ? {
            name: "actions",
            fn: w(() => [
              f(s(G), {
                type: "button",
                disabled: q(r).length > 0,
                "aria-label": "Remove " + s(B)(r.name),
                title: q(r).length ? "Take the dimension off these first" : "",
                onClick: (A) => D(r),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: w(() => [
                  f(s(te), { icon: "tabler:trash" })
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
      b.value ? {
        name: "add",
        fn: w(() => [
          f(Pe, {
            label: "Dimension name",
            "from-name": "",
            action: "Add dimension",
            existing: v.value.map((r) => r.name),
            onAdd: h
          }, {
            default: w(() => [...C[2] || (C[2] = [
              l("span", { class: "muted small" }, "A dimension lets a value differ per member, with fallbacks between members.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), Di = { class: "muted small" }, Ni = { class: "pim-aspect" }, zi = { class: "row small" }, Fi = {
  key: 1,
  class: "muted small"
}, Bi = {
  key: 2,
  class: "pim-stack tight pim-terms"
}, Li = {
  key: 0,
  class: "muted small"
}, Ei = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Mi = {
  key: 3,
  class: "pim-responsive-table"
}, Wi = {
  class: "pim-grid compact",
  "aria-label": "Vocabulary terms"
}, Hi = { key: 0 }, Ji = { key: 1 }, Ki = {
  key: 0,
  class: "muted"
}, Gi = {
  key: 1,
  class: "num"
}, Yi = {
  role: "list",
  class: "pim-stacked-list",
  "aria-label": "Vocabulary terms"
}, Zi = {
  key: 0,
  class: "pim-stacked-meta muted small"
}, Qi = {
  key: 4,
  class: "muted small"
}, Xi = { class: "row wrap" }, en = {
  key: 5,
  class: "row wrap pim-add-row"
}, ln = {
  key: 0,
  class: "pim-config-overrides"
}, an = /* @__PURE__ */ ce({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(a, { emit: m }) {
    const t = a, o = m, b = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/, v = F(() => t.schema.access.admin), x = F(() => v.value && t.schema.access.write), p = F(() => t.draft.vocabularies ?? []);
    function h(d) {
      (t.draft.vocabularies ??= []).push({ code: d });
    }
    function q(d) {
      p.value.splice(p.value.indexOf(d), 1), t.schema.declaration.vocabularies?.some(($) => $.code === d.code) && o("remove", "vocabularies", d.code);
    }
    function D(d) {
      return !!t.schema.vocabularies[d];
    }
    const H = K({}), E = K({}), U = K({}), u = K({}), C = K({}), r = K({}), A = K({}), I = K({});
    function M(d) {
      return !!(C.value[d] || r.value[d]);
    }
    async function me(d, $) {
      C.value[d] = !0, delete A.value[d];
      try {
        const n = await be.termsPage(t.catalogId, d, $);
        E.value[d] = n.terms, u.value[d] = $, U.value[d] = n.next;
        const k = ne(d);
        n.terms.some((X) => X.retired && X.code === k.parent) && (k.parent = "");
      } catch (n) {
        A.value[d] = { errors: [Ee(n, "Could not load terms.")], read: { after: $ } };
      } finally {
        C.value[d] = !1;
      }
    }
    function we(d) {
      H.value[d] = !H.value[d], H.value[d] && !M(d) && !E.value[d] && !A.value[d] && me(d);
    }
    function ne(d) {
      return I.value[d] ?? (I.value[d] = { code: "", label: "", parent: "" });
    }
    function Y(d, $) {
      const n = E.value[d]?.find((k) => k.code === $);
      return n ? Be(n) : B($);
    }
    function P(d) {
      return [{ value: "", label: "No parent" }, ...(E.value[d] ?? []).filter(($) => !$.retired).map(($) => ({ value: $.code, label: Be($) }))];
    }
    function Z(d, $, n) {
      A.value[d] = { errors: $?.findings?.length ? $.findings.map((k) => ({ message: k.message ?? n, code: k.code })) : [{ message: n }] };
    }
    async function N(d) {
      const $ = ne(d.code);
      if (!(!x.value || !b.test($.code))) {
        r.value[d.code] = !0, delete A.value[d.code];
        try {
          const n = { term: { vocabulary: d.code, code: $.code }, labels: { en: $.label || B($.code) } };
          d.hierarchical && $.parent && (n.parent = $.parent);
          const X = (await be.apply(t.catalogId, [n])).outcomes[0];
          if (X?.outcome !== "created" && X?.outcome !== "updated") {
            Z(d.code, X, "The term was not accepted.");
            return;
          }
          I.value[d.code] = { code: "", label: "", parent: "" }, be.invalidateTerms(t.catalogId), await me(d.code, u.value[d.code]);
        } catch (n) {
          A.value[d.code] = { errors: [Ee(n, "Could not add the term.")] };
        } finally {
          r.value[d.code] = !1;
        }
      }
    }
    async function S(d, $, n) {
      if (x.value && !(n && !await Ge.confirm({ header: "Retire term?", message: `Retire ${Be($)}? Term changes save immediately. You can restore this term later.`, acceptLabel: "Retire", rejectLabel: "Cancel" }))) {
        r.value[d.code] = !0, delete A.value[d.code];
        try {
          const X = (await be.apply(t.catalogId, [{ term: { vocabulary: d.code, code: $.code }, retired: n }])).outcomes[0];
          if (!X || !["updated", "unchanged"].includes(X.outcome)) {
            Z(d.code, X, "The term change was not accepted.");
            return;
          }
          n && ne(d.code).parent === $.code && (ne(d.code).parent = ""), be.invalidateTerms(t.catalogId), await me(d.code, u.value[d.code]);
        } catch (k) {
          A.value[d.code] = { errors: [Ee(k, "Could not change the term.")] };
        } finally {
          r.value[d.code] = !1;
        }
      }
    }
    return (d, $) => (e(), T(qe, {
      count: p.value.length,
      columns: ["details"]
    }, _e({
      default: w(() => [
        (e(!0), i(L, null, ee(p.value, (n) => (e(), T(De, {
          "route-section": "vocabularies",
          "route-id": n.code,
          title: s(B)(n.code),
          key: n.code
        }, {
          details: w(() => [
            l("span", Di, _(n.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: w(() => [
            v.value ? (e(), T(s(G), {
              key: 0,
              type: "button",
              "aria-label": "Remove " + s(B)(n.code),
              onClick: (k) => q(n),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: w(() => [
                f(s(te), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])) : y("", !0)
          ]),
          default: w(() => [
            l("div", Ni, [
              l("label", zi, [
                f(s(nl), {
                  disabled: !v.value,
                  "aria-label": "Hierarchical " + s(B)(n.code),
                  "model-value": n.hierarchical === !0,
                  "onUpdate:modelValue": (k) => k ? n.hierarchical = !0 : delete n.hierarchical
                }, null, 8, ["disabled", "aria-label", "model-value", "onUpdate:modelValue"]),
                $[0] || ($[0] = l("span", null, "Hierarchical", -1))
              ]),
              D(n.code) ? (e(), T(s(G), {
                key: 0,
                type: "button",
                onClick: (k) => we(n.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: w(() => [
                  f(s(te), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  W(" " + _(H.value[n.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : v.value ? (e(), i("span", Fi, "Apply the schema before adding terms.")) : y("", !0),
              H.value[n.code] ? (e(), i("div", Bi, [
                x.value ? (e(), i("p", Li, "Term changes save immediately.")) : y("", !0),
                C.value[n.code] ? (e(), i("div", Ei, "Loading terms…")) : A.value[n.code] ? (e(!0), i(L, { key: 2 }, ee(A.value[n.code].errors, (k, X) => (e(), T(fl, {
                  key: X,
                  error: k
                }, {
                  default: w(() => [
                    A.value[n.code].read ? (e(), T(s(G), {
                      key: 0,
                      type: "button",
                      onClick: (Q) => me(n.code, A.value[n.code].read?.after),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: w(() => [...$[1] || ($[1] = [
                        W("Retry", -1)
                      ])]),
                      _: 1
                    }, 8, ["onClick"])) : y("", !0)
                  ]),
                  _: 2
                }, 1032, ["error"]))), 128)) : y("", !0),
                (E.value[n.code] ?? []).length ? (e(), i("div", Mi, [
                  l("table", Wi, [
                    l("thead", null, [
                      l("tr", null, [
                        $[2] || ($[2] = l("th", null, "Term", -1)),
                        n.hierarchical ? (e(), i("th", Hi, "Parent")) : y("", !0),
                        v.value ? (e(), i("th", Ji)) : y("", !0)
                      ])
                    ]),
                    l("tbody", null, [
                      (e(!0), i(L, null, ee(E.value[n.code], (k) => (e(), i("tr", {
                        key: k.code,
                        class: Se({ muted: k.retired })
                      }, [
                        l("td", null, [
                          W(_(s(Be)(k)) + " ", 1),
                          k.retired ? (e(), T(s(he), {
                            key: 0,
                            severity: "secondary",
                            value: "Retired"
                          })) : y("", !0)
                        ]),
                        n.hierarchical ? (e(), i("td", Ki, _(k.parent ? Y(n.code, k.parent) : "—"), 1)) : y("", !0),
                        v.value ? (e(), i("td", Gi, [
                          f(s(G), {
                            type: "button",
                            disabled: !x.value || M(n.code),
                            onClick: (X) => S(n, k, !k.retired),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: w(() => [
                              W(_(k.retired ? "Restore" : "Retire"), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled", "onClick"])
                        ])) : y("", !0)
                      ], 2))), 128))
                    ])
                  ]),
                  l("ul", Yi, [
                    (e(!0), i(L, null, ee(E.value[n.code], (k) => (e(), i("li", {
                      key: k.code,
                      class: Se(["pim-stacked-row", { muted: k.retired }])
                    }, [
                      l("div", null, [
                        W(_(s(Be)(k)) + " ", 1),
                        k.retired ? (e(), T(s(he), {
                          key: 0,
                          severity: "secondary",
                          value: "Retired"
                        })) : y("", !0)
                      ]),
                      n.hierarchical && k.parent ? (e(), i("div", Zi, "Parent: " + _(Y(n.code, k.parent)), 1)) : y("", !0),
                      v.value ? (e(), T(s(G), {
                        key: 1,
                        type: "button",
                        disabled: !x.value || M(n.code),
                        onClick: (X) => S(n, k, !k.retired),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: w(() => [
                          W(_(k.retired ? "Restore" : "Retire"), 1)
                        ]),
                        _: 2
                      }, 1032, ["disabled", "onClick"])) : y("", !0)
                    ], 2))), 128))
                  ])
                ])) : E.value[n.code] && !M(n.code) && !A.value[n.code] ? (e(), i("p", Qi, "No terms yet.")) : y("", !0),
                l("div", Xi, [
                  f(s(G), {
                    type: "button",
                    disabled: M(n.code) || !u.value[n.code],
                    onClick: (k) => me(n.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      f(s(te), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      $[3] || ($[3] = W(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  f(s(G), {
                    type: "button",
                    disabled: M(n.code) || !U.value[n.code],
                    onClick: (k) => me(n.code, U.value[n.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      f(s(te), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      $[4] || ($[4] = W(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                v.value ? (e(), i("div", en, [
                  f(s(Qe), {
                    modelValue: ne(n.code).label,
                    "onUpdate:modelValue": (k) => ne(n.code).label = k,
                    disabled: !x.value || M(n.code),
                    "aria-label": "Term name in English",
                    type: "text",
                    placeholder: "Term name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  f(s(Qe), {
                    modelValue: ne(n.code).code,
                    "onUpdate:modelValue": (k) => ne(n.code).code = k,
                    disabled: !x.value || M(n.code),
                    type: "text",
                    "aria-label": "Short term name",
                    placeholder: "Short name for imports",
                    class: "narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  n.hierarchical ? (e(), T(s(xe), {
                    key: 0,
                    modelValue: ne(n.code).parent,
                    "onUpdate:modelValue": (k) => ne(n.code).parent = k,
                    disabled: !x.value || M(n.code),
                    class: "narrow",
                    "aria-label": "Parent term",
                    placeholder: "No parent",
                    options: P(n.code),
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "options"])) : y("", !0),
                  f(s(G), {
                    type: "button",
                    disabled: !x.value || M(n.code) || !b.test(ne(n.code).code),
                    onClick: (k) => N(n),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      f(s(te), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      $[5] || ($[5] = W(" Add term", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])) : y("", !0),
                f(Ce, {
                  class: "pim-ia-disclosure",
                  label: "Integration keys"
                }, {
                  default: w(() => [
                    (E.value[n.code] ?? []).length ? (e(), i("dl", ln, [
                      (e(!0), i(L, null, ee(E.value[n.code], (k) => (e(), i(L, {
                        key: k.code
                      }, [
                        l("dt", null, _(s(Be)(k)), 1),
                        l("dd", null, [
                          l("code", null, _(k.code), 1)
                        ])
                      ], 64))), 128))
                    ])) : y("", !0)
                  ]),
                  _: 2
                }, 1024)
              ])) : y("", !0)
            ])
          ]),
          _: 2
        }, 1032, ["route-id", "title"]))), 128))
      ]),
      _: 2
    }, [
      v.value ? {
        name: "add",
        fn: w(() => [
          f(Pe, {
            label: "Vocabulary name",
            "from-name": "",
            action: "Add vocabulary",
            existing: p.value.map((n) => n.code),
            onAdd: h
          }, {
            default: w(() => [...$[6] || ($[6] = [
              l("span", { class: "muted small" }, "Select fields pick their values from a vocabulary's terms.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), tn = { class: "pim-stack" }, sn = { class: "muted small" }, nn = { class: "muted small" }, on = { class: "pim-aspect" }, dn = { class: "pim-ia-action pim-family-fields" }, rn = { class: "pim-f" }, un = { class: "pim-f-label" }, cn = ["id"], mn = ["id"], pn = { class: "pim-aspect" }, vn = { class: "pim-stack tight" }, fn = { class: "pim-level-head" }, bn = { class: "pim-fields" }, yn = { class: "pim-f pim-w-half" }, gn = { class: "pim-f-label" }, hn = ["id"], kn = { class: "pim-f pim-w-half" }, _n = { class: "pim-f-label" }, wn = ["id"], $n = { class: "pim-aspect" }, Cn = { class: "pim-stack tight" }, xn = { class: "pim-level-head" }, Vn = { class: "muted small" }, Un = { class: "pim-fields" }, jn = { class: "pim-f-label" }, Sn = ["id"], An = { class: "pim-f pim-w-half" }, Rn = { class: "pim-f-label" }, In = ["id"], On = { class: "pim-f pim-w-half" }, Tn = { class: "pim-f-label" }, Pn = ["id"], qn = {
  key: 0,
  class: "pim-aspect pim-family-remove"
}, Dn = /* @__PURE__ */ ce({
  __name: "BuilderFamilies",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove", "fields"],
  setup(a, { emit: m }) {
    const t = a, o = m, b = Ne();
    function v(d, $) {
      return b + "-" + d.code + "-" + $;
    }
    const x = F(() => t.schema.access.admin), p = F(() => (t.draft.families ?? []).filter((d) => d.code !== "generic")), h = F(() => {
      const d = new Set(t.draft.plugins?.map(($) => $.use));
      return Object.entries(t.schema.attributes).filter(([, $]) => $.plugin && d.has($.plugin));
    }), q = F(() => {
      const d = (t.draft.aspects ?? []).map((n) => n.namespace), $ = [...new Set(h.value.map(([n]) => n.split(".")[0]))];
      return [...d, ...$.filter((n) => !d.includes(n))].map((n) => ({ value: n, label: B(n) }));
    });
    function D(d) {
      const $ = q.value, n = (d.aspects ?? []).filter((k) => !$.some((X) => X.value === k));
      return [...$, ...n.map((k) => ({ value: k, label: B(k) }))];
    }
    const H = F(() => new Map(t.options.types.map((d) => [d.id, d.form])));
    function E(d, $ = []) {
      const n = /* @__PURE__ */ new Map();
      return [.../* @__PURE__ */ new Set([...d, ...$])].map((X) => {
        const [Q, se] = X.split(".", 2), ve = B(se ?? Q);
        return n.set(ve, (n.get(ve) ?? 0) + 1), { value: X, label: ve, group: se ? B(Q) : void 0 };
      }).map(({ value: X, label: Q, group: se }) => ({
        value: X,
        label: Q,
        detail: n.get(Q) > 1 ? se : void 0
      }));
    }
    const U = F(() => {
      const d = /* @__PURE__ */ new Map();
      function $(n, k, X = [], Q = "one") {
        const se = !!k && k !== "text" && k !== "record" && X.length === 0 && Q === "one";
        d.set(n, se);
      }
      for (const n of t.draft.aspects ?? [])
        for (const k of n.attributes ?? []) {
          const X = n.namespace + "." + k.code;
          $(X, H.value.get(k.type), k.scope, k.cardinality);
        }
      for (const [n, k] of h.value) $(n, k.form, k.scope, k.cardinality);
      return d;
    });
    function u(d) {
      return [...U.value.keys()].filter(($) => d.aspects?.includes($.split(".")[0]));
    }
    function C(d, $, n) {
      const k = $[n] ?? [], X = new Set(ne(d).flatMap((se) => [...se.axes ?? [], ...se.own ?? []])), Q = u(d).filter((se) => k.includes(se) || !X.has(se) && (n === "own" || U.value.get(se)));
      return E(Q, k);
    }
    const r = F(() => t.draft.channels ?? []);
    function A(d, $) {
      return r.value.filter((n) => (!n.families?.length || n.families.includes(d.code)) && (!$ || n.requirements?.includes($))).map((n) => B(n.id));
    }
    const I = F(() => t.draft.dimensions ?? []), M = K({});
    function me(d) {
      (t.draft.families ??= []).push({ code: d, aspects: [] }), M.value[d] = !0;
    }
    function we(d) {
      t.draft.families.splice(t.draft.families.indexOf(d), 1), t.schema.declaration.families?.some(($) => $.code === d.code) && o("remove", "families", d.code);
    }
    function ne(d) {
      return d.variation ?? [];
    }
    function Y(d) {
      (d.variation ??= []).push({ axes: [] });
    }
    function P(d) {
      return d.requirements ?? [];
    }
    function Z(d, $) {
      (d.requirements ??= []).push({ id: $, require: [] });
    }
    function N(d, $) {
      return d.context?.[$] ?? "";
    }
    function S(d, $, n) {
      const k = { ...d.context ?? {} };
      n ? k[$] = n : delete k[$], Object.keys(k).length ? d.context = k : delete d.context;
    }
    return (d, $) => (e(), i("div", tn, [
      f(qe, {
        count: p.value.length,
        columns: ["details"]
      }, _e({
        default: w(() => [
          (e(!0), i(L, null, ee(p.value, (n) => (e(), T(De, {
            "route-section": "families",
            "route-id": n.code,
            key: n.code,
            open: M.value[n.code],
            "onUpdate:open": (k) => M.value[n.code] = k,
            title: s(B)(n.code)
          }, {
            details: w(() => [
              l("span", sn, _(u(n).length) + " fields", 1),
              ne(n).length ? (e(), T(s(he), {
                key: 0,
                severity: "secondary",
                value: ne(n).length + (ne(n).length === 1 ? " variant level" : " variant levels")
              }, null, 8, ["value"])) : y("", !0),
              l("span", nn, _(A(n).join(", ") || "No release channels"), 1)
            ]),
            default: w(() => [
              l("div", on, [
                l("div", dn, [
                  l("div", rn, [
                    l("div", un, [
                      l("label", {
                        id: v(n, "groups")
                      }, "Field groups", 8, cn)
                    ]),
                    l("p", {
                      id: v(n, "groups-help"),
                      class: "muted small pim-axis-help"
                    }, "Choose the groups that appear on this family’s product forms.", 8, mn),
                    f(s(Yl), {
                      disabled: !x.value,
                      "aria-labelledby": v(n, "groups"),
                      "aria-describedby": v(n, "groups-help"),
                      "model-value": n.aspects ?? [],
                      options: D(n),
                      "option-label": "label",
                      "option-value": "value",
                      placeholder: "Choose field groups",
                      display: "chip",
                      "append-to": "self",
                      "onUpdate:modelValue": (k) => s(Le)(n, "aspects", k)
                    }, null, 8, ["disabled", "aria-labelledby", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])
                  ]),
                  n.aspects?.length ? (e(), T(s(G), {
                    key: 0,
                    type: "button",
                    label: "View family fields",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (k) => o("fields", n.code)
                  }, null, 8, ["onClick"])) : y("", !0)
                ])
              ]),
              l("div", pn, [
                $[3] || ($[3] = l("header", { class: "pim-aspect-head" }, [
                  l("h3", null, "Variants")
                ], -1)),
                $[4] || ($[4] = l("p", { class: "muted small pim-axis-help" }, "Choose what makes one variant different from another. Each field can be used once.", -1)),
                l("div", vn, [
                  (e(!0), i(L, null, ee(ne(n), (k, X) => (e(), i("div", {
                    key: X,
                    class: "pim-level"
                  }, [
                    l("div", fn, [
                      l("strong", null, "Level " + _(X + 1), 1),
                      x.value ? (e(), T(s(G), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove level",
                        onClick: (Q) => ne(n).splice(X, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: w(() => [
                          f(s(te), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : y("", !0)
                    ]),
                    l("div", bn, [
                      l("div", yn, [
                        l("div", gn, [
                          l("label", {
                            id: v(n, X + "-axes")
                          }, "Distinguish variants by", 8, hn)
                        ]),
                        $[0] || ($[0] = l("p", { class: "muted small pim-axis-help" }, "Choose a single-value field with no dimensions. Text and record fields are excluded.", -1)),
                        f(Re, {
                          disabled: !x.value,
                          dropdown: "",
                          labelledby: v(n, X + "-axes"),
                          "model-value": k.axes ?? [],
                          options: C(n, k, "axes"),
                          placeholder: "Add an axis",
                          "onUpdate:modelValue": (Q) => k.axes = Q
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]),
                      l("div", kn, [
                        l("div", _n, [
                          l("label", {
                            id: v(n, X + "-owned")
                          }, "Other fields edited here", 8, wn)
                        ]),
                        $[1] || ($[1] = l("p", { class: "muted small pim-axis-help" }, "Other fields you edit at this level.", -1)),
                        f(Re, {
                          disabled: !x.value,
                          dropdown: "",
                          labelledby: v(n, X + "-owned"),
                          "model-value": k.own ?? [],
                          options: C(n, k, "own"),
                          placeholder: "Add a field",
                          "onUpdate:modelValue": (Q) => Q.length ? k.own = Q : delete k.own
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  x.value ? (e(), T(s(G), {
                    key: 0,
                    type: "button",
                    class: "pim-add-level",
                    onClick: (k) => Y(n),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      f(s(te), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      $[2] || ($[2] = W(" Add level", -1))
                    ]),
                    _: 1
                  }, 8, ["onClick"])) : y("", !0)
                ])
              ]),
              l("div", $n, [
                $[7] || ($[7] = l("header", { class: "pim-family-requirements-head" }, [
                  l("h3", null, "Release requirements"),
                  l("p", { class: "muted small" }, "Choose what products need before they can be released to a channel.")
                ], -1)),
                l("div", Cn, [
                  (e(!0), i(L, null, ee(P(n), (k, X) => (e(), i("div", {
                    key: k.id,
                    class: "pim-level"
                  }, [
                    l("div", xn, [
                      l("div", null, [
                        l("strong", null, _(s(B)(k.id)), 1),
                        l("p", Vn, _(A(n, k.id).join(", ") || "Unused by channels"), 1)
                      ]),
                      x.value ? (e(), T(s(G), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove requirement",
                        onClick: (Q) => P(n).splice(X, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: w(() => [
                          f(s(te), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : y("", !0)
                    ]),
                    l("div", Un, [
                      (e(!0), i(L, null, ee(I.value, (Q) => (e(), i("div", {
                        key: Q.name,
                        class: "pim-f pim-w-third"
                      }, [
                        l("div", jn, [
                          l("label", {
                            id: v(n, k.id + "-context-" + Q.name)
                          }, _(s(B)(Q.name)), 9, Sn)
                        ]),
                        f(s(xe), {
                          disabled: !x.value,
                          "aria-labelledby": v(n, k.id + "-context-" + Q.name),
                          "model-value": N(k, Q.name),
                          "onUpdate:modelValue": (se) => S(k, Q.name, se),
                          options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ...Q.members.map((se) => ({ value: se, label: String(se) }))],
                          "option-label": "label",
                          "option-value": "value",
                          appendTo: "self"
                        }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                      ]))), 128)),
                      l("div", An, [
                        l("div", Rn, [
                          l("label", {
                            id: v(n, k.id + "-required")
                          }, "Required", 8, In)
                        ]),
                        $[5] || ($[5] = l("p", { class: "muted small pim-axis-help" }, "These fields must have a value.", -1)),
                        f(Re, {
                          disabled: !x.value,
                          dropdown: "",
                          labelledby: v(n, k.id + "-required"),
                          "model-value": k.require ?? [],
                          placeholder: "Add a required field",
                          options: E(u(n), k.require),
                          "onUpdate:modelValue": (Q) => s(Le)(k, "require", Q)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]),
                      l("div", On, [
                        l("div", Tn, [
                          l("label", {
                            id: v(n, k.id + "-authored")
                          }, "Entered for this context", 8, Pn)
                        ]),
                        $[6] || ($[6] = l("p", { class: "muted small pim-axis-help" }, "These fields need a value set directly for the selected context.", -1)),
                        f(Re, {
                          disabled: !x.value,
                          dropdown: "",
                          labelledby: v(n, k.id + "-authored"),
                          "model-value": k.authored ?? [],
                          placeholder: "Add a field to author",
                          options: E(u(n), k.authored),
                          "onUpdate:modelValue": (Q) => s(Le)(k, "authored", Q)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  x.value ? (e(), T(Pe, {
                    key: 0,
                    label: "Requirement name",
                    action: "Add requirement",
                    "from-name": "",
                    existing: P(n).map((k) => k.id),
                    onAdd: (k) => Z(n, k)
                  }, null, 8, ["existing", "onAdd"])) : y("", !0)
                ])
              ]),
              x.value ? (e(), i("div", qn, [
                f(s(G), {
                  type: "button",
                  label: "Remove family",
                  severity: "danger",
                  text: "",
                  size: "small",
                  onClick: (k) => we(n)
                }, null, 8, ["onClick"])
              ])) : y("", !0)
            ]),
            _: 2
          }, 1032, ["route-id", "open", "onUpdate:open", "title"]))), 128))
        ]),
        _: 2
      }, [
        x.value ? {
          name: "head",
          fn: w(() => [
            f(Pe, {
              label: "Family name",
              action: "Add family",
              "from-name": "",
              existing: p.value.map((n) => n.code),
              onAdd: me
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])
    ]));
  }
}), Nn = ["inert"], zn = {
  key: 0,
  class: "row wrap"
}, Fn = {
  key: 2,
  class: "small muted"
}, Bn = { class: "pim-principal-service" }, Ln = /* @__PURE__ */ ce({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(a, { emit: m }) {
    const t = a, o = m, b = K(!1), v = K(""), x = K({});
    let p = 0;
    fe(() => t.modelValue, async (E) => {
      const U = ++p;
      try {
        const u = await Ql(t.catalogId ?? "", E);
        U === p && (x.value = u);
      } catch {
        U === p && (x.value = {});
      }
    }, { immediate: !0, deep: !0 }), Xe(() => {
      p++;
    });
    function h(E) {
      return x.value[E] ?? re(E, "Person");
    }
    Kl(async () => {
      try {
        await qa("wc-principal-picker"), b.value = !0;
      } catch {
        b.value = !1;
      }
    });
    function q(E) {
      t.disabled || !E.trim() || t.modelValue.includes(E.trim()) || (o("update:modelValue", [...t.modelValue, E.trim()]), v.value = "");
    }
    function D(E) {
      const U = E.detail;
      if (!U || typeof U != "object") return;
      const u = U, C = u.principal_id ?? u.id;
      typeof C == "string" && q(C);
    }
    function H(E) {
      t.disabled || o("update:modelValue", t.modelValue.filter((U) => U !== E));
    }
    return (E, U) => (e(), i("div", {
      class: "pim-principal-list",
      inert: a.disabled || void 0
    }, [
      a.modelValue.length ? (e(), i("div", zn, [
        (e(!0), i(L, null, ee(a.modelValue, (u) => (e(), T(s(he), {
          key: u,
          severity: "secondary"
        }, {
          default: w(() => [
            l("span", null, _(h(u)), 1),
            f(s(G), {
              text: "",
              size: "small",
              disabled: a.disabled,
              "aria-label": "Remove " + h(u),
              onClick: (C) => H(u)
            }, {
              default: w(() => [
                f(s(te), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : y("", !0),
      b.value ? (e(), i("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: Te(D, ["stop"])
      }, null, 32)) : (e(), i("span", Fn, "The person picker is unavailable.")),
      l("label", Bn, [
        U[3] || (U[3] = l("span", { class: "small muted" }, "Service account", -1)),
        f(s(Qe), {
          modelValue: v.value,
          "onUpdate:modelValue": U[0] || (U[0] = (u) => v.value = u),
          disabled: a.disabled,
          placeholder: "Service principal id",
          onKeydown: U[1] || (U[1] = il(Te((u) => q(v.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "disabled"])
      ]),
      f(s(G), {
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: a.disabled || !v.value.trim(),
        onClick: U[2] || (U[2] = (u) => q(v.value))
      }, {
        default: w(() => [
          f(s(te), { icon: "tabler:plus" }),
          U[4] || (U[4] = W(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, Nn));
  }
}), En = { class: "pim-stack" }, Mn = { class: "muted small" }, Wn = { class: "muted small" }, Hn = { class: "pim-fields" }, Jn = { class: "pim-f pim-w-half" }, Kn = { class: "pim-f-label" }, Gn = ["id"], Yn = { class: "pim-f pim-w-half" }, Zn = { class: "pim-f-label" }, Qn = ["id"], Xn = { class: "muted small" }, eo = { class: "pim-fields" }, lo = { class: "pim-f pim-w-third" }, ao = { class: "pim-f-label" }, to = ["id"], so = { class: "pim-f pim-w-third" }, io = { class: "pim-f-label" }, no = ["for"], oo = { class: "row" }, ro = ["aria-labelledby"], uo = { class: "pim-f-label" }, co = ["id"], mo = { key: 1 }, po = { class: "pim-f pim-w-full" }, vo = { class: "pim-f-label" }, fo = ["id"], bo = /* @__PURE__ */ ce({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {},
    view: {}
  },
  emits: ["remove"],
  setup(a, { emit: m }) {
    const t = a, o = m, b = Ne();
    function v(r, A) {
      return b + "-" + r + "-" + A;
    }
    const x = F(() => t.schema.access.admin), p = F(() => t.draft.channels ?? []), h = F(() => t.draft.sources ?? []), q = F(() => [...new Set((t.draft.families ?? []).flatMap((r) => (r.requirements ?? []).map((A) => A.id)))].map((r) => ({ value: r, label: B(r) }))), D = F(() => (t.draft.families ?? []).filter((r) => r.code !== "generic").map((r) => ({ value: r.code, label: B(r.code) }))), H = F(() => (t.draft.aspects ?? []).map((r) => ({ value: r.namespace, label: B(r.namespace) })));
    function E(r) {
      (t.draft.channels ??= []).push({ id: r, requirements: [] });
    }
    function U(r) {
      p.value.splice(p.value.indexOf(r), 1), t.schema.declaration.channels?.some((A) => A.id === r.id) && o("remove", "channels", r.id);
    }
    function u(r) {
      (t.draft.sources ??= []).push({ id: r, ordering: "none", writes: [] });
    }
    function C(r) {
      h.value.splice(h.value.indexOf(r), 1), t.schema.declaration.sources?.some((A) => A.id === r.id) && o("remove", "sources", r.id);
    }
    return (r, A) => (e(), i("div", En, [
      a.view !== "sources" ? (e(), T(qe, {
        key: 0,
        count: p.value.length,
        columns: ["details"]
      }, _e({
        default: w(() => [
          (e(!0), i(L, null, ee(p.value, (I) => (e(), T(De, {
            "route-section": "channels",
            "route-id": I.id,
            key: I.id,
            title: s(B)(I.id)
          }, _e({
            details: w(() => [
              l("span", Mn, _(I.families?.length ? I.families.map(s(B)).join(", ") : "All families"), 1),
              l("span", Wn, _(I.requirements?.length ? I.requirements.map(s(B)).join(", ") : "No release requirements"), 1)
            ]),
            default: w(() => [
              l("div", Hn, [
                l("div", Jn, [
                  l("div", Kn, [
                    l("label", {
                      id: v(I.id, "requirements")
                    }, "Release requirements", 8, Gn),
                    A[0] || (A[0] = l("span", { class: "pim-f-note" }, "a product is ready for the channel when these hold", -1))
                  ]),
                  f(Re, {
                    disabled: !x.value,
                    labelledby: v(I.id, "requirements"),
                    "model-value": I.requirements ?? [],
                    options: q.value,
                    "onUpdate:modelValue": (M) => s(Le)(I, "requirements", M)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                l("div", Yn, [
                  l("div", Zn, [
                    l("label", {
                      id: v(I.id, "families")
                    }, "Families", 8, Qn),
                    A[1] || (A[1] = l("span", { class: "pim-f-note" }, "empty means every family", -1))
                  ]),
                  f(Re, {
                    disabled: !x.value,
                    labelledby: v(I.id, "families"),
                    "model-value": I.families ?? [],
                    options: D.value,
                    "onUpdate:modelValue": (M) => s(Le)(I, "families", M)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            x.value ? {
              name: "actions",
              fn: w(() => [
                f(s(G), {
                  type: "button",
                  onClick: (M) => U(I),
                  "aria-label": "Remove " + s(B)(I.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    f(s(te), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["onClick", "aria-label"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "title"]))), 128))
        ]),
        _: 2
      }, [
        x.value ? {
          name: "head",
          fn: w(() => [
            f(Pe, {
              label: "Channel name",
              action: "Add channel",
              "from-name": "",
              existing: p.value.map((I) => I.id),
              onAdd: E
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])) : y("", !0),
      a.view !== "channels" ? (e(), T(qe, {
        key: 1,
        count: h.value.length,
        columns: ["details"]
      }, _e({
        default: w(() => [
          (e(!0), i(L, null, ee(h.value, (I) => (e(), T(De, {
            "route-section": "sources",
            "route-id": I.id,
            key: I.id,
            title: s(B)(I.id)
          }, _e({
            details: w(() => [
              l("span", Xn, _(I.writes?.length ? I.writes.map(s(B)).join(", ") : "No field groups selected"), 1)
            ]),
            default: w(() => [
              l("div", eo, [
                l("div", lo, [
                  l("div", ao, [
                    l("label", {
                      id: v(I.id, "ordering")
                    }, "Handle incoming updates", 8, to),
                    A[2] || (A[2] = l("span", { class: "pim-f-note" }, "sequence keeps late deliveries from winning", -1))
                  ]),
                  f(s(xe), {
                    disabled: !x.value,
                    "aria-labelledby": v(I.id, "ordering"),
                    "model-value": I.ordering ?? "none",
                    "onUpdate:modelValue": (M) => I.ordering = M,
                    options: [{ value: "none", label: "Use arrival order" }, { value: "sequence", label: "Use the source’s sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                l("div", so, [
                  l("div", io, [
                    l("label", {
                      for: v(I.id, "audit")
                    }, "Audit", 8, no),
                    A[3] || (A[3] = l("span", { class: "pim-f-note" }, "record each value change", -1))
                  ]),
                  l("div", oo, [
                    f(s(nl), {
                      disabled: !x.value,
                      "input-id": v(I.id, "audit"),
                      "model-value": I.audit !== !1,
                      "onUpdate:modelValue": (M) => M ? delete I.audit : I.audit = !1
                    }, null, 8, ["disabled", "input-id", "model-value", "onUpdate:modelValue"]),
                    l("span", null, _(I.audit === !1 ? "Off for this source" : "Follow catalog audit settings"), 1)
                  ])
                ]),
                l("div", {
                  class: "pim-f pim-w-third",
                  role: "group",
                  "aria-labelledby": v(I.id, "people")
                }, [
                  l("div", uo, [
                    l("label", {
                      id: v(I.id, "people")
                    }, "People and service accounts", 8, co),
                    A[4] || (A[4] = l("span", { class: "pim-f-note" }, "who may write as this source", -1))
                  ]),
                  x.value ? (e(), T(Ln, {
                    key: 0,
                    "catalog-id": a.catalogId,
                    "model-value": I.principals ?? [],
                    "onUpdate:modelValue": (M) => s(Le)(I, "principals", M)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])) : (e(), i("span", mo, _(I.principals?.length ? I.principals.length + (I.principals.length === 1 ? " allowed account" : " allowed accounts") : "No accounts specified"), 1))
                ], 8, ro),
                l("div", po, [
                  l("div", vo, [
                    l("label", {
                      id: v(I.id, "writes")
                    }, "Field groups it can update", 8, fo),
                    A[5] || (A[5] = l("span", { class: "pim-f-note" }, "field groups this source may set", -1))
                  ]),
                  f(Re, {
                    disabled: !x.value,
                    labelledby: v(I.id, "writes"),
                    "model-value": I.writes ?? [],
                    options: H.value,
                    "onUpdate:modelValue": (M) => s(Le)(I, "writes", M)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            x.value ? {
              name: "actions",
              fn: w(() => [
                f(s(G), {
                  type: "button",
                  onClick: (M) => C(I),
                  "aria-label": "Remove " + s(B)(I.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    f(s(te), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["onClick", "aria-label"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "title"]))), 128))
        ]),
        _: 2
      }, [
        x.value ? {
          name: "head",
          fn: w(() => [
            f(Pe, {
              label: "Source name",
              action: "Add source",
              "from-name": "",
              existing: h.value.map((I) => I.id),
              onAdd: u
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])) : y("", !0)
    ]));
  }
}), yo = {
  failed: { label: "Setup failed", severity: "danger" },
  paused: { label: "Background update paused", severity: "warn" },
  degraded: { label: "Degraded", severity: "warn" },
  catchingUp: { label: "Catching up", severity: "info" },
  config: { label: "Configuration needed", severity: "warn" },
  reset: { label: "Reset required", severity: "warn" },
  uninstalled: { label: "Uninstalled · still referenced", severity: "warn" },
  pending: { label: "Setting up", severity: "info" }
};
function la(a, m) {
  return !a.parked && (a.bootstrapping || a.last_seq < m);
}
function go(a, m) {
  return !a.active || !a.installed || a.problem || a.lifecycle.state === "failed" ? !1 : a.lifecycle.state === "pending" || Object.values(a.projections).some((t) => la(t, m));
}
function ho(a, m) {
  const t = a.problem ?? a.lifecycle.error, o = Object.entries(a.projections), b = o.find(([, x]) => x.parked) ?? o.find(([, x]) => x.error) ?? o.find(([, x]) => la(x, m));
  let v;
  return a.active && !a.installed ? v = "uninstalled" : t?.code === "plugin_config_invalid" ? v = "config" : t?.code === "plugin_projection_history_pruned" ? v = "reset" : t || a.lifecycle.state === "failed" ? v = "failed" : a.active && b?.[1].parked ? v = "paused" : a.active && b?.[1].error ? v = "degraded" : a.active && b ? v = "catchingUp" : a.active && a.lifecycle.state === "pending" && (v = "pending"), v ? { kind: v, ...yo[v], error: t, projection: b } : void 0;
}
function ko(a) {
  return (a.problem ?? a.lifecycle.error)?.code === "plugin_interface_version_unsupported";
}
const _o = { class: "pim-stack" }, wo = { class: "pim-bsection-head" }, $o = { class: "muted small" }, Co = {
  key: 0,
  class: "pim-aspect muted"
}, xo = {
  key: 0,
  class: "muted small"
}, Vo = { class: "pim-stack pim-plugin-recovery" }, Uo = {
  key: 0,
  class: "muted small"
}, jo = {
  key: 1,
  class: "muted small"
}, So = { key: 0 }, Ao = { key: 1 }, Ro = { key: 0 }, Io = { key: 0 }, Oo = { key: 0 }, To = { key: 1 }, Po = { key: 2 }, qo = { key: 3 }, Do = { key: 0 }, No = { class: "pim-stack" }, zo = { key: 0 }, Fo = { key: 1 }, Bo = {
  key: 0,
  class: "pim-ia-action"
}, Lo = {
  key: 0,
  class: "pim-ia-dialog"
}, Eo = { class: "pim-ia-dialog-head" }, Mo = { key: 1 }, Wo = { key: 2 }, Ho = { class: "row pim-ia-dialog-actions" }, Jo = {
  key: 0,
  class: "pim-aspect muted"
}, Ko = { class: "row wrap muted small" }, Go = /* @__PURE__ */ ce({
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
    const t = a, o = m, b = /* @__PURE__ */ new Map([
      ["eq", "Equals"],
      ["in", "Is one of"],
      ["gt", "Greater than"],
      ["gte", "At least"],
      ["lt", "Less than"],
      ["lte", "At most"]
    ]), v = K({});
    fe(() => t.refusal, (Y) => {
      Y && (v.value[Y.plugin] = !0);
    }, { immediate: !0 });
    const x = K(), p = F(() => u.value.find((Y) => Y.plugin.plugin === x.value)), h = F(() => p.value?.plugin), q = F(() => t.options.plugins.filter((Y) => Y.installed).length), D = F(() => t.schema.access.admin), H = F(() => t.draft.plugins ?? []), E = F(() => new Map(t.schema.plugins.map((Y) => [Y.plugin, Y]))), U = F(() => {
      const Y = /* @__PURE__ */ new Map();
      for (const [P, Z] of Object.entries(t.schema.attributes)) {
        if (!Z.plugin) continue;
        const N = Y.get(Z.plugin) ?? [];
        N.push(B(P)), Y.set(Z.plugin, N);
      }
      return Y;
    }), u = F(() => t.options.plugins.map((Y) => {
      const P = E.value.get(Y.plugin) ?? Y, Z = ho(P, t.schema.as_of), N = H.value.some((d) => d.use === P.plugin), S = t.refusal?.plugin === P.plugin ? t.refusal : void 0;
      return {
        option: Y,
        plugin: P,
        status: Z,
        chosen: N,
        refusal: S,
        title: re(P.title ?? Y.title, P.installed ? "Plugin" : "Unavailable plugin"),
        label: S ? "Configuration needed" : !P.active && Z?.kind === "failed" ? "Unavailable" : Z?.label ?? (N ? P.active ? "Enabled" : "Will enable on apply" : P.active ? "Will disable on apply" : "Disabled"),
        severity: S ? "warn" : Z?.severity ?? (N ? "success" : "secondary")
      };
    }));
    function C(Y, P) {
      const Z = P.map((N) => b.get(N)).filter(Boolean);
      return [B(Y), Z.join(", ")].filter(Boolean).join(" · ");
    }
    function r(Y, P) {
      P && !H.value.some((Z) => Z.use === Y) && (t.draft.plugins ??= []).push({ use: Y }), P || (t.draft.plugins = H.value.filter((Z) => Z.use !== Y), delete t.pluginConfigs[Y], t.refusal?.plugin === Y && o("clearRefusal"), E.value.get(Y)?.active && o("remove", "plugins", Y));
    }
    function A(Y, P) {
      v.value[Y] = !0, t.pluginConfigs[Y] = P, t.refusal?.plugin === Y && o("clearRefusal");
    }
    const I = F(() => t.draft.scopes ?? []);
    function M(Y) {
      return I.value.includes(Y.id);
    }
    function me(Y, P) {
      P && !M(Y) && (t.draft.scopes ??= []).push(Y.id), !P && M(Y) && (I.value.splice(I.value.indexOf(Y.id), 1), t.schema.declaration.scopes?.includes(Y.id) && o("remove", "scopes", Y.id));
    }
    const we = F(() => {
      const Y = h.value;
      if (!Y) return [];
      const P = Y.references;
      return [
        { label: "Fields", items: (P?.fields ?? Object.entries(t.schema.attributes).filter(([, N]) => N.plugin === Y.plugin).map(([N]) => N)).map((N) => ({ id: N, title: re(B(N), "Field") })) },
        { label: "Product filter sets", items: (P?.scopes ?? []).map((N) => ({
          id: N,
          title: re(t.options.scopes.find((S) => S.id === N)?.title, "Unavailable filter set")
        })) },
        { label: "Catalog app binding", items: (P?.shell_bindings ?? []).map((N) => ({ id: N, title: "Catalog app" })) },
        { label: "Readiness checks", items: (P?.checks ?? []).map((N) => ({ id: N, title: "Readiness check" })) },
        { label: "Dependent plugins", items: (P?.plugins ?? []).map((N) => ({
          id: N,
          title: re(E.value.get(N)?.title, "Dependent plugin")
        })) }
      ].filter((N) => N.items.length);
    });
    function ne(Y) {
      for (const P of Y.references?.scopes ?? [])
        I.value.includes(P) && (t.draft.scopes = I.value.filter((Z) => Z !== P), o("remove", "scopes", P));
      x.value = void 0, r(Y.plugin, !1), o("review");
    }
    return (Y, P) => (e(), i("div", _o, [
      f(qe, {
        count: u.value.length,
        columns: ["details"]
      }, {
        head: w(() => [
          l("header", wo, [
            P[6] || (P[6] = l("h3", null, "Plugins", -1)),
            l("span", $o, _(q.value) + " installed", 1)
          ])
        ]),
        default: w(() => [
          u.value.length === 0 ? (e(), i("div", Co, "No plugin is installed.")) : y("", !0),
          (e(!0), i(L, null, ee(u.value, ({ option: Z, plugin: N, status: S, chosen: d, title: $, label: n, severity: k, refusal: X }) => (e(), T(De, {
            "route-section": "plugins",
            "route-id": N.plugin,
            key: N.plugin,
            title: $,
            open: v.value[N.plugin] ?? !!(N.active && S && S.kind !== "pending"),
            "onUpdate:open": (Q) => v.value[N.plugin] = Q
          }, _e({
            details: w(() => [
              f(s(he), {
                severity: k,
                value: n
              }, null, 8, ["severity", "value"]),
              !S && Z.description ? (e(), i("span", xo, _(s(re)(Z.description, "Adds capabilities to this catalog.")), 1)) : y("", !0)
            ]),
            default: w(() => [
              l("div", Vo, [
                U.value.get(N.plugin)?.length ? (e(), i("p", Uo, " Adds fields for " + _(U.value.get(N.plugin)?.join(", ")) + ". ", 1)) : y("", !0),
                N.active && S?.kind === "failed" && S.projection?.[1].parked ? (e(), i("p", jo, " Background update: Paused ")) : y("", !0),
                S?.kind === "failed" ? (e(), i(L, { key: 2 }, [
                  f(s(Ve), {
                    severity: "warn",
                    role: "alert"
                  }, {
                    default: w(() => [
                      s(ko)(N) ? (e(), i(L, { key: 0 }, [
                        W("This package uses a plugin interface this deployment cannot run. Restore a compatible package to use this plugin.")
                      ], 64)) : (e(), i(L, { key: 1 }, [
                        W("The catalog could not set up this plugin. Check the status after resolving the setup problem.")
                      ], 64))
                    ]),
                    _: 2
                  }, 1024),
                  f(Ce, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: w(() => [
                      l("p", null, [
                        P[7] || (P[7] = W("Plugin ", -1)),
                        l("code", null, _(N.plugin), 1)
                      ]),
                      S.error?.message ? (e(), i("p", So, _(S.error.message), 1)) : y("", !0),
                      S.error?.code ? (e(), i("p", Ao, [
                        l("code", null, _(S.error.code), 1)
                      ])) : y("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  D.value && N.references ? (e(), T(s(G), {
                    key: 0,
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (Q) => x.value = N.plugin
                  }, null, 8, ["onClick"])) : (e(), T(s(G), {
                    key: 1,
                    label: "Check status",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: P[0] || (P[0] = (Q) => o("refresh"))
                  }))
                ], 64)) : S?.kind === "reset" ? (e(), i(L, { key: 3 }, [
                  f(s(Ve), { severity: "warn" }, {
                    default: w(() => [
                      P[8] || (P[8] = W(" The event history this background update needs was removed. ", -1)),
                      S.error?.max_pruned_seq !== void 0 ? (e(), i("p", Ro, "Earliest retained position " + _(S.error.max_pruned_seq + 1) + ".", 1)) : y("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  f(Ce, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: w(() => [
                      l("p", null, [
                        P[9] || (P[9] = W("Plugin ", -1)),
                        l("code", null, _(N.plugin), 1)
                      ]),
                      S.error?.projection ? (e(), i("p", Io, [
                        P[10] || (P[10] = W("Background update ", -1)),
                        l("code", null, _(S.error.projection), 1)
                      ])) : y("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  D.value ? (e(), T(s(G), {
                    key: 0,
                    label: "Reset background updates",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: a.stale,
                    onClick: (Q) => o("reset", N.plugin)
                  }, null, 8, ["disabled", "onClick"])) : y("", !0)
                ], 64)) : S?.projection && (S.kind === "paused" || S.kind === "degraded" || S.kind === "catchingUp") ? (e(), i(L, { key: 4 }, [
                  f(s(Ve), {
                    severity: S.kind === "catchingUp" ? "info" : "warn"
                  }, {
                    default: w(() => [
                      S.projection[1].status === "paused" ? (e(), i("p", Oo, "This update was paused.")) : S.kind === "paused" ? (e(), i("p", To, "The background worker stopped.")) : S.kind === "degraded" ? (e(), i("p", Po, "The background worker reported an error.")) : (e(), i("p", qo, "This update is processing catalog changes.")),
                      l("p", null, "Last applied position " + _(S.projection[1].last_seq) + ".", 1)
                    ]),
                    _: 2
                  }, 1032, ["severity"]),
                  f(Ce, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: w(() => [
                      l("p", null, [
                        P[11] || (P[11] = W("Background update ", -1)),
                        l("code", null, _(S.projection[0]), 1)
                      ]),
                      S.projection[1].error ? (e(), i("p", Do, _(S.projection[1].error), 1)) : y("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  D.value && S.projection[1].status === "paused" && S.projection[1].cursor_id ? (e(), T(s(G), {
                    key: 0,
                    label: "Resume background update",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: a.stale,
                    onClick: (Q) => o("resume", S.projection[1].cursor_id)
                  }, null, 8, ["disabled", "onClick"])) : S.kind === "paused" && D.value ? (e(), T(s(G), {
                    key: 1,
                    label: "Reset background updates",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: a.stale,
                    onClick: (Q) => o("reset", N.plugin)
                  }, null, 8, ["disabled", "onClick"])) : (e(), T(s(G), {
                    key: 2,
                    label: "Check status",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: P[1] || (P[1] = (Q) => o("refresh"))
                  }))
                ], 64)) : S?.kind === "uninstalled" ? (e(), i(L, { key: 5 }, [
                  f(s(Ve), { severity: "warn" }, {
                    default: w(() => [...P[12] || (P[12] = [
                      W("The package was removed while it was still enabled for this catalog.", -1)
                    ])]),
                    _: 1
                  }),
                  f(s(G), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (Q) => x.value = N.plugin
                  }, null, 8, ["onClick"])
                ], 64)) : y("", !0),
                N.installed && (!S || S.kind === "pending") ? (e(), T(Ce, {
                  key: 6,
                  class: "small pim-ia-disclosure",
                  label: "Technical details"
                }, {
                  default: w(() => [
                    l("dl", No, [
                      l("div", null, [
                        P[13] || (P[13] = l("dt", null, "Plugin ID", -1)),
                        l("dd", null, [
                          l("code", null, _(N.plugin), 1)
                        ])
                      ]),
                      (N.interface_version ?? Z.interface_version) != null ? (e(), i("div", zo, [
                        P[14] || (P[14] = l("dt", null, "Interface version", -1)),
                        l("dd", null, _(N.interface_version ?? Z.interface_version), 1)
                      ])) : y("", !0),
                      P[16] || (P[16] = l("div", null, [
                        l("dt", null, "Configuration tool"),
                        l("dd", null, [
                          l("code", null, "PIMConfigurePlugin")
                        ])
                      ], -1)),
                      N.tools.length ? (e(), i("div", Fo, [
                        P[15] || (P[15] = l("dt", null, "Plugin tools", -1)),
                        l("dd", null, [
                          l("ul", null, [
                            (e(!0), i(L, null, ee(N.tools, (Q) => (e(), i("li", { key: Q }, [
                              l("code", null, _(Q), 1)
                            ]))), 128))
                          ])
                        ])
                      ])) : y("", !0)
                    ])
                  ]),
                  _: 2
                }, 1024)) : y("", !0),
                d && N.installed && S?.kind !== "failed" && S?.kind !== "uninstalled" ? (e(), i(L, { key: 7 }, [
                  f(jl, {
                    disabled: !D.value,
                    schema: Z.config_schema,
                    "model-value": a.pluginConfigs[N.plugin] ?? N.config ?? {},
                    problem: S?.kind === "config" ? S.error : void 0,
                    "plugin-id": S?.kind === "config" ? N.plugin : void 0,
                    "problem-label": S?.error?.field && S.error.field !== "config" ? s(ml)(Z.config_schema, S.error.field) : void 0,
                    refusal: X ? s(ml)(Z.config_schema, X.field) + ": " + X.message : void 0,
                    "onUpdate:modelValue": (Q) => A(N.plugin, Q)
                  }, null, 8, ["disabled", "schema", "model-value", "problem", "plugin-id", "problem-label", "refusal", "onUpdate:modelValue"]),
                  D.value && N.active && (a.pluginConfigs[N.plugin] || S?.kind === "config") ? (e(), i("div", Bo, [
                    f(s(G), {
                      disabled: a.stale || !a.pluginConfigs[N.plugin],
                      label: "Save configuration",
                      size: "small",
                      onClick: (Q) => o("configure", N.plugin, a.pluginConfigs[N.plugin])
                    }, null, 8, ["disabled", "onClick"])
                  ])) : y("", !0)
                ], 64)) : y("", !0)
              ])
            ]),
            _: 2
          }, [
            D.value && N.installed && (!S || S.kind === "pending") ? {
              name: "actions",
              fn: w(() => [
                f(s(nl), {
                  "aria-label": "Enable " + $,
                  "model-value": d,
                  "onUpdate:modelValue": (Q) => r(N.plugin, Q)
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "title", "open", "onUpdate:open"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      f(cl, {
        visible: !!h.value,
        label: "Plugin references",
        onClose: P[5] || (P[5] = (Z) => x.value = void 0)
      }, {
        default: w(() => [
          p.value && h.value ? (e(), i("section", Lo, [
            l("header", Eo, [
              l("div", null, [
                P[17] || (P[17] = l("h2", null, "Plugin references", -1)),
                l("p", null, _(p.value.title), 1)
              ])
            ]),
            we.value.length ? (e(), i(L, { key: 0 }, [
              P[18] || (P[18] = l("p", null, "Replace or remove these references before deactivating the plugin. You can also restore the package to keep using them.", -1)),
              (e(!0), i(L, null, ee(we.value, (Z) => (e(), i("div", {
                key: Z.label
              }, [
                l("h3", null, _(Z.label), 1),
                l("ul", null, [
                  (e(!0), i(L, null, ee(Z.items, (N) => (e(), i("li", {
                    key: N.id
                  }, _(N.title), 1))), 128))
                ])
              ]))), 128))
            ], 64)) : (e(), i("p", Mo, "Use the catalog review to see what deactivating this plugin would change.")),
            h.value.references?.scopes.length && !h.value.references?.shell_bindings.length ? (e(), i("p", Wo, "Reviewing removal also includes these product filter sets.")) : y("", !0),
            f(Ce, {
              class: "small pim-error-code pim-ia-disclosure",
              label: "Technical details"
            }, {
              default: w(() => [
                l("p", null, [
                  P[19] || (P[19] = W("Plugin ", -1)),
                  l("code", null, _(h.value.plugin), 1)
                ]),
                (e(!0), i(L, null, ee(we.value, (Z) => (e(), i("div", {
                  key: Z.label
                }, [
                  l("p", null, _(Z.label), 1),
                  l("ul", null, [
                    (e(!0), i(L, null, ee(Z.items, (N) => (e(), i("li", {
                      key: N.id
                    }, [
                      l("code", null, _(N.id), 1)
                    ]))), 128))
                  ])
                ]))), 128))
              ]),
              _: 1
            }),
            l("div", Ho, [
              D.value && h.value.references?.shell_bindings.length ? (e(), T(s(G), {
                key: 0,
                label: "Clear catalog app binding",
                severity: "secondary",
                outlined: "",
                disabled: a.stale,
                onClick: P[2] || (P[2] = (Z) => o("clearShellBinding", h.value.references.shell_bindings[0]))
              }, null, 8, ["disabled"])) : D.value ? (e(), T(s(G), {
                key: 1,
                label: "Review removal",
                disabled: a.stale,
                onClick: P[3] || (P[3] = (Z) => ne(h.value))
              }, null, 8, ["disabled"])) : y("", !0),
              f(s(G), {
                label: "Close",
                severity: "secondary",
                outlined: "",
                onClick: P[4] || (P[4] = (Z) => x.value = void 0)
              })
            ])
          ])) : y("", !0)
        ]),
        _: 1
      }, 8, ["visible"]),
      f(qe, {
        count: a.options.scopes.length,
        columns: ["details"]
      }, {
        head: w(() => [...P[20] || (P[20] = [
          l("header", { class: "pim-bsection-head" }, [
            l("h3", null, "Product filter sets"),
            l("span", { class: "muted small" }, "Choose additional ways to filter products.")
          ], -1)
        ])]),
        default: w(() => [
          f(Ce, {
            class: "small pim-ia-disclosure",
            label: "Filter set technical details"
          }, {
            default: w(() => [...P[21] || (P[21] = [
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
          }),
          a.options.scopes.length === 0 ? (e(), i("div", Jo, "No product filter sets are available.")) : y("", !0),
          (e(!0), i(L, null, ee(a.options.scopes, (Z) => (e(), T(De, {
            "route-section": "plugins",
            "route-id": "scope:" + Z.id,
            key: Z.id,
            title: s(re)(Z.title, "Filter set")
          }, _e({
            details: w(() => [
              f(s(he), {
                severity: M(Z) ? "success" : "secondary",
                value: M(Z) ? "Selected" : "Available"
              }, null, 8, ["severity", "value"])
            ]),
            default: w(() => [
              l("div", Ko, [
                P[22] || (P[22] = l("span", null, "Filters", -1)),
                (e(!0), i(L, null, ee(Z.filters, (N, S) => (e(), T(s(he), {
                  key: S,
                  class: "kx-tag-sm small",
                  severity: "secondary",
                  value: C(S, N.ops)
                }, null, 8, ["value"]))), 128)),
                l("span", null, _(s(B)(Z.access)) + " access required", 1)
              ]),
              f(Ce, {
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
            D.value ? {
              name: "actions",
              fn: w(() => [
                f(s(nl), {
                  "aria-label": "Use " + s(re)(Z.title, "Filter set"),
                  "model-value": M(Z),
                  "onUpdate:modelValue": (N) => me(Z, N)
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
async function Yo(a) {
  const m = await _a(`/api/v1/pim-admin/catalogs/${encodeURIComponent(a)}/policy_defaults`, "policy defaults");
  if (m.audit !== "fields" && m.audit !== "off" || !["audit_days", "trash_days", "tombstone_days"].every((t) => typeof m[t] == "number" && Number.isSafeInteger(m[t])))
    throw new Error("Policy defaults are unavailable.");
  for (const [t, o] of Object.entries(aa)) {
    const b = m[t];
    if (typeof b != "number" || !Number.isSafeInteger(b) || b < o.min || b > o.max) throw new Error(`Policy ${t} is unavailable.`);
  }
  return m;
}
const aa = {
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
}, Zo = { class: "form" }, Qo = {
  key: 0,
  class: "muted small pim-policy-intro"
}, Xo = {
  key: 1,
  class: "muted small pim-policy-status",
  role: "status"
}, ed = {
  key: 0,
  class: "pim-bsection-head"
}, ld = { class: "pim-policy-copy" }, ad = ["for"], td = ["id"], sd = { key: 0 }, id = {
  key: 0,
  class: "pim-policy-value"
}, nd = {
  key: 0,
  class: "muted small"
}, od = /* @__PURE__ */ ce({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {},
    disabled: { type: Boolean },
    defaultsOnly: { type: Boolean }
  },
  setup(a) {
    const m = a, t = K(), o = F(() => m.defaults ?? t.value), b = K(), v = K(!1);
    async function x() {
      if (!(m.defaults || m.disabled)) {
        b.value = void 0, v.value = !0;
        try {
          t.value = await Yo(m.catalogId ?? "");
        } catch (r) {
          b.value = Ee(r, "Could not read policy defaults.");
        } finally {
          v.value = !1;
        }
      }
    }
    Kl(x);
    const p = F(() => m.draft.policy ?? {}), h = [
      { key: "audit", title: "Audit trail", hint: "Fields records each value change. Off records only lifecycle, schema and release history.", kind: "enum" },
      { key: "audit_days", title: "Audit retention (days)", hint: "0 uses the 365-day default. History always expires.", kind: "int", min: 0, max: 106751 },
      { key: "trash_days", title: "Trash window (days)", hint: "How long a deleted product stays restorable.", kind: "int", min: 1, max: 106751 },
      { key: "tombstone_days", title: "Deleted product notices (days)", hint: "How long feeds report a purged product as deleted.", kind: "int", min: 1, max: 106751 }
    ], q = {
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
    function D(r) {
      const A = aa[r];
      return { key: r, ...A, kind: "int", hint: q[r] };
    }
    h.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(D));
    const H = ["proposal_days", "proposal_count"].map(D), E = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(D), U = [
      { id: "retention", title: "Retention", keys: h },
      { id: "proposals", title: "Proposals", keys: H },
      { id: "advanced", title: "", keys: E }
    ], u = F(() => [
      { value: "inherited", label: o.value ? `${o.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function C(r, A) {
      const I = m.draft.policy ?? (m.draft.policy = {});
      I[r] = A == null || A === "" || A === "inherited" ? !1 : A;
    }
    return (r, A) => (e(), i("section", Zo, [
      a.defaultsOnly ? y("", !0) : (e(), i("p", Qo, "Empty fields inherit the deployment settings.")),
      v.value ? (e(), i("p", Xo, "Loading deployment defaults…")) : y("", !0),
      b.value ? (e(), T(fl, {
        key: 2,
        error: b.value
      }, {
        default: w(() => [
          f(s(G), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: x
          }, {
            default: w(() => [...A[0] || (A[0] = [
              W("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : y("", !0),
      (e(), i(L, null, ee(U, (I) => f(Wl(I.id === "advanced" ? Ce : "section"), Oa({
        key: I.id,
        ref_for: !0
      }, I.id === "advanced" ? { label: "Advanced processing settings" } : { "aria-label": I.title }, {
        "data-policy-group": I.id,
        class: "pim-policy-group"
      }), {
        default: w(() => [
          I.title ? (e(), i("header", ed, [
            l("h3", null, _(I.title), 1)
          ])) : y("", !0),
          (e(!0), i(L, null, ee(I.keys, (M) => (e(), i("div", {
            key: M.key,
            class: "pim-policy-row"
          }, [
            l("div", ld, [
              l("label", {
                for: "pol-" + M.key
              }, _(M.title), 9, ad),
              l("p", {
                id: "pol-help-" + M.key
              }, [
                W(_(M.hint), 1),
                M.global ? (e(), i("span", sd, " Managed in deployment settings.")) : y("", !0)
              ], 8, td)
            ]),
            a.defaultsOnly ? (e(), i("p", id, [
              W(_(o.value?.[M.key] === "fields" ? "Record field changes" : o.value?.[M.key] === "off" ? "Lifecycle and release history" : o.value?.[M.key] ?? "Unavailable") + " ", 1),
              p.value[M.key] !== void 0 && p.value[M.key] !== !1 ? (e(), i("span", nd, " · Catalog override applies")) : y("", !0)
            ])) : M.kind === "enum" ? (e(), T(s(xe), {
              key: 1,
              disabled: a.disabled,
              "input-id": "pol-" + M.key,
              "aria-describedby": "pol-help-" + M.key,
              class: "pim-policy-control",
              "model-value": typeof p.value[M.key] == "string" ? p.value[M.key] : "inherited",
              options: u.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": (me) => C(M.key, me)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])) : (e(), T(s(Na), {
              key: 2,
              disabled: a.disabled || M.global,
              "input-id": "pol-" + M.key,
              "aria-describedby": "pol-help-" + M.key,
              class: "pim-policy-control",
              "model-value": M.global ? Number(o.value?.[M.key] ?? 0) || null : typeof p.value[M.key] == "number" ? Number(p.value[M.key]) : null,
              min: M.min ?? (M.key === "audit_days" ? 0 : 1),
              max: M.max,
              step: 1,
              placeholder: o.value ? "Default: " + o.value[M.key] : "Deployment default",
              "onUpdate:modelValue": (me) => C(M.key, me)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "min", "max", "placeholder", "onUpdate:modelValue"]))
          ]))), 128))
        ]),
        _: 2
      }, 1040, ["data-policy-group"])), 64))
    ]));
  }
}), dd = { class: "form" }, rd = { class: "pim-aspect" }, ud = { class: "pim-aspect-head" }, cd = {
  key: 0,
  class: "muted small"
}, md = /* @__PURE__ */ ce({
  __name: "BuilderDeclaration",
  props: {
    draft: {},
    readonly: { type: Boolean }
  },
  emits: ["replace", "validity"],
  setup(a, { emit: m }) {
    const t = a, o = m, b = K(JSON.stringify(t.draft, null, 2)), v = K("");
    Xe(() => o("validity", !0)), fe(() => t.draft, (p) => {
      b.value = JSON.stringify(p, null, 2), v.value = "";
    }, { deep: !0 });
    function x() {
      if (!t.readonly)
        try {
          const p = Xa(b.value);
          v.value = "", o("validity", !0), o("replace", p);
        } catch (p) {
          o("validity", !1), v.value = "Invalid declaration: " + (p instanceof Error ? p.message : String(p));
        }
    }
    return (p, h) => (e(), i("section", dd, [
      l("div", rd, [
        l("header", ud, [
          h[1] || (h[1] = l("h3", null, "Declaration", -1)),
          a.readonly ? y("", !0) : (e(), i("span", cd, "edits apply to the draft when the JSON parses"))
        ]),
        v.value ? (e(), T(s(Ve), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: w(() => [
            W(_(v.value), 1)
          ]),
          _: 1
        })) : y("", !0),
        f(s(za), {
          modelValue: b.value,
          "onUpdate:modelValue": h[0] || (h[0] = (q) => b.value = q),
          readonly: a.readonly,
          "aria-label": "Catalog declaration",
          rows: "28",
          spellcheck: "false",
          onInput: x,
          onBlur: x,
          class: "mono pim-json-edit"
        }, null, 8, ["modelValue", "readonly"])
      ])
    ]));
  }
}), pd = { class: "pim-section-layout" }, vd = { class: "kx-main" }, fd = ["aria-label"], bd = { class: "pim-builder-main" }, yd = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, gd = ["disabled", "inert"], hd = { class: "pim-overview-grid" }, kd = { class: "kx-head-icon" }, _d = { class: "kx-card-id" }, wd = { class: "kx-card-name" }, $d = { class: "kx-card-meta" }, Cd = { class: "kx-card-desc" }, xd = { class: "pim-advanced-actions" }, Vd = { class: "pim-ia-action" }, Ud = { class: "pim-ia-action" }, jd = { class: "pim-ia-dialog" }, Sd = { class: "pim-ia-dialog-head" }, Ad = {
  key: 0,
  class: "dialog-actions"
}, Rd = ["aria-labelledby"], Id = { class: "pim-ia-dialog-head" }, Od = ["id"], Td = { class: "pim-ia-review-impact" }, Pd = { key: 0 }, qd = { key: 1 }, Dd = { key: 2 }, Nd = { key: 3 }, zd = { key: 4 }, Fd = { key: 0 }, Bd = {
  key: 0,
  class: "pim-plan-list"
}, Ld = { key: 1 }, Ed = {
  key: 1,
  class: "pim-ia-review-impact"
}, Md = {
  key: 0,
  class: "row pim-review-confirm"
}, Wd = ["for"], Hd = { class: "dialog-actions pim-ia-dialog-actions" }, Jd = /* @__PURE__ */ ce({
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
    const t = a, o = m, b = {
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
    }, v = {
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
    }, x = K(""), p = K("General"), h = K("Overview"), q = K(""), D = K(), H = K(!1), E = K(), U = Object.keys(b).map((g) => ({
      heading: g === "Channels" ? "Publishing and imports" : g,
      items: b[g].items.map((c) => ({ ...c, value: c.label, section: g }))
    })), u = [
      ...U.filter((g) => g.items.length > 1),
      { heading: "Manage catalog", items: U.filter((g) => g.items.length === 1).flatMap((g) => g.items) }
    ], C = u.flatMap((g) => g.items), r = F(() => S.value && d.value ? [
      { ...u[0], heading: t.title || "Catalog" },
      ...u.slice(1)
    ] : []), A = F(() => t.backLabel ? {
      value: "all-catalogs",
      label: t.embedded ? "All catalogs" : t.backLabel,
      icon: "tabler:table"
    } : void 0), I = K();
    fe(I, (g) => {
      t.focusBack && g?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    function M(g) {
      if (g === "all-catalogs") {
        o("back");
        return;
      }
      const c = C.find((j) => j.label === g);
      c && ne(c.section, c.label);
    }
    function me(g, c, j = "") {
      const ae = h.value !== c;
      p.value = g, h.value = c, x.value = j ? v[c] + "/" + j : "", ae && E.value && (E.value.scrollTop = 0);
    }
    function we(g, c, j = "") {
      me(g, c, j), t.route !== void 0 && o("navigate", [v[c], ...j ? [encodeURIComponent(j)] : []].join("/"));
    }
    function ne(g, c = b[g].items[0].label) {
      (p.value !== g || h.value !== c) && we(g, c);
    }
    function Y(g, c, j) {
      if (t.route === void 0 || v[h.value] !== g || !j && x.value !== g + "/" + c) return;
      const ae = S.value;
      (g === "families" ? ae?.families[c] : g === "fields" ? ae?.declaration.aspects?.some((ie) => ie.attributes?.some((ke) => ie.namespace + "." + ke.id === c)) : g === "dimensions" ? ae?.dimensions.some((ie) => ie.name === c) : g === "vocabularies" ? ae?.vocabularies[c] : g === "channels" ? ae?.channels[c] : g === "sources" ? ae?.sources[c] : g === "plugins" && (d.value?.plugins.some((ie) => ie.plugin === c) || d.value?.scopes.some((ie) => "scope:" + ie.id === c))) && we(p.value, h.value, j ? c : "");
    }
    Hl(ea, { selected: x, choose: Y }), fe(() => t.route, (g) => {
      if (g === void 0) return;
      const [c, j] = g.split("/"), ae = C.find((ie) => v[ie.label] === c);
      let oe = "";
      try {
        j && (oe = decodeURIComponent(j));
      } catch {
      }
      ae?.label === "Fields" && oe && x.value !== "fields/" + oe && (q.value = ""), me(ae?.section ?? "General", ae?.label ?? "Overview", oe);
    }, { immediate: !0 });
    function P(g) {
      D.value = g, H.value = !0;
    }
    function Z(g) {
      q.value = g, ne("Products", "Fields");
    }
    function N(g, c, j = c + "s") {
      return g + " " + (g === 1 ? c : j);
    }
    const S = K(null), d = K(null), $ = K({}), n = K({}), k = K({}), X = K(), Q = F(() => Object.fromEntries(Object.entries(k.value).filter(([g]) => $.value.plugins?.some((c) => c.use === g) && !S.value?.plugins.some((c) => c.plugin === g && c.active)))), se = K(), ve = K(!1), el = K(null), le = K(!1), ge = F(() => S.value?.access.admin === !0), ye = K(""), pe = K(null), Me = K(!1), We = K(!1), ol = K(null), R = Ne(), O = {
      unchanged: "No changes",
      initial: "First schema",
      cosmetic: "Presentation only",
      additive: "New fields or options",
      semantic: "Affects product data",
      refused: "Changes blocked"
    }, z = {
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
    }, V = K(null), de = K(!0), J = Ye(), Oe = F(() => Me.value && al.value && (!kl.value.length || We.value) && !ve.value && de.value && !!pe.value && pe.value.class !== "refused" && !!V.value?.matches(ze.value, S.value?.schema_generation ?? -1, Q.value)), Ue = F(() => pe.value ? [...pe.value.refused, ...pe.value.changes.filter((g) => g.class !== "refused")] : []), Ae = Ye(), ll = Ye(), bl = K(!1);
    let yl = 0;
    fe([$, n, k], () => {
      yl++, $e();
    }, { deep: !0, flush: "sync" });
    async function He(g = !1, c = !1) {
      if (Ie.value && !g) return;
      const j = Ae.begin(), ae = yl, oe = t.catalogId, ie = c ? Object.entries(k.value).filter(([ke]) => S.value?.plugins.some((dl) => dl.plugin === ke && dl.active)) : [];
      bl.value = !0, se.value = void 0, X.value = void 0;
      try {
        const [ke, dl] = await Promise.all([be.schema(oe), be.schemaOptions(oe)]);
        if (!Ae.current(j) || ae !== yl || oe !== t.catalogId) return;
        S.value = ke, d.value = dl, $.value = tl(ke.declaration), n.value = {}, k.value = Object.fromEntries(ie.filter(([ga]) => ke.plugins.some((zl) => zl.plugin === ga && zl.active))), $e(), de.value = !0, ve.value = !1;
      } catch (ke) {
        Ae.current(j) && (se.value = Ee(ke, "Could not load settings."));
      } finally {
        Ae.current(j) && (bl.value = !1);
      }
    }
    let gl = () => {
    };
    fe(() => t.catalogId, (g) => {
      gl(), gl = Gl(`component.${g}`, () => {
        !Ie.value && !le.value ? He() : h.value === "Plugins" && !le.value && Fe();
      });
    }, { immediate: !0 });
    const ta = vl(async () => {
      !Ie.value && !le.value ? await He() : h.value === "Plugins" && !le.value && await Fe();
    });
    Xe(() => {
      gl(), J.begin(), Ae.begin(), ll.begin();
    });
    const Sl = F(() => ta.value !== !1 && h.value === "Plugins" && !le.value && S.value?.plugins.some((g) => go(g, S.value.as_of)) === !0);
    fe(Sl, (g, c, j) => {
      if (!g) return;
      let ae, oe = !0;
      const ie = () => {
        ae = setTimeout(async () => {
          await Fe() && oe && Sl.value && ie();
        }, 2e3);
      };
      ie(), j(() => {
        oe = !1, clearTimeout(ae);
      });
    }), fe(() => t.catalogId, () => {
      J.begin(), le.value = !1, ve.value = !1, S.value = null, d.value = null, _l(), He();
    });
    const sa = F(() => Object.values(Bl($.value, n.value)).reduce((g, c) => g + (c?.length ?? 0), 0)), al = F(() => !!S.value && (JSON.stringify($.value) !== JSON.stringify(S.value.declaration) || sa.value > 0 || Object.keys(Q.value).length > 0)), Ie = F(() => al.value || Object.keys(k.value).length > 0);
    fe(Ie, (g) => o("dirty-changed", g), { immediate: !0 });
    const hl = F(() => $.value.families?.filter((g) => g.code !== "generic") ?? []), Al = F(() => $.value.aspects ?? []), Rl = F(() => Al.value.reduce((g, c) => g + (c.attributes?.length ?? 0), 0)), ia = F(() => {
      const g = new Set($.value.plugins?.map((c) => c.use));
      return Object.values(S.value?.attributes ?? {}).filter((c) => c.plugin && g.has(c.plugin)).length;
    }), na = F(() => !Rl.value && !Al.value.length && !hl.value.length), Il = F(() => $.value.channels ?? []), oa = F(() => $.value.sources ?? []), Ol = F(() => S.value?.plugins.filter((g) => g.active) ?? []), Tl = F(() => t.catalog?.product_count ?? t.catalog?.item_count), da = F(() => [
      {
        section: "Products",
        label: "Product setup",
        icon: "tabler:packages",
        summary: [
          ...typeof Tl.value == "number" ? [N(Tl.value, "product")] : [],
          N(hl.value.length, "family", "families"),
          N(Rl.value + ia.value, "field")
        ].join(" · "),
        detail: hl.value.map((g) => B(g.code)).join(", ") || "Create a family for products that share the same fields."
      },
      {
        section: "Values",
        label: "Allowed values",
        icon: "tabler:list-details",
        summary: [N($.value.dimensions?.length ?? 0, "dimension"), N($.value.vocabularies?.length ?? 0, "vocabulary", "vocabularies")].join(" · "),
        detail: $.value.dimensions?.map((g) => B(g.name)).join(", ") || "Add dimensions when values vary by language, region or another context."
      },
      {
        section: "Channels",
        label: "Publishing and imports",
        icon: "tabler:arrows-exchange",
        summary: [N(Il.value.length, "channel"), N(oa.value.length, "source")].join(" · "),
        detail: Il.value.map((g) => B(g.id)).join(", ") || "Add a release destination when products are ready to publish."
      },
      {
        section: "Plugins",
        label: "Catalog tools",
        icon: "tabler:puzzle",
        summary: N(Ol.value.length, "plugin") + " enabled",
        detail: Ol.value.map((g) => re(g.title, "Catalog plugin")).join(", ") || "Open Plugins to see which tools you can enable."
      }
    ]), ra = {
      Overview: b.General.question,
      History: "What changed in this catalog?",
      Families: "Choose what each family collects, how products vary, and what they need before release.",
      Fields: "Manage product fields and the groups that families share.",
      "Form layout": "In what order will editors see fields?",
      Dimensions: "Where can product values differ?",
      Vocabularies: "Which terms can product editors choose?",
      Channels: "Choose where each family can publish and what products need before release.",
      Sources: "Control who can send product updates and which fields each source can change.",
      Access: b.Access.question,
      Plugins: b.Plugins.question
    }, ze = F(() => {
      const g = tl($.value), c = Bl(g, n.value);
      for (const [j, ae] of Object.entries(c)) {
        const oe = g.remove ??= {};
        oe[j] = [.../* @__PURE__ */ new Set([...oe[j] ?? [], ...ae])];
      }
      return g;
    });
    fe(al, (g) => {
      g || $e();
    }), fe([ze, Q], $e, { deep: !0 });
    function ua(g) {
      const [c, j] = g.split(" ", 2);
      if (c === "plugin" && j) return re(d.value?.plugins.find((ie) => ie.plugin === j)?.title, "Plugin");
      if (c === "scope" && j) return re(d.value?.scopes.find((ie) => ie.id === j)?.title, "Product filter set");
      if (j) return re(B(j), B(c)) + (c === "aspect" ? " field group" : "");
      if (g.startsWith("kickside.")) return "Catalog setting";
      const [ae, oe] = g.split(".", 2);
      return oe ? `${re(B(oe), "Field")} (${re(B(ae), "Field group")})` : re(B(g), "Catalog setting");
    }
    function ca(g) {
      return g.startsWith("renamed from ") ? "Rename from " + B(g.slice(13)) : g.startsWith("config.") ? "Change " + B(g.slice(7)) : g.endsWith(" owning level") ? "Move a field to another variant level" : z[g] ?? B(g);
    }
    const kl = F(() => {
      const g = ze.value.remove;
      return [
        ...g?.attributes?.length || g?.aspects?.length ? ["Removing fields deletes the values stored in those fields."] : [],
        ...g?.vocabularies?.length ? ["Removing a vocabulary deletes its saved terms."] : [],
        ...g?.channels?.length ? ["Removing a release destination withdraws products already published to it."] : []
      ];
    }), Pl = F(() => {
      const g = S.value?.declaration;
      return g ? [
        ...($.value.channels ?? []).flatMap((c) => {
          const j = g.channels?.find((ae) => ae.id === c.id);
          return JSON.stringify(c) === JSON.stringify(j) ? [] : [{ subject: B(c.id), effect: j ? "Change which products can be released here and what they need first" : "Add a release destination" }];
        }),
        ...(ze.value.remove?.channels ?? []).map((c) => ({ subject: B(c), effect: "Remove this release destination" })),
        ...($.value.sources ?? []).flatMap((c) => {
          const j = g.sources?.find((ae) => ae.id === c.id);
          return JSON.stringify(c) === JSON.stringify(j) ? [] : [{ subject: B(c.id), effect: j ? "Update how this source can send product data" : "Let this source send product updates" }];
        }),
        ...(ze.value.remove?.sources ?? []).map((c) => ({ subject: B(c), effect: "Stop accepting updates from this source" }))
      ] : [];
    });
    function Je(g, c) {
      const j = Ee(g, c), ae = j.pluginConfig, oe = d.value?.plugins.find((ie) => ie.installed && ie.plugin === ae?.plugin);
      if (ae && oe && $.value.plugins?.some((ie) => ie.use === ae.plugin)) {
        X.value = ae, ne("Plugins");
        return;
      }
      se.value = j, j.code === wa && (ve.value = !0, $e());
    }
    async function ma() {
      if (!(Ie.value && !await Ge.confirm({
        header: "Discard unsaved changes?",
        message: "Reloading will discard unsaved settings and plugin changes.",
        acceptLabel: "Discard and reload",
        rejectLabel: "Cancel"
      }))) {
        le.value = !0, ye.value = "";
        try {
          await He(!0);
        } finally {
          le.value = !1;
        }
      }
    }
    async function ql() {
      if (!S.value || !al.value || !de.value || ve.value) return;
      const g = J.begin(), c = Ya(ze.value, S.value.schema_generation, Q.value);
      le.value = !0, se.value = void 0;
      try {
        const j = await be.planSchema(t.catalogId, c.declaration, c.generation, c.pluginConfigs);
        if (!J.current(g) || !c.matches(ze.value, S.value.schema_generation, Q.value) || !de.value) return;
        V.value = c, We.value = !1, pe.value = j, Me.value = !0, await Ze(), ol.value?.focus();
      } catch (j) {
        if (!J.current(g)) return;
        Je(j, "Could not review the change."), $e(), await Ze(), el.value?.$el.focus();
      } finally {
        J.current(g) && (le.value = !1);
      }
    }
    async function pa() {
      if (!S.value || !Ie.value || !Oe.value || !V.value) return;
      const g = t.catalogId, c = J.begin();
      le.value = !0, se.value = void 0, ye.value = "";
      try {
        const j = await be.applySchema(g, V.value.declaration, V.value.generation, V.value.pluginConfigs);
        if (g !== t.catalogId || !J.current(c) || (await He(!0, !0), g !== t.catalogId || !J.current(c))) return;
        ye.value = "Catalog changes applied.", o("applied", j.generation);
      } catch (j) {
        if (g !== t.catalogId || !J.current(c)) return;
        $e(), Je(j, "Could not apply the change."), await Ze(), el.value?.$el.focus();
      } finally {
        J.current(c) && (le.value = !1);
      }
    }
    async function Fe(g = !1) {
      const c = t.catalogId, j = S.value, ae = ll.begin();
      try {
        const [oe, ie] = await Promise.all([be.schema(c), g ? be.schemaOptions(c) : void 0]);
        return !j || !ll.current(ae) || c !== t.catalogId || S.value !== j ? !1 : (j.plugins = oe.plugins, j.as_of = oe.as_of, ie && (d.value = ie), !0);
      } catch (oe) {
        return g && ll.current(ae) && c === t.catalogId && Je(oe, "Could not check plugin status."), !1;
      }
    }
    async function Dl(g, c, j = !1) {
      if (le.value || ve.value || !ge.value) return;
      const ae = t.catalogId, oe = Ae.begin(), ie = J.begin();
      ll.begin(), le.value = !0, se.value = void 0, ye.value = "";
      try {
        const ke = JSON.stringify(c);
        if (j ? await be.configurePlugin(ae, g, tl(c), !0) : await be.configurePlugin(ae, g, tl(c)), ae !== t.catalogId || !Ae.current(oe) || !await Fe(!0) || ae !== t.catalogId || !Ae.current(oe)) return;
        !j && JSON.stringify(k.value[g]) === ke && delete k.value[g], X.value?.plugin === g && (X.value = void 0), ye.value = j ? "Background update reset requested." : "Configuration saved";
      } catch (ke) {
        ae === t.catalogId && J.current(ie) && Je(ke, j ? "Could not reset background updates." : "Could not save configuration.");
      } finally {
        J.current(ie) && (le.value = !1);
      }
    }
    async function va(g) {
      const c = t.catalogId, j = S.value?.plugins.find((ae) => ae.plugin === g && ae.active && ae.installed);
      !j?.config || le.value || ve.value || !ge.value || !await Ge.confirm({
        header: "Reset background updates?",
        message: "Background updates will start from a new catalog event. Current product data will be rebuilt into the plugin’s index. Earlier events will be skipped.",
        acceptLabel: "Reset background updates",
        rejectLabel: "Cancel"
      }) || t.catalogId !== c || await Dl(g, j.config, !0);
    }
    async function fa(g) {
      const c = t.catalogId;
      if (!(le.value || ve.value || !ge.value)) {
        le.value = !0, se.value = void 0, ye.value = "";
        try {
          await be.resumePluginProjection(c, g), t.catalogId === c && await Fe(!0) && (ye.value = "Background update resumed.");
        } catch (j) {
          t.catalogId === c && Je(j, "Could not resume the background update.");
        } finally {
          t.catalogId === c && (le.value = !1);
        }
      }
    }
    async function ba(g) {
      const c = t.catalogId;
      if (!(le.value || ve.value || !ge.value) && !(!await Ge.confirm({
        header: "Clear catalog app binding?",
        message: "The catalog will use the default app after this setting is saved.",
        acceptLabel: "Clear binding",
        rejectLabel: "Cancel"
      }) || t.catalogId !== c || le.value || !ge.value || !S.value?.plugins.some((j) => j.references?.shell_bindings.includes(g)))) {
        le.value = !0, se.value = void 0, ye.value = "";
        try {
          if (await be.updateCatalogApp(c, ""), t.catalogId !== c) return;
          await Fe(!0) && (ye.value = "Catalog app binding cleared.");
        } catch (j) {
          t.catalogId === c && Je(j, "Could not clear the catalog app binding.");
        } finally {
          t.catalogId === c && (le.value = !1);
        }
      }
    }
    async function ya() {
      Ie.value && !await Ge.confirm({
        header: "Leave this catalog?",
        message: "Your unsaved catalog changes will be discarded.",
        acceptLabel: "Discard and open settings",
        rejectLabel: "Keep editing"
      }) || (_l(), H.value = !1, Ge.navigate("/system/settings"));
    }
    function $e() {
      Me.value = !1, V.value = null;
    }
    function Nl() {
      H.value = !1, de.value = !0;
    }
    function _l() {
      k.value = {}, X.value = void 0, de.value = !0, S.value && ($.value = tl(S.value.declaration)), n.value = {}, $e(), ye.value = "";
    }
    function Ke(g, c) {
      const j = n.value[g] ?? [];
      j.includes(c) || (n.value = { ...n.value, [g]: [...j, c] });
    }
    return (g, c) => (e(), i("section", {
      class: Se(["pim-builder", { embedded: a.embedded }])
    }, [
      l("div", pd, [
        A.value || S.value && d.value ? (e(), T(Ma, {
          key: 0,
          ref_key: "rail",
          ref: I,
          label: "Catalog settings sections",
          value: h.value,
          groups: r.value,
          "leading-item": A.value,
          "onUpdate:value": M
        }, null, 8, ["value", "groups", "leading-item"])) : y("", !0),
        l("div", vd, [
          l("section", {
            ref_key: "content",
            ref: E,
            class: "kx-main-scroll",
            "aria-label": h.value
          }, [
            S.value && d.value ? (e(), T(Mt, {
              key: 0,
              title: h.value,
              description: ra[h.value]
            }, _e({ _: 2 }, [
              ge.value && Ie.value ? {
                name: "actions",
                fn: w(() => [
                  f(Wt, {
                    busy: le.value,
                    "review-disabled": !de.value || ve.value || !al.value,
                    onDiscard: _l,
                    onReview: ql
                  }, null, 8, ["busy", "review-disabled"])
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : y("", !0),
            l("div", bd, [
              se.value ? (e(), T(fl, {
                key: 0,
                ref_key: "errorPanel",
                ref: el,
                error: se.value,
                tabindex: "-1"
              }, {
                default: w(() => [
                  ve.value ? (e(), T(s(G), {
                    key: 0,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: le.value,
                    onClick: ma
                  }, {
                    default: w(() => [...c[11] || (c[11] = [
                      W("Reload settings", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"])) : !S.value || !d.value ? (e(), T(s(G), {
                    key: 1,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: c[0] || (c[0] = (j) => He())
                  }, {
                    default: w(() => [...c[12] || (c[12] = [
                      W("Retry", -1)
                    ])]),
                    _: 1
                  })) : y("", !0)
                ]),
                _: 1
              }, 8, ["error"])) : y("", !0),
              ye.value ? (e(), T(s(Ve), {
                key: 1,
                severity: "success",
                role: "status"
              }, {
                default: w(() => [
                  W(_(ye.value), 1)
                ]),
                _: 1
              })) : y("", !0),
              S.value?.rebuilding && h.value === "Overview" ? (e(), T(s(Ve), {
                key: 2,
                severity: "info",
                role: "status"
              }, {
                default: w(() => [...c[13] || (c[13] = [
                  W("Updating product readiness", -1)
                ])]),
                _: 1
              })) : y("", !0),
              bl.value && (!S.value || !d.value) ? (e(), i("div", yd, "Loading catalog settings…")) : S.value && d.value ? (e(), i("fieldset", {
                key: 4,
                class: "pim-editor-surface",
                disabled: le.value,
                inert: le.value
              }, [
                ge.value ? y("", !0) : (e(), T(s(Ve), {
                  key: 0,
                  severity: "info"
                }, {
                  default: w(() => [...c[14] || (c[14] = [
                    W("You can view this catalog’s settings.", -1)
                  ])]),
                  _: 1
                })),
                (e(), i("div", {
                  key: h.value,
                  class: "pim-ia-content"
                }, [
                  p.value === "General" && h.value === "History" ? (e(), T(Ft, {
                    key: 0,
                    "catalog-id": a.catalogId,
                    "can-resolve-actors": ge.value
                  }, null, 8, ["catalog-id", "can-resolve-actors"])) : p.value === "General" ? (e(), i(L, { key: 1 }, [
                    l("div", hd, [
                      (e(!0), i(L, null, ee(da.value, (j) => (e(), i("section", {
                        key: j.section,
                        class: "kx-card pim-overview-card"
                      }, [
                        l("span", kd, [
                          f(s(te), {
                            icon: j.icon,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"])
                        ]),
                        l("div", _d, [
                          l("h3", wd, _(j.label), 1),
                          l("p", $d, _(j.summary), 1)
                        ]),
                        l("p", Cd, _(j.detail), 1),
                        f(s(G), {
                          type: "button",
                          text: "",
                          class: "pim-overview-action",
                          onClick: (ae) => ne(j.section)
                        }, {
                          default: w(() => [
                            W(_(j.section === "Products" ? na.value ? "Set up products" : "View families" : "View " + j.section.toLowerCase()) + " ", 1),
                            f(s(te), {
                              icon: "tabler:arrow-right",
                              "aria-hidden": "true"
                            })
                          ]),
                          _: 2
                        }, 1032, ["onClick"])
                      ]))), 128))
                    ]),
                    f(Ce, { label: "Advanced" }, {
                      default: w(() => [
                        l("div", xd, [
                          l("div", Vd, [
                            c[15] || (c[15] = l("div", null, [
                              l("h3", null, "Application defaults"),
                              l("p", null, "Review the audit, retention and processing settings this catalog inherits.")
                            ], -1)),
                            f(s(G), {
                              label: "View defaults",
                              severity: "secondary",
                              outlined: "",
                              onClick: c[1] || (c[1] = (j) => P("defaults"))
                            })
                          ]),
                          l("div", Ud, [
                            c[16] || (c[16] = l("div", null, [
                              l("h3", null, "Technical schema"),
                              l("p", null, "Inspect the complete definition, including integration keys and settings used by installed extensions.")
                            ], -1)),
                            f(s(G), {
                              label: "Open declaration",
                              severity: "secondary",
                              outlined: "",
                              onClick: c[2] || (c[2] = (j) => P("declaration"))
                            })
                          ])
                        ])
                      ]),
                      _: 1
                    })
                  ], 64)) : p.value === "Products" ? (e(), i(L, { key: 2 }, [
                    h.value === "Families" ? (e(), T(Dn, {
                      key: 0,
                      draft: $.value,
                      schema: S.value,
                      options: d.value,
                      onRemove: Ke,
                      onFields: Z
                    }, null, 8, ["draft", "schema", "options"])) : h.value === "Fields" ? (e(), T(Vi, {
                      key: 1,
                      family: q.value,
                      "onUpdate:family": c[3] || (c[3] = (j) => q.value = j),
                      draft: $.value,
                      schema: S.value,
                      options: d.value,
                      onRemove: Ke
                    }, null, 8, ["family", "draft", "schema", "options"])) : (e(), T(ht, {
                      key: 2,
                      draft: $.value,
                      schema: S.value,
                      types: d.value.types
                    }, null, 8, ["draft", "schema", "types"]))
                  ], 64)) : p.value === "Values" ? (e(), i(L, { key: 3 }, [
                    h.value === "Dimensions" ? (e(), T(qi, {
                      key: 0,
                      draft: $.value,
                      schema: S.value,
                      onRemove: Ke
                    }, null, 8, ["draft", "schema"])) : (e(), T(an, {
                      key: 1,
                      "catalog-id": a.catalogId,
                      draft: $.value,
                      schema: S.value,
                      onRemove: Ke
                    }, null, 8, ["catalog-id", "draft", "schema"]))
                  ], 64)) : p.value === "Channels" ? (e(), T(bo, {
                    key: 4,
                    "catalog-id": a.catalogId,
                    draft: $.value,
                    schema: S.value,
                    view: h.value === "Sources" ? "sources" : "channels",
                    onRemove: Ke
                  }, null, 8, ["catalog-id", "draft", "schema", "view"])) : p.value === "Access" ? (e(), T(Ga, {
                    key: 5,
                    "catalog-id": a.catalogId,
                    title: a.title || "Catalog",
                    access: S.value.access
                  }, null, 8, ["catalog-id", "title", "access"])) : (e(), T(Go, {
                    key: 6,
                    draft: $.value,
                    schema: S.value,
                    options: d.value,
                    "plugin-configs": k.value,
                    refusal: X.value,
                    stale: ve.value,
                    onConfigure: Dl,
                    onRemove: Ke,
                    onReset: va,
                    onClearRefusal: c[4] || (c[4] = (j) => X.value = void 0),
                    onRefresh: c[5] || (c[5] = (j) => Fe(!0)),
                    onResume: fa,
                    onReview: ql,
                    onClearShellBinding: ba
                  }, null, 8, ["draft", "schema", "options", "plugin-configs", "refusal", "stale"]))
                ])),
                D.value ? (e(), T(cl, {
                  key: 1,
                  visible: H.value,
                  label: D.value === "defaults" ? "Application defaults" : "Technical schema",
                  onClose: Nl,
                  onClosed: c[8] || (c[8] = (j) => D.value = void 0)
                }, {
                  default: w(() => [
                    l("div", jd, [
                      l("header", Sd, [
                        l("h2", null, _(D.value === "defaults" ? "Application defaults" : "Technical schema"), 1),
                        f(s(G), {
                          type: "button",
                          "aria-label": "Close",
                          text: "",
                          severity: "secondary",
                          onClick: Nl
                        }, {
                          default: w(() => [
                            f(s(te), {
                              icon: "tabler:x",
                              "aria-hidden": "true"
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      D.value === "defaults" ? (e(), i(L, { key: 0 }, [
                        c[17] || (c[17] = l("p", { class: "muted" }, "These settings apply across the application. Catalogs with an explicit override keep their chosen value.", -1)),
                        f(od, {
                          "catalog-id": a.catalogId,
                          draft: $.value,
                          disabled: !ge.value,
                          "defaults-only": ""
                        }, null, 8, ["catalog-id", "draft", "disabled"]),
                        ge.value ? (e(), i("div", Ad, [
                          f(s(G), {
                            type: "button",
                            label: "Open application settings",
                            severity: "secondary",
                            outlined: "",
                            onClick: ya
                          })
                        ])) : y("", !0)
                      ], 64)) : (e(), T(md, {
                        key: 1,
                        draft: $.value,
                        readonly: !ge.value,
                        onReplace: c[6] || (c[6] = (j) => $.value = j),
                        onValidity: c[7] || (c[7] = (j) => {
                          de.value = j, $e();
                        })
                      }, null, 8, ["draft", "readonly"]))
                    ])
                  ]),
                  _: 1
                }, 8, ["visible", "label"])) : y("", !0)
              ], 8, gd)) : y("", !0),
              f(cl, {
                class: "pim-review-dialog",
                visible: Me.value,
                busy: le.value,
                label: "Review changes",
                onClose: $e,
                onClosed: c[10] || (c[10] = (j) => pe.value = null)
              }, {
                default: w(() => [
                  pe.value ? (e(), i("section", {
                    key: 0,
                    class: "pim-ia-dialog pim-plan",
                    "aria-labelledby": s(R)
                  }, [
                    l("header", Id, [
                      l("div", null, [
                        l("h2", {
                          id: s(R),
                          ref_key: "reviewHeading",
                          ref: ol,
                          tabindex: "-1",
                          autofocus: ""
                        }, "Review changes", 8, Od),
                        l("p", null, "Check what will happen when you apply this draft to " + _(a.title || "the catalog") + ".", 1)
                      ]),
                      f(s(G), {
                        type: "button",
                        "aria-label": "Close review",
                        disabled: le.value,
                        text: "",
                        severity: "secondary",
                        onClick: $e
                      }, {
                        default: w(() => [
                          f(s(te), {
                            icon: "tabler:x",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ]),
                    l("div", Td, [
                      l("h3", null, _(O[pe.value.class] || "Catalog changes"), 1),
                      pe.value.class === "unchanged" ? (e(), i("p", Pd, "The catalog already matches this draft.")) : pe.value.class === "initial" ? (e(), i("p", qd, "Product editors will use these settings for new products.")) : pe.value.class === "cosmetic" ? (e(), i("p", Dd, "Catalog settings will update. Stored product values are kept.")) : pe.value.class === "additive" ? (e(), i("p", Nd, "The new options become available. Existing product values are kept.")) : pe.value.class === "semantic" ? (e(), i("p", zd, "Applying changes can recalculate product values or release readiness across this catalog.")) : pe.value.class === "refused" ? (e(), T(s(Ve), {
                        key: 5,
                        severity: "error"
                      }, {
                        default: w(() => [
                          c[18] || (c[18] = W(" These changes can’t be applied. ", -1)),
                          pe.value.migration && pe.value.refused.some((j) => S.value?.attributes[j.code]) ? (e(), i("span", Fd, " To change how a field stores values, add a new field and copy the existing values into it. Then remove the original field and give the new field its name. ")) : y("", !0)
                        ]),
                        _: 1
                      })) : y("", !0)
                    ]),
                    Ue.value.length || Pl.value.length ? (e(), i("ul", Bd, [
                      (e(!0), i(L, null, ee(Ue.value, (j, ae) => (e(), i("li", { key: ae }, [
                        j.class === "refused" ? (e(), T(s(he), {
                          key: 0,
                          class: "kx-tag-sm small",
                          severity: "danger"
                        }, {
                          default: w(() => [...c[19] || (c[19] = [
                            W("Blocked", -1)
                          ])]),
                          _: 1
                        })) : y("", !0),
                        j.code ? (e(), i("strong", Ld, _(ua(j.code)), 1)) : y("", !0),
                        l("span", null, _(ca(j.what)), 1)
                      ]))), 128)),
                      (e(!0), i(L, null, ee(Pl.value, (j) => (e(), i("li", {
                        key: j.subject + j.effect
                      }, [
                        l("strong", null, _(j.subject), 1),
                        l("span", null, _(j.effect), 1)
                      ]))), 128))
                    ])) : y("", !0),
                    kl.value.length ? (e(), i("div", Ed, [
                      c[20] || (c[20] = l("h3", null, "Permanent changes", -1)),
                      (e(!0), i(L, null, ee(kl.value, (j) => (e(), i("p", { key: j }, _(j), 1))), 128)),
                      pe.value.class !== "refused" ? (e(), i("div", Md, [
                        f(s(Ta), {
                          modelValue: We.value,
                          "onUpdate:modelValue": c[9] || (c[9] = (j) => We.value = j),
                          "input-id": s(R) + "-acknowledge",
                          binary: "",
                          disabled: le.value
                        }, null, 8, ["modelValue", "input-id", "disabled"]),
                        l("label", {
                          for: s(R) + "-acknowledge"
                        }, "I understand the effects of these removals", 8, Wd)
                      ])) : y("", !0)
                    ])) : y("", !0),
                    l("footer", Hd, [
                      f(s(G), {
                        type: "button",
                        label: "Back to editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: le.value,
                        onClick: $e
                      }, null, 8, ["disabled"]),
                      S.value?.access.admin && pe.value.class !== "refused" ? (e(), T(s(G), {
                        key: 0,
                        disabled: !Ie.value || le.value || !Oe.value,
                        loading: le.value,
                        onClick: pa
                      }, {
                        default: w(() => [
                          W(_(h.value === "Form layout" ? "Apply layout" : "Apply changes"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled", "loading"])) : y("", !0)
                    ])
                  ], 8, Rd)) : y("", !0)
                ]),
                _: 1
              }, 8, ["visible", "busy"])
            ])
          ], 8, fd)
        ])
      ])
    ], 2));
  }
}), Kd = /* @__PURE__ */ ce({
  __name: "SettingsApp",
  setup(a) {
    const m = $a(), t = Ca(), o = K(), b = F(() => m.value.catalogId ?? ""), v = Ye();
    async function x() {
      const h = v.begin(), q = b.value;
      try {
        const D = await be.catalogSummary(q);
        v.current(h) && (o.value = D);
      } catch {
        v.current(h) && (o.value = void 0);
      }
    }
    fe(b, () => {
      o.value = void 0, x();
    }), vl(x), Xe(() => {
      v.begin();
    });
    function p() {
      m.value.embedded ? t("open-catalog-picker", {}) : t("navigate", { route: "" });
    }
    return (h, q) => b.value ? (e(), T(Jd, {
      key: b.value,
      "catalog-id": b.value,
      title: o.value?.title || "Catalog",
      catalog: o.value,
      embedded: s(m).embedded,
      "focus-back": s(m).focusBack,
      route: s(m).route,
      onNavigate: q[0] || (q[0] = (D) => s(t)("navigate", { route: D })),
      "back-label": s(m).embedded ? "Back to catalogs" : "Back to catalog settings",
      onBack: p,
      onDirtyChanged: q[1] || (q[1] = (D) => s(t)("dirty-changed", { dirty: D }))
    }, null, 8, ["catalog-id", "title", "catalog", "embedded", "focus-back", "route", "back-label"])) : y("", !0);
  }
});
class Gd extends xa {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "catalog-id": { type: "string", default: "" }, embedded: { type: "boolean", default: !1 }, route: { type: "string" }, "focus-back": { type: "boolean", default: !1 } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: Va
    };
  }
  static get vueConfig() {
    return { rootComponent: Kd, plugins: [Ua] };
  }
}
Da(import.meta.url, Gd);
