import { u as da, r as Ke, e as Na, c as ul, a as ra, p as me, b as Le, d as Ue, _ as ya, g as cl, S as ml, f as pl, h as vl, W as fl, s as bl, P as yl } from "./styles-DISnY5tL.js";
import { defineComponent as de, computed as D, openBlock as e, createElementBlock as i, Fragment as E, renderList as ee, normalizeClass as je, toDisplayString as U, createCommentVNode as v, createBlock as T, unref as s, createElementVNode as a, ref as J, watch as pe, onUnmounted as Ye, withCtx as w, createVNode as y, createStaticVNode as gl, createTextVNode as H, withModifiers as Ae, normalizeStyle as ga, useId as qe, withKeys as wa, renderSlot as Ve, provide as hl, inject as kl, useModel as za, Transition as _l, mergeModels as na, createSlots as Re, toRaw as wl, onMounted as Fa, resolveDynamicComponent as $l, mergeProps as Cl, nextTick as ba } from "vue";
import { Icon as le } from "@iconify/vue";
import ye from "primevue/tag";
import G from "primevue/button";
import xl from "primevue/checkbox";
import we from "primevue/message";
import { api as Vl, on as Ba, host as Je, loadByTagName as Ul, define as Al } from "@wippy-fe/proxy";
import $a from "primevue/selectbutton";
import Ge from "primevue/inputtext";
import jl from "primevue/multiselect";
import la from "primevue/toggleswitch";
import he from "primevue/select";
import Sl from "primevue/inputnumber";
import Rl from "primevue/textarea";
const Ol = ["aria-label"], Il = {
  key: 0,
  class: "kx-settings-rail-group"
}, Tl = ["aria-current", "onClick"], Pl = { class: "kx-settings-rail-label" }, ql = /* @__PURE__ */ de({
  __name: "SettingsRail",
  props: {
    label: {},
    value: {},
    groups: {},
    leadingItem: {}
  },
  emits: ["update:value"],
  setup(l) {
    const $ = l, t = D(() => $.leadingItem ? [{ items: [$.leadingItem] }, ...$.groups] : $.groups);
    function d(u) {
      const m = [...u.currentTarget.querySelectorAll(".kx-settings-rail-item")], f = m.indexOf(u.target);
      if (f < 0) return;
      let c;
      switch (u.key) {
        case "ArrowDown":
        case "ArrowRight":
          c = (f + 1) % m.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          c = (f + m.length - 1) % m.length;
          break;
        case "Home":
          c = 0;
          break;
        case "End":
          c = m.length - 1;
          break;
        default:
          return;
      }
      u.preventDefault(), m[c]?.focus();
    }
    return (u, m) => (e(), i("nav", {
      class: "kx-settings-rail",
      "aria-label": l.label,
      onKeydown: d
    }, [
      (e(!0), i(E, null, ee(t.value, (f, c) => (e(), i("div", {
        key: f.items[0]?.value ?? c,
        class: je(["kx-settings-rail-section", { "kx-settings-rail-leading": l.leadingItem && c === 0 }])
      }, [
        f.heading ? (e(), i("div", Il, U(f.heading), 1)) : v("", !0),
        (e(!0), i(E, null, ee(f.items, (C) => (e(), i("button", {
          key: C.value,
          type: "button",
          class: "kx-settings-rail-item",
          "aria-current": C.value === l.value ? "true" : void 0,
          onClick: (A) => u.$emit("update:value", C.value)
        }, [
          C.icon ? (e(), T(s(le), {
            key: 0,
            class: "kx-settings-rail-icon",
            icon: C.icon,
            "aria-hidden": "true"
          }, null, 8, ["icon"])) : v("", !0),
          a("span", Pl, U(C.label), 1)
        ], 8, Tl))), 128))
      ], 2))), 128))
    ], 40, Ol));
  }
}), Dl = { class: "pim-stack" }, Nl = { class: "form pim-card-body pad pim-ia-action" }, zl = { key: 0 }, Fl = ["config"], Bl = /* @__PURE__ */ de({
  __name: "CatalogShare",
  props: {
    catalogId: {},
    title: {},
    access: {}
  },
  emits: ["summary"],
  setup(l, { emit: $ }) {
    const t = l, d = $, u = J(!1), m = J(!1), f = J(""), c = J(), C = J(!1), A = Ke(), N = D(() => "/api/v1/component-access/grants/" + encodeURIComponent(t.catalogId)), X = D(() => JSON.stringify({
      resource_id: t.catalogId,
      title: t.title,
      access_url: N.value,
      share_url: "/api/v1/component-access/share/" + encodeURIComponent(t.catalogId)
    })), P = D(() => {
      if (!t.access.admin) return "Only catalog administrators can manage sharing.";
      if (!c.value) return C.value ? "Member counts are unavailable." : "Loading members…";
      const { people: x, groups: o } = c.value;
      return x + (x === 1 ? " person" : " people") + " and " + o + (o === 1 ? " group" : " groups") + " with direct access";
    });
    pe(P, (x) => d("summary", x), { immediate: !0 });
    async function z() {
      if (!t.access.admin) return;
      const x = A.begin();
      C.value = !1;
      try {
        const { data: o } = await Vl.get(N.value);
        if (!A.current(x)) return;
        if (!o?.success || !Array.isArray(o.access)) throw new Error("Grants unavailable");
        const j = o.access.filter((I) => I.subject_type === "group").length;
        c.value = { people: o.access.length - j, groups: j };
      } catch {
        A.current(x) && (c.value = void 0, C.value = !0);
      }
    }
    da(z), Ye(() => {
      A.begin();
    });
    async function k() {
      m.value = !0, f.value = "", await Na("kickside-share") ? u.value = !0 : f.value = "Could not open sharing. Try again.", m.value = !1;
    }
    return (x, o) => (e(), i("div", Dl, [
      a("section", Nl, [
        a("div", null, [
          o[1] || (o[1] = a("h3", null, "Members and sharing", -1)),
          l.access.admin ? (e(), i("p", zl, "Invite people or groups and choose what they can do in this catalog.")) : v("", !0)
        ]),
        l.access.admin ? (e(), T(s(G), {
          key: 0,
          type: "button",
          label: "Share catalog",
          loading: m.value,
          onClick: k
        }, {
          icon: w(() => [
            y(s(le), {
              icon: "tabler:share",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : v("", !0),
        C.value ? (e(), T(s(G), {
          key: 1,
          type: "button",
          label: "Reload member counts",
          severity: "secondary",
          text: "",
          onClick: z
        })) : v("", !0)
      ]),
      o[2] || (o[2] = gl('<section class="form pim-card-body pad pim-stack" aria-labelledby="pim-access-roles-heading"><h3 id="pim-access-roles-heading">What members can do</h3><dl class="pim-access-roles"><div><dt>Read</dt><dd>View products and their details.</dd></div><div><dt>Write</dt><dd>Create products and update their values.</dd></div><div><dt>Delete</dt><dd>Move products to trash.</dd></div><div><dt>Admin</dt><dd>Manage catalog settings and who has access.</dd></div></dl></section>', 1)),
      u.value ? (e(), i("kickside-share", {
        key: 0,
        config: X.value,
        onClose: o[0] || (o[0] = (j) => u.value = !1),
        onChanged: z
      }, null, 40, Fl)) : v("", !0),
      f.value ? (e(), T(s(we), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: w(() => [
          H(U(f.value), 1)
        ]),
        _: 1
      })) : v("", !0)
    ]));
  }
});
function Ll(l, $, t = {}) {
  const d = JSON.stringify(l), u = JSON.stringify(t);
  return {
    declaration: JSON.parse(d),
    generation: $,
    pluginConfigs: JSON.parse(u),
    matches: (m, f, c = {}) => $ === f && d === JSON.stringify(m) && u === JSON.stringify(c)
  };
}
function Pa(l, $) {
  const t = {};
  for (const [d, u] of Object.entries($)) {
    const m = u.filter((f) => d === "plugins" ? !l.plugins?.some((c) => c.use === f) : d === "scopes" ? !l.scopes?.includes(f) : d === "attributes" ? !l.aspects?.some((c) => c.attributes?.some((C) => c.namespace + "." + C.code === f)) : d === "aspects" ? !l.aspects?.some((c) => c.namespace === f) : d === "dimensions" ? !l.dimensions?.some((c) => c.name === f) : d === "vocabularies" || d === "families" ? !l[d]?.some((c) => c.code === f) : !l[d]?.some((c) => c.id === f));
    m.length && (t[d] = m);
  }
  return t;
}
const qa = (l) => !!l && typeof l == "object" && !Array.isArray(l), ie = ["string"], La = { "*": "string" }, El = { id: "number", code: "string!", type: "string!", scope: ie, cardinality: "string", index: "string", index_contexts: [La], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, Ml = {
  dimensions: [{ name: "string!", members: ie, fallback: { "*": ie } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: ie }, attributes: [El] }],
  families: [{ code: "string!", aspects: ie, variation: [{ axes: ie, own: ie }], requirements: [{ id: "string!", context: La, require: ie, authored: ie }], checks: [{ check: "string!", reads: ie, cost: "string", config: "object", enforce: "string" }] }],
  sources: [{ id: "string!", ordering: "string", writes: ie, principals: ie, audit: "boolean" }],
  channels: [{ id: "string!", requirements: ie, families: ie }],
  plugins: [{ use: "string!", schema: "json" }],
  scopes: ie,
  policy: { "*": "policy" },
  remove: { dimensions: ie, vocabularies: ie, aspects: ie, families: ie, sources: ie, channels: ie, attributes: ie, scopes: ie, plugins: ie }
};
function ha(l, $, t) {
  if (typeof $ == "string") {
    const d = $.replace("!", "");
    if (!(d === "json" || (d === "object" ? qa(l) : d === "policy" ? l === !1 || typeof l == "string" || typeof l == "number" : typeof l === d)) || $.endsWith("!") && (typeof l != "string" || !l.trim())) throw new Error(`${t} has an invalid ${d} value.`);
  } else if (Array.isArray($)) {
    if (!Array.isArray(l)) throw new Error(`${t} must be an array.`);
    l.forEach((d, u) => ha(d, $[0], `${t}[${u}]`));
  } else {
    if (!qa(l)) throw new Error(`${t} must be an object.`);
    for (const [d, u] of Object.entries($)) if (typeof u == "string" && u.endsWith("!") && l[d] === void 0) throw new Error(`${t}.${d} is required.`);
    for (const [d, u] of Object.entries(l)) {
      const m = $[d] ?? $["*"];
      if (!m) throw new Error(`${t}.${d} is not an editor field.`);
      ha(u, m, `${t}.${d}`);
    }
  }
}
function Wl(l) {
  const $ = JSON.parse(l);
  ha($, Ml, "Declaration");
  const t = $;
  for (const d of t.dimensions ?? []) d.members ??= [];
  return t;
}
function ea(l) {
  return JSON.parse(JSON.stringify(l));
}
const Da = /^[a-z][a-z0-9_]*$/;
function Hl(l) {
  return l.trim().normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function Fe(l, $, t) {
  t.length ? l[$] = t : delete l[$];
}
function Be(l, $, t) {
  if (t < 0 || t >= l.length || $ === t) return;
  const [d] = l.splice($, 1);
  l.splice(t, 0, d);
}
function ne(l, $) {
  return !l || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(l) ? $ : l;
}
function aa(l) {
  return l ? ne(l.title, "Field type") : "Unknown type";
}
async function Ea(l, $) {
  const t = [...new Set($)].map((u) => ({ type: "user", id: u }));
  if (!t.length) return {};
  const d = await ul(`/api/v1/pim-admin/catalogs/${encodeURIComponent(l)}/principal_labels`, { refs: t }, "People");
  return Object.fromEntries((d.principals ?? []).map((u) => [u.id, ne(u.label, "Person")]));
}
const ia = [
  { value: "quarter", label: "¼", span: 3 },
  { value: "third", label: "⅓", span: 4 },
  { value: "half", label: "½", span: 6 },
  { value: "full", label: "1", span: 12 }
];
function ka(l, $, t) {
  return t.width ?? l.attributes[$ + "." + t.code]?.width ?? "half";
}
const Jl = (l) => new Date(l).toLocaleString();
function _a(l) {
  const $ = Math.abs(l.m).toString(), t = l.m < 0 ? "-" : "";
  if (l.e >= 0) return t + $ + "0".repeat(l.e);
  const d = -l.e, u = $.padStart(d + 1, "0");
  return t + u.slice(0, u.length - d) + "." + u.slice(u.length - d);
}
function B(l) {
  const t = (l.includes(".") ? l.slice(l.indexOf(".") + 1) : l).replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : l;
}
function ze(l) {
  return l.labels.en ?? Object.values(l.labels)[0] ?? l.code;
}
function oa(l, $) {
  if (l == null) return "";
  const t = (d) => {
    if (d == null) return "";
    if (typeof d == "object" && "ref" in d) {
      const u = d;
      if (u.ref[0] === "term") {
        const m = u.ref[1].slice(u.ref[1].indexOf(":") + 1), f = u.ref[1].slice(0, u.ref[1].indexOf(":")), c = $?.[f]?.find((C) => C.code === m);
        return c ? ze(c) : m;
      }
      return "Linked " + B(u.ref[0]).toLocaleLowerCase();
    }
    if (typeof d == "object" && "v" in d) {
      const u = d;
      return _a(u.v) + " " + u.u;
    }
    return typeof d == "object" && "m" in d ? _a(d) : typeof d == "boolean" ? d ? "Yes" : "No" : typeof d == "object" ? JSON.stringify(d) : ne(String(d), "Linked record");
  };
  return Array.isArray(l) ? l.map(t).join(", ") : t(l);
}
function Kl(l, $, t) {
  const d = oa($), u = oa(t);
  return !u && d ? `${l} cleared (was ${d})` : d ? `${l}: ${d} → ${u}` : `${l} set to ${u}`;
}
const Gl = { class: "pim-table form pim-layout" }, Yl = {
  key: 0,
  class: "pim-layout-help muted"
}, Zl = {
  key: 1,
  class: "kx-empty"
}, Ql = { class: "pim-aspect-head" }, Xl = {
  key: 0,
  class: "muted small"
}, et = ["draggable", "onDragstart", "onDragover", "onDrop"], at = { class: "pim-lcard-top" }, lt = {
  key: 0,
  class: "pim-grip",
  "aria-hidden": "true"
}, tt = { class: "pim-lcard-name" }, st = { class: "pim-lcard-type" }, it = {
  key: 1,
  class: "pim-lcard-move"
}, nt = { class: "pim-aspect-head" }, ot = { class: "pim-canvas" }, dt = { class: "pim-lcard-top" }, rt = { class: "pim-lcard-name" }, ut = { class: "pim-lcard-type" }, ct = /* @__PURE__ */ de({
  __name: "LayoutEditor",
  props: {
    draft: {},
    schema: {},
    types: {}
  },
  setup(l) {
    const $ = l, t = D(() => $.schema.access.admin), d = D(() => $.draft?.aspects ?? []), u = D(() => new Map($.types.map((z) => [z.id, aa(z)]))), m = D(() => {
      if (!$.schema) return [];
      const z = new Set(($.draft?.aspects ?? []).map((x) => x.namespace)), k = /* @__PURE__ */ new Map();
      for (const [x, o] of Object.entries($.schema.attributes)) {
        const j = x.split(".")[0];
        z.has(j) || !o.plugin || (k.has(j) || k.set(j, { aspect: j, plugin: o.plugin, codes: [] }), k.get(j).codes.push(x));
      }
      return [...k.values()];
    });
    function f(z, k) {
      return ia.find((x) => x.value === ka($.schema, z, k))?.span ?? 6;
    }
    const c = J(null), C = J(null);
    function A(z, k, x) {
      t.value && (c.value = { ns: z, index: k }, x.dataTransfer?.setData("text/plain", z + ":" + k), x.dataTransfer && (x.dataTransfer.effectAllowed = "move"));
    }
    function N(z, k, x) {
      !c.value || c.value.ns !== z || (x.preventDefault(), C.value = { ns: z, index: k });
    }
    function X(z, k) {
      t.value && c.value?.ns === z.namespace && Be(z.attributes ?? [], c.value.index, k), c.value = null, C.value = null;
    }
    function P() {
      c.value = null, C.value = null;
    }
    return (z, k) => (e(), i("div", Gl, [
      t.value ? (e(), i("p", Yl, "Arrange fields within each group and choose their widths. Review changes before applying the layout.")) : v("", !0),
      d.value.length === 0 ? (e(), i("div", Zl, [
        k[1] || (k[1] = H("This catalog has no field groups yet.", -1)),
        t.value ? (e(), i(E, { key: 0 }, [
          H(" Add a field group in Fields.")
        ], 64)) : v("", !0)
      ])) : v("", !0),
      (e(!0), i(E, null, ee(d.value, (x) => (e(), i("section", {
        key: x.namespace,
        class: "pim-aspect"
      }, [
        a("header", Ql, [
          a("h3", null, U(s(B)(x.namespace)), 1),
          t.value ? (e(), i("span", Xl, "drag a field, or use its arrows")) : v("", !0)
        ]),
        a("div", {
          class: "pim-canvas",
          onDragover: k[0] || (k[0] = Ae(() => {
          }, ["prevent"]))
        }, [
          (e(!0), i(E, null, ee(x.attributes ?? [], (o, j) => (e(), i("div", {
            key: o.code,
            class: je(["pim-lcard", { dragging: c.value?.ns === x.namespace && c.value?.index === j, over: C.value?.ns === x.namespace && C.value?.index === j }]),
            style: ga({ gridColumn: "span " + f(x.namespace, o) }),
            draggable: t.value,
            onDragstart: (I) => A(x.namespace, j, I),
            onDragover: (I) => N(x.namespace, j, I),
            onDrop: Ae((I) => X(x, j), ["prevent"]),
            onDragend: P
          }, [
            a("div", at, [
              t.value ? (e(), i("span", lt, [
                y(s(le), { icon: "tabler:grip-vertical" })
              ])) : v("", !0),
              a("span", tt, U(s(B)(o.code)), 1),
              a("span", st, U(u.value.get(o.type) ?? s(aa)(void 0)), 1),
              t.value ? (e(), i("span", it, [
                y(s(G), {
                  type: "button",
                  disabled: j === 0,
                  "aria-label": "Move " + s(B)(o.code) + " earlier",
                  onClick: (I) => s(Be)(x.attributes ?? [], j, j - 1),
                  class: "arrow",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    y(s(le), { icon: "tabler:arrow-left" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                y(s(G), {
                  type: "button",
                  disabled: j === (x.attributes ?? []).length - 1,
                  "aria-label": "Move " + s(B)(o.code) + " later",
                  onClick: (I) => s(Be)(x.attributes ?? [], j, j + 1),
                  class: "arrow",
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    y(s(le), { icon: "tabler:arrow-right" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ])) : v("", !0)
            ]),
            y(s($a), {
              disabled: !t.value,
              "model-value": s(ka)(l.schema, x.namespace, o),
              options: s(ia),
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Width of " + s(B)(o.code),
              "onUpdate:modelValue": (I) => o.width = I
            }, null, 8, ["disabled", "model-value", "options", "aria-label", "onUpdate:modelValue"])
          ], 46, et))), 128))
        ], 32)
      ]))), 128)),
      (e(!0), i(E, null, ee(m.value, (x) => (e(), i("section", {
        key: x.aspect,
        class: "pim-aspect"
      }, [
        a("header", nt, [
          a("h3", null, U(s(B)(x.aspect)), 1),
          k[2] || (k[2] = a("span", { class: "muted small" }, "Provided by a plugin", -1))
        ]),
        a("div", ot, [
          (e(!0), i(E, null, ee(x.codes, (o) => (e(), i("div", {
            key: o,
            class: "pim-lcard fixed",
            style: ga({ gridColumn: "span " + (s(ia).find((j) => j.value === l.schema.attributes[o].width)?.span ?? 6) })
          }, [
            a("div", dt, [
              a("span", rt, U(s(B)(o)), 1),
              a("span", ut, U(u.value.get(l.schema.attributes[o].type) ?? s(aa)(void 0)), 1)
            ])
          ], 4))), 128))
        ])
      ]))), 128))
    ]));
  }
}), mt = {
  class: "pim-history",
  "aria-label": "Catalog history"
}, pt = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, vt = { class: "pim-table pim-responsive-table" }, ft = ["id"], bt = ["aria-labelledby"], yt = {
  key: 0,
  scope: "col"
}, gt = { class: "muted small" }, ht = ["datetime"], kt = {
  key: 0,
  class: "small"
}, _t = {
  key: 0,
  class: "muted"
}, wt = { class: "mono small" }, $t = {
  key: 0,
  class: "muted"
}, Ct = {
  key: 0,
  class: "muted small"
}, xt = ["aria-labelledby"], Vt = { class: "pim-stacked-meta muted small" }, Ut = { key: 0 }, At = { key: 1 }, jt = ["datetime"], St = {
  key: 1,
  class: "kx-empty"
}, Rt = { class: "pim-table-foot" }, Ot = /* @__PURE__ */ de({
  __name: "HistoryPanel",
  props: {
    catalogId: {},
    canResolveActors: { type: Boolean }
  },
  setup(l) {
    const $ = l, t = J([]), d = J({}), u = J(), m = J(!1), f = J(), c = Ke(), C = qe(), A = D(() => t.value.map((k) => ({
      key: `${k.seq}:${k.n}`,
      at: k.at,
      date: Jl(k.at),
      actor: d.value[k.actor] ?? ne(k.actor, "Person"),
      source: k.source ? ne(B(k.source), "Data source") : "",
      product: X(k),
      context: k.ctx ? ne(k.ctx, "Product context") : "",
      change: P(k)
    })));
    async function N(k = !1) {
      const x = c.begin();
      m.value = !0, f.value = void 0;
      try {
        const o = await me.history($.catalogId, { limit: 50, before: k ? u.value : void 0 });
        if (!c.current(x)) return;
        if (t.value = k ? [...t.value, ...o.entries] : o.entries, u.value = o.next, $.canResolveActors)
          try {
            const j = await Ea($.catalogId, o.entries.map((I) => I.actor));
            c.current(x) && (d.value = { ...d.value, ...j });
          } catch {
          }
      } catch (o) {
        if (!c.current(x)) return;
        f.value = Le(o, "Could not load the history.");
      } finally {
        c.current(x) && (m.value = !1);
      }
    }
    function X(k) {
      return k.sku ? k.sku : k.subject.startsWith("p:") ? "purged product" : k.subject.startsWith("t:") ? k.subject.slice(2) : k.subject.startsWith("r:") ? "Release" : ne(k.subject, "Catalog");
    }
    function P(k) {
      if (k.attribute)
        return Kl(B(k.attribute), k.before, k.after);
      switch (k.kind) {
        case "schema":
          return "Catalog settings applied";
        case "term": {
          const x = k.after ?? {}, o = x.labels?.en ?? Object.values(x.labels ?? {})[0];
          return x.retired ? "Term retired" : o ? `Term labelled "${o}"` + (x.parent ? ` under ${x.parent}` : "") : "Term changed";
        }
        case "created": {
          const x = k.after ?? {};
          return `Created as ${B(x.family ?? "product")}` + (x.level ? ` at level ${x.level}` : "");
        }
        case "released": {
          const x = k.after ?? {};
          return `Released v${x.version ?? ""} to ${(x.channels ?? []).join(", ")}`;
        }
        case "withdrawn":
          return `Withdrawn from ${((k.after ?? {}).channels ?? []).join(", ")}`;
        case "status":
          return `Status ${String(k.before ?? "")} → ${String(k.after ?? "")}`;
        case "moved":
          return "Moved under another parent";
        default:
          return B(k.kind);
      }
    }
    let z = () => {
    };
    return pe(() => $.catalogId, () => {
      z(), c.begin(), t.value = [], d.value = {}, u.value = void 0, f.value = void 0, z = Ba(`component.${$.catalogId}`, () => {
        N();
      });
    }, { immediate: !0 }), pe(() => $.catalogId, () => {
      N();
    }), da(() => N()), Ye(() => {
      z(), c.begin();
    }), (k, x) => (e(), i("section", mt, [
      f.value ? (e(), T(ra, {
        key: 0,
        error: f.value
      }, {
        default: w(() => [
          y(s(G), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: x[0] || (x[0] = (o) => N())
          }, {
            default: w(() => [...x[2] || (x[2] = [
              H("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : v("", !0),
      m.value ? (e(), i("div", pt, "Loading history…")) : v("", !0),
      a("div", vt, [
        a("p", {
          id: s(C),
          class: "pim-history-caption muted small"
        }, "Catalog changes, newest first", 8, ft),
        A.value.length ? (e(), i(E, { key: 0 }, [
          a("table", {
            class: "pim-grid",
            "aria-labelledby": s(C)
          }, [
            a("thead", null, [
              a("tr", null, [
                x[3] || (x[3] = a("th", { scope: "col" }, "When", -1)),
                l.canResolveActors ? (e(), i("th", yt, "Who")) : v("", !0),
                x[4] || (x[4] = a("th", { scope: "col" }, "What", -1)),
                x[5] || (x[5] = a("th", { scope: "col" }, "Change", -1))
              ])
            ]),
            a("tbody", null, [
              (e(!0), i(E, null, ee(A.value, (o) => (e(), i("tr", {
                key: o.key
              }, [
                a("td", gt, [
                  a("time", {
                    datetime: o.at
                  }, U(o.date), 9, ht)
                ]),
                l.canResolveActors ? (e(), i("td", kt, [
                  H(U(o.actor), 1),
                  o.source ? (e(), i("span", _t, " via " + U(o.source), 1)) : v("", !0)
                ])) : v("", !0),
                a("td", wt, [
                  H(U(o.product), 1),
                  o.context ? (e(), i("span", $t, " · " + U(o.context), 1)) : v("", !0)
                ]),
                a("td", null, [
                  H(U(o.change), 1),
                  !l.canResolveActors && o.source ? (e(), i("span", Ct, " via " + U(o.source), 1)) : v("", !0)
                ])
              ]))), 128))
            ])
          ], 8, bt),
          a("ol", {
            role: "list",
            class: "pim-stacked-list",
            "aria-labelledby": s(C)
          }, [
            (e(!0), i(E, null, ee(A.value, (o) => (e(), i("li", {
              key: o.key,
              class: "pim-stacked-row"
            }, [
              a("div", null, U(o.change), 1),
              a("div", Vt, [
                l.canResolveActors ? (e(), i("span", Ut, [
                  a("span", null, U(o.actor), 1),
                  o.source ? (e(), i(E, { key: 0 }, [
                    H(" via " + U(o.source), 1)
                  ], 64)) : v("", !0)
                ])) : o.source ? (e(), i("span", At, "Via " + U(o.source), 1)) : v("", !0),
                a("time", {
                  datetime: o.at
                }, U(o.date), 9, jt),
                a("span", null, [
                  H(U(o.product), 1),
                  o.context ? (e(), i(E, { key: 0 }, [
                    H(" · " + U(o.context), 1)
                  ], 64)) : v("", !0)
                ])
              ])
            ]))), 128))
          ], 8, xt)
        ], 64)) : !m.value && !f.value ? (e(), i("div", St, "Nothing recorded yet.")) : v("", !0),
        a("div", Rt, [
          a("span", null, U(A.value.length) + " change" + U(A.value.length === 1 ? "" : "s") + " shown", 1),
          u.value ? (e(), T(s(G), {
            key: 0,
            type: "button",
            disabled: m.value,
            onClick: x[1] || (x[1] = (o) => N(!0)),
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: w(() => [
              y(s(le), {
                icon: "tabler:adjustments",
                "aria-hidden": "true"
              }),
              x[6] || (x[6] = H(" Load older", -1))
            ]),
            _: 1
          }, 8, ["disabled"])) : v("", !0)
        ])
      ])
    ]));
  }
}), It = /* @__PURE__ */ de({
  __name: "SettingsActions",
  props: {
    access: {},
    dirty: { type: Boolean },
    busy: { type: Boolean },
    valid: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(l, { emit: $ }) {
    const t = $;
    return (d, u) => l.access?.admin ? (e(), i(E, { key: 0 }, [
      l.dirty ? (e(), T(s(ye), {
        key: 0,
        severity: "warn",
        value: "Unsaved changes"
      })) : v("", !0),
      l.dirty ? (e(), T(s(G), {
        key: 1,
        severity: "secondary",
        outlined: "",
        disabled: !l.dirty || l.busy,
        onClick: u[0] || (u[0] = (m) => t("discard"))
      }, {
        default: w(() => [
          y(s(le), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          }),
          u[2] || (u[2] = H(" Discard", -1))
        ]),
        _: 1
      }, 8, ["disabled"])) : v("", !0),
      y(s(G), {
        disabled: !l.dirty || l.busy || !l.valid,
        loading: l.busy,
        onClick: u[1] || (u[1] = (m) => t("review"))
      }, {
        default: w(() => [...u[3] || (u[3] = [
          H("Review changes", -1)
        ])]),
        _: 1
      }, 8, ["disabled", "loading"])
    ], 64)) : v("", !0);
  }
}), Tt = { class: "row pim-add-row" }, Pt = ["id"], Ie = /* @__PURE__ */ de({
  __name: "AddSchemaCode",
  props: {
    label: {},
    action: {},
    existing: {},
    fromName: { type: Boolean }
  },
  emits: ["add"],
  setup(l, { emit: $ }) {
    const t = l, d = $, u = J(""), m = qe(), f = D(() => {
      const N = u.value.trim();
      return t.fromName ? Hl(N) : N;
    }), c = D(() => u.value.trim() ? t.existing?.includes(f.value) ? t.fromName ? "This name is already in use." : "This code is already in use." : t.fromName && !Da.test(f.value) ? "Use a name that starts with a letter from A to Z." : Da.test(f.value) ? "" : "Start with a lowercase letter and use only lowercase letters, numbers or underscores." : ""), C = D(() => !!f.value && !c.value);
    function A() {
      C.value && (d("add", f.value), u.value = "");
    }
    return (N, X) => (e(), i("div", Tt, [
      y(s(Ge), {
        modelValue: u.value,
        "onUpdate:modelValue": X[0] || (X[0] = (P) => u.value = P),
        type: "text",
        placeholder: l.label,
        "aria-label": l.label,
        invalid: !!c.value,
        "aria-describedby": c.value ? s(m) : void 0,
        class: je({ mono: !l.fromName }),
        onKeydown: wa(Ae(A, ["prevent"]), ["enter"])
      }, null, 8, ["modelValue", "placeholder", "aria-label", "invalid", "aria-describedby", "class", "onKeydown"]),
      y(s(G), {
        type: "button",
        disabled: !C.value,
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: A
      }, {
        default: w(() => [
          y(s(le), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          H(" " + U(l.action), 1)
        ]),
        _: 1
      }, 8, ["disabled"]),
      Ve(N.$slots, "default"),
      c.value ? (e(), i("p", {
        key: 0,
        id: s(m),
        role: "status",
        class: "pim-add-code-error small"
      }, U(c.value), 9, Pt)) : v("", !0)
    ]));
  }
}), Ma = Symbol("definitionColumns"), qt = { code: "Code", kind: "Kind", details: "Details", usage: "Used by" }, Dt = {
  code: "minmax(120px, 1fr)",
  kind: "140px",
  details: "minmax(120px, 1.2fr)",
  usage: "120px"
}, Nt = {
  class: "pim-definition-scroll",
  tabindex: "0",
  "aria-label": "Definitions"
}, zt = { class: "pim-definition-grid" }, Ft = {
  key: 0,
  class: "pim-definition-columns",
  "aria-hidden": "true"
}, Te = /* @__PURE__ */ de({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: { default: () => ["code"] }
  },
  setup(l) {
    const $ = l;
    hl(Ma, D(() => $.columns));
    const t = D(() => ["48px", "minmax(160px, 1.4fr)", ...$.columns.map((d) => Dt[d]), "80px"].join(" "));
    return (d, u) => (e(), i("section", {
      class: "form pim-definition-list",
      style: ga({ "--pim-definition-columns": t.value })
    }, [
      Ve(d.$slots, "head"),
      a("div", Nt, [
        a("div", zt, [
          l.count > 3 ? (e(), i("div", Ft, [
            u[0] || (u[0] = a("span", null, null, -1)),
            u[1] || (u[1] = a("span", null, "Name", -1)),
            (e(!0), i(E, null, ee(l.columns, (m) => (e(), i("span", {
              key: m,
              class: je("pim-definition-" + m)
            }, U(s(qt)[m]), 3))), 128)),
            u[2] || (u[2] = a("span", null, null, -1))
          ])) : v("", !0),
          Ve(d.$slots, "default")
        ])
      ]),
      Ve(d.$slots, "add")
    ], 4));
  }
}), Bt = ["aria-label"], Lt = /* @__PURE__ */ de({
  __name: "InteractiveSurface",
  props: {
    label: {}
  },
  setup(l) {
    return ($, t) => (e(), i("button", {
      type: "button",
      class: "pim-interactive",
      "aria-label": l.label
    }, [
      Ve($.$slots, "default")
    ], 8, Bt));
  }
}), Et = { class: "pim-definition" }, Mt = {
  class: "pim-definition-lead",
  "data-column": "lead"
}, Wt = {
  class: "pim-row-title",
  "data-column": "name"
}, Ht = { class: "pim-definition-meta" }, Jt = ["data-column"], Kt = {
  key: 0,
  class: "mono"
}, Gt = {
  class: "pim-definition-actions",
  "data-column": "actions"
}, Yt = ["id"], Pe = /* @__PURE__ */ de({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ na({
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
  emits: /* @__PURE__ */ na(["head-keydown", "head-drop", "head-dragover"], ["update:open"]),
  setup(l, { emit: $ }) {
    const t = l, d = kl(Ma, D(() => [
      ...t.code ? ["code"] : [],
      ...t.kind ? ["kind"] : []
    ])), u = za(l, "open"), m = qe(), f = $;
    return (c, C) => (e(), i("section", Et, [
      a("header", {
        class: je(["pim-definition-head", l.headClass]),
        onKeydown: C[1] || (C[1] = (A) => f("head-keydown", A)),
        onDrop: C[2] || (C[2] = (A) => f("head-drop", A)),
        onDragover: C[3] || (C[3] = (A) => f("head-dragover", A))
      }, [
        y(Lt, {
          class: je(["pim-definition-toggle", l.toggleClass]),
          "aria-expanded": u.value,
          "aria-controls": u.value ? s(m) : void 0,
          onClick: C[0] || (C[0] = (A) => u.value = !u.value)
        }, {
          default: w(() => [
            a("span", Mt, [
              Ve(c.$slots, "handle"),
              y(s(le), {
                icon: "tabler:chevron-right",
                class: "pim-definition-chevron",
                "aria-hidden": "true"
              })
            ]),
            a("span", Wt, U(l.title), 1),
            a("span", Ht, [
              (e(!0), i(E, null, ee(s(d), (A) => (e(), i("span", {
                key: A,
                class: je("pim-definition-" + A),
                "data-column": A
              }, [
                A === "code" && l.code ? (e(), i("code", Kt, U(l.code), 1)) : A === "kind" && l.kind ? (e(), T(s(ye), {
                  key: 1,
                  severity: "secondary",
                  value: l.kind
                }, null, 8, ["value"])) : A === "details" ? Ve(c.$slots, "details", {}, void 0, void 0, 2) : A === "usage" ? Ve(c.$slots, "usage", {}, () => [
                  H(U(l.usage), 1)
                ], void 0, 3) : v("", !0)
              ], 10, Jt))), 128))
            ])
          ]),
          _: 3
        }, 8, ["class", "aria-expanded", "aria-controls"]),
        a("div", Gt, [
          Ve(c.$slots, "actions")
        ])
      ], 34),
      y(_l, { name: "pim-expand" }, {
        default: w(() => [
          u.value ? (e(), i("div", {
            key: 0,
            id: s(m),
            class: "pim-definition-body"
          }, [
            Ve(c.$slots, "default")
          ], 8, Yt)) : v("", !0)
        ]),
        _: 3
      })
    ]));
  }
}), Zt = { class: "pim-chips pim-picker-chips" }, Qt = {
  key: 0,
  class: "muted small"
}, _e = /* @__PURE__ */ de({
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
  setup(l, { emit: $ }) {
    const t = l, d = $, u = J("");
    function m(N) {
      return t.modelValue.includes(N);
    }
    function f(N) {
      t.disabled || !N || d("update:modelValue", m(N) ? t.modelValue.filter((X) => X !== N) : [...t.modelValue, N]);
    }
    function c() {
      const N = u.value.trim();
      if (!N || m(N)) {
        u.value = "";
        return;
      }
      d("update:modelValue", [...t.modelValue, N]), u.value = "";
    }
    function C(N) {
      d("update:modelValue", t.modelValue.filter((X) => X !== N));
    }
    function A(N) {
      return t.options?.find((X) => X.value === N)?.label ?? N;
    }
    return (N, X) => (e(), i("div", Zt, [
      l.disabled ? (e(), i(E, { key: 0 }, [
        (e(!0), i(E, null, ee(l.modelValue, (P) => (e(), i("span", { key: P }, U(A(P)), 1))), 128)),
        l.modelValue.length ? v("", !0) : (e(), i("span", Qt, "None"))
      ], 64)) : l.options && (l.dropdown || l.options.length > 10) ? (e(), i(E, { key: 1 }, [
        (e(!0), i(E, null, ee(l.modelValue, (P) => (e(), i("span", {
          key: P,
          class: "row"
        }, [
          H(U(A(P)), 1),
          l.disabled ? v("", !0) : (e(), T(s(G), {
            key: 0,
            type: "button",
            "aria-label": "Remove " + A(P),
            onClick: (z) => C(P),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: w(() => [
              y(s(le), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"]))
        ]))), 128)),
        l.disabled ? v("", !0) : (e(), T(s(he), {
          key: 0,
          "model-value": null,
          placeholder: l.placeholder ?? "Add…",
          "aria-labelledby": l.labelledby,
          "aria-label": l.placeholder ?? "Add",
          "onUpdate:modelValue": X[0] || (X[0] = (P) => f(P)),
          class: "pim-chip-entry",
          options: l.options.filter((P) => !m(P.value)).map((P) => ({ value: P.value, label: P.label ?? P.value })),
          "option-label": "label",
          "option-value": "value",
          appendTo: "self"
        }, null, 8, ["placeholder", "aria-labelledby", "aria-label", "options"]))
      ], 64)) : l.options ? (e(), i(E, { key: 2 }, [
        y(s($a), {
          "model-value": l.modelValue.filter((P) => l.options.some((z) => z.value === P)),
          options: l.options.map((P) => ({ value: P.value, label: P.label ?? P.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          disabled: l.disabled,
          "aria-labelledby": l.labelledby,
          "aria-label": l.placeholder ?? "Selected values",
          "onUpdate:modelValue": X[1] || (X[1] = (P) => d("update:modelValue", [...P, ...l.modelValue.filter((z) => !l.options.some((k) => k.value === z))]))
        }, null, 8, ["model-value", "options", "disabled", "aria-labelledby", "aria-label"]),
        (e(!0), i(E, null, ee(l.modelValue.filter((P) => !l.options.some((z) => z.value === P)), (P) => (e(), i("span", {
          key: P,
          class: "row"
        }, [
          H(U(A(P)), 1),
          y(s(G), {
            type: "button",
            "aria-label": "Remove " + P,
            onClick: (z) => C(P),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: w(() => [
              y(s(le), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"])
        ]))), 128))
      ], 64)) : (e(!0), i(E, { key: 3 }, ee(l.modelValue, (P) => (e(), i("span", {
        key: P,
        class: "row"
      }, [
        H(U(P), 1),
        y(s(G), {
          type: "button",
          "aria-label": "Remove " + P,
          onClick: (z) => C(P),
          size: "small",
          text: "",
          severity: "secondary"
        }, {
          default: w(() => [
            y(s(le), { icon: "tabler:x" })
          ]),
          _: 1
        }, 8, ["aria-label", "onClick"])
      ]))), 128)),
      l.free && !l.disabled ? (e(), T(s(Ge), {
        key: 4,
        modelValue: u.value,
        "onUpdate:modelValue": X[2] || (X[2] = (P) => u.value = P),
        type: "text",
        "aria-labelledby": l.labelledby,
        placeholder: l.placeholder ?? "Add…",
        onKeydown: wa(Ae(c, ["prevent"]), ["enter"]),
        onBlur: c,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "aria-labelledby", "placeholder", "onKeydown"])) : v("", !0)
    ]));
  }
}), Xt = { key: 0 }, es = {
  key: 0,
  class: "pim-config-overrides"
}, as = {
  key: 1,
  class: "muted small"
}, ls = { key: 3 }, ts = ["schema", "config"], ss = {
  key: 1,
  class: "muted small",
  role: "status"
}, Ca = /* @__PURE__ */ de({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean },
    problem: {},
    problemLabel: {},
    pluginId: {}
  },
  emits: ["update:modelValue"],
  setup(l, { emit: $ }) {
    const t = l, d = $, u = J("pending"), m = D(() => {
      const C = t.schema.properties;
      return Object.entries(t.modelValue).map(([A, N]) => ({
        key: A,
        label: C?.[A]?.title ?? B(A),
        value: N !== null && typeof N == "object" ? JSON.stringify(N) : oa(N)
      }));
    });
    async function f() {
      u.value = "pending", u.value = await Na("wc-schema-form") ? "ready" : "failed";
    }
    pe(() => t.disabled, (C) => {
      C || f();
    }, { immediate: !0 });
    function c(C) {
      const A = C.detail;
      A && typeof A == "object" && !Array.isArray(A) && d("update:modelValue", A);
    }
    return (C, A) => (e(), i(E, null, [
      l.problem ? (e(), T(s(we), {
        key: 0,
        severity: "warn",
        role: "alert"
      }, {
        default: w(() => [
          l.problemLabel ? (e(), i(E, { key: 0 }, [
            H(U(l.problemLabel) + " is required. Enter a value below.", 1)
          ], 64)) : (e(), i(E, { key: 1 }, [
            H("The saved settings don’t meet the plugin’s requirements. Update the configuration below.")
          ], 64))
        ]),
        _: 1
      })) : v("", !0),
      l.problem ? (e(), T(Ue, {
        key: 1,
        class: "small pim-error-code pim-ia-disclosure",
        label: "Technical details"
      }, {
        default: w(() => [
          l.pluginId ? (e(), i("p", Xt, [
            A[1] || (A[1] = H("Plugin ", -1)),
            a("code", null, U(l.pluginId), 1)
          ])) : v("", !0),
          a("p", null, U(l.problem.message), 1)
        ]),
        _: 1
      })) : v("", !0),
      l.disabled ? (e(), i(E, { key: 2 }, [
        m.value.length ? (e(), i("dl", es, [
          (e(!0), i(E, null, ee(m.value, (N) => (e(), i(E, {
            key: N.key
          }, [
            a("dt", null, U(N.label), 1),
            a("dd", null, U(N.value), 1)
          ], 64))), 128))
        ])) : (e(), i("span", as, "No overrides"))
      ], 64)) : (e(), i("div", ls, [
        u.value === "ready" ? (e(), i("wc-schema-form", {
          key: 0,
          schema: JSON.stringify(t.schema),
          config: JSON.stringify(l.modelValue),
          onConfigChanged: c
        }, null, 40, ts)) : u.value === "pending" ? (e(), i("span", ss, "Configuration form is loading.")) : (e(), T(s(we), {
          key: 2,
          role: "alert",
          severity: "error"
        }, {
          default: w(() => [
            A[3] || (A[3] = H("Configuration form could not be loaded. ", -1)),
            y(s(G), {
              type: "button",
              onClick: f,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: w(() => [...A[2] || (A[2] = [
                H("Retry", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })),
        l.problem ? v("", !0) : (e(), T(s(G), {
          key: 3,
          type: "button",
          onClick: A[0] || (A[0] = (N) => d("update:modelValue", {})),
          severity: "secondary",
          outlined: "",
          size: "small"
        }, {
          default: w(() => [
            y(s(le), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            }),
            A[4] || (A[4] = H(" Reset overrides", -1))
          ]),
          _: 1
        }))
      ]))
    ], 64));
  }
}), is = { key: 0 }, ns = /* @__PURE__ */ de({
  __name: "DefaultValue",
  props: {
    attribute: {},
    type: {},
    disabled: { type: Boolean }
  },
  emits: ["change"],
  setup(l, { emit: $ }) {
    const t = l, d = $, u = D(() => {
      const C = t.type?.form;
      let A = { type: "string" };
      return C === "bool" ? A = { type: "boolean" } : C === "int" ? A = { type: "integer" } : C === "dec" ? A = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : C === "quantity" ? A = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(t.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : C === "record" ? A = { type: "object", additionalProperties: !0 } : C === "ref" && (A = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${t.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (t.attribute.cardinality ?? "one") !== "one" && (A = { type: "array", items: A, uniqueItems: t.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...A, title: "Default value" } } };
    });
    function m(C) {
      return C && typeof C == "object" && "m" in C && "e" in C ? _a(C) : C;
    }
    function f(C) {
      return t.type?.form === "dec" ? m(C) : t.type?.form === "quantity" && C && typeof C == "object" && "v" in C && "u" in C ? { value: m(C.v), unit: C.u } : C;
    }
    const c = D(() => t.attribute.default === void 0 ? {} : { value: Array.isArray(t.attribute.default) ? t.attribute.default.map(f) : f(t.attribute.default) });
    return (C, A) => l.disabled ? (e(), i("span", is, U(l.attribute.default == null ? "No default" : s(oa)(l.attribute.default)), 1)) : (e(), T(Ca, {
      key: 1,
      schema: u.value,
      "model-value": c.value,
      "onUpdate:modelValue": A[0] || (A[0] = (N) => d("change", N.value))
    }, null, 8, ["schema", "model-value"]));
  }
}), os = { class: "pim-stack" }, ds = { class: "form pim-card-body pad pim-ia-action pim-family-filter" }, rs = {
  key: 1,
  class: "form pim-card-body pad muted"
}, us = { class: "pim-bsection-head pim-ia-group-head" }, cs = { class: "small muted" }, ms = { class: "pim-source-permissions" }, ps = ["for"], vs = {
  key: 0,
  class: "small muted"
}, fs = ["onDragstart"], bs = { class: "pim-fields" }, ys = { class: "pim-f pim-w-third" }, gs = { class: "pim-f-label" }, hs = ["id"], ks = { class: "pim-f pim-w-third" }, _s = { class: "pim-f-label" }, ws = ["id"], $s = {
  key: 0,
  class: "pim-f pim-w-third"
}, Cs = { class: "pim-f-label" }, xs = ["id"], Vs = {
  key: 1,
  class: "pim-f pim-w-full muted small"
}, Us = {
  key: 2,
  class: "pim-f pim-w-full muted small"
}, As = {
  key: 3,
  class: "pim-f pim-w-third"
}, js = { class: "pim-f-label" }, Ss = ["id"], Rs = { class: "pim-f pim-w-third" }, Os = { class: "pim-f-label" }, Is = ["id"], Ts = { class: "pim-f pim-w-half" }, Ps = { class: "pim-f-label" }, qs = ["id"], Ds = ["aria-labelledby"], Ns = { class: "pim-f-label" }, zs = ["id"], Fs = ["aria-labelledby"], Bs = { class: "pim-f-label" }, Ls = ["id"], Es = { class: "pim-fields" }, Ms = { class: "pim-f pim-w-third" }, Ws = { class: "pim-f-label" }, Hs = ["for"], Js = {
  key: 0,
  class: "pim-f-note"
}, Ks = { class: "pim-f pim-w-third" }, Gs = { class: "pim-f-label" }, Ys = ["id"], Zs = { class: "pim-f pim-w-half" }, Qs = { class: "pim-f-label" }, Xs = ["for"], ei = { class: "row" }, ai = {
  key: 0,
  class: "pim-f pim-w-full"
}, li = { class: "pim-f-label" }, ti = ["id"], si = ["aria-labelledby"], ii = ["id"], ni = {
  key: 0,
  class: "row end"
}, oi = /* @__PURE__ */ de({
  __name: "BuilderFields",
  props: /* @__PURE__ */ na({
    draft: {},
    schema: {},
    options: {}
  }, {
    family: { default: "" },
    familyModifiers: {}
  }),
  emits: /* @__PURE__ */ na(["remove"], ["update:family"]),
  setup(l, { emit: $ }) {
    const t = l, d = za(l, "family"), u = $, m = ia.map((V) => V.value), f = [{ value: "one", label: "Single value" }, { value: "list", label: "Ordered list" }, { value: "set", label: "Unique set" }], c = D(() => t.schema.access.admin), C = D(() => t.draft.aspects ?? []), A = D(() => (t.draft.families ?? []).filter((V) => V.code !== "generic"));
    pe(A, (V) => {
      d.value && !V.some((R) => R.code === d.value) && (d.value = "");
    }, { immediate: !0 });
    const N = D(() => [{ value: "", label: "All families" }, ...A.value.map((V) => ({ value: V.code, label: B(V.code) }))]), X = D(() => {
      const V = A.value.find((R) => R.code === d.value);
      return V ? C.value.filter((R) => V.aspects?.includes(R.namespace)) : C.value;
    }), P = D(() => (t.draft.dimensions ?? []).map((V) => ({ value: V.name, label: B(V.name) }))), z = D(() => (t.draft.vocabularies ?? []).map((V) => V.code)), k = D(() => (t.draft.sources ?? []).map((V) => ({ value: V.id, label: B(V.id) }))), x = D(() => [...t.options.types].sort((V, R) => V.form.localeCompare(R.form)).map((V) => ({ value: V.id, label: aa(V) })));
    function o(V) {
      return t.options.types.find((R) => R.id === V.type);
    }
    function j(V) {
      return o(V)?.target === "term";
    }
    function I(V) {
      return o(V)?.target === "asset";
    }
    function M(V) {
      const R = o(V);
      return !!R && R.form === "ref" && !R.target;
    }
    function se(V) {
      return A.value.filter((R) => R.aspects?.includes(V)).map((R) => B(R.code));
    }
    function fe(V) {
      const R = se(V);
      return R.length ? R.length === 1 ? R[0] : R.length + " families" : "Unused by families";
    }
    const ae = { none: "None", key: "Exact match", number: "Number range", text: "Text search" }, Z = J({}), W = qe(), S = /* @__PURE__ */ new WeakMap();
    let K = 0;
    function h(V, R) {
      if (R.id !== void 0) return V + "." + R.id;
      const q = wl(R);
      let _ = S.get(q);
      return _ === void 0 && (_ = ++K, S.set(q, _)), V + ".draft-" + _;
    }
    function n(V, R, q) {
      return W + "-" + h(V, R) + "-" + q;
    }
    function b(V, R) {
      V.type = R;
      const q = o(V);
      if (q && V.index && !q.indexes.includes(V.index) && delete V.index, j(V) || delete V.vocabulary, I(V) && delete V.default, !M(V) && V.config && "target" in V.config) {
        const { target: _, ...oe } = V.config;
        V.config = Object.keys(oe).length ? oe : void 0, V.config || delete V.config;
      }
    }
    function r(V, R) {
      Object.keys(R).length ? V.config = R : delete V.config;
    }
    function L(V, R) {
      const q = { ...V.config ?? {} };
      R ? q.target = R : delete q.target, r(V, q);
    }
    function F(V, R) {
      R.length ? V.scope = R : delete V.scope, R.length || delete V.index_contexts;
    }
    function Q(V, R, q) {
      q === void 0 || q === "" || q === !1 && R !== "default" ? delete V[R] : V[R] = q;
    }
    function ce(V) {
      return V.index_contexts ?? [];
    }
    function re(V) {
      return (t.draft.dimensions ?? []).find((R) => R.name === V)?.members ?? [];
    }
    function Ee(V) {
      const R = {};
      for (const _ of V.scope ?? []) R[_] = re(_)[0] ?? "";
      (V.index_contexts ?? (V.index_contexts = [])).push(R);
    }
    const $e = J(null);
    function ta(V, R, q) {
      if (!c.value || !V.altKey) return;
      const _ = { ArrowUp: -1, ArrowDown: 1 }[V.key];
      _ !== void 0 && (V.preventDefault(), Be(R.attributes ?? [], q, q + _));
    }
    function Me(V, R) {
      c.value && $e.value?.namespace === V.namespace && Be(V.attributes ?? [], $e.value.index, R), $e.value = null;
    }
    function ua(V) {
      (t.draft.aspects ??= []).push({ namespace: V, attributes: [] });
    }
    function ca(V) {
      const R = C.value.indexOf(V);
      R >= 0 && C.value.splice(R, 1), t.schema.declaration.aspects?.some((q) => q.namespace === V.namespace) && u("remove", "aspects", V.namespace);
    }
    function Se(V, R) {
      const q = t.options.types.find((oe) => oe.id === "kickside.pim.types:text") ?? t.options.types[0], _ = { code: R, type: q?.id ?? "" };
      (V.attributes ??= []).push(_), Z.value[h(V.namespace, _)] = !0;
    }
    function Ce(V, R) {
      const q = V.attributes ?? [], _ = q.indexOf(R);
      _ >= 0 && q.splice(_, 1);
      const oe = R.id === void 0 ? void 0 : t.schema.declaration.aspects?.find((Y) => Y.namespace === V.namespace)?.attributes?.find((Y) => Y.id === R.id);
      oe && u("remove", "attributes", V.namespace + "." + oe.code);
    }
    return (V, R) => (e(), i("div", os, [
      a("div", ds, [
        R[4] || (R[4] = a("div", null, [
          a("h3", null, "Field groups"),
          a("p", null, "Families share fields through groups. A change to a shared field applies to each family that uses it.")
        ], -1)),
        A.value.length ? (e(), T(s(he), {
          key: 0,
          modelValue: d.value,
          "onUpdate:modelValue": R[0] || (R[0] = (q) => d.value = q),
          "aria-label": "Show fields for a family",
          placeholder: "All families",
          options: N.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self"
        }, null, 8, ["modelValue", "options"])) : v("", !0)
      ]),
      c.value && !d.value ? (e(), T(Ie, {
        key: 0,
        class: "pim-ia-inline-add",
        label: "Field group name",
        action: "Add field group",
        "from-name": "",
        existing: C.value.map((q) => q.namespace),
        onAdd: ua
      }, null, 8, ["existing"])) : v("", !0),
      d.value && !X.value.length ? (e(), i("p", rs, "This family has no field groups yet. Open the family to choose which groups it uses.")) : v("", !0),
      (e(!0), i(E, null, ee(X.value, (q) => (e(), T(Te, {
        key: q.namespace,
        count: q.attributes?.length ?? 0,
        columns: ["kind", "details", "usage"]
      }, {
        head: w(() => [
          a("header", us, [
            a("div", null, [
              a("h3", null, U(s(B)(q.namespace)), 1),
              a("p", cs, U(se(q.namespace).length ? "Used by " + se(q.namespace).join(", ") : "Unused by families"), 1)
            ])
          ]),
          c.value ? (e(), T(Ie, {
            key: 0,
            label: "Field name",
            action: "Add field",
            "from-name": "",
            existing: q.attributes?.map((_) => _.code),
            onAdd: (_) => Se(q, _)
          }, null, 8, ["existing", "onAdd"])) : v("", !0),
          y(Ue, {
            class: "pim-ia-disclosure pim-group-settings",
            label: "Field group settings"
          }, {
            default: w(() => [
              a("div", ms, [
                a("label", {
                  for: "writers-" + q.namespace
                }, "Sources allowed to write", 8, ps),
                y(s(jl), {
                  disabled: !c.value,
                  "input-id": "writers-" + q.namespace,
                  "aria-label": "Sources allowed to write",
                  "model-value": q.write?.sources ?? [],
                  options: k.value,
                  "option-label": "label",
                  "option-value": "value",
                  placeholder: "Any source",
                  appendTo: "self",
                  "onUpdate:modelValue": (_) => q.write = { sources: _ }
                }, null, 8, ["disabled", "input-id", "model-value", "options", "onUpdate:modelValue"]),
                c.value ? (e(), i("span", vs, "Leave empty to allow any source to write this field group.")) : v("", !0)
              ]),
              c.value ? (e(), T(s(G), {
                key: 0,
                type: "button",
                onClick: (_) => ca(q),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: w(() => [
                  y(s(le), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  }),
                  R[5] || (R[5] = H(" Remove field group", -1))
                ]),
                _: 1
              }, 8, ["onClick"])) : v("", !0)
            ]),
            _: 2
          }, 1024)
        ]),
        default: w(() => [
          (e(!0), i(E, null, ee(q.attributes ?? [], (_, oe) => (e(), T(Pe, {
            key: h(q.namespace, _),
            open: Z.value[h(q.namespace, _)],
            "onUpdate:open": (Y) => Z.value[h(q.namespace, _)] = Y,
            title: s(B)(_.code),
            kind: s(aa)(o(_)),
            usage: fe(q.namespace),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle",
            onHeadDragover: R[3] || (R[3] = Ae(() => {
            }, ["prevent"])),
            onHeadDrop: Ae((Y) => Me(q, oe), ["prevent"]),
            onHeadKeydown: (Y) => ta(Y, q, oe)
          }, Re({
            handle: w(() => [
              c.value ? (e(), i("span", {
                key: 0,
                class: "pim-grip",
                draggable: "true",
                "aria-hidden": "true",
                onClick: R[1] || (R[1] = Ae(() => {
                }, ["stop"])),
                onDragstart: Ae((Y) => $e.value = { namespace: q.namespace, index: oe }, ["stop"]),
                onDragend: R[2] || (R[2] = (Y) => $e.value = null)
              }, [
                y(s(le), { icon: "tabler:grip-vertical" })
              ], 40, fs)) : v("", !0)
            ]),
            details: w(() => [
              _.cardinality && _.cardinality !== "one" ? (e(), T(s(ye), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [
                  H(U(f.find((Y) => Y.value === _.cardinality)?.label), 1)
                ]),
                _: 2
              }, 1024)) : v("", !0),
              _.scope?.length ? (e(), T(s(ye), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [
                  H("per " + U(_.scope.map(s(B)).join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : v("", !0),
              _.index && _.index !== "none" ? (e(), T(s(ye), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [
                  H(U(ae[_.index] || "Filterable"), 1)
                ]),
                _: 2
              }, 1024)) : v("", !0),
              _.unique ? (e(), T(s(ye), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: w(() => [...R[6] || (R[6] = [
                  H("unique", -1)
                ])]),
                _: 1
              })) : v("", !0)
            ]),
            default: w(() => [
              a("div", bs, [
                a("div", ys, [
                  a("div", gs, [
                    a("label", {
                      id: n(q.namespace, _, "type")
                    }, "Type", 8, hs)
                  ]),
                  y(s(he), {
                    disabled: !c.value,
                    "aria-labelledby": n(q.namespace, _, "type"),
                    "model-value": _.type,
                    options: x.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (Y) => b(_, Y)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                a("div", ks, [
                  a("div", _s, [
                    a("label", {
                      id: n(q.namespace, _, "values")
                    }, "Values", 8, ws)
                  ]),
                  y(s(he), {
                    disabled: !c.value,
                    "aria-labelledby": n(q.namespace, _, "values"),
                    "model-value": _.cardinality ?? "one",
                    options: f,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (Y) => Q(_, "cardinality", Y === "one" ? void 0 : Y)
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                j(_) ? (e(), i("div", $s, [
                  a("div", Cs, [
                    a("label", {
                      id: n(q.namespace, _, "vocabulary")
                    }, "Vocabulary", 8, xs)
                  ]),
                  y(s(he), {
                    disabled: !c.value,
                    "aria-labelledby": n(q.namespace, _, "vocabulary"),
                    "model-value": _.vocabulary ?? "",
                    "onUpdate:modelValue": (Y) => Q(_, "vocabulary", Y),
                    options: [{ value: "", label: "Choose…" }, ...z.value.map((Y) => ({ value: Y, label: s(B)(Y) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : v("", !0),
                I(_) ? (e(), i("p", Vs, "Choose the media types and file size this field accepts. Catalog readers can access attached files.")) : o(_)?.form === "ref" && !j(_) ? (e(), i("p", Us, U(M(_) ? "A link points to something managed by an installed plugin." : "A product reference points to another product in this catalog."), 1)) : v("", !0),
                M(_) ? (e(), i("div", As, [
                  a("div", js, [
                    a("label", {
                      id: n(q.namespace, _, "link")
                    }, "Link destination", 8, Ss),
                    R[7] || (R[7] = a("span", { class: "pim-f-note" }, "choose what the field can point to", -1))
                  ]),
                  y(s(he), {
                    disabled: !c.value,
                    "aria-labelledby": n(q.namespace, _, "link"),
                    "model-value": _.config?.target ?? "",
                    "onUpdate:modelValue": (Y) => L(_, Y),
                    options: [{ value: "", label: "Choose…" }, ...l.options.link_kinds.map((Y) => ({ value: Y.kind, label: s(ne)(Y.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                ])) : v("", !0),
                a("div", Rs, [
                  a("div", Os, [
                    a("label", {
                      id: n(q.namespace, _, "width")
                    }, "Width", 8, Is),
                    R[8] || (R[8] = a("span", { class: "pim-f-note" }, "of a form row", -1))
                  ]),
                  y(s($a), {
                    disabled: !c.value,
                    "aria-labelledby": n(q.namespace, _, "width"),
                    "model-value": s(ka)(l.schema, q.namespace, _),
                    options: s(m),
                    "allow-empty": !1,
                    "onUpdate:modelValue": (Y) => _.width = Y
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                a("div", Ts, [
                  a("div", Ps, [
                    a("label", {
                      id: n(q.namespace, _, "scope")
                    }, "Varies per", 8, qs),
                    R[9] || (R[9] = a("span", { class: "pim-f-note" }, "dimensions the value depends on", -1))
                  ]),
                  y(_e, {
                    disabled: !c.value,
                    labelledby: n(q.namespace, _, "scope"),
                    "model-value": _.scope ?? [],
                    options: P.value,
                    "onUpdate:modelValue": (Y) => F(_, Y)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                I(_) ? v("", !0) : (e(), i("div", {
                  key: 4,
                  class: "pim-f pim-w-half",
                  role: "group",
                  "aria-labelledby": n(q.namespace, _, "default")
                }, [
                  a("div", Ns, [
                    a("label", {
                      id: n(q.namespace, _, "default")
                    }, "Default", 8, zs),
                    R[10] || (R[10] = a("span", { class: "pim-f-note" }, "when no value is set", -1))
                  ]),
                  y(ns, {
                    disabled: !c.value,
                    attribute: _,
                    type: o(_),
                    onChange: (Y) => Q(_, "default", Y)
                  }, null, 8, ["disabled", "attribute", "type", "onChange"])
                ], 8, Ds)),
                o(_)?.config_schema ? (e(), i("div", {
                  key: 5,
                  class: "pim-f pim-w-full",
                  role: "group",
                  "aria-labelledby": n(q.namespace, _, "config")
                }, [
                  a("div", Bs, [
                    a("label", {
                      id: n(q.namespace, _, "config")
                    }, "Type configuration", 8, Ls)
                  ]),
                  y(Ca, {
                    disabled: !c.value,
                    schema: o(_).config_schema,
                    "model-value": _.config ?? {},
                    "onUpdate:modelValue": (Y) => r(_, Y)
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue"])
                ], 8, Fs)) : v("", !0)
              ]),
              y(Ue, {
                class: "pim-field-advanced pim-ia-disclosure",
                label: "Advanced"
              }, {
                default: w(() => [
                  a("div", Es, [
                    a("div", Ms, [
                      a("div", Ws, [
                        a("label", {
                          for: n(q.namespace, _, "code")
                        }, "Integration key", 8, Hs),
                        _.id !== void 0 ? (e(), i("span", Js, "renaming keeps stored values")) : v("", !0)
                      ]),
                      y(s(Ge), {
                        disabled: !c.value,
                        id: n(q.namespace, _, "code"),
                        type: "text",
                        value: _.code,
                        onInput: (Y) => _.code = Y.target.value,
                        class: "mono"
                      }, null, 8, ["disabled", "id", "value", "onInput"])
                    ]),
                    a("div", Ks, [
                      a("div", Gs, [
                        a("label", {
                          id: n(q.namespace, _, "index")
                        }, "Search and filters", 8, Ys),
                        R[11] || (R[11] = a("span", { class: "pim-f-note" }, "choose how this field can be matched", -1))
                      ]),
                      y(s(he), {
                        disabled: !c.value,
                        "aria-labelledby": n(q.namespace, _, "index"),
                        "model-value": _.index ?? "none",
                        options: (o(_)?.indexes ?? ["none"]).map((Y) => ({ value: Y, label: ae[Y] || s(B)(Y) })),
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self",
                        "onUpdate:modelValue": (Y) => Q(_, "index", Y === "none" ? void 0 : Y)
                      }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ]),
                    a("div", Zs, [
                      a("div", Qs, [
                        a("label", {
                          for: n(q.namespace, _, "unique")
                        }, "Unique", 8, Xs),
                        R[12] || (R[12] = a("span", { class: "pim-f-note" }, "one holder per value, catalog wide", -1))
                      ]),
                      a("div", ei, [
                        y(s(la), {
                          "input-id": n(q.namespace, _, "unique"),
                          "model-value": _.unique === !0,
                          disabled: !c.value || !!_.scope?.length || (_.cardinality ?? "one") !== "one",
                          "onUpdate:modelValue": (Y) => Q(_, "unique", Y)
                        }, null, 8, ["input-id", "model-value", "disabled", "onUpdate:modelValue"]),
                        a("span", null, U(_.unique ? "Yes" : "No"), 1)
                      ])
                    ]),
                    (_.scope?.length ?? 0) > 0 && _.index && _.index !== "none" ? (e(), i("div", ai, [
                      a("div", li, [
                        a("label", {
                          id: n(q.namespace, _, "contexts")
                        }, "Filterable combinations", 8, ti),
                        R[13] || (R[13] = a("span", { class: "pim-f-note" }, "which combinations get an index", -1))
                      ]),
                      a("div", {
                        class: "pim-contexts",
                        role: "group",
                        "aria-labelledby": n(q.namespace, _, "contexts")
                      }, [
                        (e(!0), i(E, null, ee(ce(_), (Y, Oe) => (e(), i("div", {
                          key: Oe,
                          class: "pim-context-row"
                        }, [
                          (e(!0), i(E, null, ee(_.scope, (ve) => (e(), i("div", {
                            key: ve,
                            class: "pim-context-field"
                          }, [
                            a("span", {
                              id: n(q.namespace, _, "context-" + Oe + "-" + ve),
                              class: "small muted"
                            }, U(s(B)(ve)), 9, ii),
                            y(s(he), {
                              disabled: !c.value,
                              "aria-labelledby": n(q.namespace, _, "context-" + Oe + "-" + ve),
                              "model-value": Y[ve] ?? "",
                              options: re(ve),
                              class: "narrow",
                              appendTo: "self",
                              "onUpdate:modelValue": (Ze) => Y[ve] = Ze
                            }, null, 8, ["disabled", "aria-labelledby", "model-value", "options", "onUpdate:modelValue"])
                          ]))), 128)),
                          c.value ? (e(), T(s(G), {
                            key: 0,
                            type: "button",
                            "aria-label": "Remove context",
                            onClick: (ve) => ce(_).splice(Oe, 1),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: w(() => [
                              y(s(le), { icon: "tabler:x" })
                            ]),
                            _: 1
                          }, 8, ["onClick"])) : v("", !0)
                        ]))), 128)),
                        c.value ? (e(), T(s(G), {
                          key: 0,
                          type: "button",
                          onClick: (Y) => Ee(_),
                          severity: "secondary",
                          outlined: "",
                          size: "small"
                        }, {
                          default: w(() => [
                            y(s(le), {
                              icon: "tabler:plus",
                              "aria-hidden": "true"
                            }),
                            R[14] || (R[14] = H(" Add context", -1))
                          ]),
                          _: 1
                        }, 8, ["onClick"])) : v("", !0)
                      ], 8, si)
                    ])) : v("", !0)
                  ])
                ]),
                _: 2
              }, 1024),
              c.value ? (e(), i("div", ni, [
                y(s(G), {
                  type: "button",
                  onClick: (Y) => Ce(q, _),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    y(s(le), { icon: "tabler:trash" }),
                    R[15] || (R[15] = H(" Remove field", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])) : v("", !0)
            ]),
            _: 2
          }, [
            c.value ? {
              name: "actions",
              fn: w(() => [
                y(s(G), {
                  type: "button",
                  disabled: oe === 0,
                  "aria-label": "Move " + s(B)(_.code) + " earlier",
                  onClick: (Y) => s(Be)(q.attributes, oe, oe - 1),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    y(s(le), { icon: "tabler:arrow-up" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"]),
                y(s(G), {
                  type: "button",
                  disabled: oe === (q.attributes?.length ?? 0) - 1,
                  "aria-label": "Move " + s(B)(_.code) + " later",
                  onClick: (Y) => s(Be)(q.attributes, oe, oe + 1),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    y(s(le), { icon: "tabler:arrow-down" })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["open", "onUpdate:open", "title", "kind", "usage", "onHeadDrop", "onHeadKeydown"]))), 128))
        ]),
        _: 2
      }, 1032, ["count"]))), 128))
    ]));
  }
}), di = { class: "muted small" }, ri = { class: "pim-aspect" }, ui = {
  key: 0,
  class: "small muted"
}, ci = { class: "pim-fields" }, mi = { class: "pim-f pim-w-full" }, pi = { class: "pim-f-label" }, vi = ["id"], fi = { class: "pim-f-label" }, bi = ["id"], yi = /* @__PURE__ */ de({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(l, { emit: $ }) {
    const t = l, d = $, u = D(() => t.schema.access.admin), m = D(() => t.draft.dimensions ?? []), f = qe();
    function c(k, x) {
      return f + "-" + k.name + "-" + x;
    }
    function C(k) {
      (t.draft.dimensions ??= []).push({ name: k, members: [] });
    }
    function A(k) {
      const x = [];
      for (const o of t.draft.aspects ?? []) for (const j of o.attributes ?? []) j.scope?.includes(k.name) && x.push(`${B(j.code)} (${B(o.namespace)})`);
      for (const o of t.draft.families ?? []) for (const j of o.requirements ?? []) j.context && k.name in j.context && x.push(`${B(j.id)} (${B(o.code)})`);
      return x;
    }
    function N(k) {
      A(k).length || (m.value.splice(m.value.indexOf(k), 1), t.schema.declaration.dimensions?.some((x) => x.name === k.name) && d("remove", "dimensions", k.name));
    }
    function X(k, x) {
      if (k.members = x, k.fallback)
        for (const o of Object.keys(k.fallback)) x.includes(o) || delete k.fallback[o];
    }
    function P(k, x) {
      return k.fallback?.[x] ?? [];
    }
    function z(k, x, o) {
      const j = { ...k.fallback ?? {} };
      o.length ? j[x] = o : delete j[x], Object.keys(j).length ? k.fallback = j : delete k.fallback;
    }
    return (k, x) => (e(), T(Te, {
      count: m.value.length,
      columns: ["details", "usage"]
    }, Re({
      default: w(() => [
        (e(!0), i(E, null, ee(m.value, (o) => (e(), T(Pe, {
          title: s(B)(o.name),
          key: o.name,
          usage: A(o).length ? "Used in " + A(o).length + " places" : "Unused"
        }, Re({
          details: w(() => [
            a("span", di, U(o.members.map(s(B)).join(", ") || "No allowed values"), 1)
          ]),
          default: w(() => [
            a("div", ri, [
              A(o).length ? (e(), i("p", ui, "Used by " + U(A(o).join(", ")), 1)) : v("", !0),
              a("div", ci, [
                a("div", mi, [
                  a("div", pi, [
                    a("label", {
                      id: c(o, "members")
                    }, "Allowed values", 8, vi),
                    x[0] || (x[0] = a("span", { class: "pim-f-note" }, "for example, English and French for Language", -1))
                  ]),
                  y(_e, {
                    disabled: !u.value,
                    labelledby: c(o, "members"),
                    "model-value": o.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (j) => X(o, j)
                  }, null, 8, ["disabled", "labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                (e(!0), i(E, null, ee(o.members, (j) => (e(), i("div", {
                  key: j,
                  class: "pim-f pim-w-half"
                }, [
                  a("div", fi, [
                    a("label", {
                      id: c(o, "fallback-" + encodeURIComponent(j))
                    }, U(j) + " falls back to", 9, bi),
                    x[1] || (x[1] = a("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  y(_e, {
                    disabled: !u.value,
                    labelledby: c(o, "fallback-" + encodeURIComponent(j)),
                    "model-value": P(o, j),
                    options: o.members.filter((I) => I !== j).map((I) => ({ value: I })),
                    "onUpdate:modelValue": (I) => z(o, j, I)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]))), 128))
              ])
            ])
          ]),
          _: 2
        }, [
          u.value ? {
            name: "actions",
            fn: w(() => [
              y(s(G), {
                type: "button",
                disabled: A(o).length > 0,
                "aria-label": "Remove " + s(B)(o.name),
                title: A(o).length ? "Take the dimension off these first" : "",
                onClick: (j) => N(o),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: w(() => [
                  y(s(le), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "title", "onClick"])
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["title", "usage"]))), 128))
      ]),
      _: 2
    }, [
      u.value ? {
        name: "add",
        fn: w(() => [
          y(Ie, {
            label: "Dimension name",
            "from-name": "",
            action: "Add dimension",
            existing: m.value.map((o) => o.name),
            onAdd: C
          }, {
            default: w(() => [...x[2] || (x[2] = [
              a("span", { class: "muted small" }, "A dimension lets a value differ per member, with fallbacks between members.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), gi = { class: "muted small" }, hi = { class: "pim-aspect" }, ki = { class: "row small" }, _i = {
  key: 1,
  class: "muted small"
}, wi = {
  key: 2,
  class: "pim-stack tight pim-terms"
}, $i = {
  key: 0,
  class: "muted small"
}, Ci = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, xi = {
  key: 3,
  class: "pim-responsive-table"
}, Vi = {
  class: "pim-grid compact",
  "aria-label": "Vocabulary terms"
}, Ui = { key: 0 }, Ai = { key: 1 }, ji = {
  key: 0,
  class: "muted"
}, Si = {
  key: 1,
  class: "num"
}, Ri = {
  role: "list",
  class: "pim-stacked-list",
  "aria-label": "Vocabulary terms"
}, Oi = {
  key: 0,
  class: "pim-stacked-meta muted small"
}, Ii = {
  key: 4,
  class: "muted small"
}, Ti = { class: "row wrap" }, Pi = {
  key: 5,
  class: "row wrap pim-add-row"
}, qi = {
  key: 0,
  class: "pim-config-overrides"
}, Di = /* @__PURE__ */ de({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(l, { emit: $ }) {
    const t = l, d = $, u = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/, m = D(() => t.schema.access.admin), f = D(() => m.value && t.schema.access.write), c = D(() => t.draft.vocabularies ?? []);
    function C(n) {
      (t.draft.vocabularies ??= []).push({ code: n });
    }
    function A(n) {
      c.value.splice(c.value.indexOf(n), 1), t.schema.declaration.vocabularies?.some((b) => b.code === n.code) && d("remove", "vocabularies", n.code);
    }
    function N(n) {
      return !!t.schema.vocabularies[n];
    }
    const X = J({}), P = J({}), z = J({}), k = J({}), x = J({}), o = J({}), j = J({}), I = J({});
    function M(n) {
      return !!(x.value[n] || o.value[n]);
    }
    async function se(n, b) {
      x.value[n] = !0, delete j.value[n];
      try {
        const r = await me.termsPage(t.catalogId, n, b);
        P.value[n] = r.terms, k.value[n] = b, z.value[n] = r.next;
        const L = ae(n);
        r.terms.some((F) => F.retired && F.code === L.parent) && (L.parent = "");
      } catch (r) {
        j.value[n] = { errors: [Le(r, "Could not load terms.")], read: { after: b } };
      } finally {
        x.value[n] = !1;
      }
    }
    function fe(n) {
      X.value[n] = !X.value[n], X.value[n] && !M(n) && !P.value[n] && !j.value[n] && se(n);
    }
    function ae(n) {
      return I.value[n] ?? (I.value[n] = { code: "", label: "", parent: "" });
    }
    function Z(n, b) {
      const r = P.value[n]?.find((L) => L.code === b);
      return r ? ze(r) : B(b);
    }
    function W(n) {
      return [{ value: "", label: "No parent" }, ...(P.value[n] ?? []).filter((b) => !b.retired).map((b) => ({ value: b.code, label: ze(b) }))];
    }
    function S(n, b, r) {
      j.value[n] = { errors: b?.findings?.length ? b.findings.map((L) => ({ message: L.message ?? r, code: L.code })) : [{ message: r }] };
    }
    async function K(n) {
      const b = ae(n.code);
      if (!(!f.value || !u.test(b.code))) {
        o.value[n.code] = !0, delete j.value[n.code];
        try {
          const r = { term: { vocabulary: n.code, code: b.code }, labels: { en: b.label || B(b.code) } };
          n.hierarchical && b.parent && (r.parent = b.parent);
          const F = (await me.apply(t.catalogId, [r])).outcomes[0];
          if (F?.outcome !== "created" && F?.outcome !== "updated") {
            S(n.code, F, "The term was not accepted.");
            return;
          }
          I.value[n.code] = { code: "", label: "", parent: "" }, me.invalidateTerms(t.catalogId), await se(n.code, k.value[n.code]);
        } catch (r) {
          j.value[n.code] = { errors: [Le(r, "Could not add the term.")] };
        } finally {
          o.value[n.code] = !1;
        }
      }
    }
    async function h(n, b, r) {
      if (f.value && !(r && !await Je.confirm({ header: "Retire term?", message: `Retire ${ze(b)}? Term changes save immediately. You can restore this term later.`, acceptLabel: "Retire", rejectLabel: "Cancel" }))) {
        o.value[n.code] = !0, delete j.value[n.code];
        try {
          const F = (await me.apply(t.catalogId, [{ term: { vocabulary: n.code, code: b.code }, retired: r }])).outcomes[0];
          if (!F || !["updated", "unchanged"].includes(F.outcome)) {
            S(n.code, F, "The term change was not accepted.");
            return;
          }
          r && ae(n.code).parent === b.code && (ae(n.code).parent = ""), me.invalidateTerms(t.catalogId), await se(n.code, k.value[n.code]);
        } catch (L) {
          j.value[n.code] = { errors: [Le(L, "Could not change the term.")] };
        } finally {
          o.value[n.code] = !1;
        }
      }
    }
    return (n, b) => (e(), T(Te, {
      count: c.value.length,
      columns: ["details"]
    }, Re({
      default: w(() => [
        (e(!0), i(E, null, ee(c.value, (r) => (e(), T(Pe, {
          title: s(B)(r.code),
          key: r.code
        }, {
          details: w(() => [
            a("span", gi, U(r.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: w(() => [
            m.value ? (e(), T(s(G), {
              key: 0,
              type: "button",
              "aria-label": "Remove " + s(B)(r.code),
              onClick: (L) => A(r),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: w(() => [
                y(s(le), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])) : v("", !0)
          ]),
          default: w(() => [
            a("div", hi, [
              a("label", ki, [
                y(s(la), {
                  disabled: !m.value,
                  "aria-label": "Hierarchical " + s(B)(r.code),
                  "model-value": r.hierarchical === !0,
                  "onUpdate:modelValue": (L) => L ? r.hierarchical = !0 : delete r.hierarchical
                }, null, 8, ["disabled", "aria-label", "model-value", "onUpdate:modelValue"]),
                b[0] || (b[0] = a("span", null, "Hierarchical", -1))
              ]),
              N(r.code) ? (e(), T(s(G), {
                key: 0,
                type: "button",
                onClick: (L) => fe(r.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: w(() => [
                  y(s(le), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  H(" " + U(X.value[r.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : m.value ? (e(), i("span", _i, "Apply the schema before adding terms.")) : v("", !0),
              X.value[r.code] ? (e(), i("div", wi, [
                f.value ? (e(), i("p", $i, "Term changes save immediately.")) : v("", !0),
                x.value[r.code] ? (e(), i("div", Ci, "Loading terms…")) : j.value[r.code] ? (e(!0), i(E, { key: 2 }, ee(j.value[r.code].errors, (L, F) => (e(), T(ra, {
                  key: F,
                  error: L
                }, {
                  default: w(() => [
                    j.value[r.code].read ? (e(), T(s(G), {
                      key: 0,
                      type: "button",
                      onClick: (Q) => se(r.code, j.value[r.code].read?.after),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: w(() => [...b[1] || (b[1] = [
                        H("Retry", -1)
                      ])]),
                      _: 1
                    }, 8, ["onClick"])) : v("", !0)
                  ]),
                  _: 2
                }, 1032, ["error"]))), 128)) : v("", !0),
                (P.value[r.code] ?? []).length ? (e(), i("div", xi, [
                  a("table", Vi, [
                    a("thead", null, [
                      a("tr", null, [
                        b[2] || (b[2] = a("th", null, "Term", -1)),
                        r.hierarchical ? (e(), i("th", Ui, "Parent")) : v("", !0),
                        m.value ? (e(), i("th", Ai)) : v("", !0)
                      ])
                    ]),
                    a("tbody", null, [
                      (e(!0), i(E, null, ee(P.value[r.code], (L) => (e(), i("tr", {
                        key: L.code,
                        class: je({ muted: L.retired })
                      }, [
                        a("td", null, [
                          H(U(s(ze)(L)) + " ", 1),
                          L.retired ? (e(), T(s(ye), {
                            key: 0,
                            severity: "secondary",
                            value: "Retired"
                          })) : v("", !0)
                        ]),
                        r.hierarchical ? (e(), i("td", ji, U(L.parent ? Z(r.code, L.parent) : "—"), 1)) : v("", !0),
                        m.value ? (e(), i("td", Si, [
                          y(s(G), {
                            type: "button",
                            disabled: !f.value || M(r.code),
                            onClick: (F) => h(r, L, !L.retired),
                            text: "",
                            severity: "secondary",
                            size: "small"
                          }, {
                            default: w(() => [
                              H(U(L.retired ? "Restore" : "Retire"), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled", "onClick"])
                        ])) : v("", !0)
                      ], 2))), 128))
                    ])
                  ]),
                  a("ul", Ri, [
                    (e(!0), i(E, null, ee(P.value[r.code], (L) => (e(), i("li", {
                      key: L.code,
                      class: je(["pim-stacked-row", { muted: L.retired }])
                    }, [
                      a("div", null, [
                        H(U(s(ze)(L)) + " ", 1),
                        L.retired ? (e(), T(s(ye), {
                          key: 0,
                          severity: "secondary",
                          value: "Retired"
                        })) : v("", !0)
                      ]),
                      r.hierarchical && L.parent ? (e(), i("div", Oi, "Parent: " + U(Z(r.code, L.parent)), 1)) : v("", !0),
                      m.value ? (e(), T(s(G), {
                        key: 1,
                        type: "button",
                        disabled: !f.value || M(r.code),
                        onClick: (F) => h(r, L, !L.retired),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: w(() => [
                          H(U(L.retired ? "Restore" : "Retire"), 1)
                        ]),
                        _: 2
                      }, 1032, ["disabled", "onClick"])) : v("", !0)
                    ], 2))), 128))
                  ])
                ])) : P.value[r.code] && !M(r.code) && !j.value[r.code] ? (e(), i("p", Ii, "No terms yet.")) : v("", !0),
                a("div", Ti, [
                  y(s(G), {
                    type: "button",
                    disabled: M(r.code) || !k.value[r.code],
                    onClick: (L) => se(r.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      y(s(le), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      b[3] || (b[3] = H(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  y(s(G), {
                    type: "button",
                    disabled: M(r.code) || !z.value[r.code],
                    onClick: (L) => se(r.code, z.value[r.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      y(s(le), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      b[4] || (b[4] = H(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                m.value ? (e(), i("div", Pi, [
                  y(s(Ge), {
                    modelValue: ae(r.code).label,
                    "onUpdate:modelValue": (L) => ae(r.code).label = L,
                    disabled: !f.value || M(r.code),
                    "aria-label": "Term name in English",
                    type: "text",
                    placeholder: "Term name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  y(s(Ge), {
                    modelValue: ae(r.code).code,
                    "onUpdate:modelValue": (L) => ae(r.code).code = L,
                    disabled: !f.value || M(r.code),
                    type: "text",
                    "aria-label": "Short term name",
                    placeholder: "Short name for imports",
                    class: "narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  r.hierarchical ? (e(), T(s(he), {
                    key: 0,
                    modelValue: ae(r.code).parent,
                    "onUpdate:modelValue": (L) => ae(r.code).parent = L,
                    disabled: !f.value || M(r.code),
                    class: "narrow",
                    "aria-label": "Parent term",
                    placeholder: "No parent",
                    options: W(r.code),
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "options"])) : v("", !0),
                  y(s(G), {
                    type: "button",
                    disabled: !f.value || M(r.code) || !u.test(ae(r.code).code),
                    onClick: (L) => K(r),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      y(s(le), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      b[5] || (b[5] = H(" Add term", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])) : v("", !0),
                y(Ue, {
                  class: "pim-ia-disclosure",
                  label: "Integration keys"
                }, {
                  default: w(() => [
                    (P.value[r.code] ?? []).length ? (e(), i("dl", qi, [
                      (e(!0), i(E, null, ee(P.value[r.code], (L) => (e(), i(E, {
                        key: L.code
                      }, [
                        a("dt", null, U(s(ze)(L)), 1),
                        a("dd", null, [
                          a("code", null, U(L.code), 1)
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
        }, 1032, ["title"]))), 128))
      ]),
      _: 2
    }, [
      m.value ? {
        name: "add",
        fn: w(() => [
          y(Ie, {
            label: "Vocabulary name",
            "from-name": "",
            action: "Add vocabulary",
            existing: c.value.map((r) => r.code),
            onAdd: C
          }, {
            default: w(() => [...b[6] || (b[6] = [
              a("span", { class: "muted small" }, "Select fields pick their values from a vocabulary's terms.", -1)
            ])]),
            _: 1
          }, 8, ["existing"])
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["count"]));
  }
}), Ni = { class: "pim-stack" }, zi = { class: "form pim-card-body pad pim-ia-action" }, Fi = { class: "muted small" }, Bi = { class: "muted small" }, Li = { class: "pim-aspect" }, Ei = { class: "pim-ia-action pim-family-fields" }, Mi = { class: "pim-fields" }, Wi = { class: "pim-f pim-w-full" }, Hi = { class: "pim-f-label" }, Ji = ["id"], Ki = { class: "pim-aspect" }, Gi = { class: "pim-stack tight" }, Yi = { class: "pim-level-head" }, Zi = { class: "pim-fields" }, Qi = { class: "pim-f pim-w-half" }, Xi = { class: "pim-f-label" }, en = ["id"], an = { class: "pim-f pim-w-half" }, ln = { class: "pim-f-label" }, tn = ["id"], sn = { class: "pim-aspect" }, nn = { class: "pim-stack tight" }, on = { class: "pim-level-head" }, dn = { class: "muted small" }, rn = { class: "pim-fields" }, un = { class: "pim-f-label" }, cn = ["id"], mn = { class: "pim-f pim-w-half" }, pn = { class: "pim-f-label" }, vn = ["id"], fn = { class: "pim-f pim-w-half" }, bn = { class: "pim-f-label" }, yn = ["id"], gn = /* @__PURE__ */ de({
  __name: "BuilderFamilies",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove", "fields"],
  setup(l, { emit: $ }) {
    const t = l, d = $, u = qe();
    function m(h, n) {
      return u + "-" + h.code + "-" + n;
    }
    const f = D(() => t.schema.access.admin), c = D(() => (t.draft.families ?? []).filter((h) => h.code !== "generic")), C = D(() => {
      const h = new Set(t.draft.plugins?.map((n) => n.use));
      return Object.entries(t.schema.attributes).filter(([, n]) => n.plugin && h.has(n.plugin));
    }), A = D(() => {
      const h = (t.draft.aspects ?? []).map((b) => b.namespace), n = [...new Set(C.value.map(([b]) => b.split(".")[0]))];
      return [...h, ...n.filter((b) => !h.includes(b))].map((b) => ({ value: b, label: B(b) }));
    }), N = D(() => new Map(t.options.types.map((h) => [h.id, h.form])));
    function X(h) {
      const [n, b] = h.split(".", 2);
      return b ? `${B(b)} (${B(n)})` : B(n);
    }
    const P = D(() => {
      const h = /* @__PURE__ */ new Map();
      function n(b, r, L = [], F = "one") {
        const Q = !!r && r !== "text" && r !== "record" && L.length === 0 && F === "one";
        h.set(b, { value: b, label: X(b), canBeAxis: Q });
      }
      for (const b of t.draft.aspects ?? [])
        for (const r of b.attributes ?? []) {
          const L = b.namespace + "." + r.code;
          n(L, N.value.get(r.type), r.scope, r.cardinality);
        }
      for (const [b, r] of C.value) n(b, r.form, r.scope, r.cardinality);
      return h;
    });
    function z(h) {
      return [...P.value.values()].filter((n) => h.aspects?.includes(n.value.split(".")[0]));
    }
    function k(h, n, b) {
      const r = n[b] ?? [], L = new Set(fe(h).flatMap((Q) => [...Q.axes ?? [], ...Q.own ?? []])), F = z(h).filter((Q) => r.includes(Q.value) || !L.has(Q.value) && (b === "own" || Q.canBeAxis));
      return [...F, ...r.filter((Q) => !F.some((ce) => ce.value === Q)).map((Q) => ({ value: Q, label: X(Q) }))];
    }
    const x = D(() => t.draft.channels ?? []);
    function o(h, n) {
      return x.value.filter((b) => (!b.families?.length || b.families.includes(h.code)) && (!n || b.requirements?.includes(n))).map((b) => B(b.id));
    }
    const j = D(() => t.draft.dimensions ?? []), I = J({});
    function M(h) {
      (t.draft.families ??= []).push({ code: h, aspects: [] }), I.value[h] = !0;
    }
    function se(h) {
      t.draft.families.splice(t.draft.families.indexOf(h), 1), t.schema.declaration.families?.some((n) => n.code === h.code) && d("remove", "families", h.code);
    }
    function fe(h) {
      return h.variation ?? [];
    }
    function ae(h) {
      (h.variation ??= []).push({ axes: [] });
    }
    function Z(h) {
      return h.requirements ?? [];
    }
    function W(h, n) {
      (h.requirements ??= []).push({ id: n, require: [] });
    }
    function S(h, n) {
      return h.context?.[n] ?? "";
    }
    function K(h, n, b) {
      const r = { ...h.context ?? {} };
      b ? r[n] = b : delete r[n], Object.keys(r).length ? h.context = r : delete h.context;
    }
    return (h, n) => (e(), i("div", Ni, [
      a("div", zi, [
        n[0] || (n[0] = a("div", null, [
          a("h3", null, "Product families"),
          a("p", null, "Choose what to collect, what varies between versions, and what products need before release.")
        ], -1)),
        f.value ? (e(), T(Ie, {
          key: 0,
          label: "Family name",
          action: "Add family",
          "from-name": "",
          existing: c.value.map((b) => b.code),
          onAdd: M
        }, null, 8, ["existing"])) : v("", !0)
      ]),
      y(Te, {
        count: c.value.length,
        columns: ["details"]
      }, {
        default: w(() => [
          (e(!0), i(E, null, ee(c.value, (b) => (e(), T(Pe, {
            key: b.code,
            open: I.value[b.code],
            "onUpdate:open": (r) => I.value[b.code] = r,
            title: s(B)(b.code)
          }, Re({
            details: w(() => [
              a("span", Fi, U(z(b).length) + " fields", 1),
              fe(b).length ? (e(), T(s(ye), {
                key: 0,
                severity: "secondary",
                value: fe(b).length + (fe(b).length === 1 ? " variant level" : " variant levels")
              }, null, 8, ["value"])) : v("", !0),
              a("span", Bi, U(o(b).join(", ") || "No release channels"), 1)
            ]),
            default: w(() => [
              a("div", Li, [
                a("div", Ei, [
                  a("div", Mi, [
                    a("div", Wi, [
                      a("div", Hi, [
                        a("label", {
                          id: m(b, "groups")
                        }, "Field groups", 8, Ji),
                        n[1] || (n[1] = a("span", { class: "pim-f-note" }, "the fields this family's products carry", -1))
                      ]),
                      y(_e, {
                        disabled: !f.value,
                        labelledby: m(b, "groups"),
                        "model-value": b.aspects ?? [],
                        options: A.value,
                        "onUpdate:modelValue": (r) => s(Fe)(b, "aspects", r)
                      }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                    ])
                  ]),
                  b.aspects?.length ? (e(), T(s(G), {
                    key: 0,
                    type: "button",
                    label: "View family fields",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (r) => d("fields", b.code)
                  }, null, 8, ["onClick"])) : v("", !0)
                ])
              ]),
              a("div", Ki, [
                n[5] || (n[5] = a("header", { class: "pim-aspect-head" }, [
                  a("h3", null, "Variants")
                ], -1)),
                n[6] || (n[6] = a("p", { class: "muted small pim-axis-help" }, "Choose what makes one variant different from another. Each field can be used once.", -1)),
                a("div", Gi, [
                  (e(!0), i(E, null, ee(fe(b), (r, L) => (e(), i("div", {
                    key: L,
                    class: "pim-level"
                  }, [
                    a("div", Yi, [
                      a("strong", null, "Level " + U(L + 1), 1),
                      f.value ? (e(), T(s(G), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove level",
                        onClick: (F) => fe(b).splice(L, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: w(() => [
                          y(s(le), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : v("", !0)
                    ]),
                    a("div", Zi, [
                      a("div", Qi, [
                        a("div", Xi, [
                          a("label", {
                            id: m(b, L + "-axes")
                          }, "Distinguish variants by", 8, en)
                        ]),
                        n[2] || (n[2] = a("p", { class: "muted small pim-axis-help" }, "Choose a single-value field with no dimensions. Text and record fields are excluded.", -1)),
                        y(_e, {
                          disabled: !f.value,
                          dropdown: "",
                          labelledby: m(b, L + "-axes"),
                          "model-value": r.axes ?? [],
                          options: k(b, r, "axes"),
                          placeholder: "Add an axis",
                          "onUpdate:modelValue": (F) => r.axes = F
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]),
                      a("div", an, [
                        a("div", ln, [
                          a("label", {
                            id: m(b, L + "-owned")
                          }, "Other fields edited here", 8, tn)
                        ]),
                        n[3] || (n[3] = a("p", { class: "muted small pim-axis-help" }, "Other fields you edit at this level.", -1)),
                        y(_e, {
                          disabled: !f.value,
                          dropdown: "",
                          labelledby: m(b, L + "-owned"),
                          "model-value": r.own ?? [],
                          options: k(b, r, "own"),
                          placeholder: "Add a field",
                          "onUpdate:modelValue": (F) => F.length ? r.own = F : delete r.own
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  f.value ? (e(), T(s(G), {
                    key: 0,
                    type: "button",
                    onClick: (r) => ae(b),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: w(() => [
                      y(s(le), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      n[4] || (n[4] = H(" Add level", -1))
                    ]),
                    _: 1
                  }, 8, ["onClick"])) : v("", !0)
                ])
              ]),
              a("div", sn, [
                n[10] || (n[10] = a("header", { class: "pim-aspect-head" }, [
                  a("h3", null, "Release requirements"),
                  a("span", { class: "muted small" }, "what a channel needs before a product is ready")
                ], -1)),
                a("div", nn, [
                  (e(!0), i(E, null, ee(Z(b), (r, L) => (e(), i("div", {
                    key: r.id,
                    class: "pim-level"
                  }, [
                    a("div", on, [
                      a("div", null, [
                        a("strong", null, U(s(B)(r.id)), 1),
                        a("p", dn, U(o(b, r.id).join(", ") || "Unused by channels"), 1)
                      ]),
                      f.value ? (e(), T(s(G), {
                        key: 0,
                        type: "button",
                        "aria-label": "Remove requirement",
                        onClick: (F) => Z(b).splice(L, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: w(() => [
                          y(s(le), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : v("", !0)
                    ]),
                    a("div", rn, [
                      (e(!0), i(E, null, ee(j.value, (F) => (e(), i("div", {
                        key: F.name,
                        class: "pim-f pim-w-third"
                      }, [
                        a("div", un, [
                          a("label", {
                            id: m(b, r.id + "-context-" + F.name)
                          }, U(s(B)(F.name)), 9, cn),
                          n[7] || (n[7] = a("span", { class: "pim-f-note" }, "context", -1))
                        ]),
                        y(s(he), {
                          disabled: !f.value,
                          "aria-labelledby": m(b, r.id + "-context-" + F.name),
                          "model-value": S(r, F.name),
                          "onUpdate:modelValue": (Q) => K(r, F.name, Q),
                          options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ...F.members.map((Q) => ({ value: Q, label: String(Q) }))],
                          "option-label": "label",
                          "option-value": "value",
                          appendTo: "self"
                        }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue", "options"])
                      ]))), 128)),
                      a("div", mn, [
                        a("div", pn, [
                          a("label", {
                            id: m(b, r.id + "-required")
                          }, "Required", 8, vn),
                          n[8] || (n[8] = a("span", { class: "pim-f-note" }, "must hold a value", -1))
                        ]),
                        y(_e, {
                          disabled: !f.value,
                          dropdown: "",
                          labelledby: m(b, r.id + "-required"),
                          "model-value": r.require ?? [],
                          placeholder: "Add a required field",
                          options: z(b),
                          "onUpdate:modelValue": (F) => s(Fe)(r, "require", F)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ]),
                      a("div", fn, [
                        a("div", bn, [
                          a("label", {
                            id: m(b, r.id + "-authored")
                          }, "Entered for this context", 8, yn),
                          n[9] || (n[9] = a("span", { class: "pim-f-note" }, "must be set in the context itself, not by fallback", -1))
                        ]),
                        y(_e, {
                          disabled: !f.value,
                          dropdown: "",
                          labelledby: m(b, r.id + "-authored"),
                          "model-value": r.authored ?? [],
                          placeholder: "Add a field to author",
                          options: z(b),
                          "onUpdate:modelValue": (F) => s(Fe)(r, "authored", F)
                        }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                      ])
                    ])
                  ]))), 128)),
                  f.value ? (e(), T(Ie, {
                    key: 0,
                    label: "Requirement name",
                    action: "Add requirement",
                    "from-name": "",
                    existing: Z(b).map((r) => r.id),
                    onAdd: (r) => W(b, r)
                  }, null, 8, ["existing", "onAdd"])) : v("", !0)
                ])
              ])
            ]),
            _: 2
          }, [
            f.value ? {
              name: "actions",
              fn: w(() => [
                y(s(G), {
                  type: "button",
                  onClick: (r) => se(b),
                  "aria-label": "Remove " + s(B)(b.code),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    y(s(le), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["onClick", "aria-label"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["open", "onUpdate:open", "title"]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), hn = ["inert"], kn = {
  key: 0,
  class: "row wrap"
}, _n = {
  key: 2,
  class: "small muted"
}, wn = { class: "pim-principal-service" }, $n = /* @__PURE__ */ de({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(l, { emit: $ }) {
    const t = l, d = $, u = J(!1), m = J(""), f = J({});
    let c = 0;
    pe(() => t.modelValue, async (P) => {
      const z = ++c;
      try {
        const k = await Ea(t.catalogId ?? "", P);
        z === c && (f.value = k);
      } catch {
        z === c && (f.value = {});
      }
    }, { immediate: !0, deep: !0 }), Ye(() => {
      c++;
    });
    function C(P) {
      return f.value[P] ?? ne(P, "Person");
    }
    Fa(async () => {
      try {
        await Ul("wc-principal-picker"), u.value = !0;
      } catch {
        u.value = !1;
      }
    });
    function A(P) {
      t.disabled || !P.trim() || t.modelValue.includes(P.trim()) || (d("update:modelValue", [...t.modelValue, P.trim()]), m.value = "");
    }
    function N(P) {
      const z = P.detail;
      if (!z || typeof z != "object") return;
      const k = z, x = k.principal_id ?? k.id;
      typeof x == "string" && A(x);
    }
    function X(P) {
      t.disabled || d("update:modelValue", t.modelValue.filter((z) => z !== P));
    }
    return (P, z) => (e(), i("div", {
      class: "pim-principal-list",
      inert: l.disabled || void 0
    }, [
      l.modelValue.length ? (e(), i("div", kn, [
        (e(!0), i(E, null, ee(l.modelValue, (k) => (e(), T(s(ye), {
          key: k,
          severity: "secondary"
        }, {
          default: w(() => [
            a("span", null, U(C(k)), 1),
            y(s(G), {
              text: "",
              size: "small",
              disabled: l.disabled,
              "aria-label": "Remove " + C(k),
              onClick: (x) => X(k)
            }, {
              default: w(() => [
                y(s(le), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : v("", !0),
      u.value ? (e(), i("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: Ae(N, ["stop"])
      }, null, 32)) : (e(), i("span", _n, "The person picker is unavailable.")),
      a("label", wn, [
        z[3] || (z[3] = a("span", { class: "small muted" }, "Service account", -1)),
        y(s(Ge), {
          modelValue: m.value,
          "onUpdate:modelValue": z[0] || (z[0] = (k) => m.value = k),
          disabled: l.disabled,
          placeholder: "Service principal id",
          onKeydown: z[1] || (z[1] = wa(Ae((k) => A(m.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "disabled"])
      ]),
      y(s(G), {
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: l.disabled || !m.value.trim(),
        onClick: z[2] || (z[2] = (k) => A(m.value))
      }, {
        default: w(() => [
          y(s(le), { icon: "tabler:plus" }),
          z[4] || (z[4] = H(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, hn));
  }
}), Cn = { class: "pim-stack" }, xn = { class: "muted small" }, Vn = { class: "muted small" }, Un = { class: "pim-fields" }, An = { class: "pim-f pim-w-half" }, jn = { class: "pim-f-label" }, Sn = ["id"], Rn = { class: "pim-f pim-w-half" }, On = { class: "pim-f-label" }, In = ["id"], Tn = { class: "muted small" }, Pn = { class: "pim-fields" }, qn = { class: "pim-f pim-w-third" }, Dn = { class: "pim-f-label" }, Nn = ["id"], zn = { class: "pim-f pim-w-third" }, Fn = { class: "pim-f-label" }, Bn = ["for"], Ln = { class: "row" }, En = ["aria-labelledby"], Mn = { class: "pim-f-label" }, Wn = ["id"], Hn = { key: 1 }, Jn = { class: "pim-f pim-w-full" }, Kn = { class: "pim-f-label" }, Gn = ["id"], Yn = /* @__PURE__ */ de({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {},
    view: {}
  },
  emits: ["remove"],
  setup(l, { emit: $ }) {
    const t = l, d = $, u = qe();
    function m(o, j) {
      return u + "-" + o + "-" + j;
    }
    const f = D(() => t.schema.access.admin), c = D(() => t.draft.channels ?? []), C = D(() => t.draft.sources ?? []), A = D(() => [...new Set((t.draft.families ?? []).flatMap((o) => (o.requirements ?? []).map((j) => j.id)))].map((o) => ({ value: o, label: B(o) }))), N = D(() => (t.draft.families ?? []).filter((o) => o.code !== "generic").map((o) => ({ value: o.code, label: B(o.code) }))), X = D(() => (t.draft.aspects ?? []).map((o) => ({ value: o.namespace, label: B(o.namespace) })));
    function P(o) {
      (t.draft.channels ??= []).push({ id: o, requirements: [] });
    }
    function z(o) {
      c.value.splice(c.value.indexOf(o), 1), t.schema.declaration.channels?.some((j) => j.id === o.id) && d("remove", "channels", o.id);
    }
    function k(o) {
      (t.draft.sources ??= []).push({ id: o, ordering: "none", writes: [] });
    }
    function x(o) {
      C.value.splice(C.value.indexOf(o), 1), t.schema.declaration.sources?.some((j) => j.id === o.id) && d("remove", "sources", o.id);
    }
    return (o, j) => (e(), i("div", Cn, [
      l.view !== "sources" ? (e(), T(Te, {
        key: 0,
        count: c.value.length,
        columns: ["details"]
      }, {
        head: w(() => [
          j[0] || (j[0] = a("header", { class: "pim-bsection-head pim-ia-group-head" }, [
            a("div", null, [
              a("h3", null, "Release destinations"),
              a("p", { class: "muted small" }, "Choose which families can be released to each destination and what those products need first.")
            ])
          ], -1)),
          f.value ? (e(), T(Ie, {
            key: 0,
            label: "Channel name",
            action: "Add channel",
            "from-name": "",
            existing: c.value.map((I) => I.id),
            onAdd: P
          }, null, 8, ["existing"])) : v("", !0)
        ]),
        default: w(() => [
          (e(!0), i(E, null, ee(c.value, (I) => (e(), T(Pe, {
            key: I.id,
            title: s(B)(I.id)
          }, Re({
            details: w(() => [
              a("span", xn, U(I.families?.length ? I.families.map(s(B)).join(", ") : "All families"), 1),
              a("span", Vn, U(I.requirements?.length ? I.requirements.map(s(B)).join(", ") : "No release requirements"), 1)
            ]),
            default: w(() => [
              a("div", Un, [
                a("div", An, [
                  a("div", jn, [
                    a("label", {
                      id: m(I.id, "requirements")
                    }, "Release requirements", 8, Sn),
                    j[1] || (j[1] = a("span", { class: "pim-f-note" }, "a product is ready for the channel when these hold", -1))
                  ]),
                  y(_e, {
                    disabled: !f.value,
                    labelledby: m(I.id, "requirements"),
                    "model-value": I.requirements ?? [],
                    options: A.value,
                    "onUpdate:modelValue": (M) => s(Fe)(I, "requirements", M)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ]),
                a("div", Rn, [
                  a("div", On, [
                    a("label", {
                      id: m(I.id, "families")
                    }, "Families", 8, In),
                    j[2] || (j[2] = a("span", { class: "pim-f-note" }, "empty means every family", -1))
                  ]),
                  y(_e, {
                    disabled: !f.value,
                    labelledby: m(I.id, "families"),
                    "model-value": I.families ?? [],
                    options: N.value,
                    "onUpdate:modelValue": (M) => s(Fe)(I, "families", M)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            f.value ? {
              name: "actions",
              fn: w(() => [
                y(s(G), {
                  type: "button",
                  onClick: (M) => z(I),
                  "aria-label": "Remove " + s(B)(I.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    y(s(le), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["onClick", "aria-label"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["title"]))), 128))
        ]),
        _: 1
      }, 8, ["count"])) : v("", !0),
      l.view !== "channels" ? (e(), T(Te, {
        key: 1,
        count: C.value.length,
        columns: ["details"]
      }, {
        head: w(() => [
          j[3] || (j[3] = a("header", { class: "pim-bsection-head pim-ia-group-head" }, [
            a("div", null, [
              a("h3", null, "Data sources"),
              a("p", { class: "muted small" }, "Control who can send updates and which fields each source can change.")
            ])
          ], -1)),
          f.value ? (e(), T(Ie, {
            key: 0,
            label: "Source name",
            action: "Add source",
            "from-name": "",
            existing: C.value.map((I) => I.id),
            onAdd: k
          }, null, 8, ["existing"])) : v("", !0)
        ]),
        default: w(() => [
          (e(!0), i(E, null, ee(C.value, (I) => (e(), T(Pe, {
            key: I.id,
            title: s(B)(I.id)
          }, Re({
            details: w(() => [
              a("span", Tn, U(I.writes?.length ? I.writes.map(s(B)).join(", ") : "No field groups selected"), 1)
            ]),
            default: w(() => [
              a("div", Pn, [
                a("div", qn, [
                  a("div", Dn, [
                    a("label", {
                      id: m(I.id, "ordering")
                    }, "Handle incoming updates", 8, Nn),
                    j[4] || (j[4] = a("span", { class: "pim-f-note" }, "sequence keeps late deliveries from winning", -1))
                  ]),
                  y(s(he), {
                    disabled: !f.value,
                    "aria-labelledby": m(I.id, "ordering"),
                    "model-value": I.ordering ?? "none",
                    "onUpdate:modelValue": (M) => I.ordering = M,
                    options: [{ value: "none", label: "Use arrival order" }, { value: "sequence", label: "Use the source’s sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["disabled", "aria-labelledby", "model-value", "onUpdate:modelValue"])
                ]),
                a("div", zn, [
                  a("div", Fn, [
                    a("label", {
                      for: m(I.id, "audit")
                    }, "Audit", 8, Bn),
                    j[5] || (j[5] = a("span", { class: "pim-f-note" }, "record each value change", -1))
                  ]),
                  a("div", Ln, [
                    y(s(la), {
                      disabled: !f.value,
                      "input-id": m(I.id, "audit"),
                      "model-value": I.audit !== !1,
                      "onUpdate:modelValue": (M) => M ? delete I.audit : I.audit = !1
                    }, null, 8, ["disabled", "input-id", "model-value", "onUpdate:modelValue"]),
                    a("span", null, U(I.audit === !1 ? "Off for this source" : "Follow catalog audit settings"), 1)
                  ])
                ]),
                a("div", {
                  class: "pim-f pim-w-third",
                  role: "group",
                  "aria-labelledby": m(I.id, "people")
                }, [
                  a("div", Mn, [
                    a("label", {
                      id: m(I.id, "people")
                    }, "People and service accounts", 8, Wn),
                    j[6] || (j[6] = a("span", { class: "pim-f-note" }, "who may write as this source", -1))
                  ]),
                  f.value ? (e(), T($n, {
                    key: 0,
                    "catalog-id": l.catalogId,
                    "model-value": I.principals ?? [],
                    "onUpdate:modelValue": (M) => s(Fe)(I, "principals", M)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])) : (e(), i("span", Hn, U(I.principals?.length ? I.principals.length + (I.principals.length === 1 ? " allowed account" : " allowed accounts") : "No accounts specified"), 1))
                ], 8, En),
                a("div", Jn, [
                  a("div", Kn, [
                    a("label", {
                      id: m(I.id, "writes")
                    }, "Field groups it can update", 8, Gn),
                    j[7] || (j[7] = a("span", { class: "pim-f-note" }, "field groups this source may set", -1))
                  ]),
                  y(_e, {
                    disabled: !f.value,
                    labelledby: m(I.id, "writes"),
                    "model-value": I.writes ?? [],
                    options: X.value,
                    "onUpdate:modelValue": (M) => s(Fe)(I, "writes", M)
                  }, null, 8, ["disabled", "labelledby", "model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, [
            f.value ? {
              name: "actions",
              fn: w(() => [
                y(s(G), {
                  type: "button",
                  onClick: (M) => x(I),
                  "aria-label": "Remove " + s(B)(I.id),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: w(() => [
                    y(s(le), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["onClick", "aria-label"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["title"]))), 128))
        ]),
        _: 1
      }, 8, ["count"])) : v("", !0)
    ]));
  }
}), Zn = {
  failed: { label: "Setup failed", severity: "danger" },
  paused: { label: "Background update paused", severity: "warn" },
  degraded: { label: "Degraded", severity: "warn" },
  catchingUp: { label: "Catching up", severity: "info" },
  config: { label: "Configuration needed", severity: "warn" },
  reset: { label: "Reset required", severity: "warn" },
  uninstalled: { label: "Uninstalled · still referenced", severity: "warn" },
  pending: { label: "Setting up", severity: "info" }
};
function Wa(l, $) {
  return !l.parked && (l.bootstrapping || l.last_seq < $);
}
function Qn(l, $) {
  return !l.active || !l.installed || l.problem || l.lifecycle.state === "failed" ? !1 : l.lifecycle.state === "pending" || Object.values(l.projections).some((t) => Wa(t, $));
}
function Ha(l, $) {
  const t = l.problem ?? l.lifecycle.error, d = Object.entries(l.projections), u = d.find(([, f]) => f.parked) ?? d.find(([, f]) => f.error) ?? d.find(([, f]) => Wa(f, $));
  let m;
  return l.active && !l.installed ? m = "uninstalled" : t?.code === "plugin_config_invalid" ? m = "config" : t?.code === "plugin_projection_history_pruned" ? m = "reset" : t || l.lifecycle.state === "failed" ? m = "failed" : l.active && u?.[1].parked ? m = "paused" : l.active && u?.[1].error ? m = "degraded" : l.active && u ? m = "catchingUp" : l.active && l.lifecycle.state === "pending" && (m = "pending"), m ? { kind: m, ...Zn[m], error: t, projection: u } : void 0;
}
function Xn(l) {
  return (l.problem ?? l.lifecycle.error)?.code === "plugin_interface_version_unsupported";
}
const eo = { class: "pim-stack" }, ao = { class: "pim-bsection-head" }, lo = { class: "muted small" }, to = {
  key: 0,
  class: "pim-aspect muted"
}, so = {
  key: 0,
  class: "muted small"
}, io = { class: "pim-stack pim-plugin-recovery" }, no = {
  key: 0,
  class: "muted small"
}, oo = {
  key: 1,
  class: "muted small"
}, ro = { key: 0 }, uo = { key: 1 }, co = { key: 0 }, mo = { key: 0 }, po = { key: 0 }, vo = { key: 1 }, fo = { key: 2 }, bo = { key: 3 }, yo = { key: 0 }, go = {
  key: 0,
  class: "pim-ia-action"
}, ho = {
  key: 0,
  class: "pim-ia-dialog"
}, ko = { class: "pim-ia-dialog-head" }, _o = { key: 1 }, wo = { key: 2 }, $o = { class: "row pim-ia-dialog-actions" }, Co = {
  key: 0,
  class: "pim-aspect muted"
}, xo = { class: "row wrap muted small" }, Vo = /* @__PURE__ */ de({
  __name: "BuilderPlugins",
  props: {
    draft: {},
    schema: {},
    options: {},
    pluginConfigs: { default: () => ({}) },
    stale: { type: Boolean }
  },
  emits: ["remove", "configure", "reset", "resume", "refresh", "review", "clearShellBinding"],
  setup(l, { emit: $ }) {
    const t = l, d = $, u = /* @__PURE__ */ new Map([
      ["eq", "Equals"],
      ["in", "Is one of"],
      ["gt", "Greater than"],
      ["gte", "At least"],
      ["lt", "Less than"],
      ["lte", "At most"]
    ]), m = J({}), f = J(), c = D(() => k.value.find((W) => W.plugin.plugin === f.value)), C = D(() => c.value?.plugin), A = D(() => t.options.plugins.filter((W) => W.installed).length), N = D(() => t.schema.access.admin), X = D(() => t.draft.plugins ?? []), P = D(() => new Map(t.schema.plugins.map((W) => [W.plugin, W]))), z = D(() => {
      const W = /* @__PURE__ */ new Map();
      for (const [S, K] of Object.entries(t.schema.attributes)) {
        if (!K.plugin) continue;
        const h = W.get(K.plugin) ?? [];
        h.push(B(S)), W.set(K.plugin, h);
      }
      return W;
    }), k = D(() => t.options.plugins.map((W) => {
      const S = P.value.get(W.plugin) ?? W, K = Ha(S, t.schema.as_of), h = X.value.some((n) => n.use === S.plugin);
      return {
        option: W,
        plugin: S,
        status: K,
        chosen: h,
        title: ne(S.title ?? W.title, S.installed ? "Plugin" : "Unavailable plugin"),
        label: !S.active && K?.kind === "failed" ? "Unavailable" : K?.label ?? (h ? S.active ? "Enabled" : "Will enable on apply" : S.active ? "Will disable on apply" : "Disabled"),
        severity: K?.severity ?? (h ? "success" : "secondary")
      };
    }));
    function x(W, S) {
      const K = S.map((h) => u.get(h)).filter(Boolean);
      return [B(W), K.join(", ")].filter(Boolean).join(" · ");
    }
    function o(W, S) {
      S && !X.value.some((K) => K.use === W) && (t.draft.plugins ??= []).push({ use: W }), S || (t.draft.plugins = X.value.filter((K) => K.use !== W), delete t.pluginConfigs[W], P.value.get(W)?.active && d("remove", "plugins", W));
    }
    function j(W, S) {
      m.value[W] = !0, t.pluginConfigs[W] = S;
    }
    function I(W, S) {
      const K = W.config_schema.properties;
      return ne(K?.[S]?.title ?? B(S), "this setting");
    }
    const M = D(() => t.draft.scopes ?? []);
    function se(W) {
      return M.value.includes(W.id);
    }
    function fe(W, S) {
      S && !se(W) && (t.draft.scopes ??= []).push(W.id), !S && se(W) && (M.value.splice(M.value.indexOf(W.id), 1), t.schema.declaration.scopes?.includes(W.id) && d("remove", "scopes", W.id));
    }
    const ae = D(() => {
      const W = C.value;
      if (!W) return [];
      const S = W.references;
      return [
        { label: "Fields", items: (S?.fields ?? Object.entries(t.schema.attributes).filter(([, h]) => h.plugin === W.plugin).map(([h]) => h)).map((h) => ({ id: h, title: ne(B(h), "Field") })) },
        { label: "Product filter sets", items: (S?.scopes ?? []).map((h) => ({
          id: h,
          title: ne(t.options.scopes.find((n) => n.id === h)?.title, "Unavailable filter set")
        })) },
        { label: "Catalog app binding", items: (S?.shell_bindings ?? []).map((h) => ({ id: h, title: "Catalog app" })) },
        { label: "Readiness checks", items: (S?.checks ?? []).map((h) => ({ id: h, title: "Readiness check" })) },
        { label: "Dependent plugins", items: (S?.plugins ?? []).map((h) => ({
          id: h,
          title: ne(P.value.get(h)?.title, "Dependent plugin")
        })) }
      ].filter((h) => h.items.length);
    });
    function Z(W) {
      for (const S of W.references?.scopes ?? [])
        M.value.includes(S) && (t.draft.scopes = M.value.filter((K) => K !== S), d("remove", "scopes", S));
      f.value = void 0, o(W.plugin, !1), d("review");
    }
    return (W, S) => (e(), i("div", eo, [
      y(Te, {
        count: k.value.length,
        columns: ["details"]
      }, {
        head: w(() => [
          a("header", ao, [
            S[6] || (S[6] = a("h3", null, "Plugins", -1)),
            a("span", lo, U(A.value) + " installed", 1)
          ])
        ]),
        default: w(() => [
          k.value.length === 0 ? (e(), i("div", to, "No plugin is installed.")) : v("", !0),
          (e(!0), i(E, null, ee(k.value, ({ option: K, plugin: h, status: n, chosen: b, title: r, label: L, severity: F }) => (e(), T(Pe, {
            key: h.plugin,
            title: r,
            open: m.value[h.plugin] ?? !!(h.active && n && n.kind !== "pending"),
            "onUpdate:open": (Q) => m.value[h.plugin] = Q
          }, Re({
            details: w(() => [
              y(s(ye), {
                severity: F,
                value: L
              }, null, 8, ["severity", "value"]),
              !n && K.description ? (e(), i("span", so, U(s(ne)(K.description, "Adds capabilities to this catalog.")), 1)) : v("", !0)
            ]),
            default: w(() => [
              a("div", io, [
                z.value.get(h.plugin)?.length ? (e(), i("p", no, " Adds fields for " + U(z.value.get(h.plugin)?.join(", ")) + ". ", 1)) : v("", !0),
                h.active && n?.kind === "failed" && n.projection?.[1].parked ? (e(), i("p", oo, " Background update: Paused ")) : v("", !0),
                n?.kind === "failed" ? (e(), i(E, { key: 2 }, [
                  y(s(we), {
                    severity: "warn",
                    role: "alert"
                  }, {
                    default: w(() => [
                      s(Xn)(h) ? (e(), i(E, { key: 0 }, [
                        H("This package uses a plugin interface this deployment cannot run. Restore a compatible package to use this plugin.")
                      ], 64)) : (e(), i(E, { key: 1 }, [
                        H("The catalog could not set up this plugin. Check the status after resolving the setup problem.")
                      ], 64))
                    ]),
                    _: 2
                  }, 1024),
                  y(Ue, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: w(() => [
                      a("p", null, [
                        S[7] || (S[7] = H("Plugin ", -1)),
                        a("code", null, U(h.plugin), 1)
                      ]),
                      n.error?.message ? (e(), i("p", ro, U(n.error.message), 1)) : v("", !0),
                      n.error?.code ? (e(), i("p", uo, [
                        a("code", null, U(n.error.code), 1)
                      ])) : v("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  N.value && h.references ? (e(), T(s(G), {
                    key: 0,
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (Q) => f.value = h.plugin
                  }, null, 8, ["onClick"])) : (e(), T(s(G), {
                    key: 1,
                    label: "Check status",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: S[0] || (S[0] = (Q) => d("refresh"))
                  }))
                ], 64)) : n?.kind === "reset" ? (e(), i(E, { key: 3 }, [
                  y(s(we), { severity: "warn" }, {
                    default: w(() => [
                      S[8] || (S[8] = H(" The event history this background update needs was removed. ", -1)),
                      n.error?.max_pruned_seq !== void 0 ? (e(), i("p", co, "Earliest retained position " + U(n.error.max_pruned_seq + 1) + ".", 1)) : v("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  y(Ue, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: w(() => [
                      a("p", null, [
                        S[9] || (S[9] = H("Plugin ", -1)),
                        a("code", null, U(h.plugin), 1)
                      ]),
                      n.error?.projection ? (e(), i("p", mo, [
                        S[10] || (S[10] = H("Background update ", -1)),
                        a("code", null, U(n.error.projection), 1)
                      ])) : v("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  N.value ? (e(), T(s(G), {
                    key: 0,
                    label: "Reset background updates",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: l.stale,
                    onClick: (Q) => d("reset", h.plugin)
                  }, null, 8, ["disabled", "onClick"])) : v("", !0)
                ], 64)) : n?.projection && (n.kind === "paused" || n.kind === "degraded" || n.kind === "catchingUp") ? (e(), i(E, { key: 4 }, [
                  y(s(we), {
                    severity: n.kind === "catchingUp" ? "info" : "warn"
                  }, {
                    default: w(() => [
                      n.projection[1].status === "paused" ? (e(), i("p", po, "This update was paused.")) : n.kind === "paused" ? (e(), i("p", vo, "The background worker stopped.")) : n.kind === "degraded" ? (e(), i("p", fo, "The background worker reported an error.")) : (e(), i("p", bo, "This update is processing catalog changes.")),
                      a("p", null, "Last applied position " + U(n.projection[1].last_seq) + ".", 1)
                    ]),
                    _: 2
                  }, 1032, ["severity"]),
                  y(Ue, {
                    class: "small pim-error-code pim-ia-disclosure",
                    label: "Technical details"
                  }, {
                    default: w(() => [
                      a("p", null, [
                        S[11] || (S[11] = H("Background update ", -1)),
                        a("code", null, U(n.projection[0]), 1)
                      ]),
                      n.projection[1].error ? (e(), i("p", yo, U(n.projection[1].error), 1)) : v("", !0)
                    ]),
                    _: 2
                  }, 1024),
                  N.value && n.projection[1].status === "paused" && n.projection[1].cursor_id ? (e(), T(s(G), {
                    key: 0,
                    label: "Resume background update",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: l.stale,
                    onClick: (Q) => d("resume", n.projection[1].cursor_id)
                  }, null, 8, ["disabled", "onClick"])) : n.kind === "paused" && N.value ? (e(), T(s(G), {
                    key: 1,
                    label: "Reset background updates",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: l.stale,
                    onClick: (Q) => d("reset", h.plugin)
                  }, null, 8, ["disabled", "onClick"])) : (e(), T(s(G), {
                    key: 2,
                    label: "Check status",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: S[1] || (S[1] = (Q) => d("refresh"))
                  }))
                ], 64)) : n?.kind === "uninstalled" ? (e(), i(E, { key: 5 }, [
                  y(s(we), { severity: "warn" }, {
                    default: w(() => [...S[12] || (S[12] = [
                      H("The package was removed while it was still enabled for this catalog.", -1)
                    ])]),
                    _: 1
                  }),
                  y(s(G), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: (Q) => f.value = h.plugin
                  }, null, 8, ["onClick"])
                ], 64)) : b ? (e(), i(E, { key: 6 }, [
                  y(Ca, {
                    disabled: !N.value,
                    schema: K.config_schema,
                    "model-value": l.pluginConfigs[h.plugin] ?? h.config ?? {},
                    problem: n?.kind === "config" ? n.error : void 0,
                    "plugin-id": n?.kind === "config" ? h.plugin : void 0,
                    "problem-label": n?.error?.field && n.error.field !== "config" ? I(K, n.error.field) : void 0,
                    "onUpdate:modelValue": (Q) => j(h.plugin, Q)
                  }, null, 8, ["disabled", "schema", "model-value", "problem", "plugin-id", "problem-label", "onUpdate:modelValue"]),
                  N.value && h.active && (l.pluginConfigs[h.plugin] || n?.kind === "config") ? (e(), i("div", go, [
                    y(s(G), {
                      disabled: l.stale || !l.pluginConfigs[h.plugin],
                      label: "Save configuration",
                      size: "small",
                      onClick: (Q) => d("configure", h.plugin, l.pluginConfigs[h.plugin])
                    }, null, 8, ["disabled", "onClick"])
                  ])) : v("", !0)
                ], 64)) : v("", !0)
              ])
            ]),
            _: 2
          }, [
            N.value && h.installed && (!n || n.kind === "pending") ? {
              name: "actions",
              fn: w(() => [
                y(s(la), {
                  "aria-label": "Enable " + r,
                  "model-value": b,
                  "onUpdate:modelValue": (Q) => o(h.plugin, Q)
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["title", "open", "onUpdate:open"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      y(ya, {
        visible: !!C.value,
        label: "Plugin references",
        onClose: S[5] || (S[5] = (K) => f.value = void 0)
      }, {
        default: w(() => [
          c.value && C.value ? (e(), i("section", ho, [
            a("header", ko, [
              a("div", null, [
                S[13] || (S[13] = a("h2", null, "Plugin references", -1)),
                a("p", null, U(c.value.title), 1)
              ])
            ]),
            ae.value.length ? (e(), i(E, { key: 0 }, [
              S[14] || (S[14] = a("p", null, "Replace or remove these references before deactivating the plugin. You can also restore the package to keep using them.", -1)),
              (e(!0), i(E, null, ee(ae.value, (K) => (e(), i("div", {
                key: K.label
              }, [
                a("h3", null, U(K.label), 1),
                a("ul", null, [
                  (e(!0), i(E, null, ee(K.items, (h) => (e(), i("li", {
                    key: h.id
                  }, U(h.title), 1))), 128))
                ])
              ]))), 128))
            ], 64)) : (e(), i("p", _o, "Use the catalog review to see what deactivating this plugin would change.")),
            C.value.references?.scopes.length && !C.value.references?.shell_bindings.length ? (e(), i("p", wo, "Reviewing removal also includes these product filter sets.")) : v("", !0),
            y(Ue, {
              class: "small pim-error-code pim-ia-disclosure",
              label: "Technical details"
            }, {
              default: w(() => [
                a("p", null, [
                  S[15] || (S[15] = H("Plugin ", -1)),
                  a("code", null, U(C.value.plugin), 1)
                ]),
                (e(!0), i(E, null, ee(ae.value, (K) => (e(), i("div", {
                  key: K.label
                }, [
                  a("p", null, U(K.label), 1),
                  a("ul", null, [
                    (e(!0), i(E, null, ee(K.items, (h) => (e(), i("li", {
                      key: h.id
                    }, [
                      a("code", null, U(h.id), 1)
                    ]))), 128))
                  ])
                ]))), 128))
              ]),
              _: 1
            }),
            a("div", $o, [
              N.value && C.value.references?.shell_bindings.length ? (e(), T(s(G), {
                key: 0,
                label: "Clear catalog app binding",
                severity: "secondary",
                outlined: "",
                disabled: l.stale,
                onClick: S[2] || (S[2] = (K) => d("clearShellBinding", C.value.references.shell_bindings[0]))
              }, null, 8, ["disabled"])) : N.value ? (e(), T(s(G), {
                key: 1,
                label: "Review removal",
                disabled: l.stale,
                onClick: S[3] || (S[3] = (K) => Z(C.value))
              }, null, 8, ["disabled"])) : v("", !0),
              y(s(G), {
                label: "Close",
                severity: "secondary",
                outlined: "",
                onClick: S[4] || (S[4] = (K) => f.value = void 0)
              })
            ])
          ])) : v("", !0)
        ]),
        _: 1
      }, 8, ["visible"]),
      y(Te, {
        count: l.options.scopes.length,
        columns: ["details"]
      }, {
        head: w(() => [...S[16] || (S[16] = [
          a("header", { class: "pim-bsection-head" }, [
            a("h3", null, "Product filter sets"),
            a("span", { class: "muted small" }, "Choose additional ways to filter products.")
          ], -1)
        ])]),
        default: w(() => [
          l.options.scopes.length === 0 ? (e(), i("div", Co, "No product filter sets are available.")) : v("", !0),
          (e(!0), i(E, null, ee(l.options.scopes, (K) => (e(), T(Pe, {
            key: K.id,
            title: s(ne)(K.title, "Filter set")
          }, Re({
            details: w(() => [
              y(s(ye), {
                severity: se(K) ? "success" : "secondary",
                value: se(K) ? "Selected" : "Available"
              }, null, 8, ["severity", "value"])
            ]),
            default: w(() => [
              a("div", xo, [
                S[17] || (S[17] = a("span", null, "Filters", -1)),
                (e(!0), i(E, null, ee(K.filters, (h, n) => (e(), T(s(ye), {
                  key: n,
                  class: "kx-tag-sm small",
                  severity: "secondary",
                  value: x(n, h.ops)
                }, null, 8, ["value"]))), 128)),
                a("span", null, U(s(B)(K.access)) + " access required", 1)
              ])
            ]),
            _: 2
          }, [
            N.value ? {
              name: "actions",
              fn: w(() => [
                y(s(la), {
                  "aria-label": "Use " + s(ne)(K.title, "Filter set"),
                  "model-value": se(K),
                  "onUpdate:modelValue": (h) => fe(K, h)
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
async function Uo(l) {
  const $ = await cl(`/api/v1/pim-admin/catalogs/${encodeURIComponent(l)}/policy_defaults`, "policy defaults");
  if ($.audit !== "fields" && $.audit !== "off" || !["audit_days", "trash_days", "tombstone_days"].every((t) => typeof $[t] == "number" && Number.isSafeInteger($[t])))
    throw new Error("Policy defaults are unavailable.");
  for (const [t, d] of Object.entries(Ja)) {
    const u = $[t];
    if (typeof u != "number" || !Number.isSafeInteger(u) || u < d.min || u > d.max) throw new Error(`Policy ${t} is unavailable.`);
  }
  return $;
}
const Ja = {
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
}, Ao = { class: "form" }, jo = {
  key: 0,
  class: "muted small pim-policy-intro"
}, So = {
  key: 1,
  class: "muted small pim-policy-status",
  role: "status"
}, Ro = {
  key: 0,
  class: "pim-bsection-head"
}, Oo = { class: "pim-policy-copy" }, Io = ["for"], To = ["id"], Po = { key: 0 }, qo = {
  key: 0,
  class: "pim-policy-value"
}, Do = {
  key: 0,
  class: "muted small"
}, No = /* @__PURE__ */ de({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {},
    disabled: { type: Boolean },
    defaultsOnly: { type: Boolean }
  },
  setup(l) {
    const $ = l, t = J(), d = D(() => $.defaults ?? t.value), u = J(), m = J(!1);
    async function f() {
      if (!($.defaults || $.disabled)) {
        u.value = void 0, m.value = !0;
        try {
          t.value = await Uo($.catalogId ?? "");
        } catch (o) {
          u.value = Le(o, "Could not read policy defaults.");
        } finally {
          m.value = !1;
        }
      }
    }
    Fa(f);
    const c = D(() => $.draft.policy ?? {}), C = [
      { key: "audit", title: "Audit trail", hint: "Fields records each value change. Off records only lifecycle, schema and release history.", kind: "enum" },
      { key: "audit_days", title: "Audit retention (days)", hint: "0 uses the 365-day default. History always expires.", kind: "int", min: 0, max: 106751 },
      { key: "trash_days", title: "Trash window (days)", hint: "How long a deleted product stays restorable.", kind: "int", min: 1, max: 106751 },
      { key: "tombstone_days", title: "Deleted product notices (days)", hint: "How long feeds report a purged product as deleted.", kind: "int", min: 1, max: 106751 }
    ], A = {
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
    function N(o) {
      const j = Ja[o];
      return { key: o, ...j, kind: "int", hint: A[o] };
    }
    C.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(N));
    const X = ["proposal_days", "proposal_count"].map(N), P = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(N), z = [
      { id: "retention", title: "Retention", keys: C },
      { id: "proposals", title: "Proposals", keys: X },
      { id: "advanced", title: "", keys: P }
    ], k = D(() => [
      { value: "inherited", label: d.value ? `${d.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function x(o, j) {
      const I = $.draft.policy ?? ($.draft.policy = {});
      I[o] = j == null || j === "" || j === "inherited" ? !1 : j;
    }
    return (o, j) => (e(), i("section", Ao, [
      l.defaultsOnly ? v("", !0) : (e(), i("p", jo, "Empty fields inherit the deployment settings.")),
      m.value ? (e(), i("p", So, "Loading deployment defaults…")) : v("", !0),
      u.value ? (e(), T(ra, {
        key: 2,
        error: u.value
      }, {
        default: w(() => [
          y(s(G), {
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: f
          }, {
            default: w(() => [...j[0] || (j[0] = [
              H("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["error"])) : v("", !0),
      (e(), i(E, null, ee(z, (I) => y($l(I.id === "advanced" ? Ue : "section"), Cl({
        key: I.id,
        ref_for: !0
      }, I.id === "advanced" ? { label: "Advanced processing settings" } : { "aria-label": I.title }, {
        "data-policy-group": I.id,
        class: "pim-policy-group"
      }), {
        default: w(() => [
          I.title ? (e(), i("header", Ro, [
            a("h3", null, U(I.title), 1)
          ])) : v("", !0),
          (e(!0), i(E, null, ee(I.keys, (M) => (e(), i("div", {
            key: M.key,
            class: "pim-policy-row"
          }, [
            a("div", Oo, [
              a("label", {
                for: "pol-" + M.key
              }, U(M.title), 9, Io),
              a("p", {
                id: "pol-help-" + M.key
              }, [
                H(U(M.hint), 1),
                M.global ? (e(), i("span", Po, " Managed in deployment settings.")) : v("", !0)
              ], 8, To)
            ]),
            l.defaultsOnly ? (e(), i("p", qo, [
              H(U(d.value?.[M.key] === "fields" ? "Record field changes" : d.value?.[M.key] === "off" ? "Lifecycle and release history" : d.value?.[M.key] ?? "Unavailable") + " ", 1),
              c.value[M.key] !== void 0 && c.value[M.key] !== !1 ? (e(), i("span", Do, " · Catalog override applies")) : v("", !0)
            ])) : M.kind === "enum" ? (e(), T(s(he), {
              key: 1,
              disabled: l.disabled,
              "input-id": "pol-" + M.key,
              "aria-describedby": "pol-help-" + M.key,
              class: "pim-policy-control",
              "model-value": typeof c.value[M.key] == "string" ? c.value[M.key] : "inherited",
              options: k.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": (se) => x(M.key, se)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])) : (e(), T(s(Sl), {
              key: 2,
              disabled: l.disabled || M.global,
              "input-id": "pol-" + M.key,
              "aria-describedby": "pol-help-" + M.key,
              class: "pim-policy-control",
              "model-value": M.global ? Number(d.value?.[M.key] ?? 0) || null : typeof c.value[M.key] == "number" ? Number(c.value[M.key]) : null,
              min: M.min ?? (M.key === "audit_days" ? 0 : 1),
              max: M.max,
              step: 1,
              placeholder: d.value ? "Default: " + d.value[M.key] : "Deployment default",
              "onUpdate:modelValue": (se) => x(M.key, se)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "min", "max", "placeholder", "onUpdate:modelValue"]))
          ]))), 128))
        ]),
        _: 2
      }, 1040, ["data-policy-group"])), 64))
    ]));
  }
}), zo = { class: "form" }, Fo = { class: "pim-aspect" }, Bo = { class: "pim-aspect-head" }, Lo = {
  key: 0,
  class: "muted small"
}, Eo = /* @__PURE__ */ de({
  __name: "BuilderDeclaration",
  props: {
    draft: {},
    readonly: { type: Boolean }
  },
  emits: ["replace", "validity"],
  setup(l, { emit: $ }) {
    const t = l, d = $, u = J(JSON.stringify(t.draft, null, 2)), m = J("");
    Ye(() => d("validity", !0)), pe(() => t.draft, (c) => {
      u.value = JSON.stringify(c, null, 2), m.value = "";
    }, { deep: !0 });
    function f() {
      if (!t.readonly)
        try {
          const c = Wl(u.value);
          m.value = "", d("validity", !0), d("replace", c);
        } catch (c) {
          d("validity", !1), m.value = "Invalid declaration: " + (c instanceof Error ? c.message : String(c));
        }
    }
    return (c, C) => (e(), i("section", zo, [
      a("div", Fo, [
        a("header", Bo, [
          C[1] || (C[1] = a("h3", null, "Declaration", -1)),
          l.readonly ? v("", !0) : (e(), i("span", Lo, "edits apply to the draft when the JSON parses"))
        ]),
        m.value ? (e(), T(s(we), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: w(() => [
            H(U(m.value), 1)
          ]),
          _: 1
        })) : v("", !0),
        y(s(Rl), {
          modelValue: u.value,
          "onUpdate:modelValue": C[0] || (C[0] = (A) => u.value = A),
          readonly: l.readonly,
          "aria-label": "Catalog declaration",
          rows: "28",
          spellcheck: "false",
          onInput: f,
          onBlur: f,
          class: "mono pim-json-edit"
        }, null, 8, ["modelValue", "readonly"])
      ])
    ]));
  }
}), Mo = { class: "pim-section-layout" }, Wo = { class: "kx-main" }, Ho = ["aria-label"], Jo = {
  key: 0,
  class: "system-section-head"
}, Ko = { class: "system-section-head-text" }, Go = { class: "kx-head-actions" }, Yo = { class: "pim-builder-main" }, Zo = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, Qo = ["disabled", "inert"], Xo = {
  key: 0,
  class: "muted pim-section-facts"
}, ed = { class: "pim-overview-grid" }, ad = { class: "kx-card-head" }, ld = { class: "kx-head-icon" }, td = { class: "kx-card-id" }, sd = { class: "kx-card-name" }, id = { class: "kx-card-meta" }, nd = { class: "kx-card-desc" }, od = { class: "pim-advanced-actions" }, dd = { class: "pim-ia-action" }, rd = { class: "pim-ia-action" }, ud = { class: "pim-ia-dialog" }, cd = { class: "pim-ia-dialog-head" }, md = {
  key: 0,
  class: "dialog-actions"
}, pd = ["aria-labelledby"], vd = { class: "pim-ia-dialog-head" }, fd = ["id"], bd = { class: "pim-ia-review-impact" }, yd = { key: 0 }, gd = { key: 1 }, hd = { key: 2 }, kd = { key: 3 }, _d = { key: 4 }, wd = { key: 0 }, $d = {
  key: 0,
  class: "pim-plan-list"
}, Cd = { key: 1 }, xd = {
  key: 1,
  class: "pim-ia-review-impact"
}, Vd = {
  key: 0,
  class: "row pim-review-confirm"
}, Ud = ["for"], Ad = { class: "dialog-actions pim-ia-dialog-actions" }, jd = /* @__PURE__ */ de({
  __name: "SchemaBuilder",
  props: {
    catalogId: {},
    embedded: { type: Boolean },
    title: {},
    catalog: {},
    backLabel: {},
    focusBack: { type: Boolean }
  },
  emits: ["applied", "back", "dirty-changed"],
  setup(l, { emit: $ }) {
    const t = l, d = $, u = {
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
    }, m = J("General"), f = J("Overview"), c = J(""), C = J(""), A = J(), N = J(!1), X = J(), P = Object.keys(u).map((g) => ({
      heading: g === "Channels" ? "Publishing and imports" : g,
      items: u[g].items.map((p) => ({ ...p, value: p.label, section: g }))
    })), z = [
      ...P.filter((g) => g.items.length > 1),
      { heading: "Manage catalog", items: P.filter((g) => g.items.length === 1).flatMap((g) => g.items) }
    ], k = z.flatMap((g) => g.items), x = D(() => Z.value && W.value ? [
      { ...z[0], heading: t.title || "Catalog" },
      ...z.slice(1)
    ] : []), o = D(() => t.backLabel ? {
      value: "all-catalogs",
      label: t.embedded ? "All catalogs" : t.backLabel,
      icon: "tabler:table"
    } : void 0), j = J();
    pe(j, (g) => {
      t.focusBack && g?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    function I(g) {
      if (g === "all-catalogs") {
        d("back");
        return;
      }
      const p = k.find((O) => O.label === g);
      p && M(p.section, p.label);
    }
    function M(g, p = u[g].items[0].label) {
      m.value === g && f.value === p || (m.value = g, f.value = p, X.value && (X.value.scrollTop = 0));
    }
    function se(g) {
      A.value = g, N.value = !0;
    }
    function fe(g) {
      c.value = g, M("Products", "Fields");
    }
    function ae(g, p, O = p + "s") {
      return g + " " + (g === 1 ? p : O);
    }
    const Z = J(null), W = J(null), S = J({}), K = J({}), h = J({}), n = D(() => Object.fromEntries(Object.entries(h.value).filter(([g]) => S.value.plugins?.some((p) => p.use === g) && !Z.value?.plugins.some((p) => p.plugin === g && p.active)))), b = J(), r = J(!1), L = J(null), F = J(!1), Q = D(() => Z.value?.access.admin === !0), ce = J(""), re = J(null), Ee = J(!1), $e = J(!1), ta = J(null), Me = qe(), ua = {
      unchanged: "No changes",
      initial: "First schema",
      cosmetic: "Presentation only",
      additive: "New fields or options",
      semantic: "Affects product data",
      refused: "Changes blocked"
    }, ca = {
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
    }, Se = J(null), Ce = J(!0), V = Ke(), R = D(() => Ee.value && Qe.value && (!va.value.length || $e.value) && !r.value && Ce.value && !!re.value && re.value.class !== "refused" && !!Se.value?.matches(De.value, Z.value?.schema_generation ?? -1, n.value)), q = D(() => re.value ? [...re.value.refused, ...re.value.changes.filter((g) => g.class !== "refused")] : []), _ = Ke(), oe = Ke(), Y = J(!1);
    let Oe = 0;
    pe([S, K, h], () => {
      Oe++, ge();
    }, { deep: !0, flush: "sync" });
    async function ve(g = !1, p = !1) {
      if (xe.value && !g) return;
      const O = _.begin(), te = Oe, ue = t.catalogId, be = p ? Object.entries(h.value).filter(([ke]) => Z.value?.plugins.some((sa) => sa.plugin === ke && sa.active)) : [];
      Y.value = !0, b.value = void 0;
      try {
        const [ke, sa] = await Promise.all([me.schema(ue), me.schemaOptions(ue)]);
        if (!_.current(O) || te !== Oe || ue !== t.catalogId) return;
        Z.value = ke, W.value = sa, S.value = ea(ke.declaration), K.value = {}, h.value = Object.fromEntries(be.filter(([rl]) => ke.plugins.some((Ta) => Ta.plugin === rl && Ta.active))), ge(), Ce.value = !0, r.value = !1;
      } catch (ke) {
        _.current(O) && (b.value = Le(ke, "Could not load settings."));
      } finally {
        _.current(O) && (Y.value = !1);
      }
    }
    let Ze = () => {
    };
    pe(() => t.catalogId, (g) => {
      Ze(), Ze = Ba(`component.${g}`, () => {
        !xe.value && !F.value ? ve() : f.value === "Plugins" && !F.value && Ne();
      });
    }, { immediate: !0 });
    const Ka = da(async () => {
      !xe.value && !F.value ? await ve() : f.value === "Plugins" && !F.value && await Ne();
    });
    Ye(() => {
      Ze(), V.begin(), _.begin(), oe.begin();
    });
    const xa = D(() => Ka.value !== !1 && f.value === "Plugins" && !F.value && Z.value?.plugins.some((g) => Qn(g, Z.value.as_of)) === !0);
    pe(xa, (g, p, O) => {
      if (!g) return;
      let te, ue = !0;
      const be = () => {
        te = setTimeout(async () => {
          await Ne() && ue && xa.value && be();
        }, 2e3);
      };
      be(), O(() => {
        ue = !1, clearTimeout(te);
      });
    }), pe(() => t.catalogId, () => {
      V.begin(), F.value = !1, r.value = !1, Z.value = null, W.value = null, fa(), ve();
    });
    const Ga = D(() => Object.values(Pa(S.value, K.value)).reduce((g, p) => g + (p?.length ?? 0), 0)), Qe = D(() => !!Z.value && (JSON.stringify(S.value) !== JSON.stringify(Z.value.declaration) || Ga.value > 0 || Object.keys(n.value).length > 0)), xe = D(() => Qe.value || Object.keys(h.value).length > 0);
    pe(xe, (g) => d("dirty-changed", g), { immediate: !0 });
    const Xe = D(() => S.value.families?.filter((g) => g.code !== "generic") ?? []), ma = D(() => S.value.aspects ?? []), pa = D(() => ma.value.reduce((g, p) => g + (p.attributes?.length ?? 0), 0)), Va = D(() => {
      const g = new Set(S.value.plugins?.map((p) => p.use));
      return Object.values(Z.value?.attributes ?? {}).filter((p) => p.plugin && g.has(p.plugin)).length;
    }), Ya = D(() => !pa.value && !ma.value.length && !Xe.value.length), Ua = D(() => S.value.channels ?? []), Za = D(() => S.value.sources ?? []), Aa = D(() => Z.value?.plugins.filter((g) => g.active) ?? []), Qa = D(() => [
      {
        section: "Products",
        label: "Product setup",
        icon: "tabler:packages",
        summary: [ae(Xe.value.length, "family", "families"), ae(pa.value + Va.value, "field")].join(" · "),
        detail: Xe.value.map((g) => B(g.code)).join(", ") || "Create a family for products that share the same fields."
      },
      {
        section: "Values",
        label: "Allowed values",
        icon: "tabler:list-details",
        summary: [ae(S.value.dimensions?.length ?? 0, "dimension"), ae(S.value.vocabularies?.length ?? 0, "vocabulary", "vocabularies")].join(" · "),
        detail: S.value.dimensions?.map((g) => B(g.name)).join(", ") || "Add dimensions when values vary by language, region or another context."
      },
      {
        section: "Channels",
        label: "Publishing and imports",
        icon: "tabler:arrows-exchange",
        summary: [ae(Ua.value.length, "channel"), ae(Za.value.length, "source")].join(" · "),
        detail: Ua.value.map((g) => B(g.id)).join(", ") || "Add a release destination when products are ready to publish."
      },
      {
        section: "Plugins",
        label: "Catalog tools",
        icon: "tabler:puzzle",
        summary: ae(Aa.value.length, "plugin") + " enabled",
        detail: Aa.value.map((g) => ne(g.title, "Catalog plugin")).join(", ") || "Open Plugins to see which tools you can enable."
      }
    ]), Xa = {
      Overview: u.General.question,
      History: "What changed in this catalog?",
      Families: "Which product forms and variants can editors use?",
      Fields: "What values can products store?",
      "Form layout": "In what order will editors see fields?",
      Dimensions: "Where can product values differ?",
      Vocabularies: "Which terms can product editors choose?",
      Channels: "Where can products be published?",
      Sources: "Which systems can send product data?",
      Access: u.Access.question,
      Plugins: u.Plugins.question
    }, ja = D(() => {
      const g = S.value;
      switch (f.value) {
        case "Overview": {
          const p = t.catalog?.product_count ?? t.catalog?.item_count;
          return [
            ...typeof p == "number" ? [ae(p, "product")] : [],
            ...Z.value?.rebuilding ? ["Updating product readiness"] : [],
            ...xe.value ? ["Unsaved changes are reflected below"] : []
          ];
        }
        case "History":
          return ["Recent catalog settings changes"];
        case "Families":
          return [
            ae(Xe.value.length, "family", "families"),
            ae(Xe.value.filter((p) => p.variation?.length).length, "family with variants", "families with variants")
          ];
        case "Fields":
        case "Form layout":
          return [ae(pa.value + Va.value, "field"), ae(ma.value.length, "field group")];
        case "Dimensions":
          return [ae(g.dimensions?.length ?? 0, "dimension")];
        case "Vocabularies":
          return [ae(g.vocabularies?.length ?? 0, "vocabulary", "vocabularies")];
        case "Channels":
          return [
            ae(g.channels?.length ?? 0, "channel"),
            ...g.channels?.length ? [] : ["Add a channel to give products a release destination"]
          ];
        case "Sources":
          return [ae(g.sources?.length ?? 0, "source")];
        case "Access":
          return C.value ? [C.value] : [];
        case "Plugins":
          return [
            ae(g.plugins?.length ?? 0, "plugin") + " selected",
            (W.value?.plugins.filter((p) => p.installed).length ?? 0) + " available",
            ae(g.scopes?.length ?? 0, "filter set") + " selected",
            ...Z.value?.plugins.some((p) => p.active && ["failed", "config", "reset", "paused", "degraded", "uninstalled"].includes(Ha(p, Z.value.as_of)?.kind ?? "")) ? ["Some plugins need attention"] : []
          ];
        default:
          return [];
      }
    }), De = D(() => {
      const g = ea(S.value), p = Pa(g, K.value);
      for (const [O, te] of Object.entries(p)) {
        const ue = g.remove ??= {};
        ue[O] = [.../* @__PURE__ */ new Set([...ue[O] ?? [], ...te])];
      }
      return g;
    });
    pe(Qe, (g) => {
      g || ge();
    }), pe([De, n], ge, { deep: !0 });
    function el(g) {
      const [p, O] = g.split(" ", 2);
      if (p === "plugin" && O) return ne(W.value?.plugins.find((be) => be.plugin === O)?.title, "Plugin");
      if (p === "scope" && O) return ne(W.value?.scopes.find((be) => be.id === O)?.title, "Product filter set");
      if (O) return ne(B(O), B(p)) + (p === "aspect" ? " field group" : "");
      if (g.startsWith("kickside.")) return "Catalog setting";
      const [te, ue] = g.split(".", 2);
      return ue ? `${ne(B(ue), "Field")} (${ne(B(te), "Field group")})` : ne(B(g), "Catalog setting");
    }
    function al(g) {
      return g.startsWith("renamed from ") ? "Rename from " + B(g.slice(13)) : g.startsWith("config.") ? "Change " + B(g.slice(7)) : g.endsWith(" owning level") ? "Move a field to another variant level" : ca[g] ?? B(g);
    }
    const va = D(() => {
      const g = De.value.remove;
      return [
        ...g?.attributes?.length || g?.aspects?.length ? ["Removing fields deletes the values stored in those fields."] : [],
        ...g?.vocabularies?.length ? ["Removing a vocabulary deletes its saved terms."] : [],
        ...g?.channels?.length ? ["Removing a release destination withdraws products already published to it."] : []
      ];
    }), Sa = D(() => {
      const g = Z.value?.declaration;
      return g ? [
        ...(S.value.channels ?? []).flatMap((p) => {
          const O = g.channels?.find((te) => te.id === p.id);
          return JSON.stringify(p) === JSON.stringify(O) ? [] : [{ subject: B(p.id), effect: O ? "Change which products can be released here and what they need first" : "Add a release destination" }];
        }),
        ...(De.value.remove?.channels ?? []).map((p) => ({ subject: B(p), effect: "Remove this release destination" })),
        ...(S.value.sources ?? []).flatMap((p) => {
          const O = g.sources?.find((te) => te.id === p.id);
          return JSON.stringify(p) === JSON.stringify(O) ? [] : [{ subject: B(p.id), effect: O ? "Update how this source can send product data" : "Let this source send product updates" }];
        }),
        ...(De.value.remove?.sources ?? []).map((p) => ({ subject: B(p), effect: "Stop accepting updates from this source" }))
      ] : [];
    });
    function We(g, p) {
      b.value = Le(g, p), b.value.code === ml && (r.value = !0, ge());
    }
    async function ll() {
      if (!(xe.value && !await Je.confirm({
        header: "Discard unsaved changes?",
        message: "Reloading will discard unsaved settings and plugin changes.",
        acceptLabel: "Discard and reload",
        rejectLabel: "Cancel"
      }))) {
        F.value = !0, ce.value = "";
        try {
          await ve(!0);
        } finally {
          F.value = !1;
        }
      }
    }
    async function Ra() {
      if (!Z.value || !Qe.value || !Ce.value || r.value) return;
      const g = V.begin(), p = Ll(De.value, Z.value.schema_generation, n.value);
      F.value = !0, b.value = void 0;
      try {
        const O = await me.planSchema(t.catalogId, p.declaration, p.generation, p.pluginConfigs);
        if (!V.current(g) || !p.matches(De.value, Z.value.schema_generation, n.value) || !Ce.value) return;
        Se.value = p, $e.value = !1, re.value = O, Ee.value = !0, await ba(), ta.value?.focus();
      } catch (O) {
        if (!V.current(g)) return;
        We(O, "Could not review the change."), ge(), await ba(), L.value?.$el.focus();
      } finally {
        V.current(g) && (F.value = !1);
      }
    }
    async function tl() {
      if (!Z.value || !xe.value || !R.value || !Se.value) return;
      const g = t.catalogId, p = V.begin();
      F.value = !0, b.value = void 0, ce.value = "";
      try {
        const O = await me.applySchema(g, Se.value.declaration, Se.value.generation, Se.value.pluginConfigs);
        if (g !== t.catalogId || !V.current(p) || (await ve(!0, !0), g !== t.catalogId || !V.current(p))) return;
        ce.value = "Catalog changes applied.", d("applied", O.generation);
      } catch (O) {
        if (g !== t.catalogId || !V.current(p)) return;
        ge(), We(O, "Could not apply the change."), await ba(), L.value?.$el.focus();
      } finally {
        V.current(p) && (F.value = !1);
      }
    }
    async function Ne(g = !1) {
      const p = t.catalogId, O = Z.value, te = oe.begin();
      try {
        const [ue, be] = await Promise.all([me.schema(p), g ? me.schemaOptions(p) : void 0]);
        return !O || !oe.current(te) || p !== t.catalogId || Z.value !== O ? !1 : (O.plugins = ue.plugins, O.as_of = ue.as_of, be && (W.value = be), !0);
      } catch (ue) {
        return g && oe.current(te) && p === t.catalogId && We(ue, "Could not check plugin status."), !1;
      }
    }
    async function Oa(g, p, O = !1) {
      if (F.value || r.value || !Q.value) return;
      const te = t.catalogId, ue = _.begin(), be = V.begin();
      oe.begin(), F.value = !0, b.value = void 0, ce.value = "";
      try {
        const ke = JSON.stringify(p);
        if (O ? await me.configurePlugin(te, g, ea(p), !0) : await me.configurePlugin(te, g, ea(p)), te !== t.catalogId || !_.current(ue) || !await Ne(!0) || te !== t.catalogId || !_.current(ue)) return;
        !O && JSON.stringify(h.value[g]) === ke && delete h.value[g], ce.value = O ? "Background update reset requested." : "Configuration saved";
      } catch (ke) {
        te === t.catalogId && V.current(be) && We(ke, O ? "Could not reset background updates." : "Could not save configuration.");
      } finally {
        V.current(be) && (F.value = !1);
      }
    }
    async function sl(g) {
      const p = t.catalogId, O = Z.value?.plugins.find((te) => te.plugin === g && te.active && te.installed);
      !O?.config || F.value || r.value || !Q.value || !await Je.confirm({
        header: "Reset background updates?",
        message: "Background updates will start from a new catalog event. Current product data will be rebuilt into the plugin’s index. Earlier events will be skipped.",
        acceptLabel: "Reset background updates",
        rejectLabel: "Cancel"
      }) || t.catalogId !== p || await Oa(g, O.config, !0);
    }
    async function il(g) {
      const p = t.catalogId;
      if (!(F.value || r.value || !Q.value)) {
        F.value = !0, b.value = void 0, ce.value = "";
        try {
          await me.resumePluginProjection(p, g), t.catalogId === p && await Ne(!0) && (ce.value = "Background update resumed.");
        } catch (O) {
          t.catalogId === p && We(O, "Could not resume the background update.");
        } finally {
          t.catalogId === p && (F.value = !1);
        }
      }
    }
    async function nl(g) {
      const p = t.catalogId;
      if (!(F.value || r.value || !Q.value) && !(!await Je.confirm({
        header: "Clear catalog app binding?",
        message: "The catalog will use the default app after this setting is saved.",
        acceptLabel: "Clear binding",
        rejectLabel: "Cancel"
      }) || t.catalogId !== p || F.value || !Q.value || !Z.value?.plugins.some((O) => O.references?.shell_bindings.includes(g)))) {
        F.value = !0, b.value = void 0, ce.value = "";
        try {
          if (await me.updateCatalogApp(p, ""), t.catalogId !== p) return;
          await Ne(!0) && (ce.value = "Catalog app binding cleared.");
        } catch (O) {
          t.catalogId === p && We(O, "Could not clear the catalog app binding.");
        } finally {
          t.catalogId === p && (F.value = !1);
        }
      }
    }
    async function ol() {
      xe.value && !await Je.confirm({
        header: "Leave this catalog?",
        message: "Your unsaved catalog changes will be discarded.",
        acceptLabel: "Discard and open settings",
        rejectLabel: "Keep editing"
      }) || (fa(), N.value = !1, Je.navigate("/system/settings"));
    }
    function ge() {
      Ee.value = !1, Se.value = null;
    }
    function Ia() {
      N.value = !1, Ce.value = !0;
    }
    function fa() {
      h.value = {}, Ce.value = !0, Z.value && (S.value = ea(Z.value.declaration)), K.value = {}, ge(), ce.value = "";
    }
    function He(g, p) {
      const O = K.value[g] ?? [];
      O.includes(p) || (K.value = { ...K.value, [g]: [...O, p] });
    }
    function dl(g) {
      g.button === 0 && g.target instanceof Element && g.target.closest(".kx-settings-rail-item:focus-visible")?.blur();
    }
    return (g, p) => (e(), i("section", {
      class: je(["pim-builder", { embedded: l.embedded }])
    }, [
      a("div", Mo, [
        o.value || Z.value && W.value ? (e(), T(ql, {
          key: 0,
          ref_key: "rail",
          ref: j,
          label: "Catalog settings sections",
          value: f.value,
          groups: x.value,
          "leading-item": o.value,
          "onUpdate:value": I,
          onPointerdown: dl
        }, null, 8, ["value", "groups", "leading-item"])) : v("", !0),
        a("div", Wo, [
          a("section", {
            ref_key: "content",
            ref: X,
            class: "kx-main-scroll",
            "aria-label": f.value
          }, [
            Z.value && W.value ? (e(), i("header", Jo, [
              a("div", Ko, [
                a("h1", null, U(f.value), 1),
                a("p", null, U(Xa[f.value]), 1)
              ]),
              a("div", Go, [
                y(It, {
                  access: Z.value.access,
                  dirty: xe.value,
                  busy: F.value,
                  valid: Ce.value && !r.value && Qe.value,
                  onDiscard: fa,
                  onReview: Ra
                }, null, 8, ["access", "dirty", "busy", "valid"])
              ])
            ])) : v("", !0),
            a("div", Yo, [
              b.value ? (e(), T(ra, {
                key: 0,
                ref_key: "errorPanel",
                ref: L,
                error: b.value,
                tabindex: "-1"
              }, {
                default: w(() => [
                  r.value ? (e(), T(s(G), {
                    key: 0,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: F.value,
                    onClick: ll
                  }, {
                    default: w(() => [...p[11] || (p[11] = [
                      H("Reload settings", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"])) : !Z.value || !W.value ? (e(), T(s(G), {
                    key: 1,
                    type: "button",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: p[0] || (p[0] = (O) => ve())
                  }, {
                    default: w(() => [...p[12] || (p[12] = [
                      H("Retry", -1)
                    ])]),
                    _: 1
                  })) : v("", !0)
                ]),
                _: 1
              }, 8, ["error"])) : v("", !0),
              ce.value ? (e(), T(s(we), {
                key: 1,
                severity: "success",
                role: "status"
              }, {
                default: w(() => [
                  H(U(ce.value), 1)
                ]),
                _: 1
              })) : v("", !0),
              Y.value && (!Z.value || !W.value) ? (e(), i("div", Zo, "Loading catalog settings…")) : Z.value && W.value ? (e(), i("fieldset", {
                key: 3,
                class: "pim-editor-surface",
                disabled: F.value,
                inert: F.value
              }, [
                ja.value.length ? (e(), i("p", Xo, U(ja.value.join(" · ")), 1)) : v("", !0),
                Q.value ? v("", !0) : (e(), T(s(we), {
                  key: 1,
                  severity: "info"
                }, {
                  default: w(() => [...p[13] || (p[13] = [
                    H("You can view this catalog’s settings.", -1)
                  ])]),
                  _: 1
                })),
                (e(), i("div", {
                  key: f.value,
                  class: "pim-ia-content"
                }, [
                  m.value === "General" && f.value === "History" ? (e(), T(Ot, {
                    key: 0,
                    "catalog-id": l.catalogId,
                    "can-resolve-actors": Q.value
                  }, null, 8, ["catalog-id", "can-resolve-actors"])) : m.value === "General" ? (e(), i(E, { key: 1 }, [
                    a("div", ed, [
                      (e(!0), i(E, null, ee(Qa.value, (O) => (e(), i("section", {
                        key: O.section,
                        class: "kx-card pim-overview-card"
                      }, [
                        a("div", ad, [
                          a("span", ld, [
                            y(s(le), {
                              icon: O.icon,
                              "aria-hidden": "true"
                            }, null, 8, ["icon"])
                          ]),
                          a("div", td, [
                            a("h3", sd, U(O.label), 1),
                            a("p", id, U(O.summary), 1)
                          ])
                        ]),
                        a("p", nd, U(O.detail), 1),
                        y(s(G), {
                          type: "button",
                          text: "",
                          size: "small",
                          severity: "secondary",
                          class: "pim-overview-action",
                          onClick: (te) => M(O.section)
                        }, {
                          default: w(() => [
                            H(U(O.section === "Products" && Ya.value ? "Set up products" : "View " + O.section.toLowerCase()) + " ", 1),
                            y(s(le), {
                              icon: "tabler:arrow-right",
                              "aria-hidden": "true"
                            })
                          ]),
                          _: 2
                        }, 1032, ["onClick"])
                      ]))), 128))
                    ]),
                    y(Ue, { label: "Advanced" }, {
                      default: w(() => [
                        a("div", od, [
                          a("div", dd, [
                            p[14] || (p[14] = a("div", null, [
                              a("h3", null, "Application defaults"),
                              a("p", null, "Review the audit, retention and processing settings this catalog inherits.")
                            ], -1)),
                            y(s(G), {
                              label: "View defaults",
                              severity: "secondary",
                              outlined: "",
                              onClick: p[1] || (p[1] = (O) => se("defaults"))
                            })
                          ]),
                          a("div", rd, [
                            p[15] || (p[15] = a("div", null, [
                              a("h3", null, "Technical schema"),
                              a("p", null, "Inspect the complete definition, including integration keys and settings used by installed extensions.")
                            ], -1)),
                            y(s(G), {
                              label: "Open declaration",
                              severity: "secondary",
                              outlined: "",
                              onClick: p[2] || (p[2] = (O) => se("declaration"))
                            })
                          ])
                        ])
                      ]),
                      _: 1
                    })
                  ], 64)) : m.value === "Products" ? (e(), i(E, { key: 2 }, [
                    f.value === "Families" ? (e(), T(gn, {
                      key: 0,
                      draft: S.value,
                      schema: Z.value,
                      options: W.value,
                      onRemove: He,
                      onFields: fe
                    }, null, 8, ["draft", "schema", "options"])) : f.value === "Fields" ? (e(), T(oi, {
                      key: 1,
                      family: c.value,
                      "onUpdate:family": p[3] || (p[3] = (O) => c.value = O),
                      draft: S.value,
                      schema: Z.value,
                      options: W.value,
                      onRemove: He
                    }, null, 8, ["family", "draft", "schema", "options"])) : (e(), T(ct, {
                      key: 2,
                      draft: S.value,
                      schema: Z.value,
                      types: W.value.types
                    }, null, 8, ["draft", "schema", "types"]))
                  ], 64)) : m.value === "Values" ? (e(), i(E, { key: 3 }, [
                    f.value === "Dimensions" ? (e(), T(yi, {
                      key: 0,
                      draft: S.value,
                      schema: Z.value,
                      onRemove: He
                    }, null, 8, ["draft", "schema"])) : (e(), T(Di, {
                      key: 1,
                      "catalog-id": l.catalogId,
                      draft: S.value,
                      schema: Z.value,
                      onRemove: He
                    }, null, 8, ["catalog-id", "draft", "schema"]))
                  ], 64)) : m.value === "Channels" ? (e(), T(Yn, {
                    key: 4,
                    "catalog-id": l.catalogId,
                    draft: S.value,
                    schema: Z.value,
                    view: f.value === "Sources" ? "sources" : "channels",
                    onRemove: He
                  }, null, 8, ["catalog-id", "draft", "schema", "view"])) : m.value === "Access" ? (e(), T(Bl, {
                    key: 5,
                    "catalog-id": l.catalogId,
                    title: l.title || "Catalog",
                    access: Z.value.access,
                    onSummary: p[4] || (p[4] = (O) => C.value = O)
                  }, null, 8, ["catalog-id", "title", "access"])) : (e(), T(Vo, {
                    key: 6,
                    draft: S.value,
                    schema: Z.value,
                    options: W.value,
                    "plugin-configs": h.value,
                    stale: r.value,
                    onConfigure: Oa,
                    onRemove: He,
                    onReset: sl,
                    onRefresh: p[5] || (p[5] = (O) => Ne(!0)),
                    onResume: il,
                    onReview: Ra,
                    onClearShellBinding: nl
                  }, null, 8, ["draft", "schema", "options", "plugin-configs", "stale"]))
                ])),
                A.value ? (e(), T(ya, {
                  key: 2,
                  visible: N.value,
                  label: A.value === "defaults" ? "Application defaults" : "Technical schema",
                  onClose: Ia,
                  onClosed: p[8] || (p[8] = (O) => A.value = void 0)
                }, {
                  default: w(() => [
                    a("div", ud, [
                      a("header", cd, [
                        a("h2", null, U(A.value === "defaults" ? "Application defaults" : "Technical schema"), 1),
                        y(s(G), {
                          type: "button",
                          "aria-label": "Close",
                          text: "",
                          severity: "secondary",
                          onClick: Ia
                        }, {
                          default: w(() => [
                            y(s(le), {
                              icon: "tabler:x",
                              "aria-hidden": "true"
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      A.value === "defaults" ? (e(), i(E, { key: 0 }, [
                        p[16] || (p[16] = a("p", { class: "muted" }, "These settings apply across the application. Catalogs with an explicit override keep their chosen value.", -1)),
                        y(No, {
                          "catalog-id": l.catalogId,
                          draft: S.value,
                          disabled: !Q.value,
                          "defaults-only": ""
                        }, null, 8, ["catalog-id", "draft", "disabled"]),
                        Q.value ? (e(), i("div", md, [
                          y(s(G), {
                            type: "button",
                            label: "Open application settings",
                            severity: "secondary",
                            outlined: "",
                            onClick: ol
                          })
                        ])) : v("", !0)
                      ], 64)) : (e(), T(Eo, {
                        key: 1,
                        draft: S.value,
                        readonly: !Q.value,
                        onReplace: p[6] || (p[6] = (O) => S.value = O),
                        onValidity: p[7] || (p[7] = (O) => {
                          Ce.value = O, ge();
                        })
                      }, null, 8, ["draft", "readonly"]))
                    ])
                  ]),
                  _: 1
                }, 8, ["visible", "label"])) : v("", !0)
              ], 8, Qo)) : v("", !0),
              y(ya, {
                class: "pim-review-dialog",
                visible: Ee.value,
                busy: F.value,
                label: "Review changes",
                onClose: ge,
                onClosed: p[10] || (p[10] = (O) => re.value = null)
              }, {
                default: w(() => [
                  re.value ? (e(), i("section", {
                    key: 0,
                    class: "pim-ia-dialog pim-plan",
                    "aria-labelledby": s(Me)
                  }, [
                    a("header", vd, [
                      a("div", null, [
                        a("h2", {
                          id: s(Me),
                          ref_key: "reviewHeading",
                          ref: ta,
                          tabindex: "-1",
                          autofocus: ""
                        }, "Review changes", 8, fd),
                        a("p", null, "Check what will happen when you apply this draft to " + U(l.title || "the catalog") + ".", 1)
                      ]),
                      y(s(G), {
                        type: "button",
                        "aria-label": "Close review",
                        disabled: F.value,
                        text: "",
                        severity: "secondary",
                        onClick: ge
                      }, {
                        default: w(() => [
                          y(s(le), {
                            icon: "tabler:x",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ]),
                    a("div", bd, [
                      a("h3", null, U(ua[re.value.class] || "Catalog changes"), 1),
                      re.value.class === "unchanged" ? (e(), i("p", yd, "The catalog already matches this draft.")) : re.value.class === "initial" ? (e(), i("p", gd, "Product editors will use these settings for new products.")) : re.value.class === "cosmetic" ? (e(), i("p", hd, "Catalog settings will update. Stored product values are kept.")) : re.value.class === "additive" ? (e(), i("p", kd, "The new options become available. Existing product values are kept.")) : re.value.class === "semantic" ? (e(), i("p", _d, "Applying changes can recalculate product values or release readiness across this catalog.")) : re.value.class === "refused" ? (e(), T(s(we), {
                        key: 5,
                        severity: "error"
                      }, {
                        default: w(() => [
                          p[17] || (p[17] = H(" These changes can’t be applied. ", -1)),
                          re.value.migration && re.value.refused.some((O) => Z.value?.attributes[O.code]) ? (e(), i("span", wd, " To change how a field stores values, add a new field and copy the existing values into it. Then remove the original field and give the new field its name. ")) : v("", !0)
                        ]),
                        _: 1
                      })) : v("", !0)
                    ]),
                    q.value.length || Sa.value.length ? (e(), i("ul", $d, [
                      (e(!0), i(E, null, ee(q.value, (O, te) => (e(), i("li", { key: te }, [
                        O.class === "refused" ? (e(), T(s(ye), {
                          key: 0,
                          class: "kx-tag-sm small",
                          severity: "danger"
                        }, {
                          default: w(() => [...p[18] || (p[18] = [
                            H("Blocked", -1)
                          ])]),
                          _: 1
                        })) : v("", !0),
                        O.code ? (e(), i("strong", Cd, U(el(O.code)), 1)) : v("", !0),
                        a("span", null, U(al(O.what)), 1)
                      ]))), 128)),
                      (e(!0), i(E, null, ee(Sa.value, (O) => (e(), i("li", {
                        key: O.subject + O.effect
                      }, [
                        a("strong", null, U(O.subject), 1),
                        a("span", null, U(O.effect), 1)
                      ]))), 128))
                    ])) : v("", !0),
                    va.value.length ? (e(), i("div", xd, [
                      p[19] || (p[19] = a("h3", null, "Permanent changes", -1)),
                      (e(!0), i(E, null, ee(va.value, (O) => (e(), i("p", { key: O }, U(O), 1))), 128)),
                      re.value.class !== "refused" ? (e(), i("div", Vd, [
                        y(s(xl), {
                          modelValue: $e.value,
                          "onUpdate:modelValue": p[9] || (p[9] = (O) => $e.value = O),
                          "input-id": s(Me) + "-acknowledge",
                          binary: "",
                          disabled: F.value
                        }, null, 8, ["modelValue", "input-id", "disabled"]),
                        a("label", {
                          for: s(Me) + "-acknowledge"
                        }, "I understand the effects of these removals", 8, Ud)
                      ])) : v("", !0)
                    ])) : v("", !0),
                    a("footer", Ad, [
                      y(s(G), {
                        type: "button",
                        label: "Back to editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: F.value,
                        onClick: ge
                      }, null, 8, ["disabled"]),
                      Z.value?.access.admin && re.value.class !== "refused" ? (e(), T(s(G), {
                        key: 0,
                        disabled: !xe.value || F.value || !R.value,
                        loading: F.value,
                        onClick: tl
                      }, {
                        default: w(() => [
                          H(U(f.value === "Form layout" ? "Apply layout" : "Apply changes"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled", "loading"])) : v("", !0)
                    ])
                  ], 8, pd)) : v("", !0)
                ]),
                _: 1
              }, 8, ["visible", "busy"])
            ])
          ], 8, Ho)
        ])
      ])
    ], 2));
  }
}), Sd = /* @__PURE__ */ de({
  __name: "SettingsApp",
  setup(l) {
    const $ = pl(), t = vl(), d = J(), u = D(() => $.value.catalogId ?? ""), m = Ke();
    async function f() {
      const C = m.begin(), A = u.value;
      try {
        const N = await me.catalogSummary(A);
        m.current(C) && (d.value = N);
      } catch {
        m.current(C) && (d.value = void 0);
      }
    }
    pe(u, () => {
      d.value = void 0, f();
    }), da(f), Ye(() => {
      m.begin();
    });
    function c() {
      $.value.embedded ? t("open-catalog-picker", {}) : t("navigate", { route: "" });
    }
    return (C, A) => u.value ? (e(), T(jd, {
      key: u.value,
      "catalog-id": u.value,
      title: d.value?.title || "Catalog",
      catalog: d.value,
      embedded: s($).embedded,
      "focus-back": s($).focusBack,
      "back-label": s($).embedded ? "Back to catalogs" : "Back to catalog settings",
      onBack: c,
      onDirtyChanged: A[0] || (A[0] = (N) => s(t)("dirty-changed", { dirty: N }))
    }, null, 8, ["catalog-id", "title", "catalog", "embedded", "focus-back", "back-label"])) : v("", !0);
  }
});
class Rd extends fl {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "catalog-id": { type: "string", default: "" }, embedded: { type: "boolean", default: !1 }, "focus-back": { type: "boolean", default: !1 } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: bl
    };
  }
  static get vueConfig() {
    return { rootComponent: Sd, plugins: [yl] };
  }
}
Al(import.meta.url, Rd);
