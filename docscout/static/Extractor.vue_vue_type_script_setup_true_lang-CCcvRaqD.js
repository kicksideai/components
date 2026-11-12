import { defineComponent as H, useModel as Le, openBlock as a, createElementBlock as n, withModifiers as ve, createElementVNode as t, mergeModels as Xe, computed as F, withKeys as Ee, unref as f, normalizeClass as Q, createVNode as b, toDisplayString as r, Fragment as M, renderList as I, createCommentVNode as h, createTextVNode as N, createBlock as J, ref as A, useId as pe, watch as fe, withDirectives as W, vModelText as _, vModelSelect as Ge, resolveComponent as st, renderSlot as je, withCtx as me, mergeProps as bt, vShow as Ke, onMounted as Ue, nextTick as Ce, normalizeStyle as qe, onBeforeUnmount as Ct, vModelDynamic as rl, toRaw as gt } from "vue";
import { B as cl, L as vl, j as ze, v as Me, k as ml, U as pl, I as ht, f as fl, i as Qe, l as Et, t as lt, h as $e, o as ot, p as bl, m as qt, q as K, M as Ae, r as Ut, w as Nt, x as at, y as gl, z as hl, A as yl, C as kl, D as $l, E as Ft, F as xl, G as Mt, H as wl, J as Vl, K as Sl, N as yt, O as Cl, P as et, Q as El, R as Pe, S as ql, s as de, T as kt, n as $t, V as Ul, W as Nl, b as Fl, c as he } from "./index-DIgsb1iz.js";
import { loadByTagName as Ze, on as xt } from "@wippy-fe/proxy";
import { Icon as R } from "@iconify/vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
var Ml = cl.extend({
  name: "focustrap-directive"
}), Al = ml.extend({
  style: Ml
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
function Vt(e) {
  for (var s = 1; s < arguments.length; s++) {
    var l = arguments[s] != null ? arguments[s] : {};
    s % 2 ? wt(Object(l), !0).forEach(function(i) {
      Rl(e, i, l[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(l)) : wt(Object(l)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(l, i));
    });
  }
  return e;
}
function Rl(e, s, l) {
  return (s = Bl(s)) in e ? Object.defineProperty(e, s, { value: l, enumerable: !0, configurable: !0, writable: !0 }) : e[s] = l, e;
}
function Bl(e) {
  var s = Ll(e, "string");
  return Te(s) == "symbol" ? s : s + "";
}
function Ll(e, s) {
  if (Te(e) != "object" || !e) return e;
  var l = e[Symbol.toPrimitive];
  if (l !== void 0) {
    var i = l.call(e, s);
    if (Te(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (s === "string" ? String : Number)(e);
}
var Pl = Al.extend("focustrap", {
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
      var i = this, u = l.value || {}, p = u.onFocusIn, y = u.onFocusOut;
      s.$_pfocustrap_mutationobserver = new MutationObserver(function(c) {
        c.forEach(function(w) {
          if (w.type === "childList" && !s.contains(document.activeElement)) {
            var C = function(m) {
              var x = ht(m) ? ht(m, i.getComputedSelector(s.$_pfocustrap_focusableselector)) ? m : Me(s, i.getComputedSelector(s.$_pfocustrap_focusableselector)) : Me(m);
              return fl(x) ? x : m.nextSibling && C(m.nextSibling);
            };
            ze(C(w.nextSibling));
          }
        });
      }), s.$_pfocustrap_mutationobserver.disconnect(), s.$_pfocustrap_mutationobserver.observe(s, {
        childList: !0
      }), s.$_pfocustrap_focusinlistener = function(c) {
        return p && p(c);
      }, s.$_pfocustrap_focusoutlistener = function(c) {
        return y && y(c);
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
      var i = l.value || {}, u = i.autoFocusSelector, p = u === void 0 ? "" : u, y = i.firstFocusableSelector, c = y === void 0 ? "" : y, w = i.autoFocus, C = w === void 0 ? !1 : w, S = Me(s, "[autofocus]".concat(this.getComputedSelector(p)));
      C && !S && (S = Me(s, this.getComputedSelector(c))), ze(S);
    },
    onFirstHiddenElementFocus: function(s) {
      var l, i = s.currentTarget, u = s.relatedTarget, p = u === i.$_pfocustrap_lasthiddenfocusableelement || !((l = this.$el) !== null && l !== void 0 && l.contains(u)) ? Me(i.parentElement, this.getComputedSelector(i.$_pfocustrap_focusableselector)) : i.$_pfocustrap_lasthiddenfocusableelement;
      ze(p);
    },
    onLastHiddenElementFocus: function(s) {
      var l, i = s.currentTarget, u = s.relatedTarget, p = u === i.$_pfocustrap_firsthiddenfocusableelement || !((l = this.$el) !== null && l !== void 0 && l.contains(u)) ? vl(i.parentElement, this.getComputedSelector(i.$_pfocustrap_focusableselector)) : i.$_pfocustrap_firsthiddenfocusableelement;
      ze(p);
    },
    createHiddenFocusableElements: function(s, l) {
      var i = this, u = l.value || {}, p = u.tabIndex, y = p === void 0 ? 0 : p, c = u.firstFocusableSelector, w = c === void 0 ? "" : c, C = u.lastFocusableSelector, S = C === void 0 ? "" : C, m = function(d) {
        return pl("span", {
          class: "p-hidden-accessible p-hidden-focusable",
          tabIndex: y,
          role: "presentation",
          "aria-hidden": !0,
          "data-p-hidden-accessible": !0,
          "data-p-hidden-focusable": !0,
          onFocus: d?.bind(i)
        });
      }, x = m(this.onFirstHiddenElementFocus), V = m(this.onLastHiddenElementFocus);
      x.$_pfocustrap_lasthiddenfocusableelement = V, x.$_pfocustrap_focusableselector = w, x.setAttribute("data-pc-section", "firstfocusableelement"), V.$_pfocustrap_firsthiddenfocusableelement = x, V.$_pfocustrap_focusableselector = S, V.setAttribute("data-pc-section", "lastfocusableelement"), s.prepend(x), s.append(V);
    }
  }
});
const Tl = ["aria-checked", "aria-label", "disabled"], Z = /* @__PURE__ */ H({
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
    return (l, i) => (a(), n("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": s.value,
      "aria-label": e.label,
      disabled: e.disabled,
      onClick: i[0] || (i[0] = ve((u) => s.value = !s.value, ["stop"]))
    }, [...i[1] || (i[1] = [
      t("span", null, null, -1)
    ])], 8, Tl));
  }
}), Ol = ["aria-label"], Dl = { class: "node-icon" }, Il = { class: "node-main" }, jl = { class: "node-title" }, zl = { class: "node-summary" }, Wl = {
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
  setup(e, { emit: s }) {
    const l = e, i = s, u = F(() => Qe(l.config, l.stage)), p = F(() => l.config.stages[l.stage].model), y = F({ get: () => u.value, set: (C) => {
      l.config.stages[l.stage].enabled = C;
    } }), c = F(() => {
      const C = l.config, S = C.stages;
      switch (l.stage) {
        case "map":
          return C.fields.filter((m) => m.search_within === "sections").map((m) => ({ text: m.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...S.prefetch.queries.map((m) => ({ text: m.name || "Untitled query", tone: "" })), ...C.fields.filter((m) => m.search_hints.trim()).map((m) => ({ text: m.name, tone: "hint" }))];
        case "scout":
          return S.scout.mode === "agent" ? S.scout.tools.map((m) => ({ text: lt(m).toLowerCase(), tone: "" })) : [];
        case "deep":
          return C.fields.filter((m) => m.strategy === "deep").map((m) => ({ text: m.name || "New field", tone: "primary" }));
        case "extract":
          return Et(C).map((m) => ({ text: `${m.name} · ${m.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), w = (C) => [`${(C.duration_ms / 1e3).toFixed(1)}s`, `${(C.input_tokens + C.output_tokens).toLocaleString()} tokens`, C.queries?.length ? `${C.queries.length} queries` : "", C.message ?? ""].filter(Boolean).join(" · ");
    return (C, S) => (a(), n("div", {
      class: Q(["node kx-focus-halo", { active: e.active, off: !u.value, fixed: e.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": f($e)[e.stage],
      onClick: S[1] || (S[1] = (m) => i("select")),
      onKeydown: [
        S[2] || (S[2] = Ee((m) => i("select"), ["enter"])),
        S[3] || (S[3] = Ee(ve((m) => i("select"), ["prevent"]), ["space"]))
      ]
    }, [
      t("span", Dl, [
        b(f(R), {
          icon: f(ot)[e.stage]
        }, null, 8, ["icon"])
      ]),
      t("span", Il, [
        t("span", jl, r(f($e)[e.stage]), 1),
        t("span", zl, r(u.value ? f(bl)(e.stage, e.config) : "Off"), 1),
        u.value && c.value.length ? (a(), n("span", Wl, [
          (a(!0), n(M, null, I(c.value, (m) => (a(), n("span", {
            key: m.text,
            class: Q(["chip", { primary: m.tone === "primary", "muted-chip": m.tone === "hint" }])
          }, r(m.text), 3))), 128))
        ])) : h("", !0),
        e.trace ? (a(), n("span", Hl, [
          b(f(R), {
            icon: e.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          N(r(w(e.trace)), 1)
        ])) : h("", !0)
      ]),
      t("span", Gl, [
        u.value && p.value ? (a(), n("span", Kl, r(f(qt)(p.value)), 1)) : h("", !0),
        e.stage !== "extract" && !e.readonly ? (a(), J(Z, {
          key: 1,
          modelValue: y.value,
          "onUpdate:modelValue": S[0] || (S[0] = (m) => y.value = m),
          label: `Enable ${f($e)[e.stage]}`
        }, null, 8, ["modelValue", "label"])) : h("", !0)
      ])
    ], 42, Ol));
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
    const s = e, l = Le(e, "modelValue"), i = A([]);
    function u(p, y) {
      const c = s.options.length - 1, w = { ArrowRight: y + 1, ArrowDown: y + 1, ArrowLeft: y - 1, ArrowUp: y - 1, Home: 0, End: c }[p.key];
      if (w === void 0) return;
      p.preventDefault();
      const C = (w + s.options.length) % s.options.length;
      l.value = s.options[C].value, i.value[C]?.focus();
    }
    return (p, y) => (a(), n("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": e.labelledBy
    }, [
      (a(!0), n(M, null, I(e.options, (c, w) => (a(), n("button", {
        key: c.value,
        ref_for: !0,
        ref_key: "buttons",
        ref: i,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        role: "radio",
        "aria-label": e.name ? `${e.name}: ${c.label}` : void 0,
        "aria-checked": l.value === c.value,
        tabindex: l.value === c.value ? 0 : -1,
        disabled: e.disabled,
        onClick: (C) => l.value = c.value,
        onKeydown: (C) => u(C, w)
      }, [
        c.icon ? (a(), J(f(R), {
          key: 0,
          icon: c.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : h("", !0),
        t("span", null, r(c.label), 1)
      ], 40, Jl))), 128))
    ], 8, Ql));
  }
}), ie = (e, s) => `${e}:${s.join("/")}`, At = [
  { value: "text", label: "Text", icon: "tabler:typography" },
  { value: "number", label: "Number", icon: "tabler:123" },
  { value: "boolean", label: "Yes / no", icon: "tabler:toggle-right" },
  { value: "date", label: "Date", icon: "tabler:calendar" },
  { value: "enum", label: "One of a set", icon: "tabler:list-details" },
  { value: "list", label: "List", icon: "tabler:brackets" },
  { value: "object", label: "Object", icon: "tabler:braces" }
], Yl = (e) => At.find((s) => s.value === e).icon;
function Je(e) {
  const s = [];
  function l(i, u, p, y) {
    s.push({ field: u, trail: p, shape: i, path: y, depth: p.length + 1, key: ie(u, p) }), i.properties?.forEach((c, w) => l(c, u, [...p, w], `${y}.${c.name || "New property"}`)), i.item && l(i.item, u, [...p, "item"], `${y}[]`);
  }
  return e.forEach((i, u) => l(i, u, [], K(i) || "New field")), s;
}
function nt(e) {
  return 1 + Math.max(0, ...(e.properties ?? []).map(nt), e.item ? nt(e.item) : 0);
}
function Xl(e, s) {
  return Je(e).filter((l) => l.shape.type === "object" && ((l.shape.properties?.length ?? 0) < 100 || l.field === s.field && ie(l.field, l.trail) === ie(s.field, s.trail.slice(0, -1))) && l.depth + nt(s.shape) <= Ae && !(l.field === s.field && s.trail.every((i, u) => l.trail[u] === i)));
}
function Zl(e, s, l) {
  const i = { ...Nt(), ...s.shape, name: s.shape.name };
  s.trail.length ? Je(e).find((y) => y.key === ie(s.field, s.trail.slice(0, -1))).shape.properties.splice(s.trail.at(-1), 1) : e.splice(s.field, 1);
  let u;
  if (l) {
    const { name: p, type: y, description: c, enum_values: w, expected_format: C, required: S, properties: m, item: x } = i;
    u = { name: p, type: y, description: c, enum_values: w, expected_format: C, required: S, ...m ? { properties: m } : {}, ...x ? { item: x } : {} }, l.shape.properties.push(u), u = l.shape.properties.at(-1);
  } else
    u = { ...at(), ...i, group: "" }, e.push(u), u = e.at(-1);
  return Je(e).find((p) => p.shape === u);
}
function St(e, s = !1) {
  function l(u) {
    return u.type === "object" ? Object.fromEntries((u.properties ?? []).map((p) => [p.name || "unnamed", l(p)])) : u.type === "list" ? u.item ? [l(u.item)] : [] : s ? u.enum_values?.length ? u.enum_values[0] : { text: "Example value", number: 42, boolean: !0, date: "2026-01-15", enum: null }[u.type] : u.type === "enum" ? u.enum_values?.join(" | ") || "enum" : u.type;
  }
  const i = {};
  return e.forEach((u) => Ut(i, K(u) || "unnamed", l(u))), i;
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
}, fa = { class: "muted" }, ba = ["aria-label", "disabled"], ga = /* @__PURE__ */ H({
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
    const l = e, i = s, u = F(() => l.shape), p = F(() => l.named ? l.depth === 1 ? "Field type" : "Property type" : "Item type"), y = F(() => At.filter((o) => l.depth < Ae || !["object", "list"].includes(o.value))), c = F({ get: () => l.shape.type, set: (o) => {
      l.shape.type = o, delete l.shape.properties, delete l.shape.item, l.shape.enum_values = [], o === "object" && (l.shape.properties = []), o === "list" && (l.shape.item = gl());
    } }), w = pe(), C = pe(), S = A(""), m = A("");
    fe(() => l.shape, () => {
      S.value = "", m.value = "";
    });
    const x = F(() => l.validationError || (l.named ? hl(u.value.name, l.siblingNames) : "") || yl(l.shape, l.depth));
    function V() {
      const o = S.value.trim(), d = l.shape.enum_values ?? [];
      if (!o || o.length > 200) {
        m.value = "Enter 1 to 200 characters.";
        return;
      }
      if (d.includes(o)) {
        m.value = "This value already exists.";
        return;
      }
      if (d.length >= 100) {
        m.value = "Use at most 100 allowed values.";
        return;
      }
      l.shape.enum_values = [...d, o], S.value = "", m.value = "";
    }
    return (o, d) => (a(), n("div", _l, [
      e.named ? (a(), n("label", ea, [
        d[8] || (d[8] = N("Name", -1)),
        W(t("input", {
          "onUpdate:modelValue": d[0] || (d[0] = (U) => u.value.name = U),
          "aria-label": e.depth === 1 ? "Field name" : "Property name",
          "aria-invalid": !!x.value,
          "aria-describedby": x.value ? f(C) : void 0,
          maxlength: "80",
          spellcheck: "false",
          class: "mono-input"
        }, null, 8, ta), [
          [
            _,
            u.value.name,
            void 0,
            { trim: !0 }
          ]
        ])
      ])) : h("", !0),
      t("div", la, [
        t("span", { id: f(w) }, r(e.named ? "Data type" : "Item type"), 9, aa),
        b(ye, {
          modelValue: c.value,
          "onUpdate:modelValue": d[1] || (d[1] = (U) => c.value = U),
          class: "type-picker",
          options: y.value,
          "labelled-by": f(w),
          name: p.value,
          disabled: e.readonly
        }, null, 8, ["modelValue", "options", "labelled-by", "name", "disabled"]),
        e.depth === f(Ae) ? (a(), n("small", na, "Level four · choose a value type.")) : h("", !0)
      ]),
      x.value ? (a(), n("p", {
        key: 1,
        id: f(C),
        class: "field-error",
        role: "alert"
      }, r(x.value), 9, sa)) : h("", !0),
      f(kl)(e.shape, e.named) ? (a(), n("div", oa, [
        t("span", null, r(e.shape.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        t("div", ia, [
          (a(!0), n(M, null, I(e.shape.enum_values, (U, z) => (a(), n("span", {
            key: U,
            class: "chip primary"
          }, [
            N(r(U), 1),
            e.readonly ? h("", !0) : (a(), n("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Remove allowed value ${U}`,
              onClick: (D) => e.shape.enum_values.splice(z, 1)
            }, [
              b(f(R), { icon: "tabler:x" })
            ], 8, ua))
          ]))), 128))
        ]),
        e.readonly ? h("", !0) : (a(), n("div", da, [
          W(t("input", {
            "onUpdate:modelValue": d[2] || (d[2] = (U) => S.value = U),
            "aria-label": "New allowed value",
            placeholder: "Add a value…",
            maxlength: "200",
            onKeydown: Ee(ve(V, ["prevent"]), ["enter"])
          }, null, 40, ra), [
            [_, S.value]
          ]),
          t("button", {
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo",
            onClick: V
          }, "Add")
        ])),
        m.value ? (a(), n("p", ca, r(m.value), 1)) : h("", !0)
      ])) : h("", !0),
      t("label", null, [
        d[9] || (d[9] = N("Description", -1)),
        W(t("textarea", {
          "onUpdate:modelValue": d[3] || (d[3] = (U) => e.shape.description = U),
          rows: "3",
          maxlength: "4000",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [_, e.shape.description]
        ])
      ]),
      ["boolean", "enum"].includes(e.shape.type) ? h("", !0) : (a(), n("label", va, [
        d[10] || (d[10] = N("Expected format", -1)),
        W(t("input", {
          "onUpdate:modelValue": d[4] || (d[4] = (U) => e.shape.expected_format = U),
          maxlength: "400",
          placeholder: f($l)(e.shape)
        }, null, 8, ma), [
          [_, e.shape.expected_format]
        ])
      ])),
      e.named ? (a(), n("div", pa, [
        d[11] || (d[11] = t("span", null, "Required", -1)),
        b(Z, {
          modelValue: u.value.required,
          "onUpdate:modelValue": d[5] || (d[5] = (U) => u.value.required = U),
          label: "Required",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : h("", !0),
      e.shape.type === "object" ? (a(), n(M, { key: 5 }, [
        t("p", fa, r(e.shape.properties?.length ?? 0) + " properties · Select a property in the tree to edit it.", 1),
        !e.readonly && e.depth < f(Ae) ? (a(), n("button", {
          key: 0,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Add property to ${e.label}`,
          disabled: (e.shape.properties?.length ?? 0) >= 100,
          onClick: d[6] || (d[6] = (U) => i("add"))
        }, [
          b(f(R), { icon: "tabler:plus" }),
          d[12] || (d[12] = N("Add property", -1))
        ], 8, ba)) : h("", !0)
      ], 64)) : h("", !0),
      e.shape.type === "list" && e.shape.item ? (a(), n("button", {
        key: 6,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        onClick: d[7] || (d[7] = (U) => i("selectItem"))
      }, [
        b(f(R), { icon: "tabler:brackets" }),
        N("Edit item shape · " + r(e.shape.item.type), 1)
      ])) : h("", !0)
    ]));
  }
}), ha = ["disabled"], ya = { class: "grid" }, ka = { class: "context-stepper" }, $a = ["disabled"], xa = ["disabled"], wa = {
  key: 0,
  class: "field-note"
}, Va = { class: "label-block" }, Sa = {
  key: 1,
  class: "field-error"
}, Ca = { id: "docscout-groups" }, Ea = ["value"], qa = { class: "toggle-row" }, Ua = /* @__PURE__ */ H({
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
    const l = e, i = s, u = F(() => !l.depth || l.depth === 1), p = F(() => Ft(l.field, l.otherNames));
    return (y, c) => (a(), n("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      b(ga, {
        shape: e.shape ?? e.field,
        depth: e.depth ?? 1,
        label: e.shape?.name || e.field.name || "field",
        named: u.value || !!e.shape?.name || !!e.siblingNames,
        "sibling-names": e.siblingNames,
        "validation-error": u.value ? p.value : void 0,
        readonly: e.readonly,
        onAdd: c[0] || (c[0] = (w) => i("add")),
        onSelectItem: c[1] || (c[1] = (w) => i("selectItem"))
      }, null, 8, ["shape", "depth", "label", "named", "sibling-names", "validation-error", "readonly"]),
      u.value ? (a(), n(M, { key: 0 }, [
        c[25] || (c[25] = t("h4", null, "Finding it", -1)),
        t("label", null, [
          c[12] || (c[12] = N("Search hints", -1)),
          W(t("textarea", {
            "onUpdate:modelValue": c[2] || (c[2] = (w) => e.field.search_hints = w),
            rows: "2",
            maxlength: "4000",
            placeholder: "One query per line"
          }, null, 512), [
            [_, e.field.search_hints]
          ]),
          c[13] || (c[13] = t("small", null, "Each line is an extra search for this field in Prefetch and Deep analysis.", -1))
        ]),
        t("div", ya, [
          t("label", null, [
            c[15] || (c[15] = N("Strategy", -1)),
            W(t("select", {
              "onUpdate:modelValue": c[3] || (c[3] = (w) => e.field.strategy = w)
            }, [...c[14] || (c[14] = [
              t("option", { value: "standard" }, "Standard", -1),
              t("option", { value: "deep" }, "Deep analysis", -1)
            ])], 512), [
              [Ge, e.field.strategy]
            ])
          ]),
          t("label", null, [
            c[16] || (c[16] = N("Chunks to read", -1)),
            t("span", ka, [
              W(t("input", {
                "onUpdate:modelValue": c[4] || (c[4] = (w) => e.field.chunks = w),
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
                onClick: c[5] || (c[5] = (w) => e.field.chunks--)
              }, "−", 8, $a),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Increase chunks to read",
                disabled: e.field.chunks >= 1e3 || e.readonly,
                onClick: c[6] || (c[6] = (w) => e.field.chunks++)
              }, "+", 8, xa)
            ]),
            c[17] || (c[17] = t("small", null, "Per search hint", -1))
          ])
        ]),
        e.field.strategy === "deep" && !e.deepEnabled ? (a(), n("p", wa, [
          b(f(R), { icon: "tabler:info-circle" }),
          c[18] || (c[18] = N("Deep analysis is off in the flow, so this field runs as standard.", -1))
        ])) : h("", !0),
        t("div", Va, [
          c[19] || (c[19] = t("span", { id: "within-label" }, "Search within", -1)),
          b(ye, {
            modelValue: e.field.search_within,
            "onUpdate:modelValue": c[7] || (c[7] = (w) => e.field.search_within = w),
            "labelled-by": "within-label",
            options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
          }, null, 8, ["modelValue"]),
          t("small", null, r(e.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
        ]),
        e.field.search_within === "sections" && !e.mapEnabled ? (a(), n("p", Sa, [
          b(f(R), { icon: "tabler:alert-circle" }),
          c[20] || (c[20] = N("Turn on Map the document to read sections.", -1))
        ])) : h("", !0),
        t("label", null, [
          c[21] || (c[21] = N("Group", -1)),
          W(t("input", {
            "onUpdate:modelValue": c[8] || (c[8] = (w) => e.field.group = w),
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
          t("datalist", Ca, [
            (a(!0), n(M, null, I(e.groups, (w) => (a(), n("option", {
              key: w,
              value: w
            }, null, 8, Ea))), 128))
          ]),
          c[22] || (c[22] = t("small", null, "Use dotted snake_case names. Values nest under this path.", -1))
        ]),
        c[26] || (c[26] = t("h4", null, "Checking it", -1)),
        t("label", null, [
          c[23] || (c[23] = N("Validation hints", -1)),
          W(t("textarea", {
            "onUpdate:modelValue": c[9] || (c[9] = (w) => e.field.validation_hints = w),
            rows: "2",
            maxlength: "4000",
            placeholder: "Rules the value must satisfy"
          }, null, 512), [
            [_, e.field.validation_hints]
          ])
        ]),
        t("div", qa, [
          c[24] || (c[24] = t("span", null, [
            N("Evidence required"),
            t("small", null, "The value must cite a quote from the document.")
          ], -1)),
          b(Z, {
            modelValue: e.field.evidence_required,
            "onUpdate:modelValue": c[10] || (c[10] = (w) => e.field.evidence_required = w),
            label: "Evidence required",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : h("", !0),
      !e.readonly && (u.value || e.siblingNames) ? (a(), n("button", {
        key: 1,
        type: "button",
        class: "kx-btn kx-btn-danger kx-focus-halo",
        onClick: c[11] || (c[11] = (w) => i("remove"))
      }, r(u.value ? "Remove field" : "Remove property"), 1)) : h("", !0)
    ], 8, ha));
  }
}), Na = { class: "field-groups" }, Fa = {
  key: 0,
  class: "rows"
}, Ma = ["aria-label"], Aa = { class: "field-group-head" }, Ra = ["aria-label", "aria-expanded", "aria-controls", "onClick"], Ba = { class: "group-title" }, La = ["id"], Pa = { class: "group-title" }, Re = /* @__PURE__ */ H({
  __name: "FieldGroups",
  props: {
    node: {}
  },
  setup(e) {
    const s = A(/* @__PURE__ */ new Set()), l = pe();
    function i(p) {
      s.value.has(p) ? s.value.delete(p) : s.value.add(p);
    }
    const u = (p) => p.indices.length + p.children.reduce((y, c) => y + u(c), 0);
    return (p, y) => {
      const c = st("FieldGroups", !0);
      return a(), n("div", Na, [
        e.node.indices.length ? (a(), n("ul", Fa, [
          (a(!0), n(M, null, I(e.node.indices, (w) => (a(), n("li", { key: w }, [
            je(p.$slots, "default", { index: w })
          ]))), 128))
        ])) : h("", !0),
        (a(!0), n(M, null, I(e.node.children, (w, C) => (a(), n("section", {
          key: w.path,
          class: "field-group",
          "aria-label": `Group ${w.path}`
        }, [
          t("header", Aa, [
            t("button", {
              type: "button",
              class: "tree-toggle kx-iconbtn kx-focus-outline",
              "aria-label": `${s.value.has(w.path) ? "Expand" : "Collapse"} group ${w.path}`,
              "aria-expanded": !s.value.has(w.path),
              "aria-controls": `${f(l)}-${w.path}`,
              onClick: (S) => i(w.path)
            }, [
              b(f(R), {
                icon: s.value.has(w.path) ? "tabler:chevron-right" : "tabler:chevron-down"
              }, null, 8, ["icon"])
            ], 8, Ra),
            je(p.$slots, "header", {
              path: w.path,
              label: w.name,
              count: u(w),
              first: C === 0,
              last: C === e.node.children.length - 1
            }, () => [
              t("span", Ba, r(w.name), 1)
            ])
          ]),
          W(t("div", {
            id: `${f(l)}-${w.path}`,
            class: "group-content"
          }, [
            b(c, { node: w }, {
              default: me((S) => [
                je(p.$slots, "default", bt({ ref_for: !0 }, S))
              ]),
              header: me((S) => [
                je(p.$slots, "header", bt({ ref_for: !0 }, S), () => [
                  t("span", Pa, r(S.label), 1)
                ])
              ]),
              _: 3
            }, 8, ["node"])
          ], 8, La), [
            [Ke, !s.value.has(w.path)]
          ])
        ], 8, Ma))), 128))
      ]);
    };
  }
}), Ta = ["aria-label", "maxlength", "aria-invalid", "aria-describedby", "onKeydown"], Oa = ["aria-label", "title"], Da = ["aria-label", "title"], Ia = ["id"], Rt = /* @__PURE__ */ H({
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
    const l = e, i = s, u = A(l.initialValue), p = A(""), y = A(), c = pe();
    Ue(() => {
      y.value.focus(), y.value.select();
    });
    function w() {
      const C = u.value.trim();
      if (!C || !xl.test(C)) {
        p.value = "Use a dotted path of snake_case group names.";
        return;
      }
      if (C.length > l.maxLength) {
        p.value = "The group and its nested paths must fit within 320 characters.";
        return;
      }
      i("save", C);
    }
    return (C, S) => (a(), n("form", {
      class: "group-path-editor",
      onSubmit: ve(w, ["prevent"])
    }, [
      W(t("input", {
        ref_key: "input",
        ref: y,
        "onUpdate:modelValue": S[0] || (S[0] = (m) => u.value = m),
        "aria-label": e.inputLabel,
        maxlength: e.maxLength,
        "aria-invalid": !!p.value,
        "aria-describedby": p.value ? f(c) : void 0,
        "aria-required": "true",
        autocomplete: "off",
        spellcheck: "false",
        placeholder: "parties.borrower",
        onKeydown: [
          Ee(ve(w, ["prevent"]), ["enter"]),
          S[1] || (S[1] = Ee(ve((m) => i("cancel"), ["stop", "prevent"]), ["esc"]))
        ]
      }, null, 40, Ta), [
        [_, u.value]
      ]),
      t("button", {
        type: "submit",
        class: "kx-iconbtn kx-focus-outline",
        "aria-label": e.saveLabel,
        title: e.saveLabel
      }, [
        b(f(R), { icon: "tabler:check" })
      ], 8, Oa),
      t("button", {
        type: "button",
        class: "kx-iconbtn kx-focus-outline",
        "aria-label": e.cancelLabel,
        title: e.cancelLabel,
        onClick: S[2] || (S[2] = (m) => i("cancel"))
      }, [
        b(f(R), { icon: "tabler:x" })
      ], 8, Da),
      p.value ? (a(), n("p", {
        key: 0,
        id: f(c),
        class: "field-error",
        role: "alert"
      }, r(p.value), 9, Ia)) : h("", !0)
    ], 32));
  }
}), ja = ["title"], za = ["aria-label", "data-group-rename", "title"], Wa = ["aria-label"], Ha = {
  key: 2,
  class: "group-actions"
}, Ga = ["aria-label", "disabled"], Ka = ["aria-label", "aria-expanded", "aria-controls"], Qa = /* @__PURE__ */ H({
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
    const l = e, i = s, u = A(!1), p = A(!1), y = A(), c = A(), w = A(), C = pe(), S = F(() => [
      { label: "Move up", disabled: l.first, command: () => i("reorder", -1) },
      { label: "Move down", disabled: l.last, command: () => i("reorder", 1) },
      { separator: !0 },
      { label: "Delete group and its fields", command: () => i("remove") }
    ]);
    function m() {
      u.value = !0;
    }
    async function x() {
      u.value = !1, await Ce(), c.value.focus();
    }
    async function V(o) {
      const d = y.value.closest(".field-tree");
      u.value = !1, i("rename", o), await Ce(), d.querySelector(`[data-group-rename="${o}"]`).focus();
    }
    return (o, d) => (a(), n("div", {
      ref_key: "heading",
      ref: y,
      class: "group-heading"
    }, [
      u.value ? (a(), J(Rt, {
        key: 0,
        "initial-value": e.path,
        "input-label": `Group path for ${e.path}`,
        "save-label": "Save group name",
        "cancel-label": "Cancel group rename",
        "max-length": e.maxLength,
        onSave: V,
        onCancel: x
      }, null, 8, ["initial-value", "input-label", "max-length"])) : (a(), n(M, { key: 1 }, [
        e.readonly ? (a(), n("span", {
          key: 0,
          class: "group-title",
          title: e.path
        }, r(e.name), 9, ja)) : (a(), n("button", {
          key: 1,
          ref_key: "renameButton",
          ref: c,
          type: "button",
          class: "group-title group-name-button kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Rename group ${e.path}`,
          "data-group-rename": e.path,
          title: e.path,
          onClick: m
        }, [
          t("span", null, r(e.name), 1),
          b(f(R), {
            icon: "tabler:pencil",
            "aria-hidden": "true"
          })
        ], 8, za)),
        t("span", {
          class: "count group-count",
          "aria-label": `${e.count} fields`
        }, r(e.count), 9, Wa),
        e.readonly ? h("", !0) : (a(), n("div", Ha, [
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Add field to ${e.path}`,
            disabled: !e.canAdd,
            title: "Add field",
            onClick: d[0] || (d[0] = (U) => i("add"))
          }, [
            b(f(R), { icon: "tabler:plus" })
          ], 8, Ga),
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Actions for group ${e.path}`,
            "aria-haspopup": "menu",
            "aria-expanded": p.value,
            "aria-controls": f(C),
            onClick: d[1] || (d[1] = (U) => w.value.toggle(U))
          }, [
            b(f(R), { icon: "tabler:dots" })
          ], 8, Ka),
          b(f(Mt), {
            id: f(C),
            ref_key: "menu",
            ref: w,
            model: S.value,
            popup: "",
            "append-to": "self",
            onShow: d[2] || (d[2] = (U) => p.value = !0),
            onHide: d[3] || (d[3] = (U) => p.value = !1)
          }, null, 8, ["id", "model"])
        ]))
      ], 64))
    ], 512));
  }
}), Ja = ["aria-label", "aria-expanded"], Ya = {
  key: 1,
  class: "tree-indent"
}, Xa = ["aria-label", "aria-describedby", "aria-current"], Za = { class: "row-copy" }, _a = { class: "row-name" }, en = ["title"], tn = ["id", "title"], ln = { class: "field-badges" }, an = { class: "chip field-type" }, nn = { class: "field-flags" }, sn = {
  key: 0,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Required",
  title: "Required"
}, on = {
  key: 1,
  class: "chip field-flag primary",
  role: "img",
  "aria-label": "Deep analysis",
  title: "Deep analysis"
}, un = {
  key: 2,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Reads sections",
  title: "Reads sections"
}, dn = {
  key: 3,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Evidence required",
  title: "Evidence required"
}, rn = {
  key: 2,
  class: "row-actions"
}, cn = ["aria-label", "disabled"], vn = ["aria-label", "disabled"], mn = ["aria-label", "aria-expanded", "aria-controls"], pn = {
  key: 0,
  class: "tree-children"
}, fn = { key: 0 }, bn = { key: 1 }, gn = ["aria-label", "disabled"], hn = /* @__PURE__ */ H({
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
    const l = e, i = s, u = pe(), p = pe(), y = A(), c = A(!1), w = F(() => [
      { label: "Move up", disabled: l.first, command: () => i("reorder", l.field, l.trail, -1) },
      { label: "Move down", disabled: l.last, command: () => i("reorder", l.field, l.trail, 1) }
    ]), C = A(!0);
    fe(() => l.selected, (d) => {
      const U = ie(l.field, l.trail);
      d !== U && d.startsWith(U + (l.trail.length ? "/" : "")) && (C.value = !0);
    });
    const S = F(() => l.trail.at(-1) !== "item"), m = F(() => S.value ? l.shape.name || "New field" : "Each item"), x = F(() => l.trail.length ? void 0 : l.shape), V = F(() => l.shape.type === "object" || l.shape.type === "list");
    function o(d) {
      d.key === "ArrowRight" && V.value && (C.value = !0, d.preventDefault(), d.stopPropagation()), d.key === "ArrowLeft" && V.value && (C.value = !1, d.preventDefault(), d.stopPropagation());
    }
    return (d, U) => {
      const z = st("ShapeTree", !0);
      return a(), n("div", {
        class: "shape-tree-node",
        onKeydown: o
      }, [
        t("div", {
          class: Q(["row-item", { active: e.selected === f(ie)(e.field, e.trail) }])
        }, [
          V.value ? (a(), n("button", {
            key: 0,
            class: "tree-toggle kx-iconbtn kx-focus-outline",
            type: "button",
            "aria-label": `${C.value ? "Collapse" : "Expand"} ${e.path}`,
            "aria-expanded": C.value,
            onClick: U[0] || (U[0] = (D) => C.value = !C.value)
          }, [
            b(f(R), {
              icon: C.value ? "tabler:chevron-down" : "tabler:chevron-right"
            }, null, 8, ["icon"])
          ], 8, Ja)) : (a(), n("span", Ya)),
          t("button", {
            type: "button",
            class: "row-main kx-focus-halo",
            "aria-label": `Edit ${e.path}`,
            "aria-describedby": f(u),
            "aria-current": e.selected === f(ie)(e.field, e.trail) ? "true" : void 0,
            onClick: U[1] || (U[1] = (D) => i("select", e.field, e.trail))
          }, [
            t("span", Za, [
              t("span", _a, [
                b(f(R), {
                  icon: f(Yl)(e.shape.type),
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                t("span", {
                  class: "row-label",
                  title: m.value
                }, r(m.value), 9, en),
                e.error ? (a(), J(f(R), {
                  key: 0,
                  icon: "tabler:alert-circle",
                  class: "row-warn",
                  "aria-label": e.error,
                  title: e.error
                }, null, 8, ["aria-label", "title"])) : h("", !0)
              ]),
              t("span", {
                id: f(u),
                class: Q(["row-desc", { missing: !e.shape.description }]),
                title: e.shape.description || void 0
              }, r(e.shape.description || "No description"), 11, tn)
            ]),
            t("span", ln, [
              t("span", an, r(e.shape.type), 1),
              t("span", nn, [
                S.value && e.shape.required ? (a(), n("span", sn, [
                  b(f(R), {
                    icon: "tabler:asterisk",
                    "aria-hidden": "true"
                  })
                ])) : h("", !0),
                x.value?.strategy === "deep" ? (a(), n("span", on, [
                  b(f(R), {
                    icon: "tabler:microscope",
                    "aria-hidden": "true"
                  })
                ])) : h("", !0),
                x.value?.search_within === "sections" ? (a(), n("span", un, [
                  b(f(R), {
                    icon: "tabler:layout-list",
                    "aria-hidden": "true"
                  })
                ])) : h("", !0),
                x.value?.evidence_required ? (a(), n("span", dn, [
                  b(f(R), {
                    icon: "tabler:file-search",
                    "aria-hidden": "true"
                  })
                ])) : h("", !0)
              ])
            ])
          ], 8, Xa),
          !e.readonly && S.value ? (a(), n("span", rn, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} up`,
              disabled: e.first,
              onClick: U[2] || (U[2] = (D) => i("reorder", e.field, e.trail, -1))
            }, [
              b(f(R), { icon: "tabler:chevron-up" })
            ], 8, cn),
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} down`,
              disabled: e.last,
              onClick: U[3] || (U[3] = (D) => i("reorder", e.field, e.trail, 1))
            }, [
              b(f(R), { icon: "tabler:chevron-down" })
            ], 8, vn)
          ])) : h("", !0),
          !e.readonly && S.value ? (a(), n("div", {
            key: 3,
            class: "row-overflow",
            onKeydown: U[7] || (U[7] = ve(() => {
            }, ["stop"]))
          }, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Actions for ${e.path}`,
              "aria-haspopup": "menu",
              "aria-expanded": c.value,
              "aria-controls": f(p),
              onClick: U[4] || (U[4] = (D) => y.value.toggle(D))
            }, [
              b(f(R), { icon: "tabler:dots" })
            ], 8, mn),
            b(f(Mt), {
              id: f(p),
              ref_key: "menu",
              ref: y,
              model: w.value,
              popup: "",
              "append-to": "self",
              onShow: U[5] || (U[5] = (D) => c.value = !0),
              onHide: U[6] || (U[6] = (D) => c.value = !1)
            }, null, 8, ["id", "model"])
          ], 32)) : h("", !0)
        ], 2),
        V.value && C.value ? (a(), n("ul", pn, [
          (a(!0), n(M, null, I(e.shape.properties, (D, j) => (a(), n("li", { key: j }, [
            b(z, {
              shape: D,
              field: e.field,
              trail: [...e.trail, j],
              path: `${e.path}.${D.name || "New property"}`,
              selected: e.selected,
              readonly: e.readonly,
              first: j === 0,
              last: j === e.shape.properties.length - 1,
              onSelect: U[8] || (U[8] = (G, T) => i("select", G, T)),
              onAdd: U[9] || (U[9] = (G, T) => i("add", G, T)),
              onReorder: U[10] || (U[10] = (G, T, P) => i("reorder", G, T, P))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly", "first", "last"])
          ]))), 128)),
          e.shape.item ? (a(), n("li", fn, [
            b(z, {
              shape: e.shape.item,
              field: e.field,
              trail: [...e.trail, "item"],
              path: `${e.path}[]`,
              selected: e.selected,
              readonly: e.readonly,
              onSelect: U[11] || (U[11] = (D, j) => i("select", D, j)),
              onAdd: U[12] || (U[12] = (D, j) => i("add", D, j)),
              onReorder: U[13] || (U[13] = (D, j, G) => i("reorder", D, j, G))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly"])
          ])) : h("", !0),
          !e.readonly && e.shape.type === "object" && e.trail.length + 1 < f(Ae) ? (a(), n("li", bn, [
            t("button", {
              type: "button",
              class: "kx-btn kx-btn-ghost kx-focus-halo sm",
              "aria-label": `Add property to ${e.path}`,
              disabled: (e.shape.properties?.length ?? 0) >= 100,
              onClick: U[14] || (U[14] = (D) => i("add", e.field, e.trail))
            }, [
              b(f(R), { icon: "tabler:plus" }),
              U[15] || (U[15] = N("Add property", -1))
            ], 8, gn)
          ])) : h("", !0)
        ])) : h("", !0)
      ], 32);
    };
  }
}), yn = { class: "label-block" }, kn = {
  key: 0,
  class: "muted"
}, $n = ["config"], xn = {
  key: 2,
  class: "field-error",
  role: "alert"
}, wn = {
  key: 3,
  role: "status",
  class: "muted"
}, Vn = /* @__PURE__ */ H({
  __name: "AgentPicker",
  props: {
    value: {},
    readonly: { type: Boolean }
  },
  emits: ["select"],
  setup(e, { emit: s }) {
    const l = s, i = A(!!customElements.get("wc-agent-picker")), u = A("");
    Ue(async () => {
      if (!i.value)
        try {
          await Ze("wc-agent-picker", { timeoutMs: 8e3 }), i.value = !0;
        } catch (y) {
          u.value = y instanceof Error ? y.message : String(y);
        }
    });
    function p(y) {
      if (y.composedPath()[0] !== y.currentTarget) return;
      const c = y.detail;
      l("select", c.agent_id);
    }
    return (y, c) => (a(), n("div", yn, [
      c[0] || (c[0] = t("span", null, "Scout agent", -1)),
      e.readonly ? (a(), n("p", kn, r(e.value || "Built-in scout"), 1)) : i.value ? (a(), n("wc-agent-picker", {
        key: 1,
        config: JSON.stringify({ agent_id: e.value || "" }),
        "aria-label": "Scout agent",
        placeholder: "Choose your agent…",
        onChange: p
      }, null, 40, $n)) : u.value ? (a(), n("p", xn, "Could not load agent picker: " + r(u.value), 1)) : (a(), n("span", wn, "Loading agents…")),
      c[1] || (c[1] = t("small", null, "Leave empty to use the built-in scout.", -1))
    ]));
  }
}), Sn = ["value", "capability", "aria-labelledby"], Cn = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, En = {
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
  setup(e, { emit: s }) {
    const l = s, i = A(!!customElements.get("wc-model-picker")), u = A("");
    Ue(async () => {
      if (!i.value)
        try {
          await Ze("wc-model-picker", { timeoutMs: 8e3 }), i.value = !0;
        } catch (y) {
          u.value = y instanceof Error ? y.message : String(y);
        }
    });
    function p(y) {
      const c = y.detail;
      typeof c == "string" && l("select", c);
    }
    return (y, c) => i.value ? (a(), n("wc-model-picker", {
      key: 0,
      value: e.value,
      capability: e.capability,
      "aria-labelledby": e.labelledBy,
      onSelect: p
    }, null, 40, Sn)) : u.value ? (a(), n("p", Cn, "Could not load model picker: " + r(u.value), 1)) : (a(), n("span", En, "Loading models…"));
  }
}), qn = { class: "slider" }, Un = { class: "slider-head" }, Nn = { class: "slider-value" }, Fn = ["aria-label", "aria-valuetext", "disabled"], Mn = {
  key: 0,
  class: "slider-hints"
}, An = { key: 1 }, Ve = 1e3, te = /* @__PURE__ */ H({
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
    const s = e, l = Le(e, "modelValue"), i = F(() => s.percent ? `${Math.round(l.value * 100)}%` : `${l.value.toLocaleString()}${s.unit ? ` ${s.unit}` : ""}`), u = (c) => s.log ? Math.log(c / s.min) / Math.log(s.max / s.min) * Ve : (c - s.min) / (s.max - s.min) * Ve;
    function p(c) {
      const w = s.log ? s.min * Math.pow(s.max / s.min, c / Ve) : s.min + (s.max - s.min) * c / Ve, C = Math.round(w / s.step) * s.step;
      return Math.min(s.max, Math.max(s.min, Number(C.toFixed(4))));
    }
    const y = F({ get: () => Math.round(u(l.value)), set: (c) => {
      l.value = p(c);
    } });
    return (c, w) => (a(), n("div", qn, [
      t("div", Un, [
        t("span", null, r(e.label), 1),
        t("output", Nn, r(i.value), 1)
      ]),
      W(t("input", {
        "onUpdate:modelValue": w[0] || (w[0] = (C) => y.value = C),
        type: "range",
        min: "0",
        max: Ve,
        step: "1",
        "aria-label": e.label,
        "aria-valuetext": i.value,
        disabled: e.disabled,
        style: qe({ "--fill": `${y.value / Ve * 100}%` })
      }, null, 12, Fn), [
        [
          _,
          y.value,
          void 0,
          { number: !0 }
        ]
      ]),
      e.hints ? (a(), n("div", Mn, [
        t("span", null, r(e.hints[0]), 1),
        t("span", null, r(e.hints[1]), 1)
      ])) : h("", !0),
      e.note ? (a(), n("small", An, r(e.note), 1)) : h("", !0)
    ]));
  }
}), Rn = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, Bn = { class: "fd-track" }, Ln = { class: "fd-node" }, Pn = { class: "fd-dots" }, Tn = { class: "fd-more" }, On = { class: "fd-node goal" }, Dn = /* @__PURE__ */ H({
  __name: "ScoutDiagram",
  props: {
    rounds: {},
    confidence: {},
    extra: {}
  },
  setup(e) {
    const s = e;
    return (l, i) => (a(), n("figure", Rn, [
      t("div", Bn, [
        i[2] || (i[2] = t("span", { class: "fd-node solid" }, "Pass", -1)),
        (a(!0), n(M, null, I(Math.min(s.rounds, 8), (u) => (a(), n(M, { key: u }, [
          i[0] || (i[0] = t("span", { class: "fd-link" }, null, -1)),
          t("span", Ln, [
            t("span", null, "R" + r(u), 1),
            t("span", Pn, [
              (a(!0), n(M, null, I(Math.min(s.extra, 6), (p) => (a(), n("i", { key: p }))), 128))
            ])
          ])
        ], 64))), 128)),
        s.rounds > 8 ? (a(), n(M, { key: 0 }, [
          i[1] || (i[1] = t("span", { class: "fd-link" }, null, -1)),
          t("span", Tn, "+" + r(s.rounds - 8), 1)
        ], 64)) : h("", !0),
        i[3] || (i[3] = t("span", { class: "fd-link" }, null, -1)),
        t("span", On, "≥ " + r(Math.round(s.confidence * 100)) + "%", 1)
      ]),
      t("figcaption", null, r(s.rounds ? `One pass, then up to ${s.rounds} rounds with up to ${s.extra} new queries each, stopping as soon as confidence reaches ${Math.round(s.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
    ]));
  }
}), In = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, jn = { class: "fd-grid" }, zn = { class: "fd-node solid" }, Wn = { class: "fd-node" }, Hn = { class: "fd-node" }, Gn = { class: "fd-node goal" }, Kn = /* @__PURE__ */ H({
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
    return (i, u) => (a(), n("figure", In, [
      t("div", jn, [
        t("span", zn, [
          t("b", null, r(e.fields), 1),
          N(" field" + r(e.fields === 1 ? "" : "s"), 1),
          t("small", null, r(e.parallel) + " at a time", 1)
        ]),
        t("span", Wn, [
          t("b", null, r(e.queries), 1),
          u[0] || (u[0] = N(" queries", -1)),
          u[1] || (u[1] = t("small", null, "per field", -1))
        ]),
        t("span", Hn, [
          t("b", null, r(e.perQuery), 1),
          u[2] || (u[2] = N(" chunks", -1)),
          u[3] || (u[3] = t("small", null, "per query", -1))
        ]),
        t("span", Gn, [
          t("b", null, r(l.value), 1),
          u[4] || (u[4] = N(" chunks", -1)),
          t("small", null, r(e.queries * e.perQuery > e.cap ? `capped at ${e.cap}` : "read per field"), 1)
        ])
      ]),
      t("figcaption", null, "Each deep field gets its own queries; up to " + r(l.value) + " chunks are read for it before analysis.", 1)
    ]));
  }
}), Qn = ["disabled"], Jn = { class: "muted" }, Yn = { class: "toggle-row" }, Xn = { class: "label-block" }, Zn = { class: "toggle-row" }, _n = {
  id: "model-map",
  class: "model-role"
}, es = {
  key: 0,
  class: "chips"
}, ts = {
  key: 1,
  class: "muted"
}, ls = { class: "toggle-row" }, as = { class: "grid" }, ns = ["onUpdate:modelValue"], ss = ["onUpdate:modelValue"], os = ["onUpdate:modelValue"], is = ["onClick"], us = {
  key: 0,
  class: "muted"
}, ds = { class: "toggle-row" }, rs = { class: "label-block" }, cs = {
  id: "model-scout",
  class: "model-role"
}, vs = {
  key: 3,
  class: "muted"
}, ms = {
  key: 4,
  class: "toggle-row"
}, ps = { class: "toggle-row" }, fs = { class: "toggle-row" }, bs = { class: "label-block" }, gs = {
  id: "model-deep",
  class: "model-role"
}, hs = {
  id: "model-deep-query",
  class: "model-role"
}, ys = { class: "label-block" }, ks = {
  id: "model-extract",
  class: "model-role"
}, $s = { class: "output-list" }, xs = { class: "chip" }, ws = {
  key: 1,
  class: "muted"
}, Vs = { class: "toggle-row" }, Ss = { class: "toggle-row" }, Cs = { class: "toggle-row" }, Es = { class: "toggle-row" }, qs = {
  id: "model-verify",
  class: "model-role"
}, Us = /* @__PURE__ */ H({
  __name: "StepInspector",
  props: {
    stage: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const s = e, l = F(() => s.config.stages), i = (V) => Cl(s.stage, V), u = wl(), p = F(() => s.config.fields.filter((V) => V.strategy === "deep").length), y = F(() => s.config.fields.filter((V) => V.search_within === "sections").map((V) => V.name || "New field")), c = F(() => Et(s.config)), w = F({ get: () => l.value.extract.reads ?? "text", set: (V) => {
      l.value.extract.reads = V, V === "pages" && l.value.extract.max_pages === void 0 && (l.value.extract.max_pages = 8);
    } }), C = F({ get: () => l.value.extract.max_pages ?? 8, set: (V) => {
      l.value.extract.max_pages = V;
    } });
    function S(V) {
      l.value.verify.check_support = V, V || (l.value.verify.check_completeness = !1);
    }
    function m(V) {
      V ? l.value.scout.agent_id = V : delete l.value.scout.agent_id;
    }
    function x(V, o) {
      const d = l.value.scout.tools.filter((U) => U !== V);
      l.value.scout.tools = o ? [...d, V] : d;
    }
    return (V, o) => (a(), n("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", Jn, r(f(Vl)[e.stage]), 1),
      e.stage === "map" ? (a(), n(M, { key: 0 }, [
        t("div", Yn, [
          o[35] || (o[35] = t("span", null, "Stage enabled", -1)),
          b(Z, {
            modelValue: l.value.map.enabled,
            "onUpdate:modelValue": o[0] || (o[0] = (d) => l.value.map.enabled = d),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Xn, [
          o[36] || (o[36] = t("span", { id: "outline-label" }, "Outline", -1)),
          b(ye, {
            modelValue: l.value.map.outline,
            "onUpdate:modelValue": o[1] || (o[1] = (d) => l.value.map.outline = d),
            "labelled-by": "outline-label",
            options: [{ value: "find_or_build", label: "Use contents first" }, { value: "build", label: "Always build" }]
          }, null, 8, ["modelValue"]),
          o[37] || (o[37] = t("small", null, "The document's own headings are used when it has them; otherwise the model builds an outline.", -1))
        ]),
        t("div", Zn, [
          o[38] || (o[38] = t("span", null, [
            N("Section summaries"),
            t("small", null, "A short summary per section helps pick the right sections in long documents.")
          ], -1)),
          b(Z, {
            modelValue: l.value.map.section_summaries,
            "onUpdate:modelValue": o[2] || (o[2] = (d) => l.value.map.section_summaries = d),
            label: "Section summaries",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        o[40] || (o[40] = t("h4", null, "Models", -1)),
        t("div", _n, [
          o[39] || (o[39] = t("span", null, "Outliner", -1)),
          b(ce, {
            value: l.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: o[3] || (o[3] = (d) => l.value.map.model = d)
          }, null, 8, ["value"])
        ]),
        o[41] || (o[41] = t("h4", null, "Fields that read sections", -1)),
        y.value.length ? (a(), n("p", es, [
          (a(!0), n(M, null, I(y.value, (d) => (a(), n("span", {
            key: d,
            class: "chip primary"
          }, r(d), 1))), 128))
        ])) : (a(), n("p", ts, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : h("", !0),
      e.stage === "prefetch" ? (a(), n(M, { key: 1 }, [
        t("div", ls, [
          o[42] || (o[42] = t("span", null, "Stage enabled", -1)),
          b(Z, {
            modelValue: l.value.prefetch.enabled,
            "onUpdate:modelValue": o[4] || (o[4] = (d) => l.value.prefetch.enabled = d),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        o[46] || (o[46] = t("h4", null, "Queries", -1)),
        (a(!0), n(M, null, I(l.value.prefetch.queries, (d, U) => (a(), n("div", {
          key: U,
          class: "query-row"
        }, [
          t("div", as, [
            t("label", null, [
              o[43] || (o[43] = N("Name", -1)),
              W(t("input", {
                "onUpdate:modelValue": (z) => d.name = z,
                placeholder: "Parties"
              }, null, 8, ns), [
                [_, d.name]
              ])
            ]),
            t("label", null, [
              o[44] || (o[44] = N("Chunks", -1)),
              W(t("input", {
                "onUpdate:modelValue": (z) => d.chunks = z,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, ss), [
                [
                  _,
                  d.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          t("label", null, [
            o[45] || (o[45] = N("Query", -1)),
            W(t("textarea", {
              "onUpdate:modelValue": (z) => d.query = z,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, os), [
              [_, d.query]
            ])
          ]),
          e.readonly ? h("", !0) : (a(), n("button", {
            key: 0,
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo sm",
            onClick: (z) => l.value.prefetch.queries.splice(U, 1)
          }, "Remove query", 8, is))
        ]))), 128)),
        l.value.prefetch.queries.length ? h("", !0) : (a(), n("p", us, "No fixed queries. Field search hints still run.")),
        e.readonly ? h("", !0) : (a(), n("button", {
          key: 1,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          onClick: o[5] || (o[5] = (d) => l.value.prefetch.queries.push(f(Sl)()))
        }, "Add query"))
      ], 64)) : h("", !0),
      e.stage === "scout" ? (a(), n(M, { key: 2 }, [
        t("div", ds, [
          o[47] || (o[47] = t("span", null, "Stage enabled", -1)),
          b(Z, {
            modelValue: l.value.scout.enabled,
            "onUpdate:modelValue": o[6] || (o[6] = (d) => l.value.scout.enabled = d),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", rs, [
          o[48] || (o[48] = t("span", { id: "mode-label" }, "Mode", -1)),
          b(ye, {
            modelValue: l.value.scout.mode,
            "onUpdate:modelValue": o[7] || (o[7] = (d) => l.value.scout.mode = d),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          t("small", null, r(l.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        l.value.scout.mode === "agent" ? (a(), J(Vn, {
          key: 0,
          value: l.value.scout.agent_id,
          readonly: e.readonly,
          onSelect: m
        }, null, 8, ["value", "readonly"])) : h("", !0),
        l.value.scout.mode === "loop" ? (a(), J(Dn, {
          key: 1,
          rounds: l.value.scout.max_rounds,
          confidence: l.value.scout.target_confidence,
          extra: l.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"])) : h("", !0),
        o[53] || (o[53] = t("h4", null, "Models", -1)),
        t("div", cs, [
          o[49] || (o[49] = t("span", null, "Scout", -1)),
          b(ce, {
            value: l.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: o[8] || (o[8] = (d) => l.value.scout.model = d)
          }, null, 8, ["value"])
        ]),
        o[54] || (o[54] = t("h4", null, "Loop", -1)),
        b(te, {
          modelValue: l.value.scout.max_rounds,
          "onUpdate:modelValue": o[9] || (o[9] = (d) => l.value.scout.max_rounds = d),
          label: l.value.scout.mode === "agent" ? "Rounds" : "Follow-up rounds",
          min: i("max_rounds").min,
          max: i("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        l.value.scout.mode === "loop" ? (a(), J(te, {
          key: 2,
          modelValue: l.value.scout.target_confidence,
          "onUpdate:modelValue": o[10] || (o[10] = (d) => l.value.scout.target_confidence = d),
          label: "Stop at confidence",
          min: i("target_confidence").min,
          max: i("target_confidence").max,
          step: 0.05,
          percent: "",
          hints: ["Stop early", "Keep looking"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])) : h("", !0),
        b(te, {
          modelValue: l.value.scout.max_extra_queries,
          "onUpdate:modelValue": o[11] || (o[11] = (d) => l.value.scout.max_extra_queries = d),
          label: l.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: i("max_extra_queries").min,
          max: i("max_extra_queries").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        b(te, {
          modelValue: l.value.scout.max_tokens,
          "onUpdate:modelValue": o[12] || (o[12] = (d) => l.value.scout.max_tokens = d),
          label: "Scout output limit",
          min: i("max_tokens").min,
          max: i("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        l.value.scout.mode === "agent" ? (a(), n("p", vs, "Tool budget: " + r(l.value.scout.max_rounds * l.value.scout.max_extra_queries) + " calls.", 1)) : h("", !0),
        l.value.scout.mode === "loop" ? (a(), n("div", ms, [
          o[50] || (o[50] = t("span", null, [
            N("Drop noisy chunks"),
            t("small", null, "Chunks no field needs leave the evidence pool; chunks cited for a field always stay.")
          ], -1)),
          b(Z, {
            modelValue: l.value.scout.drop_noise,
            "onUpdate:modelValue": o[13] || (o[13] = (d) => l.value.scout.drop_noise = d),
            label: "Drop noisy chunks",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])) : h("", !0),
        t("div", ps, [
          o[51] || (o[51] = t("span", null, [
            N("Share scout notes with extraction"),
            t("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          b(Z, {
            modelValue: l.value.scout.share_notes,
            "onUpdate:modelValue": o[14] || (o[14] = (d) => l.value.scout.share_notes = d),
            label: "Share scout notes with extraction",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l.value.scout.mode === "agent" ? (a(), n(M, { key: 5 }, [
          o[52] || (o[52] = t("h4", null, "Agent tools", -1)),
          (a(!0), n(M, null, I(f(u), (d) => (a(), n("div", {
            key: d,
            class: "toggle-row"
          }, [
            t("span", null, r(f(lt)(d)), 1),
            b(Z, {
              "model-value": l.value.scout.tools.includes(d),
              label: f(lt)(d),
              disabled: e.readonly,
              "onUpdate:modelValue": (U) => x(d, U)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : h("", !0)
      ], 64)) : h("", !0),
      e.stage === "deep" ? (a(), n(M, { key: 3 }, [
        t("div", fs, [
          o[55] || (o[55] = t("span", null, "Stage enabled", -1)),
          b(Z, {
            modelValue: l.value.deep.enabled,
            "onUpdate:modelValue": o[15] || (o[15] = (d) => l.value.deep.enabled = d),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        b(Kn, {
          fields: p.value,
          parallel: l.value.deep.parallel_fields,
          queries: l.value.deep.max_queries,
          "per-query": l.value.deep.chunks_per_query,
          cap: l.value.deep.chunk_cap
        }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"]),
        t("div", bs, [
          o[56] || (o[56] = t("span", { id: "read-label" }, "Reads", -1)),
          b(ye, {
            modelValue: l.value.deep.read,
            "onUpdate:modelValue": o[16] || (o[16] = (d) => l.value.deep.read = d),
            "labelled-by": "read-label",
            options: [{ value: "chunks", label: "Retrieved chunks" }, { value: "sections", label: "Whole sections" }]
          }, null, 8, ["modelValue"]),
          o[57] || (o[57] = t("small", null, "Whole sections suit clauses that span many passages; long sections fall back to chunks.", -1))
        ]),
        o[60] || (o[60] = t("h4", null, "Models", -1)),
        t("div", gs, [
          o[58] || (o[58] = t("span", null, "Analysis", -1)),
          b(ce, {
            value: l.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: o[17] || (o[17] = (d) => l.value.deep.model = d)
          }, null, 8, ["value"])
        ]),
        t("div", hs, [
          o[59] || (o[59] = t("span", null, "Query writer", -1)),
          b(ce, {
            value: l.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: o[18] || (o[18] = (d) => l.value.deep.query_model = d)
          }, null, 8, ["value"])
        ]),
        o[61] || (o[61] = t("h4", null, "Reach", -1)),
        b(te, {
          modelValue: l.value.deep.parallel_fields,
          "onUpdate:modelValue": o[19] || (o[19] = (d) => l.value.deep.parallel_fields = d),
          label: "Fields at a time",
          min: i("parallel_fields").min,
          max: i("parallel_fields").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(te, {
          modelValue: l.value.deep.max_queries,
          "onUpdate:modelValue": o[20] || (o[20] = (d) => l.value.deep.max_queries = d),
          label: "Queries per field",
          min: i("max_queries").min,
          max: i("max_queries").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(te, {
          modelValue: l.value.deep.chunks_per_query,
          "onUpdate:modelValue": o[21] || (o[21] = (d) => l.value.deep.chunks_per_query = d),
          label: "Chunks per query",
          min: i("chunks_per_query").min,
          max: i("chunks_per_query").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(te, {
          modelValue: l.value.deep.chunk_cap,
          "onUpdate:modelValue": o[22] || (o[22] = (d) => l.value.deep.chunk_cap = d),
          label: "Chunk cap per field",
          min: i("chunk_cap").min,
          max: i("chunk_cap").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(te, {
          modelValue: l.value.deep.min_similarity,
          "onUpdate:modelValue": o[23] || (o[23] = (d) => l.value.deep.min_similarity = d),
          label: "Minimum similarity",
          min: i("min_similarity").min,
          max: i("min_similarity").max,
          step: 0.05,
          percent: "",
          hints: ["Loose", "Strict"],
          note: "Chunks less similar than this are skipped.",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        o[62] || (o[62] = t("h4", null, "Temperature", -1)),
        b(te, {
          modelValue: l.value.deep.query_temperature,
          "onUpdate:modelValue": o[24] || (o[24] = (d) => l.value.deep.query_temperature = d),
          label: "Query writing",
          min: i("query_temperature").min,
          max: i("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(te, {
          modelValue: l.value.deep.analysis_temperature,
          "onUpdate:modelValue": o[25] || (o[25] = (d) => l.value.deep.analysis_temperature = d),
          label: "Analysis",
          min: i("analysis_temperature").min,
          max: i("analysis_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : h("", !0),
      e.stage === "extract" ? (a(), n(M, { key: 4 }, [
        t("div", ys, [
          o[63] || (o[63] = t("span", { id: "extract-reads-label" }, "Read values from", -1)),
          b(ye, {
            modelValue: w.value,
            "onUpdate:modelValue": o[26] || (o[26] = (d) => w.value = d),
            "labelled-by": "extract-reads-label",
            name: "Read values from",
            options: [{ value: "text", label: "Text" }, { value: "pages", label: "Page images" }],
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        w.value === "pages" ? (a(), n(M, { key: 0 }, [
          o[64] || (o[64] = t("p", { class: "muted" }, "Extraction and visual support need models with vision. Text retrieval selects pages; section boundaries that share a page are unsupported.", -1)),
          b(te, {
            modelValue: C.value,
            "onUpdate:modelValue": o[27] || (o[27] = (d) => C.value = d),
            label: "Page images per call",
            min: i("max_pages").min,
            max: i("max_pages").max,
            disabled: e.readonly,
            note: "The context budget can admit fewer pages."
          }, null, 8, ["modelValue", "min", "max", "disabled"])
        ], 64)) : h("", !0),
        o[66] || (o[66] = t("h4", null, "Models", -1)),
        t("div", ks, [
          o[65] || (o[65] = t("span", null, "Extraction", -1)),
          b(ce, {
            value: l.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: o[28] || (o[28] = (d) => l.value.extract.model = d)
          }, null, 8, ["value"])
        ]),
        o[67] || (o[67] = t("h4", null, "Field groups", -1)),
        t("ul", $s, [
          (a(!0), n(M, null, I(c.value, (d) => (a(), n("li", {
            key: d.name
          }, [
            t("span", null, r(d.name), 1),
            t("span", xs, r(d.fields.length) + " field" + r(d.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        c.value.length ? h("", !0) : (a(), n("p", ws, "No fields yet.")),
        b(te, {
          modelValue: l.value.extract.max_fields_per_call,
          "onUpdate:modelValue": o[29] || (o[29] = (d) => l.value.extract.max_fields_per_call = d),
          label: "Fields per call",
          min: i("max_fields_per_call").min,
          max: i("max_fields_per_call").max,
          disabled: e.readonly,
          note: `${f(yt)(e.config)} extraction call${f(yt)(e.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        b(te, {
          modelValue: l.value.extract.max_output_tokens,
          "onUpdate:modelValue": o[30] || (o[30] = (d) => l.value.extract.max_output_tokens = d),
          label: "Output limit",
          min: i("max_output_tokens").min,
          max: i("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : h("", !0),
      e.stage === "verify" ? (a(), n(M, { key: 5 }, [
        t("div", Vs, [
          o[68] || (o[68] = t("span", null, "Stage enabled", -1)),
          b(Z, {
            modelValue: l.value.verify.enabled,
            "onUpdate:modelValue": o[31] || (o[31] = (d) => l.value.verify.enabled = d),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Ss, [
          t("span", null, [
            o[69] || (o[69] = N("Quotes exist", -1)),
            t("small", null, r(w.value === "pages" ? "Text agreement is informational; visual support determines verification." : "Each quote is matched against the document text. No model call."), 1)
          ]),
          b(Z, {
            modelValue: l.value.verify.check_quotes,
            "onUpdate:modelValue": o[32] || (o[32] = (d) => l.value.verify.check_quotes = d),
            label: "Quotes exist",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Cs, [
          t("span", null, [
            o[70] || (o[70] = N("Quotes support values", -1)),
            t("small", null, r(w.value === "pages" ? "A vision model checks the quote and value against physical page images." : "A model confirms each quote supports its value."), 1)
          ]),
          b(Z, {
            "model-value": l.value.verify.check_support,
            "onUpdate:modelValue": S,
            label: "Quotes support values",
            disabled: e.readonly
          }, null, 8, ["model-value", "disabled"])
        ]),
        l.value.verify.check_support ? (a(), n(M, { key: 0 }, [
          t("div", Es, [
            o[71] || (o[71] = t("span", null, [
              N("Check completeness"),
              t("small", null, "Check the requested text and lists against additional source passages. Adds input tokens; completeness can remain unknown.")
            ], -1)),
            b(Z, {
              "model-value": l.value.verify.check_completeness === !0,
              "onUpdate:modelValue": o[33] || (o[33] = (d) => l.value.verify.check_completeness = d),
              label: "Check completeness",
              disabled: e.readonly
            }, null, 8, ["model-value", "disabled"])
          ]),
          o[73] || (o[73] = t("h4", null, "Models", -1)),
          t("div", qs, [
            o[72] || (o[72] = t("span", null, "Checker", -1)),
            b(ce, {
              value: l.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: o[34] || (o[34] = (d) => l.value.verify.model = d)
            }, null, 8, ["value"])
          ])
        ], 64)) : h("", !0)
      ], 64)) : h("", !0)
    ], 8, Qn));
  }
}), Ns = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, Fs = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, Ms = ["x", "y", "width"], As = ["x", "width"], Rs = /* @__PURE__ */ H({
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
    return (u, p) => (a(), n("figure", Ns, [
      (a(), n("svg", Fs, [
        (a(!0), n(M, null, I(i.value, (y, c) => (a(), n("rect", {
          key: c,
          x: y.x,
          y: c % 2 ? 14 : 4,
          width: y.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, Ms))), 128)),
        (a(), n(M, null, I([1, 2], (y) => t("rect", {
          key: "o" + y,
          x: i.value[y].x,
          y: 4,
          width: i.value[y - 1].x + i.value[y - 1].w - i.value[y].x,
          height: "24",
          class: "shared"
        }, null, 8, As)), 64))
      ])),
      t("figcaption", null, r(e.size.toLocaleString()) + " tokens per chunk · " + r(e.overlap.toLocaleString()) + " shared with the next (" + r(Math.round(l.value * 100)) + "%)", 1)
    ]));
  }
}), Bs = ["disabled"], Ls = { class: "muted" }, Ps = { class: "toggle-row" }, Ts = { class: "toggle-row" }, Os = { class: "label-block" }, Ds = {
  key: 0,
  id: "context-model",
  class: "model-role"
}, Is = { class: "label-block" }, js = {
  id: "embedding-model",
  class: "model-role"
}, zs = { class: "toggle-row" }, Ws = {
  key: 1,
  id: "highlighter-model",
  class: "model-role"
}, Hs = /* @__PURE__ */ H({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const s = e, l = F(() => s.config.retrieval), i = F({ get: () => s.config.retention ?? "", set: (S) => {
      S.trim() ? s.config.retention = S.trim() : delete s.config.retention;
    } }), u = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], p = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], y = et("chunk_size"), c = et("overlap"), w = et("section_budget"), C = F(() => Math.min(c.max, l.value.chunk_size - 50));
    return (S, m) => (a(), n("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", Ls, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + r(e.retention) + ".", 1),
      t("label", null, [
        m[12] || (m[12] = N("Retention window", -1)),
        W(t("input", {
          "onUpdate:modelValue": m[0] || (m[0] = (x) => i.value = x),
          "aria-label": "Retention window",
          placeholder: "Global setting"
        }, null, 512), [
          [_, i.value]
        ]),
        m[13] || (m[13] = t("small", null, "Duration for new processed documents and runs, for example 24h. Leave empty to use the global Docscout setting. Existing records keep their expiry.", -1))
      ]),
      m[22] || (m[22] = t("h4", null, "Chunks", -1)),
      b(Rs, {
        size: l.value.chunk_size,
        overlap: l.value.overlap
      }, null, 8, ["size", "overlap"]),
      b(te, {
        modelValue: l.value.chunk_size,
        "onUpdate:modelValue": m[1] || (m[1] = (x) => l.value.chunk_size = x),
        label: "Chunk size",
        min: f(y).min,
        max: f(y).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      b(te, {
        modelValue: l.value.overlap,
        "onUpdate:modelValue": m[2] || (m[2] = (x) => l.value.overlap = x),
        label: "Overlap",
        min: f(c).min,
        max: C.value,
        step: 10,
        unit: "tokens",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      t("div", Ps, [
        m[14] || (m[14] = t("span", null, [
          N("Split by headings"),
          t("small", null, "A chunk never crosses a heading.")
        ], -1)),
        b(Z, {
          modelValue: l.value.split_headings,
          "onUpdate:modelValue": m[3] || (m[3] = (x) => l.value.split_headings = x),
          label: "Split by headings",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t("div", Ts, [
        m[15] || (m[15] = t("span", null, [
          N("Keep tables whole"),
          t("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        b(Z, {
          modelValue: l.value.keep_tables,
          "onUpdate:modelValue": m[4] || (m[4] = (x) => l.value.keep_tables = x),
          label: "Keep tables whole",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      b(te, {
        modelValue: l.value.section_budget,
        "onUpdate:modelValue": m[5] || (m[5] = (x) => l.value.section_budget = x),
        label: "Section budget",
        min: f(w).min,
        max: f(w).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      m[23] || (m[23] = t("h4", null, "Context", -1)),
      t("div", Os, [
        m[16] || (m[16] = t("span", { id: "context-label" }, "Chunk context", -1)),
        b(ye, {
          modelValue: l.value.context,
          "onUpdate:modelValue": m[6] || (m[6] = (x) => l.value.context = x),
          "labelled-by": "context-label",
          options: p
        }, null, 8, ["modelValue"]),
        t("small", null, r(p.find((x) => x.value === l.value.context)?.note), 1)
      ]),
      l.value.context === "generated" ? (a(), n("div", Ds, [
        m[17] || (m[17] = t("span", null, "Context writer", -1)),
        b(ce, {
          value: l.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: m[7] || (m[7] = (x) => l.value.context_model = x)
        }, null, 8, ["value"])
      ])) : h("", !0),
      m[24] || (m[24] = t("h4", null, "Search", -1)),
      t("div", Is, [
        m[18] || (m[18] = t("span", { id: "mode-label" }, "Search mode", -1)),
        b(ye, {
          modelValue: l.value.search_mode,
          "onUpdate:modelValue": m[8] || (m[8] = (x) => l.value.search_mode = x),
          "labelled-by": "mode-label",
          options: u
        }, null, 8, ["modelValue"]),
        t("small", null, r(u.find((x) => x.value === l.value.search_mode)?.note), 1)
      ]),
      m[25] || (m[25] = t("h4", null, "Models", -1)),
      t("div", js, [
        m[19] || (m[19] = t("span", null, "Embedding", -1)),
        b(ce, {
          value: l.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: m[9] || (m[9] = (x) => l.value.embedding_model = x)
        }, null, 8, ["value"])
      ]),
      t("div", zs, [
        m[20] || (m[20] = t("span", null, [
          N("Highlighter"),
          t("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        b(Z, {
          modelValue: l.value.highlighter,
          "onUpdate:modelValue": m[10] || (m[10] = (x) => l.value.highlighter = x),
          label: "Highlighter",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      l.value.highlighter ? (a(), n("div", Ws, [
        m[21] || (m[21] = t("span", null, "Highlighter", -1)),
        b(ce, {
          value: l.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: m[11] || (m[11] = (x) => l.value.highlighter_model = x)
        }, null, 8, ["value"])
      ])) : h("", !0)
    ], 8, Bs));
  }
}), Gs = ["inert"], Ks = { class: "canvas-inner" }, Qs = {
  class: "block fields-block",
  "aria-labelledby": "fields-head"
}, Js = { class: "block-head" }, Ys = ["aria-expanded"], Xs = { class: "count" }, Zs = {
  key: 0,
  class: "block-peek"
}, _s = {
  key: 1,
  class: "field-add-actions push"
}, eo = ["aria-expanded", "aria-controls", "disabled"], to = ["disabled"], lo = {
  id: "fields-body",
  class: "block-body"
}, ao = {
  key: 0,
  class: "block-empty"
}, no = { class: "field-tree" }, so = ["id"], oo = {
  class: "tree-indent",
  "aria-hidden": "true"
}, io = {
  class: "shape-preview",
  open: ""
}, uo = { class: "kx-focus-outline" }, ro = {
  key: 0,
  class: "field-error",
  role: "alert"
}, co = {
  key: 1,
  class: "preview-grid"
}, vo = { "aria-label": "Output shape" }, mo = { "aria-label": "Example output" }, po = {
  class: "block",
  "aria-labelledby": "flow-head"
}, fo = { class: "block-head" }, bo = ["aria-expanded"], go = { class: "count" }, ho = {
  key: 0,
  class: "block-peek"
}, yo = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, ko = { class: "node-icon" }, $o = { class: "node-main" }, xo = { class: "node-summary" }, wo = { class: "node-side" }, Vo = { class: "chip model" }, So = { class: "branches" }, Co = { class: "branch" }, Eo = { class: "branch" }, qo = { class: "node-icon" }, Uo = { class: "node-main" }, No = { class: "node-summary" }, Fo = ["aria-labelledby", "role", "aria-modal"], Mo = ["aria-valuenow"], Ao = { class: "side-panel-head" }, Ro = { class: "side-panel-icon" }, Bo = ["id"], Lo = ["aria-label", "title"], Po = { class: "node-breadcrumb mono" }, To = {
  key: 0,
  class: "move-node",
  "aria-label": "Move node"
}, Oo = {
  key: 0,
  value: ""
}, Do = {
  key: 1,
  value: "",
  disabled: ""
}, Io = ["value"], jo = ["disabled"], zo = ["disabled"], Wo = {
  key: 4,
  class: "inspector-form"
}, Ho = { class: "output-list" }, Go = { class: "mono" }, Ko = { class: "chip" }, Qo = { class: "rail-label" }, tt = 400, We = 320, Jo = /* @__PURE__ */ H({
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
    const s = e, l = Le(e, "title"), i = Le(e, "description"), u = A({ kind: "document" });
    function p(k, v) {
      try {
        const q = localStorage.getItem(`docscout.${k}`);
        return q === null ? v : q === "1";
      } catch {
        return v;
      }
    }
    function y(k, v) {
      try {
        localStorage.setItem(`docscout.${k}`, v ? "1" : "0");
      } catch {
      }
    }
    const c = A(p("panel", !0)), w = A(p("fields", !0)), C = A(p("flow", !0));
    function S() {
      try {
        const k = Number(localStorage.getItem("docscout.panelWidth"));
        return k >= We ? k : tt;
      } catch {
        return tt;
      }
    }
    const m = A(S()), x = () => {
      const k = P.value?.clientWidth;
      return k ? Math.max(We, k - 420) : Number.POSITIVE_INFINITY;
    };
    function V(k, v = !0) {
      if (m.value = Math.round(Math.min(x(), Math.max(We, k))), v)
        try {
          localStorage.setItem("docscout.panelWidth", String(m.value));
        } catch {
        }
    }
    const o = A(!1);
    function d(k) {
      const v = k.currentTarget, q = k.clientX, Y = m.value;
      v.setPointerCapture(k.pointerId), o.value = !0;
      const X = (ee) => V(Y + (q - ee.clientX), !1), ae = () => {
        o.value = !1, V(m.value), v.removeEventListener("pointermove", X), v.removeEventListener("pointerup", ae);
      };
      v.addEventListener("pointermove", X), v.addEventListener("pointerup", ae);
    }
    function U(k) {
      k.key === "ArrowLeft" ? (V(m.value + 24), k.preventDefault()) : k.key === "ArrowRight" && (V(m.value - 24), k.preventDefault());
    }
    let z = null;
    const D = A(), j = pe();
    async function G(k) {
      if (c.value = k, !L.value) {
        y("panel", k);
        return;
      }
      if (!k && z) {
        const v = z;
        z = null, await Ce(), v.focus();
      }
    }
    function T(k) {
      const v = k === "fields" ? w : C;
      v.value = !v.value, y(k, v.value);
    }
    const P = A(), L = A(!1);
    let ue;
    Ue(() => {
      ue = new ResizeObserver(([k]) => {
        const v = L.value;
        L.value = k.contentRect.width < 1e3, L.value && !v && (c.value = !1), !L.value && v && (c.value = p("panel", !0));
      }), P.value && ue.observe(P.value);
    }), Ct(() => ue?.disconnect());
    const ke = A();
    fe(u, async () => {
      await Ce(), ke.value && (ke.value.scrollTop = 0);
    });
    async function le(k) {
      L.value && !c.value && (z = P.value?.getRootNode()?.activeElement), u.value = k, c.value = !0, L.value && (await Ce(), D.value?.focus());
    }
    const oe = (k) => JSON.stringify(k) === JSON.stringify(u.value), be = F(() => u.value.kind === "field" ? s.config.fields[u.value.index] : void 0), E = F(() => Je(s.config.fields)), g = F(() => u.value.kind === "field" ? E.value.find((k) => k.key === ie(u.value.index, u.value.trail ?? [])) : void 0), $ = F(() => g.value?.key ?? ""), B = F(() => {
      const k = g.value;
      return !k || k.trail.at(-1) === "item" || !k.trail.length ? void 0 : E.value.find((q) => q.key === ie(k.field, k.trail.slice(0, -1))).shape.properties.filter((q) => q !== k.shape).map((q) => q.name);
    }), O = A("");
    fe($, () => {
      O.value = "";
    });
    const Ne = F(() => g.value ? Xl(s.config.fields, g.value) : []), ge = F(() => {
      const k = El(s.config.fields.map(K));
      return k ? `Group path collides with field ${k}.` : "";
    }), Oe = F(() => ge.value ? null : St(s.config.fields)), Ot = F(() => ge.value ? null : St(s.config.fields, !0)), it = F(() => {
      const k = u.value;
      return k.kind === "stage" ? $e[k.stage] : k.kind === "field" ? g.value?.trail.length ? g.value.path : be.value?.name || "New field" : k.kind === "document" ? "Read document" : k.kind === "output" ? "Output" : "Details";
    }), Dt = F(() => {
      const k = u.value;
      return k.kind === "stage" ? ot[k.stage] : k.kind === "field" ? "tabler:forms" : k.kind === "document" ? "tabler:file-text" : k.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), It = F(() => s.config.fields.filter((k, v) => !(u.value.kind === "field" && u.value.index === v)).map(K)), jt = F(() => s.config.stages.deep.enabled), zt = F(() => s.config.stages.map.enabled), Wt = F(() => Pe(s.config.fields.map(K))), De = A(!1), ut = A(), dt = pe();
    function Ht(k, v) {
      for (const q of s.config.fields) (q.group === k || q.group.startsWith(k + ".")) && (q.group = v + q.group.slice(k.length));
    }
    const Gt = (k) => 320 - Math.max(0, ...s.config.fields.filter((v) => v.group === k || v.group.startsWith(k + ".")).map((v) => v.group.length - k.length));
    function Kt() {
      w.value = !0, De.value = !0;
    }
    async function rt() {
      De.value = !1, await Ce(), ut.value.focus();
    }
    function Qt(k) {
      s.config.fields.push({ ...at(), group: k }), rt();
    }
    const Jt = F(() => [...new Set(s.config.fields.map((k) => k.group.trim()).filter(Boolean))]), Yt = (k) => Ft(s.config.fields[k], s.config.fields.filter((v, q) => q !== k).map(K)), ct = ["map", "prefetch", "scout", "deep", "extract", "verify"], Xt = F(() => ct.filter((k) => Qe(s.config, k)).map((k) => $e[k]).join(" · ")), Zt = F(() => s.config.fields.map((k) => k.name || "New field").join(", ")), _t = F(() => ct.filter((k) => Qe(s.config, k)).length), xe = (k) => s.result?.trace.find((v) => v.kind === k);
    function vt(k = "") {
      s.config.fields.push({ ...at(), group: k }), w.value = !0, le({ kind: "field", index: s.config.fields.length - 1 });
    }
    function el(k) {
      s.config.fields.splice(k, 1), u.value = { kind: "document" };
    }
    function re(k, v = []) {
      le({ kind: "field", index: k, ...v.length ? { trail: v } : {} });
    }
    function mt(k, v) {
      const q = E.value.find((Y) => Y.key === ie(k, v));
      q.shape.properties.push(Nt()), re(k, [...v, q.shape.properties.length - 1]);
    }
    function tl() {
      const k = g.value;
      if (!k.trail.length) {
        el(k.field);
        return;
      }
      const v = E.value.find((q) => q.key === ie(k.field, k.trail.slice(0, -1)));
      v.shape.properties.splice(k.trail.at(-1), 1), re(v.field, v.trail);
    }
    function ll(k, v, q) {
      if (v.length) {
        const X = E.value.find((ne) => ne.key === ie(k, v.slice(0, -1))).shape.properties, ae = v.at(-1), ee = ae + q;
        if (ee < 0 || ee >= X.length) return;
        [X[ae], X[ee]] = [X[ee], X[ae]], re(k, [...v.slice(0, -1), ee]);
      } else {
        const Y = s.config.fields.map((ee, ne) => ee.group === s.config.fields[k].group ? ne : -1).filter((ee) => ee >= 0), X = Y[Y.indexOf(k) + q];
        if (X === void 0) return;
        const ae = s.config.fields;
        [ae[k], ae[X]] = [ae[X], ae[k]], re(X);
      }
    }
    function al() {
      const k = g.value, v = Ne.value.find((Y) => Y.key === O.value), q = Zl(s.config.fields, k, v);
      re(q.field, q.trail);
    }
    function nl(k) {
      const v = g.value?.shape;
      s.config.fields.splice(0, s.config.fields.length, ...s.config.fields.filter((Y) => Y.group !== k && !Y.group.startsWith(k + ".")));
      const q = E.value.find((Y) => Y.shape === v);
      q ? re(q.field, q.trail) : u.value = { kind: "document" };
    }
    function sl(k, v) {
      const q = k.split(".").slice(0, -1).join(".");
      let X = Pe(s.config.fields.map(K));
      for (const se of q.split(".").filter(Boolean)) X = X.children.find((dl) => dl.name === se);
      const ae = X.children.findIndex((se) => se.path === k), ee = X.children[ae + v]?.path;
      if (!ee) return;
      const ne = s.config.fields.filter((se) => se.group === k || se.group.startsWith(k + ".")), Ie = s.config.fields.filter((se) => se.group === ee || se.group.startsWith(ee + ".")), Fe = s.config.fields, il = Math.min(Fe.indexOf(ne[0]), Fe.indexOf(Ie[0])), ft = Fe.filter((se) => !ne.includes(se) && !Ie.includes(se));
      ft.splice(il, 0, ...v > 0 ? [...Ie, ...ne] : [...ne, ...Ie]);
      const ul = g.value?.shape;
      Fe.splice(0, Fe.length, ...ft);
      const _e = E.value.find((se) => se.shape === ul);
      _e && re(_e.field, _e.trail);
    }
    const ol = (k) => k.type === "list" ? `list of ${k.item?.type}` : k.type, pt = F({ get: () => s.config.tags.join(", "), set: (k) => {
      s.config.tags = [...new Set(k.split(",").map((v) => v.trim()).filter(Boolean))];
    } });
    return (k, v) => (a(), n("div", {
      ref_key: "root",
      ref: P,
      class: Q(["builder", { narrow: L.value, "panel-open": c.value, resizing: o.value }])
    }, [
      t("div", {
        class: "canvas",
        inert: L.value && c.value
      }, [
        t("div", Ks, [
          t("section", Qs, [
            t("header", Js, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": w.value,
                "aria-controls": "fields-body",
                onClick: v[0] || (v[0] = (q) => T("fields"))
              }, [
                b(f(R), {
                  icon: w.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                v[23] || (v[23] = t("h2", { id: "fields-head" }, "Fields", -1)),
                t("span", Xs, r(e.config.fields.length), 1)
              ], 8, Ys),
              !w.value && e.config.fields.length ? (a(), n("span", Zs, r(Zt.value), 1)) : h("", !0),
              e.readonly ? h("", !0) : (a(), n("div", _s, [
                t("button", {
                  ref_key: "addGroupButton",
                  ref: ut,
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  "aria-label": "Add group",
                  "aria-expanded": De.value,
                  "aria-controls": f(dt),
                  disabled: e.config.fields.length >= 100,
                  onClick: Kt
                }, [
                  b(f(R), { icon: "tabler:folder-plus" }),
                  v[24] || (v[24] = N("Add group", -1))
                ], 8, eo),
                t("button", {
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  disabled: e.config.fields.length >= 100,
                  onClick: v[1] || (v[1] = (q) => vt())
                }, [
                  b(f(R), { icon: "tabler:plus" }),
                  v[25] || (v[25] = N("Add field", -1))
                ], 8, to)
              ]))
            ]),
            W(t("div", lo, [
              e.config.fields.length ? h("", !0) : (a(), n("p", ao, "Add the values to pull from each document.")),
              t("div", no, [
                De.value && !e.readonly ? (a(), n("div", {
                  key: 0,
                  id: f(dt),
                  class: "group-create-row"
                }, [
                  t("span", oo, [
                    b(f(R), { icon: "tabler:folder-plus" })
                  ]),
                  b(Rt, {
                    "input-label": "New group path",
                    "save-label": "Create group",
                    "cancel-label": "Cancel group creation",
                    onSave: Qt,
                    onCancel: rt
                  })
                ], 8, so)) : h("", !0),
                b(Re, { node: Wt.value }, {
                  header: me(({ path: q, label: Y, count: X, first: ae, last: ee }) => [
                    b(Qa, {
                      path: q,
                      name: Y,
                      count: X,
                      first: ae,
                      last: ee,
                      "max-length": Gt(q),
                      "can-add": e.config.fields.length < 100,
                      readonly: e.readonly,
                      onRename: (ne) => Ht(q, ne),
                      onAdd: (ne) => vt(q),
                      onReorder: (ne) => sl(q, ne),
                      onRemove: (ne) => nl(q)
                    }, null, 8, ["path", "name", "count", "first", "last", "max-length", "can-add", "readonly", "onRename", "onAdd", "onReorder", "onRemove"])
                  ]),
                  default: me(({ index: q }) => [
                    b(hn, {
                      shape: e.config.fields[q],
                      field: q,
                      trail: [],
                      path: f(K)(e.config.fields[q]) || "New field",
                      selected: $.value,
                      readonly: e.readonly,
                      error: Yt(q),
                      first: !e.config.fields.slice(0, q).some((Y) => Y.group === e.config.fields[q].group),
                      last: !e.config.fields.slice(q + 1).some((Y) => Y.group === e.config.fields[q].group),
                      onSelect: re,
                      onAdd: mt,
                      onReorder: ll
                    }, null, 8, ["shape", "field", "path", "selected", "readonly", "error", "first", "last"])
                  ]),
                  _: 1
                }, 8, ["node"])
              ]),
              t("details", io, [
                t("summary", uo, [
                  b(f(R), { icon: "tabler:braces" }),
                  v[26] || (v[26] = N("Output preview", -1))
                ]),
                ge.value ? (a(), n("p", ro, r(ge.value), 1)) : (a(), n("div", co, [
                  t("div", null, [
                    v[27] || (v[27] = t("h3", null, "Output shape", -1)),
                    t("pre", vo, r(JSON.stringify(Oe.value, null, 2)), 1)
                  ]),
                  t("div", null, [
                    v[28] || (v[28] = t("h3", null, "Example value", -1)),
                    t("pre", mo, r(JSON.stringify(Ot.value, null, 2)), 1)
                  ])
                ])),
                v[29] || (v[29] = t("small", null, "Example values illustrate the shape; extracted values come from your document.", -1))
              ])
            ], 512), [
              [Ke, w.value]
            ])
          ]),
          t("section", po, [
            t("header", fo, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": C.value,
                "aria-controls": "flow-body",
                onClick: v[2] || (v[2] = (q) => T("flow"))
              }, [
                b(f(R), {
                  icon: C.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                v[30] || (v[30] = t("h2", { id: "flow-head" }, "Flow", -1)),
                t("span", go, r(_t.value) + " of 6", 1)
              ], 8, bo),
              C.value ? h("", !0) : (a(), n("span", ho, r(Xt.value), 1)),
              t("button", {
                type: "button",
                class: Q(["kx-btn kx-btn-ghost kx-focus-halo sm push", { on: oe({ kind: "details" }) }]),
                onClick: v[3] || (v[3] = (q) => le({ kind: "details" }))
              }, [
                b(f(R), { icon: "tabler:info-circle" }),
                v[31] || (v[31] = N("Details", -1))
              ], 2)
            ]),
            W(t("div", yo, [
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "document" }) }]),
                onClick: v[4] || (v[4] = (q) => le({ kind: "document" }))
              }, [
                t("span", ko, [
                  b(f(R), { icon: "tabler:file-text" })
                ]),
                t("span", $o, [
                  v[32] || (v[32] = t("span", { class: "node-title" }, "Read document", -1)),
                  t("span", xo, r(f(ql)(e.config.retrieval)), 1)
                ]),
                t("span", wo, [
                  t("span", Vo, r(f(qt)(e.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              v[37] || (v[37] = t("div", { class: "connector" }, null, -1)),
              b(we, {
                stage: "map",
                config: e.config,
                active: oe({ kind: "stage", stage: "map" }),
                trace: xe("map"),
                readonly: e.readonly,
                onSelect: v[5] || (v[5] = (q) => le({ kind: "stage", stage: "map" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[38] || (v[38] = t("div", {
                class: "fork",
                "aria-hidden": "true"
              }, [
                t("span")
              ], -1)),
              t("div", So, [
                t("div", Co, [
                  v[33] || (v[33] = t("span", { class: "branch-label" }, "Evidence", -1)),
                  b(we, {
                    stage: "prefetch",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "prefetch" }),
                    trace: xe("prefetch"),
                    readonly: e.readonly,
                    onSelect: v[6] || (v[6] = (q) => le({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  v[34] || (v[34] = t("div", { class: "connector" }, null, -1)),
                  b(we, {
                    stage: "scout",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "scout" }),
                    trace: xe("scout"),
                    readonly: e.readonly,
                    onSelect: v[7] || (v[7] = (q) => le({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                t("div", Eo, [
                  v[35] || (v[35] = t("span", { class: "branch-label" }, "Deep fields", -1)),
                  b(we, {
                    stage: "deep",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "deep" }),
                    trace: xe("deep"),
                    readonly: e.readonly,
                    onSelect: v[8] || (v[8] = (q) => le({ kind: "stage", stage: "deep" }))
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
                onSelect: v[9] || (v[9] = (q) => le({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[40] || (v[40] = t("div", { class: "connector" }, null, -1)),
              b(we, {
                stage: "verify",
                config: e.config,
                active: oe({ kind: "stage", stage: "verify" }),
                trace: xe("verify"),
                readonly: e.readonly,
                onSelect: v[10] || (v[10] = (q) => le({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[41] || (v[41] = t("div", { class: "connector" }, null, -1)),
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "output" }) }]),
                onClick: v[11] || (v[11] = (q) => le({ kind: "output" }))
              }, [
                t("span", qo, [
                  b(f(R), { icon: "tabler:braces" })
                ]),
                t("span", Uo, [
                  v[36] || (v[36] = t("span", { class: "node-title" }, "Output", -1)),
                  t("span", No, r(e.config.fields.length ? `${e.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [Ke, C.value]
            ])
          ])
        ])
      ], 8, Gs),
      L.value && c.value ? (a(), n("div", {
        key: 0,
        class: "scrim",
        onClick: v[12] || (v[12] = (q) => G(!1))
      })) : h("", !0),
      c.value ? W((a(), n("aside", {
        key: String(L.value),
        class: "side-panel",
        "aria-labelledby": f(j),
        role: L.value ? "dialog" : void 0,
        "aria-modal": L.value ? "true" : void 0,
        style: qe(L.value ? void 0 : { width: `${m.value}px` }),
        onKeydown: v[21] || (v[21] = Ee((q) => L.value && G(!1), ["esc"]))
      }, [
        L.value ? h("", !0) : (a(), n("div", {
          key: 0,
          class: Q(["resizer kx-focus-outline", { active: o.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": m.value,
          "aria-valuemin": We,
          onPointerdown: ve(d, ["prevent"]),
          onKeydown: U,
          onDblclick: v[13] || (v[13] = (q) => V(tt))
        }, null, 42, Mo)),
        t("header", Ao, [
          t("span", Ro, [
            b(f(R), { icon: Dt.value }, null, 8, ["icon"])
          ]),
          t("h2", { id: f(j) }, r(it.value), 9, Bo),
          t("button", {
            ref_key: "closeButton",
            ref: D,
            type: "button",
            class: "kx-iconbtn kx-focus-outline push",
            "aria-label": L.value ? "Close panel" : "Collapse panel",
            title: L.value ? "Close panel" : "Collapse panel",
            onClick: v[14] || (v[14] = (q) => G(!1))
          }, [
            b(f(R), {
              icon: L.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ], 8, Lo)
        ]),
        t("div", {
          ref_key: "panelBody",
          ref: ke,
          class: "side-panel-body"
        }, [
          u.value.kind === "document" ? (a(), J(Hs, {
            key: 0,
            config: e.config,
            retention: e.retention,
            readonly: e.readonly
          }, null, 8, ["config", "retention", "readonly"])) : u.value.kind === "stage" ? (a(), J(Us, {
            key: 1,
            stage: u.value.stage,
            config: e.config,
            readonly: e.readonly
          }, null, 8, ["stage", "config", "readonly"])) : u.value.kind === "field" && be.value && g.value ? (a(), n(M, { key: 2 }, [
            t("p", Po, r(g.value.path), 1),
            b(Ua, {
              field: be.value,
              shape: g.value.shape,
              depth: g.value.depth,
              "sibling-names": B.value,
              "other-names": It.value,
              groups: Jt.value,
              "deep-enabled": jt.value,
              "map-enabled": zt.value,
              readonly: e.readonly,
              onRemove: tl,
              onAdd: v[15] || (v[15] = (q) => mt(g.value.field, g.value.trail)),
              onSelectItem: v[16] || (v[16] = (q) => re(g.value.field, [...g.value.trail, "item"]))
            }, null, 8, ["field", "shape", "depth", "sibling-names", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"]),
            !e.readonly && g.value.trail.at(-1) !== "item" ? (a(), n("fieldset", To, [
              t("label", null, [
                v[42] || (v[42] = N("Move to parent", -1)),
                W(t("select", {
                  "onUpdate:modelValue": v[17] || (v[17] = (q) => O.value = q),
                  "aria-label": "Move to parent"
                }, [
                  g.value.trail.length ? (a(), n("option", Oo, "Top-level field")) : (a(), n("option", Do, "Choose an object…")),
                  (a(!0), n(M, null, I(Ne.value, (q) => (a(), n("option", {
                    key: q.key,
                    value: q.key
                  }, r(q.path), 9, Io))), 128))
                ], 512), [
                  [Ge, O.value]
                ])
              ]),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Move selected node",
                disabled: !O.value && !g.value.trail.length || !O.value && e.config.fields.length >= 100,
                onClick: al
              }, "Move", 8, jo)
            ])) : h("", !0)
          ], 64)) : u.value.kind === "details" ? (a(), n("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: e.readonly
          }, [
            t("label", null, [
              v[43] || (v[43] = N("Name", -1)),
              W(t("input", {
                "onUpdate:modelValue": v[18] || (v[18] = (q) => l.value = q),
                "aria-label": "Extractor name"
              }, null, 512), [
                [_, l.value]
              ])
            ]),
            t("label", null, [
              v[44] || (v[44] = N("Description", -1)),
              W(t("textarea", {
                "onUpdate:modelValue": v[19] || (v[19] = (q) => i.value = q),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [_, i.value]
              ])
            ]),
            t("label", null, [
              v[45] || (v[45] = N("Tags", -1)),
              W(t("input", {
                "onUpdate:modelValue": v[20] || (v[20] = (q) => pt.value = q),
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
          ], 8, zo)) : u.value.kind === "output" ? (a(), n("div", Wo, [
            v[47] || (v[47] = t("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            t("ul", Ho, [
              (a(!0), n(M, null, I(e.config.fields, (q) => (a(), n("li", {
                key: f(K)(q)
              }, [
                t("span", Go, r(f(K)(q) || "New field"), 1),
                t("span", Ko, r(ol(q)), 1)
              ]))), 128))
            ]),
            v[48] || (v[48] = t("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : h("", !0)
        ], 512)
      ], 44, Fo)), [
        [f(Pl), { disabled: !L.value }]
      ]) : L.value ? h("", !0) : (a(), n("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: v[22] || (v[22] = (q) => G(!0))
      }, [
        b(f(R), { icon: "tabler:layout-sidebar-right-expand" }),
        t("span", Qo, r(it.value), 1)
      ]))
    ], 2));
  }
}), Yo = ["selected"], Xo = {
  key: 1,
  role: "alert"
}, Zo = {
  key: 2,
  class: "muted"
}, Bt = /* @__PURE__ */ H({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(e, { emit: s }) {
    const l = s, i = A(!1), u = A("");
    Ue(async () => {
      try {
        await Ze("wc-multiselect", { timeoutMs: 8e3 }), i.value = !0;
      } catch (y) {
        u.value = String(y);
      }
    });
    function p(y) {
      const c = y.detail;
      l("select", c.selected[0] || "", c.labels?.[0] || "");
    }
    return (y, c) => i.value ? (a(), n("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(e.value ? [e.value] : []),
      placeholder: "Choose an upload",
      onChange: p
    }, null, 40, Yo)) : u.value ? (a(), n("p", Xo, r(u.value), 1)) : (a(), n("span", Zo, "Loading uploads…"));
  }
}), He = (e) => e.status === "completed" || e.status === "partial" || e.status === "failed", Se = (e) => e.metrics.length ? e.metrics.reduce((s, l) => s + l.accuracy, 0) / e.metrics.length : 0, Lt = (e) => `Visual · ${e.status}`, _o = ["data-error-kind", "data-error-code"], ei = { key: 0 }, Pt = /* @__PURE__ */ H({
  __name: "FieldFailure",
  props: {
    error: {}
  },
  setup(e) {
    const s = e, l = F(() => {
      const u = s.error?.details;
      return u && typeof u == "object" && "code" in u && typeof u.code == "string" ? u.code : void 0;
    }), i = F(() => l.value === "context_budget_exceeded");
    return (u, p) => (a(), n("div", {
      class: "field-failure",
      "data-error-kind": e.error?.kind,
      "data-error-code": l.value,
      role: "note",
      "aria-label": "Field failure"
    }, [
      t("p", null, [
        t("strong", null, r(i.value ? "Context budget exceeded" : e.error?.kind), 1),
        N(" · " + r(e.error?.message), 1)
      ]),
      t("small", null, r(e.error?.retryable ? "Retryable" : "Not retryable"), 1),
      e.error?.details ? (a(), n("details", ei, [
        p[0] || (p[0] = t("summary", { class: "kx-focus-outline" }, "Error details", -1)),
        t("pre", null, r(JSON.stringify(e.error.details, null, 2)), 1)
      ])) : h("", !0)
    ], 8, _o));
  }
}), ti = { class: "nested-value" }, li = { key: 0 }, ai = {
  key: 0,
  class: "muted"
}, ni = { key: 1 }, si = { key: 2 }, Be = /* @__PURE__ */ H({
  __name: "NestedValue",
  props: {
    value: {}
  },
  setup(e) {
    const s = e, l = F(() => s.value !== null && typeof s.value == "object" && !Array.isArray(s.value) ? s.value : null);
    return (i, u) => {
      const p = st("NestedValue", !0);
      return a(), n("div", ti, [
        Array.isArray(e.value) ? (a(), n("ol", li, [
          (a(!0), n(M, null, I(e.value, (y, c) => (a(), n("li", { key: c }, [
            b(p, { value: y }, null, 8, ["value"])
          ]))), 128)),
          e.value.length ? h("", !0) : (a(), n("li", ai, "Empty list"))
        ])) : l.value ? (a(), n("dl", ni, [
          (a(!0), n(M, null, I(l.value, (y, c) => (a(), n(M, { key: c }, [
            t("dt", null, r(c), 1),
            t("dd", null, [
              b(p, { value: y }, null, 8, ["value"])
            ])
          ], 64))), 128))
        ])) : (a(), n("span", si, r(e.value === null || e.value === void 0 ? "—" : String(e.value)), 1))
      ]);
    };
  }
}), oi = { class: "value-list" }, ii = ["aria-expanded", "onClick"], ui = { class: "value-name" }, di = { class: "bar" }, ri = {
  key: 1,
  class: "value-checks"
}, ci = ["title"], vi = {
  key: 0,
  class: "chip",
  "aria-label": "Verification method"
}, mi = {
  key: 1,
  class: "chip warn",
  "aria-label": "Context"
}, pi = {
  key: 2,
  class: "chip",
  "aria-label": "Completeness"
}, fi = { class: "evidence" }, bi = {
  key: 1,
  class: "muted"
}, gi = {
  key: 2,
  class: "muted"
}, Tt = /* @__PURE__ */ H({
  __name: "ResultFields",
  props: {
    fields: {},
    pageRange: {}
  },
  setup(e) {
    const s = e, l = F(() => Pe(s.fields.map((S) => S.path))), i = A(), u = (S) => `${Math.round(S * 100)}%`, p = (S) => S !== null && typeof S == "object", y = (S) => Array.isArray(S) ? `${S.length} items` : p(S) ? `${Object.keys(S).length} properties` : S == null ? "—" : String(S), c = (S) => S >= 0.9 ? "high" : S >= 0.7 ? "mid" : "low", w = (S) => S.codes?.includes("missing_in_sections") ? "Not in the selected sections" + (s.pageRange ? " of the searched pages" : "") : "Not in the document", C = (S) => {
      const m = S.error?.details;
      return !!m && typeof m == "object" && "code" in m && m.code === "context_budget_exceeded";
    };
    return (S, m) => (a(), n("div", oi, [
      b(Re, { node: l.value }, {
        default: me(({ index: x }) => [
          (a(!0), n(M, null, I([e.fields[x]], (V) => (a(), n("div", {
            key: V.path,
            class: "value-row"
          }, [
            t("button", {
              type: "button",
              class: "value-main",
              "aria-expanded": i.value === V.path,
              onClick: (o) => i.value = i.value === V.path ? void 0 : V.path
            }, [
              t("span", ui, r(V.name), 1),
              t("span", {
                class: Q(["value-text", { missing: V.missing }])
              }, r(V.failed ? C(V) ? "Context budget exceeded" : "Failed" : V.missing ? w(V) : y(V.value)), 3),
              V.failed ? h("", !0) : (a(), n("span", {
                key: 0,
                class: Q(["confidence", c(V.confidence)])
              }, [
                t("span", di, [
                  t("span", {
                    style: qe({ width: u(V.confidence) })
                  }, null, 4)
                ]),
                N(r(u(V.confidence)), 1),
                m[0] || (m[0] = t("span", { class: "conf-word" }, " confidence", -1))
              ], 2)),
              V.failed ? h("", !0) : (a(), n("span", ri, [
                t("span", {
                  class: Q(["chip", V.verified ? "primary" : "warn"]),
                  title: V.reason
                }, [
                  b(f(R), {
                    icon: V.verified ? "tabler:shield-check" : "tabler:shield-question"
                  }, null, 8, ["icon"]),
                  N(r(V.verified ? "Verified" : "Check"), 1)
                ], 10, ci),
                V.verification ? (a(), n("span", vi, r(f(Lt)(V.verification)), 1)) : h("", !0),
                V.codes?.includes("context_budget_partial") ? (a(), n("span", mi, "Partial context")) : h("", !0),
                V.missing ? h("", !0) : (a(), n("span", pi, r(V.complete === !0 ? "Complete" : V.complete === !1 ? "Incomplete" : "Completeness unknown"), 1))
              ])),
              b(f(R), {
                icon: i.value === V.path ? "tabler:chevron-up" : "tabler:chevron-down",
                class: "value-caret"
              }, null, 8, ["icon"])
            ], 8, ii),
            !V.failed && !V.missing && p(V.value) ? (a(), J(Be, {
              key: 0,
              class: "structured-value",
              value: V.value
            }, null, 8, ["value"])) : h("", !0),
            V.failed ? (a(), J(Pt, {
              key: 1,
              error: V.error
            }, null, 8, ["error"])) : h("", !0),
            W(t("div", fi, [
              !V.failed && !V.missing && !p(V.value) ? (a(), J(Be, {
                key: 0,
                value: V.value
              }, null, 8, ["value"])) : h("", !0),
              (a(!0), n(M, null, I(V.evidence, (o, d) => (a(), n("blockquote", {
                key: d,
                class: Q({ unfound: o.found === !1 })
              }, [
                t("p", null, "“" + r(o.quote) + "”", 1),
                t("cite", null, [
                  N(r(o.section), 1),
                  o.page !== void 0 && o.page !== null ? (a(), n(M, { key: 0 }, [
                    N(" · Page " + r(o.page), 1)
                  ], 64)) : h("", !0),
                  o.found === !1 ? (a(), n(M, { key: 1 }, [
                    N(" · not found word for word in the document")
                  ], 64)) : h("", !0)
                ])
              ], 2))), 128)),
              V.evidence.length ? h("", !0) : (a(), n("p", bi, "No evidence.")),
              V.reason || !V.verified && !V.failed ? (a(), n("p", gi, r(V.reason || "No reason recorded"), 1)) : h("", !0)
            ], 512), [
              [Ke, i.value === V.path && !V.failed]
            ])
          ]))), 128))
        ]),
        _: 1
      }, 8, ["node"])
    ]));
  }
}), hi = { class: "test" }, yi = { class: "run-bar" }, ki = { class: "run-input" }, $i = { class: "muted run-note" }, xi = {
  key: 0,
  class: "empty"
}, wi = {
  key: 1,
  class: "run-failed",
  role: "alert"
}, Vi = {
  key: 2,
  class: "eval-warning",
  role: "status"
}, Si = {
  key: 3,
  class: "test-grid"
}, Ci = { class: "block" }, Ei = { class: "block-head" }, qi = { class: "muted push" }, Ui = { class: "block" }, Ni = { class: "timeline" }, Fi = { class: "tl-icon" }, Mi = { class: "tl-main" }, Ai = { class: "tl-head" }, Ri = { class: "muted push" }, Bi = { class: "tl-bar" }, Li = { class: "muted" }, Pi = {
  key: 0,
  class: "tl-msg"
}, Ti = {
  key: 1,
  class: "chips"
}, Oi = /* @__PURE__ */ H({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {},
    running: { type: Boolean },
    canRun: { type: Boolean }
  },
  emits: ["run"],
  setup(e, { emit: s }) {
    const l = e, i = s, u = A(""), p = (S) => `${(S / 1e3).toFixed(1)}s`, y = F(() => Math.max(1, ...l.result?.trace.map((S) => S.duration_ms) ?? [1])), c = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, w = (S) => c[S]?.label ?? $e[S] ?? S, C = (S) => c[S]?.icon ?? ot[S] ?? "tabler:point";
    return (S, m) => (a(), n("div", hi, [
      t("section", yi, [
        t("div", ki, [
          b(Bt, {
            value: u.value,
            onSelect: m[0] || (m[0] = (x) => u.value = x)
          }, null, 8, ["value"])
        ]),
        b(f(de), {
          label: e.running ? "Extracting…" : "Run extraction",
          loading: e.running,
          disabled: !u.value || e.running || !e.canRun,
          onClick: m[1] || (m[1] = (x) => i("run", u.value))
        }, null, 8, ["label", "loading", "disabled"]),
        t("p", $i, r(e.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + r(e.retention) + ".", 1)
      ]),
      e.result ? h("", !0) : (a(), n("p", xi, "No extraction results yet.")),
      e.result?.status === "failed" ? (a(), n("p", wi, [
        b(f(R), { icon: "tabler:alert-triangle" }),
        N("The run stopped: " + r(e.result.error), 1)
      ])) : h("", !0),
      e.result?.status === "partial" ? (a(), n("p", Vi, [
        b(f(R), { icon: "tabler:alert-triangle" }),
        m[2] || (m[2] = N("Partial result · Some fields failed. Successful values are available below.", -1))
      ])) : h("", !0),
      e.result ? (a(), n("div", Si, [
        t("section", Ci, [
          t("header", Ei, [
            m[3] || (m[3] = t("h2", { class: "block-title" }, "Values", -1)),
            t("span", qi, [
              N(r(e.result.tokens.toLocaleString()) + " tokens · " + r(p(e.result.duration_ms)), 1),
              e.result.page_range ? (a(), n(M, { key: 0 }, [
                N(" · Pages " + r(e.result.page_range.first) + "–" + r(e.result.page_range.last), 1)
              ], 64)) : e.result.pages ? (a(), n(M, { key: 1 }, [
                N(" · " + r(e.result.pages) + " pages", 1)
              ], 64)) : h("", !0)
            ])
          ]),
          b(Tt, {
            fields: e.result.fields,
            "page-range": e.result.page_range
          }, null, 8, ["fields", "page-range"])
        ]),
        t("section", Ui, [
          m[4] || (m[4] = t("header", { class: "block-head" }, [
            t("h2", { class: "block-title" }, "Steps")
          ], -1)),
          t("ol", Ni, [
            (a(!0), n(M, null, I(e.result.trace, (x, V) => (a(), n("li", {
              key: V,
              class: Q(x.status)
            }, [
              t("span", Fi, [
                b(f(R), {
                  icon: C(x.kind)
                }, null, 8, ["icon"])
              ]),
              t("div", Mi, [
                t("div", Ai, [
                  t("strong", null, r(w(x.kind)), 1),
                  t("span", Ri, r(p(x.duration_ms)), 1)
                ]),
                t("span", Bi, [
                  t("span", {
                    style: qe({ width: `${Math.max(4, x.duration_ms / y.value * 100)}%` })
                  }, null, 4)
                ]),
                t("p", Li, [
                  N(r(x.scope), 1),
                  x.pages ? (a(), n(M, { key: 0 }, [
                    N(" · Pages " + r(x.pages.first) + "–" + r(x.pages.last), 1)
                  ], 64)) : h("", !0),
                  x.model ? (a(), n(M, { key: 1 }, [
                    N(" · " + r(x.model), 1)
                  ], 64)) : h("", !0),
                  N(" · " + r((x.input_tokens + x.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                x.message ? (a(), n("p", Pi, r(x.message), 1)) : h("", !0),
                x.queries?.length ? (a(), n("div", Ti, [
                  (a(!0), n(M, null, I(x.queries, (o) => (a(), n("span", {
                    key: o,
                    class: "chip"
                  }, r(o), 1))), 128))
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
const Di = { class: "evals" }, Ii = { class: "block eval-run" }, ji = { class: "eval-run-main" }, zi = { class: "block-title" }, Wi = {
  key: 0,
  class: "eval-note"
}, Hi = {
  key: 0,
  class: "eval-progress",
  role: "status"
}, Gi = { class: "bar" }, Ki = { class: "muted" }, Qi = { class: "stat-row" }, Ji = { class: "stat" }, Yi = { class: "stat-label" }, Xi = { class: "stat-value" }, Zi = { class: "stat" }, _i = { class: "stat-value" }, eu = { class: "stat-delta flat" }, tu = { class: "stat" }, lu = { class: "stat-value" }, au = {
  key: 0,
  class: "stat-delta flat"
}, nu = { class: "stat" }, su = { class: "stat-value" }, ou = {
  key: 0,
  class: "stat-delta flat"
}, iu = { class: "block" }, uu = { class: "block-head" }, du = {
  key: 0,
  class: "compare-pick push"
}, ru = ["value"], cu = ["value"], vu = {
  key: 0,
  class: "block-empty"
}, mu = {
  key: 1,
  class: "table-scroll"
}, pu = { key: 0 }, fu = { key: 1 }, bu = { class: "mono" }, gu = { class: "acc strong" }, hu = { class: "bar" }, yu = { class: "muted" }, ku = {
  key: 0,
  class: "muted"
}, $u = { key: 1 }, xu = {
  key: 1,
  class: "muted"
}, wu = {
  key: 1,
  class: "block"
}, Vu = { class: "table-scroll" }, Su = { class: "metric-table result-matrix" }, Cu = ["aria-expanded", "onClick"], Eu = {
  key: 0,
  class: "badge",
  "data-status": "partial"
}, qu = ["colspan"], Uu = {
  key: 0,
  class: "cell-state"
}, Nu = ["data-error-kind", "title"], Fu = ["data-label"], Mu = ["title"], Au = {
  key: 0,
  class: "result-detail"
}, Ru = ["colspan"], Bu = ["data-error-kind", "title"], Lu = { class: "mono" }, Pu = { class: "cmp" }, Tu = { class: "cmp" }, Ou = {
  key: 0,
  class: "value-checks"
}, Du = {
  key: 1,
  class: "chip",
  "aria-label": "Verification method"
}, Iu = { class: "muted case-meta" }, ju = { class: "block" }, zu = { class: "block-head" }, Wu = { class: "count" }, Hu = { class: "mono" }, Gu = ["onUpdate:modelValue"], Ku = ["onUpdate:modelValue"], Qu = ["onUpdate:modelValue", "placeholder"], Ju = ["onUpdate:modelValue", "type"], Yu = {
  key: 0,
  class: "error",
  role: "alert"
}, Xu = { class: "row" }, Zu = {
  key: 1,
  class: "block-empty"
}, _u = {
  key: 2,
  class: "block-empty"
}, ed = {
  key: 3,
  class: "table-scroll"
}, td = { class: "metric-table case-table" }, ld = { class: "case-value" }, ad = {
  key: 1,
  class: "muted"
}, nd = { class: "num" }, sd = ["aria-label", "disabled", "onClick"], od = {
  key: 2,
  class: "block"
}, id = { class: "block-head" }, ud = { class: "count" }, dd = { class: "eval-history" }, rd = ["aria-current", "onClick"], cd = ["data-status"], vd = { class: "muted" }, md = { class: "push" }, pd = /* @__PURE__ */ H({
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
    const l = e, i = s, u = A(!1), p = A(""), y = A({}), c = A("");
    fe(() => l.addedCaseId, () => {
      u.value = !1, p.value = "", y.value = {};
    });
    function w(E, g) {
      return E.type === "number" ? Number(g) : E.type === "boolean" ? g === "true" : E.type === "list" || E.type === "object" ? JSON.parse(g) : g;
    }
    function C() {
      c.value = "";
      const E = {};
      try {
        for (const g of l.fields) {
          const $ = String(y.value[K(g)] ?? "").trim();
          $ && Ut(E, K(g), w(g, $));
        }
      } catch {
        c.value = 'Lists and objects need valid JSON, for example ["a","b"] or {"city":"Hamburg"}.';
        return;
      }
      i("add-case", { upload_id: p.value, expected: E });
    }
    const S = F(() => l.evaluations.find((E) => !He(E))), m = F(() => l.evaluations.filter(He)), x = F(() => l.evaluation), V = F(() => ({ done: (x.value?.results ?? []).filter((g) => g.status !== "queued").length, total: x.value?.case_count ?? 0 })), o = A();
    fe(() => x.value?.id, () => {
      o.value = void 0;
    });
    const d = F(() => {
      if (!x.value) return;
      if (o.value) return m.value.find((g) => g.id === o.value);
      const E = m.value.findIndex((g) => g.id === x.value.id);
      return E >= 0 ? m.value[E + 1] : m.value[0];
    }), U = F(() => (x.value?.metrics ?? []).map((E) => ({ ...E, before: d.value?.metrics.find((g) => g.field === E.field) }))), z = F(() => (x.value?.fields ?? []).map(K)), D = F(() => Pe(l.fields.map(K))), j = (E, g) => E.scores.find(($) => $.field === g), G = A(), T = (E) => `${Math.round(E * 100)}%`, P = (E) => {
      const g = Math.round(E * 100);
      return `${g > 0 ? "+" : g < 0 ? "−" : "±"}${Math.abs(g)} pts`;
    }, L = (E) => Math.round(E * 100) > 0 ? "up" : Math.round(E * 100) < 0 ? "down" : "flat", ue = (E) => E >= 6e4 ? `${Math.floor(E / 6e4)}m ${Math.round(E % 6e4 / 1e3)}s` : `${(E / 1e3).toFixed(1)}s`, ke = (E) => E == null || E === "" ? "—" : typeof E == "string" ? E : Array.isArray(E) && E.every((g) => typeof g != "object") ? E.join(", ") : JSON.stringify(E), le = (E) => E ? E.failed ? "fail" : E.score >= 0.999 ? "pass" : E.score > 0 ? "partial" : "fail" : "none", oe = (E) => (E.results ?? []).filter((g) => g.status === "completed").length, be = { queued: "Queued", running: "Running", completed: "Completed", partial: "Partial", failed: "Failed" };
    return (E, g) => (a(), n("div", Di, [
      t("section", Ii, [
        t("div", ji, [
          t("div", null, [
            t("h2", zi, "Evaluate revision " + r(e.revision), 1),
            g[6] || (g[6] = t("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            e.changed ? (a(), n("p", Wi, [
              b(f(R), { icon: "tabler:info-circle" }),
              g[5] || (g[5] = N("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : h("", !0)
          ]),
          b(f(de), {
            label: S.value ? "Evaluating…" : "Run all cases",
            loading: e.starting || !!S.value,
            disabled: !e.cases.length || !e.fields.length || !!S.value || e.starting,
            onClick: g[0] || (g[0] = ($) => i("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        x.value && !f(He)(x.value) ? (a(), n("div", Hi, [
          t("span", Gi, [
            t("span", {
              style: qe({ width: T(V.value.total ? V.value.done / V.value.total : 0) })
            }, null, 4)
          ]),
          t("span", Ki, r(be[x.value.status]) + " · " + r(V.value.done) + " of " + r(V.value.total) + " cases", 1)
        ])) : h("", !0)
      ]),
      x.value && f(He)(x.value) ? (a(), n(M, { key: 0 }, [
        x.value.error ? (a(), n("p", {
          key: 0,
          class: Q(x.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          b(f(R), { icon: "tabler:alert-triangle" }),
          N(r(x.value.error), 1)
        ], 2)) : h("", !0),
        t("div", Qi, [
          t("div", Ji, [
            t("span", Yi, "Accuracy · revision " + r(x.value.config_revision), 1),
            t("span", Xi, r(T(f(Se)(x.value))), 1),
            d.value ? (a(), n("span", {
              key: 0,
              class: Q(["stat-delta", L(f(Se)(x.value) - f(Se)(d.value))])
            }, r(P(f(Se)(x.value) - f(Se)(d.value))) + " vs revision " + r(d.value.config_revision), 3)) : h("", !0)
          ]),
          t("div", Zi, [
            g[7] || (g[7] = t("span", { class: "stat-label" }, "Cases", -1)),
            t("span", _i, [
              N(r(oe(x.value)), 1),
              t("small", null, " / " + r(x.value.case_count), 1)
            ]),
            t("span", eu, r((x.value.results ?? []).filter(($) => $.status === "partial").length) + " partial · " + r((x.value.results ?? []).filter(($) => $.status === "failed").length) + " failed", 1)
          ]),
          t("div", tu, [
            g[8] || (g[8] = t("span", { class: "stat-label" }, "Tokens", -1)),
            t("span", lu, r(x.value.tokens.toLocaleString()), 1),
            d.value ? (a(), n("span", au, r(d.value.tokens.toLocaleString()) + " before", 1)) : h("", !0)
          ]),
          t("div", nu, [
            g[9] || (g[9] = t("span", { class: "stat-label" }, "Model time", -1)),
            t("span", su, r(ue(x.value.duration_ms)), 1),
            d.value ? (a(), n("span", ou, r(ue(d.value.duration_ms)) + " before", 1)) : h("", !0)
          ])
        ]),
        t("section", iu, [
          t("header", uu, [
            g[11] || (g[11] = t("h2", { class: "block-title" }, "Field accuracy", -1)),
            m.value.length > 1 ? (a(), n("label", du, [
              g[10] || (g[10] = t("span", { class: "muted" }, "Compare with", -1)),
              t("select", {
                value: d.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: g[1] || (g[1] = ($) => o.value = $.target.value)
              }, [
                (a(!0), n(M, null, I(m.value.filter(($) => $.id !== x.value.id), ($) => (a(), n("option", {
                  key: $.id,
                  value: $.id
                }, "Revision " + r($.config_revision) + " · " + r(f(Ye)($.created_at)), 9, cu))), 128))
              ], 40, ru)
            ])) : h("", !0)
          ]),
          U.value.length ? (a(), n("div", mu, [
            t("table", {
              class: Q(["metric-table accuracy-table", { comparing: !!d.value }])
            }, [
              t("thead", null, [
                t("tr", null, [
                  g[12] || (g[12] = t("th", null, "Field", -1)),
                  g[13] || (g[13] = t("th", null, "Accuracy", -1)),
                  g[14] || (g[14] = t("th", null, "Verified", -1)),
                  d.value ? (a(), n("th", pu, "Revision " + r(d.value.config_revision), 1)) : h("", !0),
                  d.value ? (a(), n("th", fu, "Change")) : h("", !0)
                ])
              ]),
              t("tbody", null, [
                (a(!0), n(M, null, I(U.value, ($) => (a(), n("tr", {
                  key: $.field
                }, [
                  t("td", bu, r($.field), 1),
                  t("td", null, [
                    t("span", gu, [
                      t("span", hu, [
                        t("span", {
                          style: qe({ width: T($.accuracy) })
                        }, null, 4)
                      ]),
                      N(r(T($.accuracy)), 1)
                    ])
                  ]),
                  t("td", yu, r(T($.verified)), 1),
                  d.value ? (a(), n("td", ku, r($.before ? T($.before.accuracy) : "—"), 1)) : h("", !0),
                  d.value ? (a(), n("td", $u, [
                    $.before ? (a(), n("span", {
                      key: 0,
                      class: Q(["trend", L($.accuracy - $.before.accuracy)])
                    }, [
                      b(f(R), {
                        icon: L($.accuracy - $.before.accuracy) === "up" ? "tabler:trending-up" : L($.accuracy - $.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      N(r(P($.accuracy - $.before.accuracy)), 1)
                    ], 2)) : (a(), n("span", xu, "New field"))
                  ])) : h("", !0)
                ]))), 128))
              ])
            ], 2)
          ])) : (a(), n("p", vu, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : h("", !0),
      x.value?.results?.length ? (a(), n("section", wu, [
        g[19] || (g[19] = t("header", { class: "block-head" }, [
          t("h2", { class: "block-title" }, "Results by case"),
          t("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        t("div", Vu, [
          t("table", Su, [
            t("thead", null, [
              t("tr", null, [
                g[15] || (g[15] = t("th", null, "Document", -1)),
                (a(!0), n(M, null, I(z.value, ($) => (a(), n("th", {
                  key: $,
                  class: "mono"
                }, r($), 1))), 128))
              ])
            ]),
            t("tbody", null, [
              (a(!0), n(M, null, I(x.value.results, ($) => (a(), n(M, {
                key: $.case_id
              }, [
                t("tr", {
                  class: Q(["result-row", { active: G.value === $.case_id }])
                }, [
                  t("td", null, [
                    t("button", {
                      type: "button",
                      class: "case-toggle",
                      "aria-expanded": G.value === $.case_id,
                      onClick: (B) => G.value = G.value === $.case_id ? void 0 : $.case_id
                    }, [
                      b(f(R), {
                        icon: G.value === $.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      N(r($.upload_name), 1)
                    ], 8, Cu),
                    $.status === "partial" ? (a(), n("span", Eu, "Partial")) : h("", !0)
                  ]),
                  $.status === "queued" || $.status === "failed" ? (a(), n("td", {
                    key: 0,
                    colspan: z.value.length,
                    class: "muted"
                  }, [
                    $.status === "queued" ? (a(), n("span", Uu, [
                      b(f(R), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      g[16] || (g[16] = N("Waiting", -1))
                    ])) : (a(), n("span", {
                      key: 1,
                      class: "cell-state fail",
                      "data-error-kind": $.error?.kind,
                      title: $.error?.kind
                    }, [
                      b(f(R), { icon: "tabler:alert-triangle" }),
                      N(r($.error?.message), 1)
                    ], 8, Nu))
                  ], 8, qu)) : (a(!0), n(M, { key: 1 }, I(z.value, (B) => (a(), n("td", {
                    key: B,
                    "data-label": B
                  }, [
                    t("span", {
                      class: Q(["cell", le(j($, B))]),
                      title: ke(j($, B)?.value)
                    }, r(j($, B)?.failed ? "Failed" : j($, B) ? T(j($, B).score) : "—"), 11, Mu)
                  ], 8, Fu))), 128))
                ], 2),
                G.value === $.case_id ? (a(), n("tr", Au, [
                  t("td", {
                    colspan: z.value.length + 1
                  }, [
                    $.error ? (a(), n("p", {
                      key: 0,
                      class: "muted",
                      "data-error-kind": $.error.kind,
                      title: $.error.kind
                    }, r($.error.message), 9, Bu)) : h("", !0),
                    b(Re, {
                      node: f(Pe)($.scores.map((B) => B.field))
                    }, {
                      default: me(({ index: B }) => [
                        (a(!0), n(M, null, I([$.scores[B]], (O) => (a(), n("dl", {
                          key: O.field,
                          class: "compare"
                        }, [
                          t("dt", Lu, r(O.field.split(".").at(-1)), 1),
                          t("dd", null, [
                            t("span", {
                              class: Q(["cell", le(O)])
                            }, r(O.failed ? "Failed" : T(O.score)), 3),
                            t("div", Pu, [
                              g[17] || (g[17] = t("span", { class: "cmp-label" }, "Expected", -1)),
                              b(Be, {
                                value: O.expected
                              }, null, 8, ["value"])
                            ]),
                            t("div", Tu, [
                              g[18] || (g[18] = t("span", { class: "cmp-label" }, "Extracted", -1)),
                              O.failed ? (a(), J(Pt, {
                                key: 0,
                                error: O.error
                              }, null, 8, ["error"])) : (a(), J(Be, {
                                key: 1,
                                value: O.value
                              }, null, 8, ["value"]))
                            ]),
                            !O.failed || O.verification ? (a(), n("span", Ou, [
                              O.failed ? h("", !0) : (a(), n("span", {
                                key: 0,
                                class: Q(["chip", O.verified ? "primary" : "warn"])
                              }, [
                                b(f(R), {
                                  icon: O.verified ? "tabler:shield-check" : "tabler:shield-question"
                                }, null, 8, ["icon"]),
                                N(r(O.verified ? "Verified" : "Unverified"), 1)
                              ], 2)),
                              O.verification ? (a(), n("span", Du, r(f(Lt)(O.verification)), 1)) : h("", !0)
                            ])) : h("", !0)
                          ])
                        ]))), 128))
                      ]),
                      _: 2
                    }, 1032, ["node"]),
                    t("p", Iu, r($.tokens.toLocaleString()) + " tokens · " + r(ue($.duration_ms)), 1)
                  ], 8, Ru)
                ])) : h("", !0)
              ], 64))), 128))
            ])
          ])
        ])
      ])) : h("", !0),
      t("section", ju, [
        t("header", zu, [
          g[20] || (g[20] = t("h2", { class: "block-title" }, "Cases", -1)),
          t("span", Wu, r(e.cases.length), 1),
          b(f(de), {
            label: "Add case",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: !e.fields.length,
            onClick: g[2] || (g[2] = ($) => u.value = !u.value)
          }, null, 8, ["disabled"])
        ]),
        u.value ? (a(), n("form", {
          key: 0,
          class: "case-form",
          onSubmit: ve(C, ["prevent"])
        }, [
          t("label", null, [
            g[21] || (g[21] = N("Document", -1)),
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
              (a(!0), n(M, null, I([e.fields[$]], (B) => (a(), n("label", {
                key: f(K)(B)
              }, [
                t("span", Hu, r(B.name), 1),
                B.type === "boolean" ? W((a(), n("select", {
                  key: 0,
                  "onUpdate:modelValue": (O) => y.value[f(K)(B)] = O
                }, [...g[22] || (g[22] = [
                  t("option", { value: "" }, "Not stated", -1),
                  t("option", { value: "true" }, "Yes", -1),
                  t("option", { value: "false" }, "No", -1)
                ])], 8, Gu)), [
                  [Ge, y.value[f(K)(B)]]
                ]) : B.type === "enum" ? W((a(), n("select", {
                  key: 1,
                  "onUpdate:modelValue": (O) => y.value[f(K)(B)] = O
                }, [
                  g[23] || (g[23] = t("option", { value: "" }, "Not stated", -1)),
                  (a(!0), n(M, null, I(B.enum_values, (O) => (a(), n("option", { key: O }, r(O), 1))), 128))
                ], 8, Ku)), [
                  [Ge, y.value[f(K)(B)]]
                ]) : B.type === "object" || B.type === "list" ? W((a(), n("textarea", {
                  key: 2,
                  "onUpdate:modelValue": (O) => y.value[f(K)(B)] = O,
                  rows: "2",
                  placeholder: B.type === "list" ? '["first", "second"]' : '{"key": "value"}'
                }, null, 8, Qu)), [
                  [_, y.value[f(K)(B)]]
                ]) : W((a(), n("input", {
                  key: 3,
                  "onUpdate:modelValue": (O) => y.value[f(K)(B)] = O,
                  type: B.type === "number" ? "number" : B.type === "date" ? "date" : "text",
                  placeholder: "Not stated"
                }, null, 8, Ju)), [
                  [rl, y.value[f(K)(B)]]
                ])
              ]))), 128))
            ]),
            _: 1
          }, 8, ["node"]),
          c.value ? (a(), n("p", Yu, r(c.value), 1)) : h("", !0),
          t("div", Xu, [
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
        ], 32)) : h("", !0),
        e.fields.length ? !e.cases.length && !u.value ? (a(), n("p", _u, "No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.")) : e.cases.length ? (a(), n("div", ed, [
          t("table", td, [
            g[25] || (g[25] = t("thead", null, [
              t("tr", null, [
                t("th", null, "Document"),
                t("th", null, "Expected values"),
                t("th")
              ])
            ], -1)),
            t("tbody", null, [
              (a(!0), n(M, null, I(e.cases, ($) => (a(), n("tr", {
                key: $.id
              }, [
                t("td", null, [
                  b(f(R), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  N(" " + r($.upload_name), 1)
                ]),
                t("td", null, [
                  b(Re, { node: D.value }, {
                    default: me(({ index: B }) => [
                      t("div", ld, [
                        t("strong", null, r(e.fields[B].name), 1),
                        f(kt)($.expected, f(K)(e.fields[B])) !== void 0 ? (a(), J(Be, {
                          key: 0,
                          value: f(kt)($.expected, f(K)(e.fields[B]))
                        }, null, 8, ["value"])) : (a(), n("span", ad, "Not stated"))
                      ])
                    ]),
                    _: 2
                  }, 1032, ["node"])
                ]),
                t("td", nd, [
                  t("button", {
                    type: "button",
                    class: "kx-iconbtn kx-focus-outline",
                    "aria-label": `Remove case ${$.upload_name}`,
                    disabled: e.saving,
                    onClick: (B) => i("delete-case", $.id)
                  }, [
                    b(f(R), { icon: "tabler:trash" })
                  ], 8, sd)
                ])
              ]))), 128))
            ])
          ])
        ])) : h("", !0) : (a(), n("p", Zu, "Add a field in the Builder, then add documents with the values you expect."))
      ]),
      e.evaluations.length ? (a(), n("section", od, [
        t("header", id, [
          g[26] || (g[26] = t("h2", { class: "block-title" }, "History", -1)),
          t("span", ud, r(e.evaluations.length), 1)
        ]),
        t("ul", dd, [
          (a(!0), n(M, null, I(e.evaluations, ($) => (a(), n("li", {
            key: $.id
          }, [
            t("button", {
              type: "button",
              class: Q({ active: x.value?.id === $.id }),
              "aria-current": x.value?.id === $.id,
              onClick: (B) => i("open", $.id)
            }, [
              t("span", {
                class: "badge",
                "data-status": $.status
              }, r(be[$.status]), 9, cd),
              t("span", null, "Revision " + r($.config_revision), 1),
              t("span", vd, r(f(Ye)($.created_at)), 1),
              t("strong", md, r($.status === "completed" || $.status === "partial" ? T(f(Se)($)) : "—"), 1)
            ], 10, rd)
          ]))), 128))
        ])
      ])) : h("", !0)
    ]));
  }
}), fd = { class: "section-head" }, bd = { class: "muted" }, gd = {
  key: 0,
  class: "empty"
}, hd = {
  key: 1,
  class: "table-scroll"
}, yd = { class: "metric-table runs-table" }, kd = ["aria-label", "aria-expanded", "onClick"], $d = { class: "caller" }, xd = {
  key: 0,
  class: "muted"
}, wd = ["data-status"], Vd = {
  class: "num",
  "data-label": "Time"
}, Sd = {
  class: "num",
  "data-label": "Tokens"
}, Cd = {
  class: "muted",
  "data-label": "Expires"
}, Ed = {
  key: 0,
  class: "result-detail"
}, qd = { colspan: "6" }, Ud = /* @__PURE__ */ H({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(e) {
    const s = A(), l = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (i, u) => (a(), n(M, null, [
      t("div", fd, [
        u[0] || (u[0] = t("h2", null, "Recent runs", -1)),
        t("span", bd, "Runs expire after " + r(e.retention), 1)
      ]),
      e.runs.length ? (a(), n("div", hd, [
        t("table", yd, [
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
            (a(!0), n(M, null, I(e.runs, (p) => (a(), n(M, {
              key: p.id
            }, [
              t("tr", null, [
                t("td", null, [
                  t("button", {
                    type: "button",
                    class: "case-toggle",
                    "aria-label": `Show values for run ${p.id}`,
                    "aria-expanded": s.value === p.id,
                    onClick: (y) => s.value = s.value === p.id ? void 0 : p.id
                  }, [
                    b(f(R), {
                      icon: s.value === p.id ? "tabler:chevron-down" : "tabler:chevron-right"
                    }, null, 8, ["icon"]),
                    N(r(f(Ye)(p.created_at)), 1)
                  ], 8, kd)
                ]),
                t("td", null, [
                  t("span", $d, [
                    b(f(R), {
                      icon: l[p.caller].icon
                    }, null, 8, ["icon"]),
                    N(r(l[p.caller].label), 1)
                  ]),
                  p.result.page_range ? (a(), n("span", xd, " · Pages " + r(p.result.page_range.first) + "–" + r(p.result.page_range.last), 1)) : h("", !0)
                ]),
                t("td", null, [
                  t("span", {
                    class: "badge",
                    "data-status": p.status
                  }, r(p.status === "completed" ? "Completed" : p.status === "partial" ? "Partial" : "Failed"), 9, wd)
                ]),
                t("td", Vd, r((p.duration_ms / 1e3).toFixed(1)) + "s", 1),
                t("td", Sd, r(Number(p.tokens).toLocaleString()), 1),
                t("td", Cd, r(f(Ye)(p.expires_at)), 1)
              ]),
              s.value === p.id ? (a(), n("tr", Ed, [
                t("td", qd, [
                  b(Tt, {
                    fields: p.result.fields,
                    "page-range": p.result.page_range
                  }, null, 8, ["fields", "page-range"])
                ])
              ])) : h("", !0)
            ], 64))), 128))
          ])
        ])
      ])) : (a(), n("p", gd, "No runs yet. Runs from the Test tab, agents, evaluations and Workflows appear here."))
    ], 64));
  }
}), Nd = {
  key: 0,
  role: "alert",
  class: "error banner"
}, Fd = /* @__PURE__ */ H({
  __name: "SharePopup",
  props: {
    id: {},
    title: {}
  },
  emits: ["close"],
  setup(e, { emit: s }) {
    const l = e, i = s, u = A(), p = A("");
    return Ue(async () => {
      try {
        await Ze("kickside-share", { timeoutMs: 8e3 });
      } catch (w) {
        p.value = `Sharing is unavailable: ${w instanceof Error ? w.message : String(w)}`;
        return;
      }
      const y = document.createElement("kickside-share"), c = encodeURIComponent(l.id);
      y.setAttribute("config", JSON.stringify({ resource_id: l.id, title: l.title, access_url: `/api/v1/component-access/grants/${c}`, share_url: `/api/v1/component-access/share/${c}` })), y.style.display = "block", y.addEventListener("close", () => i("close")), u.value?.appendChild(y);
    }), (y, c) => (a(), n("div", {
      ref_key: "host",
      ref: u
    }, [
      p.value ? (a(), n("p", Nd, r(p.value), 1)) : h("", !0)
    ], 512));
  }
}), Md = { class: "docscout" }, Ad = { class: "toolbar" }, Rd = { class: "toolbar-lead" }, Bd = { class: "crumb-row" }, Ld = { class: "crumb" }, Pd = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, Td = ["id", "aria-selected", "aria-controls", "onClick"], Od = { class: "toolbar-side" }, Dd = { class: "stats" }, Id = ["title"], jd = {
  key: 2,
  class: "unsaved"
}, zd = {
  key: 0,
  class: "banner row wrap",
  role: "status"
}, Wd = {
  key: 1,
  role: "alert",
  class: "error banner"
}, Hd = {
  key: 3,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, Gd = ["id", "aria-labelledby"], Kd = /* @__PURE__ */ H({
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
    const l = e, i = s, u = A(), p = A(!1), y = A("Builder"), c = A($t()), w = A(""), C = A(""), S = F(() => l.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    fe(y, () => {
      u.value && (u.value.scrollTop = 0);
    }, { flush: "post" });
    const m = A(), x = A(), V = F(() => l.snapshot.can_edit && m.value !== l.snapshot.expected_revision), o = F(() => V.value && x.value !== l.snapshot.expected_revision);
    function d(T) {
      return w.value === T.title && C.value === (T.description ?? "") && Nl(c.value, T.config);
    }
    function U() {
      const T = l.snapshot;
      c.value = structuredClone(gt(T.config ?? $t())), w.value = T.title, C.value = T.description ?? "", m.value = T.expected_revision, x.value = void 0;
    }
    fe(() => l.snapshot, (T, P) => {
      S.value.includes(y.value) || (y.value = S.value[0]), !(P && T.id === P.id && T.can_edit && P.can_edit && !d(P) && !d(T)) && U();
    }, { immediate: !0 });
    const z = F(() => l.snapshot.can_edit && !d(l.snapshot)), D = F(() => Ul(c.value)), j = F(() => Object.keys($e).filter((T) => Qe(c.value, T)).length);
    function G() {
      i("save", { title: w.value, description: C.value, config: structuredClone(gt(c.value)), expected_revision: m.value });
    }
    return (T, P) => (a(), n("main", Md, [
      t("div", Ad, [
        t("div", Rd, [
          t("span", Bd, [
            e.back ? (a(), n("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: P[0] || (P[0] = (L) => i("back"))
            }, [
              b(f(R), { icon: "tabler:arrow-left" })
            ])) : h("", !0),
            t("span", Ld, r(e.snapshot.title), 1)
          ]),
          t("nav", Pd, [
            (a(!0), n(M, null, I(S.value, (L) => (a(), n("button", {
              id: `tab-${L}`,
              key: L,
              role: "tab",
              "aria-selected": y.value === L,
              "aria-controls": `panel-${L}`,
              onClick: (ue) => y.value = L
            }, r(L), 9, Td))), 128))
          ])
        ]),
        t("div", Od, [
          e.snapshot.can_share ? (a(), J(f(de), {
            key: 0,
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-label": "Share",
            onClick: P[1] || (P[1] = (L) => p.value = !0)
          }, {
            default: me(() => [
              b(f(R), { icon: "tabler:share" }),
              P[11] || (P[11] = t("span", { class: "btn-label" }, "Share", -1))
            ]),
            _: 1
          })) : h("", !0),
          t("span", Dd, [
            N(r(e.snapshot.field_count) + " " + r(e.snapshot.field_count === 1 ? "field" : "fields"), 1),
            e.snapshot.can_edit ? (a(), n(M, { key: 0 }, [
              N(" · " + r(j.value) + " steps · revision " + r(e.snapshot.expected_revision), 1)
            ], 64)) : (a(), n(M, { key: 1 }, [
              N(" · Read access")
            ], 64))
          ]),
          e.snapshot.can_edit ? (a(), n(M, { key: 1 }, [
            V.value && !o.value ? (a(), J(f(de), {
              key: 0,
              label: "Reload saved",
              severity: "secondary",
              size: "small",
              onClick: U
            })) : h("", !0),
            D.value ? (a(), n("span", {
              key: 1,
              class: "invalid",
              role: "alert",
              title: D.value
            }, [
              b(f(R), { icon: "tabler:alert-circle" }),
              N(r(D.value), 1)
            ], 8, Id)) : z.value ? (a(), n("span", jd, "Unsaved")) : h("", !0),
            b(f(de), {
              label: "Save",
              size: "small",
              loading: e.saving,
              disabled: !z.value || !!D.value || !w.value.trim(),
              onClick: G
            }, null, 8, ["loading", "disabled"])
          ], 64)) : h("", !0)
        ])
      ]),
      o.value ? (a(), n("div", zd, [
        t("span", null, "Saved configuration changed to revision " + r(e.snapshot.expected_revision) + ". Your edits are kept.", 1),
        b(f(de), {
          label: "Reload saved",
          severity: "secondary",
          size: "small",
          onClick: U
        }),
        b(f(de), {
          label: "Keep editing",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: P[2] || (P[2] = (L) => x.value = e.snapshot.expected_revision)
        })
      ])) : h("", !0),
      e.error ? (a(), n("p", Wd, r(e.error), 1)) : h("", !0),
      p.value ? (a(), J(Fd, {
        key: 2,
        id: e.snapshot.id,
        title: e.snapshot.title,
        onClose: P[3] || (P[3] = (L) => p.value = !1)
      }, null, 8, ["id", "title"])) : h("", !0),
      y.value === "Builder" && e.snapshot.can_edit ? (a(), n("div", Hd, [
        b(Jo, {
          title: w.value,
          "onUpdate:title": P[4] || (P[4] = (L) => w.value = L),
          description: C.value,
          "onUpdate:description": P[5] || (P[5] = (L) => C.value = L),
          config: c.value,
          retention: e.snapshot.retention,
          result: e.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (a(), n("div", {
        key: 4,
        ref_key: "body",
        ref: u,
        class: "page-body"
      }, [
        t("div", {
          id: `panel-${y.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${y.value}`,
          class: "panel"
        }, [
          y.value === "Test" ? (a(), J(Oi, {
            key: 0,
            result: e.result,
            retention: e.snapshot.retention,
            running: e.running,
            "can-run": e.snapshot.field_count > 0,
            onRun: P[6] || (P[6] = (L) => i("run", L))
          }, null, 8, ["result", "retention", "running", "can-run"])) : h("", !0),
          y.value === "Evals" && e.snapshot.can_edit ? (a(), J(pd, {
            key: 1,
            cases: e.snapshot.cases,
            "added-case-id": e.addedCaseId,
            fields: e.snapshot.config.fields,
            evaluations: e.evaluations,
            evaluation: e.evaluation,
            revision: e.snapshot.expected_revision,
            changed: z.value,
            saving: e.saving,
            starting: e.starting,
            onAddCase: P[7] || (P[7] = (L) => i("add-case", L)),
            onDeleteCase: P[8] || (P[8] = (L) => i("delete-case", L)),
            onEvaluate: P[9] || (P[9] = (L) => i("evaluate")),
            onOpen: P[10] || (P[10] = (L) => i("open-evaluation", L))
          }, null, 8, ["cases", "added-case-id", "fields", "evaluations", "evaluation", "revision", "changed", "saving", "starting"])) : h("", !0),
          y.value === "Runs" ? (a(), J(Ud, {
            key: 2,
            runs: e.snapshot.runs,
            retention: e.snapshot.retention
          }, null, 8, ["runs", "retention"])) : h("", !0)
        ], 8, Gd)
      ], 512))
    ]));
  }
}), Qd = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, Jd = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, er = /* @__PURE__ */ H({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(e, { emit: s }) {
    const l = e, i = s, u = A(), p = A(""), y = A(!1), c = A(!1), w = A(!1), C = A(), S = A(null), m = A([]), x = A();
    let V = [], o = 0, d = 0, U = 0, z;
    const D = (E) => E instanceof Error ? E.message : String(E), j = (E) => E === o;
    async function G(E, g) {
      const $ = ++U;
      g && (z = g);
      const B = () => j(E) && $ === U;
      try {
        const O = l.id, Ne = await he.evaluations(O);
        if (!B()) return;
        m.value = Ne;
        const ge = z ?? Ne[0]?.id;
        if (ge) {
          const Oe = await he.evaluation(O, ge);
          if (!B() || Oe.id !== (z ?? ge)) return;
          x.value = Oe;
        }
      } catch (O) {
        B() && (p.value = D(O));
      }
    }
    async function T(E) {
      const g = ++d, $ = () => j(E) && g === d;
      if (!l.id) {
        p.value = "No extractor selected.";
        return;
      }
      try {
        const B = await he.get(l.id);
        if (!$()) return;
        u.value = B, p.value = "", B.can_edit && await G(E);
      } catch (B) {
        $() && (p.value = D(B));
      }
    }
    fe(() => l.id, (E, g) => {
      o++, z = void 0, V.forEach((B) => B()), V = [], C.value = void 0, u.value = void 0, S.value = null, m.value = [], x.value = void 0, p.value = "";
      const $ = o;
      l.id && (V = [xt(`component.${l.id}`, () => T($)), xt(`docscout.runs.${l.id}`, () => T($))]), g !== void 0 && T($);
    }, { immediate: !0 }), Fl(() => T(o)), Ct(() => {
      o++, V.forEach((E) => E());
    });
    async function P(E) {
      const g = o;
      y.value = !0, p.value = "";
      try {
        const $ = await E();
        if (j(g))
          return await T(g), $;
      } catch ($) {
        j(g) && (p.value = D($));
      } finally {
        y.value = !1;
      }
    }
    const L = (E) => P(() => he.update(l.id, E));
    async function ue(E) {
      const g = o, $ = await P(() => he.addCase(l.id, E));
      $ && j(g) && (C.value = $.id);
    }
    const ke = (E) => P(() => he.deleteCase(l.id, E));
    async function le(E) {
      const g = o;
      c.value = !0, p.value = "";
      try {
        const $ = await he.run(l.id, E);
        j(g) && (S.value = $, await T(g));
      } catch ($) {
        if (j(g)) {
          const B = $?.response?.data?.error;
          p.value = u.value?.config?.stages.extract.reads === "pages" && B ? B : D($);
        }
      } finally {
        c.value = !1;
      }
    }
    async function oe() {
      const E = o;
      w.value = !0, p.value = "";
      try {
        const { eval_id: g } = await he.evaluate(l.id);
        j(E) && await G(E, g);
      } catch (g) {
        j(E) && (p.value = D(g));
      } finally {
        w.value = !1;
      }
    }
    function be(E) {
      G(o, E);
    }
    return (E, g) => u.value ? (a(), J(Kd, {
      key: 0,
      snapshot: u.value,
      "added-case-id": C.value,
      saving: y.value,
      running: c.value,
      starting: w.value,
      result: S.value,
      evaluations: m.value,
      evaluation: x.value,
      error: p.value,
      back: e.back,
      onBack: g[0] || (g[0] = ($) => i("back")),
      onRun: le,
      onSave: L,
      onAddCase: ue,
      onDeleteCase: ke,
      onEvaluate: oe,
      onOpenEvaluation: be
    }, null, 8, ["snapshot", "added-case-id", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : p.value ? (a(), n("p", Qd, r(p.value), 1)) : (a(), n("p", Jd, "Loading Docscout…"));
  }
});
export {
  er as _,
  Ye as w
};
