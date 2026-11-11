import { defineComponent as W, useModel as Le, openBlock as a, createElementBlock as o, withModifiers as ve, createElementVNode as t, mergeModels as Xe, computed as F, withKeys as Ee, unref as m, normalizeClass as Q, createVNode as f, toDisplayString as c, Fragment as M, renderList as I, createCommentVNode as $, createTextVNode as U, createBlock as J, ref as N, useId as pe, watch as fe, withDirectives as z, vModelText as Z, vModelSelect as Ge, resolveComponent as st, renderSlot as je, withCtx as me, mergeProps as bt, vShow as Ke, onMounted as Ue, nextTick as Ce, normalizeStyle as qe, onBeforeUnmount as Et, vModelDynamic as rl, toRaw as ht } from "vue";
import { B as cl, L as vl, j as ze, v as Me, k as ml, U as pl, I as gt, f as fl, i as Qe, l as qt, t as lt, h as $e, o as ot, p as bl, m as Ut, q as G, M as Ae, r as Ft, w as Nt, x as at, y as hl, z as gl, A as yl, C as kl, D as $l, E as Mt, F as xl, G as At, H as wl, J as Sl, K as Vl, N as yt, O as kt, P as Cl, Q as et, R as El, S as Oe, T as ql, s as de, V as $t, n as xt, W as Ul, X as Fl, b as Nl, c as ge } from "./index-DMYH2NOT.js";
import { loadByTagName as Ze, on as wt } from "@wippy-fe/proxy";
import { Icon as A } from "@iconify/vue";
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
function St(e, s) {
  var l = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    s && (u = u.filter(function(d) {
      return Object.getOwnPropertyDescriptor(e, d).enumerable;
    })), l.push.apply(l, u);
  }
  return l;
}
function Vt(e) {
  for (var s = 1; s < arguments.length; s++) {
    var l = arguments[s] != null ? arguments[s] : {};
    s % 2 ? St(Object(l), !0).forEach(function(u) {
      Rl(e, u, l[u]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(l)) : St(Object(l)).forEach(function(u) {
      Object.defineProperty(e, u, Object.getOwnPropertyDescriptor(l, u));
    });
  }
  return e;
}
function Rl(e, s, l) {
  return (s = Bl(s)) in e ? Object.defineProperty(e, s, { value: l, enumerable: !0, configurable: !0, writable: !0 }) : e[s] = l, e;
}
function Bl(e) {
  var s = Ll(e, "string");
  return Pe(s) == "symbol" ? s : s + "";
}
function Ll(e, s) {
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
      var u = this, d = l.value || {}, p = d.onFocusIn, y = d.onFocusOut;
      s.$_pfocustrap_mutationobserver = new MutationObserver(function(r) {
        r.forEach(function(g) {
          if (g.type === "childList" && !s.contains(document.activeElement)) {
            var S = function(i) {
              var n = gt(i) ? gt(i, u.getComputedSelector(s.$_pfocustrap_focusableselector)) ? i : Me(s, u.getComputedSelector(s.$_pfocustrap_focusableselector)) : Me(i);
              return fl(n) ? n : i.nextSibling && S(i.nextSibling);
            };
            ze(S(g.nextSibling));
          }
        });
      }), s.$_pfocustrap_mutationobserver.disconnect(), s.$_pfocustrap_mutationobserver.observe(s, {
        childList: !0
      }), s.$_pfocustrap_focusinlistener = function(r) {
        return p && p(r);
      }, s.$_pfocustrap_focusoutlistener = function(r) {
        return y && y(r);
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
      var u = l.value || {}, d = u.autoFocusSelector, p = d === void 0 ? "" : d, y = u.firstFocusableSelector, r = y === void 0 ? "" : y, g = u.autoFocus, S = g === void 0 ? !1 : g, E = Me(s, "[autofocus]".concat(this.getComputedSelector(p)));
      S && !E && (E = Me(s, this.getComputedSelector(r))), ze(E);
    },
    onFirstHiddenElementFocus: function(s) {
      var l, u = s.currentTarget, d = s.relatedTarget, p = d === u.$_pfocustrap_lasthiddenfocusableelement || !((l = this.$el) !== null && l !== void 0 && l.contains(d)) ? Me(u.parentElement, this.getComputedSelector(u.$_pfocustrap_focusableselector)) : u.$_pfocustrap_lasthiddenfocusableelement;
      ze(p);
    },
    onLastHiddenElementFocus: function(s) {
      var l, u = s.currentTarget, d = s.relatedTarget, p = d === u.$_pfocustrap_firsthiddenfocusableelement || !((l = this.$el) !== null && l !== void 0 && l.contains(d)) ? vl(u.parentElement, this.getComputedSelector(u.$_pfocustrap_focusableselector)) : u.$_pfocustrap_firsthiddenfocusableelement;
      ze(p);
    },
    createHiddenFocusableElements: function(s, l) {
      var u = this, d = l.value || {}, p = d.tabIndex, y = p === void 0 ? 0 : p, r = d.firstFocusableSelector, g = r === void 0 ? "" : r, S = d.lastFocusableSelector, E = S === void 0 ? "" : S, i = function(w) {
        return pl("span", {
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
const Pl = ["aria-checked", "aria-label", "disabled"], te = /* @__PURE__ */ W({
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
    ])], 8, Pl));
  }
}), Tl = ["aria-label"], Dl = { class: "node-icon" }, Il = { class: "node-main" }, jl = { class: "node-title" }, zl = { class: "node-summary" }, Wl = {
  key: 0,
  class: "chips"
}, Hl = {
  key: 1,
  class: "trace-line"
}, Gl = { class: "node-side" }, Kl = {
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
    const l = e, u = s, d = F(() => Qe(l.config, l.stage)), p = F(() => l.config.stages[l.stage].model), y = F({ get: () => d.value, set: (S) => {
      l.config.stages[l.stage].enabled = S;
    } }), r = F(() => {
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
          return qt(S).map((i) => ({ text: `${i.name} · ${i.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), g = (S) => [`${(S.duration_ms / 1e3).toFixed(1)}s`, `${(S.input_tokens + S.output_tokens).toLocaleString()} tokens`, S.queries?.length ? `${S.queries.length} queries` : "", S.message ?? ""].filter(Boolean).join(" · ");
    return (S, E) => (a(), o("div", {
      class: Q(["node kx-focus-halo", { active: e.active, off: !d.value, fixed: e.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": m($e)[e.stage],
      onClick: E[1] || (E[1] = (i) => u("select")),
      onKeydown: [
        E[2] || (E[2] = Ee((i) => u("select"), ["enter"])),
        E[3] || (E[3] = Ee(ve((i) => u("select"), ["prevent"]), ["space"]))
      ]
    }, [
      t("span", Dl, [
        f(m(A), {
          icon: m(ot)[e.stage]
        }, null, 8, ["icon"])
      ]),
      t("span", Il, [
        t("span", jl, c(m($e)[e.stage]), 1),
        t("span", zl, c(d.value ? m(bl)(e.stage, e.config) : "Off"), 1),
        d.value && r.value.length ? (a(), o("span", Wl, [
          (a(!0), o(M, null, I(r.value, (i) => (a(), o("span", {
            key: i.text,
            class: Q(["chip", { primary: i.tone === "primary", "muted-chip": i.tone === "hint" }])
          }, c(i.text), 3))), 128))
        ])) : $("", !0),
        e.trace ? (a(), o("span", Hl, [
          f(m(A), {
            icon: e.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          U(c(g(e.trace)), 1)
        ])) : $("", !0)
      ]),
      t("span", Gl, [
        d.value && p.value ? (a(), o("span", Kl, c(m(Ut)(p.value)), 1)) : $("", !0),
        e.stage !== "extract" && !e.readonly ? (a(), J(te, {
          key: 1,
          modelValue: y.value,
          "onUpdate:modelValue": E[0] || (E[0] = (i) => y.value = i),
          label: `Enable ${m($e)[e.stage]}`
        }, null, 8, ["modelValue", "label"])) : $("", !0)
      ])
    ], 42, Tl));
  }
}), Ql = ["aria-labelledby"], Jl = ["aria-label", "aria-checked", "tabindex", "disabled", "onClick", "onKeydown"], ye = /* @__PURE__ */ W({
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
    const s = e, l = Le(e, "modelValue"), u = N([]);
    function d(p, y) {
      const r = s.options.length - 1, g = { ArrowRight: y + 1, ArrowDown: y + 1, ArrowLeft: y - 1, ArrowUp: y - 1, Home: 0, End: r }[p.key];
      if (g === void 0) return;
      p.preventDefault();
      const S = (g + s.options.length) % s.options.length;
      l.value = s.options[S].value, u.value[S]?.focus();
    }
    return (p, y) => (a(), o("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": e.labelledBy
    }, [
      (a(!0), o(M, null, I(e.options, (r, g) => (a(), o("button", {
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
        r.icon ? (a(), J(m(A), {
          key: 0,
          icon: r.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : $("", !0),
        t("span", null, c(r.label), 1)
      ], 40, Jl))), 128))
    ], 8, Ql));
  }
}), ie = (e, s) => `${e}:${s.join("/")}`, Rt = [
  { value: "text", label: "Text", icon: "tabler:typography" },
  { value: "number", label: "Number", icon: "tabler:123" },
  { value: "boolean", label: "Yes / no", icon: "tabler:toggle-right" },
  { value: "date", label: "Date", icon: "tabler:calendar" },
  { value: "enum", label: "One of a set", icon: "tabler:list-details" },
  { value: "list", label: "List", icon: "tabler:brackets" },
  { value: "object", label: "Object", icon: "tabler:braces" }
], Yl = (e) => Rt.find((s) => s.value === e).icon;
function Je(e) {
  const s = [];
  function l(u, d, p, y) {
    s.push({ field: d, trail: p, shape: u, path: y, depth: p.length + 1, key: ie(d, p) }), u.properties?.forEach((r, g) => l(r, d, [...p, g], `${y}.${r.name || "New property"}`)), u.item && l(u.item, d, [...p, "item"], `${y}[]`);
  }
  return e.forEach((u, d) => l(u, d, [], G(u) || "New field")), s;
}
function nt(e) {
  return 1 + Math.max(0, ...(e.properties ?? []).map(nt), e.item ? nt(e.item) : 0);
}
function Xl(e, s) {
  return Je(e).filter((l) => l.shape.type === "object" && ((l.shape.properties?.length ?? 0) < 100 || l.field === s.field && ie(l.field, l.trail) === ie(s.field, s.trail.slice(0, -1))) && l.depth + nt(s.shape) <= Ae && !(l.field === s.field && s.trail.every((u, d) => l.trail[d] === u)));
}
function Zl(e, s, l) {
  const u = { ...Nt(), ...s.shape, name: s.shape.name };
  s.trail.length ? Je(e).find((y) => y.key === ie(s.field, s.trail.slice(0, -1))).shape.properties.splice(s.trail.at(-1), 1) : e.splice(s.field, 1);
  let d;
  if (l) {
    const { name: p, type: y, description: r, enum_values: g, expected_format: S, required: E, properties: i, item: n } = u;
    d = { name: p, type: y, description: r, enum_values: g, expected_format: S, required: E, ...i ? { properties: i } : {}, ...n ? { item: n } : {} }, l.shape.properties.push(d), d = l.shape.properties.at(-1);
  } else
    d = { ...at(), ...u, group: "" }, e.push(d), d = e.at(-1);
  return Je(e).find((p) => p.shape === d);
}
function Ct(e, s = !1) {
  function l(d) {
    return d.type === "object" ? Object.fromEntries((d.properties ?? []).map((p) => [p.name || "unnamed", l(p)])) : d.type === "list" ? d.item ? [l(d.item)] : [] : s ? d.enum_values?.length ? d.enum_values[0] : { text: "Example value", number: 42, boolean: !0, date: "2026-01-15", enum: null }[d.type] : d.type === "enum" ? d.enum_values?.join(" | ") || "enum" : d.type;
  }
  const u = {};
  return e.forEach((d) => Ft(u, G(d) || "unnamed", l(d))), u;
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
}, fa = { class: "muted" }, ba = ["aria-label", "disabled"], ha = /* @__PURE__ */ W({
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
    const l = e, u = s, d = F(() => l.shape), p = F(() => l.named ? l.depth === 1 ? "Field type" : "Property type" : "Item type"), y = F(() => Rt.filter((R) => l.depth < Ae || !["object", "list"].includes(R.value))), r = F({ get: () => l.shape.type, set: (R) => {
      l.shape.type = R, delete l.shape.properties, delete l.shape.item, l.shape.enum_values = [], R === "object" && (l.shape.properties = []), R === "list" && (l.shape.item = hl());
    } }), g = pe(), S = pe(), E = N(""), i = N("");
    fe(() => l.shape, () => {
      E.value = "", i.value = "";
    });
    const n = F(() => l.validationError || (l.named ? gl(d.value.name, l.siblingNames) : "") || yl(l.shape, l.depth));
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
    return (R, w) => (a(), o("div", _l, [
      e.named ? (a(), o("label", ea, [
        w[8] || (w[8] = U("Name", -1)),
        z(t("input", {
          "onUpdate:modelValue": w[0] || (w[0] = (q) => d.value.name = q),
          "aria-label": e.depth === 1 ? "Field name" : "Property name",
          "aria-invalid": !!n.value,
          "aria-describedby": n.value ? m(S) : void 0,
          maxlength: "80",
          spellcheck: "false",
          class: "mono-input"
        }, null, 8, ta), [
          [
            Z,
            d.value.name,
            void 0,
            { trim: !0 }
          ]
        ])
      ])) : $("", !0),
      t("div", la, [
        t("span", { id: m(g) }, c(e.named ? "Data type" : "Item type"), 9, aa),
        f(ye, {
          modelValue: r.value,
          "onUpdate:modelValue": w[1] || (w[1] = (q) => r.value = q),
          class: "type-picker",
          options: y.value,
          "labelled-by": m(g),
          name: p.value,
          disabled: e.readonly
        }, null, 8, ["modelValue", "options", "labelled-by", "name", "disabled"]),
        e.depth === m(Ae) ? (a(), o("small", na, "Level four · choose a value type.")) : $("", !0)
      ]),
      n.value ? (a(), o("p", {
        key: 1,
        id: m(S),
        class: "field-error",
        role: "alert"
      }, c(n.value), 9, sa)) : $("", !0),
      m(kl)(e.shape, e.named) ? (a(), o("div", oa, [
        t("span", null, c(e.shape.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        t("div", ia, [
          (a(!0), o(M, null, I(e.shape.enum_values, (q, K) => (a(), o("span", {
            key: q,
            class: "chip primary"
          }, [
            U(c(q), 1),
            e.readonly ? $("", !0) : (a(), o("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Remove allowed value ${q}`,
              onClick: (D) => e.shape.enum_values.splice(K, 1)
            }, [
              f(m(A), { icon: "tabler:x" })
            ], 8, ua))
          ]))), 128))
        ]),
        e.readonly ? $("", !0) : (a(), o("div", da, [
          z(t("input", {
            "onUpdate:modelValue": w[2] || (w[2] = (q) => E.value = q),
            "aria-label": "New allowed value",
            placeholder: "Add a value…",
            maxlength: "200",
            onKeydown: Ee(ve(b, ["prevent"]), ["enter"])
          }, null, 40, ra), [
            [Z, E.value]
          ]),
          t("button", {
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo",
            onClick: b
          }, "Add")
        ])),
        i.value ? (a(), o("p", ca, c(i.value), 1)) : $("", !0)
      ])) : $("", !0),
      t("label", null, [
        w[9] || (w[9] = U("Description", -1)),
        z(t("textarea", {
          "onUpdate:modelValue": w[3] || (w[3] = (q) => e.shape.description = q),
          rows: "3",
          maxlength: "4000",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [Z, e.shape.description]
        ])
      ]),
      ["boolean", "enum"].includes(e.shape.type) ? $("", !0) : (a(), o("label", va, [
        w[10] || (w[10] = U("Expected format", -1)),
        z(t("input", {
          "onUpdate:modelValue": w[4] || (w[4] = (q) => e.shape.expected_format = q),
          maxlength: "400",
          placeholder: m($l)(e.shape)
        }, null, 8, ma), [
          [Z, e.shape.expected_format]
        ])
      ])),
      e.named ? (a(), o("div", pa, [
        w[11] || (w[11] = t("span", null, "Required", -1)),
        f(te, {
          modelValue: d.value.required,
          "onUpdate:modelValue": w[5] || (w[5] = (q) => d.value.required = q),
          label: "Required",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : $("", !0),
      e.shape.type === "object" ? (a(), o(M, { key: 5 }, [
        t("p", fa, c(e.shape.properties?.length ?? 0) + " properties · Select a property in the tree to edit it.", 1),
        !e.readonly && e.depth < m(Ae) ? (a(), o("button", {
          key: 0,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Add property to ${e.label}`,
          disabled: (e.shape.properties?.length ?? 0) >= 100,
          onClick: w[6] || (w[6] = (q) => u("add"))
        }, [
          f(m(A), { icon: "tabler:plus" }),
          w[12] || (w[12] = U("Add property", -1))
        ], 8, ba)) : $("", !0)
      ], 64)) : $("", !0),
      e.shape.type === "list" && e.shape.item ? (a(), o("button", {
        key: 6,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        onClick: w[7] || (w[7] = (q) => u("selectItem"))
      }, [
        f(m(A), { icon: "tabler:brackets" }),
        U("Edit item shape · " + c(e.shape.item.type), 1)
      ])) : $("", !0)
    ]));
  }
}), ga = ["disabled"], ya = { class: "grid" }, ka = { class: "context-stepper" }, $a = ["disabled"], xa = ["disabled"], wa = {
  key: 0,
  class: "field-note"
}, Sa = { class: "label-block" }, Va = {
  key: 1,
  class: "field-error"
}, Ca = { id: "docscout-groups" }, Ea = ["value"], qa = { class: "toggle-row" }, Ua = /* @__PURE__ */ W({
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
    const l = e, u = s, d = F(() => !l.depth || l.depth === 1), p = F(() => Mt(l.field, l.otherNames));
    return (y, r) => (a(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      f(ha, {
        shape: e.shape ?? e.field,
        depth: e.depth ?? 1,
        label: e.shape?.name || e.field.name || "field",
        named: d.value || !!e.shape?.name || !!e.siblingNames,
        "sibling-names": e.siblingNames,
        "validation-error": d.value ? p.value : void 0,
        readonly: e.readonly,
        onAdd: r[0] || (r[0] = (g) => u("add")),
        onSelectItem: r[1] || (r[1] = (g) => u("selectItem"))
      }, null, 8, ["shape", "depth", "label", "named", "sibling-names", "validation-error", "readonly"]),
      d.value ? (a(), o(M, { key: 0 }, [
        r[25] || (r[25] = t("h4", null, "Finding it", -1)),
        t("label", null, [
          r[12] || (r[12] = U("Search hints", -1)),
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
        t("div", ya, [
          t("label", null, [
            r[15] || (r[15] = U("Strategy", -1)),
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
            r[16] || (r[16] = U("Chunks to read", -1)),
            t("span", ka, [
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
              }, "−", 8, $a),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Increase chunks to read",
                disabled: e.field.chunks >= 1e3 || e.readonly,
                onClick: r[6] || (r[6] = (g) => e.field.chunks++)
              }, "+", 8, xa)
            ]),
            r[17] || (r[17] = t("small", null, "Per search hint", -1))
          ])
        ]),
        e.field.strategy === "deep" && !e.deepEnabled ? (a(), o("p", wa, [
          f(m(A), { icon: "tabler:info-circle" }),
          r[18] || (r[18] = U("Deep analysis is off in the flow, so this field runs as standard.", -1))
        ])) : $("", !0),
        t("div", Sa, [
          r[19] || (r[19] = t("span", { id: "within-label" }, "Search within", -1)),
          f(ye, {
            modelValue: e.field.search_within,
            "onUpdate:modelValue": r[7] || (r[7] = (g) => e.field.search_within = g),
            "labelled-by": "within-label",
            options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
          }, null, 8, ["modelValue"]),
          t("small", null, c(e.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
        ]),
        e.field.search_within === "sections" && !e.mapEnabled ? (a(), o("p", Va, [
          f(m(A), { icon: "tabler:alert-circle" }),
          r[20] || (r[20] = U("Turn on Map the document to read sections.", -1))
        ])) : $("", !0),
        t("label", null, [
          r[21] || (r[21] = U("Group", -1)),
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
          t("datalist", Ca, [
            (a(!0), o(M, null, I(e.groups, (g) => (a(), o("option", {
              key: g,
              value: g
            }, null, 8, Ea))), 128))
          ]),
          r[22] || (r[22] = t("small", null, "Use dotted snake_case names. Values nest under this path.", -1))
        ]),
        r[26] || (r[26] = t("h4", null, "Checking it", -1)),
        t("label", null, [
          r[23] || (r[23] = U("Validation hints", -1)),
          z(t("textarea", {
            "onUpdate:modelValue": r[9] || (r[9] = (g) => e.field.validation_hints = g),
            rows: "2",
            maxlength: "4000",
            placeholder: "Rules the value must satisfy"
          }, null, 512), [
            [Z, e.field.validation_hints]
          ])
        ]),
        t("div", qa, [
          r[24] || (r[24] = t("span", null, [
            U("Evidence required"),
            t("small", null, "The value must cite a quote from the document.")
          ], -1)),
          f(te, {
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
    ], 8, ga));
  }
}), Fa = { class: "field-groups" }, Na = {
  key: 0,
  class: "rows"
}, Ma = ["aria-label"], Aa = { class: "field-group-head" }, Ra = ["aria-label", "aria-expanded", "aria-controls", "onClick"], Ba = { class: "group-title" }, La = ["id"], Oa = { class: "group-title" }, Re = /* @__PURE__ */ W({
  __name: "FieldGroups",
  props: {
    node: {}
  },
  setup(e) {
    const s = N(/* @__PURE__ */ new Set()), l = pe();
    function u(p) {
      s.value.has(p) ? s.value.delete(p) : s.value.add(p);
    }
    const d = (p) => p.indices.length + p.children.reduce((y, r) => y + d(r), 0);
    return (p, y) => {
      const r = st("FieldGroups", !0);
      return a(), o("div", Fa, [
        e.node.indices.length ? (a(), o("ul", Na, [
          (a(!0), o(M, null, I(e.node.indices, (g) => (a(), o("li", { key: g }, [
            je(p.$slots, "default", { index: g })
          ]))), 128))
        ])) : $("", !0),
        (a(!0), o(M, null, I(e.node.children, (g, S) => (a(), o("section", {
          key: g.path,
          class: "field-group",
          "aria-label": `Group ${g.path}`
        }, [
          t("header", Aa, [
            t("button", {
              type: "button",
              class: "tree-toggle kx-iconbtn kx-focus-outline",
              "aria-label": `${s.value.has(g.path) ? "Expand" : "Collapse"} group ${g.path}`,
              "aria-expanded": !s.value.has(g.path),
              "aria-controls": `${m(l)}-${g.path}`,
              onClick: (E) => u(g.path)
            }, [
              f(m(A), {
                icon: s.value.has(g.path) ? "tabler:chevron-right" : "tabler:chevron-down"
              }, null, 8, ["icon"])
            ], 8, Ra),
            je(p.$slots, "header", {
              path: g.path,
              label: g.name,
              count: d(g),
              first: S === 0,
              last: S === e.node.children.length - 1
            }, () => [
              t("span", Ba, c(g.name), 1)
            ])
          ]),
          z(t("div", {
            id: `${m(l)}-${g.path}`,
            class: "group-content"
          }, [
            f(r, { node: g }, {
              default: me((E) => [
                je(p.$slots, "default", bt({ ref_for: !0 }, E))
              ]),
              header: me((E) => [
                je(p.$slots, "header", bt({ ref_for: !0 }, E), () => [
                  t("span", Oa, c(E.label), 1)
                ])
              ]),
              _: 3
            }, 8, ["node"])
          ], 8, La), [
            [Ke, !s.value.has(g.path)]
          ])
        ], 8, Ma))), 128))
      ]);
    };
  }
}), Pa = ["aria-label", "maxlength", "aria-invalid", "aria-describedby", "onKeydown"], Ta = ["aria-label", "title"], Da = ["aria-label", "title"], Ia = ["id"], Bt = /* @__PURE__ */ W({
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
    const l = e, u = s, d = N(l.initialValue), p = N(""), y = N(), r = pe();
    Ue(() => {
      y.value.focus(), y.value.select();
    });
    function g() {
      const S = d.value.trim();
      if (!S || !xl.test(S)) {
        p.value = "Use a dotted path of snake_case group names.";
        return;
      }
      if (S.length > l.maxLength) {
        p.value = "The group and its nested paths must fit within 320 characters.";
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
        "aria-invalid": !!p.value,
        "aria-describedby": p.value ? m(r) : void 0,
        "aria-required": "true",
        autocomplete: "off",
        spellcheck: "false",
        placeholder: "parties.borrower",
        onKeydown: [
          Ee(ve(g, ["prevent"]), ["enter"]),
          E[1] || (E[1] = Ee(ve((i) => u("cancel"), ["stop", "prevent"]), ["esc"]))
        ]
      }, null, 40, Pa), [
        [Z, d.value]
      ]),
      t("button", {
        type: "submit",
        class: "kx-iconbtn kx-focus-outline",
        "aria-label": e.saveLabel,
        title: e.saveLabel
      }, [
        f(m(A), { icon: "tabler:check" })
      ], 8, Ta),
      t("button", {
        type: "button",
        class: "kx-iconbtn kx-focus-outline",
        "aria-label": e.cancelLabel,
        title: e.cancelLabel,
        onClick: E[2] || (E[2] = (i) => u("cancel"))
      }, [
        f(m(A), { icon: "tabler:x" })
      ], 8, Da),
      p.value ? (a(), o("p", {
        key: 0,
        id: m(r),
        class: "field-error",
        role: "alert"
      }, c(p.value), 9, Ia)) : $("", !0)
    ], 32));
  }
}), ja = ["title"], za = ["aria-label", "data-group-rename", "title"], Wa = ["aria-label"], Ha = {
  key: 2,
  class: "group-actions"
}, Ga = ["aria-label", "disabled"], Ka = ["aria-label", "aria-expanded", "aria-controls"], Qa = /* @__PURE__ */ W({
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
    const l = e, u = s, d = N(!1), p = N(!1), y = N(), r = N(), g = N(), S = pe(), E = F(() => [
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
      d.value ? (a(), J(Bt, {
        key: 0,
        "initial-value": e.path,
        "input-label": `Group path for ${e.path}`,
        "save-label": "Save group name",
        "cancel-label": "Cancel group rename",
        "max-length": e.maxLength,
        onSave: b,
        onCancel: n
      }, null, 8, ["initial-value", "input-label", "max-length"])) : (a(), o(M, { key: 1 }, [
        e.readonly ? (a(), o("span", {
          key: 0,
          class: "group-title",
          title: e.path
        }, c(e.name), 9, ja)) : (a(), o("button", {
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
          f(m(A), {
            icon: "tabler:pencil",
            "aria-hidden": "true"
          })
        ], 8, za)),
        t("span", {
          class: "count group-count",
          "aria-label": `${e.count} fields`
        }, c(e.count), 9, Wa),
        e.readonly ? $("", !0) : (a(), o("div", Ha, [
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Add field to ${e.path}`,
            disabled: !e.canAdd,
            title: "Add field",
            onClick: w[0] || (w[0] = (q) => u("add"))
          }, [
            f(m(A), { icon: "tabler:plus" })
          ], 8, Ga),
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Actions for group ${e.path}`,
            "aria-haspopup": "menu",
            "aria-expanded": p.value,
            "aria-controls": m(S),
            onClick: w[1] || (w[1] = (q) => g.value.toggle(q))
          }, [
            f(m(A), { icon: "tabler:dots" })
          ], 8, Ka),
          f(m(At), {
            id: m(S),
            ref_key: "menu",
            ref: g,
            model: E.value,
            popup: "",
            "append-to": "self",
            onShow: w[2] || (w[2] = (q) => p.value = !0),
            onHide: w[3] || (w[3] = (q) => p.value = !1)
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
}, fn = { key: 0 }, bn = { key: 1 }, hn = ["aria-label", "disabled"], gn = /* @__PURE__ */ W({
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
    const l = e, u = s, d = pe(), p = pe(), y = N(), r = N(!1), g = F(() => [
      { label: "Move up", disabled: l.first, command: () => u("reorder", l.field, l.trail, -1) },
      { label: "Move down", disabled: l.last, command: () => u("reorder", l.field, l.trail, 1) }
    ]), S = N(!0);
    fe(() => l.selected, (w) => {
      const q = ie(l.field, l.trail);
      w !== q && w.startsWith(q + (l.trail.length ? "/" : "")) && (S.value = !0);
    });
    const E = F(() => l.trail.at(-1) !== "item"), i = F(() => E.value ? l.shape.name || "New field" : "Each item"), n = F(() => l.trail.length ? void 0 : l.shape), b = F(() => l.shape.type === "object" || l.shape.type === "list");
    function R(w) {
      w.key === "ArrowRight" && b.value && (S.value = !0, w.preventDefault(), w.stopPropagation()), w.key === "ArrowLeft" && b.value && (S.value = !1, w.preventDefault(), w.stopPropagation());
    }
    return (w, q) => {
      const K = st("ShapeTree", !0);
      return a(), o("div", {
        class: "shape-tree-node",
        onKeydown: R
      }, [
        t("div", {
          class: Q(["row-item", { active: e.selected === m(ie)(e.field, e.trail) }])
        }, [
          b.value ? (a(), o("button", {
            key: 0,
            class: "tree-toggle kx-iconbtn kx-focus-outline",
            type: "button",
            "aria-label": `${S.value ? "Collapse" : "Expand"} ${e.path}`,
            "aria-expanded": S.value,
            onClick: q[0] || (q[0] = (D) => S.value = !S.value)
          }, [
            f(m(A), {
              icon: S.value ? "tabler:chevron-down" : "tabler:chevron-right"
            }, null, 8, ["icon"])
          ], 8, Ja)) : (a(), o("span", Ya)),
          t("button", {
            type: "button",
            class: "row-main kx-focus-halo",
            "aria-label": `Edit ${e.path}`,
            "aria-describedby": m(d),
            "aria-current": e.selected === m(ie)(e.field, e.trail) ? "true" : void 0,
            onClick: q[1] || (q[1] = (D) => u("select", e.field, e.trail))
          }, [
            t("span", Za, [
              t("span", _a, [
                f(m(A), {
                  icon: m(Yl)(e.shape.type),
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                t("span", {
                  class: "row-label",
                  title: i.value
                }, c(i.value), 9, en),
                e.error ? (a(), J(m(A), {
                  key: 0,
                  icon: "tabler:alert-circle",
                  class: "row-warn",
                  "aria-label": e.error,
                  title: e.error
                }, null, 8, ["aria-label", "title"])) : $("", !0)
              ]),
              t("span", {
                id: m(d),
                class: Q(["row-desc", { missing: !e.shape.description }]),
                title: e.shape.description || void 0
              }, c(e.shape.description || "No description"), 11, tn)
            ]),
            t("span", ln, [
              t("span", an, c(e.shape.type), 1),
              t("span", nn, [
                E.value && e.shape.required ? (a(), o("span", sn, [
                  f(m(A), {
                    icon: "tabler:asterisk",
                    "aria-hidden": "true"
                  })
                ])) : $("", !0),
                n.value?.strategy === "deep" ? (a(), o("span", on, [
                  f(m(A), {
                    icon: "tabler:microscope",
                    "aria-hidden": "true"
                  })
                ])) : $("", !0),
                n.value?.search_within === "sections" ? (a(), o("span", un, [
                  f(m(A), {
                    icon: "tabler:layout-list",
                    "aria-hidden": "true"
                  })
                ])) : $("", !0),
                n.value?.evidence_required ? (a(), o("span", dn, [
                  f(m(A), {
                    icon: "tabler:file-search",
                    "aria-hidden": "true"
                  })
                ])) : $("", !0)
              ])
            ])
          ], 8, Xa),
          !e.readonly && E.value ? (a(), o("span", rn, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} up`,
              disabled: e.first,
              onClick: q[2] || (q[2] = (D) => u("reorder", e.field, e.trail, -1))
            }, [
              f(m(A), { icon: "tabler:chevron-up" })
            ], 8, cn),
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} down`,
              disabled: e.last,
              onClick: q[3] || (q[3] = (D) => u("reorder", e.field, e.trail, 1))
            }, [
              f(m(A), { icon: "tabler:chevron-down" })
            ], 8, vn)
          ])) : $("", !0),
          !e.readonly && E.value ? (a(), o("div", {
            key: 3,
            class: "row-overflow",
            onKeydown: q[7] || (q[7] = ve(() => {
            }, ["stop"]))
          }, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Actions for ${e.path}`,
              "aria-haspopup": "menu",
              "aria-expanded": r.value,
              "aria-controls": m(p),
              onClick: q[4] || (q[4] = (D) => y.value.toggle(D))
            }, [
              f(m(A), { icon: "tabler:dots" })
            ], 8, mn),
            f(m(At), {
              id: m(p),
              ref_key: "menu",
              ref: y,
              model: g.value,
              popup: "",
              "append-to": "self",
              onShow: q[5] || (q[5] = (D) => r.value = !0),
              onHide: q[6] || (q[6] = (D) => r.value = !1)
            }, null, 8, ["id", "model"])
          ], 32)) : $("", !0)
        ], 2),
        b.value && S.value ? (a(), o("ul", pn, [
          (a(!0), o(M, null, I(e.shape.properties, (D, j) => (a(), o("li", { key: j }, [
            f(K, {
              shape: D,
              field: e.field,
              trail: [...e.trail, j],
              path: `${e.path}.${D.name || "New property"}`,
              selected: e.selected,
              readonly: e.readonly,
              first: j === 0,
              last: j === e.shape.properties.length - 1,
              onSelect: q[8] || (q[8] = (H, P) => u("select", H, P)),
              onAdd: q[9] || (q[9] = (H, P) => u("add", H, P)),
              onReorder: q[10] || (q[10] = (H, P, O) => u("reorder", H, P, O))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly", "first", "last"])
          ]))), 128)),
          e.shape.item ? (a(), o("li", fn, [
            f(K, {
              shape: e.shape.item,
              field: e.field,
              trail: [...e.trail, "item"],
              path: `${e.path}[]`,
              selected: e.selected,
              readonly: e.readonly,
              onSelect: q[11] || (q[11] = (D, j) => u("select", D, j)),
              onAdd: q[12] || (q[12] = (D, j) => u("add", D, j)),
              onReorder: q[13] || (q[13] = (D, j, H) => u("reorder", D, j, H))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly"])
          ])) : $("", !0),
          !e.readonly && e.shape.type === "object" && e.trail.length + 1 < m(Ae) ? (a(), o("li", bn, [
            t("button", {
              type: "button",
              class: "kx-btn kx-btn-ghost kx-focus-halo sm",
              "aria-label": `Add property to ${e.path}`,
              disabled: (e.shape.properties?.length ?? 0) >= 100,
              onClick: q[14] || (q[14] = (D) => u("add", e.field, e.trail))
            }, [
              f(m(A), { icon: "tabler:plus" }),
              q[15] || (q[15] = U("Add property", -1))
            ], 8, hn)
          ])) : $("", !0)
        ])) : $("", !0)
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
}, Sn = /* @__PURE__ */ W({
  __name: "AgentPicker",
  props: {
    value: {},
    readonly: { type: Boolean }
  },
  emits: ["select"],
  setup(e, { emit: s }) {
    const l = s, u = N(!!customElements.get("wc-agent-picker")), d = N("");
    Ue(async () => {
      if (!u.value)
        try {
          await Ze("wc-agent-picker", { timeoutMs: 8e3 }), u.value = !0;
        } catch (y) {
          d.value = y instanceof Error ? y.message : String(y);
        }
    });
    function p(y) {
      if (y.composedPath()[0] !== y.currentTarget) return;
      const r = y.detail;
      l("select", r.agent_id);
    }
    return (y, r) => (a(), o("div", yn, [
      r[0] || (r[0] = t("span", null, "Scout agent", -1)),
      e.readonly ? (a(), o("p", kn, c(e.value || "Built-in scout"), 1)) : u.value ? (a(), o("wc-agent-picker", {
        key: 1,
        config: JSON.stringify({ agent_id: e.value || "" }),
        "aria-label": "Scout agent",
        placeholder: "Choose your agent…",
        onChange: p
      }, null, 40, $n)) : d.value ? (a(), o("p", xn, "Could not load agent picker: " + c(d.value), 1)) : (a(), o("span", wn, "Loading agents…")),
      r[1] || (r[1] = t("small", null, "Leave empty to use the built-in scout.", -1))
    ]));
  }
}), Vn = ["value", "capability", "aria-labelledby"], Cn = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, En = {
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
    const l = s, u = N(!!customElements.get("wc-model-picker")), d = N("");
    Ue(async () => {
      if (!u.value)
        try {
          await Ze("wc-model-picker", { timeoutMs: 8e3 }), u.value = !0;
        } catch (y) {
          d.value = y instanceof Error ? y.message : String(y);
        }
    });
    function p(y) {
      const r = y.detail;
      typeof r == "string" && l("select", r);
    }
    return (y, r) => u.value ? (a(), o("wc-model-picker", {
      key: 0,
      value: e.value,
      capability: e.capability,
      "aria-labelledby": e.labelledBy,
      onSelect: p
    }, null, 40, Vn)) : d.value ? (a(), o("p", Cn, "Could not load model picker: " + c(d.value), 1)) : (a(), o("span", En, "Loading models…"));
  }
}), qn = { class: "slider" }, Un = { class: "slider-head" }, Fn = { class: "slider-value" }, Nn = ["aria-label", "aria-valuetext", "disabled"], Mn = {
  key: 0,
  class: "slider-hints"
}, An = { key: 1 }, Se = 1e3, ee = /* @__PURE__ */ W({
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
    const s = e, l = Le(e, "modelValue"), u = F(() => s.percent ? `${Math.round(l.value * 100)}%` : `${l.value.toLocaleString()}${s.unit ? ` ${s.unit}` : ""}`), d = (r) => s.log ? Math.log(r / s.min) / Math.log(s.max / s.min) * Se : (r - s.min) / (s.max - s.min) * Se;
    function p(r) {
      const g = s.log ? s.min * Math.pow(s.max / s.min, r / Se) : s.min + (s.max - s.min) * r / Se, S = Math.round(g / s.step) * s.step;
      return Math.min(s.max, Math.max(s.min, Number(S.toFixed(4))));
    }
    const y = F({ get: () => Math.round(d(l.value)), set: (r) => {
      l.value = p(r);
    } });
    return (r, g) => (a(), o("div", qn, [
      t("div", Un, [
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
          Z,
          y.value,
          void 0,
          { number: !0 }
        ]
      ]),
      e.hints ? (a(), o("div", Mn, [
        t("span", null, c(e.hints[0]), 1),
        t("span", null, c(e.hints[1]), 1)
      ])) : $("", !0),
      e.note ? (a(), o("small", An, c(e.note), 1)) : $("", !0)
    ]));
  }
}), Rn = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, Bn = { class: "fd-track" }, Ln = { class: "fd-node" }, On = { class: "fd-dots" }, Pn = { class: "fd-more" }, Tn = { class: "fd-node goal" }, Dn = /* @__PURE__ */ W({
  __name: "ScoutDiagram",
  props: {
    rounds: {},
    confidence: {},
    extra: {}
  },
  setup(e) {
    const s = e;
    return (l, u) => (a(), o("figure", Rn, [
      t("div", Bn, [
        u[2] || (u[2] = t("span", { class: "fd-node solid" }, "Pass", -1)),
        (a(!0), o(M, null, I(Math.min(s.rounds, 8), (d) => (a(), o(M, { key: d }, [
          u[0] || (u[0] = t("span", { class: "fd-link" }, null, -1)),
          t("span", Ln, [
            t("span", null, "R" + c(d), 1),
            t("span", On, [
              (a(!0), o(M, null, I(Math.min(s.extra, 6), (p) => (a(), o("i", { key: p }))), 128))
            ])
          ])
        ], 64))), 128)),
        s.rounds > 8 ? (a(), o(M, { key: 0 }, [
          u[1] || (u[1] = t("span", { class: "fd-link" }, null, -1)),
          t("span", Pn, "+" + c(s.rounds - 8), 1)
        ], 64)) : $("", !0),
        u[3] || (u[3] = t("span", { class: "fd-link" }, null, -1)),
        t("span", Tn, "≥ " + c(Math.round(s.confidence * 100)) + "%", 1)
      ]),
      t("figcaption", null, c(s.rounds ? `One pass, then up to ${s.rounds} rounds with up to ${s.extra} new queries each, stopping as soon as confidence reaches ${Math.round(s.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
    ]));
  }
}), In = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, jn = { class: "fd-grid" }, zn = { class: "fd-node solid" }, Wn = { class: "fd-node" }, Hn = { class: "fd-node" }, Gn = { class: "fd-node goal" }, Kn = /* @__PURE__ */ W({
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
    return (u, d) => (a(), o("figure", In, [
      t("div", jn, [
        t("span", zn, [
          t("b", null, c(e.fields), 1),
          U(" field" + c(e.fields === 1 ? "" : "s"), 1),
          t("small", null, c(e.parallel) + " at a time", 1)
        ]),
        t("span", Wn, [
          t("b", null, c(e.queries), 1),
          d[0] || (d[0] = U(" queries", -1)),
          d[1] || (d[1] = t("small", null, "per field", -1))
        ]),
        t("span", Hn, [
          t("b", null, c(e.perQuery), 1),
          d[2] || (d[2] = U(" chunks", -1)),
          d[3] || (d[3] = t("small", null, "per query", -1))
        ]),
        t("span", Gn, [
          t("b", null, c(l.value), 1),
          d[4] || (d[4] = U(" chunks", -1)),
          t("small", null, c(e.queries * e.perQuery > e.cap ? `capped at ${e.cap}` : "read per field"), 1)
        ])
      ]),
      t("figcaption", null, "Each deep field gets its own queries; up to " + c(l.value) + " chunks are read for it before analysis.", 1)
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
}, ps = { class: "toggle-row" }, fs = { class: "toggle-row" }, bs = { class: "label-block" }, hs = {
  id: "model-deep",
  class: "model-role"
}, gs = {
  id: "model-deep-query",
  class: "model-role"
}, ys = {
  id: "model-extract",
  class: "model-role"
}, ks = { class: "output-list" }, $s = { class: "chip" }, xs = {
  key: 0,
  class: "muted"
}, ws = { class: "label-block" }, Ss = { class: "toggle-row" }, Vs = { class: "toggle-row" }, Cs = { class: "toggle-row" }, Es = {
  id: "model-verify",
  class: "model-role"
}, qs = /* @__PURE__ */ W({
  __name: "StepInspector",
  props: {
    stage: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const s = e, l = F(() => s.config.stages), u = (i) => Cl(s.stage, i), d = wl(), p = F(() => s.config.fields.filter((i) => i.strategy === "deep").length), y = F(() => s.config.fields.filter((i) => i.search_within === "sections").map((i) => i.name || "New field")), r = F(() => qt(s.config));
    function g(i) {
      i ? l.value.scout.agent_id = i : delete l.value.scout.agent_id;
    }
    function S(i) {
      l.value.extract.reads = i, i === "pages" && l.value.extract.max_pages === void 0 && (l.value.extract.max_pages = kt());
    }
    function E(i, n) {
      const b = l.value.scout.tools.filter((R) => R !== i);
      l.value.scout.tools = n ? [...b, i] : b;
    }
    return (i, n) => (a(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", Jn, c(m(Sl)[e.stage]), 1),
      e.stage === "map" ? (a(), o(M, { key: 0 }, [
        t("div", Yn, [
          n[35] || (n[35] = t("span", null, "Stage enabled", -1)),
          f(te, {
            modelValue: l.value.map.enabled,
            "onUpdate:modelValue": n[0] || (n[0] = (b) => l.value.map.enabled = b),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Xn, [
          n[36] || (n[36] = t("span", { id: "outline-label" }, "Outline", -1)),
          f(ye, {
            modelValue: l.value.map.outline,
            "onUpdate:modelValue": n[1] || (n[1] = (b) => l.value.map.outline = b),
            "labelled-by": "outline-label",
            options: [{ value: "find_or_build", label: "Use contents first" }, { value: "build", label: "Always build" }]
          }, null, 8, ["modelValue"]),
          n[37] || (n[37] = t("small", null, "The document's own headings are used when it has them; otherwise the model builds an outline.", -1))
        ]),
        t("div", Zn, [
          n[38] || (n[38] = t("span", null, [
            U("Section summaries"),
            t("small", null, "A short summary per section helps pick the right sections in long documents.")
          ], -1)),
          f(te, {
            modelValue: l.value.map.section_summaries,
            "onUpdate:modelValue": n[2] || (n[2] = (b) => l.value.map.section_summaries = b),
            label: "Section summaries",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        n[40] || (n[40] = t("h4", null, "Models", -1)),
        t("div", _n, [
          n[39] || (n[39] = t("span", null, "Outliner", -1)),
          f(ce, {
            value: l.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: n[3] || (n[3] = (b) => l.value.map.model = b)
          }, null, 8, ["value"])
        ]),
        n[41] || (n[41] = t("h4", null, "Fields that read sections", -1)),
        y.value.length ? (a(), o("p", es, [
          (a(!0), o(M, null, I(y.value, (b) => (a(), o("span", {
            key: b,
            class: "chip primary"
          }, c(b), 1))), 128))
        ])) : (a(), o("p", ts, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : $("", !0),
      e.stage === "prefetch" ? (a(), o(M, { key: 1 }, [
        t("div", ls, [
          n[42] || (n[42] = t("span", null, "Stage enabled", -1)),
          f(te, {
            modelValue: l.value.prefetch.enabled,
            "onUpdate:modelValue": n[4] || (n[4] = (b) => l.value.prefetch.enabled = b),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        n[46] || (n[46] = t("h4", null, "Queries", -1)),
        (a(!0), o(M, null, I(l.value.prefetch.queries, (b, R) => (a(), o("div", {
          key: R,
          class: "query-row"
        }, [
          t("div", as, [
            t("label", null, [
              n[43] || (n[43] = U("Name", -1)),
              z(t("input", {
                "onUpdate:modelValue": (w) => b.name = w,
                placeholder: "Parties"
              }, null, 8, ns), [
                [Z, b.name]
              ])
            ]),
            t("label", null, [
              n[44] || (n[44] = U("Chunks", -1)),
              z(t("input", {
                "onUpdate:modelValue": (w) => b.chunks = w,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, ss), [
                [
                  Z,
                  b.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          t("label", null, [
            n[45] || (n[45] = U("Query", -1)),
            z(t("textarea", {
              "onUpdate:modelValue": (w) => b.query = w,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, os), [
              [Z, b.query]
            ])
          ]),
          e.readonly ? $("", !0) : (a(), o("button", {
            key: 0,
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo sm",
            onClick: (w) => l.value.prefetch.queries.splice(R, 1)
          }, "Remove query", 8, is))
        ]))), 128)),
        l.value.prefetch.queries.length ? $("", !0) : (a(), o("p", us, "No fixed queries. Field search hints still run.")),
        e.readonly ? $("", !0) : (a(), o("button", {
          key: 1,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          onClick: n[5] || (n[5] = (b) => l.value.prefetch.queries.push(m(Vl)()))
        }, "Add query"))
      ], 64)) : $("", !0),
      e.stage === "scout" ? (a(), o(M, { key: 2 }, [
        t("div", ds, [
          n[47] || (n[47] = t("span", null, "Stage enabled", -1)),
          f(te, {
            modelValue: l.value.scout.enabled,
            "onUpdate:modelValue": n[6] || (n[6] = (b) => l.value.scout.enabled = b),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", rs, [
          n[48] || (n[48] = t("span", { id: "mode-label" }, "Mode", -1)),
          f(ye, {
            modelValue: l.value.scout.mode,
            "onUpdate:modelValue": n[7] || (n[7] = (b) => l.value.scout.mode = b),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          t("small", null, c(l.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        l.value.scout.mode === "agent" ? (a(), J(Sn, {
          key: 0,
          value: l.value.scout.agent_id,
          readonly: e.readonly,
          onSelect: g
        }, null, 8, ["value", "readonly"])) : $("", !0),
        l.value.scout.mode === "loop" ? (a(), J(Dn, {
          key: 1,
          rounds: l.value.scout.max_rounds,
          confidence: l.value.scout.target_confidence,
          extra: l.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"])) : $("", !0),
        n[53] || (n[53] = t("h4", null, "Models", -1)),
        t("div", cs, [
          n[49] || (n[49] = t("span", null, "Scout", -1)),
          f(ce, {
            value: l.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: n[8] || (n[8] = (b) => l.value.scout.model = b)
          }, null, 8, ["value"])
        ]),
        n[54] || (n[54] = t("h4", null, "Loop", -1)),
        f(ee, {
          modelValue: l.value.scout.max_rounds,
          "onUpdate:modelValue": n[9] || (n[9] = (b) => l.value.scout.max_rounds = b),
          label: l.value.scout.mode === "agent" ? "Rounds" : "Follow-up rounds",
          min: u("max_rounds").min,
          max: u("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        l.value.scout.mode === "loop" ? (a(), J(ee, {
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
        f(ee, {
          modelValue: l.value.scout.max_extra_queries,
          "onUpdate:modelValue": n[11] || (n[11] = (b) => l.value.scout.max_extra_queries = b),
          label: l.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: u("max_extra_queries").min,
          max: u("max_extra_queries").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        f(ee, {
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
        l.value.scout.mode === "agent" ? (a(), o("p", vs, "Tool budget: " + c(l.value.scout.max_rounds * l.value.scout.max_extra_queries) + " calls.", 1)) : $("", !0),
        l.value.scout.mode === "loop" ? (a(), o("div", ms, [
          n[50] || (n[50] = t("span", null, [
            U("Drop noisy chunks"),
            t("small", null, "Chunks no field needs leave the evidence pool; chunks cited for a field always stay.")
          ], -1)),
          f(te, {
            modelValue: l.value.scout.drop_noise,
            "onUpdate:modelValue": n[13] || (n[13] = (b) => l.value.scout.drop_noise = b),
            label: "Drop noisy chunks",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])) : $("", !0),
        t("div", ps, [
          n[51] || (n[51] = t("span", null, [
            U("Share scout notes with extraction"),
            t("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          f(te, {
            modelValue: l.value.scout.share_notes,
            "onUpdate:modelValue": n[14] || (n[14] = (b) => l.value.scout.share_notes = b),
            label: "Share scout notes with extraction",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l.value.scout.mode === "agent" ? (a(), o(M, { key: 5 }, [
          n[52] || (n[52] = t("h4", null, "Agent tools", -1)),
          (a(!0), o(M, null, I(m(d), (b) => (a(), o("div", {
            key: b,
            class: "toggle-row"
          }, [
            t("span", null, c(m(lt)(b)), 1),
            f(te, {
              "model-value": l.value.scout.tools.includes(b),
              label: m(lt)(b),
              disabled: e.readonly,
              "onUpdate:modelValue": (R) => E(b, R)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : $("", !0)
      ], 64)) : $("", !0),
      e.stage === "deep" ? (a(), o(M, { key: 3 }, [
        t("div", fs, [
          n[55] || (n[55] = t("span", null, "Stage enabled", -1)),
          f(te, {
            modelValue: l.value.deep.enabled,
            "onUpdate:modelValue": n[15] || (n[15] = (b) => l.value.deep.enabled = b),
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
        t("div", bs, [
          n[56] || (n[56] = t("span", { id: "read-label" }, "Reads", -1)),
          f(ye, {
            modelValue: l.value.deep.read,
            "onUpdate:modelValue": n[16] || (n[16] = (b) => l.value.deep.read = b),
            "labelled-by": "read-label",
            options: [{ value: "chunks", label: "Retrieved chunks" }, { value: "sections", label: "Whole sections" }]
          }, null, 8, ["modelValue"]),
          n[57] || (n[57] = t("small", null, "Whole sections suit clauses that span many passages; long sections fall back to chunks.", -1))
        ]),
        n[60] || (n[60] = t("h4", null, "Models", -1)),
        t("div", hs, [
          n[58] || (n[58] = t("span", null, "Analysis", -1)),
          f(ce, {
            value: l.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: n[17] || (n[17] = (b) => l.value.deep.model = b)
          }, null, 8, ["value"])
        ]),
        t("div", gs, [
          n[59] || (n[59] = t("span", null, "Query writer", -1)),
          f(ce, {
            value: l.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: n[18] || (n[18] = (b) => l.value.deep.query_model = b)
          }, null, 8, ["value"])
        ]),
        n[61] || (n[61] = t("h4", null, "Reach", -1)),
        f(ee, {
          modelValue: l.value.deep.parallel_fields,
          "onUpdate:modelValue": n[19] || (n[19] = (b) => l.value.deep.parallel_fields = b),
          label: "Fields at a time",
          min: u("parallel_fields").min,
          max: u("parallel_fields").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(ee, {
          modelValue: l.value.deep.max_queries,
          "onUpdate:modelValue": n[20] || (n[20] = (b) => l.value.deep.max_queries = b),
          label: "Queries per field",
          min: u("max_queries").min,
          max: u("max_queries").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(ee, {
          modelValue: l.value.deep.chunks_per_query,
          "onUpdate:modelValue": n[21] || (n[21] = (b) => l.value.deep.chunks_per_query = b),
          label: "Chunks per query",
          min: u("chunks_per_query").min,
          max: u("chunks_per_query").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(ee, {
          modelValue: l.value.deep.chunk_cap,
          "onUpdate:modelValue": n[22] || (n[22] = (b) => l.value.deep.chunk_cap = b),
          label: "Chunk cap per field",
          min: u("chunk_cap").min,
          max: u("chunk_cap").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(ee, {
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
        n[62] || (n[62] = t("h4", null, "Temperature", -1)),
        f(ee, {
          modelValue: l.value.deep.query_temperature,
          "onUpdate:modelValue": n[24] || (n[24] = (b) => l.value.deep.query_temperature = b),
          label: "Query writing",
          min: u("query_temperature").min,
          max: u("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        f(ee, {
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
      e.stage === "extract" ? (a(), o(M, { key: 4 }, [
        n[65] || (n[65] = t("h4", null, "Models", -1)),
        t("div", ys, [
          n[63] || (n[63] = t("span", null, "Extraction", -1)),
          f(ce, {
            value: l.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: n[26] || (n[26] = (b) => l.value.extract.model = b)
          }, null, 8, ["value"])
        ]),
        n[66] || (n[66] = t("h4", null, "Field groups", -1)),
        t("ul", ks, [
          (a(!0), o(M, null, I(r.value, (b) => (a(), o("li", {
            key: b.name
          }, [
            t("span", null, c(b.name), 1),
            t("span", $s, c(b.fields.length) + " field" + c(b.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        r.value.length ? $("", !0) : (a(), o("p", xs, "No fields yet.")),
        f(ee, {
          modelValue: l.value.extract.max_fields_per_call,
          "onUpdate:modelValue": n[27] || (n[27] = (b) => l.value.extract.max_fields_per_call = b),
          label: "Fields per call",
          min: u("max_fields_per_call").min,
          max: u("max_fields_per_call").max,
          disabled: e.readonly,
          note: `${m(yt)(e.config)} extraction call${m(yt)(e.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        f(ee, {
          modelValue: l.value.extract.max_output_tokens,
          "onUpdate:modelValue": n[28] || (n[28] = (b) => l.value.extract.max_output_tokens = b),
          label: "Output limit",
          min: u("max_output_tokens").min,
          max: u("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        t("div", ws, [
          n[64] || (n[64] = t("span", { id: "reads-label" }, "Reads", -1)),
          f(ye, {
            "model-value": l.value.extract.reads ?? "text",
            "labelled-by": "reads-label",
            options: [{ value: "text", label: "Document text" }, { value: "pages", label: "Page images" }],
            "onUpdate:modelValue": n[29] || (n[29] = (b) => S(b))
          }, null, 8, ["model-value"]),
          t("small", null, c(l.value.extract.reads === "pages" ? "Values are read from the page images; the earlier steps only choose which pages. Verify checks values against the pages." : "Values are read from the passages the earlier steps gathered."), 1)
        ]),
        l.value.extract.reads === "pages" ? (a(), J(ee, {
          key: 1,
          "model-value": l.value.extract.max_pages ?? m(kt)(),
          label: "Pages per call",
          min: u("max_pages").min,
          max: u("max_pages").max,
          disabled: e.readonly,
          note: "A document with no more pages than this is read whole; longer ones are read on the pages their passages lie on.",
          "onUpdate:modelValue": n[30] || (n[30] = (b) => l.value.extract.max_pages = b)
        }, null, 8, ["model-value", "min", "max", "disabled"])) : $("", !0)
      ], 64)) : $("", !0),
      e.stage === "verify" ? (a(), o(M, { key: 5 }, [
        t("div", Ss, [
          n[67] || (n[67] = t("span", null, "Stage enabled", -1)),
          f(te, {
            modelValue: l.value.verify.enabled,
            "onUpdate:modelValue": n[31] || (n[31] = (b) => l.value.verify.enabled = b),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Vs, [
          n[68] || (n[68] = t("span", null, [
            U("Quotes exist"),
            t("small", null, "Each quote is matched against the document text. No model call.")
          ], -1)),
          f(te, {
            modelValue: l.value.verify.check_quotes,
            "onUpdate:modelValue": n[32] || (n[32] = (b) => l.value.verify.check_quotes = b),
            label: "Quotes exist",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Cs, [
          n[69] || (n[69] = t("span", null, [
            U("Quotes support values"),
            t("small", null, "A model confirms each quote supports its value.")
          ], -1)),
          f(te, {
            modelValue: l.value.verify.check_support,
            "onUpdate:modelValue": n[33] || (n[33] = (b) => l.value.verify.check_support = b),
            label: "Quotes support values",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l.value.verify.check_support ? (a(), o(M, { key: 0 }, [
          n[71] || (n[71] = t("h4", null, "Models", -1)),
          t("div", Es, [
            n[70] || (n[70] = t("span", null, "Checker", -1)),
            f(ce, {
              value: l.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: n[34] || (n[34] = (b) => l.value.verify.model = b)
            }, null, 8, ["value"])
          ])
        ], 64)) : $("", !0)
      ], 64)) : $("", !0)
    ], 8, Qn));
  }
}), Us = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, Fs = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, Ns = ["x", "y", "width"], Ms = ["x", "width"], As = /* @__PURE__ */ W({
  __name: "ChunkDiagram",
  props: {
    size: {},
    overlap: {}
  },
  setup(e) {
    const s = e, l = F(() => Math.min(0.9, Math.max(0, s.overlap / s.size))), u = F(() => {
      const d = 100 / (3 - 2 * l.value);
      return [0, 1, 2].map((p) => ({ x: p * d * (1 - l.value), w: d }));
    });
    return (d, p) => (a(), o("figure", Us, [
      (a(), o("svg", Fs, [
        (a(!0), o(M, null, I(u.value, (y, r) => (a(), o("rect", {
          key: r,
          x: y.x,
          y: r % 2 ? 14 : 4,
          width: y.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, Ns))), 128)),
        (a(), o(M, null, I([1, 2], (y) => t("rect", {
          key: "o" + y,
          x: u.value[y].x,
          y: 4,
          width: u.value[y - 1].x + u.value[y - 1].w - u.value[y].x,
          height: "24",
          class: "shared"
        }, null, 8, Ms)), 64))
      ])),
      t("figcaption", null, c(e.size.toLocaleString()) + " tokens per chunk · " + c(e.overlap.toLocaleString()) + " shared with the next (" + c(Math.round(l.value * 100)) + "%)", 1)
    ]));
  }
}), Rs = ["disabled"], Bs = { class: "muted" }, Ls = { class: "toggle-row" }, Os = { class: "toggle-row" }, Ps = { class: "label-block" }, Ts = {
  key: 0,
  id: "context-model",
  class: "model-role"
}, Ds = { class: "label-block" }, Is = {
  id: "embedding-model",
  class: "model-role"
}, js = { class: "toggle-row" }, zs = {
  key: 1,
  id: "highlighter-model",
  class: "model-role"
}, Ws = /* @__PURE__ */ W({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const s = e, l = F(() => s.config.retrieval), u = F({ get: () => s.config.retention ?? "", set: (E) => {
      E.trim() ? s.config.retention = E.trim() : delete s.config.retention;
    } }), d = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], p = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], y = et("chunk_size"), r = et("overlap"), g = et("section_budget"), S = F(() => Math.min(r.max, l.value.chunk_size - 50));
    return (E, i) => (a(), o("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", Bs, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + c(e.retention) + ".", 1),
      t("label", null, [
        i[12] || (i[12] = U("Retention window", -1)),
        z(t("input", {
          "onUpdate:modelValue": i[0] || (i[0] = (n) => u.value = n),
          "aria-label": "Retention window",
          placeholder: "Global setting"
        }, null, 512), [
          [Z, u.value]
        ]),
        i[13] || (i[13] = t("small", null, "Duration for new processed documents and runs, for example 24h. Leave empty to use the global Docscout setting. Existing records keep their expiry.", -1))
      ]),
      i[22] || (i[22] = t("h4", null, "Chunks", -1)),
      f(As, {
        size: l.value.chunk_size,
        overlap: l.value.overlap
      }, null, 8, ["size", "overlap"]),
      f(ee, {
        modelValue: l.value.chunk_size,
        "onUpdate:modelValue": i[1] || (i[1] = (n) => l.value.chunk_size = n),
        label: "Chunk size",
        min: m(y).min,
        max: m(y).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      f(ee, {
        modelValue: l.value.overlap,
        "onUpdate:modelValue": i[2] || (i[2] = (n) => l.value.overlap = n),
        label: "Overlap",
        min: m(r).min,
        max: S.value,
        step: 10,
        unit: "tokens",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      t("div", Ls, [
        i[14] || (i[14] = t("span", null, [
          U("Split by headings"),
          t("small", null, "A chunk never crosses a heading.")
        ], -1)),
        f(te, {
          modelValue: l.value.split_headings,
          "onUpdate:modelValue": i[3] || (i[3] = (n) => l.value.split_headings = n),
          label: "Split by headings",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t("div", Os, [
        i[15] || (i[15] = t("span", null, [
          U("Keep tables whole"),
          t("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        f(te, {
          modelValue: l.value.keep_tables,
          "onUpdate:modelValue": i[4] || (i[4] = (n) => l.value.keep_tables = n),
          label: "Keep tables whole",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      f(ee, {
        modelValue: l.value.section_budget,
        "onUpdate:modelValue": i[5] || (i[5] = (n) => l.value.section_budget = n),
        label: "Section budget",
        min: m(g).min,
        max: m(g).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      i[23] || (i[23] = t("h4", null, "Context", -1)),
      t("div", Ps, [
        i[16] || (i[16] = t("span", { id: "context-label" }, "Chunk context", -1)),
        f(ye, {
          modelValue: l.value.context,
          "onUpdate:modelValue": i[6] || (i[6] = (n) => l.value.context = n),
          "labelled-by": "context-label",
          options: p
        }, null, 8, ["modelValue"]),
        t("small", null, c(p.find((n) => n.value === l.value.context)?.note), 1)
      ]),
      l.value.context === "generated" ? (a(), o("div", Ts, [
        i[17] || (i[17] = t("span", null, "Context writer", -1)),
        f(ce, {
          value: l.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: i[7] || (i[7] = (n) => l.value.context_model = n)
        }, null, 8, ["value"])
      ])) : $("", !0),
      i[24] || (i[24] = t("h4", null, "Search", -1)),
      t("div", Ds, [
        i[18] || (i[18] = t("span", { id: "mode-label" }, "Search mode", -1)),
        f(ye, {
          modelValue: l.value.search_mode,
          "onUpdate:modelValue": i[8] || (i[8] = (n) => l.value.search_mode = n),
          "labelled-by": "mode-label",
          options: d
        }, null, 8, ["modelValue"]),
        t("small", null, c(d.find((n) => n.value === l.value.search_mode)?.note), 1)
      ]),
      i[25] || (i[25] = t("h4", null, "Models", -1)),
      t("div", Is, [
        i[19] || (i[19] = t("span", null, "Embedding", -1)),
        f(ce, {
          value: l.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: i[9] || (i[9] = (n) => l.value.embedding_model = n)
        }, null, 8, ["value"])
      ]),
      t("div", js, [
        i[20] || (i[20] = t("span", null, [
          U("Highlighter"),
          t("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        f(te, {
          modelValue: l.value.highlighter,
          "onUpdate:modelValue": i[10] || (i[10] = (n) => l.value.highlighter = n),
          label: "Highlighter",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      l.value.highlighter ? (a(), o("div", zs, [
        i[21] || (i[21] = t("span", null, "Highlighter", -1)),
        f(ce, {
          value: l.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: i[11] || (i[11] = (n) => l.value.highlighter_model = n)
        }, null, 8, ["value"])
      ])) : $("", !0)
    ], 8, Rs));
  }
}), Hs = ["inert"], Gs = { class: "canvas-inner" }, Ks = {
  class: "block fields-block",
  "aria-labelledby": "fields-head"
}, Qs = { class: "block-head" }, Js = ["aria-expanded"], Ys = { class: "count" }, Xs = {
  key: 0,
  class: "block-peek"
}, Zs = {
  key: 1,
  class: "field-add-actions push"
}, _s = ["aria-expanded", "aria-controls", "disabled"], eo = ["disabled"], to = {
  id: "fields-body",
  class: "block-body"
}, lo = {
  key: 0,
  class: "block-empty"
}, ao = { class: "field-tree" }, no = ["id"], so = {
  class: "tree-indent",
  "aria-hidden": "true"
}, oo = {
  class: "shape-preview",
  open: ""
}, io = { class: "kx-focus-outline" }, uo = {
  key: 0,
  class: "field-error",
  role: "alert"
}, ro = {
  key: 1,
  class: "preview-grid"
}, co = { "aria-label": "Output shape" }, vo = { "aria-label": "Example output" }, mo = {
  class: "block",
  "aria-labelledby": "flow-head"
}, po = { class: "block-head" }, fo = ["aria-expanded"], bo = { class: "count" }, ho = {
  key: 0,
  class: "block-peek"
}, go = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, yo = { class: "node-icon" }, ko = { class: "node-main" }, $o = { class: "node-summary" }, xo = { class: "node-side" }, wo = { class: "chip model" }, So = { class: "branches" }, Vo = { class: "branch" }, Co = { class: "branch" }, Eo = { class: "node-icon" }, qo = { class: "node-main" }, Uo = { class: "node-summary" }, Fo = ["aria-labelledby", "role", "aria-modal"], No = ["aria-valuenow"], Mo = { class: "side-panel-head" }, Ao = { class: "side-panel-icon" }, Ro = ["id"], Bo = ["aria-label", "title"], Lo = { class: "node-breadcrumb mono" }, Oo = {
  key: 0,
  class: "move-node",
  "aria-label": "Move node"
}, Po = {
  key: 0,
  value: ""
}, To = {
  key: 1,
  value: "",
  disabled: ""
}, Do = ["value"], Io = ["disabled"], jo = ["disabled"], zo = {
  key: 4,
  class: "inspector-form"
}, Wo = { class: "output-list" }, Ho = { class: "mono" }, Go = { class: "chip" }, Ko = { class: "rail-label" }, tt = 400, We = 320, Qo = /* @__PURE__ */ W({
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
    const s = e, l = Le(e, "title"), u = Le(e, "description"), d = N({ kind: "document" });
    function p(k, v) {
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
    const r = N(p("panel", !0)), g = N(p("fields", !0)), S = N(p("flow", !0));
    function E() {
      try {
        const k = Number(localStorage.getItem("docscout.panelWidth"));
        return k >= We ? k : tt;
      } catch {
        return tt;
      }
    }
    const i = N(E()), n = () => {
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
    const R = N(!1);
    function w(k) {
      const v = k.currentTarget, C = k.clientX, Y = i.value;
      v.setPointerCapture(k.pointerId), R.value = !0;
      const X = (_) => b(Y + (C - _.clientX), !1), ae = () => {
        R.value = !1, b(i.value), v.removeEventListener("pointermove", X), v.removeEventListener("pointerup", ae);
      };
      v.addEventListener("pointermove", X), v.addEventListener("pointerup", ae);
    }
    function q(k) {
      k.key === "ArrowLeft" ? (b(i.value + 24), k.preventDefault()) : k.key === "ArrowRight" && (b(i.value - 24), k.preventDefault());
    }
    let K = null;
    const D = N(), j = pe();
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
    const O = N(), B = N(!1);
    let ue;
    Ue(() => {
      ue = new ResizeObserver(([k]) => {
        const v = B.value;
        B.value = k.contentRect.width < 1e3, B.value && !v && (r.value = !1), !B.value && v && (r.value = p("panel", !0));
      }), O.value && ue.observe(O.value);
    }), Et(() => ue?.disconnect());
    const ke = N();
    fe(d, async () => {
      await Ce(), ke.value && (ke.value.scrollTop = 0);
    });
    async function le(k) {
      B.value && !r.value && (K = O.value?.getRootNode()?.activeElement), d.value = k, r.value = !0, B.value && (await Ce(), D.value?.focus());
    }
    const oe = (k) => JSON.stringify(k) === JSON.stringify(d.value), be = F(() => d.value.kind === "field" ? s.config.fields[d.value.index] : void 0), V = F(() => Je(s.config.fields)), h = F(() => d.value.kind === "field" ? V.value.find((k) => k.key === ie(d.value.index, d.value.trail ?? [])) : void 0), x = F(() => h.value?.key ?? ""), L = F(() => {
      const k = h.value;
      return !k || k.trail.at(-1) === "item" || !k.trail.length ? void 0 : V.value.find((C) => C.key === ie(k.field, k.trail.slice(0, -1))).shape.properties.filter((C) => C !== k.shape).map((C) => C.name);
    }), T = N("");
    fe(x, () => {
      T.value = "";
    });
    const Fe = F(() => h.value ? Xl(s.config.fields, h.value) : []), he = F(() => {
      const k = El(s.config.fields.map(G));
      return k ? `Group path collides with field ${k}.` : "";
    }), Te = F(() => he.value ? null : Ct(s.config.fields)), Tt = F(() => he.value ? null : Ct(s.config.fields, !0)), it = F(() => {
      const k = d.value;
      return k.kind === "stage" ? $e[k.stage] : k.kind === "field" ? h.value?.trail.length ? h.value.path : be.value?.name || "New field" : k.kind === "document" ? "Read document" : k.kind === "output" ? "Output" : "Details";
    }), Dt = F(() => {
      const k = d.value;
      return k.kind === "stage" ? ot[k.stage] : k.kind === "field" ? "tabler:forms" : k.kind === "document" ? "tabler:file-text" : k.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), It = F(() => s.config.fields.filter((k, v) => !(d.value.kind === "field" && d.value.index === v)).map(G)), jt = F(() => s.config.stages.deep.enabled), zt = F(() => s.config.stages.map.enabled), Wt = F(() => Oe(s.config.fields.map(G))), De = N(!1), ut = N(), dt = pe();
    function Ht(k, v) {
      for (const C of s.config.fields) (C.group === k || C.group.startsWith(k + ".")) && (C.group = v + C.group.slice(k.length));
    }
    const Gt = (k) => 320 - Math.max(0, ...s.config.fields.filter((v) => v.group === k || v.group.startsWith(k + ".")).map((v) => v.group.length - k.length));
    function Kt() {
      g.value = !0, De.value = !0;
    }
    async function rt() {
      De.value = !1, await Ce(), ut.value.focus();
    }
    function Qt(k) {
      s.config.fields.push({ ...at(), group: k }), rt();
    }
    const Jt = F(() => [...new Set(s.config.fields.map((k) => k.group.trim()).filter(Boolean))]), Yt = (k) => Mt(s.config.fields[k], s.config.fields.filter((v, C) => C !== k).map(G)), ct = ["map", "prefetch", "scout", "deep", "extract", "verify"], Xt = F(() => ct.filter((k) => Qe(s.config, k)).map((k) => $e[k]).join(" · ")), Zt = F(() => s.config.fields.map((k) => k.name || "New field").join(", ")), _t = F(() => ct.filter((k) => Qe(s.config, k)).length), xe = (k) => s.result?.trace.find((v) => v.kind === k);
    function vt(k = "") {
      s.config.fields.push({ ...at(), group: k }), g.value = !0, le({ kind: "field", index: s.config.fields.length - 1 });
    }
    function el(k) {
      s.config.fields.splice(k, 1), d.value = { kind: "document" };
    }
    function re(k, v = []) {
      le({ kind: "field", index: k, ...v.length ? { trail: v } : {} });
    }
    function mt(k, v) {
      const C = V.value.find((Y) => Y.key === ie(k, v));
      C.shape.properties.push(Nt()), re(k, [...v, C.shape.properties.length - 1]);
    }
    function tl() {
      const k = h.value;
      if (!k.trail.length) {
        el(k.field);
        return;
      }
      const v = V.value.find((C) => C.key === ie(k.field, k.trail.slice(0, -1)));
      v.shape.properties.splice(k.trail.at(-1), 1), re(v.field, v.trail);
    }
    function ll(k, v, C) {
      if (v.length) {
        const X = V.value.find((ne) => ne.key === ie(k, v.slice(0, -1))).shape.properties, ae = v.at(-1), _ = ae + C;
        if (_ < 0 || _ >= X.length) return;
        [X[ae], X[_]] = [X[_], X[ae]], re(k, [...v.slice(0, -1), _]);
      } else {
        const Y = s.config.fields.map((_, ne) => _.group === s.config.fields[k].group ? ne : -1).filter((_) => _ >= 0), X = Y[Y.indexOf(k) + C];
        if (X === void 0) return;
        const ae = s.config.fields;
        [ae[k], ae[X]] = [ae[X], ae[k]], re(X);
      }
    }
    function al() {
      const k = h.value, v = Fe.value.find((Y) => Y.key === T.value), C = Zl(s.config.fields, k, v);
      re(C.field, C.trail);
    }
    function nl(k) {
      const v = h.value?.shape;
      s.config.fields.splice(0, s.config.fields.length, ...s.config.fields.filter((Y) => Y.group !== k && !Y.group.startsWith(k + ".")));
      const C = V.value.find((Y) => Y.shape === v);
      C ? re(C.field, C.trail) : d.value = { kind: "document" };
    }
    function sl(k, v) {
      const C = k.split(".").slice(0, -1).join(".");
      let X = Oe(s.config.fields.map(G));
      for (const se of C.split(".").filter(Boolean)) X = X.children.find((dl) => dl.name === se);
      const ae = X.children.findIndex((se) => se.path === k), _ = X.children[ae + v]?.path;
      if (!_) return;
      const ne = s.config.fields.filter((se) => se.group === k || se.group.startsWith(k + ".")), Ie = s.config.fields.filter((se) => se.group === _ || se.group.startsWith(_ + ".")), Ne = s.config.fields, il = Math.min(Ne.indexOf(ne[0]), Ne.indexOf(Ie[0])), ft = Ne.filter((se) => !ne.includes(se) && !Ie.includes(se));
      ft.splice(il, 0, ...v > 0 ? [...Ie, ...ne] : [...ne, ...Ie]);
      const ul = h.value?.shape;
      Ne.splice(0, Ne.length, ...ft);
      const _e = V.value.find((se) => se.shape === ul);
      _e && re(_e.field, _e.trail);
    }
    const ol = (k) => k.type === "list" ? `list of ${k.item?.type}` : k.type, pt = F({ get: () => s.config.tags.join(", "), set: (k) => {
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
        t("div", Gs, [
          t("section", Ks, [
            t("header", Qs, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": g.value,
                "aria-controls": "fields-body",
                onClick: v[0] || (v[0] = (C) => P("fields"))
              }, [
                f(m(A), {
                  icon: g.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                v[23] || (v[23] = t("h2", { id: "fields-head" }, "Fields", -1)),
                t("span", Ys, c(e.config.fields.length), 1)
              ], 8, Js),
              !g.value && e.config.fields.length ? (a(), o("span", Xs, c(Zt.value), 1)) : $("", !0),
              e.readonly ? $("", !0) : (a(), o("div", Zs, [
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
                  f(m(A), { icon: "tabler:folder-plus" }),
                  v[24] || (v[24] = U("Add group", -1))
                ], 8, _s),
                t("button", {
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  disabled: e.config.fields.length >= 100,
                  onClick: v[1] || (v[1] = (C) => vt())
                }, [
                  f(m(A), { icon: "tabler:plus" }),
                  v[25] || (v[25] = U("Add field", -1))
                ], 8, eo)
              ]))
            ]),
            z(t("div", to, [
              e.config.fields.length ? $("", !0) : (a(), o("p", lo, "Add the values to pull from each document.")),
              t("div", ao, [
                De.value && !e.readonly ? (a(), o("div", {
                  key: 0,
                  id: m(dt),
                  class: "group-create-row"
                }, [
                  t("span", so, [
                    f(m(A), { icon: "tabler:folder-plus" })
                  ]),
                  f(Bt, {
                    "input-label": "New group path",
                    "save-label": "Create group",
                    "cancel-label": "Cancel group creation",
                    onSave: Qt,
                    onCancel: rt
                  })
                ], 8, no)) : $("", !0),
                f(Re, { node: Wt.value }, {
                  header: me(({ path: C, label: Y, count: X, first: ae, last: _ }) => [
                    f(Qa, {
                      path: C,
                      name: Y,
                      count: X,
                      first: ae,
                      last: _,
                      "max-length": Gt(C),
                      "can-add": e.config.fields.length < 100,
                      readonly: e.readonly,
                      onRename: (ne) => Ht(C, ne),
                      onAdd: (ne) => vt(C),
                      onReorder: (ne) => sl(C, ne),
                      onRemove: (ne) => nl(C)
                    }, null, 8, ["path", "name", "count", "first", "last", "max-length", "can-add", "readonly", "onRename", "onAdd", "onReorder", "onRemove"])
                  ]),
                  default: me(({ index: C }) => [
                    f(gn, {
                      shape: e.config.fields[C],
                      field: C,
                      trail: [],
                      path: m(G)(e.config.fields[C]) || "New field",
                      selected: x.value,
                      readonly: e.readonly,
                      error: Yt(C),
                      first: !e.config.fields.slice(0, C).some((Y) => Y.group === e.config.fields[C].group),
                      last: !e.config.fields.slice(C + 1).some((Y) => Y.group === e.config.fields[C].group),
                      onSelect: re,
                      onAdd: mt,
                      onReorder: ll
                    }, null, 8, ["shape", "field", "path", "selected", "readonly", "error", "first", "last"])
                  ]),
                  _: 1
                }, 8, ["node"])
              ]),
              t("details", oo, [
                t("summary", io, [
                  f(m(A), { icon: "tabler:braces" }),
                  v[26] || (v[26] = U("Output preview", -1))
                ]),
                he.value ? (a(), o("p", uo, c(he.value), 1)) : (a(), o("div", ro, [
                  t("div", null, [
                    v[27] || (v[27] = t("h3", null, "Output shape", -1)),
                    t("pre", co, c(JSON.stringify(Te.value, null, 2)), 1)
                  ]),
                  t("div", null, [
                    v[28] || (v[28] = t("h3", null, "Example value", -1)),
                    t("pre", vo, c(JSON.stringify(Tt.value, null, 2)), 1)
                  ])
                ])),
                v[29] || (v[29] = t("small", null, "Example values illustrate the shape; extracted values come from your document.", -1))
              ])
            ], 512), [
              [Ke, g.value]
            ])
          ]),
          t("section", mo, [
            t("header", po, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": S.value,
                "aria-controls": "flow-body",
                onClick: v[2] || (v[2] = (C) => P("flow"))
              }, [
                f(m(A), {
                  icon: S.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                v[30] || (v[30] = t("h2", { id: "flow-head" }, "Flow", -1)),
                t("span", bo, c(_t.value) + " of 6", 1)
              ], 8, fo),
              S.value ? $("", !0) : (a(), o("span", ho, c(Xt.value), 1)),
              t("button", {
                type: "button",
                class: Q(["kx-btn kx-btn-ghost kx-focus-halo sm push", { on: oe({ kind: "details" }) }]),
                onClick: v[3] || (v[3] = (C) => le({ kind: "details" }))
              }, [
                f(m(A), { icon: "tabler:info-circle" }),
                v[31] || (v[31] = U("Details", -1))
              ], 2)
            ]),
            z(t("div", go, [
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "document" }) }]),
                onClick: v[4] || (v[4] = (C) => le({ kind: "document" }))
              }, [
                t("span", yo, [
                  f(m(A), { icon: "tabler:file-text" })
                ]),
                t("span", ko, [
                  v[32] || (v[32] = t("span", { class: "node-title" }, "Read document", -1)),
                  t("span", $o, c(m(ql)(e.config.retrieval)), 1)
                ]),
                t("span", xo, [
                  t("span", wo, c(m(Ut)(e.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              v[37] || (v[37] = t("div", { class: "connector" }, null, -1)),
              f(we, {
                stage: "map",
                config: e.config,
                active: oe({ kind: "stage", stage: "map" }),
                trace: xe("map"),
                readonly: e.readonly,
                onSelect: v[5] || (v[5] = (C) => le({ kind: "stage", stage: "map" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[38] || (v[38] = t("div", {
                class: "fork",
                "aria-hidden": "true"
              }, [
                t("span")
              ], -1)),
              t("div", So, [
                t("div", Vo, [
                  v[33] || (v[33] = t("span", { class: "branch-label" }, "Evidence", -1)),
                  f(we, {
                    stage: "prefetch",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "prefetch" }),
                    trace: xe("prefetch"),
                    readonly: e.readonly,
                    onSelect: v[6] || (v[6] = (C) => le({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  v[34] || (v[34] = t("div", { class: "connector" }, null, -1)),
                  f(we, {
                    stage: "scout",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "scout" }),
                    trace: xe("scout"),
                    readonly: e.readonly,
                    onSelect: v[7] || (v[7] = (C) => le({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                t("div", Co, [
                  v[35] || (v[35] = t("span", { class: "branch-label" }, "Deep fields", -1)),
                  f(we, {
                    stage: "deep",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "deep" }),
                    trace: xe("deep"),
                    readonly: e.readonly,
                    onSelect: v[8] || (v[8] = (C) => le({ kind: "stage", stage: "deep" }))
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
                onSelect: v[9] || (v[9] = (C) => le({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[40] || (v[40] = t("div", { class: "connector" }, null, -1)),
              f(we, {
                stage: "verify",
                config: e.config,
                active: oe({ kind: "stage", stage: "verify" }),
                trace: xe("verify"),
                readonly: e.readonly,
                onSelect: v[10] || (v[10] = (C) => le({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[41] || (v[41] = t("div", { class: "connector" }, null, -1)),
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "output" }) }]),
                onClick: v[11] || (v[11] = (C) => le({ kind: "output" }))
              }, [
                t("span", Eo, [
                  f(m(A), { icon: "tabler:braces" })
                ]),
                t("span", qo, [
                  v[36] || (v[36] = t("span", { class: "node-title" }, "Output", -1)),
                  t("span", Uo, c(e.config.fields.length ? `${e.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [Ke, S.value]
            ])
          ])
        ])
      ], 8, Hs),
      B.value && r.value ? (a(), o("div", {
        key: 0,
        class: "scrim",
        onClick: v[12] || (v[12] = (C) => H(!1))
      })) : $("", !0),
      r.value ? z((a(), o("aside", {
        key: String(B.value),
        class: "side-panel",
        "aria-labelledby": m(j),
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
          onKeydown: q,
          onDblclick: v[13] || (v[13] = (C) => b(tt))
        }, null, 42, No)),
        t("header", Mo, [
          t("span", Ao, [
            f(m(A), { icon: Dt.value }, null, 8, ["icon"])
          ]),
          t("h2", { id: m(j) }, c(it.value), 9, Ro),
          t("button", {
            ref_key: "closeButton",
            ref: D,
            type: "button",
            class: "kx-iconbtn kx-focus-outline push",
            "aria-label": B.value ? "Close panel" : "Collapse panel",
            title: B.value ? "Close panel" : "Collapse panel",
            onClick: v[14] || (v[14] = (C) => H(!1))
          }, [
            f(m(A), {
              icon: B.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ], 8, Bo)
        ]),
        t("div", {
          ref_key: "panelBody",
          ref: ke,
          class: "side-panel-body"
        }, [
          d.value.kind === "document" ? (a(), J(Ws, {
            key: 0,
            config: e.config,
            retention: e.retention,
            readonly: e.readonly
          }, null, 8, ["config", "retention", "readonly"])) : d.value.kind === "stage" ? (a(), J(qs, {
            key: 1,
            stage: d.value.stage,
            config: e.config,
            readonly: e.readonly
          }, null, 8, ["stage", "config", "readonly"])) : d.value.kind === "field" && be.value && h.value ? (a(), o(M, { key: 2 }, [
            t("p", Lo, c(h.value.path), 1),
            f(Ua, {
              field: be.value,
              shape: h.value.shape,
              depth: h.value.depth,
              "sibling-names": L.value,
              "other-names": It.value,
              groups: Jt.value,
              "deep-enabled": jt.value,
              "map-enabled": zt.value,
              readonly: e.readonly,
              onRemove: tl,
              onAdd: v[15] || (v[15] = (C) => mt(h.value.field, h.value.trail)),
              onSelectItem: v[16] || (v[16] = (C) => re(h.value.field, [...h.value.trail, "item"]))
            }, null, 8, ["field", "shape", "depth", "sibling-names", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"]),
            !e.readonly && h.value.trail.at(-1) !== "item" ? (a(), o("fieldset", Oo, [
              t("label", null, [
                v[42] || (v[42] = U("Move to parent", -1)),
                z(t("select", {
                  "onUpdate:modelValue": v[17] || (v[17] = (C) => T.value = C),
                  "aria-label": "Move to parent"
                }, [
                  h.value.trail.length ? (a(), o("option", Po, "Top-level field")) : (a(), o("option", To, "Choose an object…")),
                  (a(!0), o(M, null, I(Fe.value, (C) => (a(), o("option", {
                    key: C.key,
                    value: C.key
                  }, c(C.path), 9, Do))), 128))
                ], 512), [
                  [Ge, T.value]
                ])
              ]),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Move selected node",
                disabled: !T.value && !h.value.trail.length || !T.value && e.config.fields.length >= 100,
                onClick: al
              }, "Move", 8, Io)
            ])) : $("", !0)
          ], 64)) : d.value.kind === "details" ? (a(), o("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: e.readonly
          }, [
            t("label", null, [
              v[43] || (v[43] = U("Name", -1)),
              z(t("input", {
                "onUpdate:modelValue": v[18] || (v[18] = (C) => l.value = C),
                "aria-label": "Extractor name"
              }, null, 512), [
                [Z, l.value]
              ])
            ]),
            t("label", null, [
              v[44] || (v[44] = U("Description", -1)),
              z(t("textarea", {
                "onUpdate:modelValue": v[19] || (v[19] = (C) => u.value = C),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [Z, u.value]
              ])
            ]),
            t("label", null, [
              v[45] || (v[45] = U("Tags", -1)),
              z(t("input", {
                "onUpdate:modelValue": v[20] || (v[20] = (C) => pt.value = C),
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
          ], 8, jo)) : d.value.kind === "output" ? (a(), o("div", zo, [
            v[47] || (v[47] = t("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            t("ul", Wo, [
              (a(!0), o(M, null, I(e.config.fields, (C) => (a(), o("li", {
                key: m(G)(C)
              }, [
                t("span", Ho, c(m(G)(C) || "New field"), 1),
                t("span", Go, c(ol(C)), 1)
              ]))), 128))
            ]),
            v[48] || (v[48] = t("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : $("", !0)
        ], 512)
      ], 44, Fo)), [
        [m(Ol), { disabled: !B.value }]
      ]) : B.value ? $("", !0) : (a(), o("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: v[22] || (v[22] = (C) => H(!0))
      }, [
        f(m(A), { icon: "tabler:layout-sidebar-right-expand" }),
        t("span", Ko, c(it.value), 1)
      ]))
    ], 2));
  }
}), Jo = ["selected"], Yo = {
  key: 1,
  role: "alert"
}, Xo = {
  key: 2,
  class: "muted"
}, Lt = /* @__PURE__ */ W({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(e, { emit: s }) {
    const l = s, u = N(!1), d = N("");
    Ue(async () => {
      try {
        await Ze("wc-multiselect", { timeoutMs: 8e3 }), u.value = !0;
      } catch (y) {
        d.value = String(y);
      }
    });
    function p(y) {
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
      onChange: p
    }, null, 40, Jo)) : d.value ? (a(), o("p", Yo, c(d.value), 1)) : (a(), o("span", Xo, "Loading uploads…"));
  }
}), Zo = ["data-error-kind"], _o = { key: 0 }, Ot = /* @__PURE__ */ W({
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
        U(" · " + c(e.error?.message), 1)
      ]),
      t("small", null, c(e.error?.retryable ? "Retryable" : "Not retryable"), 1),
      e.error?.details ? (a(), o("details", _o, [
        l[0] || (l[0] = t("summary", { class: "kx-focus-outline" }, "Error details", -1)),
        t("pre", null, c(JSON.stringify(e.error.details, null, 2)), 1)
      ])) : $("", !0)
    ], 8, Zo));
  }
}), ei = { class: "nested-value" }, ti = { key: 0 }, li = {
  key: 0,
  class: "muted"
}, ai = { key: 1 }, ni = { key: 2 }, Be = /* @__PURE__ */ W({
  __name: "NestedValue",
  props: {
    value: {}
  },
  setup(e) {
    const s = e, l = F(() => s.value !== null && typeof s.value == "object" && !Array.isArray(s.value) ? s.value : null);
    return (u, d) => {
      const p = st("NestedValue", !0);
      return a(), o("div", ei, [
        Array.isArray(e.value) ? (a(), o("ol", ti, [
          (a(!0), o(M, null, I(e.value, (y, r) => (a(), o("li", { key: r }, [
            f(p, { value: y }, null, 8, ["value"])
          ]))), 128)),
          e.value.length ? $("", !0) : (a(), o("li", li, "Empty list"))
        ])) : l.value ? (a(), o("dl", ai, [
          (a(!0), o(M, null, I(l.value, (y, r) => (a(), o(M, { key: r }, [
            t("dt", null, c(r), 1),
            t("dd", null, [
              f(p, { value: y }, null, 8, ["value"])
            ])
          ], 64))), 128))
        ])) : (a(), o("span", ni, c(e.value === null || e.value === void 0 ? "—" : String(e.value)), 1))
      ]);
    };
  }
}), si = { class: "value-list" }, oi = ["aria-expanded", "onClick"], ii = { class: "value-name" }, ui = { class: "bar" }, di = ["title"], ri = { class: "evidence" }, ci = {
  key: 1,
  class: "muted"
}, vi = {
  key: 2,
  class: "muted"
}, Pt = /* @__PURE__ */ W({
  __name: "ResultFields",
  props: {
    fields: {}
  },
  setup(e) {
    const s = e, l = F(() => Oe(s.fields.map((g) => g.path))), u = N(), d = (g) => `${Math.round(g * 100)}%`, p = (g) => g !== null && typeof g == "object", y = (g) => Array.isArray(g) ? `${g.length} items` : p(g) ? `${Object.keys(g).length} properties` : g == null ? "—" : String(g), r = (g) => g >= 0.9 ? "high" : g >= 0.7 ? "mid" : "low";
    return (g, S) => (a(), o("div", si, [
      f(Re, { node: l.value }, {
        default: me(({ index: E }) => [
          (a(!0), o(M, null, I([e.fields[E]], (i) => (a(), o("div", {
            key: i.path,
            class: "value-row"
          }, [
            t("button", {
              type: "button",
              class: "value-main",
              "aria-expanded": u.value === i.path,
              onClick: (n) => u.value = u.value === i.path ? void 0 : i.path
            }, [
              t("span", ii, c(i.name), 1),
              t("span", {
                class: Q(["value-text", { missing: i.missing }])
              }, c(i.failed ? "Failed" : i.missing ? "Not in the document" : y(i.value)), 3),
              i.failed ? $("", !0) : (a(), o("span", {
                key: 0,
                class: Q(["confidence", r(i.confidence)])
              }, [
                t("span", ui, [
                  t("span", {
                    style: qe({ width: d(i.confidence) })
                  }, null, 4)
                ]),
                U(c(d(i.confidence)), 1),
                S[0] || (S[0] = t("span", { class: "conf-word" }, " confidence", -1))
              ], 2)),
              i.failed ? $("", !0) : (a(), o("span", {
                key: 1,
                class: Q(["chip", i.verified ? "primary" : "warn"]),
                title: i.reason
              }, [
                f(m(A), {
                  icon: i.verified ? "tabler:shield-check" : "tabler:shield-question"
                }, null, 8, ["icon"]),
                U(c(i.verified ? "Verified" : "Check"), 1)
              ], 10, di)),
              f(m(A), {
                icon: u.value === i.path ? "tabler:chevron-up" : "tabler:chevron-down",
                class: "value-caret"
              }, null, 8, ["icon"])
            ], 8, oi),
            !i.failed && !i.missing && p(i.value) ? (a(), J(Be, {
              key: 0,
              class: "structured-value",
              value: i.value
            }, null, 8, ["value"])) : $("", !0),
            i.failed ? (a(), J(Ot, {
              key: 1,
              error: i.error
            }, null, 8, ["error"])) : $("", !0),
            z(t("div", ri, [
              !i.failed && !i.missing && !p(i.value) ? (a(), J(Be, {
                key: 0,
                value: i.value
              }, null, 8, ["value"])) : $("", !0),
              (a(!0), o(M, null, I(i.evidence, (n, b) => (a(), o("blockquote", {
                key: b,
                class: Q({ unfound: n.found === !1 })
              }, [
                t("p", null, "“" + c(n.quote) + "”", 1),
                t("cite", null, [
                  U(c(n.section), 1),
                  n.page !== void 0 && n.page !== null ? (a(), o(M, { key: 0 }, [
                    U(" · Page " + c(n.page), 1)
                  ], 64)) : $("", !0),
                  n.found === !1 ? (a(), o(M, { key: 1 }, [
                    U(" · not found word for word in the document")
                  ], 64)) : $("", !0)
                ])
              ], 2))), 128)),
              i.evidence.length ? $("", !0) : (a(), o("p", ci, "No evidence.")),
              i.reason ? (a(), o("p", vi, c(i.reason), 1)) : $("", !0)
            ], 512), [
              [Ke, u.value === i.path && !i.failed]
            ])
          ]))), 128))
        ]),
        _: 1
      }, 8, ["node"])
    ]));
  }
}), mi = { class: "test" }, pi = { class: "run-bar" }, fi = { class: "run-input" }, bi = { class: "muted run-note" }, hi = {
  key: 0,
  class: "empty"
}, gi = {
  key: 1,
  class: "run-failed",
  role: "alert"
}, yi = {
  key: 2,
  class: "eval-warning",
  role: "status"
}, ki = {
  key: 3,
  class: "test-grid"
}, $i = { class: "block" }, xi = { class: "block-head" }, wi = { class: "muted push" }, Si = { class: "block" }, Vi = { class: "timeline" }, Ci = { class: "tl-icon" }, Ei = { class: "tl-main" }, qi = { class: "tl-head" }, Ui = { class: "muted push" }, Fi = { class: "tl-bar" }, Ni = { class: "muted" }, Mi = {
  key: 0,
  class: "tl-msg"
}, Ai = {
  key: 1,
  class: "chips"
}, Ri = /* @__PURE__ */ W({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {},
    running: { type: Boolean },
    canRun: { type: Boolean }
  },
  emits: ["run"],
  setup(e, { emit: s }) {
    const l = e, u = s, d = N(""), p = (E) => `${(E / 1e3).toFixed(1)}s`, y = F(() => Math.max(1, ...l.result?.trace.map((E) => E.duration_ms) ?? [1])), r = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, g = (E) => r[E]?.label ?? $e[E] ?? E, S = (E) => r[E]?.icon ?? ot[E] ?? "tabler:point";
    return (E, i) => (a(), o("div", mi, [
      t("section", pi, [
        t("div", fi, [
          f(Lt, {
            value: d.value,
            onSelect: i[0] || (i[0] = (n) => d.value = n)
          }, null, 8, ["value"])
        ]),
        f(m(de), {
          label: e.running ? "Extracting…" : "Run extraction",
          loading: e.running,
          disabled: !d.value || e.running || !e.canRun,
          onClick: i[1] || (i[1] = (n) => u("run", d.value))
        }, null, 8, ["label", "loading", "disabled"]),
        t("p", bi, c(e.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + c(e.retention) + ".", 1)
      ]),
      e.result ? $("", !0) : (a(), o("p", hi, "No extraction results yet.")),
      e.result?.status === "failed" ? (a(), o("p", gi, [
        f(m(A), { icon: "tabler:alert-triangle" }),
        U("The run stopped: " + c(e.result.error), 1)
      ])) : $("", !0),
      e.result?.status === "partial" ? (a(), o("p", yi, [
        f(m(A), { icon: "tabler:alert-triangle" }),
        i[2] || (i[2] = U("Partial result · Some fields failed. Successful values are available below.", -1))
      ])) : $("", !0),
      e.result ? (a(), o("div", ki, [
        t("section", $i, [
          t("header", xi, [
            i[3] || (i[3] = t("h2", { class: "block-title" }, "Values", -1)),
            t("span", wi, [
              U(c(e.result.tokens.toLocaleString()) + " tokens · " + c(p(e.result.duration_ms)), 1),
              e.result.pages ? (a(), o(M, { key: 0 }, [
                U(" · " + c(e.result.pages) + " pages", 1)
              ], 64)) : $("", !0)
            ])
          ]),
          f(Pt, {
            fields: e.result.fields
          }, null, 8, ["fields"])
        ]),
        t("section", Si, [
          i[4] || (i[4] = t("header", { class: "block-head" }, [
            t("h2", { class: "block-title" }, "Steps")
          ], -1)),
          t("ol", Vi, [
            (a(!0), o(M, null, I(e.result.trace, (n, b) => (a(), o("li", {
              key: b,
              class: Q(n.status)
            }, [
              t("span", Ci, [
                f(m(A), {
                  icon: S(n.kind)
                }, null, 8, ["icon"])
              ]),
              t("div", Ei, [
                t("div", qi, [
                  t("strong", null, c(g(n.kind)), 1),
                  t("span", Ui, c(p(n.duration_ms)), 1)
                ]),
                t("span", Fi, [
                  t("span", {
                    style: qe({ width: `${Math.max(4, n.duration_ms / y.value * 100)}%` })
                  }, null, 4)
                ]),
                t("p", Ni, [
                  U(c(n.scope), 1),
                  n.model ? (a(), o(M, { key: 0 }, [
                    U(" · " + c(n.model), 1)
                  ], 64)) : $("", !0),
                  U(" · " + c((n.input_tokens + n.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                n.message ? (a(), o("p", Mi, c(n.message), 1)) : $("", !0),
                n.queries?.length ? (a(), o("div", Ai, [
                  (a(!0), o(M, null, I(n.queries, (R) => (a(), o("span", {
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
const Bi = { class: "evals" }, Li = { class: "block eval-run" }, Oi = { class: "eval-run-main" }, Pi = { class: "block-title" }, Ti = {
  key: 0,
  class: "eval-note"
}, Di = {
  key: 0,
  class: "eval-progress",
  role: "status"
}, Ii = { class: "bar" }, ji = { class: "muted" }, zi = { class: "stat-row" }, Wi = { class: "stat" }, Hi = { class: "stat-label" }, Gi = { class: "stat-value" }, Ki = { class: "stat" }, Qi = { class: "stat-value" }, Ji = { class: "stat-delta flat" }, Yi = { class: "stat" }, Xi = { class: "stat-value" }, Zi = {
  key: 0,
  class: "stat-delta flat"
}, _i = { class: "stat" }, eu = { class: "stat-value" }, tu = {
  key: 0,
  class: "stat-delta flat"
}, lu = { class: "block" }, au = { class: "block-head" }, nu = {
  key: 0,
  class: "compare-pick push"
}, su = ["value"], ou = ["value"], iu = {
  key: 0,
  class: "block-empty"
}, uu = {
  key: 1,
  class: "table-scroll"
}, du = { key: 0 }, ru = { key: 1 }, cu = { class: "mono" }, vu = { class: "acc strong" }, mu = { class: "bar" }, pu = { class: "muted" }, fu = {
  key: 0,
  class: "muted"
}, bu = { key: 1 }, hu = {
  key: 1,
  class: "muted"
}, gu = {
  key: 1,
  class: "block"
}, yu = { class: "table-scroll" }, ku = { class: "metric-table result-matrix" }, $u = ["aria-expanded", "onClick"], xu = {
  key: 0,
  class: "badge",
  "data-status": "partial"
}, wu = ["colspan"], Su = {
  key: 0,
  class: "cell-state"
}, Vu = ["data-error-kind", "title"], Cu = ["data-label"], Eu = ["title"], qu = {
  key: 0,
  class: "result-detail"
}, Uu = ["colspan"], Fu = ["data-error-kind", "title"], Nu = { class: "mono" }, Mu = { class: "cmp" }, Au = { class: "cmp" }, Ru = { key: 0 }, Bu = { class: "muted case-meta" }, Lu = { class: "block" }, Ou = { class: "block-head" }, Pu = { class: "count" }, Tu = { class: "mono" }, Du = ["onUpdate:modelValue"], Iu = ["onUpdate:modelValue"], ju = ["onUpdate:modelValue", "placeholder"], zu = ["onUpdate:modelValue", "type"], Wu = {
  key: 0,
  class: "error",
  role: "alert"
}, Hu = { class: "row" }, Gu = {
  key: 1,
  class: "block-empty"
}, Ku = {
  key: 2,
  class: "block-empty"
}, Qu = {
  key: 3,
  class: "table-scroll"
}, Ju = { class: "metric-table case-table" }, Yu = { class: "case-value" }, Xu = {
  key: 1,
  class: "muted"
}, Zu = { class: "num" }, _u = ["aria-label", "disabled", "onClick"], ed = {
  key: 2,
  class: "block"
}, td = { class: "block-head" }, ld = { class: "count" }, ad = { class: "eval-history" }, nd = ["aria-current", "onClick"], sd = ["data-status"], od = { class: "muted" }, id = { class: "push" }, ud = /* @__PURE__ */ W({
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
    const l = e, u = s, d = N(!1), p = N(""), y = N({}), r = N("");
    fe(() => l.addedCaseId, () => {
      d.value = !1, p.value = "", y.value = {};
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
      u("add-case", { upload_id: p.value, expected: V });
    }
    const E = F(() => l.evaluations.find((V) => !He(V))), i = F(() => l.evaluations.filter(He)), n = F(() => l.evaluation), b = F(() => ({ done: (n.value?.results ?? []).filter((h) => h.status !== "queued").length, total: n.value?.case_count ?? 0 })), R = N();
    fe(() => n.value?.id, () => {
      R.value = void 0;
    });
    const w = F(() => {
      if (!n.value) return;
      if (R.value) return i.value.find((h) => h.id === R.value);
      const V = i.value.findIndex((h) => h.id === n.value.id);
      return V >= 0 ? i.value[V + 1] : i.value[0];
    }), q = F(() => (n.value?.metrics ?? []).map((V) => ({ ...V, before: w.value?.metrics.find((h) => h.field === V.field) }))), K = F(() => (n.value?.fields ?? []).map(G)), D = F(() => Oe(l.fields.map(G))), j = (V, h) => V.scores.find((x) => x.field === h), H = N(), P = (V) => `${Math.round(V * 100)}%`, O = (V) => {
      const h = Math.round(V * 100);
      return `${h > 0 ? "+" : h < 0 ? "−" : "±"}${Math.abs(h)} pts`;
    }, B = (V) => Math.round(V * 100) > 0 ? "up" : Math.round(V * 100) < 0 ? "down" : "flat", ue = (V) => V >= 6e4 ? `${Math.floor(V / 6e4)}m ${Math.round(V % 6e4 / 1e3)}s` : `${(V / 1e3).toFixed(1)}s`, ke = (V) => V == null || V === "" ? "—" : typeof V == "string" ? V : Array.isArray(V) && V.every((h) => typeof h != "object") ? V.join(", ") : JSON.stringify(V), le = (V) => V ? V.failed ? "fail" : V.score >= 0.999 ? "pass" : V.score > 0 ? "partial" : "fail" : "none", oe = (V) => (V.results ?? []).filter((h) => h.status === "completed").length, be = { queued: "Queued", running: "Running", completed: "Completed", partial: "Partial", failed: "Failed" };
    return (V, h) => (a(), o("div", Bi, [
      t("section", Li, [
        t("div", Oi, [
          t("div", null, [
            t("h2", Pi, "Evaluate revision " + c(e.revision), 1),
            h[6] || (h[6] = t("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            e.changed ? (a(), o("p", Ti, [
              f(m(A), { icon: "tabler:info-circle" }),
              h[5] || (h[5] = U("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : $("", !0)
          ]),
          f(m(de), {
            label: E.value ? "Evaluating…" : "Run all cases",
            loading: e.starting || !!E.value,
            disabled: !e.cases.length || !e.fields.length || !!E.value || e.starting,
            onClick: h[0] || (h[0] = (x) => u("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        n.value && !m(He)(n.value) ? (a(), o("div", Di, [
          t("span", Ii, [
            t("span", {
              style: qe({ width: P(b.value.total ? b.value.done / b.value.total : 0) })
            }, null, 4)
          ]),
          t("span", ji, c(be[n.value.status]) + " · " + c(b.value.done) + " of " + c(b.value.total) + " cases", 1)
        ])) : $("", !0)
      ]),
      n.value && m(He)(n.value) ? (a(), o(M, { key: 0 }, [
        n.value.error ? (a(), o("p", {
          key: 0,
          class: Q(n.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          f(m(A), { icon: "tabler:alert-triangle" }),
          U(c(n.value.error), 1)
        ], 2)) : $("", !0),
        t("div", zi, [
          t("div", Wi, [
            t("span", Hi, "Accuracy · revision " + c(n.value.config_revision), 1),
            t("span", Gi, c(P(m(Ve)(n.value))), 1),
            w.value ? (a(), o("span", {
              key: 0,
              class: Q(["stat-delta", B(m(Ve)(n.value) - m(Ve)(w.value))])
            }, c(O(m(Ve)(n.value) - m(Ve)(w.value))) + " vs revision " + c(w.value.config_revision), 3)) : $("", !0)
          ]),
          t("div", Ki, [
            h[7] || (h[7] = t("span", { class: "stat-label" }, "Cases", -1)),
            t("span", Qi, [
              U(c(oe(n.value)), 1),
              t("small", null, " / " + c(n.value.case_count), 1)
            ]),
            t("span", Ji, c((n.value.results ?? []).filter((x) => x.status === "partial").length) + " partial · " + c((n.value.results ?? []).filter((x) => x.status === "failed").length) + " failed", 1)
          ]),
          t("div", Yi, [
            h[8] || (h[8] = t("span", { class: "stat-label" }, "Tokens", -1)),
            t("span", Xi, c(n.value.tokens.toLocaleString()), 1),
            w.value ? (a(), o("span", Zi, c(w.value.tokens.toLocaleString()) + " before", 1)) : $("", !0)
          ]),
          t("div", _i, [
            h[9] || (h[9] = t("span", { class: "stat-label" }, "Model time", -1)),
            t("span", eu, c(ue(n.value.duration_ms)), 1),
            w.value ? (a(), o("span", tu, c(ue(w.value.duration_ms)) + " before", 1)) : $("", !0)
          ])
        ]),
        t("section", lu, [
          t("header", au, [
            h[11] || (h[11] = t("h2", { class: "block-title" }, "Field accuracy", -1)),
            i.value.length > 1 ? (a(), o("label", nu, [
              h[10] || (h[10] = t("span", { class: "muted" }, "Compare with", -1)),
              t("select", {
                value: w.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: h[1] || (h[1] = (x) => R.value = x.target.value)
              }, [
                (a(!0), o(M, null, I(i.value.filter((x) => x.id !== n.value.id), (x) => (a(), o("option", {
                  key: x.id,
                  value: x.id
                }, "Revision " + c(x.config_revision) + " · " + c(m(Ye)(x.created_at)), 9, ou))), 128))
              ], 40, su)
            ])) : $("", !0)
          ]),
          q.value.length ? (a(), o("div", uu, [
            t("table", {
              class: Q(["metric-table accuracy-table", { comparing: !!w.value }])
            }, [
              t("thead", null, [
                t("tr", null, [
                  h[12] || (h[12] = t("th", null, "Field", -1)),
                  h[13] || (h[13] = t("th", null, "Accuracy", -1)),
                  h[14] || (h[14] = t("th", null, "Verified", -1)),
                  w.value ? (a(), o("th", du, "Revision " + c(w.value.config_revision), 1)) : $("", !0),
                  w.value ? (a(), o("th", ru, "Change")) : $("", !0)
                ])
              ]),
              t("tbody", null, [
                (a(!0), o(M, null, I(q.value, (x) => (a(), o("tr", {
                  key: x.field
                }, [
                  t("td", cu, c(x.field), 1),
                  t("td", null, [
                    t("span", vu, [
                      t("span", mu, [
                        t("span", {
                          style: qe({ width: P(x.accuracy) })
                        }, null, 4)
                      ]),
                      U(c(P(x.accuracy)), 1)
                    ])
                  ]),
                  t("td", pu, c(P(x.verified)), 1),
                  w.value ? (a(), o("td", fu, c(x.before ? P(x.before.accuracy) : "—"), 1)) : $("", !0),
                  w.value ? (a(), o("td", bu, [
                    x.before ? (a(), o("span", {
                      key: 0,
                      class: Q(["trend", B(x.accuracy - x.before.accuracy)])
                    }, [
                      f(m(A), {
                        icon: B(x.accuracy - x.before.accuracy) === "up" ? "tabler:trending-up" : B(x.accuracy - x.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      U(c(O(x.accuracy - x.before.accuracy)), 1)
                    ], 2)) : (a(), o("span", hu, "New field"))
                  ])) : $("", !0)
                ]))), 128))
              ])
            ], 2)
          ])) : (a(), o("p", iu, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : $("", !0),
      n.value?.results?.length ? (a(), o("section", gu, [
        h[19] || (h[19] = t("header", { class: "block-head" }, [
          t("h2", { class: "block-title" }, "Results by case"),
          t("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        t("div", yu, [
          t("table", ku, [
            t("thead", null, [
              t("tr", null, [
                h[15] || (h[15] = t("th", null, "Document", -1)),
                (a(!0), o(M, null, I(K.value, (x) => (a(), o("th", {
                  key: x,
                  class: "mono"
                }, c(x), 1))), 128))
              ])
            ]),
            t("tbody", null, [
              (a(!0), o(M, null, I(n.value.results, (x) => (a(), o(M, {
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
                      f(m(A), {
                        icon: H.value === x.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      U(c(x.upload_name), 1)
                    ], 8, $u),
                    x.status === "partial" ? (a(), o("span", xu, "Partial")) : $("", !0)
                  ]),
                  x.status === "queued" || x.status === "failed" ? (a(), o("td", {
                    key: 0,
                    colspan: K.value.length,
                    class: "muted"
                  }, [
                    x.status === "queued" ? (a(), o("span", Su, [
                      f(m(A), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      h[16] || (h[16] = U("Waiting", -1))
                    ])) : (a(), o("span", {
                      key: 1,
                      class: "cell-state fail",
                      "data-error-kind": x.error?.kind,
                      title: x.error?.kind
                    }, [
                      f(m(A), { icon: "tabler:alert-triangle" }),
                      U(c(x.error?.message), 1)
                    ], 8, Vu))
                  ], 8, wu)) : (a(!0), o(M, { key: 1 }, I(K.value, (L) => (a(), o("td", {
                    key: L,
                    "data-label": L
                  }, [
                    t("span", {
                      class: Q(["cell", le(j(x, L))]),
                      title: ke(j(x, L)?.value)
                    }, c(j(x, L)?.failed ? "Failed" : j(x, L) ? P(j(x, L).score) : "—"), 11, Eu)
                  ], 8, Cu))), 128))
                ], 2),
                H.value === x.case_id ? (a(), o("tr", qu, [
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
                      node: m(Oe)(x.scores.map((L) => L.field))
                    }, {
                      default: me(({ index: L }) => [
                        (a(!0), o(M, null, I([x.scores[L]], (T) => (a(), o("dl", {
                          key: T.field,
                          class: "compare"
                        }, [
                          t("dt", Nu, c(T.field.split(".").at(-1)), 1),
                          t("dd", null, [
                            t("span", {
                              class: Q(["cell", le(T)])
                            }, c(T.failed ? "Failed" : P(T.score)), 3),
                            t("div", Mu, [
                              h[17] || (h[17] = t("span", { class: "cmp-label" }, "Expected", -1)),
                              f(Be, {
                                value: T.expected
                              }, null, 8, ["value"])
                            ]),
                            t("div", Au, [
                              h[18] || (h[18] = t("span", { class: "cmp-label" }, "Extracted", -1)),
                              T.failed ? (a(), J(Ot, {
                                key: 0,
                                error: T.error
                              }, null, 8, ["error"])) : (a(), J(Be, {
                                key: 1,
                                value: T.value
                              }, null, 8, ["value"]))
                            ]),
                            T.failed ? $("", !0) : (a(), o("span", Ru, [
                              t("span", {
                                class: Q(["chip", T.verified ? "primary" : "warn"])
                              }, [
                                f(m(A), {
                                  icon: T.verified ? "tabler:shield-check" : "tabler:shield-question"
                                }, null, 8, ["icon"]),
                                U(c(T.verified ? "Verified" : "Unverified"), 1)
                              ], 2)
                            ]))
                          ])
                        ]))), 128))
                      ]),
                      _: 2
                    }, 1032, ["node"]),
                    t("p", Bu, c(x.tokens.toLocaleString()) + " tokens · " + c(ue(x.duration_ms)), 1)
                  ], 8, Uu)
                ])) : $("", !0)
              ], 64))), 128))
            ])
          ])
        ])
      ])) : $("", !0),
      t("section", Lu, [
        t("header", Ou, [
          h[20] || (h[20] = t("h2", { class: "block-title" }, "Cases", -1)),
          t("span", Pu, c(e.cases.length), 1),
          f(m(de), {
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
            h[21] || (h[21] = U("Document", -1)),
            f(Lt, {
              value: p.value,
              onSelect: h[3] || (h[3] = (x) => {
                p.value = x;
              })
            }, null, 8, ["value"])
          ]),
          h[24] || (h[24] = t("p", { class: "muted" }, "Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.", -1)),
          f(Re, { node: D.value }, {
            default: me(({ index: x }) => [
              (a(!0), o(M, null, I([e.fields[x]], (L) => (a(), o("label", {
                key: m(G)(L)
              }, [
                t("span", Tu, c(L.name), 1),
                L.type === "boolean" ? z((a(), o("select", {
                  key: 0,
                  "onUpdate:modelValue": (T) => y.value[m(G)(L)] = T
                }, [...h[22] || (h[22] = [
                  t("option", { value: "" }, "Not stated", -1),
                  t("option", { value: "true" }, "Yes", -1),
                  t("option", { value: "false" }, "No", -1)
                ])], 8, Du)), [
                  [Ge, y.value[m(G)(L)]]
                ]) : L.type === "enum" ? z((a(), o("select", {
                  key: 1,
                  "onUpdate:modelValue": (T) => y.value[m(G)(L)] = T
                }, [
                  h[23] || (h[23] = t("option", { value: "" }, "Not stated", -1)),
                  (a(!0), o(M, null, I(L.enum_values, (T) => (a(), o("option", { key: T }, c(T), 1))), 128))
                ], 8, Iu)), [
                  [Ge, y.value[m(G)(L)]]
                ]) : L.type === "object" || L.type === "list" ? z((a(), o("textarea", {
                  key: 2,
                  "onUpdate:modelValue": (T) => y.value[m(G)(L)] = T,
                  rows: "2",
                  placeholder: L.type === "list" ? '["first", "second"]' : '{"key": "value"}'
                }, null, 8, ju)), [
                  [Z, y.value[m(G)(L)]]
                ]) : z((a(), o("input", {
                  key: 3,
                  "onUpdate:modelValue": (T) => y.value[m(G)(L)] = T,
                  type: L.type === "number" ? "number" : L.type === "date" ? "date" : "text",
                  placeholder: "Not stated"
                }, null, 8, zu)), [
                  [rl, y.value[m(G)(L)]]
                ])
              ]))), 128))
            ]),
            _: 1
          }, 8, ["node"]),
          r.value ? (a(), o("p", Wu, c(r.value), 1)) : $("", !0),
          t("div", Hu, [
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
              onClick: h[4] || (h[4] = (x) => d.value = !1)
            })
          ])
        ], 32)) : $("", !0),
        e.fields.length ? !e.cases.length && !d.value ? (a(), o("p", Ku, "No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.")) : e.cases.length ? (a(), o("div", Qu, [
          t("table", Ju, [
            h[25] || (h[25] = t("thead", null, [
              t("tr", null, [
                t("th", null, "Document"),
                t("th", null, "Expected values"),
                t("th")
              ])
            ], -1)),
            t("tbody", null, [
              (a(!0), o(M, null, I(e.cases, (x) => (a(), o("tr", {
                key: x.id
              }, [
                t("td", null, [
                  f(m(A), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  U(" " + c(x.upload_name), 1)
                ]),
                t("td", null, [
                  f(Re, { node: D.value }, {
                    default: me(({ index: L }) => [
                      t("div", Yu, [
                        t("strong", null, c(e.fields[L].name), 1),
                        m($t)(x.expected, m(G)(e.fields[L])) !== void 0 ? (a(), J(Be, {
                          key: 0,
                          value: m($t)(x.expected, m(G)(e.fields[L]))
                        }, null, 8, ["value"])) : (a(), o("span", Xu, "Not stated"))
                      ])
                    ]),
                    _: 2
                  }, 1032, ["node"])
                ]),
                t("td", Zu, [
                  t("button", {
                    type: "button",
                    class: "kx-iconbtn kx-focus-outline",
                    "aria-label": `Remove case ${x.upload_name}`,
                    disabled: e.saving,
                    onClick: (L) => u("delete-case", x.id)
                  }, [
                    f(m(A), { icon: "tabler:trash" })
                  ], 8, _u)
                ])
              ]))), 128))
            ])
          ])
        ])) : $("", !0) : (a(), o("p", Gu, "Add a field in the Builder, then add documents with the values you expect."))
      ]),
      e.evaluations.length ? (a(), o("section", ed, [
        t("header", td, [
          h[26] || (h[26] = t("h2", { class: "block-title" }, "History", -1)),
          t("span", ld, c(e.evaluations.length), 1)
        ]),
        t("ul", ad, [
          (a(!0), o(M, null, I(e.evaluations, (x) => (a(), o("li", {
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
              }, c(be[x.status]), 9, sd),
              t("span", null, "Revision " + c(x.config_revision), 1),
              t("span", od, c(m(Ye)(x.created_at)), 1),
              t("strong", id, c(x.status === "completed" || x.status === "partial" ? P(m(Ve)(x)) : "—"), 1)
            ], 10, nd)
          ]))), 128))
        ])
      ])) : $("", !0)
    ]));
  }
}), dd = { class: "section-head" }, rd = { class: "muted" }, cd = {
  key: 0,
  class: "empty"
}, vd = {
  key: 1,
  class: "table-scroll"
}, md = { class: "metric-table runs-table" }, pd = ["aria-label", "aria-expanded", "onClick"], fd = { class: "caller" }, bd = ["data-status"], hd = {
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
    const s = N(), l = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (u, d) => (a(), o(M, null, [
      t("div", dd, [
        d[0] || (d[0] = t("h2", null, "Recent runs", -1)),
        t("span", rd, "Runs expire after " + c(e.retention), 1)
      ]),
      e.runs.length ? (a(), o("div", vd, [
        t("table", md, [
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
            (a(!0), o(M, null, I(e.runs, (p) => (a(), o(M, {
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
                    f(m(A), {
                      icon: s.value === p.id ? "tabler:chevron-down" : "tabler:chevron-right"
                    }, null, 8, ["icon"]),
                    U(c(m(Ye)(p.created_at)), 1)
                  ], 8, pd)
                ]),
                t("td", null, [
                  t("span", fd, [
                    f(m(A), {
                      icon: l[p.caller].icon
                    }, null, 8, ["icon"]),
                    U(c(l[p.caller].label), 1)
                  ])
                ]),
                t("td", null, [
                  t("span", {
                    class: "badge",
                    "data-status": p.status
                  }, c(p.status === "completed" ? "Completed" : p.status === "partial" ? "Partial" : "Failed"), 9, bd)
                ]),
                t("td", hd, c((p.duration_ms / 1e3).toFixed(1)) + "s", 1),
                t("td", gd, c(Number(p.tokens).toLocaleString()), 1),
                t("td", yd, c(m(Ye)(p.expires_at)), 1)
              ]),
              s.value === p.id ? (a(), o("tr", kd, [
                t("td", $d, [
                  f(Pt, {
                    fields: p.result.fields
                  }, null, 8, ["fields"])
                ])
              ])) : $("", !0)
            ], 64))), 128))
          ])
        ])
      ])) : (a(), o("p", cd, "No runs yet. Runs from the Test tab, agents, evaluations and Workflows appear here."))
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
    const l = e, u = s, d = N(), p = N("");
    return Ue(async () => {
      try {
        await Ze("kickside-share", { timeoutMs: 8e3 });
      } catch (g) {
        p.value = `Sharing is unavailable: ${g instanceof Error ? g.message : String(g)}`;
        return;
      }
      const y = document.createElement("kickside-share"), r = encodeURIComponent(l.id);
      y.setAttribute("config", JSON.stringify({ resource_id: l.id, title: l.title, access_url: `/api/v1/component-access/grants/${r}`, share_url: `/api/v1/component-access/share/${r}` })), y.style.display = "block", y.addEventListener("close", () => u("close")), d.value?.appendChild(y);
    }), (y, r) => (a(), o("div", {
      ref_key: "host",
      ref: d
    }, [
      p.value ? (a(), o("p", wd, c(p.value), 1)) : $("", !0)
    ], 512));
  }
}), Vd = { class: "docscout" }, Cd = { class: "toolbar" }, Ed = { class: "toolbar-lead" }, qd = { class: "crumb-row" }, Ud = { class: "crumb" }, Fd = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, Nd = ["id", "aria-selected", "aria-controls", "onClick"], Md = { class: "toolbar-side" }, Ad = { class: "stats" }, Rd = ["title"], Bd = {
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
    const l = e, u = s, d = N(), p = N(!1), y = N("Builder"), r = N(xt()), g = N(""), S = N(""), E = F(() => l.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    fe(y, () => {
      d.value && (d.value.scrollTop = 0);
    }, { flush: "post" });
    const i = N(), n = N(), b = F(() => l.snapshot.can_edit && i.value !== l.snapshot.expected_revision), R = F(() => b.value && n.value !== l.snapshot.expected_revision);
    function w(P) {
      return g.value === P.title && S.value === (P.description ?? "") && Fl(r.value, P.config);
    }
    function q() {
      const P = l.snapshot;
      r.value = structuredClone(ht(P.config ?? xt())), g.value = P.title, S.value = P.description ?? "", i.value = P.expected_revision, n.value = void 0;
    }
    fe(() => l.snapshot, (P, O) => {
      E.value.includes(y.value) || (y.value = E.value[0]), !(O && P.id === O.id && P.can_edit && O.can_edit && !w(O) && !w(P)) && q();
    }, { immediate: !0 });
    const K = F(() => l.snapshot.can_edit && !w(l.snapshot)), D = F(() => Ul(r.value)), j = F(() => Object.keys($e).filter((P) => Qe(r.value, P)).length);
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
              f(m(A), { icon: "tabler:arrow-left" })
            ])) : $("", !0),
            t("span", Ud, c(e.snapshot.title), 1)
          ]),
          t("nav", Fd, [
            (a(!0), o(M, null, I(E.value, (B) => (a(), o("button", {
              id: `tab-${B}`,
              key: B,
              role: "tab",
              "aria-selected": y.value === B,
              "aria-controls": `panel-${B}`,
              onClick: (ue) => y.value = B
            }, c(B), 9, Nd))), 128))
          ])
        ]),
        t("div", Md, [
          e.snapshot.can_share ? (a(), J(m(de), {
            key: 0,
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-label": "Share",
            onClick: O[1] || (O[1] = (B) => p.value = !0)
          }, {
            default: me(() => [
              f(m(A), { icon: "tabler:share" }),
              O[11] || (O[11] = t("span", { class: "btn-label" }, "Share", -1))
            ]),
            _: 1
          })) : $("", !0),
          t("span", Ad, [
            U(c(e.snapshot.field_count) + " " + c(e.snapshot.field_count === 1 ? "field" : "fields"), 1),
            e.snapshot.can_edit ? (a(), o(M, { key: 0 }, [
              U(" · " + c(j.value) + " steps · revision " + c(e.snapshot.expected_revision), 1)
            ], 64)) : (a(), o(M, { key: 1 }, [
              U(" · Read access")
            ], 64))
          ]),
          e.snapshot.can_edit ? (a(), o(M, { key: 1 }, [
            b.value && !R.value ? (a(), J(m(de), {
              key: 0,
              label: "Reload saved",
              severity: "secondary",
              size: "small",
              onClick: q
            })) : $("", !0),
            D.value ? (a(), o("span", {
              key: 1,
              class: "invalid",
              role: "alert",
              title: D.value
            }, [
              f(m(A), { icon: "tabler:alert-circle" }),
              U(c(D.value), 1)
            ], 8, Rd)) : K.value ? (a(), o("span", Bd, "Unsaved")) : $("", !0),
            f(m(de), {
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
        f(m(de), {
          label: "Reload saved",
          severity: "secondary",
          size: "small",
          onClick: q
        }),
        f(m(de), {
          label: "Keep editing",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: O[2] || (O[2] = (B) => n.value = e.snapshot.expected_revision)
        })
      ])) : $("", !0),
      e.error ? (a(), o("p", Od, c(e.error), 1)) : $("", !0),
      p.value ? (a(), J(Sd, {
        key: 2,
        id: e.snapshot.id,
        title: e.snapshot.title,
        onClose: O[3] || (O[3] = (B) => p.value = !1)
      }, null, 8, ["id", "title"])) : $("", !0),
      y.value === "Builder" && e.snapshot.can_edit ? (a(), o("div", Pd, [
        f(Qo, {
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
          y.value === "Test" ? (a(), J(Ri, {
            key: 0,
            result: e.result,
            retention: e.snapshot.retention,
            running: e.running,
            "can-run": e.snapshot.field_count > 0,
            onRun: O[6] || (O[6] = (B) => u("run", B))
          }, null, 8, ["result", "retention", "running", "can-run"])) : $("", !0),
          y.value === "Evals" && e.snapshot.can_edit ? (a(), J(ud, {
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
    const l = e, u = s, d = N(), p = N(""), y = N(!1), r = N(!1), g = N(!1), S = N(), E = N(null), i = N([]), n = N();
    let b = [], R = 0, w = 0, q = 0, K;
    const D = (V) => V instanceof Error ? V.message : String(V), j = (V) => V === R;
    async function H(V, h) {
      const x = ++q;
      h && (K = h);
      const L = () => j(V) && x === q;
      try {
        const T = l.id, Fe = await ge.evaluations(T);
        if (!L()) return;
        i.value = Fe;
        const he = K ?? Fe[0]?.id;
        if (he) {
          const Te = await ge.evaluation(T, he);
          if (!L() || Te.id !== (K ?? he)) return;
          n.value = Te;
        }
      } catch (T) {
        L() && (p.value = D(T));
      }
    }
    async function P(V) {
      const h = ++w, x = () => j(V) && h === w;
      if (!l.id) {
        p.value = "No extractor selected.";
        return;
      }
      try {
        const L = await ge.get(l.id);
        if (!x()) return;
        d.value = L, p.value = "", L.can_edit && await H(V);
      } catch (L) {
        x() && (p.value = D(L));
      }
    }
    fe(() => l.id, (V, h) => {
      R++, K = void 0, b.forEach((L) => L()), b = [], S.value = void 0, d.value = void 0, E.value = null, i.value = [], n.value = void 0, p.value = "";
      const x = R;
      l.id && (b = [wt(`component.${l.id}`, () => P(x)), wt(`docscout.runs.${l.id}`, () => P(x))]), h !== void 0 && P(x);
    }, { immediate: !0 }), Nl(() => P(R)), Et(() => {
      R++, b.forEach((V) => V());
    });
    async function O(V) {
      const h = R;
      y.value = !0, p.value = "";
      try {
        const x = await V();
        if (j(h))
          return await P(h), x;
      } catch (x) {
        j(h) && (p.value = D(x));
      } finally {
        y.value = !1;
      }
    }
    const B = (V) => O(() => ge.update(l.id, V));
    async function ue(V) {
      const h = R, x = await O(() => ge.addCase(l.id, V));
      x && j(h) && (S.value = x.id);
    }
    const ke = (V) => O(() => ge.deleteCase(l.id, V));
    async function le(V) {
      const h = R;
      r.value = !0, p.value = "";
      try {
        const x = await ge.run(l.id, V);
        j(h) && (E.value = x, await P(h));
      } catch (x) {
        j(h) && (p.value = D(x));
      } finally {
        r.value = !1;
      }
    }
    async function oe() {
      const V = R;
      g.value = !0, p.value = "";
      try {
        const { eval_id: h } = await ge.evaluate(l.id);
        j(V) && await H(V, h);
      } catch (h) {
        j(V) && (p.value = D(h));
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
      error: p.value,
      back: e.back,
      onBack: h[0] || (h[0] = (x) => u("back")),
      onRun: le,
      onSave: B,
      onAddCase: ue,
      onDeleteCase: ke,
      onEvaluate: oe,
      onOpenEvaluation: be
    }, null, 8, ["snapshot", "added-case-id", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : p.value ? (a(), o("p", Id, c(p.value), 1)) : (a(), o("p", jd, "Loading Docscout…"));
  }
});
export {
  Kd as _,
  Ye as w
};
