import { defineComponent as W, useModel as Te, openBlock as n, createElementBlock as o, withModifiers as ve, createElementVNode as t, mergeModels as Ze, computed as q, withKeys as qe, unref as p, normalizeClass as Q, createVNode as f, toDisplayString as c, Fragment as N, renderList as D, createCommentVNode as $, createTextVNode as E, createBlock as Y, ref as U, useId as $e, watch as pe, withDirectives as z, vModelText as Z, vModelSelect as Ge, resolveComponent as ot, renderSlot as ze, withCtx as me, mergeProps as mt, vShow as Qe, nextTick as Ee, onMounted as De, normalizeStyle as Fe, onBeforeUnmount as wt, vModelDynamic as sl, toRaw as pt } from "vue";
import { B as ol, L as il, j as We, v as Ae, k as ul, U as dl, I as ft, f as rl, i as Je, l as St, t as nt, h as ge, o as it, p as cl, m as Vt, q as K, M as Re, r as Ct, w as Et, x as qt, y as vl, z as ml, A as pl, C as fl, D as bl, E as Ft, F as hl, G as Nt, H as yl, J as gl, K as kl, N as bt, O as $l, P as lt, Q as xl, R as Pe, S as wl, s as de, T as ht, n as yt, V as Sl, W as Vl, b as Cl, c as he } from "./index-BSNmzu7_.js";
import { loadByTagName as _e, on as gt } from "@wippy-fe/proxy";
import { Icon as M } from "@iconify/vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
var El = ol.extend({
  name: "focustrap-directive"
}), ql = ul.extend({
  style: El
});
function Le(e) {
  "@babel/helpers - typeof";
  return Le = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(s) {
    return typeof s;
  } : function(s) {
    return s && typeof Symbol == "function" && s.constructor === Symbol && s !== Symbol.prototype ? "symbol" : typeof s;
  }, Le(e);
}
function kt(e, s) {
  var l = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    s && (u = u.filter(function(d) {
      return Object.getOwnPropertyDescriptor(e, d).enumerable;
    })), l.push.apply(l, u);
  }
  return l;
}
function $t(e) {
  for (var s = 1; s < arguments.length; s++) {
    var l = arguments[s] != null ? arguments[s] : {};
    s % 2 ? kt(Object(l), !0).forEach(function(u) {
      Fl(e, u, l[u]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(l)) : kt(Object(l)).forEach(function(u) {
      Object.defineProperty(e, u, Object.getOwnPropertyDescriptor(l, u));
    });
  }
  return e;
}
function Fl(e, s, l) {
  return (s = Nl(s)) in e ? Object.defineProperty(e, s, { value: l, enumerable: !0, configurable: !0, writable: !0 }) : e[s] = l, e;
}
function Nl(e) {
  var s = Ul(e, "string");
  return Le(s) == "symbol" ? s : s + "";
}
function Ul(e, s) {
  if (Le(e) != "object" || !e) return e;
  var l = e[Symbol.toPrimitive];
  if (l !== void 0) {
    var u = l.call(e, s);
    if (Le(u) != "object") return u;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (s === "string" ? String : Number)(e);
}
var Ml = ql.extend("focustrap", {
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
      var u = this, d = l.value || {}, m = d.onFocusIn, b = d.onFocusOut;
      s.$_pfocustrap_mutationobserver = new MutationObserver(function(r) {
        r.forEach(function(g) {
          if (g.type === "childList" && !s.contains(document.activeElement)) {
            var V = function(a) {
              var i = ft(a) ? ft(a, u.getComputedSelector(s.$_pfocustrap_focusableselector)) ? a : Ae(s, u.getComputedSelector(s.$_pfocustrap_focusableselector)) : Ae(a);
              return rl(i) ? i : a.nextSibling && V(a.nextSibling);
            };
            We(V(g.nextSibling));
          }
        });
      }), s.$_pfocustrap_mutationobserver.disconnect(), s.$_pfocustrap_mutationobserver.observe(s, {
        childList: !0
      }), s.$_pfocustrap_focusinlistener = function(r) {
        return m && m(r);
      }, s.$_pfocustrap_focusoutlistener = function(r) {
        return b && b(r);
      }, s.addEventListener("focusin", s.$_pfocustrap_focusinlistener), s.addEventListener("focusout", s.$_pfocustrap_focusoutlistener);
    },
    unbind: function(s) {
      s.$_pfocustrap_mutationobserver && s.$_pfocustrap_mutationobserver.disconnect(), s.$_pfocustrap_focusinlistener && s.removeEventListener("focusin", s.$_pfocustrap_focusinlistener) && (s.$_pfocustrap_focusinlistener = null), s.$_pfocustrap_focusoutlistener && s.removeEventListener("focusout", s.$_pfocustrap_focusoutlistener) && (s.$_pfocustrap_focusoutlistener = null);
    },
    autoFocus: function(s) {
      this.autoElementFocus(this.$el, {
        value: $t($t({}, s), {}, {
          autoFocus: !0
        })
      });
    },
    autoElementFocus: function(s, l) {
      var u = l.value || {}, d = u.autoFocusSelector, m = d === void 0 ? "" : d, b = u.firstFocusableSelector, r = b === void 0 ? "" : b, g = u.autoFocus, V = g === void 0 ? !1 : g, h = Ae(s, "[autofocus]".concat(this.getComputedSelector(m)));
      V && !h && (h = Ae(s, this.getComputedSelector(r))), We(h);
    },
    onFirstHiddenElementFocus: function(s) {
      var l, u = s.currentTarget, d = s.relatedTarget, m = d === u.$_pfocustrap_lasthiddenfocusableelement || !((l = this.$el) !== null && l !== void 0 && l.contains(d)) ? Ae(u.parentElement, this.getComputedSelector(u.$_pfocustrap_focusableselector)) : u.$_pfocustrap_lasthiddenfocusableelement;
      We(m);
    },
    onLastHiddenElementFocus: function(s) {
      var l, u = s.currentTarget, d = s.relatedTarget, m = d === u.$_pfocustrap_firsthiddenfocusableelement || !((l = this.$el) !== null && l !== void 0 && l.contains(d)) ? il(u.parentElement, this.getComputedSelector(u.$_pfocustrap_focusableselector)) : u.$_pfocustrap_firsthiddenfocusableelement;
      We(m);
    },
    createHiddenFocusableElements: function(s, l) {
      var u = this, d = l.value || {}, m = d.tabIndex, b = m === void 0 ? 0 : m, r = d.firstFocusableSelector, g = r === void 0 ? "" : r, V = d.lastFocusableSelector, h = V === void 0 ? "" : V, a = function(C) {
        return dl("span", {
          class: "p-hidden-accessible p-hidden-focusable",
          tabIndex: b,
          role: "presentation",
          "aria-hidden": !0,
          "data-p-hidden-accessible": !0,
          "data-p-hidden-focusable": !0,
          onFocus: C?.bind(u)
        });
      }, i = a(this.onFirstHiddenElementFocus), B = a(this.onLastHiddenElementFocus);
      i.$_pfocustrap_lasthiddenfocusableelement = B, i.$_pfocustrap_focusableselector = g, i.setAttribute("data-pc-section", "firstfocusableelement"), B.$_pfocustrap_firsthiddenfocusableelement = i, B.$_pfocustrap_focusableselector = h, B.setAttribute("data-pc-section", "lastfocusableelement"), s.prepend(i), s.append(B);
    }
  }
});
const Al = ["aria-checked", "aria-label", "disabled"], ee = /* @__PURE__ */ W({
  __name: "Toggle",
  props: /* @__PURE__ */ Ze({
    label: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { type: Boolean, required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const s = Te(e, "modelValue");
    return (l, u) => (n(), o("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": s.value,
      "aria-label": e.label,
      disabled: e.disabled,
      onClick: u[0] || (u[0] = ve((d) => s.value = !s.value, ["stop"]))
    }, [...u[1] || (u[1] = [
      t("span", null, null, -1)
    ])], 8, Al));
  }
}), Rl = ["aria-label"], Bl = { class: "node-icon" }, Ol = { class: "node-main" }, Tl = { class: "node-title" }, Pl = { class: "node-summary" }, Ll = {
  key: 0,
  class: "chips"
}, Dl = {
  key: 1,
  class: "trace-line"
}, Il = { class: "node-side" }, jl = {
  key: 0,
  class: "chip model"
}, Se = /* @__PURE__ */ W({
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
    const l = e, u = s, d = q(() => Je(l.config, l.stage)), m = q(() => l.config.stages[l.stage].model), b = q({ get: () => d.value, set: (V) => {
      l.config.stages[l.stage].enabled = V;
    } }), r = q(() => {
      const V = l.config, h = V.stages;
      switch (l.stage) {
        case "map":
          return V.fields.filter((a) => a.search_within === "sections").map((a) => ({ text: a.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...h.prefetch.queries.map((a) => ({ text: a.name || "Untitled query", tone: "" })), ...V.fields.filter((a) => a.search_hints.trim()).map((a) => ({ text: a.name, tone: "hint" }))];
        case "scout":
          return h.scout.mode === "agent" ? h.scout.tools.map((a) => ({ text: nt(a).toLowerCase(), tone: "" })) : [];
        case "deep":
          return V.fields.filter((a) => a.strategy === "deep").map((a) => ({ text: a.name || "New field", tone: "primary" }));
        case "extract":
          return St(V).map((a) => ({ text: `${a.name} · ${a.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), g = (V) => [`${(V.duration_ms / 1e3).toFixed(1)}s`, `${(V.input_tokens + V.output_tokens).toLocaleString()} tokens`, V.queries?.length ? `${V.queries.length} queries` : "", V.message ?? ""].filter(Boolean).join(" · ");
    return (V, h) => (n(), o("div", {
      class: Q(["node kx-focus-halo", { active: e.active, off: !d.value, fixed: e.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": p(ge)[e.stage],
      onClick: h[1] || (h[1] = (a) => u("select")),
      onKeydown: [
        h[2] || (h[2] = qe((a) => u("select"), ["enter"])),
        h[3] || (h[3] = qe(ve((a) => u("select"), ["prevent"]), ["space"]))
      ]
    }, [
      t("span", Bl, [
        f(p(M), {
          icon: p(it)[e.stage]
        }, null, 8, ["icon"])
      ]),
      t("span", Ol, [
        t("span", Tl, c(p(ge)[e.stage]), 1),
        t("span", Pl, c(d.value ? p(cl)(e.stage, e.config) : "Off"), 1),
        d.value && r.value.length ? (n(), o("span", Ll, [
          (n(!0), o(N, null, D(r.value, (a) => (n(), o("span", {
            key: a.text,
            class: Q(["chip", { primary: a.tone === "primary", "muted-chip": a.tone === "hint" }])
          }, c(a.text), 3))), 128))
        ])) : $("", !0),
        e.trace ? (n(), o("span", Dl, [
          f(p(M), {
            icon: e.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          E(c(g(e.trace)), 1)
        ])) : $("", !0)
      ]),
      t("span", Il, [
        d.value && m.value ? (n(), o("span", jl, c(p(Vt)(m.value)), 1)) : $("", !0),
        e.stage !== "extract" && !e.readonly ? (n(), Y(ee, {
          key: 1,
          modelValue: b.value,
          "onUpdate:modelValue": h[0] || (h[0] = (a) => b.value = a),
          label: `Enable ${p(ge)[e.stage]}`
        }, null, 8, ["modelValue", "label"])) : $("", !0)
      ])
    ], 42, Rl));
  }
}), zl = ["aria-labelledby"], Wl = ["aria-label", "aria-checked", "tabindex", "disabled", "onClick", "onKeydown"], ke = /* @__PURE__ */ W({
  __name: "Segmented",
  props: /* @__PURE__ */ Ze({
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
    const s = e, l = Te(e, "modelValue"), u = U([]);
    function d(m, b) {
      const r = s.options.length - 1, g = { ArrowRight: b + 1, ArrowDown: b + 1, ArrowLeft: b - 1, ArrowUp: b - 1, Home: 0, End: r }[m.key];
      if (g === void 0) return;
      m.preventDefault();
      const V = (g + s.options.length) % s.options.length;
      l.value = s.options[V].value, u.value[V]?.focus();
    }
    return (m, b) => (n(), o("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": e.labelledBy
    }, [
      (n(!0), o(N, null, D(e.options, (r, g) => (n(), o("button", {
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
        onClick: (V) => l.value = r.value,
        onKeydown: (V) => d(V, g)
      }, [
        r.icon ? (n(), Y(p(M), {
          key: 0,
          icon: r.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : $("", !0),
        t("span", null, c(r.label), 1)
      ], 40, Wl))), 128))
    ], 8, zl));
  }
}), ie = (e, s) => `${e}:${s.join("/")}`, Ut = [
  { value: "text", label: "Text", icon: "tabler:typography" },
  { value: "number", label: "Number", icon: "tabler:123" },
  { value: "boolean", label: "Yes / no", icon: "tabler:toggle-right" },
  { value: "date", label: "Date", icon: "tabler:calendar" },
  { value: "enum", label: "One of a set", icon: "tabler:list-details" },
  { value: "list", label: "List", icon: "tabler:brackets" },
  { value: "object", label: "Object", icon: "tabler:braces" }
], Hl = (e) => Ut.find((s) => s.value === e).icon;
function Ye(e) {
  const s = [];
  function l(u, d, m, b) {
    s.push({ field: d, trail: m, shape: u, path: b, depth: m.length + 1, key: ie(d, m) }), u.properties?.forEach((r, g) => l(r, d, [...m, g], `${b}.${r.name || "New property"}`)), u.item && l(u.item, d, [...m, "item"], `${b}[]`);
  }
  return e.forEach((u, d) => l(u, d, [], K(u) || "New field")), s;
}
function st(e) {
  return 1 + Math.max(0, ...(e.properties ?? []).map(st), e.item ? st(e.item) : 0);
}
function Kl(e, s) {
  return Ye(e).filter((l) => l.shape.type === "object" && ((l.shape.properties?.length ?? 0) < 100 || l.field === s.field && ie(l.field, l.trail) === ie(s.field, s.trail.slice(0, -1))) && l.depth + st(s.shape) <= Re && !(l.field === s.field && s.trail.every((u, d) => l.trail[d] === u)));
}
function Gl(e, s, l) {
  const u = { ...Et(), ...s.shape, name: s.shape.name };
  s.trail.length ? Ye(e).find((b) => b.key === ie(s.field, s.trail.slice(0, -1))).shape.properties.splice(s.trail.at(-1), 1) : e.splice(s.field, 1);
  let d;
  if (l) {
    const { name: m, type: b, description: r, enum_values: g, expected_format: V, required: h, properties: a, item: i } = u;
    d = { name: m, type: b, description: r, enum_values: g, expected_format: V, required: h, ...a ? { properties: a } : {}, ...i ? { item: i } : {} }, l.shape.properties.push(d), d = l.shape.properties.at(-1);
  } else
    d = { ...qt(), ...u, group: "" }, e.push(d), d = e.at(-1);
  return Ye(e).find((m) => m.shape === d);
}
function xt(e, s = !1) {
  function l(d) {
    return d.type === "object" ? Object.fromEntries((d.properties ?? []).map((m) => [m.name || "unnamed", l(m)])) : d.type === "list" ? d.item ? [l(d.item)] : [] : s ? d.enum_values?.length ? d.enum_values[0] : { text: "Example value", number: 42, boolean: !0, date: "2026-01-15", enum: null }[d.type] : d.type === "enum" ? d.enum_values?.join(" | ") || "enum" : d.type;
  }
  const u = {};
  return e.forEach((d) => Ct(u, K(d) || "unnamed", l(d))), u;
}
const Ql = { class: "shape-editor" }, Jl = { key: 0 }, Yl = ["aria-label", "aria-invalid", "aria-describedby"], Xl = { class: "label-block" }, Zl = ["id"], _l = { key: 0 }, ea = ["id"], ta = {
  key: 2,
  class: "label-block"
}, la = { class: "chips" }, aa = ["aria-label", "onClick"], na = {
  key: 0,
  class: "row"
}, sa = ["onKeydown"], oa = {
  key: 1,
  class: "field-error",
  role: "alert"
}, ia = { key: 3 }, ua = ["placeholder"], da = {
  key: 4,
  class: "toggle-row"
}, ra = { class: "muted" }, ca = ["aria-label", "disabled"], va = /* @__PURE__ */ W({
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
    const l = e, u = s, d = q(() => l.shape), m = q(() => l.named ? l.depth === 1 ? "Field type" : "Property type" : "Item type"), b = q(() => Ut.filter((F) => l.depth < Re || !["object", "list"].includes(F.value))), r = q({ get: () => l.shape.type, set: (F) => {
      l.shape.type = F, delete l.shape.properties, delete l.shape.item, l.shape.enum_values = [], F === "object" && (l.shape.properties = []), F === "list" && (l.shape.item = vl());
    } }), g = $e(), V = $e(), h = U(""), a = U("");
    pe(() => l.shape, () => {
      h.value = "", a.value = "";
    });
    const i = q(() => l.validationError || (l.named ? ml(d.value.name, l.siblingNames) : "") || pl(l.shape, l.depth));
    function B() {
      const F = h.value.trim(), C = l.shape.enum_values ?? [];
      if (!F || F.length > 200) {
        a.value = "Enter 1 to 200 characters.";
        return;
      }
      if (C.includes(F)) {
        a.value = "This value already exists.";
        return;
      }
      if (C.length >= 100) {
        a.value = "Use at most 100 allowed values.";
        return;
      }
      l.shape.enum_values = [...C, F], h.value = "", a.value = "";
    }
    return (F, C) => (n(), o("div", Ql, [
      e.named ? (n(), o("label", Jl, [
        C[8] || (C[8] = E("Name", -1)),
        z(t("input", {
          "onUpdate:modelValue": C[0] || (C[0] = (T) => d.value.name = T),
          "aria-label": e.depth === 1 ? "Field name" : "Property name",
          "aria-invalid": !!i.value,
          "aria-describedby": i.value ? p(V) : void 0,
          maxlength: "80",
          spellcheck: "false",
          class: "mono-input"
        }, null, 8, Yl), [
          [
            Z,
            d.value.name,
            void 0,
            { trim: !0 }
          ]
        ])
      ])) : $("", !0),
      t("div", Xl, [
        t("span", { id: p(g) }, c(e.named ? "Data type" : "Item type"), 9, Zl),
        f(ke, {
          modelValue: r.value,
          "onUpdate:modelValue": C[1] || (C[1] = (T) => r.value = T),
          class: "type-picker",
          options: b.value,
          "labelled-by": p(g),
          name: m.value,
          disabled: e.readonly
        }, null, 8, ["modelValue", "options", "labelled-by", "name", "disabled"]),
        e.depth === p(Re) ? (n(), o("small", _l, "Level four · choose a value type.")) : $("", !0)
      ]),
      i.value ? (n(), o("p", {
        key: 1,
        id: p(V),
        class: "field-error",
        role: "alert"
      }, c(i.value), 9, ea)) : $("", !0),
      p(fl)(e.shape, e.named) ? (n(), o("div", ta, [
        t("span", null, c(e.shape.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        t("div", la, [
          (n(!0), o(N, null, D(e.shape.enum_values, (T, j) => (n(), o("span", {
            key: T,
            class: "chip primary"
          }, [
            E(c(T), 1),
            e.readonly ? $("", !0) : (n(), o("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Remove allowed value ${T}`,
              onClick: (H) => e.shape.enum_values.splice(j, 1)
            }, [
              f(p(M), { icon: "tabler:x" })
            ], 8, aa))
          ]))), 128))
        ]),
        e.readonly ? $("", !0) : (n(), o("div", na, [
          z(t("input", {
            "onUpdate:modelValue": C[2] || (C[2] = (T) => h.value = T),
            "aria-label": "New allowed value",
            placeholder: "Add a value…",
            maxlength: "200",
            onKeydown: qe(ve(B, ["prevent"]), ["enter"])
          }, null, 40, sa), [
            [Z, h.value]
          ]),
          t("button", {
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo",
            onClick: B
          }, "Add")
        ])),
        a.value ? (n(), o("p", oa, c(a.value), 1)) : $("", !0)
      ])) : $("", !0),
      t("label", null, [
        C[9] || (C[9] = E("Description", -1)),
        z(t("textarea", {
          "onUpdate:modelValue": C[3] || (C[3] = (T) => e.shape.description = T),
          rows: "3",
          maxlength: "4000",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [Z, e.shape.description]
        ])
      ]),
      ["boolean", "enum"].includes(e.shape.type) ? $("", !0) : (n(), o("label", ia, [
        C[10] || (C[10] = E("Expected format", -1)),
        z(t("input", {
          "onUpdate:modelValue": C[4] || (C[4] = (T) => e.shape.expected_format = T),
          maxlength: "400",
          placeholder: p(bl)(e.shape)
        }, null, 8, ua), [
          [Z, e.shape.expected_format]
        ])
      ])),
      e.named ? (n(), o("div", da, [
        C[11] || (C[11] = t("span", null, "Required", -1)),
        f(ee, {
          modelValue: d.value.required,
          "onUpdate:modelValue": C[5] || (C[5] = (T) => d.value.required = T),
          label: "Required",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : $("", !0),
      e.shape.type === "object" ? (n(), o(N, { key: 5 }, [
        t("p", ra, c(e.shape.properties?.length ?? 0) + " properties · Select a property in the tree to edit it.", 1),
        !e.readonly && e.depth < p(Re) ? (n(), o("button", {
          key: 0,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Add property to ${e.label}`,
          disabled: (e.shape.properties?.length ?? 0) >= 100,
          onClick: C[6] || (C[6] = (T) => u("add"))
        }, [
          f(p(M), { icon: "tabler:plus" }),
          C[12] || (C[12] = E("Add property", -1))
        ], 8, ca)) : $("", !0)
      ], 64)) : $("", !0),
      e.shape.type === "list" && e.shape.item ? (n(), o("button", {
        key: 6,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        onClick: C[7] || (C[7] = (T) => u("selectItem"))
      }, [
        f(p(M), { icon: "tabler:brackets" }),
        E("Edit item shape · " + c(e.shape.item.type), 1)
      ])) : $("", !0)
    ]));
  }
}), ma = ["disabled"], pa = { class: "grid" }, fa = { class: "context-stepper" }, ba = ["disabled"], ha = ["disabled"], ya = {
  key: 0,
  class: "field-note"
}, ga = { class: "label-block" }, ka = {
  key: 1,
  class: "field-error"
}, $a = { id: "docscout-groups" }, xa = ["value"], wa = { class: "toggle-row" }, Sa = /* @__PURE__ */ W({
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
    const l = e, u = s, d = q(() => !l.depth || l.depth === 1), m = q(() => Ft(l.field, l.otherNames));
    return (b, r) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      f(va, {
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
      d.value ? (n(), o(N, { key: 0 }, [
        r[25] || (r[25] = t("h4", null, "Finding it", -1)),
        t("label", null, [
          r[12] || (r[12] = E("Search hints", -1)),
          z(t("textarea", {
            "onUpdate:modelValue": r[2] || (r[2] = (g) => e.field.search_hints = g),
            rows: "2",
            maxlength: "4000",
            placeholder: "One query per line"
          }, null, 512), [
            [Z, e.field.search_hints]
          ]),
          r[13] || (r[13] = t("small", null, "Each line is an extra search for this field in Prefetch and Deep analysis.", -1))
        ]),
        t("div", pa, [
          t("label", null, [
            r[15] || (r[15] = E("Strategy", -1)),
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
            r[16] || (r[16] = E("Chunks to read", -1)),
            t("span", fa, [
              z(t("input", {
                "onUpdate:modelValue": r[4] || (r[4] = (g) => e.field.chunks = g),
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
                onClick: r[5] || (r[5] = (g) => e.field.chunks--)
              }, "−", 8, ba),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Increase chunks to read",
                disabled: e.field.chunks >= 1e3 || e.readonly,
                onClick: r[6] || (r[6] = (g) => e.field.chunks++)
              }, "+", 8, ha)
            ]),
            r[17] || (r[17] = t("small", null, "Per search hint", -1))
          ])
        ]),
        e.field.strategy === "deep" && !e.deepEnabled ? (n(), o("p", ya, [
          f(p(M), { icon: "tabler:info-circle" }),
          r[18] || (r[18] = E("Deep analysis is off in the flow, so this field runs as standard.", -1))
        ])) : $("", !0),
        t("div", ga, [
          r[19] || (r[19] = t("span", { id: "within-label" }, "Search within", -1)),
          f(ke, {
            modelValue: e.field.search_within,
            "onUpdate:modelValue": r[7] || (r[7] = (g) => e.field.search_within = g),
            "labelled-by": "within-label",
            options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
          }, null, 8, ["modelValue"]),
          t("small", null, c(e.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
        ]),
        e.field.search_within === "sections" && !e.mapEnabled ? (n(), o("p", ka, [
          f(p(M), { icon: "tabler:alert-circle" }),
          r[20] || (r[20] = E("Turn on Map the document to read sections.", -1))
        ])) : $("", !0),
        t("label", null, [
          r[21] || (r[21] = E("Group", -1)),
          z(t("input", {
            "onUpdate:modelValue": r[8] || (r[8] = (g) => e.field.group = g),
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
          t("datalist", $a, [
            (n(!0), o(N, null, D(e.groups, (g) => (n(), o("option", {
              key: g,
              value: g
            }, null, 8, xa))), 128))
          ]),
          r[22] || (r[22] = t("small", null, "Use dotted snake_case names. Values nest under this path.", -1))
        ]),
        r[26] || (r[26] = t("h4", null, "Checking it", -1)),
        t("label", null, [
          r[23] || (r[23] = E("Validation hints", -1)),
          z(t("textarea", {
            "onUpdate:modelValue": r[9] || (r[9] = (g) => e.field.validation_hints = g),
            rows: "2",
            maxlength: "4000",
            placeholder: "Rules the value must satisfy"
          }, null, 512), [
            [Z, e.field.validation_hints]
          ])
        ]),
        t("div", wa, [
          r[24] || (r[24] = t("span", null, [
            E("Evidence required"),
            t("small", null, "The value must cite a quote from the document.")
          ], -1)),
          f(ee, {
            modelValue: e.field.evidence_required,
            "onUpdate:modelValue": r[10] || (r[10] = (g) => e.field.evidence_required = g),
            label: "Evidence required",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : $("", !0),
      !e.readonly && (d.value || e.siblingNames) ? (n(), o("button", {
        key: 1,
        type: "button",
        class: "kx-btn kx-btn-danger kx-focus-halo",
        onClick: r[11] || (r[11] = (g) => u("remove"))
      }, c(d.value ? "Remove field" : "Remove property"), 1)) : $("", !0)
    ], 8, ma));
  }
}), Va = { class: "field-groups" }, Ca = {
  key: 0,
  class: "rows"
}, Ea = ["aria-label"], qa = { class: "field-group-head" }, Fa = ["aria-label", "aria-expanded", "aria-controls", "onClick"], Na = { class: "group-title" }, Ua = ["id"], Ma = { class: "group-title" }, Be = /* @__PURE__ */ W({
  __name: "FieldGroups",
  props: {
    node: {}
  },
  setup(e) {
    const s = U(/* @__PURE__ */ new Set()), l = $e();
    function u(m) {
      s.value.has(m) ? s.value.delete(m) : s.value.add(m);
    }
    const d = (m) => m.indices.length + m.children.reduce((b, r) => b + d(r), 0);
    return (m, b) => {
      const r = ot("FieldGroups", !0);
      return n(), o("div", Va, [
        e.node.indices.length ? (n(), o("ul", Ca, [
          (n(!0), o(N, null, D(e.node.indices, (g) => (n(), o("li", { key: g }, [
            ze(m.$slots, "default", { index: g })
          ]))), 128))
        ])) : $("", !0),
        (n(!0), o(N, null, D(e.node.children, (g, V) => (n(), o("section", {
          key: g.path,
          class: "field-group",
          "aria-label": `Group ${g.path}`
        }, [
          t("header", qa, [
            t("button", {
              type: "button",
              class: "tree-toggle kx-iconbtn kx-focus-outline",
              "aria-label": `${s.value.has(g.path) ? "Expand" : "Collapse"} group ${g.path}`,
              "aria-expanded": !s.value.has(g.path),
              "aria-controls": `${p(l)}-${g.path}`,
              onClick: (h) => u(g.path)
            }, [
              f(p(M), {
                icon: s.value.has(g.path) ? "tabler:chevron-right" : "tabler:chevron-down"
              }, null, 8, ["icon"])
            ], 8, Fa),
            ze(m.$slots, "header", {
              path: g.path,
              label: g.name,
              count: d(g),
              first: V === 0,
              last: V === e.node.children.length - 1
            }, () => [
              t("span", Na, c(g.name), 1)
            ])
          ]),
          z(t("div", {
            id: `${p(l)}-${g.path}`,
            class: "group-content"
          }, [
            f(r, { node: g }, {
              default: me((h) => [
                ze(m.$slots, "default", mt({ ref_for: !0 }, h))
              ]),
              header: me((h) => [
                ze(m.$slots, "header", mt({ ref_for: !0 }, h), () => [
                  t("span", Ma, c(h.label), 1)
                ])
              ]),
              _: 3
            }, 8, ["node"])
          ], 8, Ua), [
            [Qe, !s.value.has(g.path)]
          ])
        ], 8, Ea))), 128))
      ]);
    };
  }
}), Aa = ["aria-label", "maxlength", "aria-invalid", "aria-describedby", "onKeydown"], Ra = {
  type: "submit",
  class: "kx-iconbtn kx-focus-outline",
  "aria-label": "Save group name"
}, Ba = ["id"], Oa = ["title"], Ta = ["aria-label", "data-group-rename", "title"], Pa = ["aria-label"], La = {
  key: 2,
  class: "group-actions"
}, Da = ["aria-label", "disabled"], Ia = ["aria-label", "aria-expanded", "aria-controls"], ja = /* @__PURE__ */ W({
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
    const l = e, u = s, d = U(!1), m = U(""), b = U(""), r = U(!1), g = U(), V = U(), h = U(), a = U(), i = $e(), B = $e(), F = q(() => [
      { label: "Move up", disabled: l.first, command: () => u("reorder", -1) },
      { label: "Move down", disabled: l.last, command: () => u("reorder", 1) },
      { separator: !0 },
      { label: "Delete group and its fields", command: () => u("remove") }
    ]);
    async function C() {
      m.value = l.path, b.value = "", d.value = !0, await Ee(), V.value.focus(), V.value.select();
    }
    async function T() {
      d.value = !1, b.value = "", await Ee(), h.value.focus();
    }
    async function j() {
      const H = m.value.trim();
      if (!H || !Nt.test(H)) {
        b.value = "Use a dotted path of snake_case group names.";
        return;
      }
      if (H.length > l.maxLength) {
        b.value = "The group and its nested paths must fit within 320 characters.";
        return;
      }
      const I = g.value.closest(".field-tree");
      d.value = !1, u("rename", H), await Ee(), I.querySelector(`[data-group-rename="${H}"]`).focus();
    }
    return (H, I) => (n(), o("div", {
      ref_key: "heading",
      ref: g,
      class: "group-heading"
    }, [
      d.value ? (n(), o("form", {
        key: 0,
        class: "group-rename",
        onSubmit: ve(j, ["prevent"])
      }, [
        z(t("input", {
          ref_key: "input",
          ref: V,
          "onUpdate:modelValue": I[0] || (I[0] = (G) => m.value = G),
          "aria-label": `Group path for ${e.path}`,
          maxlength: e.maxLength,
          "aria-invalid": !!b.value,
          "aria-describedby": b.value ? p(B) : void 0,
          onKeydown: [
            qe(ve(j, ["prevent"]), ["enter"]),
            qe(ve(T, ["stop", "prevent"]), ["esc"])
          ]
        }, null, 40, Aa), [
          [Z, m.value]
        ]),
        t("button", Ra, [
          f(p(M), { icon: "tabler:check" })
        ]),
        t("button", {
          type: "button",
          class: "kx-iconbtn kx-focus-outline",
          "aria-label": "Cancel group rename",
          onClick: T
        }, [
          f(p(M), { icon: "tabler:x" })
        ]),
        b.value ? (n(), o("p", {
          key: 0,
          id: p(B),
          class: "field-error",
          role: "alert"
        }, c(b.value), 9, Ba)) : $("", !0)
      ], 32)) : (n(), o(N, { key: 1 }, [
        e.readonly ? (n(), o("span", {
          key: 0,
          class: "group-title",
          title: e.path
        }, c(e.name), 9, Oa)) : (n(), o("button", {
          key: 1,
          ref_key: "renameButton",
          ref: h,
          type: "button",
          class: "group-title group-name-button kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Rename group ${e.path}`,
          "data-group-rename": e.path,
          title: e.path,
          onClick: C
        }, [
          t("span", null, c(e.name), 1),
          f(p(M), {
            icon: "tabler:pencil",
            "aria-hidden": "true"
          })
        ], 8, Ta)),
        t("span", {
          class: "count group-count",
          "aria-label": `${e.count} fields`
        }, c(e.count), 9, Pa),
        e.readonly ? $("", !0) : (n(), o("div", La, [
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Add field to ${e.path}`,
            disabled: !e.canAdd,
            title: "Add field",
            onClick: I[1] || (I[1] = (G) => u("add"))
          }, [
            f(p(M), { icon: "tabler:plus" })
          ], 8, Da),
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Actions for group ${e.path}`,
            "aria-haspopup": "menu",
            "aria-expanded": r.value,
            "aria-controls": p(i),
            onClick: I[2] || (I[2] = (G) => a.value.toggle(G))
          }, [
            f(p(M), { icon: "tabler:dots" })
          ], 8, Ia),
          f(p(hl), {
            id: p(i),
            ref_key: "menu",
            ref: a,
            model: F.value,
            popup: "",
            "append-to": "self",
            onShow: I[3] || (I[3] = (G) => r.value = !0),
            onHide: I[4] || (I[4] = (G) => r.value = !1)
          }, null, 8, ["id", "model"])
        ]))
      ], 64))
    ], 512));
  }
}), za = ["aria-label", "aria-expanded"], Wa = {
  key: 1,
  class: "tree-indent"
}, Ha = ["aria-label", "aria-describedby", "aria-current"], Ka = { class: "row-copy" }, Ga = { class: "row-name" }, Qa = ["title"], Ja = ["id", "title"], Ya = { class: "field-badges" }, Xa = { class: "chip field-type" }, Za = { class: "field-flags" }, _a = {
  key: 0,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Required",
  title: "Required"
}, en = {
  key: 1,
  class: "chip field-flag primary",
  role: "img",
  "aria-label": "Deep analysis",
  title: "Deep analysis"
}, tn = {
  key: 2,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Reads sections",
  title: "Reads sections"
}, ln = {
  key: 3,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Evidence required",
  title: "Evidence required"
}, an = {
  key: 2,
  class: "row-actions"
}, nn = ["aria-label", "disabled"], sn = ["aria-label", "disabled"], on = {
  key: 0,
  class: "tree-children"
}, un = { key: 0 }, dn = { key: 1 }, rn = ["aria-label", "disabled"], cn = /* @__PURE__ */ W({
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
    const l = e, u = s, d = $e(), m = U(!0);
    pe(() => l.selected, (a) => {
      const i = ie(l.field, l.trail);
      a !== i && a.startsWith(i + (l.trail.length ? "/" : "")) && (m.value = !0);
    });
    const b = q(() => l.trail.at(-1) !== "item"), r = q(() => b.value ? l.shape.name || "New field" : "Each item"), g = q(() => l.trail.length ? void 0 : l.shape), V = q(() => l.shape.type === "object" || l.shape.type === "list");
    function h(a) {
      a.key === "ArrowRight" && V.value && (m.value = !0, a.preventDefault(), a.stopPropagation()), a.key === "ArrowLeft" && V.value && (m.value = !1, a.preventDefault(), a.stopPropagation());
    }
    return (a, i) => {
      const B = ot("ShapeTree", !0);
      return n(), o("div", {
        class: "shape-tree-node",
        onKeydown: h
      }, [
        t("div", {
          class: Q(["row-item", { active: e.selected === p(ie)(e.field, e.trail) }])
        }, [
          V.value ? (n(), o("button", {
            key: 0,
            class: "tree-toggle kx-iconbtn kx-focus-outline",
            type: "button",
            "aria-label": `${m.value ? "Collapse" : "Expand"} ${e.path}`,
            "aria-expanded": m.value,
            onClick: i[0] || (i[0] = (F) => m.value = !m.value)
          }, [
            f(p(M), {
              icon: m.value ? "tabler:chevron-down" : "tabler:chevron-right"
            }, null, 8, ["icon"])
          ], 8, za)) : (n(), o("span", Wa)),
          t("button", {
            type: "button",
            class: "row-main kx-focus-halo",
            "aria-label": `Edit ${e.path}`,
            "aria-describedby": p(d),
            "aria-current": e.selected === p(ie)(e.field, e.trail) ? "true" : void 0,
            onClick: i[1] || (i[1] = (F) => u("select", e.field, e.trail))
          }, [
            t("span", Ka, [
              t("span", Ga, [
                f(p(M), {
                  icon: p(Hl)(e.shape.type),
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                t("span", {
                  class: "row-label",
                  title: r.value
                }, c(r.value), 9, Qa),
                e.error ? (n(), Y(p(M), {
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
              }, c(e.shape.description || "No description"), 11, Ja)
            ]),
            t("span", Ya, [
              t("span", Xa, c(e.shape.type), 1),
              t("span", Za, [
                b.value && e.shape.required ? (n(), o("span", _a, [
                  f(p(M), {
                    icon: "tabler:asterisk",
                    "aria-hidden": "true"
                  })
                ])) : $("", !0),
                g.value?.strategy === "deep" ? (n(), o("span", en, [
                  f(p(M), {
                    icon: "tabler:microscope",
                    "aria-hidden": "true"
                  })
                ])) : $("", !0),
                g.value?.search_within === "sections" ? (n(), o("span", tn, [
                  f(p(M), {
                    icon: "tabler:layout-list",
                    "aria-hidden": "true"
                  })
                ])) : $("", !0),
                g.value?.evidence_required ? (n(), o("span", ln, [
                  f(p(M), {
                    icon: "tabler:file-search",
                    "aria-hidden": "true"
                  })
                ])) : $("", !0)
              ])
            ])
          ], 8, Ha),
          !e.readonly && b.value ? (n(), o("span", an, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} up`,
              disabled: e.first,
              onClick: i[2] || (i[2] = (F) => u("reorder", e.field, e.trail, -1))
            }, [
              f(p(M), { icon: "tabler:chevron-up" })
            ], 8, nn),
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} down`,
              disabled: e.last,
              onClick: i[3] || (i[3] = (F) => u("reorder", e.field, e.trail, 1))
            }, [
              f(p(M), { icon: "tabler:chevron-down" })
            ], 8, sn)
          ])) : $("", !0)
        ], 2),
        V.value && m.value ? (n(), o("ul", on, [
          (n(!0), o(N, null, D(e.shape.properties, (F, C) => (n(), o("li", { key: C }, [
            f(B, {
              shape: F,
              field: e.field,
              trail: [...e.trail, C],
              path: `${e.path}.${F.name || "New property"}`,
              selected: e.selected,
              readonly: e.readonly,
              first: C === 0,
              last: C === e.shape.properties.length - 1,
              onSelect: i[4] || (i[4] = (T, j) => u("select", T, j)),
              onAdd: i[5] || (i[5] = (T, j) => u("add", T, j)),
              onReorder: i[6] || (i[6] = (T, j, H) => u("reorder", T, j, H))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly", "first", "last"])
          ]))), 128)),
          e.shape.item ? (n(), o("li", un, [
            f(B, {
              shape: e.shape.item,
              field: e.field,
              trail: [...e.trail, "item"],
              path: `${e.path}[]`,
              selected: e.selected,
              readonly: e.readonly,
              onSelect: i[7] || (i[7] = (F, C) => u("select", F, C)),
              onAdd: i[8] || (i[8] = (F, C) => u("add", F, C)),
              onReorder: i[9] || (i[9] = (F, C, T) => u("reorder", F, C, T))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly"])
          ])) : $("", !0),
          !e.readonly && e.shape.type === "object" && e.trail.length + 1 < p(Re) ? (n(), o("li", dn, [
            t("button", {
              type: "button",
              class: "kx-btn kx-btn-ghost kx-focus-halo sm",
              "aria-label": `Add property to ${e.path}`,
              disabled: (e.shape.properties?.length ?? 0) >= 100,
              onClick: i[10] || (i[10] = (F) => u("add", e.field, e.trail))
            }, [
              f(p(M), { icon: "tabler:plus" }),
              i[11] || (i[11] = E("Add property", -1))
            ], 8, rn)
          ])) : $("", !0)
        ])) : $("", !0)
      ], 32);
    };
  }
}), vn = { class: "label-block" }, mn = {
  key: 0,
  class: "muted"
}, pn = ["config"], fn = {
  key: 2,
  class: "field-error",
  role: "alert"
}, bn = {
  key: 3,
  role: "status",
  class: "muted"
}, hn = /* @__PURE__ */ W({
  __name: "AgentPicker",
  props: {
    value: {},
    readonly: { type: Boolean }
  },
  emits: ["select"],
  setup(e, { emit: s }) {
    const l = s, u = U(!!customElements.get("wc-agent-picker")), d = U("");
    De(async () => {
      if (!u.value)
        try {
          await _e("wc-agent-picker", { timeoutMs: 8e3 }), u.value = !0;
        } catch (b) {
          d.value = b instanceof Error ? b.message : String(b);
        }
    });
    function m(b) {
      if (b.composedPath()[0] !== b.currentTarget) return;
      const r = b.detail;
      l("select", r.agent_id);
    }
    return (b, r) => (n(), o("div", vn, [
      r[0] || (r[0] = t("span", null, "Scout agent", -1)),
      e.readonly ? (n(), o("p", mn, c(e.value || "Built-in scout"), 1)) : u.value ? (n(), o("wc-agent-picker", {
        key: 1,
        config: JSON.stringify({ agent_id: e.value || "" }),
        "aria-label": "Scout agent",
        placeholder: "Choose your agent…",
        onChange: m
      }, null, 40, pn)) : d.value ? (n(), o("p", fn, "Could not load agent picker: " + c(d.value), 1)) : (n(), o("span", bn, "Loading agents…")),
      r[1] || (r[1] = t("small", null, "Leave empty to use the built-in scout.", -1))
    ]));
  }
}), yn = ["value", "capability", "aria-labelledby"], gn = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, kn = {
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
    const l = s, u = U(!!customElements.get("wc-model-picker")), d = U("");
    De(async () => {
      if (!u.value)
        try {
          await _e("wc-model-picker", { timeoutMs: 8e3 }), u.value = !0;
        } catch (b) {
          d.value = b instanceof Error ? b.message : String(b);
        }
    });
    function m(b) {
      const r = b.detail;
      typeof r == "string" && l("select", r);
    }
    return (b, r) => u.value ? (n(), o("wc-model-picker", {
      key: 0,
      value: e.value,
      capability: e.capability,
      "aria-labelledby": e.labelledBy,
      onSelect: m
    }, null, 40, yn)) : d.value ? (n(), o("p", gn, "Could not load model picker: " + c(d.value), 1)) : (n(), o("span", kn, "Loading models…"));
  }
}), $n = { class: "slider" }, xn = { class: "slider-head" }, wn = { class: "slider-value" }, Sn = ["aria-label", "aria-valuetext", "disabled"], Vn = {
  key: 0,
  class: "slider-hints"
}, Cn = { key: 1 }, Ve = 1e3, le = /* @__PURE__ */ W({
  __name: "Slider",
  props: /* @__PURE__ */ Ze({
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
    const s = e, l = Te(e, "modelValue"), u = q(() => s.percent ? `${Math.round(l.value * 100)}%` : `${l.value.toLocaleString()}${s.unit ? ` ${s.unit}` : ""}`), d = (r) => s.log ? Math.log(r / s.min) / Math.log(s.max / s.min) * Ve : (r - s.min) / (s.max - s.min) * Ve;
    function m(r) {
      const g = s.log ? s.min * Math.pow(s.max / s.min, r / Ve) : s.min + (s.max - s.min) * r / Ve, V = Math.round(g / s.step) * s.step;
      return Math.min(s.max, Math.max(s.min, Number(V.toFixed(4))));
    }
    const b = q({ get: () => Math.round(d(l.value)), set: (r) => {
      l.value = m(r);
    } });
    return (r, g) => (n(), o("div", $n, [
      t("div", xn, [
        t("span", null, c(e.label), 1),
        t("output", wn, c(u.value), 1)
      ]),
      z(t("input", {
        "onUpdate:modelValue": g[0] || (g[0] = (V) => b.value = V),
        type: "range",
        min: "0",
        max: Ve,
        step: "1",
        "aria-label": e.label,
        "aria-valuetext": u.value,
        disabled: e.disabled,
        style: Fe({ "--fill": `${b.value / Ve * 100}%` })
      }, null, 12, Sn), [
        [
          Z,
          b.value,
          void 0,
          { number: !0 }
        ]
      ]),
      e.hints ? (n(), o("div", Vn, [
        t("span", null, c(e.hints[0]), 1),
        t("span", null, c(e.hints[1]), 1)
      ])) : $("", !0),
      e.note ? (n(), o("small", Cn, c(e.note), 1)) : $("", !0)
    ]));
  }
}), En = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, qn = { class: "fd-track" }, Fn = { class: "fd-node" }, Nn = { class: "fd-dots" }, Un = { class: "fd-more" }, Mn = { class: "fd-node goal" }, An = /* @__PURE__ */ W({
  __name: "ScoutDiagram",
  props: {
    rounds: {},
    confidence: {},
    extra: {}
  },
  setup(e) {
    const s = e;
    return (l, u) => (n(), o("figure", En, [
      t("div", qn, [
        u[2] || (u[2] = t("span", { class: "fd-node solid" }, "Pass", -1)),
        (n(!0), o(N, null, D(Math.min(s.rounds, 8), (d) => (n(), o(N, { key: d }, [
          u[0] || (u[0] = t("span", { class: "fd-link" }, null, -1)),
          t("span", Fn, [
            t("span", null, "R" + c(d), 1),
            t("span", Nn, [
              (n(!0), o(N, null, D(Math.min(s.extra, 6), (m) => (n(), o("i", { key: m }))), 128))
            ])
          ])
        ], 64))), 128)),
        s.rounds > 8 ? (n(), o(N, { key: 0 }, [
          u[1] || (u[1] = t("span", { class: "fd-link" }, null, -1)),
          t("span", Un, "+" + c(s.rounds - 8), 1)
        ], 64)) : $("", !0),
        u[3] || (u[3] = t("span", { class: "fd-link" }, null, -1)),
        t("span", Mn, "≥ " + c(Math.round(s.confidence * 100)) + "%", 1)
      ]),
      t("figcaption", null, c(s.rounds ? `One pass, then up to ${s.rounds} rounds with up to ${s.extra} new queries each, stopping as soon as confidence reaches ${Math.round(s.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
    ]));
  }
}), Rn = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, Bn = { class: "fd-grid" }, On = { class: "fd-node solid" }, Tn = { class: "fd-node" }, Pn = { class: "fd-node" }, Ln = { class: "fd-node goal" }, Dn = /* @__PURE__ */ W({
  __name: "DeepDiagram",
  props: {
    fields: {},
    parallel: {},
    queries: {},
    perQuery: {},
    cap: {}
  },
  setup(e) {
    const s = e, l = q(() => Math.min(s.queries * s.perQuery, s.cap));
    return (u, d) => (n(), o("figure", Rn, [
      t("div", Bn, [
        t("span", On, [
          t("b", null, c(e.fields), 1),
          E(" field" + c(e.fields === 1 ? "" : "s"), 1),
          t("small", null, c(e.parallel) + " at a time", 1)
        ]),
        t("span", Tn, [
          t("b", null, c(e.queries), 1),
          d[0] || (d[0] = E(" queries", -1)),
          d[1] || (d[1] = t("small", null, "per field", -1))
        ]),
        t("span", Pn, [
          t("b", null, c(e.perQuery), 1),
          d[2] || (d[2] = E(" chunks", -1)),
          d[3] || (d[3] = t("small", null, "per query", -1))
        ]),
        t("span", Ln, [
          t("b", null, c(l.value), 1),
          d[4] || (d[4] = E(" chunks", -1)),
          t("small", null, c(e.queries * e.perQuery > e.cap ? `capped at ${e.cap}` : "read per field"), 1)
        ])
      ]),
      t("figcaption", null, "Each deep field gets its own queries; up to " + c(l.value) + " chunks are read for it before analysis.", 1)
    ]));
  }
}), In = ["disabled"], jn = { class: "muted" }, zn = { class: "toggle-row" }, Wn = { class: "label-block" }, Hn = { class: "toggle-row" }, Kn = {
  id: "model-map",
  class: "model-role"
}, Gn = {
  key: 0,
  class: "chips"
}, Qn = {
  key: 1,
  class: "muted"
}, Jn = { class: "toggle-row" }, Yn = { class: "grid" }, Xn = ["onUpdate:modelValue"], Zn = ["onUpdate:modelValue"], _n = ["onUpdate:modelValue"], es = ["onClick"], ts = {
  key: 0,
  class: "muted"
}, ls = { class: "toggle-row" }, as = { class: "label-block" }, ns = {
  id: "model-scout",
  class: "model-role"
}, ss = {
  key: 3,
  class: "muted"
}, os = {
  key: 4,
  class: "toggle-row"
}, is = { class: "toggle-row" }, us = { class: "toggle-row" }, ds = { class: "label-block" }, rs = {
  id: "model-deep",
  class: "model-role"
}, cs = {
  id: "model-deep-query",
  class: "model-role"
}, vs = {
  id: "model-extract",
  class: "model-role"
}, ms = { class: "output-list" }, ps = { class: "chip" }, fs = {
  key: 0,
  class: "muted"
}, bs = { class: "toggle-row" }, hs = { class: "toggle-row" }, ys = { class: "toggle-row" }, gs = {
  id: "model-verify",
  class: "model-role"
}, ks = /* @__PURE__ */ W({
  __name: "StepInspector",
  props: {
    stage: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const s = e, l = q(() => s.config.stages), u = (h) => $l(s.stage, h), d = yl(), m = q(() => s.config.fields.filter((h) => h.strategy === "deep").length), b = q(() => s.config.fields.filter((h) => h.search_within === "sections").map((h) => h.name || "New field")), r = q(() => St(s.config));
    function g(h) {
      h ? l.value.scout.agent_id = h : delete l.value.scout.agent_id;
    }
    function V(h, a) {
      const i = l.value.scout.tools.filter((B) => B !== h);
      l.value.scout.tools = a ? [...i, h] : i;
    }
    return (h, a) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", jn, c(p(gl)[e.stage]), 1),
      e.stage === "map" ? (n(), o(N, { key: 0 }, [
        t("div", zn, [
          a[33] || (a[33] = t("span", null, "Stage enabled", -1)),
          f(ee, {
            modelValue: l.value.map.enabled,
            "onUpdate:modelValue": a[0] || (a[0] = (i) => l.value.map.enabled = i),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Wn, [
          a[34] || (a[34] = t("span", { id: "outline-label" }, "Outline", -1)),
          f(ke, {
            modelValue: l.value.map.outline,
            "onUpdate:modelValue": a[1] || (a[1] = (i) => l.value.map.outline = i),
            "labelled-by": "outline-label",
            options: [{ value: "find_or_build", label: "Use contents first" }, { value: "build", label: "Always build" }]
          }, null, 8, ["modelValue"]),
          a[35] || (a[35] = t("small", null, "The document's own headings are used when it has them; otherwise the model builds an outline.", -1))
        ]),
        t("div", Hn, [
          a[36] || (a[36] = t("span", null, [
            E("Section summaries"),
            t("small", null, "A short summary per section helps pick the right sections in long documents.")
          ], -1)),
          f(ee, {
            modelValue: l.value.map.section_summaries,
            "onUpdate:modelValue": a[2] || (a[2] = (i) => l.value.map.section_summaries = i),
            label: "Section summaries",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        a[38] || (a[38] = t("h4", null, "Models", -1)),
        t("div", Kn, [
          a[37] || (a[37] = t("span", null, "Outliner", -1)),
          f(ce, {
            value: l.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: a[3] || (a[3] = (i) => l.value.map.model = i)
          }, null, 8, ["value"])
        ]),
        a[39] || (a[39] = t("h4", null, "Fields that read sections", -1)),
        b.value.length ? (n(), o("p", Gn, [
          (n(!0), o(N, null, D(b.value, (i) => (n(), o("span", {
            key: i,
            class: "chip primary"
          }, c(i), 1))), 128))
        ])) : (n(), o("p", Qn, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : $("", !0),
      e.stage === "prefetch" ? (n(), o(N, { key: 1 }, [
        t("div", Jn, [
          a[40] || (a[40] = t("span", null, "Stage enabled", -1)),
          f(ee, {
            modelValue: l.value.prefetch.enabled,
            "onUpdate:modelValue": a[4] || (a[4] = (i) => l.value.prefetch.enabled = i),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        a[44] || (a[44] = t("h4", null, "Queries", -1)),
        (n(!0), o(N, null, D(l.value.prefetch.queries, (i, B) => (n(), o("div", {
          key: B,
          class: "query-row"
        }, [
          t("div", Yn, [
            t("label", null, [
              a[41] || (a[41] = E("Name", -1)),
              z(t("input", {
                "onUpdate:modelValue": (F) => i.name = F,
                placeholder: "Parties"
              }, null, 8, Xn), [
                [Z, i.name]
              ])
            ]),
            t("label", null, [
              a[42] || (a[42] = E("Chunks", -1)),
              z(t("input", {
                "onUpdate:modelValue": (F) => i.chunks = F,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, Zn), [
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
            a[43] || (a[43] = E("Query", -1)),
            z(t("textarea", {
              "onUpdate:modelValue": (F) => i.query = F,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, _n), [
              [Z, i.query]
            ])
          ]),
          e.readonly ? $("", !0) : (n(), o("button", {
            key: 0,
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo sm",
            onClick: (F) => l.value.prefetch.queries.splice(B, 1)
          }, "Remove query", 8, es))
        ]))), 128)),
        l.value.prefetch.queries.length ? $("", !0) : (n(), o("p", ts, "No fixed queries. Field search hints still run.")),
        e.readonly ? $("", !0) : (n(), o("button", {
          key: 1,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          onClick: a[5] || (a[5] = (i) => l.value.prefetch.queries.push(p(kl)()))
        }, "Add query"))
      ], 64)) : $("", !0),
      e.stage === "scout" ? (n(), o(N, { key: 2 }, [
        t("div", ls, [
          a[45] || (a[45] = t("span", null, "Stage enabled", -1)),
          f(ee, {
            modelValue: l.value.scout.enabled,
            "onUpdate:modelValue": a[6] || (a[6] = (i) => l.value.scout.enabled = i),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", as, [
          a[46] || (a[46] = t("span", { id: "mode-label" }, "Mode", -1)),
          f(ke, {
            modelValue: l.value.scout.mode,
            "onUpdate:modelValue": a[7] || (a[7] = (i) => l.value.scout.mode = i),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          t("small", null, c(l.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        l.value.scout.mode === "agent" ? (n(), Y(hn, {
          key: 0,
          value: l.value.scout.agent_id,
          readonly: e.readonly,
          onSelect: g
        }, null, 8, ["value", "readonly"])) : $("", !0),
        l.value.scout.mode === "loop" ? (n(), Y(An, {
          key: 1,
          rounds: l.value.scout.max_rounds,
          confidence: l.value.scout.target_confidence,
          extra: l.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"])) : $("", !0),
        a[51] || (a[51] = t("h4", null, "Models", -1)),
        t("div", ns, [
          a[47] || (a[47] = t("span", null, "Scout", -1)),
          f(ce, {
            value: l.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: a[8] || (a[8] = (i) => l.value.scout.model = i)
          }, null, 8, ["value"])
        ]),
        a[52] || (a[52] = t("h4", null, "Loop", -1)),
        f(le, {
          modelValue: l.value.scout.max_rounds,
          "onUpdate:modelValue": a[9] || (a[9] = (i) => l.value.scout.max_rounds = i),
          label: l.value.scout.mode === "agent" ? "Rounds" : "Follow-up rounds",
          min: u("max_rounds").min,
          max: u("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        l.value.scout.mode === "loop" ? (n(), Y(le, {
          key: 2,
          modelValue: l.value.scout.target_confidence,
          "onUpdate:modelValue": a[10] || (a[10] = (i) => l.value.scout.target_confidence = i),
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
          "onUpdate:modelValue": a[11] || (a[11] = (i) => l.value.scout.max_extra_queries = i),
          label: l.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: u("max_extra_queries").min,
          max: u("max_extra_queries").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.scout.max_tokens,
          "onUpdate:modelValue": a[12] || (a[12] = (i) => l.value.scout.max_tokens = i),
          label: "Scout output limit",
          min: u("max_tokens").min,
          max: u("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        l.value.scout.mode === "agent" ? (n(), o("p", ss, "Tool budget: " + c(l.value.scout.max_rounds * l.value.scout.max_extra_queries) + " calls.", 1)) : $("", !0),
        l.value.scout.mode === "loop" ? (n(), o("div", os, [
          a[48] || (a[48] = t("span", null, [
            E("Drop noisy chunks"),
            t("small", null, "Chunks no field needs leave the evidence pool; chunks cited for a field always stay.")
          ], -1)),
          f(ee, {
            modelValue: l.value.scout.drop_noise,
            "onUpdate:modelValue": a[13] || (a[13] = (i) => l.value.scout.drop_noise = i),
            label: "Drop noisy chunks",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])) : $("", !0),
        t("div", is, [
          a[49] || (a[49] = t("span", null, [
            E("Share scout notes with extraction"),
            t("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          f(ee, {
            modelValue: l.value.scout.share_notes,
            "onUpdate:modelValue": a[14] || (a[14] = (i) => l.value.scout.share_notes = i),
            label: "Share scout notes with extraction",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l.value.scout.mode === "agent" ? (n(), o(N, { key: 5 }, [
          a[50] || (a[50] = t("h4", null, "Agent tools", -1)),
          (n(!0), o(N, null, D(p(d), (i) => (n(), o("div", {
            key: i,
            class: "toggle-row"
          }, [
            t("span", null, c(p(nt)(i)), 1),
            f(ee, {
              "model-value": l.value.scout.tools.includes(i),
              label: p(nt)(i),
              disabled: e.readonly,
              "onUpdate:modelValue": (B) => V(i, B)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : $("", !0)
      ], 64)) : $("", !0),
      e.stage === "deep" ? (n(), o(N, { key: 3 }, [
        t("div", us, [
          a[53] || (a[53] = t("span", null, "Stage enabled", -1)),
          f(ee, {
            modelValue: l.value.deep.enabled,
            "onUpdate:modelValue": a[15] || (a[15] = (i) => l.value.deep.enabled = i),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        f(Dn, {
          fields: m.value,
          parallel: l.value.deep.parallel_fields,
          queries: l.value.deep.max_queries,
          "per-query": l.value.deep.chunks_per_query,
          cap: l.value.deep.chunk_cap
        }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"]),
        t("div", ds, [
          a[54] || (a[54] = t("span", { id: "read-label" }, "Reads", -1)),
          f(ke, {
            modelValue: l.value.deep.read,
            "onUpdate:modelValue": a[16] || (a[16] = (i) => l.value.deep.read = i),
            "labelled-by": "read-label",
            options: [{ value: "chunks", label: "Retrieved chunks" }, { value: "sections", label: "Whole sections" }]
          }, null, 8, ["modelValue"]),
          a[55] || (a[55] = t("small", null, "Whole sections suit clauses that span many passages; long sections fall back to chunks.", -1))
        ]),
        a[58] || (a[58] = t("h4", null, "Models", -1)),
        t("div", rs, [
          a[56] || (a[56] = t("span", null, "Analysis", -1)),
          f(ce, {
            value: l.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: a[17] || (a[17] = (i) => l.value.deep.model = i)
          }, null, 8, ["value"])
        ]),
        t("div", cs, [
          a[57] || (a[57] = t("span", null, "Query writer", -1)),
          f(ce, {
            value: l.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: a[18] || (a[18] = (i) => l.value.deep.query_model = i)
          }, null, 8, ["value"])
        ]),
        a[59] || (a[59] = t("h4", null, "Reach", -1)),
        f(le, {
          modelValue: l.value.deep.parallel_fields,
          "onUpdate:modelValue": a[19] || (a[19] = (i) => l.value.deep.parallel_fields = i),
          label: "Fields at a time",
          min: u("parallel_fields").min,
          max: u("parallel_fields").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.deep.max_queries,
          "onUpdate:modelValue": a[20] || (a[20] = (i) => l.value.deep.max_queries = i),
          label: "Queries per field",
          min: u("max_queries").min,
          max: u("max_queries").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.deep.chunks_per_query,
          "onUpdate:modelValue": a[21] || (a[21] = (i) => l.value.deep.chunks_per_query = i),
          label: "Chunks per query",
          min: u("chunks_per_query").min,
          max: u("chunks_per_query").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.deep.chunk_cap,
          "onUpdate:modelValue": a[22] || (a[22] = (i) => l.value.deep.chunk_cap = i),
          label: "Chunk cap per field",
          min: u("chunk_cap").min,
          max: u("chunk_cap").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.deep.min_similarity,
          "onUpdate:modelValue": a[23] || (a[23] = (i) => l.value.deep.min_similarity = i),
          label: "Minimum similarity",
          min: u("min_similarity").min,
          max: u("min_similarity").max,
          step: 0.05,
          percent: "",
          hints: ["Loose", "Strict"],
          note: "Chunks less similar than this are skipped.",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        a[60] || (a[60] = t("h4", null, "Temperature", -1)),
        f(le, {
          modelValue: l.value.deep.query_temperature,
          "onUpdate:modelValue": a[24] || (a[24] = (i) => l.value.deep.query_temperature = i),
          label: "Query writing",
          min: u("query_temperature").min,
          max: u("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(le, {
          modelValue: l.value.deep.analysis_temperature,
          "onUpdate:modelValue": a[25] || (a[25] = (i) => l.value.deep.analysis_temperature = i),
          label: "Analysis",
          min: u("analysis_temperature").min,
          max: u("analysis_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : $("", !0),
      e.stage === "extract" ? (n(), o(N, { key: 4 }, [
        a[62] || (a[62] = t("h4", null, "Models", -1)),
        t("div", vs, [
          a[61] || (a[61] = t("span", null, "Extraction", -1)),
          f(ce, {
            value: l.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: a[26] || (a[26] = (i) => l.value.extract.model = i)
          }, null, 8, ["value"])
        ]),
        a[63] || (a[63] = t("h4", null, "Field groups", -1)),
        t("ul", ms, [
          (n(!0), o(N, null, D(r.value, (i) => (n(), o("li", {
            key: i.name
          }, [
            t("span", null, c(i.name), 1),
            t("span", ps, c(i.fields.length) + " field" + c(i.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        r.value.length ? $("", !0) : (n(), o("p", fs, "No fields yet.")),
        f(le, {
          modelValue: l.value.extract.max_fields_per_call,
          "onUpdate:modelValue": a[27] || (a[27] = (i) => l.value.extract.max_fields_per_call = i),
          label: "Fields per call",
          min: u("max_fields_per_call").min,
          max: u("max_fields_per_call").max,
          disabled: e.readonly,
          note: `${p(bt)(e.config)} extraction call${p(bt)(e.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        f(le, {
          modelValue: l.value.extract.max_output_tokens,
          "onUpdate:modelValue": a[28] || (a[28] = (i) => l.value.extract.max_output_tokens = i),
          label: "Output limit",
          min: u("max_output_tokens").min,
          max: u("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : $("", !0),
      e.stage === "verify" ? (n(), o(N, { key: 5 }, [
        t("div", bs, [
          a[64] || (a[64] = t("span", null, "Stage enabled", -1)),
          f(ee, {
            modelValue: l.value.verify.enabled,
            "onUpdate:modelValue": a[29] || (a[29] = (i) => l.value.verify.enabled = i),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", hs, [
          a[65] || (a[65] = t("span", null, [
            E("Quotes exist"),
            t("small", null, "Each quote is matched against the document text. No model call.")
          ], -1)),
          f(ee, {
            modelValue: l.value.verify.check_quotes,
            "onUpdate:modelValue": a[30] || (a[30] = (i) => l.value.verify.check_quotes = i),
            label: "Quotes exist",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", ys, [
          a[66] || (a[66] = t("span", null, [
            E("Quotes support values"),
            t("small", null, "A model confirms each quote supports its value.")
          ], -1)),
          f(ee, {
            modelValue: l.value.verify.check_support,
            "onUpdate:modelValue": a[31] || (a[31] = (i) => l.value.verify.check_support = i),
            label: "Quotes support values",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l.value.verify.check_support ? (n(), o(N, { key: 0 }, [
          a[68] || (a[68] = t("h4", null, "Models", -1)),
          t("div", gs, [
            a[67] || (a[67] = t("span", null, "Checker", -1)),
            f(ce, {
              value: l.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: a[32] || (a[32] = (i) => l.value.verify.model = i)
            }, null, 8, ["value"])
          ])
        ], 64)) : $("", !0)
      ], 64)) : $("", !0)
    ], 8, In));
  }
}), $s = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, xs = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, ws = ["x", "y", "width"], Ss = ["x", "width"], Vs = /* @__PURE__ */ W({
  __name: "ChunkDiagram",
  props: {
    size: {},
    overlap: {}
  },
  setup(e) {
    const s = e, l = q(() => Math.min(0.9, Math.max(0, s.overlap / s.size))), u = q(() => {
      const d = 100 / (3 - 2 * l.value);
      return [0, 1, 2].map((m) => ({ x: m * d * (1 - l.value), w: d }));
    });
    return (d, m) => (n(), o("figure", $s, [
      (n(), o("svg", xs, [
        (n(!0), o(N, null, D(u.value, (b, r) => (n(), o("rect", {
          key: r,
          x: b.x,
          y: r % 2 ? 14 : 4,
          width: b.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, ws))), 128)),
        (n(), o(N, null, D([1, 2], (b) => t("rect", {
          key: "o" + b,
          x: u.value[b].x,
          y: 4,
          width: u.value[b - 1].x + u.value[b - 1].w - u.value[b].x,
          height: "24",
          class: "shared"
        }, null, 8, Ss)), 64))
      ])),
      t("figcaption", null, c(e.size.toLocaleString()) + " tokens per chunk · " + c(e.overlap.toLocaleString()) + " shared with the next (" + c(Math.round(l.value * 100)) + "%)", 1)
    ]));
  }
}), Cs = ["disabled"], Es = { class: "muted" }, qs = { class: "toggle-row" }, Fs = { class: "toggle-row" }, Ns = { class: "label-block" }, Us = {
  key: 0,
  id: "context-model",
  class: "model-role"
}, Ms = { class: "label-block" }, As = {
  id: "embedding-model",
  class: "model-role"
}, Rs = { class: "toggle-row" }, Bs = {
  key: 1,
  id: "highlighter-model",
  class: "model-role"
}, Os = /* @__PURE__ */ W({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const s = e, l = q(() => s.config.retrieval), u = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], d = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], m = lt("chunk_size"), b = lt("overlap"), r = lt("section_budget"), g = q(() => Math.min(b.max, l.value.chunk_size - 50));
    return (V, h) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", Es, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + c(e.retention) + ".", 1),
      h[19] || (h[19] = t("h4", null, "Chunks", -1)),
      f(Vs, {
        size: l.value.chunk_size,
        overlap: l.value.overlap
      }, null, 8, ["size", "overlap"]),
      f(le, {
        modelValue: l.value.chunk_size,
        "onUpdate:modelValue": h[0] || (h[0] = (a) => l.value.chunk_size = a),
        label: "Chunk size",
        min: p(m).min,
        max: p(m).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      f(le, {
        modelValue: l.value.overlap,
        "onUpdate:modelValue": h[1] || (h[1] = (a) => l.value.overlap = a),
        label: "Overlap",
        min: p(b).min,
        max: g.value,
        step: 10,
        unit: "tokens",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      t("div", qs, [
        h[11] || (h[11] = t("span", null, [
          E("Split by headings"),
          t("small", null, "A chunk never crosses a heading.")
        ], -1)),
        f(ee, {
          modelValue: l.value.split_headings,
          "onUpdate:modelValue": h[2] || (h[2] = (a) => l.value.split_headings = a),
          label: "Split by headings",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t("div", Fs, [
        h[12] || (h[12] = t("span", null, [
          E("Keep tables whole"),
          t("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        f(ee, {
          modelValue: l.value.keep_tables,
          "onUpdate:modelValue": h[3] || (h[3] = (a) => l.value.keep_tables = a),
          label: "Keep tables whole",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      f(le, {
        modelValue: l.value.section_budget,
        "onUpdate:modelValue": h[4] || (h[4] = (a) => l.value.section_budget = a),
        label: "Section budget",
        min: p(r).min,
        max: p(r).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      h[20] || (h[20] = t("h4", null, "Context", -1)),
      t("div", Ns, [
        h[13] || (h[13] = t("span", { id: "context-label" }, "Chunk context", -1)),
        f(ke, {
          modelValue: l.value.context,
          "onUpdate:modelValue": h[5] || (h[5] = (a) => l.value.context = a),
          "labelled-by": "context-label",
          options: d
        }, null, 8, ["modelValue"]),
        t("small", null, c(d.find((a) => a.value === l.value.context)?.note), 1)
      ]),
      l.value.context === "generated" ? (n(), o("div", Us, [
        h[14] || (h[14] = t("span", null, "Context writer", -1)),
        f(ce, {
          value: l.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: h[6] || (h[6] = (a) => l.value.context_model = a)
        }, null, 8, ["value"])
      ])) : $("", !0),
      h[21] || (h[21] = t("h4", null, "Search", -1)),
      t("div", Ms, [
        h[15] || (h[15] = t("span", { id: "mode-label" }, "Search mode", -1)),
        f(ke, {
          modelValue: l.value.search_mode,
          "onUpdate:modelValue": h[7] || (h[7] = (a) => l.value.search_mode = a),
          "labelled-by": "mode-label",
          options: u
        }, null, 8, ["modelValue"]),
        t("small", null, c(u.find((a) => a.value === l.value.search_mode)?.note), 1)
      ]),
      h[22] || (h[22] = t("h4", null, "Models", -1)),
      t("div", As, [
        h[16] || (h[16] = t("span", null, "Embedding", -1)),
        f(ce, {
          value: l.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: h[8] || (h[8] = (a) => l.value.embedding_model = a)
        }, null, 8, ["value"])
      ]),
      t("div", Rs, [
        h[17] || (h[17] = t("span", null, [
          E("Highlighter"),
          t("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        f(ee, {
          modelValue: l.value.highlighter,
          "onUpdate:modelValue": h[9] || (h[9] = (a) => l.value.highlighter = a),
          label: "Highlighter",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      l.value.highlighter ? (n(), o("div", Bs, [
        h[18] || (h[18] = t("span", null, "Highlighter", -1)),
        f(ce, {
          value: l.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: h[10] || (h[10] = (a) => l.value.highlighter_model = a)
        }, null, 8, ["value"])
      ])) : $("", !0)
    ], 8, Cs));
  }
}), Ts = ["inert"], Ps = { class: "canvas-inner" }, Ls = {
  class: "block fields-block",
  "aria-labelledby": "fields-head"
}, Ds = { class: "block-head" }, Is = ["aria-expanded"], js = { class: "count" }, zs = {
  key: 0,
  class: "block-peek"
}, Ws = ["disabled"], Hs = {
  id: "fields-body",
  class: "block-body"
}, Ks = {
  key: 0,
  class: "block-empty"
}, Gs = ["disabled"], Qs = {
  key: 2,
  class: "field-error",
  role: "alert"
}, Js = { class: "field-tree" }, Ys = {
  class: "shape-preview",
  open: ""
}, Xs = { class: "kx-focus-outline" }, Zs = {
  key: 0,
  class: "field-error",
  role: "alert"
}, _s = {
  key: 1,
  class: "preview-grid"
}, eo = { "aria-label": "Output shape" }, to = { "aria-label": "Example output" }, lo = {
  class: "block",
  "aria-labelledby": "flow-head"
}, ao = { class: "block-head" }, no = ["aria-expanded"], so = { class: "count" }, oo = {
  key: 0,
  class: "block-peek"
}, io = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, uo = { class: "node-icon" }, ro = { class: "node-main" }, co = { class: "node-summary" }, vo = { class: "node-side" }, mo = { class: "chip model" }, po = { class: "branches" }, fo = { class: "branch" }, bo = { class: "branch" }, ho = { class: "node-icon" }, yo = { class: "node-main" }, go = { class: "node-summary" }, ko = ["aria-labelledby", "role", "aria-modal"], $o = ["aria-valuenow"], xo = { class: "side-panel-head" }, wo = { class: "side-panel-icon" }, So = ["id"], Vo = ["aria-label", "title"], Co = { class: "node-breadcrumb mono" }, Eo = {
  key: 0,
  class: "move-node",
  "aria-label": "Move node"
}, qo = {
  key: 0,
  value: ""
}, Fo = {
  key: 1,
  value: "",
  disabled: ""
}, No = ["value"], Uo = ["disabled"], Mo = ["disabled"], Ao = {
  key: 4,
  class: "inspector-form"
}, Ro = { class: "output-list" }, Bo = { class: "mono" }, Oo = { class: "chip" }, To = { class: "rail-label" }, at = 400, He = 320, Po = /* @__PURE__ */ W({
  __name: "Builder",
  props: /* @__PURE__ */ Ze({
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
    const s = e, l = Te(e, "title"), u = Te(e, "description"), d = U({ kind: "document" });
    function m(k, v) {
      try {
        const S = localStorage.getItem(`docscout.${k}`);
        return S === null ? v : S === "1";
      } catch {
        return v;
      }
    }
    function b(k, v) {
      try {
        localStorage.setItem(`docscout.${k}`, v ? "1" : "0");
      } catch {
      }
    }
    const r = U(m("panel", !0)), g = U(m("fields", !0)), V = U(m("flow", !0));
    function h() {
      try {
        const k = Number(localStorage.getItem("docscout.panelWidth"));
        return k >= He ? k : at;
      } catch {
        return at;
      }
    }
    const a = U(h()), i = () => {
      const k = O.value?.clientWidth;
      return k ? Math.max(He, k - 420) : Number.POSITIVE_INFINITY;
    };
    function B(k, v = !0) {
      if (a.value = Math.round(Math.min(i(), Math.max(He, k))), v)
        try {
          localStorage.setItem("docscout.panelWidth", String(a.value));
        } catch {
        }
    }
    const F = U(!1);
    function C(k) {
      const v = k.currentTarget, S = k.clientX, J = a.value;
      v.setPointerCapture(k.pointerId), F.value = !0;
      const X = (_) => B(J + (S - _.clientX), !1), ae = () => {
        F.value = !1, B(a.value), v.removeEventListener("pointermove", X), v.removeEventListener("pointerup", ae);
      };
      v.addEventListener("pointermove", X), v.addEventListener("pointerup", ae);
    }
    function T(k) {
      k.key === "ArrowLeft" ? (B(a.value + 24), k.preventDefault()) : k.key === "ArrowRight" && (B(a.value - 24), k.preventDefault());
    }
    let j = null;
    const H = U(), I = $e();
    async function G(k) {
      if (r.value = k, !A.value) {
        b("panel", k);
        return;
      }
      if (!k && j) {
        const v = j;
        j = null, await Ee(), v.focus();
      }
    }
    function L(k) {
      const v = k === "fields" ? g : V;
      v.value = !v.value, b(k, v.value);
    }
    const O = U(), A = U(!1);
    let ue;
    De(() => {
      ue = new ResizeObserver(([k]) => {
        const v = A.value;
        A.value = k.contentRect.width < 1e3, A.value && !v && (r.value = !1), !A.value && v && (r.value = m("panel", !0));
      }), O.value && ue.observe(O.value);
    }), wt(() => ue?.disconnect());
    const ye = U();
    pe(d, async () => {
      await Ee(), ye.value && (ye.value.scrollTop = 0);
    });
    async function te(k) {
      A.value && !r.value && (j = O.value?.getRootNode()?.activeElement), d.value = k, r.value = !0, A.value && (await Ee(), H.value?.focus());
    }
    const oe = (k) => JSON.stringify(k) === JSON.stringify(d.value), fe = q(() => d.value.kind === "field" ? s.config.fields[d.value.index] : void 0), w = q(() => Ye(s.config.fields)), y = q(() => d.value.kind === "field" ? w.value.find((k) => k.key === ie(d.value.index, d.value.trail ?? [])) : void 0), x = q(() => y.value?.key ?? ""), R = q(() => {
      const k = y.value;
      return !k || k.trail.at(-1) === "item" || !k.trail.length ? void 0 : w.value.find((S) => S.key === ie(k.field, k.trail.slice(0, -1))).shape.properties.filter((S) => S !== k.shape).map((S) => S.name);
    }), P = U("");
    pe(x, () => {
      P.value = "";
    });
    const Ne = q(() => y.value ? Kl(s.config.fields, y.value) : []), be = q(() => {
      const k = xl(s.config.fields.map(K));
      return k ? `Group path collides with field ${k}.` : "";
    }), Ie = q(() => be.value ? null : xt(s.config.fields)), Bt = q(() => be.value ? null : xt(s.config.fields, !0)), ut = q(() => {
      const k = d.value;
      return k.kind === "stage" ? ge[k.stage] : k.kind === "field" ? y.value?.trail.length ? y.value.path : fe.value?.name || "New field" : k.kind === "document" ? "Read document" : k.kind === "output" ? "Output" : "Details";
    }), Ot = q(() => {
      const k = d.value;
      return k.kind === "stage" ? it[k.stage] : k.kind === "field" ? "tabler:forms" : k.kind === "document" ? "tabler:file-text" : k.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), Tt = q(() => s.config.fields.filter((k, v) => !(d.value.kind === "field" && d.value.index === v)).map(K)), Pt = q(() => s.config.stages.deep.enabled), Lt = q(() => s.config.stages.map.enabled), Dt = q(() => Pe(s.config.fields.map(K))), xe = U(""), Ue = U("");
    function It(k, v) {
      for (const S of s.config.fields) (S.group === k || S.group.startsWith(k + ".")) && (S.group = v + S.group.slice(k.length));
      Ue.value = "";
    }
    const jt = (k) => 320 - Math.max(0, ...s.config.fields.filter((v) => v.group === k || v.group.startsWith(k + ".")).map((v) => v.group.length - k.length));
    function zt() {
      if (!xe.value || !Nt.test(xe.value)) {
        Ue.value = "Use a dotted path of snake_case group names.";
        return;
      }
      et(xe.value), xe.value = "", Ue.value = "";
    }
    const Wt = q(() => [...new Set(s.config.fields.map((k) => k.group.trim()).filter(Boolean))]), Ht = (k) => Ft(s.config.fields[k], s.config.fields.filter((v, S) => S !== k).map(K)), dt = ["map", "prefetch", "scout", "deep", "extract", "verify"], Kt = q(() => dt.filter((k) => Je(s.config, k)).map((k) => ge[k]).join(" · ")), Gt = q(() => s.config.fields.map((k) => k.name || "New field").join(", ")), Qt = q(() => dt.filter((k) => Je(s.config, k)).length), we = (k) => s.result?.trace.find((v) => v.kind === k);
    function et(k = "") {
      s.config.fields.push({ ...qt(), group: k }), g.value = !0, te({ kind: "field", index: s.config.fields.length - 1 });
    }
    function Jt(k) {
      s.config.fields.splice(k, 1), d.value = { kind: "document" };
    }
    function re(k, v = []) {
      te({ kind: "field", index: k, ...v.length ? { trail: v } : {} });
    }
    function rt(k, v) {
      const S = w.value.find((J) => J.key === ie(k, v));
      S.shape.properties.push(Et()), re(k, [...v, S.shape.properties.length - 1]);
    }
    function Yt() {
      const k = y.value;
      if (!k.trail.length) {
        Jt(k.field);
        return;
      }
      const v = w.value.find((S) => S.key === ie(k.field, k.trail.slice(0, -1)));
      v.shape.properties.splice(k.trail.at(-1), 1), re(v.field, v.trail);
    }
    function Xt(k, v, S) {
      if (v.length) {
        const X = w.value.find((ne) => ne.key === ie(k, v.slice(0, -1))).shape.properties, ae = v.at(-1), _ = ae + S;
        if (_ < 0 || _ >= X.length) return;
        [X[ae], X[_]] = [X[_], X[ae]], re(k, [...v.slice(0, -1), _]);
      } else {
        const J = s.config.fields.map((_, ne) => _.group === s.config.fields[k].group ? ne : -1).filter((_) => _ >= 0), X = J[J.indexOf(k) + S];
        if (X === void 0) return;
        const ae = s.config.fields;
        [ae[k], ae[X]] = [ae[X], ae[k]], re(X);
      }
    }
    function Zt() {
      const k = y.value, v = Ne.value.find((J) => J.key === P.value), S = Gl(s.config.fields, k, v);
      re(S.field, S.trail);
    }
    function _t(k) {
      const v = y.value?.shape;
      s.config.fields.splice(0, s.config.fields.length, ...s.config.fields.filter((J) => J.group !== k && !J.group.startsWith(k + ".")));
      const S = w.value.find((J) => J.shape === v);
      S ? re(S.field, S.trail) : d.value = { kind: "document" };
    }
    function el(k, v) {
      const S = k.split(".").slice(0, -1).join(".");
      let X = Pe(s.config.fields.map(K));
      for (const se of S.split(".").filter(Boolean)) X = X.children.find((nl) => nl.name === se);
      const ae = X.children.findIndex((se) => se.path === k), _ = X.children[ae + v]?.path;
      if (!_) return;
      const ne = s.config.fields.filter((se) => se.group === k || se.group.startsWith(k + ".")), je = s.config.fields.filter((se) => se.group === _ || se.group.startsWith(_ + ".")), Me = s.config.fields, ll = Math.min(Me.indexOf(ne[0]), Me.indexOf(je[0])), vt = Me.filter((se) => !ne.includes(se) && !je.includes(se));
      vt.splice(ll, 0, ...v > 0 ? [...je, ...ne] : [...ne, ...je]);
      const al = y.value?.shape;
      Me.splice(0, Me.length, ...vt);
      const tt = w.value.find((se) => se.shape === al);
      tt && re(tt.field, tt.trail);
    }
    const tl = (k) => k.type === "list" ? `list of ${k.item?.type}` : k.type, ct = q({ get: () => s.config.tags.join(", "), set: (k) => {
      s.config.tags = [...new Set(k.split(",").map((v) => v.trim()).filter(Boolean))];
    } });
    return (k, v) => (n(), o("div", {
      ref_key: "root",
      ref: O,
      class: Q(["builder", { narrow: A.value, "panel-open": r.value, resizing: F.value }])
    }, [
      t("div", {
        class: "canvas",
        inert: A.value && r.value
      }, [
        t("div", Ps, [
          t("section", Ls, [
            t("header", Ds, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": g.value,
                "aria-controls": "fields-body",
                onClick: v[0] || (v[0] = (S) => L("fields"))
              }, [
                f(p(M), {
                  icon: g.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                v[24] || (v[24] = t("h2", { id: "fields-head" }, "Fields", -1)),
                t("span", js, c(e.config.fields.length), 1)
              ], 8, Is),
              !g.value && e.config.fields.length ? (n(), o("span", zs, c(Gt.value), 1)) : $("", !0),
              e.readonly ? $("", !0) : (n(), o("button", {
                key: 1,
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo sm push",
                disabled: e.config.fields.length >= 100,
                onClick: v[1] || (v[1] = (S) => et())
              }, [
                f(p(M), { icon: "tabler:plus" }),
                v[25] || (v[25] = E("Add field", -1))
              ], 8, Ws))
            ]),
            z(t("div", Hs, [
              e.config.fields.length ? $("", !0) : (n(), o("p", Ks, "Add the values to pull from each document.")),
              e.readonly ? $("", !0) : (n(), o("form", {
                key: 1,
                class: "group-add row",
                onSubmit: ve(zt, ["prevent"])
              }, [
                t("label", null, [
                  v[26] || (v[26] = E("New group", -1)),
                  z(t("input", {
                    "onUpdate:modelValue": v[2] || (v[2] = (S) => xe.value = S),
                    placeholder: "parties.borrower",
                    "aria-label": "New group path",
                    maxlength: "320"
                  }, null, 512), [
                    [
                      Z,
                      xe.value,
                      void 0,
                      { trim: !0 }
                    ]
                  ])
                ]),
                t("button", {
                  type: "submit",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  disabled: e.config.fields.length >= 100
                }, "Add group", 8, Gs)
              ], 32)),
              Ue.value ? (n(), o("p", Qs, c(Ue.value), 1)) : $("", !0),
              t("div", Js, [
                f(Be, { node: Dt.value }, {
                  header: me(({ path: S, label: J, count: X, first: ae, last: _ }) => [
                    f(ja, {
                      path: S,
                      name: J,
                      count: X,
                      first: ae,
                      last: _,
                      "max-length": jt(S),
                      "can-add": e.config.fields.length < 100,
                      readonly: e.readonly,
                      onRename: (ne) => It(S, ne),
                      onAdd: (ne) => et(S),
                      onReorder: (ne) => el(S, ne),
                      onRemove: (ne) => _t(S)
                    }, null, 8, ["path", "name", "count", "first", "last", "max-length", "can-add", "readonly", "onRename", "onAdd", "onReorder", "onRemove"])
                  ]),
                  default: me(({ index: S }) => [
                    f(cn, {
                      shape: e.config.fields[S],
                      field: S,
                      trail: [],
                      path: p(K)(e.config.fields[S]) || "New field",
                      selected: x.value,
                      readonly: e.readonly,
                      error: Ht(S),
                      first: !e.config.fields.slice(0, S).some((J) => J.group === e.config.fields[S].group),
                      last: !e.config.fields.slice(S + 1).some((J) => J.group === e.config.fields[S].group),
                      onSelect: re,
                      onAdd: rt,
                      onReorder: Xt
                    }, null, 8, ["shape", "field", "path", "selected", "readonly", "error", "first", "last"])
                  ]),
                  _: 1
                }, 8, ["node"])
              ]),
              t("details", Ys, [
                t("summary", Xs, [
                  f(p(M), { icon: "tabler:braces" }),
                  v[27] || (v[27] = E("Output preview", -1))
                ]),
                be.value ? (n(), o("p", Zs, c(be.value), 1)) : (n(), o("div", _s, [
                  t("div", null, [
                    v[28] || (v[28] = t("h3", null, "Output shape", -1)),
                    t("pre", eo, c(JSON.stringify(Ie.value, null, 2)), 1)
                  ]),
                  t("div", null, [
                    v[29] || (v[29] = t("h3", null, "Example value", -1)),
                    t("pre", to, c(JSON.stringify(Bt.value, null, 2)), 1)
                  ])
                ])),
                v[30] || (v[30] = t("small", null, "Example values illustrate the shape; extracted values come from your document.", -1))
              ])
            ], 512), [
              [Qe, g.value]
            ])
          ]),
          t("section", lo, [
            t("header", ao, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": V.value,
                "aria-controls": "flow-body",
                onClick: v[3] || (v[3] = (S) => L("flow"))
              }, [
                f(p(M), {
                  icon: V.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                v[31] || (v[31] = t("h2", { id: "flow-head" }, "Flow", -1)),
                t("span", so, c(Qt.value) + " of 6", 1)
              ], 8, no),
              V.value ? $("", !0) : (n(), o("span", oo, c(Kt.value), 1)),
              t("button", {
                type: "button",
                class: Q(["kx-btn kx-btn-ghost kx-focus-halo sm push", { on: oe({ kind: "details" }) }]),
                onClick: v[4] || (v[4] = (S) => te({ kind: "details" }))
              }, [
                f(p(M), { icon: "tabler:info-circle" }),
                v[32] || (v[32] = E("Details", -1))
              ], 2)
            ]),
            z(t("div", io, [
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "document" }) }]),
                onClick: v[5] || (v[5] = (S) => te({ kind: "document" }))
              }, [
                t("span", uo, [
                  f(p(M), { icon: "tabler:file-text" })
                ]),
                t("span", ro, [
                  v[33] || (v[33] = t("span", { class: "node-title" }, "Read document", -1)),
                  t("span", co, c(p(wl)(e.config.retrieval)), 1)
                ]),
                t("span", vo, [
                  t("span", mo, c(p(Vt)(e.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              v[38] || (v[38] = t("div", { class: "connector" }, null, -1)),
              f(Se, {
                stage: "map",
                config: e.config,
                active: oe({ kind: "stage", stage: "map" }),
                trace: we("map"),
                readonly: e.readonly,
                onSelect: v[6] || (v[6] = (S) => te({ kind: "stage", stage: "map" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[39] || (v[39] = t("div", {
                class: "fork",
                "aria-hidden": "true"
              }, [
                t("span")
              ], -1)),
              t("div", po, [
                t("div", fo, [
                  v[34] || (v[34] = t("span", { class: "branch-label" }, "Evidence", -1)),
                  f(Se, {
                    stage: "prefetch",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "prefetch" }),
                    trace: we("prefetch"),
                    readonly: e.readonly,
                    onSelect: v[7] || (v[7] = (S) => te({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  v[35] || (v[35] = t("div", { class: "connector" }, null, -1)),
                  f(Se, {
                    stage: "scout",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "scout" }),
                    trace: we("scout"),
                    readonly: e.readonly,
                    onSelect: v[8] || (v[8] = (S) => te({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                t("div", bo, [
                  v[36] || (v[36] = t("span", { class: "branch-label" }, "Deep fields", -1)),
                  f(Se, {
                    stage: "deep",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "deep" }),
                    trace: we("deep"),
                    readonly: e.readonly,
                    onSelect: v[9] || (v[9] = (S) => te({ kind: "stage", stage: "deep" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ])
              ]),
              v[40] || (v[40] = t("div", {
                class: "join",
                "aria-hidden": "true"
              }, [
                t("span")
              ], -1)),
              f(Se, {
                stage: "extract",
                config: e.config,
                active: oe({ kind: "stage", stage: "extract" }),
                trace: we("extract"),
                readonly: e.readonly,
                onSelect: v[10] || (v[10] = (S) => te({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[41] || (v[41] = t("div", { class: "connector" }, null, -1)),
              f(Se, {
                stage: "verify",
                config: e.config,
                active: oe({ kind: "stage", stage: "verify" }),
                trace: we("verify"),
                readonly: e.readonly,
                onSelect: v[11] || (v[11] = (S) => te({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[42] || (v[42] = t("div", { class: "connector" }, null, -1)),
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "output" }) }]),
                onClick: v[12] || (v[12] = (S) => te({ kind: "output" }))
              }, [
                t("span", ho, [
                  f(p(M), { icon: "tabler:braces" })
                ]),
                t("span", yo, [
                  v[37] || (v[37] = t("span", { class: "node-title" }, "Output", -1)),
                  t("span", go, c(e.config.fields.length ? `${e.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [Qe, V.value]
            ])
          ])
        ])
      ], 8, Ts),
      A.value && r.value ? (n(), o("div", {
        key: 0,
        class: "scrim",
        onClick: v[13] || (v[13] = (S) => G(!1))
      })) : $("", !0),
      r.value ? z((n(), o("aside", {
        key: String(A.value),
        class: "side-panel",
        "aria-labelledby": p(I),
        role: A.value ? "dialog" : void 0,
        "aria-modal": A.value ? "true" : void 0,
        style: Fe(A.value ? void 0 : { width: `${a.value}px` }),
        onKeydown: v[22] || (v[22] = qe((S) => A.value && G(!1), ["esc"]))
      }, [
        A.value ? $("", !0) : (n(), o("div", {
          key: 0,
          class: Q(["resizer kx-focus-outline", { active: F.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": a.value,
          "aria-valuemin": He,
          onPointerdown: ve(C, ["prevent"]),
          onKeydown: T,
          onDblclick: v[14] || (v[14] = (S) => B(at))
        }, null, 42, $o)),
        t("header", xo, [
          t("span", wo, [
            f(p(M), { icon: Ot.value }, null, 8, ["icon"])
          ]),
          t("h2", { id: p(I) }, c(ut.value), 9, So),
          t("button", {
            ref_key: "closeButton",
            ref: H,
            type: "button",
            class: "kx-iconbtn kx-focus-outline push",
            "aria-label": A.value ? "Close panel" : "Collapse panel",
            title: A.value ? "Close panel" : "Collapse panel",
            onClick: v[15] || (v[15] = (S) => G(!1))
          }, [
            f(p(M), {
              icon: A.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ], 8, Vo)
        ]),
        t("div", {
          ref_key: "panelBody",
          ref: ye,
          class: "side-panel-body"
        }, [
          d.value.kind === "document" ? (n(), Y(Os, {
            key: 0,
            config: e.config,
            retention: e.retention,
            readonly: e.readonly
          }, null, 8, ["config", "retention", "readonly"])) : d.value.kind === "stage" ? (n(), Y(ks, {
            key: 1,
            stage: d.value.stage,
            config: e.config,
            readonly: e.readonly
          }, null, 8, ["stage", "config", "readonly"])) : d.value.kind === "field" && fe.value && y.value ? (n(), o(N, { key: 2 }, [
            t("p", Co, c(y.value.path), 1),
            f(Sa, {
              field: fe.value,
              shape: y.value.shape,
              depth: y.value.depth,
              "sibling-names": R.value,
              "other-names": Tt.value,
              groups: Wt.value,
              "deep-enabled": Pt.value,
              "map-enabled": Lt.value,
              readonly: e.readonly,
              onRemove: Yt,
              onAdd: v[16] || (v[16] = (S) => rt(y.value.field, y.value.trail)),
              onSelectItem: v[17] || (v[17] = (S) => re(y.value.field, [...y.value.trail, "item"]))
            }, null, 8, ["field", "shape", "depth", "sibling-names", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"]),
            !e.readonly && y.value.trail.at(-1) !== "item" ? (n(), o("fieldset", Eo, [
              t("label", null, [
                v[43] || (v[43] = E("Move to parent", -1)),
                z(t("select", {
                  "onUpdate:modelValue": v[18] || (v[18] = (S) => P.value = S),
                  "aria-label": "Move to parent"
                }, [
                  y.value.trail.length ? (n(), o("option", qo, "Top-level field")) : (n(), o("option", Fo, "Choose an object…")),
                  (n(!0), o(N, null, D(Ne.value, (S) => (n(), o("option", {
                    key: S.key,
                    value: S.key
                  }, c(S.path), 9, No))), 128))
                ], 512), [
                  [Ge, P.value]
                ])
              ]),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Move selected node",
                disabled: !P.value && !y.value.trail.length || !P.value && e.config.fields.length >= 100,
                onClick: Zt
              }, "Move", 8, Uo)
            ])) : $("", !0)
          ], 64)) : d.value.kind === "details" ? (n(), o("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: e.readonly
          }, [
            t("label", null, [
              v[44] || (v[44] = E("Name", -1)),
              z(t("input", {
                "onUpdate:modelValue": v[19] || (v[19] = (S) => l.value = S),
                "aria-label": "Extractor name"
              }, null, 512), [
                [Z, l.value]
              ])
            ]),
            t("label", null, [
              v[45] || (v[45] = E("Description", -1)),
              z(t("textarea", {
                "onUpdate:modelValue": v[20] || (v[20] = (S) => u.value = S),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [Z, u.value]
              ])
            ]),
            t("label", null, [
              v[46] || (v[46] = E("Tags", -1)),
              z(t("input", {
                "onUpdate:modelValue": v[21] || (v[21] = (S) => ct.value = S),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  Z,
                  ct.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              v[47] || (v[47] = t("small", null, "Comma separated", -1))
            ])
          ], 8, Mo)) : d.value.kind === "output" ? (n(), o("div", Ao, [
            v[48] || (v[48] = t("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            t("ul", Ro, [
              (n(!0), o(N, null, D(e.config.fields, (S) => (n(), o("li", {
                key: p(K)(S)
              }, [
                t("span", Bo, c(p(K)(S) || "New field"), 1),
                t("span", Oo, c(tl(S)), 1)
              ]))), 128))
            ]),
            v[49] || (v[49] = t("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : $("", !0)
        ], 512)
      ], 44, ko)), [
        [p(Ml), { disabled: !A.value }]
      ]) : A.value ? $("", !0) : (n(), o("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: v[23] || (v[23] = (S) => G(!0))
      }, [
        f(p(M), { icon: "tabler:layout-sidebar-right-expand" }),
        t("span", To, c(ut.value), 1)
      ]))
    ], 2));
  }
}), Lo = ["selected"], Do = {
  key: 1,
  role: "alert"
}, Io = {
  key: 2,
  class: "muted"
}, Mt = /* @__PURE__ */ W({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(e, { emit: s }) {
    const l = s, u = U(!1), d = U("");
    De(async () => {
      try {
        await _e("wc-multiselect", { timeoutMs: 8e3 }), u.value = !0;
      } catch (b) {
        d.value = String(b);
      }
    });
    function m(b) {
      const r = b.detail;
      l("select", r.selected[0] || "", r.labels?.[0] || "");
    }
    return (b, r) => u.value ? (n(), o("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(e.value ? [e.value] : []),
      placeholder: "Choose an upload",
      onChange: m
    }, null, 40, Lo)) : d.value ? (n(), o("p", Do, c(d.value), 1)) : (n(), o("span", Io, "Loading uploads…"));
  }
}), jo = ["data-error-kind"], zo = { key: 0 }, At = /* @__PURE__ */ W({
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
        E(" · " + c(e.error?.message), 1)
      ]),
      t("small", null, c(e.error?.retryable ? "Retryable" : "Not retryable"), 1),
      e.error?.details ? (n(), o("details", zo, [
        l[0] || (l[0] = t("summary", { class: "kx-focus-outline" }, "Error details", -1)),
        t("pre", null, c(JSON.stringify(e.error.details, null, 2)), 1)
      ])) : $("", !0)
    ], 8, jo));
  }
}), Wo = { class: "nested-value" }, Ho = { key: 0 }, Ko = {
  key: 0,
  class: "muted"
}, Go = { key: 1 }, Qo = { key: 2 }, Oe = /* @__PURE__ */ W({
  __name: "NestedValue",
  props: {
    value: {}
  },
  setup(e) {
    const s = e, l = q(() => s.value !== null && typeof s.value == "object" && !Array.isArray(s.value) ? s.value : null);
    return (u, d) => {
      const m = ot("NestedValue", !0);
      return n(), o("div", Wo, [
        Array.isArray(e.value) ? (n(), o("ol", Ho, [
          (n(!0), o(N, null, D(e.value, (b, r) => (n(), o("li", { key: r }, [
            f(m, { value: b }, null, 8, ["value"])
          ]))), 128)),
          e.value.length ? $("", !0) : (n(), o("li", Ko, "Empty list"))
        ])) : l.value ? (n(), o("dl", Go, [
          (n(!0), o(N, null, D(l.value, (b, r) => (n(), o(N, { key: r }, [
            t("dt", null, c(r), 1),
            t("dd", null, [
              f(m, { value: b }, null, 8, ["value"])
            ])
          ], 64))), 128))
        ])) : (n(), o("span", Qo, c(e.value === null || e.value === void 0 ? "—" : String(e.value)), 1))
      ]);
    };
  }
}), Jo = { class: "value-list" }, Yo = ["aria-expanded", "onClick"], Xo = { class: "value-name" }, Zo = { class: "bar" }, _o = ["title"], ei = { class: "evidence" }, ti = {
  key: 1,
  class: "muted"
}, li = {
  key: 2,
  class: "muted"
}, Rt = /* @__PURE__ */ W({
  __name: "ResultFields",
  props: {
    fields: {}
  },
  setup(e) {
    const s = e, l = q(() => Pe(s.fields.map((g) => g.path))), u = U(), d = (g) => `${Math.round(g * 100)}%`, m = (g) => g !== null && typeof g == "object", b = (g) => Array.isArray(g) ? `${g.length} items` : m(g) ? `${Object.keys(g).length} properties` : g == null ? "—" : String(g), r = (g) => g >= 0.9 ? "high" : g >= 0.7 ? "mid" : "low";
    return (g, V) => (n(), o("div", Jo, [
      f(Be, { node: l.value }, {
        default: me(({ index: h }) => [
          (n(!0), o(N, null, D([e.fields[h]], (a) => (n(), o("div", {
            key: a.path,
            class: "value-row"
          }, [
            t("button", {
              type: "button",
              class: "value-main",
              "aria-expanded": u.value === a.path,
              onClick: (i) => u.value = u.value === a.path ? void 0 : a.path
            }, [
              t("span", Xo, c(a.name), 1),
              t("span", {
                class: Q(["value-text", { missing: a.missing }])
              }, c(a.failed ? "Failed" : a.missing ? "Not in the document" : b(a.value)), 3),
              a.failed ? $("", !0) : (n(), o("span", {
                key: 0,
                class: Q(["confidence", r(a.confidence)])
              }, [
                t("span", Zo, [
                  t("span", {
                    style: Fe({ width: d(a.confidence) })
                  }, null, 4)
                ]),
                E(c(d(a.confidence)), 1),
                V[0] || (V[0] = t("span", { class: "conf-word" }, " confidence", -1))
              ], 2)),
              a.failed ? $("", !0) : (n(), o("span", {
                key: 1,
                class: Q(["chip", a.verified ? "primary" : "warn"]),
                title: a.reason
              }, [
                f(p(M), {
                  icon: a.verified ? "tabler:shield-check" : "tabler:shield-question"
                }, null, 8, ["icon"]),
                E(c(a.verified ? "Verified" : "Check"), 1)
              ], 10, _o)),
              f(p(M), {
                icon: u.value === a.path ? "tabler:chevron-up" : "tabler:chevron-down",
                class: "value-caret"
              }, null, 8, ["icon"])
            ], 8, Yo),
            !a.failed && !a.missing && m(a.value) ? (n(), Y(Oe, {
              key: 0,
              class: "structured-value",
              value: a.value
            }, null, 8, ["value"])) : $("", !0),
            a.failed ? (n(), Y(At, {
              key: 1,
              error: a.error
            }, null, 8, ["error"])) : $("", !0),
            z(t("div", ei, [
              !a.failed && !a.missing && !m(a.value) ? (n(), Y(Oe, {
                key: 0,
                value: a.value
              }, null, 8, ["value"])) : $("", !0),
              (n(!0), o(N, null, D(a.evidence, (i, B) => (n(), o("blockquote", {
                key: B,
                class: Q({ unfound: i.found === !1 })
              }, [
                t("p", null, "“" + c(i.quote) + "”", 1),
                t("cite", null, [
                  E(c(i.section), 1),
                  i.page !== void 0 && i.page !== null ? (n(), o(N, { key: 0 }, [
                    E(" · Page " + c(i.page), 1)
                  ], 64)) : $("", !0),
                  i.found === !1 ? (n(), o(N, { key: 1 }, [
                    E(" · not found word for word in the document")
                  ], 64)) : $("", !0)
                ])
              ], 2))), 128)),
              a.evidence.length ? $("", !0) : (n(), o("p", ti, "No evidence.")),
              a.reason ? (n(), o("p", li, c(a.reason), 1)) : $("", !0)
            ], 512), [
              [Qe, u.value === a.path && !a.failed]
            ])
          ]))), 128))
        ]),
        _: 1
      }, 8, ["node"])
    ]));
  }
}), ai = { class: "test" }, ni = { class: "run-bar" }, si = { class: "run-input" }, oi = { class: "muted run-note" }, ii = {
  key: 0,
  class: "empty"
}, ui = {
  key: 1,
  class: "run-failed",
  role: "alert"
}, di = {
  key: 2,
  class: "eval-warning",
  role: "status"
}, ri = {
  key: 3,
  class: "test-grid"
}, ci = { class: "block" }, vi = { class: "block-head" }, mi = { class: "muted push" }, pi = { class: "block" }, fi = { class: "timeline" }, bi = { class: "tl-icon" }, hi = { class: "tl-main" }, yi = { class: "tl-head" }, gi = { class: "muted push" }, ki = { class: "tl-bar" }, $i = { class: "muted" }, xi = {
  key: 0,
  class: "tl-msg"
}, wi = {
  key: 1,
  class: "chips"
}, Si = /* @__PURE__ */ W({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {},
    running: { type: Boolean },
    canRun: { type: Boolean }
  },
  emits: ["run"],
  setup(e, { emit: s }) {
    const l = e, u = s, d = U(""), m = (h) => `${(h / 1e3).toFixed(1)}s`, b = q(() => Math.max(1, ...l.result?.trace.map((h) => h.duration_ms) ?? [1])), r = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, g = (h) => r[h]?.label ?? ge[h] ?? h, V = (h) => r[h]?.icon ?? it[h] ?? "tabler:point";
    return (h, a) => (n(), o("div", ai, [
      t("section", ni, [
        t("div", si, [
          f(Mt, {
            value: d.value,
            onSelect: a[0] || (a[0] = (i) => d.value = i)
          }, null, 8, ["value"])
        ]),
        f(p(de), {
          label: e.running ? "Extracting…" : "Run extraction",
          loading: e.running,
          disabled: !d.value || e.running || !e.canRun,
          onClick: a[1] || (a[1] = (i) => u("run", d.value))
        }, null, 8, ["label", "loading", "disabled"]),
        t("p", oi, c(e.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + c(e.retention) + ".", 1)
      ]),
      e.result ? $("", !0) : (n(), o("p", ii, "No extraction results yet.")),
      e.result?.status === "failed" ? (n(), o("p", ui, [
        f(p(M), { icon: "tabler:alert-triangle" }),
        E("The run stopped: " + c(e.result.error), 1)
      ])) : $("", !0),
      e.result?.status === "partial" ? (n(), o("p", di, [
        f(p(M), { icon: "tabler:alert-triangle" }),
        a[2] || (a[2] = E("Partial result · Some fields failed. Successful values are available below.", -1))
      ])) : $("", !0),
      e.result ? (n(), o("div", ri, [
        t("section", ci, [
          t("header", vi, [
            a[3] || (a[3] = t("h2", { class: "block-title" }, "Values", -1)),
            t("span", mi, [
              E(c(e.result.tokens.toLocaleString()) + " tokens · " + c(m(e.result.duration_ms)), 1),
              e.result.pages ? (n(), o(N, { key: 0 }, [
                E(" · " + c(e.result.pages) + " pages", 1)
              ], 64)) : $("", !0)
            ])
          ]),
          f(Rt, {
            fields: e.result.fields
          }, null, 8, ["fields"])
        ]),
        t("section", pi, [
          a[4] || (a[4] = t("header", { class: "block-head" }, [
            t("h2", { class: "block-title" }, "Steps")
          ], -1)),
          t("ol", fi, [
            (n(!0), o(N, null, D(e.result.trace, (i, B) => (n(), o("li", {
              key: B,
              class: Q(i.status)
            }, [
              t("span", bi, [
                f(p(M), {
                  icon: V(i.kind)
                }, null, 8, ["icon"])
              ]),
              t("div", hi, [
                t("div", yi, [
                  t("strong", null, c(g(i.kind)), 1),
                  t("span", gi, c(m(i.duration_ms)), 1)
                ]),
                t("span", ki, [
                  t("span", {
                    style: Fe({ width: `${Math.max(4, i.duration_ms / b.value * 100)}%` })
                  }, null, 4)
                ]),
                t("p", $i, [
                  E(c(i.scope), 1),
                  i.model ? (n(), o(N, { key: 0 }, [
                    E(" · " + c(i.model), 1)
                  ], 64)) : $("", !0),
                  E(" · " + c((i.input_tokens + i.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                i.message ? (n(), o("p", xi, c(i.message), 1)) : $("", !0),
                i.queries?.length ? (n(), o("div", wi, [
                  (n(!0), o(N, null, D(i.queries, (F) => (n(), o("span", {
                    key: F,
                    class: "chip"
                  }, c(F), 1))), 128))
                ])) : $("", !0)
              ])
            ], 2))), 128))
          ])
        ])
      ])) : $("", !0)
    ]));
  }
}), Ke = (e) => e.status === "completed" || e.status === "partial" || e.status === "failed", Ce = (e) => e.metrics.length ? e.metrics.reduce((s, l) => s + l.accuracy, 0) / e.metrics.length : 0;
function Xe(e, s = /* @__PURE__ */ new Date()) {
  const l = new Date(e);
  return l.toDateString() === s.toDateString() ? l.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" }) : l.getFullYear() === s.getFullYear() ? l.toLocaleString(void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : l.toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
}
const Vi = { class: "evals" }, Ci = { class: "block eval-run" }, Ei = { class: "eval-run-main" }, qi = { class: "block-title" }, Fi = {
  key: 0,
  class: "eval-note"
}, Ni = {
  key: 0,
  class: "eval-progress",
  role: "status"
}, Ui = { class: "bar" }, Mi = { class: "muted" }, Ai = { class: "stat-row" }, Ri = { class: "stat" }, Bi = { class: "stat-label" }, Oi = { class: "stat-value" }, Ti = { class: "stat" }, Pi = { class: "stat-value" }, Li = { class: "stat-delta flat" }, Di = { class: "stat" }, Ii = { class: "stat-value" }, ji = {
  key: 0,
  class: "stat-delta flat"
}, zi = { class: "stat" }, Wi = { class: "stat-value" }, Hi = {
  key: 0,
  class: "stat-delta flat"
}, Ki = { class: "block" }, Gi = { class: "block-head" }, Qi = {
  key: 0,
  class: "compare-pick push"
}, Ji = ["value"], Yi = ["value"], Xi = {
  key: 0,
  class: "block-empty"
}, Zi = {
  key: 1,
  class: "table-scroll"
}, _i = { key: 0 }, eu = { key: 1 }, tu = { class: "mono" }, lu = { class: "acc strong" }, au = { class: "bar" }, nu = { class: "muted" }, su = {
  key: 0,
  class: "muted"
}, ou = { key: 1 }, iu = {
  key: 1,
  class: "muted"
}, uu = {
  key: 1,
  class: "block"
}, du = { class: "table-scroll" }, ru = { class: "metric-table result-matrix" }, cu = ["aria-expanded", "onClick"], vu = {
  key: 0,
  class: "badge",
  "data-status": "partial"
}, mu = ["colspan"], pu = {
  key: 0,
  class: "cell-state"
}, fu = ["data-error-kind", "title"], bu = ["data-label"], hu = ["title"], yu = {
  key: 0,
  class: "result-detail"
}, gu = ["colspan"], ku = ["data-error-kind", "title"], $u = { class: "mono" }, xu = { class: "cmp" }, wu = { class: "cmp" }, Su = { key: 0 }, Vu = { class: "muted case-meta" }, Cu = { class: "block" }, Eu = { class: "block-head" }, qu = { class: "count" }, Fu = { class: "mono" }, Nu = ["onUpdate:modelValue"], Uu = ["onUpdate:modelValue"], Mu = ["onUpdate:modelValue", "placeholder"], Au = ["onUpdate:modelValue", "type"], Ru = {
  key: 0,
  class: "error",
  role: "alert"
}, Bu = { class: "row" }, Ou = {
  key: 1,
  class: "block-empty"
}, Tu = {
  key: 2,
  class: "block-empty"
}, Pu = {
  key: 3,
  class: "table-scroll"
}, Lu = { class: "metric-table case-table" }, Du = { class: "case-value" }, Iu = {
  key: 1,
  class: "muted"
}, ju = { class: "num" }, zu = ["aria-label", "disabled", "onClick"], Wu = {
  key: 2,
  class: "block"
}, Hu = { class: "block-head" }, Ku = { class: "count" }, Gu = { class: "eval-history" }, Qu = ["aria-current", "onClick"], Ju = ["data-status"], Yu = { class: "muted" }, Xu = { class: "push" }, Zu = /* @__PURE__ */ W({
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
    const l = e, u = s, d = U(!1), m = U(""), b = U({}), r = U("");
    pe(() => l.addedCaseId, () => {
      d.value = !1, m.value = "", b.value = {};
    });
    function g(w, y) {
      return w.type === "number" ? Number(y) : w.type === "boolean" ? y === "true" : w.type === "list" || w.type === "object" ? JSON.parse(y) : y;
    }
    function V() {
      r.value = "";
      const w = {};
      try {
        for (const y of l.fields) {
          const x = String(b.value[K(y)] ?? "").trim();
          x && Ct(w, K(y), g(y, x));
        }
      } catch {
        r.value = 'Lists and objects need valid JSON, for example ["a","b"] or {"city":"Hamburg"}.';
        return;
      }
      u("add-case", { upload_id: m.value, expected: w });
    }
    const h = q(() => l.evaluations.find((w) => !Ke(w))), a = q(() => l.evaluations.filter(Ke)), i = q(() => l.evaluation), B = q(() => ({ done: (i.value?.results ?? []).filter((y) => y.status !== "queued").length, total: i.value?.case_count ?? 0 })), F = U();
    pe(() => i.value?.id, () => {
      F.value = void 0;
    });
    const C = q(() => {
      if (!i.value) return;
      if (F.value) return a.value.find((y) => y.id === F.value);
      const w = a.value.findIndex((y) => y.id === i.value.id);
      return w >= 0 ? a.value[w + 1] : a.value[0];
    }), T = q(() => (i.value?.metrics ?? []).map((w) => ({ ...w, before: C.value?.metrics.find((y) => y.field === w.field) }))), j = q(() => (i.value?.fields ?? []).map(K)), H = q(() => Pe(l.fields.map(K))), I = (w, y) => w.scores.find((x) => x.field === y), G = U(), L = (w) => `${Math.round(w * 100)}%`, O = (w) => {
      const y = Math.round(w * 100);
      return `${y > 0 ? "+" : y < 0 ? "−" : "±"}${Math.abs(y)} pts`;
    }, A = (w) => Math.round(w * 100) > 0 ? "up" : Math.round(w * 100) < 0 ? "down" : "flat", ue = (w) => w >= 6e4 ? `${Math.floor(w / 6e4)}m ${Math.round(w % 6e4 / 1e3)}s` : `${(w / 1e3).toFixed(1)}s`, ye = (w) => w == null || w === "" ? "—" : typeof w == "string" ? w : Array.isArray(w) && w.every((y) => typeof y != "object") ? w.join(", ") : JSON.stringify(w), te = (w) => w ? w.failed ? "fail" : w.score >= 0.999 ? "pass" : w.score > 0 ? "partial" : "fail" : "none", oe = (w) => (w.results ?? []).filter((y) => y.status === "completed").length, fe = { queued: "Queued", running: "Running", completed: "Completed", partial: "Partial", failed: "Failed" };
    return (w, y) => (n(), o("div", Vi, [
      t("section", Ci, [
        t("div", Ei, [
          t("div", null, [
            t("h2", qi, "Evaluate revision " + c(e.revision), 1),
            y[6] || (y[6] = t("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            e.changed ? (n(), o("p", Fi, [
              f(p(M), { icon: "tabler:info-circle" }),
              y[5] || (y[5] = E("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : $("", !0)
          ]),
          f(p(de), {
            label: h.value ? "Evaluating…" : "Run all cases",
            loading: e.starting || !!h.value,
            disabled: !e.cases.length || !e.fields.length || !!h.value || e.starting,
            onClick: y[0] || (y[0] = (x) => u("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        i.value && !p(Ke)(i.value) ? (n(), o("div", Ni, [
          t("span", Ui, [
            t("span", {
              style: Fe({ width: L(B.value.total ? B.value.done / B.value.total : 0) })
            }, null, 4)
          ]),
          t("span", Mi, c(fe[i.value.status]) + " · " + c(B.value.done) + " of " + c(B.value.total) + " cases", 1)
        ])) : $("", !0)
      ]),
      i.value && p(Ke)(i.value) ? (n(), o(N, { key: 0 }, [
        i.value.error ? (n(), o("p", {
          key: 0,
          class: Q(i.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          f(p(M), { icon: "tabler:alert-triangle" }),
          E(c(i.value.error), 1)
        ], 2)) : $("", !0),
        t("div", Ai, [
          t("div", Ri, [
            t("span", Bi, "Accuracy · revision " + c(i.value.config_revision), 1),
            t("span", Oi, c(L(p(Ce)(i.value))), 1),
            C.value ? (n(), o("span", {
              key: 0,
              class: Q(["stat-delta", A(p(Ce)(i.value) - p(Ce)(C.value))])
            }, c(O(p(Ce)(i.value) - p(Ce)(C.value))) + " vs revision " + c(C.value.config_revision), 3)) : $("", !0)
          ]),
          t("div", Ti, [
            y[7] || (y[7] = t("span", { class: "stat-label" }, "Cases", -1)),
            t("span", Pi, [
              E(c(oe(i.value)), 1),
              t("small", null, " / " + c(i.value.case_count), 1)
            ]),
            t("span", Li, c((i.value.results ?? []).filter((x) => x.status === "partial").length) + " partial · " + c((i.value.results ?? []).filter((x) => x.status === "failed").length) + " failed", 1)
          ]),
          t("div", Di, [
            y[8] || (y[8] = t("span", { class: "stat-label" }, "Tokens", -1)),
            t("span", Ii, c(i.value.tokens.toLocaleString()), 1),
            C.value ? (n(), o("span", ji, c(C.value.tokens.toLocaleString()) + " before", 1)) : $("", !0)
          ]),
          t("div", zi, [
            y[9] || (y[9] = t("span", { class: "stat-label" }, "Model time", -1)),
            t("span", Wi, c(ue(i.value.duration_ms)), 1),
            C.value ? (n(), o("span", Hi, c(ue(C.value.duration_ms)) + " before", 1)) : $("", !0)
          ])
        ]),
        t("section", Ki, [
          t("header", Gi, [
            y[11] || (y[11] = t("h2", { class: "block-title" }, "Field accuracy", -1)),
            a.value.length > 1 ? (n(), o("label", Qi, [
              y[10] || (y[10] = t("span", { class: "muted" }, "Compare with", -1)),
              t("select", {
                value: C.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: y[1] || (y[1] = (x) => F.value = x.target.value)
              }, [
                (n(!0), o(N, null, D(a.value.filter((x) => x.id !== i.value.id), (x) => (n(), o("option", {
                  key: x.id,
                  value: x.id
                }, "Revision " + c(x.config_revision) + " · " + c(p(Xe)(x.created_at)), 9, Yi))), 128))
              ], 40, Ji)
            ])) : $("", !0)
          ]),
          T.value.length ? (n(), o("div", Zi, [
            t("table", {
              class: Q(["metric-table accuracy-table", { comparing: !!C.value }])
            }, [
              t("thead", null, [
                t("tr", null, [
                  y[12] || (y[12] = t("th", null, "Field", -1)),
                  y[13] || (y[13] = t("th", null, "Accuracy", -1)),
                  y[14] || (y[14] = t("th", null, "Verified", -1)),
                  C.value ? (n(), o("th", _i, "Revision " + c(C.value.config_revision), 1)) : $("", !0),
                  C.value ? (n(), o("th", eu, "Change")) : $("", !0)
                ])
              ]),
              t("tbody", null, [
                (n(!0), o(N, null, D(T.value, (x) => (n(), o("tr", {
                  key: x.field
                }, [
                  t("td", tu, c(x.field), 1),
                  t("td", null, [
                    t("span", lu, [
                      t("span", au, [
                        t("span", {
                          style: Fe({ width: L(x.accuracy) })
                        }, null, 4)
                      ]),
                      E(c(L(x.accuracy)), 1)
                    ])
                  ]),
                  t("td", nu, c(L(x.verified)), 1),
                  C.value ? (n(), o("td", su, c(x.before ? L(x.before.accuracy) : "—"), 1)) : $("", !0),
                  C.value ? (n(), o("td", ou, [
                    x.before ? (n(), o("span", {
                      key: 0,
                      class: Q(["trend", A(x.accuracy - x.before.accuracy)])
                    }, [
                      f(p(M), {
                        icon: A(x.accuracy - x.before.accuracy) === "up" ? "tabler:trending-up" : A(x.accuracy - x.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      E(c(O(x.accuracy - x.before.accuracy)), 1)
                    ], 2)) : (n(), o("span", iu, "New field"))
                  ])) : $("", !0)
                ]))), 128))
              ])
            ], 2)
          ])) : (n(), o("p", Xi, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : $("", !0),
      i.value?.results?.length ? (n(), o("section", uu, [
        y[19] || (y[19] = t("header", { class: "block-head" }, [
          t("h2", { class: "block-title" }, "Results by case"),
          t("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        t("div", du, [
          t("table", ru, [
            t("thead", null, [
              t("tr", null, [
                y[15] || (y[15] = t("th", null, "Document", -1)),
                (n(!0), o(N, null, D(j.value, (x) => (n(), o("th", {
                  key: x,
                  class: "mono"
                }, c(x), 1))), 128))
              ])
            ]),
            t("tbody", null, [
              (n(!0), o(N, null, D(i.value.results, (x) => (n(), o(N, {
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
                      onClick: (R) => G.value = G.value === x.case_id ? void 0 : x.case_id
                    }, [
                      f(p(M), {
                        icon: G.value === x.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      E(c(x.upload_name), 1)
                    ], 8, cu),
                    x.status === "partial" ? (n(), o("span", vu, "Partial")) : $("", !0)
                  ]),
                  x.status === "queued" || x.status === "failed" ? (n(), o("td", {
                    key: 0,
                    colspan: j.value.length,
                    class: "muted"
                  }, [
                    x.status === "queued" ? (n(), o("span", pu, [
                      f(p(M), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      y[16] || (y[16] = E("Waiting", -1))
                    ])) : (n(), o("span", {
                      key: 1,
                      class: "cell-state fail",
                      "data-error-kind": x.error?.kind,
                      title: x.error?.kind
                    }, [
                      f(p(M), { icon: "tabler:alert-triangle" }),
                      E(c(x.error?.message), 1)
                    ], 8, fu))
                  ], 8, mu)) : (n(!0), o(N, { key: 1 }, D(j.value, (R) => (n(), o("td", {
                    key: R,
                    "data-label": R
                  }, [
                    t("span", {
                      class: Q(["cell", te(I(x, R))]),
                      title: ye(I(x, R)?.value)
                    }, c(I(x, R)?.failed ? "Failed" : I(x, R) ? L(I(x, R).score) : "—"), 11, hu)
                  ], 8, bu))), 128))
                ], 2),
                G.value === x.case_id ? (n(), o("tr", yu, [
                  t("td", {
                    colspan: j.value.length + 1
                  }, [
                    x.error ? (n(), o("p", {
                      key: 0,
                      class: "muted",
                      "data-error-kind": x.error.kind,
                      title: x.error.kind
                    }, c(x.error.message), 9, ku)) : $("", !0),
                    f(Be, {
                      node: p(Pe)(x.scores.map((R) => R.field))
                    }, {
                      default: me(({ index: R }) => [
                        (n(!0), o(N, null, D([x.scores[R]], (P) => (n(), o("dl", {
                          key: P.field,
                          class: "compare"
                        }, [
                          t("dt", $u, c(P.field.split(".").at(-1)), 1),
                          t("dd", null, [
                            t("span", {
                              class: Q(["cell", te(P)])
                            }, c(P.failed ? "Failed" : L(P.score)), 3),
                            t("div", xu, [
                              y[17] || (y[17] = t("span", { class: "cmp-label" }, "Expected", -1)),
                              f(Oe, {
                                value: P.expected
                              }, null, 8, ["value"])
                            ]),
                            t("div", wu, [
                              y[18] || (y[18] = t("span", { class: "cmp-label" }, "Extracted", -1)),
                              P.failed ? (n(), Y(At, {
                                key: 0,
                                error: P.error
                              }, null, 8, ["error"])) : (n(), Y(Oe, {
                                key: 1,
                                value: P.value
                              }, null, 8, ["value"]))
                            ]),
                            P.failed ? $("", !0) : (n(), o("span", Su, [
                              t("span", {
                                class: Q(["chip", P.verified ? "primary" : "warn"])
                              }, [
                                f(p(M), {
                                  icon: P.verified ? "tabler:shield-check" : "tabler:shield-question"
                                }, null, 8, ["icon"]),
                                E(c(P.verified ? "Verified" : "Unverified"), 1)
                              ], 2)
                            ]))
                          ])
                        ]))), 128))
                      ]),
                      _: 2
                    }, 1032, ["node"]),
                    t("p", Vu, c(x.tokens.toLocaleString()) + " tokens · " + c(ue(x.duration_ms)), 1)
                  ], 8, gu)
                ])) : $("", !0)
              ], 64))), 128))
            ])
          ])
        ])
      ])) : $("", !0),
      t("section", Cu, [
        t("header", Eu, [
          y[20] || (y[20] = t("h2", { class: "block-title" }, "Cases", -1)),
          t("span", qu, c(e.cases.length), 1),
          f(p(de), {
            label: "Add case",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: !e.fields.length,
            onClick: y[2] || (y[2] = (x) => d.value = !d.value)
          }, null, 8, ["disabled"])
        ]),
        d.value ? (n(), o("form", {
          key: 0,
          class: "case-form",
          onSubmit: ve(V, ["prevent"])
        }, [
          t("label", null, [
            y[21] || (y[21] = E("Document", -1)),
            f(Mt, {
              value: m.value,
              onSelect: y[3] || (y[3] = (x) => {
                m.value = x;
              })
            }, null, 8, ["value"])
          ]),
          y[24] || (y[24] = t("p", { class: "muted" }, "Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.", -1)),
          f(Be, { node: H.value }, {
            default: me(({ index: x }) => [
              (n(!0), o(N, null, D([e.fields[x]], (R) => (n(), o("label", {
                key: p(K)(R)
              }, [
                t("span", Fu, c(R.name), 1),
                R.type === "boolean" ? z((n(), o("select", {
                  key: 0,
                  "onUpdate:modelValue": (P) => b.value[p(K)(R)] = P
                }, [...y[22] || (y[22] = [
                  t("option", { value: "" }, "Not stated", -1),
                  t("option", { value: "true" }, "Yes", -1),
                  t("option", { value: "false" }, "No", -1)
                ])], 8, Nu)), [
                  [Ge, b.value[p(K)(R)]]
                ]) : R.type === "enum" ? z((n(), o("select", {
                  key: 1,
                  "onUpdate:modelValue": (P) => b.value[p(K)(R)] = P
                }, [
                  y[23] || (y[23] = t("option", { value: "" }, "Not stated", -1)),
                  (n(!0), o(N, null, D(R.enum_values, (P) => (n(), o("option", { key: P }, c(P), 1))), 128))
                ], 8, Uu)), [
                  [Ge, b.value[p(K)(R)]]
                ]) : R.type === "object" || R.type === "list" ? z((n(), o("textarea", {
                  key: 2,
                  "onUpdate:modelValue": (P) => b.value[p(K)(R)] = P,
                  rows: "2",
                  placeholder: R.type === "list" ? '["first", "second"]' : '{"key": "value"}'
                }, null, 8, Mu)), [
                  [Z, b.value[p(K)(R)]]
                ]) : z((n(), o("input", {
                  key: 3,
                  "onUpdate:modelValue": (P) => b.value[p(K)(R)] = P,
                  type: R.type === "number" ? "number" : R.type === "date" ? "date" : "text",
                  placeholder: "Not stated"
                }, null, 8, Au)), [
                  [sl, b.value[p(K)(R)]]
                ])
              ]))), 128))
            ]),
            _: 1
          }, 8, ["node"]),
          r.value ? (n(), o("p", Ru, c(r.value), 1)) : $("", !0),
          t("div", Bu, [
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
              onClick: y[4] || (y[4] = (x) => d.value = !1)
            })
          ])
        ], 32)) : $("", !0),
        e.fields.length ? !e.cases.length && !d.value ? (n(), o("p", Tu, "No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.")) : e.cases.length ? (n(), o("div", Pu, [
          t("table", Lu, [
            y[25] || (y[25] = t("thead", null, [
              t("tr", null, [
                t("th", null, "Document"),
                t("th", null, "Expected values"),
                t("th")
              ])
            ], -1)),
            t("tbody", null, [
              (n(!0), o(N, null, D(e.cases, (x) => (n(), o("tr", {
                key: x.id
              }, [
                t("td", null, [
                  f(p(M), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  E(" " + c(x.upload_name), 1)
                ]),
                t("td", null, [
                  f(Be, { node: H.value }, {
                    default: me(({ index: R }) => [
                      t("div", Du, [
                        t("strong", null, c(e.fields[R].name), 1),
                        p(ht)(x.expected, p(K)(e.fields[R])) !== void 0 ? (n(), Y(Oe, {
                          key: 0,
                          value: p(ht)(x.expected, p(K)(e.fields[R]))
                        }, null, 8, ["value"])) : (n(), o("span", Iu, "Not stated"))
                      ])
                    ]),
                    _: 2
                  }, 1032, ["node"])
                ]),
                t("td", ju, [
                  t("button", {
                    type: "button",
                    class: "kx-iconbtn kx-focus-outline",
                    "aria-label": `Remove case ${x.upload_name}`,
                    disabled: e.saving,
                    onClick: (R) => u("delete-case", x.id)
                  }, [
                    f(p(M), { icon: "tabler:trash" })
                  ], 8, zu)
                ])
              ]))), 128))
            ])
          ])
        ])) : $("", !0) : (n(), o("p", Ou, "Add a field in the Builder, then add documents with the values you expect."))
      ]),
      e.evaluations.length ? (n(), o("section", Wu, [
        t("header", Hu, [
          y[26] || (y[26] = t("h2", { class: "block-title" }, "History", -1)),
          t("span", Ku, c(e.evaluations.length), 1)
        ]),
        t("ul", Gu, [
          (n(!0), o(N, null, D(e.evaluations, (x) => (n(), o("li", {
            key: x.id
          }, [
            t("button", {
              type: "button",
              class: Q({ active: i.value?.id === x.id }),
              "aria-current": i.value?.id === x.id,
              onClick: (R) => u("open", x.id)
            }, [
              t("span", {
                class: "badge",
                "data-status": x.status
              }, c(fe[x.status]), 9, Ju),
              t("span", null, "Revision " + c(x.config_revision), 1),
              t("span", Yu, c(p(Xe)(x.created_at)), 1),
              t("strong", Xu, c(x.status === "completed" || x.status === "partial" ? L(p(Ce)(x)) : "—"), 1)
            ], 10, Qu)
          ]))), 128))
        ])
      ])) : $("", !0)
    ]));
  }
}), _u = { class: "section-head" }, ed = { class: "muted" }, td = {
  key: 0,
  class: "empty"
}, ld = {
  key: 1,
  class: "table-scroll"
}, ad = { class: "metric-table runs-table" }, nd = ["aria-label", "aria-expanded", "onClick"], sd = { class: "caller" }, od = ["data-status"], id = {
  class: "num",
  "data-label": "Time"
}, ud = {
  class: "num",
  "data-label": "Tokens"
}, dd = {
  class: "muted",
  "data-label": "Expires"
}, rd = {
  key: 0,
  class: "result-detail"
}, cd = { colspan: "6" }, vd = /* @__PURE__ */ W({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(e) {
    const s = U(), l = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (u, d) => (n(), o(N, null, [
      t("div", _u, [
        d[0] || (d[0] = t("h2", null, "Recent runs", -1)),
        t("span", ed, "Runs expire after " + c(e.retention), 1)
      ]),
      e.runs.length ? (n(), o("div", ld, [
        t("table", ad, [
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
            (n(!0), o(N, null, D(e.runs, (m) => (n(), o(N, {
              key: m.id
            }, [
              t("tr", null, [
                t("td", null, [
                  t("button", {
                    type: "button",
                    class: "case-toggle",
                    "aria-label": `Show values for run ${m.id}`,
                    "aria-expanded": s.value === m.id,
                    onClick: (b) => s.value = s.value === m.id ? void 0 : m.id
                  }, [
                    f(p(M), {
                      icon: s.value === m.id ? "tabler:chevron-down" : "tabler:chevron-right"
                    }, null, 8, ["icon"]),
                    E(c(p(Xe)(m.created_at)), 1)
                  ], 8, nd)
                ]),
                t("td", null, [
                  t("span", sd, [
                    f(p(M), {
                      icon: l[m.caller].icon
                    }, null, 8, ["icon"]),
                    E(c(l[m.caller].label), 1)
                  ])
                ]),
                t("td", null, [
                  t("span", {
                    class: "badge",
                    "data-status": m.status
                  }, c(m.status === "completed" ? "Completed" : m.status === "partial" ? "Partial" : "Failed"), 9, od)
                ]),
                t("td", id, c((m.duration_ms / 1e3).toFixed(1)) + "s", 1),
                t("td", ud, c(Number(m.tokens).toLocaleString()), 1),
                t("td", dd, c(p(Xe)(m.expires_at)), 1)
              ]),
              s.value === m.id ? (n(), o("tr", rd, [
                t("td", cd, [
                  f(Rt, {
                    fields: m.result.fields
                  }, null, 8, ["fields"])
                ])
              ])) : $("", !0)
            ], 64))), 128))
          ])
        ])
      ])) : (n(), o("p", td, "No runs yet. Runs from the Test tab, agents, evaluations and Workflows appear here."))
    ], 64));
  }
}), md = {
  key: 0,
  role: "alert",
  class: "error banner"
}, pd = /* @__PURE__ */ W({
  __name: "SharePopup",
  props: {
    id: {},
    title: {}
  },
  emits: ["close"],
  setup(e, { emit: s }) {
    const l = e, u = s, d = U(), m = U("");
    return De(async () => {
      try {
        await _e("kickside-share", { timeoutMs: 8e3 });
      } catch (g) {
        m.value = `Sharing is unavailable: ${g instanceof Error ? g.message : String(g)}`;
        return;
      }
      const b = document.createElement("kickside-share"), r = encodeURIComponent(l.id);
      b.setAttribute("config", JSON.stringify({ resource_id: l.id, title: l.title, access_url: `/api/v1/component-access/grants/${r}`, share_url: `/api/v1/component-access/share/${r}` })), b.style.display = "block", b.addEventListener("close", () => u("close")), d.value?.appendChild(b);
    }), (b, r) => (n(), o("div", {
      ref_key: "host",
      ref: d
    }, [
      m.value ? (n(), o("p", md, c(m.value), 1)) : $("", !0)
    ], 512));
  }
}), fd = { class: "docscout" }, bd = { class: "toolbar" }, hd = { class: "toolbar-lead" }, yd = { class: "crumb-row" }, gd = { class: "crumb" }, kd = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, $d = ["id", "aria-selected", "aria-controls", "onClick"], xd = { class: "toolbar-side" }, wd = { class: "stats" }, Sd = ["title"], Vd = {
  key: 2,
  class: "unsaved"
}, Cd = {
  key: 0,
  class: "banner row wrap",
  role: "status"
}, Ed = {
  key: 1,
  role: "alert",
  class: "error banner"
}, qd = {
  key: 3,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, Fd = ["id", "aria-labelledby"], Nd = /* @__PURE__ */ W({
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
    const l = e, u = s, d = U(), m = U(!1), b = U("Builder"), r = U(yt()), g = U(""), V = U(""), h = q(() => l.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    pe(b, () => {
      d.value && (d.value.scrollTop = 0);
    }, { flush: "post" });
    const a = U(), i = U(), B = q(() => l.snapshot.can_edit && a.value !== l.snapshot.expected_revision), F = q(() => B.value && i.value !== l.snapshot.expected_revision);
    function C(L) {
      return g.value === L.title && V.value === (L.description ?? "") && Vl(r.value, L.config);
    }
    function T() {
      const L = l.snapshot;
      r.value = structuredClone(pt(L.config ?? yt())), g.value = L.title, V.value = L.description ?? "", a.value = L.expected_revision, i.value = void 0;
    }
    pe(() => l.snapshot, (L, O) => {
      h.value.includes(b.value) || (b.value = h.value[0]), !(O && L.id === O.id && L.can_edit && O.can_edit && !C(O) && !C(L)) && T();
    }, { immediate: !0 });
    const j = q(() => l.snapshot.can_edit && !C(l.snapshot)), H = q(() => Sl(r.value)), I = q(() => Object.keys(ge).filter((L) => Je(r.value, L)).length);
    function G() {
      u("save", { title: g.value, description: V.value, config: structuredClone(pt(r.value)), expected_revision: a.value });
    }
    return (L, O) => (n(), o("main", fd, [
      t("div", bd, [
        t("div", hd, [
          t("span", yd, [
            e.back ? (n(), o("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: O[0] || (O[0] = (A) => u("back"))
            }, [
              f(p(M), { icon: "tabler:arrow-left" })
            ])) : $("", !0),
            t("span", gd, c(e.snapshot.title), 1)
          ]),
          t("nav", kd, [
            (n(!0), o(N, null, D(h.value, (A) => (n(), o("button", {
              id: `tab-${A}`,
              key: A,
              role: "tab",
              "aria-selected": b.value === A,
              "aria-controls": `panel-${A}`,
              onClick: (ue) => b.value = A
            }, c(A), 9, $d))), 128))
          ])
        ]),
        t("div", xd, [
          e.snapshot.can_share ? (n(), Y(p(de), {
            key: 0,
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-label": "Share",
            onClick: O[1] || (O[1] = (A) => m.value = !0)
          }, {
            default: me(() => [
              f(p(M), { icon: "tabler:share" }),
              O[11] || (O[11] = t("span", { class: "btn-label" }, "Share", -1))
            ]),
            _: 1
          })) : $("", !0),
          t("span", wd, [
            E(c(e.snapshot.field_count) + " " + c(e.snapshot.field_count === 1 ? "field" : "fields"), 1),
            e.snapshot.can_edit ? (n(), o(N, { key: 0 }, [
              E(" · " + c(I.value) + " steps · revision " + c(e.snapshot.expected_revision), 1)
            ], 64)) : (n(), o(N, { key: 1 }, [
              E(" · Read access")
            ], 64))
          ]),
          e.snapshot.can_edit ? (n(), o(N, { key: 1 }, [
            B.value && !F.value ? (n(), Y(p(de), {
              key: 0,
              label: "Reload saved",
              severity: "secondary",
              size: "small",
              onClick: T
            })) : $("", !0),
            H.value ? (n(), o("span", {
              key: 1,
              class: "invalid",
              role: "alert",
              title: H.value
            }, [
              f(p(M), { icon: "tabler:alert-circle" }),
              E(c(H.value), 1)
            ], 8, Sd)) : j.value ? (n(), o("span", Vd, "Unsaved")) : $("", !0),
            f(p(de), {
              label: "Save",
              size: "small",
              loading: e.saving,
              disabled: !j.value || !!H.value || !g.value.trim(),
              onClick: G
            }, null, 8, ["loading", "disabled"])
          ], 64)) : $("", !0)
        ])
      ]),
      F.value ? (n(), o("div", Cd, [
        t("span", null, "Saved configuration changed to revision " + c(e.snapshot.expected_revision) + ". Your edits are kept.", 1),
        f(p(de), {
          label: "Reload saved",
          severity: "secondary",
          size: "small",
          onClick: T
        }),
        f(p(de), {
          label: "Keep editing",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: O[2] || (O[2] = (A) => i.value = e.snapshot.expected_revision)
        })
      ])) : $("", !0),
      e.error ? (n(), o("p", Ed, c(e.error), 1)) : $("", !0),
      m.value ? (n(), Y(pd, {
        key: 2,
        id: e.snapshot.id,
        title: e.snapshot.title,
        onClose: O[3] || (O[3] = (A) => m.value = !1)
      }, null, 8, ["id", "title"])) : $("", !0),
      b.value === "Builder" && e.snapshot.can_edit ? (n(), o("div", qd, [
        f(Po, {
          title: g.value,
          "onUpdate:title": O[4] || (O[4] = (A) => g.value = A),
          description: V.value,
          "onUpdate:description": O[5] || (O[5] = (A) => V.value = A),
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
          id: `panel-${b.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${b.value}`,
          class: "panel"
        }, [
          b.value === "Test" ? (n(), Y(Si, {
            key: 0,
            result: e.result,
            retention: e.snapshot.retention,
            running: e.running,
            "can-run": e.snapshot.field_count > 0,
            onRun: O[6] || (O[6] = (A) => u("run", A))
          }, null, 8, ["result", "retention", "running", "can-run"])) : $("", !0),
          b.value === "Evals" && e.snapshot.can_edit ? (n(), Y(Zu, {
            key: 1,
            cases: e.snapshot.cases,
            "added-case-id": e.addedCaseId,
            fields: e.snapshot.config.fields,
            evaluations: e.evaluations,
            evaluation: e.evaluation,
            revision: e.snapshot.expected_revision,
            changed: j.value,
            saving: e.saving,
            starting: e.starting,
            onAddCase: O[7] || (O[7] = (A) => u("add-case", A)),
            onDeleteCase: O[8] || (O[8] = (A) => u("delete-case", A)),
            onEvaluate: O[9] || (O[9] = (A) => u("evaluate")),
            onOpen: O[10] || (O[10] = (A) => u("open-evaluation", A))
          }, null, 8, ["cases", "added-case-id", "fields", "evaluations", "evaluation", "revision", "changed", "saving", "starting"])) : $("", !0),
          b.value === "Runs" ? (n(), Y(vd, {
            key: 2,
            runs: e.snapshot.runs,
            retention: e.snapshot.retention
          }, null, 8, ["runs", "retention"])) : $("", !0)
        ], 8, Fd)
      ], 512))
    ]));
  }
}), Ud = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, Md = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, Td = /* @__PURE__ */ W({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(e, { emit: s }) {
    const l = e, u = s, d = U(), m = U(""), b = U(!1), r = U(!1), g = U(!1), V = U(), h = U(null), a = U([]), i = U();
    let B = [], F = 0, C = 0, T = 0, j;
    const H = (w) => w instanceof Error ? w.message : String(w), I = (w) => w === F;
    async function G(w, y) {
      const x = ++T;
      y && (j = y);
      const R = () => I(w) && x === T;
      try {
        const P = l.id, Ne = await he.evaluations(P);
        if (!R()) return;
        a.value = Ne;
        const be = j ?? Ne[0]?.id;
        if (be) {
          const Ie = await he.evaluation(P, be);
          if (!R() || Ie.id !== (j ?? be)) return;
          i.value = Ie;
        }
      } catch (P) {
        R() && (m.value = H(P));
      }
    }
    async function L(w) {
      const y = ++C, x = () => I(w) && y === C;
      if (!l.id) {
        m.value = "No extractor selected.";
        return;
      }
      try {
        const R = await he.get(l.id);
        if (!x()) return;
        d.value = R, m.value = "", R.can_edit && await G(w);
      } catch (R) {
        x() && (m.value = H(R));
      }
    }
    pe(() => l.id, (w, y) => {
      F++, j = void 0, B.forEach((R) => R()), B = [], V.value = void 0, d.value = void 0, h.value = null, a.value = [], i.value = void 0, m.value = "";
      const x = F;
      l.id && (B = [gt(`component.${l.id}`, () => L(x)), gt(`docscout.runs.${l.id}`, () => L(x))]), y !== void 0 && L(x);
    }, { immediate: !0 }), Cl(() => L(F)), wt(() => {
      F++, B.forEach((w) => w());
    });
    async function O(w) {
      const y = F;
      b.value = !0, m.value = "";
      try {
        const x = await w();
        if (I(y))
          return await L(y), x;
      } catch (x) {
        I(y) && (m.value = H(x));
      } finally {
        b.value = !1;
      }
    }
    const A = (w) => O(() => he.update(l.id, w));
    async function ue(w) {
      const y = F, x = await O(() => he.addCase(l.id, w));
      x && I(y) && (V.value = x.id);
    }
    const ye = (w) => O(() => he.deleteCase(l.id, w));
    async function te(w) {
      const y = F;
      r.value = !0, m.value = "";
      try {
        const x = await he.run(l.id, w);
        I(y) && (h.value = x, await L(y));
      } catch (x) {
        I(y) && (m.value = H(x));
      } finally {
        r.value = !1;
      }
    }
    async function oe() {
      const w = F;
      g.value = !0, m.value = "";
      try {
        const { eval_id: y } = await he.evaluate(l.id);
        I(w) && await G(w, y);
      } catch (y) {
        I(w) && (m.value = H(y));
      } finally {
        g.value = !1;
      }
    }
    function fe(w) {
      G(F, w);
    }
    return (w, y) => d.value ? (n(), Y(Nd, {
      key: 0,
      snapshot: d.value,
      "added-case-id": V.value,
      saving: b.value,
      running: r.value,
      starting: g.value,
      result: h.value,
      evaluations: a.value,
      evaluation: i.value,
      error: m.value,
      back: e.back,
      onBack: y[0] || (y[0] = (x) => u("back")),
      onRun: te,
      onSave: A,
      onAddCase: ue,
      onDeleteCase: ye,
      onEvaluate: oe,
      onOpenEvaluation: fe
    }, null, 8, ["snapshot", "added-case-id", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : m.value ? (n(), o("p", Ud, c(m.value), 1)) : (n(), o("p", Md, "Loading Docscout…"));
  }
});
export {
  Td as _,
  Xe as w
};
