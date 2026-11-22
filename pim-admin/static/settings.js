import { d as xa, u as fl, r as Ge, e as Kl, h as Va, b as bl, p as ye, c as Ke, a as we, _ as vl, i as Ua, S as ja, f as Sa, g as Aa, W as Oa, s as Ra, P as Pa } from "./styles-DMYHD085.js";
import { defineComponent as pe, computed as D, openBlock as e, createBlock as R, resolveDynamicComponent as Gl, normalizeProps as Ta, guardReactiveProps as qa, createSlots as _e, withCtx as _, createElementVNode as l, normalizeClass as Ae, createElementBlock as i, Fragment as H, renderList as se, toDisplayString as y, createCommentVNode as u, unref as s, renderSlot as Se, ref as Y, onUnmounted as Ye, createVNode as f, createStaticVNode as Ia, createTextVNode as K, withModifiers as ze, normalizeStyle as Cl, useId as Te, watch as be, withKeys as nl, nextTick as He, provide as Yl, inject as El, useModel as Zl, Transition as Fa, mergeModels as xl, toRaw as Da, onMounted as Ql, mergeProps as Na } from "vue";
import { Icon as oe } from "@iconify/vue";
import he from "primevue/tag";
import G from "primevue/button";
import za from "primevue/checkbox";
import Ce from "primevue/message";
import { api as Ba, on as Xl, host as ll, loadByTagName as La, define as Ma } from "@wippy-fe/proxy";
import Sl from "primevue/selectbutton";
import al from "primevue/inputtext";
import ea from "primevue/multiselect";
import ol from "primevue/toggleswitch";
import $e from "primevue/select";
import Ea from "primevue/inputnumber";
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
    const m = a, t = D(() => m.leadingItem ? [{ items: [m.leadingItem] }, ...m.groups] : m.groups);
    function n(o) {
      const d = [...o.currentTarget.querySelectorAll(".kx-settings-rail-item")], $ = d.indexOf(o.target);
      if ($ < 0) return;
      let v;
      switch (o.key) {
        case "ArrowDown":
        case "ArrowRight":
          v = ($ + 1) % d.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          v = ($ + d.length - 1) % d.length;
          break;
        case "Home":
          v = 0;
          break;
        case "End":
          v = d.length - 1;
          break;
        default:
          return;
      }
      o.preventDefault(), d[v]?.focus();
    }
    return (o, d) => (e(), R(Gl(a.title ? xa : "div"), Ta(qa(a.title ? { title: a.title, count: a.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), _e({
      default: _(() => [
        l("nav", {
          class: Ae(["kx-settings-rail", { "kx-settings-rail-framed": a.title }]),
          "aria-label": a.label,
          onKeydown: n
        }, [
          (e(!0), i(H, null, se(t.value, ($, v) => (e(), i("div", {
            key: $.items[0]?.value ?? v,
            class: Ae(["kx-settings-rail-section", { "kx-settings-rail-leading": a.leadingItem && v === 0 }])
          }, [
            $.heading ? (e(), i("div", Ja, y($.heading), 1)) : u("", !0),
            (e(!0), i(H, null, se($.items, (b) => (e(), i("button", {
              key: b.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": b.value === a.value ? "true" : void 0,
              onClick: (T) => o.$emit("update:value", b.value)
            }, [
              b.icon ? (e(), R(s(oe), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: b.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : u("", !0),
              l("span", Ga, y(b.label), 1)
            ], 8, Ka))), 128))
          ], 2))), 128))
        ], 42, Ha)
      ]),
      _: 2
    }, [
      a.title && o.$slots.actions ? {
        name: "actions",
        fn: _(() => [
          Se(o.$slots, "actions")
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
    const m = a, t = Y(!1), n = Y(!1), o = Y(""), d = Y(), $ = Y(!1), v = Ge(), b = D(() => "/api/v1/component-access/grants/" + encodeURIComponent(m.catalogId)), T = D(() => JSON.stringify({
      resource_id: m.catalogId,
      title: m.title,
      access_url: b.value,
      share_url: "/api/v1/component-access/share/" + encodeURIComponent(m.catalogId)
    })), O = D(() => {
      if (!m.access.admin) return "Only catalog administrators can manage sharing.";
      if (!d.value) return $.value ? "Member counts are unavailable." : "Loading members…";
      const { people: z, groups: g } = d.value;
      return z + (z === 1 ? " person" : " people") + " and " + g + (g === 1 ? " group" : " groups") + " with direct access";
    });
    async function L() {
      if (!m.access.admin) return;
      const z = v.begin();
      $.value = !1;
      try {
        const { data: g } = await Ba.get(b.value);
        if (!v.current(z)) return;
        if (!g?.success || !Array.isArray(g.access)) throw new Error("Grants unavailable");
        const x = g.access.filter((r) => r.subject_type === "group").length;
        d.value = { people: g.access.length - x, groups: x };
      } catch {
        v.current(z) && (d.value = void 0, $.value = !0);
      }
    }
    fl(L), Ye(() => {
      v.begin();
    });
    async function Z() {
      n.value = !0, o.value = "", await Kl("kickside-share") ? t.value = !0 : o.value = "Could not open sharing. Try again.", n.value = !1;
    }
    return (z, g) => (e(), i("div", Za, [
      l("section", Qa, [
        l("div", null, [
          g[1] || (g[1] = l("h3", null, "Members and sharing", -1)),
          l("p", Xa, y(O.value), 1)
        ]),
        a.access.admin ? (e(), R(s(G), {
          key: 0,
          type: "button",
          label: "Share catalog",
          loading: n.value,
          onClick: Z
        }, {
          icon: _(() => [
            f(s(oe), {
              icon: "tabler:share",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : u("", !0),
        $.value ? (e(), R(s(G), {
          key: 1,
          type: "button",
          label: "Reload member counts",
          severity: "secondary",
          text: "",
          onClick: L
        })) : u("", !0)
      ]),
      g[2] || (g[2] = Ia('<section class="form pim-access-card pim-stack" aria-labelledby="pim-access-roles-heading"><h3 id="pim-access-roles-heading">What members can do</h3><dl class="pim-access-roles"><div><dt>Read</dt><dd>View products and their details.</dd></div><div><dt>Write</dt><dd>Create products and update their values.</dd></div><div><dt>Delete</dt><dd>Move products to trash.</dd></div><div><dt>Admin</dt><dd>Manage catalog settings and who has access.</dd></div></dl></section>', 1)),
      t.value ? (e(), i("kickside-share", {
        key: 0,
        config: T.value,
        onClose: g[0] || (g[0] = (x) => t.value = !1),
        onChanged: L
      }, null, 40, et)) : u("", !0),
      o.value ? (e(), R(s(Ce), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: _(() => [
          K(y(o.value), 1)
        ]),
        _: 1
      })) : u("", !0)
    ]));
  }
});
function at(a, m, t = {}) {
  const n = JSON.stringify(a), o = JSON.stringify(t);
  return {
    declaration: JSON.parse(n),
    generation: m,
    pluginConfigs: JSON.parse(o),
    matches: (d, $, v = {}) => m === $ && n === JSON.stringify(d) && o === JSON.stringify(v)
  };
}
function Wl(a, m) {
  const t = {};
  for (const [n, o] of Object.entries(m)) {
    const d = o.filter(($) => n === "plugins" ? !a.plugins?.some((v) => v.use === $) : n === "scopes" ? !a.scopes?.includes($) : n === "attributes" ? !a.aspects?.some((v) => v.attributes?.some((b) => v.namespace + "." + b.code === $)) : n === "aspects" ? !a.aspects?.some((v) => v.namespace === $) : n === "dimensions" ? !a.dimensions?.some((v) => v.name === $) : n === "vocabularies" || n === "families" ? !a[n]?.some((v) => v.code === $) : !a[n]?.some((v) => v.id === $));
    d.length && (t[n] = d);
  }
  return t;
}
const Hl = (a) => !!a && typeof a == "object" && !Array.isArray(a), me = ["string"], la = { "*": "string" }, tt = { id: "number", code: "string!", type: "string!", scope: me, cardinality: "string", index: "string", index_contexts: [la], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, st = {
  dimensions: [{ name: "string!", members: me, fallback: { "*": me } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: me }, attributes: [tt] }],
  families: [{ code: "string!", aspects: me, variation: [{ axes: me, own: me }], requirements: [{ id: "string!", context: la, require: me, authored: me }], checks: [{ check: "string!", reads: me, cost: "string", config: "object", enforce: "string" }] }],
  sources: [{ id: "string!", ordering: "string", writes: me, principals: me, audit: "boolean" }],
  channels: [{ id: "string!", requirements: me, families: me }],
  plugins: [{ use: "string!", schema: "json" }],
  scopes: me,
  policy: { "*": "policy" },
  remove: { dimensions: me, vocabularies: me, aspects: me, families: me, sources: me, channels: me, attributes: me, scopes: me, plugins: me }
};
function Vl(a, m, t) {
  if (typeof m == "string") {
    const n = m.replace("!", "");
    if (!(n === "json" || (n === "object" ? Hl(a) : n === "policy" ? a === !1 || typeof a == "string" || typeof a == "number" : typeof a === n)) || m.endsWith("!") && (typeof a != "string" || !a.trim())) throw new Error(`${t} has an invalid ${n} value.`);
  } else if (Array.isArray(m)) {
    if (!Array.isArray(a)) throw new Error(`${t} must be an array.`);
    a.forEach((n, o) => Vl(n, m[0], `${t}[${o}]`));
  } else {
    if (!Hl(a)) throw new Error(`${t} must be an object.`);
    for (const [n, o] of Object.entries(m)) if (typeof o == "string" && o.endsWith("!") && a[n] === void 0) throw new Error(`${t}.${n} is required.`);
    for (const [n, o] of Object.entries(a)) {
      const d = m[n] ?? m["*"];
      if (!d) throw new Error(`${t}.${n} is not an editor field.`);
      Vl(o, d, `${t}.${n}`);
    }
  }
}
function it(a) {
  const m = JSON.parse(a);
  Vl(m, st, "Declaration");
  const t = m;
  for (const n of t.dimensions ?? []) n.members ??= [];
  return t;
}
function el(a) {
  return JSON.parse(JSON.stringify(a));
}
const Jl = /^[a-z][a-z0-9_]*$/;
function nt(a) {
  return a.trim().normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function Je(a, m, t) {
  t.length ? a[m] = t : delete a[m];
}
function ml(a, m, t) {
  if (t < 0 || t >= a.length || m === t) return;
  const [n] = a.splice(m, 1);
  a.splice(t, 0, n);
}
function ce(a, m) {
  return !a || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(a) ? m : a;
}
function il(a) {
  return a ? ce(a.title, "Field type") : "Unknown type";
}
async function aa(a, m) {
  const t = [...new Set(m)].map((o) => ({ type: "user", id: o }));
  if (!t.length) return {};
  const n = await Va(`/api/v1/pim-admin/catalogs/${encodeURIComponent(a)}/principal_labels`, { refs: t }, "People");
  return Object.fromEntries((n.principals ?? []).map((o) => [o.id, ce(o.label, "Person")]));
}
const pl = [
  { value: "quarter", label: "¼", span: 3 },
  { value: "third", label: "⅓", span: 4 },
  { value: "half", label: "½", span: 6 },
  { value: "full", label: "1", span: 12 }
];
function Ul(a, m, t) {
  return t.width ?? a.attributes[m + "." + t.code]?.width ?? "half";
}
const ot = (a) => new Date(a).toLocaleString();
function jl(a) {
  const m = Math.abs(a.m).toString(), t = a.m < 0 ? "-" : "";
  if (a.e >= 0) return t + m + "0".repeat(a.e);
  const n = -a.e, o = m.padStart(n + 1, "0");
  return t + o.slice(0, o.length - n) + "." + o.slice(o.length - n);
}
function J(a) {
  const t = (a.includes(".") ? a.slice(a.indexOf(".") + 1) : a).replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : a;
}
function tl(a, m) {
  const t = a.properties;
  return ce(t?.[m]?.title, ce(J(m), "This setting"));
}
function We(a) {
  return a.labels.en ?? Object.values(a.labels)[0] ?? a.code;
}
function ta(a) {
  const m = /* @__PURE__ */ new Map();
  for (const t of a ?? [])
    if (t.code !== "generic")
      for (const n of t.aspects ?? []) {
        const o = m.get(n) ?? [];
        o.push(J(t.code)), m.set(n, o);
      }
  return new Map([...m].map(([t, n]) => [t, "Used by " + n.join(", ")]));
}
function dl(a, m) {
  if (a == null) return "";
  const t = (n) => {
    if (n == null) return "";
    if (typeof n == "object" && "ref" in n) {
      const o = n;
      if (o.ref[0] === "term") {
        const d = o.ref[1].slice(o.ref[1].indexOf(":") + 1), $ = o.ref[1].slice(0, o.ref[1].indexOf(":")), v = m?.[$]?.find((b) => b.code === d);
        return v ? We(v) : d;
      }
      return "Linked " + J(o.ref[0]).toLocaleLowerCase();
    }
    if (typeof n == "object" && "v" in n) {
      const o = n;
      return jl(o.v) + " " + o.u;
    }
    return typeof n == "object" && "m" in n ? jl(n) : typeof n == "boolean" ? n ? "Yes" : "No" : typeof n == "object" ? JSON.stringify(n) : ce(String(n), "Linked record");
  };
  return Array.isArray(a) ? a.map(t).join(", ") : t(a);
}
function dt(a, m, t) {
  const n = dl(m), o = dl(t);
  return !o && n ? `${a} cleared (was ${n})` : n ? `${a}: ${n} → ${o}` : `${a} set to ${o}`;
}
const rt = { class: "pim-table form pim-layout" }, ut = {
  key: 0,
  class: "pim-layout-help muted"
}, ct = {
  key: 1,
  class: "kx-empty"
}, mt = { class: "pim-aspect-head pim-list-header" }, pt = { class: "muted small" }, vt = ["draggable", "onDragstart", "onDragover", "onDrop"], ft = { class: "pim-lcard-top" }, bt = {
  key: 0,
  class: "pim-grip",
  "aria-hidden": "true"
}, yt = { class: "pim-lcard-name" }, gt = { class: "pim-lcard-type" }, ht = {
  key: 1,
  class: "pim-lcard-move"
}, kt = { class: "pim-aspect-head" }, _t = { class: "muted small" }, wt = { class: "pim-canvas" }, $t = { class: "pim-lcard-top" }, Ct = { class: "pim-lcard-name" }, xt = { class: "pim-lcard-type" }, Vt = /* @__PURE__ */ pe({
  __name: "LayoutEditor",
  props: {
    draft: {},
    schema: {},
    types: {}
  },
  emits: ["families"],
  setup(a, { emit: m }) {
    const t = a, n = m, o = D(() => t.schema.access.admin), d = D(() => t.draft?.aspects ?? []), $ = D(() => new Map(t.types.map((r) => [r.id, il(r)]))), v = D(() => ta(t.draft.families)), b = D(() => {
      if (!t.schema) return [];
      const r = new Set((t.draft?.aspects ?? []).map((B) => B.namespace)), S = /* @__PURE__ */ new Map();
      for (const [B, F] of Object.entries(t.schema.attributes)) {
        const M = B.split(".")[0];
        r.has(M) || !F.plugin || (S.has(M) || S.set(M, { aspect: M, plugin: F.plugin, codes: [] }), S.get(M).codes.push(B));
      }
      return [...S.values()];
    });
    function T(r, S) {
      return pl.find((B) => B.value === Ul(t.schema, r, S))?.span ?? 6;
    }
    const O = Y(null), L = Y(null);
    function Z(r, S, B) {
      o.value && (O.value = { ns: r, index: S }, B.dataTransfer?.setData("text/plain", r + ":" + S), B.dataTransfer && (B.dataTransfer.effectAllowed = "move"));
    }
    function z(r, S, B) {
      !O.value || O.value.ns !== r || (B.preventDefault(), L.value = { ns: r, index: S });
    }
    function g(r, S) {
      o.value && O.value?.ns === r.namespace && ml(r.attributes ?? [], O.value.index, S), O.value = null, L.value = null;
    }
    function x() {
      O.value = null, L.value = null;
    }
    return (r, S) => (e(), i("div", rt, [
      o.value ? (e(), i("p", ut, "Arrange fields within each group and choose their widths. Review changes before applying the layout.")) : u("", !0),
      d.value.length === 0 ? (e(), i("div", ct, [
        S[2] || (S[2] = K("This catalog has no field groups yet.", -1)),
        o.value ? (e(), i(H, { key: 0 }, [
          K(" Add a field group in Fields.")
        ], 64)) : u("", !0)
      ])) : u("", !0),
      (e(!0), i(H, null, se(d.value, (B) => (e(), i("section", {
        key: B.namespace,
        class: "pim-aspect"
      }, [
        l("header", mt, [
          l("div", null, [
            l("h3", null, y(s(J)(B.namespace)), 1),
            l("p", pt, y(v.value.get(B.namespace) ?? "No named family uses this group yet."), 1)
          ]),
          o.value && !v.value.has(B.namespace) ? (e(), R(s(G), {
            key: 0,
            label: "Open families",
            type: "button",
            text: "",
            size: "small",
            onClick: S[0] || (S[0] = (F) => n("families"))
          })) : u("", !0)
        ]),
        l("div", {
          class: "pim-canvas",
          onDragover: S[1] || (S[1] = ze(() => {
          }, ["prevent"]))
        }, [
          (e(!0), i(H, null, se(B.attributes ?? [], (F, M) => (e(), i("div", {
            key: F.code,
            class: Ae(["pim-lcard", { dragging: O.value?.ns === B.namespace && O.value?.index === M, over: L.value?.ns === B.namespace && L.value?.index === M }]),
            style: Cl({ gridColumn: "span " + T(B.namespace, F) }),
            draggable: o.value,
            onDragstart: (ee) => Z(B.namespace, M, ee),
            onDragover: (ee) => z(B.namespace, M, ee),
            onDrop: ze((ee) => g(B, M), ["prevent"]),
            onDragend: x
          }, [
            l("div", ft, [
              o.value ? (e(), i("span", bt, [
                f(s(oe), { icon: "tabler:grip-vertical" })
              ])) : u("", !0),
              l("span", yt, y(s(J)(F.code)), 1),
              l("span", gt, y($.value.get(F.type) ?? s(il)(void 0)), 1),
              o.value ? (e(), i("span", ht, [
                f(s(G), {
                  type: "button",
                  disabled: M === 0,
                  "aria-label": "Move " + s(J)(F.code) + " earlier",
                  onClick: (ee) => s(ml)(B.attributes ?? [], M, M - 1),
                  class: "kx-iconbtn sm",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: _(() => [
                    f(s(oe), { icon: "tabler:arrow-left" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                f(s(G), {
                  type: "button",
                  disabled: M === (B.attributes ?? []).length - 1,
                  "aria-label": "Move " + s(J)(F.code) + " later",
                  onClick: (ee) => s(ml)(B.attributes ?? [], M, M + 1),
                  class: "kx-iconbtn sm",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: _(() => [
                    f(s(oe), { icon: "tabler:arrow-right" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ])) : u("", !0)
            ]),
            f(s(Sl), {
              disabled: !o.value,
              "model-value": s(Ul)(a.schema, B.namespace, F),
              options: s(pl),
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Width of " + s(J)(F.code),
              "onUpdate:modelValue": (ee) => F.width = ee
            }, null, 8, ["disabled", "model-value", "options", "aria-label", "onUpdate:modelValue"])
          ], 46, vt))), 128))
        ], 32)
      ]))), 128)),
      (e(!0), i(H, null, se(b.value, (B) => (e(), i("section", {
        key: B.aspect,
        class: "pim-aspect"
      }, [
        l("header", kt, [
          l("div", null, [
            l("h3", null, y(s(J)(B.aspect)), 1),
            l("p", _t, y(v.value.get(B.aspect) ?? "No named family uses this group yet."), 1)
          ]),
          S[3] || (S[3] = l("span", { class: "muted small" }, "Provided by a plugin", -1))
        ]),
        l("div", wt, [
          (e(!0), i(H, null, se(B.codes, (F) => (e(), i("div", {
            key: F,
            class: "pim-lcard fixed",
            style: Cl({ gridColumn: "span " + (s(pl).find((M) => M.value === a.schema.attributes[F].width)?.span ?? 6) })
          }, [
            l("div", $t, [
              l("span", Ct, y(s(J)(F)), 1),
              l("span", xt, y($.value.get(a.schema.attributes[F].type) ?? s(il)(void 0)), 1)
            ])
          ], 4))), 128))
        ])
      ]))), 128))
    ]));
  }
}), Ut = {
  class: "pim-history",
  "aria-label": "Catalog history"
}, jt = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, St = { class: "pim-table pim-responsive-table" }, At = ["id"], Ot = ["aria-labelledby"], Rt = {
  key: 0,
  scope: "col"
}, Pt = { class: "muted small" }, Tt = ["datetime"], qt = {
  key: 0,
  class: "small"
}, It = {
  key: 0,
  class: "muted"
}, Ft = { class: "mono small" }, Dt = {
  key: 0,
  class: "muted"
}, Nt = {
  key: 0,
  class: "muted small"
}, zt = ["aria-labelledby"], Bt = { class: "pim-stacked-meta muted small" }, Lt = { key: 0 }, Mt = { key: 1 }, Et = ["datetime"], Wt = {
  key: 1,
  class: "kx-empty"
}, Ht = { class: "pim-table-foot" }, Jt = /* @__PURE__ */ pe({
  __name: "HistoryPanel",
  props: {
    catalogId: {},
    canResolveActors: { type: Boolean }
  },
  setup(a) {
    const m = a, t = Y([]), n = Y({}), o = Y(), d = Y(!1), $ = Y(), v = Ge(), b = Te(), T = D(() => t.value.map((g) => ({
      key: `${g.seq}:${g.n}`,
      at: g.at,
      date: ot(g.at),
      actor: n.value[g.actor] ?? ce(g.actor, "Person"),
      source: g.source ? ce(J(g.source), "Data source") : "",
      product: L(g),
      context: g.ctx ? ce(g.ctx, "Product context") : "",
      change: Z(g)
    })));
    async function O(g = !1) {
      const x = v.begin();
      d.value = !0, $.value = void 0;
      try {
        const r = await ye.history(m.catalogId, { limit: 50, before: g ? o.value : void 0 });
        if (!v.current(x)) return;
        if (t.value = g ? [...t.value, ...r.entries] : r.entries, o.value = r.next, m.canResolveActors)
          try {
            const S = await aa(m.catalogId, r.entries.map((B) => B.actor));
            v.current(x) && (n.value = { ...n.value, ...S });
          } catch {
          }
      } catch (r) {
        if (!v.current(x)) return;
        $.value = Ke(r, "Could not load the history.");
      } finally {
        v.current(x) && (d.value = !1);
      }
    }
    function L(g) {
      return g.sku ? g.sku : g.subject.startsWith("p:") ? "purged product" : g.subject.startsWith("t:") ? g.subject.slice(2) : g.subject.startsWith("r:") ? "Release" : ce(g.subject, "Catalog");
    }
    function Z(g) {
      if (g.attribute)
        return dt(J(g.attribute), g.before, g.after);
      switch (g.kind) {
        case "schema":
          return "Catalog settings applied";
        case "term": {
          const x = g.after ?? {}, r = x.labels?.en ?? Object.values(x.labels ?? {})[0];
          return x.retired ? "Term retired" : r ? `Term labelled "${r}"` + (x.parent ? ` under ${x.parent}` : "") : "Term changed";
        }
        case "created": {
          const x = g.after ?? {};
          return `Created as ${J(x.family ?? "product")}` + (x.level ? ` at level ${x.level}` : "");
        }
        case "released": {
          const x = g.after ?? {};
          return `Released v${x.version ?? ""} to ${(x.channels ?? []).join(", ")}`;
        }
        case "withdrawn":
          return `Withdrawn from ${((g.after ?? {}).channels ?? []).join(", ")}`;
        case "status":
          return `Status ${String(g.before ?? "")} → ${String(g.after ?? "")}`;
        case "moved":
          return "Moved under another parent";
        default:
          return J(g.kind);
      }
    }
    let z = () => {
    };
    return be(() => m.catalogId, () => {
      z(), v.begin(), t.value = [], n.value = {}, o.value = void 0, $.value = void 0, z = Xl(`component.${m.catalogId}`, () => {
        O();
      });
    }, { immediate: !0 }), be(() => m.catalogId, () => {
      O();
    }), fl(() => O()), Ye(() => {
      z(), v.begin();
    }), (g, x) => (e(), i("section", Ut, [
      $.value ? (e(), R(bl, {
        key: 0,
        error: $.value
      }, {
        default: _(() => [
          f(s(G), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: x[0] || (x[0] = (r) => O())
          }, {
            default: _(() => [...x[2] || (x[2] = [
              K("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : u("", !0),
      d.value ? (e(), i("div", jt, "Loading history…")) : u("", !0),
      l("div", St, [
        l("p", {
          id: s(b),
          class: "pim-history-caption muted small"
        }, "Catalog changes, newest first", 8, At),
        T.value.length ? (e(), i(H, { key: 0 }, [
          l("table", {
            class: "pim-grid",
            "aria-labelledby": s(b)
          }, [
            l("thead", null, [
              l("tr", null, [
                x[3] || (x[3] = l("th", { scope: "col" }, "When", -1)),
                a.canResolveActors ? (e(), i("th", Rt, "Who")) : u("", !0),
                x[4] || (x[4] = l("th", { scope: "col" }, "What", -1)),
                x[5] || (x[5] = l("th", { scope: "col" }, "Change", -1))
              ])
            ]),
            l("tbody", null, [
              (e(!0), i(H, null, se(T.value, (r) => (e(), i("tr", {
                key: r.key
              }, [
                l("td", Pt, [
                  l("time", {
                    datetime: r.at
                  }, y(r.date), 9, Tt)
                ]),
                a.canResolveActors ? (e(), i("td", qt, [
                  K(y(r.actor), 1),
                  r.source ? (e(), i("span", It, " via " + y(r.source), 1)) : u("", !0)
                ])) : u("", !0),
                l("td", Ft, [
                  K(y(r.product), 1),
                  r.context ? (e(), i("span", Dt, " · " + y(r.context), 1)) : u("", !0)
                ]),
                l("td", null, [
                  K(y(r.change), 1),
                  !a.canResolveActors && r.source ? (e(), i("span", Nt, " via " + y(r.source), 1)) : u("", !0)
                ])
              ]))), 128))
            ])
          ], 8, Ot),
          l("ol", {
            role: "list",
            class: "pim-stacked-list",
            "aria-labelledby": s(b)
          }, [
            (e(!0), i(H, null, se(T.value, (r) => (e(), i("li", {
              key: r.key,
              class: "pim-stacked-row"
            }, [
              l("div", null, y(r.change), 1),
              l("div", Bt, [
                a.canResolveActors ? (e(), i("span", Lt, [
                  l("span", null, y(r.actor), 1),
                  r.source ? (e(), i(H, { key: 0 }, [
                    K(" via " + y(r.source), 1)
                  ], 64)) : u("", !0)
                ])) : r.source ? (e(), i("span", Mt, "Via " + y(r.source), 1)) : u("", !0),
                l("time", {
                  datetime: r.at
                }, y(r.date), 9, Et),
                l("span", null, [
                  K(y(r.product), 1),
                  r.context ? (e(), i(H, { key: 0 }, [
                    K(" · " + y(r.context), 1)
                  ], 64)) : u("", !0)
                ])
              ])
            ]))), 128))
          ], 8, zt)
        ], 64)) : !d.value && !$.value ? (e(), i("div", Wt, "Nothing recorded yet.")) : u("", !0),
        l("div", Ht, [
          l("span", null, y(T.value.length) + " change" + y(T.value.length === 1 ? "" : "s") + " shown", 1),
          o.value ? (e(), R(s(G), {
            key: 0,
            type: "button",
            disabled: d.value,
            onClick: x[1] || (x[1] = (r) => O(!0)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: _(() => [
              f(s(oe), {
                icon: "tabler:adjustments",
                "aria-hidden": "true"
              }),
              x[6] || (x[6] = K(" Load older", -1))
            ]),
            _: 1
          }, 8, ["disabled"])) : u("", !0)
        ])
      ])
    ]));
  }
}), Kt = { class: "system-section-head" }, Gt = { class: "system-section-head-text" }, Yt = {
  key: 0,
  class: "kx-head-actions"
}, Zt = /* @__PURE__ */ pe({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(a) {
    return (m, t) => (e(), i("header", Kt, [
      l("div", Gt, [
        l("h1", null, y(a.title), 1),
        l("p", null, y(a.description), 1)
      ]),
      m.$slots.actions ? (e(), i("div", Yt, [
        Se(m.$slots, "actions")
      ])) : u("", !0)
    ]));
  }
}), Qt = /* @__PURE__ */ pe({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(a) {
    return (m, t) => (e(), i(H, null, [
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
        onClick: t[0] || (t[0] = (n) => m.$emit("discard"))
      }, {
        icon: _(() => [
          f(s(oe), {
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
        onClick: t[1] || (t[1] = (n) => m.$emit("review", n.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), Xt = ["onKeydown"], es = { class: "row pim-add-actions" }, ls = ["id"], Be = /* @__PURE__ */ pe({
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
    const t = a, n = m, o = Y(""), d = Y(!1), $ = Y(), v = Te(), b = D(() => {
      const g = o.value.trim();
      return t.fromName ? nt(g) : g;
    }), T = D(() => o.value.trim() ? t.existing?.includes(b.value) ? t.fromName ? "This name is already in use." : "This code is already in use." : t.fromName && !Jl.test(b.value) ? "Use a name that starts with a letter from A to Z." : Jl.test(b.value) ? "" : "Start with a lowercase letter and use only lowercase letters, numbers or underscores." : ""), O = D(() => !!b.value && !T.value);
    async function L() {
      d.value = !0, await He(), $.value?.querySelector("input")?.focus();
    }
    async function Z() {
      d.value = !1, o.value = "", await He(), $.value?.querySelector("button")?.focus();
    }
    function z() {
      O.value && (n("add", b.value), Z());
    }
    return (g, x) => (e(), i("div", {
      ref_key: "row",
      ref: $,
      class: "row pim-add-row"
    }, [
      d.value ? (e(), i("div", {
        key: 1,
        class: "row pim-add-editor",
        onKeydown: nl(ze(Z, ["stop", "prevent"]), ["esc"])
      }, [
        f(s(al), {
          modelValue: o.value,
          "onUpdate:modelValue": x[0] || (x[0] = (r) => o.value = r),
          type: "text",
          placeholder: a.label,
          "aria-label": a.label,
          invalid: !!T.value,
          "aria-describedby": T.value ? s(v) : void 0,
          class: Ae({ mono: !a.fromName }),
          onKeydown: nl(ze(z, ["prevent"]), ["enter"])
        }, null, 8, ["modelValue", "placeholder", "aria-label", "invalid", "aria-describedby", "class", "onKeydown"]),
        l("div", es, [
          f(s(G), {
            type: "button",
            disabled: !O.value,
            onClick: z
          }, {
            default: _(() => [
              K(y(a.action), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          f(s(G), {
            type: "button",
            label: "Cancel",
            outlined: "",
            severity: "secondary",
            onClick: Z
          })
        ]),
        T.value ? (e(), i("p", {
          key: 0,
          id: s(v),
          role: "status",
          class: "pim-add-code-error small"
        }, y(T.value), 9, ls)) : u("", !0)
      ], 40, Xt)) : (e(), R(s(G), {
        key: 0,
        type: "button",
        "aria-expanded": "false",
        severity: "secondary",
        outlined: "",
        size: a.regular ? void 0 : "small",
        onClick: L
      }, {
        default: _(() => [
          f(s(oe), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          K(" " + y(a.action), 1)
        ]),
        _: 1
      }, 8, ["size"])),
      Se(g.$slots, "default")
    ], 512));
  }
}), sa = Symbol("definitionColumns"), as = { code: "Code", kind: "Kind", details: "Details", usage: "Used by" }, ts = {
  code: "minmax(120px, 1fr)",
  kind: "140px",
  details: "minmax(120px, 1.2fr)",
  usage: "120px"
}, ss = {
  class: "pim-definition-scroll",
  tabindex: "0",
  "aria-label": "Definitions"
}, is = { class: "pim-definition-grid" }, ns = {
  key: 0,
  class: "pim-definition-columns",
  "aria-hidden": "true"
}, os = { class: "pim-definition-actions-heading" }, Le = /* @__PURE__ */ pe({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: { default: () => ["code"] },
    showActions: { type: Boolean }
  },
  setup(a) {
    const m = a;
    Yl(sa, D(() => m.columns));
    const t = D(() => ["48px", "minmax(160px, 1.4fr)", ...m.columns.map((n) => ts[n]), m.showActions ? "100px" : "80px"].join(" "));
    return (n, o) => (e(), i("section", {
      class: "form pim-definition-list",
      style: Cl({ "--pim-definition-columns": t.value })
    }, [
      Se(n.$slots, "head"),
      l("div", ss, [
        l("div", is, [
          a.count > 3 ? (e(), i("div", ns, [
            o[0] || (o[0] = l("span", null, null, -1)),
            o[1] || (o[1] = l("span", null, "Name", -1)),
            (e(!0), i(H, null, se(a.columns, (d) => (e(), i("span", {
              key: d,
              class: Ae("pim-definition-" + d)
            }, y(s(as)[d]), 3))), 128)),
            l("span", os, y(a.showActions ? "Actions" : ""), 1)
          ])) : u("", !0),
          Se(n.$slots, "default")
        ])
      ]),
      Se(n.$slots, "add")
    ], 4));
  }
}), ds = ["aria-label"], rs = /* @__PURE__ */ pe({
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
      Se(m.$slots, "default")
    ], 8, ds));
  }
}), ia = Symbol("section row"), us = { class: "pim-definition" }, cs = {
  class: "pim-definition-lead",
  "data-column": "lead"
}, ms = {
  class: "pim-row-title",
  "data-column": "name"
}, ps = { class: "pim-definition-meta" }, vs = ["data-column"], fs = {
  key: 0,
  class: "mono"
}, bs = {
  class: "pim-definition-actions",
  "data-column": "actions"
}, ys = ["id"], Me = /* @__PURE__ */ pe({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ xl({
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
    const m = a, t = El(sa, D(() => [
      ...m.code ? ["code"] : [],
      ...m.kind ? ["kind"] : []
    ])), n = Zl(a, "open"), o = Te(), d = El(ia, void 0);
    function $(b) {
      return !!m.routeSection && !!m.routeId && b === m.routeSection + "/" + m.routeId;
    }
    be(() => d?.selected.value, (b, T) => {
      $(b) ? n.value = !0 : $(T) && (n.value = !1);
    }, { immediate: !0 });
    function v() {
      const b = !n.value;
      n.value = b, m.routeSection && m.routeId && d?.choose(m.routeSection, m.routeId, b);
    }
    return (b, T) => (e(), i("section", us, [
      l("header", {
        class: Ae(["pim-definition-head", a.headClass])
      }, [
        f(rs, {
          class: Ae(["pim-definition-toggle", a.toggleClass]),
          "aria-expanded": n.value,
          "aria-controls": n.value ? s(o) : void 0,
          onClick: v
        }, {
          default: _(() => [
            l("span", cs, [
              f(s(oe), {
                icon: "tabler:chevron-right",
                class: "pim-definition-chevron",
                "aria-hidden": "true"
              })
            ]),
            l("span", ms, y(a.title), 1),
            l("span", ps, [
              (e(!0), i(H, null, se(s(t), (O) => (e(), i("span", {
                key: O,
                class: Ae("pim-definition-" + O),
                "data-column": O
              }, [
                O === "code" && a.code ? (e(), i("code", fs, y(a.code), 1)) : O === "kind" && a.kind ? (e(), R(s(he), {
                  key: 1,
                  severity: "secondary",
                  value: a.kind
                }, null, 8, ["value"])) : O === "details" ? Se(b.$slots, "details", {}, void 0, void 0, 2) : O === "usage" ? Se(b.$slots, "usage", {}, () => [
                  K(y(a.usage), 1)
                ], void 0, 3) : u("", !0)
              ], 10, vs))), 128))
            ])
          ]),
          _: 3
        }, 8, ["class", "aria-expanded", "aria-controls"]),
        l("div", bs, [
          Se(b.$slots, "actions")
        ])
      ], 2),
      f(Fa, { name: "pim-expand" }, {
        default: _(() => [
          n.value ? (e(), i("div", {
            key: 0,
            id: s(o),
            class: "pim-definition-body"
          }, [
            Se(b.$slots, "default")
          ], 8, ys)) : u("", !0)
        ]),
        _: 3
      })
    ]));
  }
}), gs = { class: "pim-chips pim-picker-chips" }, hs = {
  key: 0,
  class: "muted"
}, ks = {
  key: 0,
  class: "muted small"
}, _s = {
  key: 0,
  class: "muted"
}, ws = {
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
  setup(a, { emit: m }) {
    const t = a, n = m, o = Y("");
    function d(L) {
      return t.modelValue.includes(L);
    }
    function $(L) {
      t.disabled || !L || n("update:modelValue", d(L) ? t.modelValue.filter((Z) => Z !== L) : [...t.modelValue, L]);
    }
    function v() {
      const L = o.value.trim();
      if (!L || d(L)) {
        o.value = "";
        return;
      }
      n("update:modelValue", [...t.modelValue, L]), o.value = "";
    }
    function b(L) {
      n("update:modelValue", t.modelValue.filter((Z) => Z !== L));
    }
    const T = D(() => t.modelValue.map((L) => t.options?.find((Z) => Z.value === L) ?? { value: L }));
    function O(L) {
      const Z = L.label ?? L.value;
      return L.detail ? Z + " " + L.detail : Z;
    }
    return (L, Z) => (e(), i("div", gs, [
      a.disabled ? (e(), i(H, { key: 0 }, [
        (e(!0), i(H, null, se(T.value, (z) => (e(), i("span", {
          key: z.value
        }, [
          K(y(z.label ?? z.value) + " ", 1),
          z.detail ? (e(), i("small", hs, y(z.detail), 1)) : u("", !0)
        ]))), 128)),
        a.modelValue.length ? u("", !0) : (e(), i("span", ks, "None"))
      ], 64)) : a.options && (a.dropdown || a.options.length > 10) ? (e(), i(H, { key: 1 }, [
        (e(!0), i(H, null, se(T.value, (z) => (e(), i("span", {
          key: z.value,
          class: "row"
        }, [
          l("span", null, [
            K(y(z.label ?? z.value) + " ", 1),
            z.detail ? (e(), i("small", _s, y(z.detail), 1)) : u("", !0)
          ]),
          f(s(G), {
            type: "button",
            "aria-label": "Remove " + O(z),
            onClick: (g) => b(z.value),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: _(() => [
              f(s(oe), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128)),
        a.disabled ? u("", !0) : (e(), R(s($e), {
          key: 0,
          "model-value": null,
          placeholder: a.placeholder ?? "Add…",
          "aria-labelledby": a.labelledby,
          "aria-label": a.placeholder ?? "Add",
          "onUpdate:modelValue": Z[0] || (Z[0] = (z) => $(z)),
          class: "pim-chip-entry",
          options: a.options.filter((z) => !d(z.value)),
          "option-label": O,
          "option-value": "value",
          appendTo: "self"
        }, {
          option: _(({ option: z }) => [
            l("span", null, [
              K(y(z.label ?? z.value) + " ", 1),
              z.detail ? (e(), i("small", ws, y(z.detail), 1)) : u("", !0)
            ])
          ]),
          _: 1
        }, 8, ["placeholder", "aria-labelledby", "aria-label", "options"]))
      ], 64)) : a.options ? (e(), i(H, { key: 2 }, [
        f(s(Sl), {
          "model-value": a.modelValue.filter((z) => a.options.some((g) => g.value === z)),
          options: a.options.map((z) => ({ value: z.value, label: z.label ?? z.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          disabled: a.disabled,
          "aria-labelledby": a.labelledby,
          "aria-label": a.placeholder ?? "Selected values",
          "onUpdate:modelValue": Z[1] || (Z[1] = (z) => n("update:modelValue", [...z, ...a.modelValue.filter((g) => !a.options.some((x) => x.value === g))]))
        }, null, 8, ["model-value", "options", "disabled", "aria-labelledby", "aria-label"]),
        (e(!0), i(H, null, se(a.modelValue.filter((z) => !a.options.some((g) => g.value === z)), (z) => (e(), i("span", {
          key: z,
          class: "row"
        }, [
          K(y(z), 1),
          f(s(G), {
            type: "button",
            "aria-label": "Remove " + z,
            onClick: (g) => b(z),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: _(() => [
              f(s(oe), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128))
      ], 64)) : (e(!0), i(H, { key: 3 }, se(a.modelValue, (z) => (e(), i("span", {
        key: z,
        class: "row"
      }, [
        K(y(z), 1),
        f(s(G), {
          type: "button",
          "aria-label": "Remove " + z,
          onClick: (g) => b(z),
          size: "small",
          text: "",
          severity: "secondary"
        }, {
          default: _(() => [
            f(s(oe), { icon: "tabler:x" })
          ]),
          _: 1
        }, 8, ["aria-label", "onClick"])
      ]))), 128)),
      a.free && !a.disabled ? (e(), R(s(al), {
        key: 4,
        modelValue: o.value,
        "onUpdate:modelValue": Z[2] || (Z[2] = (z) => o.value = z),
        type: "text",
        "aria-labelledby": a.labelledby,
        placeholder: a.placeholder ?? "Add…",
        onKeydown: nl(ze(v, ["prevent"]), ["enter"]),
        onBlur: v,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "aria-labelledby", "placeholder", "onKeydown"])) : u("", !0)
    ]));
  }
}), $s = { key: 0 }, Cs = {
  key: 0,
  class: "pim-config-overrides"
}, xs = {
  key: 1,
  class: "muted small"
}, Vs = { key: 3 }, Us = ["schema", "config"], js = {
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
    problemLabel: {},
    pluginId: {},
    refusal: {}
  },
  emits: ["update:modelValue"],
  setup(a, { emit: m }) {
    const t = a, n = m, o = Y("pending"), d = D(() => {
      const T = t.schema.properties;
      return !T || typeof T != "object" ? t.schema : {
        ...t.schema,
        properties: Object.fromEntries(Object.entries(T).map(([O, L]) => [
          O,
          L && typeof L == "object" ? { ...L, title: tl(t.schema, O) } : L
        ]))
      };
    }), $ = D(() => Object.entries(t.modelValue).map(([T, O]) => ({
      key: T,
      label: tl(t.schema, T),
      value: O !== null && typeof O == "object" ? JSON.stringify(O) : dl(O)
    })));
    async function v() {
      o.value = "pending", o.value = await Kl("wc-schema-form") ? "ready" : "failed";
    }
    be(() => t.disabled, (T) => {
      T || v();
    }, { immediate: !0 });
    function b(T) {
      const O = T.detail;
      O && typeof O == "object" && !Array.isArray(O) && n("update:modelValue", O);
    }
    return (T, O) => (e(), i(H, null, [
      a.refusal || a.problem ? (e(), R(s(Ce), {
        key: 0,
        severity: "warn",
        role: "alert"
      }, {
        default: _(() => [
          a.refusal ? (e(), i(H, { key: 0 }, [
            K(y(a.refusal), 1)
          ], 64)) : a.problemLabel ? (e(), i(H, { key: 1 }, [
            K(y(a.problemLabel) + " is required. Enter a value below.", 1)
          ], 64)) : (e(), i(H, { key: 2 }, [
            K("The saved settings don’t meet the plugin’s requirements. Update the configuration below.")
          ], 64))
        ]),
        _: 1
      })) : u("", !0),
      a.problem ? (e(), R(we, {
        key: 1,
        class: "small pim-error-code pim-ia-disclosure",
        label: "Technical details"
      }, {
        default: _(() => [
          a.pluginId ? (e(), i("p", $s, [
            O[1] || (O[1] = K("Plugin ", -1)),
            l("code", null, y(a.pluginId), 1)
          ])) : u("", !0),
          l("p", null, y(a.problem.message), 1)
        ]),
        _: 1
      })) : u("", !0),
      a.disabled ? (e(), i(H, { key: 2 }, [
        $.value.length ? (e(), i("dl", Cs, [
          (e(!0), i(H, null, se($.value, (L) => (e(), i(H, {
            key: L.key
          }, [
            l("dt", null, y(L.label), 1),
            l("dd", null, y(L.value), 1)
          ], 64))), 128))
        ])) : (e(), i("span", xs, "No overrides"))
      ], 64)) : (e(), i("div", Vs, [
        o.value === "ready" ? (e(), i("wc-schema-form", {
          key: 0,
          schema: JSON.stringify(d.value),
          config: JSON.stringify(a.modelValue),
          onConfigChanged: b
        }, null, 40, Us)) : o.value === "pending" ? (e(), i("span", js, "Configuration form is loading.")) : (e(), R(s(Ce), {
          key: 2,
          role: "alert",
          severity: "error"
        }, {
          default: _(() => [
            O[3] || (O[3] = K("Configuration form could not be loaded. ", -1)),
            f(s(G), {
              type: "button",
              onClick: v,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: _(() => [...O[2] || (O[2] = [
                K("Retry", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })),
        a.problem ? u("", !0) : (e(), R(s(G), {
          key: 3,
          type: "button",
          onClick: O[0] || (O[0] = (L) => n("update:modelValue", {})),
          severity: "secondary",
          outlined: "",
          size: "small"
        }, {
          default: _(() => [
            f(s(oe), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            }),
            O[4] || (O[4] = K(" Reset overrides", -1))
          ]),
          _: 1
        }))
      ]))
    ], 64));
  }
}), Ss = { key: 0 }, As = /* @__PURE__ */ pe({
  __name: "DefaultValue",
  props: {
    attribute: {},
    type: {},
    disabled: { type: Boolean }
  },
  emits: ["change"],
  setup(a, { emit: m }) {
    const t = a, n = m, o = D(() => {
      const b = t.type?.form;
      let T = { type: "string" };
      return b === "bool" ? T = { type: "boolean" } : b === "int" ? T = { type: "integer" } : b === "dec" ? T = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : b === "quantity" ? T = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(t.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : b === "record" ? T = { type: "object", additionalProperties: !0 } : b === "ref" && (T = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${t.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (t.attribute.cardinality ?? "one") !== "one" && (T = { type: "array", items: T, uniqueItems: t.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...T, title: "Default value" } } };
    });
    function d(b) {
      return b && typeof b == "object" && "m" in b && "e" in b ? jl(b) : b;
    }
    function $(b) {
      return t.type?.form === "dec" ? d(b) : t.type?.form === "quantity" && b && typeof b == "object" && "v" in b && "u" in b ? { value: d(b.v), unit: b.u } : b;
    }
    const v = D(() => t.attribute.default === void 0 ? {} : { value: Array.isArray(t.attribute.default) ? t.attribute.default.map($) : $(t.attribute.default) });
    return (b, T) => a.disabled ? (e(), i("span", Ss, y(a.attribute.default == null ? "No default" : s(dl)(a.attribute.default)), 1)) : (e(), R(Al, {
      key: 1,
      schema: o.value,
      "model-value": v.value,
      "onUpdate:modelValue": T[0] || (T[0] = (O) => n("change", O.value))
    }, null, 8, ["schema", "model-value"]));
  }
}), Os = { class: "pim-stack" }, Rs = {
  key: 0,
  class: "pim-ia-action"
}, Ps = {
  key: 1,
  class: "form pim-card-body pad muted"
}, Ts = { class: "pim-bsection-head pim-list-header" }, qs = { class: "small muted" }, Is = { class: "row pim-list-actions" }, Fs = { class: "pim-fields" }, Ds = { class: "pim-f pim-w-third" }, Ns = { class: "pim-f-label" }, zs = ["id"], Bs = { class: "pim-f pim-w-third" }, Ls = { class: "pim-f-label" }, Ms = ["id"], Es = {
  key: 0,
  class: "pim-f pim-w-third"
}, Ws = { class: "pim-f-label" }, Hs = ["id"], Js = {
  key: 1,
  class: "pim-f pim-w-full muted small"
}, Ks = {
  key: 2,
  class: "pim-f pim-w-full muted small"
}, Gs = {
  key: 3,
  class: "pim-f pim-w-third"
}, Ys = { class: "pim-f-label" }, Zs = ["id"], Qs = { class: "pim-f pim-w-third" }, Xs = { class: "pim-f-label" }, ei = ["id"], li = { class: "pim-f pim-w-half" }, ai = { class: "pim-f-label" }, ti = ["id"], si = ["aria-labelledby"], ii = { class: "pim-f-label" }, ni = ["id"], oi = ["aria-labelledby"], di = { class: "pim-f-label" }, ri = ["id"], ui = { class: "pim-fields" }, ci = { class: "pim-f pim-w-third" }, mi = { class: "pim-f-label" }, pi = ["for"], vi = {
  key: 0,
  class: "pim-f-note"
}, fi = { class: "pim-f pim-w-third" }, bi = { class: "pim-f-label" }, yi = ["id"], gi = { class: "pim-f pim-w-half" }, hi = { class: "pim-f-label" }, ki = ["for"], _i = { class: "row" }, wi = {
  key: 0,
  class: "pim-f pim-w-full"
}, $i = { class: "pim-f-label" }, Ci = ["id"], xi = ["aria-labelledby"], Vi = ["id"], Ui = {
  key: 0,
  class: "row end"
}, ji = { class: "pim-ia-dialog-head" }, Si = {
  tabindex: "-1",
  autofocus: ""
}, Ai = { class: "pim-source-permissions" }, Oi = ["id"], Ri = { class: "dialog-actions pim-group-dialog-actions" }, Pi = /* @__PURE__ */ pe({
  __name: "BuilderFields",
  props: /* @__PURE__ */ xl({
    draft: {},
    schema: {},
    options: {}
  }, {
    family: { default: "" },
    familyModifiers: {}
  }),
  emits: /* @__PURE__ */ xl(["remove", "layout"], ["update:family"]),
  setup(a, { emit: m }) {
    const t = a, n = Zl(a, "family"), o = m, d = pl.map((I) => I.value), $ = [{ value: "one", label: "Single value" }, { value: "list", label: "Ordered list" }, { value: "set", label: "Unique set" }], v = D(() => t.schema.access.admin), b = D(() => t.draft.aspects ?? []), T = D(() => (t.draft.families ?? []).filter((I) => I.code !== "generic"));
    be(T, (I) => {
      n.value && !I.some((V) => V.code === n.value) && (n.value = "");
    }, { immediate: !0 });
    const O = D(() => [{ value: "", label: "All families" }, ...T.value.map((I) => ({ value: I.code, label: J(I.code) }))]), L = D(() => {
      const I = T.value.find((V) => V.code === n.value);
      return I ? b.value.filter((V) => I.aspects?.includes(V.namespace)) : b.value;
    }), Z = D(() => (t.draft.dimensions ?? []).map((I) => ({ value: I.name, label: J(I.name) }))), z = D(() => (t.draft.vocabularies ?? []).map((I) => I.code)), g = D(() => (t.draft.sources ?? []).map((I) => ({ value: I.id, label: J(I.id) }))), x = D(() => [...t.options.types].sort((I, V) => I.form.localeCompare(V.form)).map((I) => ({ value: I.id, label: il(I) })));
    function r(I) {
      return t.options.types.find((V) => V.id === I.type);
    }
    function S(I) {
      return r(I)?.target === "term";
    }
    function B(I) {
      return r(I)?.target === "asset";
    }
    function F(I) {
      const V = r(I);
      return !!V && V.form === "ref" && !V.target;
    }
    const M = D(() => ta(t.draft.families)), ee = { none: "None", key: "Exact match", number: "Number range", text: "Text search" }, P = Y({}), ne = Te(), Q = /* @__PURE__ */ new WeakMap();
    let q = 0;
    function X(I, V) {
      if (V.id !== void 0) return I + "." + V.id;
      const N = Da(V);
      let k = Q.get(N);
      return k === void 0 && (k = ++q, Q.set(N, k)), I + ".draft-" + k;
    }
    function A(I, V, N) {
      return ne + "-" + X(I, V) + "-" + N;
    }
    function C(I, V) {
      I.type = V;
      const N = r(I);
      if (N && I.index && !N.indexes.includes(I.index) && delete I.index, S(I) || delete I.vocabulary, B(I) && delete I.default, !F(I) && I.config && "target" in I.config) {
        const { target: k, ...ve } = I.config;
        I.config = Object.keys(ve).length ? ve : void 0, I.config || delete I.config;
      }
    }
    function j(I, V) {
      Object.keys(V).length ? I.config = V : delete I.config;
    }
    function c(I, V) {
      const N = { ...I.config ?? {} };
      V ? N.target = V : delete N.target, j(I, N);
    }
    function h(I, V) {
      V.length ? I.scope = V : delete I.scope, V.length || delete I.index_contexts;
    }
    function E(I, V, N) {
      N === void 0 || N === "" || N === !1 && V !== "default" ? delete I[V] : I[V] = N;
    }
    function de(I) {
      return I.index_contexts ?? [];
    }
    function W(I) {
      return (t.draft.dimensions ?? []).find((V) => V.name === I)?.members ?? [];
    }
    function ie(I) {
      const V = {};
      for (const k of I.scope ?? []) V[k] = W(k)[0] ?? "";
      (I.index_contexts ?? (I.index_contexts = [])).push(V);
    }
    const te = Y(), xe = D(() => te.value ? J(te.value.namespace) + " settings" : "");
    async function ge(I, V, N, k) {
      const ve = I.currentTarget, ae = ve.parentElement;
      ml(V, N, k), await He(), (ve.isConnected ? ve : ae?.querySelector("button"))?.focus({ preventScroll: !0 });
    }
    function Ie(I) {
      (t.draft.aspects ??= []).push({ namespace: I, attributes: [] });
    }
    function rl(I) {
      te.value = void 0;
      const V = b.value.indexOf(I);
      V >= 0 && b.value.splice(V, 1), t.schema.declaration.aspects?.some((N) => N.namespace === I.namespace) && o("remove", "aspects", I.namespace);
    }
    function Ve(I, V) {
      const N = t.options.types.find((ve) => ve.id === "kickside.pim.types:text") ?? t.options.types[0], k = { code: V, type: N?.id ?? "" };
      (I.attributes ??= []).push(k), P.value[X(I.namespace, k)] = !0;
    }
    function Ue(I, V) {
      const N = I.attributes ?? [], k = N.indexOf(V);
      k >= 0 && N.splice(k, 1);
      const ve = V.id === void 0 ? void 0 : t.schema.declaration.aspects?.find((ae) => ae.namespace === I.namespace)?.attributes?.find((ae) => ae.id === V.id);
      ve && o("remove", "attributes", I.namespace + "." + ve.code);
    }
    return (I, V) => (e(), i("div", Os, [
      T.value.length || v.value && !n.value || b.value.length ? (e(), i("div", Rs, [
        T.value.length ? (e(), R(s($e), {
          key: 0,
          modelValue: n.value,
          "onUpdate:modelValue": V[0] || (V[0] = (N) => n.value = N),
          class: "pim-family-filter",
          "aria-label": "Show fields for a family",
          placeholder: "All families",
          options: O.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self"
        }, null, 8, ["modelValue", "options"])) : u("", !0),
        v.value && !n.value ? (e(), R(Be, {
          key: 1,
          label: "Field group name",
          action: "Add field group",
          "from-name": "",
          regular: "",
          existing: b.value.map((N) => N.namespace),
          onAdd: Ie
        }, null, 8, ["existing"])) : u("", !0),
        b.value.length ? (e(), R(s(G), {
          key: 2,
          label: "Open form layout",
          type: "button",
          text: "",
          size: "small",
          onClick: V[1] || (V[1] = (N) => o("layout"))
        })) : u("", !0)
      ])) : u("", !0),
      n.value && !L.value.length ? (e(), i("p", Ps, "This family has no field groups yet. Open the family to choose which groups it uses.")) : u("", !0),
      (e(!0), i(H, null, se(L.value, (N) => (e(), R(Le, {
        key: N.namespace,
        count: N.attributes?.length ?? 0,
        columns: ["kind", "details"],
        "show-actions": v.value
      }, {
        head: _(() => [
          l("header", Ts, [
            l("div", null, [
              l("h3", null, y(s(J)(N.namespace)), 1),
              l("p", qs, y(M.value.get(N.namespace) ?? "Unused by families"), 1)
            ]),
            l("div", Is, [
              v.value ? (e(), R(Be, {
                key: 0,
                label: "Field name",
                action: "Add field",
                "from-name": "",
                existing: N.attributes?.map((k) => k.code),
                onAdd: (k) => Ve(N, k)
              }, null, 8, ["existing", "onAdd"])) : u("", !0),
              f(s(G), {
                type: "button",
                "aria-label": s(J)(N.namespace) + " settings",
                title: s(J)(N.namespace) + " settings",
                "aria-haspopup": "dialog",
                severity: "secondary",
                text: "",
                size: "small",
                onClick: (k) => te.value = N
              }, {
                default: _(() => [
                  f(s(oe), {
                    icon: "tabler:settings",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "title", "onClick"])
            ])
          ])
        ]),
        default: _(() => [
          (e(!0), i(H, null, se(N.attributes ?? [], (k, ve) => (e(), R(Me, {
            "route-section": "fields",
            "route-id": k.id === void 0 ? void 0 : X(N.namespace, k),
            key: X(N.namespace, k),
            open: P.value[X(N.namespace, k)],
            "onUpdate:open": (ae) => P.value[X(N.namespace, k)] = ae,
            title: s(J)(k.code),
            kind: s(il)(r(k)),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle"
          }, _e({
            details: _(() => [
              k.cardinality && k.cardinality !== "one" ? (e(), R(s(he), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: _(() => [
                  K(y($.find((ae) => ae.value === k.cardinality)?.label), 1)
                ]),
                _: 2
              }, 1024)) : u("", !0),
              k.scope?.length ? (e(), R(s(he), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: _(() => [
                  K("per " + y(k.scope.map(s(J)).join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : u("", !0),
              k.index && k.index !== "none" ? (e(), R(s(he), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: _(() => [
                  K(y(ee[k.index] || "Filterable"), 1)
                ]),
                _: 2
              }, 1024)) : u("", !0),
              k.unique ? (e(), R(s(he), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: _(() => [...V[7] || (V[7] = [
                  K("unique", -1)
                ])]),
                _: 1
              })) : u("", !0)
            ]),
            default: _(() => [
              l("div", Fs, [
                l("div", Ds, [
                  l("div", Ns, [
                    l("label", {
                      id: A(N.namespace, k, "type")
                    }, "Type", 8, zs)
                  ]),
                  f(s($e), {
                    disabled: !v.value,
                    "aria-labelledby": A(N.namespace, k, "type"),
                    "model-value": k.type,
                    options: x.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (ae) => C(k, ae)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                l("div", Bs, [
                  l("div", Ls, [
                    l("label", {
                      id: A(N.namespace, k, "values")
                    }, "Values", 8, Ms)
                  ]),
                  f(s($e), {
                    disabled: !v.value,
                    "aria-labelledby": A(N.namespace, k, "values"),
                    "model-value": k.cardinality ?? "one",
                    options: $,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (ae) => E(k, "cardinality", ae === "one" ? void 0 : ae)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                S(k) ? (e(), i("div", Es, [
                  l("div", Ws, [
                    l("label", {
                      id: A(N.namespace, k, "vocabulary")
                    }, "Vocabulary", 8, Hs)
                  ]),
                  f(s($e), {
                    disabled: !v.value,
                    "aria-labelledby": A(N.namespace, k, "vocabulary"),
                    "model-value": k.vocabulary ?? "",
                    "onUpdate:modelValue": (ae) => E(k, "vocabulary", ae),
                    options: [{ value: "", label: "Choose…" }, ...z.value.map((ae) => ({ value: ae, label: s(J)(ae) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : u("", !0),
                B(k) ? (e(), i("p", Js, "Choose the media types and file size this field accepts. Catalog readers can access attached files.")) : r(k)?.form === "ref" && !S(k) ? (e(), i("p", Ks, y(F(k) ? "A link points to something managed by an installed plugin." : "A product reference points to another product in this catalog."), 1)) : u("", !0),
                F(k) ? (e(), i("div", Gs, [
                  l("div", Ys, [
                    l("label", {
                      id: A(N.namespace, k, "link")
                    }, "Link destination", 8, Zs),
                    V[8] || (V[8] = l("span", { class: "pim-f-note" }, "choose what the field can point to", -1))
                  ]),
                  f(s($e), {
                    disabled: !v.value,
                    "aria-labelledby": A(N.namespace, k, "link"),
                    "model-value": k.config?.target ?? "",
                    "onUpdate:modelValue": (ae) => c(k, ae),
                    options: [{ value: "", label: "Choose…" }, ...a.options.link_kinds.map((ae) => ({ value: ae.kind, label: s(ce)(ae.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : u("", !0),
                l("div", Qs, [
                  l("div", Xs, [
                    l("label", {
                      id: A(N.namespace, k, "width")
                    }, "Width", 8, ei),
                    V[9] || (V[9] = l("span", { class: "pim-f-note" }, "of a form row", -1))
                  ]),
                  f(s(Sl), {
                    disabled: !v.value,
                    "aria-labelledby": A(N.namespace, k, "width"),
                    "model-value": s(Ul)(a.schema, N.namespace, k),
                    options: s(d),
                    "allow-empty": !1,
                    "onUpdate:modelValue": (ae) => k.width = ae
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                l("div", li, [
                  l("div", ai, [
                    l("label", {
                      id: A(N.namespace, k, "scope")
                    }, "Varies per", 8, ti),
                    V[10] || (V[10] = l("span", { class: "pim-f-note" }, "dimensions the value depends on", -1))
                  ]),
                  f(Pe, {
                    disabled: !v.value,
                    labelledby: A(N.namespace, k, "scope"),
                    "model-value": k.scope ?? [],
                    options: Z.value,
                    "onUpdate:modelValue": (ae) => h(k, ae)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                B(k) ? u("", !0) : (e(), i("div", {
                  key: 4,
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": A(N.namespace, k, "default")
                }, [
                  l("div", ii, [
                    l("label", {
                      id: A(N.namespace, k, "default")
                    }, "Default", 8, ni),
                    V[11] || (V[11] = l("span", { class: "pim-f-note" }, "when no value is set", -1))
                  ]),
                  f(As, {
                    disabled: !v.value,
                    attribute: k,
                    type: r(k),
                    onChange: (ae) => E(k, "default", ae)
                  }, null, 8, ["disabled", "attribute", "type", "onChange"])
                ], 8, si)),
                r(k)?.config_schema ? (e(), i("div", {
                  key: 5,
                  class: "pim-f pim-w-full",
                  role: "group",
                  "aria-labelledby": A(N.namespace, k, "config")
                }, [
                  l("div", di, [
                    l("label", {
                      id: A(N.namespace, k, "config")
                    }, "Type configuration", 8, ri)
                  ]),
                  f(Al, {
                    disabled: !v.value,
                    schema: r(k).config_schema,
                    "model-value": k.config ?? {},
                    "onUpdate:modelValue": (ae) => j(k, ae)
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue"])
                ], 8, oi)) : u("", !0)
              ]),
              f(we, {
                class: "pim-field-advanced pim-ia-disclosure",
                label: "Advanced"
              }, {
                default: _(() => [
                  l("div", ui, [
                    l("div", ci, [
                      l("div", mi, [
                        l("label", {
                          for: A(N.namespace, k, "code")
                        }, "Integration key", 8, pi),
                        k.id !== void 0 ? (e(), i("span", vi, "renaming keeps stored values")) : u("", !0)
                      ]),
                      f(s(al), {
                        disabled: !v.value,
                        id: A(N.namespace, k, "code"),
                        type: "text",
                        value: k.code,
                        onInput: (ae) => k.code = ae.target.value,
                        class: "mono"
                      }, null, 8, ["disabled", "id", "value", "onInput"])
                    ]),
                    l("div", fi, [
                      l("div", bi, [
                        l("label", {
                          id: A(N.namespace, k, "index")
                        }, "Search and filters", 8, yi),
                        V[12] || (V[12] = l("span", { class: "pim-f-note" }, "choose how this field can be matched", -1))
                      ]),
                      f(s($e), {
                        disabled: !v.value,
                        "aria-labelledby": A(N.namespace, k, "index"),
                        "model-value": k.index ?? "none",
                        options: (r(k)?.indexes ?? ["none"]).map((ae) => ({ value: ae, label: ee[ae] || s(J)(ae) })),
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self",
                        "onUpdate:modelValue": (ae) => E(k, "index", ae === "none" ? void 0 : ae)
                      }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ]),
                    l("div", gi, [
                      l("div", hi, [
                        l("label", {
                          for: A(N.namespace, k, "unique")
                        }, "Unique", 8, ki),
                        V[13] || (V[13] = l("span", { class: "pim-f-note" }, "one holder per value, catalog wide", -1))
                      ]),
                      l("div", _i, [
                        f(s(ol), {
                          "input-id": A(N.namespace, k, "unique"),
                          "model-value": k.unique === !0,
                          disabled: !v.value || !!k.scope?.length || (k.cardinality ?? "one") !== "one",
                          "onUpdate:modelValue": (ae) => E(k, "unique", ae)
                        }, null, 8, ["input-id", "model-value", "disabled", "onUpdate:modelValue"]),
                        l("span", null, y(k.unique ? "Yes" : "No"), 1)
                      ])
                    ]),
                    (k.scope?.length ?? 0) > 0 && k.index && k.index !== "none" ? (e(), i("div", wi, [
                      l("div", $i, [
                        l("label", {
                          id: A(N.namespace, k, "contexts")
                        }, "Filterable combinations", 8, Ci),
                        V[14] || (V[14] = l("span", { class: "pim-f-note" }, "which combinations get an index", -1))
                      ]),
                      l("div", {
                        class: "pim-contexts",
                        role: "group",
                        "aria-labelledby": A(N.namespace, k, "contexts")
                      }, [
                        (e(!0), i(H, null, se(de(k), (ae, Fe) => (e(), i("div", {
                          key: Fe,
                          class: "pim-context-row"
                        }, [
                          (e(!0), i(H, null, se(k.scope, (ke) => (e(), i("div", {
                            key: ke,
                            class: "pim-context-field"
                          }, [
                            l("span", {
                              id: A(N.namespace, k, "context-" + Fe + "-" + ke),
                              class: "small muted"
                            }, y(s(J)(ke)), 9, Vi),
                            f(s($e), {
                              disabled: !v.value,
                              "aria-labelledby": A(N.namespace, k, "context-" + Fe + "-" + ke),
                              "model-value": ae[ke] ?? "",
                              options: W(ke),
                              class: "narrow",
                              appendTo: "self",
                              "onUpdate:modelValue": (yl) => ae[ke] = yl
                            }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                          ]))), 128)),
                          v.value ? (e(), R(s(G), {
                            key: 0,
                            type: "button",
                            "aria-label": "Remove context",
                            onClick: (ke) => de(k).splice(Fe, 1),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: _(() => [
                              f(s(oe), { icon: "tabler:x" })
                            ]),
                            _: 1
                          }, 8, ["onClick"])) : u("", !0)
                        ]))), 128)),
                        v.value ? (e(), R(s(G), {
                          key: 0,
                          type: "button",
                          onClick: (ae) => ie(k),
                          severity: "secondary",
                          outlined: "",
                          size: "small"
                        }, {
                          default: _(() => [
                            f(s(oe), {
                              icon: "tabler:plus",
                              "aria-hidden": "true"
                            }),
                            V[15] || (V[15] = K(" Add context", -1))
                          ]),
                          _: 1
                        }, 8, ["onClick"])) : u("", !0)
                      ], 8, xi)
                    ])) : u("", !0)
                  ])
                ]),
                _: 2
              }, 1024),
              v.value ? (e(), i("div", Ui, [
                f(s(G), {
                  type: "button",
                  onClick: (ae) => Ue(N, k),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: _(() => [
                    f(s(oe), { icon: "tabler:trash" }),
                    V[16] || (V[16] = K(" Remove field", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : u("", !0)
            ]),
            _: 2
          }, [
            v.value ? {
              name: "actions",
              fn: _(() => [
                ve > 0 ? (e(), R(s(G), {
                  key: 0,
                  type: "button",
                  "aria-label": "Move " + s(J)(k.code) + " earlier",
                  onClick: (ae) => ge(ae, N.attributes, ve, ve - 1),
                  text: "",
                  size: "small",
                  severity: "secondary"
                }, {
                  default: _(() => [
                    f(s(oe), {
                      icon: "tabler:arrow-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])) : u("", !0),
                ve < (N.attributes?.length ?? 0) - 1 ? (e(), R(s(G), {
                  key: 1,
                  type: "button",
                  class: "pim-move-later",
                  "aria-label": "Move " + s(J)(k.code) + " later",
                  onClick: (ae) => ge(ae, N.attributes, ve, ve + 1),
                  text: "",
                  size: "small",
                  severity: "secondary"
                }, {
                  default: _(() => [
                    f(s(oe), {
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
      f(vl, {
        visible: !!te.value,
        label: xe.value,
        onClose: V[6] || (V[6] = (N) => te.value = void 0)
      }, {
        default: _(() => [
          te.value ? (e(), i("section", {
            key: 0,
            class: "pim-ia-dialog",
            onKeydown: V[5] || (V[5] = nl(ze((N) => te.value = void 0, ["prevent"]), ["esc"]))
          }, [
            l("header", ji, [
              l("h2", Si, y(xe.value), 1)
            ]),
            l("div", Ai, [
              l("label", {
                id: s(ne) + "-writers"
              }, "Sources allowed to write", 8, Oi),
              f(s(ea), {
                disabled: !v.value,
                "aria-labelledby": s(ne) + "-writers",
                "model-value": te.value.write?.sources ?? [],
                options: g.value,
                "option-label": "label",
                "option-value": "value",
                placeholder: "Any source",
                "append-to": "self",
                "onUpdate:modelValue": V[2] || (V[2] = (N) => te.value.write = { sources: N })
              }, null, 8, ["disabled", "aria-labelledby", "model-value", "options"])
            ]),
            l("footer", Ri, [
              v.value ? (e(), R(s(G), {
                key: 0,
                type: "button",
                label: "Remove field group",
                severity: "danger",
                text: "",
                onClick: V[3] || (V[3] = (N) => rl(te.value))
              })) : u("", !0),
              f(s(G), {
                type: "button",
                label: "Done",
                severity: "secondary",
                outlined: "",
                onClick: V[4] || (V[4] = (N) => te.value = void 0)
              })
            ])
          ], 32)) : u("", !0)
        ]),
        _: 1
      }, 8, ["visible", "label"])
    ]));
  }
}), Ti = { class: "muted small" }, qi = { class: "pim-aspect" }, Ii = {
  key: 0,
  class: "small muted"
}, Fi = { class: "pim-fields" }, Di = { class: "pim-f pim-w-full" }, Ni = { class: "pim-f-label" }, zi = ["id"], Bi = { class: "pim-f-label" }, Li = ["id"], Mi = /* @__PURE__ */ pe({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(a, { emit: m }) {
    const t = a, n = m, o = D(() => t.schema.access.admin), d = D(() => t.draft.dimensions ?? []), $ = Te();
    function v(g, x) {
      return $ + "-" + g.name + "-" + x;
    }
    function b(g) {
      (t.draft.dimensions ??= []).push({ name: g, members: [] });
    }
    function T(g) {
      const x = [];
      for (const r of t.draft.aspects ?? []) for (const S of r.attributes ?? []) S.scope?.includes(g.name) && x.push(`${J(S.code)} (${J(r.namespace)})`);
      for (const r of t.draft.families ?? []) for (const S of r.requirements ?? []) S.context && g.name in S.context && x.push(`${J(S.id)} (${J(r.code)})`);
      return x;
    }
    function O(g) {
      T(g).length || (d.value.splice(d.value.indexOf(g), 1), t.schema.declaration.dimensions?.some((x) => x.name === g.name) && n("remove", "dimensions", g.name));
    }
    function L(g, x) {
      if (g.members = x, g.fallback)
        for (const r of Object.keys(g.fallback)) x.includes(r) || delete g.fallback[r];
    }
    function Z(g, x) {
      return g.fallback?.[x] ?? [];
    }
    function z(g, x, r) {
      const S = { ...g.fallback ?? {} };
      r.length ? S[x] = r : delete S[x], Object.keys(S).length ? g.fallback = S : delete g.fallback;
    }
    return (g, x) => (e(), R(Le, {
      count: d.value.length,
      columns: ["details", "usage"]
    }, _e({
      default: _(() => [
        (e(!0), i(H, null, se(d.value, (r) => (e(), R(Me, {
          "route-section": "dimensions",
          "route-id": r.name,
          title: s(J)(r.name),
          key: r.name,
          usage: T(r).length ? "Used in " + T(r).length + " places" : "Unused"
        }, _e({
          details: _(() => [
            l("span", Ti, y(r.members.map(s(J)).join(", ") || "No allowed values"), 1)
          ]),
          default: _(() => [
            l("div", qi, [
              T(r).length ? (e(), i("p", Ii, "Used by " + y(T(r).join(", ")), 1)) : u("", !0),
              l("div", Fi, [
                l("div", Di, [
                  l("div", Ni, [
                    l("label", {
                      id: v(r, "members")
                    }, "Allowed values", 8, zi),
                    x[0] || (x[0] = l("span", { class: "pim-f-note" }, "for example, English and French for Language", -1))
                  ]),
                  f(Pe, {
                    disabled: !o.value,
                    labelledby: v(r, "members"),
                    "model-value": r.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (S) => L(r, S)
                  }, null, 8, ["disabled", "labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                (e(!0), i(H, null, se(r.members, (S) => (e(), i("div", {
                  key: S,
                  class: "pim-f pim-w-half"
                }, [
                  l("div", Bi, [
                    l("label", {
                      id: v(r, "fallback-" + encodeURIComponent(S))
                    }, y(S) + " falls back to", 9, Li),
                    x[1] || (x[1] = l("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  f(Pe, {
                    disabled: !o.value,
                    labelledby: v(r, "fallback-" + encodeURIComponent(S)),
                    "model-value": Z(r, S),
                    options: r.members.filter((B) => B !== S).map((B) => ({ value: B })),
                    "onUpdate:modelValue": (B) => z(r, S, B)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]))), 128))
              ])
            ])
          ]),
          _: 2
        }, [
          o.value ? {
            name: "actions",
            fn: _(() => [
              f(s(G), {
                type: "button",
                disabled: T(r).length > 0,
                "aria-label": "Remove " + s(J)(r.name),
                title: T(r).length ? "Take the dimension off these first" : "",
                onClick: (S) => O(r),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: _(() => [
                  f(s(oe), { icon: "tabler:trash" })
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
      o.value ? {
        name: "add",
        fn: _(() => [
          f(Be, {
            label: "Dimension name",
            "from-name": "",
            action: "Add dimension",
            existing: d.value.map((r) => r.name),
            onAdd: b
          }, {
            default: _(() => [...x[2] || (x[2] = [
              l("span", { class: "muted small" }, "A dimension lets a value differ per member, with fallbacks between members.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), Ei = { class: "muted small" }, Wi = { class: "pim-aspect" }, Hi = { class: "row small" }, Ji = {
  key: 1,
  class: "muted small"
}, Ki = {
  key: 2,
  class: "pim-stack tight pim-terms"
}, Gi = {
  key: 0,
  class: "muted small"
}, Yi = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Zi = {
  key: 3,
  class: "pim-responsive-table"
}, Qi = {
  class: "pim-grid compact",
  "aria-label": "Vocabulary terms"
}, Xi = { key: 0 }, en = { key: 1 }, ln = {
  key: 0,
  class: "muted"
}, an = {
  key: 1,
  class: "num"
}, tn = {
  role: "list",
  class: "pim-stacked-list",
  "aria-label": "Vocabulary terms"
}, sn = {
  key: 0,
  class: "pim-stacked-meta muted small"
}, nn = {
  key: 4,
  class: "muted small"
}, on = { class: "row wrap" }, dn = {
  key: 5,
  class: "row wrap pim-add-row"
}, rn = {
  key: 0,
  class: "pim-config-overrides"
}, un = /* @__PURE__ */ pe({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(a, { emit: m }) {
    const t = a, n = m, o = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/, d = D(() => t.schema.access.admin), $ = D(() => d.value && t.schema.access.write), v = D(() => t.draft.vocabularies ?? []);
    function b(C) {
      (t.draft.vocabularies ??= []).push({ code: C });
    }
    function T(C) {
      v.value.splice(v.value.indexOf(C), 1), t.schema.declaration.vocabularies?.some((j) => j.code === C.code) && n("remove", "vocabularies", C.code);
    }
    function O(C) {
      return !!t.schema.vocabularies[C];
    }
    const L = Y({}), Z = Y({}), z = Y({}), g = Y({}), x = Y({}), r = Y({}), S = Y({}), B = Y({});
    function F(C) {
      return !!(x.value[C] || r.value[C]);
    }
    async function M(C, j) {
      x.value[C] = !0, delete S.value[C];
      try {
        const c = await ye.termsPage(t.catalogId, C, j);
        Z.value[C] = c.terms, g.value[C] = j, z.value[C] = c.next;
        const h = P(C);
        c.terms.some((E) => E.retired && E.code === h.parent) && (h.parent = "");
      } catch (c) {
        S.value[C] = { errors: [Ke(c, "Could not load terms.")], read: { after: j } };
      } finally {
        x.value[C] = !1;
      }
    }
    function ee(C) {
      L.value[C] = !L.value[C], L.value[C] && !F(C) && !Z.value[C] && !S.value[C] && M(C);
    }
    function P(C) {
      return B.value[C] ?? (B.value[C] = { code: "", label: "", parent: "" });
    }
    function ne(C, j) {
      const c = Z.value[C]?.find((h) => h.code === j);
      return c ? We(c) : J(j);
    }
    function Q(C) {
      return [{ value: "", label: "No parent" }, ...(Z.value[C] ?? []).filter((j) => !j.retired).map((j) => ({ value: j.code, label: We(j) }))];
    }
    function q(C, j, c) {
      S.value[C] = { errors: j?.findings?.length ? j.findings.map((h) => ({ message: h.message ?? c, code: h.code })) : [{ message: c }] };
    }
    async function X(C) {
      const j = P(C.code);
      if (!(!$.value || !o.test(j.code))) {
        r.value[C.code] = !0, delete S.value[C.code];
        try {
          const c = { term: { vocabulary: C.code, code: j.code }, labels: { en: j.label || J(j.code) } };
          C.hierarchical && j.parent && (c.parent = j.parent);
          const E = (await ye.apply(t.catalogId, [c])).outcomes[0];
          if (E?.outcome !== "created" && E?.outcome !== "updated") {
            q(C.code, E, "The term was not accepted.");
            return;
          }
          B.value[C.code] = { code: "", label: "", parent: "" }, ye.invalidateTerms(t.catalogId), await M(C.code, g.value[C.code]);
        } catch (c) {
          S.value[C.code] = { errors: [Ke(c, "Could not add the term.")] };
        } finally {
          r.value[C.code] = !1;
        }
      }
    }
    async function A(C, j, c) {
      if ($.value && !(c && !await ll.confirm({ header: "Retire term?", message: `Retire ${We(j)}? Term changes save immediately. You can restore this term later.`, acceptLabel: "Retire", rejectLabel: "Cancel" }))) {
        r.value[C.code] = !0, delete S.value[C.code];
        try {
          const E = (await ye.apply(t.catalogId, [{ term: { vocabulary: C.code, code: j.code }, retired: c }])).outcomes[0];
          if (!E || !["updated", "unchanged"].includes(E.outcome)) {
            q(C.code, E, "The term change was not accepted.");
            return;
          }
          c && P(C.code).parent === j.code && (P(C.code).parent = ""), ye.invalidateTerms(t.catalogId), await M(C.code, g.value[C.code]);
        } catch (h) {
          S.value[C.code] = { errors: [Ke(h, "Could not change the term.")] };
        } finally {
          r.value[C.code] = !1;
        }
      }
    }
    return (C, j) => (e(), R(Le, {
      count: v.value.length,
      columns: ["details"]
    }, _e({
      default: _(() => [
        (e(!0), i(H, null, se(v.value, (c) => (e(), R(Me, {
          "route-section": "vocabularies",
          "route-id": c.code,
          title: s(J)(c.code),
          key: c.code
        }, {
          details: _(() => [
            l("span", Ei, y(c.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: _(() => [
            d.value ? (e(), R(s(G), {
              key: 0,
              type: "button",
              "aria-label": "Remove " + s(J)(c.code),
              onClick: (h) => T(c),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: _(() => [
                f(s(oe), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])) : u("", !0)
          ]),
          default: _(() => [
            l("div", Wi, [
              l("label", Hi, [
                f(s(ol), {
                  disabled: !d.value,
                  "aria-label": "Hierarchical " + s(J)(c.code),
                  "model-value": c.hierarchical === !0,
                  "onUpdate:modelValue": (h) => h ? c.hierarchical = !0 : delete c.hierarchical
                }, null, 8, ["disabled", "aria-label", "model-value", "onUpdate:modelValue"]),
                j[0] || (j[0] = l("span", null, "Hierarchical", -1))
              ]),
              O(c.code) ? (e(), R(s(G), {
                key: 0,
                type: "button",
                onClick: (h) => ee(c.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: _(() => [
                  f(s(oe), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  K(" " + y(L.value[c.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : d.value ? (e(), i("span", Ji, "Apply the schema before adding terms.")) : u("", !0),
              L.value[c.code] ? (e(), i("div", Ki, [
                $.value ? (e(), i("p", Gi, "Term changes save immediately.")) : u("", !0),
                x.value[c.code] ? (e(), i("div", Yi, "Loading terms…")) : S.value[c.code] ? (e(!0), i(H, { key: 2 }, se(S.value[c.code].errors, (h, E) => (e(), R(bl, {
                  key: E,
                  error: h
                }, {
                  default: _(() => [
                    S.value[c.code].read ? (e(), R(s(G), {
                      key: 0,
                      type: "button",
                      onClick: (de) => M(c.code, S.value[c.code].read?.after),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: _(() => [...j[1] || (j[1] = [
                        K("Retry", -1)
                      ])]),
                      _: 1
                    }, 8, ["onClick"])) : u("", !0)
                  ]),
                  _: 2
                }, 1032, ["error"]))), 128)) : u("", !0),
                (Z.value[c.code] ?? []).length ? (e(), i("div", Zi, [
                  l("table", Qi, [
                    l("thead", null, [
                      l("tr", null, [
                        j[2] || (j[2] = l("th", null, "Term", -1)),
                        c.hierarchical ? (e(), i("th", Xi, "Parent")) : u("", !0),
                        d.value ? (e(), i("th", en)) : u("", !0)
                      ])
                    ]),
                    l("tbody", null, [
                      (e(!0), i(H, null, se(Z.value[c.code], (h) => (e(), i("tr", {
                        key: h.code,
                        class: Ae({ muted: h.retired })
                      }, [
                        l("td", null, [
                          K(y(s(We)(h)) + " ", 1),
                          h.retired ? (e(), R(s(he), {
                            key: 0,
                            severity: "secondary",
                            value: "Retired"
                          })) : u("", !0)
                        ]),
                        c.hierarchical ? (e(), i("td", ln, y(h.parent ? ne(c.code, h.parent) : "—"), 1)) : u("", !0),
                        d.value ? (e(), i("td", an, [
                          f(s(G), {
                            type: "button",
                            disabled: !$.value || F(c.code),
                            onClick: (E) => A(c, h, !h.retired),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: _(() => [
                              K(y(h.retired ? "Restore" : "Retire"), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled", "onClick"])
                        ])) : u("", !0)
                      ], 2))), 128))
                    ])
                  ]),
                  l("ul", tn, [
                    (e(!0), i(H, null, se(Z.value[c.code], (h) => (e(), i("li", {
                      key: h.code,
                      class: Ae(["pim-stacked-row", { muted: h.retired }])
                    }, [
                      l("div", null, [
                        K(y(s(We)(h)) + " ", 1),
                        h.retired ? (e(), R(s(he), {
                          key: 0,
                          severity: "secondary",
                          value: "Retired"
                        })) : u("", !0)
                      ]),
                      c.hierarchical && h.parent ? (e(), i("div", sn, "Parent: " + y(ne(c.code, h.parent)), 1)) : u("", !0),
                      d.value ? (e(), R(s(G), {
                        key: 1,
                        type: "button",
                        disabled: !$.value || F(c.code),
                        onClick: (E) => A(c, h, !h.retired),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: _(() => [
                          K(y(h.retired ? "Restore" : "Retire"), 1)
                        ]),
                        _: 2
                      }, 1032, ["disabled", "onClick"])) : u("", !0)
                    ], 2))), 128))
                  ])
                ])) : Z.value[c.code] && !F(c.code) && !S.value[c.code] ? (e(), i("p", nn, "No terms yet.")) : u("", !0),
                l("div", on, [
                  f(s(G), {
                    type: "button",
                    disabled: F(c.code) || !g.value[c.code],
                    onClick: (h) => M(c.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: _(() => [
                      f(s(oe), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      j[3] || (j[3] = K(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  f(s(G), {
                    type: "button",
                    disabled: F(c.code) || !z.value[c.code],
                    onClick: (h) => M(c.code, z.value[c.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: _(() => [
                      f(s(oe), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      j[4] || (j[4] = K(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                d.value ? (e(), i("div", dn, [
                  f(s(al), {
                    modelValue: P(c.code).label,
                    "onUpdate:modelValue": (h) => P(c.code).label = h,
                    disabled: !$.value || F(c.code),
                    "aria-label": "Term name in English",
                    type: "text",
                    placeholder: "Term name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  f(s(al), {
                    modelValue: P(c.code).code,
                    "onUpdate:modelValue": (h) => P(c.code).code = h,
                    disabled: !$.value || F(c.code),
                    type: "text",
                    "aria-label": "Short term name",
                    placeholder: "Short name for imports",
                    class: "narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  c.hierarchical ? (e(), R(s($e), {
                    key: 0,
                    modelValue: P(c.code).parent,
                    "onUpdate:modelValue": (h) => P(c.code).parent = h,
                    disabled: !$.value || F(c.code),
                    class: "narrow",
                    "aria-label": "Parent term",
                    placeholder: "No parent",
                    options: Q(c.code),
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "options"])) : u("", !0),
                  f(s(G), {
                    type: "button",
                    disabled: !$.value || F(c.code) || !o.test(P(c.code).code),
                    onClick: (h) => X(c),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: _(() => [
                      f(s(oe), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      j[5] || (j[5] = K(" Add term", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])) : u("", !0),
                f(we, {
                  class: "pim-ia-disclosure",
                  label: "Integration keys"
                }, {
                  default: _(() => [
                    (Z.value[c.code] ?? []).length ? (e(), i("dl", rn, [
                      (e(!0), i(H, null, se(Z.value[c.code], (h) => (e(), i(H, {
                        key: h.code
                      }, [
                        l("dt", null, y(s(We)(h)), 1),
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
      d.value ? {
        name: "add",
        fn: _(() => [
          f(Be, {
            label: "Vocabulary name",
            "from-name": "",
            action: "Add vocabulary",
            existing: v.value.map((c) => c.code),
            onAdd: b
          }, {
            default: _(() => [...j[6] || (j[6] = [
              l("span", { class: "muted small" }, "Select fields pick their values from a vocabulary's terms.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), cn = { class: "pim-stack" }, mn = { class: "muted small" }, pn = { class: "muted small" }, vn = { class: "pim-aspect" }, fn = { class: "pim-ia-action pim-family-fields" }, bn = { class: "pim-f" }, yn = { class: "pim-f-label" }, gn = ["id"], hn = ["id"], kn = { class: "pim-aspect" }, _n = { class: "pim-stack tight" }, wn = { class: "pim-level-head" }, $n = { class: "pim-fields" }, Cn = { class: "pim-f pim-w-half" }, xn = { class: "pim-f-label" }, Vn = ["id"], Un = { class: "pim-f pim-w-half" }, jn = { class: "pim-f-label" }, Sn = ["id"], An = { class: "pim-aspect" }, On = { class: "pim-stack tight" }, Rn = { class: "pim-level-head" }, Pn = { class: "muted small" }, Tn = { class: "pim-fields" }, qn = { class: "pim-f-label" }, In = ["id"], Fn = { class: "pim-f pim-w-half" }, Dn = { class: "pim-f-label" }, Nn = ["id"], zn = { class: "pim-f pim-w-half" }, Bn = { class: "pim-f-label" }, Ln = ["id"], Mn = {
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
    const t = a, n = m, o = Te();
    function d(j, c) {
      return o + "-" + j.code + "-" + c;
    }
    const $ = D(() => t.schema.access.admin), v = D(() => (t.draft.families ?? []).filter((j) => j.code !== "generic")), b = D(() => {
      const j = new Set(t.draft.plugins?.map((c) => c.use));
      return Object.entries(t.schema.attributes).filter(([, c]) => c.plugin && j.has(c.plugin));
    }), T = D(() => {
      const j = (t.draft.aspects ?? []).map((h) => h.namespace), c = [...new Set(b.value.map(([h]) => h.split(".")[0]))];
      return [...j, ...c.filter((h) => !j.includes(h))].map((h) => ({ value: h, label: J(h) }));
    });
    function O(j) {
      const c = T.value, h = (j.aspects ?? []).filter((E) => !c.some((de) => de.value === E));
      return [...c, ...h.map((E) => ({ value: E, label: J(E) }))];
    }
    const L = D(() => new Map(t.options.types.map((j) => [j.id, j.form])));
    function Z(j, c = []) {
      const h = /* @__PURE__ */ new Map();
      return [.../* @__PURE__ */ new Set([...j, ...c])].map((de) => {
        const [W, ie] = de.split(".", 2), te = J(ie ?? W);
        return h.set(te, (h.get(te) ?? 0) + 1), { value: de, label: te, group: ie ? J(W) : void 0 };
      }).map(({ value: de, label: W, group: ie }) => ({
        value: de,
        label: W,
        detail: h.get(W) > 1 ? ie : void 0
      }));
    }
    const z = D(() => {
      const j = /* @__PURE__ */ new Map();
      function c(h, E, de = [], W = "one") {
        const ie = !!E && E !== "text" && E !== "record" && de.length === 0 && W === "one";
        j.set(h, ie);
      }
      for (const h of t.draft.aspects ?? [])
        for (const E of h.attributes ?? []) {
          const de = h.namespace + "." + E.code;
          c(de, L.value.get(E.type), E.scope, E.cardinality);
        }
      for (const [h, E] of b.value) c(h, E.form, E.scope, E.cardinality);
      return j;
    });
    function g(j) {
      return [...z.value.keys()].filter((c) => j.aspects?.includes(c.split(".")[0]));
    }
    function x(j, c, h) {
      const E = c[h] ?? [], de = new Set(P(j).flatMap((ie) => [...ie.axes ?? [], ...ie.own ?? []])), W = g(j).filter((ie) => E.includes(ie) || !de.has(ie) && (h === "own" || z.value.get(ie)));
      return Z(W, E);
    }
    const r = D(() => t.draft.channels ?? []);
    function S(j, c) {
      return r.value.filter((h) => (!h.families?.length || h.families.includes(j.code)) && (!c || h.requirements?.includes(c))).map((h) => J(h.id));
    }
    const B = D(() => t.draft.dimensions ?? []), F = Y({});
    function M(j) {
      (t.draft.families ??= []).push({ code: j, aspects: [] }), F.value[j] = !0;
    }
    function ee(j) {
      t.draft.families.splice(t.draft.families.indexOf(j), 1), t.schema.declaration.families?.some((c) => c.code === j.code) && n("remove", "families", j.code);
    }
    function P(j) {
      return j.variation ?? [];
    }
    function ne(j) {
      return P(j).map((c) => ({
        level: c,
        axes: x(j, c, "axes"),
        own: x(j, c, "own")
      }));
    }
    function Q(j) {
      (j.variation ??= []).push({ axes: [] });
    }
    function q(j) {
      return j.requirements ?? [];
    }
    function X(j, c) {
      (j.requirements ??= []).push({ id: c, require: [] });
    }
    function A(j, c) {
      return j.context?.[c] ?? "";
    }
    function C(j, c, h) {
      const E = { ...j.context ?? {} };
      h ? E[c] = h : delete E[c], Object.keys(E).length ? j.context = E : delete j.context;
    }
    return (j, c) => (e(), i("div", cn, [
      f(Le, {
        count: v.value.length,
        columns: ["details"]
      }, _e({
        default: _(() => [
          (e(!0), i(H, null, se(v.value, (h) => (e(), R(Me, {
            "route-section": "families",
            "route-id": h.code,
            key: h.code,
            open: F.value[h.code],
            "onUpdate:open": (E) => F.value[h.code] = E,
            title: s(J)(h.code)
          }, {
            details: _(() => [
              l("span", mn, y(g(h).length) + " fields", 1),
              P(h).length ? (e(), R(s(he), {
                key: 0,
                severity: "secondary",
                value: P(h).length + (P(h).length === 1 ? " variant level" : " variant levels")
              }, null, 8, ["value"])) : u("", !0),
              l("span", pn, y(S(h).join(", ") || "No release channels"), 1)
            ]),
            default: _(() => [
              l("div", vn, [
                l("div", fn, [
                  l("div", bn, [
                    l("div", yn, [
                      l("label", {
                        id: d(h, "groups")
                      }, "Field groups", 8, gn)
                    ]),
                    l("p", {
                      id: d(h, "groups-help"),
                      class: "muted small pim-axis-help"
                    }, "Choose the groups that appear on this family’s product forms.", 8, hn),
                    f(s(ea), {
                      disabled: !$.value,
                      "aria-labelledby": d(h, "groups"),
                      "aria-describedby": d(h, "groups-help"),
                      "model-value": h.aspects ?? [],
                      options: O(h),
                      "option-label": "label",
                      "option-value": "value",
                      placeholder: "Choose field groups",
                      display: "chip",
                      "append-to": "self",
                      "onUpdate:modelValue": (E) => s(Je)(h, "aspects", E)
                    }, null, 8, ["disabled", "aria-labelledby", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])
                  ]),
                  h.aspects?.length ? (e(), R(s(G), {
                    key: 0,
                    type: "button",
                    label: "View family fields",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (E) => n("fields", h.code)
                  }, null, 8, ["onClick"])) : u("", !0)
                ])
              ]),
              l("div", kn, [
                c[4] || (c[4] = l("header", { class: "pim-aspect-head" }, [
                  l("h3", null, "Variants")
                ], -1)),
                c[5] || (c[5] = l("p", { class: "muted small pim-axis-help" }, "Choose what makes one variant different from another. Each field can be used once.", -1)),
                l("div", _n, [
                  (e(!0), i(H, null, se(ne(h), ({ level: E, axes: de, own: W }, ie) => (e(), i("div", {
                    key: ie,
                    class: "pim-level"
                  }, [
                    l("div", wn, [
                      l("strong", null, "Level " + y(ie + 1), 1),
                      $.value ? (e(), R(s(G), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove level",
                        onClick: (te) => P(h).splice(ie, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: _(() => [
                          f(s(oe), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : u("", !0)
                    ]),
                    l("div", $n, [
                      l("div", Cn, [
                        l("div", xn, [
                          l("label", {
                            id: d(h, ie + "-axes")
                          }, "Distinguish variants by", 8, Vn)
                        ]),
                        c[1] || (c[1] = l("p", { class: "muted small pim-axis-help" }, "Use a field with a single value and no dimensions, such as Integer. Text and record fields are excluded.", -1)),
                        $.value && !de.length ? (e(), i(H, { key: 0 }, [
                          c[0] || (c[0] = l("p", { class: "muted small pim-axis-help" }, "No eligible field is available in this family. Choose its field group above, or create the field first and choose its group when you return.", -1)),
                          f(s(G), {
                            type: "button",
                            label: "Create a field in Fields",
                            severity: "secondary",
                            outlined: "",
                            size: "small",
                            class: "pim-form-action",
                            onClick: (te) => n("variant-field", h.code)
                          }, null, 8, ["onClick"])
                        ], 64)) : (e(), R(Pe, {
                          key: 1,
                          disabled: !$.value,
                          dropdown: "",
                          labelledby: d(h, ie + "-axes"),
                          "model-value": E.axes ?? [],
                          options: de,
                          placeholder: "Choose a field",
                          "onUpdate:modelValue": (te) => E.axes = te
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"]))
                      ]),
                      l("div", Un, [
                        l("div", jn, [
                          l("label", {
                            id: d(h, ie + "-owned")
                          }, "Other fields edited here", 8, Sn)
                        ]),
                        c[2] || (c[2] = l("p", { class: "muted small pim-axis-help" }, "Other fields you edit at this level.", -1)),
                        f(Pe, {
                          disabled: !$.value,
                          dropdown: "",
                          labelledby: d(h, ie + "-owned"),
                          "model-value": E.own ?? [],
                          options: W,
                          placeholder: "Add a field",
                          "onUpdate:modelValue": (te) => te.length ? E.own = te : delete E.own
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  $.value ? (e(), R(s(G), {
                    key: 0,
                    type: "button",
                    class: "pim-add-level",
                    onClick: (E) => Q(h),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: _(() => [
                      f(s(oe), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      c[3] || (c[3] = K(" Add level", -1))
                    ]),
                    _: 1
                  }, 8, ["onClick"])) : u("", !0)
                ])
              ]),
              l("div", An, [
                c[8] || (c[8] = l("header", { class: "pim-family-requirements-head" }, [
                  l("h3", null, "Release requirements"),
                  l("p", { class: "muted small" }, "Choose what products need before they can be released to a channel.")
                ], -1)),
                l("div", On, [
                  (e(!0), i(H, null, se(q(h), (E, de) => (e(), i("div", {
                    key: E.id,
                    class: "pim-level"
                  }, [
                    l("div", Rn, [
                      l("div", null, [
                        l("strong", null, y(s(J)(E.id)), 1),
                        l("p", Pn, y(S(h, E.id).join(", ") || "Unused by channels"), 1)
                      ]),
                      $.value ? (e(), R(s(G), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove requirement",
                        onClick: (W) => q(h).splice(de, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: _(() => [
                          f(s(oe), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : u("", !0)
                    ]),
                    l("div", Tn, [
                      (e(!0), i(H, null, se(B.value, (W) => (e(), i("div", {
                        key: W.name,
                        class: "pim-f pim-w-third"
                      }, [
                        l("div", qn, [
                          l("label", {
                            id: d(h, E.id + "-context-" + W.name)
                          }, y(s(J)(W.name)), 9, In)
                        ]),
                        f(s($e), {
                          disabled: !$.value,
                          "aria-labelledby": d(h, E.id + "-context-" + W.name),
                          "model-value": A(E, W.name),
                          "onUpdate:modelValue": (ie) => C(E, W.name, ie),
                          options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ...W.members.map((ie) => ({ value: ie, label: String(ie) }))],
                          "option-label": "label",
                          "option-value": "value",
                          appendTo: "self"
                        }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                      ]))), 128)),
                      l("div", Fn, [
                        l("div", Dn, [
                          l("label", {
                            id: d(h, E.id + "-required")
                          }, "Required", 8, Nn)
                        ]),
                        c[6] || (c[6] = l("p", { class: "muted small pim-axis-help" }, "These fields must have a value.", -1)),
                        f(Pe, {
                          disabled: !$.value,
                          dropdown: "",
                          labelledby: d(h, E.id + "-required"),
                          "model-value": E.require ?? [],
                          placeholder: "Add a required field",
                          options: Z(g(h), E.require),
                          "onUpdate:modelValue": (W) => s(Je)(E, "require", W)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]),
                      l("div", zn, [
                        l("div", Bn, [
                          l("label", {
                            id: d(h, E.id + "-authored")
                          }, "Entered for this context", 8, Ln)
                        ]),
                        c[7] || (c[7] = l("p", { class: "muted small pim-axis-help" }, "These fields need a value set directly for the selected context.", -1)),
                        f(Pe, {
                          disabled: !$.value,
                          dropdown: "",
                          labelledby: d(h, E.id + "-authored"),
                          "model-value": E.authored ?? [],
                          placeholder: "Add a field to author",
                          options: Z(g(h), E.authored),
                          "onUpdate:modelValue": (W) => s(Je)(E, "authored", W)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  $.value ? (e(), R(Be, {
                    key: 0,
                    label: "Requirement name",
                    action: "Add requirement",
                    "from-name": "",
                    existing: q(h).map((E) => E.id),
                    onAdd: (E) => X(h, E)
                  }, null, 8, ["existing", "onAdd"])) : u("", !0)
                ])
              ]),
              $.value ? (e(), i("div", Mn, [
                f(s(G), {
                  type: "button",
                  label: "Remove family",
                  severity: "danger",
                  text: "",
                  size: "small",
                  onClick: (E) => ee(h)
                }, null, 8, ["onClick"])
              ])) : u("", !0)
            ]),
            _: 2
          }, 1032, ["route-id", "open", "onUpdate:open", "title"]))), 128))
        ]),
        _: 2
      }, [
        $.value ? {
          name: "head",
          fn: _(() => [
            f(Be, {
              label: "Family name",
              action: "Add family",
              "from-name": "",
              existing: v.value.map((h) => h.code),
              onAdd: M
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])
    ]));
  }
}), Wn = ["inert"], Hn = {
  key: 0,
  class: "row wrap"
}, Jn = {
  key: 2,
  class: "small muted"
}, Kn = { class: "pim-f" }, Gn = ["for"], Yn = ["id"], Zn = /* @__PURE__ */ pe({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(a, { emit: m }) {
    const t = a, n = m, o = Y(!1), d = Y(""), $ = Te(), v = Te(), b = Y({});
    let T = 0;
    be(() => t.modelValue, async (g) => {
      const x = ++T;
      try {
        const r = await aa(t.catalogId ?? "", g);
        x === T && (b.value = r);
      } catch {
        x === T && (b.value = {});
      }
    }, { immediate: !0, deep: !0 }), Ye(() => {
      T++;
    });
    function O(g) {
      return b.value[g] ?? ce(g, "Person");
    }
    Ql(async () => {
      try {
        await La("wc-principal-picker"), o.value = !0;
      } catch {
        o.value = !1;
      }
    });
    function L(g) {
      t.disabled || !g.trim() || t.modelValue.includes(g.trim()) || (n("update:modelValue", [...t.modelValue, g.trim()]), d.value = "");
    }
    function Z(g) {
      const x = g.detail;
      if (!x || typeof x != "object") return;
      const r = x, S = r.principal_id ?? r.id;
      typeof S == "string" && L(S);
    }
    function z(g) {
      t.disabled || n("update:modelValue", t.modelValue.filter((x) => x !== g));
    }
    return (g, x) => (e(), i("div", {
      class: "pim-principal-list",
      inert: a.disabled || void 0
    }, [
      a.modelValue.length ? (e(), i("div", Hn, [
        (e(!0), i(H, null, se(a.modelValue, (r) => (e(), R(s(he), {
          key: r,
          severity: "secondary"
        }, {
          default: _(() => [
            l("span", null, y(O(r)), 1),
            f(s(G), {
              text: "",
              size: "small",
              disabled: a.disabled,
              "aria-label": "Remove " + O(r),
              onClick: (S) => z(r)
            }, {
              default: _(() => [
                f(s(oe), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : u("", !0),
      o.value ? (e(), i("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: ze(Z, ["stop"])
      }, null, 32)) : (e(), i("span", Jn, "The person picker is unavailable.")),
      l("div", Kn, [
        l("label", {
          for: s($),
          class: "small muted"
        }, "Service account ID", 8, Gn),
        f(s(al), {
          modelValue: d.value,
          "onUpdate:modelValue": x[0] || (x[0] = (r) => d.value = r),
          id: s($),
          "aria-describedby": s(v),
          disabled: a.disabled,
          onKeydown: x[1] || (x[1] = nl(ze((r) => L(d.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "id", "aria-describedby", "disabled"]),
        l("p", {
          id: s(v),
          class: "small muted pim-axis-help"
        }, "Ask whoever manages the service account for its principal ID.", 8, Yn)
      ]),
      f(s(G), {
        type: "button",
        severity: "secondary",
        outlined: "",
        size: "small",
        class: "pim-form-action",
        disabled: a.disabled || !d.value.trim(),
        onClick: x[2] || (x[2] = (r) => L(d.value))
      }, {
        default: _(() => [
          f(s(oe), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          x[3] || (x[3] = K(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, Wn));
  }
}), Qn = { class: "pim-stack" }, Xn = { class: "muted small" }, eo = { class: "muted small" }, lo = { class: "pim-fields" }, ao = { class: "pim-f pim-w-half" }, to = { class: "pim-f-label" }, so = ["id"], io = { class: "muted small pim-axis-help" }, no = { class: "pim-f pim-w-half" }, oo = { class: "pim-f-label" }, ro = ["id"], uo = { class: "muted small" }, co = { class: "muted small" }, mo = { class: "pim-fields" }, po = ["aria-labelledby", "aria-describedby"], vo = { class: "pim-f-label" }, fo = ["id"], bo = ["id"], yo = { key: 1 }, go = { class: "pim-f pim-w-half" }, ho = { class: "pim-f-label" }, ko = ["id"], _o = { class: "pim-f pim-w-full" }, wo = { class: "mono" }, $o = { class: "pim-f pim-w-half" }, Co = { class: "pim-f-label" }, xo = ["id"], Vo = { class: "pim-f pim-w-half" }, Uo = { class: "pim-f-label" }, jo = ["for"], So = { class: "row" }, Ao = /* @__PURE__ */ pe({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {},
    view: {}
  },
  emits: ["remove", "requirements"],
  setup(a, { emit: m }) {
    const t = a, n = m, o = Te();
    function d(M, ee) {
      return o + "-" + M + "-" + ee;
    }
    const $ = D(() => t.schema.access.admin), v = D(() => t.draft.channels ?? []), b = D(() => t.draft.sources ?? []), T = D(() => {
      const M = /* @__PURE__ */ new Map();
      for (const ee of t.draft.families ?? [])
        for (const { id: P } of ee.requirements ?? []) {
          const ne = M.get(P) ?? [];
          ne.push(J(ee.code)), M.set(P, ne);
        }
      return new Map([...M].map(([ee, P]) => [ee, J(ee) + " · " + P.join(", ")]));
    }), O = D(() => [...T.value].map(([M, ee]) => ({ value: M, label: ee }))), L = D(() => (t.draft.families ?? []).filter((M) => M.code !== "generic").map((M) => ({ value: M.code, label: J(M.code) }))), Z = D(() => (t.draft.aspects ?? []).map((M) => ({ value: M.namespace, label: J(M.namespace) }))), z = Y({}), g = Y({});
    function x(M) {
      const ee = M.principals?.length ?? 0;
      return ee ? ee + (ee === 1 ? " allowed account" : " allowed accounts") : "Any catalog writer";
    }
    function r(M) {
      (t.draft.channels ??= []).push({ id: M, requirements: [] }), z.value[M] = !0;
    }
    function S(M) {
      v.value.splice(v.value.indexOf(M), 1), t.schema.declaration.channels?.some((ee) => ee.id === M.id) && n("remove", "channels", M.id);
    }
    function B(M) {
      (t.draft.sources ??= []).push({ id: M, ordering: "none", writes: [] }), g.value[M] = !0;
    }
    function F(M) {
      b.value.splice(b.value.indexOf(M), 1), t.schema.declaration.sources?.some((ee) => ee.id === M.id) && n("remove", "sources", M.id);
    }
    return (M, ee) => (e(), i("div", Qn, [
      a.view !== "sources" ? (e(), R(Le, {
        key: 0,
        count: v.value.length,
        columns: ["details"]
      }, _e({
        default: _(() => [
          (e(!0), i(H, null, se(v.value, (P) => (e(), R(Me, {
            key: P.id,
            open: z.value[P.id],
            "onUpdate:open": (ne) => z.value[P.id] = ne,
            "route-section": "channels",
            "route-id": P.id,
            title: s(J)(P.id)
          }, _e({
            details: _(() => [
              l("span", Xn, y(P.families?.length ? P.families.map(s(J)).join(", ") : "All families"), 1),
              l("span", eo, y(P.requirements?.length ? P.requirements.map((ne) => T.value.get(ne) ?? s(J)(ne)).join(", ") : "No release requirements"), 1)
            ]),
            default: _(() => [
              l("div", lo, [
                l("div", ao, [
                  l("div", to, [
                    l("label", {
                      id: d(P.id, "requirements")
                    }, "Release requirements", 8, so)
                  ]),
                  l("p", io, y(O.value.length ? "Choose what products must meet before release to this channel." : "No family has defined a release requirement yet."), 1),
                  O.value.length || P.requirements?.length ? (e(), R(Pe, {
                    key: 0,
                    disabled: !$.value,
                    labelledby: d(P.id, "requirements"),
                    "model-value": P.requirements ?? [],
                    options: O.value,
                    "onUpdate:modelValue": (ne) => s(Je)(P, "requirements", ne)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])) : u("", !0),
                  $.value ? (e(), R(s(G), {
                    key: 1,
                    type: "button",
                    label: "Create a requirement in Families",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    class: "pim-form-action",
                    onClick: (ne) => n("requirements", P.id)
                  }, null, 8, ["onClick"])) : u("", !0)
                ]),
                l("div", no, [
                  l("div", oo, [
                    l("label", {
                      id: d(P.id, "families")
                    }, "Families", 8, ro)
                  ]),
                  ee[0] || (ee[0] = l("p", { class: "muted small pim-axis-help" }, "Applies to every family unless you choose specific families.", -1)),
                  f(Pe, {
                    disabled: !$.value,
                    labelledby: d(P.id, "families"),
                    "model-value": P.families ?? [],
                    options: L.value,
                    "onUpdate:modelValue": (ne) => s(Je)(P, "families", ne)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            $.value ? {
              name: "actions",
              fn: _(() => [
                f(s(G), {
                  type: "button",
                  onClick: (ne) => S(P),
                  "aria-label": "Remove " + s(J)(P.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: _(() => [
                    f(s(oe), { icon: "tabler:trash" })
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
          fn: _(() => [
            f(Be, {
              label: "Channel name",
              action: "Add channel",
              "from-name": "",
              existing: v.value.map((P) => P.id),
              onAdd: r
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])) : u("", !0),
      a.view !== "channels" ? (e(), R(Le, {
        key: 1,
        count: b.value.length,
        columns: ["details"]
      }, _e({
        default: _(() => [
          (e(!0), i(H, null, se(b.value, (P) => (e(), R(Me, {
            key: P.id,
            open: g.value[P.id],
            "onUpdate:open": (ne) => g.value[P.id] = ne,
            "route-section": "sources",
            "route-id": P.id,
            title: s(J)(P.id)
          }, _e({
            details: _(() => [
              l("span", uo, y(x(P)), 1),
              l("span", co, y(P.writes?.length ? P.writes.map(s(J)).join(", ") : "No writable field groups"), 1)
            ]),
            default: _(() => [
              l("div", mo, [
                l("div", {
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": d(P.id, "people"),
                  "aria-describedby": d(P.id, "people-help")
                }, [
                  l("div", vo, [
                    l("label", {
                      id: d(P.id, "people")
                    }, "People and service accounts", 8, fo)
                  ]),
                  l("p", {
                    id: d(P.id, "people-help"),
                    class: "muted small pim-axis-help"
                  }, "If you leave this empty, anyone who can write to the catalog can use this source.", 8, bo),
                  $.value ? (e(), R(Zn, {
                    key: 0,
                    "catalog-id": a.catalogId,
                    "model-value": P.principals ?? [],
                    "onUpdate:modelValue": (ne) => s(Je)(P, "principals", ne)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])) : (e(), i("span", yo, y(x(P)), 1))
                ], 8, po),
                l("div", go, [
                  l("div", ho, [
                    l("label", {
                      id: d(P.id, "writes")
                    }, "Field groups it can update", 8, ko)
                  ]),
                  ee[1] || (ee[1] = l("p", { class: "muted small pim-axis-help" }, "If you leave this empty, this source cannot update any field values.", -1)),
                  f(Pe, {
                    disabled: !$.value,
                    labelledby: d(P.id, "writes"),
                    "model-value": P.writes ?? [],
                    options: Z.value,
                    "onUpdate:modelValue": (ne) => s(Je)(P, "writes", ne)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                l("div", _o, [
                  ee[2] || (ee[2] = l("div", { class: "pim-f-label" }, [
                    l("strong", null, "Source identifier")
                  ], -1)),
                  ee[3] || (ee[3] = l("p", { class: "muted small pim-axis-help" }, [
                    K("Send this exact identifier in the "),
                    l("code", null, "source"),
                    K(" field of the update request.")
                  ], -1)),
                  l("div", null, [
                    l("code", wo, y(P.id), 1)
                  ])
                ]),
                l("div", $o, [
                  l("div", Co, [
                    l("label", {
                      id: d(P.id, "ordering")
                    }, "Handle incoming updates", 8, xo)
                  ]),
                  ee[4] || (ee[4] = l("p", { class: "muted small pim-axis-help" }, "Use the sender’s sequence numbers to prevent late deliveries from overwriting newer values.", -1)),
                  f(s($e), {
                    disabled: !$.value,
                    "aria-labelledby": d(P.id, "ordering"),
                    "model-value": P.ordering ?? "none",
                    "onUpdate:modelValue": (ne) => P.ordering = ne,
                    options: [{ value: "none", label: "Use arrival order" }, { value: "sequence", label: "Use the source’s sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                l("div", Vo, [
                  l("div", Uo, [
                    l("label", {
                      for: d(P.id, "audit")
                    }, "Track value changes", 8, jo)
                  ]),
                  l("div", So, [
                    f(s(ol), {
                      disabled: !$.value,
                      "input-id": d(P.id, "audit"),
                      "model-value": P.audit !== !1,
                      "onUpdate:modelValue": (ne) => ne ? delete P.audit : P.audit = !1
                    }, null, 8, ["disabled", "input-id", "model-value", "onUpdate:modelValue"]),
                    l("span", null, y(P.audit === !1 ? "Off for this source" : "Follow catalog audit settings"), 1)
                  ])
                ])
              ])
            ]),
            _: 2
          }, [
            $.value ? {
              name: "actions",
              fn: _(() => [
                f(s(G), {
                  type: "button",
                  onClick: (ne) => F(P),
                  "aria-label": "Remove " + s(J)(P.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: _(() => [
                    f(s(oe), { icon: "tabler:trash" })
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
          fn: _(() => [
            f(Be, {
              label: "Source name",
              action: "Add source",
              "from-name": "",
              existing: b.value.map((P) => P.id),
              onAdd: B
            }, null, 8, ["existing"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["count"])) : u("", !0)
    ]));
  }
}), Oo = {
  failed: { label: "Setup failed", severity: "danger" },
  paused: { label: "Background update paused", severity: "warn" },
  degraded: { label: "Degraded", severity: "warn" },
  catchingUp: { label: "Catching up", severity: "info" },
  config: { label: "Configuration needed", severity: "warn" },
  reset: { label: "Reset required", severity: "warn" },
  uninstalled: { label: "Uninstalled · still referenced", severity: "warn" },
  pending: { label: "Setting up", severity: "info" }
};
function na(a, m) {
  return !a.parked && (a.bootstrapping || a.last_seq < m);
}
function Ro(a, m) {
  return !a.active || !a.installed || a.problem || a.lifecycle.state === "failed" ? !1 : a.lifecycle.state === "pending" || Object.values(a.projections).some((t) => na(t, m));
}
function Po(a, m) {
  const t = a.problem ?? a.lifecycle.error, n = Object.entries(a.projections), o = n.find(([, $]) => $.parked) ?? n.find(([, $]) => $.error) ?? n.find(([, $]) => na($, m));
  let d;
  return a.active && !a.installed ? d = "uninstalled" : t?.code === "plugin_config_invalid" ? d = "config" : t?.code === "plugin_projection_history_pruned" ? d = "reset" : t || a.lifecycle.state === "failed" ? d = "failed" : a.active && o?.[1].parked ? d = "paused" : a.active && o?.[1].error ? d = "degraded" : a.active && o ? d = "catchingUp" : a.active && a.lifecycle.state === "pending" && (d = "pending"), d ? { kind: d, ...Oo[d], error: t, projection: o } : void 0;
}
function To(a) {
  return (a.problem ?? a.lifecycle.error)?.code === "plugin_interface_version_unsupported";
}
function qo({
  catalogId: a,
  shouldPoll: m,
  schema: t,
  options: n,
  busy: o,
  stale: d,
  editable: $,
  saved: v,
  clearError: b,
  reportError: T
}) {
  const O = Ge(), L = Ge();
  be(a, L.begin), Ye(() => {
    O.begin(), L.begin();
  });
  async function Z(S = !1) {
    const B = a(), F = t.value, M = O.begin();
    try {
      const [ee, P] = await Promise.all([ye.schema(B), S ? ye.schemaOptions(B) : void 0]);
      return !F || !O.current(M) || B !== a() || t.value !== F ? !1 : (F.plugins = ee.plugins, F.as_of = ee.as_of, P && (n.value = P), !0);
    } catch (ee) {
      return S && O.current(M) && B === a() && T(ee, "Could not check plugin status."), !1;
    }
  }
  async function z(S) {
    const B = a(), F = t.value?.plugins.find((ee) => ee.plugin === S && ee.active && ee.installed);
    if (!F?.config || o.value || d.value || !$.value || !await ll.confirm({
      header: "Reset background updates?",
      message: "Background updates will start from a new catalog event. Current product data will be rebuilt into the plugin’s index. Earlier events will be skipped.",
      acceptLabel: "Reset background updates",
      rejectLabel: "Cancel"
    }) || a() !== B || o.value) return;
    const M = L.begin();
    O.begin(), o.value = !0, b(), v.value = "";
    try {
      await ye.configurePlugin(B, S, el(F.config), !0), L.current(M) && await Z(!0) && L.current(M) && (v.value = "Background update reset requested.");
    } catch (ee) {
      L.current(M) && T(ee, "Could not reset background updates.");
    } finally {
      L.current(M) && (o.value = !1);
    }
  }
  async function g(S) {
    const B = a();
    if (!(o.value || d.value || !$.value)) {
      o.value = !0, b(), v.value = "";
      try {
        await ye.resumePluginProjection(B, S), a() === B && await Z(!0) && (v.value = "Background update resumed.");
      } catch (F) {
        a() === B && T(F, "Could not resume the background update.");
      } finally {
        a() === B && (o.value = !1);
      }
    }
  }
  async function x(S) {
    const B = a();
    if (!(o.value || d.value || !$.value) && !(!await ll.confirm({
      header: "Clear catalog app binding?",
      message: "The catalog will use the default app after this setting is saved.",
      acceptLabel: "Clear binding",
      rejectLabel: "Cancel"
    }) || a() !== B || o.value || !$.value || !t.value?.plugins.some((F) => F.references?.shell_bindings.includes(S)))) {
      o.value = !0, b(), v.value = "";
      try {
        if (await ye.updateCatalogApp(B, ""), a() !== B) return;
        await Z(!0) && (v.value = "Catalog app binding cleared.");
      } catch (F) {
        a() === B && T(F, "Could not clear the catalog app binding.");
      } finally {
        a() === B && (o.value = !1);
      }
    }
  }
  const r = D(() => m() && !o.value && t.value?.plugins.some((S) => Ro(S, t.value.as_of)) === !0);
  return be(r, (S, B, F) => {
    if (!S) return;
    let M, ee = !0;
    const P = () => {
      M = setTimeout(async () => {
        await Z() && ee && r.value && P();
      }, 2e3);
    };
    P(), F(() => {
      ee = !1, clearTimeout(M);
    });
  }), { refreshPluginStatus: Z, resetPlugin: z, resumePluginProjection: g, clearShellBinding: x };
}
const Io = { class: "pim-stack" }, Fo = { class: "pim-bsection-head" }, Do = {
  key: 0,
  class: "pim-aspect muted"
}, No = {
  key: 0,
  class: "muted small"
}, zo = { class: "pim-stack pim-plugin-recovery" }, Bo = {
  key: 0,
  class: "muted small"
}, Lo = {
  key: 1,
  class: "muted small"
}, Mo = { key: 0 }, Eo = { key: 1 }, Wo = { key: 0 }, Ho = { key: 0 }, Jo = { key: 0 }, Ko = { key: 1 }, Go = { key: 2 }, Yo = { key: 3 }, Zo = { key: 0 }, Qo = { class: "pim-stack" }, Xo = { key: 0 }, ed = { key: 1 }, ld = {
  key: 0,
  class: "muted small"
}, ad = {
  key: 0,
  class: "pim-ia-dialog"
}, td = { class: "pim-ia-dialog-head" }, sd = { key: 1 }, id = { key: 2 }, nd = { class: "row pim-ia-dialog-actions" }, od = {
  key: 0,
  class: "pim-aspect muted"
}, dd = { class: "row wrap muted small" }, rd = /* @__PURE__ */ pe({
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
  setup(a, { emit: m }) {
    const t = a, n = m, o = /* @__PURE__ */ new Map([
      ["eq", "Equals"],
      ["in", "Is one of"],
      ["gt", "Greater than"],
      ["gte", "At least"],
      ["lt", "Less than"],
      ["lte", "At most"]
    ]), d = Y({});
    be(() => t.refusal, (Q) => {
      Q && (d.value[Q.plugin] = !0);
    }, { immediate: !0 });
    const $ = Y(), v = D(() => x.value.find((Q) => Q.plugin.plugin === $.value)), b = D(() => v.value?.plugin), T = D(() => t.options.plugins.filter((Q) => Q.installed).length), O = D(() => t.schema.plugins.filter((Q) => Q.active).length), L = D(() => t.schema.access.admin), Z = D(() => t.draft.plugins ?? []), z = D(() => new Map(t.schema.plugins.map((Q) => [Q.plugin, Q]))), g = D(() => {
      const Q = /* @__PURE__ */ new Map();
      for (const [q, X] of Object.entries(t.schema.attributes)) {
        if (!X.plugin) continue;
        const A = Q.get(X.plugin) ?? [];
        A.push(J(q)), Q.set(X.plugin, A);
      }
      return Q;
    }), x = D(() => t.options.plugins.map((Q) => {
      const q = z.value.get(Q.plugin) ?? Q, X = Po(q, t.schema.as_of), A = Z.value.some((j) => j.use === q.plugin), C = t.refusal?.plugin === q.plugin ? t.refusal : void 0;
      return {
        option: Q,
        plugin: q,
        status: X,
        chosen: A,
        refusal: C,
        title: ce(q.title ?? Q.title, q.installed ? "Plugin" : "Unavailable plugin"),
        label: C ? "Configuration needed" : !q.active && X?.kind === "failed" ? "Unavailable" : X?.label ?? (A ? q.active ? "Enabled" : "Will enable on apply" : q.active ? "Will disable on apply" : "Disabled"),
        severity: C ? "warn" : X?.severity ?? (A ? "success" : "secondary")
      };
    }));
    function r(Q, q) {
      const X = q.map((A) => o.get(A)).filter(Boolean);
      return [J(Q), X.join(", ")].filter(Boolean).join(" · ");
    }
    function S(Q, q) {
      q && !Z.value.some((X) => X.use === Q) && ((t.draft.plugins ??= []).push({ use: Q }), d.value[Q] = !0), q || (d.value[Q] = !1, t.draft.plugins = Z.value.filter((X) => X.use !== Q), delete t.pluginConfigs[Q], t.refusal?.plugin === Q && n("clearRefusal"), z.value.get(Q)?.active && n("remove", "plugins", Q));
    }
    function B(Q, q) {
      d.value[Q] = !0, t.pluginConfigs[Q] = q, t.refusal?.plugin === Q && n("clearRefusal");
    }
    const F = D(() => t.draft.scopes ?? []);
    function M(Q) {
      return F.value.includes(Q.id);
    }
    function ee(Q, q) {
      q && !M(Q) && (t.draft.scopes ??= []).push(Q.id), !q && M(Q) && (F.value.splice(F.value.indexOf(Q.id), 1), t.schema.declaration.scopes?.includes(Q.id) && n("remove", "scopes", Q.id));
    }
    const P = D(() => {
      const Q = b.value;
      if (!Q) return [];
      const q = Q.references;
      return [
        { label: "Fields", items: (q?.fields ?? Object.entries(t.schema.attributes).filter(([, A]) => A.plugin === Q.plugin).map(([A]) => A)).map((A) => ({ id: A, title: ce(J(A), "Field") })) },
        { label: "Product filter sets", items: (q?.scopes ?? []).map((A) => ({
          id: A,
          title: ce(t.options.scopes.find((C) => C.id === A)?.title, "Unavailable filter set")
        })) },
        { label: "Catalog app binding", items: (q?.shell_bindings ?? []).map((A) => ({ id: A, title: "Catalog app" })) },
        { label: "Readiness checks", items: (q?.checks ?? []).map((A) => ({ id: A, title: "Readiness check" })) },
        { label: "Dependent plugins", items: (q?.plugins ?? []).map((A) => ({
          id: A,
          title: ce(z.value.get(A)?.title, "Dependent plugin")
        })) }
      ].filter((A) => A.items.length);
    });
    function ne(Q) {
      for (const q of Q.references?.scopes ?? [])
        F.value.includes(q) && (t.draft.scopes = F.value.filter((X) => X !== q), n("remove", "scopes", q));
      $.value = void 0, S(Q.plugin, !1), n("review");
    }
    return (Q, q) => (e(), i("div", Io, [
      f(Le, {
        count: x.value.length,
        columns: ["details"]
      }, {
        head: _(() => [
          l("header", Fo, [
            l("h3", null, y(T.value) + " installed · " + y(O.value) + " enabled here", 1)
          ])
        ]),
        default: _(() => [
          x.value.length === 0 ? (e(), i("div", Do, "No plugin is installed.")) : u("", !0),
          (e(!0), i(H, null, se(x.value, ({ option: X, plugin: A, status: C, chosen: j, title: c, label: h, severity: E, refusal: de }) => (e(), R(Me, {
            "route-section": "plugins",
            "route-id": A.plugin,
            key: A.plugin,
            title: c,
            open: d.value[A.plugin] ?? (j && (!A.active || !!a.pluginConfigs[A.plugin]) || !!(A.active && C && C.kind !== "pending")),
            "onUpdate:open": (W) => d.value[A.plugin] = W
          }, _e({
            details: _(() => [
              f(s(he), {
                severity: E,
                value: h
              }, null, 8, ["severity", "value"]),
              !C && X.description ? (e(), i("span", No, y(s(ce)(X.description, "Adds capabilities to this catalog.")), 1)) : u("", !0)
            ]),
            default: _(() => [
              l("div", zo, [
                g.value.get(A.plugin)?.length ? (e(), i("p", Bo, " Adds fields for " + y(g.value.get(A.plugin)?.join(", ")) + ". ", 1)) : u("", !0),
                A.active && C?.kind === "failed" && C.projection?.[1].parked ? (e(), i("p", Lo, " Background update: Paused ")) : u("", !0),
                C?.kind === "failed" ? (e(), i(H, { key: 2 }, [
                  f(s(Ce), {
                    severity: "warn",
                    role: "alert"
                  }, {
                    default: _(() => [
                      s(To)(A) ? (e(), i(H, { key: 0 }, [
                        K("This package uses a plugin interface this deployment cannot run. Restore a compatible package to use this plugin.")
                      ], 64)) : (e(), i(H, { key: 1 }, [
                        K("The catalog could not set up this plugin. Check the status after resolving the setup problem.")
                      ], 64))
                    ]),
                    _: 2
                  }, 1024),
                  f(we, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: _(() => [
                      l("p", null, [
                        q[6] || (q[6] = K("Plugin ", -1)),
                        l("code", null, y(A.plugin), 1)
                      ]),
                      C.error?.message ? (e(), i("p", Mo, y(C.error.message), 1)) : u("", !0),
                      C.error?.code ? (e(), i("p", Eo, [
                        l("code", null, y(C.error.code), 1)
                      ])) : u("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  L.value && A.references ? (e(), R(s(G), {
                    key: 0,
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (W) => $.value = A.plugin
                  }, null, 8, ["onClick"])) : (e(), R(s(G), {
                    key: 1,
                    label: "Check status",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: q[0] || (q[0] = (W) => n("refresh"))
                  }))
                ], 64)) : C?.kind === "reset" ? (e(), i(H, { key: 3 }, [
                  f(s(Ce), { severity: "warn" }, {
                    default: _(() => [
                      q[7] || (q[7] = K(" The event history this background update needs was removed. ", -1)),
                      C.error?.max_pruned_seq !== void 0 ? (e(), i("p", Wo, "Earliest retained position " + y(C.error.max_pruned_seq + 1) + ".", 1)) : u("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  f(we, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: _(() => [
                      l("p", null, [
                        q[8] || (q[8] = K("Plugin ", -1)),
                        l("code", null, y(A.plugin), 1)
                      ]),
                      C.error?.projection ? (e(), i("p", Ho, [
                        q[9] || (q[9] = K("Background update ", -1)),
                        l("code", null, y(C.error.projection), 1)
                      ])) : u("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  L.value ? (e(), R(s(G), {
                    key: 0,
                    label: "Reset background updates",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: a.stale,
                    onClick: (W) => n("reset", A.plugin)
                  }, null, 8, ["disabled", "onClick"])) : u("", !0)
                ], 64)) : C?.projection && (C.kind === "paused" || C.kind === "degraded" || C.kind === "catchingUp") ? (e(), i(H, { key: 4 }, [
                  f(s(Ce), {
                    severity: C.kind === "catchingUp" ? "info" : "warn"
                  }, {
                    default: _(() => [
                      C.projection[1].status === "paused" ? (e(), i("p", Jo, "This update was paused.")) : C.kind === "paused" ? (e(), i("p", Ko, "The background worker stopped.")) : C.kind === "degraded" ? (e(), i("p", Go, "The background worker reported an error.")) : (e(), i("p", Yo, "This update is processing catalog changes.")),
                      l("p", null, "Last applied position " + y(C.projection[1].last_seq) + ".", 1)
                    ]),
                    _: 2
                  }, 1032, ["severity"]),
                  f(we, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: _(() => [
                      l("p", null, [
                        q[10] || (q[10] = K("Background update ", -1)),
                        l("code", null, y(C.projection[0]), 1)
                      ]),
                      C.projection[1].error ? (e(), i("p", Zo, y(C.projection[1].error), 1)) : u("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  L.value && C.projection[1].status === "paused" && C.projection[1].cursor_id ? (e(), R(s(G), {
                    key: 0,
                    label: "Resume background update",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: a.stale,
                    onClick: (W) => n("resume", C.projection[1].cursor_id)
                  }, null, 8, ["disabled", "onClick"])) : C.kind === "paused" && L.value ? (e(), R(s(G), {
                    key: 1,
                    label: "Reset background updates",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: a.stale,
                    onClick: (W) => n("reset", A.plugin)
                  }, null, 8, ["disabled", "onClick"])) : (e(), R(s(G), {
                    key: 2,
                    label: "Check status",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: q[1] || (q[1] = (W) => n("refresh"))
                  }))
                ], 64)) : C?.kind === "uninstalled" ? (e(), i(H, { key: 5 }, [
                  f(s(Ce), { severity: "warn" }, {
                    default: _(() => [...q[11] || (q[11] = [
                      K("The package was removed while it was still enabled for this catalog.", -1)
                    ])]),
                    _: 1
                  }),
                  f(s(G), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (W) => $.value = A.plugin
                  }, null, 8, ["onClick"])
                ], 64)) : u("", !0),
                A.installed && (!C || C.kind === "pending") ? (e(), R(we, {
                  key: 6,
                  class: "small pim-ia-disclosure",
                  label: "Technical details"
                }, {
                  default: _(() => [
                    l("dl", Qo, [
                      l("div", null, [
                        q[12] || (q[12] = l("dt", null, "Plugin ID", -1)),
                        l("dd", null, [
                          l("code", null, y(A.plugin), 1)
                        ])
                      ]),
                      (A.interface_version ?? X.interface_version) != null ? (e(), i("div", Xo, [
                        q[13] || (q[13] = l("dt", null, "Interface version", -1)),
                        l("dd", null, y(A.interface_version ?? X.interface_version), 1)
                      ])) : u("", !0),
                      q[15] || (q[15] = l("div", null, [
                        l("dt", null, "Configuration tool"),
                        l("dd", null, [
                          l("code", null, "PIMConfigurePlugin")
                        ])
                      ], -1)),
                      A.tools.length ? (e(), i("div", ed, [
                        q[14] || (q[14] = l("dt", null, "Plugin tools", -1)),
                        l("dd", null, [
                          l("ul", null, [
                            (e(!0), i(H, null, se(A.tools, (W) => (e(), i("li", { key: W }, [
                              l("code", null, y(W), 1)
                            ]))), 128))
                          ])
                        ])
                      ])) : u("", !0)
                    ])
                  ]),
                  _: 2
                }, 1024)) : u("", !0),
                j && A.installed && C?.kind !== "failed" && C?.kind !== "uninstalled" ? (e(), i(H, { key: 7 }, [
                  L.value && X.config_schema.properties && Object.keys(X.config_schema.properties).length ? (e(), i(H, { key: 0 }, [
                    A.plugin === "kickside.pim.inventory:plugin" ? (e(), i("p", ld, " Hold seconds sets the default and maximum time stock stays set aside after an inventory reservation starts. Leave it empty to use the deployment default. ")) : u("", !0),
                    q[16] || (q[16] = l("p", { class: "muted small" }, "Choose Review changes, then Apply changes to save this configuration.", -1))
                  ], 64)) : u("", !0),
                  f(Al, {
                    disabled: !L.value,
                    schema: X.config_schema,
                    "model-value": a.pluginConfigs[A.plugin] ?? A.config ?? {},
                    problem: C?.kind === "config" ? C.error : void 0,
                    "plugin-id": C?.kind === "config" ? A.plugin : void 0,
                    "problem-label": C?.error?.field && C.error.field !== "config" ? s(tl)(X.config_schema, C.error.field) : void 0,
                    refusal: de ? s(tl)(X.config_schema, de.field) + ": " + de.message : void 0,
                    "onUpdate:modelValue": (W) => B(A.plugin, W)
                  }, null, 8, ["disabled", "schema", "model-value", "problem", "plugin-id", "problem-label", "refusal", "onUpdate:modelValue"])
                ], 64)) : u("", !0)
              ])
            ]),
            _: 2
          }, [
            L.value && A.installed && (!C || C.kind === "pending") ? {
              name: "actions",
              fn: _(() => [
                f(s(ol), {
                  "aria-label": "Enable " + c,
                  "model-value": j,
                  "onUpdate:modelValue": (W) => S(A.plugin, W)
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "title", "open", "onUpdate:open"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      f(vl, {
        visible: !!b.value,
        label: "Plugin references",
        onClose: q[5] || (q[5] = (X) => $.value = void 0)
      }, {
        default: _(() => [
          v.value && b.value ? (e(), i("section", ad, [
            l("header", td, [
              l("div", null, [
                q[17] || (q[17] = l("h2", null, "Plugin references", -1)),
                l("p", null, y(v.value.title), 1)
              ])
            ]),
            P.value.length ? (e(), i(H, { key: 0 }, [
              q[18] || (q[18] = l("p", null, "Replace or remove these references before deactivating the plugin. You can also restore the package to keep using them.", -1)),
              (e(!0), i(H, null, se(P.value, (X) => (e(), i("div", {
                key: X.label
              }, [
                l("h3", null, y(X.label), 1),
                l("ul", null, [
                  (e(!0), i(H, null, se(X.items, (A) => (e(), i("li", {
                    key: A.id
                  }, y(A.title), 1))), 128))
                ])
              ]))), 128))
            ], 64)) : (e(), i("p", sd, "Use the catalog review to see what deactivating this plugin would change.")),
            b.value.references?.scopes.length && !b.value.references?.shell_bindings.length ? (e(), i("p", id, "Reviewing removal also includes these product filter sets.")) : u("", !0),
            f(we, {
              class: "small pim-error-code pim-ia-disclosure",
              label: "Technical details"
            }, {
              default: _(() => [
                l("p", null, [
                  q[19] || (q[19] = K("Plugin ", -1)),
                  l("code", null, y(b.value.plugin), 1)
                ]),
                (e(!0), i(H, null, se(P.value, (X) => (e(), i("div", {
                  key: X.label
                }, [
                  l("p", null, y(X.label), 1),
                  l("ul", null, [
                    (e(!0), i(H, null, se(X.items, (A) => (e(), i("li", {
                      key: A.id
                    }, [
                      l("code", null, y(A.id), 1)
                    ]))), 128))
                  ])
                ]))), 128))
              ]),
              _: 1
            }),
            l("div", nd, [
              L.value && b.value.references?.shell_bindings.length ? (e(), R(s(G), {
                key: 0,
                label: "Clear catalog app binding",
                severity: "secondary",
                outlined: "",
                disabled: a.stale,
                onClick: q[2] || (q[2] = (X) => n("clearShellBinding", b.value.references.shell_bindings[0]))
              }, null, 8, ["disabled"])) : L.value ? (e(), R(s(G), {
                key: 1,
                label: "Review removal",
                disabled: a.stale,
                onClick: q[3] || (q[3] = (X) => ne(b.value))
              }, null, 8, ["disabled"])) : u("", !0),
              f(s(G), {
                label: "Close",
                severity: "secondary",
                outlined: "",
                onClick: q[4] || (q[4] = (X) => $.value = void 0)
              })
            ])
          ])) : u("", !0)
        ]),
        _: 1
      }, 8, ["visible"]),
      f(Le, {
        count: a.options.scopes.length,
        columns: ["details"]
      }, {
        head: _(() => [
          q[21] || (q[21] = l("header", { class: "pim-bsection-head" }, [
            l("h3", null, "Product filter sets"),
            l("span", { class: "muted small" }, "Choose additional ways to filter products.")
          ], -1)),
          f(we, {
            class: "small pim-ia-disclosure",
            label: "Filter set technical details"
          }, {
            default: _(() => [...q[20] || (q[20] = [
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
        default: _(() => [
          a.options.scopes.length === 0 ? (e(), i("div", od, "No product filter sets are available.")) : u("", !0),
          (e(!0), i(H, null, se(a.options.scopes, (X) => (e(), R(Me, {
            "route-section": "plugins",
            "route-id": "scope:" + X.id,
            key: X.id,
            title: s(ce)(X.title, "Filter set")
          }, _e({
            details: _(() => [
              f(s(he), {
                severity: M(X) ? "success" : "secondary",
                value: M(X) ? "Selected" : "Available"
              }, null, 8, ["severity", "value"])
            ]),
            default: _(() => [
              l("div", dd, [
                q[22] || (q[22] = l("span", null, "Filters", -1)),
                (e(!0), i(H, null, se(X.filters, (A, C) => (e(), R(s(he), {
                  key: C,
                  class: "kx-tag-sm small",
                  severity: "secondary",
                  value: r(C, A.ops)
                }, null, 8, ["value"]))), 128)),
                l("span", null, y(s(J)(X.access)) + " access required", 1)
              ]),
              f(we, {
                class: "small pim-ia-disclosure",
                label: "Technical details"
              }, {
                default: _(() => [
                  l("p", null, [
                    q[23] || (q[23] = K("Filter set ID ", -1)),
                    l("code", null, y(X.id), 1)
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, [
            L.value ? {
              name: "actions",
              fn: _(() => [
                f(s(ol), {
                  "aria-label": "Use " + s(ce)(X.title, "Filter set"),
                  "model-value": M(X),
                  "onUpdate:modelValue": (A) => ee(X, A)
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
async function ud(a) {
  const m = await Ua(`/api/v1/pim-admin/catalogs/${encodeURIComponent(a)}/policy_defaults`, "policy defaults");
  if (m.audit !== "fields" && m.audit !== "off" || !["audit_days", "trash_days", "tombstone_days"].every((t) => typeof m[t] == "number" && Number.isSafeInteger(m[t])))
    throw new Error("Policy defaults are unavailable.");
  for (const [t, n] of Object.entries(oa)) {
    const o = m[t];
    if (typeof o != "number" || !Number.isSafeInteger(o) || o < n.min || o > n.max) throw new Error(`Policy ${t} is unavailable.`);
  }
  return m;
}
const oa = {
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
}, cd = { class: "form" }, md = {
  key: 0,
  class: "muted small pim-policy-intro"
}, pd = {
  key: 1,
  class: "muted small pim-policy-status",
  role: "status"
}, vd = {
  key: 0,
  class: "pim-bsection-head"
}, fd = { class: "pim-policy-copy" }, bd = ["for"], yd = ["id"], gd = { key: 0 }, hd = {
  key: 0,
  class: "pim-policy-value"
}, kd = {
  key: 0,
  class: "muted small"
}, _d = /* @__PURE__ */ pe({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {},
    disabled: { type: Boolean },
    defaultsOnly: { type: Boolean }
  },
  setup(a) {
    const m = a, t = Y(), n = D(() => m.defaults ?? t.value), o = Y(), d = Y(!1);
    async function $() {
      if (!(m.defaults || m.disabled)) {
        o.value = void 0, d.value = !0;
        try {
          t.value = await ud(m.catalogId ?? "");
        } catch (r) {
          o.value = Ke(r, "Could not read policy defaults.");
        } finally {
          d.value = !1;
        }
      }
    }
    Ql($);
    const v = D(() => m.draft.policy ?? {}), b = [
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
    function O(r) {
      const S = oa[r];
      return { key: r, ...S, kind: "int", hint: T[r] };
    }
    b.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(O));
    const L = ["proposal_days", "proposal_count"].map(O), Z = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(O), z = [
      { id: "retention", title: "Retention", keys: b },
      { id: "proposals", title: "Proposals", keys: L },
      { id: "advanced", title: "", keys: Z }
    ], g = D(() => [
      { value: "inherited", label: n.value ? `${n.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function x(r, S) {
      const B = m.draft.policy ?? (m.draft.policy = {});
      B[r] = S == null || S === "" || S === "inherited" ? !1 : S;
    }
    return (r, S) => (e(), i("section", cd, [
      a.defaultsOnly ? u("", !0) : (e(), i("p", md, "Empty fields inherit the deployment settings.")),
      d.value ? (e(), i("p", pd, "Loading deployment defaults…")) : u("", !0),
      o.value ? (e(), R(bl, {
        key: 2,
        error: o.value
      }, {
        default: _(() => [
          f(s(G), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: $
          }, {
            default: _(() => [...S[0] || (S[0] = [
              K("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : u("", !0),
      (e(), i(H, null, se(z, (B) => f(Gl(B.id === "advanced" ? we : "section"), Na({
        key: B.id,
        ref_for: !0
      }, B.id === "advanced" ? { label: "Advanced processing settings" } : { "aria-label": B.title }, {
        "data-policy-group": B.id,
        class: "pim-policy-group"
      }), {
        default: _(() => [
          B.title ? (e(), i("header", vd, [
            l("h3", null, y(B.title), 1)
          ])) : u("", !0),
          (e(!0), i(H, null, se(B.keys, (F) => (e(), i("div", {
            key: F.key,
            class: "pim-policy-row"
          }, [
            l("div", fd, [
              l("label", {
                for: "pol-" + F.key
              }, y(F.title), 9, bd),
              l("p", {
                id: "pol-help-" + F.key
              }, [
                K(y(F.hint), 1),
                F.global ? (e(), i("span", gd, " Managed in deployment settings.")) : u("", !0)
              ], 8, yd)
            ]),
            a.defaultsOnly ? (e(), i("p", hd, [
              K(y(n.value?.[F.key] === "fields" ? "Record field changes" : n.value?.[F.key] === "off" ? "Lifecycle and release history" : n.value?.[F.key] ?? "Unavailable") + " ", 1),
              v.value[F.key] !== void 0 && v.value[F.key] !== !1 ? (e(), i("span", kd, " · Catalog override applies")) : u("", !0)
            ])) : F.kind === "enum" ? (e(), R(s($e), {
              key: 1,
              disabled: a.disabled,
              "input-id": "pol-" + F.key,
              "aria-describedby": "pol-help-" + F.key,
              class: "pim-policy-control",
              "model-value": typeof v.value[F.key] == "string" ? v.value[F.key] : "inherited",
              options: g.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": (M) => x(F.key, M)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])) : (e(), R(s(Ea), {
              key: 2,
              disabled: a.disabled || F.global,
              "input-id": "pol-" + F.key,
              "aria-describedby": "pol-help-" + F.key,
              class: "pim-policy-control",
              "model-value": F.global ? Number(n.value?.[F.key] ?? 0) || null : typeof v.value[F.key] == "number" ? Number(v.value[F.key]) : null,
              min: F.min ?? (F.key === "audit_days" ? 0 : 1),
              max: F.max,
              step: 1,
              placeholder: n.value ? "Default: " + n.value[F.key] : "Deployment default",
              "onUpdate:modelValue": (M) => x(F.key, M)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "min", "max", "placeholder", "onUpdate:modelValue"]))
          ]))), 128))
        ]),
        _: 2
      }, 1040, ["data-policy-group"])), 64))
    ]));
  }
}), wd = { class: "form" }, $d = { class: "pim-aspect" }, Cd = { class: "pim-aspect-head" }, xd = {
  key: 0,
  class: "muted small"
}, Vd = /* @__PURE__ */ pe({
  __name: "BuilderDeclaration",
  props: {
    draft: {},
    readonly: { type: Boolean }
  },
  emits: ["replace", "validity"],
  setup(a, { emit: m }) {
    const t = a, n = m, o = Y(JSON.stringify(t.draft, null, 2)), d = Y("");
    Ye(() => n("validity", !0)), be(() => t.draft, (v) => {
      o.value = JSON.stringify(v, null, 2), d.value = "";
    }, { deep: !0 });
    function $() {
      if (!t.readonly)
        try {
          const v = it(o.value);
          d.value = "", n("validity", !0), n("replace", v);
        } catch (v) {
          n("validity", !1), d.value = "Invalid declaration: " + (v instanceof Error ? v.message : String(v));
        }
    }
    return (v, b) => (e(), i("section", wd, [
      l("div", $d, [
        l("header", Cd, [
          b[1] || (b[1] = l("h3", null, "Declaration", -1)),
          a.readonly ? u("", !0) : (e(), i("span", xd, "edits apply to the draft when the JSON parses"))
        ]),
        d.value ? (e(), R(s(Ce), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: _(() => [
            K(y(d.value), 1)
          ]),
          _: 1
        })) : u("", !0),
        f(s(Wa), {
          modelValue: o.value,
          "onUpdate:modelValue": b[0] || (b[0] = (T) => o.value = T),
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
}), Ud = { class: "pim-section-layout" }, jd = { class: "kx-main" }, Sd = ["aria-label"], Ad = { class: "pim-builder-main" }, Od = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, Rd = ["disabled", "inert"], Pd = {
  key: 0,
  class: "form pim-card-body pad pim-ia-action"
}, Td = {
  key: 0,
  class: "muted small"
}, qd = {
  key: 1,
  class: "muted small"
}, Id = { class: "pim-overview-grid" }, Fd = { class: "kx-head-icon" }, Dd = { class: "kx-card-id" }, Nd = { class: "kx-card-name" }, zd = { class: "kx-card-meta" }, Bd = { class: "kx-card-desc" }, Ld = { class: "pim-overview-actions" }, Md = { class: "pim-advanced-actions" }, Ed = { class: "pim-ia-action" }, Wd = { class: "pim-ia-action" }, Hd = { class: "pim-ia-dialog" }, Jd = { class: "pim-ia-dialog-head" }, Kd = {
  key: 0,
  class: "dialog-actions"
}, Gd = ["aria-labelledby"], Yd = { class: "pim-ia-dialog-head" }, Zd = ["id"], Qd = { class: "pim-ia-review-impact" }, Xd = { key: 0 }, er = { key: 1 }, lr = { key: 2 }, ar = { key: 3 }, tr = { key: 4 }, sr = { key: 5 }, ir = { key: 0 }, nr = {
  key: 0,
  class: "pim-plan-list"
}, or = { key: 1 }, dr = {
  key: 1,
  class: "pim-plan-list"
}, rr = {
  key: 2,
  class: "pim-ia-review-impact"
}, ur = {
  key: 0,
  class: "row pim-review-confirm"
}, cr = ["for"], mr = { class: "dialog-actions pim-ia-dialog-actions" }, pr = /* @__PURE__ */ pe({
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
    const t = a, n = m, o = {
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
    }, d = {
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
    }, $ = Y(""), v = Y("General"), b = Y("Overview"), T = Y(""), O = Y(), L = D(() => O.value?.from === "Channels" ? "Families" : O.value ? "Fields" : void 0), Z = Y(), z = Y(!1), g = Y(), x = Y(""), r = Object.keys(o).map((w) => ({
      heading: w === "Channels" ? "Publishing and imports" : w,
      items: o[w].items.map((p) => ({ ...p, value: p.label, section: w }))
    })), S = [
      ...r.filter((w) => w.items.length > 1),
      { heading: "Manage catalog", items: r.filter((w) => w.items.length === 1).flatMap((w) => w.items) }
    ], B = S.flatMap((w) => w.items), F = D(() => W.value && ie.value ? [
      { ...S[0], heading: t.title || "Catalog" },
      ...S.slice(1)
    ] : []), M = D(() => t.backLabel ? {
      value: "all-catalogs",
      label: t.embedded ? "All catalogs" : t.backLabel,
      icon: "tabler:table"
    } : void 0), ee = Y();
    be(ee, (w) => {
      t.focusBack && w?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    function P(w) {
      if (w === "all-catalogs") {
        n("back");
        return;
      }
      const p = B.find((U) => U.label === w);
      p && q(p.section, p.label);
    }
    function ne(w, p, U = "") {
      const le = b.value !== p;
      v.value = w, b.value = p, $.value = U ? d[p] + "/" + U : "", le && (x.value = "", g.value && (g.value.scrollTop = 0));
    }
    function Q(w, p, U = "") {
      ne(w, p, U), t.route !== void 0 && n("navigate", [d[p], ...U ? [encodeURIComponent(U)] : []].join("/"));
    }
    function q(w, p = o[w].items[0].label) {
      (v.value !== w || b.value !== p) && (O.value = void 0, Q(w, p));
    }
    function X(w, p, U) {
      if (t.route === void 0 || d[b.value] !== w || !U && $.value !== w + "/" + p) return;
      const le = W.value;
      (w === "families" ? le?.families[p] : w === "fields" ? le?.declaration.aspects?.some((ue) => ue.attributes?.some((fe) => ue.namespace + "." + fe.id === p)) : w === "dimensions" ? le?.dimensions.some((ue) => ue.name === p) : w === "vocabularies" ? le?.vocabularies[p] : w === "channels" ? le?.channels[p] : w === "sources" ? le?.sources[p] : w === "plugins" && (ie.value?.plugins.some((ue) => ue.plugin === p) || ie.value?.scopes.some((ue) => "scope:" + ue.id === p))) && Q(v.value, b.value, U ? p : "");
    }
    Yl(ia, { selected: $, choose: X }), be(() => t.route, (w) => {
      if (w === void 0) return;
      const [p, U] = w.split("/"), le = B.find((ue) => d[ue.label] === p);
      le?.label !== L.value && (O.value = void 0);
      let re = "";
      try {
        U && (re = decodeURIComponent(U));
      } catch {
      }
      le?.label === "Fields" && re && $.value !== "fields/" + re && (T.value = ""), ne(le?.section ?? "General", le?.label ?? "Overview", re);
    }, { immediate: !0 });
    function A(w) {
      Z.value = w, z.value = !0;
    }
    function C(w) {
      T.value = w, q("Products", "Fields");
    }
    async function j(w, p, U = "") {
      Q(w, p, U), await He(), g.value?.focus({ preventScroll: !0 });
    }
    function c(w) {
      O.value = { from: "Channels", id: w };
      const p = Il.value.find((le) => le.id === w)?.families, U = cl.value.filter((le) => !p?.length || p.includes(le.code));
      j("Products", "Families", U.length === 1 ? U[0].code : void 0);
    }
    function h(w) {
      T.value = "", O.value = { from: "Families", id: w }, j("Products", "Fields");
    }
    function E() {
      if (!O.value) return;
      const { from: w, id: p } = O.value;
      O.value = void 0, j(w === "Channels" ? "Channels" : "Products", w, p);
    }
    function de(w, p, U = p + "s") {
      return w + " " + (w === 1 ? p : U);
    }
    const W = Y(null), ie = Y(null), te = Y({}), xe = Y({}), ge = Y({}), Ie = Y(), rl = D(() => Object.fromEntries(Object.entries(ge.value).filter(([w]) => te.value.plugins?.some((p) => p.use === w) && !W.value?.plugins.some((p) => p.plugin === w && p.active)))), Ve = Y(), Ue = Y(!1), I = Y(null), V = Y(!1), N = D(() => W.value?.access.admin === !0), k = Y(null), ve = Y(!1), ae = Y(!1), Fe = Y(null), ke = Te(), yl = {
      unchanged: "No changes",
      initial: "First schema",
      cosmetic: "Presentation only",
      additive: "New fields or options",
      semantic: "Affects product data",
      refused: "Changes blocked"
    }, da = {
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
    }, Ze = Y(null), De = Y(!0), qe = Ge(), Ol = D(() => ve.value && je.value && (!_l.value.length || ae.value) && !Ue.value && De.value && !!k.value && k.value.class !== "refused" && !!Ze.value?.matches(Ee.value, W.value?.schema_generation ?? -1, ge.value)), Rl = D(() => k.value ? [...k.value.refused, ...k.value.changes.filter((w) => w.class !== "refused")] : []), sl = Ge(), gl = Y(!1);
    let hl = 0;
    be([te, xe, ge], () => {
      hl++, x.value = "", Oe();
    }, { deep: !0, flush: "sync" });
    async function Qe(w = !1, p = !1) {
      if (je.value && !w) return;
      const U = sl.begin(), le = hl, re = t.catalogId, ue = p ? Object.entries(ge.value).filter(([fe]) => W.value?.plugins.some((Re) => Re.plugin === fe && Re.active)) : [];
      gl.value = !0, Ve.value = void 0, Ie.value = void 0;
      try {
        const [fe, Re] = await Promise.all([ye.schema(re), ye.schemaOptions(re)]);
        if (!sl.current(U) || le !== hl || re !== t.catalogId) return !1;
        const Ne = x.value;
        return W.value = fe, ie.value = Re, te.value = el(fe.declaration), xe.value = {}, ge.value = Object.fromEntries(ue.filter(([Ca]) => fe.plugins.some((Ml) => Ml.plugin === Ca && Ml.active))), Oe(), De.value = !0, Ue.value = !1, x.value = Ne, !0;
      } catch (fe) {
        return sl.current(U) && (Ve.value = Ke(fe, "Could not load settings.")), !1;
      } finally {
        sl.current(U) && (gl.value = !1);
      }
    }
    let kl = () => {
    };
    be(() => t.catalogId, (w) => {
      kl(), kl = Xl(`component.${w}`, () => {
        !je.value && !V.value ? Qe() : b.value === "Plugins" && !V.value && ul();
      });
    }, { immediate: !0 });
    const ra = fl(async () => {
      !je.value && !V.value ? await Qe() : b.value === "Plugins" && !V.value && await ul();
    });
    Ye(() => {
      kl(), qe.begin(), sl.begin();
    });
    const { refreshPluginStatus: ul, resetPlugin: ua, resumePluginProjection: ca, clearShellBinding: ma } = qo({
      catalogId: () => t.catalogId,
      shouldPoll: () => ra.value !== !1 && b.value === "Plugins",
      schema: W,
      options: ie,
      busy: V,
      stale: Ue,
      editable: N,
      saved: x,
      clearError: () => {
        Ve.value = void 0;
      },
      reportError: wl
    });
    be(() => t.catalogId, () => {
      qe.begin(), V.value = !1, Ue.value = !1, W.value = null, ie.value = null, $l(), Qe();
    });
    const pa = D(() => Object.values(Wl(te.value, xe.value)).reduce((w, p) => w + (p?.length ?? 0), 0)), Pl = D(() => !!W.value && (JSON.stringify(te.value) !== JSON.stringify(W.value.declaration) || pa.value > 0 || Object.keys(rl.value).length > 0)), je = D(() => Pl.value || Object.keys(ge.value).length > 0);
    be(je, (w) => n("dirty-changed", w), { immediate: !0 });
    const cl = D(() => te.value.families?.filter((w) => w.code !== "generic") ?? []), Tl = D(() => te.value.aspects ?? []), ql = D(() => Tl.value.reduce((w, p) => w + (p.attributes?.length ?? 0), 0)), va = D(() => {
      const w = new Set(te.value.plugins?.map((p) => p.use));
      return Object.values(W.value?.attributes ?? {}).filter((p) => p.plugin && w.has(p.plugin)).length;
    }), fa = D(() => !ql.value && !Tl.value.length && !cl.value.length), Il = D(() => te.value.channels ?? []), ba = D(() => te.value.sources ?? []), Fl = D(() => W.value?.plugins.filter((w) => w.active) ?? []), Dl = D(() => t.catalog?.product_count ?? t.catalog?.item_count), ya = D(() => [
      {
        section: "Products",
        label: "Product setup",
        icon: "tabler:packages",
        summary: [
          ...typeof Dl.value == "number" ? [de(Dl.value, "product")] : [],
          de(cl.value.length, "family", "families"),
          de(ql.value + va.value, "field")
        ].join(" · "),
        detail: cl.value.map((w) => J(w.code)).join(", ") || "Create a family for products that share the same fields."
      },
      {
        section: "Values",
        label: "Allowed values",
        icon: "tabler:list-details",
        summary: [de(te.value.dimensions?.length ?? 0, "dimension"), de(te.value.vocabularies?.length ?? 0, "vocabulary", "vocabularies")].join(" · "),
        detail: te.value.dimensions?.map((w) => J(w.name)).join(", ") || "Add dimensions when values vary by language, region or another context."
      },
      {
        section: "Channels",
        label: "Publishing and imports",
        icon: "tabler:arrows-exchange",
        summary: [de(Il.value.length, "channel"), de(ba.value.length, "source")].join(" · "),
        detail: "Publish products to channels and control incoming updates through sources."
      },
      {
        section: "Plugins",
        label: "Catalog tools",
        icon: "tabler:puzzle",
        summary: de(Fl.value.length, "plugin") + " enabled",
        detail: Fl.value.map((w) => ce(w.title, "Catalog plugin")).join(", ") || "Open Plugins to see which tools you can enable."
      }
    ]), ga = {
      Overview: o.General.question,
      History: "What changed in this catalog?",
      Families: "Choose what each family collects, how products vary, and what they need before release.",
      Fields: "Manage product fields and the groups that families share.",
      "Form layout": "In what order will editors see fields?",
      Dimensions: "Where can product values differ?",
      Vocabularies: "Which terms can product editors choose?",
      Channels: "Choose where each family can publish and what products need before release.",
      Sources: "Control who can send product updates and which fields each source can change.",
      Access: o.Access.question,
      Plugins: o.Plugins.question
    }, Ee = D(() => {
      const w = el(te.value), p = Wl(w, xe.value);
      for (const [U, le] of Object.entries(p)) {
        const re = w.remove ??= {};
        re[U] = [.../* @__PURE__ */ new Set([...re[U] ?? [], ...le])];
      }
      return w;
    });
    function ha(w) {
      const [p, U] = w.split(" ", 2);
      if (p === "plugin" && U) return ce(ie.value?.plugins.find((ue) => ue.plugin === U)?.title, "Plugin");
      if (p === "scope" && U) return ce(ie.value?.scopes.find((ue) => ue.id === U)?.title, "Product filter set");
      if (U) return ce(J(U), J(p)) + (p === "aspect" ? " field group" : "");
      if (w.startsWith("kickside.")) return "Catalog setting";
      const [le, re] = w.split(".", 2);
      return re ? `${ce(J(re), "Field")} (${ce(J(le), "Field group")})` : ce(J(w), "Catalog setting");
    }
    function ka(w) {
      return w.startsWith("renamed from ") ? "Rename from " + J(w.slice(13)) : w.startsWith("config.") ? "Change " + J(w.slice(7)) : w.endsWith(" owning level") ? "Move a field to another variant level" : da[w] ?? J(w);
    }
    const _l = D(() => {
      const w = Ee.value.remove;
      return [
        ...w?.attributes?.length || w?.aspects?.length ? ["Removing fields deletes the values stored in those fields."] : [],
        ...w?.vocabularies?.length ? ["Removing a vocabulary deletes its saved terms."] : [],
        ...w?.channels?.length ? ["Removing a release destination withdraws products already published to it."] : []
      ];
    }), Nl = D(() => {
      const w = W.value?.declaration;
      return w ? [
        ...(te.value.channels ?? []).flatMap((p) => {
          const U = w.channels?.find((le) => le.id === p.id);
          return JSON.stringify(p) === JSON.stringify(U) ? [] : [{ subject: J(p.id), effect: U ? "Change which products can be released here and what they need first" : "Add a release destination" }];
        }),
        ...(Ee.value.remove?.channels ?? []).map((p) => ({ subject: J(p), effect: "Remove this release destination" })),
        ...(te.value.sources ?? []).flatMap((p) => {
          const U = w.sources?.find((le) => le.id === p.id);
          return JSON.stringify(p) === JSON.stringify(U) ? [] : [{ subject: J(p.id), effect: U ? "Update how this source can send product data" : "Let this source send product updates" }];
        }),
        ...(Ee.value.remove?.sources ?? []).map((p) => ({ subject: J(p), effect: "Stop accepting updates from this source" }))
      ] : [];
    }), zl = D(() => {
      const w = Ze.value;
      if (!w) return [];
      const p = w.declaration.plugins?.filter((le) => !W.value?.plugins.some((re) => re.plugin === le.use && re.active)) ?? [];
      return [.../* @__PURE__ */ new Set([...p.map((le) => le.use), ...Object.keys(w.activeConfigs)])].flatMap((le) => {
        const re = ie.value?.plugins.find((Re) => Re.plugin === le);
        if (!re || !Object.keys(re.config_schema.properties ?? {}).length) return [];
        const ue = w.pluginConfigs[le] ?? {}, fe = Object.entries(ue).map(([Re, Ne]) => tl(re.config_schema, Re) + " · " + dl(Ne));
        if (le in w.activeConfigs) {
          const Re = W.value?.plugins.find((Ne) => Ne.plugin === le)?.config ?? {};
          for (const Ne of Object.keys(Re))
            Ne in ue || fe.push(tl(re.config_schema, Ne) + " · Uses default");
        }
        return [{ id: le, title: ce(re.title, "Plugin"), fields: fe.length ? fe : ["Uses defaults"] }];
      });
    });
    function wl(w, p) {
      const U = Ke(w, p), le = U.pluginConfig, re = ie.value?.plugins.find((ue) => ue.installed && ue.plugin === le?.plugin);
      if (le && re && te.value.plugins?.some((ue) => ue.use === le.plugin)) {
        Ie.value = le, q("Plugins");
        return;
      }
      Ve.value = U, U.code === ja && (Ue.value = !0, Oe());
    }
    async function _a() {
      if (!(je.value && !await ll.confirm({
        header: "Discard unsaved changes?",
        message: "Reloading will discard unsaved settings and plugin changes.",
        acceptLabel: "Discard and reload",
        rejectLabel: "Cancel"
      }))) {
        V.value = !0, x.value = "";
        try {
          await Qe(!0);
        } finally {
          V.value = !1;
        }
      }
    }
    async function Bl() {
      if (!W.value || !je.value || !De.value || Ue.value || V.value) return;
      const w = qe.begin(), p = {
        ...at(Ee.value, W.value.schema_generation, ge.value),
        schemaChanges: Pl.value,
        initialConfigs: el(rl.value),
        activeConfigs: el(Object.fromEntries(Object.entries(ge.value).filter(([U]) => W.value?.plugins.some((le) => le.plugin === U && le.active) && !Ee.value.remove?.plugins?.includes(U))))
      };
      V.value = !0, Ve.value = void 0;
      try {
        const U = p.schemaChanges ? await ye.planSchema(t.catalogId, p.declaration, p.generation, p.initialConfigs) : { generation: p.generation, class: "configuration", changes: [], refused: [] };
        if (!qe.current(w) || !p.matches(Ee.value, W.value.schema_generation, ge.value) || !De.value) return;
        Ze.value = p, ae.value = !1, k.value = U, ve.value = !0, await He(), Fe.value?.focus();
      } catch (U) {
        if (!qe.current(w)) return;
        wl(U, "Could not review the change."), Oe(), await He(), I.value?.$el.focus();
      } finally {
        qe.current(w) && (V.value = !1);
      }
    }
    async function wa() {
      if (!W.value || !je.value || !Ol.value || !Ze.value) return;
      const w = t.catalogId, p = qe.begin(), U = Ze.value, le = () => w === t.catalogId && qe.current(p);
      V.value = !0, Ve.value = void 0, x.value = "";
      let re = !1;
      try {
        if (U.schemaChanges) {
          const ue = await ye.applySchema(w, U.declaration, U.generation, U.initialConfigs);
          if (!le()) return;
          const fe = await Qe(!0, !0);
          if (!le() || (n("applied", ue.generation), !fe)) return;
        }
        try {
          for (const [ue, fe] of Object.entries(U.activeConfigs)) {
            if (await ye.configurePlugin(w, ue, fe), !le()) return;
            re = !0, delete ge.value[ue];
          }
        } finally {
          re && le() && await ul(!0);
        }
        if (!le() || Ve.value) return;
        Ie.value = void 0, x.value = "Catalog changes applied.";
      } catch (ue) {
        if (!le()) return;
        Oe(), wl(ue, "Could not apply the change."), await He(), I.value?.$el.focus();
      } finally {
        qe.current(p) && (V.value = !1);
      }
    }
    async function $a() {
      je.value && !await ll.confirm({
        header: "Leave this catalog?",
        message: "Your unsaved catalog changes will be discarded.",
        acceptLabel: "Discard and open settings",
        rejectLabel: "Keep editing"
      }) || ($l(), z.value = !1, ll.navigate("/system/settings"));
    }
    function Oe() {
      ve.value = !1, Ze.value = null;
    }
    function Ll() {
      z.value = !1, De.value = !0;
    }
    function $l() {
      O.value = void 0, ge.value = {}, Ie.value = void 0, De.value = !0, W.value && (te.value = el(W.value.declaration)), xe.value = {}, Oe(), x.value = "";
    }
    function Xe(w, p) {
      const U = xe.value[w] ?? [];
      U.includes(p) || (xe.value = { ...xe.value, [w]: [...U, p] });
    }
    return (w, p) => (e(), i("section", {
      class: Ae(["pim-builder", { embedded: a.embedded }])
    }, [
      l("div", Ud, [
        M.value || W.value && ie.value ? (e(), R(Ya, {
          key: 0,
          ref_key: "rail",
          ref: ee,
          label: "Catalog settings sections",
          value: b.value,
          groups: F.value,
          "leading-item": M.value,
          "onUpdate:value": P
        }, null, 8, ["value", "groups", "leading-item"])) : u("", !0),
        l("div", jd, [
          l("section", {
            ref_key: "content",
            ref: g,
            class: "kx-main-scroll",
            "aria-label": b.value,
            tabindex: "-1"
          }, [
            W.value && ie.value ? (e(), R(Zt, {
              key: 0,
              title: b.value,
              description: ga[b.value]
            }, _e({ _: 2 }, [
              N.value && je.value ? {
                name: "actions",
                fn: _(() => [
                  f(Qt, {
                    busy: V.value,
                    "review-disabled": !De.value || Ue.value,
                    onDiscard: $l,
                    onReview: Bl
                  }, null, 8, ["busy", "review-disabled"])
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : u("", !0),
            l("div", Ad, [
              Ve.value ? (e(), R(bl, {
                key: 0,
                ref_key: "errorPanel",
                ref: I,
                error: Ve.value,
                tabindex: "-1"
              }, {
                default: _(() => [
                  Ue.value ? (e(), R(s(G), {
                    key: 0,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: V.value,
                    onClick: _a
                  }, {
                    default: _(() => [...p[14] || (p[14] = [
                      K("Reload settings", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"])) : !W.value || !ie.value ? (e(), R(s(G), {
                    key: 1,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: p[0] || (p[0] = (U) => Qe())
                  }, {
                    default: _(() => [...p[15] || (p[15] = [
                      K("Retry", -1)
                    ])]),
                    _: 1
                  })) : u("", !0)
                ]),
                _: 1
              }, 8, ["error"])) : u("", !0),
              x.value ? (e(), R(s(Ce), {
                key: 1,
                severity: "success",
                role: "status"
              }, {
                default: _(() => [
                  K(y(x.value), 1)
                ]),
                _: 1
              })) : u("", !0),
              W.value?.rebuilding && b.value === "Overview" ? (e(), R(s(Ce), {
                key: 2,
                severity: "info",
                role: "status"
              }, {
                default: _(() => [...p[16] || (p[16] = [
                  K("Updating product readiness", -1)
                ])]),
                _: 1
              })) : u("", !0),
              gl.value && (!W.value || !ie.value) ? (e(), i("div", Od, "Loading catalog settings…")) : W.value && ie.value ? (e(), i("fieldset", {
                key: 4,
                class: "pim-editor-surface",
                disabled: V.value,
                inert: V.value
              }, [
                N.value ? u("", !0) : (e(), R(s(Ce), {
                  key: 0,
                  severity: "info"
                }, {
                  default: _(() => [...p[17] || (p[17] = [
                    K("You can view this catalog’s settings.", -1)
                  ])]),
                  _: 1
                })),
                (e(), i("div", {
                  key: b.value,
                  class: "pim-ia-content"
                }, [
                  O.value && b.value === L.value ? (e(), i("div", Pd, [
                    l("div", null, [
                      O.value.from === "Channels" ? (e(), i("p", Td, "Open the family that defines what products need before release, then add a release requirement.")) : (e(), i("p", qd, "Add a field with a single value and no dimensions, such as Integer. When you return, select its group under Field groups."))
                    ]),
                    f(s(G), {
                      type: "button",
                      severity: "secondary",
                      outlined: "",
                      size: "small",
                      onClick: E
                    }, {
                      default: _(() => [
                        f(s(oe), {
                          icon: "tabler:arrow-left",
                          "aria-hidden": "true"
                        }),
                        K(" Back to " + y(s(J)(O.value.id)), 1)
                      ]),
                      _: 1
                    })
                  ])) : u("", !0),
                  v.value === "General" && b.value === "History" ? (e(), R(Jt, {
                    key: 1,
                    "catalog-id": a.catalogId,
                    "can-resolve-actors": N.value
                  }, null, 8, ["catalog-id", "can-resolve-actors"])) : v.value === "General" ? (e(), i(H, { key: 2 }, [
                    l("div", Id, [
                      (e(!0), i(H, null, se(ya.value, (U) => (e(), i("section", {
                        key: U.section,
                        class: "kx-card pim-overview-card"
                      }, [
                        l("span", Fd, [
                          f(s(oe), {
                            icon: U.icon,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"])
                        ]),
                        l("div", Dd, [
                          l("h3", Nd, y(U.label), 1),
                          l("p", zd, y(U.summary), 1)
                        ]),
                        l("p", Bd, y(U.detail), 1),
                        l("div", Ld, [
                          f(s(G), {
                            type: "button",
                            text: "",
                            class: "pim-overview-action",
                            onClick: (le) => q(U.section)
                          }, {
                            default: _(() => [
                              K(y(U.section === "Products" ? fa.value ? "Set up products" : "View families" : "View " + U.section.toLowerCase()) + " ", 1),
                              f(s(oe), {
                                icon: "tabler:arrow-right",
                                "aria-hidden": "true"
                              })
                            ]),
                            _: 2
                          }, 1032, ["onClick"]),
                          U.section === "Channels" ? (e(), R(s(G), {
                            key: 0,
                            type: "button",
                            text: "",
                            class: "pim-overview-action",
                            onClick: p[1] || (p[1] = (le) => q("Channels", "Sources"))
                          }, {
                            default: _(() => [
                              p[18] || (p[18] = K(" Manage sources ", -1)),
                              f(s(oe), {
                                icon: "tabler:arrow-right",
                                "aria-hidden": "true"
                              })
                            ]),
                            _: 1
                          })) : u("", !0)
                        ])
                      ]))), 128))
                    ]),
                    f(we, { label: "Advanced" }, {
                      default: _(() => [
                        l("div", Md, [
                          l("div", Ed, [
                            p[19] || (p[19] = l("div", null, [
                              l("h3", null, "Application defaults"),
                              l("p", null, "Review the audit, retention and processing settings this catalog inherits.")
                            ], -1)),
                            f(s(G), {
                              label: "View defaults",
                              severity: "secondary",
                              outlined: "",
                              onClick: p[2] || (p[2] = (U) => A("defaults"))
                            })
                          ]),
                          l("div", Wd, [
                            p[20] || (p[20] = l("div", null, [
                              l("h3", null, "Technical schema"),
                              l("p", null, "Inspect the complete definition, including integration keys and settings used by installed extensions.")
                            ], -1)),
                            f(s(G), {
                              label: "Open declaration",
                              severity: "secondary",
                              outlined: "",
                              onClick: p[3] || (p[3] = (U) => A("declaration"))
                            })
                          ])
                        ])
                      ]),
                      _: 1
                    })
                  ], 64)) : v.value === "Products" ? (e(), i(H, { key: 3 }, [
                    b.value === "Families" ? (e(), R(En, {
                      key: 0,
                      draft: te.value,
                      schema: W.value,
                      options: ie.value,
                      onRemove: Xe,
                      onFields: C,
                      onVariantField: h
                    }, null, 8, ["draft", "schema", "options"])) : b.value === "Fields" ? (e(), R(Pi, {
                      key: 1,
                      family: T.value,
                      "onUpdate:family": p[4] || (p[4] = (U) => T.value = U),
                      draft: te.value,
                      schema: W.value,
                      options: ie.value,
                      onRemove: Xe,
                      onLayout: p[5] || (p[5] = (U) => q("Products", "Form layout"))
                    }, null, 8, ["family", "draft", "schema", "options"])) : (e(), R(Vt, {
                      key: 2,
                      draft: te.value,
                      schema: W.value,
                      types: ie.value.types,
                      onFamilies: p[6] || (p[6] = (U) => q("Products", "Families"))
                    }, null, 8, ["draft", "schema", "types"]))
                  ], 64)) : v.value === "Values" ? (e(), i(H, { key: 4 }, [
                    b.value === "Dimensions" ? (e(), R(Mi, {
                      key: 0,
                      draft: te.value,
                      schema: W.value,
                      onRemove: Xe
                    }, null, 8, ["draft", "schema"])) : (e(), R(un, {
                      key: 1,
                      "catalog-id": a.catalogId,
                      draft: te.value,
                      schema: W.value,
                      onRemove: Xe
                    }, null, 8, ["catalog-id", "draft", "schema"]))
                  ], 64)) : v.value === "Channels" ? (e(), R(Ao, {
                    key: 5,
                    "catalog-id": a.catalogId,
                    draft: te.value,
                    schema: W.value,
                    view: b.value === "Sources" ? "sources" : "channels",
                    onRemove: Xe,
                    onRequirements: c
                  }, null, 8, ["catalog-id", "draft", "schema", "view"])) : v.value === "Access" ? (e(), R(lt, {
                    key: 6,
                    "catalog-id": a.catalogId,
                    title: a.title || "Catalog",
                    access: W.value.access
                  }, null, 8, ["catalog-id", "title", "access"])) : (e(), R(rd, {
                    key: 7,
                    draft: te.value,
                    schema: W.value,
                    options: ie.value,
                    "plugin-configs": ge.value,
                    refusal: Ie.value,
                    stale: Ue.value,
                    onRemove: Xe,
                    onReset: s(ua),
                    onClearRefusal: p[7] || (p[7] = (U) => Ie.value = void 0),
                    onRefresh: p[8] || (p[8] = (U) => s(ul)(!0)),
                    onResume: s(ca),
                    onReview: Bl,
                    onClearShellBinding: s(ma)
                  }, null, 8, ["draft", "schema", "options", "plugin-configs", "refusal", "stale", "onReset", "onResume", "onClearShellBinding"]))
                ])),
                Z.value ? (e(), R(vl, {
                  key: 1,
                  visible: z.value,
                  label: Z.value === "defaults" ? "Application defaults" : "Technical schema",
                  onClose: Ll,
                  onClosed: p[11] || (p[11] = (U) => Z.value = void 0)
                }, {
                  default: _(() => [
                    l("div", Hd, [
                      l("header", Jd, [
                        l("h2", null, y(Z.value === "defaults" ? "Application defaults" : "Technical schema"), 1),
                        f(s(G), {
                          type: "button",
                          "aria-label": "Close",
                          text: "",
                          severity: "secondary",
                          onClick: Ll
                        }, {
                          default: _(() => [
                            f(s(oe), {
                              icon: "tabler:x",
                              "aria-hidden": "true"
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      Z.value === "defaults" ? (e(), i(H, { key: 0 }, [
                        p[21] || (p[21] = l("p", { class: "muted" }, "These settings apply across the application. Catalogs with an explicit override keep their chosen value.", -1)),
                        f(_d, {
                          "catalog-id": a.catalogId,
                          draft: te.value,
                          disabled: !N.value,
                          "defaults-only": ""
                        }, null, 8, ["catalog-id", "draft", "disabled"]),
                        N.value ? (e(), i("div", Kd, [
                          f(s(G), {
                            type: "button",
                            label: "Open application settings",
                            severity: "secondary",
                            outlined: "",
                            onClick: $a
                          })
                        ])) : u("", !0)
                      ], 64)) : (e(), R(Vd, {
                        key: 1,
                        draft: te.value,
                        readonly: !N.value,
                        onReplace: p[9] || (p[9] = (U) => te.value = U),
                        onValidity: p[10] || (p[10] = (U) => {
                          De.value = U, Oe();
                        })
                      }, null, 8, ["draft", "readonly"]))
                    ])
                  ]),
                  _: 1
                }, 8, ["visible", "label"])) : u("", !0)
              ], 8, Rd)) : u("", !0),
              f(vl, {
                class: "pim-review-dialog",
                visible: ve.value,
                busy: V.value,
                label: "Review changes",
                onClose: Oe,
                onClosed: p[13] || (p[13] = (U) => k.value = null)
              }, {
                default: _(() => [
                  k.value ? (e(), i("section", {
                    key: 0,
                    class: "pim-ia-dialog pim-plan",
                    "aria-labelledby": s(ke)
                  }, [
                    l("header", Yd, [
                      l("div", null, [
                        l("h2", {
                          id: s(ke),
                          ref_key: "reviewHeading",
                          ref: Fe,
                          tabindex: "-1",
                          autofocus: ""
                        }, "Review changes", 8, Zd),
                        l("p", null, "Check what will happen when you apply this draft to " + y(a.title || "the catalog") + ".", 1)
                      ]),
                      f(s(G), {
                        type: "button",
                        "aria-label": "Close review",
                        disabled: V.value,
                        text: "",
                        severity: "secondary",
                        onClick: Oe
                      }, {
                        default: _(() => [
                          f(s(oe), {
                            icon: "tabler:x",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ]),
                    l("div", Qd, [
                      l("h3", null, y(k.value.class === "configuration" ? "Plugin configuration" : yl[k.value.class] || "Catalog changes"), 1),
                      k.value.class === "configuration" ? (e(), i("p", Xd, "These settings will apply to the enabled plugins in this catalog.")) : k.value.class === "unchanged" ? (e(), i("p", er, "The catalog already matches this draft.")) : k.value.class === "initial" ? (e(), i("p", lr, "Product editors will use these settings for new products.")) : k.value.class === "cosmetic" ? (e(), i("p", ar, "Catalog settings will update. Stored product values are kept.")) : k.value.class === "additive" ? (e(), i("p", tr, "The new options become available. Existing product values are kept.")) : k.value.class === "semantic" ? (e(), i("p", sr, "Applying changes can recalculate product values or release readiness across this catalog.")) : k.value.class === "refused" ? (e(), R(s(Ce), {
                        key: 6,
                        severity: "error"
                      }, {
                        default: _(() => [
                          p[22] || (p[22] = K(" These changes can’t be applied. ", -1)),
                          k.value.migration && k.value.refused.some((U) => W.value?.attributes[U.code]) ? (e(), i("span", ir, " To change how a field stores values, add a new field and copy the existing values into it. Then remove the original field and give the new field its name. ")) : u("", !0)
                        ]),
                        _: 1
                      })) : u("", !0)
                    ]),
                    Rl.value.length || Nl.value.length ? (e(), i("ul", nr, [
                      (e(!0), i(H, null, se(Rl.value, (U, le) => (e(), i("li", { key: le }, [
                        U.class === "refused" ? (e(), R(s(he), {
                          key: 0,
                          class: "kx-tag-sm small",
                          severity: "danger"
                        }, {
                          default: _(() => [...p[23] || (p[23] = [
                            K("Blocked", -1)
                          ])]),
                          _: 1
                        })) : u("", !0),
                        U.code ? (e(), i("strong", or, y(ha(U.code)), 1)) : u("", !0),
                        l("span", null, y(ka(U.what)), 1)
                      ]))), 128)),
                      (e(!0), i(H, null, se(Nl.value, (U) => (e(), i("li", {
                        key: U.subject + U.effect
                      }, [
                        l("strong", null, y(U.subject), 1),
                        l("span", null, y(U.effect), 1)
                      ]))), 128))
                    ])) : u("", !0),
                    zl.value.length ? (e(), i("ul", dr, [
                      (e(!0), i(H, null, se(zl.value, (U) => (e(), i("li", {
                        key: U.id
                      }, [
                        l("strong", null, y(U.title), 1),
                        l("div", null, [
                          (e(!0), i(H, null, se(U.fields, (le, re) => (e(), i("p", { key: re }, y(le), 1))), 128))
                        ])
                      ]))), 128))
                    ])) : u("", !0),
                    _l.value.length ? (e(), i("div", rr, [
                      p[24] || (p[24] = l("h3", null, "Permanent changes", -1)),
                      (e(!0), i(H, null, se(_l.value, (U) => (e(), i("p", { key: U }, y(U), 1))), 128)),
                      k.value.class !== "refused" ? (e(), i("div", ur, [
                        f(s(za), {
                          modelValue: ae.value,
                          "onUpdate:modelValue": p[12] || (p[12] = (U) => ae.value = U),
                          "input-id": s(ke) + "-acknowledge",
                          binary: "",
                          disabled: V.value
                        }, null, 8, ["modelValue", "input-id", "disabled"]),
                        l("label", {
                          for: s(ke) + "-acknowledge"
                        }, "I understand the effects of these removals", 8, cr)
                      ])) : u("", !0)
                    ])) : u("", !0),
                    l("footer", mr, [
                      f(s(G), {
                        type: "button",
                        label: "Back to editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: V.value,
                        onClick: Oe
                      }, null, 8, ["disabled"]),
                      W.value?.access.admin && k.value.class !== "refused" ? (e(), R(s(G), {
                        key: 0,
                        disabled: !je.value || V.value || !Ol.value,
                        loading: V.value,
                        onClick: wa
                      }, {
                        default: _(() => [
                          K(y(b.value === "Form layout" ? "Apply layout" : "Apply changes"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled", "loading"])) : u("", !0)
                    ])
                  ], 8, Gd)) : u("", !0)
                ]),
                _: 1
              }, 8, ["visible", "busy"])
            ])
          ], 8, Sd)
        ])
      ])
    ], 2));
  }
}), vr = /* @__PURE__ */ pe({
  __name: "SettingsApp",
  setup(a) {
    const m = Sa(), t = Aa(), n = Y(), o = D(() => m.value.catalogId ?? ""), d = Ge();
    async function $() {
      const b = d.begin(), T = o.value;
      try {
        const O = await ye.catalogSummary(T);
        d.current(b) && (n.value = O);
      } catch {
        d.current(b) && (n.value = void 0);
      }
    }
    be(o, () => {
      n.value = void 0, $();
    }), fl($), Ye(() => {
      d.begin();
    });
    function v() {
      m.value.embedded ? t("open-catalog-picker", {}) : t("navigate", { route: "" });
    }
    return (b, T) => o.value ? (e(), R(pr, {
      key: o.value,
      "catalog-id": o.value,
      title: n.value?.title || "Catalog",
      catalog: n.value,
      embedded: s(m).embedded,
      "focus-back": s(m).focusBack,
      route: s(m).route,
      onNavigate: T[0] || (T[0] = (O) => s(t)("navigate", { route: O })),
      "back-label": s(m).embedded ? "Back to catalogs" : "Back to catalog settings",
      onBack: v,
      onDirtyChanged: T[1] || (T[1] = (O) => s(t)("dirty-change", { dirty: O }))
    }, null, 8, ["catalog-id", "title", "catalog", "embedded", "focus-back", "route", "back-label"])) : u("", !0);
  }
});
class fr extends Oa {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "catalog-id": { type: "string", default: "" }, embedded: { type: "boolean", default: !1 }, route: { type: "string" }, "focus-back": { type: "boolean", default: !1 } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: Ra
    };
  }
  static get vueConfig() {
    return { rootComponent: vr, plugins: [Pa] };
  }
}
Ma(import.meta.url, fr);
