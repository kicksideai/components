import { defineComponent as z, useModel as Le, openBlock as n, createElementBlock as o, withModifiers as ve, createElementVNode as t, mergeModels as Xe, computed as F, withKeys as Ee, unref as m, normalizeClass as Q, createVNode as f, toDisplayString as c, Fragment as U, renderList as I, createCommentVNode as $, createTextVNode as q, createBlock as J, ref as N, useId as pe, watch as fe, withDirectives as H, vModelText as ee, vModelSelect as Ke, resolveComponent as st, renderSlot as je, withCtx as me, mergeProps as bt, vShow as Ge, onMounted as Fe, nextTick as Ce, normalizeStyle as qe, onBeforeUnmount as Ct, vModelDynamic as dl, toRaw as ht } from "vue";
import { B as rl, L as cl, j as ze, v as Me, k as vl, U as ml, I as gt, f as pl, i as Qe, l as Et, t as lt, h as ke, o as ot, p as fl, m as qt, q as K, M as Ae, r as Ft, w as Nt, x as at, y as bl, z as hl, A as gl, C as yl, D as kl, E as Ut, F as $l, G as Mt, H as xl, J as wl, K as Sl, N as yt, O as Vl, P as et, Q as Cl, R as Oe, S as El, s as de, T as kt, n as $t, V as ql, W as Fl, b as Nl, c as ge } from "./index-B7lywxOH.js";
import { loadByTagName as Ze, on as xt } from "@wippy-fe/proxy";
import { Icon as M } from "@iconify/vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
var Ul = rl.extend({
  name: "focustrap-directive"
}), Ml = vl.extend({
  style: Ul
});
function Te(e) {
  "@babel/helpers - typeof";
  return Te = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(s) {
    return typeof s;
  } : function(s) {
    return s && typeof Symbol == "function" && s.constructor === Symbol && s !== Symbol.prototype ? "symbol" : typeof s;
  }, Te(e);
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
  return (s = Bl(s)) in e ? Object.defineProperty(e, s, { value: l, enumerable: !0, configurable: !0, writable: !0 }) : e[s] = l, e;
}
function Bl(e) {
  var s = Rl(e, "string");
  return Te(s) == "symbol" ? s : s + "";
}
function Rl(e, s) {
  if (Te(e) != "object" || !e) return e;
  var l = e[Symbol.toPrimitive];
  if (l !== void 0) {
    var i = l.call(e, s);
    if (Te(i) != "object") return i;
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
      var i = this, u = l.value || {}, p = u.onFocusIn, g = u.onFocusOut;
      s.$_pfocustrap_mutationobserver = new MutationObserver(function(r) {
        r.forEach(function(y) {
          if (y.type === "childList" && !s.contains(document.activeElement)) {
            var S = function(a) {
              var d = gt(a) ? gt(a, i.getComputedSelector(s.$_pfocustrap_focusableselector)) ? a : Me(s, i.getComputedSelector(s.$_pfocustrap_focusableselector)) : Me(a);
              return pl(d) ? d : a.nextSibling && S(a.nextSibling);
            };
            ze(S(y.nextSibling));
          }
        });
      }), s.$_pfocustrap_mutationobserver.disconnect(), s.$_pfocustrap_mutationobserver.observe(s, {
        childList: !0
      }), s.$_pfocustrap_focusinlistener = function(r) {
        return p && p(r);
      }, s.$_pfocustrap_focusoutlistener = function(r) {
        return g && g(r);
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
      var i = l.value || {}, u = i.autoFocusSelector, p = u === void 0 ? "" : u, g = i.firstFocusableSelector, r = g === void 0 ? "" : g, y = i.autoFocus, S = y === void 0 ? !1 : y, b = Me(s, "[autofocus]".concat(this.getComputedSelector(p)));
      S && !b && (b = Me(s, this.getComputedSelector(r))), ze(b);
    },
    onFirstHiddenElementFocus: function(s) {
      var l, i = s.currentTarget, u = s.relatedTarget, p = u === i.$_pfocustrap_lasthiddenfocusableelement || !((l = this.$el) !== null && l !== void 0 && l.contains(u)) ? Me(i.parentElement, this.getComputedSelector(i.$_pfocustrap_focusableselector)) : i.$_pfocustrap_lasthiddenfocusableelement;
      ze(p);
    },
    onLastHiddenElementFocus: function(s) {
      var l, i = s.currentTarget, u = s.relatedTarget, p = u === i.$_pfocustrap_firsthiddenfocusableelement || !((l = this.$el) !== null && l !== void 0 && l.contains(u)) ? cl(i.parentElement, this.getComputedSelector(i.$_pfocustrap_focusableselector)) : i.$_pfocustrap_firsthiddenfocusableelement;
      ze(p);
    },
    createHiddenFocusableElements: function(s, l) {
      var i = this, u = l.value || {}, p = u.tabIndex, g = p === void 0 ? 0 : p, r = u.firstFocusableSelector, y = r === void 0 ? "" : r, S = u.lastFocusableSelector, b = S === void 0 ? "" : S, a = function(C) {
        return ml("span", {
          class: "p-hidden-accessible p-hidden-focusable",
          tabIndex: g,
          role: "presentation",
          "aria-hidden": !0,
          "data-p-hidden-accessible": !0,
          "data-p-hidden-focusable": !0,
          onFocus: C?.bind(i)
        });
      }, d = a(this.onFirstHiddenElementFocus), L = a(this.onLastHiddenElementFocus);
      d.$_pfocustrap_lasthiddenfocusableelement = L, d.$_pfocustrap_focusableselector = y, d.setAttribute("data-pc-section", "firstfocusableelement"), L.$_pfocustrap_firsthiddenfocusableelement = d, L.$_pfocustrap_focusableselector = b, L.setAttribute("data-pc-section", "lastfocusableelement"), s.prepend(d), s.append(L);
    }
  }
});
const Ol = ["aria-checked", "aria-label", "disabled"], _ = /* @__PURE__ */ z({
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
}), Tl = ["aria-label"], Pl = { class: "node-icon" }, Dl = { class: "node-main" }, Il = { class: "node-title" }, jl = { class: "node-summary" }, zl = {
  key: 0,
  class: "chips"
}, Hl = {
  key: 1,
  class: "trace-line"
}, Wl = { class: "node-side" }, Kl = {
  key: 0,
  class: "chip model"
}, we = /* @__PURE__ */ z({
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
    const l = e, i = s, u = F(() => Qe(l.config, l.stage)), p = F(() => l.config.stages[l.stage].model), g = F({ get: () => u.value, set: (S) => {
      l.config.stages[l.stage].enabled = S;
    } }), r = F(() => {
      const S = l.config, b = S.stages;
      switch (l.stage) {
        case "map":
          return S.fields.filter((a) => a.search_within === "sections").map((a) => ({ text: a.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...b.prefetch.queries.map((a) => ({ text: a.name || "Untitled query", tone: "" })), ...S.fields.filter((a) => a.search_hints.trim()).map((a) => ({ text: a.name, tone: "hint" }))];
        case "scout":
          return b.scout.mode === "agent" ? b.scout.tools.map((a) => ({ text: lt(a).toLowerCase(), tone: "" })) : [];
        case "deep":
          return S.fields.filter((a) => a.strategy === "deep").map((a) => ({ text: a.name || "New field", tone: "primary" }));
        case "extract":
          return Et(S).map((a) => ({ text: `${a.name} · ${a.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), y = (S) => [`${(S.duration_ms / 1e3).toFixed(1)}s`, `${(S.input_tokens + S.output_tokens).toLocaleString()} tokens`, S.queries?.length ? `${S.queries.length} queries` : "", S.message ?? ""].filter(Boolean).join(" · ");
    return (S, b) => (n(), o("div", {
      class: Q(["node kx-focus-halo", { active: e.active, off: !u.value, fixed: e.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": m(ke)[e.stage],
      onClick: b[1] || (b[1] = (a) => i("select")),
      onKeydown: [
        b[2] || (b[2] = Ee((a) => i("select"), ["enter"])),
        b[3] || (b[3] = Ee(ve((a) => i("select"), ["prevent"]), ["space"]))
      ]
    }, [
      t("span", Pl, [
        f(m(M), {
          icon: m(ot)[e.stage]
        }, null, 8, ["icon"])
      ]),
      t("span", Dl, [
        t("span", Il, c(m(ke)[e.stage]), 1),
        t("span", jl, c(u.value ? m(fl)(e.stage, e.config) : "Off"), 1),
        u.value && r.value.length ? (n(), o("span", zl, [
          (n(!0), o(U, null, I(r.value, (a) => (n(), o("span", {
            key: a.text,
            class: Q(["chip", { primary: a.tone === "primary", "muted-chip": a.tone === "hint" }])
          }, c(a.text), 3))), 128))
        ])) : $("", !0),
        e.trace ? (n(), o("span", Hl, [
          f(m(M), {
            icon: e.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          q(c(y(e.trace)), 1)
        ])) : $("", !0)
      ]),
      t("span", Wl, [
        u.value && p.value ? (n(), o("span", Kl, c(m(qt)(p.value)), 1)) : $("", !0),
        e.stage !== "extract" && !e.readonly ? (n(), J(_, {
          key: 1,
          modelValue: g.value,
          "onUpdate:modelValue": b[0] || (b[0] = (a) => g.value = a),
          label: `Enable ${m(ke)[e.stage]}`
        }, null, 8, ["modelValue", "label"])) : $("", !0)
      ])
    ], 42, Tl));
  }
}), Gl = ["aria-labelledby"], Ql = ["aria-label", "aria-checked", "tabindex", "disabled", "onClick", "onKeydown"], $e = /* @__PURE__ */ z({
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
    const s = e, l = Le(e, "modelValue"), i = N([]);
    function u(p, g) {
      const r = s.options.length - 1, y = { ArrowRight: g + 1, ArrowDown: g + 1, ArrowLeft: g - 1, ArrowUp: g - 1, Home: 0, End: r }[p.key];
      if (y === void 0) return;
      p.preventDefault();
      const S = (y + s.options.length) % s.options.length;
      l.value = s.options[S].value, i.value[S]?.focus();
    }
    return (p, g) => (n(), o("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": e.labelledBy
    }, [
      (n(!0), o(U, null, I(e.options, (r, y) => (n(), o("button", {
        key: r.value,
        ref_for: !0,
        ref_key: "buttons",
        ref: i,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        role: "radio",
        "aria-label": e.name ? `${e.name}: ${r.label}` : void 0,
        "aria-checked": l.value === r.value,
        tabindex: l.value === r.value ? 0 : -1,
        disabled: e.disabled,
        onClick: (S) => l.value = r.value,
        onKeydown: (S) => u(S, y)
      }, [
        r.icon ? (n(), J(m(M), {
          key: 0,
          icon: r.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : $("", !0),
        t("span", null, c(r.label), 1)
      ], 40, Ql))), 128))
    ], 8, Gl));
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
  function l(i, u, p, g) {
    s.push({ field: u, trail: p, shape: i, path: g, depth: p.length + 1, key: ie(u, p) }), i.properties?.forEach((r, y) => l(r, u, [...p, y], `${g}.${r.name || "New property"}`)), i.item && l(i.item, u, [...p, "item"], `${g}[]`);
  }
  return e.forEach((i, u) => l(i, u, [], K(i) || "New field")), s;
}
function nt(e) {
  return 1 + Math.max(0, ...(e.properties ?? []).map(nt), e.item ? nt(e.item) : 0);
}
function Yl(e, s) {
  return Je(e).filter((l) => l.shape.type === "object" && ((l.shape.properties?.length ?? 0) < 100 || l.field === s.field && ie(l.field, l.trail) === ie(s.field, s.trail.slice(0, -1))) && l.depth + nt(s.shape) <= Ae && !(l.field === s.field && s.trail.every((i, u) => l.trail[u] === i)));
}
function Xl(e, s, l) {
  const i = { ...Nt(), ...s.shape, name: s.shape.name };
  s.trail.length ? Je(e).find((g) => g.key === ie(s.field, s.trail.slice(0, -1))).shape.properties.splice(s.trail.at(-1), 1) : e.splice(s.field, 1);
  let u;
  if (l) {
    const { name: p, type: g, description: r, enum_values: y, expected_format: S, required: b, properties: a, item: d } = i;
    u = { name: p, type: g, description: r, enum_values: y, expected_format: S, required: b, ...a ? { properties: a } : {}, ...d ? { item: d } : {} }, l.shape.properties.push(u), u = l.shape.properties.at(-1);
  } else
    u = { ...at(), ...i, group: "" }, e.push(u), u = e.at(-1);
  return Je(e).find((p) => p.shape === u);
}
function Vt(e, s = !1) {
  function l(u) {
    return u.type === "object" ? Object.fromEntries((u.properties ?? []).map((p) => [p.name || "unnamed", l(p)])) : u.type === "list" ? u.item ? [l(u.item)] : [] : s ? u.enum_values?.length ? u.enum_values[0] : { text: "Example value", number: 42, boolean: !0, date: "2026-01-15", enum: null }[u.type] : u.type === "enum" ? u.enum_values?.join(" | ") || "enum" : u.type;
  }
  const i = {};
  return e.forEach((u) => Ft(i, K(u) || "unnamed", l(u))), i;
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
}, pa = { class: "muted" }, fa = ["aria-label", "disabled"], ba = /* @__PURE__ */ z({
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
    const l = e, i = s, u = F(() => l.shape), p = F(() => l.named ? l.depth === 1 ? "Field type" : "Property type" : "Item type"), g = F(() => At.filter((A) => l.depth < Ae || !["object", "list"].includes(A.value))), r = F({ get: () => l.shape.type, set: (A) => {
      l.shape.type = A, delete l.shape.properties, delete l.shape.item, l.shape.enum_values = [], A === "object" && (l.shape.properties = []), A === "list" && (l.shape.item = bl());
    } }), y = pe(), S = pe(), b = N(""), a = N("");
    fe(() => l.shape, () => {
      b.value = "", a.value = "";
    });
    const d = F(() => l.validationError || (l.named ? hl(u.value.name, l.siblingNames) : "") || gl(l.shape, l.depth));
    function L() {
      const A = b.value.trim(), C = l.shape.enum_values ?? [];
      if (!A || A.length > 200) {
        a.value = "Enter 1 to 200 characters.";
        return;
      }
      if (C.includes(A)) {
        a.value = "This value already exists.";
        return;
      }
      if (C.length >= 100) {
        a.value = "Use at most 100 allowed values.";
        return;
      }
      l.shape.enum_values = [...C, A], b.value = "", a.value = "";
    }
    return (A, C) => (n(), o("div", Zl, [
      e.named ? (n(), o("label", _l, [
        C[8] || (C[8] = q("Name", -1)),
        H(t("input", {
          "onUpdate:modelValue": C[0] || (C[0] = (E) => u.value.name = E),
          "aria-label": e.depth === 1 ? "Field name" : "Property name",
          "aria-invalid": !!d.value,
          "aria-describedby": d.value ? m(S) : void 0,
          maxlength: "80",
          spellcheck: "false",
          class: "mono-input"
        }, null, 8, ea), [
          [
            ee,
            u.value.name,
            void 0,
            { trim: !0 }
          ]
        ])
      ])) : $("", !0),
      t("div", ta, [
        t("span", { id: m(y) }, c(e.named ? "Data type" : "Item type"), 9, la),
        f($e, {
          modelValue: r.value,
          "onUpdate:modelValue": C[1] || (C[1] = (E) => r.value = E),
          class: "type-picker",
          options: g.value,
          "labelled-by": m(y),
          name: p.value,
          disabled: e.readonly
        }, null, 8, ["modelValue", "options", "labelled-by", "name", "disabled"]),
        e.depth === m(Ae) ? (n(), o("small", aa, "Level four · choose a value type.")) : $("", !0)
      ]),
      d.value ? (n(), o("p", {
        key: 1,
        id: m(S),
        class: "field-error",
        role: "alert"
      }, c(d.value), 9, na)) : $("", !0),
      m(yl)(e.shape, e.named) ? (n(), o("div", sa, [
        t("span", null, c(e.shape.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        t("div", oa, [
          (n(!0), o(U, null, I(e.shape.enum_values, (E, G) => (n(), o("span", {
            key: E,
            class: "chip primary"
          }, [
            q(c(E), 1),
            e.readonly ? $("", !0) : (n(), o("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Remove allowed value ${E}`,
              onClick: (D) => e.shape.enum_values.splice(G, 1)
            }, [
              f(m(M), { icon: "tabler:x" })
            ], 8, ia))
          ]))), 128))
        ]),
        e.readonly ? $("", !0) : (n(), o("div", ua, [
          H(t("input", {
            "onUpdate:modelValue": C[2] || (C[2] = (E) => b.value = E),
            "aria-label": "New allowed value",
            placeholder: "Add a value…",
            maxlength: "200",
            onKeydown: Ee(ve(L, ["prevent"]), ["enter"])
          }, null, 40, da), [
            [ee, b.value]
          ]),
          t("button", {
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo",
            onClick: L
          }, "Add")
        ])),
        a.value ? (n(), o("p", ra, c(a.value), 1)) : $("", !0)
      ])) : $("", !0),
      t("label", null, [
        C[9] || (C[9] = q("Description", -1)),
        H(t("textarea", {
          "onUpdate:modelValue": C[3] || (C[3] = (E) => e.shape.description = E),
          rows: "3",
          maxlength: "4000",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [ee, e.shape.description]
        ])
      ]),
      ["boolean", "enum"].includes(e.shape.type) ? $("", !0) : (n(), o("label", ca, [
        C[10] || (C[10] = q("Expected format", -1)),
        H(t("input", {
          "onUpdate:modelValue": C[4] || (C[4] = (E) => e.shape.expected_format = E),
          maxlength: "400",
          placeholder: m(kl)(e.shape)
        }, null, 8, va), [
          [ee, e.shape.expected_format]
        ])
      ])),
      e.named ? (n(), o("div", ma, [
        C[11] || (C[11] = t("span", null, "Required", -1)),
        f(_, {
          modelValue: u.value.required,
          "onUpdate:modelValue": C[5] || (C[5] = (E) => u.value.required = E),
          label: "Required",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : $("", !0),
      e.shape.type === "object" ? (n(), o(U, { key: 5 }, [
        t("p", pa, c(e.shape.properties?.length ?? 0) + " properties · Select a property in the tree to edit it.", 1),
        !e.readonly && e.depth < m(Ae) ? (n(), o("button", {
          key: 0,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Add property to ${e.label}`,
          disabled: (e.shape.properties?.length ?? 0) >= 100,
          onClick: C[6] || (C[6] = (E) => i("add"))
        }, [
          f(m(M), { icon: "tabler:plus" }),
          C[12] || (C[12] = q("Add property", -1))
        ], 8, fa)) : $("", !0)
      ], 64)) : $("", !0),
      e.shape.type === "list" && e.shape.item ? (n(), o("button", {
        key: 6,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        onClick: C[7] || (C[7] = (E) => i("selectItem"))
      }, [
        f(m(M), { icon: "tabler:brackets" }),
        q("Edit item shape · " + c(e.shape.item.type), 1)
      ])) : $("", !0)
    ]));
  }
}), ha = ["disabled"], ga = { class: "grid" }, ya = { class: "context-stepper" }, ka = ["disabled"], $a = ["disabled"], xa = {
  key: 0,
  class: "field-note"
}, wa = { class: "label-block" }, Sa = {
  key: 1,
  class: "field-error"
}, Va = { id: "docscout-groups" }, Ca = ["value"], Ea = { class: "toggle-row" }, qa = /* @__PURE__ */ z({
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
    const l = e, i = s, u = F(() => !l.depth || l.depth === 1), p = F(() => Ut(l.field, l.otherNames));
    return (g, r) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      f(ba, {
        shape: e.shape ?? e.field,
        depth: e.depth ?? 1,
        label: e.shape?.name || e.field.name || "field",
        named: u.value || !!e.shape?.name || !!e.siblingNames,
        "sibling-names": e.siblingNames,
        "validation-error": u.value ? p.value : void 0,
        readonly: e.readonly,
        onAdd: r[0] || (r[0] = (y) => i("add")),
        onSelectItem: r[1] || (r[1] = (y) => i("selectItem"))
      }, null, 8, ["shape", "depth", "label", "named", "sibling-names", "validation-error", "readonly"]),
      u.value ? (n(), o(U, { key: 0 }, [
        r[25] || (r[25] = t("h4", null, "Finding it", -1)),
        t("label", null, [
          r[12] || (r[12] = q("Search hints", -1)),
          H(t("textarea", {
            "onUpdate:modelValue": r[2] || (r[2] = (y) => e.field.search_hints = y),
            rows: "2",
            maxlength: "4000",
            placeholder: "One query per line"
          }, null, 512), [
            [ee, e.field.search_hints]
          ]),
          r[13] || (r[13] = t("small", null, "Each line is an extra search for this field in Prefetch and Deep analysis.", -1))
        ]),
        t("div", ga, [
          t("label", null, [
            r[15] || (r[15] = q("Strategy", -1)),
            H(t("select", {
              "onUpdate:modelValue": r[3] || (r[3] = (y) => e.field.strategy = y)
            }, [...r[14] || (r[14] = [
              t("option", { value: "standard" }, "Standard", -1),
              t("option", { value: "deep" }, "Deep analysis", -1)
            ])], 512), [
              [Ke, e.field.strategy]
            ])
          ]),
          t("label", null, [
            r[16] || (r[16] = q("Chunks to read", -1)),
            t("span", ya, [
              H(t("input", {
                "onUpdate:modelValue": r[4] || (r[4] = (y) => e.field.chunks = y),
                type: "number",
                min: "1",
                max: "1000",
                "aria-label": "Chunks to read"
              }, null, 512), [
                [
                  ee,
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
                onClick: r[5] || (r[5] = (y) => e.field.chunks--)
              }, "−", 8, ka),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Increase chunks to read",
                disabled: e.field.chunks >= 1e3 || e.readonly,
                onClick: r[6] || (r[6] = (y) => e.field.chunks++)
              }, "+", 8, $a)
            ]),
            r[17] || (r[17] = t("small", null, "Per search hint", -1))
          ])
        ]),
        e.field.strategy === "deep" && !e.deepEnabled ? (n(), o("p", xa, [
          f(m(M), { icon: "tabler:info-circle" }),
          r[18] || (r[18] = q("Deep analysis is off in the flow, so this field runs as standard.", -1))
        ])) : $("", !0),
        t("div", wa, [
          r[19] || (r[19] = t("span", { id: "within-label" }, "Search within", -1)),
          f($e, {
            modelValue: e.field.search_within,
            "onUpdate:modelValue": r[7] || (r[7] = (y) => e.field.search_within = y),
            "labelled-by": "within-label",
            options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
          }, null, 8, ["modelValue"]),
          t("small", null, c(e.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
        ]),
        e.field.search_within === "sections" && !e.mapEnabled ? (n(), o("p", Sa, [
          f(m(M), { icon: "tabler:alert-circle" }),
          r[20] || (r[20] = q("Turn on Map the document to read sections.", -1))
        ])) : $("", !0),
        t("label", null, [
          r[21] || (r[21] = q("Group", -1)),
          H(t("input", {
            "onUpdate:modelValue": r[8] || (r[8] = (y) => e.field.group = y),
            list: "docscout-groups",
            placeholder: "parties.borrower",
            "aria-label": "Field group",
            maxlength: "320"
          }, null, 512), [
            [
              ee,
              e.field.group,
              void 0,
              { trim: !0 }
            ]
          ]),
          t("datalist", Va, [
            (n(!0), o(U, null, I(e.groups, (y) => (n(), o("option", {
              key: y,
              value: y
            }, null, 8, Ca))), 128))
          ]),
          r[22] || (r[22] = t("small", null, "Use dotted snake_case names. Values nest under this path.", -1))
        ]),
        r[26] || (r[26] = t("h4", null, "Checking it", -1)),
        t("label", null, [
          r[23] || (r[23] = q("Validation hints", -1)),
          H(t("textarea", {
            "onUpdate:modelValue": r[9] || (r[9] = (y) => e.field.validation_hints = y),
            rows: "2",
            maxlength: "4000",
            placeholder: "Rules the value must satisfy"
          }, null, 512), [
            [ee, e.field.validation_hints]
          ])
        ]),
        t("div", Ea, [
          r[24] || (r[24] = t("span", null, [
            q("Evidence required"),
            t("small", null, "The value must cite a quote from the document.")
          ], -1)),
          f(_, {
            modelValue: e.field.evidence_required,
            "onUpdate:modelValue": r[10] || (r[10] = (y) => e.field.evidence_required = y),
            label: "Evidence required",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : $("", !0),
      !e.readonly && (u.value || e.siblingNames) ? (n(), o("button", {
        key: 1,
        type: "button",
        class: "kx-btn kx-btn-danger kx-focus-halo",
        onClick: r[11] || (r[11] = (y) => i("remove"))
      }, c(u.value ? "Remove field" : "Remove property"), 1)) : $("", !0)
    ], 8, ha));
  }
}), Fa = { class: "field-groups" }, Na = {
  key: 0,
  class: "rows"
}, Ua = ["aria-label"], Ma = { class: "field-group-head" }, Aa = ["aria-label", "aria-expanded", "aria-controls", "onClick"], Ba = { class: "group-title" }, Ra = ["id"], La = { class: "group-title" }, Be = /* @__PURE__ */ z({
  __name: "FieldGroups",
  props: {
    node: {}
  },
  setup(e) {
    const s = N(/* @__PURE__ */ new Set()), l = pe();
    function i(p) {
      s.value.has(p) ? s.value.delete(p) : s.value.add(p);
    }
    const u = (p) => p.indices.length + p.children.reduce((g, r) => g + u(r), 0);
    return (p, g) => {
      const r = st("FieldGroups", !0);
      return n(), o("div", Fa, [
        e.node.indices.length ? (n(), o("ul", Na, [
          (n(!0), o(U, null, I(e.node.indices, (y) => (n(), o("li", { key: y }, [
            je(p.$slots, "default", { index: y })
          ]))), 128))
        ])) : $("", !0),
        (n(!0), o(U, null, I(e.node.children, (y, S) => (n(), o("section", {
          key: y.path,
          class: "field-group",
          "aria-label": `Group ${y.path}`
        }, [
          t("header", Ma, [
            t("button", {
              type: "button",
              class: "tree-toggle kx-iconbtn kx-focus-outline",
              "aria-label": `${s.value.has(y.path) ? "Expand" : "Collapse"} group ${y.path}`,
              "aria-expanded": !s.value.has(y.path),
              "aria-controls": `${m(l)}-${y.path}`,
              onClick: (b) => i(y.path)
            }, [
              f(m(M), {
                icon: s.value.has(y.path) ? "tabler:chevron-right" : "tabler:chevron-down"
              }, null, 8, ["icon"])
            ], 8, Aa),
            je(p.$slots, "header", {
              path: y.path,
              label: y.name,
              count: u(y),
              first: S === 0,
              last: S === e.node.children.length - 1
            }, () => [
              t("span", Ba, c(y.name), 1)
            ])
          ]),
          H(t("div", {
            id: `${m(l)}-${y.path}`,
            class: "group-content"
          }, [
            f(r, { node: y }, {
              default: me((b) => [
                je(p.$slots, "default", bt({ ref_for: !0 }, b))
              ]),
              header: me((b) => [
                je(p.$slots, "header", bt({ ref_for: !0 }, b), () => [
                  t("span", La, c(b.label), 1)
                ])
              ]),
              _: 3
            }, 8, ["node"])
          ], 8, Ra), [
            [Ge, !s.value.has(y.path)]
          ])
        ], 8, Ua))), 128))
      ]);
    };
  }
}), Oa = ["aria-label", "maxlength", "aria-invalid", "aria-describedby", "onKeydown"], Ta = ["aria-label", "title"], Pa = ["aria-label", "title"], Da = ["id"], Bt = /* @__PURE__ */ z({
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
    const l = e, i = s, u = N(l.initialValue), p = N(""), g = N(), r = pe();
    Fe(() => {
      g.value.focus(), g.value.select();
    });
    function y() {
      const S = u.value.trim();
      if (!S || !$l.test(S)) {
        p.value = "Use a dotted path of snake_case group names.";
        return;
      }
      if (S.length > l.maxLength) {
        p.value = "The group and its nested paths must fit within 320 characters.";
        return;
      }
      i("save", S);
    }
    return (S, b) => (n(), o("form", {
      class: "group-path-editor",
      onSubmit: ve(y, ["prevent"])
    }, [
      H(t("input", {
        ref_key: "input",
        ref: g,
        "onUpdate:modelValue": b[0] || (b[0] = (a) => u.value = a),
        "aria-label": e.inputLabel,
        maxlength: e.maxLength,
        "aria-invalid": !!p.value,
        "aria-describedby": p.value ? m(r) : void 0,
        "aria-required": "true",
        autocomplete: "off",
        spellcheck: "false",
        placeholder: "parties.borrower",
        onKeydown: [
          Ee(ve(y, ["prevent"]), ["enter"]),
          b[1] || (b[1] = Ee(ve((a) => i("cancel"), ["stop", "prevent"]), ["esc"]))
        ]
      }, null, 40, Oa), [
        [ee, u.value]
      ]),
      t("button", {
        type: "submit",
        class: "kx-iconbtn kx-focus-outline",
        "aria-label": e.saveLabel,
        title: e.saveLabel
      }, [
        f(m(M), { icon: "tabler:check" })
      ], 8, Ta),
      t("button", {
        type: "button",
        class: "kx-iconbtn kx-focus-outline",
        "aria-label": e.cancelLabel,
        title: e.cancelLabel,
        onClick: b[2] || (b[2] = (a) => i("cancel"))
      }, [
        f(m(M), { icon: "tabler:x" })
      ], 8, Pa),
      p.value ? (n(), o("p", {
        key: 0,
        id: m(r),
        class: "field-error",
        role: "alert"
      }, c(p.value), 9, Da)) : $("", !0)
    ], 32));
  }
}), Ia = ["title"], ja = ["aria-label", "data-group-rename", "title"], za = ["aria-label"], Ha = {
  key: 2,
  class: "group-actions"
}, Wa = ["aria-label", "disabled"], Ka = ["aria-label", "aria-expanded", "aria-controls"], Ga = /* @__PURE__ */ z({
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
    const l = e, i = s, u = N(!1), p = N(!1), g = N(), r = N(), y = N(), S = pe(), b = F(() => [
      { label: "Move up", disabled: l.first, command: () => i("reorder", -1) },
      { label: "Move down", disabled: l.last, command: () => i("reorder", 1) },
      { separator: !0 },
      { label: "Delete group and its fields", command: () => i("remove") }
    ]);
    function a() {
      u.value = !0;
    }
    async function d() {
      u.value = !1, await Ce(), r.value.focus();
    }
    async function L(A) {
      const C = g.value.closest(".field-tree");
      u.value = !1, i("rename", A), await Ce(), C.querySelector(`[data-group-rename="${A}"]`).focus();
    }
    return (A, C) => (n(), o("div", {
      ref_key: "heading",
      ref: g,
      class: "group-heading"
    }, [
      u.value ? (n(), J(Bt, {
        key: 0,
        "initial-value": e.path,
        "input-label": `Group path for ${e.path}`,
        "save-label": "Save group name",
        "cancel-label": "Cancel group rename",
        "max-length": e.maxLength,
        onSave: L,
        onCancel: d
      }, null, 8, ["initial-value", "input-label", "max-length"])) : (n(), o(U, { key: 1 }, [
        e.readonly ? (n(), o("span", {
          key: 0,
          class: "group-title",
          title: e.path
        }, c(e.name), 9, Ia)) : (n(), o("button", {
          key: 1,
          ref_key: "renameButton",
          ref: r,
          type: "button",
          class: "group-title group-name-button kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Rename group ${e.path}`,
          "data-group-rename": e.path,
          title: e.path,
          onClick: a
        }, [
          t("span", null, c(e.name), 1),
          f(m(M), {
            icon: "tabler:pencil",
            "aria-hidden": "true"
          })
        ], 8, ja)),
        t("span", {
          class: "count group-count",
          "aria-label": `${e.count} fields`
        }, c(e.count), 9, za),
        e.readonly ? $("", !0) : (n(), o("div", Ha, [
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Add field to ${e.path}`,
            disabled: !e.canAdd,
            title: "Add field",
            onClick: C[0] || (C[0] = (E) => i("add"))
          }, [
            f(m(M), { icon: "tabler:plus" })
          ], 8, Wa),
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Actions for group ${e.path}`,
            "aria-haspopup": "menu",
            "aria-expanded": p.value,
            "aria-controls": m(S),
            onClick: C[1] || (C[1] = (E) => y.value.toggle(E))
          }, [
            f(m(M), { icon: "tabler:dots" })
          ], 8, Ka),
          f(m(Mt), {
            id: m(S),
            ref_key: "menu",
            ref: y,
            model: b.value,
            popup: "",
            "append-to": "self",
            onShow: C[2] || (C[2] = (E) => p.value = !0),
            onHide: C[3] || (C[3] = (E) => p.value = !1)
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
}, pn = { key: 0 }, fn = { key: 1 }, bn = ["aria-label", "disabled"], hn = /* @__PURE__ */ z({
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
    const l = e, i = s, u = pe(), p = pe(), g = N(), r = N(!1), y = F(() => [
      { label: "Move up", disabled: l.first, command: () => i("reorder", l.field, l.trail, -1) },
      { label: "Move down", disabled: l.last, command: () => i("reorder", l.field, l.trail, 1) }
    ]), S = N(!0);
    fe(() => l.selected, (C) => {
      const E = ie(l.field, l.trail);
      C !== E && C.startsWith(E + (l.trail.length ? "/" : "")) && (S.value = !0);
    });
    const b = F(() => l.trail.at(-1) !== "item"), a = F(() => b.value ? l.shape.name || "New field" : "Each item"), d = F(() => l.trail.length ? void 0 : l.shape), L = F(() => l.shape.type === "object" || l.shape.type === "list");
    function A(C) {
      C.key === "ArrowRight" && L.value && (S.value = !0, C.preventDefault(), C.stopPropagation()), C.key === "ArrowLeft" && L.value && (S.value = !1, C.preventDefault(), C.stopPropagation());
    }
    return (C, E) => {
      const G = st("ShapeTree", !0);
      return n(), o("div", {
        class: "shape-tree-node",
        onKeydown: A
      }, [
        t("div", {
          class: Q(["row-item", { active: e.selected === m(ie)(e.field, e.trail) }])
        }, [
          L.value ? (n(), o("button", {
            key: 0,
            class: "tree-toggle kx-iconbtn kx-focus-outline",
            type: "button",
            "aria-label": `${S.value ? "Collapse" : "Expand"} ${e.path}`,
            "aria-expanded": S.value,
            onClick: E[0] || (E[0] = (D) => S.value = !S.value)
          }, [
            f(m(M), {
              icon: S.value ? "tabler:chevron-down" : "tabler:chevron-right"
            }, null, 8, ["icon"])
          ], 8, Qa)) : (n(), o("span", Ja)),
          t("button", {
            type: "button",
            class: "row-main kx-focus-halo",
            "aria-label": `Edit ${e.path}`,
            "aria-describedby": m(u),
            "aria-current": e.selected === m(ie)(e.field, e.trail) ? "true" : void 0,
            onClick: E[1] || (E[1] = (D) => i("select", e.field, e.trail))
          }, [
            t("span", Xa, [
              t("span", Za, [
                f(m(M), {
                  icon: m(Jl)(e.shape.type),
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                t("span", {
                  class: "row-label",
                  title: a.value
                }, c(a.value), 9, _a),
                e.error ? (n(), J(m(M), {
                  key: 0,
                  icon: "tabler:alert-circle",
                  class: "row-warn",
                  "aria-label": e.error,
                  title: e.error
                }, null, 8, ["aria-label", "title"])) : $("", !0)
              ]),
              t("span", {
                id: m(u),
                class: Q(["row-desc", { missing: !e.shape.description }]),
                title: e.shape.description || void 0
              }, c(e.shape.description || "No description"), 11, en)
            ]),
            t("span", tn, [
              t("span", ln, c(e.shape.type), 1),
              t("span", an, [
                b.value && e.shape.required ? (n(), o("span", nn, [
                  f(m(M), {
                    icon: "tabler:asterisk",
                    "aria-hidden": "true"
                  })
                ])) : $("", !0),
                d.value?.strategy === "deep" ? (n(), o("span", sn, [
                  f(m(M), {
                    icon: "tabler:microscope",
                    "aria-hidden": "true"
                  })
                ])) : $("", !0),
                d.value?.search_within === "sections" ? (n(), o("span", on, [
                  f(m(M), {
                    icon: "tabler:layout-list",
                    "aria-hidden": "true"
                  })
                ])) : $("", !0),
                d.value?.evidence_required ? (n(), o("span", un, [
                  f(m(M), {
                    icon: "tabler:file-search",
                    "aria-hidden": "true"
                  })
                ])) : $("", !0)
              ])
            ])
          ], 8, Ya),
          !e.readonly && b.value ? (n(), o("span", dn, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} up`,
              disabled: e.first,
              onClick: E[2] || (E[2] = (D) => i("reorder", e.field, e.trail, -1))
            }, [
              f(m(M), { icon: "tabler:chevron-up" })
            ], 8, rn),
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} down`,
              disabled: e.last,
              onClick: E[3] || (E[3] = (D) => i("reorder", e.field, e.trail, 1))
            }, [
              f(m(M), { icon: "tabler:chevron-down" })
            ], 8, cn)
          ])) : $("", !0),
          !e.readonly && b.value ? (n(), o("div", {
            key: 3,
            class: "row-overflow",
            onKeydown: E[7] || (E[7] = ve(() => {
            }, ["stop"]))
          }, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Actions for ${e.path}`,
              "aria-haspopup": "menu",
              "aria-expanded": r.value,
              "aria-controls": m(p),
              onClick: E[4] || (E[4] = (D) => g.value.toggle(D))
            }, [
              f(m(M), { icon: "tabler:dots" })
            ], 8, vn),
            f(m(Mt), {
              id: m(p),
              ref_key: "menu",
              ref: g,
              model: y.value,
              popup: "",
              "append-to": "self",
              onShow: E[5] || (E[5] = (D) => r.value = !0),
              onHide: E[6] || (E[6] = (D) => r.value = !1)
            }, null, 8, ["id", "model"])
          ], 32)) : $("", !0)
        ], 2),
        L.value && S.value ? (n(), o("ul", mn, [
          (n(!0), o(U, null, I(e.shape.properties, (D, j) => (n(), o("li", { key: j }, [
            f(G, {
              shape: D,
              field: e.field,
              trail: [...e.trail, j],
              path: `${e.path}.${D.name || "New property"}`,
              selected: e.selected,
              readonly: e.readonly,
              first: j === 0,
              last: j === e.shape.properties.length - 1,
              onSelect: E[8] || (E[8] = (W, T) => i("select", W, T)),
              onAdd: E[9] || (E[9] = (W, T) => i("add", W, T)),
              onReorder: E[10] || (E[10] = (W, T, O) => i("reorder", W, T, O))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly", "first", "last"])
          ]))), 128)),
          e.shape.item ? (n(), o("li", pn, [
            f(G, {
              shape: e.shape.item,
              field: e.field,
              trail: [...e.trail, "item"],
              path: `${e.path}[]`,
              selected: e.selected,
              readonly: e.readonly,
              onSelect: E[11] || (E[11] = (D, j) => i("select", D, j)),
              onAdd: E[12] || (E[12] = (D, j) => i("add", D, j)),
              onReorder: E[13] || (E[13] = (D, j, W) => i("reorder", D, j, W))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly"])
          ])) : $("", !0),
          !e.readonly && e.shape.type === "object" && e.trail.length + 1 < m(Ae) ? (n(), o("li", fn, [
            t("button", {
              type: "button",
              class: "kx-btn kx-btn-ghost kx-focus-halo sm",
              "aria-label": `Add property to ${e.path}`,
              disabled: (e.shape.properties?.length ?? 0) >= 100,
              onClick: E[14] || (E[14] = (D) => i("add", e.field, e.trail))
            }, [
              f(m(M), { icon: "tabler:plus" }),
              E[15] || (E[15] = q("Add property", -1))
            ], 8, bn)
          ])) : $("", !0)
        ])) : $("", !0)
      ], 32);
    };
  }
}), gn = { class: "label-block" }, yn = {
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
}, wn = /* @__PURE__ */ z({
  __name: "AgentPicker",
  props: {
    value: {},
    readonly: { type: Boolean }
  },
  emits: ["select"],
  setup(e, { emit: s }) {
    const l = s, i = N(!!customElements.get("wc-agent-picker")), u = N("");
    Fe(async () => {
      if (!i.value)
        try {
          await Ze("wc-agent-picker", { timeoutMs: 8e3 }), i.value = !0;
        } catch (g) {
          u.value = g instanceof Error ? g.message : String(g);
        }
    });
    function p(g) {
      if (g.composedPath()[0] !== g.currentTarget) return;
      const r = g.detail;
      l("select", r.agent_id);
    }
    return (g, r) => (n(), o("div", gn, [
      r[0] || (r[0] = t("span", null, "Scout agent", -1)),
      e.readonly ? (n(), o("p", yn, c(e.value || "Built-in scout"), 1)) : i.value ? (n(), o("wc-agent-picker", {
        key: 1,
        config: JSON.stringify({ agent_id: e.value || "" }),
        "aria-label": "Scout agent",
        placeholder: "Choose your agent…",
        onChange: p
      }, null, 40, kn)) : u.value ? (n(), o("p", $n, "Could not load agent picker: " + c(u.value), 1)) : (n(), o("span", xn, "Loading agents…")),
      r[1] || (r[1] = t("small", null, "Leave empty to use the built-in scout.", -1))
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
}, ce = /* @__PURE__ */ z({
  __name: "ModelPicker",
  props: {
    value: {},
    capability: {},
    labelledBy: {}
  },
  emits: ["select"],
  setup(e, { emit: s }) {
    const l = s, i = N(!!customElements.get("wc-model-picker")), u = N("");
    Fe(async () => {
      if (!i.value)
        try {
          await Ze("wc-model-picker", { timeoutMs: 8e3 }), i.value = !0;
        } catch (g) {
          u.value = g instanceof Error ? g.message : String(g);
        }
    });
    function p(g) {
      const r = g.detail;
      typeof r == "string" && l("select", r);
    }
    return (g, r) => i.value ? (n(), o("wc-model-picker", {
      key: 0,
      value: e.value,
      capability: e.capability,
      "aria-labelledby": e.labelledBy,
      onSelect: p
    }, null, 40, Sn)) : u.value ? (n(), o("p", Vn, "Could not load model picker: " + c(u.value), 1)) : (n(), o("span", Cn, "Loading models…"));
  }
}), En = { class: "slider" }, qn = { class: "slider-head" }, Fn = { class: "slider-value" }, Nn = ["aria-label", "aria-valuetext", "disabled"], Un = {
  key: 0,
  class: "slider-hints"
}, Mn = { key: 1 }, Se = 1e3, le = /* @__PURE__ */ z({
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
    const s = e, l = Le(e, "modelValue"), i = F(() => s.percent ? `${Math.round(l.value * 100)}%` : `${l.value.toLocaleString()}${s.unit ? ` ${s.unit}` : ""}`), u = (r) => s.log ? Math.log(r / s.min) / Math.log(s.max / s.min) * Se : (r - s.min) / (s.max - s.min) * Se;
    function p(r) {
      const y = s.log ? s.min * Math.pow(s.max / s.min, r / Se) : s.min + (s.max - s.min) * r / Se, S = Math.round(y / s.step) * s.step;
      return Math.min(s.max, Math.max(s.min, Number(S.toFixed(4))));
    }
    const g = F({ get: () => Math.round(u(l.value)), set: (r) => {
      l.value = p(r);
    } });
    return (r, y) => (n(), o("div", En, [
      t("div", qn, [
        t("span", null, c(e.label), 1),
        t("output", Fn, c(i.value), 1)
      ]),
      H(t("input", {
        "onUpdate:modelValue": y[0] || (y[0] = (S) => g.value = S),
        type: "range",
        min: "0",
        max: Se,
        step: "1",
        "aria-label": e.label,
        "aria-valuetext": i.value,
        disabled: e.disabled,
        style: qe({ "--fill": `${g.value / Se * 100}%` })
      }, null, 12, Nn), [
        [
          ee,
          g.value,
          void 0,
          { number: !0 }
        ]
      ]),
      e.hints ? (n(), o("div", Un, [
        t("span", null, c(e.hints[0]), 1),
        t("span", null, c(e.hints[1]), 1)
      ])) : $("", !0),
      e.note ? (n(), o("small", Mn, c(e.note), 1)) : $("", !0)
    ]));
  }
}), An = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, Bn = { class: "fd-track" }, Rn = { class: "fd-node" }, Ln = { class: "fd-dots" }, On = { class: "fd-more" }, Tn = { class: "fd-node goal" }, Pn = /* @__PURE__ */ z({
  __name: "ScoutDiagram",
  props: {
    rounds: {},
    confidence: {},
    extra: {}
  },
  setup(e) {
    const s = e;
    return (l, i) => (n(), o("figure", An, [
      t("div", Bn, [
        i[2] || (i[2] = t("span", { class: "fd-node solid" }, "Pass", -1)),
        (n(!0), o(U, null, I(Math.min(s.rounds, 8), (u) => (n(), o(U, { key: u }, [
          i[0] || (i[0] = t("span", { class: "fd-link" }, null, -1)),
          t("span", Rn, [
            t("span", null, "R" + c(u), 1),
            t("span", Ln, [
              (n(!0), o(U, null, I(Math.min(s.extra, 6), (p) => (n(), o("i", { key: p }))), 128))
            ])
          ])
        ], 64))), 128)),
        s.rounds > 8 ? (n(), o(U, { key: 0 }, [
          i[1] || (i[1] = t("span", { class: "fd-link" }, null, -1)),
          t("span", On, "+" + c(s.rounds - 8), 1)
        ], 64)) : $("", !0),
        i[3] || (i[3] = t("span", { class: "fd-link" }, null, -1)),
        t("span", Tn, "≥ " + c(Math.round(s.confidence * 100)) + "%", 1)
      ]),
      t("figcaption", null, c(s.rounds ? `One pass, then up to ${s.rounds} rounds with up to ${s.extra} new queries each, stopping as soon as confidence reaches ${Math.round(s.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
    ]));
  }
}), Dn = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, In = { class: "fd-grid" }, jn = { class: "fd-node solid" }, zn = { class: "fd-node" }, Hn = { class: "fd-node" }, Wn = { class: "fd-node goal" }, Kn = /* @__PURE__ */ z({
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
          t("b", null, c(e.fields), 1),
          q(" field" + c(e.fields === 1 ? "" : "s"), 1),
          t("small", null, c(e.parallel) + " at a time", 1)
        ]),
        t("span", zn, [
          t("b", null, c(e.queries), 1),
          u[0] || (u[0] = q(" queries", -1)),
          u[1] || (u[1] = t("small", null, "per field", -1))
        ]),
        t("span", Hn, [
          t("b", null, c(e.perQuery), 1),
          u[2] || (u[2] = q(" chunks", -1)),
          u[3] || (u[3] = t("small", null, "per query", -1))
        ]),
        t("span", Wn, [
          t("b", null, c(l.value), 1),
          u[4] || (u[4] = q(" chunks", -1)),
          t("small", null, c(e.queries * e.perQuery > e.cap ? `capped at ${e.cap}` : "read per field"), 1)
        ])
      ]),
      t("figcaption", null, "Each deep field gets its own queries; up to " + c(l.value) + " chunks are read for it before analysis.", 1)
    ]));
  }
}), Gn = ["disabled"], Qn = { class: "muted" }, Jn = { class: "toggle-row" }, Yn = { class: "label-block" }, Xn = { class: "toggle-row" }, Zn = {
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
}, hs = {
  id: "model-deep-query",
  class: "model-role"
}, gs = {
  id: "model-extract",
  class: "model-role"
}, ys = { class: "output-list" }, ks = { class: "chip" }, $s = {
  key: 0,
  class: "muted"
}, xs = { class: "toggle-row" }, ws = { class: "toggle-row" }, Ss = { class: "toggle-row" }, Vs = {
  id: "model-verify",
  class: "model-role"
}, Cs = /* @__PURE__ */ z({
  __name: "StepInspector",
  props: {
    stage: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const s = e, l = F(() => s.config.stages), i = (b) => Vl(s.stage, b), u = xl(), p = F(() => s.config.fields.filter((b) => b.strategy === "deep").length), g = F(() => s.config.fields.filter((b) => b.search_within === "sections").map((b) => b.name || "New field")), r = F(() => Et(s.config));
    function y(b) {
      b ? l.value.scout.agent_id = b : delete l.value.scout.agent_id;
    }
    function S(b, a) {
      const d = l.value.scout.tools.filter((L) => L !== b);
      l.value.scout.tools = a ? [...d, b] : d;
    }
    return (b, a) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", Qn, c(m(wl)[e.stage]), 1),
      e.stage === "map" ? (n(), o(U, { key: 0 }, [
        t("div", Jn, [
          a[33] || (a[33] = t("span", null, "Stage enabled", -1)),
          f(_, {
            modelValue: l.value.map.enabled,
            "onUpdate:modelValue": a[0] || (a[0] = (d) => l.value.map.enabled = d),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Yn, [
          a[34] || (a[34] = t("span", { id: "outline-label" }, "Outline", -1)),
          f($e, {
            modelValue: l.value.map.outline,
            "onUpdate:modelValue": a[1] || (a[1] = (d) => l.value.map.outline = d),
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
          f(_, {
            modelValue: l.value.map.section_summaries,
            "onUpdate:modelValue": a[2] || (a[2] = (d) => l.value.map.section_summaries = d),
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
            onSelect: a[3] || (a[3] = (d) => l.value.map.model = d)
          }, null, 8, ["value"])
        ]),
        a[39] || (a[39] = t("h4", null, "Fields that read sections", -1)),
        g.value.length ? (n(), o("p", _n, [
          (n(!0), o(U, null, I(g.value, (d) => (n(), o("span", {
            key: d,
            class: "chip primary"
          }, c(d), 1))), 128))
        ])) : (n(), o("p", es, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : $("", !0),
      e.stage === "prefetch" ? (n(), o(U, { key: 1 }, [
        t("div", ts, [
          a[40] || (a[40] = t("span", null, "Stage enabled", -1)),
          f(_, {
            modelValue: l.value.prefetch.enabled,
            "onUpdate:modelValue": a[4] || (a[4] = (d) => l.value.prefetch.enabled = d),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        a[44] || (a[44] = t("h4", null, "Queries", -1)),
        (n(!0), o(U, null, I(l.value.prefetch.queries, (d, L) => (n(), o("div", {
          key: L,
          class: "query-row"
        }, [
          t("div", ls, [
            t("label", null, [
              a[41] || (a[41] = q("Name", -1)),
              H(t("input", {
                "onUpdate:modelValue": (A) => d.name = A,
                placeholder: "Parties"
              }, null, 8, as), [
                [ee, d.name]
              ])
            ]),
            t("label", null, [
              a[42] || (a[42] = q("Chunks", -1)),
              H(t("input", {
                "onUpdate:modelValue": (A) => d.chunks = A,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, ns), [
                [
                  ee,
                  d.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          t("label", null, [
            a[43] || (a[43] = q("Query", -1)),
            H(t("textarea", {
              "onUpdate:modelValue": (A) => d.query = A,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, ss), [
              [ee, d.query]
            ])
          ]),
          e.readonly ? $("", !0) : (n(), o("button", {
            key: 0,
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo sm",
            onClick: (A) => l.value.prefetch.queries.splice(L, 1)
          }, "Remove query", 8, os))
        ]))), 128)),
        l.value.prefetch.queries.length ? $("", !0) : (n(), o("p", is, "No fixed queries. Field search hints still run.")),
        e.readonly ? $("", !0) : (n(), o("button", {
          key: 1,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          onClick: a[5] || (a[5] = (d) => l.value.prefetch.queries.push(m(Sl)()))
        }, "Add query"))
      ], 64)) : $("", !0),
      e.stage === "scout" ? (n(), o(U, { key: 2 }, [
        t("div", us, [
          a[45] || (a[45] = t("span", null, "Stage enabled", -1)),
          f(_, {
            modelValue: l.value.scout.enabled,
            "onUpdate:modelValue": a[6] || (a[6] = (d) => l.value.scout.enabled = d),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", ds, [
          a[46] || (a[46] = t("span", { id: "mode-label" }, "Mode", -1)),
          f($e, {
            modelValue: l.value.scout.mode,
            "onUpdate:modelValue": a[7] || (a[7] = (d) => l.value.scout.mode = d),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          t("small", null, c(l.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        l.value.scout.mode === "agent" ? (n(), J(wn, {
          key: 0,
          value: l.value.scout.agent_id,
          readonly: e.readonly,
          onSelect: y
        }, null, 8, ["value", "readonly"])) : $("", !0),
        l.value.scout.mode === "loop" ? (n(), J(Pn, {
          key: 1,
          rounds: l.value.scout.max_rounds,
          confidence: l.value.scout.target_confidence,
          extra: l.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"])) : $("", !0),
        a[51] || (a[51] = t("h4", null, "Models", -1)),
        t("div", rs, [
          a[47] || (a[47] = t("span", null, "Scout", -1)),
          f(ce, {
            value: l.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: a[8] || (a[8] = (d) => l.value.scout.model = d)
          }, null, 8, ["value"])
        ]),
        a[52] || (a[52] = t("h4", null, "Loop", -1)),
        f(le, {
          modelValue: l.value.scout.max_rounds,
          "onUpdate:modelValue": a[9] || (a[9] = (d) => l.value.scout.max_rounds = d),
          label: l.value.scout.mode === "agent" ? "Rounds" : "Follow-up rounds",
          min: i("max_rounds").min,
          max: i("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        l.value.scout.mode === "loop" ? (n(), J(le, {
          key: 2,
          modelValue: l.value.scout.target_confidence,
          "onUpdate:modelValue": a[10] || (a[10] = (d) => l.value.scout.target_confidence = d),
          label: "Stop at confidence",
          min: i("target_confidence").min,
          max: i("target_confidence").max,
          step: 0.05,
          percent: "",
          hints: ["Stop early", "Keep looking"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])) : $("", !0),
        f(le, {
          modelValue: l.value.scout.max_extra_queries,
          "onUpdate:modelValue": a[11] || (a[11] = (d) => l.value.scout.max_extra_queries = d),
          label: l.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: i("max_extra_queries").min,
          max: i("max_extra_queries").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.scout.max_tokens,
          "onUpdate:modelValue": a[12] || (a[12] = (d) => l.value.scout.max_tokens = d),
          label: "Scout output limit",
          min: i("max_tokens").min,
          max: i("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        l.value.scout.mode === "agent" ? (n(), o("p", cs, "Tool budget: " + c(l.value.scout.max_rounds * l.value.scout.max_extra_queries) + " calls.", 1)) : $("", !0),
        l.value.scout.mode === "loop" ? (n(), o("div", vs, [
          a[48] || (a[48] = t("span", null, [
            q("Drop noisy chunks"),
            t("small", null, "Chunks no field needs leave the evidence pool; chunks cited for a field always stay.")
          ], -1)),
          f(_, {
            modelValue: l.value.scout.drop_noise,
            "onUpdate:modelValue": a[13] || (a[13] = (d) => l.value.scout.drop_noise = d),
            label: "Drop noisy chunks",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])) : $("", !0),
        t("div", ms, [
          a[49] || (a[49] = t("span", null, [
            q("Share scout notes with extraction"),
            t("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          f(_, {
            modelValue: l.value.scout.share_notes,
            "onUpdate:modelValue": a[14] || (a[14] = (d) => l.value.scout.share_notes = d),
            label: "Share scout notes with extraction",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l.value.scout.mode === "agent" ? (n(), o(U, { key: 5 }, [
          a[50] || (a[50] = t("h4", null, "Agent tools", -1)),
          (n(!0), o(U, null, I(m(u), (d) => (n(), o("div", {
            key: d,
            class: "toggle-row"
          }, [
            t("span", null, c(m(lt)(d)), 1),
            f(_, {
              "model-value": l.value.scout.tools.includes(d),
              label: m(lt)(d),
              disabled: e.readonly,
              "onUpdate:modelValue": (L) => S(d, L)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : $("", !0)
      ], 64)) : $("", !0),
      e.stage === "deep" ? (n(), o(U, { key: 3 }, [
        t("div", ps, [
          a[53] || (a[53] = t("span", null, "Stage enabled", -1)),
          f(_, {
            modelValue: l.value.deep.enabled,
            "onUpdate:modelValue": a[15] || (a[15] = (d) => l.value.deep.enabled = d),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        f(Kn, {
          fields: p.value,
          parallel: l.value.deep.parallel_fields,
          queries: l.value.deep.max_queries,
          "per-query": l.value.deep.chunks_per_query,
          cap: l.value.deep.chunk_cap
        }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"]),
        t("div", fs, [
          a[54] || (a[54] = t("span", { id: "read-label" }, "Reads", -1)),
          f($e, {
            modelValue: l.value.deep.read,
            "onUpdate:modelValue": a[16] || (a[16] = (d) => l.value.deep.read = d),
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
            onSelect: a[17] || (a[17] = (d) => l.value.deep.model = d)
          }, null, 8, ["value"])
        ]),
        t("div", hs, [
          a[57] || (a[57] = t("span", null, "Query writer", -1)),
          f(ce, {
            value: l.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: a[18] || (a[18] = (d) => l.value.deep.query_model = d)
          }, null, 8, ["value"])
        ]),
        a[59] || (a[59] = t("h4", null, "Reach", -1)),
        f(le, {
          modelValue: l.value.deep.parallel_fields,
          "onUpdate:modelValue": a[19] || (a[19] = (d) => l.value.deep.parallel_fields = d),
          label: "Fields at a time",
          min: i("parallel_fields").min,
          max: i("parallel_fields").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.deep.max_queries,
          "onUpdate:modelValue": a[20] || (a[20] = (d) => l.value.deep.max_queries = d),
          label: "Queries per field",
          min: i("max_queries").min,
          max: i("max_queries").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.deep.chunks_per_query,
          "onUpdate:modelValue": a[21] || (a[21] = (d) => l.value.deep.chunks_per_query = d),
          label: "Chunks per query",
          min: i("chunks_per_query").min,
          max: i("chunks_per_query").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.deep.chunk_cap,
          "onUpdate:modelValue": a[22] || (a[22] = (d) => l.value.deep.chunk_cap = d),
          label: "Chunk cap per field",
          min: i("chunk_cap").min,
          max: i("chunk_cap").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.deep.min_similarity,
          "onUpdate:modelValue": a[23] || (a[23] = (d) => l.value.deep.min_similarity = d),
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
          "onUpdate:modelValue": a[24] || (a[24] = (d) => l.value.deep.query_temperature = d),
          label: "Query writing",
          min: i("query_temperature").min,
          max: i("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.deep.analysis_temperature,
          "onUpdate:modelValue": a[25] || (a[25] = (d) => l.value.deep.analysis_temperature = d),
          label: "Analysis",
          min: i("analysis_temperature").min,
          max: i("analysis_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : $("", !0),
      e.stage === "extract" ? (n(), o(U, { key: 4 }, [
        a[62] || (a[62] = t("h4", null, "Models", -1)),
        t("div", gs, [
          a[61] || (a[61] = t("span", null, "Extraction", -1)),
          f(ce, {
            value: l.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: a[26] || (a[26] = (d) => l.value.extract.model = d)
          }, null, 8, ["value"])
        ]),
        a[63] || (a[63] = t("h4", null, "Field groups", -1)),
        t("ul", ys, [
          (n(!0), o(U, null, I(r.value, (d) => (n(), o("li", {
            key: d.name
          }, [
            t("span", null, c(d.name), 1),
            t("span", ks, c(d.fields.length) + " field" + c(d.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        r.value.length ? $("", !0) : (n(), o("p", $s, "No fields yet.")),
        f(le, {
          modelValue: l.value.extract.max_fields_per_call,
          "onUpdate:modelValue": a[27] || (a[27] = (d) => l.value.extract.max_fields_per_call = d),
          label: "Fields per call",
          min: i("max_fields_per_call").min,
          max: i("max_fields_per_call").max,
          disabled: e.readonly,
          note: `${m(yt)(e.config)} extraction call${m(yt)(e.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        f(le, {
          modelValue: l.value.extract.max_output_tokens,
          "onUpdate:modelValue": a[28] || (a[28] = (d) => l.value.extract.max_output_tokens = d),
          label: "Output limit",
          min: i("max_output_tokens").min,
          max: i("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : $("", !0),
      e.stage === "verify" ? (n(), o(U, { key: 5 }, [
        t("div", xs, [
          a[64] || (a[64] = t("span", null, "Stage enabled", -1)),
          f(_, {
            modelValue: l.value.verify.enabled,
            "onUpdate:modelValue": a[29] || (a[29] = (d) => l.value.verify.enabled = d),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", ws, [
          a[65] || (a[65] = t("span", null, [
            q("Quotes exist"),
            t("small", null, "Each quote is matched against the document text. No model call.")
          ], -1)),
          f(_, {
            modelValue: l.value.verify.check_quotes,
            "onUpdate:modelValue": a[30] || (a[30] = (d) => l.value.verify.check_quotes = d),
            label: "Quotes exist",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Ss, [
          a[66] || (a[66] = t("span", null, [
            q("Quotes support values"),
            t("small", null, "A model confirms each quote supports its value.")
          ], -1)),
          f(_, {
            modelValue: l.value.verify.check_support,
            "onUpdate:modelValue": a[31] || (a[31] = (d) => l.value.verify.check_support = d),
            label: "Quotes support values",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l.value.verify.check_support ? (n(), o(U, { key: 0 }, [
          a[68] || (a[68] = t("h4", null, "Models", -1)),
          t("div", Vs, [
            a[67] || (a[67] = t("span", null, "Checker", -1)),
            f(ce, {
              value: l.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: a[32] || (a[32] = (d) => l.value.verify.model = d)
            }, null, 8, ["value"])
          ])
        ], 64)) : $("", !0)
      ], 64)) : $("", !0)
    ], 8, Gn));
  }
}), Es = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, qs = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, Fs = ["x", "y", "width"], Ns = ["x", "width"], Us = /* @__PURE__ */ z({
  __name: "ChunkDiagram",
  props: {
    size: {},
    overlap: {}
  },
  setup(e) {
    const s = e, l = F(() => Math.min(0.9, Math.max(0, s.overlap / s.size))), i = F(() => {
      const u = 100 / (3 - 2 * l.value);
      return [0, 1, 2].map((p) => ({ x: p * u * (1 - l.value), w: u }));
    });
    return (u, p) => (n(), o("figure", Es, [
      (n(), o("svg", qs, [
        (n(!0), o(U, null, I(i.value, (g, r) => (n(), o("rect", {
          key: r,
          x: g.x,
          y: r % 2 ? 14 : 4,
          width: g.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, Fs))), 128)),
        (n(), o(U, null, I([1, 2], (g) => t("rect", {
          key: "o" + g,
          x: i.value[g].x,
          y: 4,
          width: i.value[g - 1].x + i.value[g - 1].w - i.value[g].x,
          height: "24",
          class: "shared"
        }, null, 8, Ns)), 64))
      ])),
      t("figcaption", null, c(e.size.toLocaleString()) + " tokens per chunk · " + c(e.overlap.toLocaleString()) + " shared with the next (" + c(Math.round(l.value * 100)) + "%)", 1)
    ]));
  }
}), Ms = ["disabled"], As = { class: "muted" }, Bs = { class: "toggle-row" }, Rs = { class: "toggle-row" }, Ls = { class: "label-block" }, Os = {
  key: 0,
  id: "context-model",
  class: "model-role"
}, Ts = { class: "label-block" }, Ps = {
  id: "embedding-model",
  class: "model-role"
}, Ds = { class: "toggle-row" }, Is = {
  key: 1,
  id: "highlighter-model",
  class: "model-role"
}, js = /* @__PURE__ */ z({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const s = e, l = F(() => s.config.retrieval), i = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], u = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], p = et("chunk_size"), g = et("overlap"), r = et("section_budget"), y = F(() => Math.min(g.max, l.value.chunk_size - 50));
    return (S, b) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", As, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + c(e.retention) + ".", 1),
      b[19] || (b[19] = t("h4", null, "Chunks", -1)),
      f(Us, {
        size: l.value.chunk_size,
        overlap: l.value.overlap
      }, null, 8, ["size", "overlap"]),
      f(le, {
        modelValue: l.value.chunk_size,
        "onUpdate:modelValue": b[0] || (b[0] = (a) => l.value.chunk_size = a),
        label: "Chunk size",
        min: m(p).min,
        max: m(p).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      f(le, {
        modelValue: l.value.overlap,
        "onUpdate:modelValue": b[1] || (b[1] = (a) => l.value.overlap = a),
        label: "Overlap",
        min: m(g).min,
        max: y.value,
        step: 10,
        unit: "tokens",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      t("div", Bs, [
        b[11] || (b[11] = t("span", null, [
          q("Split by headings"),
          t("small", null, "A chunk never crosses a heading.")
        ], -1)),
        f(_, {
          modelValue: l.value.split_headings,
          "onUpdate:modelValue": b[2] || (b[2] = (a) => l.value.split_headings = a),
          label: "Split by headings",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t("div", Rs, [
        b[12] || (b[12] = t("span", null, [
          q("Keep tables whole"),
          t("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        f(_, {
          modelValue: l.value.keep_tables,
          "onUpdate:modelValue": b[3] || (b[3] = (a) => l.value.keep_tables = a),
          label: "Keep tables whole",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      f(le, {
        modelValue: l.value.section_budget,
        "onUpdate:modelValue": b[4] || (b[4] = (a) => l.value.section_budget = a),
        label: "Section budget",
        min: m(r).min,
        max: m(r).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      b[20] || (b[20] = t("h4", null, "Context", -1)),
      t("div", Ls, [
        b[13] || (b[13] = t("span", { id: "context-label" }, "Chunk context", -1)),
        f($e, {
          modelValue: l.value.context,
          "onUpdate:modelValue": b[5] || (b[5] = (a) => l.value.context = a),
          "labelled-by": "context-label",
          options: u
        }, null, 8, ["modelValue"]),
        t("small", null, c(u.find((a) => a.value === l.value.context)?.note), 1)
      ]),
      l.value.context === "generated" ? (n(), o("div", Os, [
        b[14] || (b[14] = t("span", null, "Context writer", -1)),
        f(ce, {
          value: l.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: b[6] || (b[6] = (a) => l.value.context_model = a)
        }, null, 8, ["value"])
      ])) : $("", !0),
      b[21] || (b[21] = t("h4", null, "Search", -1)),
      t("div", Ts, [
        b[15] || (b[15] = t("span", { id: "mode-label" }, "Search mode", -1)),
        f($e, {
          modelValue: l.value.search_mode,
          "onUpdate:modelValue": b[7] || (b[7] = (a) => l.value.search_mode = a),
          "labelled-by": "mode-label",
          options: i
        }, null, 8, ["modelValue"]),
        t("small", null, c(i.find((a) => a.value === l.value.search_mode)?.note), 1)
      ]),
      b[22] || (b[22] = t("h4", null, "Models", -1)),
      t("div", Ps, [
        b[16] || (b[16] = t("span", null, "Embedding", -1)),
        f(ce, {
          value: l.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: b[8] || (b[8] = (a) => l.value.embedding_model = a)
        }, null, 8, ["value"])
      ]),
      t("div", Ds, [
        b[17] || (b[17] = t("span", null, [
          q("Highlighter"),
          t("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        f(_, {
          modelValue: l.value.highlighter,
          "onUpdate:modelValue": b[9] || (b[9] = (a) => l.value.highlighter = a),
          label: "Highlighter",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      l.value.highlighter ? (n(), o("div", Is, [
        b[18] || (b[18] = t("span", null, "Highlighter", -1)),
        f(ce, {
          value: l.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: b[10] || (b[10] = (a) => l.value.highlighter_model = a)
        }, null, 8, ["value"])
      ])) : $("", !0)
    ], 8, Ms));
  }
}), zs = ["inert"], Hs = { class: "canvas-inner" }, Ws = {
  class: "block fields-block",
  "aria-labelledby": "fields-head"
}, Ks = { class: "block-head" }, Gs = ["aria-expanded"], Qs = { class: "count" }, Js = {
  key: 0,
  class: "block-peek"
}, Ys = {
  key: 1,
  class: "field-add-actions push"
}, Xs = ["aria-expanded", "aria-controls", "disabled"], Zs = ["disabled"], _s = {
  id: "fields-body",
  class: "block-body"
}, eo = {
  key: 0,
  class: "block-empty"
}, to = { class: "field-tree" }, lo = ["id"], ao = {
  class: "tree-indent",
  "aria-hidden": "true"
}, no = {
  class: "shape-preview",
  open: ""
}, so = { class: "kx-focus-outline" }, oo = {
  key: 0,
  class: "field-error",
  role: "alert"
}, io = {
  key: 1,
  class: "preview-grid"
}, uo = { "aria-label": "Output shape" }, ro = { "aria-label": "Example output" }, co = {
  class: "block",
  "aria-labelledby": "flow-head"
}, vo = { class: "block-head" }, mo = ["aria-expanded"], po = { class: "count" }, fo = {
  key: 0,
  class: "block-peek"
}, bo = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, ho = { class: "node-icon" }, go = { class: "node-main" }, yo = { class: "node-summary" }, ko = { class: "node-side" }, $o = { class: "chip model" }, xo = { class: "branches" }, wo = { class: "branch" }, So = { class: "branch" }, Vo = { class: "node-icon" }, Co = { class: "node-main" }, Eo = { class: "node-summary" }, qo = ["aria-labelledby", "role", "aria-modal"], Fo = ["aria-valuenow"], No = { class: "side-panel-head" }, Uo = { class: "side-panel-icon" }, Mo = ["id"], Ao = ["aria-label", "title"], Bo = { class: "node-breadcrumb mono" }, Ro = {
  key: 0,
  class: "move-node",
  "aria-label": "Move node"
}, Lo = {
  key: 0,
  value: ""
}, Oo = {
  key: 1,
  value: "",
  disabled: ""
}, To = ["value"], Po = ["disabled"], Do = ["disabled"], Io = {
  key: 4,
  class: "inspector-form"
}, jo = { class: "output-list" }, zo = { class: "mono" }, Ho = { class: "chip" }, Wo = { class: "rail-label" }, tt = 400, He = 320, Ko = /* @__PURE__ */ z({
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
    const s = e, l = Le(e, "title"), i = Le(e, "description"), u = N({ kind: "document" });
    function p(k, v) {
      try {
        const V = localStorage.getItem(`docscout.${k}`);
        return V === null ? v : V === "1";
      } catch {
        return v;
      }
    }
    function g(k, v) {
      try {
        localStorage.setItem(`docscout.${k}`, v ? "1" : "0");
      } catch {
      }
    }
    const r = N(p("panel", !0)), y = N(p("fields", !0)), S = N(p("flow", !0));
    function b() {
      try {
        const k = Number(localStorage.getItem("docscout.panelWidth"));
        return k >= He ? k : tt;
      } catch {
        return tt;
      }
    }
    const a = N(b()), d = () => {
      const k = O.value?.clientWidth;
      return k ? Math.max(He, k - 420) : Number.POSITIVE_INFINITY;
    };
    function L(k, v = !0) {
      if (a.value = Math.round(Math.min(d(), Math.max(He, k))), v)
        try {
          localStorage.setItem("docscout.panelWidth", String(a.value));
        } catch {
        }
    }
    const A = N(!1);
    function C(k) {
      const v = k.currentTarget, V = k.clientX, Y = a.value;
      v.setPointerCapture(k.pointerId), A.value = !0;
      const X = (Z) => L(Y + (V - Z.clientX), !1), ae = () => {
        A.value = !1, L(a.value), v.removeEventListener("pointermove", X), v.removeEventListener("pointerup", ae);
      };
      v.addEventListener("pointermove", X), v.addEventListener("pointerup", ae);
    }
    function E(k) {
      k.key === "ArrowLeft" ? (L(a.value + 24), k.preventDefault()) : k.key === "ArrowRight" && (L(a.value - 24), k.preventDefault());
    }
    let G = null;
    const D = N(), j = pe();
    async function W(k) {
      if (r.value = k, !B.value) {
        g("panel", k);
        return;
      }
      if (!k && G) {
        const v = G;
        G = null, await Ce(), v.focus();
      }
    }
    function T(k) {
      const v = k === "fields" ? y : S;
      v.value = !v.value, g(k, v.value);
    }
    const O = N(), B = N(!1);
    let ue;
    Fe(() => {
      ue = new ResizeObserver(([k]) => {
        const v = B.value;
        B.value = k.contentRect.width < 1e3, B.value && !v && (r.value = !1), !B.value && v && (r.value = p("panel", !0));
      }), O.value && ue.observe(O.value);
    }), Ct(() => ue?.disconnect());
    const ye = N();
    fe(u, async () => {
      await Ce(), ye.value && (ye.value.scrollTop = 0);
    });
    async function te(k) {
      B.value && !r.value && (G = O.value?.getRootNode()?.activeElement), u.value = k, r.value = !0, B.value && (await Ce(), D.value?.focus());
    }
    const oe = (k) => JSON.stringify(k) === JSON.stringify(u.value), be = F(() => u.value.kind === "field" ? s.config.fields[u.value.index] : void 0), w = F(() => Je(s.config.fields)), h = F(() => u.value.kind === "field" ? w.value.find((k) => k.key === ie(u.value.index, u.value.trail ?? [])) : void 0), x = F(() => h.value?.key ?? ""), R = F(() => {
      const k = h.value;
      return !k || k.trail.at(-1) === "item" || !k.trail.length ? void 0 : w.value.find((V) => V.key === ie(k.field, k.trail.slice(0, -1))).shape.properties.filter((V) => V !== k.shape).map((V) => V.name);
    }), P = N("");
    fe(x, () => {
      P.value = "";
    });
    const Ne = F(() => h.value ? Yl(s.config.fields, h.value) : []), he = F(() => {
      const k = Cl(s.config.fields.map(K));
      return k ? `Group path collides with field ${k}.` : "";
    }), Pe = F(() => he.value ? null : Vt(s.config.fields)), Tt = F(() => he.value ? null : Vt(s.config.fields, !0)), it = F(() => {
      const k = u.value;
      return k.kind === "stage" ? ke[k.stage] : k.kind === "field" ? h.value?.trail.length ? h.value.path : be.value?.name || "New field" : k.kind === "document" ? "Read document" : k.kind === "output" ? "Output" : "Details";
    }), Pt = F(() => {
      const k = u.value;
      return k.kind === "stage" ? ot[k.stage] : k.kind === "field" ? "tabler:forms" : k.kind === "document" ? "tabler:file-text" : k.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), Dt = F(() => s.config.fields.filter((k, v) => !(u.value.kind === "field" && u.value.index === v)).map(K)), It = F(() => s.config.stages.deep.enabled), jt = F(() => s.config.stages.map.enabled), zt = F(() => Oe(s.config.fields.map(K))), De = N(!1), ut = N(), dt = pe();
    function Ht(k, v) {
      for (const V of s.config.fields) (V.group === k || V.group.startsWith(k + ".")) && (V.group = v + V.group.slice(k.length));
    }
    const Wt = (k) => 320 - Math.max(0, ...s.config.fields.filter((v) => v.group === k || v.group.startsWith(k + ".")).map((v) => v.group.length - k.length));
    function Kt() {
      y.value = !0, De.value = !0;
    }
    async function rt() {
      De.value = !1, await Ce(), ut.value.focus();
    }
    function Gt(k) {
      s.config.fields.push({ ...at(), group: k }), rt();
    }
    const Qt = F(() => [...new Set(s.config.fields.map((k) => k.group.trim()).filter(Boolean))]), Jt = (k) => Ut(s.config.fields[k], s.config.fields.filter((v, V) => V !== k).map(K)), ct = ["map", "prefetch", "scout", "deep", "extract", "verify"], Yt = F(() => ct.filter((k) => Qe(s.config, k)).map((k) => ke[k]).join(" · ")), Xt = F(() => s.config.fields.map((k) => k.name || "New field").join(", ")), Zt = F(() => ct.filter((k) => Qe(s.config, k)).length), xe = (k) => s.result?.trace.find((v) => v.kind === k);
    function vt(k = "") {
      s.config.fields.push({ ...at(), group: k }), y.value = !0, te({ kind: "field", index: s.config.fields.length - 1 });
    }
    function _t(k) {
      s.config.fields.splice(k, 1), u.value = { kind: "document" };
    }
    function re(k, v = []) {
      te({ kind: "field", index: k, ...v.length ? { trail: v } : {} });
    }
    function mt(k, v) {
      const V = w.value.find((Y) => Y.key === ie(k, v));
      V.shape.properties.push(Nt()), re(k, [...v, V.shape.properties.length - 1]);
    }
    function el() {
      const k = h.value;
      if (!k.trail.length) {
        _t(k.field);
        return;
      }
      const v = w.value.find((V) => V.key === ie(k.field, k.trail.slice(0, -1)));
      v.shape.properties.splice(k.trail.at(-1), 1), re(v.field, v.trail);
    }
    function tl(k, v, V) {
      if (v.length) {
        const X = w.value.find((ne) => ne.key === ie(k, v.slice(0, -1))).shape.properties, ae = v.at(-1), Z = ae + V;
        if (Z < 0 || Z >= X.length) return;
        [X[ae], X[Z]] = [X[Z], X[ae]], re(k, [...v.slice(0, -1), Z]);
      } else {
        const Y = s.config.fields.map((Z, ne) => Z.group === s.config.fields[k].group ? ne : -1).filter((Z) => Z >= 0), X = Y[Y.indexOf(k) + V];
        if (X === void 0) return;
        const ae = s.config.fields;
        [ae[k], ae[X]] = [ae[X], ae[k]], re(X);
      }
    }
    function ll() {
      const k = h.value, v = Ne.value.find((Y) => Y.key === P.value), V = Xl(s.config.fields, k, v);
      re(V.field, V.trail);
    }
    function al(k) {
      const v = h.value?.shape;
      s.config.fields.splice(0, s.config.fields.length, ...s.config.fields.filter((Y) => Y.group !== k && !Y.group.startsWith(k + ".")));
      const V = w.value.find((Y) => Y.shape === v);
      V ? re(V.field, V.trail) : u.value = { kind: "document" };
    }
    function nl(k, v) {
      const V = k.split(".").slice(0, -1).join(".");
      let X = Oe(s.config.fields.map(K));
      for (const se of V.split(".").filter(Boolean)) X = X.children.find((ul) => ul.name === se);
      const ae = X.children.findIndex((se) => se.path === k), Z = X.children[ae + v]?.path;
      if (!Z) return;
      const ne = s.config.fields.filter((se) => se.group === k || se.group.startsWith(k + ".")), Ie = s.config.fields.filter((se) => se.group === Z || se.group.startsWith(Z + ".")), Ue = s.config.fields, ol = Math.min(Ue.indexOf(ne[0]), Ue.indexOf(Ie[0])), ft = Ue.filter((se) => !ne.includes(se) && !Ie.includes(se));
      ft.splice(ol, 0, ...v > 0 ? [...Ie, ...ne] : [...ne, ...Ie]);
      const il = h.value?.shape;
      Ue.splice(0, Ue.length, ...ft);
      const _e = w.value.find((se) => se.shape === il);
      _e && re(_e.field, _e.trail);
    }
    const sl = (k) => k.type === "list" ? `list of ${k.item?.type}` : k.type, pt = F({ get: () => s.config.tags.join(", "), set: (k) => {
      s.config.tags = [...new Set(k.split(",").map((v) => v.trim()).filter(Boolean))];
    } });
    return (k, v) => (n(), o("div", {
      ref_key: "root",
      ref: O,
      class: Q(["builder", { narrow: B.value, "panel-open": r.value, resizing: A.value }])
    }, [
      t("div", {
        class: "canvas",
        inert: B.value && r.value
      }, [
        t("div", Hs, [
          t("section", Ws, [
            t("header", Ks, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": y.value,
                "aria-controls": "fields-body",
                onClick: v[0] || (v[0] = (V) => T("fields"))
              }, [
                f(m(M), {
                  icon: y.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                v[23] || (v[23] = t("h2", { id: "fields-head" }, "Fields", -1)),
                t("span", Qs, c(e.config.fields.length), 1)
              ], 8, Gs),
              !y.value && e.config.fields.length ? (n(), o("span", Js, c(Xt.value), 1)) : $("", !0),
              e.readonly ? $("", !0) : (n(), o("div", Ys, [
                t("button", {
                  ref_key: "addGroupButton",
                  ref: ut,
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  "aria-label": "Add group",
                  "aria-expanded": De.value,
                  "aria-controls": m(dt),
                  disabled: e.config.fields.length >= 100,
                  onClick: Kt
                }, [
                  f(m(M), { icon: "tabler:folder-plus" }),
                  v[24] || (v[24] = q("Add group", -1))
                ], 8, Xs),
                t("button", {
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  disabled: e.config.fields.length >= 100,
                  onClick: v[1] || (v[1] = (V) => vt())
                }, [
                  f(m(M), { icon: "tabler:plus" }),
                  v[25] || (v[25] = q("Add field", -1))
                ], 8, Zs)
              ]))
            ]),
            H(t("div", _s, [
              e.config.fields.length ? $("", !0) : (n(), o("p", eo, "Add the values to pull from each document.")),
              t("div", to, [
                De.value && !e.readonly ? (n(), o("div", {
                  key: 0,
                  id: m(dt),
                  class: "group-create-row"
                }, [
                  t("span", ao, [
                    f(m(M), { icon: "tabler:folder-plus" })
                  ]),
                  f(Bt, {
                    "input-label": "New group path",
                    "save-label": "Create group",
                    "cancel-label": "Cancel group creation",
                    onSave: Gt,
                    onCancel: rt
                  })
                ], 8, lo)) : $("", !0),
                f(Be, { node: zt.value }, {
                  header: me(({ path: V, label: Y, count: X, first: ae, last: Z }) => [
                    f(Ga, {
                      path: V,
                      name: Y,
                      count: X,
                      first: ae,
                      last: Z,
                      "max-length": Wt(V),
                      "can-add": e.config.fields.length < 100,
                      readonly: e.readonly,
                      onRename: (ne) => Ht(V, ne),
                      onAdd: (ne) => vt(V),
                      onReorder: (ne) => nl(V, ne),
                      onRemove: (ne) => al(V)
                    }, null, 8, ["path", "name", "count", "first", "last", "max-length", "can-add", "readonly", "onRename", "onAdd", "onReorder", "onRemove"])
                  ]),
                  default: me(({ index: V }) => [
                    f(hn, {
                      shape: e.config.fields[V],
                      field: V,
                      trail: [],
                      path: m(K)(e.config.fields[V]) || "New field",
                      selected: x.value,
                      readonly: e.readonly,
                      error: Jt(V),
                      first: !e.config.fields.slice(0, V).some((Y) => Y.group === e.config.fields[V].group),
                      last: !e.config.fields.slice(V + 1).some((Y) => Y.group === e.config.fields[V].group),
                      onSelect: re,
                      onAdd: mt,
                      onReorder: tl
                    }, null, 8, ["shape", "field", "path", "selected", "readonly", "error", "first", "last"])
                  ]),
                  _: 1
                }, 8, ["node"])
              ]),
              t("details", no, [
                t("summary", so, [
                  f(m(M), { icon: "tabler:braces" }),
                  v[26] || (v[26] = q("Output preview", -1))
                ]),
                he.value ? (n(), o("p", oo, c(he.value), 1)) : (n(), o("div", io, [
                  t("div", null, [
                    v[27] || (v[27] = t("h3", null, "Output shape", -1)),
                    t("pre", uo, c(JSON.stringify(Pe.value, null, 2)), 1)
                  ]),
                  t("div", null, [
                    v[28] || (v[28] = t("h3", null, "Example value", -1)),
                    t("pre", ro, c(JSON.stringify(Tt.value, null, 2)), 1)
                  ])
                ])),
                v[29] || (v[29] = t("small", null, "Example values illustrate the shape; extracted values come from your document.", -1))
              ])
            ], 512), [
              [Ge, y.value]
            ])
          ]),
          t("section", co, [
            t("header", vo, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": S.value,
                "aria-controls": "flow-body",
                onClick: v[2] || (v[2] = (V) => T("flow"))
              }, [
                f(m(M), {
                  icon: S.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                v[30] || (v[30] = t("h2", { id: "flow-head" }, "Flow", -1)),
                t("span", po, c(Zt.value) + " of 6", 1)
              ], 8, mo),
              S.value ? $("", !0) : (n(), o("span", fo, c(Yt.value), 1)),
              t("button", {
                type: "button",
                class: Q(["kx-btn kx-btn-ghost kx-focus-halo sm push", { on: oe({ kind: "details" }) }]),
                onClick: v[3] || (v[3] = (V) => te({ kind: "details" }))
              }, [
                f(m(M), { icon: "tabler:info-circle" }),
                v[31] || (v[31] = q("Details", -1))
              ], 2)
            ]),
            H(t("div", bo, [
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "document" }) }]),
                onClick: v[4] || (v[4] = (V) => te({ kind: "document" }))
              }, [
                t("span", ho, [
                  f(m(M), { icon: "tabler:file-text" })
                ]),
                t("span", go, [
                  v[32] || (v[32] = t("span", { class: "node-title" }, "Read document", -1)),
                  t("span", yo, c(m(El)(e.config.retrieval)), 1)
                ]),
                t("span", ko, [
                  t("span", $o, c(m(qt)(e.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              v[37] || (v[37] = t("div", { class: "connector" }, null, -1)),
              f(we, {
                stage: "map",
                config: e.config,
                active: oe({ kind: "stage", stage: "map" }),
                trace: xe("map"),
                readonly: e.readonly,
                onSelect: v[5] || (v[5] = (V) => te({ kind: "stage", stage: "map" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[38] || (v[38] = t("div", {
                class: "fork",
                "aria-hidden": "true"
              }, [
                t("span")
              ], -1)),
              t("div", xo, [
                t("div", wo, [
                  v[33] || (v[33] = t("span", { class: "branch-label" }, "Evidence", -1)),
                  f(we, {
                    stage: "prefetch",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "prefetch" }),
                    trace: xe("prefetch"),
                    readonly: e.readonly,
                    onSelect: v[6] || (v[6] = (V) => te({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  v[34] || (v[34] = t("div", { class: "connector" }, null, -1)),
                  f(we, {
                    stage: "scout",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "scout" }),
                    trace: xe("scout"),
                    readonly: e.readonly,
                    onSelect: v[7] || (v[7] = (V) => te({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                t("div", So, [
                  v[35] || (v[35] = t("span", { class: "branch-label" }, "Deep fields", -1)),
                  f(we, {
                    stage: "deep",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "deep" }),
                    trace: xe("deep"),
                    readonly: e.readonly,
                    onSelect: v[8] || (v[8] = (V) => te({ kind: "stage", stage: "deep" }))
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
                onSelect: v[9] || (v[9] = (V) => te({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[40] || (v[40] = t("div", { class: "connector" }, null, -1)),
              f(we, {
                stage: "verify",
                config: e.config,
                active: oe({ kind: "stage", stage: "verify" }),
                trace: xe("verify"),
                readonly: e.readonly,
                onSelect: v[10] || (v[10] = (V) => te({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[41] || (v[41] = t("div", { class: "connector" }, null, -1)),
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "output" }) }]),
                onClick: v[11] || (v[11] = (V) => te({ kind: "output" }))
              }, [
                t("span", Vo, [
                  f(m(M), { icon: "tabler:braces" })
                ]),
                t("span", Co, [
                  v[36] || (v[36] = t("span", { class: "node-title" }, "Output", -1)),
                  t("span", Eo, c(e.config.fields.length ? `${e.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [Ge, S.value]
            ])
          ])
        ])
      ], 8, zs),
      B.value && r.value ? (n(), o("div", {
        key: 0,
        class: "scrim",
        onClick: v[12] || (v[12] = (V) => W(!1))
      })) : $("", !0),
      r.value ? H((n(), o("aside", {
        key: String(B.value),
        class: "side-panel",
        "aria-labelledby": m(j),
        role: B.value ? "dialog" : void 0,
        "aria-modal": B.value ? "true" : void 0,
        style: qe(B.value ? void 0 : { width: `${a.value}px` }),
        onKeydown: v[21] || (v[21] = Ee((V) => B.value && W(!1), ["esc"]))
      }, [
        B.value ? $("", !0) : (n(), o("div", {
          key: 0,
          class: Q(["resizer kx-focus-outline", { active: A.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": a.value,
          "aria-valuemin": He,
          onPointerdown: ve(C, ["prevent"]),
          onKeydown: E,
          onDblclick: v[13] || (v[13] = (V) => L(tt))
        }, null, 42, Fo)),
        t("header", No, [
          t("span", Uo, [
            f(m(M), { icon: Pt.value }, null, 8, ["icon"])
          ]),
          t("h2", { id: m(j) }, c(it.value), 9, Mo),
          t("button", {
            ref_key: "closeButton",
            ref: D,
            type: "button",
            class: "kx-iconbtn kx-focus-outline push",
            "aria-label": B.value ? "Close panel" : "Collapse panel",
            title: B.value ? "Close panel" : "Collapse panel",
            onClick: v[14] || (v[14] = (V) => W(!1))
          }, [
            f(m(M), {
              icon: B.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ], 8, Ao)
        ]),
        t("div", {
          ref_key: "panelBody",
          ref: ye,
          class: "side-panel-body"
        }, [
          u.value.kind === "document" ? (n(), J(js, {
            key: 0,
            config: e.config,
            retention: e.retention,
            readonly: e.readonly
          }, null, 8, ["config", "retention", "readonly"])) : u.value.kind === "stage" ? (n(), J(Cs, {
            key: 1,
            stage: u.value.stage,
            config: e.config,
            readonly: e.readonly
          }, null, 8, ["stage", "config", "readonly"])) : u.value.kind === "field" && be.value && h.value ? (n(), o(U, { key: 2 }, [
            t("p", Bo, c(h.value.path), 1),
            f(qa, {
              field: be.value,
              shape: h.value.shape,
              depth: h.value.depth,
              "sibling-names": R.value,
              "other-names": Dt.value,
              groups: Qt.value,
              "deep-enabled": It.value,
              "map-enabled": jt.value,
              readonly: e.readonly,
              onRemove: el,
              onAdd: v[15] || (v[15] = (V) => mt(h.value.field, h.value.trail)),
              onSelectItem: v[16] || (v[16] = (V) => re(h.value.field, [...h.value.trail, "item"]))
            }, null, 8, ["field", "shape", "depth", "sibling-names", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"]),
            !e.readonly && h.value.trail.at(-1) !== "item" ? (n(), o("fieldset", Ro, [
              t("label", null, [
                v[42] || (v[42] = q("Move to parent", -1)),
                H(t("select", {
                  "onUpdate:modelValue": v[17] || (v[17] = (V) => P.value = V),
                  "aria-label": "Move to parent"
                }, [
                  h.value.trail.length ? (n(), o("option", Lo, "Top-level field")) : (n(), o("option", Oo, "Choose an object…")),
                  (n(!0), o(U, null, I(Ne.value, (V) => (n(), o("option", {
                    key: V.key,
                    value: V.key
                  }, c(V.path), 9, To))), 128))
                ], 512), [
                  [Ke, P.value]
                ])
              ]),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Move selected node",
                disabled: !P.value && !h.value.trail.length || !P.value && e.config.fields.length >= 100,
                onClick: ll
              }, "Move", 8, Po)
            ])) : $("", !0)
          ], 64)) : u.value.kind === "details" ? (n(), o("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: e.readonly
          }, [
            t("label", null, [
              v[43] || (v[43] = q("Name", -1)),
              H(t("input", {
                "onUpdate:modelValue": v[18] || (v[18] = (V) => l.value = V),
                "aria-label": "Extractor name"
              }, null, 512), [
                [ee, l.value]
              ])
            ]),
            t("label", null, [
              v[44] || (v[44] = q("Description", -1)),
              H(t("textarea", {
                "onUpdate:modelValue": v[19] || (v[19] = (V) => i.value = V),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [ee, i.value]
              ])
            ]),
            t("label", null, [
              v[45] || (v[45] = q("Tags", -1)),
              H(t("input", {
                "onUpdate:modelValue": v[20] || (v[20] = (V) => pt.value = V),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  ee,
                  pt.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              v[46] || (v[46] = t("small", null, "Comma separated", -1))
            ])
          ], 8, Do)) : u.value.kind === "output" ? (n(), o("div", Io, [
            v[47] || (v[47] = t("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            t("ul", jo, [
              (n(!0), o(U, null, I(e.config.fields, (V) => (n(), o("li", {
                key: m(K)(V)
              }, [
                t("span", zo, c(m(K)(V) || "New field"), 1),
                t("span", Ho, c(sl(V)), 1)
              ]))), 128))
            ]),
            v[48] || (v[48] = t("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : $("", !0)
        ], 512)
      ], 44, qo)), [
        [m(Ll), { disabled: !B.value }]
      ]) : B.value ? $("", !0) : (n(), o("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: v[22] || (v[22] = (V) => W(!0))
      }, [
        f(m(M), { icon: "tabler:layout-sidebar-right-expand" }),
        t("span", Wo, c(it.value), 1)
      ]))
    ], 2));
  }
}), Go = ["selected"], Qo = {
  key: 1,
  role: "alert"
}, Jo = {
  key: 2,
  class: "muted"
}, Rt = /* @__PURE__ */ z({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(e, { emit: s }) {
    const l = s, i = N(!1), u = N("");
    Fe(async () => {
      try {
        await Ze("wc-multiselect", { timeoutMs: 8e3 }), i.value = !0;
      } catch (g) {
        u.value = String(g);
      }
    });
    function p(g) {
      const r = g.detail;
      l("select", r.selected[0] || "", r.labels?.[0] || "");
    }
    return (g, r) => i.value ? (n(), o("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(e.value ? [e.value] : []),
      placeholder: "Choose an upload",
      onChange: p
    }, null, 40, Go)) : u.value ? (n(), o("p", Qo, c(u.value), 1)) : (n(), o("span", Jo, "Loading uploads…"));
  }
}), Yo = ["data-error-kind"], Xo = { key: 0 }, Lt = /* @__PURE__ */ z({
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
        t("strong", null, c(e.error?.kind), 1),
        q(" · " + c(e.error?.message), 1)
      ]),
      t("small", null, c(e.error?.retryable ? "Retryable" : "Not retryable"), 1),
      e.error?.details ? (n(), o("details", Xo, [
        l[0] || (l[0] = t("summary", { class: "kx-focus-outline" }, "Error details", -1)),
        t("pre", null, c(JSON.stringify(e.error.details, null, 2)), 1)
      ])) : $("", !0)
    ], 8, Yo));
  }
}), Zo = { class: "nested-value" }, _o = { key: 0 }, ei = {
  key: 0,
  class: "muted"
}, ti = { key: 1 }, li = { key: 2 }, Re = /* @__PURE__ */ z({
  __name: "NestedValue",
  props: {
    value: {}
  },
  setup(e) {
    const s = e, l = F(() => s.value !== null && typeof s.value == "object" && !Array.isArray(s.value) ? s.value : null);
    return (i, u) => {
      const p = st("NestedValue", !0);
      return n(), o("div", Zo, [
        Array.isArray(e.value) ? (n(), o("ol", _o, [
          (n(!0), o(U, null, I(e.value, (g, r) => (n(), o("li", { key: r }, [
            f(p, { value: g }, null, 8, ["value"])
          ]))), 128)),
          e.value.length ? $("", !0) : (n(), o("li", ei, "Empty list"))
        ])) : l.value ? (n(), o("dl", ti, [
          (n(!0), o(U, null, I(l.value, (g, r) => (n(), o(U, { key: r }, [
            t("dt", null, c(r), 1),
            t("dd", null, [
              f(p, { value: g }, null, 8, ["value"])
            ])
          ], 64))), 128))
        ])) : (n(), o("span", li, c(e.value === null || e.value === void 0 ? "—" : String(e.value)), 1))
      ]);
    };
  }
}), ai = { class: "value-list" }, ni = ["aria-expanded", "onClick"], si = { class: "value-name" }, oi = { class: "bar" }, ii = ["title"], ui = { class: "evidence" }, di = {
  key: 1,
  class: "muted"
}, ri = {
  key: 2,
  class: "muted"
}, Ot = /* @__PURE__ */ z({
  __name: "ResultFields",
  props: {
    fields: {}
  },
  setup(e) {
    const s = e, l = F(() => Oe(s.fields.map((y) => y.path))), i = N(), u = (y) => `${Math.round(y * 100)}%`, p = (y) => y !== null && typeof y == "object", g = (y) => Array.isArray(y) ? `${y.length} items` : p(y) ? `${Object.keys(y).length} properties` : y == null ? "—" : String(y), r = (y) => y >= 0.9 ? "high" : y >= 0.7 ? "mid" : "low";
    return (y, S) => (n(), o("div", ai, [
      f(Be, { node: l.value }, {
        default: me(({ index: b }) => [
          (n(!0), o(U, null, I([e.fields[b]], (a) => (n(), o("div", {
            key: a.path,
            class: "value-row"
          }, [
            t("button", {
              type: "button",
              class: "value-main",
              "aria-expanded": i.value === a.path,
              onClick: (d) => i.value = i.value === a.path ? void 0 : a.path
            }, [
              t("span", si, c(a.name), 1),
              t("span", {
                class: Q(["value-text", { missing: a.missing }])
              }, c(a.failed ? "Failed" : a.missing ? "Not in the document" : g(a.value)), 3),
              a.failed ? $("", !0) : (n(), o("span", {
                key: 0,
                class: Q(["confidence", r(a.confidence)])
              }, [
                t("span", oi, [
                  t("span", {
                    style: qe({ width: u(a.confidence) })
                  }, null, 4)
                ]),
                q(c(u(a.confidence)), 1),
                S[0] || (S[0] = t("span", { class: "conf-word" }, " confidence", -1))
              ], 2)),
              a.failed ? $("", !0) : (n(), o("span", {
                key: 1,
                class: Q(["chip", a.verified ? "primary" : "warn"]),
                title: a.reason
              }, [
                f(m(M), {
                  icon: a.verified ? "tabler:shield-check" : "tabler:shield-question"
                }, null, 8, ["icon"]),
                q(c(a.verified ? "Verified" : "Check"), 1)
              ], 10, ii)),
              f(m(M), {
                icon: i.value === a.path ? "tabler:chevron-up" : "tabler:chevron-down",
                class: "value-caret"
              }, null, 8, ["icon"])
            ], 8, ni),
            !a.failed && !a.missing && p(a.value) ? (n(), J(Re, {
              key: 0,
              class: "structured-value",
              value: a.value
            }, null, 8, ["value"])) : $("", !0),
            a.failed ? (n(), J(Lt, {
              key: 1,
              error: a.error
            }, null, 8, ["error"])) : $("", !0),
            H(t("div", ui, [
              !a.failed && !a.missing && !p(a.value) ? (n(), J(Re, {
                key: 0,
                value: a.value
              }, null, 8, ["value"])) : $("", !0),
              (n(!0), o(U, null, I(a.evidence, (d, L) => (n(), o("blockquote", {
                key: L,
                class: Q({ unfound: d.found === !1 })
              }, [
                t("p", null, "“" + c(d.quote) + "”", 1),
                t("cite", null, [
                  q(c(d.section), 1),
                  d.page !== void 0 && d.page !== null ? (n(), o(U, { key: 0 }, [
                    q(" · Page " + c(d.page), 1)
                  ], 64)) : $("", !0),
                  d.found === !1 ? (n(), o(U, { key: 1 }, [
                    q(" · not found word for word in the document")
                  ], 64)) : $("", !0)
                ])
              ], 2))), 128)),
              a.evidence.length ? $("", !0) : (n(), o("p", di, "No evidence.")),
              a.reason ? (n(), o("p", ri, c(a.reason), 1)) : $("", !0)
            ], 512), [
              [Ge, i.value === a.path && !a.failed]
            ])
          ]))), 128))
        ]),
        _: 1
      }, 8, ["node"])
    ]));
  }
}), ci = { class: "test" }, vi = { class: "run-bar" }, mi = { class: "run-input" }, pi = { class: "muted run-note" }, fi = {
  key: 0,
  class: "empty"
}, bi = {
  key: 1,
  class: "run-failed",
  role: "alert"
}, hi = {
  key: 2,
  class: "eval-warning",
  role: "status"
}, gi = {
  key: 3,
  class: "test-grid"
}, yi = { class: "block" }, ki = { class: "block-head" }, $i = { class: "muted push" }, xi = { class: "block" }, wi = { class: "timeline" }, Si = { class: "tl-icon" }, Vi = { class: "tl-main" }, Ci = { class: "tl-head" }, Ei = { class: "muted push" }, qi = { class: "tl-bar" }, Fi = { class: "muted" }, Ni = {
  key: 0,
  class: "tl-msg"
}, Ui = {
  key: 1,
  class: "chips"
}, Mi = /* @__PURE__ */ z({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {},
    running: { type: Boolean },
    canRun: { type: Boolean }
  },
  emits: ["run"],
  setup(e, { emit: s }) {
    const l = e, i = s, u = N(""), p = (b) => `${(b / 1e3).toFixed(1)}s`, g = F(() => Math.max(1, ...l.result?.trace.map((b) => b.duration_ms) ?? [1])), r = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, y = (b) => r[b]?.label ?? ke[b] ?? b, S = (b) => r[b]?.icon ?? ot[b] ?? "tabler:point";
    return (b, a) => (n(), o("div", ci, [
      t("section", vi, [
        t("div", mi, [
          f(Rt, {
            value: u.value,
            onSelect: a[0] || (a[0] = (d) => u.value = d)
          }, null, 8, ["value"])
        ]),
        f(m(de), {
          label: e.running ? "Extracting…" : "Run extraction",
          loading: e.running,
          disabled: !u.value || e.running || !e.canRun,
          onClick: a[1] || (a[1] = (d) => i("run", u.value))
        }, null, 8, ["label", "loading", "disabled"]),
        t("p", pi, c(e.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + c(e.retention) + ".", 1)
      ]),
      e.result ? $("", !0) : (n(), o("p", fi, "No extraction results yet.")),
      e.result?.status === "failed" ? (n(), o("p", bi, [
        f(m(M), { icon: "tabler:alert-triangle" }),
        q("The run stopped: " + c(e.result.error), 1)
      ])) : $("", !0),
      e.result?.status === "partial" ? (n(), o("p", hi, [
        f(m(M), { icon: "tabler:alert-triangle" }),
        a[2] || (a[2] = q("Partial result · Some fields failed. Successful values are available below.", -1))
      ])) : $("", !0),
      e.result ? (n(), o("div", gi, [
        t("section", yi, [
          t("header", ki, [
            a[3] || (a[3] = t("h2", { class: "block-title" }, "Values", -1)),
            t("span", $i, [
              q(c(e.result.tokens.toLocaleString()) + " tokens · " + c(p(e.result.duration_ms)), 1),
              e.result.pages ? (n(), o(U, { key: 0 }, [
                q(" · " + c(e.result.pages) + " pages", 1)
              ], 64)) : $("", !0)
            ])
          ]),
          f(Ot, {
            fields: e.result.fields
          }, null, 8, ["fields"])
        ]),
        t("section", xi, [
          a[4] || (a[4] = t("header", { class: "block-head" }, [
            t("h2", { class: "block-title" }, "Steps")
          ], -1)),
          t("ol", wi, [
            (n(!0), o(U, null, I(e.result.trace, (d, L) => (n(), o("li", {
              key: L,
              class: Q(d.status)
            }, [
              t("span", Si, [
                f(m(M), {
                  icon: S(d.kind)
                }, null, 8, ["icon"])
              ]),
              t("div", Vi, [
                t("div", Ci, [
                  t("strong", null, c(y(d.kind)), 1),
                  t("span", Ei, c(p(d.duration_ms)), 1)
                ]),
                t("span", qi, [
                  t("span", {
                    style: qe({ width: `${Math.max(4, d.duration_ms / g.value * 100)}%` })
                  }, null, 4)
                ]),
                t("p", Fi, [
                  q(c(d.scope), 1),
                  d.model ? (n(), o(U, { key: 0 }, [
                    q(" · " + c(d.model), 1)
                  ], 64)) : $("", !0),
                  q(" · " + c((d.input_tokens + d.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                d.message ? (n(), o("p", Ni, c(d.message), 1)) : $("", !0),
                d.queries?.length ? (n(), o("div", Ui, [
                  (n(!0), o(U, null, I(d.queries, (A) => (n(), o("span", {
                    key: A,
                    class: "chip"
                  }, c(A), 1))), 128))
                ])) : $("", !0)
              ])
            ], 2))), 128))
          ])
        ])
      ])) : $("", !0)
    ]));
  }
}), We = (e) => e.status === "completed" || e.status === "partial" || e.status === "failed", Ve = (e) => e.metrics.length ? e.metrics.reduce((s, l) => s + l.accuracy, 0) / e.metrics.length : 0;
function Ye(e, s = /* @__PURE__ */ new Date()) {
  const l = new Date(e);
  return l.toDateString() === s.toDateString() ? l.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" }) : l.getFullYear() === s.getFullYear() ? l.toLocaleString(void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : l.toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
}
const Ai = { class: "evals" }, Bi = { class: "block eval-run" }, Ri = { class: "eval-run-main" }, Li = { class: "block-title" }, Oi = {
  key: 0,
  class: "eval-note"
}, Ti = {
  key: 0,
  class: "eval-progress",
  role: "status"
}, Pi = { class: "bar" }, Di = { class: "muted" }, Ii = { class: "stat-row" }, ji = { class: "stat" }, zi = { class: "stat-label" }, Hi = { class: "stat-value" }, Wi = { class: "stat" }, Ki = { class: "stat-value" }, Gi = { class: "stat-delta flat" }, Qi = { class: "stat" }, Ji = { class: "stat-value" }, Yi = {
  key: 0,
  class: "stat-delta flat"
}, Xi = { class: "stat" }, Zi = { class: "stat-value" }, _i = {
  key: 0,
  class: "stat-delta flat"
}, eu = { class: "block" }, tu = { class: "block-head" }, lu = {
  key: 0,
  class: "compare-pick push"
}, au = ["value"], nu = ["value"], su = {
  key: 0,
  class: "block-empty"
}, ou = {
  key: 1,
  class: "table-scroll"
}, iu = { key: 0 }, uu = { key: 1 }, du = { class: "mono" }, ru = { class: "acc strong" }, cu = { class: "bar" }, vu = { class: "muted" }, mu = {
  key: 0,
  class: "muted"
}, pu = { key: 1 }, fu = {
  key: 1,
  class: "muted"
}, bu = {
  key: 1,
  class: "block"
}, hu = { class: "table-scroll" }, gu = { class: "metric-table result-matrix" }, yu = ["aria-expanded", "onClick"], ku = {
  key: 0,
  class: "badge",
  "data-status": "partial"
}, $u = ["colspan"], xu = {
  key: 0,
  class: "cell-state"
}, wu = ["data-error-kind", "title"], Su = ["data-label"], Vu = ["title"], Cu = {
  key: 0,
  class: "result-detail"
}, Eu = ["colspan"], qu = ["data-error-kind", "title"], Fu = { class: "mono" }, Nu = { class: "cmp" }, Uu = { class: "cmp" }, Mu = { key: 0 }, Au = { class: "muted case-meta" }, Bu = { class: "block" }, Ru = { class: "block-head" }, Lu = { class: "count" }, Ou = { class: "mono" }, Tu = ["onUpdate:modelValue"], Pu = ["onUpdate:modelValue"], Du = ["onUpdate:modelValue", "placeholder"], Iu = ["onUpdate:modelValue", "type"], ju = {
  key: 0,
  class: "error",
  role: "alert"
}, zu = { class: "row" }, Hu = {
  key: 1,
  class: "block-empty"
}, Wu = {
  key: 2,
  class: "block-empty"
}, Ku = {
  key: 3,
  class: "table-scroll"
}, Gu = { class: "metric-table case-table" }, Qu = { class: "case-value" }, Ju = {
  key: 1,
  class: "muted"
}, Yu = { class: "num" }, Xu = ["aria-label", "disabled", "onClick"], Zu = {
  key: 2,
  class: "block"
}, _u = { class: "block-head" }, ed = { class: "count" }, td = { class: "eval-history" }, ld = ["aria-current", "onClick"], ad = ["data-status"], nd = { class: "muted" }, sd = { class: "push" }, od = /* @__PURE__ */ z({
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
    const l = e, i = s, u = N(!1), p = N(""), g = N({}), r = N("");
    fe(() => l.addedCaseId, () => {
      u.value = !1, p.value = "", g.value = {};
    });
    function y(w, h) {
      return w.type === "number" ? Number(h) : w.type === "boolean" ? h === "true" : w.type === "list" || w.type === "object" ? JSON.parse(h) : h;
    }
    function S() {
      r.value = "";
      const w = {};
      try {
        for (const h of l.fields) {
          const x = String(g.value[K(h)] ?? "").trim();
          x && Ft(w, K(h), y(h, x));
        }
      } catch {
        r.value = 'Lists and objects need valid JSON, for example ["a","b"] or {"city":"Hamburg"}.';
        return;
      }
      i("add-case", { upload_id: p.value, expected: w });
    }
    const b = F(() => l.evaluations.find((w) => !We(w))), a = F(() => l.evaluations.filter(We)), d = F(() => l.evaluation), L = F(() => ({ done: (d.value?.results ?? []).filter((h) => h.status !== "queued").length, total: d.value?.case_count ?? 0 })), A = N();
    fe(() => d.value?.id, () => {
      A.value = void 0;
    });
    const C = F(() => {
      if (!d.value) return;
      if (A.value) return a.value.find((h) => h.id === A.value);
      const w = a.value.findIndex((h) => h.id === d.value.id);
      return w >= 0 ? a.value[w + 1] : a.value[0];
    }), E = F(() => (d.value?.metrics ?? []).map((w) => ({ ...w, before: C.value?.metrics.find((h) => h.field === w.field) }))), G = F(() => (d.value?.fields ?? []).map(K)), D = F(() => Oe(l.fields.map(K))), j = (w, h) => w.scores.find((x) => x.field === h), W = N(), T = (w) => `${Math.round(w * 100)}%`, O = (w) => {
      const h = Math.round(w * 100);
      return `${h > 0 ? "+" : h < 0 ? "−" : "±"}${Math.abs(h)} pts`;
    }, B = (w) => Math.round(w * 100) > 0 ? "up" : Math.round(w * 100) < 0 ? "down" : "flat", ue = (w) => w >= 6e4 ? `${Math.floor(w / 6e4)}m ${Math.round(w % 6e4 / 1e3)}s` : `${(w / 1e3).toFixed(1)}s`, ye = (w) => w == null || w === "" ? "—" : typeof w == "string" ? w : Array.isArray(w) && w.every((h) => typeof h != "object") ? w.join(", ") : JSON.stringify(w), te = (w) => w ? w.failed ? "fail" : w.score >= 0.999 ? "pass" : w.score > 0 ? "partial" : "fail" : "none", oe = (w) => (w.results ?? []).filter((h) => h.status === "completed").length, be = { queued: "Queued", running: "Running", completed: "Completed", partial: "Partial", failed: "Failed" };
    return (w, h) => (n(), o("div", Ai, [
      t("section", Bi, [
        t("div", Ri, [
          t("div", null, [
            t("h2", Li, "Evaluate revision " + c(e.revision), 1),
            h[6] || (h[6] = t("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            e.changed ? (n(), o("p", Oi, [
              f(m(M), { icon: "tabler:info-circle" }),
              h[5] || (h[5] = q("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : $("", !0)
          ]),
          f(m(de), {
            label: b.value ? "Evaluating…" : "Run all cases",
            loading: e.starting || !!b.value,
            disabled: !e.cases.length || !e.fields.length || !!b.value || e.starting,
            onClick: h[0] || (h[0] = (x) => i("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        d.value && !m(We)(d.value) ? (n(), o("div", Ti, [
          t("span", Pi, [
            t("span", {
              style: qe({ width: T(L.value.total ? L.value.done / L.value.total : 0) })
            }, null, 4)
          ]),
          t("span", Di, c(be[d.value.status]) + " · " + c(L.value.done) + " of " + c(L.value.total) + " cases", 1)
        ])) : $("", !0)
      ]),
      d.value && m(We)(d.value) ? (n(), o(U, { key: 0 }, [
        d.value.error ? (n(), o("p", {
          key: 0,
          class: Q(d.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          f(m(M), { icon: "tabler:alert-triangle" }),
          q(c(d.value.error), 1)
        ], 2)) : $("", !0),
        t("div", Ii, [
          t("div", ji, [
            t("span", zi, "Accuracy · revision " + c(d.value.config_revision), 1),
            t("span", Hi, c(T(m(Ve)(d.value))), 1),
            C.value ? (n(), o("span", {
              key: 0,
              class: Q(["stat-delta", B(m(Ve)(d.value) - m(Ve)(C.value))])
            }, c(O(m(Ve)(d.value) - m(Ve)(C.value))) + " vs revision " + c(C.value.config_revision), 3)) : $("", !0)
          ]),
          t("div", Wi, [
            h[7] || (h[7] = t("span", { class: "stat-label" }, "Cases", -1)),
            t("span", Ki, [
              q(c(oe(d.value)), 1),
              t("small", null, " / " + c(d.value.case_count), 1)
            ]),
            t("span", Gi, c((d.value.results ?? []).filter((x) => x.status === "partial").length) + " partial · " + c((d.value.results ?? []).filter((x) => x.status === "failed").length) + " failed", 1)
          ]),
          t("div", Qi, [
            h[8] || (h[8] = t("span", { class: "stat-label" }, "Tokens", -1)),
            t("span", Ji, c(d.value.tokens.toLocaleString()), 1),
            C.value ? (n(), o("span", Yi, c(C.value.tokens.toLocaleString()) + " before", 1)) : $("", !0)
          ]),
          t("div", Xi, [
            h[9] || (h[9] = t("span", { class: "stat-label" }, "Model time", -1)),
            t("span", Zi, c(ue(d.value.duration_ms)), 1),
            C.value ? (n(), o("span", _i, c(ue(C.value.duration_ms)) + " before", 1)) : $("", !0)
          ])
        ]),
        t("section", eu, [
          t("header", tu, [
            h[11] || (h[11] = t("h2", { class: "block-title" }, "Field accuracy", -1)),
            a.value.length > 1 ? (n(), o("label", lu, [
              h[10] || (h[10] = t("span", { class: "muted" }, "Compare with", -1)),
              t("select", {
                value: C.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: h[1] || (h[1] = (x) => A.value = x.target.value)
              }, [
                (n(!0), o(U, null, I(a.value.filter((x) => x.id !== d.value.id), (x) => (n(), o("option", {
                  key: x.id,
                  value: x.id
                }, "Revision " + c(x.config_revision) + " · " + c(m(Ye)(x.created_at)), 9, nu))), 128))
              ], 40, au)
            ])) : $("", !0)
          ]),
          E.value.length ? (n(), o("div", ou, [
            t("table", {
              class: Q(["metric-table accuracy-table", { comparing: !!C.value }])
            }, [
              t("thead", null, [
                t("tr", null, [
                  h[12] || (h[12] = t("th", null, "Field", -1)),
                  h[13] || (h[13] = t("th", null, "Accuracy", -1)),
                  h[14] || (h[14] = t("th", null, "Verified", -1)),
                  C.value ? (n(), o("th", iu, "Revision " + c(C.value.config_revision), 1)) : $("", !0),
                  C.value ? (n(), o("th", uu, "Change")) : $("", !0)
                ])
              ]),
              t("tbody", null, [
                (n(!0), o(U, null, I(E.value, (x) => (n(), o("tr", {
                  key: x.field
                }, [
                  t("td", du, c(x.field), 1),
                  t("td", null, [
                    t("span", ru, [
                      t("span", cu, [
                        t("span", {
                          style: qe({ width: T(x.accuracy) })
                        }, null, 4)
                      ]),
                      q(c(T(x.accuracy)), 1)
                    ])
                  ]),
                  t("td", vu, c(T(x.verified)), 1),
                  C.value ? (n(), o("td", mu, c(x.before ? T(x.before.accuracy) : "—"), 1)) : $("", !0),
                  C.value ? (n(), o("td", pu, [
                    x.before ? (n(), o("span", {
                      key: 0,
                      class: Q(["trend", B(x.accuracy - x.before.accuracy)])
                    }, [
                      f(m(M), {
                        icon: B(x.accuracy - x.before.accuracy) === "up" ? "tabler:trending-up" : B(x.accuracy - x.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      q(c(O(x.accuracy - x.before.accuracy)), 1)
                    ], 2)) : (n(), o("span", fu, "New field"))
                  ])) : $("", !0)
                ]))), 128))
              ])
            ], 2)
          ])) : (n(), o("p", su, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : $("", !0),
      d.value?.results?.length ? (n(), o("section", bu, [
        h[19] || (h[19] = t("header", { class: "block-head" }, [
          t("h2", { class: "block-title" }, "Results by case"),
          t("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        t("div", hu, [
          t("table", gu, [
            t("thead", null, [
              t("tr", null, [
                h[15] || (h[15] = t("th", null, "Document", -1)),
                (n(!0), o(U, null, I(G.value, (x) => (n(), o("th", {
                  key: x,
                  class: "mono"
                }, c(x), 1))), 128))
              ])
            ]),
            t("tbody", null, [
              (n(!0), o(U, null, I(d.value.results, (x) => (n(), o(U, {
                key: x.case_id
              }, [
                t("tr", {
                  class: Q(["result-row", { active: W.value === x.case_id }])
                }, [
                  t("td", null, [
                    t("button", {
                      type: "button",
                      class: "case-toggle",
                      "aria-expanded": W.value === x.case_id,
                      onClick: (R) => W.value = W.value === x.case_id ? void 0 : x.case_id
                    }, [
                      f(m(M), {
                        icon: W.value === x.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      q(c(x.upload_name), 1)
                    ], 8, yu),
                    x.status === "partial" ? (n(), o("span", ku, "Partial")) : $("", !0)
                  ]),
                  x.status === "queued" || x.status === "failed" ? (n(), o("td", {
                    key: 0,
                    colspan: G.value.length,
                    class: "muted"
                  }, [
                    x.status === "queued" ? (n(), o("span", xu, [
                      f(m(M), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      h[16] || (h[16] = q("Waiting", -1))
                    ])) : (n(), o("span", {
                      key: 1,
                      class: "cell-state fail",
                      "data-error-kind": x.error?.kind,
                      title: x.error?.kind
                    }, [
                      f(m(M), { icon: "tabler:alert-triangle" }),
                      q(c(x.error?.message), 1)
                    ], 8, wu))
                  ], 8, $u)) : (n(!0), o(U, { key: 1 }, I(G.value, (R) => (n(), o("td", {
                    key: R,
                    "data-label": R
                  }, [
                    t("span", {
                      class: Q(["cell", te(j(x, R))]),
                      title: ye(j(x, R)?.value)
                    }, c(j(x, R)?.failed ? "Failed" : j(x, R) ? T(j(x, R).score) : "—"), 11, Vu)
                  ], 8, Su))), 128))
                ], 2),
                W.value === x.case_id ? (n(), o("tr", Cu, [
                  t("td", {
                    colspan: G.value.length + 1
                  }, [
                    x.error ? (n(), o("p", {
                      key: 0,
                      class: "muted",
                      "data-error-kind": x.error.kind,
                      title: x.error.kind
                    }, c(x.error.message), 9, qu)) : $("", !0),
                    f(Be, {
                      node: m(Oe)(x.scores.map((R) => R.field))
                    }, {
                      default: me(({ index: R }) => [
                        (n(!0), o(U, null, I([x.scores[R]], (P) => (n(), o("dl", {
                          key: P.field,
                          class: "compare"
                        }, [
                          t("dt", Fu, c(P.field.split(".").at(-1)), 1),
                          t("dd", null, [
                            t("span", {
                              class: Q(["cell", te(P)])
                            }, c(P.failed ? "Failed" : T(P.score)), 3),
                            t("div", Nu, [
                              h[17] || (h[17] = t("span", { class: "cmp-label" }, "Expected", -1)),
                              f(Re, {
                                value: P.expected
                              }, null, 8, ["value"])
                            ]),
                            t("div", Uu, [
                              h[18] || (h[18] = t("span", { class: "cmp-label" }, "Extracted", -1)),
                              P.failed ? (n(), J(Lt, {
                                key: 0,
                                error: P.error
                              }, null, 8, ["error"])) : (n(), J(Re, {
                                key: 1,
                                value: P.value
                              }, null, 8, ["value"]))
                            ]),
                            P.failed ? $("", !0) : (n(), o("span", Mu, [
                              t("span", {
                                class: Q(["chip", P.verified ? "primary" : "warn"])
                              }, [
                                f(m(M), {
                                  icon: P.verified ? "tabler:shield-check" : "tabler:shield-question"
                                }, null, 8, ["icon"]),
                                q(c(P.verified ? "Verified" : "Unverified"), 1)
                              ], 2)
                            ]))
                          ])
                        ]))), 128))
                      ]),
                      _: 2
                    }, 1032, ["node"]),
                    t("p", Au, c(x.tokens.toLocaleString()) + " tokens · " + c(ue(x.duration_ms)), 1)
                  ], 8, Eu)
                ])) : $("", !0)
              ], 64))), 128))
            ])
          ])
        ])
      ])) : $("", !0),
      t("section", Bu, [
        t("header", Ru, [
          h[20] || (h[20] = t("h2", { class: "block-title" }, "Cases", -1)),
          t("span", Lu, c(e.cases.length), 1),
          f(m(de), {
            label: "Add case",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: !e.fields.length,
            onClick: h[2] || (h[2] = (x) => u.value = !u.value)
          }, null, 8, ["disabled"])
        ]),
        u.value ? (n(), o("form", {
          key: 0,
          class: "case-form",
          onSubmit: ve(S, ["prevent"])
        }, [
          t("label", null, [
            h[21] || (h[21] = q("Document", -1)),
            f(Rt, {
              value: p.value,
              onSelect: h[3] || (h[3] = (x) => {
                p.value = x;
              })
            }, null, 8, ["value"])
          ]),
          h[24] || (h[24] = t("p", { class: "muted" }, "Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.", -1)),
          f(Be, { node: D.value }, {
            default: me(({ index: x }) => [
              (n(!0), o(U, null, I([e.fields[x]], (R) => (n(), o("label", {
                key: m(K)(R)
              }, [
                t("span", Ou, c(R.name), 1),
                R.type === "boolean" ? H((n(), o("select", {
                  key: 0,
                  "onUpdate:modelValue": (P) => g.value[m(K)(R)] = P
                }, [...h[22] || (h[22] = [
                  t("option", { value: "" }, "Not stated", -1),
                  t("option", { value: "true" }, "Yes", -1),
                  t("option", { value: "false" }, "No", -1)
                ])], 8, Tu)), [
                  [Ke, g.value[m(K)(R)]]
                ]) : R.type === "enum" ? H((n(), o("select", {
                  key: 1,
                  "onUpdate:modelValue": (P) => g.value[m(K)(R)] = P
                }, [
                  h[23] || (h[23] = t("option", { value: "" }, "Not stated", -1)),
                  (n(!0), o(U, null, I(R.enum_values, (P) => (n(), o("option", { key: P }, c(P), 1))), 128))
                ], 8, Pu)), [
                  [Ke, g.value[m(K)(R)]]
                ]) : R.type === "object" || R.type === "list" ? H((n(), o("textarea", {
                  key: 2,
                  "onUpdate:modelValue": (P) => g.value[m(K)(R)] = P,
                  rows: "2",
                  placeholder: R.type === "list" ? '["first", "second"]' : '{"key": "value"}'
                }, null, 8, Du)), [
                  [ee, g.value[m(K)(R)]]
                ]) : H((n(), o("input", {
                  key: 3,
                  "onUpdate:modelValue": (P) => g.value[m(K)(R)] = P,
                  type: R.type === "number" ? "number" : R.type === "date" ? "date" : "text",
                  placeholder: "Not stated"
                }, null, 8, Iu)), [
                  [dl, g.value[m(K)(R)]]
                ])
              ]))), 128))
            ]),
            _: 1
          }, 8, ["node"]),
          r.value ? (n(), o("p", ju, c(r.value), 1)) : $("", !0),
          t("div", zu, [
            f(m(de), {
              label: "Save case",
              size: "small",
              type: "submit",
              disabled: !p.value,
              loading: e.saving
            }, null, 8, ["disabled", "loading"]),
            f(m(de), {
              label: "Cancel",
              size: "small",
              severity: "secondary",
              text: "",
              onClick: h[4] || (h[4] = (x) => u.value = !1)
            })
          ])
        ], 32)) : $("", !0),
        e.fields.length ? !e.cases.length && !u.value ? (n(), o("p", Wu, "No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.")) : e.cases.length ? (n(), o("div", Ku, [
          t("table", Gu, [
            h[25] || (h[25] = t("thead", null, [
              t("tr", null, [
                t("th", null, "Document"),
                t("th", null, "Expected values"),
                t("th")
              ])
            ], -1)),
            t("tbody", null, [
              (n(!0), o(U, null, I(e.cases, (x) => (n(), o("tr", {
                key: x.id
              }, [
                t("td", null, [
                  f(m(M), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  q(" " + c(x.upload_name), 1)
                ]),
                t("td", null, [
                  f(Be, { node: D.value }, {
                    default: me(({ index: R }) => [
                      t("div", Qu, [
                        t("strong", null, c(e.fields[R].name), 1),
                        m(kt)(x.expected, m(K)(e.fields[R])) !== void 0 ? (n(), J(Re, {
                          key: 0,
                          value: m(kt)(x.expected, m(K)(e.fields[R]))
                        }, null, 8, ["value"])) : (n(), o("span", Ju, "Not stated"))
                      ])
                    ]),
                    _: 2
                  }, 1032, ["node"])
                ]),
                t("td", Yu, [
                  t("button", {
                    type: "button",
                    class: "kx-iconbtn kx-focus-outline",
                    "aria-label": `Remove case ${x.upload_name}`,
                    disabled: e.saving,
                    onClick: (R) => i("delete-case", x.id)
                  }, [
                    f(m(M), { icon: "tabler:trash" })
                  ], 8, Xu)
                ])
              ]))), 128))
            ])
          ])
        ])) : $("", !0) : (n(), o("p", Hu, "Add a field in the Builder, then add documents with the values you expect."))
      ]),
      e.evaluations.length ? (n(), o("section", Zu, [
        t("header", _u, [
          h[26] || (h[26] = t("h2", { class: "block-title" }, "History", -1)),
          t("span", ed, c(e.evaluations.length), 1)
        ]),
        t("ul", td, [
          (n(!0), o(U, null, I(e.evaluations, (x) => (n(), o("li", {
            key: x.id
          }, [
            t("button", {
              type: "button",
              class: Q({ active: d.value?.id === x.id }),
              "aria-current": d.value?.id === x.id,
              onClick: (R) => i("open", x.id)
            }, [
              t("span", {
                class: "badge",
                "data-status": x.status
              }, c(be[x.status]), 9, ad),
              t("span", null, "Revision " + c(x.config_revision), 1),
              t("span", nd, c(m(Ye)(x.created_at)), 1),
              t("strong", sd, c(x.status === "completed" || x.status === "partial" ? T(m(Ve)(x)) : "—"), 1)
            ], 10, ld)
          ]))), 128))
        ])
      ])) : $("", !0)
    ]));
  }
}), id = { class: "section-head" }, ud = { class: "muted" }, dd = {
  key: 0,
  class: "empty"
}, rd = {
  key: 1,
  class: "table-scroll"
}, cd = { class: "metric-table runs-table" }, vd = ["aria-label", "aria-expanded", "onClick"], md = { class: "caller" }, pd = ["data-status"], fd = {
  class: "num",
  "data-label": "Time"
}, bd = {
  class: "num",
  "data-label": "Tokens"
}, hd = {
  class: "muted",
  "data-label": "Expires"
}, gd = {
  key: 0,
  class: "result-detail"
}, yd = { colspan: "6" }, kd = /* @__PURE__ */ z({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(e) {
    const s = N(), l = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (i, u) => (n(), o(U, null, [
      t("div", id, [
        u[0] || (u[0] = t("h2", null, "Recent runs", -1)),
        t("span", ud, "Runs expire after " + c(e.retention), 1)
      ]),
      e.runs.length ? (n(), o("div", rd, [
        t("table", cd, [
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
            (n(!0), o(U, null, I(e.runs, (p) => (n(), o(U, {
              key: p.id
            }, [
              t("tr", null, [
                t("td", null, [
                  t("button", {
                    type: "button",
                    class: "case-toggle",
                    "aria-label": `Show values for run ${p.id}`,
                    "aria-expanded": s.value === p.id,
                    onClick: (g) => s.value = s.value === p.id ? void 0 : p.id
                  }, [
                    f(m(M), {
                      icon: s.value === p.id ? "tabler:chevron-down" : "tabler:chevron-right"
                    }, null, 8, ["icon"]),
                    q(c(m(Ye)(p.created_at)), 1)
                  ], 8, vd)
                ]),
                t("td", null, [
                  t("span", md, [
                    f(m(M), {
                      icon: l[p.caller].icon
                    }, null, 8, ["icon"]),
                    q(c(l[p.caller].label), 1)
                  ])
                ]),
                t("td", null, [
                  t("span", {
                    class: "badge",
                    "data-status": p.status
                  }, c(p.status === "completed" ? "Completed" : p.status === "partial" ? "Partial" : "Failed"), 9, pd)
                ]),
                t("td", fd, c((p.duration_ms / 1e3).toFixed(1)) + "s", 1),
                t("td", bd, c(Number(p.tokens).toLocaleString()), 1),
                t("td", hd, c(m(Ye)(p.expires_at)), 1)
              ]),
              s.value === p.id ? (n(), o("tr", gd, [
                t("td", yd, [
                  f(Ot, {
                    fields: p.result.fields
                  }, null, 8, ["fields"])
                ])
              ])) : $("", !0)
            ], 64))), 128))
          ])
        ])
      ])) : (n(), o("p", dd, "No runs yet. Runs from the Test tab, agents, evaluations and Workflows appear here."))
    ], 64));
  }
}), $d = {
  key: 0,
  role: "alert",
  class: "error banner"
}, xd = /* @__PURE__ */ z({
  __name: "SharePopup",
  props: {
    id: {},
    title: {}
  },
  emits: ["close"],
  setup(e, { emit: s }) {
    const l = e, i = s, u = N(), p = N("");
    return Fe(async () => {
      try {
        await Ze("kickside-share", { timeoutMs: 8e3 });
      } catch (y) {
        p.value = `Sharing is unavailable: ${y instanceof Error ? y.message : String(y)}`;
        return;
      }
      const g = document.createElement("kickside-share"), r = encodeURIComponent(l.id);
      g.setAttribute("config", JSON.stringify({ resource_id: l.id, title: l.title, access_url: `/api/v1/component-access/grants/${r}`, share_url: `/api/v1/component-access/share/${r}` })), g.style.display = "block", g.addEventListener("close", () => i("close")), u.value?.appendChild(g);
    }), (g, r) => (n(), o("div", {
      ref_key: "host",
      ref: u
    }, [
      p.value ? (n(), o("p", $d, c(p.value), 1)) : $("", !0)
    ], 512));
  }
}), wd = { class: "docscout" }, Sd = { class: "toolbar" }, Vd = { class: "toolbar-lead" }, Cd = { class: "crumb-row" }, Ed = { class: "crumb" }, qd = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, Fd = ["id", "aria-selected", "aria-controls", "onClick"], Nd = { class: "toolbar-side" }, Ud = { class: "stats" }, Md = ["title"], Ad = {
  key: 2,
  class: "unsaved"
}, Bd = {
  key: 0,
  class: "banner row wrap",
  role: "status"
}, Rd = {
  key: 1,
  role: "alert",
  class: "error banner"
}, Ld = {
  key: 3,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, Od = ["id", "aria-labelledby"], Td = /* @__PURE__ */ z({
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
    const l = e, i = s, u = N(), p = N(!1), g = N("Builder"), r = N($t()), y = N(""), S = N(""), b = F(() => l.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    fe(g, () => {
      u.value && (u.value.scrollTop = 0);
    }, { flush: "post" });
    const a = N(), d = N(), L = F(() => l.snapshot.can_edit && a.value !== l.snapshot.expected_revision), A = F(() => L.value && d.value !== l.snapshot.expected_revision);
    function C(T) {
      return y.value === T.title && S.value === (T.description ?? "") && Fl(r.value, T.config);
    }
    function E() {
      const T = l.snapshot;
      r.value = structuredClone(ht(T.config ?? $t())), y.value = T.title, S.value = T.description ?? "", a.value = T.expected_revision, d.value = void 0;
    }
    fe(() => l.snapshot, (T, O) => {
      b.value.includes(g.value) || (g.value = b.value[0]), !(O && T.id === O.id && T.can_edit && O.can_edit && !C(O) && !C(T)) && E();
    }, { immediate: !0 });
    const G = F(() => l.snapshot.can_edit && !C(l.snapshot)), D = F(() => ql(r.value)), j = F(() => Object.keys(ke).filter((T) => Qe(r.value, T)).length);
    function W() {
      i("save", { title: y.value, description: S.value, config: structuredClone(ht(r.value)), expected_revision: a.value });
    }
    return (T, O) => (n(), o("main", wd, [
      t("div", Sd, [
        t("div", Vd, [
          t("span", Cd, [
            e.back ? (n(), o("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: O[0] || (O[0] = (B) => i("back"))
            }, [
              f(m(M), { icon: "tabler:arrow-left" })
            ])) : $("", !0),
            t("span", Ed, c(e.snapshot.title), 1)
          ]),
          t("nav", qd, [
            (n(!0), o(U, null, I(b.value, (B) => (n(), o("button", {
              id: `tab-${B}`,
              key: B,
              role: "tab",
              "aria-selected": g.value === B,
              "aria-controls": `panel-${B}`,
              onClick: (ue) => g.value = B
            }, c(B), 9, Fd))), 128))
          ])
        ]),
        t("div", Nd, [
          e.snapshot.can_share ? (n(), J(m(de), {
            key: 0,
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-label": "Share",
            onClick: O[1] || (O[1] = (B) => p.value = !0)
          }, {
            default: me(() => [
              f(m(M), { icon: "tabler:share" }),
              O[11] || (O[11] = t("span", { class: "btn-label" }, "Share", -1))
            ]),
            _: 1
          })) : $("", !0),
          t("span", Ud, [
            q(c(e.snapshot.field_count) + " " + c(e.snapshot.field_count === 1 ? "field" : "fields"), 1),
            e.snapshot.can_edit ? (n(), o(U, { key: 0 }, [
              q(" · " + c(j.value) + " steps · revision " + c(e.snapshot.expected_revision), 1)
            ], 64)) : (n(), o(U, { key: 1 }, [
              q(" · Read access")
            ], 64))
          ]),
          e.snapshot.can_edit ? (n(), o(U, { key: 1 }, [
            L.value && !A.value ? (n(), J(m(de), {
              key: 0,
              label: "Reload saved",
              severity: "secondary",
              size: "small",
              onClick: E
            })) : $("", !0),
            D.value ? (n(), o("span", {
              key: 1,
              class: "invalid",
              role: "alert",
              title: D.value
            }, [
              f(m(M), { icon: "tabler:alert-circle" }),
              q(c(D.value), 1)
            ], 8, Md)) : G.value ? (n(), o("span", Ad, "Unsaved")) : $("", !0),
            f(m(de), {
              label: "Save",
              size: "small",
              loading: e.saving,
              disabled: !G.value || !!D.value || !y.value.trim(),
              onClick: W
            }, null, 8, ["loading", "disabled"])
          ], 64)) : $("", !0)
        ])
      ]),
      A.value ? (n(), o("div", Bd, [
        t("span", null, "Saved configuration changed to revision " + c(e.snapshot.expected_revision) + ". Your edits are kept.", 1),
        f(m(de), {
          label: "Reload saved",
          severity: "secondary",
          size: "small",
          onClick: E
        }),
        f(m(de), {
          label: "Keep editing",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: O[2] || (O[2] = (B) => d.value = e.snapshot.expected_revision)
        })
      ])) : $("", !0),
      e.error ? (n(), o("p", Rd, c(e.error), 1)) : $("", !0),
      p.value ? (n(), J(xd, {
        key: 2,
        id: e.snapshot.id,
        title: e.snapshot.title,
        onClose: O[3] || (O[3] = (B) => p.value = !1)
      }, null, 8, ["id", "title"])) : $("", !0),
      g.value === "Builder" && e.snapshot.can_edit ? (n(), o("div", Ld, [
        f(Ko, {
          title: y.value,
          "onUpdate:title": O[4] || (O[4] = (B) => y.value = B),
          description: S.value,
          "onUpdate:description": O[5] || (O[5] = (B) => S.value = B),
          config: r.value,
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
          id: `panel-${g.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${g.value}`,
          class: "panel"
        }, [
          g.value === "Test" ? (n(), J(Mi, {
            key: 0,
            result: e.result,
            retention: e.snapshot.retention,
            running: e.running,
            "can-run": e.snapshot.field_count > 0,
            onRun: O[6] || (O[6] = (B) => i("run", B))
          }, null, 8, ["result", "retention", "running", "can-run"])) : $("", !0),
          g.value === "Evals" && e.snapshot.can_edit ? (n(), J(od, {
            key: 1,
            cases: e.snapshot.cases,
            "added-case-id": e.addedCaseId,
            fields: e.snapshot.config.fields,
            evaluations: e.evaluations,
            evaluation: e.evaluation,
            revision: e.snapshot.expected_revision,
            changed: G.value,
            saving: e.saving,
            starting: e.starting,
            onAddCase: O[7] || (O[7] = (B) => i("add-case", B)),
            onDeleteCase: O[8] || (O[8] = (B) => i("delete-case", B)),
            onEvaluate: O[9] || (O[9] = (B) => i("evaluate")),
            onOpen: O[10] || (O[10] = (B) => i("open-evaluation", B))
          }, null, 8, ["cases", "added-case-id", "fields", "evaluations", "evaluation", "revision", "changed", "saving", "starting"])) : $("", !0),
          g.value === "Runs" ? (n(), J(kd, {
            key: 2,
            runs: e.snapshot.runs,
            retention: e.snapshot.retention
          }, null, 8, ["runs", "retention"])) : $("", !0)
        ], 8, Od)
      ], 512))
    ]));
  }
}), Pd = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, Dd = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, Wd = /* @__PURE__ */ z({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(e, { emit: s }) {
    const l = e, i = s, u = N(), p = N(""), g = N(!1), r = N(!1), y = N(!1), S = N(), b = N(null), a = N([]), d = N();
    let L = [], A = 0, C = 0, E = 0, G;
    const D = (w) => w instanceof Error ? w.message : String(w), j = (w) => w === A;
    async function W(w, h) {
      const x = ++E;
      h && (G = h);
      const R = () => j(w) && x === E;
      try {
        const P = l.id, Ne = await ge.evaluations(P);
        if (!R()) return;
        a.value = Ne;
        const he = G ?? Ne[0]?.id;
        if (he) {
          const Pe = await ge.evaluation(P, he);
          if (!R() || Pe.id !== (G ?? he)) return;
          d.value = Pe;
        }
      } catch (P) {
        R() && (p.value = D(P));
      }
    }
    async function T(w) {
      const h = ++C, x = () => j(w) && h === C;
      if (!l.id) {
        p.value = "No extractor selected.";
        return;
      }
      try {
        const R = await ge.get(l.id);
        if (!x()) return;
        u.value = R, p.value = "", R.can_edit && await W(w);
      } catch (R) {
        x() && (p.value = D(R));
      }
    }
    fe(() => l.id, (w, h) => {
      A++, G = void 0, L.forEach((R) => R()), L = [], S.value = void 0, u.value = void 0, b.value = null, a.value = [], d.value = void 0, p.value = "";
      const x = A;
      l.id && (L = [xt(`component.${l.id}`, () => T(x)), xt(`docscout.runs.${l.id}`, () => T(x))]), h !== void 0 && T(x);
    }, { immediate: !0 }), Nl(() => T(A)), Ct(() => {
      A++, L.forEach((w) => w());
    });
    async function O(w) {
      const h = A;
      g.value = !0, p.value = "";
      try {
        const x = await w();
        if (j(h))
          return await T(h), x;
      } catch (x) {
        j(h) && (p.value = D(x));
      } finally {
        g.value = !1;
      }
    }
    const B = (w) => O(() => ge.update(l.id, w));
    async function ue(w) {
      const h = A, x = await O(() => ge.addCase(l.id, w));
      x && j(h) && (S.value = x.id);
    }
    const ye = (w) => O(() => ge.deleteCase(l.id, w));
    async function te(w) {
      const h = A;
      r.value = !0, p.value = "";
      try {
        const x = await ge.run(l.id, w);
        j(h) && (b.value = x, await T(h));
      } catch (x) {
        j(h) && (p.value = D(x));
      } finally {
        r.value = !1;
      }
    }
    async function oe() {
      const w = A;
      y.value = !0, p.value = "";
      try {
        const { eval_id: h } = await ge.evaluate(l.id);
        j(w) && await W(w, h);
      } catch (h) {
        j(w) && (p.value = D(h));
      } finally {
        y.value = !1;
      }
    }
    function be(w) {
      W(A, w);
    }
    return (w, h) => u.value ? (n(), J(Td, {
      key: 0,
      snapshot: u.value,
      "added-case-id": S.value,
      saving: g.value,
      running: r.value,
      starting: y.value,
      result: b.value,
      evaluations: a.value,
      evaluation: d.value,
      error: p.value,
      back: e.back,
      onBack: h[0] || (h[0] = (x) => i("back")),
      onRun: te,
      onSave: B,
      onAddCase: ue,
      onDeleteCase: ye,
      onEvaluate: oe,
      onOpenEvaluation: be
    }, null, 8, ["snapshot", "added-case-id", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : p.value ? (n(), o("p", Pd, c(p.value), 1)) : (n(), o("p", Dd, "Loading Docscout…"));
  }
});
export {
  Wd as _,
  Ye as w
};
