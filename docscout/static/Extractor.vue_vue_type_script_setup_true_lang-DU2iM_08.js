import { defineComponent as W, useModel as Le, openBlock as a, createElementBlock as o, withModifiers as ve, createElementVNode as t, mergeModels as Xe, computed as N, withKeys as Ee, unref as p, normalizeClass as Q, createVNode as f, toDisplayString as c, Fragment as U, renderList as I, createCommentVNode as $, createTextVNode as q, createBlock as J, ref as M, useId as pe, watch as fe, withDirectives as z, vModelText as _, vModelSelect as Ge, resolveComponent as st, renderSlot as je, withCtx as me, mergeProps as bt, vShow as Ke, onMounted as Fe, nextTick as Ce, normalizeStyle as qe, onBeforeUnmount as Ct, vModelDynamic as dl, toRaw as ht } from "vue";
import { B as rl, L as cl, j as ze, v as Me, k as vl, U as ml, I as gt, f as pl, i as Qe, l as Et, t as lt, h as ke, o as ot, p as fl, m as qt, q as G, M as Ae, r as Ft, w as Nt, x as at, y as bl, z as hl, A as gl, C as yl, D as kl, E as Ut, F as $l, G as Mt, H as xl, J as wl, K as Sl, N as yt, O as Vl, P as et, Q as Cl, R as Oe, S as El, s as de, T as kt, n as $t, V as ql, W as Fl, b as Nl, c as ge } from "./index-BXIDvLE5.js";
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
    var u = Object.getOwnPropertySymbols(e);
    s && (u = u.filter(function(d) {
      return Object.getOwnPropertyDescriptor(e, d).enumerable;
    })), l.push.apply(l, u);
  }
  return l;
}
function St(e) {
  for (var s = 1; s < arguments.length; s++) {
    var l = arguments[s] != null ? arguments[s] : {};
    s % 2 ? wt(Object(l), !0).forEach(function(u) {
      Al(e, u, l[u]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(l)) : wt(Object(l)).forEach(function(u) {
      Object.defineProperty(e, u, Object.getOwnPropertyDescriptor(l, u));
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
    var u = l.call(e, s);
    if (Pe(u) != "object") return u;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (s === "string" ? String : Number)(e);
}
var Ll = Ml.extend("focustrap", {
  mounted: function(s, l) {
    var u = l.value || {}, d = u.disabled;
    d || (this.createHiddenFocusableElements(s, l), this.bind(s, l), this.autoElementFocus(s, l)), s.setAttribute("data-pd-focustrap", !0), this.$el = s;
  },
  updated: function(s, l) {
    var u = l.value || {}, d = u.disabled;
    d && this.unbind(s);
  },
  unmounted: function(s) {
    this.unbind(s);
  },
  methods: {
    getComputedSelector: function(s) {
      return ':not(.p-hidden-focusable):not([data-p-hidden-focusable="true"])'.concat(s ?? "");
    },
    bind: function(s, l) {
      var u = this, d = l.value || {}, m = d.onFocusIn, y = d.onFocusOut;
      s.$_pfocustrap_mutationobserver = new MutationObserver(function(r) {
        r.forEach(function(g) {
          if (g.type === "childList" && !s.contains(document.activeElement)) {
            var S = function(i) {
              var n = gt(i) ? gt(i, u.getComputedSelector(s.$_pfocustrap_focusableselector)) ? i : Me(s, u.getComputedSelector(s.$_pfocustrap_focusableselector)) : Me(i);
              return pl(n) ? n : i.nextSibling && S(i.nextSibling);
            };
            ze(S(g.nextSibling));
          }
        });
      }), s.$_pfocustrap_mutationobserver.disconnect(), s.$_pfocustrap_mutationobserver.observe(s, {
        childList: !0
      }), s.$_pfocustrap_focusinlistener = function(r) {
        return m && m(r);
      }, s.$_pfocustrap_focusoutlistener = function(r) {
        return y && y(r);
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
      var u = l.value || {}, d = u.autoFocusSelector, m = d === void 0 ? "" : d, y = u.firstFocusableSelector, r = y === void 0 ? "" : y, g = u.autoFocus, S = g === void 0 ? !1 : g, E = Me(s, "[autofocus]".concat(this.getComputedSelector(m)));
      S && !E && (E = Me(s, this.getComputedSelector(r))), ze(E);
    },
    onFirstHiddenElementFocus: function(s) {
      var l, u = s.currentTarget, d = s.relatedTarget, m = d === u.$_pfocustrap_lasthiddenfocusableelement || !((l = this.$el) !== null && l !== void 0 && l.contains(d)) ? Me(u.parentElement, this.getComputedSelector(u.$_pfocustrap_focusableselector)) : u.$_pfocustrap_lasthiddenfocusableelement;
      ze(m);
    },
    onLastHiddenElementFocus: function(s) {
      var l, u = s.currentTarget, d = s.relatedTarget, m = d === u.$_pfocustrap_firsthiddenfocusableelement || !((l = this.$el) !== null && l !== void 0 && l.contains(d)) ? cl(u.parentElement, this.getComputedSelector(u.$_pfocustrap_focusableselector)) : u.$_pfocustrap_firsthiddenfocusableelement;
      ze(m);
    },
    createHiddenFocusableElements: function(s, l) {
      var u = this, d = l.value || {}, m = d.tabIndex, y = m === void 0 ? 0 : m, r = d.firstFocusableSelector, g = r === void 0 ? "" : r, S = d.lastFocusableSelector, E = S === void 0 ? "" : S, i = function(w) {
        return ml("span", {
          class: "p-hidden-accessible p-hidden-focusable",
          tabIndex: y,
          role: "presentation",
          "aria-hidden": !0,
          "data-p-hidden-accessible": !0,
          "data-p-hidden-focusable": !0,
          onFocus: w?.bind(u)
        });
      }, n = i(this.onFirstHiddenElementFocus), b = i(this.onLastHiddenElementFocus);
      n.$_pfocustrap_lasthiddenfocusableelement = b, n.$_pfocustrap_focusableselector = g, n.setAttribute("data-pc-section", "firstfocusableelement"), b.$_pfocustrap_firsthiddenfocusableelement = n, b.$_pfocustrap_focusableselector = E, b.setAttribute("data-pc-section", "lastfocusableelement"), s.prepend(n), s.append(b);
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
    return (l, u) => (a(), o("button", {
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
    const l = e, u = s, d = N(() => Qe(l.config, l.stage)), m = N(() => l.config.stages[l.stage].model), y = N({ get: () => d.value, set: (S) => {
      l.config.stages[l.stage].enabled = S;
    } }), r = N(() => {
      const S = l.config, E = S.stages;
      switch (l.stage) {
        case "map":
          return S.fields.filter((i) => i.search_within === "sections").map((i) => ({ text: i.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...E.prefetch.queries.map((i) => ({ text: i.name || "Untitled query", tone: "" })), ...S.fields.filter((i) => i.search_hints.trim()).map((i) => ({ text: i.name, tone: "hint" }))];
        case "scout":
          return E.scout.mode === "agent" ? E.scout.tools.map((i) => ({ text: lt(i).toLowerCase(), tone: "" })) : [];
        case "deep":
          return S.fields.filter((i) => i.strategy === "deep").map((i) => ({ text: i.name || "New field", tone: "primary" }));
        case "extract":
          return Et(S).map((i) => ({ text: `${i.name} · ${i.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), g = (S) => [`${(S.duration_ms / 1e3).toFixed(1)}s`, `${(S.input_tokens + S.output_tokens).toLocaleString()} tokens`, S.queries?.length ? `${S.queries.length} queries` : "", S.message ?? ""].filter(Boolean).join(" · ");
    return (S, E) => (a(), o("div", {
      class: Q(["node kx-focus-halo", { active: e.active, off: !d.value, fixed: e.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": p(ke)[e.stage],
      onClick: E[1] || (E[1] = (i) => u("select")),
      onKeydown: [
        E[2] || (E[2] = Ee((i) => u("select"), ["enter"])),
        E[3] || (E[3] = Ee(ve((i) => u("select"), ["prevent"]), ["space"]))
      ]
    }, [
      t("span", Tl, [
        f(p(A), {
          icon: p(ot)[e.stage]
        }, null, 8, ["icon"])
      ]),
      t("span", Dl, [
        t("span", Il, c(p(ke)[e.stage]), 1),
        t("span", jl, c(d.value ? p(fl)(e.stage, e.config) : "Off"), 1),
        d.value && r.value.length ? (a(), o("span", zl, [
          (a(!0), o(U, null, I(r.value, (i) => (a(), o("span", {
            key: i.text,
            class: Q(["chip", { primary: i.tone === "primary", "muted-chip": i.tone === "hint" }])
          }, c(i.text), 3))), 128))
        ])) : $("", !0),
        e.trace ? (a(), o("span", Wl, [
          f(p(A), {
            icon: e.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          q(c(g(e.trace)), 1)
        ])) : $("", !0)
      ]),
      t("span", Hl, [
        d.value && m.value ? (a(), o("span", Gl, c(p(qt)(m.value)), 1)) : $("", !0),
        e.stage !== "extract" && !e.readonly ? (a(), J(Z, {
          key: 1,
          modelValue: y.value,
          "onUpdate:modelValue": E[0] || (E[0] = (i) => y.value = i),
          label: `Enable ${p(ke)[e.stage]}`
        }, null, 8, ["modelValue", "label"])) : $("", !0)
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
    const s = e, l = Le(e, "modelValue"), u = M([]);
    function d(m, y) {
      const r = s.options.length - 1, g = { ArrowRight: y + 1, ArrowDown: y + 1, ArrowLeft: y - 1, ArrowUp: y - 1, Home: 0, End: r }[m.key];
      if (g === void 0) return;
      m.preventDefault();
      const S = (g + s.options.length) % s.options.length;
      l.value = s.options[S].value, u.value[S]?.focus();
    }
    return (m, y) => (a(), o("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": e.labelledBy
    }, [
      (a(!0), o(U, null, I(e.options, (r, g) => (a(), o("button", {
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
        onClick: (S) => l.value = r.value,
        onKeydown: (S) => d(S, g)
      }, [
        r.icon ? (a(), J(p(A), {
          key: 0,
          icon: r.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : $("", !0),
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
  function l(u, d, m, y) {
    s.push({ field: d, trail: m, shape: u, path: y, depth: m.length + 1, key: ie(d, m) }), u.properties?.forEach((r, g) => l(r, d, [...m, g], `${y}.${r.name || "New property"}`)), u.item && l(u.item, d, [...m, "item"], `${y}[]`);
  }
  return e.forEach((u, d) => l(u, d, [], G(u) || "New field")), s;
}
function nt(e) {
  return 1 + Math.max(0, ...(e.properties ?? []).map(nt), e.item ? nt(e.item) : 0);
}
function Yl(e, s) {
  return Je(e).filter((l) => l.shape.type === "object" && ((l.shape.properties?.length ?? 0) < 100 || l.field === s.field && ie(l.field, l.trail) === ie(s.field, s.trail.slice(0, -1))) && l.depth + nt(s.shape) <= Ae && !(l.field === s.field && s.trail.every((u, d) => l.trail[d] === u)));
}
function Xl(e, s, l) {
  const u = { ...Nt(), ...s.shape, name: s.shape.name };
  s.trail.length ? Je(e).find((y) => y.key === ie(s.field, s.trail.slice(0, -1))).shape.properties.splice(s.trail.at(-1), 1) : e.splice(s.field, 1);
  let d;
  if (l) {
    const { name: m, type: y, description: r, enum_values: g, expected_format: S, required: E, properties: i, item: n } = u;
    d = { name: m, type: y, description: r, enum_values: g, expected_format: S, required: E, ...i ? { properties: i } : {}, ...n ? { item: n } : {} }, l.shape.properties.push(d), d = l.shape.properties.at(-1);
  } else
    d = { ...at(), ...u, group: "" }, e.push(d), d = e.at(-1);
  return Je(e).find((m) => m.shape === d);
}
function Vt(e, s = !1) {
  function l(d) {
    return d.type === "object" ? Object.fromEntries((d.properties ?? []).map((m) => [m.name || "unnamed", l(m)])) : d.type === "list" ? d.item ? [l(d.item)] : [] : s ? d.enum_values?.length ? d.enum_values[0] : { text: "Example value", number: 42, boolean: !0, date: "2026-01-15", enum: null }[d.type] : d.type === "enum" ? d.enum_values?.join(" | ") || "enum" : d.type;
  }
  const u = {};
  return e.forEach((d) => Ft(u, G(d) || "unnamed", l(d))), u;
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
    const l = e, u = s, d = N(() => l.shape), m = N(() => l.named ? l.depth === 1 ? "Field type" : "Property type" : "Item type"), y = N(() => At.filter((R) => l.depth < Ae || !["object", "list"].includes(R.value))), r = N({ get: () => l.shape.type, set: (R) => {
      l.shape.type = R, delete l.shape.properties, delete l.shape.item, l.shape.enum_values = [], R === "object" && (l.shape.properties = []), R === "list" && (l.shape.item = bl());
    } }), g = pe(), S = pe(), E = M(""), i = M("");
    fe(() => l.shape, () => {
      E.value = "", i.value = "";
    });
    const n = N(() => l.validationError || (l.named ? hl(d.value.name, l.siblingNames) : "") || gl(l.shape, l.depth));
    function b() {
      const R = E.value.trim(), w = l.shape.enum_values ?? [];
      if (!R || R.length > 200) {
        i.value = "Enter 1 to 200 characters.";
        return;
      }
      if (w.includes(R)) {
        i.value = "This value already exists.";
        return;
      }
      if (w.length >= 100) {
        i.value = "Use at most 100 allowed values.";
        return;
      }
      l.shape.enum_values = [...w, R], E.value = "", i.value = "";
    }
    return (R, w) => (a(), o("div", Zl, [
      e.named ? (a(), o("label", _l, [
        w[8] || (w[8] = q("Name", -1)),
        z(t("input", {
          "onUpdate:modelValue": w[0] || (w[0] = (F) => d.value.name = F),
          "aria-label": e.depth === 1 ? "Field name" : "Property name",
          "aria-invalid": !!n.value,
          "aria-describedby": n.value ? p(S) : void 0,
          maxlength: "80",
          spellcheck: "false",
          class: "mono-input"
        }, null, 8, ea), [
          [
            _,
            d.value.name,
            void 0,
            { trim: !0 }
          ]
        ])
      ])) : $("", !0),
      t("div", ta, [
        t("span", { id: p(g) }, c(e.named ? "Data type" : "Item type"), 9, la),
        f($e, {
          modelValue: r.value,
          "onUpdate:modelValue": w[1] || (w[1] = (F) => r.value = F),
          class: "type-picker",
          options: y.value,
          "labelled-by": p(g),
          name: m.value,
          disabled: e.readonly
        }, null, 8, ["modelValue", "options", "labelled-by", "name", "disabled"]),
        e.depth === p(Ae) ? (a(), o("small", aa, "Level four · choose a value type.")) : $("", !0)
      ]),
      n.value ? (a(), o("p", {
        key: 1,
        id: p(S),
        class: "field-error",
        role: "alert"
      }, c(n.value), 9, na)) : $("", !0),
      p(yl)(e.shape, e.named) ? (a(), o("div", sa, [
        t("span", null, c(e.shape.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        t("div", oa, [
          (a(!0), o(U, null, I(e.shape.enum_values, (F, K) => (a(), o("span", {
            key: F,
            class: "chip primary"
          }, [
            q(c(F), 1),
            e.readonly ? $("", !0) : (a(), o("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Remove allowed value ${F}`,
              onClick: (D) => e.shape.enum_values.splice(K, 1)
            }, [
              f(p(A), { icon: "tabler:x" })
            ], 8, ia))
          ]))), 128))
        ]),
        e.readonly ? $("", !0) : (a(), o("div", ua, [
          z(t("input", {
            "onUpdate:modelValue": w[2] || (w[2] = (F) => E.value = F),
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
        i.value ? (a(), o("p", ra, c(i.value), 1)) : $("", !0)
      ])) : $("", !0),
      t("label", null, [
        w[9] || (w[9] = q("Description", -1)),
        z(t("textarea", {
          "onUpdate:modelValue": w[3] || (w[3] = (F) => e.shape.description = F),
          rows: "3",
          maxlength: "4000",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [_, e.shape.description]
        ])
      ]),
      ["boolean", "enum"].includes(e.shape.type) ? $("", !0) : (a(), o("label", ca, [
        w[10] || (w[10] = q("Expected format", -1)),
        z(t("input", {
          "onUpdate:modelValue": w[4] || (w[4] = (F) => e.shape.expected_format = F),
          maxlength: "400",
          placeholder: p(kl)(e.shape)
        }, null, 8, va), [
          [_, e.shape.expected_format]
        ])
      ])),
      e.named ? (a(), o("div", ma, [
        w[11] || (w[11] = t("span", null, "Required", -1)),
        f(Z, {
          modelValue: d.value.required,
          "onUpdate:modelValue": w[5] || (w[5] = (F) => d.value.required = F),
          label: "Required",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : $("", !0),
      e.shape.type === "object" ? (a(), o(U, { key: 5 }, [
        t("p", pa, c(e.shape.properties?.length ?? 0) + " properties · Select a property in the tree to edit it.", 1),
        !e.readonly && e.depth < p(Ae) ? (a(), o("button", {
          key: 0,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Add property to ${e.label}`,
          disabled: (e.shape.properties?.length ?? 0) >= 100,
          onClick: w[6] || (w[6] = (F) => u("add"))
        }, [
          f(p(A), { icon: "tabler:plus" }),
          w[12] || (w[12] = q("Add property", -1))
        ], 8, fa)) : $("", !0)
      ], 64)) : $("", !0),
      e.shape.type === "list" && e.shape.item ? (a(), o("button", {
        key: 6,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        onClick: w[7] || (w[7] = (F) => u("selectItem"))
      }, [
        f(p(A), { icon: "tabler:brackets" }),
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
    const l = e, u = s, d = N(() => !l.depth || l.depth === 1), m = N(() => Ut(l.field, l.otherNames));
    return (y, r) => (a(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      f(ba, {
        shape: e.shape ?? e.field,
        depth: e.depth ?? 1,
        label: e.shape?.name || e.field.name || "field",
        named: d.value || !!e.shape?.name || !!e.siblingNames,
        "sibling-names": e.siblingNames,
        "validation-error": d.value ? m.value : void 0,
        readonly: e.readonly,
        onAdd: r[0] || (r[0] = (g) => u("add")),
        onSelectItem: r[1] || (r[1] = (g) => u("selectItem"))
      }, null, 8, ["shape", "depth", "label", "named", "sibling-names", "validation-error", "readonly"]),
      d.value ? (a(), o(U, { key: 0 }, [
        r[25] || (r[25] = t("h4", null, "Finding it", -1)),
        t("label", null, [
          r[12] || (r[12] = q("Search hints", -1)),
          z(t("textarea", {
            "onUpdate:modelValue": r[2] || (r[2] = (g) => e.field.search_hints = g),
            rows: "2",
            maxlength: "4000",
            placeholder: "One query per line"
          }, null, 512), [
            [_, e.field.search_hints]
          ]),
          r[13] || (r[13] = t("small", null, "Each line is an extra search for this field in Prefetch and Deep analysis.", -1))
        ]),
        t("div", ga, [
          t("label", null, [
            r[15] || (r[15] = q("Strategy", -1)),
            z(t("select", {
              "onUpdate:modelValue": r[3] || (r[3] = (g) => e.field.strategy = g)
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
                "onUpdate:modelValue": r[4] || (r[4] = (g) => e.field.chunks = g),
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
                onClick: r[5] || (r[5] = (g) => e.field.chunks--)
              }, "−", 8, ka),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Increase chunks to read",
                disabled: e.field.chunks >= 1e3 || e.readonly,
                onClick: r[6] || (r[6] = (g) => e.field.chunks++)
              }, "+", 8, $a)
            ]),
            r[17] || (r[17] = t("small", null, "Per search hint", -1))
          ])
        ]),
        e.field.strategy === "deep" && !e.deepEnabled ? (a(), o("p", xa, [
          f(p(A), { icon: "tabler:info-circle" }),
          r[18] || (r[18] = q("Deep analysis is off in the flow, so this field runs as standard.", -1))
        ])) : $("", !0),
        t("div", wa, [
          r[19] || (r[19] = t("span", { id: "within-label" }, "Search within", -1)),
          f($e, {
            modelValue: e.field.search_within,
            "onUpdate:modelValue": r[7] || (r[7] = (g) => e.field.search_within = g),
            "labelled-by": "within-label",
            options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
          }, null, 8, ["modelValue"]),
          t("small", null, c(e.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
        ]),
        e.field.search_within === "sections" && !e.mapEnabled ? (a(), o("p", Sa, [
          f(p(A), { icon: "tabler:alert-circle" }),
          r[20] || (r[20] = q("Turn on Map the document to read sections.", -1))
        ])) : $("", !0),
        t("label", null, [
          r[21] || (r[21] = q("Group", -1)),
          z(t("input", {
            "onUpdate:modelValue": r[8] || (r[8] = (g) => e.field.group = g),
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
            (a(!0), o(U, null, I(e.groups, (g) => (a(), o("option", {
              key: g,
              value: g
            }, null, 8, Ca))), 128))
          ]),
          r[22] || (r[22] = t("small", null, "Use dotted snake_case names. Values nest under this path.", -1))
        ]),
        r[26] || (r[26] = t("h4", null, "Checking it", -1)),
        t("label", null, [
          r[23] || (r[23] = q("Validation hints", -1)),
          z(t("textarea", {
            "onUpdate:modelValue": r[9] || (r[9] = (g) => e.field.validation_hints = g),
            rows: "2",
            maxlength: "4000",
            placeholder: "Rules the value must satisfy"
          }, null, 512), [
            [_, e.field.validation_hints]
          ])
        ]),
        t("div", Ea, [
          r[24] || (r[24] = t("span", null, [
            q("Evidence required"),
            t("small", null, "The value must cite a quote from the document.")
          ], -1)),
          f(Z, {
            modelValue: e.field.evidence_required,
            "onUpdate:modelValue": r[10] || (r[10] = (g) => e.field.evidence_required = g),
            label: "Evidence required",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : $("", !0),
      !e.readonly && (d.value || e.siblingNames) ? (a(), o("button", {
        key: 1,
        type: "button",
        class: "kx-btn kx-btn-danger kx-focus-halo",
        onClick: r[11] || (r[11] = (g) => u("remove"))
      }, c(d.value ? "Remove field" : "Remove property"), 1)) : $("", !0)
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
    const s = M(/* @__PURE__ */ new Set()), l = pe();
    function u(m) {
      s.value.has(m) ? s.value.delete(m) : s.value.add(m);
    }
    const d = (m) => m.indices.length + m.children.reduce((y, r) => y + d(r), 0);
    return (m, y) => {
      const r = st("FieldGroups", !0);
      return a(), o("div", Fa, [
        e.node.indices.length ? (a(), o("ul", Na, [
          (a(!0), o(U, null, I(e.node.indices, (g) => (a(), o("li", { key: g }, [
            je(m.$slots, "default", { index: g })
          ]))), 128))
        ])) : $("", !0),
        (a(!0), o(U, null, I(e.node.children, (g, S) => (a(), o("section", {
          key: g.path,
          class: "field-group",
          "aria-label": `Group ${g.path}`
        }, [
          t("header", Ma, [
            t("button", {
              type: "button",
              class: "tree-toggle kx-iconbtn kx-focus-outline",
              "aria-label": `${s.value.has(g.path) ? "Expand" : "Collapse"} group ${g.path}`,
              "aria-expanded": !s.value.has(g.path),
              "aria-controls": `${p(l)}-${g.path}`,
              onClick: (E) => u(g.path)
            }, [
              f(p(A), {
                icon: s.value.has(g.path) ? "tabler:chevron-right" : "tabler:chevron-down"
              }, null, 8, ["icon"])
            ], 8, Aa),
            je(m.$slots, "header", {
              path: g.path,
              label: g.name,
              count: d(g),
              first: S === 0,
              last: S === e.node.children.length - 1
            }, () => [
              t("span", Ra, c(g.name), 1)
            ])
          ]),
          z(t("div", {
            id: `${p(l)}-${g.path}`,
            class: "group-content"
          }, [
            f(r, { node: g }, {
              default: me((E) => [
                je(m.$slots, "default", bt({ ref_for: !0 }, E))
              ]),
              header: me((E) => [
                je(m.$slots, "header", bt({ ref_for: !0 }, E), () => [
                  t("span", La, c(E.label), 1)
                ])
              ]),
              _: 3
            }, 8, ["node"])
          ], 8, Ba), [
            [Ke, !s.value.has(g.path)]
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
    const l = e, u = s, d = M(l.initialValue), m = M(""), y = M(), r = pe();
    Fe(() => {
      y.value.focus(), y.value.select();
    });
    function g() {
      const S = d.value.trim();
      if (!S || !$l.test(S)) {
        m.value = "Use a dotted path of snake_case group names.";
        return;
      }
      if (S.length > l.maxLength) {
        m.value = "The group and its nested paths must fit within 320 characters.";
        return;
      }
      u("save", S);
    }
    return (S, E) => (a(), o("form", {
      class: "group-path-editor",
      onSubmit: ve(g, ["prevent"])
    }, [
      z(t("input", {
        ref_key: "input",
        ref: y,
        "onUpdate:modelValue": E[0] || (E[0] = (i) => d.value = i),
        "aria-label": e.inputLabel,
        maxlength: e.maxLength,
        "aria-invalid": !!m.value,
        "aria-describedby": m.value ? p(r) : void 0,
        "aria-required": "true",
        autocomplete: "off",
        spellcheck: "false",
        placeholder: "parties.borrower",
        onKeydown: [
          Ee(ve(g, ["prevent"]), ["enter"]),
          E[1] || (E[1] = Ee(ve((i) => u("cancel"), ["stop", "prevent"]), ["esc"]))
        ]
      }, null, 40, Oa), [
        [_, d.value]
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
        onClick: E[2] || (E[2] = (i) => u("cancel"))
      }, [
        f(p(A), { icon: "tabler:x" })
      ], 8, Ta),
      m.value ? (a(), o("p", {
        key: 0,
        id: p(r),
        class: "field-error",
        role: "alert"
      }, c(m.value), 9, Da)) : $("", !0)
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
    const l = e, u = s, d = M(!1), m = M(!1), y = M(), r = M(), g = M(), S = pe(), E = N(() => [
      { label: "Move up", disabled: l.first, command: () => u("reorder", -1) },
      { label: "Move down", disabled: l.last, command: () => u("reorder", 1) },
      { separator: !0 },
      { label: "Delete group and its fields", command: () => u("remove") }
    ]);
    function i() {
      d.value = !0;
    }
    async function n() {
      d.value = !1, await Ce(), r.value.focus();
    }
    async function b(R) {
      const w = y.value.closest(".field-tree");
      d.value = !1, u("rename", R), await Ce(), w.querySelector(`[data-group-rename="${R}"]`).focus();
    }
    return (R, w) => (a(), o("div", {
      ref_key: "heading",
      ref: y,
      class: "group-heading"
    }, [
      d.value ? (a(), J(Rt, {
        key: 0,
        "initial-value": e.path,
        "input-label": `Group path for ${e.path}`,
        "save-label": "Save group name",
        "cancel-label": "Cancel group rename",
        "max-length": e.maxLength,
        onSave: b,
        onCancel: n
      }, null, 8, ["initial-value", "input-label", "max-length"])) : (a(), o(U, { key: 1 }, [
        e.readonly ? (a(), o("span", {
          key: 0,
          class: "group-title",
          title: e.path
        }, c(e.name), 9, Ia)) : (a(), o("button", {
          key: 1,
          ref_key: "renameButton",
          ref: r,
          type: "button",
          class: "group-title group-name-button kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Rename group ${e.path}`,
          "data-group-rename": e.path,
          title: e.path,
          onClick: i
        }, [
          t("span", null, c(e.name), 1),
          f(p(A), {
            icon: "tabler:pencil",
            "aria-hidden": "true"
          })
        ], 8, ja)),
        t("span", {
          class: "count group-count",
          "aria-label": `${e.count} fields`
        }, c(e.count), 9, za),
        e.readonly ? $("", !0) : (a(), o("div", Wa, [
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Add field to ${e.path}`,
            disabled: !e.canAdd,
            title: "Add field",
            onClick: w[0] || (w[0] = (F) => u("add"))
          }, [
            f(p(A), { icon: "tabler:plus" })
          ], 8, Ha),
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Actions for group ${e.path}`,
            "aria-haspopup": "menu",
            "aria-expanded": m.value,
            "aria-controls": p(S),
            onClick: w[1] || (w[1] = (F) => g.value.toggle(F))
          }, [
            f(p(A), { icon: "tabler:dots" })
          ], 8, Ga),
          f(p(Mt), {
            id: p(S),
            ref_key: "menu",
            ref: g,
            model: E.value,
            popup: "",
            "append-to": "self",
            onShow: w[2] || (w[2] = (F) => m.value = !0),
            onHide: w[3] || (w[3] = (F) => m.value = !1)
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
    const l = e, u = s, d = pe(), m = pe(), y = M(), r = M(!1), g = N(() => [
      { label: "Move up", disabled: l.first, command: () => u("reorder", l.field, l.trail, -1) },
      { label: "Move down", disabled: l.last, command: () => u("reorder", l.field, l.trail, 1) }
    ]), S = M(!0);
    fe(() => l.selected, (w) => {
      const F = ie(l.field, l.trail);
      w !== F && w.startsWith(F + (l.trail.length ? "/" : "")) && (S.value = !0);
    });
    const E = N(() => l.trail.at(-1) !== "item"), i = N(() => E.value ? l.shape.name || "New field" : "Each item"), n = N(() => l.trail.length ? void 0 : l.shape), b = N(() => l.shape.type === "object" || l.shape.type === "list");
    function R(w) {
      w.key === "ArrowRight" && b.value && (S.value = !0, w.preventDefault(), w.stopPropagation()), w.key === "ArrowLeft" && b.value && (S.value = !1, w.preventDefault(), w.stopPropagation());
    }
    return (w, F) => {
      const K = st("ShapeTree", !0);
      return a(), o("div", {
        class: "shape-tree-node",
        onKeydown: R
      }, [
        t("div", {
          class: Q(["row-item", { active: e.selected === p(ie)(e.field, e.trail) }])
        }, [
          b.value ? (a(), o("button", {
            key: 0,
            class: "tree-toggle kx-iconbtn kx-focus-outline",
            type: "button",
            "aria-label": `${S.value ? "Collapse" : "Expand"} ${e.path}`,
            "aria-expanded": S.value,
            onClick: F[0] || (F[0] = (D) => S.value = !S.value)
          }, [
            f(p(A), {
              icon: S.value ? "tabler:chevron-down" : "tabler:chevron-right"
            }, null, 8, ["icon"])
          ], 8, Qa)) : (a(), o("span", Ja)),
          t("button", {
            type: "button",
            class: "row-main kx-focus-halo",
            "aria-label": `Edit ${e.path}`,
            "aria-describedby": p(d),
            "aria-current": e.selected === p(ie)(e.field, e.trail) ? "true" : void 0,
            onClick: F[1] || (F[1] = (D) => u("select", e.field, e.trail))
          }, [
            t("span", Xa, [
              t("span", Za, [
                f(p(A), {
                  icon: p(Jl)(e.shape.type),
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                t("span", {
                  class: "row-label",
                  title: i.value
                }, c(i.value), 9, _a),
                e.error ? (a(), J(p(A), {
                  key: 0,
                  icon: "tabler:alert-circle",
                  class: "row-warn",
                  "aria-label": e.error,
                  title: e.error
                }, null, 8, ["aria-label", "title"])) : $("", !0)
              ]),
              t("span", {
                id: p(d),
                class: Q(["row-desc", { missing: !e.shape.description }]),
                title: e.shape.description || void 0
              }, c(e.shape.description || "No description"), 11, en)
            ]),
            t("span", tn, [
              t("span", ln, c(e.shape.type), 1),
              t("span", an, [
                E.value && e.shape.required ? (a(), o("span", nn, [
                  f(p(A), {
                    icon: "tabler:asterisk",
                    "aria-hidden": "true"
                  })
                ])) : $("", !0),
                n.value?.strategy === "deep" ? (a(), o("span", sn, [
                  f(p(A), {
                    icon: "tabler:microscope",
                    "aria-hidden": "true"
                  })
                ])) : $("", !0),
                n.value?.search_within === "sections" ? (a(), o("span", on, [
                  f(p(A), {
                    icon: "tabler:layout-list",
                    "aria-hidden": "true"
                  })
                ])) : $("", !0),
                n.value?.evidence_required ? (a(), o("span", un, [
                  f(p(A), {
                    icon: "tabler:file-search",
                    "aria-hidden": "true"
                  })
                ])) : $("", !0)
              ])
            ])
          ], 8, Ya),
          !e.readonly && E.value ? (a(), o("span", dn, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} up`,
              disabled: e.first,
              onClick: F[2] || (F[2] = (D) => u("reorder", e.field, e.trail, -1))
            }, [
              f(p(A), { icon: "tabler:chevron-up" })
            ], 8, rn),
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} down`,
              disabled: e.last,
              onClick: F[3] || (F[3] = (D) => u("reorder", e.field, e.trail, 1))
            }, [
              f(p(A), { icon: "tabler:chevron-down" })
            ], 8, cn)
          ])) : $("", !0),
          !e.readonly && E.value ? (a(), o("div", {
            key: 3,
            class: "row-overflow",
            onKeydown: F[7] || (F[7] = ve(() => {
            }, ["stop"]))
          }, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Actions for ${e.path}`,
              "aria-haspopup": "menu",
              "aria-expanded": r.value,
              "aria-controls": p(m),
              onClick: F[4] || (F[4] = (D) => y.value.toggle(D))
            }, [
              f(p(A), { icon: "tabler:dots" })
            ], 8, vn),
            f(p(Mt), {
              id: p(m),
              ref_key: "menu",
              ref: y,
              model: g.value,
              popup: "",
              "append-to": "self",
              onShow: F[5] || (F[5] = (D) => r.value = !0),
              onHide: F[6] || (F[6] = (D) => r.value = !1)
            }, null, 8, ["id", "model"])
          ], 32)) : $("", !0)
        ], 2),
        b.value && S.value ? (a(), o("ul", mn, [
          (a(!0), o(U, null, I(e.shape.properties, (D, j) => (a(), o("li", { key: j }, [
            f(K, {
              shape: D,
              field: e.field,
              trail: [...e.trail, j],
              path: `${e.path}.${D.name || "New property"}`,
              selected: e.selected,
              readonly: e.readonly,
              first: j === 0,
              last: j === e.shape.properties.length - 1,
              onSelect: F[8] || (F[8] = (H, P) => u("select", H, P)),
              onAdd: F[9] || (F[9] = (H, P) => u("add", H, P)),
              onReorder: F[10] || (F[10] = (H, P, O) => u("reorder", H, P, O))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly", "first", "last"])
          ]))), 128)),
          e.shape.item ? (a(), o("li", pn, [
            f(K, {
              shape: e.shape.item,
              field: e.field,
              trail: [...e.trail, "item"],
              path: `${e.path}[]`,
              selected: e.selected,
              readonly: e.readonly,
              onSelect: F[11] || (F[11] = (D, j) => u("select", D, j)),
              onAdd: F[12] || (F[12] = (D, j) => u("add", D, j)),
              onReorder: F[13] || (F[13] = (D, j, H) => u("reorder", D, j, H))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly"])
          ])) : $("", !0),
          !e.readonly && e.shape.type === "object" && e.trail.length + 1 < p(Ae) ? (a(), o("li", fn, [
            t("button", {
              type: "button",
              class: "kx-btn kx-btn-ghost kx-focus-halo sm",
              "aria-label": `Add property to ${e.path}`,
              disabled: (e.shape.properties?.length ?? 0) >= 100,
              onClick: F[14] || (F[14] = (D) => u("add", e.field, e.trail))
            }, [
              f(p(A), { icon: "tabler:plus" }),
              F[15] || (F[15] = q("Add property", -1))
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
}, wn = /* @__PURE__ */ W({
  __name: "AgentPicker",
  props: {
    value: {},
    readonly: { type: Boolean }
  },
  emits: ["select"],
  setup(e, { emit: s }) {
    const l = s, u = M(!!customElements.get("wc-agent-picker")), d = M("");
    Fe(async () => {
      if (!u.value)
        try {
          await Ze("wc-agent-picker", { timeoutMs: 8e3 }), u.value = !0;
        } catch (y) {
          d.value = y instanceof Error ? y.message : String(y);
        }
    });
    function m(y) {
      if (y.composedPath()[0] !== y.currentTarget) return;
      const r = y.detail;
      l("select", r.agent_id);
    }
    return (y, r) => (a(), o("div", gn, [
      r[0] || (r[0] = t("span", null, "Scout agent", -1)),
      e.readonly ? (a(), o("p", yn, c(e.value || "Built-in scout"), 1)) : u.value ? (a(), o("wc-agent-picker", {
        key: 1,
        config: JSON.stringify({ agent_id: e.value || "" }),
        "aria-label": "Scout agent",
        placeholder: "Choose your agent…",
        onChange: m
      }, null, 40, kn)) : d.value ? (a(), o("p", $n, "Could not load agent picker: " + c(d.value), 1)) : (a(), o("span", xn, "Loading agents…")),
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
    const l = s, u = M(!!customElements.get("wc-model-picker")), d = M("");
    Fe(async () => {
      if (!u.value)
        try {
          await Ze("wc-model-picker", { timeoutMs: 8e3 }), u.value = !0;
        } catch (y) {
          d.value = y instanceof Error ? y.message : String(y);
        }
    });
    function m(y) {
      const r = y.detail;
      typeof r == "string" && l("select", r);
    }
    return (y, r) => u.value ? (a(), o("wc-model-picker", {
      key: 0,
      value: e.value,
      capability: e.capability,
      "aria-labelledby": e.labelledBy,
      onSelect: m
    }, null, 40, Sn)) : d.value ? (a(), o("p", Vn, "Could not load model picker: " + c(d.value), 1)) : (a(), o("span", Cn, "Loading models…"));
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
    const s = e, l = Le(e, "modelValue"), u = N(() => s.percent ? `${Math.round(l.value * 100)}%` : `${l.value.toLocaleString()}${s.unit ? ` ${s.unit}` : ""}`), d = (r) => s.log ? Math.log(r / s.min) / Math.log(s.max / s.min) * Se : (r - s.min) / (s.max - s.min) * Se;
    function m(r) {
      const g = s.log ? s.min * Math.pow(s.max / s.min, r / Se) : s.min + (s.max - s.min) * r / Se, S = Math.round(g / s.step) * s.step;
      return Math.min(s.max, Math.max(s.min, Number(S.toFixed(4))));
    }
    const y = N({ get: () => Math.round(d(l.value)), set: (r) => {
      l.value = m(r);
    } });
    return (r, g) => (a(), o("div", En, [
      t("div", qn, [
        t("span", null, c(e.label), 1),
        t("output", Fn, c(u.value), 1)
      ]),
      z(t("input", {
        "onUpdate:modelValue": g[0] || (g[0] = (S) => y.value = S),
        type: "range",
        min: "0",
        max: Se,
        step: "1",
        "aria-label": e.label,
        "aria-valuetext": u.value,
        disabled: e.disabled,
        style: qe({ "--fill": `${y.value / Se * 100}%` })
      }, null, 12, Nn), [
        [
          _,
          y.value,
          void 0,
          { number: !0 }
        ]
      ]),
      e.hints ? (a(), o("div", Un, [
        t("span", null, c(e.hints[0]), 1),
        t("span", null, c(e.hints[1]), 1)
      ])) : $("", !0),
      e.note ? (a(), o("small", Mn, c(e.note), 1)) : $("", !0)
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
    return (l, u) => (a(), o("figure", An, [
      t("div", Rn, [
        u[2] || (u[2] = t("span", { class: "fd-node solid" }, "Pass", -1)),
        (a(!0), o(U, null, I(Math.min(s.rounds, 8), (d) => (a(), o(U, { key: d }, [
          u[0] || (u[0] = t("span", { class: "fd-link" }, null, -1)),
          t("span", Bn, [
            t("span", null, "R" + c(d), 1),
            t("span", Ln, [
              (a(!0), o(U, null, I(Math.min(s.extra, 6), (m) => (a(), o("i", { key: m }))), 128))
            ])
          ])
        ], 64))), 128)),
        s.rounds > 8 ? (a(), o(U, { key: 0 }, [
          u[1] || (u[1] = t("span", { class: "fd-link" }, null, -1)),
          t("span", On, "+" + c(s.rounds - 8), 1)
        ], 64)) : $("", !0),
        u[3] || (u[3] = t("span", { class: "fd-link" }, null, -1)),
        t("span", Pn, "≥ " + c(Math.round(s.confidence * 100)) + "%", 1)
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
    const s = e, l = N(() => Math.min(s.queries * s.perQuery, s.cap));
    return (u, d) => (a(), o("figure", Dn, [
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
          t("b", null, c(l.value), 1),
          d[4] || (d[4] = q(" chunks", -1)),
          t("small", null, c(e.queries * e.perQuery > e.cap ? `capped at ${e.cap}` : "read per field"), 1)
        ])
      ]),
      t("figcaption", null, "Each deep field gets its own queries; up to " + c(l.value) + " chunks are read for it before analysis.", 1)
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
    const s = e, l = N(() => s.config.stages), u = (i) => Vl(s.stage, i), d = xl(), m = N(() => s.config.fields.filter((i) => i.strategy === "deep").length), y = N(() => s.config.fields.filter((i) => i.search_within === "sections").map((i) => i.name || "New field")), r = N(() => Et(s.config));
    function g(i) {
      l.value.verify.check_support = i, i || (l.value.verify.check_completeness = !1);
    }
    function S(i) {
      i ? l.value.scout.agent_id = i : delete l.value.scout.agent_id;
    }
    function E(i, n) {
      const b = l.value.scout.tools.filter((R) => R !== i);
      l.value.scout.tools = n ? [...b, i] : b;
    }
    return (i, n) => (a(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", Qn, c(p(wl)[e.stage]), 1),
      e.stage === "map" ? (a(), o(U, { key: 0 }, [
        t("div", Jn, [
          n[33] || (n[33] = t("span", null, "Stage enabled", -1)),
          f(Z, {
            modelValue: l.value.map.enabled,
            "onUpdate:modelValue": n[0] || (n[0] = (b) => l.value.map.enabled = b),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Yn, [
          n[34] || (n[34] = t("span", { id: "outline-label" }, "Outline", -1)),
          f($e, {
            modelValue: l.value.map.outline,
            "onUpdate:modelValue": n[1] || (n[1] = (b) => l.value.map.outline = b),
            "labelled-by": "outline-label",
            options: [{ value: "find_or_build", label: "Use contents first" }, { value: "build", label: "Always build" }]
          }, null, 8, ["modelValue"]),
          n[35] || (n[35] = t("small", null, "The document's own headings are used when it has them; otherwise the model builds an outline.", -1))
        ]),
        t("div", Xn, [
          n[36] || (n[36] = t("span", null, [
            q("Section summaries"),
            t("small", null, "A short summary per section helps pick the right sections in long documents.")
          ], -1)),
          f(Z, {
            modelValue: l.value.map.section_summaries,
            "onUpdate:modelValue": n[2] || (n[2] = (b) => l.value.map.section_summaries = b),
            label: "Section summaries",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        n[38] || (n[38] = t("h4", null, "Models", -1)),
        t("div", Zn, [
          n[37] || (n[37] = t("span", null, "Outliner", -1)),
          f(ce, {
            value: l.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: n[3] || (n[3] = (b) => l.value.map.model = b)
          }, null, 8, ["value"])
        ]),
        n[39] || (n[39] = t("h4", null, "Fields that read sections", -1)),
        y.value.length ? (a(), o("p", _n, [
          (a(!0), o(U, null, I(y.value, (b) => (a(), o("span", {
            key: b,
            class: "chip primary"
          }, c(b), 1))), 128))
        ])) : (a(), o("p", es, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : $("", !0),
      e.stage === "prefetch" ? (a(), o(U, { key: 1 }, [
        t("div", ts, [
          n[40] || (n[40] = t("span", null, "Stage enabled", -1)),
          f(Z, {
            modelValue: l.value.prefetch.enabled,
            "onUpdate:modelValue": n[4] || (n[4] = (b) => l.value.prefetch.enabled = b),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        n[44] || (n[44] = t("h4", null, "Queries", -1)),
        (a(!0), o(U, null, I(l.value.prefetch.queries, (b, R) => (a(), o("div", {
          key: R,
          class: "query-row"
        }, [
          t("div", ls, [
            t("label", null, [
              n[41] || (n[41] = q("Name", -1)),
              z(t("input", {
                "onUpdate:modelValue": (w) => b.name = w,
                placeholder: "Parties"
              }, null, 8, as), [
                [_, b.name]
              ])
            ]),
            t("label", null, [
              n[42] || (n[42] = q("Chunks", -1)),
              z(t("input", {
                "onUpdate:modelValue": (w) => b.chunks = w,
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
            n[43] || (n[43] = q("Query", -1)),
            z(t("textarea", {
              "onUpdate:modelValue": (w) => b.query = w,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, ss), [
              [_, b.query]
            ])
          ]),
          e.readonly ? $("", !0) : (a(), o("button", {
            key: 0,
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo sm",
            onClick: (w) => l.value.prefetch.queries.splice(R, 1)
          }, "Remove query", 8, os))
        ]))), 128)),
        l.value.prefetch.queries.length ? $("", !0) : (a(), o("p", is, "No fixed queries. Field search hints still run.")),
        e.readonly ? $("", !0) : (a(), o("button", {
          key: 1,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          onClick: n[5] || (n[5] = (b) => l.value.prefetch.queries.push(p(Sl)()))
        }, "Add query"))
      ], 64)) : $("", !0),
      e.stage === "scout" ? (a(), o(U, { key: 2 }, [
        t("div", us, [
          n[45] || (n[45] = t("span", null, "Stage enabled", -1)),
          f(Z, {
            modelValue: l.value.scout.enabled,
            "onUpdate:modelValue": n[6] || (n[6] = (b) => l.value.scout.enabled = b),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", ds, [
          n[46] || (n[46] = t("span", { id: "mode-label" }, "Mode", -1)),
          f($e, {
            modelValue: l.value.scout.mode,
            "onUpdate:modelValue": n[7] || (n[7] = (b) => l.value.scout.mode = b),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          t("small", null, c(l.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        l.value.scout.mode === "agent" ? (a(), J(wn, {
          key: 0,
          value: l.value.scout.agent_id,
          readonly: e.readonly,
          onSelect: S
        }, null, 8, ["value", "readonly"])) : $("", !0),
        l.value.scout.mode === "loop" ? (a(), J(Tn, {
          key: 1,
          rounds: l.value.scout.max_rounds,
          confidence: l.value.scout.target_confidence,
          extra: l.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"])) : $("", !0),
        n[51] || (n[51] = t("h4", null, "Models", -1)),
        t("div", rs, [
          n[47] || (n[47] = t("span", null, "Scout", -1)),
          f(ce, {
            value: l.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: n[8] || (n[8] = (b) => l.value.scout.model = b)
          }, null, 8, ["value"])
        ]),
        n[52] || (n[52] = t("h4", null, "Loop", -1)),
        f(le, {
          modelValue: l.value.scout.max_rounds,
          "onUpdate:modelValue": n[9] || (n[9] = (b) => l.value.scout.max_rounds = b),
          label: l.value.scout.mode === "agent" ? "Rounds" : "Follow-up rounds",
          min: u("max_rounds").min,
          max: u("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        l.value.scout.mode === "loop" ? (a(), J(le, {
          key: 2,
          modelValue: l.value.scout.target_confidence,
          "onUpdate:modelValue": n[10] || (n[10] = (b) => l.value.scout.target_confidence = b),
          label: "Stop at confidence",
          min: u("target_confidence").min,
          max: u("target_confidence").max,
          step: 0.05,
          percent: "",
          hints: ["Stop early", "Keep looking"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])) : $("", !0),
        f(le, {
          modelValue: l.value.scout.max_extra_queries,
          "onUpdate:modelValue": n[11] || (n[11] = (b) => l.value.scout.max_extra_queries = b),
          label: l.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: u("max_extra_queries").min,
          max: u("max_extra_queries").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.scout.max_tokens,
          "onUpdate:modelValue": n[12] || (n[12] = (b) => l.value.scout.max_tokens = b),
          label: "Scout output limit",
          min: u("max_tokens").min,
          max: u("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        l.value.scout.mode === "agent" ? (a(), o("p", cs, "Tool budget: " + c(l.value.scout.max_rounds * l.value.scout.max_extra_queries) + " calls.", 1)) : $("", !0),
        l.value.scout.mode === "loop" ? (a(), o("div", vs, [
          n[48] || (n[48] = t("span", null, [
            q("Drop noisy chunks"),
            t("small", null, "Chunks no field needs leave the evidence pool; chunks cited for a field always stay.")
          ], -1)),
          f(Z, {
            modelValue: l.value.scout.drop_noise,
            "onUpdate:modelValue": n[13] || (n[13] = (b) => l.value.scout.drop_noise = b),
            label: "Drop noisy chunks",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])) : $("", !0),
        t("div", ms, [
          n[49] || (n[49] = t("span", null, [
            q("Share scout notes with extraction"),
            t("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          f(Z, {
            modelValue: l.value.scout.share_notes,
            "onUpdate:modelValue": n[14] || (n[14] = (b) => l.value.scout.share_notes = b),
            label: "Share scout notes with extraction",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l.value.scout.mode === "agent" ? (a(), o(U, { key: 5 }, [
          n[50] || (n[50] = t("h4", null, "Agent tools", -1)),
          (a(!0), o(U, null, I(p(d), (b) => (a(), o("div", {
            key: b,
            class: "toggle-row"
          }, [
            t("span", null, c(p(lt)(b)), 1),
            f(Z, {
              "model-value": l.value.scout.tools.includes(b),
              label: p(lt)(b),
              disabled: e.readonly,
              "onUpdate:modelValue": (R) => E(b, R)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : $("", !0)
      ], 64)) : $("", !0),
      e.stage === "deep" ? (a(), o(U, { key: 3 }, [
        t("div", ps, [
          n[53] || (n[53] = t("span", null, "Stage enabled", -1)),
          f(Z, {
            modelValue: l.value.deep.enabled,
            "onUpdate:modelValue": n[15] || (n[15] = (b) => l.value.deep.enabled = b),
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
          n[54] || (n[54] = t("span", { id: "read-label" }, "Reads", -1)),
          f($e, {
            modelValue: l.value.deep.read,
            "onUpdate:modelValue": n[16] || (n[16] = (b) => l.value.deep.read = b),
            "labelled-by": "read-label",
            options: [{ value: "chunks", label: "Retrieved chunks" }, { value: "sections", label: "Whole sections" }]
          }, null, 8, ["modelValue"]),
          n[55] || (n[55] = t("small", null, "Whole sections suit clauses that span many passages; long sections fall back to chunks.", -1))
        ]),
        n[58] || (n[58] = t("h4", null, "Models", -1)),
        t("div", bs, [
          n[56] || (n[56] = t("span", null, "Analysis", -1)),
          f(ce, {
            value: l.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: n[17] || (n[17] = (b) => l.value.deep.model = b)
          }, null, 8, ["value"])
        ]),
        t("div", hs, [
          n[57] || (n[57] = t("span", null, "Query writer", -1)),
          f(ce, {
            value: l.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: n[18] || (n[18] = (b) => l.value.deep.query_model = b)
          }, null, 8, ["value"])
        ]),
        n[59] || (n[59] = t("h4", null, "Reach", -1)),
        f(le, {
          modelValue: l.value.deep.parallel_fields,
          "onUpdate:modelValue": n[19] || (n[19] = (b) => l.value.deep.parallel_fields = b),
          label: "Fields at a time",
          min: u("parallel_fields").min,
          max: u("parallel_fields").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.deep.max_queries,
          "onUpdate:modelValue": n[20] || (n[20] = (b) => l.value.deep.max_queries = b),
          label: "Queries per field",
          min: u("max_queries").min,
          max: u("max_queries").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.deep.chunks_per_query,
          "onUpdate:modelValue": n[21] || (n[21] = (b) => l.value.deep.chunks_per_query = b),
          label: "Chunks per query",
          min: u("chunks_per_query").min,
          max: u("chunks_per_query").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.deep.chunk_cap,
          "onUpdate:modelValue": n[22] || (n[22] = (b) => l.value.deep.chunk_cap = b),
          label: "Chunk cap per field",
          min: u("chunk_cap").min,
          max: u("chunk_cap").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.deep.min_similarity,
          "onUpdate:modelValue": n[23] || (n[23] = (b) => l.value.deep.min_similarity = b),
          label: "Minimum similarity",
          min: u("min_similarity").min,
          max: u("min_similarity").max,
          step: 0.05,
          percent: "",
          hints: ["Loose", "Strict"],
          note: "Chunks less similar than this are skipped.",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        n[60] || (n[60] = t("h4", null, "Temperature", -1)),
        f(le, {
          modelValue: l.value.deep.query_temperature,
          "onUpdate:modelValue": n[24] || (n[24] = (b) => l.value.deep.query_temperature = b),
          label: "Query writing",
          min: u("query_temperature").min,
          max: u("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.deep.analysis_temperature,
          "onUpdate:modelValue": n[25] || (n[25] = (b) => l.value.deep.analysis_temperature = b),
          label: "Analysis",
          min: u("analysis_temperature").min,
          max: u("analysis_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : $("", !0),
      e.stage === "extract" ? (a(), o(U, { key: 4 }, [
        n[62] || (n[62] = t("h4", null, "Models", -1)),
        t("div", gs, [
          n[61] || (n[61] = t("span", null, "Extraction", -1)),
          f(ce, {
            value: l.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: n[26] || (n[26] = (b) => l.value.extract.model = b)
          }, null, 8, ["value"])
        ]),
        n[63] || (n[63] = t("h4", null, "Field groups", -1)),
        t("ul", ys, [
          (a(!0), o(U, null, I(r.value, (b) => (a(), o("li", {
            key: b.name
          }, [
            t("span", null, c(b.name), 1),
            t("span", ks, c(b.fields.length) + " field" + c(b.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        r.value.length ? $("", !0) : (a(), o("p", $s, "No fields yet.")),
        f(le, {
          modelValue: l.value.extract.max_fields_per_call,
          "onUpdate:modelValue": n[27] || (n[27] = (b) => l.value.extract.max_fields_per_call = b),
          label: "Fields per call",
          min: u("max_fields_per_call").min,
          max: u("max_fields_per_call").max,
          disabled: e.readonly,
          note: `${p(yt)(e.config)} extraction call${p(yt)(e.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        f(le, {
          modelValue: l.value.extract.max_output_tokens,
          "onUpdate:modelValue": n[28] || (n[28] = (b) => l.value.extract.max_output_tokens = b),
          label: "Output limit",
          min: u("max_output_tokens").min,
          max: u("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : $("", !0),
      e.stage === "verify" ? (a(), o(U, { key: 5 }, [
        t("div", xs, [
          n[64] || (n[64] = t("span", null, "Stage enabled", -1)),
          f(Z, {
            modelValue: l.value.verify.enabled,
            "onUpdate:modelValue": n[29] || (n[29] = (b) => l.value.verify.enabled = b),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", ws, [
          n[65] || (n[65] = t("span", null, [
            q("Quotes exist"),
            t("small", null, "Each quote is matched against the document text. No model call.")
          ], -1)),
          f(Z, {
            modelValue: l.value.verify.check_quotes,
            "onUpdate:modelValue": n[30] || (n[30] = (b) => l.value.verify.check_quotes = b),
            label: "Quotes exist",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Ss, [
          n[66] || (n[66] = t("span", null, [
            q("Quotes support values"),
            t("small", null, "A model confirms each quote supports its value.")
          ], -1)),
          f(Z, {
            "model-value": l.value.verify.check_support,
            "onUpdate:modelValue": g,
            label: "Quotes support values",
            disabled: e.readonly
          }, null, 8, ["model-value", "disabled"])
        ]),
        l.value.verify.check_support ? (a(), o(U, { key: 0 }, [
          t("div", Vs, [
            n[67] || (n[67] = t("span", null, [
              q("Check completeness"),
              t("small", null, "Check the requested text and lists against additional source passages. Adds input tokens; completeness can remain unknown.")
            ], -1)),
            f(Z, {
              "model-value": l.value.verify.check_completeness === !0,
              "onUpdate:modelValue": n[31] || (n[31] = (b) => l.value.verify.check_completeness = b),
              label: "Check completeness",
              disabled: e.readonly
            }, null, 8, ["model-value", "disabled"])
          ]),
          n[69] || (n[69] = t("h4", null, "Models", -1)),
          t("div", Cs, [
            n[68] || (n[68] = t("span", null, "Checker", -1)),
            f(ce, {
              value: l.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: n[32] || (n[32] = (b) => l.value.verify.model = b)
            }, null, 8, ["value"])
          ])
        ], 64)) : $("", !0)
      ], 64)) : $("", !0)
    ], 8, Kn));
  }
}), qs = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, Fs = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, Ns = ["x", "y", "width"], Us = ["x", "width"], Ms = /* @__PURE__ */ W({
  __name: "ChunkDiagram",
  props: {
    size: {},
    overlap: {}
  },
  setup(e) {
    const s = e, l = N(() => Math.min(0.9, Math.max(0, s.overlap / s.size))), u = N(() => {
      const d = 100 / (3 - 2 * l.value);
      return [0, 1, 2].map((m) => ({ x: m * d * (1 - l.value), w: d }));
    });
    return (d, m) => (a(), o("figure", qs, [
      (a(), o("svg", Fs, [
        (a(!0), o(U, null, I(u.value, (y, r) => (a(), o("rect", {
          key: r,
          x: y.x,
          y: r % 2 ? 14 : 4,
          width: y.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, Ns))), 128)),
        (a(), o(U, null, I([1, 2], (y) => t("rect", {
          key: "o" + y,
          x: u.value[y].x,
          y: 4,
          width: u.value[y - 1].x + u.value[y - 1].w - u.value[y].x,
          height: "24",
          class: "shared"
        }, null, 8, Us)), 64))
      ])),
      t("figcaption", null, c(e.size.toLocaleString()) + " tokens per chunk · " + c(e.overlap.toLocaleString()) + " shared with the next (" + c(Math.round(l.value * 100)) + "%)", 1)
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
    const s = e, l = N(() => s.config.retrieval), u = N({ get: () => s.config.retention ?? "", set: (E) => {
      E.trim() ? s.config.retention = E.trim() : delete s.config.retention;
    } }), d = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], m = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], y = et("chunk_size"), r = et("overlap"), g = et("section_budget"), S = N(() => Math.min(r.max, l.value.chunk_size - 50));
    return (E, i) => (a(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", Rs, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + c(e.retention) + ".", 1),
      t("label", null, [
        i[12] || (i[12] = q("Retention window", -1)),
        z(t("input", {
          "onUpdate:modelValue": i[0] || (i[0] = (n) => u.value = n),
          "aria-label": "Retention window",
          placeholder: "Global setting"
        }, null, 512), [
          [_, u.value]
        ]),
        i[13] || (i[13] = t("small", null, "Duration for new processed documents and runs, for example 24h. Leave empty to use the global Docscout setting. Existing records keep their expiry.", -1))
      ]),
      i[22] || (i[22] = t("h4", null, "Chunks", -1)),
      f(Ms, {
        size: l.value.chunk_size,
        overlap: l.value.overlap
      }, null, 8, ["size", "overlap"]),
      f(le, {
        modelValue: l.value.chunk_size,
        "onUpdate:modelValue": i[1] || (i[1] = (n) => l.value.chunk_size = n),
        label: "Chunk size",
        min: p(y).min,
        max: p(y).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      f(le, {
        modelValue: l.value.overlap,
        "onUpdate:modelValue": i[2] || (i[2] = (n) => l.value.overlap = n),
        label: "Overlap",
        min: p(r).min,
        max: S.value,
        step: 10,
        unit: "tokens",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      t("div", Bs, [
        i[14] || (i[14] = t("span", null, [
          q("Split by headings"),
          t("small", null, "A chunk never crosses a heading.")
        ], -1)),
        f(Z, {
          modelValue: l.value.split_headings,
          "onUpdate:modelValue": i[3] || (i[3] = (n) => l.value.split_headings = n),
          label: "Split by headings",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t("div", Ls, [
        i[15] || (i[15] = t("span", null, [
          q("Keep tables whole"),
          t("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        f(Z, {
          modelValue: l.value.keep_tables,
          "onUpdate:modelValue": i[4] || (i[4] = (n) => l.value.keep_tables = n),
          label: "Keep tables whole",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      f(le, {
        modelValue: l.value.section_budget,
        "onUpdate:modelValue": i[5] || (i[5] = (n) => l.value.section_budget = n),
        label: "Section budget",
        min: p(g).min,
        max: p(g).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      i[23] || (i[23] = t("h4", null, "Context", -1)),
      t("div", Os, [
        i[16] || (i[16] = t("span", { id: "context-label" }, "Chunk context", -1)),
        f($e, {
          modelValue: l.value.context,
          "onUpdate:modelValue": i[6] || (i[6] = (n) => l.value.context = n),
          "labelled-by": "context-label",
          options: m
        }, null, 8, ["modelValue"]),
        t("small", null, c(m.find((n) => n.value === l.value.context)?.note), 1)
      ]),
      l.value.context === "generated" ? (a(), o("div", Ps, [
        i[17] || (i[17] = t("span", null, "Context writer", -1)),
        f(ce, {
          value: l.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: i[7] || (i[7] = (n) => l.value.context_model = n)
        }, null, 8, ["value"])
      ])) : $("", !0),
      i[24] || (i[24] = t("h4", null, "Search", -1)),
      t("div", Ts, [
        i[18] || (i[18] = t("span", { id: "mode-label" }, "Search mode", -1)),
        f($e, {
          modelValue: l.value.search_mode,
          "onUpdate:modelValue": i[8] || (i[8] = (n) => l.value.search_mode = n),
          "labelled-by": "mode-label",
          options: d
        }, null, 8, ["modelValue"]),
        t("small", null, c(d.find((n) => n.value === l.value.search_mode)?.note), 1)
      ]),
      i[25] || (i[25] = t("h4", null, "Models", -1)),
      t("div", Ds, [
        i[19] || (i[19] = t("span", null, "Embedding", -1)),
        f(ce, {
          value: l.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: i[9] || (i[9] = (n) => l.value.embedding_model = n)
        }, null, 8, ["value"])
      ]),
      t("div", Is, [
        i[20] || (i[20] = t("span", null, [
          q("Highlighter"),
          t("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        f(Z, {
          modelValue: l.value.highlighter,
          "onUpdate:modelValue": i[10] || (i[10] = (n) => l.value.highlighter = n),
          label: "Highlighter",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      l.value.highlighter ? (a(), o("div", js, [
        i[21] || (i[21] = t("span", null, "Highlighter", -1)),
        f(ce, {
          value: l.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: i[11] || (i[11] = (n) => l.value.highlighter_model = n)
        }, null, 8, ["value"])
      ])) : $("", !0)
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
}, ho = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, go = { class: "node-icon" }, yo = { class: "node-main" }, ko = { class: "node-summary" }, $o = { class: "node-side" }, xo = { class: "chip model" }, wo = { class: "branches" }, So = { class: "branch" }, Vo = { class: "branch" }, Co = { class: "node-icon" }, Eo = { class: "node-main" }, qo = { class: "node-summary" }, Fo = ["aria-labelledby", "role", "aria-modal"], No = ["aria-valuenow"], Uo = { class: "side-panel-head" }, Mo = { class: "side-panel-icon" }, Ao = ["id"], Ro = ["aria-label", "title"], Bo = { class: "node-breadcrumb mono" }, Lo = {
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
    const s = e, l = Le(e, "title"), u = Le(e, "description"), d = M({ kind: "document" });
    function m(k, v) {
      try {
        const C = localStorage.getItem(`docscout.${k}`);
        return C === null ? v : C === "1";
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
    const r = M(m("panel", !0)), g = M(m("fields", !0)), S = M(m("flow", !0));
    function E() {
      try {
        const k = Number(localStorage.getItem("docscout.panelWidth"));
        return k >= We ? k : tt;
      } catch {
        return tt;
      }
    }
    const i = M(E()), n = () => {
      const k = O.value?.clientWidth;
      return k ? Math.max(We, k - 420) : Number.POSITIVE_INFINITY;
    };
    function b(k, v = !0) {
      if (i.value = Math.round(Math.min(n(), Math.max(We, k))), v)
        try {
          localStorage.setItem("docscout.panelWidth", String(i.value));
        } catch {
        }
    }
    const R = M(!1);
    function w(k) {
      const v = k.currentTarget, C = k.clientX, Y = i.value;
      v.setPointerCapture(k.pointerId), R.value = !0;
      const X = (ee) => b(Y + (C - ee.clientX), !1), ae = () => {
        R.value = !1, b(i.value), v.removeEventListener("pointermove", X), v.removeEventListener("pointerup", ae);
      };
      v.addEventListener("pointermove", X), v.addEventListener("pointerup", ae);
    }
    function F(k) {
      k.key === "ArrowLeft" ? (b(i.value + 24), k.preventDefault()) : k.key === "ArrowRight" && (b(i.value - 24), k.preventDefault());
    }
    let K = null;
    const D = M(), j = pe();
    async function H(k) {
      if (r.value = k, !B.value) {
        y("panel", k);
        return;
      }
      if (!k && K) {
        const v = K;
        K = null, await Ce(), v.focus();
      }
    }
    function P(k) {
      const v = k === "fields" ? g : S;
      v.value = !v.value, y(k, v.value);
    }
    const O = M(), B = M(!1);
    let ue;
    Fe(() => {
      ue = new ResizeObserver(([k]) => {
        const v = B.value;
        B.value = k.contentRect.width < 1e3, B.value && !v && (r.value = !1), !B.value && v && (r.value = m("panel", !0));
      }), O.value && ue.observe(O.value);
    }), Ct(() => ue?.disconnect());
    const ye = M();
    fe(d, async () => {
      await Ce(), ye.value && (ye.value.scrollTop = 0);
    });
    async function te(k) {
      B.value && !r.value && (K = O.value?.getRootNode()?.activeElement), d.value = k, r.value = !0, B.value && (await Ce(), D.value?.focus());
    }
    const oe = (k) => JSON.stringify(k) === JSON.stringify(d.value), be = N(() => d.value.kind === "field" ? s.config.fields[d.value.index] : void 0), V = N(() => Je(s.config.fields)), h = N(() => d.value.kind === "field" ? V.value.find((k) => k.key === ie(d.value.index, d.value.trail ?? [])) : void 0), x = N(() => h.value?.key ?? ""), L = N(() => {
      const k = h.value;
      return !k || k.trail.at(-1) === "item" || !k.trail.length ? void 0 : V.value.find((C) => C.key === ie(k.field, k.trail.slice(0, -1))).shape.properties.filter((C) => C !== k.shape).map((C) => C.name);
    }), T = M("");
    fe(x, () => {
      T.value = "";
    });
    const Ne = N(() => h.value ? Yl(s.config.fields, h.value) : []), he = N(() => {
      const k = Cl(s.config.fields.map(G));
      return k ? `Group path collides with field ${k}.` : "";
    }), Te = N(() => he.value ? null : Vt(s.config.fields)), Pt = N(() => he.value ? null : Vt(s.config.fields, !0)), it = N(() => {
      const k = d.value;
      return k.kind === "stage" ? ke[k.stage] : k.kind === "field" ? h.value?.trail.length ? h.value.path : be.value?.name || "New field" : k.kind === "document" ? "Read document" : k.kind === "output" ? "Output" : "Details";
    }), Tt = N(() => {
      const k = d.value;
      return k.kind === "stage" ? ot[k.stage] : k.kind === "field" ? "tabler:forms" : k.kind === "document" ? "tabler:file-text" : k.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), Dt = N(() => s.config.fields.filter((k, v) => !(d.value.kind === "field" && d.value.index === v)).map(G)), It = N(() => s.config.stages.deep.enabled), jt = N(() => s.config.stages.map.enabled), zt = N(() => Oe(s.config.fields.map(G))), De = M(!1), ut = M(), dt = pe();
    function Wt(k, v) {
      for (const C of s.config.fields) (C.group === k || C.group.startsWith(k + ".")) && (C.group = v + C.group.slice(k.length));
    }
    const Ht = (k) => 320 - Math.max(0, ...s.config.fields.filter((v) => v.group === k || v.group.startsWith(k + ".")).map((v) => v.group.length - k.length));
    function Gt() {
      g.value = !0, De.value = !0;
    }
    async function rt() {
      De.value = !1, await Ce(), ut.value.focus();
    }
    function Kt(k) {
      s.config.fields.push({ ...at(), group: k }), rt();
    }
    const Qt = N(() => [...new Set(s.config.fields.map((k) => k.group.trim()).filter(Boolean))]), Jt = (k) => Ut(s.config.fields[k], s.config.fields.filter((v, C) => C !== k).map(G)), ct = ["map", "prefetch", "scout", "deep", "extract", "verify"], Yt = N(() => ct.filter((k) => Qe(s.config, k)).map((k) => ke[k]).join(" · ")), Xt = N(() => s.config.fields.map((k) => k.name || "New field").join(", ")), Zt = N(() => ct.filter((k) => Qe(s.config, k)).length), xe = (k) => s.result?.trace.find((v) => v.kind === k);
    function vt(k = "") {
      s.config.fields.push({ ...at(), group: k }), g.value = !0, te({ kind: "field", index: s.config.fields.length - 1 });
    }
    function _t(k) {
      s.config.fields.splice(k, 1), d.value = { kind: "document" };
    }
    function re(k, v = []) {
      te({ kind: "field", index: k, ...v.length ? { trail: v } : {} });
    }
    function mt(k, v) {
      const C = V.value.find((Y) => Y.key === ie(k, v));
      C.shape.properties.push(Nt()), re(k, [...v, C.shape.properties.length - 1]);
    }
    function el() {
      const k = h.value;
      if (!k.trail.length) {
        _t(k.field);
        return;
      }
      const v = V.value.find((C) => C.key === ie(k.field, k.trail.slice(0, -1)));
      v.shape.properties.splice(k.trail.at(-1), 1), re(v.field, v.trail);
    }
    function tl(k, v, C) {
      if (v.length) {
        const X = V.value.find((ne) => ne.key === ie(k, v.slice(0, -1))).shape.properties, ae = v.at(-1), ee = ae + C;
        if (ee < 0 || ee >= X.length) return;
        [X[ae], X[ee]] = [X[ee], X[ae]], re(k, [...v.slice(0, -1), ee]);
      } else {
        const Y = s.config.fields.map((ee, ne) => ee.group === s.config.fields[k].group ? ne : -1).filter((ee) => ee >= 0), X = Y[Y.indexOf(k) + C];
        if (X === void 0) return;
        const ae = s.config.fields;
        [ae[k], ae[X]] = [ae[X], ae[k]], re(X);
      }
    }
    function ll() {
      const k = h.value, v = Ne.value.find((Y) => Y.key === T.value), C = Xl(s.config.fields, k, v);
      re(C.field, C.trail);
    }
    function al(k) {
      const v = h.value?.shape;
      s.config.fields.splice(0, s.config.fields.length, ...s.config.fields.filter((Y) => Y.group !== k && !Y.group.startsWith(k + ".")));
      const C = V.value.find((Y) => Y.shape === v);
      C ? re(C.field, C.trail) : d.value = { kind: "document" };
    }
    function nl(k, v) {
      const C = k.split(".").slice(0, -1).join(".");
      let X = Oe(s.config.fields.map(G));
      for (const se of C.split(".").filter(Boolean)) X = X.children.find((ul) => ul.name === se);
      const ae = X.children.findIndex((se) => se.path === k), ee = X.children[ae + v]?.path;
      if (!ee) return;
      const ne = s.config.fields.filter((se) => se.group === k || se.group.startsWith(k + ".")), Ie = s.config.fields.filter((se) => se.group === ee || se.group.startsWith(ee + ".")), Ue = s.config.fields, ol = Math.min(Ue.indexOf(ne[0]), Ue.indexOf(Ie[0])), ft = Ue.filter((se) => !ne.includes(se) && !Ie.includes(se));
      ft.splice(ol, 0, ...v > 0 ? [...Ie, ...ne] : [...ne, ...Ie]);
      const il = h.value?.shape;
      Ue.splice(0, Ue.length, ...ft);
      const _e = V.value.find((se) => se.shape === il);
      _e && re(_e.field, _e.trail);
    }
    const sl = (k) => k.type === "list" ? `list of ${k.item?.type}` : k.type, pt = N({ get: () => s.config.tags.join(", "), set: (k) => {
      s.config.tags = [...new Set(k.split(",").map((v) => v.trim()).filter(Boolean))];
    } });
    return (k, v) => (a(), o("div", {
      ref_key: "root",
      ref: O,
      class: Q(["builder", { narrow: B.value, "panel-open": r.value, resizing: R.value }])
    }, [
      t("div", {
        class: "canvas",
        inert: B.value && r.value
      }, [
        t("div", Hs, [
          t("section", Gs, [
            t("header", Ks, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": g.value,
                "aria-controls": "fields-body",
                onClick: v[0] || (v[0] = (C) => P("fields"))
              }, [
                f(p(A), {
                  icon: g.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                v[23] || (v[23] = t("h2", { id: "fields-head" }, "Fields", -1)),
                t("span", Js, c(e.config.fields.length), 1)
              ], 8, Qs),
              !g.value && e.config.fields.length ? (a(), o("span", Ys, c(Xt.value), 1)) : $("", !0),
              e.readonly ? $("", !0) : (a(), o("div", Xs, [
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
              e.config.fields.length ? $("", !0) : (a(), o("p", to, "Add the values to pull from each document.")),
              t("div", lo, [
                De.value && !e.readonly ? (a(), o("div", {
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
                ], 8, ao)) : $("", !0),
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
                    f(hn, {
                      shape: e.config.fields[C],
                      field: C,
                      trail: [],
                      path: p(G)(e.config.fields[C]) || "New field",
                      selected: x.value,
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
                he.value ? (a(), o("p", io, c(he.value), 1)) : (a(), o("div", uo, [
                  t("div", null, [
                    v[27] || (v[27] = t("h3", null, "Output shape", -1)),
                    t("pre", ro, c(JSON.stringify(Te.value, null, 2)), 1)
                  ]),
                  t("div", null, [
                    v[28] || (v[28] = t("h3", null, "Example value", -1)),
                    t("pre", co, c(JSON.stringify(Pt.value, null, 2)), 1)
                  ])
                ])),
                v[29] || (v[29] = t("small", null, "Example values illustrate the shape; extracted values come from your document.", -1))
              ])
            ], 512), [
              [Ke, g.value]
            ])
          ]),
          t("section", vo, [
            t("header", mo, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": S.value,
                "aria-controls": "flow-body",
                onClick: v[2] || (v[2] = (C) => P("flow"))
              }, [
                f(p(A), {
                  icon: S.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                v[30] || (v[30] = t("h2", { id: "flow-head" }, "Flow", -1)),
                t("span", fo, c(Zt.value) + " of 6", 1)
              ], 8, po),
              S.value ? $("", !0) : (a(), o("span", bo, c(Yt.value), 1)),
              t("button", {
                type: "button",
                class: Q(["kx-btn kx-btn-ghost kx-focus-halo sm push", { on: oe({ kind: "details" }) }]),
                onClick: v[3] || (v[3] = (C) => te({ kind: "details" }))
              }, [
                f(p(A), { icon: "tabler:info-circle" }),
                v[31] || (v[31] = q("Details", -1))
              ], 2)
            ]),
            z(t("div", ho, [
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "document" }) }]),
                onClick: v[4] || (v[4] = (C) => te({ kind: "document" }))
              }, [
                t("span", go, [
                  f(p(A), { icon: "tabler:file-text" })
                ]),
                t("span", yo, [
                  v[32] || (v[32] = t("span", { class: "node-title" }, "Read document", -1)),
                  t("span", ko, c(p(El)(e.config.retrieval)), 1)
                ]),
                t("span", $o, [
                  t("span", xo, c(p(qt)(e.config.retrieval.embedding_model)), 1)
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
                  t("span", qo, c(e.config.fields.length ? `${e.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [Ke, S.value]
            ])
          ])
        ])
      ], 8, Ws),
      B.value && r.value ? (a(), o("div", {
        key: 0,
        class: "scrim",
        onClick: v[12] || (v[12] = (C) => H(!1))
      })) : $("", !0),
      r.value ? z((a(), o("aside", {
        key: String(B.value),
        class: "side-panel",
        "aria-labelledby": p(j),
        role: B.value ? "dialog" : void 0,
        "aria-modal": B.value ? "true" : void 0,
        style: qe(B.value ? void 0 : { width: `${i.value}px` }),
        onKeydown: v[21] || (v[21] = Ee((C) => B.value && H(!1), ["esc"]))
      }, [
        B.value ? $("", !0) : (a(), o("div", {
          key: 0,
          class: Q(["resizer kx-focus-outline", { active: R.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": i.value,
          "aria-valuemin": We,
          onPointerdown: ve(w, ["prevent"]),
          onKeydown: F,
          onDblclick: v[13] || (v[13] = (C) => b(tt))
        }, null, 42, No)),
        t("header", Uo, [
          t("span", Mo, [
            f(p(A), { icon: Tt.value }, null, 8, ["icon"])
          ]),
          t("h2", { id: p(j) }, c(it.value), 9, Ao),
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
          d.value.kind === "document" ? (a(), J(zs, {
            key: 0,
            config: e.config,
            retention: e.retention,
            readonly: e.readonly
          }, null, 8, ["config", "retention", "readonly"])) : d.value.kind === "stage" ? (a(), J(Es, {
            key: 1,
            stage: d.value.stage,
            config: e.config,
            readonly: e.readonly
          }, null, 8, ["stage", "config", "readonly"])) : d.value.kind === "field" && be.value && h.value ? (a(), o(U, { key: 2 }, [
            t("p", Bo, c(h.value.path), 1),
            f(qa, {
              field: be.value,
              shape: h.value.shape,
              depth: h.value.depth,
              "sibling-names": L.value,
              "other-names": Dt.value,
              groups: Qt.value,
              "deep-enabled": It.value,
              "map-enabled": jt.value,
              readonly: e.readonly,
              onRemove: el,
              onAdd: v[15] || (v[15] = (C) => mt(h.value.field, h.value.trail)),
              onSelectItem: v[16] || (v[16] = (C) => re(h.value.field, [...h.value.trail, "item"]))
            }, null, 8, ["field", "shape", "depth", "sibling-names", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"]),
            !e.readonly && h.value.trail.at(-1) !== "item" ? (a(), o("fieldset", Lo, [
              t("label", null, [
                v[42] || (v[42] = q("Move to parent", -1)),
                z(t("select", {
                  "onUpdate:modelValue": v[17] || (v[17] = (C) => T.value = C),
                  "aria-label": "Move to parent"
                }, [
                  h.value.trail.length ? (a(), o("option", Oo, "Top-level field")) : (a(), o("option", Po, "Choose an object…")),
                  (a(!0), o(U, null, I(Ne.value, (C) => (a(), o("option", {
                    key: C.key,
                    value: C.key
                  }, c(C.path), 9, To))), 128))
                ], 512), [
                  [Ge, T.value]
                ])
              ]),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Move selected node",
                disabled: !T.value && !h.value.trail.length || !T.value && e.config.fields.length >= 100,
                onClick: ll
              }, "Move", 8, Do)
            ])) : $("", !0)
          ], 64)) : d.value.kind === "details" ? (a(), o("fieldset", {
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
                "onUpdate:modelValue": v[19] || (v[19] = (C) => u.value = C),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [_, u.value]
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
          ], 8, Io)) : d.value.kind === "output" ? (a(), o("div", jo, [
            v[47] || (v[47] = t("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            t("ul", zo, [
              (a(!0), o(U, null, I(e.config.fields, (C) => (a(), o("li", {
                key: p(G)(C)
              }, [
                t("span", Wo, c(p(G)(C) || "New field"), 1),
                t("span", Ho, c(sl(C)), 1)
              ]))), 128))
            ]),
            v[48] || (v[48] = t("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : $("", !0)
        ], 512)
      ], 44, Fo)), [
        [p(Ll), { disabled: !B.value }]
      ]) : B.value ? $("", !0) : (a(), o("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: v[22] || (v[22] = (C) => H(!0))
      }, [
        f(p(A), { icon: "tabler:layout-sidebar-right-expand" }),
        t("span", Go, c(it.value), 1)
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
    const l = s, u = M(!1), d = M("");
    Fe(async () => {
      try {
        await Ze("wc-multiselect", { timeoutMs: 8e3 }), u.value = !0;
      } catch (y) {
        d.value = String(y);
      }
    });
    function m(y) {
      const r = y.detail;
      l("select", r.selected[0] || "", r.labels?.[0] || "");
    }
    return (y, r) => u.value ? (a(), o("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(e.value ? [e.value] : []),
      placeholder: "Choose an upload",
      onChange: m
    }, null, 40, Qo)) : d.value ? (a(), o("p", Jo, c(d.value), 1)) : (a(), o("span", Yo, "Loading uploads…"));
  }
}), Xo = ["data-error-kind"], Zo = { key: 0 }, Lt = /* @__PURE__ */ W({
  __name: "FieldFailure",
  props: {
    error: {}
  },
  setup(e) {
    return (s, l) => (a(), o("div", {
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
      e.error?.details ? (a(), o("details", Zo, [
        l[0] || (l[0] = t("summary", { class: "kx-focus-outline" }, "Error details", -1)),
        t("pre", null, c(JSON.stringify(e.error.details, null, 2)), 1)
      ])) : $("", !0)
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
    const s = e, l = N(() => s.value !== null && typeof s.value == "object" && !Array.isArray(s.value) ? s.value : null);
    return (u, d) => {
      const m = st("NestedValue", !0);
      return a(), o("div", _o, [
        Array.isArray(e.value) ? (a(), o("ol", ei, [
          (a(!0), o(U, null, I(e.value, (y, r) => (a(), o("li", { key: r }, [
            f(m, { value: y }, null, 8, ["value"])
          ]))), 128)),
          e.value.length ? $("", !0) : (a(), o("li", ti, "Empty list"))
        ])) : l.value ? (a(), o("dl", li, [
          (a(!0), o(U, null, I(l.value, (y, r) => (a(), o(U, { key: r }, [
            t("dt", null, c(r), 1),
            t("dd", null, [
              f(m, { value: y }, null, 8, ["value"])
            ])
          ], 64))), 128))
        ])) : (a(), o("span", ai, c(e.value === null || e.value === void 0 ? "—" : String(e.value)), 1))
      ]);
    };
  }
}), ni = { class: "value-list" }, si = ["aria-expanded", "onClick"], oi = { class: "value-name" }, ii = { class: "bar" }, ui = ["title"], di = { class: "evidence" }, ri = {
  key: 1,
  class: "muted"
}, ci = {
  key: 2,
  class: "muted"
}, Ot = /* @__PURE__ */ W({
  __name: "ResultFields",
  props: {
    fields: {}
  },
  setup(e) {
    const s = e, l = N(() => Oe(s.fields.map((g) => g.path))), u = M(), d = (g) => `${Math.round(g * 100)}%`, m = (g) => g !== null && typeof g == "object", y = (g) => Array.isArray(g) ? `${g.length} items` : m(g) ? `${Object.keys(g).length} properties` : g == null ? "—" : String(g), r = (g) => g >= 0.9 ? "high" : g >= 0.7 ? "mid" : "low";
    return (g, S) => (a(), o("div", ni, [
      f(Re, { node: l.value }, {
        default: me(({ index: E }) => [
          (a(!0), o(U, null, I([e.fields[E]], (i) => (a(), o("div", {
            key: i.path,
            class: "value-row"
          }, [
            t("button", {
              type: "button",
              class: "value-main",
              "aria-expanded": u.value === i.path,
              onClick: (n) => u.value = u.value === i.path ? void 0 : i.path
            }, [
              t("span", oi, c(i.name), 1),
              t("span", {
                class: Q(["value-text", { missing: i.missing }])
              }, c(i.failed ? "Failed" : i.missing ? "Not in the document" : y(i.value)), 3),
              i.failed ? $("", !0) : (a(), o("span", {
                key: 0,
                class: Q(["confidence", r(i.confidence)])
              }, [
                t("span", ii, [
                  t("span", {
                    style: qe({ width: d(i.confidence) })
                  }, null, 4)
                ]),
                q(c(d(i.confidence)), 1),
                S[0] || (S[0] = t("span", { class: "conf-word" }, " confidence", -1))
              ], 2)),
              i.failed ? $("", !0) : (a(), o("span", {
                key: 1,
                class: Q(["chip", i.verified ? "primary" : "warn"]),
                title: i.reason
              }, [
                f(p(A), {
                  icon: i.verified ? "tabler:shield-check" : "tabler:shield-question"
                }, null, 8, ["icon"]),
                q(c(i.verified ? "Verified" : "Check"), 1)
              ], 10, ui)),
              f(p(A), {
                icon: u.value === i.path ? "tabler:chevron-up" : "tabler:chevron-down",
                class: "value-caret"
              }, null, 8, ["icon"])
            ], 8, si),
            !i.failed && !i.missing && m(i.value) ? (a(), J(Be, {
              key: 0,
              class: "structured-value",
              value: i.value
            }, null, 8, ["value"])) : $("", !0),
            i.failed ? (a(), J(Lt, {
              key: 1,
              error: i.error
            }, null, 8, ["error"])) : $("", !0),
            z(t("div", di, [
              !i.failed && !i.missing && !m(i.value) ? (a(), J(Be, {
                key: 0,
                value: i.value
              }, null, 8, ["value"])) : $("", !0),
              (a(!0), o(U, null, I(i.evidence, (n, b) => (a(), o("blockquote", {
                key: b,
                class: Q({ unfound: n.found === !1 })
              }, [
                t("p", null, "“" + c(n.quote) + "”", 1),
                t("cite", null, [
                  q(c(n.section), 1),
                  n.page !== void 0 && n.page !== null ? (a(), o(U, { key: 0 }, [
                    q(" · Page " + c(n.page), 1)
                  ], 64)) : $("", !0),
                  n.found === !1 ? (a(), o(U, { key: 1 }, [
                    q(" · not found word for word in the document")
                  ], 64)) : $("", !0)
                ])
              ], 2))), 128)),
              i.evidence.length ? $("", !0) : (a(), o("p", ri, "No evidence.")),
              i.reason || !i.verified && !i.failed ? (a(), o("p", ci, c(i.reason || "No reason recorded"), 1)) : $("", !0)
            ], 512), [
              [Ke, u.value === i.path && !i.failed]
            ])
          ]))), 128))
        ]),
        _: 1
      }, 8, ["node"])
    ]));
  }
}), vi = { class: "test" }, mi = { class: "run-bar" }, pi = { class: "run-input" }, fi = { class: "muted run-note" }, bi = {
  key: 0,
  class: "empty"
}, hi = {
  key: 1,
  class: "run-failed",
  role: "alert"
}, gi = {
  key: 2,
  class: "eval-warning",
  role: "status"
}, yi = {
  key: 3,
  class: "test-grid"
}, ki = { class: "block" }, $i = { class: "block-head" }, xi = { class: "muted push" }, wi = { class: "block" }, Si = { class: "timeline" }, Vi = { class: "tl-icon" }, Ci = { class: "tl-main" }, Ei = { class: "tl-head" }, qi = { class: "muted push" }, Fi = { class: "tl-bar" }, Ni = { class: "muted" }, Ui = {
  key: 0,
  class: "tl-msg"
}, Mi = {
  key: 1,
  class: "chips"
}, Ai = /* @__PURE__ */ W({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {},
    running: { type: Boolean },
    canRun: { type: Boolean }
  },
  emits: ["run"],
  setup(e, { emit: s }) {
    const l = e, u = s, d = M(""), m = (E) => `${(E / 1e3).toFixed(1)}s`, y = N(() => Math.max(1, ...l.result?.trace.map((E) => E.duration_ms) ?? [1])), r = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, g = (E) => r[E]?.label ?? ke[E] ?? E, S = (E) => r[E]?.icon ?? ot[E] ?? "tabler:point";
    return (E, i) => (a(), o("div", vi, [
      t("section", mi, [
        t("div", pi, [
          f(Bt, {
            value: d.value,
            onSelect: i[0] || (i[0] = (n) => d.value = n)
          }, null, 8, ["value"])
        ]),
        f(p(de), {
          label: e.running ? "Extracting…" : "Run extraction",
          loading: e.running,
          disabled: !d.value || e.running || !e.canRun,
          onClick: i[1] || (i[1] = (n) => u("run", d.value))
        }, null, 8, ["label", "loading", "disabled"]),
        t("p", fi, c(e.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + c(e.retention) + ".", 1)
      ]),
      e.result ? $("", !0) : (a(), o("p", bi, "No extraction results yet.")),
      e.result?.status === "failed" ? (a(), o("p", hi, [
        f(p(A), { icon: "tabler:alert-triangle" }),
        q("The run stopped: " + c(e.result.error), 1)
      ])) : $("", !0),
      e.result?.status === "partial" ? (a(), o("p", gi, [
        f(p(A), { icon: "tabler:alert-triangle" }),
        i[2] || (i[2] = q("Partial result · Some fields failed. Successful values are available below.", -1))
      ])) : $("", !0),
      e.result ? (a(), o("div", yi, [
        t("section", ki, [
          t("header", $i, [
            i[3] || (i[3] = t("h2", { class: "block-title" }, "Values", -1)),
            t("span", xi, [
              q(c(e.result.tokens.toLocaleString()) + " tokens · " + c(m(e.result.duration_ms)), 1),
              e.result.page_range ? (a(), o(U, { key: 0 }, [
                q(" · Pages " + c(e.result.page_range.first) + "–" + c(e.result.page_range.last), 1)
              ], 64)) : e.result.pages ? (a(), o(U, { key: 1 }, [
                q(" · " + c(e.result.pages) + " pages", 1)
              ], 64)) : $("", !0)
            ])
          ]),
          f(Ot, {
            fields: e.result.fields
          }, null, 8, ["fields"])
        ]),
        t("section", wi, [
          i[4] || (i[4] = t("header", { class: "block-head" }, [
            t("h2", { class: "block-title" }, "Steps")
          ], -1)),
          t("ol", Si, [
            (a(!0), o(U, null, I(e.result.trace, (n, b) => (a(), o("li", {
              key: b,
              class: Q(n.status)
            }, [
              t("span", Vi, [
                f(p(A), {
                  icon: S(n.kind)
                }, null, 8, ["icon"])
              ]),
              t("div", Ci, [
                t("div", Ei, [
                  t("strong", null, c(g(n.kind)), 1),
                  t("span", qi, c(m(n.duration_ms)), 1)
                ]),
                t("span", Fi, [
                  t("span", {
                    style: qe({ width: `${Math.max(4, n.duration_ms / y.value * 100)}%` })
                  }, null, 4)
                ]),
                t("p", Ni, [
                  q(c(n.scope), 1),
                  n.pages ? (a(), o(U, { key: 0 }, [
                    q(" · Pages " + c(n.pages.first) + "–" + c(n.pages.last), 1)
                  ], 64)) : $("", !0),
                  n.model ? (a(), o(U, { key: 1 }, [
                    q(" · " + c(n.model), 1)
                  ], 64)) : $("", !0),
                  q(" · " + c((n.input_tokens + n.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                n.message ? (a(), o("p", Ui, c(n.message), 1)) : $("", !0),
                n.queries?.length ? (a(), o("div", Mi, [
                  (a(!0), o(U, null, I(n.queries, (R) => (a(), o("span", {
                    key: R,
                    class: "chip"
                  }, c(R), 1))), 128))
                ])) : $("", !0)
              ])
            ], 2))), 128))
          ])
        ])
      ])) : $("", !0)
    ]));
  }
}), He = (e) => e.status === "completed" || e.status === "partial" || e.status === "failed", Ve = (e) => e.metrics.length ? e.metrics.reduce((s, l) => s + l.accuracy, 0) / e.metrics.length : 0;
function Ye(e, s = /* @__PURE__ */ new Date()) {
  const l = new Date(e);
  return l.toDateString() === s.toDateString() ? l.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" }) : l.getFullYear() === s.getFullYear() ? l.toLocaleString(void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : l.toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
}
const Ri = { class: "evals" }, Bi = { class: "block eval-run" }, Li = { class: "eval-run-main" }, Oi = { class: "block-title" }, Pi = {
  key: 0,
  class: "eval-note"
}, Ti = {
  key: 0,
  class: "eval-progress",
  role: "status"
}, Di = { class: "bar" }, Ii = { class: "muted" }, ji = { class: "stat-row" }, zi = { class: "stat" }, Wi = { class: "stat-label" }, Hi = { class: "stat-value" }, Gi = { class: "stat" }, Ki = { class: "stat-value" }, Qi = { class: "stat-delta flat" }, Ji = { class: "stat" }, Yi = { class: "stat-value" }, Xi = {
  key: 0,
  class: "stat-delta flat"
}, Zi = { class: "stat" }, _i = { class: "stat-value" }, eu = {
  key: 0,
  class: "stat-delta flat"
}, tu = { class: "block" }, lu = { class: "block-head" }, au = {
  key: 0,
  class: "compare-pick push"
}, nu = ["value"], su = ["value"], ou = {
  key: 0,
  class: "block-empty"
}, iu = {
  key: 1,
  class: "table-scroll"
}, uu = { key: 0 }, du = { key: 1 }, ru = { class: "mono" }, cu = { class: "acc strong" }, vu = { class: "bar" }, mu = { class: "muted" }, pu = {
  key: 0,
  class: "muted"
}, fu = { key: 1 }, bu = {
  key: 1,
  class: "muted"
}, hu = {
  key: 1,
  class: "block"
}, gu = { class: "table-scroll" }, yu = { class: "metric-table result-matrix" }, ku = ["aria-expanded", "onClick"], $u = {
  key: 0,
  class: "badge",
  "data-status": "partial"
}, xu = ["colspan"], wu = {
  key: 0,
  class: "cell-state"
}, Su = ["data-error-kind", "title"], Vu = ["data-label"], Cu = ["title"], Eu = {
  key: 0,
  class: "result-detail"
}, qu = ["colspan"], Fu = ["data-error-kind", "title"], Nu = { class: "mono" }, Uu = { class: "cmp" }, Mu = { class: "cmp" }, Au = { key: 0 }, Ru = { class: "muted case-meta" }, Bu = { class: "block" }, Lu = { class: "block-head" }, Ou = { class: "count" }, Pu = { class: "mono" }, Tu = ["onUpdate:modelValue"], Du = ["onUpdate:modelValue"], Iu = ["onUpdate:modelValue", "placeholder"], ju = ["onUpdate:modelValue", "type"], zu = {
  key: 0,
  class: "error",
  role: "alert"
}, Wu = { class: "row" }, Hu = {
  key: 1,
  class: "block-empty"
}, Gu = {
  key: 2,
  class: "block-empty"
}, Ku = {
  key: 3,
  class: "table-scroll"
}, Qu = { class: "metric-table case-table" }, Ju = { class: "case-value" }, Yu = {
  key: 1,
  class: "muted"
}, Xu = { class: "num" }, Zu = ["aria-label", "disabled", "onClick"], _u = {
  key: 2,
  class: "block"
}, ed = { class: "block-head" }, td = { class: "count" }, ld = { class: "eval-history" }, ad = ["aria-current", "onClick"], nd = ["data-status"], sd = { class: "muted" }, od = { class: "push" }, id = /* @__PURE__ */ W({
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
    const l = e, u = s, d = M(!1), m = M(""), y = M({}), r = M("");
    fe(() => l.addedCaseId, () => {
      d.value = !1, m.value = "", y.value = {};
    });
    function g(V, h) {
      return V.type === "number" ? Number(h) : V.type === "boolean" ? h === "true" : V.type === "list" || V.type === "object" ? JSON.parse(h) : h;
    }
    function S() {
      r.value = "";
      const V = {};
      try {
        for (const h of l.fields) {
          const x = String(y.value[G(h)] ?? "").trim();
          x && Ft(V, G(h), g(h, x));
        }
      } catch {
        r.value = 'Lists and objects need valid JSON, for example ["a","b"] or {"city":"Hamburg"}.';
        return;
      }
      u("add-case", { upload_id: m.value, expected: V });
    }
    const E = N(() => l.evaluations.find((V) => !He(V))), i = N(() => l.evaluations.filter(He)), n = N(() => l.evaluation), b = N(() => ({ done: (n.value?.results ?? []).filter((h) => h.status !== "queued").length, total: n.value?.case_count ?? 0 })), R = M();
    fe(() => n.value?.id, () => {
      R.value = void 0;
    });
    const w = N(() => {
      if (!n.value) return;
      if (R.value) return i.value.find((h) => h.id === R.value);
      const V = i.value.findIndex((h) => h.id === n.value.id);
      return V >= 0 ? i.value[V + 1] : i.value[0];
    }), F = N(() => (n.value?.metrics ?? []).map((V) => ({ ...V, before: w.value?.metrics.find((h) => h.field === V.field) }))), K = N(() => (n.value?.fields ?? []).map(G)), D = N(() => Oe(l.fields.map(G))), j = (V, h) => V.scores.find((x) => x.field === h), H = M(), P = (V) => `${Math.round(V * 100)}%`, O = (V) => {
      const h = Math.round(V * 100);
      return `${h > 0 ? "+" : h < 0 ? "−" : "±"}${Math.abs(h)} pts`;
    }, B = (V) => Math.round(V * 100) > 0 ? "up" : Math.round(V * 100) < 0 ? "down" : "flat", ue = (V) => V >= 6e4 ? `${Math.floor(V / 6e4)}m ${Math.round(V % 6e4 / 1e3)}s` : `${(V / 1e3).toFixed(1)}s`, ye = (V) => V == null || V === "" ? "—" : typeof V == "string" ? V : Array.isArray(V) && V.every((h) => typeof h != "object") ? V.join(", ") : JSON.stringify(V), te = (V) => V ? V.failed ? "fail" : V.score >= 0.999 ? "pass" : V.score > 0 ? "partial" : "fail" : "none", oe = (V) => (V.results ?? []).filter((h) => h.status === "completed").length, be = { queued: "Queued", running: "Running", completed: "Completed", partial: "Partial", failed: "Failed" };
    return (V, h) => (a(), o("div", Ri, [
      t("section", Bi, [
        t("div", Li, [
          t("div", null, [
            t("h2", Oi, "Evaluate revision " + c(e.revision), 1),
            h[6] || (h[6] = t("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            e.changed ? (a(), o("p", Pi, [
              f(p(A), { icon: "tabler:info-circle" }),
              h[5] || (h[5] = q("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : $("", !0)
          ]),
          f(p(de), {
            label: E.value ? "Evaluating…" : "Run all cases",
            loading: e.starting || !!E.value,
            disabled: !e.cases.length || !e.fields.length || !!E.value || e.starting,
            onClick: h[0] || (h[0] = (x) => u("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        n.value && !p(He)(n.value) ? (a(), o("div", Ti, [
          t("span", Di, [
            t("span", {
              style: qe({ width: P(b.value.total ? b.value.done / b.value.total : 0) })
            }, null, 4)
          ]),
          t("span", Ii, c(be[n.value.status]) + " · " + c(b.value.done) + " of " + c(b.value.total) + " cases", 1)
        ])) : $("", !0)
      ]),
      n.value && p(He)(n.value) ? (a(), o(U, { key: 0 }, [
        n.value.error ? (a(), o("p", {
          key: 0,
          class: Q(n.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          f(p(A), { icon: "tabler:alert-triangle" }),
          q(c(n.value.error), 1)
        ], 2)) : $("", !0),
        t("div", ji, [
          t("div", zi, [
            t("span", Wi, "Accuracy · revision " + c(n.value.config_revision), 1),
            t("span", Hi, c(P(p(Ve)(n.value))), 1),
            w.value ? (a(), o("span", {
              key: 0,
              class: Q(["stat-delta", B(p(Ve)(n.value) - p(Ve)(w.value))])
            }, c(O(p(Ve)(n.value) - p(Ve)(w.value))) + " vs revision " + c(w.value.config_revision), 3)) : $("", !0)
          ]),
          t("div", Gi, [
            h[7] || (h[7] = t("span", { class: "stat-label" }, "Cases", -1)),
            t("span", Ki, [
              q(c(oe(n.value)), 1),
              t("small", null, " / " + c(n.value.case_count), 1)
            ]),
            t("span", Qi, c((n.value.results ?? []).filter((x) => x.status === "partial").length) + " partial · " + c((n.value.results ?? []).filter((x) => x.status === "failed").length) + " failed", 1)
          ]),
          t("div", Ji, [
            h[8] || (h[8] = t("span", { class: "stat-label" }, "Tokens", -1)),
            t("span", Yi, c(n.value.tokens.toLocaleString()), 1),
            w.value ? (a(), o("span", Xi, c(w.value.tokens.toLocaleString()) + " before", 1)) : $("", !0)
          ]),
          t("div", Zi, [
            h[9] || (h[9] = t("span", { class: "stat-label" }, "Model time", -1)),
            t("span", _i, c(ue(n.value.duration_ms)), 1),
            w.value ? (a(), o("span", eu, c(ue(w.value.duration_ms)) + " before", 1)) : $("", !0)
          ])
        ]),
        t("section", tu, [
          t("header", lu, [
            h[11] || (h[11] = t("h2", { class: "block-title" }, "Field accuracy", -1)),
            i.value.length > 1 ? (a(), o("label", au, [
              h[10] || (h[10] = t("span", { class: "muted" }, "Compare with", -1)),
              t("select", {
                value: w.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: h[1] || (h[1] = (x) => R.value = x.target.value)
              }, [
                (a(!0), o(U, null, I(i.value.filter((x) => x.id !== n.value.id), (x) => (a(), o("option", {
                  key: x.id,
                  value: x.id
                }, "Revision " + c(x.config_revision) + " · " + c(p(Ye)(x.created_at)), 9, su))), 128))
              ], 40, nu)
            ])) : $("", !0)
          ]),
          F.value.length ? (a(), o("div", iu, [
            t("table", {
              class: Q(["metric-table accuracy-table", { comparing: !!w.value }])
            }, [
              t("thead", null, [
                t("tr", null, [
                  h[12] || (h[12] = t("th", null, "Field", -1)),
                  h[13] || (h[13] = t("th", null, "Accuracy", -1)),
                  h[14] || (h[14] = t("th", null, "Verified", -1)),
                  w.value ? (a(), o("th", uu, "Revision " + c(w.value.config_revision), 1)) : $("", !0),
                  w.value ? (a(), o("th", du, "Change")) : $("", !0)
                ])
              ]),
              t("tbody", null, [
                (a(!0), o(U, null, I(F.value, (x) => (a(), o("tr", {
                  key: x.field
                }, [
                  t("td", ru, c(x.field), 1),
                  t("td", null, [
                    t("span", cu, [
                      t("span", vu, [
                        t("span", {
                          style: qe({ width: P(x.accuracy) })
                        }, null, 4)
                      ]),
                      q(c(P(x.accuracy)), 1)
                    ])
                  ]),
                  t("td", mu, c(P(x.verified)), 1),
                  w.value ? (a(), o("td", pu, c(x.before ? P(x.before.accuracy) : "—"), 1)) : $("", !0),
                  w.value ? (a(), o("td", fu, [
                    x.before ? (a(), o("span", {
                      key: 0,
                      class: Q(["trend", B(x.accuracy - x.before.accuracy)])
                    }, [
                      f(p(A), {
                        icon: B(x.accuracy - x.before.accuracy) === "up" ? "tabler:trending-up" : B(x.accuracy - x.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      q(c(O(x.accuracy - x.before.accuracy)), 1)
                    ], 2)) : (a(), o("span", bu, "New field"))
                  ])) : $("", !0)
                ]))), 128))
              ])
            ], 2)
          ])) : (a(), o("p", ou, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : $("", !0),
      n.value?.results?.length ? (a(), o("section", hu, [
        h[19] || (h[19] = t("header", { class: "block-head" }, [
          t("h2", { class: "block-title" }, "Results by case"),
          t("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        t("div", gu, [
          t("table", yu, [
            t("thead", null, [
              t("tr", null, [
                h[15] || (h[15] = t("th", null, "Document", -1)),
                (a(!0), o(U, null, I(K.value, (x) => (a(), o("th", {
                  key: x,
                  class: "mono"
                }, c(x), 1))), 128))
              ])
            ]),
            t("tbody", null, [
              (a(!0), o(U, null, I(n.value.results, (x) => (a(), o(U, {
                key: x.case_id
              }, [
                t("tr", {
                  class: Q(["result-row", { active: H.value === x.case_id }])
                }, [
                  t("td", null, [
                    t("button", {
                      type: "button",
                      class: "case-toggle",
                      "aria-expanded": H.value === x.case_id,
                      onClick: (L) => H.value = H.value === x.case_id ? void 0 : x.case_id
                    }, [
                      f(p(A), {
                        icon: H.value === x.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      q(c(x.upload_name), 1)
                    ], 8, ku),
                    x.status === "partial" ? (a(), o("span", $u, "Partial")) : $("", !0)
                  ]),
                  x.status === "queued" || x.status === "failed" ? (a(), o("td", {
                    key: 0,
                    colspan: K.value.length,
                    class: "muted"
                  }, [
                    x.status === "queued" ? (a(), o("span", wu, [
                      f(p(A), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      h[16] || (h[16] = q("Waiting", -1))
                    ])) : (a(), o("span", {
                      key: 1,
                      class: "cell-state fail",
                      "data-error-kind": x.error?.kind,
                      title: x.error?.kind
                    }, [
                      f(p(A), { icon: "tabler:alert-triangle" }),
                      q(c(x.error?.message), 1)
                    ], 8, Su))
                  ], 8, xu)) : (a(!0), o(U, { key: 1 }, I(K.value, (L) => (a(), o("td", {
                    key: L,
                    "data-label": L
                  }, [
                    t("span", {
                      class: Q(["cell", te(j(x, L))]),
                      title: ye(j(x, L)?.value)
                    }, c(j(x, L)?.failed ? "Failed" : j(x, L) ? P(j(x, L).score) : "—"), 11, Cu)
                  ], 8, Vu))), 128))
                ], 2),
                H.value === x.case_id ? (a(), o("tr", Eu, [
                  t("td", {
                    colspan: K.value.length + 1
                  }, [
                    x.error ? (a(), o("p", {
                      key: 0,
                      class: "muted",
                      "data-error-kind": x.error.kind,
                      title: x.error.kind
                    }, c(x.error.message), 9, Fu)) : $("", !0),
                    f(Re, {
                      node: p(Oe)(x.scores.map((L) => L.field))
                    }, {
                      default: me(({ index: L }) => [
                        (a(!0), o(U, null, I([x.scores[L]], (T) => (a(), o("dl", {
                          key: T.field,
                          class: "compare"
                        }, [
                          t("dt", Nu, c(T.field.split(".").at(-1)), 1),
                          t("dd", null, [
                            t("span", {
                              class: Q(["cell", te(T)])
                            }, c(T.failed ? "Failed" : P(T.score)), 3),
                            t("div", Uu, [
                              h[17] || (h[17] = t("span", { class: "cmp-label" }, "Expected", -1)),
                              f(Be, {
                                value: T.expected
                              }, null, 8, ["value"])
                            ]),
                            t("div", Mu, [
                              h[18] || (h[18] = t("span", { class: "cmp-label" }, "Extracted", -1)),
                              T.failed ? (a(), J(Lt, {
                                key: 0,
                                error: T.error
                              }, null, 8, ["error"])) : (a(), J(Be, {
                                key: 1,
                                value: T.value
                              }, null, 8, ["value"]))
                            ]),
                            T.failed ? $("", !0) : (a(), o("span", Au, [
                              t("span", {
                                class: Q(["chip", T.verified ? "primary" : "warn"])
                              }, [
                                f(p(A), {
                                  icon: T.verified ? "tabler:shield-check" : "tabler:shield-question"
                                }, null, 8, ["icon"]),
                                q(c(T.verified ? "Verified" : "Unverified"), 1)
                              ], 2)
                            ]))
                          ])
                        ]))), 128))
                      ]),
                      _: 2
                    }, 1032, ["node"]),
                    t("p", Ru, c(x.tokens.toLocaleString()) + " tokens · " + c(ue(x.duration_ms)), 1)
                  ], 8, qu)
                ])) : $("", !0)
              ], 64))), 128))
            ])
          ])
        ])
      ])) : $("", !0),
      t("section", Bu, [
        t("header", Lu, [
          h[20] || (h[20] = t("h2", { class: "block-title" }, "Cases", -1)),
          t("span", Ou, c(e.cases.length), 1),
          f(p(de), {
            label: "Add case",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: !e.fields.length,
            onClick: h[2] || (h[2] = (x) => d.value = !d.value)
          }, null, 8, ["disabled"])
        ]),
        d.value ? (a(), o("form", {
          key: 0,
          class: "case-form",
          onSubmit: ve(S, ["prevent"])
        }, [
          t("label", null, [
            h[21] || (h[21] = q("Document", -1)),
            f(Bt, {
              value: m.value,
              onSelect: h[3] || (h[3] = (x) => {
                m.value = x;
              })
            }, null, 8, ["value"])
          ]),
          h[24] || (h[24] = t("p", { class: "muted" }, "Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.", -1)),
          f(Re, { node: D.value }, {
            default: me(({ index: x }) => [
              (a(!0), o(U, null, I([e.fields[x]], (L) => (a(), o("label", {
                key: p(G)(L)
              }, [
                t("span", Pu, c(L.name), 1),
                L.type === "boolean" ? z((a(), o("select", {
                  key: 0,
                  "onUpdate:modelValue": (T) => y.value[p(G)(L)] = T
                }, [...h[22] || (h[22] = [
                  t("option", { value: "" }, "Not stated", -1),
                  t("option", { value: "true" }, "Yes", -1),
                  t("option", { value: "false" }, "No", -1)
                ])], 8, Tu)), [
                  [Ge, y.value[p(G)(L)]]
                ]) : L.type === "enum" ? z((a(), o("select", {
                  key: 1,
                  "onUpdate:modelValue": (T) => y.value[p(G)(L)] = T
                }, [
                  h[23] || (h[23] = t("option", { value: "" }, "Not stated", -1)),
                  (a(!0), o(U, null, I(L.enum_values, (T) => (a(), o("option", { key: T }, c(T), 1))), 128))
                ], 8, Du)), [
                  [Ge, y.value[p(G)(L)]]
                ]) : L.type === "object" || L.type === "list" ? z((a(), o("textarea", {
                  key: 2,
                  "onUpdate:modelValue": (T) => y.value[p(G)(L)] = T,
                  rows: "2",
                  placeholder: L.type === "list" ? '["first", "second"]' : '{"key": "value"}'
                }, null, 8, Iu)), [
                  [_, y.value[p(G)(L)]]
                ]) : z((a(), o("input", {
                  key: 3,
                  "onUpdate:modelValue": (T) => y.value[p(G)(L)] = T,
                  type: L.type === "number" ? "number" : L.type === "date" ? "date" : "text",
                  placeholder: "Not stated"
                }, null, 8, ju)), [
                  [dl, y.value[p(G)(L)]]
                ])
              ]))), 128))
            ]),
            _: 1
          }, 8, ["node"]),
          r.value ? (a(), o("p", zu, c(r.value), 1)) : $("", !0),
          t("div", Wu, [
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
              onClick: h[4] || (h[4] = (x) => d.value = !1)
            })
          ])
        ], 32)) : $("", !0),
        e.fields.length ? !e.cases.length && !d.value ? (a(), o("p", Gu, "No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.")) : e.cases.length ? (a(), o("div", Ku, [
          t("table", Qu, [
            h[25] || (h[25] = t("thead", null, [
              t("tr", null, [
                t("th", null, "Document"),
                t("th", null, "Expected values"),
                t("th")
              ])
            ], -1)),
            t("tbody", null, [
              (a(!0), o(U, null, I(e.cases, (x) => (a(), o("tr", {
                key: x.id
              }, [
                t("td", null, [
                  f(p(A), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  q(" " + c(x.upload_name), 1)
                ]),
                t("td", null, [
                  f(Re, { node: D.value }, {
                    default: me(({ index: L }) => [
                      t("div", Ju, [
                        t("strong", null, c(e.fields[L].name), 1),
                        p(kt)(x.expected, p(G)(e.fields[L])) !== void 0 ? (a(), J(Be, {
                          key: 0,
                          value: p(kt)(x.expected, p(G)(e.fields[L]))
                        }, null, 8, ["value"])) : (a(), o("span", Yu, "Not stated"))
                      ])
                    ]),
                    _: 2
                  }, 1032, ["node"])
                ]),
                t("td", Xu, [
                  t("button", {
                    type: "button",
                    class: "kx-iconbtn kx-focus-outline",
                    "aria-label": `Remove case ${x.upload_name}`,
                    disabled: e.saving,
                    onClick: (L) => u("delete-case", x.id)
                  }, [
                    f(p(A), { icon: "tabler:trash" })
                  ], 8, Zu)
                ])
              ]))), 128))
            ])
          ])
        ])) : $("", !0) : (a(), o("p", Hu, "Add a field in the Builder, then add documents with the values you expect."))
      ]),
      e.evaluations.length ? (a(), o("section", _u, [
        t("header", ed, [
          h[26] || (h[26] = t("h2", { class: "block-title" }, "History", -1)),
          t("span", td, c(e.evaluations.length), 1)
        ]),
        t("ul", ld, [
          (a(!0), o(U, null, I(e.evaluations, (x) => (a(), o("li", {
            key: x.id
          }, [
            t("button", {
              type: "button",
              class: Q({ active: n.value?.id === x.id }),
              "aria-current": n.value?.id === x.id,
              onClick: (L) => u("open", x.id)
            }, [
              t("span", {
                class: "badge",
                "data-status": x.status
              }, c(be[x.status]), 9, nd),
              t("span", null, "Revision " + c(x.config_revision), 1),
              t("span", sd, c(p(Ye)(x.created_at)), 1),
              t("strong", od, c(x.status === "completed" || x.status === "partial" ? P(p(Ve)(x)) : "—"), 1)
            ], 10, ad)
          ]))), 128))
        ])
      ])) : $("", !0)
    ]));
  }
}), ud = { class: "section-head" }, dd = { class: "muted" }, rd = {
  key: 0,
  class: "empty"
}, cd = {
  key: 1,
  class: "table-scroll"
}, vd = { class: "metric-table runs-table" }, md = ["aria-label", "aria-expanded", "onClick"], pd = { class: "caller" }, fd = {
  key: 0,
  class: "muted"
}, bd = ["data-status"], hd = {
  class: "num",
  "data-label": "Time"
}, gd = {
  class: "num",
  "data-label": "Tokens"
}, yd = {
  class: "muted",
  "data-label": "Expires"
}, kd = {
  key: 0,
  class: "result-detail"
}, $d = { colspan: "6" }, xd = /* @__PURE__ */ W({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(e) {
    const s = M(), l = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (u, d) => (a(), o(U, null, [
      t("div", ud, [
        d[0] || (d[0] = t("h2", null, "Recent runs", -1)),
        t("span", dd, "Runs expire after " + c(e.retention), 1)
      ]),
      e.runs.length ? (a(), o("div", cd, [
        t("table", vd, [
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
            (a(!0), o(U, null, I(e.runs, (m) => (a(), o(U, {
              key: m.id
            }, [
              t("tr", null, [
                t("td", null, [
                  t("button", {
                    type: "button",
                    class: "case-toggle",
                    "aria-label": `Show values for run ${m.id}`,
                    "aria-expanded": s.value === m.id,
                    onClick: (y) => s.value = s.value === m.id ? void 0 : m.id
                  }, [
                    f(p(A), {
                      icon: s.value === m.id ? "tabler:chevron-down" : "tabler:chevron-right"
                    }, null, 8, ["icon"]),
                    q(c(p(Ye)(m.created_at)), 1)
                  ], 8, md)
                ]),
                t("td", null, [
                  t("span", pd, [
                    f(p(A), {
                      icon: l[m.caller].icon
                    }, null, 8, ["icon"]),
                    q(c(l[m.caller].label), 1)
                  ]),
                  m.result.page_range ? (a(), o("span", fd, " · Pages " + c(m.result.page_range.first) + "–" + c(m.result.page_range.last), 1)) : $("", !0)
                ]),
                t("td", null, [
                  t("span", {
                    class: "badge",
                    "data-status": m.status
                  }, c(m.status === "completed" ? "Completed" : m.status === "partial" ? "Partial" : "Failed"), 9, bd)
                ]),
                t("td", hd, c((m.duration_ms / 1e3).toFixed(1)) + "s", 1),
                t("td", gd, c(Number(m.tokens).toLocaleString()), 1),
                t("td", yd, c(p(Ye)(m.expires_at)), 1)
              ]),
              s.value === m.id ? (a(), o("tr", kd, [
                t("td", $d, [
                  f(Ot, {
                    fields: m.result.fields
                  }, null, 8, ["fields"])
                ])
              ])) : $("", !0)
            ], 64))), 128))
          ])
        ])
      ])) : (a(), o("p", rd, "No runs yet. Runs from the Test tab, agents, evaluations and Workflows appear here."))
    ], 64));
  }
}), wd = {
  key: 0,
  role: "alert",
  class: "error banner"
}, Sd = /* @__PURE__ */ W({
  __name: "SharePopup",
  props: {
    id: {},
    title: {}
  },
  emits: ["close"],
  setup(e, { emit: s }) {
    const l = e, u = s, d = M(), m = M("");
    return Fe(async () => {
      try {
        await Ze("kickside-share", { timeoutMs: 8e3 });
      } catch (g) {
        m.value = `Sharing is unavailable: ${g instanceof Error ? g.message : String(g)}`;
        return;
      }
      const y = document.createElement("kickside-share"), r = encodeURIComponent(l.id);
      y.setAttribute("config", JSON.stringify({ resource_id: l.id, title: l.title, access_url: `/api/v1/component-access/grants/${r}`, share_url: `/api/v1/component-access/share/${r}` })), y.style.display = "block", y.addEventListener("close", () => u("close")), d.value?.appendChild(y);
    }), (y, r) => (a(), o("div", {
      ref_key: "host",
      ref: d
    }, [
      m.value ? (a(), o("p", wd, c(m.value), 1)) : $("", !0)
    ], 512));
  }
}), Vd = { class: "docscout" }, Cd = { class: "toolbar" }, Ed = { class: "toolbar-lead" }, qd = { class: "crumb-row" }, Fd = { class: "crumb" }, Nd = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, Ud = ["id", "aria-selected", "aria-controls", "onClick"], Md = { class: "toolbar-side" }, Ad = { class: "stats" }, Rd = ["title"], Bd = {
  key: 2,
  class: "unsaved"
}, Ld = {
  key: 0,
  class: "banner row wrap",
  role: "status"
}, Od = {
  key: 1,
  role: "alert",
  class: "error banner"
}, Pd = {
  key: 3,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, Td = ["id", "aria-labelledby"], Dd = /* @__PURE__ */ W({
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
    const l = e, u = s, d = M(), m = M(!1), y = M("Builder"), r = M($t()), g = M(""), S = M(""), E = N(() => l.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    fe(y, () => {
      d.value && (d.value.scrollTop = 0);
    }, { flush: "post" });
    const i = M(), n = M(), b = N(() => l.snapshot.can_edit && i.value !== l.snapshot.expected_revision), R = N(() => b.value && n.value !== l.snapshot.expected_revision);
    function w(P) {
      return g.value === P.title && S.value === (P.description ?? "") && Fl(r.value, P.config);
    }
    function F() {
      const P = l.snapshot;
      r.value = structuredClone(ht(P.config ?? $t())), g.value = P.title, S.value = P.description ?? "", i.value = P.expected_revision, n.value = void 0;
    }
    fe(() => l.snapshot, (P, O) => {
      E.value.includes(y.value) || (y.value = E.value[0]), !(O && P.id === O.id && P.can_edit && O.can_edit && !w(O) && !w(P)) && F();
    }, { immediate: !0 });
    const K = N(() => l.snapshot.can_edit && !w(l.snapshot)), D = N(() => ql(r.value)), j = N(() => Object.keys(ke).filter((P) => Qe(r.value, P)).length);
    function H() {
      u("save", { title: g.value, description: S.value, config: structuredClone(ht(r.value)), expected_revision: i.value });
    }
    return (P, O) => (a(), o("main", Vd, [
      t("div", Cd, [
        t("div", Ed, [
          t("span", qd, [
            e.back ? (a(), o("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: O[0] || (O[0] = (B) => u("back"))
            }, [
              f(p(A), { icon: "tabler:arrow-left" })
            ])) : $("", !0),
            t("span", Fd, c(e.snapshot.title), 1)
          ]),
          t("nav", Nd, [
            (a(!0), o(U, null, I(E.value, (B) => (a(), o("button", {
              id: `tab-${B}`,
              key: B,
              role: "tab",
              "aria-selected": y.value === B,
              "aria-controls": `panel-${B}`,
              onClick: (ue) => y.value = B
            }, c(B), 9, Ud))), 128))
          ])
        ]),
        t("div", Md, [
          e.snapshot.can_share ? (a(), J(p(de), {
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
          })) : $("", !0),
          t("span", Ad, [
            q(c(e.snapshot.field_count) + " " + c(e.snapshot.field_count === 1 ? "field" : "fields"), 1),
            e.snapshot.can_edit ? (a(), o(U, { key: 0 }, [
              q(" · " + c(j.value) + " steps · revision " + c(e.snapshot.expected_revision), 1)
            ], 64)) : (a(), o(U, { key: 1 }, [
              q(" · Read access")
            ], 64))
          ]),
          e.snapshot.can_edit ? (a(), o(U, { key: 1 }, [
            b.value && !R.value ? (a(), J(p(de), {
              key: 0,
              label: "Reload saved",
              severity: "secondary",
              size: "small",
              onClick: F
            })) : $("", !0),
            D.value ? (a(), o("span", {
              key: 1,
              class: "invalid",
              role: "alert",
              title: D.value
            }, [
              f(p(A), { icon: "tabler:alert-circle" }),
              q(c(D.value), 1)
            ], 8, Rd)) : K.value ? (a(), o("span", Bd, "Unsaved")) : $("", !0),
            f(p(de), {
              label: "Save",
              size: "small",
              loading: e.saving,
              disabled: !K.value || !!D.value || !g.value.trim(),
              onClick: H
            }, null, 8, ["loading", "disabled"])
          ], 64)) : $("", !0)
        ])
      ]),
      R.value ? (a(), o("div", Ld, [
        t("span", null, "Saved configuration changed to revision " + c(e.snapshot.expected_revision) + ". Your edits are kept.", 1),
        f(p(de), {
          label: "Reload saved",
          severity: "secondary",
          size: "small",
          onClick: F
        }),
        f(p(de), {
          label: "Keep editing",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: O[2] || (O[2] = (B) => n.value = e.snapshot.expected_revision)
        })
      ])) : $("", !0),
      e.error ? (a(), o("p", Od, c(e.error), 1)) : $("", !0),
      m.value ? (a(), J(Sd, {
        key: 2,
        id: e.snapshot.id,
        title: e.snapshot.title,
        onClose: O[3] || (O[3] = (B) => m.value = !1)
      }, null, 8, ["id", "title"])) : $("", !0),
      y.value === "Builder" && e.snapshot.can_edit ? (a(), o("div", Pd, [
        f(Ko, {
          title: g.value,
          "onUpdate:title": O[4] || (O[4] = (B) => g.value = B),
          description: S.value,
          "onUpdate:description": O[5] || (O[5] = (B) => S.value = B),
          config: r.value,
          retention: e.snapshot.retention,
          result: e.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (a(), o("div", {
        key: 4,
        ref_key: "body",
        ref: d,
        class: "page-body"
      }, [
        t("div", {
          id: `panel-${y.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${y.value}`,
          class: "panel"
        }, [
          y.value === "Test" ? (a(), J(Ai, {
            key: 0,
            result: e.result,
            retention: e.snapshot.retention,
            running: e.running,
            "can-run": e.snapshot.field_count > 0,
            onRun: O[6] || (O[6] = (B) => u("run", B))
          }, null, 8, ["result", "retention", "running", "can-run"])) : $("", !0),
          y.value === "Evals" && e.snapshot.can_edit ? (a(), J(id, {
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
            onAddCase: O[7] || (O[7] = (B) => u("add-case", B)),
            onDeleteCase: O[8] || (O[8] = (B) => u("delete-case", B)),
            onEvaluate: O[9] || (O[9] = (B) => u("evaluate")),
            onOpen: O[10] || (O[10] = (B) => u("open-evaluation", B))
          }, null, 8, ["cases", "added-case-id", "fields", "evaluations", "evaluation", "revision", "changed", "saving", "starting"])) : $("", !0),
          y.value === "Runs" ? (a(), J(xd, {
            key: 2,
            runs: e.snapshot.runs,
            retention: e.snapshot.retention
          }, null, 8, ["runs", "retention"])) : $("", !0)
        ], 8, Td)
      ], 512))
    ]));
  }
}), Id = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, jd = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, Kd = /* @__PURE__ */ W({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(e, { emit: s }) {
    const l = e, u = s, d = M(), m = M(""), y = M(!1), r = M(!1), g = M(!1), S = M(), E = M(null), i = M([]), n = M();
    let b = [], R = 0, w = 0, F = 0, K;
    const D = (V) => V instanceof Error ? V.message : String(V), j = (V) => V === R;
    async function H(V, h) {
      const x = ++F;
      h && (K = h);
      const L = () => j(V) && x === F;
      try {
        const T = l.id, Ne = await ge.evaluations(T);
        if (!L()) return;
        i.value = Ne;
        const he = K ?? Ne[0]?.id;
        if (he) {
          const Te = await ge.evaluation(T, he);
          if (!L() || Te.id !== (K ?? he)) return;
          n.value = Te;
        }
      } catch (T) {
        L() && (m.value = D(T));
      }
    }
    async function P(V) {
      const h = ++w, x = () => j(V) && h === w;
      if (!l.id) {
        m.value = "No extractor selected.";
        return;
      }
      try {
        const L = await ge.get(l.id);
        if (!x()) return;
        d.value = L, m.value = "", L.can_edit && await H(V);
      } catch (L) {
        x() && (m.value = D(L));
      }
    }
    fe(() => l.id, (V, h) => {
      R++, K = void 0, b.forEach((L) => L()), b = [], S.value = void 0, d.value = void 0, E.value = null, i.value = [], n.value = void 0, m.value = "";
      const x = R;
      l.id && (b = [xt(`component.${l.id}`, () => P(x)), xt(`docscout.runs.${l.id}`, () => P(x))]), h !== void 0 && P(x);
    }, { immediate: !0 }), Nl(() => P(R)), Ct(() => {
      R++, b.forEach((V) => V());
    });
    async function O(V) {
      const h = R;
      y.value = !0, m.value = "";
      try {
        const x = await V();
        if (j(h))
          return await P(h), x;
      } catch (x) {
        j(h) && (m.value = D(x));
      } finally {
        y.value = !1;
      }
    }
    const B = (V) => O(() => ge.update(l.id, V));
    async function ue(V) {
      const h = R, x = await O(() => ge.addCase(l.id, V));
      x && j(h) && (S.value = x.id);
    }
    const ye = (V) => O(() => ge.deleteCase(l.id, V));
    async function te(V) {
      const h = R;
      r.value = !0, m.value = "";
      try {
        const x = await ge.run(l.id, V);
        j(h) && (E.value = x, await P(h));
      } catch (x) {
        j(h) && (m.value = D(x));
      } finally {
        r.value = !1;
      }
    }
    async function oe() {
      const V = R;
      g.value = !0, m.value = "";
      try {
        const { eval_id: h } = await ge.evaluate(l.id);
        j(V) && await H(V, h);
      } catch (h) {
        j(V) && (m.value = D(h));
      } finally {
        g.value = !1;
      }
    }
    function be(V) {
      H(R, V);
    }
    return (V, h) => d.value ? (a(), J(Dd, {
      key: 0,
      snapshot: d.value,
      "added-case-id": S.value,
      saving: y.value,
      running: r.value,
      starting: g.value,
      result: E.value,
      evaluations: i.value,
      evaluation: n.value,
      error: m.value,
      back: e.back,
      onBack: h[0] || (h[0] = (x) => u("back")),
      onRun: te,
      onSave: B,
      onAddCase: ue,
      onDeleteCase: ye,
      onEvaluate: oe,
      onOpenEvaluation: be
    }, null, 8, ["snapshot", "added-case-id", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : m.value ? (a(), o("p", Id, c(m.value), 1)) : (a(), o("p", jd, "Loading Docscout…"));
  }
});
export {
  Kd as _,
  Ye as w
};
