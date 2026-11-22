import { d as Ua, u as yl, r as al, e as Yl, h as ja, b as gl, p as be, c as Ge, a as xe, _ as bl, i as Sa, S as Aa, f as Oa, g as Ra, W as Ia, s as Pa, P as Ta } from "./styles-B-55fk58.js";
import { defineComponent as pe, computed as D, openBlock as e, createBlock as A, resolveDynamicComponent as Zl, normalizeProps as qa, guardReactiveProps as Fa, createSlots as Ce, withCtx as w, createElementVNode as l, normalizeClass as Oe, createElementBlock as i, Fragment as M, renderList as se, toDisplayString as y, createCommentVNode as u, unref as s, renderSlot as Ae, ref as Z, onUnmounted as il, createVNode as f, createStaticVNode as Da, createTextVNode as J, withModifiers as Le, normalizeStyle as xl, useId as Te, watch as ye, withKeys as rl, nextTick as Je, provide as Ql, inject as Hl, useModel as Xl, Transition as Na, mergeModels as Vl, toRaw as za, onMounted as ea, mergeProps as La } from "vue";
import { Icon as de } from "@iconify/vue";
import ke from "primevue/tag";
import Y from "primevue/button";
import Ba from "primevue/checkbox";
import Ue from "primevue/message";
import { api as Ma, on as la, host as ll, loadByTagName as Ea, define as Wa } from "@wippy-fe/proxy";
import Al from "primevue/selectbutton";
import tl from "primevue/inputtext";
import aa from "primevue/multiselect";
import ul from "primevue/toggleswitch";
import Ve from "primevue/select";
import Ha from "primevue/inputnumber";
import Ja from "primevue/textarea";
const Ka = ["aria-label"], Ga = {
  key: 0,
  class: "kx-settings-rail-group"
}, Ya = ["aria-current", "onClick"], Za = { class: "kx-settings-rail-label" }, Qa = /* @__PURE__ */ pe({
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
    const v = a, t = D(() => v.leadingItem ? [{ items: [v.leadingItem] }, ...v.groups] : v.groups);
    function n(d) {
      const r = [...d.currentTarget.querySelectorAll(".kx-settings-rail-item")], x = r.indexOf(d.target);
      if (x < 0) return;
      let g;
      switch (d.key) {
        case "ArrowDown":
        case "ArrowRight":
          g = (x + 1) % r.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          g = (x + r.length - 1) % r.length;
          break;
        case "Home":
          g = 0;
          break;
        case "End":
          g = r.length - 1;
          break;
        default:
          return;
      }
      d.preventDefault(), r[g]?.focus();
    }
    return (d, r) => (e(), A(Zl(a.title ? Ua : "div"), qa(Fa(a.title ? { title: a.title, count: a.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), Ce({
      default: w(() => [
        l("nav", {
          class: Oe(["kx-settings-rail", { "kx-settings-rail-framed": a.title }]),
          "aria-label": a.label,
          onKeydown: n
        }, [
          (e(!0), i(M, null, se(t.value, (x, g) => (e(), i("div", {
            key: x.items[0]?.value ?? g,
            class: Oe(["kx-settings-rail-section", { "kx-settings-rail-leading": a.leadingItem && g === 0 }])
          }, [
            x.heading ? (e(), i("div", Ga, y(x.heading), 1)) : u("", !0),
            (e(!0), i(M, null, se(x.items, (b) => (e(), i("button", {
              key: b.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": b.value === a.value ? "true" : void 0,
              onClick: (T) => d.$emit("update:value", b.value)
            }, [
              b.icon ? (e(), A(s(de), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: b.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : u("", !0),
              l("span", Za, y(b.label), 1)
            ], 8, Ya))), 128))
          ], 2))), 128))
        ], 42, Ka)
      ]),
      _: 2
    }, [
      a.title && d.$slots.actions ? {
        name: "actions",
        fn: w(() => [
          Ae(d.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Xa = { class: "pim-stack" }, et = { class: "form pim-access-card pim-ia-action" }, lt = { class: "pim-access-summary" }, at = ["config"], tt = /* @__PURE__ */ pe({
  __name: "CatalogShare",
  props: {
    catalogId: {},
    title: {},
    access: {}
  },
  setup(a) {
    const v = a, t = Z(!1), n = Z(!1), d = Z(""), r = Z(), x = Z(!1), g = al(), b = D(() => "/api/v1/component-access/grants/" + encodeURIComponent(v.catalogId)), T = D(() => JSON.stringify({
      resource_id: v.catalogId,
      title: v.title,
      access_url: b.value,
      share_url: "/api/v1/component-access/share/" + encodeURIComponent(v.catalogId)
    })), O = D(() => {
      if (!v.access.admin) return "Only catalog administrators can manage sharing.";
      if (!r.value) return x.value ? "Member counts are unavailable." : "Loading members…";
      const { people: N, groups: _ } = r.value;
      return N + (N === 1 ? " person" : " people") + " and " + _ + (_ === 1 ? " group" : " groups") + " with direct access";
    });
    async function B() {
      if (!v.access.admin) return;
      const N = g.begin();
      x.value = !1;
      try {
        const { data: _ } = await Ma.get(b.value);
        if (!g.current(N)) return;
        if (!_?.success || !Array.isArray(_.access)) throw new Error("Grants unavailable");
        const C = _.access.filter((c) => c.subject_type === "group").length;
        r.value = { people: _.access.length - C, groups: C };
      } catch {
        g.current(N) && (r.value = void 0, x.value = !0);
      }
    }
    yl(B), il(() => {
      g.begin();
    });
    async function ee() {
      n.value = !0, d.value = "", await Yl("kickside-share") ? t.value = !0 : d.value = "Could not open sharing. Try again.", n.value = !1;
    }
    return (N, _) => (e(), i("div", Xa, [
      l("section", et, [
        l("div", null, [
          _[1] || (_[1] = l("h3", null, "Members and sharing", -1)),
          l("p", lt, y(O.value), 1)
        ]),
        a.access.admin ? (e(), A(s(Y), {
          key: 0,
          type: "button",
          label: "Share catalog",
          loading: n.value,
          onClick: ee
        }, {
          icon: w(() => [
            f(s(de), {
              icon: "tabler:share",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : u("", !0),
        x.value ? (e(), A(s(Y), {
          key: 1,
          type: "button",
          label: "Reload member counts",
          severity: "secondary",
          text: "",
          onClick: B
        })) : u("", !0)
      ]),
      _[2] || (_[2] = Da('<section class="form pim-access-card pim-stack" aria-labelledby="pim-access-roles-heading"><h3 id="pim-access-roles-heading">What members can do</h3><dl class="pim-access-roles"><div><dt>Read</dt><dd>View products and their details.</dd></div><div><dt>Write</dt><dd>Create products and update their values.</dd></div><div><dt>Delete</dt><dd>Move products to trash.</dd></div><div><dt>Admin</dt><dd>Manage catalog settings and who has access.</dd></div></dl></section>', 1)),
      t.value ? (e(), i("kickside-share", {
        key: 0,
        config: T.value,
        onClose: _[0] || (_[0] = (C) => t.value = !1),
        onChanged: B
      }, null, 40, at)) : u("", !0),
      d.value ? (e(), A(s(Ue), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: w(() => [
          J(y(d.value), 1)
        ]),
        _: 1
      })) : u("", !0)
    ]));
  }
});
function st(a, v, t = {}) {
  const n = JSON.stringify(a), d = JSON.stringify(t);
  return {
    declaration: JSON.parse(n),
    generation: v,
    pluginConfigs: JSON.parse(d),
    matches: (r, x, g = {}) => v === x && n === JSON.stringify(r) && d === JSON.stringify(g)
  };
}
function Jl(a, v) {
  const t = {};
  for (const [n, d] of Object.entries(v)) {
    const r = d.filter((x) => n === "plugins" ? !a.plugins?.some((g) => g.use === x) : n === "scopes" ? !a.scopes?.includes(x) : n === "attributes" ? !a.aspects?.some((g) => g.attributes?.some((b) => g.namespace + "." + b.code === x)) : n === "aspects" ? !a.aspects?.some((g) => g.namespace === x) : n === "dimensions" ? !a.dimensions?.some((g) => g.name === x) : n === "vocabularies" || n === "families" ? !a[n]?.some((g) => g.code === x) : !a[n]?.some((g) => g.id === x));
    r.length && (t[n] = r);
  }
  return t;
}
const Kl = (a) => !!a && typeof a == "object" && !Array.isArray(a), me = ["string"], ta = { "*": "string" }, it = { id: "number", code: "string!", type: "string!", scope: me, cardinality: "string", index: "string", index_contexts: [ta], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, nt = {
  dimensions: [{ name: "string!", members: me, fallback: { "*": me } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: me }, attributes: [it] }],
  families: [{ code: "string!", aspects: me, variation: [{ axes: me, own: me }], requirements: [{ id: "string!", context: ta, require: me, authored: me }], checks: [{ check: "string!", reads: me, cost: "string", config: "object", enforce: "string" }] }],
  sources: [{ id: "string!", ordering: "string", writes: me, principals: me, audit: "boolean" }],
  channels: [{ id: "string!", requirements: me, families: me }],
  plugins: [{ use: "string!", schema: "json" }],
  scopes: me,
  policy: { "*": "policy" },
  remove: { dimensions: me, vocabularies: me, aspects: me, families: me, sources: me, channels: me, attributes: me, scopes: me, plugins: me }
};
function Ul(a, v, t) {
  if (typeof v == "string") {
    const n = v.replace("!", "");
    if (!(n === "json" || (n === "object" ? Kl(a) : n === "policy" ? a === !1 || typeof a == "string" || typeof a == "number" : typeof a === n)) || v.endsWith("!") && (typeof a != "string" || !a.trim())) throw new Error(`${t} has an invalid ${n} value.`);
  } else if (Array.isArray(v)) {
    if (!Array.isArray(a)) throw new Error(`${t} must be an array.`);
    a.forEach((n, d) => Ul(n, v[0], `${t}[${d}]`));
  } else {
    if (!Kl(a)) throw new Error(`${t} must be an object.`);
    for (const [n, d] of Object.entries(v)) if (typeof d == "string" && d.endsWith("!") && a[n] === void 0) throw new Error(`${t}.${n} is required.`);
    for (const [n, d] of Object.entries(a)) {
      const r = v[n] ?? v["*"];
      if (!r) throw new Error(`${t}.${n} is not an editor field.`);
      Ul(d, r, `${t}.${n}`);
    }
  }
}
function ot(a) {
  const v = JSON.parse(a);
  Ul(v, nt, "Declaration");
  const t = v;
  for (const n of t.dimensions ?? []) n.members ??= [];
  return t;
}
function el(a) {
  return JSON.parse(JSON.stringify(a));
}
const Gl = /^[a-z][a-z0-9_]*$/;
function dt(a) {
  return a.trim().normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function Ke(a, v, t) {
  t.length ? a[v] = t : delete a[v];
}
function vl(a, v, t) {
  if (t < 0 || t >= a.length || v === t) return;
  const [n] = a.splice(v, 1);
  a.splice(t, 0, n);
}
function ce(a, v) {
  return !a || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(a) ? v : a;
}
function dl(a) {
  return a ? ce(a.title, "Field type") : "Unknown type";
}
async function sa(a, v) {
  const t = [...new Set(v)].map((d) => ({ type: "user", id: d }));
  if (!t.length) return {};
  const n = await ja(`/api/v1/pim-admin/catalogs/${encodeURIComponent(a)}/principal_labels`, { refs: t }, "People");
  return Object.fromEntries((n.principals ?? []).map((d) => [d.id, ce(d.label, "Person")]));
}
const fl = [
  { value: "quarter", label: "¼", span: 3 },
  { value: "third", label: "⅓", span: 4 },
  { value: "half", label: "½", span: 6 },
  { value: "full", label: "1", span: 12 }
];
function jl(a, v, t) {
  return t.width ?? a.attributes[v + "." + t.code]?.width ?? "half";
}
const rt = (a) => new Date(a).toLocaleString();
function Sl(a) {
  const v = Math.abs(a.m).toString(), t = a.m < 0 ? "-" : "";
  if (a.e >= 0) return t + v + "0".repeat(a.e);
  const n = -a.e, d = v.padStart(n + 1, "0");
  return t + d.slice(0, d.length - n) + "." + d.slice(d.length - n);
}
function E(a) {
  const t = (a.includes(".") ? a.slice(a.indexOf(".") + 1) : a).replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : a;
}
function sl(a, v) {
  const t = a.properties;
  return ce(t?.[v]?.title, ce(E(v), "This setting"));
}
function He(a) {
  return a.labels.en ?? Object.values(a.labels)[0] ?? a.code;
}
function ia(a) {
  const v = /* @__PURE__ */ new Map();
  for (const t of a ?? [])
    if (t.code !== "generic")
      for (const n of t.aspects ?? []) {
        const d = v.get(n) ?? [];
        d.push(E(t.code)), v.set(n, d);
      }
  return new Map([...v].map(([t, n]) => [t, "Used by " + n.join(", ")]));
}
function cl(a, v) {
  if (a == null) return "";
  const t = (n) => {
    if (n == null) return "";
    if (typeof n == "object" && "ref" in n) {
      const d = n;
      if (d.ref[0] === "term") {
        const r = d.ref[1].slice(d.ref[1].indexOf(":") + 1), x = d.ref[1].slice(0, d.ref[1].indexOf(":")), g = v?.[x]?.find((b) => b.code === r);
        return g ? He(g) : r;
      }
      return "Linked " + E(d.ref[0]).toLocaleLowerCase();
    }
    if (typeof n == "object" && "v" in n) {
      const d = n;
      return Sl(d.v) + " " + d.u;
    }
    return typeof n == "object" && "m" in n ? Sl(n) : typeof n == "boolean" ? n ? "Yes" : "No" : typeof n == "object" ? JSON.stringify(n) : ce(String(n), "Linked record");
  };
  return Array.isArray(a) ? a.map(t).join(", ") : t(a);
}
function ut(a, v, t) {
  const n = cl(v), d = cl(t);
  return !d && n ? `${a} cleared (was ${n})` : n ? `${a}: ${n} → ${d}` : `${a} set to ${d}`;
}
const ct = { class: "pim-table form pim-layout" }, mt = {
  key: 0,
  class: "pim-layout-help muted"
}, pt = {
  key: 1,
  class: "kx-empty"
}, vt = { class: "pim-aspect-head pim-list-header" }, ft = { class: "muted small" }, bt = ["draggable", "onDragstart", "onDragover", "onDrop"], yt = { class: "pim-lcard-top" }, gt = {
  key: 0,
  class: "pim-grip",
  "aria-hidden": "true"
}, ht = { class: "pim-lcard-name" }, kt = { class: "pim-lcard-type" }, _t = {
  key: 1,
  class: "pim-lcard-move"
}, wt = { class: "pim-aspect-head" }, $t = { class: "muted small" }, Ct = { class: "pim-canvas" }, xt = { class: "pim-lcard-top" }, Vt = { class: "pim-lcard-name" }, Ut = { class: "pim-lcard-type" }, jt = /* @__PURE__ */ pe({
  __name: "LayoutEditor",
  props: {
    draft: {},
    schema: {},
    types: {}
  },
  emits: ["families"],
  setup(a, { emit: v }) {
    const t = a, n = v, d = D(() => t.schema.access.admin), r = D(() => t.draft?.aspects ?? []), x = D(() => new Map(t.types.map((c) => [c.id, dl(c)]))), g = D(() => ia(t.draft.families)), b = D(() => {
      if (!t.schema) return [];
      const c = new Set((t.draft?.aspects ?? []).map((K) => K.namespace)), q = /* @__PURE__ */ new Map();
      for (const [K, W] of Object.entries(t.schema.attributes)) {
        const H = K.split(".")[0];
        c.has(H) || !W.plugin || (q.has(H) || q.set(H, { aspect: H, plugin: W.plugin, codes: [] }), q.get(H).codes.push(K));
      }
      return [...q.values()];
    });
    function T(c, q) {
      return fl.find((K) => K.value === jl(t.schema, c, q))?.span ?? 6;
    }
    const O = Z(null), B = Z(null);
    function ee(c, q, K) {
      d.value && (O.value = { ns: c, index: q }, K.dataTransfer?.setData("text/plain", c + ":" + q), K.dataTransfer && (K.dataTransfer.effectAllowed = "move"));
    }
    function N(c, q, K) {
      !O.value || O.value.ns !== c || (K.preventDefault(), B.value = { ns: c, index: q });
    }
    function _(c, q) {
      d.value && O.value?.ns === c.namespace && vl(c.attributes ?? [], O.value.index, q), O.value = null, B.value = null;
    }
    function C() {
      O.value = null, B.value = null;
    }
    return (c, q) => (e(), i("div", ct, [
      d.value ? (e(), i("p", mt, "Arrange fields within each group and choose their widths. Review changes before applying the layout.")) : u("", !0),
      r.value.length === 0 ? (e(), i("div", pt, [
        q[2] || (q[2] = J("This catalog has no field groups yet.", -1)),
        d.value ? (e(), i(M, { key: 0 }, [
          J(" Add a field group in Fields.")
        ], 64)) : u("", !0)
      ])) : u("", !0),
      (e(!0), i(M, null, se(r.value, (K) => (e(), i("section", {
        key: K.namespace,
        class: "pim-aspect"
      }, [
        l("header", vt, [
          l("div", null, [
            l("h3", null, y(s(E)(K.namespace)), 1),
            l("p", ft, y(g.value.get(K.namespace) ?? "No named family uses this group yet."), 1)
          ]),
          d.value && !g.value.has(K.namespace) ? (e(), A(s(Y), {
            key: 0,
            label: "Open families",
            type: "button",
            text: "",
            size: "small",
            onClick: q[0] || (q[0] = (W) => n("families"))
          })) : u("", !0)
        ]),
        l("div", {
          class: "pim-canvas",
          onDragover: q[1] || (q[1] = Le(() => {
          }, ["prevent"]))
        }, [
          (e(!0), i(M, null, se(K.attributes ?? [], (W, H) => (e(), i("div", {
            key: W.code,
            class: Oe(["pim-lcard", { dragging: O.value?.ns === K.namespace && O.value?.index === H, over: B.value?.ns === K.namespace && B.value?.index === H }]),
            style: xl({ gridColumn: "span " + T(K.namespace, W) }),
            draggable: d.value,
            onDragstart: (te) => ee(K.namespace, H, te),
            onDragover: (te) => N(K.namespace, H, te),
            onDrop: Le((te) => _(K, H), ["prevent"]),
            onDragend: C
          }, [
            l("div", yt, [
              d.value ? (e(), i("span", gt, [
                f(s(de), { icon: "tabler:grip-vertical" })
              ])) : u("", !0),
              l("span", ht, y(s(E)(W.code)), 1),
              l("span", kt, y(x.value.get(W.type) ?? s(dl)(void 0)), 1),
              d.value ? (e(), i("span", _t, [
                f(s(Y), {
                  type: "button",
                  disabled: H === 0,
                  "aria-label": "Move " + s(E)(W.code) + " earlier",
                  onClick: (te) => s(vl)(K.attributes ?? [], H, H - 1),
                  class: "kx-iconbtn sm",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    f(s(de), { icon: "tabler:arrow-left" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                f(s(Y), {
                  type: "button",
                  disabled: H === (K.attributes ?? []).length - 1,
                  "aria-label": "Move " + s(E)(W.code) + " later",
                  onClick: (te) => s(vl)(K.attributes ?? [], H, H + 1),
                  class: "kx-iconbtn sm",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    f(s(de), { icon: "tabler:arrow-right" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ])) : u("", !0)
            ]),
            f(s(Al), {
              disabled: !d.value,
              "model-value": s(jl)(a.schema, K.namespace, W),
              options: s(fl),
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Width of " + s(E)(W.code),
              "onUpdate:modelValue": (te) => W.width = te
            }, null, 8, ["disabled", "model-value", "options", "aria-label", "onUpdate:modelValue"])
          ], 46, bt))), 128))
        ], 32)
      ]))), 128)),
      (e(!0), i(M, null, se(b.value, (K) => (e(), i("section", {
        key: K.aspect,
        class: "pim-aspect"
      }, [
        l("header", wt, [
          l("div", null, [
            l("h3", null, y(s(E)(K.aspect)), 1),
            l("p", $t, y(g.value.get(K.aspect) ?? "No named family uses this group yet."), 1)
          ]),
          q[3] || (q[3] = l("span", { class: "muted small" }, "Provided by a plugin", -1))
        ]),
        l("div", Ct, [
          (e(!0), i(M, null, se(K.codes, (W) => (e(), i("div", {
            key: W,
            class: "pim-lcard fixed",
            style: xl({ gridColumn: "span " + (s(fl).find((H) => H.value === a.schema.attributes[W].width)?.span ?? 6) })
          }, [
            l("div", xt, [
              l("span", Vt, y(s(E)(W)), 1),
              l("span", Ut, y(x.value.get(a.schema.attributes[W].type) ?? s(dl)(void 0)), 1)
            ])
          ], 4))), 128))
        ])
      ]))), 128))
    ]));
  }
}), St = {
  class: "pim-history",
  "aria-label": "Catalog history"
}, At = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Ot = { class: "pim-table pim-responsive-table" }, Rt = ["id"], It = ["aria-labelledby"], Pt = {
  key: 0,
  scope: "col"
}, Tt = { class: "muted small" }, qt = ["datetime"], Ft = {
  key: 0,
  class: "small"
}, Dt = {
  key: 0,
  class: "muted"
}, Nt = { class: "mono small" }, zt = {
  key: 0,
  class: "muted"
}, Lt = {
  key: 0,
  class: "muted small"
}, Bt = ["aria-labelledby"], Mt = { class: "pim-stacked-meta muted small" }, Et = { key: 0 }, Wt = { key: 1 }, Ht = ["datetime"], Jt = {
  key: 1,
  class: "kx-empty"
}, Kt = { class: "pim-table-foot" }, Gt = /* @__PURE__ */ pe({
  __name: "HistoryPanel",
  props: {
    catalogId: {},
    canResolveActors: { type: Boolean }
  },
  setup(a) {
    const v = a, t = Z([]), n = Z({}), d = Z(), r = Z(!1), x = Z(), g = al(), b = Te(), T = D(() => t.value.map((_) => ({
      key: `${_.seq}:${_.n}`,
      at: _.at,
      date: rt(_.at),
      actor: n.value[_.actor] ?? ce(_.actor, "Person"),
      source: _.source ? ce(E(_.source), "Data source") : "",
      product: B(_),
      context: _.ctx ? ce(_.ctx, "Product context") : "",
      change: ee(_)
    })));
    async function O(_ = !1) {
      const C = g.begin();
      r.value = !0, x.value = void 0;
      try {
        const c = await be.history(v.catalogId, { limit: 50, before: _ ? d.value : void 0 });
        if (!g.current(C)) return;
        if (t.value = _ ? [...t.value, ...c.entries] : c.entries, d.value = c.next, v.canResolveActors)
          try {
            const q = await sa(v.catalogId, c.entries.map((K) => K.actor));
            g.current(C) && (n.value = { ...n.value, ...q });
          } catch {
          }
      } catch (c) {
        if (!g.current(C)) return;
        x.value = Ge(c, "Could not load the history.");
      } finally {
        g.current(C) && (r.value = !1);
      }
    }
    function B(_) {
      return _.sku ? _.sku : _.subject.startsWith("p:") ? "purged product" : _.subject.startsWith("t:") ? _.subject.slice(2) : _.subject.startsWith("r:") ? "Release" : ce(_.subject, "Catalog");
    }
    function ee(_) {
      if (_.attribute)
        return ut(E(_.attribute), _.before, _.after);
      switch (_.kind) {
        case "schema":
          return "Catalog settings applied";
        case "term": {
          const C = _.after ?? {}, c = C.labels?.en ?? Object.values(C.labels ?? {})[0];
          return C.retired ? "Term retired" : c ? `Term labelled "${c}"` + (C.parent ? ` under ${C.parent}` : "") : "Term changed";
        }
        case "created": {
          const C = _.after ?? {};
          return `Created as ${E(C.family ?? "product")}` + (C.level ? ` at level ${C.level}` : "");
        }
        case "released": {
          const C = _.after ?? {};
          return `Released v${C.version ?? ""} to ${(C.channels ?? []).join(", ")}`;
        }
        case "withdrawn":
          return `Withdrawn from ${((_.after ?? {}).channels ?? []).join(", ")}`;
        case "status":
          return `Status ${String(_.before ?? "")} → ${String(_.after ?? "")}`;
        case "moved":
          return "Moved under another parent";
        default:
          return E(_.kind);
      }
    }
    let N = () => {
    };
    return ye(() => v.catalogId, () => {
      N(), g.begin(), t.value = [], n.value = {}, d.value = void 0, x.value = void 0, N = la(`component.${v.catalogId}`, () => {
        O();
      });
    }, { immediate: !0 }), ye(() => v.catalogId, () => {
      O();
    }), yl(() => O()), il(() => {
      N(), g.begin();
    }), (_, C) => (e(), i("section", St, [
      x.value ? (e(), A(gl, {
        key: 0,
        error: x.value
      }, {
        default: w(() => [
          f(s(Y), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: C[0] || (C[0] = (c) => O())
          }, {
            default: w(() => [...C[2] || (C[2] = [
              J("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : u("", !0),
      r.value ? (e(), i("div", At, "Loading history…")) : u("", !0),
      l("div", Ot, [
        l("p", {
          id: s(b),
          class: "pim-history-caption muted small"
        }, "Catalog changes, newest first", 8, Rt),
        T.value.length ? (e(), i(M, { key: 0 }, [
          l("table", {
            class: "pim-grid",
            "aria-labelledby": s(b)
          }, [
            l("thead", null, [
              l("tr", null, [
                C[3] || (C[3] = l("th", { scope: "col" }, "When", -1)),
                a.canResolveActors ? (e(), i("th", Pt, "Who")) : u("", !0),
                C[4] || (C[4] = l("th", { scope: "col" }, "What", -1)),
                C[5] || (C[5] = l("th", { scope: "col" }, "Change", -1))
              ])
            ]),
            l("tbody", null, [
              (e(!0), i(M, null, se(T.value, (c) => (e(), i("tr", {
                key: c.key
              }, [
                l("td", Tt, [
                  l("time", {
                    datetime: c.at
                  }, y(c.date), 9, qt)
                ]),
                a.canResolveActors ? (e(), i("td", Ft, [
                  J(y(c.actor), 1),
                  c.source ? (e(), i("span", Dt, " via " + y(c.source), 1)) : u("", !0)
                ])) : u("", !0),
                l("td", Nt, [
                  J(y(c.product), 1),
                  c.context ? (e(), i("span", zt, " · " + y(c.context), 1)) : u("", !0)
                ]),
                l("td", null, [
                  J(y(c.change), 1),
                  !a.canResolveActors && c.source ? (e(), i("span", Lt, " via " + y(c.source), 1)) : u("", !0)
                ])
              ]))), 128))
            ])
          ], 8, It),
          l("ol", {
            role: "list",
            class: "pim-stacked-list",
            "aria-labelledby": s(b)
          }, [
            (e(!0), i(M, null, se(T.value, (c) => (e(), i("li", {
              key: c.key,
              class: "pim-stacked-row"
            }, [
              l("div", null, y(c.change), 1),
              l("div", Mt, [
                a.canResolveActors ? (e(), i("span", Et, [
                  l("span", null, y(c.actor), 1),
                  c.source ? (e(), i(M, { key: 0 }, [
                    J(" via " + y(c.source), 1)
                  ], 64)) : u("", !0)
                ])) : c.source ? (e(), i("span", Wt, "Via " + y(c.source), 1)) : u("", !0),
                l("time", {
                  datetime: c.at
                }, y(c.date), 9, Ht),
                l("span", null, [
                  J(y(c.product), 1),
                  c.context ? (e(), i(M, { key: 0 }, [
                    J(" · " + y(c.context), 1)
                  ], 64)) : u("", !0)
                ])
              ])
            ]))), 128))
          ], 8, Bt)
        ], 64)) : !r.value && !x.value ? (e(), i("div", Jt, "Nothing recorded yet.")) : u("", !0),
        l("div", Kt, [
          l("span", null, y(T.value.length) + " change" + y(T.value.length === 1 ? "" : "s") + " shown", 1),
          d.value ? (e(), A(s(Y), {
            key: 0,
            type: "button",
            disabled: r.value,
            onClick: C[1] || (C[1] = (c) => O(!0)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: w(() => [
              f(s(de), {
                icon: "tabler:adjustments",
                "aria-hidden": "true"
              }),
              C[6] || (C[6] = J(" Load older", -1))
            ]),
            _: 1
          }, 8, ["disabled"])) : u("", !0)
        ])
      ])
    ]));
  }
}), Yt = { class: "system-section-head" }, Zt = { class: "system-section-head-text" }, Qt = {
  key: 0,
  class: "kx-head-actions"
}, Xt = /* @__PURE__ */ pe({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(a) {
    return (v, t) => (e(), i("header", Yt, [
      l("div", Zt, [
        l("h1", null, y(a.title), 1),
        l("p", null, y(a.description), 1)
      ]),
      v.$slots.actions ? (e(), i("div", Qt, [
        Ae(v.$slots, "actions")
      ])) : u("", !0)
    ]));
  }
}), es = /* @__PURE__ */ pe({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(a) {
    return (v, t) => (e(), i(M, null, [
      f(s(ke), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      f(s(Y), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: a.busy || a.discardDisabled,
        onClick: t[0] || (t[0] = (n) => v.$emit("discard"))
      }, {
        icon: w(() => [
          f(s(de), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      f(s(Y), {
        label: "Review changes",
        type: "button",
        disabled: a.busy || a.reviewDisabled,
        loading: a.busy,
        onClick: t[1] || (t[1] = (n) => v.$emit("review", n.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), ls = ["onKeydown"], as = { class: "row pim-add-actions" }, ts = ["id"], Be = /* @__PURE__ */ pe({
  __name: "AddSchemaCode",
  props: {
    label: {},
    action: {},
    existing: {},
    fromName: { type: Boolean },
    regular: { type: Boolean }
  },
  emits: ["add"],
  setup(a, { emit: v }) {
    const t = a, n = v, d = Z(""), r = Z(!1), x = Z(), g = Te(), b = D(() => {
      const _ = d.value.trim();
      return t.fromName ? dt(_) : _;
    }), T = D(() => d.value.trim() ? t.existing?.includes(b.value) ? t.fromName ? "This name is already in use." : "This code is already in use." : t.fromName && !Gl.test(b.value) ? "Use a name that starts with a letter from A to Z." : Gl.test(b.value) ? "" : "Start with a lowercase letter and use only lowercase letters, numbers or underscores." : ""), O = D(() => !!b.value && !T.value);
    async function B() {
      r.value = !0, await Je(), x.value?.querySelector("input")?.focus();
    }
    async function ee() {
      r.value = !1, d.value = "", await Je(), x.value?.querySelector("button")?.focus();
    }
    function N() {
      O.value && (n("add", b.value), ee());
    }
    return (_, C) => (e(), i("div", {
      ref_key: "row",
      ref: x,
      class: "row pim-add-row"
    }, [
      r.value ? (e(), i("div", {
        key: 1,
        class: "row pim-add-editor",
        onKeydown: rl(Le(ee, ["stop", "prevent"]), ["esc"])
      }, [
        f(s(tl), {
          modelValue: d.value,
          "onUpdate:modelValue": C[0] || (C[0] = (c) => d.value = c),
          type: "text",
          placeholder: a.label,
          "aria-label": a.label,
          invalid: !!T.value,
          "aria-describedby": T.value ? s(g) : void 0,
          class: Oe({ mono: !a.fromName }),
          onKeydown: rl(Le(N, ["prevent"]), ["enter"])
        }, null, 8, ["modelValue", "placeholder", "aria-label", "invalid", "aria-describedby", "class", "onKeydown"]),
        l("div", as, [
          f(s(Y), {
            type: "button",
            disabled: !O.value,
            onClick: N
          }, {
            default: w(() => [
              J(y(a.action), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          f(s(Y), {
            type: "button",
            label: "Cancel",
            outlined: "",
            severity: "secondary",
            onClick: ee
          })
        ]),
        T.value ? (e(), i("p", {
          key: 0,
          id: s(g),
          role: "status",
          class: "pim-add-code-error small"
        }, y(T.value), 9, ts)) : u("", !0)
      ], 40, ls)) : (e(), A(s(Y), {
        key: 0,
        type: "button",
        "aria-expanded": "false",
        severity: "secondary",
        outlined: "",
        size: a.regular ? void 0 : "small",
        onClick: B
      }, {
        default: w(() => [
          f(s(de), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          J(" " + y(a.action), 1)
        ]),
        _: 1
      }, 8, ["size"])),
      Ae(_.$slots, "default")
    ], 512));
  }
}), na = Symbol("definitionColumns"), ss = { code: "Code", kind: "Kind", details: "Details", usage: "Used by" }, is = {
  code: "minmax(120px, 1fr)",
  kind: "140px",
  details: "minmax(120px, 1.2fr)",
  usage: "120px"
}, ns = {
  class: "pim-definition-scroll",
  tabindex: "0",
  "aria-label": "Definitions"
}, os = { class: "pim-definition-grid" }, ds = {
  key: 0,
  class: "pim-definition-columns",
  "aria-hidden": "true"
}, rs = { class: "pim-definition-actions-heading" }, Me = /* @__PURE__ */ pe({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: { default: () => ["code"] },
    showActions: { type: Boolean }
  },
  setup(a) {
    const v = a;
    Ql(na, D(() => v.columns));
    const t = D(() => ["48px", "minmax(160px, 1.4fr)", ...v.columns.map((n) => is[n]), v.showActions ? "100px" : "80px"].join(" "));
    return (n, d) => (e(), i("section", {
      class: "form pim-definition-list",
      style: xl({ "--pim-definition-columns": t.value })
    }, [
      Ae(n.$slots, "head"),
      l("div", ns, [
        l("div", os, [
          a.count > 3 ? (e(), i("div", ds, [
            d[0] || (d[0] = l("span", null, null, -1)),
            d[1] || (d[1] = l("span", null, "Name", -1)),
            (e(!0), i(M, null, se(a.columns, (r) => (e(), i("span", {
              key: r,
              class: Oe("pim-definition-" + r)
            }, y(s(ss)[r]), 3))), 128)),
            l("span", rs, y(a.showActions ? "Actions" : ""), 1)
          ])) : u("", !0),
          Ae(n.$slots, "default")
        ])
      ]),
      Ae(n.$slots, "add")
    ], 4));
  }
}), us = ["aria-label"], cs = /* @__PURE__ */ pe({
  __name: "InteractiveSurface",
  props: {
    label: {}
  },
  setup(a) {
    return (v, t) => (e(), i("button", {
      type: "button",
      class: "pim-interactive",
      "aria-label": a.label
    }, [
      Ae(v.$slots, "default")
    ], 8, us));
  }
}), oa = Symbol("section row"), ms = { class: "pim-definition" }, ps = {
  class: "pim-definition-lead",
  "data-column": "lead"
}, vs = {
  class: "pim-row-title",
  "data-column": "name"
}, fs = { class: "pim-definition-meta" }, bs = ["data-column"], ys = {
  key: 0,
  class: "mono"
}, gs = {
  class: "pim-definition-actions",
  "data-column": "actions"
}, hs = ["id"], Ee = /* @__PURE__ */ pe({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ Vl({
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
    const v = a, t = Hl(na, D(() => [
      ...v.code ? ["code"] : [],
      ...v.kind ? ["kind"] : []
    ])), n = Xl(a, "open"), d = Te(), r = Hl(oa, void 0);
    function x(b) {
      return !!v.routeSection && !!v.routeId && b === v.routeSection + "/" + v.routeId;
    }
    ye(() => r?.selected.value, (b, T) => {
      x(b) ? n.value = !0 : x(T) && (n.value = !1);
    }, { immediate: !0 });
    function g() {
      const b = !n.value;
      n.value = b, v.routeSection && v.routeId && r?.choose(v.routeSection, v.routeId, b);
    }
    return (b, T) => (e(), i("section", ms, [
      l("header", {
        class: Oe(["pim-definition-head", a.headClass])
      }, [
        f(cs, {
          class: Oe(["pim-definition-toggle", a.toggleClass]),
          "aria-expanded": n.value,
          "aria-controls": n.value ? s(d) : void 0,
          onClick: g
        }, {
          default: w(() => [
            l("span", ps, [
              f(s(de), {
                icon: "tabler:chevron-right",
                class: "pim-definition-chevron",
                "aria-hidden": "true"
              })
            ]),
            l("span", vs, y(a.title), 1),
            l("span", fs, [
              (e(!0), i(M, null, se(s(t), (O) => (e(), i("span", {
                key: O,
                class: Oe("pim-definition-" + O),
                "data-column": O
              }, [
                O === "code" && a.code ? (e(), i("code", ys, y(a.code), 1)) : O === "kind" && a.kind ? (e(), A(s(ke), {
                  key: 1,
                  severity: "secondary",
                  value: a.kind
                }, null, 8, ["value"])) : O === "details" ? Ae(b.$slots, "details", {}, void 0, void 0, 2) : O === "usage" ? Ae(b.$slots, "usage", {}, () => [
                  J(y(a.usage), 1)
                ], void 0, 3) : u("", !0)
              ], 10, bs))), 128))
            ])
          ]),
          _: 3
        }, 8, ["class", "aria-expanded", "aria-controls"]),
        l("div", gs, [
          Ae(b.$slots, "actions")
        ])
      ], 2),
      f(Na, { name: "pim-expand" }, {
        default: w(() => [
          n.value ? (e(), i("div", {
            key: 0,
            id: s(d),
            class: "pim-definition-body"
          }, [
            Ae(b.$slots, "default")
          ], 8, hs)) : u("", !0)
        ]),
        _: 3
      })
    ]));
  }
}), ks = { class: "pim-chips pim-picker-chips" }, _s = {
  key: 0,
  class: "muted"
}, ws = {
  key: 0,
  class: "muted small"
}, $s = {
  key: 0,
  class: "muted"
}, Cs = {
  key: 0,
  class: "muted"
}, Pe = /* @__PURE__ */ pe({
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
  setup(a, { emit: v }) {
    const t = a, n = v, d = Z("");
    function r(B) {
      return t.modelValue.includes(B);
    }
    function x(B) {
      t.disabled || !B || n("update:modelValue", r(B) ? t.modelValue.filter((ee) => ee !== B) : [...t.modelValue, B]);
    }
    function g() {
      const B = d.value.trim();
      if (!B || r(B)) {
        d.value = "";
        return;
      }
      n("update:modelValue", [...t.modelValue, B]), d.value = "";
    }
    function b(B) {
      n("update:modelValue", t.modelValue.filter((ee) => ee !== B));
    }
    const T = D(() => t.modelValue.map((B) => t.options?.find((ee) => ee.value === B) ?? { value: B }));
    function O(B) {
      const ee = B.label ?? B.value;
      return B.detail ? ee + " " + B.detail : ee;
    }
    return (B, ee) => (e(), i("div", ks, [
      a.disabled ? (e(), i(M, { key: 0 }, [
        (e(!0), i(M, null, se(T.value, (N) => (e(), i("span", {
          key: N.value
        }, [
          J(y(N.label ?? N.value) + " ", 1),
          N.detail ? (e(), i("small", _s, y(N.detail), 1)) : u("", !0)
        ]))), 128)),
        a.modelValue.length ? u("", !0) : (e(), i("span", ws, "None"))
      ], 64)) : a.options && (a.dropdown || a.options.length > 10) ? (e(), i(M, { key: 1 }, [
        (e(!0), i(M, null, se(T.value, (N) => (e(), i("span", {
          key: N.value,
          class: "row"
        }, [
          l("span", null, [
            J(y(N.label ?? N.value) + " ", 1),
            N.detail ? (e(), i("small", $s, y(N.detail), 1)) : u("", !0)
          ]),
          f(s(Y), {
            type: "button",
            "aria-label": "Remove " + O(N),
            onClick: (_) => b(N.value),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: w(() => [
              f(s(de), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128)),
        a.disabled ? u("", !0) : (e(), A(s(Ve), {
          key: 0,
          "model-value": null,
          placeholder: a.placeholder ?? "Add…",
          "aria-labelledby": a.labelledby,
          "aria-label": a.placeholder ?? "Add",
          "onUpdate:modelValue": ee[0] || (ee[0] = (N) => x(N)),
          class: "pim-chip-entry",
          options: a.options.filter((N) => !r(N.value)),
          "option-label": O,
          "option-value": "value",
          appendTo: "self"
        }, {
          option: w(({ option: N }) => [
            l("span", null, [
              J(y(N.label ?? N.value) + " ", 1),
              N.detail ? (e(), i("small", Cs, y(N.detail), 1)) : u("", !0)
            ])
          ]),
          _: 1
        }, 8, ["placeholder", "aria-labelledby", "aria-label", "options"]))
      ], 64)) : a.options ? (e(), i(M, { key: 2 }, [
        f(s(Al), {
          "model-value": a.modelValue.filter((N) => a.options.some((_) => _.value === N)),
          options: a.options.map((N) => ({ value: N.value, label: N.label ?? N.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          disabled: a.disabled,
          "aria-labelledby": a.labelledby,
          "aria-label": a.placeholder ?? "Selected values",
          "onUpdate:modelValue": ee[1] || (ee[1] = (N) => n("update:modelValue", [...N, ...a.modelValue.filter((_) => !a.options.some((C) => C.value === _))]))
        }, null, 8, ["model-value", "options", "disabled", "aria-labelledby", "aria-label"]),
        (e(!0), i(M, null, se(a.modelValue.filter((N) => !a.options.some((_) => _.value === N)), (N) => (e(), i("span", {
          key: N,
          class: "row"
        }, [
          J(y(N), 1),
          f(s(Y), {
            type: "button",
            "aria-label": "Remove " + N,
            onClick: (_) => b(N),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: w(() => [
              f(s(de), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128))
      ], 64)) : (e(!0), i(M, { key: 3 }, se(a.modelValue, (N) => (e(), i("span", {
        key: N,
        class: "row"
      }, [
        J(y(N), 1),
        f(s(Y), {
          type: "button",
          "aria-label": "Remove " + N,
          onClick: (_) => b(N),
          size: "small",
          text: "",
          severity: "secondary"
        }, {
          default: w(() => [
            f(s(de), { icon: "tabler:x" })
          ]),
          _: 1
        }, 8, ["aria-label", "onClick"])
      ]))), 128)),
      a.free && !a.disabled ? (e(), A(s(tl), {
        key: 4,
        modelValue: d.value,
        "onUpdate:modelValue": ee[2] || (ee[2] = (N) => d.value = N),
        type: "text",
        "aria-labelledby": a.labelledby,
        placeholder: a.placeholder ?? "Add…",
        onKeydown: rl(Le(g, ["prevent"]), ["enter"]),
        onBlur: g,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "aria-labelledby", "placeholder", "onKeydown"])) : u("", !0)
    ]));
  }
}), xs = { key: 0 }, Vs = {
  key: 0,
  class: "pim-config-overrides"
}, Us = {
  key: 1,
  class: "muted small"
}, js = { key: 3 }, Ss = ["schema", "config"], As = {
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
  setup(a, { emit: v }) {
    const t = a, n = v, d = Z("pending"), r = D(() => {
      const T = t.schema.properties;
      return !T || typeof T != "object" ? t.schema : {
        ...t.schema,
        properties: Object.fromEntries(Object.entries(T).map(([O, B]) => [
          O,
          B && typeof B == "object" ? { ...B, title: sl(t.schema, O) } : B
        ]))
      };
    }), x = D(() => Object.entries(t.modelValue).map(([T, O]) => ({
      key: T,
      label: sl(t.schema, T),
      value: O !== null && typeof O == "object" ? JSON.stringify(O) : cl(O)
    })));
    async function g() {
      d.value = "pending", d.value = await Yl("wc-schema-form") ? "ready" : "failed";
    }
    ye(() => t.disabled, (T) => {
      T || g();
    }, { immediate: !0 });
    function b(T) {
      const O = T.detail;
      O && typeof O == "object" && !Array.isArray(O) && n("update:modelValue", O);
    }
    return (T, O) => (e(), i(M, null, [
      a.refusal || a.problem ? (e(), A(s(Ue), {
        key: 0,
        severity: "warn",
        role: "alert"
      }, {
        default: w(() => [
          a.refusal ? (e(), i(M, { key: 0 }, [
            J(y(a.refusal), 1)
          ], 64)) : a.problemLabel ? (e(), i(M, { key: 1 }, [
            J(y(a.problemLabel) + " is required. Enter a value below.", 1)
          ], 64)) : (e(), i(M, { key: 2 }, [
            J("The saved settings don’t meet the plugin’s requirements. Update the configuration below.")
          ], 64))
        ]),
        _: 1
      })) : u("", !0),
      a.problem ? (e(), A(xe, {
        key: 1,
        class: "small pim-error-code pim-ia-disclosure",
        label: "Technical details"
      }, {
        default: w(() => [
          a.pluginId ? (e(), i("p", xs, [
            O[1] || (O[1] = J("Plugin ", -1)),
            l("code", null, y(a.pluginId), 1)
          ])) : u("", !0),
          l("p", null, y(a.problem.message), 1)
        ]),
        _: 1
      })) : u("", !0),
      a.disabled ? (e(), i(M, { key: 2 }, [
        x.value.length ? (e(), i("dl", Vs, [
          (e(!0), i(M, null, se(x.value, (B) => (e(), i(M, {
            key: B.key
          }, [
            l("dt", null, y(B.label), 1),
            l("dd", null, y(B.value), 1)
          ], 64))), 128))
        ])) : (e(), i("span", Us, "No overrides"))
      ], 64)) : (e(), i("div", js, [
        d.value === "ready" ? (e(), i("wc-schema-form", {
          key: 0,
          schema: JSON.stringify(r.value),
          config: JSON.stringify(a.modelValue),
          onConfigChanged: b
        }, null, 40, Ss)) : d.value === "pending" ? (e(), i("span", As, "Configuration form is loading.")) : (e(), A(s(Ue), {
          key: 2,
          role: "alert",
          severity: "error"
        }, {
          default: w(() => [
            O[3] || (O[3] = J("Configuration form could not be loaded. ", -1)),
            f(s(Y), {
              type: "button",
              onClick: g,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: w(() => [...O[2] || (O[2] = [
                J("Retry", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })),
        a.problem ? u("", !0) : (e(), A(s(Y), {
          key: 3,
          type: "button",
          onClick: O[0] || (O[0] = (B) => n("update:modelValue", {})),
          severity: "secondary",
          outlined: "",
          size: "small"
        }, {
          default: w(() => [
            f(s(de), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            }),
            O[4] || (O[4] = J(" Reset overrides", -1))
          ]),
          _: 1
        }))
      ]))
    ], 64));
  }
}), Os = { key: 0 }, Rs = /* @__PURE__ */ pe({
  __name: "DefaultValue",
  props: {
    attribute: {},
    type: {},
    disabled: { type: Boolean }
  },
  emits: ["change"],
  setup(a, { emit: v }) {
    const t = a, n = v, d = D(() => {
      const b = t.type?.form;
      let T = { type: "string" };
      return b === "bool" ? T = { type: "boolean" } : b === "int" ? T = { type: "integer" } : b === "dec" ? T = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : b === "quantity" ? T = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(t.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : b === "record" ? T = { type: "object", additionalProperties: !0 } : b === "ref" && (T = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${t.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (t.attribute.cardinality ?? "one") !== "one" && (T = { type: "array", items: T, uniqueItems: t.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...T, title: "Default value" } } };
    });
    function r(b) {
      return b && typeof b == "object" && "m" in b && "e" in b ? Sl(b) : b;
    }
    function x(b) {
      return t.type?.form === "dec" ? r(b) : t.type?.form === "quantity" && b && typeof b == "object" && "v" in b && "u" in b ? { value: r(b.v), unit: b.u } : b;
    }
    const g = D(() => t.attribute.default === void 0 ? {} : { value: Array.isArray(t.attribute.default) ? t.attribute.default.map(x) : x(t.attribute.default) });
    return (b, T) => a.disabled ? (e(), i("span", Os, y(a.attribute.default == null ? "No default" : s(cl)(a.attribute.default)), 1)) : (e(), A(Ol, {
      key: 1,
      schema: d.value,
      "model-value": g.value,
      "onUpdate:modelValue": T[0] || (T[0] = (O) => n("change", O.value))
    }, null, 8, ["schema", "model-value"]));
  }
}), Is = { class: "pim-stack" }, Ps = {
  key: 0,
  class: "pim-ia-action"
}, Ts = {
  key: 1,
  class: "form pim-card-body pad muted"
}, qs = { class: "pim-bsection-head pim-list-header" }, Fs = { class: "small muted" }, Ds = { class: "row pim-list-actions" }, Ns = { class: "pim-fields" }, zs = { class: "pim-f pim-w-third" }, Ls = { class: "pim-f-label" }, Bs = ["id"], Ms = { class: "pim-f pim-w-third" }, Es = { class: "pim-f-label" }, Ws = ["id"], Hs = {
  key: 0,
  class: "pim-f pim-w-third"
}, Js = { class: "pim-f-label" }, Ks = ["id"], Gs = {
  key: 1,
  class: "pim-f pim-w-full muted small"
}, Ys = {
  key: 2,
  class: "pim-f pim-w-full muted small"
}, Zs = {
  key: 3,
  class: "pim-f pim-w-third"
}, Qs = { class: "pim-f-label" }, Xs = ["id"], ei = { class: "pim-f pim-w-third" }, li = { class: "pim-f-label" }, ai = ["id"], ti = { class: "pim-f pim-w-half" }, si = { class: "pim-f-label" }, ii = ["id"], ni = ["aria-labelledby"], oi = { class: "pim-f-label" }, di = ["id"], ri = ["aria-labelledby"], ui = { class: "pim-f-label" }, ci = ["id"], mi = { class: "pim-fields" }, pi = { class: "pim-f pim-w-third" }, vi = { class: "pim-f-label" }, fi = ["for"], bi = {
  key: 0,
  class: "pim-f-note"
}, yi = { class: "pim-f pim-w-third" }, gi = { class: "pim-f-label" }, hi = ["id"], ki = { class: "pim-f pim-w-half" }, _i = { class: "pim-f-label" }, wi = ["for"], $i = { class: "row" }, Ci = {
  key: 0,
  class: "pim-f pim-w-full"
}, xi = { class: "pim-f-label" }, Vi = ["id"], Ui = ["aria-labelledby"], ji = ["id"], Si = {
  key: 0,
  class: "row end"
}, Ai = { class: "pim-ia-dialog-head" }, Oi = {
  tabindex: "-1",
  autofocus: ""
}, Ri = { class: "pim-source-permissions" }, Ii = ["id"], Pi = { class: "dialog-actions pim-group-dialog-actions" }, Ti = /* @__PURE__ */ pe({
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
  setup(a, { emit: v }) {
    const t = a, n = Xl(a, "family"), d = v, r = fl.map((I) => I.value), x = [{ value: "one", label: "Single value" }, { value: "list", label: "Ordered list" }, { value: "set", label: "Unique set" }], g = D(() => t.schema.access.admin), b = D(() => t.draft.aspects ?? []), T = D(() => (t.draft.families ?? []).filter((I) => I.code !== "generic"));
    ye(T, (I) => {
      n.value && !I.some((U) => U.code === n.value) && (n.value = "");
    }, { immediate: !0 });
    const O = D(() => [{ value: "", label: "All families" }, ...T.value.map((I) => ({ value: I.code, label: E(I.code) }))]), B = D(() => {
      const I = T.value.find((U) => U.code === n.value);
      return I ? b.value.filter((U) => I.aspects?.includes(U.namespace)) : b.value;
    }), ee = D(() => (t.draft.dimensions ?? []).map((I) => ({ value: I.name, label: E(I.name) }))), N = D(() => (t.draft.vocabularies ?? []).map((I) => I.code)), _ = D(() => (t.draft.sources ?? []).map((I) => ({ value: I.id, label: E(I.id) }))), C = D(() => [...t.options.types].sort((I, U) => I.form.localeCompare(U.form)).map((I) => ({ value: I.id, label: dl(I) })));
    function c(I) {
      return t.options.types.find((U) => U.id === I.type);
    }
    function q(I) {
      return c(I)?.target === "term";
    }
    function K(I) {
      return c(I)?.target === "asset";
    }
    function W(I) {
      const U = c(I);
      return !!U && U.form === "ref" && !U.target;
    }
    const H = D(() => ia(t.draft.families)), te = { none: "None", key: "Exact match", number: "Number range", text: "Text search" }, F = Z({}), oe = Te(), Q = /* @__PURE__ */ new WeakMap();
    let R = 0;
    function X(I, U) {
      if (U.id !== void 0) return I + "." + U.id;
      const P = za(U);
      let k = Q.get(P);
      return k === void 0 && (k = ++R, Q.set(P, k)), I + ".draft-" + k;
    }
    function S(I, U, P) {
      return oe + "-" + X(I, U) + "-" + P;
    }
    function V(I, U) {
      I.type = U;
      const P = c(I);
      if (P && I.index && !P.indexes.includes(I.index) && delete I.index, q(I) || delete I.vocabulary, K(I) && delete I.default, !W(I) && I.config && "target" in I.config) {
        const { target: k, ...ve } = I.config;
        I.config = Object.keys(ve).length ? ve : void 0, I.config || delete I.config;
      }
    }
    function j(I, U) {
      Object.keys(U).length ? I.config = U : delete I.config;
    }
    function m(I, U) {
      const P = { ...I.config ?? {} };
      U ? P.target = U : delete P.target, j(I, P);
    }
    function h(I, U) {
      U.length ? I.scope = U : delete I.scope, U.length || delete I.index_contexts;
    }
    function L(I, U, P) {
      P === void 0 || P === "" || P === !1 && U !== "default" ? delete I[U] : I[U] = P;
    }
    function ue(I) {
      return I.index_contexts ?? [];
    }
    function z(I) {
      return (t.draft.dimensions ?? []).find((U) => U.name === I)?.members ?? [];
    }
    function ie(I) {
      const U = {};
      for (const k of I.scope ?? []) U[k] = z(k)[0] ?? "";
      (I.index_contexts ?? (I.index_contexts = [])).push(U);
    }
    const ae = Z(), je = D(() => ae.value ? E(ae.value.namespace) + " settings" : "");
    async function ge(I, U, P, k) {
      const ve = I.currentTarget, le = ve.parentElement;
      vl(U, P, k), await Je(), (ve.isConnected ? ve : le?.querySelector("button"))?.focus({ preventScroll: !0 });
    }
    function qe(I) {
      (t.draft.aspects ??= []).push({ namespace: I, attributes: [] });
    }
    function ml(I) {
      ae.value = void 0;
      const U = b.value.indexOf(I);
      U >= 0 && b.value.splice(U, 1), t.schema.declaration.aspects?.some((P) => P.namespace === I.namespace) && d("remove", "aspects", I.namespace);
    }
    function _e(I, U) {
      const P = t.options.types.find((ve) => ve.id === "kickside.pim.types:text") ?? t.options.types[0], k = { code: U, type: P?.id ?? "" };
      (I.attributes ??= []).push(k), F.value[X(I.namespace, k)] = !0;
    }
    function we(I, U) {
      const P = I.attributes ?? [], k = P.indexOf(U);
      k >= 0 && P.splice(k, 1);
      const ve = U.id === void 0 ? void 0 : t.schema.declaration.aspects?.find((le) => le.namespace === I.namespace)?.attributes?.find((le) => le.id === U.id);
      ve && d("remove", "attributes", I.namespace + "." + ve.code);
    }
    return (I, U) => (e(), i("div", Is, [
      T.value.length || g.value && !n.value || b.value.length ? (e(), i("div", Ps, [
        T.value.length ? (e(), A(s(Ve), {
          key: 0,
          modelValue: n.value,
          "onUpdate:modelValue": U[0] || (U[0] = (P) => n.value = P),
          class: "pim-family-filter",
          "aria-label": "Show fields for a family",
          placeholder: "All families",
          options: O.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self"
        }, null, 8, ["modelValue", "options"])) : u("", !0),
        g.value && !n.value ? (e(), A(Be, {
          key: 1,
          label: "Field group name",
          action: "Add field group",
          "from-name": "",
          regular: "",
          existing: b.value.map((P) => P.namespace),
          onAdd: qe
        }, null, 8, ["existing"])) : u("", !0),
        b.value.length ? (e(), A(s(Y), {
          key: 2,
          label: "Open form layout",
          type: "button",
          text: "",
          size: "small",
          onClick: U[1] || (U[1] = (P) => d("layout"))
        })) : u("", !0)
      ])) : u("", !0),
      n.value && !B.value.length ? (e(), i("p", Ts, "This family has no field groups yet. Open the family to choose which groups it uses.")) : u("", !0),
      (e(!0), i(M, null, se(B.value, (P) => (e(), A(Me, {
        key: P.namespace,
        count: P.attributes?.length ?? 0,
        columns: ["kind", "details"],
        "show-actions": g.value
      }, {
        head: w(() => [
          l("header", qs, [
            l("div", null, [
              l("h3", null, y(s(E)(P.namespace)), 1),
              l("p", Fs, y(H.value.get(P.namespace) ?? "Unused by families"), 1)
            ]),
            l("div", Ds, [
              g.value ? (e(), A(Be, {
                key: 0,
                label: "Field name",
                action: "Add field",
                "from-name": "",
                existing: P.attributes?.map((k) => k.code),
                onAdd: (k) => _e(P, k)
              }, null, 8, ["existing", "onAdd"])) : u("", !0),
              f(s(Y), {
                type: "button",
                "aria-label": s(E)(P.namespace) + " settings",
                title: s(E)(P.namespace) + " settings",
                "aria-haspopup": "dialog",
                severity: "secondary",
                text: "",
                size: "small",
                onClick: (k) => ae.value = P
              }, {
                default: w(() => [
                  f(s(de), {
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
          (e(!0), i(M, null, se(P.attributes ?? [], (k, ve) => (e(), A(Ee, {
            "route-section": "fields",
            "route-id": k.id === void 0 ? void 0 : X(P.namespace, k),
            key: X(P.namespace, k),
            open: F.value[X(P.namespace, k)],
            "onUpdate:open": (le) => F.value[X(P.namespace, k)] = le,
            title: s(E)(k.code),
            kind: s(dl)(c(k)),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle"
          }, Ce({
            details: w(() => [
              k.cardinality && k.cardinality !== "one" ? (e(), A(s(ke), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [
                  J(y(x.find((le) => le.value === k.cardinality)?.label), 1)
                ]),
                _: 2
              }, 1024)) : u("", !0),
              k.scope?.length ? (e(), A(s(ke), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [
                  J("per " + y(k.scope.map(s(E)).join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : u("", !0),
              k.index && k.index !== "none" ? (e(), A(s(ke), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [
                  J(y(te[k.index] || "Filterable"), 1)
                ]),
                _: 2
              }, 1024)) : u("", !0),
              k.unique ? (e(), A(s(ke), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [...U[7] || (U[7] = [
                  J("unique", -1)
                ])]),
                _: 1
              })) : u("", !0)
            ]),
            default: w(() => [
              l("div", Ns, [
                l("div", zs, [
                  l("div", Ls, [
                    l("label", {
                      id: S(P.namespace, k, "type")
                    }, "Type", 8, Bs)
                  ]),
                  f(s(Ve), {
                    disabled: !g.value,
                    "aria-labelledby": S(P.namespace, k, "type"),
                    "model-value": k.type,
                    options: C.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (le) => V(k, le)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                l("div", Ms, [
                  l("div", Es, [
                    l("label", {
                      id: S(P.namespace, k, "values")
                    }, "Values", 8, Ws)
                  ]),
                  f(s(Ve), {
                    disabled: !g.value,
                    "aria-labelledby": S(P.namespace, k, "values"),
                    "model-value": k.cardinality ?? "one",
                    options: x,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (le) => L(k, "cardinality", le === "one" ? void 0 : le)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                q(k) ? (e(), i("div", Hs, [
                  l("div", Js, [
                    l("label", {
                      id: S(P.namespace, k, "vocabulary")
                    }, "Vocabulary", 8, Ks)
                  ]),
                  f(s(Ve), {
                    disabled: !g.value,
                    "aria-labelledby": S(P.namespace, k, "vocabulary"),
                    "model-value": k.vocabulary ?? "",
                    "onUpdate:modelValue": (le) => L(k, "vocabulary", le),
                    options: [{ value: "", label: "Choose…" }, ...N.value.map((le) => ({ value: le, label: s(E)(le) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : u("", !0),
                K(k) ? (e(), i("p", Gs, "Choose the media types and file size this field accepts. Catalog readers can access attached files.")) : c(k)?.form === "ref" && !q(k) ? (e(), i("p", Ys, y(W(k) ? "A link points to something managed by an installed plugin." : "A product reference points to another product in this catalog."), 1)) : u("", !0),
                W(k) ? (e(), i("div", Zs, [
                  l("div", Qs, [
                    l("label", {
                      id: S(P.namespace, k, "link")
                    }, "Link destination", 8, Xs),
                    U[8] || (U[8] = l("span", { class: "pim-f-note" }, "choose what the field can point to", -1))
                  ]),
                  f(s(Ve), {
                    disabled: !g.value,
                    "aria-labelledby": S(P.namespace, k, "link"),
                    "model-value": k.config?.target ?? "",
                    "onUpdate:modelValue": (le) => m(k, le),
                    options: [{ value: "", label: "Choose…" }, ...a.options.link_kinds.map((le) => ({ value: le.kind, label: s(ce)(le.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : u("", !0),
                l("div", ei, [
                  l("div", li, [
                    l("label", {
                      id: S(P.namespace, k, "width")
                    }, "Width", 8, ai),
                    U[9] || (U[9] = l("span", { class: "pim-f-note" }, "of a form row", -1))
                  ]),
                  f(s(Al), {
                    disabled: !g.value,
                    "aria-labelledby": S(P.namespace, k, "width"),
                    "model-value": s(jl)(a.schema, P.namespace, k),
                    options: s(r),
                    "allow-empty": !1,
                    "onUpdate:modelValue": (le) => k.width = le
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                l("div", ti, [
                  l("div", si, [
                    l("label", {
                      id: S(P.namespace, k, "scope")
                    }, "Varies per", 8, ii),
                    U[10] || (U[10] = l("span", { class: "pim-f-note" }, "dimensions the value depends on", -1))
                  ]),
                  f(Pe, {
                    disabled: !g.value,
                    labelledby: S(P.namespace, k, "scope"),
                    "model-value": k.scope ?? [],
                    options: ee.value,
                    "onUpdate:modelValue": (le) => h(k, le)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                K(k) ? u("", !0) : (e(), i("div", {
                  key: 4,
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": S(P.namespace, k, "default")
                }, [
                  l("div", oi, [
                    l("label", {
                      id: S(P.namespace, k, "default")
                    }, "Default", 8, di),
                    U[11] || (U[11] = l("span", { class: "pim-f-note" }, "when no value is set", -1))
                  ]),
                  f(Rs, {
                    disabled: !g.value,
                    attribute: k,
                    type: c(k),
                    onChange: (le) => L(k, "default", le)
                  }, null, 8, ["disabled", "attribute", "type", "onChange"])
                ], 8, ni)),
                c(k)?.config_schema ? (e(), i("div", {
                  key: 5,
                  class: "pim-f pim-w-full",
                  role: "group",
                  "aria-labelledby": S(P.namespace, k, "config")
                }, [
                  l("div", ui, [
                    l("label", {
                      id: S(P.namespace, k, "config")
                    }, "Type configuration", 8, ci)
                  ]),
                  f(Ol, {
                    disabled: !g.value,
                    schema: c(k).config_schema,
                    "model-value": k.config ?? {},
                    "onUpdate:modelValue": (le) => j(k, le)
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue"])
                ], 8, ri)) : u("", !0)
              ]),
              f(xe, {
                class: "pim-field-advanced pim-ia-disclosure",
                label: "Advanced"
              }, {
                default: w(() => [
                  l("div", mi, [
                    l("div", pi, [
                      l("div", vi, [
                        l("label", {
                          for: S(P.namespace, k, "code")
                        }, "Integration key", 8, fi),
                        k.id !== void 0 ? (e(), i("span", bi, "renaming keeps stored values")) : u("", !0)
                      ]),
                      f(s(tl), {
                        disabled: !g.value,
                        id: S(P.namespace, k, "code"),
                        type: "text",
                        value: k.code,
                        onInput: (le) => k.code = le.target.value,
                        class: "mono"
                      }, null, 8, ["disabled", "id", "value", "onInput"])
                    ]),
                    l("div", yi, [
                      l("div", gi, [
                        l("label", {
                          id: S(P.namespace, k, "index")
                        }, "Search and filters", 8, hi),
                        U[12] || (U[12] = l("span", { class: "pim-f-note" }, "choose how this field can be matched", -1))
                      ]),
                      f(s(Ve), {
                        disabled: !g.value,
                        "aria-labelledby": S(P.namespace, k, "index"),
                        "model-value": k.index ?? "none",
                        options: (c(k)?.indexes ?? ["none"]).map((le) => ({ value: le, label: te[le] || s(E)(le) })),
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self",
                        "onUpdate:modelValue": (le) => L(k, "index", le === "none" ? void 0 : le)
                      }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ]),
                    l("div", ki, [
                      l("div", _i, [
                        l("label", {
                          for: S(P.namespace, k, "unique")
                        }, "Unique", 8, wi),
                        U[13] || (U[13] = l("span", { class: "pim-f-note" }, "one holder per value, catalog wide", -1))
                      ]),
                      l("div", $i, [
                        f(s(ul), {
                          "input-id": S(P.namespace, k, "unique"),
                          "model-value": k.unique === !0,
                          disabled: !g.value || !!k.scope?.length || (k.cardinality ?? "one") !== "one",
                          "onUpdate:modelValue": (le) => L(k, "unique", le)
                        }, null, 8, ["input-id", "model-value", "disabled", "onUpdate:modelValue"]),
                        l("span", null, y(k.unique ? "Yes" : "No"), 1)
                      ])
                    ]),
                    (k.scope?.length ?? 0) > 0 && k.index && k.index !== "none" ? (e(), i("div", Ci, [
                      l("div", xi, [
                        l("label", {
                          id: S(P.namespace, k, "contexts")
                        }, "Filterable combinations", 8, Vi),
                        U[14] || (U[14] = l("span", { class: "pim-f-note" }, "which combinations get an index", -1))
                      ]),
                      l("div", {
                        class: "pim-contexts",
                        role: "group",
                        "aria-labelledby": S(P.namespace, k, "contexts")
                      }, [
                        (e(!0), i(M, null, se(ue(k), (le, Fe) => (e(), i("div", {
                          key: Fe,
                          class: "pim-context-row"
                        }, [
                          (e(!0), i(M, null, se(k.scope, ($e) => (e(), i("div", {
                            key: $e,
                            class: "pim-context-field"
                          }, [
                            l("span", {
                              id: S(P.namespace, k, "context-" + Fe + "-" + $e),
                              class: "small muted"
                            }, y(s(E)($e)), 9, ji),
                            f(s(Ve), {
                              disabled: !g.value,
                              "aria-labelledby": S(P.namespace, k, "context-" + Fe + "-" + $e),
                              "model-value": le[$e] ?? "",
                              options: z($e),
                              class: "narrow",
                              appendTo: "self",
                              "onUpdate:modelValue": (hl) => le[$e] = hl
                            }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                          ]))), 128)),
                          g.value ? (e(), A(s(Y), {
                            key: 0,
                            type: "button",
                            "aria-label": "Remove context",
                            onClick: ($e) => ue(k).splice(Fe, 1),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: w(() => [
                              f(s(de), { icon: "tabler:x" })
                            ]),
                            _: 1
                          }, 8, ["onClick"])) : u("", !0)
                        ]))), 128)),
                        g.value ? (e(), A(s(Y), {
                          key: 0,
                          type: "button",
                          onClick: (le) => ie(k),
                          severity: "secondary",
                          outlined: "",
                          size: "small"
                        }, {
                          default: w(() => [
                            f(s(de), {
                              icon: "tabler:plus",
                              "aria-hidden": "true"
                            }),
                            U[15] || (U[15] = J(" Add context", -1))
                          ]),
                          _: 1
                        }, 8, ["onClick"])) : u("", !0)
                      ], 8, Ui)
                    ])) : u("", !0)
                  ])
                ]),
                _: 2
              }, 1024),
              g.value ? (e(), i("div", Si, [
                f(s(Y), {
                  type: "button",
                  onClick: (le) => we(P, k),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    f(s(de), { icon: "tabler:trash" }),
                    U[16] || (U[16] = J(" Remove field", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : u("", !0)
            ]),
            _: 2
          }, [
            g.value ? {
              name: "actions",
              fn: w(() => [
                ve > 0 ? (e(), A(s(Y), {
                  key: 0,
                  type: "button",
                  "aria-label": "Move " + s(E)(k.code) + " earlier",
                  onClick: (le) => ge(le, P.attributes, ve, ve - 1),
                  text: "",
                  size: "small",
                  severity: "secondary"
                }, {
                  default: w(() => [
                    f(s(de), {
                      icon: "tabler:arrow-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])) : u("", !0),
                ve < (P.attributes?.length ?? 0) - 1 ? (e(), A(s(Y), {
                  key: 1,
                  type: "button",
                  class: "pim-move-later",
                  "aria-label": "Move " + s(E)(k.code) + " later",
                  onClick: (le) => ge(le, P.attributes, ve, ve + 1),
                  text: "",
                  size: "small",
                  severity: "secondary"
                }, {
                  default: w(() => [
                    f(s(de), {
                      icon: "tabler:arrow-down",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])) : u("", !0)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "open", "onUpdate:open", "title", "kind"]))), 128))
        ]),
        _: 2
      }, 1032, ["count", "show-actions"]))), 128)),
      f(bl, {
        visible: !!ae.value,
        label: je.value,
        onClose: U[6] || (U[6] = (P) => ae.value = void 0)
      }, {
        default: w(() => [
          ae.value ? (e(), i("section", {
            key: 0,
            class: "pim-ia-dialog",
            onKeydown: U[5] || (U[5] = rl(Le((P) => ae.value = void 0, ["prevent"]), ["esc"]))
          }, [
            l("header", Ai, [
              l("h2", Oi, y(je.value), 1)
            ]),
            l("div", Ri, [
              l("label", {
                id: s(oe) + "-writers"
              }, "Sources allowed to write", 8, Ii),
              f(s(aa), {
                disabled: !g.value,
                "aria-labelledby": s(oe) + "-writers",
                "model-value": ae.value.write?.sources ?? [],
                options: _.value,
                "option-label": "label",
                "option-value": "value",
                placeholder: "Any source",
                "append-to": "self",
                "onUpdate:modelValue": U[2] || (U[2] = (P) => ae.value.write = { sources: P })
              }, null, 8, ["disabled", "aria-labelledby", "model-value", "options"])
            ]),
            l("footer", Pi, [
              g.value ? (e(), A(s(Y), {
                key: 0,
                type: "button",
                label: "Remove field group",
                severity: "danger",
                text: "",
                onClick: U[3] || (U[3] = (P) => ml(ae.value))
              })) : u("", !0),
              f(s(Y), {
                type: "button",
                label: "Done",
                severity: "secondary",
                outlined: "",
                onClick: U[4] || (U[4] = (P) => ae.value = void 0)
              })
            ])
          ], 32)) : u("", !0)
        ]),
        _: 1
      }, 8, ["visible", "label"])
    ]));
  }
}), qi = { class: "muted small" }, Fi = { class: "pim-aspect" }, Di = {
  key: 0,
  class: "small muted"
}, Ni = { class: "pim-fields" }, zi = { class: "pim-f pim-w-full" }, Li = { class: "pim-f-label" }, Bi = ["id"], Mi = { class: "pim-f-label" }, Ei = ["id"], Wi = /* @__PURE__ */ pe({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(a, { emit: v }) {
    const t = a, n = v, d = D(() => t.schema.access.admin), r = D(() => t.draft.dimensions ?? []), x = Te();
    function g(_, C) {
      return x + "-" + _.name + "-" + C;
    }
    function b(_) {
      (t.draft.dimensions ??= []).push({ name: _, members: [] });
    }
    function T(_) {
      const C = [];
      for (const c of t.draft.aspects ?? []) for (const q of c.attributes ?? []) q.scope?.includes(_.name) && C.push(`${E(q.code)} (${E(c.namespace)})`);
      for (const c of t.draft.families ?? []) for (const q of c.requirements ?? []) q.context && _.name in q.context && C.push(`${E(q.id)} (${E(c.code)})`);
      return C;
    }
    function O(_) {
      T(_).length || (r.value.splice(r.value.indexOf(_), 1), t.schema.declaration.dimensions?.some((C) => C.name === _.name) && n("remove", "dimensions", _.name));
    }
    function B(_, C) {
      if (_.members = C, _.fallback)
        for (const c of Object.keys(_.fallback)) C.includes(c) || delete _.fallback[c];
    }
    function ee(_, C) {
      return _.fallback?.[C] ?? [];
    }
    function N(_, C, c) {
      const q = { ..._.fallback ?? {} };
      c.length ? q[C] = c : delete q[C], Object.keys(q).length ? _.fallback = q : delete _.fallback;
    }
    return (_, C) => (e(), A(Me, {
      count: r.value.length,
      columns: ["details", "usage"]
    }, Ce({
      default: w(() => [
        (e(!0), i(M, null, se(r.value, (c) => (e(), A(Ee, {
          "route-section": "dimensions",
          "route-id": c.name,
          title: s(E)(c.name),
          key: c.name,
          usage: T(c).length ? "Used in " + T(c).length + " places" : "Unused"
        }, Ce({
          details: w(() => [
            l("span", qi, y(c.members.map(s(E)).join(", ") || "No allowed values"), 1)
          ]),
          default: w(() => [
            l("div", Fi, [
              T(c).length ? (e(), i("p", Di, "Used by " + y(T(c).join(", ")), 1)) : u("", !0),
              l("div", Ni, [
                l("div", zi, [
                  l("div", Li, [
                    l("label", {
                      id: g(c, "members")
                    }, "Allowed values", 8, Bi),
                    C[0] || (C[0] = l("span", { class: "pim-f-note" }, "for example, English and French for Language", -1))
                  ]),
                  f(Pe, {
                    disabled: !d.value,
                    labelledby: g(c, "members"),
                    "model-value": c.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (q) => B(c, q)
                  }, null, 8, ["disabled", "labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                (e(!0), i(M, null, se(c.members, (q) => (e(), i("div", {
                  key: q,
                  class: "pim-f pim-w-half"
                }, [
                  l("div", Mi, [
                    l("label", {
                      id: g(c, "fallback-" + encodeURIComponent(q))
                    }, y(q) + " falls back to", 9, Ei),
                    C[1] || (C[1] = l("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  f(Pe, {
                    disabled: !d.value,
                    labelledby: g(c, "fallback-" + encodeURIComponent(q)),
                    "model-value": ee(c, q),
                    options: c.members.filter((K) => K !== q).map((K) => ({ value: K })),
                    "onUpdate:modelValue": (K) => N(c, q, K)
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
              f(s(Y), {
                type: "button",
                disabled: T(c).length > 0,
                "aria-label": "Remove " + s(E)(c.name),
                title: T(c).length ? "Take the dimension off these first" : "",
                onClick: (q) => O(c),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: w(() => [
                  f(s(de), { icon: "tabler:trash" })
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
          f(Be, {
            label: "Dimension name",
            "from-name": "",
            action: "Add dimension",
            existing: r.value.map((c) => c.name),
            onAdd: b
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
}), Hi = { class: "muted small" }, Ji = { class: "pim-aspect" }, Ki = { class: "row small" }, Gi = {
  key: 1,
  class: "muted small"
}, Yi = {
  key: 2,
  class: "pim-stack tight pim-terms"
}, Zi = {
  key: 0,
  class: "muted small"
}, Qi = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Xi = {
  key: 3,
  class: "pim-responsive-table"
}, en = {
  class: "pim-grid compact",
  "aria-label": "Vocabulary terms"
}, ln = { key: 0 }, an = { key: 1 }, tn = {
  key: 0,
  class: "muted"
}, sn = {
  key: 1,
  class: "num"
}, nn = {
  role: "list",
  class: "pim-stacked-list",
  "aria-label": "Vocabulary terms"
}, on = {
  key: 0,
  class: "pim-stacked-meta muted small"
}, dn = {
  key: 4,
  class: "muted small"
}, rn = { class: "row wrap" }, un = {
  key: 5,
  class: "row wrap pim-add-row"
}, cn = {
  key: 0,
  class: "pim-config-overrides"
}, mn = /* @__PURE__ */ pe({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(a, { emit: v }) {
    const t = a, n = v, d = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/, r = D(() => t.schema.access.admin), x = D(() => r.value && t.schema.access.write), g = D(() => t.draft.vocabularies ?? []);
    function b(V) {
      (t.draft.vocabularies ??= []).push({ code: V });
    }
    function T(V) {
      g.value.splice(g.value.indexOf(V), 1), t.schema.declaration.vocabularies?.some((j) => j.code === V.code) && n("remove", "vocabularies", V.code);
    }
    function O(V) {
      return !!t.schema.vocabularies[V];
    }
    const B = Z({}), ee = Z({}), N = Z({}), _ = Z({}), C = Z({}), c = Z({}), q = Z({}), K = Z({});
    function W(V) {
      return !!(C.value[V] || c.value[V]);
    }
    async function H(V, j) {
      C.value[V] = !0, delete q.value[V];
      try {
        const m = await be.termsPage(t.catalogId, V, j);
        ee.value[V] = m.terms, _.value[V] = j, N.value[V] = m.next;
        const h = F(V);
        m.terms.some((L) => L.retired && L.code === h.parent) && (h.parent = "");
      } catch (m) {
        q.value[V] = { errors: [Ge(m, "Could not load terms.")], read: { after: j } };
      } finally {
        C.value[V] = !1;
      }
    }
    function te(V) {
      B.value[V] = !B.value[V], B.value[V] && !W(V) && !ee.value[V] && !q.value[V] && H(V);
    }
    function F(V) {
      return K.value[V] ?? (K.value[V] = { code: "", label: "", parent: "" });
    }
    function oe(V, j) {
      const m = ee.value[V]?.find((h) => h.code === j);
      return m ? He(m) : E(j);
    }
    function Q(V) {
      return [{ value: "", label: "No parent" }, ...(ee.value[V] ?? []).filter((j) => !j.retired).map((j) => ({ value: j.code, label: He(j) }))];
    }
    function R(V, j, m) {
      q.value[V] = { errors: j?.findings?.length ? j.findings.map((h) => ({ message: h.message ?? m, code: h.code })) : [{ message: m }] };
    }
    async function X(V) {
      const j = F(V.code);
      if (!(!x.value || !d.test(j.code))) {
        c.value[V.code] = !0, delete q.value[V.code];
        try {
          const m = { term: { vocabulary: V.code, code: j.code }, labels: { en: j.label || E(j.code) } };
          V.hierarchical && j.parent && (m.parent = j.parent);
          const L = (await be.apply(t.catalogId, [m])).outcomes[0];
          if (L?.outcome !== "created" && L?.outcome !== "updated") {
            R(V.code, L, "The term was not accepted.");
            return;
          }
          K.value[V.code] = { code: "", label: "", parent: "" }, be.invalidateTerms(t.catalogId), await H(V.code, _.value[V.code]);
        } catch (m) {
          q.value[V.code] = { errors: [Ge(m, "Could not add the term.")] };
        } finally {
          c.value[V.code] = !1;
        }
      }
    }
    async function S(V, j, m) {
      if (x.value && !(m && !await ll.confirm({ header: "Retire term?", message: `Retire ${He(j)}? Term changes save immediately. You can restore this term later.`, acceptLabel: "Retire", rejectLabel: "Cancel" }))) {
        c.value[V.code] = !0, delete q.value[V.code];
        try {
          const L = (await be.apply(t.catalogId, [{ term: { vocabulary: V.code, code: j.code }, retired: m }])).outcomes[0];
          if (!L || !["updated", "unchanged"].includes(L.outcome)) {
            R(V.code, L, "The term change was not accepted.");
            return;
          }
          m && F(V.code).parent === j.code && (F(V.code).parent = ""), be.invalidateTerms(t.catalogId), await H(V.code, _.value[V.code]);
        } catch (h) {
          q.value[V.code] = { errors: [Ge(h, "Could not change the term.")] };
        } finally {
          c.value[V.code] = !1;
        }
      }
    }
    return (V, j) => (e(), A(Me, {
      count: g.value.length,
      columns: ["details"]
    }, Ce({
      default: w(() => [
        (e(!0), i(M, null, se(g.value, (m) => (e(), A(Ee, {
          "route-section": "vocabularies",
          "route-id": m.code,
          title: s(E)(m.code),
          key: m.code
        }, {
          details: w(() => [
            l("span", Hi, y(m.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: w(() => [
            r.value ? (e(), A(s(Y), {
              key: 0,
              type: "button",
              "aria-label": "Remove " + s(E)(m.code),
              onClick: (h) => T(m),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: w(() => [
                f(s(de), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])) : u("", !0)
          ]),
          default: w(() => [
            l("div", Ji, [
              l("label", Ki, [
                f(s(ul), {
                  disabled: !r.value,
                  "aria-label": "Hierarchical " + s(E)(m.code),
                  "model-value": m.hierarchical === !0,
                  "onUpdate:modelValue": (h) => h ? m.hierarchical = !0 : delete m.hierarchical
                }, null, 8, ["disabled", "aria-label", "model-value", "onUpdate:modelValue"]),
                j[0] || (j[0] = l("span", null, "Hierarchical", -1))
              ]),
              O(m.code) ? (e(), A(s(Y), {
                key: 0,
                type: "button",
                onClick: (h) => te(m.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: w(() => [
                  f(s(de), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  J(" " + y(B.value[m.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : r.value ? (e(), i("span", Gi, "Apply the schema before adding terms.")) : u("", !0),
              B.value[m.code] ? (e(), i("div", Yi, [
                x.value ? (e(), i("p", Zi, "Term changes save immediately.")) : u("", !0),
                C.value[m.code] ? (e(), i("div", Qi, "Loading terms…")) : q.value[m.code] ? (e(!0), i(M, { key: 2 }, se(q.value[m.code].errors, (h, L) => (e(), A(gl, {
                  key: L,
                  error: h
                }, {
                  default: w(() => [
                    q.value[m.code].read ? (e(), A(s(Y), {
                      key: 0,
                      type: "button",
                      onClick: (ue) => H(m.code, q.value[m.code].read?.after),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: w(() => [...j[1] || (j[1] = [
                        J("Retry", -1)
                      ])]),
                      _: 1
                    }, 8, ["onClick"])) : u("", !0)
                  ]),
                  _: 2
                }, 1032, ["error"]))), 128)) : u("", !0),
                (ee.value[m.code] ?? []).length ? (e(), i("div", Xi, [
                  l("table", en, [
                    l("thead", null, [
                      l("tr", null, [
                        j[2] || (j[2] = l("th", null, "Term", -1)),
                        m.hierarchical ? (e(), i("th", ln, "Parent")) : u("", !0),
                        r.value ? (e(), i("th", an)) : u("", !0)
                      ])
                    ]),
                    l("tbody", null, [
                      (e(!0), i(M, null, se(ee.value[m.code], (h) => (e(), i("tr", {
                        key: h.code,
                        class: Oe({ muted: h.retired })
                      }, [
                        l("td", null, [
                          J(y(s(He)(h)) + " ", 1),
                          h.retired ? (e(), A(s(ke), {
                            key: 0,
                            severity: "secondary",
                            value: "Retired"
                          })) : u("", !0)
                        ]),
                        m.hierarchical ? (e(), i("td", tn, y(h.parent ? oe(m.code, h.parent) : "—"), 1)) : u("", !0),
                        r.value ? (e(), i("td", sn, [
                          f(s(Y), {
                            type: "button",
                            disabled: !x.value || W(m.code),
                            onClick: (L) => S(m, h, !h.retired),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: w(() => [
                              J(y(h.retired ? "Restore" : "Retire"), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled", "onClick"])
                        ])) : u("", !0)
                      ], 2))), 128))
                    ])
                  ]),
                  l("ul", nn, [
                    (e(!0), i(M, null, se(ee.value[m.code], (h) => (e(), i("li", {
                      key: h.code,
                      class: Oe(["pim-stacked-row", { muted: h.retired }])
                    }, [
                      l("div", null, [
                        J(y(s(He)(h)) + " ", 1),
                        h.retired ? (e(), A(s(ke), {
                          key: 0,
                          severity: "secondary",
                          value: "Retired"
                        })) : u("", !0)
                      ]),
                      m.hierarchical && h.parent ? (e(), i("div", on, "Parent: " + y(oe(m.code, h.parent)), 1)) : u("", !0),
                      r.value ? (e(), A(s(Y), {
                        key: 1,
                        type: "button",
                        disabled: !x.value || W(m.code),
                        onClick: (L) => S(m, h, !h.retired),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: w(() => [
                          J(y(h.retired ? "Restore" : "Retire"), 1)
                        ]),
                        _: 2
                      }, 1032, ["disabled", "onClick"])) : u("", !0)
                    ], 2))), 128))
                  ])
                ])) : ee.value[m.code] && !W(m.code) && !q.value[m.code] ? (e(), i("p", dn, "No terms yet.")) : u("", !0),
                l("div", rn, [
                  f(s(Y), {
                    type: "button",
                    disabled: W(m.code) || !_.value[m.code],
                    onClick: (h) => H(m.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      f(s(de), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      j[3] || (j[3] = J(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  f(s(Y), {
                    type: "button",
                    disabled: W(m.code) || !N.value[m.code],
                    onClick: (h) => H(m.code, N.value[m.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      f(s(de), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      j[4] || (j[4] = J(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                r.value ? (e(), i("div", un, [
                  f(s(tl), {
                    modelValue: F(m.code).label,
                    "onUpdate:modelValue": (h) => F(m.code).label = h,
                    disabled: !x.value || W(m.code),
                    "aria-label": "Term name in English",
                    type: "text",
                    placeholder: "Term name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  f(s(tl), {
                    modelValue: F(m.code).code,
                    "onUpdate:modelValue": (h) => F(m.code).code = h,
                    disabled: !x.value || W(m.code),
                    type: "text",
                    "aria-label": "Short term name",
                    placeholder: "Short name for imports",
                    class: "narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  m.hierarchical ? (e(), A(s(Ve), {
                    key: 0,
                    modelValue: F(m.code).parent,
                    "onUpdate:modelValue": (h) => F(m.code).parent = h,
                    disabled: !x.value || W(m.code),
                    class: "narrow",
                    "aria-label": "Parent term",
                    placeholder: "No parent",
                    options: Q(m.code),
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "options"])) : u("", !0),
                  f(s(Y), {
                    type: "button",
                    disabled: !x.value || W(m.code) || !d.test(F(m.code).code),
                    onClick: (h) => X(m),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      f(s(de), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      j[5] || (j[5] = J(" Add term", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])) : u("", !0),
                f(xe, {
                  class: "pim-ia-disclosure",
                  label: "Integration keys"
                }, {
                  default: w(() => [
                    (ee.value[m.code] ?? []).length ? (e(), i("dl", cn, [
                      (e(!0), i(M, null, se(ee.value[m.code], (h) => (e(), i(M, {
                        key: h.code
                      }, [
                        l("dt", null, y(s(He)(h)), 1),
                        l("dd", null, [
                          l("code", null, y(h.code), 1)
                        ])
                      ], 64))), 128))
                    ])) : u("", !0)
                  ]),
                  _: 2
                }, 1024)
              ])) : u("", !0)
            ])
          ]),
          _: 2
        }, 1032, ["route-id", "title"]))), 128))
      ]),
      _: 2
    }, [
      r.value ? {
        name: "add",
        fn: w(() => [
          f(Be, {
            label: "Vocabulary name",
            "from-name": "",
            action: "Add vocabulary",
            existing: g.value.map((m) => m.code),
            onAdd: b
          }, {
            default: w(() => [...j[6] || (j[6] = [
              l("span", { class: "muted small" }, "Select fields pick their values from a vocabulary's terms.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), pn = { class: "pim-stack" }, vn = { class: "muted small" }, fn = { class: "muted small" }, bn = { class: "pim-aspect" }, yn = { class: "pim-ia-action pim-family-fields" }, gn = { class: "pim-f" }, hn = { class: "pim-f-label" }, kn = ["id"], _n = ["id"], wn = { class: "pim-aspect" }, $n = { class: "pim-stack tight" }, Cn = { class: "pim-level-head" }, xn = { class: "pim-fields" }, Vn = { class: "pim-f pim-w-half" }, Un = { class: "pim-f-label" }, jn = ["id"], Sn = { class: "pim-f pim-w-half" }, An = { class: "pim-f-label" }, On = ["id"], Rn = { class: "pim-aspect" }, In = { class: "pim-stack tight" }, Pn = { class: "pim-level-head" }, Tn = { class: "muted small" }, qn = { class: "pim-fields" }, Fn = { class: "pim-f-label" }, Dn = ["id"], Nn = { class: "pim-f pim-w-half" }, zn = { class: "pim-f-label" }, Ln = ["id"], Bn = { class: "pim-f pim-w-half" }, Mn = { class: "pim-f-label" }, En = ["id"], Wn = {
  key: 0,
  class: "pim-aspect pim-family-remove"
}, Hn = /* @__PURE__ */ pe({
  __name: "BuilderFamilies",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove", "fields", "variant-field"],
  setup(a, { emit: v }) {
    const t = a, n = v, d = Te();
    function r(j, m) {
      return d + "-" + j.code + "-" + m;
    }
    const x = D(() => t.schema.access.admin), g = D(() => (t.draft.families ?? []).filter((j) => j.code !== "generic")), b = D(() => {
      const j = new Set(t.draft.plugins?.map((m) => m.use));
      return Object.entries(t.schema.attributes).filter(([, m]) => m.plugin && j.has(m.plugin));
    }), T = D(() => {
      const j = (t.draft.aspects ?? []).map((h) => h.namespace), m = [...new Set(b.value.map(([h]) => h.split(".")[0]))];
      return [...j, ...m.filter((h) => !j.includes(h))].map((h) => ({ value: h, label: E(h) }));
    });
    function O(j) {
      const m = T.value, h = (j.aspects ?? []).filter((L) => !m.some((ue) => ue.value === L));
      return [...m, ...h.map((L) => ({ value: L, label: E(L) }))];
    }
    const B = D(() => new Map(t.options.types.map((j) => [j.id, j.form])));
    function ee(j, m = []) {
      const h = /* @__PURE__ */ new Map();
      return [.../* @__PURE__ */ new Set([...j, ...m])].map((ue) => {
        const [z, ie] = ue.split(".", 2), ae = E(ie ?? z);
        return h.set(ae, (h.get(ae) ?? 0) + 1), { value: ue, label: ae, group: ie ? E(z) : void 0 };
      }).map(({ value: ue, label: z, group: ie }) => ({
        value: ue,
        label: z,
        detail: h.get(z) > 1 ? ie : void 0
      }));
    }
    const N = D(() => {
      const j = /* @__PURE__ */ new Map();
      function m(h, L, ue = [], z = "one") {
        const ie = !!L && L !== "text" && L !== "record" && ue.length === 0 && z === "one";
        j.set(h, ie);
      }
      for (const h of t.draft.aspects ?? [])
        for (const L of h.attributes ?? []) {
          const ue = h.namespace + "." + L.code;
          m(ue, B.value.get(L.type), L.scope, L.cardinality);
        }
      for (const [h, L] of b.value) m(h, L.form, L.scope, L.cardinality);
      return j;
    });
    function _(j) {
      return [...N.value.keys()].filter((m) => j.aspects?.includes(m.split(".")[0]));
    }
    function C(j, m, h) {
      const L = m[h] ?? [], ue = new Set(F(j).flatMap((ie) => [...ie.axes ?? [], ...ie.own ?? []])), z = _(j).filter((ie) => L.includes(ie) || !ue.has(ie) && (h === "own" || N.value.get(ie)));
      return ee(z, L);
    }
    const c = D(() => t.draft.channels ?? []);
    function q(j, m) {
      return c.value.filter((h) => (!h.families?.length || h.families.includes(j.code)) && (!m || h.requirements?.includes(m))).map((h) => E(h.id));
    }
    const K = D(() => t.draft.dimensions ?? []), W = Z({});
    function H(j) {
      (t.draft.families ??= []).push({ code: j, aspects: [] }), W.value[j] = !0;
    }
    function te(j) {
      t.draft.families.splice(t.draft.families.indexOf(j), 1), t.schema.declaration.families?.some((m) => m.code === j.code) && n("remove", "families", j.code);
    }
    function F(j) {
      return j.variation ?? [];
    }
    function oe(j) {
      return F(j).map((m) => ({
        level: m,
        axes: C(j, m, "axes"),
        own: C(j, m, "own")
      }));
    }
    function Q(j) {
      (j.variation ??= []).push({ axes: [] });
    }
    function R(j) {
      return j.requirements ?? [];
    }
    function X(j, m) {
      (j.requirements ??= []).push({ id: m, require: [] });
    }
    function S(j, m) {
      return j.context?.[m] ?? "";
    }
    function V(j, m, h) {
      const L = { ...j.context ?? {} };
      h ? L[m] = h : delete L[m], Object.keys(L).length ? j.context = L : delete j.context;
    }
    return (j, m) => (e(), i("div", pn, [
      f(Me, {
        count: g.value.length,
        columns: ["details"]
      }, Ce({
        default: w(() => [
          (e(!0), i(M, null, se(g.value, (h) => (e(), A(Ee, {
            "route-section": "families",
            "route-id": h.code,
            key: h.code,
            open: W.value[h.code],
            "onUpdate:open": (L) => W.value[h.code] = L,
            title: s(E)(h.code)
          }, {
            details: w(() => [
              l("span", vn, y(_(h).length) + " fields", 1),
              F(h).length ? (e(), A(s(ke), {
                key: 0,
                severity: "secondary",
                value: F(h).length + (F(h).length === 1 ? " variant level" : " variant levels")
              }, null, 8, ["value"])) : u("", !0),
              l("span", fn, y(q(h).join(", ") || "No release channels"), 1)
            ]),
            default: w(() => [
              l("div", bn, [
                l("div", yn, [
                  l("div", gn, [
                    l("div", hn, [
                      l("label", {
                        id: r(h, "groups")
                      }, "Field groups", 8, kn)
                    ]),
                    l("p", {
                      id: r(h, "groups-help"),
                      class: "muted small pim-axis-help"
                    }, "Choose the groups that appear on this family’s product forms.", 8, _n),
                    f(s(aa), {
                      disabled: !x.value,
                      "aria-labelledby": r(h, "groups"),
                      "aria-describedby": r(h, "groups-help"),
                      "model-value": h.aspects ?? [],
                      options: O(h),
                      "option-label": "label",
                      "option-value": "value",
                      placeholder: "Choose field groups",
                      display: "chip",
                      "append-to": "self",
                      "onUpdate:modelValue": (L) => s(Ke)(h, "aspects", L)
                    }, null, 8, ["disabled", "aria-labelledby", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])
                  ]),
                  h.aspects?.length ? (e(), A(s(Y), {
                    key: 0,
                    type: "button",
                    label: "View family fields",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (L) => n("fields", h.code)
                  }, null, 8, ["onClick"])) : u("", !0)
                ])
              ]),
              l("div", wn, [
                m[4] || (m[4] = l("header", { class: "pim-aspect-head" }, [
                  l("h3", null, "Variants")
                ], -1)),
                m[5] || (m[5] = l("p", { class: "muted small pim-axis-help" }, "Choose what makes one variant different from another. Each field can be used once.", -1)),
                l("div", $n, [
                  (e(!0), i(M, null, se(oe(h), ({ level: L, axes: ue, own: z }, ie) => (e(), i("div", {
                    key: ie,
                    class: "pim-level"
                  }, [
                    l("div", Cn, [
                      l("strong", null, "Level " + y(ie + 1), 1),
                      x.value ? (e(), A(s(Y), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove level",
                        onClick: (ae) => F(h).splice(ie, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: w(() => [
                          f(s(de), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : u("", !0)
                    ]),
                    l("div", xn, [
                      l("div", Vn, [
                        l("div", Un, [
                          l("label", {
                            id: r(h, ie + "-axes")
                          }, "Distinguish variants by", 8, jn)
                        ]),
                        m[1] || (m[1] = l("p", { class: "muted small pim-axis-help" }, "Use a field with a single value and no dimensions, such as Integer. Text and record fields are excluded.", -1)),
                        x.value && !ue.length ? (e(), i(M, { key: 0 }, [
                          m[0] || (m[0] = l("p", { class: "muted small pim-axis-help" }, "No eligible field is available in this family. Choose its field group above, or create the field first and choose its group when you return.", -1)),
                          f(s(Y), {
                            type: "button",
                            label: "Create a field in Fields",
                            severity: "secondary",
                            outlined: "",
                            size: "small",
                            class: "pim-form-action",
                            onClick: (ae) => n("variant-field", h.code)
                          }, null, 8, ["onClick"])
                        ], 64)) : (e(), A(Pe, {
                          key: 1,
                          disabled: !x.value,
                          dropdown: "",
                          labelledby: r(h, ie + "-axes"),
                          "model-value": L.axes ?? [],
                          options: ue,
                          placeholder: "Choose a field",
                          "onUpdate:modelValue": (ae) => L.axes = ae
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"]))
                      ]),
                      l("div", Sn, [
                        l("div", An, [
                          l("label", {
                            id: r(h, ie + "-owned")
                          }, "Other fields edited here", 8, On)
                        ]),
                        m[2] || (m[2] = l("p", { class: "muted small pim-axis-help" }, "Other fields you edit at this level.", -1)),
                        f(Pe, {
                          disabled: !x.value,
                          dropdown: "",
                          labelledby: r(h, ie + "-owned"),
                          "model-value": L.own ?? [],
                          options: z,
                          placeholder: "Add a field",
                          "onUpdate:modelValue": (ae) => ae.length ? L.own = ae : delete L.own
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  x.value ? (e(), A(s(Y), {
                    key: 0,
                    type: "button",
                    class: "pim-add-level",
                    onClick: (L) => Q(h),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      f(s(de), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      m[3] || (m[3] = J(" Add level", -1))
                    ]),
                    _: 1
                  }, 8, ["onClick"])) : u("", !0)
                ])
              ]),
              l("div", Rn, [
                m[8] || (m[8] = l("header", { class: "pim-family-requirements-head" }, [
                  l("h3", null, "Release requirements"),
                  l("p", { class: "muted small" }, "Choose what products need before they can be released to a channel.")
                ], -1)),
                l("div", In, [
                  (e(!0), i(M, null, se(R(h), (L, ue) => (e(), i("div", {
                    key: L.id,
                    class: "pim-level"
                  }, [
                    l("div", Pn, [
                      l("div", null, [
                        l("strong", null, y(s(E)(L.id)), 1),
                        l("p", Tn, y(q(h, L.id).join(", ") || "Unused by channels"), 1)
                      ]),
                      x.value ? (e(), A(s(Y), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove requirement",
                        onClick: (z) => R(h).splice(ue, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: w(() => [
                          f(s(de), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : u("", !0)
                    ]),
                    l("div", qn, [
                      (e(!0), i(M, null, se(K.value, (z) => (e(), i("div", {
                        key: z.name,
                        class: "pim-f pim-w-third"
                      }, [
                        l("div", Fn, [
                          l("label", {
                            id: r(h, L.id + "-context-" + z.name)
                          }, y(s(E)(z.name)), 9, Dn)
                        ]),
                        f(s(Ve), {
                          disabled: !x.value,
                          "aria-labelledby": r(h, L.id + "-context-" + z.name),
                          "model-value": S(L, z.name),
                          "onUpdate:modelValue": (ie) => V(L, z.name, ie),
                          options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ...z.members.map((ie) => ({ value: ie, label: String(ie) }))],
                          "option-label": "label",
                          "option-value": "value",
                          appendTo: "self"
                        }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                      ]))), 128)),
                      l("div", Nn, [
                        l("div", zn, [
                          l("label", {
                            id: r(h, L.id + "-required")
                          }, "Required", 8, Ln)
                        ]),
                        m[6] || (m[6] = l("p", { class: "muted small pim-axis-help" }, "These fields must have a value.", -1)),
                        f(Pe, {
                          disabled: !x.value,
                          dropdown: "",
                          labelledby: r(h, L.id + "-required"),
                          "model-value": L.require ?? [],
                          placeholder: "Add a required field",
                          options: ee(_(h), L.require),
                          "onUpdate:modelValue": (z) => s(Ke)(L, "require", z)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]),
                      l("div", Bn, [
                        l("div", Mn, [
                          l("label", {
                            id: r(h, L.id + "-authored")
                          }, "Entered for this context", 8, En)
                        ]),
                        m[7] || (m[7] = l("p", { class: "muted small pim-axis-help" }, "These fields need a value set directly for the selected context.", -1)),
                        f(Pe, {
                          disabled: !x.value,
                          dropdown: "",
                          labelledby: r(h, L.id + "-authored"),
                          "model-value": L.authored ?? [],
                          placeholder: "Add a field to author",
                          options: ee(_(h), L.authored),
                          "onUpdate:modelValue": (z) => s(Ke)(L, "authored", z)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  x.value ? (e(), A(Be, {
                    key: 0,
                    label: "Requirement name",
                    action: "Add requirement",
                    "from-name": "",
                    existing: R(h).map((L) => L.id),
                    onAdd: (L) => X(h, L)
                  }, null, 8, ["existing", "onAdd"])) : u("", !0)
                ])
              ]),
              x.value ? (e(), i("div", Wn, [
                f(s(Y), {
                  type: "button",
                  label: "Remove family",
                  severity: "danger",
                  text: "",
                  size: "small",
                  onClick: (L) => te(h)
                }, null, 8, ["onClick"])
              ])) : u("", !0)
            ]),
            _: 2
          }, 1032, ["route-id", "open", "onUpdate:open", "title"]))), 128))
        ]),
        _: 2
      }, [
        x.value ? {
          name: "head",
          fn: w(() => [
            f(Be, {
              label: "Family name",
              action: "Add family",
              "from-name": "",
              existing: g.value.map((h) => h.code),
              onAdd: H
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])
    ]));
  }
}), Jn = ["inert"], Kn = {
  key: 0,
  class: "row wrap"
}, Gn = {
  key: 2,
  class: "small muted"
}, Yn = { class: "pim-f" }, Zn = ["for"], Qn = ["id"], Xn = /* @__PURE__ */ pe({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(a, { emit: v }) {
    const t = a, n = v, d = Z(!1), r = Z(""), x = Te(), g = Te(), b = Z({});
    let T = 0;
    ye(() => t.modelValue, async (_) => {
      const C = ++T;
      try {
        const c = await sa(t.catalogId ?? "", _);
        C === T && (b.value = c);
      } catch {
        C === T && (b.value = {});
      }
    }, { immediate: !0, deep: !0 }), il(() => {
      T++;
    });
    function O(_) {
      return b.value[_] ?? ce(_, "Person");
    }
    ea(async () => {
      try {
        await Ea("wc-principal-picker"), d.value = !0;
      } catch {
        d.value = !1;
      }
    });
    function B(_) {
      t.disabled || !_.trim() || t.modelValue.includes(_.trim()) || (n("update:modelValue", [...t.modelValue, _.trim()]), r.value = "");
    }
    function ee(_) {
      const C = _.detail;
      if (!C || typeof C != "object") return;
      const c = C, q = c.principal_id ?? c.id;
      typeof q == "string" && B(q);
    }
    function N(_) {
      t.disabled || n("update:modelValue", t.modelValue.filter((C) => C !== _));
    }
    return (_, C) => (e(), i("div", {
      class: "pim-principal-list",
      inert: a.disabled || void 0
    }, [
      a.modelValue.length ? (e(), i("div", Kn, [
        (e(!0), i(M, null, se(a.modelValue, (c) => (e(), A(s(ke), {
          key: c,
          severity: "secondary"
        }, {
          default: w(() => [
            l("span", null, y(O(c)), 1),
            f(s(Y), {
              text: "",
              size: "small",
              disabled: a.disabled,
              "aria-label": "Remove " + O(c),
              onClick: (q) => N(c)
            }, {
              default: w(() => [
                f(s(de), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : u("", !0),
      d.value ? (e(), i("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: Le(ee, ["stop"])
      }, null, 32)) : (e(), i("span", Gn, "The person picker is unavailable.")),
      l("div", Yn, [
        l("label", {
          for: s(x),
          class: "small muted"
        }, "Service account ID", 8, Zn),
        f(s(tl), {
          modelValue: r.value,
          "onUpdate:modelValue": C[0] || (C[0] = (c) => r.value = c),
          id: s(x),
          "aria-describedby": s(g),
          disabled: a.disabled,
          onKeydown: C[1] || (C[1] = rl(Le((c) => B(r.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "id", "aria-describedby", "disabled"]),
        l("p", {
          id: s(g),
          class: "small muted pim-axis-help"
        }, "Ask whoever manages the service account for its principal ID.", 8, Qn)
      ]),
      f(s(Y), {
        type: "button",
        severity: "secondary",
        outlined: "",
        size: "small",
        class: "pim-form-action",
        disabled: a.disabled || !r.value.trim(),
        onClick: C[2] || (C[2] = (c) => B(r.value))
      }, {
        default: w(() => [
          f(s(de), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          C[3] || (C[3] = J(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, Jn));
  }
}), eo = { class: "pim-stack" }, lo = { class: "muted small" }, ao = { class: "muted small" }, to = { class: "pim-fields" }, so = { class: "pim-f pim-w-half" }, io = { class: "pim-f-label" }, no = ["id"], oo = { class: "muted small pim-axis-help" }, ro = { class: "pim-f pim-w-half" }, uo = { class: "pim-f-label" }, co = ["id"], mo = { class: "muted small" }, po = { class: "muted small" }, vo = { class: "pim-fields" }, fo = ["aria-labelledby", "aria-describedby"], bo = { class: "pim-f-label" }, yo = ["id"], go = ["id"], ho = { key: 1 }, ko = { class: "pim-f pim-w-half" }, _o = { class: "pim-f-label" }, wo = ["id"], $o = { class: "pim-f pim-w-full" }, Co = { class: "mono" }, xo = { class: "pim-f pim-w-half" }, Vo = { class: "pim-f-label" }, Uo = ["id"], jo = { class: "pim-f pim-w-half" }, So = { class: "pim-f-label" }, Ao = ["for"], Oo = { class: "row" }, Ro = /* @__PURE__ */ pe({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {},
    view: {}
  },
  emits: ["remove", "requirements"],
  setup(a, { emit: v }) {
    const t = a, n = v, d = Te();
    function r(H, te) {
      return d + "-" + H + "-" + te;
    }
    const x = D(() => t.schema.access.admin), g = D(() => t.draft.channels ?? []), b = D(() => t.draft.sources ?? []), T = D(() => {
      const H = /* @__PURE__ */ new Map();
      for (const te of t.draft.families ?? [])
        for (const { id: F } of te.requirements ?? []) {
          const oe = H.get(F) ?? [];
          oe.push(E(te.code)), H.set(F, oe);
        }
      return new Map([...H].map(([te, F]) => [te, E(te) + " · " + F.join(", ")]));
    }), O = D(() => [...T.value].map(([H, te]) => ({ value: H, label: te }))), B = D(() => (t.draft.families ?? []).filter((H) => H.code !== "generic").map((H) => ({ value: H.code, label: E(H.code) }))), ee = D(() => (t.draft.aspects ?? []).map((H) => ({ value: H.namespace, label: E(H.namespace) }))), N = Z({}), _ = Z({});
    function C(H) {
      const te = H.principals?.length ?? 0;
      return te ? te + (te === 1 ? " allowed account" : " allowed accounts") : "Any catalog writer";
    }
    function c(H) {
      (t.draft.channels ??= []).push({ id: H, requirements: [] }), N.value[H] = !0;
    }
    function q(H) {
      g.value.splice(g.value.indexOf(H), 1), t.schema.declaration.channels?.some((te) => te.id === H.id) && n("remove", "channels", H.id);
    }
    function K(H) {
      (t.draft.sources ??= []).push({ id: H, ordering: "none", writes: [] }), _.value[H] = !0;
    }
    function W(H) {
      b.value.splice(b.value.indexOf(H), 1), t.schema.declaration.sources?.some((te) => te.id === H.id) && n("remove", "sources", H.id);
    }
    return (H, te) => (e(), i("div", eo, [
      a.view !== "sources" ? (e(), A(Me, {
        key: 0,
        count: g.value.length,
        columns: ["details"]
      }, Ce({
        default: w(() => [
          (e(!0), i(M, null, se(g.value, (F) => (e(), A(Ee, {
            key: F.id,
            open: N.value[F.id],
            "onUpdate:open": (oe) => N.value[F.id] = oe,
            "route-section": "channels",
            "route-id": F.id,
            title: s(E)(F.id)
          }, Ce({
            details: w(() => [
              l("span", lo, y(F.families?.length ? F.families.map(s(E)).join(", ") : "All families"), 1),
              l("span", ao, y(F.requirements?.length ? F.requirements.map((oe) => T.value.get(oe) ?? s(E)(oe)).join(", ") : "No release requirements"), 1)
            ]),
            default: w(() => [
              l("div", to, [
                l("div", so, [
                  l("div", io, [
                    l("label", {
                      id: r(F.id, "requirements")
                    }, "Release requirements", 8, no)
                  ]),
                  l("p", oo, y(O.value.length ? "Choose what products must meet before release to this channel." : "No family has defined a release requirement yet."), 1),
                  O.value.length || F.requirements?.length ? (e(), A(Pe, {
                    key: 0,
                    disabled: !x.value,
                    labelledby: r(F.id, "requirements"),
                    "model-value": F.requirements ?? [],
                    options: O.value,
                    "onUpdate:modelValue": (oe) => s(Ke)(F, "requirements", oe)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])) : u("", !0),
                  x.value ? (e(), A(s(Y), {
                    key: 1,
                    type: "button",
                    label: "Create a requirement in Families",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    class: "pim-form-action",
                    onClick: (oe) => n("requirements", F.id)
                  }, null, 8, ["onClick"])) : u("", !0)
                ]),
                l("div", ro, [
                  l("div", uo, [
                    l("label", {
                      id: r(F.id, "families")
                    }, "Families", 8, co)
                  ]),
                  te[0] || (te[0] = l("p", { class: "muted small pim-axis-help" }, "Applies to every family unless you choose specific families.", -1)),
                  f(Pe, {
                    disabled: !x.value,
                    labelledby: r(F.id, "families"),
                    "model-value": F.families ?? [],
                    options: B.value,
                    "onUpdate:modelValue": (oe) => s(Ke)(F, "families", oe)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            x.value ? {
              name: "actions",
              fn: w(() => [
                f(s(Y), {
                  type: "button",
                  onClick: (oe) => q(F),
                  "aria-label": "Remove " + s(E)(F.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    f(s(de), { icon: "tabler:trash" })
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
        x.value ? {
          name: "head",
          fn: w(() => [
            f(Be, {
              label: "Channel name",
              action: "Add channel",
              "from-name": "",
              existing: g.value.map((F) => F.id),
              onAdd: c
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])) : u("", !0),
      a.view !== "channels" ? (e(), A(Me, {
        key: 1,
        count: b.value.length,
        columns: ["details"]
      }, Ce({
        default: w(() => [
          (e(!0), i(M, null, se(b.value, (F) => (e(), A(Ee, {
            key: F.id,
            open: _.value[F.id],
            "onUpdate:open": (oe) => _.value[F.id] = oe,
            "route-section": "sources",
            "route-id": F.id,
            title: s(E)(F.id)
          }, Ce({
            details: w(() => [
              l("span", mo, y(C(F)), 1),
              l("span", po, y(F.writes?.length ? F.writes.map(s(E)).join(", ") : "No writable field groups"), 1)
            ]),
            default: w(() => [
              l("div", vo, [
                l("div", {
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": r(F.id, "people"),
                  "aria-describedby": r(F.id, "people-help")
                }, [
                  l("div", bo, [
                    l("label", {
                      id: r(F.id, "people")
                    }, "People and service accounts", 8, yo)
                  ]),
                  l("p", {
                    id: r(F.id, "people-help"),
                    class: "muted small pim-axis-help"
                  }, "If you leave this empty, anyone who can write to the catalog can use this source.", 8, go),
                  x.value ? (e(), A(Xn, {
                    key: 0,
                    "catalog-id": a.catalogId,
                    "model-value": F.principals ?? [],
                    "onUpdate:modelValue": (oe) => s(Ke)(F, "principals", oe)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])) : (e(), i("span", ho, y(C(F)), 1))
                ], 8, fo),
                l("div", ko, [
                  l("div", _o, [
                    l("label", {
                      id: r(F.id, "writes")
                    }, "Field groups it can update", 8, wo)
                  ]),
                  te[1] || (te[1] = l("p", { class: "muted small pim-axis-help" }, "If you leave this empty, this source cannot update any field values.", -1)),
                  f(Pe, {
                    disabled: !x.value,
                    labelledby: r(F.id, "writes"),
                    "model-value": F.writes ?? [],
                    options: ee.value,
                    "onUpdate:modelValue": (oe) => s(Ke)(F, "writes", oe)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                l("div", $o, [
                  te[2] || (te[2] = l("div", { class: "pim-f-label" }, [
                    l("strong", null, "Source identifier")
                  ], -1)),
                  te[3] || (te[3] = l("p", { class: "muted small pim-axis-help" }, [
                    J("Send this exact identifier in the "),
                    l("code", null, "source"),
                    J(" field of the update request.")
                  ], -1)),
                  l("div", null, [
                    l("code", Co, y(F.id), 1)
                  ])
                ]),
                l("div", xo, [
                  l("div", Vo, [
                    l("label", {
                      id: r(F.id, "ordering")
                    }, "Handle incoming updates", 8, Uo)
                  ]),
                  te[4] || (te[4] = l("p", { class: "muted small pim-axis-help" }, "Use the sender’s sequence numbers to prevent late deliveries from overwriting newer values.", -1)),
                  f(s(Ve), {
                    disabled: !x.value,
                    "aria-labelledby": r(F.id, "ordering"),
                    "model-value": F.ordering ?? "none",
                    "onUpdate:modelValue": (oe) => F.ordering = oe,
                    options: [{ value: "none", label: "Use arrival order" }, { value: "sequence", label: "Use the source’s sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                l("div", jo, [
                  l("div", So, [
                    l("label", {
                      for: r(F.id, "audit")
                    }, "Track value changes", 8, Ao)
                  ]),
                  l("div", Oo, [
                    f(s(ul), {
                      disabled: !x.value,
                      "input-id": r(F.id, "audit"),
                      "model-value": F.audit !== !1,
                      "onUpdate:modelValue": (oe) => oe ? delete F.audit : F.audit = !1
                    }, null, 8, ["disabled", "input-id", "model-value", "onUpdate:modelValue"]),
                    l("span", null, y(F.audit === !1 ? "Off for this source" : "Follow catalog audit settings"), 1)
                  ])
                ])
              ])
            ]),
            _: 2
          }, [
            x.value ? {
              name: "actions",
              fn: w(() => [
                f(s(Y), {
                  type: "button",
                  onClick: (oe) => W(F),
                  "aria-label": "Remove " + s(E)(F.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    f(s(de), { icon: "tabler:trash" })
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
        x.value ? {
          name: "head",
          fn: w(() => [
            f(Be, {
              label: "Source name",
              action: "Add source",
              "from-name": "",
              existing: b.value.map((F) => F.id),
              onAdd: K
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])) : u("", !0)
    ]));
  }
}), Io = {
  failed: { label: "Setup failed", severity: "danger" },
  paused: { label: "Background update paused", severity: "warn" },
  degraded: { label: "Degraded", severity: "warn" },
  catchingUp: { label: "Catching up", severity: "info" },
  config: { label: "Configuration needed", severity: "warn" },
  reset: { label: "Reset required", severity: "warn" },
  uninstalled: { label: "Uninstalled · still referenced", severity: "warn" },
  pending: { label: "Setting up", severity: "info" }
};
function da(a, v) {
  return !a.parked && (a.bootstrapping || a.last_seq < v);
}
function Po(a, v) {
  return !a.active || !a.installed || a.problem || a.lifecycle.state === "failed" ? !1 : a.lifecycle.state === "pending" || Object.values(a.projections).some((t) => da(t, v));
}
function To(a, v) {
  const t = a.problem ?? a.lifecycle.error, n = Object.entries(a.projections), d = n.find(([, x]) => x.parked) ?? n.find(([, x]) => x.error) ?? n.find(([, x]) => da(x, v));
  let r;
  return a.active && !a.installed ? r = "uninstalled" : t?.code === "plugin_config_invalid" ? r = "config" : t?.code === "plugin_projection_history_pruned" ? r = "reset" : t || a.lifecycle.state === "failed" ? r = "failed" : a.active && d?.[1].parked ? r = "paused" : a.active && d?.[1].error ? r = "degraded" : a.active && d ? r = "catchingUp" : a.active && a.lifecycle.state === "pending" && (r = "pending"), r ? { kind: r, ...Io[r], error: t, projection: d } : void 0;
}
function qo(a) {
  return (a.problem ?? a.lifecycle.error)?.code === "plugin_interface_version_unsupported";
}
const Fo = { class: "pim-stack" }, Do = { class: "pim-bsection-head" }, No = {
  key: 0,
  class: "pim-aspect muted"
}, zo = {
  key: 0,
  class: "muted small"
}, Lo = { class: "pim-stack pim-plugin-recovery" }, Bo = {
  key: 0,
  class: "muted small"
}, Mo = {
  key: 1,
  class: "muted small"
}, Eo = { key: 0 }, Wo = { key: 1 }, Ho = { key: 0 }, Jo = { key: 0 }, Ko = { key: 0 }, Go = { key: 1 }, Yo = { key: 2 }, Zo = { key: 3 }, Qo = { key: 0 }, Xo = { class: "pim-stack" }, ed = { key: 0 }, ld = { key: 1 }, ad = {
  key: 0,
  class: "muted small"
}, td = {
  key: 0,
  class: "pim-ia-dialog"
}, sd = { class: "pim-ia-dialog-head" }, id = { key: 1 }, nd = { key: 2 }, od = { class: "row pim-ia-dialog-actions" }, dd = {
  key: 0,
  class: "pim-aspect muted"
}, rd = { class: "row wrap muted small" }, ud = /* @__PURE__ */ pe({
  __name: "BuilderPlugins",
  props: {
    draft: {},
    schema: {},
    options: {},
    pluginConfigs: { default: () => ({}) },
    refusal: {},
    stale: { type: Boolean }
  },
  emits: ["remove", "reset", "resume", "refresh", "review", "clearShellBinding", "clearRefusal"],
  setup(a, { emit: v }) {
    const t = a, n = v, d = /* @__PURE__ */ new Map([
      ["eq", "Equals"],
      ["in", "Is one of"],
      ["gt", "Greater than"],
      ["gte", "At least"],
      ["lt", "Less than"],
      ["lte", "At most"]
    ]), r = Z({});
    ye(() => t.refusal, (Q) => {
      Q && (r.value[Q.plugin] = !0);
    }, { immediate: !0 });
    const x = Z(), g = D(() => C.value.find((Q) => Q.plugin.plugin === x.value)), b = D(() => g.value?.plugin), T = D(() => t.options.plugins.filter((Q) => Q.installed).length), O = D(() => t.schema.plugins.filter((Q) => Q.active).length), B = D(() => t.schema.access.admin), ee = D(() => t.draft.plugins ?? []), N = D(() => new Map(t.schema.plugins.map((Q) => [Q.plugin, Q]))), _ = D(() => {
      const Q = /* @__PURE__ */ new Map();
      for (const [R, X] of Object.entries(t.schema.attributes)) {
        if (!X.plugin) continue;
        const S = Q.get(X.plugin) ?? [];
        S.push(E(R)), Q.set(X.plugin, S);
      }
      return Q;
    }), C = D(() => t.options.plugins.map((Q) => {
      const R = N.value.get(Q.plugin) ?? Q, X = To(R, t.schema.as_of), S = ee.value.some((j) => j.use === R.plugin), V = t.refusal?.plugin === R.plugin ? t.refusal : void 0;
      return {
        option: Q,
        plugin: R,
        status: X,
        chosen: S,
        refusal: V,
        title: ce(R.title ?? Q.title, R.installed ? "Plugin" : "Unavailable plugin"),
        label: V ? "Configuration needed" : !R.active && X?.kind === "failed" ? "Unavailable" : X?.label ?? (S ? R.active ? "Enabled" : "Will enable on apply" : R.active ? "Will disable on apply" : "Disabled"),
        severity: V ? "warn" : X?.severity ?? (S ? "success" : "secondary")
      };
    }));
    function c(Q, R) {
      const X = R.map((S) => d.get(S)).filter(Boolean);
      return [E(Q), X.join(", ")].filter(Boolean).join(" · ");
    }
    function q(Q, R) {
      R && !ee.value.some((X) => X.use === Q) && ((t.draft.plugins ??= []).push({ use: Q }), r.value[Q] = !0), R || (r.value[Q] = !1, t.draft.plugins = ee.value.filter((X) => X.use !== Q), delete t.pluginConfigs[Q], t.refusal?.plugin === Q && n("clearRefusal"), N.value.get(Q)?.active && n("remove", "plugins", Q));
    }
    function K(Q, R) {
      r.value[Q] = !0, t.pluginConfigs[Q] = R, t.refusal?.plugin === Q && n("clearRefusal");
    }
    const W = D(() => t.draft.scopes ?? []);
    function H(Q) {
      return W.value.includes(Q.id);
    }
    function te(Q, R) {
      R && !H(Q) && (t.draft.scopes ??= []).push(Q.id), !R && H(Q) && (W.value.splice(W.value.indexOf(Q.id), 1), t.schema.declaration.scopes?.includes(Q.id) && n("remove", "scopes", Q.id));
    }
    const F = D(() => {
      const Q = b.value;
      if (!Q) return [];
      const R = Q.references;
      return [
        { label: "Fields", items: (R?.fields ?? Object.entries(t.schema.attributes).filter(([, S]) => S.plugin === Q.plugin).map(([S]) => S)).map((S) => ({ id: S, title: ce(E(S), "Field") })) },
        { label: "Product filter sets", items: (R?.scopes ?? []).map((S) => ({
          id: S,
          title: ce(t.options.scopes.find((V) => V.id === S)?.title, "Unavailable filter set")
        })) },
        { label: "Catalog app binding", items: (R?.shell_bindings ?? []).map((S) => ({ id: S, title: "Catalog app" })) },
        { label: "Readiness checks", items: (R?.checks ?? []).map((S) => ({ id: S, title: "Readiness check" })) },
        { label: "Dependent plugins", items: (R?.plugins ?? []).map((S) => ({
          id: S,
          title: ce(N.value.get(S)?.title, "Dependent plugin")
        })) }
      ].filter((S) => S.items.length);
    });
    function oe(Q) {
      for (const R of Q.references?.scopes ?? [])
        W.value.includes(R) && (t.draft.scopes = W.value.filter((X) => X !== R), n("remove", "scopes", R));
      x.value = void 0, q(Q.plugin, !1), n("review");
    }
    return (Q, R) => (e(), i("div", Fo, [
      f(Me, {
        count: C.value.length,
        columns: ["details"]
      }, {
        head: w(() => [
          l("header", Do, [
            l("h3", null, y(T.value) + " installed · " + y(O.value) + " enabled here", 1)
          ])
        ]),
        default: w(() => [
          C.value.length === 0 ? (e(), i("div", No, "No plugin is installed.")) : u("", !0),
          (e(!0), i(M, null, se(C.value, ({ option: X, plugin: S, status: V, chosen: j, title: m, label: h, severity: L, refusal: ue }) => (e(), A(Ee, {
            "route-section": "plugins",
            "route-id": S.plugin,
            key: S.plugin,
            title: m,
            open: r.value[S.plugin] ?? (j && (!S.active || !!a.pluginConfigs[S.plugin]) || !!(S.active && V && V.kind !== "pending")),
            "onUpdate:open": (z) => r.value[S.plugin] = z
          }, Ce({
            details: w(() => [
              f(s(ke), {
                severity: L,
                value: h
              }, null, 8, ["severity", "value"]),
              !V && X.description ? (e(), i("span", zo, y(s(ce)(X.description, "Adds capabilities to this catalog.")), 1)) : u("", !0)
            ]),
            default: w(() => [
              l("div", Lo, [
                _.value.get(S.plugin)?.length ? (e(), i("p", Bo, " Adds fields for " + y(_.value.get(S.plugin)?.join(", ")) + ". ", 1)) : u("", !0),
                S.active && V?.kind === "failed" && V.projection?.[1].parked ? (e(), i("p", Mo, " Background update: Paused ")) : u("", !0),
                V?.kind === "failed" ? (e(), i(M, { key: 2 }, [
                  f(s(Ue), {
                    severity: "warn",
                    role: "alert"
                  }, {
                    default: w(() => [
                      s(qo)(S) ? (e(), i(M, { key: 0 }, [
                        J("This package uses a plugin interface this deployment cannot run. Restore a compatible package to use this plugin.")
                      ], 64)) : (e(), i(M, { key: 1 }, [
                        J("The catalog could not set up this plugin. Check the status after resolving the setup problem.")
                      ], 64))
                    ]),
                    _: 2
                  }, 1024),
                  f(xe, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: w(() => [
                      l("p", null, [
                        R[6] || (R[6] = J("Plugin ", -1)),
                        l("code", null, y(S.plugin), 1)
                      ]),
                      V.error?.message ? (e(), i("p", Eo, y(V.error.message), 1)) : u("", !0),
                      V.error?.code ? (e(), i("p", Wo, [
                        l("code", null, y(V.error.code), 1)
                      ])) : u("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  B.value && S.references ? (e(), A(s(Y), {
                    key: 0,
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (z) => x.value = S.plugin
                  }, null, 8, ["onClick"])) : (e(), A(s(Y), {
                    key: 1,
                    label: "Check status",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: R[0] || (R[0] = (z) => n("refresh"))
                  }))
                ], 64)) : V?.kind === "reset" ? (e(), i(M, { key: 3 }, [
                  f(s(Ue), { severity: "warn" }, {
                    default: w(() => [
                      R[7] || (R[7] = J(" The event history this background update needs was removed. ", -1)),
                      V.error?.max_pruned_seq !== void 0 ? (e(), i("p", Ho, "Earliest retained position " + y(V.error.max_pruned_seq + 1) + ".", 1)) : u("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  f(xe, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: w(() => [
                      l("p", null, [
                        R[8] || (R[8] = J("Plugin ", -1)),
                        l("code", null, y(S.plugin), 1)
                      ]),
                      V.error?.projection ? (e(), i("p", Jo, [
                        R[9] || (R[9] = J("Background update ", -1)),
                        l("code", null, y(V.error.projection), 1)
                      ])) : u("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  B.value ? (e(), A(s(Y), {
                    key: 0,
                    label: "Reset background updates",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: a.stale,
                    onClick: (z) => n("reset", S.plugin)
                  }, null, 8, ["disabled", "onClick"])) : u("", !0)
                ], 64)) : V?.projection && (V.kind === "paused" || V.kind === "degraded" || V.kind === "catchingUp") ? (e(), i(M, { key: 4 }, [
                  f(s(Ue), {
                    severity: V.kind === "catchingUp" ? "info" : "warn"
                  }, {
                    default: w(() => [
                      V.projection[1].status === "paused" ? (e(), i("p", Ko, "This update was paused.")) : V.kind === "paused" ? (e(), i("p", Go, "The background worker stopped.")) : V.kind === "degraded" ? (e(), i("p", Yo, "The background worker reported an error.")) : (e(), i("p", Zo, "This update is processing catalog changes.")),
                      l("p", null, "Last applied position " + y(V.projection[1].last_seq) + ".", 1)
                    ]),
                    _: 2
                  }, 1032, ["severity"]),
                  f(xe, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: w(() => [
                      l("p", null, [
                        R[10] || (R[10] = J("Background update ", -1)),
                        l("code", null, y(V.projection[0]), 1)
                      ]),
                      V.projection[1].error ? (e(), i("p", Qo, y(V.projection[1].error), 1)) : u("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  B.value && V.projection[1].status === "paused" && V.projection[1].cursor_id ? (e(), A(s(Y), {
                    key: 0,
                    label: "Resume background update",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: a.stale,
                    onClick: (z) => n("resume", V.projection[1].cursor_id)
                  }, null, 8, ["disabled", "onClick"])) : V.kind === "paused" && B.value ? (e(), A(s(Y), {
                    key: 1,
                    label: "Reset background updates",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: a.stale,
                    onClick: (z) => n("reset", S.plugin)
                  }, null, 8, ["disabled", "onClick"])) : (e(), A(s(Y), {
                    key: 2,
                    label: "Check status",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: R[1] || (R[1] = (z) => n("refresh"))
                  }))
                ], 64)) : V?.kind === "uninstalled" ? (e(), i(M, { key: 5 }, [
                  f(s(Ue), { severity: "warn" }, {
                    default: w(() => [...R[11] || (R[11] = [
                      J("The package was removed while it was still enabled for this catalog.", -1)
                    ])]),
                    _: 1
                  }),
                  f(s(Y), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (z) => x.value = S.plugin
                  }, null, 8, ["onClick"])
                ], 64)) : u("", !0),
                S.installed && (!V || V.kind === "pending") ? (e(), A(xe, {
                  key: 6,
                  class: "small pim-ia-disclosure",
                  label: "Technical details"
                }, {
                  default: w(() => [
                    l("dl", Xo, [
                      l("div", null, [
                        R[12] || (R[12] = l("dt", null, "Plugin ID", -1)),
                        l("dd", null, [
                          l("code", null, y(S.plugin), 1)
                        ])
                      ]),
                      (S.interface_version ?? X.interface_version) != null ? (e(), i("div", ed, [
                        R[13] || (R[13] = l("dt", null, "Interface version", -1)),
                        l("dd", null, y(S.interface_version ?? X.interface_version), 1)
                      ])) : u("", !0),
                      R[15] || (R[15] = l("div", null, [
                        l("dt", null, "Configuration tool"),
                        l("dd", null, [
                          l("code", null, "PIMConfigurePlugin")
                        ])
                      ], -1)),
                      S.tools.length ? (e(), i("div", ld, [
                        R[14] || (R[14] = l("dt", null, "Plugin tools", -1)),
                        l("dd", null, [
                          l("ul", null, [
                            (e(!0), i(M, null, se(S.tools, (z) => (e(), i("li", { key: z }, [
                              l("code", null, y(z), 1)
                            ]))), 128))
                          ])
                        ])
                      ])) : u("", !0)
                    ])
                  ]),
                  _: 2
                }, 1024)) : u("", !0),
                j && S.installed && V?.kind !== "failed" && V?.kind !== "uninstalled" ? (e(), i(M, { key: 7 }, [
                  B.value && X.config_schema.properties && Object.keys(X.config_schema.properties).length ? (e(), i(M, { key: 0 }, [
                    S.plugin === "kickside.pim.inventory:plugin" ? (e(), i("p", ad, " Hold seconds sets the default and maximum time stock stays set aside after an inventory reservation starts. Leave it empty to use the deployment default. ")) : u("", !0),
                    R[16] || (R[16] = l("p", { class: "muted small" }, "Choose Review changes, then Apply changes to save this configuration.", -1))
                  ], 64)) : u("", !0),
                  f(Ol, {
                    disabled: !B.value,
                    schema: X.config_schema,
                    "model-value": a.pluginConfigs[S.plugin] ?? S.config ?? {},
                    problem: V?.kind === "config" ? V.error : void 0,
                    "plugin-id": V?.kind === "config" ? S.plugin : void 0,
                    "problem-label": V?.error?.field && V.error.field !== "config" ? s(sl)(X.config_schema, V.error.field) : void 0,
                    refusal: ue ? s(sl)(X.config_schema, ue.field) + ": " + ue.message : void 0,
                    "onUpdate:modelValue": (z) => K(S.plugin, z)
                  }, null, 8, ["disabled", "schema", "model-value", "problem", "plugin-id", "problem-label", "refusal", "onUpdate:modelValue"])
                ], 64)) : u("", !0)
              ])
            ]),
            _: 2
          }, [
            B.value && S.installed && (!V || V.kind === "pending") ? {
              name: "actions",
              fn: w(() => [
                f(s(ul), {
                  "aria-label": "Enable " + m,
                  "model-value": j,
                  "onUpdate:modelValue": (z) => q(S.plugin, z)
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "title", "open", "onUpdate:open"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      f(bl, {
        visible: !!b.value,
        label: "Plugin references",
        onClose: R[5] || (R[5] = (X) => x.value = void 0)
      }, {
        default: w(() => [
          g.value && b.value ? (e(), i("section", td, [
            l("header", sd, [
              l("div", null, [
                R[17] || (R[17] = l("h2", null, "Plugin references", -1)),
                l("p", null, y(g.value.title), 1)
              ])
            ]),
            F.value.length ? (e(), i(M, { key: 0 }, [
              R[18] || (R[18] = l("p", null, "Replace or remove these references before deactivating the plugin. You can also restore the package to keep using them.", -1)),
              (e(!0), i(M, null, se(F.value, (X) => (e(), i("div", {
                key: X.label
              }, [
                l("h3", null, y(X.label), 1),
                l("ul", null, [
                  (e(!0), i(M, null, se(X.items, (S) => (e(), i("li", {
                    key: S.id
                  }, y(S.title), 1))), 128))
                ])
              ]))), 128))
            ], 64)) : (e(), i("p", id, "Use the catalog review to see what deactivating this plugin would change.")),
            b.value.references?.scopes.length && !b.value.references?.shell_bindings.length ? (e(), i("p", nd, "Reviewing removal also includes these product filter sets.")) : u("", !0),
            f(xe, {
              class: "small pim-error-code pim-ia-disclosure",
              label: "Technical details"
            }, {
              default: w(() => [
                l("p", null, [
                  R[19] || (R[19] = J("Plugin ", -1)),
                  l("code", null, y(b.value.plugin), 1)
                ]),
                (e(!0), i(M, null, se(F.value, (X) => (e(), i("div", {
                  key: X.label
                }, [
                  l("p", null, y(X.label), 1),
                  l("ul", null, [
                    (e(!0), i(M, null, se(X.items, (S) => (e(), i("li", {
                      key: S.id
                    }, [
                      l("code", null, y(S.id), 1)
                    ]))), 128))
                  ])
                ]))), 128))
              ]),
              _: 1
            }),
            l("div", od, [
              B.value && b.value.references?.shell_bindings.length ? (e(), A(s(Y), {
                key: 0,
                label: "Clear catalog app binding",
                severity: "secondary",
                outlined: "",
                disabled: a.stale,
                onClick: R[2] || (R[2] = (X) => n("clearShellBinding", b.value.references.shell_bindings[0]))
              }, null, 8, ["disabled"])) : B.value ? (e(), A(s(Y), {
                key: 1,
                label: "Review removal",
                disabled: a.stale,
                onClick: R[3] || (R[3] = (X) => oe(b.value))
              }, null, 8, ["disabled"])) : u("", !0),
              f(s(Y), {
                label: "Close",
                severity: "secondary",
                outlined: "",
                onClick: R[4] || (R[4] = (X) => x.value = void 0)
              })
            ])
          ])) : u("", !0)
        ]),
        _: 1
      }, 8, ["visible"]),
      f(Me, {
        count: a.options.scopes.length,
        columns: ["details"]
      }, {
        head: w(() => [
          R[21] || (R[21] = l("header", { class: "pim-bsection-head" }, [
            l("h3", null, "Product filter sets"),
            l("span", { class: "muted small" }, "Choose additional ways to filter products.")
          ], -1)),
          f(xe, {
            class: "small pim-ia-disclosure",
            label: "Filter set technical details"
          }, {
            default: w(() => [...R[20] || (R[20] = [
              l("p", null, [
                J("Product filter sets are "),
                l("code", null, "scopes"),
                J(" in "),
                l("code", null, "PIMQuery"),
                J(". Use the filter set ID in "),
                l("code", null, "scopes[].id"),
                J(".")
              ], -1)
            ])]),
            _: 1
          })
        ]),
        default: w(() => [
          a.options.scopes.length === 0 ? (e(), i("div", dd, "No product filter sets are available.")) : u("", !0),
          (e(!0), i(M, null, se(a.options.scopes, (X) => (e(), A(Ee, {
            "route-section": "plugins",
            "route-id": "scope:" + X.id,
            key: X.id,
            title: s(ce)(X.title, "Filter set")
          }, Ce({
            details: w(() => [
              f(s(ke), {
                severity: H(X) ? "success" : "secondary",
                value: H(X) ? "Selected" : "Available"
              }, null, 8, ["severity", "value"])
            ]),
            default: w(() => [
              l("div", rd, [
                R[22] || (R[22] = l("span", null, "Filters", -1)),
                (e(!0), i(M, null, se(X.filters, (S, V) => (e(), A(s(ke), {
                  key: V,
                  class: "kx-tag-sm small",
                  severity: "secondary",
                  value: c(V, S.ops)
                }, null, 8, ["value"]))), 128)),
                l("span", null, y(s(E)(X.access)) + " access required", 1)
              ]),
              f(xe, {
                class: "small pim-ia-disclosure",
                label: "Technical details"
              }, {
                default: w(() => [
                  l("p", null, [
                    R[23] || (R[23] = J("Filter set ID ", -1)),
                    l("code", null, y(X.id), 1)
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, [
            B.value ? {
              name: "actions",
              fn: w(() => [
                f(s(ul), {
                  "aria-label": "Use " + s(ce)(X.title, "Filter set"),
                  "model-value": H(X),
                  "onUpdate:modelValue": (S) => te(X, S)
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
async function cd(a) {
  const v = await Sa(`/api/v1/pim-admin/catalogs/${encodeURIComponent(a)}/policy_defaults`, "policy defaults");
  if (v.audit !== "fields" && v.audit !== "off" || !["audit_days", "trash_days", "tombstone_days"].every((t) => typeof v[t] == "number" && Number.isSafeInteger(v[t])))
    throw new Error("Policy defaults are unavailable.");
  for (const [t, n] of Object.entries(ra)) {
    const d = v[t];
    if (typeof d != "number" || !Number.isSafeInteger(d) || d < n.min || d > n.max) throw new Error(`Policy ${t} is unavailable.`);
  }
  return v;
}
const ra = {
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
}, md = { class: "form" }, pd = {
  key: 0,
  class: "muted small pim-policy-intro"
}, vd = {
  key: 1,
  class: "muted small pim-policy-status",
  role: "status"
}, fd = {
  key: 0,
  class: "pim-bsection-head"
}, bd = { class: "pim-policy-copy" }, yd = ["for"], gd = ["id"], hd = { key: 0 }, kd = {
  key: 0,
  class: "pim-policy-value"
}, _d = {
  key: 0,
  class: "muted small"
}, wd = /* @__PURE__ */ pe({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {},
    disabled: { type: Boolean },
    defaultsOnly: { type: Boolean }
  },
  setup(a) {
    const v = a, t = Z(), n = D(() => v.defaults ?? t.value), d = Z(), r = Z(!1);
    async function x() {
      if (!(v.defaults || v.disabled)) {
        d.value = void 0, r.value = !0;
        try {
          t.value = await cd(v.catalogId ?? "");
        } catch (c) {
          d.value = Ge(c, "Could not read policy defaults.");
        } finally {
          r.value = !1;
        }
      }
    }
    ea(x);
    const g = D(() => v.draft.policy ?? {}), b = [
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
    function O(c) {
      const q = ra[c];
      return { key: c, ...q, kind: "int", hint: T[c] };
    }
    b.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(O));
    const B = ["proposal_days", "proposal_count"].map(O), ee = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(O), N = [
      { id: "retention", title: "Retention", keys: b },
      { id: "proposals", title: "Proposals", keys: B },
      { id: "advanced", title: "", keys: ee }
    ], _ = D(() => [
      { value: "inherited", label: n.value ? `${n.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function C(c, q) {
      const K = v.draft.policy ?? (v.draft.policy = {});
      K[c] = q == null || q === "" || q === "inherited" ? !1 : q;
    }
    return (c, q) => (e(), i("section", md, [
      a.defaultsOnly ? u("", !0) : (e(), i("p", pd, "Empty fields inherit the deployment settings.")),
      r.value ? (e(), i("p", vd, "Loading deployment defaults…")) : u("", !0),
      d.value ? (e(), A(gl, {
        key: 2,
        error: d.value
      }, {
        default: w(() => [
          f(s(Y), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: x
          }, {
            default: w(() => [...q[0] || (q[0] = [
              J("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : u("", !0),
      (e(), i(M, null, se(N, (K) => f(Zl(K.id === "advanced" ? xe : "section"), La({
        key: K.id,
        ref_for: !0
      }, K.id === "advanced" ? { label: "Advanced processing settings" } : { "aria-label": K.title }, {
        "data-policy-group": K.id,
        class: "pim-policy-group"
      }), {
        default: w(() => [
          K.title ? (e(), i("header", fd, [
            l("h3", null, y(K.title), 1)
          ])) : u("", !0),
          (e(!0), i(M, null, se(K.keys, (W) => (e(), i("div", {
            key: W.key,
            class: "pim-policy-row"
          }, [
            l("div", bd, [
              l("label", {
                for: "pol-" + W.key
              }, y(W.title), 9, yd),
              l("p", {
                id: "pol-help-" + W.key
              }, [
                J(y(W.hint), 1),
                W.global ? (e(), i("span", hd, " Managed in deployment settings.")) : u("", !0)
              ], 8, gd)
            ]),
            a.defaultsOnly ? (e(), i("p", kd, [
              J(y(n.value?.[W.key] === "fields" ? "Record field changes" : n.value?.[W.key] === "off" ? "Lifecycle and release history" : n.value?.[W.key] ?? "Unavailable") + " ", 1),
              g.value[W.key] !== void 0 && g.value[W.key] !== !1 ? (e(), i("span", _d, " · Catalog override applies")) : u("", !0)
            ])) : W.kind === "enum" ? (e(), A(s(Ve), {
              key: 1,
              disabled: a.disabled,
              "input-id": "pol-" + W.key,
              "aria-describedby": "pol-help-" + W.key,
              class: "pim-policy-control",
              "model-value": typeof g.value[W.key] == "string" ? g.value[W.key] : "inherited",
              options: _.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": (H) => C(W.key, H)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])) : (e(), A(s(Ha), {
              key: 2,
              disabled: a.disabled || W.global,
              "input-id": "pol-" + W.key,
              "aria-describedby": "pol-help-" + W.key,
              class: "pim-policy-control",
              "model-value": W.global ? Number(n.value?.[W.key] ?? 0) || null : typeof g.value[W.key] == "number" ? Number(g.value[W.key]) : null,
              min: W.min ?? (W.key === "audit_days" ? 0 : 1),
              max: W.max,
              step: 1,
              placeholder: n.value ? "Default: " + n.value[W.key] : "Deployment default",
              "onUpdate:modelValue": (H) => C(W.key, H)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "min", "max", "placeholder", "onUpdate:modelValue"]))
          ]))), 128))
        ]),
        _: 2
      }, 1040, ["data-policy-group"])), 64))
    ]));
  }
}), $d = { class: "form" }, Cd = { class: "pim-aspect" }, xd = { class: "pim-aspect-head" }, Vd = {
  key: 0,
  class: "muted small"
}, Ud = /* @__PURE__ */ pe({
  __name: "BuilderDeclaration",
  props: {
    draft: {},
    readonly: { type: Boolean }
  },
  emits: ["replace", "validity"],
  setup(a, { emit: v }) {
    const t = a, n = v, d = Z(JSON.stringify(t.draft, null, 2)), r = Z("");
    il(() => n("validity", !0)), ye(() => t.draft, (g) => {
      d.value = JSON.stringify(g, null, 2), r.value = "";
    }, { deep: !0 });
    function x() {
      if (!t.readonly)
        try {
          const g = ot(d.value);
          r.value = "", n("validity", !0), n("replace", g);
        } catch (g) {
          n("validity", !1), r.value = "Invalid declaration: " + (g instanceof Error ? g.message : String(g));
        }
    }
    return (g, b) => (e(), i("section", $d, [
      l("div", Cd, [
        l("header", xd, [
          b[1] || (b[1] = l("h3", null, "Declaration", -1)),
          a.readonly ? u("", !0) : (e(), i("span", Vd, "edits apply to the draft when the JSON parses"))
        ]),
        r.value ? (e(), A(s(Ue), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: w(() => [
            J(y(r.value), 1)
          ]),
          _: 1
        })) : u("", !0),
        f(s(Ja), {
          modelValue: d.value,
          "onUpdate:modelValue": b[0] || (b[0] = (T) => d.value = T),
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
}), jd = { class: "pim-section-layout" }, Sd = { class: "kx-main" }, Ad = ["aria-label"], Od = { class: "pim-builder-main" }, Rd = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, Id = ["disabled", "inert"], Pd = {
  key: 0,
  class: "form pim-card-body pad pim-ia-action"
}, Td = {
  key: 0,
  class: "muted small"
}, qd = {
  key: 1,
  class: "muted small"
}, Fd = { class: "pim-overview-grid" }, Dd = { class: "kx-head-icon" }, Nd = { class: "kx-card-id" }, zd = { class: "kx-card-name" }, Ld = { class: "kx-card-meta" }, Bd = { class: "kx-card-desc" }, Md = { class: "pim-overview-actions" }, Ed = { class: "pim-advanced-actions" }, Wd = { class: "pim-ia-action" }, Hd = { class: "pim-ia-action" }, Jd = { class: "pim-ia-dialog" }, Kd = { class: "pim-ia-dialog-head" }, Gd = {
  key: 0,
  class: "dialog-actions"
}, Yd = ["aria-labelledby"], Zd = { class: "pim-ia-dialog-head" }, Qd = ["id"], Xd = { class: "pim-ia-review-impact" }, er = { key: 0 }, lr = { key: 1 }, ar = { key: 2 }, tr = { key: 3 }, sr = { key: 4 }, ir = { key: 5 }, nr = { key: 0 }, or = {
  key: 0,
  class: "pim-plan-list"
}, dr = { key: 1 }, rr = {
  key: 1,
  class: "pim-plan-list"
}, ur = {
  key: 2,
  class: "pim-ia-review-impact"
}, cr = {
  key: 0,
  class: "row pim-review-confirm"
}, mr = ["for"], pr = { class: "dialog-actions pim-ia-dialog-actions" }, vr = /* @__PURE__ */ pe({
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
  setup(a, { emit: v }) {
    const t = a, n = v, d = {
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
    }, r = {
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
    }, x = Z(""), g = Z("General"), b = Z("Overview"), T = Z(""), O = Z(), B = D(() => O.value?.from === "Channels" ? "Families" : O.value ? "Fields" : void 0), ee = Z(), N = Z(!1), _ = Z(), C = Z(""), c = Object.keys(d).map((p) => ({
      heading: p === "Channels" ? "Publishing and imports" : p,
      items: d[p].items.map((o) => ({ ...o, value: o.label, section: p }))
    })), q = [
      ...c.filter((p) => p.items.length > 1),
      { heading: "Manage catalog", items: c.filter((p) => p.items.length === 1).flatMap((p) => p.items) }
    ], K = q.flatMap((p) => p.items), W = D(() => z.value && ie.value ? [
      { ...q[0], heading: t.title || "Catalog" },
      ...q.slice(1)
    ] : []), H = D(() => t.backLabel ? {
      value: "all-catalogs",
      label: t.embedded ? "All catalogs" : t.backLabel,
      icon: "tabler:table"
    } : void 0), te = Z();
    ye(te, (p) => {
      t.focusBack && p?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    function F(p) {
      if (p === "all-catalogs") {
        n("back");
        return;
      }
      const o = K.find(($) => $.label === p);
      o && R(o.section, o.label);
    }
    function oe(p, o, $ = "") {
      const G = b.value !== o;
      g.value = p, b.value = o, x.value = $ ? r[o] + "/" + $ : "", G && (C.value = "", _.value && (_.value.scrollTop = 0));
    }
    function Q(p, o, $ = "") {
      oe(p, o, $), t.route !== void 0 && n("navigate", [r[o], ...$ ? [encodeURIComponent($)] : []].join("/"));
    }
    function R(p, o = d[p].items[0].label) {
      (g.value !== p || b.value !== o) && (O.value = void 0, Q(p, o));
    }
    function X(p, o, $) {
      if (t.route === void 0 || r[b.value] !== p || !$ && x.value !== p + "/" + o) return;
      const G = z.value;
      (p === "families" ? G?.families[o] : p === "fields" ? G?.declaration.aspects?.some((re) => re.attributes?.some((fe) => re.namespace + "." + fe.id === o)) : p === "dimensions" ? G?.dimensions.some((re) => re.name === o) : p === "vocabularies" ? G?.vocabularies[o] : p === "channels" ? G?.channels[o] : p === "sources" ? G?.sources[o] : p === "plugins" && (ie.value?.plugins.some((re) => re.plugin === o) || ie.value?.scopes.some((re) => "scope:" + re.id === o))) && Q(g.value, b.value, $ ? o : "");
    }
    Ql(oa, { selected: x, choose: X }), ye(() => t.route, (p) => {
      if (p === void 0) return;
      const [o, $] = p.split("/"), G = K.find((re) => r[re.label] === o);
      G?.label !== B.value && (O.value = void 0);
      let ne = "";
      try {
        $ && (ne = decodeURIComponent($));
      } catch {
      }
      G?.label === "Fields" && ne && x.value !== "fields/" + ne && (T.value = ""), oe(G?.section ?? "General", G?.label ?? "Overview", ne);
    }, { immediate: !0 });
    function S(p) {
      ee.value = p, N.value = !0;
    }
    function V(p) {
      T.value = p, R("Products", "Fields");
    }
    async function j(p, o, $ = "") {
      Q(p, o, $), await Je(), _.value?.focus({ preventScroll: !0 });
    }
    function m(p) {
      O.value = { from: "Channels", id: p };
      const o = Dl.value.find((G) => G.id === p)?.families, $ = pl.value.filter((G) => !o?.length || o.includes(G.code));
      j("Products", "Families", $.length === 1 ? $[0].code : void 0);
    }
    function h(p) {
      T.value = "", O.value = { from: "Families", id: p }, j("Products", "Fields");
    }
    function L() {
      if (!O.value) return;
      const { from: p, id: o } = O.value;
      O.value = void 0, j(p === "Channels" ? "Channels" : "Products", p, o);
    }
    function ue(p, o, $ = o + "s") {
      return p + " " + (p === 1 ? o : $);
    }
    const z = Z(null), ie = Z(null), ae = Z({}), je = Z({}), ge = Z({}), qe = Z(), ml = D(() => Object.fromEntries(Object.entries(ge.value).filter(([p]) => ae.value.plugins?.some((o) => o.use === p) && !z.value?.plugins.some((o) => o.plugin === p && o.active)))), _e = Z(), we = Z(!1), I = Z(null), U = Z(!1), P = D(() => z.value?.access.admin === !0), k = Z(null), ve = Z(!1), le = Z(!1), Fe = Z(null), $e = Te(), hl = {
      unchanged: "No changes",
      initial: "First schema",
      cosmetic: "Presentation only",
      additive: "New fields or options",
      semantic: "Affects product data",
      refused: "Changes blocked"
    }, ua = {
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
    }, Ye = Z(null), De = Z(!0), he = al(), Rl = D(() => ve.value && Se.value && (!$l.value.length || le.value) && !we.value && De.value && !!k.value && k.value.class !== "refused" && !!Ye.value?.matches(We.value, z.value?.schema_generation ?? -1, ge.value)), Il = D(() => k.value ? [...k.value.refused, ...k.value.changes.filter((p) => p.class !== "refused")] : []), nl = al(), ol = al(), kl = Z(!1);
    let _l = 0;
    ye([ae, je, ge], () => {
      _l++, C.value = "", Re();
    }, { deep: !0, flush: "sync" });
    async function Ze(p = !1, o = !1) {
      if (Se.value && !p) return;
      const $ = nl.begin(), G = _l, ne = t.catalogId, re = o ? Object.entries(ge.value).filter(([fe]) => z.value?.plugins.some((Ie) => Ie.plugin === fe && Ie.active)) : [];
      kl.value = !0, _e.value = void 0, qe.value = void 0;
      try {
        const [fe, Ie] = await Promise.all([be.schema(ne), be.schemaOptions(ne)]);
        if (!nl.current($) || G !== _l || ne !== t.catalogId) return !1;
        const ze = C.value;
        return z.value = fe, ie.value = Ie, ae.value = el(fe.declaration), je.value = {}, ge.value = Object.fromEntries(re.filter(([Va]) => fe.plugins.some((Wl) => Wl.plugin === Va && Wl.active))), Re(), De.value = !0, we.value = !1, C.value = ze, !0;
      } catch (fe) {
        return nl.current($) && (_e.value = Ge(fe, "Could not load settings.")), !1;
      } finally {
        nl.current($) && (kl.value = !1);
      }
    }
    let wl = () => {
    };
    ye(() => t.catalogId, (p) => {
      wl(), wl = la(`component.${p}`, () => {
        !Se.value && !U.value ? Ze() : b.value === "Plugins" && !U.value && Ne();
      });
    }, { immediate: !0 });
    const ca = yl(async () => {
      !Se.value && !U.value ? await Ze() : b.value === "Plugins" && !U.value && await Ne();
    });
    il(() => {
      wl(), he.begin(), nl.begin(), ol.begin();
    });
    const Pl = D(() => ca.value !== !1 && b.value === "Plugins" && !U.value && z.value?.plugins.some((p) => Po(p, z.value.as_of)) === !0);
    ye(Pl, (p, o, $) => {
      if (!p) return;
      let G, ne = !0;
      const re = () => {
        G = setTimeout(async () => {
          await Ne() && ne && Pl.value && re();
        }, 2e3);
      };
      re(), $(() => {
        ne = !1, clearTimeout(G);
      });
    }), ye(() => t.catalogId, () => {
      he.begin(), U.value = !1, we.value = !1, z.value = null, ie.value = null, Cl(), Ze();
    });
    const ma = D(() => Object.values(Jl(ae.value, je.value)).reduce((p, o) => p + (o?.length ?? 0), 0)), Tl = D(() => !!z.value && (JSON.stringify(ae.value) !== JSON.stringify(z.value.declaration) || ma.value > 0 || Object.keys(ml.value).length > 0)), Se = D(() => Tl.value || Object.keys(ge.value).length > 0);
    ye(Se, (p) => n("dirty-changed", p), { immediate: !0 });
    const pl = D(() => ae.value.families?.filter((p) => p.code !== "generic") ?? []), ql = D(() => ae.value.aspects ?? []), Fl = D(() => ql.value.reduce((p, o) => p + (o.attributes?.length ?? 0), 0)), pa = D(() => {
      const p = new Set(ae.value.plugins?.map((o) => o.use));
      return Object.values(z.value?.attributes ?? {}).filter((o) => o.plugin && p.has(o.plugin)).length;
    }), va = D(() => !Fl.value && !ql.value.length && !pl.value.length), Dl = D(() => ae.value.channels ?? []), fa = D(() => ae.value.sources ?? []), Nl = D(() => z.value?.plugins.filter((p) => p.active) ?? []), zl = D(() => t.catalog?.product_count ?? t.catalog?.item_count), ba = D(() => [
      {
        section: "Products",
        label: "Product setup",
        icon: "tabler:packages",
        summary: [
          ...typeof zl.value == "number" ? [ue(zl.value, "product")] : [],
          ue(pl.value.length, "family", "families"),
          ue(Fl.value + pa.value, "field")
        ].join(" · "),
        detail: pl.value.map((p) => E(p.code)).join(", ") || "Create a family for products that share the same fields."
      },
      {
        section: "Values",
        label: "Allowed values",
        icon: "tabler:list-details",
        summary: [ue(ae.value.dimensions?.length ?? 0, "dimension"), ue(ae.value.vocabularies?.length ?? 0, "vocabulary", "vocabularies")].join(" · "),
        detail: ae.value.dimensions?.map((p) => E(p.name)).join(", ") || "Add dimensions when values vary by language, region or another context."
      },
      {
        section: "Channels",
        label: "Publishing and imports",
        icon: "tabler:arrows-exchange",
        summary: [ue(Dl.value.length, "channel"), ue(fa.value.length, "source")].join(" · "),
        detail: "Publish products to channels and control incoming updates through sources."
      },
      {
        section: "Plugins",
        label: "Catalog tools",
        icon: "tabler:puzzle",
        summary: ue(Nl.value.length, "plugin") + " enabled",
        detail: Nl.value.map((p) => ce(p.title, "Catalog plugin")).join(", ") || "Open Plugins to see which tools you can enable."
      }
    ]), ya = {
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
    }, We = D(() => {
      const p = el(ae.value), o = Jl(p, je.value);
      for (const [$, G] of Object.entries(o)) {
        const ne = p.remove ??= {};
        ne[$] = [.../* @__PURE__ */ new Set([...ne[$] ?? [], ...G])];
      }
      return p;
    });
    function ga(p) {
      const [o, $] = p.split(" ", 2);
      if (o === "plugin" && $) return ce(ie.value?.plugins.find((re) => re.plugin === $)?.title, "Plugin");
      if (o === "scope" && $) return ce(ie.value?.scopes.find((re) => re.id === $)?.title, "Product filter set");
      if ($) return ce(E($), E(o)) + (o === "aspect" ? " field group" : "");
      if (p.startsWith("kickside.")) return "Catalog setting";
      const [G, ne] = p.split(".", 2);
      return ne ? `${ce(E(ne), "Field")} (${ce(E(G), "Field group")})` : ce(E(p), "Catalog setting");
    }
    function ha(p) {
      return p.startsWith("renamed from ") ? "Rename from " + E(p.slice(13)) : p.startsWith("config.") ? "Change " + E(p.slice(7)) : p.endsWith(" owning level") ? "Move a field to another variant level" : ua[p] ?? E(p);
    }
    const $l = D(() => {
      const p = We.value.remove;
      return [
        ...p?.attributes?.length || p?.aspects?.length ? ["Removing fields deletes the values stored in those fields."] : [],
        ...p?.vocabularies?.length ? ["Removing a vocabulary deletes its saved terms."] : [],
        ...p?.channels?.length ? ["Removing a release destination withdraws products already published to it."] : []
      ];
    }), Ll = D(() => {
      const p = z.value?.declaration;
      return p ? [
        ...(ae.value.channels ?? []).flatMap((o) => {
          const $ = p.channels?.find((G) => G.id === o.id);
          return JSON.stringify(o) === JSON.stringify($) ? [] : [{ subject: E(o.id), effect: $ ? "Change which products can be released here and what they need first" : "Add a release destination" }];
        }),
        ...(We.value.remove?.channels ?? []).map((o) => ({ subject: E(o), effect: "Remove this release destination" })),
        ...(ae.value.sources ?? []).flatMap((o) => {
          const $ = p.sources?.find((G) => G.id === o.id);
          return JSON.stringify(o) === JSON.stringify($) ? [] : [{ subject: E(o.id), effect: $ ? "Update how this source can send product data" : "Let this source send product updates" }];
        }),
        ...(We.value.remove?.sources ?? []).map((o) => ({ subject: E(o), effect: "Stop accepting updates from this source" }))
      ] : [];
    }), Bl = D(() => {
      const p = Ye.value;
      if (!p) return [];
      const o = p.declaration.plugins?.filter((G) => !z.value?.plugins.some((ne) => ne.plugin === G.use && ne.active)) ?? [];
      return [.../* @__PURE__ */ new Set([...o.map((G) => G.use), ...Object.keys(p.activeConfigs)])].flatMap((G) => {
        const ne = ie.value?.plugins.find((Ie) => Ie.plugin === G);
        if (!ne || !Object.keys(ne.config_schema.properties ?? {}).length) return [];
        const re = p.pluginConfigs[G] ?? {}, fe = Object.entries(re).map(([Ie, ze]) => sl(ne.config_schema, Ie) + " · " + cl(ze));
        if (G in p.activeConfigs) {
          const Ie = z.value?.plugins.find((ze) => ze.plugin === G)?.config ?? {};
          for (const ze of Object.keys(Ie))
            ze in re || fe.push(sl(ne.config_schema, ze) + " · Uses default");
        }
        return [{ id: G, title: ce(ne.title, "Plugin"), fields: fe.length ? fe : ["Uses defaults"] }];
      });
    });
    function Qe(p, o) {
      const $ = Ge(p, o), G = $.pluginConfig, ne = ie.value?.plugins.find((re) => re.installed && re.plugin === G?.plugin);
      if (G && ne && ae.value.plugins?.some((re) => re.use === G.plugin)) {
        qe.value = G, R("Plugins");
        return;
      }
      _e.value = $, $.code === Aa && (we.value = !0, Re());
    }
    async function ka() {
      if (!(Se.value && !await ll.confirm({
        header: "Discard unsaved changes?",
        message: "Reloading will discard unsaved settings and plugin changes.",
        acceptLabel: "Discard and reload",
        rejectLabel: "Cancel"
      }))) {
        U.value = !0, C.value = "";
        try {
          await Ze(!0);
        } finally {
          U.value = !1;
        }
      }
    }
    async function Ml() {
      if (!z.value || !Se.value || !De.value || we.value || U.value) return;
      const p = he.begin(), o = {
        ...st(We.value, z.value.schema_generation, ge.value),
        schemaChanges: Tl.value,
        initialConfigs: el(ml.value),
        activeConfigs: el(Object.fromEntries(Object.entries(ge.value).filter(([$]) => z.value?.plugins.some((G) => G.plugin === $ && G.active) && !We.value.remove?.plugins?.includes($))))
      };
      U.value = !0, _e.value = void 0;
      try {
        const $ = o.schemaChanges ? await be.planSchema(t.catalogId, o.declaration, o.generation, o.initialConfigs) : { generation: o.generation, class: "configuration", changes: [], refused: [] };
        if (!he.current(p) || !o.matches(We.value, z.value.schema_generation, ge.value) || !De.value) return;
        Ye.value = o, le.value = !1, k.value = $, ve.value = !0, await Je(), Fe.value?.focus();
      } catch ($) {
        if (!he.current(p)) return;
        Qe($, "Could not review the change."), Re(), await Je(), I.value?.$el.focus();
      } finally {
        he.current(p) && (U.value = !1);
      }
    }
    async function _a() {
      if (!z.value || !Se.value || !Rl.value || !Ye.value) return;
      const p = t.catalogId, o = he.begin(), $ = Ye.value, G = () => p === t.catalogId && he.current(o);
      U.value = !0, _e.value = void 0, C.value = "";
      let ne = !1;
      try {
        if ($.schemaChanges) {
          const re = await be.applySchema(p, $.declaration, $.generation, $.initialConfigs);
          if (!G()) return;
          const fe = await Ze(!0, !0);
          if (!G() || (n("applied", re.generation), !fe)) return;
        }
        try {
          for (const [re, fe] of Object.entries($.activeConfigs)) {
            if (await be.configurePlugin(p, re, fe), !G()) return;
            ne = !0, delete ge.value[re];
          }
        } finally {
          ne && G() && await Ne(!0);
        }
        if (!G() || _e.value) return;
        qe.value = void 0, C.value = "Catalog changes applied.";
      } catch (re) {
        if (!G()) return;
        Re(), Qe(re, "Could not apply the change."), await Je(), I.value?.$el.focus();
      } finally {
        he.current(o) && (U.value = !1);
      }
    }
    async function Ne(p = !1) {
      const o = t.catalogId, $ = z.value, G = ol.begin();
      try {
        const [ne, re] = await Promise.all([be.schema(o), p ? be.schemaOptions(o) : void 0]);
        return !$ || !ol.current(G) || o !== t.catalogId || z.value !== $ ? !1 : ($.plugins = ne.plugins, $.as_of = ne.as_of, re && (ie.value = re), !0);
      } catch (ne) {
        return p && ol.current(G) && o === t.catalogId && Qe(ne, "Could not check plugin status."), !1;
      }
    }
    async function wa(p) {
      const o = t.catalogId, $ = z.value?.plugins.find((ne) => ne.plugin === p && ne.active && ne.installed);
      if (!$?.config || U.value || we.value || !P.value || !await ll.confirm({
        header: "Reset background updates?",
        message: "Background updates will start from a new catalog event. Current product data will be rebuilt into the plugin’s index. Earlier events will be skipped.",
        acceptLabel: "Reset background updates",
        rejectLabel: "Cancel"
      }) || t.catalogId !== o || U.value) return;
      const G = he.begin();
      ol.begin(), U.value = !0, _e.value = void 0, C.value = "";
      try {
        await be.configurePlugin(o, p, el($.config), !0), he.current(G) && await Ne(!0) && he.current(G) && (C.value = "Background update reset requested.");
      } catch (ne) {
        he.current(G) && Qe(ne, "Could not reset background updates.");
      } finally {
        he.current(G) && (U.value = !1);
      }
    }
    async function $a(p) {
      const o = t.catalogId;
      if (!(U.value || we.value || !P.value)) {
        U.value = !0, _e.value = void 0, C.value = "";
        try {
          await be.resumePluginProjection(o, p), t.catalogId === o && await Ne(!0) && (C.value = "Background update resumed.");
        } catch ($) {
          t.catalogId === o && Qe($, "Could not resume the background update.");
        } finally {
          t.catalogId === o && (U.value = !1);
        }
      }
    }
    async function Ca(p) {
      const o = t.catalogId;
      if (!(U.value || we.value || !P.value) && !(!await ll.confirm({
        header: "Clear catalog app binding?",
        message: "The catalog will use the default app after this setting is saved.",
        acceptLabel: "Clear binding",
        rejectLabel: "Cancel"
      }) || t.catalogId !== o || U.value || !P.value || !z.value?.plugins.some(($) => $.references?.shell_bindings.includes(p)))) {
        U.value = !0, _e.value = void 0, C.value = "";
        try {
          if (await be.updateCatalogApp(o, ""), t.catalogId !== o) return;
          await Ne(!0) && (C.value = "Catalog app binding cleared.");
        } catch ($) {
          t.catalogId === o && Qe($, "Could not clear the catalog app binding.");
        } finally {
          t.catalogId === o && (U.value = !1);
        }
      }
    }
    async function xa() {
      Se.value && !await ll.confirm({
        header: "Leave this catalog?",
        message: "Your unsaved catalog changes will be discarded.",
        acceptLabel: "Discard and open settings",
        rejectLabel: "Keep editing"
      }) || (Cl(), N.value = !1, ll.navigate("/system/settings"));
    }
    function Re() {
      ve.value = !1, Ye.value = null;
    }
    function El() {
      N.value = !1, De.value = !0;
    }
    function Cl() {
      O.value = void 0, ge.value = {}, qe.value = void 0, De.value = !0, z.value && (ae.value = el(z.value.declaration)), je.value = {}, Re(), C.value = "";
    }
    function Xe(p, o) {
      const $ = je.value[p] ?? [];
      $.includes(o) || (je.value = { ...je.value, [p]: [...$, o] });
    }
    return (p, o) => (e(), i("section", {
      class: Oe(["pim-builder", { embedded: a.embedded }])
    }, [
      l("div", jd, [
        H.value || z.value && ie.value ? (e(), A(Qa, {
          key: 0,
          ref_key: "rail",
          ref: te,
          label: "Catalog settings sections",
          value: b.value,
          groups: W.value,
          "leading-item": H.value,
          "onUpdate:value": F
        }, null, 8, ["value", "groups", "leading-item"])) : u("", !0),
        l("div", Sd, [
          l("section", {
            ref_key: "content",
            ref: _,
            class: "kx-main-scroll",
            "aria-label": b.value,
            tabindex: "-1"
          }, [
            z.value && ie.value ? (e(), A(Xt, {
              key: 0,
              title: b.value,
              description: ya[b.value]
            }, Ce({ _: 2 }, [
              P.value && Se.value ? {
                name: "actions",
                fn: w(() => [
                  f(es, {
                    busy: U.value,
                    "review-disabled": !De.value || we.value,
                    onDiscard: Cl,
                    onReview: Ml
                  }, null, 8, ["busy", "review-disabled"])
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : u("", !0),
            l("div", Od, [
              _e.value ? (e(), A(gl, {
                key: 0,
                ref_key: "errorPanel",
                ref: I,
                error: _e.value,
                tabindex: "-1"
              }, {
                default: w(() => [
                  we.value ? (e(), A(s(Y), {
                    key: 0,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: U.value,
                    onClick: ka
                  }, {
                    default: w(() => [...o[14] || (o[14] = [
                      J("Reload settings", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"])) : !z.value || !ie.value ? (e(), A(s(Y), {
                    key: 1,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: o[0] || (o[0] = ($) => Ze())
                  }, {
                    default: w(() => [...o[15] || (o[15] = [
                      J("Retry", -1)
                    ])]),
                    _: 1
                  })) : u("", !0)
                ]),
                _: 1
              }, 8, ["error"])) : u("", !0),
              C.value ? (e(), A(s(Ue), {
                key: 1,
                severity: "success",
                role: "status"
              }, {
                default: w(() => [
                  J(y(C.value), 1)
                ]),
                _: 1
              })) : u("", !0),
              z.value?.rebuilding && b.value === "Overview" ? (e(), A(s(Ue), {
                key: 2,
                severity: "info",
                role: "status"
              }, {
                default: w(() => [...o[16] || (o[16] = [
                  J("Updating product readiness", -1)
                ])]),
                _: 1
              })) : u("", !0),
              kl.value && (!z.value || !ie.value) ? (e(), i("div", Rd, "Loading catalog settings…")) : z.value && ie.value ? (e(), i("fieldset", {
                key: 4,
                class: "pim-editor-surface",
                disabled: U.value,
                inert: U.value
              }, [
                P.value ? u("", !0) : (e(), A(s(Ue), {
                  key: 0,
                  severity: "info"
                }, {
                  default: w(() => [...o[17] || (o[17] = [
                    J("You can view this catalog’s settings.", -1)
                  ])]),
                  _: 1
                })),
                (e(), i("div", {
                  key: b.value,
                  class: "pim-ia-content"
                }, [
                  O.value && b.value === B.value ? (e(), i("div", Pd, [
                    l("div", null, [
                      O.value.from === "Channels" ? (e(), i("p", Td, "Open the family that defines what products need before release, then add a release requirement.")) : (e(), i("p", qd, "Add a field with a single value and no dimensions, such as Integer. When you return, select its group under Field groups."))
                    ]),
                    f(s(Y), {
                      type: "button",
                      severity: "secondary",
                      outlined: "",
                      size: "small",
                      onClick: L
                    }, {
                      default: w(() => [
                        f(s(de), {
                          icon: "tabler:arrow-left",
                          "aria-hidden": "true"
                        }),
                        J(" Back to " + y(s(E)(O.value.id)), 1)
                      ]),
                      _: 1
                    })
                  ])) : u("", !0),
                  g.value === "General" && b.value === "History" ? (e(), A(Gt, {
                    key: 1,
                    "catalog-id": a.catalogId,
                    "can-resolve-actors": P.value
                  }, null, 8, ["catalog-id", "can-resolve-actors"])) : g.value === "General" ? (e(), i(M, { key: 2 }, [
                    l("div", Fd, [
                      (e(!0), i(M, null, se(ba.value, ($) => (e(), i("section", {
                        key: $.section,
                        class: "kx-card pim-overview-card"
                      }, [
                        l("span", Dd, [
                          f(s(de), {
                            icon: $.icon,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"])
                        ]),
                        l("div", Nd, [
                          l("h3", zd, y($.label), 1),
                          l("p", Ld, y($.summary), 1)
                        ]),
                        l("p", Bd, y($.detail), 1),
                        l("div", Md, [
                          f(s(Y), {
                            type: "button",
                            text: "",
                            class: "pim-overview-action",
                            onClick: (G) => R($.section)
                          }, {
                            default: w(() => [
                              J(y($.section === "Products" ? va.value ? "Set up products" : "View families" : "View " + $.section.toLowerCase()) + " ", 1),
                              f(s(de), {
                                icon: "tabler:arrow-right",
                                "aria-hidden": "true"
                              })
                            ]),
                            _: 2
                          }, 1032, ["onClick"]),
                          $.section === "Channels" ? (e(), A(s(Y), {
                            key: 0,
                            type: "button",
                            text: "",
                            class: "pim-overview-action",
                            onClick: o[1] || (o[1] = (G) => R("Channels", "Sources"))
                          }, {
                            default: w(() => [
                              o[18] || (o[18] = J(" Manage sources ", -1)),
                              f(s(de), {
                                icon: "tabler:arrow-right",
                                "aria-hidden": "true"
                              })
                            ]),
                            _: 1
                          })) : u("", !0)
                        ])
                      ]))), 128))
                    ]),
                    f(xe, { label: "Advanced" }, {
                      default: w(() => [
                        l("div", Ed, [
                          l("div", Wd, [
                            o[19] || (o[19] = l("div", null, [
                              l("h3", null, "Application defaults"),
                              l("p", null, "Review the audit, retention and processing settings this catalog inherits.")
                            ], -1)),
                            f(s(Y), {
                              label: "View defaults",
                              severity: "secondary",
                              outlined: "",
                              onClick: o[2] || (o[2] = ($) => S("defaults"))
                            })
                          ]),
                          l("div", Hd, [
                            o[20] || (o[20] = l("div", null, [
                              l("h3", null, "Technical schema"),
                              l("p", null, "Inspect the complete definition, including integration keys and settings used by installed extensions.")
                            ], -1)),
                            f(s(Y), {
                              label: "Open declaration",
                              severity: "secondary",
                              outlined: "",
                              onClick: o[3] || (o[3] = ($) => S("declaration"))
                            })
                          ])
                        ])
                      ]),
                      _: 1
                    })
                  ], 64)) : g.value === "Products" ? (e(), i(M, { key: 3 }, [
                    b.value === "Families" ? (e(), A(Hn, {
                      key: 0,
                      draft: ae.value,
                      schema: z.value,
                      options: ie.value,
                      onRemove: Xe,
                      onFields: V,
                      onVariantField: h
                    }, null, 8, ["draft", "schema", "options"])) : b.value === "Fields" ? (e(), A(Ti, {
                      key: 1,
                      family: T.value,
                      "onUpdate:family": o[4] || (o[4] = ($) => T.value = $),
                      draft: ae.value,
                      schema: z.value,
                      options: ie.value,
                      onRemove: Xe,
                      onLayout: o[5] || (o[5] = ($) => R("Products", "Form layout"))
                    }, null, 8, ["family", "draft", "schema", "options"])) : (e(), A(jt, {
                      key: 2,
                      draft: ae.value,
                      schema: z.value,
                      types: ie.value.types,
                      onFamilies: o[6] || (o[6] = ($) => R("Products", "Families"))
                    }, null, 8, ["draft", "schema", "types"]))
                  ], 64)) : g.value === "Values" ? (e(), i(M, { key: 4 }, [
                    b.value === "Dimensions" ? (e(), A(Wi, {
                      key: 0,
                      draft: ae.value,
                      schema: z.value,
                      onRemove: Xe
                    }, null, 8, ["draft", "schema"])) : (e(), A(mn, {
                      key: 1,
                      "catalog-id": a.catalogId,
                      draft: ae.value,
                      schema: z.value,
                      onRemove: Xe
                    }, null, 8, ["catalog-id", "draft", "schema"]))
                  ], 64)) : g.value === "Channels" ? (e(), A(Ro, {
                    key: 5,
                    "catalog-id": a.catalogId,
                    draft: ae.value,
                    schema: z.value,
                    view: b.value === "Sources" ? "sources" : "channels",
                    onRemove: Xe,
                    onRequirements: m
                  }, null, 8, ["catalog-id", "draft", "schema", "view"])) : g.value === "Access" ? (e(), A(tt, {
                    key: 6,
                    "catalog-id": a.catalogId,
                    title: a.title || "Catalog",
                    access: z.value.access
                  }, null, 8, ["catalog-id", "title", "access"])) : (e(), A(ud, {
                    key: 7,
                    draft: ae.value,
                    schema: z.value,
                    options: ie.value,
                    "plugin-configs": ge.value,
                    refusal: qe.value,
                    stale: we.value,
                    onRemove: Xe,
                    onReset: wa,
                    onClearRefusal: o[7] || (o[7] = ($) => qe.value = void 0),
                    onRefresh: o[8] || (o[8] = ($) => Ne(!0)),
                    onResume: $a,
                    onReview: Ml,
                    onClearShellBinding: Ca
                  }, null, 8, ["draft", "schema", "options", "plugin-configs", "refusal", "stale"]))
                ])),
                ee.value ? (e(), A(bl, {
                  key: 1,
                  visible: N.value,
                  label: ee.value === "defaults" ? "Application defaults" : "Technical schema",
                  onClose: El,
                  onClosed: o[11] || (o[11] = ($) => ee.value = void 0)
                }, {
                  default: w(() => [
                    l("div", Jd, [
                      l("header", Kd, [
                        l("h2", null, y(ee.value === "defaults" ? "Application defaults" : "Technical schema"), 1),
                        f(s(Y), {
                          type: "button",
                          "aria-label": "Close",
                          text: "",
                          severity: "secondary",
                          onClick: El
                        }, {
                          default: w(() => [
                            f(s(de), {
                              icon: "tabler:x",
                              "aria-hidden": "true"
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      ee.value === "defaults" ? (e(), i(M, { key: 0 }, [
                        o[21] || (o[21] = l("p", { class: "muted" }, "These settings apply across the application. Catalogs with an explicit override keep their chosen value.", -1)),
                        f(wd, {
                          "catalog-id": a.catalogId,
                          draft: ae.value,
                          disabled: !P.value,
                          "defaults-only": ""
                        }, null, 8, ["catalog-id", "draft", "disabled"]),
                        P.value ? (e(), i("div", Gd, [
                          f(s(Y), {
                            type: "button",
                            label: "Open application settings",
                            severity: "secondary",
                            outlined: "",
                            onClick: xa
                          })
                        ])) : u("", !0)
                      ], 64)) : (e(), A(Ud, {
                        key: 1,
                        draft: ae.value,
                        readonly: !P.value,
                        onReplace: o[9] || (o[9] = ($) => ae.value = $),
                        onValidity: o[10] || (o[10] = ($) => {
                          De.value = $, Re();
                        })
                      }, null, 8, ["draft", "readonly"]))
                    ])
                  ]),
                  _: 1
                }, 8, ["visible", "label"])) : u("", !0)
              ], 8, Id)) : u("", !0),
              f(bl, {
                class: "pim-review-dialog",
                visible: ve.value,
                busy: U.value,
                label: "Review changes",
                onClose: Re,
                onClosed: o[13] || (o[13] = ($) => k.value = null)
              }, {
                default: w(() => [
                  k.value ? (e(), i("section", {
                    key: 0,
                    class: "pim-ia-dialog pim-plan",
                    "aria-labelledby": s($e)
                  }, [
                    l("header", Zd, [
                      l("div", null, [
                        l("h2", {
                          id: s($e),
                          ref_key: "reviewHeading",
                          ref: Fe,
                          tabindex: "-1",
                          autofocus: ""
                        }, "Review changes", 8, Qd),
                        l("p", null, "Check what will happen when you apply this draft to " + y(a.title || "the catalog") + ".", 1)
                      ]),
                      f(s(Y), {
                        type: "button",
                        "aria-label": "Close review",
                        disabled: U.value,
                        text: "",
                        severity: "secondary",
                        onClick: Re
                      }, {
                        default: w(() => [
                          f(s(de), {
                            icon: "tabler:x",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ]),
                    l("div", Xd, [
                      l("h3", null, y(k.value.class === "configuration" ? "Plugin configuration" : hl[k.value.class] || "Catalog changes"), 1),
                      k.value.class === "configuration" ? (e(), i("p", er, "These settings will apply to the enabled plugins in this catalog.")) : k.value.class === "unchanged" ? (e(), i("p", lr, "The catalog already matches this draft.")) : k.value.class === "initial" ? (e(), i("p", ar, "Product editors will use these settings for new products.")) : k.value.class === "cosmetic" ? (e(), i("p", tr, "Catalog settings will update. Stored product values are kept.")) : k.value.class === "additive" ? (e(), i("p", sr, "The new options become available. Existing product values are kept.")) : k.value.class === "semantic" ? (e(), i("p", ir, "Applying changes can recalculate product values or release readiness across this catalog.")) : k.value.class === "refused" ? (e(), A(s(Ue), {
                        key: 6,
                        severity: "error"
                      }, {
                        default: w(() => [
                          o[22] || (o[22] = J(" These changes can’t be applied. ", -1)),
                          k.value.migration && k.value.refused.some(($) => z.value?.attributes[$.code]) ? (e(), i("span", nr, " To change how a field stores values, add a new field and copy the existing values into it. Then remove the original field and give the new field its name. ")) : u("", !0)
                        ]),
                        _: 1
                      })) : u("", !0)
                    ]),
                    Il.value.length || Ll.value.length ? (e(), i("ul", or, [
                      (e(!0), i(M, null, se(Il.value, ($, G) => (e(), i("li", { key: G }, [
                        $.class === "refused" ? (e(), A(s(ke), {
                          key: 0,
                          class: "kx-tag-sm small",
                          severity: "danger"
                        }, {
                          default: w(() => [...o[23] || (o[23] = [
                            J("Blocked", -1)
                          ])]),
                          _: 1
                        })) : u("", !0),
                        $.code ? (e(), i("strong", dr, y(ga($.code)), 1)) : u("", !0),
                        l("span", null, y(ha($.what)), 1)
                      ]))), 128)),
                      (e(!0), i(M, null, se(Ll.value, ($) => (e(), i("li", {
                        key: $.subject + $.effect
                      }, [
                        l("strong", null, y($.subject), 1),
                        l("span", null, y($.effect), 1)
                      ]))), 128))
                    ])) : u("", !0),
                    Bl.value.length ? (e(), i("ul", rr, [
                      (e(!0), i(M, null, se(Bl.value, ($) => (e(), i("li", {
                        key: $.id
                      }, [
                        l("strong", null, y($.title), 1),
                        l("div", null, [
                          (e(!0), i(M, null, se($.fields, (G, ne) => (e(), i("p", { key: ne }, y(G), 1))), 128))
                        ])
                      ]))), 128))
                    ])) : u("", !0),
                    $l.value.length ? (e(), i("div", ur, [
                      o[24] || (o[24] = l("h3", null, "Permanent changes", -1)),
                      (e(!0), i(M, null, se($l.value, ($) => (e(), i("p", { key: $ }, y($), 1))), 128)),
                      k.value.class !== "refused" ? (e(), i("div", cr, [
                        f(s(Ba), {
                          modelValue: le.value,
                          "onUpdate:modelValue": o[12] || (o[12] = ($) => le.value = $),
                          "input-id": s($e) + "-acknowledge",
                          binary: "",
                          disabled: U.value
                        }, null, 8, ["modelValue", "input-id", "disabled"]),
                        l("label", {
                          for: s($e) + "-acknowledge"
                        }, "I understand the effects of these removals", 8, mr)
                      ])) : u("", !0)
                    ])) : u("", !0),
                    l("footer", pr, [
                      f(s(Y), {
                        type: "button",
                        label: "Back to editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: U.value,
                        onClick: Re
                      }, null, 8, ["disabled"]),
                      z.value?.access.admin && k.value.class !== "refused" ? (e(), A(s(Y), {
                        key: 0,
                        disabled: !Se.value || U.value || !Rl.value,
                        loading: U.value,
                        onClick: _a
                      }, {
                        default: w(() => [
                          J(y(b.value === "Form layout" ? "Apply layout" : "Apply changes"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled", "loading"])) : u("", !0)
                    ])
                  ], 8, Yd)) : u("", !0)
                ]),
                _: 1
              }, 8, ["visible", "busy"])
            ])
          ], 8, Ad)
        ])
      ])
    ], 2));
  }
}), fr = /* @__PURE__ */ pe({
  __name: "SettingsApp",
  setup(a) {
    const v = Oa(), t = Ra(), n = Z(), d = D(() => v.value.catalogId ?? ""), r = al();
    async function x() {
      const b = r.begin(), T = d.value;
      try {
        const O = await be.catalogSummary(T);
        r.current(b) && (n.value = O);
      } catch {
        r.current(b) && (n.value = void 0);
      }
    }
    ye(d, () => {
      n.value = void 0, x();
    }), yl(x), il(() => {
      r.begin();
    });
    function g() {
      v.value.embedded ? t("open-catalog-picker", {}) : t("navigate", { route: "" });
    }
    return (b, T) => d.value ? (e(), A(vr, {
      key: d.value,
      "catalog-id": d.value,
      title: n.value?.title || "Catalog",
      catalog: n.value,
      embedded: s(v).embedded,
      "focus-back": s(v).focusBack,
      route: s(v).route,
      onNavigate: T[0] || (T[0] = (O) => s(t)("navigate", { route: O })),
      "back-label": s(v).embedded ? "Back to catalogs" : "Back to catalog settings",
      onBack: g,
      onDirtyChanged: T[1] || (T[1] = (O) => s(t)("dirty-changed", { dirty: O }))
    }, null, 8, ["catalog-id", "title", "catalog", "embedded", "focus-back", "route", "back-label"])) : u("", !0);
  }
});
class br extends Ia {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "catalog-id": { type: "string", default: "" }, embedded: { type: "boolean", default: !1 }, route: { type: "string" }, "focus-back": { type: "boolean", default: !1 } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: Pa
    };
  }
  static get vueConfig() {
    return { rootComponent: fr, plugins: [Ta] };
  }
}
Wa(import.meta.url, br);
