import { mergeProps as x, openBlock as p, createElementBlock as f, defineComponent as T, ref as g, withModifiers as _, createElementVNode as o, createTextVNode as w, createVNode as y, unref as u, toDisplayString as h, createCommentVNode as V } from "vue";
import { b as O, e as z, B as S, f as P, n as R, g as k, i as H, m as D, s as U } from "./index-CtvPaddD.js";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
var A = {
  name: "BaseEditableHolder",
  extends: O,
  emits: ["update:modelValue", "value-change"],
  props: {
    modelValue: {
      type: null,
      default: void 0
    },
    defaultValue: {
      type: null,
      default: void 0
    },
    name: {
      type: String,
      default: void 0
    },
    invalid: {
      type: Boolean,
      default: void 0
    },
    disabled: {
      type: Boolean,
      default: !1
    },
    formControl: {
      type: Object,
      default: void 0
    }
  },
  inject: {
    $parentInstance: {
      default: void 0
    },
    $pcForm: {
      default: void 0
    },
    $pcFormField: {
      default: void 0
    }
  },
  data: function() {
    return {
      d_value: this.defaultValue !== void 0 ? this.defaultValue : this.modelValue
    };
  },
  watch: {
    modelValue: {
      deep: !0,
      handler: function(t) {
        this.d_value = t;
      }
    },
    defaultValue: function(t) {
      this.d_value = t;
    },
    $formName: {
      immediate: !0,
      handler: function(t) {
        var n, i;
        this.formField = ((n = this.$pcForm) === null || n === void 0 || (i = n.register) === null || i === void 0 ? void 0 : i.call(n, t, this.$formControl)) || {};
      }
    },
    $formControl: {
      immediate: !0,
      handler: function(t) {
        var n, i;
        this.formField = ((n = this.$pcForm) === null || n === void 0 || (i = n.register) === null || i === void 0 ? void 0 : i.call(n, this.$formName, t)) || {};
      }
    },
    $formDefaultValue: {
      immediate: !0,
      handler: function(t) {
        this.d_value !== t && (this.d_value = t);
      }
    },
    $formValue: {
      immediate: !1,
      handler: function(t) {
        var n;
        (n = this.$pcForm) !== null && n !== void 0 && n.getFieldState(this.$formName) && t !== this.d_value && (this.d_value = t);
      }
    }
  },
  formField: {},
  methods: {
    writeValue: function(t, n) {
      var i, l;
      this.controlled && (this.d_value = t, this.$emit("update:modelValue", t)), this.$emit("value-change", t), (i = (l = this.formField).onChange) === null || i === void 0 || i.call(l, {
        originalEvent: n,
        value: t
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var t = arguments.length, n = new Array(t), i = 0; i < t; i++)
        n[i] = arguments[i];
      return n.find(z);
    }
  },
  computed: {
    $filled: function() {
      return z(this.d_value);
    },
    $invalid: function() {
      var t, n;
      return !this.$formNovalidate && this.findNonEmpty(this.invalid, (t = this.$pcFormField) === null || t === void 0 || (t = t.$field) === null || t === void 0 ? void 0 : t.invalid, (n = this.$pcForm) === null || n === void 0 || (n = n.getFieldState(this.$formName)) === null || n === void 0 ? void 0 : n.invalid);
    },
    $formName: function() {
      var t;
      return this.$formNovalidate ? void 0 : this.name || ((t = this.$formControl) === null || t === void 0 ? void 0 : t.name);
    },
    $formControl: function() {
      var t;
      return this.formControl || ((t = this.$pcFormField) === null || t === void 0 ? void 0 : t.formControl);
    },
    $formNovalidate: function() {
      var t;
      return (t = this.$formControl) === null || t === void 0 ? void 0 : t.novalidate;
    },
    $formDefaultValue: function() {
      var t, n;
      return this.findNonEmpty(this.d_value, (t = this.$pcFormField) === null || t === void 0 ? void 0 : t.initialValue, (n = this.$pcForm) === null || n === void 0 || (n = n.initialValues) === null || n === void 0 ? void 0 : n[this.$formName]);
    },
    $formValue: function() {
      var t, n;
      return this.findNonEmpty((t = this.$pcFormField) === null || t === void 0 || (t = t.$field) === null || t === void 0 ? void 0 : t.value, (n = this.$pcForm) === null || n === void 0 || (n = n.getFieldState(this.$formName)) === null || n === void 0 ? void 0 : n.value);
    },
    controlled: function() {
      return this.$inProps.hasOwnProperty("modelValue") || !this.$inProps.hasOwnProperty("modelValue") && !this.$inProps.hasOwnProperty("defaultValue");
    },
    // @deprecated use $filled instead
    filled: function() {
      return this.$filled;
    }
  }
}, N = {
  name: "BaseInput",
  extends: A,
  props: {
    size: {
      type: String,
      default: null
    },
    fluid: {
      type: Boolean,
      default: null
    },
    variant: {
      type: String,
      default: null
    }
  },
  inject: {
    $parentInstance: {
      default: void 0
    },
    $pcFluid: {
      default: void 0
    }
  },
  computed: {
    $variant: function() {
      var t;
      return (t = this.variant) !== null && t !== void 0 ? t : this.$primevue.config.inputStyle || this.$primevue.config.inputVariant;
    },
    $fluid: function() {
      var t;
      return (t = this.fluid) !== null && t !== void 0 ? t : !!this.$pcFluid;
    },
    // @deprecated use $fluid instead
    hasFluid: function() {
      return this.$fluid;
    }
  }
}, q = `
    .p-inputtext {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('inputtext.color');
        background: dt('inputtext.background');
        padding-block: dt('inputtext.padding.y');
        padding-inline: dt('inputtext.padding.x');
        border: 1px solid dt('inputtext.border.color');
        transition:
            background dt('inputtext.transition.duration'),
            color dt('inputtext.transition.duration'),
            border-color dt('inputtext.transition.duration'),
            outline-color dt('inputtext.transition.duration'),
            box-shadow dt('inputtext.transition.duration');
        appearance: none;
        border-radius: dt('inputtext.border.radius');
        outline-color: transparent;
        box-shadow: dt('inputtext.shadow');
    }

    .p-inputtext:enabled:hover {
        border-color: dt('inputtext.hover.border.color');
    }

    .p-inputtext:enabled:focus {
        border-color: dt('inputtext.focus.border.color');
        box-shadow: dt('inputtext.focus.ring.shadow');
        outline: dt('inputtext.focus.ring.width') dt('inputtext.focus.ring.style') dt('inputtext.focus.ring.color');
        outline-offset: dt('inputtext.focus.ring.offset');
    }

    .p-inputtext.p-invalid {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.p-variant-filled {
        background: dt('inputtext.filled.background');
    }

    .p-inputtext.p-variant-filled:enabled:hover {
        background: dt('inputtext.filled.hover.background');
    }

    .p-inputtext.p-variant-filled:enabled:focus {
        background: dt('inputtext.filled.focus.background');
    }

    .p-inputtext:disabled {
        opacity: 1;
        background: dt('inputtext.disabled.background');
        color: dt('inputtext.disabled.color');
    }

    .p-inputtext::placeholder {
        color: dt('inputtext.placeholder.color');
    }

    .p-inputtext.p-invalid::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }

    .p-inputtext-sm {
        font-size: dt('inputtext.sm.font.size');
        padding-block: dt('inputtext.sm.padding.y');
        padding-inline: dt('inputtext.sm.padding.x');
    }

    .p-inputtext-lg {
        font-size: dt('inputtext.lg.font.size');
        padding-block: dt('inputtext.lg.padding.y');
        padding-inline: dt('inputtext.lg.padding.x');
    }

    .p-inputtext-fluid {
        width: 100%;
    }
`, K = {
  root: function(t) {
    var n = t.instance, i = t.props;
    return ["p-inputtext p-component", {
      "p-filled": n.$filled,
      "p-inputtext-sm p-inputfield-sm": i.size === "small",
      "p-inputtext-lg p-inputfield-lg": i.size === "large",
      "p-invalid": n.$invalid,
      "p-variant-filled": n.$variant === "filled",
      "p-inputtext-fluid": n.$fluid
    }];
  }
}, L = S.extend({
  name: "inputtext",
  style: q,
  classes: K
}), M = {
  name: "BaseInputText",
  extends: N,
  style: L,
  provide: function() {
    return {
      $pcInputText: this,
      $parentInstance: this
    };
  }
};
function c(e) {
  "@babel/helpers - typeof";
  return c = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, c(e);
}
function G(e, t, n) {
  return (t = J(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function J(e) {
  var t = Q(e, "string");
  return c(t) == "symbol" ? t : t + "";
}
function Q(e, t) {
  if (c(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (c(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var I = {
  name: "InputText",
  extends: M,
  inheritAttrs: !1,
  methods: {
    onInput: function(t) {
      this.writeValue(t.target.value, t);
    }
  },
  computed: {
    attrs: function() {
      return x(this.ptmi("root", {
        context: {
          filled: this.$filled,
          disabled: this.disabled
        }
      }), this.formField);
    },
    dataP: function() {
      return P(G({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, W = ["value", "name", "disabled", "aria-invalid", "data-p"];
function X(e, t, n, i, l, a) {
  return p(), f("input", x({
    type: "text",
    class: e.cx("root"),
    value: e.d_value,
    name: e.name,
    disabled: e.disabled,
    "aria-invalid": e.$invalid || void 0,
    "data-p": a.dataP,
    onInput: t[0] || (t[0] = function() {
      return a.onInput && a.onInput.apply(a, arguments);
    })
  }, a.attrs), null, 16, W);
}
I.render = X;
var Y = `
    .p-textarea {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('textarea.color');
        background: dt('textarea.background');
        padding-block: dt('textarea.padding.y');
        padding-inline: dt('textarea.padding.x');
        border: 1px solid dt('textarea.border.color');
        transition:
            background dt('textarea.transition.duration'),
            color dt('textarea.transition.duration'),
            border-color dt('textarea.transition.duration'),
            outline-color dt('textarea.transition.duration'),
            box-shadow dt('textarea.transition.duration');
        appearance: none;
        border-radius: dt('textarea.border.radius');
        outline-color: transparent;
        box-shadow: dt('textarea.shadow');
    }

    .p-textarea:enabled:hover {
        border-color: dt('textarea.hover.border.color');
    }

    .p-textarea:enabled:focus {
        border-color: dt('textarea.focus.border.color');
        box-shadow: dt('textarea.focus.ring.shadow');
        outline: dt('textarea.focus.ring.width') dt('textarea.focus.ring.style') dt('textarea.focus.ring.color');
        outline-offset: dt('textarea.focus.ring.offset');
    }

    .p-textarea.p-invalid {
        border-color: dt('textarea.invalid.border.color');
    }

    .p-textarea.p-variant-filled {
        background: dt('textarea.filled.background');
    }

    .p-textarea.p-variant-filled:enabled:hover {
        background: dt('textarea.filled.hover.background');
    }

    .p-textarea.p-variant-filled:enabled:focus {
        background: dt('textarea.filled.focus.background');
    }

    .p-textarea:disabled {
        opacity: 1;
        background: dt('textarea.disabled.background');
        color: dt('textarea.disabled.color');
    }

    .p-textarea::placeholder {
        color: dt('textarea.placeholder.color');
    }

    .p-textarea.p-invalid::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }

    .p-textarea-fluid {
        width: 100%;
    }

    .p-textarea-resizable {
        overflow: hidden;
        resize: none;
    }

    .p-textarea-sm {
        font-size: dt('textarea.sm.font.size');
        padding-block: dt('textarea.sm.padding.y');
        padding-inline: dt('textarea.sm.padding.x');
    }

    .p-textarea-lg {
        font-size: dt('textarea.lg.font.size');
        padding-block: dt('textarea.lg.padding.y');
        padding-inline: dt('textarea.lg.padding.x');
    }
`, Z = {
  root: function(t) {
    var n = t.instance, i = t.props;
    return ["p-textarea p-component", {
      "p-filled": n.$filled,
      "p-textarea-resizable ": i.autoResize,
      "p-textarea-sm p-inputfield-sm": i.size === "small",
      "p-textarea-lg p-inputfield-lg": i.size === "large",
      "p-invalid": n.$invalid,
      "p-variant-filled": n.$variant === "filled",
      "p-textarea-fluid": n.$fluid
    }];
  }
}, tt = S.extend({
  name: "textarea",
  style: Y,
  classes: Z
}), et = {
  name: "BaseTextarea",
  extends: N,
  props: {
    autoResize: Boolean
  },
  style: tt,
  provide: function() {
    return {
      $pcTextarea: this,
      $parentInstance: this
    };
  }
};
function m(e) {
  "@babel/helpers - typeof";
  return m = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, m(e);
}
function nt(e, t, n) {
  return (t = it(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function it(e) {
  var t = rt(e, "string");
  return m(t) == "symbol" ? t : t + "";
}
function rt(e, t) {
  if (m(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (m(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var C = {
  name: "Textarea",
  extends: et,
  inheritAttrs: !1,
  observer: null,
  mounted: function() {
    var t = this;
    this.autoResize && (this.observer = new ResizeObserver(function() {
      requestAnimationFrame(function() {
        t.resize();
      });
    }), this.observer.observe(this.$el));
  },
  updated: function() {
    this.autoResize && this.resize();
  },
  beforeUnmount: function() {
    this.observer && this.observer.disconnect();
  },
  methods: {
    resize: function() {
      if (this.$el.offsetParent) {
        var t = this.$el.style.height, n = parseInt(t) || 0, i = this.$el.scrollHeight, l = !n || i > n, a = n && i < n;
        a ? (this.$el.style.height = "auto", this.$el.style.height = "".concat(this.$el.scrollHeight, "px")) : l && (this.$el.style.height = "".concat(i, "px"));
      }
    },
    onInput: function(t) {
      this.autoResize && this.resize(), this.writeValue(t.target.value, t);
    }
  },
  computed: {
    attrs: function() {
      return x(this.ptmi("root", {
        context: {
          filled: this.$filled,
          disabled: this.disabled
        }
      }), this.formField);
    },
    dataP: function() {
      return P(nt({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, at = ["value", "name", "disabled", "aria-invalid", "data-p"];
function ot(e, t, n, i, l, a) {
  return p(), f("textarea", x({
    class: e.cx("root"),
    value: e.d_value,
    name: e.name,
    disabled: e.disabled,
    "aria-invalid": e.invalid || void 0,
    "data-p": a.dataP,
    onInput: t[0] || (t[0] = function() {
      return a.onInput && a.onInput.apply(a, arguments);
    })
  }, a.attrs), null, 16, at);
}
C.render = ot;
const lt = { class: "create-summary" }, dt = {
  key: 0,
  role: "alert",
  class: "error"
}, ut = {
  key: 1,
  class: "row"
}, ft = /* @__PURE__ */ T({
  __name: "CreateForm",
  props: {
    saving: { type: Boolean },
    error: {},
    inPopup: { type: Boolean }
  },
  emits: ["submit"],
  setup(e, { expose: t, emit: n }) {
    const i = R(), l = Object.keys(k).filter((d) => H(i, d)).map((d) => k[d]).join(", "), a = D(i.stages.extract.model), B = i.retrieval.search_mode.replace(/^\w/, (d) => d.toUpperCase()), E = e, j = n, s = g(""), b = g(""), v = g("");
    function F() {
      if (!E.saving) {
        if (!s.value.trim()) {
          v.value = "Name is required.";
          return;
        }
        v.value = "", j("submit", { title: s.value.trim(), description: b.value.trim() });
      }
    }
    return t({ submit: F }), (d, r) => (p(), f("form", {
      class: "create-pane",
      onSubmit: _(F, ["prevent"])
    }, [
      r[10] || (r[10] = o("header", null, [
        o("h2", null, "New extractor")
      ], -1)),
      o("label", null, [
        r[2] || (r[2] = w("Name", -1)),
        y(u(I), {
          modelValue: s.value,
          "onUpdate:modelValue": r[0] || (r[0] = ($) => s.value = $),
          autofocus: "",
          placeholder: "Invoice reader",
          maxlength: "200"
        }, null, 8, ["modelValue"])
      ]),
      o("label", null, [
        r[3] || (r[3] = w("Description", -1)),
        y(u(C), {
          modelValue: b.value,
          "onUpdate:modelValue": r[1] || (r[1] = ($) => b.value = $),
          rows: "3",
          placeholder: "Optional",
          maxlength: "4000"
        }, null, 8, ["modelValue"])
      ]),
      o("div", lt, [
        r[9] || (r[9] = o("h2", null, "Configuration", -1)),
        o("dl", null, [
          r[4] || (r[4] = o("dt", null, "Fields", -1)),
          r[5] || (r[5] = o("dd", null, "None", -1)),
          r[6] || (r[6] = o("dt", null, "Reading steps", -1)),
          o("dd", null, h(u(l)), 1),
          r[7] || (r[7] = o("dt", null, "Extraction model", -1)),
          o("dd", null, h(u(a)), 1),
          r[8] || (r[8] = o("dt", null, "Search", -1)),
          o("dd", null, h(u(B)), 1)
        ])
      ]),
      e.error || v.value ? (p(), f("p", dt, h(e.error || v.value), 1)) : V("", !0),
      e.inPopup ? V("", !0) : (p(), f("footer", ut, [
        y(u(U), {
          label: "Create extractor",
          type: "submit",
          loading: e.saving,
          disabled: !s.value.trim()
        }, null, 8, ["loading", "disabled"])
      ]))
    ], 32));
  }
});
export {
  ft as _
};
