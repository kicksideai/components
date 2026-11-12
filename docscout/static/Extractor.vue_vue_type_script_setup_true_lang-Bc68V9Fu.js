import { defineComponent as H, useModel as Be, openBlock as a, createElementBlock as s, withModifiers as ve, createElementVNode as t, mergeModels as Xe, computed as N, withKeys as Ee, unref as b, normalizeClass as Q, createVNode as f, toDisplayString as d, Fragment as M, renderList as z, createCommentVNode as g, createTextVNode as F, createBlock as J, ref as R, toRaw as lt, useId as pe, watch as be, withDirectives as W, vModelText as _, vModelSelect as Ge, resolveComponent as it, renderSlot as Ie, withCtx as me, mergeProps as ht, vShow as Ke, onMounted as Ue, nextTick as Ce, normalizeStyle as qe, onBeforeUnmount as Ct, vModelDynamic as rl } from "vue";
import { B as cl, L as vl, j as ze, v as Me, k as ml, U as pl, I as yt, f as bl, i as Qe, l as Et, t as at, h as $e, o as ut, p as fl, m as qt, q as K, M as Ae, r as Ut, w as Nt, x as nt, y as gl, z as hl, A as yl, C as kl, D as $l, E as Ft, F as xl, G as Mt, H as wl, J as Vl, K as Sl, N as kt, O as Cl, P as et, Q as El, R as Oe, S as ql, T as st, s as de, n as $t, V as Ul, W as Nl, b as Fl, c as he } from "./index-CrYiACP3.js";
import { loadByTagName as Ze, on as xt } from "@wippy-fe/proxy";
import { Icon as L } from "@iconify/vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
var Ml = cl.extend({
  name: "focustrap-directive"
}), Al = ml.extend({
  style: Ml
});
function Pe(e) {
  "@babel/helpers - typeof";
  return Pe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, Pe(e);
}
function wt(e, n) {
  var l = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    n && (u = u.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), l.push.apply(l, u);
  }
  return l;
}
function Vt(e) {
  for (var n = 1; n < arguments.length; n++) {
    var l = arguments[n] != null ? arguments[n] : {};
    n % 2 ? wt(Object(l), !0).forEach(function(u) {
      Rl(e, u, l[u]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(l)) : wt(Object(l)).forEach(function(u) {
      Object.defineProperty(e, u, Object.getOwnPropertyDescriptor(l, u));
    });
  }
  return e;
}
function Rl(e, n, l) {
  return (n = Ll(n)) in e ? Object.defineProperty(e, n, { value: l, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = l, e;
}
function Ll(e) {
  var n = Bl(e, "string");
  return Pe(n) == "symbol" ? n : n + "";
}
function Bl(e, n) {
  if (Pe(e) != "object" || !e) return e;
  var l = e[Symbol.toPrimitive];
  if (l !== void 0) {
    var u = l.call(e, n);
    if (Pe(u) != "object") return u;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(e);
}
var Ol = Al.extend("focustrap", {
  mounted: function(n, l) {
    var u = l.value || {}, i = u.disabled;
    i || (this.createHiddenFocusableElements(n, l), this.bind(n, l), this.autoElementFocus(n, l)), n.setAttribute("data-pd-focustrap", !0), this.$el = n;
  },
  updated: function(n, l) {
    var u = l.value || {}, i = u.disabled;
    i && this.unbind(n);
  },
  unmounted: function(n) {
    this.unbind(n);
  },
  methods: {
    getComputedSelector: function(n) {
      return ':not(.p-hidden-focusable):not([data-p-hidden-focusable="true"])'.concat(n ?? "");
    },
    bind: function(n, l) {
      var u = this, i = l.value || {}, p = i.onFocusIn, y = i.onFocusOut;
      n.$_pfocustrap_mutationobserver = new MutationObserver(function(r) {
        r.forEach(function($) {
          if ($.type === "childList" && !n.contains(document.activeElement)) {
            var C = function(v) {
              var w = yt(v) ? yt(v, u.getComputedSelector(n.$_pfocustrap_focusableselector)) ? v : Me(n, u.getComputedSelector(n.$_pfocustrap_focusableselector)) : Me(v);
              return bl(w) ? w : v.nextSibling && C(v.nextSibling);
            };
            ze(C($.nextSibling));
          }
        });
      }), n.$_pfocustrap_mutationobserver.disconnect(), n.$_pfocustrap_mutationobserver.observe(n, {
        childList: !0
      }), n.$_pfocustrap_focusinlistener = function(r) {
        return p && p(r);
      }, n.$_pfocustrap_focusoutlistener = function(r) {
        return y && y(r);
      }, n.addEventListener("focusin", n.$_pfocustrap_focusinlistener), n.addEventListener("focusout", n.$_pfocustrap_focusoutlistener);
    },
    unbind: function(n) {
      n.$_pfocustrap_mutationobserver && n.$_pfocustrap_mutationobserver.disconnect(), n.$_pfocustrap_focusinlistener && n.removeEventListener("focusin", n.$_pfocustrap_focusinlistener) && (n.$_pfocustrap_focusinlistener = null), n.$_pfocustrap_focusoutlistener && n.removeEventListener("focusout", n.$_pfocustrap_focusoutlistener) && (n.$_pfocustrap_focusoutlistener = null);
    },
    autoFocus: function(n) {
      this.autoElementFocus(this.$el, {
        value: Vt(Vt({}, n), {}, {
          autoFocus: !0
        })
      });
    },
    autoElementFocus: function(n, l) {
      var u = l.value || {}, i = u.autoFocusSelector, p = i === void 0 ? "" : i, y = u.firstFocusableSelector, r = y === void 0 ? "" : y, $ = u.autoFocus, C = $ === void 0 ? !1 : $, S = Me(n, "[autofocus]".concat(this.getComputedSelector(p)));
      C && !S && (S = Me(n, this.getComputedSelector(r))), ze(S);
    },
    onFirstHiddenElementFocus: function(n) {
      var l, u = n.currentTarget, i = n.relatedTarget, p = i === u.$_pfocustrap_lasthiddenfocusableelement || !((l = this.$el) !== null && l !== void 0 && l.contains(i)) ? Me(u.parentElement, this.getComputedSelector(u.$_pfocustrap_focusableselector)) : u.$_pfocustrap_lasthiddenfocusableelement;
      ze(p);
    },
    onLastHiddenElementFocus: function(n) {
      var l, u = n.currentTarget, i = n.relatedTarget, p = i === u.$_pfocustrap_firsthiddenfocusableelement || !((l = this.$el) !== null && l !== void 0 && l.contains(i)) ? vl(u.parentElement, this.getComputedSelector(u.$_pfocustrap_focusableselector)) : u.$_pfocustrap_firsthiddenfocusableelement;
      ze(p);
    },
    createHiddenFocusableElements: function(n, l) {
      var u = this, i = l.value || {}, p = i.tabIndex, y = p === void 0 ? 0 : p, r = i.firstFocusableSelector, $ = r === void 0 ? "" : r, C = i.lastFocusableSelector, S = C === void 0 ? "" : C, v = function(m) {
        return pl("span", {
          class: "p-hidden-accessible p-hidden-focusable",
          tabIndex: y,
          role: "presentation",
          "aria-hidden": !0,
          "data-p-hidden-accessible": !0,
          "data-p-hidden-focusable": !0,
          onFocus: m?.bind(u)
        });
      }, w = v(this.onFirstHiddenElementFocus), V = v(this.onLastHiddenElementFocus);
      w.$_pfocustrap_lasthiddenfocusableelement = V, w.$_pfocustrap_focusableselector = $, w.setAttribute("data-pc-section", "firstfocusableelement"), V.$_pfocustrap_firsthiddenfocusableelement = w, V.$_pfocustrap_focusableselector = S, V.setAttribute("data-pc-section", "lastfocusableelement"), n.prepend(w), n.append(V);
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
    const n = Be(e, "modelValue");
    return (l, u) => (a(), s("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": n.value,
      "aria-label": e.label,
      disabled: e.disabled,
      onClick: u[0] || (u[0] = ve((i) => n.value = !n.value, ["stop"]))
    }, [...u[1] || (u[1] = [
      t("span", null, null, -1)
    ])], 8, Pl));
  }
}), Tl = ["aria-label"], Dl = { class: "node-icon" }, jl = { class: "node-main" }, Il = { class: "node-title" }, zl = { class: "node-summary" }, Wl = {
  key: 0,
  class: "chips"
}, Hl = {
  key: 1,
  class: "trace-line"
}, Gl = { class: "node-side" }, Kl = {
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
  setup(e, { emit: n }) {
    const l = e, u = n, i = N(() => Qe(l.config, l.stage)), p = N(() => l.config.stages[l.stage].model), y = N({ get: () => i.value, set: (C) => {
      l.config.stages[l.stage].enabled = C;
    } }), r = N(() => {
      const C = l.config, S = C.stages;
      switch (l.stage) {
        case "map":
          return C.fields.filter((v) => v.search_within === "sections").map((v) => ({ text: v.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...S.prefetch.queries.map((v) => ({ text: v.name || "Untitled query", tone: "" })), ...C.fields.filter((v) => v.search_hints.trim()).map((v) => ({ text: v.name, tone: "hint" }))];
        case "scout":
          return S.scout.mode === "agent" ? S.scout.tools.map((v) => ({ text: at(v).toLowerCase(), tone: "" })) : [];
        case "deep":
          return C.fields.filter((v) => v.strategy === "deep").map((v) => ({ text: v.name || "New field", tone: "primary" }));
        case "extract":
          return Et(C).map((v) => ({ text: `${v.name} · ${v.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), $ = (C) => [`${(C.duration_ms / 1e3).toFixed(1)}s`, `${(C.input_tokens + C.output_tokens).toLocaleString()} tokens`, C.queries?.length ? `${C.queries.length} queries` : "", C.message ?? ""].filter(Boolean).join(" · ");
    return (C, S) => (a(), s("div", {
      class: Q(["node kx-focus-halo", { active: e.active, off: !i.value, fixed: e.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": b($e)[e.stage],
      onClick: S[1] || (S[1] = (v) => u("select")),
      onKeydown: [
        S[2] || (S[2] = Ee((v) => u("select"), ["enter"])),
        S[3] || (S[3] = Ee(ve((v) => u("select"), ["prevent"]), ["space"]))
      ]
    }, [
      t("span", Dl, [
        f(b(L), {
          icon: b(ut)[e.stage]
        }, null, 8, ["icon"])
      ]),
      t("span", jl, [
        t("span", Il, d(b($e)[e.stage]), 1),
        t("span", zl, d(i.value ? b(fl)(e.stage, e.config) : "Off"), 1),
        i.value && r.value.length ? (a(), s("span", Wl, [
          (a(!0), s(M, null, z(r.value, (v) => (a(), s("span", {
            key: v.text,
            class: Q(["chip", { primary: v.tone === "primary", "muted-chip": v.tone === "hint" }])
          }, d(v.text), 3))), 128))
        ])) : g("", !0),
        e.trace ? (a(), s("span", Hl, [
          f(b(L), {
            icon: e.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          F(d($(e.trace)), 1)
        ])) : g("", !0)
      ]),
      t("span", Gl, [
        i.value && p.value ? (a(), s("span", Kl, d(b(qt)(p.value)), 1)) : g("", !0),
        e.stage !== "extract" && !e.readonly ? (a(), J(Z, {
          key: 1,
          modelValue: y.value,
          "onUpdate:modelValue": S[0] || (S[0] = (v) => y.value = v),
          label: `Enable ${b($e)[e.stage]}`
        }, null, 8, ["modelValue", "label"])) : g("", !0)
      ])
    ], 42, Tl));
  }
}), Ql = ["aria-labelledby"], Jl = ["aria-label", "aria-checked", "tabindex", "disabled", "onClick", "onKeydown"], ye = /* @__PURE__ */ H({
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
    const n = e, l = Be(e, "modelValue"), u = R([]);
    function i(p, y) {
      const r = n.options.length - 1, $ = { ArrowRight: y + 1, ArrowDown: y + 1, ArrowLeft: y - 1, ArrowUp: y - 1, Home: 0, End: r }[p.key];
      if ($ === void 0) return;
      p.preventDefault();
      const C = ($ + n.options.length) % n.options.length;
      l.value = n.options[C].value, u.value[C]?.focus();
    }
    return (p, y) => (a(), s("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": e.labelledBy
    }, [
      (a(!0), s(M, null, z(e.options, (r, $) => (a(), s("button", {
        key: r.value,
        ref_for: !0,
        ref_key: "buttons",
        ref: u,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        role: "radio",
        "aria-label": e.name ? `${e.name}: ${r.label}` : void 0,
        "aria-checked": l.value === r.value,
        tabindex: l.value === r.value ? 0 : -1,
        disabled: e.disabled,
        onClick: (C) => l.value = r.value,
        onKeydown: (C) => i(C, $)
      }, [
        r.icon ? (a(), J(b(L), {
          key: 0,
          icon: r.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : g("", !0),
        t("span", null, d(r.label), 1)
      ], 40, Jl))), 128))
    ], 8, Ql));
  }
}), ie = (e, n) => `${e}:${n.join("/")}`, At = [
  { value: "text", label: "Text", icon: "tabler:typography" },
  { value: "number", label: "Number", icon: "tabler:123" },
  { value: "boolean", label: "Yes / no", icon: "tabler:toggle-right" },
  { value: "date", label: "Date", icon: "tabler:calendar" },
  { value: "enum", label: "One of a set", icon: "tabler:list-details" },
  { value: "list", label: "List", icon: "tabler:brackets" },
  { value: "object", label: "Object", icon: "tabler:braces" }
], Yl = (e) => At.find((n) => n.value === e).icon;
function Je(e) {
  const n = [];
  function l(u, i, p, y) {
    n.push({ field: i, trail: p, shape: u, path: y, depth: p.length + 1, key: ie(i, p) }), u.properties?.forEach((r, $) => l(r, i, [...p, $], `${y}.${r.name || "New property"}`)), u.item && l(u.item, i, [...p, "item"], `${y}[]`);
  }
  return e.forEach((u, i) => l(u, i, [], K(u) || "New field")), n;
}
function ot(e) {
  return 1 + Math.max(0, ...(e.properties ?? []).map(ot), e.item ? ot(e.item) : 0);
}
function Xl(e, n) {
  return Je(e).filter((l) => l.shape.type === "object" && ((l.shape.properties?.length ?? 0) < 100 || l.field === n.field && ie(l.field, l.trail) === ie(n.field, n.trail.slice(0, -1))) && l.depth + ot(n.shape) <= Ae && !(l.field === n.field && n.trail.every((u, i) => l.trail[i] === u)));
}
function Zl(e, n, l) {
  const u = { ...Nt(), ...structuredClone(lt(n.shape)), name: n.shape.name };
  n.trail.length ? Je(e).find((y) => y.key === ie(n.field, n.trail.slice(0, -1))).shape.properties.splice(n.trail.at(-1), 1) : e.splice(n.field, 1);
  let i;
  if (l) {
    const { name: p, type: y, description: r, enum_values: $, expected_format: C, required: S, properties: v, item: w, nullable: V, max_length: o } = u;
    i = { name: p, type: y, description: r, enum_values: $, expected_format: C, required: S, ...v ? { properties: v } : {}, ...w ? { item: w } : {}, ...V !== void 0 ? { nullable: V } : {}, ...o !== void 0 ? { max_length: o } : {} }, l.shape.properties.push(i), i = l.shape.properties.at(-1);
  } else {
    const { nullable: p, max_length: y, ...r } = u;
    i = { ...nt(), ...r, group: "" }, e.push(i), i = e.at(-1);
  }
  return Je(e).find((p) => p.shape === i);
}
function St(e, n = !1) {
  function l(i) {
    return i.type === "object" ? Object.fromEntries((i.properties ?? []).map((p) => [p.name || "unnamed", l(p)])) : i.type === "list" ? i.item ? [l(i.item)] : [] : n ? i.enum_values?.length ? i.enum_values[0] : { text: "Example value", number: 42, boolean: !0, date: "2026-01-15", enum: null }[i.type] : i.type === "enum" ? i.enum_values?.join(" | ") || "enum" : i.type;
  }
  const u = {};
  return e.forEach((i) => Ut(u, K(i) || "unnamed", l(i))), u;
}
const _l = { class: "shape-editor" }, ea = { key: 0 }, ta = ["aria-label", "aria-invalid", "aria-describedby"], la = { class: "label-block" }, aa = ["id"], na = { key: 0 }, sa = ["id"], oa = {
  key: 2,
  class: "label-block"
}, ia = { class: "chips" }, ua = ["aria-label", "onClick"], da = {
  key: 0,
  class: "row"
}, ra = ["onKeydown"], ca = {
  key: 1,
  class: "field-error",
  role: "alert"
}, va = { key: 3 }, ma = ["placeholder"], pa = {
  key: 4,
  class: "toggle-row"
}, ba = { class: "toggle-row" }, fa = { key: 0 }, ga = { class: "muted" }, ha = ["aria-label", "disabled"], ya = /* @__PURE__ */ H({
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
  setup(e, { emit: n }) {
    const l = e, u = n, i = N(() => l.shape), p = N(() => l.named ? l.depth === 1 ? "Field type" : "Property type" : "Item type"), y = N(() => At.filter((T) => l.depth < Ae || !["object", "list"].includes(T.value))), r = N({ get: () => l.shape.type, set: (T) => {
      l.shape.type = T, delete l.shape.properties, delete l.shape.item, l.shape.enum_values = [], ["text", "date", "enum"].includes(T) || delete i.value.max_length, T === "object" && (l.shape.properties = []), T === "list" && (l.shape.item = gl());
    } }), $ = N(() => l.named && l.depth > 1), C = N({ get: () => i.value.nullable === !0, set: (T) => {
      T ? i.value.nullable = !0 : delete i.value.nullable;
    } }), S = N({ get: () => i.value.max_length ?? "", set: (T) => {
      T === "" ? delete i.value.max_length : i.value.max_length = Number(T);
    } }), v = pe(), w = pe(), V = R(""), o = R("");
    be(() => l.shape, () => {
      V.value = "", o.value = "";
    });
    const m = N(() => l.validationError || (l.named ? hl(i.value.name, l.siblingNames) : "") || yl(l.shape, l.depth));
    function A() {
      const T = V.value.trim(), U = l.shape.enum_values ?? [];
      if (!T || T.length > 200) {
        o.value = "Enter 1 to 200 characters.";
        return;
      }
      if (U.includes(T)) {
        o.value = "This value already exists.";
        return;
      }
      if (U.length >= 100) {
        o.value = "Use at most 100 allowed values.";
        return;
      }
      l.shape.enum_values = [...U, T], V.value = "", o.value = "";
    }
    return (T, U) => (a(), s("div", _l, [
      e.named ? (a(), s("label", ea, [
        U[10] || (U[10] = F("Name", -1)),
        W(t("input", {
          "onUpdate:modelValue": U[0] || (U[0] = (B) => i.value.name = B),
          "aria-label": e.depth === 1 ? "Field name" : "Property name",
          "aria-invalid": !!m.value,
          "aria-describedby": m.value ? b(w) : void 0,
          maxlength: "80",
          spellcheck: "false",
          class: "mono-input"
        }, null, 8, ta), [
          [
            _,
            i.value.name,
            void 0,
            { trim: !0 }
          ]
        ])
      ])) : g("", !0),
      t("div", la, [
        t("span", { id: b(v) }, d(e.named ? "Data type" : "Item type"), 9, aa),
        f(ye, {
          modelValue: r.value,
          "onUpdate:modelValue": U[1] || (U[1] = (B) => r.value = B),
          class: "type-picker",
          options: y.value,
          "labelled-by": b(v),
          name: p.value,
          disabled: e.readonly
        }, null, 8, ["modelValue", "options", "labelled-by", "name", "disabled"]),
        e.depth === b(Ae) ? (a(), s("small", na, "Level four · choose a value type.")) : g("", !0)
      ]),
      m.value ? (a(), s("p", {
        key: 1,
        id: b(w),
        class: "field-error",
        role: "alert"
      }, d(m.value), 9, sa)) : g("", !0),
      b(kl)(e.shape, e.named) ? (a(), s("div", oa, [
        t("span", null, d(e.shape.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        t("div", ia, [
          (a(!0), s(M, null, z(e.shape.enum_values, (B, G) => (a(), s("span", {
            key: B,
            class: "chip primary"
          }, [
            F(d(B), 1),
            e.readonly ? g("", !0) : (a(), s("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Remove allowed value ${B}`,
              onClick: (j) => e.shape.enum_values.splice(G, 1)
            }, [
              f(b(L), { icon: "tabler:x" })
            ], 8, ua))
          ]))), 128))
        ]),
        e.readonly ? g("", !0) : (a(), s("div", da, [
          W(t("input", {
            "onUpdate:modelValue": U[2] || (U[2] = (B) => V.value = B),
            "aria-label": "New allowed value",
            placeholder: "Add a value…",
            maxlength: "200",
            onKeydown: Ee(ve(A, ["prevent"]), ["enter"])
          }, null, 40, ra), [
            [_, V.value]
          ]),
          t("button", {
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo",
            onClick: A
          }, "Add")
        ])),
        o.value ? (a(), s("p", ca, d(o.value), 1)) : g("", !0)
      ])) : g("", !0),
      t("label", null, [
        U[11] || (U[11] = F("Description", -1)),
        W(t("textarea", {
          "onUpdate:modelValue": U[3] || (U[3] = (B) => e.shape.description = B),
          rows: "3",
          maxlength: "4000",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [_, e.shape.description]
        ])
      ]),
      ["boolean", "enum"].includes(e.shape.type) ? g("", !0) : (a(), s("label", va, [
        U[12] || (U[12] = F("Expected format", -1)),
        W(t("input", {
          "onUpdate:modelValue": U[4] || (U[4] = (B) => e.shape.expected_format = B),
          maxlength: "400",
          placeholder: b($l)(e.shape)
        }, null, 8, ma), [
          [_, e.shape.expected_format]
        ])
      ])),
      e.named ? (a(), s("div", pa, [
        U[13] || (U[13] = t("span", null, "Required", -1)),
        f(Z, {
          modelValue: i.value.required,
          "onUpdate:modelValue": U[5] || (U[5] = (B) => i.value.required = B),
          label: "Required",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : g("", !0),
      $.value ? (a(), s(M, { key: 5 }, [
        t("div", ba, [
          U[14] || (U[14] = t("span", null, [
            F("May be absent"),
            t("small", null, "A missing member has no value.")
          ], -1)),
          f(Z, {
            modelValue: C.value,
            "onUpdate:modelValue": U[6] || (U[6] = (B) => C.value = B),
            label: "May be absent",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        ["text", "date", "enum"].includes(e.shape.type) ? (a(), s("label", fa, [
          U[15] || (U[15] = F("Maximum characters", -1)),
          W(t("input", {
            "onUpdate:modelValue": U[7] || (U[7] = (B) => S.value = B),
            type: "number",
            min: "1",
            step: "1",
            "aria-label": "Maximum characters"
          }, null, 512), [
            [_, S.value]
          ]),
          U[16] || (U[16] = t("small", null, "Optional. Longer values fail extraction.", -1))
        ])) : g("", !0)
      ], 64)) : g("", !0),
      e.shape.type === "object" ? (a(), s(M, { key: 6 }, [
        t("p", ga, d(e.shape.properties?.length ?? 0) + " properties · Select a property in the tree to edit it.", 1),
        !e.readonly && e.depth < b(Ae) ? (a(), s("button", {
          key: 0,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Add property to ${e.label}`,
          disabled: (e.shape.properties?.length ?? 0) >= 100,
          onClick: U[8] || (U[8] = (B) => u("add"))
        }, [
          f(b(L), { icon: "tabler:plus" }),
          U[17] || (U[17] = F("Add property", -1))
        ], 8, ha)) : g("", !0)
      ], 64)) : g("", !0),
      e.shape.type === "list" && e.shape.item ? (a(), s("button", {
        key: 7,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        onClick: U[9] || (U[9] = (B) => u("selectItem"))
      }, [
        f(b(L), { icon: "tabler:brackets" }),
        F("Edit item shape · " + d(e.shape.item.type), 1)
      ])) : g("", !0)
    ]));
  }
}), ka = ["disabled"], $a = { class: "grid" }, xa = { class: "context-stepper" }, wa = ["disabled"], Va = ["disabled"], Sa = {
  key: 0,
  class: "field-note"
}, Ca = { class: "label-block" }, Ea = {
  key: 1,
  class: "field-error"
}, qa = { id: "docscout-groups" }, Ua = ["value"], Na = { class: "toggle-row" }, Fa = /* @__PURE__ */ H({
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
  setup(e, { emit: n }) {
    const l = e, u = n, i = N(() => !l.depth || l.depth === 1), p = N(() => Ft(l.field, l.otherNames));
    return (y, r) => (a(), s("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      f(ya, {
        shape: e.shape ?? e.field,
        depth: e.depth ?? 1,
        label: e.shape?.name || e.field.name || "field",
        named: i.value || !!e.shape?.name || !!e.siblingNames,
        "sibling-names": e.siblingNames,
        "validation-error": i.value ? p.value : void 0,
        readonly: e.readonly,
        onAdd: r[0] || (r[0] = ($) => u("add")),
        onSelectItem: r[1] || (r[1] = ($) => u("selectItem"))
      }, null, 8, ["shape", "depth", "label", "named", "sibling-names", "validation-error", "readonly"]),
      i.value ? (a(), s(M, { key: 0 }, [
        r[25] || (r[25] = t("h4", null, "Finding it", -1)),
        t("label", null, [
          r[12] || (r[12] = F("Search hints", -1)),
          W(t("textarea", {
            "onUpdate:modelValue": r[2] || (r[2] = ($) => e.field.search_hints = $),
            rows: "2",
            maxlength: "4000",
            placeholder: "One query per line"
          }, null, 512), [
            [_, e.field.search_hints]
          ]),
          r[13] || (r[13] = t("small", null, "Each line is an extra search for this field in Prefetch and Deep analysis.", -1))
        ]),
        t("div", $a, [
          t("label", null, [
            r[15] || (r[15] = F("Strategy", -1)),
            W(t("select", {
              "onUpdate:modelValue": r[3] || (r[3] = ($) => e.field.strategy = $)
            }, [...r[14] || (r[14] = [
              t("option", { value: "standard" }, "Standard", -1),
              t("option", { value: "deep" }, "Deep analysis", -1)
            ])], 512), [
              [Ge, e.field.strategy]
            ])
          ]),
          t("label", null, [
            r[16] || (r[16] = F("Chunks to read", -1)),
            t("span", xa, [
              W(t("input", {
                "onUpdate:modelValue": r[4] || (r[4] = ($) => e.field.chunks = $),
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
                onClick: r[5] || (r[5] = ($) => e.field.chunks--)
              }, "−", 8, wa),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Increase chunks to read",
                disabled: e.field.chunks >= 1e3 || e.readonly,
                onClick: r[6] || (r[6] = ($) => e.field.chunks++)
              }, "+", 8, Va)
            ]),
            r[17] || (r[17] = t("small", null, "Per search hint", -1))
          ])
        ]),
        e.field.strategy === "deep" && !e.deepEnabled ? (a(), s("p", Sa, [
          f(b(L), { icon: "tabler:info-circle" }),
          r[18] || (r[18] = F("Deep analysis is off in the flow, so this field runs as standard.", -1))
        ])) : g("", !0),
        t("div", Ca, [
          r[19] || (r[19] = t("span", { id: "within-label" }, "Search within", -1)),
          f(ye, {
            modelValue: e.field.search_within,
            "onUpdate:modelValue": r[7] || (r[7] = ($) => e.field.search_within = $),
            "labelled-by": "within-label",
            options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
          }, null, 8, ["modelValue"]),
          t("small", null, d(e.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
        ]),
        e.field.search_within === "sections" && !e.mapEnabled ? (a(), s("p", Ea, [
          f(b(L), { icon: "tabler:alert-circle" }),
          r[20] || (r[20] = F("Turn on Map the document to read sections.", -1))
        ])) : g("", !0),
        t("label", null, [
          r[21] || (r[21] = F("Group", -1)),
          W(t("input", {
            "onUpdate:modelValue": r[8] || (r[8] = ($) => e.field.group = $),
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
          t("datalist", qa, [
            (a(!0), s(M, null, z(e.groups, ($) => (a(), s("option", {
              key: $,
              value: $
            }, null, 8, Ua))), 128))
          ]),
          r[22] || (r[22] = t("small", null, "Use dotted snake_case names. Values nest under this path.", -1))
        ]),
        r[26] || (r[26] = t("h4", null, "Checking it", -1)),
        t("label", null, [
          r[23] || (r[23] = F("Validation hints", -1)),
          W(t("textarea", {
            "onUpdate:modelValue": r[9] || (r[9] = ($) => e.field.validation_hints = $),
            rows: "2",
            maxlength: "4000",
            placeholder: "Rules the value must satisfy"
          }, null, 512), [
            [_, e.field.validation_hints]
          ])
        ]),
        t("div", Na, [
          r[24] || (r[24] = t("span", null, [
            F("Evidence required"),
            t("small", null, "The value must cite a quote from the document.")
          ], -1)),
          f(Z, {
            modelValue: e.field.evidence_required,
            "onUpdate:modelValue": r[10] || (r[10] = ($) => e.field.evidence_required = $),
            label: "Evidence required",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : g("", !0),
      !e.readonly && (i.value || e.siblingNames) ? (a(), s("button", {
        key: 1,
        type: "button",
        class: "kx-btn kx-btn-danger kx-focus-halo",
        onClick: r[11] || (r[11] = ($) => u("remove"))
      }, d(i.value ? "Remove field" : "Remove property"), 1)) : g("", !0)
    ], 8, ka));
  }
}), Ma = { class: "field-groups" }, Aa = {
  key: 0,
  class: "rows"
}, Ra = ["aria-label"], La = { class: "field-group-head" }, Ba = ["aria-label", "aria-expanded", "aria-controls", "onClick"], Oa = { class: "group-title" }, Pa = ["id"], Ta = { class: "group-title" }, Re = /* @__PURE__ */ H({
  __name: "FieldGroups",
  props: {
    node: {}
  },
  setup(e) {
    const n = R(/* @__PURE__ */ new Set()), l = pe();
    function u(p) {
      n.value.has(p) ? n.value.delete(p) : n.value.add(p);
    }
    const i = (p) => p.indices.length + p.children.reduce((y, r) => y + i(r), 0);
    return (p, y) => {
      const r = it("FieldGroups", !0);
      return a(), s("div", Ma, [
        e.node.indices.length ? (a(), s("ul", Aa, [
          (a(!0), s(M, null, z(e.node.indices, ($) => (a(), s("li", { key: $ }, [
            Ie(p.$slots, "default", { index: $ })
          ]))), 128))
        ])) : g("", !0),
        (a(!0), s(M, null, z(e.node.children, ($, C) => (a(), s("section", {
          key: $.path,
          class: "field-group",
          "aria-label": `Group ${$.path}`
        }, [
          t("header", La, [
            t("button", {
              type: "button",
              class: "tree-toggle kx-iconbtn kx-focus-outline",
              "aria-label": `${n.value.has($.path) ? "Expand" : "Collapse"} group ${$.path}`,
              "aria-expanded": !n.value.has($.path),
              "aria-controls": `${b(l)}-${$.path}`,
              onClick: (S) => u($.path)
            }, [
              f(b(L), {
                icon: n.value.has($.path) ? "tabler:chevron-right" : "tabler:chevron-down"
              }, null, 8, ["icon"])
            ], 8, Ba),
            Ie(p.$slots, "header", {
              path: $.path,
              label: $.name,
              count: i($),
              first: C === 0,
              last: C === e.node.children.length - 1
            }, () => [
              t("span", Oa, d($.name), 1)
            ])
          ]),
          W(t("div", {
            id: `${b(l)}-${$.path}`,
            class: "group-content"
          }, [
            f(r, { node: $ }, {
              default: me((S) => [
                Ie(p.$slots, "default", ht({ ref_for: !0 }, S))
              ]),
              header: me((S) => [
                Ie(p.$slots, "header", ht({ ref_for: !0 }, S), () => [
                  t("span", Ta, d(S.label), 1)
                ])
              ]),
              _: 3
            }, 8, ["node"])
          ], 8, Pa), [
            [Ke, !n.value.has($.path)]
          ])
        ], 8, Ra))), 128))
      ]);
    };
  }
}), Da = ["aria-label", "maxlength", "aria-invalid", "aria-describedby", "onKeydown"], ja = ["aria-label", "title"], Ia = ["aria-label", "title"], za = ["id"], Rt = /* @__PURE__ */ H({
  __name: "GroupPathEditor",
  props: {
    initialValue: { default: "" },
    inputLabel: {},
    saveLabel: {},
    cancelLabel: {},
    maxLength: { default: 320 }
  },
  emits: ["save", "cancel"],
  setup(e, { emit: n }) {
    const l = e, u = n, i = R(l.initialValue), p = R(""), y = R(), r = pe();
    Ue(() => {
      y.value.focus(), y.value.select();
    });
    function $() {
      const C = i.value.trim();
      if (!C || !xl.test(C)) {
        p.value = "Use a dotted path of snake_case group names.";
        return;
      }
      if (C.length > l.maxLength) {
        p.value = "The group and its nested paths must fit within 320 characters.";
        return;
      }
      u("save", C);
    }
    return (C, S) => (a(), s("form", {
      class: "group-path-editor",
      onSubmit: ve($, ["prevent"])
    }, [
      W(t("input", {
        ref_key: "input",
        ref: y,
        "onUpdate:modelValue": S[0] || (S[0] = (v) => i.value = v),
        "aria-label": e.inputLabel,
        maxlength: e.maxLength,
        "aria-invalid": !!p.value,
        "aria-describedby": p.value ? b(r) : void 0,
        "aria-required": "true",
        autocomplete: "off",
        spellcheck: "false",
        placeholder: "parties.borrower",
        onKeydown: [
          Ee(ve($, ["prevent"]), ["enter"]),
          S[1] || (S[1] = Ee(ve((v) => u("cancel"), ["stop", "prevent"]), ["esc"]))
        ]
      }, null, 40, Da), [
        [_, i.value]
      ]),
      t("button", {
        type: "submit",
        class: "kx-iconbtn kx-focus-outline",
        "aria-label": e.saveLabel,
        title: e.saveLabel
      }, [
        f(b(L), { icon: "tabler:check" })
      ], 8, ja),
      t("button", {
        type: "button",
        class: "kx-iconbtn kx-focus-outline",
        "aria-label": e.cancelLabel,
        title: e.cancelLabel,
        onClick: S[2] || (S[2] = (v) => u("cancel"))
      }, [
        f(b(L), { icon: "tabler:x" })
      ], 8, Ia),
      p.value ? (a(), s("p", {
        key: 0,
        id: b(r),
        class: "field-error",
        role: "alert"
      }, d(p.value), 9, za)) : g("", !0)
    ], 32));
  }
}), Wa = ["title"], Ha = ["aria-label", "data-group-rename", "title"], Ga = ["aria-label"], Ka = {
  key: 2,
  class: "group-actions"
}, Qa = ["aria-label", "disabled"], Ja = ["aria-label", "aria-expanded", "aria-controls"], Ya = /* @__PURE__ */ H({
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
  setup(e, { emit: n }) {
    const l = e, u = n, i = R(!1), p = R(!1), y = R(), r = R(), $ = R(), C = pe(), S = N(() => [
      { label: "Move up", disabled: l.first, command: () => u("reorder", -1) },
      { label: "Move down", disabled: l.last, command: () => u("reorder", 1) },
      { separator: !0 },
      { label: "Delete group and its fields", command: () => u("remove") }
    ]);
    function v() {
      i.value = !0;
    }
    async function w() {
      i.value = !1, await Ce(), r.value.focus();
    }
    async function V(o) {
      const m = y.value.closest(".field-tree");
      i.value = !1, u("rename", o), await Ce(), m.querySelector(`[data-group-rename="${o}"]`).focus();
    }
    return (o, m) => (a(), s("div", {
      ref_key: "heading",
      ref: y,
      class: "group-heading"
    }, [
      i.value ? (a(), J(Rt, {
        key: 0,
        "initial-value": e.path,
        "input-label": `Group path for ${e.path}`,
        "save-label": "Save group name",
        "cancel-label": "Cancel group rename",
        "max-length": e.maxLength,
        onSave: V,
        onCancel: w
      }, null, 8, ["initial-value", "input-label", "max-length"])) : (a(), s(M, { key: 1 }, [
        e.readonly ? (a(), s("span", {
          key: 0,
          class: "group-title",
          title: e.path
        }, d(e.name), 9, Wa)) : (a(), s("button", {
          key: 1,
          ref_key: "renameButton",
          ref: r,
          type: "button",
          class: "group-title group-name-button kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Rename group ${e.path}`,
          "data-group-rename": e.path,
          title: e.path,
          onClick: v
        }, [
          t("span", null, d(e.name), 1),
          f(b(L), {
            icon: "tabler:pencil",
            "aria-hidden": "true"
          })
        ], 8, Ha)),
        t("span", {
          class: "count group-count",
          "aria-label": `${e.count} fields`
        }, d(e.count), 9, Ga),
        e.readonly ? g("", !0) : (a(), s("div", Ka, [
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Add field to ${e.path}`,
            disabled: !e.canAdd,
            title: "Add field",
            onClick: m[0] || (m[0] = (A) => u("add"))
          }, [
            f(b(L), { icon: "tabler:plus" })
          ], 8, Qa),
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Actions for group ${e.path}`,
            "aria-haspopup": "menu",
            "aria-expanded": p.value,
            "aria-controls": b(C),
            onClick: m[1] || (m[1] = (A) => $.value.toggle(A))
          }, [
            f(b(L), { icon: "tabler:dots" })
          ], 8, Ja),
          f(b(Mt), {
            id: b(C),
            ref_key: "menu",
            ref: $,
            model: S.value,
            popup: "",
            "append-to": "self",
            onShow: m[2] || (m[2] = (A) => p.value = !0),
            onHide: m[3] || (m[3] = (A) => p.value = !1)
          }, null, 8, ["id", "model"])
        ]))
      ], 64))
    ], 512));
  }
}), Xa = ["aria-label", "aria-expanded"], Za = {
  key: 1,
  class: "tree-indent"
}, _a = ["aria-label", "aria-describedby", "aria-current"], en = { class: "row-copy" }, tn = { class: "row-name" }, ln = ["title"], an = ["id", "title"], nn = { class: "field-badges" }, sn = { class: "chip field-type" }, on = { class: "field-flags" }, un = {
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
  setup(e, { emit: n }) {
    const l = e, u = n, i = pe(), p = pe(), y = R(), r = R(!1), $ = N(() => [
      { label: "Move up", disabled: l.first, command: () => u("reorder", l.field, l.trail, -1) },
      { label: "Move down", disabled: l.last, command: () => u("reorder", l.field, l.trail, 1) }
    ]), C = R(!0);
    be(() => l.selected, (m) => {
      const A = ie(l.field, l.trail);
      m !== A && m.startsWith(A + (l.trail.length ? "/" : "")) && (C.value = !0);
    });
    const S = N(() => l.trail.at(-1) !== "item"), v = N(() => S.value ? l.shape.name || "New field" : "Each item"), w = N(() => l.trail.length ? void 0 : l.shape), V = N(() => l.shape.type === "object" || l.shape.type === "list");
    function o(m) {
      m.key === "ArrowRight" && V.value && (C.value = !0, m.preventDefault(), m.stopPropagation()), m.key === "ArrowLeft" && V.value && (C.value = !1, m.preventDefault(), m.stopPropagation());
    }
    return (m, A) => {
      const T = it("ShapeTree", !0);
      return a(), s("div", {
        class: "shape-tree-node",
        onKeydown: o
      }, [
        t("div", {
          class: Q(["row-item", { active: e.selected === b(ie)(e.field, e.trail) }])
        }, [
          V.value ? (a(), s("button", {
            key: 0,
            class: "tree-toggle kx-iconbtn kx-focus-outline",
            type: "button",
            "aria-label": `${C.value ? "Collapse" : "Expand"} ${e.path}`,
            "aria-expanded": C.value,
            onClick: A[0] || (A[0] = (U) => C.value = !C.value)
          }, [
            f(b(L), {
              icon: C.value ? "tabler:chevron-down" : "tabler:chevron-right"
            }, null, 8, ["icon"])
          ], 8, Xa)) : (a(), s("span", Za)),
          t("button", {
            type: "button",
            class: "row-main kx-focus-halo",
            "aria-label": `Edit ${e.path}`,
            "aria-describedby": b(i),
            "aria-current": e.selected === b(ie)(e.field, e.trail) ? "true" : void 0,
            onClick: A[1] || (A[1] = (U) => u("select", e.field, e.trail))
          }, [
            t("span", en, [
              t("span", tn, [
                f(b(L), {
                  icon: b(Yl)(e.shape.type),
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                t("span", {
                  class: "row-label",
                  title: v.value
                }, d(v.value), 9, ln),
                e.error ? (a(), J(b(L), {
                  key: 0,
                  icon: "tabler:alert-circle",
                  class: "row-warn",
                  "aria-label": e.error,
                  title: e.error
                }, null, 8, ["aria-label", "title"])) : g("", !0)
              ]),
              t("span", {
                id: b(i),
                class: Q(["row-desc", { missing: !e.shape.description }]),
                title: e.shape.description || void 0
              }, d(e.shape.description || "No description"), 11, an)
            ]),
            t("span", nn, [
              t("span", sn, d(e.shape.type), 1),
              t("span", on, [
                S.value && e.shape.required ? (a(), s("span", un, [
                  f(b(L), {
                    icon: "tabler:asterisk",
                    "aria-hidden": "true"
                  })
                ])) : g("", !0),
                w.value?.strategy === "deep" ? (a(), s("span", dn, [
                  f(b(L), {
                    icon: "tabler:microscope",
                    "aria-hidden": "true"
                  })
                ])) : g("", !0),
                w.value?.search_within === "sections" ? (a(), s("span", rn, [
                  f(b(L), {
                    icon: "tabler:layout-list",
                    "aria-hidden": "true"
                  })
                ])) : g("", !0),
                w.value?.evidence_required ? (a(), s("span", cn, [
                  f(b(L), {
                    icon: "tabler:file-search",
                    "aria-hidden": "true"
                  })
                ])) : g("", !0)
              ])
            ])
          ], 8, _a),
          !e.readonly && S.value ? (a(), s("span", vn, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} up`,
              disabled: e.first,
              onClick: A[2] || (A[2] = (U) => u("reorder", e.field, e.trail, -1))
            }, [
              f(b(L), { icon: "tabler:chevron-up" })
            ], 8, mn),
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} down`,
              disabled: e.last,
              onClick: A[3] || (A[3] = (U) => u("reorder", e.field, e.trail, 1))
            }, [
              f(b(L), { icon: "tabler:chevron-down" })
            ], 8, pn)
          ])) : g("", !0),
          !e.readonly && S.value ? (a(), s("div", {
            key: 3,
            class: "row-overflow",
            onKeydown: A[7] || (A[7] = ve(() => {
            }, ["stop"]))
          }, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Actions for ${e.path}`,
              "aria-haspopup": "menu",
              "aria-expanded": r.value,
              "aria-controls": b(p),
              onClick: A[4] || (A[4] = (U) => y.value.toggle(U))
            }, [
              f(b(L), { icon: "tabler:dots" })
            ], 8, bn),
            f(b(Mt), {
              id: b(p),
              ref_key: "menu",
              ref: y,
              model: $.value,
              popup: "",
              "append-to": "self",
              onShow: A[5] || (A[5] = (U) => r.value = !0),
              onHide: A[6] || (A[6] = (U) => r.value = !1)
            }, null, 8, ["id", "model"])
          ], 32)) : g("", !0)
        ], 2),
        V.value && C.value ? (a(), s("ul", fn, [
          (a(!0), s(M, null, z(e.shape.properties, (U, B) => (a(), s("li", { key: B }, [
            f(T, {
              shape: U,
              field: e.field,
              trail: [...e.trail, B],
              path: `${e.path}.${U.name || "New property"}`,
              selected: e.selected,
              readonly: e.readonly,
              first: B === 0,
              last: B === e.shape.properties.length - 1,
              onSelect: A[8] || (A[8] = (G, j) => u("select", G, j)),
              onAdd: A[9] || (A[9] = (G, j) => u("add", G, j)),
              onReorder: A[10] || (A[10] = (G, j, D) => u("reorder", G, j, D))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly", "first", "last"])
          ]))), 128)),
          e.shape.item ? (a(), s("li", gn, [
            f(T, {
              shape: e.shape.item,
              field: e.field,
              trail: [...e.trail, "item"],
              path: `${e.path}[]`,
              selected: e.selected,
              readonly: e.readonly,
              onSelect: A[11] || (A[11] = (U, B) => u("select", U, B)),
              onAdd: A[12] || (A[12] = (U, B) => u("add", U, B)),
              onReorder: A[13] || (A[13] = (U, B, G) => u("reorder", U, B, G))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly"])
          ])) : g("", !0),
          !e.readonly && e.shape.type === "object" && e.trail.length + 1 < b(Ae) ? (a(), s("li", hn, [
            t("button", {
              type: "button",
              class: "kx-btn kx-btn-ghost kx-focus-halo sm",
              "aria-label": `Add property to ${e.path}`,
              disabled: (e.shape.properties?.length ?? 0) >= 100,
              onClick: A[14] || (A[14] = (U) => u("add", e.field, e.trail))
            }, [
              f(b(L), { icon: "tabler:plus" }),
              A[15] || (A[15] = F("Add property", -1))
            ], 8, yn)
          ])) : g("", !0)
        ])) : g("", !0)
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
  class: "muted"
}, Cn = /* @__PURE__ */ H({
  __name: "AgentPicker",
  props: {
    value: {},
    readonly: { type: Boolean }
  },
  emits: ["select"],
  setup(e, { emit: n }) {
    const l = n, u = R(!!customElements.get("wc-agent-picker")), i = R("");
    Ue(async () => {
      if (!u.value)
        try {
          await Ze("wc-agent-picker", { timeoutMs: 8e3 }), u.value = !0;
        } catch (y) {
          i.value = y instanceof Error ? y.message : String(y);
        }
    });
    function p(y) {
      if (y.composedPath()[0] !== y.currentTarget) return;
      const r = y.detail;
      l("select", r.agent_id);
    }
    return (y, r) => (a(), s("div", $n, [
      r[0] || (r[0] = t("span", null, "Scout agent", -1)),
      e.readonly ? (a(), s("p", xn, d(e.value || "Built-in scout"), 1)) : u.value ? (a(), s("wc-agent-picker", {
        key: 1,
        config: JSON.stringify({ agent_id: e.value || "" }),
        "aria-label": "Scout agent",
        placeholder: "Choose your agent…",
        onChange: p
      }, null, 40, wn)) : i.value ? (a(), s("p", Vn, "Could not load agent picker: " + d(i.value), 1)) : (a(), s("span", Sn, "Loading agents…")),
      r[1] || (r[1] = t("small", null, "Leave empty to use the built-in scout.", -1))
    ]));
  }
}), En = ["value", "capability", "aria-labelledby"], qn = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, Un = {
  key: 2,
  class: "dz-muted",
  role: "status"
}, ce = /* @__PURE__ */ H({
  __name: "ModelPicker",
  props: {
    value: {},
    capability: {},
    labelledBy: {}
  },
  emits: ["select"],
  setup(e, { emit: n }) {
    const l = n, u = R(!!customElements.get("wc-model-picker")), i = R("");
    Ue(async () => {
      if (!u.value)
        try {
          await Ze("wc-model-picker", { timeoutMs: 8e3 }), u.value = !0;
        } catch (y) {
          i.value = y instanceof Error ? y.message : String(y);
        }
    });
    function p(y) {
      const r = y.detail;
      typeof r == "string" && l("select", r);
    }
    return (y, r) => u.value ? (a(), s("wc-model-picker", {
      key: 0,
      value: e.value,
      capability: e.capability,
      "aria-labelledby": e.labelledBy,
      onSelect: p
    }, null, 40, En)) : i.value ? (a(), s("p", qn, "Could not load model picker: " + d(i.value), 1)) : (a(), s("span", Un, "Loading models…"));
  }
}), Nn = { class: "slider" }, Fn = { class: "slider-head" }, Mn = { class: "slider-value" }, An = ["aria-label", "aria-valuetext", "disabled"], Rn = {
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
    const n = e, l = Be(e, "modelValue"), u = N(() => n.percent ? `${Math.round(l.value * 100)}%` : `${l.value.toLocaleString()}${n.unit ? ` ${n.unit}` : ""}`), i = (r) => n.log ? Math.log(r / n.min) / Math.log(n.max / n.min) * Ve : (r - n.min) / (n.max - n.min) * Ve;
    function p(r) {
      const $ = n.log ? n.min * Math.pow(n.max / n.min, r / Ve) : n.min + (n.max - n.min) * r / Ve, C = Math.round($ / n.step) * n.step;
      return Math.min(n.max, Math.max(n.min, Number(C.toFixed(4))));
    }
    const y = N({ get: () => Math.round(i(l.value)), set: (r) => {
      l.value = p(r);
    } });
    return (r, $) => (a(), s("div", Nn, [
      t("div", Fn, [
        t("span", null, d(e.label), 1),
        t("output", Mn, d(u.value), 1)
      ]),
      W(t("input", {
        "onUpdate:modelValue": $[0] || ($[0] = (C) => y.value = C),
        type: "range",
        min: "0",
        max: Ve,
        step: "1",
        "aria-label": e.label,
        "aria-valuetext": u.value,
        disabled: e.disabled,
        style: qe({ "--fill": `${y.value / Ve * 100}%` })
      }, null, 12, An), [
        [
          _,
          y.value,
          void 0,
          { number: !0 }
        ]
      ]),
      e.hints ? (a(), s("div", Rn, [
        t("span", null, d(e.hints[0]), 1),
        t("span", null, d(e.hints[1]), 1)
      ])) : g("", !0),
      e.note ? (a(), s("small", Ln, d(e.note), 1)) : g("", !0)
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
    const n = e;
    return (l, u) => (a(), s("figure", Bn, [
      t("div", On, [
        u[2] || (u[2] = t("span", { class: "fd-node solid" }, "Pass", -1)),
        (a(!0), s(M, null, z(Math.min(n.rounds, 8), (i) => (a(), s(M, { key: i }, [
          u[0] || (u[0] = t("span", { class: "fd-link" }, null, -1)),
          t("span", Pn, [
            t("span", null, "R" + d(i), 1),
            t("span", Tn, [
              (a(!0), s(M, null, z(Math.min(n.extra, 6), (p) => (a(), s("i", { key: p }))), 128))
            ])
          ])
        ], 64))), 128)),
        n.rounds > 8 ? (a(), s(M, { key: 0 }, [
          u[1] || (u[1] = t("span", { class: "fd-link" }, null, -1)),
          t("span", Dn, "+" + d(n.rounds - 8), 1)
        ], 64)) : g("", !0),
        u[3] || (u[3] = t("span", { class: "fd-link" }, null, -1)),
        t("span", jn, "≥ " + d(Math.round(n.confidence * 100)) + "%", 1)
      ]),
      t("figcaption", null, d(n.rounds ? `One pass, then up to ${n.rounds} rounds with up to ${n.extra} new queries each, stopping as soon as confidence reaches ${Math.round(n.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
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
    const n = e, l = N(() => Math.min(n.queries * n.perQuery, n.cap));
    return (u, i) => (a(), s("figure", zn, [
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
}, Cs = { class: "toggle-row" }, Es = { class: "toggle-row" }, qs = { class: "toggle-row" }, Us = { class: "toggle-row" }, Ns = {
  id: "model-verify",
  class: "model-role"
}, Fs = /* @__PURE__ */ H({
  __name: "StepInspector",
  props: {
    stage: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const n = e, l = N(() => n.config.stages), u = (V) => Cl(n.stage, V), i = wl(), p = N(() => n.config.fields.filter((V) => V.strategy === "deep").length), y = N(() => n.config.fields.filter((V) => V.search_within === "sections").map((V) => V.name || "New field")), r = N(() => Et(n.config)), $ = N({ get: () => l.value.extract.reads ?? "text", set: (V) => {
      l.value.extract.reads = V, V === "pages" && l.value.extract.max_pages === void 0 && (l.value.extract.max_pages = 8);
    } }), C = N({ get: () => l.value.extract.max_pages ?? 8, set: (V) => {
      l.value.extract.max_pages = V;
    } });
    function S(V) {
      l.value.verify.check_support = V, V || (l.value.verify.check_completeness = !1);
    }
    function v(V) {
      V ? l.value.scout.agent_id = V : delete l.value.scout.agent_id;
    }
    function w(V, o) {
      const m = l.value.scout.tools.filter((A) => A !== V);
      l.value.scout.tools = o ? [...m, V] : m;
    }
    return (V, o) => (a(), s("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", Xn, d(b(Vl)[e.stage]), 1),
      e.stage === "map" ? (a(), s(M, { key: 0 }, [
        t("div", Zn, [
          o[35] || (o[35] = t("span", null, "Stage enabled", -1)),
          f(Z, {
            modelValue: l.value.map.enabled,
            "onUpdate:modelValue": o[0] || (o[0] = (m) => l.value.map.enabled = m),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", _n, [
          o[36] || (o[36] = t("span", { id: "outline-label" }, "Outline", -1)),
          f(ye, {
            modelValue: l.value.map.outline,
            "onUpdate:modelValue": o[1] || (o[1] = (m) => l.value.map.outline = m),
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
          f(Z, {
            modelValue: l.value.map.section_summaries,
            "onUpdate:modelValue": o[2] || (o[2] = (m) => l.value.map.section_summaries = m),
            label: "Section summaries",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        o[40] || (o[40] = t("h4", null, "Models", -1)),
        t("div", ts, [
          o[39] || (o[39] = t("span", null, "Outliner", -1)),
          f(ce, {
            value: l.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: o[3] || (o[3] = (m) => l.value.map.model = m)
          }, null, 8, ["value"])
        ]),
        o[41] || (o[41] = t("h4", null, "Fields that read sections", -1)),
        y.value.length ? (a(), s("p", ls, [
          (a(!0), s(M, null, z(y.value, (m) => (a(), s("span", {
            key: m,
            class: "chip primary"
          }, d(m), 1))), 128))
        ])) : (a(), s("p", as, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : g("", !0),
      e.stage === "prefetch" ? (a(), s(M, { key: 1 }, [
        t("div", ns, [
          o[42] || (o[42] = t("span", null, "Stage enabled", -1)),
          f(Z, {
            modelValue: l.value.prefetch.enabled,
            "onUpdate:modelValue": o[4] || (o[4] = (m) => l.value.prefetch.enabled = m),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        o[46] || (o[46] = t("h4", null, "Queries", -1)),
        (a(!0), s(M, null, z(l.value.prefetch.queries, (m, A) => (a(), s("div", {
          key: A,
          class: "query-row"
        }, [
          t("div", ss, [
            t("label", null, [
              o[43] || (o[43] = F("Name", -1)),
              W(t("input", {
                "onUpdate:modelValue": (T) => m.name = T,
                placeholder: "Parties"
              }, null, 8, os), [
                [_, m.name]
              ])
            ]),
            t("label", null, [
              o[44] || (o[44] = F("Chunks", -1)),
              W(t("input", {
                "onUpdate:modelValue": (T) => m.chunks = T,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, is), [
                [
                  _,
                  m.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          t("label", null, [
            o[45] || (o[45] = F("Query", -1)),
            W(t("textarea", {
              "onUpdate:modelValue": (T) => m.query = T,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, us), [
              [_, m.query]
            ])
          ]),
          e.readonly ? g("", !0) : (a(), s("button", {
            key: 0,
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo sm",
            onClick: (T) => l.value.prefetch.queries.splice(A, 1)
          }, "Remove query", 8, ds))
        ]))), 128)),
        l.value.prefetch.queries.length ? g("", !0) : (a(), s("p", rs, "No fixed queries. Field search hints still run.")),
        e.readonly ? g("", !0) : (a(), s("button", {
          key: 1,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          onClick: o[5] || (o[5] = (m) => l.value.prefetch.queries.push(b(Sl)()))
        }, "Add query"))
      ], 64)) : g("", !0),
      e.stage === "scout" ? (a(), s(M, { key: 2 }, [
        t("div", cs, [
          o[47] || (o[47] = t("span", null, "Stage enabled", -1)),
          f(Z, {
            modelValue: l.value.scout.enabled,
            "onUpdate:modelValue": o[6] || (o[6] = (m) => l.value.scout.enabled = m),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", vs, [
          o[48] || (o[48] = t("span", { id: "mode-label" }, "Mode", -1)),
          f(ye, {
            modelValue: l.value.scout.mode,
            "onUpdate:modelValue": o[7] || (o[7] = (m) => l.value.scout.mode = m),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          t("small", null, d(l.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        l.value.scout.mode === "agent" ? (a(), J(Cn, {
          key: 0,
          value: l.value.scout.agent_id,
          readonly: e.readonly,
          onSelect: v
        }, null, 8, ["value", "readonly"])) : g("", !0),
        l.value.scout.mode === "loop" ? (a(), J(In, {
          key: 1,
          rounds: l.value.scout.max_rounds,
          confidence: l.value.scout.target_confidence,
          extra: l.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"])) : g("", !0),
        o[53] || (o[53] = t("h4", null, "Models", -1)),
        t("div", ms, [
          o[49] || (o[49] = t("span", null, "Scout", -1)),
          f(ce, {
            value: l.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: o[8] || (o[8] = (m) => l.value.scout.model = m)
          }, null, 8, ["value"])
        ]),
        o[54] || (o[54] = t("h4", null, "Loop", -1)),
        f(te, {
          modelValue: l.value.scout.max_rounds,
          "onUpdate:modelValue": o[9] || (o[9] = (m) => l.value.scout.max_rounds = m),
          label: l.value.scout.mode === "agent" ? "Rounds" : "Follow-up rounds",
          min: u("max_rounds").min,
          max: u("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        l.value.scout.mode === "loop" ? (a(), J(te, {
          key: 2,
          modelValue: l.value.scout.target_confidence,
          "onUpdate:modelValue": o[10] || (o[10] = (m) => l.value.scout.target_confidence = m),
          label: "Stop at confidence",
          min: u("target_confidence").min,
          max: u("target_confidence").max,
          step: 0.05,
          percent: "",
          hints: ["Stop early", "Keep looking"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])) : g("", !0),
        f(te, {
          modelValue: l.value.scout.max_extra_queries,
          "onUpdate:modelValue": o[11] || (o[11] = (m) => l.value.scout.max_extra_queries = m),
          label: l.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: u("max_extra_queries").min,
          max: u("max_extra_queries").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        f(te, {
          modelValue: l.value.scout.max_tokens,
          "onUpdate:modelValue": o[12] || (o[12] = (m) => l.value.scout.max_tokens = m),
          label: "Scout output limit",
          min: u("max_tokens").min,
          max: u("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        l.value.scout.mode === "agent" ? (a(), s("p", ps, "Tool budget: " + d(l.value.scout.max_rounds * l.value.scout.max_extra_queries) + " calls.", 1)) : g("", !0),
        l.value.scout.mode === "loop" ? (a(), s("div", bs, [
          o[50] || (o[50] = t("span", null, [
            F("Drop noisy chunks"),
            t("small", null, "Chunks no field needs leave the evidence pool; chunks cited for a field always stay.")
          ], -1)),
          f(Z, {
            modelValue: l.value.scout.drop_noise,
            "onUpdate:modelValue": o[13] || (o[13] = (m) => l.value.scout.drop_noise = m),
            label: "Drop noisy chunks",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])) : g("", !0),
        t("div", fs, [
          o[51] || (o[51] = t("span", null, [
            F("Share scout notes with extraction"),
            t("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          f(Z, {
            modelValue: l.value.scout.share_notes,
            "onUpdate:modelValue": o[14] || (o[14] = (m) => l.value.scout.share_notes = m),
            label: "Share scout notes with extraction",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l.value.scout.mode === "agent" ? (a(), s(M, { key: 5 }, [
          o[52] || (o[52] = t("h4", null, "Agent tools", -1)),
          (a(!0), s(M, null, z(b(i), (m) => (a(), s("div", {
            key: m,
            class: "toggle-row"
          }, [
            t("span", null, d(b(at)(m)), 1),
            f(Z, {
              "model-value": l.value.scout.tools.includes(m),
              label: b(at)(m),
              disabled: e.readonly,
              "onUpdate:modelValue": (A) => w(m, A)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : g("", !0)
      ], 64)) : g("", !0),
      e.stage === "deep" ? (a(), s(M, { key: 3 }, [
        t("div", gs, [
          o[55] || (o[55] = t("span", null, "Stage enabled", -1)),
          f(Z, {
            modelValue: l.value.deep.enabled,
            "onUpdate:modelValue": o[15] || (o[15] = (m) => l.value.deep.enabled = m),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        f(Jn, {
          fields: p.value,
          parallel: l.value.deep.parallel_fields,
          queries: l.value.deep.max_queries,
          "per-query": l.value.deep.chunks_per_query,
          cap: l.value.deep.chunk_cap
        }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"]),
        t("div", hs, [
          o[56] || (o[56] = t("span", { id: "read-label" }, "Reads", -1)),
          f(ye, {
            modelValue: l.value.deep.read,
            "onUpdate:modelValue": o[16] || (o[16] = (m) => l.value.deep.read = m),
            "labelled-by": "read-label",
            options: [{ value: "chunks", label: "Retrieved chunks" }, { value: "sections", label: "Whole sections" }]
          }, null, 8, ["modelValue"]),
          o[57] || (o[57] = t("small", null, "Whole sections suit clauses that span many passages; long sections fall back to chunks.", -1))
        ]),
        o[60] || (o[60] = t("h4", null, "Models", -1)),
        t("div", ys, [
          o[58] || (o[58] = t("span", null, "Analysis", -1)),
          f(ce, {
            value: l.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: o[17] || (o[17] = (m) => l.value.deep.model = m)
          }, null, 8, ["value"])
        ]),
        t("div", ks, [
          o[59] || (o[59] = t("span", null, "Query writer", -1)),
          f(ce, {
            value: l.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: o[18] || (o[18] = (m) => l.value.deep.query_model = m)
          }, null, 8, ["value"])
        ]),
        o[61] || (o[61] = t("h4", null, "Reach", -1)),
        f(te, {
          modelValue: l.value.deep.parallel_fields,
          "onUpdate:modelValue": o[19] || (o[19] = (m) => l.value.deep.parallel_fields = m),
          label: "Fields at a time",
          min: u("parallel_fields").min,
          max: u("parallel_fields").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(te, {
          modelValue: l.value.deep.max_queries,
          "onUpdate:modelValue": o[20] || (o[20] = (m) => l.value.deep.max_queries = m),
          label: "Queries per field",
          min: u("max_queries").min,
          max: u("max_queries").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(te, {
          modelValue: l.value.deep.chunks_per_query,
          "onUpdate:modelValue": o[21] || (o[21] = (m) => l.value.deep.chunks_per_query = m),
          label: "Chunks per query",
          min: u("chunks_per_query").min,
          max: u("chunks_per_query").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(te, {
          modelValue: l.value.deep.chunk_cap,
          "onUpdate:modelValue": o[22] || (o[22] = (m) => l.value.deep.chunk_cap = m),
          label: "Chunk cap per field",
          min: u("chunk_cap").min,
          max: u("chunk_cap").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(te, {
          modelValue: l.value.deep.min_similarity,
          "onUpdate:modelValue": o[23] || (o[23] = (m) => l.value.deep.min_similarity = m),
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
        f(te, {
          modelValue: l.value.deep.query_temperature,
          "onUpdate:modelValue": o[24] || (o[24] = (m) => l.value.deep.query_temperature = m),
          label: "Query writing",
          min: u("query_temperature").min,
          max: u("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(te, {
          modelValue: l.value.deep.analysis_temperature,
          "onUpdate:modelValue": o[25] || (o[25] = (m) => l.value.deep.analysis_temperature = m),
          label: "Analysis",
          min: u("analysis_temperature").min,
          max: u("analysis_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : g("", !0),
      e.stage === "extract" ? (a(), s(M, { key: 4 }, [
        t("div", $s, [
          o[63] || (o[63] = t("span", { id: "extract-reads-label" }, "Read values from", -1)),
          f(ye, {
            modelValue: $.value,
            "onUpdate:modelValue": o[26] || (o[26] = (m) => $.value = m),
            "labelled-by": "extract-reads-label",
            name: "Read values from",
            options: [{ value: "text", label: "Text" }, { value: "pages", label: "Page images" }],
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        $.value === "pages" ? (a(), s(M, { key: 0 }, [
          o[64] || (o[64] = t("p", { class: "muted" }, "Extraction and visual support need models with vision. Text retrieval selects pages; section boundaries that share a page are unsupported.", -1)),
          f(te, {
            modelValue: C.value,
            "onUpdate:modelValue": o[27] || (o[27] = (m) => C.value = m),
            label: "Page images per call",
            min: u("max_pages").min,
            max: u("max_pages").max,
            disabled: e.readonly,
            note: "The context budget can admit fewer pages."
          }, null, 8, ["modelValue", "min", "max", "disabled"])
        ], 64)) : g("", !0),
        o[66] || (o[66] = t("h4", null, "Models", -1)),
        t("div", xs, [
          o[65] || (o[65] = t("span", null, "Extraction", -1)),
          f(ce, {
            value: l.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: o[28] || (o[28] = (m) => l.value.extract.model = m)
          }, null, 8, ["value"])
        ]),
        o[67] || (o[67] = t("h4", null, "Field groups", -1)),
        t("ul", ws, [
          (a(!0), s(M, null, z(r.value, (m) => (a(), s("li", {
            key: m.name
          }, [
            t("span", null, d(m.name), 1),
            t("span", Vs, d(m.fields.length) + " field" + d(m.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        r.value.length ? g("", !0) : (a(), s("p", Ss, "No fields yet.")),
        f(te, {
          modelValue: l.value.extract.max_fields_per_call,
          "onUpdate:modelValue": o[29] || (o[29] = (m) => l.value.extract.max_fields_per_call = m),
          label: "Fields per call",
          min: u("max_fields_per_call").min,
          max: u("max_fields_per_call").max,
          disabled: e.readonly,
          note: `${b(kt)(e.config)} extraction call${b(kt)(e.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        f(te, {
          modelValue: l.value.extract.max_output_tokens,
          "onUpdate:modelValue": o[30] || (o[30] = (m) => l.value.extract.max_output_tokens = m),
          label: "Output limit",
          min: u("max_output_tokens").min,
          max: u("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : g("", !0),
      e.stage === "verify" ? (a(), s(M, { key: 5 }, [
        t("div", Cs, [
          o[68] || (o[68] = t("span", null, "Stage enabled", -1)),
          f(Z, {
            modelValue: l.value.verify.enabled,
            "onUpdate:modelValue": o[31] || (o[31] = (m) => l.value.verify.enabled = m),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Es, [
          t("span", null, [
            o[69] || (o[69] = F("Quotes exist", -1)),
            t("small", null, d($.value === "pages" ? "Text agreement is informational; visual support determines verification." : "Each quote is matched against the document text. No model call."), 1)
          ]),
          f(Z, {
            modelValue: l.value.verify.check_quotes,
            "onUpdate:modelValue": o[32] || (o[32] = (m) => l.value.verify.check_quotes = m),
            label: "Quotes exist",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", qs, [
          t("span", null, [
            o[70] || (o[70] = F("Quotes support values", -1)),
            t("small", null, d($.value === "pages" ? "A vision model checks the quote and value against physical page images." : "A model confirms each quote supports its value."), 1)
          ]),
          f(Z, {
            "model-value": l.value.verify.check_support,
            "onUpdate:modelValue": S,
            label: "Quotes support values",
            disabled: e.readonly
          }, null, 8, ["model-value", "disabled"])
        ]),
        l.value.verify.check_support ? (a(), s(M, { key: 0 }, [
          t("div", Us, [
            o[71] || (o[71] = t("span", null, [
              F("Check completeness"),
              t("small", null, "Check the requested text and lists against additional source passages. Adds input tokens; completeness can remain unknown.")
            ], -1)),
            f(Z, {
              "model-value": l.value.verify.check_completeness === !0,
              "onUpdate:modelValue": o[33] || (o[33] = (m) => l.value.verify.check_completeness = m),
              label: "Check completeness",
              disabled: e.readonly
            }, null, 8, ["model-value", "disabled"])
          ]),
          o[73] || (o[73] = t("h4", null, "Models", -1)),
          t("div", Ns, [
            o[72] || (o[72] = t("span", null, "Checker", -1)),
            f(ce, {
              value: l.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: o[34] || (o[34] = (m) => l.value.verify.model = m)
            }, null, 8, ["value"])
          ])
        ], 64)) : g("", !0)
      ], 64)) : g("", !0)
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
    const n = e, l = N(() => Math.min(0.9, Math.max(0, n.overlap / n.size))), u = N(() => {
      const i = 100 / (3 - 2 * l.value);
      return [0, 1, 2].map((p) => ({ x: p * i * (1 - l.value), w: i }));
    });
    return (i, p) => (a(), s("figure", Ms, [
      (a(), s("svg", As, [
        (a(!0), s(M, null, z(u.value, (y, r) => (a(), s("rect", {
          key: r,
          x: y.x,
          y: r % 2 ? 14 : 4,
          width: y.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, Rs))), 128)),
        (a(), s(M, null, z([1, 2], (y) => t("rect", {
          key: "o" + y,
          x: u.value[y].x,
          y: 4,
          width: u.value[y - 1].x + u.value[y - 1].w - u.value[y].x,
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
    const n = e, l = N(() => n.config.retrieval), u = N({ get: () => n.config.retention ?? "", set: (S) => {
      S.trim() ? n.config.retention = S.trim() : delete n.config.retention;
    } }), i = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], p = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], y = et("chunk_size"), r = et("overlap"), $ = et("section_budget"), C = N(() => Math.min(r.max, l.value.chunk_size - 50));
    return (S, v) => (a(), s("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", Ps, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + d(e.retention) + ".", 1),
      t("label", null, [
        v[12] || (v[12] = F("Retention window", -1)),
        W(t("input", {
          "onUpdate:modelValue": v[0] || (v[0] = (w) => u.value = w),
          "aria-label": "Retention window",
          placeholder: "Global setting"
        }, null, 512), [
          [_, u.value]
        ]),
        v[13] || (v[13] = t("small", null, "Duration for new processed documents and runs, for example 24h. Leave empty to use the global Docscout setting. Existing records keep their expiry.", -1))
      ]),
      v[22] || (v[22] = t("h4", null, "Chunks", -1)),
      f(Bs, {
        size: l.value.chunk_size,
        overlap: l.value.overlap
      }, null, 8, ["size", "overlap"]),
      f(te, {
        modelValue: l.value.chunk_size,
        "onUpdate:modelValue": v[1] || (v[1] = (w) => l.value.chunk_size = w),
        label: "Chunk size",
        min: b(y).min,
        max: b(y).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      f(te, {
        modelValue: l.value.overlap,
        "onUpdate:modelValue": v[2] || (v[2] = (w) => l.value.overlap = w),
        label: "Overlap",
        min: b(r).min,
        max: C.value,
        step: 10,
        unit: "tokens",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      t("div", Ts, [
        v[14] || (v[14] = t("span", null, [
          F("Split by headings"),
          t("small", null, "A chunk never crosses a heading.")
        ], -1)),
        f(Z, {
          modelValue: l.value.split_headings,
          "onUpdate:modelValue": v[3] || (v[3] = (w) => l.value.split_headings = w),
          label: "Split by headings",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t("div", Ds, [
        v[15] || (v[15] = t("span", null, [
          F("Keep tables whole"),
          t("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        f(Z, {
          modelValue: l.value.keep_tables,
          "onUpdate:modelValue": v[4] || (v[4] = (w) => l.value.keep_tables = w),
          label: "Keep tables whole",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      f(te, {
        modelValue: l.value.section_budget,
        "onUpdate:modelValue": v[5] || (v[5] = (w) => l.value.section_budget = w),
        label: "Section budget",
        min: b($).min,
        max: b($).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      v[23] || (v[23] = t("h4", null, "Context", -1)),
      t("div", js, [
        v[16] || (v[16] = t("span", { id: "context-label" }, "Chunk context", -1)),
        f(ye, {
          modelValue: l.value.context,
          "onUpdate:modelValue": v[6] || (v[6] = (w) => l.value.context = w),
          "labelled-by": "context-label",
          options: p
        }, null, 8, ["modelValue"]),
        t("small", null, d(p.find((w) => w.value === l.value.context)?.note), 1)
      ]),
      l.value.context === "generated" ? (a(), s("div", Is, [
        v[17] || (v[17] = t("span", null, "Context writer", -1)),
        f(ce, {
          value: l.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: v[7] || (v[7] = (w) => l.value.context_model = w)
        }, null, 8, ["value"])
      ])) : g("", !0),
      v[24] || (v[24] = t("h4", null, "Search", -1)),
      t("div", zs, [
        v[18] || (v[18] = t("span", { id: "mode-label" }, "Search mode", -1)),
        f(ye, {
          modelValue: l.value.search_mode,
          "onUpdate:modelValue": v[8] || (v[8] = (w) => l.value.search_mode = w),
          "labelled-by": "mode-label",
          options: i
        }, null, 8, ["modelValue"]),
        t("small", null, d(i.find((w) => w.value === l.value.search_mode)?.note), 1)
      ]),
      v[25] || (v[25] = t("h4", null, "Models", -1)),
      t("div", Ws, [
        v[19] || (v[19] = t("span", null, "Embedding", -1)),
        f(ce, {
          value: l.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: v[9] || (v[9] = (w) => l.value.embedding_model = w)
        }, null, 8, ["value"])
      ]),
      t("div", Hs, [
        v[20] || (v[20] = t("span", null, [
          F("Highlighter"),
          t("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        f(Z, {
          modelValue: l.value.highlighter,
          "onUpdate:modelValue": v[10] || (v[10] = (w) => l.value.highlighter = w),
          label: "Highlighter",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      l.value.highlighter ? (a(), s("div", Gs, [
        v[21] || (v[21] = t("span", null, "Highlighter", -1)),
        f(ce, {
          value: l.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: v[11] || (v[11] = (w) => l.value.highlighter_model = w)
        }, null, 8, ["value"])
      ])) : g("", !0)
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
}, ro = {
  class: "shape-preview",
  open: ""
}, co = { class: "kx-focus-outline" }, vo = {
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
}, xo = { class: "node-icon" }, wo = { class: "node-main" }, Vo = { class: "node-summary" }, So = { class: "node-side" }, Co = { class: "chip model" }, Eo = { class: "branches" }, qo = { class: "branch" }, Uo = { class: "branch" }, No = { class: "node-icon" }, Fo = { class: "node-main" }, Mo = { class: "node-summary" }, Ao = ["aria-labelledby", "role", "aria-modal"], Ro = ["aria-valuenow"], Lo = { class: "side-panel-head" }, Bo = { class: "side-panel-icon" }, Oo = ["id"], Po = ["aria-label", "title"], To = { class: "node-breadcrumb mono" }, Do = {
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
    const n = e, l = Be(e, "title"), u = Be(e, "description"), i = R({ kind: "document" });
    function p(k, c) {
      try {
        const q = localStorage.getItem(`docscout.${k}`);
        return q === null ? c : q === "1";
      } catch {
        return c;
      }
    }
    function y(k, c) {
      try {
        localStorage.setItem(`docscout.${k}`, c ? "1" : "0");
      } catch {
      }
    }
    const r = R(p("panel", !0)), $ = R(p("fields", !0)), C = R(p("flow", !0));
    function S() {
      try {
        const k = Number(localStorage.getItem("docscout.panelWidth"));
        return k >= We ? k : tt;
      } catch {
        return tt;
      }
    }
    const v = R(S()), w = () => {
      const k = D.value?.clientWidth;
      return k ? Math.max(We, k - 420) : Number.POSITIVE_INFINITY;
    };
    function V(k, c = !0) {
      if (v.value = Math.round(Math.min(w(), Math.max(We, k))), c)
        try {
          localStorage.setItem("docscout.panelWidth", String(v.value));
        } catch {
        }
    }
    const o = R(!1);
    function m(k) {
      const c = k.currentTarget, q = k.clientX, Y = v.value;
      c.setPointerCapture(k.pointerId), o.value = !0;
      const X = (ee) => V(Y + (q - ee.clientX), !1), ae = () => {
        o.value = !1, V(v.value), c.removeEventListener("pointermove", X), c.removeEventListener("pointerup", ae);
      };
      c.addEventListener("pointermove", X), c.addEventListener("pointerup", ae);
    }
    function A(k) {
      k.key === "ArrowLeft" ? (V(v.value + 24), k.preventDefault()) : k.key === "ArrowRight" && (V(v.value - 24), k.preventDefault());
    }
    let T = null;
    const U = R(), B = pe();
    async function G(k) {
      if (r.value = k, !P.value) {
        y("panel", k);
        return;
      }
      if (!k && T) {
        const c = T;
        T = null, await Ce(), c.focus();
      }
    }
    function j(k) {
      const c = k === "fields" ? $ : C;
      c.value = !c.value, y(k, c.value);
    }
    const D = R(), P = R(!1);
    let ue;
    Ue(() => {
      ue = new ResizeObserver(([k]) => {
        const c = P.value;
        P.value = k.contentRect.width < 1e3, P.value && !c && (r.value = !1), !P.value && c && (r.value = p("panel", !0));
      }), D.value && ue.observe(D.value);
    }), Ct(() => ue?.disconnect());
    const ke = R();
    be(i, async () => {
      await Ce(), ke.value && (ke.value.scrollTop = 0);
    });
    async function le(k) {
      P.value && !r.value && (T = D.value?.getRootNode()?.activeElement), i.value = k, r.value = !0, P.value && (await Ce(), U.value?.focus());
    }
    const oe = (k) => JSON.stringify(k) === JSON.stringify(i.value), fe = N(() => i.value.kind === "field" ? n.config.fields[i.value.index] : void 0), E = N(() => Je(n.config.fields)), h = N(() => i.value.kind === "field" ? E.value.find((k) => k.key === ie(i.value.index, i.value.trail ?? [])) : void 0), x = N(() => h.value?.key ?? ""), O = N(() => {
      const k = h.value;
      return !k || k.trail.at(-1) === "item" || !k.trail.length ? void 0 : E.value.find((q) => q.key === ie(k.field, k.trail.slice(0, -1))).shape.properties.filter((q) => q !== k.shape).map((q) => q.name);
    }), I = R("");
    be(x, () => {
      I.value = "";
    });
    const Ne = N(() => h.value ? Xl(n.config.fields, h.value) : []), ge = N(() => {
      const k = El(n.config.fields.map(K));
      return k ? `Group path collides with field ${k}.` : "";
    }), Te = N(() => ge.value ? null : St(n.config.fields)), Tt = N(() => ge.value ? null : St(n.config.fields, !0)), dt = N(() => {
      const k = i.value;
      return k.kind === "stage" ? $e[k.stage] : k.kind === "field" ? h.value?.trail.length ? h.value.path : fe.value?.name || "New field" : k.kind === "document" ? "Read document" : k.kind === "output" ? "Output" : "Details";
    }), Dt = N(() => {
      const k = i.value;
      return k.kind === "stage" ? ut[k.stage] : k.kind === "field" ? "tabler:forms" : k.kind === "document" ? "tabler:file-text" : k.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), jt = N(() => n.config.fields.filter((k, c) => !(i.value.kind === "field" && i.value.index === c)).map(K)), It = N(() => n.config.stages.deep.enabled), zt = N(() => n.config.stages.map.enabled), Wt = N(() => Oe(n.config.fields.map(K))), De = R(!1), rt = R(), ct = pe();
    function Ht(k, c) {
      for (const q of n.config.fields) (q.group === k || q.group.startsWith(k + ".")) && (q.group = c + q.group.slice(k.length));
    }
    const Gt = (k) => 320 - Math.max(0, ...n.config.fields.filter((c) => c.group === k || c.group.startsWith(k + ".")).map((c) => c.group.length - k.length));
    function Kt() {
      $.value = !0, De.value = !0;
    }
    async function vt() {
      De.value = !1, await Ce(), rt.value.focus();
    }
    function Qt(k) {
      n.config.fields.push({ ...nt(), group: k }), vt();
    }
    const Jt = N(() => [...new Set(n.config.fields.map((k) => k.group.trim()).filter(Boolean))]), Yt = (k) => Ft(n.config.fields[k], n.config.fields.filter((c, q) => q !== k).map(K)), mt = ["map", "prefetch", "scout", "deep", "extract", "verify"], Xt = N(() => mt.filter((k) => Qe(n.config, k)).map((k) => $e[k]).join(" · ")), Zt = N(() => n.config.fields.map((k) => k.name || "New field").join(", ")), _t = N(() => mt.filter((k) => Qe(n.config, k)).length), xe = (k) => n.result?.trace.find((c) => c.kind === k);
    function pt(k = "") {
      n.config.fields.push({ ...nt(), group: k }), $.value = !0, le({ kind: "field", index: n.config.fields.length - 1 });
    }
    function el(k) {
      n.config.fields.splice(k, 1), i.value = { kind: "document" };
    }
    function re(k, c = []) {
      le({ kind: "field", index: k, ...c.length ? { trail: c } : {} });
    }
    function bt(k, c) {
      const q = E.value.find((Y) => Y.key === ie(k, c));
      q.shape.properties.push(Nt()), re(k, [...c, q.shape.properties.length - 1]);
    }
    function tl() {
      const k = h.value;
      if (!k.trail.length) {
        el(k.field);
        return;
      }
      const c = E.value.find((q) => q.key === ie(k.field, k.trail.slice(0, -1)));
      c.shape.properties.splice(k.trail.at(-1), 1), re(c.field, c.trail);
    }
    function ll(k, c, q) {
      if (c.length) {
        const X = E.value.find((ne) => ne.key === ie(k, c.slice(0, -1))).shape.properties, ae = c.at(-1), ee = ae + q;
        if (ee < 0 || ee >= X.length) return;
        [X[ae], X[ee]] = [X[ee], X[ae]], re(k, [...c.slice(0, -1), ee]);
      } else {
        const Y = n.config.fields.map((ee, ne) => ee.group === n.config.fields[k].group ? ne : -1).filter((ee) => ee >= 0), X = Y[Y.indexOf(k) + q];
        if (X === void 0) return;
        const ae = n.config.fields;
        [ae[k], ae[X]] = [ae[X], ae[k]], re(X);
      }
    }
    function al() {
      const k = h.value, c = Ne.value.find((Y) => Y.key === I.value), q = Zl(n.config.fields, k, c);
      re(q.field, q.trail);
    }
    function nl(k) {
      const c = h.value?.shape;
      n.config.fields.splice(0, n.config.fields.length, ...n.config.fields.filter((Y) => Y.group !== k && !Y.group.startsWith(k + ".")));
      const q = E.value.find((Y) => Y.shape === c);
      q ? re(q.field, q.trail) : i.value = { kind: "document" };
    }
    function sl(k, c) {
      const q = k.split(".").slice(0, -1).join(".");
      let X = Oe(n.config.fields.map(K));
      for (const se of q.split(".").filter(Boolean)) X = X.children.find((dl) => dl.name === se);
      const ae = X.children.findIndex((se) => se.path === k), ee = X.children[ae + c]?.path;
      if (!ee) return;
      const ne = n.config.fields.filter((se) => se.group === k || se.group.startsWith(k + ".")), je = n.config.fields.filter((se) => se.group === ee || se.group.startsWith(ee + ".")), Fe = n.config.fields, il = Math.min(Fe.indexOf(ne[0]), Fe.indexOf(je[0])), gt = Fe.filter((se) => !ne.includes(se) && !je.includes(se));
      gt.splice(il, 0, ...c > 0 ? [...je, ...ne] : [...ne, ...je]);
      const ul = h.value?.shape;
      Fe.splice(0, Fe.length, ...gt);
      const _e = E.value.find((se) => se.shape === ul);
      _e && re(_e.field, _e.trail);
    }
    const ol = (k) => k.type === "list" ? `list of ${k.item?.type}` : k.type, ft = N({ get: () => n.config.tags.join(", "), set: (k) => {
      n.config.tags = [...new Set(k.split(",").map((c) => c.trim()).filter(Boolean))];
    } });
    return (k, c) => (a(), s("div", {
      ref_key: "root",
      ref: D,
      class: Q(["builder", { narrow: P.value, "panel-open": r.value, resizing: o.value }])
    }, [
      t("div", {
        class: "canvas",
        inert: P.value && r.value
      }, [
        t("div", Js, [
          t("section", Ys, [
            t("header", Xs, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": $.value,
                "aria-controls": "fields-body",
                onClick: c[0] || (c[0] = (q) => j("fields"))
              }, [
                f(b(L), {
                  icon: $.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                c[23] || (c[23] = t("h2", { id: "fields-head" }, "Fields", -1)),
                t("span", _s, d(e.config.fields.length), 1)
              ], 8, Zs),
              !$.value && e.config.fields.length ? (a(), s("span", eo, d(Zt.value), 1)) : g("", !0),
              e.readonly ? g("", !0) : (a(), s("div", to, [
                t("button", {
                  ref_key: "addGroupButton",
                  ref: rt,
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  "aria-label": "Add group",
                  "aria-expanded": De.value,
                  "aria-controls": b(ct),
                  disabled: e.config.fields.length >= 100,
                  onClick: Kt
                }, [
                  f(b(L), { icon: "tabler:folder-plus" }),
                  c[24] || (c[24] = F("Add group", -1))
                ], 8, lo),
                t("button", {
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  disabled: e.config.fields.length >= 100,
                  onClick: c[1] || (c[1] = (q) => pt())
                }, [
                  f(b(L), { icon: "tabler:plus" }),
                  c[25] || (c[25] = F("Add field", -1))
                ], 8, ao)
              ]))
            ]),
            W(t("div", no, [
              e.config.fields.length ? g("", !0) : (a(), s("p", so, "Add the values to pull from each document.")),
              t("div", oo, [
                De.value && !e.readonly ? (a(), s("div", {
                  key: 0,
                  id: b(ct),
                  class: "group-create-row"
                }, [
                  t("span", uo, [
                    f(b(L), { icon: "tabler:folder-plus" })
                  ]),
                  f(Rt, {
                    "input-label": "New group path",
                    "save-label": "Create group",
                    "cancel-label": "Cancel group creation",
                    onSave: Qt,
                    onCancel: vt
                  })
                ], 8, io)) : g("", !0),
                f(Re, { node: Wt.value }, {
                  header: me(({ path: q, label: Y, count: X, first: ae, last: ee }) => [
                    f(Ya, {
                      path: q,
                      name: Y,
                      count: X,
                      first: ae,
                      last: ee,
                      "max-length": Gt(q),
                      "can-add": e.config.fields.length < 100,
                      readonly: e.readonly,
                      onRename: (ne) => Ht(q, ne),
                      onAdd: (ne) => pt(q),
                      onReorder: (ne) => sl(q, ne),
                      onRemove: (ne) => nl(q)
                    }, null, 8, ["path", "name", "count", "first", "last", "max-length", "can-add", "readonly", "onRename", "onAdd", "onReorder", "onRemove"])
                  ]),
                  default: me(({ index: q }) => [
                    f(kn, {
                      shape: e.config.fields[q],
                      field: q,
                      trail: [],
                      path: b(K)(e.config.fields[q]) || "New field",
                      selected: x.value,
                      readonly: e.readonly,
                      error: Yt(q),
                      first: !e.config.fields.slice(0, q).some((Y) => Y.group === e.config.fields[q].group),
                      last: !e.config.fields.slice(q + 1).some((Y) => Y.group === e.config.fields[q].group),
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
                  f(b(L), { icon: "tabler:braces" }),
                  c[26] || (c[26] = F("Output preview", -1))
                ]),
                ge.value ? (a(), s("p", vo, d(ge.value), 1)) : (a(), s("div", mo, [
                  t("div", null, [
                    c[27] || (c[27] = t("h3", null, "Output shape", -1)),
                    t("pre", po, d(JSON.stringify(Te.value, null, 2)), 1)
                  ]),
                  t("div", null, [
                    c[28] || (c[28] = t("h3", null, "Example value", -1)),
                    t("pre", bo, d(JSON.stringify(Tt.value, null, 2)), 1)
                  ])
                ])),
                c[29] || (c[29] = t("small", null, "Example values illustrate the shape; extracted values come from your document.", -1))
              ])
            ], 512), [
              [Ke, $.value]
            ])
          ]),
          t("section", fo, [
            t("header", go, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": C.value,
                "aria-controls": "flow-body",
                onClick: c[2] || (c[2] = (q) => j("flow"))
              }, [
                f(b(L), {
                  icon: C.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                c[30] || (c[30] = t("h2", { id: "flow-head" }, "Flow", -1)),
                t("span", yo, d(_t.value) + " of 6", 1)
              ], 8, ho),
              C.value ? g("", !0) : (a(), s("span", ko, d(Xt.value), 1)),
              t("button", {
                type: "button",
                class: Q(["kx-btn kx-btn-ghost kx-focus-halo sm push", { on: oe({ kind: "details" }) }]),
                onClick: c[3] || (c[3] = (q) => le({ kind: "details" }))
              }, [
                f(b(L), { icon: "tabler:info-circle" }),
                c[31] || (c[31] = F("Details", -1))
              ], 2)
            ]),
            W(t("div", $o, [
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "document" }) }]),
                onClick: c[4] || (c[4] = (q) => le({ kind: "document" }))
              }, [
                t("span", xo, [
                  f(b(L), { icon: "tabler:file-text" })
                ]),
                t("span", wo, [
                  c[32] || (c[32] = t("span", { class: "node-title" }, "Read document", -1)),
                  t("span", Vo, d(b(ql)(e.config.retrieval)), 1)
                ]),
                t("span", So, [
                  t("span", Co, d(b(qt)(e.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              c[37] || (c[37] = t("div", { class: "connector" }, null, -1)),
              f(we, {
                stage: "map",
                config: e.config,
                active: oe({ kind: "stage", stage: "map" }),
                trace: xe("map"),
                readonly: e.readonly,
                onSelect: c[5] || (c[5] = (q) => le({ kind: "stage", stage: "map" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              c[38] || (c[38] = t("div", {
                class: "fork",
                "aria-hidden": "true"
              }, [
                t("span")
              ], -1)),
              t("div", Eo, [
                t("div", qo, [
                  c[33] || (c[33] = t("span", { class: "branch-label" }, "Evidence", -1)),
                  f(we, {
                    stage: "prefetch",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "prefetch" }),
                    trace: xe("prefetch"),
                    readonly: e.readonly,
                    onSelect: c[6] || (c[6] = (q) => le({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  c[34] || (c[34] = t("div", { class: "connector" }, null, -1)),
                  f(we, {
                    stage: "scout",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "scout" }),
                    trace: xe("scout"),
                    readonly: e.readonly,
                    onSelect: c[7] || (c[7] = (q) => le({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                t("div", Uo, [
                  c[35] || (c[35] = t("span", { class: "branch-label" }, "Deep fields", -1)),
                  f(we, {
                    stage: "deep",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "deep" }),
                    trace: xe("deep"),
                    readonly: e.readonly,
                    onSelect: c[8] || (c[8] = (q) => le({ kind: "stage", stage: "deep" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ])
              ]),
              c[39] || (c[39] = t("div", {
                class: "join",
                "aria-hidden": "true"
              }, [
                t("span")
              ], -1)),
              f(we, {
                stage: "extract",
                config: e.config,
                active: oe({ kind: "stage", stage: "extract" }),
                trace: xe("extract"),
                readonly: e.readonly,
                onSelect: c[9] || (c[9] = (q) => le({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              c[40] || (c[40] = t("div", { class: "connector" }, null, -1)),
              f(we, {
                stage: "verify",
                config: e.config,
                active: oe({ kind: "stage", stage: "verify" }),
                trace: xe("verify"),
                readonly: e.readonly,
                onSelect: c[10] || (c[10] = (q) => le({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              c[41] || (c[41] = t("div", { class: "connector" }, null, -1)),
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "output" }) }]),
                onClick: c[11] || (c[11] = (q) => le({ kind: "output" }))
              }, [
                t("span", No, [
                  f(b(L), { icon: "tabler:braces" })
                ]),
                t("span", Fo, [
                  c[36] || (c[36] = t("span", { class: "node-title" }, "Output", -1)),
                  t("span", Mo, d(e.config.fields.length ? `${e.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [Ke, C.value]
            ])
          ])
        ])
      ], 8, Qs),
      P.value && r.value ? (a(), s("div", {
        key: 0,
        class: "scrim",
        onClick: c[12] || (c[12] = (q) => G(!1))
      })) : g("", !0),
      r.value ? W((a(), s("aside", {
        key: String(P.value),
        class: "side-panel",
        "aria-labelledby": b(B),
        role: P.value ? "dialog" : void 0,
        "aria-modal": P.value ? "true" : void 0,
        style: qe(P.value ? void 0 : { width: `${v.value}px` }),
        onKeydown: c[21] || (c[21] = Ee((q) => P.value && G(!1), ["esc"]))
      }, [
        P.value ? g("", !0) : (a(), s("div", {
          key: 0,
          class: Q(["resizer kx-focus-outline", { active: o.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": v.value,
          "aria-valuemin": We,
          onPointerdown: ve(m, ["prevent"]),
          onKeydown: A,
          onDblclick: c[13] || (c[13] = (q) => V(tt))
        }, null, 42, Ro)),
        t("header", Lo, [
          t("span", Bo, [
            f(b(L), { icon: Dt.value }, null, 8, ["icon"])
          ]),
          t("h2", { id: b(B) }, d(dt.value), 9, Oo),
          t("button", {
            ref_key: "closeButton",
            ref: U,
            type: "button",
            class: "kx-iconbtn kx-focus-outline push",
            "aria-label": P.value ? "Close panel" : "Collapse panel",
            title: P.value ? "Close panel" : "Collapse panel",
            onClick: c[14] || (c[14] = (q) => G(!1))
          }, [
            f(b(L), {
              icon: P.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
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
          }, null, 8, ["config", "retention", "readonly"])) : i.value.kind === "stage" ? (a(), J(Fs, {
            key: 1,
            stage: i.value.stage,
            config: e.config,
            readonly: e.readonly
          }, null, 8, ["stage", "config", "readonly"])) : i.value.kind === "field" && fe.value && h.value ? (a(), s(M, { key: 2 }, [
            t("p", To, d(h.value.path), 1),
            f(Fa, {
              field: fe.value,
              shape: h.value.shape,
              depth: h.value.depth,
              "sibling-names": O.value,
              "other-names": jt.value,
              groups: Jt.value,
              "deep-enabled": It.value,
              "map-enabled": zt.value,
              readonly: e.readonly,
              onRemove: tl,
              onAdd: c[15] || (c[15] = (q) => bt(h.value.field, h.value.trail)),
              onSelectItem: c[16] || (c[16] = (q) => re(h.value.field, [...h.value.trail, "item"]))
            }, null, 8, ["field", "shape", "depth", "sibling-names", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"]),
            !e.readonly && h.value.trail.at(-1) !== "item" ? (a(), s("fieldset", Do, [
              t("label", null, [
                c[42] || (c[42] = F("Move to parent", -1)),
                W(t("select", {
                  "onUpdate:modelValue": c[17] || (c[17] = (q) => I.value = q),
                  "aria-label": "Move to parent"
                }, [
                  h.value.trail.length ? (a(), s("option", jo, "Top-level field")) : (a(), s("option", Io, "Choose an object…")),
                  (a(!0), s(M, null, z(Ne.value, (q) => (a(), s("option", {
                    key: q.key,
                    value: q.key
                  }, d(q.path), 9, zo))), 128))
                ], 512), [
                  [Ge, I.value]
                ])
              ]),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Move selected node",
                disabled: !I.value && !h.value.trail.length || !I.value && e.config.fields.length >= 100,
                onClick: al
              }, "Move", 8, Wo)
            ])) : g("", !0)
          ], 64)) : i.value.kind === "details" ? (a(), s("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: e.readonly
          }, [
            t("label", null, [
              c[43] || (c[43] = F("Name", -1)),
              W(t("input", {
                "onUpdate:modelValue": c[18] || (c[18] = (q) => l.value = q),
                "aria-label": "Extractor name"
              }, null, 512), [
                [_, l.value]
              ])
            ]),
            t("label", null, [
              c[44] || (c[44] = F("Description", -1)),
              W(t("textarea", {
                "onUpdate:modelValue": c[19] || (c[19] = (q) => u.value = q),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [_, u.value]
              ])
            ]),
            t("label", null, [
              c[45] || (c[45] = F("Tags", -1)),
              W(t("input", {
                "onUpdate:modelValue": c[20] || (c[20] = (q) => ft.value = q),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  _,
                  ft.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              c[46] || (c[46] = t("small", null, "Comma separated", -1))
            ])
          ], 8, Ho)) : i.value.kind === "output" ? (a(), s("div", Go, [
            c[47] || (c[47] = t("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            t("ul", Ko, [
              (a(!0), s(M, null, z(e.config.fields, (q) => (a(), s("li", {
                key: b(K)(q)
              }, [
                t("span", Qo, d(b(K)(q) || "New field"), 1),
                t("span", Jo, d(ol(q)), 1)
              ]))), 128))
            ]),
            c[48] || (c[48] = t("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : g("", !0)
        ], 512)
      ], 44, Ao)), [
        [b(Ol), { disabled: !P.value }]
      ]) : P.value ? g("", !0) : (a(), s("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: c[22] || (c[22] = (q) => G(!0))
      }, [
        f(b(L), { icon: "tabler:layout-sidebar-right-expand" }),
        t("span", Yo, d(dt.value), 1)
      ]))
    ], 2));
  }
}), Zo = ["selected"], _o = {
  key: 1,
  role: "alert"
}, ei = {
  key: 2,
  class: "muted"
}, Lt = /* @__PURE__ */ H({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(e, { emit: n }) {
    const l = n, u = R(!1), i = R("");
    Ue(async () => {
      try {
        await Ze("wc-multiselect", { timeoutMs: 8e3 }), u.value = !0;
      } catch (y) {
        i.value = String(y);
      }
    });
    function p(y) {
      const r = y.detail;
      l("select", r.selected[0] || "", r.labels?.[0] || "");
    }
    return (y, r) => u.value ? (a(), s("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(e.value ? [e.value] : []),
      placeholder: "Choose an upload",
      onChange: p
    }, null, 40, Zo)) : i.value ? (a(), s("p", _o, d(i.value), 1)) : (a(), s("span", ei, "Loading uploads…"));
  }
}), He = (e) => e.status === "completed" || e.status === "partial" || e.status === "failed", Se = (e) => e.metrics.length ? e.metrics.reduce((n, l) => n + l.accuracy, 0) / e.metrics.length : 0, Bt = (e) => `Visual · ${e.status}`, ti = ["data-error-kind", "data-error-code"], li = { key: 0 }, Ot = /* @__PURE__ */ H({
  __name: "FieldFailure",
  props: {
    error: {}
  },
  setup(e) {
    const n = e, l = N(() => {
      const i = n.error?.details;
      return i && typeof i == "object" && "code" in i && typeof i.code == "string" ? i.code : void 0;
    }), u = N(() => l.value === "context_budget_exceeded");
    return (i, p) => (a(), s("div", {
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
      e.error?.details ? (a(), s("details", li, [
        p[0] || (p[0] = t("summary", { class: "kx-focus-outline" }, "Error details", -1)),
        t("pre", null, d(JSON.stringify(e.error.details, null, 2)), 1)
      ])) : g("", !0)
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
    const n = e, l = N(() => n.value !== null && typeof n.value == "object" && !Array.isArray(n.value) ? n.value : null), u = N(() => [.../* @__PURE__ */ new Set([...Object.keys(n.schema?.properties ?? {}), ...Object.keys(l.value ?? {})])]), i = N(() => Array.isArray(n.schema?.type) && n.schema.type.includes("null") ? "Missing" : "—");
    return (p, y) => {
      const r = it("NestedValue", !0);
      return a(), s("div", ai, [
        Array.isArray(e.value) ? (a(), s("ol", ni, [
          (a(!0), s(M, null, z(e.value, ($, C) => (a(), s("li", { key: C }, [
            f(r, {
              value: $,
              schema: e.schema?.items
            }, null, 8, ["value", "schema"])
          ]))), 128)),
          e.value.length ? g("", !0) : (a(), s("li", si, "Empty list"))
        ])) : l.value ? (a(), s("dl", oi, [
          (a(!0), s(M, null, z(u.value, ($) => (a(), s(M, { key: $ }, [
            t("dt", null, d($), 1),
            t("dd", null, [
              f(r, {
                value: b(st)(l.value, $),
                schema: e.schema?.properties?.[$]
              }, null, 8, ["value", "schema"])
            ])
          ], 64))), 128))
        ])) : (a(), s("span", ii, d(e.value === null || e.value === void 0 ? i.value : String(e.value)), 1))
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
    const n = e, l = N(() => Oe(n.fields.map((S) => S.path))), u = R(), i = (S) => `${Math.round(S * 100)}%`, p = (S) => S !== null && typeof S == "object", y = (S) => Array.isArray(S) ? `${S.length} items` : p(S) ? `${Object.keys(S).length} properties` : S == null ? "—" : String(S), r = (S) => S >= 0.9 ? "high" : S >= 0.7 ? "mid" : "low", $ = (S) => S.codes?.includes("missing_in_sections") ? "Not in the selected sections" + (n.pageRange ? " of the searched pages" : "") : "Not in the document", C = (S) => {
      const v = S.error?.details;
      return !!v && typeof v == "object" && "code" in v && v.code === "context_budget_exceeded";
    };
    return (S, v) => (a(), s("div", ui, [
      f(Re, { node: l.value }, {
        default: me(({ index: w }) => [
          (a(!0), s(M, null, z([e.fields[w]], (V) => (a(), s("div", {
            key: V.path,
            class: "value-row"
          }, [
            t("button", {
              type: "button",
              class: "value-main",
              "aria-expanded": u.value === V.path,
              onClick: (o) => u.value = u.value === V.path ? void 0 : V.path
            }, [
              t("span", ri, d(V.name), 1),
              t("span", {
                class: Q(["value-text", { missing: V.missing }])
              }, d(V.failed ? C(V) ? "Context budget exceeded" : "Failed" : V.missing ? $(V) : y(V.value)), 3),
              V.failed ? g("", !0) : (a(), s("span", {
                key: 0,
                class: Q(["confidence", r(V.confidence)])
              }, [
                t("span", ci, [
                  t("span", {
                    style: qe({ width: i(V.confidence) })
                  }, null, 4)
                ]),
                F(d(i(V.confidence)), 1),
                v[0] || (v[0] = t("span", { class: "conf-word" }, " confidence", -1))
              ], 2)),
              V.failed ? g("", !0) : (a(), s("span", vi, [
                t("span", {
                  class: Q(["chip", V.verified ? "primary" : "warn"]),
                  title: V.reason
                }, [
                  f(b(L), {
                    icon: V.verified ? "tabler:shield-check" : "tabler:shield-question"
                  }, null, 8, ["icon"]),
                  F(d(V.verified ? "Verified" : "Check"), 1)
                ], 10, mi),
                V.verification ? (a(), s("span", pi, d(b(Bt)(V.verification)), 1)) : g("", !0),
                V.codes?.includes("context_budget_partial") ? (a(), s("span", bi, "Partial context")) : g("", !0),
                V.missing ? g("", !0) : (a(), s("span", fi, d(V.complete === !0 ? "Complete" : V.complete === !1 ? "Incomplete" : "Completeness unknown"), 1))
              ])),
              f(b(L), {
                icon: u.value === V.path ? "tabler:chevron-up" : "tabler:chevron-down",
                class: "value-caret"
              }, null, 8, ["icon"])
            ], 8, di),
            !V.failed && !V.missing && p(V.value) ? (a(), J(Le, {
              key: 0,
              class: "structured-value",
              value: V.value,
              schema: V.value_schema
            }, null, 8, ["value", "schema"])) : g("", !0),
            V.failed ? (a(), J(Ot, {
              key: 1,
              error: V.error
            }, null, 8, ["error"])) : g("", !0),
            W(t("div", gi, [
              !V.failed && !V.missing && !p(V.value) ? (a(), J(Le, {
                key: 0,
                value: V.value,
                schema: V.value_schema
              }, null, 8, ["value", "schema"])) : g("", !0),
              (a(!0), s(M, null, z(V.evidence, (o, m) => (a(), s("blockquote", {
                key: m,
                class: Q({ unfound: o.found === !1 })
              }, [
                t("p", null, "“" + d(o.quote) + "”", 1),
                t("cite", null, [
                  F(d(o.section), 1),
                  o.page !== void 0 && o.page !== null ? (a(), s(M, { key: 0 }, [
                    F(" · Page " + d(o.page), 1)
                  ], 64)) : g("", !0),
                  o.found === !1 ? (a(), s(M, { key: 1 }, [
                    F(" · not found word for word in the document")
                  ], 64)) : g("", !0)
                ])
              ], 2))), 128)),
              V.evidence.length ? g("", !0) : (a(), s("p", hi, "No evidence.")),
              V.reason || !V.verified && !V.failed ? (a(), s("p", yi, d(V.reason || "No reason recorded"), 1)) : g("", !0)
            ], 512), [
              [Ke, u.value === V.path && !V.failed]
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
}, qi = { class: "block" }, Ui = { class: "block-head" }, Ni = { class: "muted push" }, Fi = { class: "block" }, Mi = { class: "timeline" }, Ai = { class: "tl-icon" }, Ri = { class: "tl-main" }, Li = { class: "tl-head" }, Bi = { class: "muted push" }, Oi = { class: "tl-bar" }, Pi = { class: "muted" }, Ti = {
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
  setup(e, { emit: n }) {
    const l = e, u = n, i = R(""), p = (S) => `${(S / 1e3).toFixed(1)}s`, y = N(() => Math.max(1, ...l.result?.trace.map((S) => S.duration_ms) ?? [1])), r = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, $ = (S) => r[S]?.label ?? $e[S] ?? S, C = (S) => r[S]?.icon ?? ut[S] ?? "tabler:point";
    return (S, v) => (a(), s("div", ki, [
      t("section", $i, [
        t("div", xi, [
          f(Lt, {
            value: i.value,
            onSelect: v[0] || (v[0] = (w) => i.value = w)
          }, null, 8, ["value"])
        ]),
        f(b(de), {
          label: e.running ? "Extracting…" : "Run extraction",
          loading: e.running,
          disabled: !i.value || e.running || !e.canRun,
          onClick: v[1] || (v[1] = (w) => u("run", i.value))
        }, null, 8, ["label", "loading", "disabled"]),
        t("p", wi, d(e.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + d(e.retention) + ".", 1)
      ]),
      e.result ? g("", !0) : (a(), s("p", Vi, "No extraction results yet.")),
      e.result?.status === "failed" ? (a(), s("p", Si, [
        f(b(L), { icon: "tabler:alert-triangle" }),
        F("The run stopped: " + d(e.result.error), 1)
      ])) : g("", !0),
      e.result?.status === "partial" ? (a(), s("p", Ci, [
        f(b(L), { icon: "tabler:alert-triangle" }),
        v[2] || (v[2] = F("Partial result · Some fields failed. Successful values are available below.", -1))
      ])) : g("", !0),
      e.result ? (a(), s("div", Ei, [
        t("section", qi, [
          t("header", Ui, [
            v[3] || (v[3] = t("h2", { class: "block-title" }, "Values", -1)),
            t("span", Ni, [
              F(d(e.result.tokens.toLocaleString()) + " tokens · " + d(p(e.result.duration_ms)), 1),
              e.result.page_range ? (a(), s(M, { key: 0 }, [
                F(" · Pages " + d(e.result.page_range.first) + "–" + d(e.result.page_range.last), 1)
              ], 64)) : e.result.pages ? (a(), s(M, { key: 1 }, [
                F(" · " + d(e.result.pages) + " pages", 1)
              ], 64)) : g("", !0)
            ])
          ]),
          f(Pt, {
            fields: e.result.fields,
            "page-range": e.result.page_range
          }, null, 8, ["fields", "page-range"])
        ]),
        t("section", Fi, [
          v[4] || (v[4] = t("header", { class: "block-head" }, [
            t("h2", { class: "block-title" }, "Steps")
          ], -1)),
          t("ol", Mi, [
            (a(!0), s(M, null, z(e.result.trace, (w, V) => (a(), s("li", {
              key: V,
              class: Q(w.status)
            }, [
              t("span", Ai, [
                f(b(L), {
                  icon: C(w.kind)
                }, null, 8, ["icon"])
              ]),
              t("div", Ri, [
                t("div", Li, [
                  t("strong", null, d($(w.kind)), 1),
                  t("span", Bi, d(p(w.duration_ms)), 1)
                ]),
                t("span", Oi, [
                  t("span", {
                    style: qe({ width: `${Math.max(4, w.duration_ms / y.value * 100)}%` })
                  }, null, 4)
                ]),
                t("p", Pi, [
                  F(d(w.scope), 1),
                  w.pages ? (a(), s(M, { key: 0 }, [
                    F(" · Pages " + d(w.pages.first) + "–" + d(w.pages.last), 1)
                  ], 64)) : g("", !0),
                  w.model ? (a(), s(M, { key: 1 }, [
                    F(" · " + d(w.model), 1)
                  ], 64)) : g("", !0),
                  F(" · " + d((w.input_tokens + w.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                w.message ? (a(), s("p", Ti, d(w.message), 1)) : g("", !0),
                w.queries?.length ? (a(), s("div", Di, [
                  (a(!0), s(M, null, z(w.queries, (o) => (a(), s("span", {
                    key: o,
                    class: "chip"
                  }, d(o), 1))), 128))
                ])) : g("", !0)
              ])
            ], 2))), 128))
          ])
        ])
      ])) : g("", !0)
    ]));
  }
});
function Ye(e, n = /* @__PURE__ */ new Date()) {
  const l = new Date(e);
  return l.toDateString() === n.toDateString() ? l.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" }) : l.getFullYear() === n.getFullYear() ? l.toLocaleString(void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : l.toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
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
}, Nu = ["colspan"], Fu = {
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
  setup(e, { emit: n }) {
    const l = e, u = n, i = R(!1), p = R(""), y = R({}), r = R("");
    be(() => l.addedCaseId, () => {
      i.value = !1, p.value = "", y.value = {};
    });
    function $(E, h) {
      return E.type === "number" ? Number(h) : E.type === "boolean" ? h === "true" : E.type === "list" || E.type === "object" ? JSON.parse(h) : h;
    }
    function C() {
      r.value = "";
      const E = {};
      try {
        for (const h of l.fields) {
          const x = String(y.value[K(h)] ?? "").trim();
          x && Ut(E, K(h), $(h, x));
        }
      } catch {
        r.value = 'Lists and objects need valid JSON, for example ["a","b"] or {"city":"Hamburg"}.';
        return;
      }
      u("add-case", { upload_id: p.value, expected: E });
    }
    const S = N(() => l.evaluations.find((E) => !He(E))), v = N(() => l.evaluations.filter(He)), w = N(() => l.evaluation), V = N(() => ({ done: (w.value?.results ?? []).filter((h) => h.status !== "queued").length, total: w.value?.case_count ?? 0 })), o = R();
    be(() => w.value?.id, () => {
      o.value = void 0;
    });
    const m = N(() => {
      if (!w.value) return;
      if (o.value) return v.value.find((h) => h.id === o.value);
      const E = v.value.findIndex((h) => h.id === w.value.id);
      return E >= 0 ? v.value[E + 1] : v.value[0];
    }), A = N(() => (w.value?.metrics ?? []).map((E) => ({ ...E, before: m.value?.metrics.find((h) => h.field === E.field) }))), T = N(() => (w.value?.fields ?? []).map(K)), U = N(() => Oe(l.fields.map(K))), B = (E, h) => E.scores.find((x) => x.field === h), G = R(), j = (E) => `${Math.round(E * 100)}%`, D = (E) => {
      const h = Math.round(E * 100);
      return `${h > 0 ? "+" : h < 0 ? "−" : "±"}${Math.abs(h)} pts`;
    }, P = (E) => Math.round(E * 100) > 0 ? "up" : Math.round(E * 100) < 0 ? "down" : "flat", ue = (E) => E >= 6e4 ? `${Math.floor(E / 6e4)}m ${Math.round(E % 6e4 / 1e3)}s` : `${(E / 1e3).toFixed(1)}s`, ke = (E) => E == null || E === "" ? "—" : typeof E == "string" ? E : Array.isArray(E) && E.every((h) => typeof h != "object") ? E.join(", ") : JSON.stringify(E), le = (E) => E ? E.failed ? "fail" : E.score >= 0.999 ? "pass" : E.score > 0 ? "partial" : "fail" : "none", oe = (E) => (E.results ?? []).filter((h) => h.status === "completed").length, fe = { queued: "Queued", running: "Running", completed: "Completed", partial: "Partial", failed: "Failed" };
    return (E, h) => (a(), s("div", Ii, [
      t("section", zi, [
        t("div", Wi, [
          t("div", null, [
            t("h2", Hi, "Evaluate revision " + d(e.revision), 1),
            h[6] || (h[6] = t("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            e.changed ? (a(), s("p", Gi, [
              f(b(L), { icon: "tabler:info-circle" }),
              h[5] || (h[5] = F("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : g("", !0)
          ]),
          f(b(de), {
            label: S.value ? "Evaluating…" : "Run all cases",
            loading: e.starting || !!S.value,
            disabled: !e.cases.length || !e.fields.length || !!S.value || e.starting,
            onClick: h[0] || (h[0] = (x) => u("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        w.value && !b(He)(w.value) ? (a(), s("div", Ki, [
          t("span", Qi, [
            t("span", {
              style: qe({ width: j(V.value.total ? V.value.done / V.value.total : 0) })
            }, null, 4)
          ]),
          t("span", Ji, d(fe[w.value.status]) + " · " + d(V.value.done) + " of " + d(V.value.total) + " cases", 1)
        ])) : g("", !0)
      ]),
      w.value && b(He)(w.value) ? (a(), s(M, { key: 0 }, [
        w.value.error ? (a(), s("p", {
          key: 0,
          class: Q(w.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          f(b(L), { icon: "tabler:alert-triangle" }),
          F(d(w.value.error), 1)
        ], 2)) : g("", !0),
        t("div", Yi, [
          t("div", Xi, [
            t("span", Zi, "Accuracy · revision " + d(w.value.config_revision), 1),
            t("span", _i, d(j(b(Se)(w.value))), 1),
            m.value ? (a(), s("span", {
              key: 0,
              class: Q(["stat-delta", P(b(Se)(w.value) - b(Se)(m.value))])
            }, d(D(b(Se)(w.value) - b(Se)(m.value))) + " vs revision " + d(m.value.config_revision), 3)) : g("", !0)
          ]),
          t("div", eu, [
            h[7] || (h[7] = t("span", { class: "stat-label" }, "Cases", -1)),
            t("span", tu, [
              F(d(oe(w.value)), 1),
              t("small", null, " / " + d(w.value.case_count), 1)
            ]),
            t("span", lu, d((w.value.results ?? []).filter((x) => x.status === "partial").length) + " partial · " + d((w.value.results ?? []).filter((x) => x.status === "failed").length) + " failed", 1)
          ]),
          t("div", au, [
            h[8] || (h[8] = t("span", { class: "stat-label" }, "Tokens", -1)),
            t("span", nu, d(w.value.tokens.toLocaleString()), 1),
            m.value ? (a(), s("span", su, d(m.value.tokens.toLocaleString()) + " before", 1)) : g("", !0)
          ]),
          t("div", ou, [
            h[9] || (h[9] = t("span", { class: "stat-label" }, "Model time", -1)),
            t("span", iu, d(ue(w.value.duration_ms)), 1),
            m.value ? (a(), s("span", uu, d(ue(m.value.duration_ms)) + " before", 1)) : g("", !0)
          ])
        ]),
        t("section", du, [
          t("header", ru, [
            h[11] || (h[11] = t("h2", { class: "block-title" }, "Field accuracy", -1)),
            v.value.length > 1 ? (a(), s("label", cu, [
              h[10] || (h[10] = t("span", { class: "muted" }, "Compare with", -1)),
              t("select", {
                value: m.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: h[1] || (h[1] = (x) => o.value = x.target.value)
              }, [
                (a(!0), s(M, null, z(v.value.filter((x) => x.id !== w.value.id), (x) => (a(), s("option", {
                  key: x.id,
                  value: x.id
                }, "Revision " + d(x.config_revision) + " · " + d(b(Ye)(x.created_at)), 9, mu))), 128))
              ], 40, vu)
            ])) : g("", !0)
          ]),
          A.value.length ? (a(), s("div", bu, [
            t("table", {
              class: Q(["metric-table accuracy-table", { comparing: !!m.value }])
            }, [
              t("thead", null, [
                t("tr", null, [
                  h[12] || (h[12] = t("th", null, "Field", -1)),
                  h[13] || (h[13] = t("th", null, "Accuracy", -1)),
                  h[14] || (h[14] = t("th", null, "Verified", -1)),
                  m.value ? (a(), s("th", fu, "Revision " + d(m.value.config_revision), 1)) : g("", !0),
                  m.value ? (a(), s("th", gu, "Change")) : g("", !0)
                ])
              ]),
              t("tbody", null, [
                (a(!0), s(M, null, z(A.value, (x) => (a(), s("tr", {
                  key: x.field
                }, [
                  t("td", hu, d(x.field), 1),
                  t("td", null, [
                    t("span", yu, [
                      t("span", ku, [
                        t("span", {
                          style: qe({ width: j(x.accuracy) })
                        }, null, 4)
                      ]),
                      F(d(j(x.accuracy)), 1)
                    ])
                  ]),
                  t("td", $u, d(j(x.verified)), 1),
                  m.value ? (a(), s("td", xu, d(x.before ? j(x.before.accuracy) : "—"), 1)) : g("", !0),
                  m.value ? (a(), s("td", wu, [
                    x.before ? (a(), s("span", {
                      key: 0,
                      class: Q(["trend", P(x.accuracy - x.before.accuracy)])
                    }, [
                      f(b(L), {
                        icon: P(x.accuracy - x.before.accuracy) === "up" ? "tabler:trending-up" : P(x.accuracy - x.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      F(d(D(x.accuracy - x.before.accuracy)), 1)
                    ], 2)) : (a(), s("span", Vu, "New field"))
                  ])) : g("", !0)
                ]))), 128))
              ])
            ], 2)
          ])) : (a(), s("p", pu, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : g("", !0),
      w.value?.results?.length ? (a(), s("section", Su, [
        h[19] || (h[19] = t("header", { class: "block-head" }, [
          t("h2", { class: "block-title" }, "Results by case"),
          t("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        t("div", Cu, [
          t("table", Eu, [
            t("thead", null, [
              t("tr", null, [
                h[15] || (h[15] = t("th", null, "Document", -1)),
                (a(!0), s(M, null, z(T.value, (x) => (a(), s("th", {
                  key: x,
                  class: "mono"
                }, d(x), 1))), 128))
              ])
            ]),
            t("tbody", null, [
              (a(!0), s(M, null, z(w.value.results, (x) => (a(), s(M, {
                key: x.case_id
              }, [
                t("tr", {
                  class: Q(["result-row", { active: G.value === x.case_id }])
                }, [
                  t("td", null, [
                    t("button", {
                      type: "button",
                      class: "case-toggle",
                      "aria-expanded": G.value === x.case_id,
                      onClick: (O) => G.value = G.value === x.case_id ? void 0 : x.case_id
                    }, [
                      f(b(L), {
                        icon: G.value === x.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      F(d(x.upload_name), 1)
                    ], 8, qu),
                    x.status === "partial" ? (a(), s("span", Uu, "Partial")) : g("", !0)
                  ]),
                  x.status === "queued" || x.status === "failed" ? (a(), s("td", {
                    key: 0,
                    colspan: T.value.length,
                    class: "muted"
                  }, [
                    x.status === "queued" ? (a(), s("span", Fu, [
                      f(b(L), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      h[16] || (h[16] = F("Waiting", -1))
                    ])) : (a(), s("span", {
                      key: 1,
                      class: "cell-state fail",
                      "data-error-kind": x.error?.kind,
                      title: x.error?.kind
                    }, [
                      f(b(L), { icon: "tabler:alert-triangle" }),
                      F(d(x.error?.message), 1)
                    ], 8, Mu))
                  ], 8, Nu)) : (a(!0), s(M, { key: 1 }, z(T.value, (O) => (a(), s("td", {
                    key: O,
                    "data-label": O
                  }, [
                    t("span", {
                      class: Q(["cell", le(B(x, O))]),
                      title: ke(B(x, O)?.value)
                    }, d(B(x, O)?.failed ? "Failed" : B(x, O) ? j(B(x, O).score) : "—"), 11, Ru)
                  ], 8, Au))), 128))
                ], 2),
                G.value === x.case_id ? (a(), s("tr", Lu, [
                  t("td", {
                    colspan: T.value.length + 1
                  }, [
                    x.error ? (a(), s("p", {
                      key: 0,
                      class: "muted",
                      "data-error-kind": x.error.kind,
                      title: x.error.kind
                    }, d(x.error.message), 9, Ou)) : g("", !0),
                    f(Re, {
                      node: b(Oe)(x.scores.map((O) => O.field))
                    }, {
                      default: me(({ index: O }) => [
                        (a(!0), s(M, null, z([x.scores[O]], (I) => (a(), s("dl", {
                          key: I.field,
                          class: "compare"
                        }, [
                          t("dt", Pu, d(I.field.split(".").at(-1)), 1),
                          t("dd", null, [
                            t("span", {
                              class: Q(["cell", le(I)])
                            }, d(I.failed ? "Failed" : j(I.score)), 3),
                            t("div", Tu, [
                              h[17] || (h[17] = t("span", { class: "cmp-label" }, "Expected", -1)),
                              f(Le, {
                                value: I.expected
                              }, null, 8, ["value"])
                            ]),
                            t("div", Du, [
                              h[18] || (h[18] = t("span", { class: "cmp-label" }, "Extracted", -1)),
                              I.failed ? (a(), J(Ot, {
                                key: 0,
                                error: I.error
                              }, null, 8, ["error"])) : (a(), J(Le, {
                                key: 1,
                                value: I.value
                              }, null, 8, ["value"]))
                            ]),
                            !I.failed || I.verification ? (a(), s("span", ju, [
                              I.failed ? g("", !0) : (a(), s("span", {
                                key: 0,
                                class: Q(["chip", I.verified ? "primary" : "warn"])
                              }, [
                                f(b(L), {
                                  icon: I.verified ? "tabler:shield-check" : "tabler:shield-question"
                                }, null, 8, ["icon"]),
                                F(d(I.verified ? "Verified" : "Unverified"), 1)
                              ], 2)),
                              I.verification ? (a(), s("span", Iu, d(b(Bt)(I.verification)), 1)) : g("", !0)
                            ])) : g("", !0)
                          ])
                        ]))), 128))
                      ]),
                      _: 2
                    }, 1032, ["node"]),
                    t("p", zu, d(x.tokens.toLocaleString()) + " tokens · " + d(ue(x.duration_ms)), 1)
                  ], 8, Bu)
                ])) : g("", !0)
              ], 64))), 128))
            ])
          ])
        ])
      ])) : g("", !0),
      t("section", Wu, [
        t("header", Hu, [
          h[20] || (h[20] = t("h2", { class: "block-title" }, "Cases", -1)),
          t("span", Gu, d(e.cases.length), 1),
          f(b(de), {
            label: "Add case",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: !e.fields.length,
            onClick: h[2] || (h[2] = (x) => i.value = !i.value)
          }, null, 8, ["disabled"])
        ]),
        i.value ? (a(), s("form", {
          key: 0,
          class: "case-form",
          onSubmit: ve(C, ["prevent"])
        }, [
          t("label", null, [
            h[21] || (h[21] = F("Document", -1)),
            f(Lt, {
              value: p.value,
              onSelect: h[3] || (h[3] = (x) => {
                p.value = x;
              })
            }, null, 8, ["value"])
          ]),
          h[24] || (h[24] = t("p", { class: "muted" }, "Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.", -1)),
          f(Re, { node: U.value }, {
            default: me(({ index: x }) => [
              (a(!0), s(M, null, z([e.fields[x]], (O) => (a(), s("label", {
                key: b(K)(O)
              }, [
                t("span", Ku, d(O.name), 1),
                O.type === "boolean" ? W((a(), s("select", {
                  key: 0,
                  "onUpdate:modelValue": (I) => y.value[b(K)(O)] = I
                }, [...h[22] || (h[22] = [
                  t("option", { value: "" }, "Not stated", -1),
                  t("option", { value: "true" }, "Yes", -1),
                  t("option", { value: "false" }, "No", -1)
                ])], 8, Qu)), [
                  [Ge, y.value[b(K)(O)]]
                ]) : O.type === "enum" ? W((a(), s("select", {
                  key: 1,
                  "onUpdate:modelValue": (I) => y.value[b(K)(O)] = I
                }, [
                  h[23] || (h[23] = t("option", { value: "" }, "Not stated", -1)),
                  (a(!0), s(M, null, z(O.enum_values, (I) => (a(), s("option", { key: I }, d(I), 1))), 128))
                ], 8, Ju)), [
                  [Ge, y.value[b(K)(O)]]
                ]) : O.type === "object" || O.type === "list" ? W((a(), s("textarea", {
                  key: 2,
                  "onUpdate:modelValue": (I) => y.value[b(K)(O)] = I,
                  rows: "2",
                  placeholder: O.type === "list" ? '["first", "second"]' : '{"key": "value"}'
                }, null, 8, Yu)), [
                  [_, y.value[b(K)(O)]]
                ]) : W((a(), s("input", {
                  key: 3,
                  "onUpdate:modelValue": (I) => y.value[b(K)(O)] = I,
                  type: O.type === "number" ? "number" : O.type === "date" ? "date" : "text",
                  placeholder: "Not stated"
                }, null, 8, Xu)), [
                  [rl, y.value[b(K)(O)]]
                ])
              ]))), 128))
            ]),
            _: 1
          }, 8, ["node"]),
          r.value ? (a(), s("p", Zu, d(r.value), 1)) : g("", !0),
          t("div", _u, [
            f(b(de), {
              label: "Save case",
              size: "small",
              type: "submit",
              disabled: !p.value,
              loading: e.saving
            }, null, 8, ["disabled", "loading"]),
            f(b(de), {
              label: "Cancel",
              size: "small",
              severity: "secondary",
              text: "",
              onClick: h[4] || (h[4] = (x) => i.value = !1)
            })
          ])
        ], 32)) : g("", !0),
        e.fields.length ? !e.cases.length && !i.value ? (a(), s("p", td, "No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.")) : e.cases.length ? (a(), s("div", ld, [
          t("table", ad, [
            h[25] || (h[25] = t("thead", null, [
              t("tr", null, [
                t("th", null, "Document"),
                t("th", null, "Expected values"),
                t("th")
              ])
            ], -1)),
            t("tbody", null, [
              (a(!0), s(M, null, z(e.cases, (x) => (a(), s("tr", {
                key: x.id
              }, [
                t("td", null, [
                  f(b(L), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  F(" " + d(x.upload_name), 1)
                ]),
                t("td", null, [
                  f(Re, { node: U.value }, {
                    default: me(({ index: O }) => [
                      t("div", nd, [
                        t("strong", null, d(e.fields[O].name), 1),
                        b(st)(x.expected, b(K)(e.fields[O])) !== void 0 ? (a(), J(Le, {
                          key: 0,
                          value: b(st)(x.expected, b(K)(e.fields[O]))
                        }, null, 8, ["value"])) : (a(), s("span", sd, "Not stated"))
                      ])
                    ]),
                    _: 2
                  }, 1032, ["node"])
                ]),
                t("td", od, [
                  t("button", {
                    type: "button",
                    class: "kx-iconbtn kx-focus-outline",
                    "aria-label": `Remove case ${x.upload_name}`,
                    disabled: e.saving,
                    onClick: (O) => u("delete-case", x.id)
                  }, [
                    f(b(L), { icon: "tabler:trash" })
                  ], 8, id)
                ])
              ]))), 128))
            ])
          ])
        ])) : g("", !0) : (a(), s("p", ed, "Add a field in the Builder, then add documents with the values you expect."))
      ]),
      e.evaluations.length ? (a(), s("section", ud, [
        t("header", dd, [
          h[26] || (h[26] = t("h2", { class: "block-title" }, "History", -1)),
          t("span", rd, d(e.evaluations.length), 1)
        ]),
        t("ul", cd, [
          (a(!0), s(M, null, z(e.evaluations, (x) => (a(), s("li", {
            key: x.id
          }, [
            t("button", {
              type: "button",
              class: Q({ active: w.value?.id === x.id }),
              "aria-current": w.value?.id === x.id,
              onClick: (O) => u("open", x.id)
            }, [
              t("span", {
                class: "badge",
                "data-status": x.status
              }, d(fe[x.status]), 9, md),
              t("span", null, "Revision " + d(x.config_revision), 1),
              t("span", pd, d(b(Ye)(x.created_at)), 1),
              t("strong", bd, d(x.status === "completed" || x.status === "partial" ? j(b(Se)(x)) : "—"), 1)
            ], 10, vd)
          ]))), 128))
        ])
      ])) : g("", !0)
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
}, Nd = { colspan: "6" }, Fd = /* @__PURE__ */ H({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(e) {
    const n = R(), l = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (u, i) => (a(), s(M, null, [
      t("div", gd, [
        i[0] || (i[0] = t("h2", null, "Recent runs", -1)),
        t("span", hd, "Runs expire after " + d(e.retention), 1)
      ]),
      e.runs.length ? (a(), s("div", kd, [
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
            (a(!0), s(M, null, z(e.runs, (p) => (a(), s(M, {
              key: p.id
            }, [
              t("tr", null, [
                t("td", null, [
                  t("button", {
                    type: "button",
                    class: "case-toggle",
                    "aria-label": `Show values for run ${p.id}`,
                    "aria-expanded": n.value === p.id,
                    onClick: (y) => n.value = n.value === p.id ? void 0 : p.id
                  }, [
                    f(b(L), {
                      icon: n.value === p.id ? "tabler:chevron-down" : "tabler:chevron-right"
                    }, null, 8, ["icon"]),
                    F(d(b(Ye)(p.created_at)), 1)
                  ], 8, xd)
                ]),
                t("td", null, [
                  t("span", wd, [
                    f(b(L), {
                      icon: l[p.caller].icon
                    }, null, 8, ["icon"]),
                    F(d(l[p.caller].label), 1)
                  ]),
                  p.result.page_range ? (a(), s("span", Vd, " · Pages " + d(p.result.page_range.first) + "–" + d(p.result.page_range.last), 1)) : g("", !0)
                ]),
                t("td", null, [
                  t("span", {
                    class: "badge",
                    "data-status": p.status
                  }, d(p.status === "completed" ? "Completed" : p.status === "partial" ? "Partial" : "Failed"), 9, Sd)
                ]),
                t("td", Cd, d((p.duration_ms / 1e3).toFixed(1)) + "s", 1),
                t("td", Ed, d(Number(p.tokens).toLocaleString()), 1),
                t("td", qd, d(b(Ye)(p.expires_at)), 1)
              ]),
              n.value === p.id ? (a(), s("tr", Ud, [
                t("td", Nd, [
                  f(Pt, {
                    fields: p.result.fields,
                    "page-range": p.result.page_range
                  }, null, 8, ["fields", "page-range"])
                ])
              ])) : g("", !0)
            ], 64))), 128))
          ])
        ])
      ])) : (a(), s("p", yd, "No runs yet. Runs from the Test tab, agents, evaluations and Workflows appear here."))
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
  setup(e, { emit: n }) {
    const l = e, u = n, i = R(), p = R("");
    return Ue(async () => {
      try {
        await Ze("kickside-share", { timeoutMs: 8e3 });
      } catch ($) {
        p.value = `Sharing is unavailable: ${$ instanceof Error ? $.message : String($)}`;
        return;
      }
      const y = document.createElement("kickside-share"), r = encodeURIComponent(l.id);
      y.setAttribute("config", JSON.stringify({ resource_id: l.id, title: l.title, access_url: `/api/v1/component-access/grants/${r}`, share_url: `/api/v1/component-access/share/${r}` })), y.style.display = "block", y.addEventListener("close", () => u("close")), i.value?.appendChild(y);
    }), (y, r) => (a(), s("div", {
      ref_key: "host",
      ref: i
    }, [
      p.value ? (a(), s("p", Md, d(p.value), 1)) : g("", !0)
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
  setup(e, { emit: n }) {
    const l = e, u = n, i = R(), p = R(!1), y = R("Builder"), r = R($t()), $ = R(""), C = R(""), S = N(() => l.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    be(y, () => {
      i.value && (i.value.scrollTop = 0);
    }, { flush: "post" });
    const v = R(), w = R(), V = N(() => l.snapshot.can_edit && v.value !== l.snapshot.expected_revision), o = N(() => V.value && w.value !== l.snapshot.expected_revision);
    function m(j) {
      return $.value === j.title && C.value === (j.description ?? "") && Nl(r.value, j.config);
    }
    function A() {
      const j = l.snapshot;
      r.value = structuredClone(lt(j.config ?? $t())), $.value = j.title, C.value = j.description ?? "", v.value = j.expected_revision, w.value = void 0;
    }
    be(() => l.snapshot, (j, D) => {
      S.value.includes(y.value) || (y.value = S.value[0]), !(D && j.id === D.id && j.can_edit && D.can_edit && !m(D) && !m(j)) && A();
    }, { immediate: !0 });
    const T = N(() => l.snapshot.can_edit && !m(l.snapshot)), U = N(() => Ul(r.value)), B = N(() => Object.keys($e).filter((j) => Qe(r.value, j)).length);
    function G() {
      u("save", { title: $.value, description: C.value, config: structuredClone(lt(r.value)), expected_revision: v.value });
    }
    return (j, D) => (a(), s("main", Rd, [
      t("div", Ld, [
        t("div", Bd, [
          t("span", Od, [
            e.back ? (a(), s("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: D[0] || (D[0] = (P) => u("back"))
            }, [
              f(b(L), { icon: "tabler:arrow-left" })
            ])) : g("", !0),
            t("span", Pd, d(e.snapshot.title), 1)
          ]),
          t("nav", Td, [
            (a(!0), s(M, null, z(S.value, (P) => (a(), s("button", {
              id: `tab-${P}`,
              key: P,
              role: "tab",
              "aria-selected": y.value === P,
              "aria-controls": `panel-${P}`,
              onClick: (ue) => y.value = P
            }, d(P), 9, Dd))), 128))
          ])
        ]),
        t("div", jd, [
          e.snapshot.can_share ? (a(), J(b(de), {
            key: 0,
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-label": "Share",
            onClick: D[1] || (D[1] = (P) => p.value = !0)
          }, {
            default: me(() => [
              f(b(L), { icon: "tabler:share" }),
              D[11] || (D[11] = t("span", { class: "btn-label" }, "Share", -1))
            ]),
            _: 1
          })) : g("", !0),
          t("span", Id, [
            F(d(e.snapshot.field_count) + " " + d(e.snapshot.field_count === 1 ? "field" : "fields"), 1),
            e.snapshot.can_edit ? (a(), s(M, { key: 0 }, [
              F(" · " + d(B.value) + " steps · revision " + d(e.snapshot.expected_revision), 1)
            ], 64)) : (a(), s(M, { key: 1 }, [
              F(" · Read access")
            ], 64))
          ]),
          e.snapshot.can_edit ? (a(), s(M, { key: 1 }, [
            V.value && !o.value ? (a(), J(b(de), {
              key: 0,
              label: "Reload saved",
              severity: "secondary",
              size: "small",
              onClick: A
            })) : g("", !0),
            U.value ? (a(), s("span", {
              key: 1,
              class: "invalid",
              role: "alert",
              title: U.value
            }, [
              f(b(L), { icon: "tabler:alert-circle" }),
              F(d(U.value), 1)
            ], 8, zd)) : T.value ? (a(), s("span", Wd, "Unsaved")) : g("", !0),
            f(b(de), {
              label: "Save",
              size: "small",
              loading: e.saving,
              disabled: !T.value || !!U.value || !$.value.trim(),
              onClick: G
            }, null, 8, ["loading", "disabled"])
          ], 64)) : g("", !0)
        ])
      ]),
      o.value ? (a(), s("div", Hd, [
        t("span", null, "Saved configuration changed to revision " + d(e.snapshot.expected_revision) + ". Your edits are kept.", 1),
        f(b(de), {
          label: "Reload saved",
          severity: "secondary",
          size: "small",
          onClick: A
        }),
        f(b(de), {
          label: "Keep editing",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: D[2] || (D[2] = (P) => w.value = e.snapshot.expected_revision)
        })
      ])) : g("", !0),
      e.error ? (a(), s("p", Gd, d(e.error), 1)) : g("", !0),
      p.value ? (a(), J(Ad, {
        key: 2,
        id: e.snapshot.id,
        title: e.snapshot.title,
        onClose: D[3] || (D[3] = (P) => p.value = !1)
      }, null, 8, ["id", "title"])) : g("", !0),
      y.value === "Builder" && e.snapshot.can_edit ? (a(), s("div", Kd, [
        f(Xo, {
          title: $.value,
          "onUpdate:title": D[4] || (D[4] = (P) => $.value = P),
          description: C.value,
          "onUpdate:description": D[5] || (D[5] = (P) => C.value = P),
          config: r.value,
          retention: e.snapshot.retention,
          result: e.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (a(), s("div", {
        key: 4,
        ref_key: "body",
        ref: i,
        class: "page-body"
      }, [
        t("div", {
          id: `panel-${y.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${y.value}`,
          class: "panel"
        }, [
          y.value === "Test" ? (a(), J(ji, {
            key: 0,
            result: e.result,
            retention: e.snapshot.retention,
            running: e.running,
            "can-run": e.snapshot.field_count > 0,
            onRun: D[6] || (D[6] = (P) => u("run", P))
          }, null, 8, ["result", "retention", "running", "can-run"])) : g("", !0),
          y.value === "Evals" && e.snapshot.can_edit ? (a(), J(fd, {
            key: 1,
            cases: e.snapshot.cases,
            "added-case-id": e.addedCaseId,
            fields: e.snapshot.config.fields,
            evaluations: e.evaluations,
            evaluation: e.evaluation,
            revision: e.snapshot.expected_revision,
            changed: T.value,
            saving: e.saving,
            starting: e.starting,
            onAddCase: D[7] || (D[7] = (P) => u("add-case", P)),
            onDeleteCase: D[8] || (D[8] = (P) => u("delete-case", P)),
            onEvaluate: D[9] || (D[9] = (P) => u("evaluate")),
            onOpen: D[10] || (D[10] = (P) => u("open-evaluation", P))
          }, null, 8, ["cases", "added-case-id", "fields", "evaluations", "evaluation", "revision", "changed", "saving", "starting"])) : g("", !0),
          y.value === "Runs" ? (a(), J(Fd, {
            key: 2,
            runs: e.snapshot.runs,
            retention: e.snapshot.retention
          }, null, 8, ["runs", "retention"])) : g("", !0)
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
}, lr = /* @__PURE__ */ H({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(e, { emit: n }) {
    const l = e, u = n, i = R(), p = R(""), y = R(!1), r = R(!1), $ = R(!1), C = R(), S = R(null), v = R([]), w = R();
    let V = [], o = 0, m = 0, A = 0, T;
    const U = (E) => E instanceof Error ? E.message : String(E), B = (E) => E === o;
    async function G(E, h) {
      const x = ++A;
      h && (T = h);
      const O = () => B(E) && x === A;
      try {
        const I = l.id, Ne = await he.evaluations(I);
        if (!O()) return;
        v.value = Ne;
        const ge = T ?? Ne[0]?.id;
        if (ge) {
          const Te = await he.evaluation(I, ge);
          if (!O() || Te.id !== (T ?? ge)) return;
          w.value = Te;
        }
      } catch (I) {
        O() && (p.value = U(I));
      }
    }
    async function j(E) {
      const h = ++m, x = () => B(E) && h === m;
      if (!l.id) {
        p.value = "No extractor selected.";
        return;
      }
      try {
        const O = await he.get(l.id);
        if (!x()) return;
        i.value = O, p.value = "", O.can_edit && await G(E);
      } catch (O) {
        x() && (p.value = U(O));
      }
    }
    be(() => l.id, (E, h) => {
      o++, T = void 0, V.forEach((O) => O()), V = [], C.value = void 0, i.value = void 0, S.value = null, v.value = [], w.value = void 0, p.value = "";
      const x = o;
      l.id && (V = [xt(`component.${l.id}`, () => j(x)), xt(`docscout.runs.${l.id}`, () => j(x))]), h !== void 0 && j(x);
    }, { immediate: !0 }), Fl(() => j(o)), Ct(() => {
      o++, V.forEach((E) => E());
    });
    async function D(E) {
      const h = o;
      y.value = !0, p.value = "";
      try {
        const x = await E();
        if (B(h))
          return await j(h), x;
      } catch (x) {
        B(h) && (p.value = U(x));
      } finally {
        y.value = !1;
      }
    }
    const P = (E) => D(() => he.update(l.id, E));
    async function ue(E) {
      const h = o, x = await D(() => he.addCase(l.id, E));
      x && B(h) && (C.value = x.id);
    }
    const ke = (E) => D(() => he.deleteCase(l.id, E));
    async function le(E) {
      const h = o;
      r.value = !0, p.value = "";
      try {
        const x = await he.run(l.id, E);
        B(h) && (S.value = x, await j(h));
      } catch (x) {
        if (B(h)) {
          const O = x?.response?.data?.error;
          p.value = i.value?.config?.stages.extract.reads === "pages" && O ? O : U(x);
        }
      } finally {
        r.value = !1;
      }
    }
    async function oe() {
      const E = o;
      $.value = !0, p.value = "";
      try {
        const { eval_id: h } = await he.evaluate(l.id);
        B(E) && await G(E, h);
      } catch (h) {
        B(E) && (p.value = U(h));
      } finally {
        $.value = !1;
      }
    }
    function fe(E) {
      G(o, E);
    }
    return (E, h) => i.value ? (a(), J(Jd, {
      key: 0,
      snapshot: i.value,
      "added-case-id": C.value,
      saving: y.value,
      running: r.value,
      starting: $.value,
      result: S.value,
      evaluations: v.value,
      evaluation: w.value,
      error: p.value,
      back: e.back,
      onBack: h[0] || (h[0] = (x) => u("back")),
      onRun: le,
      onSave: P,
      onAddCase: ue,
      onDeleteCase: ke,
      onEvaluate: oe,
      onOpenEvaluation: fe
    }, null, 8, ["snapshot", "added-case-id", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : p.value ? (a(), s("p", Yd, d(p.value), 1)) : (a(), s("p", Xd, "Loading Docscout…"));
  }
});
export {
  lr as _,
  Ye as w
};
