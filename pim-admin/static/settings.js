import { d as Oa, u as yl, r as Ge, e as Yl, h as Aa, b as gl, p as he, c as Ke, a as xe, _ as fl, i as Ra, S as Pa, f as Ta, g as qa, W as Ia, s as Da, P as Fa } from "./styles-DMYHD085.js";
import { defineComponent as pe, computed as F, openBlock as e, createBlock as P, resolveDynamicComponent as Zl, normalizeProps as Na, guardReactiveProps as za, createSlots as Ce, withCtx as w, createElementVNode as l, normalizeClass as Oe, createElementBlock as s, Fragment as H, renderList as ae, toDisplayString as _, createCommentVNode as c, unref as t, renderSlot as Se, ref as W, onUnmounted as Ye, createVNode as g, createStaticVNode as Ba, createTextVNode as K, withModifiers as ze, normalizeStyle as xl, useId as qe, watch as be, withKeys as ol, nextTick as De, provide as Ql, inject as Hl, useModel as Xl, Transition as Ma, withDirectives as ea, vShow as la, mergeModels as Vl, onBeforeUnmount as La, toRaw as Ea, onMounted as aa, mergeProps as Wa } from "vue";
import { Icon as ne } from "@iconify/vue";
import _e from "primevue/tag";
import Y from "primevue/button";
import Ha from "primevue/checkbox";
import je from "primevue/message";
import { api as Ja, on as ta, host as tl, loadByTagName as Ka, define as Ga } from "@wippy-fe/proxy";
import Ol from "primevue/selectbutton";
import sl from "primevue/inputtext";
import sa from "primevue/multiselect";
import dl from "primevue/toggleswitch";
import Ve from "primevue/select";
import Ya from "primevue/inputnumber";
import Za from "primevue/textarea";
const Qa = ["aria-label"], Xa = {
  key: 0,
  class: "kx-settings-rail-group"
}, et = ["aria-current", "onClick"], lt = { class: "kx-settings-rail-label" }, at = /* @__PURE__ */ pe({
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
    const f = a, i = F(() => f.leadingItem ? [{ items: [f.leadingItem] }, ...f.groups] : f.groups);
    function n(d) {
      const m = [...d.currentTarget.querySelectorAll(".kx-settings-rail-item")], C = m.indexOf(d.target);
      if (C < 0) return;
      let p;
      switch (d.key) {
        case "ArrowDown":
        case "ArrowRight":
          p = (C + 1) % m.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          p = (C + m.length - 1) % m.length;
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
      d.preventDefault(), m[p]?.focus();
    }
    return (d, m) => (e(), P(Zl(a.title ? Oa : "div"), Na(za(a.title ? { title: a.title, count: a.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), Ce({
      default: w(() => [
        l("nav", {
          class: Oe(["kx-settings-rail", { "kx-settings-rail-framed": a.title }]),
          "aria-label": a.label,
          onKeydown: n
        }, [
          (e(!0), s(H, null, ae(i.value, (C, p) => (e(), s("div", {
            key: C.items[0]?.value ?? p,
            class: Oe(["kx-settings-rail-section", { "kx-settings-rail-leading": a.leadingItem && p === 0 }])
          }, [
            C.heading ? (e(), s("div", Xa, _(C.heading), 1)) : c("", !0),
            (e(!0), s(H, null, ae(C.items, (k) => (e(), s("button", {
              key: k.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": k.value === a.value ? "true" : void 0,
              onClick: (M) => d.$emit("update:value", k.value)
            }, [
              k.icon ? (e(), P(t(ne), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: k.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : c("", !0),
              l("span", lt, _(k.label), 1)
            ], 8, et))), 128))
          ], 2))), 128))
        ], 42, Qa)
      ]),
      _: 2
    }, [
      a.title && d.$slots.actions ? {
        name: "actions",
        fn: w(() => [
          Se(d.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), tt = { class: "pim-stack" }, st = { class: "form pim-access-card pim-ia-action" }, it = { class: "pim-access-summary" }, nt = ["config"], ot = /* @__PURE__ */ pe({
  __name: "CatalogShare",
  props: {
    catalogId: {},
    title: {},
    access: {}
  },
  setup(a) {
    const f = a, i = W(!1), n = W(!1), d = W(""), m = W(), C = W(!1), p = Ge(), k = F(() => "/api/v1/component-access/grants/" + encodeURIComponent(f.catalogId)), M = F(() => JSON.stringify({
      resource_id: f.catalogId,
      title: f.title,
      access_url: k.value,
      share_url: "/api/v1/component-access/share/" + encodeURIComponent(f.catalogId)
    })), B = F(() => {
      if (!f.access.admin) return "Only catalog administrators can manage sharing.";
      if (!m.value) return C.value ? "Member counts are unavailable." : "Loading members…";
      const { people: I, groups: h } = m.value;
      return I + (I === 1 ? " person" : " people") + " and " + h + (h === 1 ? " group" : " groups") + " with direct access";
    });
    async function J() {
      if (!f.access.admin) return;
      const I = p.begin();
      C.value = !1;
      try {
        const { data: h } = await Ja.get(k.value);
        if (!p.current(I)) return;
        if (!h?.success || !Array.isArray(h.access)) throw new Error("Grants unavailable");
        const x = h.access.filter((u) => u.subject_type === "group").length;
        m.value = { people: h.access.length - x, groups: x };
      } catch {
        p.current(I) && (m.value = void 0, C.value = !0);
      }
    }
    yl(J), Ye(() => {
      p.begin();
    });
    async function Z() {
      n.value = !0, d.value = "", await Yl("kickside-share") ? i.value = !0 : d.value = "Could not open sharing. Try again.", n.value = !1;
    }
    return (I, h) => (e(), s("div", tt, [
      l("section", st, [
        l("div", null, [
          h[1] || (h[1] = l("h3", null, "Members and sharing", -1)),
          l("p", it, _(B.value), 1)
        ]),
        a.access.admin ? (e(), P(t(Y), {
          key: 0,
          type: "button",
          label: "Share catalog",
          loading: n.value,
          onClick: Z
        }, {
          icon: w(() => [
            g(t(ne), {
              icon: "tabler:share",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : c("", !0),
        C.value ? (e(), P(t(Y), {
          key: 1,
          type: "button",
          label: "Reload member counts",
          severity: "secondary",
          text: "",
          onClick: J
        })) : c("", !0)
      ]),
      h[2] || (h[2] = Ba('<section class="form pim-access-card pim-stack" aria-labelledby="pim-access-roles-heading"><h3 id="pim-access-roles-heading">What members can do</h3><dl class="pim-access-roles"><div><dt>Read</dt><dd>View products and their details.</dd></div><div><dt>Write</dt><dd>Create products and update their values.</dd></div><div><dt>Delete</dt><dd>Move products to trash.</dd></div><div><dt>Admin</dt><dd>Manage catalog settings and who has access.</dd></div></dl></section>', 1)),
      i.value ? (e(), s("kickside-share", {
        key: 0,
        config: M.value,
        onClose: h[0] || (h[0] = (x) => i.value = !1),
        onChanged: J
      }, null, 40, nt)) : c("", !0),
      d.value ? (e(), P(t(je), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: w(() => [
          K(_(d.value), 1)
        ]),
        _: 1
      })) : c("", !0)
    ]));
  }
});
function dt(a, f, i = {}) {
  const n = JSON.stringify(a), d = JSON.stringify(i);
  return {
    declaration: JSON.parse(n),
    generation: f,
    pluginConfigs: JSON.parse(d),
    matches: (m, C, p = {}) => f === C && n === JSON.stringify(m) && d === JSON.stringify(p)
  };
}
function Jl(a, f) {
  const i = {};
  for (const [n, d] of Object.entries(f)) {
    const m = d.filter((C) => n === "plugins" ? !a.plugins?.some((p) => p.use === C) : n === "scopes" ? !a.scopes?.includes(C) : n === "attributes" ? !a.aspects?.some((p) => p.attributes?.some((k) => p.namespace + "." + k.code === C)) : n === "aspects" ? !a.aspects?.some((p) => p.namespace === C) : n === "dimensions" ? !a.dimensions?.some((p) => p.name === C) : n === "vocabularies" || n === "families" ? !a[n]?.some((p) => p.code === C) : !a[n]?.some((p) => p.id === C));
    m.length && (i[n] = m);
  }
  return i;
}
const Kl = (a) => !!a && typeof a == "object" && !Array.isArray(a), me = ["string"], ia = { "*": "string" }, rt = { id: "number", code: "string!", type: "string!", scope: me, cardinality: "string", index: "string", index_contexts: [ia], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, ut = {
  dimensions: [{ name: "string!", members: me, fallback: { "*": me } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: me }, attributes: [rt] }],
  families: [{ code: "string!", aspects: me, variation: [{ axes: me, own: me }], requirements: [{ id: "string!", context: ia, require: me, authored: me }], checks: [{ check: "string!", reads: me, cost: "string", config: "object", enforce: "string" }] }],
  sources: [{ id: "string!", ordering: "string", writes: me, principals: me, audit: "boolean" }],
  channels: [{ id: "string!", requirements: me, families: me }],
  plugins: [{ use: "string!", schema: "json" }],
  scopes: me,
  policy: { "*": "policy" },
  remove: { dimensions: me, vocabularies: me, aspects: me, families: me, sources: me, channels: me, attributes: me, scopes: me, plugins: me }
};
function jl(a, f, i) {
  if (typeof f == "string") {
    const n = f.replace("!", "");
    if (!(n === "json" || (n === "object" ? Kl(a) : n === "policy" ? a === !1 || typeof a == "string" || typeof a == "number" : typeof a === n)) || f.endsWith("!") && (typeof a != "string" || !a.trim())) throw new Error(`${i} has an invalid ${n} value.`);
  } else if (Array.isArray(f)) {
    if (!Array.isArray(a)) throw new Error(`${i} must be an array.`);
    a.forEach((n, d) => jl(n, f[0], `${i}[${d}]`));
  } else {
    if (!Kl(a)) throw new Error(`${i} must be an object.`);
    for (const [n, d] of Object.entries(f)) if (typeof d == "string" && d.endsWith("!") && a[n] === void 0) throw new Error(`${i}.${n} is required.`);
    for (const [n, d] of Object.entries(a)) {
      const m = f[n] ?? f["*"];
      if (!m) throw new Error(`${i}.${n} is not an editor field.`);
      jl(d, m, `${i}.${n}`);
    }
  }
}
function ct(a) {
  const f = JSON.parse(a);
  jl(f, ut, "Declaration");
  const i = f;
  for (const n of i.dimensions ?? []) n.members ??= [];
  return i;
}
function al(a) {
  return JSON.parse(JSON.stringify(a));
}
const Gl = /^[a-z][a-z0-9_]*$/;
function mt(a) {
  return a.trim().normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function Je(a, f, i) {
  i.length ? a[f] = i : delete a[f];
}
function pl(a, f, i) {
  if (i < 0 || i >= a.length || f === i) return;
  const [n] = a.splice(f, 1);
  a.splice(i, 0, n);
}
function ce(a, f) {
  return !a || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(a) ? f : a;
}
function nl(a) {
  return a ? ce(a.title, "Field type") : "Unknown type";
}
async function na(a, f) {
  const i = [...new Set(f)].map((d) => ({ type: "user", id: d }));
  if (!i.length) return {};
  const n = await Aa(`/api/v1/pim-admin/catalogs/${encodeURIComponent(a)}/principal_labels`, { refs: i }, "People");
  return Object.fromEntries((n.principals ?? []).map((d) => [d.id, ce(d.label, "Person")]));
}
const vl = [
  { value: "quarter", label: "¼", span: 3 },
  { value: "third", label: "⅓", span: 4 },
  { value: "half", label: "½", span: 6 },
  { value: "full", label: "1", span: 12 }
];
function Ul(a, f, i) {
  return i.width ?? a.attributes[f + "." + i.code]?.width ?? "half";
}
const pt = (a) => new Date(a).toLocaleString();
function Sl(a) {
  const f = Math.abs(a.m).toString(), i = a.m < 0 ? "-" : "";
  if (a.e >= 0) return i + f + "0".repeat(a.e);
  const n = -a.e, d = f.padStart(n + 1, "0");
  return i + d.slice(0, d.length - n) + "." + d.slice(d.length - n);
}
function E(a) {
  const i = (a.includes(".") ? a.slice(a.indexOf(".") + 1) : a).replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return i ? i[0].toUpperCase() + i.slice(1) : a;
}
function bl(a, f) {
  const i = a.properties;
  return ce(i?.[f]?.title, ce(E(f), "This setting"));
}
function He(a) {
  return a.labels.en ?? Object.values(a.labels)[0] ?? a.code;
}
function oa(a) {
  const f = /* @__PURE__ */ new Map();
  for (const i of a ?? [])
    if (i.code !== "generic")
      for (const n of i.aspects ?? []) {
        const d = f.get(n) ?? [];
        d.push(E(i.code)), f.set(n, d);
      }
  return new Map([...f].map(([i, n]) => [i, "Used by " + n.join(", ")]));
}
function rl(a, f) {
  if (a == null) return "";
  const i = (n) => {
    if (n == null) return "";
    if (typeof n == "object" && "ref" in n) {
      const d = n;
      if (d.ref[0] === "term") {
        const m = d.ref[1].slice(d.ref[1].indexOf(":") + 1), C = d.ref[1].slice(0, d.ref[1].indexOf(":")), p = f?.[C]?.find((k) => k.code === m);
        return p ? He(p) : m;
      }
      return "Linked " + E(d.ref[0]).toLocaleLowerCase();
    }
    if (typeof n == "object" && "v" in n) {
      const d = n;
      return Sl(d.v) + " " + d.u;
    }
    return typeof n == "object" && "m" in n ? Sl(n) : typeof n == "boolean" ? n ? "Yes" : "No" : typeof n == "object" ? JSON.stringify(n) : ce(String(n), "Linked record");
  };
  return Array.isArray(a) ? a.map(i).join(", ") : i(a);
}
function vt(a, f, i) {
  const n = rl(f), d = rl(i);
  return !d && n ? `${a} cleared (was ${n})` : n ? `${a}: ${n} → ${d}` : `${a} set to ${d}`;
}
const ft = { class: "pim-table form pim-layout" }, bt = {
  key: 0,
  class: "pim-layout-help muted"
}, yt = {
  key: 1,
  class: "kx-empty"
}, gt = { class: "pim-aspect-head pim-list-header" }, ht = { class: "muted small" }, kt = ["draggable", "onDragstart", "onDragover", "onDrop"], _t = { class: "pim-lcard-top" }, wt = {
  key: 0,
  class: "pim-grip",
  "aria-hidden": "true"
}, $t = { class: "pim-lcard-name" }, Ct = { class: "pim-lcard-type" }, xt = {
  key: 1,
  class: "pim-lcard-move"
}, Vt = { class: "pim-aspect-head" }, jt = { class: "muted small" }, Ut = { class: "pim-canvas" }, St = { class: "pim-lcard-top" }, Ot = { class: "pim-lcard-name" }, At = { class: "pim-lcard-type" }, Rt = /* @__PURE__ */ pe({
  __name: "LayoutEditor",
  props: {
    draft: {},
    schema: {},
    types: {}
  },
  emits: ["families"],
  setup(a, { emit: f }) {
    const i = a, n = f, d = F(() => i.schema.access.admin), m = F(() => i.draft?.aspects ?? []), C = F(() => new Map(i.types.map((u) => [u.id, nl(u)]))), p = F(() => oa(i.draft.families)), k = F(() => {
      if (!i.schema) return [];
      const u = new Set((i.draft?.aspects ?? []).map((j) => j.namespace)), O = /* @__PURE__ */ new Map();
      for (const [j, V] of Object.entries(i.schema.attributes)) {
        const q = j.split(".")[0];
        u.has(q) || !V.plugin || (O.has(q) || O.set(q, { aspect: q, plugin: V.plugin, codes: [] }), O.get(q).codes.push(j));
      }
      return [...O.values()];
    });
    function M(u, O) {
      return vl.find((j) => j.value === Ul(i.schema, u, O))?.span ?? 6;
    }
    const B = W(null), J = W(null);
    function Z(u, O, j) {
      d.value && (B.value = { ns: u, index: O }, j.dataTransfer?.setData("text/plain", u + ":" + O), j.dataTransfer && (j.dataTransfer.effectAllowed = "move"));
    }
    function I(u, O, j) {
      !B.value || B.value.ns !== u || (j.preventDefault(), J.value = { ns: u, index: O });
    }
    function h(u, O) {
      d.value && B.value?.ns === u.namespace && pl(u.attributes ?? [], B.value.index, O), B.value = null, J.value = null;
    }
    function x() {
      B.value = null, J.value = null;
    }
    return (u, O) => (e(), s("div", ft, [
      d.value ? (e(), s("p", bt, "Arrange fields within each group and choose their widths. Review changes before applying the layout.")) : c("", !0),
      m.value.length === 0 ? (e(), s("div", yt, [
        O[2] || (O[2] = K("This catalog has no field groups yet.", -1)),
        d.value ? (e(), s(H, { key: 0 }, [
          K(" Add a field group in Fields.")
        ], 64)) : c("", !0)
      ])) : c("", !0),
      (e(!0), s(H, null, ae(m.value, (j) => (e(), s("section", {
        key: j.namespace,
        class: "pim-aspect"
      }, [
        l("header", gt, [
          l("div", null, [
            l("h3", null, _(t(E)(j.namespace)), 1),
            l("p", ht, _(p.value.get(j.namespace) ?? "No named family uses this group yet."), 1)
          ]),
          d.value && !p.value.has(j.namespace) ? (e(), P(t(Y), {
            key: 0,
            label: "Open families",
            type: "button",
            text: "",
            size: "small",
            onClick: O[0] || (O[0] = (V) => n("families"))
          })) : c("", !0)
        ]),
        l("div", {
          class: "pim-canvas",
          onDragover: O[1] || (O[1] = ze(() => {
          }, ["prevent"]))
        }, [
          (e(!0), s(H, null, ae(j.attributes ?? [], (V, q) => (e(), s("div", {
            key: V.code,
            class: Oe(["pim-lcard", { dragging: B.value?.ns === j.namespace && B.value?.index === q, over: J.value?.ns === j.namespace && J.value?.index === q }]),
            style: xl({ gridColumn: "span " + M(j.namespace, V) }),
            draggable: d.value,
            onDragstart: (Q) => Z(j.namespace, q, Q),
            onDragover: (Q) => I(j.namespace, q, Q),
            onDrop: ze((Q) => h(j, q), ["prevent"]),
            onDragend: x
          }, [
            l("div", _t, [
              d.value ? (e(), s("span", wt, [
                g(t(ne), { icon: "tabler:grip-vertical" })
              ])) : c("", !0),
              l("span", $t, _(t(E)(V.code)), 1),
              l("span", Ct, _(C.value.get(V.type) ?? t(nl)(void 0)), 1),
              d.value ? (e(), s("span", xt, [
                g(t(Y), {
                  type: "button",
                  disabled: q === 0,
                  "aria-label": "Move " + t(E)(V.code) + " earlier",
                  onClick: (Q) => t(pl)(j.attributes ?? [], q, q - 1),
                  class: "kx-iconbtn sm",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    g(t(ne), { icon: "tabler:arrow-left" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                g(t(Y), {
                  type: "button",
                  disabled: q === (j.attributes ?? []).length - 1,
                  "aria-label": "Move " + t(E)(V.code) + " later",
                  onClick: (Q) => t(pl)(j.attributes ?? [], q, q + 1),
                  class: "kx-iconbtn sm",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    g(t(ne), { icon: "tabler:arrow-right" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ])) : c("", !0)
            ]),
            g(t(Ol), {
              disabled: !d.value,
              "model-value": t(Ul)(a.schema, j.namespace, V),
              options: t(vl),
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Width of " + t(E)(V.code),
              "onUpdate:modelValue": (Q) => V.width = Q
            }, null, 8, ["disabled", "model-value", "options", "aria-label", "onUpdate:modelValue"])
          ], 46, kt))), 128))
        ], 32)
      ]))), 128)),
      (e(!0), s(H, null, ae(k.value, (j) => (e(), s("section", {
        key: j.aspect,
        class: "pim-aspect"
      }, [
        l("header", Vt, [
          l("div", null, [
            l("h3", null, _(t(E)(j.aspect)), 1),
            l("p", jt, _(p.value.get(j.aspect) ?? "No named family uses this group yet."), 1)
          ]),
          O[3] || (O[3] = l("span", { class: "muted small" }, "Provided by a plugin", -1))
        ]),
        l("div", Ut, [
          (e(!0), s(H, null, ae(j.codes, (V) => (e(), s("div", {
            key: V,
            class: "pim-lcard fixed",
            style: xl({ gridColumn: "span " + (t(vl).find((q) => q.value === a.schema.attributes[V].width)?.span ?? 6) })
          }, [
            l("div", St, [
              l("span", Ot, _(t(E)(V)), 1),
              l("span", At, _(C.value.get(a.schema.attributes[V].type) ?? t(nl)(void 0)), 1)
            ])
          ], 4))), 128))
        ])
      ]))), 128))
    ]));
  }
}), Pt = {
  class: "pim-history",
  "aria-label": "Catalog history"
}, Tt = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, qt = { class: "pim-table pim-responsive-table" }, It = ["id"], Dt = ["aria-labelledby"], Ft = {
  key: 0,
  scope: "col"
}, Nt = { class: "muted small" }, zt = ["datetime"], Bt = {
  key: 0,
  class: "small"
}, Mt = {
  key: 0,
  class: "muted"
}, Lt = { class: "mono small" }, Et = {
  key: 0,
  class: "muted"
}, Wt = {
  key: 0,
  class: "muted small"
}, Ht = ["aria-labelledby"], Jt = { class: "pim-stacked-meta muted small" }, Kt = { key: 0 }, Gt = { key: 1 }, Yt = ["datetime"], Zt = {
  key: 1,
  class: "kx-empty"
}, Qt = { class: "pim-table-foot" }, Xt = /* @__PURE__ */ pe({
  __name: "HistoryPanel",
  props: {
    catalogId: {},
    canResolveActors: { type: Boolean }
  },
  setup(a) {
    const f = a, i = W([]), n = W({}), d = W(), m = W(!1), C = W(), p = Ge(), k = qe(), M = F(() => i.value.map((h) => ({
      key: `${h.seq}:${h.n}`,
      at: h.at,
      date: pt(h.at),
      actor: n.value[h.actor] ?? ce(h.actor, "Person"),
      source: h.source ? ce(E(h.source), "Data source") : "",
      product: J(h),
      context: h.ctx ? ce(h.ctx, "Product context") : "",
      change: Z(h)
    })));
    async function B(h = !1) {
      const x = p.begin();
      m.value = !0, C.value = void 0;
      try {
        const u = await he.history(f.catalogId, { limit: 50, before: h ? d.value : void 0 });
        if (!p.current(x)) return;
        if (i.value = h ? [...i.value, ...u.entries] : u.entries, d.value = u.next, f.canResolveActors)
          try {
            const O = await na(f.catalogId, u.entries.map((j) => j.actor));
            p.current(x) && (n.value = { ...n.value, ...O });
          } catch {
          }
      } catch (u) {
        if (!p.current(x)) return;
        C.value = Ke(u, "Could not load the history.");
      } finally {
        p.current(x) && (m.value = !1);
      }
    }
    function J(h) {
      return h.sku ? h.sku : h.subject.startsWith("p:") ? "purged product" : h.subject.startsWith("t:") ? h.subject.slice(2) : h.subject.startsWith("r:") ? "Release" : ce(h.subject, "Catalog");
    }
    function Z(h) {
      if (h.attribute)
        return vt(E(h.attribute), h.before, h.after);
      switch (h.kind) {
        case "schema":
          return "Catalog settings applied";
        case "term": {
          const x = h.after ?? {}, u = x.labels?.en ?? Object.values(x.labels ?? {})[0];
          return x.retired ? "Term retired" : u ? `Term labelled "${u}"` + (x.parent ? ` under ${x.parent}` : "") : "Term changed";
        }
        case "created": {
          const x = h.after ?? {};
          return `Created as ${E(x.family ?? "product")}` + (x.level ? ` at level ${x.level}` : "");
        }
        case "released": {
          const x = h.after ?? {};
          return `Released v${x.version ?? ""} to ${(x.channels ?? []).join(", ")}`;
        }
        case "withdrawn":
          return `Withdrawn from ${((h.after ?? {}).channels ?? []).join(", ")}`;
        case "status":
          return `Status ${String(h.before ?? "")} → ${String(h.after ?? "")}`;
        case "moved":
          return "Moved under another parent";
        default:
          return E(h.kind);
      }
    }
    let I = () => {
    };
    return be(() => f.catalogId, () => {
      I(), p.begin(), i.value = [], n.value = {}, d.value = void 0, C.value = void 0, I = ta(`component.${f.catalogId}`, () => {
        B();
      });
    }, { immediate: !0 }), be(() => f.catalogId, () => {
      B();
    }), yl(() => B()), Ye(() => {
      I(), p.begin();
    }), (h, x) => (e(), s("section", Pt, [
      C.value ? (e(), P(gl, {
        key: 0,
        error: C.value
      }, {
        default: w(() => [
          g(t(Y), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: x[0] || (x[0] = (u) => B())
          }, {
            default: w(() => [...x[2] || (x[2] = [
              K("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : c("", !0),
      m.value ? (e(), s("div", Tt, "Loading history…")) : c("", !0),
      l("div", qt, [
        l("p", {
          id: t(k),
          class: "pim-history-caption muted small"
        }, "Catalog changes, newest first", 8, It),
        M.value.length ? (e(), s(H, { key: 0 }, [
          l("table", {
            class: "pim-grid",
            "aria-labelledby": t(k)
          }, [
            l("thead", null, [
              l("tr", null, [
                x[3] || (x[3] = l("th", { scope: "col" }, "When", -1)),
                a.canResolveActors ? (e(), s("th", Ft, "Who")) : c("", !0),
                x[4] || (x[4] = l("th", { scope: "col" }, "What", -1)),
                x[5] || (x[5] = l("th", { scope: "col" }, "Change", -1))
              ])
            ]),
            l("tbody", null, [
              (e(!0), s(H, null, ae(M.value, (u) => (e(), s("tr", {
                key: u.key
              }, [
                l("td", Nt, [
                  l("time", {
                    datetime: u.at
                  }, _(u.date), 9, zt)
                ]),
                a.canResolveActors ? (e(), s("td", Bt, [
                  K(_(u.actor), 1),
                  u.source ? (e(), s("span", Mt, " via " + _(u.source), 1)) : c("", !0)
                ])) : c("", !0),
                l("td", Lt, [
                  K(_(u.product), 1),
                  u.context ? (e(), s("span", Et, " · " + _(u.context), 1)) : c("", !0)
                ]),
                l("td", null, [
                  K(_(u.change), 1),
                  !a.canResolveActors && u.source ? (e(), s("span", Wt, " via " + _(u.source), 1)) : c("", !0)
                ])
              ]))), 128))
            ])
          ], 8, Dt),
          l("ol", {
            role: "list",
            class: "pim-stacked-list",
            "aria-labelledby": t(k)
          }, [
            (e(!0), s(H, null, ae(M.value, (u) => (e(), s("li", {
              key: u.key,
              class: "pim-stacked-row"
            }, [
              l("div", null, _(u.change), 1),
              l("div", Jt, [
                a.canResolveActors ? (e(), s("span", Kt, [
                  l("span", null, _(u.actor), 1),
                  u.source ? (e(), s(H, { key: 0 }, [
                    K(" via " + _(u.source), 1)
                  ], 64)) : c("", !0)
                ])) : u.source ? (e(), s("span", Gt, "Via " + _(u.source), 1)) : c("", !0),
                l("time", {
                  datetime: u.at
                }, _(u.date), 9, Yt),
                l("span", null, [
                  K(_(u.product), 1),
                  u.context ? (e(), s(H, { key: 0 }, [
                    K(" · " + _(u.context), 1)
                  ], 64)) : c("", !0)
                ])
              ])
            ]))), 128))
          ], 8, Ht)
        ], 64)) : !m.value && !C.value ? (e(), s("div", Zt, "Nothing recorded yet.")) : c("", !0),
        l("div", Qt, [
          l("span", null, _(M.value.length) + " change" + _(M.value.length === 1 ? "" : "s") + " shown", 1),
          d.value ? (e(), P(t(Y), {
            key: 0,
            type: "button",
            disabled: m.value,
            onClick: x[1] || (x[1] = (u) => B(!0)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: w(() => [
              g(t(ne), {
                icon: "tabler:adjustments",
                "aria-hidden": "true"
              }),
              x[6] || (x[6] = K(" Load older", -1))
            ]),
            _: 1
          }, 8, ["disabled"])) : c("", !0)
        ])
      ])
    ]));
  }
}), es = { class: "system-section-head" }, ls = { class: "system-section-head-text" }, as = {
  key: 0,
  class: "kx-head-actions"
}, ts = /* @__PURE__ */ pe({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(a) {
    return (f, i) => (e(), s("header", es, [
      l("div", ls, [
        l("h1", null, _(a.title), 1),
        l("p", null, _(a.description), 1)
      ]),
      f.$slots.actions ? (e(), s("div", as, [
        Se(f.$slots, "actions")
      ])) : c("", !0)
    ]));
  }
}), ss = /* @__PURE__ */ pe({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(a) {
    return (f, i) => (e(), s(H, null, [
      g(t(_e), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      g(t(Y), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: a.busy || a.discardDisabled,
        onClick: i[0] || (i[0] = (n) => f.$emit("discard"))
      }, {
        icon: w(() => [
          g(t(ne), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      g(t(Y), {
        label: "Review changes",
        type: "button",
        disabled: a.busy || a.reviewDisabled,
        loading: a.busy,
        onClick: i[1] || (i[1] = (n) => f.$emit("review", n.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), is = ["onKeydown"], ns = { class: "row pim-add-actions" }, os = ["id"], Be = /* @__PURE__ */ pe({
  __name: "AddSchemaCode",
  props: {
    label: {},
    action: {},
    existing: {},
    fromName: { type: Boolean },
    regular: { type: Boolean }
  },
  emits: ["add"],
  setup(a, { emit: f }) {
    const i = a, n = f, d = W(""), m = W(!1), C = W(), p = qe(), k = F(() => {
      const h = d.value.trim();
      return i.fromName ? mt(h) : h;
    }), M = F(() => d.value.trim() ? i.existing?.includes(k.value) ? i.fromName ? "This name is already in use." : "This code is already in use." : i.fromName && !Gl.test(k.value) ? "Use a name that starts with a letter from A to Z." : Gl.test(k.value) ? "" : "Start with a lowercase letter and use only lowercase letters, numbers or underscores." : ""), B = F(() => !!k.value && !M.value);
    async function J() {
      m.value = !0, await De(), C.value?.querySelector("input")?.focus();
    }
    async function Z() {
      m.value = !1, d.value = "", await De(), C.value?.querySelector("button")?.focus();
    }
    function I() {
      B.value && (n("add", k.value), Z());
    }
    return (h, x) => (e(), s("div", {
      ref_key: "row",
      ref: C,
      class: "row pim-add-row"
    }, [
      m.value ? (e(), s("div", {
        key: 1,
        class: "row pim-add-editor",
        onKeydown: ol(ze(Z, ["stop", "prevent"]), ["esc"])
      }, [
        g(t(sl), {
          modelValue: d.value,
          "onUpdate:modelValue": x[0] || (x[0] = (u) => d.value = u),
          type: "text",
          placeholder: a.label,
          "aria-label": a.label,
          invalid: !!M.value,
          "aria-describedby": M.value ? t(p) : void 0,
          class: Oe({ mono: !a.fromName }),
          onKeydown: ol(ze(I, ["prevent"]), ["enter"])
        }, null, 8, ["modelValue", "placeholder", "aria-label", "invalid", "aria-describedby", "class", "onKeydown"]),
        l("div", ns, [
          g(t(Y), {
            type: "button",
            disabled: !B.value,
            onClick: I
          }, {
            default: w(() => [
              K(_(a.action), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          g(t(Y), {
            type: "button",
            label: "Cancel",
            outlined: "",
            severity: "secondary",
            onClick: Z
          })
        ]),
        M.value ? (e(), s("p", {
          key: 0,
          id: t(p),
          role: "status",
          class: "pim-add-code-error small"
        }, _(M.value), 9, os)) : c("", !0)
      ], 40, is)) : (e(), P(t(Y), {
        key: 0,
        type: "button",
        "aria-expanded": "false",
        severity: "secondary",
        outlined: "",
        size: a.regular ? void 0 : "small",
        onClick: J
      }, {
        default: w(() => [
          g(t(ne), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          K(" " + _(a.action), 1)
        ]),
        _: 1
      }, 8, ["size"])),
      Se(h.$slots, "default")
    ], 512));
  }
}), da = Symbol("definitionColumns"), ds = { code: "Code", kind: "Kind", details: "Details", usage: "Used by" }, rs = {
  code: "minmax(120px, 1fr)",
  kind: "140px",
  details: "minmax(120px, 1.2fr)",
  usage: "120px"
}, us = {
  class: "pim-definition-scroll",
  tabindex: "0",
  "aria-label": "Definitions"
}, cs = { class: "pim-definition-grid" }, ms = {
  key: 0,
  class: "pim-definition-columns",
  "aria-hidden": "true"
}, ps = { class: "pim-definition-actions-heading" }, Me = /* @__PURE__ */ pe({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: { default: () => ["code"] },
    showActions: { type: Boolean }
  },
  setup(a) {
    const f = a;
    Ql(da, F(() => f.columns));
    const i = F(() => ["48px", "minmax(160px, 1.4fr)", ...f.columns.map((n) => rs[n]), f.showActions ? "100px" : "80px"].join(" "));
    return (n, d) => (e(), s("section", {
      class: "form pim-definition-list",
      style: xl({ "--pim-definition-columns": i.value })
    }, [
      Se(n.$slots, "head"),
      l("div", us, [
        l("div", cs, [
          a.count > 3 ? (e(), s("div", ms, [
            d[0] || (d[0] = l("span", null, null, -1)),
            d[1] || (d[1] = l("span", null, "Name", -1)),
            (e(!0), s(H, null, ae(a.columns, (m) => (e(), s("span", {
              key: m,
              class: Oe("pim-definition-" + m)
            }, _(t(ds)[m]), 3))), 128)),
            l("span", ps, _(a.showActions ? "Actions" : ""), 1)
          ])) : c("", !0),
          Se(n.$slots, "default")
        ])
      ]),
      Se(n.$slots, "add")
    ], 4));
  }
}), vs = ["aria-label"], fs = /* @__PURE__ */ pe({
  __name: "InteractiveSurface",
  props: {
    label: {}
  },
  setup(a) {
    return (f, i) => (e(), s("button", {
      type: "button",
      class: "pim-interactive",
      "aria-label": a.label
    }, [
      Se(f.$slots, "default")
    ], 8, vs));
  }
}), ra = Symbol("section row"), bs = { class: "pim-definition" }, ys = {
  class: "pim-definition-lead",
  "data-column": "lead"
}, gs = {
  class: "pim-row-title",
  "data-column": "name"
}, hs = { class: "pim-definition-meta" }, ks = ["data-column"], _s = {
  key: 0,
  class: "mono"
}, ws = {
  class: "pim-definition-actions",
  "data-column": "actions"
}, $s = ["id"], Le = /* @__PURE__ */ pe({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ Vl({
    title: {},
    code: {},
    kind: {},
    usage: {},
    headClass: {},
    toggleClass: {},
    keepMounted: { type: Boolean },
    routeSection: {},
    routeId: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(a) {
    const f = a, i = Hl(da, F(() => [
      ...f.code ? ["code"] : [],
      ...f.kind ? ["kind"] : []
    ])), n = Xl(a, "open"), d = qe(), m = Hl(ra, void 0);
    function C(k) {
      return !!f.routeSection && !!f.routeId && k === f.routeSection + "/" + f.routeId;
    }
    be(() => m?.selected.value, (k, M) => {
      C(k) ? n.value = !0 : C(M) && (n.value = !1);
    }, { immediate: !0 });
    function p() {
      const k = !n.value;
      n.value = k, f.routeSection && f.routeId && m?.choose(f.routeSection, f.routeId, k);
    }
    return (k, M) => (e(), s("section", bs, [
      l("header", {
        class: Oe(["pim-definition-head", a.headClass])
      }, [
        g(fs, {
          class: Oe(["pim-definition-toggle", a.toggleClass]),
          "aria-expanded": n.value,
          "aria-controls": n.value ? t(d) : void 0,
          onClick: p
        }, {
          default: w(() => [
            l("span", ys, [
              g(t(ne), {
                icon: "tabler:chevron-right",
                class: "pim-definition-chevron",
                "aria-hidden": "true"
              })
            ]),
            l("span", gs, _(a.title), 1),
            l("span", hs, [
              (e(!0), s(H, null, ae(t(i), (B) => (e(), s("span", {
                key: B,
                class: Oe("pim-definition-" + B),
                "data-column": B
              }, [
                B === "code" && a.code ? (e(), s("code", _s, _(a.code), 1)) : B === "kind" && a.kind ? (e(), P(t(_e), {
                  key: 1,
                  severity: "secondary",
                  value: a.kind
                }, null, 8, ["value"])) : B === "details" ? Se(k.$slots, "details", {}, void 0, void 0, 2) : B === "usage" ? Se(k.$slots, "usage", {}, () => [
                  K(_(a.usage), 1)
                ], void 0, 3) : c("", !0)
              ], 10, ks))), 128))
            ])
          ]),
          _: 3
        }, 8, ["class", "aria-expanded", "aria-controls"]),
        l("div", ws, [
          Se(k.$slots, "actions")
        ])
      ], 2),
      g(Ma, { name: "pim-expand" }, {
        default: w(() => [
          n.value || a.keepMounted ? ea((e(), s("div", {
            key: 0,
            id: t(d),
            class: "pim-definition-body"
          }, [
            Se(k.$slots, "default")
          ], 8, $s)), [
            [la, n.value]
          ]) : c("", !0)
        ]),
        _: 3
      })
    ]));
  }
}), Cs = { class: "pim-chips pim-picker-chips" }, xs = {
  key: 0,
  class: "muted"
}, Vs = {
  key: 0,
  class: "muted small"
}, js = {
  key: 0,
  class: "muted"
}, Us = {
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
  setup(a, { emit: f }) {
    const i = a, n = f, d = W("");
    function m(J) {
      return i.modelValue.includes(J);
    }
    function C(J) {
      i.disabled || !J || n("update:modelValue", m(J) ? i.modelValue.filter((Z) => Z !== J) : [...i.modelValue, J]);
    }
    function p() {
      const J = d.value.trim();
      if (!J || m(J)) {
        d.value = "";
        return;
      }
      n("update:modelValue", [...i.modelValue, J]), d.value = "";
    }
    function k(J) {
      n("update:modelValue", i.modelValue.filter((Z) => Z !== J));
    }
    const M = F(() => i.modelValue.map((J) => i.options?.find((Z) => Z.value === J) ?? { value: J }));
    function B(J) {
      const Z = J.label ?? J.value;
      return J.detail ? Z + " " + J.detail : Z;
    }
    return (J, Z) => (e(), s("div", Cs, [
      a.disabled ? (e(), s(H, { key: 0 }, [
        (e(!0), s(H, null, ae(M.value, (I) => (e(), s("span", {
          key: I.value
        }, [
          K(_(I.label ?? I.value) + " ", 1),
          I.detail ? (e(), s("small", xs, _(I.detail), 1)) : c("", !0)
        ]))), 128)),
        a.modelValue.length ? c("", !0) : (e(), s("span", Vs, "None"))
      ], 64)) : a.options && (a.dropdown || a.options.length > 10) ? (e(), s(H, { key: 1 }, [
        (e(!0), s(H, null, ae(M.value, (I) => (e(), s("span", {
          key: I.value,
          class: "row"
        }, [
          l("span", null, [
            K(_(I.label ?? I.value) + " ", 1),
            I.detail ? (e(), s("small", js, _(I.detail), 1)) : c("", !0)
          ]),
          g(t(Y), {
            type: "button",
            "aria-label": "Remove " + B(I),
            onClick: (h) => k(I.value),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: w(() => [
              g(t(ne), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128)),
        a.disabled ? c("", !0) : (e(), P(t(Ve), {
          key: 0,
          "model-value": null,
          placeholder: a.placeholder ?? "Add…",
          "aria-labelledby": a.labelledby,
          "aria-label": a.placeholder ?? "Add",
          "onUpdate:modelValue": Z[0] || (Z[0] = (I) => C(I)),
          class: "pim-chip-entry",
          options: a.options.filter((I) => !m(I.value)),
          "option-label": B,
          "option-value": "value",
          appendTo: "self"
        }, {
          option: w(({ option: I }) => [
            l("span", null, [
              K(_(I.label ?? I.value) + " ", 1),
              I.detail ? (e(), s("small", Us, _(I.detail), 1)) : c("", !0)
            ])
          ]),
          _: 1
        }, 8, ["placeholder", "aria-labelledby", "aria-label", "options"]))
      ], 64)) : a.options ? (e(), s(H, { key: 2 }, [
        g(t(Ol), {
          "model-value": a.modelValue.filter((I) => a.options.some((h) => h.value === I)),
          options: a.options.map((I) => ({ value: I.value, label: I.label ?? I.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          disabled: a.disabled,
          "aria-labelledby": a.labelledby,
          "aria-label": a.placeholder ?? "Selected values",
          "onUpdate:modelValue": Z[1] || (Z[1] = (I) => n("update:modelValue", [...I, ...a.modelValue.filter((h) => !a.options.some((x) => x.value === h))]))
        }, null, 8, ["model-value", "options", "disabled", "aria-labelledby", "aria-label"]),
        (e(!0), s(H, null, ae(a.modelValue.filter((I) => !a.options.some((h) => h.value === I)), (I) => (e(), s("span", {
          key: I,
          class: "row"
        }, [
          K(_(I), 1),
          g(t(Y), {
            type: "button",
            "aria-label": "Remove " + I,
            onClick: (h) => k(I),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: w(() => [
              g(t(ne), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128))
      ], 64)) : (e(!0), s(H, { key: 3 }, ae(a.modelValue, (I) => (e(), s("span", {
        key: I,
        class: "row"
      }, [
        K(_(I), 1),
        g(t(Y), {
          type: "button",
          "aria-label": "Remove " + I,
          onClick: (h) => k(I),
          size: "small",
          text: "",
          severity: "secondary"
        }, {
          default: w(() => [
            g(t(ne), { icon: "tabler:x" })
          ]),
          _: 1
        }, 8, ["aria-label", "onClick"])
      ]))), 128)),
      a.free && !a.disabled ? (e(), P(t(sl), {
        key: 4,
        modelValue: d.value,
        "onUpdate:modelValue": Z[2] || (Z[2] = (I) => d.value = I),
        type: "text",
        "aria-labelledby": a.labelledby,
        placeholder: a.placeholder ?? "Add…",
        onKeydown: ol(ze(p, ["prevent"]), ["enter"]),
        onBlur: p,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "aria-labelledby", "placeholder", "onKeydown"])) : c("", !0)
    ]));
  }
}), Ss = { key: 0 }, Os = {
  key: 0,
  class: "pim-config-overrides"
}, As = {
  key: 1,
  class: "muted small"
}, Rs = { key: 3 }, Ps = ["schema", "config", "field-errors"], Ts = {
  key: 1,
  class: "muted small",
  role: "status"
}, Al = /* @__PURE__ */ pe({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean },
    problem: {},
    pluginId: {},
    refusal: {},
    fieldHelp: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(a, { expose: f, emit: i }) {
    const n = a, d = i, m = W(), C = W(0), p = W("pending"), k = F(() => {
      const j = n.schema.properties;
      return !j || typeof j != "object" ? n.schema : {
        ...n.schema,
        properties: Object.fromEntries(Object.entries(j).map(([V, q]) => [
          V,
          q && typeof q == "object" ? {
            ...q,
            title: bl(n.schema, V),
            ...!("description" in q) && n.fieldHelp?.[V] ? { description: n.fieldHelp[V] } : {}
          } : q
        ]))
      };
    }), M = F(() => n.refusal ?? (n.problem?.field ? { field: n.problem.field, message: /missing required property/i.test(n.problem.message) ? "A value is required." : n.problem.message } : void 0)), B = F(() => {
      const j = M.value;
      return j && Object.hasOwn(k.value.properties ?? {}, j.field) ? { [j.field]: j.message } : {};
    }), J = F(() => Object.keys(B.value).length || n.disabled ? "" : n.refusal?.message ?? (n.problem ? "The saved settings don’t meet the plugin’s requirements. Update the configuration below." : "")), Z = F(() => Object.entries(n.modelValue).map(([j, V]) => ({
      key: j,
      label: bl(n.schema, j),
      value: V !== null && typeof V == "object" ? JSON.stringify(V) : rl(V)
    })));
    async function I() {
      p.value = "pending", p.value = await Yl("wc-schema-form") ? "ready" : "failed";
    }
    be(() => n.disabled, (j) => {
      j || I();
    }, { immediate: !0 });
    function h() {
      return m.value?.reportValidity();
    }
    function x(j) {
      const V = j.detail, q = Object.entries(V.errors).some(([Q, R]) => B.value[Q] !== R);
      d("validity", V.valid, q);
    }
    function u() {
      C.value++, d("update:modelValue", {});
    }
    La(() => d("validity", !0, !1)), f({ reportValidity: h });
    function O(j) {
      const V = j.detail;
      V && typeof V == "object" && !Array.isArray(V) && d("update:modelValue", V);
    }
    return (j, V) => (e(), s(H, null, [
      J.value ? (e(), P(t(je), {
        key: 0,
        severity: "warn",
        role: "alert"
      }, {
        default: w(() => [
          K(_(J.value), 1)
        ]),
        _: 1
      })) : c("", !0),
      a.problem ? (e(), P(xe, {
        key: 1,
        class: "small pim-error-code pim-ia-disclosure",
        label: "Technical details"
      }, {
        default: w(() => [
          a.pluginId ? (e(), s("p", Ss, [
            V[0] || (V[0] = K("Plugin ", -1)),
            l("code", null, _(a.pluginId), 1)
          ])) : c("", !0),
          l("p", null, _(a.problem.message), 1)
        ]),
        _: 1
      })) : c("", !0),
      a.disabled ? (e(), s(H, { key: 2 }, [
        Z.value.length ? (e(), s("dl", Os, [
          (e(!0), s(H, null, ae(Z.value, (q) => (e(), s(H, {
            key: q.key
          }, [
            l("dt", null, _(q.label), 1),
            l("dd", null, _(q.value), 1)
          ], 64))), 128))
        ])) : (e(), s("span", As, "No overrides"))
      ], 64)) : (e(), s("div", Rs, [
        p.value === "ready" ? (e(), s("wc-schema-form", {
          key: C.value,
          ref_key: "widget",
          ref: m,
          "allow-unset": "",
          schema: JSON.stringify(k.value),
          config: JSON.stringify(a.modelValue),
          "field-errors": JSON.stringify(B.value),
          onConfigChanged: O,
          onValidityChanged: x
        }, null, 40, Ps)) : p.value === "pending" ? (e(), s("span", Ts, "Configuration form is loading.")) : (e(), P(t(je), {
          key: 2,
          role: "alert",
          severity: "error"
        }, {
          default: w(() => [
            V[2] || (V[2] = K("Configuration form could not be loaded. ", -1)),
            g(t(Y), {
              type: "button",
              onClick: I,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: w(() => [...V[1] || (V[1] = [
                K("Retry", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })),
        a.problem ? c("", !0) : (e(), P(t(Y), {
          key: 3,
          type: "button",
          onClick: u,
          severity: "secondary",
          outlined: "",
          size: "small"
        }, {
          default: w(() => [
            g(t(ne), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            }),
            V[3] || (V[3] = K(" Reset overrides", -1))
          ]),
          _: 1
        }))
      ]))
    ], 64));
  }
}), qs = { key: 0 }, Is = /* @__PURE__ */ pe({
  __name: "DefaultValue",
  props: {
    attribute: {},
    type: {},
    disabled: { type: Boolean }
  },
  emits: ["change"],
  setup(a, { emit: f }) {
    const i = a, n = f, d = F(() => {
      const k = i.type?.form;
      let M = { type: "string" };
      return k === "bool" ? M = { type: "boolean" } : k === "int" ? M = { type: "integer" } : k === "dec" ? M = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : k === "quantity" ? M = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(i.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : k === "record" ? M = { type: "object", additionalProperties: !0 } : k === "ref" && (M = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${i.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (i.attribute.cardinality ?? "one") !== "one" && (M = { type: "array", items: M, uniqueItems: i.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...M, title: "Default value" } } };
    });
    function m(k) {
      return k && typeof k == "object" && "m" in k && "e" in k ? Sl(k) : k;
    }
    function C(k) {
      return i.type?.form === "dec" ? m(k) : i.type?.form === "quantity" && k && typeof k == "object" && "v" in k && "u" in k ? { value: m(k.v), unit: k.u } : k;
    }
    const p = F(() => i.attribute.default === void 0 ? {} : { value: Array.isArray(i.attribute.default) ? i.attribute.default.map(C) : C(i.attribute.default) });
    return (k, M) => a.disabled ? (e(), s("span", qs, _(a.attribute.default == null ? "No default" : t(rl)(a.attribute.default)), 1)) : (e(), P(Al, {
      key: 1,
      schema: d.value,
      "model-value": p.value,
      "onUpdate:modelValue": M[0] || (M[0] = (B) => n("change", B.value))
    }, null, 8, ["schema", "model-value"]));
  }
}), Ds = { class: "pim-stack" }, Fs = {
  key: 0,
  class: "pim-ia-action"
}, Ns = {
  key: 1,
  class: "form pim-card-body pad muted"
}, zs = { class: "pim-bsection-head pim-list-header" }, Bs = { class: "small muted" }, Ms = { class: "row pim-list-actions" }, Ls = { class: "pim-fields" }, Es = { class: "pim-f pim-w-third" }, Ws = { class: "pim-f-label" }, Hs = ["id"], Js = { class: "pim-f pim-w-third" }, Ks = { class: "pim-f-label" }, Gs = ["id"], Ys = {
  key: 0,
  class: "pim-f pim-w-third"
}, Zs = { class: "pim-f-label" }, Qs = ["id"], Xs = {
  key: 1,
  class: "pim-f pim-w-full muted small"
}, ei = {
  key: 2,
  class: "pim-f pim-w-full muted small"
}, li = {
  key: 3,
  class: "pim-f pim-w-third"
}, ai = { class: "pim-f-label" }, ti = ["id"], si = { class: "pim-f pim-w-third" }, ii = { class: "pim-f-label" }, ni = ["id"], oi = { class: "pim-f pim-w-half" }, di = { class: "pim-f-label" }, ri = ["id"], ui = ["aria-labelledby"], ci = { class: "pim-f-label" }, mi = ["id"], pi = ["aria-labelledby"], vi = { class: "pim-f-label" }, fi = ["id"], bi = { class: "pim-fields" }, yi = { class: "pim-f pim-w-third" }, gi = { class: "pim-f-label" }, hi = ["for"], ki = {
  key: 0,
  class: "pim-f-note"
}, _i = { class: "pim-f pim-w-third" }, wi = { class: "pim-f-label" }, $i = ["id"], Ci = { class: "pim-f pim-w-half" }, xi = { class: "pim-f-label" }, Vi = ["for"], ji = { class: "row" }, Ui = {
  key: 0,
  class: "pim-f pim-w-full"
}, Si = { class: "pim-f-label" }, Oi = ["id"], Ai = ["aria-labelledby"], Ri = ["id"], Pi = {
  key: 0,
  class: "row end"
}, Ti = { class: "pim-ia-dialog-head" }, qi = {
  tabindex: "-1",
  autofocus: ""
}, Ii = { class: "pim-source-permissions" }, Di = ["id"], Fi = { class: "dialog-actions pim-group-dialog-actions" }, Ni = /* @__PURE__ */ pe({
  __name: "BuilderFields",
  props: /* @__PURE__ */ Vl({
    draft: {},
    schema: {},
    options: {}
  }, {
    family: { default: "" },
    familyModifiers: {}
  }),
  emits: /* @__PURE__ */ Vl(["remove", "layout"], ["update:family"]),
  setup(a, { emit: f }) {
    const i = a, n = Xl(a, "family"), d = f, m = vl.map((N) => N.value), C = [{ value: "one", label: "Single value" }, { value: "list", label: "Ordered list" }, { value: "set", label: "Unique set" }], p = F(() => i.schema.access.admin), k = F(() => i.draft.aspects ?? []), M = F(() => (i.draft.families ?? []).filter((N) => N.code !== "generic"));
    be(M, (N) => {
      n.value && !N.some((D) => D.code === n.value) && (n.value = "");
    }, { immediate: !0 });
    const B = F(() => [{ value: "", label: "All families" }, ...M.value.map((N) => ({ value: N.code, label: E(N.code) }))]), J = F(() => {
      const N = M.value.find((D) => D.code === n.value);
      return N ? k.value.filter((D) => N.aspects?.includes(D.namespace)) : k.value;
    }), Z = F(() => (i.draft.dimensions ?? []).map((N) => ({ value: N.name, label: E(N.name) }))), I = F(() => (i.draft.vocabularies ?? []).map((N) => N.code)), h = F(() => (i.draft.sources ?? []).map((N) => ({ value: N.id, label: E(N.id) }))), x = F(() => [...i.options.types].sort((N, D) => N.form.localeCompare(D.form)).map((N) => ({ value: N.id, label: nl(N) })));
    function u(N) {
      return i.options.types.find((D) => D.id === N.type);
    }
    function O(N) {
      return u(N)?.target === "term";
    }
    function j(N) {
      return u(N)?.target === "asset";
    }
    function V(N) {
      const D = u(N);
      return !!D && D.form === "ref" && !D.target;
    }
    const q = F(() => oa(i.draft.families)), Q = { none: "None", key: "Exact match", number: "Number range", text: "Text search" }, R = W({}), ie = qe(), we = /* @__PURE__ */ new WeakMap();
    let ve = 0;
    function fe(N, D) {
      if (D.id !== void 0) return N + "." + D.id;
      const z = Ea(D);
      let U = we.get(z);
      return U === void 0 && (U = ++ve, we.set(z, U)), N + ".draft-" + U;
    }
    function se(N, D, z) {
      return ie + "-" + fe(N, D) + "-" + z;
    }
    function G(N, D) {
      N.type = D;
      const z = u(N);
      if (z && N.index && !z.indexes.includes(N.index) && delete N.index, O(N) || delete N.vocabulary, j(N) && delete N.default, !V(N) && N.config && "target" in N.config) {
        const { target: U, ...te } = N.config;
        N.config = Object.keys(te).length ? te : void 0, N.config || delete N.config;
      }
    }
    function A(N, D) {
      Object.keys(D).length ? N.config = D : delete N.config;
    }
    function b(N, D) {
      const z = { ...N.config ?? {} };
      D ? z.target = D : delete z.target, A(N, z);
    }
    function o(N, D) {
      D.length ? N.scope = D : delete N.scope, D.length || delete N.index_contexts;
    }
    function r(N, D, z) {
      z === void 0 || z === "" || z === !1 && D !== "default" ? delete N[D] : N[D] = z;
    }
    function L(N) {
      return N.index_contexts ?? [];
    }
    function y(N) {
      return (i.draft.dimensions ?? []).find((D) => D.name === N)?.members ?? [];
    }
    function T(N) {
      const D = {};
      for (const U of N.scope ?? []) D[U] = y(U)[0] ?? "";
      (N.index_contexts ?? (N.index_contexts = [])).push(D);
    }
    const ee = W(), ke = F(() => ee.value ? E(ee.value.namespace) + " settings" : "");
    async function ye(N, D, z, U) {
      const te = N.currentTarget, X = te.parentElement;
      pl(D, z, U), await De(), (te.isConnected ? te : X?.querySelector("button"))?.focus({ preventScroll: !0 });
    }
    function Ae(N) {
      (i.draft.aspects ??= []).push({ namespace: N, attributes: [] });
    }
    function Ee(N) {
      ee.value = void 0;
      const D = k.value.indexOf(N);
      D >= 0 && k.value.splice(D, 1), i.schema.declaration.aspects?.some((z) => z.namespace === N.namespace) && d("remove", "aspects", N.namespace);
    }
    function re(N, D) {
      const z = i.options.types.find((te) => te.id === "kickside.pim.types:text") ?? i.options.types[0], U = { code: D, type: z?.id ?? "" };
      (N.attributes ??= []).push(U), R.value[fe(N.namespace, U)] = !0;
    }
    function Ze(N, D) {
      const z = N.attributes ?? [], U = z.indexOf(D);
      U >= 0 && z.splice(U, 1);
      const te = D.id === void 0 ? void 0 : i.schema.declaration.aspects?.find((X) => X.namespace === N.namespace)?.attributes?.find((X) => X.id === D.id);
      te && d("remove", "attributes", N.namespace + "." + te.code);
    }
    return (N, D) => (e(), s("div", Ds, [
      M.value.length || p.value && !n.value || k.value.length ? (e(), s("div", Fs, [
        M.value.length ? (e(), P(t(Ve), {
          key: 0,
          modelValue: n.value,
          "onUpdate:modelValue": D[0] || (D[0] = (z) => n.value = z),
          class: "pim-family-filter",
          "aria-label": "Show fields for a family",
          placeholder: "All families",
          options: B.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self"
        }, null, 8, ["modelValue", "options"])) : c("", !0),
        p.value && !n.value ? (e(), P(Be, {
          key: 1,
          label: "Field group name",
          action: "Add field group",
          "from-name": "",
          regular: "",
          existing: k.value.map((z) => z.namespace),
          onAdd: Ae
        }, null, 8, ["existing"])) : c("", !0),
        k.value.length ? (e(), P(t(Y), {
          key: 2,
          label: "Open form layout",
          type: "button",
          text: "",
          size: "small",
          onClick: D[1] || (D[1] = (z) => d("layout"))
        })) : c("", !0)
      ])) : c("", !0),
      n.value && !J.value.length ? (e(), s("p", Ns, "This family has no field groups yet. Open the family to choose which groups it uses.")) : c("", !0),
      (e(!0), s(H, null, ae(J.value, (z) => (e(), P(Me, {
        key: z.namespace,
        count: z.attributes?.length ?? 0,
        columns: ["kind", "details"],
        "show-actions": p.value
      }, {
        head: w(() => [
          l("header", zs, [
            l("div", null, [
              l("h3", null, _(t(E)(z.namespace)), 1),
              l("p", Bs, _(q.value.get(z.namespace) ?? "Unused by families"), 1)
            ]),
            l("div", Ms, [
              p.value ? (e(), P(Be, {
                key: 0,
                label: "Field name",
                action: "Add field",
                "from-name": "",
                existing: z.attributes?.map((U) => U.code),
                onAdd: (U) => re(z, U)
              }, null, 8, ["existing", "onAdd"])) : c("", !0),
              g(t(Y), {
                type: "button",
                "aria-label": t(E)(z.namespace) + " settings",
                title: t(E)(z.namespace) + " settings",
                "aria-haspopup": "dialog",
                severity: "secondary",
                text: "",
                size: "small",
                onClick: (U) => ee.value = z
              }, {
                default: w(() => [
                  g(t(ne), {
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
          (e(!0), s(H, null, ae(z.attributes ?? [], (U, te) => (e(), P(Le, {
            "route-section": "fields",
            "route-id": U.id === void 0 ? void 0 : fe(z.namespace, U),
            key: fe(z.namespace, U),
            open: R.value[fe(z.namespace, U)],
            "onUpdate:open": (X) => R.value[fe(z.namespace, U)] = X,
            title: t(E)(U.code),
            kind: t(nl)(u(U)),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle"
          }, Ce({
            details: w(() => [
              U.cardinality && U.cardinality !== "one" ? (e(), P(t(_e), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [
                  K(_(C.find((X) => X.value === U.cardinality)?.label), 1)
                ]),
                _: 2
              }, 1024)) : c("", !0),
              U.scope?.length ? (e(), P(t(_e), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [
                  K("per " + _(U.scope.map(t(E)).join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : c("", !0),
              U.index && U.index !== "none" ? (e(), P(t(_e), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [
                  K(_(Q[U.index] || "Filterable"), 1)
                ]),
                _: 2
              }, 1024)) : c("", !0),
              U.unique ? (e(), P(t(_e), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [...D[7] || (D[7] = [
                  K("unique", -1)
                ])]),
                _: 1
              })) : c("", !0)
            ]),
            default: w(() => [
              l("div", Ls, [
                l("div", Es, [
                  l("div", Ws, [
                    l("label", {
                      id: se(z.namespace, U, "type")
                    }, "Type", 8, Hs)
                  ]),
                  g(t(Ve), {
                    disabled: !p.value,
                    "aria-labelledby": se(z.namespace, U, "type"),
                    "model-value": U.type,
                    options: x.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (X) => G(U, X)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                l("div", Js, [
                  l("div", Ks, [
                    l("label", {
                      id: se(z.namespace, U, "values")
                    }, "Values", 8, Gs)
                  ]),
                  g(t(Ve), {
                    disabled: !p.value,
                    "aria-labelledby": se(z.namespace, U, "values"),
                    "model-value": U.cardinality ?? "one",
                    options: C,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (X) => r(U, "cardinality", X === "one" ? void 0 : X)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                O(U) ? (e(), s("div", Ys, [
                  l("div", Zs, [
                    l("label", {
                      id: se(z.namespace, U, "vocabulary")
                    }, "Vocabulary", 8, Qs)
                  ]),
                  g(t(Ve), {
                    disabled: !p.value,
                    "aria-labelledby": se(z.namespace, U, "vocabulary"),
                    "model-value": U.vocabulary ?? "",
                    "onUpdate:modelValue": (X) => r(U, "vocabulary", X),
                    options: [{ value: "", label: "Choose…" }, ...I.value.map((X) => ({ value: X, label: t(E)(X) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : c("", !0),
                j(U) ? (e(), s("p", Xs, "Choose the media types and file size this field accepts. Catalog readers can access attached files.")) : u(U)?.form === "ref" && !O(U) ? (e(), s("p", ei, _(V(U) ? "A link points to something managed by an installed plugin." : "A product reference points to another product in this catalog."), 1)) : c("", !0),
                V(U) ? (e(), s("div", li, [
                  l("div", ai, [
                    l("label", {
                      id: se(z.namespace, U, "link")
                    }, "Link destination", 8, ti),
                    D[8] || (D[8] = l("span", { class: "pim-f-note" }, "choose what the field can point to", -1))
                  ]),
                  g(t(Ve), {
                    disabled: !p.value,
                    "aria-labelledby": se(z.namespace, U, "link"),
                    "model-value": U.config?.target ?? "",
                    "onUpdate:modelValue": (X) => b(U, X),
                    options: [{ value: "", label: "Choose…" }, ...a.options.link_kinds.map((X) => ({ value: X.kind, label: t(ce)(X.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : c("", !0),
                l("div", si, [
                  l("div", ii, [
                    l("label", {
                      id: se(z.namespace, U, "width")
                    }, "Width", 8, ni),
                    D[9] || (D[9] = l("span", { class: "pim-f-note" }, "of a form row", -1))
                  ]),
                  g(t(Ol), {
                    disabled: !p.value,
                    "aria-labelledby": se(z.namespace, U, "width"),
                    "model-value": t(Ul)(a.schema, z.namespace, U),
                    options: t(m),
                    "allow-empty": !1,
                    "onUpdate:modelValue": (X) => U.width = X
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                l("div", oi, [
                  l("div", di, [
                    l("label", {
                      id: se(z.namespace, U, "scope")
                    }, "Varies per", 8, ri),
                    D[10] || (D[10] = l("span", { class: "pim-f-note" }, "dimensions the value depends on", -1))
                  ]),
                  g(Te, {
                    disabled: !p.value,
                    labelledby: se(z.namespace, U, "scope"),
                    "model-value": U.scope ?? [],
                    options: Z.value,
                    "onUpdate:modelValue": (X) => o(U, X)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                j(U) ? c("", !0) : (e(), s("div", {
                  key: 4,
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": se(z.namespace, U, "default")
                }, [
                  l("div", ci, [
                    l("label", {
                      id: se(z.namespace, U, "default")
                    }, "Default", 8, mi),
                    D[11] || (D[11] = l("span", { class: "pim-f-note" }, "when no value is set", -1))
                  ]),
                  g(Is, {
                    disabled: !p.value,
                    attribute: U,
                    type: u(U),
                    onChange: (X) => r(U, "default", X)
                  }, null, 8, ["disabled", "attribute", "type", "onChange"])
                ], 8, ui)),
                u(U)?.config_schema ? (e(), s("div", {
                  key: 5,
                  class: "pim-f pim-w-full",
                  role: "group",
                  "aria-labelledby": se(z.namespace, U, "config")
                }, [
                  l("div", vi, [
                    l("label", {
                      id: se(z.namespace, U, "config")
                    }, "Type configuration", 8, fi)
                  ]),
                  g(Al, {
                    disabled: !p.value,
                    schema: u(U).config_schema,
                    "model-value": U.config ?? {},
                    "onUpdate:modelValue": (X) => A(U, X)
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue"])
                ], 8, pi)) : c("", !0)
              ]),
              g(xe, {
                class: "pim-field-advanced pim-ia-disclosure",
                label: "Advanced"
              }, {
                default: w(() => [
                  l("div", bi, [
                    l("div", yi, [
                      l("div", gi, [
                        l("label", {
                          for: se(z.namespace, U, "code")
                        }, "Integration key", 8, hi),
                        U.id !== void 0 ? (e(), s("span", ki, "renaming keeps stored values")) : c("", !0)
                      ]),
                      g(t(sl), {
                        disabled: !p.value,
                        id: se(z.namespace, U, "code"),
                        type: "text",
                        value: U.code,
                        onInput: (X) => U.code = X.target.value,
                        class: "mono"
                      }, null, 8, ["disabled", "id", "value", "onInput"])
                    ]),
                    l("div", _i, [
                      l("div", wi, [
                        l("label", {
                          id: se(z.namespace, U, "index")
                        }, "Search and filters", 8, $i),
                        D[12] || (D[12] = l("span", { class: "pim-f-note" }, "choose how this field can be matched", -1))
                      ]),
                      g(t(Ve), {
                        disabled: !p.value,
                        "aria-labelledby": se(z.namespace, U, "index"),
                        "model-value": U.index ?? "none",
                        options: (u(U)?.indexes ?? ["none"]).map((X) => ({ value: X, label: Q[X] || t(E)(X) })),
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self",
                        "onUpdate:modelValue": (X) => r(U, "index", X === "none" ? void 0 : X)
                      }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ]),
                    l("div", Ci, [
                      l("div", xi, [
                        l("label", {
                          for: se(z.namespace, U, "unique")
                        }, "Unique", 8, Vi),
                        D[13] || (D[13] = l("span", { class: "pim-f-note" }, "one holder per value, catalog wide", -1))
                      ]),
                      l("div", ji, [
                        g(t(dl), {
                          "input-id": se(z.namespace, U, "unique"),
                          "model-value": U.unique === !0,
                          disabled: !p.value || !!U.scope?.length || (U.cardinality ?? "one") !== "one",
                          "onUpdate:modelValue": (X) => r(U, "unique", X)
                        }, null, 8, ["input-id", "model-value", "disabled", "onUpdate:modelValue"]),
                        l("span", null, _(U.unique ? "Yes" : "No"), 1)
                      ])
                    ]),
                    (U.scope?.length ?? 0) > 0 && U.index && U.index !== "none" ? (e(), s("div", Ui, [
                      l("div", Si, [
                        l("label", {
                          id: se(z.namespace, U, "contexts")
                        }, "Filterable combinations", 8, Oi),
                        D[14] || (D[14] = l("span", { class: "pim-f-note" }, "which combinations get an index", -1))
                      ]),
                      l("div", {
                        class: "pim-contexts",
                        role: "group",
                        "aria-labelledby": se(z.namespace, U, "contexts")
                      }, [
                        (e(!0), s(H, null, ae(L(U), (X, ue) => (e(), s("div", {
                          key: ue,
                          class: "pim-context-row"
                        }, [
                          (e(!0), s(H, null, ae(U.scope, ($e) => (e(), s("div", {
                            key: $e,
                            class: "pim-context-field"
                          }, [
                            l("span", {
                              id: se(z.namespace, U, "context-" + ue + "-" + $e),
                              class: "small muted"
                            }, _(t(E)($e)), 9, Ri),
                            g(t(Ve), {
                              disabled: !p.value,
                              "aria-labelledby": se(z.namespace, U, "context-" + ue + "-" + $e),
                              "model-value": X[$e] ?? "",
                              options: y($e),
                              class: "narrow",
                              appendTo: "self",
                              "onUpdate:modelValue": (Qe) => X[$e] = Qe
                            }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                          ]))), 128)),
                          p.value ? (e(), P(t(Y), {
                            key: 0,
                            type: "button",
                            "aria-label": "Remove context",
                            onClick: ($e) => L(U).splice(ue, 1),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: w(() => [
                              g(t(ne), { icon: "tabler:x" })
                            ]),
                            _: 1
                          }, 8, ["onClick"])) : c("", !0)
                        ]))), 128)),
                        p.value ? (e(), P(t(Y), {
                          key: 0,
                          type: "button",
                          onClick: (X) => T(U),
                          severity: "secondary",
                          outlined: "",
                          size: "small"
                        }, {
                          default: w(() => [
                            g(t(ne), {
                              icon: "tabler:plus",
                              "aria-hidden": "true"
                            }),
                            D[15] || (D[15] = K(" Add context", -1))
                          ]),
                          _: 1
                        }, 8, ["onClick"])) : c("", !0)
                      ], 8, Ai)
                    ])) : c("", !0)
                  ])
                ]),
                _: 2
              }, 1024),
              p.value ? (e(), s("div", Pi, [
                g(t(Y), {
                  type: "button",
                  onClick: (X) => Ze(z, U),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    g(t(ne), { icon: "tabler:trash" }),
                    D[16] || (D[16] = K(" Remove field", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : c("", !0)
            ]),
            _: 2
          }, [
            p.value ? {
              name: "actions",
              fn: w(() => [
                te > 0 ? (e(), P(t(Y), {
                  key: 0,
                  type: "button",
                  "aria-label": "Move " + t(E)(U.code) + " earlier",
                  onClick: (X) => ye(X, z.attributes, te, te - 1),
                  text: "",
                  size: "small",
                  severity: "secondary"
                }, {
                  default: w(() => [
                    g(t(ne), {
                      icon: "tabler:arrow-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])) : c("", !0),
                te < (z.attributes?.length ?? 0) - 1 ? (e(), P(t(Y), {
                  key: 1,
                  type: "button",
                  class: "pim-move-later",
                  "aria-label": "Move " + t(E)(U.code) + " later",
                  onClick: (X) => ye(X, z.attributes, te, te + 1),
                  text: "",
                  size: "small",
                  severity: "secondary"
                }, {
                  default: w(() => [
                    g(t(ne), {
                      icon: "tabler:arrow-down",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])) : c("", !0)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "open", "onUpdate:open", "title", "kind"]))), 128))
        ]),
        _: 2
      }, 1032, ["count", "show-actions"]))), 128)),
      g(fl, {
        visible: !!ee.value,
        label: ke.value,
        onClose: D[6] || (D[6] = (z) => ee.value = void 0)
      }, {
        default: w(() => [
          ee.value ? (e(), s("section", {
            key: 0,
            class: "pim-ia-dialog",
            onKeydown: D[5] || (D[5] = ol(ze((z) => ee.value = void 0, ["prevent"]), ["esc"]))
          }, [
            l("header", Ti, [
              l("h2", qi, _(ke.value), 1)
            ]),
            l("div", Ii, [
              l("label", {
                id: t(ie) + "-writers"
              }, "Sources allowed to write", 8, Di),
              g(t(sa), {
                disabled: !p.value,
                "aria-labelledby": t(ie) + "-writers",
                "model-value": ee.value.write?.sources ?? [],
                options: h.value,
                "option-label": "label",
                "option-value": "value",
                placeholder: "Any source",
                "append-to": "self",
                "onUpdate:modelValue": D[2] || (D[2] = (z) => ee.value.write = { sources: z })
              }, null, 8, ["disabled", "aria-labelledby", "model-value", "options"])
            ]),
            l("footer", Fi, [
              p.value ? (e(), P(t(Y), {
                key: 0,
                type: "button",
                label: "Remove field group",
                severity: "danger",
                text: "",
                onClick: D[3] || (D[3] = (z) => Ee(ee.value))
              })) : c("", !0),
              g(t(Y), {
                type: "button",
                label: "Done",
                severity: "secondary",
                outlined: "",
                onClick: D[4] || (D[4] = (z) => ee.value = void 0)
              })
            ])
          ], 32)) : c("", !0)
        ]),
        _: 1
      }, 8, ["visible", "label"])
    ]));
  }
}), zi = { class: "muted small" }, Bi = { class: "pim-aspect" }, Mi = {
  key: 0,
  class: "small muted"
}, Li = { class: "pim-fields" }, Ei = { class: "pim-f pim-w-full" }, Wi = { class: "pim-f-label" }, Hi = ["id"], Ji = { class: "pim-f-label" }, Ki = ["id"], Gi = /* @__PURE__ */ pe({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(a, { emit: f }) {
    const i = a, n = f, d = F(() => i.schema.access.admin), m = F(() => i.draft.dimensions ?? []), C = qe();
    function p(h, x) {
      return C + "-" + h.name + "-" + x;
    }
    function k(h) {
      (i.draft.dimensions ??= []).push({ name: h, members: [] });
    }
    function M(h) {
      const x = [];
      for (const u of i.draft.aspects ?? []) for (const O of u.attributes ?? []) O.scope?.includes(h.name) && x.push(`${E(O.code)} (${E(u.namespace)})`);
      for (const u of i.draft.families ?? []) for (const O of u.requirements ?? []) O.context && h.name in O.context && x.push(`${E(O.id)} (${E(u.code)})`);
      return x;
    }
    function B(h) {
      M(h).length || (m.value.splice(m.value.indexOf(h), 1), i.schema.declaration.dimensions?.some((x) => x.name === h.name) && n("remove", "dimensions", h.name));
    }
    function J(h, x) {
      if (h.members = x, h.fallback)
        for (const u of Object.keys(h.fallback)) x.includes(u) || delete h.fallback[u];
    }
    function Z(h, x) {
      return h.fallback?.[x] ?? [];
    }
    function I(h, x, u) {
      const O = { ...h.fallback ?? {} };
      u.length ? O[x] = u : delete O[x], Object.keys(O).length ? h.fallback = O : delete h.fallback;
    }
    return (h, x) => (e(), P(Me, {
      count: m.value.length,
      columns: ["details", "usage"]
    }, Ce({
      default: w(() => [
        (e(!0), s(H, null, ae(m.value, (u) => (e(), P(Le, {
          "route-section": "dimensions",
          "route-id": u.name,
          title: t(E)(u.name),
          key: u.name,
          usage: M(u).length ? "Used in " + M(u).length + " places" : "Unused"
        }, Ce({
          details: w(() => [
            l("span", zi, _(u.members.map(t(E)).join(", ") || "No allowed values"), 1)
          ]),
          default: w(() => [
            l("div", Bi, [
              M(u).length ? (e(), s("p", Mi, "Used by " + _(M(u).join(", ")), 1)) : c("", !0),
              l("div", Li, [
                l("div", Ei, [
                  l("div", Wi, [
                    l("label", {
                      id: p(u, "members")
                    }, "Allowed values", 8, Hi),
                    x[0] || (x[0] = l("span", { class: "pim-f-note" }, "for example, English and French for Language", -1))
                  ]),
                  g(Te, {
                    disabled: !d.value,
                    labelledby: p(u, "members"),
                    "model-value": u.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (O) => J(u, O)
                  }, null, 8, ["disabled", "labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                (e(!0), s(H, null, ae(u.members, (O) => (e(), s("div", {
                  key: O,
                  class: "pim-f pim-w-half"
                }, [
                  l("div", Ji, [
                    l("label", {
                      id: p(u, "fallback-" + encodeURIComponent(O))
                    }, _(O) + " falls back to", 9, Ki),
                    x[1] || (x[1] = l("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  g(Te, {
                    disabled: !d.value,
                    labelledby: p(u, "fallback-" + encodeURIComponent(O)),
                    "model-value": Z(u, O),
                    options: u.members.filter((j) => j !== O).map((j) => ({ value: j })),
                    "onUpdate:modelValue": (j) => I(u, O, j)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]))), 128))
              ])
            ])
          ]),
          _: 2
        }, [
          d.value ? {
            name: "actions",
            fn: w(() => [
              g(t(Y), {
                type: "button",
                disabled: M(u).length > 0,
                "aria-label": "Remove " + t(E)(u.name),
                title: M(u).length ? "Take the dimension off these first" : "",
                onClick: (O) => B(u),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: w(() => [
                  g(t(ne), { icon: "tabler:trash" })
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
      d.value ? {
        name: "add",
        fn: w(() => [
          g(Be, {
            label: "Dimension name",
            "from-name": "",
            action: "Add dimension",
            existing: m.value.map((u) => u.name),
            onAdd: k
          }, {
            default: w(() => [...x[2] || (x[2] = [
              l("span", { class: "muted small" }, "A dimension lets a value differ per member, with fallbacks between members.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), Yi = { class: "muted small" }, Zi = { class: "pim-aspect" }, Qi = { class: "row small" }, Xi = {
  key: 1,
  class: "muted small"
}, en = {
  key: 2,
  class: "pim-stack tight pim-terms"
}, ln = {
  key: 0,
  class: "muted small"
}, an = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, tn = {
  key: 3,
  class: "pim-responsive-table"
}, sn = {
  class: "pim-grid compact",
  "aria-label": "Vocabulary terms"
}, nn = { key: 0 }, on = { key: 1 }, dn = {
  key: 0,
  class: "muted"
}, rn = {
  key: 1,
  class: "num"
}, un = {
  role: "list",
  class: "pim-stacked-list",
  "aria-label": "Vocabulary terms"
}, cn = {
  key: 0,
  class: "pim-stacked-meta muted small"
}, mn = {
  key: 4,
  class: "muted small"
}, pn = { class: "row wrap" }, vn = {
  key: 5,
  class: "row wrap pim-add-row"
}, fn = {
  key: 0,
  class: "pim-config-overrides"
}, bn = /* @__PURE__ */ pe({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(a, { emit: f }) {
    const i = a, n = f, d = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/, m = F(() => i.schema.access.admin), C = F(() => m.value && i.schema.access.write), p = F(() => i.draft.vocabularies ?? []);
    function k(G) {
      (i.draft.vocabularies ??= []).push({ code: G });
    }
    function M(G) {
      p.value.splice(p.value.indexOf(G), 1), i.schema.declaration.vocabularies?.some((A) => A.code === G.code) && n("remove", "vocabularies", G.code);
    }
    function B(G) {
      return !!i.schema.vocabularies[G];
    }
    const J = W({}), Z = W({}), I = W({}), h = W({}), x = W({}), u = W({}), O = W({}), j = W({});
    function V(G) {
      return !!(x.value[G] || u.value[G]);
    }
    async function q(G, A) {
      x.value[G] = !0, delete O.value[G];
      try {
        const b = await he.termsPage(i.catalogId, G, A);
        Z.value[G] = b.terms, h.value[G] = A, I.value[G] = b.next;
        const o = R(G);
        b.terms.some((r) => r.retired && r.code === o.parent) && (o.parent = "");
      } catch (b) {
        O.value[G] = { errors: [Ke(b, "Could not load terms.")], read: { after: A } };
      } finally {
        x.value[G] = !1;
      }
    }
    function Q(G) {
      J.value[G] = !J.value[G], J.value[G] && !V(G) && !Z.value[G] && !O.value[G] && q(G);
    }
    function R(G) {
      return j.value[G] ?? (j.value[G] = { code: "", label: "", parent: "" });
    }
    function ie(G, A) {
      const b = Z.value[G]?.find((o) => o.code === A);
      return b ? He(b) : E(A);
    }
    function we(G) {
      return [{ value: "", label: "No parent" }, ...(Z.value[G] ?? []).filter((A) => !A.retired).map((A) => ({ value: A.code, label: He(A) }))];
    }
    function ve(G, A, b) {
      O.value[G] = { errors: A?.findings?.length ? A.findings.map((o) => ({ message: o.message ?? b, code: o.code })) : [{ message: b }] };
    }
    async function fe(G) {
      const A = R(G.code);
      if (!(!C.value || !d.test(A.code))) {
        u.value[G.code] = !0, delete O.value[G.code];
        try {
          const b = { term: { vocabulary: G.code, code: A.code }, labels: { en: A.label || E(A.code) } };
          G.hierarchical && A.parent && (b.parent = A.parent);
          const r = (await he.apply(i.catalogId, [b])).outcomes[0];
          if (r?.outcome !== "created" && r?.outcome !== "updated") {
            ve(G.code, r, "The term was not accepted.");
            return;
          }
          j.value[G.code] = { code: "", label: "", parent: "" }, he.invalidateTerms(i.catalogId), await q(G.code, h.value[G.code]);
        } catch (b) {
          O.value[G.code] = { errors: [Ke(b, "Could not add the term.")] };
        } finally {
          u.value[G.code] = !1;
        }
      }
    }
    async function se(G, A, b) {
      if (C.value && !(b && !await tl.confirm({ header: "Retire term?", message: `Retire ${He(A)}? Term changes save immediately. You can restore this term later.`, acceptLabel: "Retire", rejectLabel: "Cancel" }))) {
        u.value[G.code] = !0, delete O.value[G.code];
        try {
          const r = (await he.apply(i.catalogId, [{ term: { vocabulary: G.code, code: A.code }, retired: b }])).outcomes[0];
          if (!r || !["updated", "unchanged"].includes(r.outcome)) {
            ve(G.code, r, "The term change was not accepted.");
            return;
          }
          b && R(G.code).parent === A.code && (R(G.code).parent = ""), he.invalidateTerms(i.catalogId), await q(G.code, h.value[G.code]);
        } catch (o) {
          O.value[G.code] = { errors: [Ke(o, "Could not change the term.")] };
        } finally {
          u.value[G.code] = !1;
        }
      }
    }
    return (G, A) => (e(), P(Me, {
      count: p.value.length,
      columns: ["details"]
    }, Ce({
      default: w(() => [
        (e(!0), s(H, null, ae(p.value, (b) => (e(), P(Le, {
          "route-section": "vocabularies",
          "route-id": b.code,
          title: t(E)(b.code),
          key: b.code
        }, {
          details: w(() => [
            l("span", Yi, _(b.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: w(() => [
            m.value ? (e(), P(t(Y), {
              key: 0,
              type: "button",
              "aria-label": "Remove " + t(E)(b.code),
              onClick: (o) => M(b),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: w(() => [
                g(t(ne), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])) : c("", !0)
          ]),
          default: w(() => [
            l("div", Zi, [
              l("label", Qi, [
                g(t(dl), {
                  disabled: !m.value,
                  "aria-label": "Hierarchical " + t(E)(b.code),
                  "model-value": b.hierarchical === !0,
                  "onUpdate:modelValue": (o) => o ? b.hierarchical = !0 : delete b.hierarchical
                }, null, 8, ["disabled", "aria-label", "model-value", "onUpdate:modelValue"]),
                A[0] || (A[0] = l("span", null, "Hierarchical", -1))
              ]),
              B(b.code) ? (e(), P(t(Y), {
                key: 0,
                type: "button",
                onClick: (o) => Q(b.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: w(() => [
                  g(t(ne), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  K(" " + _(J.value[b.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : m.value ? (e(), s("span", Xi, "Apply the schema before adding terms.")) : c("", !0),
              J.value[b.code] ? (e(), s("div", en, [
                C.value ? (e(), s("p", ln, "Term changes save immediately.")) : c("", !0),
                x.value[b.code] ? (e(), s("div", an, "Loading terms…")) : O.value[b.code] ? (e(!0), s(H, { key: 2 }, ae(O.value[b.code].errors, (o, r) => (e(), P(gl, {
                  key: r,
                  error: o
                }, {
                  default: w(() => [
                    O.value[b.code].read ? (e(), P(t(Y), {
                      key: 0,
                      type: "button",
                      onClick: (L) => q(b.code, O.value[b.code].read?.after),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: w(() => [...A[1] || (A[1] = [
                        K("Retry", -1)
                      ])]),
                      _: 1
                    }, 8, ["onClick"])) : c("", !0)
                  ]),
                  _: 2
                }, 1032, ["error"]))), 128)) : c("", !0),
                (Z.value[b.code] ?? []).length ? (e(), s("div", tn, [
                  l("table", sn, [
                    l("thead", null, [
                      l("tr", null, [
                        A[2] || (A[2] = l("th", null, "Term", -1)),
                        b.hierarchical ? (e(), s("th", nn, "Parent")) : c("", !0),
                        m.value ? (e(), s("th", on)) : c("", !0)
                      ])
                    ]),
                    l("tbody", null, [
                      (e(!0), s(H, null, ae(Z.value[b.code], (o) => (e(), s("tr", {
                        key: o.code,
                        class: Oe({ muted: o.retired })
                      }, [
                        l("td", null, [
                          K(_(t(He)(o)) + " ", 1),
                          o.retired ? (e(), P(t(_e), {
                            key: 0,
                            severity: "secondary",
                            value: "Retired"
                          })) : c("", !0)
                        ]),
                        b.hierarchical ? (e(), s("td", dn, _(o.parent ? ie(b.code, o.parent) : "—"), 1)) : c("", !0),
                        m.value ? (e(), s("td", rn, [
                          g(t(Y), {
                            type: "button",
                            disabled: !C.value || V(b.code),
                            onClick: (r) => se(b, o, !o.retired),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: w(() => [
                              K(_(o.retired ? "Restore" : "Retire"), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled", "onClick"])
                        ])) : c("", !0)
                      ], 2))), 128))
                    ])
                  ]),
                  l("ul", un, [
                    (e(!0), s(H, null, ae(Z.value[b.code], (o) => (e(), s("li", {
                      key: o.code,
                      class: Oe(["pim-stacked-row", { muted: o.retired }])
                    }, [
                      l("div", null, [
                        K(_(t(He)(o)) + " ", 1),
                        o.retired ? (e(), P(t(_e), {
                          key: 0,
                          severity: "secondary",
                          value: "Retired"
                        })) : c("", !0)
                      ]),
                      b.hierarchical && o.parent ? (e(), s("div", cn, "Parent: " + _(ie(b.code, o.parent)), 1)) : c("", !0),
                      m.value ? (e(), P(t(Y), {
                        key: 1,
                        type: "button",
                        disabled: !C.value || V(b.code),
                        onClick: (r) => se(b, o, !o.retired),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: w(() => [
                          K(_(o.retired ? "Restore" : "Retire"), 1)
                        ]),
                        _: 2
                      }, 1032, ["disabled", "onClick"])) : c("", !0)
                    ], 2))), 128))
                  ])
                ])) : Z.value[b.code] && !V(b.code) && !O.value[b.code] ? (e(), s("p", mn, "No terms yet.")) : c("", !0),
                l("div", pn, [
                  g(t(Y), {
                    type: "button",
                    disabled: V(b.code) || !h.value[b.code],
                    onClick: (o) => q(b.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      g(t(ne), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      A[3] || (A[3] = K(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  g(t(Y), {
                    type: "button",
                    disabled: V(b.code) || !I.value[b.code],
                    onClick: (o) => q(b.code, I.value[b.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      g(t(ne), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      A[4] || (A[4] = K(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                m.value ? (e(), s("div", vn, [
                  g(t(sl), {
                    modelValue: R(b.code).label,
                    "onUpdate:modelValue": (o) => R(b.code).label = o,
                    disabled: !C.value || V(b.code),
                    "aria-label": "Term name in English",
                    type: "text",
                    placeholder: "Term name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  g(t(sl), {
                    modelValue: R(b.code).code,
                    "onUpdate:modelValue": (o) => R(b.code).code = o,
                    disabled: !C.value || V(b.code),
                    type: "text",
                    "aria-label": "Short term name",
                    placeholder: "Short name for imports",
                    class: "narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  b.hierarchical ? (e(), P(t(Ve), {
                    key: 0,
                    modelValue: R(b.code).parent,
                    "onUpdate:modelValue": (o) => R(b.code).parent = o,
                    disabled: !C.value || V(b.code),
                    class: "narrow",
                    "aria-label": "Parent term",
                    placeholder: "No parent",
                    options: we(b.code),
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "options"])) : c("", !0),
                  g(t(Y), {
                    type: "button",
                    disabled: !C.value || V(b.code) || !d.test(R(b.code).code),
                    onClick: (o) => fe(b),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      g(t(ne), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      A[5] || (A[5] = K(" Add term", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])) : c("", !0),
                g(xe, {
                  class: "pim-ia-disclosure",
                  label: "Integration keys"
                }, {
                  default: w(() => [
                    (Z.value[b.code] ?? []).length ? (e(), s("dl", fn, [
                      (e(!0), s(H, null, ae(Z.value[b.code], (o) => (e(), s(H, {
                        key: o.code
                      }, [
                        l("dt", null, _(t(He)(o)), 1),
                        l("dd", null, [
                          l("code", null, _(o.code), 1)
                        ])
                      ], 64))), 128))
                    ])) : c("", !0)
                  ]),
                  _: 2
                }, 1024)
              ])) : c("", !0)
            ])
          ]),
          _: 2
        }, 1032, ["route-id", "title"]))), 128))
      ]),
      _: 2
    }, [
      m.value ? {
        name: "add",
        fn: w(() => [
          g(Be, {
            label: "Vocabulary name",
            "from-name": "",
            action: "Add vocabulary",
            existing: p.value.map((b) => b.code),
            onAdd: k
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
}), yn = { class: "pim-stack" }, gn = { class: "muted small" }, hn = { class: "muted small" }, kn = { class: "pim-aspect" }, _n = { class: "pim-ia-action pim-family-fields" }, wn = { class: "pim-f" }, $n = { class: "pim-f-label" }, Cn = ["id"], xn = ["id"], Vn = { class: "pim-aspect" }, jn = { class: "pim-stack tight" }, Un = { class: "pim-level-head" }, Sn = { class: "pim-fields" }, On = { class: "pim-f pim-w-half" }, An = { class: "pim-f-label" }, Rn = ["id"], Pn = { class: "pim-f pim-w-half" }, Tn = { class: "pim-f-label" }, qn = ["id"], In = { class: "pim-aspect" }, Dn = { class: "pim-stack tight" }, Fn = { class: "pim-level-head" }, Nn = { class: "muted small" }, zn = { class: "pim-fields" }, Bn = { class: "pim-f-label" }, Mn = ["id"], Ln = { class: "pim-f pim-w-half" }, En = { class: "pim-f-label" }, Wn = ["id"], Hn = { class: "pim-f pim-w-half" }, Jn = { class: "pim-f-label" }, Kn = ["id"], Gn = {
  key: 0,
  class: "pim-aspect pim-family-remove"
}, Yn = /* @__PURE__ */ pe({
  __name: "BuilderFamilies",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove", "fields", "variant-field"],
  setup(a, { emit: f }) {
    const i = a, n = f, d = qe();
    function m(A, b) {
      return d + "-" + A.code + "-" + b;
    }
    const C = F(() => i.schema.access.admin), p = F(() => (i.draft.families ?? []).filter((A) => A.code !== "generic")), k = F(() => {
      const A = new Set(i.draft.plugins?.map((b) => b.use));
      return Object.entries(i.schema.attributes).filter(([, b]) => b.plugin && A.has(b.plugin));
    }), M = F(() => {
      const A = (i.draft.aspects ?? []).map((o) => o.namespace), b = [...new Set(k.value.map(([o]) => o.split(".")[0]))];
      return [...A, ...b.filter((o) => !A.includes(o))].map((o) => ({ value: o, label: E(o) }));
    });
    function B(A) {
      const b = M.value, o = (A.aspects ?? []).filter((r) => !b.some((L) => L.value === r));
      return [...b, ...o.map((r) => ({ value: r, label: E(r) }))];
    }
    const J = F(() => new Map(i.options.types.map((A) => [A.id, A.form])));
    function Z(A, b = []) {
      const o = /* @__PURE__ */ new Map();
      return [.../* @__PURE__ */ new Set([...A, ...b])].map((L) => {
        const [y, T] = L.split(".", 2), ee = E(T ?? y);
        return o.set(ee, (o.get(ee) ?? 0) + 1), { value: L, label: ee, group: T ? E(y) : void 0 };
      }).map(({ value: L, label: y, group: T }) => ({
        value: L,
        label: y,
        detail: o.get(y) > 1 ? T : void 0
      }));
    }
    const I = F(() => {
      const A = /* @__PURE__ */ new Map();
      function b(o, r, L = [], y = "one") {
        const T = !!r && r !== "text" && r !== "record" && L.length === 0 && y === "one";
        A.set(o, T);
      }
      for (const o of i.draft.aspects ?? [])
        for (const r of o.attributes ?? []) {
          const L = o.namespace + "." + r.code;
          b(L, J.value.get(r.type), r.scope, r.cardinality);
        }
      for (const [o, r] of k.value) b(o, r.form, r.scope, r.cardinality);
      return A;
    });
    function h(A) {
      return [...I.value.keys()].filter((b) => A.aspects?.includes(b.split(".")[0]));
    }
    function x(A, b, o) {
      const r = b[o] ?? [], L = new Set(R(A).flatMap((T) => [...T.axes ?? [], ...T.own ?? []])), y = h(A).filter((T) => r.includes(T) || !L.has(T) && (o === "own" || I.value.get(T)));
      return Z(y, r);
    }
    const u = F(() => i.draft.channels ?? []);
    function O(A, b) {
      return u.value.filter((o) => (!o.families?.length || o.families.includes(A.code)) && (!b || o.requirements?.includes(b))).map((o) => E(o.id));
    }
    const j = F(() => i.draft.dimensions ?? []), V = W({});
    function q(A) {
      (i.draft.families ??= []).push({ code: A, aspects: [] }), V.value[A] = !0;
    }
    function Q(A) {
      i.draft.families.splice(i.draft.families.indexOf(A), 1), i.schema.declaration.families?.some((b) => b.code === A.code) && n("remove", "families", A.code);
    }
    function R(A) {
      return A.variation ?? [];
    }
    function ie(A) {
      return R(A).map((b) => ({
        level: b,
        axes: x(A, b, "axes"),
        own: x(A, b, "own")
      }));
    }
    function we(A) {
      (A.variation ??= []).push({ axes: [] });
    }
    function ve(A) {
      return A.requirements ?? [];
    }
    function fe(A, b) {
      (A.requirements ??= []).push({ id: b, require: [] });
    }
    function se(A, b) {
      return A.context?.[b] ?? "";
    }
    function G(A, b, o) {
      const r = { ...A.context ?? {} };
      o ? r[b] = o : delete r[b], Object.keys(r).length ? A.context = r : delete A.context;
    }
    return (A, b) => (e(), s("div", yn, [
      g(Me, {
        count: p.value.length,
        columns: ["details"]
      }, Ce({
        default: w(() => [
          (e(!0), s(H, null, ae(p.value, (o) => (e(), P(Le, {
            "route-section": "families",
            "route-id": o.code,
            key: o.code,
            open: V.value[o.code],
            "onUpdate:open": (r) => V.value[o.code] = r,
            title: t(E)(o.code)
          }, {
            details: w(() => [
              l("span", gn, _(h(o).length) + " fields", 1),
              R(o).length ? (e(), P(t(_e), {
                key: 0,
                severity: "secondary",
                value: R(o).length + (R(o).length === 1 ? " variant level" : " variant levels")
              }, null, 8, ["value"])) : c("", !0),
              l("span", hn, _(O(o).join(", ") || "No release channels"), 1)
            ]),
            default: w(() => [
              l("div", kn, [
                l("div", _n, [
                  l("div", wn, [
                    l("div", $n, [
                      l("label", {
                        id: m(o, "groups")
                      }, "Field groups", 8, Cn)
                    ]),
                    l("p", {
                      id: m(o, "groups-help"),
                      class: "muted small pim-axis-help"
                    }, "Choose the groups that appear on this family’s product forms.", 8, xn),
                    g(t(sa), {
                      disabled: !C.value,
                      "aria-labelledby": m(o, "groups"),
                      "aria-describedby": m(o, "groups-help"),
                      "model-value": o.aspects ?? [],
                      options: B(o),
                      "option-label": "label",
                      "option-value": "value",
                      placeholder: "Choose field groups",
                      display: "chip",
                      "append-to": "self",
                      "onUpdate:modelValue": (r) => t(Je)(o, "aspects", r)
                    }, null, 8, ["disabled", "aria-labelledby", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])
                  ]),
                  o.aspects?.length ? (e(), P(t(Y), {
                    key: 0,
                    type: "button",
                    label: "View family fields",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (r) => n("fields", o.code)
                  }, null, 8, ["onClick"])) : c("", !0)
                ])
              ]),
              l("div", Vn, [
                b[4] || (b[4] = l("header", { class: "pim-aspect-head" }, [
                  l("h3", null, "Variants")
                ], -1)),
                b[5] || (b[5] = l("p", { class: "muted small pim-axis-help" }, "Choose what makes one variant different from another. Each field can be used once.", -1)),
                l("div", jn, [
                  (e(!0), s(H, null, ae(ie(o), ({ level: r, axes: L, own: y }, T) => (e(), s("div", {
                    key: T,
                    class: "pim-level"
                  }, [
                    l("div", Un, [
                      l("strong", null, "Level " + _(T + 1), 1),
                      C.value ? (e(), P(t(Y), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove level",
                        onClick: (ee) => R(o).splice(T, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: w(() => [
                          g(t(ne), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : c("", !0)
                    ]),
                    l("div", Sn, [
                      l("div", On, [
                        l("div", An, [
                          l("label", {
                            id: m(o, T + "-axes")
                          }, "Distinguish variants by", 8, Rn)
                        ]),
                        b[1] || (b[1] = l("p", { class: "muted small pim-axis-help" }, "Use a field with a single value and no dimensions, such as Integer. Text and record fields are excluded.", -1)),
                        C.value && !L.length ? (e(), s(H, { key: 0 }, [
                          b[0] || (b[0] = l("p", { class: "muted small pim-axis-help" }, "No eligible field is available in this family. Choose its field group above, or create the field first and choose its group when you return.", -1)),
                          g(t(Y), {
                            type: "button",
                            label: "Create a field in Fields",
                            severity: "secondary",
                            outlined: "",
                            size: "small",
                            class: "pim-form-action",
                            onClick: (ee) => n("variant-field", o.code)
                          }, null, 8, ["onClick"])
                        ], 64)) : (e(), P(Te, {
                          key: 1,
                          disabled: !C.value,
                          dropdown: "",
                          labelledby: m(o, T + "-axes"),
                          "model-value": r.axes ?? [],
                          options: L,
                          placeholder: "Choose a field",
                          "onUpdate:modelValue": (ee) => r.axes = ee
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"]))
                      ]),
                      l("div", Pn, [
                        l("div", Tn, [
                          l("label", {
                            id: m(o, T + "-owned")
                          }, "Other fields edited here", 8, qn)
                        ]),
                        b[2] || (b[2] = l("p", { class: "muted small pim-axis-help" }, "Other fields you edit at this level.", -1)),
                        g(Te, {
                          disabled: !C.value,
                          dropdown: "",
                          labelledby: m(o, T + "-owned"),
                          "model-value": r.own ?? [],
                          options: y,
                          placeholder: "Add a field",
                          "onUpdate:modelValue": (ee) => ee.length ? r.own = ee : delete r.own
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  C.value ? (e(), P(t(Y), {
                    key: 0,
                    type: "button",
                    class: "pim-add-level",
                    onClick: (r) => we(o),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      g(t(ne), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      b[3] || (b[3] = K(" Add level", -1))
                    ]),
                    _: 1
                  }, 8, ["onClick"])) : c("", !0)
                ])
              ]),
              l("div", In, [
                b[8] || (b[8] = l("header", { class: "pim-family-requirements-head" }, [
                  l("h3", null, "Release requirements"),
                  l("p", { class: "muted small" }, "Choose what products need before they can be released to a channel.")
                ], -1)),
                l("div", Dn, [
                  (e(!0), s(H, null, ae(ve(o), (r, L) => (e(), s("div", {
                    key: r.id,
                    class: "pim-level"
                  }, [
                    l("div", Fn, [
                      l("div", null, [
                        l("strong", null, _(t(E)(r.id)), 1),
                        l("p", Nn, _(O(o, r.id).join(", ") || "Unused by channels"), 1)
                      ]),
                      C.value ? (e(), P(t(Y), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove requirement",
                        onClick: (y) => ve(o).splice(L, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: w(() => [
                          g(t(ne), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : c("", !0)
                    ]),
                    l("div", zn, [
                      (e(!0), s(H, null, ae(j.value, (y) => (e(), s("div", {
                        key: y.name,
                        class: "pim-f pim-w-third"
                      }, [
                        l("div", Bn, [
                          l("label", {
                            id: m(o, r.id + "-context-" + y.name)
                          }, _(t(E)(y.name)), 9, Mn)
                        ]),
                        g(t(Ve), {
                          disabled: !C.value,
                          "aria-labelledby": m(o, r.id + "-context-" + y.name),
                          "model-value": se(r, y.name),
                          "onUpdate:modelValue": (T) => G(r, y.name, T),
                          options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ...y.members.map((T) => ({ value: T, label: String(T) }))],
                          "option-label": "label",
                          "option-value": "value",
                          appendTo: "self"
                        }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                      ]))), 128)),
                      l("div", Ln, [
                        l("div", En, [
                          l("label", {
                            id: m(o, r.id + "-required")
                          }, "Required", 8, Wn)
                        ]),
                        b[6] || (b[6] = l("p", { class: "muted small pim-axis-help" }, "These fields must have a value.", -1)),
                        g(Te, {
                          disabled: !C.value,
                          dropdown: "",
                          labelledby: m(o, r.id + "-required"),
                          "model-value": r.require ?? [],
                          placeholder: "Add a required field",
                          options: Z(h(o), r.require),
                          "onUpdate:modelValue": (y) => t(Je)(r, "require", y)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]),
                      l("div", Hn, [
                        l("div", Jn, [
                          l("label", {
                            id: m(o, r.id + "-authored")
                          }, "Entered for this context", 8, Kn)
                        ]),
                        b[7] || (b[7] = l("p", { class: "muted small pim-axis-help" }, "These fields need a value set directly for the selected context.", -1)),
                        g(Te, {
                          disabled: !C.value,
                          dropdown: "",
                          labelledby: m(o, r.id + "-authored"),
                          "model-value": r.authored ?? [],
                          placeholder: "Add a field to author",
                          options: Z(h(o), r.authored),
                          "onUpdate:modelValue": (y) => t(Je)(r, "authored", y)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  C.value ? (e(), P(Be, {
                    key: 0,
                    label: "Requirement name",
                    action: "Add requirement",
                    "from-name": "",
                    existing: ve(o).map((r) => r.id),
                    onAdd: (r) => fe(o, r)
                  }, null, 8, ["existing", "onAdd"])) : c("", !0)
                ])
              ]),
              C.value ? (e(), s("div", Gn, [
                g(t(Y), {
                  type: "button",
                  label: "Remove family",
                  severity: "danger",
                  text: "",
                  size: "small",
                  onClick: (r) => Q(o)
                }, null, 8, ["onClick"])
              ])) : c("", !0)
            ]),
            _: 2
          }, 1032, ["route-id", "open", "onUpdate:open", "title"]))), 128))
        ]),
        _: 2
      }, [
        C.value ? {
          name: "head",
          fn: w(() => [
            g(Be, {
              label: "Family name",
              action: "Add family",
              "from-name": "",
              existing: p.value.map((o) => o.code),
              onAdd: q
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])
    ]));
  }
}), Zn = ["inert"], Qn = {
  key: 0,
  class: "row wrap"
}, Xn = {
  key: 2,
  class: "small muted"
}, eo = { class: "pim-f" }, lo = ["for"], ao = ["id"], to = /* @__PURE__ */ pe({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(a, { emit: f }) {
    const i = a, n = f, d = W(!1), m = W(""), C = qe(), p = qe(), k = W({});
    let M = 0;
    be(() => i.modelValue, async (h) => {
      const x = ++M;
      try {
        const u = await na(i.catalogId ?? "", h);
        x === M && (k.value = u);
      } catch {
        x === M && (k.value = {});
      }
    }, { immediate: !0, deep: !0 }), Ye(() => {
      M++;
    });
    function B(h) {
      return k.value[h] ?? ce(h, "Person");
    }
    aa(async () => {
      try {
        await Ka("wc-principal-picker"), d.value = !0;
      } catch {
        d.value = !1;
      }
    });
    function J(h) {
      i.disabled || !h.trim() || i.modelValue.includes(h.trim()) || (n("update:modelValue", [...i.modelValue, h.trim()]), m.value = "");
    }
    function Z(h) {
      const x = h.detail;
      if (!x || typeof x != "object") return;
      const u = x, O = u.principal_id ?? u.id;
      typeof O == "string" && J(O);
    }
    function I(h) {
      i.disabled || n("update:modelValue", i.modelValue.filter((x) => x !== h));
    }
    return (h, x) => (e(), s("div", {
      class: "pim-principal-list",
      inert: a.disabled || void 0
    }, [
      a.modelValue.length ? (e(), s("div", Qn, [
        (e(!0), s(H, null, ae(a.modelValue, (u) => (e(), P(t(_e), {
          key: u,
          severity: "secondary"
        }, {
          default: w(() => [
            l("span", null, _(B(u)), 1),
            g(t(Y), {
              text: "",
              size: "small",
              disabled: a.disabled,
              "aria-label": "Remove " + B(u),
              onClick: (O) => I(u)
            }, {
              default: w(() => [
                g(t(ne), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : c("", !0),
      d.value ? (e(), s("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: ze(Z, ["stop"])
      }, null, 32)) : (e(), s("span", Xn, "The person picker is unavailable.")),
      l("div", eo, [
        l("label", {
          for: t(C),
          class: "small muted"
        }, "Service account ID", 8, lo),
        g(t(sl), {
          modelValue: m.value,
          "onUpdate:modelValue": x[0] || (x[0] = (u) => m.value = u),
          id: t(C),
          "aria-describedby": t(p),
          disabled: a.disabled,
          onKeydown: x[1] || (x[1] = ol(ze((u) => J(m.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "id", "aria-describedby", "disabled"]),
        l("p", {
          id: t(p),
          class: "small muted pim-axis-help"
        }, "Ask whoever manages the service account for its principal ID.", 8, ao)
      ]),
      g(t(Y), {
        type: "button",
        severity: "secondary",
        outlined: "",
        size: "small",
        class: "pim-form-action",
        disabled: a.disabled || !m.value.trim(),
        onClick: x[2] || (x[2] = (u) => J(m.value))
      }, {
        default: w(() => [
          g(t(ne), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          x[3] || (x[3] = K(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, Zn));
  }
}), so = { class: "pim-stack" }, io = { class: "muted small" }, no = { class: "muted small" }, oo = { class: "pim-fields" }, ro = { class: "pim-f pim-w-half" }, uo = { class: "pim-f-label" }, co = ["id"], mo = { class: "muted small pim-axis-help" }, po = { class: "pim-f pim-w-half" }, vo = { class: "pim-f-label" }, fo = ["id"], bo = { class: "muted small" }, yo = { class: "muted small" }, go = { class: "pim-fields" }, ho = ["aria-labelledby", "aria-describedby"], ko = { class: "pim-f-label" }, _o = ["id"], wo = ["id"], $o = { key: 1 }, Co = { class: "pim-f pim-w-half" }, xo = { class: "pim-f-label" }, Vo = ["id"], jo = { class: "pim-f pim-w-full" }, Uo = { class: "mono" }, So = { class: "pim-f pim-w-half" }, Oo = { class: "pim-f-label" }, Ao = ["id"], Ro = { class: "pim-f pim-w-half" }, Po = { class: "pim-f-label" }, To = ["for"], qo = { class: "row" }, Io = /* @__PURE__ */ pe({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {},
    view: {}
  },
  emits: ["remove", "requirements"],
  setup(a, { emit: f }) {
    const i = a, n = f, d = qe();
    function m(q, Q) {
      return d + "-" + q + "-" + Q;
    }
    const C = F(() => i.schema.access.admin), p = F(() => i.draft.channels ?? []), k = F(() => i.draft.sources ?? []), M = F(() => {
      const q = /* @__PURE__ */ new Map();
      for (const Q of i.draft.families ?? [])
        for (const { id: R } of Q.requirements ?? []) {
          const ie = q.get(R) ?? [];
          ie.push(E(Q.code)), q.set(R, ie);
        }
      return new Map([...q].map(([Q, R]) => [Q, E(Q) + " · " + R.join(", ")]));
    }), B = F(() => [...M.value].map(([q, Q]) => ({ value: q, label: Q }))), J = F(() => (i.draft.families ?? []).filter((q) => q.code !== "generic").map((q) => ({ value: q.code, label: E(q.code) }))), Z = F(() => (i.draft.aspects ?? []).map((q) => ({ value: q.namespace, label: E(q.namespace) }))), I = W({}), h = W({});
    function x(q) {
      const Q = q.principals?.length ?? 0;
      return Q ? Q + (Q === 1 ? " allowed account" : " allowed accounts") : "Any catalog writer";
    }
    function u(q) {
      (i.draft.channels ??= []).push({ id: q, requirements: [] }), I.value[q] = !0;
    }
    function O(q) {
      p.value.splice(p.value.indexOf(q), 1), i.schema.declaration.channels?.some((Q) => Q.id === q.id) && n("remove", "channels", q.id);
    }
    function j(q) {
      (i.draft.sources ??= []).push({ id: q, ordering: "none", writes: [] }), h.value[q] = !0;
    }
    function V(q) {
      k.value.splice(k.value.indexOf(q), 1), i.schema.declaration.sources?.some((Q) => Q.id === q.id) && n("remove", "sources", q.id);
    }
    return (q, Q) => (e(), s("div", so, [
      a.view !== "sources" ? (e(), P(Me, {
        key: 0,
        count: p.value.length,
        columns: ["details"]
      }, Ce({
        default: w(() => [
          (e(!0), s(H, null, ae(p.value, (R) => (e(), P(Le, {
            key: R.id,
            open: I.value[R.id],
            "onUpdate:open": (ie) => I.value[R.id] = ie,
            "route-section": "channels",
            "route-id": R.id,
            title: t(E)(R.id)
          }, Ce({
            details: w(() => [
              l("span", io, _(R.families?.length ? R.families.map(t(E)).join(", ") : "All families"), 1),
              l("span", no, _(R.requirements?.length ? R.requirements.map((ie) => M.value.get(ie) ?? t(E)(ie)).join(", ") : "No release requirements"), 1)
            ]),
            default: w(() => [
              l("div", oo, [
                l("div", ro, [
                  l("div", uo, [
                    l("label", {
                      id: m(R.id, "requirements")
                    }, "Release requirements", 8, co)
                  ]),
                  l("p", mo, _(B.value.length ? "Choose what products must meet before release to this channel." : "No family has defined a release requirement yet."), 1),
                  B.value.length || R.requirements?.length ? (e(), P(Te, {
                    key: 0,
                    disabled: !C.value,
                    labelledby: m(R.id, "requirements"),
                    "model-value": R.requirements ?? [],
                    options: B.value,
                    "onUpdate:modelValue": (ie) => t(Je)(R, "requirements", ie)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])) : c("", !0),
                  C.value ? (e(), P(t(Y), {
                    key: 1,
                    type: "button",
                    label: "Create a requirement in Families",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    class: "pim-form-action",
                    onClick: (ie) => n("requirements", R.id)
                  }, null, 8, ["onClick"])) : c("", !0)
                ]),
                l("div", po, [
                  l("div", vo, [
                    l("label", {
                      id: m(R.id, "families")
                    }, "Families", 8, fo)
                  ]),
                  Q[0] || (Q[0] = l("p", { class: "muted small pim-axis-help" }, "Applies to every family unless you choose specific families.", -1)),
                  g(Te, {
                    disabled: !C.value,
                    labelledby: m(R.id, "families"),
                    "model-value": R.families ?? [],
                    options: J.value,
                    "onUpdate:modelValue": (ie) => t(Je)(R, "families", ie)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            C.value ? {
              name: "actions",
              fn: w(() => [
                g(t(Y), {
                  type: "button",
                  onClick: (ie) => O(R),
                  "aria-label": "Remove " + t(E)(R.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    g(t(ne), { icon: "tabler:trash" })
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
        C.value ? {
          name: "head",
          fn: w(() => [
            g(Be, {
              label: "Channel name",
              action: "Add channel",
              "from-name": "",
              existing: p.value.map((R) => R.id),
              onAdd: u
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])) : c("", !0),
      a.view !== "channels" ? (e(), P(Me, {
        key: 1,
        count: k.value.length,
        columns: ["details"]
      }, Ce({
        default: w(() => [
          (e(!0), s(H, null, ae(k.value, (R) => (e(), P(Le, {
            key: R.id,
            open: h.value[R.id],
            "onUpdate:open": (ie) => h.value[R.id] = ie,
            "route-section": "sources",
            "route-id": R.id,
            title: t(E)(R.id)
          }, Ce({
            details: w(() => [
              l("span", bo, _(x(R)), 1),
              l("span", yo, _(R.writes?.length ? R.writes.map(t(E)).join(", ") : "No writable field groups"), 1)
            ]),
            default: w(() => [
              l("div", go, [
                l("div", {
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": m(R.id, "people"),
                  "aria-describedby": m(R.id, "people-help")
                }, [
                  l("div", ko, [
                    l("label", {
                      id: m(R.id, "people")
                    }, "People and service accounts", 8, _o)
                  ]),
                  l("p", {
                    id: m(R.id, "people-help"),
                    class: "muted small pim-axis-help"
                  }, "If you leave this empty, anyone who can write to the catalog can use this source.", 8, wo),
                  C.value ? (e(), P(to, {
                    key: 0,
                    "catalog-id": a.catalogId,
                    "model-value": R.principals ?? [],
                    "onUpdate:modelValue": (ie) => t(Je)(R, "principals", ie)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])) : (e(), s("span", $o, _(x(R)), 1))
                ], 8, ho),
                l("div", Co, [
                  l("div", xo, [
                    l("label", {
                      id: m(R.id, "writes")
                    }, "Field groups it can update", 8, Vo)
                  ]),
                  Q[1] || (Q[1] = l("p", { class: "muted small pim-axis-help" }, "If you leave this empty, this source cannot update any field values.", -1)),
                  g(Te, {
                    disabled: !C.value,
                    labelledby: m(R.id, "writes"),
                    "model-value": R.writes ?? [],
                    options: Z.value,
                    "onUpdate:modelValue": (ie) => t(Je)(R, "writes", ie)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                l("div", jo, [
                  Q[2] || (Q[2] = l("div", { class: "pim-f-label" }, [
                    l("strong", null, "Source identifier")
                  ], -1)),
                  Q[3] || (Q[3] = l("p", { class: "muted small pim-axis-help" }, [
                    K("Send this exact identifier in the "),
                    l("code", null, "source"),
                    K(" field of the update request.")
                  ], -1)),
                  l("div", null, [
                    l("code", Uo, _(R.id), 1)
                  ])
                ]),
                l("div", So, [
                  l("div", Oo, [
                    l("label", {
                      id: m(R.id, "ordering")
                    }, "Handle incoming updates", 8, Ao)
                  ]),
                  Q[4] || (Q[4] = l("p", { class: "muted small pim-axis-help" }, "Use the sender’s sequence numbers to prevent late deliveries from overwriting newer values.", -1)),
                  g(t(Ve), {
                    disabled: !C.value,
                    "aria-labelledby": m(R.id, "ordering"),
                    "model-value": R.ordering ?? "none",
                    "onUpdate:modelValue": (ie) => R.ordering = ie,
                    options: [{ value: "none", label: "Use arrival order" }, { value: "sequence", label: "Use the source’s sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                l("div", Ro, [
                  l("div", Po, [
                    l("label", {
                      for: m(R.id, "audit")
                    }, "Track value changes", 8, To)
                  ]),
                  l("div", qo, [
                    g(t(dl), {
                      disabled: !C.value,
                      "input-id": m(R.id, "audit"),
                      "model-value": R.audit !== !1,
                      "onUpdate:modelValue": (ie) => ie ? delete R.audit : R.audit = !1
                    }, null, 8, ["disabled", "input-id", "model-value", "onUpdate:modelValue"]),
                    l("span", null, _(R.audit === !1 ? "Off for this source" : "Follow catalog audit settings"), 1)
                  ])
                ])
              ])
            ]),
            _: 2
          }, [
            C.value ? {
              name: "actions",
              fn: w(() => [
                g(t(Y), {
                  type: "button",
                  onClick: (ie) => V(R),
                  "aria-label": "Remove " + t(E)(R.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    g(t(ne), { icon: "tabler:trash" })
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
        C.value ? {
          name: "head",
          fn: w(() => [
            g(Be, {
              label: "Source name",
              action: "Add source",
              "from-name": "",
              existing: k.value.map((R) => R.id),
              onAdd: j
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])) : c("", !0)
    ]));
  }
}), Do = {
  failed: { label: "Setup failed", severity: "danger" },
  paused: { label: "Background update paused", severity: "warn" },
  degraded: { label: "Degraded", severity: "warn" },
  catchingUp: { label: "Catching up", severity: "info" },
  config: { label: "Configuration needed", severity: "warn" },
  reset: { label: "Reset required", severity: "warn" },
  uninstalled: { label: "Uninstalled · still referenced", severity: "warn" },
  pending: { label: "Setting up", severity: "info" }
};
function ua(a, f) {
  return !a.parked && (a.bootstrapping || a.last_seq < f);
}
function Fo(a, f) {
  return !a.active || !a.installed || a.problem || a.lifecycle.state === "failed" ? !1 : a.lifecycle.state === "pending" || Object.values(a.projections).some((i) => ua(i, f));
}
function No(a, f) {
  const i = a.problem ?? a.lifecycle.error, n = Object.entries(a.projections), d = n.find(([, C]) => C.parked) ?? n.find(([, C]) => C.error) ?? n.find(([, C]) => ua(C, f));
  let m;
  return a.active && !a.installed ? m = "uninstalled" : i?.code === "plugin_config_invalid" ? m = "config" : i?.code === "plugin_projection_history_pruned" ? m = "reset" : i || a.lifecycle.state === "failed" ? m = "failed" : a.active && d?.[1].parked ? m = "paused" : a.active && d?.[1].error ? m = "degraded" : a.active && d ? m = "catchingUp" : a.active && a.lifecycle.state === "pending" && (m = "pending"), m ? { kind: m, ...Do[m], error: i, projection: d } : void 0;
}
function zo(a) {
  return (a.problem ?? a.lifecycle.error)?.code === "plugin_interface_version_unsupported";
}
function Bo({
  catalogId: a,
  shouldPoll: f,
  schema: i,
  options: n,
  busy: d,
  stale: m,
  editable: C,
  saved: p,
  clearError: k,
  reportError: M
}) {
  const B = Ge(), J = Ge();
  be(a, J.begin), Ye(() => {
    B.begin(), J.begin();
  });
  async function Z(O = !1) {
    const j = a(), V = i.value, q = B.begin();
    try {
      const [Q, R] = await Promise.all([he.schema(j), O ? he.schemaOptions(j) : void 0]);
      return !V || !B.current(q) || j !== a() || i.value !== V ? !1 : (V.plugins = Q.plugins, V.as_of = Q.as_of, R && (n.value = R), !0);
    } catch (Q) {
      return O && B.current(q) && j === a() && M(Q, "Could not check plugin status."), !1;
    }
  }
  async function I(O) {
    const j = a(), V = i.value?.plugins.find((Q) => Q.plugin === O && Q.active && Q.installed);
    if (!V?.config || d.value || m.value || !C.value || !await tl.confirm({
      header: "Reset background updates?",
      message: "Background updates will start from a new catalog event. Current product data will be rebuilt into the plugin’s index. Earlier events will be skipped.",
      acceptLabel: "Reset background updates",
      rejectLabel: "Cancel"
    }) || a() !== j || d.value) return;
    const q = J.begin();
    B.begin(), d.value = !0, k(), p.value = "";
    try {
      await he.configurePlugin(j, O, al(V.config), !0), J.current(q) && await Z(!0) && J.current(q) && (p.value = "Background update reset requested.");
    } catch (Q) {
      J.current(q) && M(Q, "Could not reset background updates.");
    } finally {
      J.current(q) && (d.value = !1);
    }
  }
  async function h(O) {
    const j = a();
    if (!(d.value || m.value || !C.value)) {
      d.value = !0, k(), p.value = "";
      try {
        await he.resumePluginProjection(j, O), a() === j && await Z(!0) && (p.value = "Background update resumed.");
      } catch (V) {
        a() === j && M(V, "Could not resume the background update.");
      } finally {
        a() === j && (d.value = !1);
      }
    }
  }
  async function x(O) {
    const j = a();
    if (!(d.value || m.value || !C.value) && !(!await tl.confirm({
      header: "Clear catalog app binding?",
      message: "The catalog will use the default app after this setting is saved.",
      acceptLabel: "Clear binding",
      rejectLabel: "Cancel"
    }) || a() !== j || d.value || !C.value || !i.value?.plugins.some((V) => V.references?.shell_bindings.includes(O)))) {
      d.value = !0, k(), p.value = "";
      try {
        if (await he.updateCatalogApp(j, ""), a() !== j) return;
        await Z(!0) && (p.value = "Catalog app binding cleared.");
      } catch (V) {
        a() === j && M(V, "Could not clear the catalog app binding.");
      } finally {
        a() === j && (d.value = !1);
      }
    }
  }
  const u = F(() => f() && !d.value && i.value?.plugins.some((O) => Fo(O, i.value.as_of)) === !0);
  return be(u, (O, j, V) => {
    if (!O) return;
    let q, Q = !0;
    const R = () => {
      q = setTimeout(async () => {
        await Z() && Q && u.value && R();
      }, 2e3);
    };
    R(), V(() => {
      Q = !1, clearTimeout(q);
    });
  }), { refreshPluginStatus: Z, resetPlugin: I, resumePluginProjection: h, clearShellBinding: x };
}
const Mo = { class: "pim-stack" }, Lo = { class: "pim-bsection-head" }, Eo = {
  key: 0,
  class: "pim-aspect muted"
}, Wo = {
  key: 0,
  class: "muted small"
}, Ho = { class: "pim-stack pim-plugin-recovery" }, Jo = {
  key: 0,
  class: "muted small"
}, Ko = {
  key: 1,
  class: "muted small"
}, Go = { key: 0 }, Yo = { key: 1 }, Zo = { key: 0 }, Qo = { key: 0 }, Xo = { key: 0 }, ed = { key: 1 }, ld = { key: 2 }, ad = { key: 3 }, td = { key: 0 }, sd = { class: "pim-stack" }, id = { key: 0 }, nd = { key: 1 }, od = {
  key: 0,
  class: "muted small"
}, dd = {
  key: 0,
  class: "pim-ia-dialog"
}, rd = { class: "pim-ia-dialog-head" }, ud = { key: 1 }, cd = { key: 2 }, md = { class: "row pim-ia-dialog-actions" }, pd = {
  key: 0,
  class: "pim-aspect muted"
}, vd = { class: "row wrap muted small" }, fd = /* @__PURE__ */ pe({
  __name: "BuilderPlugins",
  props: {
    draft: {},
    schema: {},
    options: {},
    pluginConfigs: { default: () => ({}) },
    refusal: {},
    stale: { type: Boolean }
  },
  emits: ["remove", "reset", "resume", "refresh", "review", "clearShellBinding", "clearRefusal", "invalid-draft"],
  setup(a, { expose: f, emit: i }) {
    const n = a, d = i, m = /* @__PURE__ */ new Map([
      ["eq", "Equals"],
      ["in", "Is one of"],
      ["gt", "Greater than"],
      ["gte", "At least"],
      ["lt", "Less than"],
      ["lte", "At most"]
    ]), C = W({}), p = {
      hold_seconds: "Default and maximum time stock stays set aside after a reservation starts. Leave empty to use the deployment default."
    }, k = /* @__PURE__ */ new Map(), M = W(/* @__PURE__ */ new Set()), B = W(/* @__PURE__ */ new Set());
    be(() => B.value.size > 0, (o) => d("invalid-draft", o));
    function J(o, r, L) {
      r ? M.value.delete(o) : M.value.add(o), L ? B.value.add(o) : B.value.delete(o);
    }
    function Z() {
      const o = R.value.find(({ plugin: r, chosen: L }) => L && M.value.has(r.plugin) && (B.value.has(r.plugin) || Object.hasOwn(n.pluginConfigs, r.plugin) || !r.active || n.refusal?.plugin === r.plugin));
      return o ? (C.value[o.plugin.plugin] = !0, De(() => k.get(o.plugin.plugin)?.reportValidity()), !1) : !0;
    }
    f({ reportValidity: Z }), be(() => n.refusal, (o) => {
      o && (C.value[o.plugin] = !0);
    }, { immediate: !0 });
    const I = W(), h = F(() => R.value.find((o) => o.plugin.plugin === I.value)), x = F(() => h.value?.plugin), u = F(() => n.options.plugins.filter((o) => o.installed).length), O = F(() => n.schema.plugins.filter((o) => o.active).length), j = F(() => n.schema.access.admin), V = F(() => n.draft.plugins ?? []), q = F(() => new Map(n.schema.plugins.map((o) => [o.plugin, o]))), Q = F(() => {
      const o = /* @__PURE__ */ new Map();
      for (const [r, L] of Object.entries(n.schema.attributes)) {
        if (!L.plugin) continue;
        const y = o.get(L.plugin) ?? [];
        y.push(E(r)), o.set(L.plugin, y);
      }
      return o;
    }), R = F(() => n.options.plugins.map((o) => {
      const r = q.value.get(o.plugin) ?? o, L = No(r, n.schema.as_of), y = V.value.some((ee) => ee.use === r.plugin), T = n.refusal?.plugin === r.plugin ? n.refusal : void 0;
      return {
        option: o,
        plugin: r,
        status: L,
        chosen: y,
        refusal: T,
        title: ce(r.title ?? o.title, r.installed ? "Plugin" : "Unavailable plugin"),
        label: T || B.value.has(r.plugin) ? "Configuration needed" : !r.active && L?.kind === "failed" ? "Unavailable" : L?.label ?? (y ? r.active ? "Enabled" : "Will enable on apply" : r.active ? "Will disable on apply" : "Disabled"),
        severity: T || B.value.has(r.plugin) ? "warn" : L?.severity ?? (y ? "success" : "secondary")
      };
    }));
    function ie(o, r) {
      const L = r.map((y) => m.get(y)).filter(Boolean);
      return [E(o), L.join(", ")].filter(Boolean).join(" · ");
    }
    function we(o, r) {
      r && !V.value.some((L) => L.use === o) && ((n.draft.plugins ??= []).push({ use: o }), C.value[o] = !0), r || (C.value[o] = !1, n.draft.plugins = V.value.filter((L) => L.use !== o), delete n.pluginConfigs[o], n.refusal?.plugin === o && d("clearRefusal"), q.value.get(o)?.active && d("remove", "plugins", o));
    }
    function ve(o, r) {
      C.value[o] = !0;
      const L = n.pluginConfigs[o] ?? q.value.get(o)?.config ?? {};
      n.pluginConfigs[o] = r, n.refusal?.plugin === o && JSON.stringify(L[n.refusal.field]) !== JSON.stringify(r[n.refusal.field]) && d("clearRefusal");
    }
    const fe = F(() => n.draft.scopes ?? []);
    function se(o) {
      return fe.value.includes(o.id);
    }
    function G(o, r) {
      r && !se(o) && (n.draft.scopes ??= []).push(o.id), !r && se(o) && (fe.value.splice(fe.value.indexOf(o.id), 1), n.schema.declaration.scopes?.includes(o.id) && d("remove", "scopes", o.id));
    }
    const A = F(() => {
      const o = x.value;
      if (!o) return [];
      const r = o.references;
      return [
        { label: "Fields", items: (r?.fields ?? Object.entries(n.schema.attributes).filter(([, y]) => y.plugin === o.plugin).map(([y]) => y)).map((y) => ({ id: y, title: ce(E(y), "Field") })) },
        { label: "Product filter sets", items: (r?.scopes ?? []).map((y) => ({
          id: y,
          title: ce(n.options.scopes.find((T) => T.id === y)?.title, "Unavailable filter set")
        })) },
        { label: "Catalog app binding", items: (r?.shell_bindings ?? []).map((y) => ({ id: y, title: "Catalog app" })) },
        { label: "Readiness checks", items: (r?.checks ?? []).map((y) => ({ id: y, title: "Readiness check" })) },
        { label: "Dependent plugins", items: (r?.plugins ?? []).map((y) => ({
          id: y,
          title: ce(q.value.get(y)?.title, "Dependent plugin")
        })) }
      ].filter((y) => y.items.length);
    });
    function b(o) {
      for (const r of o.references?.scopes ?? [])
        fe.value.includes(r) && (n.draft.scopes = fe.value.filter((L) => L !== r), d("remove", "scopes", r));
      I.value = void 0, we(o.plugin, !1), d("review");
    }
    return (o, r) => (e(), s("div", Mo, [
      g(Me, {
        count: R.value.length,
        columns: ["details"]
      }, {
        head: w(() => [
          l("header", Lo, [
            l("h3", null, _(u.value) + " installed · " + _(O.value) + " enabled here", 1)
          ])
        ]),
        default: w(() => [
          R.value.length === 0 ? (e(), s("div", Eo, "No plugin is installed.")) : c("", !0),
          (e(!0), s(H, null, ae(R.value, ({ option: L, plugin: y, status: T, chosen: ee, title: ke, label: ye, severity: Ae, refusal: Ee }) => (e(), P(Le, {
            "route-section": "plugins",
            "route-id": y.plugin,
            key: y.plugin,
            title: ke,
            "keep-mounted": B.value.has(y.plugin),
            open: C.value[y.plugin] ?? (ee && (!y.active || !!a.pluginConfigs[y.plugin]) || !!(y.active && T && T.kind !== "pending")),
            "onUpdate:open": (re) => C.value[y.plugin] = re
          }, Ce({
            details: w(() => [
              g(t(_e), {
                severity: Ae,
                value: ye
              }, null, 8, ["severity", "value"]),
              !T && L.description ? (e(), s("span", Wo, _(t(ce)(L.description, "Adds capabilities to this catalog.")), 1)) : c("", !0)
            ]),
            default: w(() => [
              l("div", Ho, [
                Q.value.get(y.plugin)?.length ? (e(), s("p", Jo, " Adds fields for " + _(Q.value.get(y.plugin)?.join(", ")) + ". ", 1)) : c("", !0),
                y.active && T?.kind === "failed" && T.projection?.[1].parked ? (e(), s("p", Ko, " Background update: Paused ")) : c("", !0),
                T?.kind === "failed" ? (e(), s(H, { key: 2 }, [
                  g(t(je), {
                    severity: "warn",
                    role: "alert"
                  }, {
                    default: w(() => [
                      t(zo)(y) ? (e(), s(H, { key: 0 }, [
                        K("This package uses a plugin interface this deployment cannot run. Restore a compatible package to use this plugin.")
                      ], 64)) : (e(), s(H, { key: 1 }, [
                        K("The catalog could not set up this plugin. Check the status after resolving the setup problem.")
                      ], 64))
                    ]),
                    _: 2
                  }, 1024),
                  g(xe, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: w(() => [
                      l("p", null, [
                        r[6] || (r[6] = K("Plugin ", -1)),
                        l("code", null, _(y.plugin), 1)
                      ]),
                      T.error?.message ? (e(), s("p", Go, _(T.error.message), 1)) : c("", !0),
                      T.error?.code ? (e(), s("p", Yo, [
                        l("code", null, _(T.error.code), 1)
                      ])) : c("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  j.value && y.references ? (e(), P(t(Y), {
                    key: 0,
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (re) => I.value = y.plugin
                  }, null, 8, ["onClick"])) : (e(), P(t(Y), {
                    key: 1,
                    label: "Check status",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: r[0] || (r[0] = (re) => d("refresh"))
                  }))
                ], 64)) : T?.kind === "reset" ? (e(), s(H, { key: 3 }, [
                  g(t(je), { severity: "warn" }, {
                    default: w(() => [
                      r[7] || (r[7] = K(" The event history this background update needs was removed. ", -1)),
                      T.error?.max_pruned_seq !== void 0 ? (e(), s("p", Zo, "Earliest retained position " + _(T.error.max_pruned_seq + 1) + ".", 1)) : c("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  g(xe, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: w(() => [
                      l("p", null, [
                        r[8] || (r[8] = K("Plugin ", -1)),
                        l("code", null, _(y.plugin), 1)
                      ]),
                      T.error?.projection ? (e(), s("p", Qo, [
                        r[9] || (r[9] = K("Background update ", -1)),
                        l("code", null, _(T.error.projection), 1)
                      ])) : c("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  j.value ? (e(), P(t(Y), {
                    key: 0,
                    label: "Reset background updates",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: a.stale,
                    onClick: (re) => d("reset", y.plugin)
                  }, null, 8, ["disabled", "onClick"])) : c("", !0)
                ], 64)) : T?.projection && (T.kind === "paused" || T.kind === "degraded" || T.kind === "catchingUp") ? (e(), s(H, { key: 4 }, [
                  g(t(je), {
                    severity: T.kind === "catchingUp" ? "info" : "warn"
                  }, {
                    default: w(() => [
                      T.projection[1].status === "paused" ? (e(), s("p", Xo, "This update was paused.")) : T.kind === "paused" ? (e(), s("p", ed, "The background worker stopped.")) : T.kind === "degraded" ? (e(), s("p", ld, "The background worker reported an error.")) : (e(), s("p", ad, "This update is processing catalog changes.")),
                      l("p", null, "Last applied position " + _(T.projection[1].last_seq) + ".", 1)
                    ]),
                    _: 2
                  }, 1032, ["severity"]),
                  g(xe, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: w(() => [
                      l("p", null, [
                        r[10] || (r[10] = K("Background update ", -1)),
                        l("code", null, _(T.projection[0]), 1)
                      ]),
                      T.projection[1].error ? (e(), s("p", td, _(T.projection[1].error), 1)) : c("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  j.value && T.projection[1].status === "paused" && T.projection[1].cursor_id ? (e(), P(t(Y), {
                    key: 0,
                    label: "Resume background update",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: a.stale,
                    onClick: (re) => d("resume", T.projection[1].cursor_id)
                  }, null, 8, ["disabled", "onClick"])) : T.kind === "paused" && j.value ? (e(), P(t(Y), {
                    key: 1,
                    label: "Reset background updates",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: a.stale,
                    onClick: (re) => d("reset", y.plugin)
                  }, null, 8, ["disabled", "onClick"])) : (e(), P(t(Y), {
                    key: 2,
                    label: "Check status",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: r[1] || (r[1] = (re) => d("refresh"))
                  }))
                ], 64)) : T?.kind === "uninstalled" ? (e(), s(H, { key: 5 }, [
                  g(t(je), { severity: "warn" }, {
                    default: w(() => [...r[11] || (r[11] = [
                      K("The package was removed while it was still enabled for this catalog.", -1)
                    ])]),
                    _: 1
                  }),
                  g(t(Y), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (re) => I.value = y.plugin
                  }, null, 8, ["onClick"])
                ], 64)) : c("", !0),
                y.installed && (!T || T.kind === "pending") ? (e(), P(xe, {
                  key: 6,
                  class: "small pim-ia-disclosure",
                  label: "Technical details"
                }, {
                  default: w(() => [
                    l("dl", sd, [
                      l("div", null, [
                        r[12] || (r[12] = l("dt", null, "Plugin ID", -1)),
                        l("dd", null, [
                          l("code", null, _(y.plugin), 1)
                        ])
                      ]),
                      (y.interface_version ?? L.interface_version) != null ? (e(), s("div", id, [
                        r[13] || (r[13] = l("dt", null, "Interface version", -1)),
                        l("dd", null, _(y.interface_version ?? L.interface_version), 1)
                      ])) : c("", !0),
                      r[15] || (r[15] = l("div", null, [
                        l("dt", null, "Configuration tool"),
                        l("dd", null, [
                          l("code", null, "PIMConfigurePlugin")
                        ])
                      ], -1)),
                      y.tools.length ? (e(), s("div", nd, [
                        r[14] || (r[14] = l("dt", null, "Plugin tools", -1)),
                        l("dd", null, [
                          l("ul", null, [
                            (e(!0), s(H, null, ae(y.tools, (re) => (e(), s("li", { key: re }, [
                              l("code", null, _(re), 1)
                            ]))), 128))
                          ])
                        ])
                      ])) : c("", !0)
                    ])
                  ]),
                  _: 2
                }, 1024)) : c("", !0),
                ee && y.installed && T?.kind !== "failed" && T?.kind !== "uninstalled" ? (e(), s(H, { key: 7 }, [
                  j.value && L.config_schema.properties && Object.keys(L.config_schema.properties).length ? (e(), s("p", od, "Choose Review changes, then Apply changes to save this configuration.")) : c("", !0),
                  g(Al, {
                    ref_for: !0,
                    ref: (re) => {
                      re ? t(k).set(y.plugin, re) : t(k).delete(y.plugin);
                    },
                    disabled: !j.value,
                    schema: L.config_schema,
                    "model-value": a.pluginConfigs[y.plugin] ?? y.config ?? {},
                    problem: T?.kind === "config" && !Object.hasOwn(a.pluginConfigs, y.plugin) ? T.error : void 0,
                    "plugin-id": T?.kind === "config" ? y.plugin : void 0,
                    refusal: Ee,
                    "field-help": y.plugin === "kickside.pim.inventory:plugin" ? p : void 0,
                    onValidity: (re, Ze) => J(y.plugin, re, Ze),
                    "onUpdate:modelValue": (re) => ve(y.plugin, re)
                  }, null, 8, ["disabled", "schema", "model-value", "problem", "plugin-id", "refusal", "field-help", "onValidity", "onUpdate:modelValue"])
                ], 64)) : c("", !0)
              ])
            ]),
            _: 2
          }, [
            j.value && y.installed && (!T || T.kind === "pending") ? {
              name: "actions",
              fn: w(() => [
                g(t(dl), {
                  "aria-label": "Enable " + ke,
                  "model-value": ee,
                  "onUpdate:modelValue": (re) => we(y.plugin, re)
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "title", "keep-mounted", "open", "onUpdate:open"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      g(fl, {
        visible: !!x.value,
        label: "Plugin references",
        onClose: r[5] || (r[5] = (L) => I.value = void 0)
      }, {
        default: w(() => [
          h.value && x.value ? (e(), s("section", dd, [
            l("header", rd, [
              l("div", null, [
                r[16] || (r[16] = l("h2", null, "Plugin references", -1)),
                l("p", null, _(h.value.title), 1)
              ])
            ]),
            A.value.length ? (e(), s(H, { key: 0 }, [
              r[17] || (r[17] = l("p", null, "Replace or remove these references before deactivating the plugin. You can also restore the package to keep using them.", -1)),
              (e(!0), s(H, null, ae(A.value, (L) => (e(), s("div", {
                key: L.label
              }, [
                l("h3", null, _(L.label), 1),
                l("ul", null, [
                  (e(!0), s(H, null, ae(L.items, (y) => (e(), s("li", {
                    key: y.id
                  }, _(y.title), 1))), 128))
                ])
              ]))), 128))
            ], 64)) : (e(), s("p", ud, "Use the catalog review to see what deactivating this plugin would change.")),
            x.value.references?.scopes.length && !x.value.references?.shell_bindings.length ? (e(), s("p", cd, "Reviewing removal also includes these product filter sets.")) : c("", !0),
            g(xe, {
              class: "small pim-error-code pim-ia-disclosure",
              label: "Technical details"
            }, {
              default: w(() => [
                l("p", null, [
                  r[18] || (r[18] = K("Plugin ", -1)),
                  l("code", null, _(x.value.plugin), 1)
                ]),
                (e(!0), s(H, null, ae(A.value, (L) => (e(), s("div", {
                  key: L.label
                }, [
                  l("p", null, _(L.label), 1),
                  l("ul", null, [
                    (e(!0), s(H, null, ae(L.items, (y) => (e(), s("li", {
                      key: y.id
                    }, [
                      l("code", null, _(y.id), 1)
                    ]))), 128))
                  ])
                ]))), 128))
              ]),
              _: 1
            }),
            l("div", md, [
              j.value && x.value.references?.shell_bindings.length ? (e(), P(t(Y), {
                key: 0,
                label: "Clear catalog app binding",
                severity: "secondary",
                outlined: "",
                disabled: a.stale,
                onClick: r[2] || (r[2] = (L) => d("clearShellBinding", x.value.references.shell_bindings[0]))
              }, null, 8, ["disabled"])) : j.value ? (e(), P(t(Y), {
                key: 1,
                label: "Review removal",
                disabled: a.stale,
                onClick: r[3] || (r[3] = (L) => b(x.value))
              }, null, 8, ["disabled"])) : c("", !0),
              g(t(Y), {
                label: "Close",
                severity: "secondary",
                outlined: "",
                onClick: r[4] || (r[4] = (L) => I.value = void 0)
              })
            ])
          ])) : c("", !0)
        ]),
        _: 1
      }, 8, ["visible"]),
      g(Me, {
        count: a.options.scopes.length,
        columns: ["details"]
      }, {
        head: w(() => [
          r[20] || (r[20] = l("header", { class: "pim-bsection-head" }, [
            l("h3", null, "Product filter sets"),
            l("span", { class: "muted small" }, "Choose additional ways to filter products.")
          ], -1)),
          g(xe, {
            class: "small pim-ia-disclosure",
            label: "Filter set technical details"
          }, {
            default: w(() => [...r[19] || (r[19] = [
              l("p", null, [
                K("Product filter sets are "),
                l("code", null, "scopes"),
                K(" in "),
                l("code", null, "PIMQuery"),
                K(". Use the filter set ID in "),
                l("code", null, "scopes[].id"),
                K(".")
              ], -1)
            ])]),
            _: 1
          })
        ]),
        default: w(() => [
          a.options.scopes.length === 0 ? (e(), s("div", pd, "No product filter sets are available.")) : c("", !0),
          (e(!0), s(H, null, ae(a.options.scopes, (L) => (e(), P(Le, {
            "route-section": "plugins",
            "route-id": "scope:" + L.id,
            key: L.id,
            title: t(ce)(L.title, "Filter set")
          }, Ce({
            details: w(() => [
              g(t(_e), {
                severity: se(L) ? "success" : "secondary",
                value: se(L) ? "Selected" : "Available"
              }, null, 8, ["severity", "value"])
            ]),
            default: w(() => [
              l("div", vd, [
                r[21] || (r[21] = l("span", null, "Filters", -1)),
                (e(!0), s(H, null, ae(L.filters, (y, T) => (e(), P(t(_e), {
                  key: T,
                  class: "kx-tag-sm small",
                  severity: "secondary",
                  value: ie(T, y.ops)
                }, null, 8, ["value"]))), 128)),
                l("span", null, _(t(E)(L.access)) + " access required", 1)
              ]),
              g(xe, {
                class: "small pim-ia-disclosure",
                label: "Technical details"
              }, {
                default: w(() => [
                  l("p", null, [
                    r[22] || (r[22] = K("Filter set ID ", -1)),
                    l("code", null, _(L.id), 1)
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, [
            j.value ? {
              name: "actions",
              fn: w(() => [
                g(t(dl), {
                  "aria-label": "Use " + t(ce)(L.title, "Filter set"),
                  "model-value": se(L),
                  "onUpdate:modelValue": (y) => G(L, y)
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
async function bd(a) {
  const f = await Ra(`/api/v1/pim-admin/catalogs/${encodeURIComponent(a)}/policy_defaults`, "policy defaults");
  if (f.audit !== "fields" && f.audit !== "off" || !["audit_days", "trash_days", "tombstone_days"].every((i) => typeof f[i] == "number" && Number.isSafeInteger(f[i])))
    throw new Error("Policy defaults are unavailable.");
  for (const [i, n] of Object.entries(ca)) {
    const d = f[i];
    if (typeof d != "number" || !Number.isSafeInteger(d) || d < n.min || d > n.max) throw new Error(`Policy ${i} is unavailable.`);
  }
  return f;
}
const ca = {
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
}, yd = { class: "form" }, gd = {
  key: 0,
  class: "muted small pim-policy-intro"
}, hd = {
  key: 1,
  class: "muted small pim-policy-status",
  role: "status"
}, kd = {
  key: 0,
  class: "pim-bsection-head"
}, _d = { class: "pim-policy-copy" }, wd = ["for"], $d = ["id"], Cd = { key: 0 }, xd = {
  key: 0,
  class: "pim-policy-value"
}, Vd = {
  key: 0,
  class: "muted small"
}, jd = /* @__PURE__ */ pe({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {},
    disabled: { type: Boolean },
    defaultsOnly: { type: Boolean }
  },
  setup(a) {
    const f = a, i = W(), n = F(() => f.defaults ?? i.value), d = W(), m = W(!1);
    async function C() {
      if (!(f.defaults || f.disabled)) {
        d.value = void 0, m.value = !0;
        try {
          i.value = await bd(f.catalogId ?? "");
        } catch (u) {
          d.value = Ke(u, "Could not read policy defaults.");
        } finally {
          m.value = !1;
        }
      }
    }
    aa(C);
    const p = F(() => f.draft.policy ?? {}), k = [
      { key: "audit", title: "Audit trail", hint: "Fields records each value change. Off records only lifecycle, schema and release history.", kind: "enum" },
      { key: "audit_days", title: "Audit retention (days)", hint: "0 uses the 365-day default. History always expires.", kind: "int", min: 0, max: 106751 },
      { key: "trash_days", title: "Trash window (days)", hint: "How long a deleted product stays restorable.", kind: "int", min: 1, max: 106751 },
      { key: "tombstone_days", title: "Deleted product notices (days)", hint: "How long feeds report a purged product as deleted.", kind: "int", min: 1, max: 106751 }
    ], M = {
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
    function B(u) {
      const O = ca[u];
      return { key: u, ...O, kind: "int", hint: M[u] };
    }
    k.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(B));
    const J = ["proposal_days", "proposal_count"].map(B), Z = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(B), I = [
      { id: "retention", title: "Retention", keys: k },
      { id: "proposals", title: "Proposals", keys: J },
      { id: "advanced", title: "", keys: Z }
    ], h = F(() => [
      { value: "inherited", label: n.value ? `${n.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function x(u, O) {
      const j = f.draft.policy ?? (f.draft.policy = {});
      j[u] = O == null || O === "" || O === "inherited" ? !1 : O;
    }
    return (u, O) => (e(), s("section", yd, [
      a.defaultsOnly ? c("", !0) : (e(), s("p", gd, "Empty fields inherit the deployment settings.")),
      m.value ? (e(), s("p", hd, "Loading deployment defaults…")) : c("", !0),
      d.value ? (e(), P(gl, {
        key: 2,
        error: d.value
      }, {
        default: w(() => [
          g(t(Y), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: C
          }, {
            default: w(() => [...O[0] || (O[0] = [
              K("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : c("", !0),
      (e(), s(H, null, ae(I, (j) => g(Zl(j.id === "advanced" ? xe : "section"), Wa({
        key: j.id,
        ref_for: !0
      }, j.id === "advanced" ? { label: "Advanced processing settings" } : { "aria-label": j.title }, {
        "data-policy-group": j.id,
        class: "pim-policy-group"
      }), {
        default: w(() => [
          j.title ? (e(), s("header", kd, [
            l("h3", null, _(j.title), 1)
          ])) : c("", !0),
          (e(!0), s(H, null, ae(j.keys, (V) => (e(), s("div", {
            key: V.key,
            class: "pim-policy-row"
          }, [
            l("div", _d, [
              l("label", {
                for: "pol-" + V.key
              }, _(V.title), 9, wd),
              l("p", {
                id: "pol-help-" + V.key
              }, [
                K(_(V.hint), 1),
                V.global ? (e(), s("span", Cd, " Managed in deployment settings.")) : c("", !0)
              ], 8, $d)
            ]),
            a.defaultsOnly ? (e(), s("p", xd, [
              K(_(n.value?.[V.key] === "fields" ? "Record field changes" : n.value?.[V.key] === "off" ? "Lifecycle and release history" : n.value?.[V.key] ?? "Unavailable") + " ", 1),
              p.value[V.key] !== void 0 && p.value[V.key] !== !1 ? (e(), s("span", Vd, " · Catalog override applies")) : c("", !0)
            ])) : V.kind === "enum" ? (e(), P(t(Ve), {
              key: 1,
              disabled: a.disabled,
              "input-id": "pol-" + V.key,
              "aria-describedby": "pol-help-" + V.key,
              class: "pim-policy-control",
              "model-value": typeof p.value[V.key] == "string" ? p.value[V.key] : "inherited",
              options: h.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": (q) => x(V.key, q)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])) : (e(), P(t(Ya), {
              key: 2,
              disabled: a.disabled || V.global,
              "input-id": "pol-" + V.key,
              "aria-describedby": "pol-help-" + V.key,
              class: "pim-policy-control",
              "model-value": V.global ? Number(n.value?.[V.key] ?? 0) || null : typeof p.value[V.key] == "number" ? Number(p.value[V.key]) : null,
              min: V.min ?? (V.key === "audit_days" ? 0 : 1),
              max: V.max,
              step: 1,
              placeholder: n.value ? "Default: " + n.value[V.key] : "Deployment default",
              "onUpdate:modelValue": (q) => x(V.key, q)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "min", "max", "placeholder", "onUpdate:modelValue"]))
          ]))), 128))
        ]),
        _: 2
      }, 1040, ["data-policy-group"])), 64))
    ]));
  }
}), Ud = { class: "form" }, Sd = { class: "pim-aspect" }, Od = { class: "pim-aspect-head" }, Ad = {
  key: 0,
  class: "muted small"
}, Rd = /* @__PURE__ */ pe({
  __name: "BuilderDeclaration",
  props: {
    draft: {},
    readonly: { type: Boolean }
  },
  emits: ["replace", "validity"],
  setup(a, { emit: f }) {
    const i = a, n = f, d = W(JSON.stringify(i.draft, null, 2)), m = W("");
    Ye(() => n("validity", !0)), be(() => i.draft, (p) => {
      d.value = JSON.stringify(p, null, 2), m.value = "";
    }, { deep: !0 });
    function C() {
      if (!i.readonly)
        try {
          const p = ct(d.value);
          m.value = "", n("validity", !0), n("replace", p);
        } catch (p) {
          n("validity", !1), m.value = "Invalid declaration: " + (p instanceof Error ? p.message : String(p));
        }
    }
    return (p, k) => (e(), s("section", Ud, [
      l("div", Sd, [
        l("header", Od, [
          k[1] || (k[1] = l("h3", null, "Declaration", -1)),
          a.readonly ? c("", !0) : (e(), s("span", Ad, "edits apply to the draft when the JSON parses"))
        ]),
        m.value ? (e(), P(t(je), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: w(() => [
            K(_(m.value), 1)
          ]),
          _: 1
        })) : c("", !0),
        g(t(Za), {
          modelValue: d.value,
          "onUpdate:modelValue": k[0] || (k[0] = (M) => d.value = M),
          readonly: a.readonly,
          "aria-label": "Catalog declaration",
          rows: "28",
          spellcheck: "false",
          onInput: C,
          onBlur: C,
          class: "mono pim-json-edit"
        }, null, 8, ["modelValue", "readonly"])
      ])
    ]));
  }
}), Pd = { class: "pim-section-layout" }, Td = { class: "kx-main" }, qd = ["aria-label"], Id = { class: "pim-builder-main" }, Dd = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, Fd = ["disabled", "inert"], Nd = {
  key: 0,
  class: "form pim-card-body pad pim-ia-action"
}, zd = {
  key: 0,
  class: "muted small"
}, Bd = {
  key: 1,
  class: "muted small"
}, Md = { class: "pim-overview-grid" }, Ld = { class: "kx-head-icon" }, Ed = { class: "kx-card-id" }, Wd = { class: "kx-card-name" }, Hd = { class: "kx-card-meta" }, Jd = { class: "kx-card-desc" }, Kd = { class: "pim-overview-actions" }, Gd = { class: "pim-advanced-actions" }, Yd = { class: "pim-ia-action" }, Zd = { class: "pim-ia-action" }, Qd = {
  key: 2,
  class: "pim-ia-content"
}, Xd = { class: "pim-ia-dialog" }, er = { class: "pim-ia-dialog-head" }, lr = {
  key: 0,
  class: "dialog-actions"
}, ar = ["aria-labelledby"], tr = { class: "pim-ia-dialog-head" }, sr = ["id"], ir = { class: "pim-ia-review-impact" }, nr = { key: 0 }, or = { key: 1 }, dr = { key: 2 }, rr = { key: 3 }, ur = { key: 4 }, cr = { key: 5 }, mr = { key: 0 }, pr = {
  key: 0,
  class: "pim-plan-list"
}, vr = { key: 1 }, fr = {
  key: 1,
  class: "pim-plan-list"
}, br = {
  key: 2,
  class: "pim-ia-review-impact"
}, yr = {
  key: 0,
  class: "row pim-review-confirm"
}, gr = ["for"], hr = { class: "dialog-actions pim-ia-dialog-actions" }, kr = /* @__PURE__ */ pe({
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
  setup(a, { emit: f }) {
    const i = a, n = f, d = {
      General: { question: "Catalog setup", items: [
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
    }, m = {
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
    }, C = W(""), p = W("General"), k = W("Overview"), M = W(""), B = W(), J = F(() => B.value?.from === "Channels" ? "Families" : B.value ? "Fields" : void 0), Z = W(), I = W(!1), h = W(), x = W(""), u = Object.keys(d).map(($) => ({
      heading: $ === "Channels" ? "Publishing and imports" : $,
      items: d[$].items.map((v) => ({ ...v, value: v.label, section: $ }))
    })), O = [
      ...u.filter(($) => $.items.length > 1),
      { heading: "Manage catalog", items: u.filter(($) => $.items.length === 1).flatMap(($) => $.items) }
    ], j = O.flatMap(($) => $.items), V = F(() => y.value && T.value ? [
      { ...O[0], heading: i.title || "Catalog" },
      ...O.slice(1)
    ] : []), q = F(() => i.backLabel ? {
      value: "all-catalogs",
      label: i.embedded ? "All catalogs" : i.backLabel,
      icon: "tabler:table"
    } : void 0), Q = W();
    be(Q, ($) => {
      i.focusBack && $?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    function R($) {
      if ($ === "all-catalogs") {
        n("back");
        return;
      }
      const v = j.find((S) => S.label === $);
      v && ve(v.section, v.label);
    }
    function ie($, v, S = "") {
      const le = k.value !== v;
      p.value = $, k.value = v, C.value = S ? m[v] + "/" + S : "", le && (x.value = "", h.value && (h.value.scrollTop = 0));
    }
    function we($, v, S = "") {
      ie($, v, S), i.route !== void 0 && n("navigate", [m[v], ...S ? [encodeURIComponent(S)] : []].join("/"));
    }
    function ve($, v = d[$].items[0].label) {
      (p.value !== $ || k.value !== v) && (B.value = void 0, we($, v));
    }
    function fe($, v, S) {
      if (i.route === void 0 || m[k.value] !== $ || !S && C.value !== $ + "/" + v) return;
      const le = y.value;
      ($ === "families" ? le?.families[v] : $ === "fields" ? le?.declaration.aspects?.some((de) => de.attributes?.some((ge) => de.namespace + "." + ge.id === v)) : $ === "dimensions" ? le?.dimensions.some((de) => de.name === v) : $ === "vocabularies" ? le?.vocabularies[v] : $ === "channels" ? le?.channels[v] : $ === "sources" ? le?.sources[v] : $ === "plugins" && (T.value?.plugins.some((de) => de.plugin === v) || T.value?.scopes.some((de) => "scope:" + de.id === v))) && we(p.value, k.value, S ? v : "");
    }
    Ql(ra, { selected: C, choose: fe }), be(() => i.route, ($) => {
      if ($ === void 0) return;
      const [v, S] = $.split("/"), le = j.find((de) => m[de.label] === v);
      le?.label !== J.value && (B.value = void 0);
      let oe = "";
      try {
        S && (oe = decodeURIComponent(S));
      } catch {
      }
      le?.label === "Fields" && oe && C.value !== "fields/" + oe && (M.value = ""), ie(le?.section ?? "General", le?.label ?? "Overview", oe);
    }, { immediate: !0 });
    function se($) {
      Z.value = $, I.value = !0;
    }
    function G($) {
      M.value = $, ve("Products", "Fields");
    }
    async function A($, v, S = "") {
      we($, v, S), await De(), h.value?.focus({ preventScroll: !0 });
    }
    function b($) {
      B.value = { from: "Channels", id: $ };
      const v = Fl.value.find((le) => le.id === $)?.families, S = ml.value.filter((le) => !v?.length || v.includes(le.code));
      A("Products", "Families", S.length === 1 ? S[0].code : void 0);
    }
    function o($) {
      M.value = "", B.value = { from: "Families", id: $ }, A("Products", "Fields");
    }
    function r() {
      if (!B.value) return;
      const { from: $, id: v } = B.value;
      B.value = void 0, A($ === "Channels" ? "Channels" : "Products", $, v);
    }
    function L($, v, S = v + "s") {
      return $ + " " + ($ === 1 ? v : S);
    }
    const y = W(null), T = W(null), ee = W({}), ke = W({}), ye = W({}), Ae = W(), Ee = W(), re = W(!1), Ze = W(0), N = F(() => Object.fromEntries(Object.entries(ye.value).filter(([$]) => ee.value.plugins?.some((v) => v.use === $) && !y.value?.plugins.some((v) => v.plugin === $ && v.active)))), D = W(), z = W(!1), U = W(null), te = W(!1), X = F(() => y.value?.access.admin === !0), ue = W(null), $e = W(!1), Qe = W(!1), Rl = W(null), ul = qe(), ma = {
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
    }, Xe = W(null), Fe = W(!0), Ie = Ge(), Pl = F(() => $e.value && Ue.value && (!wl.value.length || Qe.value) && !z.value && Fe.value && !!ue.value && ue.value.class !== "refused" && !!Xe.value?.matches(We.value, y.value?.schema_generation ?? -1, ye.value)), Tl = F(() => ue.value ? [...ue.value.refused, ...ue.value.changes.filter(($) => $.class !== "refused")] : []), il = Ge(), hl = W(!1);
    let kl = 0;
    be([ee, ke, ye], () => {
      kl++, x.value = "", Re();
    }, { deep: !0, flush: "sync" });
    async function el($ = !1, v = !1) {
      if (Ue.value && !$) return;
      const S = il.begin(), le = kl, oe = i.catalogId, de = v ? Object.entries(ye.value).filter(([ge]) => y.value?.plugins.some((Pe) => Pe.plugin === ge && Pe.active)) : [];
      hl.value = !0, D.value = void 0, Ae.value = void 0;
      try {
        const [ge, Pe] = await Promise.all([he.schema(oe), he.schemaOptions(oe)]);
        if (!il.current(S) || le !== kl || oe !== i.catalogId) return !1;
        const Ne = x.value;
        return y.value = ge, T.value = Pe, ee.value = al(ge.declaration), ke.value = {}, ye.value = Object.fromEntries(de.filter(([Sa]) => ge.plugins.some((Wl) => Wl.plugin === Sa && Wl.active))), Re(), Fe.value = !0, z.value = !1, x.value = Ne, !0;
      } catch (ge) {
        return il.current(S) && (D.value = Ke(ge, "Could not load settings.")), !1;
      } finally {
        il.current(S) && (hl.value = !1);
      }
    }
    let _l = () => {
    };
    be(() => i.catalogId, ($) => {
      _l(), _l = ta(`component.${$}`, () => {
        !Ue.value && !te.value ? el() : k.value === "Plugins" && !te.value && cl();
      });
    }, { immediate: !0 });
    const va = yl(async () => {
      !Ue.value && !te.value ? await el() : k.value === "Plugins" && !te.value && await cl();
    });
    Ye(() => {
      _l(), Ie.begin(), il.begin();
    });
    const { refreshPluginStatus: cl, resetPlugin: fa, resumePluginProjection: ba, clearShellBinding: ya } = Bo({
      catalogId: () => i.catalogId,
      shouldPoll: () => va.value !== !1 && k.value === "Plugins",
      schema: y,
      options: T,
      busy: te,
      stale: z,
      editable: X,
      saved: x,
      clearError: () => {
        D.value = void 0;
      },
      reportError: $l
    });
    be(() => i.catalogId, () => {
      Ie.begin(), te.value = !1, z.value = !1, y.value = null, T.value = null, Cl(), el();
    });
    const ga = F(() => Object.values(Jl(ee.value, ke.value)).reduce(($, v) => $ + (v?.length ?? 0), 0)), ql = F(() => !!y.value && (JSON.stringify(ee.value) !== JSON.stringify(y.value.declaration) || ga.value > 0 || Object.keys(N.value).length > 0)), Ue = F(() => re.value || ql.value || Object.keys(ye.value).length > 0);
    be(Ue, ($) => n("dirty-changed", $), { immediate: !0 });
    const ml = F(() => ee.value.families?.filter(($) => $.code !== "generic") ?? []), Il = F(() => ee.value.aspects ?? []), Dl = F(() => Il.value.reduce(($, v) => $ + (v.attributes?.length ?? 0), 0)), ha = F(() => {
      const $ = new Set(ee.value.plugins?.map((v) => v.use));
      return Object.values(y.value?.attributes ?? {}).filter((v) => v.plugin && $.has(v.plugin)).length;
    }), ka = F(() => !Dl.value && !Il.value.length && !ml.value.length), Fl = F(() => ee.value.channels ?? []), _a = F(() => ee.value.sources ?? []), Nl = F(() => y.value?.plugins.filter(($) => $.active) ?? []), zl = F(() => i.catalog?.product_count ?? i.catalog?.item_count), wa = F(() => [
      {
        section: "Products",
        label: "Product setup",
        icon: "tabler:packages",
        summary: [
          ...typeof zl.value == "number" ? [L(zl.value, "product")] : [],
          L(ml.value.length, "family", "families"),
          L(Dl.value + ha.value, "field")
        ].join(" · "),
        detail: ml.value.map(($) => E($.code)).join(", ") || "Create a family for products that share the same fields."
      },
      {
        section: "Values",
        label: "Allowed values",
        icon: "tabler:list-details",
        summary: [L(ee.value.dimensions?.length ?? 0, "dimension"), L(ee.value.vocabularies?.length ?? 0, "vocabulary", "vocabularies")].join(" · "),
        detail: ee.value.dimensions?.map(($) => E($.name)).join(", ") || "Add dimensions when values vary by language, region or another context."
      },
      {
        section: "Channels",
        label: "Publishing and imports",
        icon: "tabler:arrows-exchange",
        summary: [L(Fl.value.length, "channel"), L(_a.value.length, "source")].join(" · "),
        detail: "Publish products to channels and control incoming updates through sources."
      },
      {
        section: "Plugins",
        label: "Catalog tools",
        icon: "tabler:puzzle",
        summary: L(Nl.value.length, "plugin") + " enabled",
        detail: Nl.value.map(($) => ce($.title, "Catalog plugin")).join(", ") || "Open Plugins to see which tools you can enable."
      }
    ]), $a = {
      Overview: d.General.question,
      History: "What changed in this catalog?",
      Families: "Choose what each family collects, how products vary, and what they need before release.",
      Fields: "Manage product fields and the groups that families share.",
      "Form layout": "In what order will editors see fields?",
      Dimensions: "Where can product values differ?",
      Vocabularies: "Which terms can product editors choose?",
      Channels: "Choose where each family can publish and what products need before release.",
      Sources: "Control who can send product updates and which fields each source can change.",
      Access: d.Access.question,
      Plugins: d.Plugins.question
    }, We = F(() => {
      const $ = al(ee.value), v = Jl($, ke.value);
      for (const [S, le] of Object.entries(v)) {
        const oe = $.remove ??= {};
        oe[S] = [.../* @__PURE__ */ new Set([...oe[S] ?? [], ...le])];
      }
      return $;
    });
    function Ca($) {
      const [v, S] = $.split(" ", 2);
      if (v === "plugin" && S) return ce(T.value?.plugins.find((de) => de.plugin === S)?.title, "Plugin");
      if (v === "scope" && S) return ce(T.value?.scopes.find((de) => de.id === S)?.title, "Product filter set");
      if (S) return ce(E(S), E(v)) + (v === "aspect" ? " field group" : "");
      if ($.startsWith("kickside.")) return "Catalog setting";
      const [le, oe] = $.split(".", 2);
      return oe ? `${ce(E(oe), "Field")} (${ce(E(le), "Field group")})` : ce(E($), "Catalog setting");
    }
    function xa($) {
      return $.startsWith("renamed from ") ? "Rename from " + E($.slice(13)) : $.startsWith("config.") ? "Change " + E($.slice(7)) : $.endsWith(" owning level") ? "Move a field to another variant level" : pa[$] ?? E($);
    }
    const wl = F(() => {
      const $ = We.value.remove;
      return [
        ...$?.attributes?.length || $?.aspects?.length ? ["Removing fields deletes the values stored in those fields."] : [],
        ...$?.vocabularies?.length ? ["Removing a vocabulary deletes its saved terms."] : [],
        ...$?.channels?.length ? ["Removing a release destination withdraws products already published to it."] : []
      ];
    }), Bl = F(() => {
      const $ = y.value?.declaration;
      return $ ? [
        ...(ee.value.channels ?? []).flatMap((v) => {
          const S = $.channels?.find((le) => le.id === v.id);
          return JSON.stringify(v) === JSON.stringify(S) ? [] : [{ subject: E(v.id), effect: S ? "Change which products can be released here and what they need first" : "Add a release destination" }];
        }),
        ...(We.value.remove?.channels ?? []).map((v) => ({ subject: E(v), effect: "Remove this release destination" })),
        ...(ee.value.sources ?? []).flatMap((v) => {
          const S = $.sources?.find((le) => le.id === v.id);
          return JSON.stringify(v) === JSON.stringify(S) ? [] : [{ subject: E(v.id), effect: S ? "Update how this source can send product data" : "Let this source send product updates" }];
        }),
        ...(We.value.remove?.sources ?? []).map((v) => ({ subject: E(v), effect: "Stop accepting updates from this source" }))
      ] : [];
    }), Ml = F(() => {
      const $ = Xe.value;
      if (!$) return [];
      const v = $.declaration.plugins?.filter((le) => !y.value?.plugins.some((oe) => oe.plugin === le.use && oe.active)) ?? [];
      return [.../* @__PURE__ */ new Set([...v.map((le) => le.use), ...Object.keys($.activeConfigs)])].flatMap((le) => {
        const oe = T.value?.plugins.find((Pe) => Pe.plugin === le);
        if (!oe || !Object.keys(oe.config_schema.properties ?? {}).length) return [];
        const de = $.pluginConfigs[le] ?? {}, ge = Object.entries(de).map(([Pe, Ne]) => bl(oe.config_schema, Pe) + " · " + rl(Ne));
        if (le in $.activeConfigs) {
          const Pe = y.value?.plugins.find((Ne) => Ne.plugin === le)?.config ?? {};
          for (const Ne of Object.keys(Pe))
            Ne in de || ge.push(bl(oe.config_schema, Ne) + " · Uses default");
        }
        return [{ id: le, title: ce(oe.title, "Plugin"), fields: ge.length ? ge : ["Uses defaults"] }];
      });
    });
    function $l($, v) {
      const S = Ke($, v), le = S.pluginConfig, oe = T.value?.plugins.find((de) => de.installed && de.plugin === le?.plugin);
      if (le && oe && ee.value.plugins?.some((de) => de.use === le.plugin)) {
        Ae.value = le, ve("Plugins");
        return;
      }
      D.value = S, S.code === Pa && (z.value = !0, Re());
    }
    async function Va() {
      if (!(Ue.value && !await tl.confirm({
        header: "Discard unsaved changes?",
        message: "Reloading will discard unsaved settings and plugin changes.",
        acceptLabel: "Discard and reload",
        rejectLabel: "Cancel"
      }))) {
        te.value = !0, x.value = "";
        try {
          await el(!0);
        } finally {
          te.value = !1;
        }
      }
    }
    async function Ll() {
      if (!y.value || !Ue.value || !Fe.value || z.value || te.value || (re.value && p.value !== "Plugins" && (ve("Plugins"), await De()), Ee.value && !Ee.value.reportValidity())) return;
      const $ = Ie.begin(), v = {
        ...dt(We.value, y.value.schema_generation, ye.value),
        schemaChanges: ql.value,
        initialConfigs: al(N.value),
        activeConfigs: al(Object.fromEntries(Object.entries(ye.value).filter(([S]) => y.value?.plugins.some((le) => le.plugin === S && le.active) && !We.value.remove?.plugins?.includes(S))))
      };
      te.value = !0, D.value = void 0;
      try {
        const S = v.schemaChanges ? await he.planSchema(i.catalogId, v.declaration, v.generation, v.initialConfigs) : { generation: v.generation, class: "configuration", changes: [], refused: [] };
        if (!Ie.current($) || !v.matches(We.value, y.value.schema_generation, ye.value) || !Fe.value) return;
        Xe.value = v, Qe.value = !1, ue.value = S, $e.value = !0, await De(), Rl.value?.focus();
      } catch (S) {
        if (!Ie.current($)) return;
        $l(S, "Could not review the change."), Re(), await De(), U.value?.$el.focus();
      } finally {
        Ie.current($) && (te.value = !1);
      }
    }
    async function ja() {
      if (!y.value || !Ue.value || !Pl.value || !Xe.value) return;
      const $ = i.catalogId, v = Ie.begin(), S = Xe.value, le = () => $ === i.catalogId && Ie.current(v);
      te.value = !0, D.value = void 0, x.value = "";
      let oe = !1;
      try {
        if (S.schemaChanges) {
          const de = await he.applySchema($, S.declaration, S.generation, S.initialConfigs);
          if (!le()) return;
          const ge = await el(!0, !0);
          if (!le() || (n("applied", de.generation), !ge)) return;
        }
        try {
          for (const [de, ge] of Object.entries(S.activeConfigs)) {
            if (await he.configurePlugin($, de, ge), !le()) return;
            oe = !0, delete ye.value[de];
          }
        } finally {
          oe && le() && await cl(!0);
        }
        if (!le() || D.value) return;
        Ae.value = void 0, x.value = "Catalog changes applied.";
      } catch (de) {
        if (!le()) return;
        Re(), $l(de, "Could not apply the change."), await De(), U.value?.$el.focus();
      } finally {
        Ie.current(v) && (te.value = !1);
      }
    }
    async function Ua() {
      Ue.value && !await tl.confirm({
        header: "Leave this catalog?",
        message: "Your unsaved catalog changes will be discarded.",
        acceptLabel: "Discard and open settings",
        rejectLabel: "Keep editing"
      }) || (Cl(), I.value = !1, tl.navigate("/system/settings"));
    }
    function Re() {
      $e.value = !1, Xe.value = null;
    }
    function El() {
      I.value = !1, Fe.value = !0;
    }
    function Cl() {
      B.value = void 0, ye.value = {}, re.value = !1, Ze.value++, Ae.value = void 0, Fe.value = !0, y.value && (ee.value = al(y.value.declaration)), ke.value = {}, Re(), x.value = "";
    }
    function ll($, v) {
      const S = ke.value[$] ?? [];
      S.includes(v) || (ke.value = { ...ke.value, [$]: [...S, v] });
    }
    return ($, v) => (e(), s("section", {
      class: Oe(["pim-builder", { embedded: a.embedded }])
    }, [
      l("div", Pd, [
        q.value || y.value && T.value ? (e(), P(at, {
          key: 0,
          ref_key: "rail",
          ref: Q,
          label: "Catalog settings sections",
          value: k.value,
          groups: V.value,
          "leading-item": q.value,
          "onUpdate:value": R
        }, null, 8, ["value", "groups", "leading-item"])) : c("", !0),
        l("div", Td, [
          l("section", {
            ref_key: "content",
            ref: h,
            class: "kx-main-scroll",
            "aria-label": k.value,
            tabindex: "-1"
          }, [
            y.value && T.value ? (e(), P(ts, {
              key: 0,
              title: k.value,
              description: $a[k.value]
            }, Ce({ _: 2 }, [
              X.value && Ue.value ? {
                name: "actions",
                fn: w(() => [
                  g(ss, {
                    busy: te.value,
                    "review-disabled": !Fe.value || z.value,
                    onDiscard: Cl,
                    onReview: Ll
                  }, null, 8, ["busy", "review-disabled"])
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : c("", !0),
            l("div", Id, [
              D.value ? (e(), P(gl, {
                key: 0,
                ref_key: "errorPanel",
                ref: U,
                error: D.value,
                tabindex: "-1"
              }, {
                default: w(() => [
                  z.value ? (e(), P(t(Y), {
                    key: 0,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: te.value,
                    onClick: Va
                  }, {
                    default: w(() => [...v[15] || (v[15] = [
                      K("Reload settings", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"])) : !y.value || !T.value ? (e(), P(t(Y), {
                    key: 1,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: v[0] || (v[0] = (S) => el())
                  }, {
                    default: w(() => [...v[16] || (v[16] = [
                      K("Retry", -1)
                    ])]),
                    _: 1
                  })) : c("", !0)
                ]),
                _: 1
              }, 8, ["error"])) : c("", !0),
              x.value ? (e(), P(t(je), {
                key: 1,
                severity: "success",
                role: "status"
              }, {
                default: w(() => [
                  K(_(x.value), 1)
                ]),
                _: 1
              })) : c("", !0),
              y.value?.rebuilding && k.value === "Overview" ? (e(), P(t(je), {
                key: 2,
                severity: "info",
                role: "status"
              }, {
                default: w(() => [...v[17] || (v[17] = [
                  K("Updating product readiness", -1)
                ])]),
                _: 1
              })) : c("", !0),
              hl.value && (!y.value || !T.value) ? (e(), s("div", Dd, "Loading catalog settings…")) : y.value && T.value ? (e(), s("fieldset", {
                key: 4,
                class: "pim-editor-surface",
                disabled: te.value,
                inert: te.value
              }, [
                X.value ? c("", !0) : (e(), P(t(je), {
                  key: 0,
                  severity: "info"
                }, {
                  default: w(() => [...v[18] || (v[18] = [
                    K("You can view this catalog’s settings.", -1)
                  ])]),
                  _: 1
                })),
                p.value !== "Plugins" ? (e(), s("div", {
                  key: k.value,
                  class: "pim-ia-content"
                }, [
                  B.value && k.value === J.value ? (e(), s("div", Nd, [
                    l("div", null, [
                      B.value.from === "Channels" ? (e(), s("p", zd, "Open the family that defines what products need before release, then add a release requirement.")) : (e(), s("p", Bd, "Add a field with a single value and no dimensions, such as Integer. When you return, select its group under Field groups."))
                    ]),
                    g(t(Y), {
                      type: "button",
                      severity: "secondary",
                      outlined: "",
                      size: "small",
                      onClick: r
                    }, {
                      default: w(() => [
                        g(t(ne), {
                          icon: "tabler:arrow-left",
                          "aria-hidden": "true"
                        }),
                        K(" Back to " + _(t(E)(B.value.id)), 1)
                      ]),
                      _: 1
                    })
                  ])) : c("", !0),
                  p.value === "General" && k.value === "History" ? (e(), P(Xt, {
                    key: 1,
                    "catalog-id": a.catalogId,
                    "can-resolve-actors": X.value
                  }, null, 8, ["catalog-id", "can-resolve-actors"])) : p.value === "General" ? (e(), s(H, { key: 2 }, [
                    l("div", Md, [
                      (e(!0), s(H, null, ae(wa.value, (S) => (e(), s("section", {
                        key: S.section,
                        class: "kx-card pim-overview-card"
                      }, [
                        l("span", Ld, [
                          g(t(ne), {
                            icon: S.icon,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"])
                        ]),
                        l("div", Ed, [
                          l("h3", Wd, _(S.label), 1),
                          l("p", Hd, _(S.summary), 1)
                        ]),
                        l("p", Jd, _(S.detail), 1),
                        l("div", Kd, [
                          g(t(Y), {
                            type: "button",
                            text: "",
                            class: "pim-overview-action",
                            onClick: (le) => ve(S.section)
                          }, {
                            default: w(() => [
                              K(_(S.section === "Products" ? ka.value ? "Set up products" : "View families" : "View " + S.section.toLowerCase()) + " ", 1),
                              g(t(ne), {
                                icon: "tabler:arrow-right",
                                "aria-hidden": "true"
                              })
                            ]),
                            _: 2
                          }, 1032, ["onClick"]),
                          S.section === "Channels" ? (e(), P(t(Y), {
                            key: 0,
                            type: "button",
                            text: "",
                            class: "pim-overview-action",
                            onClick: v[1] || (v[1] = (le) => ve("Channels", "Sources"))
                          }, {
                            default: w(() => [
                              v[19] || (v[19] = K(" Manage sources ", -1)),
                              g(t(ne), {
                                icon: "tabler:arrow-right",
                                "aria-hidden": "true"
                              })
                            ]),
                            _: 1
                          })) : c("", !0)
                        ])
                      ]))), 128))
                    ]),
                    g(xe, { label: "Advanced" }, {
                      default: w(() => [
                        l("div", Gd, [
                          l("div", Yd, [
                            v[20] || (v[20] = l("div", null, [
                              l("h3", null, "Application defaults"),
                              l("p", null, "Review the audit, retention and processing settings this catalog inherits.")
                            ], -1)),
                            g(t(Y), {
                              label: "View defaults",
                              severity: "secondary",
                              outlined: "",
                              onClick: v[2] || (v[2] = (S) => se("defaults"))
                            })
                          ]),
                          l("div", Zd, [
                            v[21] || (v[21] = l("div", null, [
                              l("h3", null, "Technical schema"),
                              l("p", null, "Inspect the complete definition, including integration keys and settings used by installed extensions.")
                            ], -1)),
                            g(t(Y), {
                              label: "Open declaration",
                              severity: "secondary",
                              outlined: "",
                              onClick: v[3] || (v[3] = (S) => se("declaration"))
                            })
                          ])
                        ])
                      ]),
                      _: 1
                    })
                  ], 64)) : p.value === "Products" ? (e(), s(H, { key: 3 }, [
                    k.value === "Families" ? (e(), P(Yn, {
                      key: 0,
                      draft: ee.value,
                      schema: y.value,
                      options: T.value,
                      onRemove: ll,
                      onFields: G,
                      onVariantField: o
                    }, null, 8, ["draft", "schema", "options"])) : k.value === "Fields" ? (e(), P(Ni, {
                      key: 1,
                      family: M.value,
                      "onUpdate:family": v[4] || (v[4] = (S) => M.value = S),
                      draft: ee.value,
                      schema: y.value,
                      options: T.value,
                      onRemove: ll,
                      onLayout: v[5] || (v[5] = (S) => ve("Products", "Form layout"))
                    }, null, 8, ["family", "draft", "schema", "options"])) : (e(), P(Rt, {
                      key: 2,
                      draft: ee.value,
                      schema: y.value,
                      types: T.value.types,
                      onFamilies: v[6] || (v[6] = (S) => ve("Products", "Families"))
                    }, null, 8, ["draft", "schema", "types"]))
                  ], 64)) : p.value === "Values" ? (e(), s(H, { key: 4 }, [
                    k.value === "Dimensions" ? (e(), P(Gi, {
                      key: 0,
                      draft: ee.value,
                      schema: y.value,
                      onRemove: ll
                    }, null, 8, ["draft", "schema"])) : (e(), P(bn, {
                      key: 1,
                      "catalog-id": a.catalogId,
                      draft: ee.value,
                      schema: y.value,
                      onRemove: ll
                    }, null, 8, ["catalog-id", "draft", "schema"]))
                  ], 64)) : p.value === "Channels" ? (e(), P(Io, {
                    key: 5,
                    "catalog-id": a.catalogId,
                    draft: ee.value,
                    schema: y.value,
                    view: k.value === "Sources" ? "sources" : "channels",
                    onRemove: ll,
                    onRequirements: b
                  }, null, 8, ["catalog-id", "draft", "schema", "view"])) : p.value === "Access" ? (e(), P(ot, {
                    key: 6,
                    "catalog-id": a.catalogId,
                    title: a.title || "Catalog",
                    access: y.value.access
                  }, null, 8, ["catalog-id", "title", "access"])) : c("", !0)
                ])) : c("", !0),
                p.value === "Plugins" || re.value ? ea((e(), s("div", Qd, [
                  (e(), P(fd, {
                    key: Ze.value,
                    ref_key: "pluginEditor",
                    ref: Ee,
                    draft: ee.value,
                    schema: y.value,
                    options: T.value,
                    "plugin-configs": ye.value,
                    refusal: Ae.value,
                    stale: z.value,
                    onRemove: ll,
                    onReset: t(fa),
                    onClearRefusal: v[7] || (v[7] = (S) => Ae.value = void 0),
                    onInvalidDraft: v[8] || (v[8] = (S) => re.value = S),
                    onRefresh: v[9] || (v[9] = (S) => t(cl)(!0)),
                    onResume: t(ba),
                    onReview: Ll,
                    onClearShellBinding: t(ya)
                  }, null, 8, ["draft", "schema", "options", "plugin-configs", "refusal", "stale", "onReset", "onResume", "onClearShellBinding"]))
                ], 512)), [
                  [la, p.value === "Plugins"]
                ]) : c("", !0),
                Z.value ? (e(), P(fl, {
                  key: 3,
                  visible: I.value,
                  label: Z.value === "defaults" ? "Application defaults" : "Technical schema",
                  onClose: El,
                  onClosed: v[12] || (v[12] = (S) => Z.value = void 0)
                }, {
                  default: w(() => [
                    l("div", Xd, [
                      l("header", er, [
                        l("h2", null, _(Z.value === "defaults" ? "Application defaults" : "Technical schema"), 1),
                        g(t(Y), {
                          type: "button",
                          "aria-label": "Close",
                          text: "",
                          severity: "secondary",
                          onClick: El
                        }, {
                          default: w(() => [
                            g(t(ne), {
                              icon: "tabler:x",
                              "aria-hidden": "true"
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      Z.value === "defaults" ? (e(), s(H, { key: 0 }, [
                        v[22] || (v[22] = l("p", { class: "muted" }, "These settings apply across the application. Catalogs with an explicit override keep their chosen value.", -1)),
                        g(jd, {
                          "catalog-id": a.catalogId,
                          draft: ee.value,
                          disabled: !X.value,
                          "defaults-only": ""
                        }, null, 8, ["catalog-id", "draft", "disabled"]),
                        X.value ? (e(), s("div", lr, [
                          g(t(Y), {
                            type: "button",
                            label: "Open application settings",
                            severity: "secondary",
                            outlined: "",
                            onClick: Ua
                          })
                        ])) : c("", !0)
                      ], 64)) : (e(), P(Rd, {
                        key: 1,
                        draft: ee.value,
                        readonly: !X.value,
                        onReplace: v[10] || (v[10] = (S) => ee.value = S),
                        onValidity: v[11] || (v[11] = (S) => {
                          Fe.value = S, Re();
                        })
                      }, null, 8, ["draft", "readonly"]))
                    ])
                  ]),
                  _: 1
                }, 8, ["visible", "label"])) : c("", !0)
              ], 8, Fd)) : c("", !0),
              g(fl, {
                class: "pim-review-dialog",
                visible: $e.value,
                busy: te.value,
                label: "Review changes",
                onClose: Re,
                onClosed: v[14] || (v[14] = (S) => ue.value = null)
              }, {
                default: w(() => [
                  ue.value ? (e(), s("section", {
                    key: 0,
                    class: "pim-ia-dialog pim-plan",
                    "aria-labelledby": t(ul)
                  }, [
                    l("header", tr, [
                      l("div", null, [
                        l("h2", {
                          id: t(ul),
                          ref_key: "reviewHeading",
                          ref: Rl,
                          tabindex: "-1",
                          autofocus: ""
                        }, "Review changes", 8, sr),
                        l("p", null, "Check what will happen when you apply this draft to " + _(a.title || "the catalog") + ".", 1)
                      ]),
                      g(t(Y), {
                        type: "button",
                        "aria-label": "Close review",
                        disabled: te.value,
                        text: "",
                        severity: "secondary",
                        onClick: Re
                      }, {
                        default: w(() => [
                          g(t(ne), {
                            icon: "tabler:x",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ]),
                    l("div", ir, [
                      l("h3", null, _(ue.value.class === "configuration" ? "Plugin configuration" : ma[ue.value.class] || "Catalog changes"), 1),
                      ue.value.class === "configuration" ? (e(), s("p", nr, "These settings will apply to the enabled plugins in this catalog.")) : ue.value.class === "unchanged" ? (e(), s("p", or, "The catalog already matches this draft.")) : ue.value.class === "initial" ? (e(), s("p", dr, "Product editors will use these settings for new products.")) : ue.value.class === "cosmetic" ? (e(), s("p", rr, "Catalog settings will update. Stored product values are kept.")) : ue.value.class === "additive" ? (e(), s("p", ur, "The new options become available. Existing product values are kept.")) : ue.value.class === "semantic" ? (e(), s("p", cr, "Applying changes can recalculate product values or release readiness across this catalog.")) : ue.value.class === "refused" ? (e(), P(t(je), {
                        key: 6,
                        severity: "error"
                      }, {
                        default: w(() => [
                          v[23] || (v[23] = K(" These changes can’t be applied. ", -1)),
                          ue.value.migration && ue.value.refused.some((S) => y.value?.attributes[S.code]) ? (e(), s("span", mr, " To change how a field stores values, add a new field and copy the existing values into it. Then remove the original field and give the new field its name. ")) : c("", !0)
                        ]),
                        _: 1
                      })) : c("", !0)
                    ]),
                    Tl.value.length || Bl.value.length ? (e(), s("ul", pr, [
                      (e(!0), s(H, null, ae(Tl.value, (S, le) => (e(), s("li", { key: le }, [
                        S.class === "refused" ? (e(), P(t(_e), {
                          key: 0,
                          class: "kx-tag-sm small",
                          severity: "danger"
                        }, {
                          default: w(() => [...v[24] || (v[24] = [
                            K("Blocked", -1)
                          ])]),
                          _: 1
                        })) : c("", !0),
                        S.code ? (e(), s("strong", vr, _(Ca(S.code)), 1)) : c("", !0),
                        l("span", null, _(xa(S.what)), 1)
                      ]))), 128)),
                      (e(!0), s(H, null, ae(Bl.value, (S) => (e(), s("li", {
                        key: S.subject + S.effect
                      }, [
                        l("strong", null, _(S.subject), 1),
                        l("span", null, _(S.effect), 1)
                      ]))), 128))
                    ])) : c("", !0),
                    Ml.value.length ? (e(), s("ul", fr, [
                      (e(!0), s(H, null, ae(Ml.value, (S) => (e(), s("li", {
                        key: S.id
                      }, [
                        l("strong", null, _(S.title), 1),
                        l("div", null, [
                          (e(!0), s(H, null, ae(S.fields, (le, oe) => (e(), s("p", { key: oe }, _(le), 1))), 128))
                        ])
                      ]))), 128))
                    ])) : c("", !0),
                    wl.value.length ? (e(), s("div", br, [
                      v[25] || (v[25] = l("h3", null, "Permanent changes", -1)),
                      (e(!0), s(H, null, ae(wl.value, (S) => (e(), s("p", { key: S }, _(S), 1))), 128)),
                      ue.value.class !== "refused" ? (e(), s("div", yr, [
                        g(t(Ha), {
                          modelValue: Qe.value,
                          "onUpdate:modelValue": v[13] || (v[13] = (S) => Qe.value = S),
                          "input-id": t(ul) + "-acknowledge",
                          binary: "",
                          disabled: te.value
                        }, null, 8, ["modelValue", "input-id", "disabled"]),
                        l("label", {
                          for: t(ul) + "-acknowledge"
                        }, "I understand the effects of these removals", 8, gr)
                      ])) : c("", !0)
                    ])) : c("", !0),
                    l("footer", hr, [
                      g(t(Y), {
                        type: "button",
                        label: "Back to editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: te.value,
                        onClick: Re
                      }, null, 8, ["disabled"]),
                      y.value?.access.admin && ue.value.class !== "refused" ? (e(), P(t(Y), {
                        key: 0,
                        disabled: !Ue.value || te.value || !Pl.value,
                        loading: te.value,
                        onClick: ja
                      }, {
                        default: w(() => [
                          K(_(k.value === "Form layout" ? "Apply layout" : "Apply changes"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled", "loading"])) : c("", !0)
                    ])
                  ], 8, ar)) : c("", !0)
                ]),
                _: 1
              }, 8, ["visible", "busy"])
            ])
          ], 8, qd)
        ])
      ])
    ], 2));
  }
}), _r = /* @__PURE__ */ pe({
  __name: "SettingsApp",
  setup(a) {
    const f = Ta(), i = qa(), n = W(), d = F(() => f.value.catalogId ?? ""), m = Ge();
    async function C() {
      const k = m.begin(), M = d.value;
      try {
        const B = await he.catalogSummary(M);
        m.current(k) && (n.value = B);
      } catch {
        m.current(k) && (n.value = void 0);
      }
    }
    be(d, () => {
      n.value = void 0, C();
    }), yl(C), Ye(() => {
      m.begin();
    });
    function p() {
      f.value.embedded ? i("open-catalog-picker", {}) : i("navigate", { route: "" });
    }
    return (k, M) => d.value ? (e(), P(kr, {
      key: d.value,
      "catalog-id": d.value,
      title: n.value?.title || "Catalog",
      catalog: n.value,
      embedded: t(f).embedded,
      "focus-back": t(f).focusBack,
      route: t(f).route,
      onNavigate: M[0] || (M[0] = (B) => t(i)("navigate", { route: B })),
      "back-label": t(f).embedded ? "Back to catalogs" : "Back to catalog settings",
      onBack: p,
      onDirtyChanged: M[1] || (M[1] = (B) => t(i)("dirty-change", { dirty: B }))
    }, null, 8, ["catalog-id", "title", "catalog", "embedded", "focus-back", "route", "back-label"])) : c("", !0);
  }
});
class wr extends Ia {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "catalog-id": { type: "string", default: "" }, embedded: { type: "boolean", default: !1 }, route: { type: "string" }, "focus-back": { type: "boolean", default: !1 } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: Da
    };
  }
  static get vueConfig() {
    return { rootComponent: _r, plugins: [Fa] };
  }
}
Ga(import.meta.url, wr);
