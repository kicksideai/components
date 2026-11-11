import { defineComponent as W, useModel as Le, openBlock as a, createElementBlock as o, withModifiers as ve, createElementVNode as t, mergeModels as Xe, computed as F, withKeys as Ee, unref as f, normalizeClass as Q, createVNode as b, toDisplayString as r, Fragment as U, renderList as I, createCommentVNode as y, createTextVNode as q, createBlock as J, ref as M, useId as pe, watch as fe, withDirectives as z, vModelText as _, vModelSelect as Ge, resolveComponent as st, renderSlot as je, withCtx as me, mergeProps as bt, vShow as Ke, onMounted as Ne, nextTick as Ce, normalizeStyle as qe, onBeforeUnmount as Ct, vModelDynamic as dl, toRaw as gt } from "vue";
import { B as rl, L as cl, j as ze, v as Me, k as vl, U as ml, I as ht, f as pl, i as Qe, l as Et, t as lt, h as ke, o as ot, p as fl, m as qt, q as G, M as Ae, r as Nt, w as Ft, x as at, y as bl, z as gl, A as hl, C as yl, D as kl, E as Ut, F as $l, G as Mt, H as xl, J as wl, K as Sl, N as yt, O as Vl, P as et, Q as Cl, R as Oe, S as El, s as de, T as kt, n as $t, V as ql, W as Nl, b as Fl, c as he } from "./index-Co4u6Ww2.js";
import { loadByTagName as Ze, on as xt } from "@wippy-fe/proxy";
import { Icon as R } from "@iconify/vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
var Ul = rl.extend({
  name: "focustrap-directive"
}), Ml = vl.extend({
  style: Ul
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
    var i = Object.getOwnPropertySymbols(e);
    n && (i = i.filter(function(u) {
      return Object.getOwnPropertyDescriptor(e, u).enumerable;
    })), l.push.apply(l, i);
  }
  return l;
}
function St(e) {
  for (var n = 1; n < arguments.length; n++) {
    var l = arguments[n] != null ? arguments[n] : {};
    n % 2 ? wt(Object(l), !0).forEach(function(i) {
      Al(e, i, l[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(l)) : wt(Object(l)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(l, i));
    });
  }
  return e;
}
function Al(e, n, l) {
  return (n = Rl(n)) in e ? Object.defineProperty(e, n, { value: l, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = l, e;
}
function Rl(e) {
  var n = Bl(e, "string");
  return Pe(n) == "symbol" ? n : n + "";
}
function Bl(e, n) {
  if (Pe(e) != "object" || !e) return e;
  var l = e[Symbol.toPrimitive];
  if (l !== void 0) {
    var i = l.call(e, n);
    if (Pe(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(e);
}
var Ll = Ml.extend("focustrap", {
  mounted: function(n, l) {
    var i = l.value || {}, u = i.disabled;
    u || (this.createHiddenFocusableElements(n, l), this.bind(n, l), this.autoElementFocus(n, l)), n.setAttribute("data-pd-focustrap", !0), this.$el = n;
  },
  updated: function(n, l) {
    var i = l.value || {}, u = i.disabled;
    u && this.unbind(n);
  },
  unmounted: function(n) {
    this.unbind(n);
  },
  methods: {
    getComputedSelector: function(n) {
      return ':not(.p-hidden-focusable):not([data-p-hidden-focusable="true"])'.concat(n ?? "");
    },
    bind: function(n, l) {
      var i = this, u = l.value || {}, p = u.onFocusIn, h = u.onFocusOut;
      n.$_pfocustrap_mutationobserver = new MutationObserver(function(d) {
        d.forEach(function(x) {
          if (x.type === "childList" && !n.contains(document.activeElement)) {
            var C = function(c) {
              var s = ht(c) ? ht(c, i.getComputedSelector(n.$_pfocustrap_focusableselector)) ? c : Me(n, i.getComputedSelector(n.$_pfocustrap_focusableselector)) : Me(c);
              return pl(s) ? s : c.nextSibling && C(c.nextSibling);
            };
            ze(C(x.nextSibling));
          }
        });
      }), n.$_pfocustrap_mutationobserver.disconnect(), n.$_pfocustrap_mutationobserver.observe(n, {
        childList: !0
      }), n.$_pfocustrap_focusinlistener = function(d) {
        return p && p(d);
      }, n.$_pfocustrap_focusoutlistener = function(d) {
        return h && h(d);
      }, n.addEventListener("focusin", n.$_pfocustrap_focusinlistener), n.addEventListener("focusout", n.$_pfocustrap_focusoutlistener);
    },
    unbind: function(n) {
      n.$_pfocustrap_mutationobserver && n.$_pfocustrap_mutationobserver.disconnect(), n.$_pfocustrap_focusinlistener && n.removeEventListener("focusin", n.$_pfocustrap_focusinlistener) && (n.$_pfocustrap_focusinlistener = null), n.$_pfocustrap_focusoutlistener && n.removeEventListener("focusout", n.$_pfocustrap_focusoutlistener) && (n.$_pfocustrap_focusoutlistener = null);
    },
    autoFocus: function(n) {
      this.autoElementFocus(this.$el, {
        value: St(St({}, n), {}, {
          autoFocus: !0
        })
      });
    },
    autoElementFocus: function(n, l) {
      var i = l.value || {}, u = i.autoFocusSelector, p = u === void 0 ? "" : u, h = i.firstFocusableSelector, d = h === void 0 ? "" : h, x = i.autoFocus, C = x === void 0 ? !1 : x, w = Me(n, "[autofocus]".concat(this.getComputedSelector(p)));
      C && !w && (w = Me(n, this.getComputedSelector(d))), ze(w);
    },
    onFirstHiddenElementFocus: function(n) {
      var l, i = n.currentTarget, u = n.relatedTarget, p = u === i.$_pfocustrap_lasthiddenfocusableelement || !((l = this.$el) !== null && l !== void 0 && l.contains(u)) ? Me(i.parentElement, this.getComputedSelector(i.$_pfocustrap_focusableselector)) : i.$_pfocustrap_lasthiddenfocusableelement;
      ze(p);
    },
    onLastHiddenElementFocus: function(n) {
      var l, i = n.currentTarget, u = n.relatedTarget, p = u === i.$_pfocustrap_firsthiddenfocusableelement || !((l = this.$el) !== null && l !== void 0 && l.contains(u)) ? cl(i.parentElement, this.getComputedSelector(i.$_pfocustrap_focusableselector)) : i.$_pfocustrap_firsthiddenfocusableelement;
      ze(p);
    },
    createHiddenFocusableElements: function(n, l) {
      var i = this, u = l.value || {}, p = u.tabIndex, h = p === void 0 ? 0 : p, d = u.firstFocusableSelector, x = d === void 0 ? "" : d, C = u.lastFocusableSelector, w = C === void 0 ? "" : C, c = function(S) {
        return ml("span", {
          class: "p-hidden-accessible p-hidden-focusable",
          tabIndex: h,
          role: "presentation",
          "aria-hidden": !0,
          "data-p-hidden-accessible": !0,
          "data-p-hidden-focusable": !0,
          onFocus: S?.bind(i)
        });
      }, s = c(this.onFirstHiddenElementFocus), v = c(this.onLastHiddenElementFocus);
      s.$_pfocustrap_lasthiddenfocusableelement = v, s.$_pfocustrap_focusableselector = x, s.setAttribute("data-pc-section", "firstfocusableelement"), v.$_pfocustrap_firsthiddenfocusableelement = s, v.$_pfocustrap_focusableselector = w, v.setAttribute("data-pc-section", "lastfocusableelement"), n.prepend(s), n.append(v);
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
    const n = Le(e, "modelValue");
    return (l, i) => (a(), o("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": n.value,
      "aria-label": e.label,
      disabled: e.disabled,
      onClick: i[0] || (i[0] = ve((u) => n.value = !n.value, ["stop"]))
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
  setup(e, { emit: n }) {
    const l = e, i = n, u = F(() => Qe(l.config, l.stage)), p = F(() => l.config.stages[l.stage].model), h = F({ get: () => u.value, set: (C) => {
      l.config.stages[l.stage].enabled = C;
    } }), d = F(() => {
      const C = l.config, w = C.stages;
      switch (l.stage) {
        case "map":
          return C.fields.filter((c) => c.search_within === "sections").map((c) => ({ text: c.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...w.prefetch.queries.map((c) => ({ text: c.name || "Untitled query", tone: "" })), ...C.fields.filter((c) => c.search_hints.trim()).map((c) => ({ text: c.name, tone: "hint" }))];
        case "scout":
          return w.scout.mode === "agent" ? w.scout.tools.map((c) => ({ text: lt(c).toLowerCase(), tone: "" })) : [];
        case "deep":
          return C.fields.filter((c) => c.strategy === "deep").map((c) => ({ text: c.name || "New field", tone: "primary" }));
        case "extract":
          return Et(C).map((c) => ({ text: `${c.name} · ${c.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), x = (C) => [`${(C.duration_ms / 1e3).toFixed(1)}s`, `${(C.input_tokens + C.output_tokens).toLocaleString()} tokens`, C.queries?.length ? `${C.queries.length} queries` : "", C.message ?? ""].filter(Boolean).join(" · ");
    return (C, w) => (a(), o("div", {
      class: Q(["node kx-focus-halo", { active: e.active, off: !u.value, fixed: e.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": f(ke)[e.stage],
      onClick: w[1] || (w[1] = (c) => i("select")),
      onKeydown: [
        w[2] || (w[2] = Ee((c) => i("select"), ["enter"])),
        w[3] || (w[3] = Ee(ve((c) => i("select"), ["prevent"]), ["space"]))
      ]
    }, [
      t("span", Tl, [
        b(f(R), {
          icon: f(ot)[e.stage]
        }, null, 8, ["icon"])
      ]),
      t("span", Dl, [
        t("span", Il, r(f(ke)[e.stage]), 1),
        t("span", jl, r(u.value ? f(fl)(e.stage, e.config) : "Off"), 1),
        u.value && d.value.length ? (a(), o("span", zl, [
          (a(!0), o(U, null, I(d.value, (c) => (a(), o("span", {
            key: c.text,
            class: Q(["chip", { primary: c.tone === "primary", "muted-chip": c.tone === "hint" }])
          }, r(c.text), 3))), 128))
        ])) : y("", !0),
        e.trace ? (a(), o("span", Wl, [
          b(f(R), {
            icon: e.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          q(r(x(e.trace)), 1)
        ])) : y("", !0)
      ]),
      t("span", Hl, [
        u.value && p.value ? (a(), o("span", Gl, r(f(qt)(p.value)), 1)) : y("", !0),
        e.stage !== "extract" && !e.readonly ? (a(), J(Z, {
          key: 1,
          modelValue: h.value,
          "onUpdate:modelValue": w[0] || (w[0] = (c) => h.value = c),
          label: `Enable ${f(ke)[e.stage]}`
        }, null, 8, ["modelValue", "label"])) : y("", !0)
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
    const n = e, l = Le(e, "modelValue"), i = M([]);
    function u(p, h) {
      const d = n.options.length - 1, x = { ArrowRight: h + 1, ArrowDown: h + 1, ArrowLeft: h - 1, ArrowUp: h - 1, Home: 0, End: d }[p.key];
      if (x === void 0) return;
      p.preventDefault();
      const C = (x + n.options.length) % n.options.length;
      l.value = n.options[C].value, i.value[C]?.focus();
    }
    return (p, h) => (a(), o("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": e.labelledBy
    }, [
      (a(!0), o(U, null, I(e.options, (d, x) => (a(), o("button", {
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
        onClick: (C) => l.value = d.value,
        onKeydown: (C) => u(C, x)
      }, [
        d.icon ? (a(), J(f(R), {
          key: 0,
          icon: d.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : y("", !0),
        t("span", null, r(d.label), 1)
      ], 40, Ql))), 128))
    ], 8, Kl));
  }
}), ie = (e, n) => `${e}:${n.join("/")}`, At = [
  { value: "text", label: "Text", icon: "tabler:typography" },
  { value: "number", label: "Number", icon: "tabler:123" },
  { value: "boolean", label: "Yes / no", icon: "tabler:toggle-right" },
  { value: "date", label: "Date", icon: "tabler:calendar" },
  { value: "enum", label: "One of a set", icon: "tabler:list-details" },
  { value: "list", label: "List", icon: "tabler:brackets" },
  { value: "object", label: "Object", icon: "tabler:braces" }
], Jl = (e) => At.find((n) => n.value === e).icon;
function Je(e) {
  const n = [];
  function l(i, u, p, h) {
    n.push({ field: u, trail: p, shape: i, path: h, depth: p.length + 1, key: ie(u, p) }), i.properties?.forEach((d, x) => l(d, u, [...p, x], `${h}.${d.name || "New property"}`)), i.item && l(i.item, u, [...p, "item"], `${h}[]`);
  }
  return e.forEach((i, u) => l(i, u, [], G(i) || "New field")), n;
}
function nt(e) {
  return 1 + Math.max(0, ...(e.properties ?? []).map(nt), e.item ? nt(e.item) : 0);
}
function Yl(e, n) {
  return Je(e).filter((l) => l.shape.type === "object" && ((l.shape.properties?.length ?? 0) < 100 || l.field === n.field && ie(l.field, l.trail) === ie(n.field, n.trail.slice(0, -1))) && l.depth + nt(n.shape) <= Ae && !(l.field === n.field && n.trail.every((i, u) => l.trail[u] === i)));
}
function Xl(e, n, l) {
  const i = { ...Ft(), ...n.shape, name: n.shape.name };
  n.trail.length ? Je(e).find((h) => h.key === ie(n.field, n.trail.slice(0, -1))).shape.properties.splice(n.trail.at(-1), 1) : e.splice(n.field, 1);
  let u;
  if (l) {
    const { name: p, type: h, description: d, enum_values: x, expected_format: C, required: w, properties: c, item: s } = i;
    u = { name: p, type: h, description: d, enum_values: x, expected_format: C, required: w, ...c ? { properties: c } : {}, ...s ? { item: s } : {} }, l.shape.properties.push(u), u = l.shape.properties.at(-1);
  } else
    u = { ...at(), ...i, group: "" }, e.push(u), u = e.at(-1);
  return Je(e).find((p) => p.shape === u);
}
function Vt(e, n = !1) {
  function l(u) {
    return u.type === "object" ? Object.fromEntries((u.properties ?? []).map((p) => [p.name || "unnamed", l(p)])) : u.type === "list" ? u.item ? [l(u.item)] : [] : n ? u.enum_values?.length ? u.enum_values[0] : { text: "Example value", number: 42, boolean: !0, date: "2026-01-15", enum: null }[u.type] : u.type === "enum" ? u.enum_values?.join(" | ") || "enum" : u.type;
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
  setup(e, { emit: n }) {
    const l = e, i = n, u = F(() => l.shape), p = F(() => l.named ? l.depth === 1 ? "Field type" : "Property type" : "Item type"), h = F(() => At.filter((A) => l.depth < Ae || !["object", "list"].includes(A.value))), d = F({ get: () => l.shape.type, set: (A) => {
      l.shape.type = A, delete l.shape.properties, delete l.shape.item, l.shape.enum_values = [], A === "object" && (l.shape.properties = []), A === "list" && (l.shape.item = bl());
    } }), x = pe(), C = pe(), w = M(""), c = M("");
    fe(() => l.shape, () => {
      w.value = "", c.value = "";
    });
    const s = F(() => l.validationError || (l.named ? gl(u.value.name, l.siblingNames) : "") || hl(l.shape, l.depth));
    function v() {
      const A = w.value.trim(), S = l.shape.enum_values ?? [];
      if (!A || A.length > 200) {
        c.value = "Enter 1 to 200 characters.";
        return;
      }
      if (S.includes(A)) {
        c.value = "This value already exists.";
        return;
      }
      if (S.length >= 100) {
        c.value = "Use at most 100 allowed values.";
        return;
      }
      l.shape.enum_values = [...S, A], w.value = "", c.value = "";
    }
    return (A, S) => (a(), o("div", Zl, [
      e.named ? (a(), o("label", _l, [
        S[8] || (S[8] = q("Name", -1)),
        z(t("input", {
          "onUpdate:modelValue": S[0] || (S[0] = (N) => u.value.name = N),
          "aria-label": e.depth === 1 ? "Field name" : "Property name",
          "aria-invalid": !!s.value,
          "aria-describedby": s.value ? f(C) : void 0,
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
      ])) : y("", !0),
      t("div", ta, [
        t("span", { id: f(x) }, r(e.named ? "Data type" : "Item type"), 9, la),
        b($e, {
          modelValue: d.value,
          "onUpdate:modelValue": S[1] || (S[1] = (N) => d.value = N),
          class: "type-picker",
          options: h.value,
          "labelled-by": f(x),
          name: p.value,
          disabled: e.readonly
        }, null, 8, ["modelValue", "options", "labelled-by", "name", "disabled"]),
        e.depth === f(Ae) ? (a(), o("small", aa, "Level four · choose a value type.")) : y("", !0)
      ]),
      s.value ? (a(), o("p", {
        key: 1,
        id: f(C),
        class: "field-error",
        role: "alert"
      }, r(s.value), 9, na)) : y("", !0),
      f(yl)(e.shape, e.named) ? (a(), o("div", sa, [
        t("span", null, r(e.shape.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        t("div", oa, [
          (a(!0), o(U, null, I(e.shape.enum_values, (N, K) => (a(), o("span", {
            key: N,
            class: "chip primary"
          }, [
            q(r(N), 1),
            e.readonly ? y("", !0) : (a(), o("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Remove allowed value ${N}`,
              onClick: (D) => e.shape.enum_values.splice(K, 1)
            }, [
              b(f(R), { icon: "tabler:x" })
            ], 8, ia))
          ]))), 128))
        ]),
        e.readonly ? y("", !0) : (a(), o("div", ua, [
          z(t("input", {
            "onUpdate:modelValue": S[2] || (S[2] = (N) => w.value = N),
            "aria-label": "New allowed value",
            placeholder: "Add a value…",
            maxlength: "200",
            onKeydown: Ee(ve(v, ["prevent"]), ["enter"])
          }, null, 40, da), [
            [_, w.value]
          ]),
          t("button", {
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo",
            onClick: v
          }, "Add")
        ])),
        c.value ? (a(), o("p", ra, r(c.value), 1)) : y("", !0)
      ])) : y("", !0),
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
      ["boolean", "enum"].includes(e.shape.type) ? y("", !0) : (a(), o("label", ca, [
        S[10] || (S[10] = q("Expected format", -1)),
        z(t("input", {
          "onUpdate:modelValue": S[4] || (S[4] = (N) => e.shape.expected_format = N),
          maxlength: "400",
          placeholder: f(kl)(e.shape)
        }, null, 8, va), [
          [_, e.shape.expected_format]
        ])
      ])),
      e.named ? (a(), o("div", ma, [
        S[11] || (S[11] = t("span", null, "Required", -1)),
        b(Z, {
          modelValue: u.value.required,
          "onUpdate:modelValue": S[5] || (S[5] = (N) => u.value.required = N),
          label: "Required",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : y("", !0),
      e.shape.type === "object" ? (a(), o(U, { key: 5 }, [
        t("p", pa, r(e.shape.properties?.length ?? 0) + " properties · Select a property in the tree to edit it.", 1),
        !e.readonly && e.depth < f(Ae) ? (a(), o("button", {
          key: 0,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Add property to ${e.label}`,
          disabled: (e.shape.properties?.length ?? 0) >= 100,
          onClick: S[6] || (S[6] = (N) => i("add"))
        }, [
          b(f(R), { icon: "tabler:plus" }),
          S[12] || (S[12] = q("Add property", -1))
        ], 8, fa)) : y("", !0)
      ], 64)) : y("", !0),
      e.shape.type === "list" && e.shape.item ? (a(), o("button", {
        key: 6,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        onClick: S[7] || (S[7] = (N) => i("selectItem"))
      }, [
        b(f(R), { icon: "tabler:brackets" }),
        q("Edit item shape · " + r(e.shape.item.type), 1)
      ])) : y("", !0)
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
  setup(e, { emit: n }) {
    const l = e, i = n, u = F(() => !l.depth || l.depth === 1), p = F(() => Ut(l.field, l.otherNames));
    return (h, d) => (a(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      b(ba, {
        shape: e.shape ?? e.field,
        depth: e.depth ?? 1,
        label: e.shape?.name || e.field.name || "field",
        named: u.value || !!e.shape?.name || !!e.siblingNames,
        "sibling-names": e.siblingNames,
        "validation-error": u.value ? p.value : void 0,
        readonly: e.readonly,
        onAdd: d[0] || (d[0] = (x) => i("add")),
        onSelectItem: d[1] || (d[1] = (x) => i("selectItem"))
      }, null, 8, ["shape", "depth", "label", "named", "sibling-names", "validation-error", "readonly"]),
      u.value ? (a(), o(U, { key: 0 }, [
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
        e.field.strategy === "deep" && !e.deepEnabled ? (a(), o("p", xa, [
          b(f(R), { icon: "tabler:info-circle" }),
          d[18] || (d[18] = q("Deep analysis is off in the flow, so this field runs as standard.", -1))
        ])) : y("", !0),
        t("div", wa, [
          d[19] || (d[19] = t("span", { id: "within-label" }, "Search within", -1)),
          b($e, {
            modelValue: e.field.search_within,
            "onUpdate:modelValue": d[7] || (d[7] = (x) => e.field.search_within = x),
            "labelled-by": "within-label",
            options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
          }, null, 8, ["modelValue"]),
          t("small", null, r(e.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
        ]),
        e.field.search_within === "sections" && !e.mapEnabled ? (a(), o("p", Sa, [
          b(f(R), { icon: "tabler:alert-circle" }),
          d[20] || (d[20] = q("Turn on Map the document to read sections.", -1))
        ])) : y("", !0),
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
            (a(!0), o(U, null, I(e.groups, (x) => (a(), o("option", {
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
          b(Z, {
            modelValue: e.field.evidence_required,
            "onUpdate:modelValue": d[10] || (d[10] = (x) => e.field.evidence_required = x),
            label: "Evidence required",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : y("", !0),
      !e.readonly && (u.value || e.siblingNames) ? (a(), o("button", {
        key: 1,
        type: "button",
        class: "kx-btn kx-btn-danger kx-focus-halo",
        onClick: d[11] || (d[11] = (x) => i("remove"))
      }, r(u.value ? "Remove field" : "Remove property"), 1)) : y("", !0)
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
    const n = M(/* @__PURE__ */ new Set()), l = pe();
    function i(p) {
      n.value.has(p) ? n.value.delete(p) : n.value.add(p);
    }
    const u = (p) => p.indices.length + p.children.reduce((h, d) => h + u(d), 0);
    return (p, h) => {
      const d = st("FieldGroups", !0);
      return a(), o("div", Na, [
        e.node.indices.length ? (a(), o("ul", Fa, [
          (a(!0), o(U, null, I(e.node.indices, (x) => (a(), o("li", { key: x }, [
            je(p.$slots, "default", { index: x })
          ]))), 128))
        ])) : y("", !0),
        (a(!0), o(U, null, I(e.node.children, (x, C) => (a(), o("section", {
          key: x.path,
          class: "field-group",
          "aria-label": `Group ${x.path}`
        }, [
          t("header", Ma, [
            t("button", {
              type: "button",
              class: "tree-toggle kx-iconbtn kx-focus-outline",
              "aria-label": `${n.value.has(x.path) ? "Expand" : "Collapse"} group ${x.path}`,
              "aria-expanded": !n.value.has(x.path),
              "aria-controls": `${f(l)}-${x.path}`,
              onClick: (w) => i(x.path)
            }, [
              b(f(R), {
                icon: n.value.has(x.path) ? "tabler:chevron-right" : "tabler:chevron-down"
              }, null, 8, ["icon"])
            ], 8, Aa),
            je(p.$slots, "header", {
              path: x.path,
              label: x.name,
              count: u(x),
              first: C === 0,
              last: C === e.node.children.length - 1
            }, () => [
              t("span", Ra, r(x.name), 1)
            ])
          ]),
          z(t("div", {
            id: `${f(l)}-${x.path}`,
            class: "group-content"
          }, [
            b(d, { node: x }, {
              default: me((w) => [
                je(p.$slots, "default", bt({ ref_for: !0 }, w))
              ]),
              header: me((w) => [
                je(p.$slots, "header", bt({ ref_for: !0 }, w), () => [
                  t("span", La, r(w.label), 1)
                ])
              ]),
              _: 3
            }, 8, ["node"])
          ], 8, Ba), [
            [Ke, !n.value.has(x.path)]
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
  setup(e, { emit: n }) {
    const l = e, i = n, u = M(l.initialValue), p = M(""), h = M(), d = pe();
    Ne(() => {
      h.value.focus(), h.value.select();
    });
    function x() {
      const C = u.value.trim();
      if (!C || !$l.test(C)) {
        p.value = "Use a dotted path of snake_case group names.";
        return;
      }
      if (C.length > l.maxLength) {
        p.value = "The group and its nested paths must fit within 320 characters.";
        return;
      }
      i("save", C);
    }
    return (C, w) => (a(), o("form", {
      class: "group-path-editor",
      onSubmit: ve(x, ["prevent"])
    }, [
      z(t("input", {
        ref_key: "input",
        ref: h,
        "onUpdate:modelValue": w[0] || (w[0] = (c) => u.value = c),
        "aria-label": e.inputLabel,
        maxlength: e.maxLength,
        "aria-invalid": !!p.value,
        "aria-describedby": p.value ? f(d) : void 0,
        "aria-required": "true",
        autocomplete: "off",
        spellcheck: "false",
        placeholder: "parties.borrower",
        onKeydown: [
          Ee(ve(x, ["prevent"]), ["enter"]),
          w[1] || (w[1] = Ee(ve((c) => i("cancel"), ["stop", "prevent"]), ["esc"]))
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
        b(f(R), { icon: "tabler:check" })
      ], 8, Pa),
      t("button", {
        type: "button",
        class: "kx-iconbtn kx-focus-outline",
        "aria-label": e.cancelLabel,
        title: e.cancelLabel,
        onClick: w[2] || (w[2] = (c) => i("cancel"))
      }, [
        b(f(R), { icon: "tabler:x" })
      ], 8, Ta),
      p.value ? (a(), o("p", {
        key: 0,
        id: f(d),
        class: "field-error",
        role: "alert"
      }, r(p.value), 9, Da)) : y("", !0)
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
  setup(e, { emit: n }) {
    const l = e, i = n, u = M(!1), p = M(!1), h = M(), d = M(), x = M(), C = pe(), w = F(() => [
      { label: "Move up", disabled: l.first, command: () => i("reorder", -1) },
      { label: "Move down", disabled: l.last, command: () => i("reorder", 1) },
      { separator: !0 },
      { label: "Delete group and its fields", command: () => i("remove") }
    ]);
    function c() {
      u.value = !0;
    }
    async function s() {
      u.value = !1, await Ce(), d.value.focus();
    }
    async function v(A) {
      const S = h.value.closest(".field-tree");
      u.value = !1, i("rename", A), await Ce(), S.querySelector(`[data-group-rename="${A}"]`).focus();
    }
    return (A, S) => (a(), o("div", {
      ref_key: "heading",
      ref: h,
      class: "group-heading"
    }, [
      u.value ? (a(), J(Rt, {
        key: 0,
        "initial-value": e.path,
        "input-label": `Group path for ${e.path}`,
        "save-label": "Save group name",
        "cancel-label": "Cancel group rename",
        "max-length": e.maxLength,
        onSave: v,
        onCancel: s
      }, null, 8, ["initial-value", "input-label", "max-length"])) : (a(), o(U, { key: 1 }, [
        e.readonly ? (a(), o("span", {
          key: 0,
          class: "group-title",
          title: e.path
        }, r(e.name), 9, Ia)) : (a(), o("button", {
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
          b(f(R), {
            icon: "tabler:pencil",
            "aria-hidden": "true"
          })
        ], 8, ja)),
        t("span", {
          class: "count group-count",
          "aria-label": `${e.count} fields`
        }, r(e.count), 9, za),
        e.readonly ? y("", !0) : (a(), o("div", Wa, [
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Add field to ${e.path}`,
            disabled: !e.canAdd,
            title: "Add field",
            onClick: S[0] || (S[0] = (N) => i("add"))
          }, [
            b(f(R), { icon: "tabler:plus" })
          ], 8, Ha),
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Actions for group ${e.path}`,
            "aria-haspopup": "menu",
            "aria-expanded": p.value,
            "aria-controls": f(C),
            onClick: S[1] || (S[1] = (N) => x.value.toggle(N))
          }, [
            b(f(R), { icon: "tabler:dots" })
          ], 8, Ga),
          b(f(Mt), {
            id: f(C),
            ref_key: "menu",
            ref: x,
            model: w.value,
            popup: "",
            "append-to": "self",
            onShow: S[2] || (S[2] = (N) => p.value = !0),
            onHide: S[3] || (S[3] = (N) => p.value = !1)
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
  setup(e, { emit: n }) {
    const l = e, i = n, u = pe(), p = pe(), h = M(), d = M(!1), x = F(() => [
      { label: "Move up", disabled: l.first, command: () => i("reorder", l.field, l.trail, -1) },
      { label: "Move down", disabled: l.last, command: () => i("reorder", l.field, l.trail, 1) }
    ]), C = M(!0);
    fe(() => l.selected, (S) => {
      const N = ie(l.field, l.trail);
      S !== N && S.startsWith(N + (l.trail.length ? "/" : "")) && (C.value = !0);
    });
    const w = F(() => l.trail.at(-1) !== "item"), c = F(() => w.value ? l.shape.name || "New field" : "Each item"), s = F(() => l.trail.length ? void 0 : l.shape), v = F(() => l.shape.type === "object" || l.shape.type === "list");
    function A(S) {
      S.key === "ArrowRight" && v.value && (C.value = !0, S.preventDefault(), S.stopPropagation()), S.key === "ArrowLeft" && v.value && (C.value = !1, S.preventDefault(), S.stopPropagation());
    }
    return (S, N) => {
      const K = st("ShapeTree", !0);
      return a(), o("div", {
        class: "shape-tree-node",
        onKeydown: A
      }, [
        t("div", {
          class: Q(["row-item", { active: e.selected === f(ie)(e.field, e.trail) }])
        }, [
          v.value ? (a(), o("button", {
            key: 0,
            class: "tree-toggle kx-iconbtn kx-focus-outline",
            type: "button",
            "aria-label": `${C.value ? "Collapse" : "Expand"} ${e.path}`,
            "aria-expanded": C.value,
            onClick: N[0] || (N[0] = (D) => C.value = !C.value)
          }, [
            b(f(R), {
              icon: C.value ? "tabler:chevron-down" : "tabler:chevron-right"
            }, null, 8, ["icon"])
          ], 8, Qa)) : (a(), o("span", Ja)),
          t("button", {
            type: "button",
            class: "row-main kx-focus-halo",
            "aria-label": `Edit ${e.path}`,
            "aria-describedby": f(u),
            "aria-current": e.selected === f(ie)(e.field, e.trail) ? "true" : void 0,
            onClick: N[1] || (N[1] = (D) => i("select", e.field, e.trail))
          }, [
            t("span", Xa, [
              t("span", Za, [
                b(f(R), {
                  icon: f(Jl)(e.shape.type),
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                t("span", {
                  class: "row-label",
                  title: c.value
                }, r(c.value), 9, _a),
                e.error ? (a(), J(f(R), {
                  key: 0,
                  icon: "tabler:alert-circle",
                  class: "row-warn",
                  "aria-label": e.error,
                  title: e.error
                }, null, 8, ["aria-label", "title"])) : y("", !0)
              ]),
              t("span", {
                id: f(u),
                class: Q(["row-desc", { missing: !e.shape.description }]),
                title: e.shape.description || void 0
              }, r(e.shape.description || "No description"), 11, en)
            ]),
            t("span", tn, [
              t("span", ln, r(e.shape.type), 1),
              t("span", an, [
                w.value && e.shape.required ? (a(), o("span", nn, [
                  b(f(R), {
                    icon: "tabler:asterisk",
                    "aria-hidden": "true"
                  })
                ])) : y("", !0),
                s.value?.strategy === "deep" ? (a(), o("span", sn, [
                  b(f(R), {
                    icon: "tabler:microscope",
                    "aria-hidden": "true"
                  })
                ])) : y("", !0),
                s.value?.search_within === "sections" ? (a(), o("span", on, [
                  b(f(R), {
                    icon: "tabler:layout-list",
                    "aria-hidden": "true"
                  })
                ])) : y("", !0),
                s.value?.evidence_required ? (a(), o("span", un, [
                  b(f(R), {
                    icon: "tabler:file-search",
                    "aria-hidden": "true"
                  })
                ])) : y("", !0)
              ])
            ])
          ], 8, Ya),
          !e.readonly && w.value ? (a(), o("span", dn, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} up`,
              disabled: e.first,
              onClick: N[2] || (N[2] = (D) => i("reorder", e.field, e.trail, -1))
            }, [
              b(f(R), { icon: "tabler:chevron-up" })
            ], 8, rn),
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} down`,
              disabled: e.last,
              onClick: N[3] || (N[3] = (D) => i("reorder", e.field, e.trail, 1))
            }, [
              b(f(R), { icon: "tabler:chevron-down" })
            ], 8, cn)
          ])) : y("", !0),
          !e.readonly && w.value ? (a(), o("div", {
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
              "aria-controls": f(p),
              onClick: N[4] || (N[4] = (D) => h.value.toggle(D))
            }, [
              b(f(R), { icon: "tabler:dots" })
            ], 8, vn),
            b(f(Mt), {
              id: f(p),
              ref_key: "menu",
              ref: h,
              model: x.value,
              popup: "",
              "append-to": "self",
              onShow: N[5] || (N[5] = (D) => d.value = !0),
              onHide: N[6] || (N[6] = (D) => d.value = !1)
            }, null, 8, ["id", "model"])
          ], 32)) : y("", !0)
        ], 2),
        v.value && C.value ? (a(), o("ul", mn, [
          (a(!0), o(U, null, I(e.shape.properties, (D, j) => (a(), o("li", { key: j }, [
            b(K, {
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
          e.shape.item ? (a(), o("li", pn, [
            b(K, {
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
          ])) : y("", !0),
          !e.readonly && e.shape.type === "object" && e.trail.length + 1 < f(Ae) ? (a(), o("li", fn, [
            t("button", {
              type: "button",
              class: "kx-btn kx-btn-ghost kx-focus-halo sm",
              "aria-label": `Add property to ${e.path}`,
              disabled: (e.shape.properties?.length ?? 0) >= 100,
              onClick: N[14] || (N[14] = (D) => i("add", e.field, e.trail))
            }, [
              b(f(R), { icon: "tabler:plus" }),
              N[15] || (N[15] = q("Add property", -1))
            ], 8, bn)
          ])) : y("", !0)
        ])) : y("", !0)
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
  setup(e, { emit: n }) {
    const l = n, i = M(!!customElements.get("wc-agent-picker")), u = M("");
    Ne(async () => {
      if (!i.value)
        try {
          await Ze("wc-agent-picker", { timeoutMs: 8e3 }), i.value = !0;
        } catch (h) {
          u.value = h instanceof Error ? h.message : String(h);
        }
    });
    function p(h) {
      if (h.composedPath()[0] !== h.currentTarget) return;
      const d = h.detail;
      l("select", d.agent_id);
    }
    return (h, d) => (a(), o("div", hn, [
      d[0] || (d[0] = t("span", null, "Scout agent", -1)),
      e.readonly ? (a(), o("p", yn, r(e.value || "Built-in scout"), 1)) : i.value ? (a(), o("wc-agent-picker", {
        key: 1,
        config: JSON.stringify({ agent_id: e.value || "" }),
        "aria-label": "Scout agent",
        placeholder: "Choose your agent…",
        onChange: p
      }, null, 40, kn)) : u.value ? (a(), o("p", $n, "Could not load agent picker: " + r(u.value), 1)) : (a(), o("span", xn, "Loading agents…")),
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
  setup(e, { emit: n }) {
    const l = n, i = M(!!customElements.get("wc-model-picker")), u = M("");
    Ne(async () => {
      if (!i.value)
        try {
          await Ze("wc-model-picker", { timeoutMs: 8e3 }), i.value = !0;
        } catch (h) {
          u.value = h instanceof Error ? h.message : String(h);
        }
    });
    function p(h) {
      const d = h.detail;
      typeof d == "string" && l("select", d);
    }
    return (h, d) => i.value ? (a(), o("wc-model-picker", {
      key: 0,
      value: e.value,
      capability: e.capability,
      "aria-labelledby": e.labelledBy,
      onSelect: p
    }, null, 40, Sn)) : u.value ? (a(), o("p", Vn, "Could not load model picker: " + r(u.value), 1)) : (a(), o("span", Cn, "Loading models…"));
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
    const n = e, l = Le(e, "modelValue"), i = F(() => n.percent ? `${Math.round(l.value * 100)}%` : `${l.value.toLocaleString()}${n.unit ? ` ${n.unit}` : ""}`), u = (d) => n.log ? Math.log(d / n.min) / Math.log(n.max / n.min) * Se : (d - n.min) / (n.max - n.min) * Se;
    function p(d) {
      const x = n.log ? n.min * Math.pow(n.max / n.min, d / Se) : n.min + (n.max - n.min) * d / Se, C = Math.round(x / n.step) * n.step;
      return Math.min(n.max, Math.max(n.min, Number(C.toFixed(4))));
    }
    const h = F({ get: () => Math.round(u(l.value)), set: (d) => {
      l.value = p(d);
    } });
    return (d, x) => (a(), o("div", En, [
      t("div", qn, [
        t("span", null, r(e.label), 1),
        t("output", Nn, r(i.value), 1)
      ]),
      z(t("input", {
        "onUpdate:modelValue": x[0] || (x[0] = (C) => h.value = C),
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
      e.hints ? (a(), o("div", Un, [
        t("span", null, r(e.hints[0]), 1),
        t("span", null, r(e.hints[1]), 1)
      ])) : y("", !0),
      e.note ? (a(), o("small", Mn, r(e.note), 1)) : y("", !0)
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
    const n = e;
    return (l, i) => (a(), o("figure", An, [
      t("div", Rn, [
        i[2] || (i[2] = t("span", { class: "fd-node solid" }, "Pass", -1)),
        (a(!0), o(U, null, I(Math.min(n.rounds, 8), (u) => (a(), o(U, { key: u }, [
          i[0] || (i[0] = t("span", { class: "fd-link" }, null, -1)),
          t("span", Bn, [
            t("span", null, "R" + r(u), 1),
            t("span", Ln, [
              (a(!0), o(U, null, I(Math.min(n.extra, 6), (p) => (a(), o("i", { key: p }))), 128))
            ])
          ])
        ], 64))), 128)),
        n.rounds > 8 ? (a(), o(U, { key: 0 }, [
          i[1] || (i[1] = t("span", { class: "fd-link" }, null, -1)),
          t("span", On, "+" + r(n.rounds - 8), 1)
        ], 64)) : y("", !0),
        i[3] || (i[3] = t("span", { class: "fd-link" }, null, -1)),
        t("span", Pn, "≥ " + r(Math.round(n.confidence * 100)) + "%", 1)
      ]),
      t("figcaption", null, r(n.rounds ? `One pass, then up to ${n.rounds} rounds with up to ${n.extra} new queries each, stopping as soon as confidence reaches ${Math.round(n.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
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
    const n = e, l = F(() => Math.min(n.queries * n.perQuery, n.cap));
    return (i, u) => (a(), o("figure", Dn, [
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
    const n = e, l = F(() => n.config.stages), i = (c) => Vl(n.stage, c), u = xl(), p = F(() => n.config.fields.filter((c) => c.strategy === "deep").length), h = F(() => n.config.fields.filter((c) => c.search_within === "sections").map((c) => c.name || "New field")), d = F(() => Et(n.config));
    function x(c) {
      l.value.verify.check_support = c, c || (l.value.verify.check_completeness = !1);
    }
    function C(c) {
      c ? l.value.scout.agent_id = c : delete l.value.scout.agent_id;
    }
    function w(c, s) {
      const v = l.value.scout.tools.filter((A) => A !== c);
      l.value.scout.tools = s ? [...v, c] : v;
    }
    return (c, s) => (a(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", Qn, r(f(wl)[e.stage]), 1),
      e.stage === "map" ? (a(), o(U, { key: 0 }, [
        t("div", Jn, [
          s[33] || (s[33] = t("span", null, "Stage enabled", -1)),
          b(Z, {
            modelValue: l.value.map.enabled,
            "onUpdate:modelValue": s[0] || (s[0] = (v) => l.value.map.enabled = v),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Yn, [
          s[34] || (s[34] = t("span", { id: "outline-label" }, "Outline", -1)),
          b($e, {
            modelValue: l.value.map.outline,
            "onUpdate:modelValue": s[1] || (s[1] = (v) => l.value.map.outline = v),
            "labelled-by": "outline-label",
            options: [{ value: "find_or_build", label: "Use contents first" }, { value: "build", label: "Always build" }]
          }, null, 8, ["modelValue"]),
          s[35] || (s[35] = t("small", null, "The document's own headings are used when it has them; otherwise the model builds an outline.", -1))
        ]),
        t("div", Xn, [
          s[36] || (s[36] = t("span", null, [
            q("Section summaries"),
            t("small", null, "A short summary per section helps pick the right sections in long documents.")
          ], -1)),
          b(Z, {
            modelValue: l.value.map.section_summaries,
            "onUpdate:modelValue": s[2] || (s[2] = (v) => l.value.map.section_summaries = v),
            label: "Section summaries",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s[38] || (s[38] = t("h4", null, "Models", -1)),
        t("div", Zn, [
          s[37] || (s[37] = t("span", null, "Outliner", -1)),
          b(ce, {
            value: l.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: s[3] || (s[3] = (v) => l.value.map.model = v)
          }, null, 8, ["value"])
        ]),
        s[39] || (s[39] = t("h4", null, "Fields that read sections", -1)),
        h.value.length ? (a(), o("p", _n, [
          (a(!0), o(U, null, I(h.value, (v) => (a(), o("span", {
            key: v,
            class: "chip primary"
          }, r(v), 1))), 128))
        ])) : (a(), o("p", es, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : y("", !0),
      e.stage === "prefetch" ? (a(), o(U, { key: 1 }, [
        t("div", ts, [
          s[40] || (s[40] = t("span", null, "Stage enabled", -1)),
          b(Z, {
            modelValue: l.value.prefetch.enabled,
            "onUpdate:modelValue": s[4] || (s[4] = (v) => l.value.prefetch.enabled = v),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s[44] || (s[44] = t("h4", null, "Queries", -1)),
        (a(!0), o(U, null, I(l.value.prefetch.queries, (v, A) => (a(), o("div", {
          key: A,
          class: "query-row"
        }, [
          t("div", ls, [
            t("label", null, [
              s[41] || (s[41] = q("Name", -1)),
              z(t("input", {
                "onUpdate:modelValue": (S) => v.name = S,
                placeholder: "Parties"
              }, null, 8, as), [
                [_, v.name]
              ])
            ]),
            t("label", null, [
              s[42] || (s[42] = q("Chunks", -1)),
              z(t("input", {
                "onUpdate:modelValue": (S) => v.chunks = S,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, ns), [
                [
                  _,
                  v.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          t("label", null, [
            s[43] || (s[43] = q("Query", -1)),
            z(t("textarea", {
              "onUpdate:modelValue": (S) => v.query = S,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, ss), [
              [_, v.query]
            ])
          ]),
          e.readonly ? y("", !0) : (a(), o("button", {
            key: 0,
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo sm",
            onClick: (S) => l.value.prefetch.queries.splice(A, 1)
          }, "Remove query", 8, os))
        ]))), 128)),
        l.value.prefetch.queries.length ? y("", !0) : (a(), o("p", is, "No fixed queries. Field search hints still run.")),
        e.readonly ? y("", !0) : (a(), o("button", {
          key: 1,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          onClick: s[5] || (s[5] = (v) => l.value.prefetch.queries.push(f(Sl)()))
        }, "Add query"))
      ], 64)) : y("", !0),
      e.stage === "scout" ? (a(), o(U, { key: 2 }, [
        t("div", us, [
          s[45] || (s[45] = t("span", null, "Stage enabled", -1)),
          b(Z, {
            modelValue: l.value.scout.enabled,
            "onUpdate:modelValue": s[6] || (s[6] = (v) => l.value.scout.enabled = v),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", ds, [
          s[46] || (s[46] = t("span", { id: "mode-label" }, "Mode", -1)),
          b($e, {
            modelValue: l.value.scout.mode,
            "onUpdate:modelValue": s[7] || (s[7] = (v) => l.value.scout.mode = v),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          t("small", null, r(l.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        l.value.scout.mode === "agent" ? (a(), J(wn, {
          key: 0,
          value: l.value.scout.agent_id,
          readonly: e.readonly,
          onSelect: C
        }, null, 8, ["value", "readonly"])) : y("", !0),
        l.value.scout.mode === "loop" ? (a(), J(Tn, {
          key: 1,
          rounds: l.value.scout.max_rounds,
          confidence: l.value.scout.target_confidence,
          extra: l.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"])) : y("", !0),
        s[51] || (s[51] = t("h4", null, "Models", -1)),
        t("div", rs, [
          s[47] || (s[47] = t("span", null, "Scout", -1)),
          b(ce, {
            value: l.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: s[8] || (s[8] = (v) => l.value.scout.model = v)
          }, null, 8, ["value"])
        ]),
        s[52] || (s[52] = t("h4", null, "Loop", -1)),
        b(le, {
          modelValue: l.value.scout.max_rounds,
          "onUpdate:modelValue": s[9] || (s[9] = (v) => l.value.scout.max_rounds = v),
          label: l.value.scout.mode === "agent" ? "Rounds" : "Follow-up rounds",
          min: i("max_rounds").min,
          max: i("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        l.value.scout.mode === "loop" ? (a(), J(le, {
          key: 2,
          modelValue: l.value.scout.target_confidence,
          "onUpdate:modelValue": s[10] || (s[10] = (v) => l.value.scout.target_confidence = v),
          label: "Stop at confidence",
          min: i("target_confidence").min,
          max: i("target_confidence").max,
          step: 0.05,
          percent: "",
          hints: ["Stop early", "Keep looking"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])) : y("", !0),
        b(le, {
          modelValue: l.value.scout.max_extra_queries,
          "onUpdate:modelValue": s[11] || (s[11] = (v) => l.value.scout.max_extra_queries = v),
          label: l.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: i("max_extra_queries").min,
          max: i("max_extra_queries").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        b(le, {
          modelValue: l.value.scout.max_tokens,
          "onUpdate:modelValue": s[12] || (s[12] = (v) => l.value.scout.max_tokens = v),
          label: "Scout output limit",
          min: i("max_tokens").min,
          max: i("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        l.value.scout.mode === "agent" ? (a(), o("p", cs, "Tool budget: " + r(l.value.scout.max_rounds * l.value.scout.max_extra_queries) + " calls.", 1)) : y("", !0),
        l.value.scout.mode === "loop" ? (a(), o("div", vs, [
          s[48] || (s[48] = t("span", null, [
            q("Drop noisy chunks"),
            t("small", null, "Chunks no field needs leave the evidence pool; chunks cited for a field always stay.")
          ], -1)),
          b(Z, {
            modelValue: l.value.scout.drop_noise,
            "onUpdate:modelValue": s[13] || (s[13] = (v) => l.value.scout.drop_noise = v),
            label: "Drop noisy chunks",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])) : y("", !0),
        t("div", ms, [
          s[49] || (s[49] = t("span", null, [
            q("Share scout notes with extraction"),
            t("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          b(Z, {
            modelValue: l.value.scout.share_notes,
            "onUpdate:modelValue": s[14] || (s[14] = (v) => l.value.scout.share_notes = v),
            label: "Share scout notes with extraction",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l.value.scout.mode === "agent" ? (a(), o(U, { key: 5 }, [
          s[50] || (s[50] = t("h4", null, "Agent tools", -1)),
          (a(!0), o(U, null, I(f(u), (v) => (a(), o("div", {
            key: v,
            class: "toggle-row"
          }, [
            t("span", null, r(f(lt)(v)), 1),
            b(Z, {
              "model-value": l.value.scout.tools.includes(v),
              label: f(lt)(v),
              disabled: e.readonly,
              "onUpdate:modelValue": (A) => w(v, A)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : y("", !0)
      ], 64)) : y("", !0),
      e.stage === "deep" ? (a(), o(U, { key: 3 }, [
        t("div", ps, [
          s[53] || (s[53] = t("span", null, "Stage enabled", -1)),
          b(Z, {
            modelValue: l.value.deep.enabled,
            "onUpdate:modelValue": s[15] || (s[15] = (v) => l.value.deep.enabled = v),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        b(Gn, {
          fields: p.value,
          parallel: l.value.deep.parallel_fields,
          queries: l.value.deep.max_queries,
          "per-query": l.value.deep.chunks_per_query,
          cap: l.value.deep.chunk_cap
        }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"]),
        t("div", fs, [
          s[54] || (s[54] = t("span", { id: "read-label" }, "Reads", -1)),
          b($e, {
            modelValue: l.value.deep.read,
            "onUpdate:modelValue": s[16] || (s[16] = (v) => l.value.deep.read = v),
            "labelled-by": "read-label",
            options: [{ value: "chunks", label: "Retrieved chunks" }, { value: "sections", label: "Whole sections" }]
          }, null, 8, ["modelValue"]),
          s[55] || (s[55] = t("small", null, "Whole sections suit clauses that span many passages; long sections fall back to chunks.", -1))
        ]),
        s[58] || (s[58] = t("h4", null, "Models", -1)),
        t("div", bs, [
          s[56] || (s[56] = t("span", null, "Analysis", -1)),
          b(ce, {
            value: l.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: s[17] || (s[17] = (v) => l.value.deep.model = v)
          }, null, 8, ["value"])
        ]),
        t("div", gs, [
          s[57] || (s[57] = t("span", null, "Query writer", -1)),
          b(ce, {
            value: l.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: s[18] || (s[18] = (v) => l.value.deep.query_model = v)
          }, null, 8, ["value"])
        ]),
        s[59] || (s[59] = t("h4", null, "Reach", -1)),
        b(le, {
          modelValue: l.value.deep.parallel_fields,
          "onUpdate:modelValue": s[19] || (s[19] = (v) => l.value.deep.parallel_fields = v),
          label: "Fields at a time",
          min: i("parallel_fields").min,
          max: i("parallel_fields").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(le, {
          modelValue: l.value.deep.max_queries,
          "onUpdate:modelValue": s[20] || (s[20] = (v) => l.value.deep.max_queries = v),
          label: "Queries per field",
          min: i("max_queries").min,
          max: i("max_queries").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(le, {
          modelValue: l.value.deep.chunks_per_query,
          "onUpdate:modelValue": s[21] || (s[21] = (v) => l.value.deep.chunks_per_query = v),
          label: "Chunks per query",
          min: i("chunks_per_query").min,
          max: i("chunks_per_query").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(le, {
          modelValue: l.value.deep.chunk_cap,
          "onUpdate:modelValue": s[22] || (s[22] = (v) => l.value.deep.chunk_cap = v),
          label: "Chunk cap per field",
          min: i("chunk_cap").min,
          max: i("chunk_cap").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(le, {
          modelValue: l.value.deep.min_similarity,
          "onUpdate:modelValue": s[23] || (s[23] = (v) => l.value.deep.min_similarity = v),
          label: "Minimum similarity",
          min: i("min_similarity").min,
          max: i("min_similarity").max,
          step: 0.05,
          percent: "",
          hints: ["Loose", "Strict"],
          note: "Chunks less similar than this are skipped.",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        s[60] || (s[60] = t("h4", null, "Temperature", -1)),
        b(le, {
          modelValue: l.value.deep.query_temperature,
          "onUpdate:modelValue": s[24] || (s[24] = (v) => l.value.deep.query_temperature = v),
          label: "Query writing",
          min: i("query_temperature").min,
          max: i("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(le, {
          modelValue: l.value.deep.analysis_temperature,
          "onUpdate:modelValue": s[25] || (s[25] = (v) => l.value.deep.analysis_temperature = v),
          label: "Analysis",
          min: i("analysis_temperature").min,
          max: i("analysis_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : y("", !0),
      e.stage === "extract" ? (a(), o(U, { key: 4 }, [
        s[62] || (s[62] = t("h4", null, "Models", -1)),
        t("div", hs, [
          s[61] || (s[61] = t("span", null, "Extraction", -1)),
          b(ce, {
            value: l.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: s[26] || (s[26] = (v) => l.value.extract.model = v)
          }, null, 8, ["value"])
        ]),
        s[63] || (s[63] = t("h4", null, "Field groups", -1)),
        t("ul", ys, [
          (a(!0), o(U, null, I(d.value, (v) => (a(), o("li", {
            key: v.name
          }, [
            t("span", null, r(v.name), 1),
            t("span", ks, r(v.fields.length) + " field" + r(v.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        d.value.length ? y("", !0) : (a(), o("p", $s, "No fields yet.")),
        b(le, {
          modelValue: l.value.extract.max_fields_per_call,
          "onUpdate:modelValue": s[27] || (s[27] = (v) => l.value.extract.max_fields_per_call = v),
          label: "Fields per call",
          min: i("max_fields_per_call").min,
          max: i("max_fields_per_call").max,
          disabled: e.readonly,
          note: `${f(yt)(e.config)} extraction call${f(yt)(e.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        b(le, {
          modelValue: l.value.extract.max_output_tokens,
          "onUpdate:modelValue": s[28] || (s[28] = (v) => l.value.extract.max_output_tokens = v),
          label: "Output limit",
          min: i("max_output_tokens").min,
          max: i("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : y("", !0),
      e.stage === "verify" ? (a(), o(U, { key: 5 }, [
        t("div", xs, [
          s[64] || (s[64] = t("span", null, "Stage enabled", -1)),
          b(Z, {
            modelValue: l.value.verify.enabled,
            "onUpdate:modelValue": s[29] || (s[29] = (v) => l.value.verify.enabled = v),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", ws, [
          s[65] || (s[65] = t("span", null, [
            q("Quotes exist"),
            t("small", null, "Each quote is matched against the document text. No model call.")
          ], -1)),
          b(Z, {
            modelValue: l.value.verify.check_quotes,
            "onUpdate:modelValue": s[30] || (s[30] = (v) => l.value.verify.check_quotes = v),
            label: "Quotes exist",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Ss, [
          s[66] || (s[66] = t("span", null, [
            q("Quotes support values"),
            t("small", null, "A model confirms each quote supports its value.")
          ], -1)),
          b(Z, {
            "model-value": l.value.verify.check_support,
            "onUpdate:modelValue": x,
            label: "Quotes support values",
            disabled: e.readonly
          }, null, 8, ["model-value", "disabled"])
        ]),
        l.value.verify.check_support ? (a(), o(U, { key: 0 }, [
          t("div", Vs, [
            s[67] || (s[67] = t("span", null, [
              q("Check completeness"),
              t("small", null, "Check the requested text and lists against additional source passages. Adds input tokens; completeness can remain unknown.")
            ], -1)),
            b(Z, {
              "model-value": l.value.verify.check_completeness === !0,
              "onUpdate:modelValue": s[31] || (s[31] = (v) => l.value.verify.check_completeness = v),
              label: "Check completeness",
              disabled: e.readonly
            }, null, 8, ["model-value", "disabled"])
          ]),
          s[69] || (s[69] = t("h4", null, "Models", -1)),
          t("div", Cs, [
            s[68] || (s[68] = t("span", null, "Checker", -1)),
            b(ce, {
              value: l.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: s[32] || (s[32] = (v) => l.value.verify.model = v)
            }, null, 8, ["value"])
          ])
        ], 64)) : y("", !0)
      ], 64)) : y("", !0)
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
    const n = e, l = F(() => Math.min(0.9, Math.max(0, n.overlap / n.size))), i = F(() => {
      const u = 100 / (3 - 2 * l.value);
      return [0, 1, 2].map((p) => ({ x: p * u * (1 - l.value), w: u }));
    });
    return (u, p) => (a(), o("figure", qs, [
      (a(), o("svg", Ns, [
        (a(!0), o(U, null, I(i.value, (h, d) => (a(), o("rect", {
          key: d,
          x: h.x,
          y: d % 2 ? 14 : 4,
          width: h.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, Fs))), 128)),
        (a(), o(U, null, I([1, 2], (h) => t("rect", {
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
    const n = e, l = F(() => n.config.retrieval), i = F({ get: () => n.config.retention ?? "", set: (w) => {
      w.trim() ? n.config.retention = w.trim() : delete n.config.retention;
    } }), u = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], p = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], h = et("chunk_size"), d = et("overlap"), x = et("section_budget"), C = F(() => Math.min(d.max, l.value.chunk_size - 50));
    return (w, c) => (a(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", Rs, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + r(e.retention) + ".", 1),
      t("label", null, [
        c[12] || (c[12] = q("Retention window", -1)),
        z(t("input", {
          "onUpdate:modelValue": c[0] || (c[0] = (s) => i.value = s),
          "aria-label": "Retention window",
          placeholder: "Global setting"
        }, null, 512), [
          [_, i.value]
        ]),
        c[13] || (c[13] = t("small", null, "Duration for new processed documents and runs, for example 24h. Leave empty to use the global Docscout setting. Existing records keep their expiry.", -1))
      ]),
      c[22] || (c[22] = t("h4", null, "Chunks", -1)),
      b(Ms, {
        size: l.value.chunk_size,
        overlap: l.value.overlap
      }, null, 8, ["size", "overlap"]),
      b(le, {
        modelValue: l.value.chunk_size,
        "onUpdate:modelValue": c[1] || (c[1] = (s) => l.value.chunk_size = s),
        label: "Chunk size",
        min: f(h).min,
        max: f(h).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      b(le, {
        modelValue: l.value.overlap,
        "onUpdate:modelValue": c[2] || (c[2] = (s) => l.value.overlap = s),
        label: "Overlap",
        min: f(d).min,
        max: C.value,
        step: 10,
        unit: "tokens",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      t("div", Bs, [
        c[14] || (c[14] = t("span", null, [
          q("Split by headings"),
          t("small", null, "A chunk never crosses a heading.")
        ], -1)),
        b(Z, {
          modelValue: l.value.split_headings,
          "onUpdate:modelValue": c[3] || (c[3] = (s) => l.value.split_headings = s),
          label: "Split by headings",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t("div", Ls, [
        c[15] || (c[15] = t("span", null, [
          q("Keep tables whole"),
          t("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        b(Z, {
          modelValue: l.value.keep_tables,
          "onUpdate:modelValue": c[4] || (c[4] = (s) => l.value.keep_tables = s),
          label: "Keep tables whole",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      b(le, {
        modelValue: l.value.section_budget,
        "onUpdate:modelValue": c[5] || (c[5] = (s) => l.value.section_budget = s),
        label: "Section budget",
        min: f(x).min,
        max: f(x).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      c[23] || (c[23] = t("h4", null, "Context", -1)),
      t("div", Os, [
        c[16] || (c[16] = t("span", { id: "context-label" }, "Chunk context", -1)),
        b($e, {
          modelValue: l.value.context,
          "onUpdate:modelValue": c[6] || (c[6] = (s) => l.value.context = s),
          "labelled-by": "context-label",
          options: p
        }, null, 8, ["modelValue"]),
        t("small", null, r(p.find((s) => s.value === l.value.context)?.note), 1)
      ]),
      l.value.context === "generated" ? (a(), o("div", Ps, [
        c[17] || (c[17] = t("span", null, "Context writer", -1)),
        b(ce, {
          value: l.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: c[7] || (c[7] = (s) => l.value.context_model = s)
        }, null, 8, ["value"])
      ])) : y("", !0),
      c[24] || (c[24] = t("h4", null, "Search", -1)),
      t("div", Ts, [
        c[18] || (c[18] = t("span", { id: "mode-label" }, "Search mode", -1)),
        b($e, {
          modelValue: l.value.search_mode,
          "onUpdate:modelValue": c[8] || (c[8] = (s) => l.value.search_mode = s),
          "labelled-by": "mode-label",
          options: u
        }, null, 8, ["modelValue"]),
        t("small", null, r(u.find((s) => s.value === l.value.search_mode)?.note), 1)
      ]),
      c[25] || (c[25] = t("h4", null, "Models", -1)),
      t("div", Ds, [
        c[19] || (c[19] = t("span", null, "Embedding", -1)),
        b(ce, {
          value: l.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: c[9] || (c[9] = (s) => l.value.embedding_model = s)
        }, null, 8, ["value"])
      ]),
      t("div", Is, [
        c[20] || (c[20] = t("span", null, [
          q("Highlighter"),
          t("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        b(Z, {
          modelValue: l.value.highlighter,
          "onUpdate:modelValue": c[10] || (c[10] = (s) => l.value.highlighter = s),
          label: "Highlighter",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      l.value.highlighter ? (a(), o("div", js, [
        c[21] || (c[21] = t("span", null, "Highlighter", -1)),
        b(ce, {
          value: l.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: c[11] || (c[11] = (s) => l.value.highlighter_model = s)
        }, null, 8, ["value"])
      ])) : y("", !0)
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
    const n = e, l = Le(e, "title"), i = Le(e, "description"), u = M({ kind: "document" });
    function p(k, m) {
      try {
        const E = localStorage.getItem(`docscout.${k}`);
        return E === null ? m : E === "1";
      } catch {
        return m;
      }
    }
    function h(k, m) {
      try {
        localStorage.setItem(`docscout.${k}`, m ? "1" : "0");
      } catch {
      }
    }
    const d = M(p("panel", !0)), x = M(p("fields", !0)), C = M(p("flow", !0));
    function w() {
      try {
        const k = Number(localStorage.getItem("docscout.panelWidth"));
        return k >= We ? k : tt;
      } catch {
        return tt;
      }
    }
    const c = M(w()), s = () => {
      const k = O.value?.clientWidth;
      return k ? Math.max(We, k - 420) : Number.POSITIVE_INFINITY;
    };
    function v(k, m = !0) {
      if (c.value = Math.round(Math.min(s(), Math.max(We, k))), m)
        try {
          localStorage.setItem("docscout.panelWidth", String(c.value));
        } catch {
        }
    }
    const A = M(!1);
    function S(k) {
      const m = k.currentTarget, E = k.clientX, Y = c.value;
      m.setPointerCapture(k.pointerId), A.value = !0;
      const X = (ee) => v(Y + (E - ee.clientX), !1), ae = () => {
        A.value = !1, v(c.value), m.removeEventListener("pointermove", X), m.removeEventListener("pointerup", ae);
      };
      m.addEventListener("pointermove", X), m.addEventListener("pointerup", ae);
    }
    function N(k) {
      k.key === "ArrowLeft" ? (v(c.value + 24), k.preventDefault()) : k.key === "ArrowRight" && (v(c.value - 24), k.preventDefault());
    }
    let K = null;
    const D = M(), j = pe();
    async function H(k) {
      if (d.value = k, !B.value) {
        h("panel", k);
        return;
      }
      if (!k && K) {
        const m = K;
        K = null, await Ce(), m.focus();
      }
    }
    function P(k) {
      const m = k === "fields" ? x : C;
      m.value = !m.value, h(k, m.value);
    }
    const O = M(), B = M(!1);
    let ue;
    Ne(() => {
      ue = new ResizeObserver(([k]) => {
        const m = B.value;
        B.value = k.contentRect.width < 1e3, B.value && !m && (d.value = !1), !B.value && m && (d.value = p("panel", !0));
      }), O.value && ue.observe(O.value);
    }), Ct(() => ue?.disconnect());
    const ye = M();
    fe(u, async () => {
      await Ce(), ye.value && (ye.value.scrollTop = 0);
    });
    async function te(k) {
      B.value && !d.value && (K = O.value?.getRootNode()?.activeElement), u.value = k, d.value = !0, B.value && (await Ce(), D.value?.focus());
    }
    const oe = (k) => JSON.stringify(k) === JSON.stringify(u.value), be = F(() => u.value.kind === "field" ? n.config.fields[u.value.index] : void 0), V = F(() => Je(n.config.fields)), g = F(() => u.value.kind === "field" ? V.value.find((k) => k.key === ie(u.value.index, u.value.trail ?? [])) : void 0), $ = F(() => g.value?.key ?? ""), L = F(() => {
      const k = g.value;
      return !k || k.trail.at(-1) === "item" || !k.trail.length ? void 0 : V.value.find((E) => E.key === ie(k.field, k.trail.slice(0, -1))).shape.properties.filter((E) => E !== k.shape).map((E) => E.name);
    }), T = M("");
    fe($, () => {
      T.value = "";
    });
    const Fe = F(() => g.value ? Yl(n.config.fields, g.value) : []), ge = F(() => {
      const k = Cl(n.config.fields.map(G));
      return k ? `Group path collides with field ${k}.` : "";
    }), Te = F(() => ge.value ? null : Vt(n.config.fields)), Pt = F(() => ge.value ? null : Vt(n.config.fields, !0)), it = F(() => {
      const k = u.value;
      return k.kind === "stage" ? ke[k.stage] : k.kind === "field" ? g.value?.trail.length ? g.value.path : be.value?.name || "New field" : k.kind === "document" ? "Read document" : k.kind === "output" ? "Output" : "Details";
    }), Tt = F(() => {
      const k = u.value;
      return k.kind === "stage" ? ot[k.stage] : k.kind === "field" ? "tabler:forms" : k.kind === "document" ? "tabler:file-text" : k.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), Dt = F(() => n.config.fields.filter((k, m) => !(u.value.kind === "field" && u.value.index === m)).map(G)), It = F(() => n.config.stages.deep.enabled), jt = F(() => n.config.stages.map.enabled), zt = F(() => Oe(n.config.fields.map(G))), De = M(!1), ut = M(), dt = pe();
    function Wt(k, m) {
      for (const E of n.config.fields) (E.group === k || E.group.startsWith(k + ".")) && (E.group = m + E.group.slice(k.length));
    }
    const Ht = (k) => 320 - Math.max(0, ...n.config.fields.filter((m) => m.group === k || m.group.startsWith(k + ".")).map((m) => m.group.length - k.length));
    function Gt() {
      x.value = !0, De.value = !0;
    }
    async function rt() {
      De.value = !1, await Ce(), ut.value.focus();
    }
    function Kt(k) {
      n.config.fields.push({ ...at(), group: k }), rt();
    }
    const Qt = F(() => [...new Set(n.config.fields.map((k) => k.group.trim()).filter(Boolean))]), Jt = (k) => Ut(n.config.fields[k], n.config.fields.filter((m, E) => E !== k).map(G)), ct = ["map", "prefetch", "scout", "deep", "extract", "verify"], Yt = F(() => ct.filter((k) => Qe(n.config, k)).map((k) => ke[k]).join(" · ")), Xt = F(() => n.config.fields.map((k) => k.name || "New field").join(", ")), Zt = F(() => ct.filter((k) => Qe(n.config, k)).length), xe = (k) => n.result?.trace.find((m) => m.kind === k);
    function vt(k = "") {
      n.config.fields.push({ ...at(), group: k }), x.value = !0, te({ kind: "field", index: n.config.fields.length - 1 });
    }
    function _t(k) {
      n.config.fields.splice(k, 1), u.value = { kind: "document" };
    }
    function re(k, m = []) {
      te({ kind: "field", index: k, ...m.length ? { trail: m } : {} });
    }
    function mt(k, m) {
      const E = V.value.find((Y) => Y.key === ie(k, m));
      E.shape.properties.push(Ft()), re(k, [...m, E.shape.properties.length - 1]);
    }
    function el() {
      const k = g.value;
      if (!k.trail.length) {
        _t(k.field);
        return;
      }
      const m = V.value.find((E) => E.key === ie(k.field, k.trail.slice(0, -1)));
      m.shape.properties.splice(k.trail.at(-1), 1), re(m.field, m.trail);
    }
    function tl(k, m, E) {
      if (m.length) {
        const X = V.value.find((ne) => ne.key === ie(k, m.slice(0, -1))).shape.properties, ae = m.at(-1), ee = ae + E;
        if (ee < 0 || ee >= X.length) return;
        [X[ae], X[ee]] = [X[ee], X[ae]], re(k, [...m.slice(0, -1), ee]);
      } else {
        const Y = n.config.fields.map((ee, ne) => ee.group === n.config.fields[k].group ? ne : -1).filter((ee) => ee >= 0), X = Y[Y.indexOf(k) + E];
        if (X === void 0) return;
        const ae = n.config.fields;
        [ae[k], ae[X]] = [ae[X], ae[k]], re(X);
      }
    }
    function ll() {
      const k = g.value, m = Fe.value.find((Y) => Y.key === T.value), E = Xl(n.config.fields, k, m);
      re(E.field, E.trail);
    }
    function al(k) {
      const m = g.value?.shape;
      n.config.fields.splice(0, n.config.fields.length, ...n.config.fields.filter((Y) => Y.group !== k && !Y.group.startsWith(k + ".")));
      const E = V.value.find((Y) => Y.shape === m);
      E ? re(E.field, E.trail) : u.value = { kind: "document" };
    }
    function nl(k, m) {
      const E = k.split(".").slice(0, -1).join(".");
      let X = Oe(n.config.fields.map(G));
      for (const se of E.split(".").filter(Boolean)) X = X.children.find((ul) => ul.name === se);
      const ae = X.children.findIndex((se) => se.path === k), ee = X.children[ae + m]?.path;
      if (!ee) return;
      const ne = n.config.fields.filter((se) => se.group === k || se.group.startsWith(k + ".")), Ie = n.config.fields.filter((se) => se.group === ee || se.group.startsWith(ee + ".")), Ue = n.config.fields, ol = Math.min(Ue.indexOf(ne[0]), Ue.indexOf(Ie[0])), ft = Ue.filter((se) => !ne.includes(se) && !Ie.includes(se));
      ft.splice(ol, 0, ...m > 0 ? [...Ie, ...ne] : [...ne, ...Ie]);
      const il = g.value?.shape;
      Ue.splice(0, Ue.length, ...ft);
      const _e = V.value.find((se) => se.shape === il);
      _e && re(_e.field, _e.trail);
    }
    const sl = (k) => k.type === "list" ? `list of ${k.item?.type}` : k.type, pt = F({ get: () => n.config.tags.join(", "), set: (k) => {
      n.config.tags = [...new Set(k.split(",").map((m) => m.trim()).filter(Boolean))];
    } });
    return (k, m) => (a(), o("div", {
      ref_key: "root",
      ref: O,
      class: Q(["builder", { narrow: B.value, "panel-open": d.value, resizing: A.value }])
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
                onClick: m[0] || (m[0] = (E) => P("fields"))
              }, [
                b(f(R), {
                  icon: x.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                m[23] || (m[23] = t("h2", { id: "fields-head" }, "Fields", -1)),
                t("span", Js, r(e.config.fields.length), 1)
              ], 8, Qs),
              !x.value && e.config.fields.length ? (a(), o("span", Ys, r(Xt.value), 1)) : y("", !0),
              e.readonly ? y("", !0) : (a(), o("div", Xs, [
                t("button", {
                  ref_key: "addGroupButton",
                  ref: ut,
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  "aria-label": "Add group",
                  "aria-expanded": De.value,
                  "aria-controls": f(dt),
                  disabled: e.config.fields.length >= 100,
                  onClick: Gt
                }, [
                  b(f(R), { icon: "tabler:folder-plus" }),
                  m[24] || (m[24] = q("Add group", -1))
                ], 8, Zs),
                t("button", {
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  disabled: e.config.fields.length >= 100,
                  onClick: m[1] || (m[1] = (E) => vt())
                }, [
                  b(f(R), { icon: "tabler:plus" }),
                  m[25] || (m[25] = q("Add field", -1))
                ], 8, _s)
              ]))
            ]),
            z(t("div", eo, [
              e.config.fields.length ? y("", !0) : (a(), o("p", to, "Add the values to pull from each document.")),
              t("div", lo, [
                De.value && !e.readonly ? (a(), o("div", {
                  key: 0,
                  id: f(dt),
                  class: "group-create-row"
                }, [
                  t("span", no, [
                    b(f(R), { icon: "tabler:folder-plus" })
                  ]),
                  b(Rt, {
                    "input-label": "New group path",
                    "save-label": "Create group",
                    "cancel-label": "Cancel group creation",
                    onSave: Kt,
                    onCancel: rt
                  })
                ], 8, ao)) : y("", !0),
                b(Re, { node: zt.value }, {
                  header: me(({ path: E, label: Y, count: X, first: ae, last: ee }) => [
                    b(Ka, {
                      path: E,
                      name: Y,
                      count: X,
                      first: ae,
                      last: ee,
                      "max-length": Ht(E),
                      "can-add": e.config.fields.length < 100,
                      readonly: e.readonly,
                      onRename: (ne) => Wt(E, ne),
                      onAdd: (ne) => vt(E),
                      onReorder: (ne) => nl(E, ne),
                      onRemove: (ne) => al(E)
                    }, null, 8, ["path", "name", "count", "first", "last", "max-length", "can-add", "readonly", "onRename", "onAdd", "onReorder", "onRemove"])
                  ]),
                  default: me(({ index: E }) => [
                    b(gn, {
                      shape: e.config.fields[E],
                      field: E,
                      trail: [],
                      path: f(G)(e.config.fields[E]) || "New field",
                      selected: $.value,
                      readonly: e.readonly,
                      error: Jt(E),
                      first: !e.config.fields.slice(0, E).some((Y) => Y.group === e.config.fields[E].group),
                      last: !e.config.fields.slice(E + 1).some((Y) => Y.group === e.config.fields[E].group),
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
                  b(f(R), { icon: "tabler:braces" }),
                  m[26] || (m[26] = q("Output preview", -1))
                ]),
                ge.value ? (a(), o("p", io, r(ge.value), 1)) : (a(), o("div", uo, [
                  t("div", null, [
                    m[27] || (m[27] = t("h3", null, "Output shape", -1)),
                    t("pre", ro, r(JSON.stringify(Te.value, null, 2)), 1)
                  ]),
                  t("div", null, [
                    m[28] || (m[28] = t("h3", null, "Example value", -1)),
                    t("pre", co, r(JSON.stringify(Pt.value, null, 2)), 1)
                  ])
                ])),
                m[29] || (m[29] = t("small", null, "Example values illustrate the shape; extracted values come from your document.", -1))
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
                "aria-expanded": C.value,
                "aria-controls": "flow-body",
                onClick: m[2] || (m[2] = (E) => P("flow"))
              }, [
                b(f(R), {
                  icon: C.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                m[30] || (m[30] = t("h2", { id: "flow-head" }, "Flow", -1)),
                t("span", fo, r(Zt.value) + " of 6", 1)
              ], 8, po),
              C.value ? y("", !0) : (a(), o("span", bo, r(Yt.value), 1)),
              t("button", {
                type: "button",
                class: Q(["kx-btn kx-btn-ghost kx-focus-halo sm push", { on: oe({ kind: "details" }) }]),
                onClick: m[3] || (m[3] = (E) => te({ kind: "details" }))
              }, [
                b(f(R), { icon: "tabler:info-circle" }),
                m[31] || (m[31] = q("Details", -1))
              ], 2)
            ]),
            z(t("div", go, [
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "document" }) }]),
                onClick: m[4] || (m[4] = (E) => te({ kind: "document" }))
              }, [
                t("span", ho, [
                  b(f(R), { icon: "tabler:file-text" })
                ]),
                t("span", yo, [
                  m[32] || (m[32] = t("span", { class: "node-title" }, "Read document", -1)),
                  t("span", ko, r(f(El)(e.config.retrieval)), 1)
                ]),
                t("span", $o, [
                  t("span", xo, r(f(qt)(e.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              m[37] || (m[37] = t("div", { class: "connector" }, null, -1)),
              b(we, {
                stage: "map",
                config: e.config,
                active: oe({ kind: "stage", stage: "map" }),
                trace: xe("map"),
                readonly: e.readonly,
                onSelect: m[5] || (m[5] = (E) => te({ kind: "stage", stage: "map" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              m[38] || (m[38] = t("div", {
                class: "fork",
                "aria-hidden": "true"
              }, [
                t("span")
              ], -1)),
              t("div", wo, [
                t("div", So, [
                  m[33] || (m[33] = t("span", { class: "branch-label" }, "Evidence", -1)),
                  b(we, {
                    stage: "prefetch",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "prefetch" }),
                    trace: xe("prefetch"),
                    readonly: e.readonly,
                    onSelect: m[6] || (m[6] = (E) => te({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  m[34] || (m[34] = t("div", { class: "connector" }, null, -1)),
                  b(we, {
                    stage: "scout",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "scout" }),
                    trace: xe("scout"),
                    readonly: e.readonly,
                    onSelect: m[7] || (m[7] = (E) => te({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                t("div", Vo, [
                  m[35] || (m[35] = t("span", { class: "branch-label" }, "Deep fields", -1)),
                  b(we, {
                    stage: "deep",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "deep" }),
                    trace: xe("deep"),
                    readonly: e.readonly,
                    onSelect: m[8] || (m[8] = (E) => te({ kind: "stage", stage: "deep" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ])
              ]),
              m[39] || (m[39] = t("div", {
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
                onSelect: m[9] || (m[9] = (E) => te({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              m[40] || (m[40] = t("div", { class: "connector" }, null, -1)),
              b(we, {
                stage: "verify",
                config: e.config,
                active: oe({ kind: "stage", stage: "verify" }),
                trace: xe("verify"),
                readonly: e.readonly,
                onSelect: m[10] || (m[10] = (E) => te({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              m[41] || (m[41] = t("div", { class: "connector" }, null, -1)),
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "output" }) }]),
                onClick: m[11] || (m[11] = (E) => te({ kind: "output" }))
              }, [
                t("span", Co, [
                  b(f(R), { icon: "tabler:braces" })
                ]),
                t("span", Eo, [
                  m[36] || (m[36] = t("span", { class: "node-title" }, "Output", -1)),
                  t("span", qo, r(e.config.fields.length ? `${e.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [Ke, C.value]
            ])
          ])
        ])
      ], 8, Ws),
      B.value && d.value ? (a(), o("div", {
        key: 0,
        class: "scrim",
        onClick: m[12] || (m[12] = (E) => H(!1))
      })) : y("", !0),
      d.value ? z((a(), o("aside", {
        key: String(B.value),
        class: "side-panel",
        "aria-labelledby": f(j),
        role: B.value ? "dialog" : void 0,
        "aria-modal": B.value ? "true" : void 0,
        style: qe(B.value ? void 0 : { width: `${c.value}px` }),
        onKeydown: m[21] || (m[21] = Ee((E) => B.value && H(!1), ["esc"]))
      }, [
        B.value ? y("", !0) : (a(), o("div", {
          key: 0,
          class: Q(["resizer kx-focus-outline", { active: A.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": c.value,
          "aria-valuemin": We,
          onPointerdown: ve(S, ["prevent"]),
          onKeydown: N,
          onDblclick: m[13] || (m[13] = (E) => v(tt))
        }, null, 42, Fo)),
        t("header", Uo, [
          t("span", Mo, [
            b(f(R), { icon: Tt.value }, null, 8, ["icon"])
          ]),
          t("h2", { id: f(j) }, r(it.value), 9, Ao),
          t("button", {
            ref_key: "closeButton",
            ref: D,
            type: "button",
            class: "kx-iconbtn kx-focus-outline push",
            "aria-label": B.value ? "Close panel" : "Collapse panel",
            title: B.value ? "Close panel" : "Collapse panel",
            onClick: m[14] || (m[14] = (E) => H(!1))
          }, [
            b(f(R), {
              icon: B.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ], 8, Ro)
        ]),
        t("div", {
          ref_key: "panelBody",
          ref: ye,
          class: "side-panel-body"
        }, [
          u.value.kind === "document" ? (a(), J(zs, {
            key: 0,
            config: e.config,
            retention: e.retention,
            readonly: e.readonly
          }, null, 8, ["config", "retention", "readonly"])) : u.value.kind === "stage" ? (a(), J(Es, {
            key: 1,
            stage: u.value.stage,
            config: e.config,
            readonly: e.readonly
          }, null, 8, ["stage", "config", "readonly"])) : u.value.kind === "field" && be.value && g.value ? (a(), o(U, { key: 2 }, [
            t("p", Bo, r(g.value.path), 1),
            b(qa, {
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
              onAdd: m[15] || (m[15] = (E) => mt(g.value.field, g.value.trail)),
              onSelectItem: m[16] || (m[16] = (E) => re(g.value.field, [...g.value.trail, "item"]))
            }, null, 8, ["field", "shape", "depth", "sibling-names", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"]),
            !e.readonly && g.value.trail.at(-1) !== "item" ? (a(), o("fieldset", Lo, [
              t("label", null, [
                m[42] || (m[42] = q("Move to parent", -1)),
                z(t("select", {
                  "onUpdate:modelValue": m[17] || (m[17] = (E) => T.value = E),
                  "aria-label": "Move to parent"
                }, [
                  g.value.trail.length ? (a(), o("option", Oo, "Top-level field")) : (a(), o("option", Po, "Choose an object…")),
                  (a(!0), o(U, null, I(Fe.value, (E) => (a(), o("option", {
                    key: E.key,
                    value: E.key
                  }, r(E.path), 9, To))), 128))
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
            ])) : y("", !0)
          ], 64)) : u.value.kind === "details" ? (a(), o("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: e.readonly
          }, [
            t("label", null, [
              m[43] || (m[43] = q("Name", -1)),
              z(t("input", {
                "onUpdate:modelValue": m[18] || (m[18] = (E) => l.value = E),
                "aria-label": "Extractor name"
              }, null, 512), [
                [_, l.value]
              ])
            ]),
            t("label", null, [
              m[44] || (m[44] = q("Description", -1)),
              z(t("textarea", {
                "onUpdate:modelValue": m[19] || (m[19] = (E) => i.value = E),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [_, i.value]
              ])
            ]),
            t("label", null, [
              m[45] || (m[45] = q("Tags", -1)),
              z(t("input", {
                "onUpdate:modelValue": m[20] || (m[20] = (E) => pt.value = E),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  _,
                  pt.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              m[46] || (m[46] = t("small", null, "Comma separated", -1))
            ])
          ], 8, Io)) : u.value.kind === "output" ? (a(), o("div", jo, [
            m[47] || (m[47] = t("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            t("ul", zo, [
              (a(!0), o(U, null, I(e.config.fields, (E) => (a(), o("li", {
                key: f(G)(E)
              }, [
                t("span", Wo, r(f(G)(E) || "New field"), 1),
                t("span", Ho, r(sl(E)), 1)
              ]))), 128))
            ]),
            m[48] || (m[48] = t("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : y("", !0)
        ], 512)
      ], 44, No)), [
        [f(Ll), { disabled: !B.value }]
      ]) : B.value ? y("", !0) : (a(), o("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: m[22] || (m[22] = (E) => H(!0))
      }, [
        b(f(R), { icon: "tabler:layout-sidebar-right-expand" }),
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
  setup(e, { emit: n }) {
    const l = n, i = M(!1), u = M("");
    Ne(async () => {
      try {
        await Ze("wc-multiselect", { timeoutMs: 8e3 }), i.value = !0;
      } catch (h) {
        u.value = String(h);
      }
    });
    function p(h) {
      const d = h.detail;
      l("select", d.selected[0] || "", d.labels?.[0] || "");
    }
    return (h, d) => i.value ? (a(), o("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(e.value ? [e.value] : []),
      placeholder: "Choose an upload",
      onChange: p
    }, null, 40, Qo)) : u.value ? (a(), o("p", Jo, r(u.value), 1)) : (a(), o("span", Yo, "Loading uploads…"));
  }
}), Xo = ["data-error-kind", "data-error-code"], Zo = { key: 0 }, Lt = /* @__PURE__ */ W({
  __name: "FieldFailure",
  props: {
    error: {}
  },
  setup(e) {
    const n = e, l = F(() => {
      const u = n.error?.details;
      return u && typeof u == "object" && "code" in u && typeof u.code == "string" ? u.code : void 0;
    }), i = F(() => l.value === "context_budget_exceeded");
    return (u, p) => (a(), o("div", {
      class: "field-failure",
      "data-error-kind": e.error?.kind,
      "data-error-code": l.value,
      role: "note",
      "aria-label": "Field failure"
    }, [
      t("p", null, [
        t("strong", null, r(i.value ? "Context budget exceeded" : e.error?.kind), 1),
        q(" · " + r(e.error?.message), 1)
      ]),
      t("small", null, r(e.error?.retryable ? "Retryable" : "Not retryable"), 1),
      e.error?.details ? (a(), o("details", Zo, [
        p[0] || (p[0] = t("summary", { class: "kx-focus-outline" }, "Error details", -1)),
        t("pre", null, r(JSON.stringify(e.error.details, null, 2)), 1)
      ])) : y("", !0)
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
    const n = e, l = F(() => n.value !== null && typeof n.value == "object" && !Array.isArray(n.value) ? n.value : null);
    return (i, u) => {
      const p = st("NestedValue", !0);
      return a(), o("div", _o, [
        Array.isArray(e.value) ? (a(), o("ol", ei, [
          (a(!0), o(U, null, I(e.value, (h, d) => (a(), o("li", { key: d }, [
            b(p, { value: h }, null, 8, ["value"])
          ]))), 128)),
          e.value.length ? y("", !0) : (a(), o("li", ti, "Empty list"))
        ])) : l.value ? (a(), o("dl", li, [
          (a(!0), o(U, null, I(l.value, (h, d) => (a(), o(U, { key: d }, [
            t("dt", null, r(d), 1),
            t("dd", null, [
              b(p, { value: h }, null, 8, ["value"])
            ])
          ], 64))), 128))
        ])) : (a(), o("span", ai, r(e.value === null || e.value === void 0 ? "—" : String(e.value)), 1))
      ]);
    };
  }
}), ni = { class: "value-list" }, si = ["aria-expanded", "onClick"], oi = { class: "value-name" }, ii = { class: "bar" }, ui = {
  key: 1,
  class: "value-checks"
}, di = ["title"], ri = {
  key: 0,
  class: "chip warn",
  "aria-label": "Context"
}, ci = {
  key: 1,
  class: "chip",
  "aria-label": "Completeness"
}, vi = { class: "evidence" }, mi = {
  key: 1,
  class: "muted"
}, pi = {
  key: 2,
  class: "muted"
}, Ot = /* @__PURE__ */ W({
  __name: "ResultFields",
  props: {
    fields: {},
    pageRange: {}
  },
  setup(e) {
    const n = e, l = F(() => Oe(n.fields.map((w) => w.path))), i = M(), u = (w) => `${Math.round(w * 100)}%`, p = (w) => w !== null && typeof w == "object", h = (w) => Array.isArray(w) ? `${w.length} items` : p(w) ? `${Object.keys(w).length} properties` : w == null ? "—" : String(w), d = (w) => w >= 0.9 ? "high" : w >= 0.7 ? "mid" : "low", x = (w) => w.codes?.includes("missing_in_sections") ? "Not in the selected sections" + (n.pageRange ? " of the searched pages" : "") : "Not in the document", C = (w) => {
      const c = w.error?.details;
      return !!c && typeof c == "object" && "code" in c && c.code === "context_budget_exceeded";
    };
    return (w, c) => (a(), o("div", ni, [
      b(Re, { node: l.value }, {
        default: me(({ index: s }) => [
          (a(!0), o(U, null, I([e.fields[s]], (v) => (a(), o("div", {
            key: v.path,
            class: "value-row"
          }, [
            t("button", {
              type: "button",
              class: "value-main",
              "aria-expanded": i.value === v.path,
              onClick: (A) => i.value = i.value === v.path ? void 0 : v.path
            }, [
              t("span", oi, r(v.name), 1),
              t("span", {
                class: Q(["value-text", { missing: v.missing }])
              }, r(v.failed ? C(v) ? "Context budget exceeded" : "Failed" : v.missing ? x(v) : h(v.value)), 3),
              v.failed ? y("", !0) : (a(), o("span", {
                key: 0,
                class: Q(["confidence", d(v.confidence)])
              }, [
                t("span", ii, [
                  t("span", {
                    style: qe({ width: u(v.confidence) })
                  }, null, 4)
                ]),
                q(r(u(v.confidence)), 1),
                c[0] || (c[0] = t("span", { class: "conf-word" }, " confidence", -1))
              ], 2)),
              v.failed ? y("", !0) : (a(), o("span", ui, [
                t("span", {
                  class: Q(["chip", v.verified ? "primary" : "warn"]),
                  title: v.reason
                }, [
                  b(f(R), {
                    icon: v.verified ? "tabler:shield-check" : "tabler:shield-question"
                  }, null, 8, ["icon"]),
                  q(r(v.verified ? "Verified" : "Check"), 1)
                ], 10, di),
                v.codes?.includes("context_budget_partial") ? (a(), o("span", ri, "Partial context")) : y("", !0),
                v.missing ? y("", !0) : (a(), o("span", ci, r(v.complete === !0 ? "Complete" : v.complete === !1 ? "Incomplete" : "Completeness unknown"), 1))
              ])),
              b(f(R), {
                icon: i.value === v.path ? "tabler:chevron-up" : "tabler:chevron-down",
                class: "value-caret"
              }, null, 8, ["icon"])
            ], 8, si),
            !v.failed && !v.missing && p(v.value) ? (a(), J(Be, {
              key: 0,
              class: "structured-value",
              value: v.value
            }, null, 8, ["value"])) : y("", !0),
            v.failed ? (a(), J(Lt, {
              key: 1,
              error: v.error
            }, null, 8, ["error"])) : y("", !0),
            z(t("div", vi, [
              !v.failed && !v.missing && !p(v.value) ? (a(), J(Be, {
                key: 0,
                value: v.value
              }, null, 8, ["value"])) : y("", !0),
              (a(!0), o(U, null, I(v.evidence, (A, S) => (a(), o("blockquote", {
                key: S,
                class: Q({ unfound: A.found === !1 })
              }, [
                t("p", null, "“" + r(A.quote) + "”", 1),
                t("cite", null, [
                  q(r(A.section), 1),
                  A.page !== void 0 && A.page !== null ? (a(), o(U, { key: 0 }, [
                    q(" · Page " + r(A.page), 1)
                  ], 64)) : y("", !0),
                  A.found === !1 ? (a(), o(U, { key: 1 }, [
                    q(" · not found word for word in the document")
                  ], 64)) : y("", !0)
                ])
              ], 2))), 128)),
              v.evidence.length ? y("", !0) : (a(), o("p", mi, "No evidence.")),
              v.reason || !v.verified && !v.failed ? (a(), o("p", pi, r(v.reason || "No reason recorded"), 1)) : y("", !0)
            ], 512), [
              [Ke, i.value === v.path && !v.failed]
            ])
          ]))), 128))
        ]),
        _: 1
      }, 8, ["node"])
    ]));
  }
}), fi = { class: "test" }, bi = { class: "run-bar" }, gi = { class: "run-input" }, hi = { class: "muted run-note" }, yi = {
  key: 0,
  class: "empty"
}, ki = {
  key: 1,
  class: "run-failed",
  role: "alert"
}, $i = {
  key: 2,
  class: "eval-warning",
  role: "status"
}, xi = {
  key: 3,
  class: "test-grid"
}, wi = { class: "block" }, Si = { class: "block-head" }, Vi = { class: "muted push" }, Ci = { class: "block" }, Ei = { class: "timeline" }, qi = { class: "tl-icon" }, Ni = { class: "tl-main" }, Fi = { class: "tl-head" }, Ui = { class: "muted push" }, Mi = { class: "tl-bar" }, Ai = { class: "muted" }, Ri = {
  key: 0,
  class: "tl-msg"
}, Bi = {
  key: 1,
  class: "chips"
}, Li = /* @__PURE__ */ W({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {},
    running: { type: Boolean },
    canRun: { type: Boolean }
  },
  emits: ["run"],
  setup(e, { emit: n }) {
    const l = e, i = n, u = M(""), p = (w) => `${(w / 1e3).toFixed(1)}s`, h = F(() => Math.max(1, ...l.result?.trace.map((w) => w.duration_ms) ?? [1])), d = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, x = (w) => d[w]?.label ?? ke[w] ?? w, C = (w) => d[w]?.icon ?? ot[w] ?? "tabler:point";
    return (w, c) => (a(), o("div", fi, [
      t("section", bi, [
        t("div", gi, [
          b(Bt, {
            value: u.value,
            onSelect: c[0] || (c[0] = (s) => u.value = s)
          }, null, 8, ["value"])
        ]),
        b(f(de), {
          label: e.running ? "Extracting…" : "Run extraction",
          loading: e.running,
          disabled: !u.value || e.running || !e.canRun,
          onClick: c[1] || (c[1] = (s) => i("run", u.value))
        }, null, 8, ["label", "loading", "disabled"]),
        t("p", hi, r(e.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + r(e.retention) + ".", 1)
      ]),
      e.result ? y("", !0) : (a(), o("p", yi, "No extraction results yet.")),
      e.result?.status === "failed" ? (a(), o("p", ki, [
        b(f(R), { icon: "tabler:alert-triangle" }),
        q("The run stopped: " + r(e.result.error), 1)
      ])) : y("", !0),
      e.result?.status === "partial" ? (a(), o("p", $i, [
        b(f(R), { icon: "tabler:alert-triangle" }),
        c[2] || (c[2] = q("Partial result · Some fields failed. Successful values are available below.", -1))
      ])) : y("", !0),
      e.result ? (a(), o("div", xi, [
        t("section", wi, [
          t("header", Si, [
            c[3] || (c[3] = t("h2", { class: "block-title" }, "Values", -1)),
            t("span", Vi, [
              q(r(e.result.tokens.toLocaleString()) + " tokens · " + r(p(e.result.duration_ms)), 1),
              e.result.page_range ? (a(), o(U, { key: 0 }, [
                q(" · Pages " + r(e.result.page_range.first) + "–" + r(e.result.page_range.last), 1)
              ], 64)) : e.result.pages ? (a(), o(U, { key: 1 }, [
                q(" · " + r(e.result.pages) + " pages", 1)
              ], 64)) : y("", !0)
            ])
          ]),
          b(Ot, {
            fields: e.result.fields,
            "page-range": e.result.page_range
          }, null, 8, ["fields", "page-range"])
        ]),
        t("section", Ci, [
          c[4] || (c[4] = t("header", { class: "block-head" }, [
            t("h2", { class: "block-title" }, "Steps")
          ], -1)),
          t("ol", Ei, [
            (a(!0), o(U, null, I(e.result.trace, (s, v) => (a(), o("li", {
              key: v,
              class: Q(s.status)
            }, [
              t("span", qi, [
                b(f(R), {
                  icon: C(s.kind)
                }, null, 8, ["icon"])
              ]),
              t("div", Ni, [
                t("div", Fi, [
                  t("strong", null, r(x(s.kind)), 1),
                  t("span", Ui, r(p(s.duration_ms)), 1)
                ]),
                t("span", Mi, [
                  t("span", {
                    style: qe({ width: `${Math.max(4, s.duration_ms / h.value * 100)}%` })
                  }, null, 4)
                ]),
                t("p", Ai, [
                  q(r(s.scope), 1),
                  s.pages ? (a(), o(U, { key: 0 }, [
                    q(" · Pages " + r(s.pages.first) + "–" + r(s.pages.last), 1)
                  ], 64)) : y("", !0),
                  s.model ? (a(), o(U, { key: 1 }, [
                    q(" · " + r(s.model), 1)
                  ], 64)) : y("", !0),
                  q(" · " + r((s.input_tokens + s.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                s.message ? (a(), o("p", Ri, r(s.message), 1)) : y("", !0),
                s.queries?.length ? (a(), o("div", Bi, [
                  (a(!0), o(U, null, I(s.queries, (A) => (a(), o("span", {
                    key: A,
                    class: "chip"
                  }, r(A), 1))), 128))
                ])) : y("", !0)
              ])
            ], 2))), 128))
          ])
        ])
      ])) : y("", !0)
    ]));
  }
}), He = (e) => e.status === "completed" || e.status === "partial" || e.status === "failed", Ve = (e) => e.metrics.length ? e.metrics.reduce((n, l) => n + l.accuracy, 0) / e.metrics.length : 0;
function Ye(e, n = /* @__PURE__ */ new Date()) {
  const l = new Date(e);
  return l.toDateString() === n.toDateString() ? l.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" }) : l.getFullYear() === n.getFullYear() ? l.toLocaleString(void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : l.toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
}
const Oi = { class: "evals" }, Pi = { class: "block eval-run" }, Ti = { class: "eval-run-main" }, Di = { class: "block-title" }, Ii = {
  key: 0,
  class: "eval-note"
}, ji = {
  key: 0,
  class: "eval-progress",
  role: "status"
}, zi = { class: "bar" }, Wi = { class: "muted" }, Hi = { class: "stat-row" }, Gi = { class: "stat" }, Ki = { class: "stat-label" }, Qi = { class: "stat-value" }, Ji = { class: "stat" }, Yi = { class: "stat-value" }, Xi = { class: "stat-delta flat" }, Zi = { class: "stat" }, _i = { class: "stat-value" }, eu = {
  key: 0,
  class: "stat-delta flat"
}, tu = { class: "stat" }, lu = { class: "stat-value" }, au = {
  key: 0,
  class: "stat-delta flat"
}, nu = { class: "block" }, su = { class: "block-head" }, ou = {
  key: 0,
  class: "compare-pick push"
}, iu = ["value"], uu = ["value"], du = {
  key: 0,
  class: "block-empty"
}, ru = {
  key: 1,
  class: "table-scroll"
}, cu = { key: 0 }, vu = { key: 1 }, mu = { class: "mono" }, pu = { class: "acc strong" }, fu = { class: "bar" }, bu = { class: "muted" }, gu = {
  key: 0,
  class: "muted"
}, hu = { key: 1 }, yu = {
  key: 1,
  class: "muted"
}, ku = {
  key: 1,
  class: "block"
}, $u = { class: "table-scroll" }, xu = { class: "metric-table result-matrix" }, wu = ["aria-expanded", "onClick"], Su = {
  key: 0,
  class: "badge",
  "data-status": "partial"
}, Vu = ["colspan"], Cu = {
  key: 0,
  class: "cell-state"
}, Eu = ["data-error-kind", "title"], qu = ["data-label"], Nu = ["title"], Fu = {
  key: 0,
  class: "result-detail"
}, Uu = ["colspan"], Mu = ["data-error-kind", "title"], Au = { class: "mono" }, Ru = { class: "cmp" }, Bu = { class: "cmp" }, Lu = { key: 0 }, Ou = { class: "muted case-meta" }, Pu = { class: "block" }, Tu = { class: "block-head" }, Du = { class: "count" }, Iu = { class: "mono" }, ju = ["onUpdate:modelValue"], zu = ["onUpdate:modelValue"], Wu = ["onUpdate:modelValue", "placeholder"], Hu = ["onUpdate:modelValue", "type"], Gu = {
  key: 0,
  class: "error",
  role: "alert"
}, Ku = { class: "row" }, Qu = {
  key: 1,
  class: "block-empty"
}, Ju = {
  key: 2,
  class: "block-empty"
}, Yu = {
  key: 3,
  class: "table-scroll"
}, Xu = { class: "metric-table case-table" }, Zu = { class: "case-value" }, _u = {
  key: 1,
  class: "muted"
}, ed = { class: "num" }, td = ["aria-label", "disabled", "onClick"], ld = {
  key: 2,
  class: "block"
}, ad = { class: "block-head" }, nd = { class: "count" }, sd = { class: "eval-history" }, od = ["aria-current", "onClick"], id = ["data-status"], ud = { class: "muted" }, dd = { class: "push" }, rd = /* @__PURE__ */ W({
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
    const l = e, i = n, u = M(!1), p = M(""), h = M({}), d = M("");
    fe(() => l.addedCaseId, () => {
      u.value = !1, p.value = "", h.value = {};
    });
    function x(V, g) {
      return V.type === "number" ? Number(g) : V.type === "boolean" ? g === "true" : V.type === "list" || V.type === "object" ? JSON.parse(g) : g;
    }
    function C() {
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
      i("add-case", { upload_id: p.value, expected: V });
    }
    const w = F(() => l.evaluations.find((V) => !He(V))), c = F(() => l.evaluations.filter(He)), s = F(() => l.evaluation), v = F(() => ({ done: (s.value?.results ?? []).filter((g) => g.status !== "queued").length, total: s.value?.case_count ?? 0 })), A = M();
    fe(() => s.value?.id, () => {
      A.value = void 0;
    });
    const S = F(() => {
      if (!s.value) return;
      if (A.value) return c.value.find((g) => g.id === A.value);
      const V = c.value.findIndex((g) => g.id === s.value.id);
      return V >= 0 ? c.value[V + 1] : c.value[0];
    }), N = F(() => (s.value?.metrics ?? []).map((V) => ({ ...V, before: S.value?.metrics.find((g) => g.field === V.field) }))), K = F(() => (s.value?.fields ?? []).map(G)), D = F(() => Oe(l.fields.map(G))), j = (V, g) => V.scores.find(($) => $.field === g), H = M(), P = (V) => `${Math.round(V * 100)}%`, O = (V) => {
      const g = Math.round(V * 100);
      return `${g > 0 ? "+" : g < 0 ? "−" : "±"}${Math.abs(g)} pts`;
    }, B = (V) => Math.round(V * 100) > 0 ? "up" : Math.round(V * 100) < 0 ? "down" : "flat", ue = (V) => V >= 6e4 ? `${Math.floor(V / 6e4)}m ${Math.round(V % 6e4 / 1e3)}s` : `${(V / 1e3).toFixed(1)}s`, ye = (V) => V == null || V === "" ? "—" : typeof V == "string" ? V : Array.isArray(V) && V.every((g) => typeof g != "object") ? V.join(", ") : JSON.stringify(V), te = (V) => V ? V.failed ? "fail" : V.score >= 0.999 ? "pass" : V.score > 0 ? "partial" : "fail" : "none", oe = (V) => (V.results ?? []).filter((g) => g.status === "completed").length, be = { queued: "Queued", running: "Running", completed: "Completed", partial: "Partial", failed: "Failed" };
    return (V, g) => (a(), o("div", Oi, [
      t("section", Pi, [
        t("div", Ti, [
          t("div", null, [
            t("h2", Di, "Evaluate revision " + r(e.revision), 1),
            g[6] || (g[6] = t("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            e.changed ? (a(), o("p", Ii, [
              b(f(R), { icon: "tabler:info-circle" }),
              g[5] || (g[5] = q("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : y("", !0)
          ]),
          b(f(de), {
            label: w.value ? "Evaluating…" : "Run all cases",
            loading: e.starting || !!w.value,
            disabled: !e.cases.length || !e.fields.length || !!w.value || e.starting,
            onClick: g[0] || (g[0] = ($) => i("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        s.value && !f(He)(s.value) ? (a(), o("div", ji, [
          t("span", zi, [
            t("span", {
              style: qe({ width: P(v.value.total ? v.value.done / v.value.total : 0) })
            }, null, 4)
          ]),
          t("span", Wi, r(be[s.value.status]) + " · " + r(v.value.done) + " of " + r(v.value.total) + " cases", 1)
        ])) : y("", !0)
      ]),
      s.value && f(He)(s.value) ? (a(), o(U, { key: 0 }, [
        s.value.error ? (a(), o("p", {
          key: 0,
          class: Q(s.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          b(f(R), { icon: "tabler:alert-triangle" }),
          q(r(s.value.error), 1)
        ], 2)) : y("", !0),
        t("div", Hi, [
          t("div", Gi, [
            t("span", Ki, "Accuracy · revision " + r(s.value.config_revision), 1),
            t("span", Qi, r(P(f(Ve)(s.value))), 1),
            S.value ? (a(), o("span", {
              key: 0,
              class: Q(["stat-delta", B(f(Ve)(s.value) - f(Ve)(S.value))])
            }, r(O(f(Ve)(s.value) - f(Ve)(S.value))) + " vs revision " + r(S.value.config_revision), 3)) : y("", !0)
          ]),
          t("div", Ji, [
            g[7] || (g[7] = t("span", { class: "stat-label" }, "Cases", -1)),
            t("span", Yi, [
              q(r(oe(s.value)), 1),
              t("small", null, " / " + r(s.value.case_count), 1)
            ]),
            t("span", Xi, r((s.value.results ?? []).filter(($) => $.status === "partial").length) + " partial · " + r((s.value.results ?? []).filter(($) => $.status === "failed").length) + " failed", 1)
          ]),
          t("div", Zi, [
            g[8] || (g[8] = t("span", { class: "stat-label" }, "Tokens", -1)),
            t("span", _i, r(s.value.tokens.toLocaleString()), 1),
            S.value ? (a(), o("span", eu, r(S.value.tokens.toLocaleString()) + " before", 1)) : y("", !0)
          ]),
          t("div", tu, [
            g[9] || (g[9] = t("span", { class: "stat-label" }, "Model time", -1)),
            t("span", lu, r(ue(s.value.duration_ms)), 1),
            S.value ? (a(), o("span", au, r(ue(S.value.duration_ms)) + " before", 1)) : y("", !0)
          ])
        ]),
        t("section", nu, [
          t("header", su, [
            g[11] || (g[11] = t("h2", { class: "block-title" }, "Field accuracy", -1)),
            c.value.length > 1 ? (a(), o("label", ou, [
              g[10] || (g[10] = t("span", { class: "muted" }, "Compare with", -1)),
              t("select", {
                value: S.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: g[1] || (g[1] = ($) => A.value = $.target.value)
              }, [
                (a(!0), o(U, null, I(c.value.filter(($) => $.id !== s.value.id), ($) => (a(), o("option", {
                  key: $.id,
                  value: $.id
                }, "Revision " + r($.config_revision) + " · " + r(f(Ye)($.created_at)), 9, uu))), 128))
              ], 40, iu)
            ])) : y("", !0)
          ]),
          N.value.length ? (a(), o("div", ru, [
            t("table", {
              class: Q(["metric-table accuracy-table", { comparing: !!S.value }])
            }, [
              t("thead", null, [
                t("tr", null, [
                  g[12] || (g[12] = t("th", null, "Field", -1)),
                  g[13] || (g[13] = t("th", null, "Accuracy", -1)),
                  g[14] || (g[14] = t("th", null, "Verified", -1)),
                  S.value ? (a(), o("th", cu, "Revision " + r(S.value.config_revision), 1)) : y("", !0),
                  S.value ? (a(), o("th", vu, "Change")) : y("", !0)
                ])
              ]),
              t("tbody", null, [
                (a(!0), o(U, null, I(N.value, ($) => (a(), o("tr", {
                  key: $.field
                }, [
                  t("td", mu, r($.field), 1),
                  t("td", null, [
                    t("span", pu, [
                      t("span", fu, [
                        t("span", {
                          style: qe({ width: P($.accuracy) })
                        }, null, 4)
                      ]),
                      q(r(P($.accuracy)), 1)
                    ])
                  ]),
                  t("td", bu, r(P($.verified)), 1),
                  S.value ? (a(), o("td", gu, r($.before ? P($.before.accuracy) : "—"), 1)) : y("", !0),
                  S.value ? (a(), o("td", hu, [
                    $.before ? (a(), o("span", {
                      key: 0,
                      class: Q(["trend", B($.accuracy - $.before.accuracy)])
                    }, [
                      b(f(R), {
                        icon: B($.accuracy - $.before.accuracy) === "up" ? "tabler:trending-up" : B($.accuracy - $.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      q(r(O($.accuracy - $.before.accuracy)), 1)
                    ], 2)) : (a(), o("span", yu, "New field"))
                  ])) : y("", !0)
                ]))), 128))
              ])
            ], 2)
          ])) : (a(), o("p", du, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : y("", !0),
      s.value?.results?.length ? (a(), o("section", ku, [
        g[19] || (g[19] = t("header", { class: "block-head" }, [
          t("h2", { class: "block-title" }, "Results by case"),
          t("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        t("div", $u, [
          t("table", xu, [
            t("thead", null, [
              t("tr", null, [
                g[15] || (g[15] = t("th", null, "Document", -1)),
                (a(!0), o(U, null, I(K.value, ($) => (a(), o("th", {
                  key: $,
                  class: "mono"
                }, r($), 1))), 128))
              ])
            ]),
            t("tbody", null, [
              (a(!0), o(U, null, I(s.value.results, ($) => (a(), o(U, {
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
                      b(f(R), {
                        icon: H.value === $.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      q(r($.upload_name), 1)
                    ], 8, wu),
                    $.status === "partial" ? (a(), o("span", Su, "Partial")) : y("", !0)
                  ]),
                  $.status === "queued" || $.status === "failed" ? (a(), o("td", {
                    key: 0,
                    colspan: K.value.length,
                    class: "muted"
                  }, [
                    $.status === "queued" ? (a(), o("span", Cu, [
                      b(f(R), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      g[16] || (g[16] = q("Waiting", -1))
                    ])) : (a(), o("span", {
                      key: 1,
                      class: "cell-state fail",
                      "data-error-kind": $.error?.kind,
                      title: $.error?.kind
                    }, [
                      b(f(R), { icon: "tabler:alert-triangle" }),
                      q(r($.error?.message), 1)
                    ], 8, Eu))
                  ], 8, Vu)) : (a(!0), o(U, { key: 1 }, I(K.value, (L) => (a(), o("td", {
                    key: L,
                    "data-label": L
                  }, [
                    t("span", {
                      class: Q(["cell", te(j($, L))]),
                      title: ye(j($, L)?.value)
                    }, r(j($, L)?.failed ? "Failed" : j($, L) ? P(j($, L).score) : "—"), 11, Nu)
                  ], 8, qu))), 128))
                ], 2),
                H.value === $.case_id ? (a(), o("tr", Fu, [
                  t("td", {
                    colspan: K.value.length + 1
                  }, [
                    $.error ? (a(), o("p", {
                      key: 0,
                      class: "muted",
                      "data-error-kind": $.error.kind,
                      title: $.error.kind
                    }, r($.error.message), 9, Mu)) : y("", !0),
                    b(Re, {
                      node: f(Oe)($.scores.map((L) => L.field))
                    }, {
                      default: me(({ index: L }) => [
                        (a(!0), o(U, null, I([$.scores[L]], (T) => (a(), o("dl", {
                          key: T.field,
                          class: "compare"
                        }, [
                          t("dt", Au, r(T.field.split(".").at(-1)), 1),
                          t("dd", null, [
                            t("span", {
                              class: Q(["cell", te(T)])
                            }, r(T.failed ? "Failed" : P(T.score)), 3),
                            t("div", Ru, [
                              g[17] || (g[17] = t("span", { class: "cmp-label" }, "Expected", -1)),
                              b(Be, {
                                value: T.expected
                              }, null, 8, ["value"])
                            ]),
                            t("div", Bu, [
                              g[18] || (g[18] = t("span", { class: "cmp-label" }, "Extracted", -1)),
                              T.failed ? (a(), J(Lt, {
                                key: 0,
                                error: T.error
                              }, null, 8, ["error"])) : (a(), J(Be, {
                                key: 1,
                                value: T.value
                              }, null, 8, ["value"]))
                            ]),
                            T.failed ? y("", !0) : (a(), o("span", Lu, [
                              t("span", {
                                class: Q(["chip", T.verified ? "primary" : "warn"])
                              }, [
                                b(f(R), {
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
                    t("p", Ou, r($.tokens.toLocaleString()) + " tokens · " + r(ue($.duration_ms)), 1)
                  ], 8, Uu)
                ])) : y("", !0)
              ], 64))), 128))
            ])
          ])
        ])
      ])) : y("", !0),
      t("section", Pu, [
        t("header", Tu, [
          g[20] || (g[20] = t("h2", { class: "block-title" }, "Cases", -1)),
          t("span", Du, r(e.cases.length), 1),
          b(f(de), {
            label: "Add case",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: !e.fields.length,
            onClick: g[2] || (g[2] = ($) => u.value = !u.value)
          }, null, 8, ["disabled"])
        ]),
        u.value ? (a(), o("form", {
          key: 0,
          class: "case-form",
          onSubmit: ve(C, ["prevent"])
        }, [
          t("label", null, [
            g[21] || (g[21] = q("Document", -1)),
            b(Bt, {
              value: p.value,
              onSelect: g[3] || (g[3] = ($) => {
                p.value = $;
              })
            }, null, 8, ["value"])
          ]),
          g[24] || (g[24] = t("p", { class: "muted" }, "Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.", -1)),
          b(Re, { node: D.value }, {
            default: me(({ index: $ }) => [
              (a(!0), o(U, null, I([e.fields[$]], (L) => (a(), o("label", {
                key: f(G)(L)
              }, [
                t("span", Iu, r(L.name), 1),
                L.type === "boolean" ? z((a(), o("select", {
                  key: 0,
                  "onUpdate:modelValue": (T) => h.value[f(G)(L)] = T
                }, [...g[22] || (g[22] = [
                  t("option", { value: "" }, "Not stated", -1),
                  t("option", { value: "true" }, "Yes", -1),
                  t("option", { value: "false" }, "No", -1)
                ])], 8, ju)), [
                  [Ge, h.value[f(G)(L)]]
                ]) : L.type === "enum" ? z((a(), o("select", {
                  key: 1,
                  "onUpdate:modelValue": (T) => h.value[f(G)(L)] = T
                }, [
                  g[23] || (g[23] = t("option", { value: "" }, "Not stated", -1)),
                  (a(!0), o(U, null, I(L.enum_values, (T) => (a(), o("option", { key: T }, r(T), 1))), 128))
                ], 8, zu)), [
                  [Ge, h.value[f(G)(L)]]
                ]) : L.type === "object" || L.type === "list" ? z((a(), o("textarea", {
                  key: 2,
                  "onUpdate:modelValue": (T) => h.value[f(G)(L)] = T,
                  rows: "2",
                  placeholder: L.type === "list" ? '["first", "second"]' : '{"key": "value"}'
                }, null, 8, Wu)), [
                  [_, h.value[f(G)(L)]]
                ]) : z((a(), o("input", {
                  key: 3,
                  "onUpdate:modelValue": (T) => h.value[f(G)(L)] = T,
                  type: L.type === "number" ? "number" : L.type === "date" ? "date" : "text",
                  placeholder: "Not stated"
                }, null, 8, Hu)), [
                  [dl, h.value[f(G)(L)]]
                ])
              ]))), 128))
            ]),
            _: 1
          }, 8, ["node"]),
          d.value ? (a(), o("p", Gu, r(d.value), 1)) : y("", !0),
          t("div", Ku, [
            b(f(de), {
              label: "Save case",
              size: "small",
              type: "submit",
              disabled: !p.value,
              loading: e.saving
            }, null, 8, ["disabled", "loading"]),
            b(f(de), {
              label: "Cancel",
              size: "small",
              severity: "secondary",
              text: "",
              onClick: g[4] || (g[4] = ($) => u.value = !1)
            })
          ])
        ], 32)) : y("", !0),
        e.fields.length ? !e.cases.length && !u.value ? (a(), o("p", Ju, "No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.")) : e.cases.length ? (a(), o("div", Yu, [
          t("table", Xu, [
            g[25] || (g[25] = t("thead", null, [
              t("tr", null, [
                t("th", null, "Document"),
                t("th", null, "Expected values"),
                t("th")
              ])
            ], -1)),
            t("tbody", null, [
              (a(!0), o(U, null, I(e.cases, ($) => (a(), o("tr", {
                key: $.id
              }, [
                t("td", null, [
                  b(f(R), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  q(" " + r($.upload_name), 1)
                ]),
                t("td", null, [
                  b(Re, { node: D.value }, {
                    default: me(({ index: L }) => [
                      t("div", Zu, [
                        t("strong", null, r(e.fields[L].name), 1),
                        f(kt)($.expected, f(G)(e.fields[L])) !== void 0 ? (a(), J(Be, {
                          key: 0,
                          value: f(kt)($.expected, f(G)(e.fields[L]))
                        }, null, 8, ["value"])) : (a(), o("span", _u, "Not stated"))
                      ])
                    ]),
                    _: 2
                  }, 1032, ["node"])
                ]),
                t("td", ed, [
                  t("button", {
                    type: "button",
                    class: "kx-iconbtn kx-focus-outline",
                    "aria-label": `Remove case ${$.upload_name}`,
                    disabled: e.saving,
                    onClick: (L) => i("delete-case", $.id)
                  }, [
                    b(f(R), { icon: "tabler:trash" })
                  ], 8, td)
                ])
              ]))), 128))
            ])
          ])
        ])) : y("", !0) : (a(), o("p", Qu, "Add a field in the Builder, then add documents with the values you expect."))
      ]),
      e.evaluations.length ? (a(), o("section", ld, [
        t("header", ad, [
          g[26] || (g[26] = t("h2", { class: "block-title" }, "History", -1)),
          t("span", nd, r(e.evaluations.length), 1)
        ]),
        t("ul", sd, [
          (a(!0), o(U, null, I(e.evaluations, ($) => (a(), o("li", {
            key: $.id
          }, [
            t("button", {
              type: "button",
              class: Q({ active: s.value?.id === $.id }),
              "aria-current": s.value?.id === $.id,
              onClick: (L) => i("open", $.id)
            }, [
              t("span", {
                class: "badge",
                "data-status": $.status
              }, r(be[$.status]), 9, id),
              t("span", null, "Revision " + r($.config_revision), 1),
              t("span", ud, r(f(Ye)($.created_at)), 1),
              t("strong", dd, r($.status === "completed" || $.status === "partial" ? P(f(Ve)($)) : "—"), 1)
            ], 10, od)
          ]))), 128))
        ])
      ])) : y("", !0)
    ]));
  }
}), cd = { class: "section-head" }, vd = { class: "muted" }, md = {
  key: 0,
  class: "empty"
}, pd = {
  key: 1,
  class: "table-scroll"
}, fd = { class: "metric-table runs-table" }, bd = ["aria-label", "aria-expanded", "onClick"], gd = { class: "caller" }, hd = {
  key: 0,
  class: "muted"
}, yd = ["data-status"], kd = {
  class: "num",
  "data-label": "Time"
}, $d = {
  class: "num",
  "data-label": "Tokens"
}, xd = {
  class: "muted",
  "data-label": "Expires"
}, wd = {
  key: 0,
  class: "result-detail"
}, Sd = { colspan: "6" }, Vd = /* @__PURE__ */ W({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(e) {
    const n = M(), l = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (i, u) => (a(), o(U, null, [
      t("div", cd, [
        u[0] || (u[0] = t("h2", null, "Recent runs", -1)),
        t("span", vd, "Runs expire after " + r(e.retention), 1)
      ]),
      e.runs.length ? (a(), o("div", pd, [
        t("table", fd, [
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
            (a(!0), o(U, null, I(e.runs, (p) => (a(), o(U, {
              key: p.id
            }, [
              t("tr", null, [
                t("td", null, [
                  t("button", {
                    type: "button",
                    class: "case-toggle",
                    "aria-label": `Show values for run ${p.id}`,
                    "aria-expanded": n.value === p.id,
                    onClick: (h) => n.value = n.value === p.id ? void 0 : p.id
                  }, [
                    b(f(R), {
                      icon: n.value === p.id ? "tabler:chevron-down" : "tabler:chevron-right"
                    }, null, 8, ["icon"]),
                    q(r(f(Ye)(p.created_at)), 1)
                  ], 8, bd)
                ]),
                t("td", null, [
                  t("span", gd, [
                    b(f(R), {
                      icon: l[p.caller].icon
                    }, null, 8, ["icon"]),
                    q(r(l[p.caller].label), 1)
                  ]),
                  p.result.page_range ? (a(), o("span", hd, " · Pages " + r(p.result.page_range.first) + "–" + r(p.result.page_range.last), 1)) : y("", !0)
                ]),
                t("td", null, [
                  t("span", {
                    class: "badge",
                    "data-status": p.status
                  }, r(p.status === "completed" ? "Completed" : p.status === "partial" ? "Partial" : "Failed"), 9, yd)
                ]),
                t("td", kd, r((p.duration_ms / 1e3).toFixed(1)) + "s", 1),
                t("td", $d, r(Number(p.tokens).toLocaleString()), 1),
                t("td", xd, r(f(Ye)(p.expires_at)), 1)
              ]),
              n.value === p.id ? (a(), o("tr", wd, [
                t("td", Sd, [
                  b(Ot, {
                    fields: p.result.fields,
                    "page-range": p.result.page_range
                  }, null, 8, ["fields", "page-range"])
                ])
              ])) : y("", !0)
            ], 64))), 128))
          ])
        ])
      ])) : (a(), o("p", md, "No runs yet. Runs from the Test tab, agents, evaluations and Workflows appear here."))
    ], 64));
  }
}), Cd = {
  key: 0,
  role: "alert",
  class: "error banner"
}, Ed = /* @__PURE__ */ W({
  __name: "SharePopup",
  props: {
    id: {},
    title: {}
  },
  emits: ["close"],
  setup(e, { emit: n }) {
    const l = e, i = n, u = M(), p = M("");
    return Ne(async () => {
      try {
        await Ze("kickside-share", { timeoutMs: 8e3 });
      } catch (x) {
        p.value = `Sharing is unavailable: ${x instanceof Error ? x.message : String(x)}`;
        return;
      }
      const h = document.createElement("kickside-share"), d = encodeURIComponent(l.id);
      h.setAttribute("config", JSON.stringify({ resource_id: l.id, title: l.title, access_url: `/api/v1/component-access/grants/${d}`, share_url: `/api/v1/component-access/share/${d}` })), h.style.display = "block", h.addEventListener("close", () => i("close")), u.value?.appendChild(h);
    }), (h, d) => (a(), o("div", {
      ref_key: "host",
      ref: u
    }, [
      p.value ? (a(), o("p", Cd, r(p.value), 1)) : y("", !0)
    ], 512));
  }
}), qd = { class: "docscout" }, Nd = { class: "toolbar" }, Fd = { class: "toolbar-lead" }, Ud = { class: "crumb-row" }, Md = { class: "crumb" }, Ad = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, Rd = ["id", "aria-selected", "aria-controls", "onClick"], Bd = { class: "toolbar-side" }, Ld = { class: "stats" }, Od = ["title"], Pd = {
  key: 2,
  class: "unsaved"
}, Td = {
  key: 0,
  class: "banner row wrap",
  role: "status"
}, Dd = {
  key: 1,
  role: "alert",
  class: "error banner"
}, Id = {
  key: 3,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, jd = ["id", "aria-labelledby"], zd = /* @__PURE__ */ W({
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
    const l = e, i = n, u = M(), p = M(!1), h = M("Builder"), d = M($t()), x = M(""), C = M(""), w = F(() => l.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    fe(h, () => {
      u.value && (u.value.scrollTop = 0);
    }, { flush: "post" });
    const c = M(), s = M(), v = F(() => l.snapshot.can_edit && c.value !== l.snapshot.expected_revision), A = F(() => v.value && s.value !== l.snapshot.expected_revision);
    function S(P) {
      return x.value === P.title && C.value === (P.description ?? "") && Nl(d.value, P.config);
    }
    function N() {
      const P = l.snapshot;
      d.value = structuredClone(gt(P.config ?? $t())), x.value = P.title, C.value = P.description ?? "", c.value = P.expected_revision, s.value = void 0;
    }
    fe(() => l.snapshot, (P, O) => {
      w.value.includes(h.value) || (h.value = w.value[0]), !(O && P.id === O.id && P.can_edit && O.can_edit && !S(O) && !S(P)) && N();
    }, { immediate: !0 });
    const K = F(() => l.snapshot.can_edit && !S(l.snapshot)), D = F(() => ql(d.value)), j = F(() => Object.keys(ke).filter((P) => Qe(d.value, P)).length);
    function H() {
      i("save", { title: x.value, description: C.value, config: structuredClone(gt(d.value)), expected_revision: c.value });
    }
    return (P, O) => (a(), o("main", qd, [
      t("div", Nd, [
        t("div", Fd, [
          t("span", Ud, [
            e.back ? (a(), o("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: O[0] || (O[0] = (B) => i("back"))
            }, [
              b(f(R), { icon: "tabler:arrow-left" })
            ])) : y("", !0),
            t("span", Md, r(e.snapshot.title), 1)
          ]),
          t("nav", Ad, [
            (a(!0), o(U, null, I(w.value, (B) => (a(), o("button", {
              id: `tab-${B}`,
              key: B,
              role: "tab",
              "aria-selected": h.value === B,
              "aria-controls": `panel-${B}`,
              onClick: (ue) => h.value = B
            }, r(B), 9, Rd))), 128))
          ])
        ]),
        t("div", Bd, [
          e.snapshot.can_share ? (a(), J(f(de), {
            key: 0,
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-label": "Share",
            onClick: O[1] || (O[1] = (B) => p.value = !0)
          }, {
            default: me(() => [
              b(f(R), { icon: "tabler:share" }),
              O[11] || (O[11] = t("span", { class: "btn-label" }, "Share", -1))
            ]),
            _: 1
          })) : y("", !0),
          t("span", Ld, [
            q(r(e.snapshot.field_count) + " " + r(e.snapshot.field_count === 1 ? "field" : "fields"), 1),
            e.snapshot.can_edit ? (a(), o(U, { key: 0 }, [
              q(" · " + r(j.value) + " steps · revision " + r(e.snapshot.expected_revision), 1)
            ], 64)) : (a(), o(U, { key: 1 }, [
              q(" · Read access")
            ], 64))
          ]),
          e.snapshot.can_edit ? (a(), o(U, { key: 1 }, [
            v.value && !A.value ? (a(), J(f(de), {
              key: 0,
              label: "Reload saved",
              severity: "secondary",
              size: "small",
              onClick: N
            })) : y("", !0),
            D.value ? (a(), o("span", {
              key: 1,
              class: "invalid",
              role: "alert",
              title: D.value
            }, [
              b(f(R), { icon: "tabler:alert-circle" }),
              q(r(D.value), 1)
            ], 8, Od)) : K.value ? (a(), o("span", Pd, "Unsaved")) : y("", !0),
            b(f(de), {
              label: "Save",
              size: "small",
              loading: e.saving,
              disabled: !K.value || !!D.value || !x.value.trim(),
              onClick: H
            }, null, 8, ["loading", "disabled"])
          ], 64)) : y("", !0)
        ])
      ]),
      A.value ? (a(), o("div", Td, [
        t("span", null, "Saved configuration changed to revision " + r(e.snapshot.expected_revision) + ". Your edits are kept.", 1),
        b(f(de), {
          label: "Reload saved",
          severity: "secondary",
          size: "small",
          onClick: N
        }),
        b(f(de), {
          label: "Keep editing",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: O[2] || (O[2] = (B) => s.value = e.snapshot.expected_revision)
        })
      ])) : y("", !0),
      e.error ? (a(), o("p", Dd, r(e.error), 1)) : y("", !0),
      p.value ? (a(), J(Ed, {
        key: 2,
        id: e.snapshot.id,
        title: e.snapshot.title,
        onClose: O[3] || (O[3] = (B) => p.value = !1)
      }, null, 8, ["id", "title"])) : y("", !0),
      h.value === "Builder" && e.snapshot.can_edit ? (a(), o("div", Id, [
        b(Ko, {
          title: x.value,
          "onUpdate:title": O[4] || (O[4] = (B) => x.value = B),
          description: C.value,
          "onUpdate:description": O[5] || (O[5] = (B) => C.value = B),
          config: d.value,
          retention: e.snapshot.retention,
          result: e.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (a(), o("div", {
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
          h.value === "Test" ? (a(), J(Li, {
            key: 0,
            result: e.result,
            retention: e.snapshot.retention,
            running: e.running,
            "can-run": e.snapshot.field_count > 0,
            onRun: O[6] || (O[6] = (B) => i("run", B))
          }, null, 8, ["result", "retention", "running", "can-run"])) : y("", !0),
          h.value === "Evals" && e.snapshot.can_edit ? (a(), J(rd, {
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
          }, null, 8, ["cases", "added-case-id", "fields", "evaluations", "evaluation", "revision", "changed", "saving", "starting"])) : y("", !0),
          h.value === "Runs" ? (a(), J(Vd, {
            key: 2,
            runs: e.snapshot.runs,
            retention: e.snapshot.retention
          }, null, 8, ["runs", "retention"])) : y("", !0)
        ], 8, jd)
      ], 512))
    ]));
  }
}), Wd = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, Hd = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, Yd = /* @__PURE__ */ W({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(e, { emit: n }) {
    const l = e, i = n, u = M(), p = M(""), h = M(!1), d = M(!1), x = M(!1), C = M(), w = M(null), c = M([]), s = M();
    let v = [], A = 0, S = 0, N = 0, K;
    const D = (V) => V instanceof Error ? V.message : String(V), j = (V) => V === A;
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
          s.value = Te;
        }
      } catch (T) {
        L() && (p.value = D(T));
      }
    }
    async function P(V) {
      const g = ++S, $ = () => j(V) && g === S;
      if (!l.id) {
        p.value = "No extractor selected.";
        return;
      }
      try {
        const L = await he.get(l.id);
        if (!$()) return;
        u.value = L, p.value = "", L.can_edit && await H(V);
      } catch (L) {
        $() && (p.value = D(L));
      }
    }
    fe(() => l.id, (V, g) => {
      A++, K = void 0, v.forEach((L) => L()), v = [], C.value = void 0, u.value = void 0, w.value = null, c.value = [], s.value = void 0, p.value = "";
      const $ = A;
      l.id && (v = [xt(`component.${l.id}`, () => P($)), xt(`docscout.runs.${l.id}`, () => P($))]), g !== void 0 && P($);
    }, { immediate: !0 }), Fl(() => P(A)), Ct(() => {
      A++, v.forEach((V) => V());
    });
    async function O(V) {
      const g = A;
      h.value = !0, p.value = "";
      try {
        const $ = await V();
        if (j(g))
          return await P(g), $;
      } catch ($) {
        j(g) && (p.value = D($));
      } finally {
        h.value = !1;
      }
    }
    const B = (V) => O(() => he.update(l.id, V));
    async function ue(V) {
      const g = A, $ = await O(() => he.addCase(l.id, V));
      $ && j(g) && (C.value = $.id);
    }
    const ye = (V) => O(() => he.deleteCase(l.id, V));
    async function te(V) {
      const g = A;
      d.value = !0, p.value = "";
      try {
        const $ = await he.run(l.id, V);
        j(g) && (w.value = $, await P(g));
      } catch ($) {
        j(g) && (p.value = D($));
      } finally {
        d.value = !1;
      }
    }
    async function oe() {
      const V = A;
      x.value = !0, p.value = "";
      try {
        const { eval_id: g } = await he.evaluate(l.id);
        j(V) && await H(V, g);
      } catch (g) {
        j(V) && (p.value = D(g));
      } finally {
        x.value = !1;
      }
    }
    function be(V) {
      H(A, V);
    }
    return (V, g) => u.value ? (a(), J(zd, {
      key: 0,
      snapshot: u.value,
      "added-case-id": C.value,
      saving: h.value,
      running: d.value,
      starting: x.value,
      result: w.value,
      evaluations: c.value,
      evaluation: s.value,
      error: p.value,
      back: e.back,
      onBack: g[0] || (g[0] = ($) => i("back")),
      onRun: te,
      onSave: B,
      onAddCase: ue,
      onDeleteCase: ye,
      onEvaluate: oe,
      onOpenEvaluation: be
    }, null, 8, ["snapshot", "added-case-id", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : p.value ? (a(), o("p", Wd, r(p.value), 1)) : (a(), o("p", Hd, "Loading Docscout…"));
  }
});
export {
  Yd as _,
  Ye as w
};
