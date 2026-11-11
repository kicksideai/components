import { defineComponent as W, useModel as Le, openBlock as n, createElementBlock as o, withModifiers as ve, createElementVNode as t, mergeModels as Xe, computed as F, withKeys as Ee, unref as p, normalizeClass as Q, createVNode as f, toDisplayString as r, Fragment as U, renderList as I, createCommentVNode as k, createTextVNode as q, createBlock as J, ref as M, useId as pe, watch as fe, withDirectives as z, vModelText as _, vModelSelect as Ge, resolveComponent as st, renderSlot as je, withCtx as me, mergeProps as bt, vShow as Ke, onMounted as Ne, nextTick as Ce, normalizeStyle as qe, onBeforeUnmount as Ct, vModelDynamic as dl, toRaw as gt } from "vue";
import { B as rl, L as cl, j as ze, v as Me, k as vl, U as ml, I as ht, f as pl, i as Qe, l as Et, t as lt, h as ke, o as ot, p as fl, m as qt, q as G, M as Ae, r as Nt, w as Ft, x as at, y as bl, z as gl, A as hl, C as yl, D as kl, E as Ut, F as $l, G as Mt, H as xl, J as wl, K as Sl, N as yt, O as Vl, P as et, Q as Cl, R as Oe, S as El, s as de, T as kt, n as $t, V as ql, W as Nl, b as Fl, c as he } from "./index-Co4u6Ww2.js";
import { loadByTagName as Ze, on as xt } from "@wippy-fe/proxy";
import { Icon as A } from "@iconify/vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
var Ul = rl.extend({
  name: "focustrap-directive"
}), Ml = vl.extend({
  style: Ul
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
    var i = Object.getOwnPropertySymbols(e);
    s && (i = i.filter(function(u) {
      return Object.getOwnPropertyDescriptor(e, u).enumerable;
    })), l.push.apply(l, i);
  }
  return l;
}
function St(e) {
  for (var s = 1; s < arguments.length; s++) {
    var l = arguments[s] != null ? arguments[s] : {};
    s % 2 ? wt(Object(l), !0).forEach(function(i) {
      Al(e, i, l[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(l)) : wt(Object(l)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(l, i));
    });
  }
  return e;
}
function Al(e, s, l) {
  return (s = Rl(s)) in e ? Object.defineProperty(e, s, { value: l, enumerable: !0, configurable: !0, writable: !0 }) : e[s] = l, e;
}
function Rl(e) {
  var s = Bl(e, "string");
  return Pe(s) == "symbol" ? s : s + "";
}
function Bl(e, s) {
  if (Pe(e) != "object" || !e) return e;
  var l = e[Symbol.toPrimitive];
  if (l !== void 0) {
    var i = l.call(e, s);
    if (Pe(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (s === "string" ? String : Number)(e);
}
var Ll = Ml.extend("focustrap", {
  mounted: function(s, l) {
    var i = l.value || {}, u = i.disabled;
    u || (this.createHiddenFocusableElements(s, l), this.bind(s, l), this.autoElementFocus(s, l)), s.setAttribute("data-pd-focustrap", !0), this.$el = s;
  },
  updated: function(s, l) {
    var i = l.value || {}, u = i.disabled;
    u && this.unbind(s);
  },
  unmounted: function(s) {
    this.unbind(s);
  },
  methods: {
    getComputedSelector: function(s) {
      return ':not(.p-hidden-focusable):not([data-p-hidden-focusable="true"])'.concat(s ?? "");
    },
    bind: function(s, l) {
      var i = this, u = l.value || {}, m = u.onFocusIn, h = u.onFocusOut;
      s.$_pfocustrap_mutationobserver = new MutationObserver(function(d) {
        d.forEach(function(x) {
          if (x.type === "childList" && !s.contains(document.activeElement)) {
            var w = function(c) {
              var a = ht(c) ? ht(c, i.getComputedSelector(s.$_pfocustrap_focusableselector)) ? c : Me(s, i.getComputedSelector(s.$_pfocustrap_focusableselector)) : Me(c);
              return pl(a) ? a : c.nextSibling && w(c.nextSibling);
            };
            ze(w(x.nextSibling));
          }
        });
      }), s.$_pfocustrap_mutationobserver.disconnect(), s.$_pfocustrap_mutationobserver.observe(s, {
        childList: !0
      }), s.$_pfocustrap_focusinlistener = function(d) {
        return m && m(d);
      }, s.$_pfocustrap_focusoutlistener = function(d) {
        return h && h(d);
      }, s.addEventListener("focusin", s.$_pfocustrap_focusinlistener), s.addEventListener("focusout", s.$_pfocustrap_focusoutlistener);
    },
    unbind: function(s) {
      s.$_pfocustrap_mutationobserver && s.$_pfocustrap_mutationobserver.disconnect(), s.$_pfocustrap_focusinlistener && s.removeEventListener("focusin", s.$_pfocustrap_focusinlistener) && (s.$_pfocustrap_focusinlistener = null), s.$_pfocustrap_focusoutlistener && s.removeEventListener("focusout", s.$_pfocustrap_focusoutlistener) && (s.$_pfocustrap_focusoutlistener = null);
    },
    autoFocus: function(s) {
      this.autoElementFocus(this.$el, {
        value: St(St({}, s), {}, {
          autoFocus: !0
        })
      });
    },
    autoElementFocus: function(s, l) {
      var i = l.value || {}, u = i.autoFocusSelector, m = u === void 0 ? "" : u, h = i.firstFocusableSelector, d = h === void 0 ? "" : h, x = i.autoFocus, w = x === void 0 ? !1 : x, E = Me(s, "[autofocus]".concat(this.getComputedSelector(m)));
      w && !E && (E = Me(s, this.getComputedSelector(d))), ze(E);
    },
    onFirstHiddenElementFocus: function(s) {
      var l, i = s.currentTarget, u = s.relatedTarget, m = u === i.$_pfocustrap_lasthiddenfocusableelement || !((l = this.$el) !== null && l !== void 0 && l.contains(u)) ? Me(i.parentElement, this.getComputedSelector(i.$_pfocustrap_focusableselector)) : i.$_pfocustrap_lasthiddenfocusableelement;
      ze(m);
    },
    onLastHiddenElementFocus: function(s) {
      var l, i = s.currentTarget, u = s.relatedTarget, m = u === i.$_pfocustrap_firsthiddenfocusableelement || !((l = this.$el) !== null && l !== void 0 && l.contains(u)) ? cl(i.parentElement, this.getComputedSelector(i.$_pfocustrap_focusableselector)) : i.$_pfocustrap_firsthiddenfocusableelement;
      ze(m);
    },
    createHiddenFocusableElements: function(s, l) {
      var i = this, u = l.value || {}, m = u.tabIndex, h = m === void 0 ? 0 : m, d = u.firstFocusableSelector, x = d === void 0 ? "" : d, w = u.lastFocusableSelector, E = w === void 0 ? "" : w, c = function(S) {
        return ml("span", {
          class: "p-hidden-accessible p-hidden-focusable",
          tabIndex: h,
          role: "presentation",
          "aria-hidden": !0,
          "data-p-hidden-accessible": !0,
          "data-p-hidden-focusable": !0,
          onFocus: S?.bind(i)
        });
      }, a = c(this.onFirstHiddenElementFocus), b = c(this.onLastHiddenElementFocus);
      a.$_pfocustrap_lasthiddenfocusableelement = b, a.$_pfocustrap_focusableselector = x, a.setAttribute("data-pc-section", "firstfocusableelement"), b.$_pfocustrap_firsthiddenfocusableelement = a, b.$_pfocustrap_focusableselector = E, b.setAttribute("data-pc-section", "lastfocusableelement"), s.prepend(a), s.append(b);
    }
  }
});
const Ol = ["aria-checked", "aria-label", "disabled"], Z = /* @__PURE__ */ W({
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
    const s = Le(e, "modelValue");
    return (l, i) => (n(), o("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": s.value,
      "aria-label": e.label,
      disabled: e.disabled,
      onClick: i[0] || (i[0] = ve((u) => s.value = !s.value, ["stop"]))
    }, [...i[1] || (i[1] = [
      t("span", null, null, -1)
    ])], 8, Ol));
  }
}), Pl = ["aria-label"], Tl = { class: "node-icon" }, Dl = { class: "node-main" }, Il = { class: "node-title" }, jl = { class: "node-summary" }, zl = {
  key: 0,
  class: "chips"
}, Wl = {
  key: 1,
  class: "trace-line"
}, Hl = { class: "node-side" }, Gl = {
  key: 0,
  class: "chip model"
}, we = /* @__PURE__ */ W({
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
    const l = e, i = s, u = F(() => Qe(l.config, l.stage)), m = F(() => l.config.stages[l.stage].model), h = F({ get: () => u.value, set: (w) => {
      l.config.stages[l.stage].enabled = w;
    } }), d = F(() => {
      const w = l.config, E = w.stages;
      switch (l.stage) {
        case "map":
          return w.fields.filter((c) => c.search_within === "sections").map((c) => ({ text: c.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...E.prefetch.queries.map((c) => ({ text: c.name || "Untitled query", tone: "" })), ...w.fields.filter((c) => c.search_hints.trim()).map((c) => ({ text: c.name, tone: "hint" }))];
        case "scout":
          return E.scout.mode === "agent" ? E.scout.tools.map((c) => ({ text: lt(c).toLowerCase(), tone: "" })) : [];
        case "deep":
          return w.fields.filter((c) => c.strategy === "deep").map((c) => ({ text: c.name || "New field", tone: "primary" }));
        case "extract":
          return Et(w).map((c) => ({ text: `${c.name} · ${c.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), x = (w) => [`${(w.duration_ms / 1e3).toFixed(1)}s`, `${(w.input_tokens + w.output_tokens).toLocaleString()} tokens`, w.queries?.length ? `${w.queries.length} queries` : "", w.message ?? ""].filter(Boolean).join(" · ");
    return (w, E) => (n(), o("div", {
      class: Q(["node kx-focus-halo", { active: e.active, off: !u.value, fixed: e.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": p(ke)[e.stage],
      onClick: E[1] || (E[1] = (c) => i("select")),
      onKeydown: [
        E[2] || (E[2] = Ee((c) => i("select"), ["enter"])),
        E[3] || (E[3] = Ee(ve((c) => i("select"), ["prevent"]), ["space"]))
      ]
    }, [
      t("span", Tl, [
        f(p(A), {
          icon: p(ot)[e.stage]
        }, null, 8, ["icon"])
      ]),
      t("span", Dl, [
        t("span", Il, r(p(ke)[e.stage]), 1),
        t("span", jl, r(u.value ? p(fl)(e.stage, e.config) : "Off"), 1),
        u.value && d.value.length ? (n(), o("span", zl, [
          (n(!0), o(U, null, I(d.value, (c) => (n(), o("span", {
            key: c.text,
            class: Q(["chip", { primary: c.tone === "primary", "muted-chip": c.tone === "hint" }])
          }, r(c.text), 3))), 128))
        ])) : k("", !0),
        e.trace ? (n(), o("span", Wl, [
          f(p(A), {
            icon: e.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          q(r(x(e.trace)), 1)
        ])) : k("", !0)
      ]),
      t("span", Hl, [
        u.value && m.value ? (n(), o("span", Gl, r(p(qt)(m.value)), 1)) : k("", !0),
        e.stage !== "extract" && !e.readonly ? (n(), J(Z, {
          key: 1,
          modelValue: h.value,
          "onUpdate:modelValue": E[0] || (E[0] = (c) => h.value = c),
          label: `Enable ${p(ke)[e.stage]}`
        }, null, 8, ["modelValue", "label"])) : k("", !0)
      ])
    ], 42, Pl));
  }
}), Kl = ["aria-labelledby"], Ql = ["aria-label", "aria-checked", "tabindex", "disabled", "onClick", "onKeydown"], $e = /* @__PURE__ */ W({
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
    const s = e, l = Le(e, "modelValue"), i = M([]);
    function u(m, h) {
      const d = s.options.length - 1, x = { ArrowRight: h + 1, ArrowDown: h + 1, ArrowLeft: h - 1, ArrowUp: h - 1, Home: 0, End: d }[m.key];
      if (x === void 0) return;
      m.preventDefault();
      const w = (x + s.options.length) % s.options.length;
      l.value = s.options[w].value, i.value[w]?.focus();
    }
    return (m, h) => (n(), o("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": e.labelledBy
    }, [
      (n(!0), o(U, null, I(e.options, (d, x) => (n(), o("button", {
        key: d.value,
        ref_for: !0,
        ref_key: "buttons",
        ref: i,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        role: "radio",
        "aria-label": e.name ? `${e.name}: ${d.label}` : void 0,
        "aria-checked": l.value === d.value,
        tabindex: l.value === d.value ? 0 : -1,
        disabled: e.disabled,
        onClick: (w) => l.value = d.value,
        onKeydown: (w) => u(w, x)
      }, [
        d.icon ? (n(), J(p(A), {
          key: 0,
          icon: d.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : k("", !0),
        t("span", null, r(d.label), 1)
      ], 40, Ql))), 128))
    ], 8, Kl));
  }
}), ie = (e, s) => `${e}:${s.join("/")}`, At = [
  { value: "text", label: "Text", icon: "tabler:typography" },
  { value: "number", label: "Number", icon: "tabler:123" },
  { value: "boolean", label: "Yes / no", icon: "tabler:toggle-right" },
  { value: "date", label: "Date", icon: "tabler:calendar" },
  { value: "enum", label: "One of a set", icon: "tabler:list-details" },
  { value: "list", label: "List", icon: "tabler:brackets" },
  { value: "object", label: "Object", icon: "tabler:braces" }
], Jl = (e) => At.find((s) => s.value === e).icon;
function Je(e) {
  const s = [];
  function l(i, u, m, h) {
    s.push({ field: u, trail: m, shape: i, path: h, depth: m.length + 1, key: ie(u, m) }), i.properties?.forEach((d, x) => l(d, u, [...m, x], `${h}.${d.name || "New property"}`)), i.item && l(i.item, u, [...m, "item"], `${h}[]`);
  }
  return e.forEach((i, u) => l(i, u, [], G(i) || "New field")), s;
}
function nt(e) {
  return 1 + Math.max(0, ...(e.properties ?? []).map(nt), e.item ? nt(e.item) : 0);
}
function Yl(e, s) {
  return Je(e).filter((l) => l.shape.type === "object" && ((l.shape.properties?.length ?? 0) < 100 || l.field === s.field && ie(l.field, l.trail) === ie(s.field, s.trail.slice(0, -1))) && l.depth + nt(s.shape) <= Ae && !(l.field === s.field && s.trail.every((i, u) => l.trail[u] === i)));
}
function Xl(e, s, l) {
  const i = { ...Ft(), ...s.shape, name: s.shape.name };
  s.trail.length ? Je(e).find((h) => h.key === ie(s.field, s.trail.slice(0, -1))).shape.properties.splice(s.trail.at(-1), 1) : e.splice(s.field, 1);
  let u;
  if (l) {
    const { name: m, type: h, description: d, enum_values: x, expected_format: w, required: E, properties: c, item: a } = i;
    u = { name: m, type: h, description: d, enum_values: x, expected_format: w, required: E, ...c ? { properties: c } : {}, ...a ? { item: a } : {} }, l.shape.properties.push(u), u = l.shape.properties.at(-1);
  } else
    u = { ...at(), ...i, group: "" }, e.push(u), u = e.at(-1);
  return Je(e).find((m) => m.shape === u);
}
function Vt(e, s = !1) {
  function l(u) {
    return u.type === "object" ? Object.fromEntries((u.properties ?? []).map((m) => [m.name || "unnamed", l(m)])) : u.type === "list" ? u.item ? [l(u.item)] : [] : s ? u.enum_values?.length ? u.enum_values[0] : { text: "Example value", number: 42, boolean: !0, date: "2026-01-15", enum: null }[u.type] : u.type === "enum" ? u.enum_values?.join(" | ") || "enum" : u.type;
  }
  const i = {};
  return e.forEach((u) => Nt(i, G(u) || "unnamed", l(u))), i;
}
const Zl = { class: "shape-editor" }, _l = { key: 0 }, ea = ["aria-label", "aria-invalid", "aria-describedby"], ta = { class: "label-block" }, la = ["id"], aa = { key: 0 }, na = ["id"], sa = {
  key: 2,
  class: "label-block"
}, oa = { class: "chips" }, ia = ["aria-label", "onClick"], ua = {
  key: 0,
  class: "row"
}, da = ["onKeydown"], ra = {
  key: 1,
  class: "field-error",
  role: "alert"
}, ca = { key: 3 }, va = ["placeholder"], ma = {
  key: 4,
  class: "toggle-row"
}, pa = { class: "muted" }, fa = ["aria-label", "disabled"], ba = /* @__PURE__ */ W({
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
    const l = e, i = s, u = F(() => l.shape), m = F(() => l.named ? l.depth === 1 ? "Field type" : "Property type" : "Item type"), h = F(() => At.filter((R) => l.depth < Ae || !["object", "list"].includes(R.value))), d = F({ get: () => l.shape.type, set: (R) => {
      l.shape.type = R, delete l.shape.properties, delete l.shape.item, l.shape.enum_values = [], R === "object" && (l.shape.properties = []), R === "list" && (l.shape.item = bl());
    } }), x = pe(), w = pe(), E = M(""), c = M("");
    fe(() => l.shape, () => {
      E.value = "", c.value = "";
    });
    const a = F(() => l.validationError || (l.named ? gl(u.value.name, l.siblingNames) : "") || hl(l.shape, l.depth));
    function b() {
      const R = E.value.trim(), S = l.shape.enum_values ?? [];
      if (!R || R.length > 200) {
        c.value = "Enter 1 to 200 characters.";
        return;
      }
      if (S.includes(R)) {
        c.value = "This value already exists.";
        return;
      }
      if (S.length >= 100) {
        c.value = "Use at most 100 allowed values.";
        return;
      }
      l.shape.enum_values = [...S, R], E.value = "", c.value = "";
    }
    return (R, S) => (n(), o("div", Zl, [
      e.named ? (n(), o("label", _l, [
        S[8] || (S[8] = q("Name", -1)),
        z(t("input", {
          "onUpdate:modelValue": S[0] || (S[0] = (N) => u.value.name = N),
          "aria-label": e.depth === 1 ? "Field name" : "Property name",
          "aria-invalid": !!a.value,
          "aria-describedby": a.value ? p(w) : void 0,
          maxlength: "80",
          spellcheck: "false",
          class: "mono-input"
        }, null, 8, ea), [
          [
            _,
            u.value.name,
            void 0,
            { trim: !0 }
          ]
        ])
      ])) : k("", !0),
      t("div", ta, [
        t("span", { id: p(x) }, r(e.named ? "Data type" : "Item type"), 9, la),
        f($e, {
          modelValue: d.value,
          "onUpdate:modelValue": S[1] || (S[1] = (N) => d.value = N),
          class: "type-picker",
          options: h.value,
          "labelled-by": p(x),
          name: m.value,
          disabled: e.readonly
        }, null, 8, ["modelValue", "options", "labelled-by", "name", "disabled"]),
        e.depth === p(Ae) ? (n(), o("small", aa, "Level four · choose a value type.")) : k("", !0)
      ]),
      a.value ? (n(), o("p", {
        key: 1,
        id: p(w),
        class: "field-error",
        role: "alert"
      }, r(a.value), 9, na)) : k("", !0),
      p(yl)(e.shape, e.named) ? (n(), o("div", sa, [
        t("span", null, r(e.shape.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        t("div", oa, [
          (n(!0), o(U, null, I(e.shape.enum_values, (N, K) => (n(), o("span", {
            key: N,
            class: "chip primary"
          }, [
            q(r(N), 1),
            e.readonly ? k("", !0) : (n(), o("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Remove allowed value ${N}`,
              onClick: (D) => e.shape.enum_values.splice(K, 1)
            }, [
              f(p(A), { icon: "tabler:x" })
            ], 8, ia))
          ]))), 128))
        ]),
        e.readonly ? k("", !0) : (n(), o("div", ua, [
          z(t("input", {
            "onUpdate:modelValue": S[2] || (S[2] = (N) => E.value = N),
            "aria-label": "New allowed value",
            placeholder: "Add a value…",
            maxlength: "200",
            onKeydown: Ee(ve(b, ["prevent"]), ["enter"])
          }, null, 40, da), [
            [_, E.value]
          ]),
          t("button", {
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo",
            onClick: b
          }, "Add")
        ])),
        c.value ? (n(), o("p", ra, r(c.value), 1)) : k("", !0)
      ])) : k("", !0),
      t("label", null, [
        S[9] || (S[9] = q("Description", -1)),
        z(t("textarea", {
          "onUpdate:modelValue": S[3] || (S[3] = (N) => e.shape.description = N),
          rows: "3",
          maxlength: "4000",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [_, e.shape.description]
        ])
      ]),
      ["boolean", "enum"].includes(e.shape.type) ? k("", !0) : (n(), o("label", ca, [
        S[10] || (S[10] = q("Expected format", -1)),
        z(t("input", {
          "onUpdate:modelValue": S[4] || (S[4] = (N) => e.shape.expected_format = N),
          maxlength: "400",
          placeholder: p(kl)(e.shape)
        }, null, 8, va), [
          [_, e.shape.expected_format]
        ])
      ])),
      e.named ? (n(), o("div", ma, [
        S[11] || (S[11] = t("span", null, "Required", -1)),
        f(Z, {
          modelValue: u.value.required,
          "onUpdate:modelValue": S[5] || (S[5] = (N) => u.value.required = N),
          label: "Required",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : k("", !0),
      e.shape.type === "object" ? (n(), o(U, { key: 5 }, [
        t("p", pa, r(e.shape.properties?.length ?? 0) + " properties · Select a property in the tree to edit it.", 1),
        !e.readonly && e.depth < p(Ae) ? (n(), o("button", {
          key: 0,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Add property to ${e.label}`,
          disabled: (e.shape.properties?.length ?? 0) >= 100,
          onClick: S[6] || (S[6] = (N) => i("add"))
        }, [
          f(p(A), { icon: "tabler:plus" }),
          S[12] || (S[12] = q("Add property", -1))
        ], 8, fa)) : k("", !0)
      ], 64)) : k("", !0),
      e.shape.type === "list" && e.shape.item ? (n(), o("button", {
        key: 6,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        onClick: S[7] || (S[7] = (N) => i("selectItem"))
      }, [
        f(p(A), { icon: "tabler:brackets" }),
        q("Edit item shape · " + r(e.shape.item.type), 1)
      ])) : k("", !0)
    ]));
  }
}), ga = ["disabled"], ha = { class: "grid" }, ya = { class: "context-stepper" }, ka = ["disabled"], $a = ["disabled"], xa = {
  key: 0,
  class: "field-note"
}, wa = { class: "label-block" }, Sa = {
  key: 1,
  class: "field-error"
}, Va = { id: "docscout-groups" }, Ca = ["value"], Ea = { class: "toggle-row" }, qa = /* @__PURE__ */ W({
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
    const l = e, i = s, u = F(() => !l.depth || l.depth === 1), m = F(() => Ut(l.field, l.otherNames));
    return (h, d) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      f(ba, {
        shape: e.shape ?? e.field,
        depth: e.depth ?? 1,
        label: e.shape?.name || e.field.name || "field",
        named: u.value || !!e.shape?.name || !!e.siblingNames,
        "sibling-names": e.siblingNames,
        "validation-error": u.value ? m.value : void 0,
        readonly: e.readonly,
        onAdd: d[0] || (d[0] = (x) => i("add")),
        onSelectItem: d[1] || (d[1] = (x) => i("selectItem"))
      }, null, 8, ["shape", "depth", "label", "named", "sibling-names", "validation-error", "readonly"]),
      u.value ? (n(), o(U, { key: 0 }, [
        d[25] || (d[25] = t("h4", null, "Finding it", -1)),
        t("label", null, [
          d[12] || (d[12] = q("Search hints", -1)),
          z(t("textarea", {
            "onUpdate:modelValue": d[2] || (d[2] = (x) => e.field.search_hints = x),
            rows: "2",
            maxlength: "4000",
            placeholder: "One query per line"
          }, null, 512), [
            [_, e.field.search_hints]
          ]),
          d[13] || (d[13] = t("small", null, "Each line is an extra search for this field in Prefetch and Deep analysis.", -1))
        ]),
        t("div", ha, [
          t("label", null, [
            d[15] || (d[15] = q("Strategy", -1)),
            z(t("select", {
              "onUpdate:modelValue": d[3] || (d[3] = (x) => e.field.strategy = x)
            }, [...d[14] || (d[14] = [
              t("option", { value: "standard" }, "Standard", -1),
              t("option", { value: "deep" }, "Deep analysis", -1)
            ])], 512), [
              [Ge, e.field.strategy]
            ])
          ]),
          t("label", null, [
            d[16] || (d[16] = q("Chunks to read", -1)),
            t("span", ya, [
              z(t("input", {
                "onUpdate:modelValue": d[4] || (d[4] = (x) => e.field.chunks = x),
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
                onClick: d[5] || (d[5] = (x) => e.field.chunks--)
              }, "−", 8, ka),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Increase chunks to read",
                disabled: e.field.chunks >= 1e3 || e.readonly,
                onClick: d[6] || (d[6] = (x) => e.field.chunks++)
              }, "+", 8, $a)
            ]),
            d[17] || (d[17] = t("small", null, "Per search hint", -1))
          ])
        ]),
        e.field.strategy === "deep" && !e.deepEnabled ? (n(), o("p", xa, [
          f(p(A), { icon: "tabler:info-circle" }),
          d[18] || (d[18] = q("Deep analysis is off in the flow, so this field runs as standard.", -1))
        ])) : k("", !0),
        t("div", wa, [
          d[19] || (d[19] = t("span", { id: "within-label" }, "Search within", -1)),
          f($e, {
            modelValue: e.field.search_within,
            "onUpdate:modelValue": d[7] || (d[7] = (x) => e.field.search_within = x),
            "labelled-by": "within-label",
            options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
          }, null, 8, ["modelValue"]),
          t("small", null, r(e.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
        ]),
        e.field.search_within === "sections" && !e.mapEnabled ? (n(), o("p", Sa, [
          f(p(A), { icon: "tabler:alert-circle" }),
          d[20] || (d[20] = q("Turn on Map the document to read sections.", -1))
        ])) : k("", !0),
        t("label", null, [
          d[21] || (d[21] = q("Group", -1)),
          z(t("input", {
            "onUpdate:modelValue": d[8] || (d[8] = (x) => e.field.group = x),
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
          t("datalist", Va, [
            (n(!0), o(U, null, I(e.groups, (x) => (n(), o("option", {
              key: x,
              value: x
            }, null, 8, Ca))), 128))
          ]),
          d[22] || (d[22] = t("small", null, "Use dotted snake_case names. Values nest under this path.", -1))
        ]),
        d[26] || (d[26] = t("h4", null, "Checking it", -1)),
        t("label", null, [
          d[23] || (d[23] = q("Validation hints", -1)),
          z(t("textarea", {
            "onUpdate:modelValue": d[9] || (d[9] = (x) => e.field.validation_hints = x),
            rows: "2",
            maxlength: "4000",
            placeholder: "Rules the value must satisfy"
          }, null, 512), [
            [_, e.field.validation_hints]
          ])
        ]),
        t("div", Ea, [
          d[24] || (d[24] = t("span", null, [
            q("Evidence required"),
            t("small", null, "The value must cite a quote from the document.")
          ], -1)),
          f(Z, {
            modelValue: e.field.evidence_required,
            "onUpdate:modelValue": d[10] || (d[10] = (x) => e.field.evidence_required = x),
            label: "Evidence required",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : k("", !0),
      !e.readonly && (u.value || e.siblingNames) ? (n(), o("button", {
        key: 1,
        type: "button",
        class: "kx-btn kx-btn-danger kx-focus-halo",
        onClick: d[11] || (d[11] = (x) => i("remove"))
      }, r(u.value ? "Remove field" : "Remove property"), 1)) : k("", !0)
    ], 8, ga));
  }
}), Na = { class: "field-groups" }, Fa = {
  key: 0,
  class: "rows"
}, Ua = ["aria-label"], Ma = { class: "field-group-head" }, Aa = ["aria-label", "aria-expanded", "aria-controls", "onClick"], Ra = { class: "group-title" }, Ba = ["id"], La = { class: "group-title" }, Re = /* @__PURE__ */ W({
  __name: "FieldGroups",
  props: {
    node: {}
  },
  setup(e) {
    const s = M(/* @__PURE__ */ new Set()), l = pe();
    function i(m) {
      s.value.has(m) ? s.value.delete(m) : s.value.add(m);
    }
    const u = (m) => m.indices.length + m.children.reduce((h, d) => h + u(d), 0);
    return (m, h) => {
      const d = st("FieldGroups", !0);
      return n(), o("div", Na, [
        e.node.indices.length ? (n(), o("ul", Fa, [
          (n(!0), o(U, null, I(e.node.indices, (x) => (n(), o("li", { key: x }, [
            je(m.$slots, "default", { index: x })
          ]))), 128))
        ])) : k("", !0),
        (n(!0), o(U, null, I(e.node.children, (x, w) => (n(), o("section", {
          key: x.path,
          class: "field-group",
          "aria-label": `Group ${x.path}`
        }, [
          t("header", Ma, [
            t("button", {
              type: "button",
              class: "tree-toggle kx-iconbtn kx-focus-outline",
              "aria-label": `${s.value.has(x.path) ? "Expand" : "Collapse"} group ${x.path}`,
              "aria-expanded": !s.value.has(x.path),
              "aria-controls": `${p(l)}-${x.path}`,
              onClick: (E) => i(x.path)
            }, [
              f(p(A), {
                icon: s.value.has(x.path) ? "tabler:chevron-right" : "tabler:chevron-down"
              }, null, 8, ["icon"])
            ], 8, Aa),
            je(m.$slots, "header", {
              path: x.path,
              label: x.name,
              count: u(x),
              first: w === 0,
              last: w === e.node.children.length - 1
            }, () => [
              t("span", Ra, r(x.name), 1)
            ])
          ]),
          z(t("div", {
            id: `${p(l)}-${x.path}`,
            class: "group-content"
          }, [
            f(d, { node: x }, {
              default: me((E) => [
                je(m.$slots, "default", bt({ ref_for: !0 }, E))
              ]),
              header: me((E) => [
                je(m.$slots, "header", bt({ ref_for: !0 }, E), () => [
                  t("span", La, r(E.label), 1)
                ])
              ]),
              _: 3
            }, 8, ["node"])
          ], 8, Ba), [
            [Ke, !s.value.has(x.path)]
          ])
        ], 8, Ua))), 128))
      ]);
    };
  }
}), Oa = ["aria-label", "maxlength", "aria-invalid", "aria-describedby", "onKeydown"], Pa = ["aria-label", "title"], Ta = ["aria-label", "title"], Da = ["id"], Rt = /* @__PURE__ */ W({
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
    const l = e, i = s, u = M(l.initialValue), m = M(""), h = M(), d = pe();
    Ne(() => {
      h.value.focus(), h.value.select();
    });
    function x() {
      const w = u.value.trim();
      if (!w || !$l.test(w)) {
        m.value = "Use a dotted path of snake_case group names.";
        return;
      }
      if (w.length > l.maxLength) {
        m.value = "The group and its nested paths must fit within 320 characters.";
        return;
      }
      i("save", w);
    }
    return (w, E) => (n(), o("form", {
      class: "group-path-editor",
      onSubmit: ve(x, ["prevent"])
    }, [
      z(t("input", {
        ref_key: "input",
        ref: h,
        "onUpdate:modelValue": E[0] || (E[0] = (c) => u.value = c),
        "aria-label": e.inputLabel,
        maxlength: e.maxLength,
        "aria-invalid": !!m.value,
        "aria-describedby": m.value ? p(d) : void 0,
        "aria-required": "true",
        autocomplete: "off",
        spellcheck: "false",
        placeholder: "parties.borrower",
        onKeydown: [
          Ee(ve(x, ["prevent"]), ["enter"]),
          E[1] || (E[1] = Ee(ve((c) => i("cancel"), ["stop", "prevent"]), ["esc"]))
        ]
      }, null, 40, Oa), [
        [_, u.value]
      ]),
      t("button", {
        type: "submit",
        class: "kx-iconbtn kx-focus-outline",
        "aria-label": e.saveLabel,
        title: e.saveLabel
      }, [
        f(p(A), { icon: "tabler:check" })
      ], 8, Pa),
      t("button", {
        type: "button",
        class: "kx-iconbtn kx-focus-outline",
        "aria-label": e.cancelLabel,
        title: e.cancelLabel,
        onClick: E[2] || (E[2] = (c) => i("cancel"))
      }, [
        f(p(A), { icon: "tabler:x" })
      ], 8, Ta),
      m.value ? (n(), o("p", {
        key: 0,
        id: p(d),
        class: "field-error",
        role: "alert"
      }, r(m.value), 9, Da)) : k("", !0)
    ], 32));
  }
}), Ia = ["title"], ja = ["aria-label", "data-group-rename", "title"], za = ["aria-label"], Wa = {
  key: 2,
  class: "group-actions"
}, Ha = ["aria-label", "disabled"], Ga = ["aria-label", "aria-expanded", "aria-controls"], Ka = /* @__PURE__ */ W({
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
    const l = e, i = s, u = M(!1), m = M(!1), h = M(), d = M(), x = M(), w = pe(), E = F(() => [
      { label: "Move up", disabled: l.first, command: () => i("reorder", -1) },
      { label: "Move down", disabled: l.last, command: () => i("reorder", 1) },
      { separator: !0 },
      { label: "Delete group and its fields", command: () => i("remove") }
    ]);
    function c() {
      u.value = !0;
    }
    async function a() {
      u.value = !1, await Ce(), d.value.focus();
    }
    async function b(R) {
      const S = h.value.closest(".field-tree");
      u.value = !1, i("rename", R), await Ce(), S.querySelector(`[data-group-rename="${R}"]`).focus();
    }
    return (R, S) => (n(), o("div", {
      ref_key: "heading",
      ref: h,
      class: "group-heading"
    }, [
      u.value ? (n(), J(Rt, {
        key: 0,
        "initial-value": e.path,
        "input-label": `Group path for ${e.path}`,
        "save-label": "Save group name",
        "cancel-label": "Cancel group rename",
        "max-length": e.maxLength,
        onSave: b,
        onCancel: a
      }, null, 8, ["initial-value", "input-label", "max-length"])) : (n(), o(U, { key: 1 }, [
        e.readonly ? (n(), o("span", {
          key: 0,
          class: "group-title",
          title: e.path
        }, r(e.name), 9, Ia)) : (n(), o("button", {
          key: 1,
          ref_key: "renameButton",
          ref: d,
          type: "button",
          class: "group-title group-name-button kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Rename group ${e.path}`,
          "data-group-rename": e.path,
          title: e.path,
          onClick: c
        }, [
          t("span", null, r(e.name), 1),
          f(p(A), {
            icon: "tabler:pencil",
            "aria-hidden": "true"
          })
        ], 8, ja)),
        t("span", {
          class: "count group-count",
          "aria-label": `${e.count} fields`
        }, r(e.count), 9, za),
        e.readonly ? k("", !0) : (n(), o("div", Wa, [
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Add field to ${e.path}`,
            disabled: !e.canAdd,
            title: "Add field",
            onClick: S[0] || (S[0] = (N) => i("add"))
          }, [
            f(p(A), { icon: "tabler:plus" })
          ], 8, Ha),
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Actions for group ${e.path}`,
            "aria-haspopup": "menu",
            "aria-expanded": m.value,
            "aria-controls": p(w),
            onClick: S[1] || (S[1] = (N) => x.value.toggle(N))
          }, [
            f(p(A), { icon: "tabler:dots" })
          ], 8, Ga),
          f(p(Mt), {
            id: p(w),
            ref_key: "menu",
            ref: x,
            model: E.value,
            popup: "",
            "append-to": "self",
            onShow: S[2] || (S[2] = (N) => m.value = !0),
            onHide: S[3] || (S[3] = (N) => m.value = !1)
          }, null, 8, ["id", "model"])
        ]))
      ], 64))
    ], 512));
  }
}), Qa = ["aria-label", "aria-expanded"], Ja = {
  key: 1,
  class: "tree-indent"
}, Ya = ["aria-label", "aria-describedby", "aria-current"], Xa = { class: "row-copy" }, Za = { class: "row-name" }, _a = ["title"], en = ["id", "title"], tn = { class: "field-badges" }, ln = { class: "chip field-type" }, an = { class: "field-flags" }, nn = {
  key: 0,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Required",
  title: "Required"
}, sn = {
  key: 1,
  class: "chip field-flag primary",
  role: "img",
  "aria-label": "Deep analysis",
  title: "Deep analysis"
}, on = {
  key: 2,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Reads sections",
  title: "Reads sections"
}, un = {
  key: 3,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Evidence required",
  title: "Evidence required"
}, dn = {
  key: 2,
  class: "row-actions"
}, rn = ["aria-label", "disabled"], cn = ["aria-label", "disabled"], vn = ["aria-label", "aria-expanded", "aria-controls"], mn = {
  key: 0,
  class: "tree-children"
}, pn = { key: 0 }, fn = { key: 1 }, bn = ["aria-label", "disabled"], gn = /* @__PURE__ */ W({
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
    const l = e, i = s, u = pe(), m = pe(), h = M(), d = M(!1), x = F(() => [
      { label: "Move up", disabled: l.first, command: () => i("reorder", l.field, l.trail, -1) },
      { label: "Move down", disabled: l.last, command: () => i("reorder", l.field, l.trail, 1) }
    ]), w = M(!0);
    fe(() => l.selected, (S) => {
      const N = ie(l.field, l.trail);
      S !== N && S.startsWith(N + (l.trail.length ? "/" : "")) && (w.value = !0);
    });
    const E = F(() => l.trail.at(-1) !== "item"), c = F(() => E.value ? l.shape.name || "New field" : "Each item"), a = F(() => l.trail.length ? void 0 : l.shape), b = F(() => l.shape.type === "object" || l.shape.type === "list");
    function R(S) {
      S.key === "ArrowRight" && b.value && (w.value = !0, S.preventDefault(), S.stopPropagation()), S.key === "ArrowLeft" && b.value && (w.value = !1, S.preventDefault(), S.stopPropagation());
    }
    return (S, N) => {
      const K = st("ShapeTree", !0);
      return n(), o("div", {
        class: "shape-tree-node",
        onKeydown: R
      }, [
        t("div", {
          class: Q(["row-item", { active: e.selected === p(ie)(e.field, e.trail) }])
        }, [
          b.value ? (n(), o("button", {
            key: 0,
            class: "tree-toggle kx-iconbtn kx-focus-outline",
            type: "button",
            "aria-label": `${w.value ? "Collapse" : "Expand"} ${e.path}`,
            "aria-expanded": w.value,
            onClick: N[0] || (N[0] = (D) => w.value = !w.value)
          }, [
            f(p(A), {
              icon: w.value ? "tabler:chevron-down" : "tabler:chevron-right"
            }, null, 8, ["icon"])
          ], 8, Qa)) : (n(), o("span", Ja)),
          t("button", {
            type: "button",
            class: "row-main kx-focus-halo",
            "aria-label": `Edit ${e.path}`,
            "aria-describedby": p(u),
            "aria-current": e.selected === p(ie)(e.field, e.trail) ? "true" : void 0,
            onClick: N[1] || (N[1] = (D) => i("select", e.field, e.trail))
          }, [
            t("span", Xa, [
              t("span", Za, [
                f(p(A), {
                  icon: p(Jl)(e.shape.type),
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                t("span", {
                  class: "row-label",
                  title: c.value
                }, r(c.value), 9, _a),
                e.error ? (n(), J(p(A), {
                  key: 0,
                  icon: "tabler:alert-circle",
                  class: "row-warn",
                  "aria-label": e.error,
                  title: e.error
                }, null, 8, ["aria-label", "title"])) : k("", !0)
              ]),
              t("span", {
                id: p(u),
                class: Q(["row-desc", { missing: !e.shape.description }]),
                title: e.shape.description || void 0
              }, r(e.shape.description || "No description"), 11, en)
            ]),
            t("span", tn, [
              t("span", ln, r(e.shape.type), 1),
              t("span", an, [
                E.value && e.shape.required ? (n(), o("span", nn, [
                  f(p(A), {
                    icon: "tabler:asterisk",
                    "aria-hidden": "true"
                  })
                ])) : k("", !0),
                a.value?.strategy === "deep" ? (n(), o("span", sn, [
                  f(p(A), {
                    icon: "tabler:microscope",
                    "aria-hidden": "true"
                  })
                ])) : k("", !0),
                a.value?.search_within === "sections" ? (n(), o("span", on, [
                  f(p(A), {
                    icon: "tabler:layout-list",
                    "aria-hidden": "true"
                  })
                ])) : k("", !0),
                a.value?.evidence_required ? (n(), o("span", un, [
                  f(p(A), {
                    icon: "tabler:file-search",
                    "aria-hidden": "true"
                  })
                ])) : k("", !0)
              ])
            ])
          ], 8, Ya),
          !e.readonly && E.value ? (n(), o("span", dn, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} up`,
              disabled: e.first,
              onClick: N[2] || (N[2] = (D) => i("reorder", e.field, e.trail, -1))
            }, [
              f(p(A), { icon: "tabler:chevron-up" })
            ], 8, rn),
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} down`,
              disabled: e.last,
              onClick: N[3] || (N[3] = (D) => i("reorder", e.field, e.trail, 1))
            }, [
              f(p(A), { icon: "tabler:chevron-down" })
            ], 8, cn)
          ])) : k("", !0),
          !e.readonly && E.value ? (n(), o("div", {
            key: 3,
            class: "row-overflow",
            onKeydown: N[7] || (N[7] = ve(() => {
            }, ["stop"]))
          }, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Actions for ${e.path}`,
              "aria-haspopup": "menu",
              "aria-expanded": d.value,
              "aria-controls": p(m),
              onClick: N[4] || (N[4] = (D) => h.value.toggle(D))
            }, [
              f(p(A), { icon: "tabler:dots" })
            ], 8, vn),
            f(p(Mt), {
              id: p(m),
              ref_key: "menu",
              ref: h,
              model: x.value,
              popup: "",
              "append-to": "self",
              onShow: N[5] || (N[5] = (D) => d.value = !0),
              onHide: N[6] || (N[6] = (D) => d.value = !1)
            }, null, 8, ["id", "model"])
          ], 32)) : k("", !0)
        ], 2),
        b.value && w.value ? (n(), o("ul", mn, [
          (n(!0), o(U, null, I(e.shape.properties, (D, j) => (n(), o("li", { key: j }, [
            f(K, {
              shape: D,
              field: e.field,
              trail: [...e.trail, j],
              path: `${e.path}.${D.name || "New property"}`,
              selected: e.selected,
              readonly: e.readonly,
              first: j === 0,
              last: j === e.shape.properties.length - 1,
              onSelect: N[8] || (N[8] = (H, P) => i("select", H, P)),
              onAdd: N[9] || (N[9] = (H, P) => i("add", H, P)),
              onReorder: N[10] || (N[10] = (H, P, O) => i("reorder", H, P, O))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly", "first", "last"])
          ]))), 128)),
          e.shape.item ? (n(), o("li", pn, [
            f(K, {
              shape: e.shape.item,
              field: e.field,
              trail: [...e.trail, "item"],
              path: `${e.path}[]`,
              selected: e.selected,
              readonly: e.readonly,
              onSelect: N[11] || (N[11] = (D, j) => i("select", D, j)),
              onAdd: N[12] || (N[12] = (D, j) => i("add", D, j)),
              onReorder: N[13] || (N[13] = (D, j, H) => i("reorder", D, j, H))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly"])
          ])) : k("", !0),
          !e.readonly && e.shape.type === "object" && e.trail.length + 1 < p(Ae) ? (n(), o("li", fn, [
            t("button", {
              type: "button",
              class: "kx-btn kx-btn-ghost kx-focus-halo sm",
              "aria-label": `Add property to ${e.path}`,
              disabled: (e.shape.properties?.length ?? 0) >= 100,
              onClick: N[14] || (N[14] = (D) => i("add", e.field, e.trail))
            }, [
              f(p(A), { icon: "tabler:plus" }),
              N[15] || (N[15] = q("Add property", -1))
            ], 8, bn)
          ])) : k("", !0)
        ])) : k("", !0)
      ], 32);
    };
  }
}), hn = { class: "label-block" }, yn = {
  key: 0,
  class: "muted"
}, kn = ["config"], $n = {
  key: 2,
  class: "field-error",
  role: "alert"
}, xn = {
  key: 3,
  role: "status",
  class: "muted"
}, wn = /* @__PURE__ */ W({
  __name: "AgentPicker",
  props: {
    value: {},
    readonly: { type: Boolean }
  },
  emits: ["select"],
  setup(e, { emit: s }) {
    const l = s, i = M(!!customElements.get("wc-agent-picker")), u = M("");
    Ne(async () => {
      if (!i.value)
        try {
          await Ze("wc-agent-picker", { timeoutMs: 8e3 }), i.value = !0;
        } catch (h) {
          u.value = h instanceof Error ? h.message : String(h);
        }
    });
    function m(h) {
      if (h.composedPath()[0] !== h.currentTarget) return;
      const d = h.detail;
      l("select", d.agent_id);
    }
    return (h, d) => (n(), o("div", hn, [
      d[0] || (d[0] = t("span", null, "Scout agent", -1)),
      e.readonly ? (n(), o("p", yn, r(e.value || "Built-in scout"), 1)) : i.value ? (n(), o("wc-agent-picker", {
        key: 1,
        config: JSON.stringify({ agent_id: e.value || "" }),
        "aria-label": "Scout agent",
        placeholder: "Choose your agent…",
        onChange: m
      }, null, 40, kn)) : u.value ? (n(), o("p", $n, "Could not load agent picker: " + r(u.value), 1)) : (n(), o("span", xn, "Loading agents…")),
      d[1] || (d[1] = t("small", null, "Leave empty to use the built-in scout.", -1))
    ]));
  }
}), Sn = ["value", "capability", "aria-labelledby"], Vn = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, Cn = {
  key: 2,
  class: "dz-muted",
  role: "status"
}, ce = /* @__PURE__ */ W({
  __name: "ModelPicker",
  props: {
    value: {},
    capability: {},
    labelledBy: {}
  },
  emits: ["select"],
  setup(e, { emit: s }) {
    const l = s, i = M(!!customElements.get("wc-model-picker")), u = M("");
    Ne(async () => {
      if (!i.value)
        try {
          await Ze("wc-model-picker", { timeoutMs: 8e3 }), i.value = !0;
        } catch (h) {
          u.value = h instanceof Error ? h.message : String(h);
        }
    });
    function m(h) {
      const d = h.detail;
      typeof d == "string" && l("select", d);
    }
    return (h, d) => i.value ? (n(), o("wc-model-picker", {
      key: 0,
      value: e.value,
      capability: e.capability,
      "aria-labelledby": e.labelledBy,
      onSelect: m
    }, null, 40, Sn)) : u.value ? (n(), o("p", Vn, "Could not load model picker: " + r(u.value), 1)) : (n(), o("span", Cn, "Loading models…"));
  }
}), En = { class: "slider" }, qn = { class: "slider-head" }, Nn = { class: "slider-value" }, Fn = ["aria-label", "aria-valuetext", "disabled"], Un = {
  key: 0,
  class: "slider-hints"
}, Mn = { key: 1 }, Se = 1e3, le = /* @__PURE__ */ W({
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
    const s = e, l = Le(e, "modelValue"), i = F(() => s.percent ? `${Math.round(l.value * 100)}%` : `${l.value.toLocaleString()}${s.unit ? ` ${s.unit}` : ""}`), u = (d) => s.log ? Math.log(d / s.min) / Math.log(s.max / s.min) * Se : (d - s.min) / (s.max - s.min) * Se;
    function m(d) {
      const x = s.log ? s.min * Math.pow(s.max / s.min, d / Se) : s.min + (s.max - s.min) * d / Se, w = Math.round(x / s.step) * s.step;
      return Math.min(s.max, Math.max(s.min, Number(w.toFixed(4))));
    }
    const h = F({ get: () => Math.round(u(l.value)), set: (d) => {
      l.value = m(d);
    } });
    return (d, x) => (n(), o("div", En, [
      t("div", qn, [
        t("span", null, r(e.label), 1),
        t("output", Nn, r(i.value), 1)
      ]),
      z(t("input", {
        "onUpdate:modelValue": x[0] || (x[0] = (w) => h.value = w),
        type: "range",
        min: "0",
        max: Se,
        step: "1",
        "aria-label": e.label,
        "aria-valuetext": i.value,
        disabled: e.disabled,
        style: qe({ "--fill": `${h.value / Se * 100}%` })
      }, null, 12, Fn), [
        [
          _,
          h.value,
          void 0,
          { number: !0 }
        ]
      ]),
      e.hints ? (n(), o("div", Un, [
        t("span", null, r(e.hints[0]), 1),
        t("span", null, r(e.hints[1]), 1)
      ])) : k("", !0),
      e.note ? (n(), o("small", Mn, r(e.note), 1)) : k("", !0)
    ]));
  }
}), An = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, Rn = { class: "fd-track" }, Bn = { class: "fd-node" }, Ln = { class: "fd-dots" }, On = { class: "fd-more" }, Pn = { class: "fd-node goal" }, Tn = /* @__PURE__ */ W({
  __name: "ScoutDiagram",
  props: {
    rounds: {},
    confidence: {},
    extra: {}
  },
  setup(e) {
    const s = e;
    return (l, i) => (n(), o("figure", An, [
      t("div", Rn, [
        i[2] || (i[2] = t("span", { class: "fd-node solid" }, "Pass", -1)),
        (n(!0), o(U, null, I(Math.min(s.rounds, 8), (u) => (n(), o(U, { key: u }, [
          i[0] || (i[0] = t("span", { class: "fd-link" }, null, -1)),
          t("span", Bn, [
            t("span", null, "R" + r(u), 1),
            t("span", Ln, [
              (n(!0), o(U, null, I(Math.min(s.extra, 6), (m) => (n(), o("i", { key: m }))), 128))
            ])
          ])
        ], 64))), 128)),
        s.rounds > 8 ? (n(), o(U, { key: 0 }, [
          i[1] || (i[1] = t("span", { class: "fd-link" }, null, -1)),
          t("span", On, "+" + r(s.rounds - 8), 1)
        ], 64)) : k("", !0),
        i[3] || (i[3] = t("span", { class: "fd-link" }, null, -1)),
        t("span", Pn, "≥ " + r(Math.round(s.confidence * 100)) + "%", 1)
      ]),
      t("figcaption", null, r(s.rounds ? `One pass, then up to ${s.rounds} rounds with up to ${s.extra} new queries each, stopping as soon as confidence reaches ${Math.round(s.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
    ]));
  }
}), Dn = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, In = { class: "fd-grid" }, jn = { class: "fd-node solid" }, zn = { class: "fd-node" }, Wn = { class: "fd-node" }, Hn = { class: "fd-node goal" }, Gn = /* @__PURE__ */ W({
  __name: "DeepDiagram",
  props: {
    fields: {},
    parallel: {},
    queries: {},
    perQuery: {},
    cap: {}
  },
  setup(e) {
    const s = e, l = F(() => Math.min(s.queries * s.perQuery, s.cap));
    return (i, u) => (n(), o("figure", Dn, [
      t("div", In, [
        t("span", jn, [
          t("b", null, r(e.fields), 1),
          q(" field" + r(e.fields === 1 ? "" : "s"), 1),
          t("small", null, r(e.parallel) + " at a time", 1)
        ]),
        t("span", zn, [
          t("b", null, r(e.queries), 1),
          u[0] || (u[0] = q(" queries", -1)),
          u[1] || (u[1] = t("small", null, "per field", -1))
        ]),
        t("span", Wn, [
          t("b", null, r(e.perQuery), 1),
          u[2] || (u[2] = q(" chunks", -1)),
          u[3] || (u[3] = t("small", null, "per query", -1))
        ]),
        t("span", Hn, [
          t("b", null, r(l.value), 1),
          u[4] || (u[4] = q(" chunks", -1)),
          t("small", null, r(e.queries * e.perQuery > e.cap ? `capped at ${e.cap}` : "read per field"), 1)
        ])
      ]),
      t("figcaption", null, "Each deep field gets its own queries; up to " + r(l.value) + " chunks are read for it before analysis.", 1)
    ]));
  }
}), Kn = ["disabled"], Qn = { class: "muted" }, Jn = { class: "toggle-row" }, Yn = { class: "label-block" }, Xn = { class: "toggle-row" }, Zn = {
  id: "model-map",
  class: "model-role"
}, _n = {
  key: 0,
  class: "chips"
}, es = {
  key: 1,
  class: "muted"
}, ts = { class: "toggle-row" }, ls = { class: "grid" }, as = ["onUpdate:modelValue"], ns = ["onUpdate:modelValue"], ss = ["onUpdate:modelValue"], os = ["onClick"], is = {
  key: 0,
  class: "muted"
}, us = { class: "toggle-row" }, ds = { class: "label-block" }, rs = {
  id: "model-scout",
  class: "model-role"
}, cs = {
  key: 3,
  class: "muted"
}, vs = {
  key: 4,
  class: "toggle-row"
}, ms = { class: "toggle-row" }, ps = { class: "toggle-row" }, fs = { class: "label-block" }, bs = {
  id: "model-deep",
  class: "model-role"
}, gs = {
  id: "model-deep-query",
  class: "model-role"
}, hs = {
  id: "model-extract",
  class: "model-role"
}, ys = { class: "output-list" }, ks = { class: "chip" }, $s = {
  key: 0,
  class: "muted"
}, xs = { class: "toggle-row" }, ws = { class: "toggle-row" }, Ss = { class: "toggle-row" }, Vs = { class: "toggle-row" }, Cs = {
  id: "model-verify",
  class: "model-role"
}, Es = /* @__PURE__ */ W({
  __name: "StepInspector",
  props: {
    stage: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const s = e, l = F(() => s.config.stages), i = (c) => Vl(s.stage, c), u = xl(), m = F(() => s.config.fields.filter((c) => c.strategy === "deep").length), h = F(() => s.config.fields.filter((c) => c.search_within === "sections").map((c) => c.name || "New field")), d = F(() => Et(s.config));
    function x(c) {
      l.value.verify.check_support = c, c || (l.value.verify.check_completeness = !1);
    }
    function w(c) {
      c ? l.value.scout.agent_id = c : delete l.value.scout.agent_id;
    }
    function E(c, a) {
      const b = l.value.scout.tools.filter((R) => R !== c);
      l.value.scout.tools = a ? [...b, c] : b;
    }
    return (c, a) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", Qn, r(p(wl)[e.stage]), 1),
      e.stage === "map" ? (n(), o(U, { key: 0 }, [
        t("div", Jn, [
          a[33] || (a[33] = t("span", null, "Stage enabled", -1)),
          f(Z, {
            modelValue: l.value.map.enabled,
            "onUpdate:modelValue": a[0] || (a[0] = (b) => l.value.map.enabled = b),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Yn, [
          a[34] || (a[34] = t("span", { id: "outline-label" }, "Outline", -1)),
          f($e, {
            modelValue: l.value.map.outline,
            "onUpdate:modelValue": a[1] || (a[1] = (b) => l.value.map.outline = b),
            "labelled-by": "outline-label",
            options: [{ value: "find_or_build", label: "Use contents first" }, { value: "build", label: "Always build" }]
          }, null, 8, ["modelValue"]),
          a[35] || (a[35] = t("small", null, "The document's own headings are used when it has them; otherwise the model builds an outline.", -1))
        ]),
        t("div", Xn, [
          a[36] || (a[36] = t("span", null, [
            q("Section summaries"),
            t("small", null, "A short summary per section helps pick the right sections in long documents.")
          ], -1)),
          f(Z, {
            modelValue: l.value.map.section_summaries,
            "onUpdate:modelValue": a[2] || (a[2] = (b) => l.value.map.section_summaries = b),
            label: "Section summaries",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        a[38] || (a[38] = t("h4", null, "Models", -1)),
        t("div", Zn, [
          a[37] || (a[37] = t("span", null, "Outliner", -1)),
          f(ce, {
            value: l.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: a[3] || (a[3] = (b) => l.value.map.model = b)
          }, null, 8, ["value"])
        ]),
        a[39] || (a[39] = t("h4", null, "Fields that read sections", -1)),
        h.value.length ? (n(), o("p", _n, [
          (n(!0), o(U, null, I(h.value, (b) => (n(), o("span", {
            key: b,
            class: "chip primary"
          }, r(b), 1))), 128))
        ])) : (n(), o("p", es, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : k("", !0),
      e.stage === "prefetch" ? (n(), o(U, { key: 1 }, [
        t("div", ts, [
          a[40] || (a[40] = t("span", null, "Stage enabled", -1)),
          f(Z, {
            modelValue: l.value.prefetch.enabled,
            "onUpdate:modelValue": a[4] || (a[4] = (b) => l.value.prefetch.enabled = b),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        a[44] || (a[44] = t("h4", null, "Queries", -1)),
        (n(!0), o(U, null, I(l.value.prefetch.queries, (b, R) => (n(), o("div", {
          key: R,
          class: "query-row"
        }, [
          t("div", ls, [
            t("label", null, [
              a[41] || (a[41] = q("Name", -1)),
              z(t("input", {
                "onUpdate:modelValue": (S) => b.name = S,
                placeholder: "Parties"
              }, null, 8, as), [
                [_, b.name]
              ])
            ]),
            t("label", null, [
              a[42] || (a[42] = q("Chunks", -1)),
              z(t("input", {
                "onUpdate:modelValue": (S) => b.chunks = S,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, ns), [
                [
                  _,
                  b.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          t("label", null, [
            a[43] || (a[43] = q("Query", -1)),
            z(t("textarea", {
              "onUpdate:modelValue": (S) => b.query = S,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, ss), [
              [_, b.query]
            ])
          ]),
          e.readonly ? k("", !0) : (n(), o("button", {
            key: 0,
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo sm",
            onClick: (S) => l.value.prefetch.queries.splice(R, 1)
          }, "Remove query", 8, os))
        ]))), 128)),
        l.value.prefetch.queries.length ? k("", !0) : (n(), o("p", is, "No fixed queries. Field search hints still run.")),
        e.readonly ? k("", !0) : (n(), o("button", {
          key: 1,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          onClick: a[5] || (a[5] = (b) => l.value.prefetch.queries.push(p(Sl)()))
        }, "Add query"))
      ], 64)) : k("", !0),
      e.stage === "scout" ? (n(), o(U, { key: 2 }, [
        t("div", us, [
          a[45] || (a[45] = t("span", null, "Stage enabled", -1)),
          f(Z, {
            modelValue: l.value.scout.enabled,
            "onUpdate:modelValue": a[6] || (a[6] = (b) => l.value.scout.enabled = b),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", ds, [
          a[46] || (a[46] = t("span", { id: "mode-label" }, "Mode", -1)),
          f($e, {
            modelValue: l.value.scout.mode,
            "onUpdate:modelValue": a[7] || (a[7] = (b) => l.value.scout.mode = b),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          t("small", null, r(l.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        l.value.scout.mode === "agent" ? (n(), J(wn, {
          key: 0,
          value: l.value.scout.agent_id,
          readonly: e.readonly,
          onSelect: w
        }, null, 8, ["value", "readonly"])) : k("", !0),
        l.value.scout.mode === "loop" ? (n(), J(Tn, {
          key: 1,
          rounds: l.value.scout.max_rounds,
          confidence: l.value.scout.target_confidence,
          extra: l.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"])) : k("", !0),
        a[51] || (a[51] = t("h4", null, "Models", -1)),
        t("div", rs, [
          a[47] || (a[47] = t("span", null, "Scout", -1)),
          f(ce, {
            value: l.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: a[8] || (a[8] = (b) => l.value.scout.model = b)
          }, null, 8, ["value"])
        ]),
        a[52] || (a[52] = t("h4", null, "Loop", -1)),
        f(le, {
          modelValue: l.value.scout.max_rounds,
          "onUpdate:modelValue": a[9] || (a[9] = (b) => l.value.scout.max_rounds = b),
          label: l.value.scout.mode === "agent" ? "Rounds" : "Follow-up rounds",
          min: i("max_rounds").min,
          max: i("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        l.value.scout.mode === "loop" ? (n(), J(le, {
          key: 2,
          modelValue: l.value.scout.target_confidence,
          "onUpdate:modelValue": a[10] || (a[10] = (b) => l.value.scout.target_confidence = b),
          label: "Stop at confidence",
          min: i("target_confidence").min,
          max: i("target_confidence").max,
          step: 0.05,
          percent: "",
          hints: ["Stop early", "Keep looking"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])) : k("", !0),
        f(le, {
          modelValue: l.value.scout.max_extra_queries,
          "onUpdate:modelValue": a[11] || (a[11] = (b) => l.value.scout.max_extra_queries = b),
          label: l.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: i("max_extra_queries").min,
          max: i("max_extra_queries").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.scout.max_tokens,
          "onUpdate:modelValue": a[12] || (a[12] = (b) => l.value.scout.max_tokens = b),
          label: "Scout output limit",
          min: i("max_tokens").min,
          max: i("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        l.value.scout.mode === "agent" ? (n(), o("p", cs, "Tool budget: " + r(l.value.scout.max_rounds * l.value.scout.max_extra_queries) + " calls.", 1)) : k("", !0),
        l.value.scout.mode === "loop" ? (n(), o("div", vs, [
          a[48] || (a[48] = t("span", null, [
            q("Drop noisy chunks"),
            t("small", null, "Chunks no field needs leave the evidence pool; chunks cited for a field always stay.")
          ], -1)),
          f(Z, {
            modelValue: l.value.scout.drop_noise,
            "onUpdate:modelValue": a[13] || (a[13] = (b) => l.value.scout.drop_noise = b),
            label: "Drop noisy chunks",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])) : k("", !0),
        t("div", ms, [
          a[49] || (a[49] = t("span", null, [
            q("Share scout notes with extraction"),
            t("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          f(Z, {
            modelValue: l.value.scout.share_notes,
            "onUpdate:modelValue": a[14] || (a[14] = (b) => l.value.scout.share_notes = b),
            label: "Share scout notes with extraction",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l.value.scout.mode === "agent" ? (n(), o(U, { key: 5 }, [
          a[50] || (a[50] = t("h4", null, "Agent tools", -1)),
          (n(!0), o(U, null, I(p(u), (b) => (n(), o("div", {
            key: b,
            class: "toggle-row"
          }, [
            t("span", null, r(p(lt)(b)), 1),
            f(Z, {
              "model-value": l.value.scout.tools.includes(b),
              label: p(lt)(b),
              disabled: e.readonly,
              "onUpdate:modelValue": (R) => E(b, R)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : k("", !0)
      ], 64)) : k("", !0),
      e.stage === "deep" ? (n(), o(U, { key: 3 }, [
        t("div", ps, [
          a[53] || (a[53] = t("span", null, "Stage enabled", -1)),
          f(Z, {
            modelValue: l.value.deep.enabled,
            "onUpdate:modelValue": a[15] || (a[15] = (b) => l.value.deep.enabled = b),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        f(Gn, {
          fields: m.value,
          parallel: l.value.deep.parallel_fields,
          queries: l.value.deep.max_queries,
          "per-query": l.value.deep.chunks_per_query,
          cap: l.value.deep.chunk_cap
        }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"]),
        t("div", fs, [
          a[54] || (a[54] = t("span", { id: "read-label" }, "Reads", -1)),
          f($e, {
            modelValue: l.value.deep.read,
            "onUpdate:modelValue": a[16] || (a[16] = (b) => l.value.deep.read = b),
            "labelled-by": "read-label",
            options: [{ value: "chunks", label: "Retrieved chunks" }, { value: "sections", label: "Whole sections" }]
          }, null, 8, ["modelValue"]),
          a[55] || (a[55] = t("small", null, "Whole sections suit clauses that span many passages; long sections fall back to chunks.", -1))
        ]),
        a[58] || (a[58] = t("h4", null, "Models", -1)),
        t("div", bs, [
          a[56] || (a[56] = t("span", null, "Analysis", -1)),
          f(ce, {
            value: l.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: a[17] || (a[17] = (b) => l.value.deep.model = b)
          }, null, 8, ["value"])
        ]),
        t("div", gs, [
          a[57] || (a[57] = t("span", null, "Query writer", -1)),
          f(ce, {
            value: l.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: a[18] || (a[18] = (b) => l.value.deep.query_model = b)
          }, null, 8, ["value"])
        ]),
        a[59] || (a[59] = t("h4", null, "Reach", -1)),
        f(le, {
          modelValue: l.value.deep.parallel_fields,
          "onUpdate:modelValue": a[19] || (a[19] = (b) => l.value.deep.parallel_fields = b),
          label: "Fields at a time",
          min: i("parallel_fields").min,
          max: i("parallel_fields").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.deep.max_queries,
          "onUpdate:modelValue": a[20] || (a[20] = (b) => l.value.deep.max_queries = b),
          label: "Queries per field",
          min: i("max_queries").min,
          max: i("max_queries").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.deep.chunks_per_query,
          "onUpdate:modelValue": a[21] || (a[21] = (b) => l.value.deep.chunks_per_query = b),
          label: "Chunks per query",
          min: i("chunks_per_query").min,
          max: i("chunks_per_query").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.deep.chunk_cap,
          "onUpdate:modelValue": a[22] || (a[22] = (b) => l.value.deep.chunk_cap = b),
          label: "Chunk cap per field",
          min: i("chunk_cap").min,
          max: i("chunk_cap").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.deep.min_similarity,
          "onUpdate:modelValue": a[23] || (a[23] = (b) => l.value.deep.min_similarity = b),
          label: "Minimum similarity",
          min: i("min_similarity").min,
          max: i("min_similarity").max,
          step: 0.05,
          percent: "",
          hints: ["Loose", "Strict"],
          note: "Chunks less similar than this are skipped.",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        a[60] || (a[60] = t("h4", null, "Temperature", -1)),
        f(le, {
          modelValue: l.value.deep.query_temperature,
          "onUpdate:modelValue": a[24] || (a[24] = (b) => l.value.deep.query_temperature = b),
          label: "Query writing",
          min: i("query_temperature").min,
          max: i("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.deep.analysis_temperature,
          "onUpdate:modelValue": a[25] || (a[25] = (b) => l.value.deep.analysis_temperature = b),
          label: "Analysis",
          min: i("analysis_temperature").min,
          max: i("analysis_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : k("", !0),
      e.stage === "extract" ? (n(), o(U, { key: 4 }, [
        a[62] || (a[62] = t("h4", null, "Models", -1)),
        t("div", hs, [
          a[61] || (a[61] = t("span", null, "Extraction", -1)),
          f(ce, {
            value: l.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: a[26] || (a[26] = (b) => l.value.extract.model = b)
          }, null, 8, ["value"])
        ]),
        a[63] || (a[63] = t("h4", null, "Field groups", -1)),
        t("ul", ys, [
          (n(!0), o(U, null, I(d.value, (b) => (n(), o("li", {
            key: b.name
          }, [
            t("span", null, r(b.name), 1),
            t("span", ks, r(b.fields.length) + " field" + r(b.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        d.value.length ? k("", !0) : (n(), o("p", $s, "No fields yet.")),
        f(le, {
          modelValue: l.value.extract.max_fields_per_call,
          "onUpdate:modelValue": a[27] || (a[27] = (b) => l.value.extract.max_fields_per_call = b),
          label: "Fields per call",
          min: i("max_fields_per_call").min,
          max: i("max_fields_per_call").max,
          disabled: e.readonly,
          note: `${p(yt)(e.config)} extraction call${p(yt)(e.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        f(le, {
          modelValue: l.value.extract.max_output_tokens,
          "onUpdate:modelValue": a[28] || (a[28] = (b) => l.value.extract.max_output_tokens = b),
          label: "Output limit",
          min: i("max_output_tokens").min,
          max: i("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : k("", !0),
      e.stage === "verify" ? (n(), o(U, { key: 5 }, [
        t("div", xs, [
          a[64] || (a[64] = t("span", null, "Stage enabled", -1)),
          f(Z, {
            modelValue: l.value.verify.enabled,
            "onUpdate:modelValue": a[29] || (a[29] = (b) => l.value.verify.enabled = b),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", ws, [
          a[65] || (a[65] = t("span", null, [
            q("Quotes exist"),
            t("small", null, "Each quote is matched against the document text. No model call.")
          ], -1)),
          f(Z, {
            modelValue: l.value.verify.check_quotes,
            "onUpdate:modelValue": a[30] || (a[30] = (b) => l.value.verify.check_quotes = b),
            label: "Quotes exist",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Ss, [
          a[66] || (a[66] = t("span", null, [
            q("Quotes support values"),
            t("small", null, "A model confirms each quote supports its value.")
          ], -1)),
          f(Z, {
            "model-value": l.value.verify.check_support,
            "onUpdate:modelValue": x,
            label: "Quotes support values",
            disabled: e.readonly
          }, null, 8, ["model-value", "disabled"])
        ]),
        l.value.verify.check_support ? (n(), o(U, { key: 0 }, [
          t("div", Vs, [
            a[67] || (a[67] = t("span", null, [
              q("Check completeness"),
              t("small", null, "Check the requested text and lists against additional source passages. Adds input tokens; completeness can remain unknown.")
            ], -1)),
            f(Z, {
              "model-value": l.value.verify.check_completeness === !0,
              "onUpdate:modelValue": a[31] || (a[31] = (b) => l.value.verify.check_completeness = b),
              label: "Check completeness",
              disabled: e.readonly
            }, null, 8, ["model-value", "disabled"])
          ]),
          a[69] || (a[69] = t("h4", null, "Models", -1)),
          t("div", Cs, [
            a[68] || (a[68] = t("span", null, "Checker", -1)),
            f(ce, {
              value: l.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: a[32] || (a[32] = (b) => l.value.verify.model = b)
            }, null, 8, ["value"])
          ])
        ], 64)) : k("", !0)
      ], 64)) : k("", !0)
    ], 8, Kn));
  }
}), qs = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, Ns = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, Fs = ["x", "y", "width"], Us = ["x", "width"], Ms = /* @__PURE__ */ W({
  __name: "ChunkDiagram",
  props: {
    size: {},
    overlap: {}
  },
  setup(e) {
    const s = e, l = F(() => Math.min(0.9, Math.max(0, s.overlap / s.size))), i = F(() => {
      const u = 100 / (3 - 2 * l.value);
      return [0, 1, 2].map((m) => ({ x: m * u * (1 - l.value), w: u }));
    });
    return (u, m) => (n(), o("figure", qs, [
      (n(), o("svg", Ns, [
        (n(!0), o(U, null, I(i.value, (h, d) => (n(), o("rect", {
          key: d,
          x: h.x,
          y: d % 2 ? 14 : 4,
          width: h.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, Fs))), 128)),
        (n(), o(U, null, I([1, 2], (h) => t("rect", {
          key: "o" + h,
          x: i.value[h].x,
          y: 4,
          width: i.value[h - 1].x + i.value[h - 1].w - i.value[h].x,
          height: "24",
          class: "shared"
        }, null, 8, Us)), 64))
      ])),
      t("figcaption", null, r(e.size.toLocaleString()) + " tokens per chunk · " + r(e.overlap.toLocaleString()) + " shared with the next (" + r(Math.round(l.value * 100)) + "%)", 1)
    ]));
  }
}), As = ["disabled"], Rs = { class: "muted" }, Bs = { class: "toggle-row" }, Ls = { class: "toggle-row" }, Os = { class: "label-block" }, Ps = {
  key: 0,
  id: "context-model",
  class: "model-role"
}, Ts = { class: "label-block" }, Ds = {
  id: "embedding-model",
  class: "model-role"
}, Is = { class: "toggle-row" }, js = {
  key: 1,
  id: "highlighter-model",
  class: "model-role"
}, zs = /* @__PURE__ */ W({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const s = e, l = F(() => s.config.retrieval), i = F({ get: () => s.config.retention ?? "", set: (E) => {
      E.trim() ? s.config.retention = E.trim() : delete s.config.retention;
    } }), u = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], m = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], h = et("chunk_size"), d = et("overlap"), x = et("section_budget"), w = F(() => Math.min(d.max, l.value.chunk_size - 50));
    return (E, c) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", Rs, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + r(e.retention) + ".", 1),
      t("label", null, [
        c[12] || (c[12] = q("Retention window", -1)),
        z(t("input", {
          "onUpdate:modelValue": c[0] || (c[0] = (a) => i.value = a),
          "aria-label": "Retention window",
          placeholder: "Global setting"
        }, null, 512), [
          [_, i.value]
        ]),
        c[13] || (c[13] = t("small", null, "Duration for new processed documents and runs, for example 24h. Leave empty to use the global Docscout setting. Existing records keep their expiry.", -1))
      ]),
      c[22] || (c[22] = t("h4", null, "Chunks", -1)),
      f(Ms, {
        size: l.value.chunk_size,
        overlap: l.value.overlap
      }, null, 8, ["size", "overlap"]),
      f(le, {
        modelValue: l.value.chunk_size,
        "onUpdate:modelValue": c[1] || (c[1] = (a) => l.value.chunk_size = a),
        label: "Chunk size",
        min: p(h).min,
        max: p(h).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      f(le, {
        modelValue: l.value.overlap,
        "onUpdate:modelValue": c[2] || (c[2] = (a) => l.value.overlap = a),
        label: "Overlap",
        min: p(d).min,
        max: w.value,
        step: 10,
        unit: "tokens",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      t("div", Bs, [
        c[14] || (c[14] = t("span", null, [
          q("Split by headings"),
          t("small", null, "A chunk never crosses a heading.")
        ], -1)),
        f(Z, {
          modelValue: l.value.split_headings,
          "onUpdate:modelValue": c[3] || (c[3] = (a) => l.value.split_headings = a),
          label: "Split by headings",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t("div", Ls, [
        c[15] || (c[15] = t("span", null, [
          q("Keep tables whole"),
          t("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        f(Z, {
          modelValue: l.value.keep_tables,
          "onUpdate:modelValue": c[4] || (c[4] = (a) => l.value.keep_tables = a),
          label: "Keep tables whole",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      f(le, {
        modelValue: l.value.section_budget,
        "onUpdate:modelValue": c[5] || (c[5] = (a) => l.value.section_budget = a),
        label: "Section budget",
        min: p(x).min,
        max: p(x).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      c[23] || (c[23] = t("h4", null, "Context", -1)),
      t("div", Os, [
        c[16] || (c[16] = t("span", { id: "context-label" }, "Chunk context", -1)),
        f($e, {
          modelValue: l.value.context,
          "onUpdate:modelValue": c[6] || (c[6] = (a) => l.value.context = a),
          "labelled-by": "context-label",
          options: m
        }, null, 8, ["modelValue"]),
        t("small", null, r(m.find((a) => a.value === l.value.context)?.note), 1)
      ]),
      l.value.context === "generated" ? (n(), o("div", Ps, [
        c[17] || (c[17] = t("span", null, "Context writer", -1)),
        f(ce, {
          value: l.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: c[7] || (c[7] = (a) => l.value.context_model = a)
        }, null, 8, ["value"])
      ])) : k("", !0),
      c[24] || (c[24] = t("h4", null, "Search", -1)),
      t("div", Ts, [
        c[18] || (c[18] = t("span", { id: "mode-label" }, "Search mode", -1)),
        f($e, {
          modelValue: l.value.search_mode,
          "onUpdate:modelValue": c[8] || (c[8] = (a) => l.value.search_mode = a),
          "labelled-by": "mode-label",
          options: u
        }, null, 8, ["modelValue"]),
        t("small", null, r(u.find((a) => a.value === l.value.search_mode)?.note), 1)
      ]),
      c[25] || (c[25] = t("h4", null, "Models", -1)),
      t("div", Ds, [
        c[19] || (c[19] = t("span", null, "Embedding", -1)),
        f(ce, {
          value: l.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: c[9] || (c[9] = (a) => l.value.embedding_model = a)
        }, null, 8, ["value"])
      ]),
      t("div", Is, [
        c[20] || (c[20] = t("span", null, [
          q("Highlighter"),
          t("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        f(Z, {
          modelValue: l.value.highlighter,
          "onUpdate:modelValue": c[10] || (c[10] = (a) => l.value.highlighter = a),
          label: "Highlighter",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      l.value.highlighter ? (n(), o("div", js, [
        c[21] || (c[21] = t("span", null, "Highlighter", -1)),
        f(ce, {
          value: l.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: c[11] || (c[11] = (a) => l.value.highlighter_model = a)
        }, null, 8, ["value"])
      ])) : k("", !0)
    ], 8, As));
  }
}), Ws = ["inert"], Hs = { class: "canvas-inner" }, Gs = {
  class: "block fields-block",
  "aria-labelledby": "fields-head"
}, Ks = { class: "block-head" }, Qs = ["aria-expanded"], Js = { class: "count" }, Ys = {
  key: 0,
  class: "block-peek"
}, Xs = {
  key: 1,
  class: "field-add-actions push"
}, Zs = ["aria-expanded", "aria-controls", "disabled"], _s = ["disabled"], eo = {
  id: "fields-body",
  class: "block-body"
}, to = {
  key: 0,
  class: "block-empty"
}, lo = { class: "field-tree" }, ao = ["id"], no = {
  class: "tree-indent",
  "aria-hidden": "true"
}, so = {
  class: "shape-preview",
  open: ""
}, oo = { class: "kx-focus-outline" }, io = {
  key: 0,
  class: "field-error",
  role: "alert"
}, uo = {
  key: 1,
  class: "preview-grid"
}, ro = { "aria-label": "Output shape" }, co = { "aria-label": "Example output" }, vo = {
  class: "block",
  "aria-labelledby": "flow-head"
}, mo = { class: "block-head" }, po = ["aria-expanded"], fo = { class: "count" }, bo = {
  key: 0,
  class: "block-peek"
}, go = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, ho = { class: "node-icon" }, yo = { class: "node-main" }, ko = { class: "node-summary" }, $o = { class: "node-side" }, xo = { class: "chip model" }, wo = { class: "branches" }, So = { class: "branch" }, Vo = { class: "branch" }, Co = { class: "node-icon" }, Eo = { class: "node-main" }, qo = { class: "node-summary" }, No = ["aria-labelledby", "role", "aria-modal"], Fo = ["aria-valuenow"], Uo = { class: "side-panel-head" }, Mo = { class: "side-panel-icon" }, Ao = ["id"], Ro = ["aria-label", "title"], Bo = { class: "node-breadcrumb mono" }, Lo = {
  key: 0,
  class: "move-node",
  "aria-label": "Move node"
}, Oo = {
  key: 0,
  value: ""
}, Po = {
  key: 1,
  value: "",
  disabled: ""
}, To = ["value"], Do = ["disabled"], Io = ["disabled"], jo = {
  key: 4,
  class: "inspector-form"
}, zo = { class: "output-list" }, Wo = { class: "mono" }, Ho = { class: "chip" }, Go = { class: "rail-label" }, tt = 400, We = 320, Ko = /* @__PURE__ */ W({
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
    const s = e, l = Le(e, "title"), i = Le(e, "description"), u = M({ kind: "document" });
    function m(y, v) {
      try {
        const C = localStorage.getItem(`docscout.${y}`);
        return C === null ? v : C === "1";
      } catch {
        return v;
      }
    }
    function h(y, v) {
      try {
        localStorage.setItem(`docscout.${y}`, v ? "1" : "0");
      } catch {
      }
    }
    const d = M(m("panel", !0)), x = M(m("fields", !0)), w = M(m("flow", !0));
    function E() {
      try {
        const y = Number(localStorage.getItem("docscout.panelWidth"));
        return y >= We ? y : tt;
      } catch {
        return tt;
      }
    }
    const c = M(E()), a = () => {
      const y = O.value?.clientWidth;
      return y ? Math.max(We, y - 420) : Number.POSITIVE_INFINITY;
    };
    function b(y, v = !0) {
      if (c.value = Math.round(Math.min(a(), Math.max(We, y))), v)
        try {
          localStorage.setItem("docscout.panelWidth", String(c.value));
        } catch {
        }
    }
    const R = M(!1);
    function S(y) {
      const v = y.currentTarget, C = y.clientX, Y = c.value;
      v.setPointerCapture(y.pointerId), R.value = !0;
      const X = (ee) => b(Y + (C - ee.clientX), !1), ae = () => {
        R.value = !1, b(c.value), v.removeEventListener("pointermove", X), v.removeEventListener("pointerup", ae);
      };
      v.addEventListener("pointermove", X), v.addEventListener("pointerup", ae);
    }
    function N(y) {
      y.key === "ArrowLeft" ? (b(c.value + 24), y.preventDefault()) : y.key === "ArrowRight" && (b(c.value - 24), y.preventDefault());
    }
    let K = null;
    const D = M(), j = pe();
    async function H(y) {
      if (d.value = y, !B.value) {
        h("panel", y);
        return;
      }
      if (!y && K) {
        const v = K;
        K = null, await Ce(), v.focus();
      }
    }
    function P(y) {
      const v = y === "fields" ? x : w;
      v.value = !v.value, h(y, v.value);
    }
    const O = M(), B = M(!1);
    let ue;
    Ne(() => {
      ue = new ResizeObserver(([y]) => {
        const v = B.value;
        B.value = y.contentRect.width < 1e3, B.value && !v && (d.value = !1), !B.value && v && (d.value = m("panel", !0));
      }), O.value && ue.observe(O.value);
    }), Ct(() => ue?.disconnect());
    const ye = M();
    fe(u, async () => {
      await Ce(), ye.value && (ye.value.scrollTop = 0);
    });
    async function te(y) {
      B.value && !d.value && (K = O.value?.getRootNode()?.activeElement), u.value = y, d.value = !0, B.value && (await Ce(), D.value?.focus());
    }
    const oe = (y) => JSON.stringify(y) === JSON.stringify(u.value), be = F(() => u.value.kind === "field" ? s.config.fields[u.value.index] : void 0), V = F(() => Je(s.config.fields)), g = F(() => u.value.kind === "field" ? V.value.find((y) => y.key === ie(u.value.index, u.value.trail ?? [])) : void 0), $ = F(() => g.value?.key ?? ""), L = F(() => {
      const y = g.value;
      return !y || y.trail.at(-1) === "item" || !y.trail.length ? void 0 : V.value.find((C) => C.key === ie(y.field, y.trail.slice(0, -1))).shape.properties.filter((C) => C !== y.shape).map((C) => C.name);
    }), T = M("");
    fe($, () => {
      T.value = "";
    });
    const Fe = F(() => g.value ? Yl(s.config.fields, g.value) : []), ge = F(() => {
      const y = Cl(s.config.fields.map(G));
      return y ? `Group path collides with field ${y}.` : "";
    }), Te = F(() => ge.value ? null : Vt(s.config.fields)), Pt = F(() => ge.value ? null : Vt(s.config.fields, !0)), it = F(() => {
      const y = u.value;
      return y.kind === "stage" ? ke[y.stage] : y.kind === "field" ? g.value?.trail.length ? g.value.path : be.value?.name || "New field" : y.kind === "document" ? "Read document" : y.kind === "output" ? "Output" : "Details";
    }), Tt = F(() => {
      const y = u.value;
      return y.kind === "stage" ? ot[y.stage] : y.kind === "field" ? "tabler:forms" : y.kind === "document" ? "tabler:file-text" : y.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), Dt = F(() => s.config.fields.filter((y, v) => !(u.value.kind === "field" && u.value.index === v)).map(G)), It = F(() => s.config.stages.deep.enabled), jt = F(() => s.config.stages.map.enabled), zt = F(() => Oe(s.config.fields.map(G))), De = M(!1), ut = M(), dt = pe();
    function Wt(y, v) {
      for (const C of s.config.fields) (C.group === y || C.group.startsWith(y + ".")) && (C.group = v + C.group.slice(y.length));
    }
    const Ht = (y) => 320 - Math.max(0, ...s.config.fields.filter((v) => v.group === y || v.group.startsWith(y + ".")).map((v) => v.group.length - y.length));
    function Gt() {
      x.value = !0, De.value = !0;
    }
    async function rt() {
      De.value = !1, await Ce(), ut.value.focus();
    }
    function Kt(y) {
      s.config.fields.push({ ...at(), group: y }), rt();
    }
    const Qt = F(() => [...new Set(s.config.fields.map((y) => y.group.trim()).filter(Boolean))]), Jt = (y) => Ut(s.config.fields[y], s.config.fields.filter((v, C) => C !== y).map(G)), ct = ["map", "prefetch", "scout", "deep", "extract", "verify"], Yt = F(() => ct.filter((y) => Qe(s.config, y)).map((y) => ke[y]).join(" · ")), Xt = F(() => s.config.fields.map((y) => y.name || "New field").join(", ")), Zt = F(() => ct.filter((y) => Qe(s.config, y)).length), xe = (y) => s.result?.trace.find((v) => v.kind === y);
    function vt(y = "") {
      s.config.fields.push({ ...at(), group: y }), x.value = !0, te({ kind: "field", index: s.config.fields.length - 1 });
    }
    function _t(y) {
      s.config.fields.splice(y, 1), u.value = { kind: "document" };
    }
    function re(y, v = []) {
      te({ kind: "field", index: y, ...v.length ? { trail: v } : {} });
    }
    function mt(y, v) {
      const C = V.value.find((Y) => Y.key === ie(y, v));
      C.shape.properties.push(Ft()), re(y, [...v, C.shape.properties.length - 1]);
    }
    function el() {
      const y = g.value;
      if (!y.trail.length) {
        _t(y.field);
        return;
      }
      const v = V.value.find((C) => C.key === ie(y.field, y.trail.slice(0, -1)));
      v.shape.properties.splice(y.trail.at(-1), 1), re(v.field, v.trail);
    }
    function tl(y, v, C) {
      if (v.length) {
        const X = V.value.find((ne) => ne.key === ie(y, v.slice(0, -1))).shape.properties, ae = v.at(-1), ee = ae + C;
        if (ee < 0 || ee >= X.length) return;
        [X[ae], X[ee]] = [X[ee], X[ae]], re(y, [...v.slice(0, -1), ee]);
      } else {
        const Y = s.config.fields.map((ee, ne) => ee.group === s.config.fields[y].group ? ne : -1).filter((ee) => ee >= 0), X = Y[Y.indexOf(y) + C];
        if (X === void 0) return;
        const ae = s.config.fields;
        [ae[y], ae[X]] = [ae[X], ae[y]], re(X);
      }
    }
    function ll() {
      const y = g.value, v = Fe.value.find((Y) => Y.key === T.value), C = Xl(s.config.fields, y, v);
      re(C.field, C.trail);
    }
    function al(y) {
      const v = g.value?.shape;
      s.config.fields.splice(0, s.config.fields.length, ...s.config.fields.filter((Y) => Y.group !== y && !Y.group.startsWith(y + ".")));
      const C = V.value.find((Y) => Y.shape === v);
      C ? re(C.field, C.trail) : u.value = { kind: "document" };
    }
    function nl(y, v) {
      const C = y.split(".").slice(0, -1).join(".");
      let X = Oe(s.config.fields.map(G));
      for (const se of C.split(".").filter(Boolean)) X = X.children.find((ul) => ul.name === se);
      const ae = X.children.findIndex((se) => se.path === y), ee = X.children[ae + v]?.path;
      if (!ee) return;
      const ne = s.config.fields.filter((se) => se.group === y || se.group.startsWith(y + ".")), Ie = s.config.fields.filter((se) => se.group === ee || se.group.startsWith(ee + ".")), Ue = s.config.fields, ol = Math.min(Ue.indexOf(ne[0]), Ue.indexOf(Ie[0])), ft = Ue.filter((se) => !ne.includes(se) && !Ie.includes(se));
      ft.splice(ol, 0, ...v > 0 ? [...Ie, ...ne] : [...ne, ...Ie]);
      const il = g.value?.shape;
      Ue.splice(0, Ue.length, ...ft);
      const _e = V.value.find((se) => se.shape === il);
      _e && re(_e.field, _e.trail);
    }
    const sl = (y) => y.type === "list" ? `list of ${y.item?.type}` : y.type, pt = F({ get: () => s.config.tags.join(", "), set: (y) => {
      s.config.tags = [...new Set(y.split(",").map((v) => v.trim()).filter(Boolean))];
    } });
    return (y, v) => (n(), o("div", {
      ref_key: "root",
      ref: O,
      class: Q(["builder", { narrow: B.value, "panel-open": d.value, resizing: R.value }])
    }, [
      t("div", {
        class: "canvas",
        inert: B.value && d.value
      }, [
        t("div", Hs, [
          t("section", Gs, [
            t("header", Ks, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": x.value,
                "aria-controls": "fields-body",
                onClick: v[0] || (v[0] = (C) => P("fields"))
              }, [
                f(p(A), {
                  icon: x.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                v[23] || (v[23] = t("h2", { id: "fields-head" }, "Fields", -1)),
                t("span", Js, r(e.config.fields.length), 1)
              ], 8, Qs),
              !x.value && e.config.fields.length ? (n(), o("span", Ys, r(Xt.value), 1)) : k("", !0),
              e.readonly ? k("", !0) : (n(), o("div", Xs, [
                t("button", {
                  ref_key: "addGroupButton",
                  ref: ut,
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  "aria-label": "Add group",
                  "aria-expanded": De.value,
                  "aria-controls": p(dt),
                  disabled: e.config.fields.length >= 100,
                  onClick: Gt
                }, [
                  f(p(A), { icon: "tabler:folder-plus" }),
                  v[24] || (v[24] = q("Add group", -1))
                ], 8, Zs),
                t("button", {
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  disabled: e.config.fields.length >= 100,
                  onClick: v[1] || (v[1] = (C) => vt())
                }, [
                  f(p(A), { icon: "tabler:plus" }),
                  v[25] || (v[25] = q("Add field", -1))
                ], 8, _s)
              ]))
            ]),
            z(t("div", eo, [
              e.config.fields.length ? k("", !0) : (n(), o("p", to, "Add the values to pull from each document.")),
              t("div", lo, [
                De.value && !e.readonly ? (n(), o("div", {
                  key: 0,
                  id: p(dt),
                  class: "group-create-row"
                }, [
                  t("span", no, [
                    f(p(A), { icon: "tabler:folder-plus" })
                  ]),
                  f(Rt, {
                    "input-label": "New group path",
                    "save-label": "Create group",
                    "cancel-label": "Cancel group creation",
                    onSave: Kt,
                    onCancel: rt
                  })
                ], 8, ao)) : k("", !0),
                f(Re, { node: zt.value }, {
                  header: me(({ path: C, label: Y, count: X, first: ae, last: ee }) => [
                    f(Ka, {
                      path: C,
                      name: Y,
                      count: X,
                      first: ae,
                      last: ee,
                      "max-length": Ht(C),
                      "can-add": e.config.fields.length < 100,
                      readonly: e.readonly,
                      onRename: (ne) => Wt(C, ne),
                      onAdd: (ne) => vt(C),
                      onReorder: (ne) => nl(C, ne),
                      onRemove: (ne) => al(C)
                    }, null, 8, ["path", "name", "count", "first", "last", "max-length", "can-add", "readonly", "onRename", "onAdd", "onReorder", "onRemove"])
                  ]),
                  default: me(({ index: C }) => [
                    f(gn, {
                      shape: e.config.fields[C],
                      field: C,
                      trail: [],
                      path: p(G)(e.config.fields[C]) || "New field",
                      selected: $.value,
                      readonly: e.readonly,
                      error: Jt(C),
                      first: !e.config.fields.slice(0, C).some((Y) => Y.group === e.config.fields[C].group),
                      last: !e.config.fields.slice(C + 1).some((Y) => Y.group === e.config.fields[C].group),
                      onSelect: re,
                      onAdd: mt,
                      onReorder: tl
                    }, null, 8, ["shape", "field", "path", "selected", "readonly", "error", "first", "last"])
                  ]),
                  _: 1
                }, 8, ["node"])
              ]),
              t("details", so, [
                t("summary", oo, [
                  f(p(A), { icon: "tabler:braces" }),
                  v[26] || (v[26] = q("Output preview", -1))
                ]),
                ge.value ? (n(), o("p", io, r(ge.value), 1)) : (n(), o("div", uo, [
                  t("div", null, [
                    v[27] || (v[27] = t("h3", null, "Output shape", -1)),
                    t("pre", ro, r(JSON.stringify(Te.value, null, 2)), 1)
                  ]),
                  t("div", null, [
                    v[28] || (v[28] = t("h3", null, "Example value", -1)),
                    t("pre", co, r(JSON.stringify(Pt.value, null, 2)), 1)
                  ])
                ])),
                v[29] || (v[29] = t("small", null, "Example values illustrate the shape; extracted values come from your document.", -1))
              ])
            ], 512), [
              [Ke, x.value]
            ])
          ]),
          t("section", vo, [
            t("header", mo, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": w.value,
                "aria-controls": "flow-body",
                onClick: v[2] || (v[2] = (C) => P("flow"))
              }, [
                f(p(A), {
                  icon: w.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                v[30] || (v[30] = t("h2", { id: "flow-head" }, "Flow", -1)),
                t("span", fo, r(Zt.value) + " of 6", 1)
              ], 8, po),
              w.value ? k("", !0) : (n(), o("span", bo, r(Yt.value), 1)),
              t("button", {
                type: "button",
                class: Q(["kx-btn kx-btn-ghost kx-focus-halo sm push", { on: oe({ kind: "details" }) }]),
                onClick: v[3] || (v[3] = (C) => te({ kind: "details" }))
              }, [
                f(p(A), { icon: "tabler:info-circle" }),
                v[31] || (v[31] = q("Details", -1))
              ], 2)
            ]),
            z(t("div", go, [
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "document" }) }]),
                onClick: v[4] || (v[4] = (C) => te({ kind: "document" }))
              }, [
                t("span", ho, [
                  f(p(A), { icon: "tabler:file-text" })
                ]),
                t("span", yo, [
                  v[32] || (v[32] = t("span", { class: "node-title" }, "Read document", -1)),
                  t("span", ko, r(p(El)(e.config.retrieval)), 1)
                ]),
                t("span", $o, [
                  t("span", xo, r(p(qt)(e.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              v[37] || (v[37] = t("div", { class: "connector" }, null, -1)),
              f(we, {
                stage: "map",
                config: e.config,
                active: oe({ kind: "stage", stage: "map" }),
                trace: xe("map"),
                readonly: e.readonly,
                onSelect: v[5] || (v[5] = (C) => te({ kind: "stage", stage: "map" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[38] || (v[38] = t("div", {
                class: "fork",
                "aria-hidden": "true"
              }, [
                t("span")
              ], -1)),
              t("div", wo, [
                t("div", So, [
                  v[33] || (v[33] = t("span", { class: "branch-label" }, "Evidence", -1)),
                  f(we, {
                    stage: "prefetch",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "prefetch" }),
                    trace: xe("prefetch"),
                    readonly: e.readonly,
                    onSelect: v[6] || (v[6] = (C) => te({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  v[34] || (v[34] = t("div", { class: "connector" }, null, -1)),
                  f(we, {
                    stage: "scout",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "scout" }),
                    trace: xe("scout"),
                    readonly: e.readonly,
                    onSelect: v[7] || (v[7] = (C) => te({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                t("div", Vo, [
                  v[35] || (v[35] = t("span", { class: "branch-label" }, "Deep fields", -1)),
                  f(we, {
                    stage: "deep",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "deep" }),
                    trace: xe("deep"),
                    readonly: e.readonly,
                    onSelect: v[8] || (v[8] = (C) => te({ kind: "stage", stage: "deep" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ])
              ]),
              v[39] || (v[39] = t("div", {
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
                onSelect: v[9] || (v[9] = (C) => te({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[40] || (v[40] = t("div", { class: "connector" }, null, -1)),
              f(we, {
                stage: "verify",
                config: e.config,
                active: oe({ kind: "stage", stage: "verify" }),
                trace: xe("verify"),
                readonly: e.readonly,
                onSelect: v[10] || (v[10] = (C) => te({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[41] || (v[41] = t("div", { class: "connector" }, null, -1)),
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "output" }) }]),
                onClick: v[11] || (v[11] = (C) => te({ kind: "output" }))
              }, [
                t("span", Co, [
                  f(p(A), { icon: "tabler:braces" })
                ]),
                t("span", Eo, [
                  v[36] || (v[36] = t("span", { class: "node-title" }, "Output", -1)),
                  t("span", qo, r(e.config.fields.length ? `${e.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [Ke, w.value]
            ])
          ])
        ])
      ], 8, Ws),
      B.value && d.value ? (n(), o("div", {
        key: 0,
        class: "scrim",
        onClick: v[12] || (v[12] = (C) => H(!1))
      })) : k("", !0),
      d.value ? z((n(), o("aside", {
        key: String(B.value),
        class: "side-panel",
        "aria-labelledby": p(j),
        role: B.value ? "dialog" : void 0,
        "aria-modal": B.value ? "true" : void 0,
        style: qe(B.value ? void 0 : { width: `${c.value}px` }),
        onKeydown: v[21] || (v[21] = Ee((C) => B.value && H(!1), ["esc"]))
      }, [
        B.value ? k("", !0) : (n(), o("div", {
          key: 0,
          class: Q(["resizer kx-focus-outline", { active: R.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": c.value,
          "aria-valuemin": We,
          onPointerdown: ve(S, ["prevent"]),
          onKeydown: N,
          onDblclick: v[13] || (v[13] = (C) => b(tt))
        }, null, 42, Fo)),
        t("header", Uo, [
          t("span", Mo, [
            f(p(A), { icon: Tt.value }, null, 8, ["icon"])
          ]),
          t("h2", { id: p(j) }, r(it.value), 9, Ao),
          t("button", {
            ref_key: "closeButton",
            ref: D,
            type: "button",
            class: "kx-iconbtn kx-focus-outline push",
            "aria-label": B.value ? "Close panel" : "Collapse panel",
            title: B.value ? "Close panel" : "Collapse panel",
            onClick: v[14] || (v[14] = (C) => H(!1))
          }, [
            f(p(A), {
              icon: B.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ], 8, Ro)
        ]),
        t("div", {
          ref_key: "panelBody",
          ref: ye,
          class: "side-panel-body"
        }, [
          u.value.kind === "document" ? (n(), J(zs, {
            key: 0,
            config: e.config,
            retention: e.retention,
            readonly: e.readonly
          }, null, 8, ["config", "retention", "readonly"])) : u.value.kind === "stage" ? (n(), J(Es, {
            key: 1,
            stage: u.value.stage,
            config: e.config,
            readonly: e.readonly
          }, null, 8, ["stage", "config", "readonly"])) : u.value.kind === "field" && be.value && g.value ? (n(), o(U, { key: 2 }, [
            t("p", Bo, r(g.value.path), 1),
            f(qa, {
              field: be.value,
              shape: g.value.shape,
              depth: g.value.depth,
              "sibling-names": L.value,
              "other-names": Dt.value,
              groups: Qt.value,
              "deep-enabled": It.value,
              "map-enabled": jt.value,
              readonly: e.readonly,
              onRemove: el,
              onAdd: v[15] || (v[15] = (C) => mt(g.value.field, g.value.trail)),
              onSelectItem: v[16] || (v[16] = (C) => re(g.value.field, [...g.value.trail, "item"]))
            }, null, 8, ["field", "shape", "depth", "sibling-names", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"]),
            !e.readonly && g.value.trail.at(-1) !== "item" ? (n(), o("fieldset", Lo, [
              t("label", null, [
                v[42] || (v[42] = q("Move to parent", -1)),
                z(t("select", {
                  "onUpdate:modelValue": v[17] || (v[17] = (C) => T.value = C),
                  "aria-label": "Move to parent"
                }, [
                  g.value.trail.length ? (n(), o("option", Oo, "Top-level field")) : (n(), o("option", Po, "Choose an object…")),
                  (n(!0), o(U, null, I(Fe.value, (C) => (n(), o("option", {
                    key: C.key,
                    value: C.key
                  }, r(C.path), 9, To))), 128))
                ], 512), [
                  [Ge, T.value]
                ])
              ]),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Move selected node",
                disabled: !T.value && !g.value.trail.length || !T.value && e.config.fields.length >= 100,
                onClick: ll
              }, "Move", 8, Do)
            ])) : k("", !0)
          ], 64)) : u.value.kind === "details" ? (n(), o("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: e.readonly
          }, [
            t("label", null, [
              v[43] || (v[43] = q("Name", -1)),
              z(t("input", {
                "onUpdate:modelValue": v[18] || (v[18] = (C) => l.value = C),
                "aria-label": "Extractor name"
              }, null, 512), [
                [_, l.value]
              ])
            ]),
            t("label", null, [
              v[44] || (v[44] = q("Description", -1)),
              z(t("textarea", {
                "onUpdate:modelValue": v[19] || (v[19] = (C) => i.value = C),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [_, i.value]
              ])
            ]),
            t("label", null, [
              v[45] || (v[45] = q("Tags", -1)),
              z(t("input", {
                "onUpdate:modelValue": v[20] || (v[20] = (C) => pt.value = C),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  _,
                  pt.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              v[46] || (v[46] = t("small", null, "Comma separated", -1))
            ])
          ], 8, Io)) : u.value.kind === "output" ? (n(), o("div", jo, [
            v[47] || (v[47] = t("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            t("ul", zo, [
              (n(!0), o(U, null, I(e.config.fields, (C) => (n(), o("li", {
                key: p(G)(C)
              }, [
                t("span", Wo, r(p(G)(C) || "New field"), 1),
                t("span", Ho, r(sl(C)), 1)
              ]))), 128))
            ]),
            v[48] || (v[48] = t("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : k("", !0)
        ], 512)
      ], 44, No)), [
        [p(Ll), { disabled: !B.value }]
      ]) : B.value ? k("", !0) : (n(), o("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: v[22] || (v[22] = (C) => H(!0))
      }, [
        f(p(A), { icon: "tabler:layout-sidebar-right-expand" }),
        t("span", Go, r(it.value), 1)
      ]))
    ], 2));
  }
}), Qo = ["selected"], Jo = {
  key: 1,
  role: "alert"
}, Yo = {
  key: 2,
  class: "muted"
}, Bt = /* @__PURE__ */ W({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(e, { emit: s }) {
    const l = s, i = M(!1), u = M("");
    Ne(async () => {
      try {
        await Ze("wc-multiselect", { timeoutMs: 8e3 }), i.value = !0;
      } catch (h) {
        u.value = String(h);
      }
    });
    function m(h) {
      const d = h.detail;
      l("select", d.selected[0] || "", d.labels?.[0] || "");
    }
    return (h, d) => i.value ? (n(), o("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(e.value ? [e.value] : []),
      placeholder: "Choose an upload",
      onChange: m
    }, null, 40, Qo)) : u.value ? (n(), o("p", Jo, r(u.value), 1)) : (n(), o("span", Yo, "Loading uploads…"));
  }
}), Xo = ["data-error-kind"], Zo = { key: 0 }, Lt = /* @__PURE__ */ W({
  __name: "FieldFailure",
  props: {
    error: {}
  },
  setup(e) {
    return (s, l) => (n(), o("div", {
      class: "field-failure",
      "data-error-kind": e.error?.kind,
      role: "note",
      "aria-label": "Field failure"
    }, [
      t("p", null, [
        t("strong", null, r(e.error?.kind), 1),
        q(" · " + r(e.error?.message), 1)
      ]),
      t("small", null, r(e.error?.retryable ? "Retryable" : "Not retryable"), 1),
      e.error?.details ? (n(), o("details", Zo, [
        l[0] || (l[0] = t("summary", { class: "kx-focus-outline" }, "Error details", -1)),
        t("pre", null, r(JSON.stringify(e.error.details, null, 2)), 1)
      ])) : k("", !0)
    ], 8, Xo));
  }
}), _o = { class: "nested-value" }, ei = { key: 0 }, ti = {
  key: 0,
  class: "muted"
}, li = { key: 1 }, ai = { key: 2 }, Be = /* @__PURE__ */ W({
  __name: "NestedValue",
  props: {
    value: {}
  },
  setup(e) {
    const s = e, l = F(() => s.value !== null && typeof s.value == "object" && !Array.isArray(s.value) ? s.value : null);
    return (i, u) => {
      const m = st("NestedValue", !0);
      return n(), o("div", _o, [
        Array.isArray(e.value) ? (n(), o("ol", ei, [
          (n(!0), o(U, null, I(e.value, (h, d) => (n(), o("li", { key: d }, [
            f(m, { value: h }, null, 8, ["value"])
          ]))), 128)),
          e.value.length ? k("", !0) : (n(), o("li", ti, "Empty list"))
        ])) : l.value ? (n(), o("dl", li, [
          (n(!0), o(U, null, I(l.value, (h, d) => (n(), o(U, { key: d }, [
            t("dt", null, r(d), 1),
            t("dd", null, [
              f(m, { value: h }, null, 8, ["value"])
            ])
          ], 64))), 128))
        ])) : (n(), o("span", ai, r(e.value === null || e.value === void 0 ? "—" : String(e.value)), 1))
      ]);
    };
  }
}), ni = { class: "value-list" }, si = ["aria-expanded", "onClick"], oi = { class: "value-name" }, ii = { class: "bar" }, ui = {
  key: 1,
  class: "value-checks"
}, di = ["title"], ri = {
  key: 0,
  class: "chip",
  "aria-label": "Completeness"
}, ci = { class: "evidence" }, vi = {
  key: 1,
  class: "muted"
}, mi = {
  key: 2,
  class: "muted"
}, Ot = /* @__PURE__ */ W({
  __name: "ResultFields",
  props: {
    fields: {},
    pageRange: {}
  },
  setup(e) {
    const s = e, l = F(() => Oe(s.fields.map((w) => w.path))), i = M(), u = (w) => `${Math.round(w * 100)}%`, m = (w) => w !== null && typeof w == "object", h = (w) => Array.isArray(w) ? `${w.length} items` : m(w) ? `${Object.keys(w).length} properties` : w == null ? "—" : String(w), d = (w) => w >= 0.9 ? "high" : w >= 0.7 ? "mid" : "low", x = (w) => w.codes?.includes("missing_in_sections") ? "Not in the selected sections" + (s.pageRange ? " of the searched pages" : "") : "Not in the document";
    return (w, E) => (n(), o("div", ni, [
      f(Re, { node: l.value }, {
        default: me(({ index: c }) => [
          (n(!0), o(U, null, I([e.fields[c]], (a) => (n(), o("div", {
            key: a.path,
            class: "value-row"
          }, [
            t("button", {
              type: "button",
              class: "value-main",
              "aria-expanded": i.value === a.path,
              onClick: (b) => i.value = i.value === a.path ? void 0 : a.path
            }, [
              t("span", oi, r(a.name), 1),
              t("span", {
                class: Q(["value-text", { missing: a.missing }])
              }, r(a.failed ? "Failed" : a.missing ? x(a) : h(a.value)), 3),
              a.failed ? k("", !0) : (n(), o("span", {
                key: 0,
                class: Q(["confidence", d(a.confidence)])
              }, [
                t("span", ii, [
                  t("span", {
                    style: qe({ width: u(a.confidence) })
                  }, null, 4)
                ]),
                q(r(u(a.confidence)), 1),
                E[0] || (E[0] = t("span", { class: "conf-word" }, " confidence", -1))
              ], 2)),
              a.failed ? k("", !0) : (n(), o("span", ui, [
                t("span", {
                  class: Q(["chip", a.verified ? "primary" : "warn"]),
                  title: a.reason
                }, [
                  f(p(A), {
                    icon: a.verified ? "tabler:shield-check" : "tabler:shield-question"
                  }, null, 8, ["icon"]),
                  q(r(a.verified ? "Verified" : "Check"), 1)
                ], 10, di),
                a.missing ? k("", !0) : (n(), o("span", ri, r(a.complete === !0 ? "Complete" : a.complete === !1 ? "Incomplete" : "Completeness unknown"), 1))
              ])),
              f(p(A), {
                icon: i.value === a.path ? "tabler:chevron-up" : "tabler:chevron-down",
                class: "value-caret"
              }, null, 8, ["icon"])
            ], 8, si),
            !a.failed && !a.missing && m(a.value) ? (n(), J(Be, {
              key: 0,
              class: "structured-value",
              value: a.value
            }, null, 8, ["value"])) : k("", !0),
            a.failed ? (n(), J(Lt, {
              key: 1,
              error: a.error
            }, null, 8, ["error"])) : k("", !0),
            z(t("div", ci, [
              !a.failed && !a.missing && !m(a.value) ? (n(), J(Be, {
                key: 0,
                value: a.value
              }, null, 8, ["value"])) : k("", !0),
              (n(!0), o(U, null, I(a.evidence, (b, R) => (n(), o("blockquote", {
                key: R,
                class: Q({ unfound: b.found === !1 })
              }, [
                t("p", null, "“" + r(b.quote) + "”", 1),
                t("cite", null, [
                  q(r(b.section), 1),
                  b.page !== void 0 && b.page !== null ? (n(), o(U, { key: 0 }, [
                    q(" · Page " + r(b.page), 1)
                  ], 64)) : k("", !0),
                  b.found === !1 ? (n(), o(U, { key: 1 }, [
                    q(" · not found word for word in the document")
                  ], 64)) : k("", !0)
                ])
              ], 2))), 128)),
              a.evidence.length ? k("", !0) : (n(), o("p", vi, "No evidence.")),
              a.reason || !a.verified && !a.failed ? (n(), o("p", mi, r(a.reason || "No reason recorded"), 1)) : k("", !0)
            ], 512), [
              [Ke, i.value === a.path && !a.failed]
            ])
          ]))), 128))
        ]),
        _: 1
      }, 8, ["node"])
    ]));
  }
}), pi = { class: "test" }, fi = { class: "run-bar" }, bi = { class: "run-input" }, gi = { class: "muted run-note" }, hi = {
  key: 0,
  class: "empty"
}, yi = {
  key: 1,
  class: "run-failed",
  role: "alert"
}, ki = {
  key: 2,
  class: "eval-warning",
  role: "status"
}, $i = {
  key: 3,
  class: "test-grid"
}, xi = { class: "block" }, wi = { class: "block-head" }, Si = { class: "muted push" }, Vi = { class: "block" }, Ci = { class: "timeline" }, Ei = { class: "tl-icon" }, qi = { class: "tl-main" }, Ni = { class: "tl-head" }, Fi = { class: "muted push" }, Ui = { class: "tl-bar" }, Mi = { class: "muted" }, Ai = {
  key: 0,
  class: "tl-msg"
}, Ri = {
  key: 1,
  class: "chips"
}, Bi = /* @__PURE__ */ W({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {},
    running: { type: Boolean },
    canRun: { type: Boolean }
  },
  emits: ["run"],
  setup(e, { emit: s }) {
    const l = e, i = s, u = M(""), m = (E) => `${(E / 1e3).toFixed(1)}s`, h = F(() => Math.max(1, ...l.result?.trace.map((E) => E.duration_ms) ?? [1])), d = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, x = (E) => d[E]?.label ?? ke[E] ?? E, w = (E) => d[E]?.icon ?? ot[E] ?? "tabler:point";
    return (E, c) => (n(), o("div", pi, [
      t("section", fi, [
        t("div", bi, [
          f(Bt, {
            value: u.value,
            onSelect: c[0] || (c[0] = (a) => u.value = a)
          }, null, 8, ["value"])
        ]),
        f(p(de), {
          label: e.running ? "Extracting…" : "Run extraction",
          loading: e.running,
          disabled: !u.value || e.running || !e.canRun,
          onClick: c[1] || (c[1] = (a) => i("run", u.value))
        }, null, 8, ["label", "loading", "disabled"]),
        t("p", gi, r(e.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + r(e.retention) + ".", 1)
      ]),
      e.result ? k("", !0) : (n(), o("p", hi, "No extraction results yet.")),
      e.result?.status === "failed" ? (n(), o("p", yi, [
        f(p(A), { icon: "tabler:alert-triangle" }),
        q("The run stopped: " + r(e.result.error), 1)
      ])) : k("", !0),
      e.result?.status === "partial" ? (n(), o("p", ki, [
        f(p(A), { icon: "tabler:alert-triangle" }),
        c[2] || (c[2] = q("Partial result · Some fields failed. Successful values are available below.", -1))
      ])) : k("", !0),
      e.result ? (n(), o("div", $i, [
        t("section", xi, [
          t("header", wi, [
            c[3] || (c[3] = t("h2", { class: "block-title" }, "Values", -1)),
            t("span", Si, [
              q(r(e.result.tokens.toLocaleString()) + " tokens · " + r(m(e.result.duration_ms)), 1),
              e.result.page_range ? (n(), o(U, { key: 0 }, [
                q(" · Pages " + r(e.result.page_range.first) + "–" + r(e.result.page_range.last), 1)
              ], 64)) : e.result.pages ? (n(), o(U, { key: 1 }, [
                q(" · " + r(e.result.pages) + " pages", 1)
              ], 64)) : k("", !0)
            ])
          ]),
          f(Ot, {
            fields: e.result.fields,
            "page-range": e.result.page_range
          }, null, 8, ["fields", "page-range"])
        ]),
        t("section", Vi, [
          c[4] || (c[4] = t("header", { class: "block-head" }, [
            t("h2", { class: "block-title" }, "Steps")
          ], -1)),
          t("ol", Ci, [
            (n(!0), o(U, null, I(e.result.trace, (a, b) => (n(), o("li", {
              key: b,
              class: Q(a.status)
            }, [
              t("span", Ei, [
                f(p(A), {
                  icon: w(a.kind)
                }, null, 8, ["icon"])
              ]),
              t("div", qi, [
                t("div", Ni, [
                  t("strong", null, r(x(a.kind)), 1),
                  t("span", Fi, r(m(a.duration_ms)), 1)
                ]),
                t("span", Ui, [
                  t("span", {
                    style: qe({ width: `${Math.max(4, a.duration_ms / h.value * 100)}%` })
                  }, null, 4)
                ]),
                t("p", Mi, [
                  q(r(a.scope), 1),
                  a.pages ? (n(), o(U, { key: 0 }, [
                    q(" · Pages " + r(a.pages.first) + "–" + r(a.pages.last), 1)
                  ], 64)) : k("", !0),
                  a.model ? (n(), o(U, { key: 1 }, [
                    q(" · " + r(a.model), 1)
                  ], 64)) : k("", !0),
                  q(" · " + r((a.input_tokens + a.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                a.message ? (n(), o("p", Ai, r(a.message), 1)) : k("", !0),
                a.queries?.length ? (n(), o("div", Ri, [
                  (n(!0), o(U, null, I(a.queries, (R) => (n(), o("span", {
                    key: R,
                    class: "chip"
                  }, r(R), 1))), 128))
                ])) : k("", !0)
              ])
            ], 2))), 128))
          ])
        ])
      ])) : k("", !0)
    ]));
  }
}), He = (e) => e.status === "completed" || e.status === "partial" || e.status === "failed", Ve = (e) => e.metrics.length ? e.metrics.reduce((s, l) => s + l.accuracy, 0) / e.metrics.length : 0;
function Ye(e, s = /* @__PURE__ */ new Date()) {
  const l = new Date(e);
  return l.toDateString() === s.toDateString() ? l.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" }) : l.getFullYear() === s.getFullYear() ? l.toLocaleString(void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : l.toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
}
const Li = { class: "evals" }, Oi = { class: "block eval-run" }, Pi = { class: "eval-run-main" }, Ti = { class: "block-title" }, Di = {
  key: 0,
  class: "eval-note"
}, Ii = {
  key: 0,
  class: "eval-progress",
  role: "status"
}, ji = { class: "bar" }, zi = { class: "muted" }, Wi = { class: "stat-row" }, Hi = { class: "stat" }, Gi = { class: "stat-label" }, Ki = { class: "stat-value" }, Qi = { class: "stat" }, Ji = { class: "stat-value" }, Yi = { class: "stat-delta flat" }, Xi = { class: "stat" }, Zi = { class: "stat-value" }, _i = {
  key: 0,
  class: "stat-delta flat"
}, eu = { class: "stat" }, tu = { class: "stat-value" }, lu = {
  key: 0,
  class: "stat-delta flat"
}, au = { class: "block" }, nu = { class: "block-head" }, su = {
  key: 0,
  class: "compare-pick push"
}, ou = ["value"], iu = ["value"], uu = {
  key: 0,
  class: "block-empty"
}, du = {
  key: 1,
  class: "table-scroll"
}, ru = { key: 0 }, cu = { key: 1 }, vu = { class: "mono" }, mu = { class: "acc strong" }, pu = { class: "bar" }, fu = { class: "muted" }, bu = {
  key: 0,
  class: "muted"
}, gu = { key: 1 }, hu = {
  key: 1,
  class: "muted"
}, yu = {
  key: 1,
  class: "block"
}, ku = { class: "table-scroll" }, $u = { class: "metric-table result-matrix" }, xu = ["aria-expanded", "onClick"], wu = {
  key: 0,
  class: "badge",
  "data-status": "partial"
}, Su = ["colspan"], Vu = {
  key: 0,
  class: "cell-state"
}, Cu = ["data-error-kind", "title"], Eu = ["data-label"], qu = ["title"], Nu = {
  key: 0,
  class: "result-detail"
}, Fu = ["colspan"], Uu = ["data-error-kind", "title"], Mu = { class: "mono" }, Au = { class: "cmp" }, Ru = { class: "cmp" }, Bu = { key: 0 }, Lu = { class: "muted case-meta" }, Ou = { class: "block" }, Pu = { class: "block-head" }, Tu = { class: "count" }, Du = { class: "mono" }, Iu = ["onUpdate:modelValue"], ju = ["onUpdate:modelValue"], zu = ["onUpdate:modelValue", "placeholder"], Wu = ["onUpdate:modelValue", "type"], Hu = {
  key: 0,
  class: "error",
  role: "alert"
}, Gu = { class: "row" }, Ku = {
  key: 1,
  class: "block-empty"
}, Qu = {
  key: 2,
  class: "block-empty"
}, Ju = {
  key: 3,
  class: "table-scroll"
}, Yu = { class: "metric-table case-table" }, Xu = { class: "case-value" }, Zu = {
  key: 1,
  class: "muted"
}, _u = { class: "num" }, ed = ["aria-label", "disabled", "onClick"], td = {
  key: 2,
  class: "block"
}, ld = { class: "block-head" }, ad = { class: "count" }, nd = { class: "eval-history" }, sd = ["aria-current", "onClick"], od = ["data-status"], id = { class: "muted" }, ud = { class: "push" }, dd = /* @__PURE__ */ W({
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
    const l = e, i = s, u = M(!1), m = M(""), h = M({}), d = M("");
    fe(() => l.addedCaseId, () => {
      u.value = !1, m.value = "", h.value = {};
    });
    function x(V, g) {
      return V.type === "number" ? Number(g) : V.type === "boolean" ? g === "true" : V.type === "list" || V.type === "object" ? JSON.parse(g) : g;
    }
    function w() {
      d.value = "";
      const V = {};
      try {
        for (const g of l.fields) {
          const $ = String(h.value[G(g)] ?? "").trim();
          $ && Nt(V, G(g), x(g, $));
        }
      } catch {
        d.value = 'Lists and objects need valid JSON, for example ["a","b"] or {"city":"Hamburg"}.';
        return;
      }
      i("add-case", { upload_id: m.value, expected: V });
    }
    const E = F(() => l.evaluations.find((V) => !He(V))), c = F(() => l.evaluations.filter(He)), a = F(() => l.evaluation), b = F(() => ({ done: (a.value?.results ?? []).filter((g) => g.status !== "queued").length, total: a.value?.case_count ?? 0 })), R = M();
    fe(() => a.value?.id, () => {
      R.value = void 0;
    });
    const S = F(() => {
      if (!a.value) return;
      if (R.value) return c.value.find((g) => g.id === R.value);
      const V = c.value.findIndex((g) => g.id === a.value.id);
      return V >= 0 ? c.value[V + 1] : c.value[0];
    }), N = F(() => (a.value?.metrics ?? []).map((V) => ({ ...V, before: S.value?.metrics.find((g) => g.field === V.field) }))), K = F(() => (a.value?.fields ?? []).map(G)), D = F(() => Oe(l.fields.map(G))), j = (V, g) => V.scores.find(($) => $.field === g), H = M(), P = (V) => `${Math.round(V * 100)}%`, O = (V) => {
      const g = Math.round(V * 100);
      return `${g > 0 ? "+" : g < 0 ? "−" : "±"}${Math.abs(g)} pts`;
    }, B = (V) => Math.round(V * 100) > 0 ? "up" : Math.round(V * 100) < 0 ? "down" : "flat", ue = (V) => V >= 6e4 ? `${Math.floor(V / 6e4)}m ${Math.round(V % 6e4 / 1e3)}s` : `${(V / 1e3).toFixed(1)}s`, ye = (V) => V == null || V === "" ? "—" : typeof V == "string" ? V : Array.isArray(V) && V.every((g) => typeof g != "object") ? V.join(", ") : JSON.stringify(V), te = (V) => V ? V.failed ? "fail" : V.score >= 0.999 ? "pass" : V.score > 0 ? "partial" : "fail" : "none", oe = (V) => (V.results ?? []).filter((g) => g.status === "completed").length, be = { queued: "Queued", running: "Running", completed: "Completed", partial: "Partial", failed: "Failed" };
    return (V, g) => (n(), o("div", Li, [
      t("section", Oi, [
        t("div", Pi, [
          t("div", null, [
            t("h2", Ti, "Evaluate revision " + r(e.revision), 1),
            g[6] || (g[6] = t("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            e.changed ? (n(), o("p", Di, [
              f(p(A), { icon: "tabler:info-circle" }),
              g[5] || (g[5] = q("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : k("", !0)
          ]),
          f(p(de), {
            label: E.value ? "Evaluating…" : "Run all cases",
            loading: e.starting || !!E.value,
            disabled: !e.cases.length || !e.fields.length || !!E.value || e.starting,
            onClick: g[0] || (g[0] = ($) => i("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        a.value && !p(He)(a.value) ? (n(), o("div", Ii, [
          t("span", ji, [
            t("span", {
              style: qe({ width: P(b.value.total ? b.value.done / b.value.total : 0) })
            }, null, 4)
          ]),
          t("span", zi, r(be[a.value.status]) + " · " + r(b.value.done) + " of " + r(b.value.total) + " cases", 1)
        ])) : k("", !0)
      ]),
      a.value && p(He)(a.value) ? (n(), o(U, { key: 0 }, [
        a.value.error ? (n(), o("p", {
          key: 0,
          class: Q(a.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          f(p(A), { icon: "tabler:alert-triangle" }),
          q(r(a.value.error), 1)
        ], 2)) : k("", !0),
        t("div", Wi, [
          t("div", Hi, [
            t("span", Gi, "Accuracy · revision " + r(a.value.config_revision), 1),
            t("span", Ki, r(P(p(Ve)(a.value))), 1),
            S.value ? (n(), o("span", {
              key: 0,
              class: Q(["stat-delta", B(p(Ve)(a.value) - p(Ve)(S.value))])
            }, r(O(p(Ve)(a.value) - p(Ve)(S.value))) + " vs revision " + r(S.value.config_revision), 3)) : k("", !0)
          ]),
          t("div", Qi, [
            g[7] || (g[7] = t("span", { class: "stat-label" }, "Cases", -1)),
            t("span", Ji, [
              q(r(oe(a.value)), 1),
              t("small", null, " / " + r(a.value.case_count), 1)
            ]),
            t("span", Yi, r((a.value.results ?? []).filter(($) => $.status === "partial").length) + " partial · " + r((a.value.results ?? []).filter(($) => $.status === "failed").length) + " failed", 1)
          ]),
          t("div", Xi, [
            g[8] || (g[8] = t("span", { class: "stat-label" }, "Tokens", -1)),
            t("span", Zi, r(a.value.tokens.toLocaleString()), 1),
            S.value ? (n(), o("span", _i, r(S.value.tokens.toLocaleString()) + " before", 1)) : k("", !0)
          ]),
          t("div", eu, [
            g[9] || (g[9] = t("span", { class: "stat-label" }, "Model time", -1)),
            t("span", tu, r(ue(a.value.duration_ms)), 1),
            S.value ? (n(), o("span", lu, r(ue(S.value.duration_ms)) + " before", 1)) : k("", !0)
          ])
        ]),
        t("section", au, [
          t("header", nu, [
            g[11] || (g[11] = t("h2", { class: "block-title" }, "Field accuracy", -1)),
            c.value.length > 1 ? (n(), o("label", su, [
              g[10] || (g[10] = t("span", { class: "muted" }, "Compare with", -1)),
              t("select", {
                value: S.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: g[1] || (g[1] = ($) => R.value = $.target.value)
              }, [
                (n(!0), o(U, null, I(c.value.filter(($) => $.id !== a.value.id), ($) => (n(), o("option", {
                  key: $.id,
                  value: $.id
                }, "Revision " + r($.config_revision) + " · " + r(p(Ye)($.created_at)), 9, iu))), 128))
              ], 40, ou)
            ])) : k("", !0)
          ]),
          N.value.length ? (n(), o("div", du, [
            t("table", {
              class: Q(["metric-table accuracy-table", { comparing: !!S.value }])
            }, [
              t("thead", null, [
                t("tr", null, [
                  g[12] || (g[12] = t("th", null, "Field", -1)),
                  g[13] || (g[13] = t("th", null, "Accuracy", -1)),
                  g[14] || (g[14] = t("th", null, "Verified", -1)),
                  S.value ? (n(), o("th", ru, "Revision " + r(S.value.config_revision), 1)) : k("", !0),
                  S.value ? (n(), o("th", cu, "Change")) : k("", !0)
                ])
              ]),
              t("tbody", null, [
                (n(!0), o(U, null, I(N.value, ($) => (n(), o("tr", {
                  key: $.field
                }, [
                  t("td", vu, r($.field), 1),
                  t("td", null, [
                    t("span", mu, [
                      t("span", pu, [
                        t("span", {
                          style: qe({ width: P($.accuracy) })
                        }, null, 4)
                      ]),
                      q(r(P($.accuracy)), 1)
                    ])
                  ]),
                  t("td", fu, r(P($.verified)), 1),
                  S.value ? (n(), o("td", bu, r($.before ? P($.before.accuracy) : "—"), 1)) : k("", !0),
                  S.value ? (n(), o("td", gu, [
                    $.before ? (n(), o("span", {
                      key: 0,
                      class: Q(["trend", B($.accuracy - $.before.accuracy)])
                    }, [
                      f(p(A), {
                        icon: B($.accuracy - $.before.accuracy) === "up" ? "tabler:trending-up" : B($.accuracy - $.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      q(r(O($.accuracy - $.before.accuracy)), 1)
                    ], 2)) : (n(), o("span", hu, "New field"))
                  ])) : k("", !0)
                ]))), 128))
              ])
            ], 2)
          ])) : (n(), o("p", uu, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : k("", !0),
      a.value?.results?.length ? (n(), o("section", yu, [
        g[19] || (g[19] = t("header", { class: "block-head" }, [
          t("h2", { class: "block-title" }, "Results by case"),
          t("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        t("div", ku, [
          t("table", $u, [
            t("thead", null, [
              t("tr", null, [
                g[15] || (g[15] = t("th", null, "Document", -1)),
                (n(!0), o(U, null, I(K.value, ($) => (n(), o("th", {
                  key: $,
                  class: "mono"
                }, r($), 1))), 128))
              ])
            ]),
            t("tbody", null, [
              (n(!0), o(U, null, I(a.value.results, ($) => (n(), o(U, {
                key: $.case_id
              }, [
                t("tr", {
                  class: Q(["result-row", { active: H.value === $.case_id }])
                }, [
                  t("td", null, [
                    t("button", {
                      type: "button",
                      class: "case-toggle",
                      "aria-expanded": H.value === $.case_id,
                      onClick: (L) => H.value = H.value === $.case_id ? void 0 : $.case_id
                    }, [
                      f(p(A), {
                        icon: H.value === $.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      q(r($.upload_name), 1)
                    ], 8, xu),
                    $.status === "partial" ? (n(), o("span", wu, "Partial")) : k("", !0)
                  ]),
                  $.status === "queued" || $.status === "failed" ? (n(), o("td", {
                    key: 0,
                    colspan: K.value.length,
                    class: "muted"
                  }, [
                    $.status === "queued" ? (n(), o("span", Vu, [
                      f(p(A), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      g[16] || (g[16] = q("Waiting", -1))
                    ])) : (n(), o("span", {
                      key: 1,
                      class: "cell-state fail",
                      "data-error-kind": $.error?.kind,
                      title: $.error?.kind
                    }, [
                      f(p(A), { icon: "tabler:alert-triangle" }),
                      q(r($.error?.message), 1)
                    ], 8, Cu))
                  ], 8, Su)) : (n(!0), o(U, { key: 1 }, I(K.value, (L) => (n(), o("td", {
                    key: L,
                    "data-label": L
                  }, [
                    t("span", {
                      class: Q(["cell", te(j($, L))]),
                      title: ye(j($, L)?.value)
                    }, r(j($, L)?.failed ? "Failed" : j($, L) ? P(j($, L).score) : "—"), 11, qu)
                  ], 8, Eu))), 128))
                ], 2),
                H.value === $.case_id ? (n(), o("tr", Nu, [
                  t("td", {
                    colspan: K.value.length + 1
                  }, [
                    $.error ? (n(), o("p", {
                      key: 0,
                      class: "muted",
                      "data-error-kind": $.error.kind,
                      title: $.error.kind
                    }, r($.error.message), 9, Uu)) : k("", !0),
                    f(Re, {
                      node: p(Oe)($.scores.map((L) => L.field))
                    }, {
                      default: me(({ index: L }) => [
                        (n(!0), o(U, null, I([$.scores[L]], (T) => (n(), o("dl", {
                          key: T.field,
                          class: "compare"
                        }, [
                          t("dt", Mu, r(T.field.split(".").at(-1)), 1),
                          t("dd", null, [
                            t("span", {
                              class: Q(["cell", te(T)])
                            }, r(T.failed ? "Failed" : P(T.score)), 3),
                            t("div", Au, [
                              g[17] || (g[17] = t("span", { class: "cmp-label" }, "Expected", -1)),
                              f(Be, {
                                value: T.expected
                              }, null, 8, ["value"])
                            ]),
                            t("div", Ru, [
                              g[18] || (g[18] = t("span", { class: "cmp-label" }, "Extracted", -1)),
                              T.failed ? (n(), J(Lt, {
                                key: 0,
                                error: T.error
                              }, null, 8, ["error"])) : (n(), J(Be, {
                                key: 1,
                                value: T.value
                              }, null, 8, ["value"]))
                            ]),
                            T.failed ? k("", !0) : (n(), o("span", Bu, [
                              t("span", {
                                class: Q(["chip", T.verified ? "primary" : "warn"])
                              }, [
                                f(p(A), {
                                  icon: T.verified ? "tabler:shield-check" : "tabler:shield-question"
                                }, null, 8, ["icon"]),
                                q(r(T.verified ? "Verified" : "Unverified"), 1)
                              ], 2)
                            ]))
                          ])
                        ]))), 128))
                      ]),
                      _: 2
                    }, 1032, ["node"]),
                    t("p", Lu, r($.tokens.toLocaleString()) + " tokens · " + r(ue($.duration_ms)), 1)
                  ], 8, Fu)
                ])) : k("", !0)
              ], 64))), 128))
            ])
          ])
        ])
      ])) : k("", !0),
      t("section", Ou, [
        t("header", Pu, [
          g[20] || (g[20] = t("h2", { class: "block-title" }, "Cases", -1)),
          t("span", Tu, r(e.cases.length), 1),
          f(p(de), {
            label: "Add case",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: !e.fields.length,
            onClick: g[2] || (g[2] = ($) => u.value = !u.value)
          }, null, 8, ["disabled"])
        ]),
        u.value ? (n(), o("form", {
          key: 0,
          class: "case-form",
          onSubmit: ve(w, ["prevent"])
        }, [
          t("label", null, [
            g[21] || (g[21] = q("Document", -1)),
            f(Bt, {
              value: m.value,
              onSelect: g[3] || (g[3] = ($) => {
                m.value = $;
              })
            }, null, 8, ["value"])
          ]),
          g[24] || (g[24] = t("p", { class: "muted" }, "Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.", -1)),
          f(Re, { node: D.value }, {
            default: me(({ index: $ }) => [
              (n(!0), o(U, null, I([e.fields[$]], (L) => (n(), o("label", {
                key: p(G)(L)
              }, [
                t("span", Du, r(L.name), 1),
                L.type === "boolean" ? z((n(), o("select", {
                  key: 0,
                  "onUpdate:modelValue": (T) => h.value[p(G)(L)] = T
                }, [...g[22] || (g[22] = [
                  t("option", { value: "" }, "Not stated", -1),
                  t("option", { value: "true" }, "Yes", -1),
                  t("option", { value: "false" }, "No", -1)
                ])], 8, Iu)), [
                  [Ge, h.value[p(G)(L)]]
                ]) : L.type === "enum" ? z((n(), o("select", {
                  key: 1,
                  "onUpdate:modelValue": (T) => h.value[p(G)(L)] = T
                }, [
                  g[23] || (g[23] = t("option", { value: "" }, "Not stated", -1)),
                  (n(!0), o(U, null, I(L.enum_values, (T) => (n(), o("option", { key: T }, r(T), 1))), 128))
                ], 8, ju)), [
                  [Ge, h.value[p(G)(L)]]
                ]) : L.type === "object" || L.type === "list" ? z((n(), o("textarea", {
                  key: 2,
                  "onUpdate:modelValue": (T) => h.value[p(G)(L)] = T,
                  rows: "2",
                  placeholder: L.type === "list" ? '["first", "second"]' : '{"key": "value"}'
                }, null, 8, zu)), [
                  [_, h.value[p(G)(L)]]
                ]) : z((n(), o("input", {
                  key: 3,
                  "onUpdate:modelValue": (T) => h.value[p(G)(L)] = T,
                  type: L.type === "number" ? "number" : L.type === "date" ? "date" : "text",
                  placeholder: "Not stated"
                }, null, 8, Wu)), [
                  [dl, h.value[p(G)(L)]]
                ])
              ]))), 128))
            ]),
            _: 1
          }, 8, ["node"]),
          d.value ? (n(), o("p", Hu, r(d.value), 1)) : k("", !0),
          t("div", Gu, [
            f(p(de), {
              label: "Save case",
              size: "small",
              type: "submit",
              disabled: !m.value,
              loading: e.saving
            }, null, 8, ["disabled", "loading"]),
            f(p(de), {
              label: "Cancel",
              size: "small",
              severity: "secondary",
              text: "",
              onClick: g[4] || (g[4] = ($) => u.value = !1)
            })
          ])
        ], 32)) : k("", !0),
        e.fields.length ? !e.cases.length && !u.value ? (n(), o("p", Qu, "No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.")) : e.cases.length ? (n(), o("div", Ju, [
          t("table", Yu, [
            g[25] || (g[25] = t("thead", null, [
              t("tr", null, [
                t("th", null, "Document"),
                t("th", null, "Expected values"),
                t("th")
              ])
            ], -1)),
            t("tbody", null, [
              (n(!0), o(U, null, I(e.cases, ($) => (n(), o("tr", {
                key: $.id
              }, [
                t("td", null, [
                  f(p(A), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  q(" " + r($.upload_name), 1)
                ]),
                t("td", null, [
                  f(Re, { node: D.value }, {
                    default: me(({ index: L }) => [
                      t("div", Xu, [
                        t("strong", null, r(e.fields[L].name), 1),
                        p(kt)($.expected, p(G)(e.fields[L])) !== void 0 ? (n(), J(Be, {
                          key: 0,
                          value: p(kt)($.expected, p(G)(e.fields[L]))
                        }, null, 8, ["value"])) : (n(), o("span", Zu, "Not stated"))
                      ])
                    ]),
                    _: 2
                  }, 1032, ["node"])
                ]),
                t("td", _u, [
                  t("button", {
                    type: "button",
                    class: "kx-iconbtn kx-focus-outline",
                    "aria-label": `Remove case ${$.upload_name}`,
                    disabled: e.saving,
                    onClick: (L) => i("delete-case", $.id)
                  }, [
                    f(p(A), { icon: "tabler:trash" })
                  ], 8, ed)
                ])
              ]))), 128))
            ])
          ])
        ])) : k("", !0) : (n(), o("p", Ku, "Add a field in the Builder, then add documents with the values you expect."))
      ]),
      e.evaluations.length ? (n(), o("section", td, [
        t("header", ld, [
          g[26] || (g[26] = t("h2", { class: "block-title" }, "History", -1)),
          t("span", ad, r(e.evaluations.length), 1)
        ]),
        t("ul", nd, [
          (n(!0), o(U, null, I(e.evaluations, ($) => (n(), o("li", {
            key: $.id
          }, [
            t("button", {
              type: "button",
              class: Q({ active: a.value?.id === $.id }),
              "aria-current": a.value?.id === $.id,
              onClick: (L) => i("open", $.id)
            }, [
              t("span", {
                class: "badge",
                "data-status": $.status
              }, r(be[$.status]), 9, od),
              t("span", null, "Revision " + r($.config_revision), 1),
              t("span", id, r(p(Ye)($.created_at)), 1),
              t("strong", ud, r($.status === "completed" || $.status === "partial" ? P(p(Ve)($)) : "—"), 1)
            ], 10, sd)
          ]))), 128))
        ])
      ])) : k("", !0)
    ]));
  }
}), rd = { class: "section-head" }, cd = { class: "muted" }, vd = {
  key: 0,
  class: "empty"
}, md = {
  key: 1,
  class: "table-scroll"
}, pd = { class: "metric-table runs-table" }, fd = ["aria-label", "aria-expanded", "onClick"], bd = { class: "caller" }, gd = {
  key: 0,
  class: "muted"
}, hd = ["data-status"], yd = {
  class: "num",
  "data-label": "Time"
}, kd = {
  class: "num",
  "data-label": "Tokens"
}, $d = {
  class: "muted",
  "data-label": "Expires"
}, xd = {
  key: 0,
  class: "result-detail"
}, wd = { colspan: "6" }, Sd = /* @__PURE__ */ W({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(e) {
    const s = M(), l = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (i, u) => (n(), o(U, null, [
      t("div", rd, [
        u[0] || (u[0] = t("h2", null, "Recent runs", -1)),
        t("span", cd, "Runs expire after " + r(e.retention), 1)
      ]),
      e.runs.length ? (n(), o("div", md, [
        t("table", pd, [
          u[1] || (u[1] = t("thead", null, [
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
            (n(!0), o(U, null, I(e.runs, (m) => (n(), o(U, {
              key: m.id
            }, [
              t("tr", null, [
                t("td", null, [
                  t("button", {
                    type: "button",
                    class: "case-toggle",
                    "aria-label": `Show values for run ${m.id}`,
                    "aria-expanded": s.value === m.id,
                    onClick: (h) => s.value = s.value === m.id ? void 0 : m.id
                  }, [
                    f(p(A), {
                      icon: s.value === m.id ? "tabler:chevron-down" : "tabler:chevron-right"
                    }, null, 8, ["icon"]),
                    q(r(p(Ye)(m.created_at)), 1)
                  ], 8, fd)
                ]),
                t("td", null, [
                  t("span", bd, [
                    f(p(A), {
                      icon: l[m.caller].icon
                    }, null, 8, ["icon"]),
                    q(r(l[m.caller].label), 1)
                  ]),
                  m.result.page_range ? (n(), o("span", gd, " · Pages " + r(m.result.page_range.first) + "–" + r(m.result.page_range.last), 1)) : k("", !0)
                ]),
                t("td", null, [
                  t("span", {
                    class: "badge",
                    "data-status": m.status
                  }, r(m.status === "completed" ? "Completed" : m.status === "partial" ? "Partial" : "Failed"), 9, hd)
                ]),
                t("td", yd, r((m.duration_ms / 1e3).toFixed(1)) + "s", 1),
                t("td", kd, r(Number(m.tokens).toLocaleString()), 1),
                t("td", $d, r(p(Ye)(m.expires_at)), 1)
              ]),
              s.value === m.id ? (n(), o("tr", xd, [
                t("td", wd, [
                  f(Ot, {
                    fields: m.result.fields,
                    "page-range": m.result.page_range
                  }, null, 8, ["fields", "page-range"])
                ])
              ])) : k("", !0)
            ], 64))), 128))
          ])
        ])
      ])) : (n(), o("p", vd, "No runs yet. Runs from the Test tab, agents, evaluations and Workflows appear here."))
    ], 64));
  }
}), Vd = {
  key: 0,
  role: "alert",
  class: "error banner"
}, Cd = /* @__PURE__ */ W({
  __name: "SharePopup",
  props: {
    id: {},
    title: {}
  },
  emits: ["close"],
  setup(e, { emit: s }) {
    const l = e, i = s, u = M(), m = M("");
    return Ne(async () => {
      try {
        await Ze("kickside-share", { timeoutMs: 8e3 });
      } catch (x) {
        m.value = `Sharing is unavailable: ${x instanceof Error ? x.message : String(x)}`;
        return;
      }
      const h = document.createElement("kickside-share"), d = encodeURIComponent(l.id);
      h.setAttribute("config", JSON.stringify({ resource_id: l.id, title: l.title, access_url: `/api/v1/component-access/grants/${d}`, share_url: `/api/v1/component-access/share/${d}` })), h.style.display = "block", h.addEventListener("close", () => i("close")), u.value?.appendChild(h);
    }), (h, d) => (n(), o("div", {
      ref_key: "host",
      ref: u
    }, [
      m.value ? (n(), o("p", Vd, r(m.value), 1)) : k("", !0)
    ], 512));
  }
}), Ed = { class: "docscout" }, qd = { class: "toolbar" }, Nd = { class: "toolbar-lead" }, Fd = { class: "crumb-row" }, Ud = { class: "crumb" }, Md = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, Ad = ["id", "aria-selected", "aria-controls", "onClick"], Rd = { class: "toolbar-side" }, Bd = { class: "stats" }, Ld = ["title"], Od = {
  key: 2,
  class: "unsaved"
}, Pd = {
  key: 0,
  class: "banner row wrap",
  role: "status"
}, Td = {
  key: 1,
  role: "alert",
  class: "error banner"
}, Dd = {
  key: 3,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, Id = ["id", "aria-labelledby"], jd = /* @__PURE__ */ W({
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
    const l = e, i = s, u = M(), m = M(!1), h = M("Builder"), d = M($t()), x = M(""), w = M(""), E = F(() => l.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    fe(h, () => {
      u.value && (u.value.scrollTop = 0);
    }, { flush: "post" });
    const c = M(), a = M(), b = F(() => l.snapshot.can_edit && c.value !== l.snapshot.expected_revision), R = F(() => b.value && a.value !== l.snapshot.expected_revision);
    function S(P) {
      return x.value === P.title && w.value === (P.description ?? "") && Nl(d.value, P.config);
    }
    function N() {
      const P = l.snapshot;
      d.value = structuredClone(gt(P.config ?? $t())), x.value = P.title, w.value = P.description ?? "", c.value = P.expected_revision, a.value = void 0;
    }
    fe(() => l.snapshot, (P, O) => {
      E.value.includes(h.value) || (h.value = E.value[0]), !(O && P.id === O.id && P.can_edit && O.can_edit && !S(O) && !S(P)) && N();
    }, { immediate: !0 });
    const K = F(() => l.snapshot.can_edit && !S(l.snapshot)), D = F(() => ql(d.value)), j = F(() => Object.keys(ke).filter((P) => Qe(d.value, P)).length);
    function H() {
      i("save", { title: x.value, description: w.value, config: structuredClone(gt(d.value)), expected_revision: c.value });
    }
    return (P, O) => (n(), o("main", Ed, [
      t("div", qd, [
        t("div", Nd, [
          t("span", Fd, [
            e.back ? (n(), o("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: O[0] || (O[0] = (B) => i("back"))
            }, [
              f(p(A), { icon: "tabler:arrow-left" })
            ])) : k("", !0),
            t("span", Ud, r(e.snapshot.title), 1)
          ]),
          t("nav", Md, [
            (n(!0), o(U, null, I(E.value, (B) => (n(), o("button", {
              id: `tab-${B}`,
              key: B,
              role: "tab",
              "aria-selected": h.value === B,
              "aria-controls": `panel-${B}`,
              onClick: (ue) => h.value = B
            }, r(B), 9, Ad))), 128))
          ])
        ]),
        t("div", Rd, [
          e.snapshot.can_share ? (n(), J(p(de), {
            key: 0,
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-label": "Share",
            onClick: O[1] || (O[1] = (B) => m.value = !0)
          }, {
            default: me(() => [
              f(p(A), { icon: "tabler:share" }),
              O[11] || (O[11] = t("span", { class: "btn-label" }, "Share", -1))
            ]),
            _: 1
          })) : k("", !0),
          t("span", Bd, [
            q(r(e.snapshot.field_count) + " " + r(e.snapshot.field_count === 1 ? "field" : "fields"), 1),
            e.snapshot.can_edit ? (n(), o(U, { key: 0 }, [
              q(" · " + r(j.value) + " steps · revision " + r(e.snapshot.expected_revision), 1)
            ], 64)) : (n(), o(U, { key: 1 }, [
              q(" · Read access")
            ], 64))
          ]),
          e.snapshot.can_edit ? (n(), o(U, { key: 1 }, [
            b.value && !R.value ? (n(), J(p(de), {
              key: 0,
              label: "Reload saved",
              severity: "secondary",
              size: "small",
              onClick: N
            })) : k("", !0),
            D.value ? (n(), o("span", {
              key: 1,
              class: "invalid",
              role: "alert",
              title: D.value
            }, [
              f(p(A), { icon: "tabler:alert-circle" }),
              q(r(D.value), 1)
            ], 8, Ld)) : K.value ? (n(), o("span", Od, "Unsaved")) : k("", !0),
            f(p(de), {
              label: "Save",
              size: "small",
              loading: e.saving,
              disabled: !K.value || !!D.value || !x.value.trim(),
              onClick: H
            }, null, 8, ["loading", "disabled"])
          ], 64)) : k("", !0)
        ])
      ]),
      R.value ? (n(), o("div", Pd, [
        t("span", null, "Saved configuration changed to revision " + r(e.snapshot.expected_revision) + ". Your edits are kept.", 1),
        f(p(de), {
          label: "Reload saved",
          severity: "secondary",
          size: "small",
          onClick: N
        }),
        f(p(de), {
          label: "Keep editing",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: O[2] || (O[2] = (B) => a.value = e.snapshot.expected_revision)
        })
      ])) : k("", !0),
      e.error ? (n(), o("p", Td, r(e.error), 1)) : k("", !0),
      m.value ? (n(), J(Cd, {
        key: 2,
        id: e.snapshot.id,
        title: e.snapshot.title,
        onClose: O[3] || (O[3] = (B) => m.value = !1)
      }, null, 8, ["id", "title"])) : k("", !0),
      h.value === "Builder" && e.snapshot.can_edit ? (n(), o("div", Dd, [
        f(Ko, {
          title: x.value,
          "onUpdate:title": O[4] || (O[4] = (B) => x.value = B),
          description: w.value,
          "onUpdate:description": O[5] || (O[5] = (B) => w.value = B),
          config: d.value,
          retention: e.snapshot.retention,
          result: e.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (n(), o("div", {
        key: 4,
        ref_key: "body",
        ref: u,
        class: "page-body"
      }, [
        t("div", {
          id: `panel-${h.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${h.value}`,
          class: "panel"
        }, [
          h.value === "Test" ? (n(), J(Bi, {
            key: 0,
            result: e.result,
            retention: e.snapshot.retention,
            running: e.running,
            "can-run": e.snapshot.field_count > 0,
            onRun: O[6] || (O[6] = (B) => i("run", B))
          }, null, 8, ["result", "retention", "running", "can-run"])) : k("", !0),
          h.value === "Evals" && e.snapshot.can_edit ? (n(), J(dd, {
            key: 1,
            cases: e.snapshot.cases,
            "added-case-id": e.addedCaseId,
            fields: e.snapshot.config.fields,
            evaluations: e.evaluations,
            evaluation: e.evaluation,
            revision: e.snapshot.expected_revision,
            changed: K.value,
            saving: e.saving,
            starting: e.starting,
            onAddCase: O[7] || (O[7] = (B) => i("add-case", B)),
            onDeleteCase: O[8] || (O[8] = (B) => i("delete-case", B)),
            onEvaluate: O[9] || (O[9] = (B) => i("evaluate")),
            onOpen: O[10] || (O[10] = (B) => i("open-evaluation", B))
          }, null, 8, ["cases", "added-case-id", "fields", "evaluations", "evaluation", "revision", "changed", "saving", "starting"])) : k("", !0),
          h.value === "Runs" ? (n(), J(Sd, {
            key: 2,
            runs: e.snapshot.runs,
            retention: e.snapshot.retention
          }, null, 8, ["runs", "retention"])) : k("", !0)
        ], 8, Id)
      ], 512))
    ]));
  }
}), zd = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, Wd = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, Jd = /* @__PURE__ */ W({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(e, { emit: s }) {
    const l = e, i = s, u = M(), m = M(""), h = M(!1), d = M(!1), x = M(!1), w = M(), E = M(null), c = M([]), a = M();
    let b = [], R = 0, S = 0, N = 0, K;
    const D = (V) => V instanceof Error ? V.message : String(V), j = (V) => V === R;
    async function H(V, g) {
      const $ = ++N;
      g && (K = g);
      const L = () => j(V) && $ === N;
      try {
        const T = l.id, Fe = await he.evaluations(T);
        if (!L()) return;
        c.value = Fe;
        const ge = K ?? Fe[0]?.id;
        if (ge) {
          const Te = await he.evaluation(T, ge);
          if (!L() || Te.id !== (K ?? ge)) return;
          a.value = Te;
        }
      } catch (T) {
        L() && (m.value = D(T));
      }
    }
    async function P(V) {
      const g = ++S, $ = () => j(V) && g === S;
      if (!l.id) {
        m.value = "No extractor selected.";
        return;
      }
      try {
        const L = await he.get(l.id);
        if (!$()) return;
        u.value = L, m.value = "", L.can_edit && await H(V);
      } catch (L) {
        $() && (m.value = D(L));
      }
    }
    fe(() => l.id, (V, g) => {
      R++, K = void 0, b.forEach((L) => L()), b = [], w.value = void 0, u.value = void 0, E.value = null, c.value = [], a.value = void 0, m.value = "";
      const $ = R;
      l.id && (b = [xt(`component.${l.id}`, () => P($)), xt(`docscout.runs.${l.id}`, () => P($))]), g !== void 0 && P($);
    }, { immediate: !0 }), Fl(() => P(R)), Ct(() => {
      R++, b.forEach((V) => V());
    });
    async function O(V) {
      const g = R;
      h.value = !0, m.value = "";
      try {
        const $ = await V();
        if (j(g))
          return await P(g), $;
      } catch ($) {
        j(g) && (m.value = D($));
      } finally {
        h.value = !1;
      }
    }
    const B = (V) => O(() => he.update(l.id, V));
    async function ue(V) {
      const g = R, $ = await O(() => he.addCase(l.id, V));
      $ && j(g) && (w.value = $.id);
    }
    const ye = (V) => O(() => he.deleteCase(l.id, V));
    async function te(V) {
      const g = R;
      d.value = !0, m.value = "";
      try {
        const $ = await he.run(l.id, V);
        j(g) && (E.value = $, await P(g));
      } catch ($) {
        j(g) && (m.value = D($));
      } finally {
        d.value = !1;
      }
    }
    async function oe() {
      const V = R;
      x.value = !0, m.value = "";
      try {
        const { eval_id: g } = await he.evaluate(l.id);
        j(V) && await H(V, g);
      } catch (g) {
        j(V) && (m.value = D(g));
      } finally {
        x.value = !1;
      }
    }
    function be(V) {
      H(R, V);
    }
    return (V, g) => u.value ? (n(), J(jd, {
      key: 0,
      snapshot: u.value,
      "added-case-id": w.value,
      saving: h.value,
      running: d.value,
      starting: x.value,
      result: E.value,
      evaluations: c.value,
      evaluation: a.value,
      error: m.value,
      back: e.back,
      onBack: g[0] || (g[0] = ($) => i("back")),
      onRun: te,
      onSave: B,
      onAddCase: ue,
      onDeleteCase: ye,
      onEvaluate: oe,
      onOpenEvaluation: be
    }, null, 8, ["snapshot", "added-case-id", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : m.value ? (n(), o("p", zd, r(m.value), 1)) : (n(), o("p", Wd, "Loading Docscout…"));
  }
});
export {
  Jd as _,
  Ye as w
};
