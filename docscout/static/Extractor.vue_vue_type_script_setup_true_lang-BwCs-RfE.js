import { defineComponent as W, useModel as ke, openBlock as s, createElementBlock as o, withModifiers as qe, createElementVNode as e, mergeModels as Ue, computed as T, withKeys as Te, unref as g, normalizeClass as P, createVNode as b, toDisplayString as u, Fragment as E, renderList as L, createCommentVNode as f, createTextVNode as x, createBlock as ee, ref as _, watch as de, withDirectives as j, vModelText as X, vModelSelect as he, onMounted as Fe, normalizeStyle as fe, useId as ut, onBeforeUnmount as Ge, nextTick as Me, vShow as _e, vModelDynamic as dt, withCtx as rt, toRaw as ze } from "vue";
import { B as ct, L as vt, j as we, v as ge, k as mt, U as bt, I as Ie, f as pt, i as Ce, l as Xe, t as Re, h as ue, o as Oe, p as ft, m as Ze, q as et, r as He, w as yt, x as gt, y as ht, z as kt, A as We, C as $t, D as Ne, E as xt, F as wt, s as le, n as Qe, G as Vt, H as St, b as Ct, c as se } from "./index-SBSeBTrh.js";
import { loadByTagName as Le, on as Ke } from "@wippy-fe/proxy";
import { Icon as R } from "@iconify/vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
var Et = ct.extend({
  name: "focustrap-directive"
}), qt = mt.extend({
  style: Et
});
function $e(t) {
  "@babel/helpers - typeof";
  return $e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(i) {
    return typeof i;
  } : function(i) {
    return i && typeof Symbol == "function" && i.constructor === Symbol && i !== Symbol.prototype ? "symbol" : typeof i;
  }, $e(t);
}
function Je(t, i) {
  var a = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var d = Object.getOwnPropertySymbols(t);
    i && (d = d.filter(function(c) {
      return Object.getOwnPropertyDescriptor(t, c).enumerable;
    })), a.push.apply(a, d);
  }
  return a;
}
function Ye(t) {
  for (var i = 1; i < arguments.length; i++) {
    var a = arguments[i] != null ? arguments[i] : {};
    i % 2 ? Je(Object(a), !0).forEach(function(d) {
      Ut(t, d, a[d]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(a)) : Je(Object(a)).forEach(function(d) {
      Object.defineProperty(t, d, Object.getOwnPropertyDescriptor(a, d));
    });
  }
  return t;
}
function Ut(t, i, a) {
  return (i = Ft(i)) in t ? Object.defineProperty(t, i, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : t[i] = a, t;
}
function Ft(t) {
  var i = Mt(t, "string");
  return $e(i) == "symbol" ? i : i + "";
}
function Mt(t, i) {
  if ($e(t) != "object" || !t) return t;
  var a = t[Symbol.toPrimitive];
  if (a !== void 0) {
    var d = a.call(t, i);
    if ($e(d) != "object") return d;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (i === "string" ? String : Number)(t);
}
var Nt = qt.extend("focustrap", {
  mounted: function(i, a) {
    var d = a.value || {}, c = d.disabled;
    c || (this.createHiddenFocusableElements(i, a), this.bind(i, a), this.autoElementFocus(i, a)), i.setAttribute("data-pd-focustrap", !0), this.$el = i;
  },
  updated: function(i, a) {
    var d = a.value || {}, c = d.disabled;
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
      var d = this, c = a.value || {}, h = c.onFocusIn, p = c.onFocusOut;
      i.$_pfocustrap_mutationobserver = new MutationObserver(function(y) {
        y.forEach(function(q) {
          if (q.type === "childList" && !i.contains(document.activeElement)) {
            var $ = function(n) {
              var V = Ie(n) ? Ie(n, d.getComputedSelector(i.$_pfocustrap_focusableselector)) ? n : ge(i, d.getComputedSelector(i.$_pfocustrap_focusableselector)) : ge(n);
              return pt(V) ? V : n.nextSibling && $(n.nextSibling);
            };
            we($(q.nextSibling));
          }
        });
      }), i.$_pfocustrap_mutationobserver.disconnect(), i.$_pfocustrap_mutationobserver.observe(i, {
        childList: !0
      }), i.$_pfocustrap_focusinlistener = function(y) {
        return h && h(y);
      }, i.$_pfocustrap_focusoutlistener = function(y) {
        return p && p(y);
      }, i.addEventListener("focusin", i.$_pfocustrap_focusinlistener), i.addEventListener("focusout", i.$_pfocustrap_focusoutlistener);
    },
    unbind: function(i) {
      i.$_pfocustrap_mutationobserver && i.$_pfocustrap_mutationobserver.disconnect(), i.$_pfocustrap_focusinlistener && i.removeEventListener("focusin", i.$_pfocustrap_focusinlistener) && (i.$_pfocustrap_focusinlistener = null), i.$_pfocustrap_focusoutlistener && i.removeEventListener("focusout", i.$_pfocustrap_focusoutlistener) && (i.$_pfocustrap_focusoutlistener = null);
    },
    autoFocus: function(i) {
      this.autoElementFocus(this.$el, {
        value: Ye(Ye({}, i), {}, {
          autoFocus: !0
        })
      });
    },
    autoElementFocus: function(i, a) {
      var d = a.value || {}, c = d.autoFocusSelector, h = c === void 0 ? "" : c, p = d.firstFocusableSelector, y = p === void 0 ? "" : p, q = d.autoFocus, $ = q === void 0 ? !1 : q, l = ge(i, "[autofocus]".concat(this.getComputedSelector(h)));
      $ && !l && (l = ge(i, this.getComputedSelector(y))), we(l);
    },
    onFirstHiddenElementFocus: function(i) {
      var a, d = i.currentTarget, c = i.relatedTarget, h = c === d.$_pfocustrap_lasthiddenfocusableelement || !((a = this.$el) !== null && a !== void 0 && a.contains(c)) ? ge(d.parentElement, this.getComputedSelector(d.$_pfocustrap_focusableselector)) : d.$_pfocustrap_lasthiddenfocusableelement;
      we(h);
    },
    onLastHiddenElementFocus: function(i) {
      var a, d = i.currentTarget, c = i.relatedTarget, h = c === d.$_pfocustrap_firsthiddenfocusableelement || !((a = this.$el) !== null && a !== void 0 && a.contains(c)) ? vt(d.parentElement, this.getComputedSelector(d.$_pfocustrap_focusableselector)) : d.$_pfocustrap_firsthiddenfocusableelement;
      we(h);
    },
    createHiddenFocusableElements: function(i, a) {
      var d = this, c = a.value || {}, h = c.tabIndex, p = h === void 0 ? 0 : h, y = c.firstFocusableSelector, q = y === void 0 ? "" : y, $ = c.lastFocusableSelector, l = $ === void 0 ? "" : $, n = function(B) {
        return bt("span", {
          class: "p-hidden-accessible p-hidden-focusable",
          tabIndex: p,
          role: "presentation",
          "aria-hidden": !0,
          "data-p-hidden-accessible": !0,
          "data-p-hidden-focusable": !0,
          onFocus: B?.bind(d)
        });
      }, V = n(this.onFirstHiddenElementFocus), O = n(this.onLastHiddenElementFocus);
      V.$_pfocustrap_lasthiddenfocusableelement = O, V.$_pfocustrap_focusableselector = q, V.setAttribute("data-pc-section", "firstfocusableelement"), O.$_pfocustrap_firsthiddenfocusableelement = V, O.$_pfocustrap_focusableselector = l, O.setAttribute("data-pc-section", "lastfocusableelement"), i.prepend(V), i.append(O);
    }
  }
});
const Bt = ["aria-checked", "aria-label", "disabled"], Q = /* @__PURE__ */ W({
  __name: "Toggle",
  props: /* @__PURE__ */ Ue({
    label: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { type: Boolean, required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(t) {
    const i = ke(t, "modelValue");
    return (a, d) => (s(), o("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": i.value,
      "aria-label": t.label,
      disabled: t.disabled,
      onClick: d[0] || (d[0] = qe((c) => i.value = !i.value, ["stop"]))
    }, [...d[1] || (d[1] = [
      e("span", null, null, -1)
    ])], 8, Bt));
  }
}), Tt = ["aria-label"], _t = { class: "node-icon" }, Rt = { class: "node-main" }, Ot = { class: "node-title" }, Lt = { class: "node-summary" }, Dt = {
  key: 0,
  class: "chips"
}, At = {
  key: 1,
  class: "trace-line"
}, Pt = { class: "node-side" }, jt = {
  key: 0,
  class: "chip model"
}, ve = /* @__PURE__ */ W({
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
    const a = t, d = i, c = T(() => Ce(a.config, a.stage)), h = T(() => a.config.stages[a.stage].model), p = T({ get: () => c.value, set: ($) => {
      a.config.stages[a.stage].enabled = $;
    } }), y = T(() => {
      const $ = a.config, l = $.stages;
      switch (a.stage) {
        case "map":
          return $.fields.filter((n) => n.search_within === "sections").map((n) => ({ text: n.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...l.prefetch.queries.map((n) => ({ text: n.name || "Untitled query", tone: "" })), ...$.fields.filter((n) => n.search_hints.trim()).map((n) => ({ text: n.name, tone: "hint" }))];
        case "scout":
          return l.scout.mode === "agent" ? l.scout.tools.map((n) => ({ text: Re(n).toLowerCase(), tone: "" })) : [];
        case "deep":
          return $.fields.filter((n) => n.strategy === "deep").map((n) => ({ text: n.name || "New field", tone: "primary" }));
        case "extract":
          return Xe($).map((n) => ({ text: `${n.name} · ${n.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), q = ($) => [`${($.duration_ms / 1e3).toFixed(1)}s`, `${($.input_tokens + $.output_tokens).toLocaleString()} tokens`, $.queries?.length ? `${$.queries.length} queries` : "", $.message ?? ""].filter(Boolean).join(" · ");
    return ($, l) => (s(), o("div", {
      class: P(["node kx-focus-halo", { active: t.active, off: !c.value, fixed: t.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": g(ue)[t.stage],
      onClick: l[1] || (l[1] = (n) => d("select")),
      onKeydown: [
        l[2] || (l[2] = Te((n) => d("select"), ["enter"])),
        l[3] || (l[3] = Te(qe((n) => d("select"), ["prevent"]), ["space"]))
      ]
    }, [
      e("span", _t, [
        b(g(R), {
          icon: g(Oe)[t.stage]
        }, null, 8, ["icon"])
      ]),
      e("span", Rt, [
        e("span", Ot, u(g(ue)[t.stage]), 1),
        e("span", Lt, u(c.value ? g(ft)(t.stage, t.config) : "Off"), 1),
        c.value && y.value.length ? (s(), o("span", Dt, [
          (s(!0), o(E, null, L(y.value, (n) => (s(), o("span", {
            key: n.text,
            class: P(["chip", { primary: n.tone === "primary", "muted-chip": n.tone === "hint" }])
          }, u(n.text), 3))), 128))
        ])) : f("", !0),
        t.trace ? (s(), o("span", At, [
          b(g(R), {
            icon: t.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          x(u(q(t.trace)), 1)
        ])) : f("", !0)
      ]),
      e("span", Pt, [
        c.value && h.value ? (s(), o("span", jt, u(g(Ze)(h.value)), 1)) : f("", !0),
        t.stage !== "extract" && !t.readonly ? (s(), ee(Q, {
          key: 1,
          modelValue: p.value,
          "onUpdate:modelValue": l[0] || (l[0] = (n) => p.value = n),
          label: `Enable ${g(ue)[t.stage]}`
        }, null, 8, ["modelValue", "label"])) : f("", !0)
      ])
    ], 42, Tt));
  }
}), zt = ["aria-labelledby"], It = ["aria-checked", "tabindex", "disabled", "onClick", "onKeydown"], pe = /* @__PURE__ */ W({
  __name: "Segmented",
  props: /* @__PURE__ */ Ue({
    options: {},
    labelledBy: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(t) {
    const i = t, a = ke(t, "modelValue"), d = _([]);
    function c(h, p) {
      const y = i.options.length - 1, q = { ArrowRight: p + 1, ArrowDown: p + 1, ArrowLeft: p - 1, ArrowUp: p - 1, Home: 0, End: y }[h.key];
      if (q === void 0) return;
      h.preventDefault();
      const $ = (q + i.options.length) % i.options.length;
      a.value = i.options[$].value, d.value[$]?.focus();
    }
    return (h, p) => (s(), o("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": t.labelledBy
    }, [
      (s(!0), o(E, null, L(t.options, (y, q) => (s(), o("button", {
        key: y.value,
        ref_for: !0,
        ref_key: "buttons",
        ref: d,
        type: "button",
        role: "radio",
        "aria-checked": a.value === y.value,
        tabindex: a.value === y.value ? 0 : -1,
        disabled: t.disabled,
        onClick: ($) => a.value = y.value,
        onKeydown: ($) => c($, q)
      }, u(y.label), 41, It))), 128))
    ], 8, zt));
  }
}), Ht = ["disabled"], Wt = { class: "grid" }, Qt = ["aria-invalid"], Kt = ["value"], Jt = {
  key: 0,
  class: "field-error",
  role: "alert"
}, Yt = { key: 1 }, Gt = ["value"], Xt = { key: 2 }, Zt = ["value"], el = { class: "grid" }, tl = {
  key: 3,
  class: "field-note"
}, ll = { class: "label-block" }, al = {
  key: 4,
  class: "field-error"
}, nl = { id: "docscout-groups" }, sl = ["value"], ol = { key: 5 }, il = ["placeholder"], ul = { class: "toggle-row" }, dl = { class: "toggle-row" }, rl = /* @__PURE__ */ W({
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
    const a = t, d = i, c = [{ value: "text", label: "Text" }, { value: "number", label: "Number" }, { value: "boolean", label: "Yes / no" }, { value: "date", label: "Date" }, { value: "enum", label: "One of a set" }, { value: "list", label: "List" }, { value: "object", label: "Object" }], h = c.filter(($) => ["text", "number", "boolean", "date", "object"].includes($.value)), p = T(() => et(a.field, a.otherNames)), y = T(() => a.field.type !== "boolean" && a.field.type !== "enum" && !(a.field.type === "list" && a.field.item_type === "boolean"));
    de(() => [a.field.type, a.field.item_type], () => {
      !He(a.field) && a.field.enum_values.length && (a.field.enum_values = []);
    });
    function q($) {
      a.field.enum_values = [...new Set($.target.value.split(`
`).map((l) => l.trim()).filter(Boolean))];
    }
    return ($, l) => (s(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("div", Wt, [
        e("label", null, [
          l[14] || (l[14] = x("Name", -1)),
          j(e("input", {
            "onUpdate:modelValue": l[0] || (l[0] = (n) => t.field.name = n),
            placeholder: "invoice_total",
            "aria-label": "Field name",
            "aria-invalid": !!p.value,
            spellcheck: "false",
            class: "mono-input"
          }, null, 8, Qt), [
            [
              X,
              t.field.name,
              void 0,
              { trim: !0 }
            ]
          ])
        ]),
        e("label", null, [
          l[15] || (l[15] = x("Type", -1)),
          j(e("select", {
            "onUpdate:modelValue": l[1] || (l[1] = (n) => t.field.type = n),
            "aria-label": "Field type"
          }, [
            (s(), o(E, null, L(c, (n) => e("option", {
              key: n.value,
              value: n.value
            }, u(n.label), 9, Kt)), 64))
          ], 512), [
            [he, t.field.type]
          ])
        ])
      ]),
      p.value ? (s(), o("p", Jt, [
        b(g(R), { icon: "tabler:alert-circle" }),
        x(u(p.value), 1)
      ])) : f("", !0),
      t.field.type === "list" ? (s(), o("label", Yt, [
        l[16] || (l[16] = x("Each item is", -1)),
        j(e("select", {
          "onUpdate:modelValue": l[2] || (l[2] = (n) => t.field.item_type = n)
        }, [
          (s(!0), o(E, null, L(g(h), (n) => (s(), o("option", {
            key: n.value,
            value: n.value
          }, u(n.label), 9, Gt))), 128))
        ], 512), [
          [he, t.field.item_type]
        ])
      ])) : f("", !0),
      g(He)(t.field) ? (s(), o("label", Xt, [
        x(u(t.field.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        e("textarea", {
          value: t.field.enum_values.join(`
`),
          rows: "3",
          placeholder: "One per line",
          onChange: q
        }, null, 40, Zt),
        e("small", null, u(t.field.type === "enum" ? "The value must be exactly one of these." : "When set, every item must be one of these."), 1)
      ])) : f("", !0),
      e("label", null, [
        l[17] || (l[17] = x("Description", -1)),
        j(e("textarea", {
          "onUpdate:modelValue": l[3] || (l[3] = (n) => t.field.description = n),
          rows: "2",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [X, t.field.description]
        ]),
        l[18] || (l[18] = e("small", null, "The model reads this to know what to look for.", -1))
      ]),
      l[34] || (l[34] = e("h4", null, "Finding it", -1)),
      e("label", null, [
        l[19] || (l[19] = x("Search hints", -1)),
        j(e("textarea", {
          "onUpdate:modelValue": l[4] || (l[4] = (n) => t.field.search_hints = n),
          rows: "2",
          placeholder: "One query per line"
        }, null, 512), [
          [X, t.field.search_hints]
        ]),
        l[20] || (l[20] = e("small", null, "Each line is an extra search for this field in Prefetch and Deep analysis.", -1))
      ]),
      e("div", el, [
        e("label", null, [
          l[22] || (l[22] = x("Strategy", -1)),
          j(e("select", {
            "onUpdate:modelValue": l[5] || (l[5] = (n) => t.field.strategy = n)
          }, [...l[21] || (l[21] = [
            e("option", { value: "standard" }, "Standard", -1),
            e("option", { value: "deep" }, "Deep analysis", -1)
          ])], 512), [
            [he, t.field.strategy]
          ])
        ]),
        e("label", null, [
          l[23] || (l[23] = x("Chunks to read", -1)),
          j(e("input", {
            "onUpdate:modelValue": l[6] || (l[6] = (n) => t.field.chunks = n),
            type: "number",
            min: "1",
            max: "1000"
          }, null, 512), [
            [
              X,
              t.field.chunks,
              void 0,
              { number: !0 }
            ]
          ]),
          l[24] || (l[24] = e("small", null, "Per search hint", -1))
        ])
      ]),
      t.field.strategy === "deep" && !t.deepEnabled ? (s(), o("p", tl, [
        b(g(R), { icon: "tabler:info-circle" }),
        l[25] || (l[25] = x("Deep analysis is off in the flow, so this field runs as standard.", -1))
      ])) : f("", !0),
      e("div", ll, [
        l[26] || (l[26] = e("span", { id: "within-label" }, "Search within", -1)),
        b(pe, {
          modelValue: t.field.search_within,
          "onUpdate:modelValue": l[7] || (l[7] = (n) => t.field.search_within = n),
          "labelled-by": "within-label",
          options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
        }, null, 8, ["modelValue"]),
        e("small", null, u(t.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
      ]),
      t.field.search_within === "sections" && !t.mapEnabled ? (s(), o("p", al, [
        b(g(R), { icon: "tabler:alert-circle" }),
        l[27] || (l[27] = x("Turn on Map the document to read sections.", -1))
      ])) : f("", !0),
      e("label", null, [
        l[28] || (l[28] = x("Group", -1)),
        j(e("input", {
          "onUpdate:modelValue": l[8] || (l[8] = (n) => t.field.group = n),
          list: "docscout-groups",
          placeholder: "Default"
        }, null, 512), [
          [
            X,
            t.field.group,
            void 0,
            { trim: !0 }
          ]
        ]),
        e("datalist", nl, [
          (s(!0), o(E, null, L(t.groups, (n) => (s(), o("option", {
            key: n,
            value: n
          }, null, 8, sl))), 128))
        ]),
        l[29] || (l[29] = e("small", null, "Fields in a group are extracted together in one call.", -1))
      ]),
      l[35] || (l[35] = e("h4", null, "Checking it", -1)),
      e("label", null, [
        l[30] || (l[30] = x("Validation hints", -1)),
        j(e("textarea", {
          "onUpdate:modelValue": l[9] || (l[9] = (n) => t.field.validation_hints = n),
          rows: "2",
          placeholder: "Rules the value must satisfy"
        }, null, 512), [
          [X, t.field.validation_hints]
        ])
      ]),
      y.value ? (s(), o("label", ol, [
        l[31] || (l[31] = x("Expected format", -1)),
        j(e("input", {
          "onUpdate:modelValue": l[10] || (l[10] = (n) => t.field.expected_format = n),
          placeholder: g(yt)(t.field)
        }, null, 8, il), [
          [X, t.field.expected_format]
        ])
      ])) : f("", !0),
      e("div", ul, [
        l[32] || (l[32] = e("span", null, [
          x("Required"),
          e("small", null, "A run reports this field as missing when no value is found.")
        ], -1)),
        b(Q, {
          modelValue: t.field.required,
          "onUpdate:modelValue": l[11] || (l[11] = (n) => t.field.required = n),
          label: "Required",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      e("div", dl, [
        l[33] || (l[33] = e("span", null, [
          x("Evidence required"),
          e("small", null, "The value must cite a quote from the document.")
        ], -1)),
        b(Q, {
          modelValue: t.field.evidence_required,
          "onUpdate:modelValue": l[12] || (l[12] = (n) => t.field.evidence_required = n),
          label: "Evidence required",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t.readonly ? f("", !0) : (s(), o("button", {
        key: 6,
        type: "button",
        class: "kx-btn kx-btn-danger kx-focus-halo",
        onClick: l[13] || (l[13] = (n) => d("remove"))
      }, "Remove field"))
    ], 8, Ht));
  }
}), cl = ["value", "capability", "aria-labelledby"], vl = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, ml = {
  key: 2,
  class: "dz-muted",
  role: "status"
}, ae = /* @__PURE__ */ W({
  __name: "ModelPicker",
  props: {
    value: {},
    capability: {},
    labelledBy: {}
  },
  emits: ["select"],
  setup(t, { emit: i }) {
    const a = i, d = _(!!customElements.get("wc-model-picker")), c = _("");
    Fe(async () => {
      if (!d.value)
        try {
          await Le("wc-model-picker", { timeoutMs: 8e3 }), d.value = !0;
        } catch (p) {
          c.value = p instanceof Error ? p.message : String(p);
        }
    });
    function h(p) {
      const y = p.detail;
      typeof y == "string" && a("select", y);
    }
    return (p, y) => d.value ? (s(), o("wc-model-picker", {
      key: 0,
      value: t.value,
      capability: t.capability,
      "aria-labelledby": t.labelledBy,
      onSelect: h
    }, null, 40, cl)) : c.value ? (s(), o("p", vl, "Could not load model picker: " + u(c.value), 1)) : (s(), o("span", ml, "Loading models…"));
  }
}), bl = { class: "slider" }, pl = { class: "slider-head" }, fl = { class: "slider-value" }, yl = ["aria-label", "aria-valuetext", "disabled"], gl = {
  key: 0,
  class: "slider-hints"
}, hl = { key: 1 }, me = 1e3, Y = /* @__PURE__ */ W({
  __name: "Slider",
  props: /* @__PURE__ */ Ue({
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
    const i = t, a = ke(t, "modelValue"), d = T(() => i.percent ? `${Math.round(a.value * 100)}%` : `${a.value.toLocaleString()}${i.unit ? ` ${i.unit}` : ""}`), c = (y) => i.log ? Math.log(y / i.min) / Math.log(i.max / i.min) * me : (y - i.min) / (i.max - i.min) * me;
    function h(y) {
      const q = i.log ? i.min * Math.pow(i.max / i.min, y / me) : i.min + (i.max - i.min) * y / me, $ = Math.round(q / i.step) * i.step;
      return Math.min(i.max, Math.max(i.min, Number($.toFixed(4))));
    }
    const p = T({ get: () => Math.round(c(a.value)), set: (y) => {
      a.value = h(y);
    } });
    return (y, q) => (s(), o("div", bl, [
      e("div", pl, [
        e("span", null, u(t.label), 1),
        e("output", fl, u(d.value), 1)
      ]),
      j(e("input", {
        "onUpdate:modelValue": q[0] || (q[0] = ($) => p.value = $),
        type: "range",
        min: "0",
        max: me,
        step: "1",
        "aria-label": t.label,
        "aria-valuetext": d.value,
        disabled: t.disabled,
        style: fe({ "--fill": `${p.value / me * 100}%` })
      }, null, 12, yl), [
        [
          X,
          p.value,
          void 0,
          { number: !0 }
        ]
      ]),
      t.hints ? (s(), o("div", gl, [
        e("span", null, u(t.hints[0]), 1),
        e("span", null, u(t.hints[1]), 1)
      ])) : f("", !0),
      t.note ? (s(), o("small", hl, u(t.note), 1)) : f("", !0)
    ]));
  }
}), kl = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, $l = { class: "fd-track" }, xl = { class: "fd-node" }, wl = { class: "fd-dots" }, Vl = { class: "fd-more" }, Sl = { class: "fd-node goal" }, Cl = /* @__PURE__ */ W({
  __name: "ScoutDiagram",
  props: {
    rounds: {},
    confidence: {},
    extra: {}
  },
  setup(t) {
    const i = t;
    return (a, d) => (s(), o("figure", kl, [
      e("div", $l, [
        d[2] || (d[2] = e("span", { class: "fd-node solid" }, "Pass", -1)),
        (s(!0), o(E, null, L(Math.min(i.rounds, 8), (c) => (s(), o(E, { key: c }, [
          d[0] || (d[0] = e("span", { class: "fd-link" }, null, -1)),
          e("span", xl, [
            e("span", null, "R" + u(c), 1),
            e("span", wl, [
              (s(!0), o(E, null, L(Math.min(i.extra, 6), (h) => (s(), o("i", { key: h }))), 128))
            ])
          ])
        ], 64))), 128)),
        i.rounds > 8 ? (s(), o(E, { key: 0 }, [
          d[1] || (d[1] = e("span", { class: "fd-link" }, null, -1)),
          e("span", Vl, "+" + u(i.rounds - 8), 1)
        ], 64)) : f("", !0),
        d[3] || (d[3] = e("span", { class: "fd-link" }, null, -1)),
        e("span", Sl, "≥ " + u(Math.round(i.confidence * 100)) + "%", 1)
      ]),
      e("figcaption", null, u(i.rounds ? `One pass, then up to ${i.rounds} rounds with up to ${i.extra} new queries each, stopping as soon as confidence reaches ${Math.round(i.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
    ]));
  }
}), El = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, ql = { class: "fd-grid" }, Ul = { class: "fd-node solid" }, Fl = { class: "fd-node" }, Ml = { class: "fd-node" }, Nl = { class: "fd-node goal" }, Bl = /* @__PURE__ */ W({
  __name: "DeepDiagram",
  props: {
    fields: {},
    parallel: {},
    queries: {},
    perQuery: {},
    cap: {}
  },
  setup(t) {
    const i = t, a = T(() => Math.min(i.queries * i.perQuery, i.cap));
    return (d, c) => (s(), o("figure", El, [
      e("div", ql, [
        e("span", Ul, [
          e("b", null, u(t.fields), 1),
          x(" field" + u(t.fields === 1 ? "" : "s"), 1),
          e("small", null, u(t.parallel) + " at a time", 1)
        ]),
        e("span", Fl, [
          e("b", null, u(t.queries), 1),
          c[0] || (c[0] = x(" queries", -1)),
          c[1] || (c[1] = e("small", null, "per field", -1))
        ]),
        e("span", Ml, [
          e("b", null, u(t.perQuery), 1),
          c[2] || (c[2] = x(" chunks", -1)),
          c[3] || (c[3] = e("small", null, "per query", -1))
        ]),
        e("span", Nl, [
          e("b", null, u(a.value), 1),
          c[4] || (c[4] = x(" chunks", -1)),
          e("small", null, u(t.queries * t.perQuery > t.cap ? `capped at ${t.cap}` : "read per field"), 1)
        ])
      ]),
      e("figcaption", null, "Each deep field gets its own queries; up to " + u(a.value) + " chunks are read for it before analysis.", 1)
    ]));
  }
}), Tl = ["disabled"], _l = { class: "muted" }, Rl = { class: "toggle-row" }, Ol = { class: "label-block" }, Ll = { class: "toggle-row" }, Dl = {
  id: "model-map",
  class: "model-role"
}, Al = {
  key: 0,
  class: "chips"
}, Pl = {
  key: 1,
  class: "muted"
}, jl = { class: "toggle-row" }, zl = { class: "grid" }, Il = ["onUpdate:modelValue"], Hl = ["onUpdate:modelValue"], Wl = ["onUpdate:modelValue"], Ql = ["onClick"], Kl = {
  key: 0,
  class: "muted"
}, Jl = { class: "toggle-row" }, Yl = { class: "label-block" }, Gl = {
  id: "model-scout",
  class: "model-role"
}, Xl = {
  key: 2,
  class: "muted"
}, Zl = {
  key: 3,
  class: "toggle-row"
}, ea = { class: "toggle-row" }, ta = { class: "toggle-row" }, la = { class: "label-block" }, aa = {
  id: "model-deep",
  class: "model-role"
}, na = {
  id: "model-deep-query",
  class: "model-role"
}, sa = {
  id: "model-extract",
  class: "model-role"
}, oa = { class: "output-list" }, ia = { class: "chip" }, ua = {
  key: 0,
  class: "muted"
}, da = { class: "toggle-row" }, ra = { class: "toggle-row" }, ca = { class: "toggle-row" }, va = {
  id: "model-verify",
  class: "model-role"
}, ma = /* @__PURE__ */ W({
  __name: "StepInspector",
  props: {
    stage: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(t) {
    const i = t, a = T(() => i.config.stages), d = ($) => $t(i.stage, $), c = gt(), h = T(() => i.config.fields.filter(($) => $.strategy === "deep").length), p = T(() => i.config.fields.filter(($) => $.search_within === "sections").map(($) => $.name || "New field")), y = T(() => Xe(i.config));
    function q($, l) {
      const n = a.value.scout.tools.filter((V) => V !== $);
      a.value.scout.tools = l ? [...n, $] : n;
    }
    return ($, l) => (s(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("p", _l, u(g(ht)[t.stage]), 1),
      t.stage === "map" ? (s(), o(E, { key: 0 }, [
        e("div", Rl, [
          l[33] || (l[33] = e("span", null, "Stage enabled", -1)),
          b(Q, {
            modelValue: a.value.map.enabled,
            "onUpdate:modelValue": l[0] || (l[0] = (n) => a.value.map.enabled = n),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Ol, [
          l[34] || (l[34] = e("span", { id: "outline-label" }, "Outline", -1)),
          b(pe, {
            modelValue: a.value.map.outline,
            "onUpdate:modelValue": l[1] || (l[1] = (n) => a.value.map.outline = n),
            "labelled-by": "outline-label",
            options: [{ value: "find_or_build", label: "Use contents first" }, { value: "build", label: "Always build" }]
          }, null, 8, ["modelValue"]),
          l[35] || (l[35] = e("small", null, "The document's own headings are used when it has them; otherwise the model builds an outline.", -1))
        ]),
        e("div", Ll, [
          l[36] || (l[36] = e("span", null, [
            x("Section summaries"),
            e("small", null, "A short summary per section helps pick the right sections in long documents.")
          ], -1)),
          b(Q, {
            modelValue: a.value.map.section_summaries,
            "onUpdate:modelValue": l[2] || (l[2] = (n) => a.value.map.section_summaries = n),
            label: "Section summaries",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l[38] || (l[38] = e("h4", null, "Models", -1)),
        e("div", Dl, [
          l[37] || (l[37] = e("span", null, "Outliner", -1)),
          b(ae, {
            value: a.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: l[3] || (l[3] = (n) => a.value.map.model = n)
          }, null, 8, ["value"])
        ]),
        l[39] || (l[39] = e("h4", null, "Fields that read sections", -1)),
        p.value.length ? (s(), o("p", Al, [
          (s(!0), o(E, null, L(p.value, (n) => (s(), o("span", {
            key: n,
            class: "chip primary"
          }, u(n), 1))), 128))
        ])) : (s(), o("p", Pl, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : f("", !0),
      t.stage === "prefetch" ? (s(), o(E, { key: 1 }, [
        e("div", jl, [
          l[40] || (l[40] = e("span", null, "Stage enabled", -1)),
          b(Q, {
            modelValue: a.value.prefetch.enabled,
            "onUpdate:modelValue": l[4] || (l[4] = (n) => a.value.prefetch.enabled = n),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l[44] || (l[44] = e("h4", null, "Queries", -1)),
        (s(!0), o(E, null, L(a.value.prefetch.queries, (n, V) => (s(), o("div", {
          key: V,
          class: "query-row"
        }, [
          e("div", zl, [
            e("label", null, [
              l[41] || (l[41] = x("Name", -1)),
              j(e("input", {
                "onUpdate:modelValue": (O) => n.name = O,
                placeholder: "Parties"
              }, null, 8, Il), [
                [X, n.name]
              ])
            ]),
            e("label", null, [
              l[42] || (l[42] = x("Chunks", -1)),
              j(e("input", {
                "onUpdate:modelValue": (O) => n.chunks = O,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, Hl), [
                [
                  X,
                  n.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          e("label", null, [
            l[43] || (l[43] = x("Query", -1)),
            j(e("textarea", {
              "onUpdate:modelValue": (O) => n.query = O,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, Wl), [
              [X, n.query]
            ])
          ]),
          t.readonly ? f("", !0) : (s(), o("button", {
            key: 0,
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo sm",
            onClick: (O) => a.value.prefetch.queries.splice(V, 1)
          }, "Remove query", 8, Ql))
        ]))), 128)),
        a.value.prefetch.queries.length ? f("", !0) : (s(), o("p", Kl, "No fixed queries. Field search hints still run.")),
        t.readonly ? f("", !0) : (s(), o("button", {
          key: 1,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          onClick: l[5] || (l[5] = (n) => a.value.prefetch.queries.push(g(kt)()))
        }, "Add query"))
      ], 64)) : f("", !0),
      t.stage === "scout" ? (s(), o(E, { key: 2 }, [
        e("div", Jl, [
          l[45] || (l[45] = e("span", null, "Stage enabled", -1)),
          b(Q, {
            modelValue: a.value.scout.enabled,
            "onUpdate:modelValue": l[6] || (l[6] = (n) => a.value.scout.enabled = n),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Yl, [
          l[46] || (l[46] = e("span", { id: "mode-label" }, "Mode", -1)),
          b(pe, {
            modelValue: a.value.scout.mode,
            "onUpdate:modelValue": l[7] || (l[7] = (n) => a.value.scout.mode = n),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          e("small", null, u(a.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        a.value.scout.mode === "loop" ? (s(), ee(Cl, {
          key: 0,
          rounds: a.value.scout.max_rounds,
          confidence: a.value.scout.target_confidence,
          extra: a.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"])) : f("", !0),
        l[51] || (l[51] = e("h4", null, "Models", -1)),
        e("div", Gl, [
          l[47] || (l[47] = e("span", null, "Scout", -1)),
          b(ae, {
            value: a.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: l[8] || (l[8] = (n) => a.value.scout.model = n)
          }, null, 8, ["value"])
        ]),
        l[52] || (l[52] = e("h4", null, "Loop", -1)),
        b(Y, {
          modelValue: a.value.scout.max_rounds,
          "onUpdate:modelValue": l[9] || (l[9] = (n) => a.value.scout.max_rounds = n),
          label: a.value.scout.mode === "agent" ? "Rounds" : "Follow-up rounds",
          min: d("max_rounds").min,
          max: d("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        a.value.scout.mode === "loop" ? (s(), ee(Y, {
          key: 1,
          modelValue: a.value.scout.target_confidence,
          "onUpdate:modelValue": l[10] || (l[10] = (n) => a.value.scout.target_confidence = n),
          label: "Stop at confidence",
          min: d("target_confidence").min,
          max: d("target_confidence").max,
          step: 0.05,
          percent: "",
          hints: ["Stop early", "Keep looking"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])) : f("", !0),
        b(Y, {
          modelValue: a.value.scout.max_extra_queries,
          "onUpdate:modelValue": l[11] || (l[11] = (n) => a.value.scout.max_extra_queries = n),
          label: a.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: d("max_extra_queries").min,
          max: d("max_extra_queries").max,
          disabled: t.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        b(Y, {
          modelValue: a.value.scout.max_tokens,
          "onUpdate:modelValue": l[12] || (l[12] = (n) => a.value.scout.max_tokens = n),
          label: "Scout output limit",
          min: d("max_tokens").min,
          max: d("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        a.value.scout.mode === "agent" ? (s(), o("p", Xl, "Tool budget: " + u(a.value.scout.max_rounds * a.value.scout.max_extra_queries) + " calls.", 1)) : f("", !0),
        a.value.scout.mode === "loop" ? (s(), o("div", Zl, [
          l[48] || (l[48] = e("span", null, [
            x("Drop noisy chunks"),
            e("small", null, "Chunks no field needs leave the evidence pool; chunks cited for a field always stay.")
          ], -1)),
          b(Q, {
            modelValue: a.value.scout.drop_noise,
            "onUpdate:modelValue": l[13] || (l[13] = (n) => a.value.scout.drop_noise = n),
            label: "Drop noisy chunks",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])) : f("", !0),
        e("div", ea, [
          l[49] || (l[49] = e("span", null, [
            x("Share scout notes with extraction"),
            e("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          b(Q, {
            modelValue: a.value.scout.share_notes,
            "onUpdate:modelValue": l[14] || (l[14] = (n) => a.value.scout.share_notes = n),
            label: "Share scout notes with extraction",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        a.value.scout.mode === "agent" ? (s(), o(E, { key: 4 }, [
          l[50] || (l[50] = e("h4", null, "Agent tools", -1)),
          (s(!0), o(E, null, L(g(c), (n) => (s(), o("div", {
            key: n,
            class: "toggle-row"
          }, [
            e("span", null, u(g(Re)(n)), 1),
            b(Q, {
              "model-value": a.value.scout.tools.includes(n),
              label: g(Re)(n),
              disabled: t.readonly,
              "onUpdate:modelValue": (V) => q(n, V)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : f("", !0)
      ], 64)) : f("", !0),
      t.stage === "deep" ? (s(), o(E, { key: 3 }, [
        e("div", ta, [
          l[53] || (l[53] = e("span", null, "Stage enabled", -1)),
          b(Q, {
            modelValue: a.value.deep.enabled,
            "onUpdate:modelValue": l[15] || (l[15] = (n) => a.value.deep.enabled = n),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        b(Bl, {
          fields: h.value,
          parallel: a.value.deep.parallel_fields,
          queries: a.value.deep.max_queries,
          "per-query": a.value.deep.chunks_per_query,
          cap: a.value.deep.chunk_cap
        }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"]),
        e("div", la, [
          l[54] || (l[54] = e("span", { id: "read-label" }, "Reads", -1)),
          b(pe, {
            modelValue: a.value.deep.read,
            "onUpdate:modelValue": l[16] || (l[16] = (n) => a.value.deep.read = n),
            "labelled-by": "read-label",
            options: [{ value: "chunks", label: "Retrieved chunks" }, { value: "sections", label: "Whole sections" }]
          }, null, 8, ["modelValue"]),
          l[55] || (l[55] = e("small", null, "Whole sections suit clauses that span many passages; long sections fall back to chunks.", -1))
        ]),
        l[58] || (l[58] = e("h4", null, "Models", -1)),
        e("div", aa, [
          l[56] || (l[56] = e("span", null, "Analysis", -1)),
          b(ae, {
            value: a.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: l[17] || (l[17] = (n) => a.value.deep.model = n)
          }, null, 8, ["value"])
        ]),
        e("div", na, [
          l[57] || (l[57] = e("span", null, "Query writer", -1)),
          b(ae, {
            value: a.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: l[18] || (l[18] = (n) => a.value.deep.query_model = n)
          }, null, 8, ["value"])
        ]),
        l[59] || (l[59] = e("h4", null, "Reach", -1)),
        b(Y, {
          modelValue: a.value.deep.parallel_fields,
          "onUpdate:modelValue": l[19] || (l[19] = (n) => a.value.deep.parallel_fields = n),
          label: "Fields at a time",
          min: d("parallel_fields").min,
          max: d("parallel_fields").max,
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(Y, {
          modelValue: a.value.deep.max_queries,
          "onUpdate:modelValue": l[20] || (l[20] = (n) => a.value.deep.max_queries = n),
          label: "Queries per field",
          min: d("max_queries").min,
          max: d("max_queries").max,
          log: "",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(Y, {
          modelValue: a.value.deep.chunks_per_query,
          "onUpdate:modelValue": l[21] || (l[21] = (n) => a.value.deep.chunks_per_query = n),
          label: "Chunks per query",
          min: d("chunks_per_query").min,
          max: d("chunks_per_query").max,
          log: "",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(Y, {
          modelValue: a.value.deep.chunk_cap,
          "onUpdate:modelValue": l[22] || (l[22] = (n) => a.value.deep.chunk_cap = n),
          label: "Chunk cap per field",
          min: d("chunk_cap").min,
          max: d("chunk_cap").max,
          log: "",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(Y, {
          modelValue: a.value.deep.min_similarity,
          "onUpdate:modelValue": l[23] || (l[23] = (n) => a.value.deep.min_similarity = n),
          label: "Minimum similarity",
          min: d("min_similarity").min,
          max: d("min_similarity").max,
          step: 0.05,
          percent: "",
          hints: ["Loose", "Strict"],
          note: "Chunks less similar than this are skipped.",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        l[60] || (l[60] = e("h4", null, "Temperature", -1)),
        b(Y, {
          modelValue: a.value.deep.query_temperature,
          "onUpdate:modelValue": l[24] || (l[24] = (n) => a.value.deep.query_temperature = n),
          label: "Query writing",
          min: d("query_temperature").min,
          max: d("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(Y, {
          modelValue: a.value.deep.analysis_temperature,
          "onUpdate:modelValue": l[25] || (l[25] = (n) => a.value.deep.analysis_temperature = n),
          label: "Analysis",
          min: d("analysis_temperature").min,
          max: d("analysis_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : f("", !0),
      t.stage === "extract" ? (s(), o(E, { key: 4 }, [
        l[62] || (l[62] = e("h4", null, "Models", -1)),
        e("div", sa, [
          l[61] || (l[61] = e("span", null, "Extraction", -1)),
          b(ae, {
            value: a.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: l[26] || (l[26] = (n) => a.value.extract.model = n)
          }, null, 8, ["value"])
        ]),
        l[63] || (l[63] = e("h4", null, "Field groups", -1)),
        e("ul", oa, [
          (s(!0), o(E, null, L(y.value, (n) => (s(), o("li", {
            key: n.name
          }, [
            e("span", null, u(n.name), 1),
            e("span", ia, u(n.fields.length) + " field" + u(n.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        y.value.length ? f("", !0) : (s(), o("p", ua, "No fields yet.")),
        b(Y, {
          modelValue: a.value.extract.max_fields_per_call,
          "onUpdate:modelValue": l[27] || (l[27] = (n) => a.value.extract.max_fields_per_call = n),
          label: "Fields per call",
          min: d("max_fields_per_call").min,
          max: d("max_fields_per_call").max,
          disabled: t.readonly,
          note: `${g(We)(t.config)} extraction call${g(We)(t.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        b(Y, {
          modelValue: a.value.extract.max_output_tokens,
          "onUpdate:modelValue": l[28] || (l[28] = (n) => a.value.extract.max_output_tokens = n),
          label: "Output limit",
          min: d("max_output_tokens").min,
          max: d("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : f("", !0),
      t.stage === "verify" ? (s(), o(E, { key: 5 }, [
        e("div", da, [
          l[64] || (l[64] = e("span", null, "Stage enabled", -1)),
          b(Q, {
            modelValue: a.value.verify.enabled,
            "onUpdate:modelValue": l[29] || (l[29] = (n) => a.value.verify.enabled = n),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", ra, [
          l[65] || (l[65] = e("span", null, [
            x("Quotes exist"),
            e("small", null, "Each quote is matched against the document text. No model call.")
          ], -1)),
          b(Q, {
            modelValue: a.value.verify.check_quotes,
            "onUpdate:modelValue": l[30] || (l[30] = (n) => a.value.verify.check_quotes = n),
            label: "Quotes exist",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", ca, [
          l[66] || (l[66] = e("span", null, [
            x("Quotes support values"),
            e("small", null, "A model confirms each quote supports its value.")
          ], -1)),
          b(Q, {
            modelValue: a.value.verify.check_support,
            "onUpdate:modelValue": l[31] || (l[31] = (n) => a.value.verify.check_support = n),
            label: "Quotes support values",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        a.value.verify.check_support ? (s(), o(E, { key: 0 }, [
          l[68] || (l[68] = e("h4", null, "Models", -1)),
          e("div", va, [
            l[67] || (l[67] = e("span", null, "Checker", -1)),
            b(ae, {
              value: a.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: l[32] || (l[32] = (n) => a.value.verify.model = n)
            }, null, 8, ["value"])
          ])
        ], 64)) : f("", !0)
      ], 64)) : f("", !0)
    ], 8, Tl));
  }
}), ba = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, pa = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, fa = ["x", "y", "width"], ya = ["x", "width"], ga = /* @__PURE__ */ W({
  __name: "ChunkDiagram",
  props: {
    size: {},
    overlap: {}
  },
  setup(t) {
    const i = t, a = T(() => Math.min(0.9, Math.max(0, i.overlap / i.size))), d = T(() => {
      const c = 100 / (3 - 2 * a.value);
      return [0, 1, 2].map((h) => ({ x: h * c * (1 - a.value), w: c }));
    });
    return (c, h) => (s(), o("figure", ba, [
      (s(), o("svg", pa, [
        (s(!0), o(E, null, L(d.value, (p, y) => (s(), o("rect", {
          key: y,
          x: p.x,
          y: y % 2 ? 14 : 4,
          width: p.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, fa))), 128)),
        (s(), o(E, null, L([1, 2], (p) => e("rect", {
          key: "o" + p,
          x: d.value[p].x,
          y: 4,
          width: d.value[p - 1].x + d.value[p - 1].w - d.value[p].x,
          height: "24",
          class: "shared"
        }, null, 8, ya)), 64))
      ])),
      e("figcaption", null, u(t.size.toLocaleString()) + " tokens per chunk · " + u(t.overlap.toLocaleString()) + " shared with the next (" + u(Math.round(a.value * 100)) + "%)", 1)
    ]));
  }
}), ha = ["disabled"], ka = { class: "muted" }, $a = { class: "toggle-row" }, xa = { class: "toggle-row" }, wa = { class: "label-block" }, Va = {
  key: 0,
  id: "context-model",
  class: "model-role"
}, Sa = { class: "label-block" }, Ca = {
  id: "embedding-model",
  class: "model-role"
}, Ea = { class: "toggle-row" }, qa = {
  key: 1,
  id: "highlighter-model",
  class: "model-role"
}, Ua = /* @__PURE__ */ W({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(t) {
    const i = t, a = T(() => i.config.retrieval), d = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], c = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], h = Ne("chunk_size"), p = Ne("overlap"), y = Ne("section_budget"), q = T(() => Math.min(p.max, a.value.chunk_size - 50));
    return ($, l) => (s(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("p", ka, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + u(t.retention) + ".", 1),
      l[19] || (l[19] = e("h4", null, "Chunks", -1)),
      b(ga, {
        size: a.value.chunk_size,
        overlap: a.value.overlap
      }, null, 8, ["size", "overlap"]),
      b(Y, {
        modelValue: a.value.chunk_size,
        "onUpdate:modelValue": l[0] || (l[0] = (n) => a.value.chunk_size = n),
        label: "Chunk size",
        min: g(h).min,
        max: g(h).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: t.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      b(Y, {
        modelValue: a.value.overlap,
        "onUpdate:modelValue": l[1] || (l[1] = (n) => a.value.overlap = n),
        label: "Overlap",
        min: g(p).min,
        max: q.value,
        step: 10,
        unit: "tokens",
        disabled: t.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      e("div", $a, [
        l[11] || (l[11] = e("span", null, [
          x("Split by headings"),
          e("small", null, "A chunk never crosses a heading.")
        ], -1)),
        b(Q, {
          modelValue: a.value.split_headings,
          "onUpdate:modelValue": l[2] || (l[2] = (n) => a.value.split_headings = n),
          label: "Split by headings",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      e("div", xa, [
        l[12] || (l[12] = e("span", null, [
          x("Keep tables whole"),
          e("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        b(Q, {
          modelValue: a.value.keep_tables,
          "onUpdate:modelValue": l[3] || (l[3] = (n) => a.value.keep_tables = n),
          label: "Keep tables whole",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      b(Y, {
        modelValue: a.value.section_budget,
        "onUpdate:modelValue": l[4] || (l[4] = (n) => a.value.section_budget = n),
        label: "Section budget",
        min: g(y).min,
        max: g(y).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: t.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      l[20] || (l[20] = e("h4", null, "Context", -1)),
      e("div", wa, [
        l[13] || (l[13] = e("span", { id: "context-label" }, "Chunk context", -1)),
        b(pe, {
          modelValue: a.value.context,
          "onUpdate:modelValue": l[5] || (l[5] = (n) => a.value.context = n),
          "labelled-by": "context-label",
          options: c
        }, null, 8, ["modelValue"]),
        e("small", null, u(c.find((n) => n.value === a.value.context)?.note), 1)
      ]),
      a.value.context === "generated" ? (s(), o("div", Va, [
        l[14] || (l[14] = e("span", null, "Context writer", -1)),
        b(ae, {
          value: a.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: l[6] || (l[6] = (n) => a.value.context_model = n)
        }, null, 8, ["value"])
      ])) : f("", !0),
      l[21] || (l[21] = e("h4", null, "Search", -1)),
      e("div", Sa, [
        l[15] || (l[15] = e("span", { id: "mode-label" }, "Search mode", -1)),
        b(pe, {
          modelValue: a.value.search_mode,
          "onUpdate:modelValue": l[7] || (l[7] = (n) => a.value.search_mode = n),
          "labelled-by": "mode-label",
          options: d
        }, null, 8, ["modelValue"]),
        e("small", null, u(d.find((n) => n.value === a.value.search_mode)?.note), 1)
      ]),
      l[22] || (l[22] = e("h4", null, "Models", -1)),
      e("div", Ca, [
        l[16] || (l[16] = e("span", null, "Embedding", -1)),
        b(ae, {
          value: a.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: l[8] || (l[8] = (n) => a.value.embedding_model = n)
        }, null, 8, ["value"])
      ]),
      e("div", Ea, [
        l[17] || (l[17] = e("span", null, [
          x("Highlighter"),
          e("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        b(Q, {
          modelValue: a.value.highlighter,
          "onUpdate:modelValue": l[9] || (l[9] = (n) => a.value.highlighter = n),
          label: "Highlighter",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      a.value.highlighter ? (s(), o("div", qa, [
        l[18] || (l[18] = e("span", null, "Highlighter", -1)),
        b(ae, {
          value: a.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: l[10] || (l[10] = (n) => a.value.highlighter_model = n)
        }, null, 8, ["value"])
      ])) : f("", !0)
    ], 8, ha));
  }
}), Fa = ["inert"], Ma = { class: "canvas-inner" }, Na = {
  class: "block",
  "aria-labelledby": "fields-head"
}, Ba = { class: "block-head" }, Ta = ["aria-expanded"], _a = { class: "count" }, Ra = {
  key: 0,
  class: "block-peek"
}, Oa = {
  id: "fields-body",
  class: "block-body"
}, La = {
  key: 0,
  class: "block-empty"
}, Da = {
  key: 1,
  class: "rows"
}, Aa = ["onClick"], Pa = { class: "row-name" }, ja = {
  key: 0,
  class: "req",
  title: "Required"
}, za = { class: "chips" }, Ia = {
  key: 1,
  class: "chip"
}, Ha = ["title"], Wa = { class: "chip" }, Qa = {
  key: 3,
  class: "chip",
  title: "Evidence required"
}, Ka = {
  key: 0,
  class: "row-actions"
}, Ja = ["disabled", "onClick"], Ya = ["disabled", "onClick"], Ga = {
  class: "block",
  "aria-labelledby": "flow-head"
}, Xa = { class: "block-head" }, Za = ["aria-expanded"], en = { class: "count" }, tn = {
  key: 0,
  class: "block-peek"
}, ln = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, an = { class: "node-icon" }, nn = { class: "node-main" }, sn = { class: "node-summary" }, on = { class: "node-side" }, un = { class: "chip model" }, dn = { class: "branches" }, rn = { class: "branch" }, cn = { class: "branch" }, vn = { class: "node-icon" }, mn = { class: "node-main" }, bn = { class: "node-summary" }, pn = ["aria-labelledby", "role", "aria-modal"], fn = ["aria-valuenow"], yn = { class: "side-panel-head" }, gn = { class: "side-panel-icon" }, hn = ["id"], kn = ["aria-label", "title"], $n = ["disabled"], xn = {
  key: 4,
  class: "inspector-form"
}, wn = { class: "output-list" }, Vn = { class: "mono" }, Sn = { class: "chip" }, Cn = { class: "rail-label" }, Be = 400, Ve = 320, En = /* @__PURE__ */ W({
  __name: "Builder",
  props: /* @__PURE__ */ Ue({
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
    const i = t, a = ke(t, "title"), d = ke(t, "description"), c = _({ kind: "document" });
    function h(k, m) {
      try {
        const M = localStorage.getItem(`docscout.${k}`);
        return M === null ? m : M === "1";
      } catch {
        return m;
      }
    }
    function p(k, m) {
      try {
        localStorage.setItem(`docscout.${k}`, m ? "1" : "0");
      } catch {
      }
    }
    const y = _(h("panel", !0)), q = _(h("fields", !0)), $ = _(h("flow", !0));
    function l() {
      try {
        const k = Number(localStorage.getItem("docscout.panelWidth"));
        return k >= Ve ? k : Be;
      } catch {
        return Be;
      }
    }
    const n = _(l()), V = () => {
      const k = N.value?.clientWidth;
      return k ? Math.max(Ve, k - 420) : Number.POSITIVE_INFINITY;
    };
    function O(k, m = !0) {
      if (n.value = Math.round(Math.min(V(), Math.max(Ve, k))), m)
        try {
          localStorage.setItem("docscout.panelWidth", String(n.value));
        } catch {
        }
    }
    const U = _(!1);
    function B(k) {
      const m = k.currentTarget, M = k.clientX, J = n.value;
      m.setPointerCapture(k.pointerId), U.value = !0;
      const ie = (it) => O(J + (M - it.clientX), !1), je = () => {
        U.value = !1, O(n.value), m.removeEventListener("pointermove", ie), m.removeEventListener("pointerup", je);
      };
      m.addEventListener("pointermove", ie), m.addEventListener("pointerup", je);
    }
    function S(k) {
      k.key === "ArrowLeft" ? (O(n.value + 24), k.preventDefault()) : k.key === "ArrowRight" && (O(n.value - 24), k.preventDefault());
    }
    let D = null;
    const z = _(), I = ut();
    async function H(k) {
      if (y.value = k, !F.value) {
        p("panel", k);
        return;
      }
      if (!k && D) {
        const m = D;
        D = null, await Me(), m.focus();
      }
    }
    function A(k) {
      const m = k === "fields" ? q : $;
      m.value = !m.value, p(k, m.value);
    }
    const N = _(), F = _(!1);
    let te;
    Fe(() => {
      te = new ResizeObserver(([k]) => {
        const m = F.value;
        F.value = k.contentRect.width < 1e3, F.value && !m && (y.value = !1), !F.value && m && (y.value = h("panel", !0));
      }), N.value && te.observe(N.value);
    }), Ge(() => te?.disconnect());
    const ne = _();
    de(c, async () => {
      await Me(), ne.value && (ne.value.scrollTop = 0);
    });
    async function K(k) {
      F.value && !y.value && (D = N.value?.getRootNode()?.activeElement), c.value = k, y.value = !0, F.value && (await Me(), z.value?.focus());
    }
    const G = (k) => JSON.stringify(k) === JSON.stringify(c.value), C = T(() => c.value.kind === "field" ? i.config.fields[c.value.index] : void 0), v = T(() => {
      const k = c.value;
      return k.kind === "stage" ? ue[k.stage] : k.kind === "field" ? C.value?.name || "New field" : k.kind === "document" ? "Read document" : k.kind === "output" ? "Output" : "Details";
    }), r = T(() => {
      const k = c.value;
      return k.kind === "stage" ? Oe[k.stage] : k.kind === "field" ? "tabler:forms" : k.kind === "document" ? "tabler:file-text" : k.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), w = T(() => i.config.fields.filter((k, m) => !(c.value.kind === "field" && c.value.index === m)).map((k) => k.name)), Z = T(() => i.config.stages.deep.enabled), oe = T(() => i.config.stages.map.enabled), xe = T(() => [...new Set(i.config.fields.map((k) => k.group.trim()).filter(Boolean))]), re = (k) => et(i.config.fields[k], i.config.fields.filter((m, M) => M !== k).map((m) => m.name)), ye = ["map", "prefetch", "scout", "deep", "extract", "verify"], lt = T(() => ye.filter((k) => Ce(i.config, k)).map((k) => ue[k]).join(" · ")), at = T(() => i.config.fields.map((k) => k.name || "New field").join(", ")), nt = T(() => ye.filter((k) => Ce(i.config, k)).length), ce = (k) => i.result?.trace.find((m) => m.kind === k);
    function st() {
      i.config.fields.push(wt()), q.value = !0, K({ kind: "field", index: i.config.fields.length - 1 });
    }
    function ot(k) {
      i.config.fields.splice(k, 1), c.value = { kind: "document" };
    }
    function De(k, m) {
      const M = i.config.fields, J = k + m;
      if (J < 0 || J >= M.length) return;
      const [ie] = M.splice(k, 1);
      M.splice(J, 0, ie), c.value = { kind: "field", index: J };
    }
    const Ae = (k) => k.type === "list" ? `list of ${k.item_type}` : k.type, Pe = T({ get: () => i.config.tags.join(", "), set: (k) => {
      i.config.tags = [...new Set(k.split(",").map((m) => m.trim()).filter(Boolean))];
    } });
    return (k, m) => (s(), o("div", {
      ref_key: "root",
      ref: N,
      class: P(["builder", { narrow: F.value, "panel-open": y.value, resizing: U.value }])
    }, [
      e("div", {
        class: "canvas",
        inert: F.value && y.value
      }, [
        e("div", Ma, [
          e("section", Na, [
            e("header", Ba, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": q.value,
                "aria-controls": "fields-body",
                onClick: m[0] || (m[0] = (M) => A("fields"))
              }, [
                b(g(R), {
                  icon: q.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                m[20] || (m[20] = e("h2", { id: "fields-head" }, "Fields", -1)),
                e("span", _a, u(t.config.fields.length), 1)
              ], 8, Ta),
              !q.value && t.config.fields.length ? (s(), o("span", Ra, u(at.value), 1)) : f("", !0),
              t.readonly ? f("", !0) : (s(), o("button", {
                key: 1,
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo sm push",
                onClick: st
              }, [
                b(g(R), { icon: "tabler:plus" }),
                m[21] || (m[21] = x("Add field", -1))
              ]))
            ]),
            j(e("div", Oa, [
              t.config.fields.length ? (s(), o("ul", Da, [
                (s(!0), o(E, null, L(t.config.fields, (M, J) => (s(), o("li", {
                  key: J,
                  class: P(["row-item", { active: G({ kind: "field", index: J }) }])
                }, [
                  e("button", {
                    type: "button",
                    class: "row-main",
                    onClick: (ie) => K({ kind: "field", index: J })
                  }, [
                    e("span", Pa, [
                      x(u(M.name || "New field"), 1),
                      M.required ? (s(), o("span", ja, "*")) : f("", !0),
                      re(J) ? (s(), ee(g(R), {
                        key: 1,
                        icon: "tabler:alert-circle",
                        class: "row-warn",
                        title: re(J)
                      }, null, 8, ["title"])) : f("", !0)
                    ]),
                    e("span", {
                      class: P(["row-desc", { missing: !M.description }])
                    }, u(M.description || "No description"), 3),
                    e("span", za, [
                      M.search_within === "sections" ? (s(), o("span", {
                        key: 0,
                        class: P(["chip", oe.value ? "" : "muted-chip"]),
                        title: "Reads the sections Map picks"
                      }, "sections", 2)) : f("", !0),
                      M.group.trim() ? (s(), o("span", Ia, u(M.group), 1)) : f("", !0),
                      M.strategy === "deep" ? (s(), o("span", {
                        key: 2,
                        class: P(["chip", Z.value ? "primary" : "muted-chip"]),
                        title: Z.value ? "Deep analysis" : "Deep analysis is off in the flow"
                      }, "deep", 10, Ha)) : f("", !0),
                      e("span", Wa, u(Ae(M)), 1),
                      M.evidence_required ? (s(), o("span", Qa, [
                        b(g(R), { icon: "tabler:quote" })
                      ])) : f("", !0)
                    ])
                  ], 8, Aa),
                  t.readonly ? f("", !0) : (s(), o("span", Ka, [
                    e("button", {
                      type: "button",
                      class: "kx-iconbtn kx-focus-outline",
                      "aria-label": "Move field up",
                      disabled: J === 0,
                      onClick: (ie) => De(J, -1)
                    }, [
                      b(g(R), { icon: "tabler:chevron-up" })
                    ], 8, Ja),
                    e("button", {
                      type: "button",
                      class: "kx-iconbtn kx-focus-outline",
                      "aria-label": "Move field down",
                      disabled: J === t.config.fields.length - 1,
                      onClick: (ie) => De(J, 1)
                    }, [
                      b(g(R), { icon: "tabler:chevron-down" })
                    ], 8, Ya)
                  ]))
                ], 2))), 128))
              ])) : (s(), o("p", La, "Add the values to pull from each document."))
            ], 512), [
              [_e, q.value]
            ])
          ]),
          e("section", Ga, [
            e("header", Xa, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": $.value,
                "aria-controls": "flow-body",
                onClick: m[1] || (m[1] = (M) => A("flow"))
              }, [
                b(g(R), {
                  icon: $.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                m[22] || (m[22] = e("h2", { id: "flow-head" }, "Flow", -1)),
                e("span", en, u(nt.value) + " of 6", 1)
              ], 8, Za),
              $.value ? f("", !0) : (s(), o("span", tn, u(lt.value), 1)),
              e("button", {
                type: "button",
                class: P(["kx-btn kx-btn-ghost kx-focus-halo sm push", { on: G({ kind: "details" }) }]),
                onClick: m[2] || (m[2] = (M) => K({ kind: "details" }))
              }, [
                b(g(R), { icon: "tabler:info-circle" }),
                m[23] || (m[23] = x("Details", -1))
              ], 2)
            ]),
            j(e("div", ln, [
              e("button", {
                type: "button",
                class: P(["node kx-focus-halo fixed", { active: G({ kind: "document" }) }]),
                onClick: m[3] || (m[3] = (M) => K({ kind: "document" }))
              }, [
                e("span", an, [
                  b(g(R), { icon: "tabler:file-text" })
                ]),
                e("span", nn, [
                  m[24] || (m[24] = e("span", { class: "node-title" }, "Read document", -1)),
                  e("span", sn, u(g(xt)(t.config.retrieval)), 1)
                ]),
                e("span", on, [
                  e("span", un, u(g(Ze)(t.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              m[29] || (m[29] = e("div", { class: "connector" }, null, -1)),
              b(ve, {
                stage: "map",
                config: t.config,
                active: G({ kind: "stage", stage: "map" }),
                trace: ce("map"),
                readonly: t.readonly,
                onSelect: m[4] || (m[4] = (M) => K({ kind: "stage", stage: "map" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              m[30] || (m[30] = e("div", {
                class: "fork",
                "aria-hidden": "true"
              }, [
                e("span")
              ], -1)),
              e("div", dn, [
                e("div", rn, [
                  m[25] || (m[25] = e("span", { class: "branch-label" }, "Evidence", -1)),
                  b(ve, {
                    stage: "prefetch",
                    config: t.config,
                    active: G({ kind: "stage", stage: "prefetch" }),
                    trace: ce("prefetch"),
                    readonly: t.readonly,
                    onSelect: m[5] || (m[5] = (M) => K({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  m[26] || (m[26] = e("div", { class: "connector" }, null, -1)),
                  b(ve, {
                    stage: "scout",
                    config: t.config,
                    active: G({ kind: "stage", stage: "scout" }),
                    trace: ce("scout"),
                    readonly: t.readonly,
                    onSelect: m[6] || (m[6] = (M) => K({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                e("div", cn, [
                  m[27] || (m[27] = e("span", { class: "branch-label" }, "Deep fields", -1)),
                  b(ve, {
                    stage: "deep",
                    config: t.config,
                    active: G({ kind: "stage", stage: "deep" }),
                    trace: ce("deep"),
                    readonly: t.readonly,
                    onSelect: m[7] || (m[7] = (M) => K({ kind: "stage", stage: "deep" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ])
              ]),
              m[31] || (m[31] = e("div", {
                class: "join",
                "aria-hidden": "true"
              }, [
                e("span")
              ], -1)),
              b(ve, {
                stage: "extract",
                config: t.config,
                active: G({ kind: "stage", stage: "extract" }),
                trace: ce("extract"),
                readonly: t.readonly,
                onSelect: m[8] || (m[8] = (M) => K({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              m[32] || (m[32] = e("div", { class: "connector" }, null, -1)),
              b(ve, {
                stage: "verify",
                config: t.config,
                active: G({ kind: "stage", stage: "verify" }),
                trace: ce("verify"),
                readonly: t.readonly,
                onSelect: m[9] || (m[9] = (M) => K({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              m[33] || (m[33] = e("div", { class: "connector" }, null, -1)),
              e("button", {
                type: "button",
                class: P(["node kx-focus-halo fixed", { active: G({ kind: "output" }) }]),
                onClick: m[10] || (m[10] = (M) => K({ kind: "output" }))
              }, [
                e("span", vn, [
                  b(g(R), { icon: "tabler:braces" })
                ]),
                e("span", mn, [
                  m[28] || (m[28] = e("span", { class: "node-title" }, "Output", -1)),
                  e("span", bn, u(t.config.fields.length ? `${t.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [_e, $.value]
            ])
          ])
        ])
      ], 8, Fa),
      F.value && y.value ? (s(), o("div", {
        key: 0,
        class: "scrim",
        onClick: m[11] || (m[11] = (M) => H(!1))
      })) : f("", !0),
      y.value ? j((s(), o("aside", {
        key: String(F.value),
        class: "side-panel",
        "aria-labelledby": g(I),
        role: F.value ? "dialog" : void 0,
        "aria-modal": F.value ? "true" : void 0,
        style: fe(F.value ? void 0 : { width: `${n.value}px` }),
        onKeydown: m[18] || (m[18] = Te((M) => F.value && H(!1), ["esc"]))
      }, [
        F.value ? f("", !0) : (s(), o("div", {
          key: 0,
          class: P(["resizer kx-focus-outline", { active: U.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": n.value,
          "aria-valuemin": Ve,
          onPointerdown: qe(B, ["prevent"]),
          onKeydown: S,
          onDblclick: m[12] || (m[12] = (M) => O(Be))
        }, null, 42, fn)),
        e("header", yn, [
          e("span", gn, [
            b(g(R), { icon: r.value }, null, 8, ["icon"])
          ]),
          e("h2", { id: g(I) }, u(v.value), 9, hn),
          e("button", {
            ref_key: "closeButton",
            ref: z,
            type: "button",
            class: "kx-iconbtn kx-focus-outline push",
            "aria-label": F.value ? "Close panel" : "Collapse panel",
            title: F.value ? "Close panel" : "Collapse panel",
            onClick: m[13] || (m[13] = (M) => H(!1))
          }, [
            b(g(R), {
              icon: F.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ], 8, kn)
        ]),
        e("div", {
          ref_key: "panelBody",
          ref: ne,
          class: "side-panel-body"
        }, [
          c.value.kind === "document" ? (s(), ee(Ua, {
            key: 0,
            config: t.config,
            retention: t.retention,
            readonly: t.readonly
          }, null, 8, ["config", "retention", "readonly"])) : c.value.kind === "stage" ? (s(), ee(ma, {
            key: 1,
            stage: c.value.stage,
            config: t.config,
            readonly: t.readonly
          }, null, 8, ["stage", "config", "readonly"])) : c.value.kind === "field" && C.value ? (s(), ee(rl, {
            key: 2,
            field: C.value,
            "other-names": w.value,
            groups: xe.value,
            "deep-enabled": Z.value,
            "map-enabled": oe.value,
            readonly: t.readonly,
            onRemove: m[14] || (m[14] = (M) => ot(c.value.index))
          }, null, 8, ["field", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"])) : c.value.kind === "details" ? (s(), o("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: t.readonly
          }, [
            e("label", null, [
              m[34] || (m[34] = x("Name", -1)),
              j(e("input", {
                "onUpdate:modelValue": m[15] || (m[15] = (M) => a.value = M),
                "aria-label": "Extractor name"
              }, null, 512), [
                [X, a.value]
              ])
            ]),
            e("label", null, [
              m[35] || (m[35] = x("Description", -1)),
              j(e("textarea", {
                "onUpdate:modelValue": m[16] || (m[16] = (M) => d.value = M),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [X, d.value]
              ])
            ]),
            e("label", null, [
              m[36] || (m[36] = x("Tags", -1)),
              j(e("input", {
                "onUpdate:modelValue": m[17] || (m[17] = (M) => Pe.value = M),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  X,
                  Pe.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              m[37] || (m[37] = e("small", null, "Comma separated", -1))
            ])
          ], 8, $n)) : c.value.kind === "output" ? (s(), o("div", xn, [
            m[38] || (m[38] = e("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            e("ul", wn, [
              (s(!0), o(E, null, L(t.config.fields, (M) => (s(), o("li", {
                key: M.name
              }, [
                e("span", Vn, u(M.name || "New field"), 1),
                e("span", Sn, u(Ae(M)), 1)
              ]))), 128))
            ]),
            m[39] || (m[39] = e("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : f("", !0)
        ], 512)
      ], 44, pn)), [
        [g(Nt), { disabled: !F.value }]
      ]) : F.value ? f("", !0) : (s(), o("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: m[19] || (m[19] = (M) => H(!0))
      }, [
        b(g(R), { icon: "tabler:layout-sidebar-right-expand" }),
        e("span", Cn, u(v.value), 1)
      ]))
    ], 2));
  }
}), qn = ["selected"], Un = {
  key: 1,
  role: "alert"
}, Fn = {
  key: 2,
  class: "muted"
}, tt = /* @__PURE__ */ W({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(t, { emit: i }) {
    const a = i, d = _(!1), c = _("");
    Fe(async () => {
      try {
        await Le("wc-multiselect", { timeoutMs: 8e3 }), d.value = !0;
      } catch (p) {
        c.value = String(p);
      }
    });
    function h(p) {
      const y = p.detail;
      a("select", y.selected[0] || "", y.labels?.[0] || "");
    }
    return (p, y) => d.value ? (s(), o("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(t.value ? [t.value] : []),
      placeholder: "Choose an upload",
      onChange: h
    }, null, 40, qn)) : c.value ? (s(), o("p", Un, u(c.value), 1)) : (s(), o("span", Fn, "Loading uploads…"));
  }
}), Mn = { class: "test" }, Nn = { class: "run-bar" }, Bn = { class: "run-input" }, Tn = { class: "muted run-note" }, _n = {
  key: 0,
  class: "empty"
}, Rn = {
  key: 1,
  class: "run-failed",
  role: "alert"
}, On = {
  key: 2,
  class: "test-grid"
}, Ln = { class: "block" }, Dn = { class: "block-head" }, An = { class: "muted push" }, Pn = { class: "value-list" }, jn = ["aria-expanded", "onClick"], zn = { class: "value-name" }, In = ["title"], Hn = { class: "bar" }, Wn = ["title"], Qn = { class: "evidence" }, Kn = {
  key: 0,
  class: "full-value"
}, Jn = {
  key: 1,
  class: "muted"
}, Yn = {
  key: 2,
  class: "muted"
}, Gn = { class: "block" }, Xn = { class: "timeline" }, Zn = { class: "tl-icon" }, es = { class: "tl-main" }, ts = { class: "tl-head" }, ls = { class: "muted push" }, as = { class: "tl-bar" }, ns = { class: "muted" }, ss = {
  key: 0,
  class: "tl-msg"
}, os = {
  key: 1,
  class: "chips"
}, is = /* @__PURE__ */ W({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {},
    running: { type: Boolean },
    canRun: { type: Boolean }
  },
  emits: ["run"],
  setup(t, { emit: i }) {
    const a = t, d = i, c = _(""), h = _(), p = (U) => `${Math.round(U * 100)}%`, y = (U) => U == null ? "—" : typeof U == "string" ? U : Array.isArray(U) && U.every((B) => typeof B != "object") ? U.join(", ") : typeof U == "object" ? JSON.stringify(U) : String(U), q = (U) => `${(U / 1e3).toFixed(1)}s`, $ = T(() => Math.max(1, ...a.result?.trace.map((U) => U.duration_ms) ?? [1])), l = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, n = (U) => l[U]?.label ?? ue[U] ?? U, V = (U) => l[U]?.icon ?? Oe[U] ?? "tabler:point", O = (U) => U >= 0.9 ? "high" : U >= 0.7 ? "mid" : "low";
    return (U, B) => (s(), o("div", Mn, [
      e("section", Nn, [
        e("div", Bn, [
          b(tt, {
            value: c.value,
            onSelect: B[0] || (B[0] = (S) => c.value = S)
          }, null, 8, ["value"])
        ]),
        b(g(le), {
          label: t.running ? "Extracting…" : "Run extraction",
          loading: t.running,
          disabled: !c.value || t.running || !t.canRun,
          onClick: B[1] || (B[1] = (S) => d("run", c.value))
        }, null, 8, ["label", "loading", "disabled"]),
        e("p", Tn, u(t.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + u(t.retention) + ".", 1)
      ]),
      t.result ? f("", !0) : (s(), o("p", _n, "No extraction results yet.")),
      t.result?.status === "failed" ? (s(), o("p", Rn, [
        b(g(R), { icon: "tabler:alert-triangle" }),
        x("The run stopped: " + u(t.result.error), 1)
      ])) : f("", !0),
      t.result ? (s(), o("div", On, [
        e("section", Ln, [
          e("header", Dn, [
            B[2] || (B[2] = e("h2", { class: "block-title" }, "Values", -1)),
            e("span", An, [
              x(u(t.result.tokens.toLocaleString()) + " tokens · " + u(q(t.result.duration_ms)), 1),
              t.result.pages ? (s(), o(E, { key: 0 }, [
                x(" · " + u(t.result.pages) + " pages", 1)
              ], 64)) : f("", !0)
            ])
          ]),
          e("ul", Pn, [
            (s(!0), o(E, null, L(t.result.fields, (S) => (s(), o("li", {
              key: S.name,
              class: "value-row"
            }, [
              e("button", {
                type: "button",
                class: "value-main",
                "aria-expanded": h.value === S.name,
                onClick: (D) => h.value = h.value === S.name ? void 0 : S.name
              }, [
                e("span", zn, u(S.name), 1),
                e("span", {
                  class: P(["value-text", { missing: S.missing }]),
                  title: S.missing ? void 0 : y(S.value)
                }, u(S.missing ? "Not in the document" : y(S.value)), 11, In),
                e("span", {
                  class: P(["confidence", O(S.confidence)])
                }, [
                  e("span", Hn, [
                    e("span", {
                      style: fe({ width: p(S.confidence) })
                    }, null, 4)
                  ]),
                  x(u(p(S.confidence)), 1),
                  B[3] || (B[3] = e("span", { class: "conf-word" }, " confidence", -1))
                ], 2),
                e("span", {
                  class: P(["chip", S.verified ? "primary" : "warn"]),
                  title: S.reason
                }, [
                  b(g(R), {
                    icon: S.verified ? "tabler:shield-check" : "tabler:shield-question"
                  }, null, 8, ["icon"]),
                  x(u(S.verified ? "Verified" : "Check"), 1)
                ], 10, Wn),
                b(g(R), {
                  icon: h.value === S.name ? "tabler:chevron-up" : "tabler:chevron-down",
                  class: "value-caret"
                }, null, 8, ["icon"])
              ], 8, jn),
              j(e("div", Qn, [
                S.missing ? f("", !0) : (s(), o("p", Kn, u(y(S.value)), 1)),
                (s(!0), o(E, null, L(S.evidence, (D, z) => (s(), o("blockquote", {
                  key: z,
                  class: P({ unfound: D.found === !1 })
                }, [
                  e("p", null, "“" + u(D.quote) + "”", 1),
                  e("cite", null, [
                    x(u(D.section), 1),
                    D.page !== void 0 && D.page !== null ? (s(), o(E, { key: 0 }, [
                      x(" · Page " + u(D.page), 1)
                    ], 64)) : f("", !0),
                    D.found === !1 ? (s(), o(E, { key: 1 }, [
                      x(" · not found word for word in the document")
                    ], 64)) : f("", !0)
                  ])
                ], 2))), 128)),
                S.evidence.length ? f("", !0) : (s(), o("p", Jn, "No evidence.")),
                S.reason ? (s(), o("p", Yn, u(S.reason), 1)) : f("", !0)
              ], 512), [
                [_e, h.value === S.name]
              ])
            ]))), 128))
          ])
        ]),
        e("section", Gn, [
          B[4] || (B[4] = e("header", { class: "block-head" }, [
            e("h2", { class: "block-title" }, "Steps")
          ], -1)),
          e("ol", Xn, [
            (s(!0), o(E, null, L(t.result.trace, (S, D) => (s(), o("li", {
              key: D,
              class: P(S.status)
            }, [
              e("span", Zn, [
                b(g(R), {
                  icon: V(S.kind)
                }, null, 8, ["icon"])
              ]),
              e("div", es, [
                e("div", ts, [
                  e("strong", null, u(n(S.kind)), 1),
                  e("span", ls, u(q(S.duration_ms)), 1)
                ]),
                e("span", as, [
                  e("span", {
                    style: fe({ width: `${Math.max(4, S.duration_ms / $.value * 100)}%` })
                  }, null, 4)
                ]),
                e("p", ns, [
                  x(u(S.scope), 1),
                  S.model ? (s(), o(E, { key: 0 }, [
                    x(" · " + u(S.model), 1)
                  ], 64)) : f("", !0),
                  x(" · " + u((S.input_tokens + S.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                S.message ? (s(), o("p", ss, u(S.message), 1)) : f("", !0),
                S.queries?.length ? (s(), o("div", os, [
                  (s(!0), o(E, null, L(S.queries, (z) => (s(), o("span", {
                    key: z,
                    class: "chip"
                  }, u(z), 1))), 128))
                ])) : f("", !0)
              ])
            ], 2))), 128))
          ])
        ])
      ])) : f("", !0)
    ]));
  }
}), Se = (t) => t.status === "completed" || t.status === "failed", be = (t) => t.metrics.length ? t.metrics.reduce((i, a) => i + a.accuracy, 0) / t.metrics.length : 0;
function Ee(t, i = /* @__PURE__ */ new Date()) {
  const a = new Date(t);
  return a.toDateString() === i.toDateString() ? a.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" }) : a.getFullYear() === i.getFullYear() ? a.toLocaleString(void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : a.toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
}
const us = { class: "evals" }, ds = { class: "block eval-run" }, rs = { class: "eval-run-main" }, cs = { class: "block-title" }, vs = {
  key: 0,
  class: "eval-note"
}, ms = {
  key: 0,
  class: "eval-progress",
  role: "status"
}, bs = { class: "bar" }, ps = { class: "muted" }, fs = { class: "stat-row" }, ys = { class: "stat" }, gs = { class: "stat-label" }, hs = { class: "stat-value" }, ks = { class: "stat" }, $s = { class: "stat-value" }, xs = { class: "stat-delta flat" }, ws = { class: "stat" }, Vs = { class: "stat-value" }, Ss = {
  key: 0,
  class: "stat-delta flat"
}, Cs = { class: "stat" }, Es = { class: "stat-value" }, qs = {
  key: 0,
  class: "stat-delta flat"
}, Us = { class: "block" }, Fs = { class: "block-head" }, Ms = {
  key: 0,
  class: "compare-pick push"
}, Ns = ["value"], Bs = ["value"], Ts = {
  key: 0,
  class: "block-empty"
}, _s = {
  key: 1,
  class: "table-scroll"
}, Rs = { key: 0 }, Os = { key: 1 }, Ls = { class: "mono" }, Ds = { class: "acc strong" }, As = { class: "bar" }, Ps = { class: "muted" }, js = {
  key: 0,
  class: "muted"
}, zs = { key: 1 }, Is = {
  key: 1,
  class: "muted"
}, Hs = {
  key: 1,
  class: "block"
}, Ws = { class: "table-scroll" }, Qs = { class: "metric-table result-matrix" }, Ks = ["aria-expanded", "onClick"], Js = ["colspan"], Ys = {
  key: 0,
  class: "cell-state"
}, Gs = ["data-error-kind", "title"], Xs = ["data-label"], Zs = ["title"], eo = {
  key: 0,
  class: "result-detail"
}, to = ["colspan"], lo = ["data-error-kind", "title"], ao = {
  key: 1,
  class: "compare"
}, no = { class: "mono" }, so = { class: "cmp" }, oo = { class: "cmp" }, io = { class: "muted case-meta" }, uo = { class: "block" }, ro = { class: "block-head" }, co = { class: "count" }, vo = { class: "grid" }, mo = { class: "mono" }, bo = ["onUpdate:modelValue"], po = ["onUpdate:modelValue"], fo = ["onUpdate:modelValue", "placeholder"], yo = ["onUpdate:modelValue", "type"], go = {
  key: 0,
  class: "error",
  role: "alert"
}, ho = { class: "row" }, ko = {
  key: 1,
  class: "block-empty"
}, $o = {
  key: 2,
  class: "block-empty"
}, xo = {
  key: 3,
  class: "table-scroll"
}, wo = { class: "metric-table case-table" }, Vo = ["data-label"], So = { class: "num" }, Co = ["aria-label", "disabled", "onClick"], Eo = {
  key: 2,
  class: "block"
}, qo = { class: "block-head" }, Uo = { class: "count" }, Fo = { class: "eval-history" }, Mo = ["aria-current", "onClick"], No = ["data-status"], Bo = { class: "muted" }, To = { class: "push" }, _o = /* @__PURE__ */ W({
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
    const a = t, d = i, c = _(!1), h = _(""), p = _({}), y = _("");
    de(() => a.addedCaseId, () => {
      c.value = !1, h.value = "", p.value = {};
    });
    function q(C, v) {
      return C.type === "number" ? Number(v) : C.type === "boolean" ? v === "true" : C.type === "list" || C.type === "object" ? JSON.parse(v) : v;
    }
    function $() {
      y.value = "";
      const C = {};
      try {
        for (const v of a.fields) {
          const r = String(p.value[v.name] ?? "").trim();
          r && (C[v.name] = q(v, r));
        }
      } catch {
        y.value = 'Lists and objects need valid JSON, for example ["a","b"] or {"city":"Hamburg"}.';
        return;
      }
      d("add-case", { upload_id: h.value, expected: C });
    }
    const l = T(() => a.evaluations.find((C) => !Se(C))), n = T(() => a.evaluations.filter(Se)), V = T(() => a.evaluation), O = T(() => ({ done: (V.value?.results ?? []).filter((v) => v.status !== "queued").length, total: V.value?.case_count ?? 0 })), U = _();
    de(() => V.value?.id, () => {
      U.value = void 0;
    });
    const B = T(() => {
      if (!V.value) return;
      if (U.value) return n.value.find((v) => v.id === U.value);
      const C = n.value.findIndex((v) => v.id === V.value.id);
      return C >= 0 ? n.value[C + 1] : n.value[0];
    }), S = T(() => (V.value?.metrics ?? []).map((C) => ({ ...C, before: B.value?.metrics.find((v) => v.field === C.field) }))), D = T(() => (V.value?.fields ?? []).map((C) => C.name)), z = (C, v) => C.scores.find((r) => r.field === v), I = _(), H = (C) => `${Math.round(C * 100)}%`, A = (C) => {
      const v = Math.round(C * 100);
      return `${v > 0 ? "+" : v < 0 ? "−" : "±"}${Math.abs(v)} pts`;
    }, N = (C) => Math.round(C * 100) > 0 ? "up" : Math.round(C * 100) < 0 ? "down" : "flat", F = (C) => C >= 6e4 ? `${Math.floor(C / 6e4)}m ${Math.round(C % 6e4 / 1e3)}s` : `${(C / 1e3).toFixed(1)}s`, te = (C) => C == null || C === "" ? "—" : typeof C == "string" ? C : Array.isArray(C) && C.every((v) => typeof v != "object") ? C.join(", ") : JSON.stringify(C), ne = (C) => C ? C.score >= 0.999 ? "pass" : C.score > 0 ? "partial" : "fail" : "none", K = (C) => (C.results ?? []).filter((v) => v.status === "completed").length, G = { queued: "Queued", running: "Running", completed: "Completed", failed: "Failed" };
    return (C, v) => (s(), o("div", us, [
      e("section", ds, [
        e("div", rs, [
          e("div", null, [
            e("h2", cs, "Evaluate revision " + u(t.revision), 1),
            v[6] || (v[6] = e("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            t.changed ? (s(), o("p", vs, [
              b(g(R), { icon: "tabler:info-circle" }),
              v[5] || (v[5] = x("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : f("", !0)
          ]),
          b(g(le), {
            label: l.value ? "Evaluating…" : "Run all cases",
            loading: t.starting || !!l.value,
            disabled: !t.cases.length || !t.fields.length || !!l.value || t.starting,
            onClick: v[0] || (v[0] = (r) => d("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        V.value && !g(Se)(V.value) ? (s(), o("div", ms, [
          e("span", bs, [
            e("span", {
              style: fe({ width: H(O.value.total ? O.value.done / O.value.total : 0) })
            }, null, 4)
          ]),
          e("span", ps, u(G[V.value.status]) + " · " + u(O.value.done) + " of " + u(O.value.total) + " cases", 1)
        ])) : f("", !0)
      ]),
      V.value && g(Se)(V.value) ? (s(), o(E, { key: 0 }, [
        V.value.error ? (s(), o("p", {
          key: 0,
          class: P(V.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          b(g(R), { icon: "tabler:alert-triangle" }),
          x(u(V.value.error), 1)
        ], 2)) : f("", !0),
        e("div", fs, [
          e("div", ys, [
            e("span", gs, "Accuracy · revision " + u(V.value.config_revision), 1),
            e("span", hs, u(H(g(be)(V.value))), 1),
            B.value ? (s(), o("span", {
              key: 0,
              class: P(["stat-delta", N(g(be)(V.value) - g(be)(B.value))])
            }, u(A(g(be)(V.value) - g(be)(B.value))) + " vs revision " + u(B.value.config_revision), 3)) : f("", !0)
          ]),
          e("div", ks, [
            v[7] || (v[7] = e("span", { class: "stat-label" }, "Cases", -1)),
            e("span", $s, [
              x(u(K(V.value)), 1),
              e("small", null, " / " + u(V.value.case_count), 1)
            ]),
            e("span", xs, u(V.value.case_count - K(V.value)) + " failed", 1)
          ]),
          e("div", ws, [
            v[8] || (v[8] = e("span", { class: "stat-label" }, "Tokens", -1)),
            e("span", Vs, u(V.value.tokens.toLocaleString()), 1),
            B.value ? (s(), o("span", Ss, u(B.value.tokens.toLocaleString()) + " before", 1)) : f("", !0)
          ]),
          e("div", Cs, [
            v[9] || (v[9] = e("span", { class: "stat-label" }, "Model time", -1)),
            e("span", Es, u(F(V.value.duration_ms)), 1),
            B.value ? (s(), o("span", qs, u(F(B.value.duration_ms)) + " before", 1)) : f("", !0)
          ])
        ]),
        e("section", Us, [
          e("header", Fs, [
            v[11] || (v[11] = e("h2", { class: "block-title" }, "Field accuracy", -1)),
            n.value.length > 1 ? (s(), o("label", Ms, [
              v[10] || (v[10] = e("span", { class: "muted" }, "Compare with", -1)),
              e("select", {
                value: B.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: v[1] || (v[1] = (r) => U.value = r.target.value)
              }, [
                (s(!0), o(E, null, L(n.value.filter((r) => r.id !== V.value.id), (r) => (s(), o("option", {
                  key: r.id,
                  value: r.id
                }, "Revision " + u(r.config_revision) + " · " + u(g(Ee)(r.created_at)), 9, Bs))), 128))
              ], 40, Ns)
            ])) : f("", !0)
          ]),
          S.value.length ? (s(), o("div", _s, [
            e("table", {
              class: P(["metric-table accuracy-table", { comparing: !!B.value }])
            }, [
              e("thead", null, [
                e("tr", null, [
                  v[12] || (v[12] = e("th", null, "Field", -1)),
                  v[13] || (v[13] = e("th", null, "Accuracy", -1)),
                  v[14] || (v[14] = e("th", null, "Verified", -1)),
                  B.value ? (s(), o("th", Rs, "Revision " + u(B.value.config_revision), 1)) : f("", !0),
                  B.value ? (s(), o("th", Os, "Change")) : f("", !0)
                ])
              ]),
              e("tbody", null, [
                (s(!0), o(E, null, L(S.value, (r) => (s(), o("tr", {
                  key: r.field
                }, [
                  e("td", Ls, u(r.field), 1),
                  e("td", null, [
                    e("span", Ds, [
                      e("span", As, [
                        e("span", {
                          style: fe({ width: H(r.accuracy) })
                        }, null, 4)
                      ]),
                      x(u(H(r.accuracy)), 1)
                    ])
                  ]),
                  e("td", Ps, u(H(r.verified)), 1),
                  B.value ? (s(), o("td", js, u(r.before ? H(r.before.accuracy) : "—"), 1)) : f("", !0),
                  B.value ? (s(), o("td", zs, [
                    r.before ? (s(), o("span", {
                      key: 0,
                      class: P(["trend", N(r.accuracy - r.before.accuracy)])
                    }, [
                      b(g(R), {
                        icon: N(r.accuracy - r.before.accuracy) === "up" ? "tabler:trending-up" : N(r.accuracy - r.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      x(u(A(r.accuracy - r.before.accuracy)), 1)
                    ], 2)) : (s(), o("span", Is, "New field"))
                  ])) : f("", !0)
                ]))), 128))
              ])
            ], 2)
          ])) : (s(), o("p", Ts, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : f("", !0),
      V.value?.results?.length ? (s(), o("section", Hs, [
        v[19] || (v[19] = e("header", { class: "block-head" }, [
          e("h2", { class: "block-title" }, "Results by case"),
          e("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        e("div", Ws, [
          e("table", Qs, [
            e("thead", null, [
              e("tr", null, [
                v[15] || (v[15] = e("th", null, "Document", -1)),
                (s(!0), o(E, null, L(D.value, (r) => (s(), o("th", {
                  key: r,
                  class: "mono"
                }, u(r), 1))), 128))
              ])
            ]),
            e("tbody", null, [
              (s(!0), o(E, null, L(V.value.results, (r) => (s(), o(E, {
                key: r.case_id
              }, [
                e("tr", {
                  class: P(["result-row", { active: I.value === r.case_id }])
                }, [
                  e("td", null, [
                    e("button", {
                      type: "button",
                      class: "case-toggle",
                      "aria-expanded": I.value === r.case_id,
                      onClick: (w) => I.value = I.value === r.case_id ? void 0 : r.case_id
                    }, [
                      b(g(R), {
                        icon: I.value === r.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      x(u(r.upload_name), 1)
                    ], 8, Ks)
                  ]),
                  r.status !== "completed" ? (s(), o("td", {
                    key: 0,
                    colspan: D.value.length,
                    class: "muted"
                  }, [
                    r.status === "queued" ? (s(), o("span", Ys, [
                      b(g(R), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      v[16] || (v[16] = x("Waiting", -1))
                    ])) : (s(), o("span", {
                      key: 1,
                      class: "cell-state fail",
                      "data-error-kind": r.error?.kind,
                      title: r.error?.kind
                    }, [
                      b(g(R), { icon: "tabler:alert-triangle" }),
                      x(u(r.error?.message), 1)
                    ], 8, Gs))
                  ], 8, Js)) : (s(!0), o(E, { key: 1 }, L(D.value, (w) => (s(), o("td", {
                    key: w,
                    "data-label": w
                  }, [
                    e("span", {
                      class: P(["cell", ne(z(r, w))]),
                      title: te(z(r, w)?.value)
                    }, u(z(r, w) ? H(z(r, w).score) : "—"), 11, Zs)
                  ], 8, Xs))), 128))
                ], 2),
                I.value === r.case_id ? (s(), o("tr", eo, [
                  e("td", {
                    colspan: D.value.length + 1
                  }, [
                    r.error ? (s(), o("p", {
                      key: 0,
                      class: "muted",
                      "data-error-kind": r.error.kind,
                      title: r.error.kind
                    }, u(r.error.message), 9, lo)) : (s(), o("dl", ao, [
                      (s(!0), o(E, null, L(r.scores, (w) => (s(), o(E, {
                        key: w.field
                      }, [
                        e("dt", no, u(w.field), 1),
                        e("dd", null, [
                          e("span", {
                            class: P(["cell", ne(w)])
                          }, u(H(w.score)), 3),
                          e("span", so, [
                            v[17] || (v[17] = e("span", { class: "cmp-label" }, "Expected", -1)),
                            x(u(te(w.expected)), 1)
                          ]),
                          e("span", oo, [
                            v[18] || (v[18] = e("span", { class: "cmp-label" }, "Extracted", -1)),
                            x(u(te(w.value)), 1)
                          ]),
                          e("span", null, [
                            e("span", {
                              class: P(["chip", w.verified ? "primary" : "warn"])
                            }, [
                              b(g(R), {
                                icon: w.verified ? "tabler:shield-check" : "tabler:shield-question"
                              }, null, 8, ["icon"]),
                              x(u(w.verified ? "Verified" : "Unverified"), 1)
                            ], 2)
                          ])
                        ])
                      ], 64))), 128))
                    ])),
                    e("p", io, u(r.tokens.toLocaleString()) + " tokens · " + u(F(r.duration_ms)), 1)
                  ], 8, to)
                ])) : f("", !0)
              ], 64))), 128))
            ])
          ])
        ])
      ])) : f("", !0),
      e("section", uo, [
        e("header", ro, [
          v[20] || (v[20] = e("h2", { class: "block-title" }, "Cases", -1)),
          e("span", co, u(t.cases.length), 1),
          b(g(le), {
            label: "Add case",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: !t.fields.length,
            onClick: v[2] || (v[2] = (r) => c.value = !c.value)
          }, null, 8, ["disabled"])
        ]),
        c.value ? (s(), o("form", {
          key: 0,
          class: "case-form",
          onSubmit: qe($, ["prevent"])
        }, [
          e("label", null, [
            v[21] || (v[21] = x("Document", -1)),
            b(tt, {
              value: h.value,
              onSelect: v[3] || (v[3] = (r) => {
                h.value = r;
              })
            }, null, 8, ["value"])
          ]),
          v[24] || (v[24] = e("p", { class: "muted" }, "Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.", -1)),
          e("div", vo, [
            (s(!0), o(E, null, L(t.fields, (r) => (s(), o("label", {
              key: r.name
            }, [
              e("span", mo, u(r.name), 1),
              r.type === "boolean" ? j((s(), o("select", {
                key: 0,
                "onUpdate:modelValue": (w) => p.value[r.name] = w
              }, [...v[22] || (v[22] = [
                e("option", { value: "" }, "Not stated", -1),
                e("option", { value: "true" }, "Yes", -1),
                e("option", { value: "false" }, "No", -1)
              ])], 8, bo)), [
                [he, p.value[r.name]]
              ]) : r.type === "enum" ? j((s(), o("select", {
                key: 1,
                "onUpdate:modelValue": (w) => p.value[r.name] = w
              }, [
                v[23] || (v[23] = e("option", { value: "" }, "Not stated", -1)),
                (s(!0), o(E, null, L(r.enum_values, (w) => (s(), o("option", { key: w }, u(w), 1))), 128))
              ], 8, po)), [
                [he, p.value[r.name]]
              ]) : r.type === "object" || r.type === "list" ? j((s(), o("textarea", {
                key: 2,
                "onUpdate:modelValue": (w) => p.value[r.name] = w,
                rows: "2",
                placeholder: r.type === "list" ? '["first", "second"]' : '{"key": "value"}'
              }, null, 8, fo)), [
                [X, p.value[r.name]]
              ]) : j((s(), o("input", {
                key: 3,
                "onUpdate:modelValue": (w) => p.value[r.name] = w,
                type: r.type === "number" ? "number" : r.type === "date" ? "date" : "text",
                placeholder: "Not stated"
              }, null, 8, yo)), [
                [dt, p.value[r.name]]
              ])
            ]))), 128))
          ]),
          y.value ? (s(), o("p", go, u(y.value), 1)) : f("", !0),
          e("div", ho, [
            b(g(le), {
              label: "Save case",
              size: "small",
              type: "submit",
              disabled: !h.value,
              loading: t.saving
            }, null, 8, ["disabled", "loading"]),
            b(g(le), {
              label: "Cancel",
              size: "small",
              severity: "secondary",
              text: "",
              onClick: v[4] || (v[4] = (r) => c.value = !1)
            })
          ])
        ], 32)) : f("", !0),
        t.fields.length ? !t.cases.length && !c.value ? (s(), o("p", $o, "No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.")) : t.cases.length ? (s(), o("div", xo, [
          e("table", wo, [
            e("thead", null, [
              e("tr", null, [
                v[25] || (v[25] = e("th", null, "Document", -1)),
                (s(!0), o(E, null, L(t.fields, (r) => (s(), o("th", {
                  key: r.name,
                  class: "mono"
                }, u(r.name), 1))), 128)),
                v[26] || (v[26] = e("th", null, null, -1))
              ])
            ]),
            e("tbody", null, [
              (s(!0), o(E, null, L(t.cases, (r) => (s(), o("tr", {
                key: r.id
              }, [
                e("td", null, [
                  b(g(R), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  x(" " + u(r.upload_name), 1)
                ]),
                (s(!0), o(E, null, L(t.fields, (w) => (s(), o("td", {
                  key: w.name,
                  "data-label": w.name,
                  class: P({ muted: !(w.name in r.expected) })
                }, u(w.name in r.expected ? te(r.expected[w.name]) : "Not stated"), 11, Vo))), 128)),
                e("td", So, [
                  e("button", {
                    type: "button",
                    class: "kx-iconbtn kx-focus-outline",
                    "aria-label": `Remove case ${r.upload_name}`,
                    disabled: t.saving,
                    onClick: (w) => d("delete-case", r.id)
                  }, [
                    b(g(R), { icon: "tabler:trash" })
                  ], 8, Co)
                ])
              ]))), 128))
            ])
          ])
        ])) : f("", !0) : (s(), o("p", ko, "Add a field in the Builder, then add documents with the values you expect."))
      ]),
      t.evaluations.length ? (s(), o("section", Eo, [
        e("header", qo, [
          v[27] || (v[27] = e("h2", { class: "block-title" }, "History", -1)),
          e("span", Uo, u(t.evaluations.length), 1)
        ]),
        e("ul", Fo, [
          (s(!0), o(E, null, L(t.evaluations, (r) => (s(), o("li", {
            key: r.id
          }, [
            e("button", {
              type: "button",
              class: P({ active: V.value?.id === r.id }),
              "aria-current": V.value?.id === r.id,
              onClick: (w) => d("open", r.id)
            }, [
              e("span", {
                class: "badge",
                "data-status": r.status
              }, u(G[r.status]), 9, No),
              e("span", null, "Revision " + u(r.config_revision), 1),
              e("span", Bo, u(g(Ee)(r.created_at)), 1),
              e("strong", To, u(r.status === "completed" ? H(g(be)(r)) : "—"), 1)
            ], 10, Mo)
          ]))), 128))
        ])
      ])) : f("", !0)
    ]));
  }
}), Ro = { class: "section-head" }, Oo = { class: "muted" }, Lo = {
  key: 0,
  class: "empty"
}, Do = {
  key: 1,
  class: "table-scroll"
}, Ao = { class: "metric-table runs-table" }, Po = { class: "caller" }, jo = ["data-status"], zo = {
  class: "num",
  "data-label": "Time"
}, Io = {
  class: "num",
  "data-label": "Tokens"
}, Ho = {
  class: "muted",
  "data-label": "Expires"
}, Wo = /* @__PURE__ */ W({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(t) {
    const i = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (a, d) => (s(), o(E, null, [
      e("div", Ro, [
        d[0] || (d[0] = e("h2", null, "Recent runs", -1)),
        e("span", Oo, "Runs expire after " + u(t.retention), 1)
      ]),
      t.runs.length ? (s(), o("div", Do, [
        e("table", Ao, [
          d[1] || (d[1] = e("thead", null, [
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
            (s(!0), o(E, null, L(t.runs, (c) => (s(), o("tr", {
              key: c.id
            }, [
              e("td", null, u(g(Ee)(c.created_at)), 1),
              e("td", null, [
                e("span", Po, [
                  b(g(R), {
                    icon: i[c.caller].icon
                  }, null, 8, ["icon"]),
                  x(u(i[c.caller].label), 1)
                ])
              ]),
              e("td", null, [
                e("span", {
                  class: "badge",
                  "data-status": c.status
                }, u(c.status === "completed" ? "Completed" : "Failed"), 9, jo)
              ]),
              e("td", zo, u((c.duration_ms / 1e3).toFixed(1)) + "s", 1),
              e("td", Io, u(Number(c.tokens).toLocaleString()), 1),
              e("td", Ho, u(g(Ee)(c.expires_at)), 1)
            ]))), 128))
          ])
        ])
      ])) : (s(), o("p", Lo, "No runs yet. Runs from the Test tab, agents, evaluations and Workflows appear here."))
    ], 64));
  }
}), Qo = {
  key: 0,
  role: "alert",
  class: "error banner"
}, Ko = /* @__PURE__ */ W({
  __name: "SharePopup",
  props: {
    id: {},
    title: {}
  },
  emits: ["close"],
  setup(t, { emit: i }) {
    const a = t, d = i, c = _(), h = _("");
    return Fe(async () => {
      try {
        await Le("kickside-share", { timeoutMs: 8e3 });
      } catch (q) {
        h.value = `Sharing is unavailable: ${q instanceof Error ? q.message : String(q)}`;
        return;
      }
      const p = document.createElement("kickside-share"), y = encodeURIComponent(a.id);
      p.setAttribute("config", JSON.stringify({ resource_id: a.id, title: a.title, access_url: `/api/v1/component-access/grants/${y}`, share_url: `/api/v1/component-access/share/${y}` })), p.style.display = "block", p.addEventListener("close", () => d("close")), c.value?.appendChild(p);
    }), (p, y) => (s(), o("div", {
      ref_key: "host",
      ref: c
    }, [
      h.value ? (s(), o("p", Qo, u(h.value), 1)) : f("", !0)
    ], 512));
  }
}), Jo = { class: "docscout" }, Yo = { class: "toolbar" }, Go = { class: "toolbar-lead" }, Xo = { class: "crumb-row" }, Zo = { class: "crumb" }, ei = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, ti = ["id", "aria-selected", "aria-controls", "onClick"], li = { class: "toolbar-side" }, ai = { class: "stats" }, ni = ["title"], si = {
  key: 2,
  class: "unsaved"
}, oi = {
  key: 0,
  class: "banner row wrap",
  role: "status"
}, ii = {
  key: 1,
  role: "alert",
  class: "error banner"
}, ui = {
  key: 3,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, di = ["id", "aria-labelledby"], ri = /* @__PURE__ */ W({
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
    const a = t, d = i, c = _(), h = _(!1), p = _("Builder"), y = _(Qe()), q = _(""), $ = _(""), l = T(() => a.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    de(p, () => {
      c.value && (c.value.scrollTop = 0);
    }, { flush: "post" });
    const n = _(), V = _(), O = T(() => a.snapshot.can_edit && n.value !== a.snapshot.expected_revision), U = T(() => O.value && V.value !== a.snapshot.expected_revision);
    function B(A) {
      return q.value === A.title && $.value === (A.description ?? "") && St(y.value, A.config);
    }
    function S() {
      const A = a.snapshot;
      y.value = structuredClone(ze(A.config ?? Qe())), q.value = A.title, $.value = A.description ?? "", n.value = A.expected_revision, V.value = void 0;
    }
    de(() => a.snapshot, (A, N) => {
      l.value.includes(p.value) || (p.value = l.value[0]), !(N && A.id === N.id && A.can_edit && N.can_edit && !B(N) && !B(A)) && S();
    }, { immediate: !0 });
    const D = T(() => a.snapshot.can_edit && !B(a.snapshot)), z = T(() => Vt(y.value)), I = T(() => Object.keys(ue).filter((A) => Ce(y.value, A)).length);
    function H() {
      d("save", { title: q.value, description: $.value, config: structuredClone(ze(y.value)), expected_revision: n.value });
    }
    return (A, N) => (s(), o("main", Jo, [
      e("div", Yo, [
        e("div", Go, [
          e("span", Xo, [
            t.back ? (s(), o("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: N[0] || (N[0] = (F) => d("back"))
            }, [
              b(g(R), { icon: "tabler:arrow-left" })
            ])) : f("", !0),
            e("span", Zo, u(t.snapshot.title), 1)
          ]),
          e("nav", ei, [
            (s(!0), o(E, null, L(l.value, (F) => (s(), o("button", {
              id: `tab-${F}`,
              key: F,
              role: "tab",
              "aria-selected": p.value === F,
              "aria-controls": `panel-${F}`,
              onClick: (te) => p.value = F
            }, u(F), 9, ti))), 128))
          ])
        ]),
        e("div", li, [
          t.snapshot.can_share ? (s(), ee(g(le), {
            key: 0,
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-label": "Share",
            onClick: N[1] || (N[1] = (F) => h.value = !0)
          }, {
            default: rt(() => [
              b(g(R), { icon: "tabler:share" }),
              N[11] || (N[11] = e("span", { class: "btn-label" }, "Share", -1))
            ]),
            _: 1
          })) : f("", !0),
          e("span", ai, [
            x(u(t.snapshot.field_count) + " " + u(t.snapshot.field_count === 1 ? "field" : "fields"), 1),
            t.snapshot.can_edit ? (s(), o(E, { key: 0 }, [
              x(" · " + u(I.value) + " steps · revision " + u(t.snapshot.expected_revision), 1)
            ], 64)) : (s(), o(E, { key: 1 }, [
              x(" · Read access")
            ], 64))
          ]),
          t.snapshot.can_edit ? (s(), o(E, { key: 1 }, [
            O.value && !U.value ? (s(), ee(g(le), {
              key: 0,
              label: "Reload saved",
              severity: "secondary",
              size: "small",
              onClick: S
            })) : f("", !0),
            z.value ? (s(), o("span", {
              key: 1,
              class: "invalid",
              role: "alert",
              title: z.value
            }, [
              b(g(R), { icon: "tabler:alert-circle" }),
              x(u(z.value), 1)
            ], 8, ni)) : D.value ? (s(), o("span", si, "Unsaved")) : f("", !0),
            b(g(le), {
              label: "Save",
              size: "small",
              loading: t.saving,
              disabled: !D.value || !!z.value || !q.value.trim(),
              onClick: H
            }, null, 8, ["loading", "disabled"])
          ], 64)) : f("", !0)
        ])
      ]),
      U.value ? (s(), o("div", oi, [
        e("span", null, "Saved configuration changed to revision " + u(t.snapshot.expected_revision) + ". Your edits are kept.", 1),
        b(g(le), {
          label: "Reload saved",
          severity: "secondary",
          size: "small",
          onClick: S
        }),
        b(g(le), {
          label: "Keep editing",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: N[2] || (N[2] = (F) => V.value = t.snapshot.expected_revision)
        })
      ])) : f("", !0),
      t.error ? (s(), o("p", ii, u(t.error), 1)) : f("", !0),
      h.value ? (s(), ee(Ko, {
        key: 2,
        id: t.snapshot.id,
        title: t.snapshot.title,
        onClose: N[3] || (N[3] = (F) => h.value = !1)
      }, null, 8, ["id", "title"])) : f("", !0),
      p.value === "Builder" && t.snapshot.can_edit ? (s(), o("div", ui, [
        b(En, {
          title: q.value,
          "onUpdate:title": N[4] || (N[4] = (F) => q.value = F),
          description: $.value,
          "onUpdate:description": N[5] || (N[5] = (F) => $.value = F),
          config: y.value,
          retention: t.snapshot.retention,
          result: t.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (s(), o("div", {
        key: 4,
        ref_key: "body",
        ref: c,
        class: "page-body"
      }, [
        e("div", {
          id: `panel-${p.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${p.value}`,
          class: "panel"
        }, [
          p.value === "Test" ? (s(), ee(is, {
            key: 0,
            result: t.result,
            retention: t.snapshot.retention,
            running: t.running,
            "can-run": t.snapshot.field_count > 0,
            onRun: N[6] || (N[6] = (F) => d("run", F))
          }, null, 8, ["result", "retention", "running", "can-run"])) : f("", !0),
          p.value === "Evals" && t.snapshot.can_edit ? (s(), ee(_o, {
            key: 1,
            cases: t.snapshot.cases,
            "added-case-id": t.addedCaseId,
            fields: t.snapshot.config.fields,
            evaluations: t.evaluations,
            evaluation: t.evaluation,
            revision: t.snapshot.expected_revision,
            changed: D.value,
            saving: t.saving,
            starting: t.starting,
            onAddCase: N[7] || (N[7] = (F) => d("add-case", F)),
            onDeleteCase: N[8] || (N[8] = (F) => d("delete-case", F)),
            onEvaluate: N[9] || (N[9] = (F) => d("evaluate")),
            onOpen: N[10] || (N[10] = (F) => d("open-evaluation", F))
          }, null, 8, ["cases", "added-case-id", "fields", "evaluations", "evaluation", "revision", "changed", "saving", "starting"])) : f("", !0),
          p.value === "Runs" ? (s(), ee(Wo, {
            key: 2,
            runs: t.snapshot.runs,
            retention: t.snapshot.retention
          }, null, 8, ["runs", "retention"])) : f("", !0)
        ], 8, di)
      ], 512))
    ]));
  }
}), ci = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, vi = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, yi = /* @__PURE__ */ W({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(t, { emit: i }) {
    const a = t, d = i, c = _(), h = _(""), p = _(!1), y = _(!1), q = _(!1), $ = _(), l = _(null), n = _([]), V = _();
    let O = [], U = 0, B = 0, S = 0, D;
    const z = (v) => v instanceof Error ? v.message : String(v), I = (v) => v === U;
    async function H(v, r) {
      const w = ++S;
      r && (D = r);
      const Z = () => I(v) && w === S;
      try {
        const oe = a.id, xe = await se.evaluations(oe);
        if (!Z()) return;
        n.value = xe;
        const re = D ?? xe[0]?.id;
        if (re) {
          const ye = await se.evaluation(oe, re);
          if (!Z() || ye.id !== (D ?? re)) return;
          V.value = ye;
        }
      } catch (oe) {
        Z() && (h.value = z(oe));
      }
    }
    async function A(v) {
      const r = ++B, w = () => I(v) && r === B;
      if (!a.id) {
        h.value = "No extractor selected.";
        return;
      }
      try {
        const Z = await se.get(a.id);
        if (!w()) return;
        c.value = Z, h.value = "", Z.can_edit && await H(v);
      } catch (Z) {
        w() && (h.value = z(Z));
      }
    }
    de(() => a.id, (v, r) => {
      U++, D = void 0, O.forEach((Z) => Z()), O = [], $.value = void 0, c.value = void 0, l.value = null, n.value = [], V.value = void 0, h.value = "";
      const w = U;
      a.id && (O = [Ke(`component.${a.id}`, () => A(w)), Ke(`docscout.runs.${a.id}`, () => A(w))]), r !== void 0 && A(w);
    }, { immediate: !0 }), Ct(() => A(U)), Ge(() => {
      U++, O.forEach((v) => v());
    });
    async function N(v) {
      const r = U;
      p.value = !0, h.value = "";
      try {
        const w = await v();
        if (I(r))
          return await A(r), w;
      } catch (w) {
        I(r) && (h.value = z(w));
      } finally {
        p.value = !1;
      }
    }
    const F = (v) => N(() => se.update(a.id, v));
    async function te(v) {
      const r = U, w = await N(() => se.addCase(a.id, v));
      w && I(r) && ($.value = w.id);
    }
    const ne = (v) => N(() => se.deleteCase(a.id, v));
    async function K(v) {
      const r = U;
      y.value = !0, h.value = "";
      try {
        const w = await se.run(a.id, v);
        I(r) && (l.value = w, await A(r));
      } catch (w) {
        I(r) && (h.value = z(w));
      } finally {
        y.value = !1;
      }
    }
    async function G() {
      const v = U;
      q.value = !0, h.value = "";
      try {
        const { eval_id: r } = await se.evaluate(a.id);
        I(v) && await H(v, r);
      } catch (r) {
        I(v) && (h.value = z(r));
      } finally {
        q.value = !1;
      }
    }
    function C(v) {
      H(U, v);
    }
    return (v, r) => c.value ? (s(), ee(ri, {
      key: 0,
      snapshot: c.value,
      "added-case-id": $.value,
      saving: p.value,
      running: y.value,
      starting: q.value,
      result: l.value,
      evaluations: n.value,
      evaluation: V.value,
      error: h.value,
      back: t.back,
      onBack: r[0] || (r[0] = (w) => d("back")),
      onRun: K,
      onSave: F,
      onAddCase: te,
      onDeleteCase: ne,
      onEvaluate: G,
      onOpenEvaluation: C
    }, null, 8, ["snapshot", "added-case-id", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : h.value ? (s(), o("p", ci, u(h.value), 1)) : (s(), o("p", vi, "Loading Docscout…"));
  }
});
export {
  yi as _,
  Ee as w
};
