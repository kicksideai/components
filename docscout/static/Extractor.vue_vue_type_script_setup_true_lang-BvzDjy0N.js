import { defineComponent as H, useModel as Be, openBlock as a, createElementBlock as n, withModifiers as ve, createElementVNode as t, mergeModels as Xe, computed as U, withKeys as Ee, unref as p, normalizeClass as Q, createVNode as b, toDisplayString as d, Fragment as M, renderList as I, createCommentVNode as h, createTextVNode as F, createBlock as J, ref as A, toRaw as lt, useId as ye, watch as pe, withDirectives as W, vModelText as _, vModelSelect as Ge, resolveComponent as it, renderSlot as Ie, withCtx as me, mergeProps as ht, vShow as Ke, onMounted as Ue, nextTick as Ce, normalizeStyle as qe, onBeforeUnmount as Ct, vModelDynamic as rl } from "vue";
import { B as cl, L as vl, d as ze, v as Me, e as ml, U as pl, I as yt, c as bl, g as Et, b as fl } from "./wc-runtime-CBjtO5xN.js";
import { loadByTagName as Ze, on as kt } from "@wippy-fe/proxy";
import { i as Qe, f as qt, t as at, a as $e, b as ut, d as gl, m as Ut, e as K, M as Ae, g as Ft, h as Nt, j as nt, k as hl, l as yl, o as kl, p as $l, q as xl, r as Mt, u as wl, v as Vl, w as Sl, x as Cl, y as $t, z as El, A as et, B as ql, C as Oe, D as Ul, E as st, s as de, n as xt, F as Fl, G as Nl, c as ge } from "./index-c2UiBMav.js";
import { Icon as L } from "@iconify/vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
var Ml = cl.extend({
  name: "focustrap-directive"
}), Al = ml.extend({
  style: Ml
});
function Pe(e) {
  "@babel/helpers - typeof";
  return Pe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(s) {
    return typeof s;
  } : function(s) {
    return s && typeof Symbol == "function" && s.constructor === Symbol && s !== Symbol.prototype ? "symbol" : typeof s;
  }, Pe(e);
}
function wt(e, s) {
  var l = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    s && (u = u.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), l.push.apply(l, u);
  }
  return l;
}
function Vt(e) {
  for (var s = 1; s < arguments.length; s++) {
    var l = arguments[s] != null ? arguments[s] : {};
    s % 2 ? wt(Object(l), !0).forEach(function(u) {
      Rl(e, u, l[u]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(l)) : wt(Object(l)).forEach(function(u) {
      Object.defineProperty(e, u, Object.getOwnPropertyDescriptor(l, u));
    });
  }
  return e;
}
function Rl(e, s, l) {
  return (s = Ll(s)) in e ? Object.defineProperty(e, s, { value: l, enumerable: !0, configurable: !0, writable: !0 }) : e[s] = l, e;
}
function Ll(e) {
  var s = Bl(e, "string");
  return Pe(s) == "symbol" ? s : s + "";
}
function Bl(e, s) {
  if (Pe(e) != "object" || !e) return e;
  var l = e[Symbol.toPrimitive];
  if (l !== void 0) {
    var u = l.call(e, s);
    if (Pe(u) != "object") return u;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (s === "string" ? String : Number)(e);
}
var Ol = Al.extend("focustrap", {
  mounted: function(s, l) {
    var u = l.value || {}, i = u.disabled;
    i || (this.createHiddenFocusableElements(s, l), this.bind(s, l), this.autoElementFocus(s, l)), s.setAttribute("data-pd-focustrap", !0), this.$el = s;
  },
  updated: function(s, l) {
    var u = l.value || {}, i = u.disabled;
    i && this.unbind(s);
  },
  unmounted: function(s) {
    this.unbind(s);
  },
  methods: {
    getComputedSelector: function(s) {
      return ':not(.p-hidden-focusable):not([data-p-hidden-focusable="true"])'.concat(s ?? "");
    },
    bind: function(s, l) {
      var u = this, i = l.value || {}, m = i.onFocusIn, g = i.onFocusOut;
      s.$_pfocustrap_mutationobserver = new MutationObserver(function(c) {
        c.forEach(function(k) {
          if (k.type === "childList" && !s.contains(document.activeElement)) {
            var q = function($) {
              var f = yt($) ? yt($, u.getComputedSelector(s.$_pfocustrap_focusableselector)) ? $ : Me(s, u.getComputedSelector(s.$_pfocustrap_focusableselector)) : Me($);
              return bl(f) ? f : $.nextSibling && q($.nextSibling);
            };
            ze(q(k.nextSibling));
          }
        });
      }), s.$_pfocustrap_mutationobserver.disconnect(), s.$_pfocustrap_mutationobserver.observe(s, {
        childList: !0
      }), s.$_pfocustrap_focusinlistener = function(c) {
        return m && m(c);
      }, s.$_pfocustrap_focusoutlistener = function(c) {
        return g && g(c);
      }, s.addEventListener("focusin", s.$_pfocustrap_focusinlistener), s.addEventListener("focusout", s.$_pfocustrap_focusoutlistener);
    },
    unbind: function(s) {
      s.$_pfocustrap_mutationobserver && s.$_pfocustrap_mutationobserver.disconnect(), s.$_pfocustrap_focusinlistener && s.removeEventListener("focusin", s.$_pfocustrap_focusinlistener) && (s.$_pfocustrap_focusinlistener = null), s.$_pfocustrap_focusoutlistener && s.removeEventListener("focusout", s.$_pfocustrap_focusoutlistener) && (s.$_pfocustrap_focusoutlistener = null);
    },
    autoFocus: function(s) {
      this.autoElementFocus(this.$el, {
        value: Vt(Vt({}, s), {}, {
          autoFocus: !0
        })
      });
    },
    autoElementFocus: function(s, l) {
      var u = l.value || {}, i = u.autoFocusSelector, m = i === void 0 ? "" : i, g = u.firstFocusableSelector, c = g === void 0 ? "" : g, k = u.autoFocus, q = k === void 0 ? !1 : k, S = Me(s, "[autofocus]".concat(this.getComputedSelector(m)));
      q && !S && (S = Me(s, this.getComputedSelector(c))), ze(S);
    },
    onFirstHiddenElementFocus: function(s) {
      var l, u = s.currentTarget, i = s.relatedTarget, m = i === u.$_pfocustrap_lasthiddenfocusableelement || !((l = this.$el) !== null && l !== void 0 && l.contains(i)) ? Me(u.parentElement, this.getComputedSelector(u.$_pfocustrap_focusableselector)) : u.$_pfocustrap_lasthiddenfocusableelement;
      ze(m);
    },
    onLastHiddenElementFocus: function(s) {
      var l, u = s.currentTarget, i = s.relatedTarget, m = i === u.$_pfocustrap_firsthiddenfocusableelement || !((l = this.$el) !== null && l !== void 0 && l.contains(i)) ? vl(u.parentElement, this.getComputedSelector(u.$_pfocustrap_focusableselector)) : u.$_pfocustrap_firsthiddenfocusableelement;
      ze(m);
    },
    createHiddenFocusableElements: function(s, l) {
      var u = this, i = l.value || {}, m = i.tabIndex, g = m === void 0 ? 0 : m, c = i.firstFocusableSelector, k = c === void 0 ? "" : c, q = i.lastFocusableSelector, S = q === void 0 ? "" : q, $ = function(r) {
        return pl("span", {
          class: "p-hidden-accessible p-hidden-focusable",
          tabIndex: g,
          role: "presentation",
          "aria-hidden": !0,
          "data-p-hidden-accessible": !0,
          "data-p-hidden-focusable": !0,
          onFocus: r?.bind(u)
        });
      }, f = $(this.onFirstHiddenElementFocus), x = $(this.onLastHiddenElementFocus);
      f.$_pfocustrap_lasthiddenfocusableelement = x, f.$_pfocustrap_focusableselector = k, f.setAttribute("data-pc-section", "firstfocusableelement"), x.$_pfocustrap_firsthiddenfocusableelement = f, x.$_pfocustrap_focusableselector = S, x.setAttribute("data-pc-section", "lastfocusableelement"), s.prepend(f), s.append(x);
    }
  }
});
const Pl = ["aria-checked", "aria-label", "disabled"], Z = /* @__PURE__ */ H({
  __name: "Toggle",
  props: /* @__PURE__ */ Xe({
    label: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { type: Boolean, required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const s = Be(e, "modelValue");
    return (l, u) => (a(), n("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": s.value,
      "aria-label": e.label,
      disabled: e.disabled,
      onClick: u[0] || (u[0] = ve((i) => s.value = !s.value, ["stop"]))
    }, [...u[1] || (u[1] = [
      t("span", null, null, -1)
    ])], 8, Pl));
  }
}), Tl = ["aria-label"], Dl = { class: "node-icon" }, jl = { class: "node-main" }, Il = { class: "node-title" }, zl = { class: "node-summary" }, Wl = {
  key: 0,
  class: "chips"
}, Hl = ["aria-label", "title"], Gl = {
  key: 1,
  class: "trace-line"
}, Kl = { class: "node-side" }, Ql = {
  key: 0,
  class: "chip model"
}, we = /* @__PURE__ */ H({
  __name: "StageNode",
  props: {
    stage: {},
    config: {},
    active: { type: Boolean },
    trace: {},
    readonly: { type: Boolean }
  },
  emits: ["select"],
  setup(e, { emit: s }) {
    const l = e, u = s, i = U(() => Qe(l.config, l.stage)), m = U(() => l.config.stages[l.stage].model), g = U({ get: () => i.value, set: (f) => {
      l.config.stages[l.stage].enabled = f;
    } }), c = U(() => {
      const f = l.config, x = f.stages;
      switch (l.stage) {
        case "map":
          return f.fields.filter((o) => o.search_within === "sections").map((o) => ({ text: o.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...x.prefetch.queries.map((o) => ({ text: o.name || "Untitled query", tone: "" })), ...f.fields.filter((o) => o.search_hints.trim()).map((o) => ({ text: o.name, tone: "hint" }))];
        case "scout":
          return x.scout.mode === "agent" ? x.scout.tools.map((o) => ({ text: at(o).toLowerCase(), tone: "" })) : [];
        case "deep":
          return f.fields.filter((o) => o.strategy === "deep").map((o) => ({ text: o.name || "New field", tone: "primary" }));
        case "extract":
          return qt(f).map((o) => ({ text: `${o.name} · ${o.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), k = U(() => c.value.slice(0, 3)), q = U(() => c.value.slice(3)), S = U(() => q.value.map((f) => f.text).join(", ")), $ = (f) => [`${(f.duration_ms / 1e3).toFixed(1)}s`, `${(f.input_tokens + f.output_tokens).toLocaleString()} tokens`, f.queries?.length ? `${f.queries.length} queries` : "", f.message ?? ""].filter(Boolean).join(" · ");
    return (f, x) => (a(), n("div", {
      class: Q(["node kx-focus-halo", { active: e.active, off: !i.value, fixed: e.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": p($e)[e.stage],
      onClick: x[1] || (x[1] = (o) => u("select")),
      onKeydown: [
        x[2] || (x[2] = Ee((o) => u("select"), ["enter"])),
        x[3] || (x[3] = Ee(ve((o) => u("select"), ["prevent"]), ["space"]))
      ]
    }, [
      t("span", Dl, [
        b(p(L), {
          icon: p(ut)[e.stage]
        }, null, 8, ["icon"])
      ]),
      t("span", jl, [
        t("span", Il, d(p($e)[e.stage]), 1),
        t("span", zl, d(i.value ? p(gl)(e.stage, e.config) : "Off"), 1),
        i.value && c.value.length ? (a(), n("span", Wl, [
          (a(!0), n(M, null, I(k.value, (o) => (a(), n("span", {
            key: o.text,
            class: Q(["chip", { primary: o.tone === "primary", "muted-chip": o.tone === "hint" }])
          }, d(o.text), 3))), 128)),
          q.value.length ? (a(), n("span", {
            key: 0,
            class: "chip chip-overflow",
            "aria-label": `${q.value.length} more: ${S.value}`,
            title: S.value
          }, "+" + d(q.value.length) + " more", 9, Hl)) : h("", !0)
        ])) : h("", !0),
        e.trace ? (a(), n("span", Gl, [
          b(p(L), {
            icon: e.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          F(d($(e.trace)), 1)
        ])) : h("", !0)
      ]),
      t("span", Kl, [
        i.value && m.value ? (a(), n("span", Ql, d(p(Ut)(m.value)), 1)) : h("", !0),
        e.stage !== "extract" && !e.readonly ? (a(), J(Z, {
          key: 1,
          modelValue: g.value,
          "onUpdate:modelValue": x[0] || (x[0] = (o) => g.value = o),
          label: `Enable ${p($e)[e.stage]}`
        }, null, 8, ["modelValue", "label"])) : h("", !0)
      ])
    ], 42, Tl));
  }
}), Jl = ["aria-labelledby"], Yl = ["aria-label", "aria-checked", "tabindex", "disabled", "onClick", "onKeydown"], he = /* @__PURE__ */ H({
  __name: "Segmented",
  props: /* @__PURE__ */ Xe({
    options: {},
    labelledBy: {},
    disabled: { type: Boolean },
    name: {}
  }, {
    modelValue: { required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const s = e, l = Be(e, "modelValue"), u = A([]);
    function i(m, g) {
      const c = s.options.length - 1, k = { ArrowRight: g + 1, ArrowDown: g + 1, ArrowLeft: g - 1, ArrowUp: g - 1, Home: 0, End: c }[m.key];
      if (k === void 0) return;
      m.preventDefault();
      const q = (k + s.options.length) % s.options.length;
      l.value = s.options[q].value, u.value[q]?.focus();
    }
    return (m, g) => (a(), n("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": e.labelledBy
    }, [
      (a(!0), n(M, null, I(e.options, (c, k) => (a(), n("button", {
        key: c.value,
        ref_for: !0,
        ref_key: "buttons",
        ref: u,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        role: "radio",
        "aria-label": e.name ? `${e.name}: ${c.label}` : void 0,
        "aria-checked": l.value === c.value,
        tabindex: l.value === c.value ? 0 : -1,
        disabled: e.disabled,
        onClick: (q) => l.value = c.value,
        onKeydown: (q) => i(q, k)
      }, [
        c.icon ? (a(), J(p(L), {
          key: 0,
          icon: c.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : h("", !0),
        t("span", null, d(c.label), 1)
      ], 40, Yl))), 128))
    ], 8, Jl));
  }
}), ie = (e, s) => `${e}:${s.join("/")}`, At = [
  { value: "text", label: "Text", icon: "tabler:typography" },
  { value: "number", label: "Number", icon: "tabler:123" },
  { value: "boolean", label: "Yes / no", icon: "tabler:toggle-right" },
  { value: "date", label: "Date", icon: "tabler:calendar" },
  { value: "enum", label: "One of a set", icon: "tabler:list-details" },
  { value: "list", label: "List", icon: "tabler:brackets" },
  { value: "object", label: "Object", icon: "tabler:braces" }
], Xl = (e) => At.find((s) => s.value === e).icon;
function Je(e) {
  const s = [];
  function l(u, i, m, g) {
    s.push({ field: i, trail: m, shape: u, path: g, depth: m.length + 1, key: ie(i, m) }), u.properties?.forEach((c, k) => l(c, i, [...m, k], `${g}.${c.name || "New property"}`)), u.item && l(u.item, i, [...m, "item"], `${g}[]`);
  }
  return e.forEach((u, i) => l(u, i, [], K(u) || "New field")), s;
}
function ot(e) {
  return 1 + Math.max(0, ...(e.properties ?? []).map(ot), e.item ? ot(e.item) : 0);
}
function Zl(e, s) {
  return Je(e).filter((l) => l.shape.type === "object" && ((l.shape.properties?.length ?? 0) < 100 || l.field === s.field && ie(l.field, l.trail) === ie(s.field, s.trail.slice(0, -1))) && l.depth + ot(s.shape) <= Ae && !(l.field === s.field && s.trail.every((u, i) => l.trail[i] === u)));
}
function _l(e, s, l) {
  const u = { ...Nt(), ...structuredClone(lt(s.shape)), name: s.shape.name };
  s.trail.length ? Je(e).find((g) => g.key === ie(s.field, s.trail.slice(0, -1))).shape.properties.splice(s.trail.at(-1), 1) : e.splice(s.field, 1);
  let i;
  if (l) {
    const { name: m, type: g, description: c, enum_values: k, expected_format: q, required: S, properties: $, item: f, nullable: x, max_length: o } = u;
    i = { name: m, type: g, description: c, enum_values: k, expected_format: q, required: S, ...$ ? { properties: $ } : {}, ...f ? { item: f } : {}, ...x !== void 0 ? { nullable: x } : {}, ...o !== void 0 ? { max_length: o } : {} }, l.shape.properties.push(i), i = l.shape.properties.at(-1);
  } else {
    const { nullable: m, max_length: g, ...c } = u;
    i = { ...nt(), ...c, group: "" }, e.push(i), i = e.at(-1);
  }
  return Je(e).find((m) => m.shape === i);
}
function St(e, s = !1) {
  function l(i) {
    return i.type === "object" ? Object.fromEntries((i.properties ?? []).map((m) => [m.name || "unnamed", l(m)])) : i.type === "list" ? i.item ? [l(i.item)] : [] : s ? i.enum_values?.length ? i.enum_values[0] : { text: "Example value", number: 42, boolean: !0, date: "2026-01-15", enum: null }[i.type] : i.type === "enum" ? i.enum_values?.join(" | ") || "enum" : i.type;
  }
  const u = {};
  return e.forEach((i) => Ft(u, K(i) || "unnamed", l(i))), u;
}
const ea = { class: "shape-editor" }, ta = { key: 0 }, la = ["aria-label", "aria-invalid", "aria-describedby"], aa = { class: "label-block" }, na = ["id"], sa = { key: 0 }, oa = ["id"], ia = {
  key: 2,
  class: "label-block"
}, ua = { class: "chips" }, da = ["aria-label", "onClick"], ra = {
  key: 0,
  class: "row"
}, ca = ["onKeydown"], va = {
  key: 1,
  class: "field-error",
  role: "alert"
}, ma = { key: 3 }, pa = ["placeholder"], ba = {
  key: 4,
  class: "toggle-row"
}, fa = { class: "toggle-row" }, ga = { key: 0 }, ha = { class: "muted" }, ya = ["aria-label", "disabled"], ka = /* @__PURE__ */ H({
  __name: "ShapeEditor",
  props: {
    shape: {},
    depth: { default: 1 },
    label: { default: "field" },
    named: { type: Boolean, default: !1 },
    readonly: { type: Boolean },
    siblingNames: { default: () => [] },
    validationError: {}
  },
  emits: ["add", "selectItem"],
  setup(e, { emit: s }) {
    const l = e, u = s, i = U(() => l.shape), m = U(() => l.named ? l.depth === 1 ? "Field type" : "Property type" : "Item type"), g = U(() => At.filter((R) => l.depth < Ae || !["object", "list"].includes(R.value))), c = U({ get: () => l.shape.type, set: (R) => {
      l.shape.type = R, delete l.shape.properties, delete l.shape.item, l.shape.enum_values = [], ["text", "date", "enum"].includes(R) || delete i.value.max_length, R === "object" && (l.shape.properties = []), R === "list" && (l.shape.item = hl());
    } }), k = U(() => l.named && l.depth > 1), q = U({ get: () => i.value.nullable === !0, set: (R) => {
      R ? i.value.nullable = !0 : delete i.value.nullable;
    } }), S = U({ get: () => i.value.max_length ?? "", set: (R) => {
      R === "" ? delete i.value.max_length : i.value.max_length = Number(R);
    } }), $ = ye(), f = ye(), x = A(""), o = A("");
    pe(() => l.shape, () => {
      x.value = "", o.value = "";
    });
    const r = U(() => l.validationError || (l.named ? yl(i.value.name, l.siblingNames) : "") || kl(l.shape, l.depth));
    function z() {
      const R = x.value.trim(), N = l.shape.enum_values ?? [];
      if (!R || R.length > 200) {
        o.value = "Enter 1 to 200 characters.";
        return;
      }
      if (N.includes(R)) {
        o.value = "This value already exists.";
        return;
      }
      if (N.length >= 100) {
        o.value = "Use at most 100 allowed values.";
        return;
      }
      l.shape.enum_values = [...N, R], x.value = "", o.value = "";
    }
    return (R, N) => (a(), n("div", ea, [
      e.named ? (a(), n("label", ta, [
        N[10] || (N[10] = F("Name", -1)),
        W(t("input", {
          "onUpdate:modelValue": N[0] || (N[0] = (P) => i.value.name = P),
          "aria-label": e.depth === 1 ? "Field name" : "Property name",
          "aria-invalid": !!r.value,
          "aria-describedby": r.value ? p(f) : void 0,
          maxlength: "80",
          spellcheck: "false",
          class: "mono-input"
        }, null, 8, la), [
          [
            _,
            i.value.name,
            void 0,
            { trim: !0 }
          ]
        ])
      ])) : h("", !0),
      t("div", aa, [
        t("span", { id: p($) }, d(e.named ? "Data type" : "Item type"), 9, na),
        b(he, {
          modelValue: c.value,
          "onUpdate:modelValue": N[1] || (N[1] = (P) => c.value = P),
          class: "type-picker",
          options: g.value,
          "labelled-by": p($),
          name: m.value,
          disabled: e.readonly
        }, null, 8, ["modelValue", "options", "labelled-by", "name", "disabled"]),
        e.depth === p(Ae) ? (a(), n("small", sa, "Level four · choose a value type.")) : h("", !0)
      ]),
      r.value ? (a(), n("p", {
        key: 1,
        id: p(f),
        class: "field-error",
        role: "alert"
      }, d(r.value), 9, oa)) : h("", !0),
      p($l)(e.shape, e.named) ? (a(), n("div", ia, [
        t("span", null, d(e.shape.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        t("div", ua, [
          (a(!0), n(M, null, I(e.shape.enum_values, (P, G) => (a(), n("span", {
            key: P,
            class: "chip primary"
          }, [
            F(d(P), 1),
            e.readonly ? h("", !0) : (a(), n("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Remove allowed value ${P}`,
              onClick: (j) => e.shape.enum_values.splice(G, 1)
            }, [
              b(p(L), { icon: "tabler:x" })
            ], 8, da))
          ]))), 128))
        ]),
        e.readonly ? h("", !0) : (a(), n("div", ra, [
          W(t("input", {
            "onUpdate:modelValue": N[2] || (N[2] = (P) => x.value = P),
            "aria-label": "New allowed value",
            placeholder: "Add a value…",
            maxlength: "200",
            onKeydown: Ee(ve(z, ["prevent"]), ["enter"])
          }, null, 40, ca), [
            [_, x.value]
          ]),
          t("button", {
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo",
            onClick: z
          }, "Add")
        ])),
        o.value ? (a(), n("p", va, d(o.value), 1)) : h("", !0)
      ])) : h("", !0),
      t("label", null, [
        N[11] || (N[11] = F("Description", -1)),
        W(t("textarea", {
          "onUpdate:modelValue": N[3] || (N[3] = (P) => e.shape.description = P),
          rows: "3",
          maxlength: "4000",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [_, e.shape.description]
        ])
      ]),
      ["boolean", "enum"].includes(e.shape.type) ? h("", !0) : (a(), n("label", ma, [
        N[12] || (N[12] = F("Expected format", -1)),
        W(t("input", {
          "onUpdate:modelValue": N[4] || (N[4] = (P) => e.shape.expected_format = P),
          maxlength: "400",
          placeholder: p(xl)(e.shape)
        }, null, 8, pa), [
          [_, e.shape.expected_format]
        ])
      ])),
      e.named ? (a(), n("div", ba, [
        N[13] || (N[13] = t("span", null, "Required", -1)),
        b(Z, {
          modelValue: i.value.required,
          "onUpdate:modelValue": N[5] || (N[5] = (P) => i.value.required = P),
          label: "Required",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : h("", !0),
      k.value ? (a(), n(M, { key: 5 }, [
        t("div", fa, [
          N[14] || (N[14] = t("span", null, [
            F("May be absent"),
            t("small", null, "A missing member has no value.")
          ], -1)),
          b(Z, {
            modelValue: q.value,
            "onUpdate:modelValue": N[6] || (N[6] = (P) => q.value = P),
            label: "May be absent",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        ["text", "date", "enum"].includes(e.shape.type) ? (a(), n("label", ga, [
          N[15] || (N[15] = F("Maximum characters", -1)),
          W(t("input", {
            "onUpdate:modelValue": N[7] || (N[7] = (P) => S.value = P),
            type: "number",
            min: "1",
            step: "1",
            "aria-label": "Maximum characters"
          }, null, 512), [
            [_, S.value]
          ]),
          N[16] || (N[16] = t("small", null, "Optional. Longer values fail extraction.", -1))
        ])) : h("", !0)
      ], 64)) : h("", !0),
      e.shape.type === "object" ? (a(), n(M, { key: 6 }, [
        t("p", ha, d(e.shape.properties?.length ?? 0) + " properties · Select a property in the tree to edit it.", 1),
        !e.readonly && e.depth < p(Ae) ? (a(), n("button", {
          key: 0,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Add property to ${e.label}`,
          disabled: (e.shape.properties?.length ?? 0) >= 100,
          onClick: N[8] || (N[8] = (P) => u("add"))
        }, [
          b(p(L), { icon: "tabler:plus" }),
          N[17] || (N[17] = F("Add property", -1))
        ], 8, ya)) : h("", !0)
      ], 64)) : h("", !0),
      e.shape.type === "list" && e.shape.item ? (a(), n("button", {
        key: 7,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        onClick: N[9] || (N[9] = (P) => u("selectItem"))
      }, [
        b(p(L), { icon: "tabler:brackets" }),
        F("Edit item shape · " + d(e.shape.item.type), 1)
      ])) : h("", !0)
    ]));
  }
}), $a = ["disabled"], xa = { class: "grid" }, wa = { class: "context-stepper" }, Va = ["disabled"], Sa = ["disabled"], Ca = {
  key: 0,
  class: "field-note"
}, Ea = { class: "label-block" }, qa = {
  key: 1,
  class: "field-error"
}, Ua = { id: "docscout-groups" }, Fa = ["value"], Na = { class: "toggle-row" }, Ma = /* @__PURE__ */ H({
  __name: "FieldInspector",
  props: {
    field: {},
    otherNames: {},
    groups: {},
    deepEnabled: { type: Boolean },
    mapEnabled: { type: Boolean },
    readonly: { type: Boolean },
    shape: {},
    depth: {},
    siblingNames: {}
  },
  emits: ["remove", "add", "selectItem"],
  setup(e, { emit: s }) {
    const l = e, u = s, i = U(() => !l.depth || l.depth === 1), m = U(() => Mt(l.field, l.otherNames));
    return (g, c) => (a(), n("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      b(ka, {
        shape: e.shape ?? e.field,
        depth: e.depth ?? 1,
        label: e.shape?.name || e.field.name || "field",
        named: i.value || !!e.shape?.name || !!e.siblingNames,
        "sibling-names": e.siblingNames,
        "validation-error": i.value ? m.value : void 0,
        readonly: e.readonly,
        onAdd: c[0] || (c[0] = (k) => u("add")),
        onSelectItem: c[1] || (c[1] = (k) => u("selectItem"))
      }, null, 8, ["shape", "depth", "label", "named", "sibling-names", "validation-error", "readonly"]),
      i.value ? (a(), n(M, { key: 0 }, [
        c[25] || (c[25] = t("h4", null, "Finding it", -1)),
        t("label", null, [
          c[12] || (c[12] = F("Search hints", -1)),
          W(t("textarea", {
            "onUpdate:modelValue": c[2] || (c[2] = (k) => e.field.search_hints = k),
            rows: "2",
            maxlength: "4000",
            placeholder: "One query per line"
          }, null, 512), [
            [_, e.field.search_hints]
          ]),
          c[13] || (c[13] = t("small", null, "Each line is an extra search for this field in Prefetch and Deep analysis.", -1))
        ]),
        t("div", xa, [
          t("label", null, [
            c[15] || (c[15] = F("Strategy", -1)),
            W(t("select", {
              "onUpdate:modelValue": c[3] || (c[3] = (k) => e.field.strategy = k)
            }, [...c[14] || (c[14] = [
              t("option", { value: "standard" }, "Standard", -1),
              t("option", { value: "deep" }, "Deep analysis", -1)
            ])], 512), [
              [Ge, e.field.strategy]
            ])
          ]),
          t("label", null, [
            c[16] || (c[16] = F("Chunks to read", -1)),
            t("span", wa, [
              W(t("input", {
                "onUpdate:modelValue": c[4] || (c[4] = (k) => e.field.chunks = k),
                type: "number",
                min: "1",
                max: "1000",
                "aria-label": "Chunks to read"
              }, null, 512), [
                [
                  _,
                  e.field.chunks,
                  void 0,
                  { number: !0 }
                ]
              ]),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Decrease chunks to read",
                disabled: e.field.chunks <= 1 || e.readonly,
                onClick: c[5] || (c[5] = (k) => e.field.chunks--)
              }, "−", 8, Va),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Increase chunks to read",
                disabled: e.field.chunks >= 1e3 || e.readonly,
                onClick: c[6] || (c[6] = (k) => e.field.chunks++)
              }, "+", 8, Sa)
            ]),
            c[17] || (c[17] = t("small", null, "Per search hint", -1))
          ])
        ]),
        e.field.strategy === "deep" && !e.deepEnabled ? (a(), n("p", Ca, [
          b(p(L), { icon: "tabler:info-circle" }),
          c[18] || (c[18] = F("Deep analysis is off in the flow, so this field runs as standard.", -1))
        ])) : h("", !0),
        t("div", Ea, [
          c[19] || (c[19] = t("span", { id: "within-label" }, "Search within", -1)),
          b(he, {
            modelValue: e.field.search_within,
            "onUpdate:modelValue": c[7] || (c[7] = (k) => e.field.search_within = k),
            "labelled-by": "within-label",
            options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
          }, null, 8, ["modelValue"]),
          t("small", null, d(e.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
        ]),
        e.field.search_within === "sections" && !e.mapEnabled ? (a(), n("p", qa, [
          b(p(L), { icon: "tabler:alert-circle" }),
          c[20] || (c[20] = F("Turn on Map the document to read sections.", -1))
        ])) : h("", !0),
        t("label", null, [
          c[21] || (c[21] = F("Group", -1)),
          W(t("input", {
            "onUpdate:modelValue": c[8] || (c[8] = (k) => e.field.group = k),
            list: "docscout-groups",
            placeholder: "parties.borrower",
            "aria-label": "Field group",
            maxlength: "320"
          }, null, 512), [
            [
              _,
              e.field.group,
              void 0,
              { trim: !0 }
            ]
          ]),
          t("datalist", Ua, [
            (a(!0), n(M, null, I(e.groups, (k) => (a(), n("option", {
              key: k,
              value: k
            }, null, 8, Fa))), 128))
          ]),
          c[22] || (c[22] = t("small", null, "Use dotted snake_case names. Values nest under this path.", -1))
        ]),
        c[26] || (c[26] = t("h4", null, "Checking it", -1)),
        t("label", null, [
          c[23] || (c[23] = F("Validation hints", -1)),
          W(t("textarea", {
            "onUpdate:modelValue": c[9] || (c[9] = (k) => e.field.validation_hints = k),
            rows: "2",
            maxlength: "4000",
            placeholder: "Rules the value must satisfy"
          }, null, 512), [
            [_, e.field.validation_hints]
          ])
        ]),
        t("div", Na, [
          c[24] || (c[24] = t("span", null, [
            F("Evidence required"),
            t("small", null, "The value must cite a quote from the document.")
          ], -1)),
          b(Z, {
            modelValue: e.field.evidence_required,
            "onUpdate:modelValue": c[10] || (c[10] = (k) => e.field.evidence_required = k),
            label: "Evidence required",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : h("", !0),
      !e.readonly && (i.value || e.siblingNames) ? (a(), n("button", {
        key: 1,
        type: "button",
        class: "kx-btn kx-btn-danger kx-focus-halo",
        onClick: c[11] || (c[11] = (k) => u("remove"))
      }, d(i.value ? "Remove field" : "Remove property"), 1)) : h("", !0)
    ], 8, $a));
  }
}), Aa = { class: "field-groups" }, Ra = {
  key: 0,
  class: "rows"
}, La = ["aria-label"], Ba = { class: "field-group-head" }, Oa = ["aria-label", "aria-expanded", "aria-controls", "onClick"], Pa = { class: "group-title" }, Ta = ["id"], Da = { class: "group-title" }, Re = /* @__PURE__ */ H({
  __name: "FieldGroups",
  props: {
    node: {}
  },
  setup(e) {
    const s = A(/* @__PURE__ */ new Set()), l = ye();
    function u(m) {
      s.value.has(m) ? s.value.delete(m) : s.value.add(m);
    }
    const i = (m) => m.indices.length + m.children.reduce((g, c) => g + i(c), 0);
    return (m, g) => {
      const c = it("FieldGroups", !0);
      return a(), n("div", Aa, [
        e.node.indices.length ? (a(), n("ul", Ra, [
          (a(!0), n(M, null, I(e.node.indices, (k) => (a(), n("li", { key: k }, [
            Ie(m.$slots, "default", { index: k })
          ]))), 128))
        ])) : h("", !0),
        (a(!0), n(M, null, I(e.node.children, (k, q) => (a(), n("section", {
          key: k.path,
          class: "field-group",
          "aria-label": `Group ${k.path}`
        }, [
          t("header", Ba, [
            t("button", {
              type: "button",
              class: "tree-toggle kx-iconbtn kx-focus-outline",
              "aria-label": `${s.value.has(k.path) ? "Expand" : "Collapse"} group ${k.path}`,
              "aria-expanded": !s.value.has(k.path),
              "aria-controls": `${p(l)}-${k.path}`,
              onClick: (S) => u(k.path)
            }, [
              b(p(L), {
                icon: s.value.has(k.path) ? "tabler:chevron-right" : "tabler:chevron-down"
              }, null, 8, ["icon"])
            ], 8, Oa),
            Ie(m.$slots, "header", {
              path: k.path,
              label: k.name,
              count: i(k),
              first: q === 0,
              last: q === e.node.children.length - 1
            }, () => [
              t("span", Pa, d(k.name), 1)
            ])
          ]),
          W(t("div", {
            id: `${p(l)}-${k.path}`,
            class: "group-content"
          }, [
            b(c, { node: k }, {
              default: me((S) => [
                Ie(m.$slots, "default", ht({ ref_for: !0 }, S))
              ]),
              header: me((S) => [
                Ie(m.$slots, "header", ht({ ref_for: !0 }, S), () => [
                  t("span", Da, d(S.label), 1)
                ])
              ]),
              _: 3
            }, 8, ["node"])
          ], 8, Ta), [
            [Ke, !s.value.has(k.path)]
          ])
        ], 8, La))), 128))
      ]);
    };
  }
}), ja = ["aria-label", "maxlength", "aria-invalid", "aria-describedby", "onKeydown"], Ia = ["aria-label", "title"], za = ["aria-label", "title"], Wa = ["id"], Rt = /* @__PURE__ */ H({
  __name: "GroupPathEditor",
  props: {
    initialValue: { default: "" },
    inputLabel: {},
    saveLabel: {},
    cancelLabel: {},
    maxLength: { default: 320 }
  },
  emits: ["save", "cancel"],
  setup(e, { emit: s }) {
    const l = e, u = s, i = A(l.initialValue), m = A(""), g = A(), c = ye();
    Ue(() => {
      g.value.focus(), g.value.select();
    });
    function k() {
      const q = i.value.trim();
      if (!q || !wl.test(q)) {
        m.value = "Use a dotted path of snake_case group names.";
        return;
      }
      if (q.length > l.maxLength) {
        m.value = "The group and its nested paths must fit within 320 characters.";
        return;
      }
      u("save", q);
    }
    return (q, S) => (a(), n("form", {
      class: "group-path-editor",
      onSubmit: ve(k, ["prevent"])
    }, [
      W(t("input", {
        ref_key: "input",
        ref: g,
        "onUpdate:modelValue": S[0] || (S[0] = ($) => i.value = $),
        "aria-label": e.inputLabel,
        maxlength: e.maxLength,
        "aria-invalid": !!m.value,
        "aria-describedby": m.value ? p(c) : void 0,
        "aria-required": "true",
        autocomplete: "off",
        spellcheck: "false",
        placeholder: "parties.borrower",
        onKeydown: [
          Ee(ve(k, ["prevent"]), ["enter"]),
          S[1] || (S[1] = Ee(ve(($) => u("cancel"), ["stop", "prevent"]), ["esc"]))
        ]
      }, null, 40, ja), [
        [_, i.value]
      ]),
      t("button", {
        type: "submit",
        class: "kx-iconbtn kx-focus-outline",
        "aria-label": e.saveLabel,
        title: e.saveLabel
      }, [
        b(p(L), { icon: "tabler:check" })
      ], 8, Ia),
      t("button", {
        type: "button",
        class: "kx-iconbtn kx-focus-outline",
        "aria-label": e.cancelLabel,
        title: e.cancelLabel,
        onClick: S[2] || (S[2] = ($) => u("cancel"))
      }, [
        b(p(L), { icon: "tabler:x" })
      ], 8, za),
      m.value ? (a(), n("p", {
        key: 0,
        id: p(c),
        class: "field-error",
        role: "alert"
      }, d(m.value), 9, Wa)) : h("", !0)
    ], 32));
  }
}), Ha = ["title"], Ga = ["aria-label", "data-group-rename", "title"], Ka = ["aria-label"], Qa = {
  key: 2,
  class: "group-actions"
}, Ja = ["aria-label", "disabled"], Ya = ["aria-label", "aria-expanded", "aria-controls"], Xa = /* @__PURE__ */ H({
  __name: "GroupHeader",
  props: {
    path: {},
    name: {},
    count: {},
    first: { type: Boolean },
    last: { type: Boolean },
    maxLength: {},
    canAdd: { type: Boolean },
    readonly: { type: Boolean }
  },
  emits: ["rename", "add", "reorder", "remove"],
  setup(e, { emit: s }) {
    const l = e, u = s, i = A(!1), m = A(!1), g = A(), c = A(), k = A(), q = ye(), S = U(() => [
      { label: "Move up", disabled: l.first, command: () => u("reorder", -1) },
      { label: "Move down", disabled: l.last, command: () => u("reorder", 1) },
      { separator: !0 },
      { label: "Delete group and its fields", command: () => u("remove") }
    ]);
    function $() {
      i.value = !0;
    }
    async function f() {
      i.value = !1, await Ce(), c.value.focus();
    }
    async function x(o) {
      const r = g.value.closest(".field-tree");
      i.value = !1, u("rename", o), await Ce(), r.querySelector(`[data-group-rename="${o}"]`).focus();
    }
    return (o, r) => (a(), n("div", {
      ref_key: "heading",
      ref: g,
      class: "group-heading"
    }, [
      i.value ? (a(), J(Rt, {
        key: 0,
        "initial-value": e.path,
        "input-label": `Group path for ${e.path}`,
        "save-label": "Save group name",
        "cancel-label": "Cancel group rename",
        "max-length": e.maxLength,
        onSave: x,
        onCancel: f
      }, null, 8, ["initial-value", "input-label", "max-length"])) : (a(), n(M, { key: 1 }, [
        e.readonly ? (a(), n("span", {
          key: 0,
          class: "group-title",
          title: e.path
        }, d(e.name), 9, Ha)) : (a(), n("button", {
          key: 1,
          ref_key: "renameButton",
          ref: c,
          type: "button",
          class: "group-title group-name-button kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Rename group ${e.path}`,
          "data-group-rename": e.path,
          title: e.path,
          onClick: $
        }, [
          t("span", null, d(e.name), 1),
          b(p(L), {
            icon: "tabler:pencil",
            "aria-hidden": "true"
          })
        ], 8, Ga)),
        t("span", {
          class: "count group-count",
          "aria-label": `${e.count} fields`
        }, d(e.count), 9, Ka),
        e.readonly ? h("", !0) : (a(), n("div", Qa, [
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Add field to ${e.path}`,
            disabled: !e.canAdd,
            title: "Add field",
            onClick: r[0] || (r[0] = (z) => u("add"))
          }, [
            b(p(L), { icon: "tabler:plus" })
          ], 8, Ja),
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Actions for group ${e.path}`,
            "aria-haspopup": "menu",
            "aria-expanded": m.value,
            "aria-controls": p(q),
            onClick: r[1] || (r[1] = (z) => k.value.toggle(z))
          }, [
            b(p(L), { icon: "tabler:dots" })
          ], 8, Ya),
          b(p(Et), {
            id: p(q),
            ref_key: "menu",
            ref: k,
            model: S.value,
            popup: "",
            "append-to": "self",
            onShow: r[2] || (r[2] = (z) => m.value = !0),
            onHide: r[3] || (r[3] = (z) => m.value = !1)
          }, null, 8, ["id", "model"])
        ]))
      ], 64))
    ], 512));
  }
}), Za = ["aria-label", "aria-expanded"], _a = {
  key: 1,
  class: "tree-indent"
}, en = ["aria-label", "aria-current"], tn = { class: "row-copy" }, ln = { class: "row-name" }, an = ["title"], nn = { class: "field-badges" }, sn = { class: "chip field-type" }, on = { class: "field-flags" }, un = {
  key: 0,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Required",
  title: "Required"
}, dn = {
  key: 1,
  class: "chip field-flag primary",
  role: "img",
  "aria-label": "Deep analysis",
  title: "Deep analysis"
}, rn = {
  key: 2,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Reads sections",
  title: "Reads sections"
}, cn = {
  key: 3,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Evidence required",
  title: "Evidence required"
}, vn = {
  key: 2,
  class: "row-actions"
}, mn = ["aria-label", "disabled"], pn = ["aria-label", "disabled"], bn = ["aria-label", "aria-expanded", "aria-controls"], fn = {
  key: 0,
  class: "tree-children"
}, gn = { key: 0 }, hn = { key: 1 }, yn = ["aria-label", "disabled"], kn = /* @__PURE__ */ H({
  __name: "ShapeTree",
  props: {
    shape: {},
    field: {},
    trail: {},
    path: {},
    selected: {},
    readonly: { type: Boolean },
    first: { type: Boolean },
    last: { type: Boolean },
    error: {}
  },
  emits: ["select", "add", "reorder"],
  setup(e, { emit: s }) {
    const l = e, u = s, i = ye(), m = A(), g = A(!1), c = U(() => [
      { label: "Move up", disabled: l.first, command: () => u("reorder", l.field, l.trail, -1) },
      { label: "Move down", disabled: l.last, command: () => u("reorder", l.field, l.trail, 1) }
    ]), k = A(!0);
    pe(() => l.selected, (o) => {
      const r = ie(l.field, l.trail);
      o !== r && o.startsWith(r + (l.trail.length ? "/" : "")) && (k.value = !0);
    });
    const q = U(() => l.trail.at(-1) !== "item"), S = U(() => q.value ? l.shape.name || "New field" : "Each item"), $ = U(() => l.trail.length ? void 0 : l.shape), f = U(() => l.shape.type === "object" || l.shape.type === "list");
    function x(o) {
      o.key === "ArrowRight" && f.value && (k.value = !0, o.preventDefault(), o.stopPropagation()), o.key === "ArrowLeft" && f.value && (k.value = !1, o.preventDefault(), o.stopPropagation());
    }
    return (o, r) => {
      const z = it("ShapeTree", !0);
      return a(), n("div", {
        class: "shape-tree-node",
        onKeydown: x
      }, [
        t("div", {
          class: Q(["row-item", { active: e.selected === p(ie)(e.field, e.trail) }])
        }, [
          f.value ? (a(), n("button", {
            key: 0,
            class: "tree-toggle kx-iconbtn kx-focus-outline",
            type: "button",
            "aria-label": `${k.value ? "Collapse" : "Expand"} ${e.path}`,
            "aria-expanded": k.value,
            onClick: r[0] || (r[0] = (R) => k.value = !k.value)
          }, [
            b(p(L), {
              icon: k.value ? "tabler:chevron-down" : "tabler:chevron-right"
            }, null, 8, ["icon"])
          ], 8, Za)) : (a(), n("span", _a)),
          t("button", {
            type: "button",
            class: "row-main kx-focus-halo",
            "aria-label": `Edit ${e.path}`,
            "aria-current": e.selected === p(ie)(e.field, e.trail) ? "true" : void 0,
            onClick: r[1] || (r[1] = (R) => u("select", e.field, e.trail))
          }, [
            t("span", tn, [
              t("span", ln, [
                b(p(L), {
                  icon: p(Xl)(e.shape.type),
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                t("span", {
                  class: "row-label",
                  title: S.value
                }, d(S.value), 9, an),
                e.error ? (a(), J(p(L), {
                  key: 0,
                  icon: "tabler:alert-circle",
                  class: "row-warn",
                  "aria-label": e.error,
                  title: e.error
                }, null, 8, ["aria-label", "title"])) : h("", !0)
              ])
            ]),
            t("span", nn, [
              t("span", sn, d(e.shape.type), 1),
              t("span", on, [
                q.value && e.shape.required ? (a(), n("span", un, [
                  b(p(L), {
                    icon: "tabler:asterisk",
                    "aria-hidden": "true"
                  })
                ])) : h("", !0),
                $.value?.strategy === "deep" ? (a(), n("span", dn, [
                  b(p(L), {
                    icon: "tabler:microscope",
                    "aria-hidden": "true"
                  })
                ])) : h("", !0),
                $.value?.search_within === "sections" ? (a(), n("span", rn, [
                  b(p(L), {
                    icon: "tabler:layout-list",
                    "aria-hidden": "true"
                  })
                ])) : h("", !0),
                $.value?.evidence_required ? (a(), n("span", cn, [
                  b(p(L), {
                    icon: "tabler:file-search",
                    "aria-hidden": "true"
                  })
                ])) : h("", !0)
              ])
            ])
          ], 8, en),
          !e.readonly && q.value ? (a(), n("span", vn, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} up`,
              disabled: e.first,
              onClick: r[2] || (r[2] = (R) => u("reorder", e.field, e.trail, -1))
            }, [
              b(p(L), { icon: "tabler:chevron-up" })
            ], 8, mn),
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} down`,
              disabled: e.last,
              onClick: r[3] || (r[3] = (R) => u("reorder", e.field, e.trail, 1))
            }, [
              b(p(L), { icon: "tabler:chevron-down" })
            ], 8, pn)
          ])) : h("", !0),
          !e.readonly && q.value ? (a(), n("div", {
            key: 3,
            class: "row-overflow",
            onKeydown: r[7] || (r[7] = ve(() => {
            }, ["stop"]))
          }, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Actions for ${e.path}`,
              "aria-haspopup": "menu",
              "aria-expanded": g.value,
              "aria-controls": p(i),
              onClick: r[4] || (r[4] = (R) => m.value.toggle(R))
            }, [
              b(p(L), { icon: "tabler:dots" })
            ], 8, bn),
            b(p(Et), {
              id: p(i),
              ref_key: "menu",
              ref: m,
              model: c.value,
              popup: "",
              "append-to": "self",
              onShow: r[5] || (r[5] = (R) => g.value = !0),
              onHide: r[6] || (r[6] = (R) => g.value = !1)
            }, null, 8, ["id", "model"])
          ], 32)) : h("", !0)
        ], 2),
        f.value && k.value ? (a(), n("ul", fn, [
          (a(!0), n(M, null, I(e.shape.properties, (R, N) => (a(), n("li", { key: N }, [
            b(z, {
              shape: R,
              field: e.field,
              trail: [...e.trail, N],
              path: `${e.path}.${R.name || "New property"}`,
              selected: e.selected,
              readonly: e.readonly,
              first: N === 0,
              last: N === e.shape.properties.length - 1,
              onSelect: r[8] || (r[8] = (P, G) => u("select", P, G)),
              onAdd: r[9] || (r[9] = (P, G) => u("add", P, G)),
              onReorder: r[10] || (r[10] = (P, G, j) => u("reorder", P, G, j))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly", "first", "last"])
          ]))), 128)),
          e.shape.item ? (a(), n("li", gn, [
            b(z, {
              shape: e.shape.item,
              field: e.field,
              trail: [...e.trail, "item"],
              path: `${e.path}[]`,
              selected: e.selected,
              readonly: e.readonly,
              onSelect: r[11] || (r[11] = (R, N) => u("select", R, N)),
              onAdd: r[12] || (r[12] = (R, N) => u("add", R, N)),
              onReorder: r[13] || (r[13] = (R, N, P) => u("reorder", R, N, P))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly"])
          ])) : h("", !0),
          !e.readonly && e.shape.type === "object" && e.trail.length + 1 < p(Ae) ? (a(), n("li", hn, [
            t("button", {
              type: "button",
              class: "kx-btn kx-btn-ghost kx-focus-halo sm",
              "aria-label": `Add property to ${e.path}`,
              disabled: (e.shape.properties?.length ?? 0) >= 100,
              onClick: r[14] || (r[14] = (R) => u("add", e.field, e.trail))
            }, [
              b(p(L), { icon: "tabler:plus" }),
              r[15] || (r[15] = F("Add property", -1))
            ], 8, yn)
          ])) : h("", !0)
        ])) : h("", !0)
      ], 32);
    };
  }
}), $n = { class: "label-block" }, xn = {
  key: 0,
  class: "muted"
}, wn = ["config"], Vn = {
  key: 2,
  class: "field-error",
  role: "alert"
}, Sn = {
  key: 3,
  role: "status",
  class: "muted picker-pending picker-pending--list"
}, Cn = /* @__PURE__ */ H({
  __name: "AgentPicker",
  props: {
    value: {},
    readonly: { type: Boolean }
  },
  emits: ["select"],
  setup(e, { emit: s }) {
    const l = s, u = A(!!customElements.get("wc-agent-picker")), i = A("");
    Ue(async () => {
      if (!u.value)
        try {
          await Ze("wc-agent-picker", { timeoutMs: 8e3 }), u.value = !0;
        } catch (g) {
          i.value = g instanceof Error ? g.message : String(g);
        }
    });
    function m(g) {
      if (g.composedPath()[0] !== g.currentTarget) return;
      const c = g.detail;
      l("select", c.agent_id);
    }
    return (g, c) => (a(), n("div", $n, [
      c[0] || (c[0] = t("span", null, "Scout agent", -1)),
      e.readonly ? (a(), n("p", xn, d(e.value || "Built-in scout"), 1)) : u.value ? (a(), n("wc-agent-picker", {
        key: 1,
        config: JSON.stringify({ agent_id: e.value || "" }),
        "aria-label": "Scout agent",
        placeholder: "Choose your agent…",
        onChange: m
      }, null, 40, wn)) : i.value ? (a(), n("p", Vn, "Could not load agent picker: " + d(i.value), 1)) : (a(), n("span", Sn, "Loading agents…")),
      c[1] || (c[1] = t("small", null, "Leave empty to use the built-in scout.", -1))
    ]));
  }
}), En = ["value", "capability", "aria-labelledby"], qn = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, Un = {
  key: 2,
  class: "dz-muted picker-pending",
  role: "status"
}, ce = /* @__PURE__ */ H({
  __name: "ModelPicker",
  props: {
    value: {},
    capability: {},
    labelledBy: {}
  },
  emits: ["select"],
  setup(e, { emit: s }) {
    const l = s, u = A(!!customElements.get("wc-model-picker")), i = A("");
    Ue(async () => {
      if (!u.value)
        try {
          await Ze("wc-model-picker", { timeoutMs: 8e3 }), u.value = !0;
        } catch (g) {
          i.value = g instanceof Error ? g.message : String(g);
        }
    });
    function m(g) {
      const c = g.detail;
      typeof c == "string" && l("select", c);
    }
    return (g, c) => u.value ? (a(), n("wc-model-picker", {
      key: 0,
      value: e.value,
      capability: e.capability,
      "aria-labelledby": e.labelledBy,
      onSelect: m
    }, null, 40, En)) : i.value ? (a(), n("p", qn, "Could not load model picker: " + d(i.value), 1)) : (a(), n("span", Un, "Loading models…"));
  }
}), Fn = { class: "slider" }, Nn = { class: "slider-head" }, Mn = { class: "slider-value" }, An = ["aria-label", "aria-valuetext", "disabled"], Rn = {
  key: 0,
  class: "slider-hints"
}, Ln = { key: 1 }, Ve = 1e3, te = /* @__PURE__ */ H({
  __name: "Slider",
  props: /* @__PURE__ */ Xe({
    label: {},
    min: {},
    max: {},
    step: { default: 1 },
    log: { type: Boolean },
    percent: { type: Boolean },
    unit: {},
    hints: {},
    note: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const s = e, l = Be(e, "modelValue"), u = U(() => s.percent ? `${Math.round(l.value * 100)}%` : `${l.value.toLocaleString()}${s.unit ? ` ${s.unit}` : ""}`), i = (c) => s.log ? Math.log(c / s.min) / Math.log(s.max / s.min) * Ve : (c - s.min) / (s.max - s.min) * Ve;
    function m(c) {
      const k = s.log ? s.min * Math.pow(s.max / s.min, c / Ve) : s.min + (s.max - s.min) * c / Ve, q = Math.round(k / s.step) * s.step;
      return Math.min(s.max, Math.max(s.min, Number(q.toFixed(4))));
    }
    const g = U({ get: () => Math.round(i(l.value)), set: (c) => {
      l.value = m(c);
    } });
    return (c, k) => (a(), n("div", Fn, [
      t("div", Nn, [
        t("span", null, d(e.label), 1),
        t("output", Mn, d(u.value), 1)
      ]),
      W(t("input", {
        "onUpdate:modelValue": k[0] || (k[0] = (q) => g.value = q),
        type: "range",
        min: "0",
        max: Ve,
        step: "1",
        "aria-label": e.label,
        "aria-valuetext": u.value,
        disabled: e.disabled,
        style: qe({ "--fill": `${g.value / Ve * 100}%` })
      }, null, 12, An), [
        [
          _,
          g.value,
          void 0,
          { number: !0 }
        ]
      ]),
      e.hints ? (a(), n("div", Rn, [
        t("span", null, d(e.hints[0]), 1),
        t("span", null, d(e.hints[1]), 1)
      ])) : h("", !0),
      e.note ? (a(), n("small", Ln, d(e.note), 1)) : h("", !0)
    ]));
  }
}), Bn = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, On = { class: "fd-track" }, Pn = { class: "fd-node" }, Tn = { class: "fd-dots" }, Dn = { class: "fd-more" }, jn = { class: "fd-node goal" }, In = /* @__PURE__ */ H({
  __name: "ScoutDiagram",
  props: {
    rounds: {},
    confidence: {},
    extra: {}
  },
  setup(e) {
    const s = e;
    return (l, u) => (a(), n("figure", Bn, [
      t("div", On, [
        u[2] || (u[2] = t("span", { class: "fd-node solid" }, "Pass", -1)),
        (a(!0), n(M, null, I(Math.min(s.rounds, 8), (i) => (a(), n(M, { key: i }, [
          u[0] || (u[0] = t("span", { class: "fd-link" }, null, -1)),
          t("span", Pn, [
            t("span", null, "R" + d(i), 1),
            t("span", Tn, [
              (a(!0), n(M, null, I(Math.min(s.extra, 6), (m) => (a(), n("i", { key: m }))), 128))
            ])
          ])
        ], 64))), 128)),
        s.rounds > 8 ? (a(), n(M, { key: 0 }, [
          u[1] || (u[1] = t("span", { class: "fd-link" }, null, -1)),
          t("span", Dn, "+" + d(s.rounds - 8), 1)
        ], 64)) : h("", !0),
        u[3] || (u[3] = t("span", { class: "fd-link" }, null, -1)),
        t("span", jn, "≥ " + d(Math.round(s.confidence * 100)) + "%", 1)
      ]),
      t("figcaption", null, d(s.rounds ? `One pass, then up to ${s.rounds} rounds with up to ${s.extra} new queries each, stopping as soon as confidence reaches ${Math.round(s.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
    ]));
  }
}), zn = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, Wn = { class: "fd-grid" }, Hn = { class: "fd-node solid" }, Gn = { class: "fd-node" }, Kn = { class: "fd-node" }, Qn = { class: "fd-node goal" }, Jn = /* @__PURE__ */ H({
  __name: "DeepDiagram",
  props: {
    fields: {},
    parallel: {},
    queries: {},
    perQuery: {},
    cap: {}
  },
  setup(e) {
    const s = e, l = U(() => Math.min(s.queries * s.perQuery, s.cap));
    return (u, i) => (a(), n("figure", zn, [
      t("div", Wn, [
        t("span", Hn, [
          t("b", null, d(e.fields), 1),
          F(" field" + d(e.fields === 1 ? "" : "s"), 1),
          t("small", null, d(e.parallel) + " at a time", 1)
        ]),
        t("span", Gn, [
          t("b", null, d(e.queries), 1),
          i[0] || (i[0] = F(" queries", -1)),
          i[1] || (i[1] = t("small", null, "per field", -1))
        ]),
        t("span", Kn, [
          t("b", null, d(e.perQuery), 1),
          i[2] || (i[2] = F(" chunks", -1)),
          i[3] || (i[3] = t("small", null, "per query", -1))
        ]),
        t("span", Qn, [
          t("b", null, d(l.value), 1),
          i[4] || (i[4] = F(" chunks", -1)),
          t("small", null, d(e.queries * e.perQuery > e.cap ? `capped at ${e.cap}` : "read per field"), 1)
        ])
      ]),
      t("figcaption", null, "Each deep field gets its own queries; up to " + d(l.value) + " chunks are read for it before analysis.", 1)
    ]));
  }
}), Yn = ["disabled"], Xn = { class: "muted" }, Zn = { class: "toggle-row" }, _n = { class: "label-block" }, es = { class: "toggle-row" }, ts = {
  id: "model-map",
  class: "model-role"
}, ls = {
  key: 0,
  class: "chips"
}, as = {
  key: 1,
  class: "muted"
}, ns = { class: "toggle-row" }, ss = { class: "grid" }, os = ["onUpdate:modelValue"], is = ["onUpdate:modelValue"], us = ["onUpdate:modelValue"], ds = ["onClick"], rs = {
  key: 0,
  class: "muted"
}, cs = { class: "toggle-row" }, vs = { class: "label-block" }, ms = {
  id: "model-scout",
  class: "model-role"
}, ps = {
  key: 3,
  class: "muted"
}, bs = {
  key: 4,
  class: "toggle-row"
}, fs = { class: "toggle-row" }, gs = { class: "toggle-row" }, hs = { class: "label-block" }, ys = {
  id: "model-deep",
  class: "model-role"
}, ks = {
  id: "model-deep-query",
  class: "model-role"
}, $s = { class: "label-block" }, xs = {
  id: "model-extract",
  class: "model-role"
}, ws = { class: "output-list" }, Vs = { class: "chip" }, Ss = {
  key: 1,
  class: "muted"
}, Cs = { class: "toggle-row" }, Es = { class: "toggle-row" }, qs = { class: "toggle-row" }, Us = { class: "toggle-row" }, Fs = {
  id: "model-verify",
  class: "model-role"
}, Ns = /* @__PURE__ */ H({
  __name: "StepInspector",
  props: {
    stage: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const s = e, l = U(() => s.config.stages), u = (x) => El(s.stage, x), i = Vl(), m = U(() => s.config.fields.filter((x) => x.strategy === "deep").length), g = U(() => s.config.fields.filter((x) => x.search_within === "sections").map((x) => x.name || "New field")), c = U(() => qt(s.config)), k = U({ get: () => l.value.extract.reads ?? "text", set: (x) => {
      l.value.extract.reads = x, x === "pages" && l.value.extract.max_pages === void 0 && (l.value.extract.max_pages = 8);
    } }), q = U({ get: () => l.value.extract.max_pages ?? 8, set: (x) => {
      l.value.extract.max_pages = x;
    } });
    function S(x) {
      l.value.verify.check_support = x, x || (l.value.verify.check_completeness = !1);
    }
    function $(x) {
      x ? l.value.scout.agent_id = x : delete l.value.scout.agent_id;
    }
    function f(x, o) {
      const r = l.value.scout.tools.filter((z) => z !== x);
      l.value.scout.tools = o ? [...r, x] : r;
    }
    return (x, o) => (a(), n("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", Xn, d(p(Sl)[e.stage]), 1),
      e.stage === "map" ? (a(), n(M, { key: 0 }, [
        t("div", Zn, [
          o[35] || (o[35] = t("span", null, "Stage enabled", -1)),
          b(Z, {
            modelValue: l.value.map.enabled,
            "onUpdate:modelValue": o[0] || (o[0] = (r) => l.value.map.enabled = r),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", _n, [
          o[36] || (o[36] = t("span", { id: "outline-label" }, "Outline", -1)),
          b(he, {
            modelValue: l.value.map.outline,
            "onUpdate:modelValue": o[1] || (o[1] = (r) => l.value.map.outline = r),
            "labelled-by": "outline-label",
            options: [{ value: "find_or_build", label: "Use contents first" }, { value: "build", label: "Always build" }]
          }, null, 8, ["modelValue"]),
          o[37] || (o[37] = t("small", null, "The document's own headings are used when it has them; otherwise the model builds an outline.", -1))
        ]),
        t("div", es, [
          o[38] || (o[38] = t("span", null, [
            F("Section summaries"),
            t("small", null, "A short summary per section helps pick the right sections in long documents.")
          ], -1)),
          b(Z, {
            modelValue: l.value.map.section_summaries,
            "onUpdate:modelValue": o[2] || (o[2] = (r) => l.value.map.section_summaries = r),
            label: "Section summaries",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        o[40] || (o[40] = t("h4", null, "Models", -1)),
        t("div", ts, [
          o[39] || (o[39] = t("span", null, "Outliner", -1)),
          b(ce, {
            value: l.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: o[3] || (o[3] = (r) => l.value.map.model = r)
          }, null, 8, ["value"])
        ]),
        o[41] || (o[41] = t("h4", null, "Fields that read sections", -1)),
        g.value.length ? (a(), n("p", ls, [
          (a(!0), n(M, null, I(g.value, (r) => (a(), n("span", {
            key: r,
            class: "chip primary"
          }, d(r), 1))), 128))
        ])) : (a(), n("p", as, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : h("", !0),
      e.stage === "prefetch" ? (a(), n(M, { key: 1 }, [
        t("div", ns, [
          o[42] || (o[42] = t("span", null, "Stage enabled", -1)),
          b(Z, {
            modelValue: l.value.prefetch.enabled,
            "onUpdate:modelValue": o[4] || (o[4] = (r) => l.value.prefetch.enabled = r),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        o[46] || (o[46] = t("h4", null, "Queries", -1)),
        (a(!0), n(M, null, I(l.value.prefetch.queries, (r, z) => (a(), n("div", {
          key: z,
          class: "query-row"
        }, [
          t("div", ss, [
            t("label", null, [
              o[43] || (o[43] = F("Name", -1)),
              W(t("input", {
                "onUpdate:modelValue": (R) => r.name = R,
                placeholder: "Parties"
              }, null, 8, os), [
                [_, r.name]
              ])
            ]),
            t("label", null, [
              o[44] || (o[44] = F("Chunks", -1)),
              W(t("input", {
                "onUpdate:modelValue": (R) => r.chunks = R,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, is), [
                [
                  _,
                  r.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          t("label", null, [
            o[45] || (o[45] = F("Query", -1)),
            W(t("textarea", {
              "onUpdate:modelValue": (R) => r.query = R,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, us), [
              [_, r.query]
            ])
          ]),
          e.readonly ? h("", !0) : (a(), n("button", {
            key: 0,
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo sm",
            onClick: (R) => l.value.prefetch.queries.splice(z, 1)
          }, "Remove query", 8, ds))
        ]))), 128)),
        l.value.prefetch.queries.length ? h("", !0) : (a(), n("p", rs, "No fixed queries. Field search hints still run.")),
        e.readonly ? h("", !0) : (a(), n("button", {
          key: 1,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          onClick: o[5] || (o[5] = (r) => l.value.prefetch.queries.push(p(Cl)()))
        }, "Add query"))
      ], 64)) : h("", !0),
      e.stage === "scout" ? (a(), n(M, { key: 2 }, [
        t("div", cs, [
          o[47] || (o[47] = t("span", null, "Stage enabled", -1)),
          b(Z, {
            modelValue: l.value.scout.enabled,
            "onUpdate:modelValue": o[6] || (o[6] = (r) => l.value.scout.enabled = r),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", vs, [
          o[48] || (o[48] = t("span", { id: "mode-label" }, "Mode", -1)),
          b(he, {
            modelValue: l.value.scout.mode,
            "onUpdate:modelValue": o[7] || (o[7] = (r) => l.value.scout.mode = r),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          t("small", null, d(l.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        l.value.scout.mode === "agent" ? (a(), J(Cn, {
          key: 0,
          value: l.value.scout.agent_id,
          readonly: e.readonly,
          onSelect: $
        }, null, 8, ["value", "readonly"])) : h("", !0),
        l.value.scout.mode === "loop" ? (a(), J(In, {
          key: 1,
          rounds: l.value.scout.max_rounds,
          confidence: l.value.scout.target_confidence,
          extra: l.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"])) : h("", !0),
        o[53] || (o[53] = t("h4", null, "Models", -1)),
        t("div", ms, [
          o[49] || (o[49] = t("span", null, "Scout", -1)),
          b(ce, {
            value: l.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: o[8] || (o[8] = (r) => l.value.scout.model = r)
          }, null, 8, ["value"])
        ]),
        o[54] || (o[54] = t("h4", null, "Loop", -1)),
        b(te, {
          modelValue: l.value.scout.max_rounds,
          "onUpdate:modelValue": o[9] || (o[9] = (r) => l.value.scout.max_rounds = r),
          label: l.value.scout.mode === "agent" ? "Rounds" : "Follow-up rounds",
          min: u("max_rounds").min,
          max: u("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        l.value.scout.mode === "loop" ? (a(), J(te, {
          key: 2,
          modelValue: l.value.scout.target_confidence,
          "onUpdate:modelValue": o[10] || (o[10] = (r) => l.value.scout.target_confidence = r),
          label: "Stop at confidence",
          min: u("target_confidence").min,
          max: u("target_confidence").max,
          step: 0.05,
          percent: "",
          hints: ["Stop early", "Keep looking"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])) : h("", !0),
        b(te, {
          modelValue: l.value.scout.max_extra_queries,
          "onUpdate:modelValue": o[11] || (o[11] = (r) => l.value.scout.max_extra_queries = r),
          label: l.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: u("max_extra_queries").min,
          max: u("max_extra_queries").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        b(te, {
          modelValue: l.value.scout.max_tokens,
          "onUpdate:modelValue": o[12] || (o[12] = (r) => l.value.scout.max_tokens = r),
          label: "Scout output limit",
          min: u("max_tokens").min,
          max: u("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        l.value.scout.mode === "agent" ? (a(), n("p", ps, "Tool budget: " + d(l.value.scout.max_rounds * l.value.scout.max_extra_queries) + " calls.", 1)) : h("", !0),
        l.value.scout.mode === "loop" ? (a(), n("div", bs, [
          o[50] || (o[50] = t("span", null, [
            F("Drop noisy chunks"),
            t("small", null, "Chunks no field needs leave the evidence pool; chunks cited for a field always stay.")
          ], -1)),
          b(Z, {
            modelValue: l.value.scout.drop_noise,
            "onUpdate:modelValue": o[13] || (o[13] = (r) => l.value.scout.drop_noise = r),
            label: "Drop noisy chunks",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])) : h("", !0),
        t("div", fs, [
          o[51] || (o[51] = t("span", null, [
            F("Share scout notes with extraction"),
            t("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          b(Z, {
            modelValue: l.value.scout.share_notes,
            "onUpdate:modelValue": o[14] || (o[14] = (r) => l.value.scout.share_notes = r),
            label: "Share scout notes with extraction",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l.value.scout.mode === "agent" ? (a(), n(M, { key: 5 }, [
          o[52] || (o[52] = t("h4", null, "Agent tools", -1)),
          (a(!0), n(M, null, I(p(i), (r) => (a(), n("div", {
            key: r,
            class: "toggle-row"
          }, [
            t("span", null, d(p(at)(r)), 1),
            b(Z, {
              "model-value": l.value.scout.tools.includes(r),
              label: p(at)(r),
              disabled: e.readonly,
              "onUpdate:modelValue": (z) => f(r, z)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : h("", !0)
      ], 64)) : h("", !0),
      e.stage === "deep" ? (a(), n(M, { key: 3 }, [
        t("div", gs, [
          o[55] || (o[55] = t("span", null, "Stage enabled", -1)),
          b(Z, {
            modelValue: l.value.deep.enabled,
            "onUpdate:modelValue": o[15] || (o[15] = (r) => l.value.deep.enabled = r),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        b(Jn, {
          fields: m.value,
          parallel: l.value.deep.parallel_fields,
          queries: l.value.deep.max_queries,
          "per-query": l.value.deep.chunks_per_query,
          cap: l.value.deep.chunk_cap
        }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"]),
        t("div", hs, [
          o[56] || (o[56] = t("span", { id: "read-label" }, "Reads", -1)),
          b(he, {
            modelValue: l.value.deep.read,
            "onUpdate:modelValue": o[16] || (o[16] = (r) => l.value.deep.read = r),
            "labelled-by": "read-label",
            options: [{ value: "chunks", label: "Retrieved chunks" }, { value: "sections", label: "Whole sections" }]
          }, null, 8, ["modelValue"]),
          o[57] || (o[57] = t("small", null, "Whole sections suit clauses that span many passages; long sections fall back to chunks.", -1))
        ]),
        o[60] || (o[60] = t("h4", null, "Models", -1)),
        t("div", ys, [
          o[58] || (o[58] = t("span", null, "Analysis", -1)),
          b(ce, {
            value: l.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: o[17] || (o[17] = (r) => l.value.deep.model = r)
          }, null, 8, ["value"])
        ]),
        t("div", ks, [
          o[59] || (o[59] = t("span", null, "Query writer", -1)),
          b(ce, {
            value: l.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: o[18] || (o[18] = (r) => l.value.deep.query_model = r)
          }, null, 8, ["value"])
        ]),
        o[61] || (o[61] = t("h4", null, "Reach", -1)),
        b(te, {
          modelValue: l.value.deep.parallel_fields,
          "onUpdate:modelValue": o[19] || (o[19] = (r) => l.value.deep.parallel_fields = r),
          label: "Fields at a time",
          min: u("parallel_fields").min,
          max: u("parallel_fields").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(te, {
          modelValue: l.value.deep.max_queries,
          "onUpdate:modelValue": o[20] || (o[20] = (r) => l.value.deep.max_queries = r),
          label: "Queries per field",
          min: u("max_queries").min,
          max: u("max_queries").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(te, {
          modelValue: l.value.deep.chunks_per_query,
          "onUpdate:modelValue": o[21] || (o[21] = (r) => l.value.deep.chunks_per_query = r),
          label: "Chunks per query",
          min: u("chunks_per_query").min,
          max: u("chunks_per_query").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(te, {
          modelValue: l.value.deep.chunk_cap,
          "onUpdate:modelValue": o[22] || (o[22] = (r) => l.value.deep.chunk_cap = r),
          label: "Chunk cap per field",
          min: u("chunk_cap").min,
          max: u("chunk_cap").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(te, {
          modelValue: l.value.deep.min_similarity,
          "onUpdate:modelValue": o[23] || (o[23] = (r) => l.value.deep.min_similarity = r),
          label: "Minimum similarity",
          min: u("min_similarity").min,
          max: u("min_similarity").max,
          step: 0.05,
          percent: "",
          hints: ["Loose", "Strict"],
          note: "Chunks less similar than this are skipped.",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        o[62] || (o[62] = t("h4", null, "Temperature", -1)),
        b(te, {
          modelValue: l.value.deep.query_temperature,
          "onUpdate:modelValue": o[24] || (o[24] = (r) => l.value.deep.query_temperature = r),
          label: "Query writing",
          min: u("query_temperature").min,
          max: u("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(te, {
          modelValue: l.value.deep.analysis_temperature,
          "onUpdate:modelValue": o[25] || (o[25] = (r) => l.value.deep.analysis_temperature = r),
          label: "Analysis",
          min: u("analysis_temperature").min,
          max: u("analysis_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : h("", !0),
      e.stage === "extract" ? (a(), n(M, { key: 4 }, [
        t("div", $s, [
          o[63] || (o[63] = t("span", { id: "extract-reads-label" }, "Read values from", -1)),
          b(he, {
            modelValue: k.value,
            "onUpdate:modelValue": o[26] || (o[26] = (r) => k.value = r),
            "labelled-by": "extract-reads-label",
            name: "Read values from",
            options: [{ value: "text", label: "Text" }, { value: "pages", label: "Page images" }],
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        k.value === "pages" ? (a(), n(M, { key: 0 }, [
          o[64] || (o[64] = t("p", { class: "muted" }, "Extraction and visual support need models with vision. Text retrieval selects pages; section boundaries that share a page are unsupported.", -1)),
          b(te, {
            modelValue: q.value,
            "onUpdate:modelValue": o[27] || (o[27] = (r) => q.value = r),
            label: "Page images per call",
            min: u("max_pages").min,
            max: u("max_pages").max,
            disabled: e.readonly,
            note: "The context budget can admit fewer pages."
          }, null, 8, ["modelValue", "min", "max", "disabled"])
        ], 64)) : h("", !0),
        o[66] || (o[66] = t("h4", null, "Models", -1)),
        t("div", xs, [
          o[65] || (o[65] = t("span", null, "Extraction", -1)),
          b(ce, {
            value: l.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: o[28] || (o[28] = (r) => l.value.extract.model = r)
          }, null, 8, ["value"])
        ]),
        o[67] || (o[67] = t("h4", null, "Field groups", -1)),
        t("ul", ws, [
          (a(!0), n(M, null, I(c.value, (r) => (a(), n("li", {
            key: r.name
          }, [
            t("span", null, d(r.name), 1),
            t("span", Vs, d(r.fields.length) + " field" + d(r.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        c.value.length ? h("", !0) : (a(), n("p", Ss, "No fields yet.")),
        b(te, {
          modelValue: l.value.extract.max_fields_per_call,
          "onUpdate:modelValue": o[29] || (o[29] = (r) => l.value.extract.max_fields_per_call = r),
          label: "Fields per call",
          min: u("max_fields_per_call").min,
          max: u("max_fields_per_call").max,
          disabled: e.readonly,
          note: `${p($t)(e.config)} extraction call${p($t)(e.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        b(te, {
          modelValue: l.value.extract.max_output_tokens,
          "onUpdate:modelValue": o[30] || (o[30] = (r) => l.value.extract.max_output_tokens = r),
          label: "Output limit",
          min: u("max_output_tokens").min,
          max: u("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : h("", !0),
      e.stage === "verify" ? (a(), n(M, { key: 5 }, [
        t("div", Cs, [
          o[68] || (o[68] = t("span", null, "Stage enabled", -1)),
          b(Z, {
            modelValue: l.value.verify.enabled,
            "onUpdate:modelValue": o[31] || (o[31] = (r) => l.value.verify.enabled = r),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Es, [
          t("span", null, [
            o[69] || (o[69] = F("Quotes exist", -1)),
            t("small", null, d(k.value === "pages" ? "Text agreement is informational; visual support determines verification." : "Each quote is matched against the document text. No model call."), 1)
          ]),
          b(Z, {
            modelValue: l.value.verify.check_quotes,
            "onUpdate:modelValue": o[32] || (o[32] = (r) => l.value.verify.check_quotes = r),
            label: "Quotes exist",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", qs, [
          t("span", null, [
            o[70] || (o[70] = F("Quotes support values", -1)),
            t("small", null, d(k.value === "pages" ? "A vision model checks the quote and value against physical page images." : "A model confirms each quote supports its value."), 1)
          ]),
          b(Z, {
            "model-value": l.value.verify.check_support,
            "onUpdate:modelValue": S,
            label: "Quotes support values",
            disabled: e.readonly
          }, null, 8, ["model-value", "disabled"])
        ]),
        l.value.verify.check_support ? (a(), n(M, { key: 0 }, [
          t("div", Us, [
            o[71] || (o[71] = t("span", null, [
              F("Check completeness"),
              t("small", null, "Check the requested text and lists against additional source passages. Adds input tokens; completeness can remain unknown.")
            ], -1)),
            b(Z, {
              "model-value": l.value.verify.check_completeness === !0,
              "onUpdate:modelValue": o[33] || (o[33] = (r) => l.value.verify.check_completeness = r),
              label: "Check completeness",
              disabled: e.readonly
            }, null, 8, ["model-value", "disabled"])
          ]),
          o[73] || (o[73] = t("h4", null, "Models", -1)),
          t("div", Fs, [
            o[72] || (o[72] = t("span", null, "Checker", -1)),
            b(ce, {
              value: l.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: o[34] || (o[34] = (r) => l.value.verify.model = r)
            }, null, 8, ["value"])
          ])
        ], 64)) : h("", !0)
      ], 64)) : h("", !0)
    ], 8, Yn));
  }
}), Ms = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, As = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, Rs = ["x", "y", "width"], Ls = ["x", "width"], Bs = /* @__PURE__ */ H({
  __name: "ChunkDiagram",
  props: {
    size: {},
    overlap: {}
  },
  setup(e) {
    const s = e, l = U(() => Math.min(0.9, Math.max(0, s.overlap / s.size))), u = U(() => {
      const i = 100 / (3 - 2 * l.value);
      return [0, 1, 2].map((m) => ({ x: m * i * (1 - l.value), w: i }));
    });
    return (i, m) => (a(), n("figure", Ms, [
      (a(), n("svg", As, [
        (a(!0), n(M, null, I(u.value, (g, c) => (a(), n("rect", {
          key: c,
          x: g.x,
          y: c % 2 ? 14 : 4,
          width: g.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, Rs))), 128)),
        (a(), n(M, null, I([1, 2], (g) => t("rect", {
          key: "o" + g,
          x: u.value[g].x,
          y: 4,
          width: u.value[g - 1].x + u.value[g - 1].w - u.value[g].x,
          height: "24",
          class: "shared"
        }, null, 8, Ls)), 64))
      ])),
      t("figcaption", null, d(e.size.toLocaleString()) + " tokens per chunk · " + d(e.overlap.toLocaleString()) + " shared with the next (" + d(Math.round(l.value * 100)) + "%)", 1)
    ]));
  }
}), Os = ["disabled"], Ps = { class: "muted" }, Ts = { class: "toggle-row" }, Ds = { class: "toggle-row" }, js = { class: "label-block" }, Is = {
  key: 0,
  id: "context-model",
  class: "model-role"
}, zs = { class: "label-block" }, Ws = {
  id: "embedding-model",
  class: "model-role"
}, Hs = { class: "toggle-row" }, Gs = {
  key: 1,
  id: "highlighter-model",
  class: "model-role"
}, Ks = /* @__PURE__ */ H({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const s = e, l = U(() => s.config.retrieval), u = U({ get: () => s.config.retention ?? "", set: (S) => {
      S.trim() ? s.config.retention = S.trim() : delete s.config.retention;
    } }), i = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], m = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], g = et("chunk_size"), c = et("overlap"), k = et("section_budget"), q = U(() => Math.min(c.max, l.value.chunk_size - 50));
    return (S, $) => (a(), n("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", Ps, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + d(e.retention) + ".", 1),
      t("label", null, [
        $[12] || ($[12] = F("Retention window", -1)),
        W(t("input", {
          "onUpdate:modelValue": $[0] || ($[0] = (f) => u.value = f),
          "aria-label": "Retention window",
          placeholder: "Global setting"
        }, null, 512), [
          [_, u.value]
        ]),
        $[13] || ($[13] = t("small", null, "Duration for new processed documents and runs, for example 24h. Leave empty to use the global Docscout setting. Existing records keep their expiry.", -1))
      ]),
      $[22] || ($[22] = t("h4", null, "Chunks", -1)),
      b(Bs, {
        size: l.value.chunk_size,
        overlap: l.value.overlap
      }, null, 8, ["size", "overlap"]),
      b(te, {
        modelValue: l.value.chunk_size,
        "onUpdate:modelValue": $[1] || ($[1] = (f) => l.value.chunk_size = f),
        label: "Chunk size",
        min: p(g).min,
        max: p(g).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      b(te, {
        modelValue: l.value.overlap,
        "onUpdate:modelValue": $[2] || ($[2] = (f) => l.value.overlap = f),
        label: "Overlap",
        min: p(c).min,
        max: q.value,
        step: 10,
        unit: "tokens",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      t("div", Ts, [
        $[14] || ($[14] = t("span", null, [
          F("Split by headings"),
          t("small", null, "A chunk never crosses a heading.")
        ], -1)),
        b(Z, {
          modelValue: l.value.split_headings,
          "onUpdate:modelValue": $[3] || ($[3] = (f) => l.value.split_headings = f),
          label: "Split by headings",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t("div", Ds, [
        $[15] || ($[15] = t("span", null, [
          F("Keep tables whole"),
          t("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        b(Z, {
          modelValue: l.value.keep_tables,
          "onUpdate:modelValue": $[4] || ($[4] = (f) => l.value.keep_tables = f),
          label: "Keep tables whole",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      b(te, {
        modelValue: l.value.section_budget,
        "onUpdate:modelValue": $[5] || ($[5] = (f) => l.value.section_budget = f),
        label: "Section budget",
        min: p(k).min,
        max: p(k).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      $[23] || ($[23] = t("h4", null, "Context", -1)),
      t("div", js, [
        $[16] || ($[16] = t("span", { id: "context-label" }, "Chunk context", -1)),
        b(he, {
          modelValue: l.value.context,
          "onUpdate:modelValue": $[6] || ($[6] = (f) => l.value.context = f),
          "labelled-by": "context-label",
          options: m
        }, null, 8, ["modelValue"]),
        t("small", null, d(m.find((f) => f.value === l.value.context)?.note), 1)
      ]),
      l.value.context === "generated" ? (a(), n("div", Is, [
        $[17] || ($[17] = t("span", null, "Context writer", -1)),
        b(ce, {
          value: l.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: $[7] || ($[7] = (f) => l.value.context_model = f)
        }, null, 8, ["value"])
      ])) : h("", !0),
      $[24] || ($[24] = t("h4", null, "Search", -1)),
      t("div", zs, [
        $[18] || ($[18] = t("span", { id: "mode-label" }, "Search mode", -1)),
        b(he, {
          modelValue: l.value.search_mode,
          "onUpdate:modelValue": $[8] || ($[8] = (f) => l.value.search_mode = f),
          "labelled-by": "mode-label",
          options: i
        }, null, 8, ["modelValue"]),
        t("small", null, d(i.find((f) => f.value === l.value.search_mode)?.note), 1)
      ]),
      $[25] || ($[25] = t("h4", null, "Models", -1)),
      t("div", Ws, [
        $[19] || ($[19] = t("span", null, "Embedding", -1)),
        b(ce, {
          value: l.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: $[9] || ($[9] = (f) => l.value.embedding_model = f)
        }, null, 8, ["value"])
      ]),
      t("div", Hs, [
        $[20] || ($[20] = t("span", null, [
          F("Highlighter"),
          t("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        b(Z, {
          modelValue: l.value.highlighter,
          "onUpdate:modelValue": $[10] || ($[10] = (f) => l.value.highlighter = f),
          label: "Highlighter",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      l.value.highlighter ? (a(), n("div", Gs, [
        $[21] || ($[21] = t("span", null, "Highlighter", -1)),
        b(ce, {
          value: l.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: $[11] || ($[11] = (f) => l.value.highlighter_model = f)
        }, null, 8, ["value"])
      ])) : h("", !0)
    ], 8, Os));
  }
}), Qs = ["inert"], Js = { class: "canvas-inner" }, Ys = {
  class: "block fields-block",
  "aria-labelledby": "fields-head"
}, Xs = { class: "block-head" }, Zs = ["aria-expanded"], _s = { class: "count" }, eo = {
  key: 0,
  class: "block-peek"
}, to = {
  key: 1,
  class: "field-add-actions push"
}, lo = ["aria-expanded", "aria-controls", "disabled"], ao = ["disabled"], no = {
  id: "fields-body",
  class: "block-body"
}, so = {
  key: 0,
  class: "block-empty"
}, oo = { class: "field-tree" }, io = ["id"], uo = {
  class: "tree-indent",
  "aria-hidden": "true"
}, ro = { class: "shape-preview" }, co = { class: "kx-focus-outline" }, vo = {
  key: 0,
  class: "field-error",
  role: "alert"
}, mo = {
  key: 1,
  class: "preview-grid"
}, po = { "aria-label": "Output shape" }, bo = { "aria-label": "Example output" }, fo = {
  class: "block",
  "aria-labelledby": "flow-head"
}, go = { class: "block-head" }, ho = ["aria-expanded"], yo = { class: "count" }, ko = {
  key: 0,
  class: "block-peek"
}, $o = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, xo = { class: "node-icon" }, wo = { class: "node-main" }, Vo = { class: "node-summary" }, So = { class: "node-side" }, Co = { class: "chip model" }, Eo = { class: "branches" }, qo = { class: "branch" }, Uo = { class: "branch" }, Fo = { class: "node-icon" }, No = { class: "node-main" }, Mo = { class: "node-summary" }, Ao = ["aria-labelledby", "role", "aria-modal"], Ro = ["aria-valuenow"], Lo = { class: "side-panel-head" }, Bo = { class: "side-panel-icon" }, Oo = ["id"], Po = ["aria-label", "title"], To = { class: "node-breadcrumb mono" }, Do = {
  key: 0,
  class: "move-node",
  "aria-label": "Move node"
}, jo = {
  key: 0,
  value: ""
}, Io = {
  key: 1,
  value: "",
  disabled: ""
}, zo = ["value"], Wo = ["disabled"], Ho = ["disabled"], Go = {
  key: 4,
  class: "inspector-form"
}, Ko = { class: "output-list" }, Qo = { class: "mono" }, Jo = { class: "chip" }, Yo = { class: "rail-label" }, tt = 400, We = 320, Xo = /* @__PURE__ */ H({
  __name: "Builder",
  props: /* @__PURE__ */ Xe({
    config: {},
    retention: {},
    result: {},
    readonly: { type: Boolean }
  }, {
    title: { required: !0 },
    titleModifiers: {},
    description: { required: !0 },
    descriptionModifiers: {}
  }),
  emits: ["update:title", "update:description"],
  setup(e) {
    const s = e, l = Be(e, "title"), u = Be(e, "description"), i = A({ kind: "document" });
    function m(w, v) {
      try {
        const E = localStorage.getItem(`docscout.${w}`);
        return E === null ? v : E === "1";
      } catch {
        return v;
      }
    }
    function g(w, v) {
      try {
        localStorage.setItem(`docscout.${w}`, v ? "1" : "0");
      } catch {
      }
    }
    const c = A(m("panel", !0)), k = A(m("fields", !0)), q = A(m("flow", !0));
    function S() {
      try {
        const w = Number(localStorage.getItem("docscout.panelWidth"));
        return w >= We ? w : tt;
      } catch {
        return tt;
      }
    }
    const $ = A(S()), f = () => {
      const w = T.value?.clientWidth;
      return w ? Math.max(We, w - 420) : Number.POSITIVE_INFINITY;
    };
    function x(w, v = !0) {
      if ($.value = Math.round(Math.min(f(), Math.max(We, w))), v)
        try {
          localStorage.setItem("docscout.panelWidth", String($.value));
        } catch {
        }
    }
    const o = A(!1);
    function r(w) {
      const v = w.currentTarget, E = w.clientX, Y = $.value;
      v.setPointerCapture(w.pointerId), o.value = !0;
      const X = (ee) => x(Y + (E - ee.clientX), !1), ae = () => {
        o.value = !1, x($.value), v.removeEventListener("pointermove", X), v.removeEventListener("pointerup", ae);
      };
      v.addEventListener("pointermove", X), v.addEventListener("pointerup", ae);
    }
    function z(w) {
      w.key === "ArrowLeft" ? (x($.value + 24), w.preventDefault()) : w.key === "ArrowRight" && (x($.value - 24), w.preventDefault());
    }
    let R = null;
    const N = A(), P = ye();
    async function G(w) {
      if (c.value = w, !O.value) {
        g("panel", w);
        return;
      }
      if (!w && R) {
        const v = R;
        R = null, await Ce(), v.focus();
      }
    }
    function j(w) {
      const v = w === "fields" ? k : q;
      v.value = !v.value, g(w, v.value);
    }
    const T = A(), O = A(!1);
    let ue;
    Ue(() => {
      ue = new ResizeObserver(([w]) => {
        const v = O.value;
        O.value = w.contentRect.width < 1e3, O.value && !v && (c.value = !1), !O.value && v && (c.value = m("panel", !0));
      }), T.value && ue.observe(T.value);
    }), Ct(() => ue?.disconnect());
    const ke = A();
    pe(i, async () => {
      await Ce(), ke.value && (ke.value.scrollTop = 0);
    });
    async function le(w) {
      O.value && !c.value && (R = T.value?.getRootNode()?.activeElement), i.value = w, c.value = !0, O.value && (await Ce(), N.value?.focus());
    }
    const oe = (w) => JSON.stringify(w) === JSON.stringify(i.value), be = U(() => i.value.kind === "field" ? s.config.fields[i.value.index] : void 0), C = U(() => Je(s.config.fields)), y = U(() => i.value.kind === "field" ? C.value.find((w) => w.key === ie(i.value.index, i.value.trail ?? [])) : void 0), V = U(() => y.value?.key ?? ""), B = U(() => {
      const w = y.value;
      return !w || w.trail.at(-1) === "item" || !w.trail.length ? void 0 : C.value.find((E) => E.key === ie(w.field, w.trail.slice(0, -1))).shape.properties.filter((E) => E !== w.shape).map((E) => E.name);
    }), D = A("");
    pe(V, () => {
      D.value = "";
    });
    const Fe = U(() => y.value ? Zl(s.config.fields, y.value) : []), fe = U(() => {
      const w = ql(s.config.fields.map(K));
      return w ? `Group path collides with field ${w}.` : "";
    }), Te = U(() => fe.value ? null : St(s.config.fields)), Tt = U(() => fe.value ? null : St(s.config.fields, !0)), dt = U(() => {
      const w = i.value;
      return w.kind === "stage" ? $e[w.stage] : w.kind === "field" ? y.value?.trail.length ? y.value.path : be.value?.name || "New field" : w.kind === "document" ? "Read document" : w.kind === "output" ? "Output" : "Details";
    }), Dt = U(() => {
      const w = i.value;
      return w.kind === "stage" ? ut[w.stage] : w.kind === "field" ? "tabler:forms" : w.kind === "document" ? "tabler:file-text" : w.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), jt = U(() => s.config.fields.filter((w, v) => !(i.value.kind === "field" && i.value.index === v)).map(K)), It = U(() => s.config.stages.deep.enabled), zt = U(() => s.config.stages.map.enabled), Wt = U(() => Oe(s.config.fields.map(K))), De = A(!1), rt = A(), ct = ye();
    function Ht(w, v) {
      for (const E of s.config.fields) (E.group === w || E.group.startsWith(w + ".")) && (E.group = v + E.group.slice(w.length));
    }
    const Gt = (w) => 320 - Math.max(0, ...s.config.fields.filter((v) => v.group === w || v.group.startsWith(w + ".")).map((v) => v.group.length - w.length));
    function Kt() {
      k.value = !0, De.value = !0;
    }
    async function vt() {
      De.value = !1, await Ce(), rt.value.focus();
    }
    function Qt(w) {
      s.config.fields.push({ ...nt(), group: w }), vt();
    }
    const Jt = U(() => [...new Set(s.config.fields.map((w) => w.group.trim()).filter(Boolean))]), Yt = (w) => Mt(s.config.fields[w], s.config.fields.filter((v, E) => E !== w).map(K)), mt = ["map", "prefetch", "scout", "deep", "extract", "verify"], Xt = U(() => mt.filter((w) => Qe(s.config, w)).map((w) => $e[w]).join(" · ")), Zt = U(() => s.config.fields.map((w) => w.name || "New field").join(", ")), _t = U(() => mt.filter((w) => Qe(s.config, w)).length), xe = (w) => s.result?.trace.find((v) => v.kind === w);
    function pt(w = "") {
      s.config.fields.push({ ...nt(), group: w }), k.value = !0, le({ kind: "field", index: s.config.fields.length - 1 });
    }
    function el(w) {
      s.config.fields.splice(w, 1), i.value = { kind: "document" };
    }
    function re(w, v = []) {
      le({ kind: "field", index: w, ...v.length ? { trail: v } : {} });
    }
    function bt(w, v) {
      const E = C.value.find((Y) => Y.key === ie(w, v));
      E.shape.properties.push(Nt()), re(w, [...v, E.shape.properties.length - 1]);
    }
    function tl() {
      const w = y.value;
      if (!w.trail.length) {
        el(w.field);
        return;
      }
      const v = C.value.find((E) => E.key === ie(w.field, w.trail.slice(0, -1)));
      v.shape.properties.splice(w.trail.at(-1), 1), re(v.field, v.trail);
    }
    function ll(w, v, E) {
      if (v.length) {
        const X = C.value.find((ne) => ne.key === ie(w, v.slice(0, -1))).shape.properties, ae = v.at(-1), ee = ae + E;
        if (ee < 0 || ee >= X.length) return;
        [X[ae], X[ee]] = [X[ee], X[ae]], re(w, [...v.slice(0, -1), ee]);
      } else {
        const Y = s.config.fields.map((ee, ne) => ee.group === s.config.fields[w].group ? ne : -1).filter((ee) => ee >= 0), X = Y[Y.indexOf(w) + E];
        if (X === void 0) return;
        const ae = s.config.fields;
        [ae[w], ae[X]] = [ae[X], ae[w]], re(X);
      }
    }
    function al() {
      const w = y.value, v = Fe.value.find((Y) => Y.key === D.value), E = _l(s.config.fields, w, v);
      re(E.field, E.trail);
    }
    function nl(w) {
      const v = y.value?.shape;
      s.config.fields.splice(0, s.config.fields.length, ...s.config.fields.filter((Y) => Y.group !== w && !Y.group.startsWith(w + ".")));
      const E = C.value.find((Y) => Y.shape === v);
      E ? re(E.field, E.trail) : i.value = { kind: "document" };
    }
    function sl(w, v) {
      const E = w.split(".").slice(0, -1).join(".");
      let X = Oe(s.config.fields.map(K));
      for (const se of E.split(".").filter(Boolean)) X = X.children.find((dl) => dl.name === se);
      const ae = X.children.findIndex((se) => se.path === w), ee = X.children[ae + v]?.path;
      if (!ee) return;
      const ne = s.config.fields.filter((se) => se.group === w || se.group.startsWith(w + ".")), je = s.config.fields.filter((se) => se.group === ee || se.group.startsWith(ee + ".")), Ne = s.config.fields, il = Math.min(Ne.indexOf(ne[0]), Ne.indexOf(je[0])), gt = Ne.filter((se) => !ne.includes(se) && !je.includes(se));
      gt.splice(il, 0, ...v > 0 ? [...je, ...ne] : [...ne, ...je]);
      const ul = y.value?.shape;
      Ne.splice(0, Ne.length, ...gt);
      const _e = C.value.find((se) => se.shape === ul);
      _e && re(_e.field, _e.trail);
    }
    const ol = (w) => w.type === "list" ? `list of ${w.item?.type}` : w.type, ft = U({ get: () => s.config.tags.join(", "), set: (w) => {
      s.config.tags = [...new Set(w.split(",").map((v) => v.trim()).filter(Boolean))];
    } });
    return (w, v) => (a(), n("div", {
      ref_key: "root",
      ref: T,
      class: Q(["builder", { narrow: O.value, "panel-open": c.value, resizing: o.value }])
    }, [
      t("div", {
        class: "canvas",
        inert: O.value && c.value
      }, [
        t("div", Js, [
          t("section", Ys, [
            t("header", Xs, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": k.value,
                "aria-controls": "fields-body",
                onClick: v[0] || (v[0] = (E) => j("fields"))
              }, [
                b(p(L), {
                  icon: k.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                v[23] || (v[23] = t("h2", { id: "fields-head" }, "Fields", -1)),
                t("span", _s, d(e.config.fields.length), 1)
              ], 8, Zs),
              !k.value && e.config.fields.length ? (a(), n("span", eo, d(Zt.value), 1)) : h("", !0),
              e.readonly ? h("", !0) : (a(), n("div", to, [
                t("button", {
                  ref_key: "addGroupButton",
                  ref: rt,
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  "aria-label": "Add group",
                  "aria-expanded": De.value,
                  "aria-controls": p(ct),
                  disabled: e.config.fields.length >= 100,
                  onClick: Kt
                }, [
                  b(p(L), { icon: "tabler:folder-plus" }),
                  v[24] || (v[24] = F("Add group", -1))
                ], 8, lo),
                t("button", {
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  disabled: e.config.fields.length >= 100,
                  onClick: v[1] || (v[1] = (E) => pt())
                }, [
                  b(p(L), { icon: "tabler:plus" }),
                  v[25] || (v[25] = F("Add field", -1))
                ], 8, ao)
              ]))
            ]),
            W(t("div", no, [
              e.config.fields.length ? h("", !0) : (a(), n("p", so, "Add the values to pull from each document.")),
              t("div", oo, [
                De.value && !e.readonly ? (a(), n("div", {
                  key: 0,
                  id: p(ct),
                  class: "group-create-row"
                }, [
                  t("span", uo, [
                    b(p(L), { icon: "tabler:folder-plus" })
                  ]),
                  b(Rt, {
                    "input-label": "New group path",
                    "save-label": "Create group",
                    "cancel-label": "Cancel group creation",
                    onSave: Qt,
                    onCancel: vt
                  })
                ], 8, io)) : h("", !0),
                b(Re, { node: Wt.value }, {
                  header: me(({ path: E, label: Y, count: X, first: ae, last: ee }) => [
                    b(Xa, {
                      path: E,
                      name: Y,
                      count: X,
                      first: ae,
                      last: ee,
                      "max-length": Gt(E),
                      "can-add": e.config.fields.length < 100,
                      readonly: e.readonly,
                      onRename: (ne) => Ht(E, ne),
                      onAdd: (ne) => pt(E),
                      onReorder: (ne) => sl(E, ne),
                      onRemove: (ne) => nl(E)
                    }, null, 8, ["path", "name", "count", "first", "last", "max-length", "can-add", "readonly", "onRename", "onAdd", "onReorder", "onRemove"])
                  ]),
                  default: me(({ index: E }) => [
                    b(kn, {
                      shape: e.config.fields[E],
                      field: E,
                      trail: [],
                      path: p(K)(e.config.fields[E]) || "New field",
                      selected: V.value,
                      readonly: e.readonly,
                      error: Yt(E),
                      first: !e.config.fields.slice(0, E).some((Y) => Y.group === e.config.fields[E].group),
                      last: !e.config.fields.slice(E + 1).some((Y) => Y.group === e.config.fields[E].group),
                      onSelect: re,
                      onAdd: bt,
                      onReorder: ll
                    }, null, 8, ["shape", "field", "path", "selected", "readonly", "error", "first", "last"])
                  ]),
                  _: 1
                }, 8, ["node"])
              ]),
              t("details", ro, [
                t("summary", co, [
                  b(p(L), { icon: "tabler:braces" }),
                  v[26] || (v[26] = F("Output preview", -1))
                ]),
                fe.value ? (a(), n("p", vo, d(fe.value), 1)) : (a(), n("div", mo, [
                  t("div", null, [
                    v[27] || (v[27] = t("h3", null, "Output shape", -1)),
                    t("pre", po, d(JSON.stringify(Te.value, null, 2)), 1)
                  ]),
                  t("div", null, [
                    v[28] || (v[28] = t("h3", null, "Example value", -1)),
                    t("pre", bo, d(JSON.stringify(Tt.value, null, 2)), 1)
                  ])
                ])),
                v[29] || (v[29] = t("small", null, "Example values illustrate the shape; extracted values come from your document.", -1))
              ])
            ], 512), [
              [Ke, k.value]
            ])
          ]),
          t("section", fo, [
            t("header", go, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": q.value,
                "aria-controls": "flow-body",
                onClick: v[2] || (v[2] = (E) => j("flow"))
              }, [
                b(p(L), {
                  icon: q.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                v[30] || (v[30] = t("h2", { id: "flow-head" }, "Flow", -1)),
                t("span", yo, d(_t.value) + " of 6", 1)
              ], 8, ho),
              q.value ? h("", !0) : (a(), n("span", ko, d(Xt.value), 1)),
              t("button", {
                type: "button",
                class: Q(["kx-btn kx-btn-ghost kx-focus-halo sm push", { on: oe({ kind: "details" }) }]),
                onClick: v[3] || (v[3] = (E) => le({ kind: "details" }))
              }, [
                b(p(L), { icon: "tabler:info-circle" }),
                v[31] || (v[31] = F("Details", -1))
              ], 2)
            ]),
            W(t("div", $o, [
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "document" }) }]),
                onClick: v[4] || (v[4] = (E) => le({ kind: "document" }))
              }, [
                t("span", xo, [
                  b(p(L), { icon: "tabler:file-text" })
                ]),
                t("span", wo, [
                  v[32] || (v[32] = t("span", { class: "node-title" }, "Read document", -1)),
                  t("span", Vo, d(p(Ul)(e.config.retrieval)), 1)
                ]),
                t("span", So, [
                  t("span", Co, d(p(Ut)(e.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              v[37] || (v[37] = t("div", { class: "connector" }, null, -1)),
              b(we, {
                stage: "map",
                config: e.config,
                active: oe({ kind: "stage", stage: "map" }),
                trace: xe("map"),
                readonly: e.readonly,
                onSelect: v[5] || (v[5] = (E) => le({ kind: "stage", stage: "map" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[38] || (v[38] = t("div", {
                class: "fork",
                "aria-hidden": "true"
              }, [
                t("span")
              ], -1)),
              t("div", Eo, [
                t("div", qo, [
                  v[33] || (v[33] = t("span", { class: "branch-label" }, "Evidence", -1)),
                  b(we, {
                    stage: "prefetch",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "prefetch" }),
                    trace: xe("prefetch"),
                    readonly: e.readonly,
                    onSelect: v[6] || (v[6] = (E) => le({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  v[34] || (v[34] = t("div", { class: "connector" }, null, -1)),
                  b(we, {
                    stage: "scout",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "scout" }),
                    trace: xe("scout"),
                    readonly: e.readonly,
                    onSelect: v[7] || (v[7] = (E) => le({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                t("div", Uo, [
                  v[35] || (v[35] = t("span", { class: "branch-label" }, "Deep fields", -1)),
                  b(we, {
                    stage: "deep",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "deep" }),
                    trace: xe("deep"),
                    readonly: e.readonly,
                    onSelect: v[8] || (v[8] = (E) => le({ kind: "stage", stage: "deep" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ])
              ]),
              v[39] || (v[39] = t("div", {
                class: "join",
                "aria-hidden": "true"
              }, [
                t("span")
              ], -1)),
              b(we, {
                stage: "extract",
                config: e.config,
                active: oe({ kind: "stage", stage: "extract" }),
                trace: xe("extract"),
                readonly: e.readonly,
                onSelect: v[9] || (v[9] = (E) => le({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[40] || (v[40] = t("div", { class: "connector" }, null, -1)),
              b(we, {
                stage: "verify",
                config: e.config,
                active: oe({ kind: "stage", stage: "verify" }),
                trace: xe("verify"),
                readonly: e.readonly,
                onSelect: v[10] || (v[10] = (E) => le({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[41] || (v[41] = t("div", { class: "connector" }, null, -1)),
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "output" }) }]),
                onClick: v[11] || (v[11] = (E) => le({ kind: "output" }))
              }, [
                t("span", Fo, [
                  b(p(L), { icon: "tabler:braces" })
                ]),
                t("span", No, [
                  v[36] || (v[36] = t("span", { class: "node-title" }, "Output", -1)),
                  t("span", Mo, d(e.config.fields.length ? `${e.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [Ke, q.value]
            ])
          ])
        ])
      ], 8, Qs),
      O.value && c.value ? (a(), n("div", {
        key: 0,
        class: "scrim",
        onClick: v[12] || (v[12] = (E) => G(!1))
      })) : h("", !0),
      c.value ? W((a(), n("aside", {
        key: String(O.value),
        class: "side-panel",
        "aria-labelledby": p(P),
        role: O.value ? "dialog" : void 0,
        "aria-modal": O.value ? "true" : void 0,
        style: qe(O.value ? void 0 : { width: `${$.value}px` }),
        onKeydown: v[21] || (v[21] = Ee((E) => O.value && G(!1), ["esc"]))
      }, [
        O.value ? h("", !0) : (a(), n("div", {
          key: 0,
          class: Q(["resizer kx-focus-outline", { active: o.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": $.value,
          "aria-valuemin": We,
          onPointerdown: ve(r, ["prevent"]),
          onKeydown: z,
          onDblclick: v[13] || (v[13] = (E) => x(tt))
        }, null, 42, Ro)),
        t("header", Lo, [
          t("span", Bo, [
            b(p(L), { icon: Dt.value }, null, 8, ["icon"])
          ]),
          t("h2", { id: p(P) }, d(dt.value), 9, Oo),
          t("button", {
            ref_key: "closeButton",
            ref: N,
            type: "button",
            class: "kx-iconbtn kx-focus-outline push",
            "aria-label": O.value ? "Close panel" : "Collapse panel",
            title: O.value ? "Close panel" : "Collapse panel",
            onClick: v[14] || (v[14] = (E) => G(!1))
          }, [
            b(p(L), {
              icon: O.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ], 8, Po)
        ]),
        t("div", {
          ref_key: "panelBody",
          ref: ke,
          class: "side-panel-body"
        }, [
          i.value.kind === "document" ? (a(), J(Ks, {
            key: 0,
            config: e.config,
            retention: e.retention,
            readonly: e.readonly
          }, null, 8, ["config", "retention", "readonly"])) : i.value.kind === "stage" ? (a(), J(Ns, {
            key: 1,
            stage: i.value.stage,
            config: e.config,
            readonly: e.readonly
          }, null, 8, ["stage", "config", "readonly"])) : i.value.kind === "field" && be.value && y.value ? (a(), n(M, { key: 2 }, [
            t("p", To, d(y.value.path), 1),
            b(Ma, {
              field: be.value,
              shape: y.value.shape,
              depth: y.value.depth,
              "sibling-names": B.value,
              "other-names": jt.value,
              groups: Jt.value,
              "deep-enabled": It.value,
              "map-enabled": zt.value,
              readonly: e.readonly,
              onRemove: tl,
              onAdd: v[15] || (v[15] = (E) => bt(y.value.field, y.value.trail)),
              onSelectItem: v[16] || (v[16] = (E) => re(y.value.field, [...y.value.trail, "item"]))
            }, null, 8, ["field", "shape", "depth", "sibling-names", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"]),
            !e.readonly && y.value.trail.at(-1) !== "item" ? (a(), n("fieldset", Do, [
              t("label", null, [
                v[42] || (v[42] = F("Move to parent", -1)),
                W(t("select", {
                  "onUpdate:modelValue": v[17] || (v[17] = (E) => D.value = E),
                  "aria-label": "Move to parent"
                }, [
                  y.value.trail.length ? (a(), n("option", jo, "Top-level field")) : (a(), n("option", Io, "Choose an object…")),
                  (a(!0), n(M, null, I(Fe.value, (E) => (a(), n("option", {
                    key: E.key,
                    value: E.key
                  }, d(E.path), 9, zo))), 128))
                ], 512), [
                  [Ge, D.value]
                ])
              ]),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Move selected node",
                disabled: !D.value && !y.value.trail.length || !D.value && e.config.fields.length >= 100,
                onClick: al
              }, "Move", 8, Wo)
            ])) : h("", !0)
          ], 64)) : i.value.kind === "details" ? (a(), n("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: e.readonly
          }, [
            t("label", null, [
              v[43] || (v[43] = F("Name", -1)),
              W(t("input", {
                "onUpdate:modelValue": v[18] || (v[18] = (E) => l.value = E),
                "aria-label": "Extractor name"
              }, null, 512), [
                [_, l.value]
              ])
            ]),
            t("label", null, [
              v[44] || (v[44] = F("Description", -1)),
              W(t("textarea", {
                "onUpdate:modelValue": v[19] || (v[19] = (E) => u.value = E),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [_, u.value]
              ])
            ]),
            t("label", null, [
              v[45] || (v[45] = F("Tags", -1)),
              W(t("input", {
                "onUpdate:modelValue": v[20] || (v[20] = (E) => ft.value = E),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  _,
                  ft.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              v[46] || (v[46] = t("small", null, "Comma separated", -1))
            ])
          ], 8, Ho)) : i.value.kind === "output" ? (a(), n("div", Go, [
            v[47] || (v[47] = t("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            t("ul", Ko, [
              (a(!0), n(M, null, I(e.config.fields, (E) => (a(), n("li", {
                key: p(K)(E)
              }, [
                t("span", Qo, d(p(K)(E) || "New field"), 1),
                t("span", Jo, d(ol(E)), 1)
              ]))), 128))
            ]),
            v[48] || (v[48] = t("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : h("", !0)
        ], 512)
      ], 44, Ao)), [
        [p(Ol), { disabled: !O.value }]
      ]) : O.value ? h("", !0) : (a(), n("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: v[22] || (v[22] = (E) => G(!0))
      }, [
        b(p(L), { icon: "tabler:layout-sidebar-right-expand" }),
        t("span", Yo, d(dt.value), 1)
      ]))
    ], 2));
  }
}), Zo = ["selected"], _o = {
  key: 1,
  role: "alert"
}, ei = {
  key: 2,
  class: "muted picker-pending picker-pending--list"
}, Lt = /* @__PURE__ */ H({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(e, { emit: s }) {
    const l = s, u = A(!1), i = A("");
    Ue(async () => {
      try {
        await Ze("wc-multiselect", { timeoutMs: 8e3 }), u.value = !0;
      } catch (g) {
        i.value = String(g);
      }
    });
    function m(g) {
      const c = g.detail;
      l("select", c.selected[0] || "", c.labels?.[0] || "");
    }
    return (g, c) => u.value ? (a(), n("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(e.value ? [e.value] : []),
      placeholder: "Choose an upload",
      onChange: m
    }, null, 40, Zo)) : i.value ? (a(), n("p", _o, d(i.value), 1)) : (a(), n("span", ei, "Loading uploads…"));
  }
}), He = (e) => e.status === "completed" || e.status === "partial" || e.status === "failed", Se = (e) => e.metrics.length ? e.metrics.reduce((s, l) => s + l.accuracy, 0) / e.metrics.length : 0, Bt = (e) => `Visual · ${e.status}`, ti = ["data-error-kind", "data-error-code"], li = { key: 0 }, Ot = /* @__PURE__ */ H({
  __name: "FieldFailure",
  props: {
    error: {}
  },
  setup(e) {
    const s = e, l = U(() => {
      const i = s.error?.details;
      return i && typeof i == "object" && "code" in i && typeof i.code == "string" ? i.code : void 0;
    }), u = U(() => l.value === "context_budget_exceeded");
    return (i, m) => (a(), n("div", {
      class: "field-failure",
      "data-error-kind": e.error?.kind,
      "data-error-code": l.value,
      role: "note",
      "aria-label": "Field failure"
    }, [
      t("p", null, [
        t("strong", null, d(u.value ? "Context budget exceeded" : e.error?.kind), 1),
        F(" · " + d(e.error?.message), 1)
      ]),
      t("small", null, d(e.error?.retryable ? "Retryable" : "Not retryable"), 1),
      e.error?.details ? (a(), n("details", li, [
        m[0] || (m[0] = t("summary", { class: "kx-focus-outline" }, "Error details", -1)),
        t("pre", null, d(JSON.stringify(e.error.details, null, 2)), 1)
      ])) : h("", !0)
    ], 8, ti));
  }
}), ai = { class: "nested-value" }, ni = { key: 0 }, si = {
  key: 0,
  class: "muted"
}, oi = { key: 1 }, ii = { key: 2 }, Le = /* @__PURE__ */ H({
  __name: "NestedValue",
  props: {
    value: {},
    schema: {}
  },
  setup(e) {
    const s = e, l = U(() => s.value !== null && typeof s.value == "object" && !Array.isArray(s.value) ? s.value : null), u = U(() => [.../* @__PURE__ */ new Set([...Object.keys(s.schema?.properties ?? {}), ...Object.keys(l.value ?? {})])]);
    function i(g) {
      if (!g) return !1;
      if (Array.isArray(g.type) && g.type.includes("null")) return !0;
      const c = Object.entries(g.properties ?? {});
      return c.length ? c.every(([k, q]) => !g.required?.includes(k) || i(q)) : !!g.items && i(g.items);
    }
    const m = U(() => i(s.schema) ? "Missing" : "—");
    return (g, c) => {
      const k = it("NestedValue", !0);
      return a(), n("div", ai, [
        Array.isArray(e.value) ? (a(), n("ol", ni, [
          (a(!0), n(M, null, I(e.value, (q, S) => (a(), n("li", { key: S }, [
            b(k, {
              value: q,
              schema: e.schema?.items
            }, null, 8, ["value", "schema"])
          ]))), 128)),
          e.value.length ? h("", !0) : (a(), n("li", si, "Empty list"))
        ])) : l.value ? (a(), n("dl", oi, [
          (a(!0), n(M, null, I(u.value, (q) => (a(), n(M, { key: q }, [
            t("dt", null, d(q), 1),
            t("dd", null, [
              b(k, {
                value: p(st)(l.value, q),
                schema: e.schema?.properties?.[q]
              }, null, 8, ["value", "schema"])
            ])
          ], 64))), 128))
        ])) : (a(), n("span", ii, d(e.value === null || e.value === void 0 ? m.value : String(e.value)), 1))
      ]);
    };
  }
}), ui = { class: "value-list" }, di = ["aria-expanded", "onClick"], ri = { class: "value-name" }, ci = { class: "bar" }, vi = {
  key: 1,
  class: "value-checks"
}, mi = ["title"], pi = {
  key: 0,
  class: "chip",
  "aria-label": "Verification method"
}, bi = {
  key: 1,
  class: "chip warn",
  "aria-label": "Context"
}, fi = {
  key: 2,
  class: "chip",
  "aria-label": "Completeness"
}, gi = { class: "evidence" }, hi = {
  key: 1,
  class: "muted"
}, yi = {
  key: 2,
  class: "muted"
}, Pt = /* @__PURE__ */ H({
  __name: "ResultFields",
  props: {
    fields: {},
    pageRange: {}
  },
  setup(e) {
    const s = e, l = U(() => Oe(s.fields.map((S) => S.path))), u = A(), i = (S) => `${Math.round(S * 100)}%`, m = (S) => S !== null && typeof S == "object", g = (S) => Array.isArray(S) ? `${S.length} items` : m(S) ? `${Object.keys(S).length} properties` : S == null ? "—" : String(S), c = (S) => S >= 0.9 ? "high" : S >= 0.7 ? "mid" : "low", k = (S) => S.codes?.includes("missing_in_sections") ? "Not in the selected sections" + (s.pageRange ? " of the searched pages" : "") : "Not in the document", q = (S) => {
      const $ = S.error?.details;
      return !!$ && typeof $ == "object" && "code" in $ && $.code === "context_budget_exceeded";
    };
    return (S, $) => (a(), n("div", ui, [
      b(Re, { node: l.value }, {
        default: me(({ index: f }) => [
          (a(!0), n(M, null, I([e.fields[f]], (x) => (a(), n("div", {
            key: x.path,
            class: "value-row"
          }, [
            t("button", {
              type: "button",
              class: "value-main",
              "aria-expanded": u.value === x.path,
              onClick: (o) => u.value = u.value === x.path ? void 0 : x.path
            }, [
              t("span", ri, d(x.name), 1),
              t("span", {
                class: Q(["value-text", { missing: x.missing }])
              }, d(x.failed ? q(x) ? "Context budget exceeded" : "Failed" : x.missing ? k(x) : g(x.value)), 3),
              x.failed ? h("", !0) : (a(), n("span", {
                key: 0,
                class: Q(["confidence", c(x.confidence)])
              }, [
                t("span", ci, [
                  t("span", {
                    style: qe({ width: i(x.confidence) })
                  }, null, 4)
                ]),
                F(d(i(x.confidence)), 1),
                $[0] || ($[0] = t("span", { class: "conf-word" }, " confidence", -1))
              ], 2)),
              x.failed ? h("", !0) : (a(), n("span", vi, [
                t("span", {
                  class: Q(["chip", x.verified ? "primary" : "warn"]),
                  title: x.reason
                }, [
                  b(p(L), {
                    icon: x.verified ? "tabler:shield-check" : "tabler:shield-question"
                  }, null, 8, ["icon"]),
                  F(d(x.verified ? "Verified" : "Check"), 1)
                ], 10, mi),
                x.verification ? (a(), n("span", pi, d(p(Bt)(x.verification)), 1)) : h("", !0),
                x.codes?.includes("context_budget_partial") ? (a(), n("span", bi, "Partial context")) : h("", !0),
                x.missing ? h("", !0) : (a(), n("span", fi, d(x.complete === !0 ? "Complete" : x.complete === !1 ? "Incomplete" : "Completeness unknown"), 1))
              ])),
              b(p(L), {
                icon: u.value === x.path ? "tabler:chevron-up" : "tabler:chevron-down",
                class: "value-caret"
              }, null, 8, ["icon"])
            ], 8, di),
            u.value === x.path && !x.failed && !x.missing && m(x.value) ? (a(), J(Le, {
              key: 0,
              class: "structured-value",
              value: x.value,
              schema: x.value_schema
            }, null, 8, ["value", "schema"])) : h("", !0),
            x.failed ? (a(), J(Ot, {
              key: 1,
              error: x.error
            }, null, 8, ["error"])) : h("", !0),
            W(t("div", gi, [
              !x.failed && !x.missing && !m(x.value) ? (a(), J(Le, {
                key: 0,
                value: x.value,
                schema: x.value_schema
              }, null, 8, ["value", "schema"])) : h("", !0),
              (a(!0), n(M, null, I(x.evidence, (o, r) => (a(), n("blockquote", {
                key: r,
                class: Q({ unfound: o.found === !1 })
              }, [
                t("p", null, "“" + d(o.quote) + "”", 1),
                t("cite", null, [
                  F(d(o.section), 1),
                  o.page !== void 0 && o.page !== null ? (a(), n(M, { key: 0 }, [
                    F(" · Page " + d(o.page), 1)
                  ], 64)) : h("", !0),
                  o.found === !1 ? (a(), n(M, { key: 1 }, [
                    F(" · not found word for word in the document")
                  ], 64)) : h("", !0)
                ])
              ], 2))), 128)),
              x.evidence.length ? h("", !0) : (a(), n("p", hi, "No evidence.")),
              x.reason || !x.verified && !x.failed ? (a(), n("p", yi, d(x.reason || "No reason recorded"), 1)) : h("", !0)
            ], 512), [
              [Ke, u.value === x.path && !x.failed]
            ])
          ]))), 128))
        ]),
        _: 1
      }, 8, ["node"])
    ]));
  }
}), ki = { class: "test" }, $i = { class: "run-bar" }, xi = { class: "run-input" }, wi = { class: "muted run-note" }, Vi = {
  key: 0,
  class: "empty"
}, Si = {
  key: 1,
  class: "run-failed",
  role: "alert"
}, Ci = {
  key: 2,
  class: "eval-warning",
  role: "status"
}, Ei = {
  key: 3,
  class: "test-grid"
}, qi = { class: "block" }, Ui = { class: "block-head" }, Fi = { class: "muted push" }, Ni = { class: "block" }, Mi = { class: "timeline" }, Ai = { class: "tl-icon" }, Ri = { class: "tl-main" }, Li = { class: "tl-head" }, Bi = { class: "muted push" }, Oi = { class: "tl-bar" }, Pi = { class: "muted" }, Ti = {
  key: 0,
  class: "tl-msg"
}, Di = {
  key: 1,
  class: "chips"
}, ji = /* @__PURE__ */ H({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {},
    running: { type: Boolean },
    canRun: { type: Boolean }
  },
  emits: ["run"],
  setup(e, { emit: s }) {
    const l = e, u = s, i = A(""), m = (S) => `${(S / 1e3).toFixed(1)}s`, g = U(() => Math.max(1, ...l.result?.trace.map((S) => S.duration_ms) ?? [1])), c = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, k = (S) => c[S]?.label ?? $e[S] ?? S, q = (S) => c[S]?.icon ?? ut[S] ?? "tabler:point";
    return (S, $) => (a(), n("div", ki, [
      t("section", $i, [
        t("div", xi, [
          b(Lt, {
            value: i.value,
            onSelect: $[0] || ($[0] = (f) => i.value = f)
          }, null, 8, ["value"])
        ]),
        b(p(de), {
          label: e.running ? "Extracting…" : "Run extraction",
          loading: e.running,
          disabled: !i.value || e.running || !e.canRun,
          onClick: $[1] || ($[1] = (f) => u("run", i.value))
        }, null, 8, ["label", "loading", "disabled"]),
        t("p", wi, d(e.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + d(e.retention) + ".", 1)
      ]),
      e.result ? h("", !0) : (a(), n("p", Vi, "No extraction results yet.")),
      e.result?.status === "failed" ? (a(), n("p", Si, [
        b(p(L), { icon: "tabler:alert-triangle" }),
        F("The run stopped: " + d(e.result.error), 1)
      ])) : h("", !0),
      e.result?.status === "partial" ? (a(), n("p", Ci, [
        b(p(L), { icon: "tabler:alert-triangle" }),
        $[2] || ($[2] = F("Partial result · Some fields failed. Successful values are available below.", -1))
      ])) : h("", !0),
      e.result ? (a(), n("div", Ei, [
        t("section", qi, [
          t("header", Ui, [
            $[3] || ($[3] = t("h2", { class: "block-title" }, "Values", -1)),
            t("span", Fi, [
              F(d(e.result.tokens.toLocaleString()) + " tokens · " + d(m(e.result.duration_ms)), 1),
              e.result.page_range ? (a(), n(M, { key: 0 }, [
                F(" · Pages " + d(e.result.page_range.first) + "–" + d(e.result.page_range.last), 1)
              ], 64)) : e.result.pages ? (a(), n(M, { key: 1 }, [
                F(" · " + d(e.result.pages) + " pages", 1)
              ], 64)) : h("", !0)
            ])
          ]),
          b(Pt, {
            fields: e.result.fields,
            "page-range": e.result.page_range
          }, null, 8, ["fields", "page-range"])
        ]),
        t("section", Ni, [
          $[4] || ($[4] = t("header", { class: "block-head" }, [
            t("h2", { class: "block-title" }, "Steps")
          ], -1)),
          t("ol", Mi, [
            (a(!0), n(M, null, I(e.result.trace, (f, x) => (a(), n("li", {
              key: x,
              class: Q(f.status)
            }, [
              t("span", Ai, [
                b(p(L), {
                  icon: q(f.kind)
                }, null, 8, ["icon"])
              ]),
              t("div", Ri, [
                t("div", Li, [
                  t("strong", null, d(k(f.kind)), 1),
                  t("span", Bi, d(m(f.duration_ms)), 1)
                ]),
                t("span", Oi, [
                  t("span", {
                    style: qe({ width: `${Math.max(4, f.duration_ms / g.value * 100)}%` })
                  }, null, 4)
                ]),
                t("p", Pi, [
                  F(d(f.scope), 1),
                  f.pages ? (a(), n(M, { key: 0 }, [
                    F(" · Pages " + d(f.pages.first) + "–" + d(f.pages.last), 1)
                  ], 64)) : h("", !0),
                  f.model ? (a(), n(M, { key: 1 }, [
                    F(" · " + d(f.model), 1)
                  ], 64)) : h("", !0),
                  F(" · " + d((f.input_tokens + f.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                f.message ? (a(), n("p", Ti, d(f.message), 1)) : h("", !0),
                f.queries?.length ? (a(), n("div", Di, [
                  (a(!0), n(M, null, I(f.queries, (o) => (a(), n("span", {
                    key: o,
                    class: "chip"
                  }, d(o), 1))), 128))
                ])) : h("", !0)
              ])
            ], 2))), 128))
          ])
        ])
      ])) : h("", !0)
    ]));
  }
});
function Ye(e, s = /* @__PURE__ */ new Date()) {
  const l = new Date(e);
  return l.toDateString() === s.toDateString() ? l.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" }) : l.getFullYear() === s.getFullYear() ? l.toLocaleString(void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : l.toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
}
const Ii = { class: "evals" }, zi = { class: "block eval-run" }, Wi = { class: "eval-run-main" }, Hi = { class: "block-title" }, Gi = {
  key: 0,
  class: "eval-note"
}, Ki = {
  key: 0,
  class: "eval-progress",
  role: "status"
}, Qi = { class: "bar" }, Ji = { class: "muted" }, Yi = { class: "stat-row" }, Xi = { class: "stat" }, Zi = { class: "stat-label" }, _i = { class: "stat-value" }, eu = { class: "stat" }, tu = { class: "stat-value" }, lu = { class: "stat-delta flat" }, au = { class: "stat" }, nu = { class: "stat-value" }, su = {
  key: 0,
  class: "stat-delta flat"
}, ou = { class: "stat" }, iu = { class: "stat-value" }, uu = {
  key: 0,
  class: "stat-delta flat"
}, du = { class: "block" }, ru = { class: "block-head" }, cu = {
  key: 0,
  class: "compare-pick push"
}, vu = ["value"], mu = ["value"], pu = {
  key: 0,
  class: "block-empty"
}, bu = {
  key: 1,
  class: "table-scroll"
}, fu = { key: 0 }, gu = { key: 1 }, hu = { class: "mono" }, yu = { class: "acc strong" }, ku = { class: "bar" }, $u = { class: "muted" }, xu = {
  key: 0,
  class: "muted"
}, wu = { key: 1 }, Vu = {
  key: 1,
  class: "muted"
}, Su = {
  key: 1,
  class: "block"
}, Cu = { class: "table-scroll" }, Eu = { class: "metric-table result-matrix" }, qu = ["aria-expanded", "onClick"], Uu = {
  key: 0,
  class: "badge",
  "data-status": "partial"
}, Fu = ["colspan"], Nu = {
  key: 0,
  class: "cell-state"
}, Mu = ["data-error-kind", "title"], Au = ["data-label"], Ru = ["title"], Lu = {
  key: 0,
  class: "result-detail"
}, Bu = ["colspan"], Ou = ["data-error-kind", "title"], Pu = { class: "mono" }, Tu = { class: "cmp" }, Du = { class: "cmp" }, ju = {
  key: 0,
  class: "value-checks"
}, Iu = {
  key: 1,
  class: "chip",
  "aria-label": "Verification method"
}, zu = { class: "muted case-meta" }, Wu = { class: "block" }, Hu = { class: "block-head" }, Gu = { class: "count" }, Ku = { class: "mono" }, Qu = ["onUpdate:modelValue"], Ju = ["onUpdate:modelValue"], Yu = ["onUpdate:modelValue", "placeholder"], Xu = ["onUpdate:modelValue", "type"], Zu = {
  key: 0,
  class: "error",
  role: "alert"
}, _u = { class: "row" }, ed = {
  key: 1,
  class: "block-empty"
}, td = {
  key: 2,
  class: "block-empty"
}, ld = {
  key: 3,
  class: "table-scroll"
}, ad = { class: "metric-table case-table" }, nd = { class: "case-value" }, sd = {
  key: 1,
  class: "muted"
}, od = { class: "num" }, id = ["aria-label", "disabled", "onClick"], ud = {
  key: 2,
  class: "block"
}, dd = { class: "block-head" }, rd = { class: "count" }, cd = { class: "eval-history" }, vd = ["aria-current", "onClick"], md = ["data-status"], pd = { class: "muted" }, bd = { class: "push" }, fd = /* @__PURE__ */ H({
  __name: "EvalsPanel",
  props: {
    cases: {},
    addedCaseId: {},
    fields: {},
    evaluations: {},
    evaluation: {},
    revision: {},
    changed: { type: Boolean },
    saving: { type: Boolean },
    starting: { type: Boolean }
  },
  emits: ["add-case", "delete-case", "evaluate", "open"],
  setup(e, { emit: s }) {
    const l = e, u = s, i = A(!1), m = A(""), g = A({}), c = A("");
    pe(() => l.addedCaseId, () => {
      i.value = !1, m.value = "", g.value = {};
    });
    function k(C, y) {
      return C.type === "number" ? Number(y) : C.type === "boolean" ? y === "true" : C.type === "list" || C.type === "object" ? JSON.parse(y) : y;
    }
    function q() {
      c.value = "";
      const C = {};
      try {
        for (const y of l.fields) {
          const V = String(g.value[K(y)] ?? "").trim();
          V && Ft(C, K(y), k(y, V));
        }
      } catch {
        c.value = 'Lists and objects need valid JSON, for example ["a","b"] or {"city":"Hamburg"}.';
        return;
      }
      u("add-case", { upload_id: m.value, expected: C });
    }
    const S = U(() => l.evaluations.find((C) => !He(C))), $ = U(() => l.evaluations.filter(He)), f = U(() => l.evaluation), x = U(() => ({ done: (f.value?.results ?? []).filter((y) => y.status !== "queued").length, total: f.value?.case_count ?? 0 })), o = A();
    pe(() => f.value?.id, () => {
      o.value = void 0;
    });
    const r = U(() => {
      if (!f.value) return;
      if (o.value) return $.value.find((y) => y.id === o.value);
      const C = $.value.findIndex((y) => y.id === f.value.id);
      return C >= 0 ? $.value[C + 1] : $.value[0];
    }), z = U(() => (f.value?.metrics ?? []).map((C) => ({ ...C, before: r.value?.metrics.find((y) => y.field === C.field) }))), R = U(() => (f.value?.fields ?? []).map(K)), N = U(() => Oe(l.fields.map(K))), P = (C, y) => C.scores.find((V) => V.field === y), G = A(), j = (C) => `${Math.round(C * 100)}%`, T = (C) => {
      const y = Math.round(C * 100);
      return `${y > 0 ? "+" : y < 0 ? "−" : "±"}${Math.abs(y)} pts`;
    }, O = (C) => Math.round(C * 100) > 0 ? "up" : Math.round(C * 100) < 0 ? "down" : "flat", ue = (C) => C >= 6e4 ? `${Math.floor(C / 6e4)}m ${Math.round(C % 6e4 / 1e3)}s` : `${(C / 1e3).toFixed(1)}s`, ke = (C) => C == null || C === "" ? "—" : typeof C == "string" ? C : Array.isArray(C) && C.every((y) => typeof y != "object") ? C.join(", ") : JSON.stringify(C), le = (C) => C ? C.failed ? "fail" : C.score >= 0.999 ? "pass" : C.score > 0 ? "partial" : "fail" : "none", oe = (C) => (C.results ?? []).filter((y) => y.status === "completed").length, be = { queued: "Queued", running: "Running", completed: "Completed", partial: "Partial", failed: "Failed" };
    return (C, y) => (a(), n("div", Ii, [
      t("section", zi, [
        t("div", Wi, [
          t("div", null, [
            t("h2", Hi, "Evaluate revision " + d(e.revision), 1),
            y[6] || (y[6] = t("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            e.changed ? (a(), n("p", Gi, [
              b(p(L), { icon: "tabler:info-circle" }),
              y[5] || (y[5] = F("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : h("", !0)
          ]),
          b(p(de), {
            label: S.value ? "Evaluating…" : "Run all cases",
            loading: e.starting || !!S.value,
            disabled: !e.cases.length || !e.fields.length || !!S.value || e.starting,
            onClick: y[0] || (y[0] = (V) => u("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        f.value && !p(He)(f.value) ? (a(), n("div", Ki, [
          t("span", Qi, [
            t("span", {
              style: qe({ width: j(x.value.total ? x.value.done / x.value.total : 0) })
            }, null, 4)
          ]),
          t("span", Ji, d(be[f.value.status]) + " · " + d(x.value.done) + " of " + d(x.value.total) + " cases", 1)
        ])) : h("", !0)
      ]),
      f.value && p(He)(f.value) ? (a(), n(M, { key: 0 }, [
        f.value.error ? (a(), n("p", {
          key: 0,
          class: Q(f.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          b(p(L), { icon: "tabler:alert-triangle" }),
          F(d(f.value.error), 1)
        ], 2)) : h("", !0),
        t("div", Yi, [
          t("div", Xi, [
            t("span", Zi, "Accuracy · revision " + d(f.value.config_revision), 1),
            t("span", _i, d(j(p(Se)(f.value))), 1),
            r.value ? (a(), n("span", {
              key: 0,
              class: Q(["stat-delta", O(p(Se)(f.value) - p(Se)(r.value))])
            }, d(T(p(Se)(f.value) - p(Se)(r.value))) + " vs revision " + d(r.value.config_revision), 3)) : h("", !0)
          ]),
          t("div", eu, [
            y[7] || (y[7] = t("span", { class: "stat-label" }, "Cases", -1)),
            t("span", tu, [
              F(d(oe(f.value)), 1),
              t("small", null, " / " + d(f.value.case_count), 1)
            ]),
            t("span", lu, d((f.value.results ?? []).filter((V) => V.status === "partial").length) + " partial · " + d((f.value.results ?? []).filter((V) => V.status === "failed").length) + " failed", 1)
          ]),
          t("div", au, [
            y[8] || (y[8] = t("span", { class: "stat-label" }, "Tokens", -1)),
            t("span", nu, d(f.value.tokens.toLocaleString()), 1),
            r.value ? (a(), n("span", su, d(r.value.tokens.toLocaleString()) + " before", 1)) : h("", !0)
          ]),
          t("div", ou, [
            y[9] || (y[9] = t("span", { class: "stat-label" }, "Model time", -1)),
            t("span", iu, d(ue(f.value.duration_ms)), 1),
            r.value ? (a(), n("span", uu, d(ue(r.value.duration_ms)) + " before", 1)) : h("", !0)
          ])
        ]),
        t("section", du, [
          t("header", ru, [
            y[11] || (y[11] = t("h2", { class: "block-title" }, "Field accuracy", -1)),
            $.value.length > 1 ? (a(), n("label", cu, [
              y[10] || (y[10] = t("span", { class: "muted" }, "Compare with", -1)),
              t("select", {
                value: r.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: y[1] || (y[1] = (V) => o.value = V.target.value)
              }, [
                (a(!0), n(M, null, I($.value.filter((V) => V.id !== f.value.id), (V) => (a(), n("option", {
                  key: V.id,
                  value: V.id
                }, "Revision " + d(V.config_revision) + " · " + d(p(Ye)(V.created_at)), 9, mu))), 128))
              ], 40, vu)
            ])) : h("", !0)
          ]),
          z.value.length ? (a(), n("div", bu, [
            t("table", {
              class: Q(["metric-table accuracy-table", { comparing: !!r.value }])
            }, [
              t("thead", null, [
                t("tr", null, [
                  y[12] || (y[12] = t("th", null, "Field", -1)),
                  y[13] || (y[13] = t("th", null, "Accuracy", -1)),
                  y[14] || (y[14] = t("th", null, "Verified", -1)),
                  r.value ? (a(), n("th", fu, "Revision " + d(r.value.config_revision), 1)) : h("", !0),
                  r.value ? (a(), n("th", gu, "Change")) : h("", !0)
                ])
              ]),
              t("tbody", null, [
                (a(!0), n(M, null, I(z.value, (V) => (a(), n("tr", {
                  key: V.field
                }, [
                  t("td", hu, d(V.field), 1),
                  t("td", null, [
                    t("span", yu, [
                      t("span", ku, [
                        t("span", {
                          style: qe({ width: j(V.accuracy) })
                        }, null, 4)
                      ]),
                      F(d(j(V.accuracy)), 1)
                    ])
                  ]),
                  t("td", $u, d(j(V.verified)), 1),
                  r.value ? (a(), n("td", xu, d(V.before ? j(V.before.accuracy) : "—"), 1)) : h("", !0),
                  r.value ? (a(), n("td", wu, [
                    V.before ? (a(), n("span", {
                      key: 0,
                      class: Q(["trend", O(V.accuracy - V.before.accuracy)])
                    }, [
                      b(p(L), {
                        icon: O(V.accuracy - V.before.accuracy) === "up" ? "tabler:trending-up" : O(V.accuracy - V.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      F(d(T(V.accuracy - V.before.accuracy)), 1)
                    ], 2)) : (a(), n("span", Vu, "New field"))
                  ])) : h("", !0)
                ]))), 128))
              ])
            ], 2)
          ])) : (a(), n("p", pu, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : h("", !0),
      f.value?.results?.length ? (a(), n("section", Su, [
        y[19] || (y[19] = t("header", { class: "block-head" }, [
          t("h2", { class: "block-title" }, "Results by case"),
          t("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        t("div", Cu, [
          t("table", Eu, [
            t("thead", null, [
              t("tr", null, [
                y[15] || (y[15] = t("th", null, "Document", -1)),
                (a(!0), n(M, null, I(R.value, (V) => (a(), n("th", {
                  key: V,
                  class: "mono"
                }, d(V), 1))), 128))
              ])
            ]),
            t("tbody", null, [
              (a(!0), n(M, null, I(f.value.results, (V) => (a(), n(M, {
                key: V.case_id
              }, [
                t("tr", {
                  class: Q(["result-row", { active: G.value === V.case_id }])
                }, [
                  t("td", null, [
                    t("button", {
                      type: "button",
                      class: "case-toggle",
                      "aria-expanded": G.value === V.case_id,
                      onClick: (B) => G.value = G.value === V.case_id ? void 0 : V.case_id
                    }, [
                      b(p(L), {
                        icon: G.value === V.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      F(d(V.upload_name), 1)
                    ], 8, qu),
                    V.status === "partial" ? (a(), n("span", Uu, "Partial")) : h("", !0)
                  ]),
                  V.status === "queued" || V.status === "failed" ? (a(), n("td", {
                    key: 0,
                    colspan: R.value.length,
                    class: "muted"
                  }, [
                    V.status === "queued" ? (a(), n("span", Nu, [
                      b(p(L), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      y[16] || (y[16] = F("Waiting", -1))
                    ])) : (a(), n("span", {
                      key: 1,
                      class: "cell-state fail",
                      "data-error-kind": V.error?.kind,
                      title: V.error?.kind
                    }, [
                      b(p(L), { icon: "tabler:alert-triangle" }),
                      F(d(V.error?.message), 1)
                    ], 8, Mu))
                  ], 8, Fu)) : (a(!0), n(M, { key: 1 }, I(R.value, (B) => (a(), n("td", {
                    key: B,
                    "data-label": B
                  }, [
                    t("span", {
                      class: Q(["cell", le(P(V, B))]),
                      title: ke(P(V, B)?.value)
                    }, d(P(V, B)?.failed ? "Failed" : P(V, B) ? j(P(V, B).score) : "—"), 11, Ru)
                  ], 8, Au))), 128))
                ], 2),
                G.value === V.case_id ? (a(), n("tr", Lu, [
                  t("td", {
                    colspan: R.value.length + 1
                  }, [
                    V.error ? (a(), n("p", {
                      key: 0,
                      class: "muted",
                      "data-error-kind": V.error.kind,
                      title: V.error.kind
                    }, d(V.error.message), 9, Ou)) : h("", !0),
                    b(Re, {
                      node: p(Oe)(V.scores.map((B) => B.field))
                    }, {
                      default: me(({ index: B }) => [
                        (a(!0), n(M, null, I([V.scores[B]], (D) => (a(), n("dl", {
                          key: D.field,
                          class: "compare"
                        }, [
                          t("dt", Pu, d(D.field.split(".").at(-1)), 1),
                          t("dd", null, [
                            t("span", {
                              class: Q(["cell", le(D)])
                            }, d(D.failed ? "Failed" : j(D.score)), 3),
                            t("div", Tu, [
                              y[17] || (y[17] = t("span", { class: "cmp-label" }, "Expected", -1)),
                              b(Le, {
                                value: D.expected
                              }, null, 8, ["value"])
                            ]),
                            t("div", Du, [
                              y[18] || (y[18] = t("span", { class: "cmp-label" }, "Extracted", -1)),
                              D.failed ? (a(), J(Ot, {
                                key: 0,
                                error: D.error
                              }, null, 8, ["error"])) : (a(), J(Le, {
                                key: 1,
                                value: D.value
                              }, null, 8, ["value"]))
                            ]),
                            !D.failed || D.verification ? (a(), n("span", ju, [
                              D.failed ? h("", !0) : (a(), n("span", {
                                key: 0,
                                class: Q(["chip", D.verified ? "primary" : "warn"])
                              }, [
                                b(p(L), {
                                  icon: D.verified ? "tabler:shield-check" : "tabler:shield-question"
                                }, null, 8, ["icon"]),
                                F(d(D.verified ? "Verified" : "Unverified"), 1)
                              ], 2)),
                              D.verification ? (a(), n("span", Iu, d(p(Bt)(D.verification)), 1)) : h("", !0)
                            ])) : h("", !0)
                          ])
                        ]))), 128))
                      ]),
                      _: 2
                    }, 1032, ["node"]),
                    t("p", zu, d(V.tokens.toLocaleString()) + " tokens · " + d(ue(V.duration_ms)), 1)
                  ], 8, Bu)
                ])) : h("", !0)
              ], 64))), 128))
            ])
          ])
        ])
      ])) : h("", !0),
      t("section", Wu, [
        t("header", Hu, [
          y[20] || (y[20] = t("h2", { class: "block-title" }, "Cases", -1)),
          t("span", Gu, d(e.cases.length), 1),
          b(p(de), {
            label: "Add case",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: !e.fields.length,
            onClick: y[2] || (y[2] = (V) => i.value = !i.value)
          }, null, 8, ["disabled"])
        ]),
        i.value ? (a(), n("form", {
          key: 0,
          class: "case-form",
          onSubmit: ve(q, ["prevent"])
        }, [
          t("label", null, [
            y[21] || (y[21] = F("Document", -1)),
            b(Lt, {
              value: m.value,
              onSelect: y[3] || (y[3] = (V) => {
                m.value = V;
              })
            }, null, 8, ["value"])
          ]),
          y[24] || (y[24] = t("p", { class: "muted" }, "Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.", -1)),
          b(Re, { node: N.value }, {
            default: me(({ index: V }) => [
              (a(!0), n(M, null, I([e.fields[V]], (B) => (a(), n("label", {
                key: p(K)(B)
              }, [
                t("span", Ku, d(B.name), 1),
                B.type === "boolean" ? W((a(), n("select", {
                  key: 0,
                  "onUpdate:modelValue": (D) => g.value[p(K)(B)] = D
                }, [...y[22] || (y[22] = [
                  t("option", { value: "" }, "Not stated", -1),
                  t("option", { value: "true" }, "Yes", -1),
                  t("option", { value: "false" }, "No", -1)
                ])], 8, Qu)), [
                  [Ge, g.value[p(K)(B)]]
                ]) : B.type === "enum" ? W((a(), n("select", {
                  key: 1,
                  "onUpdate:modelValue": (D) => g.value[p(K)(B)] = D
                }, [
                  y[23] || (y[23] = t("option", { value: "" }, "Not stated", -1)),
                  (a(!0), n(M, null, I(B.enum_values, (D) => (a(), n("option", { key: D }, d(D), 1))), 128))
                ], 8, Ju)), [
                  [Ge, g.value[p(K)(B)]]
                ]) : B.type === "object" || B.type === "list" ? W((a(), n("textarea", {
                  key: 2,
                  "onUpdate:modelValue": (D) => g.value[p(K)(B)] = D,
                  rows: "2",
                  placeholder: B.type === "list" ? '["first", "second"]' : '{"key": "value"}'
                }, null, 8, Yu)), [
                  [_, g.value[p(K)(B)]]
                ]) : W((a(), n("input", {
                  key: 3,
                  "onUpdate:modelValue": (D) => g.value[p(K)(B)] = D,
                  type: B.type === "number" ? "number" : B.type === "date" ? "date" : "text",
                  placeholder: "Not stated"
                }, null, 8, Xu)), [
                  [rl, g.value[p(K)(B)]]
                ])
              ]))), 128))
            ]),
            _: 1
          }, 8, ["node"]),
          c.value ? (a(), n("p", Zu, d(c.value), 1)) : h("", !0),
          t("div", _u, [
            b(p(de), {
              label: "Save case",
              size: "small",
              type: "submit",
              disabled: !m.value,
              loading: e.saving
            }, null, 8, ["disabled", "loading"]),
            b(p(de), {
              label: "Cancel",
              size: "small",
              severity: "secondary",
              text: "",
              onClick: y[4] || (y[4] = (V) => i.value = !1)
            })
          ])
        ], 32)) : h("", !0),
        e.fields.length ? !e.cases.length && !i.value ? (a(), n("p", td, "No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.")) : e.cases.length ? (a(), n("div", ld, [
          t("table", ad, [
            y[25] || (y[25] = t("thead", null, [
              t("tr", null, [
                t("th", null, "Document"),
                t("th", null, "Expected values"),
                t("th")
              ])
            ], -1)),
            t("tbody", null, [
              (a(!0), n(M, null, I(e.cases, (V) => (a(), n("tr", {
                key: V.id
              }, [
                t("td", null, [
                  b(p(L), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  F(" " + d(V.upload_name), 1)
                ]),
                t("td", null, [
                  b(Re, { node: N.value }, {
                    default: me(({ index: B }) => [
                      t("div", nd, [
                        t("strong", null, d(e.fields[B].name), 1),
                        p(st)(V.expected, p(K)(e.fields[B])) !== void 0 ? (a(), J(Le, {
                          key: 0,
                          value: p(st)(V.expected, p(K)(e.fields[B]))
                        }, null, 8, ["value"])) : (a(), n("span", sd, "Not stated"))
                      ])
                    ]),
                    _: 2
                  }, 1032, ["node"])
                ]),
                t("td", od, [
                  t("button", {
                    type: "button",
                    class: "kx-iconbtn kx-focus-outline",
                    "aria-label": `Remove case ${V.upload_name}`,
                    disabled: e.saving,
                    onClick: (B) => u("delete-case", V.id)
                  }, [
                    b(p(L), { icon: "tabler:trash" })
                  ], 8, id)
                ])
              ]))), 128))
            ])
          ])
        ])) : h("", !0) : (a(), n("p", ed, "Add a field in the Builder, then add documents with the values you expect."))
      ]),
      e.evaluations.length ? (a(), n("section", ud, [
        t("header", dd, [
          y[26] || (y[26] = t("h2", { class: "block-title" }, "History", -1)),
          t("span", rd, d(e.evaluations.length), 1)
        ]),
        t("ul", cd, [
          (a(!0), n(M, null, I(e.evaluations, (V) => (a(), n("li", {
            key: V.id
          }, [
            t("button", {
              type: "button",
              class: Q({ active: f.value?.id === V.id }),
              "aria-current": f.value?.id === V.id,
              onClick: (B) => u("open", V.id)
            }, [
              t("span", {
                class: "badge",
                "data-status": V.status
              }, d(be[V.status]), 9, md),
              t("span", null, "Revision " + d(V.config_revision), 1),
              t("span", pd, d(p(Ye)(V.created_at)), 1),
              t("strong", bd, d(V.status === "completed" || V.status === "partial" ? j(p(Se)(V)) : "—"), 1)
            ], 10, vd)
          ]))), 128))
        ])
      ])) : h("", !0)
    ]));
  }
}), gd = { class: "section-head" }, hd = { class: "muted" }, yd = {
  key: 0,
  class: "empty"
}, kd = {
  key: 1,
  class: "table-scroll"
}, $d = { class: "metric-table runs-table" }, xd = ["aria-label", "aria-expanded", "onClick"], wd = { class: "caller" }, Vd = {
  key: 0,
  class: "muted"
}, Sd = ["data-status"], Cd = {
  class: "num",
  "data-label": "Time"
}, Ed = {
  class: "num",
  "data-label": "Tokens"
}, qd = {
  class: "muted",
  "data-label": "Expires"
}, Ud = {
  key: 0,
  class: "result-detail"
}, Fd = { colspan: "6" }, Nd = /* @__PURE__ */ H({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(e) {
    const s = A(), l = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (u, i) => (a(), n(M, null, [
      t("div", gd, [
        i[0] || (i[0] = t("h2", null, "Recent runs", -1)),
        t("span", hd, "Runs expire after " + d(e.retention), 1)
      ]),
      e.runs.length ? (a(), n("div", kd, [
        t("table", $d, [
          i[1] || (i[1] = t("thead", null, [
            t("tr", null, [
              t("th", null, "Started"),
              t("th", null, "From"),
              t("th", null, "Status"),
              t("th", { class: "num" }, "Time"),
              t("th", { class: "num" }, "Tokens"),
              t("th", null, "Expires")
            ])
          ], -1)),
          t("tbody", null, [
            (a(!0), n(M, null, I(e.runs, (m) => (a(), n(M, {
              key: m.id
            }, [
              t("tr", null, [
                t("td", null, [
                  t("button", {
                    type: "button",
                    class: "case-toggle",
                    "aria-label": `Show values for run ${m.id}`,
                    "aria-expanded": s.value === m.id,
                    onClick: (g) => s.value = s.value === m.id ? void 0 : m.id
                  }, [
                    b(p(L), {
                      icon: s.value === m.id ? "tabler:chevron-down" : "tabler:chevron-right"
                    }, null, 8, ["icon"]),
                    F(d(p(Ye)(m.created_at)), 1)
                  ], 8, xd)
                ]),
                t("td", null, [
                  t("span", wd, [
                    b(p(L), {
                      icon: l[m.caller].icon
                    }, null, 8, ["icon"]),
                    F(d(l[m.caller].label), 1)
                  ]),
                  m.result.page_range ? (a(), n("span", Vd, " · Pages " + d(m.result.page_range.first) + "–" + d(m.result.page_range.last), 1)) : h("", !0)
                ]),
                t("td", null, [
                  t("span", {
                    class: "badge",
                    "data-status": m.status
                  }, d(m.status === "completed" ? "Completed" : m.status === "partial" ? "Partial" : "Failed"), 9, Sd)
                ]),
                t("td", Cd, d((m.duration_ms / 1e3).toFixed(1)) + "s", 1),
                t("td", Ed, d(Number(m.tokens).toLocaleString()), 1),
                t("td", qd, d(p(Ye)(m.expires_at)), 1)
              ]),
              s.value === m.id ? (a(), n("tr", Ud, [
                t("td", Fd, [
                  b(Pt, {
                    fields: m.result.fields,
                    "page-range": m.result.page_range
                  }, null, 8, ["fields", "page-range"])
                ])
              ])) : h("", !0)
            ], 64))), 128))
          ])
        ])
      ])) : (a(), n("p", yd, "No runs yet. Runs from the Test tab, agents, evaluations and Workflows appear here."))
    ], 64));
  }
}), Md = {
  key: 0,
  role: "alert",
  class: "error banner"
}, Ad = /* @__PURE__ */ H({
  __name: "SharePopup",
  props: {
    id: {},
    title: {}
  },
  emits: ["close"],
  setup(e, { emit: s }) {
    const l = e, u = s, i = A(), m = A("");
    return Ue(async () => {
      try {
        await Ze("kickside-share", { timeoutMs: 8e3 });
      } catch (k) {
        m.value = `Sharing is unavailable: ${k instanceof Error ? k.message : String(k)}`;
        return;
      }
      const g = document.createElement("kickside-share"), c = encodeURIComponent(l.id);
      g.setAttribute("config", JSON.stringify({ resource_id: l.id, title: l.title, access_url: `/api/v1/component-access/grants/${c}`, share_url: `/api/v1/component-access/share/${c}` })), g.style.display = "block", g.addEventListener("close", () => u("close")), i.value?.appendChild(g);
    }), (g, c) => (a(), n("div", {
      ref_key: "host",
      ref: i
    }, [
      m.value ? (a(), n("p", Md, d(m.value), 1)) : h("", !0)
    ], 512));
  }
}), Rd = { class: "docscout" }, Ld = { class: "toolbar" }, Bd = { class: "toolbar-lead" }, Od = { class: "crumb-row" }, Pd = { class: "crumb" }, Td = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, Dd = ["id", "aria-selected", "aria-controls", "onClick"], jd = { class: "toolbar-side" }, Id = { class: "stats" }, zd = ["title"], Wd = {
  key: 2,
  class: "unsaved"
}, Hd = {
  key: 0,
  class: "banner row wrap",
  role: "status"
}, Gd = {
  key: 1,
  role: "alert",
  class: "error banner"
}, Kd = {
  key: 3,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, Qd = ["id", "aria-labelledby"], Jd = /* @__PURE__ */ H({
  __name: "DocscoutPage",
  props: {
    snapshot: {},
    addedCaseId: {},
    result: { default: null },
    evaluations: { default: () => [] },
    evaluation: {},
    saving: { type: Boolean },
    running: { type: Boolean },
    starting: { type: Boolean },
    error: {},
    back: { type: Boolean }
  },
  emits: ["save", "add-case", "delete-case", "back", "run", "evaluate", "open-evaluation"],
  setup(e, { emit: s }) {
    const l = e, u = s, i = A(), m = A(!1), g = A("Builder"), c = A(xt()), k = A(""), q = A(""), S = U(() => l.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    pe(g, () => {
      i.value && (i.value.scrollTop = 0);
    }, { flush: "post" });
    const $ = A(), f = A(), x = U(() => l.snapshot.can_edit && $.value !== l.snapshot.expected_revision), o = U(() => x.value && f.value !== l.snapshot.expected_revision);
    function r(j) {
      return k.value === j.title && q.value === (j.description ?? "") && Nl(c.value, j.config);
    }
    function z() {
      const j = l.snapshot;
      c.value = structuredClone(lt(j.config ?? xt())), k.value = j.title, q.value = j.description ?? "", $.value = j.expected_revision, f.value = void 0;
    }
    pe(() => l.snapshot, (j, T) => {
      S.value.includes(g.value) || (g.value = S.value[0]), !(T && j.id === T.id && j.can_edit && T.can_edit && !r(T) && !r(j)) && z();
    }, { immediate: !0 });
    const R = U(() => l.snapshot.can_edit && !r(l.snapshot)), N = U(() => Fl(c.value)), P = U(() => Object.keys($e).filter((j) => Qe(c.value, j)).length);
    function G() {
      u("save", { title: k.value, description: q.value, config: structuredClone(lt(c.value)), expected_revision: $.value });
    }
    return (j, T) => (a(), n("main", Rd, [
      t("div", Ld, [
        t("div", Bd, [
          t("span", Od, [
            e.back ? (a(), n("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: T[0] || (T[0] = (O) => u("back"))
            }, [
              b(p(L), { icon: "tabler:arrow-left" })
            ])) : h("", !0),
            t("span", Pd, d(e.snapshot.title), 1)
          ]),
          t("nav", Td, [
            (a(!0), n(M, null, I(S.value, (O) => (a(), n("button", {
              id: `tab-${O}`,
              key: O,
              role: "tab",
              "aria-selected": g.value === O,
              "aria-controls": `panel-${O}`,
              onClick: (ue) => g.value = O
            }, d(O), 9, Dd))), 128))
          ])
        ]),
        t("div", jd, [
          e.snapshot.can_share ? (a(), J(p(de), {
            key: 0,
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-label": "Share",
            onClick: T[1] || (T[1] = (O) => m.value = !0)
          }, {
            default: me(() => [
              b(p(L), { icon: "tabler:share" }),
              T[11] || (T[11] = t("span", { class: "btn-label" }, "Share", -1))
            ]),
            _: 1
          })) : h("", !0),
          t("span", Id, [
            F(d(e.snapshot.field_count) + " " + d(e.snapshot.field_count === 1 ? "field" : "fields"), 1),
            e.snapshot.can_edit ? (a(), n(M, { key: 0 }, [
              F(" · " + d(P.value) + " steps · revision " + d(e.snapshot.expected_revision), 1)
            ], 64)) : (a(), n(M, { key: 1 }, [
              F(" · Read access")
            ], 64))
          ]),
          e.snapshot.can_edit ? (a(), n(M, { key: 1 }, [
            x.value && !o.value ? (a(), J(p(de), {
              key: 0,
              label: "Reload saved",
              severity: "secondary",
              size: "small",
              onClick: z
            })) : h("", !0),
            N.value ? (a(), n("span", {
              key: 1,
              class: "invalid",
              role: "alert",
              title: N.value
            }, [
              b(p(L), { icon: "tabler:alert-circle" }),
              F(d(N.value), 1)
            ], 8, zd)) : R.value ? (a(), n("span", Wd, "Unsaved")) : h("", !0),
            b(p(de), {
              label: "Save",
              size: "small",
              loading: e.saving,
              disabled: !R.value || !!N.value || !k.value.trim(),
              onClick: G
            }, null, 8, ["loading", "disabled"])
          ], 64)) : h("", !0)
        ])
      ]),
      o.value ? (a(), n("div", Hd, [
        t("span", null, "Saved configuration changed to revision " + d(e.snapshot.expected_revision) + ". Your edits are kept.", 1),
        b(p(de), {
          label: "Reload saved",
          severity: "secondary",
          size: "small",
          onClick: z
        }),
        b(p(de), {
          label: "Keep editing",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: T[2] || (T[2] = (O) => f.value = e.snapshot.expected_revision)
        })
      ])) : h("", !0),
      e.error ? (a(), n("p", Gd, d(e.error), 1)) : h("", !0),
      m.value ? (a(), J(Ad, {
        key: 2,
        id: e.snapshot.id,
        title: e.snapshot.title,
        onClose: T[3] || (T[3] = (O) => m.value = !1)
      }, null, 8, ["id", "title"])) : h("", !0),
      g.value === "Builder" && e.snapshot.can_edit ? (a(), n("div", Kd, [
        b(Xo, {
          title: k.value,
          "onUpdate:title": T[4] || (T[4] = (O) => k.value = O),
          description: q.value,
          "onUpdate:description": T[5] || (T[5] = (O) => q.value = O),
          config: c.value,
          retention: e.snapshot.retention,
          result: e.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (a(), n("div", {
        key: 4,
        ref_key: "body",
        ref: i,
        class: "page-body"
      }, [
        t("div", {
          id: `panel-${g.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${g.value}`,
          class: "panel"
        }, [
          g.value === "Test" ? (a(), J(ji, {
            key: 0,
            result: e.result,
            retention: e.snapshot.retention,
            running: e.running,
            "can-run": e.snapshot.field_count > 0,
            onRun: T[6] || (T[6] = (O) => u("run", O))
          }, null, 8, ["result", "retention", "running", "can-run"])) : h("", !0),
          g.value === "Evals" && e.snapshot.can_edit ? (a(), J(fd, {
            key: 1,
            cases: e.snapshot.cases,
            "added-case-id": e.addedCaseId,
            fields: e.snapshot.config.fields,
            evaluations: e.evaluations,
            evaluation: e.evaluation,
            revision: e.snapshot.expected_revision,
            changed: R.value,
            saving: e.saving,
            starting: e.starting,
            onAddCase: T[7] || (T[7] = (O) => u("add-case", O)),
            onDeleteCase: T[8] || (T[8] = (O) => u("delete-case", O)),
            onEvaluate: T[9] || (T[9] = (O) => u("evaluate")),
            onOpen: T[10] || (T[10] = (O) => u("open-evaluation", O))
          }, null, 8, ["cases", "added-case-id", "fields", "evaluations", "evaluation", "revision", "changed", "saving", "starting"])) : h("", !0),
          g.value === "Runs" ? (a(), J(Nd, {
            key: 2,
            runs: e.snapshot.runs,
            retention: e.snapshot.retention
          }, null, 8, ["runs", "retention"])) : h("", !0)
        ], 8, Qd)
      ], 512))
    ]));
  }
}), Yd = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, Xd = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, ar = /* @__PURE__ */ H({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(e, { emit: s }) {
    const l = e, u = s, i = A(), m = A(""), g = A(!1), c = A(!1), k = A(!1), q = A(), S = A(null), $ = A([]), f = A();
    let x = [], o = 0, r = 0, z = 0, R;
    const N = (C) => C instanceof Error ? C.message : String(C), P = (C) => C === o;
    async function G(C, y) {
      const V = ++z;
      y && (R = y);
      const B = () => P(C) && V === z;
      try {
        const D = l.id, Fe = await ge.evaluations(D);
        if (!B()) return;
        $.value = Fe;
        const fe = R ?? Fe[0]?.id;
        if (fe) {
          const Te = await ge.evaluation(D, fe);
          if (!B() || Te.id !== (R ?? fe)) return;
          f.value = Te;
        }
      } catch (D) {
        B() && (m.value = N(D));
      }
    }
    async function j(C) {
      const y = ++r, V = () => P(C) && y === r;
      if (!l.id) {
        m.value = "No extractor selected.";
        return;
      }
      try {
        const B = await ge.get(l.id);
        if (!V()) return;
        i.value = B, m.value = "", B.can_edit && await G(C);
      } catch (B) {
        V() && (m.value = N(B));
      }
    }
    pe(() => l.id, (C, y) => {
      o++, R = void 0, x.forEach((B) => B()), x = [], q.value = void 0, i.value = void 0, S.value = null, $.value = [], f.value = void 0, m.value = "";
      const V = o;
      l.id && (x = [kt(`component.${l.id}`, () => j(V)), kt(`docscout.runs.${l.id}`, () => j(V))]), y !== void 0 && j(V);
    }, { immediate: !0 }), fl(() => j(o)), Ct(() => {
      o++, x.forEach((C) => C());
    });
    async function T(C) {
      const y = o;
      g.value = !0, m.value = "";
      try {
        const V = await C();
        if (P(y))
          return await j(y), V;
      } catch (V) {
        P(y) && (m.value = N(V));
      } finally {
        g.value = !1;
      }
    }
    const O = (C) => T(() => ge.update(l.id, C));
    async function ue(C) {
      const y = o, V = await T(() => ge.addCase(l.id, C));
      V && P(y) && (q.value = V.id);
    }
    const ke = (C) => T(() => ge.deleteCase(l.id, C));
    async function le(C) {
      const y = o;
      c.value = !0, m.value = "";
      try {
        const V = await ge.run(l.id, C);
        P(y) && (S.value = V, await j(y));
      } catch (V) {
        if (P(y)) {
          const B = V?.response?.data?.error;
          m.value = i.value?.config?.stages.extract.reads === "pages" && B ? B : N(V);
        }
      } finally {
        c.value = !1;
      }
    }
    async function oe() {
      const C = o;
      k.value = !0, m.value = "";
      try {
        const { eval_id: y } = await ge.evaluate(l.id);
        P(C) && await G(C, y);
      } catch (y) {
        P(C) && (m.value = N(y));
      } finally {
        k.value = !1;
      }
    }
    function be(C) {
      G(o, C);
    }
    return (C, y) => i.value ? (a(), J(Jd, {
      key: 0,
      snapshot: i.value,
      "added-case-id": q.value,
      saving: g.value,
      running: c.value,
      starting: k.value,
      result: S.value,
      evaluations: $.value,
      evaluation: f.value,
      error: m.value,
      back: e.back,
      onBack: y[0] || (y[0] = (V) => u("back")),
      onRun: le,
      onSave: O,
      onAddCase: ue,
      onDeleteCase: ke,
      onEvaluate: oe,
      onOpenEvaluation: be
    }, null, 8, ["snapshot", "added-case-id", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : m.value ? (a(), n("p", Yd, d(m.value), 1)) : (a(), n("p", Xd, "Loading Docscout…"));
  }
});
export {
  ar as _,
  Ye as w
};
