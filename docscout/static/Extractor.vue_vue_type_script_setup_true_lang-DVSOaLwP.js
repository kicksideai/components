import { defineComponent as W, useModel as Le, openBlock as n, createElementBlock as o, withModifiers as ve, createElementVNode as t, mergeModels as Xe, computed as F, withKeys as Ee, unref as m, normalizeClass as Q, createVNode as f, toDisplayString as c, Fragment as U, renderList as I, createCommentVNode as k, createTextVNode as q, createBlock as J, ref as N, useId as pe, watch as fe, withDirectives as z, vModelText as Z, vModelSelect as Ge, resolveComponent as st, renderSlot as je, withCtx as me, mergeProps as bt, vShow as Ke, onMounted as Fe, nextTick as Ce, normalizeStyle as qe, onBeforeUnmount as Ct, vModelDynamic as dl, toRaw as ht } from "vue";
import { B as rl, L as cl, j as ze, v as Me, k as vl, U as ml, I as gt, f as pl, i as Qe, l as Et, t as lt, h as ke, o as ot, p as fl, m as qt, q as G, M as Ae, r as Ft, w as Nt, x as at, y as bl, z as hl, A as gl, C as yl, D as kl, E as Ut, F as $l, G as Mt, H as xl, J as wl, K as Sl, N as yt, O as Vl, P as et, Q as Cl, R as Oe, S as El, s as de, T as kt, n as $t, V as ql, W as Fl, b as Nl, c as ge } from "./index-D0zUKQw8.js";
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
  var a = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    s && (u = u.filter(function(d) {
      return Object.getOwnPropertyDescriptor(e, d).enumerable;
    })), a.push.apply(a, u);
  }
  return a;
}
function St(e) {
  for (var s = 1; s < arguments.length; s++) {
    var a = arguments[s] != null ? arguments[s] : {};
    s % 2 ? wt(Object(a), !0).forEach(function(u) {
      Al(e, u, a[u]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(a)) : wt(Object(a)).forEach(function(u) {
      Object.defineProperty(e, u, Object.getOwnPropertyDescriptor(a, u));
    });
  }
  return e;
}
function Al(e, s, a) {
  return (s = Rl(s)) in e ? Object.defineProperty(e, s, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[s] = a, e;
}
function Rl(e) {
  var s = Bl(e, "string");
  return Te(s) == "symbol" ? s : s + "";
}
function Bl(e, s) {
  if (Te(e) != "object" || !e) return e;
  var a = e[Symbol.toPrimitive];
  if (a !== void 0) {
    var u = a.call(e, s);
    if (Te(u) != "object") return u;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (s === "string" ? String : Number)(e);
}
var Ll = Ml.extend("focustrap", {
  mounted: function(s, a) {
    var u = a.value || {}, d = u.disabled;
    d || (this.createHiddenFocusableElements(s, a), this.bind(s, a), this.autoElementFocus(s, a)), s.setAttribute("data-pd-focustrap", !0), this.$el = s;
  },
  updated: function(s, a) {
    var u = a.value || {}, d = u.disabled;
    d && this.unbind(s);
  },
  unmounted: function(s) {
    this.unbind(s);
  },
  methods: {
    getComputedSelector: function(s) {
      return ':not(.p-hidden-focusable):not([data-p-hidden-focusable="true"])'.concat(s ?? "");
    },
    bind: function(s, a) {
      var u = this, d = a.value || {}, p = d.onFocusIn, g = d.onFocusOut;
      s.$_pfocustrap_mutationobserver = new MutationObserver(function(r) {
        r.forEach(function(h) {
          if (h.type === "childList" && !s.contains(document.activeElement)) {
            var w = function(l) {
              var i = gt(l) ? gt(l, u.getComputedSelector(s.$_pfocustrap_focusableselector)) ? l : Me(s, u.getComputedSelector(s.$_pfocustrap_focusableselector)) : Me(l);
              return pl(i) ? i : l.nextSibling && w(l.nextSibling);
            };
            ze(w(h.nextSibling));
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
    autoElementFocus: function(s, a) {
      var u = a.value || {}, d = u.autoFocusSelector, p = d === void 0 ? "" : d, g = u.firstFocusableSelector, r = g === void 0 ? "" : g, h = u.autoFocus, w = h === void 0 ? !1 : h, x = Me(s, "[autofocus]".concat(this.getComputedSelector(p)));
      w && !x && (x = Me(s, this.getComputedSelector(r))), ze(x);
    },
    onFirstHiddenElementFocus: function(s) {
      var a, u = s.currentTarget, d = s.relatedTarget, p = d === u.$_pfocustrap_lasthiddenfocusableelement || !((a = this.$el) !== null && a !== void 0 && a.contains(d)) ? Me(u.parentElement, this.getComputedSelector(u.$_pfocustrap_focusableselector)) : u.$_pfocustrap_lasthiddenfocusableelement;
      ze(p);
    },
    onLastHiddenElementFocus: function(s) {
      var a, u = s.currentTarget, d = s.relatedTarget, p = d === u.$_pfocustrap_firsthiddenfocusableelement || !((a = this.$el) !== null && a !== void 0 && a.contains(d)) ? cl(u.parentElement, this.getComputedSelector(u.$_pfocustrap_focusableselector)) : u.$_pfocustrap_firsthiddenfocusableelement;
      ze(p);
    },
    createHiddenFocusableElements: function(s, a) {
      var u = this, d = a.value || {}, p = d.tabIndex, g = p === void 0 ? 0 : p, r = d.firstFocusableSelector, h = r === void 0 ? "" : r, w = d.lastFocusableSelector, x = w === void 0 ? "" : w, l = function(C) {
        return ml("span", {
          class: "p-hidden-accessible p-hidden-focusable",
          tabIndex: g,
          role: "presentation",
          "aria-hidden": !0,
          "data-p-hidden-accessible": !0,
          "data-p-hidden-focusable": !0,
          onFocus: C?.bind(u)
        });
      }, i = l(this.onFirstHiddenElementFocus), L = l(this.onLastHiddenElementFocus);
      i.$_pfocustrap_lasthiddenfocusableelement = L, i.$_pfocustrap_focusableselector = h, i.setAttribute("data-pc-section", "firstfocusableelement"), L.$_pfocustrap_firsthiddenfocusableelement = i, L.$_pfocustrap_focusableselector = x, L.setAttribute("data-pc-section", "lastfocusableelement"), s.prepend(i), s.append(L);
    }
  }
});
const Ol = ["aria-checked", "aria-label", "disabled"], ee = /* @__PURE__ */ W({
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
    return (a, u) => (n(), o("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": s.value,
      "aria-label": e.label,
      disabled: e.disabled,
      onClick: u[0] || (u[0] = ve((d) => s.value = !s.value, ["stop"]))
    }, [...u[1] || (u[1] = [
      t("span", null, null, -1)
    ])], 8, Ol));
  }
}), Tl = ["aria-label"], Pl = { class: "node-icon" }, Dl = { class: "node-main" }, Il = { class: "node-title" }, jl = { class: "node-summary" }, zl = {
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
    const a = e, u = s, d = F(() => Qe(a.config, a.stage)), p = F(() => a.config.stages[a.stage].model), g = F({ get: () => d.value, set: (w) => {
      a.config.stages[a.stage].enabled = w;
    } }), r = F(() => {
      const w = a.config, x = w.stages;
      switch (a.stage) {
        case "map":
          return w.fields.filter((l) => l.search_within === "sections").map((l) => ({ text: l.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...x.prefetch.queries.map((l) => ({ text: l.name || "Untitled query", tone: "" })), ...w.fields.filter((l) => l.search_hints.trim()).map((l) => ({ text: l.name, tone: "hint" }))];
        case "scout":
          return x.scout.mode === "agent" ? x.scout.tools.map((l) => ({ text: lt(l).toLowerCase(), tone: "" })) : [];
        case "deep":
          return w.fields.filter((l) => l.strategy === "deep").map((l) => ({ text: l.name || "New field", tone: "primary" }));
        case "extract":
          return Et(w).map((l) => ({ text: `${l.name} · ${l.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), h = (w) => [`${(w.duration_ms / 1e3).toFixed(1)}s`, `${(w.input_tokens + w.output_tokens).toLocaleString()} tokens`, w.queries?.length ? `${w.queries.length} queries` : "", w.message ?? ""].filter(Boolean).join(" · ");
    return (w, x) => (n(), o("div", {
      class: Q(["node kx-focus-halo", { active: e.active, off: !d.value, fixed: e.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": m(ke)[e.stage],
      onClick: x[1] || (x[1] = (l) => u("select")),
      onKeydown: [
        x[2] || (x[2] = Ee((l) => u("select"), ["enter"])),
        x[3] || (x[3] = Ee(ve((l) => u("select"), ["prevent"]), ["space"]))
      ]
    }, [
      t("span", Pl, [
        f(m(M), {
          icon: m(ot)[e.stage]
        }, null, 8, ["icon"])
      ]),
      t("span", Dl, [
        t("span", Il, c(m(ke)[e.stage]), 1),
        t("span", jl, c(d.value ? m(fl)(e.stage, e.config) : "Off"), 1),
        d.value && r.value.length ? (n(), o("span", zl, [
          (n(!0), o(U, null, I(r.value, (l) => (n(), o("span", {
            key: l.text,
            class: Q(["chip", { primary: l.tone === "primary", "muted-chip": l.tone === "hint" }])
          }, c(l.text), 3))), 128))
        ])) : k("", !0),
        e.trace ? (n(), o("span", Wl, [
          f(m(M), {
            icon: e.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          q(c(h(e.trace)), 1)
        ])) : k("", !0)
      ]),
      t("span", Hl, [
        d.value && p.value ? (n(), o("span", Gl, c(m(qt)(p.value)), 1)) : k("", !0),
        e.stage !== "extract" && !e.readonly ? (n(), J(ee, {
          key: 1,
          modelValue: g.value,
          "onUpdate:modelValue": x[0] || (x[0] = (l) => g.value = l),
          label: `Enable ${m(ke)[e.stage]}`
        }, null, 8, ["modelValue", "label"])) : k("", !0)
      ])
    ], 42, Tl));
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
    const s = e, a = Le(e, "modelValue"), u = N([]);
    function d(p, g) {
      const r = s.options.length - 1, h = { ArrowRight: g + 1, ArrowDown: g + 1, ArrowLeft: g - 1, ArrowUp: g - 1, Home: 0, End: r }[p.key];
      if (h === void 0) return;
      p.preventDefault();
      const w = (h + s.options.length) % s.options.length;
      a.value = s.options[w].value, u.value[w]?.focus();
    }
    return (p, g) => (n(), o("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": e.labelledBy
    }, [
      (n(!0), o(U, null, I(e.options, (r, h) => (n(), o("button", {
        key: r.value,
        ref_for: !0,
        ref_key: "buttons",
        ref: u,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        role: "radio",
        "aria-label": e.name ? `${e.name}: ${r.label}` : void 0,
        "aria-checked": a.value === r.value,
        tabindex: a.value === r.value ? 0 : -1,
        disabled: e.disabled,
        onClick: (w) => a.value = r.value,
        onKeydown: (w) => d(w, h)
      }, [
        r.icon ? (n(), J(m(M), {
          key: 0,
          icon: r.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : k("", !0),
        t("span", null, c(r.label), 1)
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
  function a(u, d, p, g) {
    s.push({ field: d, trail: p, shape: u, path: g, depth: p.length + 1, key: ie(d, p) }), u.properties?.forEach((r, h) => a(r, d, [...p, h], `${g}.${r.name || "New property"}`)), u.item && a(u.item, d, [...p, "item"], `${g}[]`);
  }
  return e.forEach((u, d) => a(u, d, [], G(u) || "New field")), s;
}
function nt(e) {
  return 1 + Math.max(0, ...(e.properties ?? []).map(nt), e.item ? nt(e.item) : 0);
}
function Yl(e, s) {
  return Je(e).filter((a) => a.shape.type === "object" && ((a.shape.properties?.length ?? 0) < 100 || a.field === s.field && ie(a.field, a.trail) === ie(s.field, s.trail.slice(0, -1))) && a.depth + nt(s.shape) <= Ae && !(a.field === s.field && s.trail.every((u, d) => a.trail[d] === u)));
}
function Xl(e, s, a) {
  const u = { ...Nt(), ...s.shape, name: s.shape.name };
  s.trail.length ? Je(e).find((g) => g.key === ie(s.field, s.trail.slice(0, -1))).shape.properties.splice(s.trail.at(-1), 1) : e.splice(s.field, 1);
  let d;
  if (a) {
    const { name: p, type: g, description: r, enum_values: h, expected_format: w, required: x, properties: l, item: i } = u;
    d = { name: p, type: g, description: r, enum_values: h, expected_format: w, required: x, ...l ? { properties: l } : {}, ...i ? { item: i } : {} }, a.shape.properties.push(d), d = a.shape.properties.at(-1);
  } else
    d = { ...at(), ...u, group: "" }, e.push(d), d = e.at(-1);
  return Je(e).find((p) => p.shape === d);
}
function Vt(e, s = !1) {
  function a(d) {
    return d.type === "object" ? Object.fromEntries((d.properties ?? []).map((p) => [p.name || "unnamed", a(p)])) : d.type === "list" ? d.item ? [a(d.item)] : [] : s ? d.enum_values?.length ? d.enum_values[0] : { text: "Example value", number: 42, boolean: !0, date: "2026-01-15", enum: null }[d.type] : d.type === "enum" ? d.enum_values?.join(" | ") || "enum" : d.type;
  }
  const u = {};
  return e.forEach((d) => Ft(u, G(d) || "unnamed", a(d))), u;
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
    const a = e, u = s, d = F(() => a.shape), p = F(() => a.named ? a.depth === 1 ? "Field type" : "Property type" : "Item type"), g = F(() => At.filter((A) => a.depth < Ae || !["object", "list"].includes(A.value))), r = F({ get: () => a.shape.type, set: (A) => {
      a.shape.type = A, delete a.shape.properties, delete a.shape.item, a.shape.enum_values = [], A === "object" && (a.shape.properties = []), A === "list" && (a.shape.item = bl());
    } }), h = pe(), w = pe(), x = N(""), l = N("");
    fe(() => a.shape, () => {
      x.value = "", l.value = "";
    });
    const i = F(() => a.validationError || (a.named ? hl(d.value.name, a.siblingNames) : "") || gl(a.shape, a.depth));
    function L() {
      const A = x.value.trim(), C = a.shape.enum_values ?? [];
      if (!A || A.length > 200) {
        l.value = "Enter 1 to 200 characters.";
        return;
      }
      if (C.includes(A)) {
        l.value = "This value already exists.";
        return;
      }
      if (C.length >= 100) {
        l.value = "Use at most 100 allowed values.";
        return;
      }
      a.shape.enum_values = [...C, A], x.value = "", l.value = "";
    }
    return (A, C) => (n(), o("div", Zl, [
      e.named ? (n(), o("label", _l, [
        C[8] || (C[8] = q("Name", -1)),
        z(t("input", {
          "onUpdate:modelValue": C[0] || (C[0] = (E) => d.value.name = E),
          "aria-label": e.depth === 1 ? "Field name" : "Property name",
          "aria-invalid": !!i.value,
          "aria-describedby": i.value ? m(w) : void 0,
          maxlength: "80",
          spellcheck: "false",
          class: "mono-input"
        }, null, 8, ea), [
          [
            Z,
            d.value.name,
            void 0,
            { trim: !0 }
          ]
        ])
      ])) : k("", !0),
      t("div", ta, [
        t("span", { id: m(h) }, c(e.named ? "Data type" : "Item type"), 9, la),
        f($e, {
          modelValue: r.value,
          "onUpdate:modelValue": C[1] || (C[1] = (E) => r.value = E),
          class: "type-picker",
          options: g.value,
          "labelled-by": m(h),
          name: p.value,
          disabled: e.readonly
        }, null, 8, ["modelValue", "options", "labelled-by", "name", "disabled"]),
        e.depth === m(Ae) ? (n(), o("small", aa, "Level four · choose a value type.")) : k("", !0)
      ]),
      i.value ? (n(), o("p", {
        key: 1,
        id: m(w),
        class: "field-error",
        role: "alert"
      }, c(i.value), 9, na)) : k("", !0),
      m(yl)(e.shape, e.named) ? (n(), o("div", sa, [
        t("span", null, c(e.shape.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        t("div", oa, [
          (n(!0), o(U, null, I(e.shape.enum_values, (E, K) => (n(), o("span", {
            key: E,
            class: "chip primary"
          }, [
            q(c(E), 1),
            e.readonly ? k("", !0) : (n(), o("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Remove allowed value ${E}`,
              onClick: (D) => e.shape.enum_values.splice(K, 1)
            }, [
              f(m(M), { icon: "tabler:x" })
            ], 8, ia))
          ]))), 128))
        ]),
        e.readonly ? k("", !0) : (n(), o("div", ua, [
          z(t("input", {
            "onUpdate:modelValue": C[2] || (C[2] = (E) => x.value = E),
            "aria-label": "New allowed value",
            placeholder: "Add a value…",
            maxlength: "200",
            onKeydown: Ee(ve(L, ["prevent"]), ["enter"])
          }, null, 40, da), [
            [Z, x.value]
          ]),
          t("button", {
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo",
            onClick: L
          }, "Add")
        ])),
        l.value ? (n(), o("p", ra, c(l.value), 1)) : k("", !0)
      ])) : k("", !0),
      t("label", null, [
        C[9] || (C[9] = q("Description", -1)),
        z(t("textarea", {
          "onUpdate:modelValue": C[3] || (C[3] = (E) => e.shape.description = E),
          rows: "3",
          maxlength: "4000",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [Z, e.shape.description]
        ])
      ]),
      ["boolean", "enum"].includes(e.shape.type) ? k("", !0) : (n(), o("label", ca, [
        C[10] || (C[10] = q("Expected format", -1)),
        z(t("input", {
          "onUpdate:modelValue": C[4] || (C[4] = (E) => e.shape.expected_format = E),
          maxlength: "400",
          placeholder: m(kl)(e.shape)
        }, null, 8, va), [
          [Z, e.shape.expected_format]
        ])
      ])),
      e.named ? (n(), o("div", ma, [
        C[11] || (C[11] = t("span", null, "Required", -1)),
        f(ee, {
          modelValue: d.value.required,
          "onUpdate:modelValue": C[5] || (C[5] = (E) => d.value.required = E),
          label: "Required",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : k("", !0),
      e.shape.type === "object" ? (n(), o(U, { key: 5 }, [
        t("p", pa, c(e.shape.properties?.length ?? 0) + " properties · Select a property in the tree to edit it.", 1),
        !e.readonly && e.depth < m(Ae) ? (n(), o("button", {
          key: 0,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Add property to ${e.label}`,
          disabled: (e.shape.properties?.length ?? 0) >= 100,
          onClick: C[6] || (C[6] = (E) => u("add"))
        }, [
          f(m(M), { icon: "tabler:plus" }),
          C[12] || (C[12] = q("Add property", -1))
        ], 8, fa)) : k("", !0)
      ], 64)) : k("", !0),
      e.shape.type === "list" && e.shape.item ? (n(), o("button", {
        key: 6,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        onClick: C[7] || (C[7] = (E) => u("selectItem"))
      }, [
        f(m(M), { icon: "tabler:brackets" }),
        q("Edit item shape · " + c(e.shape.item.type), 1)
      ])) : k("", !0)
    ]));
  }
}), ha = ["disabled"], ga = { class: "grid" }, ya = { class: "context-stepper" }, ka = ["disabled"], $a = ["disabled"], xa = {
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
    const a = e, u = s, d = F(() => !a.depth || a.depth === 1), p = F(() => Ut(a.field, a.otherNames));
    return (g, r) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      f(ba, {
        shape: e.shape ?? e.field,
        depth: e.depth ?? 1,
        label: e.shape?.name || e.field.name || "field",
        named: d.value || !!e.shape?.name || !!e.siblingNames,
        "sibling-names": e.siblingNames,
        "validation-error": d.value ? p.value : void 0,
        readonly: e.readonly,
        onAdd: r[0] || (r[0] = (h) => u("add")),
        onSelectItem: r[1] || (r[1] = (h) => u("selectItem"))
      }, null, 8, ["shape", "depth", "label", "named", "sibling-names", "validation-error", "readonly"]),
      d.value ? (n(), o(U, { key: 0 }, [
        r[25] || (r[25] = t("h4", null, "Finding it", -1)),
        t("label", null, [
          r[12] || (r[12] = q("Search hints", -1)),
          z(t("textarea", {
            "onUpdate:modelValue": r[2] || (r[2] = (h) => e.field.search_hints = h),
            rows: "2",
            maxlength: "4000",
            placeholder: "One query per line"
          }, null, 512), [
            [Z, e.field.search_hints]
          ]),
          r[13] || (r[13] = t("small", null, "Each line is an extra search for this field in Prefetch and Deep analysis.", -1))
        ]),
        t("div", ga, [
          t("label", null, [
            r[15] || (r[15] = q("Strategy", -1)),
            z(t("select", {
              "onUpdate:modelValue": r[3] || (r[3] = (h) => e.field.strategy = h)
            }, [...r[14] || (r[14] = [
              t("option", { value: "standard" }, "Standard", -1),
              t("option", { value: "deep" }, "Deep analysis", -1)
            ])], 512), [
              [Ge, e.field.strategy]
            ])
          ]),
          t("label", null, [
            r[16] || (r[16] = q("Chunks to read", -1)),
            t("span", ya, [
              z(t("input", {
                "onUpdate:modelValue": r[4] || (r[4] = (h) => e.field.chunks = h),
                type: "number",
                min: "1",
                max: "1000",
                "aria-label": "Chunks to read"
              }, null, 512), [
                [
                  Z,
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
                onClick: r[5] || (r[5] = (h) => e.field.chunks--)
              }, "−", 8, ka),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Increase chunks to read",
                disabled: e.field.chunks >= 1e3 || e.readonly,
                onClick: r[6] || (r[6] = (h) => e.field.chunks++)
              }, "+", 8, $a)
            ]),
            r[17] || (r[17] = t("small", null, "Per search hint", -1))
          ])
        ]),
        e.field.strategy === "deep" && !e.deepEnabled ? (n(), o("p", xa, [
          f(m(M), { icon: "tabler:info-circle" }),
          r[18] || (r[18] = q("Deep analysis is off in the flow, so this field runs as standard.", -1))
        ])) : k("", !0),
        t("div", wa, [
          r[19] || (r[19] = t("span", { id: "within-label" }, "Search within", -1)),
          f($e, {
            modelValue: e.field.search_within,
            "onUpdate:modelValue": r[7] || (r[7] = (h) => e.field.search_within = h),
            "labelled-by": "within-label",
            options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
          }, null, 8, ["modelValue"]),
          t("small", null, c(e.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
        ]),
        e.field.search_within === "sections" && !e.mapEnabled ? (n(), o("p", Sa, [
          f(m(M), { icon: "tabler:alert-circle" }),
          r[20] || (r[20] = q("Turn on Map the document to read sections.", -1))
        ])) : k("", !0),
        t("label", null, [
          r[21] || (r[21] = q("Group", -1)),
          z(t("input", {
            "onUpdate:modelValue": r[8] || (r[8] = (h) => e.field.group = h),
            list: "docscout-groups",
            placeholder: "parties.borrower",
            "aria-label": "Field group",
            maxlength: "320"
          }, null, 512), [
            [
              Z,
              e.field.group,
              void 0,
              { trim: !0 }
            ]
          ]),
          t("datalist", Va, [
            (n(!0), o(U, null, I(e.groups, (h) => (n(), o("option", {
              key: h,
              value: h
            }, null, 8, Ca))), 128))
          ]),
          r[22] || (r[22] = t("small", null, "Use dotted snake_case names. Values nest under this path.", -1))
        ]),
        r[26] || (r[26] = t("h4", null, "Checking it", -1)),
        t("label", null, [
          r[23] || (r[23] = q("Validation hints", -1)),
          z(t("textarea", {
            "onUpdate:modelValue": r[9] || (r[9] = (h) => e.field.validation_hints = h),
            rows: "2",
            maxlength: "4000",
            placeholder: "Rules the value must satisfy"
          }, null, 512), [
            [Z, e.field.validation_hints]
          ])
        ]),
        t("div", Ea, [
          r[24] || (r[24] = t("span", null, [
            q("Evidence required"),
            t("small", null, "The value must cite a quote from the document.")
          ], -1)),
          f(ee, {
            modelValue: e.field.evidence_required,
            "onUpdate:modelValue": r[10] || (r[10] = (h) => e.field.evidence_required = h),
            label: "Evidence required",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : k("", !0),
      !e.readonly && (d.value || e.siblingNames) ? (n(), o("button", {
        key: 1,
        type: "button",
        class: "kx-btn kx-btn-danger kx-focus-halo",
        onClick: r[11] || (r[11] = (h) => u("remove"))
      }, c(d.value ? "Remove field" : "Remove property"), 1)) : k("", !0)
    ], 8, ha));
  }
}), Fa = { class: "field-groups" }, Na = {
  key: 0,
  class: "rows"
}, Ua = ["aria-label"], Ma = { class: "field-group-head" }, Aa = ["aria-label", "aria-expanded", "aria-controls", "onClick"], Ra = { class: "group-title" }, Ba = ["id"], La = { class: "group-title" }, Re = /* @__PURE__ */ W({
  __name: "FieldGroups",
  props: {
    node: {}
  },
  setup(e) {
    const s = N(/* @__PURE__ */ new Set()), a = pe();
    function u(p) {
      s.value.has(p) ? s.value.delete(p) : s.value.add(p);
    }
    const d = (p) => p.indices.length + p.children.reduce((g, r) => g + d(r), 0);
    return (p, g) => {
      const r = st("FieldGroups", !0);
      return n(), o("div", Fa, [
        e.node.indices.length ? (n(), o("ul", Na, [
          (n(!0), o(U, null, I(e.node.indices, (h) => (n(), o("li", { key: h }, [
            je(p.$slots, "default", { index: h })
          ]))), 128))
        ])) : k("", !0),
        (n(!0), o(U, null, I(e.node.children, (h, w) => (n(), o("section", {
          key: h.path,
          class: "field-group",
          "aria-label": `Group ${h.path}`
        }, [
          t("header", Ma, [
            t("button", {
              type: "button",
              class: "tree-toggle kx-iconbtn kx-focus-outline",
              "aria-label": `${s.value.has(h.path) ? "Expand" : "Collapse"} group ${h.path}`,
              "aria-expanded": !s.value.has(h.path),
              "aria-controls": `${m(a)}-${h.path}`,
              onClick: (x) => u(h.path)
            }, [
              f(m(M), {
                icon: s.value.has(h.path) ? "tabler:chevron-right" : "tabler:chevron-down"
              }, null, 8, ["icon"])
            ], 8, Aa),
            je(p.$slots, "header", {
              path: h.path,
              label: h.name,
              count: d(h),
              first: w === 0,
              last: w === e.node.children.length - 1
            }, () => [
              t("span", Ra, c(h.name), 1)
            ])
          ]),
          z(t("div", {
            id: `${m(a)}-${h.path}`,
            class: "group-content"
          }, [
            f(r, { node: h }, {
              default: me((x) => [
                je(p.$slots, "default", bt({ ref_for: !0 }, x))
              ]),
              header: me((x) => [
                je(p.$slots, "header", bt({ ref_for: !0 }, x), () => [
                  t("span", La, c(x.label), 1)
                ])
              ]),
              _: 3
            }, 8, ["node"])
          ], 8, Ba), [
            [Ke, !s.value.has(h.path)]
          ])
        ], 8, Ua))), 128))
      ]);
    };
  }
}), Oa = ["aria-label", "maxlength", "aria-invalid", "aria-describedby", "onKeydown"], Ta = ["aria-label", "title"], Pa = ["aria-label", "title"], Da = ["id"], Rt = /* @__PURE__ */ W({
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
    const a = e, u = s, d = N(a.initialValue), p = N(""), g = N(), r = pe();
    Fe(() => {
      g.value.focus(), g.value.select();
    });
    function h() {
      const w = d.value.trim();
      if (!w || !$l.test(w)) {
        p.value = "Use a dotted path of snake_case group names.";
        return;
      }
      if (w.length > a.maxLength) {
        p.value = "The group and its nested paths must fit within 320 characters.";
        return;
      }
      u("save", w);
    }
    return (w, x) => (n(), o("form", {
      class: "group-path-editor",
      onSubmit: ve(h, ["prevent"])
    }, [
      z(t("input", {
        ref_key: "input",
        ref: g,
        "onUpdate:modelValue": x[0] || (x[0] = (l) => d.value = l),
        "aria-label": e.inputLabel,
        maxlength: e.maxLength,
        "aria-invalid": !!p.value,
        "aria-describedby": p.value ? m(r) : void 0,
        "aria-required": "true",
        autocomplete: "off",
        spellcheck: "false",
        placeholder: "parties.borrower",
        onKeydown: [
          Ee(ve(h, ["prevent"]), ["enter"]),
          x[1] || (x[1] = Ee(ve((l) => u("cancel"), ["stop", "prevent"]), ["esc"]))
        ]
      }, null, 40, Oa), [
        [Z, d.value]
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
        onClick: x[2] || (x[2] = (l) => u("cancel"))
      }, [
        f(m(M), { icon: "tabler:x" })
      ], 8, Pa),
      p.value ? (n(), o("p", {
        key: 0,
        id: m(r),
        class: "field-error",
        role: "alert"
      }, c(p.value), 9, Da)) : k("", !0)
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
    const a = e, u = s, d = N(!1), p = N(!1), g = N(), r = N(), h = N(), w = pe(), x = F(() => [
      { label: "Move up", disabled: a.first, command: () => u("reorder", -1) },
      { label: "Move down", disabled: a.last, command: () => u("reorder", 1) },
      { separator: !0 },
      { label: "Delete group and its fields", command: () => u("remove") }
    ]);
    function l() {
      d.value = !0;
    }
    async function i() {
      d.value = !1, await Ce(), r.value.focus();
    }
    async function L(A) {
      const C = g.value.closest(".field-tree");
      d.value = !1, u("rename", A), await Ce(), C.querySelector(`[data-group-rename="${A}"]`).focus();
    }
    return (A, C) => (n(), o("div", {
      ref_key: "heading",
      ref: g,
      class: "group-heading"
    }, [
      d.value ? (n(), J(Rt, {
        key: 0,
        "initial-value": e.path,
        "input-label": `Group path for ${e.path}`,
        "save-label": "Save group name",
        "cancel-label": "Cancel group rename",
        "max-length": e.maxLength,
        onSave: L,
        onCancel: i
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
          onClick: l
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
        e.readonly ? k("", !0) : (n(), o("div", Wa, [
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Add field to ${e.path}`,
            disabled: !e.canAdd,
            title: "Add field",
            onClick: C[0] || (C[0] = (E) => u("add"))
          }, [
            f(m(M), { icon: "tabler:plus" })
          ], 8, Ha),
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Actions for group ${e.path}`,
            "aria-haspopup": "menu",
            "aria-expanded": p.value,
            "aria-controls": m(w),
            onClick: C[1] || (C[1] = (E) => h.value.toggle(E))
          }, [
            f(m(M), { icon: "tabler:dots" })
          ], 8, Ga),
          f(m(Mt), {
            id: m(w),
            ref_key: "menu",
            ref: h,
            model: x.value,
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
}, pn = { key: 0 }, fn = { key: 1 }, bn = ["aria-label", "disabled"], hn = /* @__PURE__ */ W({
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
    const a = e, u = s, d = pe(), p = pe(), g = N(), r = N(!1), h = F(() => [
      { label: "Move up", disabled: a.first, command: () => u("reorder", a.field, a.trail, -1) },
      { label: "Move down", disabled: a.last, command: () => u("reorder", a.field, a.trail, 1) }
    ]), w = N(!0);
    fe(() => a.selected, (C) => {
      const E = ie(a.field, a.trail);
      C !== E && C.startsWith(E + (a.trail.length ? "/" : "")) && (w.value = !0);
    });
    const x = F(() => a.trail.at(-1) !== "item"), l = F(() => x.value ? a.shape.name || "New field" : "Each item"), i = F(() => a.trail.length ? void 0 : a.shape), L = F(() => a.shape.type === "object" || a.shape.type === "list");
    function A(C) {
      C.key === "ArrowRight" && L.value && (w.value = !0, C.preventDefault(), C.stopPropagation()), C.key === "ArrowLeft" && L.value && (w.value = !1, C.preventDefault(), C.stopPropagation());
    }
    return (C, E) => {
      const K = st("ShapeTree", !0);
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
            "aria-label": `${w.value ? "Collapse" : "Expand"} ${e.path}`,
            "aria-expanded": w.value,
            onClick: E[0] || (E[0] = (D) => w.value = !w.value)
          }, [
            f(m(M), {
              icon: w.value ? "tabler:chevron-down" : "tabler:chevron-right"
            }, null, 8, ["icon"])
          ], 8, Qa)) : (n(), o("span", Ja)),
          t("button", {
            type: "button",
            class: "row-main kx-focus-halo",
            "aria-label": `Edit ${e.path}`,
            "aria-describedby": m(d),
            "aria-current": e.selected === m(ie)(e.field, e.trail) ? "true" : void 0,
            onClick: E[1] || (E[1] = (D) => u("select", e.field, e.trail))
          }, [
            t("span", Xa, [
              t("span", Za, [
                f(m(M), {
                  icon: m(Jl)(e.shape.type),
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                t("span", {
                  class: "row-label",
                  title: l.value
                }, c(l.value), 9, _a),
                e.error ? (n(), J(m(M), {
                  key: 0,
                  icon: "tabler:alert-circle",
                  class: "row-warn",
                  "aria-label": e.error,
                  title: e.error
                }, null, 8, ["aria-label", "title"])) : k("", !0)
              ]),
              t("span", {
                id: m(d),
                class: Q(["row-desc", { missing: !e.shape.description }]),
                title: e.shape.description || void 0
              }, c(e.shape.description || "No description"), 11, en)
            ]),
            t("span", tn, [
              t("span", ln, c(e.shape.type), 1),
              t("span", an, [
                x.value && e.shape.required ? (n(), o("span", nn, [
                  f(m(M), {
                    icon: "tabler:asterisk",
                    "aria-hidden": "true"
                  })
                ])) : k("", !0),
                i.value?.strategy === "deep" ? (n(), o("span", sn, [
                  f(m(M), {
                    icon: "tabler:microscope",
                    "aria-hidden": "true"
                  })
                ])) : k("", !0),
                i.value?.search_within === "sections" ? (n(), o("span", on, [
                  f(m(M), {
                    icon: "tabler:layout-list",
                    "aria-hidden": "true"
                  })
                ])) : k("", !0),
                i.value?.evidence_required ? (n(), o("span", un, [
                  f(m(M), {
                    icon: "tabler:file-search",
                    "aria-hidden": "true"
                  })
                ])) : k("", !0)
              ])
            ])
          ], 8, Ya),
          !e.readonly && x.value ? (n(), o("span", dn, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} up`,
              disabled: e.first,
              onClick: E[2] || (E[2] = (D) => u("reorder", e.field, e.trail, -1))
            }, [
              f(m(M), { icon: "tabler:chevron-up" })
            ], 8, rn),
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} down`,
              disabled: e.last,
              onClick: E[3] || (E[3] = (D) => u("reorder", e.field, e.trail, 1))
            }, [
              f(m(M), { icon: "tabler:chevron-down" })
            ], 8, cn)
          ])) : k("", !0),
          !e.readonly && x.value ? (n(), o("div", {
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
              model: h.value,
              popup: "",
              "append-to": "self",
              onShow: E[5] || (E[5] = (D) => r.value = !0),
              onHide: E[6] || (E[6] = (D) => r.value = !1)
            }, null, 8, ["id", "model"])
          ], 32)) : k("", !0)
        ], 2),
        L.value && w.value ? (n(), o("ul", mn, [
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
              onSelect: E[8] || (E[8] = (H, T) => u("select", H, T)),
              onAdd: E[9] || (E[9] = (H, T) => u("add", H, T)),
              onReorder: E[10] || (E[10] = (H, T, O) => u("reorder", H, T, O))
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
              onSelect: E[11] || (E[11] = (D, j) => u("select", D, j)),
              onAdd: E[12] || (E[12] = (D, j) => u("add", D, j)),
              onReorder: E[13] || (E[13] = (D, j, H) => u("reorder", D, j, H))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly"])
          ])) : k("", !0),
          !e.readonly && e.shape.type === "object" && e.trail.length + 1 < m(Ae) ? (n(), o("li", fn, [
            t("button", {
              type: "button",
              class: "kx-btn kx-btn-ghost kx-focus-halo sm",
              "aria-label": `Add property to ${e.path}`,
              disabled: (e.shape.properties?.length ?? 0) >= 100,
              onClick: E[14] || (E[14] = (D) => u("add", e.field, e.trail))
            }, [
              f(m(M), { icon: "tabler:plus" }),
              E[15] || (E[15] = q("Add property", -1))
            ], 8, bn)
          ])) : k("", !0)
        ])) : k("", !0)
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
}, wn = /* @__PURE__ */ W({
  __name: "AgentPicker",
  props: {
    value: {},
    readonly: { type: Boolean }
  },
  emits: ["select"],
  setup(e, { emit: s }) {
    const a = s, u = N(!!customElements.get("wc-agent-picker")), d = N("");
    Fe(async () => {
      if (!u.value)
        try {
          await Ze("wc-agent-picker", { timeoutMs: 8e3 }), u.value = !0;
        } catch (g) {
          d.value = g instanceof Error ? g.message : String(g);
        }
    });
    function p(g) {
      if (g.composedPath()[0] !== g.currentTarget) return;
      const r = g.detail;
      a("select", r.agent_id);
    }
    return (g, r) => (n(), o("div", gn, [
      r[0] || (r[0] = t("span", null, "Scout agent", -1)),
      e.readonly ? (n(), o("p", yn, c(e.value || "Built-in scout"), 1)) : u.value ? (n(), o("wc-agent-picker", {
        key: 1,
        config: JSON.stringify({ agent_id: e.value || "" }),
        "aria-label": "Scout agent",
        placeholder: "Choose your agent…",
        onChange: p
      }, null, 40, kn)) : d.value ? (n(), o("p", $n, "Could not load agent picker: " + c(d.value), 1)) : (n(), o("span", xn, "Loading agents…")),
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
}, ce = /* @__PURE__ */ W({
  __name: "ModelPicker",
  props: {
    value: {},
    capability: {},
    labelledBy: {}
  },
  emits: ["select"],
  setup(e, { emit: s }) {
    const a = s, u = N(!!customElements.get("wc-model-picker")), d = N("");
    Fe(async () => {
      if (!u.value)
        try {
          await Ze("wc-model-picker", { timeoutMs: 8e3 }), u.value = !0;
        } catch (g) {
          d.value = g instanceof Error ? g.message : String(g);
        }
    });
    function p(g) {
      const r = g.detail;
      typeof r == "string" && a("select", r);
    }
    return (g, r) => u.value ? (n(), o("wc-model-picker", {
      key: 0,
      value: e.value,
      capability: e.capability,
      "aria-labelledby": e.labelledBy,
      onSelect: p
    }, null, 40, Sn)) : d.value ? (n(), o("p", Vn, "Could not load model picker: " + c(d.value), 1)) : (n(), o("span", Cn, "Loading models…"));
  }
}), En = { class: "slider" }, qn = { class: "slider-head" }, Fn = { class: "slider-value" }, Nn = ["aria-label", "aria-valuetext", "disabled"], Un = {
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
    const s = e, a = Le(e, "modelValue"), u = F(() => s.percent ? `${Math.round(a.value * 100)}%` : `${a.value.toLocaleString()}${s.unit ? ` ${s.unit}` : ""}`), d = (r) => s.log ? Math.log(r / s.min) / Math.log(s.max / s.min) * Se : (r - s.min) / (s.max - s.min) * Se;
    function p(r) {
      const h = s.log ? s.min * Math.pow(s.max / s.min, r / Se) : s.min + (s.max - s.min) * r / Se, w = Math.round(h / s.step) * s.step;
      return Math.min(s.max, Math.max(s.min, Number(w.toFixed(4))));
    }
    const g = F({ get: () => Math.round(d(a.value)), set: (r) => {
      a.value = p(r);
    } });
    return (r, h) => (n(), o("div", En, [
      t("div", qn, [
        t("span", null, c(e.label), 1),
        t("output", Fn, c(u.value), 1)
      ]),
      z(t("input", {
        "onUpdate:modelValue": h[0] || (h[0] = (w) => g.value = w),
        type: "range",
        min: "0",
        max: Se,
        step: "1",
        "aria-label": e.label,
        "aria-valuetext": u.value,
        disabled: e.disabled,
        style: qe({ "--fill": `${g.value / Se * 100}%` })
      }, null, 12, Nn), [
        [
          Z,
          g.value,
          void 0,
          { number: !0 }
        ]
      ]),
      e.hints ? (n(), o("div", Un, [
        t("span", null, c(e.hints[0]), 1),
        t("span", null, c(e.hints[1]), 1)
      ])) : k("", !0),
      e.note ? (n(), o("small", Mn, c(e.note), 1)) : k("", !0)
    ]));
  }
}), An = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, Rn = { class: "fd-track" }, Bn = { class: "fd-node" }, Ln = { class: "fd-dots" }, On = { class: "fd-more" }, Tn = { class: "fd-node goal" }, Pn = /* @__PURE__ */ W({
  __name: "ScoutDiagram",
  props: {
    rounds: {},
    confidence: {},
    extra: {}
  },
  setup(e) {
    const s = e;
    return (a, u) => (n(), o("figure", An, [
      t("div", Rn, [
        u[2] || (u[2] = t("span", { class: "fd-node solid" }, "Pass", -1)),
        (n(!0), o(U, null, I(Math.min(s.rounds, 8), (d) => (n(), o(U, { key: d }, [
          u[0] || (u[0] = t("span", { class: "fd-link" }, null, -1)),
          t("span", Bn, [
            t("span", null, "R" + c(d), 1),
            t("span", Ln, [
              (n(!0), o(U, null, I(Math.min(s.extra, 6), (p) => (n(), o("i", { key: p }))), 128))
            ])
          ])
        ], 64))), 128)),
        s.rounds > 8 ? (n(), o(U, { key: 0 }, [
          u[1] || (u[1] = t("span", { class: "fd-link" }, null, -1)),
          t("span", On, "+" + c(s.rounds - 8), 1)
        ], 64)) : k("", !0),
        u[3] || (u[3] = t("span", { class: "fd-link" }, null, -1)),
        t("span", Tn, "≥ " + c(Math.round(s.confidence * 100)) + "%", 1)
      ]),
      t("figcaption", null, c(s.rounds ? `One pass, then up to ${s.rounds} rounds with up to ${s.extra} new queries each, stopping as soon as confidence reaches ${Math.round(s.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
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
    const s = e, a = F(() => Math.min(s.queries * s.perQuery, s.cap));
    return (u, d) => (n(), o("figure", Dn, [
      t("div", In, [
        t("span", jn, [
          t("b", null, c(e.fields), 1),
          q(" field" + c(e.fields === 1 ? "" : "s"), 1),
          t("small", null, c(e.parallel) + " at a time", 1)
        ]),
        t("span", zn, [
          t("b", null, c(e.queries), 1),
          d[0] || (d[0] = q(" queries", -1)),
          d[1] || (d[1] = t("small", null, "per field", -1))
        ]),
        t("span", Wn, [
          t("b", null, c(e.perQuery), 1),
          d[2] || (d[2] = q(" chunks", -1)),
          d[3] || (d[3] = t("small", null, "per query", -1))
        ]),
        t("span", Hn, [
          t("b", null, c(a.value), 1),
          d[4] || (d[4] = q(" chunks", -1)),
          t("small", null, c(e.queries * e.perQuery > e.cap ? `capped at ${e.cap}` : "read per field"), 1)
        ])
      ]),
      t("figcaption", null, "Each deep field gets its own queries; up to " + c(a.value) + " chunks are read for it before analysis.", 1)
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
}, Cs = /* @__PURE__ */ W({
  __name: "StepInspector",
  props: {
    stage: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const s = e, a = F(() => s.config.stages), u = (x) => Vl(s.stage, x), d = xl(), p = F(() => s.config.fields.filter((x) => x.strategy === "deep").length), g = F(() => s.config.fields.filter((x) => x.search_within === "sections").map((x) => x.name || "New field")), r = F(() => Et(s.config));
    function h(x) {
      x ? a.value.scout.agent_id = x : delete a.value.scout.agent_id;
    }
    function w(x, l) {
      const i = a.value.scout.tools.filter((L) => L !== x);
      a.value.scout.tools = l ? [...i, x] : i;
    }
    return (x, l) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", Qn, c(m(wl)[e.stage]), 1),
      e.stage === "map" ? (n(), o(U, { key: 0 }, [
        t("div", Jn, [
          l[33] || (l[33] = t("span", null, "Stage enabled", -1)),
          f(ee, {
            modelValue: a.value.map.enabled,
            "onUpdate:modelValue": l[0] || (l[0] = (i) => a.value.map.enabled = i),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Yn, [
          l[34] || (l[34] = t("span", { id: "outline-label" }, "Outline", -1)),
          f($e, {
            modelValue: a.value.map.outline,
            "onUpdate:modelValue": l[1] || (l[1] = (i) => a.value.map.outline = i),
            "labelled-by": "outline-label",
            options: [{ value: "find_or_build", label: "Use contents first" }, { value: "build", label: "Always build" }]
          }, null, 8, ["modelValue"]),
          l[35] || (l[35] = t("small", null, "The document's own headings are used when it has them; otherwise the model builds an outline.", -1))
        ]),
        t("div", Xn, [
          l[36] || (l[36] = t("span", null, [
            q("Section summaries"),
            t("small", null, "A short summary per section helps pick the right sections in long documents.")
          ], -1)),
          f(ee, {
            modelValue: a.value.map.section_summaries,
            "onUpdate:modelValue": l[2] || (l[2] = (i) => a.value.map.section_summaries = i),
            label: "Section summaries",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l[38] || (l[38] = t("h4", null, "Models", -1)),
        t("div", Zn, [
          l[37] || (l[37] = t("span", null, "Outliner", -1)),
          f(ce, {
            value: a.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: l[3] || (l[3] = (i) => a.value.map.model = i)
          }, null, 8, ["value"])
        ]),
        l[39] || (l[39] = t("h4", null, "Fields that read sections", -1)),
        g.value.length ? (n(), o("p", _n, [
          (n(!0), o(U, null, I(g.value, (i) => (n(), o("span", {
            key: i,
            class: "chip primary"
          }, c(i), 1))), 128))
        ])) : (n(), o("p", es, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : k("", !0),
      e.stage === "prefetch" ? (n(), o(U, { key: 1 }, [
        t("div", ts, [
          l[40] || (l[40] = t("span", null, "Stage enabled", -1)),
          f(ee, {
            modelValue: a.value.prefetch.enabled,
            "onUpdate:modelValue": l[4] || (l[4] = (i) => a.value.prefetch.enabled = i),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l[44] || (l[44] = t("h4", null, "Queries", -1)),
        (n(!0), o(U, null, I(a.value.prefetch.queries, (i, L) => (n(), o("div", {
          key: L,
          class: "query-row"
        }, [
          t("div", ls, [
            t("label", null, [
              l[41] || (l[41] = q("Name", -1)),
              z(t("input", {
                "onUpdate:modelValue": (A) => i.name = A,
                placeholder: "Parties"
              }, null, 8, as), [
                [Z, i.name]
              ])
            ]),
            t("label", null, [
              l[42] || (l[42] = q("Chunks", -1)),
              z(t("input", {
                "onUpdate:modelValue": (A) => i.chunks = A,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, ns), [
                [
                  Z,
                  i.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          t("label", null, [
            l[43] || (l[43] = q("Query", -1)),
            z(t("textarea", {
              "onUpdate:modelValue": (A) => i.query = A,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, ss), [
              [Z, i.query]
            ])
          ]),
          e.readonly ? k("", !0) : (n(), o("button", {
            key: 0,
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo sm",
            onClick: (A) => a.value.prefetch.queries.splice(L, 1)
          }, "Remove query", 8, os))
        ]))), 128)),
        a.value.prefetch.queries.length ? k("", !0) : (n(), o("p", is, "No fixed queries. Field search hints still run.")),
        e.readonly ? k("", !0) : (n(), o("button", {
          key: 1,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          onClick: l[5] || (l[5] = (i) => a.value.prefetch.queries.push(m(Sl)()))
        }, "Add query"))
      ], 64)) : k("", !0),
      e.stage === "scout" ? (n(), o(U, { key: 2 }, [
        t("div", us, [
          l[45] || (l[45] = t("span", null, "Stage enabled", -1)),
          f(ee, {
            modelValue: a.value.scout.enabled,
            "onUpdate:modelValue": l[6] || (l[6] = (i) => a.value.scout.enabled = i),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", ds, [
          l[46] || (l[46] = t("span", { id: "mode-label" }, "Mode", -1)),
          f($e, {
            modelValue: a.value.scout.mode,
            "onUpdate:modelValue": l[7] || (l[7] = (i) => a.value.scout.mode = i),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          t("small", null, c(a.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        a.value.scout.mode === "agent" ? (n(), J(wn, {
          key: 0,
          value: a.value.scout.agent_id,
          readonly: e.readonly,
          onSelect: h
        }, null, 8, ["value", "readonly"])) : k("", !0),
        a.value.scout.mode === "loop" ? (n(), J(Pn, {
          key: 1,
          rounds: a.value.scout.max_rounds,
          confidence: a.value.scout.target_confidence,
          extra: a.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"])) : k("", !0),
        l[51] || (l[51] = t("h4", null, "Models", -1)),
        t("div", rs, [
          l[47] || (l[47] = t("span", null, "Scout", -1)),
          f(ce, {
            value: a.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: l[8] || (l[8] = (i) => a.value.scout.model = i)
          }, null, 8, ["value"])
        ]),
        l[52] || (l[52] = t("h4", null, "Loop", -1)),
        f(le, {
          modelValue: a.value.scout.max_rounds,
          "onUpdate:modelValue": l[9] || (l[9] = (i) => a.value.scout.max_rounds = i),
          label: a.value.scout.mode === "agent" ? "Rounds" : "Follow-up rounds",
          min: u("max_rounds").min,
          max: u("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        a.value.scout.mode === "loop" ? (n(), J(le, {
          key: 2,
          modelValue: a.value.scout.target_confidence,
          "onUpdate:modelValue": l[10] || (l[10] = (i) => a.value.scout.target_confidence = i),
          label: "Stop at confidence",
          min: u("target_confidence").min,
          max: u("target_confidence").max,
          step: 0.05,
          percent: "",
          hints: ["Stop early", "Keep looking"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])) : k("", !0),
        f(le, {
          modelValue: a.value.scout.max_extra_queries,
          "onUpdate:modelValue": l[11] || (l[11] = (i) => a.value.scout.max_extra_queries = i),
          label: a.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: u("max_extra_queries").min,
          max: u("max_extra_queries").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        f(le, {
          modelValue: a.value.scout.max_tokens,
          "onUpdate:modelValue": l[12] || (l[12] = (i) => a.value.scout.max_tokens = i),
          label: "Scout output limit",
          min: u("max_tokens").min,
          max: u("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        a.value.scout.mode === "agent" ? (n(), o("p", cs, "Tool budget: " + c(a.value.scout.max_rounds * a.value.scout.max_extra_queries) + " calls.", 1)) : k("", !0),
        a.value.scout.mode === "loop" ? (n(), o("div", vs, [
          l[48] || (l[48] = t("span", null, [
            q("Drop noisy chunks"),
            t("small", null, "Chunks no field needs leave the evidence pool; chunks cited for a field always stay.")
          ], -1)),
          f(ee, {
            modelValue: a.value.scout.drop_noise,
            "onUpdate:modelValue": l[13] || (l[13] = (i) => a.value.scout.drop_noise = i),
            label: "Drop noisy chunks",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])) : k("", !0),
        t("div", ms, [
          l[49] || (l[49] = t("span", null, [
            q("Share scout notes with extraction"),
            t("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          f(ee, {
            modelValue: a.value.scout.share_notes,
            "onUpdate:modelValue": l[14] || (l[14] = (i) => a.value.scout.share_notes = i),
            label: "Share scout notes with extraction",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        a.value.scout.mode === "agent" ? (n(), o(U, { key: 5 }, [
          l[50] || (l[50] = t("h4", null, "Agent tools", -1)),
          (n(!0), o(U, null, I(m(d), (i) => (n(), o("div", {
            key: i,
            class: "toggle-row"
          }, [
            t("span", null, c(m(lt)(i)), 1),
            f(ee, {
              "model-value": a.value.scout.tools.includes(i),
              label: m(lt)(i),
              disabled: e.readonly,
              "onUpdate:modelValue": (L) => w(i, L)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : k("", !0)
      ], 64)) : k("", !0),
      e.stage === "deep" ? (n(), o(U, { key: 3 }, [
        t("div", ps, [
          l[53] || (l[53] = t("span", null, "Stage enabled", -1)),
          f(ee, {
            modelValue: a.value.deep.enabled,
            "onUpdate:modelValue": l[15] || (l[15] = (i) => a.value.deep.enabled = i),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        f(Gn, {
          fields: p.value,
          parallel: a.value.deep.parallel_fields,
          queries: a.value.deep.max_queries,
          "per-query": a.value.deep.chunks_per_query,
          cap: a.value.deep.chunk_cap
        }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"]),
        t("div", fs, [
          l[54] || (l[54] = t("span", { id: "read-label" }, "Reads", -1)),
          f($e, {
            modelValue: a.value.deep.read,
            "onUpdate:modelValue": l[16] || (l[16] = (i) => a.value.deep.read = i),
            "labelled-by": "read-label",
            options: [{ value: "chunks", label: "Retrieved chunks" }, { value: "sections", label: "Whole sections" }]
          }, null, 8, ["modelValue"]),
          l[55] || (l[55] = t("small", null, "Whole sections suit clauses that span many passages; long sections fall back to chunks.", -1))
        ]),
        l[58] || (l[58] = t("h4", null, "Models", -1)),
        t("div", bs, [
          l[56] || (l[56] = t("span", null, "Analysis", -1)),
          f(ce, {
            value: a.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: l[17] || (l[17] = (i) => a.value.deep.model = i)
          }, null, 8, ["value"])
        ]),
        t("div", hs, [
          l[57] || (l[57] = t("span", null, "Query writer", -1)),
          f(ce, {
            value: a.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: l[18] || (l[18] = (i) => a.value.deep.query_model = i)
          }, null, 8, ["value"])
        ]),
        l[59] || (l[59] = t("h4", null, "Reach", -1)),
        f(le, {
          modelValue: a.value.deep.parallel_fields,
          "onUpdate:modelValue": l[19] || (l[19] = (i) => a.value.deep.parallel_fields = i),
          label: "Fields at a time",
          min: u("parallel_fields").min,
          max: u("parallel_fields").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: a.value.deep.max_queries,
          "onUpdate:modelValue": l[20] || (l[20] = (i) => a.value.deep.max_queries = i),
          label: "Queries per field",
          min: u("max_queries").min,
          max: u("max_queries").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: a.value.deep.chunks_per_query,
          "onUpdate:modelValue": l[21] || (l[21] = (i) => a.value.deep.chunks_per_query = i),
          label: "Chunks per query",
          min: u("chunks_per_query").min,
          max: u("chunks_per_query").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: a.value.deep.chunk_cap,
          "onUpdate:modelValue": l[22] || (l[22] = (i) => a.value.deep.chunk_cap = i),
          label: "Chunk cap per field",
          min: u("chunk_cap").min,
          max: u("chunk_cap").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: a.value.deep.min_similarity,
          "onUpdate:modelValue": l[23] || (l[23] = (i) => a.value.deep.min_similarity = i),
          label: "Minimum similarity",
          min: u("min_similarity").min,
          max: u("min_similarity").max,
          step: 0.05,
          percent: "",
          hints: ["Loose", "Strict"],
          note: "Chunks less similar than this are skipped.",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        l[60] || (l[60] = t("h4", null, "Temperature", -1)),
        f(le, {
          modelValue: a.value.deep.query_temperature,
          "onUpdate:modelValue": l[24] || (l[24] = (i) => a.value.deep.query_temperature = i),
          label: "Query writing",
          min: u("query_temperature").min,
          max: u("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: a.value.deep.analysis_temperature,
          "onUpdate:modelValue": l[25] || (l[25] = (i) => a.value.deep.analysis_temperature = i),
          label: "Analysis",
          min: u("analysis_temperature").min,
          max: u("analysis_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : k("", !0),
      e.stage === "extract" ? (n(), o(U, { key: 4 }, [
        l[62] || (l[62] = t("h4", null, "Models", -1)),
        t("div", gs, [
          l[61] || (l[61] = t("span", null, "Extraction", -1)),
          f(ce, {
            value: a.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: l[26] || (l[26] = (i) => a.value.extract.model = i)
          }, null, 8, ["value"])
        ]),
        l[63] || (l[63] = t("h4", null, "Field groups", -1)),
        t("ul", ys, [
          (n(!0), o(U, null, I(r.value, (i) => (n(), o("li", {
            key: i.name
          }, [
            t("span", null, c(i.name), 1),
            t("span", ks, c(i.fields.length) + " field" + c(i.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        r.value.length ? k("", !0) : (n(), o("p", $s, "No fields yet.")),
        f(le, {
          modelValue: a.value.extract.max_fields_per_call,
          "onUpdate:modelValue": l[27] || (l[27] = (i) => a.value.extract.max_fields_per_call = i),
          label: "Fields per call",
          min: u("max_fields_per_call").min,
          max: u("max_fields_per_call").max,
          disabled: e.readonly,
          note: `${m(yt)(e.config)} extraction call${m(yt)(e.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        f(le, {
          modelValue: a.value.extract.max_output_tokens,
          "onUpdate:modelValue": l[28] || (l[28] = (i) => a.value.extract.max_output_tokens = i),
          label: "Output limit",
          min: u("max_output_tokens").min,
          max: u("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : k("", !0),
      e.stage === "verify" ? (n(), o(U, { key: 5 }, [
        t("div", xs, [
          l[64] || (l[64] = t("span", null, "Stage enabled", -1)),
          f(ee, {
            modelValue: a.value.verify.enabled,
            "onUpdate:modelValue": l[29] || (l[29] = (i) => a.value.verify.enabled = i),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", ws, [
          l[65] || (l[65] = t("span", null, [
            q("Quotes exist"),
            t("small", null, "Each quote is matched against the document text. No model call.")
          ], -1)),
          f(ee, {
            modelValue: a.value.verify.check_quotes,
            "onUpdate:modelValue": l[30] || (l[30] = (i) => a.value.verify.check_quotes = i),
            label: "Quotes exist",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Ss, [
          l[66] || (l[66] = t("span", null, [
            q("Quotes support values"),
            t("small", null, "A model confirms each quote supports its value.")
          ], -1)),
          f(ee, {
            modelValue: a.value.verify.check_support,
            "onUpdate:modelValue": l[31] || (l[31] = (i) => a.value.verify.check_support = i),
            label: "Quotes support values",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        a.value.verify.check_support ? (n(), o(U, { key: 0 }, [
          l[68] || (l[68] = t("h4", null, "Models", -1)),
          t("div", Vs, [
            l[67] || (l[67] = t("span", null, "Checker", -1)),
            f(ce, {
              value: a.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: l[32] || (l[32] = (i) => a.value.verify.model = i)
            }, null, 8, ["value"])
          ])
        ], 64)) : k("", !0)
      ], 64)) : k("", !0)
    ], 8, Kn));
  }
}), Es = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, qs = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, Fs = ["x", "y", "width"], Ns = ["x", "width"], Us = /* @__PURE__ */ W({
  __name: "ChunkDiagram",
  props: {
    size: {},
    overlap: {}
  },
  setup(e) {
    const s = e, a = F(() => Math.min(0.9, Math.max(0, s.overlap / s.size))), u = F(() => {
      const d = 100 / (3 - 2 * a.value);
      return [0, 1, 2].map((p) => ({ x: p * d * (1 - a.value), w: d }));
    });
    return (d, p) => (n(), o("figure", Es, [
      (n(), o("svg", qs, [
        (n(!0), o(U, null, I(u.value, (g, r) => (n(), o("rect", {
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
          x: u.value[g].x,
          y: 4,
          width: u.value[g - 1].x + u.value[g - 1].w - u.value[g].x,
          height: "24",
          class: "shared"
        }, null, 8, Ns)), 64))
      ])),
      t("figcaption", null, c(e.size.toLocaleString()) + " tokens per chunk · " + c(e.overlap.toLocaleString()) + " shared with the next (" + c(Math.round(a.value * 100)) + "%)", 1)
    ]));
  }
}), Ms = ["disabled"], As = { class: "muted" }, Rs = { class: "toggle-row" }, Bs = { class: "toggle-row" }, Ls = { class: "label-block" }, Os = {
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
}, js = /* @__PURE__ */ W({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const s = e, a = F(() => s.config.retrieval), u = F({ get: () => s.config.retention ?? "", set: (x) => {
      x.trim() ? s.config.retention = x.trim() : delete s.config.retention;
    } }), d = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], p = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], g = et("chunk_size"), r = et("overlap"), h = et("section_budget"), w = F(() => Math.min(r.max, a.value.chunk_size - 50));
    return (x, l) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", As, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + c(e.retention) + ".", 1),
      t("label", null, [
        l[12] || (l[12] = q("Retention window", -1)),
        z(t("input", {
          "onUpdate:modelValue": l[0] || (l[0] = (i) => u.value = i),
          "aria-label": "Retention window",
          placeholder: "Global setting"
        }, null, 512), [
          [Z, u.value]
        ]),
        l[13] || (l[13] = t("small", null, "Duration for new processed documents and runs, for example 24h. Leave empty to use the global Docscout setting. Existing records keep their expiry.", -1))
      ]),
      l[22] || (l[22] = t("h4", null, "Chunks", -1)),
      f(Us, {
        size: a.value.chunk_size,
        overlap: a.value.overlap
      }, null, 8, ["size", "overlap"]),
      f(le, {
        modelValue: a.value.chunk_size,
        "onUpdate:modelValue": l[1] || (l[1] = (i) => a.value.chunk_size = i),
        label: "Chunk size",
        min: m(g).min,
        max: m(g).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      f(le, {
        modelValue: a.value.overlap,
        "onUpdate:modelValue": l[2] || (l[2] = (i) => a.value.overlap = i),
        label: "Overlap",
        min: m(r).min,
        max: w.value,
        step: 10,
        unit: "tokens",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      t("div", Rs, [
        l[14] || (l[14] = t("span", null, [
          q("Split by headings"),
          t("small", null, "A chunk never crosses a heading.")
        ], -1)),
        f(ee, {
          modelValue: a.value.split_headings,
          "onUpdate:modelValue": l[3] || (l[3] = (i) => a.value.split_headings = i),
          label: "Split by headings",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t("div", Bs, [
        l[15] || (l[15] = t("span", null, [
          q("Keep tables whole"),
          t("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        f(ee, {
          modelValue: a.value.keep_tables,
          "onUpdate:modelValue": l[4] || (l[4] = (i) => a.value.keep_tables = i),
          label: "Keep tables whole",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      f(le, {
        modelValue: a.value.section_budget,
        "onUpdate:modelValue": l[5] || (l[5] = (i) => a.value.section_budget = i),
        label: "Section budget",
        min: m(h).min,
        max: m(h).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      l[23] || (l[23] = t("h4", null, "Context", -1)),
      t("div", Ls, [
        l[16] || (l[16] = t("span", { id: "context-label" }, "Chunk context", -1)),
        f($e, {
          modelValue: a.value.context,
          "onUpdate:modelValue": l[6] || (l[6] = (i) => a.value.context = i),
          "labelled-by": "context-label",
          options: p
        }, null, 8, ["modelValue"]),
        t("small", null, c(p.find((i) => i.value === a.value.context)?.note), 1)
      ]),
      a.value.context === "generated" ? (n(), o("div", Os, [
        l[17] || (l[17] = t("span", null, "Context writer", -1)),
        f(ce, {
          value: a.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: l[7] || (l[7] = (i) => a.value.context_model = i)
        }, null, 8, ["value"])
      ])) : k("", !0),
      l[24] || (l[24] = t("h4", null, "Search", -1)),
      t("div", Ts, [
        l[18] || (l[18] = t("span", { id: "mode-label" }, "Search mode", -1)),
        f($e, {
          modelValue: a.value.search_mode,
          "onUpdate:modelValue": l[8] || (l[8] = (i) => a.value.search_mode = i),
          "labelled-by": "mode-label",
          options: d
        }, null, 8, ["modelValue"]),
        t("small", null, c(d.find((i) => i.value === a.value.search_mode)?.note), 1)
      ]),
      l[25] || (l[25] = t("h4", null, "Models", -1)),
      t("div", Ps, [
        l[19] || (l[19] = t("span", null, "Embedding", -1)),
        f(ce, {
          value: a.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: l[9] || (l[9] = (i) => a.value.embedding_model = i)
        }, null, 8, ["value"])
      ]),
      t("div", Ds, [
        l[20] || (l[20] = t("span", null, [
          q("Highlighter"),
          t("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        f(ee, {
          modelValue: a.value.highlighter,
          "onUpdate:modelValue": l[10] || (l[10] = (i) => a.value.highlighter = i),
          label: "Highlighter",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      a.value.highlighter ? (n(), o("div", Is, [
        l[21] || (l[21] = t("span", null, "Highlighter", -1)),
        f(ce, {
          value: a.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: l[11] || (l[11] = (i) => a.value.highlighter_model = i)
        }, null, 8, ["value"])
      ])) : k("", !0)
    ], 8, Ms));
  }
}), zs = ["inert"], Ws = { class: "canvas-inner" }, Hs = {
  class: "block fields-block",
  "aria-labelledby": "fields-head"
}, Gs = { class: "block-head" }, Ks = ["aria-expanded"], Qs = { class: "count" }, Js = {
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
}, ho = { class: "node-icon" }, go = { class: "node-main" }, yo = { class: "node-summary" }, ko = { class: "node-side" }, $o = { class: "chip model" }, xo = { class: "branches" }, wo = { class: "branch" }, So = { class: "branch" }, Vo = { class: "node-icon" }, Co = { class: "node-main" }, Eo = { class: "node-summary" }, qo = ["aria-labelledby", "role", "aria-modal"], Fo = ["aria-valuenow"], No = { class: "side-panel-head" }, Uo = { class: "side-panel-icon" }, Mo = ["id"], Ao = ["aria-label", "title"], Ro = { class: "node-breadcrumb mono" }, Bo = {
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
}, jo = { class: "output-list" }, zo = { class: "mono" }, Wo = { class: "chip" }, Ho = { class: "rail-label" }, tt = 400, We = 320, Go = /* @__PURE__ */ W({
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
    const s = e, a = Le(e, "title"), u = Le(e, "description"), d = N({ kind: "document" });
    function p(y, v) {
      try {
        const V = localStorage.getItem(`docscout.${y}`);
        return V === null ? v : V === "1";
      } catch {
        return v;
      }
    }
    function g(y, v) {
      try {
        localStorage.setItem(`docscout.${y}`, v ? "1" : "0");
      } catch {
      }
    }
    const r = N(p("panel", !0)), h = N(p("fields", !0)), w = N(p("flow", !0));
    function x() {
      try {
        const y = Number(localStorage.getItem("docscout.panelWidth"));
        return y >= We ? y : tt;
      } catch {
        return tt;
      }
    }
    const l = N(x()), i = () => {
      const y = O.value?.clientWidth;
      return y ? Math.max(We, y - 420) : Number.POSITIVE_INFINITY;
    };
    function L(y, v = !0) {
      if (l.value = Math.round(Math.min(i(), Math.max(We, y))), v)
        try {
          localStorage.setItem("docscout.panelWidth", String(l.value));
        } catch {
        }
    }
    const A = N(!1);
    function C(y) {
      const v = y.currentTarget, V = y.clientX, Y = l.value;
      v.setPointerCapture(y.pointerId), A.value = !0;
      const X = (_) => L(Y + (V - _.clientX), !1), ae = () => {
        A.value = !1, L(l.value), v.removeEventListener("pointermove", X), v.removeEventListener("pointerup", ae);
      };
      v.addEventListener("pointermove", X), v.addEventListener("pointerup", ae);
    }
    function E(y) {
      y.key === "ArrowLeft" ? (L(l.value + 24), y.preventDefault()) : y.key === "ArrowRight" && (L(l.value - 24), y.preventDefault());
    }
    let K = null;
    const D = N(), j = pe();
    async function H(y) {
      if (r.value = y, !R.value) {
        g("panel", y);
        return;
      }
      if (!y && K) {
        const v = K;
        K = null, await Ce(), v.focus();
      }
    }
    function T(y) {
      const v = y === "fields" ? h : w;
      v.value = !v.value, g(y, v.value);
    }
    const O = N(), R = N(!1);
    let ue;
    Fe(() => {
      ue = new ResizeObserver(([y]) => {
        const v = R.value;
        R.value = y.contentRect.width < 1e3, R.value && !v && (r.value = !1), !R.value && v && (r.value = p("panel", !0));
      }), O.value && ue.observe(O.value);
    }), Ct(() => ue?.disconnect());
    const ye = N();
    fe(d, async () => {
      await Ce(), ye.value && (ye.value.scrollTop = 0);
    });
    async function te(y) {
      R.value && !r.value && (K = O.value?.getRootNode()?.activeElement), d.value = y, r.value = !0, R.value && (await Ce(), D.value?.focus());
    }
    const oe = (y) => JSON.stringify(y) === JSON.stringify(d.value), be = F(() => d.value.kind === "field" ? s.config.fields[d.value.index] : void 0), S = F(() => Je(s.config.fields)), b = F(() => d.value.kind === "field" ? S.value.find((y) => y.key === ie(d.value.index, d.value.trail ?? [])) : void 0), $ = F(() => b.value?.key ?? ""), B = F(() => {
      const y = b.value;
      return !y || y.trail.at(-1) === "item" || !y.trail.length ? void 0 : S.value.find((V) => V.key === ie(y.field, y.trail.slice(0, -1))).shape.properties.filter((V) => V !== y.shape).map((V) => V.name);
    }), P = N("");
    fe($, () => {
      P.value = "";
    });
    const Ne = F(() => b.value ? Yl(s.config.fields, b.value) : []), he = F(() => {
      const y = Cl(s.config.fields.map(G));
      return y ? `Group path collides with field ${y}.` : "";
    }), Pe = F(() => he.value ? null : Vt(s.config.fields)), Tt = F(() => he.value ? null : Vt(s.config.fields, !0)), it = F(() => {
      const y = d.value;
      return y.kind === "stage" ? ke[y.stage] : y.kind === "field" ? b.value?.trail.length ? b.value.path : be.value?.name || "New field" : y.kind === "document" ? "Read document" : y.kind === "output" ? "Output" : "Details";
    }), Pt = F(() => {
      const y = d.value;
      return y.kind === "stage" ? ot[y.stage] : y.kind === "field" ? "tabler:forms" : y.kind === "document" ? "tabler:file-text" : y.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), Dt = F(() => s.config.fields.filter((y, v) => !(d.value.kind === "field" && d.value.index === v)).map(G)), It = F(() => s.config.stages.deep.enabled), jt = F(() => s.config.stages.map.enabled), zt = F(() => Oe(s.config.fields.map(G))), De = N(!1), ut = N(), dt = pe();
    function Wt(y, v) {
      for (const V of s.config.fields) (V.group === y || V.group.startsWith(y + ".")) && (V.group = v + V.group.slice(y.length));
    }
    const Ht = (y) => 320 - Math.max(0, ...s.config.fields.filter((v) => v.group === y || v.group.startsWith(y + ".")).map((v) => v.group.length - y.length));
    function Gt() {
      h.value = !0, De.value = !0;
    }
    async function rt() {
      De.value = !1, await Ce(), ut.value.focus();
    }
    function Kt(y) {
      s.config.fields.push({ ...at(), group: y }), rt();
    }
    const Qt = F(() => [...new Set(s.config.fields.map((y) => y.group.trim()).filter(Boolean))]), Jt = (y) => Ut(s.config.fields[y], s.config.fields.filter((v, V) => V !== y).map(G)), ct = ["map", "prefetch", "scout", "deep", "extract", "verify"], Yt = F(() => ct.filter((y) => Qe(s.config, y)).map((y) => ke[y]).join(" · ")), Xt = F(() => s.config.fields.map((y) => y.name || "New field").join(", ")), Zt = F(() => ct.filter((y) => Qe(s.config, y)).length), xe = (y) => s.result?.trace.find((v) => v.kind === y);
    function vt(y = "") {
      s.config.fields.push({ ...at(), group: y }), h.value = !0, te({ kind: "field", index: s.config.fields.length - 1 });
    }
    function _t(y) {
      s.config.fields.splice(y, 1), d.value = { kind: "document" };
    }
    function re(y, v = []) {
      te({ kind: "field", index: y, ...v.length ? { trail: v } : {} });
    }
    function mt(y, v) {
      const V = S.value.find((Y) => Y.key === ie(y, v));
      V.shape.properties.push(Nt()), re(y, [...v, V.shape.properties.length - 1]);
    }
    function el() {
      const y = b.value;
      if (!y.trail.length) {
        _t(y.field);
        return;
      }
      const v = S.value.find((V) => V.key === ie(y.field, y.trail.slice(0, -1)));
      v.shape.properties.splice(y.trail.at(-1), 1), re(v.field, v.trail);
    }
    function tl(y, v, V) {
      if (v.length) {
        const X = S.value.find((ne) => ne.key === ie(y, v.slice(0, -1))).shape.properties, ae = v.at(-1), _ = ae + V;
        if (_ < 0 || _ >= X.length) return;
        [X[ae], X[_]] = [X[_], X[ae]], re(y, [...v.slice(0, -1), _]);
      } else {
        const Y = s.config.fields.map((_, ne) => _.group === s.config.fields[y].group ? ne : -1).filter((_) => _ >= 0), X = Y[Y.indexOf(y) + V];
        if (X === void 0) return;
        const ae = s.config.fields;
        [ae[y], ae[X]] = [ae[X], ae[y]], re(X);
      }
    }
    function ll() {
      const y = b.value, v = Ne.value.find((Y) => Y.key === P.value), V = Xl(s.config.fields, y, v);
      re(V.field, V.trail);
    }
    function al(y) {
      const v = b.value?.shape;
      s.config.fields.splice(0, s.config.fields.length, ...s.config.fields.filter((Y) => Y.group !== y && !Y.group.startsWith(y + ".")));
      const V = S.value.find((Y) => Y.shape === v);
      V ? re(V.field, V.trail) : d.value = { kind: "document" };
    }
    function nl(y, v) {
      const V = y.split(".").slice(0, -1).join(".");
      let X = Oe(s.config.fields.map(G));
      for (const se of V.split(".").filter(Boolean)) X = X.children.find((ul) => ul.name === se);
      const ae = X.children.findIndex((se) => se.path === y), _ = X.children[ae + v]?.path;
      if (!_) return;
      const ne = s.config.fields.filter((se) => se.group === y || se.group.startsWith(y + ".")), Ie = s.config.fields.filter((se) => se.group === _ || se.group.startsWith(_ + ".")), Ue = s.config.fields, ol = Math.min(Ue.indexOf(ne[0]), Ue.indexOf(Ie[0])), ft = Ue.filter((se) => !ne.includes(se) && !Ie.includes(se));
      ft.splice(ol, 0, ...v > 0 ? [...Ie, ...ne] : [...ne, ...Ie]);
      const il = b.value?.shape;
      Ue.splice(0, Ue.length, ...ft);
      const _e = S.value.find((se) => se.shape === il);
      _e && re(_e.field, _e.trail);
    }
    const sl = (y) => y.type === "list" ? `list of ${y.item?.type}` : y.type, pt = F({ get: () => s.config.tags.join(", "), set: (y) => {
      s.config.tags = [...new Set(y.split(",").map((v) => v.trim()).filter(Boolean))];
    } });
    return (y, v) => (n(), o("div", {
      ref_key: "root",
      ref: O,
      class: Q(["builder", { narrow: R.value, "panel-open": r.value, resizing: A.value }])
    }, [
      t("div", {
        class: "canvas",
        inert: R.value && r.value
      }, [
        t("div", Ws, [
          t("section", Hs, [
            t("header", Gs, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": h.value,
                "aria-controls": "fields-body",
                onClick: v[0] || (v[0] = (V) => T("fields"))
              }, [
                f(m(M), {
                  icon: h.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                v[23] || (v[23] = t("h2", { id: "fields-head" }, "Fields", -1)),
                t("span", Qs, c(e.config.fields.length), 1)
              ], 8, Ks),
              !h.value && e.config.fields.length ? (n(), o("span", Js, c(Xt.value), 1)) : k("", !0),
              e.readonly ? k("", !0) : (n(), o("div", Ys, [
                t("button", {
                  ref_key: "addGroupButton",
                  ref: ut,
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  "aria-label": "Add group",
                  "aria-expanded": De.value,
                  "aria-controls": m(dt),
                  disabled: e.config.fields.length >= 100,
                  onClick: Gt
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
            z(t("div", _s, [
              e.config.fields.length ? k("", !0) : (n(), o("p", eo, "Add the values to pull from each document.")),
              t("div", to, [
                De.value && !e.readonly ? (n(), o("div", {
                  key: 0,
                  id: m(dt),
                  class: "group-create-row"
                }, [
                  t("span", ao, [
                    f(m(M), { icon: "tabler:folder-plus" })
                  ]),
                  f(Rt, {
                    "input-label": "New group path",
                    "save-label": "Create group",
                    "cancel-label": "Cancel group creation",
                    onSave: Kt,
                    onCancel: rt
                  })
                ], 8, lo)) : k("", !0),
                f(Re, { node: zt.value }, {
                  header: me(({ path: V, label: Y, count: X, first: ae, last: _ }) => [
                    f(Ka, {
                      path: V,
                      name: Y,
                      count: X,
                      first: ae,
                      last: _,
                      "max-length": Ht(V),
                      "can-add": e.config.fields.length < 100,
                      readonly: e.readonly,
                      onRename: (ne) => Wt(V, ne),
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
                      path: m(G)(e.config.fields[V]) || "New field",
                      selected: $.value,
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
              [Ke, h.value]
            ])
          ]),
          t("section", co, [
            t("header", vo, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": w.value,
                "aria-controls": "flow-body",
                onClick: v[2] || (v[2] = (V) => T("flow"))
              }, [
                f(m(M), {
                  icon: w.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                v[30] || (v[30] = t("h2", { id: "flow-head" }, "Flow", -1)),
                t("span", po, c(Zt.value) + " of 6", 1)
              ], 8, mo),
              w.value ? k("", !0) : (n(), o("span", fo, c(Yt.value), 1)),
              t("button", {
                type: "button",
                class: Q(["kx-btn kx-btn-ghost kx-focus-halo sm push", { on: oe({ kind: "details" }) }]),
                onClick: v[3] || (v[3] = (V) => te({ kind: "details" }))
              }, [
                f(m(M), { icon: "tabler:info-circle" }),
                v[31] || (v[31] = q("Details", -1))
              ], 2)
            ]),
            z(t("div", bo, [
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
              [Ke, w.value]
            ])
          ])
        ])
      ], 8, zs),
      R.value && r.value ? (n(), o("div", {
        key: 0,
        class: "scrim",
        onClick: v[12] || (v[12] = (V) => H(!1))
      })) : k("", !0),
      r.value ? z((n(), o("aside", {
        key: String(R.value),
        class: "side-panel",
        "aria-labelledby": m(j),
        role: R.value ? "dialog" : void 0,
        "aria-modal": R.value ? "true" : void 0,
        style: qe(R.value ? void 0 : { width: `${l.value}px` }),
        onKeydown: v[21] || (v[21] = Ee((V) => R.value && H(!1), ["esc"]))
      }, [
        R.value ? k("", !0) : (n(), o("div", {
          key: 0,
          class: Q(["resizer kx-focus-outline", { active: A.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": l.value,
          "aria-valuemin": We,
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
            "aria-label": R.value ? "Close panel" : "Collapse panel",
            title: R.value ? "Close panel" : "Collapse panel",
            onClick: v[14] || (v[14] = (V) => H(!1))
          }, [
            f(m(M), {
              icon: R.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ], 8, Ao)
        ]),
        t("div", {
          ref_key: "panelBody",
          ref: ye,
          class: "side-panel-body"
        }, [
          d.value.kind === "document" ? (n(), J(js, {
            key: 0,
            config: e.config,
            retention: e.retention,
            readonly: e.readonly
          }, null, 8, ["config", "retention", "readonly"])) : d.value.kind === "stage" ? (n(), J(Cs, {
            key: 1,
            stage: d.value.stage,
            config: e.config,
            readonly: e.readonly
          }, null, 8, ["stage", "config", "readonly"])) : d.value.kind === "field" && be.value && b.value ? (n(), o(U, { key: 2 }, [
            t("p", Ro, c(b.value.path), 1),
            f(qa, {
              field: be.value,
              shape: b.value.shape,
              depth: b.value.depth,
              "sibling-names": B.value,
              "other-names": Dt.value,
              groups: Qt.value,
              "deep-enabled": It.value,
              "map-enabled": jt.value,
              readonly: e.readonly,
              onRemove: el,
              onAdd: v[15] || (v[15] = (V) => mt(b.value.field, b.value.trail)),
              onSelectItem: v[16] || (v[16] = (V) => re(b.value.field, [...b.value.trail, "item"]))
            }, null, 8, ["field", "shape", "depth", "sibling-names", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"]),
            !e.readonly && b.value.trail.at(-1) !== "item" ? (n(), o("fieldset", Bo, [
              t("label", null, [
                v[42] || (v[42] = q("Move to parent", -1)),
                z(t("select", {
                  "onUpdate:modelValue": v[17] || (v[17] = (V) => P.value = V),
                  "aria-label": "Move to parent"
                }, [
                  b.value.trail.length ? (n(), o("option", Lo, "Top-level field")) : (n(), o("option", Oo, "Choose an object…")),
                  (n(!0), o(U, null, I(Ne.value, (V) => (n(), o("option", {
                    key: V.key,
                    value: V.key
                  }, c(V.path), 9, To))), 128))
                ], 512), [
                  [Ge, P.value]
                ])
              ]),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Move selected node",
                disabled: !P.value && !b.value.trail.length || !P.value && e.config.fields.length >= 100,
                onClick: ll
              }, "Move", 8, Po)
            ])) : k("", !0)
          ], 64)) : d.value.kind === "details" ? (n(), o("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: e.readonly
          }, [
            t("label", null, [
              v[43] || (v[43] = q("Name", -1)),
              z(t("input", {
                "onUpdate:modelValue": v[18] || (v[18] = (V) => a.value = V),
                "aria-label": "Extractor name"
              }, null, 512), [
                [Z, a.value]
              ])
            ]),
            t("label", null, [
              v[44] || (v[44] = q("Description", -1)),
              z(t("textarea", {
                "onUpdate:modelValue": v[19] || (v[19] = (V) => u.value = V),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [Z, u.value]
              ])
            ]),
            t("label", null, [
              v[45] || (v[45] = q("Tags", -1)),
              z(t("input", {
                "onUpdate:modelValue": v[20] || (v[20] = (V) => pt.value = V),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  Z,
                  pt.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              v[46] || (v[46] = t("small", null, "Comma separated", -1))
            ])
          ], 8, Do)) : d.value.kind === "output" ? (n(), o("div", Io, [
            v[47] || (v[47] = t("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            t("ul", jo, [
              (n(!0), o(U, null, I(e.config.fields, (V) => (n(), o("li", {
                key: m(G)(V)
              }, [
                t("span", zo, c(m(G)(V) || "New field"), 1),
                t("span", Wo, c(sl(V)), 1)
              ]))), 128))
            ]),
            v[48] || (v[48] = t("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : k("", !0)
        ], 512)
      ], 44, qo)), [
        [m(Ll), { disabled: !R.value }]
      ]) : R.value ? k("", !0) : (n(), o("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: v[22] || (v[22] = (V) => H(!0))
      }, [
        f(m(M), { icon: "tabler:layout-sidebar-right-expand" }),
        t("span", Ho, c(it.value), 1)
      ]))
    ], 2));
  }
}), Ko = ["selected"], Qo = {
  key: 1,
  role: "alert"
}, Jo = {
  key: 2,
  class: "muted"
}, Bt = /* @__PURE__ */ W({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(e, { emit: s }) {
    const a = s, u = N(!1), d = N("");
    Fe(async () => {
      try {
        await Ze("wc-multiselect", { timeoutMs: 8e3 }), u.value = !0;
      } catch (g) {
        d.value = String(g);
      }
    });
    function p(g) {
      const r = g.detail;
      a("select", r.selected[0] || "", r.labels?.[0] || "");
    }
    return (g, r) => u.value ? (n(), o("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(e.value ? [e.value] : []),
      placeholder: "Choose an upload",
      onChange: p
    }, null, 40, Ko)) : d.value ? (n(), o("p", Qo, c(d.value), 1)) : (n(), o("span", Jo, "Loading uploads…"));
  }
}), Yo = ["data-error-kind"], Xo = { key: 0 }, Lt = /* @__PURE__ */ W({
  __name: "FieldFailure",
  props: {
    error: {}
  },
  setup(e) {
    return (s, a) => (n(), o("div", {
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
        a[0] || (a[0] = t("summary", { class: "kx-focus-outline" }, "Error details", -1)),
        t("pre", null, c(JSON.stringify(e.error.details, null, 2)), 1)
      ])) : k("", !0)
    ], 8, Yo));
  }
}), Zo = { class: "nested-value" }, _o = { key: 0 }, ei = {
  key: 0,
  class: "muted"
}, ti = { key: 1 }, li = { key: 2 }, Be = /* @__PURE__ */ W({
  __name: "NestedValue",
  props: {
    value: {}
  },
  setup(e) {
    const s = e, a = F(() => s.value !== null && typeof s.value == "object" && !Array.isArray(s.value) ? s.value : null);
    return (u, d) => {
      const p = st("NestedValue", !0);
      return n(), o("div", Zo, [
        Array.isArray(e.value) ? (n(), o("ol", _o, [
          (n(!0), o(U, null, I(e.value, (g, r) => (n(), o("li", { key: r }, [
            f(p, { value: g }, null, 8, ["value"])
          ]))), 128)),
          e.value.length ? k("", !0) : (n(), o("li", ei, "Empty list"))
        ])) : a.value ? (n(), o("dl", ti, [
          (n(!0), o(U, null, I(a.value, (g, r) => (n(), o(U, { key: r }, [
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
}, Ot = /* @__PURE__ */ W({
  __name: "ResultFields",
  props: {
    fields: {}
  },
  setup(e) {
    const s = e, a = F(() => Oe(s.fields.map((h) => h.path))), u = N(), d = (h) => `${Math.round(h * 100)}%`, p = (h) => h !== null && typeof h == "object", g = (h) => Array.isArray(h) ? `${h.length} items` : p(h) ? `${Object.keys(h).length} properties` : h == null ? "—" : String(h), r = (h) => h >= 0.9 ? "high" : h >= 0.7 ? "mid" : "low";
    return (h, w) => (n(), o("div", ai, [
      f(Re, { node: a.value }, {
        default: me(({ index: x }) => [
          (n(!0), o(U, null, I([e.fields[x]], (l) => (n(), o("div", {
            key: l.path,
            class: "value-row"
          }, [
            t("button", {
              type: "button",
              class: "value-main",
              "aria-expanded": u.value === l.path,
              onClick: (i) => u.value = u.value === l.path ? void 0 : l.path
            }, [
              t("span", si, c(l.name), 1),
              t("span", {
                class: Q(["value-text", { missing: l.missing }])
              }, c(l.failed ? "Failed" : l.missing ? "Not in the document" : g(l.value)), 3),
              l.failed ? k("", !0) : (n(), o("span", {
                key: 0,
                class: Q(["confidence", r(l.confidence)])
              }, [
                t("span", oi, [
                  t("span", {
                    style: qe({ width: d(l.confidence) })
                  }, null, 4)
                ]),
                q(c(d(l.confidence)), 1),
                w[0] || (w[0] = t("span", { class: "conf-word" }, " confidence", -1))
              ], 2)),
              l.failed ? k("", !0) : (n(), o("span", {
                key: 1,
                class: Q(["chip", l.verified ? "primary" : "warn"]),
                title: l.reason
              }, [
                f(m(M), {
                  icon: l.verified ? "tabler:shield-check" : "tabler:shield-question"
                }, null, 8, ["icon"]),
                q(c(l.verified ? "Verified" : "Check"), 1)
              ], 10, ii)),
              f(m(M), {
                icon: u.value === l.path ? "tabler:chevron-up" : "tabler:chevron-down",
                class: "value-caret"
              }, null, 8, ["icon"])
            ], 8, ni),
            !l.failed && !l.missing && p(l.value) ? (n(), J(Be, {
              key: 0,
              class: "structured-value",
              value: l.value
            }, null, 8, ["value"])) : k("", !0),
            l.failed ? (n(), J(Lt, {
              key: 1,
              error: l.error
            }, null, 8, ["error"])) : k("", !0),
            z(t("div", ui, [
              !l.failed && !l.missing && !p(l.value) ? (n(), J(Be, {
                key: 0,
                value: l.value
              }, null, 8, ["value"])) : k("", !0),
              (n(!0), o(U, null, I(l.evidence, (i, L) => (n(), o("blockquote", {
                key: L,
                class: Q({ unfound: i.found === !1 })
              }, [
                t("p", null, "“" + c(i.quote) + "”", 1),
                t("cite", null, [
                  q(c(i.section), 1),
                  i.page !== void 0 && i.page !== null ? (n(), o(U, { key: 0 }, [
                    q(" · Page " + c(i.page), 1)
                  ], 64)) : k("", !0),
                  i.found === !1 ? (n(), o(U, { key: 1 }, [
                    q(" · not found word for word in the document")
                  ], 64)) : k("", !0)
                ])
              ], 2))), 128)),
              l.evidence.length ? k("", !0) : (n(), o("p", di, "No evidence.")),
              l.reason || !l.verified && !l.failed ? (n(), o("p", ri, c(l.reason || "No reason recorded"), 1)) : k("", !0)
            ], 512), [
              [Ke, u.value === l.path && !l.failed]
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
}, Mi = /* @__PURE__ */ W({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {},
    running: { type: Boolean },
    canRun: { type: Boolean }
  },
  emits: ["run"],
  setup(e, { emit: s }) {
    const a = e, u = s, d = N(""), p = (x) => `${(x / 1e3).toFixed(1)}s`, g = F(() => Math.max(1, ...a.result?.trace.map((x) => x.duration_ms) ?? [1])), r = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, h = (x) => r[x]?.label ?? ke[x] ?? x, w = (x) => r[x]?.icon ?? ot[x] ?? "tabler:point";
    return (x, l) => (n(), o("div", ci, [
      t("section", vi, [
        t("div", mi, [
          f(Bt, {
            value: d.value,
            onSelect: l[0] || (l[0] = (i) => d.value = i)
          }, null, 8, ["value"])
        ]),
        f(m(de), {
          label: e.running ? "Extracting…" : "Run extraction",
          loading: e.running,
          disabled: !d.value || e.running || !e.canRun,
          onClick: l[1] || (l[1] = (i) => u("run", d.value))
        }, null, 8, ["label", "loading", "disabled"]),
        t("p", pi, c(e.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + c(e.retention) + ".", 1)
      ]),
      e.result ? k("", !0) : (n(), o("p", fi, "No extraction results yet.")),
      e.result?.status === "failed" ? (n(), o("p", bi, [
        f(m(M), { icon: "tabler:alert-triangle" }),
        q("The run stopped: " + c(e.result.error), 1)
      ])) : k("", !0),
      e.result?.status === "partial" ? (n(), o("p", hi, [
        f(m(M), { icon: "tabler:alert-triangle" }),
        l[2] || (l[2] = q("Partial result · Some fields failed. Successful values are available below.", -1))
      ])) : k("", !0),
      e.result ? (n(), o("div", gi, [
        t("section", yi, [
          t("header", ki, [
            l[3] || (l[3] = t("h2", { class: "block-title" }, "Values", -1)),
            t("span", $i, [
              q(c(e.result.tokens.toLocaleString()) + " tokens · " + c(p(e.result.duration_ms)), 1),
              e.result.pages ? (n(), o(U, { key: 0 }, [
                q(" · " + c(e.result.pages) + " pages", 1)
              ], 64)) : k("", !0)
            ])
          ]),
          f(Ot, {
            fields: e.result.fields
          }, null, 8, ["fields"])
        ]),
        t("section", xi, [
          l[4] || (l[4] = t("header", { class: "block-head" }, [
            t("h2", { class: "block-title" }, "Steps")
          ], -1)),
          t("ol", wi, [
            (n(!0), o(U, null, I(e.result.trace, (i, L) => (n(), o("li", {
              key: L,
              class: Q(i.status)
            }, [
              t("span", Si, [
                f(m(M), {
                  icon: w(i.kind)
                }, null, 8, ["icon"])
              ]),
              t("div", Vi, [
                t("div", Ci, [
                  t("strong", null, c(h(i.kind)), 1),
                  t("span", Ei, c(p(i.duration_ms)), 1)
                ]),
                t("span", qi, [
                  t("span", {
                    style: qe({ width: `${Math.max(4, i.duration_ms / g.value * 100)}%` })
                  }, null, 4)
                ]),
                t("p", Fi, [
                  q(c(i.scope), 1),
                  i.model ? (n(), o(U, { key: 0 }, [
                    q(" · " + c(i.model), 1)
                  ], 64)) : k("", !0),
                  q(" · " + c((i.input_tokens + i.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                i.message ? (n(), o("p", Ni, c(i.message), 1)) : k("", !0),
                i.queries?.length ? (n(), o("div", Ui, [
                  (n(!0), o(U, null, I(i.queries, (A) => (n(), o("span", {
                    key: A,
                    class: "chip"
                  }, c(A), 1))), 128))
                ])) : k("", !0)
              ])
            ], 2))), 128))
          ])
        ])
      ])) : k("", !0)
    ]));
  }
}), He = (e) => e.status === "completed" || e.status === "partial" || e.status === "failed", Ve = (e) => e.metrics.length ? e.metrics.reduce((s, a) => s + a.accuracy, 0) / e.metrics.length : 0;
function Ye(e, s = /* @__PURE__ */ new Date()) {
  const a = new Date(e);
  return a.toDateString() === s.toDateString() ? a.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" }) : a.getFullYear() === s.getFullYear() ? a.toLocaleString(void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : a.toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
}
const Ai = { class: "evals" }, Ri = { class: "block eval-run" }, Bi = { class: "eval-run-main" }, Li = { class: "block-title" }, Oi = {
  key: 0,
  class: "eval-note"
}, Ti = {
  key: 0,
  class: "eval-progress",
  role: "status"
}, Pi = { class: "bar" }, Di = { class: "muted" }, Ii = { class: "stat-row" }, ji = { class: "stat" }, zi = { class: "stat-label" }, Wi = { class: "stat-value" }, Hi = { class: "stat" }, Gi = { class: "stat-value" }, Ki = { class: "stat-delta flat" }, Qi = { class: "stat" }, Ji = { class: "stat-value" }, Yi = {
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
}, Eu = ["colspan"], qu = ["data-error-kind", "title"], Fu = { class: "mono" }, Nu = { class: "cmp" }, Uu = { class: "cmp" }, Mu = { key: 0 }, Au = { class: "muted case-meta" }, Ru = { class: "block" }, Bu = { class: "block-head" }, Lu = { class: "count" }, Ou = { class: "mono" }, Tu = ["onUpdate:modelValue"], Pu = ["onUpdate:modelValue"], Du = ["onUpdate:modelValue", "placeholder"], Iu = ["onUpdate:modelValue", "type"], ju = {
  key: 0,
  class: "error",
  role: "alert"
}, zu = { class: "row" }, Wu = {
  key: 1,
  class: "block-empty"
}, Hu = {
  key: 2,
  class: "block-empty"
}, Gu = {
  key: 3,
  class: "table-scroll"
}, Ku = { class: "metric-table case-table" }, Qu = { class: "case-value" }, Ju = {
  key: 1,
  class: "muted"
}, Yu = { class: "num" }, Xu = ["aria-label", "disabled", "onClick"], Zu = {
  key: 2,
  class: "block"
}, _u = { class: "block-head" }, ed = { class: "count" }, td = { class: "eval-history" }, ld = ["aria-current", "onClick"], ad = ["data-status"], nd = { class: "muted" }, sd = { class: "push" }, od = /* @__PURE__ */ W({
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
    const a = e, u = s, d = N(!1), p = N(""), g = N({}), r = N("");
    fe(() => a.addedCaseId, () => {
      d.value = !1, p.value = "", g.value = {};
    });
    function h(S, b) {
      return S.type === "number" ? Number(b) : S.type === "boolean" ? b === "true" : S.type === "list" || S.type === "object" ? JSON.parse(b) : b;
    }
    function w() {
      r.value = "";
      const S = {};
      try {
        for (const b of a.fields) {
          const $ = String(g.value[G(b)] ?? "").trim();
          $ && Ft(S, G(b), h(b, $));
        }
      } catch {
        r.value = 'Lists and objects need valid JSON, for example ["a","b"] or {"city":"Hamburg"}.';
        return;
      }
      u("add-case", { upload_id: p.value, expected: S });
    }
    const x = F(() => a.evaluations.find((S) => !He(S))), l = F(() => a.evaluations.filter(He)), i = F(() => a.evaluation), L = F(() => ({ done: (i.value?.results ?? []).filter((b) => b.status !== "queued").length, total: i.value?.case_count ?? 0 })), A = N();
    fe(() => i.value?.id, () => {
      A.value = void 0;
    });
    const C = F(() => {
      if (!i.value) return;
      if (A.value) return l.value.find((b) => b.id === A.value);
      const S = l.value.findIndex((b) => b.id === i.value.id);
      return S >= 0 ? l.value[S + 1] : l.value[0];
    }), E = F(() => (i.value?.metrics ?? []).map((S) => ({ ...S, before: C.value?.metrics.find((b) => b.field === S.field) }))), K = F(() => (i.value?.fields ?? []).map(G)), D = F(() => Oe(a.fields.map(G))), j = (S, b) => S.scores.find(($) => $.field === b), H = N(), T = (S) => `${Math.round(S * 100)}%`, O = (S) => {
      const b = Math.round(S * 100);
      return `${b > 0 ? "+" : b < 0 ? "−" : "±"}${Math.abs(b)} pts`;
    }, R = (S) => Math.round(S * 100) > 0 ? "up" : Math.round(S * 100) < 0 ? "down" : "flat", ue = (S) => S >= 6e4 ? `${Math.floor(S / 6e4)}m ${Math.round(S % 6e4 / 1e3)}s` : `${(S / 1e3).toFixed(1)}s`, ye = (S) => S == null || S === "" ? "—" : typeof S == "string" ? S : Array.isArray(S) && S.every((b) => typeof b != "object") ? S.join(", ") : JSON.stringify(S), te = (S) => S ? S.failed ? "fail" : S.score >= 0.999 ? "pass" : S.score > 0 ? "partial" : "fail" : "none", oe = (S) => (S.results ?? []).filter((b) => b.status === "completed").length, be = { queued: "Queued", running: "Running", completed: "Completed", partial: "Partial", failed: "Failed" };
    return (S, b) => (n(), o("div", Ai, [
      t("section", Ri, [
        t("div", Bi, [
          t("div", null, [
            t("h2", Li, "Evaluate revision " + c(e.revision), 1),
            b[6] || (b[6] = t("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            e.changed ? (n(), o("p", Oi, [
              f(m(M), { icon: "tabler:info-circle" }),
              b[5] || (b[5] = q("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : k("", !0)
          ]),
          f(m(de), {
            label: x.value ? "Evaluating…" : "Run all cases",
            loading: e.starting || !!x.value,
            disabled: !e.cases.length || !e.fields.length || !!x.value || e.starting,
            onClick: b[0] || (b[0] = ($) => u("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        i.value && !m(He)(i.value) ? (n(), o("div", Ti, [
          t("span", Pi, [
            t("span", {
              style: qe({ width: T(L.value.total ? L.value.done / L.value.total : 0) })
            }, null, 4)
          ]),
          t("span", Di, c(be[i.value.status]) + " · " + c(L.value.done) + " of " + c(L.value.total) + " cases", 1)
        ])) : k("", !0)
      ]),
      i.value && m(He)(i.value) ? (n(), o(U, { key: 0 }, [
        i.value.error ? (n(), o("p", {
          key: 0,
          class: Q(i.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          f(m(M), { icon: "tabler:alert-triangle" }),
          q(c(i.value.error), 1)
        ], 2)) : k("", !0),
        t("div", Ii, [
          t("div", ji, [
            t("span", zi, "Accuracy · revision " + c(i.value.config_revision), 1),
            t("span", Wi, c(T(m(Ve)(i.value))), 1),
            C.value ? (n(), o("span", {
              key: 0,
              class: Q(["stat-delta", R(m(Ve)(i.value) - m(Ve)(C.value))])
            }, c(O(m(Ve)(i.value) - m(Ve)(C.value))) + " vs revision " + c(C.value.config_revision), 3)) : k("", !0)
          ]),
          t("div", Hi, [
            b[7] || (b[7] = t("span", { class: "stat-label" }, "Cases", -1)),
            t("span", Gi, [
              q(c(oe(i.value)), 1),
              t("small", null, " / " + c(i.value.case_count), 1)
            ]),
            t("span", Ki, c((i.value.results ?? []).filter(($) => $.status === "partial").length) + " partial · " + c((i.value.results ?? []).filter(($) => $.status === "failed").length) + " failed", 1)
          ]),
          t("div", Qi, [
            b[8] || (b[8] = t("span", { class: "stat-label" }, "Tokens", -1)),
            t("span", Ji, c(i.value.tokens.toLocaleString()), 1),
            C.value ? (n(), o("span", Yi, c(C.value.tokens.toLocaleString()) + " before", 1)) : k("", !0)
          ]),
          t("div", Xi, [
            b[9] || (b[9] = t("span", { class: "stat-label" }, "Model time", -1)),
            t("span", Zi, c(ue(i.value.duration_ms)), 1),
            C.value ? (n(), o("span", _i, c(ue(C.value.duration_ms)) + " before", 1)) : k("", !0)
          ])
        ]),
        t("section", eu, [
          t("header", tu, [
            b[11] || (b[11] = t("h2", { class: "block-title" }, "Field accuracy", -1)),
            l.value.length > 1 ? (n(), o("label", lu, [
              b[10] || (b[10] = t("span", { class: "muted" }, "Compare with", -1)),
              t("select", {
                value: C.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: b[1] || (b[1] = ($) => A.value = $.target.value)
              }, [
                (n(!0), o(U, null, I(l.value.filter(($) => $.id !== i.value.id), ($) => (n(), o("option", {
                  key: $.id,
                  value: $.id
                }, "Revision " + c($.config_revision) + " · " + c(m(Ye)($.created_at)), 9, nu))), 128))
              ], 40, au)
            ])) : k("", !0)
          ]),
          E.value.length ? (n(), o("div", ou, [
            t("table", {
              class: Q(["metric-table accuracy-table", { comparing: !!C.value }])
            }, [
              t("thead", null, [
                t("tr", null, [
                  b[12] || (b[12] = t("th", null, "Field", -1)),
                  b[13] || (b[13] = t("th", null, "Accuracy", -1)),
                  b[14] || (b[14] = t("th", null, "Verified", -1)),
                  C.value ? (n(), o("th", iu, "Revision " + c(C.value.config_revision), 1)) : k("", !0),
                  C.value ? (n(), o("th", uu, "Change")) : k("", !0)
                ])
              ]),
              t("tbody", null, [
                (n(!0), o(U, null, I(E.value, ($) => (n(), o("tr", {
                  key: $.field
                }, [
                  t("td", du, c($.field), 1),
                  t("td", null, [
                    t("span", ru, [
                      t("span", cu, [
                        t("span", {
                          style: qe({ width: T($.accuracy) })
                        }, null, 4)
                      ]),
                      q(c(T($.accuracy)), 1)
                    ])
                  ]),
                  t("td", vu, c(T($.verified)), 1),
                  C.value ? (n(), o("td", mu, c($.before ? T($.before.accuracy) : "—"), 1)) : k("", !0),
                  C.value ? (n(), o("td", pu, [
                    $.before ? (n(), o("span", {
                      key: 0,
                      class: Q(["trend", R($.accuracy - $.before.accuracy)])
                    }, [
                      f(m(M), {
                        icon: R($.accuracy - $.before.accuracy) === "up" ? "tabler:trending-up" : R($.accuracy - $.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      q(c(O($.accuracy - $.before.accuracy)), 1)
                    ], 2)) : (n(), o("span", fu, "New field"))
                  ])) : k("", !0)
                ]))), 128))
              ])
            ], 2)
          ])) : (n(), o("p", su, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : k("", !0),
      i.value?.results?.length ? (n(), o("section", bu, [
        b[19] || (b[19] = t("header", { class: "block-head" }, [
          t("h2", { class: "block-title" }, "Results by case"),
          t("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        t("div", hu, [
          t("table", gu, [
            t("thead", null, [
              t("tr", null, [
                b[15] || (b[15] = t("th", null, "Document", -1)),
                (n(!0), o(U, null, I(K.value, ($) => (n(), o("th", {
                  key: $,
                  class: "mono"
                }, c($), 1))), 128))
              ])
            ]),
            t("tbody", null, [
              (n(!0), o(U, null, I(i.value.results, ($) => (n(), o(U, {
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
                      onClick: (B) => H.value = H.value === $.case_id ? void 0 : $.case_id
                    }, [
                      f(m(M), {
                        icon: H.value === $.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      q(c($.upload_name), 1)
                    ], 8, yu),
                    $.status === "partial" ? (n(), o("span", ku, "Partial")) : k("", !0)
                  ]),
                  $.status === "queued" || $.status === "failed" ? (n(), o("td", {
                    key: 0,
                    colspan: K.value.length,
                    class: "muted"
                  }, [
                    $.status === "queued" ? (n(), o("span", xu, [
                      f(m(M), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      b[16] || (b[16] = q("Waiting", -1))
                    ])) : (n(), o("span", {
                      key: 1,
                      class: "cell-state fail",
                      "data-error-kind": $.error?.kind,
                      title: $.error?.kind
                    }, [
                      f(m(M), { icon: "tabler:alert-triangle" }),
                      q(c($.error?.message), 1)
                    ], 8, wu))
                  ], 8, $u)) : (n(!0), o(U, { key: 1 }, I(K.value, (B) => (n(), o("td", {
                    key: B,
                    "data-label": B
                  }, [
                    t("span", {
                      class: Q(["cell", te(j($, B))]),
                      title: ye(j($, B)?.value)
                    }, c(j($, B)?.failed ? "Failed" : j($, B) ? T(j($, B).score) : "—"), 11, Vu)
                  ], 8, Su))), 128))
                ], 2),
                H.value === $.case_id ? (n(), o("tr", Cu, [
                  t("td", {
                    colspan: K.value.length + 1
                  }, [
                    $.error ? (n(), o("p", {
                      key: 0,
                      class: "muted",
                      "data-error-kind": $.error.kind,
                      title: $.error.kind
                    }, c($.error.message), 9, qu)) : k("", !0),
                    f(Re, {
                      node: m(Oe)($.scores.map((B) => B.field))
                    }, {
                      default: me(({ index: B }) => [
                        (n(!0), o(U, null, I([$.scores[B]], (P) => (n(), o("dl", {
                          key: P.field,
                          class: "compare"
                        }, [
                          t("dt", Fu, c(P.field.split(".").at(-1)), 1),
                          t("dd", null, [
                            t("span", {
                              class: Q(["cell", te(P)])
                            }, c(P.failed ? "Failed" : T(P.score)), 3),
                            t("div", Nu, [
                              b[17] || (b[17] = t("span", { class: "cmp-label" }, "Expected", -1)),
                              f(Be, {
                                value: P.expected
                              }, null, 8, ["value"])
                            ]),
                            t("div", Uu, [
                              b[18] || (b[18] = t("span", { class: "cmp-label" }, "Extracted", -1)),
                              P.failed ? (n(), J(Lt, {
                                key: 0,
                                error: P.error
                              }, null, 8, ["error"])) : (n(), J(Be, {
                                key: 1,
                                value: P.value
                              }, null, 8, ["value"]))
                            ]),
                            P.failed ? k("", !0) : (n(), o("span", Mu, [
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
                    t("p", Au, c($.tokens.toLocaleString()) + " tokens · " + c(ue($.duration_ms)), 1)
                  ], 8, Eu)
                ])) : k("", !0)
              ], 64))), 128))
            ])
          ])
        ])
      ])) : k("", !0),
      t("section", Ru, [
        t("header", Bu, [
          b[20] || (b[20] = t("h2", { class: "block-title" }, "Cases", -1)),
          t("span", Lu, c(e.cases.length), 1),
          f(m(de), {
            label: "Add case",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: !e.fields.length,
            onClick: b[2] || (b[2] = ($) => d.value = !d.value)
          }, null, 8, ["disabled"])
        ]),
        d.value ? (n(), o("form", {
          key: 0,
          class: "case-form",
          onSubmit: ve(w, ["prevent"])
        }, [
          t("label", null, [
            b[21] || (b[21] = q("Document", -1)),
            f(Bt, {
              value: p.value,
              onSelect: b[3] || (b[3] = ($) => {
                p.value = $;
              })
            }, null, 8, ["value"])
          ]),
          b[24] || (b[24] = t("p", { class: "muted" }, "Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.", -1)),
          f(Re, { node: D.value }, {
            default: me(({ index: $ }) => [
              (n(!0), o(U, null, I([e.fields[$]], (B) => (n(), o("label", {
                key: m(G)(B)
              }, [
                t("span", Ou, c(B.name), 1),
                B.type === "boolean" ? z((n(), o("select", {
                  key: 0,
                  "onUpdate:modelValue": (P) => g.value[m(G)(B)] = P
                }, [...b[22] || (b[22] = [
                  t("option", { value: "" }, "Not stated", -1),
                  t("option", { value: "true" }, "Yes", -1),
                  t("option", { value: "false" }, "No", -1)
                ])], 8, Tu)), [
                  [Ge, g.value[m(G)(B)]]
                ]) : B.type === "enum" ? z((n(), o("select", {
                  key: 1,
                  "onUpdate:modelValue": (P) => g.value[m(G)(B)] = P
                }, [
                  b[23] || (b[23] = t("option", { value: "" }, "Not stated", -1)),
                  (n(!0), o(U, null, I(B.enum_values, (P) => (n(), o("option", { key: P }, c(P), 1))), 128))
                ], 8, Pu)), [
                  [Ge, g.value[m(G)(B)]]
                ]) : B.type === "object" || B.type === "list" ? z((n(), o("textarea", {
                  key: 2,
                  "onUpdate:modelValue": (P) => g.value[m(G)(B)] = P,
                  rows: "2",
                  placeholder: B.type === "list" ? '["first", "second"]' : '{"key": "value"}'
                }, null, 8, Du)), [
                  [Z, g.value[m(G)(B)]]
                ]) : z((n(), o("input", {
                  key: 3,
                  "onUpdate:modelValue": (P) => g.value[m(G)(B)] = P,
                  type: B.type === "number" ? "number" : B.type === "date" ? "date" : "text",
                  placeholder: "Not stated"
                }, null, 8, Iu)), [
                  [dl, g.value[m(G)(B)]]
                ])
              ]))), 128))
            ]),
            _: 1
          }, 8, ["node"]),
          r.value ? (n(), o("p", ju, c(r.value), 1)) : k("", !0),
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
              onClick: b[4] || (b[4] = ($) => d.value = !1)
            })
          ])
        ], 32)) : k("", !0),
        e.fields.length ? !e.cases.length && !d.value ? (n(), o("p", Hu, "No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.")) : e.cases.length ? (n(), o("div", Gu, [
          t("table", Ku, [
            b[25] || (b[25] = t("thead", null, [
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
                  f(m(M), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  q(" " + c($.upload_name), 1)
                ]),
                t("td", null, [
                  f(Re, { node: D.value }, {
                    default: me(({ index: B }) => [
                      t("div", Qu, [
                        t("strong", null, c(e.fields[B].name), 1),
                        m(kt)($.expected, m(G)(e.fields[B])) !== void 0 ? (n(), J(Be, {
                          key: 0,
                          value: m(kt)($.expected, m(G)(e.fields[B]))
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
                    "aria-label": `Remove case ${$.upload_name}`,
                    disabled: e.saving,
                    onClick: (B) => u("delete-case", $.id)
                  }, [
                    f(m(M), { icon: "tabler:trash" })
                  ], 8, Xu)
                ])
              ]))), 128))
            ])
          ])
        ])) : k("", !0) : (n(), o("p", Wu, "Add a field in the Builder, then add documents with the values you expect."))
      ]),
      e.evaluations.length ? (n(), o("section", Zu, [
        t("header", _u, [
          b[26] || (b[26] = t("h2", { class: "block-title" }, "History", -1)),
          t("span", ed, c(e.evaluations.length), 1)
        ]),
        t("ul", td, [
          (n(!0), o(U, null, I(e.evaluations, ($) => (n(), o("li", {
            key: $.id
          }, [
            t("button", {
              type: "button",
              class: Q({ active: i.value?.id === $.id }),
              "aria-current": i.value?.id === $.id,
              onClick: (B) => u("open", $.id)
            }, [
              t("span", {
                class: "badge",
                "data-status": $.status
              }, c(be[$.status]), 9, ad),
              t("span", null, "Revision " + c($.config_revision), 1),
              t("span", nd, c(m(Ye)($.created_at)), 1),
              t("strong", sd, c($.status === "completed" || $.status === "partial" ? T(m(Ve)($)) : "—"), 1)
            ], 10, ld)
          ]))), 128))
        ])
      ])) : k("", !0)
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
}, yd = { colspan: "6" }, kd = /* @__PURE__ */ W({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(e) {
    const s = N(), a = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (u, d) => (n(), o(U, null, [
      t("div", id, [
        d[0] || (d[0] = t("h2", null, "Recent runs", -1)),
        t("span", ud, "Runs expire after " + c(e.retention), 1)
      ]),
      e.runs.length ? (n(), o("div", rd, [
        t("table", cd, [
          d[1] || (d[1] = t("thead", null, [
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
                      icon: a[p.caller].icon
                    }, null, 8, ["icon"]),
                    q(c(a[p.caller].label), 1)
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
              ])) : k("", !0)
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
}, xd = /* @__PURE__ */ W({
  __name: "SharePopup",
  props: {
    id: {},
    title: {}
  },
  emits: ["close"],
  setup(e, { emit: s }) {
    const a = e, u = s, d = N(), p = N("");
    return Fe(async () => {
      try {
        await Ze("kickside-share", { timeoutMs: 8e3 });
      } catch (h) {
        p.value = `Sharing is unavailable: ${h instanceof Error ? h.message : String(h)}`;
        return;
      }
      const g = document.createElement("kickside-share"), r = encodeURIComponent(a.id);
      g.setAttribute("config", JSON.stringify({ resource_id: a.id, title: a.title, access_url: `/api/v1/component-access/grants/${r}`, share_url: `/api/v1/component-access/share/${r}` })), g.style.display = "block", g.addEventListener("close", () => u("close")), d.value?.appendChild(g);
    }), (g, r) => (n(), o("div", {
      ref_key: "host",
      ref: d
    }, [
      p.value ? (n(), o("p", $d, c(p.value), 1)) : k("", !0)
    ], 512));
  }
}), wd = { class: "docscout" }, Sd = { class: "toolbar" }, Vd = { class: "toolbar-lead" }, Cd = { class: "crumb-row" }, Ed = { class: "crumb" }, qd = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, Fd = ["id", "aria-selected", "aria-controls", "onClick"], Nd = { class: "toolbar-side" }, Ud = { class: "stats" }, Md = ["title"], Ad = {
  key: 2,
  class: "unsaved"
}, Rd = {
  key: 0,
  class: "banner row wrap",
  role: "status"
}, Bd = {
  key: 1,
  role: "alert",
  class: "error banner"
}, Ld = {
  key: 3,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, Od = ["id", "aria-labelledby"], Td = /* @__PURE__ */ W({
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
    const a = e, u = s, d = N(), p = N(!1), g = N("Builder"), r = N($t()), h = N(""), w = N(""), x = F(() => a.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    fe(g, () => {
      d.value && (d.value.scrollTop = 0);
    }, { flush: "post" });
    const l = N(), i = N(), L = F(() => a.snapshot.can_edit && l.value !== a.snapshot.expected_revision), A = F(() => L.value && i.value !== a.snapshot.expected_revision);
    function C(T) {
      return h.value === T.title && w.value === (T.description ?? "") && Fl(r.value, T.config);
    }
    function E() {
      const T = a.snapshot;
      r.value = structuredClone(ht(T.config ?? $t())), h.value = T.title, w.value = T.description ?? "", l.value = T.expected_revision, i.value = void 0;
    }
    fe(() => a.snapshot, (T, O) => {
      x.value.includes(g.value) || (g.value = x.value[0]), !(O && T.id === O.id && T.can_edit && O.can_edit && !C(O) && !C(T)) && E();
    }, { immediate: !0 });
    const K = F(() => a.snapshot.can_edit && !C(a.snapshot)), D = F(() => ql(r.value)), j = F(() => Object.keys(ke).filter((T) => Qe(r.value, T)).length);
    function H() {
      u("save", { title: h.value, description: w.value, config: structuredClone(ht(r.value)), expected_revision: l.value });
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
              onClick: O[0] || (O[0] = (R) => u("back"))
            }, [
              f(m(M), { icon: "tabler:arrow-left" })
            ])) : k("", !0),
            t("span", Ed, c(e.snapshot.title), 1)
          ]),
          t("nav", qd, [
            (n(!0), o(U, null, I(x.value, (R) => (n(), o("button", {
              id: `tab-${R}`,
              key: R,
              role: "tab",
              "aria-selected": g.value === R,
              "aria-controls": `panel-${R}`,
              onClick: (ue) => g.value = R
            }, c(R), 9, Fd))), 128))
          ])
        ]),
        t("div", Nd, [
          e.snapshot.can_share ? (n(), J(m(de), {
            key: 0,
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-label": "Share",
            onClick: O[1] || (O[1] = (R) => p.value = !0)
          }, {
            default: me(() => [
              f(m(M), { icon: "tabler:share" }),
              O[11] || (O[11] = t("span", { class: "btn-label" }, "Share", -1))
            ]),
            _: 1
          })) : k("", !0),
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
            })) : k("", !0),
            D.value ? (n(), o("span", {
              key: 1,
              class: "invalid",
              role: "alert",
              title: D.value
            }, [
              f(m(M), { icon: "tabler:alert-circle" }),
              q(c(D.value), 1)
            ], 8, Md)) : K.value ? (n(), o("span", Ad, "Unsaved")) : k("", !0),
            f(m(de), {
              label: "Save",
              size: "small",
              loading: e.saving,
              disabled: !K.value || !!D.value || !h.value.trim(),
              onClick: H
            }, null, 8, ["loading", "disabled"])
          ], 64)) : k("", !0)
        ])
      ]),
      A.value ? (n(), o("div", Rd, [
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
          onClick: O[2] || (O[2] = (R) => i.value = e.snapshot.expected_revision)
        })
      ])) : k("", !0),
      e.error ? (n(), o("p", Bd, c(e.error), 1)) : k("", !0),
      p.value ? (n(), J(xd, {
        key: 2,
        id: e.snapshot.id,
        title: e.snapshot.title,
        onClose: O[3] || (O[3] = (R) => p.value = !1)
      }, null, 8, ["id", "title"])) : k("", !0),
      g.value === "Builder" && e.snapshot.can_edit ? (n(), o("div", Ld, [
        f(Go, {
          title: h.value,
          "onUpdate:title": O[4] || (O[4] = (R) => h.value = R),
          description: w.value,
          "onUpdate:description": O[5] || (O[5] = (R) => w.value = R),
          config: r.value,
          retention: e.snapshot.retention,
          result: e.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (n(), o("div", {
        key: 4,
        ref_key: "body",
        ref: d,
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
            onRun: O[6] || (O[6] = (R) => u("run", R))
          }, null, 8, ["result", "retention", "running", "can-run"])) : k("", !0),
          g.value === "Evals" && e.snapshot.can_edit ? (n(), J(od, {
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
            onAddCase: O[7] || (O[7] = (R) => u("add-case", R)),
            onDeleteCase: O[8] || (O[8] = (R) => u("delete-case", R)),
            onEvaluate: O[9] || (O[9] = (R) => u("evaluate")),
            onOpen: O[10] || (O[10] = (R) => u("open-evaluation", R))
          }, null, 8, ["cases", "added-case-id", "fields", "evaluations", "evaluation", "revision", "changed", "saving", "starting"])) : k("", !0),
          g.value === "Runs" ? (n(), J(kd, {
            key: 2,
            runs: e.snapshot.runs,
            retention: e.snapshot.retention
          }, null, 8, ["runs", "retention"])) : k("", !0)
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
}, Hd = /* @__PURE__ */ W({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(e, { emit: s }) {
    const a = e, u = s, d = N(), p = N(""), g = N(!1), r = N(!1), h = N(!1), w = N(), x = N(null), l = N([]), i = N();
    let L = [], A = 0, C = 0, E = 0, K;
    const D = (S) => S instanceof Error ? S.message : String(S), j = (S) => S === A;
    async function H(S, b) {
      const $ = ++E;
      b && (K = b);
      const B = () => j(S) && $ === E;
      try {
        const P = a.id, Ne = await ge.evaluations(P);
        if (!B()) return;
        l.value = Ne;
        const he = K ?? Ne[0]?.id;
        if (he) {
          const Pe = await ge.evaluation(P, he);
          if (!B() || Pe.id !== (K ?? he)) return;
          i.value = Pe;
        }
      } catch (P) {
        B() && (p.value = D(P));
      }
    }
    async function T(S) {
      const b = ++C, $ = () => j(S) && b === C;
      if (!a.id) {
        p.value = "No extractor selected.";
        return;
      }
      try {
        const B = await ge.get(a.id);
        if (!$()) return;
        d.value = B, p.value = "", B.can_edit && await H(S);
      } catch (B) {
        $() && (p.value = D(B));
      }
    }
    fe(() => a.id, (S, b) => {
      A++, K = void 0, L.forEach((B) => B()), L = [], w.value = void 0, d.value = void 0, x.value = null, l.value = [], i.value = void 0, p.value = "";
      const $ = A;
      a.id && (L = [xt(`component.${a.id}`, () => T($)), xt(`docscout.runs.${a.id}`, () => T($))]), b !== void 0 && T($);
    }, { immediate: !0 }), Nl(() => T(A)), Ct(() => {
      A++, L.forEach((S) => S());
    });
    async function O(S) {
      const b = A;
      g.value = !0, p.value = "";
      try {
        const $ = await S();
        if (j(b))
          return await T(b), $;
      } catch ($) {
        j(b) && (p.value = D($));
      } finally {
        g.value = !1;
      }
    }
    const R = (S) => O(() => ge.update(a.id, S));
    async function ue(S) {
      const b = A, $ = await O(() => ge.addCase(a.id, S));
      $ && j(b) && (w.value = $.id);
    }
    const ye = (S) => O(() => ge.deleteCase(a.id, S));
    async function te(S) {
      const b = A;
      r.value = !0, p.value = "";
      try {
        const $ = await ge.run(a.id, S);
        j(b) && (x.value = $, await T(b));
      } catch ($) {
        j(b) && (p.value = D($));
      } finally {
        r.value = !1;
      }
    }
    async function oe() {
      const S = A;
      h.value = !0, p.value = "";
      try {
        const { eval_id: b } = await ge.evaluate(a.id);
        j(S) && await H(S, b);
      } catch (b) {
        j(S) && (p.value = D(b));
      } finally {
        h.value = !1;
      }
    }
    function be(S) {
      H(A, S);
    }
    return (S, b) => d.value ? (n(), J(Td, {
      key: 0,
      snapshot: d.value,
      "added-case-id": w.value,
      saving: g.value,
      running: r.value,
      starting: h.value,
      result: x.value,
      evaluations: l.value,
      evaluation: i.value,
      error: p.value,
      back: e.back,
      onBack: b[0] || (b[0] = ($) => u("back")),
      onRun: te,
      onSave: R,
      onAddCase: ue,
      onDeleteCase: ye,
      onEvaluate: oe,
      onOpenEvaluation: be
    }, null, 8, ["snapshot", "added-case-id", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : p.value ? (n(), o("p", Pd, c(p.value), 1)) : (n(), o("p", Dd, "Loading Docscout…"));
  }
});
export {
  Hd as _,
  Ye as w
};
