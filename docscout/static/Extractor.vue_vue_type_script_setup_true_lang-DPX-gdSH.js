import { defineComponent as I, useModel as we, openBlock as n, createElementBlock as o, withModifiers as Ve, createElementVNode as e, mergeModels as Re, computed as F, withKeys as De, unref as h, normalizeClass as L, createVNode as m, toDisplayString as u, Fragment as E, renderList as A, createCommentVNode as g, createTextVNode as S, createBlock as Q, ref as M, resolveComponent as Ie, withDirectives as j, vModelText as Z, vModelSelect as Le, renderSlot as Ee, withCtx as ie, mergeProps as Ze, onMounted as Te, normalizeStyle as he, useId as Vt, onBeforeUnmount as rt, watch as ge, nextTick as Ae, vShow as _e, vModelDynamic as St, toRaw as et } from "vue";
import { B as Ct, L as Et, j as qe, v as ke, k as qt, U as Ut, I as tt, f as Ft, i as Me, l as ct, t as je, h as ve, o as ze, p as Mt, m as vt, M as lt, q as Nt, r as Bt, w as Rt, x as Tt, y as mt, z as At, A as Ot, C as Pt, D as at, E as Dt, F as Oe, G as z, H as Ne, J as Lt, K as nt, N as _t, s as ne, O as st, P as jt, n as ot, Q as It, R as zt, b as Ht, c as de } from "./index-AgwNDP2E.js";
import { loadByTagName as He, on as it } from "@wippy-fe/proxy";
import { Icon as R } from "@iconify/vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
var Wt = Ct.extend({
  name: "focustrap-directive"
}), Qt = qt.extend({
  style: Wt
});
function Se(t) {
  "@babel/helpers - typeof";
  return Se = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(i) {
    return typeof i;
  } : function(i) {
    return i && typeof Symbol == "function" && i.constructor === Symbol && i !== Symbol.prototype ? "symbol" : typeof i;
  }, Se(t);
}
function ut(t, i) {
  var a = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    i && (r = r.filter(function(c) {
      return Object.getOwnPropertyDescriptor(t, c).enumerable;
    })), a.push.apply(a, r);
  }
  return a;
}
function dt(t) {
  for (var i = 1; i < arguments.length; i++) {
    var a = arguments[i] != null ? arguments[i] : {};
    i % 2 ? ut(Object(a), !0).forEach(function(r) {
      Kt(t, r, a[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(a)) : ut(Object(a)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(a, r));
    });
  }
  return t;
}
function Kt(t, i, a) {
  return (i = Gt(i)) in t ? Object.defineProperty(t, i, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : t[i] = a, t;
}
function Gt(t) {
  var i = Jt(t, "string");
  return Se(i) == "symbol" ? i : i + "";
}
function Jt(t, i) {
  if (Se(t) != "object" || !t) return t;
  var a = t[Symbol.toPrimitive];
  if (a !== void 0) {
    var r = a.call(t, i);
    if (Se(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (i === "string" ? String : Number)(t);
}
var Yt = Qt.extend("focustrap", {
  mounted: function(i, a) {
    var r = a.value || {}, c = r.disabled;
    c || (this.createHiddenFocusableElements(i, a), this.bind(i, a), this.autoElementFocus(i, a)), i.setAttribute("data-pd-focustrap", !0), this.$el = i;
  },
  updated: function(i, a) {
    var r = a.value || {}, c = r.disabled;
    c && this.unbind(i);
  },
  unmounted: function(i) {
    this.unbind(i);
  },
  methods: {
    getComputedSelector: function(i) {
      return ':not(.p-hidden-focusable):not([data-p-hidden-focusable="true"])'.concat(i ?? "");
    },
    bind: function(i, a) {
      var r = this, c = a.value || {}, y = c.onFocusIn, d = c.onFocusOut;
      i.$_pfocustrap_mutationobserver = new MutationObserver(function(p) {
        p.forEach(function(k) {
          if (k.type === "childList" && !i.contains(document.activeElement)) {
            var V = function(s) {
              var $ = tt(s) ? tt(s, r.getComputedSelector(i.$_pfocustrap_focusableselector)) ? s : ke(i, r.getComputedSelector(i.$_pfocustrap_focusableselector)) : ke(s);
              return Ft($) ? $ : s.nextSibling && V(s.nextSibling);
            };
            qe(V(k.nextSibling));
          }
        });
      }), i.$_pfocustrap_mutationobserver.disconnect(), i.$_pfocustrap_mutationobserver.observe(i, {
        childList: !0
      }), i.$_pfocustrap_focusinlistener = function(p) {
        return y && y(p);
      }, i.$_pfocustrap_focusoutlistener = function(p) {
        return d && d(p);
      }, i.addEventListener("focusin", i.$_pfocustrap_focusinlistener), i.addEventListener("focusout", i.$_pfocustrap_focusoutlistener);
    },
    unbind: function(i) {
      i.$_pfocustrap_mutationobserver && i.$_pfocustrap_mutationobserver.disconnect(), i.$_pfocustrap_focusinlistener && i.removeEventListener("focusin", i.$_pfocustrap_focusinlistener) && (i.$_pfocustrap_focusinlistener = null), i.$_pfocustrap_focusoutlistener && i.removeEventListener("focusout", i.$_pfocustrap_focusoutlistener) && (i.$_pfocustrap_focusoutlistener = null);
    },
    autoFocus: function(i) {
      this.autoElementFocus(this.$el, {
        value: dt(dt({}, i), {}, {
          autoFocus: !0
        })
      });
    },
    autoElementFocus: function(i, a) {
      var r = a.value || {}, c = r.autoFocusSelector, y = c === void 0 ? "" : c, d = r.firstFocusableSelector, p = d === void 0 ? "" : d, k = r.autoFocus, V = k === void 0 ? !1 : k, l = ke(i, "[autofocus]".concat(this.getComputedSelector(y)));
      V && !l && (l = ke(i, this.getComputedSelector(p))), qe(l);
    },
    onFirstHiddenElementFocus: function(i) {
      var a, r = i.currentTarget, c = i.relatedTarget, y = c === r.$_pfocustrap_lasthiddenfocusableelement || !((a = this.$el) !== null && a !== void 0 && a.contains(c)) ? ke(r.parentElement, this.getComputedSelector(r.$_pfocustrap_focusableselector)) : r.$_pfocustrap_lasthiddenfocusableelement;
      qe(y);
    },
    onLastHiddenElementFocus: function(i) {
      var a, r = i.currentTarget, c = i.relatedTarget, y = c === r.$_pfocustrap_firsthiddenfocusableelement || !((a = this.$el) !== null && a !== void 0 && a.contains(c)) ? Et(r.parentElement, this.getComputedSelector(r.$_pfocustrap_focusableselector)) : r.$_pfocustrap_firsthiddenfocusableelement;
      qe(y);
    },
    createHiddenFocusableElements: function(i, a) {
      var r = this, c = a.value || {}, y = c.tabIndex, d = y === void 0 ? 0 : y, p = c.firstFocusableSelector, k = p === void 0 ? "" : p, V = c.lastFocusableSelector, l = V === void 0 ? "" : V, s = function(O) {
        return Ut("span", {
          class: "p-hidden-accessible p-hidden-focusable",
          tabIndex: d,
          role: "presentation",
          "aria-hidden": !0,
          "data-p-hidden-accessible": !0,
          "data-p-hidden-focusable": !0,
          onFocus: O?.bind(r)
        });
      }, $ = s(this.onFirstHiddenElementFocus), B = s(this.onLastHiddenElementFocus);
      $.$_pfocustrap_lasthiddenfocusableelement = B, $.$_pfocustrap_focusableselector = k, $.setAttribute("data-pc-section", "firstfocusableelement"), B.$_pfocustrap_firsthiddenfocusableelement = $, B.$_pfocustrap_focusableselector = l, B.setAttribute("data-pc-section", "lastfocusableelement"), i.prepend($), i.append(B);
    }
  }
});
const Xt = ["aria-checked", "aria-label", "disabled"], G = /* @__PURE__ */ I({
  __name: "Toggle",
  props: /* @__PURE__ */ Re({
    label: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { type: Boolean, required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(t) {
    const i = we(t, "modelValue");
    return (a, r) => (n(), o("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": i.value,
      "aria-label": t.label,
      disabled: t.disabled,
      onClick: r[0] || (r[0] = Ve((c) => i.value = !i.value, ["stop"]))
    }, [...r[1] || (r[1] = [
      e("span", null, null, -1)
    ])], 8, Xt));
  }
}), Zt = ["aria-label"], el = { class: "node-icon" }, tl = { class: "node-main" }, ll = { class: "node-title" }, al = { class: "node-summary" }, nl = {
  key: 0,
  class: "chips"
}, sl = {
  key: 1,
  class: "trace-line"
}, ol = { class: "node-side" }, il = {
  key: 0,
  class: "chip model"
}, pe = /* @__PURE__ */ I({
  __name: "StageNode",
  props: {
    stage: {},
    config: {},
    active: { type: Boolean },
    trace: {},
    readonly: { type: Boolean }
  },
  emits: ["select"],
  setup(t, { emit: i }) {
    const a = t, r = i, c = F(() => Me(a.config, a.stage)), y = F(() => a.config.stages[a.stage].model), d = F({ get: () => c.value, set: (V) => {
      a.config.stages[a.stage].enabled = V;
    } }), p = F(() => {
      const V = a.config, l = V.stages;
      switch (a.stage) {
        case "map":
          return V.fields.filter((s) => s.search_within === "sections").map((s) => ({ text: s.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...l.prefetch.queries.map((s) => ({ text: s.name || "Untitled query", tone: "" })), ...V.fields.filter((s) => s.search_hints.trim()).map((s) => ({ text: s.name, tone: "hint" }))];
        case "scout":
          return l.scout.mode === "agent" ? l.scout.tools.map((s) => ({ text: je(s).toLowerCase(), tone: "" })) : [];
        case "deep":
          return V.fields.filter((s) => s.strategy === "deep").map((s) => ({ text: s.name || "New field", tone: "primary" }));
        case "extract":
          return ct(V).map((s) => ({ text: `${s.name} · ${s.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), k = (V) => [`${(V.duration_ms / 1e3).toFixed(1)}s`, `${(V.input_tokens + V.output_tokens).toLocaleString()} tokens`, V.queries?.length ? `${V.queries.length} queries` : "", V.message ?? ""].filter(Boolean).join(" · ");
    return (V, l) => (n(), o("div", {
      class: L(["node kx-focus-halo", { active: t.active, off: !c.value, fixed: t.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": h(ve)[t.stage],
      onClick: l[1] || (l[1] = (s) => r("select")),
      onKeydown: [
        l[2] || (l[2] = De((s) => r("select"), ["enter"])),
        l[3] || (l[3] = De(Ve((s) => r("select"), ["prevent"]), ["space"]))
      ]
    }, [
      e("span", el, [
        m(h(R), {
          icon: h(ze)[t.stage]
        }, null, 8, ["icon"])
      ]),
      e("span", tl, [
        e("span", ll, u(h(ve)[t.stage]), 1),
        e("span", al, u(c.value ? h(Mt)(t.stage, t.config) : "Off"), 1),
        c.value && p.value.length ? (n(), o("span", nl, [
          (n(!0), o(E, null, A(p.value, (s) => (n(), o("span", {
            key: s.text,
            class: L(["chip", { primary: s.tone === "primary", "muted-chip": s.tone === "hint" }])
          }, u(s.text), 3))), 128))
        ])) : g("", !0),
        t.trace ? (n(), o("span", sl, [
          m(h(R), {
            icon: t.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          S(u(k(t.trace)), 1)
        ])) : g("", !0)
      ]),
      e("span", ol, [
        c.value && y.value ? (n(), o("span", il, u(h(vt)(y.value)), 1)) : g("", !0),
        t.stage !== "extract" && !t.readonly ? (n(), Q(G, {
          key: 1,
          modelValue: d.value,
          "onUpdate:modelValue": l[0] || (l[0] = (s) => d.value = s),
          label: `Enable ${h(ve)[t.stage]}`
        }, null, 8, ["modelValue", "label"])) : g("", !0)
      ])
    ], 42, Zt));
  }
}), ul = ["aria-labelledby"], dl = ["aria-checked", "tabindex", "disabled", "onClick", "onKeydown"], ye = /* @__PURE__ */ I({
  __name: "Segmented",
  props: /* @__PURE__ */ Re({
    options: {},
    labelledBy: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(t) {
    const i = t, a = we(t, "modelValue"), r = M([]);
    function c(y, d) {
      const p = i.options.length - 1, k = { ArrowRight: d + 1, ArrowDown: d + 1, ArrowLeft: d - 1, ArrowUp: d - 1, Home: 0, End: p }[y.key];
      if (k === void 0) return;
      y.preventDefault();
      const V = (k + i.options.length) % i.options.length;
      a.value = i.options[V].value, r.value[V]?.focus();
    }
    return (y, d) => (n(), o("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": t.labelledBy
    }, [
      (n(!0), o(E, null, A(t.options, (p, k) => (n(), o("button", {
        key: p.value,
        ref_for: !0,
        ref_key: "buttons",
        ref: r,
        type: "button",
        role: "radio",
        "aria-checked": a.value === p.value,
        tabindex: a.value === p.value ? 0 : -1,
        disabled: t.disabled,
        onClick: (V) => a.value = p.value,
        onKeydown: (V) => c(V, k)
      }, u(p.label), 41, dl))), 128))
    ], 8, ul));
  }
}), rl = { class: "shape-editor" }, cl = { class: "grid" }, vl = { key: 0 }, ml = ["aria-label"], pl = ["value", "aria-label", "disabled"], bl = ["value"], fl = { key: 0 }, yl = ["value"], hl = { key: 1 }, gl = ["placeholder"], kl = {
  key: 2,
  class: "toggle-row"
}, $l = ["disabled"], xl = ["aria-label", "onClick"], wl = ["aria-label"], Vl = ["disabled"], Sl = /* @__PURE__ */ I({
  __name: "ShapeEditor",
  props: {
    shape: {},
    depth: { default: 1 },
    label: { default: "field" },
    named: { type: Boolean, default: !1 },
    readonly: { type: Boolean }
  },
  setup(t) {
    const i = t, a = F(() => i.shape), r = [{ value: "text", label: "Text" }, { value: "number", label: "Number" }, { value: "boolean", label: "Yes / no" }, { value: "date", label: "Date" }, { value: "enum", label: "One of a set" }, { value: "list", label: "List" }, { value: "object", label: "Object" }], c = F(() => r.filter((p) => i.depth < lt || !["object", "list"].includes(p.value)));
    function y(p) {
      const k = p.target.value;
      i.shape.type = k, delete i.shape.properties, delete i.shape.item, i.shape.enum_values = [], k === "object" && (i.shape.properties = []), k === "list" && (i.shape.item = Tt());
    }
    function d(p) {
      i.shape.enum_values = [...new Set(p.target.value.split(`
`).map((k) => k.trim()).filter(Boolean))];
    }
    return (p, k) => {
      const V = Ie("ShapeEditor", !0);
      return n(), o("div", rl, [
        e("div", cl, [
          t.named ? (n(), o("label", vl, [
            k[5] || (k[5] = S("Name", -1)),
            j(e("input", {
              "onUpdate:modelValue": k[0] || (k[0] = (l) => a.value.name = l),
              "aria-label": t.depth === 1 ? "Field name" : "Property name",
              spellcheck: "false",
              class: "mono-input"
            }, null, 8, ml), [
              [
                Z,
                a.value.name,
                void 0,
                { trim: !0 }
              ]
            ])
          ])) : g("", !0),
          e("label", null, [
            k[6] || (k[6] = S("Type", -1)),
            e("select", {
              value: t.shape.type,
              onChange: y,
              "aria-label": t.named ? t.depth === 1 ? "Field type" : "Property type" : "Item type",
              disabled: t.readonly
            }, [
              (n(!0), o(E, null, A(c.value, (l) => (n(), o("option", {
                key: l.value,
                value: l.value
              }, u(l.label), 9, bl))), 128))
            ], 40, pl)
          ])
        ]),
        h(Nt)(t.shape, t.named) ? (n(), o("label", fl, [
          S(u(t.shape.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
          e("textarea", {
            value: t.shape.enum_values?.join(`
`) ?? "",
            rows: "3",
            placeholder: "One per line",
            onChange: d
          }, null, 40, yl)
        ])) : g("", !0),
        e("label", null, [
          k[7] || (k[7] = S("Description", -1)),
          j(e("textarea", {
            "onUpdate:modelValue": k[1] || (k[1] = (l) => t.shape.description = l),
            rows: "2",
            placeholder: "What this value means in the document"
          }, null, 512), [
            [Z, t.shape.description]
          ])
        ]),
        ["boolean", "enum"].includes(t.shape.type) ? g("", !0) : (n(), o("label", hl, [
          k[8] || (k[8] = S("Expected format", -1)),
          j(e("input", {
            "onUpdate:modelValue": k[2] || (k[2] = (l) => t.shape.expected_format = l),
            placeholder: h(Bt)(t.shape)
          }, null, 8, gl), [
            [Z, t.shape.expected_format]
          ])
        ])),
        t.named ? (n(), o("div", kl, [
          k[9] || (k[9] = e("span", null, "Required", -1)),
          m(G, {
            modelValue: a.value.required,
            "onUpdate:modelValue": k[3] || (k[3] = (l) => a.value.required = l),
            label: "Required",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])) : g("", !0),
        t.shape.type === "object" ? (n(), o(E, { key: 3 }, [
          k[10] || (k[10] = e("h4", null, "Properties", -1)),
          (n(!0), o(E, null, A(t.shape.properties, (l, s) => (n(), o("fieldset", {
            key: s,
            class: "property-editor",
            "data-property-editor": "",
            disabled: t.readonly
          }, [
            e("legend", null, u(l.name || "New property"), 1),
            m(V, {
              shape: l,
              depth: t.depth + 1,
              label: l.name || "property",
              named: "",
              readonly: t.readonly
            }, null, 8, ["shape", "depth", "label", "readonly"]),
            t.readonly ? g("", !0) : (n(), o("button", {
              key: 0,
              type: "button",
              class: "kx-btn kx-btn-ghost kx-focus-halo sm",
              "aria-label": `Remove property ${l.name || s + 1}`,
              onClick: ($) => t.shape.properties.splice(s, 1)
            }, "Remove property", 8, xl))
          ], 8, $l))), 128)),
          !t.readonly && t.depth < h(lt) ? (n(), o("button", {
            key: 0,
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo sm",
            "aria-label": `Add property to ${t.label}`,
            onClick: k[4] || (k[4] = (l) => t.shape.properties.push(h(Rt)()))
          }, "Add property", 8, wl)) : g("", !0)
        ], 64)) : g("", !0),
        t.shape.type === "list" && t.shape.item ? (n(), o("fieldset", {
          key: 4,
          class: "property-editor",
          disabled: t.readonly
        }, [
          k[11] || (k[11] = e("legend", null, "Each item is", -1)),
          m(V, {
            shape: t.shape.item,
            depth: t.depth + 1,
            label: `${t.label} item`,
            readonly: t.readonly
          }, null, 8, ["shape", "depth", "label", "readonly"])
        ], 8, Vl)) : g("", !0)
      ]);
    };
  }
}), Cl = ["disabled"], El = {
  key: 0,
  class: "field-error",
  role: "alert"
}, ql = { class: "grid" }, Ul = {
  key: 1,
  class: "field-note"
}, Fl = { class: "label-block" }, Ml = {
  key: 2,
  class: "field-error"
}, Nl = { id: "docscout-groups" }, Bl = ["value"], Rl = { class: "toggle-row" }, Tl = /* @__PURE__ */ I({
  __name: "FieldInspector",
  props: {
    field: {},
    otherNames: {},
    groups: {},
    deepEnabled: { type: Boolean },
    mapEnabled: { type: Boolean },
    readonly: { type: Boolean }
  },
  emits: ["remove"],
  setup(t, { emit: i }) {
    const a = t, r = i, c = F(() => mt(a.field, a.otherNames));
    return (y, d) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      m(Sl, {
        shape: t.field,
        label: t.field.name || "field",
        named: "",
        readonly: t.readonly
      }, null, 8, ["shape", "label", "readonly"]),
      c.value ? (n(), o("p", El, [
        m(h(R), { icon: "tabler:alert-circle" }),
        S(u(c.value), 1)
      ])) : g("", !0),
      d[21] || (d[21] = e("h4", null, "Finding it", -1)),
      e("label", null, [
        d[8] || (d[8] = S("Search hints", -1)),
        j(e("textarea", {
          "onUpdate:modelValue": d[0] || (d[0] = (p) => t.field.search_hints = p),
          rows: "2",
          placeholder: "One query per line"
        }, null, 512), [
          [Z, t.field.search_hints]
        ]),
        d[9] || (d[9] = e("small", null, "Each line is an extra search for this field in Prefetch and Deep analysis.", -1))
      ]),
      e("div", ql, [
        e("label", null, [
          d[11] || (d[11] = S("Strategy", -1)),
          j(e("select", {
            "onUpdate:modelValue": d[1] || (d[1] = (p) => t.field.strategy = p)
          }, [...d[10] || (d[10] = [
            e("option", { value: "standard" }, "Standard", -1),
            e("option", { value: "deep" }, "Deep analysis", -1)
          ])], 512), [
            [Le, t.field.strategy]
          ])
        ]),
        e("label", null, [
          d[12] || (d[12] = S("Chunks to read", -1)),
          j(e("input", {
            "onUpdate:modelValue": d[2] || (d[2] = (p) => t.field.chunks = p),
            type: "number",
            min: "1",
            max: "1000"
          }, null, 512), [
            [
              Z,
              t.field.chunks,
              void 0,
              { number: !0 }
            ]
          ]),
          d[13] || (d[13] = e("small", null, "Per search hint", -1))
        ])
      ]),
      t.field.strategy === "deep" && !t.deepEnabled ? (n(), o("p", Ul, [
        m(h(R), { icon: "tabler:info-circle" }),
        d[14] || (d[14] = S("Deep analysis is off in the flow, so this field runs as standard.", -1))
      ])) : g("", !0),
      e("div", Fl, [
        d[15] || (d[15] = e("span", { id: "within-label" }, "Search within", -1)),
        m(ye, {
          modelValue: t.field.search_within,
          "onUpdate:modelValue": d[3] || (d[3] = (p) => t.field.search_within = p),
          "labelled-by": "within-label",
          options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
        }, null, 8, ["modelValue"]),
        e("small", null, u(t.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
      ]),
      t.field.search_within === "sections" && !t.mapEnabled ? (n(), o("p", Ml, [
        m(h(R), { icon: "tabler:alert-circle" }),
        d[16] || (d[16] = S("Turn on Map the document to read sections.", -1))
      ])) : g("", !0),
      e("label", null, [
        d[17] || (d[17] = S("Group", -1)),
        j(e("input", {
          "onUpdate:modelValue": d[4] || (d[4] = (p) => t.field.group = p),
          list: "docscout-groups",
          placeholder: "parties.borrower",
          "aria-label": "Field group"
        }, null, 512), [
          [
            Z,
            t.field.group,
            void 0,
            { trim: !0 }
          ]
        ]),
        e("datalist", Nl, [
          (n(!0), o(E, null, A(t.groups, (p) => (n(), o("option", {
            key: p,
            value: p
          }, null, 8, Bl))), 128))
        ]),
        d[18] || (d[18] = e("small", null, "Use dotted snake_case names. Values nest under this path.", -1))
      ]),
      d[22] || (d[22] = e("h4", null, "Checking it", -1)),
      e("label", null, [
        d[19] || (d[19] = S("Validation hints", -1)),
        j(e("textarea", {
          "onUpdate:modelValue": d[5] || (d[5] = (p) => t.field.validation_hints = p),
          rows: "2",
          placeholder: "Rules the value must satisfy"
        }, null, 512), [
          [Z, t.field.validation_hints]
        ])
      ]),
      e("div", Rl, [
        d[20] || (d[20] = e("span", null, [
          S("Evidence required"),
          e("small", null, "The value must cite a quote from the document.")
        ], -1)),
        m(G, {
          modelValue: t.field.evidence_required,
          "onUpdate:modelValue": d[6] || (d[6] = (p) => t.field.evidence_required = p),
          label: "Evidence required",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t.readonly ? g("", !0) : (n(), o("button", {
        key: 3,
        type: "button",
        class: "kx-btn kx-btn-danger kx-focus-halo",
        onClick: d[7] || (d[7] = (p) => r("remove"))
      }, "Remove field"))
    ], 8, Cl));
  }
}), Al = {
  key: 0,
  class: "rows"
}, Ol = { class: "group-content" }, $e = /* @__PURE__ */ I({
  __name: "FieldGroups",
  props: {
    node: {}
  },
  setup(t) {
    return (i, a) => {
      const r = Ie("FieldGroups", !0);
      return n(), o(E, null, [
        t.node.indices.length ? (n(), o("ul", Al, [
          (n(!0), o(E, null, A(t.node.indices, (c) => (n(), o("li", { key: c }, [
            Ee(i.$slots, "default", { index: c })
          ]))), 128))
        ])) : g("", !0),
        (n(!0), o(E, null, A(t.node.children, (c) => (n(), o("details", {
          key: c.path,
          class: "field-group",
          open: ""
        }, [
          e("summary", null, u(c.name), 1),
          e("div", Ol, [
            Ee(i.$slots, "header", {
              path: c.path
            }),
            m(r, { node: c }, {
              default: ie((y) => [
                Ee(i.$slots, "default", Ze({ ref_for: !0 }, y))
              ]),
              header: ie((y) => [
                Ee(i.$slots, "header", Ze({ ref_for: !0 }, y))
              ]),
              _: 3
            }, 8, ["node"])
          ])
        ]))), 128))
      ], 64);
    };
  }
}), Pl = ["value", "capability", "aria-labelledby"], Dl = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, Ll = {
  key: 2,
  class: "dz-muted",
  role: "status"
}, oe = /* @__PURE__ */ I({
  __name: "ModelPicker",
  props: {
    value: {},
    capability: {},
    labelledBy: {}
  },
  emits: ["select"],
  setup(t, { emit: i }) {
    const a = i, r = M(!!customElements.get("wc-model-picker")), c = M("");
    Te(async () => {
      if (!r.value)
        try {
          await He("wc-model-picker", { timeoutMs: 8e3 }), r.value = !0;
        } catch (d) {
          c.value = d instanceof Error ? d.message : String(d);
        }
    });
    function y(d) {
      const p = d.detail;
      typeof p == "string" && a("select", p);
    }
    return (d, p) => r.value ? (n(), o("wc-model-picker", {
      key: 0,
      value: t.value,
      capability: t.capability,
      "aria-labelledby": t.labelledBy,
      onSelect: y
    }, null, 40, Pl)) : c.value ? (n(), o("p", Dl, "Could not load model picker: " + u(c.value), 1)) : (n(), o("span", Ll, "Loading models…"));
  }
}), _l = { class: "slider" }, jl = { class: "slider-head" }, Il = { class: "slider-value" }, zl = ["aria-label", "aria-valuetext", "disabled"], Hl = {
  key: 0,
  class: "slider-hints"
}, Wl = { key: 1 }, be = 1e3, X = /* @__PURE__ */ I({
  __name: "Slider",
  props: /* @__PURE__ */ Re({
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
  setup(t) {
    const i = t, a = we(t, "modelValue"), r = F(() => i.percent ? `${Math.round(a.value * 100)}%` : `${a.value.toLocaleString()}${i.unit ? ` ${i.unit}` : ""}`), c = (p) => i.log ? Math.log(p / i.min) / Math.log(i.max / i.min) * be : (p - i.min) / (i.max - i.min) * be;
    function y(p) {
      const k = i.log ? i.min * Math.pow(i.max / i.min, p / be) : i.min + (i.max - i.min) * p / be, V = Math.round(k / i.step) * i.step;
      return Math.min(i.max, Math.max(i.min, Number(V.toFixed(4))));
    }
    const d = F({ get: () => Math.round(c(a.value)), set: (p) => {
      a.value = y(p);
    } });
    return (p, k) => (n(), o("div", _l, [
      e("div", jl, [
        e("span", null, u(t.label), 1),
        e("output", Il, u(r.value), 1)
      ]),
      j(e("input", {
        "onUpdate:modelValue": k[0] || (k[0] = (V) => d.value = V),
        type: "range",
        min: "0",
        max: be,
        step: "1",
        "aria-label": t.label,
        "aria-valuetext": r.value,
        disabled: t.disabled,
        style: he({ "--fill": `${d.value / be * 100}%` })
      }, null, 12, zl), [
        [
          Z,
          d.value,
          void 0,
          { number: !0 }
        ]
      ]),
      t.hints ? (n(), o("div", Hl, [
        e("span", null, u(t.hints[0]), 1),
        e("span", null, u(t.hints[1]), 1)
      ])) : g("", !0),
      t.note ? (n(), o("small", Wl, u(t.note), 1)) : g("", !0)
    ]));
  }
}), Ql = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, Kl = { class: "fd-track" }, Gl = { class: "fd-node" }, Jl = { class: "fd-dots" }, Yl = { class: "fd-more" }, Xl = { class: "fd-node goal" }, Zl = /* @__PURE__ */ I({
  __name: "ScoutDiagram",
  props: {
    rounds: {},
    confidence: {},
    extra: {}
  },
  setup(t) {
    const i = t;
    return (a, r) => (n(), o("figure", Ql, [
      e("div", Kl, [
        r[2] || (r[2] = e("span", { class: "fd-node solid" }, "Pass", -1)),
        (n(!0), o(E, null, A(Math.min(i.rounds, 8), (c) => (n(), o(E, { key: c }, [
          r[0] || (r[0] = e("span", { class: "fd-link" }, null, -1)),
          e("span", Gl, [
            e("span", null, "R" + u(c), 1),
            e("span", Jl, [
              (n(!0), o(E, null, A(Math.min(i.extra, 6), (y) => (n(), o("i", { key: y }))), 128))
            ])
          ])
        ], 64))), 128)),
        i.rounds > 8 ? (n(), o(E, { key: 0 }, [
          r[1] || (r[1] = e("span", { class: "fd-link" }, null, -1)),
          e("span", Yl, "+" + u(i.rounds - 8), 1)
        ], 64)) : g("", !0),
        r[3] || (r[3] = e("span", { class: "fd-link" }, null, -1)),
        e("span", Xl, "≥ " + u(Math.round(i.confidence * 100)) + "%", 1)
      ]),
      e("figcaption", null, u(i.rounds ? `One pass, then up to ${i.rounds} rounds with up to ${i.extra} new queries each, stopping as soon as confidence reaches ${Math.round(i.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
    ]));
  }
}), ea = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, ta = { class: "fd-grid" }, la = { class: "fd-node solid" }, aa = { class: "fd-node" }, na = { class: "fd-node" }, sa = { class: "fd-node goal" }, oa = /* @__PURE__ */ I({
  __name: "DeepDiagram",
  props: {
    fields: {},
    parallel: {},
    queries: {},
    perQuery: {},
    cap: {}
  },
  setup(t) {
    const i = t, a = F(() => Math.min(i.queries * i.perQuery, i.cap));
    return (r, c) => (n(), o("figure", ea, [
      e("div", ta, [
        e("span", la, [
          e("b", null, u(t.fields), 1),
          S(" field" + u(t.fields === 1 ? "" : "s"), 1),
          e("small", null, u(t.parallel) + " at a time", 1)
        ]),
        e("span", aa, [
          e("b", null, u(t.queries), 1),
          c[0] || (c[0] = S(" queries", -1)),
          c[1] || (c[1] = e("small", null, "per field", -1))
        ]),
        e("span", na, [
          e("b", null, u(t.perQuery), 1),
          c[2] || (c[2] = S(" chunks", -1)),
          c[3] || (c[3] = e("small", null, "per query", -1))
        ]),
        e("span", sa, [
          e("b", null, u(a.value), 1),
          c[4] || (c[4] = S(" chunks", -1)),
          e("small", null, u(t.queries * t.perQuery > t.cap ? `capped at ${t.cap}` : "read per field"), 1)
        ])
      ]),
      e("figcaption", null, "Each deep field gets its own queries; up to " + u(a.value) + " chunks are read for it before analysis.", 1)
    ]));
  }
}), ia = ["disabled"], ua = { class: "muted" }, da = { class: "toggle-row" }, ra = { class: "label-block" }, ca = { class: "toggle-row" }, va = {
  id: "model-map",
  class: "model-role"
}, ma = {
  key: 0,
  class: "chips"
}, pa = {
  key: 1,
  class: "muted"
}, ba = { class: "toggle-row" }, fa = { class: "grid" }, ya = ["onUpdate:modelValue"], ha = ["onUpdate:modelValue"], ga = ["onUpdate:modelValue"], ka = ["onClick"], $a = {
  key: 0,
  class: "muted"
}, xa = { class: "toggle-row" }, wa = { class: "label-block" }, Va = {
  id: "model-scout",
  class: "model-role"
}, Sa = {
  key: 2,
  class: "muted"
}, Ca = {
  key: 3,
  class: "toggle-row"
}, Ea = { class: "toggle-row" }, qa = { class: "toggle-row" }, Ua = { class: "label-block" }, Fa = {
  id: "model-deep",
  class: "model-role"
}, Ma = {
  id: "model-deep-query",
  class: "model-role"
}, Na = {
  id: "model-extract",
  class: "model-role"
}, Ba = { class: "output-list" }, Ra = { class: "chip" }, Ta = {
  key: 0,
  class: "muted"
}, Aa = { class: "toggle-row" }, Oa = { class: "toggle-row" }, Pa = { class: "toggle-row" }, Da = {
  id: "model-verify",
  class: "model-role"
}, La = /* @__PURE__ */ I({
  __name: "StepInspector",
  props: {
    stage: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(t) {
    const i = t, a = F(() => i.config.stages), r = (V) => Dt(i.stage, V), c = At(), y = F(() => i.config.fields.filter((V) => V.strategy === "deep").length), d = F(() => i.config.fields.filter((V) => V.search_within === "sections").map((V) => V.name || "New field")), p = F(() => ct(i.config));
    function k(V, l) {
      const s = a.value.scout.tools.filter(($) => $ !== V);
      a.value.scout.tools = l ? [...s, V] : s;
    }
    return (V, l) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("p", ua, u(h(Ot)[t.stage]), 1),
      t.stage === "map" ? (n(), o(E, { key: 0 }, [
        e("div", da, [
          l[33] || (l[33] = e("span", null, "Stage enabled", -1)),
          m(G, {
            modelValue: a.value.map.enabled,
            "onUpdate:modelValue": l[0] || (l[0] = (s) => a.value.map.enabled = s),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", ra, [
          l[34] || (l[34] = e("span", { id: "outline-label" }, "Outline", -1)),
          m(ye, {
            modelValue: a.value.map.outline,
            "onUpdate:modelValue": l[1] || (l[1] = (s) => a.value.map.outline = s),
            "labelled-by": "outline-label",
            options: [{ value: "find_or_build", label: "Use contents first" }, { value: "build", label: "Always build" }]
          }, null, 8, ["modelValue"]),
          l[35] || (l[35] = e("small", null, "The document's own headings are used when it has them; otherwise the model builds an outline.", -1))
        ]),
        e("div", ca, [
          l[36] || (l[36] = e("span", null, [
            S("Section summaries"),
            e("small", null, "A short summary per section helps pick the right sections in long documents.")
          ], -1)),
          m(G, {
            modelValue: a.value.map.section_summaries,
            "onUpdate:modelValue": l[2] || (l[2] = (s) => a.value.map.section_summaries = s),
            label: "Section summaries",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l[38] || (l[38] = e("h4", null, "Models", -1)),
        e("div", va, [
          l[37] || (l[37] = e("span", null, "Outliner", -1)),
          m(oe, {
            value: a.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: l[3] || (l[3] = (s) => a.value.map.model = s)
          }, null, 8, ["value"])
        ]),
        l[39] || (l[39] = e("h4", null, "Fields that read sections", -1)),
        d.value.length ? (n(), o("p", ma, [
          (n(!0), o(E, null, A(d.value, (s) => (n(), o("span", {
            key: s,
            class: "chip primary"
          }, u(s), 1))), 128))
        ])) : (n(), o("p", pa, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : g("", !0),
      t.stage === "prefetch" ? (n(), o(E, { key: 1 }, [
        e("div", ba, [
          l[40] || (l[40] = e("span", null, "Stage enabled", -1)),
          m(G, {
            modelValue: a.value.prefetch.enabled,
            "onUpdate:modelValue": l[4] || (l[4] = (s) => a.value.prefetch.enabled = s),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l[44] || (l[44] = e("h4", null, "Queries", -1)),
        (n(!0), o(E, null, A(a.value.prefetch.queries, (s, $) => (n(), o("div", {
          key: $,
          class: "query-row"
        }, [
          e("div", fa, [
            e("label", null, [
              l[41] || (l[41] = S("Name", -1)),
              j(e("input", {
                "onUpdate:modelValue": (B) => s.name = B,
                placeholder: "Parties"
              }, null, 8, ya), [
                [Z, s.name]
              ])
            ]),
            e("label", null, [
              l[42] || (l[42] = S("Chunks", -1)),
              j(e("input", {
                "onUpdate:modelValue": (B) => s.chunks = B,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, ha), [
                [
                  Z,
                  s.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          e("label", null, [
            l[43] || (l[43] = S("Query", -1)),
            j(e("textarea", {
              "onUpdate:modelValue": (B) => s.query = B,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, ga), [
              [Z, s.query]
            ])
          ]),
          t.readonly ? g("", !0) : (n(), o("button", {
            key: 0,
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo sm",
            onClick: (B) => a.value.prefetch.queries.splice($, 1)
          }, "Remove query", 8, ka))
        ]))), 128)),
        a.value.prefetch.queries.length ? g("", !0) : (n(), o("p", $a, "No fixed queries. Field search hints still run.")),
        t.readonly ? g("", !0) : (n(), o("button", {
          key: 1,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          onClick: l[5] || (l[5] = (s) => a.value.prefetch.queries.push(h(Pt)()))
        }, "Add query"))
      ], 64)) : g("", !0),
      t.stage === "scout" ? (n(), o(E, { key: 2 }, [
        e("div", xa, [
          l[45] || (l[45] = e("span", null, "Stage enabled", -1)),
          m(G, {
            modelValue: a.value.scout.enabled,
            "onUpdate:modelValue": l[6] || (l[6] = (s) => a.value.scout.enabled = s),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", wa, [
          l[46] || (l[46] = e("span", { id: "mode-label" }, "Mode", -1)),
          m(ye, {
            modelValue: a.value.scout.mode,
            "onUpdate:modelValue": l[7] || (l[7] = (s) => a.value.scout.mode = s),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          e("small", null, u(a.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        a.value.scout.mode === "loop" ? (n(), Q(Zl, {
          key: 0,
          rounds: a.value.scout.max_rounds,
          confidence: a.value.scout.target_confidence,
          extra: a.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"])) : g("", !0),
        l[51] || (l[51] = e("h4", null, "Models", -1)),
        e("div", Va, [
          l[47] || (l[47] = e("span", null, "Scout", -1)),
          m(oe, {
            value: a.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: l[8] || (l[8] = (s) => a.value.scout.model = s)
          }, null, 8, ["value"])
        ]),
        l[52] || (l[52] = e("h4", null, "Loop", -1)),
        m(X, {
          modelValue: a.value.scout.max_rounds,
          "onUpdate:modelValue": l[9] || (l[9] = (s) => a.value.scout.max_rounds = s),
          label: a.value.scout.mode === "agent" ? "Rounds" : "Follow-up rounds",
          min: r("max_rounds").min,
          max: r("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        a.value.scout.mode === "loop" ? (n(), Q(X, {
          key: 1,
          modelValue: a.value.scout.target_confidence,
          "onUpdate:modelValue": l[10] || (l[10] = (s) => a.value.scout.target_confidence = s),
          label: "Stop at confidence",
          min: r("target_confidence").min,
          max: r("target_confidence").max,
          step: 0.05,
          percent: "",
          hints: ["Stop early", "Keep looking"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])) : g("", !0),
        m(X, {
          modelValue: a.value.scout.max_extra_queries,
          "onUpdate:modelValue": l[11] || (l[11] = (s) => a.value.scout.max_extra_queries = s),
          label: a.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: r("max_extra_queries").min,
          max: r("max_extra_queries").max,
          disabled: t.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        m(X, {
          modelValue: a.value.scout.max_tokens,
          "onUpdate:modelValue": l[12] || (l[12] = (s) => a.value.scout.max_tokens = s),
          label: "Scout output limit",
          min: r("max_tokens").min,
          max: r("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        a.value.scout.mode === "agent" ? (n(), o("p", Sa, "Tool budget: " + u(a.value.scout.max_rounds * a.value.scout.max_extra_queries) + " calls.", 1)) : g("", !0),
        a.value.scout.mode === "loop" ? (n(), o("div", Ca, [
          l[48] || (l[48] = e("span", null, [
            S("Drop noisy chunks"),
            e("small", null, "Chunks no field needs leave the evidence pool; chunks cited for a field always stay.")
          ], -1)),
          m(G, {
            modelValue: a.value.scout.drop_noise,
            "onUpdate:modelValue": l[13] || (l[13] = (s) => a.value.scout.drop_noise = s),
            label: "Drop noisy chunks",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])) : g("", !0),
        e("div", Ea, [
          l[49] || (l[49] = e("span", null, [
            S("Share scout notes with extraction"),
            e("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          m(G, {
            modelValue: a.value.scout.share_notes,
            "onUpdate:modelValue": l[14] || (l[14] = (s) => a.value.scout.share_notes = s),
            label: "Share scout notes with extraction",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        a.value.scout.mode === "agent" ? (n(), o(E, { key: 4 }, [
          l[50] || (l[50] = e("h4", null, "Agent tools", -1)),
          (n(!0), o(E, null, A(h(c), (s) => (n(), o("div", {
            key: s,
            class: "toggle-row"
          }, [
            e("span", null, u(h(je)(s)), 1),
            m(G, {
              "model-value": a.value.scout.tools.includes(s),
              label: h(je)(s),
              disabled: t.readonly,
              "onUpdate:modelValue": ($) => k(s, $)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : g("", !0)
      ], 64)) : g("", !0),
      t.stage === "deep" ? (n(), o(E, { key: 3 }, [
        e("div", qa, [
          l[53] || (l[53] = e("span", null, "Stage enabled", -1)),
          m(G, {
            modelValue: a.value.deep.enabled,
            "onUpdate:modelValue": l[15] || (l[15] = (s) => a.value.deep.enabled = s),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        m(oa, {
          fields: y.value,
          parallel: a.value.deep.parallel_fields,
          queries: a.value.deep.max_queries,
          "per-query": a.value.deep.chunks_per_query,
          cap: a.value.deep.chunk_cap
        }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"]),
        e("div", Ua, [
          l[54] || (l[54] = e("span", { id: "read-label" }, "Reads", -1)),
          m(ye, {
            modelValue: a.value.deep.read,
            "onUpdate:modelValue": l[16] || (l[16] = (s) => a.value.deep.read = s),
            "labelled-by": "read-label",
            options: [{ value: "chunks", label: "Retrieved chunks" }, { value: "sections", label: "Whole sections" }]
          }, null, 8, ["modelValue"]),
          l[55] || (l[55] = e("small", null, "Whole sections suit clauses that span many passages; long sections fall back to chunks.", -1))
        ]),
        l[58] || (l[58] = e("h4", null, "Models", -1)),
        e("div", Fa, [
          l[56] || (l[56] = e("span", null, "Analysis", -1)),
          m(oe, {
            value: a.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: l[17] || (l[17] = (s) => a.value.deep.model = s)
          }, null, 8, ["value"])
        ]),
        e("div", Ma, [
          l[57] || (l[57] = e("span", null, "Query writer", -1)),
          m(oe, {
            value: a.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: l[18] || (l[18] = (s) => a.value.deep.query_model = s)
          }, null, 8, ["value"])
        ]),
        l[59] || (l[59] = e("h4", null, "Reach", -1)),
        m(X, {
          modelValue: a.value.deep.parallel_fields,
          "onUpdate:modelValue": l[19] || (l[19] = (s) => a.value.deep.parallel_fields = s),
          label: "Fields at a time",
          min: r("parallel_fields").min,
          max: r("parallel_fields").max,
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        m(X, {
          modelValue: a.value.deep.max_queries,
          "onUpdate:modelValue": l[20] || (l[20] = (s) => a.value.deep.max_queries = s),
          label: "Queries per field",
          min: r("max_queries").min,
          max: r("max_queries").max,
          log: "",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        m(X, {
          modelValue: a.value.deep.chunks_per_query,
          "onUpdate:modelValue": l[21] || (l[21] = (s) => a.value.deep.chunks_per_query = s),
          label: "Chunks per query",
          min: r("chunks_per_query").min,
          max: r("chunks_per_query").max,
          log: "",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        m(X, {
          modelValue: a.value.deep.chunk_cap,
          "onUpdate:modelValue": l[22] || (l[22] = (s) => a.value.deep.chunk_cap = s),
          label: "Chunk cap per field",
          min: r("chunk_cap").min,
          max: r("chunk_cap").max,
          log: "",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        m(X, {
          modelValue: a.value.deep.min_similarity,
          "onUpdate:modelValue": l[23] || (l[23] = (s) => a.value.deep.min_similarity = s),
          label: "Minimum similarity",
          min: r("min_similarity").min,
          max: r("min_similarity").max,
          step: 0.05,
          percent: "",
          hints: ["Loose", "Strict"],
          note: "Chunks less similar than this are skipped.",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        l[60] || (l[60] = e("h4", null, "Temperature", -1)),
        m(X, {
          modelValue: a.value.deep.query_temperature,
          "onUpdate:modelValue": l[24] || (l[24] = (s) => a.value.deep.query_temperature = s),
          label: "Query writing",
          min: r("query_temperature").min,
          max: r("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        m(X, {
          modelValue: a.value.deep.analysis_temperature,
          "onUpdate:modelValue": l[25] || (l[25] = (s) => a.value.deep.analysis_temperature = s),
          label: "Analysis",
          min: r("analysis_temperature").min,
          max: r("analysis_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : g("", !0),
      t.stage === "extract" ? (n(), o(E, { key: 4 }, [
        l[62] || (l[62] = e("h4", null, "Models", -1)),
        e("div", Na, [
          l[61] || (l[61] = e("span", null, "Extraction", -1)),
          m(oe, {
            value: a.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: l[26] || (l[26] = (s) => a.value.extract.model = s)
          }, null, 8, ["value"])
        ]),
        l[63] || (l[63] = e("h4", null, "Field groups", -1)),
        e("ul", Ba, [
          (n(!0), o(E, null, A(p.value, (s) => (n(), o("li", {
            key: s.name
          }, [
            e("span", null, u(s.name), 1),
            e("span", Ra, u(s.fields.length) + " field" + u(s.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        p.value.length ? g("", !0) : (n(), o("p", Ta, "No fields yet.")),
        m(X, {
          modelValue: a.value.extract.max_fields_per_call,
          "onUpdate:modelValue": l[27] || (l[27] = (s) => a.value.extract.max_fields_per_call = s),
          label: "Fields per call",
          min: r("max_fields_per_call").min,
          max: r("max_fields_per_call").max,
          disabled: t.readonly,
          note: `${h(at)(t.config)} extraction call${h(at)(t.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        m(X, {
          modelValue: a.value.extract.max_output_tokens,
          "onUpdate:modelValue": l[28] || (l[28] = (s) => a.value.extract.max_output_tokens = s),
          label: "Output limit",
          min: r("max_output_tokens").min,
          max: r("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : g("", !0),
      t.stage === "verify" ? (n(), o(E, { key: 5 }, [
        e("div", Aa, [
          l[64] || (l[64] = e("span", null, "Stage enabled", -1)),
          m(G, {
            modelValue: a.value.verify.enabled,
            "onUpdate:modelValue": l[29] || (l[29] = (s) => a.value.verify.enabled = s),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Oa, [
          l[65] || (l[65] = e("span", null, [
            S("Quotes exist"),
            e("small", null, "Each quote is matched against the document text. No model call.")
          ], -1)),
          m(G, {
            modelValue: a.value.verify.check_quotes,
            "onUpdate:modelValue": l[30] || (l[30] = (s) => a.value.verify.check_quotes = s),
            label: "Quotes exist",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Pa, [
          l[66] || (l[66] = e("span", null, [
            S("Quotes support values"),
            e("small", null, "A model confirms each quote supports its value.")
          ], -1)),
          m(G, {
            modelValue: a.value.verify.check_support,
            "onUpdate:modelValue": l[31] || (l[31] = (s) => a.value.verify.check_support = s),
            label: "Quotes support values",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        a.value.verify.check_support ? (n(), o(E, { key: 0 }, [
          l[68] || (l[68] = e("h4", null, "Models", -1)),
          e("div", Da, [
            l[67] || (l[67] = e("span", null, "Checker", -1)),
            m(oe, {
              value: a.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: l[32] || (l[32] = (s) => a.value.verify.model = s)
            }, null, 8, ["value"])
          ])
        ], 64)) : g("", !0)
      ], 64)) : g("", !0)
    ], 8, ia));
  }
}), _a = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, ja = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, Ia = ["x", "y", "width"], za = ["x", "width"], Ha = /* @__PURE__ */ I({
  __name: "ChunkDiagram",
  props: {
    size: {},
    overlap: {}
  },
  setup(t) {
    const i = t, a = F(() => Math.min(0.9, Math.max(0, i.overlap / i.size))), r = F(() => {
      const c = 100 / (3 - 2 * a.value);
      return [0, 1, 2].map((y) => ({ x: y * c * (1 - a.value), w: c }));
    });
    return (c, y) => (n(), o("figure", _a, [
      (n(), o("svg", ja, [
        (n(!0), o(E, null, A(r.value, (d, p) => (n(), o("rect", {
          key: p,
          x: d.x,
          y: p % 2 ? 14 : 4,
          width: d.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, Ia))), 128)),
        (n(), o(E, null, A([1, 2], (d) => e("rect", {
          key: "o" + d,
          x: r.value[d].x,
          y: 4,
          width: r.value[d - 1].x + r.value[d - 1].w - r.value[d].x,
          height: "24",
          class: "shared"
        }, null, 8, za)), 64))
      ])),
      e("figcaption", null, u(t.size.toLocaleString()) + " tokens per chunk · " + u(t.overlap.toLocaleString()) + " shared with the next (" + u(Math.round(a.value * 100)) + "%)", 1)
    ]));
  }
}), Wa = ["disabled"], Qa = { class: "muted" }, Ka = { class: "toggle-row" }, Ga = { class: "toggle-row" }, Ja = { class: "label-block" }, Ya = {
  key: 0,
  id: "context-model",
  class: "model-role"
}, Xa = { class: "label-block" }, Za = {
  id: "embedding-model",
  class: "model-role"
}, en = { class: "toggle-row" }, tn = {
  key: 1,
  id: "highlighter-model",
  class: "model-role"
}, ln = /* @__PURE__ */ I({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(t) {
    const i = t, a = F(() => i.config.retrieval), r = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], c = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], y = Oe("chunk_size"), d = Oe("overlap"), p = Oe("section_budget"), k = F(() => Math.min(d.max, a.value.chunk_size - 50));
    return (V, l) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("p", Qa, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + u(t.retention) + ".", 1),
      l[19] || (l[19] = e("h4", null, "Chunks", -1)),
      m(Ha, {
        size: a.value.chunk_size,
        overlap: a.value.overlap
      }, null, 8, ["size", "overlap"]),
      m(X, {
        modelValue: a.value.chunk_size,
        "onUpdate:modelValue": l[0] || (l[0] = (s) => a.value.chunk_size = s),
        label: "Chunk size",
        min: h(y).min,
        max: h(y).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: t.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      m(X, {
        modelValue: a.value.overlap,
        "onUpdate:modelValue": l[1] || (l[1] = (s) => a.value.overlap = s),
        label: "Overlap",
        min: h(d).min,
        max: k.value,
        step: 10,
        unit: "tokens",
        disabled: t.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      e("div", Ka, [
        l[11] || (l[11] = e("span", null, [
          S("Split by headings"),
          e("small", null, "A chunk never crosses a heading.")
        ], -1)),
        m(G, {
          modelValue: a.value.split_headings,
          "onUpdate:modelValue": l[2] || (l[2] = (s) => a.value.split_headings = s),
          label: "Split by headings",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      e("div", Ga, [
        l[12] || (l[12] = e("span", null, [
          S("Keep tables whole"),
          e("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        m(G, {
          modelValue: a.value.keep_tables,
          "onUpdate:modelValue": l[3] || (l[3] = (s) => a.value.keep_tables = s),
          label: "Keep tables whole",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      m(X, {
        modelValue: a.value.section_budget,
        "onUpdate:modelValue": l[4] || (l[4] = (s) => a.value.section_budget = s),
        label: "Section budget",
        min: h(p).min,
        max: h(p).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: t.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      l[20] || (l[20] = e("h4", null, "Context", -1)),
      e("div", Ja, [
        l[13] || (l[13] = e("span", { id: "context-label" }, "Chunk context", -1)),
        m(ye, {
          modelValue: a.value.context,
          "onUpdate:modelValue": l[5] || (l[5] = (s) => a.value.context = s),
          "labelled-by": "context-label",
          options: c
        }, null, 8, ["modelValue"]),
        e("small", null, u(c.find((s) => s.value === a.value.context)?.note), 1)
      ]),
      a.value.context === "generated" ? (n(), o("div", Ya, [
        l[14] || (l[14] = e("span", null, "Context writer", -1)),
        m(oe, {
          value: a.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: l[6] || (l[6] = (s) => a.value.context_model = s)
        }, null, 8, ["value"])
      ])) : g("", !0),
      l[21] || (l[21] = e("h4", null, "Search", -1)),
      e("div", Xa, [
        l[15] || (l[15] = e("span", { id: "mode-label" }, "Search mode", -1)),
        m(ye, {
          modelValue: a.value.search_mode,
          "onUpdate:modelValue": l[7] || (l[7] = (s) => a.value.search_mode = s),
          "labelled-by": "mode-label",
          options: r
        }, null, 8, ["modelValue"]),
        e("small", null, u(r.find((s) => s.value === a.value.search_mode)?.note), 1)
      ]),
      l[22] || (l[22] = e("h4", null, "Models", -1)),
      e("div", Za, [
        l[16] || (l[16] = e("span", null, "Embedding", -1)),
        m(oe, {
          value: a.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: l[8] || (l[8] = (s) => a.value.embedding_model = s)
        }, null, 8, ["value"])
      ]),
      e("div", en, [
        l[17] || (l[17] = e("span", null, [
          S("Highlighter"),
          e("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        m(G, {
          modelValue: a.value.highlighter,
          "onUpdate:modelValue": l[9] || (l[9] = (s) => a.value.highlighter = s),
          label: "Highlighter",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      a.value.highlighter ? (n(), o("div", tn, [
        l[18] || (l[18] = e("span", null, "Highlighter", -1)),
        m(oe, {
          value: a.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: l[10] || (l[10] = (s) => a.value.highlighter_model = s)
        }, null, 8, ["value"])
      ])) : g("", !0)
    ], 8, Wa));
  }
}), an = ["inert"], nn = { class: "canvas-inner" }, sn = {
  class: "block",
  "aria-labelledby": "fields-head"
}, on = { class: "block-head" }, un = ["aria-expanded"], dn = { class: "count" }, rn = {
  key: 0,
  class: "block-peek"
}, cn = {
  id: "fields-body",
  class: "block-body"
}, vn = {
  key: 0,
  class: "block-empty"
}, mn = {
  key: 2,
  class: "field-error",
  role: "alert"
}, pn = {
  key: 0,
  class: "group-rename"
}, bn = ["value", "aria-label", "onChange"], fn = ["onClick"], yn = { class: "row-name" }, hn = {
  key: 0,
  class: "req",
  title: "Required"
}, gn = { class: "chips" }, kn = {
  key: 1,
  class: "chip"
}, $n = ["title"], xn = { class: "chip" }, wn = {
  key: 3,
  class: "chip",
  title: "Evidence required"
}, Vn = {
  key: 0,
  class: "row-actions"
}, Sn = ["disabled", "onClick"], Cn = ["disabled", "onClick"], En = {
  class: "block",
  "aria-labelledby": "flow-head"
}, qn = { class: "block-head" }, Un = ["aria-expanded"], Fn = { class: "count" }, Mn = {
  key: 0,
  class: "block-peek"
}, Nn = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, Bn = { class: "node-icon" }, Rn = { class: "node-main" }, Tn = { class: "node-summary" }, An = { class: "node-side" }, On = { class: "chip model" }, Pn = { class: "branches" }, Dn = { class: "branch" }, Ln = { class: "branch" }, _n = { class: "node-icon" }, jn = { class: "node-main" }, In = { class: "node-summary" }, zn = ["aria-labelledby", "role", "aria-modal"], Hn = ["aria-valuenow"], Wn = { class: "side-panel-head" }, Qn = { class: "side-panel-icon" }, Kn = ["id"], Gn = ["aria-label", "title"], Jn = ["disabled"], Yn = {
  key: 4,
  class: "inspector-form"
}, Xn = { class: "output-list" }, Zn = { class: "mono" }, es = { class: "chip" }, ts = { class: "rail-label" }, Pe = 400, Ue = 320, ls = /* @__PURE__ */ I({
  __name: "Builder",
  props: /* @__PURE__ */ Re({
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
  setup(t) {
    const i = t, a = we(t, "title"), r = we(t, "description"), c = M({ kind: "document" });
    function y(w, v) {
      try {
        const C = localStorage.getItem(`docscout.${w}`);
        return C === null ? v : C === "1";
      } catch {
        return v;
      }
    }
    function d(w, v) {
      try {
        localStorage.setItem(`docscout.${w}`, v ? "1" : "0");
      } catch {
      }
    }
    const p = M(y("panel", !0)), k = M(y("fields", !0)), V = M(y("flow", !0));
    function l() {
      try {
        const w = Number(localStorage.getItem("docscout.panelWidth"));
        return w >= Ue ? w : Pe;
      } catch {
        return Pe;
      }
    }
    const s = M(l()), $ = () => {
      const w = N.value?.clientWidth;
      return w ? Math.max(Ue, w - 420) : Number.POSITIVE_INFINITY;
    };
    function B(w, v = !0) {
      if (s.value = Math.round(Math.min($(), Math.max(Ue, w))), v)
        try {
          localStorage.setItem("docscout.panelWidth", String(s.value));
        } catch {
        }
    }
    const D = M(!1);
    function O(w) {
      const v = w.currentTarget, C = w.clientX, _ = s.value;
      v.setPointerCapture(w.pointerId), D.value = !0;
      const ce = (wt) => B(_ + (C - wt.clientX), !1), Xe = () => {
        D.value = !1, B(s.value), v.removeEventListener("pointermove", ce), v.removeEventListener("pointerup", Xe);
      };
      v.addEventListener("pointermove", ce), v.addEventListener("pointerup", Xe);
    }
    function te(w) {
      w.key === "ArrowLeft" ? (B(s.value + 24), w.preventDefault()) : w.key === "ArrowRight" && (B(s.value - 24), w.preventDefault());
    }
    let W = null;
    const J = M(), H = Vt();
    async function K(w) {
      if (p.value = w, !q.value) {
        d("panel", w);
        return;
      }
      if (!w && W) {
        const v = W;
        W = null, await Ae(), v.focus();
      }
    }
    function T(w) {
      const v = w === "fields" ? k : V;
      v.value = !v.value, d(w, v.value);
    }
    const N = M(), q = M(!1);
    let le;
    Te(() => {
      le = new ResizeObserver(([w]) => {
        const v = q.value;
        q.value = w.contentRect.width < 1e3, q.value && !v && (p.value = !1), !q.value && v && (p.value = y("panel", !0));
      }), N.value && le.observe(N.value);
    }), rt(() => le?.disconnect());
    const re = M();
    ge(c, async () => {
      await Ae(), re.value && (re.value.scrollTop = 0);
    });
    async function Y(w) {
      q.value && !p.value && (W = N.value?.getRootNode()?.activeElement), c.value = w, p.value = !0, q.value && (await Ae(), J.value?.focus());
    }
    const ee = (w) => JSON.stringify(w) === JSON.stringify(c.value), ue = F(() => c.value.kind === "field" ? i.config.fields[c.value.index] : void 0), x = F(() => {
      const w = c.value;
      return w.kind === "stage" ? ve[w.stage] : w.kind === "field" ? ue.value?.name || "New field" : w.kind === "document" ? "Read document" : w.kind === "output" ? "Output" : "Details";
    }), b = F(() => {
      const w = c.value;
      return w.kind === "stage" ? ze[w.stage] : w.kind === "field" ? "tabler:forms" : w.kind === "document" ? "tabler:file-text" : w.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), f = F(() => i.config.fields.filter((w, v) => !(c.value.kind === "field" && c.value.index === v)).map(z)), U = F(() => i.config.stages.deep.enabled), P = F(() => i.config.stages.map.enabled), Ce = F(() => Ne(i.config.fields.map(z))), ae = M(""), se = M("");
    function ft(w, v) {
      const C = v.target.value.trim();
      if (!nt.test(C) || !C) {
        se.value = "Use a dotted path of snake_case group names.";
        return;
      }
      for (const _ of i.config.fields) (_.group === w || _.group.startsWith(w + ".")) && (_.group = C + _.group.slice(w.length));
      se.value = "";
    }
    function yt() {
      if (!ae.value || !nt.test(ae.value)) {
        se.value = "Use a dotted path of snake_case group names.";
        return;
      }
      Ke(ae.value), ae.value = "", se.value = "";
    }
    const ht = F(() => [...new Set(i.config.fields.map((w) => w.group.trim()).filter(Boolean))]), We = (w) => mt(i.config.fields[w], i.config.fields.filter((v, C) => C !== w).map(z)), Qe = ["map", "prefetch", "scout", "deep", "extract", "verify"], gt = F(() => Qe.filter((w) => Me(i.config, w)).map((w) => ve[w]).join(" · ")), kt = F(() => i.config.fields.map((w) => w.name || "New field").join(", ")), $t = F(() => Qe.filter((w) => Me(i.config, w)).length), me = (w) => i.result?.trace.find((v) => v.kind === w);
    function Ke(w = "") {
      i.config.fields.push({ ..._t(), group: w }), k.value = !0, Y({ kind: "field", index: i.config.fields.length - 1 });
    }
    function xt(w) {
      i.config.fields.splice(w, 1), c.value = { kind: "document" };
    }
    function Ge(w, v) {
      const C = i.config.fields, _ = w + v;
      if (_ < 0 || _ >= C.length) return;
      const [ce] = C.splice(w, 1);
      C.splice(_, 0, ce), c.value = { kind: "field", index: _ };
    }
    const Je = (w) => w.type === "list" ? `list of ${w.item?.type}` : w.type, Ye = F({ get: () => i.config.tags.join(", "), set: (w) => {
      i.config.tags = [...new Set(w.split(",").map((v) => v.trim()).filter(Boolean))];
    } });
    return (w, v) => (n(), o("div", {
      ref_key: "root",
      ref: N,
      class: L(["builder", { narrow: q.value, "panel-open": p.value, resizing: D.value }])
    }, [
      e("div", {
        class: "canvas",
        inert: q.value && p.value
      }, [
        e("div", nn, [
          e("section", sn, [
            e("header", on, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": k.value,
                "aria-controls": "fields-body",
                onClick: v[0] || (v[0] = (C) => T("fields"))
              }, [
                m(h(R), {
                  icon: k.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                v[22] || (v[22] = e("h2", { id: "fields-head" }, "Fields", -1)),
                e("span", dn, u(t.config.fields.length), 1)
              ], 8, un),
              !k.value && t.config.fields.length ? (n(), o("span", rn, u(kt.value), 1)) : g("", !0),
              t.readonly ? g("", !0) : (n(), o("button", {
                key: 1,
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo sm push",
                onClick: v[1] || (v[1] = (C) => Ke())
              }, [
                m(h(R), { icon: "tabler:plus" }),
                v[23] || (v[23] = S("Add field", -1))
              ]))
            ]),
            j(e("div", cn, [
              t.config.fields.length ? g("", !0) : (n(), o("p", vn, "Add the values to pull from each document.")),
              t.readonly ? g("", !0) : (n(), o("form", {
                key: 1,
                class: "group-add row",
                onSubmit: Ve(yt, ["prevent"])
              }, [
                e("label", null, [
                  v[24] || (v[24] = S("New group", -1)),
                  j(e("input", {
                    "onUpdate:modelValue": v[2] || (v[2] = (C) => ae.value = C),
                    placeholder: "parties.borrower",
                    "aria-label": "New group path"
                  }, null, 512), [
                    [
                      Z,
                      ae.value,
                      void 0,
                      { trim: !0 }
                    ]
                  ])
                ]),
                v[25] || (v[25] = e("button", {
                  type: "submit",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm"
                }, "Add group", -1))
              ], 32)),
              se.value ? (n(), o("p", mn, u(se.value), 1)) : g("", !0),
              m($e, { node: Ce.value }, {
                header: ie(({ path: C }) => [
                  t.readonly ? g("", !0) : (n(), o("label", pn, [
                    v[26] || (v[26] = S("Group path", -1)),
                    e("input", {
                      value: C,
                      "aria-label": `Rename group ${C}`,
                      onChange: (_) => ft(C, _)
                    }, null, 40, bn)
                  ]))
                ]),
                default: ie(({ index: C }) => [
                  (n(!0), o(E, null, A([t.config.fields[C]], (_) => (n(), o("div", {
                    key: C,
                    class: L(["row-item", { active: ee({ kind: "field", index: C }) }])
                  }, [
                    e("button", {
                      type: "button",
                      class: "row-main",
                      onClick: (ce) => Y({ kind: "field", index: C })
                    }, [
                      e("span", yn, [
                        S(u(_.name || "New field"), 1),
                        _.required ? (n(), o("span", hn, "*")) : g("", !0),
                        We(C) ? (n(), Q(h(R), {
                          key: 1,
                          icon: "tabler:alert-circle",
                          class: "row-warn",
                          title: We(C)
                        }, null, 8, ["title"])) : g("", !0)
                      ]),
                      e("span", {
                        class: L(["row-desc", { missing: !_.description }])
                      }, u(_.description || "No description"), 3),
                      e("span", gn, [
                        _.search_within === "sections" ? (n(), o("span", {
                          key: 0,
                          class: L(["chip", P.value ? "" : "muted-chip"]),
                          title: "Reads the sections Map picks"
                        }, "sections", 2)) : g("", !0),
                        _.group.trim() ? (n(), o("span", kn, u(_.group), 1)) : g("", !0),
                        _.strategy === "deep" ? (n(), o("span", {
                          key: 2,
                          class: L(["chip", U.value ? "primary" : "muted-chip"]),
                          title: U.value ? "Deep analysis" : "Deep analysis is off in the flow"
                        }, "deep", 10, $n)) : g("", !0),
                        e("span", xn, u(Je(_)), 1),
                        _.evidence_required ? (n(), o("span", wn, [
                          m(h(R), { icon: "tabler:quote" })
                        ])) : g("", !0)
                      ])
                    ], 8, fn),
                    t.readonly ? g("", !0) : (n(), o("span", Vn, [
                      e("button", {
                        type: "button",
                        class: "kx-iconbtn kx-focus-outline",
                        "aria-label": "Move field up",
                        disabled: C === 0,
                        onClick: (ce) => Ge(C, -1)
                      }, [
                        m(h(R), { icon: "tabler:chevron-up" })
                      ], 8, Sn),
                      e("button", {
                        type: "button",
                        class: "kx-iconbtn kx-focus-outline",
                        "aria-label": "Move field down",
                        disabled: C === t.config.fields.length - 1,
                        onClick: (ce) => Ge(C, 1)
                      }, [
                        m(h(R), { icon: "tabler:chevron-down" })
                      ], 8, Cn)
                    ]))
                  ], 2))), 128))
                ]),
                _: 1
              }, 8, ["node"])
            ], 512), [
              [_e, k.value]
            ])
          ]),
          e("section", En, [
            e("header", qn, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": V.value,
                "aria-controls": "flow-body",
                onClick: v[3] || (v[3] = (C) => T("flow"))
              }, [
                m(h(R), {
                  icon: V.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                v[27] || (v[27] = e("h2", { id: "flow-head" }, "Flow", -1)),
                e("span", Fn, u($t.value) + " of 6", 1)
              ], 8, Un),
              V.value ? g("", !0) : (n(), o("span", Mn, u(gt.value), 1)),
              e("button", {
                type: "button",
                class: L(["kx-btn kx-btn-ghost kx-focus-halo sm push", { on: ee({ kind: "details" }) }]),
                onClick: v[4] || (v[4] = (C) => Y({ kind: "details" }))
              }, [
                m(h(R), { icon: "tabler:info-circle" }),
                v[28] || (v[28] = S("Details", -1))
              ], 2)
            ]),
            j(e("div", Nn, [
              e("button", {
                type: "button",
                class: L(["node kx-focus-halo fixed", { active: ee({ kind: "document" }) }]),
                onClick: v[5] || (v[5] = (C) => Y({ kind: "document" }))
              }, [
                e("span", Bn, [
                  m(h(R), { icon: "tabler:file-text" })
                ]),
                e("span", Rn, [
                  v[29] || (v[29] = e("span", { class: "node-title" }, "Read document", -1)),
                  e("span", Tn, u(h(Lt)(t.config.retrieval)), 1)
                ]),
                e("span", An, [
                  e("span", On, u(h(vt)(t.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              v[34] || (v[34] = e("div", { class: "connector" }, null, -1)),
              m(pe, {
                stage: "map",
                config: t.config,
                active: ee({ kind: "stage", stage: "map" }),
                trace: me("map"),
                readonly: t.readonly,
                onSelect: v[6] || (v[6] = (C) => Y({ kind: "stage", stage: "map" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[35] || (v[35] = e("div", {
                class: "fork",
                "aria-hidden": "true"
              }, [
                e("span")
              ], -1)),
              e("div", Pn, [
                e("div", Dn, [
                  v[30] || (v[30] = e("span", { class: "branch-label" }, "Evidence", -1)),
                  m(pe, {
                    stage: "prefetch",
                    config: t.config,
                    active: ee({ kind: "stage", stage: "prefetch" }),
                    trace: me("prefetch"),
                    readonly: t.readonly,
                    onSelect: v[7] || (v[7] = (C) => Y({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  v[31] || (v[31] = e("div", { class: "connector" }, null, -1)),
                  m(pe, {
                    stage: "scout",
                    config: t.config,
                    active: ee({ kind: "stage", stage: "scout" }),
                    trace: me("scout"),
                    readonly: t.readonly,
                    onSelect: v[8] || (v[8] = (C) => Y({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                e("div", Ln, [
                  v[32] || (v[32] = e("span", { class: "branch-label" }, "Deep fields", -1)),
                  m(pe, {
                    stage: "deep",
                    config: t.config,
                    active: ee({ kind: "stage", stage: "deep" }),
                    trace: me("deep"),
                    readonly: t.readonly,
                    onSelect: v[9] || (v[9] = (C) => Y({ kind: "stage", stage: "deep" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ])
              ]),
              v[36] || (v[36] = e("div", {
                class: "join",
                "aria-hidden": "true"
              }, [
                e("span")
              ], -1)),
              m(pe, {
                stage: "extract",
                config: t.config,
                active: ee({ kind: "stage", stage: "extract" }),
                trace: me("extract"),
                readonly: t.readonly,
                onSelect: v[10] || (v[10] = (C) => Y({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[37] || (v[37] = e("div", { class: "connector" }, null, -1)),
              m(pe, {
                stage: "verify",
                config: t.config,
                active: ee({ kind: "stage", stage: "verify" }),
                trace: me("verify"),
                readonly: t.readonly,
                onSelect: v[11] || (v[11] = (C) => Y({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              v[38] || (v[38] = e("div", { class: "connector" }, null, -1)),
              e("button", {
                type: "button",
                class: L(["node kx-focus-halo fixed", { active: ee({ kind: "output" }) }]),
                onClick: v[12] || (v[12] = (C) => Y({ kind: "output" }))
              }, [
                e("span", _n, [
                  m(h(R), { icon: "tabler:braces" })
                ]),
                e("span", jn, [
                  v[33] || (v[33] = e("span", { class: "node-title" }, "Output", -1)),
                  e("span", In, u(t.config.fields.length ? `${t.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [_e, V.value]
            ])
          ])
        ])
      ], 8, an),
      q.value && p.value ? (n(), o("div", {
        key: 0,
        class: "scrim",
        onClick: v[13] || (v[13] = (C) => K(!1))
      })) : g("", !0),
      p.value ? j((n(), o("aside", {
        key: String(q.value),
        class: "side-panel",
        "aria-labelledby": h(H),
        role: q.value ? "dialog" : void 0,
        "aria-modal": q.value ? "true" : void 0,
        style: he(q.value ? void 0 : { width: `${s.value}px` }),
        onKeydown: v[20] || (v[20] = De((C) => q.value && K(!1), ["esc"]))
      }, [
        q.value ? g("", !0) : (n(), o("div", {
          key: 0,
          class: L(["resizer kx-focus-outline", { active: D.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": s.value,
          "aria-valuemin": Ue,
          onPointerdown: Ve(O, ["prevent"]),
          onKeydown: te,
          onDblclick: v[14] || (v[14] = (C) => B(Pe))
        }, null, 42, Hn)),
        e("header", Wn, [
          e("span", Qn, [
            m(h(R), { icon: b.value }, null, 8, ["icon"])
          ]),
          e("h2", { id: h(H) }, u(x.value), 9, Kn),
          e("button", {
            ref_key: "closeButton",
            ref: J,
            type: "button",
            class: "kx-iconbtn kx-focus-outline push",
            "aria-label": q.value ? "Close panel" : "Collapse panel",
            title: q.value ? "Close panel" : "Collapse panel",
            onClick: v[15] || (v[15] = (C) => K(!1))
          }, [
            m(h(R), {
              icon: q.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ], 8, Gn)
        ]),
        e("div", {
          ref_key: "panelBody",
          ref: re,
          class: "side-panel-body"
        }, [
          c.value.kind === "document" ? (n(), Q(ln, {
            key: 0,
            config: t.config,
            retention: t.retention,
            readonly: t.readonly
          }, null, 8, ["config", "retention", "readonly"])) : c.value.kind === "stage" ? (n(), Q(La, {
            key: 1,
            stage: c.value.stage,
            config: t.config,
            readonly: t.readonly
          }, null, 8, ["stage", "config", "readonly"])) : c.value.kind === "field" && ue.value ? (n(), Q(Tl, {
            key: 2,
            field: ue.value,
            "other-names": f.value,
            groups: ht.value,
            "deep-enabled": U.value,
            "map-enabled": P.value,
            readonly: t.readonly,
            onRemove: v[16] || (v[16] = (C) => xt(c.value.index))
          }, null, 8, ["field", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"])) : c.value.kind === "details" ? (n(), o("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: t.readonly
          }, [
            e("label", null, [
              v[39] || (v[39] = S("Name", -1)),
              j(e("input", {
                "onUpdate:modelValue": v[17] || (v[17] = (C) => a.value = C),
                "aria-label": "Extractor name"
              }, null, 512), [
                [Z, a.value]
              ])
            ]),
            e("label", null, [
              v[40] || (v[40] = S("Description", -1)),
              j(e("textarea", {
                "onUpdate:modelValue": v[18] || (v[18] = (C) => r.value = C),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [Z, r.value]
              ])
            ]),
            e("label", null, [
              v[41] || (v[41] = S("Tags", -1)),
              j(e("input", {
                "onUpdate:modelValue": v[19] || (v[19] = (C) => Ye.value = C),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  Z,
                  Ye.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              v[42] || (v[42] = e("small", null, "Comma separated", -1))
            ])
          ], 8, Jn)) : c.value.kind === "output" ? (n(), o("div", Yn, [
            v[43] || (v[43] = e("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            e("ul", Xn, [
              (n(!0), o(E, null, A(t.config.fields, (C) => (n(), o("li", {
                key: h(z)(C)
              }, [
                e("span", Zn, u(h(z)(C) || "New field"), 1),
                e("span", es, u(Je(C)), 1)
              ]))), 128))
            ]),
            v[44] || (v[44] = e("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : g("", !0)
        ], 512)
      ], 44, zn)), [
        [h(Yt), { disabled: !q.value }]
      ]) : q.value ? g("", !0) : (n(), o("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: v[21] || (v[21] = (C) => K(!0))
      }, [
        m(h(R), { icon: "tabler:layout-sidebar-right-expand" }),
        e("span", ts, u(x.value), 1)
      ]))
    ], 2));
  }
}), as = ["selected"], ns = {
  key: 1,
  role: "alert"
}, ss = {
  key: 2,
  class: "muted"
}, pt = /* @__PURE__ */ I({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(t, { emit: i }) {
    const a = i, r = M(!1), c = M("");
    Te(async () => {
      try {
        await He("wc-multiselect", { timeoutMs: 8e3 }), r.value = !0;
      } catch (d) {
        c.value = String(d);
      }
    });
    function y(d) {
      const p = d.detail;
      a("select", p.selected[0] || "", p.labels?.[0] || "");
    }
    return (d, p) => r.value ? (n(), o("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(t.value ? [t.value] : []),
      placeholder: "Choose an upload",
      onChange: y
    }, null, 40, as)) : c.value ? (n(), o("p", ns, u(c.value), 1)) : (n(), o("span", ss, "Loading uploads…"));
  }
}), os = { class: "nested-value" }, is = { key: 0 }, us = {
  key: 0,
  class: "muted"
}, ds = { key: 1 }, rs = { key: 2 }, xe = /* @__PURE__ */ I({
  __name: "NestedValue",
  props: {
    value: {}
  },
  setup(t) {
    const i = t, a = F(() => i.value !== null && typeof i.value == "object" && !Array.isArray(i.value) ? i.value : null);
    return (r, c) => {
      const y = Ie("NestedValue", !0);
      return n(), o("div", os, [
        Array.isArray(t.value) ? (n(), o("ol", is, [
          (n(!0), o(E, null, A(t.value, (d, p) => (n(), o("li", { key: p }, [
            m(y, { value: d }, null, 8, ["value"])
          ]))), 128)),
          t.value.length ? g("", !0) : (n(), o("li", us, "Empty list"))
        ])) : a.value ? (n(), o("dl", ds, [
          (n(!0), o(E, null, A(a.value, (d, p) => (n(), o(E, { key: p }, [
            e("dt", null, u(p), 1),
            e("dd", null, [
              m(y, { value: d }, null, 8, ["value"])
            ])
          ], 64))), 128))
        ])) : (n(), o("span", rs, u(t.value === null || t.value === void 0 ? "—" : String(t.value)), 1))
      ]);
    };
  }
}), cs = { class: "value-list" }, vs = ["aria-expanded", "onClick"], ms = { class: "value-name" }, ps = { class: "bar" }, bs = ["title"], fs = { class: "evidence" }, ys = {
  key: 1,
  class: "muted"
}, hs = {
  key: 2,
  class: "muted"
}, bt = /* @__PURE__ */ I({
  __name: "ResultFields",
  props: {
    fields: {}
  },
  setup(t) {
    const i = t, a = F(() => Ne(i.fields.map((k) => k.path))), r = M(), c = (k) => `${Math.round(k * 100)}%`, y = (k) => k !== null && typeof k == "object", d = (k) => Array.isArray(k) ? `${k.length} items` : y(k) ? `${Object.keys(k).length} properties` : k == null ? "—" : String(k), p = (k) => k >= 0.9 ? "high" : k >= 0.7 ? "mid" : "low";
    return (k, V) => (n(), o("div", cs, [
      m($e, { node: a.value }, {
        default: ie(({ index: l }) => [
          (n(!0), o(E, null, A([t.fields[l]], (s) => (n(), o("div", {
            key: s.path,
            class: "value-row"
          }, [
            e("button", {
              type: "button",
              class: "value-main",
              "aria-expanded": r.value === s.path,
              onClick: ($) => r.value = r.value === s.path ? void 0 : s.path
            }, [
              e("span", ms, u(s.name), 1),
              e("span", {
                class: L(["value-text", { missing: s.missing }])
              }, u(s.missing ? "Not in the document" : d(s.value)), 3),
              e("span", {
                class: L(["confidence", p(s.confidence)])
              }, [
                e("span", ps, [
                  e("span", {
                    style: he({ width: c(s.confidence) })
                  }, null, 4)
                ]),
                S(u(c(s.confidence)), 1),
                V[0] || (V[0] = e("span", { class: "conf-word" }, " confidence", -1))
              ], 2),
              e("span", {
                class: L(["chip", s.verified ? "primary" : "warn"]),
                title: s.reason
              }, [
                m(h(R), {
                  icon: s.verified ? "tabler:shield-check" : "tabler:shield-question"
                }, null, 8, ["icon"]),
                S(u(s.verified ? "Verified" : "Check"), 1)
              ], 10, bs),
              m(h(R), {
                icon: r.value === s.path ? "tabler:chevron-up" : "tabler:chevron-down",
                class: "value-caret"
              }, null, 8, ["icon"])
            ], 8, vs),
            !s.missing && y(s.value) ? (n(), Q(xe, {
              key: 0,
              class: "structured-value",
              value: s.value
            }, null, 8, ["value"])) : g("", !0),
            j(e("div", fs, [
              !s.missing && !y(s.value) ? (n(), Q(xe, {
                key: 0,
                value: s.value
              }, null, 8, ["value"])) : g("", !0),
              (n(!0), o(E, null, A(s.evidence, ($, B) => (n(), o("blockquote", {
                key: B,
                class: L({ unfound: $.found === !1 })
              }, [
                e("p", null, "“" + u($.quote) + "”", 1),
                e("cite", null, [
                  S(u($.section), 1),
                  $.page !== void 0 && $.page !== null ? (n(), o(E, { key: 0 }, [
                    S(" · Page " + u($.page), 1)
                  ], 64)) : g("", !0),
                  $.found === !1 ? (n(), o(E, { key: 1 }, [
                    S(" · not found word for word in the document")
                  ], 64)) : g("", !0)
                ])
              ], 2))), 128)),
              s.evidence.length ? g("", !0) : (n(), o("p", ys, "No evidence.")),
              s.reason ? (n(), o("p", hs, u(s.reason), 1)) : g("", !0)
            ], 512), [
              [_e, r.value === s.path]
            ])
          ]))), 128))
        ]),
        _: 1
      }, 8, ["node"])
    ]));
  }
}), gs = { class: "test" }, ks = { class: "run-bar" }, $s = { class: "run-input" }, xs = { class: "muted run-note" }, ws = {
  key: 0,
  class: "empty"
}, Vs = {
  key: 1,
  class: "run-failed",
  role: "alert"
}, Ss = {
  key: 2,
  class: "test-grid"
}, Cs = { class: "block" }, Es = { class: "block-head" }, qs = { class: "muted push" }, Us = { class: "block" }, Fs = { class: "timeline" }, Ms = { class: "tl-icon" }, Ns = { class: "tl-main" }, Bs = { class: "tl-head" }, Rs = { class: "muted push" }, Ts = { class: "tl-bar" }, As = { class: "muted" }, Os = {
  key: 0,
  class: "tl-msg"
}, Ps = {
  key: 1,
  class: "chips"
}, Ds = /* @__PURE__ */ I({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {},
    running: { type: Boolean },
    canRun: { type: Boolean }
  },
  emits: ["run"],
  setup(t, { emit: i }) {
    const a = t, r = i, c = M(""), y = (l) => `${(l / 1e3).toFixed(1)}s`, d = F(() => Math.max(1, ...a.result?.trace.map((l) => l.duration_ms) ?? [1])), p = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, k = (l) => p[l]?.label ?? ve[l] ?? l, V = (l) => p[l]?.icon ?? ze[l] ?? "tabler:point";
    return (l, s) => (n(), o("div", gs, [
      e("section", ks, [
        e("div", $s, [
          m(pt, {
            value: c.value,
            onSelect: s[0] || (s[0] = ($) => c.value = $)
          }, null, 8, ["value"])
        ]),
        m(h(ne), {
          label: t.running ? "Extracting…" : "Run extraction",
          loading: t.running,
          disabled: !c.value || t.running || !t.canRun,
          onClick: s[1] || (s[1] = ($) => r("run", c.value))
        }, null, 8, ["label", "loading", "disabled"]),
        e("p", xs, u(t.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + u(t.retention) + ".", 1)
      ]),
      t.result ? g("", !0) : (n(), o("p", ws, "No extraction results yet.")),
      t.result?.status === "failed" ? (n(), o("p", Vs, [
        m(h(R), { icon: "tabler:alert-triangle" }),
        S("The run stopped: " + u(t.result.error), 1)
      ])) : g("", !0),
      t.result ? (n(), o("div", Ss, [
        e("section", Cs, [
          e("header", Es, [
            s[2] || (s[2] = e("h2", { class: "block-title" }, "Values", -1)),
            e("span", qs, [
              S(u(t.result.tokens.toLocaleString()) + " tokens · " + u(y(t.result.duration_ms)), 1),
              t.result.pages ? (n(), o(E, { key: 0 }, [
                S(" · " + u(t.result.pages) + " pages", 1)
              ], 64)) : g("", !0)
            ])
          ]),
          m(bt, {
            fields: t.result.fields
          }, null, 8, ["fields"])
        ]),
        e("section", Us, [
          s[3] || (s[3] = e("header", { class: "block-head" }, [
            e("h2", { class: "block-title" }, "Steps")
          ], -1)),
          e("ol", Fs, [
            (n(!0), o(E, null, A(t.result.trace, ($, B) => (n(), o("li", {
              key: B,
              class: L($.status)
            }, [
              e("span", Ms, [
                m(h(R), {
                  icon: V($.kind)
                }, null, 8, ["icon"])
              ]),
              e("div", Ns, [
                e("div", Bs, [
                  e("strong", null, u(k($.kind)), 1),
                  e("span", Rs, u(y($.duration_ms)), 1)
                ]),
                e("span", Ts, [
                  e("span", {
                    style: he({ width: `${Math.max(4, $.duration_ms / d.value * 100)}%` })
                  }, null, 4)
                ]),
                e("p", As, [
                  S(u($.scope), 1),
                  $.model ? (n(), o(E, { key: 0 }, [
                    S(" · " + u($.model), 1)
                  ], 64)) : g("", !0),
                  S(" · " + u(($.input_tokens + $.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                $.message ? (n(), o("p", Os, u($.message), 1)) : g("", !0),
                $.queries?.length ? (n(), o("div", Ps, [
                  (n(!0), o(E, null, A($.queries, (D) => (n(), o("span", {
                    key: D,
                    class: "chip"
                  }, u(D), 1))), 128))
                ])) : g("", !0)
              ])
            ], 2))), 128))
          ])
        ])
      ])) : g("", !0)
    ]));
  }
}), Fe = (t) => t.status === "completed" || t.status === "failed", fe = (t) => t.metrics.length ? t.metrics.reduce((i, a) => i + a.accuracy, 0) / t.metrics.length : 0;
function Be(t, i = /* @__PURE__ */ new Date()) {
  const a = new Date(t);
  return a.toDateString() === i.toDateString() ? a.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" }) : a.getFullYear() === i.getFullYear() ? a.toLocaleString(void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : a.toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
}
const Ls = { class: "evals" }, _s = { class: "block eval-run" }, js = { class: "eval-run-main" }, Is = { class: "block-title" }, zs = {
  key: 0,
  class: "eval-note"
}, Hs = {
  key: 0,
  class: "eval-progress",
  role: "status"
}, Ws = { class: "bar" }, Qs = { class: "muted" }, Ks = { class: "stat-row" }, Gs = { class: "stat" }, Js = { class: "stat-label" }, Ys = { class: "stat-value" }, Xs = { class: "stat" }, Zs = { class: "stat-value" }, eo = { class: "stat-delta flat" }, to = { class: "stat" }, lo = { class: "stat-value" }, ao = {
  key: 0,
  class: "stat-delta flat"
}, no = { class: "stat" }, so = { class: "stat-value" }, oo = {
  key: 0,
  class: "stat-delta flat"
}, io = { class: "block" }, uo = { class: "block-head" }, ro = {
  key: 0,
  class: "compare-pick push"
}, co = ["value"], vo = ["value"], mo = {
  key: 0,
  class: "block-empty"
}, po = {
  key: 1,
  class: "table-scroll"
}, bo = { key: 0 }, fo = { key: 1 }, yo = { class: "mono" }, ho = { class: "acc strong" }, go = { class: "bar" }, ko = { class: "muted" }, $o = {
  key: 0,
  class: "muted"
}, xo = { key: 1 }, wo = {
  key: 1,
  class: "muted"
}, Vo = {
  key: 1,
  class: "block"
}, So = { class: "table-scroll" }, Co = { class: "metric-table result-matrix" }, Eo = ["aria-expanded", "onClick"], qo = ["colspan"], Uo = {
  key: 0,
  class: "cell-state"
}, Fo = ["data-error-kind", "title"], Mo = ["data-label"], No = ["title"], Bo = {
  key: 0,
  class: "result-detail"
}, Ro = ["colspan"], To = ["data-error-kind", "title"], Ao = { class: "mono" }, Oo = { class: "cmp" }, Po = { class: "cmp" }, Do = { class: "muted case-meta" }, Lo = { class: "block" }, _o = { class: "block-head" }, jo = { class: "count" }, Io = { class: "mono" }, zo = ["onUpdate:modelValue"], Ho = ["onUpdate:modelValue"], Wo = ["onUpdate:modelValue", "placeholder"], Qo = ["onUpdate:modelValue", "type"], Ko = {
  key: 0,
  class: "error",
  role: "alert"
}, Go = { class: "row" }, Jo = {
  key: 1,
  class: "block-empty"
}, Yo = {
  key: 2,
  class: "block-empty"
}, Xo = {
  key: 3,
  class: "table-scroll"
}, Zo = { class: "metric-table case-table" }, ei = { class: "case-value" }, ti = {
  key: 1,
  class: "muted"
}, li = { class: "num" }, ai = ["aria-label", "disabled", "onClick"], ni = {
  key: 2,
  class: "block"
}, si = { class: "block-head" }, oi = { class: "count" }, ii = { class: "eval-history" }, ui = ["aria-current", "onClick"], di = ["data-status"], ri = { class: "muted" }, ci = { class: "push" }, vi = /* @__PURE__ */ I({
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
  setup(t, { emit: i }) {
    const a = t, r = i, c = M(!1), y = M(""), d = M({}), p = M("");
    ge(() => a.addedCaseId, () => {
      c.value = !1, y.value = "", d.value = {};
    });
    function k(x, b) {
      return x.type === "number" ? Number(b) : x.type === "boolean" ? b === "true" : x.type === "list" || x.type === "object" ? JSON.parse(b) : b;
    }
    function V() {
      p.value = "";
      const x = {};
      try {
        for (const b of a.fields) {
          const f = String(d.value[z(b)] ?? "").trim();
          f && jt(x, z(b), k(b, f));
        }
      } catch {
        p.value = 'Lists and objects need valid JSON, for example ["a","b"] or {"city":"Hamburg"}.';
        return;
      }
      r("add-case", { upload_id: y.value, expected: x });
    }
    const l = F(() => a.evaluations.find((x) => !Fe(x))), s = F(() => a.evaluations.filter(Fe)), $ = F(() => a.evaluation), B = F(() => ({ done: ($.value?.results ?? []).filter((b) => b.status !== "queued").length, total: $.value?.case_count ?? 0 })), D = M();
    ge(() => $.value?.id, () => {
      D.value = void 0;
    });
    const O = F(() => {
      if (!$.value) return;
      if (D.value) return s.value.find((b) => b.id === D.value);
      const x = s.value.findIndex((b) => b.id === $.value.id);
      return x >= 0 ? s.value[x + 1] : s.value[0];
    }), te = F(() => ($.value?.metrics ?? []).map((x) => ({ ...x, before: O.value?.metrics.find((b) => b.field === x.field) }))), W = F(() => ($.value?.fields ?? []).map(z)), J = F(() => Ne(a.fields.map(z))), H = (x, b) => x.scores.find((f) => f.field === b), K = M(), T = (x) => `${Math.round(x * 100)}%`, N = (x) => {
      const b = Math.round(x * 100);
      return `${b > 0 ? "+" : b < 0 ? "−" : "±"}${Math.abs(b)} pts`;
    }, q = (x) => Math.round(x * 100) > 0 ? "up" : Math.round(x * 100) < 0 ? "down" : "flat", le = (x) => x >= 6e4 ? `${Math.floor(x / 6e4)}m ${Math.round(x % 6e4 / 1e3)}s` : `${(x / 1e3).toFixed(1)}s`, re = (x) => x == null || x === "" ? "—" : typeof x == "string" ? x : Array.isArray(x) && x.every((b) => typeof b != "object") ? x.join(", ") : JSON.stringify(x), Y = (x) => x ? x.score >= 0.999 ? "pass" : x.score > 0 ? "partial" : "fail" : "none", ee = (x) => (x.results ?? []).filter((b) => b.status === "completed").length, ue = { queued: "Queued", running: "Running", completed: "Completed", failed: "Failed" };
    return (x, b) => (n(), o("div", Ls, [
      e("section", _s, [
        e("div", js, [
          e("div", null, [
            e("h2", Is, "Evaluate revision " + u(t.revision), 1),
            b[6] || (b[6] = e("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            t.changed ? (n(), o("p", zs, [
              m(h(R), { icon: "tabler:info-circle" }),
              b[5] || (b[5] = S("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : g("", !0)
          ]),
          m(h(ne), {
            label: l.value ? "Evaluating…" : "Run all cases",
            loading: t.starting || !!l.value,
            disabled: !t.cases.length || !t.fields.length || !!l.value || t.starting,
            onClick: b[0] || (b[0] = (f) => r("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        $.value && !h(Fe)($.value) ? (n(), o("div", Hs, [
          e("span", Ws, [
            e("span", {
              style: he({ width: T(B.value.total ? B.value.done / B.value.total : 0) })
            }, null, 4)
          ]),
          e("span", Qs, u(ue[$.value.status]) + " · " + u(B.value.done) + " of " + u(B.value.total) + " cases", 1)
        ])) : g("", !0)
      ]),
      $.value && h(Fe)($.value) ? (n(), o(E, { key: 0 }, [
        $.value.error ? (n(), o("p", {
          key: 0,
          class: L($.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          m(h(R), { icon: "tabler:alert-triangle" }),
          S(u($.value.error), 1)
        ], 2)) : g("", !0),
        e("div", Ks, [
          e("div", Gs, [
            e("span", Js, "Accuracy · revision " + u($.value.config_revision), 1),
            e("span", Ys, u(T(h(fe)($.value))), 1),
            O.value ? (n(), o("span", {
              key: 0,
              class: L(["stat-delta", q(h(fe)($.value) - h(fe)(O.value))])
            }, u(N(h(fe)($.value) - h(fe)(O.value))) + " vs revision " + u(O.value.config_revision), 3)) : g("", !0)
          ]),
          e("div", Xs, [
            b[7] || (b[7] = e("span", { class: "stat-label" }, "Cases", -1)),
            e("span", Zs, [
              S(u(ee($.value)), 1),
              e("small", null, " / " + u($.value.case_count), 1)
            ]),
            e("span", eo, u($.value.case_count - ee($.value)) + " failed", 1)
          ]),
          e("div", to, [
            b[8] || (b[8] = e("span", { class: "stat-label" }, "Tokens", -1)),
            e("span", lo, u($.value.tokens.toLocaleString()), 1),
            O.value ? (n(), o("span", ao, u(O.value.tokens.toLocaleString()) + " before", 1)) : g("", !0)
          ]),
          e("div", no, [
            b[9] || (b[9] = e("span", { class: "stat-label" }, "Model time", -1)),
            e("span", so, u(le($.value.duration_ms)), 1),
            O.value ? (n(), o("span", oo, u(le(O.value.duration_ms)) + " before", 1)) : g("", !0)
          ])
        ]),
        e("section", io, [
          e("header", uo, [
            b[11] || (b[11] = e("h2", { class: "block-title" }, "Field accuracy", -1)),
            s.value.length > 1 ? (n(), o("label", ro, [
              b[10] || (b[10] = e("span", { class: "muted" }, "Compare with", -1)),
              e("select", {
                value: O.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: b[1] || (b[1] = (f) => D.value = f.target.value)
              }, [
                (n(!0), o(E, null, A(s.value.filter((f) => f.id !== $.value.id), (f) => (n(), o("option", {
                  key: f.id,
                  value: f.id
                }, "Revision " + u(f.config_revision) + " · " + u(h(Be)(f.created_at)), 9, vo))), 128))
              ], 40, co)
            ])) : g("", !0)
          ]),
          te.value.length ? (n(), o("div", po, [
            e("table", {
              class: L(["metric-table accuracy-table", { comparing: !!O.value }])
            }, [
              e("thead", null, [
                e("tr", null, [
                  b[12] || (b[12] = e("th", null, "Field", -1)),
                  b[13] || (b[13] = e("th", null, "Accuracy", -1)),
                  b[14] || (b[14] = e("th", null, "Verified", -1)),
                  O.value ? (n(), o("th", bo, "Revision " + u(O.value.config_revision), 1)) : g("", !0),
                  O.value ? (n(), o("th", fo, "Change")) : g("", !0)
                ])
              ]),
              e("tbody", null, [
                (n(!0), o(E, null, A(te.value, (f) => (n(), o("tr", {
                  key: f.field
                }, [
                  e("td", yo, u(f.field), 1),
                  e("td", null, [
                    e("span", ho, [
                      e("span", go, [
                        e("span", {
                          style: he({ width: T(f.accuracy) })
                        }, null, 4)
                      ]),
                      S(u(T(f.accuracy)), 1)
                    ])
                  ]),
                  e("td", ko, u(T(f.verified)), 1),
                  O.value ? (n(), o("td", $o, u(f.before ? T(f.before.accuracy) : "—"), 1)) : g("", !0),
                  O.value ? (n(), o("td", xo, [
                    f.before ? (n(), o("span", {
                      key: 0,
                      class: L(["trend", q(f.accuracy - f.before.accuracy)])
                    }, [
                      m(h(R), {
                        icon: q(f.accuracy - f.before.accuracy) === "up" ? "tabler:trending-up" : q(f.accuracy - f.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      S(u(N(f.accuracy - f.before.accuracy)), 1)
                    ], 2)) : (n(), o("span", wo, "New field"))
                  ])) : g("", !0)
                ]))), 128))
              ])
            ], 2)
          ])) : (n(), o("p", mo, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : g("", !0),
      $.value?.results?.length ? (n(), o("section", Vo, [
        b[19] || (b[19] = e("header", { class: "block-head" }, [
          e("h2", { class: "block-title" }, "Results by case"),
          e("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        e("div", So, [
          e("table", Co, [
            e("thead", null, [
              e("tr", null, [
                b[15] || (b[15] = e("th", null, "Document", -1)),
                (n(!0), o(E, null, A(W.value, (f) => (n(), o("th", {
                  key: f,
                  class: "mono"
                }, u(f), 1))), 128))
              ])
            ]),
            e("tbody", null, [
              (n(!0), o(E, null, A($.value.results, (f) => (n(), o(E, {
                key: f.case_id
              }, [
                e("tr", {
                  class: L(["result-row", { active: K.value === f.case_id }])
                }, [
                  e("td", null, [
                    e("button", {
                      type: "button",
                      class: "case-toggle",
                      "aria-expanded": K.value === f.case_id,
                      onClick: (U) => K.value = K.value === f.case_id ? void 0 : f.case_id
                    }, [
                      m(h(R), {
                        icon: K.value === f.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      S(u(f.upload_name), 1)
                    ], 8, Eo)
                  ]),
                  f.status !== "completed" ? (n(), o("td", {
                    key: 0,
                    colspan: W.value.length,
                    class: "muted"
                  }, [
                    f.status === "queued" ? (n(), o("span", Uo, [
                      m(h(R), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      b[16] || (b[16] = S("Waiting", -1))
                    ])) : (n(), o("span", {
                      key: 1,
                      class: "cell-state fail",
                      "data-error-kind": f.error?.kind,
                      title: f.error?.kind
                    }, [
                      m(h(R), { icon: "tabler:alert-triangle" }),
                      S(u(f.error?.message), 1)
                    ], 8, Fo))
                  ], 8, qo)) : (n(!0), o(E, { key: 1 }, A(W.value, (U) => (n(), o("td", {
                    key: U,
                    "data-label": U
                  }, [
                    e("span", {
                      class: L(["cell", Y(H(f, U))]),
                      title: re(H(f, U)?.value)
                    }, u(H(f, U) ? T(H(f, U).score) : "—"), 11, No)
                  ], 8, Mo))), 128))
                ], 2),
                K.value === f.case_id ? (n(), o("tr", Bo, [
                  e("td", {
                    colspan: W.value.length + 1
                  }, [
                    f.error ? (n(), o("p", {
                      key: 0,
                      class: "muted",
                      "data-error-kind": f.error.kind,
                      title: f.error.kind
                    }, u(f.error.message), 9, To)) : (n(), Q($e, {
                      key: 1,
                      node: h(Ne)(f.scores.map((U) => U.field))
                    }, {
                      default: ie(({ index: U }) => [
                        (n(!0), o(E, null, A([f.scores[U]], (P) => (n(), o("dl", {
                          key: P.field,
                          class: "compare"
                        }, [
                          e("dt", Ao, u(P.field.split(".").at(-1)), 1),
                          e("dd", null, [
                            e("span", {
                              class: L(["cell", Y(P)])
                            }, u(T(P.score)), 3),
                            e("div", Oo, [
                              b[17] || (b[17] = e("span", { class: "cmp-label" }, "Expected", -1)),
                              m(xe, {
                                value: P.expected
                              }, null, 8, ["value"])
                            ]),
                            e("div", Po, [
                              b[18] || (b[18] = e("span", { class: "cmp-label" }, "Extracted", -1)),
                              m(xe, {
                                value: P.value
                              }, null, 8, ["value"])
                            ]),
                            e("span", null, [
                              e("span", {
                                class: L(["chip", P.verified ? "primary" : "warn"])
                              }, [
                                m(h(R), {
                                  icon: P.verified ? "tabler:shield-check" : "tabler:shield-question"
                                }, null, 8, ["icon"]),
                                S(u(P.verified ? "Verified" : "Unverified"), 1)
                              ], 2)
                            ])
                          ])
                        ]))), 128))
                      ]),
                      _: 2
                    }, 1032, ["node"])),
                    e("p", Do, u(f.tokens.toLocaleString()) + " tokens · " + u(le(f.duration_ms)), 1)
                  ], 8, Ro)
                ])) : g("", !0)
              ], 64))), 128))
            ])
          ])
        ])
      ])) : g("", !0),
      e("section", Lo, [
        e("header", _o, [
          b[20] || (b[20] = e("h2", { class: "block-title" }, "Cases", -1)),
          e("span", jo, u(t.cases.length), 1),
          m(h(ne), {
            label: "Add case",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: !t.fields.length,
            onClick: b[2] || (b[2] = (f) => c.value = !c.value)
          }, null, 8, ["disabled"])
        ]),
        c.value ? (n(), o("form", {
          key: 0,
          class: "case-form",
          onSubmit: Ve(V, ["prevent"])
        }, [
          e("label", null, [
            b[21] || (b[21] = S("Document", -1)),
            m(pt, {
              value: y.value,
              onSelect: b[3] || (b[3] = (f) => {
                y.value = f;
              })
            }, null, 8, ["value"])
          ]),
          b[24] || (b[24] = e("p", { class: "muted" }, "Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.", -1)),
          m($e, { node: J.value }, {
            default: ie(({ index: f }) => [
              (n(!0), o(E, null, A([t.fields[f]], (U) => (n(), o("label", {
                key: h(z)(U)
              }, [
                e("span", Io, u(U.name), 1),
                U.type === "boolean" ? j((n(), o("select", {
                  key: 0,
                  "onUpdate:modelValue": (P) => d.value[h(z)(U)] = P
                }, [...b[22] || (b[22] = [
                  e("option", { value: "" }, "Not stated", -1),
                  e("option", { value: "true" }, "Yes", -1),
                  e("option", { value: "false" }, "No", -1)
                ])], 8, zo)), [
                  [Le, d.value[h(z)(U)]]
                ]) : U.type === "enum" ? j((n(), o("select", {
                  key: 1,
                  "onUpdate:modelValue": (P) => d.value[h(z)(U)] = P
                }, [
                  b[23] || (b[23] = e("option", { value: "" }, "Not stated", -1)),
                  (n(!0), o(E, null, A(U.enum_values, (P) => (n(), o("option", { key: P }, u(P), 1))), 128))
                ], 8, Ho)), [
                  [Le, d.value[h(z)(U)]]
                ]) : U.type === "object" || U.type === "list" ? j((n(), o("textarea", {
                  key: 2,
                  "onUpdate:modelValue": (P) => d.value[h(z)(U)] = P,
                  rows: "2",
                  placeholder: U.type === "list" ? '["first", "second"]' : '{"key": "value"}'
                }, null, 8, Wo)), [
                  [Z, d.value[h(z)(U)]]
                ]) : j((n(), o("input", {
                  key: 3,
                  "onUpdate:modelValue": (P) => d.value[h(z)(U)] = P,
                  type: U.type === "number" ? "number" : U.type === "date" ? "date" : "text",
                  placeholder: "Not stated"
                }, null, 8, Qo)), [
                  [St, d.value[h(z)(U)]]
                ])
              ]))), 128))
            ]),
            _: 1
          }, 8, ["node"]),
          p.value ? (n(), o("p", Ko, u(p.value), 1)) : g("", !0),
          e("div", Go, [
            m(h(ne), {
              label: "Save case",
              size: "small",
              type: "submit",
              disabled: !y.value,
              loading: t.saving
            }, null, 8, ["disabled", "loading"]),
            m(h(ne), {
              label: "Cancel",
              size: "small",
              severity: "secondary",
              text: "",
              onClick: b[4] || (b[4] = (f) => c.value = !1)
            })
          ])
        ], 32)) : g("", !0),
        t.fields.length ? !t.cases.length && !c.value ? (n(), o("p", Yo, "No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.")) : t.cases.length ? (n(), o("div", Xo, [
          e("table", Zo, [
            b[25] || (b[25] = e("thead", null, [
              e("tr", null, [
                e("th", null, "Document"),
                e("th", null, "Expected values"),
                e("th")
              ])
            ], -1)),
            e("tbody", null, [
              (n(!0), o(E, null, A(t.cases, (f) => (n(), o("tr", {
                key: f.id
              }, [
                e("td", null, [
                  m(h(R), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  S(" " + u(f.upload_name), 1)
                ]),
                e("td", null, [
                  m($e, { node: J.value }, {
                    default: ie(({ index: U }) => [
                      e("div", ei, [
                        e("strong", null, u(t.fields[U].name), 1),
                        h(st)(f.expected, h(z)(t.fields[U])) !== void 0 ? (n(), Q(xe, {
                          key: 0,
                          value: h(st)(f.expected, h(z)(t.fields[U]))
                        }, null, 8, ["value"])) : (n(), o("span", ti, "Not stated"))
                      ])
                    ]),
                    _: 2
                  }, 1032, ["node"])
                ]),
                e("td", li, [
                  e("button", {
                    type: "button",
                    class: "kx-iconbtn kx-focus-outline",
                    "aria-label": `Remove case ${f.upload_name}`,
                    disabled: t.saving,
                    onClick: (U) => r("delete-case", f.id)
                  }, [
                    m(h(R), { icon: "tabler:trash" })
                  ], 8, ai)
                ])
              ]))), 128))
            ])
          ])
        ])) : g("", !0) : (n(), o("p", Jo, "Add a field in the Builder, then add documents with the values you expect."))
      ]),
      t.evaluations.length ? (n(), o("section", ni, [
        e("header", si, [
          b[26] || (b[26] = e("h2", { class: "block-title" }, "History", -1)),
          e("span", oi, u(t.evaluations.length), 1)
        ]),
        e("ul", ii, [
          (n(!0), o(E, null, A(t.evaluations, (f) => (n(), o("li", {
            key: f.id
          }, [
            e("button", {
              type: "button",
              class: L({ active: $.value?.id === f.id }),
              "aria-current": $.value?.id === f.id,
              onClick: (U) => r("open", f.id)
            }, [
              e("span", {
                class: "badge",
                "data-status": f.status
              }, u(ue[f.status]), 9, di),
              e("span", null, "Revision " + u(f.config_revision), 1),
              e("span", ri, u(h(Be)(f.created_at)), 1),
              e("strong", ci, u(f.status === "completed" ? T(h(fe)(f)) : "—"), 1)
            ], 10, ui)
          ]))), 128))
        ])
      ])) : g("", !0)
    ]));
  }
}), mi = { class: "section-head" }, pi = { class: "muted" }, bi = {
  key: 0,
  class: "empty"
}, fi = {
  key: 1,
  class: "table-scroll"
}, yi = { class: "metric-table runs-table" }, hi = ["aria-label", "aria-expanded", "onClick"], gi = { class: "caller" }, ki = ["data-status"], $i = {
  class: "num",
  "data-label": "Time"
}, xi = {
  class: "num",
  "data-label": "Tokens"
}, wi = {
  class: "muted",
  "data-label": "Expires"
}, Vi = {
  key: 0,
  class: "result-detail"
}, Si = { colspan: "6" }, Ci = /* @__PURE__ */ I({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(t) {
    const i = M(), a = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (r, c) => (n(), o(E, null, [
      e("div", mi, [
        c[0] || (c[0] = e("h2", null, "Recent runs", -1)),
        e("span", pi, "Runs expire after " + u(t.retention), 1)
      ]),
      t.runs.length ? (n(), o("div", fi, [
        e("table", yi, [
          c[1] || (c[1] = e("thead", null, [
            e("tr", null, [
              e("th", null, "Started"),
              e("th", null, "From"),
              e("th", null, "Status"),
              e("th", { class: "num" }, "Time"),
              e("th", { class: "num" }, "Tokens"),
              e("th", null, "Expires")
            ])
          ], -1)),
          e("tbody", null, [
            (n(!0), o(E, null, A(t.runs, (y) => (n(), o(E, {
              key: y.id
            }, [
              e("tr", null, [
                e("td", null, [
                  e("button", {
                    type: "button",
                    class: "case-toggle",
                    "aria-label": `Show values for run ${y.id}`,
                    "aria-expanded": i.value === y.id,
                    onClick: (d) => i.value = i.value === y.id ? void 0 : y.id
                  }, [
                    m(h(R), {
                      icon: i.value === y.id ? "tabler:chevron-down" : "tabler:chevron-right"
                    }, null, 8, ["icon"]),
                    S(u(h(Be)(y.created_at)), 1)
                  ], 8, hi)
                ]),
                e("td", null, [
                  e("span", gi, [
                    m(h(R), {
                      icon: a[y.caller].icon
                    }, null, 8, ["icon"]),
                    S(u(a[y.caller].label), 1)
                  ])
                ]),
                e("td", null, [
                  e("span", {
                    class: "badge",
                    "data-status": y.status
                  }, u(y.status === "completed" ? "Completed" : "Failed"), 9, ki)
                ]),
                e("td", $i, u((y.duration_ms / 1e3).toFixed(1)) + "s", 1),
                e("td", xi, u(Number(y.tokens).toLocaleString()), 1),
                e("td", wi, u(h(Be)(y.expires_at)), 1)
              ]),
              i.value === y.id ? (n(), o("tr", Vi, [
                e("td", Si, [
                  m(bt, {
                    fields: y.result.fields
                  }, null, 8, ["fields"])
                ])
              ])) : g("", !0)
            ], 64))), 128))
          ])
        ])
      ])) : (n(), o("p", bi, "No runs yet. Runs from the Test tab, agents, evaluations and Workflows appear here."))
    ], 64));
  }
}), Ei = {
  key: 0,
  role: "alert",
  class: "error banner"
}, qi = /* @__PURE__ */ I({
  __name: "SharePopup",
  props: {
    id: {},
    title: {}
  },
  emits: ["close"],
  setup(t, { emit: i }) {
    const a = t, r = i, c = M(), y = M("");
    return Te(async () => {
      try {
        await He("kickside-share", { timeoutMs: 8e3 });
      } catch (k) {
        y.value = `Sharing is unavailable: ${k instanceof Error ? k.message : String(k)}`;
        return;
      }
      const d = document.createElement("kickside-share"), p = encodeURIComponent(a.id);
      d.setAttribute("config", JSON.stringify({ resource_id: a.id, title: a.title, access_url: `/api/v1/component-access/grants/${p}`, share_url: `/api/v1/component-access/share/${p}` })), d.style.display = "block", d.addEventListener("close", () => r("close")), c.value?.appendChild(d);
    }), (d, p) => (n(), o("div", {
      ref_key: "host",
      ref: c
    }, [
      y.value ? (n(), o("p", Ei, u(y.value), 1)) : g("", !0)
    ], 512));
  }
}), Ui = { class: "docscout" }, Fi = { class: "toolbar" }, Mi = { class: "toolbar-lead" }, Ni = { class: "crumb-row" }, Bi = { class: "crumb" }, Ri = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, Ti = ["id", "aria-selected", "aria-controls", "onClick"], Ai = { class: "toolbar-side" }, Oi = { class: "stats" }, Pi = ["title"], Di = {
  key: 2,
  class: "unsaved"
}, Li = {
  key: 0,
  class: "banner row wrap",
  role: "status"
}, _i = {
  key: 1,
  role: "alert",
  class: "error banner"
}, ji = {
  key: 3,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, Ii = ["id", "aria-labelledby"], zi = /* @__PURE__ */ I({
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
  setup(t, { emit: i }) {
    const a = t, r = i, c = M(), y = M(!1), d = M("Builder"), p = M(ot()), k = M(""), V = M(""), l = F(() => a.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    ge(d, () => {
      c.value && (c.value.scrollTop = 0);
    }, { flush: "post" });
    const s = M(), $ = M(), B = F(() => a.snapshot.can_edit && s.value !== a.snapshot.expected_revision), D = F(() => B.value && $.value !== a.snapshot.expected_revision);
    function O(T) {
      return k.value === T.title && V.value === (T.description ?? "") && zt(p.value, T.config);
    }
    function te() {
      const T = a.snapshot;
      p.value = structuredClone(et(T.config ?? ot())), k.value = T.title, V.value = T.description ?? "", s.value = T.expected_revision, $.value = void 0;
    }
    ge(() => a.snapshot, (T, N) => {
      l.value.includes(d.value) || (d.value = l.value[0]), !(N && T.id === N.id && T.can_edit && N.can_edit && !O(N) && !O(T)) && te();
    }, { immediate: !0 });
    const W = F(() => a.snapshot.can_edit && !O(a.snapshot)), J = F(() => It(p.value)), H = F(() => Object.keys(ve).filter((T) => Me(p.value, T)).length);
    function K() {
      r("save", { title: k.value, description: V.value, config: structuredClone(et(p.value)), expected_revision: s.value });
    }
    return (T, N) => (n(), o("main", Ui, [
      e("div", Fi, [
        e("div", Mi, [
          e("span", Ni, [
            t.back ? (n(), o("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: N[0] || (N[0] = (q) => r("back"))
            }, [
              m(h(R), { icon: "tabler:arrow-left" })
            ])) : g("", !0),
            e("span", Bi, u(t.snapshot.title), 1)
          ]),
          e("nav", Ri, [
            (n(!0), o(E, null, A(l.value, (q) => (n(), o("button", {
              id: `tab-${q}`,
              key: q,
              role: "tab",
              "aria-selected": d.value === q,
              "aria-controls": `panel-${q}`,
              onClick: (le) => d.value = q
            }, u(q), 9, Ti))), 128))
          ])
        ]),
        e("div", Ai, [
          t.snapshot.can_share ? (n(), Q(h(ne), {
            key: 0,
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-label": "Share",
            onClick: N[1] || (N[1] = (q) => y.value = !0)
          }, {
            default: ie(() => [
              m(h(R), { icon: "tabler:share" }),
              N[11] || (N[11] = e("span", { class: "btn-label" }, "Share", -1))
            ]),
            _: 1
          })) : g("", !0),
          e("span", Oi, [
            S(u(t.snapshot.field_count) + " " + u(t.snapshot.field_count === 1 ? "field" : "fields"), 1),
            t.snapshot.can_edit ? (n(), o(E, { key: 0 }, [
              S(" · " + u(H.value) + " steps · revision " + u(t.snapshot.expected_revision), 1)
            ], 64)) : (n(), o(E, { key: 1 }, [
              S(" · Read access")
            ], 64))
          ]),
          t.snapshot.can_edit ? (n(), o(E, { key: 1 }, [
            B.value && !D.value ? (n(), Q(h(ne), {
              key: 0,
              label: "Reload saved",
              severity: "secondary",
              size: "small",
              onClick: te
            })) : g("", !0),
            J.value ? (n(), o("span", {
              key: 1,
              class: "invalid",
              role: "alert",
              title: J.value
            }, [
              m(h(R), { icon: "tabler:alert-circle" }),
              S(u(J.value), 1)
            ], 8, Pi)) : W.value ? (n(), o("span", Di, "Unsaved")) : g("", !0),
            m(h(ne), {
              label: "Save",
              size: "small",
              loading: t.saving,
              disabled: !W.value || !!J.value || !k.value.trim(),
              onClick: K
            }, null, 8, ["loading", "disabled"])
          ], 64)) : g("", !0)
        ])
      ]),
      D.value ? (n(), o("div", Li, [
        e("span", null, "Saved configuration changed to revision " + u(t.snapshot.expected_revision) + ". Your edits are kept.", 1),
        m(h(ne), {
          label: "Reload saved",
          severity: "secondary",
          size: "small",
          onClick: te
        }),
        m(h(ne), {
          label: "Keep editing",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: N[2] || (N[2] = (q) => $.value = t.snapshot.expected_revision)
        })
      ])) : g("", !0),
      t.error ? (n(), o("p", _i, u(t.error), 1)) : g("", !0),
      y.value ? (n(), Q(qi, {
        key: 2,
        id: t.snapshot.id,
        title: t.snapshot.title,
        onClose: N[3] || (N[3] = (q) => y.value = !1)
      }, null, 8, ["id", "title"])) : g("", !0),
      d.value === "Builder" && t.snapshot.can_edit ? (n(), o("div", ji, [
        m(ls, {
          title: k.value,
          "onUpdate:title": N[4] || (N[4] = (q) => k.value = q),
          description: V.value,
          "onUpdate:description": N[5] || (N[5] = (q) => V.value = q),
          config: p.value,
          retention: t.snapshot.retention,
          result: t.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (n(), o("div", {
        key: 4,
        ref_key: "body",
        ref: c,
        class: "page-body"
      }, [
        e("div", {
          id: `panel-${d.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${d.value}`,
          class: "panel"
        }, [
          d.value === "Test" ? (n(), Q(Ds, {
            key: 0,
            result: t.result,
            retention: t.snapshot.retention,
            running: t.running,
            "can-run": t.snapshot.field_count > 0,
            onRun: N[6] || (N[6] = (q) => r("run", q))
          }, null, 8, ["result", "retention", "running", "can-run"])) : g("", !0),
          d.value === "Evals" && t.snapshot.can_edit ? (n(), Q(vi, {
            key: 1,
            cases: t.snapshot.cases,
            "added-case-id": t.addedCaseId,
            fields: t.snapshot.config.fields,
            evaluations: t.evaluations,
            evaluation: t.evaluation,
            revision: t.snapshot.expected_revision,
            changed: W.value,
            saving: t.saving,
            starting: t.starting,
            onAddCase: N[7] || (N[7] = (q) => r("add-case", q)),
            onDeleteCase: N[8] || (N[8] = (q) => r("delete-case", q)),
            onEvaluate: N[9] || (N[9] = (q) => r("evaluate")),
            onOpen: N[10] || (N[10] = (q) => r("open-evaluation", q))
          }, null, 8, ["cases", "added-case-id", "fields", "evaluations", "evaluation", "revision", "changed", "saving", "starting"])) : g("", !0),
          d.value === "Runs" ? (n(), Q(Ci, {
            key: 2,
            runs: t.snapshot.runs,
            retention: t.snapshot.retention
          }, null, 8, ["runs", "retention"])) : g("", !0)
        ], 8, Ii)
      ], 512))
    ]));
  }
}), Hi = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, Wi = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, Yi = /* @__PURE__ */ I({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(t, { emit: i }) {
    const a = t, r = i, c = M(), y = M(""), d = M(!1), p = M(!1), k = M(!1), V = M(), l = M(null), s = M([]), $ = M();
    let B = [], D = 0, O = 0, te = 0, W;
    const J = (x) => x instanceof Error ? x.message : String(x), H = (x) => x === D;
    async function K(x, b) {
      const f = ++te;
      b && (W = b);
      const U = () => H(x) && f === te;
      try {
        const P = a.id, Ce = await de.evaluations(P);
        if (!U()) return;
        s.value = Ce;
        const ae = W ?? Ce[0]?.id;
        if (ae) {
          const se = await de.evaluation(P, ae);
          if (!U() || se.id !== (W ?? ae)) return;
          $.value = se;
        }
      } catch (P) {
        U() && (y.value = J(P));
      }
    }
    async function T(x) {
      const b = ++O, f = () => H(x) && b === O;
      if (!a.id) {
        y.value = "No extractor selected.";
        return;
      }
      try {
        const U = await de.get(a.id);
        if (!f()) return;
        c.value = U, y.value = "", U.can_edit && await K(x);
      } catch (U) {
        f() && (y.value = J(U));
      }
    }
    ge(() => a.id, (x, b) => {
      D++, W = void 0, B.forEach((U) => U()), B = [], V.value = void 0, c.value = void 0, l.value = null, s.value = [], $.value = void 0, y.value = "";
      const f = D;
      a.id && (B = [it(`component.${a.id}`, () => T(f)), it(`docscout.runs.${a.id}`, () => T(f))]), b !== void 0 && T(f);
    }, { immediate: !0 }), Ht(() => T(D)), rt(() => {
      D++, B.forEach((x) => x());
    });
    async function N(x) {
      const b = D;
      d.value = !0, y.value = "";
      try {
        const f = await x();
        if (H(b))
          return await T(b), f;
      } catch (f) {
        H(b) && (y.value = J(f));
      } finally {
        d.value = !1;
      }
    }
    const q = (x) => N(() => de.update(a.id, x));
    async function le(x) {
      const b = D, f = await N(() => de.addCase(a.id, x));
      f && H(b) && (V.value = f.id);
    }
    const re = (x) => N(() => de.deleteCase(a.id, x));
    async function Y(x) {
      const b = D;
      p.value = !0, y.value = "";
      try {
        const f = await de.run(a.id, x);
        H(b) && (l.value = f, await T(b));
      } catch (f) {
        H(b) && (y.value = J(f));
      } finally {
        p.value = !1;
      }
    }
    async function ee() {
      const x = D;
      k.value = !0, y.value = "";
      try {
        const { eval_id: b } = await de.evaluate(a.id);
        H(x) && await K(x, b);
      } catch (b) {
        H(x) && (y.value = J(b));
      } finally {
        k.value = !1;
      }
    }
    function ue(x) {
      K(D, x);
    }
    return (x, b) => c.value ? (n(), Q(zi, {
      key: 0,
      snapshot: c.value,
      "added-case-id": V.value,
      saving: d.value,
      running: p.value,
      starting: k.value,
      result: l.value,
      evaluations: s.value,
      evaluation: $.value,
      error: y.value,
      back: t.back,
      onBack: b[0] || (b[0] = (f) => r("back")),
      onRun: Y,
      onSave: q,
      onAddCase: le,
      onDeleteCase: re,
      onEvaluate: ee,
      onOpenEvaluation: ue
    }, null, 8, ["snapshot", "added-case-id", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : y.value ? (n(), o("p", Hi, u(y.value), 1)) : (n(), o("p", Wi, "Loading Docscout…"));
  }
});
export {
  Yi as _,
  Be as w
};
